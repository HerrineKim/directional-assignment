# Directional

Next.js 기반의 대시보드 애플리케이션입니다. 게시판 CRUD와 다양한 데이터 시각화 차트를 제공합니다.

## 프로젝트 실행 방법

```bash
npm install
npm run dev
```

## 🔗 배포 링크

https://directional-assignment-nine.vercel.app/

## 🛠 기술 스택

### Core

- **Next.js 16** - React 기반 풀스택 프레임워크
- **TypeScript** - 정적 타입 지원

### Styling

- **Tailwind CSS 4** - 유틸리티 기반 CSS 프레임워크
- **Shadcn UI** - UI 컴포넌트

### State & Form Management

- **Zustand** - 경량 상태 관리 라이브러리
- **React Hook Form + Zod** - 폼 관리 및 유효성 검사

### Visualization

- **Recharts** - React 차트 라이브러리

### Others

- **react-intersection-observer** - 무한 스크롤 구현
- **Lucide** - 아이콘 라이브러리

## ✨ 주요 구현 기능

### 인증

- 이메일/비밀번호 로그인
- JWT 토큰 기반 인증
- localStorage와 Zustand 스토어를 사용하여 새로고침 시 로그인 유지

### 게시판

- 게시글 CRUD (생성, 조회, 수정, 삭제)
- 커서 기반 무한 스크롤 페이지네이션
- 카테고리 필터링 (공지, 질문, 자유)
- 제목/본문 검색 (디바운스 적용)
- 정렬 기능 (생성일, 제목 / 오름차순, 내림차순)
- 금지어 필터링
- 테이블 컬럼 가시성 및 너비 조절 (localStorage 저장)

### 데이터 시각화

- **막대 차트** - 인기 커피/간식 브랜드
- **도넛 차트** - 비율 데이터 표시
- **누적 막대/영역 차트** - 주간 무드/운동 트렌드
- **멀티 라인 차트** - 팀별 커피 소비 영향, 부서별 간식 영향
- **모든 차트에서:**
  - 항목별 색상 변경 (컬러 피커)
  - 항목 표시/숨김 토글
  - 반응형 디자인

### 보안 & 성능

- 서버 측 Rate Limiting (미들웨어)
- 클라이언트 측 Rate Limiting (요청 큐)
- API 요청 디바운싱