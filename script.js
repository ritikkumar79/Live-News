const API_KEY = "024552bb93cca4c4af3fbfd7777fdce0";
const url = "https://gnews.io/api/v4/search?q=";

window.addEventListener('load', () => fetchNews("World"));

const loadingScreen = document.getElementById("loading-screen");

// Display loading screen
loadingScreen.style.display = "flex";

function scrolling() {
    const cardContainer = document.querySelector('.card-container');
    const cardPosition = cardContainer.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (cardPosition < screenPosition) {
        cardContainer.classList.add('card-container-change');
    }
}

window.addEventListener('scroll', scrolling);

async function fetchNews(query) {
    const gNewsURL = `${url}${encodeURIComponent(query)}&lang=en&country=us&max=10&apikey=${API_KEY}`;
    try {
        const response = await fetch(gNewsURL);
        const data = await response.json();
        const sortedArticles = data.articles.sort(
            (newest, oldest) =>
                new Date(oldest.publishedAt) - new Date(newest.publishedAt)
        );
        bindData(sortedArticles);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        // Hide loading screen after data is fetched (success or error)
        loadingScreen.style.display = "none";
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("card-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        if (!article.image) return; // Use 'image' for GNews
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillData(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillData(cardClone, article) {
    const newImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newImg.src = article.image; // Use 'image' for GNews
    newsTitle.innerHTML = article.title;
    newsDesc.textContent = article.description;

    const date = new Date(article.publishedAt).toLocaleString('en-US', {
        timeZone: "Asia/Jakarta"
    });
    newsSource.innerHTML = `${article.source.name} -- ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    removeSearch();
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
    scrollTop();
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () => {
    const query = searchText.value.trim(); // Trim whitespace from the query
    if (query) {
        fetchNews(query);
        curSelectedNav?.classList.remove('active');
        curSelectedNav = null;
        scrollTop();
    }
});

function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function removeSearch() {
    searchText.value = ""; // Clear the search input field
}

searchText.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const query = searchText.value.trim(); // Trim whitespace from the query
        if (query) {
            removeSearch(); // Clear previous search results
            fetchNews(query);
            scrollTop();
        }
    }
});

const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", toggleDarkMode);

let isDarkMode = false;

function toggleDarkMode() {
    isDarkMode = !isDarkMode; // Toggle the state

    document.documentElement.style.setProperty("--background-color", isDarkMode ? "var(--background-color-dark)" : "var(--background-color-light)");
    document.documentElement.style.setProperty("--text-color", isDarkMode ? "var(--text-color-dark)" : "var(--text-color-light)");
    document.documentElement.style.setProperty("--secondary-text-color", isDarkMode ? "var(--secondary-text-color-dark)" : "var(--secondary-text-color-light)");

    document.body.classList.toggle("dark-mode", isDarkMode);
}

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
