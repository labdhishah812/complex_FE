import { useParams } from 'react-router-dom';
import components from '../..';
import Loader from '../../../../components/Loader';
import { getEventDetailById } from '../../../../redux/slice/AdminSlices/eventSlice';
import moment from 'moment-timezone';
import '../../../../App.css';
import { FilePdfOutlined } from '@ant-design/icons';
import { Button } from 'primereact/button';
import toast from 'react-hot-toast';
const EventView = () => {
    const { BreadCrumb, useEffect, useNavigate, Image, useSelector, useDispatch } = components;
    const { isLoading, eventDetailById } = useSelector((store) => store.event);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            dispatch(getEventDetailById(params.id));
        }
    }, [params.id]);

    const breadcrumbHome = {
        label: 'Events',
        command: () => {
            navigate(`/property-management/event`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'View Event'
        }
    ];

    const convertDate = (dateStr) => {
        try {
            const formattedDate = moment(dateStr).format('D MMM YYYY');
            return formattedDate;
        } catch (error) {
            console.log(error);
            return '-';
        }
    };

    return (
        <div className="relative min-h-full">
        <Loader isLoading={isLoading} />
        <div className="flex justify-content-between align-items-center">
            <div className="flex flex-row w-full">
                <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">View Event</h5>
                <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
            </div>
        </div>
        <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
            <div className="grid p-fluid mt-1">
                <div className="field col-12 md:col-5 mb-0">
                    <div className={`border-round`} style={{ width: '300px', height: '300px' }}>
                        {eventDetailById?.event_img ? (
                            (() => {
                                const isPDF = eventDetailById.event_img.toLowerCase().endsWith('.pdf');
                                const imageUrl = `${BASE_URL_API}event/${eventDetailById.event_img}`;

                                if (isPDF) {
                                    return (
                                        <div className="flex flex-column align-items-center justify-content-center h-full">
                                            <div className="flex-grow-1 flex align-items-center justify-content-center">
                                                <FilePdfOutlined style={{ fontSize: '150px', color: 'red' }} />
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <Image
                                            alt="Event Image"
                                            src={imageUrl}
                                            width="300"
                                            height="300"
                                            preview
                                            className=""
                                        />
                                    );
                                }
                            })()
                        ) : (
                            <Image
                                alt="Default Image"
                                src="https://property-management-tt.s3.ap-south-1.amazonaws.com/upload/event/event.png"
                                width="300"
                                height="300"
                                preview
                                className=""
                            />
                        )}
                    </div>
                </div>
                <div className="field col-12 md:col-7 mb-0">
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-3 px-2 border-top-0 surface-border">
                            <div className="text-500 w-9rem font-medium">Event Name</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">
                                {eventDetailById?.event_name || '-'}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-9rem font-medium">Description</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter wrap-text text-container">
                                {eventDetailById?.description
                                    ? new DOMParser().parseFromString(eventDetailById.description, 'text/html').body.textContent.trim()
                                    : '-'}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-9rem font-medium">Event Time</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {eventDetailById?.event_time || '-'}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-9rem font-medium">Venue</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">
                                {eventDetailById?.location || '-'}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-9rem font-medium">Created At</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {eventDetailById?.created_at ? convertDate(eventDetailById?.created_at) : '-'}
                            </div>
                        </li>
                        {/* Conditionally render the PDF download button */}
                        <div className="flex justify-end">
                        {eventDetailById?.event_img?.toLowerCase().endsWith('.pdf') && (
                            <li className="flex justify-start items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="flex align-items-center">
                                <Button
                                    label="Download PDF"
                                    icon="pi pi-download"
                                    className="p-button-outlined p-button-sm w-auto"
    
                                    onClick={async () => {
                                        const imageUrl = `${BASE_URL_API}event/${eventDetailById.event_img}`;
                                        try {
                                            const response = await fetch(imageUrl);

                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }

                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);

                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = eventDetailById.event_img || 'downloaded.pdf';

                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);

                                            window.URL.revokeObjectURL(url);
                                        } catch (error) {
                                            console.error('Download failed:', error);
                                            toast.current.show({
                                                severity: 'error',
                                                summary: 'Download Failed',
                                                detail: 'Unable to download the PDF'
                                            });
                                        }
                                    }}
                                />
                                </div>
                            </li>
                        )}
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    );
};

export default EventView;
