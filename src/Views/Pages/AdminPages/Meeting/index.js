import components from '../..';
// import RolesModal from './rolesModal';
import { X } from 'lucide-react';
import moment from 'moment-timezone';
import paper from '../../../../assets/images/No-data-pana.svg';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import { getMeetingList, meetingStatusUpdateRequest, removeMeeting } from '../../../../redux/slice/AdminSlices/meetingSlice';
import { limitTextTo15Words } from '../../../../components/Moment';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
// import { getRolesData, roleRemoveRequest } from '../../../../redux/slice/AdminSlices/roleSlice';
const Meeting = () => {
    const { Button, Column, toast, classNames, InputTextarea, Dialog, DataTable, SelectButton, Dropdown, InputText, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isDelete, isUpdate, isLoading, meetinglist } = useSelector((state) => state.meeting);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const [deleteModal, setDeleteModal] = useState(false);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'date', order: 1 }]);
    const [cancelMeeting, setCancelMeeting] = useState(null);
    const [closeMeeting, setCloseMeeting] = useState(null);
    const [closeMeetingError, setCloseMeetingError] = useState(null);
    const [remarkError, serRemarkError] = useState(false);
    const [remark, setRemark] = useState('');
    const [deleteId, setDeleteId] = useState(null);
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
        listType: 0,
        per_page: 10,
        search: ''
    });
    const breadcrumbItems = [
        {
            label: 'Meetings'
        }
    ];
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };
    const getRoles = (permissionName, val) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== 'User') : loginDetails?.role_permissions;
                dataColl.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'meeting')?.module_access.findIndex((y) => y === permissionName);
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
        setPagination(paginationData);
        setDeleteModal(false);
        setCancelMeeting(null);
        setCloseMeeting(null);
        serRemarkError(false);
        callMeetingList(paginationData);
    }, [dispatch, isCreated, isDelete, isUpdate]);

    const callMeetingList = (val) => {
        try {
            dispatch(getMeetingList(val));
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
        callMeetingList(paginationData);
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = meetinglist?.meeting_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Title" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
                    </span>
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

    // const rightToolbarTemplate = () => {
    //     return (
    //         <React.Fragment>
    //             <Button
    //                 disabled={meetinglist?.meeting_listing.length === 0}
    //                 label="Export"
    //                 icon="pi pi-download"
    //                 className="p-button-outlined p-button-help mr-2 my-3 m-auto"
    //                 onClick={async () => {
    //                     const { data } = await axios.post(`${BASE_URL_API}/society-meeting/excel`, pagination, {
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                             'Access-Control-Allow-Origin': '*',
    //                             'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    //                             Authorization: token
    //                         }
    //                     });
    //                     let meetingsData = data?.data;

    //                     if (meetingsData && meetingsData.length > 0) {
    //                         const workbook = new ExcelJS.Workbook();
    //                         const worksheet = workbook.addWorksheet('Meetings List');

    //                         // Define headers
    //                         const headerRow = worksheet.addRow(['Date', 'Title', 'Description', 'Location', 'Start Time', 'End Time', 'Total Invited Members', 'Total Attended Members', 'Status', 'Cancel Reason', 'Created Date', 'Updated Date']);

    //                         // Style header row
    //                         headerRow.eachCell((cell) => {
    //                             cell.fill = {
    //                                 type: 'pattern',
    //                                 pattern: 'solid',
    //                                 fgColor: { argb: 'e4e4e4' }
    //                             };
    //                             cell.font = {
    //                                 color: { argb: '212121' },
    //                                 bold: true
    //                             };
    //                         });

    //                         // Add meeting data rows
    //                         meetingsData.forEach((meeting) => {
    //                             const status = meeting.status === 0 ? 'Open' : meeting.status === 1 ? 'Close' : 'Cancel';

    //                             // Convert HTML description to plain text
    //                             const plainDescription = meeting.description ? new DOMParser().parseFromString(meeting.description, 'text/html').body.textContent.trim() : '-';

    //                             const row = worksheet.addRow([
    //                                 moment(meeting.date).format('DD-MMM-YYYY'),
    //                                 meeting.title || '-',
    //                                 plainDescription,
    //                                 meeting.location || '-',
    //                                 meeting.time ? moment(meeting.time, 'hh:mm:ss A').format('hh:mm A') : '-',
    //                                 meeting.end_time ? moment(meeting.end_time, 'hh:mm:ss A').format('hh:mm A') : '-',
    //                                 meeting.invited_member?.length || 0,
    //                                 meeting.attended_member?.length || 0,
    //                                 status,
    //                                 meeting.reason || '-',
    //                                 moment(meeting.created_at).format('DD-MMM-YYYY, hh:mm A'),
    //                                 moment(meeting.updated_at).format('DD-MMM-YYYY, hh:mm A')
    //                             ]);

    //                             // Add alternating row colors for better readability
    //                             row.eachCell((cell) => {
    //                                 cell.alignment = { vertical: 'middle', horizontal: 'left' };
    //                             });
    //                         });

    //                         // Auto-fit columns
    //                         worksheet.columns.forEach((column) => {
    //                             let maxLength = 0;
    //                             column.eachCell({ includeEmpty: true }, (cell) => {
    //                                 const columnLength = cell.value ? cell.value.toString().length : 10;
    //                                 if (columnLength > maxLength) {
    //                                     maxLength = columnLength;
    //                                 }
    //                             });
    //                             column.width = Math.min(maxLength + 2, 50); // Cap width at 50 characters
    //                         });

    //                         // Generate and download Excel file
    //                         workbook.xlsx
    //                             .writeBuffer()
    //                             .then((buffer) => {
    //                                 const blob = new Blob([buffer], {
    //                                     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    //                                 });
    //                                 const url = window.URL.createObjectURL(blob);
    //                                 const a = document.createElement('a');
    //                                 a.href = url;
    //                                 a.download = 'meetings_list.xlsx';
    //                                 a.click();
    //                                 window.URL.revokeObjectURL(url);
    //                             })
    //                             .catch((err) => {
    //                                 console.error('Error generating Excel file:', err);
    //                                 toast.current.show({
    //                                     severity: 'error',
    //                                     summary: 'Error',
    //                                     detail: 'Failed to generate Excel file',
    //                                     life: 3000
    //                                 });
    //                             });
    //                     }
    //                 }}
    //             />
    //             <Button
    //                 label="Create Meeting"
    //                 icon="pi pi-plus"
    //                 className="p-button-outlined p-button-success mr-2"
    //                 onClick={() => {
    //                     navigate('/property-management/meeting/meeting-create');
    //                 }}
    //             />
    //         </React.Fragment>
    //     );
    // };
    // Inside rightToolbarTemplate function
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={meetinglist?.meeting_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        try {
                            const { data } = await axios.post(`${BASE_URL_API}/society-meeting/excel`, pagination, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                    Authorization: token
                                }
                            });

                            if (data?.error === false && data?.data && data?.data.length > 0) {
                                const meetingsData = data.data;
                                const workbook = new ExcelJS.Workbook();
                                const worksheet = workbook.addWorksheet('Meetings List');

                                // Define headers
                                const headerRow = worksheet.addRow(['Title', 'Description', 'Date', 'Start Time', 'End Time', 'Location', 'Invited Members', 'Attended Members', 'Status']);

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
                                    cell.alignment = {
                                        vertical: 'middle',
                                        horizontal: 'left',
                                        wrapText: true
                                    };
                                });

                                // Add meeting data rows
                                meetingsData.forEach((meeting) => {
                                    // Convert HTML description to plain text
                                    const plainDescription = meeting.description ? new DOMParser().parseFromString(meeting.description, 'text/html').body.textContent.trim() : '-';

                                    // Format invited members list
                                    const invitedMembers = meeting.invited_member && meeting.invited_member.length > 0 ? meeting.invited_member.map((member) => member.name).join(', ') : '-';

                                    // Format attended members list
                                    const attendedMembers = meeting.attended_member && meeting.attended_member.length > 0 ? meeting.attended_member.map((member) => member.name).join(', ') : '-';

                                    // Get status text
                                    const status = meeting.status === 0 ? 'Open' : meeting.status === 1 ? 'Close' : meeting.status === 2 ? 'Cancel' : '-';

                                    const row = worksheet.addRow([
                                        meeting.title || '-',
                                        plainDescription,
                                        moment(meeting.date).format('DD-MMM-YYYY'),
                                        meeting.time || '-',
                                        meeting.end_time || '-',
                                        meeting.location || '-',
                                        invitedMembers,
                                        attendedMembers,
                                        status
                                    ]);

                                    // Style data rows
                                    row.eachCell((cell) => {
                                        cell.alignment = {
                                            vertical: 'middle',
                                            horizontal: 'left',
                                            wrapText: true
                                        };
                                    });
                                });

                                // Auto-fit columns with maximum width limit
                                worksheet.columns.forEach((column) => {
                                    let maxLength = 0;
                                    column.eachCell({ includeEmpty: true }, (cell) => {
                                        const columnLength = cell.value ? cell.value.toString().length : 10;
                                        if (columnLength > maxLength) {
                                            maxLength = columnLength;
                                        }
                                    });
                                    column.width = Math.min(maxLength + 2, 50); // Cap width at 50 characters
                                });

                                // Generate and download Excel file
                                workbook.xlsx.writeBuffer().then((buffer) => {
                                    const blob = new Blob([buffer], {
                                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                    });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'meetings_list.xlsx';
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                });
                            }
                        } catch (error) {
                            console.error('Error exporting Excel:', error);
                        }
                    }}
                />
                <Button
                    label="Create Meeting"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2"
                    onClick={() => {
                        navigate('/property-management/meeting/meeting-create');
                    }}
                />
            </React.Fragment>
        );
    };
    const centerToolbarTemplate = () => {
        return (
            <React.Fragment>
                <SelectButton
                    value={pagination?.listType === 0 ? 'Open' : pagination?.listType === 1 ? 'Close' : 'Cancel'}
                    onChange={(e) => {
                        if (e.value !== null) {
                            let paginationData = { ...pagination };
                            paginationData.listType = e.value === 'Open' ? 0 : e.value === 'Close' ? 1 : 2;
                            setPagination(paginationData);
                            callMeetingList(paginationData);
                            // if (e.value === "All") {
                            //     paginationData.is_complaint_approved_by_chairman = "All" // Remove the filter to get all data
                            // } else {
                            //     paginationData.is_complaint_approved_by_chairman = e.value === "In Progress" ? 1 : e.value === "Close" ? 2 : 0;
                            // }

                            // callGetComplaintsData(paginationData);
                            // setPagination(paginationData);
                            // setSelecterTab(e.value);
                        }
                    }}
                    options={['Open', 'Close', 'Cancel']}
                    className="ml-4"
                />
            </React.Fragment>
        );
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} center={centerToolbarTemplate} end={getRoles('create') && rightToolbarTemplate}></Toolbar>;
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
        callMeetingList(paginationData);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/meeting/meeting-view/${rowData._id}`)} />

                {getRoles('update') && rowData.status === 0 && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text  p-button-help"
                        onClick={() => {
                            navigate(`/property-management/meeting/meeting-edit/${rowData._id}`);
                        }}
                    />
                )}
                {getRoles('delete') && rowData.status === 0 && (
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
                    />
                )}
            </div>
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
                        // dispatch(announcementRemoveRequest(deleteId));
                        // setDeleteModal(false);
                        // setDeleteId(null);
                        // dispatch(getAnnouncementData());
                        dispatch(removeMeeting(deleteId._id));
                        setDeleteModal(false);
                        setDeleteId(null);
                        setSumValue(null);
                        setSumValueError('');
                        // dispatch(getAnnouncementData());
                    } else {
                        setSumValueError('Wrong Answer!');
                    }
                }}
            />
        </>
    );

    const convertDate = (dateStr) => {
        try {
            // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            // const [day, month, year] = dateStr.split('/');
            // const date = new Date(`${year}-${month}-${day}`);
            // const formattedDate = `${day}-${monthNames[date.getMonth()]}-${year}`;
            const formattedDate = moment(dateStr).format('D MMM YYYY');
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };
    // console.log(getRoles("update", true), "dfkdkhfkzxc");

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Meetings</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {meetinglist?.meeting_listing && meetinglist?.meeting_listing.length > 0 ? (
                        <DataTable
                            value={meetinglist?.meeting_listing ? meetinglist?.meeting_listing : []}
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
                                callMeetingList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            <Column field="date" headerStyle={{ width: '8%', minWidth: '6rem' }} header="Date" sortable body={(rowData) => (rowData.date ? convertDate(rowData.date) : '-')}></Column>
                            <Column field="title" header="Title" headerStyle={{ width: '15%', minWidth: '6rem' }} className="capitalize-first-letter" sortable></Column>
                            <Column field="location" header="Venue" headerStyle={{ width: '10%', minWidth: '6rem' }} className="capitalize-first-letter" sortable></Column>
                            <Column field="time" header="Start Time" sortable body={(rowData) => (rowData?.time ? moment(rowData?.time, 'hh:mm:ss A').format('hh:mm A') : '-')}></Column>
                            <Column field="end_time" header="End Time" sortable body={(rowData) => (rowData?.end_time ? moment(rowData?.end_time, 'hh:mm:ss A').format('hh:mm A') : '-')}></Column>
                            <Column
                                field="description"
                                header="Description"
                                className="capitalize-first-letter wrap-text text-container"
                                body={(rowData) => {
                                    const plainText = rowData.description
                                        .replace(/<\/?[^>]+(>|$)/g, ' ')
                                        .replace(/&nbsp;/g, ' ')
                                        .replace(/\s+/g, ' ')
                                        .trim();

                                    return limitTextTo15Words(plainText);
                                }}
                            />
                            <Column
                                field="Status"
                                header="Status"
                                body={(rowData) => (
                                    <>
                                        {getRoles('update', true) && rowData?.status === 0 ? (
                                            <div className="solid_border_drop">
                                                <Dropdown
                                                    value={rowData?.status || 0}
                                                    options={
                                                        rowData?.attended_member.length > 0 && rowData?.agenda.length > 0
                                                            ? [
                                                                  { label: 'Open', value: 0 },
                                                                  { label: 'Close', value: 1 }
                                                              ]
                                                            : [
                                                                  { label: 'Open', value: 0 },
                                                                  { label: 'Close', value: 1 },
                                                                  { label: 'Cancel', value: 2 }
                                                              ]
                                                    }
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    onChange={(e) => {
                                                        if (e.target.value !== null) {
                                                            if (e.target.value === 1) {
                                                                if (rowData?.attended_member.length > 0 && rowData?.agenda.length > 0) {
                                                                    dispatch(meetingStatusUpdateRequest(rowData?._id, { status_type: 1 }));
                                                                } else {
                                                                    setCloseMeetingError(rowData); // New Error Handling
                                                                }
                                                            }
                                                            if (e.target.value === 2) {
                                                                setCancelMeeting(rowData);
                                                                setRemark('');
                                                                serRemarkError(false);
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        width: '120px', // Fixed width for consistent size
                                                        minWidth: '120px',
                                                        background: 'transparent'
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="p-2 my-2 text-center"
                                                style={{
                                                    color: rowData?.status === 0 ? '#322fd3' : rowData?.status === 1 ? '#689f38' : '#d32f2f',
                                                    border: `2px solid ${rowData?.status === 0 ? '#322fd3' : rowData?.status === 1 ? '#689f38' : '#d32f2f'}`,
                                                    borderRadius: '5px',
                                                    width: '120px', // Matches Dropdown width
                                                    minWidth: '120px',
                                                    textAlign: 'center', // Ensures text is centered
                                                    background: 'transparent'
                                                }}
                                            >
                                                {rowData?.status === 0 ? 'Open' : rowData?.status === 1 ? 'Close' : 'Cancel'}
                                            </div>
                                        )}
                                    </>
                                )}
                            ></Column>
                            <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{meetinglist?.meeting_listing && meetinglist?.meeting_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {meetinglist?.meeting_listing && meetinglist?.meeting_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {meetinglist?.totalRecords > 10 && <Paginator template={template} first={first} rows={rows} totalRecords={meetinglist?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>}

                    {closeMeetingError && (
                        <Dialog
                            draggable={false}
                            visible={closeMeetingError !== null}
                            header="Unable to Close Meeting"
                            style={{ width: '30vw', borderRadius: '8px' }}
                            closable={false}
                            footer={false}
                            icons={
                                <div className="flex align-items-center justify-content-center" style={{ width: '2rem', height: '2rem', cursor: 'pointer' }}>
                                    <X color={'#ffff'} size={20} className="cursor-pointer" onClick={() => setCloseMeetingError(null)} />
                                </div>
                            }
                            modal
                            className="p-fluid"
                            onHide={() => setCloseMeetingError(null)}
                            headerStyle={{
                                backgroundColor: '#d32f2f',
                                color: '#fff',
                                borderRadius: '8px 8px 0 0',
                                padding: '15px'
                            }}
                        >
                            <div className="w-full mt-4 text-center">
                                <p className="mb-5 text-lg font-semibold text-left">You cannot close this meeting because it is missing the required information.</p>
                                <div className="mb-5">
                                    {closeMeetingError?.attended_member.length === 0 && (
                                        <div className="flex items-center mb-3 text-lg text-red-700">
                                            <i className="pi pi-user text-xl mr-2"></i>
                                            Attended Members are missing.
                                        </div>
                                    )}
                                    {closeMeetingError?.agenda.length === 0 && (
                                        <div className="flex items-center mb-3 text-lg text-red-700">
                                            <i className="pi pi-list text-xl mr-2"></i>
                                            Meeting Agenda is missing.
                                        </div>
                                    )}
                                </div>
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end gap-2">
                                    <Button
                                        label="Cancel"
                                        // icon="pi pi-times"
                                        className="p-button-outlined p-button-danger text-base mr-2 mb-2"
                                        onClick={() => setCloseMeetingError(null)}
                                        style={{ width: '100px' }}
                                    />
                                    <Button
                                        label="Add"
                                        // icon="pi pi-pencil"
                                        className="p-button-outlined p-button-success text-base mr-2 mb-2"
                                        onClick={() => {
                                            navigate(`/property-management/meeting/meeting-edit/${closeMeetingError._id}?fromList=true`);
                                            setCloseMeetingError(null);
                                        }}
                                        style={{ width: '100px' }}
                                    />
                                </div>
                            </div>
                        </Dialog>
                    )}

                    {cancelMeeting !== null && (
                        <Dialog
                            draggable={false}
                            visible={cancelMeeting !== null}
                            header="Meeting Cancel"
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
                                            setCancelMeeting(null);
                                            serRemarkError(false);
                                        }}
                                    />
                                </div>
                            }
                            modal
                            className="p-fluid"
                            onHide={() => {
                                setCancelMeeting(null);
                                serRemarkError(false);
                            }}
                            headerStyle={{ backgroundColor: '#d32f2f', color: '#fff' }}
                        >
                            <div className="w-full mt-3">
                                <div className="card">
                                    <div className="py-2">
                                        <div className="text-500 font-medium">{'Date'}</div>
                                        <div className="text-900 mt-1">{convertDate(cancelMeeting?.date)}</div>
                                    </div>
                                    <div className="py-2">
                                        <div className="text-500 font-medium">{'Title'}</div>
                                        <div className="text-900 mt-1">{cancelMeeting?.title}</div>
                                    </div>
                                    <div className="py-2">
                                        <div className="text-500 font-medium">{'Location'}</div>
                                        <div className="text-900 mt-1">{cancelMeeting?.location}</div>
                                    </div>
                                    <div className="py-2">
                                        <div className="text-500 font-medium">{'Description'}</div>
                                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{cancelMeeting?.description ? new DOMParser().parseFromString(cancelMeeting.description, 'text/html').body.textContent.trim() : '-'}</div>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="remark" className="required">
                                        Reason
                                    </label>
                                </div>
                                <InputTextarea
                                    rows="2"
                                    id="remark"
                                    name="remark"
                                    placeholder="Enter Reason"
                                    value={remark}
                                    onChange={(e) => {
                                        setRemark(e.target.value);
                                        serRemarkError(false);
                                    }}
                                    className={classNames({ 'p-invalid': remarkError })}
                                    style={{ resize: 'none' }}
                                />

                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end mt-2">
                                    <Button
                                        label="No"
                                        icon="pi pi-times"
                                        className="p-button-outlined p-button-danger mr-2 mb-2 w-5rem"
                                        onClick={() => {
                                            setCancelMeeting(null);
                                            serRemarkError(false);
                                        }}
                                    />
                                    <Button
                                        label="Yes"
                                        icon="pi pi-check"
                                        className="p-button-outlined p-button-success mr-2 mb-2 w-5rem"
                                        onClick={() => {
                                            if (remark !== '') {
                                                dispatch(meetingStatusUpdateRequest(cancelMeeting?._id, { status_type: 2, reason: remark }));
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
                        modalDescription="Are you sure you want to delete this Meeting?"
                    />
                </div>
            </div>
        </div>
    );
};
export default Meeting;
