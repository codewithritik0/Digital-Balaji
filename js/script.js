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

  const celebrateLeadSubmission = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let container = document.getElementById("celebration-container");

    if (container && container.dataset.active === "true") {
      return;
    }

    if (!container) {
      container = document.createElement("div");
      container.id = "celebration-container";
      container.setAttribute("aria-hidden", "true");
      document.body.appendChild(container);
    }

    container.dataset.active = "true";
    let canvas = container.querySelector("canvas");

    if (!canvas) {
      canvas = document.createElement("canvas");
      container.appendChild(canvas);
    }

    const context = canvas.getContext("2d");

    if (!context) {
      container.remove();
      throw new Error("Unable to initialize the party celebration canvas.");
    }

    const colors = ["#ff3f5e", "#ffd52a", "#2589ff", "#31cf70", "#ff54a5", "#a45cff", "#ff872f", "#20d9e8", "#ffffff"];
    const confetti = [];
    const flashes = [];
    const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const startedAt = performance.now();
    const bursts = [
      { delay: 0, x: 0.015, y: 0.96, count: isSmallScreen ? 68 : 125, angle: -132, spread: 82, power: 1.15 },
      { delay: 0, x: 0.24, y: 0.98, count: isSmallScreen ? 58 : 105, angle: -76, spread: 62, power: 1.08 },
      { delay: 0, x: 0.76, y: 0.98, count: isSmallScreen ? 58 : 105, angle: -104, spread: 62, power: 1.08 },
      { delay: 0, x: 0.985, y: 0.96, count: isSmallScreen ? 68 : 125, angle: -48, spread: 82, power: 1.15 },
      { delay: 0, x: 0.01, y: 0.54, count: isSmallScreen ? 42 : 75, angle: -18, spread: 74, power: 0.98 },
      { delay: 0, x: 0.99, y: 0.54, count: isSmallScreen ? 42 : 75, angle: -162, spread: 74, power: 0.98 },
      { delay: 420, x: 0.32, y: 0.62, count: isSmallScreen ? 38 : 68, angle: -67, spread: 112, power: 0.94 },
      { delay: 760, x: 0.68, y: 0.56, count: isSmallScreen ? 38 : 68, angle: -113, spread: 112, power: 0.94 },
      { delay: 780, x: 0.025, y: 0.09, count: isSmallScreen ? 30 : 52, angle: 0, spread: 300, power: 0.72 },
      { delay: 780, x: 0.975, y: 0.09, count: isSmallScreen ? 30 : 52, angle: 0, spread: 300, power: 0.72 },
      { delay: 1220, x: 0.12, y: 0.36, count: isSmallScreen ? 34 : 60, angle: -25, spread: 100, power: 0.88 },
      { delay: 1220, x: 0.88, y: 0.36, count: isSmallScreen ? 34 : 60, angle: -155, spread: 100, power: 0.88 },
      { delay: 1840, x: 0.5, y: 0.3, count: isSmallScreen ? 42 : 72, angle: 0, spread: 360, power: 0.82 },
      { delay: 2540, x: 0.2, y: 0.76, count: isSmallScreen ? 33 : 56, angle: -48, spread: 94, power: 0.88 },
      { delay: 2540, x: 0.8, y: 0.76, count: isSmallScreen ? 33 : 56, angle: -132, spread: 94, power: 0.88 },
      { delay: 3420, x: 0.05, y: 0.7, count: isSmallScreen ? 28 : 46, angle: -25, spread: 92, power: 0.84 },
      { delay: 3420, x: 0.95, y: 0.7, count: isSmallScreen ? 28 : 46, angle: -155, spread: 92, power: 0.84 }
    ];
    let nextBurst = 0;
    let frameId;
    let lastFrameAt = startedAt;
    let cleanedUp = false;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const launchPopper = (burst, now) => {
      const originX = window.innerWidth * burst.x;
      const originY = window.innerHeight * burst.y;
      const baseAngle = burst.angle * Math.PI / 180;
      const spread = burst.spread * Math.PI / 180;
      const pieceShapes = ["rectangle", "square", "strip", "circle", "triangle"];

      flashes.push({ x: originX, y: originY, startedAt: now, color: colors[Math.floor(Math.random() * colors.length)] });

      for (let index = 0; index < burst.count; index += 1) {
        const angle = baseAngle + (Math.random() - 0.5) * spread;
        const speed = ((isSmallScreen ? 590 : 700) + Math.random() * (isSmallScreen ? 500 : 680)) * burst.power;
        const shape = pieceShapes[Math.floor(Math.random() * pieceShapes.length)];
        const size = (isSmallScreen ? 5 : 6) + Math.random() * 8;

        confetti.push({
          x: originX + (Math.random() - 0.5) * 12,
          y: originY + (Math.random() - 0.5) * 10,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          gravity: 280 + Math.random() * 340,
          drag: 0.982 + Math.random() * 0.014,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 15,
          width: shape === "strip" ? size * 0.36 : size,
          height: shape === "strip" ? size * 2.4 : size * (0.65 + Math.random() * 0.9),
          shape,
          color: colors[Math.floor(Math.random() * colors.length)],
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 2 + Math.random() * 5,
          startedAt: now,
          lifetime: 4 + Math.random() * 0.9
        });
      }
    };

    const drawConfetti = (piece, deltaSeconds, now) => {
      const age = (now - piece.startedAt) / 1000;
      const fade = Math.min(1, Math.max(0, (piece.lifetime - age) / 0.75));

      piece.velocityX *= Math.pow(piece.drag, deltaSeconds * 60);
      piece.velocityY *= Math.pow(piece.drag, deltaSeconds * 60);
      piece.velocityX += Math.sin(piece.wobble) * 18 * deltaSeconds;
      piece.velocityY += piece.gravity * deltaSeconds;
      piece.wobble += piece.wobbleSpeed * deltaSeconds;
      piece.x += piece.velocityX * deltaSeconds;
      piece.y += piece.velocityY * deltaSeconds;
      piece.rotation += piece.rotationSpeed * deltaSeconds;

      context.save();
      context.globalAlpha = fade;
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);
      context.fillStyle = piece.color;

      if (piece.shape === "circle") {
        context.beginPath();
        context.ellipse(0, 0, piece.width / 2, piece.height / 2, 0, 0, Math.PI * 2);
        context.fill();
      } else if (piece.shape === "triangle") {
        context.beginPath();
        context.moveTo(0, -piece.height / 2);
        context.lineTo(piece.width / 2, piece.height / 2);
        context.lineTo(-piece.width / 2, piece.height / 2);
        context.closePath();
        context.fill();
      } else {
        context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      }

      context.restore();
    };

    const cleanupCelebration = () => {
      if (cleanedUp) {
        return;
      }

      cleanedUp = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
      container.remove();
    };

    const animate = (now) => {
      const elapsed = now - startedAt;
      const deltaSeconds = Math.min((now - lastFrameAt) / 1000, 0.04);
      lastFrameAt = now;

      while (nextBurst < bursts.length && elapsed >= bursts[nextBurst].delay) {
        launchPopper(bursts[nextBurst], now);
        nextBurst += 1;
      }

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let index = flashes.length - 1; index >= 0; index -= 1) {
        const flash = flashes[index];
        const progress = (now - flash.startedAt) / 220;

        if (progress >= 1) {
          flashes.splice(index, 1);
          continue;
        }

        context.save();
        context.globalAlpha = 1 - progress;
        context.strokeStyle = flash.color;
        context.lineWidth = 2 + (1 - progress) * 2;
        context.beginPath();
        context.arc(flash.x, flash.y, 12 + progress * 46, 0, Math.PI * 2);
        context.stroke();
        context.lineWidth = 2.5;

        for (let ray = 0; ray < 14; ray += 1) {
          const angle = (Math.PI * 2 * ray) / 14;
          const innerRadius = 13 + progress * 10;
          const outerRadius = innerRadius + (1 - progress) * 44;

          context.beginPath();
          context.moveTo(flash.x + Math.cos(angle) * innerRadius, flash.y + Math.sin(angle) * innerRadius);
          context.lineTo(flash.x + Math.cos(angle) * outerRadius, flash.y + Math.sin(angle) * outerRadius);
          context.stroke();
        }

        context.restore();
      }

      for (let index = confetti.length - 1; index >= 0; index -= 1) {
        const piece = confetti[index];
        const age = (now - piece.startedAt) / 1000;

        if (age >= piece.lifetime || piece.y > window.innerHeight + 80 || piece.x < -100 || piece.x > window.innerWidth + 100) {
          confetti.splice(index, 1);
          continue;
        }

        drawConfetti(piece, deltaSeconds, now);
      }

      if (elapsed >= 4800) {
        cleanupCelebration();
        return;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);
    frameId = window.requestAnimationFrame(animate);
  };

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
      const isLeadForm = form.matches("#contactForm, .consultation-popup__form");



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
          status.classList.remove("form-status--success");

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

                status.textContent = "🎉 Thank You! Your enquiry has been submitted successfully.";
                status.classList.add("form-status--success");

              }

              celebrateLeadSubmission();

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

          if (isLeadForm) {
            try {
              await submission;

              if (status) {
                status.textContent = "🎉 Thank You! Your enquiry has been submitted successfully.";
                status.classList.add("form-status--success");
              }

              celebrateLeadSubmission();
              form.reset();
              form.querySelectorAll(".is-valid, .is-invalid").forEach(field => {
                field.classList.remove("is-valid", "is-invalid");
              });
            } catch (error) {
              console.error("Form submission error:", error);

              if (status) {
                status.textContent = "We could not submit your enquiry. Please try again.";
                status.classList.remove("form-status--success");
              }
            }

            return;
          }


          submission.catch(error => {

            console.error("Form submission error:", error);

          });



          // Preserve the existing newsletter submission behavior.

          alert("Thank you! Your enquiry has been submitted successfully.");

          form.reset();



        } catch (error) {



          console.error("Form submission error:", error);

          if (isLeadForm && status) {
            status.textContent = "We could not submit your enquiry. Please try again.";
            status.classList.remove("form-status--success");
          }



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