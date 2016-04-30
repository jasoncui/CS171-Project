leagueThreesLeaders = [
    {
        key: "League Threes Leaders",
        values: [
            {
                "label" : "Stephen Curry" ,
                "value" : 402
            } ,
            {
                "label" : "Klay Thompson" ,
                "value" : 276
            } ,
            {
                "label" : "James Harden" ,
                "value" : 236
            } ,
            {
                "label" : "Damian Lillard" ,
                "value" : 229
            } ,
            {
                "label" : "Kyle Lowry" ,
                "value" : 212
            } ,
            {
                "label" : "Paul George" ,
                "value" : 210
            } ,
            {
                "label" : "J.R. Smith" ,
                "value" : 204
            } ,
            {
                "label" : "J.J. Redick" ,
                "value" : 200
            }
        ]
    }
];

leagueFGLeaders = [
    {
        key: "League Field Goal Leaders",
        values: [
            {
                "label" : "Stephen Curry" ,
                "value" : 805
            } ,
            {
                "label" : "Lebron James" ,
                "value" : 737
            } ,
            {
                "label" : "James Harden" ,
                "value" : 710
            } ,
            {
                "label" : "Kevin Durant" ,
                "value" : 698
            } ,
            {
                "label" : "Russell Westbrook" ,
                "value" : 656
            } ,
            {
                "label" : "Klay Thompson" ,
                "value" : 651
            } ,
            {
                "label" : "C.J. McCollum" ,
                "value" : 641
            } ,
            {
                "label" : "Karl-Anthony Towns" ,
                "value" : 625
            }
        ]
    }
];

leagueFTPercentage = [
    {
        key: "League Free Throw Percentage",
        values: [
            {
                "label" : "Stephen Curry" ,
                "value" :.907
            } ,
            {
                "label" : "Jamal Crawford" ,
                "value" :.904
            } ,
            {
                "label" : "Kevin Durant" ,
                "value" :.898
            } ,
            {
                "label" : "Chris Paul" ,
                "value" :.896
            } ,
            {
                "label" : "Dirk Nowitzki" ,
                "value" :.893
            } ,
            {
                "label" : "Damian Lillard" ,
                "value" :.892
            } ,
            {
                "label" : "Kevin Martin" ,
                "value" :.889
            } ,
            {
                "label" : "J.J. Redick" ,
                "value" :.888
            }
        ]
    }
];


leaguePointsPerGameLeaders = [
    {
        key: "League Points Per Game Leaders",
        values: [
            {
                "label" : "Stephen Curry" ,
                "value" : 30.1
            } ,
            {
                "label" : "James Harden" ,
                "value" : 29.0
            } ,
            {
                "label" : "Kevin Durant" ,
                "value" : 28.2
            } ,
            {
                "label" : "DeMarcus Cousins" ,
                "value" : 26.9
            } ,
            {
                "label" : "LeBron James" ,
                "value" : 25.3
            } ,
            {
                "label" : "Damian Lillard" ,
                "value" : 25.1
            } ,
            {
                "label" : "Anthony Davis" ,
                "value" : 24.3
            } ,
            {
                "label" : "Russell Westbrook" ,
                "value" : 23.5
            }
        ]
    }
];

// add threes graph
nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(false)
        .showValues(true)
        .duration(300)
        ;

    d3.select('#leaders-threes')
        .datum(leagueThreesLeaders)
        .call(chart);
    nv.utils.windowResize(chart.update);
    return chart;
});

// add FT % graph
nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(false)
        .showValues(true)
        .duration(300)
        ;

    d3.select('#leaders-FTPercentage')
        .datum(leagueFTPercentage)
        .call(chart);
    nv.utils.windowResize(chart.update);
    return chart;
});

// add FG graph
nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(false)
        .showValues(true)
        .duration(500)
        ;

    d3.select('#leaders-FGs')
        .datum(leagueFGLeaders)
        .call(chart);
    nv.utils.windowResize(chart.update);
    return chart;
});

// add points per game graph
nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(false)
        .showValues(true)
        .duration(500)
        ;

    d3.select('#leaders-PPG')
        .datum(leaguePointsPerGameLeaders)
        .call(chart);
    nv.utils.windowResize(chart.update);
    return chart;
});