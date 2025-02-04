import React, { useContext, useEffect, useRef, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { classNames } from 'primereact/utils';
import { MegaMenu } from 'primereact/megamenu';
import { useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { RTLContext } from './App';
import { handleLogout } from './redux/slice/AdminSlices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import blankuser from './assets/images/blank-user.jpg';
import whiteLogo from './assets/images/White2ndOption01.png';
import ComplexLogo from './assets/images/Complex360-02.svg';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { getProfileDetailsRequest } from './redux/slice/AdminSlices/authSlice';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { getNotificationRequest, markAsReadRequest } from './redux/slice/AdminSlices/notificationSlice';
const AppTopbar = (props) => {
    const { userData, profileImage, token, loginDetails, stepperDetail, profileDetails } = useSelector((state) => state.auth);
    const isRTL = useContext(RTLContext);
    const { notificationsData } = useSelector((state) => state.notification);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const topbarRef1 = useRef(null);
    // const topbarRef2 = useRef(null);
    // const topbarRef3 = useRef(null);
    const topbarRef4 = useRef(null);
    const [decode, setDecode] = useState(null);
    const location = useLocation();
    const [isSwitching, setIsSwitching] = useState(false);
    // Fixed for 6.1.0
    // eslint-disable-next-line
    const menuLeft = useRef(null);
    const isMyPropertiesRoute = location.pathname === '/property-management/myproperties';
    const badgeStyle = {
        backgroundColor: 'white', // Badge circle background color
        color: 'green', // Badge text color
        // border: '1px solid green', // Optional: border color to match the text color
        borderRadius: '50%', // Ensure the badge is circular
        display: 'inline-flex', // Centering the content
        alignItems: 'center', // Centering the content
        justifyContent: 'center' // Centering the content
    };

    let items = [
        {
            template: () => {
                return (
                    <>
                        <div className="flex justify-content-between px-4 py-2">
                            <div>
                                <p className="font-bold">New notifications</p>
                            </div>
                            {notificationsData?.notifications && notificationsData?.notifications.length !== 0 ? (
                                <div className="w-11rem flex gap-2">
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            dispatch(markAsReadRequest());
                                        }}
                                    >
                                        <p>Mark as Read</p>
                                    </div>
                                    <div>|</div>
                                    <div className="cursor-pointer" onClick={() => navigate('/property-management/notifications')}>
                                        <p>Show All</p>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        {/* <div className="p-4">
                            {notificationsData.slice(0, 5)?.map((item, index) => {
                                return (
                                    // <div key={item?._id} className="flex cursor-pointer" onClick={() => navigate('/property-management/notifications')}>
                                    //     <p className="font-medium">
                                    //         {item.title}: "{item.description}
                                    //     </p>
                                    //     <hr />
                                    // </div>
                                    <div key={item?._id} className="flex cursor-pointer" onClick={() => navigate('/property-management/notifications')}>
                                        <p className="font-small"><b>{item.title}:</b>   {item.description}</p>
                                        {index < notificationsData.length - 1 && <hr />}
                                    </div>
                                );
                            })}
                        </div> */}
                        <div className="p-4">
                            {notificationsData?.notifications && notificationsData?.notifications.length === 0 ? (
                                <p className="font-medium"></p>
                            ) : (
                                notificationsData?.notifications &&
                                notificationsData?.notifications.slice(0, 5).map((item, index) => (
                                    <div key={item?._id} className="flex cursor-pointer" onClick={() => navigate('/property-management/notifications')}>
                                        <p className="font-small">
                                            <b>{item.title}:</b> {item.description}
                                            {index < notificationsData.notifications.length - 1 && <hr />}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                );
            }
        }
    ];

    const handleNavigate = () => {
        // loginDetails?.role !== 'Super Admin' ? navigate(`/${loginDetails ? loginDetails?.property_name && loginDetails?.property_name.replace(/ /g, '-').toLowerCase() : ''}/profile`) : navigate('/superadmin/profile');
        loginDetails?.role !== 'Super Admin' ? navigate(`/property-management/profile`) : navigate('/superadmin/profile');
    };
    useEffect(() => {
        if (!isMyPropertiesRoute) {
            dispatch(getNotificationRequest(`?limit=${5}&page=${1}`));
        }
    }, [dispatch, isMyPropertiesRoute]);
    // useEffect(() => {
    //     if (token && loginDetails) {
    //         dispatch(getProfileDetailsRequest(loginDetails._id));
    //     }
    //     // Fixed for 6.1.0
    //     /*if (props.searchActive) {
    //         searchPanel.current.element.focus();
    //     }*/
    //     // if (token) {
    //     //     decodeURI();
    //     // }
    // }, []);
    // const decodeURI = async () => {
    //     try {
    //         let decodeData = await jwtDecode(token);
    //         setDecode(decodeData);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const onInputKeydown = (event) => {
    //     const key = event.which;

    //     //escape, tab and enter
    //     if (key === 27 || key === 9 || key === 13) {
    //         props.onSearch(false);
    //     }
    // };

    const model = [
        // {
        //     label: 'Create User',
        //     icon: 'pi pi-fw pi-user',
        //     command: () => {
        //                     navigate('/createuser');
        //                    }
        //     // items: [
        //     //     [
        //     //         {
        //     //             label: 'UI KIT 1',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Form Layout',
        //     //                     icon: 'pi pi-fw pi-id-card',
        //     //                     command: () => {
        //     //                         navigate('/uikit/formlayout');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Input',
        //     //                     icon: 'pi pi-fw pi-check-square',
        //     //                     command: () => {
        //     //                         navigate('/uikit/input');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Float Label',
        //     //                     icon: 'pi pi-fw pi-bookmark',
        //     //                     command: () => {
        //     //                         navigate('/uikit/floatlabel');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Button',
        //     //                     icon: 'pi pi-fw pi-mobile',
        //     //                     command: () => {
        //     //                         navigate('/uikit/button');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'File',
        //     //                     icon: 'pi pi-fw pi-file',
        //     //                     command: () => {
        //     //                         navigate('/uikit/file');
        //     //                     }
        //     //                 }
        //     //             ]
        //     //         }
        //     //     ],
        //     //     [
        //     //         {
        //     //             label: 'UI KIT 2',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Table',
        //     //                     icon: 'pi pi-fw pi-table',
        //     //                     command: () => {
        //     //                         navigate('/uikit/table');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'List',
        //     //                     icon: 'pi pi-fw pi-list',
        //     //                     command: () => {
        //     //                         navigate('/uikit/list');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Tree',
        //     //                     icon: 'pi pi-fw pi-share-alt',
        //     //                     command: () => {
        //     //                         navigate('/uikit/tree');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Panel',
        //     //                     icon: 'pi pi-fw pi-tablet',
        //     //                     command: () => {
        //     //                         navigate('/uikit/panel');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Chart',
        //     //                     icon: 'pi pi-fw pi-chart-bar',
        //     //                     command: () => {
        //     //                         navigate('/uikit/chart');
        //     //                     }
        //     //                 }
        //     //             ]
        //     //         }
        //     //     ],
        //     //     [
        //     //         {
        //     //             label: 'UI KIT 3',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Overlay',
        //     //                     icon: 'pi pi-fw pi-clone',
        //     //                     command: () => {
        //     //                         navigate('/uikit/overlay');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Menu',
        //     //                     icon: 'pi pi-fw pi-bars',
        //     //                     command: () => {
        //     //                         navigate('/uikit/menu');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Message',
        //     //                     icon: 'pi pi-fw pi-comment',
        //     //                     command: () => {
        //     //                         navigate('/uikit/message');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Misc',
        //     //                     icon: 'pi pi-fw pi-circle',
        //     //                     command: () => {
        //     //                         navigate('/uikit/misc');
        //     //                     }
        //     //                 }
        //     //             ]
        //     //         }
        //     //     ]
        //     // ]
        // },
        // {
        //     label: 'Add Store',
        //     icon: 'pi pi-fw pi-shopping-bag',
        //     command: () => {
        //                     navigate('/addstore');
        //                    }
        //     // items: [
        //     //     [
        //     //         {
        //     //             label: 'PAGES 1',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Access',
        //     //                     icon: 'pi pi-fw pi-lock',
        //     //                     command: () => {
        //     //                         navigate('/access');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Calendar',
        //     //                     icon: 'pi pi-fw pi-calendar-plus',
        //     //                     command: () => {
        //     //                         navigate('/pages/calendar');
        //     //                     }
        //     //                 }
        //     //             ]
        //     //         },
        //     //         {
        //     //             label: 'PAGES 2',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Crud',
        //     //                     icon: 'pi pi-fw pi-pencil',
        //     //                     command: () => {
        //     //                         navigate('/pages/crud');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Empty Page',
        //     //                     icon: 'pi pi-fw pi-circle',
        //     //                     command: () => {
        //     //                         navigate('/pages/empty');
        //     //                     }
        //     //                 }
        //     //             ]
        //     //         }
        //     //     ],
        //     //     [
        //     //         {
        //     //             label: 'PAGES 3',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Timeline',
        //     //                     icon: 'pi pi-fw pi-calendar',
        //     //                     command: () => {
        //     //                         navigate('/pages/timeline');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Help',
        //     //                     icon: 'pi pi-fw pi-question-circle',
        //     //                     command: () => {
        //     //                         navigate('/pages/help');
        //     //                     }
        //     //                 }
        //     //             ]
        //     //         },
        //     //         {
        //     //             label: 'PAGES 4',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Invoice',
        //     //                     icon: 'pi pi-fw pi-dollar',
        //     //                     command: () => {
        //     //                         navigate('/pages/invoice');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Landing',
        //     //                     icon: 'pi pi-fw pi-globe',
        //     //                     command: () => {
        //     //                         navigate('/landing');
        //     //                     }
        //     //                 }
        //     //             ]
        //     //         }
        //     //     ],
        //     //     [
        //     //         {
        //     //             label: 'PAGES 5',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Login',
        //     //                     icon: 'pi pi-fw pi-sign-in',
        //     //                     command: () => {
        //     //                         navigate('/login');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Not Found',
        //     //                     icon: 'pi pi-fw pi-exclamation-circle',
        //     //                     command: () => {
        //     //                         navigate('/notfound');
        //     //                     }
        //     //                 },
        //     //                 {
        //     //                     label: 'Error',
        //     //                     icon: 'pi pi-fw pi-times-circle',
        //     //                     command: () => {
        //     //                         navigate('/error');
        //     //                     }
        //     //                 }
        //     //             ]
        //     //         }
        //     //     ]
        //     // ]
        // }
    ];
    const logout = () => {
        navigate('/login');
        dispatch(handleLogout());
    };
    // useEffect(() => {
    //     if (loginDetails?.role !== 'Super Admin' && (!stepperDetail?.maintenanceSettingExists || !stepperDetail?.propertyStructureExists || !stepperDetail?.vehicleSettingExists)) {
    //         props.onMenuButtonClick();
    //     }
    // }, [])

    const getRoleName = () => {
        try {
            let role = '';
            let committeeName = loginDetails.role_permissions.filter((x) => x.role !== 'User' && x.role !== 'Chairman');
            if (committeeName && committeeName.length > 0) {
                role = committeeName[0].role;
            } else {
                role = 'User';
            }
            return role;
        } catch (error) {
            console.log(error);
        }
    };
    const hasMultipleProperties = () => {
        const properties = JSON.parse(localStorage.getItem('userProperties')) || [];
        return properties.length > 1;
    };
    // const handleNavigateToSwitchProperty = () => {
    //     const properties = JSON.parse(localStorage.getItem('userProperties')) || [];
    //     if (properties?.length > 0) {
    //         // Save the properties to be accessed on the switch property page
    //         localStorage.setItem('currentProperties', JSON.stringify(properties));
    //         navigate('/switch-property'); // Navigate to the switch property page
    //     } else {
    //         console.error('No properties available to switch.');
    //     }
    // };
    const handleNavigateToSwitchProperty = () => {
        const properties = JSON.parse(localStorage.getItem('userProperties')) || [];
        if (properties.length > 1) {
            localStorage.setItem('currentProperties', JSON.stringify(properties));
            navigate('/switch-property');
        }
    };
    return (
        <>
            <div className="layout-topbar shadow-4">
                {/* <div className="layout-topbar-left">
                    <button
                        type="button"
                        style={{ cursor: 'pointer' }}
                        className="layout-topbar-logo p-link"
                        onClick={() => {
                            loginDetails?.role === 'Super Admin'
                                ? navigate('/superadmin/dashboard')
                                : // navigate(`/${loginDetails ? loginDetails?.property_name && loginDetails?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
                                  navigate(`/property-management/dashboard`);
                        }}
                    >
                        <img id="app-logo" src={ComplexLogo} alt="ultima-layout" style={{ height: '2rem' }} />
                    </button>
                    {((loginDetails?.role !== 'Super Admin' && stepperDetail?.maintenanceSettingExists && stepperDetail?.propertyStructureExists && stepperDetail?.vehicleSettingExists) || loginDetails?.role === 'Super Admin') && (
                        <button type="button" className="layout-menu-button shadow-6 p-link" onClick={props.onMenuButtonClick} style={{ backgroundColor: 'rgb(37 92 38)' }}>
                            <i className="pi pi-chevron-right"></i>
                        </button>
                    )}
                    <button type="button" className="layout-topbar-mobile-button p-link">
                        <i className="pi pi-ellipsis-v fs-large" onClick={props.onMobileTopbarButtonClick}></i>
                    </button>
                </div> */}
                <div className="layout-topbar-left">
                    <button
                        type="button"
                        style={{
                            cursor: location.pathname === '/switch-property' ? 'default' : 'pointer'
                        }}
                        className="layout-topbar-logo p-link"
                        onClick={() => {
                            if (location.pathname !== '/switch-property') {
                                loginDetails?.role === 'Super Admin' ? navigate('/superadmin/dashboard') : navigate(`/property-management/dashboard`);
                            }
                        }}
                    >
                        <img id="app-logo" src={ComplexLogo} alt="ultima-layout" style={{ height: '2rem' }} />
                    </button>

                    {((loginDetails?.role !== 'Super Admin' && stepperDetail?.maintenanceSettingExists && stepperDetail?.propertyStructureExists && stepperDetail?.vehicleSettingExists) || loginDetails?.role === 'Super Admin') &&
                        location.pathname !== '/switch-property' && (
                            <button type="button" className="layout-menu-button shadow-6 p-link" onClick={props.onMenuButtonClick} style={{ backgroundColor: 'rgb(37 92 38)' }}>
                                <i className="pi pi-chevron-right"></i>
                            </button>
                        )}

                    <button type="button" className="layout-topbar-mobile-button p-link">
                        <i className="pi pi-ellipsis-v fs-large" onClick={props.onMobileTopbarButtonClick}></i>
                    </button>
                </div>

                <div className={classNames('layout-topbar-right', { 'layout-topbar-mobile-active': props.mobileTopbarActive })}>
                    <div className="layout-topbar-actions-left">
                        {loginDetails?.role !== 'Super Admin' && (
                            <div className="flex flex-column justify-content-center">
                                <div className="text-lg font-semibold">{loginDetails?.property_name}</div>
                            </div>
                        )}
                        <MegaMenu model={model} className="layout-megamenu" />
                    </div>
                    <div className="layout-topbar-actions-right">
                        <ul className="layout-topbar-items">
                            {/* <li className="layout-topbar-item layout-search-item">
                            <button className="layout-topbar-action rounded-circle p-link" onClick={() => props.onSearch(true)}>
                                <i className="pi pi-search fs-large"></i>
                            </button>
                            <CSSTransition nodeRef={topbarRef1} classNames="p-toggleable" timeout={{ enter: 1000, exit: 450 }} in={props.searchActive} unmountOnExit>
                                <div ref={topbarRef1} className="layout-search-panel p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-search"></i>
                                    </span>
                                    <InputText type="text" placeholder="Search" onKeyDown={onInputKeydown} />
                                    <span className="p-inputgroup-addon">
                                        <Button type="button" icon="pi pi-times" className="p-button-rounded p-button-text p-button-plain" onClick={() => props.onSearch(false)}></Button>
                                    </span>
                                </div>
                            </CSSTransition>
                        </li> */}
                            {/*
                        <li className="layout-topbar-item notifications">
                            <button className="layout-topbar-action rounded-circle p-link" onClick={(event) => props.onTopbarItemClick({ originalEvent: event, item: 'notifications' })}>
                                <span className="p-overlay-badge">
                                    <i className="pi pi-bell fs-large"></i>
                                    <span className="p-badge p-badge-warning p-badge-dot"></span>
                                </span>
                            </button>

                            <CSSTransition nodeRef={topbarRef2} classNames="p-toggleable" timeout={{ enter: 1000, exit: 450 }} in={props.activeTopbarItem === 'notifications'} unmountOnExit>
                                <ul ref={topbarRef2} className="layout-topbar-action-panel shadow-6 fadeInDown">
                                    <li className="mb-3">
                                        <span className="px-3 fs-small">
                                            You have <b>4</b> new notifications
                                        </span>
                                    </li>
                                    <li className="layout-topbar-action-item">
                                        <div className="flex flex-row align-items-center">
                                            <img src="assets/demo/images/avatar/avatar-1.png" alt="" />
                                            <div className={classNames('flex flex-column', { 'ml-3': !isRTL, 'mr-3': isRTL })} style={{ flexGrow: '1' }}>
                                                <div className="flex align-items-center justify-content-between mb-1">
                                                    <span className="fs-small font-bold">Jerome Bell</span>
                                                    <small>42 mins ago</small>
                                                </div>
                                                <span className="fs-small">How to write content about your photographs?</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="layout-topbar-action-item">
                                        <div className="flex flex-row align-items-center">
                                            <img src="assets/demo/images/avatar/avatar-2.png" alt="" />
                                            <div className={classNames('flex flex-column', { 'ml-3': !isRTL, 'mr-3': isRTL })} style={{ flexGrow: '1' }}>
                                                <div className="flex align-items-center justify-content-between mb-1">
                                                    <span className="fs-small font-bold">Cameron Williamson</span>
                                                    <small>48 mins ago</small>
                                                </div>
                                                <span className="fs-small">Start a blog to reach your creative peak.</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="layout-topbar-action-item">
                                        <div className="flex flex-row align-items-center">
                                            <img src="assets/demo/images/avatar/avatar-3.png" alt="" />
                                            <div className={classNames('flex flex-column', { 'ml-3': !isRTL, 'mr-3': isRTL })} style={{ flexGrow: '1' }}>
                                                <div className="flex align-items-center justify-content-between mb-1">
                                                    <span className="fs-small font-bold">Anna Miles</span>
                                                    <small>1 day ago</small>
                                                </div>
                                                <span className="fs-small">Caring is the new marketing</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="layout-topbar-action-item">
                                        <div className="flex flex-row align-items-center">
                                            <img src="assets/demo/images/avatar/avatar-4.png" alt="" />
                                            <div className={classNames('flex flex-column', { 'ml-3': !isRTL, 'mr-3': isRTL })} style={{ flexGrow: '1' }}>
                                                <div className="flex align-items-center justify-content-between mb-1">
                                                    <span className="fs-small font-bold">Arlene Mccoy</span>
                                                    <small>4 day ago</small>
                                                </div>
                                                <span className="fs-small">Starting your traveling blog with Vasco.</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </CSSTransition>
                        </li> */}
                            {/* <li className="layout-topbar-item app">
                            <button className="layout-topbar-action rounded-circle p-link" onClick={(event) => props.onTopbarItemClick({ originalEvent: event, item: 'apps' })}>
                                <i className="pi pi-table fs-large"></i>
                            </button>

                            <CSSTransition nodeRef={topbarRef3} classNames="p-toggleable" timeout={{ enter: 1000, exit: 450 }} in={props.activeTopbarItem === 'apps'} unmountOnExit>
                                <div ref={topbarRef3} className="layout-topbar-action-panel shadow-6">
                                    <div className="grid grid-nogutter">
                                        <div className="layout-topbar-action-item col-4">
                                            <button className="flex align-items-center flex-column text-color p-link">
                                                <i className="pi pi-image action indigo-bgcolor white-color"></i>
                                                <span>Products</span>
                                            </button>
                                        </div>
                                        <div className="layout-topbar-action-item col-4">
                                            <button className="flex align-items-center flex-column text-color p-link">
                                                <i className="pi pi-file-pdf action orange-bgcolor white-color"></i>
                                                <span>Reports</span>
                                            </button>
                                        </div>
                                        <div className="layout-topbar-action-item col-4">
                                            <button className="flex align-items-center flex-column text-color p-link">
                                                <i className="pi pi-dollar action teal-bgcolor white-color"></i>
                                                <span>Balance</span>
                                            </button>
                                        </div>
                                        <div className="layout-topbar-action-item col-4">
                                            <button className="flex align-items-center flex-column text-color p-link">
                                                <i className="pi pi-cog action pink-bgcolor white-color"></i>
                                                <span>Settings</span>
                                            </button>
                                        </div>
                                        <div className="layout-topbar-action-item col-4">
                                            <button className="flex align-items-center flex-column text-color p-link">
                                                <i className="pi pi-key action bluegrey-bgcolor white-color"></i>
                                                <span>Credentials</span>
                                            </button>
                                        </div>
                                        <div className="layout-topbar-action-item col-4">
                                            <button className="flex align-items-center justify-content-center flex-column text-color p-link">
                                                <i className="pi pi-sitemap action cyan-bgcolor white-color"></i>
                                                <span>Sitemap</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </li> */}
                            {!isMyPropertiesRoute && (
                                <div className="flex align-items-center mr-4">
                                    <i className="pi pi-bell p-overlay-badge cursor-pointer" style={{ fontSize: '1.3rem' }} onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup>
                                        <Badge value={notificationsData?.total ? notificationsData?.total : 0} severity="danger" style={badgeStyle} />
                                    </i>
                                    <Menu model={items} popup ref={menuLeft} id="popup_menu_left" className="md:w-30rem mt-4" />
                                </div>
                            )}
                            <div className="flex flex-column justify-content-center">
                                <span className="font-bold capitalize">{loginDetails?.role === 'Super Admin' ? loginDetails?.name : loginDetails?.name}</span>
                                {loginDetails?.user_connect_with_property_id && loginDetails?.role_permissions ? (
                                    <small className="capitalize">{loginDetails?.role_permissions.find((x) => x.role === 'Chairman') ? 'Chairman' : getRoleName()}</small>
                                ) : loginDetails?.role === 'Super Admin' ? (
                                    loginDetails?.role
                                ) : (
                                    loginDetails?.role
                                )}
                                {/* {loginDetails?.user_connect_with_property_id && loginDetails?.role ? <small className="capitalize"> {loginDetails?.role}</small> : loginDetails?.user_connect_with_property_id && loginDetails?.role_permissions.filter((x) => x.role === "Chairman")[0].role === "Chairman" && loginDetails?.role_permissions.filter((x) => x.role === "Chairman")[0].role} */}
                                {/* {loginDetails?.role_permissions.filter((x) => x.role === "Chairman")[0].role === "Chairman" ? <small className="capitalize"> {loginDetails?.role_permissions.filter((x) => x.role === "Chairman")[0].role}</small> : null} */}
                            </div>
                            <li className="layout-topbar-item">
                                <button className="layout-topbar-action flex flex-row justify-content-center align-items-center px-2 rounded-circle p-link" onClick={(event) => props.onTopbarItemClick({ originalEvent: event, item: 'profile' })}>
                                    {profileDetails?.user_profile ? (
                                        <img src={`${BASE_URL_API}user-profile/${profileDetails?.user_profile}`} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '22px' }} />
                                    ) : (
                                        <img src={blankuser} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '22px' }} />
                                    )}
                                </button>

                                <CSSTransition nodeRef={topbarRef4} classNames="p-toggleable" timeout={{ enter: 1000, exit: 450 }} in={props.activeTopbarItem === 'profile'} unmountOnExit>
                                    <ul ref={topbarRef4} className="layout-topbar-action-panel shadow-6">
                                        {/* {decode?.role !== 'Super Admin' && ( */}
                                        {!isMyPropertiesRoute && (
                                            <>
                                                <li className="layout-topbar-action-item" onClick={handleNavigate}>
                                                    <button className="flex flex-row align-items-center p-link">
                                                        <i
                                                            className={classNames('pi pi-user', {
                                                                'mr-2': !isRTL,
                                                                'ml-2': isRTL
                                                            })}
                                                        ></i>
                                                        <span>Profile</span>
                                                    </button>
                                                </li>
                                                { loginDetails?.role !== 'Super Admin' && hasMultipleProperties() && location.pathname !== '/switch-property' && (
                                                    <li className="layout-topbar-action-item" onClick={handleNavigateToSwitchProperty}>
                                                        <button className="flex flex-row align-items-center p-link">
                                                            <i
                                                                className={classNames('pi pi-sync', {
                                                                    'mr-2': !isRTL,
                                                                    'ml-2': isRTL
                                                                })}
                                                            ></i>
                                                            <span>Switch Property</span>
                                                        </button>
                                                    </li>
                                                )}
                                            </>
                                        )}

                                        {/* )} */}
                                        {/* <li className="layout-topbar-action-item">
                                        <button className="flex flex-row align-items-center p-link">
                                            <i className={classNames('pi pi-file', { 'mr-2': !isRTL, 'ml-2': isRTL })}></i>
                                            <span>Terms of Usage</span>
                                        </button>
                                    </li>
                                    <li className="layout-topbar-action-item ">
                                        <button className="flex flex-row align-items-center p-link">
                                            <i className={classNames('pi pi-compass', { 'mr-2': !isRTL, 'ml-2': isRTL })}></i>
                                            <span>Support</span>
                                        </button>
                                    </li> */}
                                        <li className="layout-topbar-action-item" onClick={() => logout()}>
                                            <button className="flex flex-row align-items-center p-link">
                                                <i className={classNames('pi pi-power-off', { 'mr-2': !isRTL, 'ml-2': isRTL })} style={{ fontSize: '15px', lineHeight: '20px' }}></i>
                                                <span>Logout</span>
                                            </button>
                                        </li>
                                    </ul>
                                </CSSTransition>
                            </li>
                            {/* <li className="layout-topbar-item">
                            <button type="button" className="layout-topbar-action rounded-circle p-link" onClick={props.onRightMenuButtonClick}>
                                <i className="pi fs-large pi-arrow-left"></i>
                            </button>
                        </li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppTopbar;
