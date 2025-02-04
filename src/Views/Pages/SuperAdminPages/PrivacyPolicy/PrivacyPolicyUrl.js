import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { useDispatch, useSelector } from 'react-redux';
import { getprivacyPolicyUpdateData } from '../../../../redux/slice/AdminSlices/cmsSlice';

const PrivacyPolicy = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const dispatch = useDispatch();
    const { privacyPolicyDetail } = useSelector((store) => store.cms);

    useEffect(() => {
        // Call the GET API to fetch privacy policy HTML content
        dispatch(getprivacyPolicyUpdateData());
    }, [dispatch]);

    useEffect(() => {
        if (privacyPolicyDetail && privacyPolicyDetail?.description) {
            setHtmlContent(privacyPolicyDetail.description); // Update this based on your API response structure
        }
    }, [privacyPolicyDetail]);

    return (
        <div className="p-shadow-4">
            {/* Use dangerouslySetInnerHTML to insert raw HTML */}
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};

export default PrivacyPolicy;
