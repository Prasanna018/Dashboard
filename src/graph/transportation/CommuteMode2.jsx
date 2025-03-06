import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const CommuteModeVisualization = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('line');
    const [selectedMetric, setSelectedMetric] = useState('hwsov');
    const [availableMetrics, setAvailableMetrics] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [availableYears, setAvailableYears] = useState([]);

    // Define color palette
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

    // Metric groups and their descriptions
    const metricGroups = {
        hw: "Home to Work",
        ch: "College to Home",
        pe: "Personal Errands",
        din: "Dining",
        che: "Childcare to Education",
        pg: "Personal to Grocery"
    };

    // Transportation mode descriptions
    const transportModes = {
        sov: "Single Occupancy Vehicle",
        nonsov: "Non-Single Occupancy Vehicle",
        pool: "Carpool",
        transit: "Public Transit (All)",
        bus: "Bus",
        rail: "Rail",
        subw: "Subway",
        troll: "Trolley",
        ferry: "Ferry",
        walk: "Walking",
        bike: "Biking",
        tmo: "Transportation Management Organization",
        taxi: "Taxi",
        mcyc: "Motorcycle",
        other: "Other Modes",
        wfh: "Work From Home"
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/2_Commute_Mode_Workplace1.csv');
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    complete: (results) => {
                        // Filter out rows with empty year values
                        const validData = results.data.filter(row => row.year && row.year.trim() !== '');

                        // Extract available metrics (all columns except 'year')
                        if (validData.length > 0) {
                            const metrics = Object.keys(validData[0]).filter(key => key !== 'year');
                            setAvailableMetrics(metrics);
                            setSelectedMetric(metrics[0]); // Default to first metric

                            // Extract available years
                            const years = validData.map(row => row.year).filter(year => year);
                            setAvailableYears(years);
                        }

                        setData(validData);
                        setLoading(false);
                    },
                    error: (error) => {
                        setError(error.message);
                        setLoading(false);
                    }
                });
            } catch (err) {
                setError('Failed to fetch the CSV file: ' + err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Prepare data for time series chart
    const timeSeriesData = data.map(row => ({
        year: row.year,
        value: parseFloat(row[selectedMetric]) || 0
    }));

    // Prepare data for pie chart of a specific year
    const getPieData = () => {
        if (!selectedYear) return [];

        const yearData = data.find(row => row.year === selectedYear);
        if (!yearData) return [];

        // Group by trip type (hw, ch, pe, etc.)
        const tripTypes = Object.keys(metricGroups);

        return tripTypes.map(tripType => {
            const modeName = transportModes[selectedMetric.replace(tripType, '')];
            return {
                name: `${metricGroups[tripType]} (${modeName})`,
                value: parseFloat(yearData[tripType + selectedMetric.replace(/^[a-z]+/, '')]) || 0
            };
        }).filter(item => item.value > 0);
    };

    // Prepare data for comparing metrics in a specific year
    const getComparisonData = () => {
        if (!selectedYear) return [];

        const yearData = data.find(row => row.year === selectedYear);
        if (!yearData) return [];

        // Get all metrics for a specific prefix (e.g., all "hw" metrics)
        const prefix = selectedMetric.slice(0, 2);
        return Object.keys(yearData)
            .filter(key => key.startsWith(prefix) && key !== prefix + 'wfh') // Exclude WFH for better scale
            .map(key => ({
                name: transportModes[key.replace(prefix, '')] || key,
                value: parseFloat(yearData[key]) || 0
            }))
            .sort((a, b) => b.value - a.value); // Sort by value descending
    };

    // Helper to get human-readable metric name
    const getMetricName = (metric) => {
        const prefix = metric.slice(0, 2);
        const suffix = metric.slice(2);
        return `${metricGroups[prefix] || prefix} - ${transportModes[suffix] || suffix}`;
    };

    if (loading) return <div className="p-4 text-center">Loading data...</div>;
    if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Commute Mode Visualization</h1>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block mb-2 font-medium">Chart Type:</label>
                    <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="line">Line Chart</option>

                        <option value="area">Area Chart</option>

                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Metric:</label>
                    <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {availableMetrics.map(metric => (
                            <option key={metric} value={metric}>
                                {getMetricName(metric)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Year (for Pie/Comparison):</label>
                    <select
                        value={selectedYear || ''}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Year</option>
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => setSelectedYear(availableYears[availableYears.length - 1])}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Latest Year
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    {chartType === 'pie'
                        ? `Distribution by Trip Type (${selectedYear || 'Select a year'})`
                        : chartType === 'bar' && selectedYear
                            ? `Comparison of Transportation Modes (${selectedYear})`
                            : `Trend of ${getMetricName(selectedMetric)} (2006-2023)`}
                </h2>

                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'line' && (
                            <LineChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis
                                    domain={[0, 'auto']}
                                    tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
                                />
                                <Tooltip
                                    formatter={(value) => [(value * 100).toFixed(2) + '%', getMetricName(selectedMetric)]}
                                    labelFormatter={(label) => `Year: ${label}`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    name={getMetricName(selectedMetric)}
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        )}

                        {chartType === 'bar' && selectedYear && (
                            <BarChart data={getComparisonData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis
                                    domain={[0, 'auto']}
                                    tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
                                />
                                <Tooltip
                                    formatter={(value) => [(value * 100).toFixed(2) + '%', 'Percentage']}
                                />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" name="Percentage" />
                            </BarChart>
                        )}

                        {chartType === 'area' && (
                            <AreaChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis
                                    domain={[0, 'auto']}
                                    tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
                                />
                                <Tooltip
                                    formatter={(value) => [(value * 100).toFixed(2) + '%', getMetricName(selectedMetric)]}
                                    labelFormatter={(label) => `Year: ${label}`}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    name={getMetricName(selectedMetric)}
                                    fill="#8884d8"
                                    stroke="#8884d8"
                                    fillOpacity={0.6}
                                />
                            </AreaChart>
                        )}

                        {chartType === 'pie' && selectedYear && (
                            <PieChart>
                                <Pie
                                    data={getPieData()}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                >
                                    {getPieData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [(value * 100).toFixed(2) + '%', 'Percentage']} />
                                <Legend />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Data Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded">
                        <h3 className="font-bold">Work From Home Trend</h3>
                        <p>Notable increase in WFH percentages after 2020, likely due to the COVID-19 pandemic.</p>
                    </div>
                    <div className="p-4 border rounded">
                        <h3 className="font-bold">Single Occupancy Vehicles</h3>
                        <p>SOV remains the dominant commute mode across all trip types, but shows a slight decrease in recent years.</p>
                    </div>
                    <div className="p-4 border rounded">
                        <h3 className="font-bold">Public Transit</h3>
                        <p>Transit usage dropped significantly in 2020-2021 and is slowly recovering in 2022-2023.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommuteModeVisualization;