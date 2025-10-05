document.addEventListener('DOMContentLoaded', function() {

    

    // 1. User Growth Bar Chart
    const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
    
    // Custom colors from the image
    const barColor = '#0e4ad5ff'; 
    const barHoverColor = '#0b3bb5ff'; 

    const userGrowthChart = new Chart(userGrowthCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'User growth',
                data: [4000, 8000, 10000, 6000, 2500, 7500, 8500, 6500, 9000, 4500, 7000, 3000],
                backgroundColor: barColor,
                hoverBackgroundColor: barHoverColor,
                borderRadius: 5, // Rounded corners for bars
                borderSkipped: false, // Apply border radius to all corners
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide the dataset legend as it's at the bottom of the card
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: function(context) {
                            // Only show the 0 line
                            return context.tick.value === 0 ? '#e0e0e0' : 'rgba(0, 0, 0, 0)';
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString(); // Add commas to numbers
                        }
                    }
                },
                x: {
                    grid: {
                        display: false // Hide vertical grid lines
                    },
                    barPercentage: 0.8, // Adjust bar width
                    categoryPercentage: 0.9
                }
            }
        }
    });

    // 2. Payments Doughnut Chart
    const paymentsCtx = document.getElementById('paymentsChart').getContext('2d');

    const paymentsChart = new Chart(paymentsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Wallet', 'Broker', 'Crypto'],
            datasets: [{
                data: [20, 28, 52], // Percentages from the image
                backgroundColor: [
                    '#0a48d8ff', // Blue (Wallet)
                    '#0c6aa4ff', // Lighter Blue (Broker)
                    '#bd1b0fff'  // Red/Coral (Crypto)
                ],
                hoverOffset: 10,
                borderWidth: 0, // Remove borders
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%', // Controls the thickness of the doughnut
            plugins: {
                legend: {
                    display: false // Hide the default legend
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
});