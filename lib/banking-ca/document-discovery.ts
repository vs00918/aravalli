import https from 'https';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

export interface DiscoveredDocument {
  discoveryQuery: string;
  targetAuthority: string;
  discoveredUrl: string | null;
  finalUrl: string | null;
  httpStatus: number | null;
  byteLength: number;
  documentHash: string | null;
  extractedTitle: string;
  extractedDate: string | null;
  identityConfirmed: boolean;
  identityFailureReason: string | null;
  rawPayload: string;
}

export interface VerificationChainResult {
  topicSlug: string;
  discoveryQuery: string;
  discoveredDocument: {
    url: string | null;
    status: number | null;
    byteLength: number;
    hash: string | null;
    title: string;
    identityStatus: 'DOCUMENT_IDENTITY_CONFIRMED' | 'DOCUMENT_IDENTITY_FAILED' | 'EXTERNAL_SOURCE_UNAVAILABLE' | 'DOCUMENT_NOT_FOUND';
    failureReason: string | null;
  };
  claimVerification: {
    claim: string;
    canonicalValue: string;
    observedValue: string | null;
    locator: string | null;
    comparisonResult: 'MATCH' | 'MISMATCH' | 'NOT_EXTERNALLY_VERIFIABLE' | 'UNVERIFIABLE';
  }[];
  finalTopicStatus: 'FULLY_VERIFIED' | 'EXTERNAL_SOURCE_UNAVAILABLE' | 'NOT_EXTERNALLY_VERIFIABLE' | 'MISMATCH';
}

/**
 * Stage 1 & 2: Fetch and verify document identity against raw payload
 */
export async function retrieveAndVerifyDocumentIdentity(
  targetUrl: string,
  expectedCriteria: {
    authority: string;
    topicKeywords: string[];
    requiredIdentifiers: string[];
    prohibitedPatterns?: string[];
  }
): Promise<DiscoveredDocument> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const req = https.get(
        targetUrl,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.8'
          },
          timeout: 10000,
          rejectUnauthorized: false
        },
        (res) => {
          if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) && res.headers.location) {
            const redirectUrl = new URL(res.headers.location, targetUrl).href;
            retrieveAndVerifyDocumentIdentity(redirectUrl, expectedCriteria)
              .then(resolve)
              .catch(() => resolve(buildFailedDoc(targetUrl, 500, 'Redirect failed')));
            return;
          }

          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 400)) {
            resolve(buildFailedDoc(targetUrl, res.statusCode, `HTTP ${res.statusCode} Error`));
            return;
          }

          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const rawPayload = buffer.toString('utf8');
            const hash = crypto.createHash('sha256').update(buffer).digest('hex');

            // Extract title
            const titleMatch = rawPayload.match(/<title[^>]*>([^<]+)<\/title>/i);
            const extractedTitle = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : 'NO_TITLE_FOUND';

            // Check for prohibited landing page patterns
            const isGenericLanding =
              extractedTitle.toLowerCase().includes('press releases | official website') ||
              extractedTitle.toLowerCase().includes('error 404') ||
              extractedTitle.toLowerCase().includes('home -') ||
              buffer.length < 500;

            if (isGenericLanding) {
              resolve({
                discoveryQuery: targetUrl,
                targetAuthority: expectedCriteria.authority,
                discoveredUrl: targetUrl,
                finalUrl: targetUrl,
                httpStatus: res.statusCode || 200,
                byteLength: buffer.length,
                documentHash: hash,
                extractedTitle,
                extractedDate: null,
                identityConfirmed: false,
                identityFailureReason: 'Payload is a generic authority portal landing page or search listing, not the specific topic document',
                rawPayload
              });
              return;
            }

            // Check for required topic identifiers in raw payload
            const missing = expectedCriteria.requiredIdentifiers.filter((id) => !rawPayload.includes(id));
            if (missing.length > 0) {
              resolve({
                discoveryQuery: targetUrl,
                targetAuthority: expectedCriteria.authority,
                discoveredUrl: targetUrl,
                finalUrl: targetUrl,
                httpStatus: res.statusCode || 200,
                byteLength: buffer.length,
                documentHash: hash,
                extractedTitle,
                extractedDate: null,
                identityConfirmed: false,
                identityFailureReason: `Missing required topic identifiers in payload: ${missing.join(', ')}`,
                rawPayload
              });
              return;
            }

            // Document identity confirmed
            resolve({
              discoveryQuery: targetUrl,
              targetAuthority: expectedCriteria.authority,
              discoveredUrl: targetUrl,
              finalUrl: targetUrl,
              httpStatus: res.statusCode || 200,
              byteLength: buffer.length,
              documentHash: hash,
              extractedTitle,
              extractedDate: null,
              identityConfirmed: true,
              identityFailureReason: null,
              rawPayload
            });
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        resolve(buildFailedDoc(targetUrl, 408, 'Network timeout (10s)'));
      });

      req.on('error', (err) => {
        resolve(buildFailedDoc(targetUrl, null, err.message));
      });
    } catch (e: any) {
      resolve(buildFailedDoc(targetUrl, null, e.message));
    }
  });
}

function buildFailedDoc(url: string, status: number | null, reason: string): DiscoveredDocument {
  return {
    discoveryQuery: url,
    targetAuthority: 'UNKNOWN',
    discoveredUrl: url,
    finalUrl: url,
    httpStatus: status,
    byteLength: 0,
    documentHash: null,
    extractedTitle: 'NONE',
    extractedDate: null,
    identityConfirmed: false,
    identityFailureReason: reason,
    rawPayload: ''
  };
}
