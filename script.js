const searchInput = document.querySelector('.search-input');

searchInput.addEventListener('input', debounce(function(evt) {
  const searchValue = evt.target.value.trim();
  if (searchValue.length > 0) {
    fetch(`https://api.github.com/search/repositories?q="${evt.target.value}";per_page=5`)
      .then(resp => resp.json())
      .then(repositories => console.log(repositories.items))
  } else {
    searchInput.value = '';
  }
}, 800));

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