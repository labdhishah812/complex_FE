import components from '../..';
import Loader from '../../../../components/Loader';
import toast from 'react-hot-toast';
import { AutoComplete } from 'primereact/autocomplete';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { contractCreateRequest, getContractDataById, updateContractRequest } from '../../../../redux/slice/AdminSlices/contractSlice';

const ContractCreate = () => {
    const { BreadCrumb, Button, InputText, Calendar, Image, InputNumber, InputTextarea, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, contractDataById, isCreated } = useSelector((state) => state.contract);
    const [submitted, setSubmitted] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [fileFormData, setFileFormData] = useState(null);
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
    const setYYYYMMDD = (val) => {
        try {
            const inputDateStr = val;
            const [day, month, year] = inputDateStr.split('/');

            const date = new Date(year, month - 1, day);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const formattedDateStr = `${yyyy}-${mm}-${dd}`;
            return formattedDateStr;
        } catch (error) {
            console.log(error);
        }
    };
    const editeDate = (dateStr) => {
        try {
            // let [year, month, day] = val.split('T')[0].split("-").map(Number);
            // const dateObj = new Date(year, month - 1, day);
            // re
            const date = new Date(dateStr);
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            return formattedDate;
        } catch (error) {}
    };
    const [formValue, setFormValue] = useState({
        id: '',
        start_date: '',
        end_date: '',
        company_name: '',
        category: '',
        contactPerson: '',
        designation: '',
        contactNo: '',
        address: '',
        files: null
    });
    console.log(formValue, 'formValue');
    const SignupSchema = Yup.object().shape({
        start_date: Yup.string().trim().nullable().required('Please select start date'),
        end_date: Yup.string().trim().nullable().required('Please select end date'),
        company_name: Yup.string().trim().nullable().required('Please enter service provider name'),
        category: Yup.string().trim().nullable(),
        contactPerson: Yup.string().trim().nullable().required('Please enter contact person name'),
        designation: Yup.string().trim().nullable().required('Please enter designation'),
        contactNo: Yup.string().trim().nullable().required('Please enter contact no.'),
        address: Yup.string().trim().nullable().required('Please enter address')
    });
    useEffect(() => {
        if (isCreated) navigate('/property-management/contract');
    }, [isCreated]);
    useEffect(() => {
        if (params.id) {
            dispatch(getContractDataById(params.id));
        }
    }, [params.id]);
    useEffect(() => {
        if (contractDataById && contractDataById._id) {
            let setData = {
                id: contractDataById?._id,
                company_name: contractDataById?.company_name,
                category: contractDataById?.category,
                contactPerson: contractDataById?.contactPerson,
                designation: contractDataById?.designation,
                contactNo: contractDataById?.contactNo,
                address: contractDataById?.address,
                start_date: editeDate(contractDataById?.start_date),
                end_date: editeDate(contractDataById?.end_date)
            };
            setFormValue(setData);
            contractDataById?.aggerement_files[0] && setFileFormData(contractDataById?.aggerement_files[0]);
            contractDataById?.aggerement_files[0] && setFileName(contractDataById?.aggerement_files[0]);
        }
    }, [contractDataById]);
    const breadcrumbHome = {
        label: 'Contracts',
        command: () => {
            navigate('/property-management/contract');
        }
    };

    const breadcrumbItems = [
        {
            label: params?.id ? 'Edit Contract' : 'Add Contract'
        }
    ];
    const handleUpload = async (event) => {
        try {
            const str = event.target.files[0]?.name;
            const substr = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                setFileFormData(event.target.files[0]);
                setFileName(str);
            } else {
                toast.error('Only Accept .png , .jpeg, .jpg, .pdf, .doc and .docx .', {
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
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Contract' : 'Add Contract'}</h5>
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
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        let formData = new FormData();
                        formData.append('company_name', values?.company_name);
                        formData.append('category', values?.category);
                        formData.append('contactPerson', values?.contactPerson);
                        formData.append('designation', values?.designation);
                        formData.append('contactNo', values?.contactNo);
                        formData.append('address', values?.address);
                        formData.append('start_date', setYYYYMMDD(values?.start_date));
                        formData.append('end_date', setYYYYMMDD(values?.end_date));
                        formData.append('files', fileFormData ? fileFormData : '');
                        values.id === '' && dispatch(contractCreateRequest(formData));
                        values.id !== '' && dispatch(updateContractRequest(values.id, formData));
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="company_name" className="required">
                                        Service Provider Name
                                    </label>
                                    <InputText
                                        id="company_name"
                                        name="company_name"
                                        placeholder="Enter Service Provider Name"
                                        type="text"
                                        value={values?.company_name}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.company_name && touched.company_name })}
                                    />
                                    {errors.company_name && touched.company_name ? <small className="p-invalid error">{errors.company_name}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="category">Service Category Type</label>
                                    <InputText
                                        id="category"
                                        name="category"
                                        placeholder="Enter Service Category Type"
                                        type="text"
                                        value={values?.category}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.category && touched.category })}
                                    />
                                    {errors.category && touched.category ? <small className="p-invalid error">{errors.category}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="contactPerson" className="required">
                                        Contact Person
                                    </label>
                                    <InputText
                                        id="contactPerson"
                                        name="contactPerson"
                                        placeholder="Enter Contact Person Name"
                                        type="text"
                                        value={values?.contactPerson}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.contactPerson && touched.contactPerson })}
                                    />
                                    {errors.contactPerson && touched.contactPerson ? <small className="p-invalid error">{errors.contactPerson}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="designation" className="required">
                                        Designation
                                    </label>
                                    <InputText
                                        id="designation"
                                        name="designation"
                                        placeholder="Enter Contact Person Designation"
                                        type="text"
                                        value={values?.designation}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.designation && touched.designation })}
                                    />
                                    {errors.designation && touched.designation ? <small className="p-invalid error">{errors.designation}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="contactNo" className="required">
                                        Contact No.
                                    </label>
                                    <InputNumber
                                        id="contactNo"
                                        name="contactNo"
                                        placeholder="Enter Contact No."
                                        type="text"
                                        maxLength={10}
                                        value={values?.contactNo}
                                        useGrouping={false}
                                        onValueChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.contactNo && touched.contactNo })}
                                    />
                                    {errors.contactNo && touched.contactNo ? <small className="p-invalid error">{errors.contactNo}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="start_date" className="required">
                                        Start Date
                                    </label>
                                    <Calendar
                                        id="start_date"
                                        name="start_date"
                                        placeholder="Please Select Date"
                                        value={values?.start_date !== '' ? setDefaultDate(values?.start_date) : ''}
                                        dateFormat="dd/mm/yy"
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                            setFieldValue('start_date', formattedDate);
                                        }}
                                        className={classNames({ 'p-invalid': errors.start_date && touched.start_date })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.start_date && touched.start_date ? errors?.start_date : ''}
                                    </div>
                                    {/* {errors.start_date && touched.start_date ? <small className="p-invalid error">{errors?.start_date}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="end_date" className="required">
                                        End Date
                                    </label>
                                    <Calendar
                                        id="end_date"
                                        name="end_date"
                                        placeholder="Please Select Date"
                                        value={values?.end_date !== '' ? setDefaultDate(values?.end_date) : ''}
                                        dateFormat="dd/mm/yy"
                                        // minDate={new Date()}
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                            setFieldValue('end_date', formattedDate);
                                        }}
                                        className={classNames({ 'p-invalid': errors.end_date && touched.end_date })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.end_date && touched.end_date ? errors?.end_date : ''}
                                    </div>

                                    {/* {errors.end_date && touched.end_date ? <small className="p-invalid error">{errors?.end_date}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="address" className="required">
                                        Address
                                    </label>
                                    <InputText
                                        id="address"
                                        name="address"
                                        placeholder="Enter Service Provider Address"
                                        type="text"
                                        value={values?.address}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.address && touched.address })}
                                    />
                                    {errors.address && touched.address ? <small className="p-invalid error">{errors.address}</small> : null}
                                </div>
                                <div className="field col-12 md:col-4 mt-4">
                                    {fileName === null && (
                                        <div className="file-input-upload">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png, .pdf, .doc, .docx" className="input" onChange={handleUpload} />
                                            <label for="fileInput" className="label">
                                                <span>Upload an Agreement File...</span>
                                            </label>
                                        </div>
                                    )}
                                    {fileName !== null && (
                                        <>
                                            <label htmlFor="agreement_file" className="">
                                                Agreement File
                                            </label>
                                            <div className="flex align-items-center">
                                                <div>{fileName}</div>
                                                <div className="ml-3">
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-rounded p-button-text  p-button-danger"
                                                        id="delete-icons"
                                                        tooltip="Delete"
                                                        tooltipOptions={{ position: 'bottom' }}
                                                        onClick={() => {
                                                            setFileFormData(null);
                                                            setFileName(null);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* <input type="file" onChange={handleUpload} placeholder="Upload agreement" /> */}
                                    {/* {fileName === null && <FileUpload mode="basic" chooseLabel="Upload agreement" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" customUpload onSelect={handleUpload} />} */}
                                </div>
                                <div className="col-12 text-lg text-500 mt-2">
                                    <span className="text-lg text-red-500">{'Note :- '}</span>
                                    <span className="text-red-500">{'Accepted .jpg, .jpeg, .png, .pdf, .doc, .docx only.'}</span>
                                </div>
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/contract')} />
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
export default ContractCreate;
