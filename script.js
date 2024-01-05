const searchInput = document.querySelector('.search-input');
const hintsList = document.querySelector('.autocomplete');
let currentRepositories = [];

searchInput.addEventListener('input', debounce(function(evt) {
  hintsList.textContent = '';
  const searchValue = evt.target.value.trim();
  if (searchValue.length > 0) {
    fetch(`https://api.github.com/search/repositories?q="${evt.target.value}";per_page=5`)
      .then(resp => resp.json())
      .then(repositories => showSearchHints(repositories.items));
  } else {
    searchInput.value = '';
  }
}, 800));

function showSearchHints(repositories) {
  const fragment = document.createDocumentFragment();
  repositories.forEach(rep => {
    currentRepositories.push(rep);
    const listItem = document.createElement('li');
    listItem.classList.add('autocomplete__item');
    listItem.textContent = rep.name;
    listItem.setAttribute('id', rep.id);
    listItem.addEventListener('click', (evt) => {
      let target = evt.target;
      pinRepo(target);
      clearHintsList();
    });
    fragment.append(listItem);
  });
  hintsList.append(fragment);
  console.log(currentRepositories)
}

function pinRepo(hintsElement) {
  const cardElement = document.createElement('li');
  cardElement.classList.add('results__item');
  const elementId = hintsElement.getAttribute('id');
  console.log('here')
  console.log(cardElement)
  console.log(elementId)
}

function clearHintsList() {
  hintsList.textContent = '';
  searchInput.value = '';
  currentRepositories = [];
  console.log(currentRepositories)
}

function debounce(fn, debounceTime) {
  let timeout;

  return function() {
  	const context = this; 
    const args = arguments;
  	clearTimeout(timeout);
    timeout = setTimeout(function() {
      fn.apply(context, args);
    }, debounceTime);
  };
}