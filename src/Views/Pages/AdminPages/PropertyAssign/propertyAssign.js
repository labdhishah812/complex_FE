import components from '../..';
import Loader from '../../../../components/Loader';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getPropertyDropdownRequest, getShopBlockDropdownRequest, getShopFloorDropdownRequest } from '../../../../redux/slice/AdminSlices/blockSlice';
import { propertyAssignRequest, setPropertyFromStructur } from '../../../../redux/slice/AdminSlices/propertySlice';
import { getUserDropdown } from '../../../../redux/slice/AdminSlices/userSlice';

const PropertyAssign = () => {
    const { MultiSelect, PickList, Divider, BreadCrumb, RadioButton, Dropdown, InputText, InputNumber, InputTextarea, Button, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { loginDetails } = useSelector((store) => store.auth);
    const { userDropdownData } = useSelector((store) => store.user);
    const { blockDropdownData, floorDropdownData, propertyDropdownData } = useSelector((store) => store.block);
    const { isCreated, propertyFromStructur, isLoading } = useSelector((store) => store.property);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [decode, setDecode] = useState(loginDetails);
    const [createShopping, setCreateShopping] = useState(true);
    const [createExisting, setCreateExisting] = useState(false);
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);
    const [formValue, setFormValue] = useState({
        id: '',
        ownerName: '',
        email: '',
        gender: '',
        mobile_number: null,
        alternate_number: null,
        permanent_address: '',
        block: '',
        floor: '',
        property: null,
        property_sq_feet_area: null,
        property_status: 'Active'
        // businessName: "",
        // businessCategory: "",
        // webSite: "",
        // businessPhone: "",
        // businessAddress: "",
        // pin_code: null,
        // city: "",
    });
    const SignupSchema = Yup.object().shape({
        ownerName: Yup.string().trim().nullable().required(' '),
        gender: Yup.string().trim().nullable().required('Please select gender.'),
        email: Yup.string().trim().nullable().required('Please enter email.').email('Please enter valid email.'),
        mobile_number: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number.'),
        // property_sq_feet_area: Yup.number().nullable().positive('Must be more than 0').required('Please enter square feet'),
        alternate_number: Yup.string().trim().nullable().min(10, 'Alternate number must be at least 10 digit number.').max(10, 'Alternate number must be at least 10 digit number.')
        // businessPhone: Yup.string().trim().nullable().min(10, 'Business number must be at least 10 digit number.').max(10, 'Business number must be at least 10 digit number.'),
        // pin_code: Yup.string().trim().nullable().min(6, 'Pincode no must be at least 6 digit no.').max(6, 'Pincode no must be at least 6 digit no.'),
        // property: Yup.array().nullable().required('Please select property')
    });
    const SignupSchema2 = Yup.object().shape({
        ownerName: Yup.string().trim().nullable().required(' '),
        // gender: Yup.string().trim().nullable().required('Please select gender'),
        email: Yup.string().trim().nullable().required('Please enter email.').email('Please enter valid email.'),
        mobile_number: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number.'),
        // property_sq_feet_area: Yup.number().nullable().positive('Must be more than 0').required('Please enter square feet'),
        alternate_number: Yup.string().trim().nullable().min(10, 'Alternate number must be at least 10 digit number.').max(10, 'Alternate number must be at least 10 digit number.')
        // businessPhone: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number.'),
        // pin_code: Yup.string().trim().nullable().min(6, 'Pincode no must be at least 6 digit no.').max(6, 'Mobile no must be at least 6 digit no.'),
        // property: Yup.array().nullable().required('Please select property')
    });
    useEffect(() => {
        if (loginDetails) {
            decodeURI();
        }
    }, []);
    // useEffect(() => {
    //     if (propertyFromStructur) {
    //         let data = { ...formValue }
    //         data.property = [propertyFromStructur?.id];
    //         setFormValue(data);
    //         dispatch(setPropertyFromStructur(null));
    //     }
    // }, [propertyFromStructur]);
    useEffect(() => {
        if (isCreated) {
            // decodeURI();
            navigate('/property-management/property-assign');
        }
    }, [isCreated]);
    useEffect(() => {
        if (propertyDropdownData) {
            let collect = propertyDropdownData.filter((x) => x.disabled !== true);
            if (propertyFromStructur) {
                let setSelected = collect.find((x) => x.property_assign_id === propertyFromStructur.property_assign_id);
                collect = collect.filter((x) => x.property_assign_id !== propertyFromStructur.property_assign_id);
                setTarget([setSelected]);
                // dispatch(setPropertyFromStructur(null));
            }
            setSource(collect);
        }
    }, [propertyDropdownData]);
    const handleEmailCheck = async (email, setFieldValue) => {
        if (!email) return;

        // First ensure we have the latest user data
        await dispatch(getUserDropdown());

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
    // const setTargetValue = (sourceVal) => {
    //     try {
    //         let collSorce = sourceVal;
    //         let collect = collSorce.filter((x) => x.property_assign_id !== propertyFromStructur.property_assign_id)
    //         setTarget([propertyFromStructur]);
    //         dispatch(setPropertyFromStructur(null));
    //         setSource(collect)

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const decodeURI = async () => {
        // if (loginDetails.is_block_exist_in_property === true) {
        //     dispatch(getBlockDropdownRequest());
        // }
        // if (loginDetails.is_block_exist_in_property === undefined && loginDetails.is_floor_exist_in_property === true) {
        //     dispatch(getFloorDropdownRequest({}));
        // }
        // if (loginDetails.is_block_exist_in_property === undefined && loginDetails.is_floor_exist_in_property === undefined && loginDetails.is_house_exist_in_property === true) {
        //     dispatch(getPropertyDropdownRequest({ module_name: 'user_property_assign' }));
        // }
        dispatch(getPropertyDropdownRequest({ module_name: 'user_property_assign' }));
    };
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Properties',
        command: () => {
            navigate('/property-management/property-assign');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Assign Property'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const getShoppingDropdown = () => {
        try {
            if (decode.is_block_exist_in_shopping_center_property === true) {
                dispatch(getShopBlockDropdownRequest());
            }
            if (decode.is_block_exist_in_shopping_center_property === undefined && decode.is_floor_exist_in_shopping_center_property === true) {
                dispatch(getShopFloorDropdownRequest({}));
            }
        } catch (error) {
            console.log(error);
        }
    };
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
    const itemTemplate = (item) => {
        try {
            return <div className="flex flex-wrap p-2 align-items-center gap-3">{item?.label}</div>;
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Assign Property</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={createExisting === true ? SignupSchema2 : SignupSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        if (target.length > 0) {
                            let data = {
                                name: values?.ownerName,
                                email: values?.email,
                                gender: values?.gender,
                                mobile_number: values?.mobile_number,
                                alternate_number: values?.alternate_number === null ? '' : values?.alternate_number,
                                // user_property_assign_id: values?.property,
                                user_property_assign_id: target.map((x) => x.property_assign_id),
                                property_number: target.map((x) => x.label),
                                // property_number: values?.property?.reduce((acc, val) => {
                                //     let coll = propertyDropdownData.find(x => x.property_assign_id === val || )?.label;
                                //     if (coll) acc.push(coll);
                                //     return acc;
                                // }, []) || [],
                                property_sq_feet_area: values.property_sq_feet_area,
                                user_property_assigns_status: values?.property_status,
                                permanent_address: values?.permanent_address
                            };
                            values?.id === '' && dispatch(propertyAssignRequest(data));
                        } else {
                            toast.error('Please select properties.', {
                                style: {
                                    marginTop: '4rem'
                                }
                            });
                        }
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            {propertyDropdownData && propertyDropdownData.length > 0 && (
                                <>
                                    <div className="grid p-fluid mt-1">
                                        {/* {decode?.is_shopping_center_exist_in_property === true && (
                                <div className="field col-12 md:col-4 mb-0">
                                    <label className="required">Property Assign Type</label>
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
                                        <div className="grid p-fluid mt-1">
                                            <div className="field col-12 md:col-8 mb-0" style={{width:'fit-content'}}>
                                                <label className="required">Do You Want Assign Property With Exiting User?</label>
                                                <div className="flex flex-wrap gap-3 ">
                                                    <div className="flex align-items-center">
                                                        <RadioButton
                                                            inputId="createExisting1"
                                                            name="createExisting"
                                                            value="yes"
                                                            onChange={(e) => {
                                                                setCreateExisting(true);
                                                                handleReset();
                                                                dispatch(getUserDropdown());
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
                                    </div>
                                    {/* <Divider align="center" className=" pt-0">
                            <span className="p-tag text-base">Owner's Details</span>
                        </Divider> */}
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
                                                    options={userDropdownData}
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
                                        <div className="property_pick_list field col-12 md:col-12">
                                            <PickList
                                                // dataKey="property_assign_id"
                                                source={source}
                                                target={target}
                                                onChange={(event) => {
                                                    setSource(event.source);
                                                    setTarget(event.target);
                                                }}
                                                itemTemplate={itemTemplate}
                                                // breakpoint="1280px"
                                                filter
                                                filterBy="label"
                                                selectionMode="multiple"
                                                sourceHeader="Available Properties"
                                                targetHeader="Selected Properties"
                                                sourceStyle={{ height: '24rem', minWidth: '11rem' }}
                                                targetStyle={{ height: '24rem', minWidth: '11rem' }}
                                            />
                                        </div>
                                        {/* <div className="field col-12 md:col-4 mb-0">
                                <label htmlFor="property" className="required">
                                    Properties
                                </label>
                                <MultiSelect
                                    id="property"
                                    value={values?.property}
                                    name="property"
                                    onChange={(e) => {
                                        setFieldValue('property', e.target.value && e.target.value.length > 0 ? e.target.value : null)
                                    }

                                    }
                                    options={propertyDropdownData}
                                    optionLabel="label"
                                    optionValue="property_assign_id"
                                    filter
                                    placeholder="Select Properties"
                                    // maxSelectedLabels={3}
                                    className={classNames({ 'p-invalid': errors.property && touched.property })}
                                    display="chip"
                                    showClear
                                />
                                <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.property && touched.property ? 'Please select floor' : ""}</div>
                            </div> */}
                                    </div>
                                    {/* <Divider align="center" className=" pt-0">
                            <span className="p-tag text-base">Business Details</span>
                        </Divider> */}
                                    <div className="grid p-fluid mt-1">
                                        {/* <div className="field col-12 md:col-4 mb-0">
                                <label htmlFor="businessName" className="">
                                    Business Name
                                </label>
                                <InputText
                                    id="businessName"
                                    name="businessName"
                                    placeholder="Enter Business Name"
                                    type="text"
                                    value={values?.businessName}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.businessName && touched.businessName })}
                                />
                            </div>
                            <div className="field col-12 md:col-4 mb-0">
                                <label htmlFor="businessCategory" className="">
                                    Business Category
                                </label>
                                <Dropdown
                                    id="businessCategory"
                                    optionLabel="label"
                                    optionValue="value"
                                    options={[
                                        {
                                            "label": "Accounting",
                                            "value": "Accounting"
                                        },
                                        {
                                            "label": "Advertising",
                                            "value": "Advertising"
                                        },
                                        {
                                            "label": "Agriculture",
                                            "value": "Agriculture"
                                        },
                                        {
                                            "label": "Architecture",
                                            "value": "Architecture"
                                        },
                                        {
                                            "label": "Arts & Crafts",
                                            "value": "Arts & Crafts"
                                        },
                                        {
                                            "label": "Automotive",
                                            "value": "Automotive"
                                        },
                                        {
                                            "label": "Banking",
                                            "value": "Banking"
                                        },
                                        {
                                            "label": "Beauty & Personal Care",
                                            "value": "Beauty & Personal Care"
                                        },
                                        {
                                            "label": "Business Consulting",
                                            "value": "Business Consulting"
                                        },
                                        {
                                            "label": "Construction",
                                            "value": "Construction"
                                        },
                                        {
                                            "label": "Customer Service",
                                            "value": "Customer Service"
                                        },
                                        {
                                            "label": "E-commerce",
                                            "value": "E-commerce"
                                        },
                                        {
                                            "label": "Education & Training",
                                            "value": "Education & Training"
                                        },
                                        {
                                            "label": "Entertainment",
                                            "value": "Entertainment"
                                        },
                                        {
                                            "label": "Event Management",
                                            "value": "Event Management"
                                        },
                                        {
                                            "label": "Financial Services",
                                            "value": "Financial Services"
                                        },
                                        {
                                            "label": "Fitness & Health",
                                            "value": "Fitness & Health"
                                        },
                                        {
                                            "label": "Food & Beverage",
                                            "value": "Food & Beverage"
                                        },
                                        {
                                            "label": "Hospitality",
                                            "value": "Hospitality"
                                        },
                                        {
                                            "label": "Human Resources",
                                            "value": "Human Resources"
                                        },
                                        {
                                            "label": "Information Technology",
                                            "value": "Information Technology"
                                        },
                                        {
                                            "label": "Insurance",
                                            "value": "Insurance"
                                        },
                                        {
                                            "label": "Legal Services",
                                            "value": "Legal Services"
                                        },
                                        {
                                            "label": "Logistics & Transportation",
                                            "value": "Logistics & Transportation"
                                        },
                                        {
                                            "label": "Manufacturing",
                                            "value": "Manufacturing"
                                        },
                                        {
                                            "label": "Marketing",
                                            "value": "Marketing"
                                        },
                                        {
                                            "label": "Media & Communication",
                                            "value": "Media & Communication"
                                        },
                                        {
                                            "label": "Nonprofit",
                                            "value": "Nonprofit"
                                        },
                                        {
                                            "label": "Pharmaceuticals",
                                            "value": "Pharmaceuticals"
                                        },
                                        {
                                            "label": "Real Estate",
                                            "value": "Real Estate"
                                        },
                                        {
                                            "label": "Retail",
                                            "value": "Retail"
                                        },
                                        {
                                            "label": "Security",
                                            "value": "Security"
                                        },
                                        {
                                            "label": "Software Development",
                                            "value": "Software Development"
                                        },
                                        {
                                            "label": "Telecommunications",
                                            "value": "Telecommunications"
                                        },
                                        {
                                            "label": "Travel & Tourism",
                                            "value": "Travel & Tourism"
                                        },
                                        {
                                            "label": "Waste Management",
                                            "value": "Waste Management"
                                        },
                                        {
                                            "label": "Wholesale & Distribution",
                                            "value": "Wholesale & Distribution"
                                        }
                                    ]}
                                    name="businessCategory"
                                    placeholder={values?.businessCategory !== '' ? values?.businessCategory : 'Select Business Category'}
                                    type="text"
                                    value={values?.businessCategory}
                                    onChange={(e) => {
                                        setFieldValue('businessCategory', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': errors.businessCategory && touched.businessCategory })}
                                    filter
                                    showClear={values?.businessCategory !== ''}
                                />
                            </div>
                            <div className="field col-12 md:col-4 mb-0">
                                <label htmlFor="businessPhone" className="">
                                    Business Number
                                </label>
                                <InputNumber
                                    id="businessPhone"
                                    type="tel"
                                    placeholder="Enter Business Number"
                                    name="businessPhone"
                                    value={values?.businessPhone}
                                    useGrouping={false}
                                    maxLength={10}
                                    onValueChange={(e) => {
                                        setFieldValue('businessPhone', e.value === null ? null : e.value.toString());
                                    }}
                                    className={classNames({ 'p-invalid': errors.businessPhone && touched.businessPhone })}
                                />
                                <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.businessPhone && touched.businessPhone ? errors.businessPhone : ""}</div>
                            </div>
                            <div className="field col-12 md:col-4 mb-0">
                                <label htmlFor="webSite" className="">
                                    Business Website
                                </label>
                                <InputText
                                    id="webSite"
                                    name="webSite"
                                    placeholder="Enter Business Website"
                                    type="text"
                                    value={values?.webSite}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.webSite && touched.webSite })}
                                />
                            </div>
                            <div className="field col-12 md:col-4 mb-0">
                                <label htmlFor="city" className="">
                                    Business City
                                </label>
                                <InputText
                                    id="city"
                                    name="city"
                                    placeholder="Enter Business City"
                                    type="text"
                                    value={values?.city}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.city && touched.city })}
                                />
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="pin_code" className="">
                                    Pin Code
                                </label>
                                <InputNumber
                                    id="pin_code"
                                    type="tel"
                                    placeholder="Enter Pin Code"
                                    name="pin_code"
                                    value={values?.pin_code}
                                    useGrouping={false}
                                    maxLength={6}
                                    onValueChange={(e) => {
                                        setFieldValue('pin_code', e.value === null ? null : e.value);
                                    }}
                                    className={classNames({ 'p-invalid': errors.pin_code && touched.pin_code })}
                                />
                                <div className="p-invalid error text-xs" style={{ minHeight: "1.5rem" }}>{errors.pin_code && touched.pin_code ? errors.pin_code : ""}</div>

                            </div>
                            <div className="field col-12 md:col-4 mb-0">
                                <label htmlFor="businessAddress" className="">
                                    Business Address
                                </label>
                                <InputTextarea id="businessAddress" placeholder="Enter Business Address" rows="2" cols="30" value={values?.businessAddress} onChange={handleChange} disabled={createExisting === true} autoResize />
                            </div> */}
                                        {/* {((decode?.is_block_exist_in_property === true && createShopping === true) || (createShopping === false && decode.is_block_exist_in_shopping_center_property === true)) && (
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="block" className="required">
                                        Select Block
                                    </label>
                                    <Dropdown
                                        id="block"
                                        optionLabel="label"
                                        optionValue="block_id"
                                        options={blockDropdownData}
                                        name="block"
                                        placeholder="Select Block"
                                        type="text"
                                        value={values?.block}
                                        onChange={(e) => {
                                            setFieldValue('block', e.target.value);
                                            setFieldValue('floor', '');
                                            setFieldValue('property', '');
                                            (decode?.is_floor_exist_in_property === true) & (createShopping === true) && dispatch(getFloorDropdownRequest({ block_id: e.target.value }));
                                            decode.is_floor_exist_in_shopping_center_property === true && createShopping === false && dispatch(getShopFloorDropdownRequest({ block_id: e.target.value }));
                                            !decode?.is_floor_exist_in_property && createShopping === true && dispatch(getPropertyDropdownRequest({ block_id: e.target.value, module_name: 'user_property_assign' }));
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property && values?.block === '' })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.property && touched.property && values?.block === '' ? 'Please select block' : ""}</div>

                                </div>
                            )} */}
                                        {/* {errors.property && touched.property && values?.block === '' ? <small className="p-invalid error">{'Please select block'}</small> : null} */}
                                        {/* {fieldError && values?.block === '' ? <small className="p-invalid error">{'Please select block'}</small> : null} */}
                                        {/* {((decode?.is_floor_exist_in_property === true && createShopping === true) || (createShopping === false && decode.is_floor_exist_in_shopping_center_property === true)) && (
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="floor" className="required">
                                        Select Floor
                                    </label>
                                    <Dropdown
                                        id="floor"
                                        optionLabel="label"
                                        optionValue="floor_id"
                                        options={floorDropdownData}
                                        name="floor"
                                        placeholder="Select Floor"
                                        type="text"
                                        value={values?.floor}
                                        onChange={(e) => {
                                            setFieldValue('floor', e.target.value);
                                            setFieldValue('property', '');
                                            dispatch(getPropertyDropdownRequest({ block_id: values?.block, floor_id: e.target.value, module_name: 'user_property_assign' }));
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property && values?.floor === '' })}
                                        disabled={
                                            (decode?.is_block_exist_in_property === undefined && createShopping === true) || (createShopping === false && decode.is_block_exist_in_shopping_center_property === undefined) ? false : values?.block === ''
                                        }
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.property && touched.property && values?.floor === '' ? 'Please select floor' : ""}</div>

                                </div>
                            )} */}
                                        {/* {errors.property && touched.property && values?.floor === '' ? <small className="p-invalid error">{'Please select floor'}</small> : null} */}

                                        {/* <div className="field col-12 md:col-4 mb-0">
                                <label htmlFor="psfa" className="required">
                                    Property Square Feet Area
                                </label>
                                <InputNumber
                                    inputId="psfa"
                                    id="psfa"
                                    placeholder="Property Square feet Area"
                                    name="property_sq_feet_area"
                                    value={values.property_sq_feet_area}
                                    onValueChange={(e) => {
                                        setFieldValue('property_sq_feet_area', e.target.value);
                                    }}
                                    locale="en-IN"
                                    minFractionDigits={2}
                                    className={classNames({ 'p-invalid': errors.property_sq_feet_area && touched.property_sq_feet_area })}
                                />
                                <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.property_sq_feet_area && touched.property_sq_feet_area ? errors.property_sq_feet_area : ""}</div>
                            </div> */}
                                        {/* {errors.property_sq_feet_area && touched.property_sq_feet_area ? <small className="p-invalid error">{errors.property_sq_feet_area}</small> : null} */}
                                        {/* <div className="field col-12 md:col-4 mb-0">
                                <label htmlFor="property_status" className="">
                                    Select Property Status
                                </label>

                                <Dropdown
                                    id="property_status"
                                    optionLabel="label"
                                    optionValue="value"
                                    options={[
                                        { label: 'Active', value: 'Active' },
                                        { label: 'In-Active', value: 'In-Active' }
                                    ]}
                                    name="property_status"
                                    placeholder="Select property status"
                                    type="text"
                                    value={values?.property_status}
                                    onChange={(e) => {
                                        setFieldValue('property_status', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': errors.property_status && touched.property_status })}
                                />
                                <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.property_status && touched.property_status ? errors?.property_status : ""}</div>
                            </div> */}
                                        {/* {errors.property_status && touched.property_status ? <small className="p-invalid error">{errors?.property_status}</small> : null} */}
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
                                </>
                            )}
                            {propertyDropdownData && propertyDropdownData.length === 0 && (
                                <div className="p-invalid error text-xl mt-1" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                    {'Notes:- '}
                                    <span className="text-base">{'All properties are assigned, so you cannot assign any property. If you want to assign a property, you must first remove or delete an existing one.'}</span>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default PropertyAssign;
