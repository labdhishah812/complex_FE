import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import components from '../..';
import LoaderUi from '../../../../components/Loader';
import { getVehicleUserPropertyList } from '../../../../redux/slice/AdminSlices/blockSlice';
import { getNoticeDetailById, noticeCreateRequest, noticeUpdateRequest } from '../../../../redux/slice/AdminSlices/noticeSlice';

const CreateNotice = ({ editData, onHide }) => {
    const { BreadCrumb, Dropdown, Button, Calendar, Checkbox, InputText, RadioButton, InputTextarea, Image, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    // const [editerValue, setEditerValue] = useState('');
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;

    const { vehicleUserProperty, isLoading } = useSelector((store) => store.block);
    const { isCreated, noticeDetailById, isLoading: isLoading1 } = useSelector((store) => store.notice);

    const [showFile, setShowFile] = useState(null);
    const [checkDraft, setCheckDraft] = useState(null);

    const [formValue, setFormValue] = useState({
        id: '',
        user_property_assign_id: '',
        user_id: '',
        subject: '',
        description: '',
        notice_date: '',
        notice_status: 'draft',
        file: null
    });
    const SignupSchema = Yup.object().shape({
        user_property_assign_id: Yup.string().trim().nullable().required('Please select recipient name.'),
        subject: Yup.string().trim().nullable().required('Please enter subject.'),
        description: Yup.string().trim().nullable().required('Please enter description.'),
        notice_date: Yup.string().trim().nullable().required('Please select expense date')
    });

    useEffect(() => {
        if (isCreated) {
            navigate('/property-management/notice');
        }
    }, [isCreated]);

    useEffect(() => {
        dispatch(getVehicleUserPropertyList({ module_name: 'Inner' }));
    }, [dispatch]);

    useEffect(() => {
        if (params.id) {
            dispatch(getNoticeDetailById(params.id));
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id && noticeDetailById && noticeDetailById._id) {
            let setData = {
                id: noticeDetailById?._id,
                user_property_assign_id: noticeDetailById?.user_property_assignid,
                user_id: noticeDetailById?.userId,
                subject: noticeDetailById?.subject,
                description: noticeDetailById?.description,
                notice_date: seteditDefault(noticeDetailById?.notice_date),
                notice_status: noticeDetailById?.notice_status,
                file: noticeDetailById?.notice_file ? noticeDetailById?.notice_file : null
            };
            const currentDate = new Date();
            const givenDate = new Date(noticeDetailById?.notice_date);
            if (givenDate.toDateString() === currentDate.toDateString()) {
                setCheckDraft(false);
            }

            // Improved file handling
            if (noticeDetailById?.notice_file) {
                const fileName = noticeDetailById.notice_file.split('/').pop();
                const fileExtension = fileName.split('.').pop().toLowerCase();

                if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                    setShowFile(`${BASE_URL_API}notice/${noticeDetailById.notice_file}`);
                } else if (fileExtension === 'pdf') {
                    setShowFile(fileName);
                }
            }

            setFormValue(setData);
        }
    }, [noticeDetailById]);
    const seteditDefault = (val) => {
        try {
            const inputDateString = val;
            const [year, month, day] = inputDateString.split('-').map(Number);
            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
            return formattedDate;
        } catch (error) {
            console.log(error);
            return '';
        }
    };
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Notice',
        command: () => {
            navigate('/property-management/notice');
        }
    };
    const breadcrumbItems = [
        {
            label: params?.id ? 'Edit Notice' : 'Create Notice'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const handleUpload = async (event, setFieldValue) => {
        try {
            const file = event.target.files[0];
            const str = file.name;
            const fileExtension = str.split('.').pop().toLowerCase();
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];

            if (allowedExtensions.includes(fileExtension)) {
                setFieldValue('file', file);

                if (fileExtension === 'pdf') {
                    setShowFile(str); // Show only file name for PDF
                } else {
                    setShowFile(URL.createObjectURL(file));
                }
            } else {
                toast.error('Only accepts .png, .jpg, .jpeg and .pdf files.', {
                    style: { marginTop: '4rem' }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    console.log(params?.id, ':::::params?.id');
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
    return (
        <>
            <div className="relative min-h-full">
                <LoaderUi isLoading={isLoading || isLoading1} />
                <div className="flex justify-content-between align-items-center">
                    <div className="flex flex-row w-full">
                        <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Notice' : 'Create Notice'}</h5>
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
                            if (values?.notice_status === 'draft' && !checkDraft) {
                                toast.error('Please select check box.', {
                                    style: {
                                        marginTop: '4rem'
                                    }
                                });
                            } else {
                                let sendData = {
                                    user_property_assign_id: values?.user_property_assign_id,
                                    user_id: values?.user_id,
                                    subject: values?.subject,
                                    description: values?.description,
                                    notice_date: setYYYYMMDD(values?.notice_date),
                                    notice_status: values?.notice_status,
                                    file: values?.file !== null ? values?.file : ''
                                };
                                // if (values.id === '') {
                                //     sendData.owner_id = values.owner_id;
                                // }
                                values.id === '' && dispatch(noticeCreateRequest(sendData));
                                values.id !== '' && dispatch(noticeUpdateRequest(values.id, sendData));
                            }
                        }}
                    >
                        {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                            <Form>
                                <div className="grid p-fluid mt-1">
                                    <div className="field col-12 md:col-4 mb-0">
                                        <label htmlFor="user_property_assign_id" className="required">
                                            Recipient Name
                                        </label>
                                        <Dropdown
                                            id="user_property_assign_id"
                                            optionLabel="label"
                                            optionValue="property_assign_id"
                                            options={vehicleUserProperty ? vehicleUserProperty : []}
                                            name="user_property_assign_id"
                                            placeholder="Select Recipient Name"
                                            type="text"
                                            value={values?.user_property_assign_id}
                                            onChange={(e) => {
                                                let ownerId = vehicleUserProperty.find((x) => x.property_assign_id === e.target.value);
                                                setFieldValue('user_property_assign_id', e.target.value);
                                                setFieldValue('user_id', ownerId?.owner_id);
                                            }}
                                            className={classNames({ 'p-invalid': errors.user_property_assign_id && touched.user_property_assign_id && values?.user_property_assign_id === '' })}
                                            disabled={values.id !== ''}
                                            filter
                                        />
                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                            {errors.user_property_assign_id && touched.user_property_assign_id && values?.user_property_assign_id === '' ? errors.user_property_assign_id : ''}
                                        </div>
                                    </div>
                                    <div className="field col-12 md:col-4 mb-0">
                                        <label htmlFor="notice_date" className="required">
                                            Notice Date
                                        </label>
                                        <Calendar
                                            id="notice_date"
                                            name="notice_date"
                                            placeholder="Select Date"
                                            value={values?.notice_date !== '' ? setDefaultDate(values?.notice_date) : ''}
                                            dateFormat="dd/mm/yy"
                                            minDate={new Date()}
                                            onChange={(e) => {
                                                const dateString = new Date(e.target.value);
                                                const day = dateString.getDate();
                                                const month = dateString.getMonth() + 1;
                                                const year = dateString.getFullYear();
                                                const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                                const currentDate = new Date();
                                                const givenDate = new Date(`${year}/${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`);
                                                if (givenDate.toDateString() === currentDate.toDateString()) {
                                                    setFieldValue('notice_status', 'published');
                                                    setCheckDraft(false);
                                                } else if (givenDate > currentDate) {
                                                    setFieldValue('notice_status', 'draft');
                                                }

                                                setFieldValue('notice_date', formattedDate);
                                            }}
                                            className={classNames({ 'p-invalid': errors.notice_date && touched.notice_date })}
                                        />
                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                            {errors.notice_date && touched.notice_date ? errors?.notice_date : ''}
                                        </div>
                                    </div>
                                    <div className="field col-12 md:col-4 mb-0">
                                        <label htmlFor="subject" className="required">
                                            Subject
                                        </label>
                                        <InputText id="subject" name="subject" placeholder="Enter Subject" type="text" value={values?.subject} onChange={handleChange} className={classNames({ 'p-invalid': errors.subject && touched.subject })} />
                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                            {errors.subject && touched.subject ? errors.subject : ''}
                                        </div>
                                    </div>
                                    <div className="field col-12 md:col-12 mb-1">
                                        <label htmlFor="description" className="required">
                                            Description
                                        </label>
                                        <ReactQuill
                                            theme="snow"
                                            value={values?.description}
                                            onChange={(e) => {
                                                setFieldValue('description', e === '<p><br></p>' ? '' : e);
                                            }}
                                            className={`reactQuillCustom ${errors.description && touched.description ? 'reactQuillCustomError' : ''}`}
                                            style={{
                                                height: 'auto',
                                                // Conditionally apply maxHeight only for create notice
                                                overflow: 'auto'
                                            }}
                                        />
                                        {/* <InputTextarea
                                        id="description"
                                        name="description"
                                        placeholder="Enter Description"
                                        type="text"
                                        value={values?.description}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.description && touched.description })}
                                    /> */}
                                        {/* <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.description && touched.description ? errors.description : ""}</div> */}
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
                                                    setFieldValue("notice_status", "draft")
                                                    // setCreateStatus(true);
                                                    // decodeURI();
                                                }}
                                                checked={values?.notice_status === "draft"}
                                            />
                                            <label htmlFor="createStatus1" className="ml-2">
                                                Save As Draft
                                            </label>
                                        </div>
                                        <div className="flex align-items-center">
                                            <RadioButton
                                                inputId="createStatus2"
                                                name="createStatus"
                                                value="Clear"
                                                onChange={(e) => {
                                                    // setCreateStatus(false);
                                                    setFieldValue("notice_status", "published")
                                                }}
                                                checked={values?.notice_status !== "draft"}
                                            />
                                            <label htmlFor="createStatus2" className="ml-2">
                                                Published
                                            </label>
                                        </div>
                                    </div>
                                </div> */}
                                    <div
                                        className={`field col-12 md:col-4 mb-1 ${
                                            // values?.file === null ? "mt-4" :
                                            ''
                                        }`}
                                    >
                                        {values?.file === null && (
                                            <div className="file-input-upload">
                                                <input type="file" id="fileInput" accept=".jpg, .jpeg, .png ,.pdf" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                                <label for="fileInput" className="label">
                                                    <span>Upload Notice...</span>
                                                </label>
                                                <div className="p-invalid error text-xl mt-4" style={{ minHeight: '1.1rem', marginTop: '3px', width: '80rem' }}>
                                                    {'Notes :- '}
                                                    <span className="text-base">{'Only JPEG, JPG, PNG, and PDF files are supported.'}</span>
                                                </div>
                                            </div>
                                        )}
                                        {values?.file !== null && showFile.includes('.pdf') ? (
                                            <div className="flex align-items-center">
                                                <i className="pi pi-file-pdf" style={{ fontSize: '1.2rem', color: '#f63939' }}></i>
                                                <span className="ml-2">{showFile}</span>
                                                <div className="ml-3">
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-rounded p-button-text p-button-danger"
                                                        id="delete-icons"
                                                        tooltip="Delete"
                                                        tooltipOptions={{ position: 'bottom' }}
                                                        onClick={() => {
                                                            setFieldValue('file', null);
                                                            setShowFile(null);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            values?.file !== null && (
                                                <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                                    <div className="relative " style={{ width: '100px', height: '100px' }}>
                                                        <Image alt="Image" src={showFile} width="100" height="100" preview />
                                                        <div
                                                            className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                                            style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                                            onClick={() => {
                                                                setFieldValue('file', null);
                                                                setShowFile(null);
                                                            }}
                                                        >
                                                            <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    {values?.notice_status === 'draft' && (
                                        <div className="field col-12 md:col-12 mb-1 flex align-items-center">
                                            <Checkbox inputId="ingredient1" onChange={() => setCheckDraft(!checkDraft)} checked={checkDraft}></Checkbox>
                                            <label className="ml-2 mt-2" htmlFor="ingredient1">{`Since you selected a future date, the notice is saved as a draft and will be sent automatically on specified date.`}</label>
                                        </div>
                                    )}
                                    <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                        <Button label="Cancel" icon="pi pi-times" type="button" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/notice')} />
                                        <Button
                                            disabled={submitted}
                                            label={values?.notice_status === 'draft' ? 'Save as Draft' : 'Published'}
                                            type="submit"
                                            icon="pi pi-check"
                                            className={`p-button-outlined p-button-success mr-2 mb-2 ${values?.notice_status === 'draft' ? 'w-10rem' : 'w-9rem'}`}
                                        />
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};
export default CreateNotice;
