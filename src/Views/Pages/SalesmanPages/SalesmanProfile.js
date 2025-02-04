import components from '..';
import toast from 'react-hot-toast';
import jwtDecode from 'jwt-decode';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
// import blankuser from '../../../assets/images/blank-user.jpg';
import Loader from '../../../../src/components/Loader';
import { updatePasswordRequest, profileUpdateRequest, getProfileDetailsRequest } from '../../../redux/slice/AdminSlices/authSlice';

const Profile = () => {
    const { useNavigate, Image, BreadCrumb, Dropdown, Password, InputNumber, TabPanel, TabView, classNames, InputText, useEffect, Button, React, useDispatch, useSelector, Link, useState } = components;
    const { token, profileDetails, isUpdate, isChanged, isLoading, loginDetails } = useSelector((state) => state.auth);
    // const [submitted, setSubmitted] = useState();
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [disabledBTN, setDisabledBTN] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const [decode, setDecode] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [showImg, setShowImg] = useState("");
    const [formValue, setFormValue] = useState({
        id: '',
        name: '',
        gender: '',
        email: '',
        mobile_number: '',
        alternate_number: '',
        property_logo: null,
    });
    const [formPassword, setFormPassword] = useState({
        curPwd: '',
        newPwd: '',
        conPwd: ''
    });
    const SignupSchema = Yup.object().shape({
        name: Yup.string().trim().nullable().required('Please enter name'),
        gender: Yup.string().trim().nullable().required('Please select gender'),
        email: Yup.string().trim().nullable().required('Please enter email').email('Please enter valid email.'),
        mobile_number: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number'),
        alternate_number: Yup.string().trim().nullable().min(10, 'Alternate no must be at least 10 digit no.').max(10, 'Alternate no must be at least 10 digit number.')
    });
    const SignupSchema2 = Yup.object().shape({
        curPwd: Yup.string()
            .nullable()
            .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/, 'Password must be atleast 8 letters.Include with 1 uppercase character,1 special character,1 number')
            .required('Current password is required'),
        newPwd: Yup.string()
            .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/, 'Password must be atleast 8 letters.Include with 1 uppercase character,1 special character,1 number')
            .required('New password is required'),
        conPwd: Yup.string()
            .oneOf([Yup.ref('newPwd'), null], 'Passwords must match')
            .required('Confirm password is required')
    });

    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            loginDetails?.role === 'Super Admin' ?
                navigate('/superadmin/dashboard') : navigate(`/property-management/dashboard`)

            // : decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            // decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            // // navigate(decode.role === 'User' ? '/dashboard' : `/${decode ? decode?.property_name && decode?.property_name.replace(' ', '-').toLowerCase() : ''}/dashboard`);
            // navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Profile'
        }
    ];
    useEffect(() => {
        decodeURI();
    }, [dispatch, isUpdate, isChanged]);
    useEffect(() => {
        if (profileDetails) {
            let setData = {
                id: profileDetails?._id,
                name: profileDetails?.name,
                gender: profileDetails?.gender,
                email: profileDetails?.email,
                mobile_number: profileDetails?.mobile_number,
                alternate_number: profileDetails?.alternate_number ? profileDetails?.mobile_number : '',
                property_logo: profileDetails?.user_profile ? profileDetails?.user_profile : "",
            };
            profileDetails?.user_profile && setShowImg(`${BASE_URL_API}user-profile/${profileDetails?.user_profile}`);
            setActiveIndex(0);
            setFormValue(setData);
            setDisabledBTN(true);
        }
    }, [profileDetails]);
    const decodeURI = async () => {
        // let decodeData = await jwtDecode(token);
        if (token && loginDetails) {
            dispatch(getProfileDetailsRequest(loginDetails._id));

        }
        // setDecode(decodeData);
    };
    const handleDrop = (event, setFieldValue) => {
        event.preventDefault();
        let file = event.dataTransfer.files[0];
        const str = event.dataTransfer.files[0]?.name;
        const fileSize = event.dataTransfer.files[0]?.size;
        const maxFileSize = 10 * 1024 * 1024;
        const substr = ['.jpg', '.jpeg', '.png'];
        let flag = false;
        substr.forEach((a) => {
            if (str.includes(a)) {
                flag = true;
            }
        });
        if (file.type.startsWith("image/") && flag) {
            if (fileSize <= maxFileSize) {
                setFieldValue("property_logo", file);
                setShowImg(URL.createObjectURL(file));
                setDisabledBTN(false);
            } else {
                toast.error(`Accept only file size less then 10mb`, {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } else {
            toast.error('Only accepts .png, .jpg, and .jpeg files.', {
                style: {
                    marginTop: '4rem'
                }
            });
        }
    };
    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const handleFileInputChange = (event, setFieldValue) => {
        let file = event.target.files[0];
        const str = event.target.files[0]?.name;
        const substr = ['.jpg', '.jpeg', '.png'];
        const fileSize = event.target.files[0]?.size;
        const maxFileSize = 10 * 1024 * 1024;
        let flag = false;
        substr.forEach((a) => {
            if (str.includes(a)) {
                flag = true;
            }
        });
        if (file.type.startsWith("image/") && flag) {
            if (fileSize <= maxFileSize) {
                setFieldValue("property_logo", file);
                setShowImg(URL.createObjectURL(file));
                setDisabledBTN(false);
            } else {
                toast.error(`Accept only file size less then 10mb`, {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
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
        } else {
            toast.error('Only accepts .png, .jpg, and .jpeg files.', {
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Profile</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="profile-main-component profile">
                <div className="grid crud-demo p-2 ">
                    <div className="card col-12">
                        <h5 className="profile p-3 mb-1">Account Settings</h5>
                        <TabView activeIndex={activeIndex} onTabChange={(e) => { setActiveIndex(e.index); activeIndex === 1 && decodeURI(); }}>
                            <TabPanel header="Account" leftIcon="pi pi-user mr-2" className="mx-2">
                                <Formik
                                    initialValues={formValue}
                                    validationSchema={SignupSchema}
                                    onSubmit={(values) => {
                                        setSubmitted(true);
                                        setTimeout(() => {
                                            setSubmitted(false);
                                        }, 5000);
                                        let sendData = {
                                            name: values?.name,
                                            email: values?.email,
                                            gender: values?.gender,
                                            mobile_number: values?.mobile_number,
                                            user_profile: values?.property_logo ? values?.property_logo : "",
                                        };
                                        if (decode?.role === 'User') {
                                            sendData.alternate_number = values?.alternate_number ? values?.alternate_number : '';
                                        }
                                        values?.id !== '' && dispatch(profileUpdateRequest(values?.id, sendData));
                                    }}
                                >
                                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                                        <Form>
                                            <div className="grid p-fluid mt-1">
                                                <div className="field col-12  mb-1">
                                                    <label htmlFor="mobile_number" className="">
                                                        Profile Image
                                                    </label>
                                                    {showImg === "" && <div
                                                        onDrop={(e) => handleDrop(e, setFieldValue)}
                                                        onDragOver={handleDragOver}
                                                        style={{
                                                            border: `2px dashed #00000061`,
                                                            borderRadius: "5px",
                                                            padding: "20px",
                                                            textAlign: "center",
                                                            cursor: "pointer",
                                                        }}
                                                        className='md:h-12rem md:flex md:justify-content-center md:item-align-center md:align-items-center w-12rem'
                                                    >
                                                        <label
                                                            htmlFor="fileInput"
                                                            style={{
                                                                color: `#00000061`,
                                                            }}
                                                        >
                                                            Drag and drop files here, or click to select files
                                                        </label>
                                                        <input
                                                            type="file"
                                                            id="fileInput"
                                                            //   multiple
                                                            accept="image/*"
                                                            style={{ display: "none" }}
                                                            onChange={(event) => handleFileInputChange(event, setFieldValue)}
                                                        />
                                                        {/* <label >Select Files</label> */}
                                                    </div>
                                                    }
                                                    {showImg !== "" && (
                                                        <div
                                                            className="relative "
                                                            style={{ width: "100px", height: "100px" }}
                                                        >
                                                            <Image
                                                                alt="example"
                                                                src={showImg}
                                                                width="100"
                                                                height="100"
                                                                preview
                                                                className="mt-3"
                                                            />
                                                            <div
                                                                className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                                style={{ right: "-11px", top: "5px", backgroundColor: "#f63939" }}
                                                                onClick={() => {
                                                                    setFieldValue("property_logo", null);
                                                                    setShowImg("");
                                                                    setDisabledBTN(false);
                                                                }}
                                                            >
                                                                {/* <X style={{ stroke: "#fff" }} size="18" /> */}
                                                                <i className="pi pi-times" style={{ fontSize: '1rem', color: "#fff" }}></i>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="name" className="required">
                                                        Name
                                                    </label>
                                                    <InputText id="name" name="name" placeholder="Enter name" type="text" value={values?.name} onChange={(e) => { setFieldValue("name", e.target.value); setDisabledBTN(false); }} className={classNames({ 'p-invalid': errors.name && touched.name })} />
                                                    {errors.name && touched.name ? <small className="p-invalid error">{errors.name}</small> : null}
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="gender" className="required">
                                                        Select gender
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
                                                        placeholder="Select gender"
                                                        type="text"
                                                        value={values?.gender}
                                                        onChange={(e) => {
                                                            setFieldValue('gender', e.target.value);
                                                            setDisabledBTN(false)
                                                        }}
                                                        className={classNames({ 'p-invalid': errors.gender && touched.gender })}
                                                    />

                                                    {errors.gender && touched.gender ? <small className="p-invalid error">{errors.gender}</small> : null}
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="email" className="required">
                                                        Enter email
                                                    </label>
                                                    <InputText id="email" name="email" placeholder="Enter email" type="text" value={values?.email} onChange={(e) => { setFieldValue("email", e.target.value); setDisabledBTN(false); }} className={classNames({ 'p-invalid': errors.email && touched.email })} />
                                                    {errors.email && touched.email ? <small className="p-invalid error">{errors.email}</small> : null}
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="mobile_number" className="required">
                                                        Enter mobile number
                                                    </label>
                                                    <InputNumber
                                                        id="mobile_number"
                                                        type="tel"
                                                        placeholder="Enter mobile number"
                                                        name="mobile_number"
                                                        value={values?.mobile_number}
                                                        useGrouping={false}
                                                        maxLength={10}
                                                        // onValueChange={(e) => {
                                                        //     setFieldValue('mobile_number', e.value === null ? null : e.value.toString());
                                                        //     setDisabledBTN(false)
                                                        // }}
                                                        onChange={(e) => {
                                                            setFieldValue('mobile_number', e.value === null ? null : e.value.toString());
                                                            setDisabledBTN(false)
                                                        }}
                                                        className={classNames({ 'p-invalid': errors.mobile_number && touched.mobile_number })}
                                                    />

                                                    {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null}
                                                </div>
                                                {decode?.role === 'User' && (
                                                    <div className="field col-12 md:col-4 mb-1">
                                                        <label htmlFor="alternate_number" className="">
                                                            Enter alternate number
                                                        </label>
                                                        <InputNumber
                                                            id="alternate_number"
                                                            type="tel"
                                                            placeholder="Enter alternate number"
                                                            name="alternate_number"
                                                            value={values?.alternate_number}
                                                            useGrouping={false}
                                                            maxLength={10}
                                                            onValueChange={(e) => {
                                                                setFieldValue('alternate_number', e.value === null ? null : e.value.toString());
                                                                setDisabledBTN(false)
                                                            }}
                                                            className={classNames({ 'p-invalid': errors.alternate_number && touched.alternate_number })}
                                                        />

                                                        {errors.alternate_number && touched.alternate_number ? <small className="p-invalid error">{errors.alternate_number}</small> : null}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid p-fluid mt-1">
                                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                                    {/* <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" /> */}
                                                    <Button
                                                        disabled={submitted || disabledBTN}
                                                        label="Update"
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
                            </TabPanel>

                            <TabPanel header="Security" leftIcon="pi pi-lock mr-2">
                                <Formik
                                    initialValues={formPassword}
                                    validationSchema={SignupSchema2}
                                    onSubmit={(values) => {
                                        setSubmitted(true);
                                        setTimeout(() => {
                                            setSubmitted(false);
                                        }, 5000);
                                        let sendData = {
                                            id: loginDetails?._id,
                                            current_password: values?.curPwd,
                                            password: values?.newPwd,
                                            confirm_password: values?.conPwd,
                                            email: loginDetails?.email
                                        };
                                        dispatch(updatePasswordRequest(sendData));
                                    }}
                                >
                                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                                        <Form>
                                            <div className="grid p-fluid mt-1">
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="curPwd" className="required">
                                                        Current password
                                                    </label>
                                                    <Password
                                                        id="curPwd"
                                                        name="curPwd"
                                                        placeholder="Enter current password"
                                                        type="text"
                                                        value={values?.curPwd}
                                                        onChange={handleChange}
                                                        className={classNames({ 'p-invalid': errors.curPwd && touched.curPwd })}
                                                        feedback={false}
                                                        toggleMask
                                                    />
                                                    {errors.curPwd && touched.curPwd ? <small className="p-invalid error">{errors.curPwd}</small> : null}
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="newPwd" className="required">
                                                        New password
                                                    </label>
                                                    <Password
                                                        id="newPwd"
                                                        name="newPwd"
                                                        placeholder="Enter new password"
                                                        type="text"
                                                        value={values?.newPwd}
                                                        onChange={handleChange}
                                                        className={classNames({ 'p-invalid': errors.newPwd && touched.newPwd })}
                                                        feedback={false}
                                                        toggleMask
                                                    />
                                                    {errors.newPwd && touched.newPwd ? <small className="p-invalid error">{errors.newPwd}</small> : null}
                                                </div>
                                                <div className="field col-12 md:col-4 mb-1">
                                                    <label htmlFor="conPwd" className="required">
                                                        Confirm new password
                                                    </label>
                                                    <Password
                                                        id="conPwd"
                                                        name="conPwd"
                                                        placeholder="Enter confirm new password"
                                                        type="text"
                                                        value={values?.conPwd}
                                                        onChange={handleChange}
                                                        className={classNames({ 'p-invalid': errors.conPwd && touched.conPwd })}
                                                        feedback={false}
                                                        toggleMask
                                                    />
                                                    {errors.conPwd && touched.conPwd ? <small className="p-invalid error">{errors.conPwd}</small> : null}
                                                </div>
                                            </div>
                                            <div className="grid p-fluid mt-1">
                                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                                    <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => setActiveIndex(0)} />
                                                    <Button
                                                        disabled={submitted}
                                                        label="Update"
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
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
