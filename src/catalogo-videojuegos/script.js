//#region VARIABLES
const imagePath = `../assets/img/videojuegos/`;

const apiURL = 'https://65348606e1b6f4c59046c7f9.mockapi.io/api';

let gameList = [];
//#endregion VARIABLES

class videogame {
    constructor(id, name, platform, description, price, rate, developers, doggo, image) {
        this.id = id;
        this.name = name;
        this.platform = platform;
        this.description = description;
        this.price = price;
        this.rate = rate;
        this.developers = developers;
        this.doggo = doggo;
        this.image = image;
    }
}

function displayView(jueguitos) {

    clearTable();

    showLoadingMessage();
    if (jueguitos.length === 0) {

        showNotFoundMessage();

    } else {

        hideMessage();

        displayTable(jueguitos);
    }
}

function displayTable(jueguitos) {

    const tablaBody = document.getElementById('data-table-body');

    jueguitos.forEach(juego => {

        const row = document.createElement('tr');

        row.innerHTML = `
              <td> ${juego.id} </td>
              <td> <img src="${imagePath + juego.image}" alt="${juego.name}" width="100"> </td>
              <td>${juego.name}</td>
              <td>${juego.platform}</td>
              <td>${juego.description}</td>
              <td>${formatCurrency(juego.price)}</td>
              <td>${juego.rate}</td>
              <td>${(juego.developers)}</td>
              <td>${(juego.doggo)}</td>
            `;
        tablaBody.appendChild(row);
    });
}

// Funcion que limpia la tabla
function clearTable() {
    const tableBody = document.getElementById('data-table-body');

    tableBody.innerHTML = '';
}


// Funcion que muestra mensaje de carga
function showLoadingMessage() {
    const message = document.getElementById('message');

    message.innerHTML = 'Cargando...';

    message.style.display = 'block';
}


// Funcion que muestra mensaje de que no se encuentraron datos
function showNotFoundMessage() {
    const message = document.getElementById('message');

    message.innerHTML = 'No se encontraron videojuegos con el filtro proporcionado.';

    message.style.display = 'block';
}


// Funcion que oculta mensaje
function hideMessage() {
    const message = document.getElementById('message');

    message.style.display = 'none';
}

//Funcion que muestra los filtros
const showFilter = document.getElementById('showFilters');
showFilter.addEventListener("click", () => {
    document.getElementById('filter-section').style.display = "flex";
    showFilter.style.display = "none";
})

function initButtonsHandler() {

    document.getElementById('filter-form').addEventListener('submit', event => {
        event.preventDefault();
        applyFilters();
    });

    document.getElementById('reset-filters').addEventListener('click', () => {
        document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
        applyFilters();
    });

    const closeFilter = document.getElementById('close-filters');
    closeFilter.addEventListener("click", () => {
        document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
        applyFilters();
        document.getElementById('filter-section').style.display = "none";
        showFilter.style.display = "block";
    });
}

function applyFilters() {
    const filterText = document.getElementById('text').value.toLowerCase();;
    const filterCalifMin = parseFloat(document.getElementById('calificacion-min').value);
    const filterCalifMax = parseFloat(document.getElementById('calificacion-max').value);
    const filterMinPrice = parseFloat(document.getElementById('price-min').value);
    const filterMaxPrice = parseFloat(document.getElementById('price-max').value);

    const filteredGames = filterGames(gameList, filterText, filterCalifMin, filterCalifMax, filterMinPrice, filterMaxPrice);

    displayView(filteredGames);
}

function filterGames(jueguitos, text, minRate, maxRate, minPrice, maxPrice) {

    return jueguitos.filter(juego =>
        (!minRate || juego.rate >= minRate) &&
        (!maxRate || juego.rate <= maxRate) &&
        (!minPrice || juego.price >= minPrice) &&
        (!maxPrice || juego.price <= maxPrice) &&
        (!text || juego.name.toLowerCase().includes(text) || juego.developers.toLowerCase().includes(text) || juego.platform.toLowerCase().includes(text))
    );
}

function searchData() {
    const OPTIONS = {
        method: 'GET'
    };

    fetch(`${apiURL}/catalogo-videojuegos`, OPTIONS)
        .then(response => response.json())
        .then(data => {
            //Se mapean los datos de modelos a objetos de la clase videogame
            gameList = data.map(item => {
                return new videogame(
                    item.id,
                    item.name,
                    item.platform,
                    item.description,
                    item.price,
                    item.rate,
                    item.developers,
                    item.doggo,
                    item.image
                );
            });

            //Mostramos los datos en la pagina
            displayView(gameList);
        })
        .catch(error => console.log(error));
}


initButtonsHandler();

searchData();