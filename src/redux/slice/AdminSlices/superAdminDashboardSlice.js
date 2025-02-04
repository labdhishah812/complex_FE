import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from './authSlice';

import { getLatsFiveDataApi, getLatsInactiveDataApi, getGrapgDataApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    errors: null,
    successMessage: '',
    lastFiveData: null,
    lastInactive: null,
    graphData: null,
};

const superDashboardSlice = createSlice({
    name: 'superAdminDashboard',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.successMessage = '';
            // state.lastFiveData = null;
            // state.lastInactive = null;
        },
        handleLastFiveComplexData: (state, action) => {
            state.lastFiveData = action.payload;
            state.isLoading = false;
        },
        handleLastInactiveComplexData: (state, action) => {
            state.lastInactive = action.payload;
            state.isLoading = false;
        },
        handleGraphData: (state, acction) => {
            state.graphData = acction.payload;
            state.isLoading = false;
        },
        handleError: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
    }
});


export const {
    setLoading,
    handleError,
    handleGraphData,
    handleLastFiveComplexData,
    handleLastInactiveComplexData,
} = superDashboardSlice.actions;
export default superDashboardSlice.reducer;

export const getLastFiveRequest = () => async (dispatch, getState) => {
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
        const { data } = await getLatsFiveDataApi(config);
        // console.log(data, 'data');
        const { statusCode, data: complexData } = data;

        if (statusCode === 200) {
            dispatch(handleLastFiveComplexData(complexData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleLogout());
        } else {
            dispatch(handleError(error.message));
        }
    }
};
export const getLastInactiveRequest = () => async (dispatch, getState) => {
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
        const { data } = await getLatsInactiveDataApi(config);
        // console.log(data, 'data');
        const { statusCode, data: complexData } = data;

        if (statusCode === 200) {
            dispatch(handleLastInactiveComplexData(complexData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleLogout());
        } else {
            dispatch(handleError(error.message));
        }
    }
};

export const getGraphDataRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getGrapgDataApi(reqData, config);
        // console.log(data, 'data');
        const { statusCode, data: complexData } = data;

        if (statusCode === 200) {
            dispatch(handleGraphData(complexData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleLogout());
        } else {
            dispatch(handleError(error.message));
        }
    }
};