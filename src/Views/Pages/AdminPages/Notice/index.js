import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import { getRolesData, roleRemoveRequest } from '../../../../redux/slice/AdminSlices/roleSlice';
import { getNoticeList, removeNotice } from '../../../../redux/slice/AdminSlices/noticeSlice';
import paper from '../../../../assets/images/No-data-pana.svg';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
import moment from 'moment-timezone';

const Notice = () => {
    const { Button, Column, DataTable, SelectButton, InputText, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { rolesData } = useSelector((state) => state.roles);
    const { isLoading, noticelist, isDelete, isCreated } = useSelector((state) => state.notice);
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;

    const [pagination, setPagination] = useState({
        current_page: 1,
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: '',
        listType: 0
    });
    const breadcrumbItems = [
        {
            label: 'Notice'
        }
    ];
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
            // decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //     decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //     navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };
    const getRoles = (permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'notice')?.module_access.findIndex((y) => y === permissionName);
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
    useEffect(() => {
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        if (loginDetails?.role_permissions.filter((x) => x.role !== 'User').length === 0) {
            paginationData.listType = 1;
        }

        // decodeURI();
        setPagination(paginationData);
        callRoleList(paginationData);
        setSumValue(null);
        setSumValueError('');
    }, [dispatch, isCreated, isDelete]);

    const callRoleList = (val) => {
        try {
            dispatch(getNoticeList(val));
        } catch (error) {
            console.log(error);
        }
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <Button
                    disabled={noticelist?.notice_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        const { data } = await axios.post(`${BASE_URL_API}/emergencycontact/excel`, pagination, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                Authorization: token
                            }
                        });
                        let contactData = data?.data;

                        if (contactData && contactData.length > 0) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Emergency Contacts List');

                            // Define headers
                            const headerRow = worksheet.addRow(['Contact Name', 'Contact Number', 'Created Date', 'Updated Date']);

                            // Style header row
                            headerRow.eachCell((cell, number) => {
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'e4e4e4' }
                                };
                                cell.font = {
                                    color: { argb: '212121' },
                                    bold: true
                                };
                            });

                            // Add contact data rows
                            contactData.forEach((contact) => {
                                worksheet.addRow([
                                    contact.contact_name || '-',
                                    contact.contact_no || '-',
                                    moment(contact.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(contact.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                ]);
                            });

                            // Auto-fit columns
                            worksheet.columns.forEach((column) => {
                                column.width = 25;
                            });

                            // Generate and download Excel file
                            workbook.xlsx
                                .writeBuffer()
                                .then((buffer) => {
                                    const blob = new Blob([buffer], {
                                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                    });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'emergency_contacts_list.xlsx';
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                })
                                .catch((err) => {
                                    console.error('Error generating Excel file:', err);
                                });
                        }
                    }}
                /> */}
                {getRoles('create') && (
                    <Button
                        label="Create Notice"
                        icon="pi pi-plus"
                        className="p-button-outlined p-button-success mr-2 "
                        onClick={() => {
                            navigate('/property-management/notice/notice-create');
                        }}
                    />
                )}
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
        const isSearchDisabled = noticelist?.notice_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment className="flex justify-content-between w-full">
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Property no., Name, Subject, Description, Notice by" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
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

    const centerToolbarTemplate = () => {
        return (
            <React.Fragment>
                {loginDetails?.role_permissions.filter((x) => x.role !== 'User').length > 0 && (
                    <SelectButton
                        value={pagination.listType === 0 ? 'Draft' : 'Published'}
                        onChange={(e) => {
                            if (e.value !== null) {
                                let paginationData = { ...pagination };
                                paginationData.listType = e.value === 'Draft' ? 0 : 1;
                                paginationData.per_page = 10;
                                paginationData.current_page = 1;
                                callRoleList(paginationData);
                                setPagination(paginationData);
                            }
                        }}
                        options={['Draft', 'Published']}
                    />
                )}
            </React.Fragment>
        );
    };

    const header = <Toolbar start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>;
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
                        navigate(`/property-management/notice/notice-view/${rowData?._id}`);
                    }}
                />
                {getRoles('update') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text  p-button-help"
                        disabled={rowData?.notice_status === 'published'}
                        onClick={() => {
                            navigate(`/property-management/notice/notice-edit/${rowData?._id}`);
                        }}
                    />
                )}
                {getRoles('delete') && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text  p-button-danger"
                        id="delete-icons"
                        tooltip="Delete"
                        tooltipOptions={{ position: 'bottom' }}
                        disabled={rowData?.notice_status === 'published'}
                        onClick={() => {
                            setDeleteModal(true);
                            setDeleteId(rowData._id);
                            dynamicNumber();
                        }}
                    />
                )}
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
                                dispatch(removeNotice(deleteId));
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
        return <div className="ml-2 capitalize">{rowData.description ? rowData.description : '-'}</div>;
    };
    // console.log(noticelist, 'getRolesData');
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Notice</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {noticelist?.notice_listing && noticelist?.notice_listing.length > 0 ? (
                        <DataTable
                            value={noticelist?.notice_listing}
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
                            <Column field="PropertyNumber" className="h-50" header="Property No." headerStyle={{ width: '3%', minWidth: '10rem' }} body={(rowData) => <div className="text-center">{rowData?.PropertyNumber}</div>} sortable></Column>
                            {/* <Column field="usersName" className="capitalize" header="Name" sortable></Column> */}
                            <Column
                                field="usersName"
                                className="capitalize"
                                header="Name"
                                sortable
                                body={(rowData) => (
                                    <a
                                        href={`${BASE_URL_API}property-management/property-assign/${rowData.user_property_assign_id}`}
                                        className=" hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent default navigation
                                            navigate(`/property-management/property-assign/${rowData.user_property_assign_id}`);
                                            // window.location.href = `http://localhost:3000/property-management/property-assign/${rowData._id}`; // Redirect to the property page
                                        }}
                                    >
                                        {rowData.usersName}
                                    </a>
                                )}
                            ></Column>
                            <Column field="subject" className="capitalize-first-letter" header="Subject" sortable></Column>
                            {/* <Column field="description" header="Description" sortable></Column> */}
                            {/* <Column field="committeeName" className="capitalize" header="Notice By" sortable></Column> */}
                            <Column
                                field="committeeName"
                                className="capitalize"
                                header="Notice By"
                                sortable
                                body={(rowData) => (
                                    <a
                                        href={`${BASE_URL_API}property-management/property-assign/${rowData.committee_member_id}`}
                                        className=" hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent default navigation
                                            navigate(`/property-management/property-assign/${rowData.committee_member_id}`);
                                            // window.location.href = `http://localhost:3000/property-management/property-assign/${rowData._id}`; // Redirect to the property page
                                        }}
                                    >
                                        {rowData.committeeName}
                                    </a>
                                )}
                            ></Column>

                            {/* <Column body={descriptionTemplate} field="description" header="Description" sortable></Column> */}
                            <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{noticelist?.notice_listing && noticelist?.notice_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {noticelist?.notice_listing && noticelist?.notice_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {noticelist?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={noticelist?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
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
                        modalDescription={'Are you sure you want to remove notice?'}
                    />
                </div>
            </div>
        </div>
    );
};
export default Notice;
