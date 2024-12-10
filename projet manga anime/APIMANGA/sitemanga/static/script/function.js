function toggleAnswer(questionElement) {
    const answer = questionElement.querySelector('.answer');
    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
}


document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        question.querySelector('.answer').style.display = 'none';
    });

    const articleCountSpan = document.getElementById('article-count');
    const articles = document.querySelectorAll('.articles');
    articleCountSpan.textContent = `${articles.length} Articles`;
});


function sortArticles() {
    const select = document.getElementById('sort-select');
    const articles = Array.from(document.querySelectorAll('.articles'));
    const listDiv = document.getElementById('listDiv');
    const sortOption = select.value;

    switch (sortOption) {
        case 'alpha-asc':
            articles.sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
            break;
        case 'alpha-desc':
            articles.sort((a, b) => b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent));
            break;
    }

    listDiv.innerHTML = '';
    articles.forEach(article => listDiv.appendChild(article));
}


function searchAnime() {
    const query = document.getElementById('searchInput').value.trim();
    if (query === "") return;

    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('listDiv');
            
            while (searchResults.firstChild) {
                searchResults.removeChild(searchResults.firstChild);
            }
            
            if (data.data && data.data.length > 0) {
                data.data.forEach(anime => {
                    const animeDiv = document.createElement('div');
                    animeDiv.className = 'articles';

                    animeDiv.innerHTML = `
                        <img src="${anime.images.jpg.image_url}" id="imgg" alt="Anime Image">
                        <h3 class="title">${anime.title}</h3>
                        <span class="price">Score: ${anime.score ?? "Non Noté"}</span>
                        <span class="category">${anime.type}</span>
                    `;

                    searchResults.appendChild(animeDiv);
                });
            } else {
                searchResults.innerHTML = "<p>Aucun anime trouvé.</p>";
            }
        })
        .catch(error => console.error("Erreur lors de la recherche :", error));
}

function displaySearchResults(animeList) {
    const listDiv = document.getElementById('listDiv');
    listDiv.innerHTML = "";

    const displayedTitles = new Set(); 
    animeList.forEach(anime => {
        if (!displayedTitles.has(anime.title)) { 
            displayedTitles.add(anime.title); 

            const animeDiv = document.createElement('div');
            animeDiv.className = 'articles';

            animeDiv.innerHTML = `
                <img src="${anime.images.jpg.image_url}" id="imgg" alt="Anime Image">
                <h3 class="title">${anime.title}</h3>
                <span class="price">Score: ${anime.score ?? "Non Noté"}</span>
                <span class="category">${anime.type}</span>
            `;
            listDiv.appendChild(animeDiv);
        }
    });
}

function loadRecentPopularAnime() {
    const url = `https://api.jikan.moe/v4/top/anime?filter=airing&limit=8`; 
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                data.data.forEach(anime => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.style.backgroundImage = `url(${anime.images.jpg.large_image_url})`;
                    slide.style.backgroundSize = "cover";
                    slide.style.backgroundPosition = "center";

                    const truncatedDescription = truncateDescription(anime.synopsis, 150);

                    slide.innerHTML = `
                        <div class="info">
                            <h3>${anime.title}</h3>
                            <p>${truncatedDescription}</p>
                            <span>Score: ${anime.score ?? "Non noté"}</span>
                        </div>
                    `;

                });
                initializeSwiper();
            } else {
                swiperWrapper.innerHTML = "<p>Aucun anime en vogue trouvé.</p>";
            }
        })
        .catch(error => console.error("Erreur lors du chargement des animes :", error));
}


document.addEventListener('DOMContentLoaded', loadRecentPopularAnime);

function truncateDescription(description, maxLength) {
    if (!description) return "Pas de description disponible.";
    return description.length > maxLength
        ? description.substring(0, maxLength) + "..."
        : description;
}

function initializeSwiper() {
    new Swiper('.swiper-container', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
        },
    });
}

