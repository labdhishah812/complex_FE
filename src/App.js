import React, { useEffect, useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ScrollTop } from 'primereact/scrolltop';
import AppTopbar from './AppTopbar';
import AppInlineMenu from './AppInlineMenu';
import AppFooter from './AppFooter';
import AppMenu from './AppMenu';
import AppConfig from './AppConfig';
import AppRightMenu from './AppRightMenu';
import { AuthRoute, AdminRoute, SuperAdminRoute, UserRoute } from './routes';
import Dashboard from './Views/Pages/AdminPages/Dashboard/Dashboard';
import PrimeReact from 'primereact/api';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import moment from 'moment';
import Support from './Views/Pages/SuperAdminPages/Support';

import {
    Camera,
    LayoutDashboard,
    LandPlot,
    Car,
    NotebookPen,
    Megaphone,
    BriefcaseBusiness,
    UserCog,
    Users,
    Presentation,
    CalendarSearch,
    PhoneCall,
    Settings,
    Building,
    ThumbsUp,
    IndianRupee,
    Command,
    House,
    UserPen,
    ShieldEllipsis,
    NotepadText,
    X,
    ReceiptIndianRupee,
    HandCoins,
    BookImage,
    HousePlus,
    DoorOpenIcon
} from 'lucide-react';

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';
import Profile from './Views/Pages/authenticatedPages/Profile';
import Login from './Views/Pages/authenticatedPages/Login';
import MyProperty from './Views/Pages/authenticatedPages/myproperty';
import Revenue from './Views/Pages/SuperAdminPages/revenue';
import AboutUs from './Views/Pages/SuperAdminPages/AboutUs/Aboutus';
import AboutUsEdit from './Views/Pages/SuperAdminPages/AboutUs/EditPage';
import Copyright from './Views/Pages/SuperAdminPages/Copyright/FooterCR';
import FooterEdit from './Views/Pages/SuperAdminPages/Copyright/EditPage';
import PrivacyPolicyEdit from './Views/Pages/SuperAdminPages/PrivacyPolicy/EditPage';
import TocEdit from './Views/Pages/SuperAdminPages/Toc/EditPage';
import VehicleList from './Views/Pages/AdminPages/Vehicles/VehicleList';
import VehicleAssign from './Views/Pages/AdminPages/Vehicles/vehicleAdd';
import { handleUserDetails } from './redux/slice/AdminSlices/authSlice';
import jwtDecode from 'jwt-decode';
import ShopList from './Views/Pages/AdminPages/Shops/ShopList';
import MaintenanceList from './Views/Pages/AdminPages/Maintenance/MaintenanceList';
import PaymentView from './Views/Pages/AdminPages/Maintenance/paymentView';
import MaintenanceSetting from './Views/Pages/AdminPages/Maintenance/MaintenanceSetting';
import PropertyAssignList from './Views/Pages/AdminPages/PropertyAssign';
import BusinessDetail from './Views/Pages/AdminPages/PropertyAssign/businessDetail';
import PropertyTransfer from './Views/Pages/AdminPages/PropertyAssign/propertyTransfer';
import PropertyAssign from './Views/Pages/AdminPages/PropertyAssign/propertyAssign';
import PropertyView from './Views/Pages/AdminPages/PropertyAssign/propertyView';
import ComplexList from './Views/Pages/SuperAdminPages/Properties/propertyList';
import ComplexCreate from './Views/Pages/SuperAdminPages/Properties/createProperty';
import ComplaintList from './Views/Pages/AdminPages/Complaint/ComplaintList';
import ComplaintCreate from './Views/Pages/AdminPages/Complaint/ComplaintCreate';
import ComplaintView from './Views/Pages/AdminPages/Complaint/ComplaintView';
import Vendor from './Views/Pages/AdminPages/Vendor';
import VendorAdd from './Views/Pages/AdminPages/Vendor/vendorCreate';
import AnnouncementList from './Views/Pages/AdminPages/Announcement/AnnouncementList';
import AnnouncementCreate from './Views/Pages/AdminPages/Announcement/AnnouncementCreate';
import Error from './Views/Pages/Error';
import SuperAdminDashboard from './Views/Pages/SuperAdminPages/SuperAdminDashboard/SuperAdminDashboard';
import UserDashboard from './Views/Pages/UserPages/UserDashborad/UserDashboard';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'primereact/tooltip';
import BlockList from './Views/Pages/AdminPages/Block/BlockList';
import FloorList from './Views/Pages/AdminPages/Floor/FloorList';
import Rental from './Views/Pages/AdminPages/Rental';
import RentalCreate from './Views/Pages/AdminPages/Rental/rentalCreate';
import Roles from './Views/Pages/AdminPages/Roles';
import RoleCreate from './Views/Pages/AdminPages/Roles/roleCreate';
import Committee from './Views/Pages/AdminPages/Committee';
import CommitteeAdd from './Views/Pages/AdminPages/Committee/committeeCreate';
import Vizard from './Views/Pages/AdminPages/VizardPage';
import MaintenancePage from './Views/Pages/AdminPages/Settings/MaintenanceSetting';
import MaintenanceCreate from './Views/Pages/AdminPages/Settings/MaintenanceSettingCreate';
import VehicleSetting from './Views/Pages/AdminPages/Settings/VehicleSetting';
import Meeting from './Views/Pages/AdminPages/Meeting';
import CreateMeeting from './Views/Pages/AdminPages/Meeting/createMeeting';
import MeetingView from './Views/Pages/AdminPages/Meeting/meetingView';
import EmergencyContact from './Views/Pages/AdminPages/EmergencyContact';
import BuildingRules from './Views/Pages/AdminPages/BuildingRules';
import Event from './Views/Pages/AdminPages/Event';
import EventCreate from './Views/Pages/AdminPages/Event/eventCreate';
import Notice from './Views/Pages/AdminPages/Notice';
import NoticeCreate from './Views/Pages/AdminPages/Notice/createNotice';
import NoticeView from './Views/Pages/AdminPages/Notice/noticeView';
import GateKeeper from './Views/Pages/AdminPages/GateKepper';
import GateKepperAdd from './Views/Pages/AdminPages/GateKepper/createGateKeeper';
import { getStepperDetails } from './redux/slice/AdminSlices/authSlice';
import { getProfileDetailsRequest } from './redux/slice/AdminSlices/authSlice';
import { replace } from 'formik';
import axios from 'axios';
import ContractList from './Views/Pages/AdminPages/Contract/ContractList';
import ContractCreate from './Views/Pages/AdminPages/Contract/ContractCreate';
import ContractView from './Views/Pages/AdminPages/Contract/ContractView';
import FixDepositList from './Views/Pages/AdminPages/FixDeposit/FixDepositList';
import FixDepositCreate from './Views/Pages/AdminPages/FixDeposit/FixDepositCreate';
import FixDepositView from './Views/Pages/AdminPages/FixDeposit/FixDepositView';
import ExpenseList from './Views/Pages/AdminPages/Expense/ExpenseList';
import ExpenseCreate from './Views/Pages/AdminPages/Expense/ExpenseCreate';
import ExpenseView from './Views/Pages/AdminPages/Expense/ExpenseView';
import Notifications from './Views/Pages/AdminPages/Notifications/Notifications';
import Fides from './Views/Pages/AdminPages/Fides';
import CreateFides from './Views/Pages/AdminPages/Fides/createFides';
import Tenant from './Views/Pages/AdminPages/Tenant';
import TenantCreate from './Views/Pages/AdminPages/Tenant/createTenant';
import Resolutions from './Views/Pages/AdminPages/Resolutions';
import CreateResolutions from './Views/Pages/AdminPages/Resolutions/createResolutions';
import GeneralCoreMembers from './Views/Pages/AdminPages/GeneralCoreMembers';
import CreateCoreMembers from './Views/Pages/AdminPages/GeneralCoreMembers/createCoreMembers';
import RentalTransfer from './Views/Pages/AdminPages/Rental/rentalTransfer';
import TenantTransfer from './Views/Pages/AdminPages/Tenant/tenantTransfer';
import EditFeeds from './Views/Pages/AdminPages/Fides/editFeeds';
import PropertyDetails from './Views/Pages/SuperAdminPages/Properties/propertyDetails';
import { BsPeople } from 'react-icons/bs';
import SalesmanList from './Views/Pages/SuperAdminPages/SalesManagement/salesmanList';
import CreateSalesman from './Views/Pages/SuperAdminPages/SalesManagement/createSalesman';
import SalesmanDashboard from './Views/Pages/SalesmanPages/salesmanDashboard';
import SalemanPropertyCreate from './Views/Pages/SalesmanPages/salemanPropertyCreate';
import SalesManRoute from './routes/SalesManRoute';
import SalesmanPropertyDetails from './Views/Pages/SalesmanPages/SalesmanPropertyDetails';
import EditProperty from './Views/Pages/SuperAdminPages/Properties/editProperty';
import RolesCreateSuperAdmin from './Views/Pages/SuperAdminPages/Roles/rolesCreateSuperAdmin';
import RolesListSuperAdmin from './Views/Pages/SuperAdminPages/Roles';
import VendorView from './Views/Pages/AdminPages/Vendor/vendorView';
import ResolutionView from './Views/Pages/AdminPages/Resolutions/resolutionView';
import RoleView from './Views/Pages/AdminPages/Roles/roleView';
import RoleViewSuperAdmin from './Views/Pages/SuperAdminPages/Roles/roleViewSuperAdmin';
import EventView from './Views/Pages/AdminPages/Event/eventView';
import AnnoucementView from './Views/Pages/AdminPages/Announcement/AnnouncementView';
import ContractRenewalForm from './Views/Pages/AdminPages/Contract/ContractRenewalForm';
import GatekeeperDetails from './Views/Pages/AdminPages/GateKepper/gatekeeperDetails';
import Gatepass from './Views/Pages/AdminPages/Gatepass';
import GatePassAdd from './Views/Pages/AdminPages/Gatepass/createGatePass';
import GatePassDetails from './Views/Pages/AdminPages/Gatepass/gatePassDetails';
import QRView from './Views/Pages/AdminPages/Gatepass/QRView';
import AddBuildingRules from './Views/Pages/AdminPages/BuildingRules/createBuildingRules';
import BuildingRulesDetails from './Views/Pages/AdminPages/BuildingRules/buildingRulesView';
import SwitchPropertyPage from './Views/Pages/authenticatedPages/SwitchPropertyPage';

export const RTLContext = React.createContext();

const App = () => {
    const [menuMode, setMenuMode] = useState('static');
    const [inlineMenuPosition, setInlineMenuPosition] = useState('bottom');
    const [desktopMenuActive, setDesktopMenuActive] = useState(true);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [activeTopbarItem, setActiveTopbarItem] = useState(null);
    const [colorMode, setColorMode] = useState('light');
    const [rightMenuActive, setRightMenuActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [inputStyle, setInputStyle] = useState('outlined');
    const [isRTL, setRTL] = useState(false);
    const [ripple, setRipple] = useState(true);
    const [mobileTopbarActive, setMobileTopbarActive] = useState(false);
    const [menuTheme, setMenuTheme] = useState('light');
    // const [topbarTheme, setTopbarTheme] = useState('blue');
    const [topbarTheme, setTopbarTheme] = useState('green');
    const [theme, setTheme] = useState('indigo');
    const [isInputBackgroundChanged, setIsInputBackgroundChanged] = useState(false);
    const [inlineMenuActive, setInlineMenuActive] = useState({});
    const [newThemeLoaded, setNewThemeLoaded] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [announcementBanner, setAnnouncementBanner] = useState(null);
    const [checkVizardForm, letCheckVizardForm] = useState(false);
    const [decode, setDecode] = useState(null);
    const [closeBanner, setCloseBanner] = useState(true);
    const { token, stepperDetail, loginDetails } = useSelector((store) => store.auth);
    const { isLoading } = useSelector((store) => store.announcement);
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    // const { structureViewDetail } = useSelector((store) => store.block);
    // const { MaintenanceSettingData } = useSelector((store) => store.maintenance);
    // console.log(loginDetails, "loginDetails");
    // console.log(window.location.pathname, "window.location.pathname");
    const stripHtmlTags = (html) => {
        return html.replace(/<[^>]*>/g, '');
    };

    const copyTooltipRef = useRef();
    let currentInlineMenuKey = useRef(null);
    const location = useLocation();
    PrimeReact.ripple = true;

    let searchClick;
    let topbarItemClick;
    let menuClick;
    let inlineMenuClick;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const getRole = async (token) => {
    //     let decodeData = await jwtDecode(token);
    //     if (decodeData?.role !== 'Super Admin') {
    //         dispatch(getStepperDetails());
    //         // let sendData = {};
    //         // if (decodeData?.is_ground_floor_exist_in_property) sendData.is_ground_floor_exist_in_property = decodeData?.is_ground_floor_exist_in_property;
    //         // if (decodeData?.is_block_exist_in_property) sendData.is_block_exist_in_property = decodeData?.is_block_exist_in_property;
    //         // if (decodeData?.is_floor_exist_in_property) sendData.is_floor_exist_in_property = decodeData?.is_floor_exist_in_property;
    //         // if (decodeData?.is_house_exist_in_property) sendData.is_house_exist_in_property = decodeData?.is_house_exist_in_property;
    //         // if (sendData.is_block_exist_in_property === true && (sendData.is_floor_exist_in_property === true || sendData.is_house_exist_in_property === true)) {
    //         //     dispatch(structureViewRequest(sendData));
    //         // } else if (!sendData.is_block_exist_in_property && !sendData.is_house_exist_in_property && sendData.is_floor_exist_in_property === true) {
    //         //     dispatch(floorStructureViewRequest());
    //         // } else {
    //         //     dispatch(structureViewRequest({ is_block_exist_in_property: false, is_house_exist_in_property: true }));
    //         // }
    //         // dispatch(getMaintenanceSettingRequest());
    //     }
    //     setDecode(decodeData);
    //     dispatch(handleUserDetails(decodeData));
    // };
    useEffect(() => {
        getAnnouncementCall();
        if (token === null) {
            // getRole(token);
            navigate(`/login`);
        } else if (token && loginDetails?.role_permissions.length !== 0) {
            // navigate(`/superadmin/dashboard`);
            dispatch(getStepperDetails());
        }

        if (token && loginDetails) {
            dispatch(getProfileDetailsRequest(loginDetails._id));
        }
    }, [dispatch, isLoading]);
    useEffect(() => {
        if (token) {
            checkVizard();
        }
    }, [stepperDetail]);
    const getAnnouncementCall = async () => {
        try {
            if (loginDetails?._id && loginDetails?.user_connect_with_property_id && loginDetails?.role !== 'Super Admin') {
                const { data } = await axios.get(`${BASE_URL_API}/announcement/banner/${loginDetails?.user_connect_with_property_id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        Authorization: token
                    }
                });
                if (data?.statusCode === 200) {
                    setAnnouncementBanner(data?.data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    // useEffect(() => {
    //     if (token === null) {
    //         // getRole(token);
    //         navigate(`/login`);
    //     } else if (token && loginDetails?.role_permissions.length !== 0) {
    //         // navigate(`/superadmin/dashboard`);
    //         dispatch(getStepperDetails());
    //     }
    // }, [dispatch, token]);

    // }, [stepperDetail])
    // useEffect(() => {
    //     if (loginDetails !== null) {
    //         dynamicMenu();
    //     }
    // }, [loginDetails]);
    // useEffect(() => {
    //     if (decode?.role === 'Chairman' && structureViewDetail?.data.length > 0 && MaintenanceSettingData?.data.length > 0) {
    //         decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
    //             decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
    //             navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
    //     }
    // }, [structureViewDetail, MaintenanceSettingData]);

    // const itemList = [
    //     {
    //         label: 'Dashboard',
    //         module_name: 'dashboard',
    //         // icon: 'pi pi-fw pi-home',
    //         icon: <LayoutDashboard size={17} />,
    //         to: '/property-management/dashboard'
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`
    //     },
    //     {
    //         label: 'Property',
    //         // module_name: 'user-property-assign',
    //         // icon: 'pi pi-fw pi-user',
    //         icon: <LandPlot size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`
    //         // to: '/property-management/property-assign'
    //         items: [
    //             {
    //                 label: 'Properties',
    //                 module_name: 'user-property-assign',
    //                 to: '/property-management/property-assign'
    //             },
    //             {
    //                 label: 'Property Structure',
    //                 module_name: 'property-structure',
    //                 // icon: 'pi pi-fw pi-building',
    //                 to: '/property-management/property-structure'
    //                 // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-structure`
    //                 // to: '/admin/property-structure'
    //             }
    //         ]
    //     },
    //     {
    //         label: 'Tenants',
    //         module_name: 'user-property-assign',
    //         // icon: 'pi pi-fw pi-truck',
    //         icon: <HousePlus size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vehicle`
    //         to: '/property-management/tenant'
    //     },
    //     {
    //         label: 'Vehicles',
    //         module_name: 'vehicle',
    //         // icon: 'pi pi-fw pi-truck',
    //         icon: <Car size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vehicle`
    //         to: '/property-management/vehicle'
    //     },
    //     {
    //         label: 'Maintenance',
    //         module_name: 'maintenance',
    //         // icon: 'pi pi-fw pi-file-o',
    //         icon: <ReceiptIndianRupee size={17} />,
    //         to: '/property-management/maintenancelist'
    //     },
    //     // {
    //     //     label: 'Expense',
    //     //     module_name: 'expense_tracker',
    //     //     // icon: 'pi pi-fw pi-file-o',
    //     //     icon: <ReceiptIndianRupee size={17} />,
    //     //     to: '/property-management/expense'
    //     // },
    //     // {
    //     //     label: 'Maintenances',
    //     //     module_name: 'maintenance',
    //     //     icon: 'pi pi-fw pi-wrench',
    //     //     //   to: ''
    //     //     items: [
    //     //         {
    //     //             label: 'Maintenances Info',
    //     //             icon: 'pi pi-fw pi-list',
    //     //             // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenancelist`
    //     //             // to: '/admin/maintenancelist'
    //     //         },
    //     //         {
    //     //             label: 'Setting',
    //     //             icon: 'pi pi-fw pi-list',
    //     //             // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenance-setting`
    //     //             // to: '/admin/maintenance-setting'
    //     //         }
    //     //     ]
    //     // },
    //     {
    //         label: 'Complaints',
    //         module_name: 'complaint',
    //         // icon: 'pi pi-fw pi-pencil',
    //         icon: <NotebookPen size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`
    //         to: '/property-management/complain'
    //     },
    //     {
    //         label: 'Notice',
    //         module_name: 'notice',
    //         // icon: 'pi pi-fw pi-pencil',
    //         icon: <NotepadText size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`
    //         to: '/property-management/notice'
    //     },

    //     {
    //         label: 'Announcements',
    //         module_name: 'announcement',
    //         // icon: 'pi pi-fw pi-megaphone',
    //         icon: <Megaphone size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/announcement`
    //         to: '/property-management/announcements'
    //     },
    //     {
    //         label: 'Vendors',
    //         module_name: 'vendor',
    //         // icon: 'pi pi-fw pi-briefcase',
    //         icon: <BriefcaseBusiness size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`
    //         to: '/property-management/vendor'
    //     },
    //     {
    //         label: 'Feeds',
    //         module_name: 'user-property-assign',
    //         // icon: 'pi pi-fw pi-truck',
    //         icon: <BookImage size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vehicle`
    //         to: '/property-management/fides'
    //     },
    //     // {
    //     //     label: 'Contract',
    //     //     module_name: 'contract',
    //     //     // icon: 'pi pi-fw pi-briefcase',
    //     //     icon: <UserPen size={17} />,
    //     //     // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`
    //     //     to: '/property-management/contract'
    //     // },
    //     // {
    //     //     label: 'Contract',
    //     //     module_name: 'contract',
    //     //     // icon: 'pi pi-fw pi-briefcase',
    //     //     icon: <BriefcaseBusiness size={17} />,
    //     //     // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`
    //     //     to: '/property-management/contract'
    //     // },
    //     // {
    //     //     label: 'Rental',
    //     //     module_name: 'rental',
    //     //     // icon: 'pi pi-fw pi-money-bill',
    //     //     icon: <House size={17} />,
    //     //     // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/rental`
    //     //     // to: '/admin/rental'
    //     //     to: '/property-management/rental'
    //     // },
    //     {
    //         label: 'Roles',
    //         module_name: 'role',
    //         // icon: 'pi pi-fw pi-users',
    //         icon: <UserCog size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/roles`
    //         // to: '/admin/roles'
    //         to: '/property-management/roles'
    //     },
    //     // {
    //     //     label: 'Committee',
    //     //     module_name: 'committee-member',
    //     //     // icon: 'pi pi-fw pi-users',
    //     //     icon: <Users size={17} />,
    //     //     to: '/property-management/committee'
    //     //     // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`
    //     //     // to: '/admin/committee'
    //     // },
    //     {
    //         label: 'Committee',
    //         icon: <Users size={17} />,
    //         items: [
    //             {
    //                 label: 'Core Members',
    //                 module_name: 'committee-member',
    //                 to: '/property-management/committee'
    //             },
    //             {
    //                 label: 'General Core Members',
    //                 module_name: 'committee-member',
    //                 to: '/property-management/general-core-members'
    //             }
    //         ]
    //     },
    //     // {
    //     //     label: 'Meetings',
    //     //     module_name: 'meeting',
    //     //     // icon: 'pi pi-fw pi-users',
    //     //     icon: <Presentation size={17} />,
    //     //     to: '/property-management/meeting'
    //     //     // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`
    //     //     // to: '/admin/committee'
    //     // },
    //     {
    //         label: 'Meeting',
    //         // module_name: 'user-property-assign',
    //         // icon: 'pi pi-fw pi-user',
    //         icon: <Presentation size={17} />,
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`
    //         // to: '/property-management/property-assign'
    //         items: [
    //             {
    //                 label: 'Meetings',
    //                 module_name: 'meeting',
    //                 to: '/property-management/meeting'
    //             },
    //             {
    //                 label: 'Resolutions',
    //                 module_name: 'meeting',
    //                 // icon: 'pi pi-fw pi-building',
    //                 to: '/property-management/resolutions'
    //                 // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-structure`
    //                 // to: '/admin/property-structure'
    //             }
    //         ]
    //     },
    //     {
    //         label: 'Events',
    //         module_name: 'event',
    //         // icon: 'pi pi-fw pi-th-large',
    //         icon: <CalendarSearch size={17} />,
    //         to: '/property-management/event'
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`
    //         // to: '/admin/committee'
    //     },
    //     {
    //         label: 'Emergency Contacts',
    //         module_name: 'emergencycontact',
    //         // icon: 'pi pi-fw pi-phone',
    //         icon: <PhoneCall size={17} />,
    //         to: '/property-management/emergency-contact'
    //         // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`
    //         // to: '/admin/committee'
    //     },
    //     // {
    //     //     label: 'Fix Deposit',
    //     //     module_name: 'fixeddeposit',
    //     //     // icon: 'pi pi-fw pi-briefcase',
    //     //     icon: <ShieldEllipsis size={17} />,
    //     //     // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`
    //     //     to: '/property-management/fixdeposit'
    //     // },
    //     // {
    //     //     label: 'Property Structure',
    //     //     module_name: 'property-structure',
    //     //     icon: 'pi pi-fw pi-building',
    //     //     to: "/property-management/property-structure"
    //     //     // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-structure`
    //     //     // to: '/admin/property-structure'
    //     // },
    //     {
    //         label: 'Account',
    //         module_name: 'account',
    //         // icon: 'pi pi-fw pi-cog',
    //         icon: <HandCoins size={17} />,
    //         items: []
    //     },
    //     {
    //         label: 'Settings',
    //         module_name: 'settings',
    //         // icon: 'pi pi-fw pi-cog',
    //         icon: <Settings size={17} />,
    //         items: []
    //     }
    // ];

    const itemList = [
        {
            label: 'Dashboard',
            module_name: 'dashboard',
            // icon: 'pi pi-fw pi-home',
            icon: <LayoutDashboard size={17} />,
            to: '/property-management/dashboard'
            // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`
        },
        {
            label: 'Property Management',
            // module_name: 'user-property-assign',
            // icon: 'pi pi-fw pi-user',
            icon: <LandPlot size={17} />,
            // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`
            // to: '/property-management/property-assign'
            items: [
                {
                    label: 'Properties',
                    module_name: 'user-property-assign',
                    to: '/property-management/property-assign'
                },
                {
                    label: 'Property Structure',
                    module_name: 'property-structure',
                    // icon: 'pi pi-fw pi-building',
                    to: '/property-management/property-structure'
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-structure`
                    // to: '/admin/property-structure'
                },
                {
                    label: 'Tenants',
                    module_name: 'user-property-assign',
                    // icon: 'pi pi-fw pi-building',
                    to: '/property-management/tenant'
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-structure`
                    // to: '/admin/property-structure'
                }
            ]
        },
        {
            label: 'Vehicle Management',
            icon: <Car size={17} />,
            items: [
                {
                    label: 'Vehicles',
                    module_name: 'vehicle',
                    // icon: 'pi pi-fw pi-truck',
                    // icon: <Car size={17} />,
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vehicle`
                    to: '/property-management/vehicle'
                }
            ]
        },
        {
            label: 'Maintenance & Operations',
            // module_name: 'user-property-assign',
            // icon: 'pi pi-fw pi-user',
            icon: <ReceiptIndianRupee size={17} />,
            // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`
            // to: '/property-management/property-assign'
            items: [
                {
                    label: 'Maintenance',
                    module_name: 'maintenance',
                    // icon: 'pi pi-fw pi-file-o',
                    // icon: <ReceiptIndianRupee size={17} />,
                    to: '/property-management/maintenancelist'
                },
                {
                    label: 'Complaints',
                    module_name: 'complaint',
                    // icon: 'pi pi-fw pi-pencil',
                    // icon: <NotebookPen size={17} />,
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`
                    to: '/property-management/complain'
                }
            ]
        },
        {
            label: 'Meetings',
            // module_name: 'user-property-assign',
            // icon: 'pi pi-fw pi-user',
            icon: <Presentation size={17} />,
            // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`
            // to: '/property-management/property-assign'
            items: [
                {
                    label: 'Meetings',
                    module_name: 'meeting',
                    to: '/property-management/meeting'
                },
                {
                    label: 'Resolutions',
                    module_name: 'meeting',
                    // icon: 'pi pi-fw pi-building',
                    to: '/property-management/resolutions'
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-structure`
                    // to: '/admin/property-structure'
                }
            ]
        },
        {
            label: 'Feeds',
            module_name: 'user-property-assign',
            // icon: 'pi pi-fw pi-truck',
            icon: <BookImage size={17} />,
            // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vehicle`
            to: '/property-management/feeds'
        },
        {
            label: 'Communication & Events',
            // module_name: 'user-property-assign',
            // icon: 'pi pi-fw pi-user',
            icon: <CalendarSearch size={17} />,
            // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`
            // to: '/property-management/property-assign'
            items: [
                {
                    label: 'Notice',
                    module_name: 'notice',
                    // icon: 'pi pi-fw pi-pencil',
                    // icon: <NotepadText size={17} />,
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`
                    to: '/property-management/notice'
                },
                {
                    label: 'Announcements',
                    module_name: 'announcement',
                    // icon: 'pi pi-fw pi-megaphone',
                    // icon: <Megaphone size={17} />,
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/announcement`
                    to: '/property-management/announcements'
                },
                {
                    label: 'Events',
                    module_name: 'event',
                    // icon: 'pi pi-fw pi-th-large',
                    // icon: <CalendarSearch size={17} />,
                    to: '/property-management/event'
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`
                    // to: '/admin/committee'
                }
            ]
        },
        {
            label: 'Service Providers',
            // module_name: 'user-property-assign',
            // icon: 'pi pi-fw pi-user',
            icon: <BriefcaseBusiness size={17} />,
            // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`
            // to: '/property-management/property-assign'
            items: [
                {
                    label: 'Vendors',
                    module_name: 'vendor',
                    // icon: 'pi pi-fw pi-briefcase',
                    // icon: <BriefcaseBusiness size={17} />,
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`
                    to: '/property-management/vendor'
                },
                {
                    label: 'Emergency Contacts',
                    module_name: 'emergencycontact',
                    // icon: 'pi pi-fw pi-phone',
                    to: '/property-management/emergency-contact'
                    // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`
                    // to: '/admin/committee'
                }
            ]
        },
        {
            label: 'Committee Members',
            icon: <Users size={17} />,
            items: [
                {
                    label: 'Core Members',
                    module_name: 'committee-member',
                    to: '/property-management/committee'
                },
                {
                    label: 'General Core Members',
                    module_name: 'committee-member',
                    to: '/property-management/general-core-members'
                },
            ]
        },
        {
            label: 'Visitor and Gate Control',
            icon: <DoorOpenIcon size={17} />,
            items: [
                {
                    label: 'Gate Keeper',
                    module_name: 'gatekeeper',
                    to: '/property-management/gate-keeper'
                },
                {
                    label: 'Gatepass',
                    module_name: 'gatepass',
                    to: '/property-management/gatepass'
                }
            ]
        },
        {
            label: 'Roles & Permissions',
            icon: <UserCog size={17} />,
            items: [
                {
                    label: 'Roles & Permissions',
                    module_name: 'role',
                    to: '/property-management/roles'
                },
                // {
                //     label: 'Building Rules',
                //     module_name: 'buildingrules',
                //     to: `/property-management/buildingrules`
                // }
            ]
        },
        {
            label: 'Finance Management',
            module_name: 'account',
            // icon: 'pi pi-fw pi-cog',
            icon: <HandCoins size={17} />,
            items: []
        },
        {
            label: 'Settings',
            module_name: 'settings',
            // icon: 'pi pi-fw pi-cog',
            icon: <Settings size={17} />,
            items: []
        }
    ];
    const dynamicMenu = () => {
        let menu = [];
        if (loginDetails !== null) {
            itemList.forEach((a) => {
                let menItem = null;
                if (a.module_name === 'settings') {
                    let settingSub = [
                        {
                            label: 'Maintenance Setting',
                            module_name: 'maintenance-settings',
                            to: `/property-management/maintenance-setting`
                        },
                        {
                            label: 'Vehicle Setting',
                            module_name: 'vehicle',
                            to: `/property-management/vehicle-setting`
                        },
                        {
                            label: 'Building Rules',
                            module_name: 'buildingrules',
                            to: `/property-management/buildingrules`
                        }
                    ];
                    settingSub.forEach((x, i) => {
                        if (x.module_name === 'vehicle') {
                            let subm = null;
                            let data = loginDetails?.role_permissions.filter((x) => x.role !== 'User');
                            data.forEach((j) => {
                                let check = j.permission.find((z) => z.module_name === x.module_name)?.module_access.findIndex((y) => y === 'update');
                                if (check !== undefined && check !== -1 && subm === null) {
                                    subm = x;
                                    // a.items.push(x);
                                }
                            });
                            subm && a.items.push(subm);
                        } else {
                            let subm = null;
                            loginDetails?.role_permissions.forEach((b, i) => {
                                let check = b.permission.find((z) => z.module_name === x.module_name)?.module_access.findIndex((y) => y === 'read');
                                if (check !== undefined && check !== -1 && subm === null) {
                                    subm = x;
                                    // a.items.push(x);
                                }
                            });
                            subm && a.items.push(subm);
                        }
                    });
                    a.items.length > 0 && menu.push(a);
                } else if (a.module_name === 'account') {
                    let settingSub = [
                        {
                            label: 'Expense',
                            module_name: 'expense_tracker',
                            // icon: 'pi pi-fw pi-file-o',
                            // icon: <ReceiptIndianRupee size={17} />,
                            to: '/property-management/expense'
                        },
                        {
                            label: 'Contract',
                            module_name: 'contract',
                            // icon: 'pi pi-fw pi-briefcase',
                            // icon: <UserPen size={17} />,
                            // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`
                            to: '/property-management/contract'
                        },
                        {
                            label: 'Fix Deposit',
                            module_name: 'fixeddeposit',
                            // icon: 'pi pi-fw pi-briefcase',
                            // icon: <ShieldEllipsis size={17} />,
                            // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`
                            to: '/property-management/fixdeposit'
                        }
                    ];
                    settingSub.forEach((x, i) => {
                        let subm = null;
                        loginDetails?.role_permissions.forEach((b, i) => {
                            let check = b.permission.find((z) => z.module_name === x.module_name)?.module_access.findIndex((y) => y === 'read');
                            if (check !== undefined && check !== -1 && subm === null) {
                                subm = x;
                                // a.items.push(x);
                            }
                        });
                        subm && a.items.push(subm);
                    });
                    a.items.length > 0 && menu.push(a);
                } else {
                    if (a.items) {
                        let subm = {
                            icon: a.icon,
                            label: a.label,
                            items: []
                        };
                        a.items.forEach((z) => {
                            loginDetails?.role_permissions.forEach((b, i) => {
                                let check = b.permission.find((x) => x.module_name === z.module_name)?.module_access.findIndex((y) => y === 'read');
                                if (
                                    check !== undefined &&
                                    check !== -1 &&
                                    (z.module_name === 'meeting' || z.module_name === 'committee-member' || z.module_name === 'user-property-assign'
                                        ? subm?.items.findIndex((x) => x.label === z.label) === -1
                                        : subm?.items.findIndex((x) => x.module_name === z.module_name) === -1)
                                ) {
                                    subm.items.push(z);
                                }
                            });
                        });
                        if (subm.items.length > 0) menItem = subm;
                    } else {
                        loginDetails?.role_permissions.forEach((b, i) => {
                            let check = b.permission.find((x) => x.module_name === a.module_name)?.module_access.findIndex((y) => y === 'read');
                            if (check !== undefined && check !== -1 && menItem === null) {
                                menItem = a;
                            }
                        });
                    }
                }
                menItem && menu.push(menItem);
            });
        }
        // if (decode !== null) {
        //     itemList.forEach((a) => {
        //         let check = decode.role_permissions.findIndex((x) => x.module_name === a.module_name && x.module_access.findIndex((a) => a === 'read') !== -1);
        //         if (decode.role !== 'Chairman' && a.module_name === 'maintenance') {
        //             let array = ['maintenance', 'maintenance-settings'];
        //             let maintenanceItem = {
        //                 label: 'Maintenances',
        //                 module_name: 'maintenance',
        //                 icon: 'pi pi-fw pi-wrench',
        //                 items: []
        //             };
        //             array.forEach((y) => {
        //                 let check2 = decode.role_permissions.findIndex((x) => x.module_name === y && x.module_access.findIndex((a) => a === 'read') !== -1);
        //                 if (y === 'maintenance-settings' && check2 !== -1) {
        //                     maintenanceItem.items.push({
        //                         label: 'Setting',
        //                         icon: 'pi pi-fw pi-list',
        //                         to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenance-setting`
        //                         // to: '/admin/maintenance-setting'
        //                     });
        //                 } else if (check2 !== -1) {
        //                     maintenanceItem.items.push({
        //                         label: 'Maintenances Info',
        //                         icon: 'pi pi-fw pi-list',
        //                         to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenancelist`
        //                         // to: '/admin/maintenancelist'
        //                     });
        //                 }
        //             });
        //             maintenanceItem?.items.length > 0 && menu.push(maintenanceItem);
        //         } else if (check !== -1) {
        //             menu.push(a);
        //         }

        //         // if (check !== -1) {
        //         //     if (decode.role !== 'Chairman' && a.module_name === 'maintenance') {
        //         //         let maintenanceItem = {
        //         //             label: 'Maintenances',
        //         //             module_name: 'maintenance',
        //         //             icon: 'pi pi-fw pi-wrench',
        //         //             //   to: ''
        //         //             items: [
        //         //                 {
        //         //                     label: 'Maintenances Info',
        //         //                     icon: 'pi pi-fw pi-list',
        //         //                     to: `/${decode ? decode?.property_name && decode?.property_name.replace(' ', '-').toLowerCase() : ''}/maintenancelist`
        //         //                     // to: '/admin/maintenancelist'
        //         //                 }
        //         //             ]
        //         //         };
        //         //         menu.push(maintenanceItem);
        //         //     } else {
        //         //         menu.push(a);
        //         //     }
        //         // }
        //     });
        // }
        let marge = [];
        menu = [...menu, ...marge];
        return menu;
    };
    const checkVizard = () => {
        try {
            let check = false;
            if (decode?.role !== 'Super Admin' && stepperDetail?.maintenanceSettingExists && stepperDetail?.propertyStructureExists && stepperDetail?.vehicleSettingExists) {
                check = true;
                letCheckVizardForm(true);
            }
            // if (check) {
            //     decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //         decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //         navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
            // }
            // } else if (decode?.role === 'Chairman' && structureViewDetail?.data.length > 0 && MaintenanceSettingData?.data.length > 0) {
            //     check = true;
            // }
            return check;
        } catch (error) {
            console.log(error);
        }
    };
    // const menu = [
    //     //.......USER ROUTE...........//
    //     loginDetails?.role === 'Super Admin'
    //         ? {
    //               // Super ADMIN ROUTE
    //               label: '',
    //               items: [
    //                   {
    //                       label: 'Dashboard',
    //                       icon: <LayoutDashboard size={17} />,
    //                       to: '/superadmin/dashboard'
    //                   },
    //                   {
    //                       label: 'Properties',
    //                       icon: <Building size={17} />,
    //                       to: '/superadmin/properties'
    //                   },
    //                   {
    //                       label: 'Sales Management',
    //                       icon: <BsPeople size={17} />,
    //                       to: '/superadmin/sales'
    //                   },
    //                   {
    //                       label: 'Sales Properties',
    //                       icon: <Building size={17} />,
    //                       to: '/salesman/dashboard'  // Salesman route
    //                   },
    //                   {
    //                       label: 'Supports',
    //                       icon: <ThumbsUp size={17} />,
    //                       to: '/superadmin/supports'
    //                   },
    //                   {
    //                       label: 'Revenue',
    //                       icon: <IndianRupee size={17} />,
    //                       to: '/superadmin/revenue'
    //                   },
    //                   {
    //                       label: 'CMS',
    //                       icon: <Command size={17} />,
    //                       items: [
    //                           {
    //                               label: 'Privacy Policy',
    //                               module_name: 'privacypolicy',
    //                               to: '/superadmin/privacypolicy'
    //                           },
    //                           {
    //                               label: 'Terms & Condition',
    //                               module_name: 'termscondition',
    //                               to: '/superadmin/termscondition'
    //                           },
    //                           {
    //                               label: 'About Us',
    //                               module_name: 'aboutus',
    //                               to: '/superadmin/aboutus'
    //                           },
    //                           {
    //                               label: 'Copyright',
    //                               module_name: 'copyright',
    //                               to: '/superadmin/copyright'
    //                           }
    //                       ]
    //                   }
    //               ]
    //           }
    //         :  loginDetails?.role === 'Salesman'
    //         ? {
    //               label: 'Sales Dashboard',
    //               items: [
    //                   {
    //                       label: 'Properties', // For Salesman Role
    //                       icon: <Building size={17} />,
    //                       to: '/salesman/dashboard'
    //                   },
    //                   // Add more items for the Salesman role here if needed
    //               ]
    //           }
    //         : {
    //               label: '',
    //               items: checkVizardForm ? dynamicMenu() : []
    //           } // Admin Route
    // ];

    // const menu = [
    //     {
    //         label: '',
    //         items: [
    //             {
    //                 label: 'Dashboard',
    //                 icon: 'pi pi-fw pi-home',
    //                 to: '/admin/dashboard'
    //             },
    //             {
    //                 label: 'Shops',
    //                 icon: 'pi pi-fw pi-building',
    //                 to: '/admin/shoplist'
    //             },
    //             {
    //                 label: 'Shops Owner',
    //                 icon: 'pi pi-fw pi-user',
    //                 to: '/admin/shopsownerlist'
    //             },
    //             {
    //                 label: 'Vehicles',
    //                 icon: 'pi pi-fw pi-truck',
    //                 to: '/admin/vehiclelist'
    //             },
    //             {
    //                 label: 'Maintenances',
    //                 icon: 'pi pi-fw pi-wrench',
    //                 to: '/admin/maintenancelist'
    //             },
    //             {
    //                 label: 'Complexes',
    //                 icon: 'pi pi-fw pi-building',
    //                 to: '/admin/complexlist'
    //             },
    //             {
    //                 label: 'Compliances',
    //                 icon: 'pi pi-fw pi-pencil',
    //                 to: '/admin/compliancelist'
    //             },

    //             {
    //                 label: 'Announcement',
    //                 icon: 'pi pi-fw pi-megaphone',
    //                 to: '/admin/announcementlist'
    //             },

    //         ]
    //     },

    // ];

    const menu = [
        //.......USER ROUTE...........//
        loginDetails?.role === 'Super Admin'
            ? {
                  //Super ADMIN ROUTE
                  label: '',
                  items: [
                      {
                          label: 'Dashboard',
                          // icon: 'pi pi-fw pi-home',
                          icon: <LayoutDashboard size={17} />,
                          to: '/superadmin/dashboard'
                      },
                      {
                          label: 'Properties',
                          // icon: 'pi pi-fw pi-building',
                          icon: <Building size={17} />,
                          to: '/superadmin/properties'
                      },
                      {
                          label: 'Roles',
                          // icon: 'pi pi-fw pi-building',
                          icon: <UserCog size={17} />,
                          to: '/superadmin/roles'
                      },
                      {
                          label: 'Employee Management',
                          // icon: 'pi pi-fw pi-building',
                          icon: <BsPeople size={17} />,
                          to: '/superadmin/sales'
                      },
                      //   {
                      //     label: 'Sales Properties',
                      //     icon: <Building size={17} />,
                      //     to: '/salesman/dashboard'
                      // },
                      {
                          label: 'Supports',
                          // icon: 'pi pi-fw pi-thumbs-up-fill',
                          icon: <ThumbsUp size={17} />,
                          to: '/superadmin/supports'
                      },
                      {
                          label: 'Revenue',
                          // icon: 'pi pi-fw pi-dollar',
                          icon: <IndianRupee size={17} />,
                          to: '/superadmin/revenue'
                      },
                      {
                          label: 'Advertisement',
                          // icon: 'pi pi-fw pi-dollar',
                          icon: <Megaphone size={17} />,
                          to: '/superadmin/advertisement'
                      },
                      {
                          label: 'Feed',
                          // icon: 'pi pi-fw pi-dollar',
                          icon: <BookImage size={17} />,
                          to: '/superadmin/feed'
                      },
                      {
                          label: 'CMS',
                          // module_name: 'user-property-assign',
                          // icon: 'pi pi-fw pi-cog',
                          icon: <Command size={17} />,
                          // to: `/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`
                          //   to: '/cms',
                          items: [
                              {
                                  label: 'Privacy Policy',
                                  module_name: 'privacypolicy',
                                  to: '/superadmin/privacypolicy'
                              },
                              {
                                  label: 'Terms & Condition',
                                  module_name: 'termscondition',
                                  to: '/superadmin/termscondition'
                              },
                              {
                                  label: 'About Us',
                                  module_name: 'aboutus',
                                  to: '/superadmin/aboutus'
                              },
                              {
                                  label: 'Copyright',
                                  module_name: 'copyright',
                                  to: '/superadmin/copyright'
                              }
                          ]
                      }
                  ]
              }
            : loginDetails?.user_connect_with_property_id === undefined
            ? {
                  //Super ADMIN ROUTE
                  label: '',
                  items: [
                      {
                          label: 'My Properties',
                          icon: 'pi pi-fw pi-home',
                          to: '/property-management/myproperties'
                      }
                  ]
              }
            : {
                  label: '',
                  items: checkVizardForm ? dynamicMenu() : []
                  // items: itemList
              } //ADMIN  ROUTE
        // roleName == 'Chairman'
        // ? {
        //       label: '',
        //       items: [
        //           {
        //               label: 'Dashboard',
        //               icon: 'pi pi-fw pi-home',
        //               to: '/admin/dashboard'
        //           },
        //           //   {
        //           //       label: 'Shops',
        //           //       icon: 'pi pi-fw pi-building',
        //           //       to: '/admin/shoplist'
        //           //   },
        //           {
        //               label: 'Property Assign',
        //               icon: 'pi pi-fw pi-user',
        //               to: '/admin/property-assign'
        //           },
        //           {
        //               label: 'Vehicles',
        //               icon: 'pi pi-fw pi-truck',
        //               to: '/admin/vehiclelist'
        //           },
        //           {
        //               label: 'Maintenances',
        //               icon: 'pi pi-fw pi-wrench',
        //               //   to: ''
        //               items: [
        //                   {
        //                       label: 'Maintenances Info',
        //                       icon: 'pi pi-fw pi-list',
        //                       to: '/admin/maintenancelist'
        //                   },
        //                   {
        //                       label: 'Setting',
        //                       icon: 'pi pi-fw pi-list',
        //                       to: '/admin/maintenance-setting'
        //                   }
        //               ]
        //           },
        //           {
        //               label: 'Complaints',
        //               icon: 'pi pi-fw pi-pencil',
        //               to: '/admin/complaintlist'
        //           },
        //           {
        //               label: 'Announcement',
        //               icon: 'pi pi-fw pi-megaphone',
        //               to: '/admin/announcementlist'
        //           },
        //           {
        //               label: 'Vendor',
        //               icon: 'pi pi-fw pi-users',
        //               to: '/admin/vendor'
        //           },
        //           {
        //               label: 'Rental',
        //               icon: 'pi pi-fw pi-money-bill',
        //               to: '/admin/rental'
        //           },
        //           {
        //               label: 'Roles',
        //               icon: 'pi pi-fw pi-users',
        //               to: '/admin/roles'
        //           },
        //           {
        //               label: 'Committee',
        //               icon: 'pi pi-fw pi-users',
        //               to: '/admin/committee'
        //           },
        //           {
        //               label: 'Property Structure',
        //               icon: 'pi pi-fw pi-building',
        //               to: '/admin/property-structure'
        //               //   label: 'Master',
        //               //   icon: 'pi pi-fw pi-cog',
        //               //   items: chairmanMaster
        //               //   items: [
        //               //       block !== null && {
        //               //           label: 'Block',
        //               //           icon: 'pi pi-fw pi-list',
        //               //           to: '/admin/blocklist'
        //               //       },
        //               //       floor !== null && {
        //               //           label: 'Floor',
        //               //           icon: 'pi pi-fw pi-list',
        //               //           to: '/admin/floorlist'
        //               //       },
        //               //       {
        //               //           label: 'House',
        //               //           icon: 'pi pi-fw pi-list'
        //               //           //   to: '/admin/floorlist'
        //               //       }
        //               //   ]
        //           }
        //       ]
        //   }
        // : {
        //       label: '',
        //       items: [
        //           {
        //               label: 'Dashboard',
        //               icon: 'pi pi-fw pi-home',
        //               to: '/dashboard'
        //           },
        //           {
        //               label: 'Property Assign',
        //               icon: 'pi pi-fw pi-user',
        //               to: '/property-assign'
        //           },
        //           {
        //               label: 'Vehicles',
        //               icon: 'pi pi-fw pi-truck',
        //               to: '/vehiclelist'
        //           },
        //           {
        //               label: 'Maintenances',

        //               icon: 'pi pi-fw pi-wrench',
        //               //   to: ''
        //               items: [
        //                   {
        //                       label: 'Maintenances Info',
        //                       icon: 'pi pi-fw pi-list',
        //                       to: '/maintenancelist'
        //                   }
        //               ]
        //           },
        //           {
        //               label: 'Complaints',
        //               icon: 'pi pi-fw pi-pencil',
        //               to: '/complaintlist'
        //           },
        //           {
        //               label: 'Announcement',
        //               icon: 'pi pi-fw pi-megaphone',
        //               to: '/announcementlist'
        //           },
        //           {
        //               label: 'Vendor',
        //               icon: 'pi pi-fw pi-users',
        //               to: '/vendor'
        //           },
        //           {
        //               label: 'Rental',
        //               icon: 'pi pi-fw pi-money-bill',
        //               to: '/rental'
        //           }
        //       ]
        //   }
    ];

    const salesmanMenu = [
        // Check if the role is Salesman
        ...(loginDetails?.role === 'Salesman'
            ? [
                  {
                      // Salesman-specific routes
                      label: '',
                      items: [
                          {
                              label: 'Properties',
                              icon: <Building size={17} />,
                              to: '/salesman/dashboard'
                          }
                      ]
                  }
              ]
            : []) // If not Salesman, return an empty array
    ];

    const routes = [
        { path: '/', parent: '', label: '' },
        { path: '/documentation', parent: 'Favorites', label: 'Dashboard Analytics' },
        { path: '/favorites/dashboardanalytics', parent: 'UI Kit', label: 'Form Layout' },
        { path: '/uikit/formlayout', parent: 'UI Kit', label: 'Input' },
        { path: '/', parent: 'UI Kit', label: 'Float Label' },
        { path: '/', parent: 'UI Kit', label: 'Invalid State' },
        { path: '/', parent: 'UI Kit', label: 'Button' },
        { path: '/', parent: 'UI Kit', label: 'Table' },
        { path: '/', parent: 'UI Kit', label: 'List' },
        { path: '/', parent: 'UI Kit', label: 'Panel' },
        { path: '/', parent: 'UI Kit', label: 'Tree' },
        { path: '/', parent: 'UI Kit', label: 'Overlay' },
        { path: '/', parent: 'UI Kit', label: 'Menu' },
        { path: '/', parent: 'UI Kit', label: 'Message' },
        { path: '/', parent: 'UI Kit', label: 'File' },
        { path: '/', parent: 'UI Kit', label: 'Chart' },
        { path: '/', parent: 'UI Kit', label: 'Misc' },
        { path: '/', parent: 'Utilities', label: 'Icons' },
        { path: '/', parent: 'PrimeBlocks', label: 'Blocks' },
        { path: '/', parent: 'Pages', label: 'Crud' },
        { path: '/', parent: 'Pages', label: 'Calendar' },
        { path: '/', parent: 'Pages', label: 'Timeline' },
        { path: '/', parent: 'Pages', label: 'Invoice' },
        { path: '/', parent: 'Pages', label: 'Login' },
        { path: '/', parent: 'Pages', label: 'Help' },
        { path: '/', parent: 'Pages', label: 'Empty' },
        { path: '/', parent: 'Pages', label: 'Access' },
        { path: '/', parent: 'Start', label: 'Documentation' },
        { path: '/', parent: 'Pages', label: 'Create User' },
        { path: '/', parent: 'Pages', label: 'Add Store' }
    ];

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        if (menuMode === 'overlay') {
            hideOverlayMenu();
        }
        if (menuMode === 'static') {
            setDesktopMenuActive(true);
        }
    }, [menuMode]);

    useEffect(() => {
        onColorModeChange(colorMode);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onMenuThemeChange = (theme) => {
        setMenuTheme(theme);
    };

    const onTopbarThemeChange = (theme) => {
        setTopbarTheme(theme);
    };

    useEffect(() => {
        const appLogoLink = document.getElementById('app-logo');

        if (topbarTheme === 'white' || topbarTheme === 'yellow' || topbarTheme === 'amber' || topbarTheme === 'orange' || topbarTheme === 'lime') {
            appLogoLink.src = 'assets/layout/images/logo-dark.svg';
        } else {
            // appLogoLink.src = 'assets/layout/images/logo-light.svg';
        }
    }, [topbarTheme]);

    const onThemeChange = (theme) => {
        setTheme(theme);
        const themeLink = document.getElementById('theme-css');
        const themeHref = 'assets/theme/' + theme + '/theme-' + colorMode + '.css';
        replaceLink(themeLink, themeHref);
    };

    const onColorModeChange = (mode) => {
        setColorMode(mode);
        setIsInputBackgroundChanged(true);

        if (isInputBackgroundChanged) {
            if (mode === 'dark') {
                setInputStyle('filled');
            } else {
                setInputStyle('outlined');
            }
        }

        if (mode === 'dark') {
            setMenuTheme('dark');
            setTopbarTheme('dark');
        } else {
            setMenuTheme('light');
            // setTopbarTheme('blue');
            setTopbarTheme('green');
        }

        const layoutLink = document.getElementById('layout-css');
        const layoutHref = '/assets/layout/css/layout-' + mode + '.css';
        replaceLink(layoutLink, layoutHref);

        const themeLink = document.getElementById('theme-css');
        const urlTokens = themeLink.getAttribute('href').split('/');
        urlTokens[urlTokens.length - 1] = 'theme-' + mode + '.css';
        const newURL = urlTokens.join('/');

        replaceLink(themeLink, newURL, () => {
            setNewThemeLoaded(true);
        });
    };

    const replaceLink = (linkElement, href, callback) => {
        if (isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        } else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                const _linkElement = document.getElementById(id);
                _linkElement && _linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    };

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onInlineMenuPositionChange = (mode) => {
        setInlineMenuPosition(mode);
    };

    const onMenuModeChange = (mode) => {
        setMenuMode(mode);
    };

    const onRTLChange = () => {
        setRTL((prevState) => !prevState);
    };

    const onMenuClick = (event) => {
        menuClick = true;
    };

    const onMenuButtonClick = (event) => {
        menuClick = true;
        if (checkVizardForm || loginDetails?.role === 'Super Admin') {
            if (isDesktop()) setDesktopMenuActive((prevState) => !prevState);
            else setMobileMenuActive((prevState) => !prevState);
            event.preventDefault();
        }
    };

    const onTopbarItemClick = (event) => {
        topbarItemClick = true;
        if (activeTopbarItem === event.item) setActiveTopbarItem(null);
        else {
            setActiveTopbarItem(event.item);
        }

        event.originalEvent.preventDefault();
    };

    const onSearch = (event) => {
        searchClick = true;
        setSearchActive(event);
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items && (menuMode === 'overlay' || !isDesktop())) {
            hideOverlayMenu();
        }

        if (!event.item.items && (isHorizontal() || isSlim())) {
            setMenuActive(false);
        }
    };

    const onRootMenuItemClick = (event) => {
        setMenuActive((prevState) => !prevState);
    };

    const onRightMenuButtonClick = () => {
        setRightMenuActive((prevState) => !prevState);
    };

    const onMobileTopbarButtonClick = (event) => {
        setMobileTopbarActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onDocumentClick = (event) => {
        if (!searchClick && event.target.localName !== 'input') {
            setSearchActive(false);
        }

        if (!topbarItemClick) {
            setActiveTopbarItem(null);
        }

        if (!menuClick && (menuMode === 'overlay' || !isDesktop())) {
            if (isHorizontal() || isSlim()) {
                setMenuActive(false);
            }
            hideOverlayMenu();
        }

        if (inlineMenuActive[currentInlineMenuKey.current] && !inlineMenuClick) {
            let menuKeys = { ...inlineMenuActive };
            menuKeys[currentInlineMenuKey.current] = false;
            setInlineMenuActive(menuKeys);
        }

        if (!menuClick && (isSlim() || isHorizontal())) {
            setMenuActive(false);
        }

        searchClick = false;
        topbarItemClick = false;
        inlineMenuClick = false;
        menuClick = false;
    };

    const hideOverlayMenu = () => {
        setMobileMenuActive(false);
        setDesktopMenuActive(false);
    };

    const isDesktop = () => {
        return window.innerWidth > 1024;
    };

    const isHorizontal = () => {
        return menuMode === 'horizontal';
    };

    const isSlim = () => {
        return menuMode === 'slim';
    };

    const isIE = () => {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    };

    const onInlineMenuClick = (e, key) => {
        let menuKeys = { ...inlineMenuActive };
        if (key !== currentInlineMenuKey.current && currentInlineMenuKey.current) {
            menuKeys[currentInlineMenuKey.current] = false;
        }

        menuKeys[key] = !menuKeys[key];
        setInlineMenuActive(menuKeys);
        currentInlineMenuKey.current = key;
        inlineMenuClick = true;
    };

    const layoutContainerClassName = classNames('layout-wrapper', 'layout-menu-' + menuTheme + ' layout-topbar-' + topbarTheme, {
        'layout-menu-static': menuMode === 'static',
        'layout-menu-overlay': menuMode === 'overlay',
        'layout-menu-slim': menuMode === 'slim',
        'layout-menu-horizontal': menuMode === 'horizontal',
        'layout-menu-active': desktopMenuActive,
        'layout-menu-mobile-active': mobileMenuActive,
        'layout-topbar-mobile-active': mobileTopbarActive,
        'layout-rightmenu-active': rightMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': !ripple,
        'layout-rtl': isRTL
    });
    const getRoles = (module_name, permissionName) => {
        try {
            let checkPrmition = false;
            if (loginDetails) {
                loginDetails?.role_permissions?.forEach((b, i) => {
                    let check = b?.permission?.find((x) => x.module_name === module_name)?.module_access.findIndex((y) => y === permissionName);
                    if (check !== undefined && check !== -1 && checkPrmition === false) {
                        checkPrmition = true;
                    }
                });
                // if (decode?.role_permissions.find((a) => a.role === "Chairman")?.role === "Chairman") {
                //     let checkIndex = decode?.role_permissions.find((a) => a.role === "Chairman").permission.findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === permissionName) !== -1);
                //     check = checkIndex !== -1
                // }
            }
            // let check = decode?.role_permissions.find((a) => a.role === "chairman").findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === permissionName) !== -1);
            return checkPrmition;
        } catch (error) {}
    };
    const getVehicleSettingRole = () => {
        try {
            let coll = loginDetails?.role_permissions.filter((x) => x.role !== 'User');
            let check = false;
            coll.forEach((x) => {
                let inde = x.permission?.find((module) => module.module_name === 'vehicle')?.module_access.findIndex((x) => x === 'update');
                if (inde !== -1 && check === false) {
                    check = true;
                }
            });
            return check;
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <RTLContext.Provider value={isRTL}>
                <div className={layoutContainerClassName} onClick={onDocumentClick}>
                    <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
                    <AppTopbar
                        horizontal={isHorizontal()}
                        activeTopbarItem={activeTopbarItem}
                        onMenuButtonClick={onMenuButtonClick}
                        onTopbarItemClick={onTopbarItemClick}
                        onRightMenuButtonClick={onRightMenuButtonClick}
                        onMobileTopbarButtonClick={onMobileTopbarButtonClick}
                        mobileTopbarActive={mobileTopbarActive}
                        searchActive={searchActive}
                        onSearch={onSearch}
                    />
                    {/* CHANGES HAVE TO DO HERE TO HIDE SIDEBAR */}
                    {/* {(checkVizardForm || loginDetails?.role === 'Super Admin' || loginDetails?.role === 'Super Admin') && (
                        <div className="menu-wrapper" onClick={onMenuClick} style={{ width: '18rem' }}>
                            <div className="layout-menu-container ">
                                {(inlineMenuPosition === 'top' || inlineMenuPosition === 'both') && (
                                    <AppInlineMenu menuKey="top" inlineMenuActive={inlineMenuActive} onInlineMenuClick={onInlineMenuClick} horizontal={isHorizontal()} menuMode={menuMode} />
                                )}
                                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} menuMode={menuMode} active={menuActive} />
                                {(inlineMenuPosition === 'bottom' || inlineMenuPosition === 'both') && (
                                    <AppInlineMenu menuKey="bottom" inlineMenuActive={inlineMenuActive} onInlineMenuClick={onInlineMenuClick} horizontal={isHorizontal()} menuMode={menuMode} />
                                )}
                            </div>
                        </div>
                    )} */}
                    {(checkVizardForm || loginDetails?.role === 'Super Admin' || loginDetails?.role === 'Super Admin') && location.pathname !== '/switch-property' && (
                        <div className="menu-wrapper" onClick={onMenuClick} style={{ width: '18rem' }}>
                            <div className="layout-menu-container ">
                                {(inlineMenuPosition === 'top' || inlineMenuPosition === 'both') && (
                                    <AppInlineMenu menuKey="top" inlineMenuActive={inlineMenuActive} onInlineMenuClick={onInlineMenuClick} horizontal={isHorizontal()} menuMode={menuMode} />
                                )}
                                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} menuMode={menuMode} active={menuActive} />
                                {(inlineMenuPosition === 'bottom' || inlineMenuPosition === 'both') && (
                                    <AppInlineMenu menuKey="bottom" inlineMenuActive={inlineMenuActive} onInlineMenuClick={onInlineMenuClick} horizontal={isHorizontal()} menuMode={menuMode} />
                                )}
                            </div>
                        </div>
                    )}
                    {/* {loginDetails?.role === 'Salesman' && (
                        <div className="menu-wrapper" onClick={onMenuClick}>
                            <div className="layout-menu-container ">
                                {(inlineMenuPosition === 'top' || inlineMenuPosition === 'both') && (
                                    <AppInlineMenu menuKey="top" inlineMenuActive={inlineMenuActive} onInlineMenuClick={onInlineMenuClick} horizontal={isHorizontal()} menuMode={menuMode} />
                                )}
                                <AppMenu model={salesmanMenu} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} menuMode={menuMode} active={menuActive} />
                                {(inlineMenuPosition === 'bottom' || inlineMenuPosition === 'both') && (
                                    <AppInlineMenu menuKey="bottom" inlineMenuActive={inlineMenuActive} onInlineMenuClick={onInlineMenuClick} horizontal={isHorizontal()} menuMode={menuMode} />
                                )}
                            </div>
                        </div>
                    )} */}
                    <div
                        className={`layout-main ${
                            (loginDetails?.role !== 'Super Admin' && stepperDetail?.maintenanceSettingExists && stepperDetail?.propertyStructureExists && stepperDetail?.vehicleSettingExists) || loginDetails?.role === 'Super Admin' ? '' : 'ml-0'
                        }`}
                    >
                        {/* {loginDetails?.role !== 'Super Admin' && closeBanner && announcementBanner && announcementBanner.length > 0 && (
                            <div className="flex align-items-center" style={{ backgroundColor: '#3c8d83' }}>
                                <marquee className="p-2" style={{ backgroundColor: '#3c8d83', color: '#fff' }} scrollamount="3">
                                    {announcementBanner.map(
                                        (a, i) =>
                                            `${announcementBanner && announcementBanner.length > 1 ? 'Announcement ' + (i + 1) + ' :- ' : ''} ${a.title} : ${a.description} on ${moment(a.expire_in).format('dddd, MMMM D, YYYY')} \u00A0  \u00A0 ${
                                                i < announcementBanner.length - 1 ? '|' : ''
                                            } \u00A0 \u00A0`
                                    )}
                                </marquee>{' '}
                                <div className="mx-2 flex align-items-center justify-content-center" style={{ background: '#495057', width: '1.5rem', height: '1.5rem', borderRadius: '50%' }}>
                                    <X color="white" size={17} className="cursor-pointer" onClick={() => setCloseBanner(false)} />
                                </div>
                            </div>
                        )} */}
                        {/* {loginDetails?.role !== 'Super Admin' && closeBanner && announcementBanner && announcementBanner.length > 0 && (
                            <div className="flex align-items-center" style={{ backgroundColor: '#3c8d83' }}>
                                <marquee className="p-2" style={{ backgroundColor: '#3c8d83', color: '#fff' }} scrollamount="3" onMouseOver={(e) => e.target.stop()} onMouseOut={(e) => e.target.start()}>
                                    {announcementBanner.map(
                                        (a, i) =>
                                            `${announcementBanner && announcementBanner.length > 1 ? 'Announcement ' + (i + 1) + ' :- ' : ''} ${a.title} : ${a.description} on ${moment(a.expire_in).format('dddd, MMMM D, YYYY')} \u00A0  \u00A0 ${
                                                i < announcementBanner.length - 1 ? '|' : ''
                                            } \u00A0 \u00A0`
                                    )}
                                </marquee>
                                <div className="mx-2 flex align-items-center justify-content-center" style={{ background: '#495057', width: '1.5rem', height: '1.5rem', borderRadius: '50%' }}>
                                    <X color="white" size={17} className="cursor-pointer" onClick={() => setCloseBanner(false)} />
                                </div>
                            </div>
                        )} */}
                        {loginDetails?.role !== 'Super Admin' && closeBanner && announcementBanner && announcementBanner.length > 0 && location.pathname !== '/switch-property' && (
                            <div className="flex align-items-center" style={{ backgroundColor: '#3c8d83' }}>
                                {/* <marquee className="p-2" style={{ backgroundColor: '#3c8d83', color: '#fff' }} scrollamount="3" onMouseOver={(e) => e.target.stop()} onMouseOut={(e) => e.target.start()}>
                                    {announcementBanner.map(
                                        (a, i) =>
                                            `${announcementBanner && announcementBanner.length > 1 ? 'Announcement ' + (i + 1) + ' :- ' : ''} ${a.title} : ${stripHtmlTags(a.description)} on ${moment(a.expire_in).format(
                                                'dddd, MMMM D, YYYY'
                                            )} \u00A0  \u00A0 ${i < announcementBanner.length - 1 ? '|' : ''} \u00A0 \u00A0`
                                    )}
                                </marquee> */}
                                <marquee className="p-2" style={{ backgroundColor: '#3c8d83', color: '#fff' }} scrollamount="3" onMouseOver={(e) => e.currentTarget.stop()} onMouseOut={(e) => e.currentTarget.start()}>
                                    {announcementBanner.map((a, i) => (
                                        <>
                                            {announcementBanner && announcementBanner.length > 1 ? 'Announcement ' + (i + 1) + ' :- ' : ''}
                                            <b>{a.title}</b> : {stripHtmlTags(a.description)} on {moment(a.expire_in).format('dddd, MMMM D, YYYY')}
                                            {'\u00A0  \u00A0'}
                                            {i < announcementBanner.length - 1 ? '|' : ''}
                                            {'\u00A0  \u00A0'}
                                        </>
                                    ))}
                                </marquee>
                                <div className="mx-2 flex align-items-center justify-content-center" style={{ background: '#495057', width: '1.5rem', height: '1.5rem', borderRadius: '50%' }}>
                                    <X color="white" size={17} className="cursor-pointer" onClick={() => setCloseBanner(false)} />
                                </div>
                            </div>
                        )}

                        <div className="layout-content" style={{ padding: '2rem' }}>
                            <Routes>
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/dashboard"
                                        element={
                                            <SuperAdminRoute>
                                                <SuperAdminDashboard />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/"
                                        element={
                                            <SuperAdminRoute>
                                                <SuperAdminDashboard />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/properties"
                                        element={
                                            <SuperAdminRoute>
                                                <ComplexList />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/properties/view/:id"
                                        element={
                                            <SuperAdminRoute>
                                                <PropertyDetails />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/properties/add"
                                        element={
                                            <SuperAdminRoute>
                                                <ComplexCreate />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/properties/edit/:id"
                                        element={
                                            <SuperAdminRoute>
                                                <EditProperty />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path="/superadmin/roles"
                                        element={
                                            <SuperAdminRoute>
                                                <RolesListSuperAdmin />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path="/superadmin/roles/add"
                                        element={
                                            <SuperAdminRoute>
                                                <RolesCreateSuperAdmin />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path="/superadmin/roles/edit/:id"
                                        element={
                                            <SuperAdminRoute>
                                                <RolesCreateSuperAdmin />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path="/superadmin/roles/role-view/:id"
                                        element={
                                            <SuperAdminRoute>
                                                <RoleViewSuperAdmin />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/sales"
                                        element={
                                            <SuperAdminRoute>
                                                <SalesmanList />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/sales/add"
                                        element={
                                            <SuperAdminRoute>
                                                <CreateSalesman />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Salesman' && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/salesman/dashboard`}
                                        element={
                                            <SalesManRoute>
                                                <SalesmanDashboard />
                                            </SalesManRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Salesman' && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/salesman/property/add`}
                                        element={
                                            <SalesManRoute>
                                                <SalemanPropertyCreate />
                                            </SalesManRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Salesman' && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/salesman/properties/view/:id`}
                                        element={
                                            <SalesManRoute>
                                                <SalesmanPropertyDetails />
                                            </SalesManRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/sales/edit/:id"
                                        element={
                                            <SuperAdminRoute>
                                                <CreateSalesman />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/supports"
                                        element={
                                            <SuperAdminRoute>
                                                <Support />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/revenue"
                                        element={
                                            <SuperAdminRoute>
                                                <Revenue />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/feed"
                                        element={
                                            <SuperAdminRoute>
                                                <Revenue />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/advertisement"
                                        element={
                                            <SuperAdminRoute>
                                                <Revenue />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/aboutus"
                                        element={
                                            <SuperAdminRoute>
                                                <AboutUsEdit />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/termscondition"
                                        element={
                                            <SuperAdminRoute>
                                                <TocEdit />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/privacypolicy"
                                        element={
                                            <SuperAdminRoute>
                                                <PrivacyPolicyEdit />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/copyright"
                                        element={
                                            <SuperAdminRoute>
                                                <FooterEdit />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Super Admin' && (
                                    <Route
                                        path="/superadmin/profile"
                                        element={
                                            <SuperAdminRoute>
                                                <Profile />
                                            </SuperAdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role === 'Salesman' && (
                                    <Route
                                        path="/salesman/profile"
                                        element={
                                            <SalesManRoute>
                                                <Profile />
                                            </SalesManRoute>
                                        }
                                    />
                                )}
                                <Route
                                    path="*"
                                    element={
                                        <AdminRoute>
                                            <Error />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    // path="/profile"
                                    // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/profile`}
                                    path={`/property-management/profile`}
                                    element={
                                        <AdminRoute>
                                            <Profile />
                                        </AdminRoute>
                                    }
                                />
                                {/* {!checkVizard() && ( */}
                                <Route
                                    // path="/admin/property-assign"
                                    // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vizard`}
                                    path={`/property-management/vizard`}
                                    element={
                                        <UserRoute>
                                            <Vizard />
                                        </UserRoute>
                                    }
                                />
                                <Route
                                    // path="/admin/property-assign"
                                    // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vizard`}
                                    path={`/property-management/myproperties`}
                                    element={
                                        <UserRoute>
                                            <MyProperty />
                                        </UserRoute>
                                    }
                                />
                                <Route
                                    // path="/admin/property-assign"
                                    // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vizard`}
                                    path={`/switch-property`}
                                    element={<SwitchPropertyPage />}
                                />
                                {/* <Route
                                    // path="/admin/property-assign"
                                    // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vizard`}
                                    path={`/property-management/property-permistion`}
                                    element={
                                        <UserRoute>
                                            <Vizard />
                                        </UserRoute>
                                    }
                                /> */}

                                {/* )} */}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'dashboard' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('dashboard', 'read') && (
                                    <Route
                                        path="/"
                                        element={
                                            <AdminRoute>
                                                <Dashboard />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('dashboard', 'read') && (
                                    <Route
                                        // path='"/admin/dashboard"'
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`}
                                        path={`/property-management/dashboard`}
                                        // element={<AdminRoute>{roleName === 'User' ? <UserDashboard /> : <Dashboard />}</AdminRoute>}
                                        element={
                                            <AdminRoute>
                                                <Dashboard />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                <Route
                                    path="/admin/shoplist"
                                    element={
                                        <AdminRoute>
                                            <ShopList />
                                        </AdminRoute>
                                    }
                                />
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'user-property-assign' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/property-assign`}
                                        element={
                                            <AdminRoute>
                                                <PropertyAssignList />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/property-assign/user-property-business-details/:id`}
                                        element={
                                            <AdminRoute>
                                                <BusinessDetail />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/tenant/user-property-business-details/:id`}
                                        element={
                                            <AdminRoute>
                                                <BusinessDetail />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'create') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/property-assign/user-property-assign`}
                                        element={
                                            <AdminRoute>
                                                <PropertyAssign />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'update') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/property-assign/user-property-assign-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <PropertyAssign />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'update') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/property-assign/transfer/:id`}
                                        element={
                                            <AdminRoute>
                                                <PropertyTransfer />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/property-assign/:id`}
                                        element={
                                            <AdminRoute>
                                                <PropertyView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/property-structure/:id`}
                                        element={
                                            <AdminRoute>
                                                <PropertyView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/tenant/:id`}
                                        element={
                                            <AdminRoute>
                                                <PropertyView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/committee/:id`}
                                        element={
                                            <AdminRoute>
                                                <PropertyView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('user-property-assign', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/general-core-members/:id`}
                                        element={
                                            <AdminRoute>
                                                <PropertyView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'vehicle' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('vehicle', 'read') && (
                                    <Route
                                        // path="/admin/vehiclelist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vehicle`}
                                        path={`/property-management/vehicle`}
                                        element={
                                            <AdminRoute>
                                                <VehicleList />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('vehicle', 'create') && (
                                    <Route
                                        // path="/admin/vehiclelist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vehicle`}
                                        path={`/property-management/vehicle/vehicle-assign`}
                                        element={
                                            <AdminRoute>
                                                <VehicleAssign />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('vehicle', 'update') && (
                                    <Route
                                        // path="/admin/vehiclelist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vehicle`}
                                        path={`/property-management/vehicle/vehicle-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <VehicleAssign />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'maintenance' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('maintenance', 'read') && (
                                    <Route
                                        // path="/admin/maintenancelist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenancelist`}
                                        path={`/property-management/maintenancelist`}
                                        element={
                                            <AdminRoute>
                                                <MaintenanceList />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && (
                                    <Route
                                        // path="/admin/maintenancelist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenancelist`}
                                        path={`/property-management/maintenancelist/payment-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <PaymentView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('maintenance-settings', 'read') && (
                                    <Route
                                        // path="/admin/maintenancelist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenancelist`}
                                        path={`/property-management/maintenance-setting`}
                                        element={
                                            <AdminRoute>
                                                <MaintenancePage />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('maintenance-settings', 'update') && (
                                    <Route
                                        // path="/admin/maintenancelist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenancelist`}
                                        path={`/property-management/maintenance-setting-update`}
                                        element={
                                            <AdminRoute>
                                                <MaintenanceCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {getVehicleSettingRole() && (
                                    <Route
                                        // path="/admin/maintenancelist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenancelist`}
                                        path={`/property-management/vehicle-setting`}
                                        element={
                                            <AdminRoute>
                                                <VehicleSetting />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'maintenance-settings' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                <Route
                                    // path="/admin/maintenance-setting"
                                    // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/maintenance-setting`}
                                    path={`/property-management/maintenance-setting`}
                                    element={
                                        <AdminRoute>
                                            <MaintenanceSetting />
                                        </AdminRoute>
                                    }
                                />
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'complaint' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('complaint', 'read') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/complain`}
                                        element={
                                            <AdminRoute>
                                                <ComplaintList />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('complaint', 'create') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/complain/complain-create`}
                                        element={
                                            <AdminRoute>
                                                <ComplaintCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('complaint', 'update') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/complain/complain-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <ComplaintCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('complaint', 'read') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/complain/complain-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <ComplaintView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'announcement' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('announcement', 'read') && (
                                    <Route
                                        // path="/admin/announcementlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/announcement`}
                                        path={`/property-management/announcements`}
                                        element={
                                            <AdminRoute>
                                                <AnnouncementList />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('announcement', 'create') && (
                                    <Route
                                        // path="/admin/announcementlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/announcement`}
                                        path={`/property-management/announcements/announcement-create`}
                                        element={
                                            <AdminRoute>
                                                <AnnouncementCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('announcement', 'update') && (
                                    <Route
                                        // path="/admin/announcementlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/announcement`}
                                        path={`/property-management/announcements/announcement-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <AnnouncementCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('announcement', 'read') && (
                                    <Route
                                        // path="/admin/vendor"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`}
                                        path={`/property-management/announcements/announcement-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <AnnoucementView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'vendor' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('vendor', 'read') && (
                                    <Route
                                        // path="/admin/vendor"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`}
                                        path={`/property-management/vendor`}
                                        element={
                                            <AdminRoute>
                                                <Vendor />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('vendor', 'create') && (
                                    <Route
                                        // path="/admin/vendor"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`}
                                        path={`/property-management/vendor/vendor-add`}
                                        element={
                                            <AdminRoute>
                                                <VendorAdd />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('vendor', 'update') && (
                                    <Route
                                        // path="/admin/vendor"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`}
                                        path={`/property-management/vendor/vendor-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <VendorAdd />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('vendor', 'read') && (
                                    <Route
                                        // path="/admin/vendor"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`}
                                        path={`/property-management/vendor/vendor-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <VendorView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'rental' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('notice', 'read') && (
                                    <Route
                                        // path="/admin/rental"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/rental`}
                                        path={`/property-management/notice`}
                                        element={
                                            <AdminRoute>
                                                <Notice />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('notice', 'create') && (
                                    <Route
                                        // path="/admin/rental"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/rental`}
                                        path={`/property-management/notice/notice-create`}
                                        element={
                                            <AdminRoute>
                                                <NoticeCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('notice', 'update') && (
                                    <Route
                                        // path="/admin/rental"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/rental`}
                                        path={`/property-management/notice/notice-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <NoticeCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('notice', 'read') && (
                                    <Route
                                        // path="/admin/rental"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/rental`}
                                        path={`/property-management/notice/notice-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <NoticeView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('rental', 'read') && (
                                    <Route
                                        // path="/admin/rental"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/rental`}
                                        path={`/property-management/rental`}
                                        element={
                                            <AdminRoute>
                                                <Rental />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && loginDetails?.role_permissions.find((x) => x.role === 'User') && (
                                    <Route
                                        // path="/admin/rental"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/rental`}
                                        path={`/property-management/rental-create`}
                                        element={
                                            <AdminRoute>
                                                <RentalCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && loginDetails?.role_permissions.find((x) => x.role === 'User') && (
                                    <Route
                                        // path="/admin/rental"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/rental`}
                                        path={`/property-management/rental-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <RentalCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'role' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('role', 'read') && (
                                    <Route
                                        // path="/admin/roles"
                                        path={`/property-management/roles`}
                                        element={
                                            <AdminRoute>
                                                <Roles />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('role', 'read') && (
                                    <Route
                                        // path="/admin/roles"
                                        path={`/property-management/roles/role-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <RoleView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('role', 'create') && (
                                    <Route
                                        // path="/admin/roles"
                                        path={`/property-management/role-create`}
                                        element={
                                            <AdminRoute>
                                                <RoleCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('role', 'update') && (
                                    <Route
                                        // path="/admin/roles"
                                        path={`/property-management/role-edite/:id`}
                                        element={
                                            <AdminRoute>
                                                <RoleCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'committee-member' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                {loginDetails?.role !== 'Super Admin' && getRoles('committee-member', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/general-core-members`}
                                        element={
                                            <AdminRoute>
                                                <GeneralCoreMembers />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('committee-member', 'create') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/general-core-members/general-core-members-add`}
                                        element={
                                            <AdminRoute>
                                                <CreateCoreMembers />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('committee-member', 'update') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/general-core-members/general-core-members-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <CreateCoreMembers />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('committee-member', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/committee`}
                                        element={
                                            <AdminRoute>
                                                <Committee />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('committee-member', 'create') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/committee/committee-add`}
                                        element={
                                            <AdminRoute>
                                                <CommitteeAdd />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('committee-member', 'update') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/committee/committee-edit/:userId/:id`}
                                        element={
                                            <AdminRoute>
                                                <CommitteeAdd />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('gatekeeper', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/gate-keeper`}
                                        element={
                                            <AdminRoute>
                                                <GateKeeper />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('gatekeeper', 'create') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/gate-keeper/gate-keeper-create`}
                                        element={
                                            <AdminRoute>
                                                <GateKepperAdd />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('gatekeeper', 'update') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/gate-keeper/gate-keeper-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <GateKepperAdd />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('gatekeeper', 'read') && (
                                    <Route
                                        // path="/admin/vendor"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`}
                                        path={`/property-management/gate-keeper/gate-keeper-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <GatekeeperDetails />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('gatepass', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/gatepass`}
                                        element={
                                            <AdminRoute>
                                                <Gatepass />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('gatepass', 'create') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/gatepass/gatepass-create`}
                                        element={
                                            <AdminRoute>
                                                <GatePassAdd />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('gatepass', 'update') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/gatepass/gatepass-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <GatePassAdd />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('gatepass', 'read') && (
                                    <Route
                                        // path="/admin/vendor"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`}
                                        path={`/property-management/gatepass/gatepass-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <GatePassDetails />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('gatepass', 'read') && (
                                    <Route
                                        // path="/admin/vendor"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`}
                                        path={`/property-management/gatpass/view-qr/:encodedData`}
                                        element={
                                            <AdminRoute>
                                                <QRView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('meeting', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/meeting`}
                                        element={
                                            <AdminRoute>
                                                <Meeting />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('meeting', 'create') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/meeting/meeting-create`}
                                        element={
                                            <AdminRoute>
                                                <CreateMeeting />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('meeting', 'update') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/meeting/meeting-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <CreateMeeting />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('meeting', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/meeting/meeting-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <MeetingView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('meeting', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/resolutions`}
                                        element={
                                            <AdminRoute>
                                                <Resolutions />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('meeting', 'create') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/resolutions/resolutions-create`}
                                        element={
                                            <AdminRoute>
                                                <CreateResolutions />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('meeting', 'update') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/resolutions/resolutions-update/:id`}
                                        element={
                                            <AdminRoute>
                                                <CreateResolutions />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('meeting', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/resolutions/resolutions-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <ResolutionView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('emergencycontact', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/emergency-contact`}
                                        element={
                                            <AdminRoute>
                                                <EmergencyContact />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('buildingrules', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/buildingrules`}
                                        element={
                                            <AdminRoute>
                                                <BuildingRules />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('buildingrules', 'create') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/buildingrules/buildingrules-create`}
                                        element={
                                            <AdminRoute>
                                                <AddBuildingRules />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('buildingrules', 'update') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/buildingrules/buildingrules-update/:id`}
                                        element={
                                            <AdminRoute>
                                                <AddBuildingRules />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('buildingrules', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/buildingrules/buildingrules-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <BuildingRulesDetails />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('event', 'read') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/event`}
                                        element={
                                            <AdminRoute>
                                                <Event />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('event', 'create') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/event/event-create`}
                                        element={
                                            <AdminRoute>
                                                <EventCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('event', 'update') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/event/event-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <EventCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('event', 'read') && (
                                    <Route
                                        // path="/admin/vendor"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/vendor`}
                                        path={`/property-management/event/event-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <EventView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* Contract pages Routing*/}
                                {loginDetails?.role !== 'Super Admin' && getRoles('contract', 'read') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/contract`}
                                        element={
                                            <AdminRoute>
                                                <ContractList />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('contract', 'create') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/contract/contract-create`}
                                        element={
                                            <AdminRoute>
                                                <ContractCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('contract', 'update') && (
                                    <Route
                                        // path="/admin/committee"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/committee`}
                                        path={`/property-management/contract/contract-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <ContractCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}

                                {loginDetails?.role !== 'Super Admin' && getRoles('contract', 'read') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/contract/contract-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <ContractView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('contract', 'update') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/contract/renew/:id`}
                                        element={
                                            <AdminRoute>
                                                <ContractRenewalForm />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('fixeddeposit', 'read') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/fixdeposit`}
                                        element={
                                            <AdminRoute>
                                                <FixDepositList />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('fixeddeposit', 'create') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/fixdeposit/fixdeposit-create`}
                                        element={
                                            <AdminRoute>
                                                <FixDepositCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('fixeddeposit', 'read') && (
                                    <Route
                                        path={`/property-management/fixdeposit/fixdeposit-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <FixDepositView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('fixeddeposit', 'update') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/fixdeposit/fixdeposit-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <FixDepositCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('expense_tracker', 'read') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/expense`}
                                        element={
                                            <AdminRoute>
                                                <ExpenseList />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('expense_tracker', 'create') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/expense/expense-create`}
                                        element={
                                            <AdminRoute>
                                                <ExpenseCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('expense_tracker', 'read') && (
                                    <Route
                                        path={`/property-management/expense/expense-view/:id`}
                                        element={
                                            <AdminRoute>
                                                <ExpenseView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('expense_tracker', 'update') && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/expense/expense-edit/:id`}
                                        element={
                                            <AdminRoute>
                                                <ExpenseCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && (
                                    <Route
                                        // path="/admin/complaintlist"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/complain`}
                                        path={`/property-management/notifications`}
                                        element={
                                            <AdminRoute>
                                                <Notifications />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('feed', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/feeds`}
                                        element={
                                            <AdminRoute>
                                                <Fides />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('feed', 'create') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/feeds/create-feed`}
                                        element={
                                            <AdminRoute>
                                                <CreateFides />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('feed', 'update') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/feeds/edit-feed/:id`}
                                        element={
                                            <AdminRoute>
                                                <CreateFides />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('rental', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/tenant`}
                                        element={
                                            <AdminRoute>
                                                <Tenant />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('rental', 'read') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/tenant/:id`}
                                        element={
                                            <AdminRoute>
                                                <PropertyView />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('rental', 'create') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/tenant/tenant-create`}
                                        element={
                                            <AdminRoute>
                                                <TenantCreate />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {loginDetails?.role !== 'Super Admin' && getRoles('rental', 'update') && (
                                    <Route
                                        // path="/admin/property-assign"
                                        // path={`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/property-assign`}
                                        path={`/property-management/tenant/transfer/:id`}
                                        element={
                                            <AdminRoute>
                                                <TenantTransfer />
                                            </AdminRoute>
                                        }
                                    />
                                )}
                                {/* {decode?.role_permissions.findIndex((x) => x.module_name === 'property-structure' && x.module_access.findIndex((a) => a === 'read') !== -1) !== -1 && (
                                )} */}
                                <Route
                                    // path="/admin/property-structure"
                                    path={`/property-management/property-structure`}
                                    element={
                                        <AdminRoute>
                                            <BlockList />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    path="/admin/floorlist"
                                    element={
                                        <AdminRoute>
                                            <FloorList />
                                        </AdminRoute>
                                    }
                                />
                                {/* <Route
                                    path="/dashboard"
                                    element={
                                        <UserRoute>
                                            <UserDashboard />
                                        </UserRoute>
                                    }
                                />
                                <Route
                                    path="/property-assign"
                                    element={
                                        <UserRoute>
                                            <PropertyAssignList />
                                        </UserRoute>
                                    }
                                />
                                <Route
                                    path="/vehiclelist"
                                    element={
                                        <UserRoute>
                                            <VehicleList />
                                        </UserRoute>
                                    }
                                />
                                <Route
                                    path="/maintenancelist"
                                    element={
                                        <UserRoute>
                                            <MaintenanceList />
                                        </UserRoute>
                                    }
                                />
                                <Route
                                    path="/complaintlist"
                                    element={
                                        <UserRoute>
                                            <ComplaintList />
                                        </UserRoute>
                                    }
                                />
                                <Route
                                    path="/announcementlist"
                                    element={
                                        <UserRoute>
                                            <AnnouncementList />
                                        </UserRoute>
                                    }
                                />
                                <Route
                                    path="/vendor"
                                    element={
                                        <UserRoute>
                                            <Vendor />
                                        </UserRoute>
                                    }
                                />
                                <Route
                                    path="/rental"
                                    element={
                                        <UserRoute>
                                            <Rental />
                                        </UserRoute>
                                    }
                                /> */}
                            </Routes>
                        </div>
                        {/* <ScrollTop threshold={80} style={{ backgroundColor: '#fbc02d', marginBottom: '34px' }} />
                        <AppFooter colorMode={colorMode} /> */}
                        <div className="sticky bottom-0 w-full bg-white shadow-lg">
                            <ScrollTop threshold={80} style={{ backgroundColor: '#fbc02d', marginBottom: '34px' }} />
                            <AppFooter colorMode={colorMode} />
                        </div>
                    </div>
                    <AppConfig
                        inputStyle={inputStyle}
                        onInputStyleChange={onInputStyleChange}
                        rippleEffect={ripple}
                        onRippleEffect={onRipple}
                        menuMode={menuMode}
                        onMenuModeChange={onMenuModeChange}
                        inlineMenuPosition={inlineMenuPosition}
                        onInlineMenuPositionChange={onInlineMenuPositionChange}
                        colorMode={colorMode}
                        onColorModeChange={onColorModeChange}
                        menuTheme={menuTheme}
                        onMenuThemeChange={onMenuThemeChange}
                        topbarTheme={topbarTheme}
                        onTopbarThemeChange={onTopbarThemeChange}
                        theme={theme}
                        onThemeChange={onThemeChange}
                        isRTL={isRTL}
                        onRTLChange={onRTLChange}
                    />
                    <AppRightMenu rightMenuActive={rightMenuActive} onRightMenuButtonClick={onRightMenuButtonClick} />
                    {mobileMenuActive && <div className="layout-mask modal-in"></div>}
                </div>
            </RTLContext.Provider>
        </>
    );
};

export default App;
