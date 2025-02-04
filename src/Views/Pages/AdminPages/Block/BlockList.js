import components from '../..';
import jwtDecode from 'jwt-decode';
import CreateBlockModel from './createBlockModel';
import MultiAssignProperty from './multiAssignProperty';
import Loader from '../../../../components/Loader';
import { setPropertyFromStructur } from '../../../../redux/slice/AdminSlices/propertySlice';
import { structureViewRequest, handleResetBlock, floorStructureViewRequest, shoppingStructureViewRequest, floorShoppingStructureViewRequest } from '../../../../redux/slice/AdminSlices/blockSlice';

const BlockList = () => {
    const { Divider, Dialog, Button, useState, useEffect, React, useNavigate, useDispatch, useSelector, BreadCrumb, Toolbar } = components;
    const { token, loginDetails } = useSelector((store) => store.auth);
    const { isMultiCreated } = useSelector((store) => store.property);
    const { structureViewDetail, isCreated, isLoading, shoppingStructureViewDetail } = useSelector((store) => store.block);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [block, setBlock] = useState(null);
    const [floor, setFloor] = useState(null);
    const [house, setHouse] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState([]);
    const [assignModal, setAssignModal] = useState(false);
    const [directInPropertyAssign, setDirectInPropertyAssign] = useState(null);

    const [modal, setModal] = useState({
        // isImportExcelModalOpen: false,
        isEditModalOpen: false,
        isViewModalOpen: false,
        isDeleteModalOpen: false,
        isMultiDeleteModalOpen: false,
        isModalOpen: false
    });
    const [decode, setDecode] = useState(null);
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
            // decode?.permissions.findIndex((x) => x.module_name === 'dashboard') !== -1 &&
            //     decode?.permissions.find((x) => x.module_name === 'dashboard').module_access.findIndex((a) => a === 'read') !== -1 &&
            //     navigate(`/${decode ? decode?.property_name && decode?.property_name.replace(/ /g, '-').toLowerCase() : ''}/dashboard`);
        }
    };
    const breadcrumbItems = [
        {
            label: 'Property Structure',
            command: () => {
                navigate('/property-management/property-structure');
            }
        }
    ];
    useEffect(() => {
        callStructureViewApi();
    }, [dispatch]);
    const callStructureViewApi = async () => {
        let decodeData = loginDetails;
        decodeData?.is_block_exist_in_property && setBlock(true);
        decodeData?.is_floor_exist_in_property && setFloor(true);
        decodeData?.is_house_exist_in_property && setHouse(true);

        let sendData = {};
        if (decodeData?.is_ground_floor_exist_in_property) sendData.is_ground_floor_exist_in_property = decodeData?.is_ground_floor_exist_in_property;
        if (decodeData?.is_block_exist_in_property) sendData.is_block_exist_in_property = decodeData?.is_block_exist_in_property;
        if (decodeData?.is_floor_exist_in_property) sendData.is_floor_exist_in_property = decodeData?.is_floor_exist_in_property;
        if (decodeData?.is_house_exist_in_property) sendData.is_house_exist_in_property = decodeData?.is_house_exist_in_property;
        if (sendData.is_block_exist_in_property === true && (sendData.is_floor_exist_in_property === true || sendData.is_house_exist_in_property === true)) {
            dispatch(structureViewRequest(sendData));
        } else if (!sendData.is_block_exist_in_property && !sendData.is_house_exist_in_property && sendData.is_floor_exist_in_property === true) {
            dispatch(floorStructureViewRequest());
        } else {
            dispatch(structureViewRequest({ is_block_exist_in_property: false, is_house_exist_in_property: true }));
        }

        if (decodeData.is_shopping_center_exist_in_property === true) {
            let sendShoppingData = {
                is_shopping_center_exist_in_property: true
            };
            if (decodeData?.is_block_exist_in_shopping_center_property) sendShoppingData.is_block_exist_in_shopping_center_property = decodeData?.is_block_exist_in_shopping_center_property;
            if (decodeData?.is_floor_exist_in_shopping_center_property) sendShoppingData.is_floor_exist_in_shopping_center_property = decodeData?.is_floor_exist_in_shopping_center_property;
            if (decodeData?.is_block_exist_in_shopping_center_property === true && decodeData?.is_floor_exist_in_shopping_center_property === true) {
                dispatch(shoppingStructureViewRequest(sendShoppingData));
            } else if (decodeData?.is_floor_exist_in_shopping_center_property === true) {
                dispatch(floorShoppingStructureViewRequest());
            }
        }
        setDecode(decodeData);
    };
    const handleStructureCreate = () => {
        setModal({
            ...modal,
            isModalOpen: true
        });
    };
    const hideDialog = () => {
        setModal({
            ...modal,
            isModalOpen: false,
            isDeleteModalOpen: false,
            isMultiDeleteModalOpen: false,
            isEditModalOpen: false,
            isViewModalOpen: false
        });
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Property Structure Create" icon="pi pi-plus" className="p-button-outlined p-button-success mr-2 " onClick={() => handleStructureCreate()} />
            </React.Fragment>
        );
    };
    const header = <Toolbar className="create-delete-btn" end={rightToolbarTemplate}></Toolbar>;
    useEffect(() => {
        if (isCreated || isMultiCreated) {
            setModal({
                ...modal,
                isModalOpen: false,
                isEditModalOpen: false,
                isDeleteModalOpen: false,
                isMultiDeleteModalOpen: false
            });
            handleResetBlock();
            callStructureViewApi();
            setSelectedProperty([]);
            setAssignModal(false);
        }
    }, [isCreated, isMultiCreated]);
    const onselect = (value) => {
        try {
            let selected = [...selectedProperty];
            let check = selected.findIndex((x) => x._id === value._id);
            if (check === -1) {
                selected.push({ _id: value._id, property_number: value.property_number });
            } else {
                selected.splice(check, 1);
            }
            setSelectedProperty(selected);
        } catch (error) {
            console.log(error);
        }
    };
    const deleteUserDialogFooter = () => {
        try {
            return (
                <>
                    <Button
                        label="No"
                        icon="pi pi-times"
                        className="p-button-outlined p-button-danger mr-2 mb-2"
                        onClick={() => {
                            // setDeleteModal(false);
                            // setDeleteId(null);
                            setDirectInPropertyAssign(null);
                        }}
                    />
                    <Button
                        label="Yes"
                        icon="pi pi-check"
                        className="p-button-outlined p-button-success mr-2 mb-2"
                        onClick={() => {
                            navigate('/property-management/property-assign/user-property-assign');
                            dispatch(setPropertyFromStructur(directInPropertyAssign));
                            // setDeleteModal(false);
                            // dispatch(complaintRemoveRequest(deleteId?._id));
                            // setDeleteId(null);
                        }}
                    />
                </>
            );
        } catch (error) {
            console.log(error);
        }
    };
    // https://codepen.io/swastikmishra/pen/zYYdKBQ    Link  for Freeze
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Property</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0 w-full">
                <div className="card mt-2 w-full">
                    <div className="flex align-items-center">
                        <h4 className="mt-2">Property Structure View</h4>
                        {/* <Button label="Block Create " icon="pi pi-plus" className="p-button-outlined p-button-success ml-auto" onClick={() => handleStructureCreate()} /> */}
                        {/* {selectedProperty.length > 0 && <Button label="Assign Property" icon="pi pi-plus" className="p-button-outlined p-button-success ml-auto" onClick={() => setAssignModal(true)} />} */}
                        {structureViewDetail?.data.length === 0 && <Button label="Property Structure Create" icon="pi pi-plus" className="p-button-outlined p-button-success ml-auto" onClick={() => handleStructureCreate()} />}
                    </div>
                    <div className="overflow-y-auto border-round-md mt-2 py-3">
                        {structureViewDetail?.data && structureViewDetail?.data.length > 0 ? (
                            <table className="maintenanceSettings_table">
                                <tbody>
                                    {structureViewDetail?.data.map((a, i) =>
                                        block !== null && (floor !== null || house !== null) ? (
                                            block !== null && floor !== null ? (
                                                a?.floor_details.map((b, j) => (
                                                    <tr>
                                                        {j === 0 && block !== null && (
                                                            <td className="maintenanceSettings_table_td freeze" rowspan={a?.floor_details.length.toString()} style={{ minWidth: '7rem' }}>
                                                                {a.block_name}
                                                            </td>
                                                        )}
                                                        {floor !== null && (
                                                            <td className="maintenanceSettings_table_td freeze" style={{ minWidth: '7rem' }}>
                                                                {b.floor_name === 'Ground Floor' ? b.floor_name : b.floor_name + ' Floor'}
                                                            </td>
                                                        )}
                                                        <td className="maintenanceSettings_table_td w-full">
                                                            <div className="flex gap-2 my-2 px-2">
                                                                {b.user_property_details.map((c, k) => (
                                                                    <div
                                                                        className={`border-round-sm ${!c.disabled ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'selected_block text-white'} ${selectedProperty.findIndex((x) => x._id === c._id) !== -1 ? 'text-50 bg-primary' : ''
                                                                            } h-3rem w-3rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                                        onClick={() => {
                                                                            // !c.disabled && onselect(c);
                                                                            // !c.disabled && navigate('/property-management/property-assign/user-property-assign');
                                                                            // !c.disabled && dispatch(setPropertyFromStructur({ property_assign_id: c._id, label: c.property_number, disabled: c.disabled }));
                                                                            !c.disabled && setDirectInPropertyAssign({ property_assign_id: c._id, label: c.property_number, disabled: c.disabled })
                                                                            c.disabled && navigate(`/property-management/property-structure/${c._id}`)
                                                                        }}
                                                                    >
                                                                        {c.property_number}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    {block !== null && (
                                                        <td className="maintenanceSettings_table_td freeze" style={{ minWidth: '7rem' }}>
                                                            {a.block_name}
                                                        </td>
                                                    )}
                                                    <td className="maintenanceSettings_table_td w-full">
                                                        <div className="flex gap-2 my-2 px-2">
                                                            {a?.user_property_details.map((b, j) => (
                                                                <div
                                                                    className={`border-round-sm ${!b.disabled ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'selected_block text-white'} ${selectedProperty.findIndex((x) => x._id === b._id) !== -1 ? 'text-50 bg-primary' : ''
                                                                        } h-3rem w-3rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                                    // onClick={() => !b.disabled && onselect(b)}
                                                                    onClick={() => {
                                                                        // // !c.disabled && onselect(c);
                                                                        // !b.disabled && navigate('/property-management/property-assign/user-property-assign', { state: { propertyId: 0 } });
                                                                        // !b.disabled && dispatch(setPropertyFromStructur({ property_assign_id: b._id, label: b.property_number, disabled: b.disabled }));
                                                                        !b.disabled && setDirectInPropertyAssign({ property_assign_id: b._id, label: b.property_number, disabled: b.disabled });
                                                                        b.disabled && navigate(`/property-management/property-structure/${b._id}`)
                                                                    }}
                                                                >
                                                                    {b.property_number}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        ) : block === null && floor !== null && house === null ? (
                                            <tr>
                                                {floor !== null && (
                                                    <td className="maintenanceSettings_table_td freeze" style={{ minWidth: '7rem' }}>
                                                        {/* {a.floor_name} */}
                                                        {a.floor_name === 'Ground Floor' ? a.floor_name : a.floor_name + ' Floor'}
                                                    </td>
                                                )}
                                                <td className="maintenanceSettings_table_td w-full">
                                                    <div className="flex gap-2 my-2 px-2">
                                                        {a?.result.map((b, j) => (
                                                            <div
                                                                className={`border-round-sm ${!b.disabled ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'text-white selected_block'} ${selectedProperty.findIndex((x) => x._id === b._id) !== -1 ? 'text-50 bg-primary' : ''
                                                                    } h-3rem w-3rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                                // onClick={() => !b.disabled && onselect(b)}
                                                                // bg-teal-500
                                                                onClick={() => {
                                                                    // !c.disabled && onselect(c);
                                                                    // !b.disabled && navigate('/property-management/property-assign/user-property-assign', { state: { propertyId: 0 } });
                                                                    // !b.disabled && dispatch(setPropertyFromStructur({ property_assign_id: b._id, label: b.property_number, disabled: b.disabled }));
                                                                    !b.disabled && setDirectInPropertyAssign({ property_assign_id: b._id, label: b.property_number, disabled: b.disabled })
                                                                    b.disabled && navigate(`/property-management/property-structure/${b._id}`)
                                                                }}
                                                            >
                                                                {b.property_number}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : null
                                    )}
                                    {block === null && floor === null && house !== null && (
                                        <tr>
                                            <td className="maintenanceSettings_table_td w-full">
                                                <div className="flex gap-2 my-2 px-2">
                                                    {structureViewDetail?.data.map((a, i) => (
                                                        <div
                                                            className={`border-round-sm ${!a.disabled ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'selected_block text-white'} ${selectedProperty.findIndex((x) => x._id === a._id) !== -1 ? 'text-50 bg-primary' : ''
                                                                } h-3rem w-3rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                            // onClick={() => !a.disabled && onselect(a)}
                                                            onClick={() => {
                                                                // !c.disabled && onselect(c);
                                                                // !a.disabled && navigate('/property-management/property-assign/user-property-assign', { state: { propertyId: 0 } });
                                                                // !a.disabled && dispatch(setPropertyFromStructur({ property_assign_id: a._id, label: a.property_number, disabled: a.disabled }));
                                                                !a.disabled && setDirectInPropertyAssign({ property_assign_id: a._id, label: a.property_number, disabled: a.disabled })
                                                                a.disabled && navigate(`/property-management/property-structure/${a._id}`)
                                                            }}
                                                        >
                                                            {a.property_number}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            'No Record Found.'
                        )}
                    </div>
                    {decode?.is_shopping_center_exist_in_property === true && shoppingStructureViewDetail && shoppingStructureViewDetail?.data.length > 0 && (
                        <Divider align="center" className=" pt-0">
                            <span className="p-tag">Shopping Center structure</span>
                        </Divider>
                    )}
                    {decode?.is_shopping_center_exist_in_property === true && shoppingStructureViewDetail && shoppingStructureViewDetail?.data.length > 0 && (
                        <div className="overflow-y-auto border-round-md mt-2 py-3">
                            {shoppingStructureViewDetail && shoppingStructureViewDetail?.data.length > 0 && (
                                <table className="maintenanceSettings_table">
                                    <tbody>
                                        {decode?.is_block_exist_in_shopping_center_property === true &&
                                            decode?.is_floor_exist_in_shopping_center_property === true &&
                                            shoppingStructureViewDetail?.data.map((a, i) =>
                                                a?.floor_details.map((b, j) => (
                                                    <tr>
                                                        {j === 0 && block !== null && (
                                                            <td className="maintenanceSettings_table_td freeze" rowspan={a?.floor_details.length.toString()} style={{ minWidth: '7rem' }}>
                                                                {a.block_name}
                                                            </td>
                                                        )}
                                                        <td className="maintenanceSettings_table_td freeze" style={{ minWidth: '7rem' }}>
                                                            {/* {b.floor_name} */}
                                                            {b.floor_name === 'Ground Floor' ? b.floor_name : b.floor_name + ' Floor'}
                                                        </td>
                                                        <td className="maintenanceSettings_table_td w-full">
                                                            <div className="flex gap-2 my-2 px-2">
                                                                {b.user_property_details.map((c, k) => (
                                                                    <div
                                                                        className={`border-round-sm ${!c.disabled ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'selected_block text-white'} ${selectedProperty.findIndex((x) => x._id === c._id) !== -1 ? 'text-50 bg-primary' : ''
                                                                            } h-3rem w-3rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                                        // onClick={() => !c.disabled && onselect(c)}
                                                                        onClick={() => {
                                                                            // !c.disabled && onselect(c);
                                                                            // !c.disabled && navigate('/property-management/property-assign/user-property-assign', { state: { propertyId: 0 } });
                                                                            // !c.disabled && dispatch(setPropertyFromStructur({ property_assign_id: c._id, label: c.property_number, disabled: c.disabled }));
                                                                            !c.disabled && setDirectInPropertyAssign({ property_assign_id: c._id, label: c.property_number, disabled: c.disabled })

                                                                            c.disabled && navigate(`/property-management/property-structure/${c._id}`)
                                                                        }}
                                                                    >
                                                                        {c.property_number}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        {decode?.is_block_exist_in_shopping_center_property === undefined &&
                                            decode?.is_floor_exist_in_shopping_center_property === true &&
                                            shoppingStructureViewDetail &&
                                            shoppingStructureViewDetail?.data.map((a, i) => (
                                                <tr>
                                                    <td className="maintenanceSettings_table_td freeze" style={{ minWidth: '7rem' }}>
                                                        {/* {a.floor_name} */}
                                                        {a.floor_name === 'Ground Floor' ? a.floor_name : a.floor_name + ' Floor'}
                                                    </td>
                                                    <td className="maintenanceSettings_table_td w-full">
                                                        <div className="flex gap-2 my-2 px-2">
                                                            {a?.result.map((b, j) => (
                                                                <div
                                                                    className={`border-round-sm ${!b.disabled ? 'border-1 border-primary text-primary hover:text-50 hover:bg-primary' : 'selected_block text-white'} ${selectedProperty.findIndex((x) => x._id === b._id) !== -1 ? 'text-50 bg-primary' : ''
                                                                        } h-3rem w-3rem flex align-items-center justify-content-center text-sm cursor-pointer`}
                                                                    // onClick={() => !b.disabled && onselect(b)}
                                                                    onClick={() => {
                                                                        // !c.disabled && onselect(c);
                                                                        // !b.disabled && navigate('/property-management/property-assign/user-property-assign', { state: { propertyId: 0 } });
                                                                        // !b.disabled && dispatch(setPropertyFromStructur({ property_assign_id: b._id, label: b.property_number, disabled: b.disabled }));
                                                                        !b.disabled && setDirectInPropertyAssign({ property_assign_id: b._id, label: b.property_number, disabled: b.disabled })

                                                                        b.disabled && navigate(`/property-management/property-structure/${b._id}`)
                                                                    }}
                                                                >
                                                                    {b.property_number}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                    <Dialog
                        visible={directInPropertyAssign !== null}
                        style={{ width: '30vw' }}
                        header={'Assign Property'}
                        modal
                        className="p-fluid"
                        onHide={() => {
                            setDirectInPropertyAssign(null);
                            // onHide();
                            // stePropertyDetails([]);
                        }}
                        footer={deleteUserDialogFooter}
                    >
                        <div className={`flex align-items-center mt-3`}>
                            <span>{"This property has not been assigned yet. Would you like to assign it now?"}</span>
                        </div>
                    </Dialog>
                    {assignModal && <MultiAssignProperty onHide={() => setAssignModal(false)} selectedProperty={selectedProperty} />}
                    {modal?.isModalOpen && <CreateBlockModel onHide={hideDialog} />}
                </div>
            </div>
        </div>
    );
};

export default BlockList;
