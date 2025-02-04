// import components from '..';
// import { Formik, Form } from 'formik';
// import { useParams } from 'react-router-dom';
// import * as Yup from 'yup';
// import { resetPasswordRequest, handleResetState } from '../../../redux/slice/AdminSlices/authSlice';

// const ResetPassword = () => {
//     const { Button, React, Password, InputText, useState, classNames, useNavigate, useEffect, useSelector, useDispatch } = components;
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const params = useParams();
//     const [passwordType, setPasswordType] = useState('password');
//     const [submitted, setSubmitted] = useState(false);
//     const [passwordType2, setPasswordType2] = useState('password');
//     const { token, loginDetails, isResetPassword } = useSelector((state) => state.auth);

//     const [formValue, setFormValue] = useState({
//         id: '',
//         token: '',
//         password: '',
//         confirm_password: ''
//     });
//     const SignupSchema = Yup.object().shape({
//         password: Yup.string()
//             .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/, 'Password must be atleast 8 letters.Include with 1 uppercase character,1 special character,1 number')
//             .required('New Password is required'),
//         confirm_password: Yup.string()
//             .oneOf([Yup.ref('password'), null], 'Passwords must match')
//             .required('Confirm Password is required')
//     });
//     const togglePassword = () => {
//         if (passwordType === 'password') {
//             setPasswordType('text');
//             return;
//         }
//         setPasswordType('password');
//     };
//     const togglePassword2 = () => {
//         if (passwordType2 === 'password') {
//             setPasswordType2('text');
//             return;
//         }
//         setPasswordType2('password');
//     };
//     const goBack = () => {
//         navigate(`/login`);
//     };
//     useEffect(() => {
//         if (isResetPassword) {
//             navigate('/login');
//             dispatch(handleResetState());
//         }
//     }, [isResetPassword]);
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
//     useEffect(() => {
//         if (params.id) {
//             let data = { ...formValue };
//             data.token = params.id;
//             setFormValue(data);
//         }
//     }, [params.id]);
//     return (
//         <>
//             <div className="pages-body login-page flex flex-column">
//                 <div className="loginpage">
//                     <div className="loginbg md:block hidden">
//                         <div className="bglogo">{/* <img src={bglogos} alt="bg-logo" /> */}</div>
//                     </div>
//                     <div className="sm:px-0 px-2">
//                         {/* <div className="mb-4 logintitle flex justify-content-center flex-column">
//               {!IsPropertyShow && <span className="text-center font-bold text-3xl mb-2 title">Welcome To</span>}
//               {!IsPropertyShow && <span className="text-center font-bold text-3xl title">Society Management</span>}
//               {IsPropertyShow && <span className="text-center font-bold text-3xl mb-2 title">Welcome</span>}
//               {IsPropertyShow && <span className="text-center font-bold text-3xl title">{loginPageUserName ? loginPageUserName : ""}</span>}

//             </div> */}
//                         <div className="input-panel card shadow-3 border-round-md flex flex-column px-3">
//                             <h5 className="text-center title my-3">Reset Password</h5>
//                             <Formik
//                                 initialValues={formValue}
//                                 validationSchema={SignupSchema}
//                                 enableReinitialize
//                                 onSubmit={(values) => {
//                                     setSubmitted(true);
//                                     setTimeout(() => {
//                                         setSubmitted(false);
//                                     }, 5000);
//                                     if (values?.token !== '') {
//                                         dispatch(resetPasswordRequest(values));
//                                     }
//                                     // let sendData = {
//                                     //     id: loginDetails?._id,
//                                     //     current_password: values?.curPwd,
//                                     //     password: values?.newPwd,
//                                     //     confirm_password: values?.conPwd,
//                                     //     email: loginDetails?.email
//                                     // };
//                                     // dispatch(updatePasswordRequest(sendData));
//                                 }}
//                             >
//                                 {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
//                                     <Form>
//                                         <div className="grid p-fluid mt-1">
//                                             <div className="field col-12 md:col-12 mb-1">
//                                                 <label htmlFor="password" className="required">
//                                                     New Password
//                                                 </label>
//                                                 <span className="p-input-icon-right">
//                                                     <i className="pi pi-lock ml-2" />
//                                                     {passwordType === 'password' ? <i className="pi pi-eye-slash" onClick={togglePassword}></i> : <i className="pi pi-eye" onClick={togglePassword}></i>}

//                                                     <InputText
//                                                         id="password"
//                                                         name="password"
//                                                         type={passwordType}
//                                                         value={values.password}
//                                                         style={{ paddingLeft: '34px' }}
//                                                         placeholder="Password"
//                                                         // onKeyUp={handleKeyPress}
//                                                         onChange={handleChange}
//                                                         // required
//                                                         className={classNames({ 'p-invalid': errors.password && touched.password })}
//                                                         // disabled={IsPropertyShow}
//                                                     />
//                                                 </span>
//                                                 {errors.password && touched.password ? <small className="error text-left">{errors.password}</small> : null}
//                                             </div>
//                                             <div className="field col-12 md:col-12 mb-1">
//                                                 <label htmlFor="confirm_password" className="required">
//                                                     Confirm Password
//                                                 </label>
//                                                 <span className="p-input-icon-right">
//                                                     <i className="pi pi-lock ml-2" />
//                                                     {passwordType2 === 'password' ? <i className="pi pi-eye-slash" onClick={togglePassword2}></i> : <i className="pi pi-eye" onClick={togglePassword2}></i>}

//                                                     <InputText
//                                                         id="confirm_password"
//                                                         name="confirm_password"
//                                                         type={passwordType2}
//                                                         value={values.confirm_password}
//                                                         style={{ paddingLeft: '34px' }}
//                                                         placeholder="Confirm Password"
//                                                         // onKeyUp={handleKeyPress}
//                                                         onChange={handleChange}
//                                                         // required
//                                                         className={classNames({ 'p-invalid': errors.confirm_password && touched.confirm_password })}
//                                                         // disabled={IsPropertyShow}
//                                                     />
//                                                 </span>
//                                                 {errors.confirm_password && touched.confirm_password ? <small className="error text-left">{errors.confirm_password}</small> : null}
//                                             </div>
//                                             <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
//                                                 <Button
//                                                     disabled={submitted}
//                                                     label="Submit Password"
//                                                     type="submit"
//                                                     // icon="pi pi-check"
//                                                     className="p-button-outlined p-button-success mr-2 mb-2 "
//                                                     // onClick={() => dataSave()}
//                                                 />
//                                             </div>
//                                             <div className="text-center mt-2">
//                                                 <Button style={{ all: 'unset', color: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={goBack}>
//                                                     <i className=" pi pi-angle-left" style={{ fontSize: '1.2rem' }} />
//                                                     <span className="align-middle link-text">Back to login</span>
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </Form>
//                                 )}
//                             </Formik>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* <div className='card m-4'>
//         <div className="flex flex-column m-3">
//           <h5 className="profile">Reset Password</h5>
//         </div>
//         <div className="grid p-fluid mt-1">
//           <div className="field col-12 md:col-4 mb-1">
//             <label htmlFor="mobileno" className="required">
//               New Password
//             </label>
//             <Password className="passwordInputField " feedback={false}

//               toggleMask />
//           </div>
//           <div className="field col-12 md:col-4 mb-1">
//             <label htmlFor="mobileno" className="required">
//               Retype New Password
//             </label>
//             <Password className="passwordInputField " feedback={false}
//               toggleMask />

//           </div>
//         </div>

//         <div className="mr-3 flex justify-content-end">
//           <Button label="Submit"
//             className="p-button-outlined p-button-success mr-2"

//           />
//           <Button label="Cancel" className="p-button-outlined  p-button-danger"

//           />
//         </div>

//       </div> */}
//         </>
//     );
// };

// export default ResetPassword;

import components from '..';
import { Formik, Form } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { resetPasswordRequest, handleResetState } from '../../../redux/slice/AdminSlices/authSlice';

const ResetPassword = () => {
    const { Button, React, useState, useNavigate, useEffect, useSelector, useDispatch } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [passwordType, setPasswordType] = useState('password');
    const [passwordType2, setPasswordType2] = useState('password');
    const [submitted, setSubmitted] = useState(false);
    const { token, loginDetails, isResetPassword } = useSelector((state) => state.auth);

    const [formValue, setFormValue] = useState({
        id: '',
        token: '',
        password: '',
        confirm_password: ''
    });

    const SignupSchema = Yup.object().shape({
        password: Yup.string()
            .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/, 'Password must be atleast 8 letters.Include with 1 uppercase character,1 special character,1 number')
            .required('New Password is required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')
    });

    const togglePassword = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    };

    const togglePassword2 = () => {
        setPasswordType2(passwordType2 === 'password' ? 'text' : 'password');
    };

    useEffect(() => {
        if (isResetPassword) {
            navigate('/login');
            dispatch(handleResetState());
        }
    }, [isResetPassword]);

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
        if (params.id) {
            let data = { ...formValue };
            data.token = params.id;
            setFormValue(data);
        }
    }, [params.id]);

    return (
        <div className="login-container">
            <div className='login-background'></div>
            <div className="login-form-container">
                <div className="login-header">
                    <h2 className="login-title">Reset Password</h2>
                </div>
                <Formik
                    initialValues={formValue}
                    validationSchema={SignupSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        if (values?.token !== '') {
                            dispatch(resetPasswordRequest(values));
                        }
                    }}
                >
                    {({ values, handleChange, errors, touched }) => (
                        <Form className="login-form">
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    New Password
                                </label>
                                <div className="password-input">
                                    <input
                                        type={passwordType}
                                        id="password"
                                        name="password"
                                          placeholder='Enter Your Password'
                                        value={values.password}
                                        onChange={handleChange}
                                        className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={togglePassword}
                                    >
                                        <i className={`pi pi-eye${passwordType === 'password' ? '-slash' : ''}`} />
                                    </button>
                                </div>
                                {errors.password && touched.password && (
                                    <div className="invalid-feedback">{errors.password}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm_password" className="form-label">
                                    Confirm Password
                                </label>
                                <div className="password-input">
                                    <input
                                        type={passwordType2}
                                        id="confirm_password"
                                        name="confirm_password"
                                        placeholder='Enter Your Password'
                                        value={values.confirm_password}
                                        onChange={handleChange}
                                        className={`form-control ${errors.confirm_password && touched.confirm_password ? 'is-invalid' : ''}`}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={togglePassword2}
                                    >
                                        <i className={`pi pi-eye${passwordType2 === 'password' ? '-slash' : ''}`} />
                                    </button>
                                </div>
                                {errors.confirm_password && touched.confirm_password && (
                                    <div className="invalid-feedback">{errors.confirm_password}</div>
                                )}
                            </div>
                            
                            <Button
                                className="login-buttonn"
                                loading={submitted}
                                type="submit"
                            >
                                Submit Password
                            </Button>

                            <div 
                                className="back-to-login flex items-center space-x-2 mt-4 font-bold" 
                                onClick={() => navigate('/login')}
                            >
                              <i className=" pi pi-angle-left" style={{ fontSize: '1.2rem' }} /> {/* Adjust size with w-5 h-5 or any Tailwind class */}
                              <span>Back to Login</span>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ResetPassword;