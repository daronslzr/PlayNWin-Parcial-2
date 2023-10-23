//const apiURL = 'https://65348606e1b6f4c59046c7f9.mockapi.io/api';


// Definimos la clase Sale
class Sale {
    constructor(id, cliente, videogame, vendedor, fechaVenta, ventaTotal) {
        this.id = id; // Identificador de la venta
        this.cliente = cliente; // Nombre del cliente
        this.videogame = videogame; // Referencia a videojuegos vendidos
        this.vendedor = vendedor; // Vendedor
        this.fechaVenta = fechaVenta; // Fecha de la venta
        this.ventaTotal = ventaTotal; // Precio de la venta
    }
}

function mapAPIToSales(data) {
    return data.map(item => {
        return new Sale(
            item.id,
            item.cliente,
            item.videogame,
            item.vendedor,
            new Date(item.fechaVenta),
            item.ventaTotal,
        );
    });
}

//#region VER DATOS TABLA

function displaySalesView(sales) {
    clearTable();
    showLoadingMessage();

    if (sales.length === 0) {
        showNotFoundMessage();
    } else {
        hideMessage();
        displaySalesTable(sales);
    }
}


// Funcion que agrega los datos de los modelos de los videojuegos a la tabla.
function displaySalesTable(sales) {
    const tablaBody = document.getElementById('data-table-body');

    sales.forEach(sale => {
        console.log(sale);
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${sale.id}</td>
        <td>${sale.cliente}</td>
        <td>${sale.videogame}</td>
        <td>${sale.vendedor}</td>
        <td>${new Date(sale.fechaVenta).toISOString().substring(0,10)}</td>
        <td class="text-right">${formatCurrency(sale.ventaTotal)}</td>
        <td>
          <button class="btn-delete" data-sale-id="${sale.id}">Eliminar</button>
        </td>
      `;
        tablaBody.appendChild(row);
    });
    initDeleteSaleButtonHandler();
}



//#endregion VER DATOS TABLA

//#region FILTROS 

//lleva registro de los botones de filtro
function initFilterButtonsHandler() {
    //literamente FILTRA!
    document.getElementById('filter-form').addEventListener('submit', event => {
        event.preventDefault();
        searchSales();
    });

    //limpia filtros
    document.getElementById('reset-filters').addEventListener('click', () => clearSales());

    //cierra el recuadro de filtros
    const closeFilter = document.getElementById('close-filters');
    closeFilter.addEventListener("click", () => {
        document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
        searchSales();
        document.getElementById('filter-section').style.display = "none";
        showFilter.style.display = "block";
    })
}

function clearSales() {
    document.querySelector('select.filter-field').selectedIndex = 0;
    document.querySelectorAll('input.filter-field').forEach(input => input.value = '');

    displayClearSalesView();
}

function displayClearSalesView() {
    clearTable();
    showInitialMessage();
}

function clearTable() {
    const tableBody = document.getElementById('data-table-body');
    tableBody.innerHTML = '';
}

function resetSales() {
    document.querySelector('select.filter-field').selectedIndex = 0;
    document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
    //な　searchSales();
}


function searchSales() {　//か
    const videogame = document.getElementById('videogame-filter').value;
    const cliente = document.getElementById('filtro-cliente').value;
    const vendedor = document.getElementById('filtro-vendedor').value;
    const ventaMin = document.getElementById('sale-total-min').value;
    const ventaMax = document.getElementById('sale-total-max').value;
    const fechaVenta = document.getElementById('date-filter').value;

    let queryEndpoint = '/ventas-videojuegos?';

    queryEndpoint += (videogame === '' ) ? '' : `videogame=${videogame}&` ;
    queryEndpoint += (cliente === '' ) ? '' : `cliente=${cliente}&` ;
    queryEndpoint += (vendedor === '' ) ? '' : `vendedor=${vendedor}&` ;
    queryEndpoint += (fechaVenta === '' ) ? '' : `fechaVenta=${fechaVenta}&` ;

    console.log(queryEndpoint);
    getSalesData(apiURL+queryEndpoint,ventaMin,ventaMax);
}

const showFilter = document.getElementById('showFilters');
showFilter.addEventListener("click", () => {
    document.getElementById('filter-section').style.display = "flex";
    showFilter.style.display = "none";
})

function showInitialMessage() {
    const message = document.getElementById('message');
    message.innerHTML = 'No se ha realizado una consulta de ventas.';
    message.style.display = 'block';
}

function showLoadingMessage() {
    const message = document.getElementById('message');
    message.innerHTML = 'Cargando...';
    message.style.display = 'block';
}

function showNotFoundMessage() {
    const message = document.getElementById('message');
    message.innerHTML = 'No se encontraron casas con el filtro proporcionado.';
    message.style.display = 'block';
}

function hideMessage() {
    const message = document.getElementById('message');
    message.style.display = 'none';
}

//#endregion FILTROS

// #region videogame description

//se crea clase de descripcion
class VideoGameDescriptor {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

//modifica api para formato¿
function mapAPIToVideoGameDescriptors(data) {
    return data.map(item => {
        return new VideoGameDescriptor(
            item.id,
            item.name,
            item.price
        );
    });
}

//muestra los datos basicos de los videojuegos
// Funcion que agrega los datos de los videojuegos a la tabla.
function displayVideoGameOptions(videoGames) {
    const videogameFilter = document.getElementById('videogame-filter');
    const videoGameModal = document.getElementById('videogame-name');

    videoGames.forEach(videogame => {
        const optionFilter = document.createElement('option');

        optionFilter.value = videogame.name;
        optionFilter.text = `${videogame.name} - ${formatCurrency(videogame.price)}`;

        videogameFilter.appendChild(optionFilter);

        const optionModal = document.createElement('option');

        optionModal.value = videogame.id;
        optionModal.text = `${videogame.name} - ${formatCurrency(videogame.price)}`;

        videoGameModal.appendChild(optionModal);
    });
}

//hace fect de la api 
function getVideoGameData() {
    fetchAPI(`${apiURL}/catalogo-videojuegos`, 'GET')
        .then(data => {
            const VideoGameList = mapAPIToVideoGameDescriptors(data);
            displayVideoGameOptions(VideoGameList);
        });
}

//#endregion 

//#region crear venta

//procesa la creaicon de una venta
function processSubmitSale() {
    const idVideoGame = document.getElementById('videogame-name').value;
    console.log(idVideoGame);
    const cliente = document.getElementById('customer-name-field').value;
    const videoGame = document.getElementById('videogame-name').options[document.getElementById('videogame-name').selectedIndex].text.split(' - ')[0];
    const vendedor = document.getElementById('salesman-field').value;
    const fechaVenta = document.getElementById('sale-date-field').value;
    const ventaTotal = document.getElementById('sale-price-field').value;

    const saleToSave = new Sale(
        idVideoGame,
        cliente,
        videoGame,
        vendedor,
        fechaVenta,
        parseFloat(ventaTotal),
    );

    console.log(saleToSave);
    createSale(saleToSave);
}

function createSale(sale) {
    fetchAPI(`${apiURL}/ventas-videojuegos`, 'POST', sale)
        .then(sale => {
            closeAddSaleModal();
          //な  resetSales();
            window.alert(`Venta ${sale.id} creada correctamente.`);
        });
}

//#endregion crear venta

//#region ELIMINAR VENTA

function initDeleteSaleButtonHandler() {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            const saleId = button.getAttribute('data-sale-id'); // Obtenemos el ID de la venta
            console.log(saleId);
            
            deleteSale(saleId); // Llamamos a la función para eleminar la venta
        });
    });
}

//#endregion ELIMINAR VENTA

// #region MODAL
function initAddSaleButtonsHandler() {

    document.getElementById('addSale').addEventListener('click', () => {
        openAddSaleModal()
    });

    document.getElementById('modal-background').addEventListener('click', () => {
        closeAddSaleModal();
    });

    document.getElementById('sale-form').addEventListener('submit', event => {
        event.preventDefault();
        processSubmitSale();
    });
}


function openAddSaleModal() {
    document.getElementById('sale-form').reset();
    document.getElementById('modal-background').style.display = 'block';
    document.getElementById('modal').style.display = 'block';
}


function closeAddSaleModal() {
    document.getElementById('sale-form').reset();
    document.getElementById('modal-background').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
}

//#endregion MODAL

//#region APIS COMMANDS

function getSalesData(url,ventaMin,ventaMax) {　//か
    
    fetchAPI(url, 'GET')
        .then(data => {
            const salesList = mapAPIToSales(data);
            salesList.filter(sale => sale.ventaTotal>ventaMin && sale.ventaTotal<ventaMax);
            displaySalesView(salesList);
            
        });
}

function deleteSale(saleId) {
    const confirm = window.confirm(`¿Estás seguro de que deseas eliminar la venta ${saleId}?`);
    if (confirm) {
        fetchAPI(`${apiURL}/ventas-videojuegos/${saleId}`, 'DELETE')
            .then(() => {
                resetSales();
                window.alert("Venta eliminada.");
            });
    }
}

// Funcion que genera la url para consultar ventas con filtros.
function buildGetSalesDataUrl(videogame, customerName, salesman, saleDate) { //か
    // Tecnica de string dinamico: se aconseja cuando tenemos una cantidad limitada de parámetros y
    //    cierto control de los tipos de parametros (id, fechas).
    // const url = `${apiURL}/sales?videogame=${videogame}&customerName=${customerName}&salesman=${salesman}&saleDate=${saleDate}`;

    // URL y URLSearchParams: simplifican la construcción de URLs dinámicas y complejas,
    //    facilitan la gestión de múltiples parámetros y textos dinámicos al encargarse de
    //    la codificación y decodificación de caracteres especiales, lo que evita problemas
    //    comunes relacionados con espacios y caracteres no válidos.
    const url = new URL(`${apiURL}/ventas-videojuegos`);

    if (videogame) {
        url.searchParams.append('videogame', videogame);
    }

    if (customerName) {
        url.searchParams.append('customerName', customerName);
    }

    if (salesman) {
        url.searchParams.append('salesman', salesman);
    }

    if (saleDate) {
        url.searchParams.append('saleDate', saleDate);
    }
    return url;
}

//#endregion APIS COMMANDS


initFilterButtonsHandler();
initAddSaleButtonsHandler();
getVideoGameData();