import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shield, Zap, Terminal, Server, Lock, Cpu, ChevronLeft, Code2 } from 'lucide-react';

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col" dir="rtl">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">استضافة الذئب</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              تسجيل الدخول
            </Link>
            <Link href="/register" className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2 rounded-full hover:bg-primary/90 transition-colors">
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              الجيل الجديد من استضافة البوتات
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
              أطلق العنان لبوتاتك مع <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                استضافة الذئب
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              منصة احترافية متكاملة لتشغيل وإدارة بوتات تيليجرام (Python / PHP) بأعلى معايير الأمان، العزل التام، والأداء الفائق.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all hover:scale-105">
                أنشئ حسابك الآن
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <Link href="#features" className="w-full sm:w-auto px-8 py-4 text-base font-medium text-foreground bg-secondary rounded-full hover:bg-secondary/80 transition-colors border border-border">
                استكشف المميزات
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا تختار استضافة الذئب؟</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                بنينا المنصة من الصفر لتلبي احتياجات مطوري البوتات المحترفين.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Lock className="w-6 h-6 text-primary" />}
                title="عزل تام وآمن"
                description="كل بوت يعمل في حاوية Docker معزولة تماماً (Container) بدون صلاحيات Root لضمان أقصى درجات الأمان."
              />
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-amber-500" />}
                title="أداء فائق"
                description="موارد مخصصة لكل بوت مع مراقبة دقيقة لاستهلاك المعالج والذاكرة لضمان استقرار البوتات."
              />
              <FeatureCard 
                icon={<Terminal className="w-6 h-6 text-green-500" />}
                title="إدارة متكاملة"
                description="لوحة تحكم احترافية تتيح لك تعديل الملفات، قراءة السجلات الحية، والتحكم بحالة البوت بضغطة زر."
              />
              <FeatureCard 
                icon={<Code2 className="w-6 h-6 text-blue-500" />}
                title="دعم Python & PHP"
                description="تعرف تلقائي على لغة البوت وتثبيت المكتبات المطلوبة (requirements.txt أو composer.json)."
              />
              <FeatureCard 
                icon={<Server className="w-6 h-6 text-purple-500" />}
                title="عمل مستمر 24/7"
                description="نظام إعادة تشغيل تلقائي عند التعطل (Auto-restart) لضمان بقاء بوتاتك متصلة دائماً."
              />
              <FeatureCard 
                icon={<Shield className="w-6 h-6 text-red-500" />}
                title="خصوصية تامة"
                description="لا نقوم بتتبع بياناتك أو مشاركتها. ملفاتك مشفرة ومحمية ولا يمكن لأحد الوصول إليها غيرك."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-background text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">استضافة الذئب</span>
          </div>
          <p>تطوير: @j49_c | جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
