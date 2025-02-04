import { useParams } from 'react-router-dom';
import components from '../..';
import moment from 'moment-timezone';
import axios from 'axios';
import Loader from '../../../../components/Loader';
import { getMeetingDetailById } from '../../../../redux/slice/AdminSlices/meetingSlice';

const MeetingView = () => {
    const { BreadCrumb, Image, Button, toast, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { isLoading, meetingDetailById } = useSelector((store) => store.meeting);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    useEffect(() => {
        if (params.id) {
            dispatch(getMeetingDetailById(params.id))
        }
    }, [params.id]);
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Meetings',
        command: () => {
            navigate('/property-management/meeting');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Meeting Details'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const convertDate = (dateStr) => {
        try {
            // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            // const [day, month, year] = dateStr.split('/');
            // const date = new Date(`${year}-${month}-${day}`);
            // const formattedDate = `${day}-${monthNames[date.getMonth()]}-${year}`;
            const formattedDate = moment(dateStr).format('D MMM YYYY');
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    }
    return (<div className="relative min-h-full">
        <Loader isLoading={isLoading} />
        <div className="flex justify-content-between align-items-center">
            <div className="flex flex-row w-full">
                <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Meeting Details</h5>
                <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
            </div>
        </div>
        <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ width: "60%", maxWidth: "60rem" }}>
            <ul className="list-none p-0 m-0">
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Title
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">
                        {meetingDetailById?.title ? meetingDetailById?.title : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Date
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {meetingDetailById?.date ? convertDate(meetingDetailById?.date) : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Venue
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">
                        {meetingDetailById?.location ? meetingDetailById?.location : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Start Time
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {meetingDetailById?.time ? meetingDetailById?.time : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        End Time
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {meetingDetailById?.end_time ? meetingDetailById?.end_time : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap ">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Description
                    </div>
                    {/* <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {meetingDetailById?.description ? meetingDetailById?.description : "-"}
                    </div> */}
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter wrap-text text-container">{meetingDetailById?.description ? new DOMParser().parseFromString(meetingDetailById.description, 'text/html').body.textContent.trim() : '-'}</div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Invited Member
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {meetingDetailById?.invited_member ? meetingDetailById?.invited_member.length : "-"}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap ">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Attended Member
                    </div>
                    {/* <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {meetingDetailById?.attended_member ? meetingDetailById?.attended_member.length : "-"}
                    </div> */}
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
        {meetingDetailById?.attended_member && meetingDetailById.attended_member.length > 0
        ? meetingDetailById.attended_member.map((member) => member.name).join(", ")
        : "-"}
</div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Meeting Agenda
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {meetingDetailById?.agenda.length > 0 ? <div className=''>
                            <ul className='pl-4 '>
                                {meetingDetailById?.agenda.map((x, i) => <li className='pb-2'>
                                    <div className='flex align-items-center'>
                                        <div>
                                            {x.topic}
                                        </div>
                                        {/* <div className="ml-3">
                                                <Button
                                                icon="pi pi-trash"
                                                type='button'
                                                className="p-button-rounded p-button-text  p-button-danger p-0"
                                                id="delete-icons"
                                                tooltip="Delete"
                                                tooltipOptions={{ position: 'bottom' }}
                                                    onClick={() => {
                                                        let setData = [...agendaArray]
                                                        setData.splice(i, 1);
                                                        setAgendaArray(setData);
                                                        setAgenda({ index: null, value: "" })
                                                        // setFieldValue('file', null);
                                                        // setShowFile(null);
                                                        }}
                                                />
                                            </div> */}
                                    </div>
                                </li>)}
                            </ul>
                        </div> : "-"}
                        {/* {meetingDetailById?.invited_member ? meetingDetailById?.invited_member.length : "-"} */}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        Status
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <div className="p-2 my-2 text-center w-7rem" style={{ color: meetingDetailById?.status === 0 ? "#322fd3" : meetingDetailById?.status === 1 ? "#689f38" : "#d32f2f", border: `2px solid ${meetingDetailById?.status === 0 ? "#322fd3" : meetingDetailById?.status === 1 ? "#689f38" : "#d32f2f"}`, borderRadius: "5px" }}>
                            {meetingDetailById?.status === 0 ? "Open" : meetingDetailById?.status === 1 ? "Close" : "Cancel"}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>)
}
export default MeetingView;
