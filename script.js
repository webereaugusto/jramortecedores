// Smooth scrolling para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animação do header ao rolar a página
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Animação dos números
const animateNumbers = () => {
    const numbers = document.querySelectorAll('.count');
    
    numbers.forEach(number => {
        const target = parseInt(number.textContent);
        let count = 0;
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps

        const updateCount = () => {
            if (count < target) {
                count += increment;
                number.textContent = Math.floor(count);
                requestAnimationFrame(updateCount);
            } else {
                number.textContent = target;
            }
        };

        updateCount();
    });
};

// Animação de fade-in para elementos quando aparecem na tela
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Inicia a animação dos números quando a seção "experience-numbers" aparece
            if (entry.target.classList.contains('experience-numbers')) {
                animateNumbers();
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .product-card, .feature, .vehicle-card, .experience-numbers').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
});

// Adiciona classe fade-in com CSS
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Menu mobile
const createMobileMenu = () => {
    const nav = document.querySelector('.nav-container');
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
        .mobile-menu-button {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--primary-color);
            cursor: pointer;
            padding: 0.5rem;
        }

        @media (max-width: 768px) {
            .mobile-menu-button {
                display: block;
            }

            .nav-menu {
                display: none;
                width: 100%;
            }

            .nav-menu.active {
                display: flex;
            }

            .nav-container {
                position: relative;
            }
        }
    `;
    document.head.appendChild(mobileStyle);

    nav.insertBefore(menuButton, nav.firstChild);
    const menu = document.querySelector('.nav-menu');

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
};

createMobileMenu();

// Fecha o menu mobile quando um item é clicado
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.querySelector('.nav-menu');
        menu.classList.remove('active');
    });
});

// Adiciona efeito de parallax no hero e outras seções com parallax
const parallaxSections = document.querySelectorAll('.hero, .parallax-section, .parts-section, .tools-section');

window.addEventListener('scroll', () => {
    parallaxSections.forEach(section => {
        const scrolled = window.pageYOffset;
        const rate = section.dataset.parallaxRate || 0.5;
        section.style.backgroundPositionY = `${scrolled * rate}px`;
    });
});

// Funções para o modal do vídeo
function openVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('youtubeVideo');
    videoFrame.src = 'https://www.youtube.com/embed/FYkE0oooyQE?autoplay=1';
    modal.style.display = 'block';
    
    // Fechar modal ao clicar fora
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeVideoModal();
        }
    };
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('youtubeVideo');
    videoFrame.src = '';
    modal.style.display = 'none';
}

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

// Testimonials Slider
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Update slides
    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.style.transform = 'translateX(0)';
                slide.style.opacity = '1';
                slide.style.position = 'relative';
                slide.style.visibility = 'visible';
                slide.style.zIndex = '5';
            } else {
                let direction = index > currentSlide ? '100%' : '-100%';
                slide.style.transform = `translateX(${direction})`;
                slide.style.opacity = '1';
                slide.style.position = 'absolute';
                slide.style.visibility = 'hidden';
                slide.style.zIndex = '0';
            }
        });
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    // Event listeners
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // Auto advance slides
    setInterval(nextSlide, 5000);

    // Initial setup
    updateSlides();
});

// Accordion para produtos
document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            
            // Adiciona uma pequena pausa antes de fechar os outros itens para um efeito mais suave
            setTimeout(() => {
                // Fecha todos os outros itens
                document.querySelectorAll('.accordion-item').forEach(item => {
                    if (item !== accordionItem && item.classList.contains('active')) {
                        // Adiciona classe que inicia a animação de fechamento
                        item.classList.add('closing');
                        
                        // Remove a classe active e closing após a animação
                        setTimeout(() => {
                            item.classList.remove('active');
                            item.classList.remove('closing');
                        }, 300);
                    }
                });
            }, 50);
            
            // Alterna o estado do item clicado com uma animação suave
            if (accordionItem.classList.contains('active')) {
                // Se estiver ativo, adiciona a classe closing para animar o fechamento
                accordionItem.classList.add('closing');
                setTimeout(() => {
                    accordionItem.classList.remove('active');
                    accordionItem.classList.remove('closing');
                }, 300);
            } else {
                // Se estiver fechado, adiciona a classe para abrir
                accordionItem.classList.add('active');
            }
        });
    });
    
    // Abre o primeiro item por padrão
    if (accordionHeaders.length > 0) {
        accordionHeaders[0].parentElement.classList.add('active');
    }
});

// Processamento do formulário de contato
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formMessage = document.getElementById('formMessage');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Desabilita o botão e mostra loading
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    // Prepara os dados do formulário
    const formData = new FormData(form);
    
    // Envia o formulário
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Mostra a mensagem de resposta
        formMessage.textContent = data.mensagem;
        formMessage.className = 'form-message ' + (data.status === 'sucesso' ? 'success' : 'error');
        formMessage.style.display = 'block';
        
        // Se foi sucesso, limpa o formulário
        if (data.status === 'sucesso') {
            form.reset();
        }
    })
    .catch(error => {
        formMessage.textContent = 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
    })
    .finally(() => {
        // Reabilita o botão
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    });
}); 