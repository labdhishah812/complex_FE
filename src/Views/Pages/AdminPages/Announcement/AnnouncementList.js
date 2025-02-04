import components from '../..';
// import jwtDecode from 'jwt-decode';
import AnnouncementModel from './AnnouncementModel';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
// import moment from 'moment';
import moment from 'moment-timezone';
import { getAnnouncementData, announcementRemoveRequest } from '../../../../redux/slice/AdminSlices/announcementSlice';
import { limitTextTo15Words } from '../../../../components/Moment';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
const AnnouncementList = () => {
    const { Toolbar, InputText, Button, DataTable, Paginator, Column, Image, React, useNavigate, BreadCrumb, useState, useDispatch, useSelector, useEffect } = components;
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isDelete, isLoading, announcementData } = useSelector((store) => store.announcement);
    const [decode, setDecode] = useState(null);
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [numValues, setNumValues] = useState({ num1: 0, num2: 0 });
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [editData, steEdit] = useState(null);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    //const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'expire_in', order: 1 }]);
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
            navigate(`/property-management/dashboard`);
            // decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //     decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //     navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Announcements'
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
        callAnnouncementList(paginationData);
    }, [dispatch, isCreated, isDelete]);
    // const decodeURI = async () => {
    //     try {
    //         let decodeData = await jwtDecode(token);
    //         setDecode(decodeData);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const callAnnouncementList = (val) => {
        try {
            dispatch(getAnnouncementData(val));
        } catch (error) {
            console.log(error);
        }
    };
    const getRoles = (permissionName, val) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== 'User') : loginDetails?.role_permissions;
                dataColl.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'announcement')?.module_access.findIndex((y) => y === permissionName);
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
            callAnnouncementList(paginationData);
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
                        navigate(`/property-management/announcements/announcement-view/${rowData._id}`);
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
                            navigate(`/property-management/announcements/announcement-edit/${rowData?._id}`);
                            // setModal(true);
                            // steEdit(rowData);
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
                        dispatch(announcementRemoveRequest(deleteId._id));
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
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={announcementData?.data?.announcement_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        // Use the data directly from the component state
                        const announcements = announcementData?.data?.announcement_listing;

                        if (announcements && announcements.length > 0) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Announcements List');

                            // Define headers for announcements
                            const headerRow = worksheet.addRow(['Title', 'Description', 'Block', 'Start Date', 'End Date', 'Occasion Date', 'Image', 'Created Date', 'Updated Date']);

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

                            // Add announcement data rows
                            announcements.forEach((announcement) => {
                                // Convert HTML description to plain text
                                const plainDescription = announcement.description ? new DOMParser().parseFromString(announcement.description, 'text/html').body.textContent.trim() : '-';

                                // Format block name
                                const blockName = announcement.block_name ? `${announcement.block_name}${announcement?.property_assign_type === 'Shopping' ? ' (Shopping)' : ''}` : 'All';

                                const row = worksheet.addRow([
                                    announcement.title || '-',
                                    plainDescription,
                                    blockName,
                                    announcement.start_date ? moment(announcement.start_date).utcOffset('+05:30').format('DD-MMM-YYYY') : '-',
                                    announcement.end_date ? moment(announcement.end_date).utcOffset('+05:30').format('DD-MMM-YYYY') : '-',
                                    announcement.expire_in ? moment(announcement.expire_in).utcOffset('+05:30').format('DD-MMM-YYYY') : '-',
                                    moment(announcement.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(announcement.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                ]);

                                 // Add hyperlink for profile image URL
                                 if (announcement.bannerImg) {
                                    const imageCell = row.getCell(7);
                                    // Set the cell's value and properties
                                    imageCell.value = {
                                        text: announcement.bannerImg,
                                        hyperlink: announcement.bannerImg
                                    };
                                    imageCell.font = {
                                        color: { argb: '0000FF' },
                                        underline: true
                                    };
                                }


                                // Apply word wrap to description column
                                row.getCell(2).alignment = { wrapText: true };
                            });

                            // Optimize column widths
                            worksheet.columns.forEach((column, index) => {
                                // Set specific widths for different columns
                                switch (index) {
                                    case 0: // Title
                                        column.width = 30;
                                        break;
                                    case 1: // Description
                                        column.width = 50;
                                        break;
                                    case 2: // Block
                                        column.width = 20;
                                        break;
                                    default: // Dates and other columns
                                        column.width = 25;
                                }
                            });
                            worksheet.getColumn(1).width = 40;

                            try {
                                // Generate and download Excel file
                                const buffer = await workbook.xlsx.writeBuffer();
                                const blob = new Blob([buffer], {
                                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'announcements_list.xlsx';
                                a.click();
                                window.URL.revokeObjectURL(url);
                            } catch (err) {
                                console.error('Error generating Excel file:', err);
                            }
                        }
                    }}
                />
                <Button
                    label="Announcement"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2 my-3"
                    onClick={() => {
                        navigate(`/property-management/announcements/announcement-create`);
                    }}
                />
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = announcementData?.data?.announcement_listing.length == 0 && pagination?.search === '';
        return (
            <React.Fragment>
                {/* {(pagination.search || (announcementData && announcementData.length > 0)) && ( */}
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search By Title, Description" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
                        {/* <InputText placeholder="Search By Title, Description" type='search' value={pagination?.search} onChange={(e) => onSearch(e.target.value)} style={{ width: "20rem" }} /> */}
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
                {/* )} */}
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
        callAnnouncementList(paginationData);
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={getRoles('create') && rightToolbarTemplate}></Toolbar>;
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
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row  w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Announcements</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {/* {getRoles('create') && (
                        <div className="flex justify-content-end">
                            <Button
                                label="Announcement"
                                icon="pi pi-plus"
                                className="p-button-outlined p-button-success mr-2 my-3"
                                onClick={() => {
                                    navigate(`/property-management/announcements/announcement-create`)
                                }}
                            />
                        </div>
                    )} */}
                    {announcementData?.data?.announcement_listing && announcementData?.data?.announcement_listing.length > 0 ? (
                        <DataTable
                            value={announcementData?.data?.announcement_listing}
                            showGridlines
                            stripedRows
                            dataKey="id"
                            emptyMessage="No Record Found."
                            header={header}
                            scroll="scroll"
                            tableStyle={{ minWidth: '60rem' }}
                            sortMode="multiple"
                            // size="large"
                            onSort={(e) => {
                                let paginationData = { ...pagination };
                                paginationData.order_column = e.multiSortMeta[0]['field'];
                                paginationData.order_direction = e.multiSortMeta[0]['order'];
                                setPagination(paginationData);
                                setMultiSortMeta(e.multiSortMeta);
                                callAnnouncementList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                            className={`${loginDetails.role_permissions.filter((x) => x.role !== 'User').length === 0 || !getRoles('create') ? 'mt-5' : ''}`}
                        >
                            <Column field="bannerImg" header="Image" body={(rowData) => (rowData?.bannerImg ? <Image src={`${rowData?.bannerImg}`} alt="Image" width="50" height="50" preview /> : '-')} style={{ width: '4rem' }}></Column>
                            <Column field="title" className="capitalize-first-letter" headerStyle={{ width: '25%', minWidth: '8rem' }} header="Title" sortable></Column>
                            {/* <Column field="description" className="capitalize" header="Description" sortable></Column> */}
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
                            <Column field="expire_in" header="Occasion Date" headerStyle={{ width: '10%', minWidth: '11rem' }} sortable body={(rowData) => (rowData.expire_in ? convertDate(rowData.expire_in) : '-')}></Column>
                            <Column field="start_date" header="Start Date" sortable headerStyle={{ width: '10%', minWidth: '9rem' }} body={(rowData) => (rowData.start_date ? convertDate(rowData.start_date) : '-')}></Column>
                            <Column field="end_date" header="End Date" sortable headerStyle={{ width: '8%', minWidth: '9rem' }} body={(rowData) => (rowData.end_date ? convertDate(rowData.end_date) : '-')}></Column>
                            {(loginDetails?.is_block_exist_in_property === true || loginDetails?.is_block_exist_in_shopping_center_property === true) && (
                                <Column
                                    field="block_name"
                                    header="Block"
                                    body={(rowData) => `${rowData.block_name ? rowData.block_name : 'All'} ${rowData?.property_assign_type === 'Shopping' ? '(' + rowData?.property_assign_type + ')' : ''}`}
                                    sortable
                                    headerClassName="text-center" // Center the header text
                                    bodyClassName="text-center" // Center the body content
                                ></Column>
                            )}
                            {(getRoles('create') || getRoles('update')) && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{announcementData?.data?.announcement_listing && announcementData?.data?.announcement_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {announcementData?.data?.announcement_listing && announcementData?.data?.announcement_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {announcementData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={announcementData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
                    )}
                    {modal && (
                        <AnnouncementModel
                            editData={editData}
                            onHide={() => {
                                setModal(false);
                                steEdit(null);
                            }}
                        />
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
                        modalDescription="Are you sure you want to delete this announcement?"
                    />
                </div>
            </div>
        </div>
    );
};

export default AnnouncementList;
