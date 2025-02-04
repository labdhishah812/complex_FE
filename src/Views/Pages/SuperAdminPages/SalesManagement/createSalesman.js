import { Form, Formik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import components from '../..';
import Loader from '../../../../components/Loader';
import { getsalesmanDataById, salesmanCreateRequest, updateSalesAssignRequest } from '../../../../redux/slice/AdminSlices/salesmanSlice';
import {getRoleDropDownRequest} from '../../../../redux/slice/AdminSlices/committeeSlice'
import { Dropdown } from 'primereact/dropdown';
const CreateSalesman = () => {
    const { BreadCrumb, Button } = components;

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { roleList } = useSelector((state) => state.committee);

    const { isLoading, salesmanDataById, isCreated, salesmanTypeData } = useSelector((state) => state.salesman);

    const [submitted, setSubmitted] = useState(false);
    const [formValue, setFormValue] = useState({
        id: '',
        name: '',
        contact_no: '',
        email: '',
        role: '',
        role_id: ''
    });

    // Form validation schema
    const SignupSchema = Yup.object().shape({
        name: Yup.string().trim().nullable().required('Please enter the name.'),
        contact_no: Yup.string().trim().nullable().min(10, 'Contact number must be at least 10 digits.').max(10, 'Contact number must be at most 10 digits.').required('Please enter the contact number.'),
        email: Yup.string().trim().nullable().email('Please enter a valid email address.').required('Please enter the email.'),
        role_id: Yup.string().trim().nullable().required('Please select role.')
    });

    useEffect(() => {
        dispatch(getRoleDropDownRequest())
        // Redirect after successful creation
        if (isCreated) {
            // toast.success('Salesman created successfully!');
            navigate('/superadmin/sales');
        }
    }, [isCreated, navigate]);

    useEffect(() => {
        // Fetch salesman data by ID if editing
        if (params.id) {
            dispatch(getsalesmanDataById(params.id));
        }
    }, [params.id, dispatch]);

    useEffect(() => {
        // Pre-fill form data for editing with safer null checks
        if (params.id && salesmanDataById) {
            setFormValue({
                id: salesmanDataById?._id || '', // Use optional chaining and fallback
                name: salesmanDataById?.name || '',
                contact_no: salesmanDataById?.contact_no || '',
                email: salesmanDataById?.email || '',
                role: salesmanDataById?.role,
                role_id: salesmanDataById?.role_id,
            });
        }
    }, [params.id, salesmanDataById]);

    const breadcrumbHome = {
        label: 'Employees',
        command: () => navigate('/superadmin/sales')
    };

    const breadcrumbItems = [
        {
            label: params?.id ? 'Edit Employee' : 'Create Employee'
        }
    ];

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Employee' : 'Create Employee'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={SignupSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        setSubmitted(true);

                        const sendData = {
                            name: values?.name,
                            contact_no: values?.contact_no,
                            email: values?.email,
                            role: values?.role,
                            role_id: values?.role_id
                        };
                        if (values.id === '') {
                            dispatch(salesmanCreateRequest(sendData));
                        } else {
                            dispatch(updateSalesAssignRequest(values.id, sendData));
                        }

                        setTimeout(() => setSubmitted(false), 5000);
                    }}
                >
                    {({ values, setFieldValue, handleChange, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="role_id" className="required">
                                    Role
                                </label>
                                <Dropdown
                                    id="role_id"
                                    optionLabel="role"
                                    optionValue="role_id"
                                    options={roleList?.data}
                                    name="role_id"
                                    placeholder="Select Role"
                                    type="text"
                                    value={values?.role_id}
                                    onChange={(e) => {
                                        const selectedRole = roleList?.data?.find(role => role.role_id === e.value);
                                        // Update both role_id and role values
                                        setFieldValue('role_id', e.value);
                                        setFieldValue('role', selectedRole?.role || '')
                                    //     setFieldValue('role_id', e.target.value);
                                    //     setFieldValue('role', e.originalEvent.target.ariaLabel);
                                    }}
                                    className={classNames({ 'p-invalid': errors.role_id && touched.role_id && values?.role_id === '' })}
                                    filter
                                />

                                {errors.role_id && touched.role_id && values?.role_id === '' ? <small className="p-invalid error">{errors.role_id}</small> : null}
                            </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="name" className="required">
                                        Name
                                    </label>
                                    <InputText
                                        id="name"
                                        name="name"
                                        placeholder="Enter Employee Name"
                                        type="text"
                                        value={values?.name}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.name && touched.name
                                        })}
                                    />
                                    {errors.name && touched.name && <small className="p-error">{errors.name}</small>}
                                </div>

                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="contact_no" className="required">
                                        Contact Number
                                    </label>
                                    <InputText
                                        id="contact_no"
                                        name="contact_no"
                                        placeholder="Enter Contact Number"
                                        maxLength={10}
                                        value={values?.contact_no || ''} // Ensure it's an empty string if no value
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Only allow numeric input
                                            if (/^\d*$/.test(value)) {
                                                setFieldValue('contact_no', value);
                                            }
                                        }}
                                        useGrouping={false}
                                        // Restrict input to 10 digits
                                        className={classNames({
                                            'p-invalid': errors.contact_no && touched.contact_no
                                        })}
                                    />
                                    {errors.contact_no && touched.contact_no && <small className="p-error">{errors.contact_no}</small>}
                                </div>

                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="email" className="required">
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        name="email"
                                        placeholder="Enter Email Address"
                                        type="email"
                                        value={values?.email}
                                        onChange={handleChange}
                                        className={classNames({
                                            'p-invalid': errors.email && touched.email
                                        })}
                                    />
                                    {errors.email && touched.email && <small className="p-error">{errors.email}</small>}
                                </div>

                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/superadmin/sales')} />
                                    <Button disabled={submitted} label={values.id === '' ? 'Save' : 'Update'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CreateSalesman;
