// sidepanel.js — 검색·카테고리·즐겨찾기·장바구니·채팅창 삽입
(function () {
  "use strict";

  var SUPPORTED = [
    { host: "chatgpt.com", label: "ChatGPT" },
    { host: "chat.openai.com", label: "ChatGPT" },
    { host: "claude.ai", label: "Claude" },
    { host: "gemini.google.com", label: "Gemini" },
    { host: "aistudio.google.com", label: "Gemini" },
    { host: "muse.ai", label: "Muse" }
  ];

  var state = { cat: "all", q: "", fmt: "en", favs: new Set(), custom: [], basket: [] };
  var $ = function (id) { return document.getElementById(id); };

  var toastTimer = null;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  function siteLabel(url) {
    if (!url) return null;
    try {
      var h = new URL(url).hostname;
      for (var i = 0; i < SUPPORTED.length; i++) {
        if (h === SUPPORTED[i].host || h.endsWith("." + SUPPORTED[i].host)) return SUPPORTED[i].label;
      }
    } catch (e) {}
    return null;
  }

  function allKeywords() {
    return window.PROMPT_KEYWORDS.concat(state.custom);
  }

  function catLabel(id) {
    var cats = window.PROMPT_CATEGORIES;
    for (var i = 0; i < cats.length; i++) if (cats[i].id === id) return cats[i].label.replace(/^[^\s]+\s/, "");
    return id;
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    return allKeywords().filter(function (kw) {
      if (state.cat === "fav" && !state.favs.has(kw.id)) return false;
      if (state.cat === "custom" && !kw.custom) return false;
      if (state.cat !== "all" && state.cat !== "fav" && state.cat !== "custom" && kw.cat !== state.cat) return false;
      if (!q) return true;
      return (kw.ko + " " + kw.en + " " + (kw.desc || "")).toLowerCase().includes(q);
    });
  }

  function renderCats() {
    var box = $("cats");
    box.innerHTML = "";
    window.PROMPT_CATEGORIES.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = c.label;
      b.classList.toggle("active", state.cat === c.id);
      b.addEventListener("click", function () { state.cat = c.id; renderCats(); renderList(); });
      box.appendChild(b);
    });
  }

  function renderList() {
    var list = $("list");
    list.innerHTML = "";
    var items = filtered();
    $("countBadge").textContent = items.length + "개";
    if (!items.length) {
      var d = document.createElement("div");
      d.className = "no-result";
      d.textContent = state.q ? "검색 결과가 없습니다. 다른 단어로 찾아보세요." : "이 카테고리에 키워드가 아직 없습니다.";
      list.appendChild(d);
      return;
    }
    items.forEach(function (kw) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.title = kw.desc || "";

      var ko = document.createElement("span"); ko.className = "ko"; ko.textContent = kw.ko;
      var en = document.createElement("span"); en.className = "en"; en.textContent = kw.en;
      var fav = document.createElement("span");
      fav.className = "fav" + (state.favs.has(kw.id) ? " on" : "");
      fav.textContent = state.favs.has(kw.id) ? "★" : "☆";
      fav.title = "즐겨찾기";
      fav.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleFav(kw.id);
      });
      var desc = document.createElement("span"); desc.className = "desc"; desc.textContent = kw.desc || "";
      var tag = document.createElement("span"); tag.className = "cat-tag";
      tag.textContent = (kw.custom ? "내 키워드 · " : "") + catLabel(kw.cat);

      card.appendChild(ko); card.appendChild(fav); card.appendChild(en); card.appendChild(desc); card.appendChild(tag);
      card.addEventListener("click", function () { onPick(kw); });
      list.appendChild(card);
    });
  }

  function renderBasket() {
    var box = $("basketChips");
    box.innerHTML = "";
    $("basketCount").textContent = state.basket.length;
    if (!state.basket.length) {
      var s = document.createElement("span");
      s.className = "empty";
      s.textContent = "키워드를 클릭하면 여기에 모입니다.";
      box.appendChild(s);
      return;
    }
    state.basket.forEach(function (kw) {
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = window.formatKeyword(kw, state.fmt) + " ×";
      chip.title = "클릭하면 장바구니에서 빼기";
      chip.addEventListener("click", function () {
        state.basket = state.basket.filter(function (k) { return k.id !== kw.id; });
        renderBasket();
      });
      box.appendChild(chip);
    });
  }

  function addToBasket(kw) {
    if (!state.basket.some(function (k) { return k.id === kw.id; })) {
      state.basket.push(kw);
      renderBasket();
    }
  }

  function toggleFav(id) {
    if (state.favs.has(id)) state.favs.delete(id); else state.favs.add(id);
    chrome.storage.local.set({ pk_favs: Array.from(state.favs) });
    renderList();
  }

  // ── 채팅창 삽입 (핵심) ──
  function insertIntoChat(text) {
    return new Promise(function (resolve) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs && tabs[0];
        if (!tab || !tab.id) { resolve({ ok: false, reason: "no-tab" }); return; }
        var label = siteLabel(tab.url);
        if (!label) { resolve({ ok: false, reason: "unsupported-site" }); return; }

        chrome.tabs.sendMessage(tab.id, { type: "INSERT_TEXT", text: text }, function (res) {
          if (chrome.runtime.lastError || !res) {
            // content script가 아직 안 뜬 경우: 직접 주입하고 한 번 더 시도
            chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] }, function () {
              if (chrome.runtime.lastError) { resolve({ ok: false, reason: "inject-failed" }); return; }
              chrome.tabs.sendMessage(tab.id, { type: "INSERT_TEXT", text: text }, function (res2) {
                resolve(res2 || { ok: false, reason: "no-response" });
              });
            });
            return;
          }
          resolve(res);
        });
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; });
    }
    return Promise.resolve(false);
  }

  function onPick(kw) {
    var text = window.formatKeyword(kw, state.fmt);
    addToBasket(kw);
    insertIntoChat(text).then(function (res) {
      if (res && res.ok) {
        toast("✓ " + text + "  →  " + (res.site || "") + " 입력창에 넣었어요");
      } else if (res && res.reason === "unsupported-site") {
        copyText(text).then(function (ok) {
          toast(ok ? "지금 탭은 지원 사이트가 아니에요. 복사했으니 채팅창에 붙여넣으세요." : "지원 사이트가 아니에요. ChatGPT·Claude·Gemini·Muse 탭에서 열어주세요.");
        });
      } else if (res && res.reason === "no-editor") {
        copyText(text).then(function () {
          toast("입력창을 찾지 못했어요. 복사했으니 채팅창을 한 번 클릭한 뒤 붙여넣으세요.");
        });
      } else {
        copyText(text).then(function () {
          toast("바로 입력이 안 돼 복사했어요. 채팅창에 붙여넣으세요.");
        });
      }
    });
  }

  function updateSiteStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs && tabs[0];
      var label = tab ? siteLabel(tab.url) : null;
      var el = $("siteStatus");
      if (label) el.textContent = "● " + label + " 탭에서 사용 중 — 클릭하면 바로 입력됩니다";
      else el.textContent = "○ 지금 탭은 지원 사이트가 아닙니다 — ChatGPT · Claude · Gemini · Muse 탭에서 열어주세요";
    });
  }

  // ── 이벤트 ──
  $("search").addEventListener("input", function (e) { state.q = e.target.value; renderList(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== $("search")) {
      e.preventDefault(); $("search").focus();
    }
  });

  document.querySelectorAll('input[name="fmt"]').forEach(function (r) {
    r.addEventListener("change", function () {
      state.fmt = r.value;
      chrome.storage.local.set({ pk_fmt: state.fmt });
      renderBasket();
    });
  });

  $("insertAll").addEventListener("click", function () {
    if (!state.basket.length) { toast("장바구니가 비어 있어요. 키워드를 먼저 골라주세요."); return; }
    var text = state.basket.map(function (k) { return window.formatKeyword(k, state.fmt); }).join(", ");
    insertIntoChat(text).then(function (res) {
      if (res && res.ok) toast("✓ " + state.basket.length + "개 키워드를 한 번에 넣었어요");
      else copyText(text).then(function () { toast("바로 입력이 안 돼 복사했어요. 채팅창에 붙여넣으세요."); });
    });
  });

  $("copyAll").addEventListener("click", function () {
    if (!state.basket.length) { toast("장바구니가 비어 있어요."); return; }
    var text = state.basket.map(function (k) { return window.formatKeyword(k, state.fmt); }).join(", ");
    copyText(text).then(function (ok) { toast(ok ? "✓ 복사했어요: " + text : "복사에 실패했어요."); });
  });

  $("clearBasket").addEventListener("click", function () {
    state.basket = [];
    renderBasket();
  });

  $("customForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ko = $("cKo").value.trim(), en = $("cEn").value.trim();
    if (!ko || !en) return;
    var kw = {
      id: "custom-" + Date.now(), cat: $("cCat").value,
      ko: ko, en: en, desc: $("cDesc").value.trim(), custom: true
    };
    state.custom.push(kw);
    chrome.storage.local.set({ pk_custom: state.custom });
    e.target.reset();
    state.cat = "custom";
    renderCats(); renderList();
    toast("✓ 내 키워드에 추가했어요");
  });

  // ── 초기화 ──
  chrome.storage.local.get(["pk_favs", "pk_custom", "pk_fmt"], function (data) {
    if (data.pk_favs) state.favs = new Set(data.pk_favs);
    if (data.pk_custom) state.custom = data.pk_custom;
    if (data.pk_fmt) {
      state.fmt = data.pk_fmt;
      var radio = document.querySelector('input[name="fmt"][value="' + state.fmt + '"]');
      if (radio) radio.checked = true;
    }
    renderCats(); renderList(); renderBasket(); updateSiteStatus();
  });
  // 탭이 바뀌면 상태 갱신
  chrome.tabs.onActivated.addListener(updateSiteStatus);
  chrome.tabs.onUpdated.addListener(function (tabId, info) { if (info.url) updateSiteStatus(); });
})();
