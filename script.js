let expenses = [];
let expenseChart;

function addExpense() {
    try {
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;
        const description = document.getElementById('expense-description').value || 'No description';

        if (!amount || isNaN(amount) || !date) {
            throw new Error('Please enter a valid amount and date');
        }

        expenses.push({ amount, category, date, description });
        updateExpenseList();
        updateChart();
        updateTotal();
        clearForm();
    } catch (error) {
        alert(error.message);
    }
}

function updateExpenseList() {
    try {
        const tableBody = document.getElementById('expense-list');
        if (!tableBody) throw new Error('Expense list element not found');
        
        tableBody.innerHTML = '';
        expenses.forEach((expense, index) => {
            let row = `<tr>
                <td>${expense.date}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td><button class="delete-btn" onclick="deleteExpense(${index})">Delete</button></td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error updating expense list:', error);
    }
}

function deleteExpense(index) {
    try {
        if (index < 0 || index >= expenses.length) {
            throw new Error('Invalid expense index');
        }
        expenses.splice(index, 1);
        updateExpenseList();
        updateChart();
        updateTotal();
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
    }
}

function updateChart() {
    try {
        const ctx = document.getElementById('expenseChart')?.getContext('2d');
        if (!ctx) throw new Error('Chart canvas not found');

        const categories = [...new Set(expenses.map(exp => exp.category))];
        const data = categories.map(category => 
            expenses.filter(exp => exp.category === category)
                   .reduce((sum, exp) => sum + exp.amount, 0)
        );

        if (expenseChart) {
            expenseChart.destroy();
        }

        expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Expense Distribution',
                        font: {
                            size: 18
                        },
                        padding: 20
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

function updateTotal() {
    try {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalElement = document.getElementById('total-expense');
        if (!totalElement) throw new Error('Total expense element not found');
        totalElement.textContent = total.toFixed(2);
    } catch (error) {
        console.error('Error updating total:', error);
    }
}

function clearForm() {
    try {
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-date').value = '';
        document.getElementById('expense-description').value = '';
    } catch (error) {
        console.error('Error clearing form:', error);
    }
}

async function getFinancialAdvice() {
    try {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        let advice = `Your total spending is $${total.toFixed(2)}. `;
        
        const categoryTotals = {};
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });
        
        const highestCategory = Object.entries(categoryTotals)
            .reduce((a, b) => a[1] > b[1] ? a : b, ['None', 0])[0];
        
        advice += `You spend the most on ${highestCategory}. Consider reviewing your ${highestCategory} expenses to optimize your budget.`;
        
        const adviceElement = document.getElementById('ai-advice');
        if (!adviceElement) throw new Error('Advice element not found');
        adviceElement.textContent = advice;
    } catch (error) {
        console.error('Error getting financial advice:', error);
        document.getElementById('ai-advice').textContent = 'Error generating financial advice';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        updateChart();
        updateTotal();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});