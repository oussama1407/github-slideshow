// Form validation and registration functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const submitBtn = document.querySelector('.register-btn');
    const successModal = document.getElementById('successMessage');
    
    // Form fields
    const fields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword'),
        terms: document.getElementById('terms')
    };
    
    // Error message elements
    const errorElements = {
        firstName: document.getElementById('firstNameError'),
        lastName: document.getElementById('lastNameError'),
        email: document.getElementById('emailError'),
        phone: document.getElementById('phoneError'),
        password: document.getElementById('passwordError'),
        confirmPassword: document.getElementById('confirmPasswordError'),
        terms: document.getElementById('termsError')
    };
    
    // Validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\+]?[1-9][\d]{0,15}$/,
        password: /^.{8,}$/,
        name: /^[a-zA-Z\s]{2,30}$/
    };
    
    // Real-time validation
    Object.keys(fields).forEach(fieldName => {
        if (fields[fieldName] && fieldName !== 'terms') {
            fields[fieldName].addEventListener('blur', () => validateField(fieldName));
            fields[fieldName].addEventListener('input', () => clearError(fieldName));
        }
    });
    
    // Password confirmation validation
    fields.confirmPassword.addEventListener('input', validatePasswordMatch);
    fields.password.addEventListener('input', validatePasswordMatch);
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    function validateField(fieldName) {
        const field = fields[fieldName];
        const value = field.value.trim();
        const errorElement = errorElements[fieldName];
        let isValid = true;
        let errorMessage = '';
        
        // Check if field is empty
        if (!value) {
            errorMessage = `${getFieldDisplayName(fieldName)} is required`;
            isValid = false;
        } else {
            // Field-specific validation
            switch (fieldName) {
                case 'firstName':
                case 'lastName':
                    if (!patterns.name.test(value)) {
                        errorMessage = 'Name must contain only letters and be 2-30 characters long';
                        isValid = false;
                    }
                    break;
                    
                case 'email':
                    if (!patterns.email.test(value)) {
                        errorMessage = 'Please enter a valid email address';
                        isValid = false;
                    }
                    break;
                    
                case 'phone':
                    if (!patterns.phone.test(value)) {
                        errorMessage = 'Please enter a valid phone number';
                        isValid = false;
                    }
                    break;
                    
                case 'password':
                    if (!patterns.password.test(value)) {
                        errorMessage = 'Password must be at least 8 characters long';
                        isValid = false;
                    }
                    break;
                    
                case 'confirmPassword':
                    if (value !== fields.password.value) {
                        errorMessage = 'Passwords do not match';
                        isValid = false;
                    }
                    break;
            }
        }
        
        // Display error or success state
        if (isValid) {
            showFieldSuccess(fieldName);
        } else {
            showFieldError(fieldName, errorMessage);
        }
        
        return isValid;
    }
    
    function validatePasswordMatch() {
        const password = fields.password.value;
        const confirmPassword = fields.confirmPassword.value;
        
        if (confirmPassword && password !== confirmPassword) {
            showFieldError('confirmPassword', 'Passwords do not match');
            return false;
        } else if (confirmPassword) {
            showFieldSuccess('confirmPassword');
            return true;
        }
        return true;
    }
    
    function validateTerms() {
        const isChecked = fields.terms.checked;
        if (!isChecked) {
            showFieldError('terms', 'You must agree to the Terms of Service');
            return false;
        } else {
            clearError('terms');
            return true;
        }
    }
    
    function showFieldError(fieldName, message) {
        const field = fields[fieldName];
        const errorElement = errorElements[fieldName];
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
        errorElement.textContent = message;
    }
    
    function showFieldSuccess(fieldName) {
        const field = fields[fieldName];
        const errorElement = errorElements[fieldName];
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        errorElement.textContent = '';
    }
    
    function clearError(fieldName) {
        const field = fields[fieldName];
        const errorElement = errorElements[fieldName];
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.remove('error');
        errorElement.textContent = '';
    }
    
    function getFieldDisplayName(fieldName) {
        const displayNames = {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email address',
            phone: 'Phone number',
            password: 'Password',
            confirmPassword: 'Confirm password'
        };
        return displayNames[fieldName] || fieldName;
    }
    
    function validateAllFields() {
        let isFormValid = true;
        
        // Validate all text fields
        Object.keys(fields).forEach(fieldName => {
            if (fieldName !== 'terms') {
                if (!validateField(fieldName)) {
                    isFormValid = false;
                }
            }
        });
        
        // Validate terms checkbox
        if (!validateTerms()) {
            isFormValid = false;
        }
        
        return isFormValid;
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        if (!validateAllFields()) {
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // In a real application, you would send the data to your server here
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData.entries());
            
            console.log('Registration data:', userData);
            
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            form.reset();
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success', 'error');
            });
            
        }, 2000); // Simulate 2 second API call
    }
    
    function showSuccessModal() {
        successModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Global function for closing success modal
    window.closeSuccessModal = function() {
        successModal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
    };
    
    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !successModal.classList.contains('hidden')) {
            closeSuccessModal();
        }
    });
    
    // Enhanced UX features
    
    // Auto-format phone number (basic formatting)
    fields.phone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    });
    
    // Password strength indicator
    fields.password.addEventListener('input', function(e) {
        const password = e.target.value;
        const requirements = document.querySelector('.password-requirements small');
        
        if (password.length === 0) {
            requirements.textContent = 'Password must be at least 8 characters long';
            requirements.style.color = '#666';
        } else if (password.length < 8) {
            requirements.textContent = `Password too short (${password.length}/8 characters)`;
            requirements.style.color = '#e74c3c';
        } else {
            let strength = 'Good';
            let color = '#27ae60';
            
            // Check for strong password criteria
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
            
            const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
            
            if (criteriaCount >= 3 && password.length >= 12) {
                strength = 'Very Strong';
                color = '#27ae60';
            } else if (criteriaCount >= 2 && password.length >= 10) {
                strength = 'Strong';
                color = '#27ae60';
            } else if (criteriaCount >= 2) {
                strength = 'Medium';
                color = '#f39c12';
            } else {
                strength = 'Weak';
                color = '#e74c3c';
            }
            
            requirements.textContent = `Password strength: ${strength}`;
            requirements.style.color = color;
        }
    });
    
    // Smooth animations for form interactions
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});