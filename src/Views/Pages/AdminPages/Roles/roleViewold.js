import { useParams } from 'react-router-dom';
import components from '../..';
import Loader from '../../../../components/Loader';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { getRolesDataById } from '../../../../redux/slice/AdminSlices/roleSlice';

const RoleView = () => {
    const {
        BreadCrumb,
        Button,
        useNavigate,
        useSelector,
        useDispatch
    } = components;

    const { loginDetails } = useSelector((store) => store.auth);
    const { isLoading, rolesDataById } = useSelector((state) => state.roles);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    // Fetch role data on component load
    useEffect(() => {
        if (params.id) {
            dispatch(getRolesDataById(params.id));
        }
    }, [params.id, dispatch]);

    const breadcrumbHome = {
        label: 'Roles',
        command: () => {
            navigate(`/property-management/roles`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'View Role'
        }
    ];

    const roleData = rolesDataById?.getMainRoleData;

    if (!roleData) {
        return (
            <div className="text-center mt-5">
                <p>No data available for the selected role.</p>
            </div>
        );
    }

    const checkPermissions = (permissionName) => {
        try {
            return loginDetails?.role_permissions?.some((role) =>
                role.permission.some((perm) =>
                    perm.module_name === 'roles' && perm.module_access.includes(permissionName)
                )
            );
        } catch (error) {
            console.error('Permission check error:', error);
            return false;
        }
    };

    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">View Role</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ maxWidth: '60rem' }}>
                <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">Role Name</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {roleData.role || '-'}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Description</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 capitalize-first-letter">
                            {roleData.description || 'No description available'}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap surface-ground">
                        <div className="text-500 w-16rem font-medium">Permissions</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {roleData.permissions?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {roleData.permissions.map((permission) => (
                                        <div key={permission._id} className="px-3 py-1 border-round bg-gray-200 text-green-500">
                                            {permission.module_name}
                                        </div>
                                    ))}
                                </div>
                            ) : '-'}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Created At</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {roleData.created_at
                                ? moment(roleData.created_at).format('D MMM YY, LT')
                                : '-'}
                        </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-16rem font-medium">Updated At</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {roleData.updated_at
                                ? moment(roleData.updated_at).format('D MMM YY, LT')
                                : '-'}
                        </div>
                    </li>
                    {checkPermissions('update') && roleData.role !== 'Chairman' && (
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-16rem font-medium">Actions</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                <Button
                                    label="Edit Role"
                                    icon="pi pi-pencil"
                                    className="p-button-outlined p-button-help"
                                    onClick={() => navigate(`/property-management/role-edite/${roleData._id}`)}
                                />
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default RoleView;
