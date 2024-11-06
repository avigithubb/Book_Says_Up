document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const navList = document.getElementById('nav-list');
    
    toggleBtn.addEventListener('click', () => {
      navList.classList.toggle('active');
    });
    
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    dropdownBtn.addEventListener('click', (event) => {
      event.preventDefault();  // Prevent default anchor behavior
      dropdownMenu.classList.toggle('active');
    });
  });