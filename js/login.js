//*==========LOGIN JS====================*/

function togglePassword(button) {
    const wrapper = button.closest(".password-wrapper"); // find the wrapper
    const passwordInput = wrapper.querySelector(".password-field");
    const passwordIcon = button.querySelector("i");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.className = "bi bi-eye-slash";
    } else {
        passwordInput.type = "password";
        passwordIcon.className = "bi bi-eye";
    }
}



        (function() {
            'use strict';
            
            //Get the form
            const form = document.getElementById('loginForm');
            
            //Add event listener for form submission
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                //Check if form is valid
                if (form.checkValidity()) {
                    //Form is valid - you can add your login logic here
                    console.log('Form is valid - proceeding with login');
                    // Example: submitLogin();
                } else {
                    //Form is invalid - Bootstrap will show validation messages
                    console.log('Form validation failed');
                }
                
                //Add Bootstrap validation classes
                form.classList.add('was-validated');
            });
            
            // Real-time validation feedback
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(function(input) {
                input.addEventListener('blur', function() {
                    if (input.checkValidity()) {
                        input.classList.remove('invalid');
                        input.classList.add('is-valid');
                    } else {
                        input.classList.remove('is-valid');
                        input.classList.add('invalid');
                    }
                });
                
                input.addEventListener('input', function() {
                    if (form.classList.contains('was-validated')) {
                        if (input.checkValidity()) {
                            input.classList.remove('invalid');
                            input.classList.add('is-valid');
                        } else {
                            input.classList.remove('is-valid');
                            input.classList.add('invalid');
                        }
                    }
                });
            });
        })();