// import components from '../..';
// import toast from 'react-hot-toast';
// // uploadPropertyStructure
// import { uploadPropertyStructure, handleResetUpload, uploadShoppingStructure } from '../../../../redux/slice/AdminSlices/blockSlice';

// const ExcelUpload = ({ decode, onHide, shoppingStructureViewDetail }) => {
//     const { React, Button, useState, useDispatch, useSelector, useEffect } = components;
//     const dispatch = useDispatch();
//     const { uploadErrors, uploadShoppingErrors, isShopsCreated } = useSelector((store) => store.block);
//     const [disabledInner, SetDisabledInner] = useState(false);
//     const [disabledOuter, SetDisabledOuter] = useState(false);
//     const [fileFormShoppingData, setFileFormShoppingData] = useState(null);
//     const [fileNameShopping, setFileNameShopping] = useState(null);
//     const [fileFormData, setFileFormData] = useState(null);
//     const [fileName, setFileName] = useState(null);
//     // console.log(decode, 'decode');
//     // console.log(uploadErrors);

//     useEffect(() => {
//         dispatch(handleResetUpload());
//     }, []);
//     useEffect(() => {
//         if (isShopsCreated && fileFormData) {
//             let sendData = {
//                 file: fileFormData ? fileFormData : ''
//             };
//             dispatch(uploadPropertyStructure(sendData));
//         }
//         // dispatch(handleResetUpload());
//     }, [isShopsCreated]);
//     const downLoadInnerFile = () => {
//         try {
//             SetDisabledInner(true);
//             setTimeout(() => {
//                 SetDisabledInner(false);
//             }, 5000);
//             let filePath =
//                 decode?.is_block_exist_in_property && decode?.is_floor_exist_in_property && decode?.is_ground_floor_exist_in_property && decode?.property_type === 'Complex'
//                     ? 'society_management - Block_Floor_Ground(complex).xlsx'
//                     : decode?.is_block_exist_in_property && decode?.is_floor_exist_in_property
//                         ? 'society_management - Block_Floor(flat).xlsx'
//                         : decode?.is_floor_exist_in_property && decode?.is_ground_floor_exist_in_property && decode?.property_type === 'Complex'
//                             ? 'society_management - Floor_Ground(complex).xlsx'
//                             : decode?.is_floor_exist_in_property && (decode?.property_type === 'Complex' || decode?.property_type === 'Flat')
//                                 ? 'society_management - Only_Floor.xlsx'
//                                 : decode?.is_block_exist_in_property && decode?.is_house_exist_in_property && decode?.property_type === 'Society'
//                                     ? 'society_management - Block_House.xlsx'
//                                     : decode?.is_house_exist_in_property && decode?.property_type === 'Society' && 'society_management - Only_House.xlsx';
//             var url = `${process.env.REACT_APP_BASE}uploads/excelFiles/${filePath}`;
//             fetch(url)
//                 .then((response) => response.blob())
//                 .then((blob) => {
//                     const blobUrl = window.URL.createObjectURL(blob);
//                     const link = document.createElement('a');
//                     link.href = blobUrl;
//                     link.setAttribute('download', filePath);
//                     link.click();
//                     window.URL.revokeObjectURL(blobUrl);
//                 })
//                 .catch((error) => {
//                     console.error('Error downloading file:', error);
//                 });
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const downLoadOuterFile = () => {
//         try {
//             SetDisabledOuter(true);
//             setTimeout(() => {
//                 SetDisabledOuter(false);
//             }, 5000);
//             let filePath = decode?.is_block_exist_in_shopping_center_property ? 'society_management - Block_Floor_Shop(shopping center).xlsx' : 'society_management - Floor_Shop(shopping center).xlsx';
//             var url = `${process.env.REACT_APP_BASE}uploads/excelFiles/${filePath}`;
//             fetch(url)
//                 .then((response) => response.blob())
//                 .then((blob) => {
//                     const blobUrl = window.URL.createObjectURL(blob);
//                     const link = document.createElement('a');
//                     link.href = blobUrl;
//                     link.setAttribute('download', filePath);
//                     link.click();
//                     window.URL.revokeObjectURL(blobUrl);
//                 })
//                 .catch((error) => {
//                     console.error('Error downloading file:', error);
//                 });
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const handleUploadShopping = async (event) => {
//         try {
//             const str = event.target.files[0]?.name;
//             const substr = ['.xlsx'];
//             let flag = false;
//             substr.forEach((a) => {
//                 if (str.includes(a)) {
//                     flag = true;
//                 }
//             });
//             if (flag) {
//                 // let formData = new FormData();
//                 // formData.append('file', event.target.files[0]);
//                 setFileFormShoppingData(event.target.files[0]);
//                 setFileNameShopping(str);
//             } else {
//                 toast.error('Only Accept xlsx', {
//                     style: {
//                         marginTop: '4rem'
//                     }
//                 });
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const handleUpload = async (event) => {
//         try {
//             const str = event.target.files[0]?.name;
//             const substr = ['.xlsx'];
//             let flag = false;
//             substr.forEach((a) => {
//                 if (str.includes(a)) {
//                     flag = true;
//                 }
//             });
//             if (flag) {
//                 // let formData = new FormData();
//                 // formData.append('file', event.target.files[0]);
//                 setFileFormData(event.target.files[0]);
//                 setFileName(str);
//             } else {
//                 toast.error('Only Accept xlsx', {
//                     style: {
//                         marginTop: '4rem'
//                     }
//                 });
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const onSubmit = () => {
//         try {
//             if (fileFormData === null || (decode?.is_shopping_center_exist_in_property === true && fileFormShoppingData == null)) {
//                 toast.error('Please upload a file.', {
//                     style: {
//                         marginTop: '4rem'
//                     }
//                 });
//             } else {
//                 if (decode?.is_shopping_center_exist_in_property === true && fileFormShoppingData !== null) {
//                     let shoppingSentData = {
//                         file: fileFormShoppingData ? fileFormShoppingData : ''
//                     };
//                     dispatch(uploadShoppingStructure(shoppingSentData));
//                 }
//                 // if (decode?.is_shopping_center_exist_in_property === true && fileFormData !== null) {
//                 //     let sendData = {
//                 //         file: fileFormData ? fileFormData : ''
//                 //     };
//                 //     dispatch(uploadPropertyStructure(sendData));
//                 // }
//                 if (!decode?.is_shopping_center_exist_in_property) {
//                     let sendData = {
//                         file: fileFormData ? fileFormData : ''
//                     };
//                     dispatch(uploadPropertyStructure(sendData));
//                 }
//             }
//             // if (fileFormData) {
//             //     let sendData = {
//             //         file: fileFormData ? fileFormData : ''
//             //     };
//             //     dispatch(uploadPropertyStructure(sendData));
//             // }
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     return (
//         <div className="mt-3">
//             <p>Kindly download the provided Excel sheet, enter your data as per the sheet's format, and subsequently upload the completed Excel sheet to generate the structure.</p>
//             <div className="flex">
//                 {decode?.is_shopping_center_exist_in_property === true && (
//                     <Button label="For Shopping Center Excel" icon="pi pi-download" className="p-button-outlined p-button-success mr-2 mb-2 w-15rem" onClick={() => downLoadOuterFile()} disabled={disabledOuter} loading={disabledOuter} />
//                 )}
//                 <Button
//                     label={decode?.property_type === 'Flat' ? 'For Flat Excel' : decode?.property_type === 'Complex' ? 'For Complex Excel' : 'For Society Excel'}
//                     icon="pi pi-download"
//                     className="p-button-outlined p-button-success mr-2 mb-2 w-15rem"
//                     onClick={() => downLoadInnerFile()}
//                     disabled={disabledInner}
//                     loading={disabledInner}
//                 />
//             </div>
//             <div className="grid p-fluid mt-4">
//                 {decode?.is_shopping_center_exist_in_property === true && <div className="field col-12 md:col-4 mb-1">
//                     <div>
//                         {/* <div className="my-2">{'Upload Shopping Excel*'}</div> */}
//                         <div className="my-2">
//                             <label htmlFor="" className="required">
//                                 Upload Shopping Excel
//                             </label>
//                         </div>
//                         {fileNameShopping === null && (
//                             <div className="file-input-upload">
//                                 <input type="file" id="fileInput1" accept=".xlsx" className="input" onChange={handleUploadShopping} />
//                                 <label for="fileInput1" className="label paddingForUpload">
//                                     <span>Choose {'Shopping Excel'} File...</span>
//                                 </label>
//                             </div>
//                         )}
//                         {fileNameShopping !== null && (
//                             <>
//                                 <div className="flex align-items-center">
//                                     <div>{fileNameShopping}</div>
//                                     <div className="ml-3">
//                                         <Button
//                                             icon="pi pi-trash"
//                                             className="p-button-rounded p-button-text  p-button-danger"
//                                             id="delete-icons"
//                                             tooltip="Delete"
//                                             tooltipOptions={{ position: 'bottom' }}
//                                             onClick={() => {
//                                                 setFileFormShoppingData(null);
//                                                 setFileNameShopping(null);
//                                                 dispatch(handleResetUpload());
//                                             }}
//                                         />
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>}
//                 <div className="field col-12 md:col-4 mb-1">
//                     <div>
//                         <div className="my-2">
//                             <label htmlFor="" className="required">
//                                 {decode?.property_type === 'Flat' ? 'Upload Flat Excel' : decode?.property_type === 'Complex' ? 'Upload Complex Excel' : 'Upload Society Excel'}
//                             </label>
//                         </div>
//                         {/* <div className="my-2">{decode?.property_type === 'Flat' ? 'Upload Flat Excel*' : decode?.property_type === 'Complex' ? 'Upload complex Excel*' : 'Upload Society Excel*'}</div> */}
//                         {fileName === null && (
//                             <div className="file-input-upload">
//                                 <input type="file" id="fileInput" accept=".xlsx" className="input" onChange={handleUpload} />
//                                 <label for="fileInput" className="label paddingForUpload">
//                                     <span>Choose {decode?.property_type === 'Flat' ? 'Flat Excel' : decode?.property_type === 'Complex' ? 'Complex Excel' : 'Society Excel'} File...</span>
//                                 </label>
//                             </div>
//                         )}
//                         {fileName !== null && (
//                             <>
//                                 <div className="flex align-items-center">
//                                     <div>{fileName}</div>
//                                     <div className="ml-3">
//                                         <Button
//                                             icon="pi pi-trash"
//                                             className="p-button-rounded p-button-text  p-button-danger"
//                                             id="delete-icons"
//                                             tooltip="Delete"
//                                             tooltipOptions={{ position: 'bottom' }}
//                                             onClick={() => {
//                                                 setFileFormData(null);
//                                                 setFileName(null);
//                                                 dispatch(handleResetUpload());
//                                             }}
//                                         />
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             {/* {decode?.is_shopping_center_exist_in_property === true && (
//                 <div>
//                     <div className="my-2">
//                         <label htmlFor="" className="required">
//                             Upload Shopping Excel
//                         </label>
//                     </div>
//                     {fileNameShopping === null && (
//                         <div className="file-input-upload">
//                             <input type="file" id="fileInput1" accept=".xlsx" className="input" onChange={handleUploadShopping} />
//                             <label for="fileInput1" className="label">
//                                 <span>Choose a {'shopping excel'} file...</span>
//                             </label>
//                         </div>
//                     )}
//                     {fileNameShopping !== null && (
//                         <>
//                             <div className="flex align-items-center">
//                                 <div>{fileNameShopping}</div>
//                                 <div className="ml-3">
//                                     <Button
//                                         icon="pi pi-trash"
//                                         className="p-button-rounded p-button-text  p-button-danger"
//                                         id="delete-icons"
//                                         tooltip="Delete"
//                                         tooltipOptions={{ position: 'bottom' }}
//                                         onClick={() => {
//                                             setFileFormShoppingData(null);
//                                             setFileNameShopping(null);
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             )} */}

//             <div className="my-2">
//                 {uploadShoppingErrors && uploadShoppingErrors.length > 0 && <div className="my-2 font-semibold">{'Shopping Excel Error'}</div>}
//                 {uploadShoppingErrors && uploadShoppingErrors.length > 0 && uploadShoppingErrors.map((a, i) => <div className="p-invalid error">{a}</div>)}
//             </div>

//             <div className="my-2">
//                 {uploadErrors && uploadErrors.length > 0 && <div className="my-2 font-semibold">{decode?.property_type === 'Flat' ? 'Flat Excel Error' : decode?.property_type === 'Complex' ? 'Complex Excel Error' : 'Society Excel Error'}</div>}
//                 {/* {uploadErrors && uploadErrors.length > 0 && uploadErrors.map((a, i) => <div className="p-invalid error">{a}</div>)} */}
//             </div>
//             <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
//                 {/* <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={onHide} /> */}
//                 <Button label={'Save'} onClick={onSubmit} icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
//             </div>
//         </div>
//     );
// };
// export default ExcelUpload;

import components from '../..';
import toast from 'react-hot-toast';
import { uploadPropertyStructure, handleResetUpload, uploadShoppingStructure } from '../../../../redux/slice/AdminSlices/blockSlice';

const ExcelUpload = ({ decode, onHide, shoppingStructureViewDetail }) => {
    const { React, Button, useState, useDispatch, useSelector, useEffect } = components;
    const dispatch = useDispatch();
    const { uploadErrors, uploadShoppingErrors, isShopsCreated } = useSelector((store) => store.block);
    const [disabledInner, SetDisabledInner] = useState(false);
    const [disabledOuter, SetDisabledOuter] = useState(false);
    const [fileFormShoppingData, setFileFormShoppingData] = useState(null);
    const [fileNameShopping, setFileNameShopping] = useState(null);
    const [fileFormData, setFileFormData] = useState(null);
    const [fileName, setFileName] = useState(null);

    useEffect(() => {
        dispatch(handleResetUpload());
    }, []);

    useEffect(() => {
        if (isShopsCreated && fileFormData) {
            let sendData = {
                file: fileFormData
            };
            dispatch(uploadPropertyStructure(sendData));
        }
    }, [isShopsCreated]);

    const downLoadInnerFile = () => {
        try {
            SetDisabledInner(true);
            setTimeout(() => {
                SetDisabledInner(false);
            }, 5000);
            let filePath =
                decode?.is_block_exist_in_property && decode?.is_floor_exist_in_property && decode?.is_ground_floor_exist_in_property && decode?.property_type === 'Complex'
                    ? 'society_management - Block_Floor_Ground(complex).xlsx'
                    : decode?.is_block_exist_in_property && decode?.is_floor_exist_in_property
                        ? 'society_management - Block_Floor(flat).xlsx'
                        : decode?.is_floor_exist_in_property && decode?.is_ground_floor_exist_in_property && decode?.property_type === 'Complex'
                            ? 'society_management - Floor_Ground(complex).xlsx'
                            : decode?.is_floor_exist_in_property && (decode?.property_type === 'Complex' || decode?.property_type === 'Flat')
                                ? 'society_management - Only_Floor.xlsx'
                                : decode?.is_block_exist_in_property && decode?.is_house_exist_in_property && decode?.property_type === 'Society'
                                    ? 'society_management - Block_House.xlsx'
                                    : decode?.is_house_exist_in_property && decode?.property_type === 'Society' && 'society_management - Only_House.xlsx';
            var url = `${process.env.REACT_APP_BASE}uploads/excelFiles/${filePath}`;
            fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.setAttribute('download', filePath);
                    link.click();
                    window.URL.revokeObjectURL(blobUrl);
                })
                .catch((error) => {
                    console.error('Error downloading file:', error);
                    toast.error('Error downloading file');
                });
        } catch (error) {
            console.error(error);
            toast.error('Error downloading file');
        }
    };

    const downLoadOuterFile = () => {
        try {
            SetDisabledOuter(true);
            setTimeout(() => {
                SetDisabledOuter(false);
            }, 5000);
            let filePath = decode?.is_block_exist_in_shopping_center_property ? 'society_management - Block_Floor_Shop(shopping center).xlsx' : 'society_management - Floor_Shop(shopping center).xlsx';
            var url = `${process.env.REACT_APP_BASE}uploads/excelFiles/${filePath}`;
            fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.setAttribute('download', filePath);
                    link.click();
                    window.URL.revokeObjectURL(blobUrl);
                })
                .catch((error) => {
                    console.error('Error downloading file:', error);
                    toast.error('Error downloading file');
                });
        } catch (error) {
            console.error(error);
            toast.error('Error downloading file');
        }
    };

    const handleUploadShopping = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            const str = file.name;
            if (!str.endsWith('.xlsx')) {
                toast.error('Only Accept xlsx', {
                    style: { marginTop: '4rem' }
                });
                return;
            }

            setFileFormShoppingData(file);
            setFileNameShopping(str);
        } catch (error) {
            console.error(error);
            toast.error('Error uploading file');
        }
    };

    const handleUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            const str = file.name;
            if (!str.endsWith('.xlsx')) {
                toast.error('Only Accept xlsx', {
                    style: { marginTop: '4rem' }
                });
                return;
            }

            setFileFormData(file);
            setFileName(str);
        } catch (error) {
            console.error(error);
            toast.error('Error uploading file');
        }
    };

    const onSubmit = () => {
        try {
            if (!fileFormData || (decode?.is_shopping_center_exist_in_property === true && !fileFormShoppingData)) {
                toast.error('Please upload a file.', {
                    style: { marginTop: '4rem' }
                });
                return;
            }

            if (decode?.is_shopping_center_exist_in_property === true && fileFormShoppingData) {
                dispatch(uploadShoppingStructure({ file: fileFormShoppingData }));
            }

            if (!decode?.is_shopping_center_exist_in_property) {
                dispatch(uploadPropertyStructure({ file: fileFormData }));
            }
        } catch (error) {
            console.error(error);
            toast.error('Error submitting files');
        }
    };

    const renderErrors = (errors, title) => {
        if (!Array.isArray(errors) || errors.length === 0) return null;

        return (
            <div className="my-2">
                <div className="my-2 font-semibold">{title}</div>
                {errors.map((error, index) => (
                    <div key={index} className="p-invalid error">
                        {error}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="mt-3">
            <p>Kindly download the provided Excel sheet, enter your data as per the sheet's format, and subsequently upload the completed Excel sheet to generate the structure.</p>
            <div className="flex">
                {decode?.is_shopping_center_exist_in_property === true && (
                    <Button label="For Shopping Center Excel" icon="pi pi-download" className="p-button-outlined p-button-success mr-2 mb-2 w-15rem" onClick={downLoadOuterFile} disabled={disabledOuter} loading={disabledOuter} />
                )}
                <Button
                    label={decode?.property_type === 'Flat' ? 'For Flat Excel' : decode?.property_type === 'Complex' ? 'For Complex Excel' : 'For Society Excel'}
                    icon="pi pi-download"
                    className="p-button-outlined p-button-success mr-2 mb-2 w-15rem"
                    onClick={downLoadInnerFile}
                    disabled={disabledInner}
                    loading={disabledInner}
                />
            </div>
            <div className="grid p-fluid mt-4">
                {decode?.is_shopping_center_exist_in_property === true && (
                    <div className="field col-12 md:col-4 mb-1">
                        <div>
                            <div className="my-2">
                                <label htmlFor="" className="required">
                                    Upload Shopping Excel
                                </label>
                            </div>
                            {fileNameShopping === null ? (
                                <div className="file-input-upload">
                                    <input type="file" id="fileInput1" accept=".xlsx" className="input" onChange={handleUploadShopping} />
                                    <label htmlFor="fileInput1" className="label paddingForUpload">
                                        <span>Choose Shopping Excel File...</span>
                                    </label>
                                </div>
                            ) : (
                                <div className="flex align-items-center">
                                    <div>{fileNameShopping}</div>
                                    <div className="ml-3">
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-text p-button-danger"
                                            id="delete-icons"
                                            tooltip="Delete"
                                            tooltipOptions={{ position: 'bottom' }}
                                            onClick={() => {
                                                setFileFormShoppingData(null);
                                                setFileNameShopping(null);
                                                dispatch(handleResetUpload());
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className="field col-12 md:col-4 mb-1">
                    <div>
                        <div className="my-2">
                            <label htmlFor="" className="required">
                                {decode?.property_type === 'Flat' ? 'Upload Flat Excel' : decode?.property_type === 'Complex' ? 'Upload Complex Excel' : 'Upload Society Excel'}
                            </label>
                        </div>
                        {fileName === null ? (
                            <div className="file-input-upload">
                                <input type="file" id="fileInput" accept=".xlsx" className="input" onChange={handleUpload} />
                                <label htmlFor="fileInput" className="label paddingForUpload">
                                    <span>Choose {decode?.property_type === 'Flat' ? 'Flat Excel' : decode?.property_type === 'Complex' ? 'Complex Excel' : 'Society Excel'} File...</span>
                                </label>
                            </div>
                        ) : (
                            <div className="flex align-items-center">
                                <div>{fileName}</div>
                                <div className="ml-3">
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-rounded p-button-text p-button-danger"
                                        id="delete-icons"
                                        tooltip="Delete"
                                        tooltipOptions={{ position: 'bottom' }}
                                        onClick={() => {
                                            setFileFormData(null);
                                            setFileName(null);
                                            dispatch(handleResetUpload());
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {renderErrors(uploadShoppingErrors, 'Shopping Excel Error')}
            {renderErrors(uploadErrors, `${decode?.property_type === 'Flat' ? 'Flat' : decode?.property_type === 'Complex' ? 'Complex' : 'Society'} Excel Error`)}

            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                <Button label="Save" onClick={onSubmit} icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
            </div>
        </div>
    );
};

export default ExcelUpload;
