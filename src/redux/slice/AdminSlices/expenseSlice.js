import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from './authSlice';
import { createExpenseApi, expenseCategoryApi, expenseDetailById, expenseRemoveApi, getExpenseListApi, updateExpenseApi, updateExpenseStatusApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    expenseData: null,
    expenseDataById: null,
    expenseCategoryData: null
};
const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.expenseDataById = null;
        },
        handleExpenseCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message ? action.payload?.message : 'Successfully Expense Created', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorExpenseCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error('Something went to wrong', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleExpenseData: (state, action) => {
            state.expenseData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleExpenseDataById: (state, action) => {
            state.expenseDataById = action.payload.data;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorExpenseData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleExpenseCategoryData: (state, action) => {
            state.expenseCategoryData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleExpenseRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.data, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorExpenseRemoveData: (state, action) => {
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
export const {
    setLoading,
    handleExpenseCreateData,
    handleErrorExpenseCreateData,
    handleExpenseData,
    handleExpenseDataById,
    handleErrorExpenseData,
    handleExpenseRemoveData,
    handleErrorExpenseRemoveData,
    handleExpenseCategoryData

} = expenseSlice.actions;
export default expenseSlice.reducer;
export const expenseCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createExpenseApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 201) {
            dispatch(handleExpenseCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorExpenseCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorExpenseCreateData(error.message));
        }
    }
};

export const getExpenseData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getExpenseListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleExpenseData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorExpenseData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorExpenseData(error.message));
        }
    }
};
export const getExpenseDataById = (id) => async (dispatch, getState) => {
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
        const { data } = await expenseDetailById(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleExpenseDataById(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorExpenseData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorExpenseData(error.message));
        }
    }
};


export const updateExpenseRequest = (id, reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await updateExpenseApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleExpenseCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorExpenseCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorExpenseCreateData(error.message));
        }
    }
};

export const expenseRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await expenseRemoveApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleExpenseRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorExpenseRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorExpenseRemoveData(error.message));
        }
    }
};
export const getExpenseCategoryData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await expenseCategoryApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleExpenseCategoryData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorExpenseData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorExpenseData(error.message));
        }
    }
};
export const updateExpenseStatus = (id, reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await updateExpenseStatusApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleExpenseCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorExpenseCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorExpenseCreateData(error.message));
        }
    }
};