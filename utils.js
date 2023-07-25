function updateGraphHeader(text) {
  const h2Element = document.getElementById("chart-header");
  if (h2Element) {
    h2Element.textContent = text;
  }
}
