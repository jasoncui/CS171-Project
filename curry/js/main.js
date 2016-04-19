// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 1000 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area-career").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("fill", "blue");

svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var formatDate = d3.time.format("%Y");
loadData();
var data;
var original;

/* Initialize tooltip */
tip = d3.tip().attr('class', 'd3-tip').html(function(d) 
	{ return "<strong style='color:yellow'>Season:</strong> <span style='color:yellow'>" + d.Season +
		"</span><p><strong style='color:yellow'>Goals:</strong> <span style='color:yellow'>" + d.G; });
tip.offset([-20, -20])

function loadData() {
	d3.csv("curry/data/curry_season_points.csv", function(error, csv) {
		csv.forEach(function(d){	
			d.G = +d.G;
			d.FG_P = +d.FG_P;
			d.FT_P = +d.FT_P;
			d.P2P_P = +d.P2P_P;
			d.P3P_P = +d.P3P_P;
		});
		data = csv;
		console.log(data);
		console.log("length", data.length);
		updateVisualization();
	});
}

function updateVisualization() {
	console.log("data", data);
	 // scale time for x axis
    var x = d3.scale.ordinal()
	    .domain(data.map(function(d) {
        return d.Season;
	    }))
	    .rangeRoundBands([0, width], 0.05);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // min and max for goals
    var max = d3.max(data, function (d) {return d.G;});

    svg.call(tip);

    // scale for y axis
    var y = d3.scale.linear().domain([0, max]).range([height, 0]);
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
	    .x(function(d) { return x(d.Season)+50; })
	    .y(function(d) { return y(d.G); })
	    .interpolate("linear")


	// trying things out
	var path = svg.selectAll('path').data(data);

    path.enter().append('svg:path').attr('d', line(data))
        .style('stroke-width', 1)
        .style('stroke', 'red')
        .style("fill", "none");

   
    var circles = svg.selectAll('circle').data(data);

    circles.enter().append("circle")
		.attr("cx", function(d){ return x(d.Season)+50})
		.attr("cy", function(d){ return y(d.G)})
		.attr("fill", "pink")
		.attr("r", 8)
		.on('mouseover', tip.show)
  		.on('mouseout', tip.hide)
  		.on('click', function(d){ showEdition(d)})


	svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(50," + height + ")")
        .style("text-anchor", "end")
        .text("Season")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(15)");

    var group = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .attr("transform", "translate(50,0)")
    var y_label = group.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Goals");



   	// ------------- other options
   	 var data1 = [ "FG", "3PT Percentage", "FTP"];

   	 var select = d3.select("#select-box")
		.append('select')
		.attr('class','select')
	    .on('change', onchange)

	var options = select
	  .selectAll('option')
		.data(data1).enter()
		.append('option')
		.text(function (d) { return d; });


	function onchange() {

		svg.call(tip);
		path.remove();
		circles.remove();

		selectValue = d3.select('select').property('value')

		if (selectValue == "FG"){
		    max = 1;
		    y.domain([0, max]);
		    label = "Field Goal Percentage";

		    tip.html(function(d){ { return "<strong style='color:yellow'>Season:</strong> <span style='color:yellow'>" + d.Season +
			"</span><p><strong style='color:yellow'>Goals:</strong> <span style='color:yellow'>" + d.FG_P; }})

		    circles.enter().append("circle")
				.attr("cx", function(d){ return x(d.Season) + 50})
				.attr("cy", function(d){ return y(d.FG_P)})
				.attr("fill", "pink")
				.on('mouseover', tip.show)
					.on('mouseout', tip.hide)
				.attr("r", 8); 
			line.y(function(d) { return y(d.FG_P); });
		}
		else if (selectValue == "3PT Percentage"){
		    max = 1;
			label = "3PT Percentage";
			y.domain([0, max]);
			tip.html(function(d){ { return "<strong style='color:yellow'>Season:</strong> <span style='color:yellow'>" + d.Season +
			"</span><p><strong style='color:yellow'>Goals:</strong> <span style='color:yellow'>" + d.P3P_P; }})

		  	circles.enter().append("circle")
				.attr("cx", function(d){ return x(d.Season) + 50})
				.attr("cy", function(d){ return y(d.P3P_P)})
				.attr("fill", "pink")
				.on('mouseover', tip.show)
  				.on('mouseout', tip.hide)
  				.on('click', function(d){ showEdition(d)})
				.attr("r", 8).transition().duration(800); 
			line.y(function(d) { return y(d.P3P_P); });}
		else if (selectValue == "FTP"){
		    max = 1;
		    label = "Free Throw Percentage";
		    y.domain([0, max]);
		    tip.html(function(d){ { return "<strong style='color:yellow'>Season:</strong> <span style='color:yellow'>" + d.Season +
			"</span><p><strong style='color:yellow'>Goals:</strong> <span style='color:yellow'>" + d.FT_P; }})

		    circles.enter().append("circle")
				.attr("cx", function(d){ return x(d.Season) + 50})
				.attr("cy", function(d){ return y(d.FT_P)})
				.attr("fill", "pink")
				.on('mouseover', tip.show)
  				.on('mouseout', tip.hide)
  				.on('click', function(d){ showEdition(d)})
				.attr("r", 8).transition().duration(800); 
			line.y(function(d) { return y(d.FT_P); });}

		svg.call(tip);

	    // y axis
	    yAxis = d3.svg.axis()
	        .scale(y)
	        .orient("left");

	    y_label.text(label);
	       
	    circles.transition().duration(800); 

	    svg.select(".y.axis")
	    	.transition()
	    	.duration(800)
	    	.call(yAxis);

	    path.enter().append('svg:path').attr('d', line(data))
	    	.transition()
	    	.duration(800)
	        .style('stroke-width', 1)
	        .style('stroke', 'red')
	        .style("fill", "none");
	    path.exit().remove();
    }
}

