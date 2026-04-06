import { getDashboardData } from '@/app/actions/progress';
import DashboardContent from './DashboardContent';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Protect route
  if (!user) {
    redirect('/auth/login');
  }

  // Fetch verified progress directly from the database server-side
  const { activities, modulesProgress } = await getDashboardData();

  return (
    <DashboardContent modules={modulesProgress} activities={activities} user={user} />
  );
}
