import { FieldArray, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import components from '../..';
import { feedCreateRequest, getFeedDataByid, updateFeedAndPolldRequest } from '../../../../redux/slice/AdminSlices/feedSlice';
import CustomFileUpload from './customfileupload';

const CreateFides = () => {
    const { useNavigate, useDispatch, BreadCrumb, useSelector, Image, Calendar } = components;
    const { isCreated, feedDataById } = useSelector((state) => state.feed) || {
        isCreated: false
    };
    const [originalImages, setOriginalImages] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showFile, setShowFile] = useState(null);
    const [initialValues, setInitialValues] = useState({
        type: 'feed',
        title: '',
        description: '',
        poll_options: [''],
        poll_answer_type: false,
        images: [],
        expries_time: '',
        is_expired: false
    });

    const breadcrumbHome = {
        label: 'Feeds/Poll',
        command: () => {
            navigate(`/property-management/feeds`);
        }
    };

    const breadcrumbItems = [
        {
            label: params.id ? 'Edit Feed/Poll' : 'Create Feed/Poll'
        }
    ];

    useEffect(() => {
        if (isCreated) {
            navigate('/property-management/feeds');
        }
    }, [isCreated, navigate]);

    useEffect(() => {
        if (params.id) {
            dispatch(getFeedDataByid(params.id));
        }
    }, [params.id, dispatch]);

    // useEffect(() => {
    //   if (feedDataById) {
    //     let setData = {
    //       type: feedDataById?.type || "poll",
    //       title: feedDataById?.title || "",
    //       description: feedDataById?.description || "",
    //       poll_options: feedDataById?.poll_options || [""],
    //       poll_answer_type: feedDataById?.poll_answer_type || false,
    //       images: feedDataById?.images || [],
    //     };
    //     setInitialValues(setData);
    //   }
    // }, [feedDataById]);
    const isPollExpired = (expiryTime) => {
        if (!expiryTime) return false;
        const now = new Date();
        const expiry = new Date(expiryTime);
        return now > expiry;
    };
    useEffect(() => {
        if (feedDataById) {
            let setData = {
                type: feedDataById?.type || 'poll',
                title: feedDataById?.title || '',
                description: feedDataById?.description || '',
                poll_options: feedDataById?.poll_options || [''],
                poll_answer_type: feedDataById?.poll_answer_type || false,
                images: feedDataById?.images || [],
                expries_time: feedDataById?.expries_time
                // is_expired: isPollExpired(feedDataById?.expries_time)
            };
            setInitialValues(setData);

            // Store original images when editing
            if (params.id) {
                setOriginalImages(feedDataById?.images || []);
            }
        }
    }, [feedDataById]);
    const validationSchema = Yup.object({
        type: Yup.string().required('Please select a type.'),
        title: Yup.string().required('Please provide a title.'),
        description: Yup.string().required('Please provide a description.'),
        poll_options: Yup.array().of(Yup.string()),
        poll_answer_type: Yup.boolean().required('Please specify the poll answer type.'),
        images: Yup.array().required('Please upload at least one image.'),
    });
    // const onSubmit = (values, { resetForm }) => {
    //     // Convert images to Base64 before creating the payload
    //     // const convertImagesToBase64 = async () => {
    //     //     const base64Images = await Promise.all(
    //     //         values.images.map(async (file) => {
    //     //             // If it's already a Base64 string, return it directly
    //     //             if (typeof file === 'string' && (file.startsWith('data:image') || file.startsWith('https://'))) {
    //     //                 return file;
    //     //             }

    //     //             // If it's a File object, convert to Base64
    //     //             if (file instanceof File) {
    //     //                 return new Promise((resolve, reject) => {
    //     //                     const reader = new FileReader();
    //     //                     reader.readAsDataURL(file);
    //     //                     reader.onload = () => resolve(reader.result);
    //     //                     reader.onerror = (error) => reject(error);
    //     //                 });
    //     //             }

    //     //             // If it's neither a Base64 string nor a File, return as is
    //     //             return file;
    //     //         })
    //     //     );

    //     //     // Prepare the payload object
    //     //     const payload = {
    //     //         type: values.type,
    //     //         title: values.title,
    //     //         description: values.description,
    //     //     };

    //     //     // Add poll-specific fields if type is 'poll'
    //     //     if (values.type === 'poll') {
    //     //         payload.poll_options = values.poll_options;
    //     //         payload.poll_answer_type = values.poll_answer_type;
    //     //     }

    //     //     // Add Base64 images if type is 'feed'
    //     //     if (values.type === 'feed' && base64Images.length > 0) {
    //     //         payload.images = base64Images;
    //     //     }

    //     //     // Dispatch the API call
    //     //     const action = params.id
    //     //         ? updateFeedAndPolldRequest(params.id, payload)
    //     //         : feedCreateRequest(payload);

    //     //     dispatch(action)
    //     //         .then((res) => {
    //     //             console.log("Response:", res);
    //     //             if (res) {
    //     //                 navigate("/property-management/fides");
    //     //                 resetForm();
    //     //             }
    //     //         })
    //     //         .catch((error) => {
    //     //             console.error("Failed to save feed:", error);
    //     //         });
    //     // };
    //     const convertImagesToBase64 = async () => {
    //         const base64Images = await Promise.all(
    //             values.images.map(async (file) => {
    //                 // If it's already a Base64 string, return it directly (no conversion needed)
    //                 if (typeof file === 'string' && (file.startsWith('data:image') || file.startsWith('https://'))) {
    //                     return file; // Return the Base64 image or URL as is
    //                 }

    //                 // If it's a File object (new image), convert it to Base64
    //                 if (file instanceof File) {
    //                     return new Promise((resolve, reject) => {
    //                         const reader = new FileReader();
    //                         reader.readAsDataURL(file);
    //                         reader.onload = () => resolve(reader.result); // Resolve with the Base64 string
    //                         reader.onerror = (error) => reject(error); // Reject if there's an error
    //                     });
    //                 }

    //                 // If it's neither a Base64 string nor a File, return it as is
    //                 return file;
    //             })
    //         );

    //         // Prepare the payload object
    //         const payload = {
    //             type: values.type,
    //             title: values.title,
    //             description: values.description
    //         };

    //         // Add poll-specific fields if type is 'poll'
    //         if (values.type === 'poll') {
    //             payload.expries_time = values.expries_time;
    //             // payload.is_expired = isPollExpired(values.expries_time) // Check if poll is expired before sending request
    //         }

    //         if (values.type === 'poll') {
    //             payload.poll_options = values.poll_options;
    //             payload.poll_answer_type = values.poll_answer_type;
    //         }

    //         // Add Base64 images if type is 'feed'
    //         if (values.type === 'feed' && base64Images.length > 0) {
    //             payload.images = base64Images;
    //         }

    //         // Dispatch the API call
    //         const action = params.id ? updateFeedAndPolldRequest(params.id, payload) : feedCreateRequest(payload);

    //         dispatch(action)
    //             .then((res) => {
    //                 console.log('Response:', res);
    //                 if (res) {
    //                     navigate('/property-management/feeds');
    //                     resetForm();
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error('Failed to save feed:', error);
    //             });
    //     };

    //     // Call the async conversion function
    //     convertImagesToBase64();

    //     // Call the async conversion function
    // };

    //   const onSubmit = (values, { resetForm }) => {
    //     const formData = new FormData();
    //     formData.append("type", values.type);
    //     formData.append("title", values.title);
    //     formData.append("description", values.description);

    //     if (values.type === "feed") {
    //       values.images.forEach((file, index) => {
    //         formData.append(`file${index}`, file);
    //       });
    //     }

    //     if (values.type === "poll") {
    //       formData.append("poll_options", JSON.stringify(values.poll_options));
    //       formData.append("poll_answer_type", values.poll_answer_type);
    //     }

    //     // Dispatch the API call to create or update the feed
    //     const action = params.id
    //       ? updateFeedAndPolldRequest(params.id, formData)
    //       : feedCreateRequest(formData);

    //     dispatch(action)
    //       .then((res) => {
    //         console.log("Response:", res);
    //         if (res) {
    //           navigate("/property-management/fides");
    //           resetForm();
    //         }
    //       })
    //       .catch((error) => {
    //         console.error("Failed to save feed:", error);
    //       });
    //   };

    const onSubmit = (values, { resetForm }) => {
        const convertImagesToBase64 = async () => {
            let payload = {
                type: values.type,
                title: values.title.trim(),
                description: values.description.trim()
            };

            if (values.type === 'poll') {
                payload = {
                    ...payload,
                    poll_options: values.poll_options.filter(option => option.trim() !== ''),
                    poll_answer_type: values.poll_answer_type,
                    expries_time: values.expries_time,
                    is_expired: isPollExpired(values.expries_time)
                };
            } else if (values.type === 'feed') {
                // Handle image conversion only for feed type
                const base64Images = await Promise.all(
                    values.images.map(async (file) => {
                        if (typeof file === 'string' && (file.startsWith('data:image') || file.startsWith('https://'))) {
                            return file;
                        }
                        if (file instanceof File) {
                            return new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = () => resolve(reader.result);
                                reader.onerror = (error) => reject(error);
                            });
                        }
                        return file;
                    })
                );
                payload.images = base64Images;
            }

            try {
                const action = params.id
                    ? await dispatch(updateFeedAndPolldRequest(params.id, payload))
                    : await dispatch(feedCreateRequest(payload));

                if (action) {
                    navigate('/property-management/feeds');
                    resetForm();
                }
            } catch (error) {
                console.error('Failed to save feed:', error);
            }
        };

        convertImagesToBase64();
    };

    return (
        <div className="relative min-h-full">
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Feed/Poll' : 'Add Feed/Poll'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <div className="create-poll-form">
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
                        {({ values, setFieldValue, errors, touched, handleReset }) => (
                            <Form className="p-fluid">
                                <div className="flex justify-content-between">
                                    <div className="field col-12 md:col-3 mb-1">
                                        <label htmlFor="type" className="required">
                                            Type
                                        </label>
                                        <Dropdown
                                            id="type"
                                            name="type"
                                            value={values.type}
                                            options={[
                                                { label: 'Feed', value: 'feed' },
                                                { label: 'Poll', value: 'poll' }
                                            ]}
                                            onChange={(e) => setFieldValue('type', e.value)}
                                            className={errors.type && touched.type ? 'p-invalid' : ''}
                                            disabled={Boolean(params.id)}
                                        />
                                        {errors.type && touched.type && <small className="p-error">{errors.type}</small>}
                                    </div>
                                    <div className="field col-12 md:col-3 mb-1">
                                        <div
                                            className="mb-2"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <label htmlFor="title" className="required">
                                                Title
                                            </label>
                                            <small>{values.title.trim().split(/\s+/).length}/150 words</small>
                                        </div>
                                        <InputTextarea
                                            rows="3" // Set the same number of rows
                                            cols="20"
                                            id="title"
                                            name="title"
                                            value={values.title}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const words = value.trim().split(/\s+/); // Count words
                                                if (words.length <= 150) {
                                                    setFieldValue('title', value); // Update value if within limit
                                                }
                                            }}
                                            placeholder="Enter Title"
                                            className={errors.title && touched.title ? 'p-invalid' : ''}
                                            style={{ resize: 'none', width: '100%' }} // Use consistent width
                                        />
                                        {errors.title && touched.title && <small className="p-error">{errors.title}</small>}
                                    </div>
                                    <div className="field col-12 md:col-6 mb-1">
                                        <div
                                            className="mb-2"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <label htmlFor="description" className="required">
                                                Description
                                            </label>
                                            <small>{values.description.trim().split(/\s+/).length}/250 words</small>
                                        </div>
                                        <InputTextarea
                                            rows="3" // Set the same number of rows
                                            cols="20"
                                            id="description"
                                            name="description"
                                            value={values.description}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const words = value.trim().split(/\s+/); // Count words
                                                if (words.length <= 250) {
                                                    setFieldValue('description', value); // Update value if within limit
                                                }
                                            }}
                                            placeholder="Enter Description"
                                            className={errors.description && touched.description ? 'p-invalid' : ''}
                                            style={{ resize: 'none', width: '100%' }} // Use consistent width
                                        />
                                        {errors.description && touched.description && <small className="p-error">{errors.description}</small>}
                                    </div>
                                </div>
                                {values.type === 'poll' ? (
                                    <>
                                        <div className="flex gap-2">
                                            <div className="field col-12 md:col-6">
                                                {/* <div className="flex align-items-center justify-content-between mb-3">
                                                    <label className="required mb-0">Poll Options</label>
                                                    <div className="field-checkbox">
                                                        <Checkbox inputId="poll_answer_type" name="poll_answer_type" checked={values.poll_answer_type} onChange={(e) => setFieldValue('poll_answer_type', e.checked)} />
                                                        <label htmlFor="poll_answer_type" className="ml-2">
                                                            Allow Multiple Answers
                                                        </label>
                                                    </div>
                                                </div> */}
                                                <FieldArray name="poll_options">
                                                    {({ push, remove }) => (
                                                        <>
                                                            {typeof values.poll_options[0] === 'string' && values.poll_options[0].startsWith('[') && (values.poll_options = JSON.parse(values.poll_options[0]))}
                                                            {values.poll_options.map((option, index) => (
                                                                <div key={index} className="flex align-items-center mb-2">
                                                                    <InputText
                                                                        value={option}
                                                                        onChange={(e) => {
                                                                            const options = [...values.poll_options];
                                                                            options[index] = e.target.value;
                                                                            setFieldValue('poll_options', options);
                                                                        }}
                                                                        placeholder={`Option ${index + 1}`}
                                                                        className={errors.poll_options && touched.poll_options && errors.poll_options[index] ? 'p-invalid' : ''}
                                                                    />
                                                                    <Button
                                                                        icon="pi pi-minus"
                                                                        className="p-button-danger p-button-text ml-2"
                                                                        onClick={() => remove(index)}
                                                                        disabled={index === 0} // Disable the button for the first option
                                                                    />
                                                                    <Button
                                                                        icon="pi pi-plus"
                                                                        className="p-button-success p-button-text ml-2"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            push('');
                                                                        }}
                                                                        disabled={values.poll_options.length >= 5}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </>
                                                    )}
                                                </FieldArray>
                                                {errors.poll_options && touched.poll_options && typeof errors.poll_options === 'string' && <small className="p-error">{errors.poll_options}</small>}
                                            </div>

                                            {!params.id && (
                                                <>
                                                    {/* <div className="field col-12 md:col-4 mb-0">
                                                        <label htmlFor="expries_time">
                                                            Expiry Time
                                                        </label>
                                                        <Calendar
                                                            id="expries_time"
                                                            name="expries_time"
                                                            placeholder="Select Expiry Time"
                                                            value={values?.expries_time || ''}
                                                            dateFormat="dd/mm/yy"
                                                            showTime
                                                            hourFormat="24"
                                                            onChange={(e) => {
                                                                const selectedTime = e.value; // Use e.value for PrimeReact Calendar
                                                                const currentTime = new Date();

                                                                // Extract date and time components
                                                                const day = selectedTime.getDate();
                                                                const month = selectedTime.getMonth() + 1;
                                                                const year = selectedTime.getFullYear();
                                                                const hours = selectedTime.getHours();
                                                                const minutes = selectedTime.getMinutes();

                                                                // Format date and time as "dd/mm/yyyy HH:MM"
                                                                const formattedDateTime = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

                                                                // Set the formatted expiry time
                                                                setFieldValue('expries_time', formattedDateTime);

                                                                // Update `is_expired` based on the selected time
                                                                const isExpired = selectedTime < currentTime;
                                                                setFieldValue('is_expired', isExpired);

                                                                // Optionally filter the list to exclude expired items
                                                                if (isExpired) {
                                                                    setFieldValue('list', (prevList) => prevList.filter((item) => new Date(item.expries_time) >= currentTime));
                                                                }
                                                            }}
                                                        />

                                                        <div className="p-invalid error text-xs">{errors.expries_time && touched.expries_time ? errors.expries_time : ''}</div>
                                                    </div> */}
                                                    <div className="field-checkbox mt-3">
                                                        <Checkbox inputId="poll_answer_type" name="poll_answer_type" checked={values.poll_answer_type} onChange={(e) => setFieldValue('poll_answer_type', e.checked)} />
                                                        <label htmlFor="poll_answer_type" className="ml-2">
                                                            Allow Multiple Answers
                                                        </label>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="field mb-3">
                                        <div className="field col-6 mb-2">
                                            <label htmlFor="images" className="required">
                                                Upload Images
                                            </label>
                                            <CustomFileUpload
                                                value={values.images}
                                                setFieldValue={(field, value) => {
                                                    if (value.length > 5) {
                                                        alert('You can only upload up to 5 images.');
                                                    } else {
                                                        setFieldValue(field, value);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button label="Reset" type="button" className="p-button-outlined p-button-info mr-2 mb-2 w-7rem" onClick={() => handleReset()} />
                                    <Button
                                        label="Cancel"
                                        className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                        onClick={() => {
                                            if (params.id) {
                                                const hasImageChanged = JSON.stringify(values.images) !== JSON.stringify(originalImages);

                                                if (hasImageChanged) {
                                                    navigate('/property-management/feeds');
                                                } else {
                                                    navigate('/property-management/feeds');
                                                }
                                            } else {
                                                navigate('/property-management/feeds');
                                            }
                                        }}
                                    />
                                    <Button label="Submit" type="submit" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};
export default CreateFides;

// import { FieldArray, Form, Formik } from 'formik';
// import { Button } from 'primereact/button';
// import { Calendar } from 'primereact/calendar';
// import { Checkbox } from 'primereact/checkbox';
// import { Dropdown } from 'primereact/dropdown';
// import { FileUpload } from 'primereact/fileupload';
// import { InputText } from 'primereact/inputtext';
// import { InputTextarea } from 'primereact/inputtextarea';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import * as Yup from 'yup';
// import components from '../..';
// import { feedCreateRequest, getFeedDataByid, updateFeedAndPolldRequest } from '../../../../redux/slice/AdminSlices/feedSlice';
// import CustomFileUpload from './customfileupload';

// const CreateFides = () => {
//     const { useNavigate, useDispatch, BreadCrumb, useSelector, Image } = components;
//     const { isCreated, feedDataById } = useSelector((state) => state.feed) || {
//         isCreated: false
//     };
//     const [originalImages, setOriginalImages] = useState([]);
//     const params = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [showFile, setShowFile] = useState(null);
//     const [initialValues, setInitialValues] = useState({
//         type: 'feed',
//         title: '',
//         description: '',
//         poll_options: [''],
//         poll_answer_type: false,
//         images: [],
//         expiry_time: null
//     });

//     const breadcrumbHome = {
//         label: 'Feeds/Poll',
//         command: () => {
//             navigate(`/property-management/feeds`);
//         }
//     };

//     const breadcrumbItems = [
//         {
//             label: params.id ? 'Edit Feed/Poll' : 'Create Feed/Poll'
//         }
//     ];

//     useEffect(() => {
//         if (isCreated) {
//             navigate('/property-management/feeds');
//         }
//     }, [isCreated, navigate]);

//     useEffect(() => {
//         if (params.id) {
//             dispatch(getFeedDataByid(params.id));
//         }
//     }, [params.id, dispatch]);

//     useEffect(() => {
//         if (feedDataById) {
//             let setData = {
//                 type: feedDataById?.type || 'poll',
//                 title: feedDataById?.title || '',
//                 description: feedDataById?.description || '',
//                 poll_options: feedDataById?.poll_options || [''],
//                 poll_answer_type: feedDataById?.poll_answer_type || false,
//                 images: feedDataById?.images || [],
//                 expiry_time: feedDataById?.expiry_time ? new Date(feedDataById.expiry_time) : null
//             };
//             setInitialValues(setData);

//             if (params.id) {
//                 setOriginalImages(feedDataById?.images || []);
//             }
//         }
//     }, [feedDataById]);

//     const validationSchema = Yup.object({
//         type: Yup.string().required('Please select a type.'),
//         title: Yup.string().required('Please provide a title.'),
//         description: Yup.string().required('Please provide a description.'),
//         poll_options: Yup.array().of(Yup.string()),
//         poll_answer_type: Yup.boolean(),
//         images: Yup.array().when('type', {
//             is: 'feed',
//             then: (schema) => schema.min(1, 'Please upload at least one image.')
//         }),
//         expiry_time: Yup.date()
//             .nullable()
//             .when('type', {
//                 is: 'poll',
//                 then: (schema) => schema.required('Please specify an expiry time for the poll').min(new Date(), 'Expiry time must be in the future')
//             })
//     });
//     const onSubmit = (values, { resetForm }) => {
//         const convertImagesToBase64 = async () => {
//             const base64Images = await Promise.all(
//                 values.images.map(async (file) => {
//                     if (typeof file === 'string' && (file.startsWith('data:image') || file.startsWith('https://'))) {
//                         return file;
//                     }

//                     if (file instanceof File) {
//                         return new Promise((resolve, reject) => {
//                             const reader = new FileReader();
//                             reader.readAsDataURL(file);
//                             reader.onload = () => resolve(reader.result);
//                             reader.onerror = (error) => reject(error);
//                         });
//                     }

//                     return file;
//                 })
//             );

//             const payload = {
//                 type: values.type,
//                 title: values.title,
//                 description: values.description
//             };

//             if (values.type === 'poll') {
//                 payload.poll_options = values.poll_options;
//                 payload.poll_answer_type = values.poll_answer_type;
//                 payload.expiry_time = values.expiry_time;
//             }

//             if (values.type === 'feed' && base64Images.length > 0) {
//                 payload.images = base64Images;
//             }

//             const action = params.id ? updateFeedAndPolldRequest(params.id, payload) : feedCreateRequest(payload);

//             dispatch(action)
//                 .then((res) => {
//                     console.log('Response:', res);
//                     if (res) {
//                         navigate('/property-management/feeds');
//                         resetForm();
//                     }
//                 })
//                 .catch((error) => {
//                     console.error('Failed to save feed:', error);
//                 });
//         };

//         convertImagesToBase64();
//     };

//     return (
//         <div className="relative min-h-full">
//             <div className="flex justify-content-between align-items-center">
//                 <div className="flex flex-row w-full">
//                     <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Feed/Poll' : 'Add Feed/Poll'}</h5>
//                     <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                 </div>
//             </div>
//             <div className="crud-demo ml-0 mr-0 card mt-3">
//                 <div className="create-poll-form">
//                     <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
//                         {({ values, setFieldValue, errors, touched, handleReset }) => (
//                             <Form className="p-fluid">
//                                 <div className="flex justify-content-between">
//                                     <div className="field col-12 md:col-3 mb-1">
//                                         <label htmlFor="type" className="required">
//                                             Type
//                                         </label>
//                                         <Dropdown
//                                             id="type"
//                                             name="type"
//                                             value={values.type}
//                                             options={[
//                                                 { label: 'Feed', value: 'feed' },
//                                                 { label: 'Poll', value: 'poll' }
//                                             ]}
//                                             onChange={(e) => setFieldValue('type', e.value)}
//                                             className={errors.type && touched.type ? 'p-invalid' : ''}
//                                             disabled={Boolean(params.id)}
//                                         />
//                                         {errors.type && touched.type && <small className="p-error">{errors.type}</small>}
//                                     </div>
//                                     <div className="field col-12 md:col-3 mb-1">
//                                         <div
//                                             className="mb-2"
//                                             style={{
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 justifyContent: 'space-between'
//                                             }}
//                                         >
//                                             <label htmlFor="title" className="required">
//                                                 Title
//                                             </label>
//                                             <small>{values.title.trim().split(/\s+/).length}/150 words</small>
//                                         </div>
//                                         <InputTextarea
//                                             rows="3"
//                                             cols="20"
//                                             id="title"
//                                             name="title"
//                                             value={values.title}
//                                             onChange={(e) => {
//                                                 const value = e.target.value;
//                                                 const words = value.trim().split(/\s+/);
//                                                 if (words.length <= 150) {
//                                                     setFieldValue('title', value);
//                                                 }
//                                             }}
//                                             placeholder="Enter Title"
//                                             className={errors.title && touched.title ? 'p-invalid' : ''}
//                                             style={{ resize: 'none', width: '100%' }}
//                                         />
//                                         {errors.title && touched.title && <small className="p-error">{errors.title}</small>}
//                                     </div>
//                                     <div className="field col-12 md:col-6 mb-1">
//                                         <div
//                                             className="mb-2"
//                                             style={{
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 justifyContent: 'space-between'
//                                             }}
//                                         >
//                                             <label htmlFor="description" className="required">
//                                                 Description
//                                             </label>
//                                             <small>{values.description.trim().split(/\s+/).length}/250 words</small>
//                                         </div>
//                                         <InputTextarea
//                                             rows="3"
//                                             cols="20"
//                                             id="description"
//                                             name="description"
//                                             value={values.description}
//                                             onChange={(e) => {
//                                                 const value = e.target.value;
//                                                 const words = value.trim().split(/\s+/);
//                                                 if (words.length <= 250) {
//                                                     setFieldValue('description', value);
//                                                 }
//                                             }}
//                                             placeholder="Enter Description"
//                                             className={errors.description && touched.description ? 'p-invalid' : ''}
//                                             style={{ resize: 'none', width: '100%' }}
//                                         />
//                                         {errors.description && touched.description && <small className="p-error">{errors.description}</small>}
//                                     </div>
//                                 </div>

//                                 {values.type === 'poll' ? (
//                                     <>
//                                         <div className="flex gap-2">
//                                             <div className="field col-12 md:col-6">
//                                                 <label className="required">Poll Options</label>
//                                                 <FieldArray name="poll_options">
//                                                     {({ push, remove }) => (
//                                                         <>
//                                                             {typeof values.poll_options[0] === 'string' && values.poll_options[0].startsWith('[') && (values.poll_options = JSON.parse(values.poll_options[0]))}

//                                                             {values.poll_options.map((option, index) => (
//                                                                 <div key={index} className="flex align-items-center mb-2">
//                                                                     <InputText
//                                                                         value={option}
//                                                                         onChange={(e) => {
//                                                                             const options = [...values.poll_options];
//                                                                             options[index] = e.target.value;
//                                                                             setFieldValue('poll_options', options);
//                                                                         }}
//                                                                         placeholder={`Option ${index + 1}`}
//                                                                         className={errors.poll_options && touched.poll_options && errors.poll_options[index] ? 'p-invalid' : ''}
//                                                                     />
//                                                                     <Button icon="pi pi-minus" className="p-button-danger p-button-text ml-2" onClick={() => remove(index)} disabled={index === 0} />
//                                                                     <Button
//                                                                         icon="pi pi-plus"
//                                                                         className="p-button-success p-button-text ml-2"
//                                                                         onClick={(e) => {
//                                                                             e.preventDefault();
//                                                                             push('');
//                                                                         }}
//                                                                         disabled={values.poll_options.length >= 5}
//                                                                     />
//                                                                 </div>
//                                                             ))}
//                                                         </>
//                                                     )}
//                                                 </FieldArray>
//                                                 {errors.poll_options && touched.poll_options && typeof errors.poll_options === 'string' && <small className="p-error">{errors.poll_options}</small>}
//                                             </div>

//                                             <div className="field col-12 md:col-3">
//                                                 <label htmlFor="expiry_time" className="required">
//                                                     Poll Expiry Time
//                                                 </label>
//                                                 <Calendar
//                                                     id="expiry_time"
//                                                     value={values.expiry_time}
//                                                     onChange={(e) => setFieldValue('expiry_time', e.value)}
//                                                     showTime
//                                                     hourFormat="24"
//                                                     showIcon
//                                                     minDate={new Date()}
//                                                     placeholder="Select expiry date and time"
//                                                     className={errors.expiry_time && touched.expiry_time ? 'p-invalid' : ''}
//                                                 />
//                                                 {errors.expiry_time && touched.expiry_time && <small className="p-error">{errors.expiry_time}</small>}
//                                             </div>

//                                             {!params.id && (
//                                                 <div className="field-checkbox mt-3">
//                                                     <Checkbox inputId="poll_answer_type" name="poll_answer_type" checked={values.poll_answer_type} onChange={(e) => setFieldValue('poll_answer_type', e.checked)} />
//                                                     <label htmlFor="poll_answer_type" className="ml-2">
//                                                         Allow Multiple Answers
//                                                     </label>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <div className="field mb-3">
//                                         <div className="field col-6 mb-2">
//                                             <label htmlFor="images" className="required">
//                                                 Upload Images
//                                             </label>
//                                             <CustomFileUpload
//                                                 value={values.images}
//                                                 setFieldValue={(field, value) => {
//                                                     if (value.length > 5) {
//                                                         alert('You can only upload up to 5 images.');
//                                                     } else {
//                                                         setFieldValue(field, value);
//                                                     }
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 )}
//                                 <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
//                                     <Button label="Reset" type="button" className="p-button-outlined p-button-info mr-2 mb-2 w-7rem" onClick={() => handleReset()} />
//                                     <Button
//                                         label="Cancel"
//                                         className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
//                                         onClick={() => {
//                                             if (params.id) {
//                                                 const hasImageChanged = JSON.stringify(values.images) !== JSON.stringify(originalImages);

//                                                 if (hasImageChanged) {
//                                                     navigate('/property-management/feeds');
//                                                 } else {
//                                                     navigate('/property-management/feeds');
//                                                 }
//                                             } else {
//                                                 navigate('/property-management/feeds');
//                                             }
//                                         }}
//                                     />
//                                     <Button label="Submit" type="submit" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
//                                 </div>
//                             </Form>
//                         )}
//                     </Formik>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default CreateFides;
