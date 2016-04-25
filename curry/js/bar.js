    var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Percentage:</strong> <span style='color:white'>" + d.threes + "</span>";
        })

    var svg = d3.select("#bar1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg2 = d3.select("#bar2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg3 = d3.select("#bar3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv("curry/data/data.csv", type, function(error, data) {

        console.log(data);

        x.domain(data.map(function(d) { return d.season; }));
        y.domain([0, 0.7]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("threes");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.season); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.threes); })
            .attr("height", function(d) { return height - y(d.threes); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2) + 20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Three Pointer Percentage");

        svg2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg2.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("free throws");

        svg2.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.season); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.freethrows); })
            .attr("height", function(d) { return height - y(d.freethrows); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

        svg3.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg3.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("free throws");

        svg3.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.season); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.blockPercentage); })
            .attr("height", function(d) { return height - y(d.blockPercentage); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

    });

    function type(d) {
        d.threes = +d.threes;
        return d;
    }
