const getOffset = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

export const interpolateColor = (
  color1: string,
  color2: string,
  factor: number,
) => {
  const hex = (x: number) => x.toString(16).padStart(2, "0");
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  return `#${hex(r)}${hex(g)}${hex(b)}`;
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  progress: number,
) => {
  const drawX2 = x1 + (x2 - x1) * progress;
  const drawY2 = y1 + (y2 - y1) * progress;

  const color = interpolateColor("#000000", "#008080", progress); // From black to teal

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(drawX2, drawY2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
};

export const drawConnections = (
  ctx: CanvasRenderingContext2D,
  stars: HTMLDivElement[],
) => {
  stars.forEach((ref, i) => {
    if (i < stars.length - 1) {
      const currentRef = ref;
      const nextRef = stars[i + 1];
      if (currentRef && nextRef) {
        const { left: x1, top: y1 } = getOffset(currentRef);
        const { left: x2, top: y2 } = getOffset(nextRef);
        drawLine(
          ctx,
          x1 + currentRef.clientWidth / 2,
          y1 + currentRef.clientHeight / 2,
          x2 + nextRef.clientWidth / 2,
          y2 + nextRef.clientHeight / 2,
          1, // Full line initially
        );
      }
    } else if (i === stars.length - 1) {
      const currentRef = ref;
      const nextRef = stars[3]; // Loop back
      if (currentRef && nextRef) {
        const { left: x1, top: y1 } = getOffset(currentRef);
        const { left: x2, top: y2 } = getOffset(nextRef);
        drawLine(
          ctx,
          x1 + currentRef.clientWidth / 2,
          y1 + currentRef.clientHeight / 2,
          x2 + nextRef.clientWidth / 2,
          y2 + nextRef.clientHeight / 2,
          1,
        );
      }
    }
  });
};

export const clearRect = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
};

export const animateLines = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  stars: HTMLDivElement[],
) => {
  const lineData = stars.reduce(
    (acc, ref, i) => {
      if (i < stars.length - 1) {
        const currentRef = ref;
        const nextRef = stars[i + 1];
        if (currentRef && nextRef) {
          const { left: x1, top: y1 } = getOffset(currentRef);
          const { left: x2, top: y2 } = getOffset(nextRef);
          acc.push({
            x1: x1 + currentRef.clientWidth / 2,
            y1: y1 + currentRef.clientHeight / 2,
            x2: x2 + nextRef.clientWidth / 2,
            y2: y2 + nextRef.clientHeight / 2,
          });
        }
      } else if (i === stars.length - 1) {
        const currentRef = ref;
        const nextRef = stars[3]; // Loop back
        if (currentRef && nextRef) {
          const { left: x1, top: y1 } = getOffset(currentRef);
          const { left: x2, top: y2 } = getOffset(nextRef);
          acc.push({
            x1: x1 + currentRef.clientWidth / 2,
            y1: y1 + currentRef.clientHeight / 2,
            x2: x2 + nextRef.clientWidth / 2,
            y2: y2 + nextRef.clientHeight / 2,
          });
        }
      }
      return acc;
    },
    [] as Array<{ x1: number; y1: number; x2: number; y2: number }>,
  );

  const animationDuration = 2000; // Total duration in milliseconds
  const lineDuration = animationDuration / lineData.length; // Duration for each line animation

  const animateLine = (
    index: number,
    previousLines: Array<{ x1: number; y1: number; x2: number; y2: number }>,
  ) => {
    const { x1, y1, x2, y2 } = lineData[index];

    let startTime: number;
    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / lineDuration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
      previousLines.forEach((line) => {
        drawLine(ctx, line.x1, line.y1, line.x2, line.y2, 1); // Redraw all previous lines
      });

      drawLine(ctx, x1, y1, x2, y2, progress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (index < lineData.length - 1) {
        setTimeout(() => {
          animateLine(index + 1, [...previousLines, { x1, y1, x2, y2 }]);
        }, 100); // Short delay before starting the next line animation
      }
    };

    requestAnimationFrame(step);
  };

  animateLine(0, []); // Start animation from the first line with an empty previousLines array
};

export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  drawConnections: () => void,
) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawConnections();
};
