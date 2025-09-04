import getRecommendations from "../get-recommendations.js";

export default async function HomePage(app) {
  const recommendationList = document.getElementById("recommendation-list");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const clearButton = document.getElementById("clear-button");
  const exploreButton = document.getElementById("explore-button");

  searchInput.addEventListener("input", () => {
    clearButton.disabled = !searchInput.value;
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    clearButton.disabled = true;
    recommendationList.innerHTML = "";
  });

  searchButton.addEventListener("click", onSearch);
  exploreButton.addEventListener("click", onSearch);

  ///////////////////////////
  /// Functions
  //////////////////////////

  function setLoading(isLoading) {
    if (isLoading) {
      searchButton.disabled = true;
      searchButton.textContent = "Loading...";
    } else {
      searchButton.disabled = false;
      searchButton.textContent = "Search";
    }
  }

  // Search recommendations
  async function onSearch() {
    const value = searchInput.value;

    setLoading(true);
    getRecommendations(value)
      .then(onRenderRecommendations)
      .finally(() => setLoading(false));
  }

  /**
   *
   * @param {import("../modules/get-recommendations.js").Place[]} recommendations
   */
  function onRenderRecommendations(recommendations) {
    recommendationList.innerHTML = "";

    recommendations.forEach((place, index) => {
      recommendationList.appendChild(
        place.cities
          ? renderCountries(place)
          : recommendationCard(place, index * 50)
      );
    });
  }
}

///////////////////
/// Templates
///////////////////

/**
 * @param {import("../get-recommendations").Countries} param0
 * @returns
 */
function renderCountries({ name, id, cities }, delay = 0) {
  const container = document.createElement("div");
  container.className = "country-container-cities grid grid-cols-2 gap-4";

  cities.forEach((city) => {
    container.appendChild(recommendationCard(city));
  });

  const section = document.createElement("section");
  section.className = "country-section";
  section.style.cssText = `--delay: ${delay}ms; grid-column: 2 span;`;

  section.innerHTML = `
    <div class="country-info">
      <h2 class="country-name">${name}</h2>
    </div>
  `;

  section.appendChild(container);

  return section;
}

/**
 * @param {import("../get-recommendations").Place} param0
 * @returns
 */
export function recommendationCard(
  { name, description, imageUrl, timezone, images },
  delay = 0
) {
  let article = document.createElement("article");
  article.className = "recommendation-item flex flex-col from-bottom";
  article.style.cssText = `--delay: ${delay}ms`;

  const timeAgo = getTime(timezone);

  article.innerHTML = `
        <div class="recommendation-wrapper">
          ${ImageTemplate({ images: images || [imageUrl] })}

          <div class="recommendation-content">
            <div class="recommendation-hour flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                      viewBox="0 0 24 24">
                      <path fill="#4d4d4d" fill-rule="evenodd"
                          d="M12 2.75a9.25 9.25 0 1 0 0 18.5a9.25 9.25 0 0 0 0-18.5M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12S17.937 22.75 12 22.75S1.25 17.937 1.25 12M12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75"
                          clip-rule="evenodd" />
                  </svg>
                  <span class="recommendation-time font-medium">${timeAgo}</span>
              </div>
              <h3 class="recommendation-title">${name}</h3>
                ${
                  description
                    ? `<p class="recommendation-description">
                                ${description}
                            </p>`
                    : ""
                }

              <div class="recommendation-footer w-full flex items-center  justify-between" >
                  <button class="button secondary recommendation-button">
                      View Details
                  </button>
              </div>
              
          </div>
        <div/>
    `;

  article.querySelector("button").addEventListener("click", function (event) {
    event.preventDefault();

    if (article.classList.contains("expanded")) {
      article.classList.remove("expanded");
      this.textContent = "View Details";
    } else {
      this.textContent = "Hide Details";
      article.classList.add("expanded");
    }
  });

  return article;
}

/////////////////////////
/// Utility
/////////////////////////

function getTime(timezone) {
  const options = {
    timeZone: timezone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return new Date().toLocaleDateString("en-US", options);
}

function ImageTemplate({ images }) {
  return `
    <div class="image-gallery recommendation-image">
      ${images
        .map(
          (img) =>
            `<img src="./assets/images/${img}" alt="Recommendation Image" class="gallery-image">`
        )
        .join("")}
    </div>
  `;
}
