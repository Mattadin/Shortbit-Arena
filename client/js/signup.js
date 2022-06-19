const doCheck = async (event) => {
  event.preventDefault();

  var fullname = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirm-password').value;

  if (password != confirmPassword) {
    alert(
      'Password Error',
      'Password does not match, make sure you enter both the password same (min length 8 characters).'
    );
    return;
  }

  if (fullname && email) {
    const response = await fetch('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify({ fullname, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      alert(
        'Error',
        'Error signing up, please check your details and try again.'
      );
      return;
    }
    location.replace('/dashboard');
  } else {
    alert(
      'Incomplete details',
      'Please complete the form data and press Create Account button.'
    );
  }
};

document.getElementById('signup').addEventListener('click', doCheck);
