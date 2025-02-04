import { Form, Formik } from 'formik';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import components from '../..';
import Loader from '../../../../components/Loader';
import ReactQuill from 'react-quill';
import { getMeetingDetailById, getUserProperty, meetingCreateRequest, meetingUpdateRequest, meetingStatusUpdateRequest } from '../../../../redux/slice/AdminSlices/meetingSlice';
const CreateMeeting = () => {
    const { Button, Column, toast, DataTable, Checkbox, MultiSelect, InputTextarea, Calendar, InputText, classNames, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [submitted, setSubmitted] = useState(false);
    const { loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isLoading, meetingDetailById, userPropertyMeting } = useSelector((store) => store.meeting);
    const [agenda, setAgenda] = useState({ index: null, value: '' });
    const [agendaArray, setAgendaArray] = useState([]);
    const [dropDownArray, setDropDownArray] = useState([]);
    const [dropDownArrayAttendant, setDropDownArrayAttendant] = useState([]);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

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

    // Custom validator for time selection
    const isValidTimeSelection = (selectedDate, selectedTime) => {
        if (!selectedDate || !selectedTime) return false;

        const now = new Date();
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(selectedTime.getHours());
        selectedDateTime.setMinutes(selectedTime.getMinutes());
        selectedDateTime.setSeconds(0);
        selectedDateTime.setMilliseconds(0);

        return selectedDateTime >= now;
    };

    const [formValue, setFormValue] = useState({
        id: '',
        user_id: '',
        property_id: '',
        title: '',
        description: '',
        date: '',
        time: '',
        end_time: '',
        location: '',
        invited_member: [],
        attended_member: []
    });

    // const SignupSchema = Yup.object().shape({
    //     title: Yup.string().trim().nullable().required('Please enter title.'),
    //     description: Yup.string().trim().nullable().required('Please enter description.'),
    //     date: Yup.string().trim().nullable().required('Please select date.'),
    //     time: Yup.mixed()
    //         .test('valid-time', 'Please select a valid start time', function (value) {
    //             const { date } = this.parent;
    //             return isValidTimeSelection(setDefaultDate(date), value);
    //         })
    //         .required('Please select start time.'),
    //     end_time: Yup.mixed()
    //         .test('valid-end-time', 'Please select a valid end time', function (value) {
    //             const { date, time } = this.parent;
    //             // Ensure end time is after start time
    //             if (!value || !time) return false;

    //             const startDateTime = new Date(setDefaultDate(date));
    //             startDateTime.setHours(time.getHours());
    //             startDateTime.setMinutes(time.getMinutes());

    //             const endDateTime = new Date(setDefaultDate(date));
    //             endDateTime.setHours(value.getHours());
    //             endDateTime.setMinutes(value.getMinutes());

    //             return endDateTime > startDateTime;
    //         })
    //         .required('Please select end time.'),
    //     location: Yup.string().trim().nullable().required('Please enter location.'),
    //     invited_member: Yup.array().min(1, 'Please select at least one member.').required('Please select invite member.').nullable()
    // });
    const SignupSchema = Yup.object().shape({
        title: Yup.string().trim().nullable().required('Please enter title.'),
        description: Yup.string().trim().nullable().required('Please enter description.'),
        date: Yup.string().trim().nullable().required('Please select date.'),
        // time: Yup.mixed()
        //     .test('valid-time', 'Please select a valid start time', function (value) {
        //         // Skip time validation when editing an existing meeting
        //         if (this.parent.id) return true;

        //         const { date } = this.parent;
        //         return isValidTimeSelection(setDefaultDate(date), value);
        //     })
        //     .required('Please select start time.'),
        // end_time: Yup.mixed()
        //     .test('valid-end-time', 'Please select a valid end time', function (value) {
        //         // Skip end time validation when editing an existing meeting
        //         if (this.parent.id) return true;

        //         const { date, time } = this.parent;
        //         // Ensure end time is after start time
        //         if (!value || !time) return false;

        //         const startDateTime = new Date(setDefaultDate(date));
        //         startDateTime.setHours(time.getHours());
        //         startDateTime.setMinutes(time.getMinutes());

        //         const endDateTime = new Date(setDefaultDate(date));
        //         endDateTime.setHours(value.getHours());
        //         endDateTime.setMinutes(value.getMinutes());

        //         return endDateTime > startDateTime;
        //     })
        //     .required('Please select end time.'),
        time: Yup.mixed()
            .test('valid-time', 'Please select a valid start time', function (value) {
                if (this.parent.id) return true;
                const { date } = this.parent;
                return isValidTimeSelection(setDefaultDate(date), value);
            })
            .required('Please select start time.'),
        end_time: Yup.mixed()
            .test('valid-end-time', 'End time must be after start time', function (value) {
                if (this.parent.id) return true;
                const { date, time } = this.parent;
                if (!value || !time) return false;

                // Convert to comparable time strings
                const startTime = moment(time).format('HH:mm');
                const endTime = moment(value).format('HH:mm');

                return endTime > startTime;
            })
            .required('Please select end time.'),
        location: Yup.string().trim().nullable().required('Please enter location.'),
        invited_member: Yup.array().min(1, 'Please select at least one member.').required('Please select invite member.').nullable()
    });
    const SignupSchema2 = Yup.object().shape({
        title: Yup.string().trim().nullable().required('Please enter title.'),
        description: Yup.string().trim().nullable().required('Please enter description.'),
        date: Yup.string().trim().nullable().required('Please select date.'),
        end_time: Yup.string().trim().nullable().required('Please select time.'),
        location: Yup.string().trim().nullable().required('Please enter location.'),
        invited_member: Yup.array().min(1, 'Please select at least one member.').required('Please select invite member.').nullable()
        // attended_member: Yup.array().min(1, 'Please select at least one member.').required('Please select attended member.').nullable()

        // location: Yup.string().trim().min(10, 'Mobile no must be at least 10 digit number.').max(10, 'Mobile no must be at least 10 digit number.').required('Please enter mobile number')
    });
    const breadcrumbItems = [
        {
            label: params.id ? 'Edit Meeting' : 'Create Meeting'
        }
    ];
    const breadcrumbHome = {
        label: 'Meetings',
        command: () => {
            navigate(`/property-management/meeting`);
        }
    };
    useEffect(() => {
        if (isCreated) {
            navigate('/property-management/meeting');
        }
    }, [isCreated]);
    useEffect(() => {
        if (params.id) {
            dispatch(getMeetingDetailById(params?.id));
            setCanEdit(true);
        }
    }, [params.id]);
    // useEffect(() => {
    //     if (meetingDetailById && meetingDetailById?._id) {
    //         let formVal = { ...formValue };
    //         formVal.id = meetingDetailById?._id;
    //         formVal.title = meetingDetailById?.title;
    //         formVal.description = meetingDetailById?.description;
    //         formVal.location = meetingDetailById?.location;
    //         formVal.date = seteditDefault(meetingDetailById?.date);
    //         formVal.time = changeFormateForEdit(meetingDetailById?.time);
    //         formVal.end_time = changeFormateForEdit(meetingDetailById?.end_time);
    //         formVal.invited_member = meetingDetailById?.invited_member.map((member) => member.member_id);
    //         formVal.attended_member = meetingDetailById?.attended_member.map((member) => member.member_id);
    //         setFormValue(formVal);
    //         // let collect = meetingDetailById?.invited_member.map(member => ({
    //         //     value: member.member_id,
    //         //     label: member.name
    //         // }));
    //         let agenda = meetingDetailById?.agenda.map((x) => x.topic);
    //         setAgendaArray(agenda);
    //         // setDropDownArrayAttendant(collect ? collect : [])
    //     }
    // }, [meetingDetailById]);
    useEffect(() => {
        if (meetingDetailById && meetingDetailById?._id) {
            let formVal = { ...formValue };
            formVal.id = meetingDetailById?._id;
            formVal.title = meetingDetailById?.title;
            formVal.description = meetingDetailById?.description;
            formVal.location = meetingDetailById?.location;
            formVal.date = seteditDefault(meetingDetailById?.date);

            // Ensure consistent time parsing
            formVal.time = changeFormateForEdit(meetingDetailById?.time);
            formVal.end_time = changeFormateForEdit(meetingDetailById?.end_time);

            formVal.invited_member = meetingDetailById?.invited_member.map((member) => member.member_id);
            formVal.attended_member = meetingDetailById?.attended_member.map((member) => member.member_id);

            setFormValue(formVal);
        }
    }, [meetingDetailById]);

    useEffect(() => {
        dispatch(getUserProperty());
    }, [dispatch]);
    useEffect(() => {
        let formVal = { ...formValue };
        formVal.user_id = loginDetails?._id;
        formVal.property_id = loginDetails?.user_connect_with_property_id;
        setFormValue(formVal);
    }, []);
    useEffect(() => {
        if (userPropertyMeting && userPropertyMeting.length > 0) {
            let uniqueData = userPropertyMeting.filter((item, index, self) => index === self.findIndex((t) => t.value === item.value));
            setDropDownArray(uniqueData);
        }
    }, [userPropertyMeting]);
    const changeFormateForEdit = (val) => {
        // If val is already a Date object, return it
        if (val instanceof Date) return val;

        // Parse the time string, handling both 12-hour and 24-hour formats
        const timeFormats = [
            'hh:mm:ss A', // 12-hour format with AM/PM
            'HH:mm:ss', // 24-hour format
            'hh:mm A' // 12-hour format without seconds
        ];

        let parsedTime = null;
        for (let format of timeFormats) {
            parsedTime = moment(val, format, true);
            if (parsedTime.isValid()) break;
        }

        if (!parsedTime || !parsedTime.isValid()) {
            console.error('Invalid time format:', val);
            return null;
        }

        // Create a new Date object with the parsed time
        const date = new Date();
        date.setHours(parsedTime.hours());
        date.setMinutes(parsedTime.minutes());
        date.setSeconds(0);

        return date;
    };

    const changeInTimeFormatter = (val) => {
        try {
            let time = new Date(val);
            let formattedTime = time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // Use 24-hour format
            });
            return formattedTime + ':00';
        } catch (error) {
            console.log(error);
        }
    };
    const seteditDefault = (val) => {
        try {
            const inputDateString = val;
            const [year, month, day] = inputDateString.split('-').map(Number);
            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
            return formattedDate;
        } catch (error) {
            console.log(error);
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
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Meeting' : 'Create Meeting'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={SignupSchema}
                    // validationSchema={params?.id ? SignupSchema2 : SignupSchema}
                    enableReinitialize
                    // onSubmit={(values) => {
                    //     setSubmitted(true);
                    //     setTimeout(() => {
                    //         setSubmitted(false);
                    //     }, 5000);
                    //     let flag = false;
                    //     let sendData = {
                    //         user_id: values?.user_id,
                    //         property_id: values?.property_id,
                    //         title: values?.title,
                    //         description: values?.description,
                    //         date: values?.date,
                    //         time: moment(values?.time).format('hh:mm:ss A'),
                    //         end_time: moment(values?.end_time).format('hh:mm:ss A'),
                    //         location: values?.location,
                    //         invited_member: values?.invited_member
                    //             .map((id) => {
                    //                 let found = dropDownArray.find((item) => item.value === id);
                    //                 if (found)
                    //                     return {
                    //                         member_id: found.value,
                    //                         name: found.name
                    //                     };
                    //             })
                    //             .filter((member) => member !== undefined)
                    //     };
                    //     if (values?.id !== null) {
                    //         sendData.attended_member = values?.attended_member
                    //             .map((id) => {
                    //                 let found = dropDownArray.find((item) => item.value === id);
                    //                 if (found)
                    //                     return {
                    //                         member_id: found.value,
                    //                         name: found.label
                    //                     };
                    //             })
                    //             .filter((member) => member !== undefined);
                    //     }
                    //     if (showAdditionalFields && params?.id && agendaArray.length === 0) {
                    //         flag = true;
                    //         toast.error('Please add agenda.', {
                    //             style: {
                    //                 marginTop: '4rem'
                    //             }
                    //         });
                    //     } else if (agendaArray.length > 0) {
                    //         sendData.agenda = agendaArray.map((x) => {
                    //             return {
                    //                 topic: x
                    //             };
                    //         });
                    //     }
                    //     if (!flag) {
                    //         values.id === '' && dispatch(meetingCreateRequest(sendData));
                    //         values.id !== '' && dispatch(meetingUpdateRequest(values.id, sendData));
                    //     }
                    // }}
                    // onSubmit={(values) => {
                    //     setSubmitted(true);
                    //     setTimeout(() => {
                    //         setSubmitted(false);
                    //     }, 5000);

                    //     let flag = false;
                    //     let sendData = {
                    //         user_id: values?.user_id,
                    //         property_id: values?.property_id,
                    //         title: values?.title,
                    //         description: values?.description,
                    //         date: values?.date,
                    //         time: moment(values?.time).format('hh:mm:ss A'),
                    //         end_time: moment(values?.end_time).format('hh:mm:ss A'),
                    //         location: values?.location,
                    //         invited_member: values?.invited_member
                    //             .map((id) => {
                    //                 let found = dropDownArray.find((item) => item.value === id);
                    //                 if (found)
                    //                     return {
                    //                         member_id: found.value,
                    //                         name: found.name
                    //                     };
                    //             })
                    //             .filter((member) => member !== undefined)
                    //     };

                    //     if (values?.id !== null) {
                    //         sendData.attended_member = values?.attended_member
                    //             .map((id) => {
                    //                 let found = dropDownArray.find((item) => item.value === id);
                    //                 if (found)
                    //                     return {
                    //                         member_id: found.value,
                    //                         name: found.label
                    //                     };
                    //             })
                    //             .filter((member) => member !== undefined);
                    //     }

                    //     // Check if agenda and attended members are available
                    //     const hasAgendaAndMembers = values?.attended_member?.length > 0 && agendaArray.length > 0;

                    //     if (showAdditionalFields && params?.id && agendaArray.length === 0) {
                    //         flag = true;
                    //         toast.error('Please add agenda.', {
                    //             style: {
                    //                 marginTop: '4rem'
                    //             }
                    //         });
                    //     } else if (agendaArray.length > 0) {
                    //         sendData.agenda = agendaArray.map((x) => {
                    //             return {
                    //                 topic: x
                    //             };
                    //         });
                    //     }

                    //     if (!flag) {
                    //         if (values.id === '') {
                    //             // Create request
                    //             dispatch(meetingCreateRequest(sendData));

                    //             // If agenda and members are present, directly call the update status API
                    //             if (hasAgendaAndMembers) {
                    //                 dispatch(meetingStatusUpdateRequest(null, { status_type: 1 }));
                    //             }
                    //         } else {
                    //             // Update request
                    //             dispatch(meetingUpdateRequest(values.id, sendData));

                    //             // If agenda and members are present, directly call the update status API
                    //             if (hasAgendaAndMembers) {
                    //                 dispatch(meetingStatusUpdateRequest(values.id, { status_type: 1 }));
                    //             }
                    //         }
                    //     }
                    // }}
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);

                        let flag = false;
                        let sendData = {
                            user_id: values?.user_id,
                            property_id: values?.property_id,
                            title: values?.title,
                            description: values?.description,
                            date: values?.date,
                            time: moment(values?.time).format('hh:mm:ss A'),
                            end_time: moment(values?.end_time).format('hh:mm:ss A'),
                            location: values?.location,
                            invited_member: values?.invited_member
                                .map((id) => {
                                    let found = dropDownArray.find((item) => item.value === id);
                                    if (found)
                                        return {
                                            member_id: found.value,
                                            name: found.name
                                        };
                                })
                                .filter((member) => member !== undefined)
                        };
                        const startTime = moment(values.time).format('HH:mm');
                        const endTime = moment(values.end_time).format('HH:mm');
                        if (endTime <= startTime) {
                            toast.error('End time must be after start time');
                            return;
                        }
                        if (values?.id !== null) {
                            sendData.attended_member = values?.attended_member
                                .map((id) => {
                                    let found = dropDownArray.find((item) => item.value === id);
                                    if (found)
                                        return {
                                            member_id: found.value,
                                            name: found.label
                                        };
                                })
                                .filter((member) => member !== undefined);
                        }
                        // Check if agenda and attended members are available
                        const hasAgendaAndMembers = values?.attended_member?.length > 0 && agendaArray.length > 0;
                        sendData.listType = hasAgendaAndMembers ? 1 : 0;
                        if (showAdditionalFields && params?.id && agendaArray.length === 0) {
                            flag = true;
                            toast.error('Please add agenda.', {
                                style: {
                                    marginTop: '4rem'
                                }
                            });
                        } else if (agendaArray.length > 0) {
                            sendData.agenda = agendaArray.map((x) => {
                                return {
                                    topic: x
                                };
                            });
                        }
                        if (!flag) {
                            if (values.id === '') {
                                // Create request
                                dispatch(meetingCreateRequest(sendData));
                                // If agenda and members are present, directly call the update status API
                                if (hasAgendaAndMembers) {
                                    dispatch(meetingStatusUpdateRequest(null, { status_type: 1 }));
                                }
                            } else {
                                // Update request
                                dispatch(meetingUpdateRequest(values.id, sendData));
                                // If agenda and members are present, directly call the update status API
                                if (hasAgendaAndMembers) {
                                    dispatch(meetingStatusUpdateRequest(values.id, { status_type: 1 }));
                                }
                            }
                        }
                    }}
                >
                    {/* {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form> */}
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            {params?.id && (
                                <div className="grid p-fluid mt-1">
                                    <div className="field col-12  mb-1">
                                        <div>
                                            <Checkbox
                                                checked={canEdit === false}
                                                inputId="ingredient1"
                                                onChange={() => {
                                                    setCanEdit(canEdit ? false : true);
                                                }}
                                            ></Checkbox>
                                            <label className="ml-2 mt-2" htmlFor="ingredient1">{`Do You Want To Edit?`}</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="title" className="required">
                                        Title
                                    </label>
                                    <InputText id="title" name="title" placeholder="Enter Title" type="text" value={values?.title} onChange={handleChange} className={classNames({ 'p-invalid': errors.title && touched.title })} disabled={canEdit} />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.title && touched.title ? errors.title : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="location" className="required">
                                        Venue
                                    </label>
                                    <InputText
                                        id="location"
                                        name="location"
                                        placeholder="Enter Venue"
                                        type="text"
                                        value={values?.location}
                                        onChange={handleChange}
                                        disabled={canEdit}
                                        className={classNames({ 'p-invalid': errors.location && touched.location })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.location && touched.location ? errors.location : ''}
                                    </div>
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="date" className="required">
                                        Date
                                    </label>
                                    <Calendar
                                        id="date"
                                        name="date"
                                        placeholder="Please Select Date"
                                        value={values?.date ? setDefaultDate(values?.date) : ''}
                                        dateFormat="dd/mm/yy"
                                        minDate={new Date()}
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                            setFieldValue('date', formattedDate);
                                        }}
                                        disabled={canEdit}
                                        className={classNames({ 'p-invalid': errors.date && touched.date })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.date && touched.date ? errors.date : ''}
                                    </div>
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
                                        onChange={handleChange}
                                        timeOnly
                                        hourFormat="12"
                                        minDate={currentTime}
                                        className={classNames({ 'p-invalid': errors.time && touched.time })}
                                        disabled={canEdit}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.time && touched.time ? errors.time : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="end_time" className="required">
                                        End Time
                                    </label>
                                    <Calendar
                                        id="end_time"
                                        name="end_time"
                                        placeholder="Please Select End Time"
                                        value={values?.end_time}
                                        onChange={handleChange}
                                        timeOnly
                                        hourFormat="12"
                                        minDate={currentTime}
                                        className={classNames({ 'p-invalid': errors.end_time && touched.end_time })}
                                        disabled={canEdit}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.end_time && touched.end_time ? errors.end_time : ''}
                                    </div>
                                </div> */}
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="date" className="required">
                                        Date
                                    </label>
                                    <Calendar
                                        id="date"
                                        name="date"
                                        placeholder="Please Select Date"
                                        value={values?.date ? setDefaultDate(values?.date) : ''}
                                        dateFormat="dd/mm/yy"
                                        minDate={new Date()} // Prevent selecting past dates
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

                                            // Reset time fields when date changes
                                            setFieldValue('date', formattedDate);
                                            setFieldValue('time', '');
                                            setFieldValue('end_time', '');
                                        }}
                                        disabled={canEdit}
                                        className={classNames({ 'p-invalid': errors.date && touched.date })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.date && touched.date ? errors.date : ''}
                                    </div>
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-0">
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
                                            // Reset end time if it's before or equal to start time
                                            if (values.end_time && e.value) {
                                                const startTime = e.value;
                                                const endTime = values.end_time;
                                                if (endTime.getHours() < startTime.getHours() || (endTime.getHours() === startTime.getHours() && endTime.getMinutes() <= startTime.getMinutes())) {
                                                    setFieldValue('end_time', '');
                                                }
                                            }
                                        }}
                                        timeOnly
                                        hourFormat="12"
                                        // For today's date, only allow current or future times
                                        minTime={values.date && setDefaultDate(values.date).toDateString() === new Date().toDateString() ? currentTime : undefined}
                                        className={classNames({ 'p-invalid': errors.time && touched.time })}
                                        disabled={canEdit || !values.date}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.time && touched.time ? errors.time : ''}
                                    </div>
                                </div> */}
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
                                        disabled={canEdit || !values.date}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.time && touched.time ? errors.time : ''}
                                    </div>
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="end_time" className="required">
                                        End Time
                                    </label>
                                    <Calendar
                                        id="end_time"
                                        name="end_time"
                                        placeholder="Please Select End Time"
                                        value={values?.end_time}
                                        onChange={(e) => setFieldValue('end_time', e.value)}
                                        timeOnly
                                        hourFormat="12"
                                        // For today's date, only allow current or future times
                                        minTime={values.time ? values.time : values.date && setDefaultDate(values.date).toDateString() === new Date().toDateString() ? currentTime : undefined}
                                        className={classNames({ 'p-invalid': errors.end_time && touched.end_time })}
                                        disabled={canEdit || !values.time}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.end_time && touched.end_time ? errors.end_time : ''}
                                    </div>
                                </div> */}
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="end_time" className="required">
                                        End Time
                                    </label>
                                    <Calendar
                                        id="end_time"
                                        name="end_time"
                                        placeholder="Please Select End Time"
                                        value={values?.end_time}
                                        onChange={(e) => {
                                            const startTime = moment(values.time).format('HH:mm');
                                            const endTime = moment(e.value).format('HH:mm');
                                            if (endTime > startTime) {
                                                setFieldValue('end_time', e.value);
                                            } else {
                                                toast.warn('End time must be after start time');
                                            }
                                        }}
                                        timeOnly
                                        hourFormat="12"
                                        minTime={values.time}
                                        className={classNames({ 'p-invalid': errors.end_time && touched.end_time })}
                                        disabled={canEdit || !values.time}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.end_time && touched.end_time ? errors.end_time : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="invited_member" className="required">
                                        Invite Member
                                    </label>
                                    <MultiSelect
                                        id="invited_member"
                                        value={values?.invited_member}
                                        name="invited_member"
                                        onChange={(e) => {
                                            setFieldValue('invited_member', e.target.value && e.target.value.length > 0 ? e.target.value : []);
                                        }}
                                        options={dropDownArray ? dropDownArray : []}
                                        optionLabel="label"
                                        optionValue="value"
                                        filter
                                        placeholder="Select Invite Member"
                                        // maxSelectedLabels={3}
                                        className={classNames({ 'p-invalid': errors.invited_member && touched.invited_member })}
                                        // display="chip"
                                        showClear
                                        disabled={canEdit}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.invited_member && touched.invited_member ? errors?.invited_member : ''}
                                    </div>
                                </div>
                                <div className={`field col-12 md:col-12 mb-0`}>
                                    <label htmlFor="description" className="required">
                                        Description
                                    </label>
                                    <ReactQuill
                                        theme="snow"
                                        value={values?.description}
                                        onChange={(e) => {
                                            setFieldValue('description', e === '<p><br></p>' ? '' : e);
                                        }}
                                        className={classNames({ 'p-invalid': errors.description && touched.description })}
                                        disabled={canEdit} // Disables the editor based on canEdit flag
                                        style={{
                                            height: 'auto',
                                            overflow: 'auto'
                                        }}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.description && touched.description ? errors.description : ''}
                                    </div>
                                </div>
                            </div>
                            {/* {params?.id && <div className={`field col-12 md:col-4 mb-0`}></div>} */}

                            {params?.id && (
                                <>
                                    <div className="flex align-items-center mt-2 gap-2">
                                        <Checkbox
                                            checked={showAdditionalFields}
                                            inputId="additional-fields-checkbox"
                                            onChange={() => {
                                                setShowAdditionalFields(!showAdditionalFields);
                                            }}
                                        />
                                        <label htmlFor="additional-fields-checkbox">Add Meeting Agenda and Attended Members</label>
                                    </div>

                                    {/* Show additional fields and agenda array only if checkbox is checked */}
                                    {showAdditionalFields && params?.id && (
                                        <>
                                            <div className="flex justify-between mt-2">
                                                <div className="field col-12 md:col-8 mb-0">
                                                    <div className="grid p-fluid mt-1">
                                                        <div className="field col-8 mb-0">
                                                            <label htmlFor="agenda">Meeting Agenda</label>
                                                            <InputTextarea
                                                                id="agenda"
                                                                placeholder="Enter Meeting Agenda"
                                                                rows="2"
                                                                cols="30"
                                                                value={agenda?.value}
                                                                onChange={(e) => {
                                                                    let setData = { ...agenda };
                                                                    setData.value = e.target.value;
                                                                    setAgenda(setData);
                                                                }}
                                                                style={{ resize: 'none' }}
                                                            />
                                                        </div>
                                                        <div className="field col-4 mb-0 flex align-items-end">
                                                            <div className="h-3rem w-full">
                                                                <Button
                                                                    icon="pi pi-times"
                                                                    type="button"
                                                                    className="p-button-outlined p-button-danger mr-2 mb-2 h-2rem"
                                                                    onClick={() => {
                                                                        setAgenda({ index: null, value: '' });
                                                                    }}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    icon="pi pi-plus"
                                                                    className="p-button-outlined p-button-success mr-2 mb-2 h-2rem"
                                                                    onClick={() => {
                                                                        if (agenda.index === null && agenda.value !== '') {
                                                                            let setData = [...agendaArray];
                                                                            setData.push(agenda.value);
                                                                            setAgendaArray(setData);
                                                                            setAgenda({ index: null, value: '' });
                                                                        } else if (agenda.value !== '' && agenda.index !== null) {
                                                                            let setData = [...agendaArray];
                                                                            setData[agenda.index] = agenda.value;
                                                                            setAgendaArray(setData);
                                                                            setAgenda({ index: null, value: '' });
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="field col-12 md:col-4 mb-0">
                                                    <div className="grid p-fluid mt-1">
                                                        <div className="field col-12 mb-0">
                                                            <label htmlFor="attended_member">Attended Member</label>
                                                            <MultiSelect
                                                                id="attended_member"
                                                                value={values?.attended_member}
                                                                name="attended_member"
                                                                onChange={(e) => {
                                                                    setFieldValue('attended_member', e.target.value && e.target.value.length > 0 ? e.target.value : []);
                                                                }}
                                                                options={dropDownArray ? dropDownArray : []}
                                                                optionLabel="label"
                                                                optionValue="value"
                                                                filter
                                                                placeholder="Select Attended Member"
                                                                showClear
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Show agenda array only if checkbox is checked */}
                                    {showAdditionalFields && agendaArray.length > 0 && (
                                        <div className="p-2">
                                            <ul className="pl-4 ">
                                                {agendaArray.map((x, i) => (
                                                    <li className="pb-2" key={i}>
                                                        <div className="flex align-items-center">
                                                            <div>{x}</div>
                                                            <div className="ml-3">
                                                                <Button
                                                                    icon="pi pi-trash"
                                                                    type="button"
                                                                    className="p-button-rounded p-button-text  p-button-danger p-0"
                                                                    id="delete-icons"
                                                                    tooltip="Delete"
                                                                    tooltipOptions={{ position: 'bottom' }}
                                                                    onClick={() => {
                                                                        let setData = [...agendaArray];
                                                                        setData.splice(i, 1);
                                                                        setAgendaArray(setData);
                                                                        setAgenda({ index: null, value: '' });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Cancel" type="button" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/meeting')} />
                                <Button label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
export default CreateMeeting;
