import components from '../..';
import Loader from '../../../../components/Loader';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { renewContractRequest } from '../../../../redux/slice/AdminSlices/contractSlice';
import moment from 'moment-timezone';

const ContractRenewalForm = () => {
    const { BreadCrumb, Button, Calendar, classNames, useDispatch, useState, useNavigate, useSelector } = components;
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.contract);
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

    const [formValue, setFormValue] = useState({
        status: 2,
        start_date: '',
        end_date: '',
        files: null
    });

    const SignupSchema = Yup.object().shape({
        status: Yup.string().trim().nullable().required('Please select status'),
        start_date: Yup.string().trim().nullable().required('Please select start date'),
        end_date: Yup.string().trim().nullable().required('Please select end date')
    });

    const breadcrumbHome = {
        label: 'Contracts',
        command: () => {
            navigate('/property-management/contract');
        }
    };

    const breadcrumbItems = [
        {
            label: 'Renew Contract'
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Renew Contract</h5>
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
                        formData.append('is_contract_renew_by_chairman', parseInt(values.status));
                        formData.append('start_date', setYYYYMMDD(values.start_date));
                        formData.append('end_date', setYYYYMMDD(values.end_date));
                        formData.append('files', fileFormData ? fileFormData : '');
                        dispatch(renewContractRequest(params.id, formData))
                            .then(() => {
                                navigate('/property-management/contract'); // Navigate to the list page
                            })
                            .catch(() => {
                                toast.error('Failed to renew the contract.');
                            });
                    }}
                >
                    {({ values, setFieldValue, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                {/* <div className="field col-12 md:col-4">
                                    <label htmlFor="status" className="required">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={values.status}
                                        onChange={(e) => setFieldValue('status', e.target.value)}
                                        className={classNames('p-inputtext p-component w-full', { 'p-invalid': errors.status && touched.status })}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="1">Active</option>
                                        <option value="2">Renew</option>
                                    </select>
                                    {errors.status && touched.status ? <small className="p-invalid error">{errors.status}</small> : null}
                                </div> */}
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
                                        minDate={values?.start_date !== '' ? setDefaultDate(values?.start_date) : ''}
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
                                </div>
                                <div className="field col-12 md:col-4 mt-4">
                                    {fileName === null && (
                                        <div className="file-input-upload">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png, .pdf, .doc, .docx" className="input" onChange={handleUpload} />
                                            <label htmlFor="fileInput" className="label">
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
                                                <div style={{ width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</div>
                                                <div className="ml-3">
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-rounded p-button-text p-button-danger"
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
                                </div>
                                <div className="col-12 text-lg text-500 mt-2">
                                    <span className="text-lg text-red-500">{'Note :- '}</span>
                                    <span className="text-red-500">{'Accepted .jpg, .jpeg, .png, .pdf, only.'}</span>
                                </div>
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/contract')} />
                                    <Button disabled={submitted} label="Submit" type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ContractRenewalForm;
