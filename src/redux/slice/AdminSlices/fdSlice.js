import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from './authSlice';
import { createFdApi, fdDetailById, fdRemoveApi, getFdListApi, updateFdApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    fdData: null,
    fdDataById: null,};
const fdSlice = createSlice({
    name: 'contract',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.fdDataById = null;
        },
        handleFdCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message ? action.payload?.message : 'Successfully Contract Created', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorFdCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error('Something went to wrong', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleFdData: (state, action) => {
            state.fdData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleFdDataById: (state, action) => {
            state.fdDataById = action.payload.data;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorfdData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleFdRemoveData: (state, action) => {
            console.log(action,"action");
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorFdRemoveData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            state.isDelete = false;
            toast.error('Something Went wrong', {
                style: {
                    marginTop: '4rem'
                }
            });
        }
    }
});
export const { setLoading, handleFdCreateData, handleErrorFdCreateData,handleFdData, handleFdDataById, handleErrorfdData, handleFdRemoveData, handleErrorFdRemoveData} = fdSlice.actions;
export default fdSlice.reducer;
export const fdCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createFdApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleFdCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorFdCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorFdCreateData(error.message));
        }
    }
};

export const getfdData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getFdListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleFdData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorfdData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorfdData(error.message));
        }
    }
};
export const getfdDataById = (id) => async (dispatch, getState) => {
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
        const { data } = await fdDetailById(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleFdDataById(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorfdData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorfdData(error.message));
        }
    }
};


export const updateFdRequest = (id, reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await updateFdApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleFdCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorFdCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorFdCreateData(error.message));
        }
    }
};

export const fdRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await fdRemoveApi(id, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleFdRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorFdRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorFdRemoveData(error.message));
        }
    }
};
