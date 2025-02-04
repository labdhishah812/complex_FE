// import components from '../..';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import { roleCreateRequest, updateRoleRequest, getRolesDataById } from '../../../../redux/slice/AdminSlices/roleSlice';
// import { useParams } from 'react-router-dom';
// const RolesCreateSuperAdmin = ({ editData, onHide }) => {
//     const { BreadCrumb, Button, InputText, Checkbox, InputTextarea, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
//     const { isCreated, rolesDataById } = useSelector((state) => state.roles);
//     const params = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [submitted, setSubmitted] = useState(false);
//     const [rolesArray, setRolesArray] = useState([
//         {
//             roleName: 'Dashboard',
//             module_name: 'dashboard',
//             roles: ['create', 'read', 'update', 'delete']
//         },
//         {
//             roleName: 'Property Settings',
//             module_name: 'property',
//             roles: []
//         },
//         {
//             roleName: 'Contact Us',
//             module_name: 'contactus',
//             roles: []
//         },
//         {
//             roleName: 'About Us',
//             module_name: 'aboutus',
//             roles: []
//         },
//         {
//             roleName: 'Terms & Condition',
//             module_name: 'termscondition',
//             roles: []
//         },
//         {
//             roleName: 'Privacy-Policy',
//             module_name: 'privacypolicy',
//             roles: []
//         },
//         {
//             roleName: 'Footer',
//             module_name: 'footer',
//             roles: []
//         },
//         {
//             roleName: 'User',
//             module_name: 'user',
//             roles: []
//         },
//         {
//             roleName: 'Notification',
//             module_name: 'notification',
//             roles: []
//         },
//         {
//             roleName: 'Salesman',
//             module_name: 'salesman',
//             roles: []
//         },
//         {
//             roleName: 'Role',
//             module_name: 'role',
//             roles: []
//         }
//         // {
//         //     roleName: 'Emergency Contact',
//         //     module_name: 'emergencycontact',
//         //     roles: []
//         // },
//         // {
//         //     roleName: 'Notice',
//         //     module_name: 'notice',
//         //     roles: []
//         // },
//         // {
//         //     roleName: 'Expense',
//         //     module_name: 'expense_tracker',
//         //     roles: []
//         // },
//         // {
//         //     roleName: 'Contract',
//         //     module_name: 'contract',
//         //     roles: []
//         // },
//         // {
//         //     roleName: 'Fix Deposit',
//         //     module_name: 'fixeddeposit',
//         //     roles: []
//         // },
//     ]);
//     const [formValue, setFormValue] = useState({
//         id: '',
//         roleName: '',
//         description: ''
//     });


//     useEffect(() => {
//         if (params.id) {
//             dispatch(getRolesDataById(params.id));
//             // dispatch < any > (getCategoryById(params?.id));
//         }
//     }, [params.id]);
//     useEffect(() => {
//         if (isCreated) {
//             navigate('/superadmin/roles');
//         }
//     }, [isCreated]);
//     useEffect(() => {
//         if (rolesDataById?.getMainRoleData && rolesDataById?.getMainRoleData?._id) {
//             let array = [...rolesArray];
//             let setData = {
//                 id: rolesDataById?.getMainRoleData?._id,
//                 roleName: rolesDataById?.getMainRoleData?.role,
//                 description: rolesDataById?.getMainRoleData?.description
//             };

//             rolesDataById?.getMainRoleData?.permissions.forEach((a) => {
//                 let check = array.findIndex((x) => x.module_name === a.module_name);
//                 if (check !== -1) {
//                     array[check].roles = a.module_access;
//                 }
//             });
//             setFormValue(setData);
//             setRolesArray(array);
//         }
//     }, [rolesDataById?.getMainRoleData]);
//     const SignupSchema = Yup.object().shape({
//         roleName: Yup.string().trim().nullable().required('Please enter role name.'),
//         description: Yup.string().trim().nullable().required('Please enter description.')
//     });
//     const breadcrumbHome = {
//         // icon: 'pi pi-home',
//         label: 'Role',
//         command: () => {
//             navigate('/superadmin/roles');
//         }
//     };
//     const breadcrumbItems = [
//         {
//             label: params?.id ? 'Edit Role' : 'Create Role'
//             // command: () => {
//             //     navigate('/superadmin/properties');
//             // }
//         }
//     ];

//     const onCheck = (index, name) => {
//         try {
//             let array = [...rolesArray];
//             let check = array[index].roles.findIndex((x) => x === name);
//             if (check === -1) {
//                 let customArray = [...array[index].roles];
//                 customArray.push(name);
//                 array[index].roles = customArray;
//             } else {
//                 array[index].roles = array[index].roles.filter((x) => x !== name);
//             }
//             setRolesArray(array);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     return (
//         <div className="relative min-h-full">
//             <div className="flex justify-content-between align-items-center">
//                 <div className="flex flex-row w-full">
//                     <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Role' : 'Create Role'}</h5>
//                     <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                 </div>
//             </div>
//             <div className="crud-demo ml-0 mr-0 card mt-3">
//                 <Formik
//                     initialValues={formValue}
//                     validationSchema={SignupSchema}
//                     onSubmit={(values) => {
//                         setSubmitted(true);
//                         setTimeout(() => {
//                             setSubmitted(false);
//                         }, 5000);
//                         let sendData = {
//                             role: values?.roleName,
//                             description: values?.description,
//                             permissions: []
//                         };
//                         rolesArray.forEach((a) => {
//                             if (a.roles.length > 0) {
//                                 sendData.permissions.push({ module_name: a.module_name, module_access: a.roles });
//                             }
//                         });
//                         values?.id === '' && dispatch(roleCreateRequest(sendData));
//                         values?.id !== '' && dispatch(updateRoleRequest(values?.id, sendData));
//                     }}
//                     enableReinitialize
//                 >
//                     {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
//                         <Form>
//                             <div className="grid p-fluid mt-1">
//                                 <div className="field col-12 md:col-4 mb-1">
//                                     <label htmlFor="roleName" className="required">
//                                         Role Name
//                                     </label>
//                                     <InputText
//                                         id="roleName"
//                                         name="roleName"
//                                         placeholder="Enter Role Name"
//                                         type="text"
//                                         value={rolesDataById?.getMainRoleData?.role}
//                                         onChange={handleChange}
//                                         className={classNames({ 'p-invalid': errors.roleName && touched.roleName })}
//                                     />
//                                     <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
//                                         {errors.roleName && touched.roleName ? errors.roleName : ''}
//                                     </div>
//                                     {/* {errors.roleName && touched.roleName ? <small className="p-invalid error">{errors.roleName}</small> : null} */}
//                                 </div>
//                                 <div className="field col-12 md:col-4 mb-1">
//                                     <label htmlFor="description" className="required">
//                                         Description
//                                     </label>
//                                     <InputTextarea
//                                         rows="3"
//                                         cols="20"
//                                         id="description"
//                                         name="description"
//                                         placeholder="Enter Description"
//                                         type="text"
//                                         value={rolesDataById?.getMainRoleData?.description}
//                                         onChange={handleChange}
//                                         className={classNames({ 'p-invalid': errors.description && touched.description })}
//                                         style={{ resize: 'none' }}
//                                     />
//                                     <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
//                                         {errors.description && touched.description ? errors.description : ''}
//                                     </div>

//                                     {/* {errors.description && touched.description ? <small className="p-invalid error">{errors.description}</small> : null} */}
//                                 </div>
//                                 {/* {formValue.roleName} */}
//                                 <div className="field col-12 mb-1">
//                                     <table className="roles_table">
//                                         <thead>
//                                             <tr>
//                                                 <th className="roles_table_th">Module Name</th>
//                                                 <th className="roles_table_th">Create</th>
//                                                 <th className="roles_table_th">Read</th>
//                                                 <th className="roles_table_th">Update</th>
//                                                 <th className="roles_table_th">Delete</th>
//                                                 {/* <th className="maintenanceSettings_table_th">Floor</th>
//                                         <th className="maintenanceSettings_table_th">Maintenance Amount</th> */}
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {rolesArray.map((e, i) => (
//                                                 <tr key={i}>
//                                                     <td className="roles_table_td">{e.roleName}</td>
//                                                     <td className="roles_table_td">
//                                                         <Checkbox onChange={() => onCheck(i, 'create')} checked={e.roles.findIndex((x) => x === 'create') !== -1} disabled={e.module_name === 'dashboard' || e.module_name === 'rental'}></Checkbox>
//                                                     </td>
//                                                     <td className="roles_table_td">
//                                                         <Checkbox onChange={() => onCheck(i, 'read')} checked={e.roles.findIndex((x) => x === 'read') !== -1} disabled={e.module_name === 'dashboard'}></Checkbox>
//                                                     </td>
//                                                     <td className="roles_table_td">
//                                                         <Checkbox onChange={() => onCheck(i, 'update')} checked={e.roles.findIndex((x) => x === 'update') !== -1} disabled={e.module_name === 'dashboard' || e.module_name === 'rental'}></Checkbox>
//                                                     </td>
//                                                     <td className="roles_table_td">
//                                                         <Checkbox onChange={() => onCheck(i, 'delete')} checked={e.roles.findIndex((x) => x === 'delete') !== -1} disabled={e.module_name === 'dashboard' || e.module_name === 'rental'}></Checkbox>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                             <div className="grid p-fluid mt-1">
//                                 <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
//                                     <Button
//                                         label="Cancel"
//                                         icon="pi pi-times"
//                                         className="p-button-outlined p-button-danger mr-2 w-7rem"
//                                         // onClick={onHide}
//                                         onClick={() => navigate('/superadmin/roles')}
//                                     />
//                                     <Button disabled={submitted} label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 w-7rem" />
//                                 </div>
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </div>
//     );
// };

// export default RolesCreateSuperAdmin;

import components from '../..';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { roleCreateRequest, updateRoleRequest, getRolesDataById } from '../../../../redux/slice/AdminSlices/roleSlice';
import { useParams } from 'react-router-dom';

const RolesCreateSuperAdmin = ({ editData, onHide }) => {
    const { BreadCrumb, Button, InputText, Checkbox, InputTextarea, classNames, useDispatch, useState, useEffect, useNavigate, useSelector } = components;
    const { isCreated, rolesDataById } = useSelector((state) => state.roles);
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [headerChecks, setHeaderChecks] = useState({
        create: false,
        read: false,
        update: false,
        delete: false
    });

    const [rolesArray, setRolesArray] = useState([
        {
            roleName: 'Dashboard',
            module_name: 'dashboard',
            roles: ['create', 'read', 'update', 'delete']
        },
        {
            roleName: 'Property Settings',
            module_name: 'property',
            roles: []
        },
        {
            roleName: 'Contact Us',
            module_name: 'contactus',
            roles: []
        },
        {
            roleName: 'About Us',
            module_name: 'aboutus',
            roles: []
        },
        {
            roleName: 'Terms & Condition',
            module_name: 'termscondition',
            roles: []
        },
        {
            roleName: 'Privacy-Policy',
            module_name: 'privacypolicy',
            roles: []
        },
        {
            roleName: 'Footer',
            module_name: 'footer',
            roles: []
        },
        {
            roleName: 'User',
            module_name: 'user',
            roles: []
        },
        {
            roleName: 'Notification',
            module_name: 'notification',
            roles: []
        },
        {
            roleName: 'Salesman',
            module_name: 'salesman',
            roles: []
        },
        {
            roleName: 'Role',
            module_name: 'role',
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
        }
    }, [params.id]);

    useEffect(() => {
        if (isCreated) {
            navigate('/superadmin/roles');
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

            // Update header checkboxes based on loaded data
            const newHeaderChecks = {
                create: array.every(item => item.roles.includes('create') || item.module_name === 'dashboard'),
                read: array.every(item => item.roles.includes('read') || item.module_name === 'dashboard'),
                update: array.every(item => item.roles.includes('update') || item.module_name === 'dashboard'),
                delete: array.every(item => item.roles.includes('delete') || item.module_name === 'dashboard')
            };
            setHeaderChecks(newHeaderChecks);
        }
    }, [rolesDataById?.getMainRoleData]);

    const SignupSchema = Yup.object().shape({
        roleName: Yup.string().trim().nullable().required('Please enter role name.'),
        description: Yup.string().trim().nullable().required('Please enter description.')
    });

    const breadcrumbHome = {
        label: 'Role',
        command: () => {
            navigate('/superadmin/roles');
        }
    };

    const breadcrumbItems = [
        {
            label: params?.id ? 'Edit Role' : 'Create Role'
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

            // Update header checkbox state
            const allChecked = array.every((item) => {
                if (item.module_name === 'dashboard') {
                    return true;
                }
                return item.roles.includes(name);
            });

            setHeaderChecks((prev) => ({
                ...prev,
                [name]: allChecked
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const onHeaderCheck = (permission) => {
        const newHeaderChecks = {
            ...headerChecks,
            [permission]: !headerChecks[permission]
        };
        setHeaderChecks(newHeaderChecks);

        const updatedRolesArray = rolesArray.map((role) => {
            if (role.module_name === 'dashboard') {
                return role;
            }

            let newRoles = [...role.roles];
            if (newHeaderChecks[permission]) {
                if (!newRoles.includes(permission)) {
                    newRoles.push(permission);
                }
            } else {
                newRoles = newRoles.filter((r) => r !== permission);
            }

            return {
                ...role,
                roles: newRoles
            };
        });

        setRolesArray(updatedRolesArray);
    };

    return (
        <div className="relative min-h-full">
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params?.id ? 'Edit Role' : 'Create Role'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <Formik
                    initialValues={formValue}
                    validationSchema={SignupSchema}
                    onSubmit={(values) => {
                        setSubmitted(true);
                        setTimeout(() => {
                            setSubmitted(false);
                        }, 5000);
                        let sendData = {
                            role: values?.roleName,
                            description: values?.description,
                            permissions: []
                        };
                        rolesArray.forEach((a) => {
                            if (a.roles.length > 0) {
                                sendData.permissions.push({ module_name: a.module_name, module_access: a.roles });
                            }
                        });
                        values?.id === '' && dispatch(roleCreateRequest(sendData));
                        values?.id !== '' && dispatch(updateRoleRequest(values?.id, sendData));
                    }}
                    enableReinitialize
                >
                    {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                        <Form>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="roleName" className="required">
                                        Role Name
                                    </label>
                                    <InputText
                                        id="roleName"
                                        name="roleName"
                                        placeholder="Enter Role Name"
                                        type="text"
                                        value={values.roleName}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.roleName && touched.roleName })}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.roleName && touched.roleName ? errors.roleName : ''}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-4 mb-1">
                                    <label htmlFor="description" className="required">
                                        Description
                                    </label>
                                    <InputTextarea
                                        rows="3"
                                        cols="20"
                                        id="description"
                                        name="description"
                                        placeholder="Enter Description"
                                        type="text"
                                        value={values.description}
                                        onChange={handleChange}
                                        className={classNames({ 'p-invalid': errors.description && touched.description })}
                                        style={{ resize: 'none' }}
                                    />
                                    <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                        {errors.description && touched.description ? errors.description : ''}
                                    </div>
                                </div>
                                <div className="field col-12 mb-1">
                                    <table className="roles_table">
                                        <thead>
                                            <tr>
                                                <th className="roles_table_th">Module Name</th>
                                                <th className="roles_table_th">
                                                    <div className="flex align-items-center justify-content-center gap-2">
                                                        Create
                                                        <Checkbox onChange={() => onHeaderCheck('create')} checked={headerChecks.create} />
                                                    </div>
                                                </th>
                                                <th className="roles_table_th">
                                                    <div className="flex align-items-center justify-content-center gap-2">
                                                        Read
                                                        <Checkbox onChange={() => onHeaderCheck('read')} checked={headerChecks.read} />
                                                    </div>
                                                </th>
                                                <th className="roles_table_th">
                                                    <div className="flex align-items-center justify-content-center gap-2">
                                                        Update
                                                        <Checkbox onChange={() => onHeaderCheck('update')} checked={headerChecks.update} />
                                                    </div>
                                                </th>
                                                <th className="roles_table_th">
                                                    <div className="flex align-items-center justify-content-center gap-2">
                                                        Delete
                                                        <Checkbox onChange={() => onHeaderCheck('delete')} checked={headerChecks.delete} />
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rolesArray.map((e, i) => (
                                                <tr key={i}>
                                                    <td className="roles_table_td">{e.roleName}</td>
                                                    <td className="roles_table_td">
                                                        <Checkbox onChange={() => onCheck(i, 'create')} checked={e.roles.findIndex((x) => x === 'create') !== -1} disabled={e.module_name === 'dashboard'} />
                                                    </td>
                                                    <td className="roles_table_td">
                                                        <Checkbox onChange={() => onCheck(i, 'read')} checked={e.roles.findIndex((x) => x === 'read') !== -1} disabled={e.module_name === 'dashboard'} />
                                                    </td>
                                                    <td className="roles_table_td">
                                                        <Checkbox onChange={() => onCheck(i, 'update')} checked={e.roles.findIndex((x) => x === 'update') !== -1} disabled={e.module_name === 'dashboard'} />
                                                    </td>
                                                    <td className="roles_table_td">
                                                        <Checkbox onChange={() => onCheck(i, 'delete')} checked={e.roles.findIndex((x) => x === 'delete') !== -1} disabled={e.module_name === 'dashboard'} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="grid p-fluid mt-1">
                                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                    <Button
                                        label="Cancel"
                                        icon="pi pi-times"
                                        className="p-button-outlined p-button-danger mr-2 w-7rem"
                                        onClick={() => navigate('/superadmin/roles')}
                                    />
                                    <Button disabled={submitted} label={'Submit'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 w-7rem" />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default RolesCreateSuperAdmin;
