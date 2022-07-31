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
const applyBarOptions = function(bars, labels, opts) {
  let op;
  let err;
  for (let o in opts) {
    switch (o) {
    case 'valuePosition':
      op = opts[o].toLowerCase();
      err = 'Invalid input. Option valuePosition mus be one of top, bottom, or centre';
      if (op === 'top') setCSS(bars, 'align-items', 'flex-start');
      if (op === 'centre') setCSS(bars, 'align-items', 'center');
      if (op === 'bottom') setCSS(bars, 'align-items', 'flex-end');
      if (op !== 'top' && op !== 'centre' && op !== 'bottom') console.log(err);
      break;
    case 'barSpacing':
      if (typeof opts[o] === 'number') {
        setCSS(bars, 'margin-left', opts[o] / 2);
        setCSS(bars, 'margin-right', opts[o] / 2);
      }
      break;
    case 'barColour':
      if (validateColor(opts[o])) setCSS(bars, 'background-color', opts[o]);
      break;
    case 'barWidth':
      if (typeof opts[o] === 'number') {
        setCSS(bars, 'padding-left', opts[o] / 2);
        setCSS(bars, 'padding-right', opts[o] / 2);
      }
      break;
    case 'labelColor':
      setCSS(labels, 'background-color', opts[o]);
      break;
    }
  }
};
const validData = function(elements) {
  let bar = {};
  let chunks = [];
  let chunkObj = {};
  let err = 'data must include array of number, array of objects ' +
  'with height and string or array of objects with ' +
  'array of objects with height and color and then a label';
  if (typeof elements === 'object' && !Array.isArray(elements)){
    for (let e in elements){
      if (e === 'height' && Array.isArray(elements[e])){
        for (let chunk of elements[e]){
          if (typeof chunk === 'object'){
            for (chunkData in chunk){
              if (chunkData === 'chunkH' && !isNaN(chunk[chunkData])){
                chunkObj['chunkH'] = chunk[chunkData];
              } else if (chunkData === 'color' && validateColor(chunk[chunkData])){
                chunkObj['color'] = chunk[chunkData];
              }
            }
            chunks.push(chunkObj);
            chunkObj = {};
          }
        }
        bar['height'] = chunks;
      } else if (e === 'height' && typeof elements[e] === 'number' && !isNaN(elements[e])){
        bar['height'] = [elements[e]];
      } else if (e === 'label' && typeof elements[e] === 'string'){
        bar['label'] = elements[e];
      }
    }
    return bar;
  } else if (typeof elements === 'number' && !isNaN(elements)) {
    return {height: elements, label: ''};
  } else {
    console.log(err);
    return {height: 0, label: ''};
  }
};
const makeBars = function(data, options, chart) {
  let bars = [];
  let bar;
  let labels = [];
  let label;
  let maxHeight = 0;
  let d;
  let columns = [];
  let chunks = [];
  let barWindow = $('<div class="bar-window"></div>');
  for (let i in data/*= 0; i < data.length; i++*/) {
    d = validData(data[i]);
    let mh = 0;
    for (let chunk of d.height){
      bar = $('<span class="bar"></span>');
      bars.push({ element: bar, height: chunk.chunkH, color: chunk.color });
      mh += chunk.chunkH;
    }
    chunks.push(bars);
    bars = [];
    label = $(`<span class="label">${d.label}</span>`);
    columns.push($(`<span class="column"></span>`));
    labels.push({element: label, label: d.label});
    if (mh > maxHeight) maxHeight = mh;
  }
  //applyBarOptions(bars, labels, options);
  for (let i = 0; i < columns.length; i++) {
    for (let j = 0; j < chunks[i].length; j++){
      chunks[i][j].element.text(chunks[i][j].height);
      chunks[i][j].element.height((chunks[i][j].height / maxHeight) * 250);
      chunks[i][j].element.css('background-color', chunks[i][j].color);
      columns[i].append(chunks[i][j].element);
    }
    //bars[i].element.text(bars[i].height);
    //bars[i].element.height((bars[i].height / maxHeight) * 250);
    // columns[i].append(chunks[i].element);
    columns[i].append(labels[i].element);
    barWindow.append(columns[i]);
  }
  chart.append(barWindow);
  return maxHeight;
};
const checkTickUnits = function(maxHeight, options) {
  if (!options.tickUnits) {
    options.tickUnits = maxHeight / 10;
  }
  if (typeof options.tickUnits !== 'number') {
    options.tickUnits = maxHeight / 10;
    console.log('Tick units must be a number');
  }
  if (maxHeight / options.tickUnits > 250) {
    options.tickUnits = maxHeight / 10;
    console.log('That is too many ticks!');
  }
  if (options.tickUnits > maxHeight) {
    options.tickUnits = maxHeight / 10;
    console.log('Tick units too tall');
  }
};
const makeTicks = function(maxHeight, chart, options) {
  let ticks = $('<div class="ticks"></div>');
  checkTickUnits(maxHeight, options);
  let divOffset = 1;
  for (let i = options.tickUnits; i <= maxHeight; i += options.tickUnits) {
    let tick = $('<div class="tick"></div>');
    let h = 250 - i / maxHeight * 250 - divOffset;
    tick.css('top', h);
    ticks.append(tick);
    divOffset++;
  }
  chart.prepend(ticks);
};
const makeTitle = function(chart, options) {
  let title = $(`<h4 class="title">${options.title || 'Bar Chart'}</h4>`);
  let fontSize = options.titleFontSize || 16;
  let tColor;
  let validColor = validateColor(options.titleColor);
  validColor ? tColor = options.titleColor : tColor = 'black';
  title.css('color', tColor);
  title.css('font-size', fontSize);
  chart.append(title);
};
const drawBarChart = function(data, element, options = {}) {
  let container = $('<div class="container"></div>');
  let barChart = $('<div class="bar-chart"></div>');
  let maxHeight = makeBars(data, options, barChart);
  console.log(maxHeight);
  makeTicks(maxHeight, barChart, options);
  makeTitle(container, options);
  container.append(barChart);
  element.append(container);
};
const main = function() {
  let data = [9, 1, 6, 3, 5];
  let data0 = [{ height: 100, label: 'apples' },
    { height: 250, label: 'oranges' },
    { height: 500, label: 'grapes' },
    { height: 100, label: 'pears' },
    { height: 400, label: 'mangos' }];
  let data1 = [
    { height: [
      { chunkH: 100, color: 'rgb(150, 150, 0)' },
      { chunkH: 100, color: 'rgb(0, 150, 150)' },
      { chunkH: 100, color: 'rgb(150, 0, 150)' } ],
    label: 'snacks'
    },
    { height: [
      { chunkH: 250, color: 'rgb(150, 150, 0)' },
      { chunkH: 250, color: 'rgb(0, 150, 150)' },
      { chunkH: 250, color: 'rgb(150, 0, 150)' } ],
      label: 'fruits'
    },
    { height: [
      { chunkH: 500, color: 'rgb(150, 150, 0)' },
      { chunkH: 500, color: 'rgb(0, 150, 150)' },
      { chunkH: 500, color: 'rgb(150, 0, 150)' } ],
      label: 'vegetables'
    },
    { height: [
      { chunkH: 100, color: 'rgb(150, 150, 0)' },
      { chunkH: 100, color: 'rgb(0, 150, 150)' },
      { chunkH: 100, color: 'rgb(150, 0, 150)' } ],
      label: 'meats'
    },
    { height: [
      { chunkH: 400, color: 'rgb(150, 150, 0)' },
      { chunkH: 400, color: 'rgb(0, 150, 150)' },
      { chunkH: 400, color: 'rgb(150, 0, 150)' } ],
    label: 'dairy'
    }];
  let options = {
    valuePosition: 'top',
    barColour: 'rgb(0, 150, 0)',
    barSpacing: 100,
    barWidth: 50,
    title: 'My Bar Chart',
    titleFontSize: 32,
    titleColor: 'rgb(0, 150, 150)',
    tickUnits: 20,
    labelColor: 'blue',
  };
  let demo = $("#demo");
  drawBarChart(data1, demo, options);
};

// ================================== TODO ============================
// refactor
