import axios from 'axios'; // Axios for API call
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { AutoComplete } from 'primereact/autocomplete';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import components from '../..';
import { editPropertyApiCall, getPropertyDetailsRequest } from '../../../../redux/slice/AdminSlices/complexSlice';
import { BreadCrumb } from 'primereact/breadcrumb';

const EditProperty = () => {
    const { Button, InputNumber, InputTextarea, Dropdown, useState, React, Dialog, InputText, classNames, RadioButton, Divider, useSelector } = components;
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const { isCreated } = useSelector((state) => state.complex);
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [propertyData, setPropertyData] = useState(null);
    const [pincode, setPincode] = useState('');
    const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
    const [isLoadingPincode, setIsLoadingPincode] = useState(false);
    const [showPincodeDropdown, setShowPincodeDropdown] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState(null);
    // Handle input change
    const handlePincodeChange = (e) => {
        const newPincode = e.target.value;
        setPincode(newPincode); // Update the pincode state
        fetchPincodeSuggestions(newPincode); // Call fetchPincodeSuggestions with the new pincode
    };
    const [isAccountNumberEdited, setIsAccountNumberEdited] = useState(false);

    const handleBankAccountNumberChange = (e, setFieldValue, values, setFieldError) => {
        const value = e.target.value;
        setFieldValue('bankAccountNumber', value);

        // Check if account number was edited
        if (value !== values.bankAccountNumber) {
            setIsAccountNumberEdited(true);
        } else {
            setIsAccountNumberEdited(false);
        }

        // Reset re-enter account number field and error if account number is modified
        if (values.reEnterBankAccountNumber) {
            setFieldValue('reEnterBankAccountNumber', '');
            setFieldError('reEnterBankAccountNumber', '');
        }
    };

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
    const handleAddressSelection = (suggestion, setFieldValue) => {
        setFieldValue('pin_code', suggestion.details.pincode);
        setFieldValue('propertyArea', suggestion.details.officeName);
        setFieldValue('property_city', suggestion.details.taluk);
        setFieldValue('propertyState', suggestion.details.state);
        setFieldValue('propertyCountry', 'India');
        setShowPincodeDropdown(false); // Hide the dropdown after selection
    };
    const validationSchema = Yup.object({
        property_name: Yup.string().required('Property Name is required'),
        bankName: Yup.string().required('Bank Name is required'),
        branchName: Yup.string().required('Branch Name is required'),
        IFSCCode:  Yup.string()
        .trim()
        .nullable()
        .required('Please enter IFSC code.')
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code. It should be 11 characters long: first 4 uppercase alphabets, 5th character 0, and last 6 alphanumeric characters.'),
        subscriptionPlan: Yup.string().required('Subscription Plan is required'),
        subscriptionStatus: Yup.string().required('Subscription Status is required'),
        pin_code: Yup.string().trim().min(6, 'Pincode no must be at least 6 digit no.').max(6, 'Pincode no must be at least 6 digit no.').required('Please enter pincode.'),
        billingCycle: Yup.string().required('Billing Cycle is required'),
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        mobile_number: Yup.string()
            .matches(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits')
            .required('Mobile Number is required'),
        pin_code: Yup.string().trim().nullable().min(6, 'Pincode no must be at least 6 digit no.').max(6, 'Pincode no must be at least 6 digit no.').required('Please enter pincode.'),
        accountHolderName: Yup.string().trim().nullable().required('Please enter account holder name.'),
        // bankAccountNumber: Yup.string().trim().nullable().required('Please enter bank account number.').max(18, 'Account number must be at most 18 digits.'),
        // reEnterBankAccountNumber: Yup.string()
        //     .required('Please re-enter account number')
        //     .oneOf([Yup.ref('bankAccountNumber')], 'Account numbers must match')
        //     .max(18, 'Account number must be at most 18 digits.')
        bankAccountNumber: Yup.string().required('Account number is required').matches(/^\d+$/, 'Account number must be numeric').max(18, 'Account number cannot exceed 18 digits'),
        reEnterBankAccountNumber: Yup.string()
            .oneOf([Yup.ref('bankAccountNumber'), null], 'Account numbers do not match')
            .matches(/^\d+$/, 'Account number must be numeric')
            .max(18, 'Account number cannot exceed 18 digits')
    });

    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Property List',
        command: () => {
            navigate('/superadmin/properties');
        }
    };

    const breadcrumbItems = [
        {
            label: params?.id ? 'Property Edit' : 'Property Create'
        }
    ];
    const search = (event) => {
        const allWork = [
            'Ahmedabad District Cooperative Bank (Ahmedabad DCCB)',
            'Ahmednagar District Central Cooperative Bank (Ahmednagar DCCB)',
            'Akola District Central Cooperative Bank (Akola DCCB)',
            'Allahabad Bank',
            'Andhra Bank',
            'Andhra Pradesh State Cooperative Bank (APCOB)',
            'Axis Bank',
            'Bandan Bank',
            'Bank of Bahrain and Kuwait',
            'Bank of Baroda',
            'Bank of India',
            'Bank of Maharashtra',
            'Bassein Catholic Co-operative Bank',
            'Bhartiya Mahila Bank',
            'BNP Paribas',
            'Canara Bank',
            'Catholic Syrian Bank',
            'Central Bank of India',
            'City Union Bank',
            'Corporation bank',
            'Cosmos Bank',
            'DCB BANK Personal',
            'Deustche Bank',
            'Development Credit Bank',
            'Dena Bank',
            'Dhanlaxmi Bank',
            'District Cooperative Banks in various districts',
            'Federal Bank',
            'HDFC Bank',
            'ICICI Bank',
            'IDBI Bank',
            'Indian Bank',
            'Indian Overseas NetBanking',
            'Indusind Bank',
            'ING Vysya Bank',
            'J and K Bank',
            'Janta Sahakari Bank',
            'Jamnagar District Cooperative Bank (Jamnagar DCCB)',
            'Jalgaon District Central Cooperative Bank (Jalgaon DCCB)',
            'Junagadh District Cooperative Bank (Junagadh DCCB)',
            'Karnataka Bank',
            'Karur Vysya Bank',
            'Kerala State Cooperative Bank (KSCB)',
            'Kotak Mahindra Bank',
            'KSC Apex Bank',
            'Lakshmi Vilas Bank',
            'Mehsana Urban Co-op Bank',
            'Mumbai District Central Cooperative Bank (Mumbai DCCB)',
            'Nagpur District Central Cooperative Bank (Nagpur DCCB)',
            'Nanded District Central Cooperative Bank (Nanded DCCB)',
            'NKGSB Co-operative Bank',
            'Oriental Bank Of Commerce',
            'Punjab & Sind Bank',
            'Punjab and Maharashtra Cooperative Bank',
            'Punjab National Bank',
            'PSCB',
            'Rajasthan State Cooperative Bank (RSCB)',
            'Ratnakar Bank Limited',
            'RBL Bank',
            'Rajkot District Cooperative Bank (Rajkot DCCB)',
            'Shamrao Vithal Cooperative Bank',
            'South Indian Bank',
            'Standard Chartered Bank',
            'State Bank Of Bikaner and Jaipur',
            'State Bank of Hyderabad',
            'State Bank of India',
            'State Bank of Mysore',
            'State Bank of Patiala',
            'State Bank of Travancore',
            'Saraswat Cooperative Bank',
            'SVC Bank',
            'Surat District Cooperative Bank (Surat DCCB)',
            'Syndicate Bank',
            'Tamil Nadu State Apex Cooperative Bank (TNSC Bank)',
            'Tamilnad Mercantile Bank',
            'Tamilnadu Cooperative Bank',
            'Telangana State Cooperative Apex Bank (TSCAB)',
            'The Kalyan Janata Sahakari Bank',
            'The Royal Bank of Scotland',
            'Thane District Central Cooperative Bank (Thane DCCB)',
            'TJSB Bank (Erstwhile Thane Janata Sahakari Bank)',
            'UCO Bank',
            'Union Bank of India',
            'United Bank Of India',
            'Vadodara District Cooperative Bank (Vadodara DCCB)',
            'Vijaya Bank',
            'WBSCB',
            'West Bengal State Cooperative Bank (WBSCB)',
            'Yes Bank'
        ];
        let allWork2 = allWork.map((bank) => ({ name: bank }));
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredCountries;

            if (!event.query.trim().length) {
                _filteredCountries = [...allWork2];
            } else {
                _filteredCountries = allWork2.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredCountries(_filteredCountries);
        }, 250);
    };
    useEffect(() => {
        if (params.id) {
            dispatch(getPropertyDetailsRequest(params.id));
        }
    }, [params.id, dispatch]);

    // Dynamically update Formik's initialValues
    const initialValues = {
        property_name: propertyData?.property_name || '',
        property_type: propertyData?.property_type || '',
        propertyEmail: propertyData?.propertyEmail || '',
        pin_code: propertyData?.pin_code || '',
        property_city: propertyData?.property_city || '',
        propertyArea: propertyData?.propertyArea || '',
        propertyState: propertyData?.propertyState || '',
        propertyCountry: propertyData?.propertyCountry || '',
        property_landmark: propertyData?.property_landmark || '',
        accountHolderName: propertyData?.accountHolderName || '',
        bankName: propertyData?.bankName || '',
        bankAccountNumber: propertyData?.bankAccountNumber || '',
        branchName: propertyData?.branchName || '',
        IFSCCode: propertyData?.IFSCCode || '',
        subscriptionPlan: propertyData?.subscriptionPlan || '',
        subscriptionStatus: propertyData?.subscriptionStatus || '',
        billingCycle: propertyData?.billingCycle || '',
        name: propertyData?.name || '',
        email: propertyData?.email || '',
        chairman_id: propertyData?.chairman_id || '',
        mobile_number: propertyData?.mobile_number || ''
    };
    const fetchBranchDetails = async (ifscCode) => {
        try {
            const response = await axios.get(`https://ifsc.razorpay.com/${ifscCode}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching branch details:', error);
            return null;
        }
    };
    const [isAcconNumberVisible, setisAcconNumberVisible] = useState(false);
    const propertyDetails = useSelector((state) => state.complex);
    console.log('propertyDetails: ', propertyDetails);
    useEffect(() => {
        if (propertyDetails) {
            console.log(propertyDetails?.complexData);
            setPropertyData(propertyDetails?.complexData);
            setLoading(false);
        }
    }, [propertyDetails?.complexData]);
    const togglePassword = () => {
        setisAcconNumberVisible(!isAcconNumberVisible);
        // setisReenterAcconNumberVisible(!isReenterAcconNumberVisible);
    };

    return (
        <div>
            <div className="flex flex-row w-full">
                <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Property' : 'Create Property'}</h5>
                <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
            </div>
            <div className="card">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);

                        // Prepare the data for submission
                        const data = {
                            property_name: values.property_name.trim(),
                            property_type: values.property_type,
                            propertyEmail: values.propertyEmail.trim(),
                            pin_code: values.pin_code,
                            property_city: values.property_city,
                            propertyArea: values.propertyArea,
                            propertyState: values.propertyState,
                            propertyCountry: values.propertyCountry,
                            property_landmark: values.property_landmark,
                            accountHolderName: values.accountHolderName,
                            bankName: values.bankName,
                            bankAccountNumber: values.bankAccountNumber,
                            branchName: values.branchName,
                            IFSCCode: values.IFSCCode,
                            subscriptionPlan: values.subscriptionPlan,
                            subscriptionStatus: values.subscriptionStatus,
                            billingCycle: values.billingCycle,
                            name: values.name,
                            email: values.email,
                            chairman_id: values.chairman_id,
                            mobile_number: values.mobile_number?.toString()
                        };

                        // FormData for file uploads and additional fields
                        let formData = new FormData();
                        formData.append('property_name', values.property_name.trim());
                        formData.append('property_type', values.property_type);
                        formData.append('propertyEmail', values.propertyEmail.trim());
                        formData.append('pin_code', values.pin_code);
                        formData.append('property_city', values.property_city);
                        formData.append('propertyState', values.propertyState);
                        formData.append('propertyCountry', values.propertyCountry);
                        formData.append('property_landmark', values.property_landmark);
                        formData.append('accountHolderName', values.accountHolderName);
                        formData.append('bankName', values.bankName);
                        formData.append('bankAccountNumber', values.bankAccountNumber);
                        formData.append('branchName', values.branchName);
                        formData.append('IFSCCode', values.IFSCCode);
                        formData.append('subscriptionPlan', values.subscriptionPlan);
                        formData.append('subscriptionStatus', values.subscriptionStatus);
                        formData.append('billingCycle', values.billingCycle);
                        formData.append('name', values.name);
                        formData.append('email', values.email);
                        formData.append('chairman_id', values.chairman_id);
                        formData.append('mobile_number', values.mobile_number?.toString());

                        // Only append the property logo if it exists
                        if (values.property_logo) formData.append('property_logo', values.property_logo);

                        // Dispatch action to edit the complex (property)
                        if (params.id !== '') {
                            // Dispatch the action to edit the property
                            dispatch(editPropertyApiCall(params.id, data));

                            // Redirect to the listing page after the update is successful
                            navigate('/superadmin/properties');
                        }

                        setTimeout(() => setSubmitted(false), 5000);
                    }}
                >
                    {({ handleSubmit, values, handleChange, setFieldValue, errors, touched, setFieldError }) => (
                        <Form>
                            <Divider align="center" className=" pt-0">
                                <span className="p-tag text-base">Property Details</span>
                            </Divider>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="property_type">Property Type</label>
                                    <InputText
                                        id="property_type"
                                        name="property_type"
                                        placeholder="Enter Property Type"
                                        type="text"
                                        disabled
                                        value={values?.property_type}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.property_type && touched.property_type })}
                                    />
                                    {errors.property_type && touched.property_type ? <small className="p-invalid error">{'Please enter property type'}</small> : null}
                                </div>
                            </div>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="property_name">Property Name</label>
                                    <InputText
                                        id="property_name"
                                        name="property_name"
                                        placeholder="Enter Property Name"
                                        type="text"
                                        disabled
                                        value={values?.property_name}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.property_name && touched.property_name })}
                                    />
                                    {errors.property_name && touched.property_name ? <small className="p-invalid error">{'Please enter property name'}</small> : null}
                                </div>

                                {/* <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="domainName" className="required">
                                        Domain Name
                                    </label>
                                    <InputText
                                        id="domainName"
                                        name="domainName"
                                        placeholder="Domain Name"
                                        type="text"
                                        value={values?.domainName}
                                        style={{
                                            color: 'black'
                                        }}
                                        disabled
                                        className={classNames({ 'p-invalid': errors.domainName && touched.domainName })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.domainName && touched.domainName ? 'Please enter domain name.' : ''}
                                    </div>
                                </div> */}

                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="propertyEmail">Property Email</label>
                                    <InputText
                                        id="propertyEmail"
                                        name="propertyEmail"
                                        disabled
                                        placeholder="Enter Property Name"
                                        type="text"
                                        value={values?.propertyEmail}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.propertyEmail && touched.propertyEmail })}
                                    />
                                    {errors.propertyEmail && touched.propertyEmail ? <small className="p-invalid error">{'Please enter property Email'}</small> : null}
                                </div>

                                {/* <div className="field col-12 md:col-4 mb-1 relative">
                                    <label htmlFor="pin_code" className="required">
                                        Pin Code
                                    </label>
                                    <InputText
                                        id="pin_code"
                                        name="pin_code"
                                        // placeholder="Enter Pin Code"
                                        type="text"
                                        value={pincode} // Display the current pin code value
                                        style={{
                                            color: 'black'
                                        }}
                                        onChange={(e) => {
                                            const newValue = e.target.value.replace(/[^0-9]/g, ''); // Filter for numeric input
                                            e.target.value = newValue; // Update event value with numeric input
                                            handlePincodeChange(e); // Pass the event
                                        }}
                                        onInput={(e) => {
                                            // Prevent non-numeric input during typing
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        className={classNames({ 'p-invalid': errors.pin_code && touched.pin_code })}
                                    />
                                    {isLoadingPincode && <div className="text-sm text-gray-500 mt-1">Loading suggestions...</div>}
                                    {showPincodeDropdown && pincodeSuggestions.length > 0 && (
                                        <div
                                            className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border"
                                            style={{
                                                maxHeight: '100px',
                                                overflowY: 'auto',
                                                right: 0, // Align to the right of the input field
                                                left: 0, // Ensure full width of the parent container
                                                marginTop: '0.5rem', // Adjust spacing from the input
                                                zIndex: 50 // // Enable vertical scrolling
                                            }}
                                        >
                                            {pincodeSuggestions.map((suggestion, index) => (
                                                <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAddressSelection(suggestion, setFieldValue)}>
                                                    {suggestion.details.officeName}, {suggestion.details.taluk}, {suggestion.details.state}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.pin_code && touched.pin_code ? errors.pin_code : ''}
                                    </div>
                                </div> */}
                                  <div className="field col-12 md:col-4 mb-1 relative">
                                    <label htmlFor="pincode" className="required">
                                        Pin Code
                                    </label>
                                    <InputText
                                        id="pincode"
                                        name="pincode"
                                        placeholder="Enter Pin Code"
                                        type="text" // Change to 'text' to remove number input dropdown
                                        value={pincode}
                                        style={{
                                            color: 'black'
                                        }}
                                        onChange={handlePincodeChange}
                                        onInput={(e) => {
                                            // Allow only numeric input
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        className={classNames({ 'p-invalid': errors.pincode && touched.pincode })}
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
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.pincode && touched.pincode ? errors.pincode : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="pin_code" className="required">
                                        Area
                                    </label>
                                    <InputText
                                        id="propertyArea"
                                        name="propertyArea"
                                        disabled
                                        placeholder="Enter Area"
                                        type="text"
                                        value={values?.propertyArea}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.propertyArea && touched.propertyArea })}
                                    />
                                    {errors.propertyArea && touched.propertyArea ? <small className="p-invalid error">{'Please enter Area'}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="property_city" className="required">
                                        City
                                    </label>
                                    <InputText
                                        id="property_city"
                                        name="property_city"
                                        placeholder="Enter City"
                                        disabled
                                        type="text"
                                        value={values?.property_city}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.property_city && touched.property_city })}
                                    />
                                    {errors.property_city && touched.property_city ? <small className="p-invalid error">{'Please enter City'}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="propertyState" className="required">
                                        State
                                    </label>
                                    <InputText
                                        id="propertyState"
                                        name="propertyState"
                                        disabled
                                        placeholder="Enter State"
                                        type="text"
                                        value={values?.propertyState}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.propertyState && touched.propertyState })}
                                    />
                                    {errors.propertyState && touched.propertyState ? <small className="p-invalid error">{'Please enter State'}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="propertyCountry" className="required">
                                        Country
                                    </label>
                                    <InputText
                                        id="propertyCountry"
                                        name="propertyCountry"
                                        disabled
                                        placeholder="Enter Country"
                                        type="text"
                                        value={values?.propertyCountry}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.propertyCountry && touched.propertyCountry })}
                                    />
                                    {errors.propertyCountry && touched.propertyCountry ? <small className="p-invalid error">{'Please enter Country'}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="property_landmark">Landmark</label>
                                    <InputText
                                        id="property_landmark"
                                        name="property_landmark"
                                        placeholder="Enter Landmark"
                                        value={values?.property_landmark}
                                        style={{
                                            color: 'black'
                                        }}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.property_landmark && touched.property_landmark })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.property_landmark && touched.property_landmark ? errors?.property_landmark : ''}
                                    </div>
                                </div>
                                <Divider align="center" className=" pt-0">
                                    <span className="p-tag text-base">Property Chairman Details</span>
                                </Divider>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="name" className="required">
                                        Name
                                    </label>
                                    <InputText
                                        id="name"
                                        type="text"
                                        placeholder="Enter Name"
                                        name="name"
                                        value={values?.name}
                                        style={{
                                            color: 'black'
                                        }}
                                        useGrouping={false}
                                        maxLength={10}
                                        // onValueChange={(e) => {
                                        //     setFieldValue('name', e.value === null ? '' : e.value.toString());
                                        // }}
                                        onChange={(e) => {
                                            setFieldValue('name', e.target.value);
                                        }}
                                        className={classNames({ 'p-invalid': errors.name && touched.name })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.name && touched.name ? errors.name : ''}
                                    </div>
                                    {/* {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null} */}
                                </div>

                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="email" className="required">
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        type="text"
                                        disabled
                                        placeholder="Enter Email"
                                        name="email"
                                        value={values?.email}
                                        style={{
                                            color: 'black'
                                        }}
                                        useGrouping={false}
                                        maxLength={10}
                                        onValueChange={(e) => {
                                            setFieldValue('email', e.value === null ? '' : e.value.toString());
                                        }}
                                        className={classNames({ 'p-invalid': errors.email && touched.email })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.email && touched.email ? errors.email : ''}
                                    </div>
                                    {/* {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null} */}
                                </div>

                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="mobile_number" className="required">
                                        Mobile Number
                                    </label>
                                    <InputNumber
                                        id="mobile_number"
                                        type="text"
                                        placeholder="Enter Mobile Number"
                                        name="mobile_number"
                                        value={values?.mobile_number}
                                        style={{
                                            color: 'black'
                                        }}
                                        useGrouping={false}
                                        maxLength={10}
                                        onValueChange={(e) => {
                                            setFieldValue('mobile_number', e.value === null ? '' : e.value.toString());
                                        }}
                                        className={classNames({ 'p-invalid': errors.mobile_number && touched.mobile_number })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.mobile_number && touched.mobile_number ? errors.mobile_number : ''}
                                    </div>
                                    {/* {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null} */}
                                </div>
                                <Divider align="center" className=" pt-0">
                                    <span className="p-tag text-base">Subscription Details</span>
                                </Divider>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="subscriptionPlan">Subscription Plan</label>
                                    <Dropdown
                                        id="subscriptionPlan"
                                        name="subscriptionPlan"
                                        value={values?.subscriptionPlan}
                                        options={[
                                            { label: 'Basic', value: 'Basic' },
                                            { label: 'Pro', value: 'Pro' },
                                            { label: 'Enterprise', value: 'Enterprise' }
                                        ]}
                                        placeholder="Select Subscription Status"
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.subscriptionPlan && touched.subscriptionPlan })}
                                    />
                                    {/* Uncomment this block for validation error message */}
                                    {/* <small className="p-invalid error">
            {errors.subscriptionStatus && touched.subscriptionStatus && 'Please select a Subscription Status.'}
        </small> */}
                                </div>

                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="subscriptionStatus">Subscription Status</label>
                                    <Dropdown
                                        id="subscriptionStatus"
                                        name="subscriptionStatus"
                                        value={values?.subscriptionStatus}
                                        options={[
                                            { label: 'Active', value: 'Active' },
                                            { label: 'Trial', value: 'Trial' }
                                        ]}
                                        placeholder="Select Subscription Status"
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.subscriptionStatus && touched.subscriptionStatus })}
                                    />
                                    {/* Uncomment this block for validation error message */}
                                    {/* <small className="p-invalid error">
            {errors.subscriptionStatus && touched.subscriptionStatus && 'Please select a Subscription Status.'}
        </small> */}
                                </div>

                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="billingCycle">Billing Cycle</label>
                                    <Dropdown
                                        id="billingCycle"
                                        name="billingCycle"
                                        value={values?.billingCycle}
                                        options={[
                                            { label: 'Monthly', value: 'Monthly' },
                                            { label: 'Annual', value: 'Annual' }
                                        ]}
                                        placeholder="Select Billing Cycle"
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.billingCycle && touched.billingCycle })}
                                    />
                                    {/* Uncomment this block for validation error message */}
                                    {/* <small className="p-invalid error">
            {errors.billingCycle && touched.billingCycle && 'Please select a Billing Cycle.'}
        </small> */}
                                </div>
                            </div>
                            <Divider align="center" className=" pt-0">
                                <span className="p-tag text-base">Bank Details</span>
                            </Divider>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="bank_name" className="required">
                                        Bank Name
                                    </label>
                                    {/* <InputText
                                                    id="bank_name"
                                                    name="bank_name"
                                                    placeholder="Enter Bank Name"
                                                    type="text"
                                                    value={values?.bank_name}
                                                    onChange={handleChange}
                                                    className={classNames({ 'p-invalid': errors.bank_name && touched.bank_name })}
                                                /> */}
                                    <AutoComplete
                                        id="bankName"
                                        name="bankName"
                                        field="name"
                                        placeholder="Enter Bank Name"
                                        value={values?.bankName}
                                        suggestions={filteredCountries}
                                        completeMethod={search}
                                        className={classNames({ 'p-invalid': errors.bankName && touched.bankName })}
                                        onChange={(e) => {
                                            let check = typeof e.value === 'object';
                                            setFieldValue('bankName', check ? e?.value?.name : e.value);
                                        }}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.bankName && touched.bankName ? errors.bankName : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="IFSCCode" className="required">
                                        IFSC Code
                                    </label>
                                    <InputText
                                        id="IFSCCode"
                                        type="text"
                                        placeholder="Enter IFSC Code"
                                        name="IFSCCode"
                                        value={values?.IFSCCode}
                                        onChange={async (e) => {
                                            const { value } = e.target;
                                            setFieldValue('IFSCCode', value);
                                            if (value && value.length === 11) {
                                                // Assuming IFSC code length is 11
                                                setLoading(true);
                                                const branchDetails = await fetchBranchDetails(value);
                                                if (branchDetails) {
                                                    setFieldValue('branchName', `${branchDetails.ADDRESS}-${branchDetails.BRANCH}`); // Assuming bank_name is returned
                                                }
                                                setLoading(false);
                                            }
                                        }}
                                        className={classNames({ 'p-invalid': errors.IFSCCode && touched.IFSCCode })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.IFSCCode && touched.IFSCCode ? errors.IFSCCode : ''}
                                    </div>
                                </div>

                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="branchName" className="required">
                                        Branch Name
                                    </label>
                                    <InputText
                                        id="branchName"
                                        type="text"
                                        placeholder="Enter Branch Name"
                                        name="branchName"
                                        value={values?.branchName}
                                        onChange={handleChange}
                                        // disabled
                                        disabled={loading || !values?.IFSCCode} // Disable the branch name field while loading
                                        className={classNames({ 'p-invalid': errors.branchName && touched.branchName })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                        {errors.branchName && touched.branchName ? errors.branchName : ''}
                                    </div>
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-1"> */}
                                {/* <label htmlFor="bankName" className="required">
                                                Bank Name
                                            </label>
                                            <InputText
                                                id="bankName"
                                                name="bankName"
                                                placeholder="Enter bank Name"
                                                type="text"
                                                style={{
                                                    color: 'black'
                                                }}
                                                value={values?.bankName}
                                                onChange={(e) => {
                                                    const textOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                                                    handleChange({ target: { name: e.target.name, value: textOnly } });
                                                }}
                                                className={classNames({ 'p-invalid': errors.bankName && touched.bankName })}
                                            />
                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                {errors.bankName && touched.bankName ? 'Please enter bank name.' : ''}
                                            </div> */}
                                {/* </div> */}
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="accountHolderName" className="required">
                                        Account Holder Name
                                    </label>
                                    <InputText
                                        id="accountHolderName"
                                        name="accountHolderName"
                                        placeholder="Enter Account Holder Name"
                                        value={values?.accountHolderName}
                                        style={{
                                            color: 'black'
                                        }}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.accountHolderName && touched.accountHolderName })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.accountHolderName && touched.accountHolderName ? errors?.accountHolderName : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="bankAccountNumber" className="required">
                                        Account Number
                                    </label>
                                    <div className="p-inputgroup">
                                        <Field
                                            id="bankAccountNumber"
                                            name="bankAccountNumber"
                                            type={isAcconNumberVisible ? 'tel' : 'password'} // Toggle between text and password
                                            placeholder="Enter Account Number"
                                            className="p-inputtext p-component"
                                            style={{ color: 'black' }}
                                            maxLength={18}
                                            onKeyPress={(e) => {
                                                if (!/^\d+$/.test(e.key)) {
                                                    e.preventDefault(); // Prevent non-numeric input
                                                }
                                            }}
                                            onChange={(e) => handleBankAccountNumberChange(e, setFieldValue, values, setFieldError)}
                                        />
                                        <span className="p-inputgroup-addon">
                                            <i className={`pi ${isAcconNumberVisible ? 'pi-eye' : 'pi-eye-slash'}`} onClick={togglePassword} style={{ cursor: 'pointer' }}></i>
                                        </span>
                                    </div>
                                    <ErrorMessage name="bankAccountNumber" component="div" className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }} />
                                </div>

                                {/* Conditionally render 'Re-enter Account Number' field only if account number is edited */}
                                {isAccountNumberEdited && (
                                    <div className="field col-12 md:col-4 mb-1">
                                        <label htmlFor="reEnterBankAccountNumber" className="required">
                                            Re-enter Account Number
                                        </label>
                                        <div className="p-inputgroup">
                                            <Field
                                                id="reEnterBankAccountNumber"
                                                name="reEnterBankAccountNumber"
                                                type="tel"
                                                placeholder="Re-enter Account Number"
                                                className="p-inputtext p-component"
                                                style={{ color: 'black' }}
                                                maxLength={18}
                                                onKeyPress={(e) => {
                                                    if (!/^\d+$/.test(e.key)) {
                                                        e.preventDefault(); // Prevent non-numeric input
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const reEnterValue = e.target.value;
                                                    setFieldValue('reEnterBankAccountNumber', reEnterValue);

                                                    if (!reEnterValue) {
                                                        setFieldError('reEnterBankAccountNumber', 'Please re-enter your account number');
                                                    } else if (reEnterValue !== values.bankAccountNumber) {
                                                        setFieldError('reEnterBankAccountNumber', 'Account numbers do not match');
                                                    } else {
                                                        setFieldError('reEnterBankAccountNumber', '');
                                                    }
                                                }}
                                            />
                                        </div>
                                        <ErrorMessage name="reEnterBankAccountNumber" component="div" className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }} />
                                    </div>
                                )}
                            </div>
                            <div className="text-right mt-4">
                                <Button type="button" label="Cancel" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/superadmin/properties')} />
                                <Button
                                    label="Update"
                                    type="Update"
                                    className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                    onClick={() => {
                                        // e.preventDefault(); // Prevent form submission
                                        handleSubmit();
                                    }}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditProperty;
