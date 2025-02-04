import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getsalesmanData, salesmanRemoveRequest, updateSalesmanStatusRequest } from '../../../../redux/slice/AdminSlices/salesmanSlice';
import DeleteModal from '../../../../components/DeleteModal';
import components from '../..';
import paper from '../../../../assets/images/No-data-pana.svg';

const SalesmanList = () => {
    const { Button, Column, DataTable, InputText, Toolbar, Dropdown, BreadCrumb, SelectButton } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { salesmanData = [], loading, totalRecords } = useSelector((store) => store.salesman);
    const [pagination, setPagination] = useState({ current_page: 1, per_page: 10, search: '' });
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [numValues, setNumValues] = useState({ num1: 0, num2: 0 });
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');

    // Fetch salesmen data
    const fetchSalesmanData = useCallback(() => {
        const reqData = {
            order_column: 'updated_at',
            order_direction: -1,
            search: pagination.search,
            per_page: pagination.per_page,
            current_page: pagination.current_page,
            listType: pagination.filter_value?.property_status === 'Active' ? 1 : pagination.filter_value?.property_status === 'InActive' ? 2 : 0
        };
        dispatch(getsalesmanData(reqData));
    }, [pagination, dispatch]);

    useEffect(() => {
        fetchSalesmanData();
    }, [fetchSalesmanData]);

    const handlePageChange = (event) => {
        setPagination((prev) => ({
            ...prev,
            current_page: event.page + 1,
            per_page: event.rows
        }));
    };

    const handleSearch = (value) => {
        setPagination((prev) => ({
            ...prev,
            search: value,
            current_page: 1
        }));
    };

    const updateSalesmanStatus = async (id, status) => {
        try {
            await dispatch(updateSalesmanStatusRequest(id, status));
            fetchSalesmanData();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const statusBodyTemplate = (rowData) => {
        // Determine the current status, defaulting to 'active' if not present
        const currentStatus = rowData.status || 'Active';

        return (
            <>
                <div className="solid_border_drop">
                    <Dropdown
                        value={currentStatus}
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'InActive', value: 'InActive' }
                        ]}
                        onChange={(e) => updateSalesmanStatus(rowData._id, e.value)}
                        style={{ width: '100%', background: 'transparent' }}
                        className={`editableDrop ${currentStatus === 'Active' ? 'editableDropGreen' : 'editableDropRed'}`}
                    />
                </div>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => (
        <div className="actions flex justify-content-center">
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-help" onClick={() => navigate(`/superadmin/sales/edit/${rowData._id}`)} />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger"
                onClick={() => {
                    setDeleteModal(true);
                    setDeleteId(rowData._id);
                    setNumValues({
                        num1: Math.floor(Math.random() * 10),
                        num2: Math.floor(Math.random() * 10)
                    });
                }}
            />
        </div>
    );

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
                onClick={async () => {
                    if (numValues.num1 + numValues.num2 === sumValue) {
                        try {
                            await dispatch(salesmanRemoveRequest(deleteId));
                            fetchSalesmanData();
                            setDeleteModal(false);
                            setDeleteId(null);
                            setSumValue(null);
                            setSumValueError('');
                        } catch (error) {
                            console.error('Error deleting salesman:', error);
                        }
                    } else {
                        setSumValueError('Wrong Answer!');
                    }
                }}
            />
        </>
    );


    const leftToolbarTemplate = () => {
        return (
            <div className="flex justify-content-end w-50">
                <InputText
                    placeholder="Search Employee"
                    value={pagination.search}
                    disabled={!pagination.search && !(salesmanData && salesmanData.length > 0)}
                    onChange={(e) => handleSearch(e.target.value)}
                />

                <Button
                    label="Clear"
                    icon="pi pi-filter-slash"
                    className="p-button-outlined w-7rem ml-2"
                    disabled={pagination.search === ''} // Disable when no search value is present
                    onClick={() => {
                        let setDefaultPag = { ...pagination };
                        setDefaultPag.current_page = 1;
                        setDefaultPag.search = ''; // Reset the search value
                        setPagination(setDefaultPag);
                        handleSearch(''); // Clear the search filter
                    }}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => <Button label="Create Employee" icon="pi pi-plus" className="p-button-outlined p-button-success" onClick={() => navigate('/superadmin/sales/add')} />;

    const centerToolbarTemplate = () => {
        try {
            return (
                <React.Fragment>
                        <SelectButton
                            value={pagination.filter_value?.property_status || 'all'}
                            optionLabel="name"
                            options={[
                                { name: 'All', value: 'all' },
                                { name: 'Active', value: 'Active' },
                                { name: 'Inactive', value: 'InActive' }
                            ]}
                            onChange={(e) => {
                                let tablePagi = { ...pagination };

                                if (e.value === 'all') {
                                    delete tablePagi.filter_value?.property_status;
                                } else {
                                    tablePagi.filter_value = tablePagi.filter_value || {};
                                    tablePagi.filter_value.property_status = e.value;
                                }

                                fetchSalesmanData(tablePagi);
                                setPagination(tablePagi);
                            }}
                            className="select_button_custome"
                        />
                </React.Fragment>
            );
        } catch (error) {
            console.log(error);
        }
    };

    const header = <Toolbar start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate} />;

    const breadcrumbItems = [
        {
            label: 'Employee Management List'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];

    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate('/superadmin/dashboard');
        }
    };
    return (
        <div className="salesman-management-ui">
            <div className="flex flex-row w-full">
                <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Employee List</h5>
                <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {salesmanData && salesmanData.length > 0 ? (
                        <DataTable
                            value={salesmanData}
                            showGridlines
                            stripedRows
                            dataKey="_id"
                            emptyMessage={
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                    <img src={paper} alt="No Record Found" style={{ height: '20rem', width: '20rem', marginBottom: '10px' }} />
                                    <div style={{ textAlign: 'center', fontSize: '1rem', color: '#4A4A4A' }}>No Record Found.</div>
                                </div>
                            }
                            header={header}
                            loading={loading}
                        >
                            <Column field="name" className='capitalize' header="Name" sortable />
                            <Column field="contact_no" header="Contact Number" className="headerCellEnd"
                                        bodyStyle={{ textAlign: 'right' }} body={(rowData) => <a href={`tel:${rowData.contact_no}`}>{rowData.contact_no}</a>} />
                            <Column field="email" header="Email" body={(rowData) => <a href={`mailto:${rowData.email}`}>{rowData.email}</a>} sortable />
                            <Column field="role" className='capitalize' header="Role" sortable />
                            <Column field="status" body={statusBodyTemplate} header="Status" />
                            <Column header="Actions"  className="actions flex justify-content-center" body={actionBodyTemplate} />
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{salesmanData && salesmanData.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {salesmanData && salesmanData.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
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
                        modalDescription="Are you sure you want to delete this salesman?"
                    />
                </div>
            </div>
        </div>
    );
};

export default SalesmanList;
