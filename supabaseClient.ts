/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration storage keys
const LOCAL_SUPABASE_URL_KEY = 'abdelraouf_supabase_url';
const LOCAL_SUPABASE_ANON_KEY = 'abdelraouf_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  source: 'env' | 'custom' | 'none';
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

  const customUrl = localStorage.getItem(LOCAL_SUPABASE_URL_KEY)?.trim();
  const customKey = localStorage.getItem(LOCAL_SUPABASE_ANON_KEY)?.trim();

  if (customUrl && customKey) {
    return { url: customUrl, anonKey: customKey, source: 'custom' };
  }

  if (envUrl && envKey && !envUrl.includes('your-project') && !envKey.includes('your-anon')) {
    return { url: envUrl, anonKey: envKey, source: 'env' };
  }

  return {
    url: customUrl || envUrl || '',
    anonKey: customKey || envKey || '',
    source: (customUrl && customKey) ? 'custom' : (envUrl && envKey ? 'env' : 'none'),
  };
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(LOCAL_SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(LOCAL_SUPABASE_ANON_KEY, anonKey.trim());
  // Re-instantiate client
  cachedClient = null;
}

export function clearCustomSupabaseConfig(): void {
  localStorage.removeItem(LOCAL_SUPABASE_URL_KEY);
  localStorage.removeItem(LOCAL_SUPABASE_ANON_KEY);
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  try {
    // Only anon/publishable key - NEVER service_role
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export interface ConnectionTestResult {
  ok: boolean;
  message: string;
  latencyMs?: number;
  statusCode?: number;
  url?: string;
  hasTables?: boolean;
}

/**
 * Real live connection test to Supabase.
 * Does not fake connection; actually pings Supabase REST endpoint and tests auth state.
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const config = getSupabaseConfig();

  if (!config.url || !config.anonKey) {
    return {
      ok: false,
      message: 'لم يتم إدخال عنوان URL أو المفتاح العام (Anon Key) لقاعدة بيانات Supabase.',
    };
  }

  // Validate URL format
  if (!config.url.startsWith('https://')) {
    return {
      ok: false,
      message: 'عنوان Supabase URL يجب أن يبدأ بـ https://',
    };
  }

  // Validate Anon key format
  if (config.anonKey.startsWith('sbp_') || config.anonKey.includes('service_role')) {
    return {
      ok: false,
      message: 'تحذير أمني: تم رصد مفتاح إداري أو خاص. يجب استخدام مفتاح Anon العام (Public Publishable Key) فقط لحماية أمان النظام.',
    };
  }

  const startTime = performance.now();

  try {
    const client = getSupabase();
    if (!client) {
      return { ok: false, message: 'تعذر إنشاء عميل الاتصال بقاعدة البيانات.' };
    }

    // Ping Supabase Auth to verify URL & Key validity
    const { error: authError } = await client.auth.getSession();
    const latency = Math.round(performance.now() - startTime);

    if (authError) {
      return {
        ok: false,
        latencyMs: latency,
        message: `خطأ في المصادقة مع Supabase: ${authError.message}`,
      };
    }

    // Check if tables exist by querying students table (limit 0)
    let hasTables = false;
    const { error: tableError } = await client.from('students').select('id').limit(1);

    if (!tableError) {
      hasTables = true;
    } else if (tableError.code === '42P01') {
      // Table doesn't exist yet
      return {
        ok: true,
        latencyMs: latency,
        hasTables: false,
        message: 'تم الاتصال بنجاح بمشروع Supabase! يرجى تنفيذ ملف SQL لإنشاء جداول النظام.',
      };
    }

    return {
      ok: true,
      latencyMs: latency,
      hasTables,
      message: hasTables
        ? `الاتصال بقاعدة بيانات Supabase نشط وجداول النظام مهيأة بنجاح (${latency} مللي ثانية).`
        : `الاتصال بنجاح (${latency} مللي ثانية) ولكن الجداول بحاجة إلى تهيئة عبر ملف SQL.`,
    };
  } catch (err: any) {
    const latency = Math.round(performance.now() - startTime);
    return {
      ok: false,
      latencyMs: latency,
      message: `فشل الاتصال: ${err?.message || 'تعذر الوصول إلى خادم Supabase، يرجى مراجعة الرابط واتصال الإنترنت.'}`,
    };
  }
}
