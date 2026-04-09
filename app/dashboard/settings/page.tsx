import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground mt-1">إدارة إعدادات حسابك.</p>
      </div>

      <div className="max-w-xl space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">المعلومات الشخصية</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
              <p className="mt-1 font-medium" dir="ltr">{session.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">الرتبة</label>
              <p className="mt-1 font-medium">{session.role}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">تغيير كلمة المرور</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور الحالية</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور الجديدة</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
            </div>
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
            >
              حفظ التغييرات
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
