import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  Scale, Zap, Clock, ShieldCheck, ChevronDown, ArrowRight,
  CheckCircle2, Search, PenTool, Cpu, X, CreditCard, QrCode, Lock, Star
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ── Particles background ──
const Particles = () => {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    dur: `${6 + Math.random() * 12}s`,
    delay: `${Math.random() * 10}s`,
    drift: `${(Math.random() - 0.5) * 120}px`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            '--dur': p.dur,
            '--delay': p.delay,
            '--drift': p.drift,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

// ── Animated counter ──
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ── Typing effect ──
const TypingEffect = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i === text.length) { clearInterval(iv); setDone(true); }
      }, 22);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      {!done && <span className="cursor-blink" />}
    </span>
  );
};

// ── FAQ item ──
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-6">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left group">
        <span className="text-lg md:text-2xl font-serif group-hover:text-accent transition-colors duration-300">{question}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-500 ${open ? 'rotate-180 text-accent' : 'text-muted'}`} />
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <p className="pt-4 text-muted leading-relaxed text-sm md:text-base">{answer}</p>
      </motion.div>
    </div>
  );
};

// ── Checkout modal ──
const CheckoutModal = ({ isOpen, onClose, plan }: { isOpen: boolean; onClose: () => void; plan: { name: string; price: number } | null }) => {
  const [method, setMethod] = useState<'card' | 'pix'>('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setSuccess(true); }, 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("jurisai@pagamento.com.br").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!isOpen) { setTimeout(() => { setSuccess(false); setProcessing(false); }, 400); }
  }, [isOpen]);

  if (!plan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/95 backdrop-blur-2xl"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.94, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            className="w-full max-w-xl bg-surface border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(201,169,110,0.08)] max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="p-6 md:p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-serif mb-2">Checkout Seguro</h2>
                  <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest">
                    <Lock className="w-3 h-3" /> Conexão Criptografada · SSL
                  </div>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!success ? (
                <div className="space-y-8">
                  {/* Plan summary */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Plano Selecionado</p>
                        <h3 className="text-xl font-serif">JurisAI {plan.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-serif text-accent">R$ {plan.price.toLocaleString('pt-BR')}</div>
                        <div className="text-[10px] text-muted uppercase tracking-widest">Pagamento Único</div>
                      </div>
                    </div>
                  </div>

                  {/* Method tabs */}
                  <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                    {(['card', 'pix'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setMethod(m)}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-500 ${method === m ? 'bg-accent text-bg font-bold shadow-lg' : 'hover:bg-white/5 text-muted'}`}
                      >
                        {m === 'card' ? <CreditCard className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
                        <span className="text-xs uppercase tracking-widest">{m === 'card' ? 'Cartão' : 'PIX'}</span>
                      </button>
                    ))}
                  </div>

                  {method === 'card' ? (
                    <motion.div key="card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted uppercase tracking-widest ml-1">Número do Cartão</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="input-field text-lg tracking-widest" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted uppercase tracking-widest ml-1">Nome Impresso</label>
                        <input type="text" placeholder="Como no cartão" className="input-field uppercase" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-muted uppercase tracking-widest ml-1">Validade</label>
                          <input type="text" placeholder="MM/AA" className="input-field" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-muted uppercase tracking-widest ml-1">CVV</label>
                          <input type="text" placeholder="123" className="input-field" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted uppercase tracking-widest ml-1">Parcelamento</label>
                        <select className="input-field appearance-none cursor-pointer bg-surface">
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={i + 1} className="bg-surface">
                              {i + 1}x de R$ {(plan.price / (i + 1)).toFixed(2).replace('.', ',')} sem juros
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="pix" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-center py-4 space-y-6">
                      <div className="relative w-48 h-48 bg-white mx-auto p-4 rounded-2xl shadow-inner">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=jurisai-pix-${plan.price}`}
                          alt="QR Code PIX"
                          className="w-full h-full"
                        />
                        <div className="absolute inset-0 border-4 border-accent/20 rounded-2xl pointer-events-none" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm text-muted">Escaneie o QR Code ou copie a chave abaixo</p>
                        <button
                          onClick={handleCopy}
                          className="w-full py-4 bg-white/5 border border-dashed border-accent/30 rounded-xl text-accent text-xs font-bold uppercase tracking-widest hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
                        >
                          {copied ? <><CheckCircle2 className="w-4 h-4" /> Copiado!</> : 'Copiar Chave PIX'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-6 border-t border-white/5">
                    <button onClick={handlePay} disabled={processing} className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg">
                      {processing ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-6 h-6 border-2 border-bg/30 border-t-bg rounded-full" />
                      ) : (
                        <>Finalizar Compra <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-muted uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-success" /> Ambiente 100% Seguro · LGPD
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 space-y-8">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="pulse-ring" />
                    <div className="pulse-ring pulse-ring-2" />
                    <div className="w-full h-full bg-success/10 text-success rounded-full flex items-center justify-center border border-success/20">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif">Bem-vindo à Elite.</h3>
                    <p className="text-muted leading-relaxed max-w-xs mx-auto text-sm">
                      Seu acesso ao JurisAI foi liberado. Nossa equipe entrará em contato em até 30 minutos.
                    </p>
                  </div>
                  <button onClick={onClose} className="btn-primary w-full py-5 text-lg">Acessar Plataforma</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Main App ──
export default function App() {
  const [checkoutPlan, setCheckoutPlan] = useState<{ name: string; price: number } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const openElite = () => setCheckoutPlan({ name: 'Elite', price: 1497 });
  const openEssencial = () => setCheckoutPlan({ name: 'Essencial', price: 897 });

  const stats = [
    { n: 847, suffix: "+", label: "Advogados Ativos" },
    { n: 12400, suffix: "+", label: "Petições Geradas" },
    { n: 98, suffix: "%", label: "Taxa de Aprovação" },
    { n: 3, suffix: "x", label: "Mais Casos / Mês" },
  ];

  const features = [
    { icon: Search, title: "Busca Inteligente", desc: "Varredura completa em todos os tribunais superiores em milissegundos." },
    { icon: PenTool, title: "Redação Jurídica", desc: "Linguagem técnica impecável, adaptada ao estilo de cada tribunal." },
    { icon: ShieldCheck, title: "Segurança Total", desc: "Seus dados protegidos por criptografia de nível militar." },
  ];

  const pain = [
    { icon: Clock, title: "Noites em Claro", desc: "Horas perdidas formatando textos que uma IA faz em 3 segundos." },
    { icon: Zap, title: "Lentidão Fatal", desc: "Enquanto você analisa, seu concorrente já protocolou três iniciais." },
    { icon: Scale, title: "Risco de Erro", desc: "O cansaço mental é o maior inimigo da precisão jurídica." },
  ];

  const testimonials = [
    { name: "Dr. Rafael M.", role: "OAB/SP — Trabalhista", text: "Reduzi 80% do tempo em petições. Atendo o dobro de clientes sem contratar mais ninguém.", stars: 5 },
    { name: "Dra. Camila S.", role: "OAB/RJ — Civil", text: "Parecia ficção científica. Hoje é realidade no meu escritório. Indistinguível de um sênior.", stars: 5 },
    { name: "Dr. Bruno A.", role: "OAB/MG — Empresarial", text: "O investimento se pagou na primeira semana. ROI absurdo para qualquer advogado.", stars: 5 },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="noise-overlay" />

      <CheckoutModal isOpen={!!checkoutPlan} onClose={() => setCheckoutPlan(null)} plan={checkoutPlan} />

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-8 md:py-5 flex justify-between items-center transition-all duration-500 ${scrolled || mobileMenuOpen ? 'bg-bg/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_40px_rgba(0,0,0,0.4)]' : ''}`}>
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 md:w-7 md:h-7 text-accent" />
          <span className="text-xl md:text-2xl font-serif tracking-tighter uppercase">JurisAI</span>
        </div>
        <div className="hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-widest">
          {[['#pain','O Problema'],['#solution','A Solução'],['#pricing','Preços'],['#faq','FAQ']].map(([href, label]) => (
            <a key={href} href={href} className="hover:text-accent transition-colors duration-300 relative group">
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={openElite} className="hidden sm:block text-[10px] font-bold uppercase tracking-widest border-b border-accent/40 pb-0.5 hover:text-accent transition-colors">
            Acesso Imediato
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-accent">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-bg/95 backdrop-blur-xl border-b border-white/5 p-8 flex flex-col gap-6 lg:hidden"
            >
              {[['#pain','O Problema'],['#solution','A Solução'],['#pricing','Preços'],['#faq','FAQ']].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif hover:text-accent transition-colors">{label}</a>
              ))}
              <button onClick={() => { openElite(); setMobileMenuOpen(false); }} className="btn-primary w-full text-center">Acesso Imediato</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
        <div className="scanline" />
        <div className="grid-lines" />
        <Particles />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="glow w-[400px] md:w-[900px] h-[400px] md:h-[900px] bg-accent/25 top-1/4 -left-1/4" />
          <div className="glow w-[300px] md:w-[700px] h-[300px] md:h-[700px] bg-accent/15 bottom-1/4 -right-1/4" />
        </motion.div>

        <div className="relative z-10 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="inline-block text-accent text-[10px] md:text-xs font-bold uppercase mb-8"
            >
              Protocolo de Inteligência Jurídica V.2.0
            </motion.span>

            <h1 className="text-5xl md:text-8xl lg:text-[9rem] font-serif leading-[1] md:leading-[0.85] mb-10 tracking-tighter">
              A Era das Petições <br className="hidden md:block" />
              <span
                className="italic text-accent text-glitch"
                data-text="Manuais Acabou."
              >
                Manuais Acabou.
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-muted text-lg md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-light tracking-tight px-4"
          >
            <TypingEffect
              text="Enquanto você vira a noite formatando jurisprudência, nossa IA redige 5 iniciais perfeitas em segundos. O tempo não perdoa. A concorrência também não."
              delay={1400}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button onClick={openElite} className="btn-primary group w-full sm:w-auto min-w-[240px] text-base">
              Assumir o Controle
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <a href="#solution" className="btn-secondary w-full sm:w-auto min-w-[240px] text-center text-base">Ver Como Funciona</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 1 }}
            className="mt-20"
          >
            <a href="#pain" className="flex flex-col items-center gap-2 text-muted/40 hover:text-muted transition-colors">
              <span className="text-[10px] uppercase tracking-widest">Descobrir mais</span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="py-12 md:py-16 border-y border-white/5 bg-surface/20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl md:text-5xl font-serif text-accent mb-2">
                <Counter target={s.n} suffix={s.suffix} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="py-10 md:py-16 border-b border-white/5 bg-surface/10 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent z-10" />
        <div className="animate-marquee">
          {[1, 2].map(i =>
            ["JURISPRUDÊNCIA EM TEMPO REAL", "REDAÇÃO DE ELITE", "PROTOCOLO AUTOMATIZADO", "STF · STJ · TRT · TRF", "PETIÇÕES EM SEGUNDOS"].map(txt => (
              <span key={`${i}-${txt}`} className="text-2xl md:text-4xl font-serif italic text-accent/25 whitespace-nowrap tracking-tighter px-8 md:px-16">
                {txt} <span className="text-accent/15 mx-2">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── PAIN ── */}
      <section id="pain" className="py-20 md:py-32 px-4 bg-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="text-[10px] text-muted uppercase tracking-[0.3em] mb-4 inline-block">O Problema</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-10 leading-tight">
              O custo invisível de <br />
              <span className="italic text-accent">ser um advogado comum.</span>
            </h2>
            <div className="space-y-8">
              {pain.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex gap-4 md:gap-6 group"
                >
                  <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 uppercase tracking-wide">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass rounded-2xl p-6 md:p-10 relative overflow-hidden">
              <div className="scanline" />
              <div className="space-y-3 mb-8">
                {[3/4, 1, 5/6, 2/3].map((w, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${w * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className="h-2 bg-white/5 rounded"
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-accent animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-accent">JurisAI Processando...</span>
              </div>
              <div className="h-28 w-full bg-accent/5 rounded-xl border border-accent/20 flex items-center justify-center p-4">
                <span className="text-accent/60 italic font-serif text-sm text-center">
                  <TypingEffect text="Gerando Petição Inicial · Direito do Trabalho · Art. 487 CLT..." delay={800} />
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted/40">
                <span>Tempo estimado: 4 segundos</span>
                <span className="text-success">● Online</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section id="solution" className="py-20 md:py-32 px-4 bg-bg relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 inline-block"
            >
              A Solução Definitiva
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-serif"
            >
              Tecnologia que <span className="italic text-accent">Impõe Respeito.</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass p-8 rounded-3xl hover:border-accent/30 transition-all duration-500 group hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(201,169,110,0.08)]"
              >
                <div className="relative mb-6 inline-block">
                  <item.icon className="w-10 h-10 text-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-32 px-4 bg-surface/10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 inline-block">Quem já domina</span>
            <h2 className="text-4xl md:text-6xl font-serif">
              Advogados que <span className="italic text-accent">venceram primeiro.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass p-8 rounded-3xl hover:border-accent/20 transition-all duration-500 group hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-muted leading-relaxed mb-6 italic font-serif">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 md:py-32 px-4 relative overflow-hidden border-t border-white/5">
        <div className="glow w-[600px] h-[600px] bg-accent/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-serif mb-6"
            >
              Investimento <span className="italic text-accent">Estratégico.</span>
            </motion.h2>
            <p className="text-muted text-lg md:text-xl">O preço de uma hora do seu trabalho. O valor de uma vida de liberdade.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Essencial */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-8 md:p-12 rounded-3xl flex flex-col hover:border-white/10 transition-all duration-500 hover:-translate-y-1"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted mb-4">Plano Essencial</span>
              <h3 className="text-3xl md:text-4xl font-serif mb-6">6 Meses</h3>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold text-accent">R$ 897</span>
                <span className="text-muted text-sm ml-2">/semestre</span>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {["Petições Ilimitadas", "Jurisprudência STF/STJ", "Suporte Prioritário", "Setup em 24h"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-accent/50 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={openEssencial} className="btn-secondary w-full">Assinar Agora</button>
            </motion.div>

            {/* Elite */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="shimmer-border glass p-8 md:p-12 rounded-3xl border-accent/40 relative overflow-hidden flex flex-col shadow-[0_0_60px_rgba(201,169,110,0.1)] hover:-translate-y-2 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 bg-accent text-bg text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                ⚡ Mais Popular
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-4">Plano Elite</span>
              <h3 className="text-3xl md:text-4xl font-serif mb-6">12 Meses</h3>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold text-accent">R$ 1.497</span>
                <span className="text-muted text-sm ml-2">/ano</span>
                <div className="text-accent text-[10px] mt-2 font-bold uppercase tracking-widest">Até 10x sem juros no cartão</div>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {["Tudo do plano Essencial", "IA de Argumentação Avançada", "Análise de Probabilidade de Êxito", "Suporte VIP 24/7", "Newsletter Jurídica Automática"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={openElite} className="btn-primary w-full">Garantir Acesso Elite</button>
            </motion.div>
          </div>

          {/* Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex items-center justify-center gap-4 text-center"
          >
            <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
            <p className="text-sm text-muted max-w-md">
              <span className="text-ink font-bold">Garantia de 7 dias.</span> Se não ficar satisfeito, devolvemos 100% do valor sem burocracia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-32 px-4 bg-surface/10 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-14 text-center">
            Perguntas <span className="italic text-accent">Frequentes.</span>
          </h2>
          <div className="space-y-2">
            {[
              { q: "A IA substitui o trabalho do advogado?", a: "De forma alguma. O JurisAI elimina o trabalho braçal, permitindo que você se concentre na estratégia jurídica. O controle final é sempre seu." },
              { q: "As petições são aceitas pelos tribunais?", a: "Sim. A IA utiliza linguagem técnica formal e segue rigorosamente as normas da ABNT e do CPC. O texto é indistinguível de um advogado sênior." },
              { q: "Como funciona o pagamento?", a: "Aceitamos Cartão de Crédito (em até 10x sem juros) e PIX. O acesso é liberado instantaneamente após a confirmação." },
              { q: "Quanto tempo leva o setup?", a: "Setup completo em até 24h após confirmação do pagamento. Você começa a gerar petições automatizadas no mesmo dia." },
              { q: "Meus dados ficam seguros?", a: "Sim. Utilizamos criptografia de ponta a ponta e estamos em total conformidade com a LGPD. Suas estratégias e dados de clientes ficam 100% protegidos." },
            ].map((item, i) => <FAQItem key={i} question={item.q} answer={item.a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 md:py-40 px-4 relative overflow-hidden border-t border-white/5">
        <div className="glow w-[800px] h-[800px] bg-accent/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <Particles />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-serif leading-none tracking-tighter mb-8">
              O futuro não<br /><span className="italic text-accent">espera por você.</span>
            </h2>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Os advogados que adotarem IA agora vão dominar os próximos 10 anos do mercado jurídico. Os outros vão assistir.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button onClick={openElite} className="btn-primary text-lg min-w-[280px] py-5">
                Garantir Plano Elite — R$ 1.497 <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
              <button onClick={openEssencial} className="btn-secondary text-lg min-w-[220px] py-5">
                Plano 6 Meses — R$ 897
              </button>
            </div>
            <p className="mt-8 text-[10px] text-muted/40 uppercase tracking-widest">
              Vagas limitadas · Setup em 24h · Garantia de 7 dias
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 md:py-20 px-4 border-t border-white/5 bg-surface/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Scale className="w-6 h-6 text-accent" />
              <span className="text-xl font-serif tracking-tighter uppercase">JurisAI</span>
            </div>
            <p className="text-muted text-sm max-w-sm leading-relaxed">
              Liderando a revolução tecnológica no direito brasileiro. Eficiência, precisão e autoridade para advogados de elite.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-accent">Navegação</h4>
            <ul className="space-y-4 text-sm text-muted">
              {[['#pain','O Problema'],['#solution','A Solução'],['#pricing','Preços'],['#faq','FAQ']].map(([href, label]) => (
                <li key={href}><a href={href} className="hover:text-accent transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-accent">Legal</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><a href="#" className="hover:text-accent transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacidade · LGPD</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted/40">
          <span>© 2026 JurisAI Technologies. Todos os direitos reservados.</span>
          <span>São Paulo, Brasil</span>
        </div>
      </footer>
    </div>
  );
}
