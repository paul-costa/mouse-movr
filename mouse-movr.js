const robot = require("robotjs");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveEverySeconds = 5 * 60;
console.info("Mouse will move every " + moveEverySeconds + " seconds.\n");

readline.question(
  "Set a time (hours) for stopping the mouse movement: ",
  (h) => {
    if (isNaN(+h) || +h < 0 || +h > 24) {
      console.error("\nInvalid hour number. Set the hours 0 <= x <= 24");
      return;
    }
    readline.close();
    const today = new Date();
    const t = {
      y: n(today.getFullYear()),
      m: n(today.getMonth() + 1),
      d: n(today.getDate()),
      h: n(+h),
    };

    const stopDate = new Date(`${t.y}-${t.m}-${t.d}T${t.h}:00:00`);

    if (today >= stopDate) {
      console.error("\nStop date is in the past.");
      return;
    }

    move(stopDate);
  }
);

const move = (stopDate) => {
  console.info(`\nMouse movement running until: ${stopDate}.\n`);

  const interval = setInterval(() => {
    let remainingMs = stopDate - new Date();

    const h = Math.floor(remainingMs / (60 * 60 * 1000));
    remainingMs -= h * (60 * 60 * 1000);
    const m = Math.floor(remainingMs / (60 * 1000));
    remainingMs -= m * (60 * 1000);
    const s = Math.floor(remainingMs / 1000);
    remainingMs -= s * 1000;

    console.log(`remaining: ${n(h)}h ${n(m)}m ${n(s)}s`);

    if (h + m + s <= 0) {
      console.info("\nTimes up, mouse moving stops.");
      clearInterval(interval);
      return;
    }

    if (s % moveEverySeconds === 0) {
      moveMouse();
    }
  }, 1000);
};

const n = (number) => {
  return number.toString().length < 2 ? "0" + number : number.toString();
};

const moveMouse = () => {
  console.log("\nMoving mouse.\n");
  const mouse = robot.getMousePos();
  robot.moveMouse(mouse.x, mouse.y + 2);
  setTimeout(() => robot.moveMouse(mouse.x + 2, mouse.y), 25);
  setTimeout(() => robot.moveMouse(mouse.x, mouse.y - 2), 50);
  setTimeout(() => robot.moveMouse(mouse.x - 2, mouse.y), 75);
};
