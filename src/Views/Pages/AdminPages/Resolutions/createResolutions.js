// import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import components from '../..';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';
import Loader from '../../../../components/Loader';
import { getResolutionDataById, resolutionCreateRequest, resolutionUpdateRequest } from '../../../../redux/slice/AdminSlices/resolutionSlice';

// import { useRef } from 'react';

const CreateResolutions = () => {
    const { SelectButton, Image, Button, DataTable, Column, InputNumber, classNames, Calendar, InputText, InputTextarea, React, useNavigate, BreadCrumb, Toolbar, Paginator, useState, useEffect, useDispatch, useSelector } = components;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const { isCreated, resolutionDataById,isLoading } = useSelector((state) => state.resolution);
    const [resolutionCollection, setResolutionCollection] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [submittedEdit, setSubmittedEdit] = useState(false);
    const [formValue, setFormValue] = useState({
        id: '',
        // block: '',
        // floor: '',
        number: '',
        date: '',
        title: '',
        resolutions: ''
    });
    const SignupSchema = Yup.object().shape({
        // number: Yup.string().trim().nullable().required('Please enter resolution No.'),
        number: Yup.string()
        .trim()
        .nullable()
        .test(
            'unique-resolution-number',
            'This resolution number already exists',
            function(value) {
                // Skip validation if no value
                if (!value) return true;

                // Get the current resolution number
                const currentNumber = this.parent.id ? this.parent.number : value;

                // Check if this number already exists in the collection, excluding the current one
                const existingNumbers = resolutionCollection
                    .filter(res => res.number !== currentNumber)
                    .map(res => res.number.toString());

                // Check if the number already exists
                return !existingNumbers.includes(value);
            }
        )
        .required('Please enter resolution No.'),
        date: Yup.string().trim().nullable().required('Please select date.'),
        title: Yup.string().trim().nullable().required('Please enter title.'),
        resolutions: Yup.string().trim().nullable().required('Please enter resolutions.')
    });
    useEffect(() => {
        if (isCreated) {
            navigate('/property-management/resolutions');
        }
    }, [isCreated]);
    useEffect(() => {
        if (params.id) {
            dispatch(getResolutionDataById(params.id));
        }
    }, [params.id]);
    useEffect(() => {
        if (resolutionDataById && resolutionDataById?._id) {
            let sendData = {
                id: resolutionDataById.resolution[0]?._id,
                number: resolutionDataById.resolution[0]?.number ? resolutionDataById.resolution[0]?.number : '',
                date: seteditDefault(resolutionDataById?.date),
                title: resolutionDataById.resolution[0]?.title,
                resolutions: resolutionDataById.resolution[0]?.description
            };
            setFormValue(sendData);
            // dispatch(getResolutionDataById(params.id))
        }
    }, [resolutionDataById]);
    const seteditDefault = (val) => {
        try {
            const inputDateString = val;
            const [year, month, day] = inputDateString.split('-').map(Number);
            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };
    const breadcrumbHome = {
        label: 'Resolutions',
        command: () => {
            navigate(`/property-management/resolutions`);
        }
    };

    const breadcrumbItems = [
        {
            label: params.id ? 'Edit Resolutions' : 'Create Resolutions'
        }
    ];
    const setDefaultDate = (val) => {
        try {
            const inputDateString = val;
            const [day, month, year] = inputDateString.split('/').map(Number);
            const dateObj = new Date(year, month - 1, day);
            const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
            const localTime = dateObj.getTime() - timezoneOffset;
            const indiaOffset = 330 * 60000;
            const indiaTime = localTime + indiaOffset;
            const indiaDate = new Date(indiaTime);
            return new Date(indiaDate.toString());
        } catch (error) {
            console.log(error);
        }
    };
    const convertDate = (dateStr) => {
        try {
            // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            // const [day, month, year] = dateStr.split('/');
            // const date = new Date(`${year}-${month}-${day}`);
            // const formattedDate = `${day}-${monthNames[date.getMonth()]}-${year}`;
            const formattedDate = moment(dateStr, 'DD/MM/YYYY').format('D MMM YYYY');
            return formattedDate;
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
                            date: rowData?.date,
                            title: rowData?.title,
                            number: rowData?.number,
                            resolutions: rowData?.resolution
                        };
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
                        let collection = [...resolutionCollection];
                        collection.splice(index.rowIndex, 1);
                        setResolutionCollection(collection);
                        let def = {
                            date: rowData.date,
                            title: '',
                            resolutions: '',
                            number: '',
                            id: ''
                        };
                        setFormValue(def);
                    }}
                />
            </div>
        );
    };
    const dataSave = () => {
        try {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
            let collectedData = [...resolutionCollection];
            let sendData = {
                date: collectedData[0]?.date,
                resolution: []
            };
            collectedData.forEach((element, i) => {
                sendData.resolution.push({ number: element?.number, title: element.title, description: element.resolution });
            });
            dispatch(resolutionCreateRequest(sendData));
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Resolutions' : 'Create Resolutions'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={SignupSchema}
                    enableReinitialize
                    onSubmit={(values, { resetForm }) => {
                        if (params?.id) {
                            setSubmittedEdit(true);
                            setTimeout(() => {
                                setSubmittedEdit(false);
                            }, 5000);
                        }
                        if (params?.id) {
                            const sendData = {
                                number: values?.number,
                                title: values?.title,
                                date: values?.date,
                                description: values?.resolutions
                            };
                            dispatch(resolutionUpdateRequest(values?.id, sendData));
                        } else {
                            const sendData = {
                                number: values?.number,
                                date: values?.date,
                                title: values?.title,
                                resolution: values?.resolutions
                            };
                            let collectedArray = [...resolutionCollection];
                            if (values?.id === '') {
                                collectedArray.push(sendData);
                            } else {
                                collectedArray[values?.id] = sendData;
                            }
                            setResolutionCollection(collectedArray);
                            resetForm({
                                values: {
                                    ...values,
                                    title: '',
                                    resolutions: '',
                                    number: '',
                                    id: ''
                                }
                            });
                        }
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="date" className="required">
                                        Date
                                    </label>
                                    <Calendar
                                        id="date"
                                        name="date"
                                        placeholder="Please Select Date"
                                        value={values?.date !== '' ? setDefaultDate(values?.date) : ''}
                                        dateFormat="dd/mm/yy"
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                            setFieldValue('date', formattedDate);
                                        }}
                                        className={classNames({ 'p-invalid': errors.date && touched.date })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.date && touched.date ? errors?.date : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="title" className="required">
                                        Title
                                    </label>
                                    <InputText id="title" name="title" placeholder="Enter Title" type="text" value={values?.title} onChange={handleChange} className={classNames({ 'p-invalid': errors.title && touched.title })} />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.title && touched.title ? errors?.title : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="number" className="required">
                                        Resolution no.
                                    </label>
                                    <InputNumber
                                        id="number"
                                        name="number"
                                        placeholder="Enter No."
                                        type="tel"
                                        value={values?.number}
                                        locale="en-IN"
                                        onValueChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.number && touched.number })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.number && touched.number ? errors.number : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-12 mb-0">
                                    <label htmlFor="resolutions" className="required">
                                        {'Resolution (Tharav)'}
                                    </label>
                                    <InputTextarea
                                        id="resolutions"
                                        placeholder="Enter resolution (tharav)"
                                        rows="10"
                                        cols="100"
                                        value={values?.resolutions}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.resolutions && touched.resolutions })}
                                        style={{ resize: 'none' }} // Disable resizing
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.resolutions && touched.resolutions ? errors?.resolutions : ''}
                                    </div>
                                </div>
                            </div>
                            {params?.id ? (
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-12 mb-0 flex justify-content-end">
                                    <Button
                                        type="button"
                                        label="Cancel"
                                        // icon="pi pi-times"
                                        className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                        onClick={() => {
                                            navigate('/property-management/resolutions');
                                        }}
                                    />
                                    <Button
                                        disabled={submittedEdit}
                                        label="Update"
                                        type="submit"
                                        // icon="pi pi-check"
                                        className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-12 mb-0 flex justify-content-end">
                                    {resolutionCollection.length === 0 ? (
                                        <Button
                                            type="button"
                                            label="Cancel"
                                            className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                            onClick={() => navigate('/property-management/resolutions')}
                                        />
                                    ) : (
                                        <Button
                                            type="button"
                                            label="Clear"
                                            className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                            onClick={() => {
                                                setFieldValue('title', '');
                                                setFieldValue('resolutions', '');
                                                setFieldValue('number', '');
                                                setFieldValue('id', '');
                                            }}
                                        />
                                    )}
                                    <Button
                                        label="Add"
                                        type="submit"
                                        className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                                    />
                                </div>
                            </div>
                        )}
                        </Form>
                    )}
                </Formik>
                {resolutionCollection.length > 0 && (
                    <div className="">
                        <DataTable
                            value={resolutionCollection}
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
                            <Column field="number" header="Resolution No." headerStyle={{ width: '15rem' }} />
                            <Column field="date" header="Date" headerStyle={{ width: '10rem' }} body={(rowData) => (rowData.date ? convertDate(rowData.date) : '-')} />
                            <Column field="title" header="Title" headerStyle={{ width: '15rem' }} />
                            <Column field="resolution" header="Resolution" />
                            <Column field="" header="Actions" headerStyle={{ width: '3%', minWidth: '6rem' }} body={actionBodyTemplate} />
                            {/* <Column field="resolution" header="Resolution" /> */}
                        </DataTable>
                    </div>
                )}
                {resolutionCollection.length > 0 && (
                    <div className="grid p-fluid mt-1">
                        <div className="field col-12 md:col-12 mb-0 flex justify-content-end">
                            {/* <Button type='button' label="Clear" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                            onClick={() => {
                                // setFieldValue("title", "");
                                // setFieldValue("resolutions", "");
                                // setFieldValue("id", "");
                            }}
                        /> */}
                        <Button label="Cancel" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                    onClick={() => navigate('/property-management/resolutions')}
                                />
                            <Button disabled={submitted} label="Submit" type="button" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" onClick={() => dataSave()} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateResolutions;
