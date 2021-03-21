google.charts.load('current', {'packages':['line','controls']});
      
// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);
// google.charts.setOnLoadCallback(drawDashboard);
// $("#search-button").click(function (){drawChart();});
//   // var url = "https://coinsapps.herokuapp.com/api/search/";
//   // var updated_url = $('#coin-search-input').val();  
//   // console.log(url +document.getElementById("coin-search-input"))
//   // var jsonData = $.ajax({
//   //     url: url + updated_url,
//   //     dataType: "json",
//   //     async: false
//   //     }).responseJSON;

//   // // Create our data table out of JSON data loaded from server.
//   // var data = new google.visualization.DataTable();
//   //     // data.addColumn('string','day')
//   //     data.addColumn('datetime','day')
//   //     data.addColumn('number','coin')
//   //     var test = JSON.parse(jsonData)
//   //     console.log(JSON.parse(jsonData))
//   //     // console.log(jsonData.close)
      
//   //     for (var key in test.close){data.addRow([new Date(key), parseFloat(test.close[key])])}
//   //     console.log(test.close)
      
//   //   var dashboard = new google.visualization.Dashboard(document.getElementById('dash_div'));  
//   // // Instantiate and draw our chart, passing in some options.
//   // // var chart = new google.charts.Line(document.getElementById('chart_div'));
//   // var chart = new google.visualization.ChartWrapper({chartType : 'LineChart',containerId:'chart_div'})
//   // var slider = new google.visualization.ControlWrapper({controlType: 'ChartRangeFilter',containerId:'filter_div',options:{'filterColumnIndex': 0}});
//   // // chart.draw(data, {width: 400, height: 240});
//   // dashboard.bind(slider,chart);
//   // dashboard.draw(data);
//   // // console.log(jsonData)
//   // console.log(slider)
//   // $.ajax({
//   //   url: api + coin,
//   //   success: function(r) {
    
//   //     var thisCoin = r[0];
//   //     console.log(r);
//   //     $(".coin-viewer").htmlcoint Price (USD): " +
//   //         thisCoin.price_usd + "</h2>"
//   //     );
//   //   },
//   //   error: function() {
//   //     $(".coin-viewer").html("<h2>An error occured.</h2><h4> Is the name of the coin spelled correctly?</h4>")
//   //   }
//   // }

//   // )
// })
$(document).ready(function(){
  $('#search-button').on('click',function(){
    drawChart();
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
  var slider = new google.visualization.ControlWrapper({controlType: 'ChartRangeFilter',containerId:'filter_div',options:{'filterColumnIndex': 0}});
  // chart.draw(data, {width: 400, height: 240});
  dashboard.bind(slider,chart);
  dashboard.draw(data);
  // console.log(jsonData)
  console.log(slider)
}

// function handleClickSearch() {

//   const query = d3.select('#search_query').property("value");

//   if (query) {
//       console.log(query);
//       document.getElementById("search_query").placeholder=query;

//       var url = "https://coinsapps.herokuapp.com/api/search/";
//       var updated_url = url + query;

//       fetch(updated_url)
//         .then(function (response) {
//           return response.json();
//         })
//         .then(function (data) {

//               recipeData = data;
//               buildTable(recipeData);
//               var num_query_results = recipeData.length;

//               document.getElementById("search_num").innerHTML = "Your query returned " + num_query_results + " results.";
//         })

//         .catch(function (err) {
//           console.log(err);
//         });
//   }
// }
