import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import Loader from '../../../../components/Loader';
import components from '../..';
import { getResolutionDataById } from '../../../../redux/slice/AdminSlices/resolutionSlice';
import { useEffect } from 'react';

const ResolutionView = () => {
    const { BreadCrumb, Image } = components;
    const { isLoading, resolutionDataById } = useSelector((store) => store.resolution);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            dispatch(getResolutionDataById(params.id));
        }
    }, [params.id, dispatch]);

    const breadcrumbHome = {
        label: 'Resolutions',
        command: () => {
            navigate(`/property-management/resolutions`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'View Resolution'
        }
    ];

    const convertDate = (dateStr) => {
        try {
            return moment(dateStr).format('D MMM YYYY');
        } catch (error) {
            console.error(error);
            return '-';
        }
    };

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">View Resolution</h5>
                    <BreadCrumb
                        model={breadcrumbItems}
                        home={breadcrumbHome}
                        className="layout-breadcrumb p-pl-3 p-py-2 ml-auto"
                    />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <div className="grid p-fluid mt-1">
                    <div className="field col-12 mb-0">
                        <ul className="list-none p-0 m-0">
                            <li className="flex align-items-center py-3 px-2 border-top-0 surface-border">
                                <div className="text-500 w-9rem font-medium">Title</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">
                                    {resolutionDataById?.resolution?.[0]?.title || '-'}
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium">Number</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    {resolutionDataById?.resolution?.[0]?.number || '-'}
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-9rem font-medium">Description</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter wrap-text text-container">
                                    {resolutionDataById?.resolution?.[0]?.description || '-'}
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium">Date</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    {resolutionDataById?.date
                                        ? convertDate(resolutionDataById?.date)
                                        : '-'}
                                </div>
                            </li>
                            {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-9rem font-medium">Created At</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    {resolutionDataById?.created_at
                                        ? convertDate(resolutionDataById?.created_at)
                                        : '-'}
                                </div>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResolutionView;
