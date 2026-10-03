"use client";

/* eslint-disable @next/next/no-img-element -- Precompressed responsive assets are served directly by GitHub Pages. */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, ChartNoAxesCombined, Check, Copy, FileText, Filter, GitBranch, Mail, Menu, MousePointerClick, ShieldCheck } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandMark, defaultBrandVariant, isBrandVariant, type BrandVariant } from "@/components/brand-mark";
import { sitePath } from "@/lib/site-path";

const navigation = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "approach", label: "Approach" },
  { id: "contact", label: "Contact" },
];
const sectionOrder = ["home", "work", "experience", "approach", "stack", "contact"];
const email = "Marcokorcak02@gmail.com";

export function Header() {
  const [active, setActive] = useState("home");
  const [brand, setBrand] = useState<BrandVariant>(defaultBrandVariant);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const transform = useTransform(scrollYProgress, value => "scaleX(" + value + ")");
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("mark");
    let frame = 0;
    const update = () => {
      setScrolled(window.scrollY > 30);
      let current = "home";
      for (const id of sectionOrder) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top < window.innerHeight * 0.38) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => { update(); frame = 0; });
    };
    const keyboard = () => { document.documentElement.dataset.input = "keyboard"; };
    const pointer = () => { document.documentElement.dataset.input = "pointer"; };
    const initialFrame = requestAnimationFrame(() => {
      if (isBrandVariant(requested)) setBrand(requested);
      update();
    });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("keydown", keyboard);
    window.addEventListener("pointerdown", pointer);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("keydown", keyboard);
      window.removeEventListener("pointerdown", pointer);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(initialFrame);
    };
  }, []);
  const mobileNavigation = [
    { id: "home", label: "Home" }, ...navigation.slice(0, 3),
    { id: "stack", label: "Toolkit" }, navigation[3],
  ];
  return <header className={"site-header " + (scrolled ? "is-scrolled" : "")}>
    <div className="nav-inner">
      <a href="#home" className="header-brand" aria-label="Marco Korcak — home">
        <BrandMark variant={brand} />
        <span className="brand-identity">Marco Korcak<span>Software Engineer</span></span>
      </a>
      <nav aria-label="Main navigation" className="desktop-nav">
        {navigation.map(item => <a key={item.id} href={"#" + item.id} aria-current={active === item.id ? "location" : undefined}>{item.label}</a>)}
      </nav>
      <a href="#contact" className="connect-button">Let’s connect <ArrowUpRight size={16} /></a>
      <Sheet>
        <SheetTrigger className="mobile-menu" aria-label="Open navigation"><Menu size={22} /></SheetTrigger>
        <SheetContent className="mobile-sheet">
          <SheetTitle className="menu-title">Explore</SheetTitle>
          <SheetDescription>Marco Korcak · Software Engineer</SheetDescription>
          <nav aria-label="Mobile navigation">
            {mobileNavigation.map(item => <SheetClose asChild key={item.id}>
              <a href={"#" + item.id} aria-current={active === item.id ? "location" : undefined}>{item.label}<ArrowUpRight size={18} /></a>
            </SheetClose>)}
          </nav>
          <a href={"mailto:" + email} className="button button-primary"><Mail size={17} /> Email me</a>
        </SheetContent>
      </Sheet>
    </div>
    <motion.div className="reading-progress" style={{ transform }} aria-hidden="true" />
  </header>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? true;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const transform = useTransform(scrollYProgress, value => "translateY(" + value * 48 + "px)");
  return <section ref={ref} id="home" className="hero" aria-labelledby="hero-heading">
    <motion.div className="hero-image" style={{ transform: reduced ? "none" : transform }}>
      <img src={sitePath("/images/workflow-hero.jpg")} srcSet={sitePath("/images/workflow-hero-960.jpg") + " 960w, " + sitePath("/images/workflow-hero.jpg") + " 1672w"} sizes="100vw" alt="" width="1672" height="941" fetchPriority="high" />
    </motion.div>
    <div className="hero-shade" />
    <div className="section-container hero-content">
      <div className="hero-statement">
        <h1 id="hero-heading">Engineering clarity<br />into <span>complexity.</span></h1>
        <p className="hero-description">I build full-stack applications and applied AI systems that make complex business workflows feel simple.</p>
        <div className="hero-actions">
          <a href="#work" className="button button-primary">Explore my work <ArrowRight size={18} /></a>
          <a href="#contact" className="text-link">Get in touch <ArrowUpRight size={17} /></a>
        </div>
      </div>
      <div className="hero-bottom">
        <ul className="specialty-strip" aria-label="Engineering specialties">
          <li>Full-stack engineering</li><li>Applied AI</li><li>Production workflows</li>
        </ul>
        <a href="#work" className="scroll-cue" aria-label="Scroll to selected work"><ArrowDown size={20} /></a>
      </div>
    </div>
  </section>;
}

type FlowKind = "enterprise" | "analytics";
export function Flow({ kind }: { kind: FlowKind }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.35 });
  const steps = kind === "enterprise"
    ? [{ icon: FileText, title: "Request", copy: "Describe the task" }, { icon: ShieldCheck, title: "Review", copy: "Understand the action" }, { icon: GitBranch, title: "Confirm", copy: "See the result" }]
    : [{ icon: MousePointerClick, title: "Observe", copy: "Intended impression" }, { icon: Filter, title: "Deduplicate", copy: "Guard repeat events" }, { icon: ChartNoAxesCombined, title: "Record", copy: "Cleaner engagement data" }];
  return <figure ref={ref} className={"workflow-figure " + (visible ? "is-visible" : "")}>
    <ol className="workflow-steps">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return <li key={step.title}>
          {i > 0 && <span className="flow-connector" aria-hidden="true"><span /><ArrowRight size={14} /></span>}
          <div className="workflow-step"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><strong>{step.title}</strong><span>{step.copy}</span></div>
        </li>;
      })}
    </ol>
    <figcaption>{kind === "enterprise" ? "Illustrative workflow · review before action" : "Illustrative event flow · intended impressions without duplicate records"}</figcaption>
  </figure>;
}

export function ContributionIndex({ items }: { items: { index: number; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.index ?? 0);
  useEffect(() => {
    const section = document.getElementById("work");
    const workOrder = items.map(item => item.index);
    if (!section) return;
    const stories = [...section.querySelectorAll<HTMLElement>(".work-anchor")];
    let frame = 0;
    const update = () => {
      const readingPosition = window.innerHeight * 0.38;
      const focused = document.activeElement?.closest<HTMLElement>(".work-anchor");
      let candidates: number[] = [];
      let distance = Infinity;
      stories.forEach((story, i) => {
        const rect = story.getBoundingClientRect();
        const next = Math.max(rect.top - readingPosition, readingPosition - rect.bottom, 0);
        if (next < distance - 0.5) { candidates = [workOrder[i]]; distance = next; }
        else if (Math.abs(next - distance) <= 0.5) candidates.push(workOrder[i]);
      });
      // Side-by-side stories share a reading position. Keep an explicit
      // selection until another row becomes the closest one.
      const focusedIndex = focused ? workOrder[stories.indexOf(focused)] : -1;
      const requested = Number(window.location.hash.match(/^#contribution-(\d)$/)?.[1] ?? -1);
      setActive(current => candidates.includes(focusedIndex) ? focusedIndex
        : candidates.length > 1 && candidates.includes(requested) ? requested
        : candidates.includes(current) ? current : candidates[0] ?? 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => { update(); frame = 0; });
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    section.addEventListener("focusin", schedule);
    section.addEventListener("focusout", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      section.removeEventListener("focusin", schedule);
      section.removeEventListener("focusout", schedule);
      cancelAnimationFrame(frame);
    };
  }, [items]);
  return <nav className="work-navigation" aria-label="Contribution index">{items.map(item => <a key={item.index} href={"#contribution-" + item.index} aria-current={active === item.index ? "location" : undefined} onClick={() => setActive(item.index)}>{item.title}<span className="work-nav-line" aria-hidden="true" /></a>)}</nav>;
}

function LinkedinIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.37 24H.4V7.98h4.97V24ZM2.88 5.79A2.9 2.9 0 1 1 2.9 0a2.9 2.9 0 0 1-.02 5.79ZM24 24h-4.96v-7.8c0-1.86-.04-4.26-2.6-4.26-2.6 0-3 2.03-3 4.12V24H8.48V7.98h4.76v2.19h.07c.66-1.26 2.28-2.59 4.7-2.59 5.03 0 5.99 3.3 5.99 7.59V24Z" /></svg>;
}

export function Contact() {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copyEmail = async () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied");
      timer.current = setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("Couldn’t copy. Select the address or use Email me.");
    }
  };
  return <section id="contact" className="contact-section" aria-labelledby="contact-heading">
    <div className="contact-art"><img src={sitePath("/images/glass-connection.jpg")} srcSet={sitePath("/images/glass-connection-960.jpg") + " 960w, " + sitePath("/images/glass-connection.jpg") + " 1672w"} sizes="100vw" alt="" width="1672" height="941" loading="lazy" /></div><div className="contact-shade" />
    <div className="section-container contact-content">
      <h2 id="contact-heading">Let’s build something<br /><span className="accent-heading">worth using.</span></h2>
      <p className="section-description">Interested in my work? Let’s connect.</p>
      <div className="contact-links">
        <div className="email-row">
          <a className="contact-link" href={"mailto:" + email}><Mail size={25} /><span><strong>Email me <ArrowUpRight size={16} /></strong><span>{email}</span></span></a>
          <button className="copy-email" onClick={copyEmail} aria-label="Copy email address">{status === "Email copied" ? <Check size={18} /> : <Copy size={18} />}<span>{status === "Email copied" ? "Copied" : "Copy email"}</span></button>
        </div>
        <a className="contact-link linkedin-link" href="https://www.linkedin.com/in/marco-korcak/" target="_blank" rel="noopener noreferrer"><LinkedinIcon /><span><strong>Connect on LinkedIn <ArrowUpRight size={16} /></strong><span>Marco Korcak</span></span></a>
      </div>
      <p className="copy-status" role="status" aria-live="polite">{status}</p>
    </div>
    <footer className="site-footer section-container"><a className="footer-name" href="#home"><BrandMark variant={defaultBrandVariant} /><span>Marco Korcak<span>Software Engineer</span></span></a><a href="#home" className="back-top">Back to top <ArrowDown size={16} /></a></footer>
  </section>;
}
