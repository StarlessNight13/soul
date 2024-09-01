export function nameAnimation() {
  const name = document.getElementById("name") as HTMLHeadingElement;
  const spans = Array.from(
    name.querySelectorAll("span"),
  ) as Array<HTMLSpanElement>;
  let currentIndex = 0;
  function reveal() {
    if (currentIndex < spans.length) {
      const currentSpan = spans[currentIndex];
      currentSpan.setAttribute("data-reveal", "true");
      ++currentIndex;
      setTimeout(reveal, 150);
    }
  }
  reveal();
}

function isElementInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
