// import components from '..';
// import jwtDecode from 'jwt-decode';
// // import bglogos from '../../../assets/images/login.png';
// // import loginlogo from '../../../assets/images/mainlogo.png';
// import { adminLoginRequest, handleResetState, adminRoleRequest } from '../../../redux/slice/AdminSlices/authSlice';
// const Login = () => {
//     const { useNavigate, Cookie, Checkbox, Dropdown, classNames, InputText, useEffect, Button, React, useDispatch, useSelector, Link, useState } = components;
//     // const { token } = useSelector((store) => store.auth);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [passwordType, setPasswordType] = useState('password');
//     const [submitted, setSubmitted] = useState(false);
//     const [isRemember, setIsRemember] = useState(false);
//     const [IsPropertyShow, setIsPropertyShow] = useState(false);
//     const [errorRole, setErrorRole] = useState(false);
//     const [localError, setLocalError] = useState(false);
//     const cookies = Cookie();
//     const { token, errors, isLoading, roleData, roleName, isPropertyCollect, propertyDrop, propertyDetails, roleDrop, loginPageUserName, isLoggedIn, loginDetails } = useSelector((state) => state.auth);
//     const [values, setValues] = useState({
//         email: '',
//         password: '',
//         property_id: '',
//         role_id: '',
//         platform: 'windows',
//     });
//     const togglePassword = () => {
//         if (passwordType === 'password') {
//             setPasswordType('text');
//             return;
//         }
//         setPasswordType('password');
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             onSubmit();
//         }
//     };
//     const onWithRoleSubmit = () => {
//         try {
//             dispatch(handleResetState());
//             if (values?.property_id !== '') {
//                 dispatch(adminLoginRequest(values));
//                 if (isRemember) {
//                     cookies.set(
//                         'adminData',
//                         { email: values.email, password: values.password },
//                         {
//                             path: '/',
//                             secure: true,
//                             httpOnly: false
//                         }
//                     );
//                 } else if (cookies.get('adminData')) {
//                     cookies.remove('adminData');
//                 }
//             } else {
//                 setErrorRole(true);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const onSubmit = () => {
//         if (values.email !== "" && values.password !== "") {
//             dispatch(handleResetState());
//             setSubmitted(true);
//             setTimeout(() => {
//                 setSubmitted(false);
//             }, 5000);

//             let sendData = {
//                 email: values.email,
//                 password: values.password,
//                 platform: values.platform
//             };
//             if (isRemember) {
//                 localStorage.setItem("rememberSoc", JSON.stringify({ email: values.email, password: values.password }));
//                 // cookies.set(
//                 //     'adminData',
//                 //     { email: values.email, password: values.password },
//                 //     {
//                 //         path: '/login',
//                 //         secure: true,
//                 //         httpOnly: false
//                 //     }
//                 // );
//             } else if (localStorage.getItem("rememberSoc")) {
//                 localStorage.removeItem("rememberSoc");
//             }
//             dispatch(adminLoginRequest(sendData));
//         } else {
//             setLocalError(true)
//         }
//         // toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
//     };
//     // useEffect(() => {
//     //     if (loginDetails) {
//     //     }
//     // }, [loginDetails])

//     useEffect(() => {
//         if (localStorage.getItem("rememberSoc")) {
//             const rememberSoc = JSON.parse(localStorage.getItem("rememberSoc"));
//             setIsRemember(true);
//             const cookieValue = cookies.get('adminData');
//             values.email = rememberSoc.email;
//             values.password = rememberSoc.password;
//         }
//         if (token && loginDetails) {
//             console.log(loginDetails , "login")
//             if (loginDetails?.role === "Super Admin") {
//                 navigate('/superadmin/dashboard');
//             }
//             else if(loginDetails?.role === 'Salesman'){
//                 navigate('/hyy');
//             }   else if (loginDetails?.role_permissions.length !== 0) {
//                 navigate('/property-management/dashboard');
//             }
//         }
//     }, []);
//     useEffect(() => {
//         if (token && (loginDetails || propertyDetails)) {
//             if (loginDetails?.role === "Super Admin") {
//                 navigate('/superadmin/dashboard');
//             } else if (propertyDetails && propertyDetails.length > 0) {
//                 navigate('/property-management/myproperties');
//             } else if (loginDetails?.role_permissions.length !== 0) {
//                 navigate('/property-management/dashboard');
//             }
//         }
//     }, [token]);
//     // const decodeURI = async () => {
//     //     try {
//     //         let decodeData = await jwtDecode(token);
//     //         if (decodeData?.role === 'Chairman') {
//     //             navigate(`/${decodeData ? decodeData?.property_name && decodeData?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vizard`);
//     //         } else if (decodeData?.role === 'Super Admin') {
//     //             navigate('/superadmin/dashboard');
//     //         } else if (decodeData?.role) {
//     //             navigate(`/${decodeData ? decodeData?.property_name && decodeData?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
//     //         }
//     //     } catch (error) {
//     //         console.log(error);
//     //     }
//     // };
//     // useEffect(() => {
//     //     decodeURI();
//     // }, [roleName]);
//     useEffect(() => {
//         if (isPropertyCollect) {
//             setIsPropertyShow(true);
//         }
//     }, [isPropertyCollect]);
//     // console.log(roleDrop, 'roleDrop');
//     return (
//         <div className="pages-body login-page flex flex-column">
//             <div className="loginpage">
//                 <div className="loginbg md:block hidden">
//                     <div className="bglogo">{/* <img src={bglogos} alt="bg-logo" /> */}</div>
//                 </div>
//                 <div className='sm:px-0 px-2'>
//                     <div className="mb-4 logintitle flex justify-content-center flex-column">
//                         {!IsPropertyShow && <span className="text-center font-bold text-3xl mb-2 title">Welcome To Complex 360</span>}
//                         {/* {!IsPropertyShow && <span className="text-center font-bold text-3xl title">Complex 360</span>} */}
//                         {IsPropertyShow && <span className="text-center font-bold text-3xl mb-2 title">Welcome</span>}
//                         {IsPropertyShow && <span className="text-center font-bold text-3xl title">{loginPageUserName ? loginPageUserName : ""}</span>}
//                         {/* <img src={bglogos} style={{ width: '260px' }} alt="login-logo" /> */}
//                     </div>
//                     <div className="input-panel card shadow-3 border-round-md flex flex-column px-3">
//                         {!IsPropertyShow && <h5 className="text-center title my-3">Sign In</h5>}
//                         <div className="grid p-fluid mt-1">
//                             {!IsPropertyShow && <div className="field col-12 md:col-12 mb-1">
//                                 <span className="p-input-icon-left ">
//                                     <i className="pi pi-user" />
//                                     <InputText
//                                         type="email"
//                                         value={values?.email}
//                                         autoFocus
//                                         placeholder="Enter email"
//                                         onChange={(e) => {
//                                             setValues({ ...values, email: e.target.value });
//                                             // dispatch(loginRoleRequest({ email: e.target.value }));
//                                         }}
//                                         required
//                                         className={classNames({ 'p-invalid': localError && values?.email === "" })}
//                                         disabled={IsPropertyShow}
//                                     />
//                                 </span>
//                                 <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{localError && values?.email === "" ? "Please enter email" : ""}</div>
//                                 {/* {localError && values?.email === "" ? <small className="error text-left">{"Email is required"}</small> : null} */}
//                             </div>}
//                             {/* {roleData && roleData.length > 1 != '' ?( */}
//                             {/* <div className="field col-12 md:col-12 mb-1">
//                                     <label htmlFor="dropdown" className="required">
//                                         Login As
//                                     </label>
//                                     <Dropdown
//                                         id="dropdown"
//                                         required
//                                         optionLabel="label"
//                                         optionValue="value"
//                                         filter
//                                         placeholder="Choose Login Type"
//                                         options={roleData}
//                                         value={values?.role}
//                                         onChange={(e) => {
//                                             setValues({ ...values, role: e.value });
//                                         }}
//                                         // disabled={roleData?.length > 1 ? false : true }

//                                         className={classNames({ 'p-invalid': submitted && !values?.role })}
//                                     />
//                                     {submitted && errors?.role ? <small className="p-invalid error">{errors?.role}</small> : null}
//                                 </div> */}
//                             {/* ): null} */}
//                             {!IsPropertyShow && <div className="field col-12 md:col-12 mb-1">
//                                 <span className="p-input-icon-right">
//                                     <i className="pi pi-lock ml-2" />
//                                     {passwordType === 'password' ? <i className="pi pi-eye-slash" onClick={togglePassword}></i> : <i className="pi pi-eye" onClick={togglePassword}></i>}

//                                     <InputText
//                                         type={passwordType}
//                                         value={values.password}
//                                         style={{ paddingLeft: '34px' }}
//                                         placeholder="Password"
//                                         onKeyUp={handleKeyPress}
//                                         onChange={(e) => {
//                                             setValues({ ...values, password: e.target.value });
//                                         }}
//                                         required
//                                         className={classNames({ ' p-invalid': localError && values?.password === "" })}
//                                         disabled={IsPropertyShow}
//                                     />
//                                 </span>
//                                 <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{localError && values?.password === "" ? "Please enter password" : ""}</div>

//                                 {/* {localError && values?.password === "" ? <small className="error text-left">{"Password is required"}</small> : null} */}
//                             </div>}
//                             {IsPropertyShow && (
//                                 <div className="field col-12 md:col-12 mb-1">
//                                     <Dropdown
//                                         id="dropdown"
//                                         required
//                                         optionLabel="property_name"
//                                         optionValue="property_id"
//                                         placeholder="Choose Property"
//                                         options={propertyDrop ? propertyDrop : []}
//                                         value={values?.property_id}
//                                         onChange={(e) => {
//                                             // dispatch(adminRoleRequest({ email: values?.email, property_id: e.value }));
//                                             setValues({ ...values, property_id: e.value });
//                                         }}
//                                         // disabled={roleData?.length > 1 ? false : true }

//                                         className={classNames({ 'p-invalid': errorRole && values?.property_id === '' })}
//                                     />
//                                 </div>
//                             )}
//                             {/* {IsPropertyShow && (
//                                 <div className="field col-12 md:col-12 mb-1">
//                                     <Dropdown
//                                         id="dropdown"
//                                         required
//                                         optionLabel="role"
//                                         optionValue="role_id"
//                                         // filter
//                                         placeholder="Choose Login Role Type"
//                                         options={roleDrop ? roleDrop : []}
//                                         value={values?.role_id}
//                                         onChange={(e) => {
//                                             setValues({ ...values, role_id: e.value });
//                                         }}
//                                         // disabled={roleData?.length > 1 ? false : true }

//                                         className={classNames({ 'p-invalid': errorRole && values?.role_id === '' })}
//                                     />
//                                 </div>
//                             )} */}
//                             {!IsPropertyShow && <div className="flex col-12 justify-content-between">
//                                 <div className="mb-1 ">
//                                     <Checkbox onChange={() => setIsRemember(!isRemember)} checked={isRemember}></Checkbox>
//                                     <label className="ml-2 mt-2">Remember me</label>
//                                 </div>
//                                 <div>
//                                     <Link to="/forgotpassword" style={{ color: '#1565C0' }}>
//                                         <span className="align-middle link-text">Forgot Password?</span>
//                                     </Link>
//                                 </div>
//                             </div>}
//                             {IsPropertyShow &&
//                                 <div style={{ color: '#1565C0' }} className='col-12 cursor-pointer' onClick={() => { setIsPropertyShow(false); setValues({ ...values, property_id: "" }); }}>
//                                     <span className="align-middle link-text">Back To Login?</span>
//                                 </div>
//                             }
//                             <div className="col-12 my-3">
//                                 <Button
//                                     className="login-button px-3 mt-4"
//                                     loading={submitted || isLoading}
//                                     id="submit"
//                                     onClick={() => {
//                                         IsPropertyShow ? onWithRoleSubmit() : onSubmit();
//                                     }}
//                                     label={IsPropertyShow ? "Submit" : "Sign In"}
//                                 ></Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div >
//     );
// };

// export default Login;
import React, { useEffect, useState } from 'react';
import { adminLoginRequest, handleResetState } from '../../../redux/slice/AdminSlices/authSlice';
import components from '..';
import '../../../assets/scss/loginstyle.css';
import jwtDecode from 'jwt-decode';

const Login = () => {
    const { useNavigate, Cookie, Checkbox, Dropdown, classNames, InputText, Button, useDispatch, useSelector, Link, useState } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const [passwordType, setPasswordType] = useState('password');
    const [submitted, setSubmitted] = useState(false);
    const [isRemember, setIsRemember] = useState(false);
    const [IsPropertyShow, setIsPropertyShow] = useState(false);
    const [errorRole, setErrorRole] = useState(false);
    const [localError, setLocalError] = useState(false);
    const cookies = Cookie();
    const [userId, setUserId] = useState('');
    const { token, errors, isLoading, roleData, roleName, isPropertyCollect, propertyDrop, propertyDetails, roleDrop, loginPageUserName, isLoggedIn, loginDetails } = useSelector((state) => state.auth);
    const [values, setValues] = useState({
        email: '',
        password: '',
        property_id: '',
        role_id: '',
        platform: 'windows'
    });
    // useEffect(() => {
    //     // Check for tempAuthData in sessionStorage
    //     const tempAuthData = JSON.parse(sessionStorage.getItem('tempAuthData'));
    //     if (tempAuthData) {
    //         console.log('Retrieved tempAuthData:', tempAuthData);
    //         // Prefill email from tempAuthData
    //         setValues((prevValues) => ({
    //             ...prevValues,
    //             email: tempAuthData.authEmail
    //         }));
    //         // Navigate to property selection page if required
    //         if (!tempAuthData.property_id) {
    //             navigate('/property-management/myproperties');
    //         }
    //         // Optionally remove the temporary data
    //         sessionStorage.removeItem('tempAuthData');
    //     }
    // }, [navigate]);
    // Restore remembered login
    useEffect(() => {
        if (localStorage.getItem('rememberSoc')) {
            const rememberSoc = JSON.parse(localStorage.getItem('rememberSoc'));
            setIsRemember(true);
            setValues((prevValues) => ({
                ...prevValues,
                email: rememberSoc.email,
                password: rememberSoc.password
            }));
        }
    }, []);
    // Handle redirection based on login details
    useEffect(() => {
        if (token && loginDetails) {
            if (loginDetails?.role === 'Super Admin') {
                navigate('/superadmin/dashboard');
            } else if (loginDetails?.role === 'Salesman') {
                navigate('/hyy');
            } else if (isPropertyCollect) {
                setIsPropertyShow(true);
            } else if (loginDetails?.role_permissions.length !== 0) {
                navigate('/property-management/dashboard');
            }
        }
    }, [token, loginDetails, isPropertyCollect, navigate]);
    // Handle property selection redirection
    useEffect(() => {
        if (token && (loginDetails || propertyDetails)) {
            if (loginDetails?.role === 'Super Admin') {
                navigate('/superadmin/dashboard');
            } else if (propertyDetails && propertyDetails.length > 0) {
                navigate('/property-management/myproperties');
            } else if (loginDetails?.role_permissions.length !== 0) {
                navigate('/property-management/dashboard');
            }
        }
    }, [token, loginDetails, propertyDetails, navigate]);
    const togglePassword = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    };
    const onWithRoleSubmit = () => {
        try {
            dispatch(handleResetState());
            if (values?.property_id !== '') {
                dispatch(adminLoginRequest(values));
                if (isRemember) {
                    cookies.set(
                        'adminData',
                        { email: values.email, password: values.password },
                        {
                            path: '/',
                            secure: true,
                            httpOnly: false
                        }
                    );
                } else if (cookies.get('adminData')) {
                    cookies.remove('adminData');
                }
            } else {
                setErrorRole(true);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onSubmit = () => {
        if (values.email !== '' && values.password !== '') {
            dispatch(handleResetState());
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);

            let sendData = {
                email: values.email,
                password: values.password,
                platform: values.platform
            };
            if (isRemember) {
                localStorage.setItem('rememberSoc', JSON.stringify({ email: values.email, password: values.password }));
            } else if (localStorage.getItem('rememberSoc')) {
                localStorage.removeItem('rememberSoc');
            }
            dispatch(adminLoginRequest(sendData));
        } else {
            setLocalError(true);
        }
    };
    useEffect(() => {
        if (localStorage.getItem('rememberSoc')) {
            const rememberSoc = JSON.parse(localStorage.getItem('rememberSoc'));
            setIsRemember(true);
            const cookieValue = cookies.get('adminData');
            values.email = rememberSoc.email;
            values.password = rememberSoc.password;
        }
        if (token && loginDetails) {
            if (loginDetails?.role === 'Super Admin') {
                navigate('/superadmin/dashboard');
            } else if (loginDetails?.role === 'Salesman') {
                navigate('/hyy');
            } else if (loginDetails?.role_permissions.length !== 0) {
                navigate('/property-management/dashboard');
            }
        }
    }, []);
    useEffect(() => {
        if (token && (loginDetails || propertyDetails)) {
            if ('serviceWorker' in navigator) {
                const handleServiceWorker = async () => {
                    try {
                        // Register the service worker
                        const register = await navigator.serviceWorker.register('/sw.js');

                        // Subscribe to push notifications
                        const subscription = await register.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: 'BE46RjuMoGwdPIkSNG0j395xeokg8BF8kslHj2jWzz_DFc-SGgxsUFvp7o58hUJKBYRqAcuOwLoLIZD7SUAOzSQ' // Replace with your actual VAPID public key
                        });
                        // Send the subscription to your server
                        const res = await fetch(`${BASE_URL_API}/notification/save-subcription`, {
                            method: 'POST',
                            body: JSON.stringify(subscription),
                            headers: {
                                'content-type': 'application/json',
                                Authorization: token
                            }
                        });
                        const data = await res.json();
                    } catch (error) {
                        console.error('Error registering service worker or subscribing to push notifications', error);
                    }
                };
                handleServiceWorker();
            }
            if (loginDetails?.role === 'Super Admin') {
                navigate('/superadmin/dashboard');
            } else if (propertyDetails && propertyDetails.length > 0) {
                navigate('/property-management/myproperties');
            } else if (loginDetails?.role_permissions.length !== 0) {
                navigate('/property-management/dashboard');
            }
        }
    }, [token]);
    // const decodeURI = async () => {
    //     try {
    //         let decodeData = await jwtDecode(token);
    //         if (decodeData?.role === 'Chairman') {
    //             navigate(`/${decodeData ? decodeData?.property_name && decodeData?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vizard`);
    //         } else if (decodeData?.role === 'Super Admin') {
    //             navigate('/superadmin/dashboard');
    //         } else if (decodeData?.role) {
    //             navigate(`/${decodeData ? decodeData?.property_name && decodeData?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // useEffect(() => {
    //     decodeURI();
    // }, [roleName]);
    useEffect(() => {
        if (isPropertyCollect) {
            setIsPropertyShow(true);
        }
    }, [isPropertyCollect]);
    // console.log(roleDrop, 'roleDrop');
    return (
        <div className="login-container">
            <div className="login-background"> </div>
            <div className="login-form-container">
                <div className="login-header">
                    <h2 className="login-title">Welcome to Complex 360</h2>
                    {IsPropertyShow && <h3 className="welcome-message">{loginPageUserName || values.email}</h3>}
                </div>
                <form className="login-form">
                    {!IsPropertyShow && (
                        <>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter Your Email Id"
                                    value={values?.email}
                                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                                    className={`form-control ${localError && values.email === '' ? 'is-invalid' : ''}`}
                                    required
                                    disabled={IsPropertyShow}
                                />
                                {localError && values.email === '' && <div className="invalid-feedback">Please enter your email</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="password-input">
                                    <input
                                        type={passwordType}
                                        id="password"
                                        name="password"
                                        placeholder="Enter Your Password"
                                        value={values.password}
                                        onChange={(e) => setValues({ ...values, password: e.target.value })}
                                        onKeyUp={handleKeyPress}
                                        className={`form-control ${localError && values.password === '' ? 'is-invalid' : ''}`}
                                        required
                                        disabled={IsPropertyShow}
                                    />
                                    <button type="button" className="password-toggle" onClick={togglePassword}>
                                        <i className={`pi pi-eye${passwordType === 'password' ? '-slash' : ''}`} />
                                    </button>
                                </div>
                                {localError && values.password === '' && <div className="invalid-feedback">Please enter your password</div>}
                            </div>
                            <div className="form-group form-actions">
                                <div className="remember-me">
                                    <input type="checkbox" id="remember" checked={isRemember} onChange={() => setIsRemember(!isRemember)} />
                                    <label htmlFor="remember">Remember me</label>
                                </div>
                                <Link to="/forgotpassword" className="forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>
                        </>
                    )}
                    {IsPropertyShow && (
                        <div className="form-group">
                            <label htmlFor="property" className="form-label">
                                Choose Property
                            </label>
                            <Dropdown
                                id="property"
                                name="property"
                                value={values.property_id}
                                onChange={(e) => setValues({ ...values, property_id: e.value })}
                                className={`form-control ${errorRole && values.property_id === '' ? 'is-invalid' : ''}`}
                                options={propertyDrop || []}
                                placeholder="Select Property"
                                required
                            />
                            {errorRole && values.property_id === '' && <div className="invalid-feedback">Please select a property</div>}
                        </div>
                    )}
                    <Button className="login-buttonn" loading={submitted || isLoading} onClick={() => (IsPropertyShow ? onWithRoleSubmit() : onSubmit())}>
                        {IsPropertyShow ? 'Submit' : 'Sign In'}
                    </Button>
                    {IsPropertyShow && (
                        <div className="back-to-login" onClick={() => setIsPropertyShow(false)}>
                            Back to Login
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
export default Login;
