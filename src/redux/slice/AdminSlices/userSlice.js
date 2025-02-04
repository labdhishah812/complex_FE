import { createSlice } from '@reduxjs/toolkit';
import { createUserApi, deleteUserApi, editUserApi, getAllUserNameApi, getAllUsersApi, multipaldeleteUserApi, getUserDropdownApi, userDetailsByPropertyAssignedID, getUserDropdownApiForTenant, getUserDropdownPropertyAssignApi } from '../../../service/api';

const initialState = {
    isLoading: false,
    userData: null,
    userDropdownData: null,
    createdUserData: null,
    userDetailsByProperty: null,
    editedUserData: null,
    deletedUserData: null,
    deletedMultiUserData: null,
    userList: null,
    errors: null,
    successMessage: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.userDetailsByProperty = null;
        },
        handleAllGetUserData: (state, action) => {
            state.userData = action.payload;
            state.isLoading = false;
        },
        handleGetUserDropdown: (state, action) => {
            state.userDropdownData = action.payload.data;
            state.isLoading = false;
        },
        handleErrorGetUserDropdown: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorAllGetUserData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleUserDetailsByPropertyId: (state, action) => {
            state.userDetailsByProperty = action.payload.data;
            state.isLoading = false;
        },
        handleCreateUserData: (state, action) => {
            state.createdUserData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorUserDetailsByPropertyId: (state, action) => {
            state.userDetailsByProperty = null;
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorCreateUserData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleEditUserData: (state, action) => {
            state.editedUserData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorUserData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleDeleteUserData: (state, action) => {
            state.successMessage = action.payload.message;
            state.deletedUserData = action.payload;
            state.isLoading = false;
        },
        handleErrorDeleteUserData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleMultipalDeleteUserData: (state, action) => {
            state.deletedMultiUserData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorMultipalDeleteUserData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleGetUserNameData: (state, action) => {
            state.userList = action.payload;
            state.isLoading = false;
        },
        handleErrorGetUserData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleResetUser: (state) => {
            state.isLoading = false;
            // state.userData = null;
            state.createdUserData = null;
            state.editedUserData = null;
            state.deletedUserData = null;
            state.deletedMultiUserData = null;
            state.userList = null;
            state.successMessage = null;
            state.errors = null;
        }
    }
});

export const {
    setLoading,
    handleUserDetailsByPropertyId,
    handleErrorUserDetailsByPropertyId,
    handleGetUserDropdown,
    handleErrorGetUserDropdown,
    handleAllGetUserData,
    handleErrorAllGetUserData,
    handleCreateUserData,
    handleErrorCreateUserData,
    handleEditUserData,
    handleErrorUserData,
    handleDeleteUserData,
    handleErrorDeleteUserData,
    handleMultipalDeleteUserData,
    handleErrorMultipalDeleteUserData,
    handleGetUserNameData,
    handleErrorAllUserNameData,
    handleResetUser
} = userSlice.actions;
export default userSlice.reducer;

export const getAllUserRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getAllUsersApi(config, queryStr);
        const { statusCode, data: UserData } = data;

        if (statusCode === 200) {
            dispatch(handleAllGetUserData(UserData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorAllGetUserData(error));
        } else {
            dispatch(handleErrorAllGetUserData(error.message));
        }
    }
};

export const createUserRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createUserApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 201) {
            dispatch(handleCreateUserData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateUserData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateUserData(error.message));
        }
    }
};

export const editUserRequest = (id, reqData) => async (dispatch, getState) => {
    dispatch(setLoading());

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                // 'Authorization': token,
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await editUserApi(id, reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleEditUserData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUserData(error.response.data.errors));
        } else {
            return dispatch(handleErrorUserData(error.message));
        }
    }
};
export const deleteUserRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await deleteUserApi(id, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleDeleteUserData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorDeleteUserData(error.response.data.errors));
        } else {
            dispatch(handleErrorDeleteUserData(error.message));
        }
    }
};

export const multipaldeleteUserRequest = (MultiData) => async (dispatch, getState) => {
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
        const { data } = await multipaldeleteUserApi(MultiData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleMultipalDeleteUserData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorMultipalDeleteUserData(error.response.data.errors));
        } else {
            return dispatch(handleErrorMultipalDeleteUserData(error.message));
        }
    }
};
export const getAllUserNameRequest = () => async (dispatch, getState) => {
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
        const { data } = await getAllUserNameApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleGetUserNameData(data?.data));
        }
    } catch (err) {
        dispatch(handleErrorAllUserNameData(err));
    }
};

export const getUserDropdown = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getUserDropdownApi(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleGetUserDropdown(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorGetUserDropdown(error));
        } else {
            dispatch(handleErrorGetUserDropdown(error.message));
        }
    }
};

export const getUserDropdownForPropertyAssign = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getUserDropdownPropertyAssignApi(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleGetUserDropdown(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorGetUserDropdown(error));
        } else {
            dispatch(handleErrorGetUserDropdown(error.message));
        }
    }
};

export const getUserDropdownForTenant = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getUserDropdownApiForTenant(config, queryStr);
        console.log(data , "dataaaa")
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleGetUserDropdown(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorGetUserDropdown(error));
        } else {
            dispatch(handleErrorGetUserDropdown(error.message));
        }
    }
};

export const userDetailsByPropertyId = (reqData) => async (dispatch, getState) => {
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
        const { data } = await userDetailsByPropertyAssignedID(reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleUserDetailsByPropertyId(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUserDetailsByPropertyId(error.response.data.errors));
        } else {
            return dispatch(handleErrorUserDetailsByPropertyId(error.message));
        }
    }
};
