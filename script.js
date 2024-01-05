const searchInput = document.querySelector('.search-input');
const hintsList = document.querySelector('.autocomplete');
const resultsList = document.querySelector('.results');
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
}

function pinRepo(hintsElement) {
  const elementId = hintsElement.getAttribute('id');
  const repositoryData = getCurrentRepositoryById(elementId);
  // li
  const cardElement = document.createElement('li');
  cardElement.classList.add('results__item');
  // name
  const repositoryNameElement = document.createElement('p');
  repositoryNameElement.classList.add('results__text');
  repositoryNameElement.textContent = 'Name: ' + repositoryData.name;
  // owner
  const repositoryOwnerElement = document.createElement('p');
  repositoryOwnerElement.classList.add('results__text');
  repositoryOwnerElement.textContent = 'Owner: ' + repositoryData.owner;
  // stars
  const repositoryStarsElement = document.createElement('p');
  repositoryStarsElement.classList.add('results__text');
  repositoryStarsElement.textContent = 'Stars: ' + repositoryData.stars;
  // delete button
  const deleteButtonElement = document.createElement('button');
  deleteButtonElement.classList.add('results__delete-button');
  // fill
  cardElement.append(repositoryNameElement);
  cardElement.append(repositoryOwnerElement);
  cardElement.append(repositoryStarsElement);
  cardElement.append(deleteButtonElement);
  // add card
  resultsList.append(cardElement);
}

function getCurrentRepositoryById(repositoryId) {
  let result;
  currentRepositories.forEach(rep => {
    if (rep.id == repositoryId) {
      result = {
        name: rep.name,
        owner: rep.owner.login,
        stars: rep.stargazers_count
      };
    }
  });
  return result;
}

function clearHintsList() {
  hintsList.textContent = '';
  searchInput.value = '';
  currentRepositories = [];
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