import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { logout } from '@/app/actions/auth';
import { generateDemoData } from '@/app/actions/progress';

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="bg-deep-pine min-h-screen relative overflow-hidden font-sans">
      <Header />
      
      {/* Decorative Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-mint-bloom/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-cream-white tracking-tight mb-8">
          My Account
        </h1>

        <div className="glass-panel p-8 border border-white/[0.05]">
          <h2 className="text-xl text-cream-white font-medium mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-soft-pistachio/60 font-mono">Full Name</label>
              <p className="text-cream-white mt-1 text-lg">{user.user_metadata?.full_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-soft-pistachio/60 font-mono">Email Address</label>
              <p className="text-cream-white mt-1 text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-soft-pistachio/60 font-mono">Account ID</label>
              <p className="text-white/40 mt-1 text-sm font-mono break-all">{user.id}</p>
            </div>
            <div>
              <label className="text-sm text-soft-pistachio/60 font-mono">Signup Date</label>
              <p className="text-white/40 mt-1 text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/[0.05] flex flex-wrap items-center gap-4">
            <Link 
              href="/dashboard"
              className="inline-block bg-mint-bloom hover:bg-mint-bloom/90 text-deep-pine font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Go to Dashboard
            </Link>

            <form action={generateDemoData}>
              <button 
                type="submit"
                className="inline-block bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Generate Demo Data
              </button>
            </form>

            <form action={logout} className="ml-auto">
              <button 
                type="submit"
                className="inline-block bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
