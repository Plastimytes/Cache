// transactionsAndPlanning.js

// State management
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let redZoneThreshold = parseFloat(localStorage.getItem('redZoneThreshold')) || 0; // User-set threshold for spending

// Function to initialize the tracking and planning section
function initTrackingAndPlanning() {
    renderIncomeVsSpendingChart();
    renderBudgetTracking();
    renderSavingsGoals();
    loadRedZoneSetting();
}

// Aggregate monthly income and expenses
function getMonthlyData() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyData = {};
    months.forEach(month => monthlyData[month] = { income: 0, expenses: 0 });

    transactions.forEach(t => {
        const tDate = new Date(t.date);
        const month = months[tDate.getMonth()];
        if (t.type === 'income') {
            monthlyData[month].income += t.amount;
        } else {
            monthlyData[month].expenses += t.amount;
        }
    });

    return monthlyData;
}

// Render line chart for income vs spending with red zone
function renderIncomeVsSpendingChart() {
    const monthlyData = getMonthlyData();
    const months = Object.keys(monthlyData);
    const incomeData = months.map(m => monthlyData[m].income);
    const expenseData = months.map(m => monthlyData[m].expenses);

    const ctx = document.getElementById('incomeVsSpendingChart').getContext('2d');

    if (window.incomeVsSpendingChartInstance) {
        window.incomeVsSpendingChartInstance.destroy();
    }

    window.incomeVsSpendingChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#22c55e', // Green for income
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Spending',
                    data: expenseData,
                    borderColor: '#ef4444', // Red for spending
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Red Zone Threshold',
                    data: Array(months.length).fill(redZoneThreshold), // Horizontal line at threshold
                    borderColor: '#dc2626',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    type: 'line',
                    order: 2 // Above other lines
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        redZone: {
                            type: 'box',
                            yMin: redZoneThreshold,
                            yMax: Math.max(...expenseData),
                            backgroundColor: 'rgba(220, 38, 38, 0.2)',
                            borderColor: '#dc2626',
                            borderWidth: 1
                        }
                    }
                }
            }
        }
    });
}

// Render budget tracking from existing logic
function renderBudgetTracking() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const budgetList = document.getElementById('budgetList');
    if (!budgetList) return;

    budgetList.innerHTML = '';
    budgets.forEach((b, index) => {
        let spent = 0;
        transactions.filter(t => t.type === 'expense' && t.category === b.category).forEach(t => spent += t.amount);
        const progress = (spent / b.amount) * 100;
        const div = document.createElement('div');
        div.innerHTML = `
            <p><strong>${b.category}</strong> - Budget: $${b.amount} | Spent: $${spent.toFixed(2)}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            <button onclick="updateBudget(${index})" class="mt-2 bg-red-500 text-white px-2 py-1 rounded text-sm">Edit</button>
        `;
        budgetList.appendChild(div);
    });
}

// Render savings goals tracking
function renderSavingsGoals() {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const goalList = document.getElementById('goalList');
    if (!goalList) return;

    goalList.innerHTML = '';
    goals.forEach((g, index) => {
        const goalBalance = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const progress = (goalBalance / g.target) * 100;
        const div = document.createElement('div');
        div.innerHTML = `
            <p><strong>${g.name}</strong> - Target: $${g.target} | Saved: $${goalBalance.toFixed(2)}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            <button onclick="updateGoal(${index})" class="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">Edit</button>
        `;
        goalList.appendChild(div);
    });
}

// Load red zone setting
function loadRedZoneSetting() {
    const thresholdInput = document.getElementById('redZoneThreshold');
    if (thresholdInput) {
        thresholdInput.value = redZoneThreshold;
        thresholdInput.addEventListener('input', () => {
            redZoneThreshold = parseFloat(thresholdInput.value) || 0;
            localStorage.setItem('redZoneThreshold', redZoneThreshold);
            renderIncomeVsSpendingChart(); // Update chart
        });
    }
}

// Add budget function (placeholder, as per existing logic)
function updateBudget(index) {
    // Implementation as in original code
    console.log('Edit budget', index);
}

// Add goal function (placeholder)
function updateGoal(index) {
    // Implementation as in original code
    console.log('Edit goal', index);
}

// Initialize when the page is loaded
document.addEventListener('DOMContentLoaded', initTrackingAndPlanning);

// If using modules, export functions
// export { initTrackingAndPlanning };
