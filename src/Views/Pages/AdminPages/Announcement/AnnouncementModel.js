import components from '../..';
import jwtDecode from 'jwt-decode';
import { getBlockDropdownRequest, getShopBlockDropdownRequest } from '../../../../redux/slice/AdminSlices/blockSlice';
import { announcementCreateRequest, updateAnnouncementRequest } from '../../../../redux/slice/AdminSlices/announcementSlice';
const AnnouncementModel = ({ onHide, editData }) => {
    const { InputText, Dialog, Dropdown, InputTextarea, Button, RadioButton, classNames, useDispatch, useState, useEffect, useSelector } = components;
    const { token } = useSelector((store) => store.auth);
    const { blockDropdownData } = useSelector((store) => store.block);

    const dispatch = useDispatch();

    const [decode, setDecode] = useState(null);
    const [createShopping, setCreateShopping] = useState(true);
    const [forBlock, setForBlock] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [blockValue, setBlockValue] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [updateId, setUpdateId] = useState('');

    useEffect(() => {
        decodeURI();
        if (editData !== null) {
            setForBlock(editData?.block_wise === true);
            setTitle(editData?.title);
            setDescription(editData?.description);
            setUpdateId(editData?._id);
            editData?.block_wise === true && setBlockValue(editData?.block_id);
        }
    }, [dispatch, editData]);
    const decodeURI = async () => {
        try {
            let decodeData = await jwtDecode(token);
            if (decodeData.is_block_exist_in_property === true) {
                dispatch(getBlockDropdownRequest());
            }
            setDecode(decodeData);
        } catch (error) {
            console.log(error);
        }
    };
    const getShoppingDropdown = () => {
        try {
            if (decode.is_block_exist_in_shopping_center_property === true) {
                dispatch(getShopBlockDropdownRequest());
            }
        } catch (error) {
            console.log(error);
        }
    };
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
            let flag = false;
            if ((forBlock === true && blockValue === '') || description.trim() === '' || title.trim() === '') {
                setError(true);
                flag = true;
            }
            if (!flag) {
                let sendData = {
                    property_wise: forBlock === false,
                    block_wise: forBlock === true,
                    title: title,
                    description: description
                };
                if (blockValue !== '') sendData.block_id = blockValue !== '' ? blockValue : '';
                if (decode?.property_type === 'Flat' && forBlock === true) {
                    sendData.property_assign_type = createShopping === false ? 'Shopping' : 'Flat';
                }
                updateId === '' && dispatch(announcementCreateRequest(sendData));
                updateId !== '' && dispatch(updateAnnouncementRequest(updateId, sendData));
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Dialog visible={true} style={{ width: '80vw' }} header={updateId === '' ? 'Add Announcement' : 'Edit Announcement'} modal className="p-fluid" onHide={onHide} footer={footerUI}>
            <div className="grid p-fluid mt-1">
                {(decode?.is_block_exist_in_property === true || decode?.is_block_exist_in_shopping_center_property === true) && updateId === '' && (
                    <div className="field col-12 md:col-4 mb-1">
                        <label className="">Do you want to announce block wise ? </label>
                        <div className="flex flex-wrap gap-3 ">
                            <div className="flex align-items-center">
                                <RadioButton
                                    inputId="forBlock1"
                                    name="forBlock"
                                    value="Yes"
                                    onChange={(e) => {
                                        setForBlock(true);
                                        setCreateShopping(true);
                                        decodeURI();
                                        setBlockValue('');
                                    }}
                                    checked={forBlock === true}
                                />
                                <label htmlFor="forBlock1" className="ml-2">
                                    Yes
                                </label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton
                                    inputId="forBlock2"
                                    name="forBlock"
                                    value="No"
                                    onChange={(e) => {
                                        setForBlock(false);
                                        setBlockValue('');
                                    }}
                                    checked={forBlock === false}
                                />
                                <label htmlFor="createShopping2" className="ml-2">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                )}
                {decode?.is_shopping_center_exist_in_property === true && decode.is_block_exist_in_shopping_center_property === true && forBlock && updateId === '' && (
                    <div className="field col-12 md:col-4 mb-1">
                        <label className="">Property Assign Type</label>
                        <div className="flex flex-wrap gap-3 ">
                            <div className="flex align-items-center">
                                <RadioButton
                                    inputId="createShopping1"
                                    name="createShopping"
                                    value="Flat"
                                    onChange={(e) => {
                                        setCreateShopping(true);
                                        decodeURI();
                                        setBlockValue('');
                                    }}
                                    checked={createShopping === true}
                                />
                                <label htmlFor="createShopping1" className="ml-2">
                                    Flat
                                </label>
                            </div>
                            {decode.is_block_exist_in_shopping_center_property === true && (
                                <div className="flex align-items-center">
                                    <RadioButton
                                        inputId="createShopping2"
                                        name="createShopping"
                                        value="Shopping"
                                        onChange={(e) => {
                                            setCreateShopping(false);
                                            getShoppingDropdown();
                                            setBlockValue('');
                                        }}
                                        checked={createShopping === false}
                                    />
                                    <label htmlFor="createShopping2" className="ml-2">
                                        Shopping
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="grid p-fluid">
                {forBlock && updateId === '' && (
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="block" className="required">
                            Select block
                        </label>
                        <Dropdown
                            id="block"
                            optionLabel="label"
                            optionValue="block_id"
                            options={blockDropdownData}
                            name="block"
                            placeholder="Select block"
                            type="text"
                            value={blockValue}
                            onChange={(e) => {
                                setBlockValue(e.target.value);
                            }}
                            className={classNames({ 'p-invalid': error && blockValue === '' })}
                        />
                        {error && blockValue === '' ? <small className="p-invalid error">{'Please select block'}</small> : null}
                    </div>
                )}
                <div className="field col-12 md:col-4 mb-1 mt-1">
                    <label htmlFor="title" className="required">
                        TItle
                    </label>
                    <InputText id="title" name="title" placeholder="Enter title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={classNames({ 'p-invalid': error && title.trim() === '' })} />
                    {error && title.trim() === '' ? <small className="p-invalid error">{'Please enter title'}</small> : null}
                </div>
                <div className="field col-12 md:col-12 mb-1">
                    <label htmlFor="description" className="required">
                        Enter description
                    </label>
                    <InputTextarea
                        id="description"
                        placeholder="Enter description"
                        rows="3"
                        cols="30"
                        autoResize
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={classNames({ 'p-invalid': error && description.trim() === '' })}
                    />
                    {error && description.trim() === '' ? <small className="p-invalid error">{'Please enter description'}</small> : null}
                </div>
            </div>
        </Dialog>
    );
};
export default AnnouncementModel;
