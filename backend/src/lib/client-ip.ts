// Real client address behind Cloudflare → Traefik (Coolify)
//
// Express is told to trust forwarded headers only from private-network hops
// (Traefik, Docker) and Cloudflare. CF-Connecting-IP is only believed when the
// request really arrived from Cloudflare or a private hop, so someone hitting
// the server directly can't pick their own rate-limit bucket with a header.
import { BlockList, isIP } from 'node:net';

/** https://www.cloudflare.com/ips/ (checked 2026-10-22) */
export const CLOUDFLARE_RANGES = [
  '173.245.48.0/20',
  '103.21.244.0/22',
  '103.22.200.0/22',
  '103.31.4.0/22',
  '141.101.64.0/18',
  '108.162.192.0/18',
  '190.93.240.0/20',
  '188.114.96.0/20',
  '197.234.240.0/22',
  '198.41.128.0/17',
  '162.158.0.0/15',
  '104.16.0.0/13',
  '104.24.0.0/14',
  '172.64.0.0/13',
  '131.0.72.0/22',
  '2400:cb00::/32',
  '2606:4700::/32',
  '2803:f800::/32',
  '2405:b500::/32',
  '2405:8100::/32',
  '2a06:98c0::/29',
  '2c0f:f248::/32',
];

/** Loopback, link-local and private ranges — Traefik and Docker networks live here */
const INTERNAL_RANGES = [
  '127.0.0.0/8',
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  '169.254.0.0/16',
  '::1/128',
  'fc00::/7',
  'fe80::/10',
];

function buildList(ranges: string[]): BlockList {
  const list = new BlockList();
  for (const cidr of ranges) {
    const [address, prefix] = cidr.split('/') as [string, string];
    list.addSubnet(address, Number(prefix), isIP(address) === 6 ? 'ipv6' : 'ipv4');
  }
  return list;
}

/** Extra trusted proxy ranges, e.g. TRUSTED_PROXY_CIDRS='203.0.113.0/24,2001:db8::/32' */
const extraRanges = (process.env['TRUSTED_PROXY_CIDRS'] ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const cloudflare = buildList(CLOUDFLARE_RANGES);
const internal = buildList([...INTERNAL_RANGES, ...extraRanges]);

/** '::ffff:10.0.0.1' → '10.0.0.1' */
function normalize(address: string): string {
  return address.startsWith('::ffff:') && isIP(address.slice(7)) === 4 ? address.slice(7) : address;
}

function inList(list: BlockList, address: string): boolean {
  const ip = normalize(address);
  const family = isIP(ip);
  if (!family) return false;
  return list.check(ip, family === 6 ? 'ipv6' : 'ipv4');
}

export const isCloudflare = (address: string) => inList(cloudflare, address);
export const isInternal = (address: string) => inList(internal, address);

/** Express `trust proxy` callback: hops whose X-Forwarded-For entries we believe */
export function isTrustedProxy(address: string): boolean {
  return isInternal(address) || isCloudflare(address);
}

export interface IpRequest {
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
}

/** The real client address of a request (see the comment at the top of this file) */
export function clientIp(req: IpRequest): string {
  const peer = normalize(req.ip ?? '');
  const cfHeader = req.headers['cf-connecting-ip'];
  if (
    typeof cfHeader === 'string' &&
    isIP(cfHeader.trim()) &&
    (isCloudflare(peer) || isInternal(peer))
  ) {
    return normalize(cfHeader.trim());
  }
  return peer || 'unknown';
}
