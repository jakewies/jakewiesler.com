const h = document.documentElement
const b = document.body
const scrollTop = 'scrollTop'
const scrollHeight = 'scrollHeight'
const progress = document.querySelector('.progress')
let scroll

document.addEventListener('scroll', function() {
  scroll =
    ((h[scrollTop] || b[scrollTop]) / ((h[scrollHeight] || b[scrollheight]) - h.clientHeight)) * 100
  progress.style.setProperty('--scroll', scroll + '%')
})
