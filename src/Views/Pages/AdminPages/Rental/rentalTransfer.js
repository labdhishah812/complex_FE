import components from '../..';
import Loader from '../../../../components/Loader';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getRentalDataByid } from '../../../../redux/slice/AdminSlices/RentalSlice';
import { getUserDropdown } from '../../../../redux/slice/AdminSlices/userSlice';
import { useParams } from 'react-router-dom';

const RentalTransfer = () => {
    const { PickList, Divider, Image, BreadCrumb, RadioButton, Dropdown, InputText, InputNumber, InputTextarea, Button, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { isCreated, propertyFromStructur, isTransfer, isLoading, tenantDataById } = useSelector((store) => store.rental);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Tenant',
        command: () => {
            navigate('/property-management/tenant');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Tenant Transfer'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];

    useEffect(() => {
        if (params.id) {
            dispatch(getRentalDataByid(params.id))
        }
    }, [params.id]);

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Property Transfer</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className='crud-demo ml-0 mr-0 card mt-3'>
                <Divider align="center" className=" pt-0">
                    <span className="p-tag text-base">Current Tenant</span>
                </Divider>
                {/* <div className='font-semibold text-xl'>Current User</div> */}
                <ul className="list-none p-0 m-0 mt-3">
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Property No.
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {tenantDataById?.property_number ? tenantDataById?.property_number : "-"}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Owner's Name
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {tenantDataById?.name ? tenantDataById?.name : "-"}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Property Category
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {tenantDataById?.email ? tenantDataById?.email : "-"}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Sq. Ft. Area
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {tenantDataById?.mobile_number ? tenantDataById?.mobile_number : "-"}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Business Name
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {tenantDataById?.alternate_number ? tenantDataById?.alternate_number : "-"}

                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Business Category
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {tenantDataById?.property_sq_feet_area ? tenantDataById?.property_sq_feet_area : "-"}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Email
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {tenantDataById?.alternate_number ? tenantDataById?.alternate_number : "-"}

                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Mobile No.
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {tenantDataById?.property_sq_feet_area ? tenantDataById?.property_sq_feet_area : "-"}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Alternate No.
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {tenantDataById?.alternate_number ? tenantDataById?.alternate_number : "-"}

                        </div>
                    </li>
                </ul>
            </div>
        </div>

    )
}
export default RentalTransfer;

