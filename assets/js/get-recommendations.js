/**
 * @typedef {{
 *  id?: number,
 *  name: string;
 *  imageUrl: string;
 *  description: string
 *  timezone?: string
 * }} Place
 *
 * /
 
/** 
 * @typedef {{
 *  id:number
 *  name:string
 *  cities:Array<Place>
 * }} Countries
 * 
 * @typedef {Place} Place
 * 
 * @typedef {{
 *  beaches: Array<Place>,
 *  countries: Array<Countries>,
 *  temples: Array<Place>,
 * }} RecommendationResponse
 * 
 * 
 */

let cache = null;

/**
 *
 * @returns {Promise<RecommendationResponse>}
 */
async function loader() {
  if (cache) return cache;

  return fetch("api/travel_recommendation_api.json")
    .then((res) => res.json())
    .then((data) => {
      cache = data;
      return data;
    });
}

/**
 *
 * @param {string} str
 * @param {RecommendationResponse} response
 * @returns {""}
 */
function isKeyword(str, response) {
  str = str.toLowerCase();

  switch (str) {
    case "beach":
    case "beaches":
      return response.beaches;
    case "temple":
    case "temples":
      return response.temples;

    case "country":
    case "countries":
      return response.countries;
    default:
      return []
        .concat(
          response.beaches,
          response.temples,
          response.countries.map((country) => country.cities).flat()
        )
        .filter((place) => {
          return place.name.toLowerCase().includes(str);
        });
  }
}

/**
 *
 * @param {string} search
 * @returns {Promise<List<Place>>}
 */
export default async function getRecommendations(search) {
  const response = await loader();
  return isKeyword(search, response);
}
