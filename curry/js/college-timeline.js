
var kurbickFilms = [{name:"2006-07 Season", date: "2007", img: "http://i.huffpost.com/gen/2911400/thumbs/o-STEPHEN-CURRY-DAVIDSON-570.jpg?1"},
    {name:"2007-08 Season", 	date:"2008", img: "http://www.post-gazette.com/image/2015/05/21/ca0,86,2600,1819/Stephen-Curry-left-and-Jason-Richards.jpg"},
    {name:"2008-09 Season", 	date:"2009", img: "http://a.espncdn.com/combiner/i?img=%2Fphoto%2F2008%2F0328%2Fncb_g_curry_mckillop_sq_300.jpg&w=267"}
];
TimeKnots.draw("#timeline1", kurbickFilms, {dateFormat: "%Y", color: "#FFD700", background: "#006BB6", width:600, showLabels: true, labelFormat: "%Y +1"});