var multiple_bar_margin = {top: 45, right: 100, bottom: 20, left: 20},
    multiple_bar_width = 450 - multiple_bar_margin.left - multiple_bar_margin.right,
    multiple_bar_height = 150 - multiple_bar_margin.top - multiple_bar_margin.bottom;

var formatPercent = d3.format(".0%");

var color = d3.scale.category10();

var multiple_bar_x = d3.scale.ordinal()
    .rangeRoundBands([0, multiple_bar_width], .1);

// Scales. Note the inverted domain fo y-scale: bigger is up!
var multiple_bar_y = d3.scale.linear()
    .range([multiple_bar_height, 0]);

var multiple_bar_xAxis = d3.svg.axis()
    .scale(multiple_bar_x)
    .orient("bottom");

// not actually used because heights are too small
var multiple_bar_yAxis = d3.svg.axis()
    .scale(multiple_bar_y)
    .orient("left")
    .tickFormat(formatPercent);

var multiple_bar_tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>" + d.shot + "\t" + d.year + "</strong><br/><span style='color:#fff'>" + d.percent*100 + "%</span>";
    });

// csv loaded asynchronously
d3.tsv("curry/data/multiple_bar_data.tsv", type, function(data) {

    // Data is nested by shot
    var shots = d3.nest()
        .key(function(d) { return d.shot; })
        .entries(data);

    // Parse dates and numbers. We assume values are sorted by date.
    // Also compute the maximum price per symbol, needed for the y-domain.
    // symbols.forEach(function(s) {
    //   s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; });
    //   s.maxPrice = d3.max(s.values, function(d) { return d.price; });
    // });

    // Compute the minimum and maximum year and percent across symbols.
    multiple_bar_x.domain(data.map(function(d) { return d.year; }));
    multiple_bar_y.domain([0, d3.max(shots, function(s) { return s.values[0].percent; })]);

    // Add an SVG element for each shot, with the desired dimensions and multiple_bar_margin.
    var multiple_bar_svg = d3.select("#multiple-bar").selectAll("svg")
        .data(shots)
        .enter()
        .append("svg:svg")
        .attr("width", multiple_bar_width + multiple_bar_margin.left + multiple_bar_margin.right)
        .attr("height", multiple_bar_height + multiple_bar_margin.top + multiple_bar_margin.bottom)
        .append("g")
        .attr("transform", "translate(" + multiple_bar_margin.left + "," + multiple_bar_margin.top + ")");

    multiple_bar_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + multiple_bar_height + ")")
        .call(multiple_bar_xAxis);

    multiple_bar_svg.append("g")
        // Hide y axis
        // .attr("class", "y axis")
        // .call(yAxis)
        .append("text")
        .attr("x", multiple_bar_width + 10)
        .attr("y", multiple_bar_height/3)
        .attr("dy", ".71em")
        .attr("text-anchor", "start")
        .attr("font-size", "1.1em")
        .style("fill", "#FFD700")
        .text(function(d) { return d.key});

    // Accessing nested data: https://groups.google.com/forum/#!topic/d3-js/kummm9mS4EA
    // data(function(d) {return d.values;})
    // this will dereference the values for nested data for each group
    multiple_bar_svg.selectAll(".bar")
        .data(function(d) {return d.values;})
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return multiple_bar_x(d.year); })
        .attr("width", multiple_bar_x.rangeBand())
        .attr("y", function(d) { return multiple_bar_y(d.percent); })
        .attr("height", function(d) { return multiple_bar_height - multiple_bar_y(d.percent); })
        .attr("fill", function(d) {return color(d.percent)})
        .on('mouseover', multiple_bar_tip.show)
        .on('mouseout', multiple_bar_tip.hide)

    multiple_bar_svg.call(multiple_bar_tip);

    multiple_bar_svg.selectAll("text")
        .style("fill", "#006BB6");


});

function type(d) {
    d.percent = +d.percent;
    return d;
}