document.addEventListener('DOMContentLoaded', function() {

    // --- ANIMAÇÃO AO ROLAR A PÁGINA ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    // --- NAVEGAÇÃO SUAVE PARA LINKS ÂNCORA ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });
    
    // --- MANIPULAÇÃO DO FORMULÁRIO DE CONTATO COM FORMSPREE ---
    const form = document.getElementById('contact-form');
    
    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.createElement('p');
        const submitButton = form.querySelector('button');
        const data = new FormData(event.target);

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.textContent = "Obrigado! Sua mensagem foi enviada com sucesso.";
                status.className = 'form-success';
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.textContent = "Oops! Ocorreu um problema ao enviar seu formulário.";
                    }
                    status.className = 'form-error';
                });
            }
        }).catch(error => {
            status.textContent = "Oops! Ocorreu um problema ao enviar seu formulário.";
            status.className = 'form-error';
        }).finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Quero uma Demonstração';
            form.appendChild(status);
            setTimeout(() => {
                status.remove();
            }, 5000); // Remove a mensagem de status após 5 segundos
        });
    }
    
    form.addEventListener("submit", handleSubmit);
});