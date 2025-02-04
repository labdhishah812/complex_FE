import { Form, Formik } from "formik";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import components from "../..";
import Loader from "../../../../components/Loader";
import { AutoComplete } from "primereact/autocomplete";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaPercent } from "react-icons/fa";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  fdCreateRequest,
  getfdDataById,
  updateFdRequest,
} from "../../../../redux/slice/AdminSlices/fdSlice";

const FixDepositCreate = () => {
  const {
    DataTable,
    Column,
    BreadCrumb,
    InputNumber,
    Calendar,
    Button,
    InputText,
    RadioButton,
    Image,
    classNames,
    useDispatch,
    useState,
    useEffect,
    useSelector,
    useNavigate,
  } = components;
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
  const { isCreated, fdDataById, isLoading } = useSelector((state) => state.fd);
  const { token, loginDetails } = useSelector((store) => store.auth);
  const [submitted, setSubmitted] = useState(false);
  const [showFile, setShowFile] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [formValue, setFormValue] = useState({
    id: "",
    term: "",
    value_date: "",
    maturity_date: "",
    interest: "",
    principle_amt: "",
    ac_no: "",
    bank_name: "",
    branch_name: "",
    receipt_image: null,
    fileBase64: null,
  });
  const [fdCollection, setFdCollection] = useState([]);
  const SignupSchema = Yup.object().shape({
    // term: Yup.string().trim().nullable().required('Please enter term.'),
    value_date: Yup.string()
      .trim()
      .nullable()
      .required("Please select value date"),
    maturity_date: Yup.string()
      .trim()
      .nullable()
      .required("Please select maturity date"),
    interest: Yup.number()
      .typeError("Interest must be a number")
      .required("Please enter interest.")
      .positive("Account number must be a positive number"),
    principle_amt: Yup.number()
      .typeError("Principle amount must be a number")
      .required("Please enter principle amount.")
      .positive("Principle amount must be a positive number"),
    ac_no: Yup.string()
      .trim()
      .nullable()
      .required("Please enter bank account number."),
    bank_name: Yup.string()
      .trim()
      .nullable()
      .required("Please enter bank name."),
    branch_name: Yup.string()
      .trim()
      .nullable()
      .required("Please enter branch name."),
  });

  const breadcrumbItems = [
    {
      label: params.id ? "Edit Fix Deposit" : "Add Fix Deposit",
    },
  ];
  const breadcrumbHome = {
    label: "Fix Deposit",
    command: () => {
      navigate("/property-management/fixdeposit");
    },
  };
  useEffect(() => {
    if (params.id) {
      dispatch(getfdDataById(params.id));
    }
  }, [params.id]);
  useEffect(() => {
    if (isCreated) {
      navigate("/property-management/fixdeposit");
    }
  }, [isCreated]);
  const editeDate = (dateStr) => {
    try {
      // let [year, month, day] = val.split('T')[0].split("-").map(Number);
      // const dateObj = new Date(year, month - 1, day);
      // re
      const date = new Date(dateStr);
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      return formattedDate;
    } catch (error) {}
  };
  useEffect(() => {
    if (params.id && fdDataById && fdDataById?._id) {
      let setData = {
        id: fdDataById?._id,
        // term: fdDataById?.term,
        ac_no: fdDataById?.ac_no,
        bank_name: fdDataById?.bank_name,
        branch_name: fdDataById?.branch_name,
        interest: fdDataById?.interest,
        maturity_date: editeDate(fdDataById?.maturity_date),
        value_date: editeDate(fdDataById?.value_date),
        principle_amt: fdDataById?.principle_amt,
        receipt_image: fdDataById?.receipt_image
          ? fdDataById?.receipt_image
          : null,
        fileBase64: "",
      };
      fdDataById?.receipt_image &&
        setShowFile(`${BASE_URL_API}fixeddeposit/${fdDataById?.receipt_image}`);
      setFormValue(setData);
    }
  }, [fdDataById]);

  const handleUpload = async (event, setFieldValue) => {
    try {
      const str = event.target.files[0]?.name;
      const substr = [".jpg", ".jpeg", ".png"];
      let flag = false;
      substr.forEach((a) => {
        if (str.includes(a)) {
          flag = true;
        }
      });
      if (flag) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function async(ev) {
          const base64String = ev.target.result;
          setFieldValue("fileBase64", base64String);
        };
        setFieldValue("receipt_image", event.target.files[0]);
        setShowFile(URL.createObjectURL(event.target.files[0]));
      } else {
        toast.error("Only accepts .png, .jpg, and .jpeg files.", {
          style: {
            marginTop: "4rem",
          },
        });
      }
    } catch (error) {}
  };
  const setDefaultDate = (val) => {
    try {
      const inputDateString = val;
      const [day, month, year] = inputDateString.split("/").map(Number);
      const dateObj = new Date(year, month - 1, day);
      const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
      const localTime = dateObj.getTime() - timezoneOffset;
      const indiaOffset = 330 * 60000;
      const indiaTime = localTime + indiaOffset;
      const indiaDate = new Date(indiaTime);
      return new Date(indiaDate.toString());
    } catch (error) {}
  };

  const actionBodyTemplate = (rowData, index) => {
    return (
      <div className="actions flex justify-content-center">
        <Button
          tooltip="Edit"
          tooltipOptions={{ position: "bottom" }}
          icon="pi pi-pencil"
          id="edits-icons"
          className="p-button-rounded p-button-text  p-button-help"
          onClick={() => {
            let setData = {
              id: index.rowIndex,
              // term: rowData?.term,
              value_date: rowData?.value_date,
              maturity_date: rowData?.maturity_date,
              interest: rowData?.interest,
              principle_amt: rowData?.principle_amt,
              ac_no: rowData?.ac_no,
              bank_name: rowData?.bank_name,
              branch_name: rowData?.branch_name,
              receipt_image: rowData?.receipt_image
                ? rowData?.receipt_image
                : null,
              fileBase64: rowData?.fileBase64 ? rowData?.fileBase64 : null,
            };
            rowData?.receipt_image && setShowFile(`${rowData?.showFile}`);
            setFormValue(setData);
          }}
        />

        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text  p-button-danger"
          id="delete-icons"
          tooltip="Delete"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => {
            let collection = [...fdCollection];
            collection.splice(index.rowIndex, 1);
            setFdCollection(collection);
            setShowFile(null);
            let def = {
              // term: '',
              value_date: "",
              maturity_date: "",
              interest: "",
              principle_amt: "",
              ac_no: "",
              bank_name: "",
              branch_name: "",
              receipt_image: null,
              fileBase64: null,
            };
            setFormValue(def);
          }}
        />
      </div>
    );
  };
  const search = (event) => {
    const allWork = [
      "Ahmedabad District Cooperative Bank (Ahmedabad DCCB)",
      "Ahmednagar District Central Cooperative Bank (Ahmednagar DCCB)",
      "Akola District Central Cooperative Bank (Akola DCCB)",
      "Allahabad Bank",
      "Andhra Bank",
      "Andhra Pradesh State Cooperative Bank (APCOB)",
      "Axis Bank",
      "Bandan Bank",
      "Bank of Bahrain and Kuwait",
      "Bank of Baroda",
      "Bank of India",
      "Bank of Maharashtra",
      "Bassein Catholic Co-operative Bank",
      "Bhartiya Mahila Bank",
      "BNP Paribas",
      "Canara Bank",
      "Catholic Syrian Bank",
      "Central Bank of India",
      "City Union Bank",
      "Corporation bank",
      "Cosmos Bank",
      "DCB BANK Personal",
      "Deustche Bank",
      "Development Credit Bank",
      "Dena Bank",
      "Dhanlaxmi Bank",
      "District Cooperative Banks in various districts",
      "Federal Bank",
      "HDFC Bank",
      "ICICI Bank",
      "IDBI Bank",
      "Indian Bank",
      "Indian Overseas NetBanking",
      "Indusind Bank",
      "ING Vysya Bank",
      "J and K Bank",
      "Janta Sahakari Bank",
      "Jamnagar District Cooperative Bank (Jamnagar DCCB)",
      "Jalgaon District Central Cooperative Bank (Jalgaon DCCB)",
      "Junagadh District Cooperative Bank (Junagadh DCCB)",
      "Karnataka Bank",
      "Karur Vysya Bank",
      "Kerala State Cooperative Bank (KSCB)",
      "Kotak Mahindra Bank",
      "KSC Apex Bank",
      "Lakshmi Vilas Bank",
      "Mehsana Urban Co-op Bank",
      "Mumbai District Central Cooperative Bank (Mumbai DCCB)",
      "Nagpur District Central Cooperative Bank (Nagpur DCCB)",
      "Nanded District Central Cooperative Bank (Nanded DCCB)",
      "NKGSB Co-operative Bank",
      "Oriental Bank Of Commerce",
      "Punjab & Sind Bank",
      "Punjab and Maharashtra Cooperative Bank",
      "Punjab National Bank",
      "PSCB",
      "Rajasthan State Cooperative Bank (RSCB)",
      "Ratnakar Bank Limited",
      "RBL Bank",
      "Rajkot District Cooperative Bank (Rajkot DCCB)",
      "Shamrao Vithal Cooperative Bank",
      "South Indian Bank",
      "Standard Chartered Bank",
      "State Bank Of Bikaner and Jaipur",
      "State Bank of Hyderabad",
      "State Bank of India",
      "State Bank of Mysore",
      "State Bank of Patiala",
      "State Bank of Travancore",
      "Saraswat Cooperative Bank",
      "SVC Bank",
      "Surat District Cooperative Bank (Surat DCCB)",
      "Syndicate Bank",
      "Tamil Nadu State Apex Cooperative Bank (TNSC Bank)",
      "Tamilnad Mercantile Bank",
      "Tamilnadu Cooperative Bank",
      "Telangana State Cooperative Apex Bank (TSCAB)",
      "The Kalyan Janata Sahakari Bank",
      "The Royal Bank of Scotland",
      "Thane District Central Cooperative Bank (Thane DCCB)",
      "TJSB Bank (Erstwhile Thane Janata Sahakari Bank)",
      "UCO Bank",
      "Union Bank of India",
      "United Bank Of India",
      "Vadodara District Cooperative Bank (Vadodara DCCB)",
      "Vijaya Bank",
      "WBSCB",
      "West Bengal State Cooperative Bank (WBSCB)",
      "Yes Bank",
    ];
    let allWork2 = allWork.map((bank) => ({ name: bank }));
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredCountries;

      if (!event.query.trim().length) {
        _filteredCountries = [...allWork2];
      } else {
        _filteredCountries = allWork2.filter((country) => {
          return country.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredCountries(_filteredCountries);
    }, 250);
  };
  const convertDate = (dateStr) => {
    try {
      const formattedDate = moment(dateStr, "DD/MM/YYYY").format("D MMM YYYY");
      return formattedDate;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="relative min-h-full">
        <Loader isLoading={isLoading} />
        <div className="flex justify-content-between align-items-center">
          <div className="flex flex-row w-full">
            <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">
              {params.id ? "Edit Fix Deposit" : "Add Fix Deposit"}
            </h5>
            <BreadCrumb
              model={breadcrumbItems}
              home={breadcrumbHome}
              className="layout-breadcrumb p-pl-3 p-py-2 ml-auto"
            />
          </div>
        </div>
        <div className="crud-demo ml-0 mr-0 card mt-3">
          {params.id ? (
            <>
              <Formik
                initialValues={formValue}
                validationSchema={SignupSchema}
                enableReinitialize
                onSubmit={(values) => {
                  setSubmitted(true);
                  setTimeout(() => {
                    setSubmitted(false);
                  }, 5000);

                  let sendData = {
                    // term: values?.term,
                    term: "1",
                    value_date: values?.value_date,
                    maturity_date: values?.maturity_date,
                    interest: values?.interest,
                    principle_amt: values?.principle_amt,
                    ac_no: values?.ac_no,
                    bank_name: values?.bank_name,
                    branch_name: values?.branch_name,
                    receipt_image:
                      values?.receipt_image !== null
                        ? values?.receipt_image
                        : "",
                  };
                  values.id !== "" &&
                    dispatch(updateFdRequest(values.id, sendData));
                }}
              >
                {({
                  values,
                  setFieldValue,
                  handleChange,
                  handleReset,
                  errors,
                  touched,
                }) => (
                  <Form>
                    <div className="grid p-fluid mt-1">
                      {/* <div className="field col-12 md:col-3 mb-1">
                                                <label htmlFor="term" className="required">
                                                    Term (In Year)
                                                </label>
                                                <InputText id="term" name="term" placeholder="Enter Term" type="text" value={values?.term} onChange={handleChange} className={classNames({ 'p-invalid': errors.term && touched.term })} />
                                                {errors.term && touched.term ? <small className="p-invalid error">{errors.term}</small> : null}
                                            </div> */}
                      <div className="field col-12 md:col-3 mb-0">
                        <label htmlFor="value_date" className="required">
                          Value Date
                        </label>
                        <Calendar
                          id="value_date"
                          name="value_date"
                          // minDate={new Date()}
                          placeholder="Please Value Date"
                          value={
                            values?.value_date !== ""
                              ? setDefaultDate(values?.value_date)
                              : ""
                          }
                          dateFormat="dd/mm/yy"
                          onChange={(e) => {
                            const dateString = new Date(e.target.value);
                            const day = dateString.getDate();
                            const month = dateString.getMonth() + 1;
                            const year = dateString.getFullYear();
                            const formattedDate = `${
                              day < 10 ? "0" + day : day
                            }/${month < 10 ? "0" + month : month}/${year}`;
                            setFieldValue("value_date", formattedDate);
                          }}
                          className={classNames({
                            "p-invalid":
                              errors.value_date && touched.value_date,
                          })}
                        />
                        <div
                          className="p-invalid error text-xs"
                          style={{ minHeight: "1.1rem", marginTop: "3px" }}
                        >
                          {errors.value_date && touched.value_date
                            ? errors?.value_date
                            : ""}
                        </div>
                      </div>
                      <div className="field col-12 md:col-3 mb-0">
                        <label htmlFor="maturity_date" className="required">
                          Maturity Date
                        </label>
                        <Calendar
                          id="maturity_date"
                          name="maturity_date"
                          // minDate={new Date()}
                          placeholder="Please Maturity Date"
                          value={
                            values?.maturity_date !== ""
                              ? setDefaultDate(values?.maturity_date)
                              : ""
                          }
                          dateFormat="dd/mm/yy"
                          onChange={(e) => {
                            const dateString = new Date(e.target.value);
                            const day = dateString.getDate();
                            const month = dateString.getMonth() + 1;
                            const year = dateString.getFullYear();
                            const formattedDate = `${
                              day < 10 ? "0" + day : day
                            }/${month < 10 ? "0" + month : month}/${year}`;
                            setFieldValue("maturity_date", formattedDate);
                          }}
                          className={classNames({
                            "p-invalid":
                              errors.maturity_date && touched.maturity_date,
                          })}
                        />
                        <div
                          className="p-invalid error text-xs"
                          style={{ minHeight: "1.1rem", marginTop: "3px" }}
                        >
                          {errors.maturity_date && touched.maturity_date
                            ? errors?.maturity_date
                            : ""}
                        </div>
                      </div>
                      <div className="field col-12 md:col-3 mb-1">
                        <label htmlFor="interest" className="required">
                          Interest (%)
                        </label>
                        <span className="p-input-icon-right">
                          <InputNumber
                            id="interest"
                            name="interest"
                            placeholder="Enter Interest"
                            type="tel"
                            value={values?.interest}
                            useGrouping={false}
                            onValueChange={(e) => {
                              if (e.target.value <= 100) {
                                setFieldValue("interest", e.target.value);
                              }
                            }}
                            className={classNames(
                              {
                                "p-invalid":
                                  errors.interest && touched.interest,
                              },
                              "percentageUi"
                            )}
                          />
                          <FaPercent />
                        </span>
                        <div
                          className="p-invalid error text-xs"
                          style={{ minHeight: "1.1rem", marginTop: "3px" }}
                        >
                          {errors.interest && touched.interest
                            ? errors.interest
                            : ""}
                        </div>
                      </div>
                      <div className="field col-12 md:col-3 mb-1">
                        <label htmlFor="principle_amt" className="required">
                          Principle Amount
                        </label>
                        <span className="p-input-icon-left">
                          <BsCurrencyRupee />
                          <InputNumber
                            id="principle_amt"
                            name="principle_amt"
                            placeholder="Enter Principle Amount"
                            type="tel"
                            value={values?.principle_amt}
                            useGrouping={false}
                            onValueChange={handleChange}
                            className={classNames(
                              {
                                "p-invalid":
                                  errors.principle_amt && touched.principle_amt,
                              },
                              "inputRupee"
                            )}
                          />
                        </span>
                        <div
                          className="p-invalid error text-xs"
                          style={{ minHeight: "1.1rem", marginTop: "3px" }}
                        >
                          {errors.principle_amt && touched.principle_amt
                            ? errors.principle_amt
                            : ""}
                        </div>
                      </div>
                      <div className="field col-12 md:col-3 mb-1">
                        <label htmlFor="ac_no" className="required">
                          Account Noooooooo.
                        </label>
                        <InputText
                          id="ac_no"
                          name="ac_no"
                          placeholder="Enter Account No."
                          type="text" // Keep this as text type
                          value={values?.ac_no}
                          maxLength={18}
                          onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, "");
                            handleChange({
                              target: {
                                name: "ac_no",
                                value: value,
                              },
                            });
                          }}
                          onKeyPress={(e) => {
                            // Prevent non-numeric input
                            if (!/[\d]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          className={classNames({
                            "p-invalid": errors.ac_no && touched.ac_no,
                          })}
                        />
                        <div
                          className="p-invalid error text-xs"
                          style={{ minHeight: "1.1rem", marginTop: "3px" }}
                        >
                          {errors.ac_no && touched.ac_no ? errors.ac_no : ""}
                        </div>
                      </div>
                      <div className="field col-12 md:col-3 mb-1">
                        <label htmlFor="bank_name" className="required">
                          Bank Name
                        </label>
                        {/* <InputText
                                                    id="bank_name"
                                                    name="bank_name"
                                                    placeholder="Enter Bank Name"
                                                    type="text"
                                                    value={values?.bank_name}
                                                    onChange={handleChange}
                                                    className={classNames({ 'p-invalid': errors.bank_name && touched.bank_name })}
                                                /> */}
                        <AutoComplete
                          id="bank_name"
                          name="bank_name"
                          field="name"
                          placeholder="Enter Vendor Work Type"
                          value={values?.bank_name}
                          suggestions={filteredCountries}
                          completeMethod={search}
                          className={classNames({
                            "p-invalid": errors.bank_name && touched.bank_name,
                          })}
                          onChange={(e) => {
                            let check = typeof e.value === "object";
                            setFieldValue(
                              "bank_name",
                              check ? e?.value?.name : e.value
                            );
                          }}
                        />
                        <div
                          className="p-invalid error text-xs"
                          style={{ minHeight: "1.1rem", marginTop: "3px" }}
                        >
                          {errors.bank_name && touched.bank_name
                            ? errors.bank_name
                            : ""}
                        </div>
                      </div>
                      <div className="field col-12 md:col-3 mb-1">
                        <label htmlFor="branch_name" className="required">
                          Branch Name
                        </label>
                        <InputText
                          id="branch_name"
                          name="branch_name"
                          placeholder="Enter Branch Name"
                          type="text"
                          value={values?.branch_name}
                          onChange={handleChange}
                          className={classNames({
                            "p-invalid":
                              errors.branch_name && touched.branch_name,
                          })}
                        />
                        <div
                          className="p-invalid error text-xs"
                          style={{ minHeight: "1.1rem", marginTop: "3px" }}
                        >
                          {errors.branch_name && touched.branch_name
                            ? errors.branch_name
                            : ""}
                        </div>
                      </div>
                      <div
                        className={
                          "field col-10 lg:col-3 md:col-3 mb-0 pt-5" +
                          (values?.receipt_image !== null
                            ? "flex align-items-center"
                            : "")
                        }
                      >
                        {values?.receipt_image === null && (
                          <div className="file-input-upload">
                            <input
                              type="file"
                              id="fileInput"
                              accept=".jpg, .jpeg, .png"
                              className="input"
                              onChange={(event) =>
                                handleUpload(event, setFieldValue)
                              }
                            />
                            <label for="fileInput" className="label">
                              <span>Upload Receipt Image</span>
                            </label>
                          </div>
                        )}
                        {values?.receipt_image !== null && (
                          <div
                            className="relative "
                            style={{ width: "100px", height: "100px" }}
                          >
                            <Image
                              alt="Image"
                              src={showFile}
                              width="100"
                              height="100"
                              preview
                            />
                            <div
                              className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                              style={{
                                right: "-11px",
                                top: "-5px",
                                backgroundColor: "#f63939",
                              }}
                              onClick={() => {
                                setFieldValue("receipt_image", null);
                                setShowFile(null);
                              }}
                            >
                              <i
                                className="pi pi-times"
                                style={{ fontSize: "1rem", color: "#fff" }}
                              ></i>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid p-fluid mt-1">
                      <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                        <Button
                          label="Cancel"
                          icon="pi pi-times"
                          className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                          onClick={() =>
                            navigate("/property-management/fixdeposit")
                          }
                        />
                        <Button
                          disabled={submitted}
                          label={values.id === "" ? "Save" : "Update"}
                          type="submit"
                          icon="pi pi-check"
                          className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                        />
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            <Formik
              initialValues={formValue}
              validationSchema={SignupSchema}
              enableReinitialize
              onSubmit={(values, { resetForm }) => {
                let collection = [...fdCollection];
                let sendData = {
                  // term: values?.term,
                  // term: '1',
                  value_date: values?.value_date,
                  maturity_date: values?.maturity_date,
                  interest: values?.interest,
                  principle_amt: values?.principle_amt,
                  ac_no: values?.ac_no,
                  bank_name: values?.bank_name,
                  branch_name: values?.branch_name,
                  receipt_image:
                    values?.receipt_image !== null ? values?.receipt_image : "",
                  showFile: showFile ? showFile : null,
                  fileBase64: values?.fileBase64 ? values?.fileBase64 : null,
                };
                if (values.id !== "") {
                  collection[values.id] = sendData;
                } else {
                  collection.push(sendData);
                }
                setFdCollection(collection);
                resetForm();
                setShowFile(null);
                let def = {
                  id: "",
                  term: "",
                  value_date: "",
                  maturity_date: "",
                  interest: "",
                  principle_amt: "",
                  ac_no: "",
                  bank_name: "",
                  branch_name: "",
                  receipt_image: null,
                  fileBase64: null,
                };
                setFormValue(def);
              }}
            >
              {({
                values,
                setFieldValue,
                handleChange,
                handleReset,
                errors,
                touched,
              }) => (
                <Form>
                  <div className="grid p-fluid mt-1">
                    {/* <div className="field col-12 md:col-3 mb-1">
                                            <label htmlFor="company_name" className="required">
                                                Term (In Year)
                                            </label>
                                            <InputText id="term" name="term" placeholder="Enter term" type="text" value={values?.term} onChange={handleChange} className={classNames({ 'p-invalid': errors.term && touched.term })} />
                                            {errors.term && touched.term ? <small className="p-invalid error">{errors.term}</small> : null}
                                        </div> */}
                    <div className="field col-12 md:col-3 mb-0">
                      <label htmlFor="value_date" className="required">
                        Value Date
                      </label>
                      <Calendar
                        id="value_date"
                        name="value_date"
                        // minDate={new Date()}
                        placeholder="Please Value Date"
                        value={
                          values?.value_date !== ""
                            ? setDefaultDate(values?.value_date)
                            : ""
                        }
                        dateFormat="dd/mm/yy"
                        onChange={(e) => {
                          const dateString = new Date(e.target.value);
                          const day = dateString.getDate();
                          const month = dateString.getMonth() + 1;
                          const year = dateString.getFullYear();
                          const formattedDate = `${
                            day < 10 ? "0" + day : day
                          }/${month < 10 ? "0" + month : month}/${year}`;
                          setFieldValue("value_date", formattedDate);
                        }}
                        className={classNames({
                          "p-invalid": errors.value_date && touched.value_date,
                        })}
                      />
                      <div
                        className="p-invalid error text-xs"
                        style={{ minHeight: "1.1rem", marginTop: "3px" }}
                      >
                        {errors.value_date && touched.value_date
                          ? errors?.value_date
                          : ""}
                      </div>
                    </div>
                    <div className="field col-12 md:col-3 mb-0">
                      <label htmlFor="maturity_date" className="required">
                        Maturity Date
                      </label>
                      <Calendar
                        id="maturity_date"
                        name="maturity_date"
                        // minDate={new Date()}
                        placeholder="Please Maturity Date"
                        value={
                          values?.maturity_date !== ""
                            ? setDefaultDate(values?.maturity_date)
                            : ""
                        }
                        dateFormat="dd/mm/yy"
                        onChange={(e) => {
                          const dateString = new Date(e.target.value);
                          const day = dateString.getDate();
                          const month = dateString.getMonth() + 1;
                          const year = dateString.getFullYear();
                          const formattedDate = `${
                            day < 10 ? "0" + day : day
                          }/${month < 10 ? "0" + month : month}/${year}`;
                          setFieldValue("maturity_date", formattedDate);
                        }}
                        className={classNames({
                          "p-invalid":
                            errors.maturity_date && touched.maturity_date,
                        })}
                      />
                      <div
                        className="p-invalid error text-xs"
                        style={{ minHeight: "1.1rem", marginTop: "3px" }}
                      >
                        {errors.maturity_date && touched.maturity_date
                          ? errors?.maturity_date
                          : ""}
                      </div>
                    </div>
                    <div className="field col-12 md:col-3 mb-1">
                      <label htmlFor="interest" className="required">
                        Interest (%)
                      </label>
                      <span className="p-input-icon-right">
                        <InputNumber
                          id="interest"
                          name="interest"
                          placeholder="Enter Interest"
                          type="tel"
                          value={values?.interest}
                          locale="en-IN"
                          minFractionDigits={2}
                          max={100}
                          useGrouping={false}
                          onValueChange={(e) => {
                            if (e.target.value <= 100) {
                              setFieldValue("interest", e.target.value);
                            }
                          }}
                          className={classNames(
                            {
                              "p-invalid": errors.interest && touched.interest,
                            },
                            "percentageUi"
                          )}
                        />
                        <FaPercent />
                      </span>
                      <div
                        className="p-invalid error text-xs"
                        style={{ minHeight: "1.1rem", marginTop: "3px" }}
                      >
                        {errors.interest && touched.interest
                          ? errors.interest
                          : ""}
                      </div>
                    </div>
                    <div className="field col-12 md:col-3 mb-1">
                      <label htmlFor="principle_amt" className="required">
                        Principle Amount
                      </label>
                      <span className="p-input-icon-left">
                        <BsCurrencyRupee />
                        <InputNumber
                          id="principle_amt"
                          name="principle_amt"
                          placeholder="Enter Principle Amount"
                          type="tel"
                          value={values?.principle_amt}
                          // useGrouping={false}
                          useGrouping={true}
                          mode="decimal"
                          locale="en-IN"
                          onValueChange={handleChange}
                          className={classNames(
                            {
                              "p-invalid":
                                errors.principle_amt && touched.principle_amt,
                            },
                            "inputRupee"
                          )}
                        />
                      </span>
                      <div
                        className="p-invalid error text-xs"
                        style={{ minHeight: "1.1rem", marginTop: "3px" }}
                      >
                        {errors.principle_amt && touched.principle_amt
                          ? errors.principle_amt
                          : ""}
                      </div>
                    </div>
                    <div className="field col-12 md:col-3 mb-1">
                      <label htmlFor="ac_no" className="required">
                        Account No
                      </label>
                      <InputText
                        id="ac_no"
                        name="ac_no"
                        placeholder="Enter Account No."
                        type="text" // Keep this as text type
                        value={values?.ac_no}
                        maxLength={18}
                        onChange={(e) => {
                          // Only allow digits
                          const value = e.target.value.replace(/\D/g, "");
                          handleChange({
                            target: {
                              name: "ac_no",
                              value: value,
                            },
                          });
                        }}
                        onKeyPress={(e) => {
                          // Prevent non-numeric input
                          if (!/[\d]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className={classNames({
                          "p-invalid": errors.ac_no && touched.ac_no,
                        })}
                      />
                      <div
                        className="p-invalid error text-xs"
                        style={{ minHeight: "1.1rem", marginTop: "3px" }}
                      >
                        {errors.ac_no && touched.ac_no ? errors.ac_no : ""}
                      </div>
                    </div>
                    <div className="field col-12 md:col-3 mb-1">
                      <label htmlFor="bank_name" className="required">
                        Bank Name
                      </label>
                      {/* <InputText
                                                id="bank_name"
                                                name="bank_name"
                                                placeholder="Enter Bank Name"
                                                type="text"
                                                value={values?.bank_name}
                                                onChange={handleChange}
                                                className={classNames({ 'p-invalid': errors.bank_name && touched.bank_name })}
                                            /> */}
                      <AutoComplete
                        id="bank_name"
                        name="bank_name"
                        field="name"
                        placeholder="Enter Vendor Work Type"
                        value={values?.bank_name}
                        suggestions={filteredCountries}
                        completeMethod={search}
                        className={classNames({
                          "p-invalid": errors.bank_name && touched.bank_name,
                        })}
                        onChange={(e) => {
                          let check = typeof e.value === "object";
                          setFieldValue(
                            "bank_name",
                            check ? e?.value?.name : e.value
                          );
                        }}
                      />
                      <div
                        className="p-invalid error text-xs"
                        style={{ minHeight: "1.1rem", marginTop: "3px" }}
                      >
                        {errors.bank_name && touched.bank_name
                          ? errors.bank_name
                          : ""}
                      </div>
                    </div>
                    <div className="field col-12 md:col-3 mb-1">
                      <label htmlFor="branch_name" className="required">
                        Branch Name
                      </label>
                      <InputText
                        id="branch_name"
                        name="branch_name"
                        placeholder="Enter Branch Name"
                        type="text"
                        value={values?.branch_name}
                        onChange={handleChange}
                        className={classNames({
                          "p-invalid":
                            errors.branch_name && touched.branch_name,
                        })}
                      />
                      <div
                        className="p-invalid error text-xs"
                        style={{ minHeight: "1.1rem", marginTop: "3px" }}
                      >
                        {errors.branch_name && touched.branch_name
                          ? errors.branch_name
                          : ""}
                      </div>
                    </div>
                    <div
                      className={
                        "field col-10 lg:col-3 md:col-3 mb-0 pt-5" +
                        (values?.receipt_image !== null
                          ? "flex align-items-center"
                          : "")
                      }
                    >
                      {values?.receipt_image === null && (
                        <div className="file-input-upload">
                          <input
                            type="file"
                            id="fileInput"
                            accept=".jpg, .jpeg, .png"
                            className="input"
                            onChange={(event) =>
                              handleUpload(event, setFieldValue)
                            }
                          />
                          <label for="fileInput" className="label">
                            <span>Upload Receipt Image</span>
                          </label>
                        </div>
                      )}
                      {values?.receipt_image !== null && (
                        <div
                          className="relative "
                          style={{ width: "100px", height: "100px" }}
                        >
                          <Image
                            alt="Image"
                            src={showFile}
                            width="100"
                            height="100"
                            preview
                          />
                          <div
                            className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                            style={{
                              right: "-11px",
                              top: "-5px",
                              backgroundColor: "#f63939",
                            }}
                            onClick={() => {
                              setFieldValue("receipt_image", null);
                              setShowFile(null);
                            }}
                          >
                            <i
                              className="pi pi-times"
                              style={{ fontSize: "1rem", color: "#fff" }}
                            ></i>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid p-fluid">
                    <div className="field col-12 mb-0 pt-5 flex justify-content-end">
                      <Button
                        icon="pi pi-times"
                        type="button"
                        label="Clear"
                        className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                        onClick={() => {
                          handleReset();
                          setShowFile(null);
                          setFieldValue("receipt_image", null);
                        }}
                      />
                      {/* <Button label="Cancel" type="button" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate('/property-management/fixdeposit')} /> */}
                      <Button
                        type="submit"
                        icon="pi pi-plus"
                        label="Save & New"
                        className="p-button-outlined p-button-success mr-2 mb-2 w-10rem"
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
          {fdCollection.length > 0 && (
            <div className="">
              <DataTable
                value={fdCollection}
                showGridlines
                stripedRows
                dataKey="id"
                emptyMessage="No Record Found."
                scroll="scroll"
                tableStyle={{ minWidth: "60rem" }}
                size="normal"
              >
                <Column
                  field="showFile"
                  header="Image"
                  body={(rowData) =>
                    rowData?.showFile ? (
                      <Image
                        src={`${rowData?.showFile}`}
                        alt="Image"
                        width="50"
                        height="50"
                        preview
                      />
                    ) : (
                      "-"
                    )
                  }
                  style={{ width: "4rem" }}
                />
                {/* <Column field="term" header="Term" style={{ width: '9rem' }} /> */}
                <Column
                  field="value_date"
                  header="Value Date"
                  body={(rowData) =>
                    rowData.value_date ? convertDate(rowData.value_date) : "-"
                  }
                  style={{ width: "9rem" }}
                />
                <Column
                  field="maturity_date"
                  header="Maturity Date"
                  body={(rowData) =>
                    rowData.maturity_date
                      ? convertDate(rowData.maturity_date)
                      : "-"
                  }
                  style={{ width: "9rem" }}
                />
                <Column
                  field="interest"
                  className="headerCellEnd"
                  header="Interest(%)"
                  body={(rowData) => (
                    <div className="text-right">{rowData?.interest}</div>
                  )}
                  style={{ width: "9rem" }}
                />
                <Column
                  field="principle_amt"
                  className="headerCellEnd"
                  header="Principle Amount(₹)"
                  body={(rowData) => (
                    <div className="text-right">
                      {new Intl.NumberFormat("en-IN").format(
                        rowData?.principle_amt
                      )}
                    </div>
                  )}
                  style={{ width: "9rem" }}
                />
                <Column
                  field="ac_no"
                  className="headerCellEnd"
                  header="Account No"
                  body={(rowData) => (
                    <div className="text-right">{rowData?.ac_no}</div>
                  )}
                  style={{ width: "9rem" }}
                />
                <Column
                  field="bank_name"
                  header="Bank Name"
                  style={{ width: "9rem" }}
                />
                <Column
                  field="branch_name"
                  header="Branch Name"
                  style={{ width: "9rem" }}
                />
                <Column
                  field=""
                  header="Actions"
                  headerStyle={{ width: "3%", minWidth: "6rem" }}
                  body={actionBodyTemplate}
                />
              </DataTable>
            </div>
          )}
          {fdCollection.length > 0 && (
            <div className="grid p-fluid mt-1">
              <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                  onClick={() => navigate("/property-management/fixdeposit")}
                />
                <Button
                  disabled={submitted}
                  label="Save"
                  icon="pi pi-check"
                  className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                  onClick={() => {
                    let fdColl = [];
                    fdCollection.forEach((a) => {
                      fdColl.push({
                        term: a?.term,
                        value_date: a?.value_date,
                        maturity_date: a?.maturity_date,
                        interest: a?.interest,
                        principle_amt: a?.principle_amt,
                        ac_no: a?.ac_no,
                        bank_name: a?.bank_name,
                        branch_name: a?.branch_name,
                        receipt_image:
                          a?.fileBase64 !== null ? a?.fileBase64 : "",
                      });
                    });
                    dispatch(fdCreateRequest(fdColl));
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default FixDepositCreate;
