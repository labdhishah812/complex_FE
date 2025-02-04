import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from './authSlice';
import { getMeetingDetailByIdApi, getContactListApi, createContactApi, updateContyactApi, removeContactApi } from '../../../service/api';

const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    contactlist: null,
    contactDetailById: null,


    // rentalAssignedData: null,
    // rentalData: null,
    // userAssignData: null,
    // rentalDetailByid: null,
};
const emergencyContactSlice = createSlice({
    name: 'emergencyContact',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.contactDetailById = null;

        },
        handleContactCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorContactCreateData: (state, action) => {
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
        handleContactList: (state, action) => {
            state.contactlist = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorContactList: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleContactDetailById: (state, action) => {
            state.contactDetailById = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleContactDelete: (state, action) => {
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
    handleContactCreateData,
    handleErrorContactCreateData,
    handleContactList,
    handleErrorContactList,
    handleContactDetailById,
    handleContactDelete,
} = emergencyContactSlice.actions;
export default emergencyContactSlice.reducer;

export const contactCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createContactApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleContactCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContactCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorContactCreateData(error.message));
        }
    }
};

export const getContactList = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getContactListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleContactList(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContactList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorContactList(error.message));
        }
    }
};
export const getMeetingDetailById = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getMeetingDetailByIdApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleContactDetailById(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContactList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorContactList(error.message));
        }
    }
};
export const contactUpdateRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateContyactApi(id, reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleContactCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContactCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorContactCreateData(error.message));
        }
    }
};
export const removeContact = (reqData) => async (dispatch, getState) => {
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
        const { data } = await removeContactApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleContactDelete(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorContactCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorContactCreateData(error.message));
        }
    }
};

