export { fetchBreeds, fetchCatByBreed };

const BASE_URL = 'https://api.thecatapi.com/v1/';
const BREEDS_ENDPOINT = 'breeds';
const IMAGES_ENDPOINT = 'images/search';
const KEY ='live_5NANMg4XRrrOIL3HUs9kaEBTrAlewr3Kw3olyERmPmG2LdLlwWaOJD77BMipR5JT';

function fetchBreeds() {
  return fetch(`${BASE_URL}${BREEDS_ENDPOINT}?api_key=${KEY}`).then(
    response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }
  );
}

function fetchCatByBreed(breedId) {
  return fetch(
    `${BASE_URL}${IMAGES_ENDPOINT}?api_key=${KEY}&breed_ids=${breedId}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'slim-select/dist/slimselect.css';

import SlimSelect from 'slim-select';

const refs = {
  breedSelect: document.querySelector('select.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
};

refs.breedSelect.classList.add('is-hidden');

fetchBreeds()
  .then(data => {
    renderBreedSelect(data);
    new SlimSelect({
      select: 'select.breed-select',
      events: {
        afterChange: newVal => {
          onBreedSelect(newVal);
        },
      },
    });
    refs.loader.classList.add('is-hidden');
    refs.breedSelect.classList.remove('is-hidden');
  })
  .catch(showError);

function renderBreedSelect(data) {
  refs.breedSelect.innerHTML = markupBreedSelect(data);
}

function markupBreedSelect(arr) {
  return arr
    .map(breed => {
      return `<option value="${breed.id}">${breed.name}</option>`;
    })
    .join('');
}

function onBreedSelect(evt) {
  const selectedBreedId = evt[0].value;
  clearCatInfo();
  refs.loader.classList.remove('is-hidden');

  fetchCatByBreed(selectedBreedId)
    .then(data => {
      renderCatInfo(data[0]);
      refs.loader.classList.add('is-hidden');
    })
    .catch(showError);
}

function renderCatInfo(cat) {
  refs.catInfo.innerHTML = markupCatInfo(cat, cat.breeds[0]);
}

function markupCatInfo({ url }, { name, description, temperament }) {
  return `<img src="${url}" alt="${name}" width="40%"/>
      <div class="cat-card">
        <h2 class="cat-title">${name}</h2>
        <p class="cat-descr">${description}</p>
        <p class="cat-temperament">
          <b>Temperament: </b>
          ${temperament}
        </p>
      </div>`;
}

function clearCatInfo() {
  refs.catInfo.innerHTML = '';
}

function showError() {
  refs.loader.classList.add('is-hidden');
  Notify.failure('Oops! Something went wrong! Try reloading the page!');
}