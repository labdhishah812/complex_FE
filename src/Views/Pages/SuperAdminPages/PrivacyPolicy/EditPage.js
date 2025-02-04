// import React, { useState } from 'react';
// import components from '../..';
// import { getprivacyPolicyUpdateData, privacyPolicyUpdateData } from '../../../../redux/slice/AdminSlices/cmsSlice';
// import ReactQuill from 'react-quill';
// // import Loader from './Loader'; // Assuming you have a Loader component=
// const EditPage = () => {
//     const { Editor, SelectButton, Button, Column, DataTable, Dropdown, Image, toast, useEffect, useState, React, useNavigate, useDispatch, useSelector, InputText, BreadCrumb, Paginator, Toolbar } = components;
//     const navigate = useNavigate();
//     const dispatch = useDispatch()
//     const [content, setContent] = useState('');
//     const { isCreated, isLoading, privacyPolicyDetail } = useSelector((store) => store.cms);
//     const handleContentChange = (e) => {
//         setContent(e.htmlValue);
//     };
//     const breadcrumbHome = {
//         icon: 'pi pi-home',
//         command: () => {
//             navigate('/superadmin/dashboard');
//         }
//     };
//     useEffect(() => {
//         callGetApi()
//     }, [dispatch, isCreated])
//     useEffect(() => {
//         // callGetApi()
//         if (privacyPolicyDetail && privacyPolicyDetail?._id) {
//             let abc = privacyPolicyDetail?.description;
//             setContent(abc)
//         }
//     }, [privacyPolicyDetail])
//     const callGetApi = () => {
//         try {
//             dispatch(getprivacyPolicyUpdateData());
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     const handleSubmit = () => {
//         try {
//             console.log(content , "content");
//             dispatch(privacyPolicyUpdateData({ description: content }))
//         } catch (error) {
//             console.log(error);

//         }
//         // console.log('Submitted Content:', content);
//     };
//     const handleReset = () => {
//         setContent('');
//         // console.log('Editor content has been reset.');
//     };
//     const breadcrumbItems = [
//         {
//             label: 'Privacy Policy'
//         }
//     ];
//     return (
//         // <React.Fragment>
//         <>
//             <div className="flex justify-content-between align-items-center">
//                 <div className="flex flex-row w-full">
//                     <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Privacy Policy</h5>
//                     <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                 </div>
//             </div>
//             <div className="col-12 card mt-2">
//                 <div className="flex justify-content-between align-items-center mb-4"></div>
//                 <ReactQuill theme="snow" value={content} onTextChange={handleContentChange} style={{ height: '320px' }} />
//                 {/* Real-time Preview */}
//                 <div className="mt-6 p-4 border rounded">
//                     <h6 className="mb-2">Preview:</h6>
//                     <div dangerouslySetInnerHTML={{ __html: content }} />
//                 </div>
//                 <div className="flex justify-end mt-4 gap-1">
//                     <Button label="Reset" className="p-button-outlined p-button-info mr-2 mb-2 w-7rem" onClick={handleReset} />
//                     <Button label="Submit" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" onClick={handleSubmit} />
//                 </div>
//             </div>
//             {/* </React.Fragment> */}
//         </>
//     );
// };

// export default EditPage;


import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import components from '../..';
import { getprivacyPolicyUpdateData, privacyPolicyUpdateData } from '../../../../redux/slice/AdminSlices/cmsSlice';

const EditPage = () => {
    const { Editor, SelectButton, Button, Column, DataTable, Dropdown, Image, toast, useNavigate, useDispatch, useSelector, InputText, BreadCrumb, Paginator, Toolbar } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const { isCreated, isLoading, privacyPolicyDetail } = useSelector((store) => store.cms);

    // Fixed handleContentChange function
    const handleContentChange = (value) => {
        setContent(value);
    };

    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate('/superadmin/dashboard');
        }
    };

    useEffect(() => {
        callGetApi();
    }, [dispatch, isCreated]);

    useEffect(() => {
        if (privacyPolicyDetail && privacyPolicyDetail?._id) {
            let abc = privacyPolicyDetail?.description;
            setContent(abc);
        }
    }, [privacyPolicyDetail]);

    const callGetApi = () => {
        try {
            dispatch(getprivacyPolicyUpdateData());
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        try {
            console.log('Content being submitted:', content);
            dispatch(privacyPolicyUpdateData({ description: content }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleReset = () => {
        setContent('');
    };

    const breadcrumbItems = [
        {
            label: 'Privacy Policy'
        }
    ];

    return (
        <>
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">
                        Privacy Policy
                    </h5>
                    <BreadCrumb
                        model={breadcrumbItems}
                        home={breadcrumbHome}
                        className="layout-breadcrumb p-pl-3 p-py-2 ml-auto"
                    />
                </div>
            </div>
            <div className="col-12 card mt-2">
                <div className="flex justify-content-between align-items-center mb-4"></div>
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={handleContentChange}
                    style={{ height: '320px' }}
                />
                <div className="mt-6 p-4 border rounded">
                    <h6 className="mb-2">Preview:</h6>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                <div className="flex justify-end mt-4 gap-1">
                    <Button
                        label="Reset"
                        className="p-button-outlined p-button-info mr-2 mb-2 w-7rem"
                        onClick={handleReset}
                    />
                    <Button
                        label="Submit"
                        className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </>
    );
};

export default EditPage;
