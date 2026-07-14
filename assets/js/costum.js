document.addEventListener("DOMContentLoaded", function () {
    let floatBtn = document.querySelector(".float");
    let footer = document.querySelector("footer"); // Select your footer

    function adjustButtonPosition() {
        let footerRect = footer.getBoundingClientRect();
        let windowHeight = window.innerHeight;

        if (window.scrollY > 200) {
            floatBtn.classList.add("visible");
        } else {
            floatBtn.classList.remove("visible");
        }

        // Check if the footer is in view
        if (footerRect.top < windowHeight) {
            let offset = windowHeight - footerRect.top; // 50px above the footer
            floatBtn.style.bottom = `${offset}px`;
        } else {
            floatBtn.style.bottom = "20px"; // Default position
        }
    }

    window.addEventListener("scroll", adjustButtonPosition);
    window.addEventListener("resize", adjustButtonPosition);
});

document.addEventListener("DOMContentLoaded", function () {
    let header = document.querySelector("header");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 500) {
            header.classList.add("header__v2");
        } else {
            header.classList.remove("header__v2");
        }
    });
});
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    mouseMultiplier: 2,
    smoothWheel: true,
    wheelMultiplier: 2,
    tablet: { smooth: false, breakpoint: 1024 },
    smartphone: { smooth: false, breakpoint: 768 }
  });
  let rafId;
  window.addEventListener('resize', () => {
    lenis.stop();
    clearTimeout(rafId);
    rafId = setTimeout(() => lenis.start(), 100);
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  window.scrollTo(0, 0);
  window.scrollToLenis = (target) => {
    lenis.scrollTo(target, {
      offset: 0,
      immediate: false,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  };
  window.stopLenis = () => lenis.stop();
  window.startLenis = () => lenis.start();

document.addEventListener("DOMContentLoaded", function () {
    var offer_swiper = new Swiper(".offer_swiper", {
        spaceBetween: 15,
        slidesPerView: 'auto',
        loop: true,
        grabCursor: true,
        freeMode: true,
    });

    var activities_swiper = new Swiper(".activities_swiper", {
        spaceBetween: 15,
        slidesPerView: 'auto',
        loop: true,
        grabCursor: true,
        freeMode: true,
    });
    const prevActivityBtn = document.querySelector(".prev_activity_slide");
    const nextActivityBtn = document.querySelector(".next_activity_slide");

    if (prevActivityBtn) {
        prevActivityBtn.addEventListener("click", function() {
            activities_swiper.slidePrev();
        });
    }

    if (nextActivityBtn) {
        nextActivityBtn.addEventListener("click", function() {
            activities_swiper.slideNext();
        });
    }

});

// Splash Screen Fade Out
window.addEventListener("load", function () {
    const splash = document.getElementById("splash-screen");
    if (splash) {
        setTimeout(function() {
            splash.classList.add("fade-out");
        }, 1200);
    }
});

