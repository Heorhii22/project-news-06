import { Datepicker } from 'vanillajs-datepicker';
import * as newsRender from './gallery-news-render';
import moment from 'moment';

const axios = require('axios').default;
const BASE_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?';
const KEY = 'r45Ed0pk3C31WWBJaP0BSBDVSCCTnWUR';

const datePickerInput = document.querySelector('input[name="newsDate"]');
const now = new Date();
const params = {
  month: now.getMonth(),
  year: now.getFullYear(),
  weekStart: 1,
  format: "dd/mm/yyyy",
  maxDate: now,
  nextArrow: '>',
  prevArrow: '<',
  daysOfWeekHighlighted: [0, 6]

  // todayButton: true
  // defaultViewDate: now
};
const datepicker = new Datepicker(datePickerInput, params); 
datepicker.setDate(now);
datePickerInput.addEventListener("changeDate", async (event) => {
  datepicker.hide();
  const searchDate = moment(event.detail.date).format("YYYY-MM-DD");
  const articl = await galleryFetch("", 0, `pub_date: ${searchDate}`)
  console.log(articl)
  newsRender.renderData(articl.docs)
})
export async function galleryFetch(queryLine, currentPage, fq) { 

    try {
        let response = await axios.get(`${BASE_URL}&fq=${fq}&api-key=${KEY}`);

        return response.data.response;
    }
    catch (e) { 
        console.log(e.message);
    }

}
