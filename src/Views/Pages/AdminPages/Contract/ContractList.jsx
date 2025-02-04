// import components from '../..';
// import DeleteModal from '../../../../components/DeleteModal';
// import Loader from '../../../../components/Loader';
// import paper from '../../../../assets/images/No-data-pana.svg';
// import { SelectButton } from 'primereact/selectbutton';
// import { contractRemoveRequest, getContractData } from '../../../../redux/slice/AdminSlices/contractSlice';
// import moment from 'moment-timezone';

// const ContractList = () => {
//     const { Button, Column, DataTable, Image, InputText, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
//     const { isCreated, isDelete, contractData, isLoading } = useSelector((state) => state.contract);
//     const { loginDetails } = useSelector((store) => store.auth);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [decode, setDecode] = useState(null);
//     const [deleteModal, setDeleteModal] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [numValues, setNumValues] = useState({ num1: 0, num2: 0 });
//     const [sumValue, setSumValue] = useState(null);
//     const [sumValueError, setSumValueError] = useState('');
//     const [rows, setRows] = useState(10);
//     const [first, setFirst] = useState(0);
//     const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'updated_at', order: -1 }]);
//     const [pagination, setPagination] = useState({
//         current_page: 1,
//         per_page: 10,
//         search: '',
//         listType: 0
//         // order_column: 'updated_at',
//         // order_direction: -1
//     });
//     const breadcrumbHome = {
//         icon: 'pi pi-home',
//         command: () => {
//             navigate(`/property-management/dashboard`);
//         }
//     };

//     const breadcrumbItems = [
//         {
//             label: 'Contracts'
//         }
//     ];
//     useEffect(() => {
//         decodeURI();
//         let paginationData = { ...pagination };
//         paginationData.order_column = multiSortMeta[0]['field'];
//         paginationData.order_direction = multiSortMeta[0]['order'];
//         setPagination(paginationData);
//         callContractList(paginationData);
//     }, [dispatch, isCreated, isDelete]);
//     const decodeURI = async () => {
//         setDecode(loginDetails);
//     };
//     const callContractList = (val) => {
//         try {
//             // console.log(val, 'val');
//             dispatch(getContractData(val));
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const getRoles = (permissionName) => {
//         try {
//             let checkPrmition = false;
//             if (loginDetails) {
//                 loginDetails?.role_permissions.forEach((b, i) => {
//                     let check = b.permission.find((x) => x.module_name === 'contract')?.module_access.findIndex((y) => y === permissionName);
//                     if (check !== undefined && check !== -1 && checkPrmition === false) {
//                         checkPrmition = true;
//                     }
//                 });
//                 // if (decode?.role_permissions.find((a) => a.role === "Chairman")?.role === "Chairman") {
//                 //     let checkIndex = decode?.role_permissions.find((a) => a.role === "Chairman").permission.findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === permissionName) !== -1);
//                 //     check = checkIndex !== -1
//                 // }
//             }
//             // let check = decode?.role_permissions.find((a) => a.role === "chairman").findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === permissionName) !== -1);
//             return checkPrmition;
//             // let check = decode?.permissions.findIndex((x) => x.module_name === 'vendor' && x.module_access.findIndex((a) => a === permissionName) !== -1);
//             // return check !== -1;
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const handlePageChange = (event) => {
//         setFirst(event.first);
//         setRows(event.rows);
//         let paginationData = pagination;
//         paginationData.current_page = event?.page + 1;
//         paginationData.per_page = event?.rows;
//         paginationData.order_column = multiSortMeta[0]['field'];
//         paginationData.order_direction = multiSortMeta[0]['order'];
//         setPagination(paginationData);
//         callContractList(paginationData);
//     };
//     // const centerToolbarTemplate = () => {
//     //     try {
//     //         return (
//     //             <React.Fragment>
//     //                 <SelectButton
//     //                     value={pagination.listType === 0 ? 'current' : 'history'}
//     //                     // value={
//     //                     //     pagination.listType === 0 ? "current" :
//     //                     //         pagination.listType === 1 ? "history" :
//     //                     //             pagination.listType === 2 ? "all" :
//     //                     //                     ""
//     //                     // }
//     //                     optionLabel="name"
//     //                     options={[
//     //                         // { name: 'All', value: "all" },
//     //                         { name: 'Current', value: 'current' },
//     //                         { name: 'History', value: 'history' }
//     //                     ]}
//     //                     onChange={(e) => {
//     //                         let paginationData = { ...pagination };
//     //                         paginationData.listType = e.value === 'current' ? 0 : e.value === 'history' ? 1 : paginationData.listType;

//     //                         setPagination(paginationData);
//     //                         callContractList(paginationData);
//     //                     }}
//     //                     className="mr-3"
//     //                 />
//     //             </React.Fragment>
//     //         );
//     //     } catch (error) {
//     //         console.log(error);
//     //     }
//     // };
//     const leftToolbarTemplate = () => {
//         const isSearchDisabled = contractData?.data?.contract_listing.length === 0 && pagination?.search === '';
//         return (
//             <React.Fragment>
//                 <div className="flex justify-content-end w-27rem">
//                     <span className="p-input-icon-right">
//                         <i className="pi pi-search" />
//                         <InputText placeholder="Search by Service Provider Name" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
//                     </span>

//                     {/* Clear Button */}
//                     <Button
//                         label="Clear"
//                         icon="pi pi-filter-slash"
//                         className="p-button-outlined w-7rem ml-2"
//                         disabled={pagination?.search === ''}
//                         onClick={() => {
//                             let setDefaultPag = { ...pagination };
//                             setDefaultPag.search = ''; // Clear the search value
//                             setPagination(setDefaultPag); // Update pagination state
//                             onSearch(''); // Clear the search filter
//                         }}
//                     />
//                 </div>
//             </React.Fragment>
//         );
//     };

//     const centerToolbarTemplate = () => {
//         return (
//             <React.Fragment>
//                 <SelectButton
//                     value={pagination.listType === 0 ? 'current' : 'history'}
//                     // value={
//                     //     pagination.listType === 0 ? "current" :
//                     //         pagination.listType === 1 ? "history" :
//                     //             pagination.listType === 2 ? "all" :
//                     //                     ""
//                     // }
//                     optionLabel="name"
//                     options={[
//                         // { name: 'All', value: "all" },
//                         { name: 'Active', value: 'current' },
//                         { name: 'Expire', value: 'history' }
//                     ]}
//                     onChange={(e) => {
//                         let paginationData = { ...pagination };
//                         paginationData.listType = e.value === 'current' ? 0 : e.value === 'history' ? 1 : paginationData.listType;

//                         setPagination(paginationData);
//                         callContractList(paginationData);
//                     }}
//                     className="ml-4"
//                 />
//             </React.Fragment>
//         );
//     };
//     const rightToolbarTemplate = () => {
//         return (
//             <React.Fragment>
//                 <Button
//                     label="Add Contract"
//                     icon="pi pi-plus"
//                     className="p-button-outlined p-button-success mr-2"
//                     onClick={() => {
//                         navigate('/property-management/contract/contract-create');
//                     }}
//                 />
//             </React.Fragment>
//         );
//     };
//     const onSearch = (value) => {
//         let paginationData = { ...pagination };

//         paginationData.search = value;
//         paginationData.per_page = 10;
//         paginationData.current_page = 1;
//         paginationData.order_column = multiSortMeta[0]['field'];
//         paginationData.order_direction = multiSortMeta[0]['order'];
//         setPagination(paginationData);
//         setRows(10);
//         setFirst(0);
//         dispatch(getContractData(paginationData));
//     };
//     const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} center={centerToolbarTemplate} end={decode?.role !== 'User' && getRoles('create') && rightToolbarTemplate}></Toolbar>;
//     const actionBodyTemplate = (rowData) => {
//         return (
//             <div className="actions flex justify-content-center">
//                 <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/contract/contract-view/${rowData?._id}`)} />

//                 {getRoles('update') && pagination.listType === 0 && (
//                     <Button
//                         tooltip="Edit"
//                         tooltipOptions={{ position: 'bottom' }}
//                         icon="pi pi-pencil"
//                         id="edits-icons"
//                         className="p-button-rounded p-button-text  p-button-help"
//                         onClick={() => {
//                             navigate(`/property-management/contract/contract-edit/${rowData._id}`);
//                         }}
//                     />
//                 )}
//                 {getRoles('delete') && pagination.listType === 0 && (
//                     <Button
//                         icon="pi pi-trash"
//                         className="p-button-rounded p-button-text  p-button-danger"
//                         id="delete-icons"
//                         tooltip="Delete"
//                         tooltipOptions={{ position: 'bottom' }}
//                         onClick={() => {
//                             setDeleteModal(true);
//                             setDeleteId(rowData);
//                             dynamicNumber();
//                             setSumValue(null);
//                             setSumValueError('');
//                         }}
//                     />
//                 )}
//             </div>
//         );
//     };
//     const dynamicNumber = () => {
//         try {
//             setNumValues({
//                 num1: Math.floor(Math.random() * 10),
//                 num2: Math.floor(Math.random() * 10)
//             });
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const deleteUserDialogFooter = () => (
//         <>
//             <Button
//                 label="No"
//                 className="p-button-outlined p-button-danger mr-2"
//                 onClick={() => {
//                     setDeleteModal(false);
//                     setDeleteId(null);
//                     setSumValue(null);
//                     setSumValueError('');
//                 }}
//             />
//             <Button
//                 label="Yes"
//                 className="p-button-outlined p-button-success"
//                 onClick={() => {
//                     if (numValues.num1 + numValues.num2 === sumValue) {
//                         // dispatch(announcementRemoveRequest(deleteId));
//                         // setDeleteModal(false);
//                         // setDeleteId(null);
//                         // dispatch(getAnnouncementData());
//                         dispatch(contractRemoveRequest(deleteId._id));
//                         setDeleteModal(false);
//                         setDeleteId(null);
//                         setSumValue(null);
//                         setSumValueError('');
//                         // dispatch(getAnnouncementData());
//                     } else {
//                         setSumValueError('Wrong Answer!');
//                     }
//                 }}
//             />
//         </>
//     );
//     const template = {
//         layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink CurrentPageReport',
//         CurrentPageReport: (options) => {
//             return (
//                 <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
//                     {options.first} - {options.last} of {options.totalRecords}
//                 </span>
//             );
//         }
//     };
//     const convertDate = (dateStr) => {
//         try {
//             const formattedDate = moment(dateStr).format('D MMM YYYY');
//             return formattedDate;
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     return (
//         <div className="relative min-h-full">
//             <Loader isLoading={isLoading} />
//             <div className="flex justify-content-between align-items-center">
//                 <div className="flex flex-row w-full">
//                     <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Contract</h5>
//                     <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                 </div>
//             </div>
//             <div className="grid crud-demo ml-0 mr-0">
//                 <div className="col-12 card mt-2">
//                     {contractData?.data?.contract_listing && contractData?.data?.contract_listing.length > 0 ? (
//                         <DataTable
//                             value={contractData?.data?.contract_listing}
//                             showGridlines
//                             stripedRows
//                             dataKey="id"
//                             emptyMessage="No Record Found."
//                             header={header}
//                             scroll="scroll"
//                             tableStyle={{ minWidth: '60rem' }}
//                             sortMode="multiple"
//                             size="normal"
//                             onSort={(e) => {
//                                 let paginationData = { ...pagination };
//                                 paginationData.order_column = e.multiSortMeta[0]['field'];
//                                 paginationData.order_direction = e.multiSortMeta[0]['order'];
//                                 setPagination(paginationData);
//                                 setMultiSortMeta(e.multiSortMeta);
//                                 callContractList(paginationData);
//                             }}
//                             multiSortMeta={multiSortMeta}
//                         >
//                             <Column field="company_name" header="Service Provider Name" className='capitalize-first-letter' sortable></Column>
//                             <Column field="contactPerson" header="Contact Person" className='capitalize-first-letter' sortable></Column>
//                             <Column field="designation" header="Designation" className='capitalize-first-letter' sortable></Column>
//                             <Column field="contactNo" header="Contact No." className="headerCellEnd" body={(rowData) => (rowData.contactNo ? <div className='text-right'>{rowData.contactNo}</div> : <div className='text-center'>-</div>)} sortable></Column>
//                             <Column field="tenure" header="Tenure" sortable></Column>
//                             <Column field="start_date" header="Start Date" sortable body={(rowData) => (rowData.start_date ? convertDate(rowData.start_date) : '-')}></Column>
//                             <Column field="end_date" header="End Date" sortable body={(rowData) => (rowData.end_date ? convertDate(rowData.end_date) : '-')}></Column>
//                             <Column field="address" header="Address" className='capitalize-first-letter' sortable></Column>
//                             <Column field="usersName" header="Added by" sortable></Column>
//                             <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>
//                         </DataTable>
//                     ) : (
//                         <DataTable
//                             emptyMessage={() => (
//                                 <>
//                                     <div className="flex-wrap flex">{contractData?.data?.contract_listing && contractData?.data?.contract_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
//                                     {contractData?.data?.contract_listing && contractData?.data?.contract_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
//                                 </>
//                             )}
//                             value={[]}
//                             header={header}
//                         ></DataTable>
//                     )}
//                     {contractData?.data?.totalRecords > 10 && (
//                         <Paginator template={template} first={first} rows={rows} totalRecords={contractData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
//                     )}

//                     <DeleteModal
//                         isOpenDialog={deleteModal}
//                         modalFooter={deleteUserDialogFooter}
//                         hideModal={() => {
//                             setDeleteModal(false);
//                             setDeleteId(null);
//                             setSumValueError('');
//                             setSumValue(null);
//                         }}
//                         numValues={numValues}
//                         sumValue={sumValue}
//                         setSumValue={setSumValue}
//                         sumValueError={sumValueError}
//                         setSumValueError={setSumValueError}
//                         modalDescription="Are you sure you want to delete this contract?"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default ContractList;

import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import { SelectButton } from 'primereact/selectbutton';
import { contractRemoveRequest, getContractData, renewContractRequest } from '../../../../redux/slice/AdminSlices/contractSlice';
import moment from 'moment-timezone';
import axios from 'axios';
import ExcelJS from 'exceljs';
const ContractList = () => {
    const { Button, Column, DataTable, Image, InputText, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { isCreated, isDelete, contractData, isLoading } = useSelector((state) => state.contract);
    const { token,loginDetails } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const [decode, setDecode] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [numValues, setNumValues] = useState({ num1: 0, num2: 0 });
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'updated_at', order: -1 }]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        search: '',
        // listType: 0
        listType: 2
        // order_column: 'updated_at',
        // order_direction: -1
    });
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Contracts'
        }
    ];
    useEffect(() => {
        decodeURI();
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        callContractList(paginationData);
    }, [dispatch, isCreated, isDelete]);
    const decodeURI = async () => {
        setDecode(loginDetails);
    };
    const callContractList = (val) => {
        try {
            dispatch(getContractData(val));
        } catch (error) {
            console.log(error);
        }
    };
    const getRoles = (permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'contract')?.module_access.findIndex((y) => y === permissionName);
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
            // let check = decode?.permissions.findIndex((x) => x.module_name === 'vendor' && x.module_access.findIndex((a) => a === permissionName) !== -1);
            // return check !== -1;
        } catch (error) {
            console.log(error);
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
        callContractList(paginationData);
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = contractData?.data?.contract_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Service Provider Name" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
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
    const centerToolbarTemplate = () => {
        return (
            <React.Fragment>
                <SelectButton
                    value={pagination.listType === 0 ? 'current' : pagination.listType === 1 ? 'history' : pagination.listType === 2 ? 'all' : ''}
                    optionLabel="name"
                    options={[
                        { name: 'All', value: 'all' },
                        { name: 'Active', value: 'current' },
                        { name: 'Expire', value: 'history' }
                    ]}
                    onChange={(e) => {
                        let paginationData = { ...pagination };
                        paginationData.listType = e.value === 'current' ? 0 : e.value === 'history' ? 1 : e.value === 'all' ? 2 : paginationData.listType;

                        setPagination(paginationData);
                        callContractList(paginationData);
                    }}
                    className="ml-4"
                />
            </React.Fragment>
        );
    };
    useEffect(() => {
        decodeURI();
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        callContractList(paginationData);
    }, [dispatch, isCreated, isDelete]);

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={contractData?.data?.contract_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        const { data } = await axios.post(`${BASE_URL_API}/contract/excel`, pagination, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                Authorization: token
                            }
                        });
                        let contractListData = data?.data;

                        if (contractListData && contractListData.length > 0) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Contract List');

                            // Headers for contract data including document fields
                            const headerRow = worksheet.addRow([
                                'Service Provider Name',
                                'Category Type',
                                'Contact Person',
                                'Designation',
                                'Contact No',
                                'Tenure',
                                'Start Date',
                                'End Date',
                                'Address',
                                'Contract Document',
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

                            // Add contract data rows
                            contractListData.forEach((contract) => {
                                const row = worksheet.addRow([
                                    contract.company_name || '-',
                                    contract.category || '-',
                                    contract.contactPerson || '-',
                                    contract.designation || '-',
                                    contract.contactNo || '-',
                                    contract.tenure || '-',
                                    contract.start_date ? moment(contract.start_date).utcOffset('+05:30').format('DD-MMM-YYYY') : '-',
                                    contract.end_date ? moment(contract.end_date).utcOffset('+05:30').format('DD-MMM-YYYY') : '-',
                                    contract.address || '-',
                                    contract.aggerement_files || '-',
                                    moment(contract.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(contract.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                ]);

                                // Add hyperlinks for document fields
                                if (contract.aggerement_files) {
                                    const imageCell = row.getCell(10);
                                    // Set the cell's value and properties
                                    imageCell.value = {
                                        text: contract.aggerement_files,
                                        hyperlink: contract.aggerement_files
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

                            // Make certain columns wider
                            worksheet.getColumn(1).width = 30; // Service Provider Name
                            worksheet.getColumn(9).width = 40; // Address
                            // Make document columns wider
                            for (let i = 10; i <= 14; i++) {
                                worksheet.getColumn(i).width = 30;
                            }

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
                                    a.download = 'contract_list.xlsx';
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
                    label="Add Contract"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2"
                    onClick={() => {
                        navigate('/property-management/contract/contract-create');
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
        dispatch(getContractData(paginationData));
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} center={centerToolbarTemplate} end={decode?.role !== 'User' && getRoles('create') && rightToolbarTemplate}></Toolbar>;
    const isContractExpired = (endDate) => {
        if (!endDate) return false;
        const today = moment().startOf('day');
        const expiryDate = moment(endDate).startOf('day');
        return today.isSameOrAfter(expiryDate);
    };
    // Handle contract renewal
    const handleContractRenewal = async (contractId) => {
        try {
            const formData = new FormData();
            formData.append('is_contract_renew_by_chairman', '2');
            formData.append('start_date', moment().format('YYYY-MM-DD'));
            formData.append('end_date', moment().add(1, 'year').format('YYYY-MM-DD'));

            await dispatch(renewContractRequest(contractId, formData));
            // The contract list will be automatically updated through the useEffect
            // that watches for isCreated changes
        } catch (error) {
            console.error('Error renewing contract:', error);
        }
    };
    const actionBodyTemplate = (rowData) => {
        const isExpired = isContractExpired(rowData.end_date);

        if (isExpired) {
            return (
                <div className="actions flex justify-content-center">
                    <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/contract/contract-view/${rowData?._id}`)} />
                    {getRoles('update') && (
                        <Button
                            tooltip="Renew Contract"
                            tooltipOptions={{ position: 'bottom' }}
                            icon="pi pi-refresh"
                            className="p-button-rounded p-button-text p-button-success mr-2"
                            // onClick={() => handleContractRenewal(rowData._id)}
                            onClick={() => navigate(`/property-management/contract/renew/${rowData._id}`)}
                        />
                    )}
                    {getRoles('delete') && (
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-text p-button-danger"
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
        }
        // Regular action buttons for non-expired contracts
        return (
            <div className="actions flex justify-content-center">
                <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/contract/contract-view/${rowData?._id}`)} />
                {getRoles('update') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text p-button-help"
                        onClick={() => navigate(`/property-management/contract/contract-edit/${rowData._id}`)}
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
                        dispatch(contractRemoveRequest(deleteId._id));
                        setDeleteModal(false);
                        setDeleteId(null);
                        setSumValue(null);
                        setSumValueError('');
                    } else {
                        setSumValueError('Wrong Answer!');
                    }
                }}
            />
        </>
    );
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
    const convertDate = (dateStr) => {
        try {
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
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Contract</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {contractData?.data?.contract_listing && contractData?.data?.contract_listing.length > 0 ? (
                        <DataTable
                            value={contractData?.data?.contract_listing}
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
                                callContractList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            <Column field="company_name" header="Service Provider Name" className="h-50 capitalize-first-letter" sortable body={(rowData) => (rowData.company_name ? rowData.company_name : <div className="text-center">-</div>)} />
                            <Column field="category" header="Category Type" className="capitalize-first-letter" sortable body={(rowData) => (rowData.category ? rowData.category : <div className="text-center">-</div>)} />
                            <Column field="contactPerson" header="Contact Person" className="capitalize-first-letter" sortable
                            // body={(rowData) => (rowData.contactPerson ? rowData.contactPerson : <div className="text-center">-</div>)}
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
                                    {rowData.contactPerson}
                                </a>
                            )}
                            />
                            <Column field="designation" header="Designation" className="capitalize-first-letter" sortable body={(rowData) => (rowData.designation ? rowData.designation : <div className="text-center">-</div>)} />
                            <Column field="contactNo" header="Contact No." className="headerCellEnd"
                            // body={(rowData) => (rowData.contactNo ? <div className="text-right">{rowData.contactNo}</div> : <div className="text-center">-</div>)}
                            body={(rowData) => (
                                <div className="text-right">
                                    <a href={`tel:${rowData?.contactNo}`} className=" hover:underline">{rowData?.contactNo}</a>
                                </div>
                            )}
                            sortable />
                            <Column field="tenure" header="Tenure" sortable body={(rowData) => (rowData.tenure ? rowData.tenure : <div className="text-center">-</div>)} />
                            <Column field="start_date" header="Start Date" sortable body={(rowData) => (rowData.start_date ? convertDate(rowData.start_date) : <div className="text-center">-</div>)} />
                            <Column field="end_date" header="End Date" sortable body={(rowData) => (rowData.end_date ? convertDate(rowData.end_date) : <div className="text-center">-</div>)} />
                            <Column field="address" header="Address" className="capitalize-first-letter" sortable body={(rowData) => (rowData.address ? rowData.address : <div className="text-center">-</div>)} />

                            {/* <Column field="usersName" header="Added by" sortable></Column> */}
                            <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{contractData?.data?.contract_listing && contractData?.data?.contract_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {contractData?.data?.contract_listing && contractData?.data?.contract_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {contractData?.data?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={contractData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
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
                        modalDescription="Are you sure you want to delete this contract?"
                    />
                </div>
            </div>
        </div>
    );
};
export default ContractList;
