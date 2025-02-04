import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import components from '../..'; // Adjust the import path as needed
import Loader from '../../../../components/Loader'; // Adjust the import path as needed
import moment from 'moment-timezone';
import { getBuildingRulesById } from '../../../../redux/slice/AdminSlices/buildingRulesSlice';

const BuildingRulesDetails = () => {
    const { BreadCrumb, useNavigate, useSelector, useDispatch } = components;
    const { buildingRulesById, isLoading } = useSelector((state) => state.buildingRules);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        console.log('Params ID:', params.id); // Check if ID exists
        if (params.id) {
            dispatch(getBuildingRulesById(params.id));
        }
    }, [params.id, dispatch]);

    const breadcrumbHome = {
        label: 'Building Rules',
        command: () => {
            navigate(`/property-management/buildingrules`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'View Building Rules',
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">BuildingRules Details</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">Title</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{buildingRulesById?.title || '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Description</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{buildingRulesById?.description || '-'}</div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default BuildingRulesDetails;
