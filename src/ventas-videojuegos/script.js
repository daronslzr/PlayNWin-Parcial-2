//const apiURL = 'https://65348606e1b6f4c59046c7f9.mockapi.io/api';

//#region FILTROS

//lleva registro de los botones de filtro
function initButtonsHandler() {
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
    searchSales();
}

function searchSales() {
    const videogame = document.getElementById('videogame-filter-filter').value;
    const cliente = document.getElementById('customer-filter').value;
    const vendedor = document.getElementById('salesman-filter').value;
    const venta-min = document.getElementById('sale-total-min').value;
    const venta-max = document.getElementById('sale-total-max').value;
    const fechaVenta = document.getElementById('date-filter').value;

    getSalesData(realEstate, customerName, salesman, saleDate);
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
function displayVideoGameOptions(videoGames) {
    const videogameFilter = document.getElementById('videogame-filter');
    const videoGameModal = document.getElementById('videogame-name');

    videoGames.forEach(videogame => {
        const optionFilter = document.createElement('option');

        optionFilter.value = videogame.name;
        optionFilter.text = `${videogame.name} - ${formatCurrency(videogame.price)}`;

        videogameFilter.appendChild(optionFilter);

        const optionModal = document.createElement('option');

        optionModal.value = videogame.name;
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

//
function processSubmitSale() {
    const cliente = document.getElementById('customer-name-field').value;
    const videogame = document.getElementById('real-estate-field').values;
    const vendedor = document.getElementById('salesman-field').value;
    const fechaVenta = document.getElementById('sale-date-field').value;
    const ventaTotal = document.getElementById('sale-price-field').value;

    const saleToSave = new Sale(
        null,
        cliente,
        videogame,
        vendedor,
        fechaVenta,
        parseFloat(ventaTotal),
    );

    createSale(saleToSave);
}

function createSale(sale) {
    fetchAPI(`${apiURL}/ventas-videojuegos`, 'POST', sale)
        .then(sale => {
            closeAddSaleModal();
            resetSales();
            window.alert(`Venta ${sale.id} creada correctamente.`);
        });
}

//#endregion crear venta

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



initAddSaleButtonsHandler();
initButtonsHandler();
getVideoGameData();