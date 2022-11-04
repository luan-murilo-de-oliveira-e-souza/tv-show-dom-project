//You can edit ALL of the code here
import { episodeCard } from "./episodes/episodeCard.js";

function setup() {
  const allEpisodes = getAllEpisodes();
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

window.onload = setup;
