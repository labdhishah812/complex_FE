import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { updateRentalStatusApi, rentalAssignApi, getRentalListApi, updateRentalAssignApi, rentalRemoveApi, getPropertyDropDownForUser, getRentalDetailByid } from '../../../service/api';

const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    rentalAssignedData: null,
    rentalData: null,
    userAssignData: null,
    rentalDetailByid: null,
};
const rentalSlice = createSlice({
    name: 'rental',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
        },
        handleRentalCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorRentalCreateData: (state, action) => {
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
        handleRentalData: (state, action) => {
            state.rentalData = action.payload;
            state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorRentalData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleUserPropertyAssignData: (state, action) => {
            state.userAssignData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleRentalDataByid: (state, action) => {
            state.rentalDetailByid = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorUserPropertyAssignData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleRentalRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleRentalStatus: (state, action) => {
            state.isLoading = false;
            state.successMessage = action.payload?.message;
            state.isDelete = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorRentalStatus: (state, action) => {
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
        handleErrorRentalRemoveData: (state, action) => {
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
export const {
    setLoading,
    handleRentalCreateData,
    handleErrorRentalCreateData,
    handleRentalData,
    handleUserPropertyAssignData,
    handleErrorRentalData,
    handleErrorUserPropertyAssignData,
    handleRentalRemoveData,
    handleErrorRentalRemoveData,
    handleRentalStatus,
    handleErrorRentalStatus,
    handleRentalDataByid
} = rentalSlice.actions;
export default rentalSlice.reducer;

export const rentalCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await rentalAssignApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleRentalCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRentalCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorRentalCreateData(error.message));
        }
    }
};

export const getRentalData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getRentalListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleRentalData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRentalData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorRentalData(error.message));
        }
    }
};

export const updateRentalAssignRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateRentalAssignApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleRentalCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRentalCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorRentalCreateData(error.message));
        }
    }
};

export const rentalRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await rentalRemoveApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleRentalRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRentalRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorRentalRemoveData(error.message));
        }
    }
};
export const getUserPropertyAssignData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getPropertyDropDownForUser(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleUserPropertyAssignData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUserPropertyAssignData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorUserPropertyAssignData(error.message));
        }
    }
};

export const updateRentalStatus = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateRentalStatusApi(id, reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleRentalStatus(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRentalStatus(error.response.data.errors));
        } else {
            return dispatch(handleErrorRentalStatus(error.message));
        }
    }
};
export const getRentalDataByid = (id) => async (dispatch, getState) => {
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
        const { data } = await getRentalDetailByid(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleRentalDataByid(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUserPropertyAssignData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorUserPropertyAssignData(error.message));
        }
    }
};

