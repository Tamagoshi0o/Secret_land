/*
 * Traducción de la página: español (idioma original del HTML) y chino mandarín
 * estándar en caracteres simplificados.
 *
 * Los textos en español se leen del propio HTML, así que solo hay que escribirlos
 * una vez. Cada elemento traducible lleva uno de estos atributos con su clave:
 *   data-i18n              texto
 *   data-i18n-html         HTML (para textos con <br> o <em>)
 *   data-i18n-placeholder  atributo placeholder
 *   data-i18n-aria         atributo aria-label
 */
(function () {
  "use strict";

  var STORAGE_KEY = "sl-lang";

  var LANGS = {
    es: { html: "es", locale: "es-MX" },
    zh: { html: "zh-CN", locale: "zh-CN" }
  };

  // Textos que solo existen en JavaScript (en ambos idiomas)
  // y todas las traducciones al chino de los textos del HTML.
  var MESSAGES = {
    es: {
      "lang.switch": "Cambiar idioma a chino mandarín",
      "lang.label": "中文",

      "err.name": "Escribe tu nombre.",
      "err.email": "Escribe un correo válido.",
      "err.phone": "Escribe un teléfono válido.",
      "err.dateEmpty": "Elige una fecha.",
      "err.datePast": "La fecha ya pasó.",
      "err.dateMax": "Agendamos con hasta {days} días de anticipación.",
      "err.sunday": "Los domingos no atendemos. Elige otro día.",
      "err.today": "Ya no hay horarios para hoy. Prueba otro día.",
      "err.time": "Elige una hora.",
      "err.type": "Elige el tipo de cita.",

      "time.pickDate": "Elige una fecha",
      "time.none": "Sin horarios",
      "time.select": "Selecciona",

      "submit.sending": "Enviando…",
      "submit.error": "No pudimos agendar tu cita. Inténtalo de nuevo o llámanos.",

      "summary": "Gracias, {name}. Tu {type} quedó agendada el {date} a las {time}, {mode}.",
      "summary.type.asesoria": "asesoría para elegir equipo",
      "summary.type.demo": "demostración",
      "summary.type.cata": "cata de café",
      "summary.type.servicio": "cita de servicio técnico",
      "summary.mode.showroom": "en nuestro showroom",
      "summary.mode.visita": "en tu negocio",
      "summary.mode.video": "por videollamada"
    },

    zh: {
      "meta.title": "Secret Land — 精品咖啡与咖啡机",
      "meta.desc": "Secret Land 为家庭、办公室和门店提供精品咖啡与意式咖啡机。在线预约咨询、演示或技术服务。",

      "lang.switch": "切换到西班牙语",
      "lang.label": "ES",

      "nav.home": "Secret Land，首页",
      "nav.main": "主导航",
      "nav.services": "服务",
      "nav.catalog": "产品目录",
      "nav.clients": "客户",
      "nav.contact": "联系我们",
      "nav.cta": "立即预约",

      "hero.eyebrow": "精品咖啡 · 意式咖啡机",
      "hero.title": "每一杯好咖啡<br>都始于<br><em>合适的设备。</em>",
      "hero.lead": "我们为您的家庭、办公室或门店精选产地咖啡豆与专业咖啡机。预约咨询，我们将协助您选购、安装并维护全部设备。",
      "hero.cta": "预约咨询",
      "hero.catalog": "查看产品目录",

      "services.eyebrow": "我们的业务",
      "services.title": "从咖啡豆到咖啡杯，一站式服务。",
      "services.1.title": "产地咖啡",
      "services.1.text": "精选高海拔庄园咖啡豆，每周小批量烘焙。可提供整豆，或按您的冲煮方式研磨。",
      "services.2.title": "咖啡机与磨豆机",
      "services.2.text": "家用及商用意式咖啡设备。我们会根据您的出杯量和预算推荐最合适的型号。",
      "services.3.title": "安装与售后",
      "services.3.text": "我们负责安装、调试并培训您的团队，并提供定期保养和随时响应的技术维修服务。",

      "catalog.eyebrow": "产品目录",
      "catalog.title": "精挑细选，少而精。",
      "catalog.lead": "以下是我们的部分产品。预约时，我们将为您展示完整目录及批量价格。",
      "catalog.beans": "咖啡豆",
      "catalog.b1.name": "埃塞俄比亚 耶加雪菲",
      "catalog.b1.meta": "花香 · 柑橘 · 1 公斤",
      "catalog.b2.name": "哥伦比亚 慧兰",
      "catalog.b2.meta": "焦糖 · 红色莓果 · 1 公斤",
      "catalog.b3.name": "恰帕斯 高海拔",
      "catalog.b3.meta": "巧克力 · 坚果 · 1 公斤",
      "catalog.b4.name": "Secret 意式拼配",
      "catalog.b4.meta": "可可 · 红糖 · 醇厚 · 1 公斤",
      "catalog.machines": "咖啡机与设备",
      "catalog.m1.name": "家用意式咖啡机（单头）",
      "catalog.m1.meta": "单冲煮头 · 适合家庭及小型办公室",
      "catalog.m1.price": "$18,900 起",
      "catalog.m2.name": "专业意式咖啡机（双头）",
      "catalog.m2.meta": "双冲煮头 · 适合咖啡馆及餐厅",
      "catalog.m2.price": "$74,500 起",
      "catalog.m3.name": "办公室全自动咖啡机",
      "catalog.m3.meta": "一键出品 · 办公室首选",
      "catalog.m3.price": "$32,000 起",
      "catalog.m4.name": "平刀磨豆机",
      "catalog.m4.meta": "即磨即用 · 64 毫米刀盘",
      "catalog.m4.price": "$9,800 起",

      "clients.eyebrow": "服务对象",
      "clients.title": "为您量身定制的方案。",
      "clients.1.title": "家庭",
      "clients.1.text": "一台紧凑型咖啡机、一台磨豆机，外加每月新鲜咖啡豆。我们会教您做出第一杯意式浓缩。",
      "clients.2.title": "办公室",
      "clients.2.text": "全自动咖啡设备、定期咖啡豆供应，并含设备保养。",
      "clients.3.title": "咖啡馆与餐厅",
      "clients.3.text": "专业设备、批量咖啡豆、咖啡师培训及优先技术支持。",

      "booking.eyebrow": "在线预约",
      "booking.title": "聊聊您的咖啡。",
      "booking.lead": "请选择预约类型、方式和方便的时间，我们将通过电子邮件与您确认。",
      "booking.note1": "咨询和品鉴均免费。",
      "booking.note2": "每次预约约一小时。",
      "booking.note3": "可在展厅、您的门店或通过视频通话进行。",

      "form.optional": "（选填）",
      "form.name": "姓名",
      "form.name.ph": "王芳",
      "form.company": "公司",
      "form.company.ph": "您的公司或门店名称",
      "form.email": "电子邮箱",
      "form.email.ph": "wangfang@example.com",
      "form.phone": "电话",
      "form.type": "预约类型",
      "form.type.select": "请选择",
      "form.type.asesoria": "设备选购咨询",
      "form.type.demo": "咖啡机演示",
      "form.type.cata": "咖啡品鉴",
      "form.type.servicio": "技术维修或保养",
      "form.mode": "预约方式",
      "form.mode.showroom": "展厅",
      "form.mode.visita": "上门服务",
      "form.mode.video": "视频通话",
      "form.date": "日期",
      "form.time": "时间",
      "form.notes": "补充说明",
      "form.notes.ph": "例如：现有设备、每日出杯量、感兴趣的型号……",
      "form.submit": "提交预约",
      "form.legal": "提交预约即表示您同意我们仅将您的信息用于处理本次预约。",

      "success.title": "预约成功！",
      "success.sent": "我们将把确认邮件发送至",
      "success.end": "。",
      "success.again": "再预约一次",

      "contact.showroom": "展厅",
      "contact.directions": "路线导航",
      "contact.hours": "营业时间",
      "contact.weekdays": "周一至周五",
      "contact.saturday": "周六",
      "contact.sunday": "周日",
      "contact.closed": "休息",
      "contact.sales": "销售与支持",

      "footer.tagline": "咖啡与专业设备。",

      "err.name": "请输入您的姓名。",
      "err.email": "请输入有效的电子邮箱。",
      "err.phone": "请输入有效的电话号码。",
      "err.dateEmpty": "请选择日期。",
      "err.datePast": "该日期已过。",
      "err.dateMax": "最多可提前 {days} 天预约。",
      "err.sunday": "周日休息，请选择其他日期。",
      "err.today": "今天已无可预约时段，请选择其他日期。",
      "err.time": "请选择时间。",
      "err.type": "请选择预约类型。",

      "time.pickDate": "请先选择日期",
      "time.none": "暂无可选时段",
      "time.select": "请选择",

      "submit.sending": "提交中…",
      "submit.error": "预约提交失败，请重试或致电我们。",

      "summary": "{name}，感谢您！您的{type}已预约在{date} {time}，{mode}进行。",
      "summary.type.asesoria": "设备选购咨询",
      "summary.type.demo": "咖啡机演示",
      "summary.type.cata": "咖啡品鉴",
      "summary.type.servicio": "技术维修服务",
      "summary.mode.showroom": "在我们的展厅",
      "summary.mode.visita": "上门",
      "summary.mode.video": "通过视频通话"
    }
  };

  var BINDINGS = [
    { attr: "data-i18n", get: function (el) { return el.textContent; }, set: function (el, v) { el.textContent = v; } },
    { attr: "data-i18n-html", get: function (el) { return el.innerHTML; }, set: function (el, v) { el.innerHTML = v; } },
    { attr: "data-i18n-placeholder", get: function (el) { return el.placeholder; }, set: function (el, v) { el.placeholder = v; } },
    { attr: "data-i18n-aria", get: function (el) { return el.getAttribute("aria-label"); }, set: function (el, v) { el.setAttribute("aria-label", v); } }
  ];

  var metaDesc = document.querySelector('meta[name="description"]');
  var toggle = document.getElementById("lang-toggle");
  var originals = {};
  var listeners = [];
  var current = "es";

  // Guarda los textos originales en español antes de traducir nada
  originals["meta.title"] = document.title;
  originals["meta.desc"] = metaDesc ? metaDesc.content : "";
  BINDINGS.forEach(function (b) {
    document.querySelectorAll("[" + b.attr + "]").forEach(function (el) {
      var key = el.getAttribute(b.attr);
      if (!(key in originals)) originals[key] = b.get(el);
    });
  });

  function t(key, vars) {
    var text = MESSAGES[current][key];
    if (text === undefined) text = MESSAGES.es[key];
    if (text === undefined) text = originals[key];
    if (text === undefined) return key;
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, function (m, name) {
        return name in vars ? vars[name] : m;
      });
    }
    return text;
  }

  function apply() {
    document.documentElement.lang = LANGS[current].html;
    document.title = t("meta.title");
    if (metaDesc) metaDesc.content = t("meta.desc");

    BINDINGS.forEach(function (b) {
      document.querySelectorAll("[" + b.attr + "]").forEach(function (el) {
        b.set(el, t(el.getAttribute(b.attr)));
      });
    });

    if (toggle) {
      toggle.textContent = t("lang.label");
      toggle.lang = current === "es" ? LANGS.zh.html : LANGS.es.html;
      toggle.setAttribute("aria-label", t("lang.switch"));
      toggle.title = t("lang.switch");
    }
  }

  function setLang(lang) {
    if (!LANGS[lang] || lang === current) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* sin almacenamiento */ }
    apply();
    listeners.forEach(function (fn) { fn(lang); });
  }

  function initialLang() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* sin almacenamiento */ }
    if (LANGS[stored]) return stored;
    var browser = (navigator.language || "").toLowerCase();
    return browser.indexOf("zh") === 0 ? "zh" : "es";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setLang(current === "es" ? "zh" : "es");
    });
  }

  current = initialLang();
  apply();

  window.I18N = {
    t: t,
    lang: function () { return current; },
    locale: function () { return LANGS[current].locale; },
    setLang: setLang,
    onChange: function (fn) { listeners.push(fn); }
  };
})();
