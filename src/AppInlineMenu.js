import { CSSTransition } from 'react-transition-group';
import { classNames } from 'primereact/utils';
import { useContext, useEffect, useRef, useState } from 'react';
import { RTLContext } from './App';
import { Tooltip } from 'primereact/tooltip';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from './redux/slice/AdminSlices/authSlice';
import blankuser from './assets/images/blank-user.jpg';
// import jwtDecode from 'jwt-decode';

const AppInlineMenu = (props) => {
    const { userData, profileImage, token, loginDetails, profileDetails } = useSelector((store) => store.auth);
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [decode, setDecode] = useState(null);
    const inlineMenuRef = useRef(null);
    const isRTL = useContext(RTLContext);
    const menuKey = props.menuKey || 'inline-menu';

    const inlineMenuClassName = classNames(
        'layout-inline-menu',
        {
            'layout-inline-menu-active': props.inlineMenuActive[props.menuKey]
        },
        props.className
    );

    const isSlim = () => {
        return props.menuMode === 'slim';
    };
    // useEffect(() => {
    //     if (token != null) {
    //         getRole(token);
    //         // let decodeData = await jwtDecode(token);
    //         // setDecode(decodeData);
    //     }
    // }, [token]);
    // const getRole = async (token) => {
    //     let decodeData = await jwtDecode(token);
    //     setDecode(decodeData);
    // };
    const handleNavigate = () => {
        // loginDetails?.role !== 'Super Admin' ? navigate(`/${loginDetails ? loginDetails?.property_name && loginDetails?.property_name.replace(/ /g, '-').toLowerCase() : ''}/profile`) : navigate('/superadmin/profile');
        loginDetails?.role !== 'Super Admin' ? navigate(`/property-management/profile`) : navigate('/superadmin/profile');
    };
    const handleLogoutEvent = () => {
        navigate('/login');
        dispatch(handleLogout());
    };
    const getRoleName = () => {
        try {
            let role = ""
            let committeeName = loginDetails.role_permissions.filter((x) => x.role !== "User" && x.role !== "Chairman");
            if (committeeName && committeeName.length > 0) {
                role = committeeName[0].role
            } else {
                role = "User";
            }
            return role;
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className={inlineMenuClassName} style={props.style}>
            {isSlim() && <Tooltip target=".avatarTooltip" />}

            <button
                data-pr-tooltip="Amy Elsner"
                className={classNames('avatarTooltip layout-inline-menu-action p-link flex flex-row align-items-center', { 'p-3 lg:p-1 py-3': props.horizontal, 'p-3': !props.horizontal })}
                onClick={(e) => props.onInlineMenuClick(e, menuKey)}
            >
                <img src={profileDetails?.user_profile ? `${BASE_URL_API}user-profile/${profileDetails?.user_profile}` : blankuser} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '22px' }} />
                {/* <img src="assets/demo/images/avatar/amyelsner.png" alt="avatar" style={{ width: '32px', height: '32px' }} /> */}
                <span className={classNames('flex flex-column', { 'ml-2': !isRTL, 'mr-2': isRTL })}>
                    {/* <span className="font-bold capitalize">{userData?.name == null ? ' Super Admin' : userData?.name}</span> */}
                    <span className="font-bold capitalize">{loginDetails?.role === "Super Admin" ? loginDetails?.name : loginDetails?.name}</span>
                    {loginDetails?.role ? <small className="capitalize"> {loginDetails?.role}</small> : null}
                    {loginDetails?.user_connect_with_property_id && loginDetails?.role_permissions ?  <small className="capitalize">{loginDetails?.role_permissions.find((x) => x.role === "Chairman") ? "Chairman" :  getRoleName()}</small> : ""}
                    {/* {loginDetails?.user_connect_with_property_id && loginDetails?.role ? <small className="capitalize"> {loginDetails?.role}</small> : ""} */}
                    {/* loginDetails?.user_connect_with_property_id && loginDetails?.role_permissions.filter((x) => x.role === "Chairman")[0].role === "Chairman" && loginDetails?.role_permissions.filter((x) => x.role === "Chairman")[0].role} */}
                </span>
                <i className={classNames('layout-inline-menu-icon pi pi-angle-down', { 'ml-auto': !isRTL, 'mr-auto': isRTL })}></i>
            </button>

            <CSSTransition nodeRef={inlineMenuRef} classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={props.inlineMenuActive[menuKey]} unmountOnExit>
                <>
                    <ul ref={inlineMenuRef} className="layout-inline-menu-action-panel">
                        {/* {decode?.role !== 'Super Admin' && ( */}
                        <li className="layout-inline-menu-action-item tooltip" data-pr-tooltip="Settings" onClick={() => handleNavigate()}>
                            <button className="flex flex-row align-items-center p-link">
                                <i className="pi pi-user pi-fw"></i>
                                <span>Profile</span>
                            </button>
                        </li>
                        {/* )} */}
                        {/* <li className="layout-inline-menu-action-item tooltip" data-pr-tooltip="Terms of Usage">
                            <button className="flex flex-row align-items-center p-link">
                                <i className="pi pi-file pi-fw"></i>
                                <span>Terms of Usage</span>
                            </button>
                        </li>
                        <li className="layout-inline-menu-action-item tooltip" data-pr-tooltip="Support">
                            <button className="flex flex-row align-items-center p-link">
                                <i className="pi pi-compass pi-fw"></i>
                                <span>Support</span>
                            </button>
                        </li> */}
                        <li className="layout-inline-menu-action-item tooltip" data-pr-tooltip="Logout" onClick={() => handleLogoutEvent()}>
                            <button className="flex flex-row align-items-center p-link">
                                <i className="pi pi-power-off pi-fw"></i>
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                    {isSlim() && <Tooltip target=".tooltip" />}
                </>
            </CSSTransition>
        </div>
    );
};

export default AppInlineMenu;
