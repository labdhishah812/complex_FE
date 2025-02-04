// import components from '..';
// import { forgotPasswordRequest, handleResetState } from '../../../redux/slice/AdminSlices/authSlice';
// // import bglogos from '../../../assets/images/bglogo2.png';
// // import loginlogo from '../../../assets/images/mainlogo.png';
// const ForgotPassword = () => {
//     const { useNavigate, classNames, InputText, useEffect, Button, React, useDispatch, useSelector, toast, useState } = components;
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [email, setEmail] = useState('');
//     const [emailError, setEmailError] = useState('');
//     const [submitted, setSubmitted] = useState(false);
//     // const { errors, forgotPassData } = useSelector((state) => state.auth);
//     const { token, loginDetails, errors, forgotPassData, isForgetPassword } = useSelector((state) => state.auth);
//     const handleSave = (e) => {
//         if (email !== '') {
//             setEmailError('');
//             setSubmitted(true);
//             dispatch(forgotPasswordRequest({ email: email }));
//             dispatch(handleResetState());
//         }else{
//             setEmailError('Please enter registered email');
//         }
//     };
//     useEffect(() => {
//         if (token && loginDetails) {
//             if (loginDetails?.role === 'Super Admin') {
//                 navigate('/superadmin/dashboard');
//             } else if (loginDetails?.role_permissions.length === 0) {
//                 navigate('/property-management/myproperties');
//             } else if (loginDetails?.role_permissions.length !== 0) {
//                 navigate('/property-management/dashboard');
//             }
//         }
//     }, []);
//     const goBack = () => {
//         navigate(`/login`);
//     };
//     useEffect(() => {
//         if (isForgetPassword) {
//             navigate('/login');
//             dispatch(handleResetState());
//         }
//     }, [isForgetPassword]);
//     // useEffect(() => {
//     //     // if (forgotPassData !== null) {
//     //     //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'We have e-mailed your password reset link!', life: 3000 });
//     //     //     // navigate('admin/login');
//     //     // }
//     //     // return () => {
//     //     //     dispatch(handleResetState());
//     //     // };
//     // }, [forgotPassData]);

//     return (
//         <div className="pages-body login-page flex flex-column">
//             <div className="loginpage">
//                 <div className="loginbg">
//                     <div className="bglogo">{/* <img src={bglogos} alt="bg-logo" /> */}</div>
//                 </div>
//                 <div className="flex flex-column justify-content-center align-items-center ">
//                     <div className="mb-6">{/* <img src={loginlogo} style={{ width: '260px' }} alt="login-logo" /> */}</div>
//                     <div className="input-panel card flex flex-column px-3">
//                         <h5 className="text-center title my-3">Forgot Password</h5>
//                         <span className="pt-2 pb-2">Enter your email and we'll send you instructions to reset your password</span>
//                         <div className="grid p-fluid mt-1">
//                             <div className="field col-12 md:col-12 mb-1">
//                                 <span className="p-input-icon-left ">
//                                     <i className="pi pi-envelope" />
//                                     <InputText type="text" placeholder="Enter Your Email Id" onChange={(e) => setEmail(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !email })} />
//                                 </span>
//                                 {emailError && <small className="p-error text-left">{emailError}</small>}
//                             </div>
//                             <div className="col-12">
//                                 <Button className="login-button  px-3 border-round-3xl mt-2" onClick={(e) => handleSave(e)} label="Send Reset Link"></Button>
//                             </div>
//                             <div className="text-center mt-2">
//                                 <Button style={{ all: 'unset', color: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={goBack}>
//                                     <i className=" pi pi-angle-left" style={{ fontSize: '1.2rem' }} />
//                                     <span className="align-middle link-text">Back to login</span>
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ForgotPassword;

import components from '..';
import { forgotPasswordRequest, handleResetState } from '../../../redux/slice/AdminSlices/authSlice';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const { useNavigate, classNames, InputText, useEffect, Button, React, useDispatch, useSelector, toast, useState } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { token, loginDetails, errors, forgotPassData, isForgetPassword } = useSelector((state) => state.auth);

    const handleSave = (e) => {
        if (email !== '') {
            setEmailError('');
            setSubmitted(true);
            dispatch(forgotPasswordRequest({ email: email }));
            dispatch(handleResetState());
        } else {
            setEmailError('Please enter registered email');
        }
    };

    useEffect(() => {
        if (token && loginDetails) {
            if (loginDetails?.role === 'Super Admin') {
                navigate('/superadmin/dashboard');
            } else if (loginDetails?.role_permissions.length === 0) {
                navigate('/property-management/myproperties');
            } else if (loginDetails?.role_permissions.length !== 0) {
                navigate('/property-management/dashboard');
            }
        }
    }, []);

    useEffect(() => {
        if (isForgetPassword) {
            navigate('/login');
            dispatch(handleResetState());
        }
    }, [isForgetPassword]);

    return (
        <div className="login-container">
            <div className="login-background"></div>
            <div className="login-form-container">
                <div className="login-header">
                    <h2 className="login-title">Forgot Password</h2>
                </div>
                <form className="login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input type="email" id="email" name="email"  value={email} onChange={(e) => setEmail(e.target.value)} className={`form-control ${submitted && !email ? 'is-invalid' : ''}`} required placeholder="Enter Your Email Id" />
                        {((submitted && !email) || emailError) && <div className="invalid-feedback">{emailError || 'Please enter your email'}</div>}
                    </div>

                    <Button className="login-buttonn" loading={submitted} onClick={handleSave}>
                        Send Reset Link
                    </Button>

                    <div className="back-to-login flex items-center space-x-2 mt-4 font-bold" onClick={() => navigate('/login')}>
                        <i className=" pi pi-angle-left" style={{ fontSize: '1.2rem' }} /> {/* Adjust size with w-5 h-5 or any Tailwind class */}
                        <span>Back to Login</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
