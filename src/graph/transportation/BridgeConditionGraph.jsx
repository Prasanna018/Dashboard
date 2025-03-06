import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const BridgeConditionsChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedOwnership, setSelectedOwnership] = useState('All');
    const [regions, setRegions] = useState([]);
    const [ownerships, setOwnerships] = useState([]);

    useEffect(() => {
        fetch('/1_Bridge_Conditions1_.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(csvString => {
                Papa.parse(csvString, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results) => {
                        const transformedData = results.data.map(row => {
                            if (!row.year) return null;
                            return {
                                year: row.year,
                                ...row
                            };
                        }).filter(Boolean);

                        const headerMap = {};

                        Object.keys(results.data[0] || {}).forEach(key => {
                            if (key !== 'year') {
                                const parts = key.split('-');
                                if (parts.length === 2) {
                                    const region = parts[0].trim();
                                    const ownership = parts[1].trim();

                                    if (!headerMap[region]) {
                                        headerMap[region] = new Set();
                                    }
                                    headerMap[region].add(ownership);
                                }
                            }
                        });

                        const extractedRegions = ['All', ...Object.keys(headerMap)];
                        const extractedOwnerships = ['All', 'State', 'Local', 'Other'];

                        setData(transformedData);
                        setRegions(extractedRegions);
                        setOwnerships(extractedOwnerships);
                        setLoading(false);
                    },
                    error: (error) => {
                        setError(`Error parsing CSV: ${error.message}`);
                        setLoading(false);
                    }
                });
            })
            .catch(error => {
                setError(`Failed to fetch CSV file: ${error.message}`);
                setLoading(false);
            });
    }, []);

    const getLineColor = (index) => {
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#8dd1e1'];
        return colors[index % colors.length];
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><p>Loading bridge condition data...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-600"><p>{error}</p></div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Bridge Conditions (2000-2023)</h2>

            <div className="mb-4 flex flex-wrap gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Region:</label>
                    <select className="border rounded p-2" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                        {regions.map(region => <option key={region} value={region}>{region}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Ownership:</label>
                    <select className="border rounded p-2" value={selectedOwnership} onChange={(e) => setSelectedOwnership(e.target.value)}>
                        {ownerships.map(ownership => <option key={ownership} value={ownership}>{ownership}</option>)}
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 0.5]} tickFormatter={(tick) => tick.toFixed(2)} />
                    <Tooltip formatter={(value) => value.toFixed(3)} />
                    <Legend />
                    {(selectedRegion === 'All' ? regions.slice(1) : [selectedRegion]).map((region, index) => (
                        (selectedOwnership === 'All' ? ownerships.slice(1) : [selectedOwnership]).map((ownership, subIndex) => (
                            <Line
                                key={`${region}-${ownership}`}
                                type="monotone"
                                dataKey={`${region}- ${ownership}`}
                                name={`${region} - ${ownership}`}
                                stroke={getLineColor(index * ownerships.length + subIndex)}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        ))
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BridgeConditionsChart;
