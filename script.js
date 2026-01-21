// Website Pribadi Interaktif - Putri Revalina Yuliani Dewi
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initWebsite();
});

// Main initialization function
function initWebsite() {
    // Initialize all components
    setupNavigation();
    setupContentSections();
    setupIntroduceButton();
    setupPortfolioFilter();
    setupContactForm();
    setupAnimations();
    setupProfileImage();
    
    // Set initial active section
    showContentSection('home');
}

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Navigation link click events
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target section
            const targetSection = this.getAttribute('data-content');
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            showContentSection(targetSection);
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Scroll to top of content
            document.querySelector('.main-content').scrollTop = 0;
        });
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Content sections management
function setupContentSections() {
    const sections = document.querySelectorAll('.content-section');
    
    // Initially hide all sections except home
    sections.forEach(section => {
        if (section.id !== 'homeContent') {
            section.style.display = 'none';
        }
    });
}

// Show specific content section
function showContentSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    
    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionId}Content`);
    if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 10);
    }
}

// Setup profile image (with fallback)
function setupProfileImage() {
    const profileImg = document.getElementById('profileImage');
    const imageUrl = 'https://drive.google.com/thumbnail?id=1F4cuVwYaL20s6DmChfDQnf54GR8tVZpS&sz=w1000';
    
    // Try to load the image from Google Drive
    const img = new Image();
    img.onload = function() {
        profileImg.innerHTML = '';
        profileImg.style.backgroundImage = `url('${imageUrl}')`;
        profileImg.style.backgroundSize = 'cover';
        profileImg.style.backgroundPosition = 'center';
    };
    
    img.onerror = function() {
        // Keep the default icon if image fails to load
        console.log('Gambar tidak dapat dimuat, menggunakan ikon default');
    };
    
    img.src = imageUrl;
}

// Setup "Perkenalkan Saya" button
function setupIntroduceButton() {
    const introduceBtn = document.getElementById('introduceBtn');
    
    introduceBtn.addEventListener('click', function() {
        playIntroduction();
        animateButton(this);
    });
}

// Play voice introduction
function playIntroduction() {
    if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        speechSynthesis.cancel();
        
        // Create introduction text based on user's information
        const introText = `
            Halo, perkenalkan nama saya Putri Revalina Yuliani Dewi.
            Saya adalah siswa SMA Negeri 1 Magetan yang memiliki ketertarikan terhadap hal-hal baru,
            terutama yang bermanfaat dan dapat memberikan dampak positif bagi orang lain.
            
            Saya senang belajar hal baru serta mengembangkan diri melalui berbagai pengalaman 
            dan proses pembelajaran. Saya merupakan pribadi yang sedikit tertutup di awal,
            namun akan menjadi lebih terbuka dan nyaman ketika sudah mengenal dan dekat dengan orang lain.
            
            Saya memiliki kepribadian yang santai, tetapi tetap mampu menyesuaikan diri 
            dengan situasi dan kondisi yang ada. Keahlian utama saya adalah kemampuan beradaptasi,
            belajar cepat, dan berkomunikasi dengan baik.
            
            Melalui website pribadi ini, saya ingin berbagi minat, pengalaman, dan informasi mengenai saya,
            sekaligus menjadikannya sebagai ruang untuk terus berkembang dan belajar.
            Terima kasih telah mengunjungi website saya!
        `;
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(introText);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9; // Kecepatan sedang untuk kejelasan
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Try to find a female voice
        const voices = speechSynthesis.getVoices();
        let selectedVoice = voices[0]; // Default voice
        
        // Prioritize Indonesian female voice
        const indonesianFemaleVoice = voices.find(voice => 
            (voice.lang.startsWith('id') || voice.lang.includes('ID')) && 
            voice.name.toLowerCase().includes('female')
        );
        
        const indonesianVoice = voices.find(voice => 
            voice.lang.startsWith('id') || voice.lang.includes('ID')
        );
        
        if (indonesianFemaleVoice) {
            selectedVoice = indonesianFemaleVoice;
        } else if (indonesianVoice) {
            selectedVoice = indonesianVoice;
        }
        
        utterance.voice = selectedVoice;
        
        // Add visual feedback
        const profileImg = document.querySelector('.profile-img');
        const originalBackground = profileImg.style.backgroundImage;
        
        // Change appearance while speaking
        const introduceBtn = document.getElementById('introduceBtn');
        introduceBtn.innerHTML = '<i class="fas fa-stop"></i> Berhenti';
        introduceBtn.classList.add('speaking');
        
        // Handle speech events
        utterance.onstart = function() {
            // Add pulsing animation to profile image
            profileImg.style.animation = 'pulse 1.5s infinite';
            profileImg.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.5)';
        };
        
        utterance.onend = function() {
            // Reset visual effects
            profileImg.style.animation = '';
            profileImg.style.boxShadow = '0 5px 15px rgba(138, 43, 226, 0.2)';
            introduceBtn.innerHTML = '<i class="fas fa-volume-up"></i> Perkenalkan Saya';
            introduceBtn.classList.remove('speaking');
        };
        
        utterance.onerror = function(event) {
            console.error('Kesalahan sintesis suara:', event);
            // Reset visual effects
            profileImg.style.animation = '';
            profileImg.style.boxShadow = '0 5px 15px rgba(138, 43, 226, 0.2)';
            introduceBtn.innerHTML = '<i class="fas fa-volume-up"></i> Perkenalkan Saya';
            introduceBtn.classList.remove('speaking');
            
            // Fallback: Show text introduction
            showTextIntroduction();
        };
        
        // Speak the introduction
        speechSynthesis.speak(utterance);
        
        // Add stop functionality
        introduceBtn.onclick = function(e) {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                // Reset button immediately
                introduceBtn.innerHTML = '<i class="fas fa-volume-up"></i> Perkenalkan Saya';
                introduceBtn.classList.remove('speaking');
                profileImg.style.animation = '';
                profileImg.style.boxShadow = '0 5px 15px rgba(138, 43, 226, 0.2)';
                e.stopPropagation();
            } else {
                playIntroduction();
            }
        };
        
    } else {
        // Fallback for browsers without speech synthesis
        showTextIntroduction();
    }
}

// Show text introduction as fallback
function showTextIntroduction() {
    const introModal = document.createElement('div');
    introModal.className = 'intro-modal';
    introModal.innerHTML = `
        <div class="modal-content">
            <h3><i class="fas fa-user-circle"></i> Perkenalan Singkat</h3>
            <p>Halo, perkenalkan nama saya <strong>Putri Revalina Yuliani Dewi</strong>.</p>
            <p>Saya adalah siswa SMA Negeri 1 Magetan yang memiliki ketertarikan terhadap hal-hal baru, terutama yang bermanfaat dan dapat memberikan dampak positif bagi orang lain.</p>
            <p>Saya senang belajar hal baru serta mengembangkan diri melalui berbagai pengalaman dan proses pembelajaran. Saya merupakan pribadi yang sedikit tertutup di awal, namun akan menjadi lebih terbuka dan nyaman ketika sudah mengenal dan dekat dengan orang lain.</p>
            <p>Keahlian utama saya adalah kemampuan beradaptasi, belajar cepat, dan berkomunikasi dengan baik.</p>
            <button class="btn-primary close-modal">Tutup</button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .intro-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
            padding: 1rem;
        }
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 100%;
            animation: slideUp 0.3s ease;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .modal-content h3 {
            color: #8A2BE2;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'Montserrat', sans-serif;
        }
        .modal-content p {
            margin-bottom: 1rem;
            line-height: 1.6;
            color: #555;
        }
        .modal-content strong {
            color: #8A2BE2;
        }
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(introModal);
    
    // Close modal button
    const closeBtn = introModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(introModal);
        document.head.removeChild(style);
    });
    
    // Close on background click
    introModal.addEventListener('click', function(e) {
        if (e.target === introModal) {
            document.body.removeChild(introModal);
            document.head.removeChild(style);
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(introModal);
            document.head.removeChild(style);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Animate button on click
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// Setup portfolio filter
function setupPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter category
            const filter = this.getAttribute('data-filter');
            
            // Filter items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Harap lengkapi semua field sebelum mengirim pesan.', 'error');
                return;
            }
            
            // Show success message
            showNotification(`Terima kasih ${name}! Pesan Anda telah dikirim. Saya akan membalas segera.`);
            
            // Reset form
            this.reset();
            
            // In a real application, you would send the data to a server here
            console.log('Pesan dikirim:', { name, email, message });
        });
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3300);
}

// Setup animations
function setupAnimations() {
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
    
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll(
        '.portfolio-item, .education-card, .contact-item, .hobby-card, .info-card, .timeline-content'
    );
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                elementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        elementObserver.observe(element);
    });
}

// Load voices for speech synthesis
if ('speechSynthesis' in window) {
    // Some browsers need this event to load voices
    speechSynthesis.onvoiceschanged = function() {
        console.log('Suara tersedia:', speechSynthesis.getVoices().length);
    };
}

// Add keyboard shortcuts for better accessibility
document.addEventListener('keydown', function(e) {
    // Alt + P for introduction
    if (e.altKey && e.key === 'p') {
        e.preventDefault();
        document.getElementById('introduceBtn').click();
    }
    
    // Escape to stop speech or close modals
    if (e.key === 'Escape') {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            const introduceBtn = document.getElementById('introduceBtn');
            introduceBtn.innerHTML = '<i class="fas fa-volume-up"></i> Perkenalkan Saya';
            introduceBtn.classList.remove('speaking');
            
            const profileImg = document.querySelector('.profile-img');
            profileImg.style.animation = '';
            profileImg.style.boxShadow = '0 5px 15px rgba(138, 43, 226, 0.2)';
        }
        
        // Close any open modal
        const modal = document.querySelector('.intro-modal');
        if (modal) {
            modal.remove();
            const style = document.querySelector('style[data-modal-style]');
            if (style) style.remove();
        }
    }
    
    // Number keys 1-8 for navigation
    if (e.altKey && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks[index]) {
            navLinks[index].click();
        }
    }
});

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add loading state for images
window.addEventListener('load', function() {
    // Remove loading class from profile image
    const profileImg = document.getElementById('profileImage');
    profileImg.classList.remove('loading');
});