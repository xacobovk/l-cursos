function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPassword').value;

  // Simulación de autenticación
  if (username === 'admin' && password === 'password') {
    alert('Inicio de sesión exitoso');
    window.location.href = 'index.html'; // Redirigir a la página principal
  } else {
    alert('Usuario o contraseña incorrectos');
  }
}

function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Simulación de registro
  if (name && email && password) {
    alert('Registro exitoso');
    window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión
  } else {
    alert('Por favor, complete todos los campos');
  }
}

document.getElementById('loginForm').addEventListener('submit', loginUser);
document.getElementById('registerForm').addEventListener('submit', registerUser);