/**
 * 애플리케이션 전역 상수
 * API URL, 게시글 설정, 차트 설정, 스토리지 키 등 프로젝트 전반에서 사용되는 상수를 정의합니다.
 */

/** API 서버 기본 URL */
export const API_BASE_URL = "https://fe-hiring-rest-api.vercel.app";

/** 금지어 목록 - 게시글 제목, 본문, 태그에서 필터링됨 */
export const PROFANITY_WORDS = ["캄보디아", "프놈펜", "불법체류", "텔레그램"] as const;

/** 게시글 카테고리 목록 */
export const POST_CATEGORIES = ["NOTICE", "QNA", "FREE"] as const;

/** 정렬 가능한 필드 목록 */
export const SORT_FIELDS = ["createdAt", "title"] as const;

/** 정렬 방향 목록 */
export const SORT_ORDERS = ["asc", "desc"] as const;

/** 게시글 제목 최대 길이 */
export const MAX_TITLE_LENGTH = 80;

/** 게시글 본문 최대 길이 */
export const MAX_BODY_LENGTH = 2000;

/** 태그 최대 개수 */
export const MAX_TAGS = 5;

/** 태그 최대 길이 */
export const MAX_TAG_LENGTH = 24;

/** 차트 색상 팔레트 */
export const CHART_COLORS = [
  "#FF6B9D", // 핑크
  "#C44569", // 라즈베리
  "#FFA07A", // 연어
  "#FFD93D", // 밝은 노랑
  "#6BCB77", // 민트 그린
  "#4D96FF", // 밝은 파랑
  "#9D84B7", // 라벤더
  "#FDA085", // 복숭아
] as const;

/** 차트 애니메이션 지속 시간 (ms) */
export const CHART_ANIMATION_DURATION = 800;
/** 차트 애니메이션 시작 지연 시간 (ms) */
export const CHART_ANIMATION_BEGIN = 0;

/** 차트 높이 - 모바일 (px) */
export const CHART_HEIGHT_MOBILE = 300;

/** 차트 높이 - 데스크톱 (px) */
export const CHART_HEIGHT_DESKTOP = 400;

/** 라인 차트 높이 - 모바일 (px) */
export const LINE_CHART_HEIGHT_MOBILE = 450;

/** 라인 차트 높이 - 데스크톱 (px) */
export const LINE_CHART_HEIGHT_DESKTOP = 600;

/** 검색 디바운스 시간 (ms) */
export const SEARCH_DEBOUNCE_MS = 500;

/** 페이지당 게시글 수 */
export const POSTS_PER_PAGE = 20;

/** 게시글 테이블 컬럼 설정 localStorage 키 */
export const STORAGE_KEY_COLUMNS = "post_table_columns_v2";

/** 게시글 테이블 컬럼 너비 localStorage 키 */
export const STORAGE_KEY_WIDTHS = "post_table_widths_v2";

