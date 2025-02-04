import components from '../..';
import RolesModal from './rolesModal';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import { getRolesData, roleRemoveRequest } from '../../../../redux/slice/AdminSlices/roleSlice';
import paper from '../../../../assets/images/No-data-pana.svg';

const RolesListSuperAdmin = () => {
    const { Button, Column, DataTable, InputText, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isDelete, isLoading, rolesData } = useSelector((state) => state.roles);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [decode, setDecode] = useState(loginDetails);
    const [modal, setModal] = useState(false);
    const [editData, steEdit] = useState(null);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'updated_at', order: -1 }]);
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [numValues, setNumValues] = useState({
        num1: 0,
        num2: 0
    });

    const [filterValue, setFilterValue] = useState({});
    const [pagination, setPagination] = useState({
        current_page: 1,
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: ''
    });
    const breadcrumbItems = [
        {
            label: 'Roles'
        }
    ];
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/superadmin/dashboard`);
            // decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //     decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //     navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };
    useEffect(() => {
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        // decodeURI();
        setPagination(paginationData);
        setModal(false);
        setDeleteModal(false);
        steEdit(null);
        callRoleList(paginationData);
        setSumValue(null);
        setSumValueError('');
    }, [dispatch, isCreated, isDelete]);
    // const decodeURI = async () => {
    //     // let decodeData = await jwtDecode(token);
    //     // setDecode(decodeData);
    // };
    const callRoleList = (val) => {
        try {
            dispatch(getRolesData(val));
        } catch (error) {
            console.log(error);
        }
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Create Role"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2 "
                    onClick={() => {
                        navigate('/superadmin/roles/add');
                        // setModal(true);
                        // steEdit(null);
                    }}
                />
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
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
        callRoleList(paginationData);
    };


    const leftToolbarTemplate = () => {
        const isSearchDisabled = rolesData?.data?.role_listing.length === 0;

        return (
            <React.Fragment>
                <div className="flex justify-content-end w-50">
                    <InputText placeholder="Search by Roles" value={pagination?.search}
                     disabled={isSearchDisabled} onChange={(e) => onSearch(e.target.value)} />
                </div>
                <Button
                    label="Clear"
                    icon="pi pi-filter-slash"
                    className="p-button-outlined w-7rem ml-2"
                    disabled={pagination?.search === ''}
                    onClick={() => {
                        setMultiSortMeta([{ field: 'updated_at', order: 1 }]);

                        setFilterValue({ property_name: '', mobile_number: '' });
                        let setDefaultPag = { ...pagination };
                        setDefaultPag.current_page = 1;
                        setDefaultPag.search = '';
                        setDefaultPag.filter_value = {};
                        setDefaultPag.order_column = 'updated_at';
                        setDefaultPag.order_direction = 1;
                        setPagination(setDefaultPag);
                        callRoleList(setDefaultPag);
                    }}
                />
            </React.Fragment>
        );
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>;
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
        callRoleList(paginationData);
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
                <Button
                    tooltip="View"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text"
                    id="eyes-icons"
                    onClick={() => {
                        navigate(`/superadmin/roles/role-view/${rowData._id}`);
                    }}
                />
                <Button
                    tooltip="Edit"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-pencil"
                    id="edits-icons"
                    className="p-button-rounded p-button-text  p-button-help"
                    onClick={() => {
                        navigate(`/superadmin/roles/edit/${rowData._id}`);
                        // setModal(true);
                        // steEdit(rowData);
                    }}
                    disabled={rowData.role === 'Chairman' || rowData.role === 'User' || rowData.role === 'Super Admin'}
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
                    disabled={rowData.role === 'Chairman' || rowData.role === 'User' || rowData.role === 'Super Admin'}
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
                                dispatch(roleRemoveRequest(deleteId));
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
    const descriptionTemplate = (rowData) => {
        return <div className="ml-2 capitalize-first-letter wrap-text text-container">{rowData.description ? rowData.description : '-'}</div>;
    };

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center capitalize">Roles</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {rolesData?.data?.role_listing && rolesData?.data?.role_listing.length > 0 ? (
                        <DataTable
                            value={rolesData?.data?.role_listing}
                            showGridlines
                            stripedRows
                            dataKey="id"
                            // className="datatable-responsive"
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
                                callRoleList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            <Column field="role" className='capitalize' header="Roles" sortable></Column>
                            <Column body={descriptionTemplate} field="description" header="Description" sortable></Column>
                            <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{rolesData?.data?.role_listing && rolesData?.data?.role_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {rolesData?.data?.role_listing && rolesData?.data?.role_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {rolesData?.data?.totalRecords > 10 && <Paginator template={template} first={first} rows={rows} totalRecords={rolesData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>}
                    {modal && (
                        <RolesModal
                            editData={editData}
                            onHide={() => {
                                setModal(false);
                                steEdit(null);
                            }}
                        />
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
                        modalDescription={'Are you sure you want to delete role?'}
                    />
                </div>
            </div>
        </div>
    );
};
export default RolesListSuperAdmin;
