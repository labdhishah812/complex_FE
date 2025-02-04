import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from './authSlice';
import { getNoticeDetailByIdApi, createNoticeApi, removeContactApi, updateNoticeApi, getNoticeListApi, removeNoticeApi } from '../../../service/api';

const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    noticelist: null,
    noticeDetailById: null,
};
const noticeSlice = createSlice({
    name: 'notice',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.noticeDetailById = null;

        },
        handleNoticeCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorNoticeCreateData: (state, action) => {
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
        handleNoticeList: (state, action) => {
            state.noticelist = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorNoticeList: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleNoticeDetailById: (state, action) => {
            state.noticeDetailById = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleNoticeDelete: (state, action) => {
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
    handleNoticeCreateData,
    handleErrorNoticeCreateData,
    handleNoticeList,
    handleErrorNoticeList,
    handleNoticeDetailById,
    handleNoticeDelete,
} = noticeSlice.actions;
export default noticeSlice.reducer;

export const noticeCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createNoticeApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleNoticeCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorNoticeCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorNoticeCreateData(error.message));
        }
    }
};

export const getNoticeList = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getNoticeListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleNoticeList(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorNoticeList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorNoticeList(error.message));
        }
    }
};
export const getNoticeDetailById = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getNoticeDetailByIdApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleNoticeDetailById(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorNoticeList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorNoticeList(error.message));
        }
    }
};
export const noticeUpdateRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateNoticeApi(id, reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleNoticeCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorNoticeCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorNoticeCreateData(error.message));
        }
    }
};
export const removeNotice = (reqData) => async (dispatch, getState) => {
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
        const { data } = await removeNoticeApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleNoticeDelete(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorNoticeCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorNoticeCreateData(error.message));
        }
    }
};

