import {createClient} from '@supabase/supabase-js';
export const safePreview=import.meta.env.VITE_PREVIEW_MODE==='true';
const url=import.meta.env.VITE_SUPABASE_URL;
const publishable=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||import.meta.env.VITE_SUPABASE_ANON_KEY;
// Browser-safe publishable/anon key only. Privileged keys never belong in Vite.
export const supabase=!safePreview&&url&&publishable?createClient(url,publishable,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
