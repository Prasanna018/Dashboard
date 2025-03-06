import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { metrics } from "../common/Metrics.js";
import { metrics } from '../common/metrics.js'
import { motion, AnimatePresence } from "framer-motion";

const transportationSubRoutes = [
    { name: "Air Quality", link: "/transportation/air-quality" },
    { name: "Bridge Conditions", link: "/transportation/bridge-conditions" },
    { name: "Commute Mode", link: "/transportation/commute-mode" },
    { name: "Congestion", link: "/transportation/congestion" },
    { name: "Miles Driven", link: "/transportation/miles-driven" },
    { name: "Pavement Conditions", link: "/transportation/pavement-conditions" },
    { name: "Transit Conditions", link: "/transportation/transit-conditions" },
    { name: "Transit Ridership", link: "/transportation/transit-ridership" },
    { name: "Transportation Safety", link: "/transportation/transportation-safety" }
];

const environmentSubRoutes = [
    { name: "Air Quality", link: "/environment/air-quality" },
    { name: "Commute Mode", link: "/environment/commute-mode" },
    { name: "Greenhouse Gas Emissions", link: "/environment/greenhouse-gas-emissions" },
    { name: "Housing Permits", link: "/environment/housing-permits" },
    { name: "Land Consumption", link: "/environment/land-consumption" },
    { name: "Miles Driven", link: "/environment/miles-driven" },
    { name: "Population Growth", link: "/environment/population-growth" },
    { name: "Transit Ridership", link: "/environment/transit-ridership" },
    { name: "Water Quality", link: "/environment/water-quality" }
];

const equitySubRoutes = [
    { name: "Air Quality", link: "/equity/air-quality" },
    { name: "Community Integration", link: "/equity/community-integration" },
    { name: "Educational Attainment", link: "/equity/educational-attainment" },
    { name: "Housing Affordability", link: "/equity/housing-affordability" },
    { name: "Income", link: "/equity/income" },
    { name: "Labor Force", link: "/equity/labor-force" },
    { name: "Mortgage Lending", link: "/equity/mortgage-lending" },
    { name: "Transportation Safety", link: "/equity/transportation-safety" }
];

const economySubRoutes = [
    { name: "Business Formations", link: "/economy/business-formations" },
    { name: "Community Integration", link: "/economy/community-integration" },
    { name: "Congestion", link: "/economy/congestion" },
    { name: "Gross Domestic Product", link: "/economy/gross-domestic-product" },
    { name: "Housing Affordability", link: "/economy/housing-affordability" },
    { name: "Housing Permits", link: "/economy/housing-permits" },
    { name: "Income", link: "/economy/income" },
    { name: "Job Growth", link: "/economy/job-growth" },
    { name: "Labor Force", link: "/economy/labor-force" },
    { name: "Mortgage Lending", link: "/economy/mortgage-lending" },
    { name: "Population Growth", link: "/economy/population-growth" },
    { name: "2050", link: "/economy/2050" }
];

function Right() {
    const location = useLocation();
    const navigate = useNavigate();
    const [routeFilter, setRouteFilter] = useState("");
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        const newRouteFilter = pathSegments[pathSegments.length - 1] || "";
        setRouteFilter(newRouteFilter);

        // Check if we're on a detail page (has 2 or more segments)
        setShowDetails(pathSegments.length >= 2 && pathSegments[1] !== "");
    }, [location]);

    const categories = [
        { id: 1, name: "Sustainability", color: "bg-teal-700", link: "/sustainability" },
        { id: 2, name: "Equity", color: "bg-teal-600", link: "/equity" },
        { id: 3, name: "Resiliency", color: "bg-teal-500", link: "/resiliency" },
        { id: 4, name: "Environment", color: "bg-green-700", link: "/environment" },
        { id: 5, name: "Community", color: "bg-blue-800", link: "/community" },
        { id: 6, name: "Transportation", color: "bg-purple-900", link: "/transportation" },
        { id: 7, name: "Economy", color: "bg-purple-800", link: "/economy" }
    ];

    const currentCategory = categories.find(cat => location.pathname.startsWith(cat.link));
    const highlightColor = currentCategory ? currentCategory.color : "bg-[#007f84]";

    const getSubRoute = (metric) => {
        const formattedName = metric.name.toLowerCase().replace(/\s+/g, '-');

        if (location.pathname.includes("/transportation")) {
            return transportationSubRoutes.find(route => route.name.toLowerCase().replace(/\s+/g, '-') === formattedName);
        } else if (location.pathname.includes("/environment")) {
            return environmentSubRoutes.find(route => route.name.toLowerCase().replace(/\s+/g, '-') === formattedName);
        } else if (location.pathname.includes("/equity")) {
            return equitySubRoutes.find(route => route.name.toLowerCase().replace(/\s+/g, '-') === formattedName);
        } else if (location.pathname.includes("/economy")) {
            return economySubRoutes.find(route => route.name.toLowerCase().replace(/\s+/g, '-') === formattedName);
        }

        return null;
    };

    const handleMetricClick = (metric) => {
        const subRoute = getSubRoute(metric);
        if (subRoute) {
            navigate(subRoute.link);
        }
    };

    const handleBackClick = () => {
        // Navigate back to the category page
        if (currentCategory) {
            navigate(currentCategory.link);
        }
    };

    return (
        <div className="flex w-full h-full overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
                {!showDetails ? (
                    <motion.div
                        key="grid"
                        className="p-2 w-full"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <div className="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-3 gap-x-4 gap-y-12">
                            {metrics.map((metric) => {
                                const isHighlighted = currentCategory
                                    ? metric.category.includes(currentCategory.name.toLowerCase())
                                    : false;

                                const isCurrentCategoryRoute = location.pathname.includes(currentCategory?.link || "");
                                const isMetricInCategory = metric.category.includes(currentCategory?.name.toLowerCase() || "");

                                return (
                                    <motion.div
                                        key={metric.id}
                                        onClick={() => {
                                            if (isCurrentCategoryRoute && isMetricInCategory) {
                                                handleMetricClick(metric);
                                            }
                                        }}
                                        className={`relative rounded shadow-md flex flex-col items-center justify-center text-white transition-all duration-500 ease-in-out p-2 aspect-square
                                        ${isHighlighted ? `${highlightColor}` : "bg-[#007f84]"}
                                        ${currentCategory && !isHighlighted ? "opacity-50 pointer-events-none" : ""}
                                        ${isCurrentCategoryRoute && isMetricInCategory ? "cursor-pointer hover:ring-4 hover:ring-white" : ""}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img
                                            src={metric.icon}
                                            alt={metric.name}
                                            className="w-18 h-18 mb-2"
                                        />
                                        <div className="text-center text-sm font-medium">
                                            {metric.name}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="details"
                        className="w-full flex flex-col"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <motion.button
                            onClick={handleBackClick}
                            className="ml-4 mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center self-start"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to {currentCategory?.name || "Dashboard"}
                        </motion.button>
                        <div className="p-4 w-full">
                            <Outlet />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Right;