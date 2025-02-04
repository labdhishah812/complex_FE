import components from '../..';
import Loader from '../../../../components/Loader';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
import moment from 'moment-timezone';
import { getBlockDropdownRequest } from '../../../../redux/slice/AdminSlices/blockSlice';
import { announcementCreateRequest, updateAnnouncementRequest, getAnnouncementDetailByIdRequest } from '../../../../redux/slice/AdminSlices/announcementSlice';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';

const AnnouncementCreate = () => {
    const { React, RadioButton, Dropdown, Image, InputTextarea, Calendar, classNames, BreadCrumb, Button, InputText, useNavigate, useState, useEffect, useDispatch, useSelector } = components;
    const params = useParams();
    const BASE_URL_API = process.env.REACT_APP_COMON_UPLOAD_BASE;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loginDetails } = useSelector((store) => store.auth);
    const { blockDropdownData } = useSelector((store) => store.block);
    const { isCreated, isLoading, announcementDetailById } = useSelector((store) => store.announcement);
    const [createShopping, setCreateShopping] = useState(true);
    const [forBlock, setForBlock] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [blockValue, setBlockValue] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [expire_date, setExpire_date] = useState('');
    const [end_date, setEnd_date] = useState('');
    const [start_date, setStart_date] = useState('');
    const [updateId, setUpdateId] = useState('');
    const [file, setFile] = useState(null);
    const breadcrumbHome = {
        label: 'Announcements',
        command: () => {
            navigate(`/property-management/announcements`);
        }
    };
    const breadcrumbItems = [
        {
            label: params.id ? 'Edit Announcement' : 'Create Announcement'
        }
    ];
    useEffect(() => {
        if (params.id) {
            dispatch(getAnnouncementDetailByIdRequest(params.id));
        }
    }, [params.id]);
    useEffect(() => {
        if (loginDetails.is_block_exist_in_property === true) {
            dispatch(getBlockDropdownRequest());
        }
    }, [dispatch]);
    useEffect(() => {
        if (isCreated === true) {
            navigate(`/property-management/announcements`);
        }
    }, [isCreated]);
    useEffect(() => {
        if (announcementDetailById && announcementDetailById?._id) {
            // let expire_date = editeDate(announcementDetailById?.expire_in)
            setForBlock(announcementDetailById?.block_wise === true);
            setTitle(announcementDetailById?.title);
            // setExpire_date(announcementDetailById?.expire_in);
            setExpire_date(seteditDefault(announcementDetailById?.expire_in));
            setStart_date(seteditDefault(announcementDetailById?.start_date));
            setEnd_date(seteditDefault(announcementDetailById?.end_date));
            setDescription(announcementDetailById?.description);
            setUpdateId(announcementDetailById?._id);
            announcementDetailById?.bannerImg && setFile({ fileImg: announcementDetailById?.bannerImg, showImg: `${BASE_URL_API}announcement/${announcementDetailById?.bannerImg}` });
            announcementDetailById?.block_wise === true && setBlockValue(announcementDetailById?.block_id);
            // if (editData !== null) {
            // }
            // navigate(`/property-management/announcements`)
        }
    }, [announcementDetailById]);
    const submitData = () => {
        try {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
            let flag = false;
            if ((forBlock === true && blockValue === '') || description.trim() === '' || title.trim() === '' || expire_date === '' || start_date === '' || end_date === '') {
                setError(true);
                flag = true;
            }
            if (!flag) {
                let sendData = {
                    property_wise: forBlock === false,
                    block_wise: forBlock === true,
                    title: title,
                    description: description,
                    expire_in: expire_date,
                    start_date: start_date,
                    end_date: end_date,
                    banner: file?.fileImg ? file?.fileImg : ''
                };
                if (blockValue !== '') sendData.block_id = blockValue !== '' ? blockValue : '';
                if (loginDetails?.property_type === 'Flat' && forBlock === true) {
                    sendData.property_assign_type = createShopping === false ? 'Shopping' : 'Flat';
                }
                updateId === '' && dispatch(announcementCreateRequest(sendData));
                updateId !== '' && dispatch(updateAnnouncementRequest(updateId, sendData));
            }
        } catch (error) {
            console.log(error);
        }
    };
    // const editeDate = (dateStr) => {
    //     try {
    //         // let [year, month, day] = val.split('T')[0].split("-").map(Number);
    //         // const dateObj = new Date(year, month - 1, day);
    //         // re
    //         const date = new Date(dateStr);
    //         const day = String(date.getUTCDate()).padStart(2, '0');
    //         const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    //         const year = date.getUTCFullYear();
    //         const formattedDate = `${day}/${month}/${year}`;

    //         return formattedDate;
    //     } catch (error) {

    //     }
    // }
    const seteditDefault = (val) => {
        try {
            const inputDateString = val;
            const [year, month, day] = inputDateString.split('-').map(Number);
            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
            return formattedDate;
        } catch (error) {
            console.log(error);
        }
    };
    const setDefaultDate = (val) => {
        try {
            const inputDateString = val;

            const [day, month, year] = inputDateString.split('/').map(Number);
            const dateObj = new Date(year, month - 1, day);
            const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
            const localTime = dateObj.getTime() - timezoneOffset;
            const indiaOffset = 330 * 60000;
            const indiaTime = localTime + indiaOffset;
            const indiaDate = new Date(indiaTime);
            return new Date(indiaDate.toString());
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpload = async (event) => {
        try {
            const str = event.target.files[0]?.name;
            const substr = ['.jpg', '.jpeg', '.png'];
            let flag = false;
            substr.forEach((a) => {
                if (str.includes(a)) {
                    flag = true;
                }
            });
            if (flag) {
                setFile({ fileImg: event.target.files[0], showImg: URL.createObjectURL(event.target.files[0]) });
            } else {
                toast.error('Only Accept .png , .jpeg, and .jpg file.', {
                    style: {
                        marginTop: '4rem'
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative min-h-full">
            <Loader isLoading={isLoading} />
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{params.id ? 'Edit Announcement' : 'Create Announcement'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="crud-demo ml-0 mr-0 card mt-3">
                <div className="grid p-fluid mt-1">
                    {(loginDetails?.is_block_exist_in_property === true || loginDetails?.is_block_exist_in_shopping_center_property === true) && updateId === '' && (
                        <div className="field col-12 md:col-4 mb-1">
                            <label className="">Do You Want To Announce Block Wise ? </label>
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
                </div>
                <div className="grid p-fluid">
                    {forBlock && updateId === '' && (
                        <div className="field col-12 md:col-4 mb-1">
                            <label htmlFor="block" className="required">
                                Block
                            </label>
                            <Dropdown
                                id="block"
                                optionLabel="label"
                                optionValue="block_id"
                                options={blockDropdownData}
                                name="block"
                                placeholder="Select Block"
                                type="text"
                                value={blockValue}
                                onChange={(e) => {
                                    setBlockValue(e.target.value);
                                }}
                                className={classNames({ 'p-invalid': error && blockValue === '' })}
                            />
                            <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                                {error && blockValue === '' ? 'Please select block.' : ''}
                            </div>

                            {/* {error && blockValue === '' ? <small className="p-invalid error">{'Please select block'}</small> : null} */}
                        </div>
                    )}
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="title" className="required">
                            TItle
                        </label>
                        <InputText id="title" name="title" placeholder="Enter Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={classNames({ 'p-invalid': error && title.trim() === '' })} />
                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                            {error && title.trim() === '' ? 'Please enter title.' : ''}
                        </div>

                        {/* {error && title.trim() === '' ? <small className="p-invalid error">{'Please enter title'}</small> : null} */}
                    </div>
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="start_date" className="required">
                            Start Date
                        </label>
                        <Calendar
                            id="start_date"
                            name="start_date"
                            placeholder="Please Select Start Date"
                            value={start_date !== '' ? setDefaultDate(start_date) : ''}
                            dateFormat="dd/mm/yy"
                            minDate={new Date()}
                            onChange={(e) => {
                                const dateString = new Date(e.target.value);
                                const day = dateString.getDate();
                                const month = dateString.getMonth() + 1;
                                const year = dateString.getFullYear();
                                const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                // setFieldValue('start_date', formattedDate);
                                setStart_date(formattedDate);
                            }}
                            className={classNames({ 'p-invalid': error && start_date.trim() === '' })}
                        />
                        {/* <InputText id="title" name="title" placeholder="Enter Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={classNames({ 'p-invalid': error && title.trim() === '' })} /> */}
                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                            {error && start_date.trim() === '' ? 'Please select start date.' : ''}
                        </div>

                        {/* {error && title.trim() === '' ? <small className="p-invalid error">{'Please enter title'}</small> : null} */}
                    </div>
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="expire_date" className="required">
                            Occasion Date
                        </label>
                        <Calendar
                            id="expire_date"
                            name="expire_date"
                            placeholder="Please Select Occasion Date"
                            value={expire_date !== '' ? setDefaultDate(expire_date) : ''}
                            dateFormat="dd/mm/yy"
                            minDate={new Date()}
                            onChange={(e) => {
                                const dateString = new Date(e.target.value);
                                const day = dateString.getDate();
                                const month = dateString.getMonth() + 1;
                                const year = dateString.getFullYear();
                                const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                // setFieldValue('start_date', formattedDate);
                                setExpire_date(formattedDate);
                                setEnd_date(formattedDate);
                            }}
                            className={classNames({ 'p-invalid': error && expire_date.trim() === '' })}
                        />
                        {/* <InputText id="title" name="title" placeholder="Enter Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={classNames({ 'p-invalid': error && title.trim() === '' })} /> */}
                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                            {error && expire_date.trim() === '' ? 'Please select occasion date.' : ''}
                        </div>

                        {/* {error && title.trim() === '' ? <small className="p-invalid error">{'Please enter title'}</small> : null} */}
                    </div>
                    <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="end_date" className="required">
                            End Date
                        </label>
                        <Calendar
                            id="end_date"
                            name="end_date"
                            placeholder="Please Select End Date"
                            value={end_date !== '' ? setDefaultDate(end_date) : ''}
                            dateFormat="dd/mm/yy"
                            minDate={new Date()}
                            disabled={true}
                            onChange={(e) => {
                                const dateString = new Date(e.target.value);
                                const day = dateString.getDate();
                                const month = dateString.getMonth() + 1;
                                const year = dateString.getFullYear();
                                const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                                // setFieldValue('start_date', formattedDate);
                                // setEnd_date(formattedDate);
                            }}
                            className={classNames({ 'p-invalid': error && end_date.trim() === '' })}
                        />
                        {/* <InputText id="title" name="title" placeholder="Enter Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={classNames({ 'p-invalid': error && title.trim() === '' })} /> */}
                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                            {error && end_date.trim() === '' ? 'Please select end date.' : ''}
                        </div>

                        {/* {error && title.trim() === '' ? <small className="p-invalid error">{'Please enter title'}</small> : null} */}
                    </div>
                    {/* <div className="field col-12 md:col-4 mb-1">
                        <label htmlFor="description" className="required">
                            Description
                        </label>
                        <InputTextarea
                            id="description"
                            placeholder="Enter Description"
                            rows="2"
                            cols="30"
                            autoResize
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={classNames({ 'p-invalid': error && description.trim() === '' })}
                        />
                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                            {error && description.trim() === '' ? 'Please enter description.' : ''}
                        </div>
                    </div> */}
                    <div className={`field col-12 md:col-4 mb-0 1 ${file?.fileImg === undefined ? 'mt-4' : ''}`}>
                        {file?.fileImg === undefined && (
                            <div className="file-input-upload">
                                <input type="file" id="fileInput" accept=".jpg, .jpeg, .png" className="input" onChange={handleUpload} />
                                <label for="fileInput" className="label">
                                    <span>Upload a Banner...</span>
                                </label>
                            </div>
                        )}

                        {file?.fileImg && (
                            <div className="flex align-items-center field col-12 md:col-4 mb-1">
                                <div className="relative " style={{ width: '100px', height: '100px' }}>
                                    <Image alt="Image" src={file?.showImg} width="100" height="100" preview />
                                    <div
                                        className="absolute h-1.5rem w-1.5rem border-circle p-1 flex cursor-pointer justify-content-center align-items-center"
                                        style={{ right: '-11px', top: '-5px', backgroundColor: '#f63939' }}
                                        onClick={() => {
                                            setFile(null);
                                        }}
                                    >
                                        <i className="pi pi-times" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="field col-12 md:col-12 mb-1">
                        <label htmlFor="description" className="required">
                            Description
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={description}
                            onChange={(e) => setDescription(e === '<p><br></p>' ? '' : e)}
                            className={classNames({ 'p-invalid': error && description.trim() === '' })}
                            style={{
                                height: 'auto',
                                overflow: 'auto'
                            }}
                        />
                        <div className="p-invalid error text-xs" style={{ minHeight: '1.1rem', marginTop: '3px' }}>
                            {error && description.trim() === '' ? 'Please enter description.' : ''}
                        </div>
                    </div>
                </div>
                <div className="p-invalid error text-xl mt-4" style={{ minHeight: '1.1rem', marginTop: '3px', width: '80rem' }}>
                    {'Notes :- '}
                    <span className="text-base">{'Only JPEG, JPG, PNG, and PDF files are supported.'}</span>
                </div>
                <div className="grid p-fluid mt-1">
                    <div className="field col-12 md:col-12 mb-1 flex justify-content-end">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2 w-7rem" onClick={() => navigate(`/property-management/announcements`)} />
                        <Button disabled={submitted} label="Save" onClick={() => submitData()} icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2 w-7rem" />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AnnouncementCreate;
