/*
 * Updates nav with active class
 */

function toggleMobileNavState() {
  var nav = document.querySelector('.nav')
  nav.classList.toggle('nav--active')

  var burger = document.querySelector('.burger')
  burger.classList.toggle('burger--close')
}

/*
 * Initializes burger functionality
 */

function initBurger() {
  const burger = document.querySelector('.burger')
  burger.addEventListener('click', toggleMobileNavState)
}

initBurger()
