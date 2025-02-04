import React from 'react';
import components from '../..';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../../../components/Loader';
// import MaintenanceSetting from '../VizardPage/maintenaceSetting';
import { getMaintenanceSettingRequest } from '../../../../redux/slice/AdminSlices/maintenanceSlice';
const MaintenanceSettingPage = () => {
    const { Button, React, useNavigate, BreadCrumb, useState, useEffect, useDispatch, useSelector } = components;
    const { loginDetails, token } = useSelector((store) => store.auth);
    const { isSettingCreated, MaintenanceSettingData, isLoading } = useSelector((store) => store.maintenance);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [decode, setDecode] = useState(loginDetails);
    const [isPdfLoding, setIsPdfLoading] = useState(false);
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
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

    function formatAmount(amount) {
        if (!amount) return "0"; // Handle null or undefined
        const num = Number(amount);
        if (isNaN(num)) return amount; // Return the original value if not a number
        return num.toLocaleString('en-IN'); // Format the number with commas
    }

    const breadcrumbItems = [
        {
            label: 'Maintenance Setting',
            // command: () => {
            //     navigate(decode.role === 'User' ? '/property-assign' : '/admin/property-assign');
            // }
        }
    ];
    useEffect(() => {
        // decodeData();
        dispatch(getMaintenanceSettingRequest());
        // setModal(false);
        // setEditData(null);
    }, [dispatch, isSettingCreated]);
    const getRoles = (permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === "maintenance-settings")?.module_access.findIndex((y) => y === permissionName);
                    if (check !== undefined && check !== -1 && checkPrmition === false) {
                        checkPrmition = true;
                    }
                })
                // if (decode?.role_permissions.find((a) => a.role === "Chairman")?.role === "Chairman") {
                //     let checkIndex = decode?.role_permissions.find((a) => a.role === "Chairman").permission.findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === permissionName) !== -1);
                //     check = checkIndex !== -1
                // }
            }
            // let check = decode?.role_permissions.find((a) => a.role === "chairman").findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === permissionName) !== -1);
            return checkPrmition;
        } catch (error) {
            console.log(error);
        }
    };
    const checkIsItShow = () => {
        try {
            let sent = false;
            if (
                (MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise && MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise.length > 0) || (MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise && MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise.length > 0) ||
                (MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise_for_shopping_center && MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise_for_shopping_center.length > 0) ||
                (MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise_blockhouse && MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise_blockhouse.length > 0) ||
                (MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise_for_shopping_center && MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise_for_shopping_center.length > 0)
            ) {
                sent = true;
            }
            return sent;
            // MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise.length>0
        } catch (error) {
            console.log(error);
        }
    }
    const downloadPdfCall = async () => {
        try {

            setIsPdfLoading(true);
            axios({
                url: `${BASE_URL_API}/maintenance/maintenance_rate_card/chairman`,
                method: 'get', // Change to POST
                responseType: 'blob', // Important to handle binary data
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    Authorization: token
                },
                // data: {
                //     property_assign_id: val
                // }
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `${loginDetails?.property_name + " " + "Maintenance Rate Card"}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setIsPdfLoading(false);
            }).catch((error) => {
                console.error('Error downloading the file:', error);
                toast.error(`Something Went Wrong`, {
                    style: {
                        marginTop: '4rem'
                    }
                });
                setIsPdfLoading(false);
            });

        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading || isPdfLoding} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Maintenance Setting</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto"
                    // onClick={() => downloadPdfCall()}
                    />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    <div className="flex align-items-center justify-content-end  mt-2">
                        {/* <h4 className="mt-2">Property Structure View</h4> */}
                        {/* <a href={`/property-management/maintenancelist/rate-maintainance`} target='blanck'> */}
                        <a href={`/property-management/maintenancelist/rate-maintainance`} target='blanck'><Button label="View" icon="pi pi-eye" className="p-button-outlined p-button-help mr-2"
                        // onClick={() => downloadPdfCall()}
                        /></a>
                        <Button label="Download" icon="pi pi-cloud-download" className="p-button-outlined p-button-info mr-2"
                            onClick={() => downloadPdfCall()}
                        />
                        {/* </a> */}
                        {getRoles('create') && MaintenanceSettingData?.data.length === 0 && (
                            <Button
                                label={`Create`}
                                icon="pi pi-plus"
                                className="p-button-outlined p-button-success"
                                onClick={() => {
                                    navigate(`/property-management/maintenance-setting-update`);
                                    // setModal(true);
                                    // MaintenanceSettingData?.data && setEditData(MaintenanceSettingData?.data);
                                }}
                            />
                        )}
                        {getRoles('update') && MaintenanceSettingData?.data.length > 0 && (
                            <Button
                                label={`Edit`}
                                icon="pi pi-plus"
                                className="p-button-outlined p-button-success"
                                onClick={() => {
                                    navigate(`/property-management/maintenance-setting-update`);
                                    // setModal(true);
                                    // MaintenanceSettingData?.data && setEditData(MaintenanceSettingData?.data);
                                }}
                            />
                        )}
                    </div>
                    {MaintenanceSettingData?.data.length > 0 && (
                        <div className="grid p-fluid mt-1">
                            {MaintenanceSettingData?.data[0]?.maintenance_type === 'fixed' || (MaintenanceSettingData?.data[0]?.maintenance_type === 'sq_feet_wise' && loginDetails?.is_house_exist_in_property && loginDetails?.is_block_exist_in_property === undefined) ? <div className='card w-20rem ml-2'>
                                <div className="field">
                                    <label className="text-600">Maintenance Type :- <span className='text-900'>{MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? 'Floor Wise' : MaintenanceSettingData?.data[0].maintenance_type === 'sq_feet_wise' ? 'Square Feet Wise' : 'Fixed'}</span></label>
                                    {/* <div className="">
                                        {MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? 'Floor Wise' : MaintenanceSettingData?.data[0].maintenance_type === 'sq_feet_wise' ? 'Square Feet Wise' : 'Fixed'}
                                    </div> */}
                                </div>
                                {/* {MaintenanceSettingData?.data[0]?.maintenance_type === 'fixed' && ( */}
                                <div className="field mb-1">
                                    <label className="text-600">{"Maintenance Amount(₹) :- "}<span className='text-900'>   {formatAmount(MaintenanceSettingData?.data[0]?.maintenance_amount)}
                                    </span></label>
                                    {/* <div className="">{MaintenanceSettingData?.data[0].maintenance_amount}</div> */}
                                </div>
                                {/* )} */}
                            </div>
                                : <div className="field ml-2">
                                    <label className="text-600">Maintenance Type :- <span className='text-900'>{MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? 'Floor Wise' : MaintenanceSettingData?.data[0].maintenance_type === 'sq_feet_wise' ? 'Square Feet Wise' : 'Fixed'}</span></label>
                                    {/* <div className="">
                                {MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? 'Floor Wise' : MaintenanceSettingData?.data[0].maintenance_type === 'sq_feet_wise' ? 'Square Feet Wise' : 'Fixed'}
                            </div> */}
                                </div>
                            }
                            {/* <div className="field col-12 md:col-4 mb-1">
                                <label className="">Maintenance Type</label>
                                <div className="border-1 p-2 border-round-md border-400">
                                    {MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? 'Floor Wise' : MaintenanceSettingData?.data[0].maintenance_type === 'sq_feet_wise' ? 'Square Feet Wise' : 'Fixed'}
                                </div>
                            </div> */}
                            {/* {MaintenanceSettingData?.data[0]?.maintenance_type === 'fixed' && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <label className="">Maintenance Amount</label>
                                    <div className="border-1 p-2 border-round-md border-400">{MaintenanceSettingData?.data[0].maintenance_amount}</div>
                                </div>
                            )} */}
                        </div>
                    )}
                    {MaintenanceSettingData?.data[0]?.maintenance_type !== 'fixed' && MaintenanceSettingData?.data.length > 0 && checkIsItShow() && (
                        <table className="maintenanceSettings_table">
                            <thead>
                                <tr>
                                    <th className="maintenanceSettings_table_th">Property Type</th>
                                    <th className="maintenanceSettings_table_th">{loginDetails?.is_house_exist_in_property ? "Block" : "Floor"}</th>
                                    <th className="maintenanceSettings_table_th w-20rem text-right pr-4">{"Maintenance Amount(₹)"} </th>
                                </tr>
                            </thead>
                            {loginDetails?.is_house_exist_in_property === undefined && < tbody >
                                {(MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise : MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise).map((x, i) => (
                                    <tr>
                                        {i === 0 && (
                                            <td className="maintenanceSettings_table_td" rowspan="0">
                                                {`${decode?.property_name} (${decode?.property_type})`}
                                            </td>
                                        )}
                                        <td className="maintenanceSettings_table_td">{x.floor_name}</td>
                                        <td className="maintenanceSettings_table_td text-right pr-4">{MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? x.floor_wise_maintenance_amount : x.sq_feet_wise_maintenance_amount}</td>
                                    </tr>
                                ))}
                            </tbody>}
                            {loginDetails?.is_house_exist_in_property && < tbody >
                                {MaintenanceSettingData?.data[0].maintenance_type === 'sq_feet_wise' && MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise_blockhouse.map((x, i) => (
                                    <tr>
                                        {i === 0 && (
                                            <td className="maintenanceSettings_table_td" rowspan="0">
                                                {`${decode?.property_name} (${decode?.property_type})`}
                                            </td>
                                        )}
                                        <td className="maintenanceSettings_table_td">{x.block_name}</td>
                                        <td className="maintenanceSettings_table_td text-right pr-4">{x.sq_feet_wise_maintenance_amount}</td>
                                    </tr>
                                ))}
                            </tbody>}
                            {(MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise_for_shopping_center || MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise_for_shopping_center) && (
                                <tbody>
                                    {(MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise_for_shopping_center : MaintenanceSettingData?.data[0]?.maintenance_amount_sq_feet_wise_for_shopping_center).map((x, i) => (
                                        <tr>
                                            {i === 0 && (
                                                <td className="maintenanceSettings_table_td" rowspan="0">
                                                    {`${decode?.property_name} (Shopping)`}
                                                </td>
                                            )}
                                            <td className="maintenanceSettings_table_td">{x.floor_name}</td>
                                            <td className="maintenanceSettings_table_td text-right pr-4">{MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? x.floor_wise_maintenance_amount : x.sq_feet_wise_maintenance_amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>
                    )}
                    {/* <DataTable
                        // ref={dt}
                        // loading={isLoading}
                        value={[]}
                        showGridlines
                        stripedRows
                        dataKey="id"
                        // className="datatable-responsive"
                        emptyMessage="No Record Found."
                        header={header}
                        scroll="scroll"
                        tableStyle={{ minWidth: '60rem' }}
                        sortMode="multiple"
                        size="large"
                        // onSort={(e) => {
                        //     let paginationData = { ...pagination };
                        //     paginationData.order_column = e.multiSortMeta[0]['field'];
                        //     paginationData.order_direction = e.multiSortMeta[0]['order'];
                        //     setPagination(paginationData);
                        //     setMultiSortMeta(e.multiSortMeta);
                        //     callPropertyList(paginationData);
                        // }}
                        // multiSortMeta={multiSortMeta}
                    ></DataTable> */}
                    {/* {modal && (
                        <MaintenanceSettingModal
                            decode={decode}
                            editData={editData}
                            onHide={() => {
                                setModal(false);
                                setEditData(null);
                            }}
                        />
                    )} */}
                </div>
            </div>
            {/* <MaintenanceSetting decode={loginDetails} /> */}
        </div >
    )
}
export default MaintenanceSettingPage;
