import { describe, expect, it } from 'vitest';
import { clientIp, isTrustedProxy } from '../src/lib/client-ip.js';

describe('client-ip', () => {
  it('trusts private hops and Cloudflare, nothing else', () => {
    expect(isTrustedProxy('10.0.1.4')).toBe(true);
    expect(isTrustedProxy('::ffff:172.18.0.3')).toBe(true);
    expect(isTrustedProxy('104.16.0.1')).toBe(true);
    expect(isTrustedProxy('2606:4700::1')).toBe(true);
    expect(isTrustedProxy('203.0.113.9')).toBe(false);
    expect(isTrustedProxy('not-an-ip')).toBe(false);
  });

  it('uses CF-Connecting-IP when the request came through Cloudflare or Traefik', () => {
    expect(clientIp({ ip: '104.16.0.1', headers: { 'cf-connecting-ip': '198.51.100.7' } })).toBe('198.51.100.7');
    expect(clientIp({ ip: '10.0.0.2', headers: { 'cf-connecting-ip': '198.51.100.7' } })).toBe('198.51.100.7');
  });

  it('ignores CF-Connecting-IP from a direct, untrusted peer', () => {
    expect(clientIp({ ip: '203.0.113.9', headers: { 'cf-connecting-ip': '198.51.100.7' } })).toBe('203.0.113.9');
  });

  it('ignores a CF-Connecting-IP that is not an address', () => {
    expect(clientIp({ ip: '10.0.0.2', headers: { 'cf-connecting-ip': 'evil, 1.2.3.4' } })).toBe('10.0.0.2');
  });
});
