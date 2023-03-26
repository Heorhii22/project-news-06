import { galleryFetch } from './galley-news-fetch';
import { galleryFetchPopular } from './galley-news-fetch';
import { startWeatherWidget } from './weather-widget';
import { getLocalStorageItem, setLocalStorageItem } from './storage';
import format from 'date-fns/format';

const searchForm = document.querySelector('.form-search');
const newsGalleryLnk = document.querySelector('.news-gallery');
const NEW_KEY_READ = 'read';
const KEY_COLLECTION = 'collection';

let imageURL =
  'https://www.politico.com/dims4/default/b07a49c/2147483647/strip/true/crop/1160x773+0+0/resize/1290x860!/format/webp/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F8c%2F18%2F7fb9b88e4e588a4cc84bb8da9bbf%2F200613-nyt-getty-773.jpg';
const nytURL = 'https://www.nytimes.com/';

let currentPage = 1;
let currentHits = 0;
let globalSearchQuery = '';

searchForm.addEventListener('submit', onSearchBtn);
newsGalleryLnk.innerHTML = '';

onLoadNewsPage();

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
  operateDataBackEnd(globalSearchQuery, currentPage);
}

// Обробка респонса з бекенду по пошуку а також погода. Масив data.docs буде передане в renderData
async function operateDataBackEnd(searchQuery, searchPage) {
  try {
    const data = await galleryFetch(searchQuery, searchPage);
    startWeatherWidget();
    await renderData(data.docs);
  } catch (e) {
    console.log(e.message);
  }
}
// Рендер даних по статтям у розмітку за допомогою insertAdjacentHTML
export async function renderData(articles) {
  newsGalleryLnk.innerHTML = '';
  if (articles.length === 0) return;

    const galleryMurkup = readDataArrayToMarcup(articles); // Передача масиву в функцію, що формує розмітку
    newsGalleryLnk.insertAdjacentHTML('beforeend', galleryMurkup);

}

export async function readDataArrayToMarcup(articlesArray) {
  
  return articlesArray
    .map(
      ({
        abstract,
        headline,
        keywords,
        multimedia,
        pub_date,
        web_url,
        section_name,
      }) => {
        const keywordsMap = keywords
          .map(({ value }) => {
            return value;
          })
          .join(', ');

        const firstImageUrl = multimedia.map(url => {
          return url;
        });
        if (firstImageUrl.length !== 0) {
          imageURL = nytURL + firstImageUrl[0].url;
        }

        const bySearchMarkup = `<div class="news-gallery__item">
    <div class="news-gallery__img-container"><img src="${imageURL}" 
    alt="${keywordsMap}" loading="lazy" /><p class="news-gallery__img-container-label">${section_name}</p><button class="news-gallery__favorite-btn" type="button">Add to favorite<svg width="12" height="12" viewBox="0 0 32 32">
<path stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="1.7778" d="M27.787 6.146c-0.681-0.681-1.49-1.222-2.38-1.591s-1.844-0.559-2.807-0.559c-0.963 0-1.917 0.19-2.807 0.559s-1.698 0.909-2.38 1.591l-1.413 1.413-1.413-1.413c-1.376-1.376-3.241-2.148-5.187-2.148s-3.811 0.773-5.187 2.148c-1.376 1.376-2.148 3.241-2.148 5.187s0.773 3.811 2.148 5.187l11.787 11.787 11.787-11.787c0.681-0.681 1.222-1.49 1.591-2.38s0.559-1.844 0.559-2.807c0-0.963-0.19-1.917-0.559-2.807s-0.909-1.699-1.591-2.38v0z"></path>></svg></button></div>
    <div class="news-gallery__info">
      <h2 class="news-gallery__title">${headline.main}</h2>
      <div class ="wrapper">
      <p class="news-gallery__text">${abstract.substring(0, 110) + '...'}</p>
      </div>
      <div class="news-gallery__more">
      <p class="news-gallery__pub_date">${pub_date.substring(0, 10)}</p>
      <a class="news-gallery__read-more" href="${web_url}" target="_blank">Read more...</a>
      </div>
    </div>
    </div>
    </div>`;
        newsGalleryLnk.insertAdjacentHTML('beforeend', bySearchMarkup);
        // return newsCardMarkup(
        //   web_url,
        //   imageURL,
        //   keywordsMap,
        //   headline.main,
        //   abstract,
        //   pub_date
        // );
      }
    )
    .join('');
}


// функція, яка викликає бекенд популярних статей та оримує дані, формує розмітку.
async function onLoadNewsPage() {
  newsGalleryLnk.innerHTML = '';
  try {
    await startWeatherWidget();
  } catch (e) {
    console.log(e.message);
  }
  try {
    const dataResponse = await galleryFetchPopular(currentPage);
    console.log('dataResponse ', dataResponse);
    newsGalleryLnk.insertAdjacentHTML(
      'beforeend',
      popularArticlesMarkup(dataResponse)
    );
    const gallery = document.body.querySelector('.news-gallery__read-more');
    //gallery.addEventListener('click', markAsRead);
    gallery.addEventListener('click', markAsRead);
    
    function markAsRead(e) {
      if (!e.target.matches('.news-gallery__read-more')) return;

      let card = e.target.closest('.news-gallery__item');
      if (!card) return;
      let id = card.web_url;
      let readItems = getLocalStorageItem(NEW_KEY_READ) || [];
      let date = format(Date.now(), 'MM/dd/yyyy');

      if (
        readItems.some(
          obj =>
            obj.date === date && obj.collection.some(card => card.id === id)
        )
      ) {
        return;
      }

      const readCard = getLocalStorageItem(KEY_COLLECTION).find(
        obj => obj.id === id
      );

      if (readItems.some(obj => obj.date === date)) {
        const obj = readItems.find(obj => obj.date === date);
        obj.collection.push(readCard);
        setLocalStorageItem(
          NEW_KEY_READ,
          readItems.sort(
            (objA, objB) => new Date(objB.date) - new Date(objA.date)
          )
        );
      } else {
        readItems.push({ date: date, collection: [readCard] });
        setLocalStorageItem(
          NEW_KEY_READ,
          readItems.sort(
            (objA, objB) => new Date(objB.date) - new Date(objA.date)
          )
        );
      }
    }
  } catch (e) {
    console.log(e.message);
  }
}

// читання респонсу по популярних статтях.

function popularArticlesMarkup(dataResponse) {
  return dataResponse
    .map(
      ({
        abstract,
        adx_keywords,
        media,
        title,
        url,
        published_date,
        updated,
        section,
      }) => {
        console.log();

        let imgUrl = '';
        try {
          imgUrl = String(Object(media[0])['media-metadata'][2].url);
        } catch (e) {
          console.log("(nothing)",e.message);
        }

        return newsCardMarkup(
          url,
          imgUrl,
          adx_keywords,
          title,
          abstract,
          updated,
          section,
          published_date
        );
      }
    ).join('');
}
//Уніфікована розмітка однієї картки новини
export function newsCardMarkup(
  web_url,
  imageURL,
  keywordsMap,
  headline,
  abstract,
  pub_date,
  section,
  published_date
) {
  if (!imageURL) {
    imageURL =
      'https://www.politico.com/dims4/default/b07a49c/2147483647/strip/true/crop/1160x773+0+0/resize/1290x860!/format/webp/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F8c%2F18%2F7fb9b88e4e588a4cc84bb8da9bbf%2F200613-nyt-getty-773.jpg';
  }
  return `<div class="news-gallery__item">
    <div class="news-gallery__img-container"><img src="${imageURL}" 
    alt="${keywordsMap}" loading="lazy" /><p class="news-gallery__img-container-label">${section}</p><button class="news-gallery__favorite-btn" type="button">Add to favorite<svg width="12" height="12" viewBox="0 0 32 32">
<path stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="1.7778" d="M27.787 6.146c-0.681-0.681-1.49-1.222-2.38-1.591s-1.844-0.559-2.807-0.559c-0.963 0-1.917 0.19-2.807 0.559s-1.698 0.909-2.38 1.591l-1.413 1.413-1.413-1.413c-1.376-1.376-3.241-2.148-5.187-2.148s-3.811 0.773-5.187 2.148c-1.376 1.376-2.148 3.241-2.148 5.187s0.773 3.811 2.148 5.187l11.787 11.787 11.787-11.787c0.681-0.681 1.222-1.49 1.591-2.38s0.559-1.844 0.559-2.807c0-0.963-0.19-1.917-0.559-2.807s-0.909-1.699-1.591-2.38v0z"></path>></svg></button></div>
    <div class="news-gallery__info">
      <h2 class="news-gallery__title">${headline}</h2>
      <div class ="wrapper">
      <p class="news-gallery__text">${abstract.substring(0, 110) + '...'}</p>
      </div>
      <div class="news-gallery__more">
      <p class="news-gallery__pub_date">${published_date}</p>
      <a class="news-gallery__read-more" href="${web_url}" target="_blank">Read more...</a>
      </div>
    </div>
    </div>
    </div>`;
}