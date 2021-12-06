// @TODO: YOUR CODE HERE!

var svgWidth = 700;
var svgHeight = 500;

var margin = {
    top:50,
    right:50,
    bottom:50,
    left:50,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper setup
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class","chart");

var circRadius;
function crGet() {
    if (width <=530){
        circRadius = 5;
    }

    else {
        circRadius = 10;
    }

}
crGet();

var chartgroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);


//params
var xaxisobject = "poverty";

//connect to csv data
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    //scan the data
    data.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //scale function setup 
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.poverty) - 1, d3.max(data, d => d.poverty) +1])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.healthcare) - 1, d3.max(data, d => d.healthcare) +1])
    .range([height, 0]);

    //axis function setup
    var xaxis = d3.axisBottom(xLinearScale);
    var yaxis = d3.axisLeft(yLinearScale);

    //chart axis setup 
    chartgroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xaxis);

    chartgroup.append("g").call(yaxis)

    //circle setup
    var circlesgroup = chartgroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "8")
        .attr("fill", "blue")
        .classed("stateCircle", true);



    var state = chartgroup.selectAll(null)
        .data(data)
        .enter()
        .append("text");
    state
        .attr("x", function (d) {
        return xLinearScale(d.poverty);
        })
        .attr("y", function (d) {
        return yLinearScale(d.healthcare) + 4
        })
        .text(function (d) {
        return d.abbr;
        })
        .attr("class", "stateText")
        .attr("font-size", "9px");    
    //tool tip setup
    var tooltip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
        return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
        });

    chartgroup.call(tooltip);

    circlesgroup
    .on("click",function(data){
        tooltip.show(data,this);


    })
    .on("mouseout", function(data,index){
        tooltip.hide(data);
    })

    //scatter chart labels
    chartgroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 5)
        .attr("x", 0 - (height / 2) - 55)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartgroup.append("text")
        .attr("transform", `translate(${(width / 2)-55}, ${height + margin.top - 15})`)
        .attr("class", "axisText")        
        .text("In Poverty (%)");
        }).catch(function(error) {
        console.log(error);

});

