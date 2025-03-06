import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const categories = [
    { id: 1, name: "Sustainability", icon: "♻️", color: "bg-teal-700", link: "/sustainability" },
    { id: 2, name: "Equity", icon: "⚖️", color: "bg-teal-600", link: "/equity" },
    { id: 3, name: "Resiliency", icon: "🔄", color: "bg-teal-500", link: "/resiliency" },
    { id: 4, name: "Environment", icon: "🍃", color: "bg-green-700", link: "/environment" },
    { id: 5, name: "Community", icon: "👥", color: "bg-blue-800", link: "/community" },
    { id: 6, name: "Transportation", icon: "🚗", color: "bg-purple-900", link: "/transportation" },
    { id: 7, name: "Economy", icon: "📈", color: "bg-purple-800", link: "/economy" }
];

const trends = [
    { id: 1, name: "Very Good", icon: "⭐⭐", color: "bg-green-600", link: "/trends/very-good" },
    { id: 2, name: "Good", icon: "⭐", color: "bg-green-500", link: "/trends/good" },
    { id: 3, name: "Neutral", icon: "◯", color: "bg-gray-500", link: "/trends/neutral" },
    { id: 4, name: "Not Good", icon: "⚠️", color: "bg-yellow-600", link: "/trends/not-good" },
    { id: 5, name: "Poor", icon: "❌", color: "bg-red-600", link: "/trends/poor" }
];

const FilterByCategory = ({ onLayoutChange }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState(location.pathname.includes("/trends") ? "trends" : "category");
    const [isVisible, setIsVisible] = useState(true);

    // Extract the last part of the URL (filter value)
    const activeFilter = location.pathname.split("/").pop();

    // Check if we should hide the component based on the route
    useEffect(() => {
        // Determine if we should hide based on current route
        // For example, hide when on specific detail pages or when outlet content is present
        const shouldHide = location.pathname.includes("/detail") ||
            location.pathname.includes("/outlet") ||
            location.pathname === "/featured"; // Add any other paths where you want to hide

        setIsVisible(!shouldHide);

        // Call parent component's callback to handle featuredCategory visibility
        if (onLayoutChange) {
            onLayoutChange(!shouldHide);
        }
    }, [location.pathname, onLayoutChange]);

    // Update filter type when location changes
    useEffect(() => {
        setFilterType(location.pathname.includes("/trends") ? "trends" : "category");
    }, [location.pathname]);

    const handleClick = (item) => {
        const itemPath = item.link.split("/").pop();

        if (activeFilter === itemPath) {
            navigate("/"); // Reset selection
        } else {
            navigate(item.link);
        }
    };

    const toggleVisibility = () => {
        const newVisibility = !isVisible;
        setIsVisible(newVisibility);

        // Also inform parent component about visibility change
        if (onLayoutChange) {
            onLayoutChange(newVisibility);
        }
    };

    const currentOptions = filterType === "category" ? categories : trends;

    // If the component should be hidden, return null
    if (!isVisible) {
        return null;
    }

    return (
        <div className=" sticky top-20">
            {/* Toggle button for mobile/small screens */}
            <button
                onClick={toggleVisibility}
                className="lg:hidden fixed z-10 top-4 left-4 bg-gray-800 text-white p-2 rounded-full shadow-lg"
                aria-label="Toggle filters"
            >
                ☰
            </button>

            {/* Main filter container */}
            <div className="w-full flex lg:flex-col">
                {/* Filter Selector */}
                <div className="flex items-center bg-gray-900 text-white p-3 sticky top-0 z-10">
                    <span className="font-bold mr-2">Filter by:</span>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-white text-black border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value="category">Category</option>
                        <option value="trends">Trends</option>
                    </select>
                </div>

                {/* Filter Options */}
                <div className="w-full flex lg:flex-col flex-row overflow-x-auto">
                    {currentOptions.map((item) => {
                        const itemPath = item.link.split("/").pop();
                        const isActive = activeFilter === itemPath;

                        return (
                            <div
                                key={item.id}
                                onClick={() => handleClick(item)}
                                role="button"
                                className={`${item.color} p-3 border-b border-opacity-20 border-white flex items-center cursor-pointer hover:opacity-90
                                    ${isActive ? "ring-4 ring-white" : ""}
                                    ${filterType === "trends" ? "lg:py-10 py-6" : "py-6"}`}
                            >
                                <div className="text-white mr-2 w-6 flex justify-center">
                                    {item.icon}
                                </div>
                                <span className="text-white font-medium">{item.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FilterByCategory;