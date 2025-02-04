import { useParams } from 'react-router-dom';
import components from '../..';
import Loader from '../../../../components/Loader';
import { getAnnouncementDetailByIdRequest } from '../../../../redux/slice/AdminSlices/announcementSlice';
import moment from 'moment-timezone';
import '../../../../App.css';
const AnnoucementView = () => {
    const { BreadCrumb, useEffect, useNavigate, Image, useSelector, useDispatch } = components;
    const { isLoading, announcementDetailById } = useSelector((store) => store.announcement);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            dispatch(getAnnouncementDetailByIdRequest(params.id));
        }
    }, [params.id]);

    const breadcrumbHome = {
        label: 'Annoucemets',
        command: () => {
            navigate(`/property-management/announcements`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'View Annoucement'
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">View Annoucement</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <div className="grid p-fluid mt-1">
                    <div className="field col-12 md:col-5 mb-0">
                        <div className={`border-round`} style={{ width: '300px', height: '300px' }}>
                                {console.log(`${BASE_URL_API}announcement/${announcementDetailById?.bannerImg}`)}
                            {announcementDetailById?.bannerImg ? (
                                <Image
                                    alt="Annoucement Image"
                                    src={`${BASE_URL_API}announcement/${announcementDetailById?.bannerImg}`}
                                    width="300"
                                    height="300"
                                    preview
                                    className=""
                                />
                            ) : (
                                <Image
            alt="Default Image"
            src="https://property-management-tt.s3.ap-south-1.amazonaws.com/upload/announcement/announcement.png" // Fallback image path
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
                            <li className="flex align-items-center py-3 px-2 border-top-0 surface-border ">
                                <div className="text-500 w-9rem font-medium">Title</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{announcementDetailById?.title || '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium ">Description</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter wrap-text text-container">{announcementDetailById?.description ? new DOMParser().parseFromString(announcementDetailById.description, 'text/html').body.textContent.trim() : '-'}</div>

                                {/* <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{eventDetailById?.description || '-'}</div> */}
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap ">
                                <div className="text-500 w-9rem font-medium">Start Date</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{announcementDetailById?.start_date
                                    || '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap ">
                                <div className="text-500 w-9rem font-medium">End Date</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{announcementDetailById?.end_date
                                    || '-'}</div>
                            </li>

                            {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-9rem font-medium">Email</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{eventById?.email || '-'}</div>
                            </li> */}
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium">Created At</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{announcementDetailById?.created_at ? convertDate(announcementDetailById?.created_at) : '-'}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnoucementView;
