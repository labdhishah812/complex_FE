import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import components from '../..';
import Loader from '../../../../components/Loader';
import { createPropertyRequest, editComplexRequest, getcomplexDataById } from '../../../../redux/slice/AdminSlices/complexSlice';
import { AutoComplete } from 'primereact/autocomplete';

const PropertyList = () => {
    const { BreadCrumb, Checkbox, Image, Button, InputNumber, InputTextarea, Dropdown, useState, React, Dialog, InputText, classNames, RadioButton, Divider, useSelector, useNavigate, useDispatch, useEffect, toast } = components;
    const { isCreated, complexDataById, isLoading } = useSelector((state) => state.complex);
    const params = useParams();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [value, setValue] = useState({
        id: '',
        property_type: '',
        is_block_exist_in_property: true,
        is_floor_exist_in_property: true,
        is_house_exist_in_property: true,
        is_ground_floor_exist_in_property: false,
        is_shopping_center_exist_in_property: false,
        is_block_exist_in_shopping_center_property: false,
        is_floor_exist_in_shopping_center_property: true,
        property_name: '',
        domainName: '',
        propertyEmail: '',
        // property_address: '',
        email: '',
        name: '',
        mobile_number: null,
        property_status: 'Active',
        property_logo: null,
        property_city: '',
        pin_code: '',
        propertyArea: '',
        propertyState: '',
        propertyCountry: '',
        property_landmark: '',
        accountHolderName: '',
        bankName: '',
        bankAccountNumber: '',
        reEnterBankAccountNumber: '',
        branchName: '',
        IFSCCode: '',
        isPropertyLogin: false,
        subscriptionPlan: '',
        subscriptionStatus: '',
        billingCycle: ''
    });
    const [showImg, setShowImg] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [pincode, setPincode] = useState('');
    const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
    const [isLoadingPincode, setIsLoadingPincode] = useState(false);
    const [showPincodeDropdown, setShowPincodeDropdown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [emailTimeLeft, setEmailTimeLeft] = useState(60);
    const [isEmailTimerActive, setIsEmailTimerActive] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isOtpVerifiedMessage, setIsOtpVerifiedMessage] = useState(false);
    const [numberTimeLeft, setNumberTimeLeft] = useState(60);
    const [isNumberTimerActive, setIsNumberTimerActive] = useState(false);
    const [Loading, setIsLoading] = useState(false);
    const [isAcconNumberVisible, setisAcconNumberVisible] = useState(false);
    const [isReenterAcconNumberVisible, setisReenterAcconNumberVisible] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState(null);
    const togglePassword = () => {
        setisAcconNumberVisible(!isAcconNumberVisible);
        // setisReenterAcconNumberVisible(!isReenterAcconNumberVisible);
    };
    useEffect(() => {
        // Redirect after successful creation
        if (isCreated) {
            // toast.success('Property created successfully!');
            navigate('/superadmin/properties');
        }
    }, [isCreated, navigate]);

    useEffect(() => {
        // Fetch salesman data by ID if editing
        if (params.id) {
            dispatch(getcomplexDataById(params.id));
        }
    }, [params.id, dispatch]);

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
        // Pre-fill form data for editing with safer null checks
        if (params.id && complexDataById) {
            console.log(complexDataById, 'complexDataById');
            setValue({
                id: complexDataById?._id || '',
                property_type: complexDataById?.property_type || '',
                property_name: complexDataById?.property_name || '',
                domainName: complexDataById?.domainName || '',
                propertyEmail: complexDataById?.propertyEmail || '',
                email: complexDataById?.email || '',
                name: complexDataById?.name || '',
                mobile_number: complexDataById?.mobile_number || null,
                property_status: complexDataById?.property_status || 'Active',
                property_logo: complexDataById?.property_logo || null,
                property_city: complexDataById?.property_city || '',
                pin_code: complexDataById?.pin_code || '',
                propertyArea: complexDataById?.propertyArea || '',
                propertyState: complexDataById?.propertyState || '',
                propertyCountry: complexDataById?.propertyCountry || '',
                property_landmark: complexDataById?.property_landmark || '',
                accountHolderName: complexDataById?.accountHolderName || '',
                bankName: complexDataById?.bankName || '',
                bankAccountNumber: complexDataById?.bankAccountNumber || '',
                reEnterBankAccountNumber: complexDataById?.reEnterBankAccountNumber || '',
                branchName: complexDataById?.branchName || '',
                IFSCCode: complexDataById?.IFSCCode || '',
                isPropertyLogin: complexDataById?.isPropertyLogin || '',
                subscriptionPlan: complexDataById?.subscriptionPlan || '',
                subscriptionStatus: complexDataById?.subscriptionStatus || '',
                billingCycle: complexDataById?.billingCycle || ''
            });
        }
    }, [params.id, complexDataById]);

    const statusTag = [
        { label: 'Active', value: 'Active' },
        { label: 'In-Active', value: 'In-Active' }
    ];
    const SignupSchema = Yup.object().shape({
        property_type: Yup.string().trim().nullable().required(' '),
        property_name: Yup.string().trim().nullable().required(' '),
        domainName: Yup.string().trim().nullable().required(' '),
        // property_address: Yup.string().trim().nullable().required(' '),
        email: Yup.string().trim().nullable().required('Please enter email').email('Please enter valid email.'),
        name: Yup.string().trim().nullable().required(' '),
        property_city: Yup.string().trim().nullable().required('Please enter city.'),
        propertyArea: Yup.string().trim().nullable().required('Please enter area.'),
        propertyState: Yup.string().trim().nullable().required('Please enter state.'),
        propertyCountry: Yup.string().trim().nullable().required('Please enter country.'),
        mobile_number: Yup.string().trim().min(10, 'Mobile no must be at least 10 digit no.').max(10, 'Mobile no must be at least 10 digit no.').required('Please enter mobile number.'),
        pin_code: Yup.string().trim().nullable().min(6, 'Pincode no must be at least 6 digit no.').max(6, 'Pincode no must be at least 6 digit no.').required('Please enter pincode.'),
        accountHolderName: Yup.string().trim().nullable().required('Please enter account holder name.'),
        bankName: Yup.string().trim().nullable().required('Please enter bank name.'),
        bankAccountNumber: Yup.string().trim().nullable().required('Please enter bank account number.'),
        reEnterBankAccountNumber: Yup.string()
            .required('Please re-enter account number')
            .oneOf([Yup.ref('bankAccountNumber')], 'Account numbers does not match'),

        branchName: Yup.string().trim().nullable().required('Please enter branch name.'),
        IFSCCode: Yup.string()
            .trim()
            .nullable()
            .required('Please enter IFSC code.')
            .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code. It should be 11 characters long: first 4 uppercase alphabets, 5th character 0, and last 6 alphanumeric characters.')
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

    const handleFileInputChange = (event, setFieldValue) => {
        let file = event.target.files[0];
        if (file.type.startsWith('image/')) {
            setFieldValue('property_logo', file);
            setShowImg(URL.createObjectURL(file));
            // const img = new Image();
            // img.src = URL.createObjectURL(file);
            // img.onload = () => {
            //     // if (img.width === 50 && img.height === 50) {
            //     // }
            //     // else {
            //     //     // toast.error("Image must be exactly 50x50 pixels.", {
            //     //     //     style: {
            //     //     //         marginTop: "2rem",
            //     //     //     },
            //     //     // });
            //     // }
            // };

            // setValue("category_icon", file);
            // setShowImg(URL.createObjectURL(file));
        }
    };
    const generateSlug = (name) => {
        if (!name) return '';
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special chars with hyphens
            .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
    };
    const handleDrop = (event, setFieldValue) => {
        event.preventDefault();
        let file = event.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
            setFieldValue('property_logo', file);
            setShowImg(URL.createObjectURL(file));
        }
    };
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // const handlePincodeSearch = (pincode) => {
    //     if (pincodeTimeout) {
    //         clearTimeout(pincodeTimeout);
    //     }

    //     const timeoutId = setTimeout(async () => {
    //         if (pincode?.length >= 6) {
    //             console.log('Calling API for pincode:', pincode);
    //             try {
    //                 await dispatch(fetchPincodeRequest(pincode)); // Debug if this action is working
    //             } catch (error) {
    //                 console.error('Error calling API:', error);
    //             }
    //         } else {
    //             console.log('Pincode length insufficient, no API call');
    //         }
    //     }, 300);

    //     setPincodeTimeout(timeoutId);
    // };

    // Function to handle address selection

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
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

    // Handle input change
    const handlePincodeChange = (e) => {
        const newPincode = e.target.value;
        setPincode(newPincode); // Update the pincode state
        fetchPincodeSuggestions(newPincode); // Call fetchPincodeSuggestions with the new pincode
    };

    const handleAddressSelection = (suggestion, setFieldValue) => {
        console.log(suggestion, 'suggestion: ', setFieldValue, 'setFieldValue');
        setFieldValue('pin_code', suggestion.details.pincode);
        setFieldValue('propertyArea', suggestion.details.officeName);
        setFieldValue('property_city', suggestion.details.taluk);
        setFieldValue('propertyState', suggestion.details.state);
        setFieldValue('propertyCountry', 'India');
        setShowPincodeDropdown(false); // Hide the dropdown after selection
    };

    const handleSendEmail = async () => {
        if (!isEmailTimerActive) {
            try {
                setIsLoading(true);
                setIsSendingOtp(true); // Add a new state to track OTP sending

                const response = await axios.post(`${BASE_URL_API}/property/verify-otp/send`, { email: value.email });
                console.log('OTP sent successfully:', response.data);

                setIsOtpSent(true);
                setIsEmailTimerActive(true);
                setEmailTimeLeft(60);
                setIsSendingOtp(false); // Reset sending state

                toast.success('OTP sent successfully, Please check your email', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            } catch (error) {
                console.error('Error sending OTP:', error);
                setIsSendingOtp(false); // Reset sending state in case of error
                toast.error('Failed to send OTP. Please try again.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // const handleSendEmail = async () => {
    //     if (!isEmailTimerActive) {
    //         try {
    //             setIsLoading(true);
    //             const response = await axios.post('https://app.complex360.in/api/property/verify-otp/send', { email: value.email });
    //             console.log('OTP sent successfully:', response.data);
    //             setIsOtpSent(true);
    //             setIsEmailTimerActive(true);
    //             setEmailTimeLeft(60);
    //             toast.success('OTP sent successfully, Please check your email', {
    //                 style: {
    //                     marginTop: '4rem'
    //                 }
    //             });
    //             // toast('OTP sent successfully, Please check your email');
    //         } catch (error) {
    //             console.error('Error sending OTP:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    // };

    useEffect(() => {
        let emailInterval;
        if (isEmailTimerActive && emailTimeLeft > 0) {
            emailInterval = setInterval(() => {
                setEmailTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (emailTimeLeft === 0) {
            clearInterval(emailInterval);
            setIsOtpSent(true);
            setIsEmailTimerActive(false);
        }
        return () => clearInterval(emailInterval);
    }, [isEmailTimerActive, emailTimeLeft]);

    const handleOtpChange = (e) => {
        const enteredOtp = e.target.value;
        setOtp(enteredOtp);
        if (e.target.value.length > 0) {
            setIsEmailTimerActive(false); // Stop the timer when OTP input is not empty
        }
    };

    const handleVerifyOtp = async () => {
        try {
            if (otp.includes(' ')) {
                alert('OTP should not contain spaces');
                return;
            }
            const response = await axios.post(
                `${BASE_URL_API}/property/verify-otp/verify`,
                {
                    email: value.email,
                    otp: parseInt(otp),
                    type: 'email'
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log('response.data: ', response.data.data);

            if (response.data.data) {
                console.log('OTP verified:', response.data.data);
                setIsOtpVerified(true);
                setIsOtpSent(false);
                setOtp('');
                setEmailTimeLeft(60);
                setIsEmailTimerActive(false);
                setValue({ ...value, email: value.email });
                setIsOtpVerifiedMessage(true);
                toast.success('OTP verified successfully!', {
                    style: {
                        marginTop: '4rem'
                    }
                });
                // toast('OTP verified successfully!');
            } else {
                toast.error('OTP verification failed. Please try again.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
                // toast('OTP verification failed. Please try again.');
            }
        } catch (error) {
            toast.error('Error occurred while verifying OTP. Please try again.', {
                style: {
                    marginTop: '4rem'
                }
            });
            // toast('Error occurred while verifying OTP. Please try again.');
        }
    };

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Property Edit' : 'Property Create'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={value}
                    validationSchema={SignupSchema}
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        const data = {
                            property_type: values?.property_type,
                            property_name: values?.property_name.trim(),
                            domainName: values.domainName.trim(),
                            propertyEmail: values.propertyEmail.trim(),
                            // property_address: values?.property_address,
                            name: values?.name,
                            mobile_number: values?.mobile_number?.toString(),
                            email: values?.email,
                            property_status: values?.property_status,
                            accountHolderName: values?.accountHolderName,
                            bankName: values?.bankName,
                            bankAccountNumber: values?.bankAccountNumber,
                            reEnterBankAccountNumber: values?.reEnterBankAccountNumber,
                            branchName: values?.branchName,
                            IFSCCode: values?.IFSCCode,
                            pin_code: values?.pin_code,
                            property_city: values?.property_city,
                            propertyState: values?.propertyState,
                            propertyCountry: values?.propertyCountry,
                            property_landmark: values?.property_landmark,
                            propertyArea: values?.propertyArea,
                            // isPropertyLogin: values?.isPropertyLogin,
                            subscriptionPlan: values?.subscriptionPlan,
                            subscriptionStatus: values?.subscriptionStatus,
                            billingCycle: values?.billingCycle
                        };
                        if (values?.isPropertyLogin === true) data.isPropertyLogin = values?.isPropertyLogin;
                        if (values?.is_block_exist_in_property === true) data.is_block_exist_in_property = values?.is_block_exist_in_property;
                        if (values?.is_ground_floor_exist_in_property === true) data.is_ground_floor_exist_in_property = values?.is_ground_floor_exist_in_property;
                        if (values?.is_floor_exist_in_property === true && values?.property_type !== 'Society') data.is_floor_exist_in_property = values?.is_floor_exist_in_property;
                        if (values?.is_house_exist_in_property === true && (values?.property_type === 'Society' ? true : values?.is_floor_exist_in_property === false)) data.is_house_exist_in_property = values?.is_house_exist_in_property;
                        if (values?.is_shopping_center_exist_in_property === true) data.is_shopping_center_exist_in_property = values?.is_shopping_center_exist_in_property;
                        if (values?.is_shopping_center_exist_in_property === true && values?.is_block_exist_in_shopping_center_property === true) data.is_block_exist_in_shopping_center_property = values?.is_block_exist_in_shopping_center_property;
                        if (values?.is_shopping_center_exist_in_property === true && values?.is_floor_exist_in_shopping_center_property === true) data.is_floor_exist_in_shopping_center_property = values?.is_floor_exist_in_shopping_center_property;
                        console.log(data, 'datataaaaaaaaa');
                        let formData = new FormData();
                        formData.append('property_type', values?.property_type);
                        formData.append('property_name', values?.property_name.trim());
                        formData.append('domainName', values?.domainName.trim());
                        formData.append('propertyEmail', values?.propertyEmail.trim());
                        // formData.append('property_address', values?.property_address);
                        formData.append('pin_code', values?.pin_code);
                        formData.append('propertyArea', values?.propertyArea);
                        formData.append('property_city', values?.property_city);
                        formData.append('propertyState', values?.propertyState);
                        formData.append('propertyCountry', values?.propertyCountry);
                        formData.append('property_landmark', values?.property_landmark);
                        formData.append('name', values?.name);
                        formData.append('mobile_number', values?.mobile_number?.toString());
                        formData.append('email', values?.email);
                        formData.append('property_status', values?.property_status);
                        formData.append('property_logo', values?.property_logo ? values?.property_logo : '');
                        formData.append('accountHolderName', values?.accountHolderName ? values?.accountHolderName : '');
                        formData.append('bankName', values?.bankName ? values?.bankName : '');
                        formData.append('bankAccountNumber', values?.bankAccountNumber ? values?.bankAccountNumber : '');
                        formData.append('branchName', values?.branchName ? values?.branchName : '');
                        formData.append('IFSCCode', values?.IFSCCode ? values?.IFSCCode : '');
                        formData.append('subscriptionPlan', values?.subscriptionPlan ? values?.subscriptionPlan : '');
                        formData.append('subscriptionStatus', values?.subscriptionStatus ? values?.subscriptionStatus : '');
                        formData.append('billingCycle', values?.billingCycle ? values?.billingCycle : '');
                        formData.append(
                            'isPropertyLogin',
                            values?.isPropertyLogin ? 'true' : 'false' // Convert boolean to string representation (as FormData does not handle true/false directly)
                        );
                        // values?.isPropertyLogin === true && formData.append('isPropertyLogin', values?.isPropertyLogin);
                        values?.is_block_exist_in_property === true && formData.append('is_block_exist_in_property', values?.is_block_exist_in_property);
                        values?.is_ground_floor_exist_in_property === true && formData.append('is_ground_floor_exist_in_property', values?.is_ground_floor_exist_in_property);
                        values?.is_floor_exist_in_property === true && values?.property_type !== 'Society' && formData.append('is_floor_exist_in_property', values?.is_floor_exist_in_property);
                        values?.is_house_exist_in_property === true && (values?.property_type === 'Society' ? true : values?.is_floor_exist_in_property === false) && formData.append('is_house_exist_in_property', values?.is_house_exist_in_property);
                        values?.is_shopping_center_exist_in_property === true && formData.append('is_shopping_center_exist_in_property', values?.is_shopping_center_exist_in_property);
                        values?.is_shopping_center_exist_in_property === true &&
                            values?.is_block_exist_in_shopping_center_property === true &&
                            formData.append('is_block_exist_in_shopping_center_property', values?.is_block_exist_in_shopping_center_property);
                        values?.is_shopping_center_exist_in_property === true &&
                            values?.is_floor_exist_in_shopping_center_property === true &&
                            formData.append('is_floor_exist_in_shopping_center_property', values?.is_floor_exist_in_shopping_center_property);

                        if (values.id === '') {
                            dispatch(createPropertyRequest(formData));
                        } else {
                            dispatch(editComplexRequest(values.id, data));
                        }
                        setTimeout(() => setSubmitted(false), 5000);
                    }}
                >
                    {({ values, setFieldValue, handleChange, errors, touched, setFieldError }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-3 mb-1">
                                    <label htmlFor="property_type" className="required">
                                        Property Type
                                    </label>

                                    <Dropdown
                                        id="dropdown"
                                        optionLabel="label"
                                        optionValue="value"
                                        options={[
                                            { label: 'Complex', value: 'Complex' },
                                            { label: 'Flat', value: 'Flat' },
                                            { label: 'Society', value: 'Society' }
                                        ]}
                                        name="property_type"
                                        placeholder="Select Property Type"
                                        type="text"
                                        value={values?.property_type}
                                        // onChange={(e) => setValue({ ...value, property_type: e.target.value, is_block_exist_in_property: true, is_floor_exist_in_property: true, is_house_exist_in_property: true })}\
                                        onChange={(e) => {
                                            setFieldValue('property_type', e.target.value);
                                            setFieldValue('is_block_exist_in_property', true);
                                            setFieldValue('is_floor_exist_in_property', true);
                                            setFieldValue('is_house_exist_in_property', true);
                                            setFieldValue('is_ground_floor_exist_in_property', false);
                                            setFieldValue('is_shopping_center_exist_in_property', false);
                                            setFieldValue('is_block_exist_in_shopping_center_property', false);
                                        }}
                                        className={classNames({ 'p-invalid': errors.property_type && touched.property_type })}
                                    />

                                    {errors.property_type && touched.property_type ? <small className="p-invalid error">{errors.property_type}</small> : null}
                                </div>
                                {values?.property_type !== '' && (
                                    <>
                                        <div className="field col-12 md:col-3 mb-1 md:pl-4">
                                            <div className="md:max-w-8rem md:m-auto">
                                                <label className="required">Block</label>
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    <div className="flex align-items-center">
                                                        <RadioButton
                                                            inputId="block1"
                                                            name="is_block_exist_in_property"
                                                            value="yes"
                                                            onChange={(e) => {
                                                                setFieldValue('is_block_exist_in_property', true);
                                                            }}
                                                            checked={values?.is_block_exist_in_property === true}
                                                        />
                                                        <label htmlFor="block1" className="ml-2">
                                                            Yes
                                                        </label>
                                                    </div>
                                                    <div className="flex align-items-center">
                                                        <RadioButton
                                                            inputId="block2"
                                                            name="is_block_exist_in_property"
                                                            value="no"
                                                            onChange={(e) => {
                                                                setFieldValue('is_block_exist_in_property', false);
                                                                setFieldValue('is_block_exist_in_shopping_center_property', false);
                                                            }}
                                                            checked={values?.is_block_exist_in_property === false}
                                                        />
                                                        <label htmlFor="block2" className="ml-2">
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {values?.property_type !== 'Society' && (
                                            <div className="field col-12 md:col-3 mb-1">
                                                <div className="md:max-w-8rem md:m-auto">
                                                    <label className="">Floor</label>
                                                    <div className="flex flex-wrap gap-3 mt-2">
                                                        <div className="flex align-items-center">
                                                            <Checkbox
                                                                // onChange={e => setChecked(e.checked)}
                                                                checked={values?.is_floor_exist_in_property === true}
                                                                disabled
                                                            ></Checkbox>
                                                            {/* <RadioButton
                                                            inputId="floor1"
                                                            name="is_floor_exist_in_property"
                                                            value="yes"
                                                            onChange={(e) => {
                                                                setFieldValue('is_floor_exist_in_property', true);
                                                            }}
                                                            checked={values?.is_floor_exist_in_property === true}
                                                        />
                                                        <label htmlFor="floor1" className="ml-2">
                                                            Yes
                                                        </label> */}
                                                        </div>
                                                        {/* <div className="flex align-items-center">
                                    <RadioButton inputId="floor2" name="is_floor_exist_in_property" value="no" onChange={(e) => setValue({ ...value, is_floor_exist_in_property: false })} checked={value?.is_floor_exist_in_property === false} />
                                    <label htmlFor="floor2" className="ml-2">
                                        No
                                    </label>
                                </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {(values?.is_floor_exist_in_property === false || value?.property_type === 'Society') && (
                                            <div className="field col-12 md:col-3 mb-1">
                                                <label className="required">House</label>
                                                <div className="flex flex-wrap gap-3 ">
                                                    <div className="flex align-items-center">
                                                        <RadioButton
                                                            inputId="house1"
                                                            name="is_house_exist_in_property"
                                                            value="yes"
                                                            onChange={(e) => {
                                                                setFieldValue('is_house_exist_in_property', true);
                                                            }}
                                                            checked={values?.is_house_exist_in_property === true}
                                                        />
                                                        <label htmlFor="house1" className="ml-2">
                                                            Yes
                                                        </label>
                                                    </div>
                                                    {/* <div className="flex align-items-center">
                                    <RadioButton inputId="house2" name="is_house_exist_in_property" value="no" onChange={(e) => setValue({ ...value, is_house_exist_in_property: false })} checked={value?.is_house_exist_in_property === false} />
                                    <label htmlFor="house2" className="ml-2">
                                        No
                                    </label>
                                </div> */}
                                                </div>
                                            </div>
                                        )}
                                        {values?.property_type === 'Complex' && (
                                            <div className="field col-12 md:col-3 mb-1">
                                                <div className="md:max-w-12rem md:m-auto">
                                                    <label className="required">Ground Floor Availability </label>
                                                    <div className="flex flex-wrap gap-3 mt-2">
                                                        <div className="flex align-items-center">
                                                            <RadioButton
                                                                inputId="ground1"
                                                                name="is_ground_floor_exist_in_property"
                                                                value="yes"
                                                                onChange={(e) => {
                                                                    setFieldValue('is_ground_floor_exist_in_property', true);
                                                                }}
                                                                checked={values?.is_ground_floor_exist_in_property === true}
                                                            />
                                                            <label htmlFor="ground1" className="ml-2">
                                                                Yes
                                                            </label>
                                                        </div>
                                                        <div className="flex align-items-center">
                                                            <RadioButton
                                                                inputId="ground2"
                                                                name="is_ground_floor_exist_in_property"
                                                                value="no"
                                                                onChange={(e) => {
                                                                    setFieldValue('is_ground_floor_exist_in_property', false);
                                                                }}
                                                                checked={values?.is_ground_floor_exist_in_property === false}
                                                            />
                                                            <label htmlFor="ground2" className="ml-2">
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {values?.property_type === 'Flat' && (
                                            <div className="field col-12 md:col-3 mb-1">
                                                <div className="md:max-w-14rem md:m-auto">
                                                    <label className="required">Shopping Center Availability</label>
                                                    <div className="flex flex-wrap gap-3 mt-2">
                                                        <div className="flex align-items-center">
                                                            <RadioButton
                                                                inputId="Shopping1"
                                                                name="is_shopping_center_exist_in_property"
                                                                value="yes"
                                                                onChange={(e) => {
                                                                    setFieldValue('is_shopping_center_exist_in_property', true);
                                                                }}
                                                                checked={values?.is_shopping_center_exist_in_property === true}
                                                            />
                                                            <label htmlFor="Shopping1" className="ml-2">
                                                                Yes
                                                            </label>
                                                        </div>
                                                        <div className="flex align-items-center">
                                                            <RadioButton
                                                                inputId="Shopping2"
                                                                name="is_shopping_center_exist_in_property"
                                                                value="no"
                                                                onChange={(e) => {
                                                                    setFieldValue('is_shopping_center_exist_in_property', false);
                                                                    setFieldValue('is_block_exist_in_shopping_center_property', false);
                                                                }}
                                                                checked={values?.is_shopping_center_exist_in_property === false}
                                                            />
                                                            <label htmlFor="Shopping2" className="ml-2">
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {values?.is_shopping_center_exist_in_property === true && values?.is_block_exist_in_property === true && (
                                            <div className="field col-12 md:col-3 mb-1">
                                                <label className="required">Is there a block in shopping center?</label>
                                                <div className="flex flex-wrap gap-3 ">
                                                    <div className="flex align-items-center">
                                                        <RadioButton
                                                            inputId="ShoppingBlock1"
                                                            name="is_block_exist_in_shopping_center_property"
                                                            value="yes"
                                                            onChange={(e) => {
                                                                setFieldValue('is_block_exist_in_shopping_center_property', true);
                                                            }}
                                                            checked={values?.is_block_exist_in_shopping_center_property === true}
                                                        />
                                                        <label htmlFor="ShoppingBlock1" className="ml-2">
                                                            Yes
                                                        </label>
                                                    </div>
                                                    <div className="flex align-items-center">
                                                        <RadioButton
                                                            inputId="ShoppingBlock2"
                                                            name="is_block_exist_in_shopping_center_property"
                                                            value="no"
                                                            onChange={(e) => {
                                                                setFieldValue('is_block_exist_in_shopping_center_property', false);
                                                            }}
                                                            checked={values?.is_block_exist_in_shopping_center_property === false}
                                                        />
                                                        <label htmlFor="ShoppingBlock2" className="ml-2">
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            {values?.property_type !== '' && (
                                <>
                                    <Divider align="center" className="pt-0">
                                        <span className="p-tag text-base">Property Details</span>
                                    </Divider>
                                    {/* <div className="grid p-fluid mt-1">

                                    </div> */}
                                    <div className="grid p-fluid mt-1">
                                        <div className="field col-12 md:col-2 mb-1">
                                            <div className="grid p-fluid mt-1">
                                                <div className="field col-12 mb-1">
                                                    <label htmlFor="mobile_number" className="">
                                                        Property Logo
                                                    </label>
                                                    {showImg === '' && (
                                                        <div
                                                            onDrop={(e) => handleDrop(e, setFieldValue)}
                                                            onDragOver={handleDragOver}
                                                            style={{
                                                                border: `2px dashed #00000061`,
                                                                borderRadius: '5px',
                                                                padding: '20px',
                                                                textAlign: 'center',
                                                                cursor: 'pointer'
                                                            }}
                                                            className="md:h-12rem md:flex md:justify-content-center md:item-align-center md:align-items-center"
                                                        >
                                                            <label
                                                                htmlFor="fileInput"
                                                                style={{
                                                                    color: `#00000061`
                                                                }}
                                                            >
                                                                Drag and drop files here, or click to select files
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id="fileInput"
                                                                //   multiple
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                onChange={(event) => handleFileInputChange(event, setFieldValue)}
                                                            />
                                                            {/* <label >Select Files</label> */}
                                                        </div>
                                                    )}
                                                    {showImg !== '' && (
                                                        <div className="relative " style={{ width: '100px', height: '100px' }}>
                                                            <Image alt="example" src={showImg} width="130" height="130" preview className="mt-3" />
                                                            <div
                                                                className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                                style={{ right: '-35px', top: '5px', backgroundColor: '#f63939' }}
                                                                onClick={() => {
                                                                    setFieldValue('property_logo', null);
                                                                    setShowImg('');
                                                                }}
                                                            >
                                                                <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="field col-12 md:col-10 mb-1">
                                            <div className="grid p-fluid mt-1">
                                                <div className="field col-12 md:col-4 mb-0">
                                                    <label htmlFor="property_name" className="required">
                                                        Property Name
                                                    </label>
                                                    <InputText
                                                        id="property_name"
                                                        name="property_name"
                                                        placeholder="Enter Property Name"
                                                        type="text"
                                                        value={values?.property_name}
                                                        style={{
                                                            color: 'black'
                                                        }}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            const slug = generateSlug(e.target.value);
                                                            setFieldValue('domainName', `${slug}.complex360.in`);
                                                        }}
                                                        className={classNames({ 'p-invalid': errors.property_name && touched.property_name })}
                                                    />

                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.property_name && touched.property_name ? 'Please enter property name.' : ''}
                                                    </div>
                                                </div>
                                                <div className="field col-12 md:col-4 mb-0">
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
                                                </div>
                                                <div className="field col-12 md:col-4 mb-0">
                                                    <label htmlFor="propertyEmail">Property Email</label>
                                                    <InputText
                                                        id="propertyEmail"
                                                        name="propertyEmail"
                                                        placeholder="Enter Property Email"
                                                        type="text"
                                                        style={{
                                                            color: 'black'
                                                        }}
                                                        value={values?.propertyEmail}
                                                        onChange={handleChange}
                                                        className={classNames({ 'p-invalid': errors.propertyEmail && touched.propertyEmail })}
                                                    />
                                                    {/* <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.propertyEmail && touched.propertyEmail ? 'Please enter domain name.' : ''}
                                                    </div> */}
                                                </div>
                                                {/* <div className="field col-12 md:col-4 mb-1 relative">
                                                    <label htmlFor="pin_code" className="required">
                                                        Pin Code
                                                    </label>
                                                    <InputText
                                                        id="pin_code"
                                                        name="pin_code"
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
                                                        className={classNames({ 'p-invalid': errors.pin_code && touched.pin_code })}
                                                    />
                                                    {isLoadingPincode && <div className="text-sm text-gray-500 mt-1">Loading suggestions...</div>}
                                                    {showPincodeDropdown && pincodeSuggestions.length > 0 && (
                                                        <div
                                                            className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border"
                                                            style={{
                                                                maxHeight: '100px', // Limit dropdown height to 200px (~5 items)
                                                                overflowY: 'auto' // Enable vertical scrolling
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
                                                    <label htmlFor="propertyArea" className="required">
                                                        Area
                                                    </label>
                                                    <InputText
                                                        id="propertyArea"
                                                        name="propertyArea"
                                                        placeholder="Enter Area"
                                                        type="text"
                                                        style={{
                                                            color: 'black'
                                                        }}
                                                        value={values?.propertyArea}
                                                        onChange={(e) => {
                                                            const textOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                                                            handleChange({ target: { name: e.target.name, value: textOnly } });
                                                        }}
                                                        className={classNames({ 'p-invalid': errors.propertyArea && touched.propertyArea })}
                                                    />
                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.propertyArea && touched.propertyArea ? errors.propertyArea : ''}
                                                    </div>
                                                </div>

                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="property_city" className="required">
                                                        City
                                                    </label>
                                                    <InputText
                                                        id="property_city"
                                                        name="property_city"
                                                        placeholder="Enter  City"
                                                        type="text"
                                                        style={{
                                                            color: 'black'
                                                        }}
                                                        value={values?.property_city}
                                                        onChange={(e) => {
                                                            const textOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                                                            handleChange({ target: { name: e.target.name, value: textOnly } });
                                                        }}
                                                        className={classNames({ 'p-invalid': errors.property_city && touched.property_city })}
                                                    />
                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.property_city && touched.property_city ? errors.property_city : ''}
                                                    </div>
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="propertyState" className="required">
                                                        State
                                                    </label>
                                                    <InputText
                                                        id="propertyState"
                                                        name="propertyState"
                                                        placeholder="Enter State"
                                                        type="text"
                                                        style={{
                                                            color: 'black'
                                                        }}
                                                        value={values?.propertyState}
                                                        onChange={(e) => {
                                                            const textOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                                                            handleChange({ target: { name: e.target.name, value: textOnly } });
                                                        }}
                                                        className={classNames({ 'p-invalid': errors.propertyState && touched.propertyState })}
                                                    />
                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.propertyState && touched.propertyState ? errors.propertyState : ''}
                                                    </div>
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="propertyCountry" className="required">
                                                        Country
                                                    </label>
                                                    <InputText
                                                        id="propertyCountry"
                                                        name="propertyCountry"
                                                        placeholder="Enter Country"
                                                        type="text"
                                                        style={{
                                                            color: 'black'
                                                        }}
                                                        value={values?.propertyCountry}
                                                        onChange={(e) => {
                                                            const textOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                                                            handleChange({ target: { name: e.target.name, value: textOnly } });
                                                        }}
                                                        className={classNames({ 'p-invalid': errors.propertyCountry && touched.propertyCountry })}
                                                    />
                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.propertyCountry && touched.propertyCountry ? errors.propertyCountry : ''}
                                                    </div>
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="property_landmark">Landmark</label>
                                                    <InputText
                                                        id="property_landmark"
                                                        name="property_landmark"
                                                        placeholder="Enter Landmark"
                                                        type="text"
                                                        style={{
                                                            color: 'black'
                                                        }}
                                                        value={values?.property_landmark}
                                                        onChange={(e) => {
                                                            const textOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                                                            handleChange({ target: { name: e.target.name, value: textOnly } });
                                                        }}
                                                        className={classNames({ 'p-invalid': errors.property_landmark && touched.property_landmark })}
                                                    />
                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                        {errors.property_landmark && touched.property_landmark ? errors.property_landmark : ''}
                                                    </div>
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="property_status" className="required">
                                                        Property Status
                                                    </label>
                                                    <div className="flex flex-col mt-2" style={{ gap: '20px' }}>
                                                        <div className="flex items-center mb-2">
                                                            <RadioButton
                                                                inputId="statusG1"
                                                                name="property_status"
                                                                value="Active"
                                                                style={{
                                                                    color: 'black'
                                                                }}
                                                                onChange={(e) => {
                                                                    setFieldValue('property_status', 'Active');
                                                                }}
                                                                checked={values?.property_status === 'Active'}
                                                            />
                                                            <label htmlFor="statusG1" className="ml-2">
                                                                Active
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <RadioButton
                                                                inputId="statusG2"
                                                                name="property_status"
                                                                value="In-Active"
                                                                style={{
                                                                    color: 'black'
                                                                }}
                                                                onChange={(e) => {
                                                                    setFieldValue('property_status', 'In-Active');
                                                                }}
                                                                checked={values?.property_status === 'In-Active'}
                                                            />
                                                            <label htmlFor="statusG2" className="ml-2">
                                                                Inactive
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="property_address" className="required">
                                                        Property Address
                                                    </label>

                                                    <InputTextarea
                                                        rows="3"
                                                        cols="20"
                                                        // autoResize
                                                        id="property_address"
                                                        name="property_address"
                                                        placeholder="Enter Property Address"
                                                        type="text"
                                                        value={values?.property_address}
                                                        onChange={handleChange}
                                                        className={classNames({ 'p-invalid': errors.property_address && touched.property_address })}
                                                    />
                                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem' }}>
                                                        {errors.property_address && touched.property_address ? 'Please enter property address.' : ''}
                                                    </div>
                                                    {errors.property_address && touched.property_address ? <small className="p-invalid error">{'Please Enter Property Address'}</small> : null}
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <Divider align="center" className=" pt-0">
                                        <span className="p-tag text-base">Property Chairman Details</span>
                                    </Divider>
                                    <div className="grid p-fluid mt-1">
                                        <div className="field col-12 md:col-4 mb-4">
                                            <label htmlFor="name" className="required">
                                                Name
                                            </label>

                                            <InputText
                                                id="name"
                                                name="name"
                                                placeholder="Enter Name"
                                                type="text"
                                                value={values?.name}
                                                style={{
                                                    color: 'black'
                                                }}
                                                onChange={(e) => {
                                                    const textOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                                                    handleChange({ target: { name: e.target.name, value: textOnly } });
                                                }}
                                                className={classNames({ 'p-invalid': errors.name && touched.name })}
                                            />
                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                {errors.name && touched.name ? 'Please enter name.' : ''}
                                            </div>
                                            {/* {errors.name && touched.name ? <small className="p-invalid error">{'Please Enter Name'}</small> : null} */}
                                        </div>

                                        <div className="field col-12 md:col-4 mb-1">
                                            <label htmlFor="mobile_number" className="required">
                                                Mobile Number
                                            </label>
                                            <InputNumber
                                                id="mobile_number"
                                                type="tel"
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

                                        <div className="field col-12 md:col-4 mb-1">
                                            <label htmlFor="text" className="required">
                                                {isOtpSent ? 'Enter OTP' : 'Email Id'}
                                            </label>

                                            {!isOtpSent && (
                                                <div className="flex items-center relative" style={{ gap: '10px' }}>
                                                    {/* Email Input Field */}
                                                    <InputText
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        style={{ color: 'black' }}
                                                        placeholder="Enter Email"
                                                        value={values.email}
                                                        onChange={(e) => {
                                                            // Reset OTP verification when email changes
                                                            setIsOtpVerified(false);
                                                            setValue({ ...values, email: e.target.value });
                                                            handleChange(e);
                                                        }}
                                                        // className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                                                    />

                                                    {/* Send OTP Button */}
                                                    <Button type="button" onClick={handleSendEmail} className="p-button-outlined p-button-success mr-2 w-7rem" label="Send" />
                                                </div>
                                            )}
                                            {/*
                                            {isOtpSent && (
                                                <div className="flex items-center relative" style={{ gap: '10px' }}>
                                                    {/* OTP Input Field */}
                                            {/* <InputText
                                                        type="text"
                                                        name="otp"
                                                        id="otp"
                                                        style={{ color: 'black' }}
                                                        placeholder="Enter OTP"
                                                        value={otp}
                                                        onChange={handleOtpChange}
                                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none" */}
                                            {/* /> */}

                                            {/* Verify OTP Button */}
                                            {/* <Button type="button" onClick={handleVerifyOtp} className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" label="Verify" />
                                                </div>
                                            )} */}

                                            {/* Timer and Resend OTP */}
                                            {/* {isEmailTimerActive && emailTimeLeft > 0 && <div className="text-red-600 mt-1 text-sm">Please wait for {emailTimeLeft} seconds to resend.</div>} */}

                                            {/* {emailTimeLeft === 0 && (
                                                <div onClick={handleSendEmail} className="text-blue-600 cursor-pointer mt-1 text-sm">
                                                    Resend OTP
                                                </div>
                                            )} */}
                                            {isOtpSent && (
                                                <div className="flex items-center relative" style={{ gap: '10px' }}>
                                                    {/* OTP Input Field */}
                                                    <InputText
                                                        type="text"
                                                        name="otp"
                                                        id="otp"
                                                        style={{ color: 'black' }}
                                                        placeholder="Enter OTP"
                                                        value={otp}
                                                        onChange={handleOtpChange}
                                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                                                        disabled={isSendingOtp} // Disable input while sending
                                                    />

                                                    {/* Verify OTP Button */}
                                                    <Button type="button" onClick={handleVerifyOtp} className="p-button-outlined p-button-success mr-2 w-7rem" label={isSendingOtp ? 'Sending...' : 'Verify'} disabled={isSendingOtp} />
                                                </div>
                                            )}

                                            {/* Sending OTP State */}
                                            {isSendingOtp && (
                                                <div className="text-blue-800 mt-1 text-sm flex items-center">
                                                    {/* <div ></div> */}
                                                    Sending OTP...
                                                </div>
                                            )}

                                            {/* Timer and Resend OTP */}
                                            {isEmailTimerActive && emailTimeLeft > 0 && !isSendingOtp && <div className="text-red-600 mt-1 text-sm">Please wait for {emailTimeLeft} seconds to resend.</div>}
                                            {emailTimeLeft === 0 && (
                                                <div onClick={handleSendEmail} className="text-blue-600 cursor-pointer mt-1 text-sm">
                                                    Resend OTP
                                                </div>
                                            )}

                                            {/* Information Message */}
                                            {!isOtpSent && !isOtpVerified && !isLoading && (
                                                <div className="text-gray-600 text-sm mt-2">
                                                    <i className="pi pi-info-circle mr-2"></i>
                                                    Email verification is required to proceed further
                                                </div>
                                            )}

                                            {/* Loading Spinner */}
                                            {/* {isLoading && (
                                                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                                                    <div className="flex items-center">
                                                        <div className="w-14 h-10 border-4 border-[#449E48] border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        <span className="text-sm text-gray-600">Sending OTP...</span>
                                                    </div>
                                                </div>
                                            )} */}

                                            {/* Verified Status - Only shown when fully verified */}
                                            {isOtpVerified && !isOtpSent && (
                                                <div className="mt-2 text-[#449E48] flex items-center">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/5962/5962703.png" width="20" height="20" alt="Verified Icon" title="Verified Icon" className="mr-2" />
                                                    <span>Verified</span>
                                                </div>
                                            )}

                                            {/* Error Display */}
                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                {errors.email && touched.email ? errors.email : ''}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <Divider align="center" className=" pt-0">
                                        <span className="p-tag text-base">Subscription Details</span>
                                    </Divider>
                                    <div className="grid p-fluid mt-1">
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
                                                placeholder="Select Subscription Plan"
                                                onChange={handleChange}
                                                className={classNames({ 'p-invalid': errors.subscriptionPlan && touched.subscriptionPlan })}
                                            />
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
                                        </div>
                                    </div> */}

                                    <Divider align="center" className=" pt-0">
                                        <span className="p-tag text-base">Bank Details</span>
                                    </Divider>
                                    <div className="grid p-fluid mt-1">
                                        <div className="field col-12 md:col-4 mb-1">
                                            <label htmlFor="bankName" className="required">
                                                Bank Name
                                            </label>
                                            {/* <InputText
                                                id="bankName"
                                                name="bankName"
                                                placeholder="Enter Bank Name"
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
                                                {errors.bankName && touched.bankName ? 'Please enter bank name.' : ''}
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
                                                maxLength={11}
                                                style={{
                                                    color: 'black'
                                                }}
                                                onChange={handleChange}
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
                                                style={{
                                                    color: 'black'
                                                }}
                                                value={values?.branchName}
                                                onChange={handleChange}
                                                className={classNames({ 'p-invalid': errors.branchName && touched.branchName })}
                                            />
                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                                {errors.branchName && touched.branchName ? errors.branchName : ''}
                                            </div>
                                        </div>
                                        <div className="field col-12 md:col-4 mb-1">
                                            <label htmlFor="accountHolderName" className="required">
                                                Account Holder Name
                                            </label>
                                            <InputText
                                                id="accountHolderName"
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
                                                    onChange={(e) => {
                                                        setFieldValue('bankAccountNumber', e.target.value);
                                                        if (values.reEnterBankAccountNumber) {
                                                            setFieldValue('reEnterBankAccountNumber', '');
                                                            setFieldError('reEnterBankAccountNumber', '');
                                                        }
                                                    }}
                                                />
                                                <span className="p-inputgroup-addon">
                                                    <i className={`pi ${isAcconNumberVisible ? 'pi-eye' : 'pi-eye-slash'}`} onClick={togglePassword} style={{ cursor: 'pointer' }}></i>
                                                </span>
                                            </div>
                                            <ErrorMessage name="bankAccountNumber" component="div" className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }} />
                                        </div>

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

                                                        if (reEnterValue && reEnterValue !== values.bankAccountNumber) {
                                                            setFieldError('reEnterBankAccountNumber', 'Account numbers do not match');
                                                        } else {
                                                            setFieldError('reEnterBankAccountNumber', '');
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <ErrorMessage name="reEnterBankAccountNumber" component="div" className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }} />
                                        </div>
                                    </div>

                                    <div className="field col-12 md:col-6 mb-4">
                                        <div className="flex items-center space-x-2 justify-center " style={{ gap: '10px' }}>
                                            <Checkbox
                                                id="isPropertyLogin"
                                                name="isPropertyLogin"
                                                checked={values.isPropertyLogin}
                                                disabled={!values.propertyEmail || values.propertyEmail.trim() === ''} // Disable if propertyEmail is blank
                                                style={{
                                                    color: 'black',
                                                    cursor:"pointer"
                                                }}
                                                onChange={handleChange}
                                                className={classNames('p-checkbox', { 'p-invalid': errors.isPropertyLogin && touched.isPropertyLogin })}
                                            />
                                            <label htmlFor="isPropertyLogin" className="text-base">
                                                Do you want to login with property email?
                                            </label>
                                        </div>
                                        {errors.isPropertyLogin && touched.isPropertyLogin && <div className="text-red-500 text-xs mt-1">This field is required.</div>}
                                    </div>
                                </>
                            )}
                            {values?.property_type !== '' && (
                                <div className="grid p-fluid mt-3">
                                    <div className="field col-12 md:col-12 mb-1">
                                        <div className="flex justify-content-end">
                                            <Button type="button" label="Cancel" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/superadmin/properties')} />
                                            <Button
                                                label={values.id === '' ? 'Save' : 'Update'}
                                                type="submit"
                                                className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                                onClick={(e) => {
                                                    if (!isOtpVerified) {
                                                        e.preventDefault(); // Prevent form submission
                                                        toast.error('Please verify your email first and then save your property');
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
export default PropertyList;
