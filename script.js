let inputFindWord = document.getElementById('query');
let buttonFind = document.getElementById('find');
let cardsContainer = document.getElementsByClassName('cards-container')[0];

buttonFind.addEventListener("click", addCard);
document.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addCard();
    }
});

async function imageRequest(query) {
    const requestURL = `https://api.unsplash.com/search/photos?client_id=4DfpRxdNmDx1AKmWWg-oZsa7Hn2rMJFAeU3hGJzjyqk&page=1&query=${query}&orientation=squarish`;
    const request = new Request(requestURL);

    const response = await fetch(request);

    let jsonObj = await response.json();

    return jsonObj.results[0].urls.small
}

async function translateRequest(textToTranslate) {
    const requestURL = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyALrf8M2j0wkJgiad1g_jULzPxe-43FBWI&q=${textToTranslate}&source=en&target=ru&format=text`;
    const request = new Request(requestURL);

    const response = await fetch(request);

    let jsonObj = await response.json();
    
    return jsonObj['data']['translations'][0]['translatedText'];
}

async function addCard() {
    let enText = document.getElementById('query').value;
    let ruText = await translateRequest(enText);
    let imgUrl = await imageRequest(enText);

    let card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('afterbegin', `<figure><img src=${imgUrl} width="210px" height="210px"></figure>`);
    card.insertAdjacentHTML('beforeend', `<p class="answer-en">${enText}</p>`);
    card.insertAdjacentHTML('beforeend', `<p class="answer-ru">${ruText}</p>`);

    cardsContainer.prepend(card);
}



