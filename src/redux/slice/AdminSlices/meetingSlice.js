import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { createMeetingApi, getMeetingDetailByIdApi, getMeetingListApi, getUserDropDownApi, removeMeetingApi, updateMeetingApi, updateMeetingStatusApi } from '../../../service/api';
import { handleLogout } from '././authSlice';

const initialState = {
    isLoading: false,
    isDelete: false,
    isUpdate: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    meetinglist: null,
    meetingDetailById: null,
    userPropertyMeting: null

    // rentalAssignedData: null,
    // rentalData: null,
    // userAssignData: null,
    // rentalDetailByid: null,
};
const meetingSlice = createSlice({
    name: 'meeting',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.isUpdate = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.meetingDetailById = null;
        },
        handleMeetingCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrormeetingCreateData: (state, action) => {
            state.errors = action.payload;
            console.log(action.payload, 'action');
            state.isLoading = false;
            toast.error(action?.payload, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleMeetingList: (state, action) => {
            state.meetinglist = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorMeetingList: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleMeetingDetailById: (state, action) => {
            state.meetingDetailById = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleUserPropertyMeting: (state, action) => {
            state.userPropertyMeting = action.payload;
            // state.rentalDetailByid = null;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleMeetingDelete: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleMeetingStatusData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isUpdate = true;
            toast.success(action?.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        }
        // handleUserPropertyAssignData: (state, action) => {
        //     state.userAssignData = action.payload;
        //     state.successMessage = action.payload?.message;
        //     state.isLoading = false;
        // },
        // handleRentalDataByid: (state, action) => {
        //     state.rentalDetailByid = action.payload;
        //     state.successMessage = action.payload?.message;
        //     state.isLoading = false;
        // },
        // handleErrorUserPropertyAssignData: (state, action) => {
        //     state.errors = action.payload;
        //     state.isLoading = false;
        // },
        // handleRentalRemoveData: (state, action) => {
        //     state.successMessage = action.payload?.message;
        //     state.isLoading = false;
        //     state.isDelete = true;
        //     toast.success(action.payload.message, {
        //         style: {
        //             marginTop: '4rem'
        //         }
        //     });
        // },
        // handleRentalStatus: (state, action) => {
        //     state.isLoading = false;
        //     state.successMessage = action.payload?.message;
        //     state.isDelete = true;
        //     toast.success(action?.payload?.message, {
        //         style: {
        //             marginTop: '4rem'
        //         }
        //     });
        // },
        // handleErrorRentalStatus: (state, action) => {
        //     state.errors = action.payload;
        //     state.isLoading = false;
        //     Object.values(action.payload).map((a) =>
        //         toast.error(a, {
        //             style: {
        //                 marginTop: '4rem'
        //             }
        //         })
        //     );
        // },
        // handleErrorRentalRemoveData: (state, action) => {
        //     state.errors = action.payload;
        //     state.isLoading = false;
        //     state.isDelete = false;
        //     toast.error('Something Went wrong', {
        //         style: {
        //             marginTop: '4rem'
        //         }
        //     });
        // }
    }
});
export const {
    setLoading,
    handleMeetingCreateData,
    handleErrormeetingCreateData,
    handleMeetingList,
    handleErrorMeetingList,
    handleMeetingDetailById,
    handleMeetingDelete,
    handleUserPropertyMeting,
    handleMeetingStatusData
    // handleRentalData,
    // handleUserPropertyAssignData,
    // handleErrorRentalData,
    // handleErrorUserPropertyAssignData,
    // handleRentalRemoveData,
    // handleErrorRentalRemoveData,
    // handleRentalStatus,
    // handleErrorRentalStatus,
    // handleRentalDataByid
} = meetingSlice.actions;
export default meetingSlice.reducer;

export const meetingCreateRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createMeetingApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleMeetingCreateData(data));
        }
    } catch (error) {
        console.log(error, 'error');
        if (error.response && error.response.data.data) {
            return dispatch(handleErrormeetingCreateData(error.response.data.data));
        } else {
            return dispatch(handleErrormeetingCreateData(error.message));
        }
    }
};

export const getMeetingList = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getMeetingListApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleMeetingList(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorMeetingList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorMeetingList(error.message));
        }
    }
};
export const getMeetingDetailById = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getMeetingDetailByIdApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleMeetingDetailById(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorMeetingList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorMeetingList(error.message));
        }
    }
};
export const meetingUpdateRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateMeetingApi(id, reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleMeetingCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrormeetingCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrormeetingCreateData(error.message));
        }
    }
};
export const removeMeeting = (reqData) => async (dispatch, getState) => {
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
        const { data } = await removeMeetingApi(reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleMeetingDelete(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrormeetingCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrormeetingCreateData(error.message));
        }
    }
};
export const getUserProperty = () => async (dispatch, getState) => {
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
        const { data } = await getUserDropDownApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleUserPropertyMeting(data?.data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorMeetingList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorMeetingList(error.message));
        }
    }
};
export const meetingStatusUpdateRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await updateMeetingStatusApi(id, reqData, config);

        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleMeetingStatusData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrormeetingCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrormeetingCreateData(error.message));
        }
    }
};
