/*
 * REPLIT VERSION - Uses environment variables
 * Replace the original info.tsx with this file when deploying to Replit
 *
 * Set these in Replit Secrets:
 * - VITE_SUPABASE_PROJECT_ID
 * - VITE_SUPABASE_ANON_KEY
 */

export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || '';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
