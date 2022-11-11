//You can edit ALL of the code here
import { episodeCard } from "./episodes/episodeCard.js";
import { getAllShows } from "./shows.js";

const errorMessage = document.getElementById("errorMessage");
const episodeDisplaying = document.getElementById("episodeDisplaying");
episodeDisplaying.className = "display";
const optionListSerie = document.getElementById("optionListSerie");
const optionListEpisode = document.getElementById("optionListEpisode");
let allEpisodes = [];
let episodeOrSerie = "";

const allSeriesOrEpisodes = getAllShows().sort((a, b) =>
  a.name.localeCompare(b.name)
);

//fetchEpisodeLive(1195);

window.onload = setup(allSeriesOrEpisodes);

//Setup all functions
function setup(allSeriesOrEpisodes) {
  //console.log(allSeriesOrEpisodes);
  buildGalleryInitial(allSeriesOrEpisodes);
  searchEpisodeByWord(allSeriesOrEpisodes);
  selectSerieOnList(allSeriesOrEpisodes);
  selectEpisodeOnList(allSeriesOrEpisodes);
  episodeDisplaying.innerHTML = `Displaying: ${allSeriesOrEpisodes.length} episodes`;
}

//Create Gallery Initial
function buildGalleryInitial(ListAllSeries) {
  if (ListAllSeries.length > 0) {
    episodeCard(ListAllSeries);
  } else {
    searchWordInGallery.value = "";
    episodeDisplaying.innerHTML = `Displaying: 0 episodes`;
  }
}

//Search episode by word
function searchEpisodeByWord(ListAllEpisodes) {
  const searchWordInGallery = document.getElementById("searchWordInGallery");
  searchWordInGallery.addEventListener("input", (event) => {
    const searchWord = event.target.value;
    const filteredEpisodeByWord = ListAllEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchWord.toLowerCase()) ||
        episode.summary.toLowerCase().includes(searchWord.toLowerCase())
    );
    episodeCard(filteredEpisodeByWord);
    episodeDisplaying.innerHTML = `Displaying: ${filteredEpisodeByWord.length}/${ListAllEpisodes.length} episodes`;
  });
}

//Select serie from List
function selectSerieOnList(listOfSeries) {
  // console.log(listOfSeries);
  listOfSeries.sort((a, b) => a.name.localeCompare(b.name));
  listOfSeries.forEach((serie) => {
    const selectSerie = document.createElement("option");
    selectSerie.innerHTML = `${serie.name}`;
    selectSerie.value = serie.id;
    //console.log(serie.id);
    optionListSerie.appendChild(selectSerie);
  });
}

optionListSerie.addEventListener("change", FilterSelectSerie);

function FilterSelectSerie() {
  let valueSerie = optionListSerie.value;
  // console.log(valueSerie);
  fetchEpisodeLive(valueSerie);
}

//Select episode from List
function selectEpisodeOnList(ListAllEpisodes) {
  optionListEpisode.options.length = 0;

  const selectEpisode = document.createElement("option");
  selectEpisode.innerText = "All episodes";
  optionListEpisode.appendChild(selectEpisode);
  ListAllEpisodes.forEach((episode) => {
    const selectEpisode = document.createElement("option");
    selectEpisode.innerText = "All episodes";
    if (episode.season && episode.number && episode.name) {
      selectEpisode.innerText = `S${episode.season
        .toString()
        .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
        episode.name
      }`;

      console.log(selectEpisode.innerText);
      //selectEpisode.sort();
      optionListEpisode.appendChild(selectEpisode);
    }
  });
  optionListEpisode.addEventListener("change", () => {
    if (optionListEpisode.value == "All episodes") {
      searchWordInGallery.value = "";
      buildGallery(allEpisodes);
      episodeDisplaying.innerHTML = `Displaying: ${allEpisodes.length} episodes`;
    } else {
      const nameSelectEpisode = optionListEpisode.value.slice(9);
      const seasonSelectEpisode = Number(optionListEpisode.value.slice(1, 3));
      const numberSelectEpisode = Number(optionListEpisode.value.slice(4, 6));
      let chosenEpisode = ListAllEpisodes.filter(
        (episode) =>
          episode.name === nameSelectEpisode &&
          episode.season === seasonSelectEpisode &&
          episode.number === numberSelectEpisode
      );
      if (!nameSelectEpisode) {
        chosenEpisode = ListAllEpisodes;
      }
      const searchWordInGallery = document.getElementById(
        "searchWordInGallery"
      );
      searchWordInGallery.value = "";
      episodeCard(chosenEpisode);
      episodeDisplaying.innerHTML = `Displaying: ${chosenEpisode.length}/${ListAllEpisodes.length} episodes`;
    }
  });
}

//Get all data from JSON - Episodes
async function fetchEpisodeLive(SHOW_ID) {
  await fetch(`https://api.tvmaze.com/shows/${SHOW_ID}/episodes`)
    .then((response) => {
      if (response.status === 200) {
        errorMessage.style.display = "none";
        return response.json();
      } else {
        throw new Error("Not Found ...");
      }
    })
    .then((data) => {
      allEpisodes = data.map((episode) => {
        return { ...episode };
      });
      //setup();
      optionListEpisode.value = "value";
      console.log(allEpisodes);
      setup(allEpisodes);
    })
    .catch((error) => (errorMessage.style.display = "block"));
}

//Show all Episodes
document.getElementById("showAllEpisodes").onclick = function () {
  searchWordInGallery.value = "";
  optionListSerie.options.length = 1;
  optionListEpisode.options.length = 1;
  window.onload = setup(allSeriesOrEpisodes);
  episodeDisplaying.innerHTML = `Displaying: ${allEpisodes.length} episodes`;
};
