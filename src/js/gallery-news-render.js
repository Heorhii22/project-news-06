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

    console.log("popular");
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
   //console.log(dataResponse);  
  const articles = dataResponse.docs;
   //console.log(articles);

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
  return await articlesArray.map(({ abstract, headline, keywords, multimedia, pub_date, web_url, section }) => { 
    const firstImageUrl = multimedia.map((url) => { return url; });
    //console.log("firstUrl", firstImageUrl[0].url);

    let imageURL = "https://www.nytimes.com/images/2015/03/14/arts/16iht-rartsquare-2/16iht-rartsquare-2-watch308.jpg"; //"./src/images/mob/not-found-m.png";
      if (multimedia.length !== 0) imageURL = "https://www.nytimes.com/" + firstImageUrl[0].url;//articlesArray[0].multimedia[0].url;//firstImageUrl;
    //console.log(web_url);
    //console.log(imageURL);
    const keywordsMap = keywords.map(({ value }) => { return value; }).join(', ');
    //console.log(keywordsMap);
    

    return `
    <div class="news-gallery__item">
    <a class="news-gallery__image" href="${web_url}">
    <div class="news-gallery__img-container"><img src="${imageURL}" 
    alt="${keywordsMap}" loading="lazy" /><p class="news-gallery__img-container-label">${section}</p></div>
    <button class="news-gallery__favorite-btn ><p clas="news-gallery__favorite-p"></p><svg class="news-gallery__favorite-svg" width="16" height="16"><use href="#icon-favorite"</svg></button>
    </a>
    <div class="news-gallery__wrap-reading"><span class="news-gallery__reading">Alredy read</span> <svg class="icon" width="18" height="18">
              <use href="#icon-check"></use>
            </svg></div>
            
    <div class="news-gallery__wrap-title">
      <p class="news-gallery__title">${headline.main}</p></div>
      <div class="news-gallery__wrap-text">
      <p class="news-gallery__text">${abstract}</p>
      </div>
      <div class="news-gallery__wrap">
      <p class="news-gallery__pub_data">${pub_date}</p
    <a class="news-gallery__read-more" href="${web_url}">Read more...</a>
    </div>
    <div class="overlay"></div>
    </div>
    `; 
  }).join('');
}


/*
	
	я би вам рекомендувала взяти з усіх 3 цих запитів 1 елемент - обʼєкт в якості прикладу, визначитись, які саме поля вам потрібні для картки з новиною, наприклад
const cardNews = { img: null, title: null, description: null, id: null}
після цього,  вам потрібно буде при запиті цих новим різного скажімо типу, трішки відозмінювати елементи масиву , проганяючи наче через адаптер


Ivetta Dashkova
  14 minutes ago
наприклад, popularNews.map (news => { return {img: news.media[0], title: news.title }})*/