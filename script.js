let inputFindWord = document.getElementById('query');
let buttonFind = document.getElementById('find');
let buttonDelete = document.getElementById('delete');
let cardsContainer = document.getElementsByClassName('cards-container')[0];
let form = document.getElementsByClassName('form')[0];
let input = document.getElementById('input-query');

let cards = [];

if (localStorage.getItem('cards') !== null) {
    cards = JSON.parse(localStorage.getItem('cards'));
    cards.forEach(element => {
        let card = document.createElement('div');
        card.className = 'card';
        card.insertAdjacentHTML('afterbegin', `<figure><img src=${element.imgUrl} width="210px" height="210px"></figure>`);
        card.insertAdjacentHTML('beforeend', `<p class="answer-en">${element.enText}</p>`);
        card.insertAdjacentHTML('beforeend', `<p class="answer-ru">${element.ruText}</p>`);
        card.style = `background-color: ${randomLightColor()};`;
    
        cardsContainer.append(card);
    });
}

buttonFind.addEventListener("click", addCard);
document.addEventListener('keydown', keydownAddCard);

async function keydownAddCard(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addCard();
    }
}


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

function updateLocalStorage(data) {
    localStorage.setItem('cards', JSON.stringify(data));
}

function clearField(input) {
    input.value = "";
};

async function addCard() {
    let enText = document.getElementById('query').value;
    let ruText = await translateRequest(enText);
    let imgUrl = await imageRequest(enText);

    let card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('afterbegin', `<figure><img src=${imgUrl} width="210px" height="210px"></figure>`);
    card.insertAdjacentHTML('beforeend', `<p class="answer-en">${enText}</p>`);
    card.insertAdjacentHTML('beforeend', `<p class="answer-ru">${ruText}</p>`);
    card.style = `background-color: ${randomLightColor()};`;
    card.classList.add('appear-first');
    cardsContainer.prepend(card);

    cards.unshift({ imgUrl: imgUrl, ruText: ruText, enText: enText, isShown: true });
    updateLocalStorage(cards);
}

function randomLightColor() {
    let r, g, b;
    r = Math.floor(Math.random() * 50) + 190;
    g = Math.floor(Math.random() * 50) + 190;
    b = Math.floor(Math.random() * 50) + 190;

    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}

function deleteModeSelectCards(event) {
    if (event.target.classList.contains('card')) {
        event.target.classList.toggle('selectedToDelete');
        let index = cards.findIndex((item) => item.enText === event.target.querySelector('.answer-en').textContent);
        cards[index].isShown = !cards[index].isShown;
    } else if (event.target.parentNode.classList.contains('card')) {
        event.target.parentNode.classList.toggle('selectedToDelete');
        let index = cards.findIndex((item) => item.enText === event.target.parentNode.querySelector('.answer-en').textContent);
        cards[index].isShown = !cards[index].isShown;
    } else if (event.target.parentNode.parentNode.classList.contains('card')) {
        event.target.parentNode.parentNode.classList.toggle('selectedToDelete');
        let index = cards.findIndex((item) => item.enText === event.target.parentNode.parentNode.querySelector('.answer-en').textContent);
        console.log(index);
        cards[index].isShown = !cards[index].isShown;
    }
    updateLocalStorage(cards);
}

buttonDelete.addEventListener('click', deleteMode);

function deleteMode() {
    document.removeEventListener('click', keydownAddCard);
    buttonFind.removeEventListener('click', addCard);
    buttonDelete.removeEventListener('click', deleteMode);

    let checkmark = document.createElement('div');
    checkmark.className = 'checkmarkDelete';
    checkmark.textContent = '\u2713';
    let cross = document.createElement('div');
    cross.className = 'crossDelete';
    cross.textContent = '\u2BBE';

    let deleteModeOptions = document.createElement('div');
    deleteModeOptions.className = 'deleteModeOptions';
    deleteModeOptions.appendChild(checkmark);
    deleteModeOptions.appendChild(cross);
    form.replaceWith(deleteModeOptions);

    let allCards = document.getElementsByClassName('card');
    for (let i=0; i < allCards.length; ++i) {
        if (allCards[i].classList.contains('appear-first')) {
            allCards[i].classList.remove('appear-first');
        }
        allCards[i].classList.add('deleteModeCSS');
    }

    document.addEventListener('click', deleteModeSelectCards);
    checkmark.addEventListener('click', () => {
        Array.from(allCards).forEach((element) => {
            if (element.classList.contains('selectedToDelete')) {
                element.remove();
            }
        })
        cards = cards.filter((item) => item.isShown === true);
        updateLocalStorage(cards);
    });

    cross.addEventListener('click', () => {
        document.removeEventListener('click', deleteModeSelectCards);
        document.addEventListener('click', keydownAddCard);
        buttonFind.addEventListener('click', addCard);
        buttonDelete.addEventListener('click', deleteMode);
        for (let i=0; i < allCards.length; ++i) {
            allCards[i].classList.remove('deleteModeCSS');
            if (allCards[i].classList.contains('selectedToDelete')) {
                allCards[i].classList.remove('selectedToDelete');
            }
        }
        deleteModeOptions.replaceWith(form);

        updateLocalStorage(cards);
    })
}

