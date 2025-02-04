import { createSlice } from "@reduxjs/toolkit";
import { getUserTotalComplaint, getUserTotalProperty, getUserTotalVehicle, getRecentlyCollectedMaintenance, getRecentlyAllocatedProperty, getAllDataDashboard } from "../../../service/api";

const initialState = {
    isLoading: false,
    errors: null,
    successMessage: '',
    totalUserProperty: null,
    totalUserComplaint: null,
    totalUserVehicle: null,
    collectedMaintenance: null,
    allocatedProperty: null,
    allData: null,
};

const floorSlice = createSlice({
    name: 'userDashboard',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
        },
        setDashReset: (state) => {
            state.allData = null;
        },
        handleUserTotalProperty: (state, action) => {
            state.totalUserProperty = action?.payload;
            state.isLoading = false;
        },
        handleUserTotalCompalint: (state, action) => {
            state.totalUserComplaint = action?.payload;
            state.isLoading = false;
        },
        handleUserTotalVehicle: (state, action) => {
            state.totalUserVehicle = action?.payload;
            state.isLoading = false;
        },
        handleCollectedMaintenance: (state, action) => {
            state.collectedMaintenance = action?.payload;
            state.isLoading = false;
        },
        handleAllocatedProperty: (state, action) => {
            state.allocatedProperty = action?.payload;
            state.isLoading = false;
        },
        handleAllData: (state, action) => {
            state.allData = action?.payload;
            state.isLoading = false;
        },
        handleGetError: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },

        handleResetFloor: (state) => {
            state.isLoading = false;
            state.successMessage = null;
            state.errors = null;
        },
    }
});

export const {
    setLoading,
    handleUserTotalProperty,
    handleUserTotalCompalint,
    handleUserTotalVehicle,
    handleCollectedMaintenance,
    handleAllocatedProperty,
    handleGetError,
    handleAllData,
    setDashReset,
    handleResetFloor
} = floorSlice.actions;

export default floorSlice.reducer;


export const getAllUserTotalProperty = (queryStr) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': getState()?.auth?.token,
            },
        };
        const { data } = await getUserTotalProperty(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleUserTotalProperty(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleGetError(error));
        } else {
            dispatch(handleGetError(error.message));
        }
    }
};
export const getAllUserTotalComplaint = (queryStr) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': getState()?.auth?.token,
            },
        };
        const { data } = await getUserTotalComplaint(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleUserTotalCompalint(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleGetError(error));
        } else {
            dispatch(handleGetError(error.message));
        }
    }
};
export const getAllUserTotalVehicle = (queryStr) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': getState()?.auth?.token,
            },
        };
        const { data } = await getUserTotalVehicle(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleUserTotalVehicle(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleGetError(error));
        } else {
            dispatch(handleGetError(error.message));
        }
    }
};
export const getCollectedMaintenance = (queryStr) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': getState()?.auth?.token,
            },
        };
        const { data } = await getRecentlyCollectedMaintenance(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCollectedMaintenance(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleGetError(error));
        } else {
            dispatch(handleGetError(error.message));
        }
    }
};
export const getAllocatedProperty = (queryStr) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': getState()?.auth?.token,
            },
        };
        const { data } = await getRecentlyAllocatedProperty(config, queryStr);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleAllocatedProperty(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleGetError(error));
        } else {
            dispatch(handleGetError(error.message));
        }
    }
};
export const getAllData = (queryStr) => async (dispatch, getState) => {
    dispatch(setLoading());
    dispatch(setDashReset());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': getState()?.auth?.token,
            },
        };
        const { data } = await getAllDataDashboard(config);
        // console.log(data, "data");
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleAllData(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleGetError(error));
        } else {
            dispatch(handleGetError(error.message));
        }
    }
};
// export const deleteFloorRequest = (id) => async (dispatch, getState) => {
//     dispatch(setLoading());
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 'Authorization': getState()?.auth?.token,
//             },
//         };
//         const { data } = await deleteVehicleApi(id, config);
//         const { statusCode } = data;
//         if (statusCode === 200) {
//             dispatch(handleDeleteFloorData(data));
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             dispatch(handleErrorDeleteFloorData(error.response.data.errors));
//         } else {
//             dispatch(handleErrorDeleteFloorData(error.message));
//         }
//     }
// };
// export const createFloorRequest = (reqData) => async (dispatch, getState) => {
//     dispatch(setLoading());
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 'Authorization': getState()?.auth?.token,
//             },
//         };
//         const { data } = await createVehicleApi(reqData, config);

//         const { statusCode } = data;

//         if (statusCode === 201) {
//             dispatch(handleCreateFloorData(data));

//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             return dispatch(handleErrorCreateFloorData(error.response.data.errors));
//         } else {
//             return dispatch(handleErrorCreateFloorData(error.message));
//         }
//     }
// };


// export const editFloorRequest = (id, reqData) => async (dispatch, getState) => {
//     dispatch(setLoading());


//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 'Authorization': getState()?.auth?.token,
//             },
//         };
//         const { data } = await editVehicleApi(id, reqData, config);
//         const { statusCode } = data;

//         if (statusCode === 200) {
//             dispatch(handleEditFloorData(data));
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             return dispatch(handleErrorFloorData(error.response.data.errors));
//         } else {
//             return dispatch(handleErrorFloorData(error.message));
//         }
//     }
// };

// export const multipaldeleteFloorRequest = (MultiData) => async (dispatch, getState) => {
//     dispatch(setLoading());
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token,
//             },
//         };
//         const { data } = await multipaldeleteVehicleApi(MultiData, config);
//         const { statusCode } = data;

//         if (statusCode === 200) {
//             dispatch(handleMultipalDeleteFloorData(data));
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             dispatch(handleErrorMultipalDeleteFloorData(error.response.data.errors));
//         } else {
//             return dispatch(handleErrorMultipalDeleteFloorData(error.message));
//         }
//     }
// };
