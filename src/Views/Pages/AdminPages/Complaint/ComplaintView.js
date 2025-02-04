import { useParams } from 'react-router-dom';
import components from '../..';
import moment from 'moment-timezone';
import Loader from '../../../../components/Loader';
import { getComplaintDetailByIdRequest, updateComplaintStatusRequest } from '../../../../redux/slice/AdminSlices/complaintSlice';
import { X } from 'lucide-react';
const ComplaintView = () => {
    const { BreadCrumb, Image, Button, Dropdown, Dialog, InputTextarea, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { loginDetails } = useSelector((store) => store.auth);
    const { isCreated, isLoading, complaintDetailById } = useSelector((store) => store.complaint);
    const [closeModal, setCloseModal] = useState(null);
    const [remarkError, serRemarkError] = useState(false);
    const [remark, setRemark] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    useEffect(() => {
        if (params.id) {
            dispatch(getComplaintDetailByIdRequest(params.id));
            setCloseModal(null);
            serRemarkError(false);
        }
    }, [params.id, isCreated]);
    const breadcrumbHome = {
        label: 'Complaints',
        command: () => {
            navigate(`/property-management/complain`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'View Complaint'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const getRoles = (permissionName, val) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                let dataColl = val ? loginDetails?.role_permissions.filter((x) => x.role !== 'User') : loginDetails?.role_permissions;
                dataColl.forEach((b, i) => {
                    let check = b.permission.find((x) => x.module_name === 'complaint')?.module_access.findIndex((y) => y === permissionName);
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
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">View Complaint</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <ul className="list-none p-0 m-0">
                    {/* <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">Owner Name </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{complaintDetailById?.complaint_created_by?.name ? complaintDetailById?.complaint_created_by?.name : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Property No.</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{complaintDetailById?.user_property_assign_id?.property_number ? complaintDetailById?.user_property_assign_id?.property_number : '-'}</div>
                    </li> */}
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> Subject</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{complaintDetailById?.subject ? complaintDetailById?.subject : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Complaint</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter wrap-text text-container">{complaintDetailById?.description ? new DOMParser().parseFromString(complaintDetailById.description, 'text/html').body.textContent.trim() : '-'}</div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> Created At</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{complaintDetailById?.created_at ? moment(complaintDetailById?.created_at).utcOffset('+05:30').format('D MMM YY, LT') : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Updated At</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{complaintDetailById?.updated_at ? moment(complaintDetailById?.updated_at).utcOffset('+05:30').format('D MMM YY, LT') : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> Status</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {getRoles('update', true) && complaintDetailById?.is_complaint_approved_by_chairman !== 2 ? (
                                <div className="solid_border_drop">
                                    <Dropdown
                                        value={complaintDetailById?.is_complaint_approved_by_chairman}
                                        options={
                                            // rowData?.is_complaint_approved_by_chairman === 0 ?
                                            [
                                                { label: 'Open', value: 0 },
                                                { label: 'In Progress', value: 1 },
                                                { label: 'Close', value: 2 }
                                            ]
                                            // : [
                                            //     { label: 'In Progress', value: 1 },
                                            //     { label: 'Close', value: 2 }
                                            // ]
                                        }
                                        optionLabel="label"
                                        optionValue="value"
                                        onChange={(e) => {
                                            if (e.target.value !== null && e.target.value !== 2) {
                                                dispatch(updateComplaintStatusRequest(complaintDetailById._id, { is_complaint_approved_by_chairman: e.target.value }));
                                            } else if (e.target.value !== null && e.target.value === 2) {
                                                setCloseModal(complaintDetailById._id);
                                                setRemark('');
                                                serRemarkError(false);
                                            }
                                        }}
                                        style={{ width: '100%', background: 'transparent' }}
                                        placeholder="Select a Status"
                                        className={`${
                                            complaintDetailById?.is_complaint_approved_by_chairman === 0
                                                ? 'editableDropRed editableDropBorderRed'
                                                : complaintDetailById?.is_complaint_approved_by_chairman === 1
                                                ? 'editableDropYellow editableDropBorderYellow'
                                                : 'editableDropGreen editableDropBorderGreen'
                                        } w-11rem`}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="p-2 my-2 text-center w-7rem"
                                    style={{
                                        color: complaintDetailById?.is_complaint_approved_by_chairman === 0 ? '#d32f2f' : complaintDetailById?.is_complaint_approved_by_chairman === 1 ? '#f5c308' : '#689f38',
                                        border: `2px solid ${complaintDetailById?.is_complaint_approved_by_chairman === 0 ? '#d32f2f' : complaintDetailById?.is_complaint_approved_by_chairman === 1 ? '#f5c308' : '#689f38'}`,
                                        borderRadius: '5px'
                                    }}
                                >
                                    {complaintDetailById?.is_complaint_approved_by_chairman === 0 ? 'Open' : complaintDetailById?.is_complaint_approved_by_chairman === 1 ? 'In Progress' : 'Close'}
                                </div>
                            )}
                            {/* <div className="p-2 my-2 w-7rem text-center" style={{ color: complaintDetailById?.is_complaint_approved_by_chairman === 0 ? "#d32f2f" : complaintDetailById?.is_complaint_approved_by_chairman === 1 ? "#f5c308" : "#689f38", border: `2px solid ${complaintDetailById?.is_complaint_approved_by_chairman === 0 ? "#d32f2f" : complaintDetailById?.is_complaint_approved_by_chairman === 1 ? "#f5c308" : "#689f38"}`, borderRadius: "5px" }}>
                            {complaintDetailById?.is_complaint_approved_by_chairman === 0 ? "Open" : complaintDetailById?.is_complaint_approved_by_chairman === 1 ? "In Progress" : "Close"}
                        </div> */}
                            {/* {propertyDataByid?.updated_at ? moment(propertyDataByid?.updated_at).utcOffset("+05:30").format("DD-MMM-YYYY, LT") : "-"}  */}
                        </div>
                    </li>
                    {complaintDetailById?.is_complaint_approved_by_chairman === 2 && (
                        <li className={`flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap`}>
                            <div className="text-500 w-16rem font-medium"> Remarks</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{complaintDetailById?.remark ? complaintDetailById?.remark : '-'}</div>
                        </li>
                    )}
                    {complaintDetailById?.complain_files.length > 0 && (
                        <li className={`flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap ${complaintDetailById?.is_complaint_approved_by_chairman === 2 ? 'surface-ground' : ''}`}>
                            <div className="text-500 w-16rem font-medium"> Image</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {complaintDetailById?.complain_files &&
                                    complaintDetailById?.complain_files.map((x) => <Image src={`${process.env.REACT_APP_COMON_UPLOAD_BASE}Complaint/${x}`} alt="Image" width="100" height="100" preview className="mr-2" />)}
                                {/* <Image src={a.showImg} alt="Image" width="100" height="100" preview />  */}
                            </div>
                        </li>
                    )}
                </ul>
            </div>
            {closeModal !== null && (
                <Dialog
                    draggable={false}
                    visible={closeModal !== null}
                    header="Complaint CLose"
                    style={{ width: '30vw' }}
                    closable={false}
                    footer={false}
                    icons={
                        <div className="flex align-items-center justify-content-center" style={{ width: '1.5rem', height: '1.5rem' }}>
                            <X
                                color={'#ffff'}
                                size={17}
                                className="cursor-pointer"
                                onClick={() => {
                                    setCloseModal(null);
                                    serRemarkError(false);
                                }}
                            />
                        </div>
                    }
                    modal
                    className="p-fluid"
                    // modalFooter={() => cancelDialogFooter()}
                    onHide={() => {
                        setCloseModal(null);
                        serRemarkError(false);
                    }}
                    headerStyle={{ backgroundColor: '#d32f2f', color: '#fff' }}
                >
                    <div className="w-full mt-3">
                        <div className="card">
                            <div className="py-2">
                                <div className="text-500 font-medium">{'Subject'}</div>
                                <div className="text-900 mt-1">{complaintDetailById?.subject ? complaintDetailById?.subject : '-'}</div>
                            </div>
                            <div className="py-2">
                                <div className="text-500 font-medium">{'Complaint'}</div>
                                <div className="text-900 mt-1">{complaintDetailById?.description ? complaintDetailById?.description : '-'}</div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="remark" className="required">
                                Remarks
                            </label>
                        </div>
                        <InputTextarea
                            rows="2"
                            id="remark"
                            name="remark"
                            placeholder="Enter Remarks"
                            value={remark}
                            onChange={(e) => {
                                setRemark(e.target.value);
                                serRemarkError(false);
                            }}
                            className={classNames({ 'p-invalid': remarkError })}
                        />
                        <div className="field col-12 md:col-12 mb-1 flex justify-content-end mt-3 p-0">
                            <Button
                                label="No"
                                icon="pi pi-times"
                                className="p-button-outlined p-button-danger mr-2 mb-2 w-5rem"
                                onClick={() => {
                                    setCloseModal(null);
                                    serRemarkError(false);
                                }}
                            />
                            <Button
                                label="Yes"
                                icon="pi pi-check"
                                className="p-button-outlined p-button-success mb-2 w-5rem"
                                onClick={() => {
                                    if (remark !== '') {
                                        dispatch(updateComplaintStatusRequest(closeModal, { is_complaint_approved_by_chairman: 2, remark: remark }));
                                    } else {
                                        serRemarkError(true);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
};
export default ComplaintView;
