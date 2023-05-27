import { fetchBreeds, fetchCatByBreed } from './js/cat-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import 'slim-select/dist/slimselect.css';

import SlimSelect from 'slim-select';

const refs = {
  breedSelect: document.querySelector('select.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
};

refs.breedSelect.classList.add('is-hidden');

async function initialize() {
  try {
    const data = await fetchBreeds();
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
  } catch (error) {
    showError();
  }
}

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

async function onBreedSelect(evt) {
  const selectedBreedId = evt[0].value;
  clearCatInfo();
  showLoader(); // Показати анімацію загрузки

  try {
    const data = await fetchCatByBreed(selectedBreedId);
    renderCatInfo(data[0]);
    hideLoader(); // Приховати анімацію загрузки
  } catch (error) {
    showError();
  }
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
  hideLoader(); // Приховати анімацію загрузки
  Notify.failure('Oops! Something went wrong! Try reloading the page!');
}

function showLoader() {
  refs.loader.classList.remove('is-hidden');
}

function hideLoader() {
  refs.loader.classList.add('is-hidden');
}

initialize();