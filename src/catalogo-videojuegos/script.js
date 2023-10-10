class videogame {

    constructor(id, name, plataform, description, price, rate, developers, doggo, image) {
        this.id = id;
        this.name = name;
        this.plataform = plataform;
        this.description = description;
        this.price = price;
        this.rate = rate;
        this.developers = developers;
        this.doggo = doggo;
        this.image = image;
    }
}

const game1 = new videogame(1, "Baldur's Gate", "Pc/PS5/Xbox", "dnd el videojuego", 1300, 5, "Larian Studio", "si", "baldurs3.png");
const game2 = new videogame(2, "Budukai Tenkashi 3", "PS2", "Dragon Ball z peleas shidoriz", 1000, 4.5, "japon", "no", "goku.png");
//const juego2 = new RealEstate(2, "Casa Beta", "Diseño moderno y espacioso con acabados de lujo.", 3, 3.5, 350000, 300, 180, "real-estate-2.jpg");
//const juego3 = new RealEstate(3, "Casa Teta", "Casa ideal para familias grandes con jardín y areas de convivencia.", 4, 4.5, 450000, 400, 200, "real-estate-3.jpg");

/*
// Almacenamos los objetos en un array
const realEstateList = [game1, game2];


// Accedemos datos por indices
console.log('Impresion en consola de elementos accesados por indices: ');
console.log(realEstateList[0]);
console.log(realEstateList[1]);
console.log(realEstateList[1]);


// Accedemos datos con funcion forEach() de array
console.log('Impresion en consola de elementos accesados con forEach(): ');
realEstateList.forEach(item => {console.log(item)});
*/


const gamelist = [game1, game2];

function displayTable(jueguitos) {

    clearTable();

    showLoadingMessage();

    setTimeout(() => {

        if (jueguitos.length === 0) {

            showNotFoundMessage();

        } else {

            hideMessage();

            const tablaBody = document.getElementById('data-table-body');

            const imagePath = `../assets/img/videojuegos/`;

            jueguitos.forEach(juego => {

                const row = document.createElement('tr');

                row.innerHTML = `
              <td> ${juego.id} </td>
              <td> <img src="${imagePath + juego.image}" alt="${juego.name}" width="100"> </td>
              <td>${juego.name}</td>
              <td>${juego.plataform}</td>
              <td>${juego.description}</td>
              <td>${(juego.price)}</td>
              <td>${juego.rate}</td>
              <td>${(juego.developers)}</td>
              <td>${(juego.doggo)}</td>
            `;
                tablaBody.appendChild(row);
            });
        }
    }, 2000);
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
  
    message.innerHTML = 'No se encontraron casas con el filtro proporcionado.';
  
    message.style.display = 'block';
  }
  
  
  // Funcion que oculta mensaje
  function hideMessage() {
    const message = document.getElementById('message');
  
    message.style.display = 'none';
  }

function initButtonsHandler() {

    document.getElementById('filter-form').addEventListener('submit', event => {
        event.preventDefault();
        applyFilters();
    });

    document.getElementById('reset-filters').addEventListener('click', () => {
        document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
        applyFilters();
    });
}

function applyFilters() {
    const filterText = document.getElementById('text').value.toLowerCase();;
    const filterCalifMin = parseFloat(document.getElementById('calificacion-min').value);
    const filterCalifMax = parseFloat(document.getElementById('calificacion-max').value);
    const filterMinPrice = parseFloat(document.getElementById('price-min').value);
    const filterMaxPrice = parseFloat(document.getElementById('price-max').value);

    const filteredGames = filterGames(gamelist, filterText, filterCalifMin, filterCalifMax, filterMinPrice, filterMaxPrice);

    displayTable(filteredGames);
}

function filterGames(jueguitos, text, minRate, maxRate, minPrice, maxPrice) {

    return jueguitos.filter(juego =>
        (!minRate || juego.rate >= minRate) &&
        (!maxRate || juego.rate <= maxRate) &&
        (!minPrice || juego.price >= minPrice) &&
        (!maxPrice || juego.price <= maxPrice) &&
        (!text || juego.name.toLowerCase().includes(text) || juego.description.toLowerCase().includes(text))
    );
}

displayTable(gamelist);

initButtonsHandler();
