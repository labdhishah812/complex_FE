import axios from 'axios';
import components from '../..';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useRef } from 'react';
import DeleteModal from '../../../../components/DeleteModal';
import moment from 'moment-timezone';
import { resolutionRemoveRequest, setDefaultState } from '../../../../redux/slice/AdminSlices/resolutionSlice';
import paper from '../../../../assets/images/No-data-pana.svg';
import Loader from '../../../../components/Loader';
import { limitTextTo15Words, limitTextTo7Words } from '../../../../components/Moment';
import * as ExcelJS from 'exceljs';

const Resolutions = () => {
    const { SelectButton, Image, Button, DataTable, Column, InputText, React, useNavigate, BreadCrumb, Toolbar, Paginator, useState, useEffect, useDispatch, useSelector } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const { token, loginDetails } = useSelector((state) => state.auth);
    const { isDelete, resolutionData } = useSelector((state) => state.resolution);

    // New state for search
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResolutions, setFilteredResolutions] = useState([]);

    const [resolutionsPageData, setResolutionsPageData] = useState({ resolutions: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [numValues, setNumValues] = useState({
        num1: 0,
        num2: 0
    });
    const loaderRef = useRef(null);
    useEffect(() => {
        apiCall();
        dispatch(setDefaultState());
    }, [page]);
    useEffect(() => {
        if (isDelete) {
            dispatch(setDefaultState());
            setResolutionsPageData((prevData) => ({
                ...prevData,
                resolutions: [] // Append new notifications
            }));
            setPage(1);
            apiCall();
        }
    }, [isDelete]);
    const apiCall = async () => {
        if (!hasMore || isLoading) return; // Prevent multiple calls at once

        try {
            setIsLoading(true); // Set loading to true while fetching data

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            };

            // Fetch notifications for the current page
            const { data } = await axios.get(`${BASE_URL_API}/resolution/read?limit=10&page=${page}`, config);

            if (data?.statusCode === 200) {
                const newResolutions = data?.data?.resolution;

                if (newResolutions?.length > 0) {
                    setResolutionsPageData((prevData) => ({
                        ...prevData,
                        resolutions: [...prevData.resolutions, ...newResolutions] // Append new notifications
                    }));

                    // If the fetched notifications are less than the limit, stop further fetching
                    if (newResolutions.length < 5) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false); // No more notifications to fetch
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // Set loading to false after fetching data
        }
    };
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    setPage((prevPage) => prevPage + 1); // Increment the page number to fetch the next set
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current); // Observe the loader div
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore, isLoading]);
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'Resolutions'
        }
    ];
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
                <Button
                    tooltip="View"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text"
                    id="eyes-icons"
                    onClick={() => {
                        navigate(`/property-management/resolutions/resolutions-view/${rowData._id}`);
                    }}
                />
                {getRoles('update') && (
                    <Button
                        tooltip="Edit"
                        tooltipOptions={{ position: 'bottom' }}
                        icon="pi pi-pencil"
                        id="edits-icons"
                        className="p-button-rounded p-button-text  p-button-help"
                        onClick={() => navigate(`/property-management/resolutions/resolutions-update/${rowData._id}`)}
                        // onClick={() => {
                        //     setModal(true);
                        //     steEdit(rowData);
                        // }}
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
                            setDeleteId(rowData._id);
                            dynamicNumber();
                            // dispatch(resolutionRemoveRequest());
                        }}
                    />
                )}
            </div>
        );
    };
    const getRoles = (permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'user-property-assign')?.module_access.findIndex((y) => y === permissionName);
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
    // const deleteUserDialogFooter = () => {
    //     try {
    //         return (
    //             <>
    //                 <Button
    //                     label="No"
    //                     icon="pi pi-times"
    //                     className="p-button-outlined p-button-danger mr-2 mb-2"
    //                     onClick={() => {
    //                         setDeleteId(null);
    //                         setSumValueError("");
    //                         setSumValue(null);
    //                     }}
    //                 />
    //                 <Button
    //                     label="Yes"
    //                     icon="pi pi-check"
    //                     className="p-button-outlined p-button-success mr-2 mb-2"
    //                     onClick={() => {
    //                         if (numValues?.num1 + numValues?.num2 === sumValue) {
    //                             setSumValueError("")
    //                             setSumValue(null);
    //                             // setDeleteModal(false);
    //                             // dispatch(vehicleRemoveRequest(deleteId));
    //                             setDeleteId(null);
    //                             dispatch(resolutionRemoveRequest(deleteId));
    //                         } else {
    //                             setSumValueError("Wrong Answer !")
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
                                setSumValue(null);
                                setDeleteId(null);
                                dispatch(resolutionRemoveRequest(deleteId))
                                    .then(() => {
                                        window.location.reload(); // Reload the page after a successful delete
                                    })
                                    .catch((error) => {
                                        console.error('Error while deleting:', error);
                                    });
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

    const convertDate = (dateStr) => {
        try {
            const formattedDate = moment(dateStr).format('D MMM YYYY');
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (searchQuery) {
            const filtered = resolutionsPageData.resolutions.filter((group) =>
                group.resolution.some(
                    (resolution) => resolution.title.toLowerCase().includes(searchQuery.toLowerCase()) || resolution.description.toLowerCase().includes(searchQuery.toLowerCase()) || resolution.number.toString().includes(searchQuery)
                )
            );
            setFilteredResolutions(filtered);
        } else {
            setFilteredResolutions(resolutionsPageData.resolutions);
        }
    }, [searchQuery, resolutionsPageData]);

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={resolutionsPageData?.resolutions?.length === 0}
                    label="Export"
                    icon="pi pi-download"
                    className="p-button-outlined p-button-help mr-2 my-3 m-auto"
                    onClick={async () => {
                        try {
                            // Create workbook and worksheet
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Resolutions');

                            // Define headers
                            const headers = ['Date', 'Resolution No.', 'Title', 'Description'];
                            const headerRow = worksheet.addRow(headers);

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
                                cell.alignment = {
                                    vertical: 'middle',
                                    horizontal: 'center'
                                };
                            });

                            // Add data rows directly from resolutionsPageData
                            resolutionsPageData.resolutions.forEach((dateGroup) => {
                                const date = convertDate(dateGroup.date);

                                dateGroup.resolution.forEach((resolution) => {
                                    worksheet.addRow([
                                        date,
                                        `Sr.No.: ${resolution.number || '-'}`,
                                        resolution.title || '-',
                                        resolution.description || '-'
                                    ]);
                                });
                            });

                            // Set column widths
                            worksheet.columns.forEach((column, index) => {
                                const widths = [15, 15, 30, 50];
                                column.width = widths[index] || 20;
                            });

                            // Generate and download Excel file
                            const buffer = await workbook.xlsx.writeBuffer();
                            const blob = new Blob([buffer], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `resolutions_list.xlsx`;
                            a.click();
                            window.URL.revokeObjectURL(url);

                        } catch (error) {
                            console.error('Error generating Excel file:', error);
                        }
                    }}
                />
                {getRoles('create') && (
                    <Button
                        label="Create Resolution"
                        icon="pi pi-plus"
                        className="p-button-outlined p-button-success mr-2"
                        onClick={() => navigate('/property-management/resolutions/resolutions-create')}
                    />
                )}
            </React.Fragment>
        );
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="flex justify-content-start w-20rem">
                    <span className="p-input-icon-right w-full">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search Resolutions" type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" disabled={resolutionsPageData?.resolutions.length === 0} />
                    </span>
                </div>
            </React.Fragment>
        );
    };

    const header = <Toolbar className="create-delete-btn" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>;
    return (
        <div className="relative min-h-full">
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Resolutions</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>

            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {/* Header toolbar with search and create button */}
                    {header}

                    {(searchQuery ? filteredResolutions : resolutionsPageData?.resolutions).length === 0 && !isLoading ? (
                        <DataTable
                            emptyMessage={() => (
                                <>
                                    <div className="flex-wrap flex">
                                        <img src={paper} className="h-20rem w-20rem m-auto" alt="No Records" />
                                    </div>
                                    <div className="text-center text-2xl">{searchQuery ? 'No Matching Records Found.' : 'No Record Found.'}</div>
                                </>
                            )}
                            value={[]}
                        />
                    ) : (
                        <Accordion activeIndex={0}>
                            {(searchQuery ? filteredResolutions : resolutionsPageData?.resolutions).map(
                                (x) =>
                                    x.resolution &&
                                    x.resolution.length > 0 && (
                                        <AccordionTab key={x.date} header={x.date ? convertDate(x.date) : '-'} className="mb-3">
                                            <DataTable value={x.resolution ? x.resolution : []} showGridlines stripedRows emptyMessage="No Record Found." scroll="scroll" tableStyle={{ minWidth: '60rem' }} sortMode="multiple" size="normal">
                                                <Column field="resolutions" header="Tharav No." headerStyle={{ width: '7%' }} body={(rowData) => `Sr.No.: ${rowData?.number ? rowData?.number : '-'}`} />
                                                <Column field="title" className="h-50 capitalize-first-letter" body={(rowData)=>{return rowData.title ? limitTextTo7Words(rowData.title) : "-";}} header="Title" headerStyle={{ width: '25%' }} />
                                                <Column
                                                    field="description"
                                                    className="capitalize-first-letter wrap-text text-container"
                                                    header="Description"
                                                    body={(rowData) => {
                                                        return rowData.description ? limitTextTo15Words(rowData.description) : "-";
                                                    }}
                                                />
                                                {(getRoles('update') || getRoles('delete') || getRoles('read')) && <Column field="" header="Action" className="headerCellCenter" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate} />}
                                            </DataTable>
                                        </AccordionTab>
                                    )
                            )}
                        </Accordion>
                    )}

                    <div ref={loaderRef} className="flex justify-content-center mt-4">
                    {isLoading && <Loader isLoading />}
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpenDialog={deleteId !== null}
                modalFooter={() => deleteUserDialogFooter()}
                hideModal={() => {
                    setDeleteId(null);
                    setSumValueError('');
                    setSumValue(null);
                }}
                numValues={numValues}
                sumValue={sumValue}
                setSumValue={setSumValue}
                sumValueError={sumValueError}
                setSumValueError={setSumValueError}
                modalDescription={'Are you sure you want to delete Resolution?'}
            />
        </div>
    );
};

export default Resolutions;
