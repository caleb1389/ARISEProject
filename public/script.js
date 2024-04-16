let data = [];

function countObjectKeys(object){
    let length = 0;

    for (let key in object){
        if (object.hasOwnProperty(key))
            length++;
    }

    return length;
}

async function fetchAnimeData() {
  let responseNow = await fetch(`https://api.jikan.moe/v4/seasons/now`);
  let responseTop = await fetch(`https://api.jikan.moe/v4/top/anime`);

  let resultNow = await responseNow.json();
  let resultTop = await responseTop.json();

  let dataNow = resultNow.data;
  let dataTop = resultTop.data;

  data = dataNow.concat(dataTop);
  displayAnimeData();
}

function displayAnimeData(){
    let popularCount = 0;
    let newCount = 0;
    let oldCount = 0;

      for (let item of data){
        let genreCount = (countObjectKeys(`${item.genres}`) + 1) / 16;

        let rating = `${item.score}`;

        if (rating >= 9 && popularCount < 10){
           displayHomePageAnime(item, genreCount, 'Popular')
            popularCount++;
        }

        let year = `${item.year}`;

        let newYear = 2024;

        if (year >= newYear && newCount < 10){
           displayHomePageAnime(item, genreCount, 'New')
            newCount++;
        }

        let oldYear = 2012;

        if (year < oldYear && oldCount < 10){
            displayHomePageAnime(item, genreCount, 'Old-School')
            oldCount++;
        }

      }
}
function displayHomePageAnime(item, genreCount, category){
const listing = document.querySelector(`.${category.toLowerCase()}-content`);

    let genres = '';
    for (let i = 0; i < genreCount; i++) {
        genres += `${item.genres[i].name}${i < genreCount - 1 ? ', ' : ''}`;
    }

    listing.innerHTML += `
        <span class="anime-card">
            <a href="#description" onclick="displayAnimeDetail(${item.mal_id})">
                <h4>${item.title}</h4>
                <div>
                    <img src="${item.images.jpg.image_url}" class="anime-img">
                </div>
                <p>Genre(s): ${genres}</p>
                <p>Year: ${item.year}</p>
                <p>Episodes: ${item.episodes}</p>
            </a>
        </span>
    `;
}

function showHomePage(){
    let home = document.querySelector("#home-page");
    home.style.display = 'block';

    let genrePage = document.querySelector("#genre-page");
    genrePage.style.display = 'none';

    let searchResult = document.querySelector("#search-result");
    searchResult.style.display = 'none';

    let description = document.querySelector("#description");
    description.style.display = 'none';

    let listing1 = document.querySelector('.popular-content');
    listing1.innerHTML = '';

    let listing2 = document.querySelector('.new-content');
    listing2.innerHTML = '';

    let listing3 = document.querySelector('.old-school-content');
    listing3.innerHTML = '';

    fetchAnimeData();
}

showHomePage()

function showGenrePage(category){
    let home = document.querySelector("#home-page");
    home.style.display = 'none';

    let genrePage = document.querySelector("#genre-page");
    genrePage.style.display = 'block';

    let searchResult = document.querySelector("#search-result");
    searchResult.style.display = 'none';

    let description = document.querySelector("#description");
    description.style.display = 'none';

    let listing = document.querySelector('#anime-list');
    listing.innerHTML = '';

    showAnimeList(category);
}

function showAnimeList(category) {
    let listing = document.querySelector('#anime-list');
    listing.innerHTML = ''; // Clear previous content

    listing.innerHTML += `<div>
                              <h2>${category}</h2>
                          </div>`;

    for (let item of data) {
        let genreCount = item.genres.length;

        if (category === "Popular") {
            let rating = item.score;

            if (rating >= 9)
                showListItem(item, genreCount);
        } else if (category === "New") {
            let newYear = 2024;
            let year = item.year;

            if (year >= newYear)
                showListItem(item, genreCount);
        } else if (category === "Old School") {
            let oldYear = 2012;
            let year = item.year;

            if (year < oldYear)
                showListItem(item, genreCount);
        } 
        else {
            for (let i = 0; i < genreCount; i++) {
                let genre = item.genres[i].name;

                if (genre === category)
                    showListItem(item, genreCount);
            }
        }
    }
}

function showListItem(item, genreCount) {
    let listing = document.querySelector('#anime-list');

    let genres = '';
    for (let i = 0; i < genreCount; i++) {
        genres += `${item.genres[i].name}${i < genreCount - 1 ? ', ' : ''}`;
    }

    listing.innerHTML += `
        <div>
            <a href="#description" onclick="displayAnimeDetail(${item.mal_id})">
                <div class="anime-box">
                    <div id="anime-list-image">
                        <img src="${item.images.jpg.image_url}" class="anime-img">
                    </div>
                    <div>
                        <h4>${item.title}</h4>
                        <p>Description: ${item.synopsis}</p>
                        <p>Genre(s): ${genres}</p>
                        <p>Year: ${item.year}</p>
                        <p>Rating: ${item.score} / 10</p>
                    </div>
                </div>
            </a>
        </div>
    `;
}

function searchAnimeTitle(){
    let home = document.querySelector("#home-page");
    home.style.display = 'none';

    let genrePage = document.querySelector("#genre-page");
    genrePage.style.display = 'none';

    let searchResult = document.querySelector("#search-result");
    searchResult.style.display = 'block';

    let description = document.querySelector("#description");
    description.style.display = 'none';

    let listing = document.querySelector('#search-result');
    listing.innerHTML = '';

    showSearchResult();
}

function showSearchResult(){
    let searchInput = document.querySelector("#search-movie").value;
    let found = 'false';

    let listing = document.querySelector('#search-result');
    listing.innerHTML += ` <div>
                            <h2>Results for: ${searchInput}</h2>
                          </div>`;

    for (let item of data){
        let genreCount = (countObjectKeys(`${item.genres}`) + 1) / 16;

        let anime = `${item.title}`.toLowerCase();
        searchInput = searchInput.toLowerCase();
        if (anime.search(searchInput) !== -1){
          displaySearchResult(item, genreCount);
          found = 'true';
        }
    }

    if (found == 'false'){
        listing.innerHTML += `<div>
                              <h2>No Results found</h2>
                            </div>`;
    }
}

function displaySearchResult(item, genreCount) {
    let listing = document.querySelector('#search-result');

    let genres = '';
    for (let i = 0; i < genreCount; i++) {
        genres += `${item.genres[i].name}${i < genreCount - 1 ? ', ' : ''}`;
    }

    listing.innerHTML += `
        <div>
            <a href="#description" onclick="displayAnimeDetail(${item.mal_id})">
                <div class="anime-box">
                    <div id="anime-list-image">
                        <img src="${item.images.jpg.image_url}" class="anime-img">
                    </div>
                    <div>
                        <h4>${item.title}</h4>
                        <p>Description: ${item.synopsis}</p>
                        <p>Genre(s): ${genres}</p>
                        <p>Year: ${item.year}</p>
                        <p>Rating: ${item.score} / 10</p>
                    </div>
                </div>
            </a>
        </div>
    `;
}

function searchAnimeByID(id){
    let found = 'false';

    for (let item of data){
        let genreCount = (countObjectKeys(`${item.genres}`) + 1) / 16;

        let currId = `${item.mal_id}`;
        if (id == currId){
            displayAnimeInfo(item, genreCount);
            found = 'true';
        }
    }

    if (found == 'false'){
        displayAnimeInfo(-1, 0);
    }
}

function displayAnimeDetail(id){
    let home = document.querySelector("#home-page");
    home.style.display = 'none';

    let genrePage = document.querySelector("#genre-page");
    genrePage.style.display = 'none';

    let searchResult = document.querySelector("#search-result");
    searchResult.style.display = 'none';

    let description = document.querySelector("#description");
    description.style.display = 'block';

    let listing = document.querySelector('#description');
    listing.innerHTML = '';

    searchAnimeByID(id);
}

function displayAnimeInfo(item, genreCount) {
    let listing = document.querySelector('#description');

    let genres = '';
    for (let i = 0; i < genreCount; i++) {
        genres += `${item.genres[i].name}${i < genreCount - 1 ? ', ' : ''}`;
    }

    listing.innerHTML += `
        <div>
            <h2>${item.title}</h2>
        </div>
        <div class="anime-description">
            <div id="anime-info-image">
                <img src="${item.images.jpg.image_url}">
            </div>
            <div>
                <p>Description: ${item.synopsis}</p>
            </div>
        </div>
        <div class="anime-info">
            <p>Genres: ${genres}</p>
            <p>Year: ${item.year}</p>
            <p>Episodes: ${item.episodes}</p>
            <p>Duration: ${item.duration}</p>
            <p>Rating: ${item.score}</p>
            <p>Rated: ${item.rating}</p>
        </div>
    `;
}
