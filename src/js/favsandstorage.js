/*export function newsCardMarkup(
  web_url,
  imageURL,
  keywordsMap,
  headline,
  abstract,
  pub_date,
  section,
  published_date
) */
//.news-gallery__favorite-btn
import { newsCardMarkup } from './gallery-news-render';
import { readDataArrayToMarcup } from './gallery-news-render';

import { setLocalStorageItem } from './storage';
import { getLocalStorageItem } from './storage';

const STORAGE_KEY = "card-array";

const cardFavBtnLnk = document.querySelector('.news-gallery__favorite-btn');

//cardFavBtnLnk.addEventListener("Click", onFavBtnClick);

const galleryLnk = document.querySelector(".news-gallery");

galleryLnk.addEventListener("Click", onFavBtnInCardClick);

function onFavBtnInCardClick(e) { 
    //e.preventDefault();
    console.log(e.target);
}
