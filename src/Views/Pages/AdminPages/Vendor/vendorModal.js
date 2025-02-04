import components from '../..';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { vendorCreateRequest, updateVendorAssignRequest } from '../../../../redux/slice/AdminSlices/vendorSlice';
const VendorModel = ({ editData, onHide }) => {
    const { Dialog, Button, InputText, Image, InputNumber, InputTextarea, classNames, useDispatch, useState, useEffect } = components;
    const dispatch = useDispatch();

    const [submitted, setSubmitted] = useState(false);
    const [showFile, setShowFile] = useState(null);

    const [formValue, setFormValue] = useState({
        id: '',
        vendor_name: '',
        pincode: '',
        work_type: '',
        mobile_number: null,
        description: '',
        vendor_address: '',
        file: null
    });
    const SignupSchema = Yup.object().shape({
        vendor_name: Yup.string().trim().nullable().required('Please enter vendor name'),
        work_type: Yup.string().trim().nullable().required('Please enter work type'),
        pincode: Yup.string().trim().nullable().min(6, 'Pincode no must be at least 6 digit no.').max(6, 'Mobile no must be at least 6 digit no.').required('Please enter pincode.'),
        description: Yup.string().trim().nullable().required('Please enter vendor description'),
        vendor_address: Yup.string().trim().nullable().required('Please enter vendor address'),
        mobile_number: Yup.string().trim().min(10, 'Mobile no must be at least 10 digit number.').max(10, 'Mobile no must be at least 10 digit number.').required('Please enter mobile number')
    });

    useEffect(() => {
        if (editData !== null) {
            let setData = {
                id: editData?._id,
                vendor_name: editData?.name,
                pincode: editData?.pincode,
                work_type: editData?.work_type,
                mobile_number: editData?.mobile_number,
                description: editData?.work_description,
                vendor_address: editData?.vendor_address,
                file: editData?.vendor_profile_image ? editData?.vendor_profile_image : null
            };
            editData?.vendor_profile_image && setShowFile(`${process.env.REACT_APP_BASE}uploads/vendor/${editData?.vendor_profile_image}`);
            setFormValue(setData);
        }
    }, [dispatch, editData]);
    const handleUpload = async (event, setFieldValue) => {
        try {
            const str = event.target.files[0]?.name;
            const substr = ['.jpg', '.jpeg', '.png'];
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                setFieldValue('file', event.target.files[0]);
                setShowFile(URL.createObjectURL(event.target.files[0]));
            } else {
                toast.error('Only Accept png , jpeg, jpg', {
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
        <Dialog visible={true} style={{ width: '80vw' }} header={formValue.id === '' ? 'Create Vendor' : 'Edit Vendor'} modal className="p-fluid" onHide={onHide}>
            <Formik
                initialValues={formValue}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                    setSubmitted(true);
                    setTimeout(() => {
                        setSubmitted(false);
                    }, 5000);
                    let sendData = {
                        name: values?.vendor_name,
                        work_type: values?.work_type,
                        pincode: values?.pincode,
                        work_description: values?.description,
                        mobile_number: values?.mobile_number,
                        vendor_address: values?.vendor_address,
                        file: values?.file !== null ? values?.file : ''
                    };
                    values.id === '' && dispatch(vendorCreateRequest(sendData));
                    values.id !== '' && dispatch(updateVendorAssignRequest(values.id, sendData));
                }}
            >
                {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                    <Form>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="vendor_name" className="required">
                                    Vendor name
                                </label>
                                <InputText
                                    id="vendor_name"
                                    name="vendor_name"
                                    placeholder="Enter vendor name"
                                    type="text"
                                    value={values?.vendor_name}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.vendor_name && touched.vendor_name })}
                                />
                                {/* {errors.vendor_name && touched.vendor_name ? <small className="p-invalid error">{errors.vendor_name}</small> : null} */}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="pincode" className="required">
                                    Pincode
                                </label>
                                <InputText
                                    id="pincode"
                                    name="pincode"
                                    placeholder="Enter pincode"
                                    type="text"
                                    value={values?.pincode}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.pincode && touched.pincode })}
                                />
                                {/* {errors.vendor_name && touched.vendor_name ? <small className="p-invalid error">{errors.vendor_name}</small> : null} */}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="work_type" className="required">
                                    Vendor work type
                                </label>
                                <InputText
                                    id="work_type"
                                    name="work_type"
                                    placeholder="Enter vendor work type"
                                    type="text"
                                    value={values?.work_type}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.work_type && touched.work_type })}
                                />
                                {errors.work_type && touched.work_type ? <small className="p-invalid error">{errors.work_type}</small> : null}
                            </div>
                            <div className="field col-12 md:col-4 mb-1">
                                <label htmlFor="mobile_number" className="required">
                                    Mobile number
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
                                        setFieldValue('mobile_number', e.value === null ? '' : e.value.toString());
                                    }}
                                    className={classNames({ 'p-invalid': errors.mobile_number && touched.mobile_number })}
                                />

                                {errors.mobile_number && touched.mobile_number ? <small className="p-invalid error">{errors.mobile_number}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="description" className="required">
                                    Vendor profile description
                                </label>

                                <InputTextarea
                                    rows="3"
                                    cols="20"
                                    autoResize
                                    id="description"
                                    name="description"
                                    placeholder="Enter vendor profile description"
                                    type="text"
                                    value={values?.description}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.description && touched.description })}
                                />

                                {errors.description && touched.description ? <small className="p-invalid error">{errors?.description}</small> : null}
                            </div>
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="vendor_address" className="required">
                                    Vendor address
                                </label>

                                <InputTextarea
                                    rows="3"
                                    cols="20"
                                    autoResize
                                    id="vendor_address"
                                    name="vendor_address"
                                    placeholder="Enter vendor address"
                                    type="text"
                                    value={values?.vendor_address}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.vendor_address && touched.vendor_address })}
                                />

                                {errors.vendor_address && touched.vendor_address ? <small className="p-invalid error">{errors?.vendor_address}</small> : null}
                            </div>
                            {values?.file === null && (
                                <div className="field col-12 md:col-4 mb-1">
                                    <div className="file-input-upload">
                                        <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={(event) => handleUpload(event, setFieldValue)} />
                                        <label for="fileInput" className="label">
                                            <span>Upload a profile image...</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                            {values?.file !== null && (
                                <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                    <Image src={showFile} alt="Image" width="100" height="100" preview />
                                    <div className="ml-1">
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-text  p-button-danger"
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
                            )}
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={onHide} />
                                <Button disabled={submitted} label={values.id === '' ? 'Save' : 'Update'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
export default VendorModel;
