import components from '../..';
import Loader from '../../../../components/Loader';
import toast from 'react-hot-toast';
import { AutoComplete } from 'primereact/autocomplete';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { vendorCreateRequest, updateVendorAssignRequest, getVendorDataById, getVendorTypeData } from '../../../../redux/slice/AdminSlices/vendorSlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';

const VendorAdd = () => {
    const { BreadCrumb, Button, InputText, Image, InputNumber, InputTextarea, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
    const params = useParams();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, vendorDataById, isCreated, vendorData, vendorTypeData } = useSelector((state) => state.vendor);
    const [submitted, setSubmitted] = useState(false);
    const [showFile, setShowFile] = useState(null);
    const [allWork, setAllWork] = useState([]);
    const [pincode, setPincode] = useState('');
    const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
    const [isLoadingPincode, setIsLoadingPincode] = useState(false);
    const [showPincodeDropdown, setShowPincodeDropdown] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState(null);
    const [formValue, setFormValue] = useState({
        id: '',
        vendor_name: '',
        work_type: '',
        pincode: null,
        mobile_number: null,
        description: '',
        vendor_address: '',
        file: null
    });
    const SignupSchema = Yup.object().shape({
        vendor_name: Yup.string().trim().nullable().required('Please enter vendor name.'),
        work_type: Yup.string().trim().nullable().required('Please enter work type.'),
        pincode: Yup.string().trim().nullable().min(6, 'Pincode no must be at least 6 digit no.').max(6, 'Mobile no must be at least 6 digit no.').required('Please enter pincode.'),
        description: Yup.string().trim().nullable().required('Please enter vendor description.'),
        vendor_address: Yup.string().trim().nullable().required('Please enter vendor address.'),
        mobile_number: Yup.string().trim().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number.')
    });
    useEffect(() => {
        dispatch(getVendorTypeData());
    }, [dispatch]);
    useEffect(() => {
        if (vendorTypeData && vendorTypeData?.data.length > 0) {
            const uniqueWorkTypes = [...new Set(vendorTypeData?.data.map((vendor) => vendor))];
            let collect = [];
            uniqueWorkTypes.forEach((e) => {
                collect.push({ name: e });
            });
            setAllWork(collect);
        }
    }, [vendorTypeData]);
    useEffect(() => {
        if (isCreated) navigate('/property-management/vendor');
    }, [isCreated]);
    useEffect(() => {
        if (params.id) {
            dispatch(getVendorDataById(params.id));
        }
    }, [params.id]);
    useEffect(() => {
        if (params.id && vendorDataById && vendorDataById._id) {
            let setData = {
                id: vendorDataById?._id,
                vendor_name: vendorDataById?.name,
                work_type: vendorDataById?.work_type,
                pincode: vendorDataById?.pincode,
                mobile_number: vendorDataById?.mobile_number,
                description: vendorDataById?.work_description,
                vendor_address: vendorDataById?.vendor_address,
                file: vendorDataById?.vendor_profile_image ? vendorDataById?.vendor_profile_image : null
            };
            vendorDataById?.vendor_profile_image && setShowFile(`${vendorDataById?.vendor_profile_image}`);
            setFormValue(setData);
        }
    }, [vendorDataById]);
    const breadcrumbHome = {
        label: 'Vendors',
        command: () => {
            navigate('/property-management/vendor');
            // decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //     decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //     navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };

    const breadcrumbItems = [
        {
            label: params?.id ? 'Edit Create' : 'Create Vendor'
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
        setPincode(newPincode); // Update the pincode state
        fetchPincodeSuggestions(newPincode); // Call fetchPincodeSuggestions with the new pincode
    };

    const handleAddressSelection = (suggestion, setFieldValue) => {
        // Concatenate address details
        const fullAddress = `${suggestion.details.officeName}, ${suggestion.details.taluk}, ${suggestion.details.state}, India`;

        // Set pincode and full address
        setFieldValue('pincode', suggestion.details.pincode);
        setFieldValue('vendor_address', fullAddress);

        // Optional: You can also set other address-related fields if needed
        setFieldValue('propertyArea', suggestion.details.officeName);
        setFieldValue('property_city', suggestion.details.taluk);
        setFieldValue('propertyState', suggestion.details.state);
        setFieldValue('propertyCountry', 'India');

        // Hide the dropdown after selection
        setShowPincodeDropdown(false);

        // Optional: Reset the pincode input to the selected pincode
        setPincode(suggestion.details.pincode);
    };
    const handleUpload = async (event, setFieldValue) => {
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
                setFieldValue('file', event.target.files[0]);
                setShowFile(URL.createObjectURL(event.target.files[0]));
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
    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredCountries;

            if (!event.query.trim().length) {
                _filteredCountries = [...allWork];
            } else {
                _filteredCountries = allWork.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredCountries(_filteredCountries);
        }, 250);
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Vendor' : 'Create Vendor'}</h5>
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
                        let sendData = {
                            name: values?.vendor_name,
                            work_type: values?.work_type,
                            pincode: values?.pincode,
                            work_description: values?.description,
                            mobile_number: values?.mobile_number,
                            vendor_address: values?.vendor_address,
                            file: values?.file !== null ? values?.file : ''
                        };
                        values.id === '' && dispatch(vendorCreateRequest(sendData));
                        values.id !== '' && dispatch(updateVendorAssignRequest(values.id, sendData));
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="vendor_name" className="required">
                                        Vendor Name
                                    </label>
                                    <InputText
                                        id="vendor_name"
                                        name="vendor_name"
                                        placeholder="Enter Vendor Name"
                                        type="text"
                                        value={values?.vendor_name}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.vendor_name && touched.vendor_name })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.vendor_name && touched.vendor_name ? errors.vendor_name : ''}
                                    </div>
                                    {/* {errors.vendor_name && touched.vendor_name ? <small className="p-invalid error">{errors.vendor_name}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="work_type" className="required">
                                        Vendor Work Type
                                    </label>
                                    <AutoComplete
                                        id="work_type"
                                        name="work_type"
                                        field="name"
                                        placeholder="Enter Vendor Work Type"
                                        value={values?.work_type}
                                        suggestions={filteredCountries}
                                        completeMethod={search}
                                        className={classNames({ 'p-invalid': errors.work_type && touched.work_type })}
                                        onChange={(e) => {
                                            let check = typeof e.value === 'object';
                                            setFieldValue('work_type', check ? e?.value?.name : e.value);
                                        }}
                                    />
                                    {/* <InputText
                                        id="work_type"
                                        name="work_type"
                                        placeholder="Enter Vendor Work Type"
                                        type="text"
                                        value={values?.work_type}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.work_type && touched.work_type })}
                                    /> */}
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.work_type && touched.work_type ? errors.work_type : ''}
                                    </div>
                                    {/* {errors.work_type && touched.work_type ? <small className="p-invalid error">{errors.work_type}</small> : null} */}
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
                                        useGrouping={false}
                                        maxLength={10}
                                        onValueChange={(e) => {
                                            setFieldValue('mobile_number', e.value === null ? '' : e.value.toString());
                                        }}
                                        className={classNames({ 'p-invalid': errors.mobile_number && touched.mobile_number })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.mobile_number && touched.mobile_number ? errors.mobile_number : ''}
                                    </div>
                                    {/* {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null} */}
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-1 relative">
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
                                        {errors.pincode && touched.pincode ? errors.pincode : ''}
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
                                    <label htmlFor="vendor_address" className="required">
                                        Vendor Address
                                    </label>
                                    <InputTextarea
                                        rows="3"
                                        cols="20"
                                        id="vendor_address"
                                        name="vendor_address"
                                        placeholder="Enter Vendor Address"
                                        type="text"
                                        value={values?.vendor_address}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.vendor_address && touched.vendor_address })}
                                        style={{ resize: 'none' }} // Disable resizing
                                    />

                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.vendor_address && touched.vendor_address ? errors?.vendor_address : ''}
                                    </div>
                                    {/* {errors.vendor_address && touched.vendor_address ? <small className="p-invalid error">{errors?.vendor_address}</small> : null} */}
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="description" className="required">
                                        Vendor Profile Description
                                    </label>

                                    <InputTextarea
                                        rows="3"
                                        cols="20"
                                        id="description"
                                        name="description"
                                        placeholder="Enter Vendor Profile Description"
                                        type="text"
                                        maxLength={250}
                                        value={values?.description}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.description && touched.description })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.description && touched.description ? errors?.description : ''}
                                    </div>
                                </div> */}
                                <div className="field col-12 md:col-12 mb-1">
                                    <label htmlFor="description" className="required">
                                        Vendor Profile Description
                                    </label>

                                    <ReactQuill
                                        theme="snow"
                                        value={values?.description}
                                        onChange={(e) => {
                                            setFieldValue('description', e === '<p><br></p>' ? '' : e);
                                        }}
                                        className={classNames({ 'p-invalid': errors.description && touched.description })}
                                        style={{
                                            height: 'auto',
                                            overflow: 'auto',
                                            width: '100%' // Ensure it takes full width
                                        }}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.description && touched.description ? errors?.description : ''}
                                    </div>
                                </div>

                                {values?.file === null && (
                                    <div className="field col-12 md:col-4 mb-1 pt-5">
                                        <div className="file-input-upload">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                            <label for="fileInput" className="label">
                                                <span>Upload Profile Image...</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                                {values?.file !== null && (
                                    <div className="flex align-items-center field col-12 md:col-4 mb-1 pt-5">
                                        {/* <Image src={showFile} alt="Image" width="100" height="100" preview />
                                        <div className="ml-1">
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
                                            </div> */}
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
                                <div className="p-invalid error text-xl mt-4" style={{ minHeight: '1.1rem', marginTop: '3px', width: '80rem' }}>
                                    {'Notes :- '}
                                    <span className="text-base">{'Only JPEG, JPG, PNG files are supported.'}</span>
                                </div>
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/vendor')} />
                                    <Button disabled={submitted} label={values.id === '' ? 'Save' : 'Update'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
export default VendorAdd;
