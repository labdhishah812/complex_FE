import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { vendorAssignApi, getVendorListApi, updateVendorAssignApi, vendorRemoveApi, vendorDetailById, getVendorTypeApi, createSalesmanApi, getSalesmanDataApi, updateSalesmanStatusApi, salesmanDetailsByid, updateSalesmanDataApi, removeSalesmanApi } from '../../../service/api';
import axios from 'axios';
const initialState = {
    isLoading: false,
    isDelete: false,
    errors: null,
    successMessage: '',
    isCreated: false,
    salesmanAssignedData: null,
    salesmanData: [],
    salesmanDataById: null,
    salesmanTypeData: null,
};
const salesmanSlice = createSlice({
    name: 'salesman',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.isDelete = false;
            state.successMessage = '';
            state.errors = null;
            state.isCreated = false;
            state.salesmanDataById = null;
        },
        handleSelesmanCreateData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message ? action.payload?.message : 'Successfully Salesman Created', {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorSalesmanCreateData: (state, action) => {
            state.errors = action.payload.message;
            state.isLoading = false;
            // toast.error(action.payload.message, {
            //     style: {
            //         marginTop: '4rem'
            //     }
            // });
        },
        handlesalesmanTypeData: (state, action) => {
            state.salesmanTypeData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handlesalesmanData: (state, action) => {
            state.salesmanData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handlesalesmanDataById: (state, action) => {
            state.salesmanDataById = action.payload.data;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorsalesmanData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleSalesmanRemoveData: (state, action) => {
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isDelete = true;
            toast.success(action.payload.data, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorSalesmanRemoveData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            state.isDelete = false;
            toast.error(action.payload, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleStatusUpdate: (state, action) => {
            const { salesmanId, status } = action.payload;
            const salesman = state.salesmanData.find(item => item.id === salesmanId);

            if (salesman) {
                salesman.status = status;
            }

            state.successMessage = `Salesman status updated`;
            state.isLoading = false;
            toast.success(state.successMessage, { style: { marginTop: '4rem' } });
        },
        handleStatusUpdateError: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
            toast.error('Failed to update status', { style: { marginTop: '4rem' } });
        },
    }
});
export const { setLoading, handlesalesmanTypeData, handleSelesmanCreateData, handleErrorSalesmanCreateData, handlesalesmanData, handleErrorsalesmanData, handleSalesmanRemoveData, handleErrorSalesmanRemoveData, handlesalesmanDataById, handleStatusUpdate, handleStatusUpdateError } = salesmanSlice.actions;
export default salesmanSlice.reducer;

// export const salesmanCreateRequest = (reqData) => async (dispatch, getState) => {
//     try {
//         dispatch(setLoading());

//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: getState()?.auth?.token
//             },
//         };

//         try {
//             const { data } = await createSalesmanApi(reqData, config);

//         const { statusCode } = data;
//         if (statusCode === 200) {
//             dispatch(handleSelesmanCreateData(data));
//         }
//             // const response = await createSalesmanApi(reqData, config);

//             // Assuming successful response structure
//             // dispatch(handleSelesmanCreateData(response.data));
//             // toast.success('Salesman created successfully');

//         } catch (error) {
//             if (error.response.data.statusCode === 422) {
//                 const errors = error.response.data.errors;
//                 let errorMessage;
//                 if (errors && typeof errors === 'object') {
//                     errorMessage = Object.values(errors)[0];
//                 }
//                 errorMessage = errorMessage;
//                 dispatch(handleErrorSalesmanCreateData(errorMessage));
//                 // toast.error(errorMessage);
//             } else if (error.response) {
//                 // The request was made and the server responded with a status code
//                 // that falls out of the range of 2xx
//                 const errorMessage = error.response.data.message;
//                 dispatch(handleErrorSalesmanCreateData(errorMessage));
//                 toast.error(errorMessage);
//             } else if (error.request) {
//                 // The request was made but no response was received
//                 dispatch(handleErrorSalesmanCreateData('No response from server'));
//                 toast.error('No response from server');
//             } else {
//                 // Something happened in setting up the request that triggered an Error
//                 dispatch(handleErrorSalesmanCreateData('Error creating salesman'));
//                 toast.error('Error creating salesman');
//             }
//         }
//     } catch (generalError) {
//         console.error('Unexpected error:', generalError);
//         dispatch(handleErrorSalesmanCreateData('Unexpected error occurred'));
//         toast.error('Unexpected error occurred');
//     }
// };
export const salesmanCreateRequest = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: getState()?.auth?.token
            },
        };

        try {
            const { data } = await createSalesmanApi(reqData, config);

            const { statusCode } = data;
            if (statusCode === 200) {
                dispatch(handleSelesmanCreateData(data));
            }

        } catch (error) {
            if (error.response && error.response.data) {
                const { statusCode, message, errors } = error.response.data;

                if (statusCode === 409) {
                    // Specific error handling for contact number conflict
                    const errorMessage = errors || message;
                    dispatch(handleErrorSalesmanCreateData(errorMessage));
                    toast.error(errorMessage);
                } else if (statusCode === 422) {
                    // Validation errors handling
                    const validationError = typeof errors === 'object' ? Object.values(errors)[0] : errors || message;
                    dispatch(handleErrorSalesmanCreateData(validationError));
                    toast.error(validationError);
                } else {
                    // General error response handling
                    const errorMessage = message || 'An error occurred';
                    dispatch(handleErrorSalesmanCreateData(errorMessage));
                    toast.error(errorMessage);
                }
            } else if (error.request) {
                // Handle no response from server
                const errorMessage = 'No response from server';
                dispatch(handleErrorSalesmanCreateData(errorMessage));
                toast.error(errorMessage);
            } else {
                // Generic error handling
                const errorMessage = 'Error creating salesman';
                dispatch(handleErrorSalesmanCreateData(errorMessage));
                toast.error(errorMessage);
            }
        }
    } catch (generalError) {
        // Catching unexpected errors outside axios
        console.error('Unexpected error:', generalError);
        const errorMessage = 'Unexpected error occurred';
        dispatch(handleErrorSalesmanCreateData(errorMessage));
        toast.error(errorMessage);
    }
};

export const getsalesmanData = (reqData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading());
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization: getState()?.auth?.token,
            }
        };
        const { data } = await getSalesmanDataApi(reqData, config);
        console.log(data, "mydata");

        const { statusCode, message, data: responseData } = data;
        if (statusCode === 200 && responseData) {
            // Make sure to pass the correct data from responseData
            dispatch(handlesalesmanData(responseData.salesman_listing)); // Use the correct property for data
        } else {
            dispatch(handleErrorsalesmanData(message));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorsalesmanData(error.response.data.errors));
        } else {
            if (error.response && error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorsalesmanData(error.message));
        }
    }
};

export const updateSalesmanStatusRequest = (salesmanId, status) => async (dispatch, getState) => {
    console.log(salesmanId,"id")
    try {
        dispatch(setLoading());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: getState()?.auth?.token,
            },
        };

        const response = await updateSalesmanStatusApi(salesmanId,{ status }, config);

        if (response.data.statusCode === 200) {
            dispatch(handleStatusUpdate({ salesmanId, status: response.data.status }));
            dispatch(handlesalesmanData(response.salesman_listing));
        } else {
            dispatch(handleStatusUpdateError('Error updating status'));
        }
    } catch (error) {
        dispatch(handleStatusUpdateError(error.message));
    }
};

export const getsalesmanTypeData = (reqData) => async (dispatch, getState) => {
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
        const { data } = await getVendorTypeApi(config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlesalesmanTypeData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorsalesmanData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorsalesmanData(error.message));
        }
    }
};
export const getsalesmanDataById = (id) => async (dispatch, getState) => {
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
        const { data } = await salesmanDetailsByid(id,config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlesalesmanDataById(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorsalesmanData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorsalesmanData(error.message));
        }
    }
};


export const updateSalesAssignRequest = (id, reqData) => async (dispatch, getState) => {
    console.log(reqData,"reqdata");
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: getState()?.auth?.token,
            },
        };

        const { data } = await updateSalesmanDataApi(id,
            reqData,
            config
        );

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleSelesmanCreateData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorSalesmanCreateData(error.response.data.errors));
        } else {
            return dispatch(handleErrorSalesmanCreateData(error.message));
        }
    }
};

export const salesmanRemoveRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await removeSalesmanApi(id,config);

        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleSalesmanRemoveData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorSalesmanRemoveData(error.response.data.errors));
        } else {
            return dispatch(handleErrorSalesmanRemoveData(error.message));
        }
    }
};
