import components from '../..';
import Loader from '../../../../components/Loader';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getPropertyDataByid, propertyTransferRequest } from '../../../../redux/slice/AdminSlices/propertySlice';
import { getUserDropdownForPropertyAssign } from '../../../../redux/slice/AdminSlices/userSlice';
import { useParams } from 'react-router-dom';
const PropertyTransfer = () => {
    const { PickList, Divider, Image, BreadCrumb, RadioButton, Dropdown, InputText, InputNumber, InputTextarea, Button, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const params = useParams();
    const { loginDetails } = useSelector((store) => store.auth);
    const { userDropdownData } = useSelector((store) => store.user);
    const { blockDropdownData, floorDropdownData, propertyDropdownData } = useSelector((store) => store.block);
    const { isCreated, propertyFromStructur, isTransfer, isLoading, propertyDataByid } = useSelector((store) => store.property);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [createExisting, setCreateExisting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showFile, setShowFile] = useState(null);
    const [showPhoto, setShowPhoto] = useState(null);
    const [formValue, setFormValue] = useState({
        id: '',
        ownerName: '',
        email: '',
        gender: '',
        mobile_number: null,
        alternate_number: null,
        permanent_address: '',
        remarks: '',
        file: null,
        photo: null
    });
    const SignupSchema = Yup.object().shape({
        ownerName: Yup.string().trim().nullable().required(' '),
        remarks: Yup.string().trim().nullable().required('Please enter remarks.'),
        gender: Yup.string().trim().nullable().required('Please select gender.'),
        email: Yup.string().trim().nullable().required('Please enter email.').email('Please enter valid email.'),
        mobile_number: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number.'),
        // property_sq_feet_area: Yup.number().nullable().positive('Must be more than 0').required('Please enter square feet'),
        alternate_number: Yup.string().trim().nullable().min(10, 'Alternate number must be at least 10 digit number.').max(10, 'Alternate number must be at least 10 digit number.')
        // property: Yup.array().nullable().required('Please select property')
    });
    const SignupSchema2 = Yup.object().shape({
        ownerName: Yup.string().trim().nullable().required(' '),
        remarks: Yup.string().trim().nullable().required('Please enter remarks.'),
        // gender: Yup.string().trim().nullable().required('Please select gender'),
        email: Yup.string().trim().nullable().required('Please enter email.').email('Please enter valid email.'),
        mobile_number: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number.'),
        // property_sq_feet_area: Yup.number().nullable().positive('Must be more than 0').required('Please enter square feet'),
        alternate_number: Yup.string().trim().nullable().min(10, 'Alternate number must be at least 10 digit number.').max(10, 'Alternate number must be at least 10 digit number.')
        // property: Yup.array().nullable().required('Please select property')
    });
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Properties',
        command: () => {
            navigate('/property-management/property-assign');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Property Transfer'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    useEffect(() => {
        if (isTransfer) {
            navigate('/property-management/property-assign');
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
            setFieldValue('gender', fieldData.gender ? fieldData.gender : '');
            setFieldValue('email', fieldData.email);
            setFieldValue('mobile_number', fieldData.mobile_number);
            setFieldValue('alternate_number', fieldData.alternate_number !== '' ? fieldData.alternate_number : null);
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
    const handleUploadPhoto = async (event, setFieldValue) => {
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
                setFieldValue('photo', event.target.files[0]);
                setShowPhoto(URL.createObjectURL(event.target.files[0]));
            } else {
                toast.error('Only accepts .png, .jpg, and .jpeg files.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    // console.log(propertyDataByid, "propertyDataByid");
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

        // First ensure we have the latest user data
        await dispatch(getUserDropdownForPropertyAssign());

        // Check if email exists in userDropdownData
        const existingUser = userDropdownData?.find((user) => user.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            // Switch to existing user mode
            setCreateExisting(true);
            // Set the form values with existing user data
            setFieldValue('ownerName', existingUser.name);
            setFieldValue('email', existingUser.email);
            setFieldValue('gender', existingUser.gender || '');
            setFieldValue('mobile_number', existingUser.mobile_number);
            setFieldValue('alternate_number', existingUser.alternate_number || null);
            setFieldValue('permanent_address', existingUser.permanent_address || '');

            toast.success('User already exists! Switched to existing user mode.', {
                style: {
                    marginTop: '4rem'
                }
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
                    <span className="p-tag text-base">Current Owner</span>
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
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.mobile_number ? propertyDataByid?.mobile_number : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium"> Alternate No.</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.alternate_number ? propertyDataByid?.alternate_number : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Sq. Ft. Area</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{propertyDataByid?.property_sq_feet_area ? propertyDataByid?.property_sq_feet_area : '-'}</div>
                    </li>
                </ul>

                <Divider align="center" className=" pt-0">
                    <span className="p-tag text-base">Transfer Owner's Details</span>
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
                        if (values?.file !== null && values?.photo !== null) {
                            let data = {
                                name: values?.ownerName,
                                email: values?.email,
                                gender: values?.gender,
                                mobile_number: values?.mobile_number,
                                alternate_number: values?.alternate_number === null ? '' : values?.alternate_number,
                                user_property_assigns_status: 'Active',
                                permanent_address: values?.permanent_address,
                                remark: values?.remarks,
                                file: values?.file !== null ? values?.file : '',
                                photo: values?.photo !== null ? values?.photo : ''
                            };
                            dispatch(propertyTransferRequest(params.id, data));
                        } else if (values?.file === null) {
                            toast.error('Please upload transfer proof.', {
                                style: {
                                    marginTop: '4rem'
                                }
                            });
                        } else if (values?.photo === null) {
                            toast.error('Please upload photo.', {
                                style: {
                                    marginTop: '4rem'
                                }
                            });
                        }
                        // if (target.length > 0) {
                        //     let data = {
                        //         name: values?.ownerName,
                        //         email: values?.email,
                        //         gender: values?.gender,
                        //         mobile_number: values?.mobile_number,
                        //         alternate_number: values?.alternate_number === null ? '' : values?.alternate_number,
                        //         // user_property_assign_id: values?.property,
                        //         user_property_assign_id: target.map((x) => x.property_assign_id),
                        //         property_number: target.map((x) => x.label),
                        //         // property_number: values?.property?.reduce((acc, val) => {
                        //         //     let coll = propertyDropdownData.find(x => x.property_assign_id === val || )?.label;
                        //         //     if (coll) acc.push(coll);
                        //         //     return acc;
                        //         // }, []) || [],
                        //         property_sq_feet_area: values.property_sq_feet_area,
                        //         user_property_assigns_status: values?.property_status,
                        //         permanent_address: values?.permanent_address
                        //     };
                        //     values?.id === '' && dispatch(propertyAssignRequest(data));
                        // } else {
                        //     toast.error('Please select properties.', {
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
                                                    dispatch(getUserDropdownForPropertyAssign());
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
                                    <label htmlFor="ownerName" className="required">
                                        Owner's Name
                                    </label>
                                    {createExisting === true ? (
                                        <Dropdown
                                            id="ownerName"
                                            optionLabel="label"
                                            optionValue="name"
                                            options={filterData(userDropdownData, propertyDataByid?.email)}
                                            name="ownerName"
                                            placeholder={values?.ownerName !== '' ? values?.ownerName : 'Select Owner'}
                                            type="text"
                                            value={values?.ownerName}
                                            valueTemplate={values?.ownerName && setLabelName}
                                            onChange={(e) => {
                                                handleReset();
                                                setFieldValue('ownerName', e.target.value);
                                                setDefaultData(e.originalEvent.target.ariaLabel, userDropdownData, setFieldValue);
                                            }}
                                            className={classNames({ 'p-invalid': errors.ownerName && touched.ownerName })}
                                            filter
                                        />
                                    ) : (
                                        <InputText
                                            id="ownerName"
                                            name="ownerName"
                                            placeholder="Enter Owner Name"
                                            type="text"
                                            value={values?.ownerName}
                                            onChange={handleChange}
                                            className={classNames({ 'p-invalid': errors.ownerName && touched.ownerName })}
                                        />
                                    )}
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.ownerName && touched.ownerName ? 'Please enter owner name.' : ''}
                                    </div>
                                    {/* {errors.ownerName && touched.ownerName ? <small className="p-invalid error">{'Please enter owner name'}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="gender" className="required">
                                        Gender
                                    </label>
                                    <Dropdown
                                        id="dropdown"
                                        optionLabel="label"
                                        optionValue="value"
                                        options={[
                                            { label: 'Male', value: 'Male' },
                                            { label: 'Female', value: 'Female' },
                                            { label: 'Other', value: 'Other' }
                                        ]}
                                        name="gender"
                                        placeholder="Select Gender"
                                        type="text"
                                        value={values?.gender}
                                        onChange={(e) => {
                                            setFieldValue('gender', e.target.value);
                                        }}
                                        disabled={createExisting === true}
                                        className={classNames({ 'p-invalid': errors.gender && touched.gender })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.gender && touched.gender ? errors.gender : ''}
                                    </div>
                                    {/* {errors.gender && touched.gender ? <small className="p-invalid error">{errors.gender}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="email" className="required">
                                        Owner's Email
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
                                    <label htmlFor="mobile_number" className="required">
                                        Mobile Number
                                    </label>
                                    <InputNumber
                                        id="mobile_number"
                                        type="tel"
                                        placeholder="Enter Mobile Number"
                                        name="mobile_number"
                                        value={values?.mobile_number}
                                        useGrouping={false}
                                        maxLength={10}
                                        onValueChange={(e) => {
                                            setFieldValue('mobile_number', e.value === null ? null : e.value.toString());
                                        }}
                                        disabled={createExisting === true}
                                        className={classNames({ 'p-invalid': errors.mobile_number && touched.mobile_number })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.mobile_number && touched.mobile_number ? errors.mobile_number : ''}
                                    </div>

                                    {/* {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="alternate_number" className="">
                                        Alternate Number
                                    </label>
                                    <InputNumber
                                        id="alternate_number"
                                        type="tel"
                                        placeholder="Enter Alternate Number"
                                        name="alternate_number"
                                        value={values?.alternate_number}
                                        useGrouping={false}
                                        maxLength={10}
                                        onValueChange={(e) => {
                                            setFieldValue('alternate_number', e.value === null ? null : e.value.toString());
                                        }}
                                        disabled={createExisting === true}
                                        className={classNames({ 'p-invalid': errors.alternate_number && touched.alternate_number })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.alternate_number && touched.alternate_number ? errors.alternate_number : ''}
                                    </div>

                                    {/* {errors.alternate_number && touched.alternate_number ? <small className="p-invalid error">{errors.alternate_number}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="permanent_address" className="">
                                        Permanent Address
                                    </label>
                                    <InputTextarea id="permanent_address" placeholder="Enter Permanent Address" rows="2" cols="30" value={values?.permanent_address} onChange={handleChange} disabled={createExisting === true} autoResize />
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="remarks" className="required">
                                        {'Remarks (Transfer Fees)'}
                                    </label>
                                    <InputTextarea id="remarks" placeholder="Enter remarks" rows="2" cols="30" value={values?.remarks} onChange={handleChange} className={classNames({ 'p-invalid': errors.remarks && touched.remarks })} autoResize />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.remarks && touched.remarks ? errors.remarks : ''}
                                    </div>
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
                                            <i className="pi pi-file-pdf" style={{ fontSize: '1.2rem', color: '#f63939' }}></i>
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
                                <div className="field col-12 md:col-4 mb-1">
                                    <div>
                                        <label htmlFor="" className="required">
                                            Photo (Passport Size)
                                        </label>
                                    </div>
                                    {values?.photo === null && (
                                        <div className="file-input-upload mt-2">
                                            <input type="file" id="fileInput1" accept=".jpg, .jpeg, .png " className="input" onChange={(event) => handleUploadPhoto(event, setFieldValue)} />
                                            <label for="fileInput1" className="label">
                                                <span>Upload Photo...</span>
                                            </label>
                                        </div>
                                    )}
                                    {values?.photo !== null && (
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
                                    )}
                                </div>
                            </div>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-12 mb-0 flex justify-content-end">
                                    <Button type="button" label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/property-assign')} />
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
export default PropertyTransfer;
