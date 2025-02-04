import components from '../..';
import jwtDecode from 'jwt-decode';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
import { getVehicleSettingDetail, vehicleSettingCreate, vehicleSettingUpdateRequest } from '../../../../redux/slice/AdminSlices/vehicleSlice';

const VehicleSettingModel = ({ onHide }) => {
    const { Dialog, Dropdown, Button, InputNumber, classNames, useDispatch, useState, useEffect, useSelector } = components;
    const { token } = useSelector((store) => store.auth);
    const { vehicleSettingList } = useSelector((store) => store.vehicle);
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [formValue, setFormValue] = useState({
        id: '',
        two_wheeler: null,
        three_wheeler: null,
        four_wheeler: null
    });

    useEffect(() => {
        dispatch(getVehicleSettingDetail());
        // if (editData !== null) {
        //     let setData = {
        //         id: editData?._id,
        //         name: editData?.name,
        //         email: editData?.email,
        //         gender: editData?.gender,
        //         mobile_number: editData?.mobile_number,
        //         password: '123456C!',
        //         role: editData?.role,
        //         role_id: editData?.role_id
        //     };
        //     setFormValue(setData);
        // }
    }, [dispatch]);
    useEffect(() => {
        if (vehicleSettingList && vehicleSettingList[0]) {
            let setData = {
                id: vehicleSettingList[0]?._id,
                two_wheeler: vehicleSettingList[0]['2-wheeler'],
                three_wheeler: vehicleSettingList[0]['3-wheeler'],
                four_wheeler: vehicleSettingList[0]['4-wheeler']
            };
            setFormValue(setData);
        }
    }, [vehicleSettingList]);
    const onSubmit = () => {
        try {
            if (formValue?.two_wheeler === null || formValue?.three_wheeler === null || formValue?.four_wheeler === null) {
                setError(true);
            } else {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                }, 5000);
                let sendData = {
                    '2-wheeler': formValue?.two_wheeler,
                    '3-wheeler': formValue?.three_wheeler,
                    '4-wheeler': formValue?.four_wheeler
                };
                formValue.id === '' && dispatch(vehicleSettingCreate(sendData));
                formValue.id !== '' && dispatch(vehicleSettingUpdateRequest(formValue.id, sendData));
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Dialog visible={true} style={{ width: '50vw' }} header={formValue.id === '' ? 'Create Vehicle Setting' : 'Edit Vehicle Setting'} modal className="p-fluid" onHide={onHide}>
            <div className="grid p-fluid mt-2">
                <div className="field col-12 md:col-6 mb-1">
                    <label htmlFor="two_wheeler" className="required">
                        No of two wheeler
                    </label>
                    <InputNumber
                        inputId="two_wheeler"
                        placeholder="Enter no of two wheeler"
                        value={formValue?.two_wheeler}
                        onValueChange={(e) => {
                            setFormValue({ ...formValue, two_wheeler: e.value });
                        }}
                        className={classNames({ 'p-invalid': error && formValue.two_wheeler === null })}
                    />
                </div>
                {/* {error && 'dfgdf dfhdfhdf'} */}
                <div className="field col-12 md:col-6 mb-1">
                    <label htmlFor="three_wheeler" className="required">
                        No of three wheeler
                    </label>
                    <InputNumber
                        inputId="three_wheeler"
                        placeholder="Enter no of three wheeler"
                        value={formValue?.three_wheeler}
                        onValueChange={(e) => {
                            setFormValue({ ...formValue, three_wheeler: e.value });
                        }}
                        className={classNames({ 'p-invalid': error && formValue.three_wheeler === null })}
                    />
                </div>
                <div className="field col-12 md:col-6 mb-1">
                    <label htmlFor="four_wheeler" className="required">
                        No of four wheeler
                    </label>
                    <InputNumber
                        inputId="four_wheeler"
                        placeholder="Enter no of four wheeler"
                        value={formValue?.four_wheeler}
                        onValueChange={(e) => {
                            setFormValue({ ...formValue, four_wheeler: e.value });
                        }}
                        className={classNames({ 'p-invalid': error && formValue.four_wheeler === null })}
                    />
                </div>
            </div>
            <div className="grid p-fluid mt-1">
                <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                    <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={onHide} />
                    <Button disabled={submitted} label={'Save'} icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" onClick={onSubmit} />
                </div>
            </div>
        </Dialog>
    );
};
export default VehicleSettingModel;
