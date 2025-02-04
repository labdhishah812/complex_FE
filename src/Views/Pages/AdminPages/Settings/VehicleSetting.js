import React from 'react';
import components from '../..';
import Loader from '../../../../components/Loader';
import VehicleSetting from '../VizardPage/vehicleSetting';

const VehicleSettingPage = () => {
    const { Button, React, useNavigate, BreadCrumb, useState, useEffect, useDispatch, useSelector } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((store) => store.vehicle);
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`)
            // decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //     decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //     // navigate(decode.role === 'User' ? '/dashboard' : `/${decode ? decode?.property_name && decode?.property_name.replace(' ', '-').toLowerCase() : ''}/dashboard`);
            //     navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Vehicle Setting',
            // command: () => {
            //     navigate(decode.role === 'User' ? '/property-assign' : '/admin/property-assign');
            // }
        }
    ];
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Vehicle Setting</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <VehicleSetting fromWizard={false} />
            </div>
        </div>
    )
}

export default VehicleSettingPage;