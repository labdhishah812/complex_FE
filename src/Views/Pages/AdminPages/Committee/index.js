import React from 'react';
import components from '../..';
import jwtDecode from 'jwt-decode';
import CommitteeModel from './committeeModal';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import { getCommitteeData, committeeRemoveRequest } from '../../../../redux/slice/AdminSlices/committeeSlice';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
import moment from 'moment-timezone';
const CommitteeList = () => {
    const { React, SelectButton, DataTable, Column, Paginator, BreadCrumb, Button, Toolbar, InputText, useNavigate, useState, useEffect, useDispatch, useSelector } = components;
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isDelete, committeeData, isLoading } = useSelector((state) => state.committee);
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
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;

    const [pagination, setPagination] = useState({
        current_page: 1,
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: ''
    });

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
            dispatch(getCommitteeData(val));
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
            label: 'Core Members'
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
    const getRoles = (permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'committee-member')?.module_access.findIndex((y) => y === permissionName);
                    if (check !== undefined && check !== -1 && checkPrmition === false) {
                        checkPrmition = true;
                    }
                });
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
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                 <Button
                    disabled={committeeData?.data?.role_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        try {
                            const { data } = await axios.post(`${BASE_URL_API}/user/excel`, pagination, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                    Authorization: token
                                }
                            });
                            const memberData = committeeData?.data?.role_listing; // Use existing data instead of API response

                            if (memberData && memberData.length > 0) {
                                const workbook = new ExcelJS.Workbook();
                                const worksheet = workbook.addWorksheet('Core Members');

                                // Define headers
                                const headerRow = worksheet.addRow([
                                    'Member Name',
                                    'Role',
                                    'Mobile Number',
                                    'Email',
                                    'Created Date',
                                    'Updated Date'
                                ]);

                                // Style header row
                                headerRow.eachCell((cell) => {
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

                                // Add member data rows
                                memberData.forEach((member) => {
                                    worksheet.addRow([
                                        member.name || '-',
                                        member.role || '-',
                                        member.mobile_number || '-',
                                        member.email || '-',
                                        moment(member.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                        moment(member.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                    ]);
                                });

                                // Set column widths
                                worksheet.getColumn(1).width = 25; // Member Name
                                worksheet.getColumn(2).width = 20; // Role
                                worksheet.getColumn(3).width = 15; // Mobile Number
                                worksheet.getColumn(4).width = 30; // Email
                                worksheet.getColumn(5).width = 15; // Gender
                                worksheet.getColumn(6).width = 25; // Created Date
                                worksheet.getColumn(7).width = 25; // Updated Date

                                // Generate and download Excel file
                                const buffer = await workbook.xlsx.writeBuffer();
                                const blob = new Blob([buffer], {
                                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'core-members.xlsx';
                                a.click();
                                window.URL.revokeObjectURL(url);
                            }
                        } catch (error) {
                            console.error('Error generating Excel file:', error);
                        }
                    }}
                />
                <Button
                    label="Add Core Member"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2"
                    // onClick={() => setModal(true)}
                    onClick={() => navigate(`/property-management/committee/committee-add`)}
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
        const isSearchDisabled = committeeData?.data?.role_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                {/* <div className="flex justify-content-end w-20rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Member Name, Role , Mobile No., Email" type='search' value={pagination?.search} onChange={(e) => onSearch(e.target.value)} style={{ width: "20rem" }} />
                    </span>
                </div> */}
                <div className="flex justify-content-end w-50rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Member Name, Role , Mobile No., Email" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
                    </span>
                    <Button
                        label="Clear"
                        icon="pi pi-filter-slash"
                        className="p-button-outlined w-7rem ml-2"
                        disabled={pagination?.search === ''} // Disable when no search value is present
                        onClick={() => {
                            let setDefaultPag = { ...pagination };
                            setDefaultPag.current_page = 1; // Reset to the first page
                            setDefaultPag.search = ''; // Clear the search value
                            setPagination(setDefaultPag); // Update pagination state
                            onSearch(''); // Clear the search filter
                        }}
                    />
                </div>
            </React.Fragment>
        );
    };
    // const leftToolbarTemplate = () => {
    //     return (
    //         <React.Fragment>
    //             <div className="flex justify-content-end w-20rem">
    //                 <span className="p-input-icon-right">
    //                     <i className="pi pi-search" />
    //                     <InputText
    //                         placeholder="Search by Member Name, Role , Mobile No., Email"
    //                         type="search"
    //                         value={pagination?.search || ''}
    //                         onChange={(e) => onSearch(e.target.value)}
    //                         style={{ width: '20rem' }}
    //                         disabled={!committeeData?.data?.role_listing || committeeData?.data?.role_listing.length === 0}
    //                     />
    //                 </span>
    //                 <Button
    //                     label="Clear"
    //                     icon="pi pi-filter-slash"
    //                     className="p-button-outlined w-7rem ml-2"
    //                     disabled={pagination?.search === ''} // Disable when no search value is present
    //                     onClick={() => {
    //                         let setDefaultPag = { ...pagination };
    //                         setDefaultPag.current_page = 1; // Reset to the first page
    //                         setDefaultPag.search = ''; // Clear the search value
    //                         setPagination(setDefaultPag); // Update pagination state
    //                         onSearch(''); // Clear the search filter
    //                     }}
    //                 />
    //             </div>
    //         </React.Fragment>
    //     );
    // };

    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={getRoles('create') && rightToolbarTemplate}></Toolbar>;
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
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
                    onClick={() => navigate(`/property-management/committee/committee-edit/${rowData?.role_details_array[0]._id}/${rowData?._id}`)}
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
                        setDeleteId({ id: rowData._id, role_details_id: rowData?.role_details_array[0]?._id });
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
                                dispatch(committeeRemoveRequest(deleteId));
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{'Core Members'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0 mt-3">
                <div className="col-12 card">
                    {committeeData?.data?.role_listing && committeeData?.data?.role_listing.length > 0 ? (
                        <DataTable
                            value={committeeData?.data?.role_listing}
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
                            {/* <Column field="name" className="capitalize" header="Member Name" sortable></Column> */}
                            <Column
                                field="name"
                                className="h-50 capitalize"
                                header="Member Name"
                                sortable
                                body={(rowData) => (
                                    <a
                                        href={`${BASE_URL_API}property-management/committee/${rowData.user_property_assign_id[0]}`}
                                        className=" hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent default navigation
                                            navigate(`/property-management/committee/${rowData.user_property_assign_id[0]}`);
                                            // window.location.href = `http://localhost:3000/property-management/property-assign/${rowData._id}`; // Redirect to the property page
                                        }}
                                    >
                                        {rowData.name}
                                    </a>
                                )}
                            ></Column>
                            <Column field="role" className="capitalize" header="Role" sortable></Column>
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
                            <Column field="email" header="Email" body={(rowData) => <a href={`mailto:${rowData?.email}`}>{rowData?.email}</a>} sortable></Column>
                            {/* <Column field="gender" header="Gender" sortable body={(rowData) => rowData?.gender ? rowData?.gender : "-"}></Column> */}
                            {getRoles('update') && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{committeeData?.data?.role_listing && committeeData?.data?.role_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {committeeData?.data?.role_listing && committeeData?.data?.role_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {committeeData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={committeeData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
                    )}
                    {modal && (
                        <CommitteeModel
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
                        modalDescription={'Are you sure you want to delete committee member?'}
                    />
                </div>
            </div>
        </div>
    );
};
export default CommitteeList;
