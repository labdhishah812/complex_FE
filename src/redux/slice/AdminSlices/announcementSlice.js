import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { announcementCreateApi, getAnnouncementApi, announcementRemoveApi, updateAnnouncementApi, getAnnouncementDetailByIdApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    announcementCreateData: null,
    announcementData: null,
    announcementDetailById: null,
};
const announcementSlice = createSlice({
    name: 'announcement',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.announcementCreateData = null;
            state.announcementDetailById = null;
        },
        handleAnnouncementCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorAnnouncementCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error('Something went to wrong', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleAnnouncementData: (state, action) => {
            state.announcementData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleAnnouncementDetailById: (state, action) => {
            state.announcementDetailById = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorAnnouncementData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleAnnouncementRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.data, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorAnnouncementRemoveData: (state, action) => {
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
export const { setLoading, handleAnnouncementDetailById, handleAnnouncementCreateData, handleErrorAnnouncementCreateData, handleAnnouncementData, handleErrorAnnouncementData, handleAnnouncementRemoveData, handleErrorAnnouncementRemoveData } = announcementSlice.actions;
export default announcementSlice.reducer;
export const announcementCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await announcementCreateApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleAnnouncementCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorAnnouncementCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorAnnouncementCreateData(error.message));
        }
    }
};

export const getAnnouncementData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getAnnouncementApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleAnnouncementData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorAnnouncementData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorAnnouncementData(error.message));
        }
    }
};

export const announcementRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await announcementRemoveApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleAnnouncementRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorAnnouncementRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorAnnouncementRemoveData(error.message));
        }
    }
};

export const updateAnnouncementRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateAnnouncementApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleAnnouncementCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorAnnouncementCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorAnnouncementCreateData(error.message));
        }
    }
};
export const getAnnouncementDetailByIdRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await getAnnouncementDetailByIdApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleAnnouncementDetailById(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorAnnouncementCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorAnnouncementCreateData(error.message));
        }
    }
};
