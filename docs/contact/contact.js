document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector(".btn-primary");
            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Enviando...";
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = "Mensagem Enviada!";
                submitBtn.style.background = "#28a745";
                contactForm.reset();
                showSuccessMessage();

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = "";
                }, 3000);
            }, 2000);
        });
    }
});

function showSuccessMessage() {
    const notification = document.createElement("div");
    notification.className = "success-notification";
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-text">Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    const removeNotification = () => {
        notification.style.animation = "slideOutRight 0.5s ease";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    };

    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", removeNotification);
    setTimeout(removeNotification, 5000);
}
