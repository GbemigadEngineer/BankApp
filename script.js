'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
// Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsConatiner = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const headerElement = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');

const sectionOne = document.getElementById('section--1');

btnScrollTo.addEventListener('click', function (event) {
  // const sectionOneCordinates = sectionOne.getBoundingClientRect();
  // console.log(sectionOneCordinates);
  // console.log(btnScrollTo.getBoundingClientRect());
  // console.log(event.target.getBoundingClientRect());
  // console.log('current scroll X/Y', window.pageXOffset, pageYOffset);
  // window.scrollTo(
  //   sectionOneCordinates.left + window.pageXOffset,
  //   sectionOneCordinates.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: sectionOneCordinates.left + window.pageXOffset,
  //   top: sectionOneCordinates.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  sectionOne.scrollIntoView({ behavior: 'smooth' });
});
//  implementing smooth scrolling on the nav elements

// Using  normal method delegation

// document.querySelectorAll('.nav__link').forEach(function (nav, i) {
//   nav.addEventListener('click', function (event) {
//     event.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth'
//     });
//   });
// });

//  using event delegation
//  event delegation requires 2 steps:
// 1.) We add the event listener to a common parent element of all the elements we want to work on.
// 2.) Determine what elemet originated the event by using the event.target and then we can work with that.

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();
    const target = event.target;
    if (target.classList.contains('nav__link')) {
      const id = target.getAttribute('href');
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
      });
    }
  });

tabsConatiner.addEventListener('click', event => {
  const clicked = event.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade Animation
const handleHover = function (event, opacity) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (event) {
  handleHover(event, 0.5);
});

nav.addEventListener('mouseout', function (event) {
  handleHover(event, 1);
});

//  sticky navigation

const initalCords = sectionOne.getBoundingClientRect();
window.addEventListener('scroll', function (event) {
  if (window.scrollY > initalCords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});

// Same sticky navigation but with the Intersection Observer API
const navheight = nav.getBoundingClientRect().height;
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navheight}px`,
};
const stickyNavCallback = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerobserver = new IntersectionObserver(stickyNavCallback, obsOptions);
headerobserver.observe(headerElement);

// revealing elements on scroll
// reveal sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images
const imagetarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '+200px',
});
imagetarget.forEach(img => imgObserver.observe(img));

// Building a slider component

// slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach((_, index) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide=${index}></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (slide) {
  slides.forEach((slides, index) => {
    slides.style.transform = `translateX(${100 * (index - slide)}%)`;
  });
};

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();
// Event Handlers
btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') previousSlide();
  event.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('dots__dot')) {
    const { slide } = event.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
// SECTION LECTURES

// selecting elements

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('header');

const allsections = document.querySelectorAll('.section');
console.log(allsections);

const allButtons = document.getElementsByTagName('button');

console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// creating and inserting elements

// .insertAdjacentHTML

const message = document.createElement('div');

message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for improved functionality, and analytics.';
message.innerHTML = `We use cookies for improved functionality, and analytics. <button class = "btn btn--close-cookie"> Got it!!</button>`;

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode('true'))

// delete elements

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

/* Styles, Attributes and Classes */

// styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.opacity = 0;

console.log(getComputedStyle(modal));
console.log(getComputedStyle(message));
console.log(getComputedStyle(message).backgroundColor);
console.log(getComputedStyle(message).height);
console.log(getComputedStyle(message).margin);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

console.log(message.style.height);

// document.documentElement.style.setProperty('--color-primary', 'red');

// attributes

const logo = document.querySelector('.nav__logo');

console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';
console.log(logo.getAttribute('src'));

/* TYPES OF EVENT AND EVENT HANDLERS */
const alerth1 = function (event) {
  alert(`Welcome to your event listener funeral`);

  h1.removeEventListener('mouseenter', alerth1);
};
const h1 = document.querySelector('h1');
h1.addEventListener('mouseenter', alerth1);

h1.onclick = function (event) {
  alert('hello bitch!');
};

// EVENT PROPAGATION IN PRACTICE

// rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// console.log(randomColor(0, 255));

// document
//   .querySelector('.nav__link')
//   .addEventListener('click', function (event) {
//     this.style.backgroundColor = randomColor();
//     console.log(event.target, event.currentTarget);

//     // Stop propagation
//     event.stopPropagation();
//   });

// document
//   .querySelector('.nav__links')
//   .addEventListener('click', function (event) {
//     this.style.backgroundColor = randomColor();
//     console.log(event.target, event.currentTarget);
//   });

// document.querySelector('.nav').addEventListener('click', function (event) {
//   this.style.backgroundColor = randomColor();
//   console.log(event.target, event.currentTarget);
// });

/* DOM TRAVERSSING */
const hone = document.querySelector('h1');
// selecting child elements
console.log(hone.querySelectorAll('.highlight'));
console.log(hone.childNodes);
console.log(hone.children);

// selecting Parents

console.log(hone.parentNode);
console.log(hone.parentElement);
console.log(hone.closest('.header'));

// selecting sinlings
// in javascript you can only access direct siblings. i.e the previous or the immediate next one.
console.log(hone.previousElementSibling);
console.log(hone.nextElementSibling);
//  if we need all the siblings, not just the previous and next one then there is a solution. We acsess the top parent element, then, access all of its children element from there.
console.log(hone.parentElement.children);

// Intersection observer API
// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observerCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(sectionOne);

/* DOM LIFECYLE EVENTS */
document.addEventListener('DOMContentLoaded', function (event) {
  console.log('HTML PARSED AND DOM TREE BUILT', event);
});

window.addEventListener('load', event => console.log(event));

window.addEventListener('beforeunload', event => {
  event.preventDefault();
  console.log(event);  
});
