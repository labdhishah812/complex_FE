import DeleteModal from '../../../../components/DeleteModal';
import { createShopRequest, deleteShopRequest, editShopRequest, getAllBlockNameRequest, getAllFloorNameRequest, getAllShopRequest, handleResetShop, multipaldeleteShopRequest } from '../../../../redux/slice/AdminSlices/shopSlice';
import components from '../..';
const FloorList = () => {
    const { Button, Column, Tag, DataTable, Dropdown, toast, useEffect, useState, React, Dialog, useNavigate, useDispatch, useSelector, FilterMatchMode, InputText, BreadCrumb, Paginator, Toolbar, classNames } = components;
    const { isLoading, shopData, successMessage, errors, blockList, floorList } = useSelector((state) => state.shop);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [globalFilter, setGlobalFilter] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [filters, setFilters] = useState(null);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [selectedShop, setSelectedShop] = useState('');
    const [shopDeleteId, setShopDeleteId] = useState('');
    const [shopFilterValue, setShopFilterValue] = useState('');
    const [floorFilterValue, setFloorFilterValue] = useState('');
    const [blockFilterValue, setBlockFilterValue] = useState('');
    const [shopareaFilterValue, setShopareaFilterValue] = useState('');
    const [modal, setModal] = useState({
        // isImportExcelModalOpen: false,
        isEditModalOpen: false,
        isViewModalOpen: false,
        isDeleteModalOpen: false,
        isMultiDeleteModalOpen: false,
        isModalOpen: false
    });
    const shopTypeTag = [
        { label: 'Small', value: '0' },
        { label: 'Medium', value: '1' },
        { label: 'Big', value: '2' },
    ];
    const shopStatusTag = [
        { label: 'Occcupied', value: '0' },
        { label: 'Free', value: '1' },
    ];
    const [value, setValue] = useState({
        id: '',
        society_name: '',
        floor: '',
        block: '',
        shop_no: '',
        shop_area: '',
        shop_status: '1',
    });
    const handleReset = () => {
        setValue({
            id: '',
            society_name: '',
            floor: '',
            block: '',
            shop_no: '',
            shop_area: '',
            shop_status: '0',
        });
    }
    const tableData = {
        page: 1,
        limit: 10,
        filter_value: '',
        // sort_order: 'desc',
        // order_column: ''
    };
    const [queryString, setQueryString] = useState(`page=${tableData.page}&limit=${tableData.limit}&filter_value=${tableData.filter_value}`);
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

        dispatch(getAllShopRequest(`page=${event.page + 1}&limit=${event.rows}`));
    };
    const handleQueryChange = (data) => {
        let queryStr = Object.keys(data)
            .map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            })
            .join('&');
        setQueryString(queryStr);
    };
    useEffect(() => {
        handleQueryChange(tableData);
    }, [tableData]);
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate('/admin/dashboard');
        }
    }
    const breadcrumbItems = [
        {
            label: 'Floors',

        },
        {
            label: 'Floor List',
            command: () => {
                navigate('/admin/floorlist');
            }
        }
    ];
    const handleShopCreate = () => {
        setModal({
            ...modal,
            isModalOpen: true
        });
        dispatch(getAllBlockNameRequest());
        dispatch(getAllFloorNameRequest());
        dispatch(handleResetShop())
    };
    const handleSave = () => {
        const data = {
            society_name: value?.society_name,
            block: value?.block,
            floor: value?.floor,
            shop_status: value?.shop_status,
            shop_area: value?.shop_area,
            shop_no: value?.shop_no,
        };
        setSubmitted(true);
        dispatch(createShopRequest(data));
    };
    const handleUpdate = () => {
        setSubmitted(true);
        const formData = {
            society_name: value?.society_name,
            block: value?.block,
            floor: value?.floor,
            shop_status: value?.shop_status,
            shop_area: value?.shop_area,
            shop_no: value?.shop_no,
        };
        dispatch(editShopRequest(value?.id, formData));
    };
    const handleDeleteShop = () => {
        dispatch(deleteShopRequest(shopDeleteId));
        setModal({
            ...modal,
            isDeleteModalOpen: false
        });
    };
    const confirmDeleteShop = (shopId) => {
        setShopDeleteId(shopId?.id);
        setModal({
            ...modal,
            isDeleteModalOpen: true
        });
    };
    const confirmDeleteSelected = () => {
        setModal({
            ...modal,
            isMultiDeleteModalOpen: true
        });
    };
    const handleMultiDeleteShop = () => {
        let shopsData = shopData?.data?.filter((val) => selectedShop?.includes(val));
        let shopId = [];
        shopsData?.map((e) => {
            let id = e.id;
            shopId.push(id);
        });
        const formData = {
            id: shopId
        };
        dispatch(multipaldeleteShopRequest(formData));
        setModal({
            ...modal,
            isMultiDeleteModalOpen: false
        });
        setSelectedShop(null)
    };
    const hideDialog = () => {
        setModal({
            ...modal,
            isModalOpen: false,
            isDeleteModalOpen: false,
            isMultiDeleteModalOpen: false,
            isEditModalOpen: false,
            isViewModalOpen: false,
        });
        setSubmitted(false);
        handleReset();
    };
    const editShop = (rowData, isEdit) => {
        dispatch(getAllBlockNameRequest());
        dispatch(getAllFloorNameRequest());
        // let shop;
        // switch (rowData?.shop_area != '') {
        //     case rowData?.shop_area == '0':
        //         shop = 'Small';
        //         break;
        //     case rowData?.shop_area == '1':
        //         shop = 'Medium';
        //         break;
        //     case rowData?.shop_area == '2':
        //         shop = 'Big';
        // }
        setValue({
            ...value,
            id: rowData?.id,
            society_name: rowData?.society_name,
            block: rowData?.block?.id,
            blockName: rowData?.block?.block,
            floorName: rowData?.floor?.floor,
            floor: rowData?.floor?.id,
            shop_no: rowData?.shop_no,
            shop_status: rowData?.shop_status,
            shop_area: rowData?.shop_area,
        });
        if (isEdit) {
            setModal({
                ...modal,
                isEditModalOpen: true
            });
        }
        else {
            setModal({
                ...modal,
                isViewModalOpen: true
            });
        }
    };
    const userCreateDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={hideDialog} />
            <Button label="Save" type="submit" icon="pi pi-check"
                loading={isLoading}
                className="p-button-outlined p-button-success mr-2 mb-2"
                onClick={() => handleSave()}
                autoFocus />
        </>
    );
    const updateUserDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={() => hideDialog()} />
            <Button label="Update" icon="pi pi-check"
                disabled={isLoading}
                className="p-button-outlined p-button-success mr-2 mb-2"
                onClick={() => handleUpdate()}
                autoFocus />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2"
                onClick={handleDeleteShop}
                autoFocus />
        </>
    );
    const multideleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2"
                onClick={handleMultiDeleteShop}
                autoFocus />
        </>
    );
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                <Button tooltip="Edit" tooltipOptions={{ position: 'bottom' }} icon="pi pi-pencil" id="edits-icons" className="p-button-rounded p-button-text  p-button-help"
                    onClick={() => editShop(rowData, true)}

                />
                <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-warning p-button-text" id="eyes-icons"
                    onClick={() => editShop(rowData, false)}

                />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text  p-button-danger" id="delete-icons" tooltip="Delete" tooltipOptions={{ position: 'bottom' }}
                    onClick={() => confirmDeleteShop(rowData)}

                />
            </div>
        );
    };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-0">
                    <Button label="Delete" icon="pi pi-trash" className="p-button-outlined p-button-danger "
                        onClick={confirmDeleteSelected}
                        disabled={selectedShop?.length > 1 ? false : true}

                    />

                    <Button label="Clear Filter" className="p-button-outlined ml-2 "
                        onClick={() => handleClearFliter()} disabled={!shopFilterValue && !floorFilterValue && !blockFilterValue && !shopareaFilterValue}
                        icon="pi pi-filter-slash">

                    </Button>
                </div>
            </React.Fragment>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Floor Create " icon="pi pi-plus" className="p-button-outlined p-button-success mr-2 "
                    onClick={() => handleShopCreate()}
                />
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>;

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <div className="actions flex justify-content-center capitalize">{rowData?.shop_status == '1' ? <Tag severity="warning" value="Free"></Tag> : <Tag severity="primary" value="Occcupied"></Tag>}</div>
            </>
        );
    };
    const blockBodyTemplate = (rowData) => {
        return (
            <>
                <div className="flex capitalize">{rowData?.block?.block}</div>
            </>
        );
    };
    const floorBodyTemplate = (rowData) => {
        return (
            <>
                <div className="flex capitalize">{rowData?.floor?.floor}</div>
            </>
        );
    };
    // const typeBodyTemplate = (rowData) => {
    //     let shop;
    //     switch (rowData?.shop_area != '') {
    //         case rowData?.shop_area == '0':
    //             shop = 'Small';
    //             break;
    //         case rowData?.shop_area == '1':
    //             shop = 'Medium';
    //             break;
    //         case rowData?.shop_area == '2':
    //             shop = 'Big';
    //     }
    //     return <>{rowData?.shop_area !== '' ? <span className="ml-2 capitalize">{shop}</span> : 'N / A'}</>;
    // };
    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3 expandtable">
                <DataTable value={[data]} className="datatable-responsive row_expand_show_title" scroll="scroll">
                    {/* <Column
                        field="society_name"
                        header="Society Name"
                        headerStyle={{ width: '25%' }}
                    ></Column> */}
                </DataTable>
            </div>
        );
    };
    const shopfilterApplyCallback = (options) => {
        dispatch(getAllShopRequest(`page=${tableData.page}&filter_value=${shopFilterValue}&limit=${rows}`));
        options.filterApplyCallback();
    };
    const floorfilterApplyCallback = (options) => {
        dispatch(getAllShopRequest(`page=${tableData.page}&filter_value=${floorFilterValue}&limit=${rows}`));
        options.filterApplyCallback();
    };
    const blockfilterApplyCallback = (options) => {
        dispatch(getAllShopRequest(`page=${tableData.page}&filter_value=${blockFilterValue}&limit=${rows}`));
        options.filterApplyCallback();
    };
    const shopareafilterApplyCallback = (options) => {
        dispatch(getAllShopRequest(`page=${tableData.page}&filter_value=${shopareaFilterValue}&limit=${rows}`));
        options.filterApplyCallback();
    };
    const filterClearTemplate = (options) => {
        return <Button type="button" className="p-button-outlined p-button-danger" icon="pi pi-times" onClick={() => handleClearFliter(options)} label="Clear" />;
    };
    const shopApplyTemplate = (options) => {
        return <Button type="button" className="p-button-outlined" icon="pi pi-check" onClick={() => shopfilterApplyCallback(options)} severity="success" label="Apply" />;
    };
    const floorApplyTemplate = (options) => {
        return <Button type="button" className="p-button-outlined" icon="pi pi-check" onClick={() => floorfilterApplyCallback(options)} severity="success" label="Apply" />;
    };
    const blockApplyTemplate = (options) => {
        return <Button type="button" className="p-button-outlined" icon="pi pi-check" onClick={() => blockfilterApplyCallback(options)} severity="success" label="Apply" />;
    };
    const shopareaApplyTemplate = (options) => {
        return <Button type="button" className="p-button-outlined" icon="pi pi-check" onClick={() => shopareafilterApplyCallback(options)} severity="success" label="Apply" />;
    };
    const shophandleFilter = (e) => {
        setShopFilterValue(e.target.value);
    };
    const floorhandleFilter = (e) => {
        setFloorFilterValue(e.target.value);
    };
    const blockhandleFilter = (e) => {
        setBlockFilterValue(e.target.value);
    };
    const shopareahandleFilter = (e) => {
        setShopareaFilterValue(e.target.value);
    };
    const shopFilterTemplate = () => {
        return <InputText type="search" className="w-15rem" value={shopFilterValue} onChange={(e) => shophandleFilter(e)} placeholder="Search Shop No" />;
    };
    const floorFilterTemplate = () => {
        return <Dropdown value={floorFilterValue} options={floorList} onChange={(e) => floorhandleFilter(e)} optionLabel="label"
            optionValue="value" filter placeholder="Search Floor" className="p-column-filter" />;
    };
    const blockFilterTemplate = () => {
        return <Dropdown value={blockFilterValue} options={blockList} onChange={(e) => blockhandleFilter(e)} optionLabel="label"
            optionValue="value" filter placeholder="Search Block" className="p-column-filter" />;
    };
    const shopareaFilterTemplate = () => {
        return <InputText type="search" className="w-15rem" value={shopareaFilterValue} onChange={(e) => shopareahandleFilter(e)} placeholder="Search Shop Area" />;
    };
    const initFilters = () => {
        setFilters({
            shop_no: { value: null, matchMode: FilterMatchMode.CONTAINS },
            floor: { value: null, matchMode: FilterMatchMode.CONTAINS },
            block: { value: null, matchMode: FilterMatchMode.CONTAINS },
            shop_area: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilter('');
    };
    const handleClearFliter = (options) => {
        setFloorFilterValue('');
        setShopFilterValue('');
        setBlockFilterValue('');
        setShopareaFilterValue('')
        if (shopFilterValue !== '' || floorFilterValue !== '' || blockFilterValue !== '' || shopareaFilterValue !== '') {
            dispatch(getAllShopRequest(`page=${tableData.page}&filter_value=${''}&limit=${rows}`));
        }
        options?.filterClearCallback();

    };
    useEffect(() => {
        initFilters();
    }, []);
    useEffect(() => {
        dispatch(getAllShopRequest(queryString));
        dispatch(getAllFloorNameRequest());
        dispatch(getAllBlockNameRequest())
    }, [dispatch]);
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage, {
                style: {
                    marginTop: '4rem'
                }
            });
            setModal({
                ...modal,
                isModalOpen: false,
                isEditModalOpen: false,
                isDeleteModalOpen: false,
                isMultiDeleteModalOpen: false
            });
            handleReset();
            dispatch(handleResetShop());
            dispatch(getAllShopRequest(queryString));
        }
    }, [successMessage]);
    useEffect(() => {
        const body = document.body;
        const shouldScroll = modal.isEditModalOpen || modal.isViewModalOpen || modal.isDeleteModalOpen || modal.isMultiDeleteModalOpen || modal.isModalOpen;

        body.classList.toggle('body-no-scroll', shouldScroll);

        return () => {
            body.classList.remove('body-no-scroll');
        };
    }, [modal.isEditModalOpen, modal.isViewModalOpen, modal.isDeleteModalOpen, modal.isMultiDeleteModalOpen, modal.isModalOpen]);
    return (
        <>
            <div className="flex justify-content-between align-items-center">
                <div className='flex flex-row'>
                    <h5 className='title border-right-2 m-2 pr-3 border-yellow-500 flex align-items-center justify-content-center'>Floor List</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">

                    <DataTable
                        // ref={dt}
                        // loading={isLoading}
                        value={shopData?.data}
                        showGridlines
                        stripedRows
                        filters={filters}
                        selection={selectedShop}
                        onSelectionChange={(e) => setSelectedShop(e.value)}
                        dataKey="id"
                        className="datatable-responsive"
                        globalFilter={globalFilter}
                        emptyMessage="No Record Found."
                        header={header}
                        scroll="scroll"
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        tableStyle={{ minWidth: '60rem' }}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '1%' }} className='datatable-checkbox'></Column>
                        {/* <Column expander style={{ width: '2%' }} /> */}
                        {/* <Column
                                field="shop_no"
                                filter
                                showFilterOperator={false}
                                showAddButton={false}
                                showFilterMatchModes={false}
                                filterElement={shopFilterTemplate}
                                filterClear={filterClearTemplate}
                                filterApply={shopApplyTemplate}
                                filterField="shop_no"
                                header="Shop No"
                                sortable
                                headerStyle={{ width: '18%' }}
                            ></Column>
                            <Column
                                field="floor"
                                body={floorBodyTemplate}
                                // filter
                                filterMenuStyle={{ width: '10%' }} style={{ minWidth: '10rem' }}
                                showFilterOperator={false}
                                showAddButton={false}
                                showFilterMatchModes={false}
                                filterElement={floorFilterTemplate}
                                filterClear={filterClearTemplate}
                                filterApply={floorApplyTemplate}
                                filterField="floor"
                                header="Floor"
                                sortable
                                headerStyle={{ width: '10%' }}
                            ></Column>
                            <Column
                                field="block"
                                body={blockBodyTemplate}
                                // filter
                                filterMenuStyle={{ width: '10%' }} style={{ minWidth: '10rem' }}
                                showFilterOperator={false}
                                showAddButton={false}
                                showFilterMatchModes={false}
                                filterElement={blockFilterTemplate}
                                filterClear={filterClearTemplate}
                                filterApply={blockApplyTemplate}
                                filterField="block"
                                header="Block"
                                sortable
                                headerStyle={{ width: '10%' }}
                            ></Column>
                            <Column
                                field="society_name"
                                header="Society Name"
                                headerStyle={{ width: '25%' }}
                            ></Column>

                            <Column
                                field="shop_area"
                                filter
                                showFilterOperator={false}
                                showAddButton={false}
                                showFilterMatchModes={false}
                                filterElement={shopareaFilterTemplate}
                                filterClear={filterClearTemplate}
                                filterApply={shopareaApplyTemplate}
                                filterField="shop_area"
                                header="Shop Area"
                                sortable
                                headerStyle={{ width: '14%' }}
                            ></Column>
                            <Column
                                field="status_type"
                                body={statusBodyTemplate}
                                header="Status"
                                sortable
                                headerStyle={{ width: '6%' }}
                            ></Column> */}

                        <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>
                    </DataTable>
                    <Paginator
                        template={template} first={first} rows={rows}
                        totalRecords={shopData?.total_count}
                        onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
                    <Dialog visible={modal?.isModalOpen} style={{ width: '60vw' }} header="Floor Create" modal className="p-fluid" footer={userCreateDialogFooter} onHide={hideDialog}>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="society_name" className="required">
                                    Society Name
                                </label>

                                <InputText
                                    id="society_name"
                                    name="society_name"
                                    placeholder="Enter Society Name"
                                    required
                                    type="text"
                                    value={value?.society_name}
                                    onChange={(e) => setValue({ ...value, society_name: e.target.value })}
                                    className={classNames({ 'p-invalid': submitted && !value?.society_name })}
                                />

                                {errors ? <small className="p-invalid error">{errors?.society_name}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="mobileno" className="required">
                                    Block
                                </label>
                                <Dropdown
                                    id="block"
                                    placeholder="Select Block"
                                    name="block"
                                    optionLabel="label"
                                    optionValue="value"
                                    required
                                    options={blockList}
                                    value={value?.block}
                                    onChange={(e) => {
                                        setValue({ ...value, block: e.value });
                                    }}
                                    className={classNames({ 'p-invalid': submitted && errors?.block })}
                                />

                                {submitted && errors?.block ? <small className="p-invalid error">{errors?.block}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="floor" className="required">
                                    Floor
                                </label>
                                <Dropdown
                                    id="floor"
                                    placeholder="Select Floor"
                                    name="floor"
                                    optionLabel="label"
                                    optionValue="value"
                                    required
                                    options={floorList}
                                    value={value?.floor}
                                    onChange={(e) => {
                                        setValue({ ...value, floor: e.value });
                                    }}
                                    className={classNames({ 'p-invalid': submitted && errors?.floor })}
                                />

                                {submitted && errors?.floor ? <small className="p-invalid error">{errors?.floor}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="shopno" className="required">
                                    Shop No
                                </label>

                                <InputText
                                    id="shop_no"
                                    name="shop_no"
                                    placeholder="Enter Shop No"
                                    required
                                    type="text"
                                    value={value?.shop_no}
                                    onChange={(e) => setValue({ ...value, shop_no: e.target.value })}
                                    className={classNames({ 'p-invalid': submitted && !value?.shop_no })}
                                />

                                {errors ? <small className="p-invalid error">{errors?.shop_no}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="shop_area" className="required">
                                    Shop Area
                                </label>

                                <InputText
                                    id="shop_area"
                                    name="shop_area"
                                    placeholder="Enter Shope Area"
                                    required
                                    type="text"
                                    value={value?.shop_area}
                                    onChange={(e) => setValue({ ...value, shop_area: e.target.value })}
                                    className={classNames({ 'p-invalid': submitted && !value?.shop_area })}
                                />

                                {errors ? <small className="p-invalid error">{errors?.shop_area}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="shoptype" className="required">
                                    Shop Status
                                </label>

                                <Dropdown
                                    id="dropdown"
                                    optionLabel="label"
                                    optionValue="value"
                                    required
                                    options={shopStatusTag}
                                    name="shop_status"
                                    placeholder="Select Shop Status"
                                    type="text"
                                    value={value?.shop_status}
                                    onChange={(e) => setValue({ ...value, shop_status: e.target.value })}
                                    className={classNames({ 'p-invalid': submitted && !value?.shop_status })}
                                />

                                {errors ? <small className="p-invalid error">{errors?.shop_status}</small> : null}
                            </div>
                        </div>
                    </Dialog>
                    <Dialog visible={modal.isEditModalOpen} style={{ width: '60vw' }} header="Floor Update" modal className="p-fluid usercreation" footer={updateUserDialogFooter} onHide={hideDialog}>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="society_name" className="required">
                                    Society Name
                                </label>

                                <InputText
                                    id="society_name"
                                    name="society_name"
                                    placeholder="Enter Society Name"
                                    required
                                    type="text"
                                    value={value?.society_name}
                                    onChange={(e) => setValue({ ...value, society_name: e.target.value })}
                                    className={classNames({ 'p-invalid': submitted && !value?.society_name })}
                                />

                                {/* {errors ? <small className="p-invalid error">{errors?.society_name}</small> : null} */}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="mobileno" className="required">
                                    Block
                                </label>
                                <Dropdown
                                    id="block"
                                    disabled
                                    placeholder="Select Block"
                                    name="block"
                                    optionLabel="label"
                                    optionValue="value"
                                    required
                                    options={blockList}
                                    value={value?.block}
                                    onChange={(e) => {
                                        setValue({ ...value, block: e.value });
                                    }}
                                    className={classNames({ 'p-invalid': submitted && errors?.block })}
                                />

                                {submitted && errors?.block ? <small className="p-invalid error">{errors?.block}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="floor" className="required">
                                    Floor
                                </label>
                                <Dropdown
                                    id="floor"
                                    placeholder="Select Floor"
                                    name="floor"
                                    disabled
                                    optionLabel="label"
                                    optionValue="value"
                                    required
                                    options={floorList}
                                    value={value?.floor}
                                    onChange={(e) => {
                                        setValue({ ...value, floor: e.value });
                                    }}
                                    className={classNames({ 'p-invalid': submitted && errors?.floor })}
                                />

                                {submitted && errors?.floor ? <small className="p-invalid error">{errors?.floor}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="shopno" className="required">
                                    Shop No
                                </label>

                                <InputText
                                    id="shop_no"
                                    disabled
                                    name="shop_no"
                                    placeholder="Enter Shop No"
                                    required
                                    type="text"
                                    value={value?.shop_no}
                                    onChange={(e) => setValue({ ...value, shop_no: e.target.value })}
                                    className={classNames({ 'p-invalid': submitted && !value?.shop_no })}
                                />

                                {/* {errors ? <small className="p-invalid error">{errors.shop_no}</small> : null} */}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="shop_area" className="required">
                                    Shop Area
                                </label>

                                <InputText
                                    id="shop_area"
                                    name="shop_area"
                                    placeholder="Enter Shope Area"
                                    required
                                    type="text"
                                    value={value?.shop_area}
                                    onChange={(e) => setValue({ ...value, shop_area: e.target.value })}
                                    className={classNames({ 'p-invalid': submitted && !value?.shop_area })}
                                />

                                {errors ? <small className="p-invalid error">{errors?.shop_area}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="shoptype" className="required">
                                    Shop Status
                                </label>

                                <Dropdown
                                    id="dropdown"
                                    optionLabel="label"
                                    optionValue="value"
                                    required
                                    options={shopStatusTag}
                                    name="shop_status"
                                    placeholder="Select Shop Status"
                                    type="text"
                                    value={value?.shop_status}
                                    onChange={(e) => setValue({ ...value, shop_status: e.target.value })}
                                    className={classNames({ 'p-invalid': submitted && !value?.shop_status })}
                                />

                                {/* {errors ? <small className="p-invalid error">{errors.shop_status}</small> : null} */}
                            </div>
                        </div>
                    </Dialog>
                    <Dialog visible={modal.isViewModalOpen} style={{ width: '60vw' }} header="Floor Details" modal className="p-fluid usercreation viewmodel" onHide={hideDialog}>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="firstname">Society Name</label>
                                <InputText type="text" readOnly required value={value?.society_name} />
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="firstname">Floor</label>
                                <InputText type="text" readOnly required value={value?.floorName} />
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="firstname">Block</label>
                                <InputText type="text" readOnly required value={value?.blockName} />
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="firstname">Shop No</label>
                                <InputText type="text" readOnly required value={value?.shop_no} />
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="firstname">Shop Area</label>
                                <InputText type="text" readOnly required value={value?.shop_area} />
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="firstname">Shop Status</label>
                                <InputText type="text" readOnly required value={value?.shop_status == '0' ? 'Occcupied' : 'Free'} />
                            </div>
                        </div>
                    </Dialog>
                    <DeleteModal isOpenDialog={modal.isDeleteModalOpen} modalFooter={deleteUserDialogFooter} hideModal={hideDialog} modalDescription={'Are you sure you want to delete?'} />
                    <DeleteModal isOpenDialog={modal.isMultiDeleteModalOpen} modalFooter={multideleteUserDialogFooter} hideModal={hideDialog} modalDescription={'Are you sure you want to delete?'} />

                </div>
            </div>

        </>
    )
}

export default FloorList

