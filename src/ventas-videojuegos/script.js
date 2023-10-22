
function initButtonsHandler() {

    document.getElementById('filter-form').addEventListener('submit', event => {
        event.preventDefault();
        //applyFilters();
    });

    document.getElementById('reset-filters').addEventListener('click', () => {
        document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
        //applyFilters();
    });

    const closeFilter = document.getElementById('close-filters');
    closeFilter.addEventListener("click", () => {
        document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
        //applyFilters();
        document.getElementById('filter-section').style.display = "none";
        showFilter.style.display = "block";
    })
}

const showFilter = document.getElementById('showFilters');
showFilter.addEventListener("click", () => {
    document.getElementById('filter-section').style.display = "flex";
    showFilter.style.display = "none";
})

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


function processSubmitSale() {
    const cliente = document.getElementById('customer-name-field').value;
    const videogame = document.getElementById('videogame-name').value;
    const vendedor = document.getElementById('vendedor-field').value;
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

    fetchAPI(`${apiURL}/sales`, 'POST', sale)
        .then(sale => {
            closeAddSaleModal();
            resetSales();
            window.alert(`Venta ${sale.id} creada correctamente.`);
        });

}

initAddSaleButtonsHandler();
initButtonsHandler();