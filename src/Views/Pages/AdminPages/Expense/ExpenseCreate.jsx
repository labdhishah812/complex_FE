import components from '../..';
import Loader from '../../../../components/Loader';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { expenseCreateRequest, getExpenseDataById, updateExpenseRequest, getExpenseCategoryData } from '../../../../redux/slice/AdminSlices/expenseSlice';
import { AutoComplete } from 'primereact/autocomplete';
import { BsCurrencyRupee } from 'react-icons/bs';

const ExpenseCreate = () => {
    const { BreadCrumb, Button, InputText, Calendar, RadioButton, InputNumber, InputTextarea, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, expenseDataById, isCreated, expenseCategoryData } = useSelector((state) => state.expense);
    const [submitted, setSubmitted] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [fileFormData, setFileFormData] = useState(null);
    const [createStatus, setCreateStatus] = useState(true);
    const [filteredCountries, setFilteredCountries] = useState(null);
    const [allWork, setAllWork] = useState([]);
    const [showFile, setShowFile] = useState(null);
    const [formValue, setFormValue] = useState({
        id: '',
        expense_date: '',
        expense_details: '',
        expense_category: '',
        amount: ''
        // payment_mode: 'Cash'
    });
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;

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
    useEffect(() => {
        if (expenseCategoryData && expenseCategoryData?.data.length > 0) {
            const uniqueWorkTypes = [...new Set(expenseCategoryData?.data.map((vendor) => vendor))];
            let collect = [];
            uniqueWorkTypes.forEach((e) => {
                collect.push({ name: e });
            });
            setAllWork(collect);
        }
    }, [expenseCategoryData]);
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
    useEffect(() => {
        if (!params?.id) {
            let sendData = { ...formValue };
            sendData.expense_date = getFormattedDate();
            setFormValue(sendData);
            dispatch(getExpenseCategoryData());
        }
    }, [dispatch]);
    const getFormattedDate = () => {
        const now = new Date();

        // Extract year, month, and day
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const day = String(now.getDate()).padStart(2, '0');

        // Format date as YYYY-MM-DD
        return `${day}/${month}/${year}`;
    };
    useEffect(() => {
        if (params?.id && expenseDataById && expenseDataById?._id) {
            let sendData = {
                id: expenseDataById?._id,
                expense_date: seteditDefault(expenseDataById?.expense_date),
                expense_details: expenseDataById?.expense_details,
                expense_category: expenseDataById?.expense_category,
                amount: expenseDataById?.amount
            };
            setFormValue(sendData);
            setCreateStatus(expenseDataById?.status === 'clear' ? false : true);

            // Improved file handling for edit form
            if (expenseDataById?.payment_details?.receipt_screenshot) {
                const fileName = expenseDataById.payment_details.receipt_screenshot.split('/').pop();
                const fileExtension = fileName.split('.').pop().toLowerCase();

                if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                    setShowFile(`${BASE_URL_API}expense/${expenseDataById.payment_details.receipt_screenshot}`);
                    setFileName(`${BASE_URL_API}expense/${expenseDataById.payment_details.receipt_screenshot}`);
                } else if (fileExtension === 'pdf') {
                    setFileName(fileName);
                }
            }

            expenseDataById?.payment_details?.receipt_screenshot && setFileFormData(expenseDataById?.payment_details?.receipt_screenshot);
        }
    }, [expenseDataById]);

    // useEffect(() => {
    //     if (params?.id && expenseDataById && expenseDataById?._id) {
    //         let sendData = {
    //             id: expenseDataById?._id,
    //             expense_date: seteditDefault(expenseDataById?.expense_date),
    //             expense_details: expenseDataById?.expense_details,
    //             expense_category: expenseDataById?.expense_category,
    //             amount: expenseDataById?.amount
    //             // payment_mode: expenseDataById?.payment_mode
    //         };
    //         setFormValue(sendData);
    //         setCreateStatus(expenseDataById?.status === 'clear' ? false : true);
    //         expenseDataById?.payment_details?.receipt_screenshot && setFileName(expenseDataById?.payment_details?.receipt_screenshot);
    //         expenseDataById?.payment_details?.receipt_screenshot && setFileFormData(expenseDataById?.payment_details?.receipt_screenshot);
    //     }
    // }, [expenseDataById]);
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
    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredCountries;

            if (!event.query.trim().length) {
                _filteredCountries = [...allWork];
            } else {
                _filteredCountries = allWork.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredCountries(_filteredCountries);
        }, 250);
    };
    // const editeDate = (dateStr) => {
    //     try {
    //         // let [year, month, day] = val.split('T')[0].split("-").map(Number);
    //         // const dateObj = new Date(year, month - 1, day);
    //         // re
    //         const date = new Date(dateStr);
    //         const day = String(date.getUTCDate()).padStart(2, '0');
    //         const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    //         const year = date.getUTCFullYear();
    //         const formattedDate = `${day}/${month}/${year}`;

    //         return formattedDate;
    //     } catch (error) {}
    // };

    const SignupSchema = Yup.object().shape({
        expense_date: Yup.string().trim().nullable().required('Please select expense date'),
        expense_details: Yup.string().trim().nullable().required('Please enter expense details'),
        expense_category: Yup.string().trim().nullable().required('Please enter expense category'),
        // status: Yup.string().trim().nullable().required('Please select status.'),
        // payment_mode: Yup.string().trim().nullable().required('Please select payment mode.'),
        amount: Yup.number().typeError('Amount must be a number').required('Please enter Amount.').positive('Amount must be a positive number')
    });
    useEffect(() => {
        if (isCreated) navigate('/property-management/expense');
    }, [isCreated]);
    useEffect(() => {
        if (params.id) {
            dispatch(getExpenseDataById(params.id));
        }
    }, [params.id]);
    // useEffect(() => {
    //     if (expenseDataById && expenseDataById._id) {
    //         let setData = {
    //             id: expenseDataById?._id,
    //             company_name: expenseDataById?.company_name,
    //             start_date: editeDate(expenseDataById?.start_date),
    //             end_date: editeDate(expenseDataById?.end_date),
    //         };
    //         setFormValue(setData);
    //         expenseDataById?.aggerement_files !== null && setFileFormData(expenseDataById?.aggerement_files);
    //         expenseDataById?.aggerement_files !== null && setFileName(expenseDataById?.aggerement_files);

    //     }
    // }, [expenseDataById]);
    const breadcrumbHome = {
        label: 'Expense',
        command: () => {
            navigate('/property-management/expense');
        }
    };

    const breadcrumbItems = [
        {
            label: params?.id ? 'Edit Expense' : 'Add Expense'
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
                toast.error('Only Accept .png , .jpeg, .jpg, .pdf, .doc, .docx .', {
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Expense' : 'Add Expense'}</h5>
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
                        formData.append('expense_details', values?.expense_details);
                        formData.append('expense_category', values?.expense_category);
                        formData.append('amount', values?.amount);
                        formData.append('status', createStatus ? 'pending' : 'clear');
                        // formData.append('payment_mode', values?.payment_mode);
                        formData.append('expense_date', setYYYYMMDD(values?.expense_date));
                        formData.append('receipt', fileFormData ? fileFormData : '');
                        values.id === '' && dispatch(expenseCreateRequest(formData));
                        values.id !== '' && dispatch(updateExpenseRequest(values.id, formData));
                    }}
                >
                    {({ values, setFieldValue, handleChange, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="expense_date" className="required">
                                        Expense Date
                                    </label>
                                    <Calendar
                                        id="expense_date"
                                        name="expense_date"
                                        placeholder="Please Select Date"
                                        value={values?.expense_date !== '' ? setDefaultDate(values?.expense_date) : ''}
                                        dateFormat="dd/mm/yy"
                                        onChange={(e) => {
                                            const dateString = new Date(e.target.value);
                                            const day = dateString.getDate();
                                            const month = dateString.getMonth() + 1;
                                            const year = dateString.getFullYear();
                                            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                            setFieldValue('expense_date', formattedDate);
                                        }}
                                        className={classNames({ 'p-invalid': errors.expense_date && touched.expense_date })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.expense_date && touched.expense_date ? errors?.expense_date : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="amount" className="required">
                                        Amount
                                    </label>
                                    <span className="p-input-icon-left">
                                        <BsCurrencyRupee />
                                        <InputNumber
                                            id="amount"
                                            name="amount"
                                            placeholder="Enter Amount"
                                            type="tel"
                                            value={values?.amount}
                                            useGrouping={true}
                                            mode="decimal"
                                            locale="en-IN"
                                            onValueChange={handleChange}
                                            className={classNames({ 'p-invalid': errors.amount && touched.amount }, 'inputRupee')}
                                        />
                                    </span>
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.amount && touched.amount ? errors.amount : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="expense_category" className="required">
                                        Expense Category
                                    </label>
                                    <AutoComplete
                                        id="expense_category"
                                        name="expense_category"
                                        field="name"
                                        placeholder="Enter Expense Category"
                                        value={values?.expense_category}
                                        suggestions={filteredCountries}
                                        completeMethod={search}
                                        className={classNames({ 'p-invalid': errors.expense_category && touched.expense_category })}
                                        onChange={(e) => {
                                            let check = typeof e.value === 'object';
                                            setFieldValue('expense_category', check ? e?.value?.name : e.value);
                                        }}
                                    />
                                    {/* <InputText
                                        id="expense_category"
                                        name="expense_category"
                                        placeholder="Enter Expense Category"
                                        type="text"
                                        value={values?.expense_category}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.expense_category && touched.expense_category })}
                                    /> */}
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.expense_category && touched.expense_category ? errors.expense_category : ''}
                                    </div>
                                </div>
                                {/* <div className="field col-12 md:col-4 mb-1">
                                    <label className="required">Status</label>
                                    <div className="flex flex-wrap gap-3 ">
                                        <div className="flex align-items-center">
                                            <RadioButton
                                                inputId="createStatus1"
                                                name="createStatus"
                                                value="Pending"
                                                onChange={(e) => {
                                                    setCreateStatus(true);
                                                    decodeURI();
                                                }}
                                                checked={createStatus === true}
                                            />
                                            <label htmlFor="createStatus1" className="ml-2">
                                                Pending
                                            </label>
                                        </div>
                                        <div className="flex align-items-center">
                                            <RadioButton
                                                inputId="createStatus2"
                                                name="createStatus"
                                                value="Clear"
                                                onChange={(e) => {
                                                    setCreateStatus(false);
                                                }}
                                                checked={createStatus === false}
                                            />
                                            <label htmlFor="createStatus2" className="ml-2">
                                                Clear
                                            </label>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="payment_mode" className="required">
                                        Payment Mode
                                    </label>
                                    <Dropdown
                                        id="payment_mode"
                                        optionLabel="label"
                                        optionValue="value"
                                        options={[
                                            { label: 'Cash', value: 'Cash ' },
                                            { label: 'Cheque', value: 'Cheque' },
                                            { label: 'Online Mode', value: 'Online Mode' }
                                        ]}
                                        name="payment_mode"
                                        placeholder="Select Payment Mode"
                                        type="text"
                                        value={values?.payment_mode}
                                        onChange={(e) => {
                                            setFieldValue('payment_mode', e.target.value);
                                        }}
                                        className={classNames({ 'p-invalid': errors.payment_mode && touched.payment_mode })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.payment_mode && touched.payment_mode ? errors.payment_mode : ''}
                                    </div>
                                </div> */}
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="expense_details" className="required">
                                        Expense Details
                                    </label>

                                    <InputTextarea
                                        rows="3"
                                        cols="20"
                                        id="expense_details"
                                        name="expense_details"
                                        placeholder="Enter Expense Details"
                                        type="text"
                                        value={values?.expense_details}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.expense_details && touched.expense_details })}
                                        style={{ resize: 'none' }}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.expense_details && touched.expense_details ? errors?.expense_details : ''}
                                    </div>
                                </div>
                                {/* <div className={`field col-12 md:col-4 mb-0 ${fileName === null ? 'mt-4' : ''}`}>
                                    {fileName === null && (
                                        <div className="file-input-upload">
                                            <input
                                                type="file"
                                                id="fileInput"
                                                accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                                                className="input"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];
                                                    if (file) {
                                                        const fileType = file.type;
                                                        if (fileType.includes('image')) {
                                                            const reader = new FileReader();
                                                            reader.onload = () => {
                                                                setFileFormData(file);
                                                                setFileName(reader.result); // Sets the image preview
                                                            };
                                                            reader.readAsDataURL(file);
                                                        } else {
                                                            setFileFormData(file);
                                                            setFileName(file.name); // Sets the file name for non-images
                                                        }
                                                    }
                                                }}
                                            />
                                            <label htmlFor="fileInput" className="label">
                                                <span>Upload a Receipt File...</span>
                                            </label>
                                        </div>
                                    )}
                                    {fileName !== null && (
                                        <>
                                            <label htmlFor="receipt" className="">
                                                Receipt
                                            </label>
                                            <div className="flex align-items-center">
                                                {fileName.includes('data:image') ? ( // Check if it's an image
                                                    <div className="relative" style={{ width: '100px', height: '100px' }}>
                                                        <img alt="Uploaded Preview" src={fileName} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                                                        <div
                                                            className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                            style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                            onClick={() => {
                                                                setFileFormData(null);
                                                                setFileName(null);
                                                            }}
                                                        >
                                                            <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex align-items-center">
                                                        {fileName.includes('.pdf') ? <i className="pi pi-file-pdf" style={{ fontSize: '1.2rem', color: '#f63939' }}></i> : <i className="pi pi-file" style={{ fontSize: '1.2rem', color: '#999' }}></i>}
                                                        <span className="ml-2">{fileName}</span>
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
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div> */}
                                <div className={`field col-12 md:col-4 mb-0 ${fileName === null ? 'mt-4' : ''}`}>
                                    {fileName === null && (
                                        <div className="file-input-upload">
                                            <input
                                                type="file"
                                                id="fileInput"
                                                accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                                                className="input"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];
                                                    if (file) {
                                                        const fileType = file.type;
                                                        if (fileType.includes('image')) {
                                                            const reader = new FileReader();
                                                            reader.onload = () => {
                                                                setFileFormData(file);
                                                                setFileName(reader.result); // Sets the image preview
                                                            };
                                                            reader.readAsDataURL(file);
                                                        } else {
                                                            setFileFormData(file);
                                                            setFileName(file.name); // Sets the file name for non-images
                                                        }
                                                    }
                                                }}
                                            />
                                            <label htmlFor="fileInput" className="label">
                                                <span>Upload a Receipt File...</span>
                                            </label>
                                        </div>
                                    )}
                                    {fileName !== null && (
                                        <>
                                            <label htmlFor="receipt" className="">
                                                Receipt
                                            </label>
                                            <div className="flex align-items-center">
                                                {fileName.includes('data:image') || fileName.startsWith('http') ? ( // Check if it's an image or a URL
                                                    <div className="relative" style={{ width: '100px', height: '100px' }}>
                                                        <img alt="Uploaded Preview" src={fileName} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                                                        <div
                                                            className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                            style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                            onClick={() => {
                                                                setFileFormData(null);
                                                                setFileName(null);
                                                            }}
                                                        >
                                                            <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex align-items-center">
                                                        {fileName.includes('.pdf') ? <i className="pi pi-file-pdf" style={{ fontSize: '1.2rem', color: '#f63939' }}></i> : <i className="pi pi-file" style={{ fontSize: '1.2rem', color: '#999' }}></i>}
                                                        <span className="ml-2">{fileName}</span>
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
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button label="Cancel" type="button" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/expense')} />
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
export default ExpenseCreate;
