import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) redirect('/admin/login');

  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (error || !admin || admin.role !== 'admin') {
    redirect('/admin/login?error=not-authorized');
  }

  return { supabase, user: userData.user, role: admin.role as 'admin' | 'editor' };
}
