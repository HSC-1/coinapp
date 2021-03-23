// google.charts.load('current', {'packages':['line','controls']});
google.charts.load('current', {'packages':['annotationchart']});
// Set a callback to run when the Google Visualization API is loaded.
// google.charts.setOnLoadCallback(table);
google.charts.setOnLoadCallback(anotation);

$(document).ready(function(){
  $('#search-button').on('click',function(){
    // drawChart();
    anotation();
    // table();
  });
});

function drawChart() {
// const query = d3.select('#search_query').property("value");
// 'https://coinsapps.herokuapp.com/api/search/KRW-BTC'
  var url = "https://coinsapps.herokuapp.com/api/search/";
  var updated_url = $('#coin-search-input').val();  
  console.log(url +document.getElementById("coin-search-input"))
  var jsonData = $.ajax({
      url: url + updated_url,
      dataType: "json",
      async: false
      }).responseJSON;
  // Create our data table out of JSON data loaded from server.
  var data = new google.visualization.DataTable();
      // data.addColumn('string','day')
      data.addColumn('datetime','day')
      data.addColumn('number','coin')
      var test = JSON.parse(jsonData)
      console.log(JSON.parse(jsonData))
      // console.log(jsonData.close)
      
      for (var key in test.close){data.addRow([new Date(key), parseFloat(test.close[key])])}
      console.log(test.close)
      
    var dashboard = new google.visualization.Dashboard(document.getElementById('dash_div'));  
  // Instantiate and draw our chart, passing in some options.
  // var chart = new google.charts.Line(document.getElementById('chart_div'));
  var chart = new google.visualization.ChartWrapper({chartType : 'LineChart',containerId:'chart_div'})
  var slider = new google.visualization.ControlWrapper({
  controlType: 'ChartRangeFilter',
  containerId:'filter_div',
  options:{'filterColumnIndex': 0,
   ui:{chartOptions:{height:100,width:400,chartArea:{width:'80%'}}}
  }});
  // chart.draw(data, {width: 400, height: 240});
  dashboard.bind(slider,chart);
  dashboard.draw(data);
  // console.log(jsonData)
  console.log(slider)
}



function anotation(){
  var url = "https://coinsapps.herokuapp.com/api/search/";
  var updated_url = $('#coin-search-input').val().toUpperCase();  
  console.log(url +document.getElementById("coin-search-input"))
  var jsonData = $.ajax({
      url: url + updated_url,
      dataType: "json",
      async: false
      }).responseJSON;
  // Create our data table out of JSON data loaded from server.
  var data = new google.visualization.DataTable();
      // data.addColumn('string','day')
      data.addColumn('datetime','day')
      data.addColumn('number','coin')
      var test = JSON.parse(jsonData)
      console.log(JSON.parse(jsonData))
      // console.log(jsonData.close)
      
      for (var key in test.close){data.addRow([new Date(key), parseFloat(test.close[key])])}
      
      
  var chart = new google.visualization.AnnotationChart(document.getElementById('chart_div'))
  var options= {
    displayAnnotations : true
  };
  chart.draw(data,options);
}
// function table(){
// var url = "https://coinsapps.herokuapp.com/api/search/predict/";
// var plus = $('#coin-search-input').val();
// var jsondata =  $.ajax({
//   url: url + plus,
//   dataType: "json",
//   async: false
//   }).responseJSON
// var test = JSON.parse(jsondata)
// data = new google.visualization.DataTable();
// data.addColumn('datetime','day')
// data.addColumn('number','coin')
// // console.log(test.prediction_low)
// // console.log(test.prediction)
// // console.log(test.prediction_high)
// document.getElementById('test').innerHTML = Date();
// for (var key in test.prediction_low){
//   data.addRow([new Date(key),parseFloat(test.prediction_low[key]),parseFloat(test.prediction[key]),
//   parseFloat(test.prediction[key]),parseFloat(test.prediction_high[key])])
// }
// var options = {legend:'none'}
// var chart = new google.visualization.CandlestickChart(document.getElementById('test'))
// chart.draw(data,options);
// }