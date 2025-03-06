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
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const BridgeConditionsChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedOwnership, setSelectedOwnership] = useState('All');
    const [selectedYear, setSelectedYear] = useState(null);
    const [regions, setRegions] = useState([]);
    const [ownerships, setOwnerships] = useState([]);
    const [years, setYears] = useState([]);
    const [chartType, setChartType] = useState('line');
    const [comparisonType, setComparisonType] = useState('region');

    useEffect(() => {
        // Fetch the CSV file from the public folder
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
                        // Transform the data for use with Recharts
                        const transformedData = results.data
                            .filter(row => row.year) // Skip empty rows
                            .map(row => ({
                                year: row.year,
                                ...row
                            }));

                        // Extract unique regions, ownerships, and years
                        const uniqueYears = [...new Set(transformedData.map(row => row.year))];
                        const headerMap = {};
                        const columnHeaders = Object.keys(results.data[0] || {});

                        columnHeaders.forEach(key => {
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

                        const extractedRegions = Object.keys(headerMap);
                        const extractedOwnerships = ['All', 'State', 'Local', 'Other'];

                        setData(transformedData);
                        setRegions(['All', ...extractedRegions]);
                        setOwnerships(extractedOwnerships);
                        setYears(uniqueYears);
                        setSelectedYear(uniqueYears[uniqueYears.length - 1]); // Set most recent year as default
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

    // Generate colors for the lines/bars
    const getColor = (index) => {
        const colors = [
            '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
            '#0088fe', '#00c49f', '#8dd1e1', '#ff8042',
            '#a4de6c', '#d0ed57', '#83a6ed', '#8884d8',
            '#82ca9d', '#ffc658', '#ff7300'
        ];
        return colors[index % colors.length];
    };

    const compareRegions = (regionA, regionB) => {
        if (regionA === "All") return -1;
        if (regionB === "All") return 1;
        if (regionA === "MPO") return -1;
        if (regionB === "MPO") return 1;
        return regionA.localeCompare(regionB);
    };

    // Prepare data for charts
    const prepareTimeSeriesData = () => {
        if (selectedRegion === 'All' && selectedOwnership === 'All') {
            // Show all regions with All ownership
            return data;
        } else if (selectedRegion === 'All') {
            // Filter by ownership type only
            return data;
        } else if (selectedOwnership === 'All') {
            // Filter by region only
            return data;
        } else {
            // Filter by both region and ownership
            return data;
        }
    };

    const prepareYearComparisonData = () => {
        if (!selectedYear) return [];

        const yearData = data.find(item => item.year === selectedYear);
        if (!yearData) return [];

        const result = [];

        if (comparisonType === 'region') {
            // Compare all regions for selected ownership
            const regionsToCompare = selectedRegion === 'All' ? regions.filter(r => r !== 'All') : [selectedRegion];

            regionsToCompare.forEach(region => {
                const ownershipsToCompare = selectedOwnership === 'All' ?
                    ownerships.filter(o => o !== 'All') :
                    [selectedOwnership];

                ownershipsToCompare.forEach(ownership => {
                    const key = `${region}- ${ownership}`;
                    if (yearData[key] !== undefined) {
                        result.push({
                            name: region === 'MPO' ? `${region}-${ownership}` : region,
                            ownership: ownership,
                            value: yearData[key]
                        });
                    }
                });
            });
        } else {
            // Compare all ownerships for selected region
            const regionsToCompare = selectedRegion === 'All' ?
                regions.filter(r => r !== 'All') :
                [selectedRegion];

            regionsToCompare.forEach(region => {
                ownerships.filter(o => o !== 'All').forEach(ownership => {
                    const key = `${region}- ${ownership}`;
                    if (yearData[key] !== undefined) {
                        result.push({
                            name: ownership,
                            region: region,
                            value: yearData[key]
                        });
                    }
                });
            });
        }

        return result;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading bridge condition data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-600">
                <p>{error}</p>
                <p className="mt-2 text-sm">Make sure the CSV file is placed in the public folder at '/1_Bridge_Conditions1_.csv'</p>
            </div>
        );
    }

    const timeSeriesData = prepareTimeSeriesData();
    const yearComparisonData = prepareYearComparisonData();

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Bridge Conditions Dashboard (2000-2023)</h2>

            {/* Controls */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Region:</label>
                        <select
                            className="border rounded p-2 w-full"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            {regions.sort(compareRegions).map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Ownership:</label>
                        <select
                            className="border rounded p-2 w-full"
                            value={selectedOwnership}
                            onChange={(e) => setSelectedOwnership(e.target.value)}
                        >
                            {ownerships.map(ownership => (
                                <option key={ownership} value={ownership}>{ownership}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Chart Type:</label>
                        <select
                            className="border rounded p-2 w-full"
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value)}
                        >
                            <option value="line">Line Chart</option>
                            <option value="bar">Bar Chart</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Year for Comparison:</label>
                        <select
                            className="border rounded p-2 w-full"
                            value={selectedYear || ''}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Compare By:</label>
                        <select
                            className="border rounded p-2 w-full"
                            value={comparisonType}
                            onChange={(e) => setComparisonType(e.target.value)}
                        >
                            <option value="region">Regions</option>
                            <option value="ownership">Ownership Types</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Time Series Chart */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">
                    Bridge Conditions Over Time
                    {selectedRegion !== 'All' && ` - ${selectedRegion}`}
                    {selectedOwnership !== 'All' && ` (${selectedOwnership} Ownership)`}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    {chartType === 'line' ? (
                        <LineChart
                            data={timeSeriesData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis
                                domain={[0, 0.5]}
                                tickFormatter={(tick) => tick.toFixed(2)}
                                label={{ value: 'Condition Index', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip formatter={(value) => value?.toFixed(3) || 'N/A'} />
                            <Legend />
                            {selectedRegion === 'All' ? (
                                // Show multiple regions
                                regions.filter(r => r !== 'All').map((region, index) => (
                                    <Line
                                        key={region}
                                        type="monotone"
                                        dataKey={`${region}- ${selectedOwnership}`}
                                        name={region}
                                        stroke={getColor(index)}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                        isAnimationActive={true}
                                        connectNulls={true}
                                    />
                                ))
                            ) : (
                                // Show multiple ownership types for selected region
                                selectedOwnership === 'All' ? (
                                    ownerships.filter(o => o !== 'All').map((ownership, index) => (
                                        <Line
                                            key={ownership}
                                            type="monotone"
                                            dataKey={`${selectedRegion}- ${ownership}`}
                                            name={ownership}
                                            stroke={getColor(index)}
                                            dot={{ r: 3 }}
                                            activeDot={{ r: 5 }}
                                            isAnimationActive={true}
                                            connectNulls={true}
                                        />
                                    ))
                                ) : (
                                    // Single line for specific region and ownership
                                    <Line
                                        type="monotone"
                                        dataKey={`${selectedRegion}- ${selectedOwnership}`}
                                        name={`${selectedRegion} - ${selectedOwnership}`}
                                        stroke={getColor(0)}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                        isAnimationActive={true}
                                        connectNulls={true}
                                    />
                                )
                            )}
                        </LineChart>
                    ) : (
                        <BarChart
                            data={timeSeriesData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis
                                domain={[0, 0.5]}
                                tickFormatter={(tick) => tick.toFixed(2)}
                                label={{ value: 'Condition Index', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip formatter={(value) => value?.toFixed(3) || 'N/A'} />
                            <Legend />
                            {selectedRegion === 'All' ? (
                                // Show multiple regions
                                regions.filter(r => r !== 'All').map((region, index) => (
                                    <Bar
                                        key={region}
                                        dataKey={`${region}- ${selectedOwnership}`}
                                        name={region}
                                        fill={getColor(index)}
                                    />
                                ))
                            ) : (
                                // Show multiple ownership types for selected region
                                selectedOwnership === 'All' ? (
                                    ownerships.filter(o => o !== 'All').map((ownership, index) => (
                                        <Bar
                                            key={ownership}
                                            dataKey={`${selectedRegion}- ${ownership}`}
                                            name={ownership}
                                            fill={getColor(index)}
                                        />
                                    ))
                                ) : (
                                    // Single bar for specific region and ownership
                                    <Bar
                                        dataKey={`${selectedRegion}- ${selectedOwnership}`}
                                        name={`${selectedRegion} - ${selectedOwnership}`}
                                        fill={getColor(0)}
                                    />
                                )
                            )}
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Year Comparison Chart */}
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    {comparisonType === 'region' ? 'Region Comparison' : 'Ownership Comparison'} for Year {selectedYear}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={yearComparisonData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout={comparisonType === 'region' ? 'vertical' : 'horizontal'}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        {comparisonType === 'region' ? (
                            <>
                                <YAxis dataKey="name" type="category" />
                                <XAxis
                                    type="number"
                                    domain={[0, 0.5]}
                                    tickFormatter={(tick) => tick.toFixed(2)}
                                />
                            </>
                        ) : (
                            <>
                                <XAxis dataKey="name" type="category" />
                                <YAxis
                                    domain={[0, 0.5]}
                                    tickFormatter={(tick) => tick.toFixed(2)}
                                    label={{ value: 'Condition Index', angle: -90, position: 'insideLeft' }}
                                />
                            </>
                        )}
                        <Tooltip
                            formatter={(value) => value.toFixed(3)}
                            labelFormatter={(label) => {
                                if (comparisonType === 'region') {
                                    const item = yearComparisonData.find(item => item.name === label);
                                    return `${label} (${item?.ownership || 'Unknown'})`;
                                } else {
                                    const item = yearComparisonData.find(item => item.name === label);
                                    return `${label} (${item?.region || 'Unknown'})`;
                                }
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="value"
                            name="Condition Index"
                            fill="#8884d8"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BridgeConditionsChart;