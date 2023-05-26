const breedSelect = document.querySelector('.breed-select');
const divEl = document.querySelector('.cat-info');

const API =
  'live_5NANMg4XRrrOIL3HUs9kaEBTrAlewr3Kw3olyERmPmG2LdLlwWaOJD77BMipR5JT';

breedSelect.addEventListener('change', onChangeSelect);

async function onChangeSelect(event) {
  divEl.innerHTML = '';
  const breed = event.target.value;
  console.log(breed);
  try {
    const breedDesc = await fetchBreedDesc(breed);
    renderBreedDesc(breedDesc);
  } catch (error) {
    console.log(error);
  }
}

fetchAndRenderBreeds();

async function fetchAndRenderBreeds() {
  try {
    const breeds = await fetchBreeds();
    renderBreedsSelect(breeds);
  } catch (error) {
    console.log(error);
  }
}

function fetchBreeds() {
  return fetch(`https://api.thecatapi.com/v1/breeds?api_key=${API}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      throw new Error(error);
    });
}

function fetchBreedDesc(breed) {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?breed_id=${breed}&api_key=${API}`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      throw new Error(error);
    });
}

function renderBreedsSelect(cats) {
  const markup = cats
    .map(cat => {
      return `<option value="${cat.id}">${cat.name}</option>`;
    })
    .join('');
  breedSelect.innerHTML = markup;
}

function renderBreedDesc(breed) {
  const markup = `<img class="cat-picture" width=400 src="${breed[0].url}" alt="${breed[0].id}">`;
  divEl.innerHTML = markup;
}