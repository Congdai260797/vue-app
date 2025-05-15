console.log("Waiting.js loaded");
async function routeTarget(e) {
  const t = "https://tramtest-api.vwr-exv.click/target_routing",
    n = new URLSearchParams(window.location.search).get("token");
  if (n) {
    localStorage.setItem("token", n);
  }
  try {
    await getStatusWithRetry(t, e, n);
  } catch (r) {
    console.error("ErrorError:", r);
  }
}
async function getStatusWithRetry(e, t, n) {
  const l = localStorage.getItem("token");
  const o = JSON.stringify({
      tenant_id: "2f3f569d7cbe4d26a0b3fe476b98a50e",
      ...(t && { event_id: t }),
      ...(l && { vwr_token: n ? n : l }),
    }),
    a = window.location.href;
  try {
    const r = await fetch(e, {
      method: "POST",
      body: o,
      headers: { "Content-Type": "application/json", Origin: a },
      credentials: "include",
      cache: "no-store",
    });
    if (200 === r.status) {
      localStorage.removeItem("token");
      const e = await r.json(),
        n = e.route,
        o = window.location.pathname;
      switch (n) {
        case 0:
          window.location.href =
            "https://tramtest.vwr-exv.click/waiting-room-site/prewaitingroom?event_id=" +
            t +
            "&tenant_id=2f3f569d7cbe4d26a0b3fe476b98a50e&path=" +
            o +
            "&token=" +
            n +
            "&event_name=" +
            e.event_name;
          break;
        case 1:
          window.location.href =
            "https://tramtest.vwr-exv.click/waiting-room-site/waitingroom?event_id=" +
            t +
            "&tenant_id=2f3f569d7cbe4d26a0b3fe476b98a50e&path=" +
            o +
            "&token=" +
            n +
            "&event_name=" +
            e.event_name;
          break;
        case 2:
          const a = document.getElementById("loading_waiting");
          a.classList.remove("open_modal"),
            a.classList.add("hide_modal"),
            document.body.classList.add("hide_loading"),
            getForm();
      }
      return !0;
    }
    if (429 === r.status)
      console.warn("Received 429 Too Many Requests - Retrying attempt ");
    else throw new Error("HTTP error! Status: error");
  } catch (i) {
    console.error("Attempt  failed: " + i.message);
    if (attempt === retries) throw i;
  }
}
function getForm() {
  document.querySelectorAll("form").forEach((e) => {
    e.addEventListener("submit", async function (t) {
      t.preventDefault(), await trackFormSubmission();
    });
  });
}
async function trackFormSubmission() {
  try {
    if (!localStorage.getItem("hasSubmitted")) {
      const e = window.location.href,
        t = JSON.stringify({
          tenant_id: "2f3f569d7cbe4d26a0b3fe476b98a50e",
          event_id: sessionStorage.getItem("event_id"),
        }),
        n = await fetch("https://tramtest-api.vwr-exv.click/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json", Origin: e },
          body: t,
          credentials: "include",
          cache: "no-store",
        });
      if (!n.ok) throw new Error("Tracking API call failed");
      return localStorage.setItem("hasSubmitted", "true"), !0;
    }
  } catch (r) {
    return console.error("Error tracking form submission:", r), !1;
  }
}
window.onload = function () {
  localStorage.removeItem("hasSubmitted");
};
function initializeWaiting() {
  const u = navigator.userAgent;
  const e = window.location.href,
    t = "https://tramtest-api.vwr-exv.click/trigger_checking",
    n = JSON.stringify({
      tenant_id: "2f3f569d7cbe4d26a0b3fe476b98a50e",
      url: e,
      headers: { UserAgent: u },
    });
  fetch(t, { method: "POST", body: n })
    .then((e) => {
      if (!e.ok) throw new Error("Network response was not ok");
      return e.json();
    })
    .then((e) => {
      "Success" == e.message && sessionStorage.setItem("event_id", e?.event_id),
        "Success" == e.message && "queue" == e.action
          ? routeTarget(e?.event_id)
          : "Success" == e.message && "checkout" == e.action
          ? trackFormSubmission()
          : (document
              .getElementById("loading_waiting")
              .classList.remove("open_modal"),
            document
              .getElementById("loading_waiting")
              .classList.add("hide_modal"));
    })
    .catch((e) => {
      console.error("Error:", e);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTimerModal);
} else {
  window.initializeWaiting();
}

function initTimerModal() {
  const styles = document.createElement("style");
  styles.textContent =
    ".modal-time { position: fixed; width: 160px; background-color: #fff; border-radius: 16px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); overflow: hidden; z-index: 1000; user-select: none; cursor: move; padding: 20px; } .time-content { display: flex; align-items: center; justify-content: space-between; } .time-container { position: relative; width: 60px; height: 60px; } .time-circle-bg { position: absolute; top: 0; left: 0; width: 60px; height: 60px; } .time-display { position: absolute; top: 0; left: 0; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center; font-size: 15px; font-weight: bold; color: #333; } .question-container { position: relative; margin-left: 20px; } .question-icon { padding: 5px; line-height: 10px; border-radius: 20px; background: #ffdad8; cursor: auto; } .timer { position: relative; left: 60px; } ";
  document.head.appendChild(styles);
  const modalHTML =
    ' <div class="modal-time" id="timeModal"><div class="time-content"><div class="time-container"><svg class="time-circle-bg" viewBox="0 0 100 100"><!-- Background circle --><circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" stroke-width="6" ></circle><!-- Progress circle --><circle id="progressCircle" cx="50" cy="50" r="45" fill="none" stroke="#b91c1c" stroke-width="9" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="0" transform="rotate(-90 50 50)" ></circle></svg><div class="time-display" id="timeDisplay">15:00</div><div class="timer"><svg xmlns="http://www.w3.org/2000/svg" width="23px" height="23px" viewBox="0 0 24 24" fill="none" ><path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#b91c1c" /><path d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z" fill="#b91c1c" /></svg></div></div><div class="question-container"><div class="question-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 512 512" version="1.1" ><title>推定所要時間</title><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" ><g id="add" fill="#b91c1c" transform="translate(42.666667, 42.666667)" ><path d="M291.76704,163.504 C291.76704,177.01952 288.33216,188.82176 281.479253,198.90112 C275.828267,207.371093 266.358187,216.549547 253.042987,226.434987 C245.378987,231.682347 240.331947,236.618667 237.916587,241.257813 C234.87744,246.90624 233.376213,255.371093 233.376213,266.666667 L190.710827,266.666667 C190.710827,249.530027 192.53504,237.027413 196.165333,229.162667 C200.394453,219.679573 209.571627,210.098773 223.686187,200.42048 C230.350293,195.374933 235.188693,190.2368 238.214827,184.994773 C241.839787,179.143253 243.664,172.49216 243.664,165.028693 C243.664,153.13024 240.125013,144.26304 233.070293,138.404907 C227.4336,134.177067 220.56768,132.059947 212.501333,132.059947 C199.39328,132.059947 189.911467,136.398507 184.065067,145.069013 C179.829333,151.518293 177.7056,159.787733 177.7056,169.868587 L177.7056,170.173227 L132.34368,170.173227 C132.34368,143.751253 140.703147,123.790507 157.43488,110.274773 C171.554773,98.9922133 189.007787,93.3346133 209.77344,93.3346133 C227.933653,93.3346133 243.865813,96.86848 257.571627,103.9232 C280.37504,115.62624 291.76704,135.494827 291.76704,163.504 Z M426.666667,213.333333 C426.666667,331.153707 331.153707,426.666667 213.333333,426.666667 C95.51296,426.666667 3.55271368e-14,331.153707 3.55271368e-14,213.333333 C3.55271368e-14,95.51168 95.51296,3.55271368e-14 213.333333,3.55271368e-14 C331.153707,3.55271368e-14 426.666667,95.51168 426.666667,213.333333 Z M384,213.333333 C384,119.226667 307.43872,42.6666667 213.333333,42.6666667 C119.227947,42.6666667 42.6666667,119.226667 42.6666667,213.333333 C42.6666667,307.43872 119.227947,384 213.333333,384 C307.43872,384 384,307.43872 384,213.333333 Z M213.332053,282.666667 C198.60416,282.666667 186.665387,294.60544 186.665387,309.333333 C186.665387,324.061227 198.60416,336 213.332053,336 C228.059947,336 239.99872,324.061227 239.99872,309.333333 C239.99872,294.60544 228.059947,282.666667 213.332053,282.666667 Z" id="Shape" ></path></g></g></svg></div></div></div></div> ';
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modal = document.getElementById("timeModal");
  const timeDisplay = document.getElementById("timeDisplay");
  const progressCircle = document.getElementById("progressCircle");
  const TOTAL_TIME = 15 * 60;
  const CIRCLE_CIRCUMFERENCE = 283;
  function savePosition() {
    const rect = modal.getBoundingClientRect();
    const position = {
      left: rect.left,
      top: rect.top,
      usePosition: true,
    };
    localStorage.setItem("timerModalPosition", JSON.stringify(position));
  }
  function loadPosition() {
    try {
      const savedPosition = localStorage.getItem("timerModalPosition");
      if (savedPosition) {
        const position = JSON.parse(savedPosition);
        if (position.usePosition) {
          modal.style.position = "absolute";
          modal.style.left = position.left + "px";
          modal.style.top = position.top + "px";
          modal.style.right = "auto";
          modal.style.bottom = "auto";
          return true;
        }
      }
    } catch (e) {
      console.error("Error loading saved position:", e);
    }
    return false;
  }
  function positionModalBottomRight() {
    const padding = 20;
    modal.style.right = padding + "px";
    modal.style.bottom = padding + "px";
    modal.style.left = "auto";
    modal.style.top = "auto";
  }
  if (!loadPosition()) {
    positionModalBottomRight();
  }
  window.addEventListener("resize", function () {
    const rect = modal.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (rect.right > windowWidth || rect.bottom > windowHeight) {
      if (modal.style.position === "absolute") {
        const maxX = windowWidth - modal.offsetWidth;
        const maxY = windowHeight - modal.offsetHeight;
        modal.style.left = Math.min(rect.left, maxX) + "px";
        modal.style.top = Math.min(rect.top, maxY) + "px";
        savePosition();
      } else {
        positionModalBottomRight();
      }
    }
  });
  let timeRemaining = TOTAL_TIME;
  function updateCountdown() {
    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      timeDisplay.textContent = "00:00";
      progressCircle.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;
      return;
    }
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeRemaining % 60).toString().padStart(2, "0");
    timeDisplay.textContent = minutes + ":" + seconds;
    const progress = timeRemaining / TOTAL_TIME;
    const dashOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);
    progressCircle.style.strokeDashoffset = dashOffset;
  }
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
  let isDragging = false;
  let offsetX, offsetY;
  modal.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = modal.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    modal.style.cursor = "grabbing";
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    if (modal.style.position !== "absolute") {
      const rect = modal.getBoundingClientRect();
      modal.style.position = "absolute";
      modal.style.left = rect.left + "px";
      modal.style.top = rect.top + "px";
      modal.style.right = "auto";
      modal.style.bottom = "auto";
    }
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    const maxX = window.innerWidth - modal.offsetWidth;
    const maxY = window.innerHeight - modal.offsetHeight;
    modal.style.left = Math.max(0, Math.min(x, maxX)) + "px";
    modal.style.top = Math.max(0, Math.min(y, maxY)) + "px";
  });
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      savePosition();
    }
    isDragging = false;
    modal.style.cursor = "move";
  });
  document.addEventListener("mouseleave", () => {
    if (isDragging) {
      savePosition();
    }
    isDragging = false;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTimerModal);
} else {
  initTimerModal();
}
