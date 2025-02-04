import components from '../..';
import { handleResetState } from '../../../../redux/slice/AdminSlices/authSlice';
import CountUp from 'react-countup';
import announcements from '../../../../assets/images/announcements.png';
import vehicle from '../../../../assets/images/vehicle.png';
import property from '../../../../assets/images/total_p.svg';
import complaints from '../../../../assets/images/complaints.png';
import profit_icon from '../../../../assets/images/revenue_p.svg';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import moment from 'moment-timezone';
import { getAllUserTotalComplaint, getAllUserTotalProperty, getAllUserTotalVehicle, getCollectedMaintenance, getAllocatedProperty, getAllData } from '../../../../redux/slice/AdminSlices/dashboardSlice';
import { formatDate } from '../../../../components/Moment';
const Dashboard = () => {
    const { Image, DataTable, Column, Button, toast, useEffect, React, useState, useDispatch, useSelector, useNavigate, Link } = components;
    const navigate = useNavigate();
    const { token, stepperDetail, loginDetails } = useSelector((store) => store.auth);
    const { collectedMaintenance, allocatedProperty, allData, isLoading } = useSelector((store) => store.userDashboard);
    const dispatch = useDispatch();
    const [multiSortMeta1, setMultiSortMeta1] = useState([{ field: 'created_at', order: -1 }]);
    const [multiSortMeta2, setMultiSortMeta2] = useState([{ field: 'created_at', order: -1 }]);
    useEffect(() => {
        dispatch(getAllData());
        // dispatch(getAllUserTotalProperty());
        // dispatch(getAllUserTotalVehicle());
        // dispatch(getAllUserTotalComplaint());
        // dispatch(getCollectedMaintenance());
        // dispatch(getAllocatedProperty());
    }, []);
    // const { successMessage } = useSelector((store) => store?.auth);
    // useEffect(() => {
    //     if (successMessage) {
    //         toast.success(successMessage, {
    //             style: {
    //                 marginTop: '4rem'
    //             }
    //         });
    //         dispatch(handleResetState());
    //     }
    // }, [successMessage]);
    // console.log(allData, "allData");

    return (
        <>
            <div className="relative dashboard-main-component">
                <Loader isLoading={isLoading} />
                <div className="grid ml-0 mr-0 gap-0 mt-2">
                    <div className="col-12">
                        <h5 className="title m-2 pr-3">Dashboard</h5>
                    </div>
                    <div className="xl:col-3 sm:col-6 col-12">
                        <div
                            className="w-full p-3 flex align-items-center border-round cursor-pointer"
                            style={{ border: '1px solid #d7d6dd', borderLeft: '6px solid #588730', boxShadow: '0 0px 5px #00000059', height: '100%' }}
                            onClick={() => navigate('/property-management/property-assign')}
                        >
                            <div className="">
                                {loginDetails?.role_permissions.length === 1 && loginDetails?.role_permissions[0].role === 'User' && (
                                    <div className="">
                                        <div className="text-md text-700 mb-2 font-semibold">Properties</div>
                                        <div className="flex">
                                            <div className="pr-2">
                                                <div className="text-sm text-700 mb-2 font-medium">
                                                    Total Units - <CountUp duration={2} className="text-sm " end={allData?.userSummary?.propertyCount ? allData?.userSummary?.propertyCount : 0} />
                                                    <span className="ml-2">|</span>
                                                </div>
                                                {/* <CountUp duration={2} className="text-sm " end={allData?.userSummary?.propertyCount ? allData?.userSummary?.propertyCount : 0} /> */}
                                                {/* <CountUp duration={2} className="text-md font-semibold" end={15000000} /> */}
                                            </div>
                                            <div className="pl-2">
                                                <div className="text-sm text-700 mb-2 font-medium">My Units - <CountUp duration={2} className="text-sm " end={allData?.userSummary?.MypropertyCount ? allData?.userSummary?.MypropertyCount : 0} />
                                                </div>
                                                {/* <CountUp duration={2} className="text-sm " end={allData?.userSummary?.MypropertyCount ? allData?.userSummary?.MypropertyCount : 0} /> */}
                                                {/* <CountUp duration={2} className="text-md font-semibold" end={15000000} /> */}
                                            </div>
                                        </div>
                                        {/* <div className="text-md text-700 mb-2 font-semibold">Total Properties <CountUp duration={2} className="text-xl font-bold ml-5" end={allData?.userSummary?.propertyCount ? allData?.userSummary?.propertyCount : 0} /></div>
                                        <div className="text-md text-700 mb-2 font-semibold">My Properties <CountUp duration={2} className="text-xl font-bold ml-6" end={allData?.userSummary?.MypropertyCount ? allData?.userSummary?.MypropertyCount : 0} /></div> */}
                                    </div>
                                )}

                                {loginDetails?.role_permissions.length > 0 && (loginDetails?.role_permissions.some((role) => role.role !== 'User') || loginDetails?.role_permissions.length > 1) && (
                                    <div className="">
                                        <div className="flex items-center justify-between text-md text-700 mb-2 font-semibold">
                                            Total Properties
                                            <CountUp duration={2} className="text-xl font-bold ml-5" end={allData?.userSummary?.propertyCount ? allData?.userSummary?.propertyCount : 0} style={{ color: 'black' }} />
                                        </div>
                                        <div className="flex">
                                            <div className="pr-2">
                                                <div className="text-sm text-700 mb-2 font-medium">
                                                    Assign - <CountUp duration={2} className="text-sm font-semibold" end={allData?.userSummary?.assignPropertyCount || 0} style={{ color: 'black' }} />
                                                    <span className="ml-2">|</span>
                                                </div>
                                                {/* <CountUp duration={2} className="text-sm font-semibold" end={allData?.userSummary?.assignPropertyCount || 0} /> */}
                                            </div>
                                            <div className="pl-2">
                                                <div className="text-sm text-700 mb-2 font-medium">Unassign - <CountUp duration={2} className="text-sm font-semibold" end={allData?.userSummary?.unassignPropertyCount || 0}  style={{ color: 'black' }}/></div>
                                                {/* <CountUp duration={2} className="text-sm font-semibold" end={allData?.userSummary?.unassignPropertyCount || 0} /> */}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* <CountUp duration={2} className="text-4xl font-semibold" end={allData?.userSummary?.propertyCount ? allData?.userSummary?.propertyCount : 0} /> */}
                            </div>
                            <div className="mt-1 flex align-items-center ml-auto">
                                <Image src={property} width="50" height="50" className="ml-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-3 sm:col-6 col-12">
                        <div
                            className="w-full p-3 flex align-items-center border-round cursor-pointer"
                            style={{ border: '1px solid #d7d6dd', borderLeft: '6px solid #9302ae', boxShadow: '0 0px 5px #00000059', height: '100%' }}
                            onClick={() => navigate('/property-management/maintenancelist')}
                        >
                            {/* <div className='flex'>
                                <div className='pr-2'>
                                    <div className='text-md text-700 mb-2 font-semibold'>Paid Amount <span className="ml-2">/</span></div>
                                    <CountUp duration={2} className="text-4xl font-semibold" end={allData?.totalPaidAmount} />
                                </div>
                                <div className='pl-2'>
                                    <div className='text-md text-700 mb-2 font-semibold'>Due Amount</div>
                                    <CountUp duration={2} className="text-4xl font-semibold" end={allData?.totalDueAmount} />
                                </div>
                            </div> */}
                            <div className="">
                                <div className="text-md text-700 mb-2 font-semibold ">Maintenance
                                <CountUp duration={2} className="text-xl font-bold ml-5" end={allData?.userSummary?.totalAmount ? allData?.userSummary?.totalAmount : 0.00} style={{ color: 'black' }} />
                                </div>
                                <div className="flex">
                                    <div className="pr-2" style={{ flex: 1, textAlign: "center" }}>
                                        <div className="text-sm text-700 mb-2 font-medium">
                                            Paid -  <CountUp duration={2} className="text-sm " end={allData?.userSummary?.totalPaidAmount} prefix="₹ " /> <span className="ml-2">|</span>
                                        </div>
                                        {/* <CountUp duration={2} className="text-sm " end={allData?.userSummary?.totalPaidAmount} prefix="₹ " /> */}
                                        {/* <CountUp duration={2} className="text-md font-semibold" end={15000000} /> */}
                                    </div>
                                    <div className="pl-2" style={{ textAlign: "center" }}>
                                        <div className="text-sm text-700 mb-2 font-medium">Due - <CountUp duration={2} className="text-sm " end={allData?.userSummary?.totalDueAmount} prefix="₹ " /></div>
                                        {/* <CountUp duration={2} className="text-sm " end={allData?.userSummary?.totalDueAmount} prefix="₹ " /> */}
                                        {/* <CountUp duration={2} className="text-md font-semibold" end={15000000} /> */}
                                    </div>
                                </div>
                                {/* <CountUp duration={2} className="text-4xl font-semibold" end={allData?.announcementCount ? allData?.announcementCount : 0} /> */}
                            </div>

                            <div className="mt-1 flex align-items-center ml-auto">
                                <Image src={profit_icon} width="50" height="50" className="ml-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-3 sm:col-6 col-12">
                        <div
                            className="w-full p-3 flex align-items-center border-round cursor-pointer"
                            style={{ border: '1px solid #d7d6dd', borderLeft: '6px solid #1565c0', boxShadow: '0 0px 5px #00000059', height: '100%' }}
                            onClick={() => navigate('/property-management/complain')}
                        >
                            <div className="">
                                <div className="text-md text-700 mb-2 font-semibold">Total Complaints</div>
                                <CountUp duration={2} className="text-4xl font-semibold" end={allData?.userSummary?.complaintCount ? allData?.userSummary?.complaintCount : 0} />
                            </div>
                            <div className="mt-1 flex align-items-center ml-auto">
                                <Image src={complaints} width="50" height="50" className="ml-auto" />
                            </div>
                        </div>
                    </div>
                    {loginDetails?.role_permissions.length === 1 && loginDetails?.role_permissions[0].role === 'User' ? (
                        <div className="xl:col-3 sm:col-6 col-12">
                            <div
                                className="w-full p-3 flex align-items-center border-round cursor-pointer"
                                style={{ border: '1px solid #d7d6dd', borderLeft: '6px solid #f62a02', boxShadow: '0 0px 5px #00000059', height: '100%' }}
                                onClick={() => navigate('/property-management/vehicle')}
                            >
                                <div className="">
                                    <div className="text-md text-700 mb-2 font-semibold">Total Vehicles</div>
                                    <CountUp duration={2} className="text-4xl font-semibold" end={allData?.userSummary?.vehicleCount ? allData?.userSummary?.vehicleCount : 0} />
                                </div>
                                <div className="mt-1 flex align-items-center ml-auto">
                                    <Image src={vehicle} width="50" height="50" className="ml-auto" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="xl:col-3 sm:col-6 col-12">
                            <div
                                className="w-full p-3 flex align-items-center border-round cursor-pointer"
                                style={{ border: '1px solid #d7d6dd', borderLeft: '6px solid #f62a02', boxShadow: '0 0px 5px #00000059', height: '100%' }}
                                onClick={() => navigate('/property-management/announcements')}
                            >
                                <div className="">
                                    <div className="text-md text-700 mb-2 font-semibold">Total Announcements</div>
                                    <CountUp duration={2} className="text-4xl font-semibold" end={allData?.userSummary?.announcementCount ? allData?.userSummary?.announcementCount : 0} />
                                </div>
                                <div className="mt-1 flex align-items-center ml-auto">
                                    <Image src={announcements} width="50" height="50" className="ml-auto" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="grid ml-0 mr-0 mt-3">
                    <div className="xl:col-6 col-12">
                        <div className="card h-30rem shadow-scroll-x" style={{ boxShadow: '0 0px 5px #00000059' }}>
                            <div className="flex align-items-center">
                                <div className="font-semibold">Recently Allocated Properties</div>
                                {allData?.allocatedProperty && allData?.allocatedProperty.length > 0 && (
                                    <Button
                                        label="View List"
                                        className="p-button-outlined ml-auto p-2"
                                        onClick={() => {
                                            // Navigate to property assign page and pass state to indicate it's from view list
                                            navigate('/property-management/property-assign', {
                                                state: { fromViewList: true }
                                            });
                                        }}
                                    />
                                )}
                            </div>
                            {allData?.allocatedProperty && allData?.allocatedProperty.length > 0 ? (
                                <DataTable
                                    value={allData?.allocatedProperty ? allData?.allocatedProperty : []}
                                    showGridlines
                                    stripedRows
                                    dataKey="_id"
                                    className="datatable-responsive mt-3"
                                    emptyMessage="No Record Found."
                                    scrollable
                                    // scrollHeight="25rem"
                                    sortMode="multiple"
                                    size="large"
                                    onSort={(e) => {
                                        setMultiSortMeta2(e.multiSortMeta);
                                    }}
                                    multiSortMeta={multiSortMeta2}
                                >
                                    <Column
                                        field="property_number"
                                        className="headerCellCenter"
                                        header={'Property No.'}
                                        body={(rowData) => (
                                            <div onClick={() => navigate(`/property-management/property-assign/${rowData._id}`)} className="cursor-pointer text-center">
                                                {rowData?.property_number}
                                            </div>
                                        )}
                                    ></Column>
                                    <Column field="name" header="Name" className="capitalize" body={(rowData) => rowData?.owner_id?.name}></Column>
                                    <Column field="email" header="Email" body={(rowData) => <a href={`mailto:${rowData?.owner_id?.email}`}>{rowData?.owner_id?.email}</a>}></Column>
                                    <Column
                                        field="mobile_number"
                                        header="Contact No."
                                        className="headerCellEnd"
                                        bodyStyle={{ textAlign: 'right' }}
                                        body={(rowData) => <a href={`tel:${rowData?.owner_id?.mobile_number}`}>{rowData?.owner_id?.mobile_number}</a>}
                                    />
                                </DataTable>
                            ) : (
                                <DataTable
                                    emptyMessage={() => (
                                        <>
                                            <div className="flex-wrap flex">
                                                <img src={paper} className="h-20rem w-20rem m-auto" />
                                            </div>
                                            <div className="text-center text-2xl">{'No Record Found.'}</div>
                                        </>
                                    )}
                                    value={[]}
                                ></DataTable>
                            )}
                        </div>
                    </div>
                    <div className="xl:col-6 col-12">
                        <div className="card h-30rem shadow-scroll-x" style={{ boxShadow: '0 0px 5px #00000059' }}>
                            <div className="flex align-items-center">
                                <div className="font-semibold">Recently Collected Maintenance Payments</div>
                                {/* <div style={{ padding: "16.5px 0" }}></div> */}
                                {/* {allData?.collecteMaintenance && allData?.collecteMaintenance.length > 0 && <Button label="View List" className="p-button-outlined ml-auto p-2" onClick={() => navigate('/property-management/maintenancelist')} />} */}
                                {allData?.collecteMaintenance && allData?.collecteMaintenance.length > 0 && (
                                    <Button
                                        label="View List"
                                        className="p-button-outlined ml-auto p-2"
                                        onClick={() => {
                                            navigate('/property-management/maintenancelist', {
                                                state: { fromViewList: true }
                                            });
                                        }}
                                    />
                                )}
                                {/* <Button label="View List" className="p-button-outlined ml-auto p-2" onClick={() => navigate('/property-management/property-assign')} /> */}
                            </div>
                            {allData?.collecteMaintenance && allData?.collecteMaintenance.length > 0 ? (
                                <DataTable
                                    value={allData?.collecteMaintenance ? allData?.collecteMaintenance : []}
                                    showGridlines
                                    stripedRows
                                    dataKey="_id"
                                    className="datatable-responsive mt-3"
                                    emptyMessage="No Record Found."
                                    scrollable
                                    // scrollHeight="25rem"
                                    sortMode="multiple"
                                    size="large"
                                    onSort={(e) => {
                                        setMultiSortMeta1(e.multiSortMeta);
                                    }}
                                    multiSortMeta={multiSortMeta1}
                                >
                                    <Column field="date" header="Paid Date" body={(rowData) => formatDate(rowData?.user_maintenance_data?.updated_at)}></Column>
                                    <Column
                                        field="property_number"
                                        className="headerCellCenter"
                                        header="Property No."
                                        body={(rowData) => (
                                            <div onClick={() => navigate(`/property-management/maintenancelist/payment-view/${rowData?.user_maintenance_data?._id}`)} className="cursor-pointer text-center">
                                                {rowData?.property_number}
                                            </div>
                                        )}
                                    ></Column>
                                    <Column field="name" className="capitalize" header="Name"></Column>
                                    {/* <Column field="payment_methos" header="Payment Method" ></Column>
                                <Column field="amount" header="Amount Paid" ></Column> */}
                                    <Column field="month" header="Paid for Month" body={(rowData) => <div style={{ color: `${rowData?.user_maintenance_data?.month}` }}>{rowData?.user_maintenance_data?.month}</div>}></Column>
                                    {/* <Column field="status" header="Payment Status" body={(rowData) => <div style={{ color: `${'#689f38'}` }}>{'Paid'}</div>} ></Column> */}
                                    {/* <Column field="email" header="Email id" sortable></Column>
                                <Column field="mobile_number" header="Mobile Number" sortable></Column> */}
                                </DataTable>
                            ) : (
                                <DataTable
                                    emptyMessage={() => (
                                        <>
                                            <div className="flex-wrap flex">
                                                <img src={paper} className="h-20rem w-20rem m-auto" />
                                            </div>
                                            <div className="text-center text-2xl">{'No Record Found.'}</div>
                                        </>
                                    )}
                                    value={[]}
                                ></DataTable>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
