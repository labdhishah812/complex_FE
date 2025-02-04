import React from 'react';
import components from '../..';
import paper from '../../../../assets/images/No-data-pana.svg';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import { GatePassRemoveRequest, getGatePassData } from '../../../../redux/slice/AdminSlices/gatepassSlice';
import QRModal from './qrModel';

const Gatepass = () => {
    const { React, SelectButton, DataTable, Column, Paginator, BreadCrumb, Button, Toolbar, InputText, useNavigate, useState, useEffect, useDispatch, useSelector } = components;
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isDelete, generalListData, isLoading } = useSelector((state) => state.gatePass);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [decode, setDecode] = useState(null);
    const [modal, setModal] = useState(false);
    const [editData, steEdit] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'updated_at', order: -1 }]);
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [numValues, setNumValues] = useState({
        num1: 0,
        num2: 0
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: ''
    });
    const [qrModalVisible, setQRModalVisible] = useState(false);
    const [selectedGatepass, setSelectedGatepass] = useState(null);

    useEffect(() => {
        // decodeURI(true);
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        setModal(false);
        steEdit(null);
        callCommitteeList(paginationData);
        setSumValue(null);
        setSumValueError('');
    }, [dispatch, isCreated, isDelete]);
    const decodeURI = async (val) => {
        // let decodeData = await jwtDecode(token);
        // setDecode(decodeData);
    };
    const callCommitteeList = (val) => {
        try {
            dispatch(getGatePassData(val));
        } catch (error) {
            console.log(error);
        }
    };
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
            // decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //     decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //     navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Gate Pass'
        }
    ];
    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        let paginationData = pagination;
        paginationData.current_page = event?.page + 1;
        paginationData.per_page = event?.rows;
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        callCommitteeList(paginationData);
    };
    const template = {
        layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink CurrentPageReport',
        CurrentPageReport: (options) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            );
        }
    };
    // const getRoles = (permissionName, val) => {
    //     try {
    //         let checkPrmition = false;
    //         if (loginDetails) {
    //             let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== 'User') : loginDetails?.role_permissions;
    //             dataColl?.role_permissions.forEach((b, i) => {
    //                 let check = b.permission.find((x) => x.module_name === 'gatepass')?.module_access.findIndex((y) => y === permissionName);
    //                 if (check !== undefined && check !== -1 && checkPrmition === false) {
    //                     checkPrmition = true;
    //                 }
    //             });
    //             // if (decode?.role_permissions.find((a) => a.role === "Chairman")?.role === "Chairman") {
    //             //     let checkIndex = decode?.role_permissions.find((a) => a.role === "Chairman").permission.findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === permissionName) !== -1);
    //             //     check = checkIndex !== -1
    //             // }
    //         }
    //         // let check = decode?.role_permissions.find((a) => a.role === "chairman").findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === permissionName) !== -1);
    //         return checkPrmition;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const getRoles = (permissionName, val) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== 'User') : loginDetails?.role_permissions;
                dataColl.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'gatepass')?.module_access.findIndex((y) => y === permissionName);
                    if (check !== undefined && check !== -1 && checkPrmition === false) {
                        checkPrmition = true;
                    }
                });
                // if (decode?.role_permissions.find((a) => a.role === "Chairman")?.role === "Chairman") {
                //     let checkIndex = decode?.role_permissions.find((a) => a.role === "Chairman").permission.findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === permissionName) !== -1);
                //     check = checkIndex !== -1
                // }
            }
            return checkPrmition;
        } catch (error) {
            console.log(error);
        }
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Add Gate Pass"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2"
                    // onClick={() => setModal(true)}
                    onClick={() => navigate(`/property-management/gatepass/gatepass-create`)}
                />
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };
    const dynamicNumber = () => {
        try {
            setNumValues({
                num1: Math.floor(Math.random() * 10),
                num2: Math.floor(Math.random() * 10)
            });
        } catch (error) {
            console.log(error);
        }
    };
    const onSearch = (value) => {
        let paginationData = { ...pagination };
        paginationData.search = value;
        paginationData.per_page = 10;
        paginationData.current_page = 1;
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        setRows(10);
        setFirst(0);
        callCommitteeList(paginationData);
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = generalListData?.data?.gatepass_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Member Name, Role, Mobile No., Email" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
                    </span>

                    {/* Clear Button */}
                    <Button
                        label="Clear"
                        icon="pi pi-filter-slash"
                        className="p-button-outlined w-7rem ml-2"
                        disabled={pagination?.search === ''}
                        onClick={() => {
                            let updatedPagination = { ...pagination };
                            updatedPagination.search = ''; // Clear the search value
                            setPagination(updatedPagination); // Update pagination state
                            onSearch(''); // Clear the search filter
                        }}
                    />
                </div>
            </React.Fragment>
        );
    };

    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={getRoles('create') && rightToolbarTemplate}></Toolbar>;
    const actionBodyTemplate = (rowData) => {
        console.log('rowData: ', rowData);
        return (
            <div className="actions flex justify-content-center">
                <Button
                    tooltip="Generate QR"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-qrcode"
                    className="p-button-rounded p-button-text p-button-info"
                    onClick={() => {
                        setSelectedGatepass(rowData);
                        setQRModalVisible(true);
                    }}
                />
                <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/gatepass/gatepass-view/${rowData?._id}`)} />
                <Button
                    tooltip="Edit"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-pencil"
                    id="edits-icons"
                    className="p-button-rounded p-button-text  p-button-help"
                    // onClick={() => {
                    //     setModal(true);
                    //     steEdit(rowData);
                    // }}
                    // onClick={() => navigate(`/property-management/general-core-members/general-core-members-edit/${rowData?.role_details_array[0]._id}/${rowData?._id}`)}
                    onClick={() => navigate(`/property-management/gatepass/gatepass-edit/${rowData?._id}`)}
                />
                {/* <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-warning p-button-text" id="eyes-icons" /> */}
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text  p-button-danger"
                    id="delete-icons"
                    tooltip="Delete"
                    tooltipOptions={{ position: 'bottom' }}
                    onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(rowData._id);
                        dynamicNumber();
                    }}
                />
            </div>
        );
    };
    const deleteUserDialogFooter = () => {
        try {
            return (
                <>
                    <Button
                        label="No"
                        icon="pi pi-times"
                        className="p-button-outlined p-button-danger mr-2 mb-2"
                        onClick={() => {
                            setDeleteModal(false);
                            setDeleteId(null);
                            setSumValueError('');
                            setSumValue(null);
                        }}
                    />
                    <Button
                        label="Yes"
                        icon="pi pi-check"
                        className="p-button-outlined p-button-success mr-2 mb-2"
                        onClick={() => {
                            if (numValues?.num1 + numValues?.num2 === sumValue) {
                                setSumValueError('');
                                setDeleteModal(false);
                                dispatch(GatePassRemoveRequest(deleteId));
                                setDeleteId(null);
                            } else {
                                setSumValueError('Wrong Answer !');
                            }
                        }}
                    />
                </>
            );
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{'Gate Pass'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0 mt-3">
                <div className="col-12 card">
                    {generalListData?.data?.gatepass_listing && generalListData?.data?.gatepass_listing.length > 0 ? (
                        <DataTable
                            value={generalListData?.data?.gatepass_listing}
                            showGridlines
                            stripedRows
                            dataKey="id"
                            emptyMessage="No Record Found."
                            header={header}
                            scroll="scroll"
                            tableStyle={{ minWidth: '60rem' }}
                            sortMode="multiple"
                            size="normal"
                            onSort={(e) => {
                                let paginationData = { ...pagination };
                                paginationData.order_column = e.multiSortMeta[0]['field'];
                                paginationData.order_direction = e.multiSortMeta[0]['order'];
                                setPagination(paginationData);
                                setMultiSortMeta(e.multiSortMeta);
                                callCommitteeList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            {/* <Column field="profile" header="Image" body={(rowData) => (rowData?.vehicle_image ? <Image src={`${rowData?.vehicle_image}`} alt="Image" width="50" height="50" preview /> : '-')} style={{ width: '4rem' }}></Column> */}
                            <Column field="name" className="capitalize" header="Name" sortable></Column>
                            <Column
                                field="mobile_number"
                                className="headerCellEnd"
                                header="Mobile Number"
                                body={(rowData) => (
                                    <div className="text-right">
                                        <a href={`tel:${rowData?.mobile_number}`} className=" hover:underline">{rowData?.mobile_number}</a>
                                    </div>
                                )}
                            ></Column>
                            <Column field="email" header="Email" body={(rowData) => (rowData?.email ? <a href={`mailto:${rowData?.email}`}>{rowData?.email}</a> : '-')} sortable></Column>
                            <Column field="visitor_type" header="Visitor Type" body={(rowData) => rowData?.visitor_type || '-'} sortable></Column>
                            <Column field="valid_from" header="Start Date" body={(rowData) => (rowData?.valid_from !== 'Invalid date' ? rowData?.valid_from : '-')} sortable></Column>
                            <Column field="valid_to" header="End Date" body={(rowData) => (rowData?.valid_to !== 'Invalid date' ? rowData?.valid_to : '-')} sortable></Column>
                            <Column field="number_of_person" header="Total Person" className="headerCellEnd h-50 text-right" body={(rowData) => rowData?.number_of_person || '-'} sortable></Column>
                            <Column field="purpose" header="Visitor Purpose" body={(rowData) => rowData?.purpose || '-'} sortable></Column>
                            {getRoles('update') && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{generalListData?.data?.gatepass_listing && generalListData?.data?.gatepass_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {generalListData?.data?.gatepass_listing && generalListData?.data?.gatepass_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {generalListData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={generalListData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
                    )}
                    <DeleteModal
                        isOpenDialog={deleteModal}
                        modalFooter={() => deleteUserDialogFooter()}
                        hideModal={() => {
                            setDeleteModal(false);
                            setDeleteId(null);
                            setSumValueError('');
                            setSumValue(null);
                        }}
                        numValues={numValues}
                        sumValue={sumValue}
                        setSumValue={setSumValue}
                        sumValueError={sumValueError}
                        setSumValueError={setSumValueError}
                        modalDescription={'Are you sure you want to delete gatepass?'}
                    />
                    <QRModal
                        visible={qrModalVisible}
                        onHide={() => {
                            setQRModalVisible(false);
                            setSelectedGatepass(null);
                        }}
                        gatepassData={selectedGatepass}
                    />
                </div>
            </div>
        </div>
    );
};
export default Gatepass;
