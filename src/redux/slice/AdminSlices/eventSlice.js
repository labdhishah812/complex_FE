import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { createEventApi, getEventListApi, getEventDetailByIdApi, updateEventApi, removeEventApi } from '../../../service/api';

const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    eventlist: null,
    eventDetailById: null,


    // rentalAssignedData: null,
    // rentalData: null,
    // userAssignData: null,
    // rentalDetailByid: null,
};
const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.eventDetailById = null;

        },
        handleEventCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorEventCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error(action?.payload, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleEventList: (state, action) => {
            state.eventlist = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorEventList: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleEventDetailById: (state, action) => {
            state.eventDetailById = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleEventDelete: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
    }
});
export const {
    setLoading,
    handleEventCreateData,
    handleErrorEventCreateData,
    handleEventList,
    handleErrorEventList,
    handleEventDetailById,
    handleEventDelete
} = eventSlice.actions;
export default eventSlice.reducer;

export const eventCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createEventApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleEventCreateData(data));
        }
    } catch (error) {
        console.log(error,"errorr")
        if (error.response && error.response.data.data) {
            return dispatch(handleErrorEventCreateData(error.response.data.data));
        } else {
            return dispatch(handleErrorEventCreateData(error.message));
        }
    }
};

export const getEventList = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getEventListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleEventList(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorEventList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorEventList(error.message));
        }
    }
};
export const getEventDetailById = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getEventDetailByIdApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleEventDetailById(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorEventList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorEventList(error.message));
        }
    }
};
export const eventUpdateRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateEventApi(id, reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleEventCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorEventCreateData(error.response.data.data));
        } else {
            return dispatch(handleErrorEventCreateData(error.message));
        }
    }
};
export const removeEvent = (reqData) => async (dispatch, getState) => {
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
        const { data } = await removeEventApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleEventDelete(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorEventCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorEventCreateData(error.message));
        }
    }
};
