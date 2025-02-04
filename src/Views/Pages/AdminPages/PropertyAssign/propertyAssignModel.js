import components from '../..';
import jwtDecode from 'jwt-decode';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getBlockDropdownRequest, getFloorDropdownRequest, getPropertyDropdownRequest, getShopBlockDropdownRequest, getShopFloorDropdownRequest } from '../../../../redux/slice/AdminSlices/blockSlice';
import { propertyAssignRequest } from '../../../../redux/slice/AdminSlices/propertySlice';
import { getUserDropdown } from '../../../../redux/slice/AdminSlices/userSlice';

const PropertyAssignModel = ({ onHide }) => {
    const { InputText, Button, Dropdown, InputNumber, InputTextarea, RadioButton, classNames, Dialog, useState, useDispatch, useEffect, useSelector } = components;
    const { blockDropdownData, floorDropdownData, propertyDropdownData } = useSelector((store) => store.block);
    const { token } = useSelector((store) => store.auth);
    const { userDropdownData } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [createShopping, setCreateShopping] = useState(true);
    const [createExisting, setCreateExisting] = useState(false);
    // const [ownerDropName, setOwnerDropName] = useState(null);
    const [formValue, setFormValue] = useState({
        id: '',
        ownerName: '',
        email: '',
        gender: '',
        mobile_number: null,
        alternate_number: null,
        permanent_address: '',
        block: '',
        floor: '',
        property: '',
        property_sq_feet_area: null,
        property_status: 'Active'
    });
    const [decode, setDecode] = useState(null);
    const SignupSchema = Yup.object().shape({
        ownerName: Yup.string().trim().nullable().required(' '),
        gender: Yup.string().trim().nullable().required('Please select gender'),
        email: Yup.string().trim().nullable().required('Please enter email').email('Please enter valid email.'),
        mobile_number: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number'),
        property_sq_feet_area: Yup.number().nullable().positive('Must be more than 0').required('Please enter square feet'),
        alternate_number: Yup.string().trim().nullable().min(10, 'Alternate no must be at least 10 digit no.').max(10, 'Alternate no must be at least 10 digit number.'),
        property: Yup.string().trim().nullable().required('Please select property')
    });

    useEffect(() => {
        decodeURI();
    }, [dispatch]);
    const decodeURI = async () => {
        let decodeData = await jwtDecode(token);
        if (decodeData.is_block_exist_in_property === true) {
            dispatch(getBlockDropdownRequest());
        }
        if (decodeData.is_block_exist_in_property === undefined && decodeData.is_floor_exist_in_property === true) {
            dispatch(getFloorDropdownRequest({}));
        }
        if (decodeData.is_block_exist_in_property === undefined && decodeData.is_floor_exist_in_property === undefined && decodeData.is_house_exist_in_property === true) {
            dispatch(getPropertyDropdownRequest({ module_name: 'user_property_assign' }));
        }

        setDecode(decodeData);
        // is_floor_exist_in_property
    };
    const getShoppingDropdown = () => {
        try {
            if (decode.is_block_exist_in_shopping_center_property === true) {
                dispatch(getShopBlockDropdownRequest());
            }
            if (decode.is_block_exist_in_shopping_center_property === undefined && decode.is_floor_exist_in_shopping_center_property === true) {
                dispatch(getShopFloorDropdownRequest({}));
            }
        } catch (error) {
            console.log(error);
        }
    };
    const setLabelName = (option, props) => {
        try {
            if (option) return option.name;
            return props.placeholder;
        } catch (error) {
            console.log(error);
        }
    };
    const setDefaultData = (val, data, setFieldValue) => {
        try {
            let fieldData = data.find((x) => x.label === val);
            setFieldValue('gender', fieldData.gender);
            setFieldValue('email', fieldData.email);
            setFieldValue('mobile_number', fieldData.mobile_number);
            setFieldValue('alternate_number', fieldData.alternate_number !== '' ? fieldData.alternate_number : null);
            setFieldValue('permanent_address', fieldData.permanent_address);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog visible={true} style={{ width: '80vw' }} header="Assign Property Owner" modal className="p-fluid" onHide={onHide}>
            <Formik
                initialValues={formValue}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                    setSubmitted(true);
                    setTimeout(() => {
                        setSubmitted(false);
                    }, 5000);

                    let data = {
                        name: values?.ownerName,
                        email: values?.email,
                        gender: values?.gender,
                        mobile_number: values?.mobile_number,
                        alternate_number: values?.alternate_number === null ? '' : values?.alternate_number,
                        user_property_assign_id: values?.property,
                        property_number: propertyDropdownData.find((x) => x.property_assign_id === values?.property).label,
                        property_sq_feet_area: values.property_sq_feet_area,
                        user_property_assigns_status: values?.property_status,
                        permanent_address: values?.permanent_address
                    };
                    values?.id === '' && dispatch(propertyAssignRequest(data));
                }}
            >
                {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                    <Form>
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
                            <div className="field col-12 md:col-8 mb-1">
                                <label className="required">Do you want assign property with exiting user?</label>
                                <div className="flex flex-wrap gap-3 ">
                                    <div className="flex align-items-center">
                                        <RadioButton
                                            inputId="createExisting1"
                                            name="createExisting"
                                            value="yes"
                                            onChange={(e) => {
                                                setCreateExisting(true);
                                                handleReset();
                                                dispatch(getUserDropdown());
                                            }}
                                            checked={createExisting === true}
                                        />
                                        <label htmlFor="createExisting1" className="ml-2">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton
                                            inputId="createExisting2"
                                            name="createExisting"
                                            value="no"
                                            onChange={(e) => {
                                                setCreateExisting(false);
                                                handleReset();
                                            }}
                                            checked={createExisting === false}
                                        />
                                        <label htmlFor="createExisting2" className="ml-2">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="ownerName" className="required">
                                    Owner name
                                </label>
                                {createExisting === true ? (
                                    <Dropdown
                                        id="ownerName"
                                        optionLabel="label"
                                        optionValue="name"
                                        options={userDropdownData}
                                        name="ownerName"
                                        placeholder={values?.ownerName !== '' ? values?.ownerName : 'Select owner'}
                                        type="text"
                                        value={values?.ownerName}
                                        valueTemplate={values?.ownerName && setLabelName}
                                        onChange={(e) => {
                                            handleReset();
                                            setFieldValue('ownerName', e.target.value);
                                            setDefaultData(e.originalEvent.target.ariaLabel, userDropdownData, setFieldValue);
                                        }}
                                        className={classNames({ 'p-invalid': errors.ownerName && touched.ownerName })}
                                    />
                                ) : (
                                    <InputText
                                        id="ownerName"
                                        name="ownerName"
                                        placeholder="Enter owner name"
                                        type="text"
                                        value={values?.ownerName}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.ownerName && touched.ownerName })}
                                    />
                                )}
                                {errors.ownerName && touched.ownerName ? <small className="p-invalid error">{'Please enter owner name'}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="gender" className="required">
                                    Select gender
                                </label>
                                <Dropdown
                                    id="dropdown"
                                    optionLabel="label"
                                    optionValue="value"
                                    options={[
                                        { label: 'Male', value: 'Male' },
                                        { label: 'Female', value: 'Female' },
                                        { label: 'Other', value: 'Other' }
                                    ]}
                                    name="gender"
                                    placeholder="Select gender"
                                    type="text"
                                    value={values?.gender}
                                    onChange={(e) => {
                                        setFieldValue('gender', e.target.value);
                                    }}
                                    disabled={createExisting === true}
                                    className={classNames({ 'p-invalid': errors.gender && touched.gender })}
                                />

                                {errors.gender && touched.gender ? <small className="p-invalid error">{errors.gender}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="email" className="required">
                                    Enter owner email
                                </label>
                                <InputText
                                    id="email"
                                    name="email"
                                    placeholder="Enter owner email"
                                    type="text"
                                    value={values?.email}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.email && touched.email })}
                                    disabled={createExisting === true}
                                />
                                {errors.email && touched.email ? <small className="p-invalid error">{errors.email}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="mobile_number" className="required">
                                    Enter mobile number
                                </label>
                                <InputNumber
                                    id="mobile_number"
                                    type="tel"
                                    placeholder="Enter mobile number"
                                    name="mobile_number"
                                    value={values?.mobile_number}
                                    useGrouping={false}
                                    maxLength={10}
                                    onValueChange={(e) => {
                                        setFieldValue('mobile_number', e.value === null ? null : e.value.toString());
                                    }}
                                    disabled={createExisting === true}
                                    className={classNames({ 'p-invalid': errors.mobile_number && touched.mobile_number })}
                                />

                                {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="alternate_number" className="">
                                    Enter alternate number
                                </label>
                                <InputNumber
                                    id="alternate_number"
                                    type="tel"
                                    placeholder="Enter alternate number"
                                    name="alternate_number"
                                    value={values?.alternate_number}
                                    useGrouping={false}
                                    maxLength={10}
                                    onValueChange={(e) => {
                                        setFieldValue('alternate_number', e.value === null ? null : e.value.toString());
                                    }}
                                    disabled={createExisting === true}
                                    className={classNames({ 'p-invalid': errors.alternate_number && touched.alternate_number })}
                                />

                                {errors.alternate_number && touched.alternate_number ? <small className="p-invalid error">{errors.alternate_number}</small> : null}
                            </div>
                            {((decode?.is_block_exist_in_property === true && createShopping === true) || (createShopping === false && decode.is_block_exist_in_shopping_center_property === true)) && (
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
                                            !decode?.is_floor_exist_in_property && createShopping === true && dispatch(getPropertyDropdownRequest({ block_id: e.target.value, module_name: 'user_property_assign' }));
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property && values?.block === '' })}
                                    />
                                    {errors.property && touched.property && values?.block === '' ? <small className="p-invalid error">{'Please select block'}</small> : null}
                                    {/* {fieldError && values?.block === '' ? <small className="p-invalid error">{'Please select block'}</small> : null} */}
                                </div>
                            )}
                            {((decode?.is_floor_exist_in_property === true && createShopping === true) || (createShopping === false && decode.is_floor_exist_in_shopping_center_property === true)) && (
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
                                            dispatch(getPropertyDropdownRequest({ block_id: values?.block, floor_id: e.target.value, module_name: 'user_property_assign' }));
                                        }}
                                        className={classNames({ 'p-invalid': errors.property && touched.property && values?.floor === '' })}
                                        disabled={
                                            (decode?.is_block_exist_in_property === undefined && createShopping === true) || (createShopping === false && decode.is_block_exist_in_shopping_center_property === undefined) ? false : values?.block === ''
                                        }
                                    />
                                    {errors.property && touched.property && values?.floor === '' ? <small className="p-invalid error">{'Please select floor'}</small> : null}
                                </div>
                            )}
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="property" className="required">
                                    Select property
                                </label>
                                <Dropdown
                                    id="property"
                                    optionLabel="label"
                                    optionValue="property_assign_id"
                                    options={propertyDropdownData}
                                    name="property"
                                    placeholder="Select property"
                                    type="text"
                                    value={values?.property}
                                    onChange={(e) => {
                                        setFieldValue('property', e.target.value);
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
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="psfa" className="required">
                                    Property square feet area
                                </label>
                                <InputNumber
                                    inputId="psfa"
                                    id="psfa"
                                    placeholder="Property square feet area"
                                    name="property_sq_feet_area"
                                    value={values.property_sq_feet_area}
                                    onValueChange={(e) => {
                                        setFieldValue('property_sq_feet_area', e.target.value);
                                    }}
                                    locale="en-IN"
                                    minFractionDigits={2}
                                    className={classNames({ 'p-invalid': errors.property_sq_feet_area && touched.property_sq_feet_area })}
                                />
                                {errors.property_sq_feet_area && touched.property_sq_feet_area ? <small className="p-invalid error">{errors.property_sq_feet_area}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="property_status" className="">
                                    Select property status
                                </label>

                                <Dropdown
                                    id="property_status"
                                    optionLabel="label"
                                    optionValue="value"
                                    options={[
                                        { label: 'Active', value: 'Active' },
                                        { label: 'In-Active', value: 'In-Active' }
                                    ]}
                                    name="property_status"
                                    placeholder="Select property status"
                                    type="text"
                                    value={values?.property_status}
                                    onChange={(e) => {
                                        setFieldValue('property_status', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': errors.property_status && touched.property_status })}
                                />

                                {errors.property_status && touched.property_status ? <small className="p-invalid error">{errors?.property_status}</small> : null}
                            </div>
                        </div>
                        <div className="field col-12 md:col-12 mb-1">
                            <label htmlFor="permanent_address" className="">
                                Enter permanent address
                            </label>
                            <InputTextarea id="permanent_address" placeholder="Enter permanent address" rows="3" cols="30" autoResize value={values?.permanent_address} onChange={handleChange} disabled={createExisting === true} />
                        </div>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={onHide} />
                                <Button
                                    disabled={submitted}
                                    label="Save"
                                    type="submit"
                                    icon="pi pi-check"
                                    className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                // onClick={() => dataSave()}
                                />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
export default PropertyAssignModel;
