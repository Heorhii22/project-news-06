import { galleryFetch } from './galley-news-fetch';
import { galleryFetchPopular } from './galley-news-fetch';

const searchForm = document.querySelector(".search-form");
const newsGalleryLnk = document.querySelector(".news-gallery");

let currentPage = 1;
let currentHits = 0;
let globalSearchQuery = '';

searchForm.addEventListener('submit', onSearchBtn);
onLoadNewsPage();

async function onLoadNewsPage() { 
  try { 
    newsGalleryLnk.innerHTML = '';
    const dataResponse = await galleryFetchPopular(currentPage);
    console.log(dataResponse.data.results);
  }
  catch (e) { 
    console.log(e.message);
  }
}

function onSearchBtn(e) { 
    e.preventDefault();
    let currentPage = 1;
    //let currentHits = 0;
    newsGalleryLnk.innerHTML = '';
    
    const {
    elements: { search_input },
  } = e.currentTarget;

    globalSearchQuery = search_input.value.trim();
    
    if (globalSearchQuery.length === 0) return;
    //console.log(globalSearchQuery);

    operateDataBackEnd(globalSearchQuery, currentPage);
}

async function operateDataBackEnd(searchQuery, searchPage) { 
  try { 
    const data = await galleryFetch(searchQuery, searchPage);
    await renderData(data);
  }
  catch (e) { 
   console.log(e.message);
  }
}

async function renderData(dataResponse) { 
   console.log(dataResponse);  
  const articles = dataResponse.docs;
  console.log(articles);

  newsGalleryLnk.innerHTML = '';
  if (articles.length === 0) return;
  try { 
    const galleryMurkup = await readDataArrayToMarcup(articles);
    newsGalleryLnk.insertAdjacentHTML('beforeend', galleryMurkup);
  }
  catch (e) { 
    console.log(e.message);
  }
}


async function readDataArrayToMarcup(articlesArray) {
  return await articlesArray.map(({ abstract, headline, keywords, multimedia, pub_date, snippet, web_url }) => { 
    const firstImageUrl = multimedia.map((url) => { return url; });
    //console.log("AA", articlesArray.then((test) => test.multimedia[0].url));

    //console.log(firstImageUrl);
    const imageURL = "./src/images/mob/not-found-m.png";//multimedia[0];
    //console.log('articlesArray[0].multimedia[0].url ', articlesArray[0].multimedia[0].url);
    //if (multimedia.length !== 0) imagwURL = articlesArray[0].multimedia[0].url;//firstImageUrl;
    
    //console.log(keywords);
    //console.log(headline);
    const keywordsMap = keywords.map(({ value }) => { return value; }).join(', ');
    //console.log(keywordsMap);
    return `
    <div class="news-gallery__item">
    <a class="news-gallery__image" href="${web_url}">
    <div class="news-gallery__img-container"><img src="${imageURL}" 
    alt="${keywordsMap}" loading="lazy"/></div>
    </a>
    <div class="news-gallery__info">
      <p class="news-gallery__header">${headline.main}</p>
      <p class="news-gallery__abstract">${abstract}</p>
      <p class="news-gallery__pub_data">${pub_date}</p>
      <!--p class="news-gallery__snippet">${snippet}</p-->
    </div>
    <a class="news-gallery__read-more" href="${web_url}">Read more...</a>
    </div>
    `; 
  }).join('');
}


/*
const key = "E0X3jomXcp5AQytChJb6iragE7Tjdw0j";
const api = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
function fetchNews(keyword) {
  return fetch(`${api}q=${keyword}&api-key=${key}`)
    .then((resolve) => {
      return resolve.json();
    })
    .then((news) =>
      console.log(
        "http://www.nytimes.com/" + news.response.docs[0].multimedia[0].url
      )
    );
}
fetchNews("cat");
*/

/*
https://github.com/nytimes/public_api_specs/issues/52
*/