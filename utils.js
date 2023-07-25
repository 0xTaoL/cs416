function updateGraphHeader(text) {
  const h2Element = document.getElementById("chart-header");
  if (h2Element) {
    h2Element.textContent = text;
  }
}

function loadGraphDescription(text) {
  const pElement = document.getElementById("chart-description");
  if (pElement) {
    pElement.textContent = text;
  }
}

function updateChart(svg_id, slide_id) {
  const svg = d3.select(svg_id);
  svg.selectAll("*").remove();
  switch (slide_id) {
    case 1:
      updateGraphHeader(_2016_selloff_title);
      loadGraphDescription(_2016_selloff_paragraph);
      init_2016selloff_timeline(svg_width, svg_height, svg_id);
      break;
    case 2:
      updateGraphHeader(_2018_crypto_bubble_title);
      loadGraphDescription(_2018_crypto_bubble_paragraph);
      init_2018crypto_timeline(svg_width, svg_height, svg_id);
      break;
    case 3:
      updateGraphHeader(_2020_covid_title);
      loadGraphDescription(_2020_covid_paragraph);
      init_2020covid_timeline(svg_width, svg_height, svg_id);
      break;
    case 4:
      updateGraphHeader(_2022_decline_title);
      loadGraphDescription(_2022_decline_paragraph);
      init_2022decline_timeline(svg_width, svg_height, svg_id);
      break;
    case 5:
      updateGraphHeader(_last_10_years_title);
      loadGraphDescription(_last_10_years_paragraph);
      init_full_timeline(svg_width, svg_height, svg_id);
      break;
  }
}
