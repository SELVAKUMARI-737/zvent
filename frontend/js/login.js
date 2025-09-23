
        // Google Sign In Handler
        function handleCredentialResponse(response) {
            // Decode the credential response
            const responsePayload = decodeJwtResponse(response.credential);
            
            console.log('ID: ' + responsePayload.sub);
            console.log('Full Name: ' + responsePayload.name);
            console.log('Given Name: ' + responsePayload.given_name);
            console.log('Family Name: ' + responsePayload.family_name);
            console.log('Image URL: ' + responsePayload.picture);
            console.log('Email: ' + responsePayload.email);

            // Show success toast and redirect
            showToast(`🎉 Welcome back, ${responsePayload.given_name}! Login successful.`, 'success');
            
            setTimeout(() => {
                // Redirect to dashboard or home page
                window.location.href = './register.html';
            }, 2000);
        }

        function decodeJwtResponse(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }

        // Toast notification function
        function showToast(message, type = 'success', duration = 3000) {
            const toastContainer = document.getElementById('toastContainer');
            
            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast toast-${type} px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3 min-w-80 max-w-96`;
            
            // Icon based on type
            const icon = type === 'success' ? 
                '<svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' :
                '<svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>';
            
            toast.innerHTML = `
                ${icon}
                <div class="flex-1">
                    <p class="font-medium text-white">${message}</p>
                </div>
                <button onclick="this.parentElement.remove()" class="text-white/80 hover:text-white transition-colors duration-200">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
                <div class="toast-progress"></div>
            `;
            
            // Add to container
            toastContainer.appendChild(toast);
            
            // Show toast with animation
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);
            
            // Auto remove after duration
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                }, 300);
            }, duration);
            
            return toast;
        }

        // Toggle password visibility
        document.getElementById('togglePassword').addEventListener('click', function() {
            const password = document.getElementById('password');
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            
            // Toggle eye icon
            this.innerHTML = type === 'password' ? 
                '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>' :
                '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414l4.242 4.242m-4.242-4.242L8.464 8.464m7.071 7.071L17.95 17.95m-2.829-2.829L13.636 16.607m1.485-1.485L17.95 17.95"></path></svg>';
        });

        // Form submission
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Simple validation
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing In...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Here you would typically send the data to your backend
                console.log('Login attempt:', { email, password, remember });
                
                // Extract first name from email for personalization
                const firstName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
                
                // Show success toast
                showToast(`🎉 Welcome back, ${firstName}! Login successful.`, 'success', 3000);
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Reset form
                this.reset();
                
                // Redirect to dashboard or home page
                setTimeout(() => {
                    window.location.href = 'register.html';
                }, 2000);
                
            }, 1000); // Simulate network delay
        });

        // Add input focus effects
        document.querySelectorAll('input[type="email"], input[type="password"]').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('transform', 'scale-[1.02]');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('transform', 'scale-[1.02]');
            });
        });

        // Initialize Google Sign-In when page loads
        window.onload = function() {
            google.accounts.id.initialize({
                client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your actual Google Client ID
                callback: handleCredentialResponse
            });
        };
