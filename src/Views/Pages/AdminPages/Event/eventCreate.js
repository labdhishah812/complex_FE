// import { Form, Formik } from 'formik';
// import moment from 'moment-timezone';
// import { useParams } from 'react-router-dom';
// import * as Yup from 'yup';
// import components from '../..';
// import Loader from '../../../../components/Loader';
// import ReactQuill from 'react-quill';
// import { eventCreateRequest, eventUpdateRequest, getEventDetailById } from '../../../../redux/slice/AdminSlices/eventSlice';
// // import Loader from '';
// const CreateMeeting = () => {
//     const { Button, Column, DataTable, toast, Image, InputTextarea, Calendar, InputText, classNames, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
//     const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const params = useParams();
//     const [submitted, setSubmitted] = useState(false);
//     const [fileName, setFileName] = useState(null);
//     const [fileFormData, setFileFormData] = useState(null);
//     const { loginDetails } = useSelector((store) => store.auth);
//     const [showFile, setShowFile] = useState(null);
//     const [canEdit, setCanEdit] = useState(false);
//     const { isCreated, isLoading, eventDetailById } = useSelector((store) => store.event);
//     const [formValue, setFormValue] = useState({
//         id: '',
//         event_name: '',
//         event_date: '',
//         event_time: '',
//         location: '',
//         description: '',
//         file: []
//         // user_id: '',
//         // property_id: '',
//         // title: '',
//         // description: '',
//         // date: '',
//         // time: '',
//         // location: '',
//     });
//     const [currentTime, setCurrentTime] = useState(new Date());

//     useEffect(() => {
//         // Update the current time periodically to keep it accurate
//         const interval = setInterval(() => {
//             setCurrentTime(new Date());
//         }, 60000); // Update every minute

//         return () => clearInterval(interval); // Cleanup on unmount
//     }, []);
//     const SignupSchema = Yup.object().shape({
//         event_name: Yup.string().trim().nullable().required('Please enter event name.'),
//         event_date: Yup.string().trim().nullable().required('Please select event date.'),
//         event_time: Yup.string().trim().nullable().required('Please select event time.'),
//         location: Yup.string().trim().nullable().required('Please enter location.')
//     });

//     const breadcrumbItems = [
//         {
//             label: params.id ? 'Edit Event' : 'Create Event'
//         }
//     ];
//     const breadcrumbHome = {
//         label: 'Events',
//         command: () => {
//             navigate(`/property-management/event`);
//         }
//     };
//     useEffect(() => {
//         if (isCreated) {
//             navigate('/property-management/event');
//         }
//     }, [isCreated]);
//     useEffect(() => {
//         if (params.id) {
//             dispatch(getEventDetailById(params?.id));
//         }
//     }, [params.id]);
//     // useEffect(() => {
//     //     if (eventDetailById && eventDetailById?._id) {
//     //         let formVal = { ...formValue };
//     //         formVal.id = eventDetailById?._id;
//     //         formVal.event_name = eventDetailById?.event_name;
//     //         formVal.event_date = changeFormateForEditDate(eventDetailById?.event_date);
//     //         formVal.event_time = changeFormateForEdit(eventDetailById?.event_time);
//     //         // formVal.event_time = "10:10:10 AM";
//     //         formVal.location = eventDetailById?.location;
//     //         formVal.file = eventDetailById?.event_img ? eventDetailById?.event_img : null;
//     //         setFormValue(formVal);
//     //         eventDetailById?.event_img && setShowFile(`${BASE_URL_API}event/${eventDetailById?.event_img}`);
//     //     }
//     // }, [eventDetailById]);
//     useEffect(() => {
//         if (eventDetailById && eventDetailById?._id) {
//             let formVal = { ...formValue };
//             formVal.id = eventDetailById?._id;
//             formVal.event_name = eventDetailById?.event_name;
//             formVal.event_date = changeFormateForEditDate(eventDetailById?.event_date);
//             formVal.event_time = changeFormateForEdit(eventDetailById?.event_time);
//             formVal.location = eventDetailById?.location;
//             formVal.description = eventDetailById?.description;
//             formVal.file = eventDetailById?.event_img ? eventDetailById?.event_img : null;
//             setFormValue(formVal);

//             // Improved file handling for event images or PDFs
//             if (eventDetailById?.event_img) {
//                 const fileName = eventDetailById.event_img.split('/').pop();
//                 const fileExtension = fileName.split('.').pop().toLowerCase();

//                 console.log('Full image path:', `${BASE_URL_API}event/${eventDetailById.event_img}`);
//                 console.log('File Extension:', fileExtension);
//                 console.log('Raw event_img:', eventDetailById.event_img);

//                 if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
//                     // Construct full image URL carefully
//                     const fullImageUrl = `${BASE_URL_API}event/${eventDetailById.event_img}`;
//                     setShowFile(fullImageUrl);
//                     setFileName(fullImageUrl); // Also set fileName for consistency
//                 } else if (fileExtension === 'pdf') {
//                     setShowFile(fileName);
//                     setFileName(fileName);
//                 }
//             }
//         }
//     }, [eventDetailById, BASE_URL_API]);

//     const changeFormateForEdit = (val) => {
//         try {
//             // Parse the time string, handling both 12-hour and 24-hour formats
//             const parsedTime = moment(val, ['hh:mm:ss A', 'HH:mm:ss', 'HH:mm']);

//             // If parsing fails, return current time
//             if (!parsedTime.isValid()) {
//                 return new Date();
//             }

//             // Create a date object with the parsed time
//             const date = new Date();
//             date.setHours(parsedTime.hours());
//             date.setMinutes(parsedTime.minutes());
//             date.setSeconds(parsedTime.seconds());

//             return date;
//         } catch (error) {
//             console.error('Error in changeFormateForEdit:', error);
//             return new Date();
//         }
//     };
//     const changeFormateForEditDate = (val) => {
//         const date = new Date(val);

//         const day = String(date.getUTCDate()).padStart(2, '0');
//         const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//         const year = date.getUTCFullYear();

//         const formattedDate = `${day}/${month}/${year}`;
//         return formattedDate;
//     };
//     // const changeInTimeFormatter = (val) => {
//     //     try {
//     //         // let time = new Date(val);
//     //         let time = moment(val).utcOffset("+05:30").format("hh:mm:ss A")
//     //         // console.log(abc);

//     //         // debugger;
//     //         // let formattedTime = time.toLocaleTimeString('en-US', {
//     //         //     hour: '2-digit',
//     //         //     minute: '2-digit',
//     //         //     hour12: false // Use 24-hour format
//     //         // });
//     //         return time
//     //     } catch (error) {
//     //         console.log(error);

//     //     }
//     // }
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
//     const changeSentDate = (val) => {
//         try {
//             const [day, month, year] = val.split('/');
//             const formattedDate = `${year}-${month}-${day}`;
//             return formattedDate;
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     // const handleUpload = async (event, setFieldValue) => {
//     //     try {
//     //         const str = event.target.files[0]?.name;
//     //         const substr = ['.jpg', '.jpeg', '.png'];
//     //         let flag = false;
//     //         substr.forEach((a) => {
//     //             if (str.includes(a)) {
//     //                 flag = true;
//     //             }
//     //         });
//     //         if (flag) {
//     //             setFieldValue('file', event.target.files[0]);
//     //             setShowFile(URL.createObjectURL(event.target.files[0]));
//     //         } else {
//     //             toast.error('Only accepts .png, .jpg, and .jpeg files.', {
//     //                 style: {
//     //                     marginTop: '4rem'
//     //                 }
//     //             });
//     //         }
//     //     } catch (error) {
//     //         console.log(error);
//     //     }
//     // };

//     const handleUpload = async (event, setFieldValue) => {
//         try {
//             const str = event.target.files[0]?.name;
//             const substr = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
//             let flag = false;

//             substr.forEach((a) => {
//                 if (str.includes(a)) {
//                     flag = true;
//                 }
//             });

//             if (flag) {
//                 setFieldValue('file', event.target.files[0]); // Update form field value
//                 setShowFile(URL.createObjectURL(event.target.files[0])); // Show preview
//             } else {
//                 toast.error('Only accepts .png, .jpeg, .jpg, .pdf files.', {
//                     style: {
//                         marginTop: '4rem'
//                     }
//                 });
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     let sendData = {
//         event_name: formValue?.event_name,
//         event_date: changeSentDate(formValue?.event_date),
//         event_time: moment(formValue?.event_time, 'hh:mm:ss A').format('hh:mm:ss A'),
//         location: formValue?.location,
//         description: formValue?.description,
//         file: formValue?.file ? formValue?.file : ''
//     };

//     const handleFileUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

//             // Validate file type
//             if (!allowedTypes.includes(file.type)) {
//                 toast.error('Invalid file type. Please upload JPEG, JPG, PNG, PDF files.');
//                 return;
//             }

//             // Validate file size (5MB limit)
//             if (file.size > 5 * 1024 * 1024) {
//                 toast.error('File size should be less than 5MB');
//                 return;
//             }

//             const reader = new FileReader();
//             reader.onload = () => {
//                 if (file.type === 'application/pdf') {
//                     // PDF files: Use base64 data directly
//                     setFileName(file.name); // Set the actual file name
//                     setFileFormData(reader.result); // Store the base64 string for PDF
//                 } else {
//                     // Image files: Use base64 data directly
//                     setFileName(file.name); // Set the actual file name
//                     setFileFormData(reader.result); // Store the base64 string for images
//                 }
//             };

//             // Read the file as a Data URL (Base64)
//             reader.readAsDataURL(file);
//         }
//     };

//     return (
//         <div className="relative min-h-full">
//             <Loader isLoading={isLoading} />
//             <div className="flex justify-content-between align-items-center">
//                 <div className="flex flex-row w-full">
//                     <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Event' : 'Create Event'}</h5>
//                     <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                 </div>
//             </div>
//             <div className="crud-demo ml-0 mr-0 card mt-3">
//                 <Formik
//                     initialValues={formValue}
//                     validationSchema={SignupSchema}
//                     enableReinitialize
//                     onSubmit={(values) => {
//                         setSubmitted(true);
//                         setTimeout(() => {
//                             setSubmitted(false);
//                         }, 5000);

//                         // Create FormData to send file
//                         const formData = new FormData();
//                         formData.append('event_name', values?.event_name);
//                         formData.append('event_date', changeSentDate(values?.event_date));
//                         formData.append('event_time', values?.event_time ? moment(values?.event_time, 'HH:mm').format('hh:mm:ss A') : moment().format('hh:mm:ss A'));
//                         formData.append('location', values?.location);
//                         formData.append('description', values?.description);

//                         // Append file if it exists
//                         if (fileFormData) {
//                             formData.append('file', fileFormData);
//                         }

//                         values.id === '' ? dispatch(eventCreateRequest(formData)) : dispatch(eventUpdateRequest(values.id, formData));
//                     }}
//                 >
//                     {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
//                         <Form>
//                             <div className="grid p-fluid mt-1">
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="event_name" className="required">
//                                         Event Name
//                                     </label>
//                                     <InputText
//                                         id="event_name"
//                                         name="event_name"
//                                         placeholder="Enter Event Name"
//                                         type="text"
//                                         value={values?.event_name}
//                                         onChange={handleChange}
//                                         className={classNames({ 'p-invalid': errors.event_name && touched.event_name })}
//                                     />
//                                     <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
//                                         {errors.event_name && touched.event_name ? errors.event_name : ''}
//                                     </div>
//                                 </div>
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="location" className="required">
//                                         Location
//                                     </label>
//                                     <InputText id="location" name="location" placeholder="Enter location" type="text" value={values?.location} onChange={handleChange} className={classNames({ 'p-invalid': errors.location && touched.location })} />
//                                     <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
//                                         {errors.location && touched.location ? errors.location : ''}
//                                     </div>
//                                 </div>
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="event_date" className="required">
//                                         Event Date
//                                     </label>
//                                     <Calendar
//                                         id="event_date"
//                                         name="event_date"
//                                         placeholder="Please Select Event Date"
//                                         value={values?.event_date ? setDefaultDate(values?.event_date) : ''}
//                                         dateFormat="dd/mm/yy"
//                                         minDate={new Date()} // Disable past dates
//                                         onChange={(e) => {
//                                             const selectedDate = new Date(e.target.value);
//                                             const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
//                                             setFieldValue('event_date', formattedDate);

//                                             // Reset the time field if a new date is selected
//                                             if (moment(selectedDate).format('DD/MM/YYYY') !== moment(currentTime).format('DD/MM/YYYY')) {
//                                                 setFieldValue('event_time', '');
//                                             }
//                                         }}
//                                         className={classNames({ 'p-invalid': errors.event_date && touched.event_date })}
//                                     />
//                                     <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
//                                         {errors.event_date && touched.event_date ? errors.event_date : ''}
//                                     </div>
//                                 </div>
//                                 <div className="field col-12 md:col-4 mb-0">
//                                     <label htmlFor="event_time" className="required">
//                                         Event Time
//                                     </label>
//                                     {/* <Calendar
//                                         id="event_time"
//                                         name="event_time"
//                                         placeholder="Please Select Event Time"
//                                         value={values?.event_time}
//                                         timeOnly
//                                         hourFormat="12"
//                                         minDate={
//                                             values?.event_date === moment(currentTime).format('DD/MM/YYYY') ? currentTime : undefined // No restrictions for other dates
//                                         }
//                                         onChange={(e) => {
//                                             setFieldValue('event_time', e.target.value);
//                                         }}
//                                         className={classNames({ 'p-invalid': errors.event_time && touched.event_time })}
//                                     /> */}
//                                     <Calendar
//                                         id="event_time"
//                                         name="event_time"
//                                         placeholder="Please Select Event Time"
//                                         value={values?.event_time ? moment(values.event_time, 'HH:mm').toDate() : null}
//                                         timeOnly
//                                         hourFormat="12"
//                                         showTime={{
//                                             hourFormat: '12',
//                                             format: 'HH:mm'
//                                         }}
//                                         minDate={values?.event_date === moment(currentTime).format('DD/MM/YYYY') ? currentTime : undefined}
//                                         onChange={(e) => {
//                                             // Ensure time is in 24-hour format
//                                             const selectedTime = e.value ? moment(e.value).format('HH:mm') : null;

//                                             console.log('Selected Time:', selectedTime);
//                                             setFieldValue('event_time', selectedTime);
//                                         }}
//                                         className={classNames({ 'p-invalid': errors.event_time && touched.event_time })}
//                                     />

//                                     <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
//                                         {errors.event_time && touched.event_time ? errors.event_time : ''}
//                                     </div>
//                                 </div>
//                                 <div className="field col-12 md:col-12 mb-1">
//                                     <label htmlFor="description" className="required">
//                                         Description
//                                     </label>
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={values?.description}
//                                         onChange={(e) => {
//                                             setFieldValue('description', e === '<p><br></p>' ? '' : e);
//                                         }}
//                                         className={`reactQuillCustom ${errors.description && touched.description ? 'reactQuillCustomError' : ''}`}
//                                         style={{
//                                             height: 'auto',
//                                             // Conditionally apply maxHeight only for create notice
//                                             overflow: 'auto'
//                                         }}
//                                     />
//                                     {/* <InputTextarea
//                                                                         id="description"
//                                                                         name="description"
//                                                                         placeholder="Enter Description"
//                                                                         type="text"
//                                                                         value={values?.description}
//                                                                         onChange={handleChange}
//                                                                         className={classNames({ 'p-invalid': errors.description && touched.description })}
//                                                                     /> */}
//                                     {/* <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.description && touched.description ? errors.description : ""}</div> */}
//                                 </div>
//                                 {/* <div className={`field col-12 md:col-4 mb-1 ${values?.file === null ? 'mt-4' : ''}`}>
//                                     {values?.file === null && (
//                                         <div className="file-input-upload">
//                                             <input type="file" id="fileInput" accept=".jpg, .jpeg, .png, .pdf, .doc, .docx" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
//                                             <label for="fileInput" className="label">
//                                                 <span>Upload Event Banner...</span>
//                                             </label>
//                                         </div>
//                                     )}
//                                     {values?.file !== null && (
//                                         <div className="flex align-items-center field col-12 md:col-4 mb-1">
//                                             <div className="relative " style={{ width: '100px', height: '100px' }}>
//                                                 <Image alt="Image" src={showFile} width="100" height="100" preview />
//                                                 <div
//                                                     className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
//                                                     style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
//                                                     onClick={() => {
//                                                         setFieldValue('file', null);
//                                                         setShowFile(null);
//                                                     }}
//                                                 >
//                                                     <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div> */}
//                                 <div className={`field col-12 md:col-4 mb-0 ${fileName === null ? 'mt-4' : ''}`}>
//                                     {fileName === null && (
//                                         <div className="file-input-upload">
//                                             <input type="file" id="fileInput" accept=".jpg, .jpeg, .png, .pdf" className="input" onChange={handleFileUpload} />
//                                             <label htmlFor="fileInput" className="label">
//                                                 <span>Upload a Receipt File...</span>
//                                             </label>
//                                         </div>
//                                     )}
//                                     {fileName && (
//                                         <div className="mt-3">
//                                             <label htmlFor="receipt">Receipt</label>
//                                             <div className="flex align-items-center">
//                                                 {fileFormData && fileFormData.startsWith('data:application/pdf;base64,') ? (
//                                                     <div className="flex align-items-center">
//                                                         <i className="pi pi-file-pdf" style={{ fontSize: '1.2rem', color: '#f63939' }} />
//                                                         <span className="ml-2">{fileName}</span>
//                                                         <Button
//                                                             icon="pi pi-trash"
//                                                             className="p-button-rounded p-button-text p-button-danger ml-3"
//                                                             onClick={() => {
//                                                                 setFileFormData(null);
//                                                                 setFileName(null);
//                                                             }}
//                                                         />
//                                                     </div>
//                                                 ) : (
//                                                     <div className="relative" style={{ width: '100px', height: '100px' }}>
//                                                         <img
//                                                             alt="Uploaded Preview"
//                                                             src={fileFormData}
//                                                             style={{
//                                                                 width: '100%',
//                                                                 height: '100%',
//                                                                 borderRadius: '8px',
//                                                                 objectFit: 'cover'
//                                                             }}
//                                                         />
//                                                         <div
//                                                             className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
//                                                             style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
//                                                             onClick={() => {
//                                                                 setFileFormData(null);
//                                                                 setFileName(null);
//                                                             }}
//                                                         >
//                                                             <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }} />
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="p-invalid error text-xl mt-4" style={{ minHeight: '1.1rem', marginTop: '3px', width: '80rem' }}>
//                                     {'Notes :- '}
//                                     <span className="text-base">{'Only JPEG, JPG, PNG, and PDF files are supported.'}</span>
//                                 </div>
//                             </div>
//                             <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
//                                 <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/event')} />
//                                 <Button label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </div>
//     );
// };
// export default CreateMeeting;




import { Form, Formik } from 'formik';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import components from '../..';
import Loader from '../../../../components/Loader';
import { eventCreateRequest, eventUpdateRequest, getEventDetailById } from '../../../../redux/slice/AdminSlices/eventSlice';
import ReactQuill from 'react-quill';
// import Loader from '';
const CreateMeeting = () => {
    const { Button, Column, DataTable, toast, Image, InputTextarea, Calendar, InputText, classNames, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [submitted, setSubmitted] = useState(false);
    const { loginDetails } = useSelector((store) => store.auth);
    const [showFile, setShowFile] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const { isCreated, isLoading, eventDetailById } = useSelector((store) => store.event);
    const [formValue, setFormValue] = useState({
        id: '',
        event_name: '',
        event_date: '',
        event_time: '',
        location: '',
        description: '',
        file: null
        // user_id: '',
        // property_id: '',
        // title: '',
        // description: '',
        // date: '',
        // time: '',
        // location: '',
    });
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update the current time periodically to keep it accurate
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);
    const SignupSchema = Yup.object().shape({
        event_name: Yup.string().trim().nullable().required('Please enter event name.'),
        event_date: Yup.string().trim().nullable().required('Please select event date.'),
        event_time: Yup.string().trim().nullable().required('Please select event time.'),
        location: Yup.string().trim().nullable().required('Please enter location.')
    });

    const breadcrumbItems = [
        {
            label: params.id ? 'Edit Event' : 'Create Event'
        }
    ];
    const breadcrumbHome = {
        label: 'Events',
        command: () => {
            navigate(`/property-management/event`);
        }
    };
    useEffect(() => {
        if (isCreated) {
            navigate('/property-management/event');
        }
    }, [isCreated]);
    useEffect(() => {
        if (params.id) {
            dispatch(getEventDetailById(params?.id));
        }
    }, [params.id]);
    useEffect(() => {
        if (eventDetailById && eventDetailById?._id) {
            let formVal = { ...formValue };
            formVal.id = eventDetailById?._id;
            formVal.event_name = eventDetailById?.event_name;
            formVal.event_date = changeFormateForEditDate(eventDetailById?.event_date);
            formVal.event_time = changeFormateForEdit(eventDetailById?.event_time);
            // formVal.event_time = "10:10:10 AM";
            formVal.location = eventDetailById?.location;
            formVal.description = eventDetailById?.description;
            formVal.file = eventDetailById?.event_img ? eventDetailById?.event_img : null;
            setFormValue(formVal);
            eventDetailById?.event_img && setShowFile(`${BASE_URL_API}event/${eventDetailById?.event_img}`);
        }
    }, [eventDetailById]);
    // useEffect(() => {
    //     let formVal = { ...formValue }
    //     formVal.user_id = loginDetails?._id;
    //     formVal.property_id = loginDetails?.user_connect_with_property_id;
    //     setFormValue(formVal);
    // }, [])
    // const changeFormateForEdit = (val) => {
    //     // const [hours, minutes, seconds] = val.split(':').map(Number);
    //     // const date = new Date();
    //     // date.setHours(hours);
    //     // date.setMinutes(minutes);
    //     // date.setSeconds(seconds);
    //     // // console.log(date, "datedatedatedate");
    //     // return date;
    //     const [hours, minutes, seconds] = val
    //         .replace(/(AM|PM)/i, '')
    //         .trim()
    //         .split(':')
    //         .map(Number);
    //     const date = new Date();
    //     date.setHours(hours);
    //     date.setMinutes(minutes);
    //     date.setSeconds(seconds);
    //     return date;
    // };
    const changeFormateForEdit = (val) => {
        try {
            // Parse the time string, handling both 12-hour and 24-hour formats
            const parsedTime = moment(val, ['hh:mm:ss A', 'HH:mm:ss', 'HH:mm']);

            // If parsing fails, return current time
            if (!parsedTime.isValid()) {
                return new Date();
            }

            // Create a date object with the parsed time
            const date = new Date();
            date.setHours(parsedTime.hours());
            date.setMinutes(parsedTime.minutes());
            date.setSeconds(parsedTime.seconds());

            return date;
        } catch (error) {
            console.error('Error in changeFormateForEdit:', error);
            return new Date();
        }
    };
    const changeFormateForEditDate = (val) => {
        const date = new Date(val);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    };
    // const changeInTimeFormatter = (val) => {
    //     try {
    //         // let time = new Date(val);
    //         let time = moment(val).utcOffset("+05:30").format("hh:mm:ss A")
    //         // console.log(abc);

    //         // debugger;
    //         // let formattedTime = time.toLocaleTimeString('en-US', {
    //         //     hour: '2-digit',
    //         //     minute: '2-digit',
    //         //     hour12: false // Use 24-hour format
    //         // });
    //         return time
    //     } catch (error) {
    //         console.log(error);

    //     }
    // }
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
    const changeSentDate = (val) => {
        try {
            const [day, month, year] = val.split('/');
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpload = async (event, setFieldValue) => {
        try {
            const file = event.target.files[0];
            const str = file?.name;
            const substr = ['.jpg', '.jpeg', '.png', '.pdf']; // Added .pdf
            let flag = false;
            substr.forEach((a) => {
                if (str.toLowerCase().includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                // Additional check for file type using MIME type
                const allowedTypes = [
                    'image/jpeg',
                    'image/png',
                    'application/pdf'
                ];
                const fileType = file.type;

                if (allowedTypes.includes(fileType)) {
                    setFieldValue('file', file);

                    // Handle preview differently for PDF
                    if (fileType === 'application/pdf') {
                        // For PDF, show the filename
                        setShowFile(file.name);
                    } else {
                        // For images, continue using existing method
                        setShowFile(URL.createObjectURL(file));
                    }
                } else {
                    toast.error('Only accepts .png, .jpg, .jpeg, and .pdf files.', {
                        style: {
                            marginTop: '4rem'
                        }
                    });
                }
            } else {
                toast.error('Only accepts .png, .jpg, .jpeg, and .pdf files.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    // const handleUpload = async (event, setFieldValue) => {
    //     try {
    //         const str = event.target.files[0]?.name;
    //         const substr = ['.jpg', '.jpeg', '.png'];
    //         let flag = false;
    //         substr.forEach((a) => {
    //             if (str.includes(a)) {
    //                 flag = true;
    //             }
    //         });
    //         if (flag) {
    //             setFieldValue('file', event.target.files[0]);
    //             setShowFile(URL.createObjectURL(event.target.files[0]));
    //         } else {
    //             toast.error('Only accepts .png, .jpg, and .jpeg files.', {
    //                 style: {
    //                     marginTop: '4rem'
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    let sendData = {
        event_name: formValue?.event_name,
        event_date: changeSentDate(formValue?.event_date),
        event_time: moment(formValue?.event_time, 'hh:mm:ss A').format('hh:mm:ss A'), // Ensure correct time formatting
        location: formValue?.location,
        description: formValue?.description,
        file: formValue?.file ? formValue?.file : ''
    };

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Event' : 'Create Event'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={SignupSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        // let sendData = {
                        //     event_name: values?.event_name,
                        //     event_date: changeSentDate(values?.event_date),
                        //     event_time: moment(values?.time).format('hh:mm:ss A'),
                        //     location: values?.location,
                        //     file: values?.file ? values?.file : ''
                        // };
                        let sendData = {
                            event_name: values?.event_name,
                            event_date: changeSentDate(values?.event_date),
                            event_time: values?.event_time
                                ? moment(values?.event_time, 'HH:mm').format('hh:mm:ss A')
                                : moment().format('hh:mm:ss A'),
                            location: values?.location,
                            description: values?.description,
                            file: values?.file ? values?.file : ''
                        };
                        values.id === ''
                        ? dispatch(eventCreateRequest(sendData))
                        : dispatch(eventUpdateRequest(values.id, sendData));
                        // values.id === '' && dispatch(eventCreateRequest(sendData));
                        // values.id !== '' && dispatch(eventUpdateRequest(values.id, sendData));
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="event_name" className="required">
                                        Event Name
                                    </label>
                                    <InputText
                                        id="event_name"
                                        name="event_name"
                                        placeholder="Enter Event Name"
                                        type="text"
                                        value={values?.event_name}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.event_name && touched.event_name })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.event_name && touched.event_name ? errors.event_name : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="location" className="required">
                                        Location
                                    </label>
                                    <InputText id="location" name="location" placeholder="Enter location" type="text" value={values?.location} onChange={handleChange} className={classNames({ 'p-invalid': errors.location && touched.location })} />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.location && touched.location ? errors.location : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="event_date" className="required">
                                        Event Date
                                    </label>
                                    <Calendar
                                        id="event_date"
                                        name="event_date"
                                        placeholder="Please Select Event Date"
                                        value={values?.event_date ? setDefaultDate(values?.event_date) : ''}
                                        dateFormat="dd/mm/yy"
                                        minDate={new Date()} // Disable past dates
                                        onChange={(e) => {
                                            const selectedDate = new Date(e.target.value);
                                            const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
                                            setFieldValue('event_date', formattedDate);

                                            // Reset the time field if a new date is selected
                                            if (moment(selectedDate).format('DD/MM/YYYY') !== moment(currentTime).format('DD/MM/YYYY')) {
                                                setFieldValue('event_time', '');
                                            }
                                        }}
                                        className={classNames({ 'p-invalid': errors.event_date && touched.event_date })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.event_date && touched.event_date ? errors.event_date : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="event_time" className="required">
                                        Event Time
                                    </label>
                                    {/* <Calendar
                                        id="event_time"
                                        name="event_time"
                                        placeholder="Please Select Event Time"
                                        value={values?.event_time}
                                        timeOnly
                                        hourFormat="12"
                                        minDate={
                                            values?.event_date === moment(currentTime).format('DD/MM/YYYY') ? currentTime : undefined // No restrictions for other dates
                                        }
                                        onChange={(e) => {
                                            setFieldValue('event_time', e.target.value);
                                        }}
                                        className={classNames({ 'p-invalid': errors.event_time && touched.event_time })}
                                    /> */}
                                    {/* <Calendar
    id="event_time"
    name="event_time"
    placeholder="Please Select Event Time"
    value={
        values?.event_time
            ? moment(values.event_time, 'HH:mm').toDate()
            : null
    }
    timeOnly
    hourFormat="12"
    showTime={{
        hourFormat: '12',
        format: 'HH:mm'
    }}
    minDate={
        values?.event_date === moment(currentTime).format('DD/MM/YYYY')
            ? currentTime
            : undefined
    }
    onChange={(e) => {
        // Ensure time is in 24-hour format
        const selectedTime = e.value
            ? moment(e.value).format('HH:mm')
            : null;

        console.log('Selected Time:', selectedTime);
        setFieldValue('event_time', selectedTime);
    }}
    className={classNames({ 'p-invalid': errors.event_time && touched.event_time })}
/>



                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.event_time && touched.event_time ? errors.event_time : ''}
                                    </div>
                                </div> */}
                                <Calendar
                                        id="event_time"
                                        name="event_time"
                                        placeholder="Please Select Event Time"
                                        value={values?.event_time ? moment(values.event_time, 'HH:mm').toDate() : null}
                                        timeOnly
                                        hourFormat="12"
                                        showTime={{
                                            hourFormat: '12',
                                            format: 'HH:mm'
                                        }}
                                        minDate={values?.event_date === moment(currentTime).format('DD/MM/YYYY') ? currentTime : undefined}
                                        onChange={(e) => {
                                            // Ensure time is in 24-hour format
                                            const selectedTime = e.value ? moment(e.value).format('HH:mm') : null;

                                            console.log('Selected Time:', selectedTime);
                                            setFieldValue('event_time', selectedTime);
                                        }}
                                        className={classNames({ 'p-invalid': errors.event_time && touched.event_time })}
                                    />

                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.event_time && touched.event_time ? errors.event_time : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-12 mb-1">
                                    <label htmlFor="description" className="required">
                                        Description
                                    </label>
                                    <ReactQuill
                                        theme="snow"
                                        value={values?.description}
                                        onChange={(e) => {
                                            setFieldValue('description', e === '<p><br></p>' ? '' : e);
                                        }}
                                        className={`reactQuillCustom ${errors.description && touched.description ? 'reactQuillCustomError' : ''}`}
                                        style={{
                                            height: 'auto',
                                            // Conditionally apply maxHeight only for create notice
                                            overflow: 'auto'
                                        }}
                                    />
                                    {/* <InputTextarea
                                                                        id="description"
                                                                        name="description"
                                                                        placeholder="Enter Description"
                                                                        type="text"
                                                                        value={values?.description}
                                                                        onChange={handleChange}
                                                                        className={classNames({ 'p-invalid': errors.description && touched.description })}
                                                                    /> */}
                                    {/* <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.description && touched.description ? errors.description : ""}</div> */}
                                </div>
                                {/* <div className={`field col-12 md:col-4 mb-1 ${values?.file === null ? 'mt-4' : ''}`}>
                                    {values?.file === null && (
                                        <div className="file-input-upload">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                            <label for="fileInput" className="label">
                                                <span>Upload Event Banner...</span>
                                            </label>
                                        </div>
                                    )}
                                    {values?.file !== null && (
                                        <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                            <div className="relative " style={{ width: '100px', height: '100px' }}>
                                                <Image alt="Image" src={showFile} width="100" height="100" preview />
                                                <div
                                                    className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                    style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                    onClick={() => {
                                                        setFieldValue('file', null);
                                                        setShowFile(null);
                                                    }}
                                                >
                                                    <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-invalid error text-xl mt-4" style={{ minHeight: '1.1rem', marginTop: '3px', width: '80rem' }}>
                                    {'Notes :- '}
                                    <span className="text-base">{'Only JPEG, JPG, PNG, and PDF files are supported.'}</span>
                                </div> */}
                                <div className={`field col-12 md:col-4 mb-1 ${values?.file === null ? 'mt-4' : ''}`}>
    {values?.file === null && (
        <div className="file-input-upload">
            <input
                type="file"
                id="fileInput"
                accept=".jpg, .jpeg, .png, .pdf"  // Added .pdf to accepted file types
                className="input"
                onChange={(event) => handleUpload(event, setFieldValue)}
            />
            <label htmlFor="fileInput" className="label">
                <span>Upload Event Banner...</span>
            </label>
        </div>
    )}
    {values?.file !== null && (
    <div className="flex align-items-center field col-12 md:col-4 mb-1">
        <div className="relative" style={{ width: '100px', height: '100px' }}>
            {showFile && (
                <>
                    {(typeof showFile === 'string' && (showFile.startsWith('blob:') ||
                      showFile.toLowerCase().endsWith('.jpg') ||
                      showFile.toLowerCase().endsWith('.jpeg') ||
                      showFile.toLowerCase().endsWith('.png'))) ? (
                        <Image
                            alt="Image"
                            src={showFile}
                            width="100"
                            height="100"
                            preview
                        />
                    ) : (
                        <div className="flex align-items-center">
                            <i className="pi pi-file-pdf mr-2" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                            <span className="truncate" style={{ maxWidth: '80px' }}>
                                {typeof showFile === 'string' ? showFile : showFile.name}
                            </span>
                        </div>
                    )}
                    <div
                        className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                        style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                        onClick={() => {
                            setFieldValue('file', null);
                            setShowFile(null);
                        }}
                    >
                        <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                    </div>
                </>
            )}
        </div>
    </div>
)}
    {/* {values?.file !== null && (
        <div className="flex align-items-center field col-12 md:col-4 mb-1">
            <div className="relative" style={{ width: '100px', height: '100px' }}>
                <Image
                    alt="Image"
                    src={showFile}
                    width="100"
                    height="100"
                    preview
                />
                <div
                    className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                    style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                    onClick={() => {
                        setFieldValue('file', null);
                        setShowFile(null);
                    }}
                >
                    <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                </div>
            </div>
        </div>
    )} */}
</div>
<div className="p-invalid error text-xl mt-4" style={{ minHeight: '1.1rem', marginTop: '3px', width: '80rem' }}>
    {'Notes :- '}
    <span className="text-base">{'Only JPEG, JPG, PNG, and PDF files are supported.'}</span>
</div>
                            </div>
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/event')} />
                                <Button label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
export default CreateMeeting;
