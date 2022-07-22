function drawBarChart(data, options, element) {
  let barChart = $('<div class="bar-chart"></div>');
  for (let i = 0; i < data.length; i++) {
    barChart.append('<div class="bar"></div>');
  }
  element.append(barChart);
}
