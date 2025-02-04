import React, { useState } from 'react';
import { Editor } from 'primereact/editor';
import components from '../..';
import { aboutusUpdateAPI, getAboutUsData } from '../../../../redux/slice/AdminSlices/cmsSlice';
import ReactQuill from 'react-quill';
// import Loader from './Loader'; // Assuming you have a Loader component=
const EditPage = () => {
    const { SelectButton, Button, Column, DataTable, Dropdown, Image, toast, useEffect, useState, React, useNavigate, useDispatch, useSelector, InputText, BreadCrumb, Paginator, Toolbar } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const { isCreated, isLoading, aboutusDetail } = useSelector((store) => store.cms);
    const handleContentChange = (value) => {
        setContent(value);
    };
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate('/superadmin/dashboard');
        }
    };
    const breadcrumbItems = [
        {
            label: 'About Us'
        }
    ];
    const handleSubmit = () => {
        try {
            dispatch(aboutusUpdateAPI({ description: content }));
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (aboutusDetail && aboutusDetail?.data?._id) {
            let abc = aboutusDetail?.data?.description;
            setContent(abc);
        }
    }, [aboutusDetail]);
    const handleReset = () => {
        setContent(''); // Clears the editor content
        console.log('Editor content has been reset.');
    };
    useEffect(() => {
        callGetApi();
    }, [dispatch, isCreated]);
    const callGetApi = () => {
        try {
            dispatch(getAboutUsData());
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <React.Fragment>
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">About Us</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="col-12 card mt-2">
                <div className="flex justify-content-between align-items-center mb-4"></div>
                <ReactQuill theme="snow" value={content} onChange={handleContentChange} style={{ height: '320px' }} />
                {/* Real-time Preview */}
                <div className="mt-6 p-4 border rounded">
                    <h6 className="mb-2">Preview:</h6>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                <div className="flex justify-end mt-4 gap-1">
                    <Button label="Reset" className="p-button-outlined p-button-info mr-2 mb-2 w-7rem" onClick={handleReset} />
                    <Button label="Submit" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" onClick={handleSubmit} />
                </div>
            </div>
        </React.Fragment>
    );
};
export default EditPage;
