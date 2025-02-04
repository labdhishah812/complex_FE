import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { getStepperDetails, handleLogout } from '././authSlice';
import {
    createVehicleApi,
    deleteVehicleApi,
    editVehicleApi,
    getAllVehicleApi,
    multipaldeleteVehicleApi,
    vehicleAssignApi,
    getVehicleListApi,
    updateVehicleAssignApi,
    vehicleRemoveApi,
    vehicleSettingDetailApi,
    vehicleSettingCreateApi,
    vehicleSettingUpdateApi,
    vehicleDetailById
} from '../../../service/api';
const initialState = {
    isLoading: false,
    isCreated: false,
    isDelete: false,
    vehicleData: null,
    createdVehicleData: null,
    vehicleAssignData: null,
    editedVehicleData: null,
    deletedVehicleData: null,
    deletedMultiVehicleData: null,
    errors: null,
    successMessage: '',
    vehicleList: null,
    vehicleSettingList: null,
    vehicleDataByid: null,
};

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isCreated = false;
            state.isDelete = false;
            state.isCreatedSetting = false;
        },
        setLoadingSetting: (state) => {
            state.isLoading = true;
            state.vehicleSettingList = null;
        },
        handleGetVehicleSetting: (state, action) => {
            state.vehicleSettingList = action.payload.data;
            state.isLoading = false;
        },
        handleCreateVehicleSetting: (state, action) => {
            state.isLoading = false;
            state.isCreatedSetting = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorCreateVehicleSetting: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            let check = typeof action.payload === "object";
            check ? Object.values(action.payload).map((a) =>
                toast.error(a, {
                    style: {
                        marginTop: '4rem'
                    }
                })
            ) : toast.error(action.payload, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorGetVehicleSetting: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleAllGetVehicleData: (state, action) => {
            state.vehicleData = action.payload;
            state.isLoading = false;
        },
        handleVehicleDataByid: (state, action) => {
            state.vehicleDataByid = action.payload;
            state.isLoading = false;
        },
        handleErrorAllGetVechicleData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleDeleteVehicleData: (state, action) => {
            state.deletedVehicleData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorDeleteVehicleData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleCreateVehicleData: (state, action) => {
            state.createdVehicleData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleVehicleAssignData: (state, action) => {
            state.vehicleAssignData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorVehicleAssignData: (state, action) => {
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
        handleErrorCreateVehicleData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleEditVehicleData: (state, action) => {
            state.editedVehicleData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorVehicleData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleMultipalDeleteVehicleData: (state, action) => {
            state.deletedMultiVehicleData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorMultipalDeleteVehicleData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleVehicleListData: (state, action) => {
            state.vehicleList = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorVehicleListData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleVehicleRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.data, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorVehicleRemoveData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            state.isDelete = false;
            toast.error('Something Went wrong', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleResetVehicle: (state) => {
            state.isLoading = false;
            state.isDelete = false;
            state.createdVehicleData = null;
            state.editedVehicleData = null;
            state.deletedMultiVehicleData = null;
            state.deletedVehicleData = null;
            state.successMessage = null;
            state.errors = null;
        }
    }
});

export const {
    setLoading,
    setLoadingSetting,
    handleAllGetVehicleData,
    handleErrorAllGetVechicleData,
    handleDeleteVehicleData,
    handleErrorDeleteVehicleData,
    handleCreateVehicleData,
    handleVehicleAssignData,
    handleErrorVehicleAssignData,
    handleErrorCreateVehicleData,
    handleEditVehicleData,
    handleErrorVehicleData,
    handleMultipalDeleteVehicleData,
    handleErrorMultipalDeleteVehicleData,
    handleResetVehicle,
    handleVehicleListData,
    handleErrorVehicleListData,
    handleVehicleRemoveData,
    handleErrorVehicleRemoveData,
    handleGetVehicleSetting,
    handleErrorGetVehicleSetting,
    handleCreateVehicleSetting,
    handleErrorCreateVehicleSetting,
    handleVehicleDataByid
} = vehicleSlice.actions;

export default vehicleSlice.reducer;

export const getAllVehicleRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getAllVehicleApi(config, queryStr);
        console.log(data, 'data');
        const { statusCode, data: VehicleData } = data;

        if (statusCode === 200) {
            dispatch(handleAllGetVehicleData(VehicleData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorAllGetVechicleData(error));
        } else {
            dispatch(handleErrorAllGetVechicleData(error.message));
        }
    }
};
export const getVehicleByidRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await vehicleDetailById(id, config);
        console.log(data, 'data');
        const { statusCode, data: VehicleDataByid } = data;

        if (statusCode === 200) {
            dispatch(handleVehicleDataByid(VehicleDataByid));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorAllGetVechicleData(error));
        } else {
            dispatch(handleErrorAllGetVechicleData(error.message));
        }
    }
};
export const deleteVehicleRequest = (id) => async (dispatch, getState) => {
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
            dispatch(handleDeleteVehicleData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorDeleteVehicleData(error.response.data.errors));
        } else {
            dispatch(handleErrorDeleteVehicleData(error.message));
        }
    }
};
export const createVehicleRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createVehicleApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 201) {
            dispatch(handleCreateVehicleData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateVehicleData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateVehicleData(error.message));
        }
    }
};

export const editVehicleRequest = (id, reqData) => async (dispatch, getState) => {
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
            dispatch(handleEditVehicleData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVehicleData(error.response.data.errors));
        } else {
            return dispatch(handleErrorVehicleData(error.message));
        }
    }
};

export const multipaldeleteVehicleRequest = (MultiData) => async (dispatch, getState) => {
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
            dispatch(handleMultipalDeleteVehicleData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorMultipalDeleteVehicleData(error.response.data.errors));
        } else {
            return dispatch(handleErrorMultipalDeleteVehicleData(error.message));
        }
    }
};
// latest
export const vehicleAssignRequest = (reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await vehicleAssignApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleVehicleAssignData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVehicleAssignData(error.response.data.errors));
        } else if (error.response.status === 500 && error.response?.data?.data) {
            toast.error(error.response?.data?.data, {
                style: {
                    marginTop: '4rem'
                }
            })
        } else {
            return dispatch(handleErrorVehicleAssignData(error.message));
        }
    }
};
export const getVehicleListData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getVehicleListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleVehicleListData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVehicleListData(error.response.data.errors));
        } else {
            if (error?.response?.data?.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorVehicleListData(error.message));
        }
    }
};
export const updateVehicleAssignRequest = (id, reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await updateVehicleAssignApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleVehicleAssignData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVehicleAssignData(error.response.data.errors));
        } else if (error.response.status === 500 && error.response?.data?.data) {
            toast.error(error.response?.data?.data, {
                style: {
                    marginTop: '4rem'
                }
            })
        } else {
            return dispatch(handleErrorVehicleAssignData(error.message));
        }
    }
};

export const vehicleRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await vehicleRemoveApi(id, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleVehicleRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorVehicleRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorVehicleRemoveData(error.message));
        }
    }
};

export const getVehicleSettingDetail = () => async (dispatch, getState) => {
    dispatch(setLoadingSetting());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await vehicleSettingDetailApi(config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleGetVehicleSetting(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorGetVehicleSetting(error.response.data.errors));
        } else {
            if (error?.response?.data?.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorGetVehicleSetting(error.message));
        }
    }
};

export const vehicleSettingCreate = (reqData) => async (dispatch, getState) => {
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
        const { data } = await vehicleSettingCreateApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleCreateVehicleSetting(data));
            dispatch(getStepperDetails())
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateVehicleSetting(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateVehicleSetting(error.message));
        }
    }
};

export const vehicleSettingUpdateRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await vehicleSettingUpdateApi(id, reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCreateVehicleSetting(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateVehicleSetting(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateVehicleSetting(error.message));
        }
    }
};
