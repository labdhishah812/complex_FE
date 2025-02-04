import components from '../..';
import jwtDecode from 'jwt-decode';
import Loader from '../../../../components/Loader';
import MaintenanceSettingModal from './MaintenanceSettingModal';
import { getMaintenanceSettingRequest } from '../../../../redux/slice/AdminSlices/maintenanceSlice';
const MaintenanceSettings = () => {
    const { Button, React, useNavigate, BreadCrumb, useState, useEffect, useDispatch, useSelector } = components;
    const { isSettingCreated, MaintenanceSettingData, isLoading } = useSelector((store) => store.maintenance);
    const { token } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [decode, setDecode] = useState(null);
    const [modal, setModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
                decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
                navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Maintenance-Setting'
            // command: () => {
            //     navigate('/admin/maintenance-setting');
            // }
        }
    ];
    const decodeData = async () => {
        try {
            let decodeData = await jwtDecode(token);
            setDecode(decodeData);
        } catch (error) {
            console.log(error);
        }
    };
    const getRoles = (permissionName) => {
        try {
            let check = decode?.permissions.findIndex((x) => x.module_name === 'maintenance-settings' && x.module_access.findIndex((a) => a === permissionName) !== -1);
            return check !== -1;
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        decodeData();
        dispatch(getMaintenanceSettingRequest());
        setModal(false);
        setEditData(null);
    }, [dispatch, isSettingCreated]);
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row">
                    <h5 className="title border-right-2 m-2 pr-3 border-yellow-500 flex align-items-center justify-content-center">Maintenance</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    <div className="flex align-items-center mt-2">
                        {/* <h4 className="mt-2">Property Structure View</h4> */}
                        {/* <Button label="Block Create " icon="pi pi-plus" className="p-button-outlined p-button-success ml-auto" onClick={() => handleStructureCreate()} /> */}
                        {getRoles('create') && MaintenanceSettingData?.data.length === 0 && (
                            <Button
                                label={`Create Maintenance`}
                                icon="pi pi-plus"
                                className="p-button-outlined p-button-success ml-auto"
                                onClick={() => {
                                    setModal(true);
                                    // MaintenanceSettingData?.data && setEditData(MaintenanceSettingData?.data);
                                }}
                            />
                        )}
                        {getRoles('update') && MaintenanceSettingData?.data.length > 0 && (
                            <Button
                                label={`Edit Maintenance`}
                                icon="pi pi-plus"
                                className="p-button-outlined p-button-success ml-auto"
                                onClick={() => {
                                    setModal(true);
                                    MaintenanceSettingData?.data && setEditData(MaintenanceSettingData?.data);
                                }}
                            />
                        )}
                    </div>
                    {MaintenanceSettingData?.data.length > 0 && (
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-4 mb-1">
                                <label className="">Maintenance Type</label>
                                <div className="border-1 p-2 border-round-md border-400">
                                    {MaintenanceSettingData?.data[0].maintenance_type === 'floor_wise' ? 'Floor Wise' : MaintenanceSettingData?.data[0].maintenance_type === 'sq_feet_wise' ? 'Square Feet Wise' : 'Fixed'}
                                </div>
                            </div>
                            {MaintenanceSettingData?.data[0]?.maintenance_type !== 'floor_wise' && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <label className="">Maintenance Amount</label>
                                    <div className="border-1 p-2 border-round-md border-400">{MaintenanceSettingData?.data[0].maintenance_amount}</div>
                                </div>
                            )}
                        </div>
                    )}
                    {MaintenanceSettingData?.data[0]?.maintenance_type === 'floor_wise' && MaintenanceSettingData?.data.length > 0 && (
                        <table className="maintenanceSettings_table">
                            <thead>
                                <tr>
                                    <th className="maintenanceSettings_table_th">Property Type</th>
                                    <th className="maintenanceSettings_table_th">Floor</th>
                                    <th className="maintenanceSettings_table_th">Maintenance Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise.map((x, i) => (
                                    <tr>
                                        {i === 0 && (
                                            <td className="maintenanceSettings_table_td" rowspan="0">
                                                {`${decode?.property_name} (${decode?.property_type})`}
                                            </td>
                                        )}
                                        <td className="maintenanceSettings_table_td">{x.floor_name}</td>
                                        <td className="maintenanceSettings_table_td">{x.floor_wise_maintenance_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise_for_shopping_center && (
                                <tbody>
                                    {MaintenanceSettingData?.data[0]?.maintenance_amount_floor_wise_for_shopping_center.map((x, i) => (
                                        <tr>
                                            {i === 0 && (
                                                <td className="maintenanceSettings_table_td" rowspan="0">
                                                    {`${decode?.property_name} (Shopping)`}
                                                </td>
                                            )}
                                            <td className="maintenanceSettings_table_td">{x.floor_name}</td>
                                            <td className="maintenanceSettings_table_td">{x.floor_wise_maintenance_amount}</td>
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
                    {modal && (
                        <MaintenanceSettingModal
                            decode={decode}
                            editData={editData}
                            onHide={() => {
                                setModal(false);
                                setEditData(null);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
export default MaintenanceSettings;
