/*
 * Handles mobile nav
 */

function toggleMobileNavState() {
  const container = document.querySelector('.container')
  container.classList.toggle('nav--active')
}

/*
 * Initializes burger functionality
 */

function initBurger() {
  const burger = document.querySelector('.burger')
  burger.addEventListener('click', toggleMobileNavState)
}

initBurger()
