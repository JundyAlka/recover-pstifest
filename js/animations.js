// Advanced Animations JavaScript File
document.addEventListener("DOMContentLoaded", () => {
  console.log("Advanced animations ready.")
})

// Add CSS for animations
document.addEventListener("DOMContentLoaded", () => {
  const styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = `
        /* Preloader Animation */
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--dark-navy);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .preloader.hidden {
            opacity: 0;
            visibility: hidden;
        }

        .loader {
            width: 80px;
            height: 80px;
            position: relative;
        }

        .loader:before,
        .loader:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: var(--primary-blue);
        }

        .loader:before {
            z-index: 10;
            animation: spin 1.5s infinite;
        }

        .loader:after {
            border: 3px solid transparent;
            border-top-color: var(--primary-purple);
            animation: spin 2s infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        /* Navbar Animation */
        .navbar {
            transform: translateY(0);
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .navbar.hidden {
            transform: translateY(-100%);
        }

        .navbar.scrolled {
            background: rgba(15, 23, 42, 0.98);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        /* Text Reveal Animation */
        .reveal-text {
            position: relative;
            overflow: hidden;
            display: inline-block;
        }

        .reveal-text span {
            display: inline-block;
            transform: translateY(100%);
            opacity: 0;
            transition: transform 0.5s ease, opacity 0.5s ease;
        }

        .reveal-text.active span {
            transform: translateY(0);
            opacity: 1;
        }

        /* Fade In Animation */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .fade-in.active {
            opacity: 1;
            transform: translateY(0);
        }

        /* Stagger Children Animation */
        .stagger-children > * {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .stagger-children.active > *:nth-child(1) {
            transition-delay: 0.1s;
        }

        .stagger-children.active > *:nth-child(2) {
            transition-delay: 0.2s;
        }

        .stagger-children.active > *:nth-child(3) {
            transition-delay: 0.3s;
        }

        .stagger-children.active > *:nth-child(4) {
            transition-delay: 0.4s;
        }

        .stagger-children.active > *:nth-child(5) {
            transition-delay: 0.5s;
        }

        .stagger-children.active > * {
            opacity: 1;
            transform: translateY(0);
        }

        /* Timeline Animation */
        .timeline-item {
            opacity: 0;
            transform: translateY(50px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .timeline-item.active {
            opacity: 1;
            transform: translateY(0);
        }

        /* Utility Animation Classes */
        .animate-spin {
            animation: spin 2s linear infinite;
        }

        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce {
            animation: bounce 1s infinite;
        }

        .animate-float {
            animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in {
            animation: fadeIn 0.5s ease forwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        /* Responsive Animations */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
    `
  document.head.appendChild(styleSheet)
})
