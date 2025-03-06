import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Papa from "papaparse";

const categories = [
    { key: "hwtotKill", label: "Highway Fatalities", color: "#6366F1" },
    { key: "chtotKill", label: "Child Fatalities", color: "#EC4899" },
    { key: "petotKill", label: "Pedestrian Fatalities", color: "#10B981" },
    { key: "pgtotKill", label: "Passenger Fatalities", color: "#F59E0B" },
    { key: "dintotKill", label: "Driver-Involved Fatalities", color: "#EF4444" }
];

const Graph = () => {
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].key);

    useEffect(() => {
        fetch("/8_transp_safety1.csv")
            .then((response) => response.text())
            .then((csvText) => {
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    complete: (result) => {
                        const filteredData = result.data.filter(row => row.Year);
                        setData(filteredData);
                    },
                });
            });
    }, []);

    const selectedCategoryInfo = categories.find(cat => cat.key === selectedCategory);

    return (
        <div className="flex flex-col items-center space-y-6 w-full p-6 bg-gray-100 rounded-lg shadow-lg">
            <select
                className="p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                {categories.map(({ key, label }) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>

            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">{selectedCategoryInfo?.label}</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="Year" className="text-gray-700" />
                        <YAxis className="text-gray-700" />
                        <Tooltip wrapperClassName="bg-gray-50 rounded-lg p-2 shadow" />
                        <Line
                            type="monotone"
                            dataKey={selectedCategory}
                            stroke={selectedCategoryInfo?.color}
                            strokeWidth={2}
                            dot={{ r: 4, fill: selectedCategoryInfo?.color }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Graph;