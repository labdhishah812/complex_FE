import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { aboutUsUpdateApi, footerUpdateApi, getAboutusListApi, getFooterListApi, getPrivacyPolicyListApi, getTermsConditionListApi, privacyPolicyUpdateApi, termsConditionUpdateApi } from '../../../service/api';

const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    privacyPolicyDetail: null,
    termsconditionDetail: null,
    aboutusDetail: null,
    footerDetail: null,
};

const showErrorToast = (error) => {
    if (typeof error === 'string') {
        toast.error(error, {
            style: {
                marginTop: '4rem'
            }
        });
    } else if (typeof error === 'object') {
        for (const key in error) {
            toast.error(error[key], {
                style: {
                    marginTop: '4rem'
                }
            });
        }
    }
};
// const cmsSlice = createSlice({
//     name: 'cms',
//     initialState,
//     reducers: {
//         setLoading: (state) => {
//             state.isLoading = true;
//             state.isDelete = false;
//             state.successMessage = '';
//             state.errors = null;
//             state.isCreated = false;
//         },
//         handlePrivacypolicyCreateData: (state, action) => {
//             state.successMessage = action.payload?.message;
//             state.isLoading = false;
//             state.isCreated = true;
//             toast.success(action?.payload?.message, {
//                 style: {
//                     marginTop: '4rem'
//                 }
//             });
//         },
//         handleFooterCreateData: (state, action) => {
//             state.successMessage = action.payload?.message;
//             state.isLoading = false;
//             state.isCreated = true;
//             toast.success(action?.payload?.message, {
//                 style: {
//                     marginTop: '4rem'
//                 }
//             });
//         },
//         handleTermsconditionCreateData: (state, action) => {
//             state.successMessage = action.payload?.message;
//             state.isLoading = false;
//             state.isCreated = true;
//             toast.success(action?.payload?.message, {
//                 style: {
//                     marginTop: '4rem'
//                 }
//             });
//         },
//         handleAboutusCreateData: (state, action) => {
//             state.successMessage = action.payload?.message;
//             state.isLoading = false;
//             state.isCreated = true;
//             toast.success(action?.payload?.message, {
//                 style: {
//                     marginTop: '4rem'
//                 }
//             });
//         },
//         handleErrorPrivacypolicyCreateData: (state, action) => {
//             state.errors = action.payload;
//             state.isLoading = false;
//             Object.values(action.payload).map((a) =>
//                 toast.error(a, {
//                     style: {
//                         marginTop: '4rem'
//                     }
//                 })
//             );
//         },
//         handleErrorFooterCreateData: (state, action) => {
//             state.errors = action.payload;
//             state.isLoading = false;
//             Object.values(action.payload).map((a) =>
//                 toast.error(a, {
//                     style: {
//                         marginTop: '4rem'
//                     }
//                 })
//             );
//         },
//         handleErrorTermsconditionCreateData: (state, action) => {
//             state.errors = action.payload;
//             state.isLoading = false;
//             Object.values(action.payload).map((a) =>
//                 toast.error(a, {
//                     style: {
//                         marginTop: '4rem'
//                     }
//                 })
//             );
//         },
//         handleErrorAboutusCreateData: (state, action) => {
//             state.errors = action.payload;
//             state.isLoading = false;
//             Object.values(action.payload).map((a) =>
//                 toast.error(a, {
//                     style: {
//                         marginTop: '4rem'
//                     }
//                 })
//             );
//         },
//         handlePrivacypolicyData: (state, action) => {
//             state.privacyPolicyDetail = action.payload;
//             state.successMessage = action.payload?.message;
//             state.isLoading = false;
//         },
//         handleFooterData: (state, action) => {
//             state.footerDetail = action.payload;
//             state.successMessage = action.payload?.message;
//             state.isLoading = false;
//         },
//         handleTermsconditionData: (state, action) => {
//             state.termsconditionDetail = action.payload;
//             state.successMessage = action.payload?.message;
//             state.isLoading = false;
//         },
//         handleAboutusData: (state, action) => {
//             state.aboutusDetail = action.payload;
//             state.successMessage = action.payload?.message;
//             state.isLoading = false;
//         },
//         handleError: (state, action) => {
//             state.errors = action.payload;
//             state.isLoading = false;
//         }
//     }
// });
const cmsSlice = createSlice({
    name: 'cms',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
        },
        handlePrivacypolicyCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleFooterCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleTermsconditionCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleAboutusCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorPrivacypolicyCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            showErrorToast(action.payload);
        },
        handleErrorFooterCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            showErrorToast(action.payload);
        },
        handleErrorTermsconditionCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            showErrorToast(action.payload);
        },
        handleErrorAboutusCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            showErrorToast(action.payload);
        },
        handlePrivacypolicyData: (state, action) => {
            state.privacyPolicyDetail = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleFooterData: (state, action) => {
            state.footerDetail = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleTermsconditionData: (state, action) => {
            state.termsconditionDetail = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleAboutusData: (state, action) => {
            state.aboutusDetail = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleError: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            showErrorToast(action.payload);
        }
    }
});
export const {
    setLoading,
    handlePrivacypolicyData,
    handleAboutusData,
    handleFooterData,
    handleTermsconditionData,
    handlePrivacypolicyCreateData,
    handleAboutusCreateData,
    handleFooterCreateData,
    handleTermsconditionCreateData,
    handleErrorPrivacypolicyCreateData,
    handleErrorFooterCreateData,
    handleErrorAboutusCreateData,
    handleErrorTermsconditionCreateData,
    handleError
} = cmsSlice.actions;
export default cmsSlice.reducer;
export const aboutusUpdateAPI = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await aboutUsUpdateApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleAboutusCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorAboutusCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorAboutusCreateData(error.message));
        }
    }
};

export const getAboutUsData = () => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                // Authorization: getState()?.auth?.token
            }
        };

        const { data } = await getAboutusListApi(config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleAboutusData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleError(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleError(error.message));
        }
    }
};

export const footerUpdateAPI = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await footerUpdateApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleAboutusCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorAboutusCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorAboutusCreateData(error.message));
        }
    }
};

export const getFooterData = () => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                // Authorization: getState()?.auth?.token
            }
        };
        const { data } = await getFooterListApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleFooterData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleError(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleError(error.message));
        }
    }
};

export const termsConditionUpdateData = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await termsConditionUpdateApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleTermsconditionCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorTermsconditionCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorTermsconditionCreateData(error.message));
        }
    }
};

export const getTermsConditionData = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                // Authorization: getState()?.auth?.token
            }
        };
        const { data } = await getTermsConditionListApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleTermsconditionData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleError(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleError(error.message));
        }
    }
};

export const privacyPolicyUpdateData = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await privacyPolicyUpdateApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePrivacypolicyCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPrivacypolicyCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorPrivacypolicyCreateData(error.message));
        }
    }
};
export const getprivacyPolicyUpdateData = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                // Authorization: getState()?.auth?.token
            }
        };
        const { data } = await getPrivacyPolicyListApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePrivacypolicyData(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleError(error.response.data.errors));
        } else {
            return dispatch(handleError(error.message));
        }
    }
};
