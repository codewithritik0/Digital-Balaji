/* Digital Balaji - main script (vanilla JavaScript, no libraries) */



document.addEventListener("DOMContentLoaded", () => {



  // -----------------------------

  // Navbar shadow on scroll

  // -----------------------------

  const nav = document.querySelector("nav");

  const backToTop = document.getElementById("backToTop");



  const onScroll = () => {

    if (nav) {

      nav.classList.toggle("scrolled", window.scrollY > 10);

    }



    if (backToTop) {

      const isVisible = window.scrollY > 400;

      backToTop.classList.toggle("is-visible", isVisible);

      backToTop.setAttribute("aria-hidden", String(!isVisible));

      backToTop.tabIndex = isVisible ? 0 : -1;

    }

  };



  onScroll();

  window.addEventListener("scroll", onScroll);



  if (backToTop) {

    backToTop.addEventListener("click", (e) => {

      e.preventDefault();

      window.scrollTo({

        top: 0,

        left: 0,

        behavior: "smooth"

      });

    });

  }





  // -----------------------------

  // Home page consultation popup

  const consultationPopup = document.querySelector(".consultation-popup");

  let previousBodyOverflow = "";

  let previousPopupFocus = null;

  let popupCloseTimer;



  if (consultationPopup) {

    const closeButton = consultationPopup.querySelector(".consultation-popup__close");

    const dialog = consultationPopup.querySelector(".consultation-popup__panel");



    const openConsultationPopup = () => {

      previousPopupFocus = document.activeElement;

      previousBodyOverflow = document.body.style.overflow;

      document.body.classList.add("consultation-popup-open");

      consultationPopup.classList.add("is-open");

      consultationPopup.setAttribute("aria-hidden", "false");

      closeButton.focus();

    };



    const closeConsultationPopup = () => {

      consultationPopup.classList.remove("is-open");

      consultationPopup.setAttribute("aria-hidden", "true");

      document.body.classList.remove("consultation-popup-open");

      document.body.style.overflow = previousBodyOverflow;

      window.clearTimeout(popupCloseTimer);



      if (previousPopupFocus && previousPopupFocus !== document.body && previousPopupFocus.isConnected) {

        previousPopupFocus.focus();

      }

    };



    closeButton.addEventListener("click", closeConsultationPopup);



    consultationPopup.addEventListener("click", e => {

      if (e.target === consultationPopup) {

        closeConsultationPopup();

      }

    });



    document.addEventListener("keydown", e => {

      if (!consultationPopup.classList.contains("is-open")) {

        return;

      }



      if (e.key === "Escape") {

        closeConsultationPopup();

        return;

      }



      if (e.key === "Tab") {

        const focusable = [...dialog.querySelectorAll("button, input, select, textarea, [tabindex]:not([tabindex='-1'])")]

          .filter(el => !el.disabled && el.getAttribute("aria-hidden") !== "true");

        const first = focusable[0];

        const last = focusable[focusable.length - 1];



        if (e.shiftKey && document.activeElement === first) {

          e.preventDefault();

          last.focus();

        } else if (!e.shiftKey && document.activeElement === last) {

          e.preventDefault();

          first.focus();

        }

      }

    });



    window.setTimeout(openConsultationPopup, 1000);

  }

  // Services dropdown mobile toggle

  // -----------------------------

  const servicesNavItem = document.querySelector(".services-nav-item");



  if (servicesNavItem) {

    const servicesToggle = servicesNavItem.querySelector(".services-dropdown-toggle");



    if (servicesToggle) {

      const updateDropdownState = expanded => {

        servicesNavItem.classList.toggle("is-open", expanded);

        servicesToggle.setAttribute("aria-expanded", String(expanded));

      };



      const isMobile = () => window.matchMedia("(max-width: 991.98px)").matches;

      const navbarCollapse = document.querySelector("#menu");



      servicesToggle.addEventListener("click", e => {

        if (!isMobile()) {

          return;

        }



        e.preventDefault();

        e.stopPropagation();



        const nowOpen = servicesNavItem.classList.contains("is-open");

        updateDropdownState(!nowOpen);

      });



      document.addEventListener("click", e => {

        if (!isMobile() || !servicesNavItem.contains(e.target)) {

          updateDropdownState(false);

        }

      });



      document.addEventListener("keydown", e => {

        if (e.key === "Escape" && isMobile() && servicesNavItem.classList.contains("is-open")) {

          updateDropdownState(false);

          servicesToggle.focus();

        }

      });



      if (navbarCollapse) {

        navbarCollapse.addEventListener("hidden.bs.collapse", () => {

          updateDropdownState(false);

        });

      }



      window.addEventListener("resize", () => {

        if (!isMobile()) {

          updateDropdownState(false);

        }

      });

    }

  }





  // -----------------------------

  // Footer year

  // -----------------------------

  document.querySelectorAll(".js-year").forEach(el => {

    el.textContent = new Date().getFullYear();

  });





  // -----------------------------

  // Smooth scrolling for anchors

  // -----------------------------

  document.querySelectorAll('a[href^="#"]').forEach(a => {

    a.addEventListener("click", e => {

      const href = a.getAttribute("href");



      if (!href || href === "#") {

        return;

      }



      const target = document.querySelector(href);



      if (target) {

        e.preventDefault();



        target.scrollIntoView({

          behavior: "smooth"

        });

      }

    });

  });





  // -----------------------------

  // Scroll reveal

  // -----------------------------

  const revealObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("show");

        observer.unobserve(entry.target);

      }

    });

  }, {

    threshold: 0.15

  });



  document.querySelectorAll(".reveal").forEach(el => {

    revealObserver.observe(el);

  });





  // -----------------------------

  // Counter animation

  // -----------------------------

  const counterObserver = new IntersectionObserver((entries, observer) => {



    entries.forEach(entry => {



      if (!entry.isIntersecting) {

        return;

      }



      observer.unobserve(entry.target);



      const end = +entry.target.dataset.count;

      const start = performance.now();



      const tick = now => {



        const progress = Math.min(

          (now - start) / 1500,

          1

        );



        const current = Math.floor(progress * end);



        entry.target.textContent = current;



        if (progress < 1) {

          requestAnimationFrame(tick);

        }



      };



      requestAnimationFrame(tick);



    });



  }, {

    threshold: 0.5

  });



  document.querySelectorAll("[data-count]").forEach(el => {

    counterObserver.observe(el);

  });





  // -----------------------------

  // Form validation

  // -----------------------------



  const rules = {



    name: value =>

      value.trim().length >= 2,



    email: value =>

      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),



    phone: value =>

      /^\+?[0-9\s-]{8,15}$/.test(value.trim()),



    service: value =>

      value !== "",



    message: value =>

      value.trim().length >= 10



  };





  const check = el => {



    const rule = rules[el.name];



    // Fields without a rule, e.g. company, are optional.

    if (!rule) {

      return true;

    }



    const ok = rule(el.value);



    el.classList.toggle("is-invalid", !ok);

    el.classList.toggle("is-valid", ok);



    return ok;

  };





  // -----------------------------

  // Contact form

  // -----------------------------



  document

    .querySelectorAll('form[data-validate]')

    .forEach(form => {



      const status = form.querySelector(".form-status");



      // Validate fields when user leaves them

      form

        .querySelectorAll("input, select, textarea")

        .forEach(el => {

          el.addEventListener("blur", () => check(el));

        });





      // Submit form

      form.addEventListener("submit", async e => {



        e.preventDefault();





        // Validate all required fields

        const ok = [...form.elements]

          .filter(el => el.name)

          .map(check)

          .every(Boolean);





        if (!ok) {



          if (status) {

            status.textContent =

              "Please fix the highlighted fields.";

          }



          return;

        }





        // Collect form data

        const data = Object.fromEntries(

          new FormData(form)

        );





        // Google Apps Script Web App URL

        const endpoint =

          "https://script.google.com/macros/s/AKfycbyUc1XfhFD2_DxP9E1xEyESgm-HOFSlIs04u8GcLAQSZaCbCWinOvYjBei3rJCwBSC33Q/exec";





        // Show sending message

        if (status) {

          status.textContent =

            "Sending your enquiry...";

        }





        try {



          // Send data in background

          const submission = fetch(endpoint, {

            method: "POST",

            mode: "no-cors",

            headers: {

              "Content-Type": "application/x-www-form-urlencoded"

            },

            body: new URLSearchParams(data)

          });



          const popup = form.closest(".consultation-popup");



          if (popup) {

            submission.then(() => {

              if (status) {

                status.textContent = "Thank you! Your enquiry has been submitted successfully.";

              }



              form.reset();

              form.querySelectorAll(".is-valid, .is-invalid").forEach(field => {

                field.classList.remove("is-valid", "is-invalid");

              });



              popupCloseTimer = window.setTimeout(() => {

                popup.querySelector(".consultation-popup__close").click();

              }, 1800);

            }).catch(error => {

              console.error("Form submission error:", error);

              if (status) {

                status.textContent = "We could not submit your enquiry. Please try again.";

              }

            });



            return;

          }



          submission.catch(error => {

            console.error("Form submission error:", error);

          });



          // Preserve the existing contact form success behavior.

          alert("Thank you! Your enquiry has been submitted successfully.");

          form.reset();



        } catch (error) {



          console.error("Form submission error:", error);



        }



      });



    });



});

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const touchQuery = window.matchMedia('(pointer: coarse)');

if (!touchQuery.matches && !reducedMotionQuery.matches) {
  document.body.classList.add('cursor-enabled');

  const cursorDot = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = 0;
  let mouseY = 0;
  let ringX = mouseX;
  let ringY = mouseY;
  let dotOffsetX = 0;
  let dotOffsetY = 0;
  let dotTargetOffsetX = 0;
  let dotTargetOffsetY = 0;
  let hasPointerMoved = false;
  let animationFrameId = null;
  let idleTimerId = null;

  const interactiveSelector = 'a, button';
  const maxRingTrail = 3;
  const dotEdgeGap = 15;

  const setPosition = (element, x, y) => {
    element.style.setProperty('--cursor-x', `${x}px`);
    element.style.setProperty('--cursor-y', `${y}px`);
  };

  const updateCursorPosition = () => {
    ringX += (mouseX - ringX) * 0.4;
    ringY += (mouseY - ringY) * 0.4;

    const ringOffsetX = ringX - mouseX;
    const ringOffsetY = ringY - mouseY;
    const ringDistance = Math.hypot(ringOffsetX, ringOffsetY);

    if (ringDistance > maxRingTrail) {
      ringX = mouseX + (ringOffsetX / ringDistance) * maxRingTrail;
      ringY = mouseY + (ringOffsetY / ringDistance) * maxRingTrail;
    }

    dotOffsetX += (dotTargetOffsetX - dotOffsetX) * 0.08;
    dotOffsetY += (dotTargetOffsetY - dotOffsetY) * 0.08;
    if (Math.hypot(dotTargetOffsetX - dotOffsetX, dotTargetOffsetY - dotOffsetY) < 0.1) {
      dotOffsetX = dotTargetOffsetX;
      dotOffsetY = dotTargetOffsetY;
    }

    setPosition(cursorRing, ringX, ringY);
    setPosition(cursorDot, ringX + dotOffsetX, ringY + dotOffsetY);

    const ringSettled = Math.hypot(mouseX - ringX, mouseY - ringY) < 0.1;
    const dotSettled = dotOffsetX === dotTargetOffsetX && dotOffsetY === dotTargetOffsetY;
    if (!ringSettled || !dotSettled) {
      animationFrameId = window.requestAnimationFrame(updateCursorPosition);
    } else {
      animationFrameId = null;
    }
  };

  const requestCursorPositionUpdate = () => {
    if (animationFrameId === null) {
      animationFrameId = window.requestAnimationFrame(updateCursorPosition);
    }
  };

  document.addEventListener('mousemove', event => {
    const dx = hasPointerMoved ? event.clientX - mouseX : 0;
    const dy = hasPointerMoved ? event.clientY - mouseY : 0;
    const distance = Math.hypot(dx, dy);
    if (distance > 0) {
      const ringRadius = cursorRing.getBoundingClientRect().width / 2;
      const dotRadius = cursorDot.offsetWidth / 2;
      const dotOffset = ringRadius + dotRadius + dotEdgeGap;
      dotTargetOffsetX = (dx / distance) * dotOffset;
      dotTargetOffsetY = (dy / distance) * dotOffset;

      window.clearTimeout(idleTimerId);
      idleTimerId = window.setTimeout(() => {
        dotTargetOffsetX = 0;
        dotTargetOffsetY = 0;
        requestCursorPositionUpdate();
      }, 100);
    }

    mouseX = event.clientX;
    mouseY = event.clientY;
    ringX = hasPointerMoved ? ringX : mouseX;
    ringY = hasPointerMoved ? ringY : mouseY;
    hasPointerMoved = true;
    document.body.classList.add('cursor-visible');

    requestCursorPositionUpdate();
  }, { passive: true });

  document.querySelectorAll(interactiveSelector).forEach(element => {
    element.addEventListener('pointerenter', () => cursorRing.classList.add('cursor-hover'));
    element.addEventListener('pointerleave', () => cursorRing.classList.remove('cursor-hover'));
  });
}

const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const testimonialControls = document.querySelectorAll('[data-testimonial-direction]');
let currentSlide = 0;
const updateTestimonials = index => {
  testimonialCards.forEach((card, i) => card.classList.toggle('is-active', i === index));
  testimonialDots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  currentSlide = index;
};
if (testimonialCards.length) {
  testimonialControls.forEach(button => {
    button.addEventListener('click', () => {
      const direction = button.dataset.testimonialDirection === 'next' ? 1 : -1;
      const nextIndex = (currentSlide + direction + testimonialCards.length) % testimonialCards.length;
      updateTestimonials(nextIndex);
    });
  });
  testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => updateTestimonials(Number(dot.dataset.slide)));
  });
}