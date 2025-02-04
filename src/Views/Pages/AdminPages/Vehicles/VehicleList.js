import components from '../..';
import toast from 'react-hot-toast';
// import jwtDecode from 'jwt-decode';
import axios from 'axios';
import ExcelJS from 'exceljs';
import DeleteModal from '../../../../components/DeleteModal';
import VehiclesAssignModal from './vehiclesAssignModal';
import VehicleSetting from '../Vehicles/vehicleSetting';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import moment from 'moment-timezone';
import { getVehicleListData, vehicleRemoveRequest } from '../../../../redux/slice/AdminSlices/vehicleSlice';

const VehicleList = () => {
    const { Dialog, SelectButton, Button, Column, DataTable, Image, InputText, toast, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { isCreated, isDelete, isLoading, vehicleList, isCreatedSetting } = useSelector((state) => state.vehicle);
    const { token, loginDetails } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;

    const [decode, setDecode] = useState(loginDetails);
    const [modal, setModal] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [vehicleSettingModel, setVehicleSettingModel] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [importModal, setImportModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editData, steEdit] = useState(null);
    const [fileImportError, setFileImportError] = useState(null);
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
        search: '',
        listType: 0
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
            label: 'Vehicles'
        }
    ];
    useEffect(() => {
        // decodeURI();
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        // if (loginDetails.role_permissions.find((x) => x.role === 'User')?.role_id) {
        //     paginationData.listType = 1;
        // }
        setPagination(paginationData);
        setModal(false);
        steEdit(null);
        callVehicleList(paginationData);
        setVehicleSettingModel(false);
        setSumValue(null);
        setSumValueError('');
    }, [dispatch, isCreated, isDelete, isCreatedSetting]);
    // const decodeURI = async () => {
    //     // let decodeData = await jwtDecode(token);
    //     // setDecode(decodeData);
    // };
    const callVehicleList = (val) => {
        try {
            dispatch(getVehicleListData(val));
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
        setFirst(event.first);
        setRows(event.rows);
        let paginationData = pagination;
        paginationData.current_page = event?.page + 1;
        paginationData.per_page = event?.rows;
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        callVehicleList(paginationData);
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* {getRoles('update') && decode?.role_permissions.filter((x) => x.role !== "User").length > 0 && (
                    <Button
                        label="Edit vehicle Setting"
                        icon="pi pi-plus"
                        className="p-button-outlined p-button-success mr-2 "
                        onClick={() => {
                            setVehicleSettingModel(true);
                        }}
                    />
                )} */}
                {decode?.role_permissions.length === 1 && decode?.role_permissions.find((x) => x.role === 'Chairman') ? null : (
                    <SelectButton
                        value={pagination.listType === 0 ? 'all' : 'myVehicle'}
                        // value={"Active"}
                        optionLabel="name"
                        options={[
                            { name: 'My Vehicle', value: 'myVehicle' },
                            { name: 'All Vehicle', value: 'all' }
                        ]}
                        onChange={(e) => {
                            let paginationData = pagination;
                            paginationData.listType = e.value === 'all' ? 0 : 1;
                            setPagination(paginationData);
                            callVehicleList(paginationData);
                        }}
                        // className='select_button_custome mr-3'
                        className="mr-3"
                    />
                )}
                {vehicleList?.data?.vehicle_listing.length > 0 && getRoles('update', true) && (
                    <Button
                        label="Export"
                        icon="pi pi-download"
                        className="p-button-outlined p-button-help mr-2"
                        onClick={async () => {
                            const { data } = await axios.post(`${BASE_URL_API}/vehicle/excel`, pagination, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                    Authorization: token
                                }
                            });
                            let dData = data?.data;
                            const chains = dData?.map((e) => ({
                                // property_logo: "https://property-management-tt.s3.ap-south-1.amazonaws.com/upload/property-logo/" + e.property_logo,

                                property_number: e.property_number,
                                name: e.name,
                                vehicle_number: e.vehicle_number,
                                vehicle_type: e.vehicle_type,
                                mobile_number: e.mobile_number,
                                created_at: moment(e.created_at).utcOffset('+05:30').format('D MMM YYYY, LT'),
                                updated_at: moment(e.updated_at).utcOffset('+05:30').format('D MMM YYYY, LT'),
                                vehicle_image: e?.vehicle_image
                                    ? {
                                          text: e.vehicle_image ? 'Click to view' : 'Image Not Upload', // Display text for the hyperlink (you can change this if needed)
                                          hyperlink: e?.vehicle_image ? e?.vehicle_image : '', // URL for the hyperlink
                                          tooltip: 'Click to view' // Optional tooltip for the hyperlink
                                      }
                                    : null
                            }));
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Vehicle List');
                            const headerRow = worksheet.addRow(['Property No.', "Owner's Name", 'Vehicle No.', 'Vehicle Type', 'Mobile Number', 'Created At', 'Updated At', 'Image']);
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
                            chains.forEach((report) => {
                                const row = worksheet.addRow([
                                    report.property_number,
                                    report.name,
                                    report.vehicle_number,
                                    report.vehicle_type,
                                    report.mobile_number,
                                    report.created_at,
                                    report.updated_at,
                                    report.vehicle_image
                                        ? {
                                              text: report.vehicle_image.text,
                                              hyperlink: report.vehicle_image.hyperlink,
                                              tooltip: report.vehicle_image.tooltip
                                          }
                                        : ''
                                ]);
                                // You can apply additional styling here if needed
                            });
                            workbook.xlsx
                                .writeBuffer()
                                .then((buffer) => {
                                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `vehicle-${new Date().toISOString()}.xlsx`;
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                })
                                .catch((err) => {
                                    console.error('Error generating Excel file:', err);
                                });
                        }}
                    />
                )}
                {loginDetails?.role_permissions.filter((x) => x.role !== 'User').length > 0 && getRoles('update', true) && (
                    <Button
                        label="Import"
                        icon="pi pi-plus"
                        className="p-button-outlined p-button-info mr-2"
                        onClick={() => {
                            setImportModal(true);
                            setFileImportError(null);
                        }}
                    />
                )}
                {getRoles('create') && (
                    <Button
                        label="Add Vehicle"
                        icon="pi pi-plus"
                        className="p-button-outlined p-button-success mr-2 "
                        onClick={() => navigate(`/property-management/vehicle/vehicle-assign`)}
                        // onClick={() => {
                        //     setModal(true);
                        //     steEdit(null);
                        // }}
                    />
                )}
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = vehicleList?.data?.vehicle_listing?.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-start w-30rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Property No., Owner's Name, or Vehicle No." value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '22rem' }} disabled={isSearchDisabled} />
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
        dispatch(getVehicleListData(paginationData));
    };
    const getRoles = (permissionName, val) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                let collectUpdatePermition = loginDetails?.role_permissions.filter((x) => x.role !== 'Chairman' && x.role !== 'User');
                if (pagination.listType === 0 && collectUpdatePermition.length > 0 && (permissionName === 'update' || permissionName === 'delete')) {
                    let check = collectUpdatePermition[0]?.permission.find((x) => x.module_name === 'vehicle')?.module_access.findIndex((y) => y === permissionName);
                    if (check !== undefined && check !== -1 && checkPrmition === false) {
                        checkPrmition = true;
                    }
                } else {
                    let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== 'User') : loginDetails?.role_permissions;
                    dataColl.forEach((b, i) => {
                        let check = b.permission.find((x) => x.module_name === 'vehicle')?.module_access.findIndex((y) => y === permissionName);
                        if (check !== undefined && check !== -1 && checkPrmition === false) {
                            checkPrmition = true;
                        }
                    });
                }
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
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>;
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                {getRoles('update') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text  p-button-help"
                        onClick={() => navigate(`/property-management/vehicle/vehicle-edit/${rowData._id}`)}
                        // onClick={() => {
                        //     setModal(true);
                        //     steEdit(rowData);
                        // }}
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
                            setDeleteId(rowData._id);
                            dynamicNumber();
                        }}
                    />
                )}
            </div>
        );
    };
    // const deleteUserDialogFooter = () => {
    //     try {
    //         return (
    //             <>
    //                 <Button
    //                     label="No"
    //                     icon="pi pi-times"
    //                     className="p-button-outlined p-button-danger mr-2 mb-2"
    //                     onClick={() => {
    //                         setDeleteModal(false);
    //                         setDeleteId(null);
    //                         setSumValueError('');
    //                         setSumValue(null);
    //                     }}
    //                 />
    //                 <Button
    //                     label="Yes"
    //                     icon="pi pi-check"
    //                     className="p-button-outlined p-button-success mr-2 mb-2"
    //                     onClick={() => {
    //                         if (numValues?.num1 + numValues?.num2 === sumValue) {
    //                             setSumValueError('');
    //                             setDeleteModal(false);
    //                             dispatch(vehicleRemoveRequest(deleteId));
    //                             setDeleteId(null);
    //                         } else {
    //                             setSumValueError('Wrong Answer !');
    //                         }
    //                     }}
    //                 />
    //             </>
    //         );
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
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
                                // Store current listType before deletion
                                const currentListType = pagination.listType;
                                dispatch(vehicleRemoveRequest(deleteId))
                                    .then(() => {
                                        // After deletion, manually call getVehicleListData with the stored listType
                                        const updatedPagination = {
                                            ...pagination,
                                            listType: currentListType
                                        };
                                        dispatch(getVehicleListData(updatedPagination));
                                    });
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
    const formatVehicleNumber = (vehicleNumber) => {
        // Assuming vehicle number is a single string without spaces
        if (!vehicleNumber) return '';
        const match = vehicleNumber.match(/^(\w{2})(\d{2})(\w{2})(\d{4})$/);
        return match ? `${match[1]} ${match[2]} ${match[3]} ${match[4]}` : vehicleNumber;
    };

    const checkOnlyUser = () => {
        let check = loginDetails.role_permissions.length === 1 && loginDetails.role_permissions[0].role === 'User' && pagination.listType === 0;
        return check;
    };
    const downloadFile = async (val) => {
        try {
            // if (val) {
            const response = await axios.get(`https://property-management-tt.s3.ap-south-1.amazonaws.com/upload/sample_excel/vehicle.xlsx`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'vehicle.xlsx');
            document.body.appendChild(link);
            link.click();
            // } else {
            //     toast.error(`Don't have agreement file`, {
            //         style: {
            //             marginTop: '4rem'
            //         }
            //     });
            // }
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpload = async (event) => {
        try {
            const str = event.target.files[0]?.name;
            const substr = ['.xlsx'];
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                setImportLoading(true);
                let formData = new FormData();
                formData.append('file', event.target.files[0]);
                const { data } = await axios.post(`${BASE_URL_API}/vehicle/add-vehicle-excel`, formData, {
                    headers: {
                        // 'Content-Type': 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        Authorization: token
                    }
                });
                if (data?.statusCode === 200) {
                    setImportLoading(false);
                    toast.success(data.message, {
                        style: {
                            marginTop: '4rem'
                        }
                    });
                    setImportModal(false);
                    setFileImportError(null);
                    callVehicleList(pagination);
                }

                // await axios.post(`${BASE_URL_API}/block/create-shopping-structure-excel`, data, config);

                // setFileFormData(event.target.files[0]);
                // setFileName(str);
            }
        } catch (error) {
            setImportLoading(false);
            console.log(error);
            if (error?.response?.data?.error) {
                setFileImportError(error?.response?.data?.errors);
            }
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading || importLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title  m-2 pr-3 flex align-items-center justify-content-center">Vehicles</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {vehicleList?.data?.vehicle_listing && vehicleList?.data?.vehicle_listing.length > 0 ? (
                        <DataTable
                            value={vehicleList?.data?.vehicle_listing}
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
                                callVehicleList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            <Column
                                field="vendor_profile_image"
                                header="Image"
                                body={(rowData) => (rowData?.vehicle_image ? <Image src={`${rowData?.vehicle_image}`} alt="Image" width="50" height="50" preview /> : '-')}
                                style={{ width: '4rem' }}
                            ></Column>
                            <Column field="property_number" header="Property No." body={(rowData) => <div className="text-center">{rowData?.property_number}</div>} sortable style={{ width: '9rem' }}></Column>
                            {/* <Column field="name" className="capitalize" header="Name" sortable></Column> */}
                            <Column
  field="name"
  className="capitalize"
  header="Name"
  sortable
  body={(rowData) => (
    <a
      href={`${BASE_URL_API}property-management/property-assign/${rowData.user_property_assign_id}`}
      className=" hover:underline"
      onClick={(e) => {
        e.preventDefault(); // Prevent default navigation
        navigate(`/property-management/property-assign/${rowData.user_property_assign_id}`)
        // window.location.href = `http://localhost:3000/property-management/property-assign/${rowData._id}`; // Redirect to the property page
      }}
    >
      {rowData.name}
    </a>
  )}
></Column>
                            {/* <Column field="vehicle_number" header="Vehicle No." sortable></Column> */}
                            <Column field="vehicle_number" header="Vehicle No." sortable body={(rowData) => formatVehicleNumber(rowData.vehicle_number)}></Column>

                            <Column field="vehicle_type" header="Vehicle Type" sortable></Column>
                            <Column
                                field="mobile_number"
                                className="headerCellEnd"
                                header="Mobile No."
                                body={(rowData) => (
                                    <div className="text-right">
                                        <a href={`tel:${rowData?.mobile_number}`} className=" hover:underline">{rowData?.mobile_number}</a>
                                    </div>
                                )}
                            ></Column>
                            {/* <Column field="parking_spot" header="Parking Spot" sortable></Column> */}
                            <Column field="created_at" header="Created At" sortable body={(rowData) => moment(rowData.created_at).utcOffset('+05:30').format('D MMM YY, LT')}></Column>
                            <Column field="updated_at" header="Updated At" sortable body={(rowData) => moment(rowData.updated_at).utcOffset('+05:30').format('D MMM YY, LT')}></Column>
                            {checkOnlyUser() ? null : (getRoles('update') || getRoles('delete')) && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                            {/* <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column> */}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{vehicleList?.data?.vehicle_listing && vehicleList?.data?.vehicle_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {vehicleList?.data?.vehicle_listing && vehicleList?.data?.vehicle_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {vehicleList?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={vehicleList?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
                    )}
                    {modal && (
                        <VehiclesAssignModal
                            editData={editData}
                            onHide={() => {
                                setModal(false);
                                steEdit(null);
                            }}
                        />
                    )}
                    {vehicleSettingModel && <VehicleSetting onHide={() => setVehicleSettingModel(false)} />}
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
                        modalDescription={'Are you sure you want to delete vehicle?'}
                    />
                    {importModal && (
                        <Dialog
                            draggable={false}
                            visible={importModal}
                            style={{ width: '50vw' }}
                            header={'Import Excel'}
                            modal
                            className="p-fluid"
                            onHide={() => {
                                setImportModal(false);
                                setFileImportError(null);
                            }}
                        >
                            <div className="relative">
                                <Loader isLoading={isLoading || importLoading} />
                                <div className="mt-2">
                                    <div className="p-4 " style={{ backgroundColor: 'rgb(224, 224, 224)' }}>
                                        <h6 className="" style={{ color: 'red' }}>
                                            {' '}
                                            NOTE *
                                        </h6>
                                        <div className="mt-2 font-medium "> Kindly download the sample excel file and import the excel data as per the excel file otherwise data will not import properly it might give you an error </div>
                                    </div>
                                </div>
                                <div className="mb-3 mt-2 flex">
                                    <strong>Download : </strong>
                                    <div style={{ textDecoration: 'underline' }} className="ml-2 cursor-pointer" onClick={downloadFile}>
                                        sample.xlsx
                                    </div>
                                </div>

                                <div className="file-input-upload">
                                    <input type="file" id="fileInput" accept=".xlsx" className="input" onChange={handleUpload} />
                                    <label for="fileInput" className="label">
                                        <span>Choose a file...</span>
                                    </label>
                                </div>
                                {fileImportError && <div className="font-medium mt-2"> File Error</div>}
                                {fileImportError && Array.isArray(fileImportError) ? fileImportError.map((x) => <div style={{ color: 'red' }}>{x}</div>) : <div style={{ color: 'red' }}>{fileImportError}</div>}
                            </div>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleList;
