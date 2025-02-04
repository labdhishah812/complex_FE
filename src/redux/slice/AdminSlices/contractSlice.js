import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from './authSlice';
import { contractDetailById, contractHistoryApi, contractRemoveApi, createContractApi, getContractListApi, renewContractApi, updateContractApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    contractData: null,
    contractDataById: null,
    contractHistory: [], // Added for history
    historyLoading: false
};
const contractSlice = createSlice({
    name: 'contract',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.contractDataById = null;
        },
        handleContractCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message ? action.payload?.message : 'Successfully Contract Created', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorContractCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error('Something went to wrong', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleContractData: (state, action) => {
            state.contractData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleContractDataById: (state, action) => {
            state.contractDataById = action.payload.data;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorContractData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleContractRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.data, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorContractRemoveData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            state.isDelete = false;
            toast.error('Something Went wrong', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        setHistoryLoading: (state) => { // New reducer for history loading
            state.historyLoading = true;
        },
        handleContractHistory: (state, action) => { // New reducer for history success
            state.contractHistory = action.payload || [];
            state.historyLoading = false;
        },
        handleErrorContractHistory: (state, action) => { // New reducer for history error
            state.errors = action.payload;
            state.historyLoading = false;
            toast.error('Failed to fetch contract history', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
    }
});
export const { setLoading, handleContractCreateData, handleErrorContractCreateData,handleContractData, handleContractDataById, handleErrorContractData, handleContractRemoveData, handleErrorContractRemoveData,setHistoryLoading,handleContractHistory,handleErrorContractHistory} = contractSlice.actions;
export default contractSlice.reducer;
export const contractCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createContractApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleContractCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContractCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorContractCreateData(error.message));
        }
    }
};

export const getContractData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getContractListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleContractData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContractData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorContractData(error.message));
        }
    }
};
export const getContractDataById = (id) => async (dispatch, getState) => {
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
        const { data } = await contractDetailById(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleContractDataById(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContractData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorContractData(error.message));
        }
    }
};
export const updateContractRequest = (id, reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await updateContractApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleContractCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContractCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorContractCreateData(error.message));
        }
    }
};
export const contractRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await contractRemoveApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleContractRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContractRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorContractRemoveData(error.message));
        }
    }
};
export const renewContractRequest = (id, reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await renewContractApi(id, reqData, config);
        console.log(data,"dataaa");
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleContractCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContractCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorContractCreateData(error.message));
        }
    }
};
export const getContractHistory = (company_name) => async (dispatch, getState) => {
    try {
        dispatch(setHistoryLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token,
            },
        };

        const { data } = await contractHistoryApi({ company_name }, config);
        console.log(data, "Full response data");

        const { statusCode, data: contractData, message } = data;

        if (statusCode === 200) {
            console.log(contractData, "Contract history data"); // Log only the array
            dispatch(handleContractHistory(contractData)); // Pass the array to your reducer
        } else {
            console.warn(message, "Unexpected response status code");
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            console.error(error.response.data.errors, "API errors");
            return dispatch(handleErrorContractHistory(error.response.data.errors));
        } else {
            if (error.response?.data?.statusCode === 401) {
                dispatch(handleLogout());
            }
            console.error(error.message, "Unhandled error");
            return dispatch(handleErrorContractHistory(error.message));
        }
    }
};





