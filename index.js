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

function updateDatePicker(slide_id) {
  const startInput = document.getElementById("inputStartDate");
  const endInput = document.getElementById("inputEndDate");
  switch (slide_id) {
    case 1:
      startInput.value = _2016_selloff_graphStart;
      startInput.min = _2016_selloff_graphStart;
      startInput.max = _2016_selloff_graphEnd;
      endInput.value = _2016_selloff_graphEnd;
      endInput.min = _2016_selloff_graphStart;
      endInput.max = _2016_selloff_graphEnd;
      break;
    case 2:
      startInput.value = _2018_crypto_bubble_graphStart;
      startInput.min = _2018_crypto_bubble_graphStart;
      startInput.max = _2018_crypto_bubble_graphEnd;
      endInput.value = _2018_crypto_bubble_graphEnd;
      endInput.min = _2018_crypto_bubble_graphStart;
      endInput.max = _2018_crypto_bubble_graphEnd;
      break;
    case 3:
      startInput.value = _2020_covid_graphStart;
      startInput.min = _2020_covid_graphStart;
      startInput.max = _2020_covid_graphEnd;
      endInput.value = _2020_covid_graphEnd;
      endInput.min = _2020_covid_graphStart;
      endInput.max = _2020_covid_graphEnd;
      break;
    case 4:
      startInput.value = _2022_decline_graphStart;
      startInput.min = _2022_decline_graphStart;
      startInput.max = _2022_decline_graphEnd;
      endInput.value = _2022_decline_graphEnd;
      endInput.min = _2022_decline_graphStart;
      endInput.max = _2022_decline_graphEnd;
      break;
    case 5:
      startInput.value = _last_10_years_graphStart;
      startInput.min = _last_10_years_graphStart;
      startInput.max = _last_10_years_graphEnd;
      endInput.value = _last_10_years_graphEnd;
      endInput.min = _last_10_years_graphStart;
      endInput.max = _last_10_years_graphEnd;
      break;
  }
}

let current_slide = 1;

function updateChart(svg_id, slide_id) {
  console.log(`Updating chart to slide ${slide_id}`);
  if (slide_id != 6) {
    current_slide = slide_id;
  }
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
    case 6:
      init_custom_timeline(svg_width, svg_height, svg_id);
      break;
  }
  if (slide_id !== 6) {
    updateDatePicker(slide_id);
  }
}

function getLastDayOfMonth(yyyy, mm) {
  // Use the following month and day 0 to get the last day of the given month
  const nextMonth = parseInt(mm, 10) + 1;
  const lastDayOfMonth = new Date(yyyy, nextMonth, 0).getDate();
  return lastDayOfMonth;
}

function convertToYYYYMMDDLastDay(yyyy_mm) {
  const [year, month] = yyyy_mm.split("-");
  const lastDay = getLastDayOfMonth(year, month);
  return `${yyyy_mm}-${lastDay.toString().padStart(2, "0")}`;
}
