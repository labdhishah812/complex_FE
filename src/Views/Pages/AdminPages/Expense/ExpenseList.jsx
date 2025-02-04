import axios from 'axios';
import ExcelJS from 'exceljs';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import moment from 'moment-timezone';
import components from '../..';
import { getExpenseData, expenseRemoveRequest, updateExpenseStatus } from '../../../../redux/slice/AdminSlices/expenseSlice';
import { X } from 'lucide-react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

const ExpenseList = () => {
    const { Dialog, SelectButton, RadioButton, Calendar, classNames, Dropdown, Button, Column, DataTable, Image, InputTextarea, InputText, toast, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } =
        components;
    const { token,loginDetails } = useSelector((store) => store.auth);
    const { isLoading, expenseData, isDelete, isCreated } = useSelector((store) => store.expense);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const [numValues, setNumValues] = useState({ num1: 0, num2: 0 });
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [importLoading, setImportLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [statusModal, setStatusModal] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    const [receiptShow, setReceiptShow] = useState(null);
    const [receiptShow2, setReceiptShow2] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [paymentShow, setPaymentShow] = useState(null);
    const [paymentShow2, setPaymentShow2] = useState(null);
    const [formValue, setFormValue] = useState({
        remark: '',
        receipt: null,
        payment_photo: null
    });
    const [formValue2, setFormValue2] = useState({
        checkNo: '',
        personName: '',
        branchName: '',
        remark:'',
        chequeDate: '',
        chequeBankName: '',
        receipt2: null,
        payment_photo2: null
    });
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'updated_at', order: -1 }]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        order_column: 'updated_at',
        order_direction: -1,
        per_page: 10,
        search: '',
        listType: 0
    });

    const SignupSchema = Yup.object().shape({
        remark: Yup.string().trim().nullable().required('Please enter remark')
        // checkNo: Yup.string()
        //     .trim()
        //     .nullable()
        //     .matches(/^\d{6,10}$/, 'Check number must be between 6 and 10 digits')
        //     .required('Please enter check number')
    });
    const SignupSchema2 = Yup.object().shape({
        checkNo: Yup.string()
            .trim()
            .nullable()
            .matches(/^\d{6,10}$/, 'Check number must be between 6 and 10 digits')
            .required('Please enter check number'),
        personName: Yup.string().trim().nullable().required('Please enter person name'),
        remark: Yup.string().trim().nullable().required('Please enter remark'),
        branchName: Yup.string().trim().nullable().required('Please enter branch name'),
        chequeBankName: Yup.string().trim().nullable().required('Please enter cheque bank name'),
        chequeDate: Yup.string().trim().nullable().required('Please select cheque date ')
    });
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'Expense'
        }
    ];
    useEffect(() => {
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        setStatusModal(null);
        callExpenseData(paginationData);
    }, [dispatch, isCreated, isDelete]);

    const callExpenseData = (val) => {
        try {
            dispatch(getExpenseData(val));
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
    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        let paginationData = pagination;
        paginationData.current_page = event?.page + 1;
        paginationData.per_page = event?.rows;
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        callExpenseData(paginationData);
    };
    const rightToolbarTemplate = () => {
        return <React.Fragment>
            <Button
                disabled={expenseData?.data?.expense_listing.length === 0}
                label="Export"
                icon="pi pi-download"
                className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                onClick={async () => {
                    const { data } = await axios.post(`${BASE_URL_API}/expense-tracker/excel`, pagination, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                            Authorization: token
                        }
                    });
                    let expenseData = data?.data;

                    if (expenseData && expenseData.length > 0) {
                        const workbook = new ExcelJS.Workbook();
                        const worksheet = workbook.addWorksheet('expenses List');

                        // Updated headers with new fields
                        const headerRow = worksheet.addRow([
                            'Date',
                            'Expense Details',
                            'Category',
                            'Amount',
                            'Status',
                            'Receipt Image',
                            'Added By',
                            'User Mobile',
                            'User Property Status',
                            'Created Date',
                            'Updated Date',
                        ]);

                        // Style header row
                        headerRow.eachCell((cell) => {
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

                        // Add expense data rows
                        expenseData.forEach((expense) => {
                            const row = worksheet.addRow([
                                expense.expense_date || '-',
                                expense.expense_details || '-',
                                expense.expense_category || '-',
                                expense.amount || '-',
                                expense.status || '-',
                                expense.payment_details?.receipt_screenshot || '-',
                                expense.usersName || '-',
                                expense.usersMobileNumber || '-',
                                expense.usersPropertyStatus || '-',
                                moment(expense.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                moment(expense.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                            ]);

                            // Add hyperlink for receipt image
                            if (expense.payment_details?.receipt_screenshot) {
                                const imageCell = row.getCell(6);
                                imageCell.value = {
                                    text: expense.payment_details.receipt_screenshot,
                                    hyperlink: expense.payment_details.receipt_screenshot
                                };
                                imageCell.font = {
                                    color: { argb: '0000FF' },
                                    underline: true
                                };
                            }

                            // Style status cell
                            const statusCell = row.getCell(5);
                            if (expense.status === 'pending') {
                                statusCell.font = {
                                    color: { argb: 'd32f2f' },
                                    bold: true
                                };
                            } else if (expense.status === 'clear') {
                                statusCell.font = {
                                    color: { argb: '689f38' },
                                    bold: true
                                };

                                // Add payment modal trigger for clear status
                                statusCell.value = {
                                    text: 'Clear'
                                };
                            }
                        });

                        // Auto-fit columns
                        worksheet.columns.forEach((column) => {
                            column.width = 25;
                        });

                        // Make certain columns wider
                        worksheet.getColumn(1).width = 30; // Date
                        worksheet.getColumn(2).width = 40; // Expense Details
                        worksheet.getColumn(6).width = 45; // Receipt Image

                        // Generate and download Excel file
                        workbook.xlsx
                            .writeBuffer()
                            .then((buffer) => {
                                const blob = new Blob([buffer], {
                                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'expense_list.xlsx';
                                a.click();
                                window.URL.revokeObjectURL(url);
                            })
                            .catch((err) => {
                                console.error('Error generating Excel file:', err);
                            });
                    }
                }}
            />
            {getRoles('create') && <Button label="Add Expense" icon="pi pi-plus" className="p-button-outlined p-button-success mr-2" onClick={() => navigate(`/property-management/expense/expense-create`)} />}
        </React.Fragment>;
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = expenseData?.data?.expense_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText
                            placeholder="Search by Category, Details"

                            value={pagination?.search || ''}
                            onChange={(e) => onSearch(e.target.value)}
                            style={{ width: '20rem' }}
                            disabled={isSearchDisabled}
                        />
                    </span>

                    {/* Clear Button */}
                    <Button
                        label="Clear"
                        icon="pi pi-filter-slash"
                        className="p-button-outlined w-7rem ml-2"
                        disabled={pagination?.search === ''}
                        onClick={() => {
                            let updatedPagination = { ...pagination };
                            updatedPagination.search = ''; // Clear the search value
                            setPagination(updatedPagination); // Update pagination state
                            onSearch(''); // Clear the search filter
                        }}
                    />
                </div>
            </React.Fragment>
        );
    };

    const centerToolbarTemplate = () => {
        const isSearchDisabled = expenseData?.data?.expense_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                {/* SelectButton for Filtering */}
                <SelectButton
                    value={pagination.listType === 0 ? 'Pending' : 'Clear'}
                    onChange={(e) => {
                        if (e.value !== null) {
                            let updatedPagination = { ...pagination };
                            updatedPagination.listType = e.value === 'Pending' ? 0 : 1; // Update list type
                            updatedPagination.per_page = 10; // Reset per-page value
                            updatedPagination.current_page = 1; // Reset to the first page
                            callExpenseData(updatedPagination); // Fetch data with updated filters
                            setPagination(updatedPagination); // Update state
                        }
                    }}
                    options={['Pending', 'Clear']}
                    className="ml-4"
                />
            </React.Fragment>
        );
    };

    const onSearch = (value) => {
        let paginationData = { ...pagination };

        paginationData.search = value;
        paginationData.per_page = 10;
        paginationData.current_page = 1;
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        setRows(10);
        setFirst(0);
        dispatch(getExpenseData(paginationData));
    };
    const getRoles = (permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'expense_tracker')?.module_access.findIndex((y) => y === permissionName);
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
    // const dynamicNumber = () => {
    //     try {
    //         setNumValues({
    //             num1: Math.floor(Math.random() * 10),
    //             num2: Math.floor(Math.random() * 10)
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const header = <Toolbar className="create-delete-btn" start= {leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>;
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                 <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/expense/expense-view/${rowData?._id}`)} />

                {getRoles('update') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text  p-button-help"
                        onClick={() => navigate(`/property-management/expense/expense-edit/${rowData._id}`)}
                        disabled={rowData.status === 'clear'}
                    />
                )}

                {getRoles('delete') && (
                        <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text  p-button-danger"
                        id="delete-icons"
                        tooltip="Delete"
                        tooltipOptions={{ position: 'bottom' }}
                        onClick={() => {
                            setDeleteModal(true);
                            setDeleteId(rowData);
                            dynamicNumber();
                            setSumValue(null);
                            setSumValueError('');
                        }}
                    />
                )}
            </div>
        );
    };
    const dynamicNumber = () => {
        try {
            setNumValues({
                num1: Math.floor(Math.random() * 10),
                num2: Math.floor(Math.random() * 10)
            });
        } catch (error) {
            console.log(error);
        }
    };

    const deleteFixdepositDialogFooter = () => {
        try {
            return (
                <>
    <Button
        label="No"
        className="p-button-outlined p-button-danger mr-2"
        onClick={() => {
            setDeleteModal(false);
            setDeleteId(null);
            setSumValue(null);
            setSumValueError('');
        }}
    />
    <Button
        label="Yes"
        className="p-button-outlined p-button-success"
        onClick={() => {
            if (numValues.num1 + numValues.num2 === sumValue) {
                // dispatch(announcementRemoveRequest(deleteId));
                // setDeleteModal(false);
                // setDeleteId(null);
                // dispatch(getAnnouncementData());
                dispatch(expenseRemoveRequest(deleteId._id));
                setDeleteModal(false);
                setDeleteId(null);
                setSumValue(null);
                setSumValueError('');
                // dispatch(getAnnouncementData());
            } else {
                setSumValueError('Wrong Answer!');
            }
        }}
    />
</>

            );
        } catch (error) {
            console.log(error);
        }
    };

    const convertDate = (dateStr) => {
        try {
            const formattedDate = moment(dateStr).format('D MMM YYYY');
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpload = async (event, setFieldValue, stage) => {
        try {
            const str = event.target.files[0]?.name;
            const substr = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                setFieldValue(stage === 2 ? 'receipt2' : 'receipt', event.target.files[0]);
                stage === 2 ? setReceiptShow2(str) : setReceiptShow(str);
                // setFileFormData(event.target.files[0]);
                // setFileName(str);
            } else {
                toast.error('Only Accept .png , .jpeg, .jpg, .pdf, .doc, .docx .', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpload2 = async (event, setFieldValue, stage) => {
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
                setFieldValue(stage === 2 ? 'payment_photo2' : 'payment_photo', event.target.files[0]);
                stage === 2 ? setPaymentShow2(URL.createObjectURL(event.target.files[0])) : setPaymentShow(URL.createObjectURL(event.target.files[0]));
                // setFileFormData(event.target.files[0]);
                // setFileName(str);
            } else {
                toast.error('Only Accept .png , .jpeg, and .jpg file.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const setDefaultDate = (val) => {
        try {
            const inputDateString = val;
            const [day, month, year] = inputDateString.split('/').map(Number);
            const dateObj = new Date(year, month - 1, day);
            const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
            const localTime = dateObj.getTime() - timezoneOffset;
            const indiaOffset = 330 * 60000;
            const indiaTime = localTime + indiaOffset;
            const indiaDate = new Date(indiaTime);
            return new Date(indiaDate.toString());
        } catch (error) {
            console.log(error);
        }
    };
    const setYYYYMMDD = (val) => {
        try {
            const inputDateStr = val;
            const [day, month, year] = inputDateStr.split('/');
            const date = new Date(year, month - 1, day);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const formattedDateStr = `${yyyy}-${mm}-${dd}`;
            return formattedDateStr;
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading || importLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title  m-2 pr-3 flex align-items-center justify-content-center">Expense</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {expenseData?.data?.expense_listing && expenseData?.data?.expense_listing.length > 0 ? (
                        <DataTable
                            value={expenseData?.data?.expense_listing}
                            showGridlines
                            stripedRows
                            dataKey="id"
                            // className="datatable-responsive"
                            emptyMessage="No Record Found."
                            header={header}
                            scroll="scroll"
                            tableStyle={{ minWidth: '60rem' }}
                            sortMode="multiple"
                            size="normal"
                            onSort={(e) => {
                                let paginationData = { ...pagination };
                                paginationData.order_column = e.multiSortMeta[0]['field'];
                                paginationData.order_direction = e.multiSortMeta[0]['order'];
                                setPagination(paginationData);
                                setMultiSortMeta(e.multiSortMeta);
                                callExpenseData(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            {/* <Column
                                field="receipt_image"
                                header="Image"
                                body={(rowData) => (rowData?.receipt_image ? <Image src={`${BASE_URL_API}fd_receipt/${rowData?.receipt_image}`} alt="Image" width="50" height="50" preview /> : '-')}
                                style={{ width: '4rem' }}
                            ></Column> */}
                            <Column field="expense_date" header="Expense Date" className='h-50' sortable body={(rowData) => (rowData.expense_date ? convertDate(rowData.expense_date) : '-')}></Column>
                            <Column field="expense_category" header="Expense Category" className='capitalize-first-letter' sortable></Column>
                            {/* <Column field="payment_mode" header="Payment Mode" sortable></Column> */}
                            <Column field="expense_details" header="Expense Details" className='capitalize-first-letter wrap-text text-container' sortable></Column>
                            <Column field="amount" className="headerCellEnd" headerStyle={{ width: '3%', minWidth: '9rem' }} header="Amount (₹)" sortable body={(rowData) => <div className="text-right">{new Intl.NumberFormat('en-IN').format(rowData?.amount)}</div>}></Column>
                            <Column
                                field="status"
                                header="Status"
                                // sortable
                                headerStyle={{ width: '3%', minWidth: '10rem' }}
                                body={(rowData) =>
                                    rowData?.status === 'pending' && getRoles('update') ? (
                                        <div className="solid_border_drop">
                                            <Dropdown
                                                value={rowData?.status === 'pending' ? 0 : 1}
                                                options={
                                                    // rowData?.is_complaint_approved_by_chairman === 0 ?
                                                    [
                                                        { label: 'Pending', value: 0 },
                                                        { label: 'Clear', value: 1 }
                                                    ]
                                                    // : [
                                                    //     { label: 'In Progress', value: 1 },
                                                    //     { label: 'Close', value: 2 }
                                                    // ]
                                                }
                                                optionLabel="label"
                                                optionValue="value"
                                                onChange={(e) => {
                                                    if (e.target.value !== null) {
                                                        if (e.target.value === 1) {
                                                            setStatusModal(rowData);
                                                            setPaymentMode(null);
                                                            setFormValue({
                                                                remark: '',
                                                                checkNo: '',
                                                                receipt: rowData?.payment_details?.receipt_screenshot ? rowData?.payment_details?.receipt_screenshot : null,
                                                                payment_photo: null
                                                            });
                                                            setFormValue2({
                                                                checkNo: '',
                                                                personName: '',
                                                                branchName: '',
                                                                chequeDate: '',
                                                                chequeBankName: '',
                                                                remark:'',
                                                                receipt2: rowData?.payment_details?.receipt_screenshot ? rowData?.payment_details?.receipt_screenshot : null,
                                                                payment_photo2: null
                                                            });
                                                            rowData?.payment_details?.receipt_screenshot && setReceiptShow(rowData?.payment_details?.receipt_screenshot);
                                                            rowData?.payment_details?.receipt_screenshot && setReceiptShow2(rowData?.payment_details?.receipt_screenshot);
                                                            setPaymentShow(null);
                                                            setPaymentShow2(null);
                                                        }

                                                        // dispatch(updateComplaintStatusRequest(rowData._id, { is_complaint_approved_by_chairman: e.target.value }));
                                                    }
                                                }}
                                                style={{ width: '100%', background: 'transparent' }}
                                                placeholder="Select a Status"
                                                className={`${
                                                    rowData?.status === 'pending' ? 'editableDropYellow editableDropBorderYellow' : 'editableDropGreen editableDropBorderGreen'
                                                    // ? 'editableDropRed editableDropBorderRed'
                                                    // : rowData?.is_complaint_approved_by_chairman === 1
                                                    // ? 'editableDropYellow editableDropBorderYellow'
                                                    // : 'editableDropGreen editableDropBorderGreen'
                                                }`}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex justify-content-center">
                                            <div
                                                className="p-2 text-center w-7rem"
                                                style={{
                                                    color: rowData?.status === 'pending' ? '#f5c308' : rowData?.status === 'clear' ? '#689f38' : '#689f38',
                                                    border: `2px solid ${rowData?.status === 'pending' ? '#f5c308' : rowData?.status === 'clear' ? '#689f38' : '#689f38'}`,
                                                    borderRadius: '5px'
                                                }}
                                            >
                                                {rowData?.status === 'pending' ? 'Pending' : rowData?.status === 'clear' ? 'Clear' : '-'}
                                            </div>
                                        </div>
                                    )
                                }
                            ></Column>
                            <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{expenseData?.data?.expense_listing && expenseData?.data?.expense_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {expenseData?.data?.expense_listing && expenseData?.data?.expense_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {expenseData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={expenseData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
                    )}
                    {statusModal !== null && (
                        <Dialog
                            draggable={false}
                            visible={statusModal !== null}
                            header="Expense Status"
                            style={{ width: '50vw' }}
                            closable={false}
                            footer={false}
                            icons={
                                <div className="flex align-items-center justify-content-center" style={{ width: '1.5rem', height: '1.5rem' }}>
                                    <X
                                        color={'black'}
                                        size={17}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setStatusModal(null);
                                        }}
                                    />
                                </div>
                            }
                            modal
                            className="p-fluid"
                            // headerStyle={{ backgroundColor: '#d32f2f', color: '#fff' }}
                        >
                            <div className="flex flex-wrap gap-3 mt-3">
                                <div className="flex align-items-center">
                                    <RadioButton
                                        inputId="ingredient1"
                                        name="cash"
                                        value="Cash"
                                        onChange={(e) => {
                                            setPaymentMode('Cash');
                                        }}
                                        checked={paymentMode === 'Cash'}
                                    />
                                    <label htmlFor="ingredient1" className="ml-2 cursor-pointer">
                                        Cash
                                    </label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton
                                        inputId="ingredient2"
                                        name="cheque"
                                        value="Cheque"
                                        onChange={(e) => {
                                            setPaymentMode('Cheque');
                                        }}
                                        checked={paymentMode === 'Cheque'}
                                    />
                                    <label htmlFor="ingredient2" className="ml-2 cursor-pointer">
                                        Cheque
                                    </label>
                                </div>
                                {loginDetails.role_permissions.filter((x) => x.role !== 'Chairman').length > 0 && (
                                    <div className="flex align-items-center">
                                        <RadioButton
                                            inputId="ingredient3"
                                            name="Online"
                                            value="Online"
                                            checked={paymentMode === 'Online'}
                                            onChange={(e) => {
                                                setPaymentMode('Online');
                                            }}
                                        />
                                        <label htmlFor="ingredient3" className="ml-2 cursor-pointer">
                                            Online
                                        </label>
                                    </div>
                                )}
                            </div>
                            {paymentMode === 'Cash' && (
                                <Formik
                                    initialValues={formValue}
                                    validationSchema={SignupSchema}
                                    enableReinitialize
                                    onSubmit={(values) => {
                                        setSubmitted(true);
                                        setTimeout(() => {
                                            setSubmitted(false);
                                        }, 5000);

                                        let sendData = {
                                            payment_type: 'cash',
                                            remark: values?.remark,
                                            receipt: values?.receipt ? values?.receipt : ''
                                        };
                                        statusModal?._id && dispatch(updateExpenseStatus(statusModal?._id, sendData));
                                    }}
                                >
                                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                                        <Form>
                                            <div className="grid p-fluid mt-2">
                                                <div className="field col-12 md:col-12 mb-0">
                                                    <label htmlFor="remark" className="required">
                                                        Remarks
                                                    </label>
                                                    <InputTextarea
                                                        rows="3"
                                                        cols="20"
                                                        id="remark"
                                                        name="remark"
                                                        placeholder="Enter Remark"
                                                        type="text"
                                                        value={values?.remark}
                                                        onChange={handleChange}
                                                        className={classNames({ 'p-invalid': errors.remark && touched.remark })}
                                                        style={{ resize: 'none' }}
                                                    />
                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.remark && touched.remark ? errors.remark : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            {paymentMode !== null && (
                                                <div className="field col-12 md:col-12 mb-1">
                                                    {values?.receipt === null && (
                                                        <div className="file-input-upload mt-2">
                                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png, .pdf, .doc, .docx" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                                            <label for="fileInput" className="label">
                                                                <span>Upload a Receipt File...</span>
                                                            </label>
                                                        </div>
                                                    )}
                                                    {values?.receipt !== null && (
                                                        <>
                                                            <label htmlFor="receipt" className="font-semibold mb-0">
                                                                Receipt
                                                            </label>
                                                            <div className="">
                                                                <div>{receiptShow}</div>
                                                                <div className="ml-3">
                                                                    <Button
                                                                        icon="pi pi-trash"
                                                                        type="button"
                                                                        className="p-button-rounded p-button-text  p-button-danger"
                                                                        id="delete-icons"
                                                                        tooltip="Receipt Delete"
                                                                        tooltipOptions={{ position: 'bottom' }}
                                                                        onClick={() => {
                                                                            setFieldValue('receipt', null);
                                                                            setReceiptShow(null);
                                                                            // setFileFormData(null);
                                                                            // setFileName(null);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {paymentMode !== null && (
                                                <div className="grid p-fluid mt-1">
                                                    <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                                        <Button label="Cancel" type="button" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => setStatusModal(null)} />
                                                        <Button disabled={submitted} label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                                    </div>
                                                </div>
                                            )}
                                        </Form>
                                    )}
                                </Formik>
                            )}
                            {paymentMode && paymentMode !== 'Cash' && (
                                <Formik
                                    initialValues={formValue2}
                                    validationSchema={paymentMode === 'Cheque' && SignupSchema2}
                                    enableReinitialize
                                    onSubmit={(values) => {
                                        setSubmitted(true);
                                        setTimeout(() => {
                                            setSubmitted(false);
                                        }, 5000);
                                        let sendData = {};
                                        if (paymentMode === 'Cheque') {
                                            sendData.payment_type = 'cheque';
                                            sendData.personName = values?.personName;
                                            sendData.branchName = values?.branchName;
                                            sendData.chequeNumber = values?.checkNo;
                                            sendData.chequeDate = setYYYYMMDD(values?.chequeDate);
                                            sendData.chequeBankName = values?.chequeBankName;
                                            sendData.remark = values.remark;
                                            sendData.payment_img = values?.payment_photo2 ? values?.payment_photo2 : '';
                                            sendData.receipt = values?.receipt2 ? values?.receipt2 : '';
                                            statusModal?._id && dispatch(updateExpenseStatus(statusModal?._id, sendData));
                                        } else {
                                            sendData.payment_type = 'online_mode';
                                            sendData.receipt = values?.receipt2 ? values?.receipt2 : '';
                                            if (values?.payment_photo2 === null) {
                                                toast.error('Please upload payment screen shot.', {
                                                    style: {
                                                        marginTop: '4rem'
                                                    }
                                                });
                                            } else {
                                                sendData.payment_img = values?.payment_photo2 ? values?.payment_photo2 : '';
                                                statusModal?._id && dispatch(updateExpenseStatus(statusModal?._id, sendData));
                                            }
                                        }

                                        // let formData = new FormData();
                                        // formData.append('expense_details', values?.expense_details);
                                        // formData.append('expense_category', values?.expense_category);
                                        // formData.append('amount', values?.amount);
                                        // formData.append('status', createStatus ? 'pending' : 'clear');
                                        // formData.append('payment_mode', values?.payment_mode);
                                        // formData.append('expense_date', setYYYYMMDD(values?.expense_date));
                                        // formData.append('receipt', fileFormData ? fileFormData : '');
                                        // values.id === '' && dispatch(expenseCreateRequest(formData));
                                        // values.id !== '' && dispatch(updateExpenseRequest(values.id, formData));
                                    }}
                                >
                                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                                        <Form>
                                            <div className="grid p-fluid mt-2">
                                                {paymentMode === 'Cheque' && (
                                                    <>
                                                        <div className="field col-12 md:col-12 mb-0">
                                                            <label htmlFor="personName " className="required">
                                                                Person Name
                                                            </label>
                                                            <InputText
                                                                id="personName"
                                                                name="personName"
                                                                placeholder="Enter person Name"
                                                                type="text"
                                                                value={values?.personName}
                                                                onChange={handleChange}
                                                                className={classNames({ 'p-invalid': errors.personName && touched.personName })}
                                                            />
                                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                                {errors.personName && touched.personName ? errors.personName : ''}
                                                            </div>
                                                        </div>
                                                        <div className="field col-12 md:col-12 mb-0">
                                                            <label htmlFor="branchName" className="required">
                                                                Branch Name
                                                            </label>
                                                            <InputText
                                                                id="branchName"
                                                                name="branchName"
                                                                placeholder="Enter Branch Name"
                                                                type="text"
                                                                value={values?.branchName}
                                                                onChange={handleChange}
                                                                className={classNames({ 'p-invalid': errors.branchName && touched.branchName })}
                                                            />
                                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                                {errors.branchName && touched.branchName ? errors.branchName : ''}
                                                            </div>
                                                        </div>
                                                        <div className="field col-12 md:col-12 mb-0">
                                                            <label htmlFor="checkNo" className="required">
                                                                Cheque Number
                                                            </label>
                                                            <InputText
                                                                id="checkNo"
                                                                name="checkNo"
                                                                placeholder="Enter Cheque Number"
                                                                type="text"
                                                                value={values?.checkNo}
                                                                onChange={handleChange}
                                                                className={classNames({ 'p-invalid': errors.checkNo && touched.checkNo })}
                                                            />
                                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                                {errors.checkNo && touched.checkNo ? errors.checkNo : ''}
                                                            </div>
                                                        </div>
                                                        <div className="field col-12 md:col-12 mb-0">
                                                            <label htmlFor="chequeDate" className="required">
                                                                Cheque Date
                                                            </label>
                                                            <Calendar
                                                                id="chequeDate"
                                                                name="chequeDate"
                                                                placeholder="Please Select Date"
                                                                value={values?.chequeDate !== '' ? setDefaultDate(values?.chequeDate) : ''}
                                                                dateFormat="dd/mm/yy"
                                                                onChange={(e) => {
                                                                    const dateString = new Date(e.target.value);
                                                                    const day = dateString.getDate();
                                                                    const month = dateString.getMonth() + 1;
                                                                    const year = dateString.getFullYear();
                                                                    const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                                                    setFieldValue('chequeDate', formattedDate);
                                                                }}
                                                                className={classNames({ 'p-invalid': errors.chequeDate && touched.chequeDate })}
                                                            />
                                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                                {errors.chequeDate && touched.chequeDate ? errors.chequeDate : ''}
                                                            </div>
                                                        </div>
                                                        <div className="field col-12 md:col-12 mb-0">
                                                            <label htmlFor="chequeBankName" className="required">
                                                                Cheque Bank Name
                                                            </label>
                                                            <InputText
                                                                id="chequeBankName"
                                                                name="chequeBankName"
                                                                placeholder="Enter Cheque Bank Name"
                                                                type="text"
                                                                value={values?.chequeBankName}
                                                                onChange={handleChange}
                                                                className={classNames({ 'p-invalid': errors.chequeBankName && touched.chequeBankName })}
                                                            />
                                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                                {errors.chequeBankName && touched.chequeBankName ? errors.chequeBankName : ''}
                                                            </div>
                                                        </div>
                                                        <div className="grid p-fluid mt-2">
                                                        <div className="field col-12 md:col-12 mb-0">
                                                        <label htmlFor="remark" className="required">
                                                          Remarks
                                                        </label>
                                                    <InputTextarea
                                                     rows={5} // Adjusts the height by setting the number of visible text lines
                                                     cols={59}
                                                        id="remark"
                                                        name="remark"
                                                        placeholder="Enter Remark"
                                                        type="text"
                                                        value={values?.remark}
                                                        onChange={handleChange}
                                                        className={classNames({ 'p-invalid': errors.remark && touched.remark })}
                                                        style={{ resize: 'none' }}
                                                    />
                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.remark && touched.remark ? errors.remark : ''}
                                                    </div>
                                                </div>
                                            </div>
                                                    </>
                                                )}
                                            </div>
                                            {paymentMode !== null && (
                                                <div className="field col-12 md:col-12 mb-1">
                                                    {values?.receipt2 === null && (
                                                        <div className="file-input-upload mt-2">
                                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png, .pdf, .doc, .docx" className="input" onChange={(event) => handleUpload(event, setFieldValue, 2)} />
                                                            <label for="fileInput" className="label">
                                                                <span>Upload a Receipt File...</span>
                                                            </label>
                                                        </div>
                                                    )}
                                                    {values?.receipt2 !== null && (
                                                        <>
                                                            <label htmlFor="receipt" className="font-semibold mb-0">
                                                                Receipt
                                                            </label>
                                                            <div className="">
                                                                <div>{receiptShow2}</div>
                                                                <div className="ml-3">
                                                                    <Button
                                                                        icon="pi pi-trash"
                                                                        type="button"
                                                                        className="p-button-rounded p-button-text  p-button-danger"
                                                                        id="delete-icons"
                                                                        tooltip="Receipt Delete"
                                                                        tooltipOptions={{ position: 'bottom' }}
                                                                        onClick={() => {
                                                                            setFieldValue('receipt2', null);
                                                                            setReceiptShow2(null);
                                                                            // setFileFormData(null);
                                                                            // setFileName(null);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {paymentMode !== null && (
                                                <div className="field col-12 md:col-12 mb-1">
                                                    {values?.payment_photo2 === null && (
                                                        <div className="file-input-upload mt-2">
                                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload2(event, setFieldValue, 2)} />
                                                            <label for="fileInput" className="label">
                                                                <span>{paymentMode === 'Cheque' ? 'Upload a Cheque Photo...' : 'Upload a Payment Screen Shot...'}</span>
                                                            </label>
                                                        </div>
                                                    )}
                                                    {values?.payment_photo2 !== null && (
                                                        <>
                                                            <label htmlFor="receipt" className="font-semibold mb-0">
                                                                {paymentMode === 'Cheque' ? 'Check Image' : 'Payment Image'}
                                                            </label>
                                                            <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                                                <div className="relative " style={{ width: '100px', height: '100px' }}>
                                                                    <Image alt="Image" src={paymentShow2} width="100" height="100" preview />
                                                                    <div
                                                                        className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                                        style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                                        onClick={() => {
                                                                            setFieldValue('payment_photo2', null);
                                                                            setPaymentShow2(null);
                                                                            // setShowFile(null);
                                                                        }}
                                                                    >
                                                                        <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {paymentMode !== null && (
                                                <div className="grid p-fluid mt-1">
                                                    <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                                        <Button label="Cancel" type="button" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => setStatusModal(null)} />
                                                        <Button disabled={submitted} label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                                    </div>
                                                </div>
                                            )}
                                        </Form>
                                    )}
                                </Formik>
                            )}

                            {/* <Formik
                                initialValues={formValue}
                                validationSchema={SignupSchema}
                                enableReinitialize
                                onSubmit={(values) => {
                                    // setSubmitted(true);
                                    // setTimeout(() => {
                                    //     setSubmitted(false);
                                    // }, 5000);
                                    // let formData = new FormData();
                                    // formData.append('expense_details', values?.expense_details);
                                    // formData.append('expense_category', values?.expense_category);
                                    // formData.append('amount', values?.amount);
                                    // formData.append('status', createStatus ? 'pending' : 'clear');
                                    // formData.append('payment_mode', values?.payment_mode);
                                    // formData.append('expense_date', setYYYYMMDD(values?.expense_date));
                                    // formData.append('receipt', fileFormData ? fileFormData : '');
                                    // values.id === '' && dispatch(expenseCreateRequest(formData));
                                    // values.id !== '' && dispatch(updateExpenseRequest(values.id, formData));
                                }}
                            >
                                {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                                    <div className=" mt-2">
                                        <Form>
                                            {paymentMode === 'Cash' && (
                                                <div className="field col-12 md:col-12 mb-0">
                                                    <label htmlFor="remark" className="required">
                                                        Remarks
                                                    </label>
                                                    <InputTextarea
                                                        rows="3"
                                                        cols="20"
                                                        id="remark"
                                                        name="remark"
                                                        placeholder="Enter Remark"
                                                        type="text"
                                                        value={values?.remark}
                                                        onChange={handleChange}
                                                        className={classNames({ 'p-invalid': errors.remark && touched.remark })}
                                                    />
                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.remark && touched.remark ? errors.remark : ''}
                                                    </div>
                                                </div>
                                            )}
                                            {paymentMode === 'Cheque' && (
                                                <>
                                                    <div className="field col-12 md:col-12 mb-0">
                                                        <label htmlFor="personName " className="required">
                                                            Person Name
                                                        </label>
                                                        <InputText
                                                            id="personName"
                                                            name="personName"
                                                            placeholder="Enter person Name"
                                                            type="text"
                                                            value={values?.personName}
                                                            onChange={handleChange}
                                                            className={classNames({ 'p-invalid': errors.personName && touched.personName })}
                                                        />
                                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                            {errors.personName && touched.personName ? errors.personName : ''}
                                                        </div>
                                                    </div>
                                                    <div className="field col-12 md:col-12 mb-0">
                                                        <label htmlFor="branchName" className="required">
                                                            Branch Name
                                                        </label>
                                                        <InputText
                                                            id="branchName"
                                                            name="branchName"
                                                            placeholder="Enter Branch Name"
                                                            type="text"
                                                            value={values?.branchName}
                                                            onChange={handleChange}
                                                            className={classNames({ 'p-invalid': errors.branchName && touched.branchName })}
                                                        />
                                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                            {errors.branchName && touched.branchName ? errors.branchName : ''}
                                                        </div>
                                                    </div>
                                                    <div className="field col-12 md:col-12 mb-0">
                                                        <label htmlFor="checkNo" className="required">
                                                            Cheque Number
                                                        </label>
                                                        <InputText
                                                            id="checkNo"
                                                            name="checkNo"
                                                            placeholder="Enter Cheque Number"
                                                            type="text"
                                                            value={values?.checkNo}
                                                            onChange={handleChange}
                                                            className={classNames({ 'p-invalid': errors.checkNo && touched.checkNo })}
                                                        />
                                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                            {errors.checkNo && touched.checkNo ? errors.checkNo : ''}
                                                        </div>
                                                    </div>
                                                    <div className="field col-12 md:col-12 mb-0">
                                                        <label htmlFor="chequeDate" className="required">
                                                            Cheque Date
                                                        </label>
                                                        <Calendar
                                                            id="chequeDate"
                                                            name="chequeDate"
                                                            placeholder="Please Select Date"
                                                            value={values?.chequeDate !== '' ? setDefaultDate(values?.chequeDate) : ''}
                                                            dateFormat="dd/mm/yy"
                                                            onChange={(e) => {
                                                                const dateString = new Date(e.target.value);
                                                                const day = dateString.getDate();
                                                                const month = dateString.getMonth() + 1;
                                                                const year = dateString.getFullYear();
                                                                const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                                                setFieldValue('chequeDate', formattedDate);
                                                            }}
                                                            className={classNames({ 'p-invalid': errors.chequeDate && touched.chequeDate })}
                                                        />
                                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                            {errors.chequeDate && touched.chequeDate ? errors.chequeDate : ''}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {paymentMode !== null && (
                                                <div className="field col-12 md:col-12 mb-1">
                                                    {values?.receipt === null && (
                                                        <div className="file-input-upload mt-2">
                                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png, .pdf, .doc, .docx" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                                            <label for="fileInput" className="label">
                                                                <span>Upload a Receipt File...</span>
                                                            </label>
                                                        </div>
                                                    )}
                                                    {values?.receipt !== null && (
                                                        <>
                                                            <label htmlFor="receipt" className="font-semibold mb-0">
                                                                Receipt
                                                            </label>
                                                            <div className="">
                                                                <div>{receiptShow}</div>
                                                                <div className="ml-3">
                                                                    <Button
                                                                        icon="pi pi-trash"
                                                                        className="p-button-rounded p-button-text  p-button-danger"
                                                                        id="delete-icons"
                                                                        tooltip="Receipt Delete"
                                                                        tooltipOptions={{ position: 'bottom' }}
                                                                        onClick={() => {
                                                                            setFieldValue('receipt', null);
                                                                            setReceiptShow(null);
                                                                            // setFileFormData(null);
                                                                            // setFileName(null);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {paymentMode !== null && (
                                                <div className="field col-12 md:col-12 mb-1">
                                                    {values?.payment_photo === null && (
                                                        <div className="file-input-upload mt-2">
                                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload2(event, setFieldValue)} />
                                                            <label for="fileInput" className="label">
                                                                <span>{paymentMode === 'Cheque' ? 'Upload a Cheque Photo...' : 'Upload a Payment Screen Shot...'}</span>
                                                            </label>
                                                        </div>
                                                    )}
                                                    {values?.payment_photo !== null && (
                                                        <>
                                                            <label htmlFor="receipt" className="font-semibold mb-0">
                                                                {paymentMode === 'Cheque' ? 'Check Image' : 'Payment Image'}
                                                            </label>
                                                            <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                                                <div className="relative " style={{ width: '100px', height: '100px' }}>
                                                                    <Image alt="Image" src={paymentShow} width="100" height="100" preview />
                                                                    <div
                                                                        className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                                        style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                                        onClick={() => {
                                                                            setFieldValue('payment_photo', null);
                                                                            setPaymentShow(null);
                                                                            // setShowFile(null);
                                                                        }}
                                                                    >
                                                                        <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {paymentMode !== null && (
                                                <div className="grid p-fluid mt-1">
                                                    <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                                        <Button label="Cancel" type="button" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => setStatusModal(null)} />
                                                        <Button
                                                            // disabled={submitted}
                                                            label={'Submit'}
                                                            type="submit"
                                                            icon="pi pi-check"
                                                            className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Form>
                                    </div>
                                )}
                            </Formik> */}
                        </Dialog>
                    )}
                    {/* {modal && (
                        <VehiclesAssignModal
                            editData={editData}
                            onHide={() => {
                                setModal(false);
                                steEdit(null);
                            }}
                        />
                    )} */}
                      <DeleteModal
                        isOpenDialog={deleteModal}
                        modalFooter={deleteFixdepositDialogFooter}
                        hideModal={() => {
                            setDeleteModal(false);
                            setDeleteId(null);
                            setSumValueError('');
                            setSumValue(null);
                        }}
                        numValues={numValues}
                        sumValue={sumValue}
                        setSumValue={setSumValue}
                        sumValueError={sumValueError}
                        setSumValueError={setSumValueError}
                        modalDescription={'Are you sure you want to delete expense?'}
                    />

                </div>
            </div>
        </div>
    );
};

export default ExpenseList;
