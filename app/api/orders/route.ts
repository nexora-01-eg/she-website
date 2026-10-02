import { NextResponse } from 'next/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { INVENTORY_ROWS } from '@/data/seed';
import { DELIVERY_ZONES } from '@/data/schema';
import { orderMessage } from '@/lib/wa';
import { SHE_CONFIG } from '@/data/config';

const MOBILE_RE = /^01[0125]\d{8}$/;
const priceByModel = new Map(INVENTORY_ROWS.map((r) => [r.modelCode, r.price]));
const ZONES: Set<string> = new Set(DELIVERY_ZONES.map((z) => z.key));

function code(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const r = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SHE-${ymd}-${r}`;
}

/**
 * POST /api/orders — validate → store (data/orders/*.json now; Supabase later,
 * same payload shape) → return order code + WhatsApp href.
 */
export async function POST(req: Request) {
  let body: {
    items?: Array<{ modelCode: string; color: string; size?: string; qty: number; price: number }>;
    name?: string; phone?: string; zone?: string; address?: string; notes?: string; utm?: string;
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 }); }

  const items = body.items ?? [];
  if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
    return NextResponse.json({ error: 'الأتيليه فاضي' }, { status: 400 });
  }
  if (!body.name || body.name.trim().length < 2) return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 });
  if (!body.phone || !MOBILE_RE.test(body.phone.trim())) {
    return NextResponse.json({ error: 'رقم الموبايل غير صحيح (01 + 11 رقم)' }, { status: 400 });
  }
  if (!body.zone || !ZONES.has(body.zone)) return NextResponse.json({ error: 'زون التوصيل غير صحيح' }, { status: 400 });
  if (!body.address || body.address.trim().length < 5) return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });

  for (const it of items) {
    const real = priceByModel.get(it.modelCode);
    if (!real) return NextResponse.json({ error: `موديل غير معروف: ${it.modelCode}` }, { status: 400 });
    if (it.price !== real) return NextResponse.json({ error: `سعر غير مطابق: ${it.modelCode}` }, { status: 400 });
    if (!Number.isInteger(it.qty) || it.qty < 1 || it.qty > 9) {
      return NextResponse.json({ error: 'كمية غير صالحة' }, { status: 400 });
    }
  }

  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const orderCode = code();
  const record = {
    code: orderCode,
    items, name: body.name.trim(), phone: body.phone.trim(),
    zone: body.zone, address: body.address.trim(), notes: (body.notes ?? '').trim(),
    total, deliveryFee: 'TODO', channel: 'form', utm: body.utm ?? null,
    createdAt: new Date().toISOString(), source: 'seed-prices',
  };

  try {
    const dir = join(process.cwd(), 'data', 'orders');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${orderCode}.json`), JSON.stringify(record, null, 2), 'utf8');
  } catch {
    return NextResponse.json({ error: 'تعذر حفظ الطلب — حاولي تاني' }, { status: 500 });
  }

  const text = orderMessage(items.map((i) => ({
    name: i.modelCode, modelCode: i.modelCode, color: i.color, size: i.size, qty: i.qty, price: i.price,
  })), { name: record.name, address: record.address, zone: record.zone, code: orderCode, total });
  const num = SHE_CONFIG.brand.whatsapp === 'TODO' ? '' : SHE_CONFIG.brand.whatsapp;
  const waHref = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;

  return NextResponse.json({ code: orderCode, waHref });
}
