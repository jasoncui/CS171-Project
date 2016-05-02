d3.csv("curry/data/curry-college-data.csv", type, function(error, data) {
    console.log(data);
});

function type(d) {
    d.age = +d.age;
    d.assists = +d.assists;
    d.assistsPerGame = +d.assistsPerGame;
    d.blocks = +d.blocks;
    d.fieldGoalAttempts = +d.fieldGoalAttempts;
    d.fieldGoalPercentage = +d.fieldGoalPercentage;
    d.fieldGoals = +d.fieldGoals;
    d.freeThrowAttempts = +d.freeThrowAttempts;
    d.freeThrowPercentage = +d.freeThrowPercentage;
    d.freeThrows = +d.freeThrows;
    d.gamesPlayed = +d.gamesPlayed;
    d.points = +d.points;
    d.pointsPerGame = +d.pointsPerGame;
    d.rebounds = +d.rebounds;
    d.reboundsPerGame = +d.reboundsPerGame;
    d.steals = +d.steals;
    d.threes = +d.threes;
    d.threesAttempts = +d.threesAttempts;
    d.threesPercentage  = +d.threesPercentage;
    d.turnovers = +d.turnovers;

    return d;
}