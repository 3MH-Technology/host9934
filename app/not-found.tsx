import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center" dir="rtl">
      <ShieldAlert className="w-24 h-24 text-primary mb-8 opacity-80 animate-pulse" />
      <h1 className="text-7xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground">
        404
      </h1>
      <h2 className="text-2xl font-medium mb-4">الصفحة غير موجودة</h2>
      <p className="max-w-md text-muted-foreground mb-8 leading-relaxed">
        عذراً، الصفحة التي تبحث عنها غير موجودة في خوادم استضافة الذئب. ربما تم نقلها أو حذفها أو أن الرابط غير صحيح.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/" 
          className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium"
        >
          العودة للرئيسية
        </Link>
        <Link 
          href="/dashboard" 
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors font-medium border border-border"
        >
          لوحة التحكم
        </Link>
      </div>
    </div>
  );
}
