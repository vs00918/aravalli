import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { VerificationRegistryRecord } from './types';

const REGISTRY_FILE_PATH = path.join(process.cwd(), 'data/verification-registry.json');

export class VerificationRegistry {
  private records: Map<string, VerificationRegistryRecord>;

  constructor(initialData?: VerificationRegistryRecord[]) {
    this.records = new Map();
    if (initialData) {
      for (const rec of initialData) {
        this.records.set(this.makeKey(rec.entitySlug, rec.claimId), rec);
      }
    } else {
      this.load();
    }
  }

  private makeKey(entitySlug: string, claimId: string): string {
    return `${entitySlug.trim().toLowerCase()}::${claimId.trim().toLowerCase()}`;
  }

  public load(): void {
    if (fs.existsSync(REGISTRY_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(REGISTRY_FILE_PATH, 'utf8');
        const data = JSON.parse(raw);
        const list: VerificationRegistryRecord[] = Array.isArray(data) ? data : data.records || [];
        this.records.clear();
        for (const rec of list) {
          this.records.set(this.makeKey(rec.entitySlug, rec.claimId), rec);
        }
      } catch (err) {
        console.warn('Could not parse verification-registry.json, starting with empty registry.');
      }
    }
  }

  public save(): void {
    const list = Array.from(this.records.values());
    const data = {
      updatedAt: new Date().toISOString(),
      totalRecords: list.length,
      officiallyVerifiedCount: list.filter(r => r.verificationStatus === 'OFFICIALLY_VERIFIED').length,
      records: list
    };
    fs.writeFileSync(REGISTRY_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  }

  public getRecord(entitySlug: string, claimId: string = 'primary'): VerificationRegistryRecord | undefined {
    return this.records.get(this.makeKey(entitySlug, claimId));
  }

  public getRecordsForEntity(entitySlug: string): VerificationRegistryRecord[] {
    const prefix = `${entitySlug.trim().toLowerCase()}::`;
    const results: VerificationRegistryRecord[] = [];
    const entries = Array.from(this.records.entries());
    for (const [key, val] of entries) {
      if (key.startsWith(prefix) || val.entitySlug.toLowerCase() === entitySlug.toLowerCase()) {
        results.push(val);
      }
    }
    return results;
  }

  public hasValidVerification(entitySlug: string, claimId: string = 'primary'): boolean {
    const rec = this.getRecord(entitySlug, claimId);
    if (!rec) return false;
    if (rec.verificationStatus !== 'OFFICIALLY_VERIFIED') return false;
    if (!rec.artifactHash || rec.artifactHash.length < 32) return false;
    
    // Check if artifact physically exists and matches hash
    const fullPath = path.join(process.cwd(), rec.artifactPath);
    if (!fs.existsSync(fullPath)) return false;
    const fileBytes = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha256').update(fileBytes).digest('hex');
    return hash === rec.artifactHash;
  }

  public register(record: VerificationRegistryRecord): void {
    this.records.set(this.makeKey(record.entitySlug, record.claimId), record);
    this.save();
  }

  public getAll(): VerificationRegistryRecord[] {
    return Array.from(this.records.values());
  }
}
