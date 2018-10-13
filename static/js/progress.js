'use strict';

var h = document.documentElement;
var b = document.body;
var scrollTop = 'scrollTop';
var scrollHeight = 'scrollHeight';
var progress = document.querySelector('.progress');
var scroll = void 0;

document.addEventListener('scroll', function () {
  scroll = (h[scrollTop] || b[scrollTop]) / ((h[scrollHeight] || b[scrollheight]) - h.clientHeight) * 100;
  progress.style.setProperty('--scroll', scroll + '%');
});