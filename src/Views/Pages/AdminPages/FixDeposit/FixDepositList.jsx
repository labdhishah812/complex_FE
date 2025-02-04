import axios from 'axios';
import ExcelJS from 'exceljs';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import moment from 'moment-timezone';
import { getAmountDataData, vehicleRemoveRequest } from '../../../../redux/slice/AdminSlices/vehicleSlice';
import components from '../..';
import { fdRemoveRequest, getfdData } from '../../../../redux/slice/AdminSlices/fdSlice';

const FixDepositList = () => {
    const { Dialog, SelectButton, Button, Column, DataTable, Image, InputText, toast, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { isCreated, isDelete, isLoading, fdData } = useSelector((state) => state.fd);
    const { token, loginDetails } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [decode, setDecode] = useState(loginDetails);
    const [modal, setModal] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [vehicleSettingModel, setVehicleSettingModel] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [importModal, setImportModal] = useState(false);
    const [editData, steEdit] = useState(null);
    const [fileImportError, setFileImportError] = useState(null);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'updated_at', order: -1 }]);
    const [deleteId, setDeleteId] = useState(null);
    const [numValues, setNumValues] = useState({ num1: 0, num2: 0 });
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        order_column: 'updated_at',
        order_direction: -1,
        per_page: 10,
        search: '',
        // listType: 0
    });

    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'Fix Deposit'
        }
    ];
    useEffect(() => {
        // decodeURI();
        let paginationData = { ...pagination };
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setPagination(paginationData);
        setModal(false);
        steEdit(null);
        callfdData(paginationData);
        setVehicleSettingModel(false);
        setSumValue(null);
        setSumValueError('');
    }, [dispatch, isCreated, isDelete]);

    const callfdData = (val) => {
        try {
            dispatch(getfdData(val));
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
        callfdData(paginationData);
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={fdData?.data?.fd_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        const { data } = await axios.post(`${BASE_URL}/fixeddeposit/excel`, pagination, {
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
                            const worksheet = workbook.addWorksheet('FD List');

                            // Headers for contract data including document fields
                            const headerRow = worksheet.addRow([
                                'Bank Name',
                                'Branch Name',
                                'Account No.',
                                'Interest(%)',
                                'Principle Amount(₹)',
                                'Term',
                                'Value Date',
                                'Maturity Date',
                                'Receipt Image',
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
                                    contract.bank_name || '-',
                                    contract.branch_name || '-',
                                    contract.ac_no || '-',
                                    contract.interest || '-',
                                    contract.principle_amt || '-',
                                    contract.term || '-',
                                    contract.value_date ? moment(contract.start_date).utcOffset('+05:30').format('DD-MMM-YYYY') : '-',
                                    contract.maturity_date ? moment(contract.end_date).utcOffset('+05:30').format('DD-MMM-YYYY') : '-',
                                    contract.receipt_image || '-',
                                    moment(contract.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(contract.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                ]);

                                // Add hyperlinks for document fields
                                if (contract.receipt_image) {
                                    const imageCell = row.getCell(9);
                                    // Set the cell's value and properties
                                    imageCell.value = {
                                        text: contract.receipt_image,
                                        hyperlink: contract.receipt_image
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
                                    a.download = 'fixeddeposit.xlsx';
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                })
                                .catch((err) => {
                                    console.error('Error generating Excel file:', err);
                                });
                        }
                    }}
                />
                {getRoles('create') && <Button label="Add Fix Deposit" icon="pi pi-plus" className="p-button-outlined p-button-success mr-2 " onClick={() => navigate(`/property-management/fixdeposit/fixdeposit-create`)} />}
            </React.Fragment>
        );
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = fdData?.data?.fd_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    {/* Search Input */}
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Bank Name, or AC No." value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
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

                {/* SelectButton */}
                {/* {decode?.role_permissions.length > 1 || !decode?.role_permissions.find((x) => x.role === 'Chairman') ? (
                    <SelectButton
                        value={pagination.listType === 0 ? 'all' : 'myVehicle'}
                        options={[
                            { name: 'All Vehicle', value: 'all' },
                            { name: 'My Vehicle', value: 'myVehicle' }
                        ]}
                        optionLabel="name"
                        onChange={(e) => {
                            let updatedPagination = { ...pagination };
                            updatedPagination.listType = e.value === 'all' ? 0 : 1; // Update listType
                            setPagination(updatedPagination); // Update pagination state
                            callfdData(updatedPagination); // Fetch updated data
                        }}
                        className="select_button_custome ml-3"
                    />
                ) : null} */}
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
        dispatch(getfdData(paginationData));
    };
    const getRoles = (permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'fixeddeposit')?.module_access.findIndex((y) => y === permissionName);
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
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>;
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/fixdeposit/fixdeposit-view/${rowData?._id}`)} />

                {getRoles('update') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text  p-button-help"
                        onClick={() => navigate(`/property-management/fixdeposit/fixdeposit-edit/${rowData._id}`)}
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
                        dispatch(fdRemoveRequest(deleteId._id));
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
    // const checkOnlyUser = () => {
    //     let check = loginDetails.role_permissions.length === 1 && loginDetails.role_permissions[0].role === 'User' && pagination.listType === 0;
    //     return check;
    // };
    // const downloadFile = async (val) => {
    //     try {
    //         // if (val) {
    //         const response = await axios.get(`https://property-management-tt.s3.ap-south-1.amazonaws.com/upload/sample_excel/vehicle.xlsx`, {
    //             responseType: 'blob'
    //         });
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'vehicle.xlsx');
    //         document.body.appendChild(link);
    //         link.click();
    //         // } else {
    //         //     toast.error(`Don't have agreement file`, {
    //         //         style: {
    //         //             marginTop: '4rem'
    //         //         }
    //         //     });
    //         // }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const convertDate = (dateStr) => {
        try {
            const formattedDate = moment(dateStr).format('D MMM YYYY');
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };
    const spiteTerm = (val) => {
        try {
            if (val) {
                const yearRegex = /(\d+ year[s]?)/;
                const monthRegex = /(\d+ month[s]?)/;
                const weekRegex = /(\d+ week[s]?)/;

                const parts = val.split(yearRegex);
                const parts2 = parts[2] ? parts[2].split(monthRegex) : val.split(monthRegex);
                const parts3 = parts2[2] ? parts2[2].split(weekRegex) : val.split(monthRegex);
                let sendData = {};
                sendData.year = parts[2] ? parts[1].trim() : '';
                sendData.month = parts2[2] ? parts2[1].trim() : '';
                sendData.week = parts3[2] ? parts3[1].trim() : '';
                sendData.day = parts3[2] ? parts3[2].trim() : parts2[2] ? parts2[2].trim() : parts[2] ? parts[2].trim() : val;
                return sendData;
            } else {
                let sendData = {
                    year: '',
                    month: '',
                    week: '',
                    day: ''
                };
                return sendData;
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading || importLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title  m-2 pr-3 flex align-items-center justify-content-center">Fix Deposit</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {fdData?.data?.fd_listing && fdData?.data?.fd_listing.length > 0 ? (
                        <DataTable
                            value={fdData?.data?.fd_listing}
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
                                callfdData(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            <Column field="receipt_image" header="Image" body={(rowData) => (rowData?.receipt_image ? <Image src={`${rowData?.receipt_image}`} alt="Image" width="50" height="50" preview /> : '-')} style={{ width: '4rem' }} />
                            {/* <Column
                                field="term"
                                header="Tenure"
                                body={(rowData) => (
                                    <div>
                                        <div>{rowData?.term ? rowData?.term : '-'}</div>
                                        <div>{(rowData?.term).month}</div>
                                        <div>{(rowData?.term).week}</div>
                                        <div>{(rowData?.term).day}</div>
                                    </div>
                                )}
                                sortable
                                style={{ width: '8rem' }}
                            /> */}
                            <Column
                                field="term"
                                header="Tenure"
                                body={(rowData) => (
                                        rowData?.term ? (
                                            <div>
                                                <div>{rowData?.term || '-'}</div>
                                                {/* <div>{rowData?.term.month || '-'}</div>
                                                <div>{rowData?.term.week || '-'}</div>
                                                <div>{rowData?.term.day || '-'}</div> */}
                                            </div>
                                        ) : (
                                            '-'
                                        )
                                )}
                                sortable
                                style={{ width: '8rem' }}
                            />
                            <Column field="ac_no" className="headerCellEnd" header="Account No." body={(rowData) => <div className="text-right">{rowData?.ac_no || '-'}</div>} />
                            <Column field="bank_name" header="Bank Name" body={(rowData) => rowData?.bank_name || '-'} sortable />
                            <Column field="branch_name" header="Branch Name" className="capitalize-first-letter" body={(rowData) => rowData?.branch_name || '-'} sortable />
                            <Column field="interest" className="headerCellEnd" header="Interest(%)" body={(rowData) => <div className="text-right">{rowData?.interest || '-'}</div>} sortable />
                            <Column field="principle_amt" className="headerCellEnd" header="Principle Amount(₹)" body={(rowData) => <div className="text-right">{rowData?.principle_amt ? new Intl.NumberFormat('en-IN').format(rowData?.principle_amt) : '-'}</div>} sortable />
                            <Column field="maturity_amt" className="headerCellEnd" header="Maturity Amount(₹)" body={(rowData) => <div className="text-right">{rowData?.maturity_amt ? new Intl.NumberFormat('en-IN').format(rowData?.maturity_amt) : '-'}</div>} sortable />
                            <Column
                                field="interestInAmount"
                                className="headerCellEnd"
                                header="Interest In Amount(₹)"
                                body={(rowData) => <div className="text-right">{rowData?.interestInAmount ? new Intl.NumberFormat('en-IN').format(rowData?.interestInAmount) : '-'}</div>}
                                sortable
                            />
                            <Column field="value_date" header="Value Date" body={(rowData) => (rowData?.value_date ? convertDate(rowData.value_date) : '-')} />
                            <Column field="maturity_date" header="Maturity Date" body={(rowData) => (rowData?.maturity_date ? convertDate(rowData.maturity_date) : '-')} />
                            <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate} />
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{fdData?.data?.fd_listing && fdData?.data?.fd_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {fdData?.data?.fd_listing && fdData?.data?.fd_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        />
                    )}
                    {fdData?.data?.totalRecords > 10 && <Paginator template={template} first={first} rows={rows} totalRecords={fdData?.data?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]} />}
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
                        modalDescription="Are you sure you want to delete this fix-deposit?"
                    />
                </div>
            </div>
        </div>
    );
};

export default FixDepositList;
