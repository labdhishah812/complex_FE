import { useParams } from 'react-router-dom';
import components from '../..';
import moment from 'moment-timezone';
import Loader from '../../../../components/Loader';
import { getPropertyDataByid, getPropertyOwnerHistory } from '../../../../redux/slice/AdminSlices/propertySlice';
import { Badge } from 'primereact/badge';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
const PropertyDetailView = () => {
    const { BreadCrumb, Image, Button, SelectButton, classNames, Divider, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { isLoading, propertyDataByid, propertyOwnerhistory } = useSelector((state) => state.property);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const locationName = window.location.pathname.split("/");
    // console.log(locationName, "locationName");

    const [selectButton, setSelectButton] = useState("details");

    useEffect(() => {
        if (params.id) {
            dispatch(getPropertyDataByid(params.id))
            dispatch(getPropertyOwnerHistory(params.id));
        }
    }, [params.id]);
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: locationName[2] === "property-structure" ? "Property Structure" : locationName[2] === "tenant" ? "Tenant" : 'Properties',
        command: () => {
            if (locationName[2] === "property-structure") {
                navigate('/property-management/property-structure');
            } else if (locationName[2] === "tenant") {
                navigate('/property-management/tenant');
            } else {
                navigate('/property-management/property-assign');
            }
        }
    };
    const breadcrumbItems = [
        {
            label: locationName[2] === "tenant" ? "Tenant Details" : 'Property Details'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];
    const convertDate = (dateStr) => {
        try {
            // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            // const [day, month, year] = dateStr.split('/');
            // const date = new Date(`${year}-${month}-${day}`);
            // const formattedDate = `${day}-${monthNames[date.getMonth()]}-${year}`;
            const formattedDate = moment(dateStr).format('D MMM YYYY');
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    }
    const customizedContent = (item) => {
        return (
            <Card title={item.ownerName} subTitle={`${convertDate(item?.startDate)}  To ${item?.endDate === "Continue" ? item?.endDate : convertDate(item?.endDate)}`} className='historyCard'>

                {/* <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                    quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p> */}
                <div className='py-2'>
                    <div className="text-500 font-medium">
                        {"Email"}

                    </div>
                    <div className="text-900">
                        {item?.ownerEmail ? item?.ownerEmail : "-"}
                    </div>
                </div>
                <div className='py-2'>
                    <div className="text-500 font-medium">
                        {"Mobile number"}

                    </div>
                    <div className="text-900">
                        {item?.ownerMobileNumber ? item?.ownerMobileNumber : "-"}
                    </div>
                </div>
                {/* <div className='py-2'>
                    <div className="text-500 font-medium">
                        {"Remark"}

                    </div>
                    <div className="text-900">
                        {item?.remark ? item?.remark : "-"}
                    </div>
                </div> */}
                {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                    <div className="text-500 w-16rem font-medium">
                        {" "}
                        3-wheeler
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {propertyDataByid?.["3wheelerTotal"] && propertyDataByid?.["3wheelerTotal"].length > 0 ? propertyDataByid?.["3wheelerTotal"].map((a, i) => <Badge value={a} size="large" severity="warning" className='mr-2 my-2' />) : "-"}
                    </div>
                </li> */}
                {/* <Button label="Read more" className="p-button-text"></Button> */}
            </Card>
        );
    };
    const customizedMarker = (item, i) => {
        return (<>
            <span className="flex w-2rem h-2rem align-items-center justify-content-center border-circle z-1 shadow-1 text-white font-semibold" style={{ background: "#43a047" }}>
                {/* <i className={item.icon}></i> */}
                {item?.index}
            </span>
            <div>
                {"Owner"}
            </div>
        </>
        );
    };
    const chengeValue = (val) => {
        try {
            let currentData = [
                {
                    ownerName: propertyDataByid?.name,
                    ownerEmail: propertyDataByid?.email,
                    ownerMobileNumber: propertyDataByid?.mobile_number,
                    startDate: propertyDataByid?.start_date,
                    endDate: "Continue"
                }
            ]
            val = [...val, ...currentData]
            let data = val.map((x, i) => ({
                ...x,
                index: i + 1
            }));
            data = data.reverse()
            return data;
        } catch (error) {
            console.log(error);

        }
    }
    return (<div className="relative min-h-full">
        <Loader isLoading={isLoading} />
        <div className="flex justify-content-between align-items-center">
            <div className="flex flex-row w-full">
                <h5 className="title m-2 pr-3 flex align-items-center justify-content-center w-15rem">{locationName[2] === "tenant" ? "Tenant Details" : "Property Details"}</h5>
                <div className='flex justify-content-center align-items-center w-full'>
                    {propertyOwnerhistory && propertyOwnerhistory.length > 0 && <SelectButton
                        value={selectButton}
                        optionLabel="name"
                        options={propertyOwnerhistory && propertyOwnerhistory.length > 0 ? [
                            { name: 'Details ', value: "details" },
                            { name: 'Owner History', value: "owner history" },
                            // { name: 'Maintenance History', value: "maintenance history" },
                        ] : [
                            { name: 'Details ', value: "details" },
                            // { name: 'Maintenance History', value: "maintenance history" },
                        ]}
                        onChange={(e) => {
                            if (e.value) {
                                setSelectButton(e.value);
                                if (e.value === "details") dispatch(getPropertyDataByid(params.id));
                                else if (e.value === "") dispatch(getPropertyOwnerHistory(params.id));
                            }
                        }}
                        className='mr-3'
                    />}
                </div>
                <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto w-25rem" />
            </div>
        </div>
        <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: "60rem" }}>
            {/* {propertyOwnerhistory && propertyOwnerhistory.length > 0 && <div className='flex justify-content-center mb-2'>
                <SelectButton
                    value={selectButton}
                    optionLabel="name"
                    options={[
                        { name: 'Details ', value: "details" },
                        { name: 'History', value: "history" },
                    ]}
                    onChange={(e) => {
                        if (e.value) {
                            setSelectButton(e.value);
                            if (e.value === "details") dispatch(getPropertyDataByid(params.id));
                            else dispatch(getPropertyOwnerHistory(params.id));
                        }
                    }}
                    className='mr-3'
                />
            </div>} */}
            {selectButton === "details" &&
                <div >
                    <Divider align="center" className=" pt-0">
                        <span className="p-tag">Personal Information</span>
                    </Divider>
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-3 px-2 border-top-0 surface-border surface-ground">
                            <div className="text-500 w-16rem font-medium">Image </div>
                            {/* ${
                    // "surface-card" shadow-2
                    //    "surface-200"
                    }  */}
                            <div
                                className={`border-round flex align-items-center justify-content-center`}
                                style={{ width: "70px", height: "70px" }}
                            >
                                <Image
                                    alt="icon"
                                    src={`${propertyDataByid?.user_profile}`}
                                    // src={gift}
                                    width="60"
                                    height="60"
                                    preview
                                    className=""
                                />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Property No.
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.property_number ? propertyDataByid?.property_number : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Owner Name
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.name ? propertyDataByid?.name : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Email
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.email ? propertyDataByid?.email : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Mobile No.
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.mobile_number ? propertyDataByid?.mobile_number : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Alternate No.
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.alternate_number ? propertyDataByid?.alternate_number : "-"}

                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Sq. Ft. Area
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.property_sq_feet_area ? propertyDataByid?.property_sq_feet_area : "-"}

                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Created At
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.created_at ? moment(propertyDataByid?.created_at).utcOffset("+05:30").format("D MMM YY, LT") : "-"}

                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Updated At
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.updated_at ? moment(propertyDataByid?.updated_at).utcOffset("+05:30").format("D MMM YY, LT") : "-"}

                            </div>
                        </li>
                        {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                2-wheeler Limit
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["2wheelerLimit"] ? propertyDataByid?.["2wheelerLimit"] : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                3-wheeler Limit
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["3wheelerLimit"] ? propertyDataByid?.["3wheelerLimit"] : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                4-wheeler Limit
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["4wheelerLimit"] ? propertyDataByid?.["4wheelerLimit"] : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                2-wheeler
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["2wheelerTotal"] && propertyDataByid?.["2wheelerTotal"].length > 0 ? propertyDataByid?.["2wheelerTotal"].map((a, i) => <Badge value={a} size="large" severity="warning" className='mr-2 my-2' />) : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                3-wheeler
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["3wheelerTotal"] && propertyDataByid?.["3wheelerTotal"].length > 0 ? propertyDataByid?.["3wheelerTotal"].map((a, i) => <Badge value={a} size="large" severity="warning" className='mr-2 my-2' />) : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                4-wheeler
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["4wheelerTotal"] && propertyDataByid?.["4wheelerTotal"].length > 0 ? propertyDataByid?.["4wheelerTotal"].map((a, i) => <Badge value={a} size="large" severity="warning" className='mr-2 my-2' />) : "-"}
                            </div>
                        </li> */}
                    </ul>
                    <Divider align="center" className=" pt-0">
                        <span className="p-tag">Property Type</span>
                    </Divider>

                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Property Category
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.property_type ? propertyDataByid?.property_type : "-"}
                            </div>
                        </li>
                    </ul>

                    <Divider align="center" className=" pt-0">
                        <span className="p-tag">Vehicle Detail</span>
                    </Divider>
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                2-wheeler Limit
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["2wheelerLimit"] ? propertyDataByid?.["2wheelerLimit"] : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                3-wheeler Limit
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["3wheelerLimit"] ? propertyDataByid?.["3wheelerLimit"] : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                4-wheeler Limit
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["4wheelerLimit"] ? propertyDataByid?.["4wheelerLimit"] : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                2-wheeler
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["2wheelerTotal"] && propertyDataByid?.["2wheelerTotal"].length > 0 ? propertyDataByid?.["2wheelerTotal"].map((a, i) => <Badge value={a} size="large" severity="warning" className='mr-2 my-2' />) : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                3-wheeler
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["3wheelerTotal"] && propertyDataByid?.["3wheelerTotal"].length > 0 ? propertyDataByid?.["3wheelerTotal"].map((a, i) => <Badge value={a} size="large" severity="warning" className='mr-2 my-2' />) : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                4-wheeler
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.["4wheelerTotal"] && propertyDataByid?.["4wheelerTotal"].length > 0 ? propertyDataByid?.["4wheelerTotal"].map((a, i) => <Badge value={a} size="large" severity="warning" className='mr-2 my-2' />) : "-"}
                            </div>
                        </li>
                    </ul>
                    <Divider align="center" className=" pt-0">
                        <span className="p-tag">Business Detail</span>
                    </Divider>
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Name
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.company_name ? propertyDataByid?.company_name : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Category
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.category ? propertyDataByid?.category : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Mobile Number
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.company_mobile_number ? propertyDataByid?.company_mobile_number : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Website
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.website ? propertyDataByid?.website : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                City
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.city ? propertyDataByid?.city : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Pin Code
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.pincode ? propertyDataByid?.pincode : "-"}
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap surface-ground">
                            <div className="text-500 w-16rem font-medium">
                                {" "}
                                Address
                            </div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {propertyDataByid?.company_address ? propertyDataByid?.company_address : "-"}
                            </div>
                        </li>
                    </ul>
                </div>
            }
            {selectButton === "owner history" && propertyOwnerhistory.length > 0 && <div className=''>
                <div className='font-medium text-xl text-500'> Property No :- <span className='font-medium text-2xl'>{propertyDataByid?.property_number ? propertyDataByid?.property_number : "-"}</span> </div>
                <Timeline value={chengeValue(propertyOwnerhistory)} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
            </div>}
            {/* <div className="grid p-fluid mt-1">
                <div className="field col-12 md:col-12 mb-0 flex justify-content-end">
                    <Button label="Back" icon="pi pi-arrow-left" className="p-button-outlined mr-2 mb-2 w-6rem"
                        onClick={() => navigate('/property-management/property-assign')} />
                </div>
            </div> */}
            {/* <Button
                        disabled={submitted}
                        label="Save"
                        type="submit"
                        icon="pi pi-check"
                        className="p-button-outlined p-button-success mr-2 mb-2 w-7rem"
                    // onClick={() => dataSave()}
                    /> */}
        </div>
    </div>)
}
export default PropertyDetailView;
