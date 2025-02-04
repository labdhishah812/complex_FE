import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
// import Loader from '../../../../components/Loader';
import ExcelUpload from '../Block/excelUpload';
import toast from 'react-hot-toast';
import { createStructureRequest, createFloorStructureRequest, createShoppingStructureRequest, createShoppingFloorStructureRequest } from '../../../../redux/slice/AdminSlices/blockSlice';
import { alphabet } from '../Block/constant';

const CreateStructureModel = ({ onHide, shoppingStructureViewDetail, structureEditData }) => {
    const { InputText, DataTable, Column, Dropdown, InputNumber, React, Dialog, Button, Divider, RadioButton, classNames, useState, useSelector, useEffect, useDispatch } = components;
    const dispatch = useDispatch();
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { isShopsCreated, isLoading } = useSelector((store) => store.block);
    const [isManual, setIsManual] = useState(null);
    const [isCustomEdit, setIsCustomEdit] = useState(false);
    const [error, setError] = useState(false);
    const [multiDeleteOpen, setMultiDeleteOpen] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isSqFtArea, setSqFtArea] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [multiShopsDeleteOpen, setMultiShopsDeleteOpen] = useState(false);
    const [customCreate, setCustomCreate] = useState([]);
    const [shoppingCustomCreate, setShoppingCustomCreate] = useState([]);
    const [structureInfo, setStructureInfo] = useState([]);
    const [shoppingStructureInfo, setShoppingStructureInfo] = useState([]);
    const [sqFeetArea, setSqFeetArea] = useState([]);
    const [sqFeetShoppingArea, setSqFeetShoppingArea] = useState([]);
    const [createStructure, setStructure] = useState({
        total_blocks: 0,
        select_naming_formate: '',
        total_floors: 0,
        total_properties: 0,
        shopping_total_block: 0,
        shopping_total_floors: 0,
        shopping_total_properties: 0
    });
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
    useEffect(() => {
        let setState = {
            total_blocks: 0,
            select_naming_formate: '',
            total_floors: 0,
            total_properties: 0,
            shopping_total_block: 0,
            shopping_total_floors: 0,
            shopping_total_properties: 0
        };
        if (loginDetails?.is_block_exist_in_property === undefined) setState.total_blocks = 1;
        if (loginDetails?.is_floor_exist_in_property === undefined) setState.total_floors = 1;
        if (loginDetails?.is_block_exist_in_property === undefined && (loginDetails?.is_floor_exist_in_property || loginDetails?.is_house_exist_in_property)) setState.select_naming_formate = 'xyz';
        if (loginDetails?.is_block_exist_in_shopping_center_property === undefined) setState.shopping_total_block = 1;

        setStructure(setState);
    }, []);
    useEffect(() => {
        if (structureEditData) {
            let setState = {
                total_blocks: 0,
                select_naming_formate: '',
                total_floors: 0,
                total_properties: 0,
                shopping_total_block: 0,
                shopping_total_floors: 0,
                shopping_total_properties: 0
            };
            setState.select_naming_formate = structureEditData.select_naming_formate;
            setState.total_blocks = structureEditData.total_blocks;
            setState.total_floors = structureEditData.total_floors;
            setState.shopping_total_block = structureEditData.shopping_total_block;
            setState.shopping_total_floors = structureEditData.shopping_total_floors;
            setStructure(setState);
            setIsManual(true);
            loginDetails && loginDetails?.is_block_exist_in_property === undefined && loginDetails?.is_floor_exist_in_property === undefined && loginDetails?.is_house_exist_in_property && nextForm();
        }
    }, [structureEditData]);
    // useEffect(() => {
    //     // if (loginDetails && loginDetails?.is_block_exist_in_property === undefined && loginDetails?.is_floor_exist_in_property === undefined && loginDetails?.is_house_exist_in_property) {
    //     //     nextForm();
    //     // }
    // }, [loginDetails]);
    const setCardinalNumber = (val) => {
        try {
            const suffixes = ['th', 'st', 'nd', 'rd'];
            const suffix = val % 100 >= 11 && val % 100 <= 13 ? 'th' : suffixes[val % 10] || 'th';
            return val + suffix;
        } catch (error) {
            console.log(error);
        }
    };
    const nextForm = () => {
        try {
            if (createStructure?.total_blocks > 0 && createStructure?.select_naming_formate !== '' && createStructure?.total_floors > 0) {
                if (loginDetails?.is_shopping_center_exist_in_property === true && (createStructure?.shopping_total_block <= 0 || createStructure?.shopping_total_floors <= 0)) {
                    setError(true);
                } else {
                    let customCreateArray = [];
                    let shoppingCustomCreateArray = [];
                    if (loginDetails.is_ground_floor_exist_in_property === true) {
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
                            if (customCreate.find((x) => x.block_name === block_info.block_name)) {
                                let binfo = customCreate.find((x) => x.block_name === block_info.block_name).floorInfo;
                                let collectAllredy = binfo.find(
                                    (a) =>
                                        a.floor_name ===
                                        (loginDetails.is_ground_floor_exist_in_property === true && j === 0
                                            ? `Ground Floor`
                                            : loginDetails.is_ground_floor_exist_in_property === true
                                            ? `${setCardinalNumber(j)} Floor`
                                            : `${setCardinalNumber(j + 1)} Floor`)
                                );
                                block_info.floorInfo.push({
                                    floor_name: collectAllredy
                                        ? collectAllredy?.floor_name
                                        : loginDetails.is_ground_floor_exist_in_property === true && j === 0
                                        ? `Ground Floor`
                                        : loginDetails.is_ground_floor_exist_in_property === true
                                        ? `${setCardinalNumber(j)} Floor`
                                        : `${setCardinalNumber(j + 1)} Floor`,
                                    floor_start: collectAllredy ? collectAllredy?.floor_start : null,
                                    floor_end: collectAllredy ? collectAllredy?.floor_end : null,
                                    est_sq_ft_area: collectAllredy ? collectAllredy?.est_sq_ft_area : null
                                });
                            } else {
                                let colloectFloor = null;
                                let maxCount = 0;
                                let mostFrequentArea = null;
                                if (structureEditData?.mainProperty) {
                                    const frequency = {};
                                    let editData = structureEditData?.mainProperty;
                                    let blockEditeData = editData.filter((x) => x?.block_id?.block_name === block_info.block_name);
                                    let floorName =
                                        loginDetails.is_ground_floor_exist_in_property === true && j === 0 ? `Ground Floor` : loginDetails.is_ground_floor_exist_in_property === true ? `${setCardinalNumber(j)}` : `${setCardinalNumber(j + 1)}`;
                                    colloectFloor =
                                        loginDetails?.is_block_exist_in_property && loginDetails?.is_floor_exist_in_property
                                            ? blockEditeData.filter((x) => x.floor_id.floor_name === floorName)
                                            : loginDetails?.is_block_exist_in_property && loginDetails?.is_floor_exist_in_property === undefined
                                            ? blockEditeData
                                            : loginDetails?.is_house_exist_in_property && loginDetails?.is_block_exist_in_property === undefined
                                            ? editData
                                            : editData.filter((x) => x.floor_id.floor_name === floorName);
                                    colloectFloor.forEach((property) => {
                                        const area = property.property_sq_feet_area;
                                        if (frequency[area]) {
                                            frequency[area]++;
                                        } else {
                                            frequency[area] = 1;
                                        }
                                    });

                                    for (const area in frequency) {
                                        if (frequency[area] > maxCount) {
                                            maxCount = frequency[area];
                                            mostFrequentArea = area;
                                        }
                                    }
                                }
                                block_info.floorInfo.push({
                                    floor_name:
                                        loginDetails.is_ground_floor_exist_in_property === true && j === 0
                                            ? `Ground Floor`
                                            : loginDetails.is_ground_floor_exist_in_property === true
                                            ? `${setCardinalNumber(j)} Floor`
                                            : `${setCardinalNumber(j + 1)} Floor`,
                                    floor_start: colloectFloor ? (colloectFloor[0]?.property_number.split('-').length > 1 ? parseInt(colloectFloor[0]?.property_number.split('-')[1]) : parseInt(colloectFloor[0]?.property_number)) : null,
                                    floor_end: colloectFloor
                                        ? colloectFloor[colloectFloor.length - 1]?.property_number.split('-').length > 1
                                            ? parseInt(colloectFloor[colloectFloor.length - 1]?.property_number.split('-')[1])
                                            : parseInt(colloectFloor[colloectFloor.length - 1]?.property_number)
                                        : null,
                                    est_sq_ft_area: colloectFloor ? (mostFrequentArea ? parseFloat(mostFrequentArea) : null) : null
                                });
                            }
                        }
                        customCreateArray.push(block_info);
                    }
                    if (loginDetails?.is_shopping_center_exist_in_property === true) {
                        for (let i = 0; i < createStructure?.shopping_total_block; i++) {
                            let shopping_block_info = {
                                block_name: '',
                                floorInfo: []
                            };
                            if (createStructure?.select_naming_formate === 'A' && loginDetails?.is_block_exist_in_shopping_center_property && loginDetails?.is_block_exist_in_shopping_center_property === true) {
                                shopping_block_info.block_name = alphabet[i + 1];
                            } else if (createStructure?.select_naming_formate === 'A1' && loginDetails?.is_block_exist_in_shopping_center_property && loginDetails?.is_block_exist_in_shopping_center_property === true) {
                                shopping_block_info.block_name = 'A' + (i + 1);
                            } else if (createStructure?.select_naming_formate === '1' && loginDetails?.is_block_exist_in_shopping_center_property && loginDetails?.is_block_exist_in_shopping_center_property === true) {
                                shopping_block_info.block_name = (i + 1).toString();
                            } else {
                                shopping_block_info.block_name = '';
                            }
                            for (let j = 0; j < createStructure?.shopping_total_floors; j++) {
                                if (shoppingCustomCreate.find((x) => x.block_name === shopping_block_info.block_name)) {
                                    let binfo = shoppingCustomCreate.find((x) => x.block_name === shopping_block_info.block_name).floorInfo;
                                    let collectAllredy = binfo.find((a) => a.floor_name === (j === 0 ? `Ground Floor` : `${setCardinalNumber(j)} Floor`));
                                    shopping_block_info.floorInfo.push({
                                        floor_name: collectAllredy ? collectAllredy?.floor_name : j === 0 ? `Ground Floor` : `${setCardinalNumber(j)} Floor`,
                                        floor_start: collectAllredy ? collectAllredy?.floor_start : null,
                                        floor_end: collectAllredy ? collectAllredy?.floor_end : null,
                                        est_sq_ft_area: collectAllredy ? collectAllredy?.est_sq_ft_area : null
                                    });
                                } else {
                                    let colloectFloor = null;
                                    let maxCount = 0;
                                    let mostFrequentArea = null;
                                    if (structureEditData?.mainProperty) {
                                        const frequency = {};
                                        let editData = structureEditData?.shoppingproperty;
                                        let blockEditeData = editData.filter((x) => x?.block_id?.block_name === shopping_block_info.block_name);
                                        let floorName = j === 0 ? `Ground Floor` : `${setCardinalNumber(j)}`;
                                        colloectFloor = loginDetails?.is_block_exist_in_shopping_center_property ? blockEditeData.filter((x) => x.floor_id.floor_name === floorName) : editData.filter((x) => x.floor_id.floor_name === floorName);

                                        colloectFloor.forEach((property) => {
                                            const area = property.property_sq_feet_area;
                                            if (frequency[area]) {
                                                frequency[area]++;
                                            } else {
                                                frequency[area] = 1;
                                            }
                                        });

                                        for (const area in frequency) {
                                            if (frequency[area] > maxCount) {
                                                maxCount = frequency[area];
                                                mostFrequentArea = area;
                                            }
                                        }
                                    }
                                    shopping_block_info.floorInfo.push({
                                        floor_name: j === 0 ? `Ground Floor` : `${setCardinalNumber(j)} Floor`,
                                        floor_start: colloectFloor ? (colloectFloor[0]?.property_number.split('-').length > 1 ? parseInt(colloectFloor[0]?.property_number.split('-')[1]) : parseInt(colloectFloor[0]?.property_number)) : null,
                                        floor_end: colloectFloor
                                            ? colloectFloor[colloectFloor.length - 1]?.property_number.split('-').length > 1
                                                ? parseInt(colloectFloor[colloectFloor.length - 1]?.property_number.split('-')[1])
                                                : parseInt(colloectFloor[colloectFloor.length - 1]?.property_number)
                                            : null,
                                        est_sq_ft_area: colloectFloor ? (mostFrequentArea ? parseFloat(mostFrequentArea) : null) : null
                                    });
                                }
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
    const setPropertyStartEnd = (val, block, floor, name) => {
        try {
            let array = [...customCreate];
            val = val === '' ? null : parseInt(val);
            // if(val === )
            // if (val === null) val = 1;
            if (val < 1 && val !== null) val = 1;
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
    const setPropertySqFtArea = (val, block, floor) => {
        try {
            let array = [...customCreate];
            array[block].floorInfo[floor].est_sq_ft_area = val;
            setCustomCreate(array);
        } catch (error) {
            console.log(error);
        }
    };
    const setPropertyOrignalSqFtArea = (val, i, j, k) => {
        try {
            let array = [...structureInfo];
            let array2 = [...sqFeetArea];
            const index = array2.findIndex((item) => item.block_index === i && item.floor_index === j && item.property_index === k);
            array[i].floor_info[j].floor_property[k].est_sq_ft_area = val;
            array2[index].est_sq_ft_area = val;
            setStructureInfo(array);
            setSqFeetArea(array2);
        } catch (error) {
            console.log(error);
        }
    };
    const setShoppingOrignalSqFtArea = (val, i, j, k) => {
        try {
            let array = [...shoppingStructureInfo];
            let array2 = [...sqFeetShoppingArea];
            const index = array2.findIndex((item) => item.block_index === i && item.floor_index === j && item.property_index === k);
            array[i].floor_info[j].floor_property[k].est_sq_ft_area = val;
            array2[index].est_sq_ft_area = val;
            setShoppingStructureInfo(array);
            setSqFeetShoppingArea(array2);
        } catch (error) {
            console.log(error);
        }
    };
    const setPropertySqFtAreaShopping = (val, block, floor) => {
        try {
            let array = [...shoppingCustomCreate];
            array[block].floorInfo[floor].est_sq_ft_area = val;
            setShoppingCustomCreate(array);
        } catch (error) {
            console.log(error);
        }
    };
    const setShoppingStartEnd = (val, block, floor, name) => {
        try {
            let array = [...shoppingCustomCreate];
            val = val === '' ? null : parseInt(val);
            // if(val === )
            // if (val === null) val = 1;
            if (val < 1 && val !== null) val = 1;
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
    const generateStructure = () => {
        try {
            let array = [...customCreate];
            let array2 = [...shoppingCustomCreate];
            let collectErrorData = [];
            let collectErrorData2 = [];
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
            const checkSqFtArea = array.filter((item) => {
                return item.floorInfo.some((floor) => {
                    return floor.est_sq_ft_area === null;
                });
            });
            const checkSqFtArea2 = array2.filter((item) => {
                return item.floorInfo.some((floor) => {
                    return floor.est_sq_ft_area === null;
                });
            });
            array.forEach((x, i) => {
                x.floorInfo.forEach((y, j) => {
                    if (j > 0) {
                        let collect = x.floorInfo[j - 1];
                        let check = y.floor_start <= collect?.floor_end;
                        if (check) collectErrorData.push(y);
                    }
                });
            });
            array2.forEach((x, i) => {
                x.floorInfo.forEach((y, j) => {
                    if (j > 0) {
                        let collect = x.floorInfo[j - 1];
                        let check = y.floor_start <= collect?.floor_end;
                        if (check) collectErrorData2.push(y);
                    }
                });
            });

            if (checkNullData.length > 0 || checkNullData2.length > 0) {
                toast.error('Property No. is required.', {
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
            } else if (checkSqFtArea.length > 0 || checkSqFtArea2.length > 0) {
                toast.error('Estimated SQ FT. Area is required.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            } else if (collectErrorData.length > 0 || collectErrorData2.length > 0) {
                toast.error('Some where the start no. is less than or equal to the end no. of the previous floor.', {
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
                            floor.floor_property.push({ propertyNO: a, isShow: true, isSelected: false, est_sq_ft_area: y.est_sq_ft_area });
                        }
                        block_info.floor_info.push(floor);
                    });
                    structureArray.push(block_info);
                });
                if (loginDetails?.is_shopping_center_exist_in_property === true) {
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
                                floor.floor_property.push({ propertyNO: a, isShow: true, isSelected: false, est_sq_ft_area: y.est_sq_ft_area });
                            }
                            shopping_block_info.floor_info.push(floor);
                        });
                        shoppingStructureArray.push(shopping_block_info);
                    });
                }
                let sqFeetTable = [];
                let sqFeetShoppingTable = [];
                structureArray.forEach((x, i) => {
                    x.floor_info.forEach((y, j) => {
                        y.floor_property.forEach((z, k) => {
                            let data = {
                                block_name: x.block_name,
                                block_index: i,
                                floor_name: y.floor_name,
                                floor_index: j,
                                est_sq_ft_area: z.est_sq_ft_area,
                                isSelected: z.isSelected,
                                isShow: z.isShow,
                                propertyNO: z.propertyNO,
                                property_index: k
                            };
                            sqFeetTable.push(data);
                        });
                    });
                });
                shoppingStructureArray.forEach((x, i) => {
                    x.floor_info.forEach((y, j) => {
                        y.floor_property.forEach((z, k) => {
                            let data = {
                                block_name: x.block_name,
                                block_index: i,
                                floor_name: y.floor_name,
                                floor_index: j,
                                est_sq_ft_area: z.est_sq_ft_area,
                                isSelected: z.isSelected,
                                isShow: z.isShow,
                                propertyNO: z.propertyNO,
                                property_index: k
                            };
                            sqFeetShoppingTable.push(data);
                        });
                    });
                });
                setSqFeetArea(sqFeetTable);
                setSqFeetShoppingArea(sqFeetShoppingTable);
                setStructureInfo(structureArray);
                setShoppingStructureInfo(shoppingStructureArray);
                structureArray.length > 0 && setSqFtArea(true);
                // structureArray.length > 0 && setIsGenerated(true);
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
    const setMultiData = (val, name) => {
        try {
            if (name !== 'shopping') {
                structureInfo[val.i].floor_info[val.j].floor_property[val.k].isSelected = !val.isSelected;
                const index = sqFeetArea.findIndex((item) => item.block_index === val.i && item.floor_index === val.j && item.property_index === val.k);
                sqFeetArea[index].isSelected = !val.isSelected;
                setStructureInfo([...structureInfo]);
                setSqFeetArea([...sqFeetArea]);
            } else {
                shoppingStructureInfo[val.i].floor_info[val.j].floor_property[val.k].isSelected = !val.isSelected;
                const index = sqFeetShoppingArea.findIndex((item) => item.block_index === val.i && item.floor_index === val.j && item.property_index === val.k);
                sqFeetShoppingArea[index].isSelected = !val.isSelected;
                setShoppingStructureInfo([...shoppingStructureInfo]);
                setSqFeetShoppingArea([...sqFeetShoppingArea]);
            }
        } catch (error) {
            console.log(error);
        }
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
                sqFeetArea.forEach((x) => {
                    if (x.isSelected) {
                        x.isSelected = false;
                        x.isShow = false;
                    }
                });
                setStructureInfo(structureInfo);
                setSqFeetArea(sqFeetArea);
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
                sqFeetShoppingArea.forEach((x) => {
                    if (x.isSelected) {
                        x.isSelected = false;
                        x.isShow = false;
                    }
                });
                setShoppingStructureInfo(shoppingStructureInfo);
                setSqFeetShoppingArea(sqFeetShoppingArea);
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
                let data2 = { ...sqFeetArea };
                data[isDeleteOpen.i].floor_info[isDeleteOpen.j].floor_property[isDeleteOpen.k].isShow = !isDeleteOpen.isShow;
                let index = data2.findIndex((item) => item.block_index === isDeleteOpen.i && item.floor_index === isDeleteOpen.j && item.property_index === isDeleteOpen.k);
                data2[index].isShow = !isDeleteOpen.isShow;
                setIsDeleteOpen({
                    i: null,
                    j: null,
                    k: null,
                    isShow: null,
                    isOpen: null
                });
            } else {
                let data = { ...shoppingStructureInfo };
                let data2 = { ...sqFeetShoppingArea };
                data[isShoppingDeleteOpen.i].floor_info[isShoppingDeleteOpen.j].floor_property[isShoppingDeleteOpen.k].isShow = !isShoppingDeleteOpen.isShow;
                let index = data2.findIndex((item) => item.block_index === isShoppingDeleteOpen.i && item.floor_index === isShoppingDeleteOpen.j && item.property_index === isShoppingDeleteOpen.k);
                data2[index].isShow = !isDeleteOpen.isShow;
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
    const submitData = async () => {
        try {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
            let sendData = {
                property_structure_details: []
            };
            if (loginDetails?.is_block_exist_in_property) sendData.is_block_exist_in_property = true;
            if (loginDetails?.is_floor_exist_in_property) sendData.is_floor_exist_in_property = true;
            if (loginDetails?.is_house_exist_in_property) sendData.is_house_exist_in_property = true;
            if (loginDetails.is_ground_floor_exist_in_property === true) sendData.is_ground_floor_exist_in_property = true;
            if (loginDetails?.is_block_exist_in_property === true && loginDetails?.is_floor_exist_in_property === true) {
                sendData.property_structure_details = generalDataCreate();
            } else if (loginDetails?.is_block_exist_in_property === true && loginDetails?.is_house_exist_in_property === true) {
                sendData.property_structure_details = generalDataCreateForBH();
            } else if (loginDetails?.is_block_exist_in_property === undefined && loginDetails?.is_floor_exist_in_property === true && loginDetails?.is_house_exist_in_property === undefined) {
                sendData = generalDataCreateOnlyFloor();
            } else if (loginDetails?.is_block_exist_in_property === undefined && loginDetails?.is_floor_exist_in_property === undefined && loginDetails?.is_house_exist_in_property === true) {
                sendData = generalDataCreateOnlyHouse();
            }
            if (loginDetails?.is_shopping_center_exist_in_property === true) {
                let shoppingSentData = {
                    is_shopping_center_exist_in_property: true,
                    property_structure_details: []
                };
                if (loginDetails?.is_block_exist_in_shopping_center_property && loginDetails?.is_block_exist_in_shopping_center_property === true) shoppingSentData.is_block_exist_in_shopping_center_property = true;
                if (loginDetails?.is_floor_exist_in_shopping_center_property === true) shoppingSentData.is_floor_exist_in_shopping_center_property = true;
                if (loginDetails?.is_block_exist_in_shopping_center_property && loginDetails?.is_block_exist_in_shopping_center_property === true && loginDetails?.is_floor_exist_in_shopping_center_property === true) {
                    shoppingSentData.property_structure_details = generalShoppingDataCreate();
                    shoppingSentData.property_structure_details.length > 0 && dispatch(createShoppingStructureRequest(shoppingSentData));
                } else if (loginDetails?.is_floor_exist_in_shopping_center_property === true) {
                    shoppingSentData = generalShoppingFloorDataCreate();
                    shoppingSentData.property_structure_details.length > 0 && dispatch(createShoppingFloorStructureRequest(shoppingSentData));
                }
            }
            if (loginDetails?.is_shopping_center_exist_in_property !== true) {
                if (
                    ((loginDetails?.is_block_exist_in_property !== null && (loginDetails?.is_floor_exist_in_property !== null || loginDetails?.is_house_exist_in_property !== null)) ||
                        (loginDetails?.is_block_exist_in_property === null && loginDetails?.is_floor_exist_in_property === null && loginDetails?.is_house_exist_in_property !== null)) &&
                    sendData.property_structure_details.length > 0
                )
                    dispatch(createStructureRequest(sendData));
                else if (loginDetails?.is_block_exist_in_property === null && loginDetails?.is_floor_exist_in_property !== null && loginDetails?.is_house_exist_in_property === null) dispatch(createFloorStructureRequest(sendData));
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (isShopsCreated && loginDetails && loginDetails.is_shopping_center_exist_in_property === true) {
            let sendData = {
                property_structure_details: []
            };
            if (loginDetails?.is_block_exist_in_property) sendData.is_block_exist_in_property = true;
            if (loginDetails?.is_floor_exist_in_property) sendData.is_floor_exist_in_property = true;
            if (loginDetails?.is_house_exist_in_property) sendData.is_house_exist_in_property = true;
            if (loginDetails.is_ground_floor_exist_in_property === true) sendData.is_ground_floor_exist_in_property = true;

            if (loginDetails?.is_block_exist_in_property && loginDetails?.is_floor_exist_in_property) {
                sendData.property_structure_details = generalDataCreate();
            } else if (loginDetails?.is_block_exist_in_property && loginDetails?.is_house_exist_in_property) {
                sendData.property_structure_details = generalDataCreateForBH();
            } else if (loginDetails?.is_block_exist_in_property === undefined && loginDetails?.is_floor_exist_in_property !== undefined && loginDetails?.is_house_exist_in_property === undefined) {
                sendData = generalDataCreateOnlyFloor();
            } else if (loginDetails?.is_block_exist_in_property === undefined && loginDetails?.is_floor_exist_in_property === undefined && loginDetails?.is_house_exist_in_property) {
                sendData = generalDataCreateOnlyHouse();
            }
            if (
                ((loginDetails?.is_block_exist_in_property && (loginDetails?.is_floor_exist_in_property || loginDetails?.is_house_exist_in_property)) ||
                    (loginDetails?.is_block_exist_in_property === undefined && loginDetails?.is_floor_exist_in_property === undefined && loginDetails?.is_house_exist_in_property)) &&
                sendData.property_structure_details.length > 0
            )
                dispatch(createStructureRequest(sendData));
            else if (loginDetails?.is_block_exist_in_property === undefined && loginDetails?.is_floor_exist_in_property && loginDetails?.is_house_exist_in_property === undefined) dispatch(createFloorStructureRequest(sendData));
        }
    }, [isShopsCreated]);
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
                            let createData = {
                                property_number: `${x.block_name}${x.block_name && x.block_name !== '' ? '-' : ''}${z.propertyNO}`,
                                property_sq_feet_area: z.est_sq_ft_area
                            };
                            if (structureEditData?.mainProperty) {
                                let editData = structureEditData?.mainProperty;
                                let proNo = `${x.block_name}${x.block_name && x.block_name !== '' ? '-' : ''}${z.propertyNO}`;
                                let find = editData.find((x) => x.property_number === proNo);
                                if (find) {
                                    block_info.block_id = find.block_id._id;
                                    floor_info.floor_id = find.floor_id._id;
                                    createData._id = find._id;
                                }
                            }
                            floor_info.floor_wise_property_details.push(createData);
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
                            let createData = {
                                property_number: `${x.block_name}${x.block_name && x.block_name !== '' ? '-' : ''}${z.propertyNO}`,
                                property_sq_feet_area: z.est_sq_ft_area
                            };
                            if (structureEditData?.mainProperty) {
                                let editData = structureEditData?.mainProperty;
                                let proNo = `${x.block_name}${x.block_name && x.block_name !== '' ? '-' : ''}${z.propertyNO}`;
                                let find = editData.find((x) => x.property_number === proNo);
                                if (find) {
                                    block_info.block_id = find.block_id._id;
                                    // floor_info.floor_id = find.floor_id._id;
                                    createData._id = find._id;
                                }
                            }
                            block_info.total_houses = block_info.total_houses + 1;
                            block_info.house_details.push(createData);
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
                        floor_wise_total_property: y.floor_property.filter((a) => a.isShow === true).length,
                        floor_wise_property_details: []
                    };
                    y.floor_property.forEach((z) => {
                        if (z.isShow === true) {
                            let createData = {
                                property_number: z.propertyNO.toString(),
                                property_sq_feet_area: z.est_sq_ft_area
                            };
                            if (structureEditData?.mainProperty) {
                                let editData = structureEditData?.mainProperty;
                                let proNo = z.propertyNO.toString();
                                let find = editData.find((x) => x.property_number === proNo);
                                if (find) {
                                    // block_info.block_id = find.block_id._id;
                                    floor_info.floor_id = find.floor_id._id;
                                    createData._id = find._id;
                                }
                            }
                            floor_info.floor_wise_property_details.push(createData);
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
                        let createData = {
                            property_number: z.propertyNO.toString(),
                            property_sq_feet_area: z.est_sq_ft_area
                        };
                        if (structureEditData?.mainProperty) {
                            let editData = structureEditData?.mainProperty;
                            let proNo = z.propertyNO.toString();
                            let find = editData.find((x) => x.property_number === proNo);
                            if (find) {
                                createData._id = find._id;
                            }
                        }
                        house_info.house_details.push(createData);
                    }
                });
                sendData.property_structure_details.push(house_info);
            });
        });
        return sendData;
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
                        floor_wise_total_property: y.floor_property.filter((a) => a.isShow === true).length,
                        floor_wise_property_details: []
                    };
                    y.floor_property.forEach((z) => {
                        if (z.isShow === true) {
                            let createData = {
                                property_number: `${x.block_name}${x.block_name && x.block_name !== '' ? '-' : ''}${z.propertyNO}`,
                                property_sq_feet_area: z.est_sq_ft_area
                            };
                            if (structureEditData?.shoppingproperty) {
                                let editData = structureEditData?.shoppingproperty;
                                let proNo = `${x.block_name}${x.block_name && x.block_name !== '' ? '-' : ''}${z.propertyNO}`;
                                let find = editData.find((x) => x.property_number === proNo);
                                if (find) {
                                    block_info.block_id = find.block_id._id;
                                    floor_info.floor_id = find.floor_id._id;
                                    createData._id = find._id;
                                }
                            }
                            floor_info.floor_wise_property_details.push(createData);
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
                        floor_wise_total_property: y.floor_property.filter((a) => a.isShow === true).length,
                        floor_wise_property_details: []
                    };
                    y.floor_property.forEach((z) => {
                        if (z.isShow === true) {
                            let createData = {
                                property_number: z.propertyNO.toString(),
                                property_sq_feet_area: z.est_sq_ft_area
                            };
                            if (structureEditData?.shoppingproperty) {
                                let editData = structureEditData?.shoppingproperty;
                                let proNo = `${x.block_name}${x.block_name && x.block_name !== '' ? '-' : ''}${z.propertyNO}`;
                                let find = editData.find((x) => x.property_number === proNo);
                                if (find) {
                                    floor_info.floor_id = find.floor_id._id;
                                    createData._id = find._id;
                                }
                            }
                            floor_info.floor_wise_property_details.push(createData);
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
    // console.log(shoppingStructureInfo, "structureInfo");
    const collectRowspan = (val) => {
        try {
            let totalLength = 0;
            val.floor_info.forEach((floor) => {
                totalLength += floor.floor_property.length;
            });
            return totalLength;
        } catch (error) {
            console.log(error);
        }
    };
    const letCheckPrvVal = (curntVal, curentIndex, data) => {
        try {
            let flag = false;
            if (curentIndex > 0 && curntVal) {
                let collect = data.floorInfo[curentIndex - 1];
                let check = curntVal <= collect?.floor_end;
                if (check) flag = true;
            }
            return flag;
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="">
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
                                    loginDetails && loginDetails?.is_block_exist_in_property === undefined && loginDetails?.is_floor_exist_in_property === undefined && loginDetails?.is_house_exist_in_property && nextForm();
                                    // decodeURI();
                                    // handleReset();
                                }}
                                checked={isManual === true}
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
                                checked={isManual === false}
                            />
                            <label htmlFor="isManual2" className="ml-2">
                                By Uploading Excel
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            {isManual === true && (
                <>
                    {isCustomEdit === false && (
                        <>
                            {loginDetails?.is_block_exist_in_property && loginDetails?.is_block_exist_in_property !== null && (
                                <div className="grid p-fluid mt-1">
                                    <div className="field col-12 md:col-6 mb-1">
                                        <label htmlFor="total_blocks" className="required">
                                            Please enter your total blocks
                                        </label>
                                        <InputText
                                            id="total_blocks"
                                            placeholder="Enter your total blocks"
                                            value={createStructure?.total_blocks || ''} // Ensure it's an empty string if no value
                                            maxLength={2} // Allow up to 2 characters
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only allow numeric input and ensure it's less than or equal to 99
                                                if (/^\d*$/.test(value) && parseInt(value, 10) <= 99) {
                                                    setStructure({ ...createStructure, total_blocks: value });
                                                }
                                            }}
                                            className={classNames({
                                                'p-invalid': error && (createStructure?.total_blocks <= 0 || createStructure?.total_blocks > 99)
                                            })}
                                        />
                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                            {error && createStructure?.total_blocks <= 0 ? 'Please enter your total blocks greater than 0' : error && createStructure?.total_blocks > 99 ? 'Please enter your total blocks less than or equal to 99' : ''}
                                        </div>
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
                                            value={createStructure?.select_naming_formate}
                                            onChange={(e) => setStructure({ ...createStructure, select_naming_formate: e.target.value })}
                                            className={classNames({
                                                'p-invalid': error && createStructure?.select_naming_formate === ''
                                            })}
                                        />
                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                            {error && createStructure?.select_naming_formate === '' ? 'Please select block naming format' : ''}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid p-fluid mt-1">
                                {loginDetails?.is_floor_exist_in_property && loginDetails?.is_floor_exist_in_property !== null && (
                                    <div className="field col-12 md:col-6 mb-1">
                                        <label htmlFor="total_floors" className="required">
                                            Please enter your total floors
                                        </label>
                                        <InputNumber
                                            inputId="total_floors"
                                            placeholder="Enter your total floors"
                                            value={createStructure?.total_floors}
                                            maxLength={2}
                                            onValueChange={(e) => setStructure({ ...createStructure, total_floors: e.target.value })}
                                            className={classNames({ 'p-invalid': error && createStructure?.total_floors <= 0 })}
                                        />
                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                            {error && createStructure?.total_floors <= 0 ? 'Please enter your total floor greater than 0' : ''}
                                        </div>

                                        {/* {error && createStructure?.total_floors <= 0 ? <small className="p-invalid error">{'Please enter your total floor greater than 0'}</small> : null} */}
                                    </div>
                                    // <div className="field col-12 md:col-6 mb-1">
                                    //     <label htmlFor="total_floors" className="required">
                                    //         Please enter your total floors
                                    //     </label>
                                    //     <InputText
                                    //         id="total_floors"
                                    //         placeholder="Enter your total floors"
                                    //         value={createStructure?.total_floors || ''} // Ensure it's an empty string if no value
                                    //         maxLength={2} // Allow up to 2 characters
                                    //         onChange={(e) => {
                                    //             const value = e.target.value;
                                    //             // Only allow numeric input
                                    //             if (/^\d*$/.test(value)) {
                                    //                 setStructure({ ...createStructure, total_floors: value });
                                    //             }
                                    //         }}
                                    //         className={classNames({
                                    //             'p-invalid': error && (createStructure?.total_floors <= 0 || !createStructure?.total_floors)
                                    //         })}
                                    //     />
                                    //     <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                    //         {error && (!createStructure?.total_floors || createStructure?.total_floors <= 0) ? 'Please enter your total floors greater than 0' : ''}
                                    //     </div>
                                    // </div>
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
                            {loginDetails?.is_shopping_center_exist_in_property === true && (
                                <Divider align="center" className=" pt-0">
                                    <span className="p-tag">Shopping Center Details</span>
                                </Divider>
                            )}
                            {loginDetails?.is_shopping_center_exist_in_property === true && (
                                <div className="grid p-fluid mt-1">
                                    {loginDetails?.is_block_exist_in_shopping_center_property && loginDetails?.is_block_exist_in_shopping_center_property === true && (
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
                                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                                {error && createStructure?.shopping_total_block <= 0 ? 'Please enter your shopping total blocks greater than 0' : ''}
                                            </div>
                                            {/* {error && createStructure?.shopping_total_block <= 0 ? <small className="p-invalid error">{'Please enter your shopping total blocks greater than 0'}</small> : null} */}
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
                                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                            {error && createStructure?.shopping_total_floors <= 0 ? 'Please enter your shopping total floor greater than 0' : ''}
                                        </div>
                                        {/* {error && createStructure?.shopping_total_floors <= 0 ? <small className="p-invalid error">{'Please enter your shopping total floor greater than 0'}</small> : null} */}
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
                                    {/* <button
                                        onClick={() => nextForm()}
                                        style={{
                                            border: '2px solid #77A84B',
                                            backgroundColor: 'transparent',
                                            color: '#77A84B',
                                            padding: '0.5rem 1.5rem',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <span>Next</span>
                                        <i
                                            className="pi pi-arrow-right"
                                            style={{
                                                marginLeft: '0.5rem',
                                                fontSize: '1.1rem'
                                            }}
                                        ></i>
                                    </button> */}
                                    <Button
                                        // label="Generate Structure"
                                        label="Next"
                                        // icon="pi pi-arrow-right"
                                        iconPos="right"
                                        style={{ width: '6rem' }}
                                        className="p-button-outlined p-button-success"
                                        onClick={() => nextForm()}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {isCustomEdit && !isSqFtArea && !isGenerated && customCreate.length > 0 && (
                        <>
                            <div className="py-2" style={{ minWidth: '50rem', overflow: 'auto' }}>
                                <table className="maintenanceSettings_table">
                                    <thead>
                                        <tr>
                                            {loginDetails?.is_block_exist_in_property && loginDetails?.is_block_exist_in_property !== null && <th className="maintenanceSettings_table_th">Block</th>}
                                            {loginDetails?.is_floor_exist_in_property && loginDetails?.is_floor_exist_in_property !== null && <th className="maintenanceSettings_table_th">Floor</th>}
                                            <th className="maintenanceSettings_table_th">Property No.</th>
                                            <th className="maintenanceSettings_table_th">Estimated SQ FT. Area</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customCreate &&
                                            customCreate.map((x, i) =>
                                                x?.floorInfo.map((y, j) => (
                                                    <tr>
                                                        {j === 0 && loginDetails?.is_block_exist_in_property !== null && loginDetails?.is_block_exist_in_property && (
                                                            <td className="maintenanceSettings_table_td " rowspan={x?.floorInfo.length.toString()} style={{ minWidth: '7rem' }}>
                                                                {x.block_name}
                                                            </td>
                                                        )}
                                                        {loginDetails?.is_floor_exist_in_property !== null && loginDetails?.is_floor_exist_in_property && (
                                                            <td className="maintenanceSettings_table_td" style={{ minWidth: '7rem' }}>
                                                                {y.floor_name}
                                                            </td>
                                                        )}
                                                        <td className="maintenanceSettings_table_td w-30rem">
                                                            <div className="flex justify-content-center align-items-center p-2 ">
                                                                <InputText
                                                                    tooltip={
                                                                        letCheckPrvVal(y.floor_start, j, x)
                                                                            ? "The start no. should be greater than the previous floor's end no."
                                                                            : y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start
                                                                            ? 'End no. should be greater then start no.'
                                                                            : null
                                                                    }
                                                                    tooltipOptions={{ position: 'top', className: 'input-error-tooltip' }}
                                                                    className={classNames({ 'p-invalid': (y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start) || letCheckPrvVal(y.floor_start, j, x) })}
                                                                    type="number"
                                                                    placeholder="Start no."
                                                                    value={y.floor_start}
                                                                    onChange={(e) => setPropertyStartEnd(e.target.value, i, j, 'start')}
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
                                                                    onChange={(e) => setPropertyStartEnd(e.target.value, i, j, 'end')}
                                                                    style={{ minWidth: '7rem' }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="maintenanceSettings_table_td w-15rem">
                                                            <InputNumber
                                                                // className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start })}
                                                                // type="number"
                                                                id={'sqftarea' + j}
                                                                placeholder="Estimated SQ FT. Area."
                                                                value={y.est_sq_ft_area}
                                                                onChange={(e) => {
                                                                    setPropertySqFtArea(e.value, i, j);
                                                                }}
                                                                style={{ minWidth: '7rem' }}
                                                                locale="en-IN"
                                                                minFractionDigits={2}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                    </tbody>
                                    {loginDetails?.is_shopping_center_exist_in_property === true && (
                                        <thead>
                                            <tr>
                                                <th className="maintenanceSettings_table_th" colSpan={4}>
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
                                                        {j === 0 && loginDetails?.is_block_exist_in_shopping_center_property === true && (
                                                            <td className="maintenanceSettings_table_td" rowspan={x?.floorInfo.length.toString()}>
                                                                {x.block_name}
                                                            </td>
                                                        )}
                                                        {j === 0 && loginDetails?.is_block_exist_in_shopping_center_property === undefined && loginDetails?.is_block_exist_in_property && loginDetails?.is_block_exist_in_property !== null && (
                                                            <td className="maintenanceSettings_table_td" rowspan={x?.floorInfo.length.toString()}>
                                                                {''}
                                                            </td>
                                                        )}
                                                        <td className="maintenanceSettings_table_td">{y.floor_name}</td>
                                                        <td className="maintenanceSettings_table_td w-30rem">
                                                            <div className="flex justify-content-center align-items-center p-2">
                                                                <InputText
                                                                    tooltip={
                                                                        letCheckPrvVal(y.floor_start, j, x)
                                                                            ? "The start no. should be greater than the previous floor's end no."
                                                                            : y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start
                                                                            ? 'End no. should be greater then start no.'
                                                                            : null
                                                                    }
                                                                    tooltipOptions={{ position: 'top', className: 'input-error-tooltip' }}
                                                                    className={classNames({ 'p-invalid': (y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start) || letCheckPrvVal(y.floor_start, j, x) }, 'w-12rem')}
                                                                    type="number"
                                                                    // inputId="shopping_total_floors"
                                                                    placeholder="Start no."
                                                                    value={y.floor_start}
                                                                    // className="w-12rem"
                                                                    onChange={(e) => setShoppingStartEnd(e.target.value, i, j, 'start')}
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
                                                                    onChange={(e) => setShoppingStartEnd(e.target.value, i, j, 'end')}
                                                                    // onValueChange={(e) => setStructure({ ...createStructure, shopping_total_floors: e.target.value })}
                                                                    // className={classNames({ 'p-invalid': error && createStructure?.shopping_total_floors <= 0 })}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="maintenanceSettings_table_td w-15rem">
                                                            <InputNumber
                                                                // className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start })}
                                                                // type="number"
                                                                id={'sqftarea' + j}
                                                                placeholder="Estimated SQ FT. Area."
                                                                value={y.est_sq_ft_area}
                                                                onChange={(e) => {
                                                                    setPropertySqFtAreaShopping(e.value, i, j);
                                                                }}
                                                                style={{ minWidth: '7rem' }}
                                                                locale="en-IN"
                                                                minFractionDigits={2}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="grid p-fluid mt-3">
                                <div className="col-12 md:col-12 flex justify-content-end align-items-center">
                                    {(loginDetails?.is_block_exist_in_property || loginDetails?.is_floor_exist_in_property) && (
                                        <Button
                                            label="Back"
                                            style={{ width: '6rem' }}
                                            className="p-button-outlined p-button-danger mr-2"
                                            onClick={() => {
                                                // setCustomCreate([]);
                                                // setShoppingCustomCreate([]);
                                                setIsCustomEdit(false);
                                                loginDetails?.is_ground_floor_exist_in_property === true && setStructure({ ...createStructure, total_floors: createStructure?.total_floors - 1 });
                                            }}
                                        />
                                    )}
                                    <Button
                                        // label="Generate Structure"
                                        label="Next"
                                        iconPos="right"
                                        style={{ width: '6rem' }}
                                        className="p-button-outlined p-button-success"
                                        onClick={() => generateStructure()}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {isSqFtArea && structureInfo.length > 0 && (
                        <>
                            {sqFeetArea.length > 0 && (
                                <DataTable
                                    value={sqFeetArea}
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
                                    paginator={sqFeetArea.length > 10}
                                    rows={10}
                                    rowsPerPageOptions={[10, 25, 50, 100, 300, 500]}
                                    paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                                >
                                    {loginDetails?.is_block_exist_in_property && loginDetails?.is_block_exist_in_property !== null && <Column field="block_name" header={'Block'} />}
                                    {loginDetails?.is_floor_exist_in_property && loginDetails?.is_floor_exist_in_property !== null && <Column field="floor_name" header={'Floor'} />}
                                    <Column field="propertyNO" header={'Property No.'} />
                                    <Column
                                        field="est_sq_ft_area"
                                        header={'SQ FT. Area'}
                                        body={(rowData) => (
                                            <InputNumber
                                                // className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start })}
                                                // type="number"
                                                id={'sqftarea' + rowData?.property_index}
                                                placeholder="Estimated SQ FT. Area."
                                                value={rowData.est_sq_ft_area}
                                                onChange={(e) => {
                                                    setPropertyOrignalSqFtArea(e.value, rowData?.block_index, rowData?.floor_index, rowData?.property_index);
                                                }}
                                                style={{ minWidth: '7rem', width: '100%' }}
                                                locale="en-IN"
                                                minFractionDigits={2}
                                            />
                                        )}
                                    />
                                </DataTable>
                            )}

                            {isSqFtArea && loginDetails?.is_shopping_center_exist_in_property === true && (
                                <Divider align="center" className=" pt-0">
                                    <span className="p-tag"> Shopping</span>
                                </Divider>
                            )}
                            {isSqFtArea && sqFeetShoppingArea.length > 0 && (
                                <DataTable
                                    value={sqFeetShoppingArea}
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
                                    paginator={sqFeetShoppingArea.length > 10}
                                    rows={10}
                                    rowsPerPageOptions={[10, 25, 50, 100, 300, 500]}
                                    paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
                                >
                                    {loginDetails?.is_block_exist_in_shopping_center_property === true && <Column field="block_name" header={'Block'} />}
                                    <Column field="floor_name" header={'Floor'} />
                                    <Column field="propertyNO" header={'Property No.'} />
                                    <Column
                                        field="est_sq_ft_area"
                                        header={'SQ FT. Area'}
                                        body={(rowData) => (
                                            <InputNumber
                                                // className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start })}
                                                // type="number"
                                                id={'sqftarea' + rowData?.property_index}
                                                placeholder="Estimated SQ FT. Area."
                                                value={rowData.est_sq_ft_area}
                                                onChange={(e) => {
                                                    setShoppingOrignalSqFtArea(e.value, rowData?.block_index, rowData?.floor_index, rowData?.property_index);
                                                }}
                                                style={{ minWidth: '7rem', width: '100%' }}
                                                locale="en-IN"
                                                minFractionDigits={2}
                                            />
                                        )}
                                    />
                                </DataTable>
                            )}
                            {/* <div className="py-2" style={{ minWidth: '50rem', overflow: 'auto' }}>
                                <table className="maintenanceSettings_table">
                                    <thead>
                                        <tr>
                                            {loginDetails?.is_block_exist_in_property && loginDetails?.is_block_exist_in_property !== null && <th className="maintenanceSettings_table_th">Block</th>}
                                            {loginDetails?.is_floor_exist_in_property && loginDetails?.is_floor_exist_in_property !== null && <th className="maintenanceSettings_table_th">Floor</th>}
                                            <th className="maintenanceSettings_table_th">Property No.</th>
                                            <th className="maintenanceSettings_table_th">SQ FT. Area</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {structureInfo &&
                                            structureInfo.map((x, i) =>
                                                x?.floor_info.map((y, j) =>
                                                    y.floor_property.map((z, k) => (
                                                        <tr>
                                                            {k === 0 && j === 0 && loginDetails?.is_block_exist_in_property !== null && loginDetails?.is_block_exist_in_property && (
                                                                <td className="maintenanceSettings_table_td w-10rem" rowspan={collectRowspan(x)}>
                                                                    {x.block_name}
                                                                </td>
                                                            )}
                                                            {k === 0 && loginDetails?.is_floor_exist_in_property !== null && loginDetails?.is_floor_exist_in_property && <td className="maintenanceSettings_table_td w-10rem" rowspan={y?.floor_property.length.toString()}>{y.floor_name}</td>}
                                                            <td className="maintenanceSettings_table_td w-10rem">
                                                                {z.propertyNO}
                                                            </td>
                                                            <td className="maintenanceSettings_table_td w-10rem p-2">
                                                                <InputNumber
                                                                    // className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start })}
                                                                    // type="number"
                                                                    id={"sqftarea" + j}
                                                                    placeholder="Estimated SQ FT. Area."
                                                                    value={z.est_sq_ft_area}
                                                                    onChange={(e) => {
                                                                        setPropertyOrignalSqFtArea(e.value, i, j, k)
                                                                    }}
                                                                    style={{ minWidth: '7rem', width: '100%' }}
                                                                    locale="en-IN"
                                                                    minFractionDigits={2}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            )}
                                    </tbody>
                                    {isSqFtArea && loginDetails?.is_shopping_center_exist_in_property === true && (
                                        <thead>
                                            <tr>
                                                <th className="maintenanceSettings_table_th" colSpan={4}>
                                                    Shopping
                                                </th>
                                            </tr>
                                        </thead>
                                    )}
                                    {isSqFtArea && shoppingStructureInfo.length > 0 && (
                                        <tbody>
                                            {shoppingStructureInfo &&
                                                shoppingStructureInfo.map((x, i) =>
                                                    x?.floor_info.map((y, j) =>
                                                        y.floor_property.map((z, k) => (
                                                            <tr>
                                                                {k === 0 && j === 0 && loginDetails?.is_block_exist_in_shopping_center_property === true && (
                                                                    <td className="maintenanceSettings_table_td w-10rem" rowspan={collectRowspan(x)}>
                                                                        {x.block_name}
                                                                    </td>
                                                                )}
                                                                {k === 0 && j === 0 && loginDetails?.is_block_exist_in_shopping_center_property === undefined && loginDetails?.is_block_exist_in_property && loginDetails?.is_block_exist_in_property !== null && (
                                                                    <td className="maintenanceSettings_table_td" rowspan={collectRowspan(x)}>
                                                                        {""}
                                                                    </td>
                                                                )}
                                                                {k === 0 && <td className="maintenanceSettings_table_td w-10rem" rowspan={y?.floor_property.length.toString()}>{y.floor_name}</td>}
                                                                <td className="maintenanceSettings_table_td w-10rem">
                                                                    {z.propertyNO}
                                                                </td>
                                                                <td className="maintenanceSettings_table_td w-10rem p-2">
                                                                    <InputNumber
                                                                        // className={classNames({ 'p-invalid': y.floor_start !== null && y.floor_end !== null && y.floor_end <= y.floor_start })}
                                                                        // type="number"
                                                                        id={"sqftarea" + j}
                                                                        placeholder="Estimated SQ FT. Area."
                                                                        value={z.est_sq_ft_area}
                                                                        onChange={(e) => {
                                                                            // setPropertySqFtArea(e.value, i, j)
                                                                            setShoppingOrignalSqFtArea(e.value, i, j, k)
                                                                        }}
                                                                        style={{ minWidth: '7rem', width: '100%' }}
                                                                        locale="en-IN"
                                                                        minFractionDigits={2}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )
                                                )}
                                        </tbody>
                                    )}
                                </table>
                            </div> */}
                            <div className="grid p-fluid mt-3">
                                <div className="col-12 md:col-12 flex justify-content-end align-items-center">
                                    <Button
                                        label="Back"
                                        icon="pi pi-arrow-left"
                                        style={{ width: '6rem' }}
                                        className="p-button-outlined p-button-danger mr-2 mb-2"
                                        onClick={() => {
                                            setSqFtArea(false);
                                        }}
                                    />
                                    <Button
                                        disabled={submitted}
                                        style={{ width: '12rem' }}
                                        label="Generate Structure"
                                        type="submit"
                                        // icon="pi pi-check"
                                        className="p-button-outlined p-button-success mr-2 mb-2"
                                        iconPos="left" // Ensures the icon aligns with the label
                                        onClick={() => {
                                            const checkSqFtArea = (blocks) => blocks.some((block) => block.floor_info.some((floor) => floor.floor_property.some((property) => property.est_sq_ft_area === null)));

                                            const structureSqCheck = checkSqFtArea(structureInfo);
                                            const shoppingCheck = checkSqFtArea(shoppingStructureInfo);

                                            if (!structureSqCheck && !shoppingCheck) {
                                                setSqFtArea(false);
                                                setIsGenerated(true);
                                            }
                                        }}
                                    >
                                        <i
                                            className="pi pi-check"
                                            style={{
                                                fontSize: '1rem' // Set the icon size here
                                            }}
                                        ></i>
                                    </Button>
                                </div>
                            </div>
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
                                        {loginDetails?.is_block_exist_in_property !== null && loginDetails?.is_block_exist_in_property && <th className="maintenanceSettings_table_th">Block</th>}
                                        {loginDetails?.is_floor_exist_in_property !== null && loginDetails?.is_floor_exist_in_property && <th className="maintenanceSettings_table_th">Floor</th>}
                                        <th className="maintenanceSettings_table_th">Property No.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {structureInfo &&
                                        structureInfo.map((x, i) =>
                                            x?.floor_info.map((y, j) => (
                                                <tr>
                                                    {j === 0 && loginDetails?.is_block_exist_in_property !== null && loginDetails?.is_block_exist_in_property && (
                                                        <td className="maintenanceSettings_table_td w-10rem" rowspan={x?.floor_info.length.toString()}>
                                                            {x.block_name}
                                                        </td>
                                                    )}
                                                    {loginDetails?.is_floor_exist_in_property !== null && loginDetails?.is_floor_exist_in_property && <td className="maintenanceSettings_table_td w-10rem">{y.floor_name}</td>}
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
                    {isGenerated && loginDetails?.is_shopping_center_exist_in_property === true && (
                        <Divider align="center" className=" pt-0">
                            <span className="p-tag">Shopping Center structure</span>
                        </Divider>
                    )}
                    {isGenerated && loginDetails?.is_shopping_center_exist_in_property === true && (
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
                                        {loginDetails?.is_block_exist_in_shopping_center_property && <th className="maintenanceSettings_table_th">Block</th>}
                                        <th className="maintenanceSettings_table_th">Floor</th>
                                        <th className="maintenanceSettings_table_th">Property No.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shoppingStructureInfo &&
                                        shoppingStructureInfo.map((x, i) =>
                                            x?.floor_info.map((y, j) => (
                                                <tr>
                                                    {j === 0 && loginDetails?.is_block_exist_in_shopping_center_property === true && (
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
                    {isGenerated && structureInfo.length > 0 && (
                        <div className="p-invalid error text-xl mt-1" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                            {'Notes:- '}
                            <span className="text-base">{"Once you've saved all three forms, you can't modify the property structure."}</span>
                        </div>
                    )}
                    {isGenerated && structureInfo.length > 0 && (
                        <div className="grid p-fluid mt-3">
                            <div className="col-12 md:col-12 flex justify-content-end align-items-center">
                                <Button
                                    label="Back"
                                    icon="pi pi-arrow-left"
                                    style={{ width: '6rem' }}
                                    className="p-button-outlined p-button-danger mr-2 mb-2"
                                    onClick={() => {
                                        setSqFtArea(true);
                                        setIsGenerated(false);
                                        // setIsGenerated(false);
                                    }}
                                />
                                <Button disabled={submitted} style={{ width: '6rem' }} label="Save" type="submit" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2" onClick={() => submitData()} />
                            </div>
                        </div>
                    )}
                </>
            )}
            {isManual === false && <ExcelUpload decode={loginDetails} onHide={() => onHide()} />}
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
        </div>
    );
};
export default CreateStructureModel;
