import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area
} from 'recharts';
import Papa from 'papaparse';

const CommuteVisualization = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [chartType, setChartType] = useState('line');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Colors for the chart lines
    const COLORS = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F',
        '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/2_Commute_Mode_Residence1.csv');
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results) => {
                        setData(results.data.filter(row => row.year !== null));

                        // Get column names
                        if (results.data.length > 0) {
                            const cols = Object.keys(results.data[0])
                                .filter(col => col !== 'year');
                            setColumns(cols);
                            // Default select first 5 columns
                            setSelectedColumns(cols.slice(0, 5));
                        }

                        setLoading(false);
                    },
                    error: (error) => {
                        setError('Error parsing CSV: ' + error.message);
                        setLoading(false);
                    }
                });
            } catch (err) {
                setError('Error fetching CSV: ' + err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleColumnSelect = (column) => {
        if (selectedColumns.includes(column)) {
            setSelectedColumns(selectedColumns.filter(col => col !== column));
        } else {
            setSelectedColumns([...selectedColumns, column]);
        }
    };

    const handleSelectAll = () => {
        if (selectedColumns.length === columns.length) {
            setSelectedColumns([]);
        } else {
            setSelectedColumns([...columns]);
        }
    };

    const handleChartTypeChange = (type) => {
        setChartType(type);
    };

    const groupColumns = () => {
        // Group columns by prefix (hw, ch, pe, etc.)
        const groups = {};
        columns.forEach(column => {
            const prefix = column.substring(0, 2);
            if (!groups[prefix]) {
                groups[prefix] = [];
            }
            groups[prefix].push(column);
        });
        return groups;
    };

    const columnGroups = groupColumns();

    const renderChart = () => {
        if (selectedColumns.length === 0) {
            return <div className="p-4 text-center">Please select at least one column to display</div>;
        }

        if (chartType === 'line') {
            return (
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedColumns.map((column, index) => (
                            <Line
                                key={column}
                                type="monotone"
                                dataKey={column}
                                stroke={COLORS[index % COLORS.length]}
                                activeDot={{ r: 8 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            );
        } else if (chartType === 'bar') {
            return (
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedColumns.map((column, index) => (
                            <Bar
                                key={column}
                                dataKey={column}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            );
        } else if (chartType === 'area') {
            return (
                <ResponsiveContainer width="100%" height={500}>
                    <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedColumns.map((column, index) => (
                            <Area
                                key={column}
                                type="monotone"
                                dataKey={column}
                                fill={COLORS[index % COLORS.length]}
                                stroke={COLORS[index % COLORS.length]}
                                fillOpacity={0.6}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            );
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading data...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Commute Mode Visualization</h1>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Chart Type</h2>
                <div className="flex space-x-4">
                    <button
                        className={`px-4 py-2 rounded ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleChartTypeChange('line')}
                    >
                        Line Chart
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleChartTypeChange('bar')}
                    >
                        Bar Chart
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${chartType === 'area' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleChartTypeChange('area')}
                    >
                        Area Chart
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Select Columns</h2>
                    <button
                        className="px-3 py-1 bg-gray-200 rounded text-sm"
                        onClick={handleSelectAll}
                    >
                        {selectedColumns.length === columns.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(columnGroups).map(([prefix, groupColumns]) => (
                        <div key={prefix} className="border rounded p-3">
                            <h3 className="font-medium mb-2">
                                {prefix === 'hw' ? 'Home to Work' :
                                    prefix === 'ch' ? 'Childcare to Home' :
                                        prefix === 'pe' ? 'Personal' :
                                            prefix === 'di' ? 'Dining' :
                                                prefix === 'ch' ? 'Childcare' :
                                                    prefix === 'pg' ? 'Personal/Grocery' : prefix}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {groupColumns.map(column => (
                                    <div key={column} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={column}
                                            checked={selectedColumns.includes(column)}
                                            onChange={() => handleColumnSelect(column)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={column} className="text-sm truncate">
                                            {column}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border rounded-lg p-4 bg-white">
                {renderChart()}
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Data Summary</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Year</th>
                                {selectedColumns.slice(0, 5).map(column => (
                                    <th key={column} className="py-2 px-4 border">{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 5).map((row, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                    <td className="py-2 px-4 border">{row.year}</td>
                                    {selectedColumns.slice(0, 5).map(column => (
                                        <td key={column} className="py-2 px-4 border text-right">{row[column]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">Showing first 5 rows and selected columns</p>
            </div>
        </div>
    );
};

export default CommuteVisualization;