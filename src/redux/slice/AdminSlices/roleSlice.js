import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { roleCreateApi, getRoleListApi, updateRoleApi, roleRemoveApi, getRoleDataById } from '../../../service/api';
const initialState = {
    isLoading: false,
    isCreated: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    rolesData: null,
    rolesDataById: null,

};
const vendorSlice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
        },
        handleRoleCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorRoleCreateData: (state, action) => {
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
        handleRolesData: (state, action) => {
            state.rolesData = action.payload;
            state.rolesDataById = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleRoleDataById: (state, action) => {
            state.rolesDataById = action?.payload?.data;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorRolesData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleRoleRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorRoleRemoveData: (state, action) => {
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
export const { setLoading, handleRoleDataById, handleRoleCreateData, handleErrorRoleCreateData, handleRolesData, handleErrorRolesData, handleRoleRemoveData, handleErrorRoleRemoveData } = vendorSlice.actions;
export default vendorSlice.reducer;
export const roleCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await roleCreateApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleRoleCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRoleCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorRoleCreateData(error.message));
        }
    }
};
export const getRolesData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getRoleListApi(reqData, config);
        console.log(data , "data of sa")
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleRolesData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRolesData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorRolesData(error.message));
        }
    }
};
export const updateRoleRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateRoleApi(id, reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleRoleCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRoleCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorRoleCreateData(error.message));
        }
    }
};

export const roleRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await roleRemoveApi(id, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleRoleRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRoleRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorRoleRemoveData(error.message));
        }
    }
};
export const getRolesDataById = (id) => async (dispatch, getState) => {
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
        const { data } = await getRoleDataById(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleRoleDataById(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRolesData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorRolesData(error.message));
        }
    }
};
