import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import { getEventList, removeEvent } from '../../../../redux/slice/AdminSlices/eventSlice';
import moment from 'moment-timezone';
import { FilePdfOutlined } from '@ant-design/icons';
import { limitTextTo15Words } from '../../../../components/Moment';
import axios from 'axios';
import * as ExcelJS from 'exceljs';

const Event = () => {
    const { Button, Column, DataTable, InputText, Image, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const { token,loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isDelete, isLoading, eventlist } = useSelector((state) => state.event);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [numValues, setNumValues] = useState({ num1: 0, num2: 0 });
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'event_date', order: 1 }]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: ''
    });
    const breadcrumbItems = [
        {
            label: 'Events'
        }
    ];
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };
    useEffect(() => {
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        setDeleteModal(false);

        callEventList(paginationData);
    }, [dispatch, isCreated, isDelete]);
    const getRoles = (permissionName, val) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== 'User') : loginDetails?.role_permissions;
                dataColl.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'event')?.module_access.findIndex((y) => y === permissionName);
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
    const callEventList = (val) => {
        try {
            dispatch(getEventList(val));
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
        callEventList(paginationData);
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = eventlist?.event_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Event Name, Venue" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
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

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={eventlist?.event_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        const { data } = await axios.post(`${BASE_URL}/event/exportExcel`, pagination, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                Authorization: token
                            }
                        });
                        let eventData = data?.data;

                        if (eventData && eventData.length > 0) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Events List');

                            // Define headers for vendors including profile image
                            const headerRow = worksheet.addRow([
                                'Event Name',
                                "Date",
                                "Time",
                                'Location',
                                'Description',
                                'Image',
                                'Created Date',
                                'Updated Date',
                            ]);

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

                            // Add vendor data rows
                            eventData.forEach((vendor) => {
                                // Convert HTML description to plain text
                                const plainDescription = vendor.description ? new DOMParser().parseFromString(vendor.description, 'text/html').body.textContent.trim() : '-';

                                const row = worksheet.addRow([
                                    vendor.event_name || '-',
                                    vendor.event_date || '-',
                                    vendor.event_time || '-',
                                    vendor.location || '-',
                                    plainDescription,
                                    vendor.event_img || '-',
                                    moment(vendor.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(vendor.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                ]);

                                // Add hyperlink for profile image URL
                                if (vendor.event_img) {
                                    const imageCell = row.getCell(6);
                                    // Set the cell's value and properties
                                    imageCell.value = {
                                        text: vendor.event_img,
                                        hyperlink: vendor.event_img
                                    };
                                    imageCell.font = {
                                        color: { argb: '0000FF' },
                                        underline: true
                                    };
                                }
                            });

                            // Auto-fit columns
                            worksheet.columns.forEach((column) => {
                                column.width = 25;
                            });

                            // Make the profile image URL column wider to accommodate long URLs
                            worksheet.getColumn(1).width = 40;

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
                                    a.download = 'events_list.xlsx';
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
                    label="Add Event"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2 "
                    onClick={() => {
                        navigate('/property-management/event/event-create');
                    }}
                />
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };
    // const rightToolbarTemplate = () => {
    //     return (
    //         <React.Fragment>
    //             <Button
    //                 disabled={eventlist?.event_listing.length === 0}
    //                 label="Export"
    //                 icon="pi pi-download"
    //                 className="p-button-outlined p-button-help mr-2 my-3 m-auto"
    //                 onClick={async () => {
    //                     try {
    //                         const { data } = await axios.post(
    //                             `${BASE_URL}/event/exportExcel`,
    //                             pagination,
    //                             {
    //                                 headers: {
    //                                     'Content-Type': 'application/json',
    //                                     Authorization: token
    //                                 },
    //                                 // Add timeout and retry options
    //                                 timeout: 30000,
    //                                 retry: 3
    //                             }
    //                         );

    //                         const eventData = data?.data;

    //                         const workbook = new ExcelJS.Workbook();
    //                         const worksheet = workbook.addWorksheet('Events List');

    //                         // Define headers
    //                         const headers = [
    //                             'Event Name',
    //                             "Date",
    //                             "Time",
    //                             'Location',
    //                             'Description',
    //                             'Profile Image URL',
    //                             'Created Date',
    //                             'Updated Date',
    //                         ];

    //                         const headerRow = worksheet.addRow(headers);

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

    //                         // Add event data rows
    //                         eventData.forEach((event) => {
    //                             // Safely convert HTML description to plain text
    //                             let plainDescription = '-';
    //                             try {
    //                                 if (event.description) {
    //                                     plainDescription = new DOMParser()
    //                                         .parseFromString(event.description, 'text/html')
    //                                         .body.textContent.trim();
    //                                 }
    //                             } catch (error) {
    //                                 console.error('Error parsing description:', error);
    //                             }

    //                             const row = worksheet.addRow([
    //                                 event.event_name || '-',
    //                                 event.event_date || '-',
    //                                 event.event_time || '-',
    //                                 event.location || '-',
    //                                 plainDescription,
    //                                 event.file || '-',
    //                                 moment(event.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
    //                                 moment(event.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
    //                             ]);

    //                             // Add hyperlink for profile image URL
    //                             if (event.file) {
    //                                 const imageCell = row.getCell(6);
    //                                 imageCell.value = {
    //                                     text: event.file,
    //                                     hyperlink: event.file
    //                                 };
    //                                 imageCell.font = {
    //                                     color: { argb: '0000FF' },
    //                                     underline: true
    //                                 };
    //                             }
    //                         });

    //                         // Auto-fit columns with max width
    //                         worksheet.columns.forEach((column) => {
    //                             column.width = Math.min(25,
    //                                 Math.max(15, ...eventData.map(event =>
    //                                     String(event[column.key] || '').length
    //                                 ))
    //                             );
    //                         });

    //                         // Make event name column wider
    //                         worksheet.getColumn(1).width = 40;

    //                         // Generate and download Excel file
    //                         const buffer = await workbook.xlsx.writeBuffer();
    //                         const blob = new Blob([buffer], {
    //                             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    //                         });
    //                         const url = window.URL.createObjectURL(blob);
    //                         const a = document.createElement('a');
    //                         a.href = url;
    //                         a.download = `events_list_${moment().format('YYYY-MM-DD')}.xlsx`;
    //                         a.click();
    //                         window.URL.revokeObjectURL(url);
    //                     } catch (error) {
    //                         console.error('Export error:', error);
    //                     }
    //                 }}
    //             />
    //             <Button
    //                 label="Add Event"
    //                 icon="pi pi-plus"
    //                 className="p-button-outlined p-button-success mr-2"
    //                 onClick={() => {
    //                     navigate('/property-management/event/event-create');
    //                 }}
    //             />
    //         </React.Fragment>
    //     );
    // };
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
        callEventList(paginationData);
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
                        navigate(`/property-management/event/event-view/${rowData._id}`);
                    }}
                />
                {getRoles('update') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text  p-button-help"
                        onClick={() => {
                            navigate(`/property-management/event/event-edit/${rowData._id}`);
                        }}
                    />
                )}
                {/* <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-warning p-button-text" id="eyes-icons" /> */}
                {getRoles('delete') && (
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
                        dispatch(removeEvent(deleteId._id));
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
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const [year, month, day] = dateStr.split('-');
            const date = new Date(`${year}-${month}-${day}`);
            const formattedDate = `${day} ${monthNames[date.getMonth()]} ${year}`;
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={getRoles('create') && rightToolbarTemplate}></Toolbar>;
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Events</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {eventlist?.event_listing && eventlist?.event_listing.length > 0 ? (
                        <DataTable
                            value={eventlist?.event_listing ? eventlist?.event_listing : []}
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
                                callEventList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            <Column
                                field="event_image"
                                header="Image/Pdf"
                                body={(rowData) => {
                                    if (rowData?.event_img) {
                                        // Check if the file is a PDF
                                        const isPDF = rowData.event_img.toLowerCase().endsWith('.pdf');

                                        if (isPDF) {
                                            // Display PDF icon
                                            return <FilePdfOutlined style={{ fontSize: '50px', color: 'red' }} />;
                                        } else {
                                            // Display image as before
                                            return <Image src={`${rowData.event_img}`} alt="Image" width="50" height="50" preview />;
                                        }
                                    }
                                    return '-';
                                }}
                                style={{ width: '4rem' }}
                            />
                            {/* <Column field="event_image" header="Image" body={(rowData) => (rowData?.event_img ? <Image src={`${rowData?.event_img}`} alt="Image" width="50" height="50" preview /> : '-')} style={{ width: '4rem' }}></Column> */}
                            <Column field="event_name" className="h-50 capitalize" header="Event Name" headerStyle={{ width: '25%' }} sortable></Column>
                            <Column
                                field="description"
                                header="Description"
                                className="capitalize-first-letter wrap-text text-container"
                                sortable
                                body={(rowData) => {
                                    const plainText = rowData.description
                                        .replace(/<\/?[^>]+(>|$)/g, ' ') // Remove HTML tags
                                        .replace(/&nbsp;/g, ' ') // Replace `&nbsp;` with a space
                                        .replace(/\s+/g, ' ') // Remove extra spaces
                                        .trim(); // Trim leading and trailing spaces+
                                    return limitTextTo15Words(plainText);
                                }}
                            />
                            <Column field="event_date" header="Date" headerStyle={{ width: '10%', minWidth: '7rem' }} sortable body={(rowData) => (rowData.event_date ? convertDate(rowData.event_date) : '-')}></Column>
                            {/* <Column field="event_time" header="Time" sortable body={(rowData) => rowData?.event_time ? moment(rowData?.event_time, "HH:mm:ss").utcOffset("+05:30").format("hh:mm:ss A") : "-"}></Column> */}
                            <Column field="event_time" header="Time" sortable body={(rowData) => (rowData?.event_time ? moment(rowData?.event_time, 'hh:mm:ss A').format('hh:mm A') : '-')}></Column>
                            <Column field="location" className="capitalize" headerStyle={{ width: 'auto' }} header="Venue" sortable></Column>
                            {(getRoles('update') || getRoles('delete')) && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{eventlist?.event_listing && eventlist?.event_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {eventlist?.event_listing && eventlist?.event_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {eventlist?.totalRecords > 10 && <Paginator template={template} first={first} rows={rows} totalRecords={eventlist?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>}
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
                        modalDescription="Are you sure you want to delete this event?"
                    />
                </div>
            </div>
        </div>
    );
};
export default Event;
