import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { useDispatch, useSelector } from 'react-redux';
import { getTermsConditionData } from '../../../../redux/slice/AdminSlices/cmsSlice';

const TermsAndConditions = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const dispatch = useDispatch();
    const { termsconditionDetail } = useSelector((store) => store.cms);

    useEffect(() => {
        // Call the GET API to fetch privacy policy HTML content
        dispatch(getTermsConditionData());
    }, [dispatch]);

    useEffect(() => {
        if (termsconditionDetail && termsconditionDetail?.data?.description) {
            setHtmlContent(termsconditionDetail.data.description); // Update this based on your API response structure
        }
    }, [termsconditionDetail]);
    return (
        <div className="p-shadow-4">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};

export default TermsAndConditions;
