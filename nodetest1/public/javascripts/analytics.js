function generateChart(data){
//Get the data from node js 

var parsedData = JSON.parse(data);

//Data coming from DB
var X = parsedData["args"][1] ;
var Y = parsedData["args"][0] ;
var days = parsedData["args"][2];
var scatterData_1 = parsedData["args"][3];
var scatterData_2 = parsedData["args"][4];
var scatterData_3 = parsedData["args"][5];

// Bar chart 1 Visualization - Starts here
//Data for Bar chart - Plot 1
var data1 = [];
X.forEach((value, i) => {
  data1.push({"group": value, "value": Y[i]})
});

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
   width = 460 - margin.left - margin.right,
   height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz1")
 .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
 .append("g")
   .attr("transform",
         "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
 .range([ 0, width ])
 .padding(0.2);
var xAxis = svg.append("g")
 .attr("transform", "translate(0," + height + ")")
 .attr("class", "axis-line")

// Initialize the Y axis
var y = d3.scaleLinear()
 .range([ height, 0]);
var yAxis = svg.append("g")
 .attr("class", "myYaxis")
 .attr("class", "axis-line")


// A function that create / update the plot for a given variable:
function update(data) {

 // Update the X axis
 x.domain(data.map(function(d) { return d.group; }))
 xAxis.call(d3.axisBottom(x))

 // Update the Y axis
 y.domain([0, d3.max(data, function(d) { return d.value }) ]);
 yAxis.transition().duration(1000).call(d3.axisLeft(y));

 // Create the u variable
 var u = svg.selectAll("rect")
   .data(data)

 u
   .enter()
   .append("rect") // Add a new rect for each new elements
   .merge(u) // get the already existing elements as well
   .transition() // and apply changes to all of them
   .duration(1000)
     .attr("x", function(d) { return x(d.group); })
     .attr("y", function(d) { return y(d.value); })
     .attr("width", x.bandwidth())
     .attr("height", function(d) { return height - y(d.value); })
     .attr("fill", "#69b3a2")

 // If less group in the new dataset, I delete the ones not in use anymore
 u
   .exit()
   .remove()
}

// Initialize the plot with the first dataset
update(data1)

//Bar Chart Visualization 1 - Ends here


//Horizontal Bar Chart Visualization 2 - Starts here

//Data for Horizontal Bar chart - Plot 2
//Donut Plots - Visualization starts here

// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#my_dataviz3")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
var data = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}

// set the color scale
var color = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
  .range(d3.schemeDark2);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

// The arc generator
var arc = d3.arc()
  .innerRadius(radius * 0.5)         // This is the size of the donut hole
  .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('allSlices')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "white")
  .style("stroke-width", "5px")
  .style("opacity", 0.7)

// Add the polylines between chart and labels:
svg
  .selectAll('allPolylines')
  .data(data_ready)
  .enter()
  .append('polyline')
    .attr("stroke", "gray")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg
  .selectAll('allLabels')
  .data(data_ready)
  .enter()
  .append('text')
    .text( function(d) { return d.data.key } )
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .attr('class', 'axis-line')
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })

//Donut Plots - Visualization ends here

//Horizontal Bar Chart Visualization 2 -Ends here



//Scatter Plot Visualization 3 - Starts here

//Data for scatter plot

var data3 = [];
days.forEach((value, i) => {
  data3.push({"time": value, "valueA": scatterData_1[i], "valueB":scatterData_2[i], "valueC":scatterData_3})
});

// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 500 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = ["valueA", "valueB", "valueC"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([0,10])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis-line")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,20])
      .range([ height, 0 ]);
    svg.append("g")
    .attr("class", "axis-line")
      .call(d3.axisLeft(y));

    // Initialize line with group a
    var line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.time) })
          .y(function(d) { return y(+d.valueA) })
        )
        .attr("stroke", "gray")
        .style("stroke-width", 2)
        .style("fill", "none")

    // Initialize dots with group a
    var dot = svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
        .attr("cx", function(d) { return x(+d.time) })
        .attr("cy", function(d) { return y(+d.valueA) })
        .attr("r", 7)
        .style("fill", "#69b3a2")


    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {time: d.time, value:d[selectedGroup]} })

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d.time) })
            .y(function(d) { return y(+d.value) })
          )
      dot
        .data(dataFilter)
        .transition()
        .duration(1000)
          .attr("cx", function(d) { return x(+d.time) })
          .attr("cy", function(d) { return y(+d.value) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})
}

// function generatePieChart(){

  
// }

