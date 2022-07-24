function main() {
  let data = [100, 2, 3, 4];
  let options = {};
  let demo = $("#demo");
  drawBarChart(data, options, demo);
}

function drawBarChart(data, options, element) {
  let barChart = $('<div class="bar-chart"></div>');
  makeBars(data, options, barChart);
  element.append(barChart);
}

function makeBars(data, options, barChart){
  let bars = [];
  let bar;
  for (let i = 0; i < data.length; i++) {
    bar = $('<div class="bar"></div>');
    bar.height(data[i]);
    bars.push(bar);
  }
  for (bar of bars) {
    barChart.append(bar);
  }
}
