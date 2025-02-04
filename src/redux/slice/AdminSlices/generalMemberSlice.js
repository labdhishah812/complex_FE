import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from './authSlice';
import { userCommitteeCreateApi, getCommitteeListApi, updateCommitteeApi, committeeRemoveApi, getCommitteeDetailsApi, userGeneralMemberCreateApi, getGeneralMemberListApi, getGeneralMemberDetailsApi, updateGeneralMemberApi, generalMemberRemoveApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isCreated: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    generalMemberData: null,
    generalMemberDetailsByid: null,
};
const generalMembersSlice = createSlice({
    name: 'generalMember',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
        },
        handleUserCommitteeCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorUserCommitteeCreateData: (state, action) => {
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
        handleCommitteeData: (state, action) => {
            state.generalMemberData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleCommitteeDetailsByid: (state, action) => {
            state.generalMemberDetailsByid = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorCommitteeData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleCommitteeRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorCommitteeRemoveData: (state, action) => {
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
export const { setLoading, handleUserCommitteeCreateData, handleErrorUserCommitteeCreateData, handleCommitteeData, handleErrorCommitteeData, handleCommitteeRemoveData, handleErrorCommitteeRemoveData, handleCommitteeDetailsByid } =
    generalMembersSlice.actions;
export default generalMembersSlice.reducer;
export const userGeneralMemberCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await userGeneralMemberCreateApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleUserCommitteeCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUserCommitteeCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorUserCommitteeCreateData(error.message));
        }
    }
};
export const getGeneralMemberData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getGeneralMemberListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCommitteeData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCommitteeData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorCommitteeData(error.message));
        }
    }
};
export const getGeneralMemberDataByid = (id) => async (dispatch, getState) => {
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
        const { data } = await getGeneralMemberDetailsApi(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCommitteeDetailsByid(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCommitteeData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorCommitteeData(error.message));
        }
    }
};
export const updateGeneralMemberRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateGeneralMemberApi(id, reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleUserCommitteeCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUserCommitteeCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorUserCommitteeCreateData(error.message));
        }
    }
};

export const generalMemberRemoveRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await generalMemberRemoveApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCommitteeRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCommitteeRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCommitteeRemoveData(error.message));
        }
    }
};
