// 프롬프트 키워드 모음집 — 책 43개 + 웹 조사 42개 + 첨부 이미지 12개 = 총 97개
// 출처 1: 래비님이 보내주신 책 사진 '빠르게 찾아 쓰는 프롬프트 키워드 모음집' (43개)
// 출처 2: 2026-11-11 웹 조사 — AI 이미지·영상 프롬프트 가이드에서 책에 없던 용어만 선별 (42개)
// 출처 3: 2026-11-11 첨부 이미지 '카메라 워크 & 장면 전환' 24가지 중 기존 85개와 겹치지 않는 12개
//   카메라 각도·렌즈, 조명, 분위기, 영상 움직임 용어는 검색 가이드에서 확인한 표현을 씀.
// 규칙: 프롬프트에는 영문 표기를 함께 쓰는 것을 추천 (책 머리말)
// window.PROMPT_KEYWORDS 로 사이드패널에서 사용. content.js는 이 파일을 쓰지 않음.
(function () {
  const KEYWORDS = [
    // ── 카메라 구도 (책 14개) ──
    { id: "wide-shot", cat: "camera", ko: "와이드 샷", en: "Wide Shot", desc: "공간 전체를 보여 주는 샷. 장소와 상황을 한눈에 파악" },
    { id: "medium-shot", cat: "camera", ko: "미디엄 샷", en: "Medium Shot", desc: "허리~머리. 행동과 표정을 균형 있게 보여 줌" },
    { id: "close-up", cat: "camera", ko: "클로즈업", en: "Close-up", desc: "얼굴이나 물체를 화면 가득 채워 감정과 디테일을 강조" },
    { id: "low-angle", cat: "camera", ko: "로우 앵글", en: "Low Angle", desc: "아래에서 올려다보는 구도. 대상을 거대하고 위압적으로 표현" },
    { id: "high-angle", cat: "camera", ko: "하이 앵글", en: "High Angle", desc: "위에서 내려다보는 구도. 대상을 나약하게 연출하거나 전체 지형을 조감할 때 사용" },
    { id: "dolly-in", cat: "camera", ko: "돌리 인", en: "Dolly In", desc: "카메라가 피사체를 향해 전진. 긴장감과 몰입감 증가" },
    { id: "dolly-out", cat: "camera", ko: "돌리 아웃", en: "Dolly Out", desc: "카메라가 피사체에서 후퇴. 공간 확장, 고립감 표현" },
    { id: "tracking-shot", cat: "camera", ko: "트래킹 샷", en: "Tracking Shot", desc: "피사체를 옆에서 따라가며 촬영. 동행감과 속도감" },
    { id: "pan", cat: "camera", ko: "팬", en: "Pan", desc: "카메라가 제자리에서 좌우로 회전. 공간 탐색" },
    { id: "tilt", cat: "camera", ko: "틸트", en: "Tilt", desc: "카메라가 제자리에서 상하로 회전. 규모감 강조" },
    { id: "orbital", cat: "camera", ko: "오비탈", en: "Orbital", desc: "피사체 주위를 원형으로 도는 움직임. 제품 광고, 인물 연출에 주로 사용" },
    { id: "fpv-drone", cat: "camera", ko: "FPV 드론", en: "FPV Drone", desc: "1인칭 시점의 역동적 비행 촬영. 속도감과 몰입감 부여" },
    { id: "slow-motion", cat: "camera", ko: "슬로 모션", en: "Slow Motion", desc: "느린 재생으로 순간의 디테일을 포착. 액션, 감성 강조" },
    { id: "depth-of-field", cat: "camera", ko: "피사계 심도", en: "Depth of Field", desc: "배경 흐림(보케) 효과. 주인공에만 초점을 맞춰 집중" },
    // ── 카메라 구도 (추가 12개) ──
    { id: "eye-level", cat: "camera", ko: "아이 레벨 샷", en: "Eye Level Shot", desc: "눈높이에서 정면으로 보는 기본 구도. 자연스럽고 중립적인 인상" },
    { id: "birds-eye-view", cat: "camera", ko: "버즈아이 뷰", en: "Bird's Eye View", desc: "바로 위에서 수직으로 내려다보는 조감. 전체 배치·패턴 파악" },
    { id: "aerial-view", cat: "camera", ko: "에어리얼 뷰", en: "Aerial View", desc: "높은 하늘에서 내려다보는 공중 샷. 드론·풍경·도시 전경에" },
    { id: "dutch-angle", cat: "camera", ko: "더치 앵글", en: "Dutch Angle", desc: "카메라를 기울인 구도. 불안·긴장·혼란을 연출" },
    { id: "over-the-shoulder", cat: "camera", ko: "오버더숄더 샷", en: "Over-the-Shoulder Shot", desc: "어깨 너머로 상대·화면을 보는 구도. 대화·시점 공유" },
    { id: "pov-shot", cat: "camera", ko: "POV 샷", en: "POV Shot", desc: "1인칭 시점. 보는 사람이 주인공이 된 몰입감" },
    { id: "establishing-shot", cat: "camera", ko: "이스태블리싱 샷", en: "Establishing Shot", desc: "장소·시간을 처음 보여주는 전경. 장면 도입용" },
    { id: "extreme-close-up", cat: "camera", ko: "익스트림 클로즈업", en: "Extreme Close-up", desc: "눈·입술 등 극히 일부만 크게. 강렬한 감정·디테일" },
    { id: "rule-of-thirds", cat: "camera", ko: "삼분할 구도", en: "Rule of Thirds", desc: "화면을 3등분해 교차점에 피사체를 배치. 안정되고 자연스러운 구도" },
    { id: "85mm-portrait", cat: "camera", ko: "85mm 인물 렌즈", en: "85mm Portrait Lens", desc: "인물에 가장 자연스러운 압축감. 배경은 부드럽게 흐림" },
    { id: "macro-lens", cat: "camera", ko: "매크로 렌즈", en: "Macro Lens", desc: "극히 작은 피사체를 크게. 꽃·곤충·제품 디테일에" },
    { id: "fisheye-lens", cat: "camera", ko: "피쉬아이 렌즈", en: "Fisheye Lens", desc: "강한 왜곡의 초광각. 독특하고 역동적인 시야" },
    // ── 카메라 구도 (첨부 이미지에서 추가 1개) ──
    { id: "zoom-in", cat: "camera", ko: "줌 인", en: "Zoom In", desc: "위치 고정, 렌즈로 확대. 피사체에 서서히 다가가는 느낌" },

    // ── 조명 (책 6개) ──
    { id: "golden-hour", cat: "light", ko: "골든 아워", en: "Golden Hour", desc: "해 뜨고 질 무렵의 황금빛. 따뜻하고 감성적인 분위기" },
    { id: "blue-hour", cat: "light", ko: "블루 아워", en: "Blue Hour", desc: "일출 전·일몰 후의 푸른 빛. 고요하고 시네마틱한 무드" },
    { id: "backlight", cat: "light", ko: "백라이트(역광)", en: "Backlight", desc: "피사체 뒤에서 비추는 빛. 실루엣과 신비로운 윤곽 강조" },
    { id: "rim-light", cat: "light", ko: "림 라이트", en: "Rim Light", desc: "윤곽선을 빛으로 살림. 배경과 분리되는 입체감" },
    { id: "rembrandt", cat: "light", ko: "렘브란트 조명", en: "Rembrandt Lighting", desc: "뺨에 삼각형 빛. 고전적이고 깊이 있는 인물 표현" },
    { id: "neon-light", cat: "light", ko: "네온 라이트", en: "Neon Light", desc: "강렬한 네온 색감. 사이버펑크·도시 야경 무드" },
    // ── 조명 (추가 6개) ──
    { id: "soft-light", cat: "light", ko: "소프트 라이트", en: "Soft Light", desc: "부드럽고 그림자가 옅은 빛. 피부·제품 촬영에" },
    { id: "three-point-lighting", cat: "light", ko: "쓰리 포인트 조명", en: "Three-Point Lighting", desc: "키·필·림 3개 광원의 기본 스튜디오 조명. 정돈된 인물·제품 화보" },
    { id: "volumetric-light", cat: "light", ko: "볼류메트릭 라이트", en: "Volumetric Light", desc: "공기 중 빛줄기가 보이는 효과. 신성하고 몽환적인 분위기" },
    { id: "chiaroscuro", cat: "light", ko: "키아로스쿠로", en: "Chiaroscuro", desc: "강한 명암 대비. 고전 회화 같은 드라마틱한 깊이" },
    { id: "low-key-lighting", cat: "light", ko: "로우키 조명", en: "Low-Key Lighting", desc: "어둡고 대비 강한 조명. 무겁고 비밀스러운 무드" },
    { id: "natural-light", cat: "light", ko: "자연광", en: "Natural Light", desc: "인공광 없이 햇빛·창문빛만. 사실적이고 부드러운 인상" },

    // ── 색감 & 톤 (책 5개) ──
    { id: "cinematic-color", cat: "color", ko: "시네마틱 컬러", en: "Cinematic Color", desc: "영화 같은 색 보정. 깊고 무게감 있는 톤" },
    { id: "teal-orange", cat: "color", ko: "틸 앤 오렌지", en: "Teal and Orange", desc: "청록과 주황의 대비. 블록버스터 영화 느낌" },
    { id: "pastel-tone", cat: "color", ko: "파스텔 톤", en: "Pastel Tone", desc: "채도 낮은 부드러운 색. 동화적이고 몽환적인 분위기" },
    { id: "monochrome", cat: "color", ko: "모노크롬", en: "Monochrome", desc: "흑백 또는 단색조. 클래식하고 강렬한 인상" },
    { id: "vivid-color", cat: "color", ko: "비비드 컬러", en: "Vivid Color", desc: "높은 채도의 선명한 색. 생동감과 시선 집중에 용이" },
    // ── 색감 & 톤 (추가 3개) ──
    { id: "warm-tone", cat: "color", ko: "웜 톤", en: "Warm Tone", desc: "따뜻한 색 위주. 포근하고 아늑한 느낌" },
    { id: "cool-tone", cat: "color", ko: "쿨 톤", en: "Cool Tone", desc: "차가운 색 위주. 시원하고 도시적인 느낌" },
    { id: "desaturated", cat: "color", ko: "디새추레이티드", en: "Desaturated", desc: "채도를 낮춘 색. 차분하고 영화적인 톤" },

    // ── 분위기 (책 5개) ──
    { id: "cinematic", cat: "mood", ko: "시네마틱", en: "Cinematic", desc: "영화적 연출과 비율. 서사적이고 몰입감 있는 화면" },
    { id: "dreamy", cat: "mood", ko: "드리미", en: "Dreamy", desc: "부드럽고 몽환적인 분위기. 비현실적인 감성" },
    { id: "nostalgic", cat: "mood", ko: "노스탤직", en: "Nostalgic", desc: "향수를 자극하는 따뜻한 무드. 빈티지 감성" },
    { id: "minimal", cat: "mood", ko: "미니멀", en: "Minimal", desc: "여백과 절제. 깔끔하고 세련된 인상" },
    { id: "epic", cat: "mood", ko: "에픽", en: "Epic", desc: "웅장하고 장대한 스케일. 압도적인 규모감" },
    // ── 분위기 (추가 5개) ──
    { id: "mysterious", cat: "mood", ko: "미스터리어스", en: "Mysterious", desc: "신비롭고 알 수 없는 분위기. 호기심을 자극" },
    { id: "serene", cat: "mood", ko: "세린", en: "Serene", desc: "고요하고 평화로운 분위기. 잔잔한 풍경·명상에" },
    { id: "dramatic", cat: "mood", ko: "드라마틱", en: "Dramatic", desc: "극적이고 강렬한 감정. 대비와 긴장감이 큰 장면" },
    { id: "melancholic", cat: "mood", ko: "멜랑콜릭", en: "Melancholic", desc: "쓸쓸하고 우울한 감성. 비·황혼·이별 장면에" },
    { id: "cozy", cat: "mood", ko: "코지", en: "Cozy", desc: "아늑하고 포근한 분위기. 실내·겨울·일상에" },

    // ── 화풍 & 스타일 (책 5개) ──
    { id: "photorealistic", cat: "style", ko: "포토리얼리스틱", en: "Photorealistic", desc: "실사 사진처럼 사실적. 디테일과 현실감 극대화" },
    { id: "oil-painting", cat: "style", ko: "유화", en: "Oil Painting", desc: "붓 터치가 살아 있는 유화풍. 고전 회화의 질감" },
    { id: "watercolor", cat: "style", ko: "수채화", en: "Watercolor", desc: "번지는 물감의 투명함. 부드럽고 서정적인 표현" },
    { id: "3d-render", cat: "style", ko: "3D 렌더", en: "3D Render", desc: "입체 그래픽 렌더링. 매끈하고 정교한 CG 느낌" },
    { id: "anime-style", cat: "style", ko: "애니메이션풍", en: "Anime Style", desc: "일본 애니메이션 화풍. 선명한 선과 채색" },
    // ── 화풍 & 스타일 (추가 6개) ──
    { id: "cyberpunk", cat: "style", ko: "사이버펑크", en: "Cyberpunk", desc: "네온·미래 도시·하이테크와 로우라이프. 비 오는 밤거리" },
    { id: "vintage", cat: "style", ko: "빈티지", en: "Vintage", desc: "오래된 감성의 복고 스타일. 낡은 색감과 질감" },
    { id: "film-noir", cat: "style", ko: "필름 누아르", en: "Film Noir", desc: "흑백·강한 그림자의 범죄 영화 스타일. 탐정·밤거리" },
    { id: "pixel-art", cat: "style", ko: "픽셀 아트", en: "Pixel Art", desc: "도트 그래픽. 레트로 게임 감성" },
    { id: "double-exposure", cat: "style", ko: "이중 노출", en: "Double Exposure", desc: "두 장면을 겹친 초현실적 표현. 인물+풍경 겹치기" },
    { id: "isometric", cat: "style", ko: "아이소메트릭", en: "Isometric", desc: "등각 투영의 입체 도면식 시점. 게임·인포그래픽에" },

    // ── 재질 & 질감 (책 4개) ──
    { id: "metallic", cat: "material", ko: "메탈릭", en: "Metallic", desc: "금속 광택과 반사. 차갑고 고급스러운 표면" },
    { id: "glass", cat: "material", ko: "글래스(유리)", en: "Glass", desc: "투명하게 굴절되는 유리 질감. 맑고 영롱한 표현" },
    { id: "silk", cat: "material", ko: "실크", en: "Silk", desc: "부드럽게 흐르는 비단 광택. 우아하고 고급스러움" },
    { id: "holographic", cat: "material", ko: "홀로그래픽", en: "Holographic", desc: "각도에 따라 변하는 무지갯빛. 미래적인 감각" },
    // ── 재질 & 질감 (추가 3개) ──
    { id: "leather", cat: "material", ko: "레더", en: "Leather", desc: "가죽 질감. 묵직하고 고급스러운 표면" },
    { id: "marble", cat: "material", ko: "마블", en: "Marble", desc: "대리석 질감. 차갑고 고급스러운 무늬" },
    { id: "velvet", cat: "material", ko: "벨벳", en: "Velvet", desc: "벨벳 질감. 부드럽고 깊은 색감" },

    // ── 화질 & 디테일 (책 4개) ──
    { id: "ultra-detailed", cat: "quality", ko: "초고해상도", en: "Ultra Detailed", desc: "극도로 정교한 디테일. 선명하고 풍부한 묘사" },
    { id: "8k-resolution", cat: "quality", ko: "8K 해상도", en: "8K Resolution", desc: "최고 수준의 해상도. 미세한 부분까지 표현" },
    { id: "hyper-realistic", cat: "quality", ko: "하이퍼리얼리스틱", en: "Hyper-realistic", desc: "현실보다 더 사실적인 묘사. 압도적인 정밀함" },
    { id: "film-grain", cat: "quality", ko: "필름 그레인", en: "Film Grain", desc: "아날로그 필름 입자감. 따뜻하고 빈티지한 질감" },
    // ── 화질 & 디테일 (추가 1개) ──
    { id: "sharp-focus", cat: "quality", ko: "샤프 포커스", en: "Sharp Focus", desc: "피사체가 또렷하게 선명. 흐림 없이 또렷한 결과" },

    // ── 영상 움직임 (신규 카테고리, 추가 6개 — 영상 전용) ──
    { id: "timelapse", cat: "motion", ko: "타임랩스", en: "Time-lapse", desc: "긴 시간을 압축. 해 질 녘·구름·도시 변화에" },
    { id: "hyperlapse", cat: "motion", ko: "하이퍼랩스", en: "Hyperlapse", desc: "카메라 이동하며 찍는 타임랩스. 역동적인 시간 압축" },
    { id: "dolly-zoom", cat: "motion", ko: "돌리 줌", en: "Dolly Zoom", desc: "다가가며 줌아웃하는 히치콕 효과. 불안·현실 왜곡" },
    { id: "crane-shot", cat: "motion", ko: "크레인 샷", en: "Crane Shot", desc: "위아래로 크게 움직이는 샷. 웅장한 스케일" },
    { id: "handheld", cat: "motion", ko: "핸드헬드", en: "Handheld", desc: "손으로 들어 흔들리는 촬영. 다큐·현장감" },
    { id: "steadicam", cat: "motion", ko: "스테디캠", en: "Steadicam", desc: "안정장치로 부드럽게 따라가는 촬영. 매끄러운 이동" },
    // ── 영상 움직임 (첨부 이미지에서 추가 3개) ──
    { id: "rack-focus", cat: "motion", ko: "랙 포커스", en: "Rack Focus", desc: "초점을 앞쪽에서 뒤쪽으로 이동. 시선을 유도하는 초점 전환" },
    { id: "speed-ramp", cat: "motion", ko: "스피드 램프", en: "Speed Ramp", desc: "재생 속도를 빠르게·느리게 변경. 액션의 완급 조절" },
    { id: "freeze-frame", cat: "motion", ko: "프리즈 프레임", en: "Freeze Frame", desc: "한순간 움직임을 정지. 결정적 장면을 멈춰 보여줌" },

    // ── 장면 전환 (신규 카테고리, 첨부 이미지 17~24번 8개 — 편집·전환 효과) ──
    { id: "jump-cut", cat: "transition", ko: "점프 컷", en: "Jump Cut", desc: "같은 구도에서 시간을 건너뜀. 빠른 전개·시간 경과" },
    { id: "match-cut", cat: "transition", ko: "매치 컷", en: "Match Cut", desc: "형태·동작을 맞춰 장면 전환. 매끄럽고 재치 있는 연결" },
    { id: "whip-pan", cat: "transition", ko: "휩 팬", en: "Whip Pan", desc: "빠르게 움직여 흐림과 함께 전환. 속도감·긴박한 장면 전환" },
    { id: "cross-dissolve", cat: "transition", ko: "크로스 디졸브", en: "Cross Dissolve", desc: "두 장면을 겹쳐 서서히 전환. 시간 흐름·회상에" },
    { id: "wipe", cat: "transition", ko: "와이프", en: "Wipe", desc: "경계가 이동하며 화면 전환. 고전적·장난스러운 전환" },
    { id: "smash-cut", cat: "transition", ko: "스매시 컷", en: "Smash Cut", desc: "고요한 장면에서 갑자기 전환. 충격·반전 효과" },
    { id: "j-cut", cat: "transition", ko: "J컷", en: "J-cut", desc: "다음 장면의 소리가 먼저 들림. 장면 전환을 소리로 예고" },
    { id: "l-cut", cat: "transition", ko: "L컷", en: "L-cut", desc: "이전 장면의 소리가 계속 이어짐. 대화·여운을 잇는 전환" }
  ];

  const CATEGORIES = [
    { id: "all", label: "전체" },
    { id: "camera", label: "🎥 카메라 구도" },
    { id: "light", label: "💡 조명" },
    { id: "color", label: "🎨 색감 & 톤" },
    { id: "mood", label: "🌙 분위기" },
    { id: "style", label: "🖼️ 화풍 & 스타일" },
    { id: "material", label: "✨ 재질 & 질감" },
    { id: "quality", label: "🔍 화질 & 디테일" },
    { id: "motion", label: "🎬 영상 움직임" },
    { id: "transition", label: "🔀 장면 전환" },
    { id: "fav", label: "⭐ 즐겨찾기" },
    { id: "custom", label: "➕ 내 키워드" }
  ];

  // 삽입용 텍스트 만들기: 기본은 영문만 (AI 이미지·영상 프롬프트에 가장 잘 먹힘)
  function formatKeyword(kw, mode) {
    if (mode === "ko-en") return kw.ko + " (" + kw.en + ")";
    if (mode === "ko") return kw.ko;
    return kw.en; // "en" 기본
  }

  window.PROMPT_KEYWORDS = KEYWORDS;
  window.PROMPT_CATEGORIES = CATEGORIES;
  window.formatKeyword = formatKeyword;
})();
