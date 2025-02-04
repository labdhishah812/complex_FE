import components from '../..';
import toast from 'react-hot-toast';
import { createMaintenanceSetting, getMaintenanceFloorRequest, handleResetMaintenance, updateMaintenanceSetting } from '../../../../redux/slice/AdminSlices/maintenanceSlice';
const MaintenanceSettingModal = ({ onHide, editData, decode }) => {
    const { Button, Dropdown, InputNumber, Dialog, Divider, classNames, useState, useDispatch, useSelector, useEffect } = components;
    const dispatch = useDispatch();
    const { MaintenanceFloorData } = useSelector((store) => store.maintenance);
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [amountError, setAmountError] = useState(false);
    const [maintenanceType, setMaintenanceType] = useState('');
    const [maintenanceAmount, setMaintenanceAmount] = useState(null);
    const [editId, setEditId] = useState(null);

    const maintenanceTypeData = [
        { label: 'Square Feet Wise', value: 'sq_feet_wise' },
        { label: 'Fixed', value: 'fixed' }
        // { label: 'Floor Wise', value: 'floor_wise' }
    ];
    decode.is_floor_exist_in_property && maintenanceTypeData.push({ label: 'Floor Wise', value: 'floor_wise' });
    useEffect(() => {
        if (MaintenanceFloorData?.data) {
            let floorData = {
                maintenance_amount_floor_wise: []
            };
            if (MaintenanceFloorData?.data?.floor_data_of_outer_shopping_center.length > 0) {
                floorData.maintenance_amount_floor_wise_for_shopping_center = [];
            }
            MaintenanceFloorData?.data?.floor_data_of_inner_structure.forEach((e) => {
                let setFloor = {
                    floor_name: e.label,
                    floor_id: e.floor_id,
                    floor_wise_maintenance_amount: null
                };
                floorData.maintenance_amount_floor_wise.push(setFloor);
            });
            MaintenanceFloorData?.data?.floor_data_of_outer_shopping_center.forEach((e) => {
                let setFloor = {
                    floor_name: e.label,
                    floor_id: e.floor_id,
                    floor_wise_maintenance_amount: null
                };
                floorData.maintenance_amount_floor_wise_for_shopping_center.push(setFloor);
            });
            setFormData(floorData);
        }
    }, [MaintenanceFloorData]);
    useEffect(() => {
        if (editData && editData.length > 0) {
            setEditId(editData[0]?._id);
            setMaintenanceType(editData[0].maintenance_type);
            if (editData[0].maintenance_type !== 'floor_wise') {
                setMaintenanceAmount(editData[0]?.maintenance_amount);
            } else if (editData[0].maintenance_type === 'floor_wise') {
                let floorData = {
                    maintenance_amount_floor_wise: []
                };
                if (editData[0].maintenance_amount_floor_wise_for_shopping_center) {
                    floorData.maintenance_amount_floor_wise_for_shopping_center = [];
                }
                editData[0].maintenance_amount_floor_wise.forEach((e) => {
                    let setFloor = {
                        floor_name: e.floor_name,
                        floor_id: e.floor_id,
                        floor_wise_maintenance_amount: e.floor_wise_maintenance_amount
                    };
                    floorData.maintenance_amount_floor_wise.push(setFloor);
                });
                editData[0].maintenance_amount_floor_wise_for_shopping_center &&
                    editData[0].maintenance_amount_floor_wise_for_shopping_center.forEach((e) => {
                        let setFloor = {
                            floor_name: e.floor_name,
                            floor_id: e.floor_id,
                            floor_wise_maintenance_amount: e.floor_wise_maintenance_amount
                        };
                        floorData.maintenance_amount_floor_wise_for_shopping_center.push(setFloor);
                    });
                setFormData(floorData);
            }
        }
    }, [editData]);
    const footerUI = () => {
        try {
            return (
                <>
                    <Button label="Back" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={onHide} />
                    <Button disabled={submitted} label="Save" type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2" onClick={() => submitData()} />
                </>
            );
        } catch (error) {
            console.log(error);
        }
    };
    const submitData = () => {
        try {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
            if (maintenanceType !== 'floor_wise') {
                maintenanceAmount === null && setAmountError(true);
                if (maintenanceAmount !== null) {
                    let sendData = {
                        maintenance_type: maintenanceType,
                        maintenance_amount: maintenanceAmount
                    };
                    editId === null && dispatch(createMaintenanceSetting(sendData));
                    editId !== null && dispatch(updateMaintenanceSetting(editId, sendData));
                }
            } else if (maintenanceType === 'floor_wise') {
                if (formData.maintenance_amount_floor_wise.length > 0) {
                    let check = formData.maintenance_amount_floor_wise.find((x) => x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0);
                    let check2 = formData.maintenance_amount_floor_wise_for_shopping_center
                        ? formData.maintenance_amount_floor_wise_for_shopping_center.find((x) => x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0)
                        : undefined;

                    if (check === undefined && check2 === undefined) {
                        formData.maintenance_type = maintenanceType;
                        editId === null && dispatch(createMaintenanceSetting(formData));
                        editId !== null && dispatch(updateMaintenanceSetting(editId, formData));
                    } else {
                        setAmountError(true);
                    }
                } else {
                    toast.error('Create first Property Structure', {
                        style: {
                            marginTop: '4rem'
                        }
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onPropertyFloorValueChange = (value, i) => {
        try {
            let data = { ...formData };
            data.maintenance_amount_floor_wise[i].floor_wise_maintenance_amount = value;
            setFormData(data);
        } catch (error) {
            console.log(error);
        }
    };
    const onShoppingFloorValueChange = (value, i) => {
        try {
            let data = { ...formData };
            data.maintenance_amount_floor_wise_for_shopping_center[i].floor_wise_maintenance_amount = value;
            setFormData(data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Dialog
            visible={true}
            style={{ width: '60vw' }}
            header="Maintenance Setting"
            modal
            className="p-fluid"
            onHide={() => {
                onHide();
                dispatch(handleResetMaintenance());
            }}
            footer={maintenanceType !== '' && footerUI}
        >
            <div className="grid p-fluid mt-1">
                <div className="field col-12 md:col-4 mb-1">
                    <label htmlFor="maintenance_type" className="required">
                        Maintenance type
                    </label>
                    <Dropdown
                        id="maintenance_type"
                        optionLabel="label"
                        optionValue="value"
                        options={maintenanceTypeData}
                        name="maintenanceType"
                        placeholder="Select maintenance type"
                        type="text"
                        value={maintenanceType}
                        // onChange={(e) => setValue({ ...value, property_type: e.target.value, is_block_exist_in_property: true, is_floor_exist_in_property: true, is_house_exist_in_property: true })}\
                        onChange={(e) => {
                            setMaintenanceType(e.target.value);
                            setMaintenanceAmount(null);
                            setAmountError(false);
                            setFormData({});
                            e.target.value === 'floor_wise' && dispatch(getMaintenanceFloorRequest());
                        }}
                    />
                </div>
                {maintenanceType !== 'floor_wise' && maintenanceType !== '' && (
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="maintenance_amount" className="required">
                            Maintenance amount
                        </label>
                        <InputNumber
                            inputId="maintenance_amount"
                            id="maintenance_amount"
                            placeholder="Enter maintenance amount"
                            name="property_sq_feet_area"
                            value={maintenanceAmount}
                            onValueChange={(e) => {
                                setMaintenanceAmount(e.target.value);
                            }}
                            locale="en-IN"
                            minFractionDigits={2}
                            className={classNames({ 'p-invalid': amountError && maintenanceAmount === null })}
                        />
                        {/* {errors.property_sq_feet_area && touched.property_sq_feet_area ? <small className="p-invalid error">{errors.property_sq_feet_area}</small> : null} */}
                    </div>
                )}
            </div>
            {formData?.maintenance_amount_floor_wise && maintenanceType === 'floor_wise' && (
                <Divider align="center" className=" pt-0">
                    <span className="p-tag">Property Maintenance</span>
                </Divider>
            )}
            <div className="grid p-fluid mt-1">
                {maintenanceType === 'floor_wise' &&
                    formData.maintenance_amount_floor_wise?.map((x, i) => (
                        <div className="field col-12 md:col-4 mb-1">
                            <label htmlFor={`${x.floor_name}-floor`} className="required">
                                {`${x.floor_name} ${x.floor_name === 'Ground Floor' ? '' : 'Floor'}`}
                            </label>
                            <InputNumber
                                inputId={`${x.floor_name}-floor`}
                                id={`${x.floor_name}-floor`}
                                placeholder={`Enter ${x.floor_name} ${x.floor_name === 'Ground Floor' ? '' : 'Floor'} maintenance amount`}
                                name={x.floor_name}
                                value={x.floor_wise_maintenance_amount}
                                onChange={(e) => {
                                    onPropertyFloorValueChange(e.value, i);
                                }}
                                locale="en-IN"
                                minFractionDigits={2}
                                className={classNames({ 'p-invalid': amountError && (x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0) })}
                            />
                            {amountError && (x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0) ? <small className="p-invalid error">{'It should be greater then 0'}</small> : null}
                        </div>
                    ))}
            </div>
            {formData?.maintenance_amount_floor_wise_for_shopping_center && formData?.maintenance_amount_floor_wise_for_shopping_center.length > 0 && maintenanceType === 'floor_wise' && (
                <Divider align="center" className=" pt-0">
                    <span className="p-tag">Shopping Center Maintenance</span>
                </Divider>
            )}
            <div className="grid p-fluid mt-1">
                {maintenanceType === 'floor_wise' &&
                    formData.maintenance_amount_floor_wise_for_shopping_center?.map((x, i) => (
                        <div className="field col-12 md:col-4 mb-1">
                            <label htmlFor={`${x.floor_name}-shopping`} className="required">
                                {`${x.floor_name} ${x.floor_name === 'Ground Floor' ? '' : 'Floor'}`}
                            </label>
                            <InputNumber
                                inputId={`${x.floor_name}-shopping`}
                                id={`${x.floor_name}-shopping`}
                                placeholder={`Enter ${x.floor_name} ${x.floor_name === 'Ground Floor' ? '' : 'Floor'} Amount`}
                                name={x.floor_name}
                                value={x.floor_wise_maintenance_amount}
                                onChange={(e) => {
                                    onShoppingFloorValueChange(e.value, i);
                                }}
                                locale="en-IN"
                                minFractionDigits={2}
                                className={classNames({ 'p-invalid': amountError && (x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0) })}
                            />
                            {amountError && (x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0) ? <small className="p-invalid error">{'It should be greater then 0'}</small> : null}
                        </div>
                    ))}
            </div>
            {/* <div className="flex align-items-center mt-3">
                <h4 className="mt-2">Property Maintenance</h4>
            </div> */}
        </Dialog>
    );
};
export default MaintenanceSettingModal;
