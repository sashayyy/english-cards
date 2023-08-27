let inputFindWord = document.getElementById('query');
let buttonFind = document.getElementById('find');

buttonFind.addEventListener("click", findImage);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        findImage();
    }
});

async function imageRequest(query) {
    const requestURL = `https://api.unsplash.com/search/photos?client_id=4DfpRxdNmDx1AKmWWg-oZsa7Hn2rMJFAeU3hGJzjyqk&page=1&query=${query}&orientation=squarish`;
    const request = new Request(requestURL);

    const response = await fetch(request);

    let jsonObj = await response.json();

    return jsonObj.results[0].urls.small
}

function addElementHtml(data) {
    const element = document.getElementById('first-img');
    element.src = data;
}

async function findImage() {
    let query = document.getElementById('query').value;
    let responseImage = await imageRequest(query);
    let responseText = await translateRequest(query);

    addElementHtml(responseImage);
    addTranslateHtml(responseText);
}

function addTranslateHtml(data) {
    let element = document.querySelector('p');
    element.textContent = data;
}

async function translateRequest(textToTranslate) {
    const requestURL = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyALrf8M2j0wkJgiad1g_jULzPxe-43FBWI&q=${textToTranslate}&source=en&target=ru&format=text`;
    const request = new Request(requestURL);

    const response = await fetch(request);

    let jsonObj = await response.json();
    
    return wordTranslated = jsonObj['data']['translations'][0]['translatedText'];
}


