(function () {
  "use strict";

  // Horario de citas por día de la semana (0 = domingo): hora de apertura y última cita
  var SCHEDULE = {
    0: null,                          // domingo cerrado
    1: { open: 9, lastSlot: 17 },     // lunes a viernes 9:00 – 18:00
    2: { open: 9, lastSlot: 17 },
    3: { open: 9, lastSlot: 17 },
    4: { open: 9, lastSlot: 17 },
    5: { open: 9, lastSlot: 17 },
    6: { open: 10, lastSlot: 13 }     // sábado 10:00 – 14:00
  };
  var SLOT_MINUTES = 60;
  var MAX_DAYS_AHEAD = 60;
  // Minutos de anticipación mínima para citas del mismo día
  var MIN_LEAD_MINUTES = 60;

  var APPOINTMENT_TYPES = ["asesoria", "demo", "cata", "servicio"];

  var t = window.I18N.t;
  var nav = document.getElementById("nav");
  var form = document.getElementById("booking-form");
  var success = document.getElementById("booking-success");
  var dateInput = document.getElementById("date");
  var timeSelect = document.getElementById("time");

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Navegación con fondo al hacer scroll ---------- */
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Animación de aparición ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Utilidades de fecha ---------- */
  function pad(n) { return String(n).padStart(2, "0"); }

  function toISODate(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function parseISODate(value) {
    var parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatLongDate(value) {
    return parseISODate(value).toLocaleDateString(window.I18N.locale(), {
      weekday: "long", day: "numeric", month: "long"
    });
  }

  var today = new Date();
  var maxDate = new Date();
  maxDate.setDate(today.getDate() + MAX_DAYS_AHEAD);
  dateInput.min = toISODate(today);
  dateInput.max = toISODate(maxDate);

  /* ---------- Horarios disponibles según la fecha ---------- */
  function getSlots(value) {
    var hours = SCHEDULE[parseISODate(value).getDay()];
    var slots = [];
    if (!hours) return slots;
    var now = new Date();
    var isToday = toISODate(now) === value;
    var minMinutes = now.getHours() * 60 + now.getMinutes() + MIN_LEAD_MINUTES;

    for (var m = hours.open * 60; m <= hours.lastSlot * 60; m += SLOT_MINUTES) {
      if (isToday && m < minMinutes) continue;
      slots.push(pad(Math.floor(m / 60)) + ":" + pad(m % 60));
    }
    return slots;
  }

  function populateTimes() {
    var value = dateInput.value;
    var previous = timeSelect.value;
    timeSelect.innerHTML = "";

    if (!value) {
      timeSelect.disabled = true;
      timeSelect.appendChild(new Option(t("time.pickDate"), ""));
      return;
    }

    var slots = getSlots(value);
    if (slots.length === 0) {
      timeSelect.disabled = true;
      timeSelect.appendChild(new Option(t("time.none"), ""));
      return;
    }

    timeSelect.disabled = false;
    timeSelect.appendChild(new Option(t("time.select"), ""));
    slots.forEach(function (slot) {
      timeSelect.appendChild(new Option(slot, slot));
    });
    // Conserva la hora elegida si sigue disponible (p. ej. al cambiar de idioma)
    if (slots.indexOf(previous) !== -1) timeSelect.value = previous;
  }

  dateInput.addEventListener("change", function () {
    populateTimes();
    validateField(dateInput);
  });

  /* ---------- Validación ---------- */
  var validators = {
    name: function (v) {
      return v.trim().length >= 2 ? "" : t("err.name");
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : t("err.email");
    },
    phone: function (v) {
      return v.replace(/\D/g, "").length >= 8 ? "" : t("err.phone");
    },
    date: function (v) {
      if (!v) return t("err.dateEmpty");
      if (v < dateInput.min) return t("err.datePast");
      if (v > dateInput.max) return t("err.dateMax", { days: MAX_DAYS_AHEAD });
      if (!SCHEDULE[parseISODate(v).getDay()]) return t("err.sunday");
      if (getSlots(v).length === 0) return t("err.today");
      return "";
    },
    time: function (v) {
      return v ? "" : t("err.time");
    },
    type: function (v) {
      return APPOINTMENT_TYPES.indexOf(v) !== -1 ? "" : t("err.type");
    }
  };

  function validateField(el) {
    var check = validators[el.name];
    if (!check) return true;
    var message = check(el.value);
    var field = el.closest(".field");
    field.classList.toggle("has-error", Boolean(message));
    field.querySelector(".field__error").textContent = message;
    el.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  Object.keys(validators).forEach(function (name) {
    var el = form.elements[name];
    el.addEventListener("blur", function () { validateField(el); });
    el.addEventListener("input", function () {
      if (el.closest(".field").classList.contains("has-error")) validateField(el);
    });
  });

  /* ---------- Envío ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var firstInvalid = null;
    Object.keys(validators).forEach(function (name) {
      var el = form.elements[name];
      if (!validateField(el) && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var data = {
      name: form.elements.name.value.trim(),
      company: form.elements.company.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      type: form.elements.type.value,
      mode: form.elements.mode.value,
      date: form.elements.date.value,
      time: form.elements.time.value,
      notes: form.elements.notes.value.trim()
    };

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = t("submit.sending");

    submitBooking(data)
      .then(function () { showSuccess(data); })
      .catch(function () {
        alert(t("submit.error"));
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = t("form.submit");
      });
  });

  /*
   * Punto de integración: sustituye esta función por la llamada a tu backend
   * o servicio de formularios, por ejemplo:
   *   return fetch("https://tu-api.com/citas", {
   *     method: "POST",
   *     headers: { "Content-Type": "application/json" },
   *     body: JSON.stringify(data)
   *   }).then(function (r) { if (!r.ok) throw new Error(); });
   */
  function submitBooking(data) {
    return new Promise(function (resolve) { setTimeout(resolve, 700); });
  }

  var lastBooking = null;

  function renderSummary() {
    if (!lastBooking) return;
    document.getElementById("success-summary").textContent = t("summary", {
      name: lastBooking.name.split(" ")[0],
      type: t("summary.type." + lastBooking.type),
      date: formatLongDate(lastBooking.date),
      time: lastBooking.time,
      mode: t("summary.mode." + lastBooking.mode)
    });
    document.getElementById("success-email").textContent = lastBooking.email;
  }

  function showSuccess(data) {
    lastBooking = data;
    renderSummary();
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  /* ---------- Cambio de idioma: actualiza los textos generados aquí ---------- */
  window.I18N.onChange(function () {
    populateTimes();
    form.querySelectorAll(".field.has-error").forEach(function (field) {
      var el = field.querySelector("input, select");
      if (el) validateField(el);
    });
    renderSummary();
  });
  populateTimes();

  document.getElementById("booking-reset").addEventListener("click", function () {
    form.reset();
    populateTimes();
    form.querySelectorAll(".field").forEach(function (f) {
      f.classList.remove("has-error");
      var err = f.querySelector(".field__error");
      if (err) err.textContent = "";
    });
    lastBooking = null;
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
