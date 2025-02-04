import { useParams } from 'react-router-dom';
import components from '../..';
import Loader from '../../../../components/Loader';
import { getfdDataById } from '../../../../redux/slice/AdminSlices/fdSlice';
import moment from 'moment-timezone';

const FixDepositView = () => {
    const { BreadCrumb, useEffect, useNavigate, Image, useSelector, useDispatch } = components;
    const { isCreated, isLoading, fdDataById } = useSelector((store) => store.fd);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    useEffect(() => {
        if (params.id) {
            dispatch(getfdDataById(params.id));
        }
    }, [params.id, isCreated]);
    const breadcrumbHome = {
        label: 'Fix Deposit',
        command: () => {
            navigate(`/property-management/fixdeposit`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'View Fix Deposit'
        }
    ];
    const convertDate = (dateStr) => {
        try {
            const formattedDate = moment(dateStr).format('D MMM YYYY');
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">View Fix Deposit</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <div className="grid p-fluid mt-1">
                    <div className="field col-12 md:col-5 mb-0">
                        <div className={`border-round`} style={{ width: '300px', height: '300px' }}>
                            {fdDataById?.receipt_image ? (
                                <Image
                                    alt="icon"
                                    src={`${BASE_URL_API}fixeddeposit/${fdDataById?.receipt_image}`}
                                    // src={gift}
                                    width="300"
                                    height="300"
                                    preview
                                    className=""
                                />
                            ) : (
                                <Image
                                    alt="icon"
                                    src={`${BASE_URL_API}fixeddeposit/savings.png`}
                                    // src={gift}
                                    width="300"
                                    height="300"
                                    preview
                                    className=""
                                />
                            )}
                        </div>
                    </div>
                    <div className="field col-12 md:col-7 mb-0">
                        <ul className="list-none p-0 m-0">
                            <li className="flex align-items-center py-3 px-2 border-top-0 surface-border ">
                                <div className="text-500 w-9rem font-medium">Term </div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{fdDataById?.term ? fdDataById?.term : '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium"> Bank Name</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{fdDataById?.bank_name ? fdDataById?.bank_name : '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap ">
                                <div className="text-500 w-9rem font-medium"> Branch Name</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{fdDataById?.branch_name ? fdDataById?.branch_name : '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium"> AC No</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 ">{fdDataById?.ac_no ? fdDataById?.ac_no : '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-9rem font-medium"> Interest</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{fdDataById?.interest ? fdDataById?.interest + ' %' : '-'}</div>
                            </li>

                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium"> Principle Amount</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{fdDataById?.principle_amt ? '₹ ' + new Intl.NumberFormat('en-IN').format(fdDataById?.principle_amt) : '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-9rem font-medium"> Maturity Amount</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{fdDataById?.maturity_amt ? '₹ ' + new Intl.NumberFormat('en-IN').format(fdDataById?.maturity_amt) : '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium"> Interest In Amount</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{fdDataById?.interestInAmount ? '₹ ' + new Intl.NumberFormat('en-IN').format(fdDataById?.interestInAmount) : '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                <div className="text-500 w-9rem font-medium"> Value Date</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{fdDataById?.value_date ? convertDate(fdDataById?.value_date) : '-'}</div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                                <div className="text-500 w-9rem font-medium"> Maturity Date</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{fdDataById?.maturity_date ? convertDate(fdDataById?.maturity_date) : '-'}</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <ul className="list-none p-0 m-0">
                    {/* <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">Image </div>
                        <div className={`border-round flex align-items-center justify-content-center`} style={{ width: '70px', height: '70px' }}>
                            {fdDataById?.receipt_image ? (
                                <Image
                                    alt="icon"
                                    src={`${BASE_URL_API}fd_receipt/${fdDataById?.receipt_image}`}
                                    // src={gift}
                                    width="60"
                                    height="60"
                                    preview
                                    className=""
                                />
                            ) : (
                                '-'
                            )}
                        </div>
                    </li> */}

                    {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> AC No</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 ">{fdDataById?.ac_no ? fdDataById?.ac_no : '-'}</div>
                    </li> */}
                </ul>
            </div>
        </div>
    );
};
export default FixDepositView;
