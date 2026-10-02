'use client';
import { waLink } from '@/lib/wa';

/** Floating WhatsApp — context-aware prefill where provided, generic otherwise. */
export function WhatsAppFloat({ message }: { message?: string }) {
  const { href, configured } = waLink(message ?? 'هاي SHE 🤍 عايزة مساعدة في اختياري.');
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصلي واتساب"
      title={configured ? 'تواصلي واتساب' : 'واتساب (الرقم قريباً من الإعدادات)'}
      style={{
        position: 'fixed', insetInlineEnd: 16, bottom: 20, zIndex: 60,
        width: 52, height: 52, borderRadius: '50%', display: 'grid', placeItems: 'center',
        background: 'var(--she-green)', color: '#111', fontSize: 24, textDecoration: 'none',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      ✆
    </a>
  );
}
