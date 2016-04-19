// SVG drawing area

var margin1 = {top: 50, right: 60, bottom: 60, left: 60};

var width1 = 700 - margin.left - margin.right,
		height1 = 500 - margin.top - margin.bottom;

d3.select("#chart-area-college").attr("align","center");

var svg1 = d3.select("#chart-area-college").append("svg")
		.attr("width", width1 + margin.left + margin.right)
		.attr("height", height1 + margin.top + margin.bottom)
		.attr("fill", "black");

svg1.append("g")
	.attr("transform", "translate(" + (margin.left +20 )+ "," + margin.top + ")");

loadData();
var globaldata;

/* Initialize tooltip */
tip = d3.tip().attr('class', 'd3-tip').html(function(d) 
	{ return "<strong style='color:yellow'>Season:</strong> <span style='color:yellow'>" + d.Season +
		"</span><p><strong style='color:yellow'>Goals:</strong> <span style='color:yellow'>" + d.G; });
tip.offset([-20, -20])

function loadData() {
	d3.csv("curry/data/curry_college.csv", function(error, csv) {

		csv.forEach(function(d){
			d.Season = d.Season	
			d.FGP = +d.FGP;
			d.P2P_P = +d.P2P_P;
			d.P3P_P = +d.P3P_P;

		});
		globaldata = csv;
		console.log(globaldata);
		console.log("length", data.length);
		updateVisualization1()


	});
}


function updateVisualization1(){

	selectValue1 = "FGP";

	var xScale1 = d3.scale.ordinal()
		.domain([globaldata[0].Season, globaldata[1].Season, globaldata[2].Season])
        .rangeRoundBands([0, width1], 0.05);

	var yScale1 = d3.scale.linear()
		.domain([0, 1])
		.range([height1, 0]);


	var xAxis1 = d3.svg.axis()
	        .scale(xScale1)
	        .orient("bottom")
	        .ticks(8);

	var formatPercent = d3.format(".0%");
	// y axis
	var yAxis1 = d3.svg.axis()
	    .scale(yScale1)
	    .orient("left")
	    .tickFormat(formatPercent);;


	// all functions for the			
	var barWidth1 = width1 / globaldata.length;

	console.log(globaldata);

	svg1.selectAll(".bar")
    	.data(globaldata).enter()
    	.append("g")
      	.attr("transform", function(d, i) 
      		{ return "translate(" + (i * barWidth1 + 60) + ",0)"; })
      	.append("rect")
      	.attr("class", "bar")
		.attr("y", function(d) { return yScale1(d.FGP/100); })
        .attr("height", function(d) { return height1 - yScale1(d.FGP/100); })
	    .attr("width", barWidth1 - 20)
	    .attr("fill", "pink")    
	    .append("text")
        .attr("x", barWidth1 / 2 )
        .attr("y", function(d) { return yScale1(d.FGP/100) + 3; })
	    .attr("dy", ".75em")
	    .text(function(d) { return d.FGP/100; });


	    svg1.append("g")
	        .attr("class", "x axis")
	        .style("text-anchor", "end")
	        .attr("transform", "translate(50," + height1 + ")")
	        .call(xAxis1);

	    svg1.append("g")
	        .attr("class", "y axis")
	        .call(yAxis1)
	        .attr("transform", "translate(50,0)")
	        .append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 6)
	        .attr("dy", ".71em")
	        .style("text-anchor", "end")
	        .text("Percentage");


	// ------------- other options
   	 var data2 = [ "FGP", "3PT Percentage", "2PT Percentage"];

   	 var select1 = d3.select("#select-box-college")
		.append('select')
		.attr('class','select')
		.attr('class', 'number2')
	    .on('change', onchange1)

	var options1 = select1
	  .selectAll('option')
		.data(data2).enter()
		.append('option')
		.text(function (d) { return d; });


	function onchange1() {
		selectValue1 = d3.select('.number2').property('value');
		console.log(selectValue1);

		svg1.call(tip);

		if (selectValue1 == "FGP"){
		    max = 1;
		    yScale = d3.scale.linear().domain([0, 1]).range([height, 0]);
		    label = "Field Goal Percentage";

		    tip.html(function(d){ { return "<strong style='color:yellow'>Season:</strong> <span style='color:yellow'>" + d.Season +
			"</span><p><strong style='color:yellow'>Goals:</strong> <span style='color:yellow'>" + d.FGP; }})

		    svg1.selectAll(".bar")
			     .data(globaldata)
			     .transition().duration(750)
				.attr("y", function(d) { return yScale1(d.FGP/100); })
	       	    .attr("height", function(d) { return height1 - yScale1(d.FGP/100); })
			    .attr("width", barWidth1 - 20)
			    .attr("fill", "pink")
			   
			svg1.selectAll("text").data(globaldata)
				.append("text")
				.attr("x", barWidth1 / 2)
		        .attr("y", function(d) { return yScale1(d.FGP/100) + 10; })
		        .attr("dy", ".75em")
			    .text(function(d) { return d.FGP/100; });
		}
		else if (selectValue1 == "3PT Percentage"){
		    max = 1;
			label = "3PT Percentage";
			yScale = d3.scale.linear().domain([0, 1]).range([height, 0]);
			tip.html(function(d){ { return "<strong style='color:yellow'>Season:</strong> <span style='color:yellow'>" + d.Season +
			"</span><p><strong style='color:yellow'>Goals:</strong> <span style='color:yellow'>" + d.P3P_P; }})

		  	svg1.selectAll(".bar")
			     .data(globaldata)
			     .transition().duration(750)
				.attr("y", function(d) { return yScale1(d.P3P_P/100); })
	       	    .attr("height", function(d) { return height1 - yScale1(d.P3P_P/100); })
			    .attr("width", barWidth1 - 20)
			    .attr("fill", "pink")
			   
			svg1.selectAll("text").data(globaldata)
				.append("text")
				.attr("x", barWidth1 / 2)
		        .attr("y", function(d) { return yScale1(d.P3P_P/100) + 10; })
		        .attr("dy", ".75em")
			    .text(function(d) { return d.P3P_P/100; });
		}
		else{
		    max = 1;
		    label = "2PT Percentage";
		    yScale = d3.scale.linear().domain([0, 1]).range([height, 0]);
		    tip.html(function(d){ { return "<strong style='color:yellow'>Season:</strong> <span style='color:yellow'>" + d.Season +
			"</span><p><strong style='color:yellow'>Goals:</strong> <span style='color:yellow'>" + d.P2P_P; }})

		   svg1.selectAll(".bar")
			     .data(globaldata)
			     .transition().duration(750)
				.attr("y", function(d) { return yScale1(d.P2P_P/100); })
	       	    .attr("height", function(d) { return height1 - yScale1(d.P2P_P/100); })
			    .attr("width", barWidth1 - 20)
			    .attr("fill", "pink")
			   
			svg1.selectAll("text").data(globaldata)
				.append("text")
				.attr("x", barWidth1 / 2)
		        .attr("y", function(d) { return yScale1(d.P2P_P/100) + 10; })
		        .attr("dy", ".75em")
			    .text(function(d) { return d.P2P_P/100; });
			}

		svg.call(tip);

	    // y axis
			    yAxis1 = d3.svg.axis()
			        .scale(yScale1)
			        .orient("left");
		     // calling y axis
			   	svg1.select(".y.axis")
			    	.transition()
			    	.duration(1000)
			    	.call(yAxis1);


		}
}