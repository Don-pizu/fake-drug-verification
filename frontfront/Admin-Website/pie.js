const ctx = document.getElementById('myDoughnut').getContext('2d');

new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Lagos', 'Abuja', '245', 'Kano', 'Oshogbo', 'Others'],
        datasets: [{
            data: [70, 24, 21, 18, 15, 11],
            backgroundColor: [
                '#00C503', '#4DFA72', '#006304',
                '#F44336', '#B24C00', '#666666'
            ],
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        cutout: '70%'
    }
});