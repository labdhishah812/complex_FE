import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import toast from 'react-hot-toast';
import {
    adminLoginApi,
    adminProfileUpdateApi,
    changePasswordApi,
    forgotPasswordApi,
    getProfileDetailsApi,
    loginRoleApi,
    superAdminLoginApi,
    getProfileDataApi,
    updateProfileApi,
    updatePasswordApi,
    adminPropertyDetailsApi,
    adminRoleDetailsApi,
    getStepperDetailsApi,
    adminLogiWithProperty,
    resetPasswordApi
} from '../../../service/api';
import { useNavigate } from 'react-router-dom';
export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoading: false,
        isUpdate: false,
        isChanged: false,
        userData: null,
        // isLoggedIn: JSON.parse(sessionStorage.getItem('accessToken')) ==  null? false : true,
        isLoggedIn: false,
        isPropertyCollect: false,
        propertyDrop: null,
        roleDrop: null,
        forgotPassData: null,
        roleData: null,
        // token: JSON.parse(sessionStorage.getItem('accessToken')) ? JSON.parse(sessionStorage.getItem('accessToken')) : null,
        token: null,
        profileDetails: null,
        profileImage: '',
        errors: null,
        successMessage: null,
        stepperDetail: null,
        loginPageUserName: null,
        roleName: null,
        loginDetails: null,
        propertyDetails: null,
        authEmail: null,
        isForgetPassword: false,
        isResetPassword: false,
    },

    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isUpdate = false;
            state.isChanged = false;
            state.isPropertyCollect = false;
            state.profileDetails = null;
            state.loginPageUserName = null;
            state.isForgetPassword = false;
            state.isResetPassword = false;
        },
        setLoading2: (state) => {
            state.isLoading = true;
            state.profileDetails = null;
        },
        handleSuccessUserName: (state, action) => {
            state.loginPageUserName = action.payload
        },
        authForSocietyWise: (state, action) => {
            state.isLoading = false;
            state.isPropertyCollect = true;
            state.propertyDrop = action?.payload?.data;
        },
        handleRoleDropData: (state, action) => {
            state.isLoading = false;
            state.roleDrop = action?.payload?.data;
        },
        handleStepperDetails: (state, action) => {
            state.isLoading = false;
            state.stepperDetail = action?.payload?.data;
        },
        handleErrorStepperDetails: (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },
        handleSuccessLogin: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.token = action.payload?.data?.token;
            state.loginDetails = action.payload?.data?.user_detail;
            if (action.payload?.data?.user_detail?.user_connect_with_property_id) {
                state.propertyDrop = null;
                state.propertyDetails = null;
                state.authEmail = null;
            }

            // state.roleName = action.payload?.user_detail?.role;
            // state.userData = action.payload?.data;
            // state.successMessage = action.payload?.message;
            // sessionStorage.setItem('accessToken', JSON.stringify(action.payload?.data?.token));
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleInitialLogin: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.token = true;
            state.propertyDrop = null;
            state.authEmail = action?.payload?.email
            state.propertyDetails = action?.payload?.properties;
            console.log(state.propertyDetails,"propertyDetails")
            // state.loginDetails = action.payload?.user_detail;
            // if (action.payload?.user_detail?.user_connect_with_property_id) {
            //     // state.propertyDrop = ;
            // }

            // state.roleName = action.payload?.user_detail?.role;
            // state.userData = action.payload?.data;
            // state.successMessage = action.payload?.message;
            // sessionStorage.setItem('accessToken', JSON.stringify(action.payload?.data?.token));
            toast.success("Welcome In Complex 360.", {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorLogin: (state, action) => {
            let check = typeof action.payload === "object";
            check ? Object.values(action.payload).map((a) =>
                toast.error(a, {
                    style: {
                        marginTop: '2rem'
                    }
                })
            ) : toast.error(action.payload, {
                style: {
                    marginTop: '2rem'
                }
            });

            state.isLoading = false;
            state.errors = action.payload;
        },
        handleErrorForget: (state, action) => {
            // console.log(action);
            state.isLoading = false;
            state.isForgetPassword = false;
        },
        handleForgotPassword: (state, action) => {
            state.isLoading = false;
            state.forgotPassData = action.payload;
            state.isForgetPassword = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '2rem'
                }
            });
        },
        handleResetPassword: (state, action) => {
            state.isLoading = false;
            state.forgotPassData = action.payload;
            state.isResetPassword = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '2rem'
                }
            });
        },
        handleErrorResetPassword: (state, action) => {
            // console.log(action);
            state.isLoading = false;
            state.isResetPassword = false;

        },
        handleRoleData: (state, action) => {
            state.isLoading = false;
            state.roleData = action.payload;
        },
        handleProfileDetailsSuccess: (state, action) => {
            state.isLoading = false;
            state.profileDetails = action.payload;
        },
        handleProfileDetailsError: (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },
        handleSetProfileImage: (state, action) => {
            state.isLoading = false;
            state.profileImage = action.payload;
        },
        handleUpdateProfileDataSuccess: (state, action) => {
            state.isLoading = false;
            state.successMessage = action.payload;
        },

        handleUpdateProfileData: (state, action) => {
            // state.isLoading = false;
            // state.isUpdate = true;
            // state.token = action.payload?.data?.token;
            // // sessionStorage.setItem('accessToken', JSON.stringify(action.payload?.data?.token));
            // toast.success(action.payload.message, {
            //     style: {
            //         marginTop: '4rem'
            //     }
            // });
            state.isUpdate = true;
            state.isLoading = false;
            state.isLoggedIn = true;
            state.loginDetails = action.payload?.data?.user_detail;
            // toast.success(action.payload?.message, {
            //     style: {
            //         marginTop: '4rem'
            //     }
            // });
            toast.success("User Profile Updated Successfully.", {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorProfileData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            Object.values(action.payload).map((a) =>
                toast.error(a, {
                    style: {
                        marginTop: '4rem'
                    }
                })
            );
        },
        handlePasswordSuccess: (state, action) => {
            state.isLoading = false;
            state.successMessage = action.payload;
        },
        handlePasswordError: (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },
        handleLogout: (state) => {
            state.isLoading = false;
            state.userData = null;
            state.token = null;
            state.roleName = null;
            state.isLoggedIn = false;
            state.isPropertyCollect = false;
            state.propertyDrop = null;
            state.roleDrop = null;
            state.forgotPassData = null;
            state.roleData = null;
            state.profileDetails = null;
            state.profileImage = '';
            state.errors = null;
            state.successMessage = null;
            state.stepperDetail = null;
            state.loginPageUserName = null;
            state.loginDetails = null;
            state.propertyDetails = null;
            state.authEmail = null;
            state.isForgetPassword = false;
            state.isResetPassword = false;

        },
        handleUserDetails: (state, action) => {
            state.isLoading = false;
            state.userData = action.payload;
            state.roleName = action.payload?.role;
            // if (action.payload?.is_block_exist_in_property) state.isBlock = action.payload?.is_block_exist_in_property;
            // if (action.payload?.is_floor_exist_in_property) state.isFloor = action.payload?.is_floor_exist_in_property;
            // if (action.payload?.is_house_exist_in_property) state.isHouse = action.payload?.is_house_exist_in_property;
            // state.profileImage = action.payload?.profile_image;
        },
        handleUpdatePassword: (state, action) => {
            // state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isChanged = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },

        handleErrorUpdatePassword: (state, action) => {
            state.isLoading = false;
            Object.values(action.payload).map((a) =>
                toast.error(a, {
                    style: {
                        marginTop: '4rem'
                    }
                })
            );
        },
        handleResetState: (state) => {
            state.isLoading = false;
            state.errors = null;
            state.successMessage = null;
            state.profileUpdateData = null;
            state.roleData = null;
            state.isForgetPassword = false;
            state.isResetPassword = false;
        }
    }
});
export const {
    setLoading,
    handleUpdatePassword,
    handleErrorUpdatePassword,
    handleSuccessLogin,
    authForSocietyWise,
    handleRoleDropData,
    handleErrorLogin,
    handleRoleData,
    handleResetState,
    handleForgotPassword,
    handleErrorForget,
    handleUserDetails,
    handleProfileDetailsError,
    handleProfileDetailsSuccess,
    handleSetProfileImage,
    handleUpdateProfileDataSuccess,
    handleErrorProfileData,
    handlePasswordError,
    handlePasswordSuccess,
    handleUpdateProfileData,
    handleLogout,
    handleStepperDetails,
    handleErrorStepperDetails,
    handleSuccessUserName,
    handleInitialLogin,
    handleResetPassword,
    handleErrorResetPassword
} = authSlice.actions;
export default authSlice.reducer;
//old
// export const adminLoginRequest = (userData) => async (dispatch) => {
//     dispatch(setLoading());
//     try {
//         const { data } = await adminLoginApi(userData);
//         const { statusCode } = data;
//         if (statusCode === 200) {
//             let sData = data?.data;
//             dispatch(handleSuccessUserName(sData?.user_detail?.name));
//             if (sData?.user_detail?.role === 'Super Admin' || (userData?.property_id)) {
//                 dispatch(handleSuccessLogin(data));
//                 // let decodeData = await jwtDecode(data?.data?.token);
//                 // dispatch(handleUserDetails(decodeData));
//                 // sessionStorage.setItem('roleName', JSON.stringify(decodeData?.role));
//                 // dispatch(handleUserDetails(decodeData));
//             }else if(sData?.user_detail?.role === 'Salesman' ){
//                 localStorage.setItem('salesmanToken' , sData?.token)
//                 dispatch(handleSuccessLogin(data));
//             } else {
//                 let multiData = sData[0];
//                 if (multiData?.properties.length === 1) {
//                     let sendData = {
//                         email: multiData?.email,
//                         property_id: multiData?.properties[0]._id,
//                         platform: 'windows',
//                     }
//                     const { data: data2 } = await adminLogiWithProperty(sendData);
//                     if (data2?.statusCode === 200) {
//                         dispatch(handleSuccessLogin(data2));


//                         dispatch(getStepperDetails());
//                     }
//                 } else {
//                     dispatch(handleInitialLogin(multiData))
//                 }

//                 // let { data } = await adminPropertyDetailsApi({ email: userData?.email });
//                 // if (data?.statusCode === 200) {
//                 //     if (data?.data.length === 1) {
//                 //         let sendData = {
//                 //             email: userData?.email,
//                 //             password: userData?.password,
//                 //             property_id: data?.data[0]?.property_id,
//                 //             platform: 'windows',
//                 //         }
//                 //         const { data: data2 } = await adminLoginApi(sendData);
//                 //         if (data2?.statusCode === 200) {
//                 //             dispatch(handleSuccessLogin(data2?.data));
//                 //         }
//                 //     } else {
//                 //         dispatch(handleSuccessLogin(sData));
//                 //     }
//                 //     dispatch(authForSocietyWise(data));
//                 // }
//             }
//             // decodeData?.is_block_exist_in_property && sessionStorage.setItem('isBlock', JSON.stringify(decodeData?.is_block_exist_in_property));
//             // decodeData?.is_floor_exist_in_property && sessionStorage.setItem('isFloor', JSON.stringify(decodeData?.is_floor_exist_in_property));
//             // decodeData?.is_house_exist_in_property && sessionStorage.setItem('isHouse', JSON.stringify(decodeData?.is_house_exist_in_property));

//             // dispatch(handleUserDetails(decodeData));
//         }
//     } catch (error) {
//         console.log(error, 'error');
//         if (error.response && error.response.data.errors) {
//             return dispatch(handleErrorLogin(error.response.data.errors));
//         } else {
//             return dispatch(handleErrorLogin(error.message));
//         }
//     }
// };

export const adminLoginRequest = (userData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const { data } = await adminLoginApi(userData);
        const { statusCode } = data;

        if (statusCode === 200) {
            const sData = data?.data;
            const userRole = sData?.user_detail?.role;

            dispatch(handleSuccessUserName(sData?.user_detail?.name));

            if (userRole === 'Super Admin' || userData?.property_id) {
                dispatch(handleSuccessLogin(data));
            } else if (userRole === 'Salesman') {
                localStorage.setItem('salesmanToken', sData?.token);
                dispatch(handleSuccessLogin(data));
            } else {
                // Save property details to localStorage
                const properties = sData[0]?.properties;
                if (properties && properties.length > 0) {
                    localStorage.setItem('userProperties', JSON.stringify(properties));

                    if (properties.length === 1) {
                        const sendData = {
                            email: sData[0]?.email,
                            property_id: properties[0]._id,
                            platform: 'windows',
                        };
                        const { data: data2 } = await adminLogiWithProperty(sendData);
                        if (data2?.statusCode === 200) {
                            dispatch(handleSuccessLogin(data2));
                            dispatch(getStepperDetails());
                        }
                    } else {
                        dispatch(handleInitialLogin(sData[0])); // Show property switch UI
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.errors || error.message;
        dispatch(handleErrorLogin(errorMessage));
    }
};



// export const adminLoginRequest = (userData) => async (dispatch) => {
//     dispatch(setLoading());
//     try {
//         const { data } = await adminLoginApi(userData);
//         const { statusCode } = data;
//         if (statusCode === 200) {
//             let sData = data?.data;
//             dispatch(handleSuccessUserName(sData?.user_detail?.name));
//             const navigate = useNavigate();
//             // Existing multi-property handling logic
//             // Role-based redirection logic
//             if (sData?.user_detail?.role === 'Super Admin') {
//                 // Redirect to Super Admin dashboard
//                 dispatch(handleSuccessLogin(data));
//             } else if (sData?.user_detail?.role === 'Salesman') {
//                 // Redirect to Salesman dashboard
//                 dispatch(handleSuccessLogin(data));
//                 // You might want to add a specific action or navigation for salesman
//                 // For example: dispatch(navigateToSalesmanDashboard());
//             } else {
//                 // Existing multi-property handling logic
//                 let multiData = sData[0];
//                 if (multiData?.properties.length === 1) {
//                     let sendData = {
//                         email: multiData?.email,
//                         property_id: multiData?.properties[0]._id,
//                         platform: 'windows',
//                     }
//                     const { data: data2 } = await adminLogiWithProperty(sendData);
//                     if (data2?.statusCode === 200) {
//                         dispatch(handleSuccessLogin(data2));
//                         dispatch(getStepperDetails());
//                     }
//                 } else {
//                     dispatch(handleInitialLogin(multiData))
//                 }
//             }
//         }
//     } catch (error) {
//         console.log(error, 'error');
//         if (error.response && error.response.data.errors) {
//             return dispatch(handleErrorLogin(error.response.data.errors));
//         } else {
//             return dispatch(handleErrorLogin(error.message));
//         }
//     }
// };


export const adminLoginWithPropertyRequest = (userData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const { data } = await adminLogiWithProperty(userData);
        const { statusCode } = data;
        if (statusCode === 200) {
            let sData = data?.data;
            dispatch(handleSuccessUserName(sData?.user_detail?.name));
            if (userData?.property_id) {
                dispatch(handleSuccessLogin(data));
                dispatch(getStepperDetails());
                // let decodeData = await jwtDecode(data?.data?.token);
                // dispatch(handleUserDetails(decodeData));
                // sessionStorage.setItem('roleName', JSON.stringify(decodeData?.role));
                // dispatch(handleUserDetails(decodeData));
            }
        }
    } catch (error) {
        console.log(error, 'error');
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorLogin(error.response.data.errors));
        } else {
            return dispatch(handleErrorLogin(error.message));
        }
    }
};
export const adminRoleRequest = (userData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const { data } = await adminRoleDetailsApi(userData);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleRoleDropData(data));
            // let sData = data?.data;
            // if (sData?.user_detail?.role === 'Super Admin') {
            //     dispatch(handleSuccessLogin(data));
            //     let decodeData = await jwtDecode(data?.data?.token);
            //     dispatch(handleUserDetails(decodeData));
            //     sessionStorage.setItem('roleName', JSON.stringify(decodeData?.role));
            // } else if (userData?.property_id && userData?.role_id) {
            // } else {
            //     let { data } = await adminPropertyDetailsApi({ email: userData?.email });
            //     if (data?.statusCode === 200) {
            //         dispatch(authForSocietyWise(data));
            //     }
            // }
        }
    } catch (error) {
        console.log(error, 'error');
    }
};

// export const superAdminLoginRequest = (userData) => async (dispatch) => {
// 	dispatch(setLoading());
// 	try {
// 		const { data } = await superAdminLoginApi(userData);
// 		const { statusCode } = data;
// 		if (statusCode === 200) {
// 			dispatch(handleSuccessLogin(data));
// 			let decodeData = await jwtDecode(data?.data?.token);
// 			dispatch(handleUserDetails(decodeData));
// 			sessionStorage.setItem('roleName', JSON.stringify(decodeData?.role_name));
// 			dispatch(handleUserDetails(decodeData));
//
// 		}
// 	} catch (error) {
//
// 		if (error.response && error.response.data.errors) {
// 			return dispatch(handleErrorLogin(error.response.data.errors));
// 		} else {
// 			return dispatch(handleErrorLogin(error.message));
// 		}
// 	}
// };

export const forgotPasswordRequest = (userData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const { data } = await forgotPasswordApi(userData);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleForgotPassword(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorForget(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 400) {
                toast.error(error.response.data?.data, {
                    style: {
                        marginTop: '2rem'
                    }
                });
            }
            return dispatch(handleErrorForget(error.message));
        }
    }
};
export const getProfileDetailsRequest = (id) => async (dispatch, getState) => {
    dispatch(setLoading());

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await getProfileDataApi(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleProfileDetailsSuccess(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleProfileDetailsError(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleProfileDetailsError(error.message));
        }
    }
};
export const adminProfileUpdateRequest = (id, updatedData, token) => async (dispatch, getState) => {
    dispatch(setLoading());



    try {


        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Content-Type': 'multipart/form-data',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await adminProfileUpdateApi(id, updatedData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleUpdateProfileDataSuccess(data.message));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorProfileData(error.response.data.errors));
        } else {
            return dispatch(handleErrorProfileData(error.message));
        }
    }
};
export const changePasswordRequest = (userData, token) => async (dispatch) => {
    dispatch(setLoading());

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: token
            }
        };
        const { data } = await changePasswordApi(userData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handlePasswordSuccess(data?.message));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handlePasswordError(error.response.data.errors));
        } else {
            return dispatch(handlePasswordError(error.message));
        }
    }
};
export const loginRoleRequest = (reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await loginRoleApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleRoleData(data.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorLogin(error.response.data.errors));
        } else {
            return dispatch(handleErrorLogin(error.message));
        }
    }
};

export const profileUpdateRequest = (id, updatedData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Content-Type': 'multipart/form-data',
                Authorization: getState()?.auth?.token
            }
        };

        const { data } = await updateProfileApi(id, updatedData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            // dispatch(handleSuccessLogin(data?.data));
            dispatch(handleUpdateProfileData(data));
            // let decodeData = await jwtDecode(data?.data?.token);
            // dispatch(handleUserDetails(decodeData));
            // sessionStorage.setItem('roleName', JSON.stringify(decodeData?.role));
            // decodeData?.is_block_exist_in_property && sessionStorage.setItem('isBlock', JSON.stringify(decodeData?.is_block_exist_in_property));
            // decodeData?.is_floor_exist_in_property && sessionStorage.setItem('isFloor', JSON.stringify(decodeData?.is_floor_exist_in_property));
            // decodeData?.is_house_exist_in_property && sessionStorage.setItem('isHouse', JSON.stringify(decodeData?.is_house_exist_in_property));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorProfileData(error.response.data.errors));
        } else {
            return dispatch(handleErrorProfileData(error.message));
        }
    }
};
export const updatePasswordRequest = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await updatePasswordApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleUpdatePassword(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUpdatePassword(error.response.data.errors));
        } else {
            return dispatch(handleErrorUpdatePassword(error.message));
        }
    }
};

export const getStepperDetails = () => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await getStepperDetailsApi(config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleStepperDetails(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorStepperDetails(error.response.data.errors));
        } else {
            return dispatch(handleErrorStepperDetails(error.message));
        }
    }
};

export const resetPasswordRequest = (userData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        ;

        const { data } = await resetPasswordApi(userData);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleResetPassword(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorResetPassword(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 400) {
                toast.error("Reset password link has been expired", {
                    style: {
                        marginTop: '2rem'
                    }
                });
            }
            // return dispatch(handleErrorResetPassword(error.message));
        }
    }
};
