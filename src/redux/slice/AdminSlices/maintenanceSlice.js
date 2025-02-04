import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { getStepperDetails } from '././authSlice';
import {
    createMaintenanceApi,
    deleteMaintenanceApi,
    editMaintenanceApi,
    getAllMaintenanceApi,
    multipaldeleteMaintenanceApi,
    createMaintenanceSettingApi,
    getMaintenanceSettingApi,
    getMaintenanceFloorApi,
    updateMaintenanceSettingApi,
    monthlyMaintenanceUserWiseApi,
    monthlyMaintenanceCreateApi,
    createOrderIDApi,
    checkPaymentApi,
    UploadPaymentImageApi,
    getMaintenanceDetailByIdApi,
    getMaintenanceBlockApi,
    getDataCollectedAmount,
} from '../../../service/api';
const initialState = {
    isGenerated: false,
    isLoading: false,
    isSettingCreated: false,
    MaintenanceData: null,
    createdMaintenanceData: null,
    createdMaintenanceSettingData: null,
    editedMaintenanceData: null,
    deletedMaintenanceData: null,
    deletedMultiMaintenanceData: null,
    errors: null,
    successMessage: '',
    MaintenanceSettingData: null,
    MaintenanceFloorData: null,
    monthlyMaintenanceUserWiseData: null,
    createdOrderData: null,
    isCreatedID: false,
    isOfflinePayment: false,
    isImageUploaded: false,
    paymentDetailByID: null,
    allCollectedAmount: null,

};

const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isSettingCreated = false;
            state.isGenerated = false;
            state.isOfflinePayment = false;
            state.isImageUploaded = false;
            state.paymentDetailByID = null;
        },
        setOrderDefault: (state) => {
            state.createdOrderData = null;
            state.isCreatedID = false;
        },
        handleMonthlyMaintenanceCreateData: (state, action) => {
            // state.successMessage = action.payload?.message;
            state.isGenerated = true;
            state.isLoading = false;
            toast.success(action.payload.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorMonthlyMaintenanceCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error(action.payload, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleMonthlyMaintenanceUserWiseData: (state, action) => {
            state.monthlyMaintenanceUserWiseData = action.payload;
            state.isLoading = false;
        },
        handleErrorMonthlyMaintenanceUserWiseData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleAllGetMaintenanceData: (state, action) => {
            state.MaintenanceData = action.payload;
            state.isLoading = false;
        },
        handleGetMaintenanceDataByid: (state, action) => {
            state.paymentDetailByID = action.payload;
            state.isLoading = false;
        },
        handleGetMaintenanceSettingData: (state, action) => {
            state.MaintenanceSettingData = action.payload;
            state.isLoading = false;
        },
        handleGetMaintenanceFloorData: (state, action) => {
            state.MaintenanceFloorData = action.payload;
            state.isLoading = false;
        },
        handleErrorGetMaintenanceSettingData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorGetMaintenanceFloorData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorAllGetMaintenanceData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleDeleteMaintenanceData: (state, action) => {
            state.deletedMaintenanceData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorDeleteMaintenanceData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleCreateMaintenanceData: (state, action) => {
            state.createdMaintenanceData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleCreateMaintenanceSettingData: (state, action) => {
            state.createdMaintenanceSettingData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isSettingCreated = true;
            toast.success('Successfully Setting Created', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleUpdateMaintenanceSettingData: (state, action) => {
            state.createdMaintenanceSettingData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isSettingCreated = true;
            toast.success('Successfully Setting Updated', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorCreateMaintenanceSettingData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleErrorCreateMaintenanceData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleEditMaintenanceData: (state, action) => {
            state.editedMaintenanceData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorMaintenanceData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleMultipalDeleteMaintenanceData: (state, action) => {
            state.deletedMultiMaintenanceData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorMultipalDeleteMaintenanceData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleCreatedOrderID: (state, action) => {
            state.createdOrderData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreatedID = true;
        },
        handleAllCollectedAmount: (state, action) => {
            state.allCollectedAmount = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorCreatedOrderID: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            state.createdOrderData = null;
            state.isCreatedID = false;
        },
        handleOfflinePayment: (state, action) => {
            state.isOfflinePayment = true;
            state.successMessage = action.payload?.message;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleImageUploadPayment: (state, action) => {
            state.isImageUploaded = true;
            state.successMessage = action.payload?.message;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorhandleOfflinePayment: (state, action) => {
            state.isOfflinePayment = false;
            state.isImageUploaded = false;
            state.errors = action.payload;
        },
        handleResetMaintenance: (state) => {
            state.isLoading = false;
            // state.createdMaintenanceData = null;
            // state.editedMaintenanceData = null;
            // state.deletedMultiMaintenanceData = null;
            // state.deletedMaintenanceData = null;
            state.successMessage = null;
            state.errors = null;
            state.MaintenanceFloorData = null;
            state.allCollectedAmount = null;
        }
    }
});

export const {
    setLoading,
    handleAllGetMaintenanceData,
    handleErrorAllGetMaintenanceData,
    handleDeleteMaintenanceData,
    handleErrorDeleteMaintenanceData,
    handleCreateMaintenanceData,
    handleCreateMaintenanceSettingData,
    handleUpdateMaintenanceSettingData,
    handleErrorCreateMaintenanceData,
    handleErrorCreateMaintenanceSettingData,
    handleEditMaintenanceData,
    handleErrorMaintenanceData,
    handleMultipalDeleteMaintenanceData,
    handleErrorMultipalDeleteMaintenanceData,
    handleResetMaintenance,
    handleGetMaintenanceSettingData,
    handleErrorGetMaintenanceSettingData,
    handleGetMaintenanceFloorData,
    handleErrorGetMaintenanceFloorData,
    handleMonthlyMaintenanceUserWiseData,
    handleErrorMonthlyMaintenanceUserWiseData,
    handleMonthlyMaintenanceCreateData,
    handleErrorMonthlyMaintenanceCreateData,
    handleCreatedOrderID,
    handleErrorCreatedOrderID,
    setOrderDefault,
    handleOfflinePayment,
    handleErrorhandleOfflinePayment,
    handleImageUploadPayment,
    handleGetMaintenanceDataByid,
    handleAllCollectedAmount,
} = maintenanceSlice.actions;

export default maintenanceSlice.reducer;

export const getAllMaintenanceRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getAllMaintenanceApi(config, queryStr);
        console.log(data, 'data');
        const { statusCode, data: MaintenanceData } = data;

        if (statusCode === 200) {
            dispatch(handleAllGetMaintenanceData(MaintenanceData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorAllGetMaintenanceData(error));
        } else {
            dispatch(handleErrorAllGetMaintenanceData(error.message));
        }
    }
};
export const deleteMaintenanceRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await deleteMaintenanceApi(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleDeleteMaintenanceData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorDeleteMaintenanceData(error.response.data.errors));
        } else {
            dispatch(handleErrorDeleteMaintenanceData(error.message));
        }
    }
};
export const createMaintenanceRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createMaintenanceApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 201) {
            dispatch(handleCreateMaintenanceData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateMaintenanceData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateMaintenanceData(error.message));
        }
    }
};

export const editMaintenanceRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await editMaintenanceApi(id, reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleEditMaintenanceData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorMaintenanceData(error.response.data.errors));
        } else {
            return dispatch(handleErrorMaintenanceData(error.message));
        }
    }
};

export const multipaldeleteMaintenanceRequest = (MultiData) => async (dispatch, getState) => {
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
        const { data } = await multipaldeleteMaintenanceApi(MultiData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleMultipalDeleteMaintenanceData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorMultipalDeleteMaintenanceData(error.response.data.errors));
        } else {
            return dispatch(handleErrorMultipalDeleteMaintenanceData(error.message));
        }
    }
};

export const createMaintenanceSetting = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createMaintenanceSettingApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCreateMaintenanceSettingData(data));
            dispatch(getStepperDetails());
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateMaintenanceSettingData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateMaintenanceSettingData(error.message));
        }
    }
};
export const getMaintenanceSettingRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getMaintenanceSettingApi(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleGetMaintenanceSettingData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorGetMaintenanceSettingData(error));
        } else {
            dispatch(handleErrorGetMaintenanceSettingData(error.message));
        }
    }
};

export const getMaintenanceFloorRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getMaintenanceFloorApi(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleGetMaintenanceFloorData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorGetMaintenanceFloorData(error));
        } else {
            dispatch(handleErrorGetMaintenanceFloorData(error.message));
        }
    }
};
export const getMaintenanceBlockRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getMaintenanceBlockApi(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleGetMaintenanceFloorData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorGetMaintenanceFloorData(error));
        } else {
            dispatch(handleErrorGetMaintenanceFloorData(error.message));
        }
    }
};

export const updateMaintenanceSetting = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateMaintenanceSettingApi(id, reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleUpdateMaintenanceSettingData(data));
            dispatch(getStepperDetails());
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreateMaintenanceSettingData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreateMaintenanceSettingData(error.message));
        }
    }
};
export const monthlyMaintenanceUserWise = (reqData) => async (dispatch, getState) => {
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
        const { data } = await monthlyMaintenanceUserWiseApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleMonthlyMaintenanceUserWiseData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorMonthlyMaintenanceUserWiseData(error.response.data.errors));
        } else {
            return dispatch(handleErrorMonthlyMaintenanceUserWiseData(error.message));
        }
    }
};

export const monthlyMaintenanceCreate = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await monthlyMaintenanceCreateApi(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleMonthlyMaintenanceCreateData(data));
        }
    } catch (error) {
        if(error.response && error.response?.data?.statusCode === 400){
            dispatch(handleErrorMonthlyMaintenanceCreateData(error.response?.data?.message));
        }
        else if (error.response && error.response.data.errors) {
            dispatch(handleErrorMonthlyMaintenanceCreateData(error.response.data.errors.maintenance));
        } else {
            dispatch(handleErrorMonthlyMaintenanceCreateData(error.message));
        }
    }
};

export const createOrderId = (reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    dispatch(setOrderDefault());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await createOrderIDApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCreatedOrderID(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreatedOrderID(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreatedOrderID(error.message));
        }
    }
};
// export const checkPaymentCall = (reqData) => async (dispatch, getState) => {
//     dispatch(setLoading());
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': reqData.payment_type !== "cheque" ? 'application/json' : "multipart/form-data",
//                 // 'Content-Type': 'application/json',
//                 // 'Content-Type': 'multipart/form-data',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token
//             }
//         };
//         const { data } = await checkPaymentApi(reqData, config);

//         const { statusCode } = data;

//         if (statusCode === 200) {
//             dispatch(handleOfflinePayment(data));
//         }
//     } catch (error) {
//         console.log(error,"eroor")
//         if (error.response && error.response.data.errors) {
//             return dispatch(handleErrorhandleOfflinePayment(error.response.data.errors));
//         } else {
//             return dispatch(handleErrorhandleOfflinePayment(error.message));
//         }
//     }
// };

export const checkPaymentCall = (reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };

        const { data } = await checkPaymentApi(reqData, config);
        console.log(data,"dataaa")
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleOfflinePayment(data));
        }
    } catch (error) {
        console.log(error, "error");
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorhandleOfflinePayment(error.response.data.errors));
        } else {
            return dispatch(handleErrorhandleOfflinePayment(error.message));
        }
    }
};


// export const checkPaymentCall = (reqData) => async (dispatch, getState) => {
//     dispatch(setLoading());
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 Authorization: getState()?.auth?.token
//             }
//         };

//         const { data } = await checkPaymentApi(reqData, config);

//         const { statusCode } = data;

//         if (statusCode === 200) {
//             dispatch(handleOfflinePayment(data));
//         }
//     } catch (error) {
//         // Comprehensive error logging
//         console.error('FULL ERROR DETAILS:', {
//             errorResponse: error.response?.data,
//             errorStatus: error.response?.status,
//             errorHeaders: error.response?.headers,
//             errorMessage: error.message
//         });

//         if (error.response && error.response.data.errors) {
//             return dispatch(handleErrorhandleOfflinePayment(error.response.data.errors));
//         } else {
//             return dispatch(handleErrorhandleOfflinePayment(error.message));
//         }
//     }
// };
export const imageUploadPayment = (reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': "multipart/form-data",
                // 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token
            }
        };
        const { data } = await UploadPaymentImageApi(reqData, config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleImageUploadPayment(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorhandleOfflinePayment(error.response.data.errors));
        } else {
            return dispatch(handleErrorhandleOfflinePayment(error.message));
        }
    }
};

export const getPaymentDetailRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await getMaintenanceDetailByIdApi(id, config);
        const { statusCode, data: MaintenanceData } = data;

        if (statusCode === 200) {
            dispatch(handleGetMaintenanceDataByid(MaintenanceData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorAllGetMaintenanceData(error));
        } else {
            dispatch(handleErrorAllGetMaintenanceData(error.message));
        }
    }
};
export const getAllCollectedAmountReaquest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getDataCollectedAmount(reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleAllCollectedAmount(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorAllGetMaintenanceData(error));
        } else {
            dispatch(handleErrorAllGetMaintenanceData(error.message));
        }
    }
};
