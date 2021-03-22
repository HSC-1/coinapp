google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(table);
$(document).ready(function(){
  $('#search-button').on('click',function(){
    // drawChart();
    // anotation();
    table();
  });
});
function table(){
  var url = "https://coinsapps.herokuapp.com/api/search/predict/";
  var plus = $('#coin-search-input').val();
  var jsondata =  $.ajax({
    url: url + plus,
    dataType: "json",
    async: false
    }).responseJSON
  var test = JSON.parse(jsondata)
  data = new google.visualization.DataTable();
  data.addColumn('datetime','day')
  data.addColumn('number','coin_low')
  data.addColumn('number','coin_prediction')
  data.addColumn('number','coin_prediction')
  data.addColumn('number','coin_high')
  // console.log(test.prediction_low)
  // console.log(test.prediction)
  // console.log(test.prediction_high)
  document.getElementById('test').innerHTML = Date();
  for (var key in test.prediction_low){console.log(test.prediction_low[key])
    data.addRow([new Date(key),parseFloat(test.prediction_low[key]),(parseFloat(test.prediction_low[key])+parseFloat(test.prediction[key]))/2
    ,(parseFloat(test.prediction[key])+parseFloat(test.prediction_high[key]))/2,
    parseFloat(test.prediction_high[key])])
  }
  var options = {
    legend: 'none',
    bar: { groupWidth: '100%' }, // Remove space between bars.
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: '#0531a8' }, // red
      risingColor: { strokeWidth: 0, fill: '#a80505' }   // green
    }
  };
  var chart = new google.visualization.CandlestickChart(document.getElementById('test'))
  chart.draw(data,options);
  }