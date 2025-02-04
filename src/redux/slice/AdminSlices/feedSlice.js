import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from './authSlice';
import { createFeedApi, feedDetailsByid, getFeedApi, removeFeedApi, updateFeedAndPollDataApi, updateFeedDataApi } from '../../../service/api';

const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    feedData: [],
    feedDataById: null,
};

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.feedDataById = null;
        },
        handleFeedCreateData: (state, action) => {
            state.successMessage = action.payload?.message || 'Successfully Feed Created';
            state.isLoading = false;
            state.isCreated = true;
            toast.success(state.successMessage, {
                style: { marginTop: '4rem' },
            });
        },
        handleErrorFeedCreateData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error('Something went wrong', {
                style: { marginTop: '4rem' },
            });
        },
        handleFeedData: (state, action) => {
            state.feedData = action.payload;
            state.successMessage = action.payload?.message || 'Feed data retrieved successfully';
            state.isLoading = false;
        },
        handleAllGetFEEDData: (state, action) => {
            state.feedData = action.payload;
            state.isLoading = false;
        },
        handleFeedDataById: (state, action) => {
            state.feedDataById = action?.payload;
            state.successMessage = action.payload?.message || 'Feed data by ID retrieved successfully';
            state.isLoading = false;
        },
        handleErrorFeedData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            // toast.error('Failed to fetch feed data', {
            //     style: { marginTop: '4rem' },
            // });
        },
        handleFeedRemoveData: (state, action) => {
            state.successMessage = action.payload?.message || 'Feed removed successfully';
            state.isLoading = false;
            state.isDelete = true;
            toast.success(state.successMessage, {
                style: { marginTop: '4rem' },
            });
        },
        handleErrorFeedRemoveData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            state.isDelete = false;
            toast.error('Something went wrong while removing feed', {
                style: { marginTop: '4rem' },
            });
        },
        handleUpdateFeedData: (state, action) => {

            // state.successMessage = 'Successfully submitted';
            state.isLoading = false;
            // toast.success(state.successMessage, {
            //     style: { marginTop: '4rem' },
            // });
        },
        handleErrorUpdateFeedData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error('Failed to update feed', {
                style: { marginTop: '4rem' },
            });
        },
    },
});

export const {
    setLoading,
    handleFeedCreateData,
    handleErrorFeedCreateData,
    handleFeedData,
    handleAllGetFEEDData,
    handleFeedDataById,
    handleErrorFeedData,
    handleFeedRemoveData,
    handleErrorFeedRemoveData,
    handleUpdateFeedData,
    handleErrorUpdateFeedData,
} = feedSlice.actions;

export default feedSlice.reducer;

// Feed creation request
// export const feedCreateRequest = (reqData) => async (dispatch, getState) => {
//     try {
//         dispatch(setLoading());
//         const config = {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token,
//             },
//         };
//         const { data } = await createFeedApi(reqData, config);
//         if (data.statusCode === 200) {
//             dispatch(handleFeedCreateData(data));
//             return data
//         }
//     } catch (error) {
//         const errorMsg = error.response?.data.errors || error.message;
//         dispatch(handleErrorFeedCreateData(errorMsg));
//     }
// };

// export const feedCreateRequest = (reqData) => async (dispatch, getState) => {
//     try {
//         dispatch(setLoading());

//         // Convert FormData to a plain object for request body
//         const payload = {
//             type: reqData.get('type'),
//             title: reqData.get('title'),
//             description: reqData.get('description'),
//             ...(reqData.get('type') === 'poll' && {
//                 poll_options: JSON.parse(reqData.get('poll_options')),
//                 poll_answer_type: reqData.get('poll_answer_type') === 'true'
//             }),
//             ...(reqData.get('type') === 'feed' && {
//                 images: Array.from(reqData.getAll('file0')).map(file => file) // Map over the array to handle the files
//             })
//         };
//         console.log(reqData.getAll('file0'),"fillllllllllllllllllllllleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token,
//             },
//         };

//         const { data } = await createFeedApi(payload, config);

//         if (data.statusCode === 200) {
//             dispatch(handleFeedCreateData(data));
//             return data;
//         }
//     } catch (error) {
//         const errorMsg = error.response?.data.errors || error.message;
//         dispatch(handleErrorFeedCreateData(errorMsg));
//     }
// };

export const feedCreateRequest = (payload) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token,
            },
        };

        // Directly pass the payload without any FormData conversion
        const { data } = await createFeedApi(payload, config);

        if (data.statusCode === 200) {
            dispatch(handleFeedCreateData(data));
            return data;
        }
    } catch (error) {
        const errorMsg = error.response?.data.errors || error.message;
        dispatch(handleErrorFeedCreateData(errorMsg));
    }
};
// Get feed data request
export const getFeedData = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token,
            },
        };
        const { data } = await getFeedApi(reqData, config);
        const { statusCode, data: feedData } = data;
        if (statusCode === 200) {
            dispatch(handleAllGetFEEDData(feedData));
            return feedData; // Return feed data
        }
        return null;
    } catch (error) {
        const errorMsg = error.response?.data.errors || error.message;
        if (error.response?.data.statusCode === 401) {
            dispatch(handleLogout());
        }
        dispatch(handleErrorFeedData(errorMsg));
        throw new Error(errorMsg);
    }
};

// Update feed data request
export const updateFeedData = (id, reqData) => async (dispatch, getState) => {
    console.log(id.itemId , "id of feed data")
    console.log(reqData, "data to be updated")
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token,
            },
        };
        const { data } = await updateFeedDataApi(id.itemId, reqData, config);
        console.log(data , "dataaaaaaaaaaaaaaa")
        console.log(id, "iddddddddddddd")
        if (data.statusCode === 200) {
            dispatch(handleUpdateFeedData(data));
            return data
        }
    } catch (error) {
        const errorMsg = error.response?.data.errors || error.message;
        if (error.response?.data.statusCode === 401) {
            dispatch(handleLogout());
        }
        dispatch(handleErrorUpdateFeedData(errorMsg));
        throw new Error(errorMsg);
    }
};

export const deleteFeedData = (id, reqData) => async (dispatch, getState) => {
    console.log(id, "id to be deleted")
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
        const { data } = await removeFeedApi(id._id, config);
        console.log(data, "data to be deleted")
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleFeedRemoveData(data));
            return data
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorFeedRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorFeedRemoveData(error.message));
        }
    }
};

export const getFeedDataByid = (id) => async (dispatch, getState) => {
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
        const { data } = await feedDetailsByid(id, config);
        console.log(id , "id re id")
        console.log(data, "feed data by id")
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleFeedDataById(data?.data));
            return data
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorFeedData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorFeedData(error.message));
        }
    }
};

// export const updateFeedAndPolldRequest = (id, reqData) => async (dispatch, getState) => {
//     console.log(id, "id"); // Ensure ID is correctly passed
//     console.log(reqData, "formData"); // Check the formData

//     dispatch(setLoading());
//     try {
//         const config = {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token,
//             },
//         };

//         // Ensure the correct request data (id and formData) are passed in the API call
//         const { data } = await updateFeedAndPollDataApi(id, reqData, config);

//         console.log(data, "response data"); // Check the response

//         const { statusCode } = data;
//         if (statusCode === 200) {
//             dispatch(handleFeedCreateData(data));
//             return data;
//         }
//     } catch (error) {
//         if (error.response) {
//             console.error('Error Response:', error.response);
//             const errorMsg = error.response.data.errors || error.message;
//             return dispatch(handleErrorFeedCreateData(errorMsg));
//         } else {
//             console.error('Error:', error);
//             return dispatch(handleErrorFeedCreateData(error.message));
//         }
//     }
// };


// export const updateFeedAndPolldRequest = (id, reqData) => async (dispatch, getState) => {
//     try {
//         dispatch(setLoading());

//         // Convert FormData to a plain object for request body
//         const payload = {
//             type: reqData.get('type'),
//             title: reqData.get('title'),
//             description: reqData.get('description'),
//             ...(reqData.get('type') === 'poll' && {
//                 poll_options: JSON.parse(reqData.get('poll_options')),
//                 poll_answer_type: reqData.get('poll_answer_type') === 'true'
//             }),
//             ...(reqData.get('type') === 'feed' && {
//                 images: Array.from(reqData.getAll('file0'))
//             })
//         };

//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
//                 Authorization: getState()?.auth?.token,
//             },
//         };

//         const { data } = await updateFeedAndPollDataApi(id, payload, config);

//         const { statusCode } = data;
//         if (statusCode === 200) {
//             dispatch(handleFeedCreateData(data));
//             return data;
//         }
//     } catch (error) {
//         if (error.response) {
//             console.error('Error Response:', error.response);
//             const errorMsg = error.response.data.errors || error.message;
//             return dispatch(handleErrorFeedCreateData(errorMsg));
//         } else {
//             console.error('Error:', error);
//             return dispatch(handleErrorFeedCreateData(error.message));
//         }
//     }
// };


export const updateFeedAndPolldRequest = (id, payload) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token,
            },
        };

        const { data } = await updateFeedAndPollDataApi(id, payload, config);

        if (data.statusCode === 200) {
            dispatch(handleFeedCreateData(data));
            return data;
        }
    } catch (error) {
        const errorMsg = error.response?.data.errors || error.message;
        dispatch(handleErrorFeedCreateData(errorMsg));
    }
};
