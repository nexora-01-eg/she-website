/**
 * SHE — WhatsApp helpers. Number comes from config (TODO until owner provides).
 * Never hardcoded. TODO-aware: links carry a flag so UI can badge "قريباً".
 */
import { SHE_CONFIG } from '@/data/config';

export function waNumber(): string | null {
  const n = SHE_CONFIG.brand.whatsapp;
  return n === 'TODO' ? null : n;
}

export function waLink(message: string): { href: string; configured: boolean } {
  const num = waNumber();
  const text = encodeURIComponent(message);
  if (!num) return { href: `https://wa.me/?text=${text}`, configured: false };
  return { href: `https://wa.me/${num}?text=${text}`, configured: true };
}

export interface OrderLine {
  name: string;
  modelCode: string;
  color: string;
  size?: string;
  qty: number;
  price: number;
}

export function orderMessage(
  lines: OrderLine[],
  opts: { name?: string; address?: string; zone?: string; code?: string; total?: number; delivery?: number | null },
): string {
  const l = lines
    .map((x, i) => `${i + 1}) ${x.name} (${x.modelCode} / ${x.color}${x.size ? ` / مقاس ${x.size}` : ''}) × ${x.qty} = ${x.qty * x.price} ج.م`)
    .join('\n');
  const total = opts.total ?? lines.reduce((s, x) => s + x.qty * x.price, 0);
  return [
    'طلب جديد من SHE 🤍',
    opts.code ? `رقم الطلب: ${opts.code}` : null,
    '',
    l,
    '',
    `الإجمالي: ${total} ج.م`,
    opts.delivery != null ? `التوصيل (${opts.zone ?? ''}): ${opts.delivery} ج.م` : null,
    opts.name ? `الاسم: ${opts.name}` : null,
    opts.address ? `العنوان: ${opts.address}` : null,
  ].filter(Boolean).join('\n');
}

export function inquiryMessage(modelCode: string, color: string, size?: string): string {
  return `هاي SHE 🤍 بسأل عن توفر: ${modelCode} / ${color}${size ? ` / مقاس ${size}` : ''}. شكراً!`;
}
