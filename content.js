// content.js — ChatGPT / Claude / Gemini / Muse 채팅창에 키워드를 직접 입력하는 스크립트
// React(Claude·ChatGPT 등)가 입력 변화를 감지하도록 네이티브 setter + input 이벤트를 쓴다.
(function () {
  "use strict";

  var SITE = (function () {
    var h = location.hostname;
    if (h.includes("chatgpt.com") || h.includes("openai.com")) return "ChatGPT";
    if (h.includes("claude.ai")) return "Claude";
    if (h.includes("gemini.google.com") || h.includes("aistudio.google.com")) return "Gemini";
    if (h.includes("muse.ai")) return "Muse";
    return "기타";
  })();

  function isVisible(el) {
    if (!el || el.disabled) return false;
    var r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    var s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none";
  }

  function pickVisible(list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] && isVisible(list[i])) return list[i];
    }
    return null;
  }

  // 사이트별 입력창 찾기. 사이트 UI가 바뀌어도 범용 선택자가 받쳐준다.
  function findEditor() {
    var active = document.activeElement;
    if (active && isVisible(active) &&
        (active.tagName === "TEXTAREA" ||
         (active.isContentEditable && active.getAttribute("contenteditable") === "true"))) {
      return active;
    }

    if (SITE === "ChatGPT") {
      var c = pickVisible([
        document.querySelector("#prompt-textarea"),
        document.querySelector('textarea[data-id="root"]'),
        document.querySelector('div[contenteditable="true"][data-placeholder]'),
        document.querySelector("textarea")
      ]);
      if (c) return c;
    }
    if (SITE === "Claude") {
      var cl = pickVisible([
        document.querySelector(".ProseMirror[contenteditable='true']"),
        document.querySelector('div[contenteditable="true"]')
      ]);
      if (cl) return cl;
    }
    if (SITE === "Gemini") {
      var g = pickVisible([
        document.querySelector('div[contenteditable="true"][role="textbox"]'),
        document.querySelector("rich-textarea div[contenteditable='true']"),
        document.querySelector('div[contenteditable="true"]'),
        document.querySelector("textarea")
      ]);
      if (g) return g;
    }

    // 범용 폴백: 보이는 textarea → 보이는 contenteditable 순
    var ta = pickVisible(Array.prototype.slice.call(document.querySelectorAll("textarea")));
    if (ta) return ta;
    var ce = pickVisible(Array.prototype.slice.call(
      document.querySelectorAll('[contenteditable="true"]')));
    if (ce) return ce;
    return null;
  }

  function currentText(editor) {
    if (editor.tagName === "TEXTAREA" || editor.tagName === "INPUT") return editor.value || "";
    return editor.innerText || editor.textContent || "";
  }

  function insertIntoTextarea(editor, text) {
    editor.focus();
    var setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, "value").set;
    var start = editor.selectionStart != null ? editor.selectionStart : editor.value.length;
    var end = editor.selectionEnd != null ? editor.selectionEnd : editor.value.length;
    var next = editor.value.slice(0, start) + text + editor.value.slice(end);
    setter.call(editor, next);
    var pos = start + text.length;
    try { editor.setSelectionRange(pos, pos); } catch (e) {}
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    editor.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function placeCaretAtEnd(editor) {
    var sel = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function insertIntoContentEditable(editor, text) {
    editor.focus();
    var sel = window.getSelection();
    // 커서가 입력창 밖에 있으면 맨 끝으로 이동
    if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) placeCaretAtEnd(editor);

    // execCommand가 가장 확실하게 React/ProseMirror의 input을 트리거한다.
    var ok = false;
    try { ok = document.execCommand("insertText", false, text); } catch (e) { ok = false; }
    if (!ok) {
      // 폴백: Range로 텍스트 노드 직접 삽입
      try {
        var range = sel.getRangeAt(0);
        range.deleteFromDocument();
        var node = document.createTextNode(text);
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (e) {}
      editor.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
    }
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function insertText(rawText) {
    var editor = findEditor();
    if (!editor) return { ok: false, site: SITE, reason: "no-editor" };

    var existing = currentText(editor).trim();
    var text = rawText;
    // 이미 내용이 있으면 쉼표로 연결. 빈 입력창이면 그대로.
    if (existing && !/[,，\s]$/.test(currentText(editor))) text = ", " + rawText;

    if (editor.tagName === "TEXTAREA" || editor.tagName === "INPUT") {
      insertIntoTextarea(editor, text);
    } else {
      insertIntoContentEditable(editor, text);
    }
    return { ok: true, site: SITE };
  }

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg && msg.type === "INSERT_TEXT") {
      try {
        sendResponse(insertText(msg.text || ""));
      } catch (e) {
        sendResponse({ ok: false, site: SITE, reason: String(e && e.message || e) });
      }
      return true;
    }
    if (msg && msg.type === "PING") {
      var ed = findEditor();
      sendResponse({ ok: true, site: SITE, hasEditor: !!ed });
      return true;
    }
    return false;
  });

  // ── 플로팅 버튼: AI 페이지 우하단에 "🎬 키워드" 버튼을 띄워 사이드 패널을 연다 ──
  function addFloatingButton() {
    if (document.getElementById("pk-picker-fab")) return;
    var btn = document.createElement("button");
    btn.id = "pk-picker-fab";
    btn.type = "button";
    btn.title = "프롬프트 키워드 픽커 열기";
    btn.textContent = "🎬 키워드";
    btn.style.cssText = [
      "position:fixed", "right:16px", "bottom:96px", "z-index:2147483647",
      "padding:8px 12px", "border-radius:999px", "border:1px solid #7c6cff",
      "background:#fff", "color:#4b3fd4", "font-size:13px", "font-weight:700",
      "font-family:system-ui,sans-serif", "cursor:pointer",
      "box-shadow:0 4px 16px rgba(0,0,0,.18)"
    ].join(";");
    btn.addEventListener("click", function () {
      chrome.runtime.sendMessage({ type: "OPEN_SIDE_PANEL" });
    });
    btn.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      btn.remove(); // 우클릭으로 이번 세션만 숨기기
    });
    document.body.appendChild(btn);
  }

  if (document.body) addFloatingButton();
  else document.addEventListener("DOMContentLoaded", addFloatingButton);
})();
