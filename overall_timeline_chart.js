async function init_full_timeline(svg_width, svg_height, svg_id, start, end) {
  const width = svg_width;
  const height = svg_height;
  const margin = { top: 20, right: 30, bottom: 30, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  // Retrieve data
  const filePath = "main/sp500_index.csv";
  let data = await d3.csv(
    `https://raw.githubusercontent.com/0xTaoL/cs416/${filePath}`
  );
  // Parse the data into appropriate types
  data = data;
  const parseDate = d3.utcParse("%Y-%m-%d");
  data.forEach((d) => {
    d.Date = parseDate(d.Date);
    d.SP500 = +d.SP500;
  });

  const monthlyData = Array.from(
    d3.group(data, (d) => d3.timeMonth(d.Date)),
    ([key, values]) => {
      return {
        key: new Date(key),
        value: d3.mean(values, (d) => d.SP500),
      };
    }
  );

  // Create the SVG element
  const svg = d3
    .select(svg_id)
    .append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales and axes
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(monthlyData, (d) => d.key))
    .range([0, chartWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(monthlyData, (d) => d.value),
      d3.max(monthlyData, (d) => d.value),
    ])
    .range([chartHeight, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g").attr("transform", `translate(0, ${chartHeight})`).call(xAxis);

  svg.append("g").call(yAxis);

  // Create tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Append the data points
  svg
    .selectAll(".datapoint")
    .data(monthlyData)
    .enter()
    .append("circle")
    .attr("class", "datapoint")
    .attr("cx", (d) => xScale(d.key))
    .attr("cy", (d) => yScale(d.value))
    .attr("r", 5)
    .attr("fill", "steelblue")
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `${d3.timeFormat("%b %Y")(d.key)}<br/>S&P 500: $${d.value.toFixed(2)}`
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Create the line generator
  const line = d3
    .line()
    .x((d) => xScale(d.key))
    .y((d) => yScale(d.value));

  // Append the line to the chart
  svg
    .append("path")
    .datum(monthlyData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);
}
