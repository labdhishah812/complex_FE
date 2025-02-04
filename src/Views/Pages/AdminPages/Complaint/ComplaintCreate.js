import components from '../..';
import Loader from '../../../../components/Loader';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import ReactQuill from 'react-quill';
import * as Yup from 'yup';
import { getPropertyDropDownWithOwner } from '../../../../redux/slice/AdminSlices/blockSlice';
import { complaintAssignRequest, updateComplaintRequest, getComplaintDetailByIdRequest } from '../../../../redux/slice/AdminSlices/complaintSlice';
import { useParams } from 'react-router-dom';

const ComplaintCreate = () => {
    const { React, RadioButton, Dropdown, InputTextarea, Image, classNames, BreadCrumb, Button, InputText, useNavigate, useState, useEffect, useDispatch, useSelector, toast } = components;
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { propertyDropdownWithOwner } = useSelector((store) => store.block);
    const { isCreated, complaintDetailById, isLoading } = useSelector((store) => store.complaint);
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [createShopping, setCreateShopping] = useState(true);
    const [createForChairman, setCreateForChairman] = useState(false);
    const [formValue, setFormValue] = useState({
        id: '',
        block: '',
        floor: '',
        property: '',
        user_id: '',
        subject: '',
        description: '',
        complaint_image: []
    });
    const SignupSchema = Yup.object().shape({
        // user_id: Yup.string().trim().nullable().required('Please select property.'),
        // property: Yup.string().trim().nullable().required('Please select property.'),
        subject: Yup.string().trim().nullable().required('Please enter subject.'),
        description: Yup.string().trim().nullable().required('Please enter description.')
    });
    const SignupSchema2 = Yup.object().shape({
        description: Yup.string().trim().nullable().required('Please enter description.')
    });
    const breadcrumbHome = {
        label: 'Complaints',
        command: () => {
            navigate(`/property-management/complain`);
        }
    };
    const breadcrumbItems = [
        {
            label: params.id ? 'Edit Complaint' : 'Raise Complaint'
        }
    ];
    useEffect(() => {
        dispatch(getPropertyDropDownWithOwner({ module_name: 'Inner' }));
    }, [dispatch]);
    useEffect(() => {
        if (params.id) {
            dispatch(getComplaintDetailByIdRequest(params.id));
        }
    }, [params.id]);
    useEffect(() => {
        if (isCreated) navigate(`/property-management/complain`);
    }, [isCreated]);
    useEffect(() => {
        if (complaintDetailById && complaintDetailById?._id) {
            let file = [];
            complaintDetailById?.complain_files.length > 0 &&
                complaintDetailById?.complain_files.forEach((a) => {
                    file.push({ img: a, showImg: `${process.env.REACT_APP_COMON_UPLOAD_BASE}Complaint/${a}` });
                });
            let setData = {
                id: complaintDetailById._id,
                block: '',
                floor: '',
                // property: complaintDetailById.user_property_assign_id,
                // user_id: complaintDetailById.user_id,
                subject: complaintDetailById.subject,
                description: complaintDetailById.description,
                complaint_image: file
            };
            setFormValue(setData);
        }
        // if (isCreated) navigate(`/property-management/complain`);
    }, [complaintDetailById]);
    const getShoppingDropdown = () => {
        try {
            dispatch(getPropertyDropDownWithOwner({ module_name: 'Outer' }));
            // if (decode.is_block_exist_in_shopping_center_property === true) {
            //     dispatch(getShopBlockDropdownRequest());
            // }
            // if (decode.is_block_exist_in_shopping_center_property === undefined && decode.is_floor_exist_in_shopping_center_property === true) {
            //     dispatch(getShopFloorDropdownRequest({}));
            // }
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpload = async (event, value, setFieldValue) => {
        try {
            const maxFileCount = 5; // Maximum allowed files
            const currentFileCount = value?.length || 0; // Current uploaded files
            const files = event.target.files;

            if (currentFileCount + files.length > maxFileCount) {
                // If the total file count exceeds 5, show a toast error
                toast.error(`You can upload a maximum of ${maxFileCount} images.`, {
                    style: {
                        marginTop: '4rem'
                    }
                });
                return; // Prevent further processing
            }

            const allowedExtensions = ['.jpg', '.jpeg', '.png']; // Allowed file types
            const maxFileSize = 2 * 1024 * 1024; // Maximum file size (2MB)

            let updatedFiles = [...value]; // Clone the existing files array

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = file.name;
                const fileSize = file.size;

                // Validate file type
                const isValidExtension = allowedExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));

                if (!isValidExtension) {
                    toast.error('Only accepts .png, .jpg, and .jpeg files.', {
                        style: {
                            marginTop: '4rem'
                        }
                    });
                    continue; // Skip this file
                }

                // Validate file size
                if (fileSize > maxFileSize) {
                    toast.error(`File size should be less than 2MB.`, {
                        style: {
                            marginTop: '4rem'
                        }
                    });
                    continue; // Skip this file
                }

                // If valid, add the file to the array
                updatedFiles.push({
                    img: file,
                    showImg: URL.createObjectURL(file)
                });
            }

            // Update the field value with the updated file list
            setFieldValue('complaint_image', updatedFiles);

            event.preventDefault();
        } catch (error) {
            console.error(error);
        }
    };

    const removeImg = (i, value, setFieldValue) => {
        try {
            let data = value;
            data.splice(i, 1);
            setFieldValue('complaint_image', data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Complaint' : 'Raise Complaint'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={!createForChairman ? SignupSchema : SignupSchema2}
                    enableReinitialize
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        let images = values?.complaint_image.map((item) => item.img);
                        let formData = new FormData();
                        formData.append('description', values?.description);
                        formData.append('subject', values?.subject);
                        for (const file of images) {
                            formData.append('files', file);
                        }
                        if (values?.id !== '' && images.length === 0) {
                            formData.append('files', []);
                        }
                        // if (!createForChairman && values?.id === '') {
                        //     formData.append('user_id', values?.user_id);
                        //     formData.append('user_property_assign_id', values?.property);
                        //     // formData.append('subject', values?.subject);
                        // }
                        // let sendData = {
                        //     // user_id: values?.user_id,
                        //     // user_property_assign_id: values?.property,
                        //     description: values?.description,
                        //     files: images ? images : []
                        // };
                        // if (!createForChairman) {
                        //     sendData.user_id = values?.user_id;
                        //     sendData.user_property_assign_id = values?.property;
                        // }
                        values?.id === '' ? dispatch(complaintAssignRequest(formData)) : dispatch(updateComplaintRequest(values?.id, formData));
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            {values.id === '' && (
                                <div className="grid p-fluid mt-1">
                                    {/* {loginDetails.role_permissions.length === 1 && loginDetails.role_permissions.find((x) => x.role === "User") && (
                                        <div className="field col-12 md:col-4 mb-1">
                                            <label className="required">Do you want complain to chairman </label>
                                            <div className="flex flex-wrap gap-3 ">
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="createForChairman1"
                                                        name="createForChairman"
                                                        value="yes"
                                                        onChange={(e) => {
                                                            setCreateForChairman(true);
                                                            setCreateShopping(true);
                                                            decodeURI();
                                                            handleReset();
                                                            setFieldValue('complaint_image', []);
                                                        }}
                                                        checked={createForChairman === true}
                                                    />
                                                    <label htmlFor="createForChairman1" className="ml-2">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="createForChairman2"
                                                        name="createForChairman"
                                                        value="no"
                                                        onChange={(e) => {
                                                            setCreateForChairman(false);
                                                            setCreateShopping(true);
                                                            decodeURI();
                                                            handleReset();
                                                            setFieldValue('complaint_image', []);
                                                        }}
                                                        checked={createForChairman === false}
                                                    />
                                                    <label htmlFor="createForChairman2" className="ml-2">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )} */}
                                    {/* {loginDetails?.is_shopping_center_exist_in_property === true && !createForChairman && (
                                        <div className="field col-12 md:col-4 mb-1">
                                            <label className="required">Property assign type</label>
                                            <div className="flex flex-wrap gap-3 ">
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="createShopping1"
                                                        name="createShopping"
                                                        value="Flat"
                                                        onChange={(e) => {
                                                            setCreateShopping(true);
                                                            decodeURI();
                                                            handleReset();
                                                            setFieldValue('complaint_image', []);
                                                        }}
                                                        checked={createShopping === true}
                                                    />
                                                    <label htmlFor="createShopping1" className="ml-2">
                                                        Flat
                                                    </label>
                                                </div>
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="createShopping2"
                                                        name="createShopping"
                                                        value="Shopping"
                                                        onChange={(e) => {
                                                            setCreateShopping(false);
                                                            getShoppingDropdown();
                                                            handleReset();
                                                            setFieldValue('complaint_image', []);
                                                        }}
                                                        checked={createShopping === false}
                                                    />
                                                    <label htmlFor="createShopping2" className="ml-2">
                                                        Shopping
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            )}
                            <div className="grid p-fluid mt-1">
                                {/* {values.id === '' && !createForChairman && (
                                    <div className="field col-12 md:col-4 mb-1">
                                        <label htmlFor="property" className="required">
                                            Property
                                        </label>
                                        <Dropdown
                                            id="property"
                                            optionLabel="label"
                                            optionValue="property_assign_id"
                                            options={propertyDropdownWithOwner}
                                            name="property"
                                            placeholder="Select property"
                                            type="text"
                                            value={values?.property}
                                            onChange={(e) => {
                                                setFieldValue('property', e.target.value);
                                                setFieldValue('user_id', propertyDropdownWithOwner.find((x) => x.property_assign_id === e.target.value).owner_id);
                                            }}
                                            className={classNames({ 'p-invalid': errors.property && touched.property && values?.property === '' })}
                                            filter

                                        />
                                        <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.property && touched.property && values?.property === '' ? errors.property : ""}</div>
                                    </div>
                                )} */}
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="subject" className="required">
                                        Subject
                                    </label>
                                    <InputText id="subject" name="subject" placeholder="Enter Subject" type="text" value={values?.subject} onChange={handleChange} className={classNames({ 'p-invalid': errors.subject && touched.subject })} />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.subject && touched.subject ? errors.subject : ''}
                                    </div>

                                    {/* {errors.subject && touched.subject ? <small className="p-invalid error">{errors.subject}</small> : null} */}
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="description" className="required">
                                        Description
                                    </label>
                                    <InputTextarea
                                        id="description"
                                        placeholder="Enter Description"
                                        rows="2"
                                        cols="30"
                                        value={values?.description}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.description && touched.description })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.description && touched.description ? errors.description : ""}</div>
                                </div> */}
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
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-1 pt-5">
                                    <div className="file-input-upload">
                                        <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, values?.complaint_image, setFieldValue)} />
                                        <label for="fileInput" className="label">
                                            <span>Upload an Image...</span>
                                        </label>
                                    </div>
                                </div> */}
                                <div className="file-input-upload">
                                    <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" multiple onChange={(event) => handleUpload(event, values?.complaint_image, setFieldValue)} />
                                    <label htmlFor="fileInput" className="label">
                                        <span>Upload Images...</span>
                                    </label>
                                </div>
                            </div>
                            {values?.complaint_image.length > 0 && (
                                <div className="flex gap-2">
                                    {values?.complaint_image.map((a, i) => (
                                        <div className="block text-center">
                                            <Image src={a.showImg} alt="Image" width="100" height="100" preview />
                                            <div className="ml-1">
                                                <Button
                                                    icon="pi pi-trash"
                                                    className="p-button-rounded p-button-text  p-button-danger"
                                                    id="delete-icons"
                                                    tooltip="Delete"
                                                    tooltipOptions={{ position: 'bottom' }}
                                                    onClick={() => {
                                                        removeImg(i, values?.complaint_image, setFieldValue);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="p-invalid error text-xl mt-4" style={{ minHeight: '1.1rem', marginTop: '3px', width: '80rem' }}>
                                {'Notes :- '}
                                <span className="text-base">{'Only JPEG, JPG, PNG files are supported.'}</span>
                            </div>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button label="Cancel" type="button" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate(`/property-management/complain`)} />
                                    <Button disabled={submitted} label="Save" type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
export default ComplaintCreate;
