"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Braces, BrainCircuit, Layers3, ShieldCheck, Workflow, Code2, Mail, ContactRound as Linkedin, Plus, Menu, ExternalLink, Check, ChevronDown, Terminal, FlaskConical, PanelsTopLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandMark, defaultBrandVariant, isBrandVariant, type BrandVariant } from "@/components/brand-mark";
import { contributions, experience, education, principles, toolGroups } from "@/lib/portfolio-content";
import { sitePath } from "@/lib/site-path";

const navigation = [{ id: "home", label: "Home" }, { id: "experience", label: "Experience" }, { id: "work", label: "Work" }, { id: "approach", label: "Approach" }, { id: "stack", label: "Stack" }];
const iconMap = { workflow: Workflow, commerce: BrainCircuit, web: PanelsTopLeft, tools: Code2 };

function useMotionPreference() {
  const preference = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated ? preference : false;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useMotionPreference();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduced ? 0 : 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
function Label({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{number}</span><span className="label-line" /><span>{children}</span></div>;
}
function Header() {
  const [active, setActive] = useState("home");
  const [brand, setBrand] = useState<BrandVariant>(defaultBrandVariant);
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("mark");
    if (isBrandVariant(requested)) setBrand(requested);
  }, []);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 35 });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      setScrolled(window.scrollY > 35);
      let current = "home";
      for (const id of [...navigation.map(item => item.id), "contact"]) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top < window.innerHeight * 0.38) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(() => { update(); frame = 0; }); };
    update(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <div className="nav-inner">
      <a href="#home" className="header-brand" aria-label="Marco Korcak — home"><BrandMark variant={brand} /></a>
      <nav aria-label="Main navigation" className="desktop-nav">{navigation.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined} className={active === item.id ? "active" : ""}>{item.label}</a>)}</nav>
      <a href="#contact" className="connect-button">Let’s connect <span className="connect-spark" aria-hidden="true">✦</span></a>
      <Sheet><SheetTrigger className="mobile-menu" aria-label="Open navigation"><Menu size={23} /></SheetTrigger><SheetContent className="mobile-sheet"><SheetTitle className="menu-title">Explore</SheetTitle><SheetDescription>Marco Korcak · Software Engineer</SheetDescription><nav aria-label="Mobile navigation">{[...navigation, { id: "contact", label: "Contact" }].map((item, i) => <SheetClose asChild key={item.id}><a href={`#${item.id}`}><span>0{i + 1}</span>{item.label}</a></SheetClose>)}</nav><a href="mailto:Marcokorcak02@gmail.com" className="button button-primary"><Mail size={16} /> Get in touch</a></SheetContent></Sheet>
    </div><motion.div className="reading-progress" style={{ scaleX: progress }} aria-hidden="true" />
  </header>;
}
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 115]);
  return <section ref={ref} id="home" className="hero" aria-labelledby="hero-heading">
    <motion.div className="hero-image" style={{ y: reduced ? 0 : y }}><img src={sitePath("/images/workstation.jpg")} alt="" width="1672" height="941" fetchPriority="high" /></motion.div><div className="hero-shade" />
    <div className="hero-content"><motion.div initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}><p className="eyebrow hero-eyebrow"><span className="tiny-mark" /> MARCO KORCAK <span className="eyebrow-divider">/</span> SOFTWARE ENGINEER</p><h1 id="hero-heading">Engineering<br />clarity into<br /><span>complexity.</span></h1><p className="hero-description">I build full-stack applications and applied AI systems that make complex business workflows feel simple.</p><div className="hero-actions"><a href="#work" className="button button-primary">Explore my work <Layers3 size={16} /></a><a href="#contact" className="button button-outline"><Mail size={16} /> Get in touch</a></div></motion.div></div>
    <div className="hero-bottom"><a href="#experience" className="scroll-cue"><span className="scroll-track"><i /></span><span>SCROLL TO EXPLORE</span></a></div><div className="hero-edge" aria-hidden="true"><span>01 / 06</span><span>CRAFT. CLARITY. PURPOSE.</span></div>
  </section>;
}
function Experience() {
  return <section id="experience" className="section experience-section" aria-labelledby="experience-heading"><div className="section-container experience-layout"><Reveal className="experience-intro"><Label number="02">THE JOURNEY</Label><h2 id="experience-heading">Built through<br /><span className="muted-heading">real experience.</span></h2><p className="section-description">From customer-facing interfaces to intelligent enterprise systems. A growing scope, with the same focus on making software useful.</p><div className="education-list" aria-label="Education">{education.map(degree => <div className="education-note" key={degree.degree}><span className="education-symbol" aria-hidden="true">⌘</span><div><strong>{degree.degree}</strong>{degree.concentration && <p className="education-concentration">{degree.concentration}</p>}<p>{degree.school}<br />{degree.dates}</p></div></div>)}</div></Reveal><div className="experience-timeline">{experience.map((role, i) => <Reveal key={`${role.title}-${role.date}`} delay={i * 0.055} className={`timeline-entry ${i === 0 ? "current-role" : ""}`}><div className="timeline-node" aria-hidden="true" /><div className="role-top"><span className="role-date">{role.date}</span><span className="role-employer">{role.employer}</span></div><h3>{role.title}</h3><p className="role-team">{role.team}</p><p className="role-summary">{role.summary}</p><div className="role-tags">{role.tags.map(tag => <span key={tag}>{tag}</span>)}</div></Reveal>)}</div></div></section>;
}
function WorkCard({ item, index, onActive }: { item: typeof contributions[number]; index: number; onActive: (index: number) => void }) {
  const Icon = iconMap[item.icon as keyof typeof iconMap];
  return <motion.article className="work-card" initial={{ opacity: 0.65 }} whileInView={{ opacity: 1 }} viewport={{ amount: 0.5 }} onViewportEnter={() => onActive(index)} transition={{ duration: 0.5 }}><div className="work-card-top"><span className="work-icon"><Icon size={24} strokeWidth={1.5} /></span><span className="meta">{item.category}</span><span className="work-year">{item.year}</span></div><div className="work-card-content"><span className="work-index">0{index + 1}</span><h3>{item.title}</h3><p>{item.summary}</p><div className="work-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="work-card-footer"><span className="work-outcome"><Check size={14} />{item.outcome}</span><Dialog><DialogTrigger className="detail-button" aria-label={`Read details: ${item.title}`}><span>Behind the work</span><Plus size={17} /></DialogTrigger><DialogContent className="contribution-dialog"><div className="dialog-eyebrow"><span className="work-icon"><Icon size={22} /></span><span>{item.category} / {item.year}</span></div><DialogTitle className="contribution-title">{item.title}</DialogTitle><DialogDescription className="contribution-summary">{item.summary}</DialogDescription><div className="contribution-details">{item.details.map(detail => <div key={detail.heading}><h4>{detail.heading}</h4><p>{detail.body}</p></div>)}</div><div className="dialog-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div><p className="dialog-attribution">Professional contribution at Lowe’s.</p></DialogContent></Dialog></div></motion.article>;
}
function SelectedWork() {
  const [active, setActive] = useState(0);
  return <section id="work" className="section work-section" aria-labelledby="work-heading"><div className="section-container work-layout"><div className="work-intro"><Reveal><Label number="03">SELECTED CONTRIBUTIONS</Label><h2 id="work-heading">Complex problems.<br /><span className="accent-heading">Considered solutions.</span></h2><p className="section-description">A selection of professional work across full-stack engineering and applied AI, delivered in 2025 and 2026.</p></Reveal><div className="work-navigation" aria-label="Contribution index">{contributions.map((item, i) => <a href={`#contribution-${i}`} key={item.title} className={active === i ? "active" : ""}><span className="work-nav-number">0{i + 1}</span><span>{item.shortTitle}</span><span className="work-nav-line" /></a>)}</div><div className="work-caption"><span className="meta">THE COMMON THREAD</span><p>Own the system.<br />Understand the user.<br />Make the complexity disappear.</p></div></div><div className="work-stories">{contributions.map((item, i) => <div id={`contribution-${i}`} className="work-anchor" key={item.title}><WorkCard item={item} index={i} onActive={setActive} /></div>)}</div></div></section>;
}
function Approach() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const icons = [Layers3, ShieldCheck, BrainCircuit, FlaskConical];
  return <section id="approach" ref={ref} className="approach-section" aria-labelledby="approach-heading"><motion.div className="approach-art" style={{ y: reduced ? 0 : y }}><img src={sitePath("/images/architecture.jpg")} alt="" width="1672" height="941" loading="lazy" /></motion.div><div className="approach-shade" /><div className="section-container approach-content"><Reveal><Label number="04">HOW I THINK</Label><h2 id="approach-heading">Good engineering<br />is <span className="accent-heading">intentional.</span></h2><p className="section-description">The decisions beneath the interface matter.<br />These are the principles I bring to the work.</p></Reveal><div className="principles-grid">{principles.map((principle, i) => { const Icon = icons[i]; return <Reveal key={principle.title} delay={i * 0.075} className="principle-card"><div className="principle-top"><span className="principle-icon"><Icon size={22} strokeWidth={1.5} /></span><span>0{i + 1}</span></div><h3>{principle.title}</h3><p>{principle.description}</p><div className="principle-example">{principle.example}</div></Reveal>; })}</div></div></section>;
}
function Stack() {
  return <section id="stack" className="section stack-section" aria-labelledby="stack-heading"><div className="section-container"><div className="stack-header"><Reveal><Label number="05">THE TOOLKIT</Label><h2 id="stack-heading">The right tools.<br /><span className="muted-heading">For the right problem.</span></h2></Reveal><Reveal className="stack-description"><p>Full-stack foundations and applied AI capabilities, connected by a focus on quality and delivery.</p></Reveal></div><div className="stack-grid">{toolGroups.map((group, i) => <Reveal key={group.title} delay={i * 0.06} className="stack-card"><div className="stack-card-heading"><span>0{i + 1}</span><h3>{group.title}</h3></div><p>{group.description}</p><div className="tool-list">{group.tools.map(tool => <div className="tool-item" key={tool.name}><span className={`tool-mark ${tool.color}`} aria-hidden="true">{tool.symbol}</span><span>{tool.name}</span></div>)}</div></Reveal>)}</div></div></section>;
}
function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copyEmail = async () => { try { await navigator.clipboard.writeText("Marcokorcak02@gmail.com"); setCopied(true); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 2400); } catch { window.location.href = "mailto:Marcokorcak02@gmail.com"; } };
  return <section id="contact" className="contact-section" aria-labelledby="contact-heading"><div className="contact-art"><img src={sitePath("/images/globe.jpg")} alt="" width="1672" height="941" loading="lazy" /></div><div className="contact-shade" /><div className="section-container contact-content"><Reveal><Label number="06">LET’S CONNECT</Label><h2 id="contact-heading">Good things start<br />with a <span className="accent-heading">conversation.</span></h2><p className="section-description">Looking for someone who can connect full-stack engineering and applied AI? Let’s talk about what you’re building.</p><div className="contact-links"><a className="contact-link" href="mailto:Marcokorcak02@gmail.com"><Mail size={23} /><span><small>EMAIL</small><strong>Marcokorcak02@gmail.com</strong></span><ExternalLink size={16} /></a><a className="contact-link" href="https://www.linkedin.com/in/marco-korcak/" target="_blank" rel="noopener noreferrer"><Linkedin size={23} /><span><small>LINKEDIN</small><strong>Connect with Marco</strong></span><ExternalLink size={16} /></a></div><button className="copy-email" onClick={copyEmail}>{copied ? <Check size={14} /> : <Plus size={14} />}<span aria-live="polite">{copied ? "Email copied" : "Copy email address"}</span></button></Reveal></div><footer className="site-footer"><a className="footer-name" href="#home">Marco Korcak<span>Software Engineer</span></a><span className="footer-credit">Built with purpose. Refined with care.</span><a href="#home" className="back-top">Back to top <ChevronDown size={14} /></a></footer></section>;
}
export default function Home() {
  return <><a className="skip-link" href="#experience">Skip to experience</a><Header /><main><Hero /><div className="specialty-strip" aria-label="Engineering specialties"><span><Braces size={18} /> FULL-STACK ENGINEERING</span><span className="strip-star" aria-hidden="true">✦</span><span><BrainCircuit size={18} /> APPLIED AI</span><span className="strip-star" aria-hidden="true">✦</span><span><ShieldCheck size={18} /> RELIABLE SYSTEMS</span><span className="strip-star" aria-hidden="true">✦</span><span><Terminal size={18} /> PRODUCT THINKING</span></div><Experience /><SelectedWork /><Approach /><Stack /><Contact /></main></>;
}
