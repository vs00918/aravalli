import fs from 'fs';
import path from 'path';
import { ReviewQueueItem } from './types';

const REVIEW_QUEUE_FILE_PATH = path.join(process.cwd(), 'data/review-queue.json');

export class ReviewQueue {
  private items: Map<string, ReviewQueueItem>;

  constructor(initialData?: ReviewQueueItem[]) {
    this.items = new Map();
    if (initialData) {
      for (const it of initialData) {
        this.items.set(it.queueId, it);
      }
    } else {
      this.load();
    }
  }

  public load(): void {
    if (fs.existsSync(REVIEW_QUEUE_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(REVIEW_QUEUE_FILE_PATH, 'utf8');
        const data = JSON.parse(raw);
        const list: ReviewQueueItem[] = Array.isArray(data) ? data : data.items || [];
        this.items.clear();
        for (const it of list) {
          this.items.set(it.queueId, it);
        }
      } catch (err) {
        console.warn('Could not parse review-queue.json, starting with empty queue.');
      }
    }
  }

  public save(): void {
    const list = Array.from(this.items.values());
    const data = {
      updatedAt: new Date().toISOString(),
      totalUnresolved: list.filter(i => !i.resolved).length,
      totalItems: list.length,
      items: list
    };
    fs.writeFileSync(REVIEW_QUEUE_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  }

  public enqueue(item: ReviewQueueItem): void {
    this.items.set(item.queueId, item);
    this.save();
  }

  public getUnresolved(): ReviewQueueItem[] {
    return Array.from(this.items.values()).filter(i => !i.resolved);
  }

  public getAll(): ReviewQueueItem[] {
    return Array.from(this.items.values());
  }

  public resolve(queueId: string): void {
    const item = this.items.get(queueId);
    if (item) {
      item.resolved = true;
      this.save();
    }
  }
}
