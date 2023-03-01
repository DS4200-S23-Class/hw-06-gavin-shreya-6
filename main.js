// Set the size of the container/graph
const WIDTH = 500;
const HEIGHT = 400;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };
const visH = HEIGHT - MARGINS.top - MARGINS.bottom;
const visW = WIDTH - MARGINS.left - MARGINS.right;

// Create the SVG containers for the graphs
const firstGraph = d3
  .select(".column1")
  .append("svg")
  .attr("width", WIDTH)
	.attr("height", HEIGHT);
const secondGraph = d3
  .select(".column2")
  .append("svg")
	.attr("width", WIDTH)
  .attr("height", HEIGHT);
const thirdGraph = d3
  .select(".column3")
  .append("svg")
  .attr("width", WIDTH)
	.attr("height", HEIGHT);

// Load the data
d3.csv("data/iris.csv").then((data) => {

	// Scales for graph 1
  const MAX_PETAL_LENGTH = d3.max(data, (d) => parseInt(d["Petal_Length"]));
  const SCALED_PETAL_LENGTH = d3
    .scaleLinear()
    .domain([0, MAX_PETAL_LENGTH + 1])
    .range([0, visW]);
  const MAX_SEPAL_LENGTH = d3.max(data, (d) => parseInt(d["Sepal_Length"]));
  const SCALED_SEPAL_LENGTH = d3
    .scaleLinear()
    .domain([0, MAX_SEPAL_LENGTH + 1])
    .range([visH, 0]);

	// Scales for graph 2
	const MAX_PETAL_WIDTH = d3.max(data, (d) => parseInt(d["Petal_Width"]));
  const SCALED_PETAL_WIDTH = d3
    .scaleLinear()
    .domain([0, MAX_PETAL_WIDTH + 1])
    .range([0, visW]);

  const MAX_SEPAL_WIDTH = d3.max(data, (d) => parseInt(d["Sepal_Width"]));
  const SCALED_SEPAL_WIDTH = d3
    .scaleLinear()
    .domain([0, MAX_SEPAL_WIDTH + 1])
    .range([visH, 0]);

	// Hardcode the scales for graph 3
	const X_SCALE_SPECIES = d3
    .scaleBand()
    .domain(data.map((row) => row["Species"]))
    .range([0, visW])
    .padding(0.5);
  const SPECIES = [
    { species: "setosa", count: 50 },
    { species: "versicolor", count: 50 },
    { species: "virginica", count: 50 },
  ];
  const MAX_IRIS_COUNT = 50;
  const Y_SCALE_IRIS_COUNT = d3
    .scaleLinear()
    .domain([0, MAX_IRIS_COUNT])
    .range([visH, 0]);

	// Create the axes for graph 1
  firstGraph.append("g")
    .attr("transform", `translate(${MARGINS.left},${visH + MARGINS.top})`)
    .call(d3.axisBottom(SCALED_PETAL_LENGTH).ticks(9))
    .attr("font-size", "20px");
  firstGraph.append("g")
    .attr("transform", `translate(${MARGINS.left},${MARGINS.top})`)
    .call(d3.axisLeft(SCALED_SEPAL_LENGTH).ticks(9))
    .attr("font-size", "20px");

	// Create the axes for graph 2
	secondGraph.append("g")
    .attr("transform", `translate(${MARGINS.left},${visH + MARGINS.top})`)
    .call(d3.axisBottom(SCALED_PETAL_WIDTH).ticks(9))
    .attr("font-size", "20px");
  secondGraph.append("g")
    .attr("transform", `translate(${MARGINS.left},${MARGINS.top})`)
    .call(d3.axisLeft(SCALED_SEPAL_WIDTH).ticks(9))
    .attr("font-size", "20px");

	// Create the axes for graph 3
	thirdGraph.append("g")
    .attr("transform", `translate(${MARGINS.left},${visH + MARGINS.top})`)
    .call(d3.axisBottom(X_SCALE_SPECIES).ticks(9))
    .attr("font-size", "20px");
  thirdGraph.append("g")
    .attr("transform", `translate(${MARGINS.left},${MARGINS.top})`)
    .call(d3.axisLeft(Y_SCALE_IRIS_COUNT).ticks(9))
    .attr("font-size", "20px");


	// Create the circles and title for graph 1
  const firstCircles = firstGraph.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => SCALED_PETAL_LENGTH(d["Petal_Length"]) + MARGINS.left)
    .attr("cy", (d) => SCALED_SEPAL_LENGTH(d["Sepal_Length"]) + MARGINS.top)
    .attr("r", 5)
    .attr("class", (d) => d.Species)
    .attr("opacity", 0.5);

  firstGraph.append("text")
    .attr("x", firstGraph.x)
    .attr("y", MARGINS.top - 25)
    .style("font-size", "24px")
    .text("Petal Length vs Sepal Length");

	// Create the circles and title for graph 2
  const secCircles = secondGraph.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => SCALED_PETAL_WIDTH(d["Petal_Width"]) + MARGINS.left)
    .attr("cy", (d) => SCALED_SEPAL_WIDTH(d["Sepal_Width"]) + MARGINS.top)
    .attr("r", 5)
    .attr("class", (d) => d.Species)
    .attr("opacity", 0.5);

  secondGraph.append("text")
    .attr("x", secondGraph.x)
    .attr("y", MARGINS.top - 25)
    .style("font-size", "24px")
		.style("fill", "black")
    .text("Petal Width vs Sepal Width");

	// Create the bars and title for graph 3
  thirdGraph.selectAll("rect")
    .data(SPECIES)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => X_SCALE_SPECIES(d.species) + MARGINS.left)
    .attr("y", (d) => Y_SCALE_IRIS_COUNT(d.count) + MARGINS.top)
    .attr("width", X_SCALE_SPECIES.bandwidth())
    .attr("height", (d) => visH - Y_SCALE_IRIS_COUNT(d.count))
    .attr("class", (d) => d.species)
    .attr("opacity", 0.5)
    .attr("id", (d) => `bar-${d.species}`);

  thirdGraph.append("text")
    .attr("x", thirdGraph.x)
    .attr("y", MARGINS.top - 25)
    .style("font-size", "24px")
    .text("Count of Iris Species");

  // Add the brushing and linking
  const brush = d3.brush()
    .extent([[MARGINS.left, MARGINS.top], [visW + MARGINS.left, visH + MARGINS.top]])
    .on("start brush", brushed);
  secondGraph.append("g")
    .attr("class", "brush")
    .call(brush);

  function brushed(event) {
    const selection = event.selection;
    if (!selection) return;
    
    secCircles.attr("stroke", (d) => {
        return brushedPoint(selection, SCALED_PETAL_WIDTH(d["Petal_Width"]) + MARGINS.left, SCALED_SEPAL_WIDTH(d["Sepal_Width"]) + MARGINS.top) ? "orange" : "none";
       })
      .attr("stroke-width", (d) => {
        return brushedPoint(selection, SCALED_PETAL_WIDTH(d["Petal_Width"]) + MARGINS.left, SCALED_SEPAL_WIDTH(d["Sepal_Width"]) + MARGINS.top) ? 2 : 0;
      });

    firstCircles.attr("stroke", (d) => {
      return brushedPoint(selection, SCALED_PETAL_WIDTH(d["Petal_Width"]) + MARGINS.left, SCALED_SEPAL_WIDTH(d["Sepal_Width"]) + MARGINS.top) ? "orange" : "none";
    })
      .attr("stroke-width", (d) => {
        return brushedPoint(selection, SCALED_PETAL_WIDTH(d["Petal_Width"]) + MARGINS.left, SCALED_SEPAL_WIDTH(d["Sepal_Width"]) + MARGINS.top) ? 2 : 0;
      });
  }
	
});

function brushedPoint(selection, x, y) {
  return (selection[0][0] <= x && x <= selection[1][0]) 
  && (selection[0][1] <= y && y <= selection[1][1]);
}
