import '../css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
    name: document.getElementById('search-box'),
    countryInfo: document.querySelector('.country-info'),
    countriesList: document.querySelector('.country-list'),
}

refs.name.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    const name = e.target.value.trim();
    refs.countryInfo.innerHTML = '';
    refs.countriesList.innerHTML = '';
    if (name != '') {
        fetchCountries(name)
            .then(data => markUp(data))
            .catch(error => {
                Notify.failure("Oops, there is no country with that name");
                console.log('error', error);
            });
    }
}

function markUp(data) {
    console.log('Found data.length = ', data.length);
    if (data.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
    } else {
        if (data.length > 1 && data.length < 11) {
            refs.countriesList.innerHTML = (data.map(country => markupCountries(country)
            ).join(''));
        } else {
            if (data.length === 1) {
                refs.countryInfo.innerHTML = markupCountry(data);
            }
        }
    }
}

function markupCountries(data) {
    return `
    <li class="country-flag-medium">
        <img class="" src="${data.flags.svg}" alt="${data.name}">
        <p class="country-name-medium">${data.name}</p>
    </li>`
}

function markupCountry(data) {
    return `
        
    <div class="country-flag">
        <img src="${data[0].flags.svg}" alt="${data[0].name}">
        <h2 class="country-name">${data[0].name}</h2>
    </div>
    <div class="country-body">
        <h2 class="country-text">Capital: <p class="country-text-value">${data[0].capital}</p></h2>
        <h2 class="country-text">Population: <p class="country-text-value">${data[0].population}</p></h2>
        <h2 class="country-text">Languages: <p class="country-text-value"> ${data[0].languages.map(language => language.name)}</p></h2>
    </div>`;
}
