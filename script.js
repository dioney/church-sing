const textInput = document.getElementById('text-input');
const maxWordsPerSlideInput = document.getElementById('max-words-per-slide');
const slideDurationInput = document.getElementById('slide-duration');
const createSlidesButton = document.getElementById('create-slides');
const slideContainer = document.getElementById('slide-container');
const sidebar = document.getElementById('sidebar');
const toggleSidebarButton = document.getElementById('toggle-sidebar');

let slides = [];
let slideInterval = null;
let slideDuration = 5; // default duration in seconds
let maxWordsPerSlide = 10; // default max words per slide
let currentSlideIndex = 0; // índice do slide atual

createSlidesButton.addEventListener('click', createSlides);

function createSlides() {
  // Apaga os slides atuais
  while (slideContainer.firstChild) {
    slideContainer.removeChild(slideContainer.firstChild);
  }

  // Resetar o índice do slide atual
  currentSlideIndex = 0;

  // Parar o slide show
  stopSlideShow();

  const text = textInput.value.trim();
  let lines;
  if (maxWordsPerSlide === 0) {
    lines = text.split('\n');
  } else {
    lines = [text];
  }

  const slidesArray = [];

  lines.forEach((line) => {
    if (maxWordsPerSlide === 0) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        slidesArray.push(trimmedLine);
      }
    } else {
      const words = line.split(' ');
      let slideText = '';

      for (let i = 0; i < words.length; i++) {
        if (slideText.split(' ').length < maxWordsPerSlide) {
          slideText += words[i] + ' ';
        } else {
          slidesArray.push(slideText.trim());
          slideText = words[i] + ' ';
        }
      }

      const trimmedSlideText = slideText.trim();
      if (trimmedSlideText) {
        slidesArray.push(trimmedSlideText);
      }
    }
  });

  slides = slidesArray.map((text, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.setAttribute('data-splitting', 'words');
    slide.setAttribute('data-scroll', '');
    slide.textContent = text;
    slideContainer.appendChild(slide);
    return slide;
  });

  slides = slidesArray.map((text, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.setAttribute('data-splitting', 'words');
    slide.setAttribute('data-scroll', '');
    slide.textContent = text;
    slideContainer.appendChild(slide);
    return slide;
  });

  // adiciona a classe active ao primeiro slide
  slides[0].classList.add('active');

  slideDuration = parseInt(slideDurationInput.value, 10);
  maxWordsPerSlide = parseInt(maxWordsPerSlideInput.value, 10);

  startSlideShow();
}

function startSlideShow() {
    slideInterval = setInterval(() => {
        const currentSlide = slides[currentSlideIndex];
        const nextSlide = slides[(currentSlideIndex + 1) % slides.length];

        currentSlide.classList.remove('active');
        currentSlide.classList.add('out');

        nextSlide.classList.add('in');
        nextSlide.classList.add('active');

        setTimeout(() => {
            currentSlide.classList.remove('out');
            nextSlide.classList.remove('in');
        }, 500); // adjust the timeout to match the transition duration

        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        }, slideDuration * 1000);
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

// Add event listener to stop slide show when user clicks on a slide
slideContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('slide')) {
    stopSlideShow();
  }
});

// Add event listener to navigate slides with keyboard arrows
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    // volta 1 slide
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    // avança 1 slide
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  }
  // remove a classe active de todos os slides
  slides.forEach((slide) => slide.classList.remove('active'));
  // adiciona a classe active ao slide atual
  slides[currentSlideIndex].classList.add('active');
  // resetar o tempo
  stopSlideShow();
  startSlideShow();
});

toggleSidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
  toggleSidebarButton.textContent = sidebar.classList.contains('hidden') ? 'Opções' : 'Ocultar Opções';
});

const fontSizeInput = document.getElementById('font-size');

fontSizeInput.addEventListener('input', () => {
  const fontSize = parseInt(fontSizeInput.value, 10);
  slides.forEach((slide) => {
    slide.style.fontSize = `${fontSize}vh`;
  });
});


// dark & light
const toggleModeButton = document.getElementById('toggle-mode');

toggleModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
  toggleModeButton.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
});