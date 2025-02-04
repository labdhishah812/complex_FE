import components from '../..';
import Loader from '../../../../components/Loader';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getPropertyDataByid, propertyBusinessRequest, updatePropertyBusinessRequest } from '../../../../redux/slice/AdminSlices/propertySlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Divider } from 'primereact/divider';
const PropertyBusiness = () => {
    const { BreadCrumb, Dropdown, InputText, InputNumber, InputTextarea, Button, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { loginDetails } = useSelector((store) => store.auth);
    const { isCreated, propertyDataByid, isLoading } = useSelector((store) => store.property);
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const locationName = window.location.pathname.split('/');
    const [submitted, setSubmitted] = useState(false);
    const [pincode, setPincode] = useState('');
    const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
    const [isLoadingPincode, setIsLoadingPincode] = useState(false);
    const [showPincodeDropdown, setShowPincodeDropdown] = useState(false);
    const [propertyDetails, setPropertyDetails] = useState({
        name: '',
        property_number: ''
    });
    const [formValue, setFormValue] = useState({
        id: '',
        businessName: '',
        company_email: '',
        businessCategory: '',
        webSite: '',
        businessPhone: '',
        pin_code: null,
        city: ''
    });
    const SignupSchema = Yup.object().shape({
        businessName: Yup.string().trim().required('Business name is required'),
        company_email: Yup.string().trim().email('Please enter a valid email address').required('Email is required'),
        businessCategory: Yup.string().trim().required('Business category is required'),
        businessPhone: Yup.string().trim().min(10, 'Business number must be at least 10 digit number.').max(10, 'Business number must be at least 10 digit number.').required('Phone Number is required'),
        pin_code: Yup.string().trim().min(6, 'Pincode no must be at least 6 digit no.').max(6, 'Pincode no must be at least 6 digit no.').required('Pincode is required'),
        businessAddress: Yup.string().trim().required('Business address is required'),
        webSite: Yup.string()
            .trim()
            .nullable()
            .matches(/^(https?:\/\/)(([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(\/[^\s]*)?$/, 'Please enter a valid website URL')
        // property: Yup.array().nullable().required('Please select property')
    });

    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: locationName[2] === 'tenant' ? 'Tenant' : 'Properties',
        command: () => {
            locationName[2] === 'tenant' ? navigate('/property-management/tenant') : navigate('/property-management/property-assign');
        }
    };
    useEffect(() => {
        dispatch(getPropertyDataByid(params.id));
    }, [dispatch]);
    useEffect(() => {
        if (propertyDataByid && propertyDataByid?._id) {
            setPropertyDetails({
                name: propertyDataByid?.name || '',
                property_number: propertyDataByid?.property_number || ''
            });

            let setData = {
                id: propertyDataByid?._id,
                businessName: propertyDataByid?.company_name,
                company_email: propertyDataByid?.company_email,
                businessCategory: propertyDataByid?.category,
                webSite: propertyDataByid?.website,
                businessPhone: propertyDataByid?.company_mobile_number,
                businessAddress: propertyDataByid?.company_address,
                pin_code: propertyDataByid?.pincode,
                city: propertyDataByid?.city
            };
            setFormValue(setData);
        }
    }, [propertyDataByid]);
    // useEffect(() => {
    //     if (propertyDataByid && propertyDataByid?._id) {
    //         let setData = {
    //             id: propertyDataByid?._id,
    //             businessName: propertyDataByid?.company_name,
    //             company_email: propertyDataByid?.company_email,
    //             businessCategory: propertyDataByid?.category,
    //             webSite: propertyDataByid?.website,
    //             businessPhone: propertyDataByid?.company_mobile_number,
    //             businessAddress: propertyDataByid?.company_address,
    //             pin_code: propertyDataByid?.pincode,
    //             city: propertyDataByid?.city
    //         };
    //         setFormValue(setData);
    //     }
    // }, [propertyDataByid]);
    useEffect(() => {
        if (isCreated) {
            // decodeURI();
            navigate('/property-management/property-assign');
        }
    }, [isCreated]);
    const breadcrumbItems = [
        {
            label: 'Business Details'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const fetchPincodeSuggestions = async (pincode) => {
        // Only proceed if the pincode length is 3 or more
        if (pincode.length < 6) {
            setPincodeSuggestions([]); // Clear suggestions
            setShowPincodeDropdown(false); // Hide dropdown
            return;
        }

        setIsLoadingPincode(true); // Show loading state
        try {
            // Make the API call to fetch pincode suggestions
            const response = await axios.post(
                `${BASE_URL_API}/pincode/suggestions`, // Correct endpoint
                {
                    searchTerm: pincode, // Send pincode in the body
                    page: 1,
                    limit: 10
                },
                {
                    headers: {
                        'Content-Type': 'application/json' // Set the correct content type for JSON
                    }
                }
            );

            // Set the pincode suggestions based on the response data
            setPincodeSuggestions(response.data.data.pincodes || []);
            setShowPincodeDropdown(true); // Show the dropdown with suggestions
        } catch (error) {
            // Handle errors
            console.error('Error fetching pincode suggestions:', error);
            console.error('Error fetching pincode suggestions'); // Show error toast
        } finally {
            setIsLoadingPincode(false); // Stop loading state
        }
    };
    // Handle input change
    const handlePincodeChange = (e) => {
        const newPincode = e.target.value;
        setPincode(newPincode);
        fetchPincodeSuggestions(newPincode);
    };
    const handleAddressSelection = (suggestion, setFieldValue) => {
        const fullAddress = `${suggestion.details.officeName}, ${suggestion.details.taluk}, ${suggestion.details.state}, India`;
        setFieldValue('pin_code', suggestion.details.pincode);
        setFieldValue('businessAddress', fullAddress);
        setFieldValue('city', suggestion.details.taluk);
        setShowPincodeDropdown(false);
        setPincode(suggestion.details.pincode);
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Business Details</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                {/* <div className="grid p-fluid mb-4">
                    <div className="col-12">
                        <div className="surface-card p-4 border-round shadow-2">
                            <div className="flex align-items-center justify-content-between mb-3">
                                <div className="text-xl font-medium text-900">Property Information</div>
                                <div className="px-3 py-1 bg-primary-100 text-primary-700 border-round">#{propertyDetails.property_number}</div>
                            </div>
                            <Divider className="my-3" />
                            <div className="grid">
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="p-3 border-1 border-300 border-round surface-0">
                                        <div className="text-500 mb-2">Owner Name</div>
                                        <div className="text-900 font-medium">{propertyDetails.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <Formik
                    initialValues={formValue}
                    validationSchema={SignupSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        let sendData = {
                            id: params?.id,
                            company_name: values.businessName,
                            company_email: values.company_email,
                            category: values.businessCategory,
                            company_mobile_number: values.businessPhone,
                            company_address: values.businessAddress,
                            pincode: values.pin_code,
                            city: values.city,
                            website: values.webSite
                        };
                        dispatch(propertyBusinessRequest(sendData));
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
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="businessName" className="required">
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
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.businessName && touched.businessName ? errors.businessName : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="company_email" className="required">
                                        Business Email
                                    </label>
                                    <InputText
                                        id="company_email"
                                        name="company_email"
                                        placeholder="Enter Business Email"
                                        type="text"
                                        value={values?.company_email}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.company_email && touched.company_email })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.company_email && touched.company_email ? errors.company_email : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="businessCategory" className="required">
                                        Business Category
                                    </label>
                                    <Dropdown
                                        id="businessCategory"
                                        optionLabel="label"
                                        optionValue="value"
                                        options={[
                                            { label: 'Accounting', value: 'Accounting' },
                                            { label: 'Advertising', value: 'Advertising' },
                                            { label: 'Agriculture', value: 'Agriculture' },
                                            { label: 'Architecture', value: 'Architecture' },
                                            { label: 'Arts & Crafts', value: 'Arts & Crafts' },
                                            { label: 'Automotive', value: 'Automotive' },
                                            { label: 'Banking', value: 'Banking' },
                                            { label: 'Beauty & Personal Care', value: 'Beauty & Personal Care' },
                                            { label: 'Business Consulting', value: 'Business Consulting' },
                                            { label: 'Construction', value: 'Construction' },
                                            { label: 'Customer Service', value: 'Customer Service' },
                                            { label: 'E-commerce', value: 'E-commerce' },
                                            { label: 'Education & Training', value: 'Education & Training' },
                                            { label: 'Entertainment', value: 'Entertainment' },
                                            { label: 'Event Management', value: 'Event Management' },
                                            { label: 'Financial Services', value: 'Financial Services' },
                                            { label: 'Fitness & Health', value: 'Fitness & Health' },
                                            { label: 'HealthCare', value: 'HealthCare' },
                                            { label: 'Food & Beverage', value: 'Food & Beverage' },
                                            { label: 'Hospitality', value: 'Hospitality' },
                                            { label: 'Human Resources', value: 'Human Resources' },
                                            { label: 'Information Technology', value: 'Information Technology' },
                                            { label: 'Insurance', value: 'Insurance' },
                                            { label: 'Legal Services', value: 'Legal Services' },
                                            { label: 'Logistics & Transportation', value: 'Logistics & Transportation' },
                                            { label: 'Manufacturing', value: 'Manufacturing' },
                                            { label: 'Marketing', value: 'Marketing' },
                                            { label: 'Media & Communication', value: 'Media & Communication' },
                                            { label: 'Nonprofit', value: 'Nonprofit' },
                                            { label: 'Pharmaceuticals', value: 'Pharmaceuticals' },
                                            { label: 'Real Estate', value: 'Real Estate' },
                                            { label: 'Retail', value: 'Retail' },
                                            { label: 'Security', value: 'Security' },
                                            { label: 'Software Development', value: 'Software Development' },
                                            { label: 'Telecommunications', value: 'Telecommunications' },
                                            { label: 'Travel & Tourism', value: 'Travel & Tourism' },
                                            { label: 'Waste Management', value: 'Waste Management' },
                                            { label: 'Wholesale & Distribution', value: 'Wholesale & Distribution' }
                                        ]}
                                        name="businessCategory"
                                        placeholder="Select Business Category"
                                        value={values?.businessCategory || ''}
                                        onChange={(e) => {
                                            setFieldValue('businessCategory', e.value);
                                        }}
                                        className={classNames({ 'p-invalid': errors.businessCategory && touched.businessCategory })}
                                        filter
                                        showClear={!!values?.businessCategory}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.businessCategory && touched.businessCategory ? errors.businessCategory : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="businessPhone" className="required">
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
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.businessPhone && touched.businessPhone ? errors.businessPhone : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="webSite" className="">
                                        Business Website
                                    </label>
                                    <InputText id="webSite" name="webSite" placeholder="Enter Business Website" type="text" value={values?.webSite} onChange={handleChange} className={classNames({ 'p-invalid': errors.webSite && touched.webSite })} />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.webSite && touched.webSite ? errors.webSite : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-1 relative">
                                    <label htmlFor="pin_code" className="required">
                                        Pin Code
                                    </label>
                                    <InputText
                                        id="pin_code"
                                        name="pin_code"
                                        placeholder="Enter Pin Code"
                                        type="text"
                                        value={values?.pin_code}
                                        style={{
                                            color: 'black'
                                        }}
                                        onChange={(e) => {
                                            handlePincodeChange(e);
                                            setFieldValue('pin_code', e.target.value);
                                        }}
                                        onInput={(e) => {
                                            // Allow only numeric input
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            // Limit to 6 digits
                                            if (e.target.value.length > 6) {
                                                e.target.value = e.target.value.slice(0, 6);
                                            }
                                        }}
                                        className={classNames({ 'p-invalid': errors.pin_code && touched.pin_code })}
                                    />
                                    {isLoadingPincode && <div className="text-sm text-gray-500 mt-1">Loading suggestions...</div>}
                                    {showPincodeDropdown && pincodeSuggestions.length > 0 && (
                                        <div
                                            className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border"
                                            style={{
                                                maxHeight: '100px', // Limit dropdown height to 100px (~5 items)
                                                overflowY: 'auto', // Enable vertical scrolling
                                                border: '1px solid #ccc', // Add a light gray border
                                                borderRadius: '4px' // Optional: rounded corners
                                            }}
                                        >
                                            {pincodeSuggestions.map((suggestion, index) => (
                                                <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAddressSelection(suggestion, setFieldValue)}>
                                                    {suggestion.details.officeName}, {suggestion.details.taluk}, {suggestion.details.state}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.pin_code && touched.pin_code ? errors.pin_code : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="city" className="">
                                        Business City
                                    </label>
                                    <InputText id="city" name="city" placeholder="Enter Business City" type="text" value={values?.city} onChange={handleChange} className={classNames({ 'p-invalid': errors.city && touched.city })} />
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="businessAddress" className="required">
                                        Business Address
                                    </label>
                                    <InputTextarea id="businessAddress" placeholder="Enter Business Address" rows="2" cols="30" value={values?.businessAddress} onChange={handleChange} autoResize />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.businessAddress && touched.businessAddress ? errors.businessAddress : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-12 mb-0 flex justify-content-end">
                                    <Button
                                        type="button"
                                        label="Cancel"
                                        icon="pi pi-times"
                                        className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                        onClick={() => (locationName[2] === 'tenant' ? navigate('/property-management/tenant') : navigate('/property-management/property-assign'))}
                                    />
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
export default PropertyBusiness;
