import React from 'react';
import components from '../..';
import Loader from '../../../../components/Loader';
import MaintenanceSetting from '../VizardPage/maintenaceSetting';
import { getMaintenanceSettingRequest } from '../../../../redux/slice/AdminSlices/maintenanceSlice';
const MaintenanceSettingEdit = () => {
    const { React, useNavigate, BreadCrumb, useState, useEffect, useDispatch, useSelector } = components;
    const { loginDetails } = useSelector((store) => store.auth);
    const { isSettingCreated, MaintenanceSettingData, isLoading } = useSelector((store) => store.maintenance);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [decode, setDecode] = useState(null);
    const breadcrumbHome = {
        label: 'Maintenance Setting',
        command: () => {
            navigate(`/property-management/maintenance-setting`)
            // decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //     decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //     // navigate(decode.role === 'User' ? '/dashboard' : `/${decode ? decode?.property_name && decode?.property_name.replace(' ', '-').toLowerCase() : ''}/dashboard`);
            //     navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Maintenance Setting Edit',
            // command: () => {
            //     navigate(decode.role === 'User' ? '/property-assign' : '/admin/property-assign');
            // }
        }
    ];
    useEffect(() => {
        // decodeData();
        dispatch(getMaintenanceSettingRequest());
        if (isSettingCreated) {
            navigate(`/property-management/maintenance-setting`)
        }
        // setModal(false);
        // setEditData(null);
    }, [dispatch, isSettingCreated]);
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Maintenance Setting Edit</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <MaintenanceSetting decode={loginDetails} editData={MaintenanceSettingData?.data ? MaintenanceSettingData?.data : null} />
            </div>
        </div>
    )
}
export default MaintenanceSettingEdit;