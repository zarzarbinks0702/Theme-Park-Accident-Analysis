function createMap() {
  //get the data for the map from the flask app
  d3.json('/USmap').then((data) => {
    //used anychart docs for this section
    anychart.onDocumentReady(function () {
      var map = anychart.map();
      var accData = anychart.data.set(data);

      var series = map.choropleth(accData);
      series.geoIdField('id');

      //set colors
      ordinalScale = anychart.scales.ordinalColor([
          {less: 20},
          {from: 20, to: 50},
          {from: 50, to: 250},
          {from: 250, to: 1000},
          {greater:1000}
      ]);
      ordinalScale.colors(['#daf8e3','#97ebdb', '#00c2c7', '#0086ad', '#005582']);

      series.colorScale(ordinalScale);
      //get us map background
      map.geoData(anychart.maps['united_states_of_america']);
      map.container('map');

      //enable the tooltips and format them at once (still in anychart)
      series.tooltip().format(function(e){
         return "Number of Accidents: " +"\n"+
          e.getData("value")
      });
      //create legend
      map.legend(true);
      map.legend().itemsSourceMode('categories');
      //draw map
      map.draw();
      return map;
    });
  });
}
//put map on page
createMap();

function createScatter() {
  d3.json("/scatter").then((data) => {
    var ages = [];
    var injuries = [];

    for (const entry of data) {
        if(entry.age_youngest <1 || entry.age_youngest >100) continue;
        ages.push(entry.age_youngest);
        injuries.push(entry.numInjured);
    }

    var trace1 = {
      type: "scatter",
      mode: "markers",
      name: "Injuries vs Age Category",
      x: ages,
      y: injuries,
      line: {
        color: "#17BECF",
      },
    };

    var data1 = [trace1];
    var minAge = 1;
    var maxAge = 100;

    var layout = {
      xaxis: {
        range: [minAge, maxAge],
        type: "number",
        title: 'Age'
      },
      yaxis: {
        autorange: true,
        type: "linear",
        title: 'Number of Injuries'
      },
    };

    Plotly.newPlot("scatter", data1, layout);

  });
}
//put scatter on page
createScatter();

function createBar() {
  d3.json("/bar").then((data) => {
    
    var gender = [];
    var injuries = [];
    for (const entry of data) {
      let g
      if(entry.gender=='F') g='Female'
      if(entry.gender=='M') g='Male'
      if(entry.gender=='U') g='Unknown'
        gender.push(g);
        injuries.push(entry.numInjured);
    }
  var trace1 = {
    x: gender,
    y: injuries,
    name: 'Accidents by Gender',
    type: 'bar'
  };
  var data1 = [trace1];
  Plotly.newPlot('bar', data1);
    });
}
//put bar chart on page
createBar();

function createPie() {

  var data = [{
    values: [3530, 2748, 1988, 1767, 1477, 1163, 1025, 465, 403, 318],

    labels: ["Water Slide", "Coaster", "Spinning", "Go-Kart", "Other Attraction", "Water Ride", "Cars & Track Rides ", "Aquatic Play",
    "Play Equipment", "Pendulum"],

    type: 'pie',
    marker: {
      colors: ['#caf1ff', '#a2e6ff', '#7bdbff', '#54d1ff', '#2dc6ff', '#05bcff', '#22bdf6', '#34b5e4', '#45add3', '#57a4c1']
    },
  }];

  var layout = {
    height: 400,
    width: 500
  };

  Plotly.newPlot('PieChart', data, layout);
  }
//put pie chart on page
createPie();

function createTable() {
  d3.json('/table').then((data) => {
    var tableData = data;
    //table body
    var tableBody = d3.select('#table');
    //the filter button
    var filterBtn = d3.select('#filter-button');
    //the reset button
    var resetBtn = d3.select('#reset-button');
    //the form
    var form = d3.select('#form');

    //populate the table
    const tableMaker = (data) => {
      data.forEach((accs) => {
        var row = tableBody.append('tr');
        var city = row.append('td').text(accs.acc_city);
        var date = row.append('td').text(accs.acc_date);
        var accsDesc = row.append('td').text(accs.acc_desc);
        var state = row.append('td').text(accs.acc_state);
        var youngInjured = row.append('td').text(accs.age_youngest);
        var busType = row.append('td').text(accs.bus_type);
        var injCat = row.append('td').text(accs.category);
        var devCat = row.append('td').text(accs.device_category);
        var devType = row.append('td').text(accs.device_type);
        var gender = row.append('td').text(accs.gender);
        var indusSect = row.append('td').text(accs.industry_sector);
        var injDesc = row.append('td').text(accs.injury_desc);
        var manufacturer = row.append('td').text(accs.manufacturer);
        var numInj = row.append('td').text(accs.num_injured);
        var tradename = row.append('td').text(accs.tradename_or_generic);
      })
    };

    tableMaker(tableData);
    });
}
//put table on page
createTable();
