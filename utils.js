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