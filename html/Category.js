(() => {
  const container = document.getElementById("container");

  const hexagons = container.querySelectorAll(".hexagon");
  const hexagonElements = new Array(...hexagons);

  const ripple = (target) => {
    if (container.classList.contains("show-ripple")) {
      return;
    }
    const targetRect = target.getBoundingClientRect();
    const data = hexagonElements
      .map((element) => {
        const { left, top, width, height } = element.getBoundingClientRect();
        const cx = left + width / 2;
        const cy = top + height / 2;

        const dx = Math.abs(cx - targetRect.left - targetRect.width / 2);
        const dy = Math.abs(cy - targetRect.top - targetRect.height / 2);
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        const style = window.getComputedStyle(element);
        const duration = parseFloat(style.animationDuration);
        const delay = parseFloat(style.animationDelay);
        const totalDuration = duration + delay;
        return {
          element,
          totalDuration,
          distance,
        };
      })
      .sort((a, b) => a.distance - b.distance);

    let rippleFactor = 1;
    data.forEach(({ element, totalDuration }, i) => {
      const { distance } = data[0];
      const factor = Math.max(0, 1 - distance / 400);
      element.style.setProperty("--ripple-factor", factor);
      if (i === data.length - 1) {
        rippleFactor = factor;
      }
    });

    container.classList.add("show-ripple");
    setTimeout(() => {
      container.classList.remove("show-ripple");
      hexagonElements.forEach((element) => {
        element.style.removeProperty("--ripple-factor");
      });
    }, data[data.length - 1].totalDuration * 1000 + rippleFactor * 800);
  };

  container.addEventListener("click", (e) => {
    const target = e.target.closest(".hexagon");
    if (!target) {
      return;
    }
    ripple(target);
  });

  const switchElement = document.getElementById("switch");
  switchElement.addEventListener("click", () => {
    document.body.classList.toggle("vision-ui");
    switchElement.classList.toggle("checked");
  });
})();
