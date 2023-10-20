const showFilter = document.getElementById('showFilters');
showFilter.addEventListener("click", () => {
    document.getElementById('filter-section').style.display = "flex";
    showFilter.style.display = "none";
})