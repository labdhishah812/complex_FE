import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { getNotifications, getNotificationsForWeb, markAsReadNotifications } from '../../../service/api';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    notificationsData: []
};
const notificationSlice = createSlice({
    name: 'notification',
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
        handleNotificationData: (state, action) => {
            state.notificationsData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleMarkAsReadNotificationSuccess: (state, action) => {
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            window.location.reload();
        },
        handleErrorNotificationData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        }
    }
});
export const {
    setLoading,
    handleVendorTypeData,
    handleNotificationData,
    handleErrorNotificationData,
    handleVendorData,
    handleMarkAsReadNotificationSuccess,
    handleErrorVendorData,
    handleVendorRemoveData,
    handleErrorVendorRemoveData,
    handleVendorDataById
} = notificationSlice.actions;
export default notificationSlice.reducer;
export const getNotificationRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getNotificationsForWeb(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleNotificationData(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorNotificationData(error.response.data.errors));
        } else {
            return dispatch(handleErrorNotificationData(error.message));
        }
    }
};
export const markAsReadRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await markAsReadNotifications(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleMarkAsReadNotificationSuccess(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorNotificationData(error.response.data.errors));
        } else {
            return dispatch(handleErrorNotificationData(error.message));
        }
    }
};
