import components from '../..';
import jwtDecode from 'jwt-decode';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getBlockDropdownRequest, getFloorDropdownRequest, getShopBlockDropdownRequest, getShopFloorDropdownRequest, getPropertyDropDownWithOwnerIdRequest, getPropertyDropDownWithOwner } from '../../../../redux/slice/AdminSlices/blockSlice';
import { complaintAssignRequest, updateComplaintRequest } from '../../../../redux/slice/AdminSlices/complaintSlice';
const ComplaintModel = ({ editData, onHide }) => {
    const { Dialog, Dropdown, Image, InputTextarea, Button, RadioButton, classNames, useDispatch, useState, useEffect, useSelector } = components;
    const { token } = useSelector((store) => store.auth);
    // const { userDetailsByProperty } = useSelector((store) => store.user);
    const { blockDropdownData, floorDropdownData, propertyDropdownWithOwner } = useSelector((store) => store.block);

    const dispatch = useDispatch();

    const [submitted, setSubmitted] = useState(false);
    const [createShopping, setCreateShopping] = useState(true);
    const [createForChairman, setCreateForChairman] = useState(false);
    const [decode, setDecode] = useState(null);
    const [formValue, setFormValue] = useState({
        id: '',
        block: '',
        floor: '',
        property: '',
        user_id: '',
        description: '',
        complaint_image: []
    });
    const SignupSchema = Yup.object().shape({
        user_id: Yup.string().trim().nullable().required('Please select property'),
        property: Yup.string().trim().nullable().required('Please select property'),
        description: Yup.string().trim().nullable().required('Please enter description')
    });
    const SignupSchema2 = Yup.object().shape({
        description: Yup.string().trim().nullable().required('Please enter description')
    });
    useEffect(() => {
        decodeURI();
        if (editData !== null) {
            let file = [];
            editData?.complain_files.length > 0 &&
                editData?.complain_files.forEach((a) => {
                    file.push({ img: a, showImg: `${process.env.REACT_APP_BASE}uploads/complain/${a}` });
                });
            let setData = {
                id: editData._id,
                block: '',
                floor: '',
                property: editData.user_property_assign_id,
                user_id: editData.user_id,
                description: editData.description,
                complaint_image: file
            };
            setFormValue(setData);
        }
    }, [dispatch, editData]);
    // useEffect(() => {
    //     if (userDetailsByProperty !== null) {
    //         let user = {
    //             userName: userDetailsByProperty.name,
    //             userID: userDetailsByProperty.id
    //         };
    //         setUserDetail(user);
    //     } else if (editData === null) {
    //         setUserDetail(null);
    //     }
    // }, [userDetailsByProperty]);
    const decodeURI = async () => {
        try {
            // let decodeData = await jwtDecode(token);

            // if (decodeData.is_block_exist_in_property === true) {
            //     dispatch(getBlockDropdownRequest());
            // }
            // if (decodeData.is_block_exist_in_property === undefined && decodeData.is_floor_exist_in_property === true) {
            //     dispatch(getFloorDropdownRequest({}));
            // }
            // if (decodeData.is_block_exist_in_property === undefined && decodeData.is_floor_exist_in_property === undefined && decodeData.is_house_exist_in_property === true) {
            //     dispatch(getPropertyDropDownWithOwnerIdRequest({ module_name: 'complain' }));
            // }
            dispatch(getPropertyDropDownWithOwner({ module_name: 'Inner' }));
            // setDecode(decodeData);
        } catch (error) {
            console.log(error);
        }
    };
    const getShoppingDropdown = () => {
        try {
            dispatch(getPropertyDropDownWithOwner({ module_name: 'Outer' }));
            // if (decode.is_block_exist_in_shopping_center_property === true) {
            //     dispatch(getShopBlockDropdownRequest());
            // }
            // if (decode.is_block_exist_in_shopping_center_property === undefined && decode.is_floor_exist_in_shopping_center_property === true) {
            //     dispatch(getShopFloorDropdownRequest({}));
            // }
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpload = async (event, value, setFieldValue) => {
        try {
            const str = event.target.files[0]?.name;
            const substr = ['.jpg', '.jpeg', '.png'];
            const fileSize = event.target.files[0]?.size;
            const maxFileSize = 2 * 1024 * 1024;
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                if (fileSize <= maxFileSize) {
                    let data = value;
                    data.push({ img: event.target.files[0], showImg: URL.createObjectURL(event.target.files[0]) });
                    setFieldValue('complaint_image', data);
                } else {
                    toast.error(`accept only file size less then 2mb`, {
                        style: {
                            marginTop: '4rem'
                        }
                    });
                }
                // let formData = new FormData();
                // formData.append('file', event.target.files[0]);
                // setFileFormData(event.target.files[0]);
                // setFileName(str);
            } else {
                toast.error('Only Accept png , jpeg, jpg', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const removeImg = (i, value, setFieldValue) => {
        try {
            let data = value;
            data.splice(i, 1);
            setFieldValue('complaint_image', data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Dialog visible={true} style={{ width: '80vw' }} header={formValue?.id === '' ? 'Create Complaint' : 'Edit Complaint'} modal className="p-fluid" onHide={onHide}>
            <Formik
                initialValues={formValue}
                validationSchema={!createForChairman ? SignupSchema : SignupSchema2}
                onSubmit={(values) => {
                    setSubmitted(true);
                    setTimeout(() => {
                        setSubmitted(false);
                    }, 5000);
                    let images = values?.complaint_image.map((item) => item.img);
                    let formData = new FormData();
                    formData.append('description', values?.description);
                    for (const file of images) {
                        formData.append('files', file);
                    }
                    if (values?.id !== '' && images.length === 0) {
                        formData.append('files', []);
                    }
                    if (!createForChairman && values?.id === '') {
                        formData.append('user_id', values?.user_id);
                        formData.append('user_property_assign_id', values?.property);
                    }
                    // let sendData = {
                    //     // user_id: values?.user_id,
                    //     // user_property_assign_id: values?.property,
                    //     description: values?.description,
                    //     files: images ? images : []
                    // };
                    // if (!createForChairman) {
                    //     sendData.user_id = values?.user_id;
                    //     sendData.user_property_assign_id = values?.property;
                    // }
                    values?.id === '' ? dispatch(complaintAssignRequest(formData)) : dispatch(updateComplaintRequest(values?.id, formData));
                }}
            >
                {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                    <Form>
                        {values.id === '' && (
                            <div className="grid p-fluid mt-1">
                                {decode?.role === 'User' && (
                                    <div className="field col-12 md:col-4 mb-1">
                                        <label className="required">Do you want complain to chairman </label>
                                        <div className="flex flex-wrap gap-3 ">
                                            <div className="flex align-items-center">
                                                <RadioButton
                                                    inputId="createForChairman1"
                                                    name="createForChairman"
                                                    value="yes"
                                                    onChange={(e) => {
                                                        setCreateForChairman(true);
                                                        setCreateShopping(true);
                                                        decodeURI();
                                                        handleReset();
                                                        setFieldValue('complaint_image', []);
                                                    }}
                                                    checked={createForChairman === true}
                                                />
                                                <label htmlFor="createForChairman1" className="ml-2">
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="flex align-items-center">
                                                <RadioButton
                                                    inputId="createForChairman2"
                                                    name="createForChairman"
                                                    value="no"
                                                    onChange={(e) => {
                                                        setCreateForChairman(false);
                                                        setCreateShopping(true);
                                                        decodeURI();
                                                        handleReset();
                                                        setFieldValue('complaint_image', []);
                                                    }}
                                                    checked={createForChairman === false}
                                                />
                                                <label htmlFor="createForChairman2" className="ml-2">
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {decode?.is_shopping_center_exist_in_property === true && !createForChairman && (
                                    <div className="field col-12 md:col-4 mb-1">
                                        <label className="required">Property assign type</label>
                                        <div className="flex flex-wrap gap-3 ">
                                            <div className="flex align-items-center">
                                                <RadioButton
                                                    inputId="createShopping1"
                                                    name="createShopping"
                                                    value="Flat"
                                                    onChange={(e) => {
                                                        setCreateShopping(true);
                                                        decodeURI();
                                                        handleReset();
                                                        setFieldValue('complaint_image', []);
                                                    }}
                                                    checked={createShopping === true}
                                                />
                                                <label htmlFor="createShopping1" className="ml-2">
                                                    Flat
                                                </label>
                                            </div>
                                            <div className="flex align-items-center">
                                                <RadioButton
                                                    inputId="createShopping2"
                                                    name="createShopping"
                                                    value="Shopping"
                                                    onChange={(e) => {
                                                        setCreateShopping(false);
                                                        getShoppingDropdown();
                                                        handleReset();
                                                        setFieldValue('complaint_image', []);
                                                    }}
                                                    checked={createShopping === false}
                                                />
                                                <label htmlFor="createShopping2" className="ml-2">
                                                    Shopping
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="grid p-fluid mt-1">
                            {/* {((decode?.is_block_exist_in_property === true && createShopping === true) || (createShopping === false && decode.is_block_exist_in_shopping_center_property === true)) && values.id === '' && !createForChairman && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="block" className="required">
                                        Select block
                                    </label>
                                    <Dropdown
                                        id="block"
                                        optionLabel="label"
                                        optionValue="block_id"
                                        options={blockDropdownData}
                                        name="block"
                                        placeholder="Select block"
                                        type="text"
                                        value={values?.block}
                                        onChange={(e) => {
                                            setFieldValue('block', e.target.value);
                                            setFieldValue('floor', '');
                                            setFieldValue('property', '');
                                            (decode?.is_floor_exist_in_property === true) & (createShopping === true) && dispatch(getFloorDropdownRequest({ block_id: e.target.value }));
                                            decode.is_floor_exist_in_shopping_center_property === true && createShopping === false && dispatch(getShopFloorDropdownRequest({ block_id: e.target.value }));
                                            !decode?.is_floor_exist_in_property && createShopping === true && dispatch(getPropertyDropDownWithOwnerIdRequest({ block_id: e.target.value, module_name: 'complain' }));
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property && values?.block === '' })}
                                        // filter
                                    />
                                    {errors.property && touched.property && values?.block === '' ? <small className="p-invalid error">{'Please select block'}</small> : null}
                                </div>
                            )} */}
                            {/* {((decode?.is_floor_exist_in_property === true && createShopping === true) || (createShopping === false && decode.is_floor_exist_in_shopping_center_property === true)) && values.id === '' && !createForChairman && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="floor" className="required">
                                        Select floor
                                    </label>
                                    <Dropdown
                                        id="floor"
                                        optionLabel="label"
                                        optionValue="floor_id"
                                        options={floorDropdownData}
                                        name="floor"
                                        placeholder="Select floor"
                                        type="text"
                                        value={values?.floor}
                                        onChange={(e) => {
                                            setFieldValue('floor', e.target.value);
                                            setFieldValue('property', '');
                                            dispatch(getPropertyDropDownWithOwnerIdRequest({ block_id: values?.block, floor_id: e.target.value, module_name: 'complain' }));
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property && values?.floor === '' })}
                                        disabled={
                                            (decode?.is_block_exist_in_property === undefined && createShopping === true) || (createShopping === false && decode.is_block_exist_in_shopping_center_property === undefined) ? false : values?.block === ''
                                        }
                                    />
                                    {errors.property && touched.property && values?.floor === '' ? <small className="p-invalid error">{'Please select floor'}</small> : null}
                                </div>
                            )} */}
                            {values.id === '' && !createForChairman && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="property" className="required">
                                        Select property
                                    </label>
                                    <Dropdown
                                        id="property"
                                        optionLabel="label"
                                        optionValue="property_assign_id"
                                        options={propertyDropdownWithOwner}
                                        name="property"
                                        placeholder="Select property"
                                        type="text"
                                        value={values?.property}
                                        onChange={(e) => {
                                            setFieldValue('property', e.target.value);
                                            setFieldValue('user_id', propertyDropdownWithOwner.find((x) => x.property_assign_id === e.target.value).owner_id);
                                            // dispatch(userDetailsByPropertyId({ user_property_assign_id: e.target.value }));
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property && values?.property === '' })}
                                        filter
                                    // disabled={
                                    //     (decode?.is_block_exist_in_property !== undefined && decode?.is_floor_exist_in_property === undefined && createShopping === true && values?.block !== '') ||
                                    //     (decode?.is_block_exist_in_property === undefined && decode?.is_floor_exist_in_property === undefined && createShopping === true) ||
                                    //     (decode?.is_block_exist_in_shopping_center_property === undefined && decode?.is_floor_exist_in_shopping_center_property === undefined && createShopping === false)
                                    //         ? false
                                    //         : values?.floor === ''
                                    // }
                                    />
                                    {errors.property && touched.property && values?.property === '' ? <small className="p-invalid error">{errors.property}</small> : null}
                                </div>
                            )}
                            <div className="field col-12 md:col-12 mb-1">
                                <label htmlFor="description" className="required">
                                    Enter description
                                </label>
                                <InputTextarea
                                    id="description"
                                    placeholder="Enter description"
                                    rows="3"
                                    cols="30"
                                    autoResize
                                    value={values?.description}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.description && touched.description })}
                                />
                                {errors.description && touched.description ? <small className="p-invalid error">{errors.description}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <div className="file-input-upload">
                                    <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, values?.complaint_image, setFieldValue)} />
                                    <label for="fileInput" className="label">
                                        <span>Upload a complain file...</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {values?.complaint_image.length > 0 && (
                            <div className="flex gap-2">
                                {values?.complaint_image.map((a, i) => (
                                    <div className="block text-center">
                                        <Image src={a.showImg} alt="Image" width="100" height="100" preview />
                                        <div className="ml-1">
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-rounded p-button-text  p-button-danger"
                                                id="delete-icons"
                                                tooltip="Delete"
                                                tooltipOptions={{ position: 'bottom' }}
                                                onClick={() => {
                                                    removeImg(i, values?.complaint_image, setFieldValue);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* {values?.complaint_image.length > 0 &&
                            values?.complaint_image.map((a, i) => (
                                <div className="flex align-items-center mb-2">
                                    <Image src={a.showImg} alt="Image" width="100" preview />
                                    <div className="ml-3">
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-text  p-button-danger"
                                            id="delete-icons"
                                            tooltip="Delete"
                                            tooltipOptions={{ position: 'bottom' }}
                                            onClick={() => {
                                                // setFileFormData(null);
                                                // setFileName(null);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))} */}
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={onHide} />
                                <Button disabled={submitted} label="Save" type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
export default ComplaintModel;
