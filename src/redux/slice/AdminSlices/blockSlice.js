import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { getStepperDetails } from '././authSlice';
import {
    createBlockApi,
    deleteVehicleApi,
    editVehicleApi,
    getAllBlockApi,
    getBlockDropdownApi,
    getShopBlockDropdownApi,
    getShopFloorDropdownApi,
    getFloorDropdownApi,
    getPropertyDropdownApi,
    getPropertyDropDownWithOwnerIdApi,
    multipaldeleteVehicleApi,
    createStructureApi,
    createShoppingStructureApi,
    structureViewApi,
    shoppingStructureViewApi,
    createFloorStructureApi,
    createShoppingFloorStructureApi,
    floorStructureViewApi,
    floorShoppingStructureViewApi,
    getPropertyDropDownWithOwnerIdLatestApi,
    getVehicleUserPropertyListApi,
    uploadPropertyStructureApi,
    uploadShoppingStructureApi,
    getPropertyStructureAll,
} from '../../../service/api';
const initialState = {
    isLoading: false,
    blockData: null,
    blockDropdownData: null,
    floorDropdownData: null,
    propertyDropdownData: null,
    propertyDropdownWithOwnerId: null,
    propertyDropdownWithOwner: null,
    vehicleUserProperty: null,
    createdBlockData: null,
    createdStructureData: null,
    createdShoppingStructureData: null,
    structureViewDetail: null,
    shoppingStructureViewDetail: null,
    editedBlockData: null,
    deletedBlockData: null,
    deletedMultiBlockData: null,
    errors: null,
    uploadErrors: null,
    uploadShoppingErrors: null,
    propertyStructureAllData: null,
    successMessage: '',
    isCreated: false,
    isShopsCreated: false
};

const blockSlice = createSlice({
    name: 'block',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.successMessage = '';
            state.errors = null;
            // state.structureViewDetail = null;
            state.shoppingStructureViewDetail = null;
            // state.uploadErrors = null;
            // state.uploadShoppingErrors = null;
            state.isCreated = false;
            state.isShopsCreated = false;
            // state.blockDropdownData = null;
            // state.floorDropdownData = null;
            // state.propertyDropdownData = null;
        },
        handleAllGetBlockData: (state, action) => {
            state.blockData = action.payload;
            state.isLoading = false;
        },
        handleGetBlockDropdown: (state, action) => {
            state.blockDropdownData = action.payload;
            state.isLoading = false;
        },
        handleGetFloorDropdown: (state, action) => {
            state.floorDropdownData = action.payload;
            state.isLoading = false;
        },
        handleGetPropertyDropdown: (state, action) => {
            state.propertyDropdownData = action.payload;
            state.isLoading = false;
        },
        handleGetPropertyWithOwnerId: (state, action) => {
            state.propertyDropdownWithOwnerId = action.payload;
            state.isLoading = false;
        },
        handleGetPropertyWithOwner: (state, action) => {
            state.propertyDropdownWithOwner = action.payload;
            state.isLoading = false;
        },
        handleErrorGetPropertyWithOwnerId: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleGetVehicleUserProperty: (state, action) => {
            state.vehicleUserProperty = action.payload;
            state.isLoading = false;
        },
        handleErrorGetPropertyWithOwner: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorGetVehicleUserProperty: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorAllGetBlockData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorBlockDropdown: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorFloorDropdown: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorPropertyDropdown: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleDeleteBlockData: (state, action) => {
            state.deletedBlockData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorDeleteBlockData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleCreateBlockData: (state, action) => {
            state.createdBlockData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleCreateStructureData: (state, action) => {
            state.createdStructureData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success('Successfully Property Structure Created', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleUploadShoppingStructure: (state, action) => {
            state.isLoading = false;
            state.isShopsCreated = true;
            state.uploadShoppingErrors = null;
        },
        handleErrorUploadShoppingStructure: (state, action) => {
            state.uploadShoppingErrors = action.payload;
            state.isLoading = false;
        },
        handleUploadPropertyStructure: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isCreated = true;
            state.isLoading = false;
            state.uploadErrors = null;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorUploadPropertyStructure: (state, action) => {
            state.uploadErrors = action.payload;
            state.isLoading = false;
        },
        handleCreateShoppingStructureData: (state, action) => {
            state.createdShoppingStructureData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isShopsCreated = true;
        },
        handleCreateStructureViewDetail: (state, action) => {
            state.structureViewDetail = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleCreateShoppingStructureViewDetail: (state, action) => {
            state.shoppingStructureViewDetail = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorCreateBlockData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorCreateStructureData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error(action.payload.property, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorCreateShoppingStructureData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error(action.payload.property, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorStructureViewDetail: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorShoppingStructureViewDetail: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleEditBlockData: (state, action) => {
            state.editedBlockData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorBlockData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleMultipalDeleteBlockData: (state, action) => {
            state.deletedMultiBlockData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorMultipalDeleteBlockData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleResetUpload: (state) => {
            state.uploadErrors = null;
            state.uploadShoppingErrors = null;
        },
        handleGetAllPropertyData: (state, action) => {
            state.propertyStructureAllData = action.payload
        },
        handleResetBlock: (state) => {
            state.isLoading = false;
            state.createdBlockData = null;
            state.createdStructureData = null;
            state.createdShoppingStructureData = null;
            // state.structureViewDetail = null;
            state.editedBlockData = null;
            state.deletedMultiBlockData = null;
            state.deletedBlockData = null;
            state.successMessage = null;
            state.errors = null;
            state.isCreated = false;
            state.isShopsCreated = false;
        }
    }
});

export const {
    setLoading,
    handleAllGetBlockData,
    handleGetBlockDropdown,
    handleGetFloorDropdown,
    handleGetPropertyDropdown,
    handleGetPropertyWithOwnerId,
    handleGetPropertyWithOwner,
    handleGetVehicleUserProperty,
    handleErrorGetPropertyWithOwnerId,
    handleErrorGetPropertyWithOwner,
    handleErrorGetVehicleUserProperty,
    handleErrorAllGetBlockData,
    handleErrorBlockDropdown,
    handleErrorFloorDropdown,
    handleErrorPropertyDropdown,
    handleDeleteBlockData,
    handleErrorDeleteBlockData,
    handleCreateBlockData,
    handleCreateStructureData,
    handleCreateShoppingStructureData,
    handleCreateStructureViewDetail,
    handleCreateShoppingStructureViewDetail,
    handleErrorCreateBlockData,
    handleErrorCreateStructureData,
    handleErrorCreateShoppingStructureData,
    handleErrorStructureViewDetail,
    handleErrorShoppingStructureViewDetail,
    handleEditBlockData,
    handleErrorBlockData,
    handleMultipalDeleteBlockData,
    handleErrorMultipalDeleteBlockData,
    handleResetBlock,
    handleUploadPropertyStructure,
    handleUploadShoppingStructure,
    handleErrorUploadPropertyStructure,
    handleErrorUploadShoppingStructure,
    handleResetUpload,
    handleGetAllPropertyData
} = blockSlice.actions;

export default blockSlice.reducer;

export const getAllBlockRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getAllBlockApi(config, queryStr);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleAllGetBlockData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorAllGetBlockData(error));
        } else {
            dispatch(handleErrorAllGetBlockData(error.message));
        }
    }
};
export const deleteBlockRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await deleteVehicleApi(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleDeleteBlockData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorDeleteBlockData(error.response.data.errors));
        } else {
            dispatch(handleErrorDeleteBlockData(error.message));
        }
    }
};
export const createBlockRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createBlockApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 201) {
            dispatch(handleCreateBlockData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateBlockData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateBlockData(error.message));
        }
    }
};
export const createStructureRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createStructureApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateStructureData(data));
            dispatch(getStepperDetails());
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateStructureData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateStructureData(error.message));
        }
    }
};
export const createShoppingStructureRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createShoppingStructureApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateShoppingStructureData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateShoppingStructureData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateShoppingStructureData(error.message));
        }
    }
};
export const structureViewRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await structureViewApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateStructureViewDetail(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorStructureViewDetail(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorStructureViewDetail(error.message));
        }
    }
};
export const shoppingStructureViewRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await shoppingStructureViewApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateShoppingStructureViewDetail(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorShoppingStructureViewDetail(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorShoppingStructureViewDetail(error.message));
        }
    }
};
export const createFloorStructureRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createFloorStructureApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateStructureData(data));
            dispatch(getStepperDetails());
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateStructureData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateStructureData(error.message));
        }
    }
};
export const createShoppingFloorStructureRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createShoppingFloorStructureApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateShoppingStructureData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateShoppingStructureData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateShoppingStructureData(error.message));
        }
    }
};
export const editBlockRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await editVehicleApi(id, reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleEditBlockData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorBlockData(error.response.data.errors));
        } else {
            return dispatch(handleErrorBlockData(error.message));
        }
    }
};

export const multipaldeleteBlockRequest = (MultiData) => async (dispatch, getState) => {
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
        const { data } = await multipaldeleteVehicleApi(MultiData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleMultipalDeleteBlockData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorMultipalDeleteBlockData(error.response.data.errors));
        } else {
            return dispatch(handleErrorMultipalDeleteBlockData(error.message));
        }
    }
};

export const floorStructureViewRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await floorStructureViewApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateStructureViewDetail(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorStructureViewDetail(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorStructureViewDetail(error.message));
        }
    }
};

export const floorShoppingStructureViewRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await floorShoppingStructureViewApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateShoppingStructureViewDetail(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorShoppingStructureViewDetail(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorShoppingStructureViewDetail(error.message));
        }
    }
};

// Latest Api calling

export const getBlockDropdownRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getBlockDropdownApi(config, queryStr);
        const { statusCode, data: blockData } = data;

        if (statusCode === 200) {
            dispatch(handleGetBlockDropdown(blockData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorBlockDropdown(error));
        } else {
            dispatch(handleErrorBlockDropdown(error.message));
        }
    }
};
export const getShopBlockDropdownRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getShopBlockDropdownApi(config, queryStr);
        const { statusCode, data: blockData } = data;

        if (statusCode === 200) {
            dispatch(handleGetBlockDropdown(blockData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorBlockDropdown(error));
        } else {
            dispatch(handleErrorBlockDropdown(error.message));
        }
    }
};
export const getFloorDropdownRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getFloorDropdownApi(reqData, config);
        const { statusCode, data: floorData } = data;

        if (statusCode === 200) {
            dispatch(handleGetFloorDropdown(floorData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorFloorDropdown(error.response.data.errors));
        } else {
            return dispatch(handleErrorFloorDropdown(error.message));
        }
    }
};
export const getShopFloorDropdownRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getShopFloorDropdownApi(reqData, config);
        const { statusCode, data: floorData } = data;

        if (statusCode === 200) {
            dispatch(handleGetFloorDropdown(floorData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorFloorDropdown(error.response.data.errors));
        } else {
            return dispatch(handleErrorFloorDropdown(error.message));
        }
    }
};

export const getPropertyDropdownRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getPropertyDropdownApi(reqData, config);
        const { statusCode, data: propertyData } = data;

        if (statusCode === 200) {
            dispatch(handleGetPropertyDropdown(propertyData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyDropdown(error.response.data.errors));
        } else {
            return dispatch(handleErrorPropertyDropdown(error.message));
        }
    }
};

export const getPropertyDropDownWithOwnerIdRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getPropertyDropDownWithOwnerIdApi(reqData, config);
        const { statusCode, data: propertyData } = data;

        if (statusCode === 200) {
            dispatch(handleGetPropertyWithOwnerId(propertyData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorGetPropertyWithOwnerId(error.response.data.errors));
        } else {
            return dispatch(handleErrorGetPropertyWithOwnerId(error.message));
        }
    }
};

export const getPropertyDropDownWithOwner = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getPropertyDropDownWithOwnerIdLatestApi(reqData, config);
        const { statusCode, data: propertyData } = data;

        if (statusCode === 200) {
            dispatch(handleGetPropertyWithOwner(propertyData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorGetPropertyWithOwner(error.response.data.errors));
        } else {
            return dispatch(handleErrorGetPropertyWithOwner(error.message));
        }
    }
};
export const getVehicleUserPropertyList = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getVehicleUserPropertyListApi(reqData, config);
        const { statusCode, data: propertyData } = data;

        if (statusCode === 200) {
            dispatch(handleGetVehicleUserProperty(propertyData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorGetVehicleUserProperty(error.response.data.errors));
        } else {
            return dispatch(handleErrorGetVehicleUserProperty(error.message));
        }
    }
};

export const uploadPropertyStructure = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await uploadPropertyStructureApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleUploadPropertyStructure(data));
            dispatch(getStepperDetails());
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUploadPropertyStructure(error.response.data.errors));
        } else {
            return dispatch(handleErrorUploadPropertyStructure(error.message));
        }
    }
};
export const uploadShoppingStructure = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await uploadShoppingStructureApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleUploadShoppingStructure(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUploadShoppingStructure(error.response.data.errors));
        } else {
            return dispatch(handleErrorUploadPropertyStructure(error.message));
        }
    }
};
export const getPropertyStructureAllData = () => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await getPropertyStructureAll(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleGetAllPropertyData(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorUploadShoppingStructure(error.response.data.errors));
        } else {
            return dispatch(handleErrorUploadPropertyStructure(error.message));
        }
    }
};