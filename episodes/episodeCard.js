export function episodeCard(episodes) {
  const gallerySeries = document.getElementById("gallerySeries");
  gallerySeries.innerHTML = "";

  const episodeCard = document.createElement("ul");
  episodes.forEach((episode) => {
    const episodeCardItem = document.createElement("li");

    //Episode Name
    const nameEpisode = document.createElement("h3");
    nameEpisode.innerText = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeCardItem.appendChild(nameEpisode);

    //Episode Img
    const episodeImg = document.createElement("img");
    episodeImg.src = episode.image.medium;
    episodeImg.alt = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeCardItem.appendChild(episodeImg);

    //Episode summary
    const episodeSummary = document.createElement("div");
    episodeSummary.className = "summary";

    if (episode.summary.length > 150) {
      episodeSummary.innerHTML = `${episode.summary.substring(0, 150)}...`;
    } else {
      episodeSummary.innerHTML = `${episode.summary.substring(0, 150)}`;
    }
    episodeCardItem.appendChild(episodeSummary);

    episodeCard.appendChild(episodeCardItem);
  });

  gallerySeries.appendChild(episodeCard);
}
