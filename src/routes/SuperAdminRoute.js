import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const SuperAdminRoute = ({ id, children }) => {
    const { loginDetails } = useSelector((store) => store.auth);
    if (loginDetails?.role === 'Super Admin') {
        return children;
    }
};

export default SuperAdminRoute;
