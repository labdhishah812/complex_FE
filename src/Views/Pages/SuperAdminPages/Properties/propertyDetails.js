import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyDetailsRequest } from '../../../../redux/slice/AdminSlices/complexSlice';
import { BreadCrumb } from 'primereact/breadcrumb';

// Utility function for truncated text with tooltip and full view
const TruncatedText = ({ text, maxLength = 30, className = '' }) => {
    const [showFullText, setShowFullText] = useState(false);

    if (!text) return <span className="text-500">N/A</span>;

    const isTruncated = text.length > maxLength;
    const displayText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

    const handleViewFull = (e) => {
        e.stopPropagation();
        setShowFullText(true);
    };
    return (
        <>
            <div className={`flex align-items-center ${className}`}>
                <span className="full-text-tooltip mr-2 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer" onClick={handleViewFull}>
                    {displayText}
                </span>
                {/* {isTruncated && (
                    // <Button
                    //     icon="pi pi-eye"
                    //     className="p-button-text p-button-info p-button-sm"
                    //     onClick={handleViewFull}
                    // />
                )} */}
            </div>

            <Dialog header="Full Details" visible={showFullText} style={{ width: '50vw' }} className="shadow-8" modal onHide={() => setShowFullText(false)}>
                <p className="text-lg text-900">{text}</p>
            </Dialog>
        </>
    );
};

const PropertyDetailsForm = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { complexData, loading, error } = useSelector((state) => state.complex);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(getPropertyDetailsRequest(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (complexData) {
            setFormData(complexData);
        }
    }, [complexData]);
    const breadcrumbHome = {
        // icon: 'pi pi-home',
        label: 'Property List',
        command: () => {
            navigate('/superadmin/properties');
        }
    };

    const breadcrumbItems = [
        {
            label: 'Property Information'
        }
    ];

    // Status color and icon mapping
    const getStatusConfig = (status) => {
        const statusMap = {
            Active: {
                icon: 'pi-check-circle',
                color: 'success',
                textColor: 'text-white'
            },
            Inactive: {
                icon: 'pi-ban',
                color: 'danger', // Red for Inactive
                textColor: 'text-white' // Ensure the text is white for better contrast
            },
            Trial: {
                icon: 'pi-info-circle',
                color: 'warning',
                textColor: 'text-blue-700'
            },
            default: {
                icon: 'pi pi-times',
                color: 'danger',
                textColor: 'text-white',

            }
        };
        return statusMap[status] || statusMap['default'];
    };

    // Render info section with title and icon
    const renderInfoSection = (title, children, icon) => {
        return (
            <Card
                className="mb-4 shadow-2 border-round-xl overflow-hidden transform transition-all "
                title={
                    <div className="flex align-items-center">
                        <i className={`${icon} text-primary mr-3 text-2xl`}></i>
                        <span className="text-800 font-semibold text-lg">{title}</span>
                    </div>
                }
            >
                <div className="grid">
                    {children.map((child, index) => (
                        <div key={index} className="col-12">
                            {child}
                        </div>
                    ))}
                </div>
            </Card>
        );
    };

    // Render individual info row
    const renderInfoRow = (label, value, type = 'text') => {
        const renderValue = () => {
            switch (type) {
                case 'boolean':
                    return (
                        <div className="flex align-items-center">
                            <i className={`pi mr-2 ${value ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'} text-xl`}></i>
                            <span className={`font-medium ${value ? 'text-green-700' : 'text-red-700'}`}>{value ? 'Yes' : 'No'}</span>
                        </div>
                    );
                case 'status':
                    return (
                        <Tag
                            value={value}
                            severity={value === 'Inactive' ? 'secondary' : 'success'}
                            icon={`pi ${value === 'Inactive' ? 'pi-circle' : 'pi-check-circle'}`}
                            className={`ml-3 ${value === 'Inactive' ? 'p-tag-secondary' : ''}`}
                            style={
                                value === 'Inactive'
                                    ? {
                                          background: 'red',
                                          width: 'max-content'
                                      }
                                    : {}
                            }
                        />
                    );
                case 'address':
                    return <TruncatedText text={value} />;
                case 'masked':
                    return value ? '*'.repeat(value.length - 4) + value.slice(-4) : 'N/A';
                default:
                    return <span className="text-700">{value || 'N/A'}</span>;
            }
        };

        return (
            <div className="flex justify-content-between align-items-center py-2 border-bottom-1 border-200 ">
                <div className="text-700 font-semibold pr-3">{label}</div>
                <div className="text-900 text-right">{renderValue()}</div>
            </div>
        );
    };

    // Render header with property logo and basic info
    const renderHeaderSection = () => {
        if (!formData) return null;

        const propertyStatus = getStatusConfig(formData.property_status);

        return (
            <>
            <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{'Property Details'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            <div className="bg-white shadow-2 border-round-xl p-4 mb-4 flex flex-column md:flex-row justify-content-between align-items-center">
                <div className="flex align-items-center mb-3 md:mb-0">
                    <div className="mr-4">
                        {formData.property_logo ? (
                            <img
                                src={`${process.env.REACT_APP_PROPERTY_LOGOS3URL}/${formData.property_logo}`}
                                alt="Property Logo"
                                className="border-circle shadow-3 transform transition-transform hover:scale-110"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    border: '3px solid var(--primary-color)'
                                }}
                            />
                        ) : (
                            <div
                                className="flex align-items-center justify-content-center border-circle bg-primary text-white shadow-3"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    fontSize: '48px'
                                }}
                            >
                                {formData.property_name ? formData.property_name[0].toUpperCase() : 'P'}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-900 mb-2 flex align-items-center">
                            {formData.property_name}
                            {/* <Tag value={formData.property_status} severity={propertyStatus.color} icon={`pi ${propertyStatus.icon}`} className="ml-3" /> */}
                            <Tag value={formData.property_status} severity={propertyStatus.color} icon={`pi ${propertyStatus.icon}`} className="ml-3" style={{width:'100px',gap:'5px'}} />

                        </h1>
                        <div className="text-600 flex align-items-center">
                            <i className="pi pi-map-marker mr-2 text-primary"></i>
                            {formData.property_type} | {formData.property_city}, {formData.propertyState}
                        </div>
                    </div>
                </div>
                {/* <Button
                    label="Back to Properties"
                    icon="pi pi-arrow-left"
                    className="p-button-outlined p-button-primary shadow-2 transform transition-transform hover:scale-105 mt-3 md:mt-0"
                    onClick={() => navigate('/superadmin/properties')}
                /> */}
                {/* <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">{'Property Information'}</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div> */}
            </div>
            </>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center min-h-screen bg-blue-50">
                <ProgressSpinner strokeWidth="3" animationDuration=".5s" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-content-center align-items-center min-h-screen bg-red-50 p-5">
                <Card className="text-center shadow-4">
                    <div className="text-center">
                        <i className="pi pi-exclamation-triangle text-5xl text-red-500 mb-4"></i>
                        <h2 className="text-2xl mb-3 text-900">Error Loading Property Details</h2>
                        <p className="text-600">{error}</p>
                    </div>
                </Card>
            </div>
        );
    }

    // No data state
    if (!formData) {
        return (
            <div className="flex justify-content-center align-items-center min-h-screen bg-blue-50">
                <Card className="text-center shadow-4">
                    <i className="pi pi-info-circle text-5xl text-blue-500 mb-4"></i>
                    <h2 className="text-2xl mb-3 text-900">No Property Data Found</h2>
                    <p className="text-600">Please check the property ID and try again.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="surface-ground p-5 bg-blue-50 min-h-screen">
            <div className="container mx-auto">
                {renderHeaderSection()}

                <div className="grid">
                    <div className="col-12 md:col-6">
                        {renderInfoSection(
                            'Property Information',
                            [
                                renderInfoRow('Property Name', formData.property_name),
                                renderInfoRow('Property Type', formData.property_type),
                                renderInfoRow('Address', `${formData.property_address}`, {
                                    position: 'center',
                                    left: '0',
                                    zIndex: 10,
                                    maxWidth: '10px',
                                    // width: 'calc(100% - 50px)', // Adjust width as needed
                                    backgroundColor: 'white', // Optional: to ensure it's visible over other content
                                    padding: '10px', // Optional: to give some spacing
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }),
                                renderInfoRow('Blocks Exist', formData.is_block_exist_in_property, 'boolean'),
                                renderInfoRow('Floors Exist', formData.is_floor_exist_in_property, 'boolean')
                            ],
                            'pi pi-building'
                        )}

                        {renderInfoSection('Contact Details', [renderInfoRow('Name', formData.name), renderInfoRow('Email', formData.email), renderInfoRow('Mobile Number', formData.mobile_number)], 'pi pi-user')}
                    </div>
                    <div className="col-12 md:col-6">
                        {renderInfoSection(
                            'Bank Information',
                            [
                                renderInfoRow('Account Holder', formData.accountHolderName),
                                renderInfoRow('Bank Name', formData.bankName),
                                renderInfoRow('Account Number', formData.bankAccountNumber, 'masked'),
                                renderInfoRow('Branch', formData.branchName, 'address'),
                                renderInfoRow('IFSC Code', formData.IFSCCode)
                            ],
                            'pi pi-credit-card'
                        )}

                        {renderInfoSection(
                            'Subscription Details',
                            [renderInfoRow('Plan', formData.subscriptionPlan), renderInfoRow('Status', formData.subscriptionStatus, 'status'), renderInfoRow('Billing Cycle', formData.billingCycle)],
                            'pi pi-star'
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailsForm;
