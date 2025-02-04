import moment from 'moment-timezone';
import components from '../..';
import paper from '../../../../assets/images/No-data-pana.svg';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import { allPropertyList, createPropertyRequest, deleteComplexRequest, getPropertyDetailsRequest, propertyStatus } from '../../../../redux/slice/AdminSlices/complexSlice';
import CreatePropertyModel from './createPropertyModel';
import axios from 'axios';
import * as ExcelJS from 'exceljs'
const PropertyList = () => {
    const { SelectButton, Button, Column, DataTable, Dropdown, Image, toast, useEffect, useState, React, useNavigate, useDispatch, useSelector, InputText, BreadCrumb, Paginator, Toolbar } = components;
    const { isLoading, propertyList, isCreated, isActive } = useSelector((state) => state.complex);
    const { token } = useSelector((state) => state.auth);
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [complexDeleteId, setComplexDeleteId] = useState('');
    const [modal, setModal] = useState({
        isEditModalOpen: false,
        isViewModalOpen: false,
        isDeleteModalOpen: false,
        isModalOpen: false
    });
    const [value, setValue] = useState({
        id: '',
        complex_name: '',
        address: '',
        email: '',
        first_name: '',
        last_name: '',
        mobile_no: '',
        status: '1'
    });
    // const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'created_at', order: -1 }]);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'updated_at', order: -1 }]);
    const [filterValue, setFilterValue] = useState({
        property_name: '',
        mobile_number: ''
    });


    const [pagination, setPagination] = useState({
        current_page: 1,
        // order_column: 'updated_at',
        // order_direction: -1,
        per_page: 10,
        search: '',
        filter_value: {}
    });
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
        callAllPropertyList(paginationData);
    };
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate('/superadmin/dashboard');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Property List'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const handlePropertiesCreate = () => {
        setModal({
            ...modal,
            isModalOpen: true
        });
    };
    const handleSave = (data) => {
        dispatch(createPropertyRequest(data));
    };

    const editComplex = (rowData, isEdit) => {
        console.log(rowData, 'rowData');
        setValue({
            ...value,
            id: rowData?._id,
            complex_name: rowData?.complex_name,
            address: rowData?.address,
            first_name: rowData?.first_name,
            last_name: rowData?.last_name,
            email: rowData?.email,
            mobile_no: rowData?.mobile_no,
            status: rowData?.status?.toString()
        });
        if (isEdit) {
            setModal({
                ...modal,
                isEditModalOpen: true
            });
        } else {
            setModal({
                ...modal,
                isViewModalOpen: true
            });
        }
    };
    const confirmDeleteComplex = (complexId) => {
        setComplexDeleteId(complexId?._id);
        setModal({
            ...modal,
            isDeleteModalOpen: true
        });
    };
    const handleDeleteComplex = () => {
        dispatch(deleteComplexRequest(complexDeleteId));
        console.log(complexDeleteId, 'complexDeleteId');
        setModal({
            ...modal,
            isDeleteModalOpen: false
        });
    };
    const hideDialog = () => {
        setModal({
            ...modal,
            isModalOpen: false,
            isDeleteModalOpen: false,
            isEditModalOpen: false,
            isViewModalOpen: false
        });
    };

    const deleteComplexDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2" onClick={handleDeleteComplex} autoFocus />
        </>
    );
    const handleEdit = (id) => {
        // Dispatch the action from the slice
        dispatch(getPropertyDetailsRequest(id));
        navigate(`/superadmin/properties/edit/${id}`);
    };
    const actionBodyTemplate = (rowData) => {
        console.log(rowData, 'rowData');
        return (
            <div className="actions flex justify-content-center">
                <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} icon="pi pi-eye" className="p-button-rounded p-button-success p-button-text" id="eyes-icons" onClick={() => navigate(`/superadmin/properties/view/${rowData._id}`)} />
                <Button tooltip="Edit" tooltipOptions={{ position: 'bottom' }} icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-help" onClick={() => handleEdit(rowData._id)} />
                {/* <Button tooltip="View" tooltipOptions={{ position: 'bottom' }} className="p-button-rounded p-button-success p-button-text" id="eyes-icons" onClick={() => editComplex(rowData, false)} /> */}
                {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-text  p-button-danger" id="delete-icons" tooltip="Delete" tooltipOptions={{ position: 'bottom' }} onClick={() => confirmDeleteComplex(rowData)} /> */}
            </div>
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
        dispatch(allPropertyList(paginationData));
    };
    const leftToolbarTemplate = () => {
        // Check if no data is available after filtering
        // const isSearchDisabled = propertyList?.property_listing?.length === 0;

        const isSearchDisabled = propertyList?.property_listing?.length === 0 && pagination?.search === '';

        return (
            <div className="flex justify-content-end w-50">
                <InputText
                    placeholder="Search by property name"
                    value={pagination?.search}
                    onChange={(e) => onSearch(e.target.value)}
                    disabled={isSearchDisabled} // Disable search when no data is found
                />
                <Button
                    label="Clear"
                    icon="pi pi-filter-slash"
                    className="p-button-outlined w-7rem ml-2"
                    disabled={filterValue.property_name === '' && filterValue.mobile_number === '' && pagination?.search === '' }
                    onClick={() => {
                        setMultiSortMeta([{ field: 'updated_at', order: 1 }]);

                        setFilterValue({ property_name: '', mobile_number: '' });
                        let setDefaultPag = { ...pagination };
                        setDefaultPag.current_page = 1;
                        setDefaultPag.search = '';
                        setDefaultPag.filter_value = {};
                        setDefaultPag.order_column = 'updated_at';
                        setDefaultPag.order_direction = 1;
                        setPagination(setDefaultPag);
                        callAllPropertyList(setDefaultPag);
                    }}
                />
            </div>
        );
    };
    // const leftToolbarTemplate = () => {
    //     return (
    //         // <React.Fragment>
    //         <div className="flex justify-content-end w-50">
    //             <InputText placeholder="Search by property name" value={pagination?.search} onChange={(e) => onSearch(e.target.value)} />

    //             <Button
    //                 label="Clear"
    //                 icon="pi pi-filter-slash"
    //                 className="p-button-outlined w-7rem ml-2"
    //                 disabled={filterValue.property_name === '' && filterValue.mobile_number === '' && pagination?.search === ''}
    //                 onClick={() => {
    //                     setMultiSortMeta([{ field: 'updated_at', order: 1 }]);

    //                     setFilterValue({ property_name: '', mobile_number: '' });
    //                     let setDefaultPag = { ...pagination };
    //                     setDefaultPag.current_page = 1;
    //                     setDefaultPag.search = '';
    //                     setDefaultPag.filter_value = {};
    //                     setDefaultPag.order_column = 'updated_at';
    //                     setDefaultPag.order_direction = 1;
    //                     setPagination(setDefaultPag);
    //                     callAllPropertyList(setDefaultPag);
    //                 }}
    //             />
    //         </div>
    //         // </React.Fragment>
    //     );
    // };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={propertyList?.totalRecords === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2"
                    onClick={async () => {
                        // const url = `${BASE_URL_API}/property/excel`;
                        // fetch(url, {
                        //     method: 'GET',
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //         'Access-Control-Allow-Origin': '*',
                        //         'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        //         'Authorization': token
                        //     }
                        // })
                        //     .then(response => {
                        //         if (!response.ok) {
                        //             throw new Error('Network response was not ok');
                        //         }
                        //         return response.json(); // Assuming the response is JSON
                        //     })
                        //     .then(data => {
                        //         // Work with your data here
                        //         let rdata = data?.data;
                        //         console.log(rdata);
                        //         const url = window.URL.createObjectURL(new Blob([rdata?.data]));
                        //         // Create a temporary <a> element to trigger the download
                        //         const link = document.createElement('a');
                        //         link.href = url;
                        //         link.setAttribute('download', 'example.xlsx'); // Set the file name here
                        //         document.body.appendChild(link);
                        //         link.click();
                        //         // Clean up resources
                        //         link.parentNode.removeChild(link);
                        //         window.URL.revokeObjectURL(url);
                        //     })
                        //     .catch(error => {
                        //         console.error('Fetch request failed', error);
                        //     });
                        const { data } = await axios.post(`${BASE_URL_API}/property/excel`, pagination, {
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
                            property_logo: {
                                text: e.property_logo, // Display text for the hyperlink (you can change this if needed)
                                hyperlink: e.property_logo, // URL for the hyperlink
                                tooltip: 'Click to view logo' // Optional tooltip for the hyperlink
                            },
                            property_name: e.property_name,
                            property_type: e.property_type,
                            property_address: e.property_address,
                            chairman_name: e.name,
                            email: e.email,
                            mobile_number: e.mobile_number,
                            created_at: moment(e.created_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                            updated_at: moment(e.updated_at).utcOffset('+05:30').format('DD-MMM-YYYY, LT'),
                            property_status: e.property_status === 'Active' ? e.property_status : 'Inactive'
                        }));
                        // if(data)
                        const workbook = new ExcelJS.Workbook();
                        const worksheet = workbook.addWorksheet('Property List');
                        const headerRow = worksheet.addRow(['Image', 'Property Name', 'Property Type', 'Property Address', 'Chairman Name', 'Email', 'Mobile Number', 'Created At', 'Updated At', 'Status']);
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
                                {
                                    text: report.property_logo.text,
                                    hyperlink: report.property_logo.hyperlink,
                                    tooltip: report.property_logo.tooltip
                                },
                                report.property_name,
                                report.property_type,
                                report.property_address,
                                report.chairman_name,
                                report.email,
                                report.mobile_number,
                                report.created_at,
                                report.updated_at,
                                report.property_status
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
                                a.download = 'property_list.xlsx';
                                a.click();
                                window.URL.revokeObjectURL(url);
                            })
                            .catch((err) => {
                                console.error('Error generating Excel file:', err);
                            });
                    }}

                />
                <Button
                    label="Create Property"
                    icon="pi pi-plus"
                    className="p-button-outlined p-button-success mr-2 "
                    // onClick={() => handlePropertiesCreate()}
                    onClick={() => navigate('/superadmin/properties/add')}
                />
            </React.Fragment>
        );
        // pagination;
    };
    const centerToolbarTemplate = () => {
        try {
            return (
                <React.Fragment>
                    <SelectButton
                        value={pagination?.filter_value.property_status ? pagination?.filter_value.property_status : 'all'}
                        // value={"Active"}
                        optionLabel="name"
                        options={[
                            { name: 'All', value: 'all' },
                            { name: 'Active', value: 'Active' },
                            { name: 'Inactive', value: 'In-Active' }
                        ]}
                        onChange={(e) => {
                            if (e.value === 'all') {
                                if (pagination?.filter_value?.property_status !== null && pagination?.filter_value?.property_status !== undefined) {
                                    let tablePagi = { ...pagination };
                                    delete tablePagi.filter_value.property_status;
                                    callAllPropertyList(tablePagi);
                                    setPagination(tablePagi);
                                }
                            } else if (e.value !== 'all' && e.value) {
                                let tablePagi = { ...pagination };
                                tablePagi.filter_value.property_status = e.value;
                                callAllPropertyList(tablePagi);
                                setPagination(tablePagi);
                            }
                        }}
                        className="select_button_custome"
                    />
                </React.Fragment>
            );
        } catch (error) {
            console.log(error);
        }
    };
    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>;
    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <div className="solid_border_drop">
                    <Dropdown
                        value={rowData?.property_status}
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'Inactive', value: 'In-Active' }
                        ]}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(e) => {
                            dispatch(propertyStatus(rowData?._id, { property_status: e.value }));
                        }}
                        style={{ width: '100%', background: 'transparent' }}
                        placeholder="Select a Status"
                        className={`editableDrop ${rowData?.property_status === 'Active' ? 'editableDropGreen' : 'editableDropRed'}`}
                    />
                </div>
            </>
        );
    };

    useEffect(() => {

        let paginationData = { ...pagination };

        const storedPagination = localStorage.getItem('userStatus');

        if (storedPagination) {
            paginationData.filter_value ={property_status : storedPagination};

        }
        paginationData.order_column = multiSortMeta[0]['field'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        paginationData.order_direction = multiSortMeta[0]['order'];
        setModal({
            ...modal,
            isModalOpen: false,
            isEditModalOpen: false,
            isDeleteModalOpen: false
        });
        setPagination(paginationData);
        callAllPropertyList(paginationData);
        if (storedPagination) {
            localStorage.removeItem('userStatus');

        }
    }, [dispatch, isCreated, isActive]);
    const callAllPropertyList = (val) => {
        console.log("I am in out");
        dispatch(allPropertyList(val));
    };
    const getFirstLettersOfFirstTwoWords = (str) => {
        let words = str.split(' ');

        let firstLetterFirstWord = words[0].charAt(0).toUpperCase();
        let firstLetterSecondWord = '';
        if (words.length > 1) {
            firstLetterSecondWord = words[1].charAt(0).toUpperCase();
        }

        let result = firstLetterFirstWord + firstLetterSecondWord;

        return result;
    };

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Property List</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {propertyList?.property_listing && propertyList?.property_listing?.length > 0 ? (
                        <DataTable
                            value={propertyList?.property_listing}
                            showGridlines
                            stripedRows
                            dataKey="_id"
                            className="datatable-responsive"
                            emptyMessage={
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                    <img src={paper} alt="No Record Found" style={{ height: '20rem', width: '20rem', marginBottom: '10px' }} />
                                    <div style={{ textAlign: 'center', fontSize: '1rem', color: '#4A4A4A' }}>No Record Found.</div>
                                </div>
                            }
                            header={header}
                            scroll="scroll"
                            tableStyle={{ minWidth: '60rem' }}
                            sortMode="multiple"
                            onSort={(e) => {
                                let paginationData = { ...pagination };
                                paginationData.order_column = e.multiSortMeta[0]['field'];
                                paginationData.order_direction = e.multiSortMeta[0]['order'];
                                setPagination(paginationData);
                                setMultiSortMeta(e.multiSortMeta);
                                callAllPropertyList(paginationData);
                                // rgba(0, 0, 0, 0.04)
                            }}
                            multiSortMeta={multiSortMeta}
                        >
                            <Column
                                field="property_logo"
                                header="Image"
                                headerStyle={{ width: '4%' }}
                                body={(rowData) =>
                                    rowData?.property_logo ? (
                                        <div className="flex justify-content-center align-items-center" style={{ width: '4.5rem', height: '4.5rem' }}>
                                            <Image src={rowData?.property_logo} height="60" width="60" preview />
                                        </div>
                                    ) : (
                                        <div className="flex justify-content-center align-items-center text-3xl font-bold border-circle" style={{ width: '4.5rem', height: '4.5rem', background: '#e8eaf6', color: '#0d47a1' }}>
                                            {getFirstLettersOfFirstTwoWords(rowData.property_name)}
                                        </div>
                                    )
                                }
                            ></Column>
                            <Column
                                field="property_name"
                                header="Property Name"
                                headerStyle={{ width: '15%' }}
                                sortable
                                // filter
                                className='capitalize'
                                showFilterOperator={false}
                                showAddButton={false}
                                showFilterMatchModes={false}
                                showApplyButton={false}
                                showClearButton={false}
                                filterElement={() => (
                                    <div>
                                        <InputText
                                            id="property_name"
                                            name="property_name"
                                            autoComplete="off"
                                            placeholder="Search.."
                                            value={filterValue.property_name}
                                            onChange={(e) => {
                                                let collectvalue = { ...filterValue };
                                                collectvalue.property_name = e.target.value;
                                                setFilterValue(collectvalue);
                                            }}
                                        />
                                        <div className="flex" style={{ marginTop: '1rem' }}>
                                            <Button
                                                label="Clear"
                                                icon="pi pi-filter-slash"
                                                className="p-button-outlined mr-2 mb-2 w-7rem"
                                                style={{ color: '#868686' }}
                                                onClick={() => {
                                                    let collect = { ...filterValue };
                                                    collect.property_name = '';
                                                    setFilterValue(collect);
                                                    if (pagination?.filter_value?.property_name !== null && pagination?.filter_value?.property_name !== undefined) {
                                                        let tablePagi = { ...pagination };
                                                        delete tablePagi.filter_value.property_name;
                                                        callAllPropertyList(tablePagi);
                                                        setPagination(tablePagi);
                                                    }
                                                }}
                                            />
                                            <Button
                                                label="Apply"
                                                type="submit"
                                                icon="pi pi-check"
                                                className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                                onClick={() => {
                                                    let collect = pagination.filter_value;
                                                    collect.property_name = filterValue?.property_name.trim();
                                                    if (collect.property_name && collect.property_name !== '') {
                                                        let tablePagi = { ...pagination };
                                                        if (tablePagi.filter_value.property_name === undefined) {
                                                            tablePagi.filter_value = { category_name: filterValue?.property_name.trim() };
                                                        } else {
                                                            tablePagi.filter_value = collect;
                                                        }
                                                        callAllPropertyList(tablePagi);
                                                        setPagination(tablePagi);
                                                    } else if (collect.property_name === '') {
                                                        let tablePagi = { ...pagination };
                                                        delete tablePagi.filter_value.property_name;
                                                        callAllPropertyList(tablePagi);
                                                        setPagination(tablePagi);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            ></Column>
                            <Column field="property_type" header="Property Type" headerStyle={{ width: '15%' }} sortable></Column>
                            <Column field="address" className='capitalize' header="Property Address" headerStyle={{ width: '15%' }} sortable></Column>
                            <Column field="name" className='capitalize' header="Chairman Name" headerStyle={{ width: '15%' }} sortable></Column>
                            <Column field="email"  header="Email" body={(rowData) => <a href={`mailto:${rowData.email}`} className='text-blue-500'>{rowData.email}</a>} sortable></Column>
                            <Column
                                field="mobile_number"
                                header="Contact Number"
                                // sortable
                                // filter
                                className="headerCellEnd"
                                        bodyStyle={{ textAlign: 'right' }}
                                body={(rowData) => <a href={`tel:${rowData.mobile_number}`}>{rowData.mobile_number}</a>}
                                showFilterOperator={false}
                                showAddButton={false}
                                showFilterMatchModes={false}
                                showApplyButton={false}
                                showClearButton={false}
                                filterElement={() => (
                                    <div>
                                        <InputText
                                            id="property_name"
                                            name="property_name"
                                            autoComplete="off"
                                            placeholder="Search.."
                                            value={filterValue.mobile_number}
                                            onChange={(e) => {
                                                let collectvalue = { ...filterValue };
                                                collectvalue.mobile_number = e.target.value.replace(/[^0-9]/g, '').length <= 10 ? e.target.value.replace(/[^0-9]/g, '') : filterValue.mobile_number;
                                                setFilterValue(collectvalue);
                                            }}
                                        />
                                        <div className="flex" style={{ marginTop: '1rem' }}>
                                            <Button
                                                label="Clear"
                                                icon="pi pi-filter-slash"
                                                className="p-button-outlined mr-2 mb-2 w-7rem"
                                                style={{ color: '#868686' }}
                                                onClick={() => {
                                                    let collect = { ...filterValue };
                                                    collect.mobile_number = '';
                                                    setFilterValue(collect);
                                                    if (pagination?.filter_value?.mobile_number !== null && pagination?.filter_value?.mobile_number !== undefined) {
                                                        let tablePagi = { ...pagination };
                                                        delete tablePagi.filter_value.mobile_number;
                                                        callAllPropertyList(tablePagi);
                                                        setPagination(tablePagi);
                                                    }
                                                }}
                                            />
                                            <Button
                                                // disabled={submitted}
                                                label="Apply"
                                                type="submit"
                                                icon="pi pi-check"
                                                className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                                onClick={() => {
                                                    let collect = pagination.filter_value;
                                                    collect.mobile_number = filterValue?.mobile_number.trim();
                                                    if (collect.mobile_number && collect.mobile_number !== '') {
                                                        let tablePagi = { ...pagination };
                                                        if (tablePagi.filter_value.mobile_number === undefined) {
                                                            tablePagi.filter_value = { mobile_number: filterValue?.mobile_number.trim() };
                                                        } else {
                                                            tablePagi.filter_value = collect;
                                                        }
                                                        callAllPropertyList(tablePagi);
                                                        setPagination(tablePagi);
                                                    } else if (collect.mobile_number === '') {
                                                        let tablePagi = { ...pagination };
                                                        delete tablePagi.filter_value.mobile_number;
                                                        callAllPropertyList(tablePagi);
                                                        setPagination(tablePagi);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            ></Column>
                            <Column field="created_at" header="Created At" sortable body={(rowData) => moment(rowData.created_at).utcOffset('+05:30').format('D MMM YY, LT')}></Column>
                            <Column field="updated_at" header="Updated At" sortable body={(rowData) => moment(rowData.updated_at).utcOffset('+05:30').format('D MMM YY, LT')}></Column>
                            <Column field="property_status" body={statusBodyTemplate} header="Status" headerStyle={{ width: '10%' }} sortable></Column>
                            <Column header="Actions" className="action" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate}></Column>
                        </DataTable>
                    ) : (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">{propertyList?.property_listing && propertyList?.property_listing.length === 0 && <img src={paper} className="h-20rem w-20rem m-auto" />}</div>
                                    {propertyList?.property_listing && propertyList?.property_listing.length === 0 && <div className="text-center text-2xl">{'No Record Found.'}</div>}
                                </>
                            )}
                            value={[]}
                            header={header}
                        ></DataTable>
                    )}
                    {propertyList?.totalRecords > 10 && <Paginator template={template} first={first} rows={rows} totalRecords={propertyList?.totalRecords} onPageChange={handlePageChange} rowsPerPageOptions={[10, 25, 50, 100, 500]}></Paginator>}
                    {modal?.isModalOpen && <CreatePropertyModel onHide={hideDialog} handleSave={handleSave} />}
                    <DeleteModal isOpenDialog={modal.isDeleteModalOpen} modalFooter={deleteComplexDialogFooter} hideModal={hideDialog} modalDescription={'Are you sure you want to delete?'} />
                </div>
            </div>
        </div>
    );
};
export default PropertyList;
