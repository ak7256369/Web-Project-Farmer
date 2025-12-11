document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');


    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });

        const name = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (name.value.trim().length < 2) {
            name.classList.add('error');
            nameError.style.display = 'block';
            isValid = false;
        }

        const email = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            emailError.style.display = 'block';
            isValid = false;
        }

        const phone = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(phone.value.trim().replace(/\D/g, ''))) {
            phone.classList.add('error');
            phoneError.style.display = 'block';
            isValid = false;
        }

        const password = document.getElementById('password');
        const passwordError = document.getElementById('passwordError');
        if (password.value.length < 6) {
            password.classList.add('error');
            passwordError.style.display = 'block';
            isValid = false;
        }


        if (isValid) {
            alert('Form submitted successfully!');
            form.reset();
        }
    });

    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorId = this.id + 'Error';
                document.getElementById(errorId).style.display = 'none';
            }
        });
    });
});
