import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import components from '../..';
import Loader from '../../../../components/Loader';
import { getVehicleUserPropertyList } from '../../../../redux/slice/AdminSlices/blockSlice';
import { getVehicleByidRequest, updateVehicleAssignRequest, vehicleAssignRequest } from '../../../../redux/slice/AdminSlices/vehicleSlice';

const VehiclesAdd = () => {
    const { DataTable, Column, BreadCrumb, Dropdown, Button, InputText, RadioButton, Image, classNames, useDispatch, useState, useEffect, useSelector, useNavigate } = components;
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isCreated, vehicleDataByid, isLoading } = useSelector((state) => state.vehicle);
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { vehicleUserProperty } = useSelector((store) => store.block);
    const [submitted, setSubmitted] = useState(false);
    const [createShopping, setCreateShopping] = useState(true);
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
        file: null,
        fileBase64: null
    });
    const [vehicleCollection, setVehicleCollection] = useState([]);
    const SignupSchema = Yup.object().shape({
        property: Yup.string().trim().nullable().required('Please select property.'),
        vehicle_type: Yup.string().trim().nullable().required('Please select vehicle type.'),
        vehicle_no: Yup.string()
            .trim()
            .nullable()
            .matches(/^[a-zA-Z0-9]*$/, 'Special characters are not allowed.')
            .required('Please enter vehicle number.')
        // parking_spot: Yup.string().trim().nullable().required('Please enter parking spot')
    });
    useEffect(() => {
        dispatch(getVehicleUserPropertyList({ module_name: 'Inner' }));
    }, [dispatch]);
    const breadcrumbItems = [
        {
            label: params.id ? 'Edit Vehicle' : 'Add Vehicle'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Vehicles',
        command: () => {
            navigate('/property-management/vehicle');
        }
    };
    useEffect(() => {
        if (params.id) {
            dispatch(getVehicleByidRequest(params.id));
        }
    }, [params.id]);
    useEffect(() => {
        // decodeURI();
        if (isCreated) {
            navigate('/property-management/vehicle');
        }
    }, [isCreated]);
    useEffect(() => {
        if (params.id && vehicleDataByid && vehicleDataByid[0]._id) {
            let setData = {
                id: vehicleDataByid[0]?._id,
                property: vehicleDataByid[0]?.user_property_assign_id[0]?._id,
                owner_id: vehicleDataByid[0]?.owner_id,
                vehicle_type: vehicleDataByid[0]?.vehicle_type,
                vehicle_no: vehicleDataByid[0]?.vehicle_number,
                parking_spot: vehicleDataByid[0]?.parking_spot,
                file: vehicleDataByid[0]?.vehicle_image ? vehicleDataByid[0]?.vehicle_image : null,
                fileBase64: ''
            };
            vehicleDataByid[0]?.vehicle_image && setShowFile(`${vehicleDataByid[0]?.vehicle_image}`);
            setFormValue(setData);
        }
    }, [vehicleDataByid]);
    const getShoppingDropdown = (val) => {
        try {
            dispatch(getVehicleUserPropertyList({ module_name: val }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpload = async (event, setFieldValue) => {
        try {
            const str = event.target.files[0]?.name;
            const size = event.target.files[0]?.size;
            const maxSize = 1 * 1024 * 1024;
            const substr = ['.jpg', '.jpeg', '.png'];
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                if (size <= maxSize) {
                    let base = null;
                    let reader = new FileReader();
                    reader.readAsDataURL(event.target.files[0]);
                    reader.onload = function async(ev) {
                        const base64String = ev.target.result;
                        setFieldValue('fileBase64', base64String);
                        // base = base64String;
                    };
                    setFieldValue('file', event.target.files[0]);
                    setShowFile(URL.createObjectURL(event.target.files[0]));
                } else {
                    toast.error('File size should be less than 1 MB.', {
                        style: {
                            marginTop: '4rem'
                        }
                    });
                }
            } else {
                toast.error('Only accepts .png, .jpg, and .jpeg files.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const actionBodyTemplate = (rowData, index) => {
        return (
            <div className="actions flex justify-content-center">
                <Button
                    tooltip="Edit"
                    tooltipOptions={{ position: 'bottom' }}
                    icon="pi pi-pencil"
                    id="edits-icons"
                    className="p-button-rounded p-button-text  p-button-help"
                    onClick={() => {
                        let setData = {
                            id: index.rowIndex,
                            property: rowData?.user_property_assign_id,
                            owner_id: rowData?.owner_id,
                            vehicle_type: rowData?.vehicle_type,
                            vehicle_no: rowData?.vehicle_number,
                            parking_spot: '',
                            file: rowData?.file ? rowData?.file : null,
                            fileBase64: rowData?.fileBase64 ? rowData?.fileBase64 : null
                        };
                        setCreateShopping(rowData?.type);
                        getShoppingDropdown(rowData?.type === false ? 'Outer' : 'Inner');
                        rowData?.file && setShowFile(`${rowData?.showFile}`);
                        setFormValue(setData);
                    }}
                />

                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text  p-button-danger"
                    id="delete-icons"
                    tooltip="Delete"
                    tooltipOptions={{ position: 'bottom' }}
                    onClick={() => {
                        let collection = [...vehicleCollection];
                        collection.splice(index.rowIndex, 1);
                        setVehicleCollection(collection);
                        setShowFile(null);
                        let def = {
                            id: '',
                            // block: '',
                            // floor: '',
                            property: '',
                            owner_id: '',
                            vehicle_type: '',
                            vehicle_no: '',
                            parking_spot: '',
                            file: null,
                            fileBase64: null
                        };
                        setFormValue(def);
                    }}
                />
            </div>
        );
    };
    console.log(vehicleCollection, 'fileBase64');
    return (
        <>
            <div className="relative min-h-full">
                <Loader isLoading={isLoading} />
                <div className="flex justify-content-between align-items-center">
                    <div className="flex flex-row w-full">
                        <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Vehicle' : 'Add Vehicle'}</h5>
                        <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                    </div>
                </div>
                <div className="crud-demo ml-0 mr-0 card mt-3">
                    {params.id ? (
                        <>
                            <Formik
                                initialValues={formValue}
                                validationSchema={SignupSchema}
                                enableReinitialize
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
                                    // values.id === '' && dispatch(vehicleAssignRequest(sendData));
                                    values.id !== '' && dispatch(updateVehicleAssignRequest(values.id, sendData));
                                }}
                            >
                                {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                                    <Form>
                                        {values.id === '' && loginDetails?.role_permissions.filter((x) => x.role !== 'User').length > 0 && (
                                            <div className="grid p-fluid mt-1">
                                                {loginDetails?.is_shopping_center_exist_in_property === true && (
                                                    <div className="field col-12 md:col-4 mb-1">
                                                        <label className="required">Property Assign Type</label>
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
                                            <div className="field col-12 md:col-4 mb-0">
                                                <label htmlFor="property" className="required">
                                                    Property
                                                </label>
                                                <Dropdown
                                                    id="property"
                                                    optionLabel="label"
                                                    optionValue="property_assign_id"
                                                    options={vehicleUserProperty ? vehicleUserProperty : []}
                                                    name="property"
                                                    placeholder="Select Property"
                                                    type="text"
                                                    value={values?.property}
                                                    onChange={(e) => {
                                                        let ownerId = vehicleUserProperty.find((x) => x.property_assign_id === e.target.value);
                                                        setFieldValue('property', e.target.value);
                                                        setFieldValue('owner_id', ownerId?.owner_id);
                                                    }}
                                                    className={classNames({ 'p-invalid': errors.property && touched.property && values?.property === '' })}
                                                    disabled={values.id !== ''}
                                                    filter
                                                />
                                                <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                    {errors.property && touched.property && values?.property === '' ? errors.property : ''}
                                                </div>

                                                {/* {errors.property && touched.property ? <small className="p-invalid error">{errors.property}</small> : null} */}
                                            </div>
                                            <div className="field col-12 md:col-4 mb-0">
                                                <label htmlFor="vehicle_type" className="required">
                                                    Vehicle Type
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
                                                    placeholder="Select Vehicle Type"
                                                    value={values?.vehicle_type}
                                                    onChange={(e) => {
                                                        const newVehicleType = e.target.value;
                                                        setFieldValue('vehicle_type', newVehicleType);
                                                        setFieldValue('vehicle_no', ''); // Reset vehicle number when type changes
                                                    }}
                                                    className={classNames({ 'p-invalid': errors.vehicle_type && touched.vehicle_type })}
                                                />
                                                <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                    {errors.vehicle_type && touched.vehicle_type ? errors.vehicle_type : ''}
                                                </div>
                                                {/* {errors.vehicle_type && touched.vehicle_type ? <small className="p-invalid error">{errors.vehicle_type}</small> : null} */}
                                            </div>
                                            <div className="field col-12 lg:col-3 md:col-6 mb-0">
                                                <label htmlFor="vehicle_no" className="required">
                                                    Vehicle Number
                                                </label>
                                                <InputText
                                                    id="vehicle_no"
                                                    name="vehicle_no"
                                                    placeholder={`Enter Vehicle Number (${values.vehicle_type === '2-wheeler' ? 'AB12CD3456' : values.vehicle_type === '3-wheeler' ? 'AB12CD3456' : 'AB12CD3456'})`}
                                                    type="text"
                                                    maxLength={10}
                                                    value={values?.vehicle_no}
                                                    onChange={(e) => setFieldValue('vehicle_no', e.target.value.trim().toUpperCase().replace(' ', ''))}
                                                    className={classNames({ 'p-invalid': errors.vehicle_no && touched.vehicle_no })}
                                                />
                                                <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                    {errors.vehicle_no && touched.vehicle_no ? errors.vehicle_no : ''}
                                                </div>
                                            </div>
                                            {/* <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="parking_spot" className="">
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
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.parking_spot && touched.parking_spot ? errors.parking_spot : ""}</div>

                                </div> */}
                                            {/* <div className="field col-12 md:col-4 mb-1"> */}
                                            <div className={'field col-12 md:col-4 mb-0  '}>
                                                <div className={values?.file !== null ? 'flex align-items-center' : ''}>
                                                    {values?.file === null && (
                                                        // <div className="field col-12 md:col-4 mb-1">
                                                        <div className="file-input-upload">
                                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                                            <label for="fileInput" className="label">
                                                                <span>Upload A Vehicle Image</span>
                                                            </label>
                                                        </div>
                                                        // </div>
                                                    )}
                                                    {values?.file !== null && (
                                                        // <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                                        <>
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
                                                        </>
                                                        // </div>
                                                    )}
                                                </div>
                                                <div className="text-lg text-red-500">
                                                    <span>{'Note :- '}</span>
                                                    {'File size should be less than 1 MB.'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid p-fluid mt-1">
                                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/vehicle')} />
                                                <Button disabled={submitted} label={values.id === '' ? 'Save' : 'Update'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </>
                    ) : (
                        <Formik
                            initialValues={formValue}
                            validationSchema={SignupSchema}
                            enableReinitialize
                            onSubmit={(values, { resetForm }) => {
                                // setSubmitted(true);
                                // setTimeout(() => {
                                //     setSubmitted(false);
                                // }, 5000);
                                let collection = [...vehicleCollection];
                                let sendData = {
                                    type: createShopping,
                                    property_no: vehicleUserProperty && vehicleUserProperty.find((x) => x.property_assign_id === values.property).label ? vehicleUserProperty.find((x) => x.property_assign_id === values.property).label : '-',
                                    vehicle_number: values.vehicle_no,
                                    vehicle_type: values.vehicle_type,
                                    parking_spot: values.parking_spot,
                                    user_property_assign_id: values.property,
                                    file: values?.file !== null ? values?.file : '',
                                    showFile: showFile ? showFile : null,
                                    fileBase64: values?.fileBase64 ? values?.fileBase64 : null,
                                    owner_id: values?.owner_id
                                };

                                if (values.id !== '') {
                                    collection[values.id] = sendData;
                                } else {
                                    collection.push(sendData);
                                }
                                setVehicleCollection(collection);
                                resetForm();
                                setShowFile(null);
                                let def = {
                                    id: '',
                                    // block: '',
                                    // floor: '',
                                    property: '',
                                    owner_id: '',
                                    vehicle_type: '',
                                    vehicle_no: '',
                                    parking_spot: '',
                                    file: null,
                                    fileBase64: null
                                };
                                setFormValue(def);
                                // if (values.id === '') {
                                //     sendData.owner_id = values.owner_id;
                                // }
                                // showFile
                                // values.id === '' && dispatch(vehicleAssignRequest(sendData));
                                // values.id !== '' && dispatch(updateVehicleAssignRequest(values.id, sendData));
                            }}
                        >
                            {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                                <Form>
                                    {/* {values.id === '' && loginDetails?.role_permissions.filter((x) => x.role !== "User").length > 0 && (
                                    <div className="grid p-fluid mt-1">
                                        {loginDetails?.is_shopping_center_exist_in_property === true && (
                                            <div className="field col-12 md:col-4 mb-1">
                                                <label className="required">Property Assign Type</label>
                                                <div className="flex flex-wrap gap-3 ">
                                                    <div className="flex align-items-center">
                                                        <RadioButton
                                                            inputId="createShopping1"
                                                            name="createShopping"
                                                            value="Flat"
                                                            onChange={(e) => {
                                                                setCreateShopping(true);
                                                                // decodeURI();
                                                                getShoppingDropdown("Inner");
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
                                                                getShoppingDropdown("Outer");
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
                                )} */}
                                    <div className="grid p-fluid mt-1">
                                        <div className="field col-12 lg:col-3 md:col-6 mb-0">
                                            <label htmlFor="property" className="required">
                                                Property
                                            </label>
                                            <Dropdown
                                                id="property"
                                                optionLabel="label"
                                                optionValue="property_assign_id"
                                                options={vehicleUserProperty ? vehicleUserProperty : []}
                                                name="property"
                                                placeholder="Select Property"
                                                type="text"
                                                value={values?.property}
                                                onChange={(e) => {
                                                    let ownerId = vehicleUserProperty.find((x) => x.property_assign_id === e.target.value);
                                                    setFieldValue('property', e.target.value);
                                                    setFieldValue('owner_id', ownerId?.owner_id);
                                                }}
                                                className={classNames({ 'p-invalid': errors.property && touched.property && values?.property === '' })}
                                                // disabled={values.id !== ''}
                                                filter
                                            />
                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                {errors.property && touched.property && values?.property === '' ? errors.property : ''}
                                            </div>

                                            {/* {errors.property && touched.property ? <small className="p-invalid error">{errors.property}</small> : null} */}
                                        </div>
                                        <div className="field col-12 lg:col-3 md:col-6 mb-0">
                                            <label htmlFor="vehicle_type" className="required">
                                                Vehicle Type
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
                                                placeholder="Select Vehicle Type"
                                                type="text"
                                                value={values?.vehicle_type}
                                                onChange={(e) => {
                                                    setFieldValue('vehicle_type', e.target.value);
                                                }}
                                                className={classNames({ 'p-invalid': errors.vehicle_type && touched.vehicle_type })}
                                            />
                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                {errors.vehicle_type && touched.vehicle_type ? errors.vehicle_type : ''}
                                            </div>
                                            {/* {errors.vehicle_type && touched.vehicle_type ? <small className="p-invalid error">{errors.vehicle_type}</small> : null} */}
                                        </div>
                                        <div className="field col-12 lg:col-3 md:col-6 mb-0">
                                            <label htmlFor="vehicle_no" className="required">
                                                Vehicle Number
                                            </label>
                                            <InputText
                                                id="vehicle_no"
                                                name="vehicle_no"
                                                placeholder="Enter Vehicle Number (E.g. GJ00AA0000)"
                                                type="text"
                                                maxLength={10}
                                                value={values?.vehicle_no}
                                                onChange={(e) => setFieldValue('vehicle_no', e.target.value.trim().toUpperCase().replace(' ', ''))}
                                                className={classNames({ 'p-invalid': errors.vehicle_no && touched.vehicle_no })}
                                            />
                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                {errors.vehicle_no && touched.vehicle_no ? errors.vehicle_no : ''}
                                            </div>
                                            {/* {errors.vehicle_no && touched.vehicle_no ? <small className="p-invalid error">{errors.vehicle_no}</small> : null} */}
                                        </div>
                                        {/* <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="parking_spot" className="">
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
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.parking_spot && touched.parking_spot ? errors.parking_spot : ""}</div>

                                </div> */}
                                        {/* <div className="field col-12 md:col-4 mb-1"> */}
                                        <div className={'field col-10 lg:col-2 md:col-4 mb-0 pt-5' + (values?.file !== null ? 'flex align-items-center' : '')}>
                                            {values?.file === null && (
                                                // <div className="field col-12 md:col-4 mb-1">
                                                <div className="file-input-upload">
                                                    <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                                    <label for="fileInput" className="label">
                                                        <span>Upload Vehicle Image</span>
                                                    </label>
                                                </div>
                                                // </div>
                                            )}
                                            {values?.file !== null && (
                                                // <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                                <div className="relative " style={{ width: '100px', height: '100px' }}>
                                                    <Image alt="Image" src={showFile} width="100" height="100" preview />
                                                    <div
                                                        className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                        style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                        // onClick={() => {
                                                        //     setFieldValue("property_logo", null);
                                                        //     setShowImg("");
                                                        // }}
                                                        onClick={() => {
                                                            setFieldValue('file', null);
                                                            setShowFile(null);
                                                        }}
                                                    >
                                                        {/* <X style={{ stroke: "#fff" }} size="18" /> */}
                                                        <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                    </div>
                                                </div>
                                                // <>
                                                //     <Image src={showFile} alt="Image" width="100" height="100" preview />
                                                //     <div className="ml-1">
                                                //         <Button
                                                //             icon="pi pi-trash"
                                                //             className="p-button-rounded p-button-text  p-button-danger"
                                                //             id="delete-icons"
                                                //             tooltip="Delete"
                                                //             tooltipOptions={{ position: 'bottom' }}
                                                //             onClick={() => {
                                                //                 setFieldValue('file', null);
                                                //                 setShowFile(null);
                                                //             }}
                                                //         />
                                                //     </div>
                                                // </>
                                                // </div>
                                            )}
                                        </div>
                                        <div className="field col-2 lg:col-1 md:col-2 mb-0 pt-5 flex justify-content-end">
                                            <Button
                                                icon="pi pi-times"
                                                type="button"
                                                className="p-button-outlined p-button-danger mr-2 mb-2 h-3rem"
                                                // onClick={() => navigate('/property-management/vehicle')}
                                                onClick={() => {
                                                    handleReset();
                                                    setShowFile(null);
                                                    setFieldValue('file', null);
                                                }}
                                            />
                                            <Button type="submit" icon="pi pi-plus" className="p-button-outlined p-button-success mr-2 mb-2 h-3rem" />
                                        </div>
                                    </div>
                                    <div className="text-lg text-red-500">
                                        <span>{'Note :- '}</span>
                                        {'File size should be less than 1 MB.'}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                    {vehicleCollection.length > 0 && (
                        <div className="">
                            <DataTable
                                value={vehicleCollection}
                                showGridlines
                                stripedRows
                                dataKey="id"
                                // className="datatable-responsive"
                                emptyMessage="No Record Found."
                                // header={header}
                                scroll="scroll"
                                tableStyle={{ minWidth: '60rem' }}
                                // sortMode="multiple"
                                size="normal"
                            >
                                <Column field="showFile" header="Image" body={(rowData) => (rowData?.showFile ? <Image src={`${rowData?.showFile}`} alt="Image" width="50" height="50" preview /> : '-')} style={{ width: '4rem' }} />
                                <Column field="property_no" header="Property No." style={{ width: '9rem' }} />
                                <Column field="vehicle_number" header="Vehicle No." style={{ width: '9rem' }} />
                                <Column field="vehicle_type" header="Vehicle Type." style={{ width: '9rem' }} />
                                <Column field="" header="Actions" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate} />
                            </DataTable>
                        </div>
                    )}
                    {vehicleCollection.length > 0 && (
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/vehicle')} />
                                <Button
                                    disabled={submitted}
                                    label="Save"
                                    icon="pi pi-check"
                                    className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                    onClick={() => {
                                        let vehicleColl = [];
                                        vehicleCollection.forEach((a) => {
                                            vehicleColl.push({
                                                vehicle_number: a?.vehicle_number,
                                                vehicle_type: a?.vehicle_type,
                                                user_property_assign_id: a?.user_property_assign_id,
                                                vehicle_image: a?.fileBase64 !== null ? a?.fileBase64 : '',
                                                owner_id: a?.owner_id
                                            });
                                        });
                                        dispatch(vehicleAssignRequest(vehicleColl));
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default VehiclesAdd;
