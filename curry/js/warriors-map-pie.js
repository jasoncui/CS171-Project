//Width and height for whole
var w = 524;
var h = 572;

//image width and height
var image_w = 100;
var image_h = 100;

//For selected node
var active = d3.select(null);

//Define map projection
var projection = d3.geo.albersUsa()
    .translate([w/3 + 80, h/3.5-27])
    .scale([600]);

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//Map the winrate to opacity[0.3, 0.9] 
var Opacity = d3.scale.linear()
    .range([0.2, 0.9]);

//Map the rank to radius[2, 20] 
var Scale = d3.scale.linear()
    .range([2, 20]);

//Create SVG element
var svg_p = d3.select("#map-pie")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .on("click", stopped, true);

//Creater a group to store states
var g = svg_p.append("g")
    .attr("class","map")
    .attr("y", 100)
    .attr("x", 100)
    .attr("width", w)
    .attr("height", h);

var team_data;
var first = true;

//Load in state data, draw the map
d3.csv("curry/data/US-states.csv", function(data) {
    //Load in GeoJSON data
    d3.json("curry/data/US-geo.json", function(json) {
        for (var i = 0; i < data.length; i++) {
            var dataState = data[i].state;            
            var dataValue = parseFloat(data[i].value);  
            var dataEASTorWEST = data[i].EASTorWEST;
            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    //Copy the data value into the JSON
                    json.features[j].properties.EASTorWEST = dataEASTorWEST;
                    //Stop looking through the JSON
                    break;
                }
            }
        }
        //Bind data and create one path per GeoJSON feature
        g.selectAll("path")
            .data(json.features).enter()
            .append("path")
            .attr("stroke","white")
            .attr("stroke-width",2)
            .attr("d", path)
            .attr("class", function(d) {
                return d.properties.postal;})
            .attr("width", width)
            .attr("height", height)
            .style("fill", function(d) {
                //Get data value
                var EASTorWEST = d.properties.EASTorWEST;
                if (EASTorWEST) {
                    //If value exists…
                    if (EASTorWEST == "East") {
                        return "#99c2ff";
                    } else {
                        return "#ff9999";
                    }
                } else {
                    //If value is undefined…
                    return "#CCCCCC";
                }
            });

        //Load in NBA teams data
        d3.csv("curry/data/NBA-teams.csv", function(data) {
            team_data = data;
            console.log("check")
            console.log(team_data)
            //Map the rank to radius[2, 20] 
            Scale.domain([0, d3.max(data, function(d) { return d.winrate; })]);
            //Map the rank to opacity[0.3, 0.9] 
            Opacity.domain([0, d3.max(data, function(d) { return d.winrate; })]);
            //Map the winrate to fontsize[10, 20] 
            var FontSize = d3.scale.linear()
                .domain([15, 1])
                .range([10, 20]);
            //Create nodes group
            var nodes = g.selectAll("nodes")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "team")
                .attr("transform", function(d) {
                    return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";})
                .on("mouseover", nodeMouseover)
                .on("mouseout", nodeMouseout);

            nodes.append("circle")
                .attr("class", function(d) { return d.abb })
                .attr("r", function(d){
                    return Scale(d.winrate/2);})
                .style("fill", function(d){
                    if (d.EASTorWEST == "East") {
                        return "blue";
                    } else {
                        return "red";
                    };
                })
                .style("opacity", function(d){
                    return Opacity(d.winrate);})
                .style("cursor", "pointer")
                .on("click", teamClick);


            //Text for temm abbreviation
            nodes.append("text")
                .attr("class", function(d) {
                    return "text " + d.abb;})
                .attr("dx", function(d){
                    return Scale(d.winrate);})
                .attr("dy", ".3em")
                .attr("font-size", function(d) {
                    return FontSize(d.rank) + "px";})
                .style("fill", "#888888")
                .style("font-weight", "bold")
                .style("cursor", "default")
                .text(function(d) {
                    return d.abb;});

            console.log("test!!");
            console.log(team_data[15]);
            teamClick(team_data[15]);

        });
    });
});

//Judge if is in the array
function contains(array, obj) { 
    var i = array.length; 
    while (i--) { 
        if (array[i] === obj) { 
            return true; 
        } 
    } 
    return false; 
}

//Get the index of the element in an array
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {  
        if (this[i] == val) return i;  
    }  
    return -1;  
};  

//Delete an element in an array
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);  
    if (index > -1) {  
        this.splice(index, 1);  
    }
};  

//List of teams
var teamList = [];

//When click a Node
function teamClick(d) {
    console.log(teamList)
    console.log(d)
    console.log(d.lightColor)
    console.log(d.darkColor)

    selectedTeamName = d.teamname;
    if (contains(teamList, selectedTeamName)) { //Contains the node
        //Restore the node color
        d3.select(this)
            .style("fill", function(d){
            if (d.EASTorWEST == "East") {
                return "blue";
            } else {
                return "red";
            };
        });
        //Remove in the teamList;
        teamList.remove(selectedTeamName);

        //Existing node number after deleting
        if (teamList.length == 0) {
            d3.selectAll(".pie-chart").remove();
        } 
        if (teamList.length == 1) {
            createPieChart(d.teamname, d.lightColor,d.darkColor);
            d3.selectAll(".teamRadar").remove();
        }
        if  (teamList.length >= 2) {
            //renderRadarChart();
        }
    } else {    //Does not contain the node
        teamList = []
        teamList.push(selectedTeamName);
        d3.selectAll("circle").style("fill", function(d){
                    if (d.EASTorWEST == "East") {
                        return "blue";
                    } else {
                        return "red";
                    };
                })
        if (!first)
        {
            active = d3.select(this).style("fill", "#FFD700");
        }
        else{
            d3.select(".GSW").style("fill", "#FFD700");
            first = false;
        }

        createPieChart(d.teamname, d.lightColor,d.darkColor);
    }




//Create PieChart for players
function createPieChart(teamname1,light,dark) {
    console.log(light);
    console.log(dark);

        d3.select("#team-name")
            .text(teamname1)
            .attr("fill","white");


        d3.selectAll(".pie-chart").remove();
        var width = 250;
        var height = 400;
        var radius = Math.min(width, height) / 2 - 60;
        var innerRadius = 0.3 * radius + 10;
        //Players' data in a team
        teamPlayer = [];
        //teamPlayerName for returning a color;
        teamPlayerName = [];

        console.log(teamList)
        //Load each players' data
        d3.csv("curry/data/players.csv", function(error, playerData) {
            playerData.forEach(function(d) {
                //change into number
                d.PTS = +d.PTS
                d.AST = +d.AST
                d.REB = +d.REB
                d.BLK = +d.BLK
                d.STL = +d.STL
                d.TOV = +d.TOV
                //Save the selected team data
                if (d.team == teamList[teamList.length - 1]) {
                    teamPlayer.push({
                        player: d.player, 
                        team: d.team,
                        PTS: d.PTS, 
                        PIE: d.PIE, 
                        REB: d.REB, 
                        AST: d.AST, 
                        STL: d.STL, 
                        BLK: d.BLK, 
                        TOV: d.TOV
                    });
                    teamPlayerName.push(d.player);
                    console.log("test")
                    console.log(teamPlayer)
                }
            });

            //For full percentage of the pie chart
            var maxPlayerPTS = d3.max(playerData, function(d) { return d.PTS; }); 
            var maxPlayerAST = d3.max(playerData, function(d) { return d.AST; });   
            var maxPlayerREB = d3.max(playerData, function(d) { return d.REB; });
            var maxPlayerBLK = d3.max(playerData, function(d) { return d.BLK; });
            var maxPlayerSTL = d3.max(playerData, function(d) { return d.STL; });
            var maxPlayerTOV = d3.max(playerData, function(d) { return d.TOV; });

            var tip = d3.tip()
                .attr("class", "d3-tip pie-chart-tip")
                .html(function(d) { return "<h6>" + d.data.player + "</h6>" + 
                        "<span>Points: " + d.data.PTS + "<br>" + "Assists: " + d.data.AST+ "<br>" +
                        "Blocks: " + d.data.BLK+ "<br>" + "Rebounds: " + d.data.REB+ "<br>" +
                        "Steals: " + d.data.STL+ "<br>" + "Turnovers: " + d.data.TOV+ "</span>"; });;

            var outlineArc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius);

            function tweenPie(finish) {
                var start = {
                        startAngle: 0,
                        endAngle: 0
                    };
                var i = d3.interpolate(start, finish);
                return function(d) { return arc(i(d)); };
            }

            //Six pie charts
            for (var i = 0 ; i < 6; i++) {
                var pie = d3.layout.pie().sort(null);
                var arc = d3.svg.arc().innerRadius(innerRadius)
                    .outerRadius(radius);
                //In the center
                var shortAttrName = ["Points", "Assists", "Rebounds", "Blokcks", "Steals", "Turnovers"];
                //For the title when hover
                var fullAttrName = ["Points", "Assists", "Rebounds", "Blokcks", "Steals", "Turnovers"];

                pie_w = 200;
                pie_h = 300;


                var pieChart = svg_p.append("g")
                    .attr("class", "pie-chart")
                    .attr("x", 100)
                    .attr("y",100)
                    .attr("width", width)
                    .attr("height", height)

                    .append("g");

                //position of the pie charts
                pieChart.attr("class", "single-pie-chart").attr("transform", function() { 
                    if (i <= 2){
                        return "translate(" + (100 + i * 160) + "," + 355 +")" ;
                    } else {
                        return "translate(" + (100 + (i-3) * 160) + "," + 500 +")" ;
                    }
                });

                //words in the center
                pieChart.append("g:text")
                    .attr("class", "aster-score")
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle") // text-align: right
                    .text(function() { return shortAttrName[i]; })
                    .attr("fill", light)
                    .append("title")
                    .text(function() { return fullAttrName[i] })
                    .call(tip); 

                console.log(i);
                if (i == 0) { 
                    pie.value(function(d) { return d.PTS; });
                }
                if (i == 1) { 
                    pie.value(function(d) { return d.AST; });
                }
                if (i == 2) { 
                    pie.value(function(d) { return d.REB; }); 
                }
                if (i == 3) { 
                    pie.value(function(d) { return d.BLK; }); 
                }
                if (i == 4) {
                    pie.value(function(d) { return d.STL; }); 
                }
                if (i == 5) { 
                    pie.value(function(d) { return d.TOV; });
                }

                var pieColor = d3.scale.linear()
                    .domain([0, 15])
                    .range([dark])
                    .interpolate(d3.interpolateLab);

                var path = pieChart.selectAll(".solidArc")
                    .data(pie(playerDataset(teamPlayer)))
                    .enter().append("path")
                    .attr("fill", function(d) { return pieColor(teamPlayerName.indexOf(d.data.player)); })
                    .attr("stroke", light)
                    .attr("stroke-width", "0.5")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .transition()
                    .duration(1200)
                    .attrTween('d', tweenPie)
                    .attr("id", "pie-area");

                var outerPath = pieChart.selectAll(".outlineArc")
                    .data(pie(playerDataset(teamPlayer)))
                    .enter().append("path")
                    .attr("fill", "none")
                    .transition()
                    .duration(1200)
                    .attrTween('d', tweenPie)
                    .attr("stroke", light)
                    .attr("stroke-width", "1")
                    .attr("class", "outlineArc")
                    .attr("id", "pie-area");  
            }
        });
        
        //Return the map of Players' data
        function playerDataset(teamPlayer) {
            return teamPlayer.map(function(d) {
                return {
                    player: d.player,
                    team: d.team,
                    PTS: d.PTS,
                    PIE: d.PIE,
                    REB: d.REB,
                    AST: d.AST, 
                    STL: d.STL, 
                    BLK: d.BLK, 
                    TOV: d.TOV
                };
            });
        }
    }
}


// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) {
        d3.event.stopPropagation();
    }
}

//Emphasize
function nodeMouseover(d){
    d3.select(this).select("circle")
        .transition()
        .duration(200)
        .attr("r", function(d){ 
            return Scale(d.winrate); })
        .style("opacity", 1)
        .style("stroke-width", "2px");

    d3.select(this).select("text")
        .transition()
        .duration(200)
        .attr("dx", function(d){
            return 1.5 * Scale(d.winrate);})
        .style("fill", "#000000")
        .text(function(d) {
            return d.abb + " (" + d.winrate + "%)";});

    //Append the logo of the team
    g.append("image")
        .attr("class", d.abb)
        .attr("xlink:href", "curry/logo/" + d.abb + "_logo.svg")
        .attr("width", image_w + "px")
        .attr("height", image_h + "px")
        //remove the blink effect
        .attr("x", projection([d.lon, d.lat])[0] + 5)
        .attr("y", projection([d.lon, d.lat])[1] + 5);
}

//Get back to original status
function nodeMouseout(d){
    d3.select(this).select("circle")
        .transition()
        .duration(200)
        .attr("r", function(d) { 
            return Scale(d.winrate/2); })
        .style("opacity", function(d){
            return Opacity(d.winrate);})
        .style("stroke-width", "1px");

    d3.select(this).select("text")
        .transition()
        .duration(200)
        .attr("dx", function(d){
            return Scale(d.winrate);})
        .style("fill", "#888888")
        .text(function(d) {
            return d.abb});

    g.select("image")
        .remove();
}
