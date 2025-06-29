document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initNavigation()
  initScrollAnimations()
  initCounters()
  initParallax()
  initSmoothScrolling()
  initPreloader()
  initTypingAnimation()
  initMobileMenu()
  initHeroAnimations()
  initCardHoverEffects()
  initTimelineAnimations()
  initTextAnimations()
  initScrollBasedAnimations()
  initInteractiveElements()
  initModals()

  console.log("PSTI FEST 2025 website loaded successfully!")
})

// Navigation functionality
function initNavigation() {
  const navbar = document.getElementById("navbar")
  const navLinks = document.querySelectorAll(".nav-link")
  let lastScrollTop = 0

  // Navbar scroll behavior
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Add scrolled class for styling
    if (scrollTop > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      navbar.classList.add("hidden")
    } else {
      navbar.classList.remove("hidden")
    }

    lastScrollTop = scrollTop
  })

  // Active link highlighting
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]")
    const scrollPos = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
          }
        })
      }
    })
  })
}

// Mobile menu functionality
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active")

        // Special handling for staggered animations
        if (entry.target.classList.contains("stagger-children")) {
          const children = entry.target.children
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("active")
            }, index * 100)
          })
        }
      }
    })
  }, observerOptions)

  // Observe elements for scroll animations
  const animatedElements = document.querySelectorAll(
    ".fade-in, .scroll-animate, .stagger-children, .timeline-item, .competition-card, .mentor-card, .guidebook-card",
  )
  animatedElements.forEach((el) => observer.observe(el))
}

// Counter animation
function initCounters() {
  const counters = document.querySelectorAll(".stat-number")
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = Number.parseInt(counter.getAttribute("data-target"))
          const duration = 2000 // 2 seconds
          const increment = target / (duration / 16) // 60fps
          let current = 0

          const updateCounter = () => {
            current += increment
            if (current < target) {
              counter.textContent = Math.floor(current)
              requestAnimationFrame(updateCounter)
            } else {
              counter.textContent = target
            }
          }

          updateCounter()
          counterObserver.unobserve(counter)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => counterObserver.observe(counter))
}

// Parallax effect
function initParallax() {
  const parallaxElements = document.querySelectorAll(".parallax")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.5

    parallaxElements.forEach((element) => {
      element.style.transform = `translateY(${rate}px)`
    })
  })

  // Geometric shapes parallax
  const shapes = document.querySelectorAll(".shape")
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset

    shapes.forEach((shape, index) => {
      const rate = scrolled * (0.2 + index * 0.1)
      shape.style.transform = `translateY(${rate}px) rotate(${rate * 0.1}deg)`
    })
  })
}

// Smooth scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))

      if (target) {
        const offsetTop = target.offsetTop - 70 // Account for navbar height

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Preloader
function initPreloader() {
  const preloader = document.createElement("div")
  preloader.className = "preloader"
  preloader.innerHTML = '<div class="loader"></div>'
  document.body.appendChild(preloader)

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hidden")
      setTimeout(() => {
        preloader.remove()
      }, 500)
    }, 1000)
  })
}

// Typing animation
function initTypingAnimation() {
  const typingElements = document.querySelectorAll(".typing-animation")

  typingElements.forEach((element) => {
    const text = element.textContent
    element.textContent = ""
    element.style.width = "0"

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeText(element, text)
            observer.unobserve(element)
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(element)
  })
}

function typeText(element, text) {
  let index = 0
  element.style.width = "auto"

  const typeInterval = setInterval(() => {
    element.textContent += text[index]
    index++

    if (index >= text.length) {
      clearInterval(typeInterval)
    }
  }, 100)
}

// Hero Section Animations
function initHeroAnimations() {
  const heroTitle = document.querySelector(".hero-title")
  const heroSubtitle = document.querySelector(".hero-subtitle")
  const heroDescription = document.querySelector(".hero-description")
  const heroButtons = document.querySelectorAll(".hero-buttons .btn")
  const heroTrophy = document.querySelector(".hero-trophy")

  // Animate title with reveal effect
  if (heroTitle) {
    heroTitle.classList.add("reveal-text")
    const titleSpans = heroTitle.querySelectorAll("span")
    titleSpans.forEach((span, index) => {
      span.style.transitionDelay = `${index * 0.1}s`
    })
    setTimeout(() => heroTitle.classList.add("active"), 500)
  }
  // Animate subtitle and description with fade-in
  ;[heroSubtitle, heroDescription].forEach((el, index) => {
    if (el) {
      el.classList.add("fade-in")
      el.style.transitionDelay = `${0.5 + index * 0.2}s`
      setTimeout(() => el.classList.add("active"), 500)
    }
  })

  // Animate buttons with stagger effect
  heroButtons.forEach((btn, index) => {
    btn.classList.add("fade-in")
    btn.style.transitionDelay = `${0.9 + index * 0.15}s`
    setTimeout(() => btn.classList.add("active"), 500)
  })

  // Animate trophy with float and glow
  if (heroTrophy) {
    heroTrophy.classList.add("animate-float")
    const trophyGlow = document.querySelector(".trophy-glow")
    if (trophyGlow) trophyGlow.classList.add("animate-pulse")
  }

  // Animate geometric shapes in hero background
  const shapes = document.querySelectorAll(".hero-background .shape")
  shapes.forEach((shape, index) => {
    shape.style.animationDelay = `${index * 0.5}s`
  })
}

// Competition Card Hover Effects
function initCardHoverEffects() {
  const cards = document.querySelectorAll(".competition-card, .mentor-card, .guidebook-card")
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 15
      const rotateY = (centerX - x) / 15

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
      card.style.boxShadow = `0px ${10 + Math.abs(rotateX)}px ${20 + Math.abs(rotateY) * 2}px rgba(0,0,0,0.2), var(--shadow-glow-purple)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
      card.style.boxShadow = "var(--shadow-md)"
    })

    // Fix for buttons growing when clicked
    const cardBtn = card.querySelector(".card-btn")
    if (cardBtn) {
      cardBtn.addEventListener("mousedown", function (e) {
        e.stopPropagation()
        this.style.transform = "translateY(1px)"
      })

      cardBtn.addEventListener("mouseup", function () {
        this.style.transform = ""
      })
    }
  })
}

// Timeline Animations
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll(".timeline-item")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.3 },
  )

  timelineItems.forEach((item) => {
    observer.observe(item)
  })
}

// Text Animations
function initTextAnimations() {
  const animatedTexts = document.querySelectorAll(".section-title, .hero-subtitle")
  animatedTexts.forEach((textEl) => {
    // Skip if already processed
    if (textEl.classList.contains("text-animated")) return

    const text = textEl.textContent
    textEl.innerHTML = ""
    textEl.classList.add("text-animated")

    text.split("").forEach((char, index) => {
      const span = document.createElement("span")
      span.textContent = char === " " ? "\u00A0" : char
      span.style.display = "inline-block"
      span.style.opacity = "0"
      span.style.transform = "translateY(20px)"
      span.style.transition = `opacity 0.5s ease ${index * 0.03}s, transform 0.5s ease ${index * 0.03}s`
      textEl.appendChild(span)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(textEl.children).forEach((span) => {
              span.style.opacity = "1"
              span.style.transform = "translateY(0px)"
            })
            observer.unobserve(textEl)
          }
        })
      },
      { threshold: 0.5 },
    )
    observer.observe(textEl)
  })
}

// Scroll-Based Animations
function initScrollBasedAnimations() {
  // Parallax for specific elements
  const parallaxElements = document.querySelectorAll(".seminar-visual img, .about-image")
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset
    parallaxElements.forEach((el) => {
      const speed = 0.05
      el.style.transform = `translateY(${scrollY * speed}px)`
    })
  })

  // Animate elements into view with more complex transforms
  const complexAnimatedElements = document.querySelectorAll(".feature, .stat-item")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("complex-active")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 },
  )

  complexAnimatedElements.forEach((el) => {
    el.classList.add("complex-animate")
    observer.observe(el)
  })
}

// Interactive Elements
function initInteractiveElements() {
  // Magnetic Buttons with reduced effect
  const magneticButtons = document.querySelectorAll(".btn-primary, .btn-secondary")
  magneticButtons.forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      button.style.transform = `translate(${x * 0.1}px, ${y * 0.15}px)`
      button.style.transition = "transform 0.1s ease-out"
    })

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0,0)"
      button.style.transition = "transform 0.3s ease"
    })

    // Fix for buttons growing when clicked
    button.addEventListener("mousedown", function () {
      this.style.transform = "translateY(1px)"
      this.style.boxShadow = "none"
    })

    button.addEventListener("mouseup", function () {
      this.style.transform = ""
      this.style.boxShadow = ""
    })
  })
}

// Modal functionality
function initModals() {
  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none"
    }
  })
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
    document.body.style.overflow = "hidden"
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// Registration form functions
function openRegistrationForm(category) {
  const registrationUrls = {
    ideathon: "https://bit.ly/PendaftaranLombaIdeathonPSTI",
    smartvillage: "https://forms.gle/smartvillage-registration",
    badminton: "https://forms.gle/badminton-registration",
    seminar: "https://forms.gle/seminar-registration",
  }

  const url = registrationUrls[category]
  if (url) {
    window.open(url, "_blank")
  }

  // Close any open modals
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none"
  })
  document.body.style.overflow = "auto"
}

// Button ripple effect
function createRipple(event) {
  const button = event.currentTarget
  const circle = document.createElement("span")
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`
  circle.classList.add("ripple")

  const ripple = button.getElementsByClassName("ripple")[0]
  if (ripple) {
    ripple.remove()
  }

  button.appendChild(circle)
}

// Add ripple effect to buttons
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn, .card-btn").forEach((button) => {
    button.addEventListener("click", createRipple)
  })
})

// Scroll indicator
function updateScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator")
  if (scrollIndicator) {
    const scrolled = window.pageYOffset
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercentage = (scrolled / maxScroll) * 100

    if (scrollPercentage > 10) {
      scrollIndicator.style.opacity = "0"
    } else {
      scrollIndicator.style.opacity = "1"
    }
  }
}

window.addEventListener("scroll", updateScrollIndicator)

// Performance optimization
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  updateScrollIndicator()
}, 10)

window.addEventListener("scroll", optimizedScrollHandler)

// Add CSS for complex animations
document.addEventListener("DOMContentLoaded", () => {
  const styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = `
        .complex-animate {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
            transition: opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                        transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .complex-animate.complex-active {
            opacity: 1;
            transform: scale(1) translateY(0px);
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `
  document.head.appendChild(styleSheet)
})

// Export functions for external use
window.PSTIFest = {
  openModal,
  closeModal,
  openRegistrationForm,
  initScrollAnimations,
  initCounters,
  initParallax,
  createRipple,
}
