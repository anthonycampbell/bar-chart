const validateColor = function(c) {
  let s = new Option().style;
  s.color = c;
  return s.color === c;
};
const setCSS = function(bars, property, value) {
  if (property === 'background-color') {
    if (!validateColor(value)) return;
  }
  for (let i = 0; i < bars.length; i++) {
    bars[i].element.css(property, value);
  }
};
const applyBarOptions = function(bars, options) {
  for (let o in options) {
    switch (o) {
    case 'valuePosition':
      if (options[o].toLowerCase() === 'top') {
        setCSS(bars, 'align-items', 'flex-start');
      } else if (options[o].toLowerCase() === 'centre') {
        setCSS(bars, 'align-items', 'center');
      } else if (options[o].toLowerCase() === 'bottom') {
        setCSS(bars, 'align-items', 'flex-end');
      } else {
        console.log('Invalid input. Option valuePosition mus be one of top, bottom, or centre');
      }
      break;
    case 'barSpacing':
      if (typeof options[o] === 'number') {
        setCSS(bars, 'margin-left', options[o] / 2);
        setCSS(bars, 'margin-right', options[o] / 2);
      }
      break;
    case 'barColour':
      setCSS(bars, 'background-color', options[o]);
      break;
    /*case 'barWidth':
      if (typeof options[o] === 'number'){
        setCSS(bars, 'padding-left', options[o]/2);
        setCSS(bars, 'padding-right', options[o]/2);
      }
      break;*/
    }
  }
};
const makeBars = function(data, options, chart) {
  let bars = [];
  let bar;
  let maxHeight = 0;
  let barWindow = $('<div class="bar-window"></div>');
  for (let i = 0; i < data.length; i++) {
    bar = $('<span class="bar"></span>');
    bars.push({ element: bar, height: data[i] });
    if (data[i] > maxHeight) {
      maxHeight = data[i];
    }
  }
  applyBarOptions(bars, options);
  for (bar of bars) {
    bar.element.text(bar.height);
    bar.element.height((bar.height / maxHeight) * 250);
    barWindow.append(bar.element);
  }
  chart.append(barWindow);
  return maxHeight;
};
const makeTicks = function(maxHeight, chart, options) {
  let ticks = $('<div class="ticks"></div>');
  if (!options.tickUnits) options.tickUnits = maxHeight / 10;
  if (typeof options.tickUnits === 'number') {
    if (options.tickUnits < maxHeight) {
      if (maxHeight / options.tickUnits > 250) {
        options.tickUnits = maxHeight / 10;
        console.log('That is too many ticks!');
      }
      let divOffset = 1;
      for (let i = options.tickUnits; i <= maxHeight; i += options.tickUnits) {
        let tick = $('<div class="tick"></div>');
        let h = 250 - i / maxHeight * 250 - divOffset;
        tick.css('top', h);
        ticks.append(tick);
        divOffset++;
      }
    }
  }
  chart.prepend(ticks);
};
const makeLabels = function(data, chart, options) {
  let label;
  let labels = $('<div class="labels"></div>');
  for (let i = 0; i < data.length; i++) {
    label = $('<span class="label"></span>');
    labels.append(label);
  }
  chart.append(labels);
};
const drawBarChart = function(data, element, options = {}) {
  let barChart = $('<div class="bar-chart"></div>');
  let labels = $('<div class="labels"></div>');
  let maxHeight = makeBars(data, options, barChart);
  makeTicks(maxHeight, barChart, options);
  makeLabels(data, barChart, options);
  element.append(barChart);
}

const editTitle = function() {
  return false;
};
const main = function() {
  // let data = [{ height: 100, label: 'apples' },
  // { height: 250, label: 'oranges' },
  // { height: 500, label: 'grapes' },
  // { height: 100, label: 'pears' },
  // { height: 400, label: 'mangos' }];
  let data = [100, 250, 500, 100, 400];
  let options = {
    valuePosition: 'top',
    //barSpacing: 100,
    tickUnits: 20,
    barColour: 'rgb(0, 150, 0)'
  };
  let demo = $("#demo");
  drawBarChart(data, demo, options);
};
