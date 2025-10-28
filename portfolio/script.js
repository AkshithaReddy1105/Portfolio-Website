// Theme Toggle
const body = document.body;
const toggleInput = document.querySelector(".switch input");

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.classList.add(currentTheme);
if (currentTheme === 'dark') {
  toggleInput.checked = true;
}

toggleInput.addEventListener("change", () => {
  if (toggleInput.checked) {
    body.classList.remove("light");
    body.classList.add("dark");
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    localStorage.setItem('theme', 'light');
  }
});

// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
  easing: 'ease-out-cubic'
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});

// Add active state to navigation links
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightNavigation() {
  const scrollPosition = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.style.color = 'var(--primary-color)';
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavigation);

// Parallax effect for hero section
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  });
}

// Add loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Cursor follower effect (optional, for premium feel)
const cursor = document.createElement('div');
cursor.classList.add('cursor-follower');
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  requestAnimationFrame(animateCursor);
}

animateCursor();

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-tag, .achievement-card');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(1.5)';
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
  });
});

// Add CSS for cursor follower
const style = document.createElement('style');
style.textContent = `
  .cursor-follower {
    width: 20px;
    height: 20px;
    border: 2px solid var(--primary-color);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease;
    mix-blend-mode: difference;
  }
  
  @media (max-width: 768px) {
    .cursor-follower {
      display: none;
    }
  }
`;
document.head.appendChild(style);

// Add typing effect to hero title (optional)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const text = heroTitle.innerHTML;
  heroTitle.innerHTML = '';
  let i = 0;
  
  function typeWriter() {
    if (i < text.length) {
      heroTitle.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
  
  // Uncomment to enable typing effect
  // setTimeout(typeWriter, 500);
}

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  width: 0%;
  z-index: 10000;
  transition: width 0.1s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.pageYOffset / windowHeight) * 100;
  scrollProgress.style.width = scrolled + '%';
});

// Console message for developers
console.log('%c👋 Hey there, developer!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cThis portfolio was crafted with ❤️ by Akshita Reddy Banala', 'color: #764ba2; font-size: 14px;');
console.log('%cInterested in the code? Check out my GitHub!', 'color: #667eea; font-size: 12px;');