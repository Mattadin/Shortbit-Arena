// var newUser = document.getElementById('register');

// newUser.addEventListener('click', createUser);

// function createUser(event) {
//   event.preventDefault();
//   document.location.replace('/signup');
// }

// const loginFormHandler = async (event) => {
//   event.preventDefault();

//   const email = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value.trim();

//   if (email && password) {
//     const response = await fetch('/api/users/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     if (response.ok) {
//       document.location.replace('/dashboard');
//     } else {
//       const result = await response.json();
//       alert(result);
//     }
//   }
// };

// document
//   .getElementById('login-btn')
//   .addEventListener('click', loginFormHandler);
