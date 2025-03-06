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

const MilesDrivenChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('line');
    const [metricType, setMetricType] = useState('vmt');
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

    // Metric types
    const metrics = [
        { id: 'vmt', name: 'Total VMT' },
        { id: 'vmtPerVehicle', name: 'VMT Per Vehicle' },
        { id: 'vmtPerCap', name: 'VMT Per Capita' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/4_Miles_Driven1.csv');
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
        const result = { year: row.year };

        selectedLocations.forEach(loc => {
            const columnName = `${metricType}${loc}`;
            if (row[columnName]) {
                result[locations.find(l => l.id === loc).name] = parseFloat(row[columnName]);
            }
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

    const getYAxisLabel = () => {
        if (metricType === 'vmt') return 'Billion Miles';
        if (metricType === 'vmtPerVehicle') return 'Thousand Miles per Vehicle';
        return 'Thousand Miles per Capita';
    };

    if (loading) return <div className="text-center p-6">Loading data...</div>;
    if (error) return <div className="text-center p-6 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Miles Driven (2000-2023)</h2>

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
                    <h3 className="font-semibold">Metric Type:</h3>
                    <div className="flex flex-wrap gap-3">
                        {metrics.map((metric) => (
                            <label key={metric.id} className="flex items-center">
                                <input
                                    type="radio"
                                    name="metricType"
                                    value={metric.id}
                                    checked={metricType === metric.id}
                                    onChange={() => setMetricType(metric.id)}
                                    className="mr-1"
                                />
                                {metric.name}
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
                            <XAxis dataKey="year" />
                            <YAxis label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }} />
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
                            <XAxis dataKey="year" />
                            <YAxis label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }} />
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
                <p>Note: VMT stands for Vehicle Miles Traveled. The data shows different metrics of miles driven across various locations from 2000 to 2023.</p>
            </div>
        </div>
    );
};

export default MilesDrivenChart;