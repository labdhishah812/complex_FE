import React from 'react';
import components from '../..';
import Loader from '../../../../components/Loader';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getRentalDataByid } from '../../../../redux/slice/AdminSlices/RentalSlice';
import { getUserDropdown, getUserDropdownForTenant } from '../../../../redux/slice/AdminSlices/userSlice';
import { useParams } from 'react-router-dom';
import { getPropertyDataByid, tenantTransferRequest } from '../../../../redux/slice/AdminSlices/propertySlice';

const TenantTransfer = () => {
    const { PickList, Divider, Image, BreadCrumb, RadioButton, Dropdown, InputText, InputNumber, InputTextarea, Button, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { isCreated, propertyFromStructur, isTransfer, isLoading, propertyDataByid } = useSelector((store) => store.property);
    const { userDropdownData } = useSelector((store) => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [createExisting, setCreateExisting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showFile, setShowFile] = useState(null);
    const [formValue, setFormValue] = useState({
        id: '',
        name: '',
        email: '',
        start_date: '',
        end_date: '',
        // user_property_assign_id: '',
        mobile_no: '',
        permanent_address: '',
        file: null
    });

    const SignupSchema = Yup.object().shape({
        // name: Yup.string().trim().nullable().required(' '),
        // email: Yup.string().trim().nullable().required('Please enter email.').email('Please enter valid email.'),
        // start_date: Yup.string().trim().nullable().required('Please select start date.'),
        // end_date: Yup.string().trim().nullable().required('Please enter end date.'),
        // mobile_no: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number.'),
        // permanent_address: Yup.string().trim().nullable().min('Please enter permanent address'),
        // user_property_assign_id: Yup.string().trim().nullable().required('Please enter property assigned id.'),
    });
    const SignupSchema2 = Yup.object().shape({
        // name: Yup.string().trim().nullable().required(' '),
        // email: Yup.string().trim().nullable().required('Please enter email.').email('Please enter valid email.'),
        // start_date: Yup.string().trim().nullable().required('Please select start date.'),
        // end_date: Yup.string().trim().nullable().required('Please enter end date.'),
        // mobile_no: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number.'),
        // permanent_address: Yup.string().trim().nullable().min('Please enter permanent address'),
        // user_property_assign_id: Yup.string().trim().nullable().required('Please enter property assigned id.'),
    });

    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Tenant',
        command: () => {
            navigate('/property-management/tenant');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Tenant Transfer'
        }
    ];

    useEffect(() => {
        if (isTransfer) {
            navigate('/property-management/tenant');
        }
    }, [isTransfer]);

    useEffect(() => {
        if (params.id) {
            dispatch(getPropertyDataByid(params.id));
        }
    }, [params.id]);
    const setLabelName = (option, props) => {
        try {
            if (option) return option.name;
            return props.placeholder;
        } catch (error) {
            console.log(error);
        }
    };

    const setDefaultData = (val, data, setFieldValue) => {
        try {
            let fieldData = data.find((x) => x.label === val);
            setFieldValue('email', fieldData.email);
            setFieldValue('mobile_no', fieldData.mobile_no);
            setFieldValue('start_date', fieldData.start_date);
            setFieldValue('end_date', fieldData.end_date);
            setFieldValue('permanent_address', fieldData.permanent_address ? fieldData.permanent_address : '');
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpload = async (event, setFieldValue) => {
        try {
            const str = event.target.files[0]?.name;
            const substr = ['.jpg', '.jpeg', '.png', '.pdf'];
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                setFieldValue('file', event.target.files[0]);
                if (str.includes('.pdf')) {
                    setShowFile(str);
                } else {
                    setShowFile(URL.createObjectURL(event.target.files[0]));
                }
            } else {
                toast.error('Only accepts .png, .jpg, .jpeg and .pdf files.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const filterData = (data, val) => {
        try {
            let collectedData = [];
            if (data.length > 0) {
                collectedData = data.filter((x) => x.email !== val);
            }
            return collectedData;
        } catch (error) {
            console.log(error);
        }
    };
    const handleEmailCheck = async (email, setFieldValue) => {
        if (!email) return;

        // Fetch latest user data
        await dispatch(getUserDropdownForTenant());

        // Check if email exists in userDropdownData
        const existingUser = userDropdownData?.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            // Switch to existing user mode
            setCreateExisting(true);

            // Set form values with existing user data
            setFieldValue('name', existingUser.name);
            setFieldValue('email', existingUser.email);
            setFieldValue('mobile_no', existingUser.mobile_no);
            setFieldValue('permanent_address', existingUser.permanent_address || '');

            toast.success('User already exists! Switched to existing user mode.', {
                style: { marginTop: '4rem' }
            });
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Property Transfer</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Divider align="center" className=" pt-0">
                    <span className="p-tag text-base">Current Owner Details</span>
                </Divider>
                {/* <div className='font-semibold text-xl'>Current User</div> */}
                <ul className="list-none p-0 m-0 mt-3">
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium"> Property No.</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.property_number ? propertyDataByid?.property_number : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Owner Name</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.name ? propertyDataByid?.name : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium"> Email</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.email ? propertyDataByid?.email : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Mobile No.</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.mobile_no ? propertyDataByid?.mobile_no : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium"> Alternate No.</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.alternate_number ? propertyDataByid?.alternate_number : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Business Name</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.company_name ? propertyDataByid?.company_name : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium"> Business Category</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.category ? propertyDataByid?.category : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Sq. Ft. Area</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.property_sq_feet_area ? propertyDataByid?.property_sq_feet_area : '-'}</div>
                    </li>
                </ul>

                <Divider align="center" className=" pt-0">
                    {/* <span className="p-tag text-base">Transfer Owner's Details</span> */}
                    <span className="p-tag text-base">Transfer Tenant's Details</span>
                </Divider>
                <Formik
                    initialValues={formValue}
                    validationSchema={createExisting === true ? SignupSchema2 : SignupSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        if (values?.file !== null) {
                            let data = {
                                name: values?.name,
                                email: values?.email,
                                mobile_no: values?.mobile_no,
                                is_current_rental_status: 'Active',
                                permanent_address: values?.permanent_address,
                                start_date: values?.start_date,
                                // user_property_assign_id: values?.user_property_assign_id,
                                end_date: values?.end_date,
                                file: values?.file !== null ? values?.file : ''
                            };
                            dispatch(tenantTransferRequest(params.id, data));
                        } else if (values?.file === null) {
                            toast.error('Please upload transfer proof.', {
                                style: {
                                    marginTop: '4rem'
                                }
                            });
                        }
                        // else if (values?.photo === null) {
                        //     toast.error('Please upload photo.', {
                        //         style: {
                        //             marginTop: '4rem'
                        //         }
                        //     });
                        // }
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-8 mb-0">
                                    <label className="required">Do You Want Transfer Property With Exiting User?</label>
                                    <div className="flex flex-wrap gap-3 ">
                                        <div className="flex align-items-center">
                                            <RadioButton
                                                inputId="createExisting1"
                                                name="createExisting"
                                                value="yes"
                                                onChange={(e) => {
                                                    setCreateExisting(true);
                                                    handleReset();
                                                    dispatch(getUserDropdownForTenant());
                                                }}
                                                checked={createExisting === true}
                                            />
                                            <label htmlFor="createExisting1" className="ml-2">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="flex align-items-center">
                                            <RadioButton
                                                inputId="createExisting2"
                                                name="createExisting"
                                                value="no"
                                                onChange={(e) => {
                                                    setCreateExisting(false);
                                                    handleReset();
                                                }}
                                                checked={createExisting === false}
                                            />
                                            <label htmlFor="createExisting2" className="ml-2">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="name" className="required">
                                        Tenant's Name
                                    </label>
                                    {createExisting === true ? (
                                        <Dropdown
                                            id="name"
                                            optionLabel="label"
                                            optionValue="name"
                                            options={filterData(userDropdownData, propertyDataByid?.email)}
                                            name="name"
                                            placeholder={values?.name !== '' ? values?.name : 'Select Tenant'}
                                            type="text"
                                            value={values?.name}
                                            valueTemplate={values?.name && setLabelName}
                                            onChange={(e) => {
                                                handleReset();
                                                setFieldValue('name', e.target.value);
                                                setDefaultData(e.originalEvent.target.ariaLabel, userDropdownData, setFieldValue);
                                            }}
                                            className={classNames({ 'p-invalid': errors.name && touched.name })}
                                            filter
                                        />
                                    ) : (
                                        <InputText id="name" name="name" placeholder="Enter Tenant Name" type="text" value={values?.name} onChange={handleChange} className={classNames({ 'p-invalid': errors.name && touched.name })} />
                                    )}
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.name && touched.name ? 'Please enter owner name.' : ''}
                                    </div>
                                    {/* {errors.name && touched.name ? <small className="p-invalid error">{'Please enter owner name'}</small> : null} */}
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="email" className="required">
                                        Tenant's Email
                                    </label>
                                    <InputText
                                        id="email"
                                        name="email"
                                        placeholder="Enter Owner's Email"
                                        type="text"
                                        value={values?.email}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.email && touched.email })}
                                        disabled={createExisting === true}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.email && touched.email ? errors.email : ''}
                                    </div>
                                </div> */}
                                <div className="field col-12 md:col-4 mb-0">
                                            <label htmlFor="email" className="required">
                                            Tenant's Email
                                            </label>
                                            <InputText
                                                id="email"
                                                name="email"
                                                placeholder="Enter Owner's Email"
                                                type="text"
                                                value={values?.email}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    if (!createExisting) {
                                                        // Only check email if we're in "No" mode
                                                        handleEmailCheck(e.target.value, setFieldValue);
                                                    }
                                                }}
                                                className={classNames({ 'p-invalid': errors.email && touched.email })}
                                                disabled={createExisting === true}
                                            />
                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                {errors.email && touched.email ? errors.email : ''}
                                            </div>
                                        </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="mobile_no" className="required">
                                        Mobile Number
                                    </label>
                                    <InputNumber
                                        id="mobile_no"
                                        type="tel"
                                        placeholder="Enter Mobile Number"
                                        name="mobile_no"
                                        value={values?.mobile_no}
                                        useGrouping={false}
                                        maxLength={10}
                                        onValueChange={(e) => {
                                            setFieldValue('mobile_no', e.value === null ? null : e.value.toString());
                                        }}
                                        // disabled={createExisting === true}
                                        className={classNames({ 'p-invalid': errors.mobile_no && touched.mobile_no })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.mobile_no && touched.mobile_no ? errors.mobile_no : ''}
                                    </div>

                                    {/* {errors.mobile_no && touched.mobile_no ? <small className="p-invalid error">{errors.mobile_no}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="start_date" className="required">
                                        Start Date
                                    </label>
                                    <InputText
                                        id="start_date"
                                        name="start_date"
                                        placeholder="Enter Start Date"
                                        type="date"
                                        value={values?.start_date}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.start_date && touched.start_date })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.start_date && touched.start_date ? errors.start_date : ''}
                                    </div>
                                    {/* {errors.email && touched.email ? <small className="p-invalid error">{errors.email}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="end_date" className="required">
                                        End Date
                                    </label>
                                    <InputText id="end_date" name="end_date" placeholder="Enter End Date" type="date" value={values?.end_date} onChange={handleChange} className={classNames({ 'p-invalid': errors.end_date && touched.end_date })} />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.end_date && touched.end_date ? errors.end_date : ''}
                                    </div>
                                    {/* {errors.email && touched.email ? <small className="p-invalid error">{errors.email}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="permanent_address" className="">
                                        Permanent Address
                                    </label>
                                    <InputTextarea id="permanent_address" placeholder="Enter Permanent Address" rows="2" cols="30" value={values?.permanent_address} onChange={handleChange} autoResize />
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <div>
                                        <label htmlFor="" className="required">
                                            ID Proof
                                        </label>
                                    </div>
                                    {values?.file === null && (
                                        <div className="file-input-upload mt-2">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png ,.pdf" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                            <label for="fileInput" className="label">
                                                <span>Upload ID Proof...</span>
                                            </label>
                                        </div>
                                    )}
                                    {values?.file !== null && showFile.includes('.pdf') ? (
                                        <div className="flex align-items-center">
                                            <div>{showFile}</div>
                                            <div className="ml-3">
                                                <Button
                                                    icon="pi pi-trash"
                                                    className="p-button-rounded p-button-text  p-button-danger"
                                                    id="delete-icons"
                                                    tooltip="Delete"
                                                    tooltipOptions={{ position: 'bottom' }}
                                                    onClick={() => {
                                                        setFieldValue('file', null);
                                                        setShowFile(null);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        values?.file !== null && (
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
                                        )
                                    )}
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-1">
                                    <div>
                                        <label htmlFor="" className="required">
                                            Photo (Passport Size)
                                        </label>
                                    </div>
                                    {values?.photo === null && <div className="file-input-upload mt-2">
                                        <input type="file" id="fileInput1" accept=".jpg, .jpeg, .png " className="input"
                                            onChange={(event) => handleUploadPhoto(event, setFieldValue)}
                                        />
                                        <label for="fileInput1" className="label">
                                            <span>Upload Photo...</span>
                                        </label>
                                    </div>}
                                    {values?.photo !== null &&
                                        <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                            <div className="relative " style={{ width: '100px', height: '100px' }}>
                                                <Image alt="Image" src={showPhoto} width="100" height="100" preview />
                                                <div
                                                    className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                    style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                    onClick={() => {
                                                        setFieldValue('photo', null);
                                                        setShowPhoto(null);
                                                    }}
                                                >
                                                    <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div> */}
                            </div>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-12 mb-0 flex justify-content-end">
                                    <Button type="button" label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/tenant')} />
                                    <Button
                                        disabled={submitted}
                                        label="Save"
                                        type="submit"
                                        icon="pi pi-check"
                                        className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                        // onClick={() => dataSave()}
                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default TenantTransfer;
