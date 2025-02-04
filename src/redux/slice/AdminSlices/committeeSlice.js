import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { getRoleDropDownApi, userCommitteeCreateApi, getCommitteeListApi, updateCommitteeApi, committeeRemoveApi, getCommitteeDetailsApi, userCreateGeneralMemberApi, generalMemberListApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isCreated: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    roleList: null,
    rolesData: null,
    committeeData: null,
    generalListData: null,
    committeeDetailsByid: null,
};
const vendorSlice = createSlice({
    name: 'committee',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
        },
        handleRoleList: (state, action) => {
            state.roleList = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorRolesList: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
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
            state.committeeData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleGeneralMemberData: (state, action) => {
            state.generalListData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleCommitteeDetailsByid: (state, action) => {
            state.committeeDetailsByid = action.payload;
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
export const { setLoading, handleRoleList, handleErrorRolesList, handleUserCommitteeCreateData, handleErrorUserCommitteeCreateData, handleCommitteeData, handleGeneralMemberData, handleErrorCommitteeData, handleCommitteeRemoveData, handleErrorCommitteeRemoveData, handleCommitteeDetailsByid } =
    vendorSlice.actions;
export default vendorSlice.reducer;
export const getRoleDropDownRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await getRoleDropDownApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleRoleList(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRolesList(error.response.data.errors));
        } else {
            return dispatch(handleErrorRolesList(error.message));
        }
    }
};
export const userCommitteeCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await userCommitteeCreateApi(reqData, config);
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
        const { data } = await userCreateGeneralMemberApi(reqData, config);
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
export const getCommitteeData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getCommitteeListApi(reqData, config);
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
export const getGeneralMemberListData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await generalMemberListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleGeneralMemberData(data));
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
export const getCommitteeDataByid = (id) => async (dispatch, getState) => {
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
        const { data } = await getCommitteeDetailsApi(id, config);
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
export const updateCommitteeRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateCommitteeApi(id, reqData, config);
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

export const committeeRemoveRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await committeeRemoveApi(reqData, config);

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
