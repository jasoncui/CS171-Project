var chart1 = c3.generate({
    bindto: '#college-line1',
    data: {
        x: 'x',
        columns: [
            ['x', 2006, 2007, 2008],
            ['Field Goals', 242, 317, 312],
            ['Threes', 122, 162, 130],
            ['Free Throws', 124, 135, 220]
        ]
    }
});

var chart2 = c3.generate({
    bindto: '#college-line2',
    data: {
        x: 'x',
        columns: [
            ['x', 2006, 2007, 2008],
            ['Rebounds', 157, 165, 151],
            ['Assists', 95, 104, 189],
            ['Steals', 62, 73, 86],
            ['Blocks', 6, 14, 8],
            ['Turnovers', 93, 126, 219]
        ]
    }
});

function toggleLine1() {
    chart1.transform('line');
}

function toggleArea1() {
    chart1.transform('area-spline');
}

function togglePie1() {
    chart1.transform('pie');
}

function toggleLine2() {
    chart2.transform('line');
}

function toggleArea2() {
    chart2.transform('area-spline');
}

function togglePie2() {
    chart2.transform('pie');
}
