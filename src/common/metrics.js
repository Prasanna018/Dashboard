import air_quality from '../assets/indicator_icons/air_quality.svg'
import bridge from '../assets/indicator_icons/bridge_conditions.svg'
import business from '../assets/indicator_icons/business_formations.svg'
import community from '../assets/indicator_icons/community_integration.svg'
import commute from '../assets/indicator_icons/nonSOV_mode_share.svg'
import congestion from '../assets/indicator_icons/roadway_reliability.svg'
import education from '../assets/indicator_icons/educational_attainment.svg'
import greenhouse from '../assets/indicator_icons/emissions.svg'
import gross from '../assets/indicator_icons/exports.svg'
import housing from '../assets/indicator_icons/affordable_housing.svg'
import housing_permit from '../assets/indicator_icons/housing_activity.svg'
import income from '../assets/indicator_icons/income_inequality.svg'
import job_growth from '../assets/indicator_icons/job_growth.svg'
import labour_force from '../assets/indicator_icons/labor_force.svg'
import land_consumption from '../assets/indicator_icons/land_consumption.svg'
import miles from '../assets/indicator_icons/miles_driven.svg'
import mortage from '../assets/indicator_icons/mortgage_lending.svg'
import pavement from '../assets/indicator_icons/pavement_conditions.svg'
import population_growth from '../assets/indicator_icons/population_growth.svg'
import transit_condition from '../assets/indicator_icons/transit_conditions.svg'
import transit_ridership from '../assets/indicator_icons/transit_ridership.svg'

import transpotation_safety from '../assets/indicator_icons/roadway_safety.svg'
import water_quality from '../assets/indicator_icons/water_quality.svg'
import last from '../assets/indicator_icons/tp_homepage_logo.png'

export const metrics = [
    {
        id: 1, name: "Air Quality", category: ["sustainability", "equity", "environment", "very-good"], icon: air_quality,
    },
    { id: 2, name: "Bridge Conditions", category: ["transportation", "resiliency"], icon: bridge },
    { id: 3, name: "Business Formations", icon: business, category: ["resiliency", "economy"] },
    { id: 4, name: "Community Integration", icon: community, category: ["equity", "community", "economy"] },
    { id: 5, name: "Commute Mode", category: ["transportation", "sustainability", "environment", "community"], icon: commute },
    { id: 6, name: "Congestion", category: ["transportation", "sustainability", "economy", "community"], icon: congestion },
    { id: 7, name: "Educational Attainment", icon: education, category: ["equity", "community"] },
    { id: 8, name: "Greenhouse Gas Emissions", icon: greenhouse, category: ["sustainability", "resiliency", "environment", "community",] },
    { id: 9, name: "Gross Domestic Product", icon: gross, category: ["resiliency", "economy"] },
    { id: 10, name: "Housing Affordability", icon: housing, category: ["equity", "economy", "community", "resiliency"] },
    { id: 11, name: "Housing Permits", icon: housing_permit, category: ["sustainability", "environment", "community", "economy"] },
    { id: 12, name: "Income", icon: income, category: ["equity", "resiliency", "community", "economy"] },
    { id: 13, name: "Job Growth", icon: job_growth, category: ["resiliency", "economy", "community"] },
    { id: 14, name: "Labor Force", icon: labour_force, category: ["equity", "community", "economy"] },
    { id: 15, name: "Land Consumption", icon: land_consumption, category: ["sustainability", "resiliency", "environment", "community"] },
    { id: 16, name: "Miles Driven", category: ["transportation", "sustainability", "environment"], icon: miles },
    { id: 17, name: "Mortgage Lending", icon: mortage, category: ["equity", "resiliency", "economy"] },
    { id: 18, name: "Pavement Conditions", category: ["transportation", "resiliency"], icon: pavement },
    { id: 19, name: "Population Growth", icon: population_growth, category: ["environment", "community", "economy"] },
    { id: 20, name: "Transit Conditions", category: ["transportation", "resiliency"], icon: transit_condition },
    { id: 21, name: "Transit Ridership", category: ["transportation", "environment", "sustainability", "community"], icon: transit_ridership },
    { id: 22, name: "Transportation Safety", category: ["transportation", "equity"], icon: transpotation_safety },
    { id: 23, name: "Water Quality", icon: water_quality, category: ["sustainability", "environment"] },
    { id: 24, name: "2050", category: ["transportation", "environment", "community", "economy"], icon: last }
];
