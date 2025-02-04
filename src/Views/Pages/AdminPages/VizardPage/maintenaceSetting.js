import components from '../..';
import toast from 'react-hot-toast';
import { BsCurrencyRupee } from "react-icons/bs";
// import { IconField } from "primereact/iconfield";
// import { InputIcon } from "primereact/inputicon";
import { createMaintenanceSetting, getMaintenanceFloorRequest, getMaintenanceBlockRequest, updateMaintenanceSetting, getMaintenanceSettingRequest } from '../../../../redux/slice/AdminSlices/maintenanceSlice';
const MaintenanceSetting = ({ decode= {}, fromWizard, nextprev }) => {
    const { DataTable, Column, Button, Dropdown, InputNumber, Divider, classNames, useState, useDispatch, useSelector, useEffect, useNavigate } = components;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { MaintenanceFloorData, MaintenanceSettingData } = useSelector((store) => store.maintenance);
    const { loginDetails } = useSelector((store) => store.auth);
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [amountError, setAmountError] = useState(false);
    const [maintenanceType, setMaintenanceType] = useState('');
    const [maintenanceAmount, setMaintenanceAmount] = useState(null);
    // const [maintenanceAmountRental, setMaintenanceAmountRental] = useState(null);
    const [editId, setEditId] = useState(null);
    const maintenanceTypeData = [
        { label: 'Square Feet Wise', value: 'sq_feet_wise' },
        { label: 'Fixed', value: 'fixed' }
        // { label: 'Floor Wise', value: 'floor_wise' }
    ];
    loginDetails.is_floor_exist_in_property && maintenanceTypeData.push({ label: 'Floor Wise', value: 'floor_wise' });
    // maintenanceTypeData.push({ label: 'Floor Wise', value: 'floor_wise' });
    useEffect(() => {
        if (MaintenanceFloorData?.data) {
            if (maintenanceType === "sq_feet_wise") {
                if (loginDetails.is_house_exist_in_property && loginDetails?.is_block_exist_in_property) {
                    let floorData = {
                        maintenance_amount_sq_feet_wise_blockhouse: []
                    };
                    MaintenanceFloorData?.data.forEach((x) => {
                        let setBlock = {
                            block_id: x?.block_id,
                            block_name: x?.label,
                            sq_feet_wise_maintenance_amount: null,
                        }
                        floorData.maintenance_amount_sq_feet_wise_blockhouse.push(setBlock);
                    })
                    setFormData(floorData);
                } else {
                    let floorData = {
                        maintenance_amount_sq_feet_wise: []
                    };
                    if (MaintenanceFloorData?.data?.floor_data_of_outer_shopping_center.length > 0) {
                        floorData.maintenance_amount_sq_feet_wise_for_shopping_center = [];
                    }
                    let inner_property = [...MaintenanceFloorData?.data?.floor_data_of_inner_structure]
                    let groundFloorIndex = MaintenanceFloorData?.data?.floor_data_of_inner_structure.findIndex(floor => floor.label === "Ground Floor");
                    if (groundFloorIndex > -1) {
                        const [groundFloor] = inner_property.splice(groundFloorIndex, 1);
                        inner_property.unshift(groundFloor);
                    }
                    let outer_property = [...MaintenanceFloorData?.data?.floor_data_of_outer_shopping_center]
                    let outerGroundFloorIndex = MaintenanceFloorData?.data?.floor_data_of_outer_shopping_center.findIndex(floor => floor.label === "Ground Floor");
                    if (outerGroundFloorIndex > -1) {
                        const [groundFloor] = outer_property.splice(outerGroundFloorIndex, 1);
                        outer_property.unshift(groundFloor);
                    }
                    inner_property.forEach((e) => {
                        let setFloor = {
                            floor_name: e.label,
                            floor_id: e.floor_id,
                            sq_feet_wise_maintenance_amount: null
                        };
                        floorData.maintenance_amount_sq_feet_wise.push(setFloor);
                    });
                    outer_property.forEach((e) => {
                        let setFloor = {
                            floor_name: e.label,
                            floor_id: e.floor_id,
                            sq_feet_wise_maintenance_amount: null
                        };
                        floorData.maintenance_amount_sq_feet_wise_for_shopping_center.push(setFloor);
                    });
                    setFormData(floorData);
                }
            } else if (maintenanceType !== "") {
                let floorData = {
                    maintenance_amount_floor_wise: []
                };
                if (MaintenanceFloorData?.data?.floor_data_of_outer_shopping_center.length > 0) {
                    floorData.maintenance_amount_floor_wise_for_shopping_center = [];
                }
                let inner_property = [...MaintenanceFloorData?.data?.floor_data_of_inner_structure]
                let groundFloorIndex = MaintenanceFloorData?.data?.floor_data_of_inner_structure.findIndex(floor => floor.label === "Ground Floor");
                if (groundFloorIndex > -1) {
                    const [groundFloor] = inner_property.splice(groundFloorIndex, 1);
                    inner_property.unshift(groundFloor);
                }
                let outer_property = [...MaintenanceFloorData?.data?.floor_data_of_outer_shopping_center]
                let outerGroundFloorIndex = MaintenanceFloorData?.data?.floor_data_of_outer_shopping_center.findIndex(floor => floor.label === "Ground Floor");
                if (outerGroundFloorIndex > -1) {
                    const [groundFloor] = outer_property.splice(outerGroundFloorIndex, 1);
                    outer_property.unshift(groundFloor);
                }
                inner_property.forEach((e) => {
                    let setFloor = {
                        floor_name: e.label,
                        floor_id: e.floor_id,
                        floor_wise_maintenance_amount: null
                    };
                    floorData.maintenance_amount_floor_wise.push(setFloor);
                });
                outer_property.forEach((e) => {
                    let setFloor = {
                        floor_name: e.label,
                        floor_id: e.floor_id,
                        floor_wise_maintenance_amount: null
                    };
                    floorData.maintenance_amount_floor_wise_for_shopping_center.push(setFloor);
                });
                setFormData(floorData);
            }
        }
    }, [MaintenanceFloorData]);
    useEffect(() => {
        if (MaintenanceSettingData && MaintenanceSettingData?.data) {
            let editData = MaintenanceSettingData?.data ? MaintenanceSettingData?.data : null
            if (editData && editData.length > 0) {
                setEditId(editData[0]?._id);
                setMaintenanceType(editData[0].maintenance_type);
                if (editData[0].maintenance_type === 'fixed') {
                    setMaintenanceAmount(editData[0]?.maintenance_amount);
                } else if (editData[0].maintenance_type !== 'fixed') {
                    if (editData[0].maintenance_type === "sq_feet_wise") {
                        if (loginDetails.is_house_exist_in_property && loginDetails?.is_block_exist_in_property === undefined) {
                            setMaintenanceAmount(editData[0]?.maintenance_amount);
                        }
                        if (editData[0].maintenance_amount_sq_feet_wise_blockhouse && editData[0].maintenance_amount_sq_feet_wise_blockhouse.length > 0) {
                            let floorData = {
                                maintenance_amount_sq_feet_wise_blockhouse: []
                            };
                            let inner_property = [...editData[0].maintenance_amount_sq_feet_wise_blockhouse]
                            let groundFloorIndex = editData[0].maintenance_amount_sq_feet_wise_blockhouse.findIndex(floor => floor.floor_name === "Ground Floor");
                            if (groundFloorIndex > -1) {
                                const [groundFloor] = inner_property.splice(groundFloorIndex, 1);
                                inner_property.unshift(groundFloor);
                            }
                            inner_property.forEach((e) => {
                                let setFloor = {
                                    block_id: e?.block_id,
                                    block_name: e?.block_name,
                                    sq_feet_wise_maintenance_amount: e.sq_feet_wise_maintenance_amount ? e.sq_feet_wise_maintenance_amount : null,
                                };
                                floorData.maintenance_amount_sq_feet_wise_blockhouse.push(setFloor);
                            });
                            setFormData(floorData);
                        } else {
                            let floorData = {
                                maintenance_amount_sq_feet_wise: []
                            };
                            if (editData[0].maintenance_amount_sq_feet_wise_for_shopping_center) {
                                floorData.maintenance_amount_sq_feet_wise_for_shopping_center = [];
                            }
                            let inner_property = [...editData[0].maintenance_amount_sq_feet_wise]
                            let groundFloorIndex = editData[0].maintenance_amount_sq_feet_wise.findIndex(floor => floor.floor_name === "Ground Floor");
                            if (groundFloorIndex > -1) {
                                const [groundFloor] = inner_property.splice(groundFloorIndex, 1);
                                inner_property.unshift(groundFloor);
                            }
                            let outer_property = [...editData[0].maintenance_amount_sq_feet_wise_for_shopping_center]
                            let outerGroundFloorIndex = editData[0].maintenance_amount_sq_feet_wise_for_shopping_center.findIndex(floor => floor.floor_name === "Ground Floor");
                            if (outerGroundFloorIndex > -1) {
                                const [groundFloor] = outer_property.splice(outerGroundFloorIndex, 1);
                                outer_property.unshift(groundFloor);
                            }
                            inner_property.forEach((e) => {
                                let setFloor = {
                                    floor_name: e.floor_name,
                                    floor_id: e.floor_id,
                                    sq_feet_wise_maintenance_amount: e.sq_feet_wise_maintenance_amount ? e.sq_feet_wise_maintenance_amount : null
                                };
                                floorData.maintenance_amount_sq_feet_wise.push(setFloor);
                            });
                            editData[0].maintenance_amount_sq_feet_wise_for_shopping_center &&
                                outer_property.forEach((e) => {
                                    let setFloor = {
                                        floor_name: e.floor_name,
                                        floor_id: e.floor_id,
                                        sq_feet_wise_maintenance_amount: e.sq_feet_wise_maintenance_amount ? e.sq_feet_wise_maintenance_amount : null
                                    };
                                    floorData.maintenance_amount_sq_feet_wise_for_shopping_center.push(setFloor);
                                });
                            setFormData(floorData);
                        }
                    } else {
                        let floorData = {
                            maintenance_amount_floor_wise: []
                        };
                        if (editData[0].maintenance_amount_floor_wise_for_shopping_center) {
                            floorData.maintenance_amount_floor_wise_for_shopping_center = [];
                        }
                        let inner_property = [...editData[0].maintenance_amount_floor_wise]
                        let groundFloorIndex = editData[0].maintenance_amount_floor_wise.findIndex(floor => floor.floor_name === "Ground Floor");
                        if (groundFloorIndex > -1) {
                            const [groundFloor] = inner_property.splice(groundFloorIndex, 1);
                            inner_property.unshift(groundFloor);
                        }
                        let outer_property = [...editData[0].maintenance_amount_floor_wise_for_shopping_center]
                        let outerGroundFloorIndex = editData[0].maintenance_amount_floor_wise_for_shopping_center.findIndex(floor => floor.floor_name === "Ground Floor");
                        if (outerGroundFloorIndex > -1) {
                            const [groundFloor] = outer_property.splice(outerGroundFloorIndex, 1);
                            outer_property.unshift(groundFloor);
                        }
                        inner_property.forEach((e) => {
                            let setFloor = {
                                floor_name: e.floor_name,
                                floor_id: e.floor_id,
                                floor_wise_maintenance_amount: e.floor_wise_maintenance_amount
                            };
                            floorData.maintenance_amount_floor_wise.push(setFloor);
                        });
                        editData[0].maintenance_amount_floor_wise_for_shopping_center &&
                            outer_property.forEach((e) => {
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
            } else {
                setFormData({});
                setEditId(null);
                setMaintenanceType("");
                setMaintenanceAmount(null);
            }
        }
    }, [MaintenanceSettingData]);
    useEffect(() => {
        dispatch(getMaintenanceSettingRequest())
    }, [dispatch])

    const onPropertyFloorValueChange = (value, i) => {
        try {
            let data = { ...formData };
            if (maintenanceType === "sq_feet_wise") {
                if (loginDetails?.is_block_exist_in_property && loginDetails?.is_house_exist_in_property) {
                    data.maintenance_amount_sq_feet_wise_blockhouse[i].sq_feet_wise_maintenance_amount = value;
                } else {

                    data.maintenance_amount_sq_feet_wise[i].sq_feet_wise_maintenance_amount = value;
                }
            } else {
                data.maintenance_amount_floor_wise[i].floor_wise_maintenance_amount = value;
            }
            setFormData(data);
        } catch (error) {
            console.log(error);
        }
    };
    const onShoppingFloorValueChange = (value, i) => {
        try {
            let data = { ...formData };
            if (maintenanceType === "sq_feet_wise") {
                data.maintenance_amount_sq_feet_wise_for_shopping_center[i].sq_feet_wise_maintenance_amount = value;
            } else {
                data.maintenance_amount_floor_wise_for_shopping_center[i].floor_wise_maintenance_amount = value;
            }
            setFormData(data);
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
            if (maintenanceType === 'fixed' || (maintenanceType !== 'fixed' && loginDetails.is_house_exist_in_property && loginDetails?.is_block_exist_in_property === undefined)) {
                maintenanceAmount === null && setAmountError(true);
                if (maintenanceAmount !== null) {
                    let sendData = {
                        maintenance_type: maintenanceType,
                        maintenance_amount: maintenanceAmount
                    };
                    editId === null && dispatch(createMaintenanceSetting(sendData));
                    editId !== null && dispatch(updateMaintenanceSetting(editId, sendData));
                }
            } else if (maintenanceType !== 'fixed') {
                if ((formData.maintenance_amount_floor_wise && formData.maintenance_amount_floor_wise.length > 0) || (formData.maintenance_amount_sq_feet_wise && formData.maintenance_amount_sq_feet_wise.length > 0) || (formData.maintenance_amount_sq_feet_wise_blockhouse && formData.maintenance_amount_sq_feet_wise_blockhouse.length > 0)) {
                    let check
                    if (maintenanceType === "sq_feet_wise" && loginDetails?.is_block_exist_in_property && loginDetails?.is_house_exist_in_property) {
                        check = formData.maintenance_amount_sq_feet_wise_blockhouse.find((x) => x.sq_feet_wise_maintenance_amount === null || x.sq_feet_wise_maintenance_amount === 0);
                    } else {
                        check = (maintenanceType === "floor_wise" ? formData.maintenance_amount_floor_wise : formData.maintenance_amount_sq_feet_wise).find((x) => maintenanceType === "floor_wise" ? x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0 : x.sq_feet_wise_maintenance_amount === null || x.sq_feet_wise_maintenance_amount === 0);
                    }
                    // let check = (maintenanceType === "floor_wise" ? formData.maintenance_amount_floor_wise : formData.maintenance_amount_sq_feet_wise).find((x) => maintenanceType === "floor_wise" ? x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0 : x.sq_feet_wise_maintenance_amount === null || x.sq_feet_wise_maintenance_amount === 0);
                    let check2 = formData.maintenance_amount_floor_wise_for_shopping_center && maintenanceType === "floor_wise"
                        ? formData.maintenance_amount_floor_wise_for_shopping_center.find((x) => x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0)
                        : formData.maintenance_amount_sq_feet_wise_for_shopping_center && maintenanceType === "sq_feet_wise" ? formData.maintenance_amount_sq_feet_wise_for_shopping_center.find((x) => x.sq_feet_wise_maintenance_amount === null || x.sq_feet_wise_maintenance_amount === 0) : undefined;
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
    // console.log(formData, "sfsdfdsfdsf");
    return (<div className=''>
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
                        // e.target.value !== 'fixed' && dispatch(getMaintenanceFloorRequest());
                        // e.target.value !== 'fixed' && dispatch(getMaintenanceBlockRequest());
                        if (e.target.value !== 'fixed' && loginDetails.is_house_exist_in_property && loginDetails?.is_block_exist_in_property) {
                            dispatch(getMaintenanceBlockRequest());
                        } else if (e.target.value !== 'fixed') {
                            dispatch(getMaintenanceFloorRequest());
                        }

                    }}
                />
            </div>
            {(maintenanceType === 'fixed' || (maintenanceType !== 'fixed' && loginDetails.is_house_exist_in_property && loginDetails?.is_block_exist_in_property === undefined)) && maintenanceType !== '' && (
                <div className="field col-12 md:col-4 mb-1">
                    <label htmlFor="maintenance_amount" className="required">
                        Maintenance amount
                    </label>
                    <span className="p-input-icon-left">
                        <BsCurrencyRupee />
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
                            className={classNames({ 'p-invalid': amountError && maintenanceAmount === null }, "inputRupee")}
                        />
                    </span>
                    <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{amountError && maintenanceAmount === null ? 'It should be greater then 0' : ""}</div>
                    {/* {errors.property_sq_feet_area && touched.property_sq_feet_area ? <small className="p-invalid error">{errors.property_sq_feet_area}</small> : null} */}
                </div>
            )}
        </div>
        {maintenanceType !== 'fixed' && maintenanceType !== "" && loginDetails?.is_house_exist_in_property === undefined && ((formData.maintenance_amount_floor_wise && formData.maintenance_amount_floor_wise.length > 0) || (formData?.maintenance_amount_sq_feet_wise && formData?.maintenance_amount_sq_feet_wise.length > 0)) && <>
            {(formData?.maintenance_amount_floor_wise || formData?.maintenance_amount_sq_feet_wise) && maintenanceType !== 'fixed' && maintenanceType !== "" && (
                <Divider align="center" className=" pt-0 text-base">
                    <span className="p-tag">Property Maintenance</span>
                </Divider>
            )}
            {maintenanceType !== 'fixed' && maintenanceType !== "" && (formData.maintenance_amount_floor_wise || formData?.maintenance_amount_sq_feet_wise) && <DataTable
                value={maintenanceType === "floor_wise" ? formData.maintenance_amount_floor_wise : formData?.maintenance_amount_sq_feet_wise}
                showGridlines
                stripedRows
                dataKey="id"
                // className="datatable-responsive"
                emptyMessage="No Record Found."
                // header={header}
                scroll="scroll"
                tableStyle={{ minWidth: '60rem' }}
                // sortMode="multiple"
                size="large"
                paginator={(maintenanceType === "floor_wise" ? formData.maintenance_amount_floor_wise : formData?.maintenance_amount_sq_feet_wise).length > 10}
                rows={10}
                rowsPerPageOptions={[10, 25, 50, 100, 300, 500]}
                paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
            >
                <Column field="floor_name" header={"Floor"} body={(rowData) => `${rowData.floor_name} ${rowData.floor_name === 'Ground Floor' ? '' : 'Floor'}`} headerStyle={{ width: "50%" }} />



                <Column field="" header={`Amount ${maintenanceType === "sq_feet_wise" ? "(Squar Feet Wise)" : ""}`} body={(rowData, i) => <span className="p-input-icon-left">
                    <BsCurrencyRupee /> <InputNumber
                        inputId={`${rowData.floor_name}-floor`}
                        id={`${rowData.floor_name}-floor`}
                        placeholder={`Enter ${rowData.floor_name} ${rowData.floor_name === 'Ground Floor' ? '' : 'Floor'} Amount`}
                        name={rowData.floor_name}
                        value={maintenanceType === "floor_wise" ? rowData.floor_wise_maintenance_amount : rowData.sq_feet_wise_maintenance_amount}
                        onChange={(e) => {
                            onPropertyFloorValueChange(e.value, i?.rowIndex);
                        }}
                        locale="en-IN"
                        minFractionDigits={2}
                        className={classNames({ 'p-invalid': amountError && (maintenanceType === "floor_wise" ? rowData.floor_wise_maintenance_amount === null || rowData.floor_wise_maintenance_amount === 0 : rowData.sq_feet_wise_maintenance_amount === null || rowData.sq_feet_wise_maintenance_amount === 0) }, "w-15rem inputRupee")}
                    /> </span>} />
                {/* <Column field="" header="Rental Amount" body={(rowData, i) => <InputNumber
                    // inputId={`${rowData.floor_name}-floor`}
                    // id={`${rowData.floor_name}-floor`}
                    placeholder={`Enter ${rowData.floor_name} ${rowData.floor_name === 'Ground Floor' ? '' : 'Floor'} Rental Amount`}
                // name={rowData.floor_name}
                // value={maintenanceType === "floor_wise" ? rowData.floor_wise_maintenance_amount : rowData.sq_feet_wise_maintenance_amount}
                // onChange={(e) => {
                //     onPropertyFloorValueChange(e.value, i?.rowIndex);
                // }}
                // locale="en-IN"
                // minFractionDigits={2}
                // className={classNames({ 'p-invalid': amountError && (maintenanceType === "floor_wise" ? rowData.floor_wise_maintenance_amount === null || rowData.floor_wise_maintenance_amount === 0 : rowData.sq_feet_wise_maintenance_amount === null || rowData.sq_feet_wise_maintenance_amount === 0) }, "w-15rem")}
                />} /> */}


            </DataTable>}
        </>}
        {/* <div className="grid p-fluid mt-1">
            {maintenanceType !== 'fixed' &&
                (maintenanceType === "floor_wise" ? formData.maintenance_amount_floor_wise : formData?.maintenance_amount_sq_feet_wise)?.map((x, i) => (
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor={`${x.floor_name}-floor`} className="required">
                            {`${x.floor_name} ${x.floor_name === 'Ground Floor' ? '' : 'Floor'}`}
                        </label>
                        <InputNumber
                            inputId={`${x.floor_name}-floor`}
                            id={`${x.floor_name}-floor`}
                            placeholder={`Enter ${x.floor_name} ${x.floor_name === 'Ground Floor' ? '' : 'Floor'} Amount`}
                            name={x.floor_name}
                            value={maintenanceType === "floor_wise" ? x.floor_wise_maintenance_amount : x.sq_feet_wise_maintenance_amount}
                            onChange={(e) => {
                                onPropertyFloorValueChange(e.value, i);
                            }}
                            locale="en-IN"
                            minFractionDigits={2}
                            className={classNames({ 'p-invalid': amountError && (maintenanceType === "floor_wise" ? x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0 : x.sq_feet_wise_maintenance_amount === null || x.sq_feet_wise_maintenance_amount === 0) })}
                        />
                        <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{amountError && (maintenanceType === "floor_wise" ? x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0 : x.sq_feet_wise_maintenance_amount === null || x.sq_feet_wise_maintenance_amount === 0) ? 'It should be greater then 0' : ""}</div>
                    </div>
                ))}
        </div> */}
        {/* {amountError && (x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0) ? <small className="p-invalid error">{'It should be greater then 0'}</small> : null} */}
        {maintenanceType !== 'fixed' && maintenanceType !== "" && loginDetails.is_house_exist_in_property && loginDetails?.is_block_exist_in_property && <><Divider align="center" className=" pt-0 text-base">
            <span className="p-tag">Property Maintenancee</span>
        </Divider>
            <DataTable
                value={formData?.maintenance_amount_sq_feet_wise_blockhouse}
                showGridlines
                stripedRows
                dataKey="id"
                // className="datatable-responsive"
                emptyMessage="No Record Found."
                // header={header}
                scroll="scroll"
                tableStyle={{ minWidth: '60rem' }}
                // sortMode="multiple"
                size="large"
                paginator={maintenanceType === "sq_feet_wise" && formData?.maintenance_amount_sq_feet_wise_blockhouse && formData?.maintenance_amount_sq_feet_wise_blockhouse.length > 10}
                rows={10}
                rowsPerPageOptions={[10, 25, 50, 100, 300, 500]}
                paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
            >
                <Column field="block_name" header={"Block"} headerStyle={{ width: "50%" }} />
                <Column field="" header={`Amount ${maintenanceType === "sq_feet_wise" ? "(Squar Feet Wise)" : ""}`} body={(rowData, i) => <span className="p-input-icon-left">
                    <BsCurrencyRupee /> <InputNumber
                        inputId={`${rowData.block_name}`}
                        id={`${rowData.block_name}`}
                        placeholder={`Enter ${rowData.block_name} Amount`}
                        name={rowData.block_name}
                        value={rowData.sq_feet_wise_maintenance_amount}
                        onChange={(e) => {
                            onPropertyFloorValueChange(e.value, i?.rowIndex);
                        }}
                        locale="en-IN"
                        minFractionDigits={2}
                        className={classNames({ 'p-invalid': amountError && (rowData.sq_feet_wise_maintenance_amount === null || rowData.sq_feet_wise_maintenance_amount === 0) }, "w-15rem inputRupee")}
                    /></span>} />
                {/* <Column field="" header="Rental Amount" body={(rowData, i) => <InputNumber
                    // inputId={`${rowData.floor_name}-floor`}
                    // id={`${rowData.floor_name}-floor`}
                    placeholder={`Enter ${rowData.floor_name} ${rowData.floor_name === 'Ground Floor' ? '' : 'Floor'} Rental Amount`}
                // name={rowData.floor_name}
                // value={maintenanceType === "floor_wise" ? rowData.floor_wise_maintenance_amount : rowData.sq_feet_wise_maintenance_amount}
                // onChange={(e) => {
                //     onPropertyFloorValueChange(e.value, i?.rowIndex);
                // }}
                // locale="en-IN"
                // minFractionDigits={2}
                // className={classNames({ 'p-invalid': amountError && (maintenanceType === "floor_wise" ? rowData.floor_wise_maintenance_amount === null || rowData.floor_wise_maintenance_amount === 0 : rowData.sq_feet_wise_maintenance_amount === null || rowData.sq_feet_wise_maintenance_amount === 0) }, "w-15rem")}
                />} /> */}
                {/* <Column field="block_name" header={"Block"} headerStyle={{ width: "50%" }} /> */}
            </DataTable>
        </>}
        {((formData?.maintenance_amount_floor_wise_for_shopping_center && formData?.maintenance_amount_floor_wise_for_shopping_center.length > 0) || (formData?.maintenance_amount_sq_feet_wise_for_shopping_center && formData?.maintenance_amount_sq_feet_wise_for_shopping_center.length > 0)) && maintenanceType !== 'fixed' && maintenanceType !== "" && (
            <Divider align="center" className=" pt-0 text-base">
                <span className="p-tag">Shopping Center Maintenance</span>
            </Divider>
        )}
        {maintenanceType !== 'fixed' && maintenanceType !== "" && loginDetails?.is_shopping_center_exist_in_property && (formData.maintenance_amount_floor_wise_for_shopping_center || formData?.maintenance_amount_sq_feet_wise_for_shopping_center) && <DataTable
            value={maintenanceType === "floor_wise" ? formData.maintenance_amount_floor_wise_for_shopping_center : formData?.maintenance_amount_sq_feet_wise_for_shopping_center}
            showGridlines
            stripedRows
            dataKey="id"
            // className="datatable-responsive"
            emptyMessage="No Record Found."
            // header={header}
            scroll="scroll"
            tableStyle={{ minWidth: '60rem' }}
            // sortMode="multiple"
            size="large"
            paginator={(maintenanceType === "floor_wise" ? formData.maintenance_amount_floor_wise_for_shopping_center : formData?.maintenance_amount_sq_feet_wise_for_shopping_center).length > 10}
            rows={10}
            rowsPerPageOptions={[10, 25, 50, 100, 300, 500]}
            paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
        >
            <Column field="floor_name" header={"Floor"} body={(rowData) => `${rowData.floor_name} ${rowData.floor_name === 'Ground Floor' ? '' : 'Floor'}`} headerStyle={{ width: "50%" }} />
            <Column field="" header={`Amount ${maintenanceType === "sq_feet_wise" ? "(Squar Feet Wise)" : ""}`}
                body={(rowData, i) => <span className="p-input-icon-left">
                    <BsCurrencyRupee /> <InputNumber
                        inputId={`${rowData.floor_name}-shopping`}
                        id={`${rowData.floor_name}-shopping`}
                        placeholder={`Enter ${rowData.floor_name} ${rowData.floor_name === 'Ground Floor' ? '' : 'Floor'} Amount`}
                        name={rowData.floor_name}
                        value={maintenanceType === "floor_wise" ? rowData.floor_wise_maintenance_amount : rowData.sq_feet_wise_maintenance_amount}
                        onChange={(e) => {
                            onShoppingFloorValueChange(e.value, i?.rowIndex);
                        }}
                        locale="en-IN"
                        minFractionDigits={2}
                        className={classNames({ 'p-invalid': amountError && (maintenanceType === "floor_wise" ? rowData.floor_wise_maintenance_amount === null || rowData.floor_wise_maintenance_amount === 0 : rowData.sq_feet_wise_maintenance_amount === null || rowData.sq_feet_wise_maintenance_amount === 0) }, "w-15rem inputRupee")}
                    /></span>}
            />

        </DataTable>}
        {/* <div className="grid p-fluid mt-1">
            {maintenanceType !== 'fixed' &&
                (maintenanceType === "floor_wise" ? formData.maintenance_amount_floor_wise_for_shopping_center : formData?.maintenance_amount_sq_feet_wise_for_shopping_center)?.map((x, i) => (
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor={`${x.floor_name}-shopping`} className="required">
                            {`${x.floor_name} ${x.floor_name === 'Ground Floor' ? '' : 'Floor'}`}
                        </label>
                        <InputNumber
                            inputId={`${x.floor_name}-shopping`}
                            id={`${x.floor_name}-shopping`}
                            placeholder={`Enter ${x.floor_name} ${x.floor_name === 'Ground Floor' ? '' : 'Floor'} Amount`}
                            name={x.floor_name}
                            value={maintenanceType === "floor_wise" ? x.floor_wise_maintenance_amount : x.sq_feet_wise_maintenance_amount}
                            onChange={(e) => {
                                onShoppingFloorValueChange(e.value, i);
                            }}
                            locale="en-IN"
                            minFractionDigits={2}
                            className={classNames({ 'p-invalid': amountError && (maintenanceType === "floor_wise" ? x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0 : x.sq_feet_wise_maintenance_amount === null || x.sq_feet_wise_maintenance_amount === 0) })}
                        />
                        <div className="p-invalid error text-xs" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{amountError && (maintenanceType === "floor_wise" ? x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0 : x.sq_feet_wise_maintenance_amount === null || x.sq_feet_wise_maintenance_amount === 0) ? 'It should be greater then 0' : ""}</div>
                    </div>
                ))}
        </div> */}
        {/* {amountError && (x.floor_wise_maintenance_amount === null || x.floor_wise_maintenance_amount === 0) ? <small className="p-invalid error">{'It should be greater then 0'}</small> : null} */}
        {maintenanceType !== '' && <div className="grid p-fluid mt-3">
            <div className="col-12 md:col-12 flex justify-content-end align-items-center">
                {!fromWizard && editId && <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                    onClick={() => navigate(`/property-management/maintenance-setting`)}
                />}
                {fromWizard && <Button label="Back"  className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                    onClick={() => nextprev(0)}
                />}
                <Button
                    disabled={submitted}
                    style={{ width: '6.5rem' }}
                    label={editId ? "Update" : "Save"} type="submit"  className="p-button-outlined p-button-success mr-2 mb-2"
                    onClick={() => submitData()}
                />
            </div>
        </div>}
    </div>)
}
export default MaintenanceSetting;
