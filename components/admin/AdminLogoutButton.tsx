'use client';

import { createClient } from '@/lib/supabase/client';

export default function AdminLogoutButton() {
  async function logout() {
    await createClient().auth.signOut();
    window.location.assign('/admin/login');
  }

  return (
    <button type="button" onClick={logout} className="text-cream/55 hover:text-gold-light">
      Déconnexion
    </button>
  );
}
