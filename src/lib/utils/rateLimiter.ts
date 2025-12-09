/**
 * Client-side rate limiter to prevent excessive API calls
 * This works in conjunction with server-side middleware
 */

interface RequestQueueItem<T = unknown> {
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
  execute: () => Promise<T>;
}

class RateLimiter {
  private queue: RequestQueueItem<unknown>[] = [];
  private processing = false;
  private lastRequestTime = 0;
  private minInterval: number;
  private maxConcurrent: number;
  private currentConcurrent = 0;

  constructor(options: { minInterval?: number; maxConcurrent?: number } = {}) {
    // Minimum interval between requests (ms)
    this.minInterval = options.minInterval || 100; // 100ms between requests
    // Maximum concurrent requests
    this.maxConcurrent = options.maxConcurrent || 5;
  }

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

      // Ensure minimum interval between requests
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

  clear() {
    this.queue.forEach((item) => {
      item.reject(new Error("Rate limiter cleared"));
    });
    this.queue = [];
    this.currentConcurrent = 0;
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter({
  minInterval: 100, // 100ms between requests
  maxConcurrent: 5, // Max 5 concurrent requests
});

