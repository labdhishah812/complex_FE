import components from '../..';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getUserDropdown } from '../../../../redux/slice/AdminSlices/userSlice';
import { getRoleDropDownRequest, userCommitteeCreateRequest, updateCommitteeRequest } from '../../../../redux/slice/AdminSlices/committeeSlice';
const CommitteeModel = ({ editData, onHide }) => {
    const { Dialog, Dropdown, Button, InputText, InputNumber, Password, classNames, useDispatch, useState, useEffect, useSelector } = components;
    const { roleList } = useSelector((state) => state.committee);
    const { userDropdownData } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [formValue, setFormValue] = useState({
        id: '',
        detailId: '',
        name: '',
        email: '',
        // gender: '',
        // mobile_number: null,
        // password: '',
        role: '',
        role_id: ''
    });
    useEffect(() => {
        dispatch(getUserDropdown());
        dispatch(getRoleDropDownRequest());
        if (editData !== null) {
            let setData = {
                id: editData?._id,
                name: editData?.name,
                email: editData?.email,
                // gender: editData?.gender,
                // mobile_number: editData?.mobile_number,
                // password: '123456C!',
                role: editData?.role_details_array[0]?.role,
                role_id: editData?.role_details_array[0]?.role_id,
                detailId: editData?.role_details_array[0]?._id
            };
            setFormValue(setData);
        }
    }, [dispatch, editData]);
    const SignupSchema = Yup.object().shape({
        name: Yup.string().trim().nullable().required('Please enter name'),
        email: Yup.string().trim().nullable().required('Please enter email').email('Please enter valid email.'),
        // gender: Yup.string().trim().nullable().required('Please select gender'),
        // mobile_number: Yup.string().trim().nullable().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number'),
        // password: Yup.string()
        //     .trim()
        //     .nullable()
        //     .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/, 'Password must be atleast 8 letters.Include with 1 uppercase character,1 special character,1 number')
        //     .required('Please enter password'),
        role_id: Yup.string().trim().nullable().required('Please select role')
    });
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
    return (
        <Dialog visible={true} style={{ width: '80vw' }} header={editData?._id ? 'Edit Committee' : 'Create Committee'} modal className="p-fluid" onHide={onHide}>
            <Formik
                initialValues={formValue}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                    setSubmitted(true);
                    setTimeout(() => {
                        setSubmitted(false);
                    }, 5000);

                    let data = {
                        // name: values?.name,
                        email: values?.email,
                        // gender: values?.gender,
                        // mobile_number: values?.mobile_number,
                        // password: values?.password,
                        role: values?.role,
                        role_id: values?.role_id
                    };
                    if (values?.id !== '') {
                        data.role_details_id = values?.detailId;
                    }
                    values?.id === '' && dispatch(userCommitteeCreateRequest(data));
                    values?.id !== '' && dispatch(updateCommitteeRequest(values?.id, data));
                }}
            >
                {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                    <Form>
                        <div className="grid p-fluid mt-1">
                            {/* <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="name" className="required">
                                    Name
                                </label>
                                <InputText id="name" name="name" placeholder="Enter name" type="text" value={values?.name} onChange={handleChange} className={classNames({ 'p-invalid': errors.name && touched.name })} />
                                {errors.name && touched.name ? <small className="p-invalid error">{errors.name}</small> : null}
                            </div> */}
                            {/* <div className="field col-12 md:col-4 mb-1">
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
                                    className={classNames({ 'p-invalid': errors.gender && touched.gender })}
                                />

                                {errors.gender && touched.gender ? <small className="p-invalid error">{errors.gender}</small> : null}
                            </div> */}
                            {/* <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="email" className="required">
                                    Enter owner email
                                </label>
                                <InputText id="email" name="email" placeholder="Enter owner email" type="text" value={values?.email} onChange={handleChange} className={classNames({ 'p-invalid': errors.email && touched.email })} />
                                {errors.email && touched.email ? <small className="p-invalid error">{errors.email}</small> : null}
                            </div> */}
                            {/* <div className="field col-12 md:col-4 mb-1">
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
                                    className={classNames({ 'p-invalid': errors.mobile_number && touched.mobile_number })}
                                />

                                {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null}
                            </div> */}
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="name" className="required">
                                    User Name
                                </label>
                                <Dropdown
                                    disabled={editData?._id}
                                    id="name"
                                    optionLabel="label"
                                    optionValue="name"
                                    options={userDropdownData}
                                    name="name"
                                    placeholder={values?.name !== '' ? values?.name : 'Select user Name'}
                                    type="text"
                                    value={values?.name}
                                    valueTemplate={values?.name && setLabelName}
                                    onChange={(e) => {
                                        setFieldValue('name', e.target.value);
                                        setDefaultData(e.originalEvent.target.ariaLabel, userDropdownData, setFieldValue);
                                    }}
                                    className={classNames({ 'p-invalid': errors.name && touched.name && values?.name === '' })}
                                />
                                {errors.name && touched.name && values?.name === '' ? <small className="p-invalid error">{'Please select user name'}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="role_id" className="required">
                                    Select role
                                </label>
                                <Dropdown
                                    id="role_id"
                                    optionLabel="role"
                                    optionValue="role_id"
                                    options={roleList?.data}
                                    name="role_id"
                                    placeholder="Select role"
                                    type="text"
                                    value={values?.role_id}
                                    onChange={(e) => {
                                        setFieldValue('role_id', e.target.value);
                                        setFieldValue('role', e.originalEvent.target.ariaLabel);
                                    }}
                                    className={classNames({ 'p-invalid': errors.role_id && touched.role_id && values?.role_id === '' })}
                                />

                                {errors.role_id && touched.role_id && values?.role_id === '' ? <small className="p-invalid error">{errors.role_id}</small> : null}
                            </div>
                            {/* {values?.id === '' && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="password" className="required">
                                        Enter password
                                    </label>
                                    <Password
                                        id="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={values?.password}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.password && touched.password })}
                                        feedback={false}
                                        toggleMask
                                    />
                                    {errors.password && touched.password ? <small className="p-invalid error">{errors.password}</small> : null}
                                </div>
                            )} */}
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
export default CommitteeModel;
