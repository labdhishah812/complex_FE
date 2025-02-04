import components from '../..';
import jwtDecode from 'jwt-decode';
import DeleteModal from '../../../../components/DeleteModal';
import VendorModal from './vendorModal';
import { getVendorData, vendorRemoveRequest } from '../../../../redux/slice/AdminSlices/vendorSlice';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
import moment from 'moment-timezone';

const VendorList = () => {
    const { Button, Column, DataTable, Image, InputText, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { isCreated, isDelete, vendorData, isLoading } = useSelector((state) => state.vendor);
    const { token, loginDetails } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const [decode, setDecode] = useState(null);
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
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
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        search: ''
    });

    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'Vendors'
        }
    ];

    useEffect(() => {
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        decodeURI();
        setPagination(paginationData);
        setModal(false);
        steEdit(null);
        callVendorList(paginationData);
        setSumValue(null);
        setSumValueError('');
    }, [dispatch, isCreated, isDelete]);

    const decodeURI = async () => {
        // Placeholder for decoding logic
    };

    const callVendorList = (val) => {
        try {
            dispatch(getVendorData(val));
        } catch (error) {
            console.log(error);
        }
    };

    const getRoles = (permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'vendor')?.module_access.findIndex((y) => y === permissionName);
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

    const leftToolbarTemplate = () => {
        const isSearchDisabled = vendorData?.data?.vendor_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText
                            placeholder="Search by Name, Work"

                            value={pagination?.search || ''}
                            onChange={(e) => onSearch(e.target.value)}
                            style={{ width: '20rem' }}
                            disabled={isSearchDisabled}
                        />
                    </span>

                    <Button
                        label="Clear"
                        icon="pi pi-filter-slash"
                        className="p-button-outlined w-7rem ml-2"
                        disabled={pagination?.search === ''}
                        onClick={() => {
                            let updatedPagination = { ...pagination };
                            updatedPagination.search = '';
                            setPagination(updatedPagination);
                            onSearch('');
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
                    disabled={vendorData?.data?.vendor_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        const { data } = await axios.post(`${BASE_URL_API}/vendor/excel`, pagination, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                Authorization: token
                            }
                        });
                        let vendorData = data?.data;

                        if (vendorData && vendorData.length > 0) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('vendors List');

                            // Define headers for vendors including profile image
                            const headerRow = worksheet.addRow([
                                'Vendor Name',
                                'Work Type',
                                'Pincode',
                                'Mobile Number',
                                'Vendor Address',
                                'Description',
                                'Profile Image URL',
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
                            vendorData.forEach((vendor) => {
                                // Convert HTML description to plain text
                                const plainDescription = vendor.work_description ? new DOMParser().parseFromString(vendor.work_description, 'text/html').body.textContent.trim() : '-';

                                const row = worksheet.addRow([
                                    vendor.name || '-',
                                    vendor.work_type || '-',
                                    vendor.pincode || '-',
                                    vendor.mobile_number || '-',
                                    vendor.vendor_address || '-',
                                    plainDescription,
                                    vendor.vendor_profile_image || '-',
                                    moment(vendor.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(vendor.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                ]);

                                // Add hyperlink for profile image URL
                                if (vendor.vendor_profile_image) {
                                    const imageCell = row.getCell(7);
                                    // Set the cell's value and properties
                                    imageCell.value = {
                                        text: vendor.vendor_profile_image,
                                        hyperlink: vendor.vendor_profile_image
                                    };
                                    imageCell.font = {
                                        color: { argb: '0000FF' },
                                        underline: true
                                    };
                                }

                                // Style status cell (keeping existing styling)
                                const statusCell = row.getCell(3);
                                const status = vendor.is_vendor_approved_by_chairman;
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
                                    a.download = 'vendors_list.xlsx';
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
                    label="Create Vendor"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2"
                    onClick={() => {
                        navigate('/property-management/vendor/vendor-add');
                    }}
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
        callVendorList(paginationData);
    };

    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={decode?.role !== 'User' && getRoles('create') && rightToolbarTemplate}></Toolbar>;

    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        let paginationData = pagination;
        paginationData.current_page = event?.page + 1;
        paginationData.per_page = event?.rows;
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        callVendorList(paginationData);
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
                {/* View Button */}
                <Button
                    tooltip="View"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text"
                    id="eyes-icons"
                    onClick={() => {
                        navigate(`/property-management/vendor/vendor-view/${rowData._id}`);
                    }}
                />
                {getRoles('update') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text p-button-help mr-1"
                        onClick={() => {
                            navigate(`/property-management/vendor/vendor-edit/${rowData._id}`);
                        }}
                    />
                )}
                {getRoles('delete') && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text p-button-danger"
                        id="delete-icons"
                        tooltip="Delete"
                        tooltipOptions={{ position: 'bottom' }}
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
                                dispatch(vendorRemoveRequest(deleteId));
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Vendors</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {vendorData?.data?.vendor_listing && vendorData?.data?.vendor_listing.length > 0 ? (
                        <DataTable
                            value={vendorData?.data?.vendor_listing}
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
                                callVendorList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            <Column
                                field="vendor_profile_image"
                                header="Image"
                                body={(rowData) => (rowData?.vendor_profile_image ? <Image src={`${rowData?.vendor_profile_image}`} alt="Image" width="50" height="50" preview /> : '-')}
                                // style={{ width: '10rem' }}
                            ></Column>
                            <Column field="name" className="capitalize-first-letter" style={{ width: '10%', minWidth: '10rem' }} header="Name" sortable></Column>
                            <Column field="work_type" className="capitalize-first-letter" header="Occupation" sortable></Column>
                            <Column field="mobile_number" className="headerCellEnd" header="Contact No." body={(rowData) => <div className="text-right"><a href={`tel:${rowData?.mobile_number}`} className='hover:underline'>{rowData?.mobile_number}</a></div>}></Column>
                            <Column field="pincode" className="headerCellEnd" header="Pincode" body={(rowData) => <div className="text-right">{rowData?.pincode}</div>} headerStyle={{ textAlign: 'right' }}></Column>
                            {/* <Column field="work_description" className="capitalize" header="Description" sortable></Column> */}
                            <Column
                                field="work_description"
                                header="Description"
                                sortable
                                className='capitalize-first-letter wrap-text text-container'
                                body={
                                    (rowData) =>
                                        rowData.work_description
                                            .replace(/<\/?[^>]+(>|$)/g, ' ') // Remove HTML tags
                                            .replace(/&nbsp;/g, ' ') // Replace `&nbsp;` with a space
                                            .replace(/\s+/g, ' ') // Remove extra spaces
                                            .trim() // Trim leading and trailing spaces
                                }
                            />
                            <Column field="vendor_address" className="capitalize" style={{ width: '10%', minWidth: '20rem' }} header="Address" sortable></Column>
                            {(getRoles('update') || getRoles('delete')) && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{vendorData?.data?.vendor_listing && vendorData?.data?.vendor_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {vendorData?.data?.vendor_listing && vendorData?.data?.vendor_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {vendorData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={vendorData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
                    )}
                    {modal && (
                        <VendorModal
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
                        modalDescription={'Are you sure you want to delete vendor?'}
                    />
                </div>
            </div>
        </div>
    );
};
export default VendorList;
