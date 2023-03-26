import { categories } from './categoriesListAssay';
import { fetchNewsByCategory } from './galley-news-fetch';

let categBtnNum = [];

const categBtnWrapper = document.querySelector(".categories-btn-wrapper");
const dropDownWrapper = document.querySelector('.drop-down-wrapper');

// const dropDownList = document.querySelector('.drop-down-list');

const otherSpan = document.querySelector('.others-span');
const btnOther = document.querySelector('.categories-filter__other-btn');
const arrowIconUp = document.querySelector('.svg-up-others-categories');
const categoryContainer = document.querySelector('.categories__container');


onWindowSizeChange();

window.addEventListener('resize', onWindowSizeChange);

// categBtnWrapper.addEventListener('click', onButtonCategClick);

btnOther.addEventListener('click', onOthersBtnClick);
categoryContainer.addEventListener('click', onButtonCategClick);


function onWindowSizeChange() {
  categBtnWrapper.innerHTML = "";
  dropDownWrapper.innerHTML = "";
  let dropDownCategWrapper = [];
  let dropCategories = [];

  if (window.innerWidth < 768) {
    // let dropDownCategWrapper = [];
    // for (let i = 0; i <= categories.length; i += 1) {
    //   dropDownCategWrapper = categories.map(category => {
    //     return `<button class="drop-down-list-btn">${category.display_name}</button>`
    //   }).join('');
    //   dropDownWrapper.innerHTML = dropDownCategWrapper;
    // }
    dropDownCategWrapper = categories.map(category => {
      return `<button class="drop-down-list-btn">${category.display_name}</button>`
    }).join('');
    dropDownWrapper.innerHTML = dropDownCategWrapper;

    } else if (window.innerWidth >= 768 && window.innerWidth < 1280) {
      otherSpan.textContent = "Others"
      categBtnNum = categories.slice(0, 4);
      let btnCategoryMarkup = [];
      // let dropDownCategWrapper = [];

      for (let i = 0; i <= categBtnNum.length; i += 1) {
        btnCategoryMarkup = categBtnNum.map(category => {
          return `<div class = "btn-wrapper"><button class="filter-category__item-bt category-btn">${category.display_name}</button><div>`
        }).join('');
        categBtnWrapper.innerHTML = btnCategoryMarkup;
        // console.log(categBtnWrapper);
      };

      // for (let j = 5; j <= categBtnNum.length; i += 1) {
      //   // dropDownCategWrapper = categories.slice(4, 49);
      //   dropDownCategWrapper.map(category => {
      //     return `<button class="drop-down-list-btn">${category.display_name}</button>`
      //   }).join('');
      //   dropDownWrapper.innerHTML = dropDownCategWrapper;
      //   console.log(dropDownCategWrapper);
      // };
      dropCategories = categories.slice(4, 49);
        dropDownCategWrapper = dropCategories.map(category => {
                return `<button class="drop-down-list-btn">${category.display_name}</button>`
              }).join('');
              // console.log(dropDownCategWrapper);
              dropDownWrapper.innerHTML = dropDownCategWrapper;
              // console.log(dropDownWrapper);
      return;

    } else if  (window.innerWidth >= 1280) {
      otherSpan.textContent = "Others"
      categBtnNum = categories.slice(0, 6);
      let btnCategoryMarkup = [];
      for (let i = 0; i <= categBtnNum.length; i += 1) {
        btnCategoryMarkup = categBtnNum.map(category => {
          return `<div class = "btn-wrapper"><button class="filter-category__item-bt category-btn">${category.display_name}</button><div>`
        }).join('');
        categBtnWrapper.innerHTML = btnCategoryMarkup;
        // console.log(categBtnWrapper);
    };
    dropCategories = categories.slice(6, 49);
        dropDownCategWrapper = dropCategories.map(category => {
      return `<button class="drop-down-list-btn">${category.display_name}</button>`
    }).join('');
    dropDownWrapper.innerHTML = dropDownCategWrapper;
    // console.log(dropDownWrapper);
    return;
  }

}

async function onButtonCategClick(e) {
  if(e.target.nodeName !== 'BUTTON') {
    return;
  }
  console.log(e.target);
  const currentActBtn = document.querySelector('.category-btn--active');
  console.log(currentActBtn);

  if(currentActBtn) {
    currentActBtn.classList.remove('category-btn--active');
  };
  
  const nextActBtn = e.target;
  console.log(nextActBtn);
  nextActBtn.classList.add('category-btn--active');

  if (e.target.innerText === 'Other' || e.target.innerText === 'Categories') {
    return;
  } else {
    const buttonCategory = encodeURIComponent(e.target.innerText.toLowerCase());
    console.log(buttonCategory);
    await fetchNewsByCategory(buttonCategory).then(data => {
      console.log(data);
    })
  }
}

function onOthersBtnClick(e) {
  // e.target.classList.toggle('active');
  console.log(e.target);
  dropDownWrapper.classList.toggle('drop-down-wrapper--active');

}


// function fetchNewsByCategory(categoryData) {
//   const markupByCategory = categoryData.map(element => {
//     `
//     <div class="news-gallery__item">
//     <a class="news-gallery__image" href="${element.url}">
//     <div class="news-gallery__img-container"><img src="${element.imageURL}" 
//     alt="${element.keywordsMap}" loading="lazy" /><p class="news-gallery__img-container-label">${element.section}</p></div>
//     <button class="news-gallery__favorite-btn ><p clas="news-gallery__favorite-p"></p><svg class="news-gallery__favorite-svg" width="16" height="16"><use href="#icon-favorite"</svg></button>
//     </a>
//     <div class="news-gallery__info">
//       <p class="news-gallery__title">${element.title}</p>
//       <p class="news-gallery__text">${element.abstract}</p>
//       <p class="news-gallery__pub_date">${element.published_date}</p>
//     </div>
//     <a class="news-gallery__read-more" href="${element.url}">Read more...</a>
//     </div>
//     <div class="overlay"></div>
//     </div>
//         `
//   }).join('');
//   newsGalleryLnk.innerHTML = markupByCategory;
// }