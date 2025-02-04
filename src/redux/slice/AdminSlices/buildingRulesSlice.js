import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from './authSlice';
import { createBuildingRulesApi, updateBuildingRulesApi, removeBuildingRulesApi, getBuildingRulesApi, gwtBuildingRulesByIDApi } from '../../../service/api';

const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    buildingRulesList: null,
    buildingRulesById: null,
};
const buildingRulesSlice = createSlice({
    name: 'buildingRules',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.buildingRulesById = null;

        },
        handleBuildingRulesCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorBuildingRulesCreateData: (state, action) => {
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
        handleBuildingRulesList: (state, action) => {
            state.buildingRulesList = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorBuildingRulesList: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleBuildingRulesDetailById: (state, action) => {
            state.buildingRulesById = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleBuildingRulesDelete: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleBuildingRulesDtaById: (state, action) => {
            state.buildingRulesById = action.payload.data;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
    }
});
export const {
    setLoading,
    handleBuildingRulesCreateData,
    handleErrorBuildingRulesCreateData,
    handleBuildingRulesList,
    handleErrorBuildingRulesList,
    handleBuildingRulesDetailById,
    handleBuildingRulesDelete,
    handleBuildingRulesDtaById,
} = buildingRulesSlice.actions;
export default buildingRulesSlice.reducer;

export const buildingRulesCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createBuildingRulesApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleBuildingRulesCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorBuildingRulesCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorBuildingRulesCreateData(error.message));
        }
    }
};

export const getBuildingRules = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getBuildingRulesApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleBuildingRulesList(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorBuildingRulesList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorBuildingRulesList(error.message));
        }
    }
};
export const getBuildingRulesById = (id) => async (dispatch, getState) => {
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
        const { data } = await gwtBuildingRulesByIDApi(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleBuildingRulesDtaById({
                data: data.data
            }));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorBuildingRulesList(error.response.data.errors));
        } else {
            if (error.response?.data?.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorBuildingRulesList(error.message));
        }
    }
};
export const buildingRulesUpdateRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateBuildingRulesApi(id, reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleBuildingRulesCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorBuildingRulesCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorBuildingRulesCreateData(error.message));
        }
    }
};
export const removeBuildingRules = (reqData) => async (dispatch, getState) => {
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
        const { data } = await removeBuildingRulesApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleBuildingRulesDelete(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorBuildingRulesCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorBuildingRulesCreateData(error.message));
        }
    }
};

