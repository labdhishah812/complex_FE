import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { getResolutionsDetailByid, removeResolutionApi, resolutionsCreateApi, resolutionsUpdateApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isCreated: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    resolutionData: null,
    resolutionDataById: null,

};
const resolutionSlice = createSlice({
    name: 'resolution',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
        },
        handleResolutionCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
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
        handleResolutionRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleResolutionDataByid: (state, action) => {
            state.resolutionDataById = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorResolutionData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        setDefaultState: (state) => {
            state.resolutionDataById = null;
            state.isCreated = false;
        },
    }
});
export const { setLoading, setDefaultState, handleResolutionCreateData, handleResolutionRemoveData, handleErrorRoleCreateData, handleResolutionDataByid, handleErrorResolutionData } = resolutionSlice.actions;
export default resolutionSlice.reducer;
export const resolutionCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await resolutionsCreateApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleResolutionCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRoleCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorRoleCreateData(error.message));
        }
    }
};
export const getResolutionDataById = (id) => async (dispatch, getState) => {
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
        const { data } = await getResolutionsDetailByid(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleResolutionDataByid(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorResolutionData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorResolutionData(error.message));
        }
    }
};
export const resolutionUpdateRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await resolutionsUpdateApi(id, reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleResolutionCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRoleCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorRoleCreateData(error.message));
        }
    }
};
// export const getRolesData = (reqData) => async (dispatch, getState) => {
//     try {
//         dispatch(setLoading());
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token
//             }
//         };
//         const { data } = await getRoleListApi(reqData, config);
//         const { statusCode } = data;
//         if (statusCode === 200) {
//             dispatch(handleRolesData(data));
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             return dispatch(handleErrorRolesData(error.response.data.errors));
//         } else {
//             if (error.response.data.statusCode === 401) {
//                 dispatch(handleLogout());
//             }
//             return dispatch(handleErrorRolesData(error.message));
//         }
//     }
// };
// export const updateRoleRequest = (id, reqData) => async (dispatch, getState) => {
//     dispatch(setLoading());

//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token
//             }
//         };
//         const { data } = await updateRoleApi(id, reqData, config);
//         const { statusCode } = data;

//         if (statusCode === 200) {
//             dispatch(handleRoleCreateData(data));
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             return dispatch(handleErrorRoleCreateData(error.response.data.errors));
//         } else {
//             return dispatch(handleErrorRoleCreateData(error.message));
//         }
//     }
// };

export const resolutionRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await removeResolutionApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleResolutionRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorRoleCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorRoleCreateData(error.message));
        }
    }
};
// export const getRolesDataById = (id) => async (dispatch, getState) => {
//     dispatch(setLoading());
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token
//             }
//         };
//         const { data } = await getRoleDataById(id, config);

//         const { statusCode } = data;

//         if (statusCode === 200) {
//             dispatch(handleRoleDataById(data));
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             return dispatch(handleErrorRolesData(error.response.data.errors));
//         } else {
//             if (error.response.data.statusCode === 401) {
//                 dispatch(handleLogout());
//             }
//             return dispatch(handleErrorRolesData(error.message));
//         }
//     }
// };
