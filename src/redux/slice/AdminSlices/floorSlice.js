import { createSlice } from "@reduxjs/toolkit";
import { createVehicleApi, deleteVehicleApi, editVehicleApi, getAllVehicleApi, multipaldeleteVehicleApi } from "../../../service/api";
const initialState = {
	isLoading: false,
	floorData: null,
	createdFloorData: null,
	editedFloorData: null,
	deletedFloorData: null,
	deletedMultiFloorData: null,
	errors: null,
	successMessage: ''
};

const floorSlice = createSlice({
	name: 'floor',
	initialState,
	reducers: {
		setLoading: (state) => {
			state.isLoading = true;
		},
		handleAllGetFloorData: (state, action) => {
			state.floorData = action.payload;
			state.isLoading = false;
		},
		handleErrorAllGetFloorData: (state, action) => {
			state.errors = action.payload;
			state.isLoading = false;
		},
		handleDeleteFloorData: (state, action) => {
			state.deletedFloorData = action.payload;
			state.successMessage = action.payload?.message;
			state.isLoading = false;
		},
		handleErrorDeleteFloorData: (state, action) => {
			state.errors = action.payload;
			state.isLoading = false;
		},
		handleCreateFloorData: (state, action) => {
			state.createdFloorData = action.payload;
			state.successMessage = action.payload?.message
			state.isLoading = false;
		},
		handleErrorCreateFloorData: (state, action) => {
			state.errors = action.payload;
			state.isLoading = false;
		},
		handleEditFloorData: (state, action) => {
			state.editedFloorData = action.payload;
			state.isLoading = false;
			state.successMessage = action.payload.message;
		},
		handleErrorFloorData: (state, action) => {
			state.errors = action.payload;
			state.isLoading = false;
		},
		handleMultipalDeleteFloorData: (state, action) => {
			state.deletedMultiFloorData = action.payload;
			state.isLoading = false;
			state.successMessage = action.payload.message;
		},
		handleErrorMultipalDeleteFloorData: (state, action) => {
			state.errors = action.payload;
			state.isLoading = false;
		},
		handleResetFloor: (state) => {
			state.isLoading = false;
			state.createdFloorData = null;
			state.editedFloorData = null;
			state.deletedMultiFloorData = null;
			state.deletedFloorData = null;
			state.successMessage = null;
			state.errors = null;
		},
	}
});

export const {
	setLoading,
	handleAllGetFloorData,
	handleErrorAllGetFloorData,
	handleDeleteFloorData,
	handleErrorDeleteFloorData,
	handleCreateFloorData,
	handleErrorCreateFloorData,
	handleEditFloorData,
	handleErrorFloorData,
	handleMultipalDeleteFloorData,
	handleErrorMultipalDeleteFloorData,
	handleResetFloor
} = floorSlice.actions;

export default floorSlice.reducer;

export const getAllFloorRequest = (queryStr) => async (dispatch, getState) => {
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
		const { data } = await getAllVehicleApi(config, queryStr);
		console.log(data, "data");
		const { statusCode, data: VehicleData } = data;

		if (statusCode === 200) {
			dispatch(handleAllGetFloorData(VehicleData));
		}
	} catch (error) {
		if (error.response && error.response.data.errors) {
			dispatch(handleErrorAllGetFloorData(error));
		} else {
			dispatch(handleErrorAllGetFloorData(error.message));
		}
	}
};
export const deleteFloorRequest = (id) => async (dispatch, getState) => {
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
		const { data } = await deleteVehicleApi(id, config);
		const { statusCode } = data;
		if (statusCode === 200) {
			dispatch(handleDeleteFloorData(data));
		}
	} catch (error) {
		if (error.response && error.response.data.errors) {
			dispatch(handleErrorDeleteFloorData(error.response.data.errors));
		} else {
			dispatch(handleErrorDeleteFloorData(error.message));
		}
	}
};
export const createFloorRequest = (reqData) => async (dispatch, getState) => {
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
		const { data } = await createVehicleApi(reqData, config);

		const { statusCode } = data;

		if (statusCode === 201) {
			dispatch(handleCreateFloorData(data));

		}
	} catch (error) {
		if (error.response && error.response.data.errors) {
			return dispatch(handleErrorCreateFloorData(error.response.data.errors));
		} else {
			return dispatch(handleErrorCreateFloorData(error.message));
		}
	}
};


export const editFloorRequest = (id, reqData) => async (dispatch, getState) => {
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
		const { data } = await editVehicleApi(id, reqData, config);
		const { statusCode } = data;

		if (statusCode === 200) {
			dispatch(handleEditFloorData(data));
		}
	} catch (error) {
		if (error.response && error.response.data.errors) {
			return dispatch(handleErrorFloorData(error.response.data.errors));
		} else {
			return dispatch(handleErrorFloorData(error.message));
		}
	}
};

export const multipaldeleteFloorRequest = (MultiData) => async (dispatch, getState) => {
	dispatch(setLoading());
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
				Authorization: getState()?.auth?.token,
			},
		};
		const { data } = await multipaldeleteVehicleApi(MultiData, config);
		const { statusCode } = data;

		if (statusCode === 200) {
			dispatch(handleMultipalDeleteFloorData(data));
		}
	} catch (error) {
		if (error.response && error.response.data.errors) {
			dispatch(handleErrorMultipalDeleteFloorData(error.response.data.errors));
		} else {
			return dispatch(handleErrorMultipalDeleteFloorData(error.message));
		}
	}
};
