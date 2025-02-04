import React from 'react';
import components from '../..';
import { getFooterData, footerUpdateAPI } from '../../../../redux/slice/AdminSlices/cmsSlice';

const EditPage = () => {
    const { Button, InputText, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const { isCreated, footerDetail } = useSelector((store) => store.cms);

    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate('/superadmin/dashboard');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Copyright'
        }
    ];

    const callGetApi = () => {
        try {
            dispatch(getFooterData());
        } catch (error) {
            console.log(error);
        }
    };

    const handleReset = () => {
        setContent(''); // Clears the editor content
        setError(''); // Clears the error message
    };

    const handleSubmit = () => {
        if (validateYear(content)) {
            try {
                dispatch(footerUpdateAPI({ year: content }));
            } catch (error) {
                console.log(error);
            }
        }
    };

    const validateYear = (year) => {
        if (year.length !== 4) {
            setError('Please enter a valid 4-digit year.');
            return false;
        }
        setError('');
        return true;
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and limit to 4 digits
        if (/^\d{0,4}$/.test(value)) {
            setContent(value);
        }
    };

    useEffect(() => {
        callGetApi();
    }, [dispatch, isCreated]);

    useEffect(() => {
        if (footerDetail && footerDetail?.data?._id) {
            let abc = footerDetail?.data?.year || '';
            setContent(abc);
        }
    }, [footerDetail]);

    return (
        <React.Fragment>
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Copyright</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <div className="grid p-fluid mt-1">
                    <div className="field col-12 md:col-3 mb-1">
                        <label htmlFor="content" className="required">
                            Year
                        </label>
                        <InputText
                            value={content}
                            onChange={handleInputChange}
                            placeholder="Enter 4-digit year" // Placeholder added
                            className={error ? 'p-invalid' : ''}
                        />
                        {error && <small className="p-error">{error}</small>}
                    </div>
                </div>
                <div className="flex justify-end mt-4 gap-1">
                    {/* <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                    <Button label="Reset" icon="pi pi-refresh" className="p-button-outlined p-button-info mr-2 mb-2 w-7rem" onClick={handleReset} /> */}
                    <Button label="Reset" className="p-button-outlined p-button-info mr-2 mb-2 w-7rem" onClick={handleReset} />
                    <Button label="Submit" onClick={handleSubmit} className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                </div>
            </div>
        </React.Fragment>
    );
};

export default EditPage;
