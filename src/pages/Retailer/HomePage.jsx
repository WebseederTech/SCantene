import React, { useState, useEffect } from "react";
import { AiOutlineBell } from "react-icons/ai";
import { FaLocationArrow, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useSelector } from "react-redux";
import NotificationList from "../Auth/Notification";
import { BASE_URL } from "../../redux/constants";

const HomePage = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data: products, isLoading, isError } = useAllProductsQuery();
    const [cartCount, setCartCount] = useState(3);
    const [showNotification, setShowNotification] = useState(false);
    const [isCardHovered, setIsCardHovered] = useState(false);
    const [carouselImages, setCarouselImages] = useState([]);
    const [imageName, setImageName] = useState("");
    const { userInfo } = useSelector((state) => state.auth);
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const location = storedData?.addresses[0]?.city;
    const username = storedData?.username;
    const [heading, setHeading] = useState("Shop By Category");
    const [paragraph, setParagraph] = useState("Browse Our Exclusive Collections");
    const [newProducts, setNewProducts] = useState([]);
    const [newProductName, setNewProductName] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newProductImage, setNewProductImage] = useState(null);
    const [recommendedHeading, setRecommendedHeading] = useState('');
    const [recommendedParagraph, setRecommendedParagraph] = useState('');
    const storedCarouselData = JSON.parse(localStorage.getItem("carouselData")) || [];
    const storedCarouselHeading = localStorage.getItem("carouselHeading") || '';
    const [carouselHeading, setCarouselHeading] = useState(storedCarouselHeading);
    const [newImageName, setNewImageName] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [carouselData, setCarouselData] = useState(storedCarouselData);
    const [adHeading, setAdHeading] = useState('');
    const [adParagraph, setAdParagraph] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [sectionHeading, setSectionHeading] = useState('');
    const [offerHeading, setOfferHeading] = useState('Exclusive Product Offers');
    const [offerParagraph, setOfferParagraph] = useState('Check out our top selling products with great discounts');

    const [offerProducts, setOfferProducts] = useState([
        { id: 1, title: '', description: '', image: '' },
        { id: 2, title: '', description: '', image: '' },
        { id: 3, title: '', description: '', image: '' },
        { id: 4, title: '', description: '', image: '' },
    ]);

    const loadCategoriesFromLocalStorage = () => {
        const savedCategories = JSON.parse(localStorage.getItem('categories'));
        if (savedCategories) {
            return savedCategories;
        }
        return [
            { title: '', items: [{ name: '', image: '' }, { name: '', image: '' }, { name: '', image: '' }, { name: '', image: '' }] },
            { title: '', items: [{ name: '', image: '' }, { name: '', image: '' }, { name: '', image: '' }, { name: '', image: '' }] },
            { title: '', items: [{ name: '', image: '' }, { name: '', image: '' }, { name: '', image: '' }, { name: '', image: '' }] },
            { title: '', items: [{ name: '', image: '' }, { name: '', image: '' }, { name: '', image: '' }, { name: '', image: '' }] },
        ];
    };

    const [categories, setCategories] = useState(loadCategoriesFromLocalStorage);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleBellMouseEnter = () => setShowNotification(true);
    const handleBellMouseLeave = () => {
        if (!isCardHovered) {
            setShowNotification(false);
        }
    };

    const handleCardMouseEnter = () => setIsCardHovered(true);
    const handleCardMouseLeave = () => {
        setIsCardHovered(false);
        setShowNotification(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a valid image file (PNG, JPG, JPEG, WEBP).");
            return;
        }

        reader.onloadend = () => {
            const newImage = {
                name: imageName || "Image",
                url: reader.result,
            };

            setCarouselImages((prevImages) => {
                const updatedImages = [...prevImages, newImage];
                localStorage.setItem("carouselImages", JSON.stringify(updatedImages));
                return updatedImages;
            });

            setImageName("");
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleNameChange = (event) => {
        setImageName(event.target.value);
    };

    const removeImage = (index) => {
        setCarouselImages((prevImages) => {
            const updatedImages = prevImages.filter((_, i) => i !== index);
            localStorage.setItem("carouselImages", JSON.stringify(updatedImages));
            return updatedImages;
        });
    };

    useEffect(() => {
        const savedImages = localStorage.getItem("carouselImages");
        if (savedImages) {
            setCarouselImages(JSON.parse(savedImages));
        }
    }, []);

    const handleProductImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProductImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addProduct = () => {
        if (newProductName && newCategoryName && newProductImage) {
            const newProduct = {
                _id: Date.now(),
                name: newProductName,
                category: { name: newCategoryName },
                images: [newProductImage],
            };

            const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
            storedProducts.push(newProduct);
            localStorage.setItem('products', JSON.stringify(storedProducts));

            setNewProducts(storedProducts);
            setNewProductName("");
            setNewCategoryName("");
            setNewProductImage(null);
        } else {
            alert("Please fill in all fields to add a product.");
        }
    };

    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem("products"));
        if (storedProducts) {
            setNewProducts(storedProducts);
        }
    }, []);

    const handleCancelProduct = (productId) => {
        const updatedProducts = newProducts.filter(product => product._id !== productId);
        setNewProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    };

    useEffect(() => {
        const savedHeading = localStorage.getItem("heading");
        const savedParagraph = localStorage.getItem("paragraph");

        if (savedHeading) {
            setHeading(savedHeading);
        }

        if (savedParagraph) {
            setParagraph(savedParagraph);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("heading", heading);
    }, [heading]);

    useEffect(() => {
        localStorage.setItem("paragraph", paragraph);
    }, [paragraph]);


    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Error loading products. Please try again later.</p>;
    }

    useEffect(() => {
        const savedHeading = localStorage.getItem('recommendedHeading');
        const savedParagraph = localStorage.getItem('recommendedParagraph');

        if (savedHeading) {
            setRecommendedHeading(savedHeading);
        }

        if (savedParagraph) {
            setRecommendedParagraph(savedParagraph);
        }
    }, []);

    useEffect(() => {
        if (recommendedHeading) {
            localStorage.setItem('recommendedHeading', recommendedHeading);
        }

        if (recommendedParagraph) {
            localStorage.setItem('recommendedParagraph', recommendedParagraph);
        }
    }, [recommendedHeading, recommendedParagraph]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    const handleTitleChange = (index, value) => {
        const updatedCategories = [...categories];
        updatedCategories[index].title = value;
        setCategories(updatedCategories);
    };

    const handleItemChange = (categoryIndex, itemIndex, field, value) => {
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex].items[itemIndex][field] = value;
        setCategories(updatedCategories);
    };

    const handleImageUpload = (categoryIndex, itemIndex, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedCategories = [...categories];
                updatedCategories[categoryIndex].items[itemIndex].image = reader.result;
                setCategories(updatedCategories);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelImage = (categoryIndex, itemIndex) => {
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex].items[itemIndex].image = '';
        setCategories(updatedCategories);
    };

    const handleCarouselHeadingChange = (e) => {
        setCarouselHeading(e.target.value);
    };

    const handleNewImageNameChange = (e) => {
        setNewImageName(e.target.value);
    };

    const handleImageUploadChangeForBestDeals = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedImage(URL.createObjectURL(file));
        }
    };

    const addNewCarouselItem = () => {
        if (newImageName && uploadedImage) {
            const newItem = { name: newImageName, image: uploadedImage };
            const updatedCarouselData = [...carouselData, newItem];
            setCarouselData(updatedCarouselData);
            localStorage.setItem("carouselData", JSON.stringify(updatedCarouselData));
            setNewImageName('');
            setUploadedImage(null);
        }
    };

    const removeBestDealImage = (index) => {
        const updatedImages = carouselData.filter((_, i) => i !== index);
        setCarouselData(updatedImages);
        localStorage.setItem("carouselData", JSON.stringify(updatedImages));
    };

    useEffect(() => {
        if (carouselHeading) {
            localStorage.setItem("carouselHeading", carouselHeading);
        }
    }, [carouselHeading]);

    useEffect(() => {
        localStorage.setItem("carouselData", JSON.stringify(carouselData));
    }, [carouselData]);

    useEffect(() => {
        const savedAdHeading = localStorage.getItem('adHeading');
        const savedAdParagraph = localStorage.getItem('adParagraph');
        const savedBackgroundImage = localStorage.getItem('backgroundImage');

        if (savedAdHeading) setAdHeading(savedAdHeading);
        if (savedAdParagraph) setAdParagraph(savedAdParagraph);
        if (savedBackgroundImage) setBackgroundImage(savedBackgroundImage);
    }, []);

    const handleAdHeadingChange = (e) => {
        setAdHeading(e.target.value);
        localStorage.setItem('adHeading', e.target.value);
    };

    const handleAdParagraphChange = (e) => {
        setAdParagraph(e.target.value);
        localStorage.setItem('adParagraph', e.target.value);
    };

    const handleBackgroundImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result);
                localStorage.setItem('backgroundImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteBackgroundImage = () => {
        setBackgroundImage('');
        localStorage.removeItem('backgroundImage');
    };

    const [ad1, setAd1] = useState({
        image: '',
        heading: '',
        description: ''
    });
    const [ad2, setAd2] = useState({
        image: '',
        heading: '',
        description: ''
    });

    useEffect(() => {
        const savedAd1 = JSON.parse(localStorage.getItem('ad1')) || {};
        const savedAd2 = JSON.parse(localStorage.getItem('ad2')) || {};
        const savedHeading = localStorage.getItem('sectionHeading') || '';

        setAd1(savedAd1);
        setAd2(savedAd2);
        setSectionHeading(savedHeading);
    }, []);

    const handleAd1Change = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAd1(prevState => ({
                    ...prevState,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setAd1(prevState => ({
                ...prevState,
                [name]: value
            }));
            localStorage.setItem('ad1', JSON.stringify({ ...ad1, [name]: value }));
        }
    };

    const handleAd2Change = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAd2(prevState => ({
                    ...prevState,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setAd2(prevState => ({
                ...prevState,
                [name]: value
            }));
            localStorage.setItem('ad2', JSON.stringify({ ...ad2, [name]: value }));
        }
    };

    const handleSectionHeadingChange = (e) => {
        const { value } = e.target;
        setSectionHeading(value);
        localStorage.setItem('sectionHeading', value);
    };


    useEffect(() => {
        const storedOfferProducts = JSON.parse(localStorage.getItem('offerProducts'));
        const storedOfferHeading = localStorage.getItem('offerHeading');
        const storedOfferParagraph = localStorage.getItem('offerParagraph');

        if (storedOfferProducts) setOfferProducts(storedOfferProducts);
        if (storedOfferHeading) setOfferHeading(storedOfferHeading);
        if (storedOfferParagraph) setOfferParagraph(storedOfferParagraph);
    }, []);

    useEffect(() => {
        localStorage.setItem('offerProducts', JSON.stringify(offerProducts));
        localStorage.setItem('offerHeading', offerHeading);
        localStorage.setItem('offerParagraph', offerParagraph);
    }, [offerProducts, offerHeading, offerParagraph]);

    const offerHandleImageChange = (e, index) => {
        const updatedOfferProducts = [...offerProducts];
        updatedOfferProducts[index].image = URL.createObjectURL(e.target.files[0]);
        setOfferProducts(updatedOfferProducts);
    };

    const offerHandleTitleChange = (e, index) => {
        const updatedOfferProducts = [...offerProducts];
        updatedOfferProducts[index].title = e.target.value;
        setOfferProducts(updatedOfferProducts);
    };

    const offerHandleDescriptionChange = (e, index) => {
        const updatedOfferProducts = [...offerProducts];
        updatedOfferProducts[index].description = e.target.value;
        setOfferProducts(updatedOfferProducts);
    };

    const offerHandleDeleteImage = (index) => {
        const updatedOfferProducts = [...offerProducts];
        updatedOfferProducts[index].image = '';
        setOfferProducts(updatedOfferProducts);
    };

    const offerHandleHeadingChange = (e) => {
        setOfferHeading(e.target.value);
    };

    const offerHandleParagraphChange = (e) => {
        setOfferParagraph(e.target.value);
    };

    const loadDataFromLocalStorage = () => {
        const storedHeading = localStorage.getItem('bestSellerHeading');
        const storedData = localStorage.getItem('bestSellerData');

        return {
            heading: storedHeading || '',
            data: storedData ? JSON.parse(storedData) : [],
        };
    };

    const [bestSellerHeading, setBestSellerHeading] = useState(loadDataFromLocalStorage().heading);
    const [newBestSellerImageName, setNewBestSellerImageName] = useState('');
    const [uploadedBestSellerImage, setUploadedBestSellerImage] = useState(null);
    const [bestSellerData, setBestSellerData] = useState(loadDataFromLocalStorage().data);

    const saveToLocalStorage = () => {
        localStorage.setItem('bestSellerHeading', bestSellerHeading);
        localStorage.setItem('bestSellerData', JSON.stringify(bestSellerData));
    };

    const handleBestSellerHeadingChange = (e) => {
        setBestSellerHeading(e.target.value);
    };

    const handleBestSellerImageNameChange = (e) => {
        setNewBestSellerImageName(e.target.value);
    };

    const handleBestSellerImageUploadChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedBestSellerImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addNewBestSellerItem = () => {
        if (newBestSellerImageName && uploadedBestSellerImage) {
            const newItem = {
                name: newBestSellerImageName,
                image: uploadedBestSellerImage,
            };

            const updatedBestSellerData = [...bestSellerData, newItem];
            setBestSellerData(updatedBestSellerData);
            saveToLocalStorage();

            setNewBestSellerImageName('');
            setUploadedBestSellerImage(null);
        }
    };

    const removeBestSellerImage = (index) => {
        const updatedData = bestSellerData.filter((_, i) => i !== index);
        setBestSellerData(updatedData);
        saveToLocalStorage();
    };

    useEffect(() => {
        saveToLocalStorage();
    }, [bestSellerData, bestSellerHeading]);

    const [mainTitle, setMainTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [ctaLabel, setCtaLabel] = useState("");
    const [bodyText, setBodyText] = useState("");

    useEffect(() => {
        const storedMainTitle = localStorage.getItem("mainTitle");
        const storedSubtitle = localStorage.getItem("subtitle");
        const storedCtaLabel = localStorage.getItem("ctaLabel");
        const storedBodyText = localStorage.getItem("bodyText");

        if (storedMainTitle) setMainTitle(storedMainTitle);
        if (storedSubtitle) setSubtitle(storedSubtitle);
        if (storedCtaLabel) setCtaLabel(storedCtaLabel);
        if (storedBodyText) setBodyText(storedBodyText);
    }, []);

    useEffect(() => {
        localStorage.setItem("mainTitle", mainTitle);
        localStorage.setItem("subtitle", subtitle);
        localStorage.setItem("ctaLabel", ctaLabel);
        localStorage.setItem("bodyText", bodyText);
    }, [mainTitle, subtitle, ctaLabel, bodyText]);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between flex-wrap">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0 ml-10 sm:space-x-2">
                    <img src="/Assets/logo3.png" alt="Logo" className="w-56 h-auto" />
                    <div className="flex flex-col sm:flex-row items-center text-white">
                        <FaLocationArrow className="text-customBlue mr-1" />
                        <span className="text-sm sm:text-base">Delivering to {location}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6 mr-2">
                    <div className="relative flex items-center mr-0">
                        <button
                            className="text-white hover:text-customBlue flex items-center"
                            onClick={toggleDropdown}
                        >
                            Hello, {username}
                            <FaChevronDown className="ml-2" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute left-0 mt-24 w-40 bg-white rounded-lg shadow-lg z-10 p-2">
                                <div className="grid grid-cols-2 gap-4 text-black text-sm">
                                    <div className="p-2 cursor-pointer hover:bg-white hover:text-indigo-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
                                        Profile
                                    </div>
                                    <div className="p-2 cursor-pointer hover:bg-white hover:text-customBlue rounded-md transition duration-300 ease-in-out transform hover:scale-105">
                                        Logout
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative flex items-center">
                        <a
                            href="#"
                            className="text-white text-lg font-medium hover:text-customBlue cursor-pointer flex items-center"
                        >
                            {cartCount > 0 && (
                                <span className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs rounded-full px-1.5">
                                    {cartCount}
                                </span>
                            )}
                            <FaShoppingCart className="text-xl mr-2" />
                            Cart
                        </a>
                    </div>

                    <div className="flex items-center space-x-6 mr-2">
                        <div
                            className="relative flex items-center"
                            onMouseEnter={handleBellMouseEnter}
                            onMouseLeave={handleBellMouseLeave}
                        >
                            <AiOutlineBell className="h-7 w-7 cursor-pointer" />
                            {showNotification && (
                                <div
                                    className="absolute top-6 right-0 bg-white rounded-lg shadow-lg p-4 w-96 h-96 overflow-y-auto z-10"
                                    onMouseEnter={handleCardMouseEnter}
                                    onMouseLeave={handleCardMouseLeave}
                                >
                                    <NotificationList />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="bg-gray-800 p-6 rounded-lg mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-center text-white mb-2">Upload Carousel Images</h2>
                    <div className="flex justify-center items-center">
                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <div className="mb-4 flex items-center space-x-4">
                                <label htmlFor="imageName" className="text-white text-sm font-medium">Image Name</label>
                                <input
                                    type="text"
                                    id="imageName"
                                    placeholder="Enter image name"
                                    value={imageName}
                                    onChange={handleNameChange}
                                    className="bg-white text-black px-4 py-2 rounded-lg border border-gray-600 w-[200px] focus:outline-none focus:ring-2 focus:ring-customBlue"
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:space-x-4 mt-1 sm:mt-0">
                                <label
                                    htmlFor="fileUpload"
                                    className="cursor-pointer bg-customBlue text-white px-4 py-2 rounded-lg mb-1 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    Select Image
                                </label>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".png,.jpg,.jpeg,.webp"
                                />
                                <p className="text-gray-400 text-sm mb-2 sm:mb-0">PNG, JPG, JPEG, WEBP files only</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {carouselImages.map((image, index) => (
                            <div key={index} className="relative group rounded-lg overflow-hidden">
                                <img
                                    src={image.url || "https://via.placeholder.com/400x400?text=No+Image"}
                                    alt={image.name || `Image ${index}`}
                                    className="w-full h-[200px] object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full cursor-pointer hover:bg-opacity-70">
                                    <button onClick={() => removeImage(index)}>X</button>
                                </div>
                                <p className="text-center text-white mt-2">{image.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Carousel
                    showArrows={false}
                    infiniteLoop
                    autoPlay
                    interval={3000}
                    showThumbs={false}
                    showIndicators={true}
                    className="rounded-lg cursor-pointer mt-2"
                >
                    {carouselImages.map((image, index) => (
                        <div key={index}>
                            <img
                                src={image.url || "https://via.placeholder.com/1200x400?text=No+Image"}
                                alt={image.name || `Image ${index}`}
                                className="rounded-lg h-[300px] object-cover"
                            />
                            <p className="text-center text-white mt-2">{image.name}</p>
                        </div>
                    ))}
                </Carousel>
            </div>

            <div className="mt-8 border-t-2 border-gray-700"></div>

            <div className="mt-4">
                <div className="bg-gray-800 p-6 rounded-lg mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-center text-white mb-2">Upload Shop By Category</h2>
                    <div className="mt-6 px-4">
                        <div className="flex items-center mb-2">
                            <label
                                htmlFor="heading"
                                className="text-white text-lg font-semibold w-1/4 ml-10 "
                            >
                                Enter Heading Name
                            </label>
                            <input
                                id="heading"
                                type="text"
                                value={heading}
                                onChange={(e) => setHeading(e.target.value)}
                                className="text-lg text-white bg-gray-800 p-3 rounded-lg w-2/3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customBlue placeholder:text-gray-400 transition-all duration-300 ease-in-out hover:bg-gray-700"
                                placeholder="Enter heading name"
                            />
                        </div>

                        <div className="flex items-center mb-2">
                            <label
                                htmlFor="paragraph"
                                className="text-white text-lg font-semibold w-1/4 ml-10"
                            >
                                Enter Paragraph
                            </label>
                            <input
                                id="paragraph"
                                type="text"
                                value={paragraph}
                                onChange={(e) => setParagraph(e.target.value)}
                                className="text-lg text-white bg-gray-800 p-3 rounded-lg w-2/3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customBlue placeholder:text-gray-400 transition-all duration-300 ease-in-out hover:bg-gray-700"
                                placeholder="Enter paragraph"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-center text-white text-xl font-semibold mb-4">Add New Product</h3>
                        <div className="flex flex-col items-center space-y-4">
                            <input
                                type="text"
                                placeholder="Enter Product Name"
                                value={newProductName}
                                onChange={(e) => setNewProductName(e.target.value)}
                                className="w-1/2 p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Enter Category Name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="w-1/2 p-2 border rounded"
                            />
                            <input
                                type="file"
                                onChange={handleProductImageChange}
                                className="p-2 border rounded"
                                accept=".png,.jpg,.jpeg,.webp"
                            />
                            <button onClick={addProduct} className="w-1/2 py-2 bg-customBlue text-white rounded mt-4">
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 px-4">
                    <h2 className="text-center text-3xl font-bold mb-2">
                        {heading}
                    </h2>
                    <p className="text-center text-gray-400 mb-6">
                        {paragraph}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {newProducts.map((product) => (
                            <a key={product._id} href="#" className="group relative text-center p-4 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                                <div className="absolute top-2 right-2 z-10">
                                    <button
                                        className="bg-gray-800 text-white p-1 rounded-full text-sm hover:bg-gray-600 transition-all"
                                        onClick={() => handleCancelProduct(product._id)}
                                        aria-label="Cancel product"
                                    >
                                        <span className="text-xl">&times;</span>
                                    </button>
                                </div>
                                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-gray-600 transition-all duration-300">
                                    <img
                                        src={product.images[0] || "/placeholder-image.png"}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform transition-all duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <p className="mt-4 text-lg font-semibold text-white group-hover:text-customBlue transition-all duration-300">
                                    {product.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-300">
                                    {product.category.name}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t-2 border-gray-700"></div>

            <div className="mt-4">
                <div className="bg-gray-800 p-6 rounded-lg mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-center text-white mb-2">Upload Recommended</h2>

                    <div className="mt-6 px-4">
                        <div className="flex items-center mb-2">
                            <label
                                htmlFor="recommendedHeading"
                                className="text-white text-lg font-semibold w-1/4 ml-10 "
                            >
                                Enter Recommended Heading
                            </label>
                            <input
                                id="recommendedHeading"
                                type="text"
                                value={recommendedHeading}
                                onChange={(e) => setRecommendedHeading(e.target.value)}
                                className="text-lg text-white bg-gray-800 p-3 rounded-lg w-2/3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customBlue placeholder:text-gray-400 transition-all duration-300 ease-in-out hover:bg-gray-700"
                                placeholder="Enter recommended heading"
                            />
                        </div>

                        <div className="flex items-center mb-2">
                            <label
                                htmlFor="recommendedParagraph"
                                className="text-white text-lg font-semibold w-1/4 ml-10"
                            >
                                Enter Recommended Paragraph
                            </label>
                            <input
                                id="recommendedParagraph"
                                type="text"
                                value={recommendedParagraph}
                                onChange={(e) => setRecommendedParagraph(e.target.value)}
                                className="text-lg text-white bg-gray-800 p-3 rounded-lg w-2/3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customBlue placeholder:text-gray-400 transition-all duration-300 ease-in-out hover:bg-gray-700"
                                placeholder="Enter recommended paragraph"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-4">
                        {categories.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="flex flex-col justify-between">
                                <div className="mb-4">
                                    <label className="text-white text-lg font-semibold mb-2">Enter Category Title</label>
                                    <input
                                        type="text"
                                        value={category.title}
                                        onChange={(e) => handleTitleChange(categoryIndex, e.target.value)}
                                        className="text-lg text-white bg-gray-800 p-2 rounded-lg w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customBlue placeholder:text-gray-400 transition-all duration-300 ease-in-out hover:bg-gray-700"
                                        placeholder="Enter category title"
                                    />
                                </div>

                                <div className="bg-gray-950 p-4 rounded-lg shadow-md text-center flex flex-col justify-between h-full border-2 border-gray-600">
                                    <div className="grid grid-cols-2 gap-2">
                                        {category.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="text-center">
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleImageUpload(categoryIndex, itemIndex, e)}
                                                    className="text-sm text-white bg-gray-800 p-3 rounded-lg w-full mb-2"
                                                />
                                                {item.image && (
                                                    <div className="relative">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-24 object-cover rounded-lg mb-2"
                                                        />
                                                        <button
                                                            onClick={() => handleCancelImage(categoryIndex, itemIndex)}
                                                            className="absolute top-0 right-0 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                        >
                                                            <span className="text-xl">×</span>
                                                        </button>
                                                    </div>
                                                )}
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'name', e.target.value)}
                                                    className="text-sm text-white bg-gray-800 p-3 rounded-lg w-full mb-2"
                                                    placeholder="Enter item name"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <a
                                        href="#"
                                        className="text-customBlue hover:underline block text-center py-2 mt-4"
                                    >
                                        See More
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 px-4">
                    <h2 className="text-center text-3xl font-bold mb-2">
                        {recommendedHeading}
                    </h2>
                    <p className="text-center text-gray-400 mb-4">
                        {recommendedParagraph}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {categories.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="flex flex-col justify-between">
                                <div className="mb-2">
                                    <h3 className="text-lg font-bold text-white">{category.title}</h3>
                                </div>

                                <div className="bg-gray-950 p-4 rounded-lg shadow-md text-center flex flex-col justify-between h-full border-2 border-gray-600">
                                    <div className="grid grid-cols-2 gap-2">
                                        {category.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="text-center">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-24 object-cover rounded-lg mb-2"
                                                    />
                                                )}
                                                <p className="text-sm text-white">{item.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <a
                                        href="#"
                                        className="text-customBlue hover:underline block text-center py-2 mt-4"
                                    >
                                        See More
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t-2 border-gray-700"></div>

            <div className="mt-4">
                <div className="bg-gray-800 p-6 rounded-lg mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-center text-white mb-4">Update Details for Best Deals</h2>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full justify-center">
                            <div className="mb-2 flex items-center space-x-4">
                                <label htmlFor="carouselHeading" className="text-white text-sm font-medium">Heading Name</label>
                                <input
                                    type="text"
                                    id="carouselHeading"
                                    value={carouselHeading}
                                    onChange={handleCarouselHeadingChange}
                                    className="text-2xl sm:text-2xl md:text-3xl font-bold text-white bg-transparent outline-none w-3/4"
                                    placeholder="Enter your heading"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full justify-center space-y-4 sm:space-y-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                <label htmlFor="newImageName" className="text-white text-sm font-medium">Image Name</label>
                                <input
                                    type="text"
                                    id="newImageName"
                                    value={newImageName}
                                    onChange={handleNewImageNameChange}
                                    placeholder="Enter image name"
                                    className="bg-white text-black px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customBlue w-[200px]"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                <label
                                    htmlFor="fileUploadBestDeals"
                                    className="cursor-pointer bg-customBlue text-white px-4 py-2 rounded-lg mb-1 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    Select Image
                                </label>
                                <input
                                    type="file"
                                    id="fileUploadBestDeals"
                                    onChange={handleImageUploadChangeForBestDeals}
                                    className="hidden"
                                    accept=".png,.jpg,.jpeg,.webp"
                                />
                                <p className="text-gray-400 text-sm mb-2 sm:mb-0">PNG, JPG, JPEG, WEBP files only</p>
                            </div>
                        </div>

                        <div className="flex justify-center w-full">
                            <button
                                onClick={addNewCarouselItem}
                                disabled={!newImageName || !uploadedImage}
                                className="mt-2 bg-customBlue text-white px-6 py-2 rounded-lg hover:bg-customBlue/80 transition-all disabled:bg-gray-400"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {carouselData.map((item, index) => (
                            <div key={index} className="relative group rounded-lg overflow-hidden">
                                <img
                                    src={item.image || "https://via.placeholder.com/400x400?text=No+Image"}
                                    alt={item.name || `Image ${index}`}
                                    className="w-full h-[200px] object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full cursor-pointer hover:bg-opacity-70">
                                    <button onClick={() => removeBestDealImage(index)}>X</button>
                                </div>
                                <p className="text-center text-white mt-2">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex flex-col md:flex-row mb-4">
                        <h2 className="text-xl font-bold mb-2 md:mb-0 md:mr-4 text-center">{carouselHeading || 'Best Deals Curated from Stores Nearby'}</h2>
                        <a href="#" className="text-customBlue hover:underline">
                            See All Offers
                        </a>
                    </div>

                    <Carousel
                        showArrows={false}
                        showThumbs={false}
                        infiniteLoop
                        autoPlay
                        interval={3000}
                        showIndicators={true}
                        className="rounded-lg"
                    >
                        {carouselData.map((item, index) => (
                            <div key={index}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="rounded-lg w-full h-40 md:h-48 lg:h-56 object-cover"
                                />
                                <p className="text-center mt-2 mb-6 text-sm md:text-base lg:text-lg">{item.name}</p>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>

            <div className="mt-8 border-t-2 border-gray-700"></div>

            <div className="mt-4">
                <div className="bg-gray-800 p-6 rounded-lg mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-center text-white mb-4">Update Details for Sale</h2>
                    <div className="text-center px-4 sm:px-8 flex flex-col items-center justify-center">
                        {/* Editable Heading */}
                        <div className="mb-4 w-full max-w-lg flex items-center justify-start">
                            <label htmlFor="adHeading" className="text-white block text-lg font-semibold mr-4 w-1/4">Heading</label>
                            <input
                                id="adHeading"
                                type="text"
                                value={adHeading}
                                onChange={handleAdHeadingChange}
                                className="text-2xl sm:text-2xl md:text-3xl font-bold text-white bg-transparent outline-none w-3/4"
                                placeholder="Enter your heading"
                            />
                        </div>

                        <div className="mb-6 w-full max-w-lg flex items-start justify-start">
                            <label htmlFor="adParagraph" className="text-white block text-lg font-semibold mr-4 w-1/4">Paragraph</label>
                            <textarea
                                id="adParagraph"
                                value={adParagraph}
                                onChange={handleAdParagraphChange}
                                className="text-base sm:text-lg md:text-lg text-gray-300 bg-transparent outline-none w-3/4 h-auto resize-none"
                                placeholder="Enter your paragraph"
                            />
                        </div>

                        <div className="mb-4 w-full max-w-lg flex flex-col sm:flex-row items-center justify-start">
                            <label htmlFor="backgroundImage" className="text-white block text-lg font-semibold mb-2 sm:mb-0 sm:mr-4 w-full sm:w-1/4">
                                Upload Background Image
                            </label>
                            <input
                                id="backgroundImage"
                                type="file"
                                accept="image/*"
                                onChange={handleBackgroundImageChange}
                                className="mb-2 sm:mb-0 w-full sm:w-3/4"
                            />
                            {backgroundImage && (
                                <button
                                    onClick={handleDeleteBackgroundImage}
                                    className="px-4 py-2 w-full sm:w-auto bg-customBlue hover:bg-customBlue/80 text-white rounded-full mt-2 sm:mt-0"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <section className="relative w-full h-[400px] bg-cover bg-center bg-no-repeat">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${backgroundImage || '/images/advertisement-banner.jpg'})` }}
                    >
                        <div className="absolute inset-0 bg-stone-400 bg-opacity-50 flex justify-center items-center">
                            <div className="text-center text-white">
                                <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold mb-4">
                                    {adHeading || "Massive Sale On All!"}
                                </h1>
                                <p className="text-base sm:text-lg md:text-lg text-gray-300 mb-6">
                                    {adParagraph || "Up to 50% off on selected products"}
                                </p>
                                <a
                                    href="#"
                                    className="px-6 py-3 bg-customBlue hover:bg-customBlue/80 text-white rounded-full text-lg sm:text-lg"
                                >
                                    Shop Now
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-8 border-t-2 border-gray-700"></div>

            <div className="mt-4">
                <div className="bg-gray-800 p-6 rounded-lg mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-center text-white mb-2">Upload Featured Ads</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full justify-center">
                        <div className="mb-4 flex items-center space-x-4">
                            <label htmlFor="sectionHeading" className="text-white text-lg font-medium w-full">Featured Ads Heading</label>
                            <input
                                type="text"
                                id="sectionHeading"
                                name="sectionHeading"
                                value={sectionHeading}
                                onChange={handleSectionHeadingChange}
                                className="text-2xl sm:text-2xl md:text-3xl font-bold text-white bg-transparent outline-none w-4/3"
                                placeholder="Enter Section Heading"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-2">
                        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg col-span-1 sm:col-span-1 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-gray-300">Upload Image for Ad 1</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleAd1Change}
                                    className="block w-2/3"
                                />
                            </div>
                            {ad1.image && (
                                <div className="relative mb-4">
                                    <img
                                        src={ad1.image}
                                        alt="Ad 1"
                                        className="w-full h-60 object-cover mb-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setAd1({ ...ad1, image: '' })}
                                        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full cursor-pointer hover:bg-opacity-70"
                                    >
                                        <span className="font-bold text-xl">×</span>
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center mb-4">
                                <label className="text-gray-300 mr-2">Ad 1 Heading</label>
                                <input
                                    type="text"
                                    name="heading"
                                    value={ad1.heading}
                                    onChange={handleAd1Change}
                                    className="w-3/4 p-2 border border-gray-500 rounded bg-transparent text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter Heading"
                                />
                            </div>

                            <div className="flex items-center mb-4">
                                <label className="text-gray-300 mr-2">Ad 1 Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={ad1.description}
                                    onChange={handleAd1Change}
                                    className="w-3/4 p-2 border border-gray-500 rounded bg-transparent text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter Description"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg col-span-1 sm:col-span-1 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-gray-300">Upload Image for Ad 2</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleAd2Change}
                                    className="block w-2/3"
                                />
                            </div>
                            {ad2.image && (
                                <div className="relative mb-4">
                                    <img
                                        src={ad2.image}
                                        alt="Ad 2"
                                        className="w-full h-48 object-cover mb-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setAd2({ ...ad2, image: '' })}
                                        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full cursor-pointer hover:bg-opacity-70"
                                    >
                                        <span className="font-bold text-xl">×</span>
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center mb-4">
                                <label className="text-gray-300 mr-2">Ad 2 Heading</label>
                                <input
                                    type="text"
                                    name="heading"
                                    value={ad2.heading}
                                    onChange={handleAd2Change}
                                    className="w-3/4 p-2 border border-gray-500 rounded bg-transparent text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter Heading"
                                />
                            </div>

                            <div className="flex items-center mb-4">
                                <label className="text-gray-300 mr-2">Ad 2 Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={ad2.description}
                                    onChange={handleAd2Change}
                                    className="w-3/4 p-2 border border-gray-500 rounded bg-transparent text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter Description"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <section className="py-12 px-4">
                    <h2 className="text-center text-3xl font-bold mb-8">{sectionHeading || 'Featured Ads'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all col-span-1 sm:col-span-1">
                            {ad1.image && (
                                <img
                                    src={ad1.image}
                                    alt="Ad 1"
                                    className="w-full h-60 object-cover mb-4"
                                />
                            )}
                            <div className="p-4 text-center">
                                <h3 className="text-xl font-semibold text-white mb-2">{ad1.heading || 'Luxury Sofa Set'}</h3>
                                <p className="text-gray-400 mb-4">{ad1.description || 'Elegant design for your living room'}</p>
                                <a href="#" className="text-customBlue hover:underline">Learn More</a>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all col-span-1 sm:col-span-1">
                            {ad2.image && (
                                <img
                                    src={ad2.image}
                                    alt="Ad 2"
                                    className="w-full h-48 object-cover mb-4"
                                />
                            )}
                            <div className="p-4 text-center">
                                <h3 className="text-xl font-semibold text-white mb-2">{ad2.heading || 'Designer Dining Tables'}</h3>
                                <p className="text-gray-400 mb-4">{ad2.description || 'Perfect for family gatherings'}</p>
                                <a href="#" className="text-customBlue hover:underline">Explore Now</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-8 border-t-2 border-gray-700"></div>

            <div className="mt-4">
                <div className="bg-gray-800 p-6 rounded-lg mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-center text-white mb-6">Upload Exclusive Offers</h2>
                    <div className="flex justify-center mb-8">
                        <div className="w-full sm:w-2/3 mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-center w-full">
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="offerHeading" className="text-white text-lg font-medium mr-2">Heading</label>
                                    <input
                                        type="text"
                                        id="offerHeading"
                                        value={offerHeading}
                                        onChange={offerHandleHeadingChange}
                                        className="text-2xl sm:text-2xl md:text-2xl font-bold text-white bg-transparent outline-none w-full sm:w-2/3 p-2 rounded"
                                        placeholder="Enter Section Heading"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-center w-full">
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="offerParagraph" className="text-lg text-gray-400 mr-2">Paragraph</label>
                                    <input
                                        type="text"
                                        id="offerParagraph"
                                        value={offerParagraph}
                                        onChange={offerHandleParagraphChange}
                                        className="text-lg text-white bg-transparent outline-none w-full sm:w-2/3 p-2 rounded"
                                        placeholder="Enter Paragraph"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 mt-12">
                        {offerProducts.map((product, index) => (
                            <div key={index} className="bg-gray-950 p-6 rounded-lg shadow-lg">
                                <div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => offerHandleImageChange(e, index)}
                                            className="block mt-2 mb-4 text-white p-2 rounded"
                                        />
                                    </div>

                                    {product.image && (
                                        <div className="relative mb-4">
                                            <img
                                                src={product.image}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-40 object-cover mb-4 rounded-lg"
                                            />
                                            <button
                                                onClick={() => offerHandleDeleteImage(index)}
                                                className="absolute top-0 right-0 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            >
                                                <span className="text-xl">×</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 mb-4">
                                    <label className="text-lg font-semibold text-white">Title:</label>
                                    <input
                                        type="text"
                                        value={product.title}
                                        onChange={(e) => offerHandleTitleChange(e, index)}
                                        className="bg-gray-900 text-white ml-2 p-2 rounded mt-2 w-full"
                                        placeholder="Enter product title"
                                    />
                                </div>

                                <div className="flex items-center space-x-2 mb-4">
                                    <label className="text-gray-400">Description:</label>
                                    <input
                                        type="text"
                                        value={product.description}
                                        onChange={(e) => offerHandleDescriptionChange(e, index)}
                                        className="bg-gray-900 text-white ml-2 p-2 rounded w-full"
                                        placeholder="Enter product description"
                                    />
                                </div>

                                <a
                                    href="#"
                                    className="text-customBlue hover:underline flex items-center mt-4"
                                >
                                    Shop Now <FaShoppingCart className="ml-2" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <section className="bg-gray-800 py-12 mt-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white">{offerHeading}</h2>
                        <p className="text-lg text-gray-400">{offerParagraph}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                        {offerProducts.map((product, index) => (
                            <div key={index} className="bg-gray-950 p-6 rounded-lg shadow-lg">
                                {product.image && (
                                    <img
                                        src={product.image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-40 object-cover mb-4 rounded-lg"
                                    />
                                )}
                                <h3 className="text-xl font-semibold text-white">{product.title}</h3>
                                <p className="text-gray-400 mb-2">{product.description}</p>
                                <a
                                    href="#"
                                    className="text-customBlue hover:underline flex items-center"
                                >
                                    Shop Now <FaShoppingCart className="ml-2" />
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="mt-8 border-t-2 border-gray-700"></div>

            <div className="mt-4">
                <div className="bg-gray-800 p-6 rounded-lg mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-center text-white mb-4">Update Best Sellers</h2>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full justify-center">
                            <div className="mb-2 flex items-center space-x-4">
                                <label htmlFor="bestSellerHeading" className="text-white text-sm font-medium">Heading Name</label>
                                <input
                                    type="text"
                                    id="bestSellerHeading"
                                    value={bestSellerHeading}
                                    onChange={handleBestSellerHeadingChange}
                                    className="text-2xl sm:text-2xl md:text-3xl font-bold text-white bg-transparent outline-none w-3/4"
                                    placeholder="Enter your heading"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full justify-center space-y-4 sm:space-y-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                <label htmlFor="newBestSellerImageName" className="text-white text-sm font-medium">Image Name</label>
                                <input
                                    type="text"
                                    id="newBestSellerImageName"
                                    value={newBestSellerImageName}
                                    onChange={handleBestSellerImageNameChange}
                                    placeholder="Enter image name"
                                    className="bg-white text-black px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customBlue w-[200px]"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                <label
                                    htmlFor="fileUploadBestSeller"
                                    className="cursor-pointer bg-customBlue text-white px-4 py-2 rounded-lg mb-1 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    Select Image
                                </label>
                                <input
                                    type="file"
                                    id="fileUploadBestSeller"
                                    onChange={handleBestSellerImageUploadChange}
                                    className="hidden"
                                    accept=".png,.jpg,.jpeg,.webp"
                                />
                                <p className="text-gray-400 text-sm mb-2 sm:mb-0">PNG, JPG, JPEG, WEBP files only</p>
                            </div>
                        </div>

                        <div className="flex justify-center w-full">
                            <button
                                onClick={addNewBestSellerItem}
                                disabled={!newBestSellerImageName || !uploadedBestSellerImage}
                                className="mt-2 bg-customBlue text-white px-6 py-2 rounded-lg hover:bg-customBlue/80 transition-all disabled:bg-gray-400"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {bestSellerData.map((item, index) => (
                            <div key={index} className="relative group rounded-lg overflow-hidden">
                                <img
                                    src={item.image || "https://via.placeholder.com/400x400?text=No+Image"}
                                    alt={item.name || `Image ${index}`}
                                    className="w-full h-[200px] object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full cursor-pointer hover:bg-opacity-70">
                                    <button onClick={() => removeBestSellerImage(index)}>X</button>
                                </div>
                                <p className="text-center text-white mt-2">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex flex-col md:flex-row mb-4">
                        <h2 className="text-xl font-bold mb-2 md:mb-0 md:mr-4 text-center">{bestSellerHeading || 'Best Sellers in Home & Kitchen'}</h2>
                        <a href="#" className="text-customBlue hover:underline">
                            See All Offers
                        </a>
                    </div>

                    <Carousel
                        showArrows={false}
                        showThumbs={false}
                        infiniteLoop
                        autoPlay
                        interval={3000}
                        showIndicators={true}
                        className="rounded-lg"
                    >
                        {bestSellerData.map((item, index) => (
                            <div key={index}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="rounded-lg w-full h-40 md:h-48 lg:h-56 object-cover"
                                />
                                <p className="text-center mt-2 mb-6 text-sm md:text-base lg:text-lg">{item.name}</p>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>

            <div className="mt-8 border-t-2 border-gray-700"></div>

            <div className="container mx-auto mt-8 mb-4">
                <h2 className="text-xl font-semibold text-center text-white mb-4">Update Offer</h2>
                <div className="text-white p-4 text-center w-full max-w-screen-2xl mx-auto mt-8 mb-4">
                    <h2 className="text-4xl font-extrabold leading-tight tracking-wider mb-4 text-shadow-lg sm:text-3xl md:text-4xl">
                        <input
                            type="text"
                            value={mainTitle}
                            onChange={(e) => setMainTitle(e.target.value)}
                            className="bg-transparent text-white font-extrabold text-3xl sm:text-3xl md:text-3xl border-b-2 border-white focus:outline-none"
                            placeholder="Enter heading"
                        />
                    </h2>
                    <p className="text-lg mb-4 text-opacity-80 font-medium italic sm:text-base">
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="bg-transparent text-white text-opacity-80 font-medium italic sm:text-base border-b-2 border-white focus:outline-none"
                            placeholder="Enter subheading"
                        />
                    </p>
                    <p className="text-2xl font-bold text-shadow-md mb-4 sm:text-xl md:text-2xl">
                        <input
                            type="text"
                            value={ctaLabel}
                            onChange={(e) => setCtaLabel(e.target.value)}
                            className="bg-transparent text-white font-bold text-2xl sm:text-xl md:text-2xl border-b-2 border-white focus:outline-none"
                            placeholder="Enter call-to-action text"
                        />
                    </p>
                    <p className="text-lg font-light mb-6 leading-relaxed sm:text-base">
                        <input
                            type="text"
                            value={bodyText}
                            onChange={(e) => setBodyText(e.target.value)}
                            className="bg-transparent text-white font-light sm:text-base border-b-2 border-white focus:outline-none"
                            placeholder="Enter description"
                        />
                    </p>
                </div>

                <div className="bg-slate-700 text-white p-4 rounded-lg shadow-lg text-center w-full max-w-screen-2xl mx-auto mt-8 mb-4">
                    <h2 className="text-4xl font-extrabold leading-tight tracking-wider mb-4 text-shadow-lg sm:text-3xl md:text-4xl">
                        {mainTitle || "MORE KNOCKOUT OFFERS WAITING!"}
                    </h2>
                    <p className="text-lg mb-4 text-opacity-80 font-medium italic sm:text-base">
                        {subtitle || "Only On The App"}
                    </p>
                    <p className="text-2xl font-bold text-shadow-md mb-4 sm:text-xl md:text-2xl">
                        {ctaLabel || "Grab the Best Deals Now!"}
                    </p>
                    <p className="text-lg font-light mb-6 leading-relaxed sm:text-base">
                        {bodyText || "Download the app and explore exclusive offers"}
                    </p>
                    <div className="flex justify-center gap-8">
                        <a
                            href="#"
                            className="bg-white text-customBlue/80 font-semibold px-4 py-4 border-2 border-customBlue/80 rounded-xl hover:bg-customBlue/80 hover:text-white focus:outline-none transform hover:translate-y-1 transition-all duration-200 sm:px-6 sm:py-3 md:px-4 md:py-4"
                        >
                            Google Play
                        </a>
                    </div>
                </div>
            </div>

            <footer className="bg-gray-800 text-white p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <h4 className="font-bold text-lg">Get to Know Us</h4>
                        <ul>
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Press Releases</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Connect with Us</h4>
                        <ul>
                            <li>Facebook</li>
                            <li>Twitter</li>
                            <li>Instagram</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Make Money with Us</h4>
                        <ul className="space-y-1 text-sm">
                            <li>Sell on website</li>
                            <li>Sell under website Accelerator</li>
                            <li>Protect and Build Your Brand</li>
                            <li>website Global Selling</li>
                            <li>Supply to website</li>
                            <li>Become an Affiliate</li>
                            <li>Fulfillment by website</li>
                            <li>Advertise Your Products</li>
                            <li>website Pay on Merchants</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Let Us Help You</h4>
                        <ul className="space-y-1 text-sm">
                            <li>Your Account</li>
                            <li>Returns Centre</li>
                            <li>Recalls and Product Safety Alerts</li>
                            <li>100% Purchase Protection</li>
                            <li>website App Download</li>
                            <li>Help</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t-2 border-gray-700"></div>
                <div className="text-center text-gray-400 mt-4">
                    <p>&copy; 2024 E-Com. All Rights Reserved.</p>
                    <p>
                        Follow Us:{" "}
                        <a href="#" className="text-customBlue hover:underline">
                            Facebook
                        </a>
                        ,{" "}
                        <a href="#" className="text-customBlue hover:underline">
                            Instagram
                        </a>
                        ,{" "}
                        <a href="#" className="text-customBlue hover:underline">
                            Twitter
                        </a>
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default HomePage;