import components from '../..';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
const CreatePropertyModel = ({ onHide, handleSave }) => {
    const { Button, InputNumber, InputTextarea, Dropdown, useState, React, Dialog, InputText, classNames, RadioButton, Divider, useSelector } = components;
    const [value, setValue] = useState({
        id: '',
        property_type: '',
        is_block_exist_in_property: true,
        is_floor_exist_in_property: true,
        is_house_exist_in_property: true,
        is_ground_floor_exist_in_property: false,
        is_shopping_center_exist_in_property: false,
        is_block_exist_in_shopping_center_property: false,
        is_floor_exist_in_shopping_center_property: true,
        property_name: '',
        domainName: '',
        propertyEmail: '',
        property_address: '',
        email: '',
        name: '',
        mobile_number: null,
        property_status: 'Active',
        accountHolderName: '',
        bankName: '',
        bankAccountNumber: '',
        branchName: '',
        IFSCCode: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const statusTag = [
        { label: 'Active', value: 'Active' },
        { label: 'In-Active', value: 'In-Active' }
    ];

    const SignupSchema = Yup.object().shape({
        property_type: Yup.string().trim().nullable().required(' '),
        property_name: Yup.string().trim().nullable().required(' '),
        domainName: Yup.string().trim().nullable().required(' '),
        propertyEmail: Yup.string().trim().nullable().required('Please Enter Email').email('Please enter valid email.'),
        property_address: Yup.string().trim().nullable().required(' '),
        email: Yup.string().trim().nullable().required('Please Enter Email').email('Please enter valid email.'),
        name: Yup.string().trim().nullable().required(' '),
        mobile_number: Yup.string().trim().min(10, 'Mobile no must be at least 10 digit no.').max(10, 'Mobile no must be at least 10 digit no.').required('Please Enter Mobile Number'),
        accountHolderName: Yup.string().trim().nullable().required('Please enter account holder name.'),
        bankName: Yup.string().trim().nullable().required('Please enter bank name.'),
        bankAccountNumber: Yup.string().trim().nullable().required('Please enter bank account number.'),
        branchName: Yup.string().trim().nullable().required('Please enter branch name.'),
        IFSCCode:  Yup.string()
        .trim()
        .nullable()
        .required('Please enter IFSC code.')
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code. It should be 11 characters long: first 4 uppercase alphabets, 5th character 0, and last 6 alphanumeric characters.')
    });
    return (
        <Dialog visible={true} style={{ width: '60vw' }} header="Create Property" modal className="p-fluid" onHide={onHide}>
            <Formik
                initialValues={value}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                    setSubmitted(true);
                    setTimeout(() => {
                        setSubmitted(false);
                    }, 5000);
                    const data = {
                        property_type: values?.property_type,
                        property_name: values?.property_name.trim(),
                        domainName: values?.domainName.trim(),
                        propertyEmail: values?.propertyEmail,
                        property_address: values?.property_address,
                        name: values?.name,
                        mobile_number: values?.mobile_number?.toString(),
                        email: values?.email,
                        property_status: values?.property_status,
                        accountHolderName: values?.accountHolderName,
                        bankName: values?.bankName,
                        bankAccountNumber: values?.bankAccountNumber,
                        branchName: values?.branchName,
                        IFSCCode: values?.IFSCCode
                    };
                    if (values?.is_block_exist_in_property === true) data.is_block_exist_in_property = values?.is_block_exist_in_property;
                    if (values?.is_ground_floor_exist_in_property === true) data.is_ground_floor_exist_in_property = values?.is_ground_floor_exist_in_property;
                    if (values?.is_floor_exist_in_property === true && values?.property_type !== 'Society') data.is_floor_exist_in_property = values?.is_floor_exist_in_property;
                    if (values?.is_house_exist_in_property === true && (values?.property_type === 'Society' ? true : values?.is_floor_exist_in_property === false)) data.is_house_exist_in_property = values?.is_house_exist_in_property;
                    if (values?.is_shopping_center_exist_in_property === true) data.is_shopping_center_exist_in_property = values?.is_shopping_center_exist_in_property;
                    if (values?.is_shopping_center_exist_in_property === true && values?.is_block_exist_in_shopping_center_property === true) data.is_block_exist_in_shopping_center_property = values?.is_block_exist_in_shopping_center_property;
                    if (values?.is_shopping_center_exist_in_property === true && values?.is_floor_exist_in_shopping_center_property === true) data.is_floor_exist_in_shopping_center_property = values?.is_floor_exist_in_shopping_center_property;

                    handleSave(data);
                }}
            >
                {({ values, setFieldValue, handleChange, errors, touched }) => (
                    <Form>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="property_type" className="required">
                                    Property Type
                                </label>

                                <Dropdown
                                    id="dropdown"
                                    optionLabel="label"
                                    optionValue="value"
                                    options={[
                                        { label: 'Complex', value: 'Complex' },
                                        { label: 'Flat', value: 'Flat' },
                                        { label: 'Society', value: 'Society' }
                                    ]}
                                    name="property_type"
                                    placeholder="Select Property Type"
                                    type="text"
                                    value={values?.property_type}
                                    // onChange={(e) => setValue({ ...value, property_type: e.target.value, is_block_exist_in_property: true, is_floor_exist_in_property: true, is_house_exist_in_property: true })}\
                                    onChange={(e) => {
                                        setFieldValue('property_type', e.target.value);
                                        setFieldValue('is_block_exist_in_property', true);
                                        setFieldValue('is_floor_exist_in_property', true);
                                        setFieldValue('is_house_exist_in_property', true);
                                        setFieldValue('is_ground_floor_exist_in_property', false);
                                        setFieldValue('is_shopping_center_exist_in_property', false);
                                        setFieldValue('is_block_exist_in_shopping_center_property', false);
                                    }}
                                    className={classNames({ 'p-invalid': errors.property_type && touched.property_type })}
                                />

                                {errors.property_type && touched.property_type ? <small className="p-invalid error">{errors.property_type}</small> : null}
                            </div>
                        </div>
                        {values?.property_type !== '' && (
                            <>
                                <div className="grid p-fluid mt-1">
                                    <div className="field col-12 md:col-4 mb-1">
                                        <label className="required">Block</label>
                                        <div className="flex flex-wrap gap-3 ">
                                            <div className="flex align-items-center">
                                                <RadioButton
                                                    inputId="block1"
                                                    name="is_block_exist_in_property"
                                                    value="yes"
                                                    onChange={(e) => {
                                                        setFieldValue('is_block_exist_in_property', true);
                                                    }}
                                                    checked={values?.is_block_exist_in_property === true}
                                                />
                                                <label htmlFor="block1" className="ml-2">
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="flex align-items-center">
                                                <RadioButton
                                                    inputId="block2"
                                                    name="is_block_exist_in_property"
                                                    value="no"
                                                    onChange={(e) => {
                                                        setFieldValue('is_block_exist_in_property', false);
                                                        setFieldValue('is_block_exist_in_shopping_center_property', false);
                                                    }}
                                                    checked={values?.is_block_exist_in_property === false}
                                                />
                                                <label htmlFor="block2" className="ml-2">
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {values?.property_type !== 'Society' && (
                                        <div className="field col-12 md:col-4 mb-1">
                                            <label className="required">Floor</label>
                                            <div className="flex flex-wrap gap-3 ">
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="floor1"
                                                        name="is_floor_exist_in_property"
                                                        value="yes"
                                                        onChange={(e) => {
                                                            setFieldValue('is_floor_exist_in_property', true);
                                                        }}
                                                        checked={values?.is_floor_exist_in_property === true}
                                                    />
                                                    <label htmlFor="floor1" className="ml-2">
                                                        Yes
                                                    </label>
                                                </div>
                                                {/* <div className="flex align-items-center">
                                    <RadioButton inputId="floor2" name="is_floor_exist_in_property" value="no" onChange={(e) => setValue({ ...value, is_floor_exist_in_property: false })} checked={value?.is_floor_exist_in_property === false} />
                                    <label htmlFor="floor2" className="ml-2">
                                        No
                                    </label>
                                </div> */}
                                            </div>
                                        </div>
                                    )}
                                    {(values?.is_floor_exist_in_property === false || value?.property_type === 'Society') && (
                                        <div className="field col-12 md:col-4 mb-1">
                                            <label className="required">House</label>
                                            <div className="flex flex-wrap gap-3 ">
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="house1"
                                                        name="is_house_exist_in_property"
                                                        value="yes"
                                                        onChange={(e) => {
                                                            setFieldValue('is_house_exist_in_property', true);
                                                        }}
                                                        checked={values?.is_house_exist_in_property === true}
                                                    />
                                                    <label htmlFor="house1" className="ml-2">
                                                        Yes
                                                    </label>
                                                </div>
                                                {/* <div className="flex align-items-center">
                                    <RadioButton inputId="house2" name="is_house_exist_in_property" value="no" onChange={(e) => setValue({ ...value, is_house_exist_in_property: false })} checked={value?.is_house_exist_in_property === false} />
                                    <label htmlFor="house2" className="ml-2">
                                        No
                                    </label>
                                </div> */}
                                            </div>
                                        </div>
                                    )}
                                    {values?.property_type === 'Complex' && (
                                        <div className="field col-12 md:col-4 mb-1">
                                            <label className="required">Ground Floor Availability </label>
                                            <div className="flex flex-wrap gap-3 ">
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="ground1"
                                                        name="is_ground_floor_exist_in_property"
                                                        value="yes"
                                                        onChange={(e) => {
                                                            setFieldValue('is_ground_floor_exist_in_property', true);
                                                        }}
                                                        checked={values?.is_ground_floor_exist_in_property === true}
                                                    />
                                                    <label htmlFor="ground1" className="ml-2">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="ground2"
                                                        name="is_ground_floor_exist_in_property"
                                                        value="no"
                                                        onChange={(e) => {
                                                            setFieldValue('is_ground_floor_exist_in_property', false);
                                                        }}
                                                        checked={values?.is_ground_floor_exist_in_property === false}
                                                    />
                                                    <label htmlFor="ground2" className="ml-2">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {values?.property_type === 'Flat' && (
                                        <div className="field col-12 md:col-4 mb-1">
                                            <label className="required">Shopping Center Availability</label>
                                            <div className="flex flex-wrap gap-3 ">
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="Shopping1"
                                                        name="is_shopping_center_exist_in_property"
                                                        value="yes"
                                                        onChange={(e) => {
                                                            setFieldValue('is_shopping_center_exist_in_property', true);
                                                        }}
                                                        checked={values?.is_shopping_center_exist_in_property === true}
                                                    />
                                                    <label htmlFor="Shopping1" className="ml-2">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="Shopping2"
                                                        name="is_shopping_center_exist_in_property"
                                                        value="no"
                                                        onChange={(e) => {
                                                            setFieldValue('is_shopping_center_exist_in_property', false);
                                                            setFieldValue('is_block_exist_in_shopping_center_property', false);
                                                        }}
                                                        checked={values?.is_shopping_center_exist_in_property === false}
                                                    />
                                                    <label htmlFor="Shopping2" className="ml-2">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {values?.is_shopping_center_exist_in_property === true && values?.is_block_exist_in_property === true && (
                                    <div className="grid p-fluid mt-1 mt-4">
                                        <div className="field col-12 md:col-4 mb-1">
                                            <label className="required">Is there a block in shopping center?</label>
                                            <div className="flex flex-wrap gap-3 ">
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="ShoppingBlock1"
                                                        name="is_block_exist_in_shopping_center_property"
                                                        value="yes"
                                                        onChange={(e) => {
                                                            setFieldValue('is_block_exist_in_shopping_center_property', true);
                                                        }}
                                                        checked={values?.is_block_exist_in_shopping_center_property === true}
                                                    />
                                                    <label htmlFor="ShoppingBlock1" className="ml-2">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId="ShoppingBlock2"
                                                        name="is_block_exist_in_shopping_center_property"
                                                        value="no"
                                                        onChange={(e) => {
                                                            setFieldValue('is_block_exist_in_shopping_center_property', false);
                                                        }}
                                                        checked={values?.is_block_exist_in_shopping_center_property === false}
                                                    />
                                                    <label htmlFor="ShoppingBlock2" className="ml-2">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {values?.property_type !== '' && (
                            <>
                                <Divider align="center" className=" pt-0">
                                    <span className="p-tag">Property Details</span>
                                </Divider>
                                <div className="grid p-fluid mt-1">
                                    <div className="field col-12 md:col-4 mb-1">
                                        <label htmlFor="property_name" className="required">
                                            Property Name
                                        </label>
                                        <InputText
                                            id="property_name"
                                            name="property_name"
                                            placeholder="Enter Property Name"
                                            type="text"
                                            value={values?.property_name}
                                            onChange={handleChange}
                                            className={classNames({ 'p-invalid': errors.property_name && touched.property_name })}
                                        />
                                        {errors.property_name && touched.property_name ? <small className="p-invalid error">{'Please enter property name'}</small> : null}
                                    </div>

                                    <div className="field col-12 md:col-4 mb-1">
                                        <label htmlFor="domainName" className="required">
                                            Domain Name
                                        </label>
                                        <InputText
                                            id="domainName"
                                            name="domainName"
                                            placeholder="Enter Domain Name"
                                            type="text"
                                            value={values?.domainName}
                                            onChange={handleChange}
                                            className={classNames({ 'p-invalid': errors.domainName && touched.domainName })}
                                        />
                                        {errors.domainName && touched.domainName ? <small className="p-invalid error">{'Please enter domain name'}</small> : null}
                                    </div>

                                    <div className="field col-12 md:col-4 mb-1">
                                        <label htmlFor="propertyEmail" className="required">
                                            Property Email
                                        </label>
                                        <InputText
                                            id="propertyEmail"
                                            name="propertyEmail"
                                            placeholder="Enter Property Name"
                                            type="text"
                                            value={values?.propertyEmail}
                                            onChange={handleChange}
                                            className={classNames({ 'p-invalid': errors.propertyEmail && touched.propertyEmail })}
                                        />
                                        {errors.propertyEmail && touched.propertyEmail ? <small className="p-invalid error">{'Please enter property Email'}</small> : null}
                                    </div>

                                    <div className="field col-12 md:col-6 mb-1">
                                        <label htmlFor="property_status" className="required">
                                            Property Status
                                        </label>

                                        <Dropdown
                                            id="dropdown"
                                            optionLabel="label"
                                            optionValue="value"
                                            options={statusTag}
                                            name="property_status"
                                            placeholder="Select Complex Status"
                                            type="text"
                                            value={values?.property_status}
                                            onChange={(e) => {
                                                setFieldValue('property_status', e.target.value);
                                            }}
                                            className={classNames({ 'p-invalid': errors.property_status && touched.property_status })}
                                        />

                                        {errors.property_status && touched.property_status ? <small className="p-invalid error">{errors?.property_status}</small> : null}
                                    </div>
                                    <div className="field col-12 md:col-12 mb-1">
                                        <label htmlFor="property_address" className="required">
                                            Property Address
                                        </label>

                                        <InputTextarea
                                            rows="2"
                                            cols="20"
                                            autoResize
                                            id="property_address"
                                            name="property_address"
                                            placeholder="Enter Property Address"
                                            type="text"
                                            value={values?.property_address}
                                            onChange={handleChange}
                                            className={classNames({ 'p-invalid': errors.property_address && touched.property_address })}
                                        />

                                        {errors.property_address && touched.property_address ? <small className="p-invalid error">{'Please enter property address'}</small> : null}
                                    </div>
                                </div>
                                <Divider align="center" className=" pt-0">
                                    <span className="p-tag">Property Admin Details</span>
                                </Divider>
                                <div className="grid p-fluid mt-1">
                                    <div className="field col-12 md:col-6 mb-1">
                                        <label htmlFor="name" className="required">
                                            Name
                                        </label>

                                        <InputText id="name" name="name" placeholder="Enter Name" type="text" value={values?.name} onChange={handleChange} className={classNames({ 'p-invalid': errors.name && touched.name })} />

                                        {errors.name && touched.name ? <small className="p-invalid error">{'Please enter name'}</small> : null}
                                    </div>
                                    <div className="field col-12 md:col-6 mb-1">
                                        <label htmlFor="email" className="required">
                                            E-Mail
                                        </label>
                                        <InputText id="email" placeholder="Enter Email" value={values?.email} onChange={handleChange} className={classNames({ 'p-invalid': errors.email && touched.email })} />

                                        {errors.email && touched.email ? <small className="p-invalid error">{errors?.email}</small> : null}
                                    </div>

                                    <div className="field col-12 md:col-6 mb-1">
                                        <label htmlFor="mobile_number" className="required">
                                            Mobile Number
                                        </label>
                                        <InputNumber
                                            id="mobile_number"
                                            type="tel"
                                            placeholder="Enter Mobile Number"
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
                                </div>
                            </>
                        )}
                        <Divider align="center" className=" pt-0">
                            <span className="p-tag text-base">Bank Details</span>
                        </Divider>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="bankName" className="required">
                                    Bank Name
                                </label>
                                <InputText id="bankName" name="bankName" placeholder="Enter bank Name" type="text" value={values?.bankName} onChange={handleChange} className={classNames({ 'p-invalid': errors.bankName && touched.bankName })} />
                                {errors.bankName && touched.bankName ? <small className="p-invalid error">{'Please enter bank Name'}</small> : null}
                            </div>

                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="accountHolderName" className="required">
                                    Account Holder Name
                                </label>
                                <InputText
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    placeholder="Enter Account Holder Name"
                                    type="text"
                                    value={values?.accountHolderName}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.accountHolderName && touched.accountHolderName })}
                                />
                                {errors.accountHolderName && touched.accountHolderName ? <small className="p-invalid error">{'Please enter Account Holder Name'}</small> : null}
                            </div>

                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="branchName" className="required">
                                    Branch Name
                                </label>
                                <InputText
                                    id="branchName"
                                    name="branchName"
                                    placeholder="Enter Branch Name"
                                    type="text"
                                    value={values?.branchName}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.branchName && touched.branchName })}
                                />
                                {errors.branchName && touched.branchName ? <small className="p-invalid error">{'Please enter Branch Name'}</small> : null}
                            </div>

                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="bankAccountNumber" className="required">
                                    Account Number
                                </label>
                                <InputText
                                    id="bankAccountNumber"
                                    name="bankAccountNumber"
                                    placeholder="Enter Account Number"
                                    type="text"
                                    value={values?.bankAccountNumber}
                                    onChange={handleChange}
                                    className={classNames({ 'p-invalid': errors.bankAccountNumber && touched.bankAccountNumber })}
                                />
                                {errors.bankAccountNumber && touched.bankAccountNumber ? <small className="p-invalid error">{'Please enter Account Number'}</small> : null}
                            </div>

                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="IFSCCode" className="required">
                                    IFSC Code
                                </label>
                                <InputText id="IFSCCode" name="IFSCCode" placeholder="Enter IFSC Code" type="text" value={values?.IFSCCode} onChange={handleChange} className={classNames({ 'p-invalid': errors.IFSCCode && touched.IFSCCode })} />
                                {errors.IFSCCode && touched.IFSCCode ? <small className="p-invalid error">{'Please enter IFSC Code'}</small> : null}
                            </div>
                        </div>

                        {values?.property_type !== '' && (
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
                        )}
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
export default CreatePropertyModel;
