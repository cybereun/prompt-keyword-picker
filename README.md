# 프롬프트 키워드 픽커 — Chrome 확장앱 v1.2.1

이미지·영상 프롬프트 키워드를 빠르게 찾아 ChatGPT, Claude, Gemini, Muse 채팅창에 **클릭 한 번으로 입력**하는 확장앱입니다.
책 《빠르게 찾아 쓰는 프롬프트 키워드 모음집》 두 페이지의 키워드 **43개**에, 웹 조사로 선별한 **42개**, 첨부 이미지 ‘카메라 워크 & 장면 전환’에서 새로 확인한 **12개**를 더해 총 **97개**를 수록했습니다.

## 수록 키워드 (97개)

| 카테고리 | 개수 | 예시 |
|---|---|---|
| 🎥 카메라 구도 | 27 | Wide Shot, Close-up, Eye Level, Bird's Eye View, Dutch Angle, 85mm Portrait, Macro Lens, Zoom In |
| 💡 조명 | 12 | Golden Hour, Blue Hour, Three-Point Lighting, Volumetric Light, Chiaroscuro |
| 🎨 색감 & 톤 | 8 | Cinematic Color, Teal and Orange, Warm Tone, Cool Tone, Desaturated |
| 🌙 분위기 | 10 | Cinematic, Dreamy, Mysterious, Serene, Dramatic, Melancholic, Cozy |
| 🖼️ 화풍 & 스타일 | 11 | Photorealistic, Oil Painting, Cyberpunk, Film Noir, Pixel Art, Double Exposure, Isometric |
| ✨ 재질 & 질감 | 7 | Metallic, Glass, Silk, Leather, Marble, Velvet |
| 🔍 화질 & 디테일 | 5 | Ultra Detailed, 8K Resolution, Hyper-realistic, Sharp Focus |
| 🎬 영상 움직임 | 9 | Time-lapse, Hyperlapse, Dolly Zoom, Crane Shot, Handheld, Steadicam, Rack Focus, Speed Ramp, Freeze Frame |
| 🔀 장면 전환 | 8 | Jump Cut, Match Cut, Whip Pan, Cross Dissolve, Wipe, Smash Cut, J-cut, L-cut |

추가분은 AI 이미지·영상 프롬프트 가이드에서 확인한 표현만 골랐습니다. 책에 이미 있는 용어와 겹치는 것(예: Shallow Depth of Field → 책의 Depth of Field과 중복)은 제외했습니다. 영상 전용 움직임은 별도 카테고리(🎬 영상 움직임)로 분리했습니다.

책 머리말의 권고대로, 기본 삽입은 **영문 표기만**입니다. 사이드 패널 상단에서 ‘한글+영문’ / ‘한글만’으로 바꿀 수 있습니다.

## 설치 방법 (Windows, Chrome — 2분)

1. 압축파일 `prompt-keyword-extension.zip`을 압축 해제합니다. (폴더 안에 `manifest.json`이 보여야 합니다)
2. Chrome 주소창에 `chrome://extensions` 를 입력해 들어갑니다.
3. 오른쪽 위 **개발자 모드**를 켭니다.
4. 왼쪽 위 **압축해제된 확장 프로그램을 로드합니다**를 클릭합니다.
5. 압축 해제한 폴더(`prompt-keyword-extension`)를 선택합니다.
6. 도구모음에 보라색 🎬 아이콘이 생기면 설치 완료입니다.

> 업데이트할 때는 새 버전 폴더로 다시 로드하면 됩니다. Chrome 웹스토어 등록은 하지 않았습니다. 개인용으로 직접 로드해 쓰는 방식입니다.

## 사용 방법

1. **ChatGPT / Claude / Gemini / Muse** 중 하나를 엽니다. (chatgpt.com, claude.ai, gemini.google.com, muse.ai)
2. 도구모음의 🎬 아이콘을 클릭하면 오른쪽에 사이드 패널이 열립니다.
   - AI 페이지 우하단에 뜨는 **🎬 키워드** 버튼을 눌러도 열립니다. (우클릭하면 그 탭에서만 숨김)
3. 검색창에 한글·영문·설명으로 검색하거나, 상단 카테고리를 누릅니다. `/` 키를 누르면 검색창으로 바로 이동합니다.
4. 키워드 카드를 **클릭하면 채팅창에 바로 입력**됩니다.
   - 이미 글이 있으면 `, `로 연결해서 뒤에 붙습니다. (예: `Golden Hour, Cinematic Color`)
   - 전송(Enter)은 하지 않습니다. 입력된 뒤 래비님이 직접 확인하고 전송하세요.
5. 여러 개를 모으려면 클릭한 키워드가 하단 **🧺 선택한 키워드**에 쌓입니다. ‘채팅에 모두 입력’ / ‘복사’ / ‘지우기’를 쓸 수 있습니다.
6. ★를 누르면 **즐겨찾기**에 저장됩니다. ‘➕ 내 키워드 추가’에서 직접 키워드를 추가할 수도 있습니다.

## 지원 사이트와 한계

- 지원: ChatGPT(chatgpt.com / chat.openai.com), Claude(claude.ai), Gemini(gemini.google.com), Muse(muse.ai)
- 각 사이트 UI가 바뀌면 입력창을 못 찾을 수 있습니다. 그때는 패널이 자동으로 복사해주니 채팅창을 한 번 클릭한 뒤 붙여넣으세요(Ctrl+V).
- 지원 사이트가 아닌 탭에서는 클릭 시 복사만 됩니다.
- 확장앱은 래비님의 채팅 내용을 읽거나 서버로 보내지 않습니다. 키워드·즐겨찾기·내 키워드는 브라우저 로컬 저장소(`chrome.storage.local`)에만 저장됩니다.

## 파일 구성

```
prompt-keyword-extension/
├── manifest.json      # Manifest V3, 사이드 패널 + content script 선언
├── background.js      # 아이콘/플로팅 버튼 클릭 시 사이드 패널 열기
├── content.js         # 각 AI 사이트 입력창 찾기 + 실제 입력 (React 대응)
├── sidepanel.html     # 사이드 패널 화면
├── sidepanel.css
├── sidepanel.js       # 검색·카테고리·즐겨찾기·장바구니·삽입 요청
├── keywords.js        # 키워드 97개 데이터 (책 43개 + 조사 추가 42개 + 첨부 이미지 12개)
├── icons/             # icon16/48/128.png
└── README.md          # 이 파일
```

## 동작 원리 (간단히)

- `content.js`가 AI 페이지의 입력창을 찾습니다. ChatGPT는 `textarea#prompt-textarea`, Claude는 ProseMirror `contenteditable`, Gemini는 `contenteditable` 텍스트박스 순으로 찾고, 없으면 보이는 textarea/contenteditable로 폴백합니다.
- React 기반 입력창이라 `value`를 직접 바꾸는 것만으로는 안 먹혀서, 네이티브 setter로 값을 넣고 `input` 이벤트를 보내고, contenteditable은 `document.execCommand('insertText')`를 씁니다.
- 사이드 패널 → content script는 `chrome.tabs.sendMessage`로 연결합니다. content script가 아직 안 떴으면 `chrome.scripting.executeScript`로 한 번 주입하고 재시도합니다.

## 버전 기록

- v1.0.0 (2026-11-11): 첫 버전. 책 키워드 43개, 4개 AI 사이트 클릭 입력, 검색·카테고리·즐겨찾기·장바구니·내 키워드 추가.
- v1.1.0 (2026-11-11): 웹 조사로 42개 추가해 총 85개. 영상 움직임 카테고리 신설(타임랩스·하이퍼랩스·돌리 줌·크레인·핸드헬드·스테디캠), 카메라에 아이 레벨·버즈아이·더치 앵글·POV·85mm·매크로·피쉬아이 등, 조명에 쓰리 포인트·볼류메트릭·키아로스쿠로·로우키 등 추가.
- v1.2.0 (2026-11-11): 첨부 이미지 ‘카메라 워크 & 장면 전환’ 24가지 대조. 겹치지 않는 12개 추가해 총 97개. 줌 인(카메라), 랙 포커스·스피드 램프·프리즈 프레임(영상 움직임), 장면 전환 카테고리 신설(점프 컷·매치 컷·휩 팬·크로스 디졸브·와이프·스매시 컷·J컷·L컷). 오빗은 오비탈과, 크레인 업은 크레인 샷과 중복이라 제외.
- v1.2.1 (2026-11-12): 로드 오류 수정. manifest의 `default_locale: ko`만 있고 `_locales` 폴더가 없어 Chrome이 “Default locale was specified, but _locales subtree is missing” 오류로 로드를 거부하던 문제 — `default_locale`을 제거해 해결. 이름·설명은 manifest에 직접 들어 있어 다국어 폴더가 필요 없음.
