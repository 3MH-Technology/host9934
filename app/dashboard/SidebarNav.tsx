'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Server, Users, Settings } from 'lucide-react';

export default function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/bots', label: 'البوتات', icon: Server, exact: false },
    ...(role === 'ADMIN' ? [{ href: '/dashboard/admin', label: 'الإدارة (Admin)', icon: Users, exact: false, className: 'text-amber-500 hover:text-amber-400 hover:bg-amber-500/10' }] : []),
    { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings, exact: false },
  ];

  return (
    <nav className="flex-1 p-4 space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-primary/10 text-primary font-medium' 
                : link.className || 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-primary' : ''} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
