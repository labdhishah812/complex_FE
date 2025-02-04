import components from '../..';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment-timezone';
import CountUp from 'react-countup';
// import jwtDecode from 'jwt-decode';
import MaintenanceSubList from './MaintenanceSubList';
import Loader from '../../../../components/Loader';
import { monthlyMaintenanceUserWise, monthlyMaintenanceCreate, checkPaymentCall, imageUploadPayment, getAllCollectedAmountReaquest } from '../../../../redux/slice/AdminSlices/maintenanceSlice';
import CheckPaymentModel from './checkPayment';
import DeleteModal from '../../../../components/DeleteModal';
import { getBlockDropdownRequest } from '../../../../redux/slice/AdminSlices/blockSlice';
import { getVehicleUserPropertyList } from '../../../../redux/slice/AdminSlices/blockSlice';
import paper from '../../../../assets/images/No-data-pana.svg';
import { useLocation } from 'react-router-dom';
import * as ExcelJS from 'exceljs'
const MaintenanceList = () => {
    const { Dialog, RadioButton, Image, InputText, Checkbox, InputTextarea, InputSwitch, SelectButton, Dropdown, Button, Column, DataTable, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } =
        components;
    const { monthlyMaintenanceUserWiseData, isGenerated, isLoading, isOfflinePayment, isImageUploaded, allCollectedAmount } = useSelector((state) => state.maintenance);
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { blockDropdownData, vehicleUserProperty } = useSelector((store) => store.block);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState([]);
    const [decode, setDecode] = useState(null);
    const [isPdfLoding, setIsPdfLoading] = useState(false);
    const [generateDisable, setGenerateDisable] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'property_number', order: 1 }]);
    const [maintenance_paid_year, setMaintenance_paid_year] = useState(null);
    const [maintenance_paid_month, setMaintenance_paid_month] = useState(null);
    const [maintenance_paid_statusOptions, set_maintenance_paid_statusOptions] = useState(['All', 'Paid', 'Unpaid']);
    const location = useLocation();
    const [maintenance_paid_status, setMaintenance_paid_status] = useState('All');
    // const [maintenance_paid_status, setMaintenance_paid_status] = useState(
    //     location.state?.fromViewList === 'All' ? 'All' : ''
    // );
    const [isCheckPayment, setCheckPayment] = useState(false);
    const [casePayment, setCasePayment] = useState(false);
    const [collectPaymentDetails, setColloectPaymentDetails] = useState(null);
    const [uploadDetails, setUploadDetails] = useState(null);
    const [cashRemark, setCashRemark] = useState('');
    const [multipleTableData, setMultipleTableData] = useState([]);
    const [uploadImg, setuploadImg] = useState({
        file: null,
        showFile: ''
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        maintenance_paid_year: '',
        maintenance_paid_month: '',
        property_assign_id: '',
        property_block: null,
        search: '',
        maintenance_paid_status: 0
    });
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    // const generateFinancialYears = (startYear, endYear) => {
    //     const years = [];
    //     for (let year = startYear; year <= endYear; year++) {
    //         const financialYear = `${year}-${year + 1}`;
    //         years.push({ label: financialYear, maintenance_paid_year: financialYear });
    //     }
    //     return years;
    // };
    const generateFinancialYears = () => {
        const currentDate = new Date();
        // const currentMonth = "March";
        const currentMonth = currentDate.getMonth(); // 0-11 where 0 is January
        const currentYear = currentDate.getFullYear();

        // If we're in January-March, we're still in previous year's fiscal year
        // e.g., January 2025 is still in fiscal year 2024-2025
        const adjustedCurrentYear = currentMonth < 3 ? currentYear - 1 : currentYear;

        // Generate years starting from 2024 up to adjusted current year
        const years = [];
        for (let year = 2024; year <= adjustedCurrentYear; year++) {
            const financialYear = `${year}-${year + 1}`; // Changed to full year format
            years.push({
                label: financialYear,
                maintenance_paid_year: financialYear
            });
        }
        return years;
    };
    const allYears = generateFinancialYears(2024, new Date().getFullYear());
    const months = [
        { value: 'January' },
        { value: 'February' },
        { value: 'March' },
        { value: 'April' },
        { value: 'May' },
        { value: 'June' },
        { value: 'July' },
        { value: 'August' },
        { value: 'September' },
        { value: 'October' },
        { value: 'November' },
        { value: 'December' }
    ];
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Maintenances List'
        }
    ];
    const getTotalAmount = () => {
        if (expandedRows) {
            return expandedRows.reduce((accu, curr) => {
                return accu + (curr.amount || 0);
            }, 0);
        }
        return 0;
    };
    const getTotalMonth = () => {
        if (expandedRows && expandedRows.length > 0) {
            return expandedRows
                .map((row) => row.month)
                .filter(Boolean)
                .join(', ');
        }
        return '';
    };
    // useEffect(() => {
    //     const date = new Date();
    //     date.setMonth(date.getMonth() - 1);
    //     let paginationData = { ...pagination };
    //     paginationData.order_column = multiSortMeta[0]['field'];
    //     paginationData.order_direction = multiSortMeta[0]['order'];
    //     paginationData.maintenance_paid_year = allYears ? allYears[0]?.maintenance_paid_year : '';
    //     if (loginDetails) {
    //         let checkIsUser = loginDetails?.role_permissions.filter((x) => x.role !== 'User');
    //         let checkIsUser1 = loginDetails?.role_permissions.filter((x) => x.role === 'User');
    //         if (checkIsUser.length > 0 && checkIsUser1.length > 0) {
    //             maintenance_paid_statusOptions.unshift('My Dues');
    //             paginationData.maintenance_paid_status = 3;
    //             set_maintenance_paid_statusOptions(maintenance_paid_statusOptions);
    //             setMaintenance_paid_status('My Dues');
    //         }
    //         if (loginDetails.is_block_exist_in_property === true) {
    //             dispatch(getBlockDropdownRequest());
    //         }
    //         dispatch(getVehicleUserPropertyList({ module_name: 'Inner' }));
    //     }
    //     setMaintenance_paid_year(paginationData.maintenance_paid_year);
    //     setPagination(paginationData);
    //     callMonthlyMaintenanceUserWiseList(paginationData);
    // }, [dispatch]);
    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();

        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];

        // Set default year based on fiscal year logic
        const fiscalYears = generateFinancialYears();
        paginationData.maintenance_paid_year = fiscalYears.length > 0 ? fiscalYears[fiscalYears.length - 1].maintenance_paid_year : '';

        if (loginDetails) {
            let checkIsUser = loginDetails?.role_permissions.filter((x) => x.role !== 'User');
            let checkIsUser1 = loginDetails?.role_permissions.filter((x) => x.role === 'User');
            if (checkIsUser.length > 0 && checkIsUser1.length > 0) {
                maintenance_paid_statusOptions.unshift('My Dues');
                paginationData.maintenance_paid_status = 3;
                set_maintenance_paid_statusOptions(maintenance_paid_statusOptions);
                setMaintenance_paid_status('My Dues');
            }
            if (loginDetails.is_block_exist_in_property === true) {
                dispatch(getBlockDropdownRequest());
            }
            dispatch(getVehicleUserPropertyList({ module_name: 'Inner' }));
        }

        setMaintenance_paid_year(paginationData.maintenance_paid_year);
        setPagination(paginationData);
        callMonthlyMaintenanceUserWiseList(paginationData);
    }, [dispatch]);
    useEffect(() => {
        if (isGenerated) {
            callMonthlyMaintenanceUserWiseList(pagination);
        }
    }, [isGenerated]);
    useEffect(() => {
        if (isOfflinePayment || isImageUploaded) {
            setCasePayment(false);
            setCheckPayment(false);
            setCashRemark('');
            setColloectPaymentDetails(null);
            setUploadDetails(null);
            setuploadImg({ file: null, showFile: '' });
            callMonthlyMaintenanceUserWiseList(pagination);
        }
    }, [isOfflinePayment, isImageUploaded]);
    const callMonthlyMaintenanceUserWiseList = (val) => {
        try {
            dispatch(monthlyMaintenanceUserWise(val));
            dispatch(getAllCollectedAmountReaquest({ month: val?.maintenance_paid_month, year: val?.maintenance_paid_year , my_due : val?.maintenance_paid_status === 3 ? true : false}));
        } catch (error) {
            console.log(error);
        }
    };
    const allowExpansion = (rowData) => {
        return true;
    };
    const rowExpansionTemplate = (data) => {
        try {
            console.log(data, 'data of expanded row');
            return (
                <MaintenanceSubList
                    propertyData={data}
                    propertyAssignId={data._id}
                    tableData={data.user_maintenance_data}
                    decode={decode}
                    dataApiCall={() => callMonthlyMaintenanceUserWiseList(pagination)}
                    maintenance_paid_status={maintenance_paid_status}
                    setUploadDetails={(e) => {
                        // let a = data;
                        const filteredData = {
                            ...data, // copy the main object
                            user_maintenance_data: data.user_maintenance_data.filter((item) => item._id === e?._id)
                        };
                        setUploadDetails(filteredData);
                    }}
                    downloadPdfCall={() => downloadPdfCall(data?._id, data?.property_number)}
                />
            );
        } catch (error) {
            console.log(error);
        }
    };
    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        let paginationData = pagination;
        paginationData.current_page = event?.page + 1;
        paginationData.per_page = event?.rows;
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        callMonthlyMaintenanceUserWiseList(paginationData);
    };
    const getRoles = (permissionName, val) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== 'User') : loginDetails?.role_permissions;
                dataColl.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'maintenance')?.module_access.findIndex((y) => y === permissionName);
                    if (check !== undefined && check !== -1 && checkPrmition === false) {
                        checkPrmition = true;
                    }
                });
            }
            return checkPrmition;
        } catch (error) {
            console.log(error);
        }
    };
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    };
    const downloadPdfCall = async (val, val2) => {
        try {
            if (val) {
                setIsPdfLoading(true);
                axios({
                    url: `${BASE_URL_API}/maintenance/maintenance_rate_card/single_user`,
                    method: 'POST', // Change to POST
                    responseType: 'blob', // Important to handle binary data
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        Authorization: token
                    },
                    data: {
                        property_assign_id: val
                    }
                })
                    .then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${val2}-${loginDetails?.property_name} Rate Card-${formatDate(new Date())}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        setIsPdfLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error downloading the file:', error);
                        toast.error(`Something Went Wrong`, {
                            style: {
                                marginTop: '4rem'
                            }
                        });
                        setIsPdfLoading(false);
                    });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const actionBodyForDownLoad = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                <Button
                    tooltip="Rate Cart"
                    disabled={rowData?.user_name === undefined}
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-file"
                    className="p-button-rounded p-button-info p-button-text"
                    id="eyes-icons"
                    onClick={() => {
                        downloadPdfCall(rowData?._id, rowData?.property_number);
                    }}
                />
            </div>
        );
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center p-2 justify-content-center">
                {(getRoles('update', true) && maintenance_paid_status === 'Unpaid') || maintenance_paid_status === 'All' ? (
                    <Button id="rzp-button1" label="Pay Now" icon="pi pi-money-bill" className="p-button-outlined p-button-success" onClick={(e) => setColloectPaymentDetails(rowData)} disabled={rowData?.user_maintenance_data[0].is_paid} />
                ) : (
                    <Button id="rzp-button1" label="Pay Now" icon="pi pi-money-bill" className="p-button-outlined p-button-success" onClick={(e) => paymentHandler(e, rowData)} disabled={rowData?.user_maintenance_data[0].is_paid} />
                )}
            </div>
        );
    };
    const paymentHandler = async (e, rowData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    Authorization: token
                }
            };
            let create_order = await axios.post(`${BASE_URL_API}/maintenance/v2/order`, { _ids: collectedCombinedData(rowData)?.user_maintenance_data.map((x, i) => x._id) }, config);
            let createData = create_order?.data;
            if (createData?.statusCode === 200) {
                var options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
                    amount: createData?.data?.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    currency: 'INR',
                    name: 'Society Maintenance',
                    description: createData?.data?.description,
                    image: 'https://property-management-tt.s3.ap-south-1.amazonaws.com/upload/user-profile/user.png',
                    order_id: createData?.data?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                    handler: async function (response) {
                        let afterCompletionData = await axios.post(
                            `${BASE_URL_API}/maintenance/v2/payment-verify`,
                            {
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                user_property_assign_id: createData?.data?.user_property_assign_id,
                                original_amount: createData?.data?.original_amount
                            },
                            config
                        );
                        let afterSuccessful = afterCompletionData?.data;
                        afterSuccessful?.data && callMonthlyMaintenanceUserWiseList(pagination);
                        afterSuccessful?.data && setColloectPaymentDetails(null);
                        afterSuccessful?.data &&
                            toast.success('Successfully Payment Done', {
                                style: {
                                    marginTop: '4rem'
                                }
                            });
                    },
                    prefill: {
                        name: createData?.data?.name,
                        email: createData?.data?.email,
                        contact: createData?.data?.contact
                    },
                    notes: {
                        address: 'Razorpay Corporate Office'
                    },
                    theme: {
                        color: '#3399cc'
                    },
                    config: {
                        display: {
                            hide: [{ method: 'upi' }, { method: 'wallet' }, { method: 'paylater' }],
                            preferences: {
                                show_default_blocks: true
                            }
                        }
                    }
                };
                var rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    alert(response.error.code);
                    alert(response.error.description);
                    alert(response.error.source);
                    alert(response.error.step);
                    alert(response.error.reason);
                    alert(response.error.metadata.order_id);
                    alert(response.error.metadata.payment_id);
                });
                rzp1.open();
                e.preventDefault();
            }
        } catch (error) {
            console.log(error);
        }
    };
    const template = {
        layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink CurrentPageReport',
        CurrentPageReport: (options) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            );
        }
    };
    const deleteUserDialogFooter = () => {
        try {
            return (
                <>
                    <Button
                        label="Yes"
                        icon="pi pi-check"
                        className="p-button-outlined p-button-success mr-2 mb-2"
                        onClick={() => {
                            try {
                                // Create FormData to handle file upload
                                const formData = new FormData();

                                // Append text data
                                const userData = collectedCombinedData(collectPaymentDetails);
                                formData.append('user_property_assign_id', userData?._id);

                                // Prepare maintainance_ids
                                const maintainanceIds = userData?.user_maintenance_data.map((x) => x._id) || [];
                                formData.append('maintainance_ids', JSON.stringify(maintainanceIds));

                                // Append other form data
                                formData.append('payment_type', 'cash');
                                formData.append('original_amount', totalPayment(multipleTableData).toString());
                                formData.append('remark', cashRemark);

                                // Append file specifically as 'receipt'
                                if (uploadImg?.file) {
                                    formData.append('receipt', uploadImg.file, uploadImg.file.name);
                                }

                                // Log FormData contents before dispatch
                                for (let pair of formData.entries()) {
                                    console.log(pair[0] + ': ', pair[1]);
                                }

                                // Dispatch action with FormData
                                dispatch(checkPaymentCall(formData));

                                // Reset states after dispatch
                                setCasePayment(false);
                                setCashRemark('');
                                setuploadImg({ file: null, showFile: '' });
                            } catch (error) {
                                console.error('Error creating FormData or dispatching action:', error);
                            }
                        }}
                    />
                </>
            );
        } catch (error) {
            console.error('Error in deleteUserDialogFooter:', error);
        }
    };
    const handleUpload = async (event) => {
        try {
            const str = event.target.files[0]?.name;
            const substr = ['.jpg', '.jpeg', '.png'];
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                setuploadImg({ file: event.target.files[0], showFile: URL.createObjectURL(event.target.files[0]) });
                // setFieldValue('file', event.target.files[0]);
                // setShowFile(URL.createObjectURL(event.target.files[0]));
            } else {
                toast.error('Only Accept png , jpeg, jpg', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const setMonth = (val) => {
        try {
            const currentYear = new Date().getFullYear();
            if (val === currentYear.toString()) {
                const currentMonthIndex = new Date().getMonth();
                const filteredMonths = months.slice(0, currentMonthIndex + 1);
                return filteredMonths;
            } else {
                return months;
            }
        } catch (error) {
            console.log(error);
        }
    };
    const totalPayment = (val) => {
        console.log(val, 'value from list');
        try {
            const totalAmount = val.reduce((sum, item) => sum + item.user_maintenance_data[0].amount, 0);
            return totalAmount;
        } catch (error) {
            console.log(error);
        }
    };
    const maintenanceDataConvert = (data) => {
        try {
            const convertedData = data[0].user_maintenance_data
                .filter((maintenance) => maintenance?.is_paid === false)
                .map((maintenance, i) => ({
                    _id: data[0]._id,
                    property_id: data[0].property_id,
                    property_number: data[0].property_number,
                    total_pending_amount: data[0].total_pending_amount,
                    owner_id: data[0].owner_id,
                    user_name: data[0].user_name,
                    created_at: data[0].created_at,
                    email: data[0].email,
                    mobile_number: data[0].mobile_number,
                    monthNo: i + 1,
                    user_maintenance_data: [maintenance]
                }));
            return convertedData;
        } catch (error) {
            console.log(error);
        }
    };
    const collectedCombinedData = (collectPaymentDetails) => {
        try {
            let data = {
                _id: collectPaymentDetails[0]?._id,
                property_id: collectPaymentDetails[0]?.property_id,
                property_number: collectPaymentDetails[0]?.property_number,
                total_pending_amount: collectPaymentDetails[0]?.total_pending_amount,
                owner_id: collectPaymentDetails[0]?.owner_id,
                user_name: collectPaymentDetails[0]?.user_name,
                created_at: collectPaymentDetails[0]?.created_at,
                monthNo: collectPaymentDetails[0]?.monthNo,
                user_maintenance_data: []
            };
            collectPaymentDetails.forEach((a, i) => {
                data.user_maintenance_data.push(a.user_maintenance_data[0]);
            });
            return data;
        } catch (error) {}
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading || isPdfLoding} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Maintenance List</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="md:col-12 card mt-2">
                    <div className="flex align-items-center mb-3">
                        <div className="mt-2">
                            <div className="w-full flex align-items-center border-round">
                                <div className="flex">
                                    <div className="pr-2">
                                        <div className="text-md text-700 mb-2 font-semibold">
                                            {loginDetails?.role_permissions.filter((x) => x.role !== 'User').length === 0 ? 'Paid Maintenance Amount' : 'Collected Maintenance Amount'} <span className="ml-2">/</span>
                                        </div>
                                        <CountUp duration={2} prefix="₹ " className="text-4xl font-semibold" end={allCollectedAmount?.totalPaidAmount ? allCollectedAmount?.totalPaidAmount : 0} />
                                    </div>
                                    <div className="pl-2">
                                        <div className="text-md text-700 mb-2 font-semibold">Due Maintenance Amount</div>
                                        <CountUp duration={2} prefix="₹ " className="text-4xl font-semibold" end={allCollectedAmount?.totalDueAmount ? allCollectedAmount?.totalDueAmount : 0} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='p-button-outlined p-button-success mr-2 my-3 m-auto'>
                        <Button
                                        disabled={MaintenanceList?.totalRecords === 0}
                                        label="Export"
                                        icon="pi pi-download"
                                       className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                                        onClick={async () => {
                                            const { data } = await axios.post(`${BASE_URL_API}/maintenance/excel`, pagination, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Access-Control-Allow-Origin': '*',
                                                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                                    Authorization: token
                                                }
                                            });
                                            let dData = data?.data;
                                            const chains = dData?.map((e) => 
                                                e.user_maintenance_data.map((maintenance) => ({
                                                property_number: e.property_number,
                                                total_pending_amount: e.total_pending_amount,
                                                month: maintenance.month,
                                                amount: maintenance.amount,
                                                year: maintenance.year,
                                                receipt_id: maintenance.receipt_id,
                                                is_paid: maintenance.is_paid === true ? 'Paid' : 'Unpaid',
                                                owner_name: e.user_name,
                                                owner_email: e.email,
                                                mobile_number: e.mobile_number,
                                                created_at: moment(maintenance.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                                updated_at: moment(maintenance.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                            })));
                                            // if(data)
                                            if (chains && chains.length > 0) {
                                            const workbook = new ExcelJS.Workbook();
                                            const worksheet = workbook.addWorksheet('Maintenance List');
                                            const headerRow = worksheet.addRow(['property number', 'total amount', 'Month' , 'Amount' , 'Year' ,'Receipt ID' ,'Payment Status' ,  'Owner Name' , 'Owner Email' , 'Mobile Number' , 'Created Date' , 'Updated Date']);
                                         
                                            headerRow.eachCell((cell, number) => {
                                                cell.fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: 'e4e4e4' }
                                                };
                                                cell.font = {
                                                    color: { argb: '212121' },
                                                    bold: true
                                                };
                                            });
                                   

                                            let flatData = chains.flat()
                                            flatData.forEach((report) => {
                                                const row = worksheet.addRow([
                                                    // {
                                                        //     text: report.property_logo.text,
                                                        //     hyperlink: report.property_logo.hyperlink,
                                                        //     tooltip: report.property_logo.tooltip
                                                    // },
                                                    report.property_number,
                                                    report.total_pending_amount,
                                                    report.month,
                                                    report.amount,
                                                    report.year,
                                                    report.receipt_id,
                                                    report.is_paid,
                                                    report.owner_name,
                                                    report.owner_email,
                                                    report.mobile_number,
                                                    report.created_at,
                                                    report.updated_at,
                                                    // report.property_status
                                                ]);

                                                const isPaidCell = row.getCell(7);
                                                if (report.is_paid === 'Paid') {
                                                    // Green color for "Paid"
                                                    isPaidCell.font = {
                                                        color: { argb: '689f38' }, // Green text
                                                        bold: true
                                                    };
                                                } else {
                                                    // Red color for "Unpaid"
                                                    isPaidCell.font = {
                                                        color: { argb: 'd32f2f' }, // Red text
                                                        bold: true
                                                    };
                                                }
                                                // You can apply additional styling here if needed
                                            });
                                            workbook.xlsx
                                                .writeBuffer()
                                                .then((buffer) => {
                                                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = 'maintenance_list.xlsx';
                                                    a.click();
                                                    window.URL.revokeObjectURL(url);
                                                })
                                                .catch((err) => {
                                                    console.error('Error generating Excel file:', err);
                                                });
                                            }
                                        }}

                                    />
                        {loginDetails?.role_permissions.find((x) => x.role === 'Chairman' || x.role === 'Manager') && (
                            <Button
                                disabled={generateDisable}
                                label="Generate Financial Year Maintenance"
                                icon="pi pi-undo"
                                className="p-button-outlined p-button-success mr-2 my-3 m-auto"
                                onClick={() => {
                                    dispatch(monthlyMaintenanceCreate());
                                    setGenerateDisable(true);
                                    setTimeout(() => {
                                        setGenerateDisable(false);
                                    }, 5000);
                                }}
                            />
                        )}
                        </div>
                    </div>
                    <div className={`grid p-fluid ${loginDetails?.role_permissions.find((x) => x.role === 'Chairman') ? '' : 'mt-5'}`}>
                        {loginDetails.is_block_exist_in_property === true && (
                            <div className="col-12 sm:col-6 md:col-2 mb-1">
                                <Dropdown
                                    id="block_select"
                                    optionLabel="label"
                                    optionValue="block_id"
                                    options={blockDropdownData}
                                    name="block_select"
                                    placeholder="Select Block"
                                    type="text"
                                    showClear
                                    value={pagination?.property_block}
                                    onChange={(e) => {
                                        let paginationData = { ...pagination };
                                        paginationData.property_block = e.value === undefined ? null : e.value;
                                        callMonthlyMaintenanceUserWiseList(paginationData);
                                        setPagination(paginationData);
                                    }}
                                />
                            </div>
                        )}
                        <div className="col-12 sm:col-6 md:col-2 mb-1">
                            <Dropdown
                                id="yearSelect"
                                optionLabel="label"
                                optionValue="maintenance_paid_year"
                                options={allYears.reverse()}
                                name="yearSelect"
                                placeholder="Select Year"
                                type="text"
                                value={maintenance_paid_year}
                                onChange={(e) => {
                                    const date = new Date();
                                    date.setMonth(date.getMonth() - 1);
                                    let paginationData = { ...pagination };
                                    paginationData.maintenance_paid_year = e.value === undefined ? '' : e.value;
                                    callMonthlyMaintenanceUserWiseList(paginationData);
                                    setPagination(paginationData);
                                    setMaintenance_paid_year(e.value === undefined ? null : e.value);
                                }}
                            />
                        </div>
                        <div className="col-12 sm:col-6 md:col-2 mb-1">
                            <Dropdown
                                id="property_assign_id"
                                optionLabel="label"
                                optionValue="property_assign_id"
                                options={vehicleUserProperty ? vehicleUserProperty : []}
                                name="property_assign_id"
                                placeholder="Select Owner Name"
                                type="text"
                                value={pagination?.property_assign_id}
                                onChange={(e) => {
                                    let paginationData = { ...pagination };
                                    paginationData.property_assign_id = e.value === undefined ? '' : e.value;
                                    paginationData.per_page = e.value === undefined ? 10 : 12;
                                    callMonthlyMaintenanceUserWiseList(paginationData);
                                    setPagination(paginationData);
                                    setExpandedRows(null);
                                    setMultipleTableData([]);
                                }}
                                filter
                                showClear={pagination?.property_assign_id !== ''}
                            />
                        </div>
                        <div className={`col-12 sm:col-6 md:col-4 xl:col-4 mb-1 flex align-items-start maintenance_p_button`} style={{ width: 'fit-content' }}>
                            <SelectButton
                                value={maintenance_paid_status}
                                onChange={(e) => {
                                    let paginationData = { ...pagination };
                                    if (e.value !== null) {
                                        paginationData.maintenance_paid_status = e.value === 'Paid' ? 1 : e.value === 'Unpaid' ? 2 : e.value === 'My Dues' ? 3 : 0;
                                        paginationData.current_page = 1;
                                        setExpandedRows(null);
                                        setMultipleTableData([]);
                                        callMonthlyMaintenanceUserWiseList(paginationData);
                                        setPagination(paginationData);
                                        e.value !== null && setMaintenance_paid_status(e.value);
                                    }
                                }}
                                options={maintenance_paid_statusOptions}
                                className="w-20rem"
                            />
                            <button
                                aria-label="Clear"
                                className={`p-button p-component p-button-outlined w-7rem ml-2 ${
                                    !pagination?.property_block && !pagination?.maintenance_paid_year && !pagination?.property_assign_id && maintenance_paid_status === null ? 'p-disabled' : ''
                                }`}
                                disabled={!pagination?.property_block && !pagination?.maintenance_paid_year && !pagination?.property_assign_id && maintenance_paid_status === null}
                                // onClick={() => {
                                //     let resetPagination = {
                                //         ...pagination,
                                //         property_block: null,
                                //         maintenance_paid_year: '',
                                //         property_assign_id: '',
                                //         maintenance_paid_status: 0 // This is already correct for "All"
                                //     };
                                //     setPagination(resetPagination);
                                //     setMaintenance_paid_year(null);
                                //     setMaintenance_paid_status('All'); // Changed from null to "All"
                                //     setExpandedRows(null);
                                //     setMultipleTableData([]);
                                //     callMonthlyMaintenanceUserWiseList(resetPagination);
                                // }}
                                onClick={() => {
                                    // Determine the current financial year using generateFinancialYears logic
                                    const currentDate = new Date();
                                    const currentMonth = currentDate.getMonth(); // 0-11 where 0 is January
                                    const currentYear = currentDate.getFullYear();
                                    const adjustedCurrentYear = currentMonth < 3 ? currentYear - 1 : currentYear; // Fiscal year adjustment
                                    const defaultYear = `${adjustedCurrentYear}-${adjustedCurrentYear + 1}`; // Current financial year

                                    console.log(`Current financial year: ${defaultYear}`);

                                    let resetPagination = {
                                        ...pagination,
                                        property_block: null,
                                        maintenance_paid_year: defaultYear, // Set to current financial year
                                        property_assign_id: '',
                                        maintenance_paid_status: 0
                                    };

                                    setPagination(resetPagination);
                                    setMaintenance_paid_year(defaultYear); // Set to current financial year
                                    setMaintenance_paid_status('All');
                                    setExpandedRows(null);
                                    setMultipleTableData([]);
                                    callMonthlyMaintenanceUserWiseList(resetPagination);
                                }}

                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <span className="p-button-label p-c" data-pc-section="label">
                                    Clear
                                </span>
                                <span role="presentation" className="p-ink"></span>
                            </button>
                        </div>
                    </div>
                    {monthlyMaintenanceUserWiseData?.data?.user_assign_property_listing && monthlyMaintenanceUserWiseData?.data?.user_assign_property_listing.length > 0 ? (
                        <DataTable
                            value={
                                (maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'All' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== ''
                                    ? maintenanceDataConvert(monthlyMaintenanceUserWiseData?.data?.user_assign_property_listing)
                                    : monthlyMaintenanceUserWiseData?.data?.user_assign_property_listing
                            }
                            expandedRows={expandedRows}
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            rowExpansionTemplate={rowExpansionTemplate}
                            emptyMessage="Already Paid Maintenance."
                            scroll="scroll"
                            sortMode="multiple"
                            footer={
                                multipleTableData.length > 0 ? (
                                    <div className="flex align-items-center">
                                        <div className="">
                                            {' '}
                                            {'Total Amount :- '}
                                            {totalPayment(multipleTableData)}
                                        </div>
                                        <div className="ml-auto">
                                            {' '}
                                            {(getRoles('update', true) && maintenance_paid_status === 'Unpaid') || maintenance_paid_status === 'All' ? (
                                                <Button id="rzp-button1" label="Pay Now" icon="pi pi-money-bill" className="p-button-outlined p-button-success" onClick={(e) => setColloectPaymentDetails(multipleTableData)} />
                                            ) : (
                                                <Button id="rzp-button1" label="Pay Now" icon="pi pi-money-bill" className="p-button-outlined p-button-success" onClick={(e) => paymentHandler(e, multipleTableData)} />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    false
                                )
                            }
                            showGridlines
                            stripedRows
                            size="large"
                            onSort={(e) => {
                                let paginationData = { ...pagination };
                                paginationData.order_column = e.multiSortMeta[0]['field'];
                                paginationData.order_direction = e.multiSortMeta[0]['order'];
                                setPagination(paginationData);
                                setMultiSortMeta(e.multiSortMeta);
                                callMonthlyMaintenanceUserWiseList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                            selection={multipleTableData}
                            onSelectionChange={(e) => {
                                let sortData = e.value.sort((a, b) => a.monthNo - b.monthNo);
                                let check = 0;
                                let flag = true;
                                sortData.forEach((a) => {
                                    if (check === 0) {
                                        check = a.monthNo;
                                    } else if (check + 1 === a.monthNo) {
                                        check = a.monthNo;
                                    }
                                    // else {
                                    //     flag = false;
                                    //     toast.error("You can't select before last month.", {
                                    //         style: {
                                    //             marginTop: '4rem'
                                    //         }
                                    //     });
                                    // }
                                });
                                flag && setMultipleTableData(e.value);
                            }}
                        >
                            {isCheckPayment && (
                                <CheckPaymentModel
                                    onHide={() => setCheckPayment(false)}
                                    collectPaymentDetails={collectPaymentDetails}
                                    propertyData={monthlyMaintenanceUserWiseData?.data?.user_assign_property_listing.find((item) => item._id === expandedRows?._id) || {}}
                                    propertyAssignId={expandedRows?._id}
                                    tableData={expandedRows?.user_maintenance_data || []}
                                    decode={decode}
                                    dataApiCall={() => callMonthlyMaintenanceUserWiseList(pagination)}
                                    maintenance_paid_status={maintenance_paid_status}
                                    setUploadDetails={(e) => {
                                        if (expandedRows) {
                                            const filteredData = {
                                                ...expandedRows,
                                                user_maintenance_data: expandedRows.user_maintenance_data.filter((item) => item._id === e?._id)
                                            };
                                            setUploadDetails(filteredData);
                                        }
                                    }}
                                    downloadPdfCall={() => expandedRows && downloadPdfCall(expandedRows?._id, expandedRows?.property_number)}
                                />
                            )}
                            {(maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'All' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== '' ? null : (
                                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                            )}
                            {/* {(maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'All' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== '' ? null : (
                                <Column
                                    expander={allowExpansion}
                                    style={{ width: '5rem' }}
                                    body={(rowData) => {
                                        return (
                                            <div
                                                onClick={() => {
                                                    let paginationData = { ...pagination };
                                                    paginationData.property_assign_id = rowData._id === undefined ? '' : rowData._id;
                                                    paginationData.per_page = rowData._id === undefined ? 10 : 12;
                                                    callMonthlyMaintenanceUserWiseList(paginationData);
                                                    setPagination(paginationData);
                                                    setExpandedRows(null);
                                                    setMultipleTableData([]);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {allowExpansion(rowData) && <i className="pi pi-chevron-right"></i>}
                                            </div>
                                        );
                                    }}
                                />
                            )} */}
                            {(maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'All' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== '' && (
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            )}
                            <Column
                                field="property_number"
                                header="Property No."
                                className="headerCellCenter"
                                body={(rowData) => <div className="text-center">{rowData?.property_number}</div>}
                                sortable={(maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== '' ? false : true}
                                headerStyle={{ width: '3%', minWidth: '10rem' }}
                            ></Column>
                            <Column
                                field="user_name"
                                className="capitalize"
                                header="Name"
                                body={(rowData) =>
                                    rowData?.user_name ? (
                                        <a
                                            href={`${BASE_URL_API}property-management/property-assign/${rowData._id}`}
                                            className=" hover:underline"
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent default navigation
                                                navigate(`/property-management/property-assign/${rowData._id}`);
                                            }}
                                        >
                                            {rowData.user_name}
                                        </a>
                                    ) : (
                                        'Property not assigned'
                                    )
                                }
                                sortable={(maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== '' ? false : true}
                            />
                            <Column field="email" header="Email" body={(rowData) => <a href={`mailto:${rowData?.email}`}>{rowData?.email}</a>}></Column>
                            <Column
                                field="mobile_number"
                                header="Mobile No."
                                className="headerCellEnd"
                                body={(rowData) => (
                                    <div className="text-right">
                                        <a href={`tel:${rowData?.mobile_number}`} className='hover:underline'>{rowData?.mobile_number}</a>
                                    </div>
                                )}
                            ></Column>
                            {(maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'All' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== '' ? null : (
                                <Column
                                    field="total_pending_amount"
                                    header="Pending Amount (₹)"
                                    className="headerCellEnd"
                                    body={(rowData) => (
                                        <div className="text-right">
                                            {rowData?.total_pending_amount !== 0 ? `₹ ${new Intl.NumberFormat('en-IN').format(rowData.total_pending_amount)}` : <span style={{ color: 'green', fontWeight: 'bold' }}>No Outstanding</span>}
                                        </div>
                                    )}
                                ></Column>
                            )}
                            {(maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'All' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== '' && (
                                <Column header={'Month'} className="headerCellCenter" body={(rowData) => <div className="text-center">{rowData?.user_maintenance_data[0]?.month}</div>}></Column>
                            )}
                            {(maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'All' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== '' && (
                                <Column
                                    header={maintenance_paid_status === 'Unpaid' ? 'Pay Amount(₹)' : maintenance_paid_status === 'Paid' ? 'Paid Amount(₹)' : 'Amount(₹)'}
                                    className="headerCellEnd"
                                    body={(rowData) => <div className="text-right">{new Intl.NumberFormat('en-IN').format(rowData?.user_maintenance_data[0].amount)}</div>}
                                ></Column>
                            )}
                            {(maintenance_paid_status === 'Unpaid' || maintenance_paid_status === 'All' || maintenance_paid_status === 'My Dues') && pagination.property_assign_id !== '' && (
                                <Column
                                    header="Status"
                                    body={(rowData) => <div style={{ color: `${rowData?.user_maintenance_data[0]?.is_paid ? '#689f38' : '#d32f2f'}` }}>{rowData?.user_maintenance_data[0]?.is_paid === false ? 'Unpaid' : 'Paid'}</div>}
                                ></Column>
                            )}
                            <Column header="Rate card" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyForDownLoad}></Column>
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">
                                        {monthlyMaintenanceUserWiseData?.data?.user_assign_property_listing && monthlyMaintenanceUserWiseData?.data?.user_assign_property_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}
                                    </div>
                                    {monthlyMaintenanceUserWiseData?.data?.user_assign_property_listing && monthlyMaintenanceUserWiseData?.data?.user_assign_property_listing.length === 0 && (
                                        <div className="text-center text-2xl">{'No Record Found.'}</div>
                                    )}
                                </>
                            )}
                            value={[]}
                        ></DataTable>
                    )}
                    {monthlyMaintenanceUserWiseData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={monthlyMaintenanceUserWiseData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
                    )}
                </div>
            </div>
            {casePayment === false && isCheckPayment === false && (
                <Dialog draggable={false} visible={collectPaymentDetails !== null} style={{ width: '40vw' }} header="Payment Method" modal className="p-fluid" onHide={() => setColloectPaymentDetails(null)}>
                    <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="ingredient1"
                                name="cash"
                                value="Cash"
                                onChange={(e) => {
                                    setCasePayment(true);
                                    setCashRemark('');
                                }}
                                // checked={ingredient === 'Cheese'}
                            />
                            <label htmlFor="ingredient1" className="ml-2">
                                Cash
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="ingredient2"
                                name="cheque"
                                value="Cheque"
                                onChange={(e) => setCheckPayment(true)}
                                // checked={ingredient === 'Mushroom'}
                            />
                            <label htmlFor="ingredient2" className="ml-2">
                                Cheque
                            </label>
                        </div>
                        {/* {loginDetails.role_permissions.filter((x) => x.role !== "Chairman").length > 0 && <div className="flex align-items-center">
                            <RadioButton inputId="ingredient3" name="Online" value="Online"
                                onClick={(e) => paymentHandler(e, collectPaymentDetails)}
                            //  checked={ingredient === 'Pepper'}
                            />
                            <label htmlFor="ingredient3" className="ml-2">Online</label>
                        </div>} */}
                    </div>
                </Dialog>
            )}
            {uploadDetails !== null && (
                <Dialog
                    draggable={false}
                    visible={uploadDetails !== null}
                    header="Image"
                    style={{ width: '40vw' }}
                    modal
                    className="p-fluid"
                    onHide={() => {
                        setUploadDetails(null);
                        setuploadImg({ file: null, showFile: '' });
                    }}
                >
                    <div className="grid p-fluid mt-1">
                        <div className={'field col-12 mb-0  '}>
                            {uploadImg?.file === null && (
                                <div className="file-input-upload">
                                    <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event)} />
                                    <label for="fileInput" className="label">
                                        <span>Upload Image...</span>
                                    </label>
                                </div>
                            )}
                            {uploadImg?.file !== null && (
                                <>
                                    <div className="flex align-items-center">
                                        <Image src={uploadImg?.showFile} alt="Image" width="100" height="100" preview />
                                        <div className="ml-1">
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-rounded p-button-text  p-button-danger"
                                                id="delete-icons"
                                                tooltip="Delete"
                                                tooltipOptions={{ position: 'bottom' }}
                                                onClick={() => {
                                                    setuploadImg({ file: null, showFile: '' });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {uploadImg?.file === null && (
                                <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                    {'*Notice:- Upload a payment screenshot / payment receipt'}
                                </div>
                            )}
                        </div>
                        {uploadImg?.file !== null && (
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button
                                    label={'Submit'}
                                    type="submit"
                                    icon="pi pi-check"
                                    className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                    onClick={() => {
                                        let SendData = {
                                            file: uploadImg?.file,
                                            id: uploadDetails?.user_maintenance_data[0]?._id
                                        };
                                        dispatch(imageUploadPayment(SendData));
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </Dialog>
            )}
            {casePayment && (
                <DeleteModal
                    isOpenDialog={casePayment}
                    modalFooter={() => deleteUserDialogFooter()}
                    hideModal={() => {
                        setCasePayment(false);
                        setCashRemark('');
                    }}
                    hederText="Confirm"
                    text="payment"
                    customUi={() => (
                        <>
                            <div className={`flex align-items-center mt-3`}>
                                <h6>{'You Are Accepting Cash Payment For This Member.'}</h6>
                            </div>
                            <div className="card w-full mt-1">
                                <div className="grid p-fluid mt-1">
                                    <div className="field col-12 mb-0 p-1">
                                        <label className="text-600 mb-0">
                                            Owner Name:- <span className="text-900">{collectedCombinedData(collectPaymentDetails)?.user_name || '-'}</span>
                                        </label>
                                    </div>
                                    <div className="field col-12 mb-0 p-1">
                                        <label className="text-600 mb-0">
                                            Property No.:- <span className="text-900">{collectedCombinedData(collectPaymentDetails)?.property_number || '-'}</span>
                                        </label>
                                    </div>
                                    <div className="field col-12 mb-0 p-1">
                                        <label className="text-600 mb-0">
                                            Amount:- <span className="text-900">{collectedCombinedData(collectPaymentDetails)?.user_maintenance_data[0]?.amount ? `₹${totalPayment(multipleTableData)}` : '-'}</span>
                                        </label>
                                    </div>
                                    <div className="field col-12 mb-0 p-1">
                                        <label className="text-600">
                                            Months:-{' '}
                                            <span className="text-900">
                                                {collectedCombinedData(collectPaymentDetails)?.user_maintenance_data?.map((x, i) => x.month + (collectedCombinedData(collectPaymentDetails)?.user_maintenance_data.length - 1 > i ? ', ' : '')) || '-'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mt-3">
                                <div className="mb-2">
                                    <label htmlFor="remark">Remark</label>
                                </div>
                                <InputTextarea rows="2" id="remark" name="remark" placeholder="Enter Remarks" value={cashRemark} onChange={(e) => setCashRemark(e.target.value)} className="w-full" />
                            </div>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 mb-0">
                                    {uploadImg?.file === null ? (
                                        <div className="file-input-upload">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event)} />
                                            <label htmlFor="fileInput" className="label">
                                                <span>Upload Image...</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex align-items-center">
                                            <Image src={uploadImg?.showFile} alt="Image" width="100" height="100" preview />
                                            <div className="ml-1">
                                                <Button
                                                    icon="pi pi-trash"
                                                    className="p-button-rounded p-button-text p-button-danger"
                                                    id="delete-icons"
                                                    tooltip="Delete"
                                                    tooltipOptions={{ position: 'bottom' }}
                                                    onClick={() => setuploadImg({ file: null, showFile: '' })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {uploadImg?.file === null && (
                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                            {'*Note:- Upload a payment screenshot / payment receipt'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                />
            )}
            {isCheckPayment && <CheckPaymentModel onHide={() => setCheckPayment(false)} collectPaymentDetails={collectPaymentDetails} selectedRows={expandedRows} getTotalMonth={getTotalMonth} getTotalAmount={getTotalAmount} />}
        </div>
    );
};
export default MaintenanceList;
