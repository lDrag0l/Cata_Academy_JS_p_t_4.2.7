let app = document.querySelector('.App');
let search = app.querySelector('.App__Search')
let searchBar = search.querySelector('.App__input')
let findedLinks = app.querySelector('.App__finded-links')
let linkWrapper = app.querySelector('.link-wrapper')

const debounce = (fn, debounceTime) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, debounceTime)
    }
};

function showSearchElem(elem, name, owner, stars) {
    elem = document.createElement('div')
    elem.classList.add('App__search-result')
    elem.textContent = name
    elem.addEventListener('click', addNewElem(name, owner, stars))
    findedLinks.append(elem)
}

function clearSearchResult() {
    while (findedLinks.lastElementChild) {
        findedLinks.removeChild(findedLinks.lastElementChild);
    }
}


function addNewElem(name, owner, stars) {
    return function () {
        clearSearchResult()
        searchBar.value = ''
        elemName = name;
        elemOwner = owner;
        elemStars = stars;
        elem = document.createElement('div');
        elem.classList.add('link-wrapper__link');
        elem.innerHTML = `<div>
                          <div>Name: ${elemName}</div>
                          <div>Owner: ${elemOwner}</div>
                          <div>Stars: ${elemStars}</div>
                          </div>
                          <button class = 'link-wrapper__button-remove'></button>`;
        elem.addEventListener('click', (event) => {

            if (event.target.classList.contains('link-wrapper__button-remove')) {
                let item = event.target.closest('div');
                item.remove();
            }
        })
        linkWrapper.append(elem);
    }
}

searchBar.addEventListener('keyup', debounce(searchRepos, 600))


async function searchRepos() {
    if (searchBar.value && searchBar.value !== ' ') {
        clearSearchResult()
        return await fetch(`//api.github.com/search/repositories?q=${searchBar.value}`).then((res) => {
            if (res.ok) {
                res.json().then((commits) => {
                    for (let i = 0; i < 5; i++) {
                        showSearchElem(commits.items[i], commits.items[i].name, commits.items[i].owner.login, commits.items[i].stargazers_count)
                    }
                })
            }
            else {
                console.log('Что-то явно пошло нет так с запросом на сервер!')
            }
        })
    }
    else {
        clearSearchResult()
    }

}





