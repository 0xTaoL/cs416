async function init_full_timeline(
  svg_width,
  svg_height,
  start_year = 2013,
  end_year = 2023,
  svg_id = "#2013-2023-timeline-chart"
) {
  const width = svg_width;
  const height = svg_height;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const default_start_year = 500;
  const default_end_year = 1778;
  // Retrieve data
  const filePath = "main/sp500_index.csv";
  let data = await d3.csv(
    `https://raw.githubusercontent.com/0xTaoL/cs416/${filePath}`
  );
  // Parse the data into appropriate types
  data = data
    .filter((d) => Number(d.year) >= start_year)
    .filter((d) => Number(d.year) <= end_year);
  data.forEach((d) => {
    d.year = Number(d.year);
    d.population = Number(d.population);
  });

  if (start_year !== default_start_year && end_year !== default_end_year) {
    console.log("Please reset chart!");
  } else if (end_year !== default_end_year) {
    populateDropdownFilterEnd("start-years", data);
  } else if (start_year !== default_start_year) {
    populateDropdownFilterStart("end-years", data);
  } else {
    populateDropdownFull("start-years", data);
    populateDropdownFull("end-years", data);
  }

  // Create the SVG element
  const svg = d3
    .select(svg_id)
    .append("g")
    .attr("width", width)
    .attr("height", height);

  // Create a scale for the x-axis
  const xScale = d3
    .scaleLinear()
    .domain([start_year, end_year])
    .range([0, chartWidth]);

  // Create a scale for the y-axis
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.population)])
    .range([chartHeight, 0]);

  // Create the line generator
  const line = d3
    .line()
    .x((d) => margin.left + xScale(d.year))
    .y((d) => margin.top + yScale(d.population));

  // Append the line path
  svg
    .append("path")
    .datum(data)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

  // Append circle data points
  svg
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => margin.left + xScale(d.year))
    .attr("cy", (d) => margin.top + yScale(d.population))
    .attr("r", 3)
    .style("fill", "steelblue")
    .style("stroke", "black")
    .on("mouseover", (d) => {
      // Show the tooltip on mouseover
      const tooltip = svg
        .append("g")
        .attr("class", "tooltip")
        .attr(
          "transform",
          "translate(" +
            (xScale(d.year) + 10) +
            "," +
            (yScale(d.population) - 20) +
            ")"
        );

      tooltip
        .append("text")
        .attr("y", 15)
        .text("Year: " + d.year);

      tooltip
        .append("text")
        .attr("y", 30)
        .text("Population: " + d.population);
    })
    .on("mouseout", (d, i) => {
      // Remove the tooltip on mouseout
      svg.select(".tooltip").remove();
    });

  // Append X-axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("~d")));

  // Append Y-axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(yScale).tickFormat(d3.format("~s")));

  // Append x-axis label
  svg
    .append("text")
    .attr("y", height)
    .attr("x", width / 2)
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Year");

  // Append y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", -(height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Price ($)");
}
