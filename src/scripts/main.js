const toggleMode = () => {
  const body = document.body;
  body.classList.toggle('dark-mode');
  const mode = body.classList.contains('dark-mode') ? 'oscuro' : 'claro';
  localStorage.setItem('modo', mode);
};

const loadMode = () => {
  const savedMode = localStorage.getItem('modo');
  if (savedMode === 'oscuro') {
    document.body.classList.add('dark-mode');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadMode();
  const modeToggleButton = document.getElementById('toggle-mode');
  if (modeToggleButton) {
    modeToggleButton.addEventListener('click', toggleMode);
  }
});