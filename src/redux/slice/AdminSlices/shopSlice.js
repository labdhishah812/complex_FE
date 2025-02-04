import { createSlice } from '@reduxjs/toolkit';
import { createShopApi, deleteShopApi, editShopApi, getAllBlockNameApi, getAllFloorNameApi, getAllShopApi, getAllShopNameApi, multipaldeleteShopApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    shopData: null,
    createdShopData: null,
    editedShopData: null,
    deletedShopData: null,
    deletedMultiShopData: null,
    blockList: null,
    floorList: null,
    shopList: null,
    errors: null,
    successMessage: ''
};

const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
        },
        handleAllGetShopData: (state, action) => {
            state.shopData = action.payload;
            state.isLoading = false;
        },
        handleErrorAllGetShopData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleDeleteShopData: (state, action) => {
            state.deletedShopData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorDeleteShopData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleCreateShopData: (state, action) => {
            state.createdShopData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorCreateShopData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleEditShopData: (state, action) => {
            state.editedShopData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorShopData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleMultipalDeleteShopData: (state, action) => {
            state.deletedMultiShopData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorMultipalDeleteShopData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleGetBlockNameData: (state, action) => {
            state.blockList = action.payload;
            state.isLoading = false;
        },
        handleErrorAllBlockNameData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleGetFloorNameData: (state, action) => {
            state.floorList = action.payload;
            state.isLoading = false;
        },
        handleErrorAllFloorNameData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleGetShopNameData: (state, action) => {
            state.shopList = action.payload;
            state.isLoading = false;
        },
        handleErrorAllShopNameData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleResetShop: (state) => {
            state.isLoading = false;
            state.createdShopData = null;
            state.editedShopData = null;
            state.blockList = null;
            state.floorList = null;
            state.shopList = null;
            state.deletedMultiShopData = null;
            state.deletedShopData = null;
            state.successMessage = null;
            state.errors = null;
        }
    }
});

export const {
    setLoading,
    handleAllGetShopData,
    handleErrorAllGetShopData,
    handleDeleteShopData,
    handleErrorDeleteShopData,
    handleCreateShopData,
    handleErrorCreateShopData,
    handleEditShopData,
    handleErrorShopData,
    handleMultipalDeleteShopData,
    handleErrorMultipalDeleteShopData,
    handleGetBlockNameData,
    handleErrorAllBlockNameData,
    handleGetFloorNameData,
    handleErrorAllFloorNameData,
    handleGetShopNameData,
    handleErrorAllShopNameData,
    handleResetShop
} = shopSlice.actions;

export default shopSlice.reducer;

export const getAllShopRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getAllShopApi(config, queryStr);
        const { statusCode, data: shopData } = data;

        if (statusCode === 200) {
            dispatch(handleAllGetShopData(shopData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorAllGetShopData(error));
        } else {
            dispatch(handleErrorAllGetShopData(error.message));
        }
    }
};
export const deleteShopRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await deleteShopApi(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleDeleteShopData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorDeleteShopData(error.response.data.errors));
        } else {
            dispatch(handleErrorDeleteShopData(error.message));
        }
    }
};
export const createShopRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createShopApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 201) {
            dispatch(handleCreateShopData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateShopData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateShopData(error.message));
        }
    }
};

export const editShopRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await editShopApi(id, reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleEditShopData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorShopData(error.response.data.errors));
        } else {
            return dispatch(handleErrorShopData(error.message));
        }
    }
};

export const multipaldeleteShopRequest = (MultiData) => async (dispatch, getState) => {
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
        const { data } = await multipaldeleteShopApi(MultiData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleMultipalDeleteShopData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorMultipalDeleteShopData(error.response.data.errors));
        } else {
            return dispatch(handleErrorMultipalDeleteShopData(error.message));
        }
    }
};
export const getAllBlockNameRequest = () => async (dispatch, getState) => {
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
        const { data } = await getAllBlockNameApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleGetBlockNameData(data?.data));
        }
    } catch (err) {
        dispatch(handleErrorAllBlockNameData(err));
    }
};
export const getAllFloorNameRequest = () => async (dispatch, getState) => {
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
        const { data } = await getAllFloorNameApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleGetFloorNameData(data?.data));
        }
    } catch (err) {
        dispatch(handleErrorAllFloorNameData(err));
    }
};
export const getAllShopNameRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await getAllShopNameApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleGetShopNameData(data.data));
        }
    } catch (err) {
        dispatch(handleErrorAllShopNameData(err));
    }
};
