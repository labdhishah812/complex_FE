import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { createComplaint, getComplaintsApi, complaintRemoveApi, updateComplainApi, updateComplainStatusApi, getComlaintDetailById } from '../../../service/api';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    complaintsData: null,
    complaintDetailById: null,
};
const complaintSlice = createSlice({
    name: 'complaint',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.complaintsData = null;
            state.complaintDetailById = null;
        },
        handleCreateComplaintData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorCreateComplaintData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error(action.payload.property, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleComplaintsData: (state, action) => {
            state.complaintsData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleComplaintsDetailById: (state, action) => {
            state.complaintDetailById = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorComplaintsData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleComplaintRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.data, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorComplaintRemoveData: (state, action) => {
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

export const { setLoading, handleComplaintsDetailById, handleCreateComplaintData, handleErrorCreateComplaintData, handleComplaintsData, handleErrorComplaintsData, handleComplaintRemoveData, handleErrorComplaintRemoveData } = complaintSlice.actions;
export default complaintSlice.reducer;

export const complaintAssignRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createComplaint(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateComplaintData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateComplaintData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateComplaintData(error.message));
        }
    }
};

export const getComplaintsData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getComplaintsApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleComplaintsData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorComplaintsData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorComplaintsData(error.message));
        }
    }
};

export const complaintRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await complaintRemoveApi(id._id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleComplaintRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorComplaintRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorComplaintRemoveData(error.message));
        }
    }
};

export const updateComplaintRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateComplainApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCreateComplaintData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateComplaintData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateComplaintData(error.message));
        }
    }
};
export const updateComplaintStatusRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateComplainStatusApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCreateComplaintData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateComplaintData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateComplaintData(error.message));
        }
    }
};
export const getComplaintDetailByIdRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await getComlaintDetailById(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleComplaintsDetailById(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateComplaintData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateComplaintData(error.message));
        }
    }
};
