import { useState } from 'react';
import components from '../..';
import CountUp from 'react-countup';
// import graph from '../../../../assets/images/graph.svg';

import { Image } from 'primereact/image';
import { Chart } from 'primereact/chart';
import approve_building from "../../../../assets/images/active_p.svg";
import property from "../../../../assets/images/total_p.svg";
import rejected_building from "../../../../assets/images/inactive_p.svg";
import profit_icon from "../../../../assets/images/revenue_p.svg";
import support_icon from "../../../../assets/images/support_icon.png";
import Loader from '../../../../components/Loader';

import { getLastFiveRequest, getLastInactiveRequest, getGraphDataRequest } from '../../../../redux/slice/AdminSlices/superAdminDashboardSlice';
import moment from 'moment';


const SuperAdminDashboard = () => {
    const { DataTable, Button, toast, useEffect, React, useDispatch, useSelector, useNavigate, Link, Column } = components;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [pieChartData, setPieChartData] = useState({});
    const [pieChartOptions, setPieChartOptions] = useState({});
    const { isLoading, lastFiveData, lastInactive, graphData } = useSelector((state) => state.superAdminDashboard);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'created_at', order: -1}]);
    const [multiSortMeta2, setMultiSortMeta2] = useState([{ field: 'created_at', order: -1 }]);
    useEffect(() => {
        dispatch(getLastFiveRequest());
        dispatch(getLastInactiveRequest());
        dispatch(getGraphDataRequest({ year: moment().format("YYYY-MM-DD") }));
    }, [])
    useEffect(() => {
        if (graphData) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
            const data = {
                // labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024',
                //     // 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                // ],
                labels: graphData.monthlyData.map(item => item.month),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Total Property',
                        backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                        borderColor: 'white',
                        borderWidth: 2,
                        fill: false,
                        // data: [50, 25, 12, 48, 56, 76, 42]
                        data: graphData.monthlyData.map(item => item.totalPropertyCount)
                    },
                    {
                        type: 'bar',
                        label: 'Active Property',
                        backgroundColor: documentStyle.getPropertyValue('--green-500'),
                        // data: [21, 84, 24, 75, 37, 65, 34],
                        data: graphData.monthlyData.map(item => item.activeCount),
                        borderColor: 'white',
                        borderWidth: 2
                    },
                    {
                        type: 'bar',
                        label: 'Inactive Property',
                        borderWidth: 2,
                        borderColor: 'white',
                        backgroundColor: documentStyle.getPropertyValue('--red-700'),
                        // data: [41, 52, 24, 74, 23, 21, 32]
                        data: graphData.monthlyData.map(item => item.inactiveCount),

                    }
                ]
            };
            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);

            const data2 = {
                // labels: ['Membership'],
                labels: ['Membership', 'Domain Charge', 'Service Charge', 'Maintance'],
                datasets: [
                    {
                        // data: [graphData ? graphData.totalCount : 0, graphData ? graphData.activeYearlyCount : 0, graphData ? graphData.inActiveYearlyCount : 0],
                        data: [2, 0, 0, 0],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--blue-800'),
                            documentStyle.getPropertyValue('--yellow-600'),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--blue-700'),
                            documentStyle.getPropertyValue('--yellow-500'),
                        ]
                    }
                ]
            }
            const options2 = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            };

            setPieChartData(data2);
            setPieChartOptions(options2);
        }
    }, [graphData]);


    // Access the first object in the array



    // const { successMessage } = useSelector((store) => store?.auth);
    // useEffect(() => {
    //     if (successMessage) {
    //         toast.success(successMessage, {
    //             style: {
    //                 marginTop: '4rem'
    //             }
    //         });
    //         dispatch(handleResetState());
    //     }
    // }, [successMessage]);
    const topfiveData = (data) => {
        try {
            let collect = [];
            data.forEach((element, i) => {
                if (i < 5) {
                    collect.push(element);
                }
            });
            return collect
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <>
            <div className="relative dashboard-main-component">
                <Loader isLoading={isLoading} />
                <div className="grid ml-0 mr-0 gap-0 mt-2">
                    <div className="col-12">
                        <h5 className="title m-2 pr-3">Dashboard</h5>
                    </div>
                    <div className="xl:col-3 sm:col-6 col-12">
                        <div
                            className="w-full p-3 flex align-items-center border-round cursor-pointer"
                            style={{ border: '1px solid #d7d6dd', borderLeft: '6px solid #588730', boxShadow: '0 0px 5px #00000059' }}
                            onClick={() => navigate('/superadmin/properties')}
                        >
                            <div className="">
                                <div className="text-md text-700 mb-2 font-semibold">Total Property</div>
                                <CountUp duration={2} className="text-4xl font-semibold" end={graphData ? graphData.totalCount : 0} />
                            </div>
                            <div className="mt-1 flex align-items-center ml-auto">
                                <Image src={property} width="50" height="50" className="ml-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-3 sm:col-6 col-12">
                        <div
                            className="w-full p-3 flex align-items-center border-round cursor-pointer"
                            style={{ border: '1px solid #d7d6dd', borderLeft: '6px solid #1565c0', boxShadow: '0 0px 5px #00000059' }}
                            onClick={() => {
                                localStorage.setItem('userStatus', 'Active');
                                navigate('/superadmin/properties');
                            }}
                        >
                            <div className="">
                                <div className="text-md text-700 mb-2 font-semibold">Active Property</div>
                                <CountUp duration={2} className="text-4xl font-semibold" end={graphData ? graphData.activeYearlyCount : 0} />
                            </div>
                            <div className="mt-1 flex align-items-center ml-auto">
                                <Image src={approve_building} width="50" height="50" className="ml-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-3 sm:col-6 col-12">
                        <div
                            className="w-full p-3 flex align-items-center border-round cursor-pointer"
                            style={{ border: '1px solid #d7d6dd', borderLeft: '6px solid #f62a02', boxShadow: '0 0px 5px #00000059' }}
                            onClick={() => {
                                localStorage.setItem('userStatus', 'In-Active');
                                navigate('/superadmin/properties');
                            }}
                        >
                            <div className="">
                                <div className="text-md text-700 mb-2 font-semibold">Inactive Property</div>
                                <CountUp duration={2} className="text-4xl font-semibold" end={graphData ? graphData.inActiveYearlyCount : 0} />
                            </div>
                            <div className="mt-1 flex align-items-center ml-auto">
                                <Image src={rejected_building} width="50" height="50" className="ml-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-3 sm:col-6 col-12">
                        <div
                            className="w-full p-3 flex align-items-center border-round cursor-pointer"
                            style={{ border: '1px solid #d7d6dd', borderLeft: '6px solid #9302ae', boxShadow: '0 0px 5px #00000059' }}
                            onClick={() => navigate('/superadmin/revenue')}
                        >
                            <div className="">
                                <div className="text-md text-700 mb-2 font-semibold">Total Revenue</div>
                                <CountUp duration={2} className="text-4xl font-semibold" end={0} />
                            </div>
                            <div className="mt-1 flex align-items-center ml-auto">
                                <Image src={profit_icon} width="50" height="50" className="ml-auto" />
                            </div>
                        </div>
                    </div>
                    {/* <div className='xl:col-2 sm:col-5 col-12 border-round' style={{ border: "1px solid #d7d6dd", borderLeft: "6px solid #d0268a", boxShadow: "0 0px 5px #00000059" }}>
                        <div className='w-full p-1 flex align-items-center'>
                            <div className=''>
                                <div className='text-md text-700'>Support</div>
                                <CountUp duration={2} className="text-4xl font-semibold" end={2} />
                            </div>
                            <div className='mt-1 flex align-items-center ml-auto'>
                                <Image src={support_icon} width='40' height='40' className='ml-auto' />
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="grid ml-0 mr-0 mt-3">
                    <div className="xl:col-6 col-12">
                        <div className="card h-30rem shadow-scroll-x" style={{ boxShadow: '0 0px 5px #00000059' }}>
                            <div className="flex align-items-center">
                                <div className="font-semibold">Recently Added Property</div>
                                <Button label="View List" className="p-button-outlined ml-auto p-2" onClick={() => navigate('/superadmin/properties')} />
                            </div>
                            <DataTable
                                value={
                                    lastFiveData
                                        ? topfiveData(lastFiveData.property_listing)
                                        : [
                                              { property_name: 'Galaxy', address: 'vastral', name: 'Chiman Bhai Patel', email: 'galaxy@gmail.com', mobile_number: '7845120960' },
                                              { property_name: 'Avadh Pride', address: 'Nr. Nirant cross road, Vastral road', name: 'Rajan Rawal', email: 'rajanrawal@yopmail.com', mobile_number: '7896541230' },
                                              { property_name: 'Galaxy', address: 'vastral', name: 'Chiman Bhai Patel', email: 'galaxy@gmail.com', mobile_number: '7845120960' },
                                              { property_name: 'Galaxy', address: 'vastral', name: 'Chiman Bhai Patel', email: 'galaxy@gmail.com', mobile_number: '7845120960' },
                                              { property_name: 'Galaxy', address: 'vastral', name: 'Chiman Bhai Patel', email: 'galaxy@gmail.com', mobile_number: '7845120960' }
                                          ]
                                }
                                // value={lastInactive ? lastInactive.property_listing : [{ property_name: "Galaxy", address: "vastral", name: "Chiman Bhai Patel", email: "galaxy@gmail.com", mobile_number: "7845120960" },
                                // { property_name: "Avadh Pride", address: "Nr. Nirant cross road, Vastral road", name: "Rajan Rawal", email: "rajanrawal@yopmail.com", mobile_number: "7896541230" },
                                // { property_name: "Galaxy", address: "vastral", name: "Chiman Bhai Patel", email: "galaxy@gmail.com", mobile_number: "7845120960" },
                                // { property_name: "Galaxy", address: "vastral", name: "Chiman Bhai Patel", email: "galaxy@gmail.com", mobile_number: "7845120960" },
                                // { property_name: "Galaxy", address: "vastral", name: "Chiman Bhai Patel", email: "galaxy@gmail.com", mobile_number: "7845120960" },
                                // ]}
                                showGridlines
                                stripedRows
                                dataKey="_id"
                                className="datatable-responsive mt-3"
                                emptyMessage="No Record Found."
                                // header={header}
                                // scroll="scroll"
                                scrollable
                                // tableStyle={{ minHeight: "16rem" }}
                                scrollHeight="24rem"
                                sortMode="multiple"
                                size="large"
                                onSort={(e) => {
                                    setMultiSortMeta2(e.multiSortMeta);
                                }}
                                multiSortMeta={multiSortMeta2}
                            >
                                <Column field="created_at" header="Registration Date" headerStyle={{ minWidth: '10rem' }} sortable body={(rowData) => moment(rowData.created_at).format('D MMM YY, h:mm A')}></Column>
                                <Column field="property_name" header="Property Name" className="capitalize" headerStyle={{ minWidth: '10rem' }} sortable></Column>
                                {/* <Column field="address" header="Property Address" headerStyle={{ minWidth: '11rem' }} sortable></Column> */}
                                <Column field="name" header="Chairman Name" className="capitalize" sortable></Column>
                                {/* <Column field="email" header="Email" sortable></Column>
                                <Column field="mobile_number" header="Mobile Number" headerStyle={{ minWidth: '11rem' }} sortable></Column> */}
                            </DataTable>
                        </div>
                    </div>
                    <div className="xl:col-6 col-12">
                        <div className="card h-30rem shadow-scroll-x" style={{ boxShadow: '0 0px 5px #00000059' }}>
                            <div className="flex align-items-center">
                                {/* <div className='font-semibold' style={{ color: "#1565c0" }}>Latest 5 Added Property</div> */}
                                <div className="font-semibold">Top 5 Active Property</div>
                                <Button label="View List" className="p-button-outlined ml-auto p-2" onClick={() => navigate('/superadmin/properties')} />
                            </div>
                            <DataTable
                                value={
                                    lastFiveData
                                        ? topfiveData(lastFiveData.property_listing)
                                        : [
                                              { property_name: 'Galaxy', address: 'vastral', name: 'Chiman Bhai Patel', email: 'galaxy@gmail.com', mobile_number: '7845120960' },
                                              { property_name: 'Avadh Pride', address: 'Nr. Nirant cross road, Vastral road', name: 'Rajan Rawal', email: 'rajanrawal@yopmail.com', mobile_number: '7896541230' },
                                              { property_name: 'Galaxy', address: 'vastral', name: 'Chiman Bhai Patel', email: 'galaxy@gmail.com', mobile_number: '7845120960' },
                                              { property_name: 'Galaxy', address: 'vastral', name: 'Chiman Bhai Patel', email: 'galaxy@gmail.com', mobile_number: '7845120960' },
                                              { property_name: 'Galaxy', address: 'vastral', name: 'Chiman Bhai Patel', email: 'galaxy@gmail.com', mobile_number: '7845120960' }
                                          ]
                                }
                                showGridlines
                                stripedRows
                                dataKey="_id"
                                className="datatable-responsive mt-3"
                                emptyMessage="No Record Found."
                                // header={header}
                                // scroll="scroll"
                                scrollable
                                // tableStyle={{ minHeight: "16rem" }}
                                scrollHeight="24rem"
                                sortMode="multiple"
                                size="large"
                                onSort={(e) => {
                                    setMultiSortMeta(e.multiSortMeta);
                                }}
                                multiSortMeta={multiSortMeta}
                            >
                                <Column field="created_at" header="Registration Date" headerStyle={{ minWidth: '11rem' }} body={(rowData) => moment(rowData.created_at).format('D MMM YY, h:mm A')} sortable></Column>
                                <Column field="property_name" header="Property Name" className="capitalize" headerStyle={{ minWidth: '10rem' }} sortable></Column>
                                <Column field="name" header="Chairman Name" className="capitalize" sortable></Column>
                                {/* <Column field="email" header="Email" sortable></Column>
                                <Column field="mobile_number" header="Mobile Number" headerStyle={{ minWidth: '11rem' }} sortable></Column> */}
                            </DataTable>
                        </div>
                    </div>
                </div>
                <div className="grid ml-0 mr-0 mt-3">
                    {/* Property Management Chart */}
                    <div className="xl:col-8 col-12 p-2 flex align-items-stretch">
                        <div className="card w-full" style={{ boxShadow: '0 0px 5px #00000059', maxHeight: '475px', display: 'flex', flexDirection: 'column' }}>
                            <div className="text-1xl font-semibold text-center mb-2">Property Management</div>
                            <Chart type="bar" data={chartData} options={chartOptions} className="max-h-30rem flex-grow-1" />
                        </div>
                    </div>

                    {/* Revenue Management Chart */}
                    <div className="xl:col-4 col-12 p-2 flex align-items-stretch">
                        <div className="card w-full" style={{ boxShadow: '0 0px 5px #00000059', minHeight: '471px', display: 'flex', flexDirection: 'column' }}>
                            <div className="text-1xl font-semibold text-center mb-2">Revenue Management</div>
                            <Chart type="doughnut" data={pieChartData} options={pieChartOptions} className="m-auto max-h-30rem flex-grow-1" style={{ height: '350px', width: '350px' }} />
                            <div className="text-1xl font-semibold text-center mb-2 mt-4">
                                Total Revenue: <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="flex p-1 col-12 justify-content-evenly">
                    <div className="card dashboard-card w-2 my-1 mx-2 p-3 attendence-box flex flex-row px-2 justify-content-between">
                        <div className="flex  justify-content-center align-items-center">
                            <span className="p-badge p-component p-badge-no-gutter p-badge-xl p-badge-primary">
                                {' '}
                                <i
                                    className="pi
pi-building text-2xl mx-2"
                                ></i>{' '}
                            </span>
                        </div>
                        <div className="flex flex-column ml-3 justify-content-center">
                            <div className="text-center text-base font-bold mb-2">Total Complexes</div>
                            <CountUp duration={2} className="text-center text-xl" end={2} />
                        </div>
                    </div>
                    <div className="card dashboard-card w-2 my-1 mx-2 p-3 attendence-box flex flex-row px-2 justify-content-between">
                        <div className="flex  justify-content-center align-items-center">
                            <span className="p-badge p-component p-badge-no-gutter p-badge-xl p-badge-success">
                                {' '}
                                <i
                                    className="pi
pi-building text-2xl mx-2"
                                ></i>{' '}
                            </span>
                        </div>
                        <div className="flex flex-column ml-3 justify-content-center">
                            <div className="text-center text-base font-bold mb-2">Active Complexes</div>
                            <CountUp duration={2} className="text-center text-xl" end={2} />
                        </div>
                    </div>
                    <div className="card dashboard-card w-2 my-1 mx-2 p-3 attendence-box flex flex-row px-2 justify-content-between">
                        <div className="flex  justify-content-center align-items-center">
                            <span className="p-badge p-component p-badge-no-gutter p-badge-xl p-badge-danger">
                                {' '}
                                <i
                                    className="pi
pi-building text-2xl mx-2"
                                ></i>{' '}
                            </span>
                        </div>
                        <div className="flex flex-column ml-3 justify-content-center">
                            <div className="text-center text-base font-bold mb-2"> Inactive Complexes</div>
                            <CountUp duration={2} className="text-center text-xl" end={0} />
                        </div>
                    </div>
                </div> */}
                {/* <div className="flex justify-content-between col-12 -mb-2">
                    <div>
                        <h5 className="title">Complex Table</h5>
                    </div>
                </div> */}
                {/* <div className="card col-12 dashboard-table">
                    <DataTable value={jsonData} showGridlines stripedRows dataKey="id" className="datatable-responsive" emptyMessage="No Record Found." scroll="scroll" tableStyle={{ minWidth: '60rem' }}>
                        <Column field="complex_name" header="Complex Name" sortable headerStyle={{ width: '15%' }}></Column>
                        <Column field="address" sortable header="Address" headerStyle={{ width: '20%', minWidth: '8rem' }}></Column>
                        <Column field="complex_admin_name" sortable header="Admin Name" headerStyle={{ width: '12%', minWidth: '8rem' }}></Column>
                        <Column field="mobile_no" sortable header="Mobile No" headerStyle={{ width: '10%', minWidth: '5rem' }}></Column>
                        <Column field="email" sortable header="Email" headerStyle={{ width: '12%', minWidth: '8rem' }}></Column>
                    </DataTable>
                </div> */}
            </div>
        </>
    );
};

export default SuperAdminDashboard;
