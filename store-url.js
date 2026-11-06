// This constant is the only listing address. Each Add to Chrome link repeats it
// in href so the control stays a real link when this script does not run.
const CHROME_WEB_STORE_URL = "https://chromewebstore.google.com/detail/elevatorunits-florida-ele/elldjehfjggnfpdfcalmachhheapldoo";

function applyStoreUrl() {
  const links = document.querySelectorAll("a[data-store-url]");
  for (const link of links) {
    link.setAttribute("href", CHROME_WEB_STORE_URL);
  }
}

applyStoreUrl();
