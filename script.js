const searchInput = document.querySelector('.search-input');
const hintsList = document.querySelector('.search-autocomplete');

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
    const listItem = document.createElement('li');
    listItem.classList.add('autocomplete-hint');
    listItem.textContent = rep.name;
    listItem.addEventListener('click', () => {
      clearHintsList();
    });
    fragment.append(listItem);
  });
  hintsList.append(fragment);
}

function clearHintsList() {
  hintsList.textContent = '';
  searchInput.value = '';
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