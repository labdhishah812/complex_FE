import components from '../..';
import axios from 'axios';
// import jwtDecode from 'jwt-decode';
import RentalModal from './rentalModal';
import Loader from '../../../../components/Loader';
import DeleteModal from '../../../../components/DeleteModal';
import paper from "../../../../assets/images/No-data-pana.svg";
import { getRentalData, updateRentalStatus, rentalRemoveRequest } from '../../../../redux/slice/AdminSlices/RentalSlice';

const RentalList = () => {
    const { Button, Column, DataTable, Dropdown, InputText, toast, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { isCreated, isDelete, rentalData, isLoading } = useSelector((state) => state.rental);
    const { token, loginDetails } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editData, steEdit] = useState(null);
    const [decode, setDecode] = useState(null);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'updated_at', order: -1 }]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: ''
    });
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`)
            // decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //     decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //     navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'Rental'
        }
    ];
    useEffect(() => {
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        // decodeURI();
        setPagination(paginationData);
        setModal(false);
        steEdit(null);
        callRentalList(paginationData);
    }, [dispatch, isCreated, isDelete]);
    // const decodeURI = async () => {
    //     let decodeData = await jwtDecode(token);
    //     setDecode(decodeData);
    // };
    const callRentalList = (val) => {
        dispatch(getRentalData(val));
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
        callRentalList(paginationData);
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
        callRentalList(paginationData);
    };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-22rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search..." value={pagination?.search} onChange={(e) => onSearch(e.target.value)} style={{ width: "22rem" }} />
                    </span>
                </div>
            </React.Fragment>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Create Rental"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2"
                    onClick={() => {
                        navigate('/property-management/rental-create');
                        // setModal(true);
                        // steEdit(null);
                    }}
                />
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={loginDetails?.role_permissions.find((x) => x.role === "User") && rightToolbarTemplate}></Toolbar>;
    // const setDDMMYYYY = (val) => {
    //     try {
    //         const dateComponents = val.split('-');
    //         const formattedDate = `${dateComponents[0]}/${dateComponents[1]}/${dateComponents[2]}`;
    //         return formattedDate;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <div className="solid_border_drop">
                    <Dropdown
                        value={rowData?.is_current_rental_status}
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'In-Active', value: 'In-Active' }
                        ]}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(e) => {
                            dispatch(updateRentalStatus(rowData?._id, { is_current_rental_status: e.value }));
                            callRentalList(pagination);
                        }}
                        style={{ width: '100%' }}
                        placeholder="Select a Status"
                        className={`editableDrop ${rowData?.is_current_rental_status === 'Active' ? 'editableDropGreen' : 'editableDropRed'}`}
                    />
                </div>
            </>
        );
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                <Button
                    tooltip="Download Agreement"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-download"
                    id="edits-icons"
                    className="p-button-rounded p-button-text  p-button-success"
                    onClick={() => {
                        downloadFile(rowData?.agreement_docs);
                    }}
                />
                <Button
                    tooltip="Edit"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-pencil"
                    id="edits-icons"
                    className="p-button-rounded p-button-text  p-button-help"
                    onClick={() => {
                        navigate(`/property-management/rental-edit/${rowData?._id}`)
                        // setModal(true);
                        // steEdit(rowData);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text  p-button-danger"
                    id="delete-icons"
                    tooltip="Delete"
                    tooltipOptions={{ position: 'bottom' }}
                    onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(rowData);
                    }}
                />
            </div>
        );
    };
    const downloadFile = async (val) => {
        try {
            if (val) {
                const response = await axios.get(`${process.env.REACT_APP_RENTAL_DOCUMENT}${val}`, {
                    responseType: 'blob'
                })
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', val)
                document.body.appendChild(link)
                link.click()
            } else {
                toast.error(`Don't have agreement file`, {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
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
                        }}
                    />
                    <Button
                        label="Yes"
                        icon="pi pi-check"
                        className="p-button-outlined p-button-success mr-2 mb-2"
                        onClick={() => {
                            setDeleteModal(false);
                            dispatch(rentalRemoveRequest(deleteId?._id));
                            setDeleteId(null);
                        }}
                    />
                </>
            );
        } catch (error) {
            console.log(error);
        }
    };
    const convertDate = (dateStr) => {
        try {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const [day, month, year] = dateStr.split('/');
            const date = new Date(`${year}-${month}-${day}`);
            const formattedDate = `${day}-${monthNames[date.getMonth()]}-${year}`;
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    }
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
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Rental</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {rentalData?.data?.rental_details_listing && rentalData?.data?.rental_details_listing.length > 0 ? <DataTable
                        value={rentalData?.data?.rental_details_listing}
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
                            callRentalList(paginationData);
                        }}
                        multiSortMeta={multiSortMeta}
                    >
                        <Column field="property_number" header="Property no." sortable></Column>
                        <Column field="name" header="Rental Name" sortable></Column>
                        <Column field="mobile_no" header="Mobile Number" sortable></Column>
                        <Column field="email" header="Email" sortable></Column>
                        <Column field="start_date" header="Start Date" body={(rowData) => convertDate(rowData?.start_date)} sortable></Column>
                        <Column field="end_date" header="End Date" body={(rowData) => convertDate(rowData?.end_date)} sortable></Column>
                        {loginDetails?.role_permissions.find((x) => x.role === "User") && <Column field="is_current_rental_status" body={statusBodyTemplate} header="Status" headerStyle={{ width: '10%' }} sortable></Column>}
                        {loginDetails?.role_permissions.find((x) => x.role === "User") && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                    </DataTable> : <DataTable

                        emptyMessage={() =>
                            <><div className='flex-wrap flex'>
                                {rentalData?.data?.rental_details_listing && rentalData?.data?.rental_details_listing.length === 0 && <img src={paper} className='h-20rem w-20rem m-auto' />}
                            </div>
                                {rentalData?.data?.rental_details_listing && rentalData?.data?.rental_details_listing.length === 0 && <div className='text-center text-2xl'>{"No Record Found."}</div>}
                            </>}
                        value={[]}
                        header={header}
                    ></DataTable>}
                    {rentalData?.data?.totalRecords > 10 && <Paginator template={template} first={first} rows={rows} totalRecords={rentalData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>}
                    {modal && (
                        <RentalModal
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
                        }}
                        modalDescription={'Are you sure you want to delete rental ?'}
                    />
                </div>
            </div>
        </div>
    );
};
export default RentalList;
