import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const UserRoute = ({ children }) => {
    const { roleName, stepperDetail, loginDetails } = useSelector((store) => store.auth);
    if ((stepperDetail?.propertyStructureExists === false || stepperDetail?.maintenanceSettingExists === false || stepperDetail?.vehicleSettingExists === false) && loginDetails?.user_connect_with_property_id && loginDetails?.role !== "Super Admin") {
        return children;
    } else if (loginDetails?.role === "Super Admin") {
        return <Navigate to='/superadmin/dashboard' />
    } else if (loginDetails?.role === "Salesman") {
        return <Navigate to='/salesman/dashboard' />
    } else if (loginDetails?.role !== "Super Admin" && loginDetails?.user_connect_with_property_id) {
        return <Navigate to='/property-management/dashboard' />
        // return <Navigate to='/property-management/vizard' />
    } else if (loginDetails?.user_connect_with_property_id === undefined && loginDetails?.role !== "Super Admin") {
        return children;
    }
};

export default UserRoute;
