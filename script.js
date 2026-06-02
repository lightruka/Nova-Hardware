/**
 * Fichier script.js pour Nova Hardware
 * Gère l'interactivité : Menu mobile, animations au défilement et validation du formulaire.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       1. Gestion du Menu Mobile Interactif (Bouton Burger)
       ========================================================================== */
    const burgerMenu = document.querySelector('.burger-menu');
    const mainNav = document.querySelector('.main-navigation');
    
    if (burgerMenu && mainNav) {
        // Au clic sur le bouton burger, on bascule les classes pour ouvrir/fermer le menu
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('open');
            mainNav.classList.toggle('active');
        });
    }

    // Pour une meilleure UX : on ferme le menu si l'utilisateur clique sur un lien (pour naviguer vers une section)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                burgerMenu.classList.remove('open');
                mainNav.classList.remove('active');
            }
        });
    });

    /* ==========================================================================
       2. Animations au Défilement (Scroll Reveal avec IntersectionObserver)
       ========================================================================== */
    // Options de l'observateur : se déclenche quand l'élément est à 15% visible à l'écran
    const observerOptions = {
        root: null, // observe par rapport au viewport (fenêtre du navigateur)
        rootMargin: '0px',
        threshold: 0.15 
    };

    // Callback exécuté quand les éléments entrent ou sortent du champ de vision
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute la classe 'visible' qui déclenche l'animation CSS (opacity -> 1, translateY -> 0)
                entry.target.classList.add('visible');
                // On arrête d'observer l'élément pour que l'animation ne se joue qu'une seule fois
                observer.unobserve(entry.target); 
            }
        });
    };

    const scrollObserver = new IntersectionObserver(revealCallback, observerOptions);

    // Sélection de tous les éléments à animer : les sections globales, mais aussi 
    // individuellement les cartes spécifiques (Rayons) et les blocs de l'Atelier Services
    const elementsToReveal = document.querySelectorAll(`
        section, 
        .univers-card, 
        .service-block, 
        .actu-card
    `);

    // On prépare les éléments en leur ajoutant la classe de base 
    // (qui les masque initialement et les décale vers le bas)
    elementsToReveal.forEach(el => {
        el.classList.add('fade-in'); // 'fade-in' gère l'effet "fade-in up" via le CSS
        scrollObserver.observe(el);
    });

    /* ==========================================================================
       3. Gestion du Formulaire de Contact / Devis de Réparation
       ========================================================================== */
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', (e) => {
            // Empêche le rechargement par défaut de la page pour une expérience fluide
            e.preventDefault(); 
            
            // Vérification rapide des champs (le HTML5 'required' bloque déjà les envois vides, 
            // mais on s'assure qu'ils ne contiennent pas que des espaces)
            const nom = document.getElementById('nom').value.trim();
            const email = document.getElementById('email').value.trim();
            const objet = document.getElementById('objet').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!nom || !email || !objet || !message) {
                formMessage.textContent = 'Veuillez remplir tous les champs obligatoires.';
                formMessage.className = 'form-message error'; // En cas d'erreur
                formMessage.style.display = 'block';
                return;
            }

            const btnSubmit = contactForm.querySelector('.btn-submit');
            const originalText = btnSubmit.textContent;
            
            // Changement dynamique du bouton pour montrer que l'envoi est en cours
            btnSubmit.textContent = 'Envoi en cours...';
            btnSubmit.disabled = true;

            // Simulation d'une requête réseau (ex: Fetch API vers un backend) avec un délai de 1.5s
            setTimeout(() => {
                // Réinitialisation de l'état du bouton
                btnSubmit.textContent = originalText;
                btnSubmit.disabled = false;
                
                // Vidage complet des champs du formulaire
                contactForm.reset();

                // Affichage du message de succès dynamique et personnalisé
                formMessage.textContent = 'Demande de réparation ou question sur le stock envoyée avec succès ! Notre équipe vous contactera très vite.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';

                // Masquer le message de succès automatiquement après 6 secondes
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 6000);
            }, 1500);
        });
    }
});
