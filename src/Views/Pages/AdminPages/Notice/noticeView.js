import { useParams } from 'react-router-dom';
import components from '../..';
import moment from 'moment-timezone';
import axios from 'axios';

import Loader from '../../../../components/Loader';
import { getNoticeDetailById } from '../../../../redux/slice/AdminSlices/noticeSlice';
const NoticeDetailView = () => {
    const { BreadCrumb, Image, Button, toast, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { noticeDetailById, isLoading } = useSelector((store) => store.notice);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    // const locationName = window.location.pathname.split("/");

    useEffect(() => {
        if (params.id) {
            dispatch(getNoticeDetailById(params.id))
        }
    }, [params.id]);
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Notice',
        command: () => {
            navigate('/property-management/notice');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Notice Details'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const downloadFile = async (val) => {
        try {
            if (val) {
                const response = await axios.get(`${BASE_URL_API}notice/${val}`, {
                    responseType: 'blob'
                })
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', val)
                document.body.appendChild(link)
                link.click()
            } else {
                toast.error(`Don't have agreement file`, {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (<div className="relative min-h-full">
        <Loader isLoading={isLoading} />
        <div className="flex justify-content-between align-items-center">
            <div className="flex flex-row w-full">
                <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Notice Details</h5>
                <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
            </div>
        </div>
        <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: "60rem" }}>
            <ul className="list-none p-0 m-0">
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Property No.
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {noticeDetailById?.propertyNumber ? noticeDetailById?.propertyNumber : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Name
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {noticeDetailById?.userName ? noticeDetailById?.userName : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
    <div className="text-500 w-16rem font-medium">
        Notice Status
    </div>
    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
        {noticeDetailById?.notice_status
            ? noticeDetailById.notice_status.charAt(0).toUpperCase() + noticeDetailById.notice_status.slice(1).toLowerCase()
            : "-"}
    </div>
</li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Notice Issue Date
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {noticeDetailById?.notice_date ? moment(noticeDetailById?.notice_date).format("D MMM YYYY") : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Subject
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">
                        {noticeDetailById?.subject ? noticeDetailById?.subject : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Description
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter wrap-text text-container">
                        {noticeDetailById?.description ? <div dangerouslySetInnerHTML={{ __html: noticeDetailById?.description }}></div> : "-"}

                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Notice By
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {noticeDetailById?.committeeMemberName ? noticeDetailById?.committeeMemberName : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Created At
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {noticeDetailById?.created_at ? moment(noticeDetailById?.created_at).utcOffset("+05:30").format("D MMM YY, LT") : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Image / Pdf
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {noticeDetailById?.notice_file ? <div className="flex align-items-center">
                            {/* <div>{noticeDetailById?.notice_file}</div> */}
                            <div className="">
                                <Button
                                    icon="pi pi-download"
                                    label='Download'
                                    className="p-button-rounded p-button-text"
                                    id="delete-icons"
                                    // tooltip="Download"
                                    tooltipOptions={{ position: 'bottom' }}
                                    onClick={() => {
                                        downloadFile(noticeDetailById?.notice_file);
                                        // setFieldValue('file', null);
                                        // setShowFile(null);
                                    }}
                                />
                            </div>
                        </div> : "-"}
                    </div>
                </li>
            </ul>
            {/* <div className="grid p-fluid mt-1">
                <div className="field col-12 md:col-12 mb-0 flex justify-content-end">
                    <Button label="Back" icon="pi pi-arrow-left" className="p-button-outlined mr-2 mb-2 w-6rem"
                        onClick={() => navigate('/property-management/property-assign')} />
                </div>
            </div> */}
            {/* <Button
                        disabled={submitted}
                        label="Save"
                        type="submit"
                        icon="pi pi-check"
                        className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                    // onClick={() => dataSave()}
                    /> */}
        </div>
    </div>)
}
export default NoticeDetailView;
