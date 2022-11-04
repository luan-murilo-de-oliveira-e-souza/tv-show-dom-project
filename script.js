//You can edit ALL of the code here
import { episodeCard } from "./episodes/episodeCard.js";

const allEpisodes = getAllEpisodes();
const optionListEpisode = document.getElementById("optionListEpisode");

//Create Gallery
function setup() {
  buildGallery(allEpisodes);
}

function buildGallery(ListAllEpisodes) {
  episodeCard(ListAllEpisodes);

  const searchWordInGallery = document.getElementById("searchWordInGallery");
  searchWordInGallery.addEventListener("input", (event) => {
    const searchWord = event.target.value;
    const filteredEpisodeByWord = ListAllEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchWord.toLowerCase()) ||
        episode.summary.toLowerCase().includes(searchWord.toLowerCase())
    );

    episodeCard(filteredEpisodeByWord);
  });
}

//Select Episode on List
SelectEpisodeOnList();

function SelectEpisodeOnList() {
  const allEpisodes = getAllEpisodes();

  allEpisodes.forEach((episode) => {
    const selectEpisode = document.createElement("option");
    selectEpisode.innerText = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
      episode.name
    }`;
    optionListEpisode.appendChild(selectEpisode);
  });
  optionListEpisode.addEventListener("change", () => {
    const nameSelectEpisode = optionListEpisode.value.slice(9);
    let chosenEpisode = allEpisodes.filter(
      (episode) => episode.name === nameSelectEpisode
    );
    if (!nameSelectEpisode) {
      chosenEpisode = allEpisodes;
    }
    const searchWordInGallery = document.getElementById("searchWordInGallery");
    searchWordInGallery.value = "";
    episodeCard(chosenEpisode);
  });
}

//Button action
document.getElementById("showAllEpisodes").onclick = function () {
  searchWordInGallery.value = "";
  buildGallery(allEpisodes);
};

window.onload = setup;
