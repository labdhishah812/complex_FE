import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from "../../../../assets/images/No-data-pana.svg";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getContactList, contactCreateRequest, contactUpdateRequest, removeContact } from '../../../../redux/slice/AdminSlices/emergencyContactSlice';
import moment from 'moment-timezone';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
const EmergencyContact = () => {
    const { Dialog, Button, Column, DataTable, InputText, InputNumber, classNames, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { token,loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isDelete, isLoading, contactlist } = useSelector((state) => state.emergencyContact);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const [submitted, setSubmitted] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [formValue, setFormValue] = useState({
        id: '',
        contact_name: "",
        contact_no: null,

    });
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
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: ''
    });
    const SignupSchema = Yup.object().shape({
        contact_name: Yup.string().trim().nullable().required('Please enter conatct name.'),
        contact_no: Yup.string().trim().nullable().min(2, 'Contact number must be at least 2 digit number.').max(12, 'Contact number must be at most 12 digit number.').required('Please enter contact no.'),
    });
    const breadcrumbItems = [
        {
            label: 'Emergency Contacts'
        }
    ];
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`)
        }
    };
    const getRoles = (permissionName, val) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== "User") : loginDetails?.role_permissions;
                dataColl.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === "emergencycontact")?.module_access.findIndex((y) => y === permissionName);
                    if (check !== undefined && check !== -1 && checkPrmition === false) {
                        checkPrmition = true;
                    }
                })
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
        setCreateModal(false);
        callContactList(paginationData);
    }, [dispatch, isCreated, isDelete]);

    const callContactList = (val) => {
        try {
            dispatch(getContactList(val));
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
        callContactList(paginationData);
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = contactlist?.emergencycontact_listing.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText
                            placeholder="Search by Contact Name, Contact No."

                            value={pagination?.search || ''}
                            onChange={(e) => onSearch(e.target.value)}
                            style={{ width: '20rem' }}
                            disabled={isSearchDisabled}
                        />
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
                {/* <Button
                    disabled={contactlist?.emergencycontact_listing.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        const { data } = await axios.post(`${BASE_URL_API}/emergencycontact/excel`, pagination, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                Authorization: token
                            }
                        });
                        let contactData = data?.data;

                        if (contactData && contactData.length > 0) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Emergency Contacts List');

                            // Define headers
                            const headerRow = worksheet.addRow([
                                'Contact Name',
                                'Contact Number',
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

                            // Add contact data rows
                            contactData.forEach((contact) => {
                                worksheet.addRow([
                                    contact.contact_name || '-',
                                    contact.contact_no || '-',
                                    moment(contact.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(contact.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
                                ]);
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
                                    a.download = 'emergency_contacts_list.xlsx';
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                })
                                .catch((err) => {
                                    console.error('Error generating Excel file:', err);
                                });
                        }
                    }}
                /> */}
                <Button
                    label="Create Contact"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2 "
                    onClick={() => {
                        setCreateModal(true);
                        setFormValue({
                            id: '',
                            contact_name: "",
                            contact_no: null,
                        })
                        // navigate('/property-management/meeting/meering-create');
                    }}
                />
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={getRoles("create") && rightToolbarTemplate}></Toolbar>;
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
        callContactList(paginationData);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                {getRoles("update") && <Button
                    tooltip="Edit"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-pencil"
                    id="edits-icons"
                    className="p-button-rounded p-button-text  p-button-help"
                    onClick={() => {
                        let data = { ...formValue }
                        data.id = rowData?._id;
                        data.contact_name = rowData?.contact_name;
                        data.contact_no = rowData?.contact_no;
                        setFormValue(data);
                        setCreateModal(true);
                    }}
                />}
                {getRoles("delete") && <Button
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

                />}
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
                        dispatch(removeContact(deleteId._id));
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
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const [day, month, year] = dateStr.split('/');
            const date = new Date(`${year}-${month}-${day}`);
            const formattedDate = `${day}-${monthNames[date.getMonth()]}-${year}`;
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Emergency Contacts</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {contactlist?.emergencycontact_listing && contactlist?.emergencycontact_listing.length > 0 ? <DataTable
                        value={contactlist?.emergencycontact_listing ? contactlist?.emergencycontact_listing : []}
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
                            callContactList(paginationData);
                        }}
                        multiSortMeta={multiSortMeta}
                    >
                        {/* <Column field="date" header="Date" sortable body={(rowData) => rowData.date ? convertDate(rowData.date) : "-"}></Column> */}
                        <Column field="contact_name" className="h-50 capitalize" header="Contact Name" sortable></Column>
                        <Column field="contact_no" className="headerCellEnd" header="Contact No." body={(rowData) => <div className="text-right"><a href={`tel:${rowData?.contact_no}`} className=' hover:underline'>{rowData?.contact_no}</a></div>} headerStyle={{ width: '6%', minWidth: '11rem' }} ></Column>
                        {/* <Column field="title" header="Title" sortable></Column>
                        <Column field="location" header="Location" sortable></Column>
                        <Column field="description" header="Description" sortable></Column> */}
                        {(getRoles("update") || getRoles("delete")) && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                    </DataTable> : <DataTable

                        emptyMessage={() =>
                            <><div className='flex-wrap flex'>
                                {contactlist?.emergencycontact_listing && contactlist?.emergencycontact_listing.length === 0 && <img src={paper} className='h-20rem w-20rem m-auto' />}
                            </div>
                                {contactlist?.emergencycontact_listing && contactlist?.emergencycontact_listing.length === 0 && <div className='text-center text-2xl'>{"No Record Found."}</div>}
                            </>}
                        value={[]}
                        header={header}
                    ></DataTable>}
                    {contactlist?.totalRecords > 10 && < Paginator template={template} first={first} rows={rows} totalRecords={contactlist?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>}
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
                        modalDescription="Are you sure you want to delete this Emergency contract?"
                    />
                    {createModal && <Dialog visible={createModal} style={{ width: '30vw' }} draggable={false} header={formValue.id !== "" ? "Edit Contact" : 'Create Contact'} modal className="p-fluid" onHide={() => { setCreateModal(false) }}>
                        <Formik
                            initialValues={formValue}
                            validationSchema={SignupSchema}
                            enableReinitialize
                            onSubmit={(values) => {
                                setSubmitted(true);
                                setTimeout(() => {
                                    setSubmitted(false);
                                }, 5000);

                                values?.id !== "" && dispatch(contactUpdateRequest(values?.id, values));
                                values?.id === "" && dispatch(contactCreateRequest(values));

                            }}
                        >
                            {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                                <Form>
                                    <div className="grid p-fluid mt-1">
                                        <div className="field col-12 mb-0">
                                            <label htmlFor="contact_name" className="required">
                                                Contact Name
                                            </label>
                                            <InputText
                                                id="contact_name"
                                                name="contact_name"
                                                placeholder="Enter Contact Name"
                                                type="text"
                                                value={values?.contact_name}
                                                onChange={handleChange}
                                                className={classNames({ 'p-invalid': errors.contact_name && touched.contact_name })}
                                            />
                                            <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.contact_name && touched.contact_name ? errors.contact_name : ""}</div>
                                        </div>
                                        <div className="field col-12 mb-1">
                                            <label htmlFor="contact_no" className="required">
                                                Contact No.
                                            </label>
                                            <InputText
                                                id="contact_no"
                                                type="tel"
                                                placeholder="Enter Contact No."
                                                name="contact_no"
                                                value={values?.contact_no}
                                                useGrouping={false}
                                                maxLength={10}
                                                onInput={(e) => {
                                                    // Use a regular expression to only allow digits (0-9)
                                                    const numericValue = e.target.value.replace(/\D/g, '');
                                                    setFieldValue('contact_no', numericValue);
                                                }}
                                                className={classNames({ 'p-invalid': errors.contact_no && touched.contact_no })}
                                            />
                                            <div className="p-invalid error text-xs" style={{ minHeight: "1.5rem" }}>{errors.contact_no && touched.contact_no ? errors.contact_no : ""}</div>
                                        </div>
                                    </div>
                                    <div className="field mb-1 flex justify-content-end">
                                        <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => { setCreateModal(false); }} />
                                        <Button disabled={submitted} label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mb-2 w-7rem" />
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Dialog>}
                </div>
            </div>
        </div >
    );
};
export default EmergencyContact;
