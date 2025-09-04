import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchBudgetData } from '../api/api'; // Import fetch function

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [budgetData, setBudgetData] = useState({
    timeFrame: "week",
    categories: [
      { name: "Tuition", limit: 0, spent: 0 },
      { name: "Rent", limit: 0, spent: 0 },
      { name: "Groceries", limit: 0, spent: 0 },
      { name: "Transport", limit: 0, spent: 0 },
      { name: "Entertainment", limit: 0, spent: 0 },
    ],
  });

  // Fetch the budget data from the API when the component mounts
  useEffect(() => {
    fetchBudgetData()
      .then((data) => {
        if (data) {
          setBudgetData({
            timeFrame: data.timeFrame,
            categories: data.categories,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch budget data:", error);
      });
  }, []);

  const handleTimeFrameChange = (e) => {
    setBudgetData((prev) => ({
      ...prev,
      timeFrame: e.target.value,
    }));
  };

  const handleLimitChange = (index, value) => {
    const updatedCategories = [...budgetData.categories];
    updatedCategories[index].limit = parseFloat(value) || 0;
    setBudgetData((prev) => ({
      ...prev,
      categories: updatedCategories,
    }));
  };

  const chartData = {
    labels: budgetData.categories.map((cat) => cat.name),
    datasets: [
      {
        label: "Budget Allocation",
        data: budgetData.categories.map((cat) => cat.limit),
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0"],
        hoverBackgroundColor: ["#66BB6A", "#42A5F5", "#FFD54F", "#FF7043", "#BA68C8"],
      },
    ],
  };

  const progressBarStyle = (value, max) => ({
    width: max === 0 ? "0%" : `${(value / max) * 100}%`,
    height: "100%",
    backgroundColor: value > max ? "#FF4C4C" : "#4CAF50",
    borderRadius: "10px",
  });

  const appStyle = {
    fontFamily: "Arial, sans-serif",
    margin: "20px auto",
    maxWidth: "600px",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const formStyle = {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor:"#fff",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const selectStyle = {
    ...inputStyle,
    marginBottom: "15px",
  };

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div style={appStyle}>
      <h1 style={headingStyle}>Student Budget Tracker</h1>

      <form style={formStyle}>
        <label>Set Time Frame:</label>
        <select
          value={budgetData.timeFrame}
          onChange={handleTimeFrameChange}
          style={selectStyle}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="term">Term</option>
        </select>
        {budgetData.categories.map((category, index) => (
          <div key={index}>
            <label>
              {category.name} Limit (UGX):
            </label>
            <input
              type="number"
              value={category.limit}
              onChange={(e) => handleLimitChange(index, e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}
        <button type="button" style={buttonStyle}>
          Update Budget
        </button>
      </form>

      <h2 style={headingStyle}>Budget Overview</h2>
      <Pie data={chartData} />
      {budgetData.categories.map((category, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h3>{category.name}</h3>
          <div
            style={{
              width: "100%",
              height: "20px",
              borderRadius: "10px",
              backgroundColor: "#e0e0e0",
              marginBottom: "5px",
            }}
          >
            <div style={progressBarStyle(category.spent, category.limit)}></div>
          </div>
          <p>
            Spent: <strong>UGX {category.spent}</strong> /{" "}
            <strong>UGX {category.limit}</strong>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;