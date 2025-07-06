// Variável global para armazenar os pets
let pets = [];

// Carregar dados dos pets
async function loadPetsData() {
    const response = await fetch("../data/pets.json");
    pets = await response.json();
}

// Renderizar os pets na tela
function renderPets(filterType = "all") {
    const cardsContainer = document.querySelector(".cards-container");
    cardsContainer.innerHTML = "";

    let filteredPets = pets;

    // Aplicar filtros
    if (filterType === "Cão") {
        filteredPets = pets.filter((pet) => pet.details.species === "Cão");
    } else if (filterType === "Gato") {
        filteredPets = pets.filter((pet) => pet.details.species === "Gato");
    } else if (filterType === "filhote") {
        filteredPets = pets.filter((pet) => pet.age.includes("meses"));
    }

    // Criar cards dos pets
    filteredPets.forEach((pet) => {
        const petCard = document.createElement("a");
        petCard.className = "card";
        petCard.href = "#";

        const tagsHTML = pet.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

        petCard.innerHTML = `
            <div class="card-image">
                <img src="${pet.image}" alt="${pet.name}" />
            </div>
            <div class="card-info">
                <h2>${pet.name}</h2>
                <p class="age">${pet.age}</p>
                <p class="location">${pet.location}</p>
                <div class="card-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;

        petCard.addEventListener("click", (e) => {
            e.preventDefault();
            openPetModal(pet.id);
        });

        cardsContainer.appendChild(petCard);
    });
}

// Configurar filtros
function setupFilters() {
    const filterItems = document.querySelectorAll(".filter-item");

    filterItems.forEach((item) => {
        item.addEventListener("click", () => {
            // Remove active de todos os filtros
            filterItems.forEach((f) => f.classList.remove("active"));

            // Adiciona active no filtro clicado
            item.classList.add("active");

            const filterType = item.getAttribute("data-filter");
            renderPets(filterType);
        });
    });
}

// Abrir modal com dados do pet
function openPetModal(petId) {
    const pet = pets.find((p) => p.id === petId);
    if (!pet) return;

    // Criar modal
    let modal = document.getElementById("petModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "petModal";
        modal.className = "modal";
        document.body.appendChild(modal);
    }

    const tagsHTML = pet.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="modal-header">
                <div class="pet-image">
                    <img src="${pet.image}" alt="${pet.name}" />
                </div>
                <div class="pet-basic-info">
                    <h2>${pet.name}</h2>
                    <p class="pet-age">${pet.age}</p>
                    <p class="pet-location">📍 ${pet.location}</p>
                    <div class="pet-tags">${tagsHTML}</div>
                </div>
            </div>
            <div class="modal-body">
                <div class="pet-description">
                    <h3>Sobre o ${pet.name}</h3>
                    <p>${pet.description}</p>
                </div>
                <div class="pet-details">
                    <h3>Informações</h3>
                    <p><strong>Espécie:</strong> ${pet.details.species}</p>
                    <p><strong>Raça:</strong> ${pet.details.breed}</p>
                    <p><strong>Peso:</strong> ${pet.details.weight}</p>
                </div>
                <div class="owner-contact">
                    <h3>Contato</h3>
                    <p><strong>Responsável:</strong> ${pet.owner.name}</p>
                    <p><strong>Telefone:</strong> ${pet.owner.phone}</p>
                    <p><strong>Email:</strong> ${pet.owner.email}</p>
                </div>
            </div>
        </div>
    `;

    // Fechar modal
    modal.querySelector(".close").addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.style.display = "block";
}

// Quando a página carrega
document.addEventListener("DOMContentLoaded", async function () {
    await loadPetsData();
    setupFilters();
    renderPets();
});
