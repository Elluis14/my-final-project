const gamesContainer = document.querySelector("#games");
const form = document.querySelector("#searchForm");
const input = document.querySelector("#searchInput");
const statusText = document.querySelector("#status");

const DEFAULT_SEARCH = "popular";

form.addEventListener("submit", e => {
  e.preventDefault();
  searchGames(input.value);
});

window.addEventListener("load", () => {
  searchGames(DEFAULT_SEARCH);
  loadFavorites();
});

async function searchGames(query) {
  statusText.textContent = `Results for "${query}"`;
  gamesContainer.innerHTML = "<p>Loading games...</p>";

  const response = await fetch(
    `https://www.cheapshark.com/api/1.0/games?title=${query}&limit=10`
  );

  const games = await response.json();
  displayGames(games);
}

function displayGames(games) {
  gamesContainer.innerHTML = "";

  games.forEach(game => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${game.external}</h3>
      <img src="${game.thumb}" alt="${game.external}">
      <p class="price">$${game.cheapest}</p>
      <button>Watch</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      saveGame(game);
    });

    gamesContainer.appendChild(card);
  });
}

function saveGame(game) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.push({
    id: game.gameID,
    title: game.external,
    price: game.cheapest,
    savedAt: new Date().toLocaleString()
  });

  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Game saved for price tracking!");
}

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.length > 0) {
    console.log("Saved games loaded from localStorage", favorites);
  }
}
