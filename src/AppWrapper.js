import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import App from './App';
// import Error from './pages/Error';
// import NotFound from './pages/NotFound';
// import Access from './pages/Access';
// import Landing from './pages/Landing';
import Login from './Views/Pages/authenticatedPages/Login';
import ForgotPassword from './Views/Pages/authenticatedPages/ForgotPassword';
import AuthRoute from './routes/AuthRoute';
import ResetPassword from './Views/Pages/authenticatedPages/ResetPassword';
import Error from './Views/Pages/Error';
import { useSelector } from 'react-redux';
import PrivacyPolicy from './Views/Pages/SuperAdminPages/PrivacyPolicy/PrivacyPolicyUrl';
import ContactUs from './Views/Pages/SuperAdminPages/ContactUs/ContactUsUrl';
import TermsAndConditions from './Views/Pages/SuperAdminPages/Toc/TermsCondition';
import Aboutus from './Views/Pages/SuperAdminPages/AboutUs/Aboutus';
// import RateCart from './Views/Pages/AdminPages/Maintenance/rateCart';
import MaintenanceRateCart from './Views/Pages/AdminPages/Settings/MaintenanceRateCart';
import SelfInquiryForm from './Views/Pages/SuperAdminPages/Properties/selfInquiryForm';
import QRView from './Views/Pages/AdminPages/Gatepass/QRView';
// import MaintenanceBill from './Views/Pages/AdminPages/Settings/MaintenanceBill';
const AppWrapper = (props) => {
    let location = useLocation();
    const { token, loginDetails } = useSelector((store) => store.auth);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <Routes>
            <Route path="/selfinquiry/form" element={<SelfInquiryForm />} />
            {loginDetails?.token === null && <Route path="/" element={<Login />} />}
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/property-management/gatepass/view-qr/:encodedData" element={<QRView />} />
            <Route path="/user/reset-password/:id" element={<ResetPassword />} />
            <Route path="/error" element={<Error />} />
            {/* <Route path="/notfound" element={<NotFound />} />
            <Route path="/access" element={<Access />} />
            <Route path="/landing" element={<Landing />} /> */}
            <Route
                path="*"
                element={
                    <AuthRoute>
                        <App />
                    </AuthRoute>
                }
            />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/terms-condition" element={<TermsAndConditions />} />
            <Route path="/aboutus" element={<Aboutus />} />
            {loginDetails?.role_permissions.length > 0 && <Route path="/property-management/maintenancelist/rate-maintainance" element={<MaintenanceRateCart />} />}
            {/* {loginDetails?.role_permissions.length > 0 && <Route path="/property-management/maintenancelist/rate-cart/:id" element={<RateCart />} />}
            {loginDetails?.role_permissions.length > 0 && <Route path="/property-management/maintenancelist/bill/:id" element={<MaintenanceBill />} />} */}
        </Routes>
    );
};

export default AppWrapper;
