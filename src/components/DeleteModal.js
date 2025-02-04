// import components from '../';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import components from '../Views/Pages';
import { X } from 'lucide-react';
const DeleteModal = ({ isOpenDialog, modalFooter, hideModal, hederText, modalDescription, text, customUi, numValues, sumValue, setSumValue, sumValueError, setSumValueError }) => {
    const { InputNumber } = components;

    return (
        <>
            <Dialog
                visible={isOpenDialog}
                draggable={false}
                style={{ maxWidth: numValues ? "50vw" : '400px' }}
                header={hederText ? hederText : "Confirm"}
                modal footer={modalFooter}
                onHide={hideModal}
                // className='forButtonHeader'
                closable={false}
                icons={
                    <div className='flex align-items-center justify-content-center' style={{ width: "1.5rem", height: "1.5rem" }}>
                        <X color={text !== "payment" ? "#ffff" : "black"} size={17} className='cursor-pointer' onClick={hideModal} />

                    </div>
                    // <CircleX
                    //     className="cursor-pointer"
                    //     color="white"
                    //     onClick={() => {
                    //         reset({ sumValue: null });
                    //         setDisconnectOpencModal(false);
                    //     }}
                    // />
                }
                headerStyle={text !== "payment" && { backgroundColor: '#d32f2f', color: "#fff" }}
            >
                {text !== "payment" ?
                    // <div className={`flex align-items-center ${text !== "payment" ? "justify-content-center" : ""} mt-3`}>
                    //     {text !== "payment" && <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />}
                    //     <span>{modalDescription}</span>
                    //     <h4 className="m-0">
                    //         {numValues?.num1} + {numValues?.num2} ={' '}
                    //     </h4>
                    // </div> 
                    <div>
                        <div className={`flex align-items-center mt-3`}>
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>{modalDescription}</span>
                        </div>

                        {numValues && <h6 style={{ marginLeft: "3rem" }}>Please input correct answer to proceed with deletion </h6>}
                        {numValues && <div className='mt-2 flex align-items-center gap-2' style={{ marginLeft: "3rem" }}>
                            <h4 className="m-0">
                                {numValues?.num1} + {numValues?.num2} ={' '}
                            </h4>
                            <InputNumber
                                id={"count"}
                                placeholder={'Answer'}
                                inputClassName={`max-w-5rem`}
                                value={sumValue}
                                onValueChange={(e) => {
                                    setSumValue(e.value); if (numValues?.num1 + numValues?.num2 === e.value) {
                                        setSumValueError("");
                                    }
                                }}
                                useGrouping={false}
                                maxLength={3}
                            />
                            {sumValueError !== "" && <small className="p-error text-base">{sumValueError}</small>}
                        </div>}
                    </div>
                    : customUi()}
            </Dialog>
        </>
    );
};

export default DeleteModal;
