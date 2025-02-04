import React from 'react';
import components from '../..';
import { useNavigate } from 'react-router-dom';
import LoaderUi from '../../../../components/Loader';
import PropertyStructureCreate from './propertyStructure';
import MaintenanceSetting from './maintenaceSetting';
import VehicleSetting from './vehicleSetting';
import { useDispatch, useSelector } from 'react-redux';
import { getPropertyStructureAllData } from '../../../../redux/slice/AdminSlices/blockSlice';
import { getStepperDetails } from '../../../../redux/slice/AdminSlices/authSlice';

const VizardList = () => {
    const { React, Steps, useState, useEffect, useDispatch, useSelector } = components;
    const { stepperDetail, isLoading } = useSelector((store) => store.auth);
    const { propertyStructureAllData } = useSelector((store) => store.block);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeIndex, setActiveIndex] = useState(null);
    const [structureEditData, setStructureEditData] = useState(null);

    // Fetch property structure data and handle step navigation
    useEffect(() => {
        if (propertyStructureAllData && propertyStructureAllData.length > 0) {
            let data = {
                select_naming_formate: propertyStructureAllData[0].is_block_exist_in_property
                    ? 'A'
                    : 'xyz',
                mainProperty: propertyStructureAllData.filter((x) => x.is_shopping_center_exist_in_property === false),
                shoppingproperty: propertyStructureAllData.filter((x) => x.is_shopping_center_exist_in_property === true),
            };
            setStructureEditData(data);
        }
        // decodeURI();
    // }, [propertyStructureAllData]);
}, [propertyStructureAllData]);
useEffect(() => {
    decodeURI();
}, [stepperDetail]);

    const decodeURI = async () => {
        if (stepperDetail?.propertyStructureExists && stepperDetail?.maintenanceSettingExists && stepperDetail?.vehicleSettingExists) {
            navigate("/property-management/dashboard");
        } else if (!stepperDetail?.propertyStructureExists) {
            setActiveIndex(0);
            dispatch(getPropertyStructureAllData());
        } else if (stepperDetail?.propertyStructureExists && !stepperDetail?.maintenanceSettingExists) {
            setActiveIndex(1);
        } else if (stepperDetail?.propertyStructureExists && stepperDetail?.maintenanceSettingExists && !stepperDetail?.vehicleSettingExists) {
            setActiveIndex(2);
        }
    };

    // Get the steps with completion status
    const getStepItems = () => {
        console.log(getStepItems, "")
        return [
            {
                label: 'Property Structure',
                isCompleted: stepperDetail?.propertyStructureExists || false,
                title: 'Finished',
            },
            {
                label: 'Maintenance Setting',
                isCompleted: stepperDetail?.maintenanceSettingExists || false
            },
            {
                label: 'Vehicle Setting',
                isCompleted: stepperDetail?.vehicleSettingExists || false
            },
            {
                label: ''
            }
        ];
    };

    // Custom step template to show green tick
    const customStepTemplate = (item, index) => {
        return (
            <div className="flex flex-column align-items-center">
                <div className="step-label">{item.label}</div>
                {item.isCompleted && (
                    <span
                        className="mt-1"
                        style={{
                            color: 'green',
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}
                    >
                        ✓
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="relative min-h-full">
            <LoaderUi isLoading={isLoading} />
            <div className="grid crud-demo ml-0 mr-0">
                <div className="card w-full">
                    <Steps
                        model={getStepItems()}
                        activeIndex={activeIndex}
                        className="wizard_stepper"
                        itemTemplate={customStepTemplate}
                    />

                    {/* Render steps content */}
                    {activeIndex === 0 && <PropertyStructureCreate structureEditData={structureEditData} />}
                    {activeIndex === 1 && (
                        <MaintenanceSetting
                            nextprev={(val) => {
                                setActiveIndex(val);
                                dispatch(getPropertyStructureAllData());
                            }}
                            fromWizard={true}
                        />
                    )}
                    {activeIndex === 2 && (
                        <VehicleSetting
                            fromWizard={true}
                            nextprev={(val) => {
                                setActiveIndex(val);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VizardList;
