import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ id, children }) => {
    const { roleName, stepperDetail, loginDetails } = useSelector((store) => store.auth);
    if (stepperDetail?.propertyStructureExists && stepperDetail?.vehicleSettingExists && stepperDetail?.maintenanceSettingExists) {
        return children;
    } else if (loginDetails?.user_connect_with_property_id) {
        return <Navigate to='/property-management/vizard' />
    } else if (loginDetails?.user_connect_with_property_id === undefined && loginDetails?.role !== "Super Admin") {
        return <Navigate to='/property-management/myproperties' />
    }
    // }
    // else if (!roleName) {
    //     return <Navigate to="/login" />;
    // }
    //  else {
    //     return <Navigate to='/dashboard' />
    // }
};

export default AdminRoute;
