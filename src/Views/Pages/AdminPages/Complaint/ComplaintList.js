import React from 'react';
import components from '../..';
import ComplaintModel from './complaintModel';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import moment from 'moment-timezone';
import { getComplaintsData, complaintRemoveRequest, updateComplaintStatusRequest } from '../../../../redux/slice/AdminSlices/complaintSlice';
import { X } from 'lucide-react';
import { limitTextTo15Words } from '../../../../components/Moment';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
const ComplaintList = () => {
    const { React, Dialog, Dropdown, SelectButton, DataTable, InputTextarea, Column, Paginator, BreadCrumb, Button, Toolbar, classNames, InputText, useNavigate, useState, useEffect, useDispatch, useSelector } = components;
    const { isCreated, isDelete, isLoading, complaintsData } = useSelector((store) => store.complaint);
    const { token, loginDetails } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const adminOptions = ['Approved', 'Pending'];
    const [remarkError, serRemarkError] = useState(false);
    const [remark, setRemark] = useState('');
    const [adminPending, setAdminPending] = useState(adminOptions[0]);
    const userOptions = ['Received Complain', 'Created Complain'];
    const [userPending, setUserPending] = useState(userOptions[0]);
    const [selecterTab, setSelecterTab] = useState('All');
    // const [decode, setDecode] = useState(null);
    const [modal, setModal] = useState(false);
    const [closeModal, setCloseModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [numValues, setNumValues] = useState({ num1: 0, num2: 0 });
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [editData, steEdit] = useState(null);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'updated_at', order: -1 }]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: '',
        is_complaint_approved_by_chairman: 'All'
        // is_complaint_for_user: true
    });
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Complaints'
        }
    ];
    useEffect(() => {
        // let paginationData = { ...pagination };
        // decodeURI(true);
        // paginationData.order_column = multiSortMeta[0]['field'];
        // paginationData.order_direction = multiSortMeta[0]['order'];
        // setPagination(paginationData);
        setCloseModal(null);
        serRemarkError(false);
        setPageCostume();
        setModal(false);
        steEdit(null);
        setAdminPending('Approved');
        setUserPending(userOptions[0]);
        // callGetComplaintsData(paginationData);
    }, [dispatch, isCreated, isDelete]);
    const setPageCostume = (dec) => {
        try {
            let paginationData = { ...pagination };
            paginationData.order_column = multiSortMeta[0]['field'];
            paginationData.order_direction = multiSortMeta[0]['order'];

            // if (loginDetails.role_permissions.length === 1 && loginDetails.role_permissions.find((x) => x.role === "User")) {
            paginationData.is_complaint_approved_by_chairman = selecterTab === 'All' ? 'All' : selecterTab === 'In Progress' ? 1 : selecterTab === 'Close' ? 2 : 0;
            // paginationData.is_complaint_for_user = true;
            // } else {
            //     paginationData.is_complaint_approved_by_chairman = 0;
            // }
            setSelecterTab(selecterTab);
            setPagination(paginationData);
            callGetComplaintsData(paginationData);
        } catch (error) {
            console.log(error);
        }
    };
    // const decodeURI = async (val) => {
    //     // let decodeData = await jwtDecode(token);
    //     // val && setPageCostume(decodeData);
    //     // setDecode(decodeData);
    // };
    const getRoles = (permissionName, val) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== 'User') : loginDetails?.role_permissions;
                dataColl.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'complaint')?.module_access.findIndex((y) => y === permissionName);
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
    const callGetComplaintsData = (val) => {
        try {
            dispatch(getComplaintsData(val));
        } catch (error) {
            console.log(error);
        }
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={complaintsData?.data?.camplaints_listing?.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        const { data } = await axios.post(`${BASE_URL_API}/newcomplaint/excel`, pagination, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                Authorization: token
                            }
                        });
                        let complaintsData = data?.data;

                        if (complaintsData && complaintsData.length > 0) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Complaints List');

                            // Define headers for complaints
                            const headerRow = worksheet.addRow(['Subject', 'Description', 'Status', 'Created Date', 'Updated Date']);

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

                            // Add complaint data rows
                            complaintsData.forEach((complaint) => {
                                // Convert HTML description to plain text
                                const plainDescription = complaint.description ? new DOMParser().parseFromString(complaint.description, 'text/html').body.textContent.trim() : '-';

                                // Get status text
                                const getStatusText = (status) => {
                                    switch (status) {
                                        case 0:
                                            return 'Open';
                                        case 1:
                                            return 'In Progress';
                                        case 2:
                                            return 'Close';
                                        default:
                                            return '-';
                                    }
                                };

                                const row = worksheet.addRow([
                                    complaint.subject || '-',
                                    plainDescription,
                                    getStatusText(complaint.is_complaint_approved_by_chairman),
                                    moment(complaint.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(complaint.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                ]);

                                // Style status cell
                                const statusCell = row.getCell(3);
                                const status = complaint.is_complaint_approved_by_chairman;
                                if (status === 0) {
                                    statusCell.font = {
                                        color: { argb: 'd32f2f' },
                                        bold: true
                                    };
                                } else if (status === 1) {
                                    statusCell.font = {
                                        color: { argb: 'f5c308' },
                                        bold: true
                                    };
                                } else if (status === 2) {
                                    statusCell.font = {
                                        color: { argb: '689f38' },
                                        bold: true
                                    };
                                }
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
                                    a.download = 'complaints_list.xlsx';
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                })
                                .catch((err) => {
                                    console.error('Error generating Excel file:', err);
                                });
                        }
                    }}
                />
                <Button
                    label="Raise Complain"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2 "
                    //  onClick={() => handleComplaintModal()}
                    onClick={() => navigate(`/property-management/complain/complain-create`)}
                />
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };

    const leftToolbarTemplate = () => {
        const isSearchDisabled = complaintsData?.data?.camplaints_listing?.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Subject, Complaint" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
                    </span>

                    {/* Clear Button */}
                    <Button
                        label="Clear"
                        icon="pi pi-filter-slash"
                        className="p-button-outlined w-7rem ml-2"
                        disabled={pagination?.search === ''}
                        onClick={() => {
                            let setDefaultPag = { ...pagination };
                            setDefaultPag.search = ''; // Clear the search value
                            setPagination(setDefaultPag); // Update pagination state
                            onSearch(''); // Clear the search filter
                        }}
                    />
                </div>
            </React.Fragment>
        );
    };
    const CenterToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* Select Button */}
                <SelectButton
                    value={selecterTab}
                    onChange={(e) => {
                        let paginationData = { ...pagination };
                        if (e.value !== null) {
                            if (e.value === 'All') {
                                paginationData.is_complaint_approved_by_chairman = 'All'; // Remove the filter to get all data
                            } else {
                                paginationData.is_complaint_approved_by_chairman = e.value === 'In Progress' ? 1 : e.value === 'Close' ? 2 : 0;
                            }

                            callGetComplaintsData(paginationData);
                            setPagination(paginationData);
                            setSelecterTab(e.value);
                        }
                    }}
                    options={['All', 'Open', 'In Progress', 'Close']}
                    className="ml-4"
                />
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
        dispatch(getComplaintsData(paginationData));
    };
    const handleComplaintModal = () => {
        try {
            setModal(true);
            steEdit(null);
        } catch (error) {
            console.log(error);
        }
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} center={CenterToolbarTemplate} end={getRoles('create') && rightToolbarTemplate}></Toolbar>;
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
        try {
            setFirst(event.first);
            setRows(event.rows);
            let paginationData = pagination;
            paginationData.current_page = event?.page + 1;
            paginationData.per_page = event?.rows;
            paginationData.order_column = multiSortMeta[0]['field'];
            paginationData.order_direction = multiSortMeta[0]['order'];
            setPagination(paginationData);
            callGetComplaintsData(paginationData);
        } catch (error) {
            console.log(error);
        }
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
    const deleteUserDialogFooter = () => (
        <>
            <Button
                label="No"
                className="p-button-outlined p-button-danger mr-2"
                onClick={() => {
                    setDeleteModal(false);
                    setDeleteId(null);
                    setSumValue(null);
                    setSumValueError('');
                }}
            />
            <Button
                label="Yes"
                className="p-button-outlined p-button-success"
                onClick={() => {
                    if (numValues.num1 + numValues.num2 === sumValue) {
                        dispatch(complaintRemoveRequest(deleteId));
                        setDeleteModal(false);
                        setDeleteId(null);
                        setSumValue(null);
                        setSumValueError('');
                        dispatch(getComplaintsData());
                    } else {
                        setSumValueError('Wrong Answer!');
                    }
                }}
            />
        </>
    );
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/complain/complain-view/${rowData?._id}`)} />
                {/* {adminPending === 'Approved' && userPending !== 'Created Complain' && getRoles('update') && ( */}
                {(selecterTab === 'Open' || selecterTab === 'In Progress') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text  p-button-help"
                        onClick={() => {
                            navigate(`/property-management/complain/complain-edit/${rowData?._id}`);
                            // setModal(true);
                            // steEdit(rowData);
                        }}
                        // disabled={loginDetails._id !== rowData.complaint_created_by}
                    />
                )}
                {/* )} */}
                {/* <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-warning p-button-text" id="eyes-icons" /> */}
                {/* {(adminPending === 'Approved' || userPending === 'Created Complain') && getRoles('delete') && ( */}
                {selecterTab === 'Open' && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text  p-button-danger"
                        id="delete-icons"
                        tooltip="Delete"
                        tooltipOptions={{ position: 'bottom' }}
                        onClick={() => {
                            setDeleteModal(true);
                            setDeleteId(rowData);
                            dynamicNumber();
                            setSumValue(null);
                            setSumValueError('');
                        }}
                        disabled={loginDetails._id !== rowData.complaint_created_by && !loginDetails.role_permissions.find((x) => x.role === 'Chairman')}
                    />
                )}
                {/* )} */}
                {/* {adminPending !== 'Approved' && getRoles('update') && (
                    <Button
                        label="Approve"
                        icon="pi pi-check"
                        className="p-button-outlined p-button-success mr-2 ml-2"
                        onClick={() => {
                            // dispatch(updateComplaintStatusRequest(rowData._id, { is_complaint_approved_by_chairman: true }));
                        }}
                    />
                )} */}
            </div>
        );
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Complaints</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0 mt-3">
                <div className="col-12 card">
                    {complaintsData?.data?.camplaints_listing && complaintsData?.data?.camplaints_listing.length > 0 ? (
                        <DataTable
                            value={complaintsData?.data?.camplaints_listing}
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
                                callGetComplaintsData(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            {/* <Column field="userPropertyDetailsPropertyNumber" header="Property No." sortable body={(rowData) => <div className='text-center'>{rowData.userPropertyDetailsPropertyNumber ? rowData.userPropertyDetailsPropertyNumber : '-'}</div>}></Column>
                        <Column field="usersName" header="Respondent Name" sortable></Column>
                        <Column field="usersMobileNumber" header="Mobile No." body={(rowData) => <div className='text-right'>{rowData?.usersMobileNumber}</div>} sortable></Column> */}
                            <Column field="subject" className="capitalize-first-letter" header="Subject" headerStyle={{ width: '25%' }} bodyStyle={{ width: '25%' }} sortable></Column>
                            <Column
                                field="description"
                                header="Complaint"
                                className="h-50 capitalize-first-letter wrap-text text-container"
                                sortable
                                body={(rowData) => {
                                    // Remove HTML tags
                                    const plainText = rowData.description
                                        .replace(/<\/?[^>]+(>|$)/g, ' ') // Remove HTML tags
                                        .replace(/&nbsp;/g, ' ') // Replace `&nbsp;` with a space
                                        .replace(/\s+/g, ' ') // Remove extra spaces
                                        .trim(); // Trim leading and trailing spaces
                                    return limitTextTo15Words(plainText);
                                    // Truncate to 250 characters with '...'
                                    // return plainText.length > 250 ? plainText.slice(0, 250) + '...' : plainText || '-';
                                }}
                            />

                            <Column field="created_at" header="Created At" headerStyle={{ width: '10%' }} sortable body={(rowData) => (rowData.created_at ? moment(rowData.created_at).utcOffset('+05:30').format('D MMM YY, LT') : '-')}></Column>
                            <Column field="updated_at" header="Updated At" headerStyle={{ width: '10%' }} sortable body={(rowData) => (rowData.updated_at ? moment(rowData.updated_at).utcOffset('+05:30').format('D MMM YY, LT') : '-')}></Column>
                            {/* <Column
                                field=""
                                header="Status"
                                headerStyle={{ width: '150px' }}
                                body={(rowData) => (
                                    <>
                                        <>
                                            {getRoles('update', true) && rowData?.is_complaint_approved_by_chairman !== 2 ? (
                                                <div className="solid_border_drop">
                                                    <Dropdown
                                                        value={rowData?.is_complaint_approved_by_chairman}
                                                        options={
                                                            // rowData?.is_complaint_approved_by_chairman === 0 ?
                                                            [
                                                                { label: 'Open', value: 0 },
                                                                { label: 'In Progress', value: 1 },
                                                                { label: 'Close', value: 2 }
                                                            ]
                                                            // : [
                                                            //     { label: 'In Progress', value: 1 },
                                                            //     { label: 'Close', value: 2 }
                                                            // ]
                                                        }
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        onChange={(e) => {
                                                            if (e.target.value !== null && e.target.value !== 2) {
                                                                dispatch(updateComplaintStatusRequest(rowData._id, { is_complaint_approved_by_chairman: e.target.value }));
                                                            } else if (e.target.value !== null && e.target.value === 2) {
                                                                setCloseModal(rowData);
                                                                setRemark('');
                                                                serRemarkError(false);
                                                            }
                                                        }}
                                                        style={{
                                                            width: '150px', // Set a fixed width that accommodates your longest option
                                                            minWidth: '150px', // Prevent shrinking
                                                            background: 'transparent'
                                                        }}
                                                        placeholder="Select a Status"
                                                        className={`${
                                                            rowData?.is_complaint_approved_by_chairman === 0
                                                                ? 'editableDropRed editableDropBorderRed'
                                                                : rowData?.is_complaint_approved_by_chairman === 1
                                                                ? 'editableDropYellow editableDropBorderYellow'
                                                                : 'editableDropGreen editableDropBorderGreen'
                                                        }`}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="p-2 my-2"
                                                    style={{
                                                        color: rowData?.is_complaint_approved_by_chairman === 0 ? '#d32f2f' : rowData?.is_complaint_approved_by_chairman === 1 ? '#f5c308' : '#689f38',
                                                        border: `2px solid ${rowData?.is_complaint_approved_by_chairman === 0 ? '#d32f2f' : rowData?.is_complaint_approved_by_chairman === 1 ? '#f5c308' : '#689f38'}`,
                                                        borderRadius: '5px',
                                                        width: '100px', // Set a fixed width that accommodates your longest option
                                                        minWidth: '100px', // Prevent shrinking
                                                        background: 'transparent'
                                                    }}
                                                >
                                                    {rowData?.is_complaint_approved_by_chairman === 0 ? 'Open' : rowData?.is_complaint_approved_by_chairman === 1 ? 'In Progress' : 'Close'}
                                                </div>
                                            )}
                                        </>
                                    </>
                                )}
                            ></Column> */}

                            <Column
                                field=""
                                header="Status"
                                headerStyle={{ width: '150px' }}
                                body={(rowData) => (
                                    <>
                                        {getRoles('update', true) && rowData?.is_complaint_approved_by_chairman !== 2 ? (
                                            <div className="solid_border_drop">
                                                <Dropdown
                                                    value={rowData?.is_complaint_approved_by_chairman}
                                                    options={[
                                                        { label: 'Open', value: 0 },
                                                        { label: 'In Progress', value: 1 },
                                                        { label: 'Close', value: 2 }
                                                    ]}
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    onChange={(e) => {
                                                        if (e.target.value !== null && e.target.value !== 2) {
                                                            dispatch(updateComplaintStatusRequest(rowData._id, { is_complaint_approved_by_chairman: e.target.value }));
                                                        } else if (e.target.value !== null && e.target.value === 2) {
                                                            setCloseModal(rowData);
                                                            setRemark('');
                                                            serRemarkError(false);
                                                        }
                                                    }}
                                                    style={{
                                                        width: '120px', // Ensures consistent size
                                                        minWidth: '120px',
                                                        background: 'transparent'
                                                    }}
                                                    placeholder="Select a Status"
                                                    className={`${
                                                        rowData?.is_complaint_approved_by_chairman === 0
                                                            ? 'editableDropRed editableDropBorderRed'
                                                            : rowData?.is_complaint_approved_by_chairman === 1
                                                            ? 'editableDropYellow editableDropBorderYellow'
                                                            : 'editableDropGreen editableDropBorderGreen'
                                                    }`}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="p-2 my-2"
                                                style={{
                                                    color: rowData?.is_complaint_approved_by_chairman === 0 ? '#d32f2f' : rowData?.is_complaint_approved_by_chairman === 1 ? '#f5c308' : '#689f38',
                                                    border: `2px solid ${rowData?.is_complaint_approved_by_chairman === 0 ? '#d32f2f' : rowData?.is_complaint_approved_by_chairman === 1 ? '#f5c308' : '#689f38'}`,
                                                    borderRadius: '5px',
                                                    width: '120px', // Matches Dropdown width
                                                    minWidth: '120px',
                                                    textAlign: 'center', // Aligns text centrally
                                                    background: 'transparent'
                                                }}
                                            >
                                                {rowData?.is_complaint_approved_by_chairman === 0 ? 'Open' : rowData?.is_complaint_approved_by_chairman === 1 ? 'In Progress' : 'Close'}
                                            </div>
                                        )}
                                    </>
                                )}
                            ></Column>

                            {/* {loginDetails.role_permissions.length === 1 && loginDetails.role_permissions.find((x) => x.role === "User") && userPending === 'Created Complain' && (
                            <Column
                                field="is_complaint_approved_by_chairman"
                                header="Status"
                                body={(rowData) => <div style={{ color: `${rowData.is_complaint_approved_by_chairman ? '#689f38' : '#d32f2f'}` }}>{rowData.is_complaint_approved_by_chairman ? 'Approved' : 'Pending'}</div>}
                                sortable
                            ></Column>
                        )} */}

                            <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>
                            {/* <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column> */}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{complaintsData?.data?.camplaints_listing && complaintsData?.data?.camplaints_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {complaintsData?.data?.camplaints_listing && complaintsData?.data?.camplaints_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {complaintsData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={complaintsData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
                    )}
                    {modal && (
                        <ComplaintModel
                            editData={editData}
                            onHide={() => {
                                setModal(false);
                                steEdit(null);
                            }}
                        />
                    )}
                    {closeModal !== null && (
                        <Dialog
                            draggable={false}
                            visible={closeModal !== null}
                            header="Complaint Close"
                            style={{ width: '30vw' }}
                            closable={false}
                            footer={false}
                            icons={
                                <div className="flex align-items-center justify-content-center" style={{ width: '1.5rem', height: '1.5rem' }}>
                                    <X
                                        color={'#ffff'}
                                        size={17}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setCloseModal(null);
                                            serRemarkError(false);
                                        }}
                                    />
                                </div>
                            }
                            modal
                            className="p-fluid"
                            // modalFooter={() => cancelDialogFooter()}
                            onHide={() => {
                                setCloseModal(null);
                                serRemarkError(false);
                            }}
                            headerStyle={{ backgroundColor: '#d32f2f', color: '#fff' }}
                        >
                            <div className="w-full mt-3">
                                <div className="card">
                                    <div className="py-2">
                                        <div className="text-500 font-medium">{'Subject'}</div>
                                        <div className="text-900 mt-1">{closeModal?.subject ? closeModal?.subject : '-'}</div>
                                    </div>
                                    <div className="py-2">
                                        <div className="text-500 font-medium">{'Complaint'}</div>
                                        <div className="text-900 mt-1">{closeModal?.description ? new DOMParser().parseFromString(closeModal.description, 'text/html').body.textContent.trim() : '-'}</div>
                                        {/* <div className="text-900 mt-1">{closeModal?.description ? closeModal?.description : '-'}</div> */}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="remark" className="required">
                                        Remarks
                                    </label>
                                </div>
                                <InputTextarea
                                    rows="2"
                                    id="remark"
                                    name="remark"
                                    placeholder="Enter Remarks"
                                    value={remark}
                                    onChange={(e) => {
                                        setRemark(e.target.value);
                                        serRemarkError(false);
                                    }}
                                    className={classNames({ 'p-invalid': remarkError })}
                                    style={{ resize: 'none' }}
                                />
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end mt-3 p-0">
                                    <Button
                                        label="No"
                                        icon="pi pi-times"
                                        className="p-button-outlined p-button-danger mr-2 mb-2 w-5rem"
                                        onClick={() => {
                                            setCloseModal(null);
                                            serRemarkError(false);
                                        }}
                                    />
                                    <Button
                                        label="Yes"
                                        icon="pi pi-check"
                                        className="p-button-outlined p-button-success mb-2 w-5rem"
                                        onClick={() => {
                                            if (remark !== '') {
                                                dispatch(updateComplaintStatusRequest(closeModal?._id, { is_complaint_approved_by_chairman: 2, remark: remark }));
                                            } else {
                                                serRemarkError(true);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </Dialog>
                    )}
                    <DeleteModal
                        isOpenDialog={deleteModal}
                        modalFooter={deleteUserDialogFooter}
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
                        modalDescription="Are you sure you want to delete this complaint?"
                    />
                </div>
            </div>
        </div>
    );
};

export default ComplaintList;
