# 🖥️ Teacher's Desktop Hub (Ethereal Desktop)

교사용 데스크톱 허브 — 수업 관리에 필요한 시간표, 할 일, 파일 바로가기, 즐겨찾기 링크를 하나의 Electron 데스크톱 오버레이에서 관리하는 애플리케이션.

## 🎯 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프레임워크** | Electron 33 + React 19 + Vite 6 |
| **스타일링** | Tailwind CSS 4 (Glassmorphism 테마) |
| **애니메이션** | Motion (Framer Motion) |
| **아이콘** | Lucide React |
| **데이터 저장** | 로컬 JSON 파일 (`hub-data.json` in userData) |
| **플랫폼** | Windows (fullscreen, frameless overlay) |

---

## 📂 프로젝트 구조

```
mgjang_screenapp_0322/
├── electron/                    # Electron 메인/프리로드 프로세스
│   ├── main.cjs                 # 메인 프로세스 (CJS)
│   └── preload.cjs              # 프리로드 스크립트 (CJS)
├── electron-launcher.cjs        # ELECTRON_RUN_AS_NODE 우회 런처
├── src/
│   ├── main.tsx                 # React 엔트리포인트
│   ├── App.tsx                  # 루트 레이아웃 (TopNav + 위젯 + 독)
│   ├── index.css                # TailwindCSS 임포트 + 기본 리셋
│   ├── components/
│   │   ├── Schedule.jsx         # 시간표 위젯
│   │   ├── ToDo.jsx             # 할 일 목록 위젯
│   │   ├── DesktopSurface.jsx   # 데스크톱 폴더/파일 아이콘 영역
│   │   ├── BottomDock.jsx       # 하단 독 (퀵 링크 바)
│   │   ├── Sidebar.jsx          # 우측 사이드바 (프로필/클립보드/메모장)
│   │   └── SettingsModal.jsx    # 설정 모달 (폴더/퀵링크/시간표 관리)
│   └── context/
│       └── DesktopContext.jsx   # 전역 상태 관리 (React Context)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

---

## 🏗️ 아키텍처

### Electron 프로세스 구성

```
┌─────────────────────────────────────────────────┐
│  electron-launcher.cjs                          │
│  (ELECTRON_RUN_AS_NODE 제거 후 electron.exe 실행)│
└──────────────┬──────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────┐
│  electron/main.cjs  (메인 프로세스)               │
│  ├── BrowserWindow 생성 (fullscreen, frameless)  │
│  ├── IPC Handlers:                               │
│  │   ├── load-data    → JSON 파일 읽기            │
│  │   ├── save-data    → 원자적 JSON 파일 쓰기      │
│  │   ├── open-item    → 네이티브 파일/URL 열기      │
│  │   └── show-open-dialog → 네이티브 파일 탐색기    │
│  └── dialog, shell 모듈 활용                      │
└──────────────┬──────────────────────────────────┘
               ▼ (contextBridge)
┌─────────────────────────────────────────────────┐
│  electron/preload.cjs  (프리로드)                 │
│  window.api = {                                  │
│    loadData, saveData, openItem, showOpenDialog   │
│  }                                               │
└──────────────┬──────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────┐
│  React App (렌더러 프로세스)                       │
│  ├── DesktopContext → 전역 상태 + 자동 저장        │
│  └── 컴포넌트들 → UI 렌더링 + IPC 호출            │
└─────────────────────────────────────────────────┘
```

### 데이터 흐름

```
사용자 액션 → 컴포넌트 → DesktopContext (setState)
                              ▼
                     useEffect (debounce 1초)
                              ▼
                     window.api.saveData()
                              ▼
                     IPC → main.cjs → hub-data.json (원자적 쓰기)
```

---

## 🧩 컴포넌트 상세

### `App.tsx` — 루트 레이아웃
- **TopNav**: 상단 네비게이션 바 (Settings 아이콘 → 설정 모달 토글)
- **3단 레이아웃**: 좌측(Schedule + ToDo) | 중앙(DesktopSurface) | 우측(Sidebar)
- **BottomDock**: 하단 고정 독 바
- **SettingsModal**: 오버레이 설정 모달

### `DesktopContext.jsx` — 전역 상태 관리
| 상태 | 설명 |
|------|------|
| `todos` | 할 일 목록 (`{id, text, completed}`) |
| `folders` | 폴더 목록 (`{id, name, files: [{id, name, path, type}]}`) |
| `quickLinks` | 퀵 링크 (`{id, name, url, icon}`) |
| `schedule` | 시간표 (`{id, period, time, subject, room}`) |
| `isSettingsOpen` | 설정 모달 열림 여부 |
| `activeFolder` | 현재 열려있는 폴더 ID |

- **자동 저장**: `todos`, `folders`, `quickLinks`, `schedule` 변경 시 1초 디바운스 후 `window.api.saveData()` 호출
- **초기 로드**: 앱 마운트 시 `window.api.loadData()`로 JSON 파일에서 데이터 복원

### `DesktopSurface.jsx` — 데스크톱 아이콘 영역
- 폴더를 클릭하면 내부 파일들이 glassmorphic 패널로 펼쳐짐
- 파일 더블클릭 → `window.api.openItem()` → 네이티브 앱으로 열기
- 파일 타입별 아이콘 (PDF=빨강, Word=파랑, Excel=초록)

### `BottomDock.jsx` — 하단 독 바
- `quickLinks`가 1개 이상이면 유저 커스텀 링크 표시
- 0개이면 기본 아이콘(NEIS, Edufine 등) fallback
- 클릭 → `window.api.openItem(url, true)` → 외부 URL 열기
- 에러 시 빨간 툴팁 1.5초 표시

### `SettingsModal.jsx` — 설정 모달
3개 탭 구성:
1. **Folders & Files**: 폴더 생성/삭제, 파일 추가/삭제, **[Browse...] 네이티브 파일 탐색기**
2. **Quick Links**: 사이트 이름/URL/아이콘 추가/삭제
3. **Schedule**: 교시/시간/과목/교실 추가/삭제

### `Schedule.jsx` — 시간표 위젯
- `schedule` 배열을 세로 타임라인 형태로 렌더링

### `ToDo.jsx` — 할 일 위젯
- 체크박스 토글 (완료 시 취소선 + 투명도)

### `Sidebar.jsx` — 우측 사이드바
- 사용자 프로필, 워크스페이스 네비게이션
- 클립보드 (클릭 → 복사, 성공 시 초록 애니메이션)
- 스크래치패드 (간단 메모장)

---

## ⚡ Electron IPC API

| 채널 | 방향 | 설명 |
|------|------|------|
| `load-data` | Renderer → Main | JSON 데이터 파일 로드 |
| `save-data` | Renderer → Main | 원자적 쓰기 (tmp → rename) |
| `open-item` | Renderer → Main | `shell.openPath` / `shell.openExternal` |
| `show-open-dialog` | Renderer → Main | `dialog.showOpenDialog` (네이티브 파일 탐색기) |

---

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 모드 실행 (Vite + Electron 동시)
npm run dev:electron

# Vite만 실행 (브라우저 확인용)
npm run dev

# 프로덕션 빌드
npm run build
```

### ⚠️ 알려진 이슈 & 해결책

#### `ELECTRON_RUN_AS_NODE` 환경변수 문제
npm이 `electron` CLI를 호출할 때 `ELECTRON_RUN_AS_NODE=1`을 자동 설정하여 Electron이 Node.js 모드로 실행되는 문제가 있었습니다.

**해결**: `electron-launcher.cjs`에서 환경변수를 제거한 후 `electron.exe`를 직접 spawn 합니다.

#### ESM / CJS 충돌
`package.json`에 `"type": "module"`이 있어 `.js` 파일이 ESM으로 처리되지만, Electron npm 패키지는 ESM named exports를 지원하지 않습니다.

**해결**: Electron 파일들을 `.cjs` 확장자(CommonJS)로 전환했습니다.

---

## 📋 변경 이력

| 날짜 | 커밋 | 내용 |
|------|------|------|
| 2026-03-22 | `a3441ae` | 프로젝트 초기화 (Ethereal Desktop) |
| 2026-03-22 | `efdd178` | UI 컴포넌트 구현 (Schedule, ToDo, DesktopSurface, Sidebar, BottomDock) |
| 2026-03-22 | `7973ac2` | 로컬 데이터 영속성 (debounced atomic JSON write) |
| 2026-03-22 | (현재) | Phase 6: 네이티브 파일 탐색기, 퀵링크 독 버그 수정, ESM/CJS 전환, ELECTRON_RUN_AS_NODE 해결 |
