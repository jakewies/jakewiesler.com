'use strict';

/*
 * Updates nav with active class
 */

function toggleMobileNavState() {
  var body = document.querySelector('body');
  body.classList.toggle('mobile-nav-active');
}

/*
 * Initializes burger functionality
 */

function initBurger() {
  var burger = document.querySelector('.burger');
  burger.addEventListener('click', toggleMobileNavState);
}

initBurger();