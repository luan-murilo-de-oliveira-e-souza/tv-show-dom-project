import { fetchEpisodeLive } from "../script.js";

const optionListSerie = document.getElementById("optionListSerie");

export function episodeCard(episodes) {
  const gallerySeries = document.getElementById("gallerySeries");
  //Clear the gallery
  gallerySeries.innerHTML = "";

  const episodeCard = document.createElement("ul");
  episodes.forEach((episode) => {
    const episodeCardItem = document.createElement("li");
    const nameEpisode = document.createElement("h3");

    //Get series list text
    const textSelect =
      optionListSerie.options[optionListSerie.selectedIndex].text;

    //Compares if the list of series is equal to "All series",
    //if it is it will create a series type card, if not it will be an episode type card
    if (textSelect == "All Series") {
      //Series
      //Series Name
      nameEpisode.innerText = episode.name;
      episodeCardItem.appendChild(nameEpisode);

      //Series Img
      if (episode.image && episode.image.medium) {
        const episodeImg = document.createElement("img");
        episodeImg.src = episode.image.medium;
        episodeImg.alt = episode.name;
        episodeCardItem.appendChild(episodeImg);
      }

      // Series Show rate
      const showRate = document.createElement("h5");
      showRate.className = "showRate";
      showRate.innerHTML = `Rate: ${episode.rating.average}`;
      episodeCardItem.appendChild(showRate);

      // Series Status
      const showStatus = document.createElement("div");
      showStatus.className = "showStatus";
      showStatus.innerHTML = `Status: ${episode.status}`;
      episodeCardItem.appendChild(showStatus);

      // Series Genres
      const showGenres = document.createElement("div");
      showGenres.className = "showGenres";
      showGenres.innerHTML = `Genres: ${episode.genres}`;
      episodeCardItem.appendChild(showGenres);

      // Series Runtime
      const showRunTime = document.createElement("div");
      showRunTime.className = "showRunTime";
      showRunTime.innerHTML = `Runtime: ${episode.runtime}`;
      episodeCardItem.appendChild(showRunTime);

      //Open Link
      episodeCardItem.addEventListener("click", function () {
        const text = episode.name;
        const $select = document.getElementById("optionListSerie");
        const $options = Array.from($select.options);
        const optionToSelect = $options.find((item) => item.text === text);
        optionToSelect.selected = true;
        fetchEpisodeLive(episode.id);
      });
    } else {
      //Episodes
      if (episode.season && episode.number && episode.name) {
        nameEpisode.innerText = `${episode.name} - S${episode.season
          .toString()
          .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
        episodeCardItem.appendChild(nameEpisode);
      }

      //Episode Img
      if (episode.image && episode.image.medium) {
        const episodeImg = document.createElement("img");
        episodeImg.src = episode.image.medium;

        episodeImg.alt = `${episode.name} - S${episode.season
          .toString()
          .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

        episodeCardItem.appendChild(episodeImg);
      }

      //Create link to website
      episodeCardItem.addEventListener("click", function () {
        if (episode.url) {
          window.location.assign(episode.url);
        }
      });
    }

    //Episode summary
    const episodeSummary = document.createElement("div");
    episodeSummary.className = "summary";

    if (episode.summary) {
      if (episode.summary.length > 150) {
        episodeSummary.innerHTML = `${episode.summary.substring(0, 150)}...`;
      } else {
        episodeSummary.innerHTML = `${episode.summary.substring(0, 150)}`;
      }
      episodeCardItem.appendChild(episodeSummary);
    }

    // //Open Link
    // episodeCardItem.addEventListener("click", function () {
    //   if (episode.url) {
    //     window.location.assign(episode.url);
    //   }
    // });

    episodeCard.appendChild(episodeCardItem);
  });

  gallerySeries.appendChild(episodeCard);
}
