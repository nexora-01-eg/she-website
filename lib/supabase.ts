/**
 * SHE — Supabase clients.
 * - `supabaseAnon()`: publishable key, safe for browser/server reads that RLS allows.
 * - `supabaseService()`: service_role, SERVER ONLY. Throws when unconfigured.
 * Order API: Supabase when configured → file fallback for local dev only.
 * On Vercel (read-only fs) without Supabase keys, order writes return 503.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';

export function isSupabaseConfigured(): boolean {
  return Boolean(URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let anon: SupabaseClient | null = null;
export function supabaseAnon(): SupabaseClient | null {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!URL || !key) return null;
  if (!anon) anon = createClient(URL, key);
  return anon;
}

let service: SupabaseClient | null = null;
export function supabaseService(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  if (!URL || !key) throw new Error('Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  if (!service) service = createClient(URL, key, { auth: { persistSession: false } });
  return service;
}
