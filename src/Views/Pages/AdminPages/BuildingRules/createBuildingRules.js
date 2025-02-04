import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { InputTextarea } from 'primereact/inputtextarea';
import components from '../..';
import Loader from '../../../../components/Loader';
import {
    getBuildingRules,
    getBuildingRulesById,
    buildingRulesCreateRequest,
    buildingRulesUpdateRequest
} from '../../../../redux/slice/AdminSlices/buildingRulesSlice';
const AddBuildingRules = () => {
    const {
        Button,
        InputText,
        classNames,
        useDispatch,
        useSelector,
        BreadCrumb
    } = components;
    const [submitted, setSubmitted] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { buildingRulesList, isLoading } = useSelector((state) => state.buildingRules);
    const [formValue, setFormValue] = useState({
        title: '',
        description: ''
    });
    const breadcrumbHome = {
        label: 'Building Rules',
        command: () => {
            navigate(`/property-management/buildingrules`);
        }
    };
    const breadcrumbItems = [
        {
            label: params?.id ? 'Update Building Rules' : 'Create Building Rules'
        }
    ];
    const BuildingRulesSchema = Yup.object().shape({
        title: Yup.string().trim().required('Please enter title.'),
        description: Yup.string().trim().required('Please enter description.')
    });
    useEffect(() => {
        if (params?.id) {
            dispatch(getBuildingRules()).then(() => {
                const currentRule = buildingRulesList?.BuildingRules?.find(
                    (rule) => rule._id === params.id
                );
                if (currentRule) {
                    setFormValue({
                        title: currentRule.title || '',
                        description: currentRule.description || ''
                    });
                }
            });
        }
    }, [params?.id, dispatch]);
    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitted(true);
        setSubmitting(true);

        const action = params?.id
            ? buildingRulesUpdateRequest(params.id, values)
            : buildingRulesCreateRequest(values);

        dispatch(action)
            .then(() => {
                navigate('/property-management/buildingrules');
            })
            .finally(() => {
                setSubmitted(false);
                setSubmitting(false);
            });
    };

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">
                        {params?.id ? 'Update Building Rules' : 'Create Building Rules'}
                    </h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>

            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={BuildingRulesSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, errors, touched, isSubmitting }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="title" className="required">
                                        Title
                                    </label>
                                    <InputText
                                        id="title"
                                        name="title"
                                        placeholder="Enter Title"
                                        type="text"
                                        value={values?.title}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.title && touched.title })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.title && touched.title ? errors.title : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-12 mb-1">
                                    <label htmlFor="description" className="required">
                                        Description
                                    </label>
                                    <InputTextarea
                                        rows="10"
                                        cols="20"
                                        id="description"
                                        name="description"
                                        placeholder="Enter Description"
                                        value={values?.description}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.description && touched.description })}
                                        style={{ resize: 'none', width: '100%' }}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.description && touched.description ? errors.description : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button
                                        label="Cancel"
                                        icon="pi pi-times"
                                        className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                        onClick={() => navigate('/property-management/buildingrules')}
                                    />
                                    <Button
                                        disabled={submitted || isSubmitting}
                                        label={params?.id ? 'Update' : 'Save'}
                                        type="submit"
                                        icon="pi pi-check"
                                        className="p-button-outlined p-button-success mb-2 w-7rem"
                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
export default AddBuildingRules;
