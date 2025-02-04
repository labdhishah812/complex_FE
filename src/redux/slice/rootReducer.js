import auth from './AdminSlices/authSlice';
import user from './AdminSlices/userSlice';
import vehicle from './AdminSlices/vehicleSlice';
import shop from './AdminSlices/shopSlice';
import maintenance from './AdminSlices/maintenanceSlice';
import complex from './AdminSlices/complexSlice';
import block from './AdminSlices/blockSlice';
import floor from './AdminSlices/floorSlice';
import property from './AdminSlices/propertySlice';
import complaint from './AdminSlices/complaintSlice';
import announcement from './AdminSlices/announcementSlice';
import vendor from './AdminSlices/vendorSlice';
import rental from './AdminSlices/RentalSlice';
import roles from './AdminSlices/roleSlice';
import committee from './AdminSlices/committeeSlice';
import superAdminDashboard from './AdminSlices/superAdminDashboardSlice';
import userDashboard from './AdminSlices/dashboardSlice';
import meeting from './AdminSlices/meetingSlice';
import cms from './AdminSlices/cmsSlice';
import emergencyContact from './AdminSlices/emergencyContactSlice';
import buildingRules from './AdminSlices/buildingRulesSlice';
import event from './AdminSlices/eventSlice';
import contract from './AdminSlices/contractSlice';
import fd from './AdminSlices/fdSlice';
import notice from './AdminSlices/noticeSlice';
import expense from './AdminSlices/expenseSlice';
import notification from './AdminSlices/notificationSlice';
import resolution from './AdminSlices/resolutionSlice';
import generalMember from './AdminSlices/generalMemberSlice';
import feed from './AdminSlices/feedSlice';
import salesman from './AdminSlices/salesmanSlice';
import gatekeeper from './AdminSlices/getKepperSlice';
import gatePass from './AdminSlices/gatepassSlice';

const rootReducer = {
    auth,
    user,
    vehicle,
    shop,
    maintenance,
    complex,
    block,
    floor,
    property,
    complaint,
    announcement,
    vendor,
    rental,
    roles,
    committee,
    superAdminDashboard,
    userDashboard,
    meeting,
    cms,
    contract,
    emergencyContact,
    buildingRules,
    event,
    fd,
    notice,
    expense,
    notification,
    resolution,
    generalMember,
    feed,
    salesman,
    gatekeeper,
    gatePass
};

export default rootReducer;
