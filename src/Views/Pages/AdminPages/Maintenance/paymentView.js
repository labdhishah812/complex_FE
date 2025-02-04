import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import components from '../..';
import moment from 'moment-timezone';
import Loader from '../../../../components/Loader';
import { getPaymentDetailRequest } from '../../../../redux/slice/AdminSlices/maintenanceSlice';

const PaymentView = () => {
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const { BreadCrumb, Image, Button, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { isLoading, paymentDetailByID } = useSelector((state) => state.maintenance);
    const { token, loginDetails } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [isPdfLoding, setIsPdfLoading] = useState(false);
    useEffect(() => {
        if (params.id) {
            dispatch(getPaymentDetailRequest(params.id))
        }
    }, [params.id]);
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Maintenance',
        command: () => {
            navigate('/property-management/maintenancelist');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Payment Details'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const downloadFile = async (val, name, dowName) => {
        try {
            if (val) {
                const response = await axios.get(`${dowName ? "" : process.env.REACT_APP_COMON_UPLOAD_BASE}${dowName ? "" : name + ""}${val}`, {
                    responseType: 'blob'
                })
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', dowName ? dowName : val)
                document.body.appendChild(link)
                link.click()
            } else {
                toast.error(`Don't have agreement file`, {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    };
    const downloadPdfCall = async (val) => {
        try {
            if (val) {
                setIsPdfLoading(true);
                axios({
                    url: `${BASE_URL_API}/maintenance/maitenance_bill/receipt`,
                    method: 'POST', // Change to POST
                    responseType: 'blob', // Important to handle binary data
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        Authorization: token
                    },
                    data: {
                        maintainance_id: val
                    }
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Inc-${paymentDetailByID?.user_maintenance_data?.month || ""}-${paymentDetailByID?.property_number}-${formatDate(new Date())}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setIsPdfLoading(false);
                }).catch((error) => {
                    console.error('Error downloading the file:', error);
                    toast.error(`Something Went Wrong`, {
                        style: {
                            marginTop: '4rem'
                        }
                    });
                    setIsPdfLoading(false);
                });
            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isPdfLoding || isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Payment Details</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div id="divToPrint" className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: "60rem" }}>
                <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Owner Name
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-1 flex-order-1">
                            {paymentDetailByID?.name}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Property No.
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-1 flex-order-1">
                            {paymentDetailByID?.property_number ? paymentDetailByID?.property_number : "-"}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Bill For
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-1 flex-order-1">
                            {"Maintenance " + "( " + (paymentDetailByID?.user_maintenance_data?.month + " " + paymentDetailByID?.user_maintenance_data?.year) + " )"}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {" "}
                            Bill Date
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {paymentDetailByID?.user_maintenance_data?.created_at ? moment(paymentDetailByID?.user_maintenance_data?.created_at).utcOffset("+05:30").format("D MMM YY, LT") : "-"}
                            {/* {paymentDetailByID?.user_maintenance_data[0]?.month + "-" + paymentDetailByID?.user_maintenance_data[0]?.year} */}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {"Sq. Ft. Area"}

                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {paymentDetailByID?.property_sq_feet_area ? paymentDetailByID?.property_sq_feet_area : "-"}
                        </div>
                    </li>
                    {paymentDetailByID?.user_maintenance_data?.is_paid === false && <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {"Due Date"}

                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {paymentDetailByID?.user_maintenance_data?.due_date ? moment(paymentDetailByID?.user_maintenance_data?.due_date).utcOffset("+05:30").format("D MMM YYYY, LT") : "-"}
                        </div>
                    </li>}

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {"Payment Status"}

                        </div>
                        <div className="w-full md:w-8 md:flex-order-0 flex-order-1" style={{ color: `${paymentDetailByID?.user_maintenance_data?.is_paid ? '#689f38' : '#d32f2f'}` }}>
                            {paymentDetailByID?.user_maintenance_data?.is_paid ? "Paid" : "Unpaid"}
                        </div>
                    </li>
                    {paymentDetailByID?.user_maintenance_data?.is_paid === true && <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {"Paid Date"}

                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {paymentDetailByID?.user_maintenance_data?.paid_date ? moment(paymentDetailByID?.user_maintenance_data?.paid_date).utcOffset("+05:30").format("D MMM YYYY, LT") : "-"}
                        </div>
                    </li>}
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {"Maintenance Charge"}

                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {"₹ " + new Intl.NumberFormat('en-IN').format(
                                paymentDetailByID?.user_maintenance_data?.amount
                            )}
                        </div>
                    </li>
                    {paymentDetailByID?.user_maintenance_data?.payment_type && <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {"Payment Method"}

                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {paymentDetailByID?.user_maintenance_data?.payment_type}
                        </div>
                    </li>}
                    {paymentDetailByID?.user_maintenance_data?.is_paid === true && <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {paymentDetailByID?.user_maintenance_data?.pay_accepted_by === "Self" ? "Paid By" : "Payment Accepted By"}

                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {paymentDetailByID?.user_maintenance_data?.pay_accepted_by ? paymentDetailByID?.user_maintenance_data?.pay_accepted_by : "-"}
                        </div>
                    </li>}
                    {paymentDetailByID?.user_maintenance_data?.payment_id && <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {"Payment Id"}

                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {paymentDetailByID?.user_maintenance_data?.payment_id}
                        </div>
                    </li>}
                    {paymentDetailByID?.user_maintenance_data?.remark && <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">
                            {"Remark"}

                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {paymentDetailByID?.user_maintenance_data?.remark}
                        </div>
                    </li>}
                </ul>
                <div className="p-invalid error text-xm mt-3" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{`*Note:- A penalty of Rs. 10.00 will be applied for every 1  day(s) on unpaid balances after 20 ${paymentDetailByID?.user_maintenance_data?.month} ${paymentDetailByID?.user_maintenance_data?.year}`}</div>
                <div className='grid p-fluid mt-3'>
                    {paymentDetailByID?.user_maintenance_data?.is_paid === false && <div className="field col-12 md:col-3 ">

                        {/* <a href={`/property-management/maintenancelist/bill/${paymentDetailByID?.user_maintenance_data?._id}`} target='blanck'> */}
                        <Button label={'Download Bill'} type="submit" icon="pi pi-download" className="p-button-outlined p-button-danger w-10rem"
                            onClick={() => {
                                downloadPdfCall(paymentDetailByID?.user_maintenance_data?._id);
                                // downloadFile(paymentDetailByID?.user_maintenance_data?.S3UnpaidURL, "", "bill.pdf")
                            }}
                        />
                        {/* </a> */}
                    </div>}
                    {paymentDetailByID?.user_maintenance_data?.is_paid === true && <div className="field col-12 md:col-3 ">
                        {/* <a href={`/property-management/maintenancelist/bill/${paymentDetailByID?.user_maintenance_data?._id}`} target='blanck'> */}
                        <Button label={'Download Receipt'} type="submit" icon="pi pi-download" className="p-button-outlined p-button-success w-12rem"
                            onClick={() => {
                                downloadPdfCall(paymentDetailByID?.user_maintenance_data?._id);
                                // downloadFile(paymentDetailByID?.user_maintenance_data?.S3PaidURL, "", "Receipt.pdf")
                            }}
                        />
                        {/* </a> */}
                    </div>}
                    {paymentDetailByID?.user_maintenance_data?.cheque_img && <div className="field col-12 md:col-3 ">
                        <Button label={'Download Cheque'} type="submit" icon="pi pi-download" className="p-button-outlined w-12rem"
                            onClick={() => downloadFile(paymentDetailByID?.user_maintenance_data?.cheque_img, "maintenance/cheque/")}
                        />
                    </div>}
                    {paymentDetailByID?.user_maintenance_data?.receipt_screenshot && <div className="field col-12 md:col-3 ">
                        <Button label={'Download Screenshot'} type="submit" icon="pi pi-download" className="p-button-outlined p-button-help w-14rem"
                            onClick={() => downloadFile(paymentDetailByID?.user_maintenance_data?.receipt_screenshot, "receipt/")}
                        // onClick={() => {
                        //     let SendData = {
                        //         file: uploadImg?.file,
                        //         id: uploadDetails?.user_maintenance_data[0]?._id,
                        //     }
                        //     dispatch(imageUploadPayment(SendData));
                        // }}
                        />
                    </div>}
                </div>

            </div>

        </div>
    );

}
export default PaymentView;
