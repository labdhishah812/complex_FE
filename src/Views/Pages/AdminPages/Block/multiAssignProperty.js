import components from '../..';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getUserDropdown } from '../../../../redux/slice/AdminSlices/userSlice';
import { multiPropertyAssignRequest } from '../../../../redux/slice/AdminSlices/propertySlice';

const MultiAssignProperty = ({ onHide, selectedProperty }) => {
    const { Dialog, Dropdown, Button, InputText, InputNumber, classNames, useDispatch, useState, useEffect, useSelector } = components;
    // const { roleList } = useSelector((state) => state.committee);
    const { userDropdownData } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [propertyDetails, stePropertyDetails] = useState([]);
    const [error, setError] = useState(false);
    const [formValue, setFormValue] = useState({
        ownerName: '',
        email: ''
    });
    const SignupSchema = Yup.object().shape({
        ownerName: Yup.string().trim().nullable().required('Please enter name'),
        email: Yup.string().trim().nullable().required('Please enter email').email('Please enter valid email.')
    });
    useEffect(() => {
        dispatch(getUserDropdown());
        const sortByPropertyNumber = (a, b) => {
            return a.property_number.localeCompare(b.property_number);
        };
        if (selectedProperty) {
            let data = selectedProperty.sort(sortByPropertyNumber);
            let setData = [];
            data.forEach((element) => {
                setData.push({ _id: element._id, property_number: element.property_number, property_sq_feet_area: null });
            });

            stePropertyDetails(setData);
        }
    }, [selectedProperty]);
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
            setFieldValue('email', fieldData.email);
        } catch (error) {
            console.log(error);
        }
    };
    const setSquareArea = (index, value) => {
        try {
            let data = [...propertyDetails];
            data[index].property_sq_feet_area = value;
            stePropertyDetails(data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className='exysssh'>

            <Dialog
                visible={true}
                style={{ width: '50vw' }}
                header={'Multiple Property Assign'}
                modal
                className="p-fluid"
                onHide={() => {
                    onHide();
                    stePropertyDetails([]);
                }}
            >
                <Formik
                    initialValues={formValue}
                    validationSchema={SignupSchema}
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        let check = propertyDetails.filter((x) => x.property_sq_feet_area === null);
                        if (check.length > 0) {
                            setError(true);
                        } else {
                            let sendData = {
                                email: values?.email,
                                user_property_assign_details: propertyDetails.map((item) => ({ user_property_assign_id: item?._id, property_sq_feet_area: item?.property_sq_feet_area }))
                            };
                            dispatch(multiPropertyAssignRequest(sendData));
                        }
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="ownerName" className="required">
                                        Owner name
                                    </label>
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
                                            setFieldValue('ownerName', e.target.value);
                                            setDefaultData(e.originalEvent.target.ariaLabel, userDropdownData, setFieldValue);
                                        }}
                                        className={classNames({ 'p-invalid': errors.ownerName && touched.ownerName && values?.ownerName === '' })}
                                    />
                                </div>
                            </div>
                            {propertyDetails.length > 0 && (
                                <div style={{ minWidth: '30rem', overflow: 'auto' }}>
                                    <table className="maintenanceSettings_table">
                                        <thead>
                                            <th className="maintenanceSettings_table_th">Property No</th>
                                            <th className="maintenanceSettings_table_th">Property square feet area</th>
                                        </thead>
                                        <tbody>
                                            {propertyDetails.map((a, i) => (
                                                <tr>
                                                    <td className="maintenanceSettings_table_td">{a.property_number}</td>
                                                    <td className="maintenanceSettings_table_td">
                                                        <div className="flex justify-content-center align-items-center p-2 ">
                                                            <InputNumber
                                                                inputId="property_sq_feet_area"
                                                                id="property_sq_feet_area"
                                                                placeholder={`Enter square feet area`}
                                                                name="property_sq_feet_area"
                                                                value={a?.property_sq_feet_area}
                                                                onValueChange={(e) => {
                                                                    setSquareArea(i, e.target.value);
                                                                }}
                                                                locale="en-IN"
                                                                minFractionDigits={2}
                                                                className={classNames({ 'p-invalid': error && a?.property_sq_feet_area === null })}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* {propertyDetails.map((a, i) => (
                                        <tr></tr>
                                    )} */}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {/* <div className="grid p-fluid mt-1">
                            {propertyDetails.length > 0 &&
                                propertyDetails.map((a, i) => (
                                    <div className="field col-12 md:col-4 mb-1">
                                        <label className="required">{a.property_number + ' square feet area'}</label>
                                        <InputNumber
                                            inputId="property_sq_feet_area"
                                            id="property_sq_feet_area"
                                            placeholder={`Enter ${a.property_number} square feet area`}
                                            name="property_sq_feet_area"
                                            value={a?.property_sq_feet_area}
                                            onValueChange={(e) => {
                                                setSquareArea(i, e.target.value);
                                            }}
                                            locale="en-IN"
                                            minFractionDigits={2}
                                            className={classNames({ 'p-invalid': error && a?.property_sq_feet_area === null })}
                                        />{' '}
                                    </div>
                                ))}
                        </div> */}
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button
                                        label="Cancel"
                                        icon="pi pi-times"
                                        className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                        onClick={() => {
                                            onHide();
                                            stePropertyDetails([]);
                                        }}
                                    />
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
        </div>
    );
};

export default MultiAssignProperty;
