import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const SalesManRoute = ({ id, children }) => {
    const { loginDetails } = useSelector((store) => store.auth);
    if (loginDetails?.role === 'Salesman') {
        return children;
    }
};

export default SalesManRoute;
