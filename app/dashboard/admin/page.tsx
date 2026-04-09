import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Server, Users as UsersIcon } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { bots: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const allBots = await prisma.bot.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-amber-500">لوحة الإدارة</h1>
        <p className="text-muted-foreground mt-1">إدارة المستخدمين والبوتات في المنصة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">إجمالي البوتات</p>
            <p className="text-2xl font-bold">{allBots.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold">جميع البوتات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">اسم البوت</th>
                <th className="px-4 py-3 font-medium">المستخدم</th>
                <th className="px-4 py-3 font-medium">اللغة</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allBots.map(bot => (
                <tr key={bot.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{bot.name}</td>
                  <td className="px-4 py-3" dir="ltr">{bot.user.email}</td>
                  <td className="px-4 py-3">{bot.language}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      bot.status === 'RUNNING' ? 'bg-green-500/10 text-green-500' :
                      bot.status === 'ERROR' ? 'bg-red-500/10 text-red-500' :
                      bot.status === 'BUILDING' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-zinc-500/10 text-zinc-500'
                    }`}>
                      {bot.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/bots/${bot.id}`} className="text-primary hover:underline">
                      إدارة
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold">المستخدمين</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">البريد الإلكتروني</th>
                <th className="px-4 py-3 font-medium">الرتبة</th>
                <th className="px-4 py-3 font-medium">عدد البوتات</th>
                <th className="px-4 py-3 font-medium">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3" dir="ltr">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user._count.bots}</td>
                  <td className="px-4 py-3" dir="ltr">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
