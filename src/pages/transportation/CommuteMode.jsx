import React, { useState } from "react";
import CommuteVisualization from "../../graph/transportation/CommuteMode1";
import CommuteModeVisualization from "../../graph/transportation/CommuteMode2";

function CommuteMode() {
    // Set "mode2" as the default selected visualization
    const [selectedMode, setSelectedMode] = useState("mode2");

    return (
        <div>
            {/* Dropdown for selection */}
            <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                style={{ marginBottom: "10px", padding: "5px" }}
            >
                <option value="mode1">Commute Visualization 1</option>
                <option value="mode2">Commute Visualization 2</option>
            </select>

            {/* Conditionally render components based on selection */}
            {selectedMode === "mode1" && <CommuteVisualization />}
            {selectedMode === "mode2" && <CommuteModeVisualization />}
        </div>
    );
}

export default CommuteMode;
