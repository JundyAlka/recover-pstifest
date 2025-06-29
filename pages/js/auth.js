/**
 * Enhanced Authentication JavaScript
 * PSTI FEST 2025 Website
 */

class AuthManager {
    constructor() {
        this.apiBaseUrl = '../php/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordToggles();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Social login buttons
        const googleBtn = document.querySelector('.google-btn');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleGoogleLogin());
        }
    }

    setupPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const input = toggle.parentElement.querySelector('.form-input');
                const eyeOpen = toggle.querySelector('.eye-open');
                const eyeClosed = toggle.querySelector('.eye-closed');

                if (input.type === 'password') {
                    input.type = 'text';
                    eyeOpen.style.display = 'none';
                    eyeClosed.style.display = 'block';
                } else {
                    input.type = 'password';
                    eyeOpen.style.display = 'block';
                    eyeClosed.style.display = 'none';
                }
            });
        });
    }

    setupFormValidation() {
        // Real-time validation for registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            const inputs = registerForm.querySelectorAll('.form-input');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });

            // Password confirmation validation
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            if (password && confirmPassword) {
                confirmPassword.addEventListener('input', () => {
                    this.validatePasswordMatch(password, confirmPassword);
                });
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('#loginBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Show loading state
        this.setLoadingState(submitBtn, btnText, btnLoader, true);
        
        try {
            const formData = new FormData(form);
            const data = {
                identifier: formData.get('email'),
                password: formData.get('password'),
                remember: formData.get('remember') === 'on'
            };

            const response = await this.makeRequest('login.php', 'POST', data);
            
            if (response.success) {
                this.showSuccess(response.message);
                
                // Redirect after successful login
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            this.showError('Terjadi kesalahan koneksi. Silakan coba lagi.');
            console.error('Login error:', error);
        } finally {
            this.setLoadingState(submitBtn, btnText, btnLoader, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('#registerBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Validate form
        if (!this.validateRegistrationForm(form)) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(submitBtn, btnText, btnLoader, true);
        
        try {
            const formData = new FormData(form);
            const data = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                username: formData.get('username'),
                phone: formData.get('phone'),
                institution: formData.get('institution'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                terms: formData.get('terms') === 'on'
            };

            const response = await this.makeRequest('user-register.php', 'POST', data);
            
            if (response.success) {
                this.showSuccess(response.message);
                
                // Reset form
                form.reset();
                
                // Redirect to login page after successful registration
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                if (response.errors) {
                    this.showFieldErrors(response.errors);
                } else {
                    this.showError(response.message);
                }
            }
        } catch (error) {
            this.showError('Terjadi kesalahan koneksi. Silakan coba lagi.');
            console.error('Registration error:', error);
        } finally {
            this.setLoadingState(submitBtn, btnText, btnLoader, false);
        }
    }

    handleGoogleLogin() {
        this.showInfo('Fitur login dengan Google akan segera tersedia.');
    }

    validateRegistrationForm(form) {
        let isValid = true;
        
        // Clear previous errors
        this.clearAllErrors();
        
        // Get form data
        const formData = new FormData(form);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const terms = formData.get('terms');
        
        // Password validation
        if (password.length < 8) {
            this.showFieldError('password', 'Password minimal 8 karakter');
            isValid = false;
        }
        
        // Password confirmation
        if (password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Konfirmasi password tidak cocok');
            isValid = false;
        }
        
        // Terms validation
        if (!terms) {
            this.showError('Anda harus menyetujui syarat dan ketentuan');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        
        // Clear previous error
        this.clearFieldError(input);
        
        // Required field validation
        if (input.required && !value) {
            this.showFieldError(fieldName, 'Field ini wajib diisi');
            return false;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(fieldName, 'Format email tidak valid');
                return false;
            }
        }
        
        // Username validation
        if (fieldName === 'username' && value) {
            if (value.length < 3) {
                this.showFieldError(fieldName, 'Username minimal 3 karakter');
                return false;
            }
            if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                this.showFieldError(fieldName, 'Username hanya boleh mengandung huruf, angka, dan underscore');
                return false;
            }
        }
        
        // Phone validation
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^[0-9+\-\s()]+$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(fieldName, 'Format nomor telepon tidak valid');
                return false;
            }
        }
        
        return true;
    }

    validatePasswordMatch(passwordInput, confirmPasswordInput) {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        this.clearFieldError(confirmPasswordInput);
        
        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Konfirmasi password tidak cocok');
            return false;
        }
        
        return true;
    }

    showFieldError(fieldName, message) {
        const input = document.querySelector(`[name="${fieldName}"]`);
        if (input) {
            const wrapper = input.closest('.input-wrapper');
            if (wrapper) {
                wrapper.classList.add('error');
                
                // Remove existing error message
                const existingError = wrapper.parentElement.querySelector('.field-error');
                if (existingError) {
                    existingError.remove();
                }
                
                // Add error message
                const errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.textContent = message;
                errorElement.style.cssText = `
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    animation: fadeIn 0.3s ease;
                `;
                wrapper.parentElement.appendChild(errorElement);
            }
        }
    }

    showFieldErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            this.showFieldError(fieldName, errors[fieldName]);
        });
    }

    clearFieldError(input) {
        const wrapper = input.closest('.input-wrapper');
        if (wrapper) {
            wrapper.classList.remove('error');
            const errorElement = wrapper.parentElement.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    clearAllErrors() {
        const errorElements = document.querySelectorAll('.field-error');
        errorElements.forEach(element => element.remove());
        
        const errorWrappers = document.querySelectorAll('.input-wrapper.error');
        errorWrappers.forEach(wrapper => wrapper.classList.remove('error'));
    }

    setLoadingState(button, textElement, loaderElement, isLoading) {
        if (isLoading) {
            button.disabled = true;
            textElement.style.display = 'none';
            loaderElement.style.display = 'flex';
            button.classList.add('loading');
        } else {
            button.disabled = false;
            textElement.style.display = 'block';
            loaderElement.style.display = 'none';
            button.classList.remove('loading');
        }
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.apiBaseUrl}/${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.auth-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${this.getNotificationIcon(type)}
                </div>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 10000;
            max-width: 400px;
            background: ${this.getNotificationColor(type)};
            border: 1px solid ${this.getNotificationBorderColor(type)};
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease;
        `;

        // Add to document
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: 'rgba(34, 197, 94, 0.1)',
            error: 'rgba(239, 68, 68, 0.1)',
            info: 'rgba(59, 130, 246, 0.1)'
        };
        return colors[type] || colors.info;
    }

    getNotificationBorderColor(type) {
        const colors = {
            success: 'rgba(34, 197, 94, 0.3)',
            error: 'rgba(239, 68, 68, 0.3)',
            info: 'rgba(59, 130, 246, 0.3)'
        };
        return colors[type] || colors.info;
    }
}

// Enhanced form interactions
class FormEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupInputAnimations();
        this.setupFormProgress();
    }

    setupInputAnimations() {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const wrapper = input.closest('.input-wrapper');
                if (wrapper) {
                    wrapper.classList.add('focused');
                }
            });

            input.addEventListener('blur', () => {
                const wrapper = input.closest('.input-wrapper');
                if (wrapper) {
                    wrapper.classList.remove('focused');
                    if (input.value.trim()) {
                        wrapper.classList.add('filled');
                    } else {
                        wrapper.classList.remove('filled');
                    }
                }
            });

            // Check initial state
            if (input.value.trim()) {
                const wrapper = input.closest('.input-wrapper');
                if (wrapper) {
                    wrapper.classList.add('filled');
                }
            }
        });
    }

    setupFormProgress() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            const inputs = registerForm.querySelectorAll('.form-input[required]');
            const progressBar = this.createProgressBar();
            
            if (progressBar) {
                inputs.forEach(input => {
                    input.addEventListener('input', () => {
                        this.updateProgress(inputs, progressBar);
                    });
                });
            }
        }
    }

    createProgressBar() {
        const form = document.getElementById('registerForm');
        if (!form) return null;

        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress';
        progressContainer.innerHTML = `
            <div class="progress-label">Progress Pendaftaran</div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">0%</div>
        `;

        progressContainer.style.cssText = `
            margin-bottom: 2rem;
            padding: 1rem;
            background: rgba(30, 41, 59, 0.5);
            border-radius: 0.5rem;
            border: 1px solid rgba(6, 182, 212, 0.2);
        `;

        form.insertBefore(progressContainer, form.firstChild);
        return progressContainer;
    }

    updateProgress(inputs, progressContainer) {
        const filledInputs = Array.from(inputs).filter(input => input.value.trim());
        const progress = (filledInputs.length / inputs.length) * 100;
        
        const progressFill = progressContainer.querySelector('.progress-fill');
        const progressText = progressContainer.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
            
            // Change color based on progress
            if (progress < 30) {
                progressFill.style.background = 'linear-gradient(90deg, #ef4444, #f97316)';
            } else if (progress < 70) {
                progressFill.style.background = 'linear-gradient(90deg, #f59e0b, #eab308)';
            } else {
                progressFill.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
    new FormEnhancer();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .auth-notification {
        font-family: var(--font-family);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-light);
    }

    .notification-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
    }

    .notification-message {
        flex: 1;
        font-size: 0.9rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: var(--text-gray);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: color 0.3s ease;
        width: 20px;
        height: 20px;
    }

    .notification-close:hover {
        color: var(--text-light);
    }

    .input-wrapper.focused {
        transform: translateY(-2px);
    }

    .input-wrapper.error .form-input {
        border-color: #ef4444;
        box-shadow: 0 0 0 1px #ef4444;
    }

    .form-progress {
        animation: fadeIn 0.5s ease;
    }

    .progress-label {
        color: var(--text-light);
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(15, 23, 42, 0.8);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ef4444, #f97316);
        border-radius: 4px;
        transition: width 0.3s ease, background 0.3s ease;
        width: 0%;
    }

    .progress-text {
        color: var(--text-gray);
        font-size: 0.8rem;
        text-align: right;
    }

    .auth-btn.loading {
        pointer-events: none;
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

