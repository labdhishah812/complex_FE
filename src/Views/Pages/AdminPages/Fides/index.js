// // import { Galleria } from 'primereact/galleria';
// import { ProgressBar } from 'primereact/progressbar';
// import { Ellipsis } from 'lucide-react';
// import { RadioButton } from 'primereact/radiobutton';
// import { useEffect, useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import components from '../..';
// import DeleteModal from '../../../../components/DeleteModal';
// import { deleteFeedData, getFeedData, getFeedDataByid, updateFeedData } from '../../../../redux/slice/AdminSlices/feedSlice';
// import EditFeeds from './editFeeds';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Pagination } from 'swiper/modules';
// import Lightbox from 'react-image-lightbox';
// import 'react-image-lightbox/style.css';
// const { Button, BreadCrumb, useNavigate } = components;
// const Fides = () => {
//     const { SelectButton, Image, Button, DataTable, Column, InputText, React, useNavigate, BreadCrumb, Toolbar, Paginator, useState, useEffect, useDispatch, useSelector } = components;
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { loginDetails } = useSelector((store) => store.auth);
//     const [feedAndPollData, setFeedAndPollData] = useState();
//     // const [selectedPollAnswers, setSelectedPollAnswers] = useState({});
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [likedFeeds, setLikedFeeds] = useState(new Set());
//     const [pollOptionCounts, setPollOptionCounts] = useState({});
//     const [openActionMenu, setOpenActionMenu] = useState(null);
//     const [deleteModal, setDeleteModal] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [sumValue, setSumValue] = useState(null);
//     const [sumValueError, setSumValueError] = useState('');
//     const [numValues, setNumValues] = useState({
//         num1: 0,
//         num2: 0
//     });
//     const [isOpen, setIsOpen] = useState(false);
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const openLightbox = (index) => {
//         setCurrentIndex(index);
//         setIsOpen(true);
//     };
//     const actionMenuRef = useRef({});
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             // Check if the click is outside all action menu references
//             const isOutsideAll = Object.values(actionMenuRef.current).every((ref) => ref && !ref.contains(event.target));

//             if (isOutsideAll) {
//                 setOpenActionMenu(null);
//             }
//         };
//         // Add event listener when component mounts
//         document.addEventListener('mousedown', handleClickOutside);
//         // Cleanup event listener
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//     const [modal, setModal] = useState(false);
//     const [editData, setEdit] = useState(null);
//     const [expandedFeeds, setExpandedFeeds] = useState(new Map());
//     const [expandedPoll, setExpandedPoll] = useState(new Map());
//     // Modify the selectedPollAnswers to use localStorage
//     const [selectedPollAnswers, setSelectedPollAnswers] = useState(() => {
//         // Initialize from localStorage or empty object
//         const storedAnswers = localStorage.getItem('pollAnswers');
//         return storedAnswers ? JSON.parse(storedAnswers) : {};
//     });
//     // Effect to update localStorage whenever selectedPollAnswers changes
//     useEffect(() => {
//         localStorage.setItem('pollAnswers', JSON.stringify(selectedPollAnswers));
//     }, [selectedPollAnswers]);
//     // Function to truncate the description
//     const getTruncatedDescription = (description) => {
//         const words = description.split(' ');
//         return words.length > 15 ? words.slice(0, 15).join(' ') + '...' : description;
//     };
//     const toggleActionMenu = (id) => {
//         setOpenActionMenu((prevId) => (prevId === id ? null : id));
//     };
//     const responsiveOptions = [
//         { breakpoint: '1024px', numVisible: 5 },
//         { breakpoint: '768px', numVisible: 3 },
//         { breakpoint: '560px', numVisible: 1 }
//     ];
//     const breadcrumbHome = {
//         icon: 'pi pi-home',
//         command: () => {
//             navigate('/property-management/dashboard');
//         }
//     };
//     const breadcrumbItems = [
//         {
//             label: 'Feeds/Poll'
//         }
//     ];
//     const dynamicNumber = () => {
//         try {
//             setNumValues({
//                 num1: Math.floor(Math.random() * 10),
//                 num2: Math.floor(Math.random() * 10)
//             });
//         } catch (error) {}
//     };
//     const handleLikeOrAnswer = async (item) => {
//         try {
//             let requestBody;
//             if (item.type === 'feed') {
//                 // Existing feed like logic
//                 const newLikeStatus = !likedFeeds.has(item._id);
//                 console.log('newLikeStatus: ', newLikeStatus);
//                 requestBody = {
//                     status: newLikeStatus ? 1 : 0,
//                     itemId: item._id
//                 };

//                 // Immediately update local state
//                 setLikedFeeds((prevLikedFeeds) => {
//                     const updatedLikedFeeds = new Set(prevLikedFeeds);
//                     if (newLikeStatus) {
//                         updatedLikedFeeds.add(item._id);
//                         console.log('updatedLikedFeeds: ', updatedLikedFeeds);
//                     } else {
//                         updatedLikedFeeds.delete(item._id);
//                     }
//                     return updatedLikedFeeds;
//                 });
//             }
//             // ... rest of the existing code
//             const response = await dispatch(updateFeedData({ itemId: item._id }, requestBody));

//             if (response.error) {
//                 console.error('Error updating feed/poll data:', response.error);
//                 return;
//             }

//             refreshFeedData(); // Refresh data after successful update
//         } catch (error) {
//             console.error('Unexpected error in handleLikeOrAnswer:', error);
//         }
//     };
//     // const handleLikeOrAnswer = async (item) => {
//     //     try {
//     //         let requestBody;
//     //         if (item.type === 'feed') {
//     //             // Existing feed like logic
//     //             const newLikeStatus = !likedFeeds.has(item._id);
//     //             requestBody = {
//     //                 status: newLikeStatus ? 1 : 0,
//     //                 itemId: item._id
//     //             };
//     //             // ... (existing feed like state management)
//     //         } else if (item.type === 'poll') {
//     //             const selectedAnswer = selectedPollAnswers[item._id];
//     //             if (!selectedAnswer) return;

//     //             requestBody = {
//     //                 status: 1,
//     //                 answers: [selectedAnswer],
//     //                 itemId: item._id
//     //             };
//     //         }

//     //         const response = await dispatch(updateFeedData({ itemId: item._id }, requestBody));

//     //         if (response.error) {
//     //             console.error('Error updating feed/poll data:', response.error);
//     //             return;
//     //         }

//     //         refreshFeedData(); // Refresh data after successful update
//     //     } catch (error) {
//     //         console.error('Unexpected error in handleLikeOrAnswer:', error);
//     //     }
//     // };
//     // const refreshFeedData = async () => {
//     //     try {
//     //         const response = await dispatch(
//     //             getFeedData({
//     //                 current_page: 1,
//     //                 per_page: 10,
//     //                 search: '',
//     //                 order_column: 'updated_at',
//     //                 order_direction: -1
//     //             })
//     //         );
//     //         if (response) {
//     //             setFeedAndPollData({
//     //                 feeds: response.feed_listing || [],
//     //                 polls: response.poll_listing || []
//     //             });

//     //             const newLikedFeeds = new Set();
//     //             response.feed_listing.forEach((feed) => {
//     //                 if (feed.like?.includes(loginDetails._id)) {
//     //                     newLikedFeeds.add(feed._id);
//     //                 }
//     //             });
//     //             setLikedFeeds(newLikedFeeds);
//     //         }
//     //     } catch (error) {}
//     // };

//     // const handlePollOptionClick = (pollId, optionId) => {
//     //     setSelectedPollAnswers((prev) => ({
//     //         ...prev,
//     //         [pollId]: optionId
//     //     }));

//     //     setPollOptionCounts((prev) => ({
//     //         ...prev,
//     //         [pollId]: {
//     //             ...prev[pollId],
//     //             [optionId]: (prev[pollId]?.[optionId] || 0) + 1
//     //         }
//     //     }));
//     // };
//     const handlePollOptionClick = async (poll, option) => {
//         try {
//             // Immediately update the local state and localStorage
//             const updatedAnswers = {
//                 ...selectedPollAnswers,
//                 [poll._id]: option
//             };
//             setSelectedPollAnswers(updatedAnswers);
//             localStorage.setItem('pollAnswers', JSON.stringify(updatedAnswers));

//             // Dispatch the API call
//             const requestBody = {
//                 status: 1,
//                 answers: [option],
//                 itemId: poll._id
//             };

//             const response = await dispatch(updateFeedData({ itemId: poll._id }, requestBody));

//             if (response.error) {
//                 console.error('Error updating poll data:', response.error);
//                 // Revert the local state and localStorage if the API call fails
//                 const revertedAnswers = { ...updatedAnswers };
//                 delete revertedAnswers[poll._id];
//                 setSelectedPollAnswers(revertedAnswers);
//                 localStorage.setItem('pollAnswers', JSON.stringify(revertedAnswers));
//                 return;
//             }

//             // Refresh feed data to get the latest poll information
//             await refreshFeedData();
//         } catch (error) {
//             console.error('Unexpected error in handlePollOptionClick:', error);
//         }
//     };
//     const refreshFeedData = async () => {
//         try {
//             const response = await dispatch(
//                 getFeedData({
//                     current_page: 1,
//                     per_page: 10,
//                     search: '',
//                     order_column: 'created_at',  // Changed from 'updated_at' to 'created_at'
//                     order_direction: -1  // -1 for descending order (newest first)
//                 })
//             );

//             if (response?.feed_listing) {
//                 // Combine feeds and polls into a single array

//                 // Sort by creation date in descending order
//                 // const sortedItems = response?.feed_listing.sort((a, b) =>
//                 //     new Date(b.created_at) - new Date(a.created_at)
//                 // );
//                 // Separate back into feeds and polls while maintaining the sorted order
//                 const feeds = response?.feed_listing
//                 .filter(item => item.type === 'feed')
//                 .map(item => {
//                     const { type, ...feedData } = item;
//                     return feedData;
//                 });

//                 setFeedAndPollData(response?.feed_listing);

//                 // Set liked feeds
//                 const newLikedFeeds = new Set();
//                 feeds.forEach((feed) => {
//                     if (feed.like?.includes(loginDetails._id)) {
//                         newLikedFeeds.add(feed._id);
//                     }
//                 });
//                 setLikedFeeds(newLikedFeeds);
//             }
//         } catch (error) {
//             console.error('Error refreshing feed data:', error);
//         }
//     };
//     // const refreshFeedData = async () => {
//     //     try {
//     //         const response = await dispatch(
//     //             getFeedData({
//     //                 current_page: 1,
//     //                 per_page: 10,
//     //                 search: '',
//     //                 order_column: 'updated_at',
//     //                 order_direction: -1
//     //             })
//     //         );

//     //         if (response) {
//     //             setFeedAndPollData({
//     //                 feeds: response.feed_listing || [],
//     //                 polls: response.poll_listing || []
//     //             });

//     //             // Optional: Validate stored poll answers against current polls
//     //             const currentPollIds = new Set(response.poll_listing.map(poll => poll._id));
//     //             const updatedStoredAnswers = { ...selectedPollAnswers };

//     //             Object.keys(updatedStoredAnswers).forEach(pollId => {
//     //                 if (!currentPollIds.has(pollId)) {
//     //                     delete updatedStoredAnswers[pollId];
//     //                 }
//     //             });

//     //             if (Object.keys(updatedStoredAnswers).length !== Object.keys(selectedPollAnswers).length) {
//     //                 setSelectedPollAnswers(updatedStoredAnswers);
//     //                 localStorage.setItem('pollAnswers', JSON.stringify(updatedStoredAnswers));
//     //             }
//     //         }
//     //     } catch (error) {
//     //         console.error('Error refreshing feed data:', error);
//     //     }
//     // };
//     const itemTemplate = (item) => <img src={item.itemImageSrc} alt="Gallery Image" style={{ width: '500px', height: '500px', objectFit: 'cover', objectPosition: 'center' }} />;

//     const thumbnailTemplate = (item) => <img src={item.itemImageSrc} alt="Thumbnail" style={{ width: '500px', height: '500px', objectFit: 'cover', objectPosition: 'center' }} />;

//     const handlePollVote = (pollId, option) => {
//         setSelectedPollAnswers((prev) => ({
//             ...prev,
//             [pollId]: option
//         }));
//     };

//     const calculatePollStats = (poll) => {
//         const answers = poll?.answer || [];
//         const totalVotes = answers.length;
//         const optionsArray = poll.poll_options || [];
//         const stats = optionsArray.reduce((acc, option) => {
//             const votesForOption = answers.filter((answer) => answer == option).length;
//             const percentage = totalVotes === 0 ? 0 : (votesForOption / totalVotes) * 100;
//             acc[option] = percentage;
//             return acc;
//         }, {});
//         return { stats, totalVotes };
//     };

//     const getRoles = (permissionName) => {
//         try {
//             let checkPermission = false;
//             if (loginDetails) {
//                 loginDetails.role_permissions.forEach((b) => {
//                     const hasAccess = b.permission.find((x) => x.module_name === 'feed')?.module_access.includes(permissionName);
//                     if (hasAccess) {
//                         checkPermission = true;
//                     }
//                 });
//             }
//             return checkPermission;
//         } catch (error) {
//             console.log(error);
//             return false;
//         }
//     };

//     const handleDeleteSuccess = async () => {
//         try {
//             if (numValues?.num1 + numValues?.num2 === sumValue) {
//                 setSumValueError('');
//                 setDeleteModal(false);
//                 const response = await dispatch(deleteFeedData({ _id: deleteId?._id }));
//                 if (response) {
//                     refreshFeedData(); // Refresh data after successful deletion
//                 }
//                 setDeleteId(null);
//             } else {
//                 setSumValueError('Wrong Answer!');
//             }
//         } catch (error) {
//             console.error('Error deleting feed:', error);
//         }
//     };
//     useEffect(() => {
//         if (!deleteModal) {
//             setSumValue(null);
//             setSumValueError('');
//         }
//     }, [deleteModal]);

//     useEffect(() => {
//         refreshFeedData();
//     }, [dispatch]);

//     const deleteUserDialogFooter = () => {
//         try {
//             return (
//                 <>
//                     <Button
//                         label="No"
//                         icon="pi pi-times"
//                         className="p-button-outlined p-button-danger mr-2 mb-2"
//                         onClick={() => {
//                             setDeleteModal(false);
//                             setDeleteId(null);
//                             setSumValueError('');
//                             setSumValue(null);
//                         }}
//                     />
//                     <Button label="Yes" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2" onClick={handleDeleteSuccess} />
//                 </>
//             );
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const noDataFound = (!feedAndPollData || feedAndPollData.length === 0)

//     // If no data, render centered message
//     if (noDataFound) {
//         return (
//             <div className="relative min-h-full">
//                 <div className="flex justify-content-between align-items-center">
//                     <div className="flex flex-row w-full">
//                         <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Feeds</h5>
//                         <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                     </div>
//                 </div>
//                 <div className="flex justify-content-end">
//                     {getRoles('create') && <Button label="Add Feed/Poll" icon="pi pi-plus" className="p-button-outlined p-button-success mr-2 my-3 m-auto" onClick={() => navigate('/property-management/feeds/create-feed')} />}
//                 </div>
//                 <div className="flex flex-column justify-content-center align-items-center" style={{ height: 'calc(100vh - 250px)' }}>
//                     <img src="/static/media/No-data-pana.4ac9f4fdc24bf32b428b0327b6384686.svg" alt="No data found" className="h-20rem w-auto mb-4" />
//                     <div className="text-2xl text-gray-500">No Record Found</div>
//                 </div>
//             </div>
//         );
//     }

//     // const toggleExpand = (feedId) => {
//     //     setExpandedFeeds((prev) => {
//     //         const updated = new Map(prev);
//     //         updated.set(feedId, !updated.get(feedId)); // Toggle the state
//     //         return updated;
//     //     });
//     // };

//     return (
//         <div className="relative min-h-full">
//             <div className="flex justify-content-between align-items-center">
//                 <div className="flex flex-row w-full">
//                     <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Feeds And Polls</h5>
//                     <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
//                 </div>
//             </div>
//             <div className="flex justify-content-end">
//                 {getRoles('create') && <Button label="Add Feed/Poll" icon="pi pi-plus" className="p-button-outlined p-button-success mr-2 my-3 m-auto" onClick={() => navigate('/property-management/feeds/create-feed')} />}
//             </div>
//             <div className="grid crud-demo ml-0 mr-0">
//                 {feedAndPollData.map((feed) => {
//                     const { stats, totalVotes } = calculatePollStats(feed);
//                     const options = feed.poll_options || '[]';
//                     const isExpanded = expandedFeeds.get(feed._id) || false; // Default to false
//                     return feed.type === 'feed' ? (
//                         <div key={feed._id} className="col-12 mt-2">
//                             <div className="flex justify-content-center">
//                                 <div className="card p-shadow-3 p-p-3 p-mb-3 border-round-lg" ref={(el) => (actionMenuRef.current[feed._id] = el)} style={{ maxWidth: '500px', margin: 'auto', border: '1px solid #dbdbdb' }}>
//                                     {/* Header Section */}
//                                     <div className="flex justify-content-between align-items-center py-3 border-b border-gray-300">
//                                         <div className="flex align-items-center gap-3">
//                                             <img src={feed.userProfile || 'https://via.placeholder.com/50'} alt="user" height="40" width="40" style={{ borderRadius: '50%' }} />
//                                             <div className="flex flex-column">
//                                                 <span className="text-lg font-bold capitalize-first-letter  wrap-text text-container">{feed.title}</span>
//                                                 <span className="text-sm text-gray-500">@{feed.userName || 'Anonymous'}</span>
//                                             </div>
//                                         </div>
//                                         <div className="feed-card relative cursor-pointer" style={{ zIndex: '10' }}>
//                                             {(getRoles('update') || getRoles('delete')) && openActionMenu !== feed._id && (
//                                                 <div className="font-bold text-stone-950 cursor-pointer" onClick={() => toggleActionMenu(feed._id)}>
//                                                     <i className="pi pi-ellipsis-h text-lg"></i> {/* Using the same icon as in the first block */}
//                                                 </div>
//                                             )}
//                                             {openActionMenu === feed._id && (
//                                                 <div ref={(el) => (actionMenuRef.current[feed._id] = el)} className="absolute z-50 right-0 top-full mt-1 bg-white border shadow-lg rounded-lg p-2" style={{ minWidth: '150px' }}>
//                                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
//                                                         {getRoles('update') && (
//                                                             <Button
//                                                                 label="Edit"
//                                                                 icon="pi pi-pencil"
//                                                                 className="p-button-text p-button-info text-center w-full"
//                                                                 onClick={async () => {
//                                                                     await dispatch(getFeedDataByid({ _id: feed._id }));
//                                                                     navigate(`/property-management/feeds/edit-feed/${feed._id}`);
//                                                                     setOpenActionMenu(null); // Close menu after action
//                                                                 }}
//                                                             />
//                                                         )}
//                                                         {getRoles('delete') && (
//                                                             <Button
//                                                                 label="Delete"
//                                                                 icon="pi pi-trash"
//                                                                 className="p-button-text p-button-danger text-center w-full"
//                                                                 onClick={() => {
//                                                                     setDeleteModal(true);
//                                                                     setDeleteId(feed);
//                                                                     dynamicNumber();
//                                                                     setOpenActionMenu(null); // Close menu after action
//                                                                 }}
//                                                             />
//                                                         )}
//                                                         <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-secondary text-center w-full" onClick={() => setOpenActionMenu(null)} />
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Swiper Section for Images */}

//                                     {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
//                                             <Swiper
//                                                 modules={[Pagination]}
//                                                 pagination={{
//                                                     clickable: true,
//                                                     dynamicBullets: true // Enables dynamic bullets
//                                                 }}
//                                                 className="mySwiper"
//                                                 style={{ width: '100%', height: 'auto' }}
//                                             >
//                                                 {feed.images?.map((img, index) => (
//                                                     <SwiperSlide key={index} className="mb-5" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                                                         <div
//                                                             style={{
//                                                                 width: '600px',
//                                                                 height: '400px',
//                                                                 position: 'relative',
//                                                                 overflow: 'hidden'
//                                                             }}
//                                                         >
//                                                             <img
//                                                                 src={img.url || img || 'https://via.placeholder.com/500'}
//                                                                 alt={`Slide ${index + 1}`}
//                                                                 style={{
//                                                                     width: '100%',
//                                                                     height: '100%',
//                                                                     objectFit: 'cover',
//                                                                     objectPosition: 'center',
//                                                                     position: 'absolute'
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                     </SwiperSlide>
//                                                 ))}
//                                             </Swiper>
//                                         </div> */}
//                                     {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
//                                             <Swiper
//                                                 modules={[Pagination]}
//                                                 pagination={{
//                                                     clickable: true,
//                                                     dynamicBullets: true // Enables dynamic bullets
//                                                 }}
//                                                 className="mySwiper"
//                                                 style={{ width: '100%', height: 'auto' }}
//                                             >
//                                                 {feed.images?.map((img, index) => (
//                                                     <SwiperSlide key={index} className="mb-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                                                         <div
//                                                             style={{
//                                                                 width: '600px',
//                                                                 height: '400px',
//                                                                 position: 'relative',
//                                                                 overflow: 'hidden'
//                                                             }}
//                                                         >
//                                                             <Image
//                                                                 src={img.url || img || 'https://via.placeholder.com/500'}
//                                                                 alt={`Slide ${index + 1}`}
//                                                                 width="100%" // Adjust the width to fill the container
//                                                                 height="100%" // Adjust the height to fill the container
//                                                                 preview // Enable image preview functionality
//                                                                 style={{
//                                                                     width: '100%',
//                                                                     height: '100%',
//                                                                     objectFit: 'contain',
//                                                                     objectPosition: 'center',
//                                                                     position: 'absolute'
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                     </SwiperSlide>
//                                                 ))}
//                                             </Swiper>
//                                         </div> */}
//                                     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
//                                         <Swiper
//                                             modules={[Pagination]}
//                                             pagination={{
//                                                 clickable: true,
//                                                 dynamicBullets: true
//                                             }}
//                                             className="mySwiper"
//                                             style={{ width: '100%', height: 'auto' }}
//                                         >
//                                             {feed.images?.map((img, index) => (
//                                                 <SwiperSlide
//                                                     key={index}
//                                                     className="mb-4"
//                                                     style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
//                                                     onClick={() => {
//                                                         setCurrentIndex(index);
//                                                         setIsOpen(true);
//                                                     }} // Open lightbox on click
//                                                 >
//                                                     <div
//                                                         style={{
//                                                             width: '600px',
//                                                             height: '400px',
//                                                             position: 'relative',
//                                                             overflow: 'hidden'
//                                                         }}
//                                                     >
//                                                         <img
//                                                             src={img.url || img || 'https://via.placeholder.com/500'}
//                                                             alt={`Slide ${index + 1}`}
//                                                             style={{
//                                                                 width: '100%',
//                                                                 height: '100%',
//                                                                 objectFit: 'contain',
//                                                                 objectPosition: 'center',
//                                                                 position: 'absolute'
//                                                             }}
//                                                         />
//                                                     </div>
//                                                 </SwiperSlide>
//                                             ))}
//                                         </Swiper>
//                                         {/* Lightbox Component */}
//                                         {isOpen && feed.images && (
//                                             <Lightbox
//                                                 mainSrc={feed.images[currentIndex].url || feed.images[currentIndex] || 'https://via.placeholder.com/500'}
//                                                 nextSrc={feed.images[(currentIndex + 1) % feed.images.length].url || feed.images[(currentIndex + 1) % feed.images.length] || 'https://via.placeholder.com/500'}
//                                                 prevSrc={feed.images[(currentIndex + feed.images.length - 1) % feed.images.length].url || feed.images[(currentIndex + feed.images.length - 1) % feed.images.length] || 'https://via.placeholder.com/500'}
//                                                 onCloseRequest={() => setIsOpen(false)}
//                                                 onMovePrevRequest={() => setCurrentIndex((currentIndex + feed.images.length - 1) % feed.images.length)} // Inline previous image logic
//                                                 onMoveNextRequest={() => setCurrentIndex((currentIndex + 1) % feed.images.length)} // Inline next image logic
//                                             />
//                                         )}
//                                     </div>
//                                     <div className="flex align-items-center">
//                                         <i
//                                             className={`pi pi-heart${likedFeeds.has(feed._id) ? '-fill' : ''}`}
//                                             style={{
//                                                 fontSize: '1.5rem',
//                                                 color: likedFeeds.has(feed._id) ? 'red' : 'inherit',
//                                                 cursor: 'pointer'
//                                             }}
//                                             onClick={() => handleLikeOrAnswer(feed)}
//                                         ></i>
//                                         <span className="ml-2">{feed.like_count > 0 && `${feed.like_count} ${feed.like_count === 1 ? 'like' : 'likes'}`}</span>
//                                     </div>
//                                     <p
//                                         style={{
//                                             whiteSpace: isExpanded ? 'normal' : 'nowrap', // Allow wrapping when expanded
//                                             overflow: isExpanded ? 'visible' : 'hidden', // Hide overflow when collapsed
//                                             textOverflow: isExpanded ? 'unset' : 'ellipsis', // Add "..." when collapsed
//                                             wordWrap: 'break-word', // Break long words if necessary
//                                             wordBreak: 'break-word', // Ensure long unbreakable words wrap correctly
//                                             maxWidth: '100%' // Ensure text respects container width
//                                         }}
//                                         className="py-2 capitalize-first-letter"
//                                     >
//                                         {isExpanded ? feed?.description : getTruncatedDescription(feed?.description)}
//                                     </p>
//                                     {feed?.description.length > 100 && (
//                                         <span
//                                             className="text-sm cursor-pointer text-blue-600"
//                                             onClick={() => {
//                                                 setExpandedFeeds((prev) => {
//                                                     const updated = new Map(prev);
//                                                     updated.set(feed._id, !updated.get(feed._id));
//                                                     return updated;
//                                                 });
//                                             }}
//                                         >
//                                             {isExpanded ? ' Show Less' : 'Show More'}
//                                         </span>
//                                     )}
//                                     <div className="flex justify-between items-center mt-2">
//                                         <label className="text-lg">Date :</label>
//                                         <span className="text-lg capitalize-first-letter">{new Date(feed.created_at).toLocaleDateString()}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ) : (
//                         <div key={feed._id} className="col-12 mt-2">
//                             <div className="card p-shadow-3 p-p-3 p-mb-3 border-round-lg" ref={(el) => (actionMenuRef.current[feed._id] = el)} style={{ maxWidth: '500px', margin: 'auto' }}>
//                                 {/* Header Section */}
//                                 <div className="flex justify-content-between align-items-center py-3 border-b border-gray-300">
//                                     <div className="flex align-items-center gap-3">
//                                         <img src={feed.userProfile || 'https://via.placeholder.com/50'} alt="user" height="40" width="40" style={{ borderRadius: '50%' }} />
//                                         <div className="flex flex-column">
//                                             <span className="text-lg font-bold capitalize-first-letter  wrap-text text-container">{feed.title}</span>
//                                             <span className="text-sm text-gray-500">@{feed.userName || 'Anonymous'}</span>
//                                         </div>
//                                     </div>

//                                     <div className="poll-card relative cursor-pointer" style={{ zIndex: '10' }}>
//                                         {(getRoles('update') || getRoles('delete')) && openActionMenu !== feed._id && (
//                                             <div className="font-bold text-stone-950 cursor-pointer" onClick={() => toggleActionMenu(feed._id)}>
//                                                 <i className="pi pi-ellipsis-h text-lg"></i>
//                                             </div>
//                                         )}
//                                         {openActionMenu === feed._id && (
//                                             <div ref={(el) => (actionMenuRef.current[feed._id] = el)} className="absolute z-50 right-0 top-full mt-1 bg-white border shadow-lg rounded-lg shadow-lg p-2" style={{ minWidth: '150px' }}>
//                                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
//                                                     {getRoles('update') && (
//                                                         <Button
//                                                             label="Edit"
//                                                             icon="pi pi-pencil"
//                                                             className="p-button-text p-button-info text-center w-full"
//                                                             onClick={async () => {
//                                                                 await dispatch(getFeedDataByid({ _id: feed._id }));
//                                                                 navigate(`/property-management/feeds/edit-feed/${feed._id}`);
//                                                                 setOpenActionMenu(null); // Close menu after action
//                                                             }}
//                                                         />
//                                                     )}
//                                                     {getRoles('delete') && (
//                                                         <Button
//                                                             label="Delete"
//                                                             icon="pi pi-trash"
//                                                             className="p-button-text p-button-danger text-center w-full"
//                                                             onClick={() => {
//                                                                 setDeleteModal(true);
//                                                                 setDeleteId(feed);
//                                                                 dynamicNumber();
//                                                                 setOpenActionMenu(null); // Close menu after action
//                                                             }}
//                                                         />
//                                                     )}
//                                                     <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-secondary text-center w-full" onClick={() => setOpenActionMenu(null)} />
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                                 {/* Poll Options */}
//                                 <div className="flex flex-column">
//                                 {feed.type === "poll" &&
//                                 options.map((option) => {
//                                         const optionCount = feed.option_count?.find((countObj) => countObj.option === option)?.count || 0;

//                                         const isChecked = selectedPollAnswers[feed._id] === option;

//                                         return (
//                                             <div
//                                                 key={option}
//                                                 className="p-col p-d-flex p-ai-center p-jc-between p-mb-2 p-shadow-1 my-2 pt-3"
//                                                 style={{
//                                                     backgroundColor: '#DEE2E6',
//                                                     borderRadius: '8px'
//                                                 }}
//                                             >
//                                                 <div className="p-d-flex p-ai-center px-2">
//                                                     <RadioButton name={`poll-${feed._id}`} value={option} onChange={() => handlePollOptionClick(feed, option)} checked={isChecked} className="p-mr-2" />
//                                                     <label className="p-text-bold ml-2" onClick={() => handlePollOptionClick(feed, option)}>
//                                                         {option}
//                                                     </label>
//                                                 </div>

//                                                 <div style={{ flexGrow: 1, marginTop: '8px' }}>
//                                                     <ProgressBar className="h-20px" style={{ height: '15px' }} value={Math.round((optionCount / totalVotes) * 100 || 0)} displayValueTemplate={(value) => `${value}%`} />
//                                                 </div>
//                                             </div>
//                                         );
//                                     })
//                                     }
//                                 </div>

//                                 <div className="p-text-center mt-2">
//                                     Total Votes: <strong>{totalVotes}</strong>
//                                 </div>

//                                 {/* Poll Description */}
//                                 <p
//                                     style={{
//                                         whiteSpace: isExpanded ? 'normal' : 'nowrap',
//                                         overflow: isExpanded ? 'visible' : 'hidden',
//                                         textOverflow: isExpanded ? 'unset' : 'ellipsis',
//                                         wordWrap: 'break-word',
//                                         wordBreak: 'break-word',
//                                         maxWidth: '100%'
//                                     }}
//                                     className="py-2 capitalize-first-letter"
//                                 >
//                                     {isExpanded ? feed?.description : `${feed?.description.slice(0, 150)}...`}
//                                 </p>

//                                 {feed?.description.length > 150 && (
//                                     <span
//                                         className="text-sm cursor-pointer text-blue-600"
//                                         onClick={() => {
//                                             setExpandedPoll((prev) => {
//                                                 const updated = new Map(prev); // Clone the previous Map
//                                                 updated.set(feed._id, !updated.get(feed._id)); // Toggle the current poll's state
//                                                 return updated; // Return the updated Map
//                                             });
//                                         }}
//                                     >
//                                         {isExpanded ? 'Show Less' : 'Show More'}
//                                     </span>
//                                 )}
//                                 <div className="flex justify-between items-center">
//                                     <label className="text-lg font-bold">Date :</label>
//                                     <span className="text-lg font-bold capitalize-first-letter">{new Date(feed.created_at).toLocaleDateString()}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//             {modal && editData && editData.id !== undefined && (
//                 <EditFeeds
//                     editData={editData}
//                     onHide={() => {
//                         setModal(false);
//                         setEdit(null);
//                     }}
//                 />
//             )}
//             <DeleteModal
//                 isOpenDialog={deleteModal}
//                 modalFooter={() => deleteUserDialogFooter()}
//                 hideModal={() => {
//                     setDeleteModal(false);
//                     setDeleteId(null);
//                     setSumValueError('');
//                     setSumValue(null);
//                 }}
//                 numValues={numValues}
//                 sumValue={sumValue}
//                 setSumValue={setSumValue}
//                 sumValueError={sumValueError}
//                 setSumValueError={setSumValueError}
//                 modalDescription={'Are you sure you want to delete Feed/Poll?'}
//             />
//         </div>
//     );
// };

// export default Fides;

// import { Galleria } from 'primereact/galleria';
import { ProgressBar } from 'primereact/progressbar';
import { Ellipsis } from 'lucide-react';
import { RadioButton } from 'primereact/radiobutton';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
import { deleteFeedData, getFeedData, getFeedDataByid, updateFeedData } from '../../../../redux/slice/AdminSlices/feedSlice';
import EditFeeds from './editFeeds';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import moment from 'moment';
const { Button, BreadCrumb, useNavigate } = components;
const Fides = () => {
    const { SelectButton, Image, Button, DataTable, Column, InputText, React, useNavigate, BreadCrumb, Toolbar, Paginator, useState, useEffect, useDispatch, useSelector } = components;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loginDetails } = useSelector((store) => store.auth);
    const [feedAndPollData, setFeedAndPollData] = useState();
    // const [selectedPollAnswers, setSelectedPollAnswers] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);
    const [likedFeeds, setLikedFeeds] = useState(new Set());
    const [pollOptionCounts, setPollOptionCounts] = useState({});
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [sumValue, setSumValue] = useState(null);
    const [sumValueError, setSumValueError] = useState('');
    const [numValues, setNumValues] = useState({
        num1: 0,
        num2: 0
    });
    const [isOpen, setIsOpen] = useState(false);
    const [currentFeedId, setCurrentFeedId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };
    const actionMenuRef = useRef({});
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside all action menu references
            const isOutsideAll = Object.values(actionMenuRef.current).every((ref) => ref && !ref.contains(event.target));

            if (isOutsideAll) {
                setOpenActionMenu(null);
            }
        };
        // Add event listener when component mounts
        document.addEventListener('mousedown', handleClickOutside);
        // Cleanup event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const [modal, setModal] = useState(false);
    const [editData, setEdit] = useState(null);
    const [expandedFeeds, setExpandedFeeds] = useState(new Map());
    const [expandedPoll, setExpandedPoll] = useState(new Map());
    // Modify the selectedPollAnswers to use localStorage
    const [selectedPollAnswers, setSelectedPollAnswers] = useState(() => {
        // Initialize from localStorage or empty object
        const storedAnswers = localStorage.getItem('pollAnswers');
        return storedAnswers ? JSON.parse(storedAnswers) : {};
    });
    // Effect to update localStorage whenever selectedPollAnswers changes
    useEffect(() => {
        localStorage.setItem('pollAnswers', JSON.stringify(selectedPollAnswers));
    }, [selectedPollAnswers]);
    // Function to truncate the description
    const getTruncatedDescription = (description) => {
        const words = description.split(' ');
        return words.length > 15 ? words.slice(0, 15).join(' ') + '...' : description;
    };
    const toggleActionMenu = (id) => {
        setOpenActionMenu((prevId) => (prevId === id ? null : id));
    };
    const responsiveOptions = [
        { breakpoint: '1024px', numVisible: 5 },
        { breakpoint: '768px', numVisible: 3 },
        { breakpoint: '560px', numVisible: 1 }
    ];
    const breadcrumbHome = {
        icon: 'pi pi-home',
        command: () => {
            navigate('/property-management/dashboard');
        }
    };
    const breadcrumbItems = [
        {
            label: 'Feeds/Poll'
        }
    ];
    const dynamicNumber = () => {
        try {
            setNumValues({
                num1: Math.floor(Math.random() * 10),
                num2: Math.floor(Math.random() * 10)
            });
        } catch (error) {}
    };
    const handleLikeOrAnswer = async (item) => {
        try {
            let requestBody;
            if (item.type === 'feed') {
                // Existing feed like logic
                const newLikeStatus = !likedFeeds.has(item._id);
                console.log('newLikeStatus: ', newLikeStatus);
                requestBody = {
                    status: newLikeStatus ? 1 : 0,
                    itemId: item._id
                };

                // Immediately update local state
                setLikedFeeds((prevLikedFeeds) => {
                    const updatedLikedFeeds = new Set(prevLikedFeeds);
                    if (newLikeStatus) {
                        updatedLikedFeeds.add(item._id);
                        console.log('updatedLikedFeeds: ', updatedLikedFeeds);
                    } else {
                        updatedLikedFeeds.delete(item._id);
                    }
                    return updatedLikedFeeds;
                });
            }
            // ... rest of the existing code
            const response = await dispatch(updateFeedData({ itemId: item._id }, requestBody));

            if (response.error) {
                console.error('Error updating feed/poll data:', response.error);
                return;
            }

            refreshFeedData(); // Refresh data after successful update
        } catch (error) {
            console.error('Unexpected error in handleLikeOrAnswer:', error);
        }
    };
    // const handleLikeOrAnswer = async (item) => {
    //     try {
    //         let requestBody;
    //         if (item.type === 'feed') {
    //             // Existing feed like logic
    //             const newLikeStatus = !likedFeeds.has(item._id);
    //             requestBody = {
    //                 status: newLikeStatus ? 1 : 0,
    //                 itemId: item._id
    //             };
    //             // ... (existing feed like state management)
    //         } else if (item.type === 'poll') {
    //             const selectedAnswer = selectedPollAnswers[item._id];
    //             if (!selectedAnswer) return;

    //             requestBody = {
    //                 status: 1,
    //                 answers: [selectedAnswer],
    //                 itemId: item._id
    //             };
    //         }

    //         const response = await dispatch(updateFeedData({ itemId: item._id }, requestBody));

    //         if (response.error) {
    //             console.error('Error updating feed/poll data:', response.error);
    //             return;
    //         }

    //         refreshFeedData(); // Refresh data after successful update
    //     } catch (error) {
    //         console.error('Unexpected error in handleLikeOrAnswer:', error);
    //     }
    // };
    // const refreshFeedData = async () => {
    //     try {
    //         const response = await dispatch(
    //             getFeedData({
    //                 current_page: 1,
    //                 per_page: 10,
    //                 search: '',
    //                 order_column: 'updated_at',
    //                 order_direction: -1
    //             })
    //         );
    //         if (response) {
    //             setFeedAndPollData({
    //                 feeds: response.feed_listing || [],
    //                 polls: response.poll_listing || []
    //             });

    //             const newLikedFeeds = new Set();
    //             response.feed_listing.forEach((feed) => {
    //                 if (feed.like?.includes(loginDetails._id)) {
    //                     newLikedFeeds.add(feed._id);
    //                 }
    //             });
    //             setLikedFeeds(newLikedFeeds);
    //         }
    //     } catch (error) {}
    // };

    // const handlePollOptionClick = (pollId, optionId) => {
    //     setSelectedPollAnswers((prev) => ({
    //         ...prev,
    //         [pollId]: optionId
    //     }));

    //     setPollOptionCounts((prev) => ({
    //         ...prev,
    //         [pollId]: {
    //             ...prev[pollId],
    //             [optionId]: (prev[pollId]?.[optionId] || 0) + 1
    //         }
    //     }));
    // };
    const handlePollOptionClick = async (poll, option) => {
        try {
            // Immediately update the local state and localStorage
            const updatedAnswers = {
                ...selectedPollAnswers,
                [poll._id]: option
            };
            setSelectedPollAnswers(updatedAnswers);
            localStorage.setItem('pollAnswers', JSON.stringify(updatedAnswers));

            // Dispatch the API call
            const requestBody = {
                status: 1,
                answers: [option],
                itemId: poll._id
            };

            const response = await dispatch(updateFeedData({ itemId: poll._id }, requestBody));

            if (response.error) {
                console.error('Error updating poll data:', response.error);
                // Revert the local state and localStorage if the API call fails
                const revertedAnswers = { ...updatedAnswers };
                delete revertedAnswers[poll._id];
                setSelectedPollAnswers(revertedAnswers);
                localStorage.setItem('pollAnswers', JSON.stringify(revertedAnswers));
                return;
            }

            // Refresh feed data to get the latest poll information
            await refreshFeedData();
        } catch (error) {
            console.error('Unexpected error in handlePollOptionClick:', error);
        }
    };
    const refreshFeedData = async () => {
        try {
            const response = await dispatch(
                getFeedData({
                    current_page: 1,
                    per_page: 10,
                    search: '',
                    order_column: 'created_at', // Changed from 'updated_at' to 'created_at'
                    order_direction: -1 // -1 for descending order (newest first)
                })
            );

            if (response?.feed_listing) {
                // Combine feeds and polls into a single array

                // Sort by creation date in descending order
                // const sortedItems = response?.feed_listing.sort((a, b) =>
                //     new Date(b.created_at) - new Date(a.created_at)
                // );
                // Separate back into feeds and polls while maintaining the sorted order
                const feeds = response?.feed_listing
                    .filter((item) => item.type === 'feed')
                    .map((item) => {
                        const { type, ...feedData } = item;
                        return feedData;
                    });

                setFeedAndPollData(response?.feed_listing);

                // Set liked feeds
                const newLikedFeeds = new Set();
                feeds.forEach((feed) => {
                    if (feed.like?.includes(loginDetails._id)) {
                        newLikedFeeds.add(feed._id);
                    }
                });
                setLikedFeeds(newLikedFeeds);
            }
        } catch (error) {
            console.error('Error refreshing feed data:', error);
        }
    };
    // const refreshFeedData = async () => {
    //     try {
    //         const response = await dispatch(
    //             getFeedData({
    //                 current_page: 1,
    //                 per_page: 10,
    //                 search: '',
    //                 order_column: 'updated_at',
    //                 order_direction: -1
    //             })
    //         );

    //         if (response) {
    //             setFeedAndPollData({
    //                 feeds: response.feed_listing || [],
    //                 polls: response.poll_listing || []
    //             });

    //             // Optional: Validate stored poll answers against current polls
    //             const currentPollIds = new Set(response.poll_listing.map(poll => poll._id));
    //             const updatedStoredAnswers = { ...selectedPollAnswers };

    //             Object.keys(updatedStoredAnswers).forEach(pollId => {
    //                 if (!currentPollIds.has(pollId)) {
    //                     delete updatedStoredAnswers[pollId];
    //                 }
    //             });

    //             if (Object.keys(updatedStoredAnswers).length !== Object.keys(selectedPollAnswers).length) {
    //                 setSelectedPollAnswers(updatedStoredAnswers);
    //                 localStorage.setItem('pollAnswers', JSON.stringify(updatedStoredAnswers));
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error refreshing feed data:', error);
    //     }
    // };
    const itemTemplate = (item) => <img src={item.itemImageSrc} alt="Gallery Image" style={{ width: '500px', height: '500px', objectFit: 'cover', objectPosition: 'center' }} />;

    const thumbnailTemplate = (item) => <img src={item.itemImageSrc} alt="Thumbnail" style={{ width: '500px', height: '500px', objectFit: 'cover', objectPosition: 'center' }} />;

    const handlePollVote = (pollId, option) => {
        setSelectedPollAnswers((prev) => ({
            ...prev,
            [pollId]: option
        }));
    };

    const calculatePollStats = (poll) => {
        const answers = poll?.answer || [];
        const totalVotes = answers.length;
        const optionsArray = poll.poll_options || [];
        const stats = optionsArray.reduce((acc, option) => {
            const votesForOption = answers.filter((answer) => answer == option).length;
            const percentage = totalVotes === 0 ? 0 : (votesForOption / totalVotes) * 100;
            acc[option] = percentage;
            return acc;
        }, {});
        return { stats, totalVotes };
    };

    const getRoles = (permissionName) => {
        try {
            let checkPermission = false;
            if (loginDetails) {
                loginDetails.role_permissions.forEach((b) => {
                    const hasAccess = b.permission.find((x) => x.module_name === 'feed')?.module_access.includes(permissionName);
                    if (hasAccess) {
                        checkPermission = true;
                    }
                });
            }
            return checkPermission;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const handleDeleteSuccess = async () => {
        try {
            if (numValues?.num1 + numValues?.num2 === sumValue) {
                setSumValueError('');
                setDeleteModal(false);
                const response = await dispatch(deleteFeedData({ _id: deleteId?._id }));
                if (response) {
                    refreshFeedData(); // Refresh data after successful deletion
                }
                setDeleteId(null);
            } else {
                setSumValueError('Wrong Answer!');
            }
        } catch (error) {
            console.error('Error deleting feed:', error);
        }
    };
    useEffect(() => {
        if (!deleteModal) {
            setSumValue(null);
            setSumValueError('');
        }
    }, [deleteModal]);

    useEffect(() => {
        refreshFeedData();
    }, [dispatch]);

    const deleteUserDialogFooter = () => {
        try {
            return (
                <>
                    <Button
                        label="No"
                        icon="pi pi-times"
                        className="p-button-outlined p-button-danger mr-2 mb-2"
                        onClick={() => {
                            setDeleteModal(false);
                            setDeleteId(null);
                            setSumValueError('');
                            setSumValue(null);
                        }}
                    />
                    <Button label="Yes" icon="pi pi-check" className="p-button-outlined p-button-success mr-2 mb-2" onClick={handleDeleteSuccess} />
                </>
            );
        } catch (error) {
            console.log(error);
        }
    };
    const noDataFound = !feedAndPollData || feedAndPollData.length === 0;

    // If no data, render centered message
    if (noDataFound) {
        return (
            <div className="relative min-h-full">
                <div className="flex justify-content-between align-items-center">
                    <div className="flex flex-row w-full">
                        <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Feeds</h5>
                        <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                    </div>
                </div>
                <div className="flex justify-content-end">
                    {getRoles('create') && <Button label="Add Feed/Poll" icon="pi pi-plus" className="p-button-outlined p-button-success mr-2 my-3 m-auto" onClick={() => navigate('/property-management/feeds/create-feed')} />}
                </div>
                <div className="flex flex-column justify-content-center align-items-center" style={{ height: 'calc(100vh - 250px)' }}>
                    <img src="/static/media/No-data-pana.4ac9f4fdc24bf32b428b0327b6384686.svg" alt="No data found" className="h-20rem w-auto mb-4" />
                    <div className="text-2xl text-gray-500">No Record Found</div>
                </div>
            </div>
        );
    }

    // const toggleExpand = (feedId) => {
    //     setExpandedFeeds((prev) => {
    //         const updated = new Map(prev);
    //         updated.set(feedId, !updated.get(feedId)); // Toggle the state
    //         return updated;
    //     });
    // };

    return (
        <div className="relative min-h-full">
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Feeds And Polls</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="flex justify-content-end">
                {getRoles('create') && <Button label="Add Feed/Poll" icon="pi pi-plus" className="p-button-outlined p-button-success mr-2 my-3 m-auto" onClick={() => navigate('/property-management/feeds/create-feed')} />}
            </div>
            <div
                style={{
                    width: '100%',
                    // maxWidth: '1024px',
                    maxWidth: '50rem',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '16px'
                }}
            >
                {feedAndPollData.map((feed) => {
                    const { stats, totalVotes } = calculatePollStats(feed);
                    const options = feed.poll_options || '[]';
                    const isExpanded = expandedFeeds.get(feed._id) || false; // Default to false
                    return feed.type === 'feed' ? (
                        <div
                            key={feed._id}
                            className="card"
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #dbdbdb',
                                background: '#fff'
                            }}
                        >
                            {/* Header */}
                            <div className="card-header" style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
                                <div className="flex align-items-center gap-3">
                                    <img src={feed.userProfile || 'https://via.placeholder.com/50'} alt="user" height="60" width="60" style={{ borderRadius: '50%' }} />
                                    <div className="flex flex-column">
                                        <span className="text-2xl font-bold capitalize-first-letter  wrap-text text-container">{feed.title}</span>
                                        <span className="text-xl text-gray-500">@{feed.userName || 'Anonymous'}</span>
                                    </div>
                                </div>
                                <div className="feed-card relative cursor-pointer" style={{ zIndex: '10' }}>
                                    {(getRoles('update') || getRoles('delete')) && openActionMenu !== feed._id && (
                                        <div className="font-bold text-stone-950 cursor-pointer" onClick={() => toggleActionMenu(feed._id)}>
                                            <i className="pi pi-ellipsis-h text-lg"></i> {/* Using the same icon as in the first block */}
                                        </div>
                                    )}
                                    {openActionMenu === feed._id && (
                                        <div ref={(el) => (actionMenuRef.current[feed._id] = el)} className="absolute z-50 right-0 top-full mt-1 bg-white border shadow-lg rounded-lg p-2" style={{ minWidth: '150px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                {getRoles('update') && (
                                                    <Button
                                                        label="Edit"
                                                        icon="pi pi-pencil"
                                                        className="p-button-text p-button-info text-center w-full"
                                                        onClick={async () => {
                                                            await dispatch(getFeedDataByid({ _id: feed._id }));
                                                            navigate(`/property-management/feeds/edit-feed/${feed._id}`);
                                                            setOpenActionMenu(null); // Close menu after action
                                                        }}
                                                    />
                                                )}
                                                {getRoles('delete') && (
                                                    <Button
                                                        label="Delete"
                                                        icon="pi pi-trash"
                                                        className="p-button-text p-button-danger text-center w-full"
                                                        onClick={() => {
                                                            setDeleteModal(true);
                                                            setDeleteId(feed);
                                                            dynamicNumber();
                                                            setOpenActionMenu(null); // Close menu after action
                                                        }}
                                                    />
                                                )}
                                                <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-secondary text-center w-full" onClick={() => setOpenActionMenu(null)} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Media Section */}
                            {feed.images && (
                                <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
                                    {/* <Swiper modules={[Pagination]} pagination={{ clickable: true }} style={{ width: '100%' }}>
                                        {feed.images.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    src={img.url || img}
                                                    alt={`Slide ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        maxHeight: '100vh',
                                                        objectFit: 'fill'
                                                    }}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper> */}
                                    <Swiper
                                        modules={[Pagination]}
                                        pagination={{
                                            clickable: true,
                                            dynamicBullets: true
                                        }}
                                        className="mySwiper"
                                        style={{ width: '100%', height: 'auto' }}
                                    >
                                        {feed.images?.map((img, index) => (
                                            <SwiperSlide
                                                key={index}
                                                className="mb-4"
                                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                onClick={() => {
                                                    // Store the current feed's images and index
                                                    setCurrentIndex(index);
                                                    setIsOpen(true);
                                                    // Store the current feed's ID to ensure we're showing the correct images
                                                    setCurrentFeedId(feed._id);
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: '600px',
                                                        height: '400px',
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <img
                                                        src={img.url || img || 'https://via.placeholder.com/500'}
                                                        alt={`Slide ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'contain',
                                                            objectPosition: 'center',
                                                            position: 'absolute'
                                                        }}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    {/* Lightbox Component */}
                                    {isOpen && currentFeedId === feed._id && feed.images && (
                                        <Lightbox
                                            mainSrc={feed.images[currentIndex]?.url || feed.images[currentIndex] || 'https://via.placeholder.com/500'}
                                            nextSrc={feed.images[(currentIndex + 1) % feed.images.length]?.url || feed.images[(currentIndex + 1) % feed.images.length] || 'https://via.placeholder.com/500'}
                                            prevSrc={feed.images[(currentIndex + feed.images.length - 1) % feed.images.length]?.url || feed.images[(currentIndex + feed.images.length - 1) % feed.images.length] || 'https://via.placeholder.com/500'}
                                            onCloseRequest={() => {
                                                setIsOpen(false);
                                                setCurrentFeedId(null);
                                            }}
                                            onMovePrevRequest={() => setCurrentIndex((currentIndex + feed.images.length - 1) % feed.images.length)}
                                            onMoveNextRequest={() => setCurrentIndex((currentIndex + 1) % feed.images.length)}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Action Section */}
                            <div
                                style={{
                                    padding: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}
                            >
                                {/* Like Button */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <i
                                        className={`pi pi-heart${likedFeeds.has(feed._id) ? '-fill' : ''}`}
                                        style={{
                                            fontSize: '2rem',
                                            color: likedFeeds.has(feed._id) ? 'red' : 'inherit',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleLikeOrAnswer(feed)}
                                    ></i>
                                    <span style={{ marginLeft: '8px' }} class="text-xl">
                                        {feed.like_count > 0 && `${feed.like_count} likes`}
                                    </span>
                                </div>

                                {/* Description */}
                                <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} class="text-xl">
                                    {feed.description.length > 100 && !isExpanded ? `${feed.description.slice(0, 100)}...` : feed.description}
                                </p>
                                {feed.description.length > 100 && (
                                    <button
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#007BFF',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            padding: 0
                                        }}
                                        className="text-lg"
                                        onClick={() => {
                                            setExpandedFeeds((prev) => {
                                                const updated = new Map(prev);
                                                updated.set(feed._id, !updated.get(feed._id));
                                                return updated;
                                            });
                                        }}
                                    >
                                        {isExpanded ? 'Show less' : 'Show more'}
                                    </button>
                                )}
                                {/* <div className="flex justify-between items-center mt-2">
                                    <label className="text-xl">Date:</label>
                                    <span className="text-xl capitalize-first-letter">{moment(feed.created_at).format('D MMM YY')}</span>
                                </div> */}
                                <div className="flex justify-between items-center mt-2">
                                    {/* <label className="text-xl">Date:</label> */}
                                    <span className="text-xl capitalize-first-letter">{moment(feed.created_at).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={feed._id}
                            className="card"
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #dbdbdb',
                                background: '#fff'
                            }}
                        >
                            <div ref={(el) => (actionMenuRef.current[feed._id] = el)}>
                                {/* Header Section */}
                                <div className="flex justify-content-between align-items-center py-3 border-b border-gray-300">
                                    <div className="flex align-items-center gap-3">
                                        <img src={feed.userProfile || 'https://via.placeholder.com/50'} alt="user" height="60" width="60" style={{ borderRadius: '50%' }} />
                                        <div className="flex flex-column">
                                            <span className="text-2xl font-bold capitalize-first-letter  wrap-text text-container">{feed.title}</span>
                                            <span className="text-xl text-gray-500">@{feed.userName || 'Anonymous'}</span>
                                        </div>
                                    </div>

                                    <div className="poll-card relative cursor-pointer" style={{ zIndex: '10' }}>
                                        {(getRoles('update') || getRoles('delete')) && openActionMenu !== feed._id && (
                                            <div className="font-bold text-stone-950 cursor-pointer" onClick={() => toggleActionMenu(feed._id)}>
                                                <i className="pi pi-ellipsis-h text-lg"></i>
                                            </div>
                                        )}
                                        {openActionMenu === feed._id && (
                                            <div ref={(el) => (actionMenuRef.current[feed._id] = el)} className="absolute z-50 right-0 top-full mt-1 bg-white border shadow-lg rounded-lg shadow-lg p-2" style={{ minWidth: '150px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    {getRoles('update') && (
                                                        <Button
                                                            label="Edit"
                                                            icon="pi pi-pencil"
                                                            className="p-button-text p-button-info text-center w-full"
                                                            onClick={async () => {
                                                                await dispatch(getFeedDataByid({ _id: feed._id }));
                                                                navigate(`/property-management/feeds/edit-feed/${feed._id}`);
                                                                setOpenActionMenu(null); // Close menu after action
                                                            }}
                                                        />
                                                    )}
                                                    {getRoles('delete') && (
                                                        <Button
                                                            label="Delete"
                                                            icon="pi pi-trash"
                                                            className="p-button-text p-button-danger text-center w-full"
                                                            onClick={() => {
                                                                setDeleteModal(true);
                                                                setDeleteId(feed);
                                                                dynamicNumber();
                                                                setOpenActionMenu(null); // Close menu after action
                                                            }}
                                                        />
                                                    )}
                                                    <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-secondary text-center w-full" onClick={() => setOpenActionMenu(null)} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Poll Options */}
                                <div className="flex flex-column">
                                    {feed.type === 'poll' &&
                                        options.map((option) => {
                                            const optionCount = feed.option_count?.find((countObj) => countObj.option === option)?.count || 0;

                                            const isChecked = selectedPollAnswers[feed._id] === option;

                                            return (
                                                <div
                                                    key={option}
                                                    className="p-col p-d-flex p-ai-center p-jc-between p-mb-2 p-shadow-1 my-2 pt-3"
                                                    style={{
                                                        backgroundColor: '#DEE2E6',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <div className="p-d-flex p-ai-center px-2">
                                                        <RadioButton name={`poll-${feed._id}`} value={option} onChange={() => handlePollOptionClick(feed, option)} checked={isChecked} className="p-mr-2" />
                                                        <label className="text-xl ml-2" onClick={() => handlePollOptionClick(feed, option)}>
                                                            {option}
                                                        </label>
                                                    </div>

                                                    <div style={{ flexGrow: 1, marginTop: '8px' }}>
                                                        <ProgressBar className="h-20px" style={{ height: '15px' }} value={Math.round((optionCount / totalVotes) * 100 || 0)} displayValueTemplate={(value) => `${value}%`} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                <div className="p-text-center mt-2">
                                    Total Votes: <strong>{totalVotes}</strong>
                                </div>

                                {/* Poll Description */}
                                {/* <p
                                    style={{
                                        whiteSpace: isExpanded ? 'normal' : 'nowrap',
                                        overflow: isExpanded ? 'visible' : 'hidden',
                                        textOverflow: isExpanded ? 'unset' : 'ellipsis',
                                        wordWrap: 'break-word',
                                        wordBreak: 'break-word',
                                        maxWidth: '100%'
                                    }}
                                    className="py-2 capitalize-first-letter"
                                >
                                    {isExpanded ? feed?.description : `${feed?.description.slice(0, 150)}...`}
                                </p>
                                {feed?.description.length > 150 && (
                                    <span
                                        className="text-sm cursor-pointer text-blue-600"
                                        onClick={() => {
                                            setExpandedPoll((prev) => {
                                                const updated = new Map(prev); // Clone the previous Map
                                                updated.set(feed._id, !updated.get(feed._id)); // Toggle the current poll's state
                                                return updated; // Return the updated Map
                                            });
                                        }}
                                    >
                                        {isExpanded ? 'Show Less' : 'Show More'}
                                    </span>
                                )} */}
                                {/* Poll Description */}
                                <p
                                    style={{
                                        whiteSpace: expandedPoll.get(feed._id) ? 'normal' : 'nowrap',
                                        overflow: expandedPoll.get(feed._id) ? 'visible' : 'hidden',
                                        textOverflow: expandedPoll.get(feed._id) ? 'unset' : 'ellipsis',
                                        wordWrap: 'break-word',
                                        wordBreak: 'break-word',
                                        maxWidth: '100%'
                                    }}
                                    className="py-2 capitalize-first-letter"
                                >
                                    {expandedPoll.get(feed._id) ? feed?.description : `${feed?.description.slice(0, 150)}...`}
                                </p>

                                {feed?.description.length > 150 && (
                                    <span
                                        className="text-sm cursor-pointer text-blue-600"
                                        onClick={() => {
                                            setExpandedPoll((prev) => {
                                                const updated = new Map(prev);
                                                updated.set(feed._id, !updated.get(feed._id));
                                                return updated;
                                            });
                                        }}
                                    >
                                        {expandedPoll.get(feed._id) ? 'Show Less' : 'Show More'}
                                    </span>
                                )}
                                {/* <div className="flex justify-between items-center mt-2">
                                    <label className="text-lg">Date :</label>
                                    <span className="text-lg capitalize-first-letter">{new Date(feed.created_at).toLocaleDateString()}</span>
                                </div> */}
                                <div className="flex justify-between items-center mt-2">
                                    {/* <label className="text-lg">Date :</label> */}
                                    <span className="text-lg capitalize-first-letter">{moment(feed.created_at).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {modal && editData && editData.id !== undefined && (
                <EditFeeds
                    editData={editData}
                    onHide={() => {
                        setModal(false);
                        setEdit(null);
                    }}
                />
            )}
            <DeleteModal
                isOpenDialog={deleteModal}
                modalFooter={() => deleteUserDialogFooter()}
                hideModal={() => {
                    setDeleteModal(false);
                    setDeleteId(null);
                    setSumValueError('');
                    setSumValue(null);
                }}
                numValues={numValues}
                sumValue={sumValue}
                setSumValue={setSumValue}
                sumValueError={sumValueError}
                setSumValueError={setSumValueError}
                modalDescription={'Are you sure you want to delete Feed/Poll?'}
            />
        </div>
    );
};

export default Fides;
