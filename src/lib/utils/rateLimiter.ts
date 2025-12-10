/**
 * 클라이언트 측 Rate Limiter
 * 과도한 API 호출을 방지하기 위한 요청 큐 기반 속도 제한기입니다.
 * 서버 측 미들웨어(middleware.ts)와 함께 이중 보호를 제공합니다.
 *
 * 주요 기능:
 * - 요청 간 최소 간격 유지 (기본 100ms)
 * - 동시 요청 수 제한 (기본 5개)
 * - 큐 기반 순차 처리
 */

interface RequestQueueItem<T = unknown> {
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
  execute: () => Promise<T>;
}

/**
 * Rate Limiter 클래스
 * 요청을 큐에 저장하고 설정된 제한에 따라 순차적으로 처리합니다.
 */
class RateLimiter {
  private queue: RequestQueueItem<unknown>[] = [];
  private processing = false;
  private lastRequestTime = 0;
  private minInterval: number;
  private maxConcurrent: number;
  private currentConcurrent = 0;

  constructor(options: { minInterval?: number; maxConcurrent?: number } = {}) {
    this.minInterval = options.minInterval || 100;
    this.maxConcurrent = options.maxConcurrent || 5;
  }

  /**
   * 함수를 Rate Limit 큐에 추가하고 실행합니다.
   * @param fn - 실행할 비동기 함수
   * @returns 함수 실행 결과를 담은 Promise
   * @example
   * const data = await rateLimiter.execute(() => fetch('/api/posts'));
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const item: RequestQueueItem<T> = {
        resolve,
        reject,
        execute: fn,
      };
      
      this.queue.push(item as RequestQueueItem<unknown>);
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && this.currentConcurrent < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) break;

      this.currentConcurrent++;

      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      if (timeSinceLastRequest < this.minInterval) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.minInterval - timeSinceLastRequest)
        );
      }

      this.lastRequestTime = Date.now();

      item
        .execute()
        .then((result) => {
          this.currentConcurrent--;
          item.resolve(result);
          this.processQueue();
        })
        .catch((error) => {
          this.currentConcurrent--;
          item.reject(error);
          this.processQueue();
        });
    }

    this.processing = false;
  }

  /**
   * 대기 중인 모든 요청을 취소하고 큐를 초기화합니다.
   * 컴포넌트 언마운트 시 또는 페이지 이동 시 호출할 수 있습니다.
   */
  clear() {
    this.queue.forEach((item) => {
      item.reject(new Error("Rate limiter cleared"));
    });
    this.queue = [];
    this.currentConcurrent = 0;
  }
}

export const rateLimiter = new RateLimiter({
  minInterval: 100,
  maxConcurrent: 5,
});

