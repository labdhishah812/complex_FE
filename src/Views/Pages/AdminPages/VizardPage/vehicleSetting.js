import components from '../..';
import toast from 'react-hot-toast';
import { getPropertyStructureAllData } from '../../../../redux/slice/AdminSlices/blockSlice';
import { getVehicleSettingDetail, vehicleSettingCreate, vehicleSettingUpdateRequest } from '../../../../redux/slice/AdminSlices/vehicleSlice';

const VehicleSetting = ({ onHide, nextprev, fromWizard }) => {
    const { Checkbox, Button, DataTable, Column, Divider, InputNumber, classNames, useDispatch, useState, useEffect, useSelector } = components;
    const dispatch = useDispatch();
    // const { token } = useSelector((store) => store.auth);
    const { vehicleSettingList, isCreatedSetting } = useSelector((store) => store.vehicle);
    const { propertyStructureAllData } = useSelector((store) => store.block);
    const { loginDetails } = useSelector((store) => store.auth);
    const [desabledBut, SetDesabledBut] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [errorAll, setErrorAll] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [vehicleTable, setVehicleTable] = useState([]);
    const [shoppingVehicleTable, setShoppingVehicleTable] = useState([]);
    const [isTableshow, setIsTableShow] = useState(false);
    const [isForBack, setIsForBack] = useState(false);
    const [formValue, setFormValue] = useState({
        id: '',
        two_wheeler: null,
        three_wheeler: null,
        four_wheeler: null
    });
    useEffect(() => {
        dispatch(getVehicleSettingDetail());
    }, [dispatch]);
    useEffect(() => {
        if (fromWizard) {
            SetDesabledBut(false);
        }
        // dispatch(getVehicleSettingDetail());
    }, [fromWizard]);
    useEffect(() => {
        isCreatedSetting === true && dispatch(getVehicleSettingDetail());
    }, [isCreatedSetting]);
    useEffect(() => {
        if (propertyStructureAllData && propertyStructureAllData.length > 0) {
            let vehicleTable = [];
            let shoppingVehicleTable = [];
            propertyStructureAllData.forEach(element => {
                let data = {
                    is_vehicle_setting_created: true,
                    user_property_assign_id: element._id,
                    lable_name: element.property_number,
                    '2-wheeler': null,
                    '3-wheeler': null,
                    '4-wheeler': null,
                }
                if (element.is_shopping_center_exist_in_property === true) {
                    shoppingVehicleTable.push(data);

                } else if (!element.is_shopping_center_exist_in_property) {
                    vehicleTable.push(data);
                }
            });
            setVehicleTable(vehicleTable)
            setShoppingVehicleTable(shoppingVehicleTable)
        }
    }, [propertyStructureAllData]);
    useEffect(() => {
        if (vehicleSettingList && vehicleSettingList[0] && vehicleSettingList[0].is_vehicle_setting_created) {
            let vehicleTable = [];
            let shoppingVehicleTable = [];
            vehicleSettingList.forEach((element) => {
                let data = {
                    is_vehicle_setting_created: true,
                    user_property_assign_id: element.user_property_assign_id,
                    lable_name: element.property_number,
                    '2-wheeler': element['2-wheeler'] ? element['2-wheeler'] : null,
                    '3-wheeler': element['3-wheeler'] ? element['3-wheeler'] : null,
                    '4-wheeler': element['4-wheeler'] ? element['4-wheeler'] : null,
                }
                if (element.is_shopping_center_exist_in_property === true) {
                    shoppingVehicleTable.push(data);

                } else if (!element.is_shopping_center_exist_in_property) {
                    vehicleTable.push(data);
                }
            })
            setIsCreate(true);
            setIsForBack(true);
            setIsTableShow(true);
            setVehicleTable(vehicleTable)
            setShoppingVehicleTable(shoppingVehicleTable)

            // let setData = {
            //     id: vehicleSettingList[0]?._id,
            //     two_wheeler: vehicleSettingList[0]['2-wheeler'] ? vehicleSettingList[0]['2-wheeler'] : null,
            //     three_wheeler: vehicleSettingList[0]['3-wheeler'] ? vehicleSettingList[0]['3-wheeler'] : null,
            //     four_wheeler: vehicleSettingList[0]['4-wheeler'] ? vehicleSettingList[0]['4-wheeler'] : null
            // };
            // if (vehicleSettingList[0]['2-wheeler'] && vehicleSettingList[0]['3-wheeler'] && vehicleSettingList[0]['4-wheeler']) {
            //     setIsCreate(true);
            // }
            // setFormValue(setData);
        }
        if (vehicleSettingList && !fromWizard) {
            SetDesabledBut(true);
        }
    }, [vehicleSettingList]);
    const onSubmit2 = () => {
        try {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
            let sendData = [];

            if (isCreate === false) {
                sendData = [];
                dispatch(vehicleSettingCreate(sendData));
            } else {
                let vehicleTable1 = [...vehicleTable]
                let shoppingVehicleTable1 = [...shoppingVehicleTable]
                let concate = vehicleTable1.concat(shoppingVehicleTable1);
                let checkEmapty = concate.filter((x) => x['2-wheeler'] === null || x['3-wheeler'] === null || x['4-wheeler'] === null)
                if (checkEmapty.length === 0) {
                    sendData = concate;
                    dispatch(vehicleSettingCreate(sendData));
                } else {
                    setErrorAll(true);
                    toast.error('Please fill out all vehicle fields.', {
                        style: {
                            marginTop: '4rem'
                        }
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const onSubmit = () => {
        try {
            if ((formValue?.two_wheeler === null || formValue?.three_wheeler === null || formValue?.four_wheeler === null) && isCreate === true) {
                setError(true);
            } else {
                let vehicleTable1 = [...vehicleTable];
                let shoppingVehicleTable1 = [...shoppingVehicleTable];

                vehicleTable1.forEach((e) => {
                    e['2-wheeler'] = formValue?.two_wheeler;
                    e['3-wheeler'] = formValue?.three_wheeler;
                    e['4-wheeler'] = formValue?.four_wheeler;
                })
                shoppingVehicleTable1.forEach((e) => {
                    e['2-wheeler'] = formValue?.two_wheeler;
                    e['3-wheeler'] = formValue?.three_wheeler;
                    e['4-wheeler'] = formValue?.four_wheeler;
                })
                setVehicleTable(vehicleTable1)
                setShoppingVehicleTable(shoppingVehicleTable1)
                setIsTableShow(true);
                // setSubmitted(true);
                // setTimeout(() => {
                //     setSubmitted(false);
                // }, 5000);
                // let sendData = {
                //     '2-wheeler': formValue?.two_wheeler,
                //     '3-wheeler': formValue?.three_wheeler,
                //     '4-wheeler': formValue?.four_wheeler
                // };
                // if (isCreate === true) {
                //     sendData.is_vehicle_setting_created = true
                // } else {
                //     sendData = { is_vehicle_setting_created: false }
                // }
                // formValue.id === '' && dispatch(vehicleSettingCreate(sendData));
                // formValue.id !== '' && dispatch(vehicleSettingUpdateRequest(formValue.id, sendData));

            }
        } catch (error) {
            console.log(error);
        }
    };
    const checkDisabled = () => {
        try {
            if (isCreate === false) {
                SetDesabledBut(false);
            } else if (vehicleSettingList && vehicleSettingList[0] && !vehicleSettingList[0].is_vehicle_setting_created) {
                SetDesabledBut(true);
            } else if (vehicleSettingList && vehicleSettingList[0] && vehicleSettingList[0].is_vehicle_setting_created) {
                SetDesabledBut(false);

            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div className=''>
            <div className="grid p-fluid mt-2">
                <div className="field col-12  mb-1">
                    <div>
                        <Checkbox checked={isCreate === true} inputId="ingredient1" onChange={() => {
                            setIsCreate(isCreate === false ? true : false);
                            !isCreate && dispatch(getPropertyStructureAllData());
                            isCreate && setIsTableShow(false);
                            setIsForBack(false);
                            setFormValue({
                                id: '',
                                two_wheeler: null,
                                three_wheeler: null,
                                four_wheeler: null
                            })
                            checkDisabled();
                            // SetDesabledBut(false)
                        }}></Checkbox>
                        <label className="ml-2 mt-2" htmlFor="ingredient1">{fromWizard ? "Click the checkbox to enable vehicle settings." : `Would you like to update the vehicle settings for the ${loginDetails?.property_type}?`}</label>
                    </div>

                </div>
                {isCreate === true && !isTableshow && <>
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="two_wheeler" className="required">
                            No. Of Two Wheeler Per Property
                        </label>
                        <InputNumber
                            max={9999}
                            inputId="two_wheeler"
                            placeholder="Enter No. Of Two Wheeler Per Property"
                            value={formValue?.two_wheeler}
                            onChange={(e) => {
                                if (e.value === null || e.value < 10000) {
                                    setFormValue({ ...formValue, two_wheeler: e.value });
                                }
                            }}
                            className={classNames({ 'p-invalid': error && formValue.two_wheeler === null })}
                        />
                    </div>
                    {/* {error && 'dfgdf dfhdfhdf'} */}
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="three_wheeler" className="required">
                            No. Of Three Wheeler Per Property
                        </label>
                        <InputNumber
                            max={9999}
                            inputId="three_wheeler"
                            placeholder="Enter No. Of Three Wheeler Per Property"
                            value={formValue?.three_wheeler}
                            onChange={(e) => {
                                if (e.value === null || e.value < 10000) {
                                    setFormValue({ ...formValue, three_wheeler: e.value });
                                }
                            }}
                            className={classNames({ 'p-invalid': error && formValue.three_wheeler === null })}
                        />
                    </div>
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="four_wheeler" className="required">
                            No. Of Four Wheeler Per Property
                        </label>
                        <InputNumber
                            max={9999}
                            inputId="four_wheeler"
                            placeholder="Enter No. Of Four Wheeler Per Property"
                            value={formValue?.four_wheeler}
                            onChange={(e) => {
                                if (e.value === null || e.value < 10000) {
                                    setFormValue({ ...formValue, four_wheeler: e.value });
                                }
                            }}
                            className={classNames({ 'p-invalid': error && formValue.four_wheeler === null })}
                        />
                    </div>
                </>}
            </div>
            {isTableshow && <>
                <DataTable
                    value={vehicleTable}
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
                    paginator={vehicleTable && vehicleTable.length > 10}
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50, 100, 300, 500]}
                    paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                >
                    <Column field="lable_name" header={"Property No."} />
                    <Column field='2-wheeler' header={"Two Wheeler"} body={(rowData) =>
                        <InputNumber
                            inputId="two_wheeler"
                            placeholder="Enter No Of Two Wheeler"
                            value={rowData['2-wheeler']}
                            className={classNames({ 'p-invalid': errorAll && rowData['2-wheeler'] === null }, 'w-full')}
                            onChange={(e) => {
                                let vehicleTable1 = [...vehicleTable];
                                let index = vehicleTable1.findIndex((x) => x.user_property_assign_id === rowData.user_property_assign_id);
                                vehicleTable1[index]['2-wheeler'] = e.value;
                                setVehicleTable(vehicleTable1);
                                SetDesabledBut(false);
                            }}
                        />

                    } />
                    <Column field='3-wheeler' header={"Three Wheeler"} body={(rowData) =>
                        <InputNumber
                            inputId="three_wheeler"
                            placeholder="Enter No Of Three Wheeler"
                            value={rowData['3-wheeler']}
                            className={classNames({ 'p-invalid': errorAll && rowData['3-wheeler'] === null }, 'w-full')}
                            onChange={(e) => {
                                let vehicleTable1 = [...vehicleTable];
                                let index = vehicleTable1.findIndex((x) => x.user_property_assign_id === rowData.user_property_assign_id);
                                vehicleTable1[index]['3-wheeler'] = e.value;
                                setVehicleTable(vehicleTable1);
                                SetDesabledBut(false);
                            }}
                        />

                    } />
                    <Column field='4-wheeler' header={"Four Wheeler"} body={(rowData) =>
                        <InputNumber
                            inputId="four_wheeler"
                            placeholder="Enter No Of Four Wheeler"
                            value={rowData['4-wheeler']}
                            className={classNames({ 'p-invalid': errorAll && rowData['4-wheeler'] === null }, 'w-full')}
                            onChange={(e) => {
                                let vehicleTable1 = [...vehicleTable];
                                let index = vehicleTable1.findIndex((x) => x.user_property_assign_id === rowData.user_property_assign_id);
                                vehicleTable1[index]['4-wheeler'] = e.value;
                                setVehicleTable(vehicleTable1);
                                SetDesabledBut(false);
                            }}
                        />

                    } />
                </DataTable>
                {shoppingVehicleTable.length > 0 && <Divider align="center" className=" pt-0">
                    <span className="p-tag text-base">Shopping Center Vehicle</span>
                </Divider>}
                {shoppingVehicleTable.length > 0 && <DataTable
                    value={shoppingVehicleTable}
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
                    paginator={shoppingVehicleTable && shoppingVehicleTable.length > 10}
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50, 100, 300, 500]}
                    paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                >
                    <Column field="lable_name" header={"Property No."} />
                    <Column field='2-wheeler' header={"Two Wheeler"} body={(rowData) =>
                        <InputNumber
                            inputId="two_wheeler"
                            placeholder="Enter No Of Two Wheeler"
                            value={rowData['2-wheeler']}
                            className={classNames({ 'p-invalid': errorAll && rowData['2-wheeler'] === null }, 'w-full')}
                            onChange={(e) => {
                                let vehicleTable1 = [...shoppingVehicleTable];
                                let index = vehicleTable1.findIndex((x) => x.user_property_assign_id === rowData.user_property_assign_id);
                                vehicleTable1[index]['2-wheeler'] = e.value;
                                setShoppingVehicleTable(vehicleTable1);
                                SetDesabledBut(false);
                            }}
                        />

                    } />
                    <Column field='3-wheeler' header={"Three Wheeler"} body={(rowData) =>
                        <InputNumber
                            inputId="three_wheeler"
                            placeholder="Enter No Of Three Wheeler"
                            value={rowData['3-wheeler']}
                            className={classNames({ 'p-invalid': errorAll && rowData['3-wheeler'] === null }, 'w-full')}
                            onChange={(e) => {
                                let vehicleTable1 = [...shoppingVehicleTable];
                                let index = vehicleTable1.findIndex((x) => x.user_property_assign_id === rowData.user_property_assign_id);
                                vehicleTable1[index]['3-wheeler'] = e.value;
                                setShoppingVehicleTable(vehicleTable1);
                                SetDesabledBut(false);
                            }}
                        />

                    } />
                    <Column field='4-wheeler' header={"Four Wheeler"} body={(rowData) =>
                        <InputNumber
                            inputId="four_wheeler"
                            placeholder="Enter No Of Four Wheeler"
                            value={rowData['4-wheeler']}
                            className={classNames({ 'p-invalid': errorAll && rowData['4-wheeler'] === null }, 'w-full')}
                            onChange={(e) => {
                                let vehicleTable1 = [...shoppingVehicleTable];
                                let index = vehicleTable1.findIndex((x) => x.user_property_assign_id === rowData.user_property_assign_id);
                                vehicleTable1[index]['4-wheeler'] = e.value;
                                setShoppingVehicleTable(vehicleTable1);
                                SetDesabledBut(false);
                            }}
                        />

                    } />
                </DataTable>}
                 <div className="p-invalid error text-xl mt-4" style={{ minHeight: "1.1rem", marginTop: "3px" }}>{"Notes:- "}<span className='text-base'>{"Please ensure that these changes will be applied to all properties."}</span></div>
            </>
            }
            <div className="grid p-fluid mt-3">
                <div className="col-12 md:col-12 flex justify-content-end align-items-center">
                    {fromWizard && <Button label="Back" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                        // onClick={onHide}
                        onClick={() => { isTableshow ? setIsTableShow(false) : nextprev(1) }}
                    />}
                    {!fromWizard && !isForBack && isTableshow && <Button label="Back"  className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem"
                        // onClick={onHide}
                        onClick={() => { setIsTableShow(false) }}
                    />}
                    {(isTableshow || !isCreate) ?
                        <Button
                            disabled={submitted || desabledBut}
                            style={{ width: '7rem' }}
                            label={isForBack ? "Update" : "Save"} type="submit"  className="p-button-outlined p-button-success mr-2 mb-2"
                            onClick={() => onSubmit2()}
                        />
                        : <Button
                            disabled={submitted}
                            style={{ width: '7rem' }}
                            label={"Next"} type="submit" iconPos="right" className="p-button-outlined p-button-success mr-2 mb-2"
                            onClick={() => onSubmit()}
                        />}

                </div>
            </div>
        </div>
    );
}
export default VehicleSetting;


