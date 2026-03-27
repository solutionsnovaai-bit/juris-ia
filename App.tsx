/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Scale, Zap, Clock, ShieldCheck, ChevronDown, ArrowRight, 
  CheckCircle2, Search, PenTool, Cpu, X, CreditCard, QrCode, Lock
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const TypingEffect = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const startTimeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, 25);
    }, delay);
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, delay]);

  return (
    <span className="relative">
      {displayedText}
      {!isComplete && <span className="cursor-blink" />}
    </span>
  );
};

const CheckoutModal = ({ isOpen, onClose, plan }: { isOpen: boolean, onClose: () => void, plan: any }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  const copyPix = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/95 backdrop-blur-2xl"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 40, opacity: 0 }}
          className="w-full max-w-xl bg-surface border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <div className="p-6 md:p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-serif mb-2">Checkout Seguro</h2>
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest">
                  <Lock className="w-3 h-3" /> Conexão Criptografada
                </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>

            {!isSuccess ? (
              <div className="space-y-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted uppercase tracking-widest">Plano Selecionado</span>
                    <span className="text-xs text-accent font-bold uppercase tracking-widest">Alterar</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <h3 className="text-xl font-serif">JurisAI {plan.name}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-serif text-accent">R$ {plan.price?.toFixed(2)}</div>
                      <div className="text-[10px] text-muted uppercase tracking-widest">Pagamento Único</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-500 ${paymentMethod === 'card' ? 'bg-accent text-bg font-bold shadow-lg' : 'hover:bg-white/5 text-muted'}`}
                  >
                    <CreditCard className="w-5 h-5" /> <span className="text-xs uppercase tracking-widest">Cartão</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-500 ${paymentMethod === 'pix' ? 'bg-accent text-bg font-bold shadow-lg' : 'hover:bg-white/5 text-muted'}`}
                  >
                    <QrCode className="w-5 h-5" /> <span className="text-xs uppercase tracking-widest">PIX</span>
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
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
                      <select className="input-field appearance-none cursor-pointer">
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={i + 1}>{i + 1}x de R$ {(plan.price / (i + 1)).toFixed(2)} sem juros</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-center py-4 space-y-6">
                    <div className="relative w-56 h-56 bg-white mx-auto p-6 rounded-3xl shadow-inner">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=JurisAI-Payment-PIX-Code-Simulation" alt="PIX QR" className="w-full h-full" />
                      <div className="absolute inset-0 border-4 border-accent/20 rounded-3xl pointer-events-none" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted">Escaneie o QR Code ou copie a chave abaixo</p>
                      <button 
                        onClick={copyPix}
                        className="w-full py-4 bg-white/5 border border-dashed border-accent/30 rounded-xl text-accent text-xs font-bold uppercase tracking-widest hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
                      >
                        {copied ? <><CheckCircle2 className="w-4 h-4" /> Copiado!</> : 'Copiar Chave PIX'}
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="pt-6 border-t border-white/5">
                  <button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg"
                  >
                    {isProcessing ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 border-3 border-bg border-t-transparent rounded-full" />
                    ) : (
                      <>Finalizar Compra <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-muted uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-success" /> Ambiente 100% Seguro e Homologado
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-8">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}
                  className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto border border-success/20"
                >
                  <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-serif">Bem-vindo à Elite.</h3>
                  <p className="text-muted leading-relaxed max-w-xs mx-auto">Seu acesso ao JurisAI foi liberado. O futuro da sua advocacia começa agora.</p>
                </div>
                <button onClick={onClose} className="btn-primary w-full py-5 text-lg">Acessar Plataforma</button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-6">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between text-left group">
        <span className="text-lg md:text-2xl font-serif group-hover:text-accent transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-180 text-accent' : 'text-muted'}`} />
      </button>
      <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden">
        <p className="pt-4 text-muted leading-relaxed text-sm md:text-base">{answer}</p>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [checkoutPlan, setCheckoutPlan] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative min-h-screen">
      <div className="noise-overlay" />
      <CheckoutModal isOpen={!!checkoutPlan} onClose={() => setCheckoutPlan(null)} plan={checkoutPlan || {}} />
      
      <nav className={`fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-8 md:py-6 flex justify-between items-center transition-all duration-500 ${scrolled || mobileMenuOpen ? 'bg-bg/90 backdrop-blur-xl border-b border-white/5' : 'mix-blend-difference'}`}>
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 md:w-8 md:h-8 text-accent" />
          <span className="text-xl md:text-2xl font-serif tracking-tighter uppercase">JurisAI</span>
        </div>
        <div className="hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-widest">
          <a href="#pain" className="hover:text-accent transition-colors">O Problema</a>
          <a href="#solution" className="hover:text-accent transition-colors">A Solução</a>
          <a href="#pricing" className="hover:text-accent transition-colors">Preços</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCheckoutPlan({ name: 'Elite', price: 1497 })} className="hidden sm:block text-[10px] font-bold uppercase tracking-widest border-b border-accent pb-1 hover:text-accent transition-colors">
            Acesso Imediato
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-accent">
            {mobileMenuOpen ? <X /> : <Zap className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-bg border-b border-white/5 p-8 flex flex-col gap-6 lg:hidden"
            >
              <a href="#pain" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif">O Problema</a>
              <a href="#solution" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif">A Solução</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif">Preços</a>
              <button onClick={() => { setCheckoutPlan({ name: 'Elite', price: 1497 }); setMobileMenuOpen(false); }} className="btn-primary w-full text-center">Acesso Imediato</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section ref={heroRef} className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
        <div className="scanline" />
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="glow w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-accent/30 top-1/4 -left-1/4" />
          <div className="glow w-[250px] md:w-[700px] h-[250px] md:h-[700px] bg-accent/20 bottom-1/4 -right-1/4" />
        </motion.div>

        <div className="relative z-10 max-w-6xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-accent text-[10px] md:text-sm font-bold uppercase tracking-[0.5em] mb-8 animate-pulse">
              Protocolo de Inteligência Jurídica V.2.0
            </span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif leading-[1] md:leading-[0.85] mb-10 tracking-tighter">
              A Era das Petições <br className="hidden md:block" />
              <span className="italic text-accent text-glitch">Manuais Acabou.</span>
            </h1>
          </motion.div>

          <div className="text-muted text-lg md:text-3xl max-w-4xl mx-auto mb-16 leading-relaxed font-light tracking-tight px-4">
            <TypingEffect text="Enquanto você vira a noite formatando jurisprudência, nossa IA redige 5 iniciais perfeitas em segundos. O tempo não perdoa. A concorrência também não." delay={1500} />
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button onClick={() => setCheckoutPlan({ name: 'Elite', price: 1497 })} className="btn-primary group w-full sm:w-auto min-w-[240px]">
              Assumir o Controle <ArrowRight className="inline-block ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="btn-secondary w-full sm:w-auto min-w-[240px]">Ver Demonstração</button>
          </motion.div>
        </div>
      </section>

      <div className="py-12 md:py-20 border-y border-white/5 bg-surface/30 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg to-transparent z-10" />
        <div className="animate-marquee">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-12 md:gap-24 px-6 md:px-12">
              <span className="text-2xl md:text-5xl font-serif italic text-accent/40 whitespace-nowrap tracking-tighter">JURISPRUDÊNCIA EM TEMPO REAL</span>
              <div className="w-2 h-2 rounded-full bg-accent/20" />
              <span className="text-2xl md:text-5xl font-serif italic text-accent/40 whitespace-nowrap tracking-tighter">REDAÇÃO DE ELITE</span>
              <div className="w-2 h-2 rounded-full bg-accent/20" />
              <span className="text-2xl md:text-5xl font-serif italic text-accent/40 whitespace-nowrap tracking-tighter">PROTOCOLO AUTOMATIZADO</span>
              <div className="w-2 h-2 rounded-full bg-accent/20" />
            </div>
          ))}
        </div>
      </div>

      <section id="solution" className="py-20 md:py-32 px-4 bg-bg relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 inline-block">A Solução Definitiva</span>
            <h2 className="text-4xl md:text-7xl font-serif">Tecnologia que <span className="italic text-accent">Impõe Respeito.</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Busca Inteligente", desc: "Varredura completa em todos os tribunais superiores em milissegundos." },
              { icon: PenTool, title: "Redação Jurídica", desc: "Linguagem técnica impecável, adaptada ao estilo de cada tribunal." },
              { icon: ShieldCheck, title: "Segurança Total", desc: "Seus dados e estratégias protegidos por criptografia de nível militar." }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-3xl hover:border-accent/30 transition-colors group">
                <item.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pain" className="py-20 md:py-32 px-4 bg-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-7xl font-serif mb-8 leading-tight">
              O custo invisível de <br className="hidden md:block" />
              <span className="italic text-accent">ser um advogado comum.</span>
            </h2>
            <div className="space-y-6 md:space-y-8">
              {[
                { icon: Clock, title: "Noites em Claro", desc: "Horas perdidas formatando textos que uma IA faz em 3 segundos." },
                { icon: Zap, title: "Lentidão Fatal", desc: "Enquanto você analisa, seu concorrente já protocolou três iniciais." },
                { icon: Scale, title: "Risco de Erro", desc: "O cansaço mental é o maior inimigo da precisão jurídica." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 uppercase tracking-wide">{item.title}</h3>
                    <p className="text-muted text-sm md:text-base leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="relative">
            <div className="glass rounded-2xl p-6 md:p-8 aspect-square flex flex-col justify-center relative z-10">
              <div className="space-y-4">
                <div className="h-3 w-3/4 bg-white/5 rounded" />
                <div className="h-3 w-full bg-white/5 rounded" />
                <div className="h-3 w-5/6 bg-white/5 rounded" />
                <div className="pt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-accent animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">JurisAI Processando...</span>
                  </div>
                  <div className="h-24 md:h-32 w-full bg-accent/5 rounded-xl border border-accent/20 flex items-center justify-center p-4">
                    <span className="text-accent/50 italic font-serif text-sm md:text-base text-center">Gerando Petição Inicial de Alta Complexidade...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-7xl font-serif mb-6">Investimento <span className="italic text-accent">Estratégico.</span></h2>
            <p className="text-muted text-lg md:text-xl">O preço de uma hora do seu trabalho. O valor de uma vida de liberdade.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="glass p-8 md:p-12 rounded-3xl border-white/10 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted mb-4">Plano Essencial</span>
              <h3 className="text-3xl md:text-4xl font-serif mb-6">6 Meses</h3>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold text-accent">R$ 897</span>
                <span className="text-muted text-sm ml-2">/semestre</span>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {["Petições Ilimitadas", "Jurisprudência STF/STJ", "Suporte Prioritário"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-muted"><CheckCircle2 className="w-4 h-4 text-accent/50" /> {item}</li>
                ))}
              </ul>
              <button onClick={() => setCheckoutPlan({ name: 'Essencial', price: 897 })} className="btn-secondary w-full">Assinar Agora</button>
            </div>
            <div className="glass p-8 md:p-12 rounded-3xl border-accent/50 relative overflow-hidden flex flex-col shadow-[0_0_40px_rgba(201,169,110,0.1)]">
              <div className="absolute top-0 right-0 bg-accent text-bg text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl">Mais Popular</div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-4">Plano Elite</span>
              <h3 className="text-3xl md:text-4xl font-serif mb-6">12 Meses</h3>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold text-accent">R$ 1.497</span>
                <span className="text-muted text-sm ml-2">/ano</span>
                <div className="text-accent text-[10px] mt-2 font-bold uppercase tracking-widest">Até 10x sem juros</div>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {["Tudo do plano Semestral", "IA de Argumentação Avançada", "Análise de Probabilidade"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-ink"><CheckCircle2 className="w-4 h-4 text-accent" /> {item}</li>
                ))}
              </ul>
              <button onClick={() => setCheckoutPlan({ name: 'Elite', price: 1497 })} className="btn-primary w-full">Garantir Acesso Elite</button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 md:py-32 px-4 bg-surface/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-12 text-center">Perguntas <span className="italic text-accent">Frequentes.</span></h2>
          <div className="space-y-2">
            <FAQItem question="A IA substitui o trabalho do advogado?" answer="De forma alguma. O JurisAI elimina o trabalho braçal, permitindo que você se concentre na estratégia jurídica. O controle final é sempre seu." />
            <FAQItem question="As petições são aceitas pelos tribunais?" answer="Sim. A IA utiliza linguagem técnica formal e segue rigorosamente as normas da ABNT e do CPC. O texto é indistinguível de um advogado sênior." />
            <FAQItem question="Como funciona o pagamento?" answer="Aceitamos Cartão de Crédito (em até 10x sem juros) e PIX. O acesso é liberado instantaneamente após a confirmação." />
          </div>
        </div>
      </section>

      <footer className="py-12 md:py-20 px-4 border-t border-white/5 bg-bg">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Scale className="w-6 h-6 md:w-8 md:h-8 text-accent" />
              <span className="text-xl md:text-2xl font-serif tracking-tighter uppercase">JurisAI</span>
            </div>
            <p className="text-muted text-sm md:text-base max-w-sm leading-relaxed">Liderando a revolução tecnológica no direito brasileiro. Eficiência, precisão e autoridade para advogados de elite.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-accent">Navegação</h4>
            <ul className="space-y-4 text-xs md:text-sm text-muted">
              <li><a href="#pain" className="hover:text-accent transition-colors">O Problema</a></li>
              <li><a href="#solution" className="hover:text-accent transition-colors">A Solução</a></li>
              <li><a href="#pricing" className="hover:text-accent transition-colors">Preços</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-accent">Legal</h4>
            <ul className="space-y-4 text-xs md:text-sm text-muted">
              <li><a href="#" className="hover:text-accent transition-colors">Termos</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-muted/50">
          <span>© 2026 JurisAI Technologies.</span>
          <div className="flex gap-4 md:gap-8">
            <span>Elite Creative Studio</span>
            <span>São Paulo, Brasil</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
