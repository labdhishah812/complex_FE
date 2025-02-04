import jwtDecode from 'jwt-decode';
import toast from 'react-hot-toast';
import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
import Loader from '../../../../components/Loader';
import { createFloorStructureRequest, createShoppingFloorStructureRequest, createShoppingStructureRequest, createStructureRequest } from '../../../../redux/slice/AdminSlices/blockSlice';
import ExcelUpload from './excelUpload';

import { alphabet } from './constant';
const CreateBlockModel = ({ onHide, shoppingStructureViewDetail }) => {
    const { InputText, Dropdown, InputNumber, React, Dialog, Button, Divider, RadioButton, classNames, useState, useSelector, useEffect, useDispatch } = components;
    const dispatch = useDispatch();
    const { token } = useSelector((store) => store.auth);
    const { isShopsCreated, isLoading } = useSelector((store) => store.block);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isManual, setIsManual] = useState(null);
    const [isCustomEdit, setIsCustomEdit] = useState(false);
    const [error, setError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [createStructure, setStructure] = useState({
        total_blocks: 0,
        select_naming_formate: '',
        total_floors: 0,
        total_properties: 0,
        shopping_total_block: 0,
        shopping_total_floors: 0,
        shopping_total_properties: 0
    });
    const [customCreate, setCustomCreate] = useState([]);
    const [shoppingCustomCreate, setShoppingCustomCreate] = useState([]);
    const [structureInfo, setStructureInfo] = useState([]);
    const [shoppingStructureInfo, setShoppingStructureInfo] = useState([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState({
        i: null,
        j: null,
        k: null,
        isShow: null,
        isOpen: null
    });
    const [isShoppingDeleteOpen, setIsShoppingDeleteOpen] = useState({
        i: null,
        j: null,
        k: null,
        isShow: null,
        isOpen: null
    });
    const [multiDeleteOpen, setMultiDeleteOpen] = useState(false);
    const [multiShopsDeleteOpen, setMultiShopsDeleteOpen] = useState(false);
    const [decode, setDecode] = useState(null);
    const [block, setBlock] = useState(null);
    const [floor, setFloor] = useState(null);
    const [house, setHouse] = useState(null);
    // const block = isBlock ? isBlock : null;
    // const floor = isFloor ? isFloor : null;
    // const house = isHouse ? isHouse : null;
    useEffect(() => {
        decodeURI();
    }, []);
    useEffect(() => {
        if (shoppingStructureViewDetail && shoppingStructureViewDetail.length > 0) {
            setIsManual(false);
        }
    }, [shoppingStructureViewDetail]);
    useEffect(() => {
        if (decode && decode?.is_block_exist_in_property === undefined && decode?.is_floor_exist_in_property === undefined && decode?.is_house_exist_in_property) {
            nextForm();
        }
    }, [decode]);
    const decodeURI = async () => {
        let decodeData = await jwtDecode(token);
        decodeData?.is_block_exist_in_property && setBlock(true);
        decodeData?.is_floor_exist_in_property && setFloor(true);
        decodeData?.is_house_exist_in_property && setHouse(true);
        let setState = {
            total_blocks: 0,
            select_naming_formate: '',
            total_floors: 0,
            total_properties: 0,
            shopping_total_block: 0,
            shopping_total_floors: 0,
            shopping_total_properties: 0
        };
        if (decodeData?.is_block_exist_in_property === undefined) setState.total_blocks = 1;
        if (decodeData?.is_floor_exist_in_property === undefined) setState.total_floors = 1;
        if (decodeData?.is_block_exist_in_property === undefined && (decodeData?.is_floor_exist_in_property || decodeData?.is_house_exist_in_property)) setState.select_naming_formate = 'xyz';
        if (decodeData?.is_block_exist_in_shopping_center_property === undefined) setState.shopping_total_block = 1;

        setStructure(setState);
        setDecode(decodeData);
        // if (decodeData?.is_block_exist_in_property === undefined && decodeData?.is_floor_exist_in_property === undefined && decodeData?.is_house_exist_in_property) nextFormCall();
    };
    // const nextFormCall = () => ;

    const nextForm = () => {
        try {
            if (createStructure?.total_blocks > 0 && createStructure?.select_naming_formate !== '' && createStructure?.total_floors > 0) {
                if (decode?.is_shopping_center_exist_in_property === true && (createStructure?.shopping_total_block <= 0 || createStructure?.shopping_total_floors <= 0)) {
                    setError(true);
                } else {
                    let customCreateArray = [];
                    let shoppingCustomCreateArray = [];
                    if (decode.is_ground_floor_exist_in_property === true) {
                        createStructure.total_floors = createStructure?.total_floors + 1;
                    }
                    for (let i = 0; i < createStructure?.total_blocks; i++) {
                        let block_info = {
                            block_name: '',
                            floorInfo: []
                        };
                        if (createStructure?.select_naming_formate === 'A') {
                            block_info.block_name = alphabet[i + 1];
                        } else if (createStructure?.select_naming_formate === 'A1') {
                            block_info.block_name = 'A' + (i + 1);
                        } else if (createStructure?.select_naming_formate === '1') {
                            block_info.block_name = (i + 1).toString();
                        } else {
                            block_info.block_name = '';
                        }
                        for (let j = 0; j < createStructure?.total_floors; j++) {
                            block_info.floorInfo.push({
                                floor_name: decode.is_ground_floor_exist_in_property === true && j === 0 ? `Ground Floor` : decode.is_ground_floor_exist_in_property === true ? `${setCardinalNumber(j)} Floor` : `${setCardinalNumber(j + 1)} Floor`,
                                floor_start: null,
                                floor_end: null
                            });
                        }
                        customCreateArray.push(block_info);
                    }
                    if (decode?.is_shopping_center_exist_in_property === true) {
                        for (let i = 0; i < createStructure?.shopping_total_block; i++) {
                            let shopping_block_info = {
                                block_name: '',
                                floorInfo: []
                            };
                            if (createStructure?.select_naming_formate === 'A' && decode?.is_block_exist_in_shopping_center_property === true) {
                                shopping_block_info.block_name = alphabet[i + 1];
                            } else if (createStructure?.select_naming_formate === 'A1' && decode?.is_block_exist_in_shopping_center_property === true) {
                                shopping_block_info.block_name = 'A' + (i + 1);
                            } else if (createStructure?.select_naming_formate === '1' && decode?.is_block_exist_in_shopping_center_property === true) {
                                shopping_block_info.block_name = (i + 1).toString();
                            } else {
                                shopping_block_info.block_name = '';
                            }
                            for (let j = 0; j < createStructure?.shopping_total_floors; j++) {
                                shopping_block_info.floorInfo.push({ floor_name: j === 0 ? `Ground Floor` : `${setCardinalNumber(j)} Floor`, floor_start: null, floor_end: null });
                            }
                            shoppingCustomCreateArray.push(shopping_block_info);
                        }
                    }
                    setCustomCreate(customCreateArray);
                    setShoppingCustomCreate(shoppingCustomCreateArray);
                    customCreateArray.length > 0 && setIsCustomEdit(true);
                }
            } else {
                setError(true);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const generateStructure = () => {
        try {
            let array = [...customCreate];
            let array2 = [...shoppingCustomCreate];
            const checkNullData = array.filter((item) => {
                return item.floorInfo.some((floor) => {
                    return floor.floor_start === null || floor.floor_end === null;
                });
            });
            const checkNullData2 = array2.filter((item) => {
                return item.floorInfo.some((floor) => {
                    return floor.floor_start === null || floor.floor_end === null;
                });
            });
            const checkConditionData = array.filter((item) => {
                return item.floorInfo.some((floor) => {
                    return floor.floor_end <= floor.floor_start;
                });
            });
            const checkConditionData2 = array2.filter((item) => {
                return item.floorInfo.some((floor) => {
                    return floor.floor_end <= floor.floor_start;
                });
            });
            if (checkNullData.length > 0 || checkNullData2.length > 0) {
                toast.error('Property No. is required', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            } else if (checkConditionData.length > 0 || checkConditionData2.length > 0) {
                toast.error('End no. should be greater then start no.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            } else {
                let structureArray = [];
                let shoppingStructureArray = [];

                array.forEach((x) => {
                    let block_info = {
                        block_name: x?.block_name,
                        floor_info: []
                    };
                    x?.floorInfo.forEach((y) => {
                        let floor = {
                            floor_name: y.floor_name,
                            floor_property: []
                        };
                        for (let a = y?.floor_start; a <= y?.floor_end; a++) {
                            floor.floor_property.push({ propertyNO: a, isShow: true, isSelected: false });
                        }
                        block_info.floor_info.push(floor);
                    });
                    structureArray.push(block_info);
                });
                if (decode?.is_shopping_center_exist_in_property === true) {
                    array2.forEach((x) => {
                        let shopping_block_info = {
                            block_name: x?.block_name,
                            floor_info: []
                        };
                        x?.floorInfo.forEach((y) => {
                            let floor = {
                                floor_name: y.floor_name,
                                floor_property: []
                            };
                            for (let a = y?.floor_start; a <= y?.floor_end; a++) {
                                floor.floor_property.push({ propertyNO: a, isShow: true, isSelected: false });
                            }
                            shopping_block_info.floor_info.push(floor);
                        });
                        shoppingStructureArray.push(shopping_block_info);
                    });
                }
                setStructureInfo(structureArray);
                setShoppingStructureInfo(shoppingStructureArray);
                structureArray.length > 0 && setIsGenerated(true);
            }
            // if (createStructure?.total_blocks > 0 && createStructure?.select_naming_formate !== '' && createStructure?.total_floors > 0 && createStructure?.total_properties > 0) {
            //     if (decode?.is_shopping_center_exist_in_property === true && (createStructure?.shopping_total_block <= 0 || createStructure?.shopping_total_floors <= 0 || createStructure?.shopping_total_properties <= 0)) {
            //         setError(true);
            //     } else {
            //         let structureArray = [];
            //         let shoppingStructureArray = [];
            //         if (decode.is_ground_floor_exist_in_property === true) {
            //             createStructure.total_floors = createStructure?.total_floors + 1;
            //         }
            //         for (let i = 0; i < createStructure?.total_blocks; i++) {
            //             let block_info = {
            //                 block_name: '',
            //                 floorInfo: []
            //             };
            //             if (createStructure?.select_naming_formate === 'A') {
            //                 block_info.block_name = alphabet[i + 1];
            //             } else if (createStructure?.select_naming_formate === 'A1') {
            //                 block_info.block_name = 'A' + (i + 1);
            //             } else if (createStructure?.select_naming_formate === '1') {
            //                 block_info.block_name = (i + 1).toString();
            //             } else {
            //                 block_info.block_name = '';
            //             }
            //             for (let j = 0; j < createStructure?.total_floors; j++) {
            //                 let floor_property = [];
            //                 for (let a = 0; a < createStructure?.total_properties; a++) {
            //                     // decode.property_type === 'Complex' ? j === 0 && 0 :
            //                     if (decode.is_ground_floor_exist_in_property === true) {
            //                         floor_property.push({ propertyNO: 100 * j + (a + 1), isShow: true, isSelected: false });
            //                     } else {
            //                         floor_property.push({ propertyNO: (decode.property_type === 'Society' ? 0 : 100) * (j + 1) + (a + 1), isShow: true, isSelected: false });
            //                     }
            //                 }
            //                 block_info.floorInfo.push(floor_property);
            //             }
            //             structureArray.push(block_info);
            //         }
            //         if (decode?.is_shopping_center_exist_in_property === true) {
            //             for (let i = 0; i < createStructure?.shopping_total_block; i++) {
            //                 let shopping_block_info = {
            //                     block_name: '',
            //                     floorInfo: []
            //                 };
            //                 if (createStructure?.select_naming_formate === 'A' && decode?.is_block_exist_in_shopping_center_property === true) {
            //                     shopping_block_info.block_name = alphabet[i + 1];
            //                 } else if (createStructure?.select_naming_formate === 'A1' && decode?.is_block_exist_in_shopping_center_property === true) {
            //                     shopping_block_info.block_name = 'A' + (i + 1);
            //                 } else if (createStructure?.select_naming_formate === '1' && decode?.is_block_exist_in_shopping_center_property === true) {
            //                     shopping_block_info.block_name = (i + 1).toString();
            //                 } else {
            //                     shopping_block_info.block_name = '';
            //                 }
            //                 for (let j = 0; j < createStructure?.shopping_total_floors; j++) {
            //                     let floor_property = [];
            //                     for (let a = 0; a < createStructure?.shopping_total_properties; a++) {
            //                         floor_property.push({ propertyNO: (j === 0 ? 0 : createStructure?.shopping_total_properties) * j + (a + 1), isShow: true, isSelected: false });
            //                     }
            //                     shopping_block_info.floorInfo.push(floor_property);
            //                 }
            //                 shoppingStructureArray.push(shopping_block_info);
            //             }
            //         }
            //         setStructureInfo(structureArray);
            //         setShoppingStructureInfo(shoppingStructureArray);
            //         structureArray.length > 0 && setIsGenerated(true);
            //     }
            // } else {
            //     setError(true);
            // }
        } catch (error) {
            console.log(error);
        }
    };
    const footerUI = () => {
        try {
            return (
                <>
                    <Button
                        label="Back"
                        icon="pi pi-arrow-left"
                        className="p-button-outlined p-button-danger mr-2 mb-2"
                        onClick={() => {
                            setIsGenerated(false);
                        }}
                    />
                    <Button disabled={submitted} label="Save" type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2" onClick={() => submitData()} />
                </>
            );
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (isShopsCreated && decode && decode.is_shopping_center_exist_in_property === true) {
            let sendData = {
                property_structure_details: []
            };
            if (decode?.is_block_exist_in_property) sendData.is_block_exist_in_property = true;
            if (decode?.is_floor_exist_in_property) sendData.is_floor_exist_in_property = true;
            if (decode?.is_house_exist_in_property) sendData.is_house_exist_in_property = true;
            if (decode.is_ground_floor_exist_in_property === true) sendData.is_ground_floor_exist_in_property = true;

            if (decode?.is_block_exist_in_property && decode?.is_floor_exist_in_property) {
                sendData.property_structure_details = generalDataCreate();
            } else if (decode?.is_block_exist_in_property && decode?.is_house_exist_in_property) {
                sendData.property_structure_details = generalDataCreateForBH();
            } else if (decode?.is_block_exist_in_property === undefined && decode?.is_floor_exist_in_property !== undefined && decode?.is_house_exist_in_property === undefined) {
                sendData = generalDataCreateOnlyFloor();
            } else if (decode?.is_block_exist_in_property === undefined && decode?.is_floor_exist_in_property === undefined && decode?.is_house_exist_in_property) {
                sendData = generalDataCreateOnlyHouse();
            }
            if (
                ((decode?.is_block_exist_in_property && (decode?.is_floor_exist_in_property || decode?.is_house_exist_in_property)) ||
                    (decode?.is_block_exist_in_property === undefined && decode?.is_floor_exist_in_property === undefined && decode?.is_house_exist_in_property)) &&
                sendData.property_structure_details.length > 0
            )
                dispatch(createStructureRequest(sendData));
            else if (decode?.is_block_exist_in_property === undefined && decode?.is_floor_exist_in_property && decode?.is_house_exist_in_property === undefined) dispatch(createFloorStructureRequest(sendData));
        }
    }, [isShopsCreated]);
    const submitData = async () => {
        try {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
            let sendData = {
                property_structure_details: []
            };
            if (block !== null) sendData.is_block_exist_in_property = true;
            if (floor !== null) sendData.is_floor_exist_in_property = true;
            if (house !== null) sendData.is_house_exist_in_property = true;
            if (decode.is_ground_floor_exist_in_property === true) sendData.is_ground_floor_exist_in_property = true;

            if (block !== null && floor !== null) {
                sendData.property_structure_details = generalDataCreate();
            } else if (block !== null && house !== null) {
                sendData.property_structure_details = generalDataCreateForBH();
            } else if (block === null && floor !== null && house === null) {
                sendData = generalDataCreateOnlyFloor();
            } else if (block === null && floor === null && house !== null) {
                sendData = generalDataCreateOnlyHouse();
            }
            if (decode.is_shopping_center_exist_in_property === true) {
                let shoppingSentData = {
                    is_shopping_center_exist_in_property: true,
                    property_structure_details: []
                };
                if (decode.is_block_exist_in_shopping_center_property === true) shoppingSentData.is_block_exist_in_shopping_center_property = true;
                if (decode.is_floor_exist_in_shopping_center_property === true) shoppingSentData.is_floor_exist_in_shopping_center_property = true;
                if (decode.is_block_exist_in_shopping_center_property === true && decode.is_floor_exist_in_shopping_center_property === true) {
                    shoppingSentData.property_structure_details = generalShoppingDataCreate();
                    shoppingSentData.property_structure_details.length > 0 && dispatch(createShoppingStructureRequest(shoppingSentData));
                } else if (decode.is_floor_exist_in_shopping_center_property === true) {
                    shoppingSentData = generalShoppingFloorDataCreate();
                    shoppingSentData.property_structure_details.length > 0 && dispatch(createShoppingFloorStructureRequest(shoppingSentData));
                }
            }
            if (decode.is_shopping_center_exist_in_property !== true) {
                if (((block !== null && (floor !== null || house !== null)) || (block === null && floor === null && house !== null)) && sendData.property_structure_details.length > 0) dispatch(createStructureRequest(sendData));
                else if (block === null && floor !== null && house === null) dispatch(createFloorStructureRequest(sendData));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const generalDataCreateOnlyFloor = () => {
        try {
            let sendData = {
                property_structure_details: []
            };
            structureInfo.forEach((x) => {
                let block_info = {
                    total_floors: createStructure?.total_floors,
                    floor_details: []
                };
                x.floor_info.forEach((y, i) => {
                    let floor_info = {
                        floor_name: y?.floor_name === 'Ground Floor' ? y?.floor_name : y?.floor_name.replace(' Floor', ''),
                        total_property_floor_wise: y.floor_property.filter((a) => a.isShow === true).length,
                        floor_wise_property_details: []
                    };
                    y.floor_property.forEach((z) => {
                        if (z.isShow === true) {
                            floor_info.floor_wise_property_details.push({ property_number: z.propertyNO.toString() });
                        }
                    });
                    block_info.floor_details.push(floor_info);
                });
                sendData.property_structure_details.push(block_info);
            });
            return sendData;
        } catch (error) {
            console.log(error);
        }
    };
    const generalDataCreate = () => {
        try {
            let data = [];
            structureInfo.forEach((x) => {
                let block_info = {
                    block_name: x.block_name,
                    total_floors: createStructure?.total_floors,
                    floor_details: []
                };
                x.floor_info.forEach((y, i) => {
                    let floor_info = {
                        floor_name: y?.floor_name === 'Ground Floor' ? y?.floor_name : y?.floor_name.replace(' Floor', ''),
                        floor_wise_total_property: y?.floor_property.filter((a) => a.isShow === true).length,
                        floor_wise_property_details: []
                    };
                    y?.floor_property.forEach((z) => {
                        if (z.isShow === true) {
                            floor_info.floor_wise_property_details.push({ property_number: x.block_name + '-' + z.propertyNO });
                        }
                    });
                    block_info.floor_details.push(floor_info);
                });
                data.push(block_info);
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const generalShoppingFloorDataCreate = () => {
        try {
            let data = {
                is_shopping_center_exist_in_property: true,
                property_structure_details: []
            };
            shoppingStructureInfo.forEach((x) => {
                let block_info = {
                    total_floors: createStructure?.shopping_total_floors,
                    floor_details: []
                };
                x.floor_info.forEach((y, i) => {
                    let floor_info = {
                        floor_name: y?.floor_name === 'Ground Floor' ? y?.floor_name : y?.floor_name.replace(' Floor', ''),
                        total_property_floor_wise: y.floor_property.filter((a) => a.isShow === true).length,
                        floor_wise_property_details: []
                    };
                    y.floor_property.forEach((z) => {
                        if (z.isShow === true) {
                            floor_info.floor_wise_property_details.push({ property_number: z.propertyNO.toString() });
                        }
                    });
                    block_info.floor_details.push(floor_info);
                });
                data.property_structure_details.push(block_info);
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const generalShoppingDataCreate = () => {
        try {
            let data = [];
            shoppingStructureInfo.forEach((x) => {
                let block_info = {
                    block_name: x.block_name,
                    total_floors: createStructure?.shopping_total_floors,
                    floor_details: []
                };
                x.floor_info.forEach((y, i) => {
                    let floor_info = {
                        floor_name: y?.floor_name === 'Ground Floor' ? y?.floor_name : y?.floor_name.replace(' Floor', ''),
                        total_property_floor_wise: y.floor_property.filter((a) => a.isShow === true).length,
                        floor_wise_property_details: []
                    };
                    y.floor_property.forEach((z) => {
                        if (z.isShow === true) {
                            floor_info.floor_wise_property_details.push({ property_number: x.block_name + '-' + z.propertyNO });
                        }
                    });
                    block_info.floor_details.push(floor_info);
                });
                data.push(block_info);
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const generalDataCreateOnlyHouse = () => {
        let sendData = {
            is_block_exist_in_property: false,
            is_house_exist_in_property: true,
            property_structure_details: []
        };
        structureInfo.forEach((x) => {
            x.floor_info.forEach((y, i) => {
                let house_info = {
                    total_houses: y.floor_property.filter((a) => a.isShow === true).length,
                    house_details: []
                };
                y.floor_property.forEach((z) => {
                    if (z.isShow === true) {
                        house_info.house_details.push({ property_number: z.propertyNO.toString() });
                    }
                });
                sendData.property_structure_details.push(house_info);
            });
        });
        return sendData;
    };
    const generalDataCreateForBH = () => {
        try {
            let data = [];
            structureInfo.forEach((x) => {
                let block_info = {
                    block_name: x.block_name,
                    total_houses: 0,
                    house_details: []
                };
                x.floor_info.forEach((y, i) => {
                    y.floor_property.forEach((z) => {
                        if (z.isShow === true) {
                            block_info.total_houses = block_info.total_houses + 1;
                            block_info.house_details.push({ property_number: x.block_name + '-' + z.propertyNO });
                        }
                    });
                });
                data.push(block_info);
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const setCardinalNumber = (val) => {
        try {
            const suffixes = ['th', 'st', 'nd', 'rd'];
            const suffix = val % 100 >= 11 && val % 100 <= 13 ? 'th' : suffixes[val % 10] || 'th';
            return val + suffix;
        } catch (error) {
            console.log(error);
        }
    };
    const deleteUserDialogFooter = (val) => {
        try {
            return (
                <>
                    <Button
                        label="No"
                        icon="pi pi-times"
                        className="p-button-outlined p-button-danger mr-2 mb-2"
                        onClick={() =>
                            val === 'multiDelete'
                                ? setMultiDeleteOpen(false)
                                : setIsDeleteOpen({
                                      i: null,
                                      j: null,
                                      k: null,
                                      isShow: null,
                                      isOpen: null
                                  })
                        }
                    />
                    <Button label="Yes" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2" onClick={() => (val === 'multiDelete' ? deleteMultiItem() : setPropertyShow())} />
                </>
            );
        } catch (error) {
            console.log(error);
        }
    };
    const deleteShoppingDialogFooter = (val) => {
        try {
            return (
                <>
                    <Button
                        label="No"
                        icon="pi pi-times"
                        className="p-button-outlined p-button-danger mr-2 mb-2"
                        onClick={() =>
                            val === 'multiDelete'
                                ? setMultiShopsDeleteOpen(false)
                                : setIsShoppingDeleteOpen({
                                      i: null,
                                      j: null,
                                      k: null,
                                      isShow: null,
                                      isOpen: null
                                  })
                        }
                    />
                    <Button label="Yes" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2" onClick={() => (val === 'multiDelete' ? deleteMultiItem('shopping') : setPropertyShow('shopping'))} />
                </>
            );
        } catch (error) {
            console.log(error);
        }
    };
    const deleteMultiItem = (val) => {
        try {
            if (val !== 'shopping') {
                structureInfo.forEach((x) => {
                    x.floor_info.forEach((y) => {
                        y.floor_property.forEach((z) => {
                            if (z.isSelected) {
                                z.isSelected = false;
                                z.isShow = false;
                            }
                        });
                    });
                });
                setStructureInfo(structureInfo);
                setMultiDeleteOpen(false);
            } else {
                shoppingStructureInfo.forEach((x) => {
                    x.floor_info.forEach((y) => {
                        y.floor_property.forEach((z) => {
                            if (z.isSelected) {
                                z.isSelected = false;
                                z.isShow = false;
                            }
                        });
                    });
                });
                setShoppingStructureInfo(shoppingStructureInfo);
                setMultiShopsDeleteOpen(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const setPropertyShow = (val) => {
        try {
            if (val !== 'shopping') {
                let data = { ...structureInfo };
                data[isDeleteOpen.i].floor_info[isDeleteOpen.j].floor_property[isDeleteOpen.k].isShow = !isDeleteOpen.isShow;
                setIsDeleteOpen({
                    i: null,
                    j: null,
                    k: null,
                    isShow: null,
                    isOpen: null
                });
            } else {
                let data = { ...shoppingStructureInfo };
                data[isShoppingDeleteOpen.i].floor_info[isShoppingDeleteOpen.j].floor_property[isShoppingDeleteOpen.k].isShow = !isShoppingDeleteOpen.isShow;
                setIsShoppingDeleteOpen({
                    i: null,
                    j: null,
                    k: null,
                    isShow: null,
                    isOpen: null
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const setMultiData = (val, name) => {
        try {
            if (name !== 'shopping') {
                structureInfo[val.i].floor_info[val.j].floor_property[val.k].isSelected = !val.isSelected;
                setStructureInfo([...structureInfo]);
            } else {
                shoppingStructureInfo[val.i].floor_info[val.j].floor_property[val.k].isSelected = !val.isSelected;
                setShoppingStructureInfo([...shoppingStructureInfo]);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const checkDeleteShow = () => {
        let flag = false;
        structureInfo.forEach((x) => {
            x.floor_info.forEach((y) => {
                y.floor_property.forEach((z) => {
                    if (z.isSelected) flag = true;
                });
            });
        });
        return flag;
    };
    const checkDeleteShopShow = () => {
        let flag = false;
        shoppingStructureInfo.forEach((x) => {
            x.floor_info.forEach((y) => {
                y.floor_property.forEach((z) => {
                    if (z.isSelected) flag = true;
                });
            });
        });
        return flag;
    };
    const setPropertyStartEnd = (val, block, floor, name) => {
        try {
            let array = [...customCreate];
            val = parseInt(val);
            // if(val === )
            if (val === null) val = 1;
            if (val < 1) val = 1;
            if (name === 'start') {
                array[block].floorInfo[floor].floor_start = val;
            } else if (name === 'end') {
                array[block].floorInfo[floor].floor_end = val;
            }
            setCustomCreate(array);
        } catch (error) {
            console.log(error);
        }
    };
    const setShoppingStartEnd = (val, block, floor, name) => {
        try {
            let array = [...shoppingCustomCreate];
            val = parseInt(val);
            // if(val === )
            if (val === null) val = 1;
            if (val < 1) val = 1;
            if (name === 'start') {
                array[block].floorInfo[floor].floor_start = val;
            } else if (name === 'end') {
                array[block].floorInfo[floor].floor_end = val;
            }
            setShoppingCustomCreate(array);
        } catch (error) {
            console.log(error);
        }
    };
    const customFooterUi = () => {
        try {
            return (
                <>
                    {!decode?.is_house_exist_in_property && (
                        <Button
                            label="Back"
                            icon="pi pi-arrow-left"
                            style={{ width: '6rem' }}
                            className="p-button-outlined p-button-danger mr-2"
                            onClick={() => {
                                setCustomCreate([]);
                                setShoppingCustomCreate([]);
                                setIsCustomEdit(false);
                                decode.is_ground_floor_exist_in_property === true && setStructure({ ...createStructure, total_floors: createStructure?.total_floors - 1 });
                            }}
                        />
                    )}
                    <Button label="Generate Structure" icon="pi pi-cog" style={{ width: '12rem' }} className="p-button-outlined p-button-success" onClick={() => generateStructure()} />
                </>
            );
        } catch (error) {
            console.log(error);
        }
    };
    // console.log(customCreate, 'structureInfo');
    // console.log(shoppingCustomCreate, 'shoppingCustomCreate');
    return (
        <>
            <Dialog visible={true} style={{ width: '90vw' }} header="Create Property Structure" modal className="p-fluid" onHide={onHide} footer={isGenerated ? footerUI : isCustomEdit && !isGenerated && customCreate.length > 0 && customFooterUi}>
                <div className="relative">
                    <Loader isLoading={isLoading} />
                    {/* || isGenerated === false */}
                    {isManual === null && (
                        <div className="grid p-fluid mt-1">
                            <div className="field col-12 md:col-6 mb-1">
                                <label htmlFor="isManual" className="required">
                                    How would you like to create the property structure?
                                </label>
                                <div className="flex flex-wrap gap-3 ">
                                    <div className="flex align-items-center">
                                        <RadioButton
                                            inputId="isManual1"
                                            name="isManual"
                                            value="Manual"
                                            onChange={(e) => {
                                                setIsManual(true);
                                                // decodeURI();
                                                // handleReset();
                                            }}
                                            // checked={createShopping === true}
                                        />
                                        <label htmlFor="isManual1" className="ml-2">
                                            Manual
                                        </label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton
                                            inputId="isManual2"
                                            name="isManual"
                                            value="By Uploading Excel"
                                            onChange={(e) => {
                                                setIsManual(false);
                                                // decodeURI();
                                                // handleReset();
                                            }}
                                            // checked={createShopping === true}
                                        />
                                        <label htmlFor="isManual2" className="ml-2">
                                            By Uploading Excel
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {isManual === true && (
                        <>
                            {isCustomEdit === false && (
                                <>
                                    {block !== null && (
                                        <div className="grid p-fluid mt-1">
                                            <div className="field col-12 md:col-6 mb-1">
                                                <label htmlFor="total_blocks" className="required">
                                                    Please enter your total blocks
                                                </label>
                                                <InputNumber
                                                    inputId="total_blocks"
                                                    placeholder="Enter your total blocks"
                                                    value={createStructure?.total_blocks}

                                                    onValueChange={(e) => setStructure({ ...createStructure, total_blocks: e.target.value })}
                                                    className={classNames({ 'p-invalid': error && createStructure?.total_blocks <= 0 })}
                                                />
                                                {error && createStructure?.total_blocks <= 0 ? <small className="p-invalid error">{'Please enter your total blocks greater than 0'}</small> : null}
                                            </div>
                                            <div className="field col-12 md:col-6 mb-1">
                                                <label htmlFor="select_naming_formate" className="required">
                                                    Please select block naming format
                                                </label>
                                                <Dropdown
                                                    id="select_naming_formate"
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    required
                                                    options={[
                                                        { label: 'A,B,C,...', value: 'A' },
                                                        { label: 'A1,A2,A3,...', value: 'A1' },
                                                        { label: '1,2,3,...', value: '1' }
                                                    ]}
                                                    name="select_naming_formate"
                                                    placeholder="Select block naming format"
                                                    type="text"
                                                    value={createStructure?.select_naming_formate}
                                                    onChange={(e) => setStructure({ ...createStructure, select_naming_formate: e.target.value })}
                                                    className={classNames({ 'p-invalid': error && createStructure?.select_naming_formate === '' })}
                                                />
                                                {error && createStructure?.select_naming_formate === '' ? <small className="p-invalid error">{'Please select block naming format'}</small> : null}
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid p-fluid mt-1">
                                        {floor !== null && (
                                            <div className="field col-12 md:col-6 mb-1">
                                                <label htmlFor="total_floors" className="required">
                                                    Please enter your total floors
                                                </label>
                                                <InputNumber
                                                    inputId="total_floors"
                                                    placeholder="Enter your total floors"
                                                    value={createStructure?.total_floors}
                                                    onValueChange={(e) => setStructure({ ...createStructure, total_floors: e.target.value })}
                                                    className={classNames({ 'p-invalid': error && createStructure?.total_floors <= 0 })}
                                                />
                                                {error && createStructure?.total_floors <= 0 ? <small className="p-invalid error">{'Please enter your total floor greater than 0'}</small> : null}
                                            </div>
                                        )}
                                        {/* <div className="field col-12 md:col-6 mb-1">
                                    <label htmlFor="total_properties" className="required">
                                        Please enter your total properties
                                    </label>
                                    <InputNumber
                                        inputId="total_properties"
                                        placeholder="Enter your total properties"
                                        value={createStructure?.total_properties}
                                        onValueChange={(e) => setStructure({ ...createStructure, total_properties: e.target.value })}
                                        className={classNames({ 'p-invalid': error && createStructure?.total_properties <= 0 })}
                                    />
                                    {error && createStructure?.total_properties <= 0 ? <small className="p-invalid error">{'Please enter your total property greater than 0'}</small> : null}
                                </div> */}
                                    </div>
                                    {decode?.is_shopping_center_exist_in_property === true && (
                                        <Divider align="center" className=" pt-0">
                                            <span className="p-tag">Shopping Center Details</span>
                                        </Divider>
                                    )}
                                    {decode?.is_shopping_center_exist_in_property === true && (
                                        <div className="grid p-fluid mt-1">
                                            {decode?.is_block_exist_in_shopping_center_property === true && (
                                                <div className="field col-12 md:col-6 mb-1">
                                                    <label htmlFor="shopping_total_blocks" className="required">
                                                        Please enter your shopping total blocks
                                                    </label>
                                                    <InputNumber
                                                        inputId="total_shopping_total_blocks"
                                                        placeholder="Enter your shopping total blocks"
                                                        value={createStructure?.shopping_total_block}
                                                        onValueChange={(e) => setStructure({ ...createStructure, shopping_total_block: e.target.value })}
                                                        className={classNames({ 'p-invalid': error && createStructure?.shopping_total_block <= 0 })}
                                                    />
                                                    {error && createStructure?.shopping_total_block <= 0 ? <small className="p-invalid error">{'Please enter your shopping total blocks greater than 0'}</small> : null}
                                                </div>
                                            )}
                                            <div className="field col-12 md:col-6 mb-1">
                                                <label htmlFor="shopping_total_floors" className="required">
                                                    Please enter your shopping total floors
                                                </label>
                                                <InputNumber
                                                    inputId="shopping_total_floors"
                                                    placeholder="Enter your shopping total floors"
                                                    value={createStructure?.shopping_total_floors}
                                                    onValueChange={(e) => setStructure({ ...createStructure, shopping_total_floors: e.target.value })}
                                                    className={classNames({ 'p-invalid': error && createStructure?.shopping_total_floors <= 0 })}
                                                />
                                                {error && createStructure?.shopping_total_floors <= 0 ? <small className="p-invalid error">{'Please enter your shopping total floor greater than 0'}</small> : null}
                                            </div>
                                            {/* <div className="field col-12 md:col-6 mb-1">
                                        <label htmlFor="shopping_total_properties" className="required">
                                            Please enter your shopping total properties
                                        </label>
                                        <InputNumber
                                            inputId="shopping_total_properties"
                                            placeholder="Enter your shopping total properties"
                                            value={createStructure?.shopping_total_properties}
                                            onValueChange={(e) => setStructure({ ...createStructure, shopping_total_properties: e.target.value })}
                                            className={classNames({ 'p-invalid': error && createStructure?.shopping_total_properties <= 0 })}
                                        />
                                        {error && createStructure?.shopping_total_properties <= 0 ? <small className="p-invalid error">{'Please enter your total property greater than 0'}</small> : null}
                                    </div> */}
                                        </div>
                                    )}
                                    <div className="grid p-fluid mt-1">
                                        <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                                            <Button label="Next" icon="pi pi-cog" style={{ width: '6rem' }} className="p-button-outlined p-button-success" onClick={() => nextForm()} />
                                            {/* <Button label="Generate Structure" icon="pi pi-cog" style={{ width: '12rem' }} className="p-button-outlined p-button-success" onClick={() => generateStructure()} /> */}
                                        </div>
                                    </div>
                                </>
                            )}
                            {isCustomEdit && !isGenerated && customCreate.length > 0 && (
                                <>
                                    <div className="py-2" style={{ minWidth: '50rem', overflow: 'auto' }}>
                                        <table className="maintenanceSettings_table">
                                            <thead>
                                                <tr>
                                                    {block !== null && <th className="maintenanceSettings_table_th">Block</th>}
                                                    {floor !== null && <th className="maintenanceSettings_table_th">Floor</th>}
                                                    <th className="maintenanceSettings_table_th">Property No.</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {customCreate &&
                                                    customCreate.map((x, i) =>
                                                        x?.floorInfo.map((y, j) => (
                                                            <tr>
                                                                {j === 0 && block !== null && (
                                                                    <td className="maintenanceSettings_table_td " rowspan={x?.floorInfo.length.toString()} style={{ minWidth: '7rem' }}>
                                                                        {x.block_name}
                                                                    </td>
                                                                )}
                                                                {floor !== null && (
                                                                    <td className="maintenanceSettings_table_td" style={{ minWidth: '7rem' }}>
                                                                        {y.floor_name}
                                                                    </td>
                                                                )}
                                                                <td className="maintenanceSettings_table_td w-30rem">
                                                                    <div className="flex justify-content-center align-items-center p-2 ">
                                                                        <InputText
                                                                            tooltip={y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start ? 'End no. should be greater then start no.' : null}
                                                                            tooltipOptions={{ position: 'top', className: 'input-error-tooltip' }}
                                                                            className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start })}
                                                                            type="number"
                                                                            placeholder="Start no."
                                                                            value={y.floor_start}
                                                                            onChange={(e) => e.target.value !== '' && setPropertyStartEnd(e.target.value, i, j, 'start')}
                                                                            style={{ minWidth: '7rem' }}
                                                                        />
                                                                        <div className="mx-5">To</div>
                                                                        <InputText
                                                                            tooltip={y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start ? 'End no. should be greater then start no.' : null}
                                                                            tooltipOptions={{ position: 'top', className: 'input-error-tooltip' }}
                                                                            className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start })}
                                                                            type="number"
                                                                            placeholder="End no."
                                                                            value={y.floor_end}
                                                                            onChange={(e) => e.target.value !== '' && setPropertyStartEnd(e.target.value, i, j, 'end')}
                                                                            style={{ minWidth: '7rem' }}
                                                                        />
                                                                    </div>
                                                                    {/* {y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start && <small className="p-invalid error">{'End no. should be greater then start no.'}</small>} */}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                            </tbody>
                                            {decode?.is_shopping_center_exist_in_property === true && (
                                                <thead>
                                                    <tr>
                                                        <th className="maintenanceSettings_table_th" colSpan={3}>
                                                            Shopping
                                                        </th>
                                                    </tr>
                                                </thead>
                                            )}
                                            <tbody>
                                                {shoppingCustomCreate &&
                                                    shoppingCustomCreate.map((x, i) =>
                                                        x?.floorInfo.map((y, j) => (
                                                            <tr>
                                                                {j === 0 && decode?.is_block_exist_in_shopping_center_property && (
                                                                    <td className="maintenanceSettings_table_td" rowspan={x?.floorInfo.length.toString()}>
                                                                        {x.block_name}
                                                                    </td>
                                                                )}
                                                                <td className="maintenanceSettings_table_td">{y.floor_name}</td>
                                                                <td className="maintenanceSettings_table_td w-30rem">
                                                                    <div className="flex justify-content-center align-items-center p-2">
                                                                        <InputText
                                                                            tooltip={y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start ? 'End no. should be greater then start no.' : null}
                                                                            tooltipOptions={{ position: 'top', className: 'input-error-tooltip' }}
                                                                            className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start }, 'w-12rem')}
                                                                            type="number"
                                                                            // inputId="shopping_total_floors"
                                                                            placeholder="Start no."
                                                                            value={y.floor_start}
                                                                            // className="w-12rem"
                                                                            onChange={(e) => e.target.value !== '' && setShoppingStartEnd(e.target.value, i, j, 'start')}
                                                                            // onValueChange={(e) => setStructure({ ...createStructure, shopping_total_floors: e.target.value })}
                                                                            // className={classNames({ 'p-invalid': error && createStructure?.shopping_total_floors <= 0 })}
                                                                        />
                                                                        <div className="mx-5">To</div>
                                                                        <InputText
                                                                            tooltip={y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start ? 'End no. should be greater then start no.' : null}
                                                                            tooltipOptions={{ position: 'top', className: 'input-error-tooltip' }}
                                                                            className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start }, 'w-12rem')}
                                                                            type="number"
                                                                            // inputId="shopping_total_floors"
                                                                            placeholder="End no."
                                                                            value={y.floor_end}
                                                                            // className="w-12rem"
                                                                            onChange={(e) => e.target.value !== '' && setShoppingStartEnd(e.target.value, i, j, 'end')}
                                                                            // onValueChange={(e) => setStructure({ ...createStructure, shopping_total_floors: e.target.value })}
                                                                            // className={classNames({ 'p-invalid': error && createStructure?.shopping_total_floors <= 0 })}
                                                                        />
                                                                    </div>
                                                                    {/* {y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start && <small className="p-invalid error">{'End no. should be greater then start no.'}</small>} */}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* <div className="grid p-fluid mt-3">
                                <div className="col-12 md:col-12 flex justify-content-end align-items-center">
                                    <Button
                                        label="Back"
                                        icon="pi pi-arrow-left"
                                        style={{ width: '6rem' }}
                                        className="p-button-outlined p-button-danger mr-2"
                                        onClick={() => {
                                            setCustomCreate([]);
                                            setShoppingCustomCreate([]);
                                            setIsCustomEdit(false);
                                            decode.is_ground_floor_exist_in_property === true && setStructure({ ...createStructure, total_floors: createStructure?.total_floors - 1 });
                                        }}
                                    />
                                    <Button label="Generate Structure" icon="pi pi-cog" style={{ width: '12rem' }} className="p-button-outlined p-button-success" onClick={() => generateStructure()} />
                                </div>
                            </div> */}
                                </>
                            )}
                            {isGenerated && (
                                <div className="flex align-items-center my-3">
                                    {/* <h3 className="mt-2">Property Structure</h3> */}
                                    {checkDeleteShow() && (
                                        <Button
                                            label="Delete"
                                            type="submit"
                                            icon="pi pi-times-circle"
                                            className="p-button-outlined p-button-danger h-2rem w-6rem ml-auto"
                                            tooltip="Delete Selected Property"
                                            tooltipOptions={{ position: 'bottom' }}
                                            onClick={() => setMultiDeleteOpen(true)}
                                        />
                                    )}
                                </div>
                            )}
                            {isGenerated && structureInfo.length > 0 && (
                                <div style={{ minWidth: '50rem', overflow: 'auto' }}>
                                    <table className="maintenanceSettings_table">
                                        <thead>
                                            <tr>
                                                {block !== null && <th className="maintenanceSettings_table_th">Block</th>}
                                                {floor !== null && <th className="maintenanceSettings_table_th">Floor</th>}
                                                <th className="maintenanceSettings_table_th">Property No.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {structureInfo &&
                                                structureInfo.map((x, i) =>
                                                    x?.floor_info.map((y, j) => (
                                                        <tr>
                                                            {j === 0 && block !== null && (
                                                                <td className="maintenanceSettings_table_td w-10rem" rowspan={x?.floor_info.length.toString()}>
                                                                    {x.block_name}
                                                                </td>
                                                            )}
                                                            {floor !== null && <td className="maintenanceSettings_table_td w-10rem">{y.floor_name}</td>}
                                                            <td className="maintenanceSettings_table_td">
                                                                <div className="flex flex-wrap gap-2 my-2 px-3">
                                                                    {y?.floor_property.map((z, k) => (
                                                                        <div
                                                                            onClick={() => {
                                                                                !z.isShow &&
                                                                                    setIsDeleteOpen({
                                                                                        i: i,
                                                                                        j: j,
                                                                                        k: k,
                                                                                        isShow: z.isShow,
                                                                                        isOpen: true
                                                                                    });
                                                                                z.isShow &&
                                                                                    setMultiData({
                                                                                        i: i,
                                                                                        j: j,
                                                                                        k: k,
                                                                                        isSelected: z.isSelected
                                                                                    });
                                                                            }}
                                                                            className={`border-round-sm ${z.isShow ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'surface-500'} ${
                                                                                z.isSelected ? 'error-bg text-50 text-white' : ''
                                                                            } h-2rem w-2rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                                            // style={{ backgroundColor: `${z.isSelected && 'red'}` }}
                                                                        >
                                                                            {z.isShow ? z.propertyNO : <del>{z.propertyNO}</del>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {isGenerated && decode?.is_shopping_center_exist_in_property === true && (
                                <Divider align="center" className=" pt-0">
                                    <span className="p-tag">Shopping Center structure</span>
                                </Divider>
                            )}
                            {isGenerated && decode?.is_shopping_center_exist_in_property === true && (
                                <div className="flex align-items-center my-3">
                                    {checkDeleteShopShow() && (
                                        <Button
                                            label="Delete"
                                            type="submit"
                                            icon="pi pi-times-circle"
                                            className="p-button-outlined p-button-danger h-2rem w-6rem ml-auto"
                                            tooltip="Delete Selected Property"
                                            tooltipOptions={{ position: 'bottom' }}
                                            onClick={() => setMultiShopsDeleteOpen(true)}
                                        />
                                    )}
                                </div>
                            )}
                            {isGenerated && shoppingStructureInfo.length > 0 && (
                                <div style={{ minWidth: '50rem', overflow: 'auto' }}>
                                    <table className="maintenanceSettings_table">
                                        <thead>
                                            <tr>
                                                {decode?.is_block_exist_in_shopping_center_property && <th className="maintenanceSettings_table_th">Block</th>}
                                                <th className="maintenanceSettings_table_th">Floor</th>
                                                <th className="maintenanceSettings_table_th">Property No.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shoppingStructureInfo &&
                                                shoppingStructureInfo.map((x, i) =>
                                                    x?.floor_info.map((y, j) => (
                                                        <tr>
                                                            {j === 0 && decode?.is_block_exist_in_shopping_center_property && (
                                                                <td className="maintenanceSettings_table_td w-10rem" rowspan={x?.floor_info.length.toString()}>
                                                                    {x.block_name}
                                                                </td>
                                                            )}
                                                            <td className="maintenanceSettings_table_td w-10rem">{y.floor_name}</td>
                                                            <td className="maintenanceSettings_table_td">
                                                                <div className="flex flex-wrap gap-2 my-2 px-3">
                                                                    {y?.floor_property.map((z, k) => (
                                                                        <div
                                                                            onClick={() => {
                                                                                !z.isShow &&
                                                                                    setIsShoppingDeleteOpen({
                                                                                        i: i,
                                                                                        j: j,
                                                                                        k: k,
                                                                                        isShow: z.isShow,
                                                                                        isOpen: true
                                                                                    });
                                                                                z.isShow &&
                                                                                    setMultiData(
                                                                                        {
                                                                                            i: i,
                                                                                            j: j,
                                                                                            k: k,
                                                                                            isSelected: z.isSelected
                                                                                        },
                                                                                        'shopping'
                                                                                    );
                                                                            }}
                                                                            className={`border-round-sm ${z.isShow ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'surface-500'} ${
                                                                                z.isSelected ? 'error-bg text-50 text-white' : ''
                                                                            } h-2rem w-2rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                                            // style={{ backgroundColor: `${z.isSelected && 'red'}` }}
                                                                        >
                                                                            {z.isShow ? z.propertyNO : <del>{z.propertyNO}</del>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {/* {isGenerated && structureInfo.length > 0 && (
                        <div className="">
                            {structureInfo.map((a, i) => (
                                <>
                                    {i > 0 && <Divider style={{ margin: '0.25rem 0' }} />}
                                    <div className=" flex align-items-center">
                                        {a.block_name !== '' && <div className="flex justify-content-center w-3rem font-semibold text-2xl flex align-items-center mr-4">{a.block_name}</div>}
                                        <div className=" w-[3rem] p-1rem">
                                            {a?.floorInfo?.map((x, j) => (
                                                <>
                                                    {j > 0 && <Divider style={{ margin: '5px 0' }} />}
                                                    <div className="flex flex-wrap gap-2 my-2">
                                                        {x?.map((y, k) => (
                                                            <div
                                                                onClick={() => {
                                                                    !y.isShow &&
                                                                        setIsDeleteOpen({
                                                                            i: i,
                                                                            j: j,
                                                                            k: k,
                                                                            isShow: y.isShow,
                                                                            isOpen: true
                                                                        });
                                                                    y.isShow &&
                                                                        setMultiData({
                                                                            i: i,
                                                                            j: j,
                                                                            k: k,
                                                                            isSelected: y.isSelected
                                                                        });
                                                                }}
                                                                className={`border-round-sm ${y.isShow ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'surface-500'} ${
                                                                    y.isSelected ? 'bg-primary text-50' : ''
                                                                } h-2rem w-2rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                            >
                                                                {y.isShow ? y.propertyNO : <del>{y.propertyNO}</del>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    )} */}
                            {/* {isGenerated && decode?.is_shopping_center_exist_in_property === true && (
                        <Divider align="center" className=" pt-0">
                            <span className="p-tag">Shopping Center structure</span>
                        </Divider>
                    )} */}

                            {/* {isGenerated && shoppingStructureInfo.length > 0 && (
                        <div className="">
                            {shoppingStructureInfo.map((a, i) => (
                                <>
                                    {i > 0 && <Divider style={{ margin: '0.25rem 0' }} />}
                                    <div className=" flex align-items-center">
                                        <div className="flex justify-content-center w-3rem font-semibold text-2xl flex align-items-center mr-4">{a.block_name}</div>
                                        <div className=" w-[3rem] p-1rem">
                                            {a?.floorInfo?.map((x, j) => (
                                                <>
                                                    {j > 0 && <Divider style={{ margin: '5px 0' }} />}
                                                    <div className="flex flex-wrap gap-2 my-2">
                                                        {x?.map((y, k) => (
                                                            <div
                                                                onClick={() => {
                                                                    !y.isShow &&
                                                                        setIsShoppingDeleteOpen({
                                                                            i: i,
                                                                            j: j,
                                                                            k: k,
                                                                            isShow: y.isShow,
                                                                            isOpen: true
                                                                        });
                                                                    y.isShow &&
                                                                        setMultiData(
                                                                            {
                                                                                i: i,
                                                                                j: j,
                                                                                k: k,
                                                                                isSelected: y.isSelected
                                                                            },
                                                                            'shopping'
                                                                        );
                                                                }}
                                                                className={`border-round-sm ${y.isShow ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'surface-500'} ${
                                                                    y.isSelected ? 'bg-primary text-50' : ''
                                                                } h-2rem w-2rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                            >
                                                                {y.isShow ? y.propertyNO : <del>{y.propertyNO}</del>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    )} */}
                        </>
                    )}
                </div>
                {isManual === false && <ExcelUpload decode={decode} onHide={() => onHide()} shoppingStructureViewDetail={shoppingStructureViewDetail} />}
            </Dialog>
            <DeleteModal
                isOpenDialog={isDeleteOpen.isOpen}
                hideModal={() =>
                    setIsDeleteOpen({
                        i: null,
                        j: null,
                        k: null,
                        isShow: null,
                        isOpen: null
                    })
                }
                modalFooter={deleteUserDialogFooter}
                modalDescription={'Are you sure you want to enable this property?'}
            />
            <DeleteModal
                isOpenDialog={isShoppingDeleteOpen.isOpen}
                hideModal={() =>
                    setIsShoppingDeleteOpen({
                        i: null,
                        j: null,
                        k: null,
                        isShow: null,
                        isOpen: null
                    })
                }
                modalFooter={deleteShoppingDialogFooter}
                modalDescription={'Are you sure you want to enable this property?'}
            />
            <DeleteModal isOpenDialog={multiDeleteOpen} modalFooter={() => deleteUserDialogFooter('multiDelete')} hideModal={() => setMultiDeleteOpen(false)} modalDescription={'Are you sure you want to delete selected property?'} />
            <DeleteModal isOpenDialog={multiShopsDeleteOpen} modalFooter={() => deleteShoppingDialogFooter('multiDelete')} hideModal={() => setMultiShopsDeleteOpen(false)} modalDescription={'Are you sure you want to delete selected property?'} />
        </>
    );
};
export default CreateBlockModel;
