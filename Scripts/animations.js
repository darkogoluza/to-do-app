const tl = gsap.timeline();

tl.fromTo(
  ".item-input",
  { opacity: "0", y: -50 },
  { opacity: "1", y: 0, duration: 0.4, ease: "power4" }
);

tl.fromTo(
  ".search-wrapper",
  { opacity: "0", y: -50 },
  { opacity: "1", y: 0, duration: 0.3, ease: "power4" },
  "-=0.2"
);

document.querySelectorAll(".todo-item").forEach((item) => {
  tl.fromTo(
    item,
    { opacity: "0", y: -25 },
    { opacity: "1", y: 0, duration: 0.2, ease: "power4" },
    "-=0.1"
  );
});
