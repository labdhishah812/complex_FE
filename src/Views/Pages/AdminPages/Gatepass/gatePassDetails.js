import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import components from '../..'; // Adjust the import path as needed
import Loader from '../../../../components/Loader'; // Adjust the import path as needed
import moment from 'moment-timezone';
import { getGatePassById } from '../../../../redux/slice/AdminSlices/gatepassSlice';
import { Image } from 'primereact/image';

const GatePassDetails = () => {
    const { BreadCrumb, useNavigate, useSelector, useDispatch } = components;
    const { isLoading, vendorDataById } = useSelector((store) => store.gatePass);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        console.log('Params ID:', params.id); // Check if ID exists
        if (params.id) {
            dispatch(getGatePassById(params.id));
        }
    }, [params.id, dispatch]);

    const breadcrumbHome = {
        label: 'Gatepass',
        command: () => {
            navigate(`/property-management/gatepass`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'View Gatepass'
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

    // const profileImageUrl = (imagePath) => {
    //     const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    //     return `${BASE_URL_API}/${imagePath}`;
    // };

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Gatepass Details</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">Name</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.name || '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Contact Number</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.mobile_number || '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Email</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.email || '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Visitor Type</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.visitor_type || '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Number Of Person</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.number_of_person || '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Start Date</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.valid_from ? convertDate(vendorDataById.valid_from) : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">End Date</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.valid_to ? convertDate(vendorDataById.valid_to) : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Visitng Purpose</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{vendorDataById?.purpose || '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Profile Image</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {vendorDataById?.visitor_profile ? <Image width='100' height='100' preview src={`${BASE_URL_API}visitorprofile/${vendorDataById.visitor_profile}`} alt="Profile" className="h-auto rounded-md" style={{ width: '100px', objectFit: 'cover' }} /> : '-'}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default GatePassDetails;
