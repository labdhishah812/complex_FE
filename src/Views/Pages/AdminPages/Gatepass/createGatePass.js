import React, { useState, useEffect } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { InputTextarea } from 'primereact/inputtextarea';
import components from '../..';
import { useParams } from 'react-router-dom';
import LoaderUi from '../../../../components/Loader';
import toast from 'react-hot-toast';
import moment from 'moment-timezone';
import { gatePassCreateRequest, getGatePassById, updateGatePassAssignRequest } from '../../../../redux/slice/AdminSlices/gatepassSlice';
const GatePassAdd = () => {
    const { InputSwitch, BreadCrumb, Button, InputText, Image, Dropdown, Calendar, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
    const params = useParams();
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [showFile, setShowFile] = useState(null);
    const { isCreated, vendorDataById, isLoading: isLoading1, errors } = useSelector((store) => store.gatePass);
    const [visitorTypes] = useState([
        { label: 'Guest', value: 'guest' },
        { label: 'Employee', value: 'employee' },
        { label: 'Vendor', value: 'vendor' }
    ]);
    const [formValue, setFormValue] = useState({
        name: '',
        mobile_number: '',
        visitor_type: '',
        purpose: '',
        email: '',
        valid_from: null,
        valid_to: null,
        number_of_person: '',
        profile: null,
        time: ''
    });
    useEffect(() => {
        if (isCreated) {
            navigate('/property-management/gatepass');
        }
    }, [isCreated]);
     // Function to get the current time with minute precision
     const getCurrentTimeWithMinutePrecision = () => {
        const now = new Date();
        now.setSeconds(0);
        now.setMilliseconds(0);
        return now;
    };
    const [currentTime, setCurrentTime] = useState(getCurrentTimeWithMinutePrecision());

    useEffect(() => {
        // Update the current time periodically to keep it accurate
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTimeWithMinutePrecision());
        }, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);
    const GatePassSchema = Yup.object().shape({
        name: Yup.string().trim().required('Please enter name'),
        mobile_number: Yup.string().trim().min(10, 'Mobile no must be at least 10 digit no.').max(10, 'Mobile no must be at least 10 digit no.').required('Please enter mobile number'),
        visitor_type: Yup.string().required('Please select visitor type'),
        purpose: Yup.string().trim().required('Please enter purpose'),
        email: Yup.string().email('Invalid email format').required('Please enter email'),
        valid_from: Yup.date().required('Valid from date is required'),
        valid_to: Yup.date().required('Valid to date is required'),
        number_of_person: Yup.number().required('Please enter number of persons'),
        time: Yup.string().required('Please enter time'),
        profile: Yup.mixed()
            .test('fileSize', 'File too large', (value) => {
                // Skip validation if no new file is being uploaded
                if (!value || typeof value === 'string') return true;
                return value.size <= 5 * 1024 * 1024;
            })
            .test('fileType', 'Unsupported file type', (value) => {
                // Skip validation if no new file is being uploaded
                if (!value || typeof value === 'string') return true;
                const supportedTypes = ['image/jpeg', 'image/png'];
                return supportedTypes.includes(value.type);
            })
    });
    useEffect(() => {
        if (params.id) {
            dispatch(getGatePassById(params.id));
        }
    }, [params.id, dispatch]);
    useEffect(() => {
        if (params.id && vendorDataById && vendorDataById._id) {
            let setData = {
                id: vendorDataById._id,
                name: vendorDataById?.name,
                email: vendorDataById?.email,
                mobile_number: vendorDataById?.mobile_number,
                valid_from: vendorDataById?.valid_from ? new Date(vendorDataById.valid_from) : null,
                valid_to: vendorDataById?.valid_to ? new Date(vendorDataById.valid_to) : null,
                is_active: vendorDataById?.is_active || true,
                visitor_type: vendorDataById?.visitor_type,
                profile: vendorDataById?.visitor_profile ? vendorDataById?.visitor_profile : null,
                number_of_person: vendorDataById?.number_of_person,
                // Convert the time string to Date object
                time: vendorDataById?.time ? moment(vendorDataById.time, 'hh:mm:ss A').toDate() : null,
                purpose: vendorDataById?.purpose
            };
            vendorDataById?.visitor_profile && setShowFile(`${BASE_URL_API}visitorprofile/${vendorDataById.visitor_profile}`);
            setFormValue(setData);
        }
    }, [vendorDataById]);
    const breadcrumbHome = {
        label: 'Gate Pass',
        command: () => navigate('/property-management/gatepass')
    };
    const breadcrumbItems = [
        {
            label: params?.id ? 'Edit Gate Pass' : 'Create Gate Pass'
        }
    ];
    const handleUpload = (event, setFieldValue) => {
        try {
            const file = event.target.files[0];
            const supportedTypes = ['.jpg', '.jpeg', '.png'];
            const fileExt = '.' + file.name.split('.').pop().toLowerCase();

            if (supportedTypes.includes(fileExt)) {
                setFieldValue('profile', file);
                setShowFile(URL.createObjectURL(file));
            } else {
                toast.error('Only .png, .jpg, and .jpeg files are allowed.', {
                    style: { marginTop: '4rem' }
                });
            }
        } catch (error) {
            console.error('File upload error:', error);
        }
    };
    const setDefaultDate = (val) => {
        try {
            const inputDateString = val;
            const [day, month, year] = inputDateString.split('/').map(Number);
            const dateObj = new Date(year, month - 1, day);
            const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
            const localTime = dateObj.getTime() - timezoneOffset;
            const indiaOffset = 330 * 60000;
            const indiaTime = localTime + indiaOffset;
            const indiaDate = new Date(indiaTime);
            return new Date(indiaDate.toString());
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative min-h-full">
            <LoaderUi isLoading={isLoading1} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Gate Pass' : 'Create Gate Pass'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={GatePassSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        console.log('Form Submit Values:', values); // Log 1
                        setSubmitted(true);
                        const formData = new FormData();
                        // Form data append
                        formData.append('name', values.name.trim());
                        formData.append('mobile_number', values.mobile_number.trim());
                        formData.append('visitor_type', values.visitor_type);
                        formData.append('purpose', values.purpose.trim());
                        formData.append('email', values.email.trim());
                        // if (values.valid_from) {
                        //     const validFrom = new Date(values.valid_from);
                        //     validFrom.setMinutes(validFrom.getMinutes() + validFrom.getTimezoneOffset());
                        //     formData.append('valid_from', validFrom.toISOString().split('T')[0]);
                        // }
                        // if (values.valid_to) {
                        //     const validTo = new Date(values.valid_to);
                        //     validTo.setMinutes(validTo.getMinutes() + validTo.getTimezoneOffset());
                        //     formData.append('valid_to', validTo.toISOString().split('T')[0]);
                        // }
                        if (values.valid_from) {
                            const validFrom = new Date(values.valid_from);
                            // Format date as YYYY-MM-DD without timezone adjustment
                            const formattedValidFrom = validFrom.getFullYear() + '-' + String(validFrom.getMonth() + 1).padStart(2, '0') + '-' + String(validFrom.getDate()).padStart(2, '0');
                            formData.append('valid_from', formattedValidFrom);
                        }

                        if (values.valid_to) {
                            const validTo = new Date(values.valid_to);
                            // Format date as YYYY-MM-DD without timezone adjustment
                            const formattedValidTo = validTo.getFullYear() + '-' + String(validTo.getMonth() + 1).padStart(2, '0') + '-' + String(validTo.getDate()).padStart(2, '0');
                            formData.append('valid_to', formattedValidTo);
                        }
                        formData.append('number_of_person', values.number_of_person);
                        formData.append('time', moment(values?.time).format('hh:mm:ss A'));
                        // Check if profile is being updated
                        if (values.profile instanceof File) {
                            formData.append('profile', values.profile);
                        }
                        if (!values.id) {
                            dispatch(gatePassCreateRequest(formData));
                        } else {
                            dispatch(updateGatePassAssignRequest(values.id, formData));
                        }
                        setTimeout(() => setSubmitted(false), 5000);
                    }}
                >
                    {({ values, setFieldValue, handleChange, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="name" className="required">
                                        Name
                                    </label>
                                    <InputText
                                        id="name"
                                        name="name"
                                        placeholder="Enter Name"
                                        value={values.name}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.name && touched.name
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.name && touched.name ? errors.name : ''}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="mobile_number" className="required">
                                        Mobile Number
                                    </label>
                                    <InputText
                                        id="mobile_number"
                                        name="mobile_number"
                                        placeholder="Enter Mobile Number"
                                        value={values.mobile_number}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setFieldValue('mobile_number', value);
                                            }
                                        }}
                                        maxLength={10}
                                        className={classNames({
                                            'p-invalid': errors.mobile_number && touched.mobile_number
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.mobile_number && touched.mobile_number ? errors.mobile_number : ''}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="email" className="required">
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.email && touched.email
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.email && touched.email ? errors.email : ''}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="visitor_type" className="required">
                                        Visitor Type
                                    </label>
                                    <Dropdown
                                        id="visitor_type"
                                        name="visitor_type"
                                        value={values.visitor_type}
                                        options={visitorTypes}
                                        onChange={(e) => {
                                            setFieldValue('visitor_type', e.value);
                                        }}
                                        placeholder="Select Visitor Type"
                                        className={classNames({
                                            'p-invalid': errors.visitor_type && touched.visitor_type
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.visitor_type && touched.visitor_type ? errors.visitor_type : ''}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="valid_from" className="required">
                                        Gate Pass valid From
                                    </label>
                                    <Calendar
                                        id="valid_from"
                                        name="valid_from"
                                        placeholder="Selete Valid Date"
                                        value={values.valid_from}
                                        onChange={(e) => setFieldValue('valid_from', e.value)}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                        className={classNames({
                                            'p-invalid': errors.valid_from && touched.valid_from
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.valid_from && touched.valid_from ? errors.valid_from : ''}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="valid_to" className="required">
                                        Gate Pass valid To
                                    </label>
                                    <Calendar
                                        id="valid_to"
                                        name="valid_to"
                                        placeholder="Selete Valid Date"
                                        value={values.valid_to}
                                        onChange={(e) => setFieldValue('valid_to', e.value)}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                        minDate={values.valid_from}
                                        className={classNames({
                                            'p-invalid': errors.valid_to && touched.valid_to
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.valid_to && touched.valid_to ? errors.valid_to : ''}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="time" className="required">
                                        Start Time
                                    </label>
                                    <Calendar
                                        id="time"
                                        name="time"
                                        placeholder="Please Select Start Time"
                                        value={values?.time}
                                        onChange={(e) => {
                                            setFieldValue('time', e.value);
                                            // Reset end time if it's before or equal to the new start time
                                            if (values.end_time) {
                                                const startTime = moment(e.value).format('HH:mm');
                                                const endTime = moment(values.end_time).format('HH:mm');
                                                if (endTime <= startTime) {
                                                    setFieldValue('end_time', '');
                                                }
                                            }
                                        }}
                                        timeOnly
                                        hourFormat="12"
                                        // For today's date, only allow current or future times
                                        minTime={values.date && setDefaultDate(values.date).toDateString() === new Date().toDateString() ? currentTime : undefined}
                                        className={classNames({ 'p-invalid': errors.time && touched.time })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.time && touched.time ? errors.time : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="number_of_person" className="required">
                                        Number of Persons
                                    </label>
                                    <InputText
                                        id="number_of_person"
                                        name="number_of_person"
                                        type="text"
                                        placeholder="Enter Number of Persons"
                                        value={values.number_of_person}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.number_of_person && touched.number_of_person
                                        })}
                                    />
                                    <div className="p-invalid error text-xs">{errors.number_of_person && touched.number_of_person ? errors.number_of_person : ''}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="purpose" className="required">
                                        Purpose
                                    </label>
                                    <InputTextarea
                                        rows="2"
                                        cols="30"
                                        id="purpose"
                                        name="purpose"
                                        placeholder="Enter Purpose"
                                        value={values.purpose}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.purpose && touched.purpose
                                        })}
                                        style={{ resize: 'none' }}
                                    />
                                    <div className="p-invalid error text-xs">{errors.purpose && touched.purpose ? errors.purpose : ''}</div>
                                </div>
                                {values.profile === null && (
                                    <div className="field col-12 md:col-4 mb-1 pt-5">
                                        <div className="file-input-upload">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                            <label htmlFor="fileInput" className="label">
                                                <span>Upload Visitor's Profile Image...</span>
                                            </label>
                                        </div>
                                        <div className="p-invalid error text-xs mt-1">{errors.profile && touched.profile ? errors.profile : ''}</div>
                                    </div>
                                )}
                                {values.profile !== null && (
                                    <div className="flex align-items-center field col-12 md:col-4 mb-1 pt-5">
                                        <div className="relative" style={{ width: '100px', height: '100px' }}>
                                            <Image alt="Profile" src={showFile} width="100" height="100" preview />
                                            <div
                                                className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                onClick={() => {
                                                    setFieldValue('profile', null);
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
                                    <span className="text-base">{'Only JPEG, JPG, PNG files are supported. Max file size is 5MB.'}</span>
                                </div>
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/gatepass')} />
                                    <Button disabled={submitted} label={values.id ? 'Update' : 'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
export default GatePassAdd;
