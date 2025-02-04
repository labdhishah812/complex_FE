import axios from 'axios';
import components from '../..';
import { useRef } from 'react';
const { SelectButton, Image, Button, DataTable, Column, InputText, React, useNavigate, BreadCrumb, Toolbar, Paginator, useState, useEffect, useDispatch, useSelector } = components;

const Notifications = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL_API = process.env.REACT_APP_BASE_URL;
    const { token } = useSelector((state) => state.auth);

    const [notificationsPageData, setNotificationsPageData] = useState({ notifications: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Initially set hasMore to true
    const loaderRef = useRef(null);

    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate(`/property-management/dashboard`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'Notifications'
        }
    ];

    useEffect(() => {
        apiCall(); // Call the API when the component loads
    }, [page]); // Trigger API call when `page` changes

    const apiCall = async () => {
        if (!hasMore || isLoading) return; // Prevent multiple calls at once

        try {
            setIsLoading(true); // Set loading to true while fetching data

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                }
            };

            // Fetch notifications for the current page
            const { data } = await axios.get(`${BASE_URL_API}/notification/databyidforweb?limit=10&page=${page}`, config);

            if (data?.statusCode === 200) {
                const newNotifications = data?.data?.notifications;

                if (newNotifications?.length > 0) {
                    setNotificationsPageData((prevData) => ({
                        ...prevData,
                        notifications: [...prevData.notifications, ...newNotifications] // Append new notifications
                    }));

                    // If the fetched notifications are less than the limit, stop further fetching
                    if (newNotifications.length < 5) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false); // No more notifications to fetch
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // Set loading to false after fetching data
        }
    };

    // IntersectionObserver to detect when loader comes into view
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                setPage((prevPage) => prevPage + 1); // Increment the page number to fetch the next set
            }
        }, { threshold: 1.0 });

        if (loaderRef.current) {
            observer.observe(loaderRef.current); // Observe the loader div
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore, isLoading]);

    return (
        <div className="relative min-h-full">
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Notifications</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                {notificationsPageData?.notifications.length > 0 && (
                    <div className="crud-demo ml-0 mr-0 card mt-3 mx-auto" style={{ width: "90rem", maxWidth: '90rem' }}>
                        <ul className="list-decimal p-0 m-0">
                            {notificationsPageData?.notifications.map((item) => (
                                <li key={item?._id} className="flex align-items-center py-3 px-2 border-bottom-1 surface-border">
                                    <div className="flex flex-column">
                                        <div>
                                            <p className="font-bold">{item?.title}: </p>
                                        </div>
                                        <div>
                                            <p>{item?.description}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div ref={loaderRef} className="flex justify-content-center mt-4">
                            {isLoading && <div class="loader"></div>}
                            {!hasMore && <p>No More New Notifications</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
