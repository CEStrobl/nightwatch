// Main Chart
const ctxMain = document.getElementById('mainChart').getContext('2d');
const mainChart = new Chart(ctxMain, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'MAU',
        data: [1600, 1400, 1700, 1500, 1800, 1600, 1700, 1500, 1400, 1700, 1800, 1600],
        borderColor: '#f7a8ff',
        backgroundColor: 'rgba(247, 168, 255, 0.2)',
        fill: true,
      },
      {
        label: 'GME',
        data: [1300, 1200, 1400, 1300, 1500, 1400, 1600, 1400, 1300, 1500, 1600, 1500],
        borderColor: '#8877ff',
        backgroundColor: 'rgba(136, 119, 255, 0.2)',
        fill: true,
      }
    ]
  },
});

// Additional small charts
const createSmallChart = (id, data) => {
  const ctx = document.getElementById(id).getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Weekly Stats',
        data: data,
        borderColor: '#f7a8ff',
        backgroundColor: 'rgba(247, 168, 255, 0.2)',
        fill: true,
      }]
    }
  });
};

createSmallChart('chart1', [43, 45, 48, 50, 42, 40, 44]);
createSmallChart('chart2', [400, 405, 410, 395, 390, 403, 404]);
createSmallChart('chart3', [290, 300, 295, 305, 290, 285, 295]);
createSmallChart('chart4', [72, 74, 73, 72, 71, 73, 74]);
