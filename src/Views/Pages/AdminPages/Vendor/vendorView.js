import { useParams } from 'react-router-dom';
import components from '../..';
import Loader from '../../../../components/Loader';
import { getVendorDataById } from '../../../../redux/slice/AdminSlices/vendorSlice';
import moment from 'moment-timezone';
import '../../../../App.css';
const VendorView = () => {
    const { BreadCrumb, useEffect, useNavigate, Image, useSelector, useDispatch } = components;
    const { isLoading, vendorDataById } = useSelector((store) => store.vendor);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            dispatch(getVendorDataById(params.id));
        }
    }, [params.id]);

    const breadcrumbHome = {
        label: 'Vendors',
        command: () => {
            navigate(`/property-management/vendor`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'View Vendor'
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">View Vendor</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <div className="grid p-fluid mt-1">
                    <div className="field col-12 md:col-5 mb-0">
                        <div className={`border-round`} style={{ width: '300px', height: '300px' }}>
                            {vendorDataById?.vendor_profile_image ? (
                                <Image
                                    alt="Vendor Profile"
                                    src={`${vendorDataById?.vendor_profile_image}`}
                                    width="300"
                                    height="300"
                                    preview
                                    className=""
                                />
                            ) : (
                                <Image
                                    alt="Vendor Profile"
                                    src={`${BASE_URL_API}user-profile/user.png`}
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
                                <div className="text-500 w-9rem font-medium">Name</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{vendorDataById?.name || '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium ">Work Type</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{vendorDataById?.work_type || '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap ">
                                <div className="text-500 w-9rem font-medium">Mobile Number</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.mobile_number || '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium">Pincode</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.pincode || '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-9rem font-medium">Work Description</div>
                                {/* <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.work_description || '-'}</div> */}
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter wrap-text text-container">{vendorDataById?.work_description ? new DOMParser().parseFromString(vendorDataById.work_description, 'text/html').body.textContent.trim() : '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium">Address</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.vendor_address || '-'}</div>
                            </li>
                            {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-9rem font-medium">Email</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.email || '-'}</div>
                            </li> */}
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium">Created At</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.created_at ? convertDate(vendorDataById?.created_at) : '-'}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorView;
