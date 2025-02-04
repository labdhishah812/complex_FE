// import React, { useEffect } from 'react';
// import { Formik, Form, Field, FieldArray } from 'formik';
// import * as Yup from 'yup';
// import { InputText } from 'primereact/inputtext';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { Button } from 'primereact/button';
// import { Checkbox } from 'primereact/checkbox';
// import components from '../..';
// import { FileUpload } from 'primereact/fileupload';
// import { feedCreateRequest, getFeedDataByid, updateFeedAndPolldRequest } from '../../../../redux/slice/AdminSlices/feedSlice';

// const EditFeeds = ({ editData }) => {
//     console.log(editData,"editdata")
//     const { useNavigate, useDispatch, BreadCrumb } = components;
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const breadcrumbHome = {
//         label: 'Feeds',
//         command: () => {
//             navigate(`/property-management/fides`);
//         }
//     };

//     const breadcrumbItems = [
//         {
//             label: 'Edit Feeds'
//         }
//     ];

//     const [initialValues, setInitialValues] = React.useState({
//         type: '',
//         title: '',
//         description: '',
//         poll_options: [''],
//         poll_answer_type: false,
//         images: []
//     });

//     useEffect(() => {
//         console.log('Dispatching getFeedDataByid with editData:', editData);
//         dispatch(getFeedDataByid(editData))
//             .then((res) => {
//                 console.log('Full Response:', res);
//                 console.log('Payload:', res.payload);

//                 if (res.payload && res.payload.data) {
//                     const feedData = res.payload.data;
//                     console.log(feedData , "feeddata");
//                     setInitialValues({
//                         type: feedData.type,
//                         title: feedData.title,
//                         description: feedData.description,
//                         poll_options: feedData.type === 'poll' ? feedData.poll_options || [''] : [],
//                         poll_answer_type: feedData.poll_answer_type || false,
//                         images: []
//                     });
//                     console.log(setInitialValues,"initial values")
//                 } else {
//                     console.error("Feed data not available or API response structure changed");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Failed to fetch feed details:", error);
//             });
//     }, [dispatch, editData]);

//     const validationSchema = Yup.object({
//         title: Yup.string().required('Title is required'),
//         description: Yup.string().required('Description is required'),
//         poll_options: Yup.array().of(Yup.string()).when('type', {
//             is: 'poll',
//             then: Yup.array().required('At least one poll option is required')
//         }),
//         poll_answer_type: Yup.boolean().required('Poll answer type is required'),
//         images: Yup.array().when('type', {
//             is: 'feed',
//             then: Yup.array().required('At least one image is required')
//         })
//     });

//     const onSubmit = (values, { resetForm }) => {
//         const formData = new FormData();
//         formData.append('type', values.type);
//         formData.append('title', values.title);
//         formData.append('description', values.description);

//         if (values.type === 'feed') {
//             values.images.forEach((file, index) => {
//                 formData.append(`file${index}`, file);
//             });
//         }

//         if (values.type === 'poll') {
//             formData.append('poll_options', JSON.stringify(values.poll_options));
//             formData.append('poll_answer_type', values.poll_answer_type);
//         }

//         dispatch(updateFeedAndPolldRequest({ editData, formData }))
//             .then((res) => {
//                 if (res) {
//                     navigate('/property-management/fides');
//                     resetForm();
//                 }
//             })
//             .catch((error) => {
//                 console.error('Failed to update feed:', error);
//             });
//     };

//     return (
//         <div className="relative min-h-full">
//             <div className="flex justify-content-between align-items-center">
//                 <div className="flex flex-row w-full">
//                     <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Edit Feeds</h5>
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
//                                         <label htmlFor="type">Type</label>
//                                         <InputText id="type" name="type" value={values.type} readOnly className="p-inputtext p-disabled" />
//                                     </div>

//                                     <div className="field col-12 md:col-3 mb-1">
//                                         <label htmlFor="title" className="required">Title</label>
//                                         <InputText
//                                             id="title"
//                                             name="title"
//                                             value={values.title}
//                                             onChange={(e) => setFieldValue('title', e.target.value)}
//                                             placeholder="Enter Title"
//                                             className={errors.title && touched.title ? 'p-invalid' : ''}
//                                         />
//                                         {errors.title && touched.title && <small className="p-error">{errors.title}</small>}
//                                     </div>

//                                     <div className="field col-12 md:col-6 mb-1">
//                                         <label htmlFor="description" className="required">Description</label>
//                                         <InputTextarea
//                                             id="description"
//                                             name="description"
//                                             value={values.description}
//                                             onChange={(e) => setFieldValue('description', e.target.value)}
//                                             rows={1}
//                                             placeholder="Enter Description"
//                                             className={errors.description && touched.description ? 'p-invalid' : ''}
//                                         />
//                                         {errors.description && touched.description && <small className="p-error">{errors.description}</small>}
//                                     </div>
//                                 </div>

//                                 {values.type === 'poll' && (
//                                     <div className="flex gap-2">
//                                         <div className="field col-12 md:col-6">
//                                             <label className="required">Poll Options</label>
//                                             <FieldArray name="poll_options">
//                                                 {({ push, remove }) => (
//                                                     <>
//                                                         {values.poll_options.map((option, index) => (
//                                                             <div key={index} className="flex align-items-center mb-2">
//                                                                 <InputText
//                                                                     value={option}
//                                                                     onChange={(e) => {
//                                                                         const options = [...values.poll_options];
//                                                                         options[index] = e.target.value;
//                                                                         setFieldValue('poll_options', options);
//                                                                     }}
//                                                                     placeholder={`Option ${index + 1}`}
//                                                                     className={errors.poll_options && touched.poll_options && errors.poll_options[index] ? 'p-invalid' : ''}
//                                                                 />
//                                                                 <Button icon="pi pi-minus" className="p-button-danger p-button-text ml-2" onClick={() => remove(index)} />
//                                                                 <Button icon="pi pi-plus" className="p-button-success p-button-text ml-2" onClick={() => push('')} disabled={values.poll_options.length >= 5} />
//                                                             </div>
//                                                         ))}
//                                                     </>
//                                                 )}
//                                             </FieldArray>
//                                             {errors.poll_options && touched.poll_options && typeof errors.poll_options === 'string' && <small className="p-error">{errors.poll_options}</small>}
//                                         </div>

//                                         <div className="field-checkbox mt-3">
//                                             <Checkbox
//                                                 inputId="poll_answer_type"
//                                                 name="poll_answer_type"
//                                                 checked={values.poll_answer_type}
//                                                 onChange={(e) => setFieldValue('poll_answer_type', e.checked)}
//                                             />
//                                             <label htmlFor="poll_answer_type" className="ml-2">Allow Multiple Answers</label>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {values.type === 'feed' && (
//                                     <div className="field col-12 md:col-6 mb-3">
//                                         <label htmlFor="images" className="required">Upload Images</label>
//                                         <FileUpload
//                                             name="images"
//                                             customUpload
//                                             multiple
//                                             maxFileSize={250000000}
//                                             onSelect={(e) => {
//                                                 const files = e.files.map((file) => file);
//                                                 setFieldValue('images', files);
//                                             }}
//                                             onClear={() => setFieldValue('images', [])}
//                                             accept="image/*"
//                                             emptyTemplate={<p className="m-0">Drag and drop images here or click to browse</p>}
//                                             className={errors.images && touched.images ? 'p-invalid' : ''}
//                                         />
//                                         {errors.images && touched.images && <small className="p-error">{errors.images}</small>}
//                                     </div>
//                                 )}

//                                 <div className="field col-12 md:col-12 flex justify-content-end mt-3">
//                                     <Button label="Save" type="submit" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
//                                     <Button label="Reset" type="button" className="p-button-outlined p-button-secondary mb-2 w-7rem" onClick={handleReset} />
//                                 </div>
//                             </Form>
//                         )}
//                     </Formik>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditFeeds;


import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import components from '../..';
import { FileUpload } from 'primereact/fileupload';
import { feedCreateRequest, updateFeedAndPolldRequest } from '../../../../redux/slice/AdminSlices/feedSlice';

const EditFeeds = ({ editData, onHide }) => {
    console.log(editData,"editdata");
    const { Dialog, useDispatch } = components;
    const dispatch = useDispatch();

    const [submitted, setSubmitted] = useState(false);
    const [formValue, setFormValue] = useState({
        id: '',
        title: '',
        description: '',
        poll_options: [''],
        poll_answer_type: false,
        images: []
    });
    // Validation schema
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        poll_options: Yup.array()
            .of(Yup.string())
            .when('type', {
                is: 'poll',
                then: Yup.array().required('At least one poll option is required')
            }),
        poll_answer_type: Yup.boolean().required('Poll answer type is required'),
        images: Yup.array().when('type', {
            is: 'feed',
            then: Yup.array().required('At least one image is required')
        })
    });

    useEffect(() => {
        if (editData) {
            setFormValue({
                id: editData._id || '',
                title: editData.title || '',
                description: editData.description || '',
                poll_options: editData.poll_options || [''],
                poll_answer_type: editData.poll_answer_type || false,
                images: editData.images || []
            });
        }
    }, [editData]);

    return (
        <Formik
            initialValues={formValue}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) => {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                }, 5000);

                const sendData = {
                    title: values.title,
                    description: values.description,
                    poll_options: values.poll_options || [],
                    poll_answer_type: values.poll_answer_type || false,
                    images: values.images || []
                };

                if (values.id) {
                    dispatch(updateFeedAndPolldRequest(values.id, sendData));
                } else {
                    dispatch(feedCreateRequest(sendData));
                }
            }}
        >
            {({ values, setFieldValue, handleChange, errors, touched }) => (
                <Form className="p-fluid">
                    <div className="flex justify-content-between">
                        <div className="field col-12 md:col-3 mb-1">
                            <label htmlFor="type">Type</label>
                            <InputText id="type" name="type" value={values.type} readOnly className="p-inputtext p-disabled" />
                        </div>

                        <div className="field col-12 md:col-3 mb-1">
                            <label htmlFor="title" className="required">
                                Title
                            </label>
                            <InputText
                                id="title"
                                name="title"
                                value={values.title}
                                onChange={(e) => setFieldValue('title', e.target.value)}
                                placeholder="Enter Title"
                                className={errors.title && touched.title ? 'p-invalid' : ''}
                            />
                            {errors.title && touched.title && <small className="p-error">{errors.title}</small>}
                        </div>

                        <div className="field col-12 md:col-6 mb-1">
                            <label htmlFor="description" className="required">
                                Description
                            </label>
                            <InputTextarea
                                id="description"
                                name="description"
                                value={values.description}
                                onChange={(e) => setFieldValue('description', e.target.value)}
                                rows={1}
                                placeholder="Enter Description"
                                className={errors.description && touched.description ? 'p-invalid' : ''}
                            />
                            {errors.description && touched.description && <small className="p-error">{errors.description}</small>}
                        </div>
                    </div>

                    {values.type === 'poll' && (
                        <div className="flex gap-2">
                            <div className="field col-12 md:col-6">
                                <label className="required">Poll Options</label>
                                <FieldArray name="poll_options">
                                    {({ push, remove }) => (
                                        <>
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
                                                    <Button icon="pi pi-minus" className="p-button-danger p-button-text ml-2" onClick={() => remove(index)} />
                                                    <Button icon="pi pi-plus" className="p-button-success p-button-text ml-2" onClick={() => push('')} disabled={values.poll_options.length >= 5} />
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </FieldArray>
                                {errors.poll_options && touched.poll_options && typeof errors.poll_options === 'string' && <small className="p-error">{errors.poll_options}</small>}
                            </div>

                            <div className="field-checkbox mt-3">
                                <Checkbox inputId="poll_answer_type" name="poll_answer_type" checked={values.poll_answer_type} onChange={(e) => setFieldValue('poll_answer_type', e.checked)} />
                                <label htmlFor="poll_answer_type" className="ml-2">
                                    Allow Multiple Answers
                                </label>
                            </div>
                        </div>
                    )}

                    {values.type === 'feed' && (
                        <div className="field col-12 md:col-6 mb-3">
                            <label htmlFor="images" className="required">
                                Upload Images
                            </label>
                            <FileUpload
                                name="images"
                                customUpload
                                multiple
                                maxFileSize={250000000}
                                onSelect={(e) => {
                                    const files = e.files.map((file) => file);
                                    setFieldValue('images', files);
                                }}
                                onClear={() => setFieldValue('images', [])}
                                accept="image/*"
                                emptyTemplate={<p className="m-0">Drag and drop images here or click to browse</p>}
                                className={errors.images && touched.images ? 'p-invalid' : ''}
                            />
                            {errors.images && touched.images && <small className="p-error">{errors.images}</small>}
                        </div>
                    )}

                    <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={onHide} />
                        <Button disabled={submitted} label={values.id ? 'Update' : 'Save'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default EditFeeds;
