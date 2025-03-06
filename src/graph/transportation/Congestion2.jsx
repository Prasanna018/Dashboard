import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

const LocalCongestionChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('bar');
    const [timeOfDay, setTimeOfDay] = useState('24');
    const [selectedLocations, setSelectedLocations] = useState(['hw', 'ch', 'pe']);

    // All possible column prefixes (locations)
    const locations = [
        { id: 'hw', name: 'Highway' },
        { id: 'ch', name: 'Chestnut' },
        { id: 'pe', name: 'Peninsula' },
        { id: 'che', name: 'Chelsea' },
        { id: 'din', name: 'Dinning' },
        { id: 'pg', name: 'Pine Grove' }
    ];

    // Time periods
    const timePeriods = [
        { id: 'AM', name: 'Morning' },
        { id: 'MD', name: 'Midday' },
        { id: 'PM', name: 'Evening' },
        { id: 'NT', name: 'Night' },
        { id: '24', name: '24 Hour' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/3_Congestion_local1.csv');
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    complete: (results) => {
                        setData(results.data);
                        setLoading(false);
                    },
                    error: (error) => {
                        setError(error.message);
                        setLoading(false);
                    }
                });
            } catch (err) {
                setError('Failed to fetch the CSV file');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Process data for the chart
    const processedData = data.map(row => {
        const result = { Year: row.Year };

        selectedLocations.forEach(loc => {
            result[locations.find(l => l.id === loc).name] = parseFloat(row[`${loc}${timeOfDay}`]);
        });

        return result;
    });

    const handleLocationChange = (locId) => {
        if (selectedLocations.includes(locId)) {
            setSelectedLocations(selectedLocations.filter(id => id !== locId));
        } else {
            setSelectedLocations([...selectedLocations, locId]);
        }
    };

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

    if (loading) return <div className="text-center p-6">Loading data...</div>;
    if (error) return <div className="text-center p-6 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Local Roads Congestion Index (2011-2023)</h2>

            <div className="mb-6 flex flex-wrap gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">Chart Type:</h3>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="chartType"
                                value="bar"
                                checked={chartType === 'bar'}
                                onChange={() => setChartType('bar')}
                                className="mr-2"
                            />
                            Bar Chart
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="chartType"
                                value="line"
                                checked={chartType === 'line'}
                                onChange={() => setChartType('line')}
                                className="mr-2"
                            />
                            Line Chart
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">Time of Day:</h3>
                    <div className="flex flex-wrap gap-3">
                        {timePeriods.map((period) => (
                            <label key={period.id} className="flex items-center">
                                <input
                                    type="radio"
                                    name="timeOfDay"
                                    value={period.id}
                                    checked={timeOfDay === period.id}
                                    onChange={() => setTimeOfDay(period.id)}
                                    className="mr-1"
                                />
                                {period.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">Locations:</h3>
                    <div className="flex flex-wrap gap-3">
                        {locations.map((location, index) => (
                            <label key={location.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedLocations.includes(location.id)}
                                    onChange={() => handleLocationChange(location.id)}
                                    className="mr-1"
                                />
                                <span style={{ color: colors[index] }}>{location.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                        <BarChart
                            data={processedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Year" />
                            <YAxis domain={[1, 'auto']} />
                            <Tooltip formatter={(value) => value.toFixed(2)} />
                            <Legend />
                            {selectedLocations.map((loc, index) => (
                                <Bar
                                    key={loc}
                                    dataKey={locations.find(l => l.id === loc).name}
                                    fill={colors[index]}
                                />
                            ))}
                        </BarChart>
                    ) : (
                        <LineChart
                            data={processedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Year" />
                            <YAxis domain={[1, 'auto']} />
                            <Tooltip formatter={(value) => value.toFixed(2)} />
                            <Legend />
                            {selectedLocations.map((loc, index) => (
                                <Line
                                    key={loc}
                                    type="monotone"
                                    dataKey={locations.find(l => l.id === loc).name}
                                    stroke={colors[index]}
                                    activeDot={{ r: 8 }}
                                />
                            ))}
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm">
                <p>Note: Congestion index values represent the ratio of travel time compared to free-flow conditions. Higher values indicate more congestion.</p>
            </div>
        </div>
    );
};

export default LocalCongestionChart;