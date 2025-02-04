import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { getGateKepperAssignApi, getGateKepperListApi, getVendorTypeApi, updateGateKeeperAssignApi, gateKeeperDetailById, gateKeeperRemoveApi, fetchContractTypesApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    vendorAssignedData: null,
    generalListData: null,
    vendorDataById: null,
    vendorTypeData: null,
    types: []
};
const gateKepperSlice = createSlice({
    name: 'gatekeeper',
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
        clearLoading: (state) => {
            state.isLoading = false;
        },
        handleVenderCreateData: (state, action) => {
            console.log('action: ', action);
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message ? action.payload?.message : 'Successfully Gate Keeper Created', {
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
        handleGateKepperData: (state, action) => {
            state.generalListData = action.payload;
            state.types = action.payload
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleVendorDataById: (state, action) => {
            state.vendorDataById = action.payload.data;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorGateKepper: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleVendorRemoveData: (state, action) => {
            state.successMessage = 'Successfully Gate Keeper Deleted';
            state.isLoading = false;
            state.isDelete = true;
            toast.success('Successfully Gate Keeper Deleted', {
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
        },
        handleGetLableData: (state, action) => {
            state.countryList = action.payload;
            state.isLoading = false;
        },
    }
});
export const { setLoading,clearLoading, handleVendorTypeData, handleVenderCreateData, handleErrorVendorCreateData, handleGateKepperData, handleErrorGateKepper, handleVendorRemoveData, handleErrorVendorRemoveData, handleVendorDataById, setContractTypes, setError } = gateKepperSlice.actions;
export default gateKepperSlice.reducer;
export const gateKeeperCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getGateKepperAssignApi(reqData, config);
        console.log('data: ', data);

        const { statusCode } = data;
        if (statusCode === 201) {
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

export const getGateKeeperData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getGateKepperListApi(reqData, config);
        console.log('data: ', data);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleGateKepperData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorGateKepper(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorGateKepper(error.message));
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
            return dispatch(handleErrorGateKepper(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorGateKepper(error.message));
        }
    }
};
export const getGateKeeperById = (id) => async (dispatch, getState) => {
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
        const { data } = await gateKeeperDetailById(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleVendorDataById({
                data: data.data
            }));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorGateKepper(error.response.data.errors));
        } else {
            if (error.response?.data?.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorGateKepper(error.message));
        }
    }
};


export const updateGateKeeperAssignRequest = (id, reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await updateGateKeeperAssignApi(id, reqData, config);
        console.log('data: ', data);

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

export const GateKeeperRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await gateKeeperRemoveApi(id, config);

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
export const fetchContractTypes = () => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                Authorization: getState()?.auth?.token,
            }
        };
        const response = await fetchContractTypesApi(config);

        if (response?.data?.data && Array.isArray(response.data.data)) {
            const formattedTypes = response.data.data.map(item => ({
                label: item.company_name,
                value: item._id
            }));
            dispatch(handleGateKepperData(formattedTypes));
        } else {
            dispatch(handleErrorGateKepper('No contract types available'));
        }
    } catch (error) {
        console.error('Contract types fetch error:', error);
        dispatch(handleErrorGateKepper(error.message || 'Failed to fetch contract types'));
    } finally {
        dispatch(clearLoading());
    }
};
