import { NextResponse } from 'next/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { isSupabaseConfigured, supabaseService } from '@/lib/supabase';

const MOBILE_RE = /^01[0125]\d{8}$/;

/**
 * POST /api/inner-circle — name + WhatsApp + interest + explicit consent.
 * Ready for the Phase D form. Same storage rule as orders.
 */
export async function POST(req: Request) {
  let body: { name?: string; phone?: string; interest?: string; consent?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 }); }

  if (!body.name || body.name.trim().length < 2) return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 });
  if (!body.phone || !MOBILE_RE.test(body.phone.trim())) {
    return NextResponse.json({ error: 'رقم الواتساب غير صحيح (01 + 11 رقم)' }, { status: 400 });
  }
  if (body.interest !== 'bags' && body.interest !== 'shoes') {
    return NextResponse.json({ error: 'اختاري الاهتمام: شنط أو شوز' }, { status: 400 });
  }
  if (body.consent !== true) return NextResponse.json({ error: 'لازم الموافقة الصريحة' }, { status: 400 });

  const record = {
    name: body.name.trim(), phone: body.phone.trim(),
    interest: body.interest, consent: true,
  };

  if (isSupabaseConfigured()) {
    const { error } = await supabaseService().from('inner_circle').insert(record);
    if (error) return NextResponse.json({ error: 'تعذر الحفظ — حاولي تاني' }, { status: 500 });
  } else if (process.env.VERCEL) {
    return NextResponse.json({ error: 'غير متاح حالياً' }, { status: 503 });
  } else {
    try {
      const dir = join(process.cwd(), 'data', 'inner-circle');
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, `${Date.now()}-${record.phone}.json`), JSON.stringify({ ...record, createdAt: new Date().toISOString() }, null, 2), 'utf8');
    } catch {
      return NextResponse.json({ error: 'تعذر الحفظ — حاولي تاني' }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}
