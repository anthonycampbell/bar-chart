function makeBars(data, options, barChart){
  let bars = [];
  let bar;
  let maxHeight = 0;
  for (let i = 0; i < data.length; i++) {
    bar = $('<span class="bar"></span>');
    bars.push({element: bar, height: data[i]});
    if (data[i] > maxHeight){
      maxHeight = data[i];
    }
  }
  for (bar of bars) {
    bar.element.text(bar.height)
    bar.element.height((bar.height/maxHeight)*250);
    barChart.append(bar.element);
  }
}
function drawBarChart(data, options, element) {
  let barChart = $('<div class="bar-chart"></div>');
  makeBars(data, options, barChart);
  element.append(barChart);
}
function main() {
  let data = [100, 250,500, 100,400,400,400,500,600,400,500,600,400];
  let options = {};
  let demo = $("#demo");
  drawBarChart(data, options, demo);
  data = [3, 6, 8, 1, 9];
  options = {};
  demo = $("#demo1");
  drawBarChart(data, options, demo);
}
