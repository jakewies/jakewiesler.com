'use strict';

/*
 * Handles mobile nav
 */

function toggleMobileNavState() {
  var container = document.querySelector('.container');
  container.classList.toggle('nav--active');
}

/*
 * Initializes burger functionality
 */

function initBurger() {
  var burger = document.querySelector('.burger');
  burger.addEventListener('click', toggleMobileNavState);
}

initBurger();