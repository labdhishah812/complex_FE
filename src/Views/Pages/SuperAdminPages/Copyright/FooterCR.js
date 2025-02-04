import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { useDispatch, useSelector } from 'react-redux';
import { getFooterData } from '../../../../redux/slice/AdminSlices/cmsSlice';

const FooterCR = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const dispatch = useDispatch();
    const { footerDetail } = useSelector((store) => store.cms);
    
    useEffect(() => {
        // Call the GET API to fetch privacy policy HTML content
        dispatch(getFooterData());
    }, [dispatch]);
    
    console.log('footerDetail: ', footerDetail);
    useEffect(() => {
        if (footerDetail && footerDetail?.data?.data?.description) {
            setHtmlContent(footerDetail.data.data.description); // Update this based on your API response structure
        }
    }, [footerDetail]);
    return (
        <div className="p-shadow-4">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};

export default FooterCR;
