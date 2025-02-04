import components from '../..';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { roleCreateRequest, updateRoleRequest, getRolesDataById } from '../../../../redux/slice/AdminSlices/roleSlice';
import { useParams } from 'react-router-dom';
const RoleView = ({ editData, onHide }) => {
    const { BreadCrumb, Button, InputText, Checkbox, InputTextarea, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
    const { isCreated, rolesDataById } = useSelector((state) => state.roles);
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [rolesArray, setRolesArray] = useState([
        {
            roleName: 'Dashboard',
            module_name: 'dashboard',
            roles: ['create', 'read', 'update', 'delete']
        },
        {
            roleName: 'Property Assign',
            module_name: 'user-property-assign',
            roles: []
        },
        {
            roleName: 'Vehicles',
            module_name: 'vehicle',
            roles: []
        },
        {
            roleName: 'Maintenance',
            module_name: 'maintenance',
            roles: []
        },
        {
            roleName: 'Maintenance Setting',
            module_name: 'maintenance-settings',
            roles: []
        },
        {
            roleName: 'Complaint',
            module_name: 'complaint',
            roles: []
        },
        {
            roleName: 'Announcement',
            module_name: 'announcement',
            roles: []
        },
        {
            roleName: 'Vendor',
            module_name: 'vendor',
            roles: []
        },
        {
            roleName: 'Rental',
            module_name: 'rental',
            roles: []
        },
        {
            roleName: 'Meeting',
            module_name: 'meeting',
            roles: []
        },
        {
            roleName: 'Event',
            module_name: 'event',
            roles: []
        },
        {
            roleName: 'Emergency Contact',
            module_name: 'emergencycontact',
            roles: []
        },
        {
            roleName: 'Notice',
            module_name: 'notice',
            roles: []
        },
        {
            roleName: 'Expense',
            module_name: 'expense_tracker',
            roles: []
        },
        {
            roleName: 'Contract',
            module_name: 'contract',
            roles: []
        },
        {
            roleName: 'Fix Deposit',
            module_name: 'fixeddeposit',
            roles: []
        },
        {
            roleName: 'Feeds',
            module_name: 'feed',
            roles: []
        }
    ]);
    const [formValue, setFormValue] = useState({
        id: '',
        roleName: '',
        description: ''
    });

    useEffect(() => {
        if (params.id) {
            dispatch(getRolesDataById(params.id));
            // dispatch < any > (getCategoryById(params?.id));
        }
    }, [params.id]);
    useEffect(() => {
        if (isCreated) {
            navigate('/property-management/roles');
        }
    }, [isCreated]);
    useEffect(() => {
        if (rolesDataById?.getMainRoleData && rolesDataById?.getMainRoleData?._id) {
            let array = [...rolesArray];
            let setData = {
                id: rolesDataById?.getMainRoleData?._id,
                roleName: rolesDataById?.getMainRoleData?.role,
                description: rolesDataById?.getMainRoleData?.description
            };

            rolesDataById?.getMainRoleData?.permissions.forEach((a) => {
                let check = array.findIndex((x) => x.module_name === a.module_name);
                if (check !== -1) {
                    array[check].roles = a.module_access;
                }
            });
            setFormValue(setData);
            setRolesArray(array);
        }
    }, [rolesDataById?.getMainRoleData]);
    const SignupSchema = Yup.object().shape({
        roleName: Yup.string().trim().nullable().required('Please enter role name.'),
        description: Yup.string().trim().nullable().required('Please enter description.')
    });
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Roles',
        command: () => {
            navigate('/property-management/roles');
        }
    };
    const breadcrumbItems = [
        {
            label: 'View Role'
            // command: () => {
            //     navigate('/superadmin/properties');
            // }
        }
    ];

    const onCheck = (index, name) => {
        try {
            let array = [...rolesArray];
            let check = array[index].roles.findIndex((x) => x === name);
            if (check === -1) {
                let customArray = [...array[index].roles];
                customArray.push(name);
                array[index].roles = customArray;
            } else {
                array[index].roles = array[index].roles.filter((x) => x !== name);
            }
            setRolesArray(array);
        } catch (error) {
            console.log(error);
        }
    };
    console.log(rolesArray, '::::::rolesArray');
    return (
        <div className="relative min-h-full">
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'View Role' : 'Role Details'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <div className="grid p-fluid mt-1">
                    <div className="field col-12 md:col-2 mb-1">
                        <label htmlFor="roleName" style={{ resize: 'none', color: '#000000' }}>Role Name</label>
                        <InputText id="roleName" name="roleName" placeholder="Enter Role Name" type="text" style={{ resize: 'none', color: '#000000' }} value={rolesDataById?.getMainRoleData?.role} disabled />
                    </div>
                    <div className="field col-12 md:col-10 mb-1">
                        <label htmlFor="description" style={{ resize: 'none', color: '#000000' }}>Description</label>
                        <InputText rows="3" cols="20" id="description" name="description" placeholder="Enter Description" type="text" value={rolesDataById?.getMainRoleData?.description} style={{ resize: 'none', color: '#000000' }} disabled />
                    </div>
                    <div className="field col-12 mb-1">
                        <table className="roles_table">
                            <thead>
                                <tr>
                                    <th className="roles_table_th">Module Name</th>
                                    <th className="roles_table_th">Create</th>
                                    <th className="roles_table_th">Read</th>
                                    <th className="roles_table_th">Update</th>
                                    <th className="roles_table_th">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rolesArray.map((e, i) => (
                                    <tr key={i}>
                                        <td className="roles_table_td">{e.roleName}</td>
                                        <td className="roles_table_td">
                                            <Checkbox checked={e.roles.includes('create')} disabled />
                                        </td>
                                        <td className="roles_table_td">
                                            <Checkbox checked={e.roles.includes('read')} disabled />
                                        </td>
                                        <td className="roles_table_td">
                                            <Checkbox checked={e.roles.includes('update')} disabled />
                                        </td>
                                        <td className="roles_table_td">
                                            <Checkbox checked={e.roles.includes('delete')} disabled />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Back" icon="pi pi-arrow-left" className="p-button-outlined p-button-danger mr-2 w-7rem" onClick={() => navigate('/property-management/roles')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RoleView;
