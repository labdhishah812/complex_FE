import components from '../..';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { roleCreateRequest, updateRoleRequest } from '../../../../redux/slice/AdminSlices/roleSlice';
const RolesModel = ({ editData, onHide }) => {
    const { Dialog, Button, InputText, Checkbox, classNames, useDispatch, useState, useEffect } = components;
    const dispatch = useDispatch();
    // const { token } = useSelector((store) => store.auth);
    const [submitted, setSubmitted] = useState(false);
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
        },
    ]);
    const [formValue, setFormValue] = useState({
        id: '',
        roleName: ''
    });
    const SignupSchema = Yup.object().shape({
        roleName: Yup.string().trim().nullable().required('Please enter role name')
    });
    useEffect(() => {
        if (editData !== null) {
            let array = [...rolesArray];
            let setData = {
                id: editData?._id,
                roleName: editData?.role
            };
            editData?.permissions.forEach((a) => {
                let check = array.findIndex((x) => x.module_name === a.module_name);
                if (check !== -1) {
                    array[check].roles = a.module_access;
                }
            });
            setFormValue(setData);
            setRolesArray(array);
        }
    }, [editData]);
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
    return (
        <Dialog visible={true} style={{ width: '70vw' }} header={editData?._id ? 'Edit Role' : 'Create Role'} modal className="p-fluid" onHide={onHide}>
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
            >
                {({ values, setFieldValue, handleChange, handleReset, errors, touched }) => (
                    <Form>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="roleName" className="required">
                                    Role name
                                </label>
                                <InputText
                                    id="roleName"
                                    name="roleName"
                                    placeholder="Enter role name"
                                    type="text"
                                    value={values?.roleName}
                                    onChange={(e) => setFieldValue('roleName', e.target.value)}
                                    className={classNames({ 'p-invalid': errors.roleName && touched.roleName })}
                                />
                                {errors.roleName && touched.roleName ? <small className="p-invalid error">{errors.roleName}</small> : null}
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
                                            {/* <th className="maintenanceSettings_table_th">Floor</th>
                                        <th className="maintenanceSettings_table_th">Maintenance Amount</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rolesArray.map((e, i) => (
                                            <tr key={i}>
                                                <td className="roles_table_td">{e.roleName}</td>
                                                <td className="roles_table_td">
                                                    <Checkbox onChange={() => onCheck(i, 'create')} checked={e.roles.findIndex((x) => x === 'create') !== -1} disabled={e.module_name === 'dashboard' || e.module_name === 'rental'}></Checkbox>
                                                </td>
                                                <td className="roles_table_td">
                                                    <Checkbox onChange={() => onCheck(i, 'read')} checked={e.roles.findIndex((x) => x === 'read') !== -1} disabled={e.module_name === 'dashboard'}></Checkbox>
                                                </td>
                                                <td className="roles_table_td">
                                                    <Checkbox onChange={() => onCheck(i, 'update')} checked={e.roles.findIndex((x) => x === 'update') !== -1} disabled={e.module_name === 'dashboard' || e.module_name === 'rental'}></Checkbox>
                                                </td>
                                                <td className="roles_table_td">
                                                    <Checkbox onChange={() => onCheck(i, 'delete')} checked={e.roles.findIndex((x) => x === 'delete') !== -1} disabled={e.module_name === 'dashboard' || e.module_name === 'rental'}></Checkbox>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 w-7rem" onClick={onHide} />
                                <Button disabled={submitted} label={'Save'} type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 w-7rem" />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
export default RolesModel;
