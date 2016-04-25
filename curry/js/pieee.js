//Width and height for whole
var w = 1024;
var h = 768;

//image width and height
var image_w = 200;
var image_h = 200;

//Map the winrate to opacity[0.3, 0.9] 
var Opacity = d3.scale.linear()
    .range([0.2, 0.9]);

//Map the rank to radius[2, 20] 
var Scale = d3.scale.linear()
    .range([2, 20]);

//Create svg_pie element
var svg_pie = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

//Creater a group to store states
var g = svg_pie.append("g")
    .attr("class","map");

//Craete the radar chart
var radarChart = RadarChart.chart();
//default config
var defaultConfig = radarChart.config(); 
//defaultConfig.w and defaultConfig.h is 600
radarChart.config({w: 300, h: 300, levels: 4, maxValue: 100});
//TeamData for Rader chart
var teamRadarData = [];
//List of teams
var teamList = [];

d3.csv("curry/data/gsw.csv", function(data) {
    console.log(data)
    console.log(data[0])
    teamClick(data[0]);
});

//Regularize the rank, rank 1 to 30 points
function regularizeRank(rank) {
    return ((31 - rank) / 30 * 100).toFixed(1);
}

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

//When click a Node
function teamClick(d) {
    selectedTeamName = d.teamname;
    if (contains(teamList, selectedTeamName)) { //Contains the node

        //Remove the selected team data
        for (var i = 0; i < teamRadarData.length; i++) {
            if (selectedTeamName == teamRadarData[i].className) {
                teamRadarData.remove(teamRadarData[i]);
                break;
            };
        }

        //Remove in the teamList;
        teamList.remove(selectedTeamName);

        //Existing node number after deleting
        if (teamList.length == 0) {
            d3.selectAll(".pie-chart").remove();
        } 
        if (teamList.length == 1) {
            createPieChart();
            d3.selectAll(".teamRadar").remove();
        }
        if  (teamList.length >= 2) {
            renderRadarChart();
        }
    } else {    //Does not contain the node
        teamList.push(selectedTeamName);
        // active = d3.select(this).style("fill", "orange");
        if (teamList.length == 1) {
            createPieChart();
            //Push the team data for radar chart, but not display
            d3.csv("curry/data/teamstats.csv", function(teamData) {
                //Loop through once for each team data value
                pushTeamRadarData(teamData);
            });

        }
        if (teamList.length >= 2) {
            //remove the pie chart
            d3.selectAll(".pie-chart").remove();

            //Push the team data for radar chart, draw but not display
            d3.csv("data/teamstats.csv", function(teamData) {
                //Loop through once for each team data value
                pushTeamRadarData(teamData);
                renderRadarChart();
            });
        }
    }
    //Push team data for radar chart
    function pushTeamRadarData(teamData){
        for (var i = 0; i < teamData.length; i++) { 
            if (teamData[i].team == selectedTeamName) { //Grab the team
                var teamAxes = [];
                teamAxes.push({axis: "Points", value: regularizeRank(teamData[i].rPTS)});
                teamAxes.push({axis: "Turnovers", value: regularizeRank(teamData[i].rTOV)});
                teamAxes.push({axis: "Steals", value: regularizeRank(teamData[i].rSTL)});
                teamAxes.push({axis: "Blocks", value: regularizeRank(teamData[i].rBLK)});
                teamAxes.push({axis: "Rebounds", value: regularizeRank(teamData[i].rREB)});
                teamAxes.push({axis: "Assists", value: regularizeRank(teamData[i].rAST)});

                teamRadarData.push({className: teamData[i].team, axes: teamAxes});
            }
        }
    }

    //Create PieChart for players
    function createPieChart() {
        d3.selectAll(".pie-chart").remove();

        var width = 280;
        var height = 600;
        var radius = Math.min(width, height) / 3;
        var innerRadius = 0.45 * radius;

        //Players' data in a team
        teamPlayer = [];
        //teamPlayerName for returning a color;
        teamPlayerName = [];

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
                .offset([0, -128])
                .html(function(d) { return "<span>" + d.data.player + "<p></span>" 
                        + " <span> Points: " + d.data.PTS + "</span></p>" + " <span> Points: " + d.data.PTS + "</span></p>"; });;

            var outlineArc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius);

            //Six pie charts
            for (var i = 0 ; i < 6; i++) {
                var pie = d3.layout.pie().sort(null);
                var arc = d3.svg.arc().innerRadius(innerRadius);
                //In the center
                var shortAttrName = ["Points", "Assists", "Rebounds", "Blocks", "Steals", "Turnovers"];
                //For the title when hover
                var fullAttrName = ["Points", "Assists", "Rebounds", "Blokcks", "Steals", "Turnovers"];

                var pieChart = svg_pie.append("g")
                    .attr("class", "pie-chart")
                    .attr("width", width)
                    .attr("height", height)

                    .append("g");

                //position of the pie charts
                pieChart.attr("class", "single-pie-chart").attr("transform", function() { 
                    if (i <= 2){
                        return "translate(" + 170 + "," + (120 + i * 210) +")" ;
                    } else {
                        return "translate(" + 450 + "," + (120 + (i - 3) * 210) +")" ;
                    }
                });

                //words in the center
                pieChart.append("g:text")
                    .attr("class", "aster-score")
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle") // text-align: right
                    .text(function() { return shortAttrName[i]; })
                    .style("fill", "blue")
                    .append("title")
                    .text(function() { return fullAttrName[i] })
                    .call(tip); 

                if (i == 0) { 
                    pie.value(function(d) { return d.PTS; });
                    arc.outerRadius(function (d) { return (radius - innerRadius) * d.data.PTS / maxPlayerPTS + innerRadius; });
                }
                if (i == 1) { 
                    pie.value(function(d) { return d.AST; });
                    arc.outerRadius(function (d) { return (radius - innerRadius) * d.data.AST / maxPlayerAST + innerRadius; });
                }
                if (i == 2) { 
                    pie.value(function(d) { return d.REB; }); 
                    arc.outerRadius(function (d) { return (radius - innerRadius) * d.data.REB / maxPlayerREB + innerRadius; });
                }
                if (i == 3) { 
                    pie.value(function(d) { return d.BLK; }); 
                    arc.outerRadius(function (d) { return (radius - innerRadius) * d.data.BLK / maxPlayerBLK + innerRadius; })
                }
                if (i == 4) {
                    pie.value(function(d) { return d.STL; }); 
                    arc.outerRadius(function (d) { return (radius - innerRadius) * d.data.STL / maxPlayerSTL + innerRadius; })
                }
                if (i == 5) { 
                    pie.value(function(d) { return d.TOV; });
                    arc.outerRadius(function (d) { return (radius - innerRadius) * d.data.TOV / maxPlayerTOV + innerRadius; });
                }

                var pieColor = d3.scale.linear()
                    .domain([0, 15])
                    .range(["yellow", "yellow"])
                    .interpolate(d3.interpolateLab);

                var path = pieChart.selectAll(".solidArc")
                    .data(pie(playerDataset(teamPlayer)))
                    .enter().append("path")
                    .attr("fill", function(d) { return pieColor(teamPlayerName.indexOf(d.data.player)); })
                    .attr("class", "solidArc")
                    .attr("stroke", "gray")
                    .attr("d", arc)
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .append("title")
                    .text(function(d){ return "Team: " + d.data.team; });

                var outerPath = pieChart.selectAll(".outlineArc")
                    .data(pie(playerDataset(teamPlayer)))
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke", "gray")
                    .attr("class", "outlineArc")
                    .attr("d", outlineArc);  
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

//Draw radar chart
function renderRadarChart() {
    var teamRadar = svg_pie.selectAll("g.teamRadar").data([teamDataset(teamRadarData)]);
    teamRadar.enter().append("g").classed("teamRadar", 1);
    teamRadar.attr("transform", "translate(645,100)").call(radarChart);

    //Render the legend
    renderLengend(teamList);
}

//Draw the lengend of the radar chart
function renderLengend(teamList) {
    var colorscale = d3.scale.category10();

    //Initiate Legend   
    var legend = svg_pie.select(".teamRadar").selectAll("g.legend-tag").data(teamList).enter()
        .append("g")
        .attr("class", "legend-tag")
        .attr("height", 100)
        .attr("width", 200)
        .attr("transform", "translate(285,0)") ;

    //Create colour squares
    legend.selectAll("rect").data(teamList).enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i){ return i * 20;})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i){ return colorscale(i);});

    //Create text next to squares
    legend.selectAll(".legend-team").data(teamList).enter()
        .append("text")
        .attr("class", "legend-team")
        .attr("x", 12)
        .attr("y", function(d, i){ return i * 20 + 9;})
        .attr("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d) { return d; }); 
}
