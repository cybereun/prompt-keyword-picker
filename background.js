// background.js — 서비스 워커: 사이드 패널 열기 + 플로팅 버튼 요청 처리
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (e) {
    // 사이드 패널을 열 수 없는 페이지(크롬 내부 페이지 등)에서는 무시
    console.warn("[키워드 픽커] 사이드 패널 열기 실패:", e);
  }
});

// content.js의 플로팅 버튼이 사이드 패널을 요청할 때
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "OPEN_SIDE_PANEL" && sender.tab && sender.tab.id) {
    chrome.sidePanel.open({ tabId: sender.tab.id }).catch((e) => {
      console.warn("[키워드 픽커] 사이드 패널 열기 실패:", e);
    });
    sendResponse({ ok: true });
    return true;
  }
  return false;
});
