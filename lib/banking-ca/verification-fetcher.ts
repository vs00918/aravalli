import https from 'https';
import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

export interface FetchResult {
  url: string;
  statusCode: number;
  retrievalTimestamp: string;
  documentHash: string;
  byteLength: number;
  artifactPath: string;
  rawContent: string;
  contentType: string;
}

export async function fetchOfficialDocument(
  targetUrl: string,
  saveArtifact: boolean = true
): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(targetUrl);
      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;

      const req = client.get(
        targetUrl,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.8',
          },
          timeout: 15000,
          rejectUnauthorized: false,
        },
        (res) => {
          if (
            (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) &&
            res.headers.location
          ) {
            const redirectUrl = new URL(res.headers.location, targetUrl).href;
            fetchOfficialDocument(redirectUrl, saveArtifact)
              .then(resolve)
              .catch(reject);
            return;
          }

          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const content = buffer.toString('utf8');
            const hash = crypto.createHash('sha256').update(buffer).digest('hex');
            const timestamp = new Date().toISOString();
            const contentType = (res.headers['content-type'] as string) || 'text/html';

            let artifactPath = '';
            if (saveArtifact) {
              const artifactDir = path.join(process.cwd(), 'data/verification-artifacts');
              if (!fs.existsSync(artifactDir)) {
                fs.mkdirSync(artifactDir, { recursive: true });
              }
              const ext = contentType.includes('json')
                ? 'json'
                : contentType.includes('pdf')
                ? 'pdf'
                : 'html';
              artifactPath = path.join(artifactDir, `${hash}.${ext}`);
              fs.writeFileSync(artifactPath, buffer);
            }

            resolve({
              url: targetUrl,
              statusCode: res.statusCode || 200,
              retrievalTimestamp: timestamp,
              documentHash: hash,
              byteLength: buffer.length,
              artifactPath,
              rawContent: content,
              contentType,
            });
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Network timeout (15s) fetching ${targetUrl}`));
      });

      req.on('error', (err) => {
        reject(new Error(`Network error fetching ${targetUrl}: ${err.message}`));
      });
    } catch (e: any) {
      reject(new Error(`URL parse error for ${targetUrl}: ${e.message}`));
    }
  });
}
