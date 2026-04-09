import { Shield } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full h-full">
      <div className="relative flex items-center justify-center w-20 h-20">
        <Shield className="w-10 h-10 text-primary animate-pulse absolute z-10" />
        <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-b-2 border-blue-400 rounded-full animate-spin direction-reverse"></div>
      </div>
      <p className="text-muted-foreground text-sm font-medium animate-pulse tracking-widest">جاري التحميل...</p>
    </div>
  );
}
