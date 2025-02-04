import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { handleLogout } from '././authSlice';
import { createPropertyApi, allPropertyApi, statusPropertyApi, deleteComplexApi, editComplexApi, getAllComplexApi , getPropertyDetailsApi, createPropertyApiforSelfInquiry, allPropertyApiforSalesmanDashboard, statusPropertyApiforSalesmanDashboard, deleteComplexApiforSalesmanDashboard, createPropertyApiforSalesmanDashboard, getByIdPropertyApi, editPropertyApi } from '../../../service/api';
const initialState = {
    isLoading: false,
    isCreated: false,
    isActive: false,
    complexData: null,
    propertyList: null,
    createdPropertyData: null,
    editedComplexData: null,
    deletedComplexData: null,
    complexDataById: null,
    // deletedMultiVehicleData: null,
    errors: null,
    successMessage: ''
};

const complexSlice = createSlice({
    name: 'complex',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.successMessage = '';
            state.isCreated = false;
            state.isActive = false;
            state.complexDataById = null;
        },
        handleAllGetComplexData: (state, action) => {
            state.complexData = action.payload;
            state.isLoading = false;
        },
        handleErrorAllGetComplexData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleAllPropertyList: (state, action) => {
            state.propertyList = action.payload?.data;
            state.isLoading = false;
        },
        handleErrorAllPropertyList: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleDeleteComplexData: (state, action) => {
            state.deletedComplexData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorDeleteComplexData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleCreatePropertyData: (state, action) => {
            state.createdPropertyData = action.payload;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
            state.isCreated = true;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorCreatePropertyData: (state, action) => {
            state.errors = action.payload;
            console.error(action.payload,"action");
            state.isLoading = false;
            toast.error(action?.payload, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handlePropertyStatus: (state, action) => {
            state.isLoading = false;
            state.isActive = true;
            state.successMessage = action.payload?.message;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
        handleErrorPropertyStatus: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handleEditComplexData: (state, action) => {
            state.editedComplexData = action.payload;
            state.isLoading = false;
            state.successMessage = action.payload.message;
        },
        handleErrorComplexData: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },

        handleResetComplex: (state) => {
            state.isLoading = false;
            state.createdPropertyData = null;
            state.editedComplexData = null;
            state.deletedComplexData = null;
            state.successMessage = null;
            state.errors = null;
        },
        handlePropertyDetails: (state, action) => {
            state.loading = false;
            state.complexData = action.payload;
            state.error = null;
          },
          handlecomplexDataById: (state, action) => {
            state.complexDataById = action.payload.data;
            state.successMessage = action.payload?.message;
            state.isLoading = false;
        },
        handleErrorPropertyEdit: (state, action) => {
            state.errors = action.payload;
            state.isLoading = false;
        },
        handlePropertyEdit: (state, action) => {
            state.isLoading = false;
            state.isActive = true;
            state.successMessage = action.payload?.message;
            toast.success(action.payload?.message, {
                style: {
                    marginTop: '4rem'
                }
            });
        },
    }
});

export const {
    setLoading,
    handleAllGetComplexData,
    handleAllPropertyList,
    handleErrorAllGetComplexData,
    handleErrorAllPropertyList,
    handlePropertyEdit,
    handleErrorPropertyEdit,
    handlePropertyStatus,
    handleErrorPropertyStatus,
    handleDeleteComplexData,
    handleErrorDeleteComplexData,
    handleCreatePropertyData,
    handleErrorCreatePropertyData,
    handleEditComplexData,
    handleErrorComplexData,
    handleResetComplex,
    handlePropertyDetails,
    handlecomplexDataById
} = complexSlice.actions;

export default complexSlice.reducer;

export const getAllComplexRequest = (queryStr) => async (dispatch, getState) => {
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
        const { data } = await getAllComplexApi(config, queryStr);
        console.log(data, 'data');
        const { statusCode, data: complexData } = data;

        if (statusCode === 200) {
            dispatch(handleAllGetComplexData(complexData));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorAllGetComplexData(error));
        } else {
            dispatch(handleErrorAllGetComplexData(error.message));
        }
    }
};
export const deleteComplexRequest = (id) => async (dispatch, getState) => {
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
        const { data } = await deleteComplexApi(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleDeleteComplexData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorDeleteComplexData(error.response.data.errors));
        } else {
            dispatch(handleErrorDeleteComplexData(error.message));
        }
    }
};
export const createPropertyRequest = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createPropertyApi(reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCreatePropertyData(data));
        }
    } catch (error) {
        console.log(error.response, 'errorrrrrrrr');
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreatePropertyData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreatePropertyData(error.message ));
        }
    }
};

export const createPropertyRequestforSelfInquiry = (reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        };
        const { data } = await createPropertyApiforSelfInquiry(reqData, config);
        console.log(data,"data of self")
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCreatePropertyData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreatePropertyData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreatePropertyData({ error: error.message }));
        }
    }
};
export const allPropertyList = (reqData) => async (dispatch, getState) => {
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
        const { data } = await allPropertyApi(reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleAllPropertyList(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorAllPropertyList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorAllPropertyList(error.message));
        }
    }
};

export const editPropertyApiCall = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await editPropertyApi(id, reqData, config);

        if (data?.statusCode === 200) {
            dispatch(handleEditComplexData(data));
            toast.success(data?.message)
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorComplexData(error.response.data.errors));
        } else {
            return dispatch(handleErrorComplexData(error.message));
        }
    }
};
export const propertyStatus = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await statusPropertyApi(id, reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyStatus(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyStatus(error.response.data.errors));
        } else {
            return dispatch(handleErrorPropertyStatus(error.message));
        }
    }
};
export const editComplexRequest = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await editComplexApi(id, reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleEditComplexData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorComplexData(error.response.data.errors));
        } else {
            return dispatch(handleErrorComplexData(error.message));
        }
    }
};

export const propertyEdit = (id) => async (dispatch, getState) => {
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
        console.log(id,"idddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
        const { data } = await getByIdPropertyApi(id,config);
        console.log(data,"data of detail")
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyEdit(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyEdit(error.response.data.errors));
        } else {
            return dispatch(handleErrorPropertyEdit(error.message));
        }
    }
};

export const getPropertyDetailsRequest = (id) => async (dispatch, getState) => {
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
      const { data } = await getPropertyDetailsApi(id, config);
      console.log(data.data, "dataaaaaaaaaaaaaaaaa");

      if (data.statusCode === 200) {
        // Change this line - we should dispatch handlePropertyDetails instead of handleAllPropertyList
        dispatch(handlePropertyDetails(data.data));
      }
    } catch (error) {
      dispatch(handleErrorDeleteComplexData(error.message || error.response?.data.errors));
    }
  };


  export const getcomplexDataById = (id) => async (dispatch, getState) => {
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
        const { data } = await getPropertyDetailsApi(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlecomplexDataById(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorComplexData(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorComplexData(error.message));
        }
    }
};




  // salesman dashboard

  export const createPropertyRequestforSelesmanDashboard = (reqData) => async (dispatch, getState) => {
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
        const { data } = await createPropertyApiforSalesmanDashboard(reqData, config);
        const { statusCode } = data;

        if (statusCode === 200) {
            dispatch(handleCreatePropertyData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorCreatePropertyData(error.response.data.errors));
        } else {
            return dispatch(handleErrorCreatePropertyData({ error: error.message }));
        }
    }
};

  export const allPropertyListforSalesmanDashboard = (reqData) => async (dispatch, getState) => {
    dispatch(setLoading());
    try {

        console.log( localStorage.getItem('salesmanToken') , "::::: localStorage.getItem('salesmanToken')");
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                Authorization:  localStorage.getItem('salesmanToken')
            }
        };
        const { data } = await allPropertyApiforSalesmanDashboard(reqData, config);
        console.log(data,"dataaa")
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleAllPropertyList(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorAllPropertyList(error.response.data.errors));
        } else {
            if (error.response.data.statusCode === 401) {
                dispatch(handleLogout());
            }
            return dispatch(handleErrorAllPropertyList(error.message));
        }
    }
};

export const propertyStatusForSalesmanDashboard = (id, reqData) => async (dispatch, getState) => {
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
        const { data } = await statusPropertyApiforSalesmanDashboard(id, reqData, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handlePropertyStatus(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            return dispatch(handleErrorPropertyStatus(error.response.data.errors));
        } else {
            return dispatch(handleErrorPropertyStatus(error.message));
        }
    }
};

export const deleteComplexRequestforSalesmanDashboard = (id) => async (dispatch, getState) => {
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
        const { data } = await deleteComplexApiforSalesmanDashboard(id, config);
        const { statusCode } = data;
        if (statusCode === 200) {
            dispatch(handleDeleteComplexData(data));
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            dispatch(handleErrorDeleteComplexData(error.response.data.errors));
        } else {
            dispatch(handleErrorDeleteComplexData(error.message));
        }
    }
};

export const getPropertyDetailsRequestforSalesmanDashboard = (id) => async (dispatch, getState) => {
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
      const { data } = await getPropertyDetailsApi(id, config);
      console.log(data.data, "data");

      if (data.statusCode === 200) {
        // Change this line - we should dispatch handlePropertyDetails instead of handleAllPropertyList
        dispatch(handlePropertyDetails(data.data));
      }
    } catch (error) {
      dispatch(handleErrorDeleteComplexData(error.message || error.response?.data.errors));
    }
  };

