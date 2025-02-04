import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLoginWithPropertyRequest } from '../../../redux/slice/AdminSlices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const SwitchPropertyPage = () => {
    const REACT_APP_PROPERTY_LOGOS3URL = process.env.REACT_APP_PROPERTY_LOGOS3URL;
    const [properties, setProperties] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authEmail,loginDetails } = useSelector((state) => state.auth);
    console.log(loginDetails)

    useEffect(() => {
        // Fetch properties from localStorage
        const storedProperties = JSON.parse(localStorage.getItem('currentProperties')) || [];
        setProperties(storedProperties);
    }, []);

    const handleSwitch = async (propertyId) => {
        try {
            const sentData = {
                email: loginDetails.email,
                property_id: propertyId,
                platform: 'windows'
            };

            // Save the selected property in localStorage
            localStorage.setItem('activePropertyId', propertyId);

            // Dispatch the API call
            await dispatch(adminLoginWithPropertyRequest(sentData));

            // You can add success notification or redirect here if needed
            navigate('/property-management/dashboard');
        } catch (error) {
            console.error('Error switching property:', error);
            // Handle error - maybe show an error message
        }
    };

    return (
        <div className="property-container">
            <h2 className="text-2xl font-bold mb-4">Switch Property</h2>
            <div className="flex flex-wrap justify-content-center">
                {properties && properties.length > 0 ? (
                    properties.map((property) => (
                        <div className="card mb-0 w-30rem m-2 relative" key={property._id}>
                            <div className="w-full p-2 sm:flex min-h-[200px]">
                                <img
                                    src={`${REACT_APP_PROPERTY_LOGOS3URL}/${property?.property_logo}`}
                                    className="myPropCardUIImage"
                                    alt={property?.property_name}
                                    onError={(e) => {
                                        e.target.src = '/fallback-image.png';
                                    }}
                                />
                                <div className="w-full px-3 pb-16">
                                    <h5 className="my-2">{property?.property_name}</h5>
                                    <p className="m-0 font-semibold text-600">{property?.chairman_name}</p>
                                    <p className="m-0 font-semibold text-600">{property?.property_address}</p>
                                </div>
                            </div>
                            <div className="bottom-0 right-0 p-1 w-full">
                                <div className="text-right">
                                    <Button
                                        label="Select"
                                        className="p-button-outlined"
                                        onClick={() => handleSwitch(property._id)}
                                    >
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center p-4">
                        <p>No properties available to switch.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .property-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .myPropCardUIImage {
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 8px;
                }
                .card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease;
                }
                .card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                @media (max-width: 640px) {
                    .myPropCardUIImage {
                        width: 100%;
                        height: 200px;
                    }
                }
            `}</style>
        </div>
    );
};

export default SwitchPropertyPage;
