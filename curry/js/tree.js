var margin2 = {top: 20, right: 120, bottom: 20, left: 120},
    width2 = 960 - margin2.right - margin2.left,
    height2 = 500 - margin2.top - margin2.bottom;

var i = 0;

var tree = d3.layout.tree()
    .size([height2, width2]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg2 = d3.select("#tree").append("svg")
    .attr("width", width2 + margin2.right + margin2.left)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + 220 + "," + margin2.top + ")");

d3.json("curry/data/malaria-parasites.json", function(error, json) {

    if (error) return console.warn(error);
    data = json;


    root = data[0];

    update(root);

    function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Declare the nodes
        var node = svg2.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter the nodes
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")"; });

        nodeEnter.append("circle")
            .attr("r", 8)
            .style("fill", "#fff");

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -13 : 13; })
            .attr("dy", ".38em")
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("font-family", "Karla")
            .style("fill-opacity", 1);

        // Declare the links¦
        var link = svg2.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter the links.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", diagonal);

    }

});