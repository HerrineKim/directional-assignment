export const API_BASE_URL = "https://fe-hiring-rest-api.vercel.app";

export const PROFANITY_WORDS = ["캄보디아", "프놈펜", "불법체류", "텔레그램"] as const;

export const POST_CATEGORIES = ["NOTICE", "QNA", "FREE"] as const;

export const SORT_FIELDS = ["createdAt", "title"] as const;
export const SORT_ORDERS = ["asc", "desc"] as const;

export const MAX_TITLE_LENGTH = 80;
export const MAX_BODY_LENGTH = 2000;
export const MAX_TAGS = 5;
export const MAX_TAG_LENGTH = 24;

// 차트 색상
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

// 차트 설정
export const CHART_ANIMATION_DURATION = 800;
export const CHART_ANIMATION_BEGIN = 0;
export const CHART_HEIGHT_MOBILE = 300;
export const CHART_HEIGHT_DESKTOP = 400;
export const LINE_CHART_HEIGHT_MOBILE = 450;
export const LINE_CHART_HEIGHT_DESKTOP = 600;

// 검색 및 페이지네이션
export const SEARCH_DEBOUNCE_MS = 500;
export const POSTS_PER_PAGE = 20;

// 게시글 테이블 저장 키
export const STORAGE_KEY_COLUMNS = "post_table_columns_v2";
export const STORAGE_KEY_WIDTHS = "post_table_widths_v2";

