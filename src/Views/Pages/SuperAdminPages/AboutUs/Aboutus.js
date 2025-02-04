import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUsData } from '../../../../redux/slice/AdminSlices/cmsSlice';

const Aboutus = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const dispatch = useDispatch();
    const { aboutusDetail } = useSelector((store) => store.cms);

    useEffect(() => {
        dispatch(getAboutUsData());
    }, [dispatch]);

    useEffect(() => {
        if (aboutusDetail && aboutusDetail?.data?.description) {
            setHtmlContent(aboutusDetail.data.description); // Update this based on your API response structure
        }
    }, [aboutusDetail]);
    return (
        <div className="p-shadow-4">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};

export default Aboutus;
