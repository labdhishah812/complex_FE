import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import paper from '../../../../assets/images/No-data-pana.svg';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getBuildingRules, buildingRulesCreateRequest, buildingRulesUpdateRequest, removeBuildingRules } from '../../../../redux/slice/AdminSlices/buildingRulesSlice';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
import moment from 'moment-timezone';
const BuildingRules = () => {
    const { Dialog, Button, Column, DataTable, InputText, classNames, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb, Paginator, Toolbar } = components;
    const { token,loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isDelete, isLoading, buildingRulesList } = useSelector((state) => state.buildingRules);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const [submitted, setSubmitted] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [formValue, setFormValue] = useState({
        id: '',
        title: '',
        description: null
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
        per_page: 10,
        search: ''
    });
    const BuildingRulesSchema = Yup.object().shape({
        title: Yup.string().trim().nullable().required('Please enter title.'),
        description: Yup.string().trim().nullable().required('Please enter description.')
    });
    const breadcrumbItems = [
        {
            label: 'Building Rules'
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
                    let check = b.permission.find((x) => x.module_name === 'committee-member')?.module_access.findIndex((y) => y === permissionName);
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
        setCreateModal(false);
        callBuildingRulesList(paginationData);
    }, [dispatch, isCreated, isDelete]);

    const callBuildingRulesList = (val) => {
        try {
            dispatch(getBuildingRules(val));
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
        callBuildingRulesList(paginationData);
    };
    const leftToolbarTemplate = () => {
        const isSearchDisabled = buildingRulesList?.BuildingRules.length === 0 && pagination?.search === '';
        return (
            <React.Fragment>
                <div className="flex justify-content-end w-27rem">
                    <span className="p-input-icon-right">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search by Title, Description" value={pagination?.search || ''} onChange={(e) => onSearch(e.target.value)} style={{ width: '20rem' }} disabled={isSearchDisabled} />
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
                    disabled={buildingRulesList?.BuildingRules.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        const { data } = await axios.post(`${BASE_URL_API}/buildingrules/excel`, pagination, {
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
                            const worksheet = workbook.addWorksheet('Building Rules List');

                            // Define headers for complaints
                            const headerRow = worksheet.addRow(['Title', 'Description', 'Created Date', 'Updated Date']);

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
                                //const plainDescription = complaint.description ? new DOMParser().parseFromString(complaint.description, 'text/html').body.textContent.trim() : '-';

                                const row = worksheet.addRow([
                                    complaint.title || '-',
                                    complaint.description || '-',
                                    moment(complaint.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                                    moment(complaint.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT')
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
                                    a.download = 'building_Rules.xlsx';
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
                    label="Create Building Rules"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2 "
                    onClick={() => {
                        setCreateModal(true);
                        setFormValue({
                            id: '',
                            title: '',
                            description: null
                        });
                        navigate('/property-management/buildingrules/buildingrules-create');
                    }}
                />
                {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
            </React.Fragment>
        );
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={getRoles('create') && rightToolbarTemplate}></Toolbar>;
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
        callBuildingRulesList(paginationData);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex justify-content-center">
                <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-text" id="eyes-icons" onClick={() => navigate(`/property-management/buildingrules/buildingrules-view/${rowData?._id}`)} />
                {getRoles('update') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text  p-button-help"
                        // onClick={() => {
                        //     let data = { ...formValue };
                        //     data.id = rowData?._id;
                        //     data.title = rowData?.title;
                        //     data.description = rowData?.description;
                        //     setFormValue(data);
                        //     setCreateModal(true);
                        // }}
                        onClick={() => navigate(`/property-management/buildingrules/buildingrules-update/${rowData?._id}`)}
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
                        dispatch(removeBuildingRules(deleteId._id));
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
    const descriptionBodyTemplate = (rowData) => {
        const fullDescription = rowData.description || '';
        const maxLength = 80; // You can adjust this number to show more or less characters

        const truncatedDescription = fullDescription.length > maxLength ? `${fullDescription.substring(0, maxLength)}...` : fullDescription;

        return (
            <div className="description-cell" title={fullDescription}>
                {truncatedDescription}
            </div>
        );
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Building Rules</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {buildingRulesList?.BuildingRules && buildingRulesList?.BuildingRules.length > 0 ? (
                        <DataTable
                            value={buildingRulesList?.BuildingRules ? buildingRulesList?.BuildingRules : []}
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
                                callBuildingRulesList(paginationData);
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            <Column field="title" className="h-50 capitalize" header="Title" sortable></Column>
                            <Column field="description" className="capitalize" header="Description" body={descriptionBodyTemplate} style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />
                            {(getRoles('update') || getRoles('delete')) && <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>}
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{buildingRulesList?.BuildingRules && buildingRulesList?.BuildingRules.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {buildingRulesList?.BuildingRules && buildingRulesList?.BuildingRules.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {buildingRulesList?.totalRecords > 10 && (
                        <Paginator template={template} first={first} rows={rows} totalRecords={buildingRulesList?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>
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
                        modalDescription="Are you sure you want to delete this Emergency contract?"
                    />
                    {createModal && (
                        <Dialog
                            visible={createModal}
                            style={{ width: '30vw' }}
                            draggable={false}
                            header={formValue.id !== '' ? 'Edit Building Rules' : 'Create Building Rules'}
                            modal
                            className="p-fluid"
                            onHide={() => {
                                setCreateModal(false);
                            }}
                        >
                            <Formik
                                initialValues={formValue}
                                validationSchema={BuildingRulesSchema}
                                enableReinitialize
                                onSubmit={(values) => {
                                    setSubmitted(true);
                                    setTimeout(() => {
                                        setSubmitted(false);
                                    }, 5000);

                                    values?.id !== '' && dispatch(buildingRulesUpdateRequest(values?.id, values));
                                    values?.id === '' && dispatch(buildingRulesCreateRequest(values));
                                }}
                            >
                                {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                                    <Form>
                                        <div className="grid p-fluid mt-1">
                                            <div className="field col-12 mb-0">
                                                <label htmlFor="title" className="required">
                                                    Title
                                                </label>
                                                <InputText id="title" name="title" placeholder="Enter Title" type="text" value={values?.title} onChange={handleChange} className={classNames({ 'p-invalid': errors.title && touched.title })} />
                                                <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                    {errors.title && touched.title ? errors.title : ''}
                                                </div>
                                            </div>
                                            <div className="field col-12 mb-1">
                                                <label htmlFor="description" className="required">
                                                    Description
                                                </label>
                                                <InputTextarea
                                                    rows="3"
                                                    cols="20"
                                                    id="description"
                                                    type="tel"
                                                    placeholder="Enter Description"
                                                    name="description"
                                                    value={values?.description}
                                                    useGrouping={false}
                                                    onChange={handleChange}
                                                    style={{ resize: 'none', width: '100%' }}
                                                    className={classNames({ 'p-invalid': errors.description && touched.description })}
                                                />
                                                <div className="p-invalid error text-xs" style={{ minHeight: '1.5rem' }}>
                                                    {errors.description && touched.description ? errors.description : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="field mb-1 flex justify-content-end">
                                            <Button
                                                label="Cancel"
                                                icon="pi pi-times"
                                                className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                                onClick={() => {
                                                    setCreateModal(false);
                                                }}
                                            />
                                            <Button disabled={submitted} label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mb-2 w-7rem" />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
};
export default BuildingRules;
