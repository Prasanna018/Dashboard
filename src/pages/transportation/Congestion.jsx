import React, { useState } from 'react';
import CongestionChart from '../../graph/transportation/Congestion1';
import LocalCongestionChart from '../../graph/transportation/Congestion2';

function Congestion() {
    const [selectedChart, setSelectedChart] = useState('CongestionChart');

    return (
        <div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Chart:</label>
                <select className="border rounded p-2" value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
                    <option value="CongestionChart">Congestion Chart</option>
                    <option value="LocalCongestionChart">Local Congestion Chart</option>
                </select>
            </div>

            {selectedChart === 'CongestionChart' ? <CongestionChart /> : <LocalCongestionChart />}
        </div>
    );
}

export default Congestion;