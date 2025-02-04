// import { Form, Formik } from 'formik';
// import { InputTextarea } from 'primereact/inputtextarea';
// import React from 'react';
// import toast from 'react-hot-toast';
// import { useParams } from 'react-router-dom';
// import * as Yup from 'yup';
// import components from '../..';
// import LoaderUi from '../../../../components/Loader';
// import { gateKeeperCreateRequest, getGateKeeperById, updateGateKeeperAssignRequest } from '../../../../redux/slice/AdminSlices/getKepperSlice';
// const GateKeeperAdd = () => {
//     const { BreadCrumb, Button, InputText, Image, InputNumber, Checkbox, Dropdown, Calendar, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
//     const params = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { isCreated, vendorDataById, isLoading: isLoading1 } = useSelector((store) => store.gatekeeper);
//     const [submitted, setSubmitted] = useState(false);
//     const [showFile, setShowFile] = useState(null);
//     const [shiftTypes] = useState([
//         { label: 'Morning', value: 'Morning' },
//         { label: 'Evening', value: 'Evening' }
//     ]);
//     const [formValue, setFormValue] = useState({
//         name: '',
//         profile: null,
//         email: '',
//         mobile_number: '',
//         duty_location: '',
//         start_date: '',
//         end_date: '',
//         is_active: true,
//         shift_type: '',
//         address: ''
//     });
//     useEffect(() => {
//         if (isCreated) {
//             navigate('/property-management/gate-keeper');
//         }
//     }, [isCreated]);
//     const formatDateToString = (date) => {
//         if (!date) return '';
//         // If it's already a string in YYYY-MM-DD format, return as is
//         if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
//             return date;
//         }
//         // Convert to Date object if it isn't already
//         const dateObj = date instanceof Date ? date : new Date(date);
//         // Add one day to compensate for timezone offset
//         dateObj.setDate(dateObj.getDate() + 1);
//         return dateObj.toISOString().split('T')[0];
//     };
//     const parseStringToDate = (dateString) => {
//         if (!dateString) return null;
//         const date = new Date(dateString);
//         // Subtract one day to compensate for timezone offset when displaying
//         date.setDate(date.getDate() - 1);
//         return date;
//     };

//     // Validation Schema
//     const GateKeeperSchema = Yup.object().shape({
//         name: Yup.string().trim().required('Please enter name'),
//         mobile_number: Yup.string().trim().min(10, 'Mobile no must be at least 10 digit no.').max(10, 'Mobile no must be at least 10 digit no.').required('Please enter mobile number.'),
//         start_date: Yup.string().required('Start date is required'),
//         shift_type: Yup.string().required('Please select shift type'),
//         address: Yup.string().trim().required('Please enter address'),
//         profile: Yup.mixed()
//             .test('fileSize', 'File too large', (value) => {
//                 if (!value) return true; // Skip if no file
//                 return value.size <= 5 * 1024 * 1024; // 5MB limit
//             })
//             .test('fileType', 'Unsupported file type', (value) => {
//                 if (!value) return true; // Skip if no file
//                 const supportedTypes = ['image/jpeg', 'image/png'];
//                 return supportedTypes.includes(value.type);
//             })
//             .required('Please enter profile photo')
//     });

//     // Fetch existing gate keeper data for edit
//     useEffect(() => {
//         if (params.id) {
//             dispatch(getGateKeeperById(params.id));
//         }
//     }, [params.id, dispatch]);

//     // Populate form with existing data when editing
//     useEffect(() => {
//         if (params.id && vendorDataById && vendorDataById._id) {
//             let setData = {
//                 id: vendorDataById?._id,
//                 name: vendorDataById?.name,
//                 email: vendorDataById?.email,
//                 mobile_number: vendorDataById?.mobile_number,
//                 duty_location: vendorDataById?.duty_location,
//                 start_date: formatDateToString(vendorDataById.start_date),
//                 end_date: vendorDataById.end_date ? formatDateToString(vendorDataById.end_date) : '',
//                 is_active: vendorDataById?.is_active || true,
//                 shift_type: vendorDataById?.shift_type,
//                 address: vendorDataById?.address,
//                 profile: vendorDataById?.profile_image ? vendorDataById?.profile_image : null
//             };
//             vendorDataById?.profile_image && setShowFile(`${vendorDataById?.profile_image}`);
//             setFormValue(setData);
//         }
//     }, [vendorDataById]);

//     // Breadcrumb configuration
//     const breadcrumbHome = {
//         label: 'Gate Keepers',
//         command: () => navigate('/property-management/gate-keepers')
//     };
//     const breadcrumbItems = [
//         {
//             label: params?.id ? 'Edit Gate Keeper' : 'Create Gate Keeper'
//         }
//     ];

//     // File upload handler
//     const handleUpload = (event, setFieldValue) => {
//         try {
//             const file = event.target.files[0];
//             const supportedTypes = ['.jpg', '.jpeg', '.png'];
//             const fileExt = '.' + file.name.split('.').pop().toLowerCase();

//             if (supportedTypes.includes(fileExt)) {
//                 setFieldValue('profile', file);
//                 setShowFile(URL.createObjectURL(file));
//             } else {
//                 toast.error('Only .png, .jpg, and .jpeg files are allowed.', {
//                     style: { marginTop: '4rem' }
//                 });
//             }
//         } catch (error) {
//             console.error('File upload error:', error);
//         }
//     };
//     return (
//         <div className="relative min-h-full">
//             <LoaderUi isLoading={isLoading1} />
//             <div className="flex justify-content-between align-items-center">
//                 <div className="flex flex-row w-full">
//                     <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Gate Keeper' : 'Create Gate Keeper'}</h5>
//                     <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                 </div>
//             </div>
//             <div className="crud-demo ml-0 mr-0 card mt-3">
//                 <Formik
//                     initialValues={formValue}
//                     validationSchema={GateKeeperSchema}
//                     enableReinitialize
//                     onSubmit={(values) => {
//                         console.log('values: ', values);
//                         setSubmitted(true);

//                         // Format dates to strings
//                         const formatDate = (date) => {
//                             if (!date) return '-';
//                             // Assuming date is a Date object from Calendar component
//                             return date instanceof Date
//                                 ? date.toISOString().split('T')[0] // formats to 'YYYY-MM-DD'
//                                 : date;
//                         };

//                         // Prepare data for submission
//                         let sendData = {
//                             name: values.name,
//                             email: values.email,
//                             mobile_number: values.mobile_number,
//                             duty_location: values.duty_location,
//                             start_date: formatDateToString(values.start_date),
//                             end_date: values.end_date ? formatDateToString(values.end_date) : '',
//                             shift: values.shift_type,
//                             address: values.address,
//                             profile: values.profile
//                         };

//                         // Dispatch create or update action based on context
//                         if (!values.id) {
//                             dispatch(gateKeeperCreateRequest(sendData));
//                         } else {
//                             dispatch(updateGateKeeperAssignRequest(values.id, sendData));
//                         }

//                         // Reset submission state after 5 seconds
//                         setTimeout(() => setSubmitted(false), 5000);
//                     }}
//                 >
//                     {({ values, setFieldValue, handleChange, errors, touched }) => (
//                         <Form>
//                             <div className="grid p-fluid mt-1">
//                                 {/* Name */}
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="name" className="required">
//                                         Name
//                                     </label>
//                                     <InputText
//                                         id="name"
//                                         name="name"
//                                         placeholder="Enter Name"
//                                         value={values.name}
//                                         onChange={handleChange}
//                                         className={classNames({
//                                             'p-invalid': errors.name && touched.name
//                                         })}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.name && touched.name ? errors.name : ''}</div>
//                                 </div>
//                                 {/* Email */}
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="email">Email</label>
//                                     <InputText
//                                         id="email"
//                                         name="email"
//                                         placeholder="Enter Email"
//                                         value={values.email}
//                                         onChange={handleChange}
//                                         className={classNames({
//                                             'p-invalid': errors.email && touched.email
//                                         })}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.email && touched.email ? errors.email : ''}</div>
//                                 </div>
//                                 {/* Mobile Number */}
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="mobile_number" className="required">
//                                         Mobile Number
//                                     </label>
//                                     <InputText
//                                         id="mobile_number"
//                                         name="mobile_number"
//                                         placeholder="Enter Mobile Number"
//                                         value={values.mobile_number}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             // Only allow numeric input
//                                             if (/^\d*$/.test(value)) {
//                                                 setFieldValue('mobile_number', value);
//                                             }
//                                         }}
//                                         useGrouping={false}
//                                         maxLength={10}
//                                         className={classNames({
//                                             'p-invalid': errors.mobile_number && touched.mobile_number
//                                         })}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.mobile_number && touched.mobile_number ? errors.mobile_number : ''}</div>
//                                 </div>
//                                 {/* Duty Location */}
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="duty_location">Duty Location</label>
//                                     <InputText
//                                         id="duty_location"
//                                         name="duty_location"
//                                         placeholder="Enter Duty Location"
//                                         value={values.duty_location}
//                                         onChange={handleChange}
//                                         className={classNames({
//                                             'p-invalid': errors.duty_location && touched.duty_location
//                                         })}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.duty_location && touched.duty_location ? errors.duty_location : ''}</div>
//                                 </div>

//                                 {/* Start Date */}
//                                 {/* <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="start_date" className="required">
//                                         Start Date
//                                     </label>
//                                     <Calendar
//                                         id="start_date"
//                                         name="start_date"
//                                         value={values.start_date}
//                                         placeholder="Enter Start Date"
//                                         onChange={(e) => {
//                                             setFieldValue('start_date', e.value);
//                                         }}
//                                         showIcon
//                                         dateFormat="yy-mm-dd" // Add this line to ensure consistent format
//                                         className={classNames({
//                                             'p-invalid': errors.start_date && touched.start_date
//                                         })}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.start_date && touched.start_date ? errors.start_date : ''}</div>
//                                 </div> */}
//                                 {/* Start Date */}

//                                 {/* End Date */}
//                                 {/* <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="end_date">End Date</label>
//                                     <Calendar
//                                         id="end_date"
//                                         name="end_date"
//                                         value={values.end_date}
//                                         placeholder="Enter End Date"
//                                         onChange={(e) => {
//                                             setFieldValue('end_date', e.value);
//                                         }}
//                                         // dateFormat="dd/mm/yy"
//                                         showIcon
//                                         className={classNames({
//                                             'p-invalid': errors.end_date && touched.end_date
//                                         })}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.end_date && touched.end_date ? errors.end_date : ''}</div>
//                                 </div> */}
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="start_date" className="required">
//                                         Start Date
//                                     </label>
//                                     <Calendar
//                                         id="start_date"
//                                         name="start_date"
//                                         value={values.start_date}
//                                         placeholder="Enter Start Date"
//                                         onChange={(e) => {
//                                             setFieldValue('start_date', e.value);
//                                         }}
//                                         showIcon
//                                         dateFormat="yy-mm-dd"
//                                         className={classNames({
//                                             'p-invalid': errors.start_date && touched.start_date
//                                         })}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.start_date && touched.start_date ? errors.start_date : ''}</div>
//                                 </div>

//                                 {/* End Date Calendar */}
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="end_date">End Date</label>
//                                     <Calendar
//                                         id="end_date"
//                                         name="end_date"
//                                         value={values.end_date}
//                                         placeholder="Enter End Date"
//                                         onChange={(e) => {
//                                             setFieldValue('end_date', e.value);
//                                         }}
//                                         showIcon
//                                         dateFormat="yy-mm-dd"
//                                         className={classNames({
//                                             'p-invalid': errors.end_date && touched.end_date
//                                         })}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.end_date && touched.end_date ? errors.end_date : ''}</div>
//                                 </div>

//                                 {/* Shift Type */}
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="shift_type" className="required">
//                                         Shift Type
//                                     </label>
//                                     <Dropdown
//                                         id="shift_type"
//                                         name="shift_type"
//                                         options={shiftTypes}
//                                         value={values.shift_type}
//                                         onChange={(e) => {
//                                             setFieldValue('shift_type', e.value);
//                                         }}
//                                         placeholder="Select Shift Type"
//                                         className={classNames({
//                                             'p-invalid': errors.shift_type && touched.shift_type
//                                         })}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.shift_type && touched.shift_type ? errors.shift_type : ''}</div>
//                                 </div>

//                                 {/* Address */}
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="address" className="required">
//                                         Address
//                                     </label>
//                                     <InputTextarea
//                                         rows="2"
//                                         cols="30"
//                                         id="address"
//                                         name="address"
//                                         placeholder="Enter Address"
//                                         value={values.address}
//                                         onChange={handleChange}
//                                         className={classNames({
//                                             'p-invalid': errors.address && touched.address
//                                         })}
//                                         style={{ resize: 'none' }}
//                                     />
//                                     <div className="p-invalid error text-xs">{errors.address && touched.address ? errors.address : ''}</div>
//                                 </div>

//                                 {/* Profile Image Upload */}
//                                 {values.profile === null && (
//                                     <div className="field col-12 md:col-4 mb-1 pt-5">
//                                         <div className="file-input-upload">
//                                             <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
//                                             <label htmlFor="fileInput" className="label">
//                                                 <span>Upload Profile Image...</span>
//                                             </label>
//                                         </div>
//                                         <div className="p-invalid error text-xs mt-1">{errors.profile && touched.profile ? errors.profile : ''}</div>
//                                     </div>
//                                 )}

//                                 {/* Profile Image Preview */}
//                                 {values.profile !== null && (
//                                     <div className="flex align-items-center field col-12 md:col-4 mb-1 pt-5">
//                                         <div className="relative" style={{ width: '100px', height: '100px' }}>
//                                             <Image alt="Profile" src={showFile} width="100" height="100" preview />
//                                             <div
//                                                 className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
//                                                 style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
//                                                 onClick={() => {
//                                                     setFieldValue('profile', null);
//                                                     setShowFile(null);
//                                                 }}
//                                             >
//                                                 <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Notes on File Upload */}
//                                 <div className="p-invalid error text-xl mt-4" style={{ minHeight: '1.1rem', marginTop: '3px', width: '80rem' }}>
//                                     {'Notes :- '}
//                                     <span className="text-base">{'Only JPEG, JPG, PNG files are supported. Max file size is 5MB.'}</span>
//                                 </div>

//                                 {/* Form Action Buttons */}
//                                 <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
//                                     <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/gate-keeper')} />
//                                     <Button disabled={submitted} label={values.id === '' ? 'Save' : 'Update'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
//                                 </div>
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </div>
//     );
// };
// export default GateKeeperAdd;

import { Form, Formik } from 'formik';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import components from '../..';
import LoaderUi from '../../../../components/Loader';
import { gateKeeperCreateRequest, getGateKeeperById, updateGateKeeperAssignRequest, fetchContractTypes } from '../../../../redux/slice/AdminSlices/getKepperSlice';

const GateKeeperAdd = () => {
    const { InputSwitch, BreadCrumb, Button, InputText, Image, Dropdown, Calendar, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
    const params = useParams();
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const { types = [], isCreated, vendorDataById, isLoading: isLoading1, errors } = useSelector((store) => store.gatekeeper);
    const {
        types = [],
        isCreated,
        vendorDataById,
        isLoading: isLoading1,
        errors,
        generalListData
    } = useSelector((store) => ({
        ...store.gatekeeper,
        types: store.gatekeeper.types // Add this
    }));
    const [submitted, setSubmitted] = useState(false);
    const [showFile, setShowFile] = useState(null);
    const [showIdProof, setShowIdProof] = useState(null);
    const [showIdProofs, setShowIdProofs] = useState([]);
    const [shiftTypes] = useState([
        { label: 'Morning', value: 'Morning' },
        { label: 'Evening', value: 'Evening' }
    ]);
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
    const editeDate = (dateStr) => {
        try {
            // let [year, month, day] = val.split('T')[0].split("-").map(Number);
            // const dateObj = new Date(year, month - 1, day);
            // re
            const date = new Date(dateStr);
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            return formattedDate;
        } catch (error) {}
    };
    const setYYYYMMDD = (val) => {
        try {
            if (!val) return '';

            const inputDateStr = val;
            const parts = inputDateStr.split('/');

            if (parts.length !== 3) return '';

            const [day, month, year] = parts;
            const date = new Date(year, month - 1, day);

            if (isNaN(date.getTime())) return '';

            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');

            return `${yyyy}-${mm}-${dd}`;
        } catch (error) {
            console.error('Date conversion error:', error);
            return '';
        }
    };
    const [contractTypes, setContractTypes] = useState([]);
    const [selectedContractType, setSelectedContractType] = useState('');
    const [formValue, setFormValue] = useState({
        name: '',
        profile: null,
        // id_proof_files: null,
        id_proof_files: [],
        email: '',
        mobile_number: '',
        duty_location: '',
        start_date: '',
        end_date: '',
        is_active: true,
        shift_type: '',
        address: '',
        is_contract_based: false,
        contract_id: ''
    });

    useEffect(() => {
        if (isCreated) {
            navigate('/property-management/gate-keeper');
        }
    }, [isCreated]);

    useEffect(() => {
        dispatch(fetchContractTypes());
    }, [dispatch]);

    const GateKeeperSchema = Yup.object().shape({
        name: Yup.string().trim().required('Please enter name'),
        mobile_number: Yup.string().trim().min(10, 'Mobile no must be at least 10 digit no.').max(10, 'Mobile no must be at least 10 digit no.').required('Please enter mobile number.'),
        start_date: Yup.string().required('In time is required'),
        end_date: Yup.string().test('end_date', 'Out time must be greater than In time', function (value, context) {
            if (!value || !context.parent.start_date) return true; // Skip validation if either date is not set

            // Convert dates to comparable format
            const startDate = context.parent.start_date.split('/').reverse().join('-');
            const endDate = value.split('/').reverse().join('-');

            return new Date(endDate) >= new Date(startDate);
        }),
        shift_type: Yup.string().required('Please select shift type'),
        address: Yup.string().trim().required('Please enter address'),
        profile: Yup.mixed()
            .test('fileSize', 'File too large', (value) => {
                // Skip validation if no new file is being uploaded
                if (!value || typeof value === 'string') return true;
                return value.size <= 5 * 1024 * 1024;
            })
            .test('fileType', 'Unsupported file type', (value) => {
                // Skip validation if no new file is being uploaded
                if (!value || typeof value === 'string') return true;
                const supportedTypes = ['image/jpeg', 'image/png'];
                return supportedTypes.includes(value.type);
            }),
        id_proof_files: Yup.array().of(
            Yup.mixed()
                .test('fileSize', 'File too large', (value) => {
                    if (!value || typeof value === 'string') return true;
                    return value.size <= 5 * 1024 * 1024;
                })
                .test('fileType', 'Unsupported file type', (value) => {
                    if (!value || typeof value === 'string') return true;
                    const supportedTypes = ['image/jpeg', 'image/png'];
                    return supportedTypes.includes(value.type);
                })
        )
    });
    useEffect(() => {
        if (params.id) {
            dispatch(getGateKeeperById(params.id));
        }
    }, [params.id, dispatch]);
    // useEffect(() => {
    //     if (params.id && vendorDataById && vendorDataById._id) {
    //         let setData = {
    //             id: vendorDataById?._id,
    //             name: vendorDataById?.name,
    //             email: vendorDataById?.email,
    //             mobile_number: vendorDataById?.mobile_number,
    //             duty_location: vendorDataById?.duty_location,
    //             // start_date: vendorDataById?.start_date ? new Date(vendorDataById.start_date) : null,
    //             start_date: editeDate(vendorDataById?.start_date),
    //             // end_date: vendorDataById?.end_date ? new Date(vendorDataById.end_date) : null,
    //             end_date: editeDate(vendorDataById?.end_date),
    //             is_active: vendorDataById?.is_active || true,
    //             shift_type: vendorDataById?.shift_type,
    //             address: vendorDataById?.address,
    //             profile: vendorDataById?.profile ? vendorDataById?.profile : null,
    //             // id_proof_files: vendorDataById?.id_proof_files ? vendorDataById?.id_proof_files : null,
    //             // id_proof: Array.isArray(vendorDataById?.id_proof_files) ? vendorDataById.id_proof_files : null
    //             id_proof_files: vendorDataById?.id_proof || []
    //             // is_contract_based: true,
    //             // contract_id: vendorDataById?.contract_id.company_name,
    //             // is_contract_based: vendorDataById?.contract_id?.company_name ? true : false,
    //             // contract_id: vendorDataById?.contract_id?.company_name || ''
    //         };
    //         vendorDataById?.profile && setShowFile(`${BASE_URL_API}gatekeeper/${vendorDataById?.profile}`);
    //         // vendorDataById?.id_proof_files && setShowIdProof(`${BASE_URL_API}gatekeeper/${vendorDataById?.id_proof_files}`);
    //         // vendorDataById?.id_proof && setShowIdProof(vendorDataById.id_proof.map((file) => `${BASE_URL_API}gatekeeper/${file}`));
    //         if (vendorDataById?.id_proof && Array.isArray(vendorDataById.id_proof)) {
    //             const proofUrls = vendorDataById.id_proof.map((file) => `${BASE_URL_API}gatekeeper/${file}`);
    //             setShowIdProofs(proofUrls);
    //         }
    //         setFormValue(setData);
    //     }
    // }, [vendorDataById]);
    useEffect(() => {
        if (params.id && vendorDataById && vendorDataById._id) {
            let setData = {
                id: vendorDataById?._id,
                name: vendorDataById?.name,
                email: vendorDataById?.email,
                mobile_number: vendorDataById?.mobile_number,
                duty_location: vendorDataById?.duty_location,
                start_date: editeDate(vendorDataById?.start_date),
                end_date: editeDate(vendorDataById?.end_date),
                is_active: vendorDataById?.is_active || true,
                shift_type: vendorDataById?.shift_type,
                address: vendorDataById?.address,
                // Update these lines to handle the image paths
                profile: vendorDataById?.profile || null,
                id_proof_files: vendorDataById?.id_proof || []
            };

            // Set the profile image preview
            if (vendorDataById?.profile) {
                setShowFile(`${BASE_URL_API}gatekeeper/${vendorDataById.profile}`);
            }

            // Set the ID proof previews
            if (vendorDataById?.id_proof && Array.isArray(vendorDataById.id_proof)) {
                const proofUrls = vendorDataById.id_proof.map(file =>
                    `${BASE_URL_API}gatekeeper/${file}`
                );
                setShowIdProofs(proofUrls);
            }

            setFormValue(setData);
        }
    }, [vendorDataById, BASE_URL_API]);
    const breadcrumbHome = {
        label: 'Gate Keepers',
        command: () => navigate('/property-management/gate-keeper')
    };
    const breadcrumbItems = [
        {
            label: params?.id ? 'Edit Gate Keeper' : 'Create Gate Keeper'
        }
    ];
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (typeof file === 'string' && (file.startsWith('data:image') || file.startsWith('https://'))) {
                resolve(file); // Return existing Base64 or URL as is
            } else if (file instanceof File) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            } else {
                resolve(file); // Return as is if neither Base64 nor File
            }
        });
    };
    const handleUpload = async (event, setFieldValue) => {
        try {
            const file = event.target.files[0];
            const supportedTypes = ['.jpg', '.jpeg', '.png'];
            const fileExt = '.' + file.name.split('.').pop().toLowerCase();

            if (supportedTypes.includes(fileExt)) {
                // Convert to Base64 before setting
                const base64String = await convertFileToBase64(file);
                setFieldValue('profile', base64String);
                setShowFile(URL.createObjectURL(file));
            } else {
                toast.error('Only .png, .jpg, and .jpeg files are allowed.', {
                    style: { marginTop: '4rem' }
                });
            }
        } catch (error) {
            console.error('File upload error:', error);
        }
    };
    const handleUploadIdProof = async (event, setFieldValue, values) => {
        try {
            const files = Array.from(event.target.files);
            const validFiles = files.filter(file => {
                const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                return supportedTypes.includes(file.type);
            });

            if (validFiles.length !== files.length) {
                toast.error('Only .png, .jpg, and .jpeg files are allowed.', {
                    style: { marginTop: '4rem' }
                });
                return;
            }

            // Convert new files to base64
            const base64Promises = validFiles.map(file => convertFileToBase64(file));
            const base64Files = await Promise.all(base64Promises);

            // Combine existing files with new ones
            const existingFiles = Array.isArray(values.id_proof_files) ? values.id_proof_files : [];
            const updatedFiles = [...existingFiles, ...base64Files];
            setFieldValue('id_proof_files', updatedFiles);

            // Update previews
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setShowIdProofs(prev => [...prev, ...newPreviews]);
        } catch (error) {
            console.error('File upload error:', error);
            toast.error('Error uploading files');
        }
    };

    // Modified removeIdProof to handle both new and existing files
    const removeIdProof = (index, setFieldValue, values) => {
        const updatedFiles = [...values.id_proof_files];
        updatedFiles.splice(index, 1);
        setFieldValue('id_proof_files', updatedFiles);

        const updatedPreviews = [...showIdProofs];
        updatedPreviews.splice(index, 1);
        setShowIdProofs(updatedPreviews);
    };
    useEffect(() => {
        if (types.length) {
            setContractTypes(types);
        }
    }, [types]);
    const formatContractTypes = (types) => {
        if (!Array.isArray(types)) return [];
        return types.map((type) => ({
            label: type.name || type.label || type._id, // Adjust based on your API response
            value: type._id || type.value,
            ...type
        }));
    };
    useEffect(() => {
        if (types && Array.isArray(types)) {
            const formattedTypes = formatContractTypes(types);
            setContractTypes(formattedTypes);
        }
    }, [types]);
    return (
        <div className="relative min-h-full">
            <LoaderUi isLoading={isLoading1} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Gate Keeper' : 'Create Gate Keeper'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={GateKeeperSchema}
                    enableReinitialize
                    // onSubmit={(values) => {
                    //     setSubmitted(true);
                    //     const formData = new FormData();
                    //     formData.append('name', values.name.trim());
                    //     formData.append('email', values.email.trim());
                    //     formData.append('mobile_number', values.mobile_number.trim());
                    //     formData.append('duty_location', values.duty_location); // Handle null value
                    //     formData.append('is_contract_based', values.is_contract_based);

                    //     if (values.is_contract_based) {
                    //         formData.append('contract_id', values.contract_id);
                    //     }

                    //     // Format dates properly as strings
                    //     if (values.start_date) {
                    //         formData.append('start_date', setYYYYMMDD(values?.start_date));
                    //         // const startDate = new Date(values.start_date);
                    //         // const formattedStartDate = startDate.toISOString().split('T')[0];
                    //         // formData.append('start_date', formattedStartDate);
                    //     }

                    //     if (values.end_date) {
                    //         // const endDate = new Date(values.end_date);
                    //         // const formattedEndDate = endDate.toISOString().split('T')[0];
                    //         // formData.append('end_date', formattedEndDate);
                    //         formData.append('end_date', setYYYYMMDD(values?.end_date));
                    //     }

                    //     formData.append('shift', values.shift_type);
                    //     formData.append('address', values.address.trim());
                    //     // Profile Image (Required)
                    //     if (values.profile instanceof File) {
                    //         formData.append('profile', values.profile);
                    //     } else if (typeof values.profile === 'string' && values.profile.startsWith('data:image')) {
                    //         // Handle base64 profile image
                    //         const base64Data = values.profile.split(',')[1];
                    //         formData.append('profile', base64Data);
                    //     } else if (typeof values.profile === 'string') {
                    //         // Handle existing profile image
                    //         formData.append('profile', values.profile);
                    //     }

                    //     // ID Proofs (as array)
                    //     if (Array.isArray(values.id_proof_files) && values.id_proof_files.length > 0) {
                    //         // Create an array to store all ID proofs
                    //         const idProofs = [];

                    //         values.id_proof_files.forEach((file, index) => {
                    //             if (file instanceof File) {
                    //                 // New file upload
                    //                 formData.append(`id_proof_files`, file);
                    //                 idProofs.push({
                    //                     type: 'new',
                    //                     index: index
                    //                 });
                    //             } else if (typeof file === 'string' && file.startsWith('data:image')) {
                    //                 // Base64 image
                    //                 const base64Data = file.split(',')[1];
                    //                 formData.append(`id_proof_files[${index}]`, base64Data);
                    //                 idProofs.push({
                    //                     type: 'base64',
                    //                     index: index
                    //                 });
                    //             } else if (typeof file === 'string') {
                    //                 // Existing file
                    //                 formData.append(`existing_id_proof_files[${index}]`, file);
                    //                 idProofs.push({
                    //                     type: 'existing',
                    //                     index: index
                    //                 });
                    //             }
                    //         });
                    //         // Log formData for debugging
                    //         for (let pair of formData.entries()) {
                    //             console.log(pair[0] + ': ' + pair[1]);
                    //         }

                    //         if (!values.id) {
                    //             dispatch(gateKeeperCreateRequest(formData));
                    //         } else {
                    //             dispatch(updateGateKeeperAssignRequest(values.id, formData));
                    //         }

                    //         setTimeout(() => setSubmitted(false), 5000);
                    //     }
                    // }}
                    onSubmit={(values) => {
                        setSubmitted(true);
                        const payload = {
                            name: values.name.trim(),
                            mobile_number: values.mobile_number.trim(),
                            shift: values.shift_type || 'Morning',
                            address: values.address.trim(),
                            email: values.email.trim(),
                            start_date: values.start_date ? setYYYYMMDD(values.start_date) : null,
                            end_date: values.end_date ? setYYYYMMDD(values.end_date) : null,
                            duty_location: values.duty_location || '',
                            profile: '',  // Will be populated below
                            id_proof_files: []  // Will be populated below
                        };

                        // Handle profile image
                        if (values.profile instanceof File) {
                            // Convert File to Base64
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                payload.profile = e.target.result;
                            };
                            reader.readAsDataURL(values.profile);
                        } else if (typeof values.profile === 'string' && values.profile.startsWith('data:image')) {
                            payload.profile = values.profile;  // Already in Base64
                        } else if (typeof values.profile === 'string') {
                            payload.profile = values.profile;  // Existing image path
                        }

                        // Handle ID proof files
                        if (Array.isArray(values.id_proof_files) && values.id_proof_files.length > 0) {
                            Promise.all(values.id_proof_files.map(file => {
                                return new Promise((resolve) => {
                                    if (file instanceof File) {
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            resolve(e.target.result);
                                        };
                                        reader.readAsDataURL(file);
                                    } else if (typeof file === 'string' && file.startsWith('data:image')) {
                                        resolve(file);  // Already in Base64
                                    } else if (typeof file === 'string') {
                                        resolve(file);  // Existing file path
                                    }
                                });
                            })).then(base64Files => {
                                payload.id_proof_files = base64Files;

                                // Dispatch the appropriate action with the final payload
                                if (!values.id) {
                                    dispatch(gateKeeperCreateRequest(payload));
                                } else {
                                    dispatch(updateGateKeeperAssignRequest(values.id, payload));
                                }
                            });
                        } else {
                            // If no ID proof files, dispatch immediately
                            if (!values.id) {
                                dispatch(gateKeeperCreateRequest(payload));
                            } else {
                                dispatch(updateGateKeeperAssignRequest(values.id, payload));
                            }
                        }

                        // Reset submission state
                        setTimeout(() => setSubmitted(false), 5000);
                    }}

                >
                    {({ values, setFieldValue, handleChange, errors, touched }) => (
                        <Form>
                            {/* {!params.id && (
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="is_contract_based">Is Gatekeeper Contract Based?</label>
                                    <div className="flex align-items-center">
                                        <InputSwitch
                                            id="is_contract_based"
                                            checked={values.is_contract_based}
                                            onChange={(e) => {
                                                setFieldValue('is_contract_based', e.value);
                                                if (!e.value) {
                                                    setFieldValue('contract_id', '');
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            {values.is_contract_based && (
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="contract_id">Contract Name</label>
                                    <Dropdown
                                        id="contract_id"
                                        name="contract_id"
                                        value={values.contract_id}
                                        options={contractTypes}
                                        onChange={(e) => {
                                            setFieldValue('contract_id', e.value);
                                        }}
                                        optionLabel="label"
                                        placeholder="Select Contract Name"
                                        className={classNames({
                                            'p-invalid': errors.contract_id && touched.contract_id
                                        })}
                                        style={{ width: '100%' }}
                                    />
                                    {errors.contract_id && touched.contract_id && <div className="p-invalid error text-xs">{errors.contract_id}</div>}
                                    <div style={{ display: 'none' }}>
                                        <p>Contract Types Length: {types?.length}</p>
                                        <p>Current Value: {values.contract_id}</p>
                                    </div>
                                </div>
                            )} */}
                            {(!params.id || (params.id && values.is_contract_based)) && (
                                <>
                                    {!params.id && (
                                        <div className="field col-12 md:col-4 mb-0">
                                            <label htmlFor="is_contract_based">Is Gatekeeper Contract Based?</label>
                                            <div className="flex align-items-center">
                                                <InputSwitch
                                                    id="is_contract_based"
                                                    checked={values.is_contract_based}
                                                    onChange={(e) => {
                                                        setFieldValue('is_contract_based', e.value);
                                                        if (!e.value) {
                                                            setFieldValue('contract_id', '');
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {values.is_contract_based && (
                                        <div className="field col-12 md:col-4 mb-0">
                                            <label htmlFor="contract_id">Contract Name</label>
                                            <Dropdown
                                                id="contract_id"
                                                name="contract_id"
                                                value={values.contract_id}
                                                options={contractTypes}
                                                onChange={(e) => {
                                                    setFieldValue('contract_id', e.value);
                                                }}
                                                optionLabel="label"
                                                placeholder="Select Contract Name"
                                                className={classNames({
                                                    'p-invalid': errors.contract_id && touched.contract_id
                                                })}
                                                style={{ width: '100%' }}
                                            />
                                            {errors.contract_id && touched.contract_id && <div className="p-invalid error text-xs">{errors.contract_id}</div>}
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="name" className="required">
                                        Name
                                    </label>
                                    <InputText
                                        id="name"
                                        name="name"
                                        placeholder="Enter Name"
                                        value={values.name}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.name && touched.name
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.name && touched.name ? errors.name : ''}</div>
                                </div>

                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="email">Email</label>
                                    <InputText
                                        id="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.email && touched.email
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.email && touched.email ? errors.email : ''}</div>
                                </div>

                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="mobile_number" className="required">
                                        Mobile Number
                                    </label>
                                    <InputText
                                        id="mobile_number"
                                        name="mobile_number"
                                        placeholder="Enter Mobile Number"
                                        value={values.mobile_number}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setFieldValue('mobile_number', value);
                                            }
                                        }}
                                        maxLength={10}
                                        className={classNames({
                                            'p-invalid': errors.mobile_number && touched.mobile_number
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.mobile_number && touched.mobile_number ? errors.mobile_number : ''}</div>
                                </div>

                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="duty_location">Duty Location</label>
                                    <InputText
                                        id="duty_location"
                                        name="duty_location"
                                        placeholder="Enter Duty Location"
                                        value={values.duty_location}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.duty_location && touched.duty_location
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.duty_location && touched.duty_location ? errors.duty_location : ''}</div>
                                </div>

                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="start_date" className="required">
                                        In Time
                                    </label>
                                    {/* <Calendar
                                        id="start_date"
                                        name="start_date"
                                        value={values.start_date}
                                        placeholder="Enter Start Date"
                                        // onChange={(e) => {
                                        //     setFieldValue('start_date', e.value);
                                        // }}
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                            setFieldValue('start_date', formattedDate);
                                        }}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                        className={classNames({
                                            'p-invalid': errors.start_date && touched.start_date
                                        })}
                                    /> */}
                                    <Calendar
                                        id="start_date"
                                        name="start_date"
                                        placeholder="Please Select Date"
                                        value={values?.start_date !== '' ? setDefaultDate(values?.start_date) : ''}
                                        dateFormat="dd/mm/yy"
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                            setFieldValue('start_date', formattedDate);
                                        }}
                                        className={classNames({ 'p-invalid': errors.start_date && touched.start_date })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.start_date && touched.start_date ? errors.start_date : ''}</div>
                                </div>

                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="end_date">Out Time</label>
                                    {/* <Calendar
                                        id="end_date"
                                        name="end_date"
                                        value={values.end_date}
                                        placeholder="Enter End Date"
                                        // onChange={(e) => {
                                        //     setFieldValue('end_date', e.value);
                                        // }}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                            setFieldValue('end_date', formattedDate);
                                        }}
                                        minDate={values.start_date}
                                        className={classNames({
                                            'p-invalid': errors.end_date && touched.end_date
                                        })}
                                    /> */}
                                    <Calendar
                                        id="end_date"
                                        name="end_date"
                                        placeholder="Please Select Date"
                                        value={values?.end_date !== '' ? setDefaultDate(values?.end_date) : ''}
                                        dateFormat="dd/mm/yy"
                                        // minDate={new Date()}
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                            setFieldValue('end_date', formattedDate);
                                        }}
                                        className={classNames({ 'p-invalid': errors.end_date && touched.end_date })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.end_date && touched.end_date ? errors.end_date : ''}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="shift_type" className="required">
                                        Shift Type
                                    </label>
                                    <Dropdown
                                        id="shift_type"
                                        name="shift_type"
                                        options={shiftTypes}
                                        value={values.shift_type}
                                        onChange={(e) => {
                                            setFieldValue('shift_type', e.value);
                                        }}
                                        placeholder="Select Shift Type"
                                        className={classNames({
                                            'p-invalid': errors.shift_type && touched.shift_type
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.shift_type && touched.shift_type ? errors.shift_type : ''}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="address" className="required">
                                        Address
                                    </label>
                                    <InputTextarea
                                        rows="2"
                                        cols="30"
                                        id="address"
                                        name="address"
                                        placeholder="Enter Address"
                                        value={values.address}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.address && touched.address
                                        })}
                                        style={{ resize: 'none' }}
                                    />
                                    <div className="p-invalid error text-xs">{errors.address && touched.address ? errors.address : ''}</div>
                                </div>
                                {/* Profile Image Upload */}
                                {values.profile === null && (
                                    <div className="field col-12 md:col-4 mb-1 pt-5">
                                        <div className="file-input-upload">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                            <label htmlFor="fileInput" className="label">
                                                <span>Upload Profile Image...</span>
                                            </label>
                                        </div>
                                        <div className="p-invalid error text-xs mt-1">{errors.profile && touched.profile ? errors.profile : ''}</div>
                                    </div>
                                )}
                                {/* Profile Image Preview */}
                                {values.profile !== null && (
                                    <div className="flex align-items-center field col-12 md:col-4 mb-1 pt-5">
                                        <div className="relative" style={{ width: '100px', height: '100px' }}>
                                            <Image alt="Profile" src={showFile} width="100" height="100" preview />
                                            <div
                                                className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                onClick={() => {
                                                    setFieldValue('profile', null);
                                                    setShowFile(null);
                                                }}
                                            >
                                                <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* {values.id_proof_files === null && (
                                    <div className="field col-12 md:col-4 mb-1 pt-5">
                                        <div className="file-input-upload">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUploadIdProof(event, setFieldValue)} />
                                            <label htmlFor="fileInput" className="label">
                                                <span>Upload Id Proof Image...</span>
                                            </label>
                                        </div>
                                        <div className="p-invalid error text-xs mt-1">{errors.id_proof_files && touched.id_proof_files ? errors.id_proof_files : ''}</div>
                                    </div>
                                )} */}
                                <div className="field col-12 md:col-4 mb-1 pt-5">
                                    <div className="file-input-upload">
                                        <input type="file" id="idProofInput" accept=".jpg, .jpeg, .png" className="input" multiple onChange={(event) => handleUploadIdProof(event, setFieldValue, values)} />
                                        <label htmlFor="idProofInput" className="label">
                                            <span>Upload ID Proof Images...</span>
                                        </label>
                                    </div>
                                </div>
                                {/* Profile Image Preview */}
                                {/* {values.id_proof_files !== null && (
                                    <div className="flex align-items-center field col-12 md:col-4 mb-1 pt-5">
                                        <div className="relative" style={{ width: '100px', height: '100px' }}>
                                            <Image alt="Id Proof" src={showIdProof} width="100" height="100" preview />
                                            <div
                                                className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                onClick={() => {
                                                    setFieldValue('id_proof_files', null);
                                                    setShowIdProof(null);
                                                }}
                                            >
                                                <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                                <div className="flex flex-wrap gap-4 field col-12 mb-1 pt-5">
                                    {showIdProofs.map((preview, index) => (
                                        <div key={index} className="relative" style={{ width: '100px', height: '100px' }}>
                                            <Image alt={`ID Proof ${index + 1}`} src={preview} width="100" height="100" preview />
                                            <div
                                                className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                onClick={() => removeIdProof(index, setFieldValue, values)}
                                            >
                                                <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Notes on File Upload */}
                                <div className="p-invalid error text-xl mt-4" style={{ minHeight: '1.1rem', marginTop: '3px', width: '80rem' }}>
                                    {'Notes :- '}
                                    <span className="text-base">{'Only JPEG, JPG, PNG files are supported. Max file size is 5MB.'}</span>
                                </div>

                                {/* Form Action Buttons */}
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/gate-keeper')} />
                                    <Button disabled={submitted} label={values.id ? 'Update' : 'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
export default GateKeeperAdd;
