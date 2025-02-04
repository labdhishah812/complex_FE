import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import { deleteAssignedProperty, deleteAssignedTenant, getTenantAssignedData } from '../../../../redux/slice/AdminSlices/propertySlice';

const Tenant = () => {
    const { SelectButton, Image, Button, DataTable, Column, InputText, React, useNavigate, BreadCrumb, Toolbar, Paginator, useState, useEffect, useDispatch, useSelector } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loginDetails } = useSelector((store) => store.auth);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const { propertyAssignedData, tenantAssignedData, isCreated, isLoading } = useSelector((store) => store.property);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'property_number', order: 1 }]);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [numValues, setNumValues] = useState({
        num1: 0,
        num2: 0
    });
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;


    const [pagination, setPagination] = useState({
        current_page: 1,
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: '',
        listType: 0
    });
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'Tenant'
        }
    ];
    useEffect(() => {
        decodeURI();
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        if (loginDetails.role_permissions.find((x) => x.role === 'User')?.role_id) {
            paginationData.listType = 1;
        }
        setPagination(paginationData);
        callPropertyList(paginationData);
    }, [dispatch, isCreated]);
    const callPropertyList = (val) => {
        try {
            dispatch(getTenantAssignedData(val));
        } catch (error) {
            console.log(error);
        }
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = tenantAssignedData?.data?.User_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-start w-30rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText
                            placeholder="Search by Property No., Owner's Name, or Mobile No."
                            value={pagination?.search || ''}
                            onChange={(e) => onSearch(e.target.value)}

                            style={{ width: '20rem' }}
                            disabled={isSearchDisabled}
                        />
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
        dispatch(getTenantAssignedData(paginationData));
    };
    const getRoles = (permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'rental')?.module_access.findIndex((y) => y === permissionName);
                    if (check !== undefined && check !== -1 && checkPrmition === false) {
                        checkPrmition = true;
                    }
                });
            }
            return checkPrmition;
        } catch (error) {
            console.log(error);
        }
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {loginDetails?.role_permissions.find((x) => x.role === 'User') && (
                    <SelectButton
                        // value={pagination.listType === 0 ? "all" : "myProperty"}
                        value={pagination.listType === 0 ? 'all' : 'myProperty'}
                        // value={"Active"}
                        optionLabel="name"
                        options={[
                            { name: 'My Property', value: 'myProperty' },
                            { name: 'All Property', value: 'all' }
                        ]}
                        onChange={(e) => {
                            let paginationData = { ...pagination }; // Create a shallow copy of the pagination object
                            paginationData.current_page = 1;
                            paginationData.per_page = 10;
                            paginationData.listType = e.value === 'all' ? 0 : 1;
                            // e.value === "myProperty" ? 1 :
                            //     e.value === "assigned" ? 2 :
                            //         e.value === "unassigned" ? 3 :
                            //             paginationData.listType; // Default to the current listType if no match

                            setPagination(paginationData); // Update the pagination state
                            callPropertyList(paginationData); // Trigger the property list call
                        }}
                        // className='select_button_custome mr-3'
                        className="mr-3"
                    />
                )}
                {/* {getRoles("create") && <Button
                    label="Create Tenant"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2"
                    onClick={() => {
                        navigate('/property-management/tenant/tenant-create');
                    }}
                />} */}
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };
    const rightToolbarTemplateForChairman = () => {
        return (
            <React.Fragment>
                {loginDetails?.role_permissions.find((x) => x.role === 'Chairman') && (
                    <SelectButton
                        value={pagination.listType === 0 ? 'all' : 'tenantProperty'}
                        optionLabel="name"
                        options={[
                            { name: 'All Property', value: 'all' },
                            { name: 'Tenant Property', value: 'tenantProperty' }
                        ]}
                        onChange={(e) => {
                            let paginationData = { ...pagination };
                            paginationData.current_page = 1;
                            paginationData.per_page = 10;

                            // Set listType based on selection
                            paginationData.listType = e.value === 'all' ? 0 : 2;

                            // Modify the API call to filter only rental properties when "Tenant Property" is selected
                            const modifyPropertyListParams = (params) => {
                                if (e.value === 'tenantProperty') {
                                    params.property_type = "Rental";  // Only show tenant properties
                                }
                                return params;
                            };

                            setPagination(paginationData);

                            // Call property list with modified parameters
                            callPropertyList(
                                modifyPropertyListParams(paginationData)
                            );
                        }}
                        className="mr-3"
                    />
                )}
            </React.Fragment>
        );
    };

    // const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>;
    const header = (
        <Toolbar
            className="create-delete-btn"
            start={leftToolbarTemplate}
            end={
                loginDetails?.role_permissions.find((x) => x.role === 'User')
                    ? rightToolbarTemplate()
                    : loginDetails?.role_permissions.find((x) => x.role === 'Chairman')
                    ? rightToolbarTemplateForChairman()
                    : null
            }
        ></Toolbar>
    );

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
    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        let paginationData = pagination;
        paginationData.current_page = event?.page + 1;
        paginationData.per_page = event?.rows;
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        callPropertyList(paginationData);
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
                                dispatch(deleteAssignedTenant({ _id: deleteId?._id }));
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

    // const rowExpansionTemplate = (data) => {
    //     try {
    //         return (
    //             <div className="py-3 flex align-items-center gap-2">
    //                 <div className="text-center font-semibold w-7rem" style={{ color: '#4CAF50' }}>
    //                     {' '}
    //                     Business Details
    //                 </div>
    //                 <DataTable
    //                     value={[data]}
    //                     showGridlines
    //                     stripedRows
    //                     // className="datatable-responsive"
    //                     emptyMessage="No Record Found."
    //                     scroll="scroll"
    //                     tableStyle={{ minWidth: '60rem' }}
    //                     sortMode="multiple"
    //                     size="large"
    //                     style={{ width: '100%' }}
    //                 >
    //                     {/* <Column field="company_name" header="Business Name" body={(rowData) => rowData?.company_name ? rowData?.company_name : "-"}></Column>
    //                 <Column field="category" header="Business Category" body={(rowData) => rowData?.category ? rowData?.category : "-"}></Column> */}
    //                     {/* <Column field="" header="Business"></Column> */}
    //                     <Column field="company_address" header="Address" body={(rowData) => (rowData?.company_address ? rowData?.company_address : '-')}></Column>
    //                     <Column field="city" header="City" body={(rowData) => (rowData?.city ? rowData?.city : '-')}></Column>
    //                     <Column field="pincode" header="Postal Code" className="headerCellEnd" body={(rowData) => <div className="text-right">{rowData?.pincode ? rowData?.pincode : '-'}</div>}></Column>
    //                     <Column
    //                         field="company_mobile_number"
    //                         header="Contact Number"
    //                         className="headerCellEnd"
    //                         headerStyle={{ width: '8%', minWidth: '12rem' }}
    //                         body={(rowData) => <div className="text-right"> {rowData?.company_mobile_number ? rowData?.company_mobile_number : '-'}</div>}
    //                     ></Column>
    //                     <Column
    //                         field="website"
    //                         header="Website URL"
    //                         body={(rowData) =>
    //                             rowData?.website ? (
    //                                 <a href={rowData?.website ? rowData?.website : '-'} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
    //                                     {rowData?.website ? rowData?.website : '-'}
    //                                 </a>
    //                             ) : (
    //                                 '-'
    //                             )
    //                         }
    //                     ></Column>
    //                     {/* <Column field="created_at" header="Created At" sortable body={(rowData) => moment(rowData.created_at).utcOffset("+05:30").format("DD-MMM-YYYY, LT")}></Column>
    //                 <Column field="updated_at" header="Updated At" sortable body={(rowData) => moment(rowData.updated_at).utcOffset("+05:30").format("DD-MMM-YYYY, LT")}></Column> */}
    //                 </DataTable>
    //             </div>
    //         );
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const rowExpansionTemplate = (data) => {
        try {
            // Check if business details are available
            const hasBusinessDetails = data?.company_address || data?.city || data?.pincode || data?.company_mobile_number || data?.website;

            if (!hasBusinessDetails) {
                return (
                    <div className="py-3 flex align-items-center justify-content-center">
                        <div className="text-center">
                            <p>
                            Business details have not been added yet.
                                {/* <a
                                    href={`/property-management/property-assign/user-property-business-details/${data._id}`}
                                    style={{ color: '#4CAF50' }}
                                >
                                    here
                                </a>. */}
                            </p>
                        </div>
                    </div>
                );
            }

            // If business details are available, show the DataTable
            return (
                <div className="py-3 flex align-items-center gap-2">
                    <div className="text-center font-semibold w-7rem" style={{ color: '#4CAF50' }}>
                        Business Details
                    </div>
                    <DataTable
                        value={[data]}
                        showGridlines
                        stripedRows
                        emptyMessage="No Record Found."
                        scroll="scroll"
                        tableStyle={{ minWidth: '60rem' }}
                        sortMode="multiple"
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Column field="company_address" header="Address" body={(rowData) => (rowData?.company_address ? rowData?.company_address : '-')}></Column>
                        <Column field="city" header="City" body={(rowData) => (rowData?.city ? rowData?.city : '-')}></Column>
                        <Column field="pincode" header="Postal Code" className="headerCellEnd" body={(rowData) => <div className="text-right">{rowData?.pincode ? rowData?.pincode : '-'}</div>}></Column>
                        <Column
                            field="company_mobile_number"
                            header="Contact Number"
                            className="headerCellEnd"
                            headerStyle={{ width: '8%', minWidth: '12rem' }}
                            body={(rowData) => (rowData?.company_mobile_number && rowData?.company_mobile_number !== '-' ? <div className="text-right"><a href={`tel:${rowData?.company_mobile_number}`}>{rowData?.company_mobile_number}</a></div> : <div className="text-center">{'-'}</div>)}
                        ></Column>
                        <Column
                            field="website"
                            header="Website URL"
                            body={(rowData) =>
                                rowData?.website ? (
                                    <a href={rowData?.website} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                                        {rowData?.website}
                                    </a>
                                ) : (
                                    '-'
                                )
                            }
                        ></Column>
                    </DataTable>
                </div>
            );
        } catch (error) {
            console.log(error);
        }
    };
    const allowExpansion = (rowData) => {
        return true;
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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                {/* <Button tooltip="Edit" tooltipOptions={{ position: 'bottom' }} icon="pi pi-pencil" id="edits-icons" className="p-button-rounded p-button-text  p-button-help" onClick={() => handleUserCreate(rowData)} /> */}
                {getRoles('read') && (
                    <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/property-assign/${rowData._id}`)} />
                )}
                {(getRoles('update') || pagination.listType === 1) && (
                    <Button
                        tooltip="Business"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-user-edit"
                        className="p-button-rounded p-button-text p-button-info"
                        id="eyes-icons"
                        onClick={() => navigate(`/property-management/property-assign/user-property-business-details/${rowData._id}`)}
                    />
                )}
                {getRoles('update') && (
                    <Button
                        tooltip="Transfer"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-arrow-right-arrow-left"
                        className="p-button-rounded p-button-text p-button-help"
                        id="eyes-icons"
                        onClick={() => navigate(`/property-management/tenant/transfer/${rowData._id}`)}
                        disabled={rowData.property_type === 'Rental'}
                    />
                )}
                {/* <Button tooltip="Transfer" tooltipOptions={{ position: 'bottom' }} icon="pi pi-arrow-right-arrow-left" className="p-button-rounded p-button-text p-button-help" id="eyes-icons"
                //  onClick={() => navigate(`/property-management/property-assign/transfer/${rowData._id}`)}
                /> */}

                {getRoles('delete') && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text  p-button-danger"
                        id="delete-icons"
                        tooltip="Delete"
                        disabled={rowData?.owner_id === undefined || !rowData?.owner_id}
                        tooltipOptions={{ position: 'bottom' }}
                        onClick={() => {
                            setDeleteModal(true);
                            setDeleteId(rowData);
                            dynamicNumber();
                        }}
                    />
                )}
            </div>
        );
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Tenants</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {tenantAssignedData?.data?.User_listing && tenantAssignedData?.data?.User_listing.length > 0 ? (
                        <DataTable
                            expandedRows={expandedRows}
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            rowExpansionTemplate={rowExpansionTemplate}
                            value={tenantAssignedData?.data?.User_listing}
                            showGridlines
                            stripedRows
                            // className="datatable-responsive"
                            emptyMessage="No Record Found."
                            header={header}
                            scroll="scroll"
                            tableStyle={{ minWidth: '60rem' }}
                            sortMode="multiple"
                            size="normal"
                            // onSort={(e) => {
                            //     let paginationData = { ...pagination };
                            //     paginationData.order_column = e.multiSortMeta[0]['field'];
                            //     paginationData.order_direction = e.multiSortMeta[0]['order'];
                            //     setPagination(paginationData);
                            //     setMultiSortMeta(e.multiSortMeta);
                            //     callPropertyList(paginationData);
                            // }}
                            multiSortMeta={multiSortMeta}
                        >
                            {/* ${process.env.REACT_APP_COMON_UPLOAD_BASE}user-profile/ */}
                            <Column expander={allowExpansion} style={{ width: '5rem' }} />
                            <Column field="property_image" header="Image" body={(rowData) => <Image src={`${rowData?.user_profile}`} alt="Image" width="50" height="50" preview />}></Column>
                            <Column field="property_number" className="headerCellCenter" header="Property No." body={(rowData) => <div className="text-center">{rowData?.property_number}</div>} sortable></Column>
                            {/* <Column field="name" className="capitalize" header="Name" sortable></Column> */}
                            <Column
                                field="name"
                                className="capitalize"
                                header="Name"
                                sortable
                                body={(rowData) => (
                                    <a
                                        href={`${BASE_URL_API}property-management/tenant/${rowData._id}`}
                                        className=" hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent default navigation
                                            navigate(`/property-management/tenant/${rowData._id}`)
                                            // window.location.href = `http://localhost:3000/property-management/property-assign/${rowData._id}`; // Redirect to the property page
                                        }}
                                    >
                                        {rowData.name}
                                    </a>
                                )}
                            ></Column>
                            <Column field="property_type" className="headerCellCenter" header="Property Category" sortable body={(rowData) => <div className="text-center">{rowData?.property_type ? rowData?.property_type : '-'}</div>}></Column>
                            <Column field="property_sq_feet_area" className="headerCellEnd" header="Sq. Ft. Area" body={(rowData) => <div className="text-right">{rowData?.property_sq_feet_area}</div>} sortable></Column>
                            <Column field="company_name" className="capitalize" header="Business Name" body={(rowData) => (rowData?.company_name ? rowData?.company_name : '-')}></Column>
                            <Column field="category" header="Business Category" body={(rowData) => (rowData?.category ? rowData?.category : '-')}></Column>
                            <Column field="email" header="Email" body={(rowData) => <a href={`mailto:${rowData?.email}`} style={{ color: 'blue' }}>{rowData?.email}</a>} sortable></Column>
                            <Column field="mobile_number" className="headerCellEnd" header="Mobile No." body={(rowData) => <div className="text-right"><a href={`tel:${rowData?.mobile_number}`} className=" hover:underline">{rowData?.mobile_number}</a></div>}></Column>
                            <Column
                                field="alternate_number"
                                className="headerCellEnd"
                                header="Alternate No."
                                body={(rowData) => (rowData?.alternate_number && rowData?.alternate_number !== '-' ? <div className="text-right"><a href={`tel:${rowData?.alternate_number}`}>{rowData?.alternate_number}</a></div> : <div className="text-center">{'-'}</div>)}
                            ></Column>
                            {/* <Column field="created_at" header="Created At" sortable body={(rowData) => moment(rowData.created_at).utcOffset("+05:30").format("DD-MMM-YYYY, LT")}></Column>
                        <Column field="updated_at" header="Updated At" sortable body={(rowData) => moment(rowData.updated_at).utcOffset("+05:30").format("DD-MMM-YYYY, LT")}></Column> */}
                            {/* {decode?.role_permissions.length === 1 && decode?.role_permissions.find((x) => x.role === "User") ? null :
                        } */}
                            {pagination?.listType === 1 && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{tenantAssignedData?.data?.User_listing && tenantAssignedData?.data?.User_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {tenantAssignedData?.data?.User_listing && tenantAssignedData?.data?.User_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {tenantAssignedData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={tenantAssignedData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
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
                        modalDescription={'Are you sure you want to delete property?'}
                    />
                </div>
            </div>
        </div>
    );
};

export default Tenant;
