import { useParams } from 'react-router-dom';
import components from '../..';
import Loader from '../../../../components/Loader';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { getUserPropertyAssignData, rentalCreateRequest, updateRentalAssignRequest, getRentalDataByid } from '../../../../redux/slice/AdminSlices/RentalSlice';
// import { getRentalData, updateRentalStatus, rentalRemoveRequest } from '../../../../redux/slice/AdminSlices/RentalSlice';

const RentalCreate = () => {
    const { BreadCrumb, Dropdown, Button, InputText, InputNumber, Calendar, classNames, useDispatch, useState, useEffect, useSelector, useNavigate } = components;
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { isCreated, userAssignData, rentalDetailByid,isLoading } = useSelector((state) => state.rental);
    const [submitted, setSubmitted] = useState(false);
    const [fileFormData, setFileFormData] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [formValue, setFormValue] = useState({
        id: '',
        name: '',
        mobile_number: null,
        email: '',
        start_date: '',
        end_date: '',
        user_property_assign_id: '',
        owner_id: ''
    });
    const SignupSchema = Yup.object().shape({
        name: Yup.string().trim().nullable().required('Please enter rental name.'),
        mobile_number: Yup.string().trim().min(10, 'Mobile number must be at least 10 digit number.').max(10, 'Mobile number must be at least 10 digit number.').required('Please enter mobile number'),
        email: Yup.string().trim().nullable().required('Please enter email address.').email('Please enter valid email address.'),
        start_date: Yup.string().trim().nullable().required('Please select start date.'),
        end_date: Yup.string().trim().nullable().required('Please select end date.'),
        user_property_assign_id: Yup.string().trim().nullable().required('Please select property.')
    });
    useEffect(() => {
        dispatch(getUserPropertyAssignData());
        // if (editData !== null) {
        //     let setData = {
        //         id: editData?._id,
        //         name: editData?.name,
        //         mobile_number: editData?.mobile_no,
        //         email: editData?.email,
        //         start_date: editData?.start_date,
        //         end_date: editData?.end_date,
        //         user_property_assign_id: editData?.user_property_assign_id,
        //         owner_id: editData?.owner_id
        //     };
        //     setFormValue(setData);
        //     editData?.agreement_docs !== null && setFileFormData(editData?.agreement_docs);
        //     editData?.agreement_docs !== null && setFileName(editData?.agreement_docs);
        // }
    }, [dispatch]);
    useEffect(() => {
        if (isCreated) {
            navigate('/property-management/rental');
        }
    }, [isCreated]);
    useEffect(() => {
        if (params.id) {
            dispatch(getRentalDataByid(params.id))
        }
    }, [params.id]);
    useEffect(() => {
        if (rentalDetailByid && rentalDetailByid._id) {
            let setData = {
                id: rentalDetailByid?._id,
                name: rentalDetailByid?.name,
                mobile_number: rentalDetailByid?.mobile_no,
                email: rentalDetailByid?.email,
                start_date: editeDate(rentalDetailByid?.start_date),
                end_date: editeDate(rentalDetailByid?.end_date),
                user_property_assign_id: rentalDetailByid?.user_property_assign_id,
                owner_id: rentalDetailByid?.owner_id
            };
            setFormValue(setData);
            rentalDetailByid?.agreement_docs !== null && setFileFormData(rentalDetailByid?.agreement_docs);
            rentalDetailByid?.agreement_docs !== null && setFileName(rentalDetailByid?.agreement_docs);

        }
    }, [rentalDetailByid]);
    const breadcrumbItems = [
        {
            label: params.id ? 'Edit Rental' : 'Create Rental'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Rental',
        command: () => {
            navigate('/property-management/rental');
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
        } catch (error) {

        }
    }
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
                // let formData = new FormData();
                // formData.append('file', event.target.files[0]);
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
    return (<>
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title  m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Rental' : 'Create Rental'}</h5>
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
                        formData.append('name', values?.name);
                        formData.append('mobile_no', values?.mobile_number);
                        formData.append('email', values?.email);
                        formData.append('start_date', setYYYYMMDD(values?.start_date));
                        formData.append('end_date', setYYYYMMDD(values?.end_date));
                        formData.append('user_property_assign_id', values?.user_property_assign_id);
                        formData.append('owner_id', values?.owner_id);
                        formData.append('file', fileFormData ? fileFormData : '');
                        // sendData.file = fileFormData;

                        values.id === '' && dispatch(rentalCreateRequest(formData));
                        values.id !== '' && dispatch(updateRentalAssignRequest(values.id, formData));
                    }}
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="name" className="required">
                                        Rental name
                                    </label>
                                    <InputText id="name" name="name" placeholder="Enter Rental Name" type="text" value={values?.name} onChange={handleChange} className={classNames({ 'p-invalid': errors.name && touched.name })} />
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.name && touched.name ? errors.name : ""}</div>
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="mobile_number" className="required">
                                        Mobile Number
                                    </label>
                                    <InputNumber
                                        id="mobile_number"
                                        type="tel"
                                        placeholder="Enter Mobile No"
                                        name="mobile_number"
                                        value={values?.mobile_number}
                                        useGrouping={false}
                                        maxLength={10}
                                        onValueChange={(e) => {
                                            setFieldValue('mobile_number', e.value === null ? '' : e.value.toString());
                                        }}
                                        className={classNames({ 'p-invalid': errors.mobile_number && touched.mobile_number })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.mobile_number && touched.mobile_number ? errors.mobile_number : ""}</div>
                                    {/* {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="email" className="required">
                                        Email
                                    </label>
                                    <InputText id="email" placeholder="Enter email" value={values?.email} onChange={handleChange} className={classNames({ 'p-invalid': errors.email && touched.email })} />
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.email && touched.email ? errors?.email : ""}</div>
                                    {/* {errors.email && touched.email ? <small className="p-invalid error">{errors?.email}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="start_date" className="required">
                                        Start Date
                                    </label>
                                    <Calendar
                                        id="start_date"
                                        name="start_date"
                                        placeholder="Please Select Date"
                                        value={values?.start_date !== "" ? setDefaultDate(values?.start_date) : ''}
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
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.start_date && touched.start_date ? errors?.start_date : ""}</div>
                                    {/* {errors.start_date && touched.start_date ? <small className="p-invalid error">{errors?.start_date}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="end_date" className="required">
                                        End Date
                                    </label>
                                    <Calendar
                                        id="end_date"
                                        name="end_date"
                                        placeholder="Please Select Date"
                                        value={values?.end_date !== "" ? setDefaultDate(values?.end_date) : ""}
                                        dateFormat="dd/mm/yy"
                                        minDate={new Date()}
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
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.end_date && touched.end_date ? errors?.end_date : ""}</div>

                                    {/* {errors.end_date && touched.end_date ? <small className="p-invalid error">{errors?.end_date}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    <label htmlFor="user_property_assign_id" className="required">
                                        Property Assign
                                    </label>
                                    <Dropdown
                                        id="user_property_assign_id"
                                        optionLabel="property_number"
                                        optionValue="user_property_assign_id"
                                        options={userAssignData ? userAssignData?.data : []}
                                        name="user_property_assign_id"
                                        placeholder={'Select Property'}
                                        type="text"
                                        value={values?.user_property_assign_id}
                                        onChange={(e) => {
                                            let ownerId = userAssignData?.data.find((x) => x.user_property_assign_id === e.target.value);
                                            setFieldValue('user_property_assign_id', e.target.value);
                                            setFieldValue('owner_id', ownerId?.owner_id);
                                        }}
                                        className={classNames({ 'p-invalid': errors.user_property_assign_id && touched.user_property_assign_id })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{errors.user_property_assign_id && touched.user_property_assign_id ? errors?.user_property_assign_id : ""}</div>

                                    {/* {errors.user_property_assign_id && touched.user_property_assign_id ? <small className="p-invalid error">{errors?.user_property_assign_id}</small> : null} */}
                                </div>
                                <div className="field col-12 md:col-4 mb-0">
                                    {fileName === null && (
                                        <div className="file-input-upload">
                                            <input type="file" id="fileInput" accept=".jpg, .jpeg, .png, .pdf, .doc, .docx" className="input" onChange={handleUpload} />
                                            <label for="fileInput" className="label">
                                                <span>Upload a agreement file...</span>
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
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button
                                        label="Cancel"
                                        icon="pi pi-times"
                                        className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                                        onClick={() => navigate('/property-management/rental')}
                                    />
                                    <Button disabled={submitted} label={'Save'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </>)
}
export default RentalCreate;