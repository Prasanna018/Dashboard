import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./component/Footer";
import HeroInfo from "./component/HeroInfo";
import FilterByCategory from "./component/Left";
import NavBar from "./component/NavBar";
import Right from "./component/Right";

// Import individual metric components for each category
import AirQuality from "./pages/transportation/BridgeTransportation";
import BridgeTransportation from "./pages/transportation/BridgeTransportation";
import CommuteMode from "./pages/transportation/CommuteMode";
// Transportation
// import BridgeConditions from "./pages/transportation/BridgeConditions";
// import CommuteMode from "./pages/transportation/CommuteMode";
// import Congestion from "./pages/transportation/Congestion";
// import MilesDriven from "./pages/transportation/MilesDriven";
// import PavementConditions from "./pages/transportation/PavementConditions";
// import TransitConditions from "./pages/transportation/TransitConditions";
// import TransitRidership from "./pages/transportation/TransitRidership";
// import TransportationSafety from "./pages/transportation/TransportationSafety";
// // Environment
// import GreenhouseGasEmissions from "./pages/environment/GreenhouseGasEmissions";
// import HousingPermits from "./pages/environment/HousingPermits";
// import LandConsumption from "./pages/environment/LandConsumption";
// import PopulationGrowth from "./pages/environment/PopulationGrowth";
// import WaterQuality from "./pages/environment/WaterQuality";
// // Equity
// import CommunityIntegration from "./pages/equity/CommunityIntegration";
// import EducationalAttainment from "./pages/equity/EducationalAttainment";
// import HousingAffordability from "./pages/equity/HousingAffordability";
// import Income from "./pages/equity/Income";
// import LaborForce from "./pages/equity/LaborForce";
// import MortgageLending from "./pages/equity/MortgageLending";
// // Economy
// import BusinessFormations from "./pages/economy/BusinessFormations";
// import GDP from "./pages/economy/GrossDomesticProduct";
// import JobGrowth from "./pages/economy/JobGrowth";
// import Future2050 from "./pages/economy/2050";

function App() {
  // const [showFeaturedCategory, setShowFeaturedCategory] = useState(true);
  return (
    <Router>
      <div className="w-full">
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <NavBar />
        </div>

        {/* Add margin to prevent content from hiding behind the fixed navbar */}
        <div className="pt-[60px]">
          <HeroInfo />
        </div>

        <div className="flex lg:flex-row flex-col w-full">
          {/* Sidebar */}
          <div className="lg:w-[15vw]">
            {/* <FilterByCategory onLayoutChange={(visible) => setShowFeaturedCategory(visible)} /> */}
            <FilterByCategory></FilterByCategory>
            {/* {showFeaturedCategory} */}
          </div>

          {/* Main Content */}
          <div className="p-2 mx-2 w-full bg-[#e9e9e9]">
            <Routes>
              <Route path="/" element={<Right />} />

              {/* Transportation Routes */}
              <Route path="/transportation" element={<Right />}>
                <Route path="bridge-conditions" element={<BridgeTransportation />} />

                <Route path="commute-mode" element={<CommuteMode />} />
                {/* <Route path="congestion" element={<Congestion />} /> */}
                {/* <Route path="miles-driven" element={<MilesDriven />} /> */}
                {/* <Route path="pavement-conditions" element={<PavementConditions />} /> */}
                {/* <Route path="transit-conditions" element={<TransitConditions />} /> */}
                {/* <Route path="transit-ridership" element={<TransitRidership />} /> */}
                {/* <Route path="transportation-safety" element={<TransportationSafety />} /> */}
              </Route>

              {/* Environment Routes */}
              {/* <Route path="/environment" element={<Right />}>
                {/* <Route path="air-quality" element={<AirQuality />} /> */}
              {/* <Route path="greenhouse-gas-emissions" element={<GreenhouseGasEmissions />} /> */}
              {/* <Route path="housing-permits" element={<HousingPermits />} /> */}
              {/* <Route path="land-consumption" element={<LandConsumption />} /> */}
              {/* <Route path="miles-driven" element={<MilesDriven />} /> */}
              {/* <Route path="population-growth" element={<PopulationGrowth />} /> */}
              {/* <Route path="transit-ridership" element={<TransitRidership />} /> */}
              {/* <Route path="water-quality" element={<WaterQuality />} /> */}
              {/* </Route> */} */

              {/* Equity Routes */}
              {/* <Route path="/equity" element={<Right />}> */}
              {/* <Route path="air-quality" element={<AirQuality />} /> */}
              {/* <Route path="community-integration" element={<CommunityIntegration />} /> */}
              {/* <Route path="educational-attainment" element={<EducationalAttainment />} /> */}
              {/* <Route path="housing-affordability" element={<HousingAffordability />} /> */}
              {/* <Route path="income" element={<Income />} /> */}
              {/* <Route path="labor-force" element={<LaborForce />} /> */}
              {/* <Route path="mortgage-lending" element={<MortgageLending />} /> */}
              {/* <Route path="transportation-safety" element={<TransportationSafety />} /> */}
              {/* </Route> */}

              {/* Economy Routes */}
              {/* <Route path="/economy" element={<Right />}> */}
              {/* <Route path="business-formations" element={<BusinessFormations />} /> */}
              {/* <Route path="community-integration" element={<CommunityIntegration />} /> */}
              {/* <Route path="congestion" element={<Congestion />} /> */}
              {/* <Route path="gross-domestic-product" element={<GDP />} /> */}
              {/* <Route path="housing-affordability" element={<HousingAffordability />} /> */}
              {/* <Route path="housing-permits" element={<HousingPermits />} /> */}
              {/* <Route path="income" element={<Income />} /> */}
              {/* <Route path="job-growth" element={<JobGrowth />} /> */}
              {/* <Route path="labor-force" element={<LaborForce />} /> */}
              {/* <Route path="mortgage-lending" element={<MortgageLending />} /> */}
              {/* <Route path="population-growth" element={<PopulationGrowth />} /> */}
              {/* <Route path="2050" element={<Future2050 />} /> */}
              {/* </Route> */}
            </Routes>
          </div>

        </div>
        <Outlet></Outlet>

        <div className="pt-4">
          <Footer />

        </div>
      </div >
    </Router >
  );
}

export default App;
