import React from 'react';
import components from '../..';
import paper from '../../../../assets/images/No-data-pana.svg';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import moment from 'moment-timezone';
import { getGateKeeperData , GateKeeperRemoveRequest } from '../../../../redux/slice/AdminSlices/getKepperSlice';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
const GateKeeper = () => {
    const { React, SelectButton, DataTable, Column, Paginator, BreadCrumb, Button, Toolbar, InputText, useNavigate, useState, useEffect, useDispatch, useSelector } = components;
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isDelete, generalListData, isLoading } = useSelector((state) => state.gatekeeper);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
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
            dispatch(getGateKeeperData(val));
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
            label: 'Gate Keeper'
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
                    let check = b.permission.find((x) => x.module_name === 'gatekeeper')?.module_access.findIndex((y) => y === permissionName);
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
    // const rightToolbarTemplate = () => {
    //     return (
    //         <React.Fragment>
    //             <Button
    //                 disabled={generalListData?.data?.gatekeeper_listing.length === 0}
    //                 label="Export"
    //                 icon="pi pi-download"
    //                 className="p-button-outlined p-button-help mr-2 my-3 m-auto"
    //                 onClick={async () => {
    //                     const { data } = await axios.post(`${BASE_URL_API}/vendor/excel`, pagination, {
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                             'Access-Control-Allow-Origin': '*',
    //                             'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    //                             Authorization: token
    //                         }
    //                     });
    //                     let vendorData = data?.data;

    //                     if (vendorData && vendorData.length > 0) {
    //                         const workbook = new ExcelJS.Workbook();
    //                         const worksheet = workbook.addWorksheet('vendors List');

    //                         // Define headers for vendors including profile image
    //                         const headerRow = worksheet.addRow([
    //                             'Vendor Name',
    //                             'Work Type',
    //                             'Pincode',
    //                             'Mobile Number',
    //                             'Vendor Address',
    //                             'Description',
    //                             'Profile Image URL',
    //                             'Created Date',
    //                             'Updated Date',
    //                         ]);

    //                         // Style header row
    //                         headerRow.eachCell((cell, number) => {
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

    //                         // Add vendor data rows
    //                         vendorData.forEach((vendor) => {
    //                             // Convert HTML description to plain text
    //                             const plainDescription = vendor.work_description ? new DOMParser().parseFromString(vendor.work_description, 'text/html').body.textContent.trim() : '-';

    //                             const row = worksheet.addRow([
    //                                 vendor.name || '-',
    //                                 vendor.work_type || '-',
    //                                 vendor.pincode || '-',
    //                                 vendor.mobile_number || '-',
    //                                 vendor.vendor_address || '-',
    //                                 plainDescription,
    //                                 vendor.vendor_profile_image || '-',
    //                                 moment(vendor.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
    //                                 moment(vendor.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
    //                             ]);

    //                             // Add hyperlink for profile image URL
    //                             if (vendor.vendor_profile_image) {
    //                                 const imageCell = row.getCell(7);
    //                                 // Set the cell's value and properties
    //                                 imageCell.value = {
    //                                     text: vendor.vendor_profile_image,
    //                                     hyperlink: vendor.vendor_profile_image
    //                                 };
    //                                 imageCell.font = {
    //                                     color: { argb: '0000FF' },
    //                                     underline: true
    //                                 };
    //                             }

    //                             // Style status cell (keeping existing styling)
    //                             const statusCell = row.getCell(3);
    //                             const status = vendor.is_vendor_approved_by_chairman;
    //                             if (status === 0) {
    //                                 statusCell.font = {
    //                                     color: { argb: 'd32f2f' },
    //                                     bold: true
    //                                 };
    //                             } else if (status === 1) {
    //                                 statusCell.font = {
    //                                     color: { argb: 'f5c308' },
    //                                     bold: true
    //                                 };
    //                             } else if (status === 2) {
    //                                 statusCell.font = {
    //                                     color: { argb: '689f38' },
    //                                     bold: true
    //                                 };
    //                             }
    //                         });

    //                         // Auto-fit columns
    //                         worksheet.columns.forEach((column) => {
    //                             column.width = 25;
    //                         });

    //                         // Make the profile image URL column wider to accommodate long URLs
    //                         worksheet.getColumn(1).width = 40;

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
    //                                 a.download = 'vendors_list.xlsx';
    //                                 a.click();
    //                                 window.URL.revokeObjectURL(url);
    //                             })
    //                             .catch((err) => {
    //                                 console.error('Error generating Excel file:', err);
    //                             });
    //                     }
    //                 }}
    //             />
    //             <Button
    //                 label="Add Gate Kepper"
    //                 icon="pi pi-plus"
    //                 className="p-button-outlined p-button-success mr-2"
    //                 // onClick={() => setModal(true)}
    //                 onClick={() => navigate(`/property-management/gate-keeper/gate-keeper-create`)}
    //             />
    //             {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
    //         </React.Fragment>
    //     );
    // };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={generalListData?.data?.gatekeeper_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        const { data } = await axios.post(`${BASE_URL_API}/gatekeeper/excel`, pagination, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                Authorization: token
                            }
                        });
                        let gatekeeperData = data?.data;

                        if (gatekeeperData && gatekeeperData.length > 0) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Gatekeeper List');

                            // Define headers for gatekeeper data
                            const headerRow = worksheet.addRow([
                                'Name',
                                'Mobile Number',
                                'Email',
                                'Start Date',
                                'End Date',
                                'Shift Type',
                                'Profile Image URL',
                                'ID Proofs',
                                'Created Date',
                                'Updated Date'
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

                            // Add gatekeeper data rows
                            gatekeeperData.forEach((gatekeeper) => {
                                // Format ID proofs array into a string with line breaks
                                const idProofsFormatted = gatekeeper.id_proof && Array.isArray(gatekeeper.id_proof)
                                    ? gatekeeper.id_proof.map((proof, index) => `${index + 1}. ${proof}`).join('\n')
                                    : '-';

                                const row = worksheet.addRow([
                                    gatekeeper.name || '-',
                                    gatekeeper.mobile_number || '-',
                                    gatekeeper.email || '-',
                                    gatekeeper.start_date || '-',
                                    gatekeeper.end_date || '-',
                                    gatekeeper.shift_type || '-',
                                    gatekeeper.profile || '-',
                                    idProofsFormatted,
                                    moment(gatekeeper.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(gatekeeper.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                ]);

                                // Add hyperlink for profile image URL
                                if (gatekeeper.profile) {
                                    const profileCell = row.getCell(7);
                                    profileCell.value = {
                                        text: gatekeeper.profile,
                                        hyperlink: gatekeeper.profile
                                    };
                                    profileCell.font = {
                                        color: { argb: '0000FF' },
                                        underline: true
                                    };
                                }

                                // Style and format the ID proofs cell
                                if (gatekeeper.id_proof && Array.isArray(gatekeeper.id_proof)) {
                                    const idProofsCell = row.getCell(8);
                                    idProofsCell.alignment = {
                                        wrapText: true,
                                        vertical: 'top'
                                    };

                                    // Apply hyperlinks to each ID proof URL
                                    const richText = {
                                        richText: gatekeeper.id_proof.map((proof, index) => ({
                                            text: `${index + 1}. ${proof}\n`,
                                            font: {
                                                color: { argb: '0000FF' },
                                                underline: true
                                            },
                                            hyperlink: proof
                                        }))
                                    };
                                    idProofsCell.value = richText;
                                }

                                // Set row height to accommodate multiple ID proofs
                                row.height = gatekeeper.id_proof && Array.isArray(gatekeeper.id_proof)
                                    ? Math.max(25, gatekeeper.id_proof.length * 15)
                                    : 25;
                            });

                            // Auto-fit columns
                            worksheet.columns.forEach((column, index) => {
                                if (index === 7 || index === 8) {
                                    // Make URL columns wider
                                    column.width = 45;
                                } else {
                                    column.width = 25;
                                }
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
                                    a.download = 'gatekeeper_list.xlsx';
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
                    label="Add Gate Keeper"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2"
                    onClick={() => navigate(`/property-management/gate-keeper/gate-keeper-create`)}
                />
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
        const isSearchDisabled = generalListData?.data?.gatekeeper_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Member Name, Role, Mobile No., Email" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
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

    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={getRoles('create') && rightToolbarTemplate}></Toolbar>;
    const actionBodyTemplate = (rowData) => {
        console.log('rowData: ', rowData);
        return (
            <div className="actions flex justify-content-center">
                <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/gate-keeper/gate-keeper-view/${rowData?._id}`)} />
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
                    // onClick={() => navigate(`/property-management/general-core-members/general-core-members-edit/${rowData?.role_details_array[0]._id}/${rowData?._id}`)}
                    onClick={() => navigate(`/property-management/gate-keeper/gate-keeper-edit/${rowData?._id}`)}
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
                        setDeleteId(  rowData._id);
                        dynamicNumber();
                    }}
                />
            </div>
        );
    };

    console.log(deleteId , ":deleteId");
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
                                dispatch(GateKeeperRemoveRequest(deleteId));
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{'Gate Keeper'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0 mt-3">
                <div className="col-12 card">
                    {generalListData?.data?.gatekeeper_listing && generalListData?.data?.gatekeeper_listing.length > 0 ? (
                        <DataTable
                            value={generalListData?.data?.gatekeeper_listing}
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
                            {/* <Column field="profile" header="Image" body={(rowData) => (rowData?.vehicle_image ? <Image src={`${rowData?.vehicle_image}`} alt="Image" width="50" height="50" preview /> : '-')} style={{ width: '4rem' }}></Column> */}
                            <Column field="name" className="h-50 capitalize" header="Name" sortable></Column>
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
                            <Column field="email" header="Email" body={(rowData) => (rowData?.email ? <a href={`mailto:${rowData?.email}`}>{rowData?.email}</a> : '-')} sortable></Column>
                            <Column field="start_date" header="Start Date" body={(rowData) => (rowData?.start_date !== 'Invalid date' ? rowData?.start_date : '-')} sortable></Column>
                            <Column field="end_date" header="End Date" body={(rowData) => (rowData?.end_date !== 'Invalid date' ? rowData?.end_date : '-')} sortable></Column>
                            <Column field="shift_type" header="Shift Type" body={(rowData) => rowData?.shift_type || '-'} sortable></Column>

                            {getRoles('update') && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{generalListData?.data?.gatekeeper_listing && generalListData?.data?.gatekeeper_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {generalListData?.data?.gatekeeper_listing && generalListData?.data?.gatekeeper_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {generalListData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={generalListData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
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
                        modalDescription={'Are you sure you want to delete gate-keeper?'}
                    />
                </div>
            </div>
        </div>
    );
};
export default GateKeeper;
