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
import { motion, AnimatePresence } from 'motion/react';

const About: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <header className="relative py-10 px-6 overflow-hidden rounded-[40px] bg-[var(--accent-color)] text-white shadow-2xl shadow-[var(--accent-color)]/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="10" cy="10" r="40" fill="white" />
            <circle cx="90" cy="90" r="30" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-black tracking-tight">زمونږ په اړه</h1>
          <p className="text-white/80 text-sm font-medium">د اسلامي مطالبو او ښکلو ویناوو د خپرولو آنلاین پلیټ فارم.</p>
        </div>
      </header>

      {/* Developer Profile Card */}
      <section className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)]/20 to-blue-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-white dark:bg-zinc-900 rounded-[40px] p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--accent-color)] rounded-full blur-xl opacity-20 animate-pulse" />
              <div className="relative w-32 h-32 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden">
                <User size={64} strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">الیاس عمر</h2>
              <div className="inline-block px-4 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full text-xs font-black uppercase tracking-widest">
                پروګرام جوړونکی
              </div>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              د مؤمن ولس یو پروګرام جوړونکی دی چې غواړي د ټکنالوژۍ له لارې د اسلام خدمت وکړي او د دیني معلوماتو د خپرولو په برخه کې خپله ونډه واخلي.
            </p>

            <div className="flex items-center space-x-4 space-x-reverse pt-4">
              {[
                { icon: Github, color: 'hover:text-black dark:hover:text-white' },
                { icon: Twitter, color: 'hover:text-blue-400' },
                { icon: Mail, color: 'hover:text-red-400' },
              ].map((social, i) => (
                <button key={i} className={`p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-zinc-400 transition-all active:scale-90 ${social.color}`}>
                  <social.icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-6">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400 px-2">د اپلیکیشن ځانګړتیاوې</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Database, title: 'فایربیس', desc: 'آنلاین ډیټابیس' },
            { icon: Zap, title: 'چټک', desc: 'لوړ سرعت' },
            { icon: Shield, title: 'خوندي', desc: 'اډمین پینل' },
            { icon: LayoutIcon, title: 'ښکلی UI', desc: 'عصري ډیزاین' },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center">
                <feature.icon size={24} />
              </div>
              <div>
                <h3 className="font-black text-sm">{feature.title}</h3>
                <p className="text-[10px] text-zinc-400 font-medium">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Privacy Policy Accordion */}
      <section className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <button
          onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
          className="w-full flex items-center justify-between p-8 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div className="text-right">
              <span className="block font-black text-lg leading-none">قوانین او پالیسي</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Privacy Policy</span>
            </div>
          </div>
          <div className={`transition-transform duration-300 ${isPrivacyOpen ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} className="text-zinc-300" />
          </div>
        </button>
        
        <AnimatePresence>
          {isPrivacyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-8 pb-8"
            >
              <div className="pt-2 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed space-y-4 font-medium">
                <p>
                  دا اپلیکیشن ستاسو د معلوماتو د خوندي ساتلو لپاره جوړ شوی دی. ټول مطالب په فایربیس کې خوندي کیږي.
                </p>
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {[
                    'مطالب په ژوندۍ بڼه له فایربیس څخه راځي.',
                    'اډمین پینل د مطالبو د خپرولو لپاره دی.',
                    'خوښ شوي مطالب ستاسو په موبایل کې خوندي کیږي.'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="text-center py-12 space-y-4">
        <div className="flex items-center justify-center space-x-2 space-x-reverse text-zinc-300">
          <div className="h-[1px] w-8 bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Ramadan Content App</span>
          <div className="h-[1px] w-8 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="text-zinc-400 text-[10px] font-bold">
          <p>© ۲۰۲۴ ټول حقونه خوندي دي</p>
          <p className="mt-1 opacity-50">نسخه ۲.۰.۰ • Crafted with Love</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
