import { useParams } from 'react-router-dom';
import components from '../..';
import moment from 'moment-timezone';
import axios from 'axios';

import Loader from '../../../../components/Loader';
import { getExpenseDataById } from '../../../../redux/slice/AdminSlices/expenseSlice';
const ExpenseView = () => {
    const { BreadCrumb, Image, Button, toast, classNames, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { isLoading, expenseDataById } = useSelector((store) => store.expense);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    useEffect(() => {
        if (params.id) {
            dispatch(getExpenseDataById(params.id));
        }
    }, [params.id]);
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Expense',
        command: () => {
            navigate('/property-management/expense');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Expense Details'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const downloadFile = async (val) => {
        try {
            if (val) {
                const response = await axios.get(`${BASE_URL_API}expense/${val}`, {
                    responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', val);
                document.body.appendChild(link);
                link.click();
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
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Expense Details</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> Expense Date</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{expenseDataById?.expense_date ? convertDate(expenseDataById?.expense_date) : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">{'Amount'}</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{expenseDataById?.amount ? '₹ ' + Number(expenseDataById?.amount).toLocaleString('en-IN') : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> Expense Category</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{expenseDataById?.expense_category ? expenseDataById?.expense_category : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Payment Mode</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {expenseDataById?.payment_mode ? (expenseDataById?.payment_mode === 'cash' ? 'Cash' : expenseDataById?.payment_mode === 'cheque' ? 'Cheque' : 'Online') : '-'}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> Expense Details</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter wrap-text text-container">{expenseDataById?.expense_details ? expenseDataById?.expense_details : '-'}</div>
                    </li>
                    {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Status</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            <div
                                className="p-2 my-2 text-center w-7rem"
                                style={{
                                    color: expenseDataById?.status === 'pending' ? '#f5c308' : expenseDataById?.status === 'clear' ? '#689f38' : '#689f38',
                                    border: `2px solid ${expenseDataById?.status === 'pending' ? '#f5c308' : expenseDataById?.status === 'clear' ? '#689f38' : '#689f38'}`,
                                    borderRadius: '5px'
                                }}
                            >
                                {expenseDataById?.status === 'pending' ? 'Pending' : expenseDataById?.status === 'clear' ? 'Clear' : '-'}
                            </div>
                        </div>
                    </li> */}
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Status</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            <span>{expenseDataById?.status === 'pending' ? 'Pending' : expenseDataById?.status === 'clear' ? 'Clear' : '-'}</span>
                        </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> Receipt</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {expenseDataById?.payment_details?.receipt_screenshot ? (
                                <div className="flex align-items-center">
                                    {/* <div>{noticeDetailById?.notice_file}</div> */}
                                    <div className="">
                                        <Button
                                            icon="pi pi-download"
                                            label="Download"
                                            className="p-button-rounded p-button-text"
                                            id="delete-icons"
                                            // tooltip="Download"
                                            tooltipOptions={{ position: 'bottom' }}
                                            onClick={() => {
                                                downloadFile(expenseDataById?.payment_details?.receipt_screenshot);
                                                // setFieldValue('file', null);
                                                // setShowFile(null);
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                '-'
                            )}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Remark </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{expenseDataById?.payment_details?.remark ? expenseDataById?.payment_details?.remark : '-'}</div>
                    </li>
                    {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">Date</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{expenseDataById?.payment_details?.remark ? expenseDataById?.payment_details?.remark : '-'}</div>
                    </li> */}
                </ul>
            </div>
        </div>
    );
};

export default ExpenseView;
