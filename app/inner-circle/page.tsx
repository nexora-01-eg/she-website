'use client';
import { useState } from 'react';

/**
 * INNER CIRCLE — invitation into SHE (§32), not a newsletter.
 * Frontend demo state; structured for future VIP/community backend.
 */
export default function InnerCirclePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (name.trim().length < 2) { setErr('اكتبي اسمك.'); return; }
    if (!/^01[0125]\d{8}$/.test(phone.trim())) { setErr('رقم الموبايل لازم يبدأ بـ 01 ويكون 11 رقم.'); return; }
    try {
      const raw = localStorage.getItem('she-inner-circle-v1');
      const list = raw ? JSON.parse(raw) : [];
      list.push({ name: name.trim(), phone: phone.trim(), at: new Date().toISOString() });
      localStorage.setItem('she-inner-circle-v1', JSON.stringify(list));
    } catch { /* ignore */ }
    setDone(true);
  }

  return (
    <div className="wrap">
      <section className="section inner-circle-hero">
        <p className="latin-track section-kicker">INNER CIRCLE</p>
        <h1>الدايرة القريبة</h1>
        <p style={{ opacity: 0.8 }}>دي مش نشرة بريدية. دي دعوة لدخول SHE من جوه.</p>
        <ul style={{ lineHeight: 2 }}>
          <li>دخول مبكر للإصدارات الجديدة</li>
          <li>إصدارات خاصة (Private Drops)</li>
          <li>دعوات لتجارب وفعاليات SHE</li>
          <li>خصومات الدايرة قبل أي حد</li>
        </ul>
      </section>
      <section className="section" aria-label="Request invitation">
        {done ? (
          <div className="tile" style={{ textAlign: 'center', padding: 32 }}>
            <p className="latin-track" style={{ color: 'var(--she-pink)' }}>WELCOME IN</p>
            <h2>أهلاً بيكي في الدايرة يا {name} 🤍</h2>
            <p style={{ opacity: 0.7 }}>أول إصدار خاص هيوصلك على واتساب. وفي الوقت ده — <a href="/collections">استكشفي العوالم</a>.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate style={{ maxWidth: 440 }}>
            <h2>اطلبي دعوتك</h2>
            <label>الاسم<br />
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required style={{ width: '100%', padding: 10, borderRadius: 10 }} />
            </label>
            <br /><br />
            <label>واتساب<br />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" placeholder="01xxxxxxxxx" required dir="ltr" style={{ width: '100%', padding: 10, borderRadius: 10 }} />
            </label>
            {err && <p role="alert" style={{ color: 'var(--she-orange)' }}>{err}</p>}
            <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>ادخلي الدايرة</button>
          </form>
        )}
      </section>
    </div>
  );
}
