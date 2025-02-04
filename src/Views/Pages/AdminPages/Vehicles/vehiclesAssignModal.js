import components from '../..';
import jwtDecode from 'jwt-decode';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getBlockDropdownRequest, getFloorDropdownRequest, getPropertyDropDownWithOwnerIdRequest, getShopBlockDropdownRequest, getShopFloorDropdownRequest, getVehicleUserPropertyList } from '../../../../redux/slice/AdminSlices/blockSlice';
import { vehicleAssignRequest, updateVehicleAssignRequest } from '../../../../redux/slice/AdminSlices/vehicleSlice';
import { getUserPropertyAssignData } from '../../../../redux/slice/AdminSlices/RentalSlice';
const VehiclesModel = ({ editData, onHide }) => {
    const { Dialog, Dropdown, Button, InputText, RadioButton, Image, classNames, useDispatch, useState, useEffect, useSelector } = components;
    const { token, loginDetails } = useSelector((store) => store.auth);
    // const { userAssignData } = useSelector((state) => state.rental);
    const { blockDropdownData, floorDropdownData, propertyDropdownWithOwnerId, vehicleUserProperty } = useSelector((store) => store.block);

    const dispatch = useDispatch();

    const [submitted, setSubmitted] = useState(false);
    const [createShopping, setCreateShopping] = useState(true);
    const [decode, setDecode] = useState(loginDetails);
    const [showFile, setShowFile] = useState(null);
    const [formValue, setFormValue] = useState({
        id: '',
        // block: '',
        // floor: '',
        property: '',
        owner_id: '',
        vehicle_type: '',
        vehicle_no: '',
        parking_spot: '',
        file: null
    });
    const SignupSchema = Yup.object().shape({
        property: Yup.string().trim().nullable().required('Please select property'),
        vehicle_type: Yup.string().trim().nullable().required('Please select vehicle type'),
        vehicle_no: Yup.string()
            .trim()
            .nullable()
            .matches(/^[a-zA-Z0-9]*$/, 'Special characters are not allowed')
            .required('Please enter vehicle number'),
        parking_spot: Yup.string().trim().nullable().required('Please enter parking spot')
    });
    useEffect(() => {
        decodeURI();
        if (editData !== null) {
            let setData = {
                id: editData?._id,
                property: editData?.user_property_assign_id,
                owner_id: editData?.owner_id,
                vehicle_type: editData?.vehicle_type,
                vehicle_no: editData?.vehicle_number,
                parking_spot: editData?.parking_spot,
                file: editData?.vehicle_image ? editData?.vehicle_image : null
            };
            editData?.vehicle_image && setShowFile(`${editData?.vehicle_image}`);
            setFormValue(setData);
        }
    }, [dispatch, editData]);

    const decodeURI = async () => {
        try {
            // let decodeData = await jwtDecode(token);
            dispatch(getVehicleUserPropertyList({ module_name: 'Inner' }));
            // if (decodeData.is_block_exist_in_property === true) {
            //     dispatch(getBlockDropdownRequest());
            // }
            // if (decodeData.is_block_exist_in_property === undefined && decodeData.is_floor_exist_in_property === true) {
            //     dispatch(getFloorDropdownRequest({}));
            // }
            // if (decodeData.is_block_exist_in_property === undefined && decodeData.is_floor_exist_in_property === undefined && decodeData.is_house_exist_in_property === true) {
            //     dispatch(getPropertyDropDownWithOwnerIdRequest({ module_name: 'complain' }));
            // }
            // decodeData?.role === 'User' && dispatch(getUserPropertyAssignData());
            // setDecode(decodeData);
        } catch (error) {
            console.log(error);
        }
    };
    const getShoppingDropdown = () => {
        try {
            dispatch(getVehicleUserPropertyList({ module_name: 'Outer' }));
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
    const handleUpload = async (event, setFieldValue) => {
        try {
            const str = event.target.files[0]?.name;
            const substr = ['.jpg', '.jpeg', '.png'];
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                setFieldValue('file', event.target.files[0]);
                setShowFile(URL.createObjectURL(event.target.files[0]));
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
    return (
        <Dialog visible={true} style={{ width: '80vw' }} header={formValue.id === '' ? 'Create Vehicle' : 'Edit Vehicle'} modal className="p-fluid" onHide={onHide}>
            <Formik
                initialValues={formValue}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                    setSubmitted(true);
                    setTimeout(() => {
                        setSubmitted(false);
                    }, 5000);

                    let sendData = {
                        vehicle_number: values.vehicle_no,
                        vehicle_type: values.vehicle_type,
                        parking_spot: values.parking_spot,
                        user_property_assign_id: values.property,
                        file: values?.file !== null ? values?.file : ''
                    };
                    if (values.id === '') {
                        sendData.owner_id = values.owner_id;
                    }
                    values.id === '' && dispatch(vehicleAssignRequest(sendData));
                    values.id !== '' && dispatch(updateVehicleAssignRequest(values.id, sendData));
                }}
            >
                {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                    <Form>
                        {values.id === '' && decode?.role !== 'User' && (
                            <div className="grid p-fluid mt-1">
                                {decode?.is_shopping_center_exist_in_property === true && (
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
                            {/* {values.id === '' && decode?.role !== 'User' && ((decode?.is_block_exist_in_property === true && createShopping === true) || (createShopping === false && decode.is_block_exist_in_shopping_center_property === true)) && (
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
                                            setFieldValue('owner_id', '');
                                            (decode?.is_floor_exist_in_property === true) & (createShopping === true) && dispatch(getFloorDropdownRequest({ block_id: e.target.value }));
                                            decode.is_floor_exist_in_shopping_center_property === true && createShopping === false && dispatch(getShopFloorDropdownRequest({ block_id: e.target.value }));
                                            !decode?.is_floor_exist_in_property && createShopping === true && dispatch(getPropertyDropDownWithOwnerIdRequest({ block_id: e.target.value, module_name: 'complain' }));
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property && values?.block === '' })}
                                        // className={classNames({ 'p-invalid': fieldError && values?.block === '' })}
                                    />
                                    {errors.property && touched.property && values?.block === '' ? <small className="p-invalid error">{'Please select block'}</small> : null}
                                </div>
                            )} */}
                            {/* {values.id === '' && decode?.role !== 'User' && ((decode?.is_floor_exist_in_property === true && createShopping === true) || (createShopping === false && decode.is_floor_exist_in_shopping_center_property === true)) && (
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
                                            setFieldValue('owner_id', '');
                                            dispatch(getPropertyDropDownWithOwnerIdRequest({ block_id: values?.block, floor_id: e.target.value, module_name: 'complain' }));
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property && values?.floor === '' })}
                                        // className={classNames({ 'p-invalid': fieldError && values?.floor === '' })}
                                        disabled={
                                            (decode?.is_block_exist_in_property === undefined && createShopping === true) || (createShopping === false && decode.is_block_exist_in_shopping_center_property === undefined) ? false : values?.block === ''
                                        }
                                    />
                                    {errors.property && touched.property && values?.floor === '' ? <small className="p-invalid error">{'Please select floor'}</small> : null}
                                </div>
                            )} */}
                            {/* {values.id === '' && decode?.role !== 'User' && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="property" className="required">
                                        Select property
                                    </label>
                                    <Dropdown
                                        id="property"
                                        optionLabel="label"
                                        optionValue="property_assign_id"
                                        options={propertyDropdownWithOwnerId}
                                        name="property"
                                        placeholder="Select property"
                                        type="text"
                                        value={values?.property}
                                        onChange={(e) => {
                                            setFieldValue('property', e.target.value);
                                            setFieldValue('owner_id', propertyDropdownWithOwnerId.find((x) => x.property_assign_id === e.target.value).owner_id);
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property })}
                                        disabled={
                                            (decode?.is_block_exist_in_property !== undefined && decode?.is_floor_exist_in_property === undefined && createShopping === true && values?.block !== '') ||
                                            (decode?.is_block_exist_in_property === undefined && decode?.is_floor_exist_in_property === undefined && createShopping === true) ||
                                            (decode?.is_block_exist_in_shopping_center_property === undefined && decode?.is_floor_exist_in_shopping_center_property === undefined && createShopping === false)
                                                ? false
                                                : values?.floor === ''
                                        }
                                    />
                                    {errors.property && touched.property ? <small className="p-invalid error">{errors.property}</small> : null}
                                </div>
                            )} */}
                            {/* {values.id === '' && decode?.role === 'User' && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="property" className="required">
                                        Select property
                                    </label>
                                    <Dropdown
                                        id="property"
                                        optionLabel="property_number"
                                        optionValue="user_property_assign_id"
                                        options={userAssignData ? userAssignData?.data : []}
                                        name="property"
                                        placeholder="Select property"
                                        type="text"
                                        value={values?.property}
                                        onChange={(e) => {
                                            let ownerId = userAssignData?.data.find((x) => x.user_property_assign_id === e.target.value);
                                            setFieldValue('property', e.target.value);
                                            setFieldValue('owner_id', ownerId?.owner_id);
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property })}
                                    />
                                    {errors.property && touched.property ? <small className="p-invalid error">{errors.property}</small> : null}
                                </div>
                            )} */}
                            {/* {values.id !== '' && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="property" className="required">
                                        Select property
                                    </label>
                                    <InputText id="property" name="property" type="text" value={editData?.property_number} />
                                </div>
                            )} */}
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="property" className="required">
                                    Select property
                                </label>
                                <Dropdown
                                    id="property"
                                    optionLabel="label"
                                    optionValue="property_assign_id"
                                    options={vehicleUserProperty ? vehicleUserProperty : []}
                                    name="property"
                                    placeholder="Select property"
                                    type="text"
                                    value={values?.property}
                                    onChange={(e) => {
                                        let ownerId = vehicleUserProperty.find((x) => x.property_assign_id === e.target.value);
                                        setFieldValue('property', e.target.value);
                                        setFieldValue('owner_id', ownerId?.owner_id);
                                    }}
                                    className={classNames({ 'p-invalid': errors.property && touched.property })}
                                    disabled={values.id !== ''}
                                />
                                {errors.property && touched.property ? <small className="p-invalid error">{errors.property}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="vehicle_type" className="required">
                                    Vehicle type
                                </label>
                                <Dropdown
                                    id="vehicle_type"
                                    optionLabel="label"
                                    optionValue="value"
                                    options={[
                                        { label: '2-wheeler', value: '2-wheeler' },
                                        { label: '3-wheeler', value: '3-wheeler' },
                                        { label: '4-wheeler', value: '4-wheeler' }
                                    ]}
                                    name="vehicle_type"
                                    placeholder="Select vehicle type"
                                    type="text"
                                    value={values?.vehicle_type}
                                    onChange={(e) => {
                                        setFieldValue('vehicle_type', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': errors.vehicle_type && touched.vehicle_type })}
                                />
                                {errors.vehicle_type && touched.vehicle_type ? <small className="p-invalid error">{errors.vehicle_type}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="vehicle_no" className="required">
                                    Vehicle number
                                </label>
                                <InputText
                                    id="vehicle_no"
                                    name="vehicle_no"
                                    placeholder="Enter vehicle number (E.g. GJ00AA0000)"
                                    type="text"
                                    value={values?.vehicle_no}
                                    onChange={(e) => setFieldValue('vehicle_no', e.target.value.trim().toUpperCase().replace(' ', ''))}
                                    className={classNames({ 'p-invalid': errors.vehicle_no && touched.vehicle_no })}
                                />
                                {errors.vehicle_no && touched.vehicle_no ? <small className="p-invalid error">{errors.vehicle_no}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="parking_spot" className="required">
                                    Parking spot
                                </label>
                                <InputText
                                    id="parking_spot"
                                    name="parking_spot"
                                    placeholder="Enter parking spot"
                                    type="text"
                                    value={values?.parking_spot}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.parking_spot && touched.parking_spot })}
                                />
                                {errors.parking_spot && touched.parking_spot ? <small className="p-invalid error">{errors.parking_spot}</small> : null}
                            </div>
                        </div>
                        <div className="grid p-fluid mt-1">
                            {values?.file === null && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <div className="file-input-upload">
                                        <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                        <label for="fileInput" className="label">
                                            <span>Upload a profile image...</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                            {values?.file !== null && (
                                <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                    <Image src={showFile} alt="Image" width="100" height="100" preview />
                                    <div className="ml-1">
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-text  p-button-danger"
                                            id="delete-icons"
                                            tooltip="Delete"
                                            tooltipOptions={{ position: 'bottom' }}
                                            onClick={() => {
                                                setFieldValue('file', null);
                                                setShowFile(null);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={onHide} />
                                <Button disabled={submitted} label={values.id === '' ? 'Save' : 'Update'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
export default VehiclesModel;
