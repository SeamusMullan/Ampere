// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for header
            behavior: 'smooth'
        });
    });
});

// Add active class to nav items on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`nav a[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`nav a[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
});

// Mobile menu toggle if needed in the future
// const setupMobileMenu = () => {
//     // Implementation for mobile menu toggle
// };

// Code highlighting for code blocks
document.addEventListener('DOMContentLoaded', () => {
    // This is a placeholder for adding syntax highlighting 
    // If you want to add code highlighting, consider adding a library like Prism.js or Highlight.js
});

// Add animation to feature cards
const featureCards = document.querySelectorAll('.feature-card');
if (featureCards.length > 0) {
    const animateOnScroll = () => {
        featureCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Animate on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}