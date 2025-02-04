import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
    deleteAssignedPropertyApi,
    deleteAssignedTenantApi,
    getAddressFromPincode,
    multiPropertyAssignRequestApi,
    propertyAssignRequestApi,
    propertyBusinessRequestApi,
    propertyDataApi,
    propertyDetailsByid,
    propertyOwnerHistoryApi,
    propertyTransferApi,
    tenantDataApi,
    tenantTransferApi
} from '../../../service/api';
import { handleLogout } from '././authSlice';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    isTransfer: false,
    isMultiCreated: false,
    propertyAssignedData: null,
    tenantAssignedData: null,
    deletedUserData: null,
    propertyDataByid: null,
    propertyFromStructur: null,
    propertyOwnerhistory: null
};
const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isTransfer = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.isMultiCreated = false;
            state.propertyAssignedData = null;
            state.tenantAssignedData = null;
            state.isDelete = false;
            state.propertyFromStructur = null;
        },
        handleMultiPropertyAssignData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isMultiCreated = true;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handlePropertyBusinessData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorMultiPropertyData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error('something went to wrong', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handlePropertyAssignData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success('Successfully Property Assigned', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handlePropertyTransferData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isTransfer = true;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorPropertyTransferData: (state, action) => {
            state.successMessage = action.payload?.message;
            console.log(action.payload, 'action');
            state.isLoading = false;
            state.isTransfer = false;
            toast.error(action.payload?.email, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorPropertyData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error(action.payload.email || action.payload.user_property_assign_id || action.payload, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handlePropertyAssignedData: (state, action) => {
            state.propertyAssignedData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.propertyDataByid = null;
        },
        handleTenantAssignedData: (state, action) => {
            state.tenantAssignedData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.propertyDataByid = null;
        },
        handlePropertyOwnerHistoryData: (state, action) => {
            state.propertyOwnerhistory = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handlePropertyDataByid: (state, action) => {
            state.isLoading = false;
            state.propertyDataByid = action.payload;
        },
        handleErrorPropertyAssignedData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleDeleteUserData: (state, action) => {
            state.successMessage = action.payload.message;
            state.deletedUserData = action.payload;
            state.isLoading = false;
            state.isDelete = true;
            toast.success('Successfully assigned property removed.', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        setPropertyFromStructur: (state, action) => {
            state.propertyFromStructur = action.payload;
        },
        handleErrorDeleteUserData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error(action.payload.property, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        setPincodeSuggestions: (state, action) => {
            state.isLoading = false;
            state.pincodeSuggestions = action.payload.pincodes;
            state.totalRecords = action.payload.totalRecords;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
        },
        clearPincodeSuggestions: (state) => {
            state.pincodeSuggestions = [];
            state.totalRecords = 0;
            state.currentPage = 1;
            state.totalPages = 1;
        },
        setError: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.pincodeSuggestions = [];
        }
    }
});

export const {
    setLoading,
    handlePropertyAssignData,
    handleMultiPropertyAssignData,
    handleErrorMultiPropertyData,
    handleErrorPropertyData,
    handlePropertyAssignedData,
    handleTenantAssignedData,
    handleErrorPropertyAssignedData,
    handleDeleteUserData,
    handleErrorDeleteUserData,
    handlePropertyDataByid,
    setPropertyFromStructur,
    handlePropertyTransferData,
    handleErrorPropertyTransferData,
    handlePropertyOwnerHistoryData,
    handlePropertyBusinessData,
    setPincodeSuggestions,
    clearPincodeSuggestions,
    setError
} = propertySlice.actions;
export default propertySlice.reducer;
export const propertyAssignRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await propertyAssignRequestApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyAssignData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyData(error.response.data.errors));
        } else {
            return dispatch(handleErrorPropertyData(error.message));
        }
    }
};

export const getPropertyAssignedData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await propertyDataApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyAssignedData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyAssignedData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorPropertyAssignedData(error.message));
        }
    }
};
export const getTenantAssignedData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await tenantDataApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleTenantAssignedData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyAssignedData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorPropertyAssignedData(error.message));
        }
    }
};
export const getPropertyDataByid = (id) => async (dispatch, getState) => {
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
        const { data } = await propertyDetailsByid(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyDataByid(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyAssignedData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorPropertyAssignedData(error.message));
        }
    }
};

export const deleteAssignedProperty = (ids) => async (dispatch, getState) => {
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
        const { data } = await deleteAssignedPropertyApi(ids, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleDeleteUserData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorDeleteUserData(error.response.data.errors));
        } else {
            dispatch(handleErrorDeleteUserData(error.message));
        }
    }
};

export const multiPropertyAssignRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await multiPropertyAssignRequestApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleMultiPropertyAssignData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorMultiPropertyData(error.response.data.errors));
        } else {
            return dispatch(handleErrorMultiPropertyData(error.message));
        }
    }
};

export const propertyTransferRequest = (id, reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await propertyTransferApi(id, reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyTransferData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyTransferData(error.response.data.errors));
        } else {
            return dispatch(handleErrorPropertyTransferData(error.message));
        }
    }
};

export const getPropertyOwnerHistory = (id) => async (dispatch, getState) => {
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
        const { data } = await propertyOwnerHistoryApi(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyOwnerHistoryData(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyAssignedData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorPropertyAssignedData(error.message));
        }
    }
};
export const propertyBusinessRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await propertyBusinessRequestApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyBusinessData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyData(error.response.data.errors));
        } else {
            return dispatch(handleErrorPropertyData(error.message));
        }
    }
};

// export const updatePropertyBusinessRequest = (id, reqData) => async (dispatch, getState) => {
//     try {
//         dispatch(setLoading());
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token
//             }
//         };
//         const { data } = await propertyBusinessUpdateApi(id, reqData, config);
//         console.log(data, "updated API data");

//         const { statusCode } = data;
//         if (statusCode === 200) {
//             dispatch(handlePropertyBusinessData(data));
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             dispatch(handleErrorPropertyData(error.response.data.errors));
//         } else {
//             dispatch(handleErrorPropertyData(error.message));
//         }
//     }
// };

// export const updatePropertyBusinessRequest = (id, reqData) => async (dispatch, getState) => {
//     try {
//         dispatch(setLoading());
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: `Bearer ${getState()?.auth?.token}` // Make sure to include "Bearer" for token
//             }
//         };

//         const { data } = await propertyBusinessRequestApi(id, reqData, config);
//         console.log(data, "Updated API Data");

//         const { statusCode } = data;
//         if (statusCode === 200) {
//             dispatch(handlePropertyBusinessData(data));
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             dispatch(handleErrorPropertyData(error.response.data.errors));
//         } else {
//             dispatch(handleErrorPropertyData(error.message));
//         }
//     }
// };

export const tenantTransferRequest = (id, reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await tenantTransferApi(id, reqData, config);
        console.log(data, 'tenantTransferApi');
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyTransferData(data));
        }
    } catch (error) {
        console.log('error: ', error);
        if (error.response && error.response.data.errors) {
            console.log(error.response, '::::::');
            return dispatch(handleErrorPropertyTransferData(error.response.data.errors));
        } else {
            return dispatch(handleErrorPropertyTransferData(error.message));
        }
    }
};

export const deleteAssignedTenant = (id, reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await deleteAssignedTenantApi(id._id, reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyTransferData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyTransferData(error.response.data.errors));
        } else {
            return dispatch(handleErrorPropertyTransferData(error.message));
        }
    }
};

export const fetchPincodeRequest =
    (searchTerm, page = 1, limit = 10) =>
    async (dispatch) => {
        try {
            dispatch(setLoading());

            const response = await getAddressFromPincode({
                searchTerm,
                page,
                limit
            });
            console.log(response, 'response');

            // Check if response has data and correct structure
            if (response?.data?.data) {
                const { pincodes, totalRecords, currentPage, totalPages } = response.data.data;

                dispatch(
                    setPincodeSuggestions({
                        pincodes: pincodes || [],
                        totalRecords: totalRecords || 0,
                        currentPage: currentPage || 1,
                        totalPages: totalPages || 1
                    })
                );

                // Return the pincodes array for immediate use if needed
                return pincodes;
            } else {
                dispatch(setError('Invalid response format'));
            }
        } catch (error) {
            let errorMessage = 'Failed to fetch pincode suggestions';

            if (error.response?.data?.errors) {
                errorMessage = error.response.data.errors;
            } else if (error.message) {
                errorMessage = error.message;
            }

            dispatch(setError(errorMessage));
            return [];
        }
    };
