import { episodeCard } from "./episodes/episodeCard.js";
import { getAllShows } from "./shows.js";

//To Error
const errorMessage = document.getElementById("errorMessage");

//To Show Displaying
const serieOrEpisodeDisplaying = document.getElementById(
  "serieOrEpisodeDisplaying"
);
serieOrEpisodeDisplaying.className = "display";

//To Lists (Serie and Episode)
const optionListSerie = document.getElementById("optionListSerie");
const optionListEpisode = document.getElementById("optionListEpisode");

let allEpisodes = [];

//Sort series or Episodes by name
const allSeriesOrEpisodes = getAllShows().sort((a, b) =>
  a.name.localeCompare(b.name)
);

//When Load the page
window.onload = setup(allSeriesOrEpisodes);

//Setup all functions
function setup(allSeriesOrEpisodes) {
  buildGalleryInitial(allSeriesOrEpisodes);
  searchEpisodeByWord(allSeriesOrEpisodes);
  selectSerieOnList(allSeriesOrEpisodes);
  selectEpisodeOnList(allSeriesOrEpisodes);
  serieOrEpisodeDisplaying.innerHTML = `Displaying: ${allSeriesOrEpisodes.length} episodes`;
}

//Create Gallery Initial
function buildGalleryInitial(ListAllSeries) {
  if (ListAllSeries.length > 0) {
    episodeCard(ListAllSeries);
  } else {
    searchWordInGallery.value = "";
    serieOrEpisodeDisplaying.innerHTML = `Displaying: 0 series`;
  }
}

//Search episode by word
function searchEpisodeByWord(allSeriesOrEpisodes) {
  const searchWordInGallery = document.getElementById("searchWordInGallery");
  searchWordInGallery.addEventListener("input", (event) => {
    const searchWord = event.target.value;
    const filteredEpisodeByWord = allSeriesOrEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchWord.toLowerCase()) ||
        episode.summary.toLowerCase().includes(searchWord.toLowerCase())
    );
    if (
      optionListSerie.options[optionListSerie.selectedIndex].text ==
      "All Series"
    ) {
      filteredEpisodeByWord.sort((a, b) => a.name.localeCompare(b.name));
      episodeCard(filteredEpisodeByWord);
      serieOrEpisodeDisplaying.innerHTML = `Displaying: ${filteredEpisodeByWord.length}/${allSeriesOrEpisodes.length} episodes`;
    } else {
      filteredEpisodeByWord.sort((a, b) => {
        return a.id - b.id;
      });
      episodeCard(filteredEpisodeByWord);
      serieOrEpisodeDisplaying.innerHTML = `Displaying: ${filteredEpisodeByWord.length}/${allSeriesOrEpisodes.length} episodes`;
    }
  });
}

//Select serie from List
function selectSerieOnList(listOfSeries) {
  //Sort list by name
  listOfSeries.sort((a, b) => a.name.localeCompare(b.name));
  //Fill List with each serie
  listOfSeries.forEach((serie) => {
    const selectSerie = document.createElement("option");
    selectSerie.innerHTML = `${serie.name}`;
    selectSerie.value = serie.id;
    optionListSerie.appendChild(selectSerie);
  });
}

//When you select a item from list, the serie is called
optionListSerie.addEventListener("change", function FilterSelectSerie() {
  if (
    optionListSerie.options[optionListSerie.selectedIndex].text == "All Series"
  ) {
    searchWordInGallery.value = "";
    optionListSerie.options.length = 1;
    optionListEpisode.options.length = 1;
    allSeriesOrEpisodes.sort((a, b) => a.name.localeCompare(b.name));
    window.onload = setup(allSeriesOrEpisodes);
    serieOrEpisodeDisplaying.innerHTML = `Displaying: ${allSeriesOrEpisodes.length} episodes`;
  } else {
    // console.log(optionListSerie.options[optionListSerie.selectedIndex].text);
    searchWordInGallery.value = "";
    let valueSerie = optionListSerie.value;
    fetchEpisodeLive(valueSerie);
  }
});

//Select episode from List
function selectEpisodeOnList(ListAllEpisodes) {
  searchWordInGallery.value = "";
  optionListEpisode.options.length = 0;

  //Sort episode by ID, because will be add Serie and episode number on name of each episode
  ListAllEpisodes.sort((a, b) => {
    return a.id - b.id;
  });

  const selectEpisode = document.createElement("option");
  selectEpisode.innerText = "All episodes";
  optionListEpisode.appendChild(selectEpisode);
  ListAllEpisodes.forEach((episode) => {
    const selectEpisode = document.createElement("option");
    selectEpisode.innerText = "All episodes";

    //Check to know if it is a serie or episode
    if (episode.season && episode.number && episode.name) {
      selectEpisode.innerText = `S${episode.season
        .toString()
        .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
        episode.name
      }`;
      optionListEpisode.appendChild(selectEpisode);
    }
  });

  //Sort episodes by name
  //ListAllEpisodes.sort((a, b) => a.name.localeCompare(b.name));

  optionListEpisode.addEventListener("change", () => {
    if (optionListEpisode.value == "All episodes") {
      searchWordInGallery.value = "";
      buildGalleryInitial(allEpisodes);
      serieOrEpisodeDisplaying.innerHTML = `Displaying: ${allEpisodes.length} episodes`;
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
      serieOrEpisodeDisplaying.innerHTML = `Displaying: ${chosenEpisode.length}/${ListAllEpisodes.length} episodes`;
    }
  });
}

//Get all data from JSON - Episodes
export async function fetchEpisodeLive(SHOW_ID) {
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
      setup(allEpisodes);
    })
    .catch((error) => (errorMessage.style.display = "block"));
}

//Show all Episodes
document.getElementById("ClearSearch").onclick = function () {
  allSeriesOrEpisodes.sort((a, b) => a.name.localeCompare(b.name));
  searchWordInGallery.value = "";
  optionListSerie.options.length = 1;
  optionListEpisode.options.length = 1;
  window.onload = setup(allSeriesOrEpisodes);
  serieOrEpisodeDisplaying.innerHTML = `Displaying: ${allSeriesOrEpisodes.length} episodes`;
};
