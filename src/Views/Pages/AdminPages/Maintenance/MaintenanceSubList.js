import components from '../..';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { monthlyMaintenanceUserWise, monthlyMaintenanceCreate, checkPaymentCall, imageUploadPayment, getAllCollectedAmountReaquest } from '../../../../redux/slice/AdminSlices/maintenanceSlice';
import { useDispatch } from 'react-redux';
import CheckPaymentModel from './checkPayment';
import { Image } from 'primereact/image';
import DeleteModal from '../../../../components/DeleteModal';

const MaintenanceSubList = ({ propertyData, tableData, maintenance_paid_status }) => {
    const { Button, Column, DataTable, React, useSelector, useNavigate, InputTextarea, Dialog, RadioButton } = components;
    const navigate = useNavigate();
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { monthlyMaintenanceUserWiseData, isGenerated, isLoading, isOfflinePayment, isImageUploaded, allCollectedAmount } = useSelector((state) => state.maintenance);
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    // State to manage selected rows
    const [selectedRows, setSelectedRows] = useState([]);
    const [multipleTableData, setMultipleTableData] = useState([]);
    const [collectPaymentDetails, setColloectPaymentDetails] = useState(null);
    const [isCheckPayment, setCheckPayment] = useState(false);
    const [casePayment, setCasePayment] = useState(false);
    const [uploadDetails, setUploadDetails] = useState(null);
    const [showPayNowFooter, setShowPayNowFooter] = useState(false);
    const dispatch = useDispatch();
    const [cashRemark, setCashRemark] = useState('');
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
    const getTotalAmount = () => {
        if (selectedRows) {
            return selectedRows.reduce((accu, curr) => {
                return accu + (curr.amount || 0);
            }, 0);
        }
        return 0;
    };
    const getTotalMonth = () => {
        if (selectedRows && selectedRows.length > 0) {
            return selectedRows
                .map((row) => row.month)
                .filter(Boolean)
                .join(', ');
        }
        return '';
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
    const actionBodyForDownLoad = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                <Button
                    tooltip="View"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text"
                    id="eyes-icons"
                    onClick={() => navigate(`/property-management/maintenancelist/payment-view/${rowData?._id}`)}
                />
            </div>
        );
    };
    // const totalPayment = (val) => {
    //     try {
    //         const totalAmount = val.reduce((sum, item) => sum + item.user_maintenance_data[0].amount, 0);
    //         return totalAmount;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const totalPayment = (val) => {
        console.log(val, 'vall');
        try {
            // Calculate total amount directly from array items
            const totalAmount = val.reduce((sum, item) => sum + item.amount, 0);
            return totalAmount;
        } catch (error) {
            console.log('Error calculating total payment:', error);
            return 0; // Return 0 or handle the error appropriately
        }
    };
    const callMonthlyMaintenanceUserWiseList = (val) => {
        console.log(val);
        try {
            dispatch(monthlyMaintenanceUserWise(val));
            dispatch(getAllCollectedAmountReaquest({ month: val?.maintenance_paid_month, year: val?.maintenance_paid_year }));
        } catch (error) {
            console.log(error);
        }
    };
    console.log('collectPaymentDetails: ', propertyData);
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
    const deleteUserDialogFooter = () => {
        try {
            return (
                <>
                    <Button
                        label="Yes"
                        icon="pi pi-check"
                        className="p-button-outlined p-button-success mr-2 mb-2"
                        onClick={async () => {
                            try {
                                // Validation checks
                                if (!selectedRows || selectedRows.length === 0) {
                                    toast.error('Please select at least one maintenance record');
                                    return;
                                }
                                if (!propertyData?._id) {
                                    toast.error('Property data is missing');
                                    return;
                                }
                                if (!cashRemark.trim()) {
                                    toast.error('Please enter a remark');
                                    return;
                                }

                                // Get maintenance IDs and total amount
                                const selectedMaintenanceIds = selectedRows.map((row) => row._id).filter(Boolean);
                                const totalAmount = selectedRows.reduce((sum, row) => sum + (row.amount || 0), 0);

                                // Create FormData with exact field names and file
                                const formData = new FormData();
                                formData.append('user_property_assign_id', propertyData._id);
                                formData.append('maintainance_ids', JSON.stringify(selectedMaintenanceIds));
                                formData.append('payment_type', 'cash');
                                formData.append('original_amount', totalAmount.toString());
                                formData.append('remark', cashRemark.trim());

                                // Append file if it's selected
                                if (uploadImg.file) {
                                    formData.append('file', uploadImg.file); // Changed from 'receipt' to 'file'
                                    console.log('Sending payment request with data:', {
                                        user_property_assign_id: propertyData._id,
                                        maintainance_ids: selectedMaintenanceIds,
                                        payment_type: 'cash',
                                        original_amount: totalAmount,
                                        remark: cashRemark.trim(),
                                        file: uploadImg.file.name // Log file name for verification
                                    });
                                } else {
                                    console.log('No file selected, proceeding without file');
                                }

                                const response = await dispatch(checkPaymentCall(formData));

                                // Ensure only success or error toast is triggered
                                if (response?.payload?.statusCode === 200) {
                                    toast.success('Payment processed successfully');

                                    // Reset states
                                    setCasePayment(false);
                                    setCashRemark('');
                                    setuploadImg({ file: null, showFile: '' });
                                    setSelectedRows([]);
                                    setMultipleTableData([]);
                                    setShowPayNowFooter(false);

                                    // Refresh maintenance list
                                    callMonthlyMaintenanceUserWiseList(pagination);
                                } else {
                                    console.error('Payment API Error Response:', response?.payload);
                                    // toast.error(response?.payload?.message || 'Payment processing failed');
                                }
                            } catch (error) {
                                console.error('Payment Processing Error:', error);
                                console.error('Error Details:', {
                                    message: error.message,
                                    response: error.response?.data,
                                    status: error.response?.status
                                });

                                // Ensure only one toast message is displayed
                                if (!toast.isActive('error-toast')) {
                                    toast.error('Error processing payment: ' + (error.response?.data?.message || error.message || 'Unknown error'), {
                                        toastId: 'error-toast'
                                    });
                                }
                            }
                        }}
                    />
                </>
            );
        } catch (error) {
            console.error('Error in deleteUserDialogFooter:', error);
            return null;
        }
    };
    const handleUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) {
                toast.error('No file selected');
                return;
            }
            // Check file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload only JPG, JPEG, or PNG files');
                return;
            }

            // Check file size (5MB limit)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error('File size should be less than 5MB');
                return;
            }

            setuploadImg({
                file: file,
                showFile: URL.createObjectURL(file)
            });
        } catch (error) {
            console.error('File Upload Error:', error);
            toast.error('Error uploading file');
            setuploadImg({ file: null, showFile: '' });
        }
    };
    const isRowSelectable = (event) => {
        const data = event.data;
        return !data.is_paid; // Only allow selection if status is not paid
    };

    // Modified onSelectionChange handler
    const handleSelectionChange = (e) => {
        // Filter out any paid rows that might have been selected
        const validSelection = e.value.filter((row) => !row.is_paid);

        setSelectedRows(validSelection);
        setMultipleTableData(validSelection);
        setShowPayNowFooter(validSelection.length > 0);

        if (validSelection.length > 0) {
            const paginationData = { ...pagination };
            callMonthlyMaintenanceUserWiseList(paginationData);
            setPagination(paginationData);
        } else {
            setMultipleTableData([]);
        }
    };

    // Add cleanup for object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (uploadImg.showFile) {
                URL.revokeObjectURL(uploadImg.showFile);
            }
        };
    }, []);

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
                        // alert(response.razorpay_payment_id);
                        // alert(response.razorpay_order_id);
                        // alert(response.razorpay_signature);
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
                        // contact: 9537441020
                    },
                    notes: {
                        address: 'Razorpay Corporate Office'
                    },
                    theme: {
                        color: '#3399cc'
                    },

                    //     options: {
                    //     // Specify the allowed payment methods
                    //     payment_method: ['card', 'netbanking'],
                    //   }
                    // options: {
                    //     // Display only card as a payment method
                    //     payment_method: {
                    //       card: true,
                    //     },
                    //   },

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
    // Disable checkboxes for rows where is_paid is true
    const isCheckboxDisabled = (rowData) => rowData?.is_paid;
    return (
        <>
            <DataTable
                value={tableData}
                showGridlines
                stripedRows
                emptyMessage="No Record Found."
                scroll="scroll"
                tableStyle={{ minWidth: '60rem' }}
                sortMode="multiple"
                size="normal"
                footer={
                    showPayNowFooter && (
                        <div className="flex align-items-center">
                            <div className="">
                                {'Total Amount :- '}
                                {getTotalAmount()}
                            </div>
                            <div className="ml-auto">
                                {(getRoles('update', true) && maintenance_paid_status === 'Unpaid') || maintenance_paid_status === 'All' ? (
                                    <Button id="rzp-button1" label="Pay Now" icon="pi pi-money-bill" className="p-button-outlined p-button-success" onClick={(e) => setColloectPaymentDetails(multipleTableData)} />
                                ) : (
                                    <Button id="rzp-button1" label="Pay Now" icon="pi pi-money-bill" className="p-button-outlined p-button-success" onClick={(e) => paymentHandler(e, multipleTableData)} />
                                )}
                            </div>
                        </div>
                    )
                }
                style={{ marginLeft: '4rem' }}
                selectionMode="multiple"
                selection={selectedRows}
                // onSelectionChange={(e) => {
                //     setSelectedRows(e.value);
                //     setMultipleTableData(e.value);
                //     getTotalAmount();
                //     setShowPayNowFooter(e.value.length > 0);
                //     if (e.value.length > 0) {
                //         let paginationData = { ...pagination };
                //         callMonthlyMaintenanceUserWiseList(paginationData);
                //         setPagination(paginationData);
                //     } else {
                //         setMultipleTableData([]);
                //     }
                // }}
                onSelectionChange={handleSelectionChange}
                isDataSelectable={isRowSelectable}
                dataKey="_id"
            >
                {/* <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }}
                    body={(rowData) => {
                        const disabled = isCheckboxDisabled(rowData);
                        return {
                            className: disabled ? 'p-disabled-checkbox' : '',
                            props: {
                                disabled: disabled
                            }
                        };
                    }}
                /> */}
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }}
                    body={(rowData) => ({
                        disabled: rowData.is_paid,
                        style: { opacity: rowData.is_paid ? 0.5 : 1 }
                    })}
                />
                <Column field="month" header="Month" className="headerCellCenter" body={(rowData) => <div className="text-center">{rowData?.month}</div>} />
                <Column field="year" header="Year" className="headerCellEnd" body={(rowData) => <div className="text-right">{rowData?.year}</div>} />
                <Column field="amount" header="Amount" className="headerCellEnd" body={(rowData) => <div className="text-right">{new Intl.NumberFormat('en-IN').format(rowData?.amount)}</div>} />
                <Column field="is_paid" header="Status" body={(rowData) => <div style={{ color: `${rowData?.is_paid ? '#689f38' : '#d32f2f'}` }}>{rowData?.is_paid === false ? 'Unpaid' : 'Paid'}</div>} />
                <Column header="Action" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyForDownLoad} />
            </DataTable>
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
                                // <div className="field col-12 md:col-4 mb-1">
                                <div className="file-input-upload">
                                    <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event)} />
                                    <label for="fileInput" className="label">
                                        <span>Upload Image...</span>
                                    </label>
                                </div>
                                // </div>
                            )}
                            {uploadImg?.file !== null && (
                                // <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                <>
                                    {/* <label htmlFor="file" className="required">
                                    Cheque Image
                                </label> */}
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
                                // </div>
                            )}
                            {uploadImg?.file === null && (
                                <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                    {'*Note:- Upload a payment screenshot / payment receipt'}
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
                                            Owner Name:- <span className="text-900">{propertyData?.user_name || '-'}</span>
                                        </label>
                                    </div>
                                    <div className="field col-12 mb-0 p-1">
                                        <label className="text-600 mb-0">
                                            Property No.:- <span className="text-900">{propertyData?.property_number || '-'}</span>
                                        </label>
                                    </div>
                                    <div className="field col-12 mb-0 p-1">
                                        <label className="text-600 mb-0">
                                            Amount:- <span className="text-900">{collectedCombinedData(collectPaymentDetails)?.user_maintenance_data?.[0]?.amount ? `₹${totalPayment(multipleTableData)}` : getTotalAmount() || '-'}</span>
                                        </label>
                                    </div>
                                    <div className="field col-12 mb-0 p-1">
                                        <label className="text-600">
                                            Months:-{' '}
                                            <span className="text-900">
                                                {collectedCombinedData(collectPaymentDetails)?.user_maintenance_data
                                                    ? collectedCombinedData(collectPaymentDetails).user_maintenance_data.map((x, i) => x.month + (collectedCombinedData(collectPaymentDetails).user_maintenance_data.length - 1 > i ? ', ' : ''))
                                                    : getTotalMonth() || '-'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mt-3">
                                <div className="mb-2">
                                    <label htmlFor="remark">Remark</label>
                                </div>
                                <InputTextarea rows="2" id="remark" name="remark" placeholder="Enter Remarks" value={cashRemark} onChange={(e) => setCashRemark(e.target.value)} className="w-full" style={{ resize: 'none' }} />
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
                            {/* <div className="flex justify-content-end mt-3">
                                <Button
                                    label="Yes"
                                    icon="pi pi-check"
                                    className="p-button-outlined p-button-success"
                                    onClick={() => {
                                        let SendData = {
                                            file: uploadImg?.file,
                                            id: collectPaymentDetails?.user_maintenance_data[0]?._id
                                        };
                                        dispatch(imageUploadPayment(SendData));
                                        setCasePayment(false);
                                    }}
                                />
                            </div> */}
                        </>
                    )}
                />
            )}

            {isCheckPayment && (
                <CheckPaymentModel propertyData={propertyData} selectedRows={selectedRows} getTotalMonth={getTotalMonth} getTotalAmount={getTotalAmount} onHide={() => setCheckPayment(false)} collectPaymentDetails={collectPaymentDetails} />
            )}
        </>
    );
};
export default MaintenanceSubList;
