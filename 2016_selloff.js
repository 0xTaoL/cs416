async function init_2016selloff_timeline(svg_width, svg_height, svg_id) {
  const width = svg_width;
  const height = svg_height;
  const margin = { top: 20, right: 30, bottom: 30, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const filePath = "main/sp500_index.csv";
  let data = await d3.csv(
    `https://raw.githubusercontent.com/0xTaoL/cs416/${filePath}`
  );

  const parseDate = d3.utcParse("%Y-%m-%d");

  data.forEach((d) => {
    d.Date = parseDate(d.Date);
    d.SP500 = +d.SP500;
  });

  const monthlyData = Array.from(
    d3.group(data, (d) => d3.timeMonth(d.Date)),
    ([key, values]) => {
      const date = new Date(key);
      const startDate = new Date("2015-06-01");
      const endDate = new Date("2016-06-30");

      if (date >= startDate && date <= endDate) {
        return {
          key: date,
          value: d3.mean(values, (d) => d.SP500),
        };
      }
    }
  ).filter(Boolean);

  const svg = d3
    .select(svg_id)
    .append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", `translate(${margin.left},${margin.top})`);

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

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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

  const line = d3
    .line()
    .x((d) => xScale(d.key))
    .y((d) => yScale(d.value));

  svg
    .append("path")
    .datum(monthlyData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  const annotations = [
    {
      type: d3.annotationCalloutElbow,
      connector: { end: "arrow" },
      note: {
        label:
          "The chinese stock market popped on June 12th, 2015, causing a global selloff causing ripple effects in the US market.",
        title: "Chinese stock market bubble",
        wrap: 300,
      },
      x: 200,
      y: 200,
      dx: 130,
      dy: 150,
    },
    {
      type: d3.annotationCalloutElbow,
      connector: { end: "arrow" },
      note: {
        label:
          "The federal reserve raised its benchmark interest rates and oil prices fell causing energy stocks to fall.",
        title: "Rising interest rates and oil prices",
        wrap: 300,
      },
      x: 600,
      y: 300,
      dx: 10,
      dy: -210,
    },
  ].map(function (d) {
    d.color = "#E8336D";
    return d;
  });

  const makeAnnotations = d3.annotation().annotations(annotations);

  svg.append("g").attr("class", "annotation-group").call(makeAnnotations);

  // Add x-axis label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", chartHeight + margin.bottom)
    .style("text-anchor", "middle")
    .text("Date");

  // Add y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("S&P 500 Price (USD)");
}
