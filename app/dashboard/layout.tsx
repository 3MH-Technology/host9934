import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LogOut, Shield } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import SidebarNav from './SidebarNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 border-l border-border/50 bg-card/50 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-border/50 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">استضافة الذئب</h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[150px]" dir="ltr">{session.email}</p>
          </div>
        </div>
        
        <SidebarNav role={session.role} />

        <div className="p-4 border-t border-border/50">
          <form action={async () => {
            'use server';
            await logout();
            redirect('/login');
          }}>
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 w-full text-right rounded-lg hover:bg-red-500/10 text-red-500 transition-colors font-medium">
              <LogOut size={18} />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
