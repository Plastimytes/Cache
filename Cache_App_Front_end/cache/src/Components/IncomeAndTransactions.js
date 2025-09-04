import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const incomeSources = ['Salary', 'Hustle', 'Freelance', 'Investment'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DashboardIncome = () => {
  // Load initial data from localStorage or default empty
  const [monthlyIncomes, setMonthlyIncomes] = useState(() => {
    const saved = localStorage.getItem('monthlyIncomes');
    return saved ? JSON.parse(saved) : {};
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Update localStorage whenever monthlyIncomes changes
  useEffect(() => {
    localStorage.setItem('monthlyIncomes', JSON.stringify(monthlyIncomes));
    renderIncomeChart();
  }, [monthlyIncomes]);

  // Render or update the Chart.js bar chart
  const renderIncomeChart = () => {
    if (!chartRef.current) return;

    const data = months.map(month => {
      if (monthlyIncomes[month]) {
        return Object.values(monthlyIncomes[month]).reduce((sum, val) => sum + parseFloat(val || 0), 0);
      }
      return 0;
    });

    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = data;
      chartInstance.current.update();
    } else {
      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [{
            label: 'Monthly Income',
            data: data,
            backgroundColor: '#4ade80',
            borderColor: '#22c55e',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => '$' + value
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => 'Income: $' + context.parsed.y
              }
            }
          }
        }
      });
    }
  };

  // Handle checkbox toggle for income source per month
  const handleCheckboxChange = (month, source, checked) => {
    setMonthlyIncomes(prev => {
      const monthData = { ...(prev[month] || {}) };
      if (!checked) {
        delete monthData[source];
      } else {
        monthData[source] = monthData[source] || 0;
      }
      return { ...prev, [month]: monthData };
    });
  };

  // Handle amount input change
  const handleAmountChange = (month, source, value) => {
    const amount = parseFloat(value);
    setMonthlyIncomes(prev => {
      const monthData = { ...(prev[month] || {}) };
      if (!isNaN(amount) && amount > 0) {
        monthData[source] = amount;
      } else {
        delete monthData[source];
      }
      return { ...prev, [month]: monthData };
    });
  };

  // Calculate total income for a month
  const getMonthTotal = (month) => {
    if (!monthlyIncomes[month]) return 0;
    return Object.values(monthlyIncomes[month]).reduce((sum, val) => sum + parseFloat(val || 0), 0);
  };

  // Handle Finish button click
  const handleFinish = () => {
    localStorage.setItem('monthlyIncomes', JSON.stringify(monthlyIncomes));
    alert('Income data saved successfully!');
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Income and Transactions</h1>

      <div id="incomeTrackingContainer">
        {months.map(month => (
          <div key={month} className="mb-6 p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">{month}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomeSources.map(source => {
                const checked = monthlyIncomes[month]?.hasOwnProperty(source) ?? false;
                const amount = monthlyIncomes[month]?.[source] ?? 0;
                return (
                  <div key={source} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`${month}_${source}`}
                      className="mr-2"
                      checked={checked}
                      onChange={e => handleCheckboxChange(month, source, e.target.checked)}
                    />
                    <label htmlFor={`${month}_${source}`} className="mr-4">{source}</label>
                    {checked && (
                      <input
                        type="number"
                        placeholder="Amount"
                        className="p-2 border rounded"
                        step="0.01"
                        value={amount}
                        onChange={e => handleAmountChange(month, source, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <strong>Total for {month}:</strong> <span>${getMonthTotal(month).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleFinish}
        className="bg-green-500 text-white px-4 py-2 rounded mt-6"
      >
        Finish
      </button>

      <div className="mt-10">
        <canvas id="incomeChart" ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default DashboardIncome;