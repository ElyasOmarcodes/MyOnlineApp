import React, { useState } from 'react';
import { 
  ChevronDown, 
  ShieldCheck, 
  User, 
  Sparkles,
  Github,
  Twitter,
  Mail,
  Zap,
  Globe,
  Database,
  Shield,
  Layout as LayoutIcon,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

const About: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-black min-h-screen pb-24" dir="rtl">
      <div className="p-4">
        {/* Hero Section */}
        <div className="bg-[var(--accent-color)] rounded-[40px] py-10 px-6 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-black" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white text-right mb-2">زمونږ په اړه</h1>
            <p className="text-sm font-medium text-white/80 text-right">د اسلامي مطالبو او ښکلو ویناوو د خپرولو آنلاین پلیټ فارم.</p>
          </div>
        </div>

        {/* Developer Profile Card */}
        <div className="mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-10 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center shadow-sm">
            <div className="relative mb-6">
              <div className="absolute -inset-2.5 bg-emerald-500/20 rounded-full animate-pulse" />
              <div className="w-32 h-32 rounded-full bg-zinc-50 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 flex justify-center items-center relative z-10 overflow-hidden">
                <User size={64} className="text-zinc-300" />
              </div>
            </div>
            
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">الیاس عمر</h2>
              <div className="bg-emerald-500/10 px-4 py-1 rounded-2xl">
                <span className="text-emerald-500 text-[10px] font-bold uppercase">پروګرام جوړونکی</span>
              </div>
            </div>

            <p className="text-zinc-500 text-center leading-relaxed mb-6">
              د مؤمن ولس یو پروګرام جوړونکی دی چې غواړي د ټکنالوژۍ له لارې د اسلام خدمت وکړي او د دیني معلوماتو د خپرولو په برخه کې خپله ونډه واخلي.
            </p>

            <div className="flex flex-row-reverse justify-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                <Github size={20} className="text-zinc-400" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                <Twitter size={20} className="text-zinc-400" />
              </a>
              <a href="mailto:example@email.com" className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                <Mail size={20} className="text-zinc-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-6">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 px-2 text-right">د اپلیکیشن ځانګړتیاوې</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Database, title: 'فایربیس', desc: 'آنلاین ډیټابیس' },
              { icon: Zap, title: 'چټک', desc: 'لوړ سرعت' },
              { icon: Shield, title: 'خوندي', desc: 'اډمین پینل' },
              { icon: LayoutIcon, title: 'ښکلی UI', desc: 'عصري ډیزاین' },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col items-end shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)]/10 flex justify-center items-center mb-3">
                  <feature.icon size={24} className="text-[var(--accent-color)]" />
                </div>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-1 text-right">{feature.title}</h4>
                <p className="text-[10px] text-zinc-400 text-right">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Policy Accordion */}
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 overflow-hidden mb-12 shadow-sm">
          <button
            className="w-full flex flex-row-reverse items-center justify-between p-8"
            onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
          >
            <div className="flex flex-row-reverse items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex justify-center items-center ml-4">
                <ShieldCheck size={24} className="text-emerald-500" />
              </div>
              <div className="flex flex-col items-end">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">قوانین او پالیسي</h3>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Privacy Policy</span>
              </div>
            </div>
            <div className={`transition-transform duration-300 ${isPrivacyOpen ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown size={20} className="text-zinc-300" />
            </div>
          </button>
          
          {isPrivacyOpen && (
            <div className="px-8 pb-8">
              <p className="text-zinc-500 text-sm leading-relaxed text-right mb-4">
                دا اپلیکیشن ستاسو د معلوماتو د خوندي ساتلو لپاره جوړ شوی دی. ټول مطالب په فایربیس کې خوندي کیږي.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'مطالب په ژوندۍ بڼه له فایربیس څخه راځي.',
                  'اډمین پینل د مطالبو د خپرولو لپاره دی.',
                  'خوښ شوي مطالب ستاسو په موبایل کې خوندي کیږي.'
                ].map((item, i) => (
                  <div key={i} className="flex flex-row-reverse items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] ml-3" />
                    <span className="text-xs text-zinc-500 text-right">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center py-12">
          <div className="flex flex-row-reverse items-center justify-center mb-4">
            <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">Ramadan Content App</span>
            <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800 mx-2" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-zinc-400 mb-1">© ۲۰۲۴ ټول حقونه خوندي دي</span>
            <span className="text-[10px] font-bold text-zinc-400 opacity-50">نسخه ۲.۰.۰ • Crafted with Love</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
