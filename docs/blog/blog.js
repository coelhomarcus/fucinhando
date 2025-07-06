// Variável global para armazenar os posts
let blogPosts = [];

// Carregar dados dos posts
async function loadPostsData() {
    const response = await fetch("../data/posts.json");
    blogPosts = await response.json();
}

// Renderizar os posts
function renderPosts() {
    const postsGrid = document.getElementById("postsGrid");

    blogPosts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "post-card";

        postElement.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}" />
                <span class="post-category">${post.category}</span>
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    <span class="read-more">Ler mais →</span>
                </div>
            </div>
        `;

        postElement.addEventListener("click", () => openModal(post.id));

        postsGrid.appendChild(postElement);
    });
}

// Abrir modal com post completo
function openModal(postId) {
    const post = blogPosts.find((p) => p.id === postId);
    if (!post) return;

    const modal = document.getElementById("postModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDate = document.getElementById("modalDate");
    const modalCategory = document.getElementById("modalCategory");
    const modalImage = document.getElementById("modalImage");
    const modalContent = document.getElementById("modalContent");

    modalTitle.textContent = post.title;
    modalDate.textContent = post.date;
    modalCategory.textContent = post.category;
    modalImage.src = post.image;
    modalImage.alt = post.title;
    modalContent.innerHTML = post.content;

    modal.style.display = "block";
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById("postModal");
    modal.style.display = "none";
}

// Quando a página carrega
document.addEventListener("DOMContentLoaded", async function () {
    await loadPostsData();
    renderPosts();

    // Fechar modal ao clicar no X
    const closeBtn = document.querySelector(".close");
    closeBtn.addEventListener("click", closeModal);

    // Fechar modal ao clicar fora
    const modal = document.getElementById("postModal");
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });
});
