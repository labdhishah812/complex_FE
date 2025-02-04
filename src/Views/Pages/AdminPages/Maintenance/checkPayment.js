// import components from '../..';
// import toast from 'react-hot-toast';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import { checkPaymentCall } from '../../../../redux/slice/AdminSlices/maintenanceSlice';
// const CheckPaymentModel = ({ getTotalMonth, getTotalAmount, propertyData, onHide, collectPaymentDetails }) => {
//     const { InputText, InputTextarea, Calendar, Button, classNames, Dialog, Image, useState, useDispatch, useEffect, useSelector } = components;
//     const dispatch = useDispatch();
//     const [showFile, setShowFile] = useState(null);
//     const [selectedRows, setSelectedRows] = useState([]);
//     const [submitted, setSubmitted] = useState(false);
//     const [dataCombined, setDataCombined] = useState(null);
//     const [chequeFile, setChequeFile] = useState(null);
//     const [paymentReceiptFile, setPaymentReceiptFile] = useState(null);
//     const [formValue, setFormValue] = useState({
//         remark: '',
//         check_number: '',
//         check_date: '',
//         bank_name: '',
//         cheque_file: null,
//         payment_receipt: null
//     });
//     // const getTotalAmount = () => {
//     //     if (selectedRows) {
//     //         return selectedRows.reduce((accu, curr) => {
//     //             return accu + (curr.amount || 0);
//     //         }, 0);
//     //     }
//     //     return 0;
//     // };
//     // const getTotalMonth = () => {
//     //     if (selectedRows && selectedRows.length > 0) {
//     //         return selectedRows
//     //             .map((row) => row.month)
//     //             .filter(Boolean)
//     //             .join(', ');
//     //     }
//     //     return '';
//     // };
//     const SignupSchema = Yup.object().shape({
//         check_number: Yup.string()
//             .trim()
//             .nullable()
//             .matches(/^\d{6,10}$/, 'Please enter correct Cheque number.')
//             .required('Please enter Cheque number.'),
//         bank_name: Yup.string().trim().nullable().required('Please enter bank name.'),
//         check_date: Yup.string().trim().nullable().required('Please select Cheque date.')
//     });
//     useEffect(() => {
//         if (Array.isArray(collectPaymentDetails) && collectPaymentDetails.length > 0) {
//             let data = {
//                 _id: propertyData?._id || collectPaymentDetails[0]?._id,
//                 property_id: propertyData?.property_id || collectPaymentDetails[0]?.property_id,
//                 property_number: propertyData?.property_number || collectPaymentDetails[0]?.property_number,
//                 total_pending_amount: propertyData?.total_pending_amount || collectPaymentDetails[0]?.total_pending_amount,
//                 owner_id: propertyData?.owner_id || collectPaymentDetails[0]?.owner_id,
//                 user_name: propertyData?.user_name || collectPaymentDetails[0]?.user_name,
//                 created_at: propertyData?.created_at || collectPaymentDetails[0]?.created_at,
//                 monthNo: propertyData?.monthNo || collectPaymentDetails[0]?.monthNo,
//                 user_maintenance_data: []
//             };
//             collectPaymentDetails.forEach((a) => {
//                 if (Array.isArray(a.user_maintenance_data) && a.user_maintenance_data.length > 0) {
//                     data.user_maintenance_data.push(a.user_maintenance_data[0]);
//                 }
//             });
//             setDataCombined(data);
//         }
//     }, [collectPaymentDetails, propertyData]);
//     console.log('dataCombined:', dataCombined);
//     const handleUpload = async (event, setFieldValue) => {
//         try {
//             const str = event.target.files[0]?.name;
//             const substr = ['.jpg', '.jpeg', '.png'];
//             let flag = false;
//             substr.forEach((a) => {
//                 if (str.includes(a)) {
//                     flag = true;
//                 }
//             });
//             if (flag) {
//                 setFieldValue('file', event.target.files[0]);
//                 setShowFile(URL.createObjectURL(event.target.files[0]));
//             } else {
//                 toast.error('Only Accept png , jpeg, jpg', {
//                     style: {
//                         marginTop: '4rem'
//                     }
//                 });
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const setDefaultDate = (val) => {
//         try {
//             const inputDateString = val;
//             const [day, month, year] = inputDateString.split('/').map(Number);
//             const dateObj = new Date(year, month - 1, day);
//             const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
//             const localTime = dateObj.getTime() - timezoneOffset;
//             const indiaOffset = 330 * 60000;
//             const indiaTime = localTime + indiaOffset;
//             const indiaDate = new Date(indiaTime);
//             return new Date(indiaDate.toString());
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const totalPayment = (val) => {
//         try {
//             const totalAmount = val.reduce((sum, item) => sum + item.amount, 0);
//             return totalAmount;
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const handleChequeFileUpload = async (event, setFieldValue) => {
//         try {
//             const file = event.target.files[0];
//             const allowedTypes = ['.jpg', '.jpeg', '.png'];
//             const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

//             if (allowedTypes.includes(fileExtension)) {
//                 setFieldValue('cheque_file', file);
//                 setChequeFile(URL.createObjectURL(file));
//             } else {
//                 toast.error('Only Accept png, jpeg, jpg', {
//                     style: { marginTop: '4rem' }
//                 });
//             }
//         } catch (error) {
//             console.error('Cheque file upload error:', error);
//         }
//     };
//     const handlePaymentReceiptUpload = async (event, setFieldValue) => {
//         try {
//             const file = event.target.files[0];
//             const allowedTypes = ['.jpg', '.jpeg', '.png'];
//             const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

//             if (allowedTypes.includes(fileExtension)) {
//                 setFieldValue('payment_receipt', file);
//                 setPaymentReceiptFile(URL.createObjectURL(file));
//             } else {
//                 toast.error('Only Accept png, jpeg, jpg', {
//                     style: { marginTop: '4rem' }
//                 });
//             }
//         } catch (error) {
//             console.error('Payment receipt upload error:', error);
//         }
//     };
//     return (
//         <Dialog visible={true} style={{ width: '50vw' }} header="Cheque Payment" modal className="p-fluid" onHide={onHide} draggable={false}>
//             <Formik
//                 initialValues={formValue}
//                 validationSchema={SignupSchema}
//                 enableReinitialize
//                 // onSubmit={(values) => {
//                 //     setSubmitted(true);
//                 //     setTimeout(() => {
//                 //         setSubmitted(false);
//                 //     }, 5000);
//                 //     if (!values.cheque_file || !values.payment_receipt) {
//                 //         toast.error('Please upload both Cheque Image and Payment Receipt', {
//                 //             style: { marginTop: '4rem' }
//                 //         });
//                 //         return;
//                 //     }
//                 //     const formData = new FormData();
//                 //     formData.append('user_property_assign_id', dataCombined?._id);
//                 //     formData.append(
//                 //         'maintainance_ids',
//                 //         dataCombined?.user_maintenance_data.map((x) => x._id)
//                 //     );
//                 //     formData.append('payment_type', 'cheque');
//                 //     formData.append('chequeNumber', values?.check_number);
//                 //     formData.append('bankName', values?.bank_name);
//                 //     formData.append('chequeDate', values?.check_date);
//                 //     formData.append('remark', values?.remark);
//                 //     formData.append('original_amount', totalPayment(dataCombined?.user_maintenance_data));
//                 //     formData.append('image', values.cheque_file);
//                 //     formData.append('receipt', values.payment_receipt);
//                 //     dispatch(checkPaymentCall(formData));
//                 // }}
//                 // Inside your onSubmit function in Formik, add console.logs to check the data:
//                 onSubmit={(values) => {
//                     setSubmitted(true);

//                     if (!values.cheque_file || !values.payment_receipt) {
//                         toast.error('Please upload both Cheque Image and Payment Receipt');
//                         return;
//                     }

//                     const formData = new FormData();
//                     formData.append('user_property_assign_id', dataCombined?._id);

//                     // Check if maintainance_ids is an array before using map
//                     const maintenanceIds = dataCombined?.user_maintenance_data?.map((x) => x._id);
//                     console.log('Maintenance IDs:', maintenanceIds); // Debug log
//                     formData.append('maintainance_ids', maintenanceIds);

//                     formData.append('payment_type', 'cheque');
//                     formData.append('chequeNumber', values?.check_number);
//                     formData.append('bankName', values?.bank_name);
//                     formData.append('chequeDate', values?.check_date);
//                     formData.append('remark', values?.remark);
//                     formData.append('original_amount', totalPayment(dataCombined?.user_maintenance_data));
//                     formData.append('image', values.cheque_file);
//                     formData.append('receipt', values.payment_receipt);

//                     // Log the FormData (for debugging)
//                     for (let pair of formData.entries()) {
//                         console.log(pair[0] + ': ' + pair[1]);
//                     }

//                     dispatch(checkPaymentCall(formData));
//                 }}
//             >
//                 {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
//                     <Form>
//                         <div className="card w-full ml-2 mt-2">
//                             <div className="grid p-fluid mt-1">
//                                 <div className="field col-12 md:col-6 mb-0">
//                                     <label className="text-600">
//                                         Owner Name:- <span className="text-900">{propertyData?.user_name || '-'}</span>
//                                     </label>
//                                 </div>
//                                 <div className="field col-12 md:col-6 mb-0">
//                                     <label className="text-600">
//                                         Property No.:- <span className="text-900">{dataCombined?.property_number ? dataCombined?.property_number : '-'}</span>
//                                     </label>
//                                 </div>
//                                 <div className="field col-12 md:col-6 mb-0">
//                                     <label className="text-600">
//                                         Amount:- <span className="text-900">₹ {new Intl.NumberFormat('en-IN').format(getTotalAmount(dataCombined) || 0)}</span>
//                                     </label>
//                                 </div>
//                                 <div className="field col-12 md:col-6 mb-0">
//                                     <label className="text-600">
//                                         Months:- <span className="text-900">{getTotalMonth(dataCombined) || '-'}</span>
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="grid p-fluid mt-1">
//                             <div className="field col-12 md:col-6 mb-0">
//                                 <label htmlFor="check_number" className="required">
//                                     Cheque Number
//                                 </label>
//                                 <InputText
//                                     id="check_number"
//                                     name="check_number"
//                                     placeholder="Enter Cheque Number"
//                                     type="text"
//                                     value={values?.check_number}
//                                     onChange={handleChange}
//                                     className={classNames({ 'p-invalid': errors.check_number && touched.check_number })}
//                                 />
//                                 <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
//                                     {errors.check_number && touched.check_number ? errors.check_number : ''}
//                                 </div>
//                             </div>
//                             <div className="field col-12 md:col-6 mb-0">
//                                 <label htmlFor="bank_name" className="required">
//                                     Bank Name
//                                 </label>
//                                 <InputText id="bank_name" name="bank_name" placeholder="Enter Bank Name" type="text" value={values?.bank_name} onChange={handleChange} className={classNames({ 'p-invalid': errors.bank_name && touched.bank_name })} />
//                                 <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
//                                     {errors.bank_name && touched.bank_name ? errors.bank_name : ''}
//                                 </div>
//                             </div>
//                             <div className="field col-12 md:col-6 mb-0">
//                                 <label htmlFor="check_date" className="required">
//                                     Cheque Date
//                                 </label>
//                                 <Calendar
//                                     id="check_date"
//                                     name="check_date"
//                                     placeholder="Please Select Date"
//                                     value={values?.check_date !== '' ? setDefaultDate(values?.check_date) : ''}
//                                     dateFormat="dd/mm/yy"
//                                     minDate={new Date()}
//                                     onChange={(e) => {
//                                         const dateString = new Date(e.target.value);
//                                         const day = dateString.getDate();
//                                         const month = dateString.getMonth() + 1;
//                                         const year = dateString.getFullYear();
//                                         const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
//                                         setFieldValue('check_date', formattedDate);
//                                     }}
//                                     className={classNames({ 'p-invalid': errors.check_date && touched.check_date })}
//                                 />
//                                 <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
//                                     {errors.check_date && touched.check_date ? errors.check_date : ''}
//                                 </div>
//                             </div>
//                             <div className="field col-12 md:col-6 mb-0">
//                                 <label htmlFor="remark" className="">
//                                     Remark
//                                 </label>
//                                 <InputTextarea rows="2" id="remark" name="remark" placeholder="Enter Remarks" value={values?.remark} onChange={handleChange} style={{ resize: 'none' }} />
//                             </div>
//                         </div>
//                         <div className="grid p-fluid mt-1">
//                             <div className="field col-12 md:col-6 mb-0">
//                                 {!values.cheque_file ? (
//                                     <div className="file-input-upload">
//                                         <input type="file" id="chequeFileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleChequeFileUpload(event, setFieldValue)} />
//                                         <label htmlFor="chequeFileInput" className="label">
//                                             <span>Upload Cheque Image...</span>
//                                         </label>
//                                     </div>
//                                 ) : (
//                                     <div className="flex align-items-center">
//                                         <Image src={chequeFile} alt="Cheque Image" width="100" height="100" preview />
//                                         <div className="ml-1">
//                                             <Button
//                                                 icon="pi pi-trash"
//                                                 className="p-button-rounded p-button-text p-button-danger"
//                                                 tooltip="Delete"
//                                                 tooltipOptions={{ position: 'bottom' }}
//                                                 onClick={() => {
//                                                     setFieldValue('cheque_file', null);
//                                                     setChequeFile(null);
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="field col-12 md:col-6 mb-0">
//                                 {!values.payment_receipt ? (
//                                     <div className="file-input-upload">
//                                         <input type="file" id="paymentReceiptInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handlePaymentReceiptUpload(event, setFieldValue)} />
//                                         <label htmlFor="paymentReceiptInput" className="label">
//                                             <span>Upload Payment Receipt...</span>
//                                         </label>
//                                     </div>
//                                 ) : (
//                                     <div className="flex align-items-center">
//                                         <Image src={paymentReceiptFile} alt="Payment Receipt" width="100" height="100" preview />
//                                         <div className="ml-1">
//                                             <Button
//                                                 icon="pi pi-trash"
//                                                 className="p-button-rounded p-button-text p-button-danger"
//                                                 tooltip="Delete"
//                                                 tooltipOptions={{ position: 'bottom' }}
//                                                 onClick={() => {
//                                                     setFieldValue('payment_receipt', null);
//                                                     setPaymentReceiptFile(null);
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="grid p-fluid mt-1">
//                             <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
//                                 <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={onHide} />
//                                 <Button disabled={submitted} label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
//                             </div>
//                         </div>
//                     </Form>
//                 )}
//             </Formik>
//         </Dialog>
//     );
// };
// export default CheckPaymentModel;

import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { monthlyMaintenanceUserWise, monthlyMaintenanceCreate, checkPaymentCall, imageUploadPayment, getAllCollectedAmountReaquest } from '../../../../redux/slice/AdminSlices/maintenanceSlice';
import toast from 'react-hot-toast';
import components from '../..';

const CheckPaymentModel = ({ getTotalAmount, getTotalMonth, propertyData, onHide, collectPaymentDetails, selectedRows }) => {
    const { InputText, InputTextarea, Calendar, Button, classNames, Dialog, Image, useDispatch } = components;
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [dataCombined, setDataCombined] = useState(null);
    const [chequeFile, setChequeFile] = useState(null);
    const [paymentReceiptFile, setPaymentReceiptFile] = useState(null);
    // const [selectedRows, setSelectedRows] = useState([]);
    const [showPayNowFooter, setShowPayNowFooter] = useState(false);
    const [multipleTableData, setMultipleTableData] = useState([]);
    const formValue = {
        remark: '',
        check_number: '',
        check_date: '',
        bank_name: '',
        cheque_file: null,
        payment_receipt: null
    };
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

    const SignupSchema = Yup.object().shape({
        check_number: Yup.string()
            .trim()
            .nullable()
            .matches(/^\d{6,10}$/, 'Please enter correct Cheque number.')
            .required('Please enter Cheque number.'),
        bank_name: Yup.string().trim().nullable().required('Please enter bank name.'),
        check_date: Yup.string().trim().nullable().required('Please select Cheque date.')
    });
    useEffect(() => {
        if (Array.isArray(collectPaymentDetails) && collectPaymentDetails.length > 0) {
            const data = {
                _id: propertyData?._id || collectPaymentDetails[0]?._id,
                property_id: propertyData?.property_id || collectPaymentDetails[0]?.property_id,
                property_number: propertyData?.property_number || collectPaymentDetails[0]?.property_number,
                total_pending_amount: propertyData?.total_pending_amount || collectPaymentDetails[0]?.total_pending_amount,
                owner_id: propertyData?.owner_id || collectPaymentDetails[0]?.owner_id,
                user_name: propertyData?.user_name || collectPaymentDetails[0]?.user_name,
                created_at: propertyData?.created_at || collectPaymentDetails[0]?.created_at,
                monthNo: propertyData?.monthNo || collectPaymentDetails[0]?.monthNo,
                user_maintenance_data: []
            };
            collectPaymentDetails.forEach((item) => {
                if (Array.isArray(item.user_maintenance_data) && item.user_maintenance_data.length > 0) {
                    data.user_maintenance_data.push(item.user_maintenance_data[0]);
                }
            });
            setDataCombined(data);
        }
    }, [collectPaymentDetails, propertyData]);
    console.log(dataCombined, 'dataCombinedddddddd');
    const handleFileUpload = (event, setFieldValue, fileType) => {
        try {
            const file = event.target.files[0];
            const allowedTypes = ['.jpg', '.jpeg', '.png'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

            if (allowedTypes.includes(fileExtension)) {
                setFieldValue(fileType, file);
                if (fileType === 'cheque_file') {
                    setChequeFile(URL.createObjectURL(file));
                } else {
                    setPaymentReceiptFile(URL.createObjectURL(file));
                }
            } else {
                toast.error('Only Accept png, jpeg, jpg', {
                    style: { marginTop: '4rem' }
                });
            }
        } catch (error) {
            console.error(`File upload error (${fileType}):`, error);
        }
    };

    const setDefaultDate = (dateString) => {
        try {
            const [day, month, year] = dateString.split('/').map(Number);
            const dateObj = new Date(year, month - 1, day);
            const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
            const localTime = dateObj.getTime() - timezoneOffset;
            const indiaOffset = 330 * 60000;
            const indiaTime = localTime + indiaOffset;
            return new Date(indiaTime);
        } catch (error) {
            console.error('Date conversion error:', error);
            return null;
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
    const validateFormData = (formData) => {
        const required = ['user_property_assign_id', 'maintainance_ids', 'payment_type', 'chequeNumber', 'bankName', 'chequeDate', 'original_amount', 'image', 'receipt'];

        const missingFields = [];
        for (let field of required) {
            if (!formData.get(field)) {
                missingFields.push(field);
            }
        }

        // if (missingFields.length > 0) {
        //     console.error('Missing required fields:', missingFields);
        //     return false;
        // }
        return true;
    };
    const handlePaymentReceiptUpload = async (event, setFieldValue) => {
        try {
            const file = event.target.files[0];
            const allowedTypes = ['.jpg', '.jpeg', '.png'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

            if (allowedTypes.includes(fileExtension)) {
                setFieldValue('payment_receipt', file);
                setPaymentReceiptFile(URL.createObjectURL(file));
            } else {
                toast.error('Only Accept png, jpeg, jpg', {
                    style: { marginTop: '4rem' }
                });
            }
        } catch (error) {
            console.error('Payment receipt upload error:', error);
        }
    };
    const totalPayment = (val) => {
        try {
            // Calculate total amount directly from array items
            const totalAmount = val.reduce((sum, item) => sum + item.amount, 0);
            return totalAmount;
        } catch (error) {
            console.log("Error calculating total payment:", error);
            return 0; // Return 0 or handle the error appropriately
        }
    };
    return (
        <Dialog visible={true} style={{ width: '50vw' }} header="Cheque Payment" modal className="p-fluid" onHide={onHide} draggable={false}>
            <Formik
                initialValues={formValue}
                validationSchema={SignupSchema}
                enableReinitialize
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        setSubmitted(true);
                        setSubmitting(true);
                        // Validation checks
                        if (!values.cheque_file) {
                            toast.error('Please upload Cheque Image');
                            setSubmitting(false);
                            return;
                        }
                        if (!selectedRows || selectedRows.length === 0) {
                            toast.error('Please select at least one maintenance record');
                            setSubmitting(false);
                            return;
                        }
                        if (!dataCombined?._id) {
                            toast.error('Property data is missing');
                            setSubmitting(false);
                            return;
                        }
                        // Get maintenance IDs and total amount
                        const selectedMaintenanceIds = selectedRows.map((row) => row._id).filter(Boolean);
                        const totalAmount = selectedRows.reduce((sum, row) => sum + (row.amount || 0), 0);
                        // Create FormData with all required fields
                        const formData = new FormData();
                        formData.append('user_property_assign_id', dataCombined._id);
                        formData.append('maintainance_ids', JSON.stringify(selectedMaintenanceIds));
                        formData.append('payment_type', 'cheque');
                        formData.append('original_amount', totalAmount.toString());
                        formData.append('remark', values.remark?.trim() || '');
                        formData.append('file', values.cheque_file);
                        // Log FormData contents for debugging
                        for (let pair of formData.entries()) {
                            console.log(pair[0] + ': ' + pair[1]);
                        }
                        // Set proper headers for multipart/form-data
                        const config = {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        };
                        // Make API call
                        const response = await dispatch(checkPaymentCall(formData, config));

                        if (response?.payload?.statusCode === 200) {
                            toast.success('Cheque payment processed successfully');
                            // Reset states
                            setSubmitted(false);
                            // setSelectedRows([]);
                            setMultipleTableData([]);
                            setShowPayNowFooter(false);
                            // Refresh maintenance list
                            callMonthlyMaintenanceUserWiseList(pagination);
                        } else {
                            throw new Error(response?.payload?.message);
                        }
                    } catch (error) {
                        console.error('Cheque Payment Processing Error:', {
                            message: error.message,
                            response: error.response?.data,
                            status: error.response?.status
                        });
                        // toast.error(
                        //     error.response?.data?.message ||
                        //     error.message ||
                        //     'Error processing cheque payment',
                        //     { toastId: 'error-toast' }
                        // );
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ values, setFieldValue, handleChange, errors, touched, isSubmitting }) => (
                    <Form>
                        <div className="card w-full ml-2 mt-2">
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-6 mb-0">
                                    <label className="text-600">
                                        Owner Name:- <span className="text-900">{dataCombined?.user_name || propertyData?.user_name || '-'}</span>
                                    </label>
                                </div>
                                <div className="field col-12 md:col-6 mb-0">
                                    <label className="text-600">
                                        Property No.:- <span className="text-900">{dataCombined?.property_number || '-'}</span>
                                    </label>
                                </div>
                                {/* <div className="field col-12 md:col-6 mb-0">
                                    <label className="text-600">
                                        Amount:-
                                        <span className="text-900">
                                            ₹
                                            {dataCombined?.user_maintenance_data?.length > 0
                                                ? new Intl.NumberFormat('en-IN').format(dataCombined?.user_maintenance_data[0]?.amount ? totalPayment(dataCombined?.user_maintenance_data) : getTotalAmount() || 0)
                                                : '-'}
                                        </span>
                                    </label>
                                </div> */}
                                 <div className="field col-12 md:col-6 mb-0">
                                    <label className="text-600">
                                        Amount:- <span className="text-900">
                                            ₹{' '}
                                            {dataCombined?.user_maintenance_data?.length > 0
                                                ? new Intl.NumberFormat('en-IN').format(totalPayment(dataCombined.user_maintenance_data))
                                                : new Intl.NumberFormat('en-IN').format(getTotalAmount() || 0)}
                                        </span>
                                    </label>
                                </div>
                                <div className="field col-12 md:col-6 mb-0">
                                    <label className="text-600">
                                        Months:-
                                        <span className="text-900">
                                            {dataCombined?.user_maintenance_data?.length > 0 ? dataCombined?.user_maintenance_data.map((x, i) => x.month + (dataCombined?.user_maintenance_data.length - 1 > i ? ', ' : '')) : getTotalMonth() || '-'}
                                        </span>
                                    </label>
                                </div>
                                {/* <div className="field col-12 md:col-6 mb-0">
                                    <label className="text-600">
                                        Amount:- <span className="text-900">₹ {new Intl.NumberFormat('en-IN').format(getTotalAmount() || 0)}</span>
                                    </label>
                                </div>
                                <div className="field col-12 md:col-6 mb-0">
                                    <label className="text-600">
                                        Months:- <span className="text-900">{getTotalMonth() || '-'}</span>
                                    </label>
                                </div> */}
                            </div>
                        </div>

                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-6 mb-0">
                                <label htmlFor="check_number" className="required">
                                    Cheque Number
                                </label>
                                <InputText
                                    id="check_number"
                                    name="check_number"
                                    placeholder="Enter Cheque Number"
                                    value={values.check_number}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.check_number && touched.check_number })}
                                />
                                <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                    {errors.check_number && touched.check_number ? errors.check_number : ''}
                                </div>
                            </div>

                            <div className="field col-12 md:col-6 mb-0">
                                <label htmlFor="bank_name" className="required">
                                    Bank Name
                                </label>
                                <InputText id="bank_name" name="bank_name" placeholder="Enter Bank Name" value={values.bank_name} onChange={handleChange} className={classNames({ 'p-invalid': errors.bank_name && touched.bank_name })} />
                                <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                    {errors.bank_name && touched.bank_name ? errors.bank_name : ''}
                                </div>
                            </div>

                            <div className="field col-12 md:col-6 mb-0">
                                <label htmlFor="check_date" className="required">
                                    Cheque Date
                                </label>
                                <Calendar
                                    id="check_date"
                                    name="check_date"
                                    placeholder="Please Select Date"
                                    value={values.check_date ? setDefaultDate(values.check_date) : null}
                                    dateFormat="dd/mm/yy"
                                    minDate={new Date()}
                                    onChange={(e) => {
                                        const date = new Date(e.value);
                                        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                                        setFieldValue('check_date', formattedDate);
                                    }}
                                    className={classNames({ 'p-invalid': errors.check_date && touched.check_date })}
                                />
                                <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                    {errors.check_date && touched.check_date ? errors.check_date : ''}
                                </div>
                            </div>

                            <div className="field col-12 md:col-6 mb-0">
                                <label htmlFor="remark">Remark</label>
                                <InputTextarea rows="2" id="remark" name="remark" placeholder="Enter Remarks" value={values.remark} onChange={handleChange} style={{ resize: 'none' }} />
                            </div>
                        </div>

                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-6 mb-0">
                                {!values.cheque_file ? (
                                    <div className="file-input-upload">
                                        <input type="file" id="chequeFileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(e) => handleFileUpload(e, setFieldValue, 'cheque_file')} />
                                        <label htmlFor="chequeFileInput" className="label">
                                            <span>Upload Cheque Image...</span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="flex align-items-center">
                                        <Image src={chequeFile} alt="Cheque Image" width="100" preview />
                                        <div className="ml-1">
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-rounded p-button-text p-button-danger"
                                                tooltip="Delete"
                                                tooltipOptions={{ position: 'bottom' }}
                                                onClick={() => {
                                                    setFieldValue('cheque_file', null);
                                                    setChequeFile(null);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="field col-12 md:col-6 mb-0">
                                {!values.payment_receipt ? (
                                    <div className="file-input-upload">
                                        <input type="file" id="paymentReceiptInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handlePaymentReceiptUpload(event, setFieldValue)} />
                                        <label htmlFor="paymentReceiptInput" className="label">
                                            <span>Upload Payment Receipt...</span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="flex align-items-center">
                                        <Image src={paymentReceiptFile} alt="Payment Receipt" width="100" height="100" preview />
                                        <div className="ml-1">
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-rounded p-button-text p-button-danger"
                                                tooltip="Delete"
                                                tooltipOptions={{ position: 'bottom' }}
                                                onClick={() => {
                                                    setFieldValue('payment_receipt', null);
                                                    setPaymentReceiptFile(null);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={onHide} />
                                <Button disabled={submitted} label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
export default CheckPaymentModel;
