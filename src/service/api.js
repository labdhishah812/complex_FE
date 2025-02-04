import axios from 'axios';

const BASE_URL_API = process.env.REACT_APP_BASE_URL;
export const adminLoginApi = async (reqData) => {
    // console.log('reqData------------', reqData);
    // return await axios.post(`${BASE_URL_API}/user/login`, reqData, {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    // });
    // return await axios.post(`${BASE_URL_API}/user/loginRole`, reqData, {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    // });
    return await axios.post(`${BASE_URL_API}/user/initialLogin`, reqData, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    });
};
export const adminLogiWithSalesman = async (reqData) => {
    return await axios.post(`${BASE_URL_API}/salesman/login`, reqData, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    });
};
export const adminLogiWithProperty = async (reqData) => {
    return await axios.post(`${BASE_URL_API}/user/loginWithProperty`, reqData, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    });
};
export const adminPropertyDetailsApi = async (reqData) => {
    return await axios.post(`${BASE_URL_API}/user/property-details`, reqData, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    });
};
export const adminRoleDetailsApi = async (reqData) => {
    return await axios.post(`${BASE_URL_API}/user/role-details`, reqData, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    });
};
export const getStepperDetailsApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/user/stepper-form/details`, config);
};

export const loginRoleApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/profile/role`, data, config);
};
export const superAdminLoginApi = async (reqData) => {
    return await axios.post(`${BASE_URL_API}/superAdmin/login`, reqData, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    });
};
export const forgotPasswordApi = async (reqData) => {
    return await axios.post(`${BASE_URL_API}/user/forgot-password`, reqData, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    });
};
export const resetPasswordApi = async (reqData) => {
    return await axios.post(`${BASE_URL_API}/user/reset-password`, reqData, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    });
};
export const getProfileDetailsApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/profile/profile`, config);
};
export const adminProfileUpdateApi = async (id, updatedData, config) => {
    return await axios.post(`${BASE_URL_API}/profile/profileUpdate/${id}`, updatedData, config);
};
export const changePasswordApi = async (userData, config) => {
    return await axios.put(`${BASE_URL_API}/admin/profileupdatePass`, userData, config);
};

//User API
export const getAllUsersApi = async (config, queryStr) => {
    return await axios.get(`${BASE_URL_API}/user/getalluser?${queryStr}`, config);
};
export const createUserApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user/adduser`, createdData, config);
};
export const editUserApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/user/updateuser/${id}`, updatedData, config);
};
export const deleteUserApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/user/deleteuser/${id}`, config);
};
export const multipaldeleteUserApi = async (deletedData, config) => {
    return await axios.post(`${BASE_URL_API}/user/deletalluser`, deletedData, config);
};
export const getAllUserNameApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/user/allusersValue`, config);
};

//Vehicle Api
export const getAllVehicleApi = async (config, queryStr) => {
    return await axios.get(`${BASE_URL_API}/vehicle/getallvehicle?${queryStr}`, config);
};
export const createVehicleApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/vehicle/addvehicle`, createdData, config);
};
export const editVehicleApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/vehicle/updatevehicle/${id}`, updatedData, config);
};
export const deleteVehicleApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/vehicle/deletevehicle/${id}`, config);
};
export const multipaldeleteVehicleApi = async (deletedData, config) => {
    return await axios.post(`${BASE_URL_API}/vehicle/deleteallvehicle`, deletedData, config);
};

//Shop API
export const getAllShopApi = async (config, queryStr) => {
    return await axios.get(`${BASE_URL_API}/shop/findAll?${queryStr}`, config);
};
export const createShopApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/shop/create`, createdData, config);
};
export const editShopApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/shop/update/${id}`, updatedData, config);
};
export const deleteShopApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/shop/delete/${id}`, config);
};
export const multipaldeleteShopApi = async (deletedData, config) => {
    return await axios.post(`${BASE_URL_API}/shop/multiDelete`, deletedData, config);
};
export const getAllBlockNameApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/block/allusersValue`, config);
};
export const getAllFloorNameApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/floor/allusersValue`, config);
};
export const getAllShopNameApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/shop/dropDownShop/${id}`, config);
};
//Maintenance Api
export const getAllMaintenanceApi = async (config, queryStr) => {
    return await axios.get(`${BASE_URL_API}/vehicle/getallvehicle?${queryStr}`, config);
};
export const createMaintenanceApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/vehicle/addvehicle`, createdData, config);
};
export const editMaintenanceApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/vehicle/updatevehicle/${id}`, updatedData, config);
};
export const deleteMaintenanceApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/vehicle/deletevehicle/${id}`, config);
};
export const multipaldeleteMaintenanceApi = async (deletedData, config) => {
    return await axios.post(`${BASE_URL_API}/vehicle/deleteallvehicle`, deletedData, config);
};
//Complex Api
export const getAllComplexApi = async (config, queryStr) => {
    return await axios.get(`${BASE_URL_API}/complex/list?${queryStr}`, config);
};
export const createPropertyApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/property/create`, createdData, config);
};

export const createPropertyApiforSelfInquiry = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/property/createInquiry`, createdData, config);
};

export const allPropertyApi = async (tableData, config) => {
    return await axios.post(`${BASE_URL_API}/property/list`, tableData, config);
};
export const statusPropertyApi = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/property/${id}`, data, config);
};
export const editComplexApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/complex/update/${id}`, updatedData, config);
};
export const deleteComplexApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/complex/delete/${id}`, config);
};
export const getPropertyDetailsApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/property/propertyDetails/${id}`, config);
};
export const getByIdPropertyApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/property/propertyDetails/${id}`, config);
};
export const editPropertyApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/property/update/${id}`, updatedData, config);
};

//salesman dashboard api

export const createPropertyApiforSalesmanDashboard = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/salesman/createproperty`, createdData, config);
};
export const allPropertyApiforSalesmanDashboard = async (tableData, config) => {
    return await axios.post(`${BASE_URL_API}/salesman/propertylistofsalesman`, tableData, config);
};
export const statusPropertyApiforSalesmanDashboard = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/property/${id}`, data, config);
};
export const editComplexApiforSalesmanDashboard = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/complex/update/${id}`, updatedData, config);
};
export const deleteComplexApiforSalesmanDashboard = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/complex/delete/${id}`, config);
};
export const getPropertyDetailsApiforSalesmanDashboard = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/property/propertyDetails/${id}`, config);
};

// Block API
export const getAllBlockApi = async (config, queryStr) => {
    return await axios.get(`${BASE_URL_API}/block/listing?${queryStr}`, config);
};
export const createBlockApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/complex/complexStructure`, createdData, config);
};
export const createStructureApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/block/create-structure`, createdData, config);
};
export const createShoppingStructureApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/block/create-shopping-structure`, createdData, config);
};
export const structureViewApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/block/view-structure`, createdData, config);
};
export const shoppingStructureViewApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/block/shopping-view-structure`, createdData, config);
};
export const createFloorStructureApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/floor/create-structure`, createdData, config);
};
export const createShoppingFloorStructureApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/floor/create-shopping-structure`, createdData, config);
};
export const floorStructureViewApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/floor/view-structure`, config);
};
export const floorShoppingStructureViewApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/floor/view-shop-structure`, config);
};
//Block Api latest
export const getBlockDropdownApi = async (config, queryStr) => {
    return await axios.get(`${BASE_URL_API}/block/drop-down-all`, config);
};
export const getShopBlockDropdownApi = async (config, queryStr) => {
    return await axios.get(`${BASE_URL_API}/block/drop-down-shop`, config);
};
// Floor Api latest
export const getFloorDropdownApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/floor/drop-down`, createdData, config);
};
export const getShopFloorDropdownApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/floor/drop-down-shop`, createdData, config);
};

// Property Assign
export const getPropertyDropdownApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user-property-assign/drop-down`, createdData, config);
};
export const getPropertyDropDownWithOwnerIdApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user-property-assign/drop-down/owner-id`, createdData, config);
};
export const getPropertyDropDownWithOwnerIdLatestApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user-property-assign/drop-down/property-list`, createdData, config);
};
export const getVehicleUserPropertyListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user-property-assign/vehicle-user-property-list`, createdData, config);
};

// user-property-assign/vehicle-user-property-list
//Property Assign Api
export const propertyAssignRequestApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user/property-wise-create`, createdData, config);
};
export const propertyBusinessRequestApi = async (createdData, config) => {
    console.log(createdData,"created")
    console.log(config , 'configgggg')
    return await axios.put(`${BASE_URL_API}/user-property-assign/addedit-business`, createdData, config);
    // return await axios.put(`https://api-interior-informative-dna.trycloudflare.com/api/user-property-assign/addedit-business`, createdData, config);
};
// export const propertyBusinessUpdateApi = async (id, createdData, config) => {
//     console.log(id , "iddddddddd")
//     return await axios.put(`${BASE_URL_API}/user-property-assign/addedit-business/${id}`, createdData, config);
//     // return await axios.put(`https://api-interior-informative-dna.trycloudflare.com/api/user-property-assign/addedit-business`, createdData, config);
// };

export const multiPropertyAssignRequestApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user-property-assign/assign-multiple-property`, createdData, config);
};
export const propertyDataApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user-property-assign/list`, createdData, config);
};
export const tenantDataApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user-property-assign/listRental`, createdData, config);
};
export const tenantDataByid = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/user-property-assign/list/${id}`, config);
};
// export const deleteAssignedTenantApi = async (id, config) => {
//     return await axios.put(`${BASE_URL_API}/rental/deletebyid/${id}`, config);
// };
export const deleteAssignedTenantApi = async (id, reqData, config) => {
    console.log(config, "config")
    return await axios.put(`${BASE_URL_API}/rental/deletebyid/${id}`, reqData, config);  // Updated to include reqData
};
export const deleteAssignedPropertyApi = async (ids, config) => {
    return await axios.post(`${BASE_URL_API}/user-property-assign/remove-user-property-access`, ids, config);
};
export const propertyDetailsByid = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/user-property-assign/list/${id}`, config);
};
export const getPropertyStructureAll = async (config) => {
    return await axios.get(`${BASE_URL_API}/user-property-assign/property_structure/all`, config);
};
export const propertyTransferApi = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/user/propertyTransfer/${id}`, data, config);
};
export const propertyOwnerHistoryApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/user/ownerlist/${id}`, config);
};
// User
export const getUserDropdownApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/user-property-assign/user-dropdown-list`, config);
};
export const getUserDropdownPropertyAssignApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/user-property-assign/user-dropdown-list-property-assign`, config);
};

export const getUserDropdownApiForTenant = async (config) => {
    return await axios.get(`${BASE_URL_API}/rental/dropdown/user-dropdown-list`, config);
};

export const userDetailsByPropertyAssignedID = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user-property-assign/userdetails-drop-down`, createdData, config);
};
export const tenantTransferApi = async (id, data, config) => {
    console.log(id, 'idddddddd')
    console.log(data , 'data');
    return await axios.put(`${BASE_URL_API}/rental/createRental/${id}`, data, config);
};
//complaint

export const createComplaint = async (createdData, config) => {
    // return await axios.post(`${BASE_URL_API}/complaint/create`, createdData, config);
    return await axios.post(`${BASE_URL_API}/newcomplaint/create`, createdData, config);
};
export const getComplaintsApi = async (createdData, config) => {
    // return await axios.post(`${BASE_URL_API}/complaint/list`, createdData, config);
    return await axios.post(`${BASE_URL_API}/newcomplaint/list`, createdData, config);
};
export const complaintRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/newcomplaint/${id}`, config);
};
export const updateComplainApi = async (id, updatedData, config) => {
    // return await axios.put(`${BASE_URL_API}/complaint/${id}`, updatedData, config);
    return await axios.put(`${BASE_URL_API}/newcomplaint/${id}`, updatedData, config);
};
export const updateComplainStatusApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/newcomplaint/status-update/${id}`, updatedData, config);
};
export const getComlaintDetailById = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/newcomplaint/list/${id}`, config);
};
//Maintenance latest api
export const createMaintenanceSettingApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/maintenance/settings`, createdData, config);
};
export const getMaintenanceSettingApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/maintenance/list`, config);
};
export const getMaintenanceFloorApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/maintenance/floor-list-dropdown`, config);
};
export const getMaintenanceBlockApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/maintenance/block-list-dropdown`, config);
};
export const updateMaintenanceSettingApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/maintenance/update-settings/${id}`, updatedData, config);
};
export const monthlyMaintenanceUserWiseApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/maintenance/v2/monthly/userwise`, createdData, config);
    // return await axios.post(`${BASE_URL_API}/maintenance/list/userwise`, createdData, config);
};

export const monthlyMaintenanceCreateApi = async (config) => {
    // return await axios.get(`${BASE_URL_API}/maintenance/monthly-payment-create`, config);
    return await axios.get(`${BASE_URL_API}/maintenance/v2/monthly-payment-create`, config);
};

export const createOrderIDApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/maintenance/v2/order`, createdData, config);
};
export const checkPaymentApi = async (createdData, config) => {
    // return await axios.post(`${BASE_URL_API}/maintenance/offline-payment`, createdData, config);
    return await axios.post(`${BASE_URL_API}/maintenance/v2/offline-payment`, createdData, config);
};
export const UploadPaymentImageApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/maintenance/receipt`, createdData, config);
};
export const getMaintenanceDetailByIdApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/maintenance/${id}`, config);
};
export const getDataCollectedAmount = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/maintenance/data/total_due_maintenance`, createdData, config);
};
//announcement
export const announcementCreateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/announcement/create`, createdData, config);
};
export const getAnnouncementApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/announcement/list`, createdData, config);
};
export const getAnnouncementDetailByIdApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/announcement/list/${id}`, config);
};
export const announcementRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/announcement/${id}`, config);
};
export const updateAnnouncementApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/announcement/${id}`, updatedData, config);
};
//vehicle assign latest
export const vehicleAssignApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/vehicle/create`, createdData, config);
};
export const getVehicleListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/vehicle/list`, createdData, config);
};
export const updateVehicleAssignApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/vehicle/${id}`, updatedData, config);
};
export const vehicleRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/vehicle/${id}`, config);
};
export const vehicleSettingDetailApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/vehicle-settings/list`, config);
};
export const vehicleSettingCreateApi = async (createdData, config) => {
    // return await axios.post(`${BASE_URL_API}/vehicle-settings/create`, createdData, config);
    return await axios.post(`${BASE_URL_API}/vehicle-settings/createVersion3`, createdData, config);
};
export const vehicleSettingUpdateApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/vehicle-settings/${id}`, updatedData, config);
};
export const vehicleDetailById = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/vehicle/${id}`, config);
};
//vendors api
export const vendorAssignApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/vendor/create`, createdData, config);
};
export const getVendorListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/vendor/list`, createdData, config);
};
export const getVendorTypeApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/vendor/list/category`, config);
};
export const updateVendorAssignApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/vendor/${id}`, updatedData, config);
};
export const vendorRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/vendor/${id}`, config);
};
export const vendorDetailById = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/vendor/${id}`, config);
};

//cms api
export const aboutUsUpdateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/aboutus/create`, createdData, config);
};
export const getAboutusListApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/aboutus/list`, config);
};
export const privacyPolicyUpdateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/privacypolicy/create`, createdData, config);
};
export const getPrivacyPolicyListApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/privacypolicy/list`, config);
};
export const termsConditionUpdateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/terms-condition/create`, createdData, config);
};
export const getTermsConditionListApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/terms-condition/list/toc`, config);
};
export const footerUpdateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/footer/create`, createdData, config);
};
export const getFooterListApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/footer/list`, config);
};

//Rental api
export const rentalAssignApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/rental/create`, createdData, config);
};
export const getRentalListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/rental/list`, createdData, config);
};
export const updateRentalAssignApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/rental/${id}`, updatedData, config);
};
export const rentalRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/rental/${id}`, config);
};
export const getPropertyDropDownForUser = async (createdData, config) => {
    return await axios.get(`${BASE_URL_API}/rental/user-wise/property-list `, config);
};
export const updateRentalStatusApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/rental/status/${id}`, updatedData, config);
};
export const getRentalDetailByid = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/rental/${id}`, config);
};

export const rantalTransferApi = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/user/propertyTransfer/${id}`, data, config);
};
//Roles
export const roleCreateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/role/create `, createdData, config);
};
export const getRoleListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/role/list`, createdData, config);
};
export const getRoleDataById = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/role/${id}`, config);
};
export const updateRoleApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/role/${id}`, updatedData, config);
};
export const roleRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/role/${id}`, config);
};
//committee
export const getRoleDropDownApi = async (createdData, config) => {
    return await axios.get(`${BASE_URL_API}/role/property-wise/list`, config);
};
export const userCommitteeCreateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user/committee-member-create`, createdData, config);
};
export const userCreateGeneralMemberApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user/general-core-committee-member-create`, createdData, config);
};
export const getCommitteeListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user/committee-member-list`, createdData, config);
};
export const generalMemberListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user/general-core-committee-member-list`, createdData, config);
};
export const getCommitteeDetailsApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/user/${id}`, config);
};
export const updateCommitteeApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/user/committee-member/${id}`, updatedData, config);
};
export const committeeRemoveApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/user/committee-member/delete`, data, config);
};

//Profile

export const getProfileDataApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/user/${id}`, config);
};
// export const updateProfileApi = async (id, updatedData, config) => {
//     return await axios.put(`${BASE_URL_API}/user/${id}`, updatedData, config);
// };
export const updateProfileApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/user/${id}`, updatedData, config);
};
export const updatePasswordApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user/change-password`, createdData, config);
};

//Excel Upload
export const uploadPropertyStructureApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/block/create-property-structure-excel`, data, config);
};
export const uploadShoppingStructureApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/block/create-shopping-structure-excel`, data, config);
};

// super admin dashboard
export const getLatsFiveDataApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/property/latest`, config);
};
export const getLatsInactiveDataApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/property/lastInactive`, config);
};
export const getGrapgDataApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/property/list/yearly `, data, config);
};

// UserDashboard

export const getUserTotalProperty = async (config) => {
    return await axios.get(`${BASE_URL_API}/user/all/totalproperty`, config);
};
export const getUserTotalVehicle = async (config) => {
    return await axios.get(`${BASE_URL_API}/user/all/totalvehicle`, config);
};
export const getUserTotalComplaint = async (config) => {
    return await axios.get(`${BASE_URL_API}/user/all/totalcomplaint`, config);
};
export const getRecentlyCollectedMaintenance = async (config) => {
    return await axios.get(`${BASE_URL_API}/user/recently/collected_maintenance`, config);
};
export const getRecentlyAllocatedProperty = async (config) => {
    return await axios.get(`${BASE_URL_API}/user/recently/allocated_property`, config);
};
export const getAllDataDashboard = async (config) => {
    // return await axios.get(`${BASE_URL_API}/user/all/total`, config);
    return await axios.get(`${BASE_URL_API}/user/all/DashboardDetails`, config);
};

//meeting
export const createMeetingApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/society-meeting/create`, data, config);
};
export const getMeetingListApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/society-meeting/list`, data, config);
};
export const getMeetingDetailByIdApi = async (data, config) => {
    return await axios.get(`${BASE_URL_API}/society-meeting/${data}`, config);
};
export const updateMeetingApi = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/society-meeting/${id}`, data, config);
};
export const removeMeetingApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/society-meeting/${id}`, config);
};
export const updateMeetingStatusApi = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/society-meeting/status-update/${id}`, data, config);
};
export const getUserDropDownApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/user/property/user-drop-down`, config);
};

// building-rules
export const getBuildingRulesApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/buildingrules/list`, data, config);
};
export const createBuildingRulesApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/buildingrules/create`, data, config);
};
export const updateBuildingRulesApi = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/buildingrules/${id}`, data, config);
};
export const gwtBuildingRulesByIDApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/buildingrules/databyid/${id}`, config);
};
export const removeBuildingRulesApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/buildingrules/delete/${id}`, config);
};

// emergency-contact
export const getContactListApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/emergencycontact/list`, data, config);
};
export const createContactApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/emergencycontact/create`, data, config);
};
export const updateContyactApi = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/emergencycontact/${id}`, data, config);
};
export const removeContactApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/emergencycontact/delete/${id}`, config);
};

//event
export const createEventApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/event/create`, data, config);
};
export const getEventListApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/event/list`, data, config);
};
export const getEventDetailByIdApi = async (data, config) => {
    return await axios.get(`${BASE_URL_API}/event/databyid/${data}`, config);
};
export const updateEventApi = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/event/update/${id}`, data, config);
};
export const removeEventApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/event/delete/${id}`, config);
};

// contract Api
export const getContractListApi = async (queryStr, config) => {
    return await axios.post(`${BASE_URL_API}/contract/list`, queryStr, config);
};
export const createContractApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/contract/create`, data, config);
};
export const updateContractApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/contract/${id}`, updatedData, config);
};
export const renewContractApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/contract/status-update/${id}`, updatedData, config);
};
export const contractHistoryApi = async (company_name, config) => {
    return await axios.post(`${BASE_URL_API}/contract/contracthistory`, company_name, config);
};
export const contractRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/contract/${id}`, config);
};
export const contractDetailById = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/contract/contractListID/${id}`, config);
};
// fd Api
export const getFdListApi = async (queryStr, config) => {
    return await axios.post(`${BASE_URL_API}/fixeddeposit/list`, queryStr, config);
};
export const createFdApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/fixeddeposit/create`, data, config);
};
export const updateFdApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/fixeddeposit/${id}`, updatedData, config);
};
export const fdRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/fixeddeposit/${id}`, config);
};
export const fdDetailById = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/fixeddeposit/${id}`, config);
};

//notice
export const getNoticeListApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/notice/listAll`, data, config);
};
export const createNoticeApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/notice/create`, data, config);
};
export const getNoticeDetailByIdApi = async (data, config) => {
    return await axios.get(`${BASE_URL_API}/notice/${data}`, config);
};
export const updateNoticeApi = async (id, data, config) => {
    return await axios.put(`${BASE_URL_API}/notice/${id}`, data, config);
};
export const removeNoticeApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/notice/${id}`, config);
};

// export const removeContactApi = async (id, config) => {
//     return await axios.delete(`${BASE_URL_API}/emergencycontact/delete/${id}`, config);
// };
//expense Api
export const getExpenseListApi = async (queryStr, config) => {
    return await axios.post(`${BASE_URL_API}/expense-tracker/list`, queryStr, config);
};
export const createExpenseApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/expense-tracker/create`, data, config);
};
export const updateExpenseApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/expense-tracker/${id}`, updatedData, config);
};
export const updateExpenseStatusApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/expense-tracker/payment-status/${id}`, updatedData, config);
};
export const expenseRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/expense-tracker/${id}`, config);
};
export const expenseDetailById = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/expense-tracker/${id}`, config);
};
export const getNotificationsForWeb = async (reqData, config) => {
    return await axios.get(`${BASE_URL_API}/notification/databyidforweb${reqData}`, config);
};
export const getNotifications = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/notification/databyid`, config);
};
export const markAsReadNotifications = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/notification/MarkAsRead`, config);
};
export const expenseCategoryApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/expense-tracker/list/category`, config);
};

// resolutions
export const resolutionsCreateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/resolution/create`, createdData, config);
};
export const getResolutionsDetailByid = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/resolution/databyid/${id}`, config);
};
export const resolutionsUpdateApi = async (id, createdData, config) => {
    return await axios.put(`${BASE_URL_API}/resolution/update/${id}`, createdData, config);
};
export const removeResolutionApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/resolution/delete/${id}`, config);
};

// general member add

export const userGeneralMemberCreateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user/core-committee-member-create`, createdData, config);
};
export const getGeneralMemberListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/user/core-committee-member-list`, createdData, config);
};
export const getGeneralMemberDetailsApi = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/user/${id}`, config);
};
export const updateGeneralMemberApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/user/core-committee-member/${id}`, updatedData, config);
};
export const generalMemberRemoveApi = async (data, config) => {
    return await axios.post(`${BASE_URL_API}/user/committee-member/delete`, data, config);
};

//Feed

export const createFeedApi = async (data, config) => {
    const dataa = await axios.post(`${BASE_URL_API}/feed/createV2`, data, config);
    return dataa;
};
export const getFeedApi = async (queryStr, config) => {
    return await  axios.post(`${BASE_URL_API}/feed/listFeed`, queryStr, config);
};
export const updateFeedDataApi = async (id, updatedData, config) => {
    console.log(id , "idddddddd")
    console.log(updatedData, "update")
    return await axios.put(`${BASE_URL_API}/feed/like_feed_or_poll/${id}`, updatedData, config);
};
export const removeFeedApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/feed/${id}`, config);
};
export const feedDetailsByid = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/feed/${id}`, config);
};
export const updateFeedAndPollDataApi = async (id, reqData, config) => {
    console.log(id , "idd from api file")
    return await axios.put(`${BASE_URL_API}/feed/${id}`, reqData, config);
};

// salesman from superadmin

export const createSalesmanApi = async (data, config) => {
    const dataa = await axios.post(`${BASE_URL_API}/salesman/createsalesman`, data, config);
    return dataa;
};
export const getSalesmanDataApi = async (queryStr, config) => {
    return await  axios.post(`${BASE_URL_API}/salesman/salesmanlist`, queryStr, config);
};
export const updateSalesmanStatusApi = async (salesmanId, {status}, config) => {
    console.log(salesmanId,"salesmanstatus")
    return await axios.put(`${BASE_URL_API}/salesman/salesmanstatus/${salesmanId}`, {status}, config);
};
export const removeSalesmanApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/salesman/deletesalesman/${id}`, config);
};
export const salesmanDetailsByid = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/salesman/salesman/${id}`, config);
};
export const updateSalesmanDataApi = async (id, reqData, config) => {
    return await axios.put(`${BASE_URL_API}/salesman/updatesalesmanforadmin/${id}`, reqData, config);
};


// pincode
export const getAddressFromPincode = async ({ searchTerm, page = 1, limit = 10 }) => {
    try {
        const response = await axios.post(`${BASE_URL_API}/pincodes/suggestions`, {
            searchTerm,
            page,
            limit
        });

        // Validate response structure
        if (!response?.data) {
            throw new Error('Invalid response from server');
        }

        return response;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('No addresses found for this pincode');
            } else if (error.response.status === 429) {
                throw new Error('Too many requests. Please try again later');
            } else if (error.response.data?.message) {
                throw new Error(error.response.data.message);
            }
        } else if (error.request) {
            throw new Error('No response from server. Please check your internet connection');
        }
        throw error;
    }
};

export const cancelPincodeRequests = () => {
    if (typeof AbortController !== 'undefined') {
        const controller = new AbortController();
        controller.abort();
        return controller.signal;
    }
    return null;
};

//gatekeeper

export const getGateKepperListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/gatekeeper/list`, createdData, config);
};
// export const getGateKepperAssignApi = async (createdData, config) => {
//     return await axios.post(`${BASE_URL_API}/gatekeeper/create`, createdData, config);
// };
export const getGateKepperAssignApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/gatekeeper/createbase64`, createdData, config);
};
export const updateGateKeeperAssignApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/gatekeeper/updatebase64/${id}`, updatedData, config);
};
export const gateKeeperDetailById = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/gatekeeper/databyid/${id}`, config);
};
export const gateKeeperRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/gatekeeper/delete/${id}`, config);
};
export const fetchContractTypesApi = async (config) => {
    return await axios.get(`${BASE_URL_API}/contract/dropdown`, config);
};

//gatepass

export const getGatePassListApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/gatepass/list`, createdData, config);
};
export const getGatePassCreateApi = async (createdData, config) => {
    return await axios.post(`${BASE_URL_API}/gatepass/create`, createdData, config);
};
export const gatePassDetailById = async (id, config) => {
    return await axios.get(`${BASE_URL_API}/gatepass/databyid/${id}`, config);
};
export const updateGatePassAssignApi = async (id, updatedData, config) => {
    return await axios.put(`${BASE_URL_API}/gatepass/update/${id}`, updatedData, config);
};
export const gatePassRemoveApi = async (id, config) => {
    return await axios.delete(`${BASE_URL_API}/gatepass/delete/${id}`, config);
};
