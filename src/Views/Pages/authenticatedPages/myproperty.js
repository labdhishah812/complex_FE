import React from 'react';
import components from '../../Pages';
import { adminLoginWithPropertyRequest } from '../../../redux/slice/AdminSlices/authSlice';

const MyProperty = () => {
    const REACT_APP_PROPERTY_LOGOS3URL = process.env.REACT_APP_PROPERTY_LOGOS3URL;
    const { Image, Divider, Button, useState, useEffect, React, useNavigate, useDispatch, useSelector, BreadCrumb, Toolbar } = components;
    const dispatch = useDispatch();
    const { propertyDetails, authEmail } = useSelector((state) => state.auth);

    const onSelect = (property_id) => {
        try {
            let sentData = {
                email: authEmail,
                property_id: property_id,
                platform: 'windows'
            };
            dispatch(adminLoginWithPropertyRequest(sentData));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Please Select Property</h2>
            <div className="flex flex-wrap justify-content-center">
                {propertyDetails &&
                    propertyDetails.map((a, i) => (
                        <div className="card mb-0 w-30rem m-2 relative" key={i}>
                            <div className="w-full p-2 sm:flex min-h-[200px]">
                                <img
                                    src={`${REACT_APP_PROPERTY_LOGOS3URL}/${a?.property_logo}`}
                                    className="myPropCardUIImage"
                                    alt={a?.property_name}
                                />
                                <div className="w-full px-3 pb-16"> {/* Added pb-16 to ensure content doesn't overlap with button */}
                                    <h5 className="my-2">{a?.property_name}</h5>
                                    <p className="m-0 font-semibold text-600">{a?.chairman_name}</p>
                                    <p className="m-0 font-semibold text-600">{a?.property_address}</p>
                                </div>
                            </div>
                            <div className="bottom-0 right-0 p-1 w-full">
                                <div className="text-right">
                                    <Button
                                        label="Select"
                                        className="p-button-outlined"
                                        onClick={() => onSelect(a?._id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default MyProperty;



// import React, { useEffect } from 'react';
// import { adminLoginWithPropertyRequest } from '../../../redux/slice/AdminSlices/authSlice';
// import components from '../../Pages';

// const MyProperty = () => {
//     const REACT_APP_PROPERTY_LOGOS3URL = process.env.REACT_APP_PROPERTY_LOGOS3URL;
//     const { Image, Button, useNavigate, useDispatch, useSelector } = components;
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { propertyDetails, authEmail } = useSelector((state) => state.auth);

//     useEffect(() => {
//         // Store current properties in localStorage for switch functionality
//         if (propertyDetails?.length) {
//             localStorage.setItem('currentProperties', JSON.stringify(propertyDetails));
//         }
//     }, [propertyDetails]);

//     const handleSwitch = async (property_id) => {
//         try {
//             const sentData = {
//                 email: authEmail,
//                 property_id: property_id,
//                 platform: 'windows'
//             };

//             // Save the selected property in localStorage
//             localStorage.setItem('activePropertyId', property_id);

//             // Dispatch the login with property request
//             await dispatch(adminLoginWithPropertyRequest(sentData));

//             // You can add a success notification here if needed
//             // navigate('/dashboard'); // Uncomment if you want to redirect after switch
//         } catch (error) {
//             console.error('Error switching property:', error);
//             // Handle error appropriately
//         }
//     };

//     return (
//         <div>
//             <h2 className="text-2xl font-bold mb-4">Please Select Property</h2>
//             <div className="flex flex-wrap justify-content-center">
//                 {propertyDetails && propertyDetails.length > 0 ? (
//                     propertyDetails.map((property, index) => (
//                         <div className="card mb-0 w-30rem m-2 relative" key={index}>
//                             <div className="w-full p-2 sm:flex min-h-[200px]">
//                                 <img
//                                     src={`${REACT_APP_PROPERTY_LOGOS3URL}/${property?.property_logo}`}
//                                     className="myPropCardUIImage"
//                                     alt={property?.property_name}
//                                 />
//                                 <div className="w-full px-3 pb-16">
//                                     <h5 className="my-2">{property?.property_name}</h5>
//                                     <p className="m-0 font-semibold text-600">{property?.chairman_name}</p>
//                                     <p className="m-0 font-semibold text-600">{property?.property_address}</p>
//                                 </div>
//                             </div>
//                             <div className="bottom-0 right-0 p-1 w-full">
//                                 <div className="text-right">
//                                     <Button
//                                         label="Select"
//                                         className="p-button-outlined"
//                                         onClick={() => handleSwitch(property?._id)}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No properties available to switch.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MyProperty;


//switch property
// import components from '../../Pages';
// // import Loader from '../../../../components/Loader';
// import { adminLoginWithPropertyRequest,handleSuccessLogin,getStepperDetails,handleLogout } from '../../../redux/slice/AdminSlices/authSlice';
// import { Button } from 'primereact/button';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { adminLogiWithProperty } from '../../../service/api';
// import { useEffect } from 'react';
// const MyProperty = () => {
//     const REACT_APP_PROPERTY_LOGOS3URL = process.env.REACT_APP_PROPERTY_LOGOS3URL;
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { propertyDetails, authEmail } = useSelector((state) => state.auth);

//     // useEffect(() => {
//     //     if (!propertyDetails || !authEmail) {
//     //         // If we don't have the required data, redirect to login
//     //         navigate('/login');
//     //     }
//     // }, [propertyDetails, authEmail, navigate]);

//     const onSelect = async (property_id) => {
//         try {
//             const sentData = {
//                 email: authEmail,
//                 property_id: property_id,
//                 platform: 'windows'
//             };
//             // Using your existing loginWithProperty API call
//             dispatch(adminLoginWithPropertyRequest(sentData));
//         } catch (error) {
//             console.error('Property selection failed:', error);
//             dispatch(handleLogout());
//             navigate('/login');
//         }
//     };
//     return (
//         <div className="p-4">
//             <h2 className="text-2xl font-bold mb-4">Select Property</h2>
//             <div className="flex flex-wrap justify-content-center gap-4">
//                 {propertyDetails?.map((property, index) => (
//                     <div key={property._id} className="card mb-0 w-30rem">
//                         <div className="w-full p-4 sm:flex">
//                             <img
//                                 src={`${REACT_APP_PROPERTY_LOGOS3URL}/${property?.property_logo}`}
//                                 alt={property.property_name}
//                                 className="myPropCardUIImage"
//                             />
//                             <div className="w-full px-4 flex flex-col justify-between">
//                                 <div>
//                                     <h5 className="text-xl font-bold mb-2">
//                                         {property.property_name}
//                                     </h5>
//                                     <p className="m-0 font-semibold text-600">
//                                         {property.chairman_name}
//                                     </p>
//                                     <p className="m-0 font-semibold text-600">
//                                         {property.property_address}
//                                     </p>
//                                 </div>
//                                 <div className="text-right mt-4">
//                                     <Button
//                                         label="Select"
//                                         className="p-button-outlined"
//                                         onClick={() => onSelect(property._id)}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default MyProperty;
