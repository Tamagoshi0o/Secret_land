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

  var TYPE_LABELS = {
    asesoria: "asesoría para elegir equipo",
    demo: "demostración",
    cata: "cata de café",
    servicio: "cita de servicio técnico"
  };
  var MODE_LABELS = {
    showroom: "en nuestro showroom",
    visita: "en tu negocio",
    video: "por videollamada"
  };

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
    var text = parseISODate(value).toLocaleDateString("es-MX", {
      weekday: "long", day: "numeric", month: "long"
    });
    return text.charAt(0).toUpperCase() + text.slice(1);
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
    timeSelect.innerHTML = "";

    if (!value) {
      timeSelect.disabled = true;
      timeSelect.appendChild(new Option("Elige una fecha", ""));
      return;
    }

    var slots = getSlots(value);
    if (slots.length === 0) {
      timeSelect.disabled = true;
      timeSelect.appendChild(new Option("Sin horarios", ""));
      return;
    }

    timeSelect.disabled = false;
    timeSelect.appendChild(new Option("Selecciona", ""));
    slots.forEach(function (slot) {
      timeSelect.appendChild(new Option(slot, slot));
    });
  }

  dateInput.addEventListener("change", function () {
    populateTimes();
    validateField(dateInput);
  });

  /* ---------- Validación ---------- */
  var validators = {
    name: function (v) {
      return v.trim().length >= 2 ? "" : "Escribe tu nombre.";
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Escribe un correo válido.";
    },
    phone: function (v) {
      return v.replace(/\D/g, "").length >= 8 ? "" : "Escribe un teléfono válido.";
    },
    date: function (v) {
      if (!v) return "Elige una fecha.";
      if (v < dateInput.min) return "La fecha ya pasó.";
      if (v > dateInput.max) return "Reservamos con hasta " + MAX_DAYS_AHEAD + " días de anticipación.";
      if (!SCHEDULE[parseISODate(v).getDay()]) return "Los domingos no atendemos. Elige otro día.";
      if (getSlots(v).length === 0) return "Ya no hay horarios para hoy. Prueba otro día.";
      return "";
    },
    time: function (v) {
      return v ? "" : "Elige una hora.";
    },
    type: function (v) {
      return TYPE_LABELS[v] ? "" : "Elige el tipo de cita.";
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
    button.textContent = "Enviando…";

    submitBooking(data)
      .then(function () { showSuccess(data); })
      .catch(function () {
        alert("No pudimos agendar tu cita. Inténtalo de nuevo o llámanos.");
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = "Agendar cita";
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

  function showSuccess(data) {
    var firstName = data.name.split(" ")[0];
    document.getElementById("success-summary").textContent =
      "Gracias, " + firstName + ". Tu " + TYPE_LABELS[data.type] + " quedó agendada el " +
      formatLongDate(data.date).toLowerCase() + " a las " + data.time + ", " + MODE_LABELS[data.mode] + ".";
    document.getElementById("success-email").textContent = data.email;

    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  document.getElementById("booking-reset").addEventListener("click", function () {
    form.reset();
    populateTimes();
    form.querySelectorAll(".field").forEach(function (f) {
      f.classList.remove("has-error");
      var err = f.querySelector(".field__error");
      if (err) err.textContent = "";
    });
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
