import React from 'react';
import { Editor } from 'primereact/editor';
import components from '../..';
import { getTermsConditionData, termsConditionUpdateData } from '../../../../redux/slice/AdminSlices/cmsSlice';
import ReactQuill from 'react-quill';

const EditPage = () => {
    const { Button, useEffect, useState, React, useNavigate, useDispatch, useSelector, BreadCrumb } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const { isCreated, termsconditionDetail } = useSelector((store) => store.cms);

    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate('/superadmin/dashboard');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Terms & Conditions'
        }
    ];

    const handleContentChange = (value) => {
        // setContent(e.htmlValue);
        setContent(value);
    };

    const callGetApi = () => {
        try {
            dispatch(getTermsConditionData());
        } catch (error) {
            console.log(error);
        }
    };

    const handleReset = () => {
        setContent(''); // Clears the editor content
    };

    const handleSubmit = () => {
        try {
            dispatch(termsConditionUpdateData({ description: content }));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        callGetApi();
    }, [dispatch, isCreated]);

    useEffect(() => {
        if (termsconditionDetail && termsconditionDetail?.data?._id) {
            let abc = termsconditionDetail?.data?.description;
            setContent(abc);
        }
    }, [termsconditionDetail]);

    return (
        <React.Fragment>
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Terms & Conditions</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="col-12 card mt-2">
                <div className="flex justify-content-between align-items-center mb-4"></div>
                {/* <ReactQuill theme="snow" value={content} onTextChange={handleContentChange} style={{ height: '320px' }} /> */}
                <ReactQuill theme="snow" value={content} onChange={handleContentChange} style={{ height: '320px' }} />

                {/* Real-time Preview */}
                <div className="mt-6 p-4 border rounded">
                    <h6 className="mb-2">Preview:</h6>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                <div className="flex justify-end mt-4 gap-1">
                    <Button label="Reset" className="p-button-outlined p-button-info mr-2 mb-2 w-7rem" onClick={handleReset} />
                    <Button label="Submit" onClick={handleSubmit} className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                </div>
            </div>
        </React.Fragment>
    );
};

export default EditPage;
