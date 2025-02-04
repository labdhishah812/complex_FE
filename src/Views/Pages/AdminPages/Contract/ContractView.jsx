import { useParams } from 'react-router-dom';
import components from '../..';
import Loader from '../../../../components/Loader';
import { getContractDataById, getContractHistory } from '../../../../redux/slice/AdminSlices/contractSlice';
import moment from 'moment-timezone';
import axios from 'axios';

const ContractView = () => {
    const { BreadCrumb, Button, toast, useEffect, useNavigate, useSelector, useDispatch, useState } = components;
    const { isCreated, isLoading, contractDataById, contractHistory } = useSelector((store) => store.contract);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const [historyData, setHistoryData] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    console.log(contractHistory, 'contractHistory');
    useEffect(() => {
        if (params.id) {
            dispatch(getContractDataById(params.id));
        }
    }, [params.id, isCreated]);

    // Watch for changes in contractDataById and fetch history when company_name is available
    useEffect(() => {
        if (contractDataById?.company_name) {
            dispatch(getContractHistory(contractDataById.company_name));
        }
    }, [contractDataById?.company_name, dispatch]);
    const breadcrumbHome = {
        label: 'Contracts',
        command: () => {
            navigate(`/property-management/contract`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'View Contract'
        }
    ];

    const downloadFile = async (val) => {
        try {
            if (val) {
                const response = await axios.get(`${BASE_URL_API}contract/${val}`, {
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
            <Loader isLoading={isLoading || historyLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">View Contract</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                        <div className="text-500 w-16rem font-medium">Name </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{contractDataById?.usersName ? contractDataById?.usersName : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Service Provider Name</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{contractDataById?.company_name ? contractDataById?.company_name : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Service Category Type</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{contractDataById?.category ? contractDataById?.category : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Contact Person</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{contractDataById?.contactPerson ? contractDataById?.contactPerson : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Designation</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{contractDataById?.designation ? contractDataById?.designation : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Contact No.</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{contractDataById?.contactNo ? contractDataById?.contactNo : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> Address</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">{contractDataById?.address ? contractDataById?.address : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> Start Date</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{contractDataById?.start_date ? convertDate(contractDataById?.start_date) : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium"> End Date</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{contractDataById?.end_date ? convertDate(contractDataById?.end_date) : '-'}</div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium"> Image / Document</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {contractDataById?.aggerement_files[0] ? (
                                <div className="flex align-items-center">
                                    <div className="">
                                        <Button
                                            icon="pi pi-download"
                                            label="Download"
                                            className="p-button-rounded p-button-text"
                                            id="delete-icons"
                                            tooltipOptions={{ position: 'bottom' }}
                                            onClick={() => {
                                                downloadFile(contractDataById?.aggerement_files[0]);
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                '-'
                            )}
                        </div>
                    </li>
                </ul>
            </div>
            {/* Contract History */}
            <div className="crud-demo card mt-3 mx-auto p-4 bg-white shadow-lg rounded-lg" style={{ maxWidth: '60rem' }}>
                <h5 className="title text-xl font-bold text-black mb-4">Contract History</h5>
                {historyLoading ? (
                    <div className="flex items-center justify-center py-6">
                        <span className="text-gray-500 text-lg">Loading...</span>
                    </div>
                ) : Array.isArray(contractHistory) && contractHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-black-600 uppercase text-sm leading-normal">
                                    <th className="px-4 py-2 border-b-2">Start Date</th>
                                    <th className="px-4 py-2 border-b-2">End Date</th>
                                    <th className="px-4 py-2 border-b-2">Company</th>
                                    <th className="px-4 py-2 border-b-2">Tenure</th>
                                    <th className="px-4 py-2 border-b-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                                {contractHistory.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <td className="px-4 py-3 border-b">{convertDate(item.start_date)}</td>
                                        <td className="px-4 py-3 border-b">{convertDate(item.end_date)}</td>
                                        <td className="px-4 py-3 border-b">{item.company_name}</td>
                                        <td className="px-4 py-3 border-b">{item.tenure}</td>
                                        <td className={`px-4 py-3 border-b font-medium ${item.deleted ? 'text-red-500' : 'text-green-500'}`}>{item.deleted ? 'Expired' : 'Active'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-6">
                        <p>No history available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractView;
