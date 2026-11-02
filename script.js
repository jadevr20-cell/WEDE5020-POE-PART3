"use strict";

document.addEventListener("DOMContentLoaded", () => {
  setupEnquiryForm();
  setupContactForm();
  setupGalleryLightbox();
  setupEventSearch();
});

function setupEnquiryForm() {
  const form = document.querySelector("#enquiry-form");
  if (!form) return;

  const error = document.querySelector("#enquiry-error");
  const response = document.querySelector("#enquiry-response");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    response.textContent = "";

    if (!form.reportValidity()) {
      error.textContent = "Please check the highlighted fields and try again.";
      return;
    }

    const responses = {
      produce: "Produce availability depends on the season and current harvest. Call us to confirm availability.",
      seedlings: "Seedling availability varies. Call us to ask what is currently available.",
      volunteering: "Thank you for your interest in volunteering. Call us to discuss ways to take part.",
      workshops: "Workshop dates and spaces must be confirmed. Call us for current information.",
      sponsorship: "Thank you for your interest in supporting the foundation. Call us to discuss partnership options.",
      other: "Thank you for your enquiry. Call 072 940 1136 or email info@allgreenfoundation.org."
    };

    response.textContent =
      responses[form.elements.topic.value] || responses.other;
    form.reset();
  });
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const error = document.querySelector("#contact-error");

  form.addEventListener("submit", (event) => {
    error.textContent = "";

    if (!form.reportValidity()) {
      event.preventDefault();
      error.textContent = "Please check the highlighted fields and try again.";
    }
  });
}

function setupGalleryLightbox() {
  const images = document.querySelectorAll(".gallery img");
  const lightbox = document.querySelector("#gallery-lightbox");

  if (!images.length || !lightbox) return;

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const caption = lightbox.querySelector(".lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  let previouslyFocused = null;

  function openLightbox(image) {
    previouslyFocused = image;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;

    const figureCaption = image.closest("figure")?.querySelector("figcaption");
    caption.textContent = figureCaption?.textContent || image.alt;

    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
    previouslyFocused?.focus();
  }

  images.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-haspopup", "dialog");
    image.setAttribute("aria-label", `View larger image: ${image.alt}`);

    image.addEventListener("click", () => openLightbox(image));

    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

function setupEventSearch() {
  const search = document.querySelector("#event-search");
  const cards = [...document.querySelectorAll("[data-search-item]")];
  const status = document.querySelector("#event-search-status");

  if (!search || !cards.length) return;

  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const matches = card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    status.textContent = query
      ? `${visibleCount} event${visibleCount === 1 ? "" : "s"} found.`
      : "";
  });
}