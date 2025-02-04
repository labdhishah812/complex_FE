import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { vendorAssignApi, getVendorListApi, updateVendorAssignApi, vendorRemoveApi, vendorDetailById, getVendorTypeApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    vendorAssignedData: null,
    vendorData: null,
    vendorDataById: null,
    vendorTypeData: null,
};
const vendorSlice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.vendorDataById = null;
        },
        handleVenderCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message ? action.payload?.message : 'Successfully Vendor Created', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorVendorCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error('Something went to wrong', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleVendorTypeData: (state, action) => {
            state.vendorTypeData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleVendorData: (state, action) => {
            state.vendorData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleVendorDataById: (state, action) => {
            state.vendorDataById = action.payload.data;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorVendorData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleVendorRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.data, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorVendorRemoveData: (state, action) => {
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
export const { setLoading, handleVendorTypeData, handleVenderCreateData, handleErrorVendorCreateData, handleVendorData, handleErrorVendorData, handleVendorRemoveData, handleErrorVendorRemoveData, handleVendorDataById } = vendorSlice.actions;
export default vendorSlice.reducer;
export const vendorCreateRequest = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await vendorAssignApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleVenderCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVendorCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorVendorCreateData(error.message));
        }
    }
};

export const getVendorData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getVendorListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleVendorData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVendorData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorVendorData(error.message));
        }
    }
};
export const getVendorTypeData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getVendorTypeApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleVendorTypeData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVendorData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorVendorData(error.message));
        }
    }
};
export const getVendorDataById = (id) => async (dispatch, getState) => {
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
        const { data } = await vendorDetailById(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleVendorDataById(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVendorData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorVendorData(error.message));
        }
    }
};


export const updateVendorAssignRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateVendorAssignApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleVenderCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVendorCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorVendorCreateData(error.message));
        }
    }
};

export const vendorRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await vendorRemoveApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleVendorRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVendorRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorVendorRemoveData(error.message));
        }
    }
};
