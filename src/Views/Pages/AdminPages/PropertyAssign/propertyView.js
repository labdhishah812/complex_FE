// import { useParams } from 'react-router-dom';
// import components from '../..';
// import moment from 'moment-timezone';
// import Loader from '../../../../components/Loader';
// import { getPropertyDataByid, getPropertyOwnerHistory } from '../../../../redux/slice/AdminSlices/propertySlice';
// import { Badge } from 'primereact/badge';
// import { Timeline } from 'primereact/timeline';
// import { Card } from 'primereact/card';
// import { Tag } from 'lucide-react';
// import { Dialog } from 'primereact/dialog';
// const PropertyDetailView = () => {
//     const { BreadCrumb, Image, Button, SelectButton, classNames, Divider, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
//     const { isLoading, propertyDataByid, propertyOwnerhistory } = useSelector((state) => state.property);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const params = useParams();
//     const locationName = window.location.pathname.split('/');

//     const [selectButton, setSelectButton] = useState('details');

//     useEffect(() => {
//         if (params.id) {
//             dispatch(getPropertyDataByid(params.id));
//             dispatch(getPropertyOwnerHistory(params.id));
//         }
//     }, [params.id]);
//     const breadcrumbHome = {
//         // icon: 'pi pi-home',
//         label: locationName[2] === 'property-structure' ? 'Property Structure' : locationName[2] === 'tenant' ? 'Tenant' : 'Properties',
//         command: () => {
//             if (locationName[2] === 'property-structure') {
//                 navigate('/property-management/property-structure');
//             } else if (locationName[2] === 'tenant') {
//                 navigate('/property-management/tenant');
//             } else {
//                 navigate('/property-management/property-assign');
//             }
//         }
//     };
//     const breadcrumbItems = [
//         {
//             label: locationName[2] === 'tenant' ? 'Tenant Details' : 'Property Details'
//             // command: () => {
//             //     navigate('/superadmin/properties');
//             // }
//         }
//     ];
//     const TruncatedText = ({ text, maxLength = 30, className = '' }) => {
//         const [showFullText, setShowFullText] = useState(false);

//         if (!text) return <span className="text-500">N/A</span>;

//         const isTruncated = text.length > maxLength;
//         const displayText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

//         const handleViewFull = (e) => {
//             e.stopPropagation();
//             setShowFullText(true);
//         };
//         return (
//             <>
//                 <div className={`flex align-items-center ${className}`}>
//                     <span className="full-text-tooltip mr-2 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer" onClick={handleViewFull}>
//                         {displayText}
//                     </span>
//                 </div>

//                 <Dialog header="Full Details" visible={showFullText} style={{ width: '50vw' }} className="shadow-8" modal onHide={() => setShowFullText(false)}>
//                     <p className="text-lg text-900">{text}</p>
//                 </Dialog>
//             </>
//         );
//     };
//     const renderInfoSection = (title, children, icon) => {
//         return (
//             <Card
//                 className="mb-4 shadow-2 border-round-xl overflow-hidden transform transition-all "
//                 title={
//                     <div className="flex align-items-center">
//                         <i className={`${icon} text-primary mr-3 text-2xl`}></i>
//                         <span className="text-800 font-semibold text-lg">{title}</span>
//                     </div>
//                 }
//             >
//                 <div className="grid">
//                     {children.map((child, index) => (
//                         <div key={index} className="col-12">
//                             {child}
//                         </div>
//                     ))}
//                 </div>
//             </Card>
//         );
//     };
//     const renderOwnerHistorySection = () => {
//         return (
//             <Card
//                 className="mb-4 shadow-2 border-round-xl overflow-hidden transform transition-all "
//                 title={
//                     <div className="flex align-items-center">
//                         <i className={`pi mr-2 pi-history text-green-500 text-xl`}></i>
//                         <span className="text-800 font-semibold text-lg">Owner History</span>
//                     </div>
//                 }
//             >
//                 <Timeline value={chengeValue(propertyOwnerhistory)} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
//             </Card>
//         );
//     };
//     const getStatusConfig = (status) => {
//         const statusMap = {
//             false: {
//                 icon: 'pi-check-circle',
//                 color: 'success',
//                 textColor: 'text-white'
//             },
//             true: {
//                 icon: 'pi-ban',
//                 color: 'danger', // Red for Inactive
//                 textColor: 'text-white' // Ensure the text is white for better contrast
//             },
//             Trial: {
//                 icon: 'pi-info-circle',
//                 color: 'warning',
//                 textColor: 'text-blue-700'
//             },
//             default: {
//                 icon: 'pi pi-times',
//                 color: 'danger',
//                 textColor: 'text-white'
//             }
//         };
//         return statusMap[status] || statusMap['default'];
//     };
//     // Render header with property logo and basic info
//     const renderHeaderSection = () => {
//         // if (!formData) return null;

//         const propertyStatus = getStatusConfig(propertyDataByid?.deleted);

//         return (
//             <>
//                 <div className="flex flex-row w-full">
//                     <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{'Property Details'}</h5>
//                     <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                 </div>
//                 <div className="bg-white shadow-2 border-round-xl p-4 mb-4 flex flex-column md:flex-row justify-content-between align-items-center">
//                     <div className="flex align-items-center mb-3 md:mb-0">
//                         <div className="mr-4">
//                             {propertyDataByid && propertyDataByid.user_profile ? (
//                                 <img
//                                     src={`${propertyDataByid?.user_profile}`}
//                                     alt="Property Logo"
//                                     className="border-circle shadow-3 transform transition-transform hover:scale-110"
//                                     style={{
//                                         width: '100px',
//                                         height: '100px',
//                                         objectFit: 'cover',
//                                         border: '3px solid var(--primary-color)'
//                                     }}
//                                 />
//                             ) : (
//                                 <div
//                                     className="flex align-items-center justify-content-center border-circle bg-primary text-white shadow-3"
//                                     style={{
//                                         width: '100px',
//                                         height: '100px',
//                                         fontSize: '48px'
//                                     }}
//                                 >
//                                     {propertyDataByid?.name || '-'}
//                                 </div>
//                             )}
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold text-900 mb-2 flex align-items-center">
//                                 {propertyDataByid?.name || '-'}
//                                 {/* <Tag value={formData.property_status} severity={propertyStatus.color} icon={`pi ${propertyStatus.icon}`} className="ml-3" /> */}
//                                 <Tag value="ac" severity={propertyStatus.color} icon={`pi ${propertyStatus.icon}`} className="ml-3" style={{ gap: '5px' }} />
//                             </h1>
//                             <div className="text-600 flex align-items-center">
//                                 <i className="pi pi-map-marker mr-2 text-primary"></i>
//                                 {propertyDataByid?.property_address || '-'}
//                             </div>
//                         </div>
//                     </div>
//                     {/* <Button
//                         label="Back to Properties"
//                         icon="pi pi-arrow-left"
//                         className="p-button-outlined p-button-primary shadow-2 transform transition-transform hover:scale-105 mt-3 md:mt-0"
//                         onClick={() => navigate('/superadmin/properties')}
//                     /> */}
//                     {/* <div className="flex flex-row w-full">
//                         <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{'Property Information'}</h5>
//                         <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                     </div> */}
//                 </div>
//             </>
//         );
//     };
//     // Render individual info row
//     const renderInfoRow = (label, value, type = 'text') => {
//         const renderValue = () => {
//             switch (type) {
//                 case 'boolean':
//                     return (
//                         <div className="flex align-items-center">
//                             <i className={`pi mr-2 ${value ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'} text-xl`}></i>
//                             <span className={`font-medium ${value ? 'text-green-700' : 'text-red-700'}`}>{value ? 'Yes' : 'No'}</span>
//                         </div>
//                     );
//                 case 'status':
//                     return (
//                         <Tag
//                             value={value}
//                             severity={value === 'Inactive' ? 'secondary' : 'success'}
//                             icon={`pi ${value === 'Inactive' ? 'pi-circle' : 'pi-check-circle'}`}
//                             className={`ml-3 ${value === 'Inactive' ? 'p-tag-secondary' : ''}`}
//                             style={
//                                 value === 'Inactive'
//                                     ? {
//                                           background: 'red',
//                                           width: 'max-content'
//                                       }
//                                     : {}
//                             }
//                         />
//                     );
//                 case 'address':
//                     return <TruncatedText text={value} />;
//                 case 'masked':
//                     return value ? '*'.repeat(value.length - 4) + value.slice(-4) : 'N/A';
//                 default:
//                     return <span className="text-700">{value || 'N/A'}</span>;
//             }
//         };

//         return (
//             <div className="flex justify-content-between align-items-center py-2 border-bottom-1 border-200 ">
//                 <div className="text-700 font-semibold pr-3">{label}</div>
//                 <div className="text-900 text-right">{renderValue()}</div>
//             </div>
//         );
//     };
//     const convertDate = (dateStr) => {
//         try {
//             // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//             // const [day, month, year] = dateStr.split('/');
//             // const date = new Date(`${year}-${month}-${day}`);
//             // const formattedDate = `${day}-${monthNames[date.getMonth()]}-${year}`;
//             const formattedDate = moment(dateStr).format('D MMM YYYY');
//             return formattedDate;
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const customizedContent = (item) => {
//         return (
//             <Card title={item.ownerName} subTitle={`${convertDate(item?.startDate)}  To ${item?.endDate === 'Continue' ? item?.endDate : convertDate(item?.endDate)}`} className="historyCard">
//                 {/* <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
//                     quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p> */}
//                 <div className="py-2">
//                     <div className="text-500 font-medium">{'Email'}</div>
//                     <div className="text-900">{item?.ownerEmail ? item?.ownerEmail : '-'}</div>
//                 </div>
//                 <div className="py-2">
//                     <div className="text-500 font-medium">{'Mobile number'}</div>
//                     <div className="text-900">{item?.ownerMobileNumber ? item?.ownerMobileNumber : '-'}</div>
//                 </div>
//                 {/* <div className='py-2'>
//                     <div className="text-500 font-medium">
//                         {"Remark"}

//                     </div>
//                     <div className="text-900">
//                         {item?.remark ? item?.remark : "-"}
//                     </div>
//                 </div> */}
//                 {/* <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
//                     <div className="text-500 w-16rem font-medium">
//                         {" "}
//                         3-wheeler
//                     </div>
//                     <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
//                         {propertyDataByid?.["3wheelerTotal"] && propertyDataByid?.["3wheelerTotal"].length > 0 ? propertyDataByid?.["3wheelerTotal"].map((a, i) => <Badge value={a} size="large" severity="warning" className='mr-2 my-2' />) : "-"}
//                     </div>
//                 </li> */}
//                 {/* <Button label="Read more" className="p-button-text"></Button> */}
//             </Card>
//         );
//     };
//     const customizedMarker = (item, i) => {
//         return (
//             <>
//                 <span className="flex w-2rem h-2rem align-items-center justify-content-center border-circle z-1 shadow-1 text-white font-semibold" style={{ background: '#43a047' }}>
//                     {/* <i className={item.icon}></i> */}
//                     {item?.index}
//                 </span>
//                 <div>{'Owner'}</div>
//             </>
//         );
//     };
//     const chengeValue = (val) => {
//         try {
//             let currentData = [
//                 {
//                     ownerName: propertyDataByid?.name,
//                     ownerEmail: propertyDataByid?.email,
//                     ownerMobileNumber: propertyDataByid?.mobile_number,
//                     startDate: propertyDataByid?.start_date,
//                     endDate: 'Continue'
//                 }
//             ];
//             val = [...val, ...currentData];
//             let data = val.map((x, i) => ({
//                 ...x,
//                 index: i + 1
//             }));
//             data = data.reverse();
//             return data;
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     return (
//         <>
//         <Loader isLoading={isLoading} />
//             <div className="surface-ground p-5 bg-blue-50 min-h-screen">
//                 <div className="container mx-auto">
//                     {renderHeaderSection()}
//                     <div className="grid">
//                         <div className="col-12 md:col-6">
//                             {renderInfoSection(
//                                 'Personal Information',
//                                 [
//                                     renderInfoRow('Property No.', propertyDataByid?.property_number || '-'),
//                                     renderInfoRow('Email', propertyDataByid?.email || '-'),
//                                     renderInfoRow('Mobile No.', propertyDataByid?.mobile_number || '-'),
//                                     renderInfoRow('Alternate No.', propertyDataByid?.alternate_number || '-'),
//                                     renderInfoRow('Created At', moment(propertyDataByid?.created_at).format('D MMM YY') || '-'),
//                                     renderInfoRow('Updated At', moment(propertyDataByid?.updated_at).format('D MMM YY HH:mm') || '-')
//                                 ],
//                                 'pi pi-user'
//                             )}
//                         </div>
//                         <div className="col-12 md:col-6">
//                             {renderInfoSection(
//                                 'Business Information',
//                                 [
//                                     renderInfoRow('Name', propertyDataByid?.company_name || '-'),
//                                     renderInfoRow('Category', propertyDataByid?.category || '-'),
//                                     renderInfoRow('Contact No.', propertyDataByid?.company_mobile_number || '-'),
//                                     renderInfoRow('Email', propertyDataByid?.company_email || '-'),
//                                     renderInfoRow('Website', propertyDataByid?.website || '-'),
//                                     renderInfoRow('Address', propertyDataByid?.company_address || '-')
//                                 ],
//                                 'pi pi-briefcase'
//                             )}
//                         </div>
//                         <div className="col-12 md:col-6">
//                             {renderInfoSection(
//                                 'Vehicle Information',
//                                 [
//                                     renderInfoRow('2-wheeler Limit', propertyDataByid?.['2wheelerLimit'] || '-'),
//                                     renderInfoRow('3-wheeler Limit', propertyDataByid?.['3wheelerLimit'] || '-'),
//                                     renderInfoRow('4-wheeler Limit', propertyDataByid?.['4wheelerLimit'] || '-'),
//                                     renderInfoRow(
//                                         '2-wheeler',
//                                         propertyDataByid?.['2wheelerTotal'] && propertyDataByid?.['2wheelerTotal'].length > 0
//                                             ? propertyDataByid?.['2wheelerTotal'].map((a, i) => <Badge value={a} size="large" severity="success" className="mr-2 my-2" />)
//                                             : '-'
//                                     ),
//                                     renderInfoRow(
//                                         '3-wheeler',
//                                         propertyDataByid?.['3wheelerTotal'] && propertyDataByid?.['3wheelerTotal'].length > 0
//                                             ? propertyDataByid?.['3wheelerTotal'].map((a, i) => <Badge value={a} size="large" severity="success" className="mr-2 my-2" />)
//                                             : '-'
//                                     ),
//                                     renderInfoRow(
//                                         '4-wheeler',
//                                         propertyDataByid?.['4wheelerTotal'] && propertyDataByid?.['4wheelerTotal'].length > 0
//                                             ? propertyDataByid?.['4wheelerTotal'].map((a, i) => <Badge value={a} size="large" severity="success" className="mr-2 my-2" />)
//                                             : '-'
//                                     )
//                                 ],
//                                 'pi pi-car'
//                             )}
//                         </div>
//                         <div className="col-12 md:col-6">{renderInfoSection('Visitor Setting Information', [renderInfoRow('Allow Guests', '-'), renderInfoRow('Allow Deliveries', '-'), renderInfoRow('Parking Access', '-')], 'pi pi-cog')}</div>
//                     </div>
//                     {propertyOwnerhistory && propertyOwnerhistory.length > 0 ? renderOwnerHistorySection(): ""}
//                 </div>
//             </div>
//         </>
//     );
// }
// export default PropertyDetailView;

import { useParams } from 'react-router-dom';
import components from '../..';
import moment from 'moment-timezone';
import Loader from '../../../../components/Loader';
import { getPropertyDataByid, getPropertyOwnerHistory } from '../../../../redux/slice/AdminSlices/propertySlice';
import { Badge } from 'primereact/badge';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Tag } from 'lucide-react';
import { Dialog } from 'primereact/dialog';

const PropertyDetailView = () => {
    const { BreadCrumb, Image, Button, SelectButton, classNames, Divider, useEffect, useNavigate, useState, useSelector, useDispatch } = components;
    const { isLoading, propertyDataByid, propertyOwnerhistory } = useSelector((state) => state.property);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const locationName = window.location.pathname.split('/');

    const [selectButton, setSelectButton] = useState('details');

    useEffect(() => {
        if (params.id) {
            dispatch(getPropertyDataByid(params.id));
            dispatch(getPropertyOwnerHistory(params.id));
        }
    }, [params.id]);

    const breadcrumbHome = {
        // label: locationName[2] === 'property-structure' ? 'Property Structure' : locationName[2] === 'tenant' ? 'Tenant' : 'Properties',
     label :
  locationName[2] === 'property-assign' ? 'Property Assign' :
  locationName[2] === 'property-structure' ? 'Property Structure' :
  locationName[2] === 'tenant' ? 'Tenant' :
  locationName[2] === 'committee' ? 'Committee' :
  locationName[2] === 'general-core-members' ? 'General Core Members' :
  'Properties',
        command: () => {
            if (locationName[2] === 'property-structure') {
                navigate('/property-management/property-structure');
            } else if (locationName[2] === 'tenant') {
                navigate('/property-management/tenant');
            } else if (locationName[2] === 'committee') {
                navigate('/property-management/committee');
            } else if (locationName[2] === 'general-core-members') {
                navigate('/property-management/general-core-members');
            } else {
                navigate('/property-management/property-assign');
            }
        }
    };

    const breadcrumbItems = [
        {
            label: locationName[2] === 'tenant' ? 'Tenant Details' : 'Property Details'
        }
    ];

    const TruncatedText = ({ text, maxLength = 30, className = '' }) => {
        const [showFullText, setShowFullText] = useState(false);

        if (!text) return <span className="text-500">N/A</span>;

        const isTruncated = text.length > maxLength;
        const displayText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

        const handleViewFull = (e) => {
            e.stopPropagation();
            setShowFullText(true);
        };
        return (
            <>
                <div className={`flex align-items-center ${className}`}>
                    <span className="full-text-tooltip mr-2 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer" onClick={handleViewFull}>
                        {displayText}
                    </span>
                </div>

                <Dialog header="Full Details" visible={showFullText} style={{ width: '50vw' }} className="shadow-8" modal onHide={() => setShowFullText(false)}>
                    <p className="text-lg text-900">{text}</p>
                </Dialog>
            </>
        );
    };

    const getStatusConfig = (status) => {
        const statusMap = {
            false: {
                icon: 'pi-check-circle',
                color: 'success',
                textColor: 'text-white'
            },
            true: {
                icon: 'pi-ban',
                color: 'danger',
                textColor: 'text-white'
            },
            Trial: {
                icon: 'pi-info-circle',
                color: 'warning',
                textColor: 'text-blue-700'
            },
            default: {
                icon: 'pi pi-times',
                color: 'danger',
                textColor: 'text-white'
            }
        };
        return statusMap[status] || statusMap['default'];
    };

    const renderHeaderSection = () => {
        const propertyStatus = getStatusConfig(propertyDataByid?.deleted);

        return (
            <>
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{'Property Details'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
                <div className="bg-white shadow-2 border-round-xl p-4 mb-4 flex flex-column md:flex-row justify-content-between align-items-center">
                    <div className="flex align-items-center mb-3 md:mb-0">
                        <div className="mr-4">
                            {propertyDataByid && propertyDataByid.user_profile ? (
                                <img
                                    src={`${propertyDataByid?.user_profile}`}
                                    alt="Property Logo"
                                    className="border-circle shadow-3 transform transition-transform hover:scale-110"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        border: '3px solid var(--primary-color)'
                                    }}
                                />
                            ) : (
                                <div
                                    className="flex align-items-center justify-content-center border-circle bg-primary text-white shadow-3"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        fontSize: '48px'
                                    }}
                                >
                                    {propertyDataByid?.name?.[0] || '-'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-900 mb-2 flex align-items-center">
                                {propertyDataByid?.name || '-'}
                                <Tag value="ac" severity={propertyStatus.color} icon={`pi ${propertyStatus.icon}`} className="ml-3" style={{ gap: '5px' }} />
                                <span
                                    className={`ml-3 px-3 py-1 text-white text-sm font-semibold rounded-full ${propertyDataByid?.user_property_assigns_status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}
                                >
                                    {propertyDataByid?.user_property_assigns_status || '-'}
                                </span>
                            </h1>
                            <div className="text-600 flex align-items-center">
                                <i className="pi pi-map-marker mr-2 text-primary"></i>
                                {propertyDataByid?.property_address || '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderInfoRow = (label, value, type = 'text') => {
        const renderValue = () => {
            switch (type) {
                case 'email':
                    return value ? (
                        <a href={`mailto:${value}`} className="text-blue-500 hover:underline">
                            {value}
                        </a>
                    ) : (
                        '-'
                    );
                case 'phone':
                    return value ? (
                        <a href={`tel:${value}`} className="text-700 hover:underline">
                            {value}
                        </a>
                    ) : (
                        '-'
                    );
                case 'website':
                    return value ? (
                        <a href={value.startsWith('http://') || value.startsWith('https://') ? value : `http://${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {value}
                        </a>
                    ) : (
                        '-'
                    );
                case 'boolean':
                    return (
                        <div className="flex align-items-center">
                            <i className={`pi mr-2 ${value ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'} text-xl`}></i>
                            <span className={`font-medium ${value ? 'text-green-700' : 'text-red-700'}`}>{value ? 'Yes' : 'No'}</span>
                        </div>
                    );
                case 'status':
                    return (
                        <Tag
                            value={value}
                            severity={value === 'Inactive' ? 'secondary' : 'success'}
                            icon={`pi ${value === 'Inactive' ? 'pi-circle' : 'pi-check-circle'}`}
                            className={`ml-3 ${value === 'Inactive' ? 'p-tag-secondary' : ''}`}
                            style={value === 'Inactive' ? { background: 'red', width: 'max-content' } : {}}
                        />
                    );
                case 'address':
                    return <TruncatedText text={value} />;
                case 'masked':
                    return value ? '*'.repeat(value.length - 4) + value.slice(-4) : 'N/A';
                default:
                    return <span className="text-700">{value || 'N/A'}</span>;
            }
        };

        return (
            <div className="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                <div className="text-700 font-semibold pr-3">{label}</div>
                <div className="text-900 text-right">{renderValue()}</div>
            </div>
        );
    };

    const renderInfoSection = (title, children, icon) => {
        return (
            <Card
                className="mb-4 shadow-2 border-round-xl overflow-hidden transform transition-all"
                title={
                    <div className="flex align-items-center">
                        <i className={`${icon} text-primary mr-3 text-2xl`}></i>
                        <span className="text-800 font-semibold text-lg">{title}</span>
                    </div>
                }
            >
                <div className="grid">
                    {children.map((child, index) => (
                        <div key={index} className="col-12">
                            {child}
                        </div>
                    ))}
                </div>
            </Card>
        );
    };

    const convertDate = (dateStr) => {
        try {
            const formattedDate = moment(dateStr).format('D MMM YYYY');
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };

    const renderOwnerHistorySection = () => {
        return (
            <Card
                className="mb-4 shadow-2 border-round-xl overflow-hidden transform transition-all"
                title={
                    <div className="flex align-items-center">
                        <i className={`pi mr-2 pi-history text-green-500 text-xl`}></i>
                        <span className="text-800 font-semibold text-lg">Owner History</span>
                    </div>
                }
            >
                <Timeline value={chengeValue(propertyOwnerhistory)} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
            </Card>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card title={item.ownerName} subTitle={`${convertDate(item?.startDate)}  To ${item?.endDate === 'Continue' ? item?.endDate : convertDate(item?.endDate)}`} className="historyCard">
                <div className="py-2">
                    <div className="text-500 font-medium">{'Email'}</div>
                    <div className="text-blue-500">
                        {item?.ownerEmail ? (
                            <a href={`mailto:${item.ownerEmail}`} className="text-blue-500 hover:underline">
                                {item.ownerEmail}
                            </a>
                        ) : (
                            '-'
                        )}
                    </div>
                </div>
                <div className="py-2">
                    <div className="text-500 font-medium">{'Mobile number'}</div>
                    <div className="text-900">
                        {item?.ownerMobileNumber ? (
                            <a href={`tel:${item.ownerMobileNumber}`} className="text-900 hover:underline">
                                {item.ownerMobileNumber}
                            </a>
                        ) : (
                            '-'
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    const customizedMarker = (item) => {
        return (
            <>
                <span className="flex w-2rem h-2rem align-items-center justify-content-center border-circle z-1 shadow-1 text-white font-semibold" style={{ background: '#43a047' }}>
                    {item?.index}
                </span>
                <div>{'Owner'}</div>
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
                    endDate: 'Continue'
                }
            ];
            val = [...val, ...currentData];
            let data = val.map((x, i) => ({
                ...x,
                index: i + 1
            }));
            data = data.reverse();
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Loader isLoading={isLoading} />
            <div className="surface-ground p-5 bg-blue-50 min-h-screen">
                <div className="container mx-auto">
                    {renderHeaderSection()}
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            {renderInfoSection(
                                'Personal Information',
                                [
                                    renderInfoRow('Property No.', propertyDataByid?.property_number || '-'),
                                    renderInfoRow('Email', propertyDataByid?.email || '-', 'email'),
                                    renderInfoRow('Mobile No.', propertyDataByid?.mobile_number || '-', 'phone'),
                                    renderInfoRow('Alternate No.', propertyDataByid?.alternate_number || '-', 'phone'),
                                    renderInfoRow('Created At', moment(propertyDataByid?.created_at).format('D MMM YY') || '-'),
                                    renderInfoRow('Updated At', moment(propertyDataByid?.updated_at).format('D MMM YY HH:mm') || '-')
                                ],
                                'pi pi-user'
                            )}
                        </div>
                        <div className="col-12 md:col-6">
                            {renderInfoSection(
                                'Business Information',
                                [
                                    renderInfoRow('Name', propertyDataByid?.company_name || '-'),
                                    renderInfoRow('Category', propertyDataByid?.category || '-'),
                                    renderInfoRow('Contact No.', propertyDataByid?.company_mobile_number || '-', 'phone'),
                                    renderInfoRow('Email', propertyDataByid?.company_email || '-', 'email'),
                                    renderInfoRow('Website', propertyDataByid?.website || '-', 'website'),
                                    renderInfoRow('Address', propertyDataByid?.company_address || '-')
                                ],
                                'pi pi-briefcase'
                            )}
                        </div>
                        <div className="col-12 md:col-6">
                            {renderInfoSection(
                                'Vehicle Information',
                                [
                                    renderInfoRow('2-wheeler Limit', propertyDataByid?.['2wheelerLimit'] || '-'),
                                    renderInfoRow('3-wheeler Limit', propertyDataByid?.['3wheelerLimit'] || '-'),
                                    renderInfoRow('4-wheeler Limit', propertyDataByid?.['4wheelerLimit'] || '-'),
                                    renderInfoRow(
                                        '2-wheeler',
                                        propertyDataByid?.['2wheelerTotal'] && propertyDataByid?.['2wheelerTotal'].length > 0
                                            ? propertyDataByid?.['2wheelerTotal'].map((a, i) => <Badge value={a} size="large" severity="success" className="mr-2 my-2" />)
                                            : '-'
                                    ),
                                    renderInfoRow(
                                        '3-wheeler',
                                        propertyDataByid?.['3wheelerTotal'] && propertyDataByid?.['3wheelerTotal'].length > 0
                                            ? propertyDataByid?.['3wheelerTotal'].map((a, i) => <Badge value={a} size="large" severity="success" className="mr-2 my-2" />)
                                            : '-'
                                    ),
                                    renderInfoRow(
                                        '4-wheeler',
                                        propertyDataByid?.['4wheelerTotal'] && propertyDataByid?.['4wheelerTotal'].length > 0
                                            ? propertyDataByid?.['4wheelerTotal'].map((a, i) => <Badge value={a} size="large" severity="success" className="mr-2 my-2" />)
                                            : '-'
                                    )
                                ],
                                'pi pi-car'
                            )}
                        </div>
                        <div className="col-12 md:col-6">{renderInfoSection('Visitor Setting Information', [renderInfoRow('Allow Guests', '-'), renderInfoRow('Allow Deliveries', '-'), renderInfoRow('Parking Access', '-')], 'pi pi-cog')}</div>
                    </div>
                    {propertyOwnerhistory && propertyOwnerhistory.length > 0 ? renderOwnerHistorySection() : ''}
                </div>
            </div>
        </>
    );
};
export default PropertyDetailView;
