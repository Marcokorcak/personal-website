import type { Metadata } from "next";
import { BrandMark, brandOptions, defaultBrandVariant } from "@/components/brand-mark";
import { sitePath } from "@/lib/site-path";

export const metadata: Metadata = {
  title: "Logo Directions — Marco Korcak",
  description: "Eight vector logo directions to compare for Marco Korcak’s portfolio.",
  robots: { index: false, follow: false },
};

export default function BrandStudy() {
  return <main className="brand-study">
    <header className="brand-study-header"><a href={sitePath("/")}>Return to portfolio</a><span>MARCO KORCAK / BRAND DIRECTIONS</span></header>
    <div className="brand-study-intro"><p className="eyebrow">PERSONAL IDENTITY · 01—08</p><h1>A mark of <span>your own.</span></h1><p>Eight directions in the portfolio’s ivory and amber palette. Compare the larger mark and its actual header size, then preview any option on the website.</p></div>
    <div className="brand-options-grid">{brandOptions.map(option => <article key={option.id} className="brand-option" data-variant={option.id}>
      <div className="brand-option-heading"><span>{option.number}</span><h2>{option.name}</h2>{option.id === defaultBrandVariant && <span className="brand-current">CURRENT</span>}</div>
      <div className="brand-option-art"><BrandMark variant={option.id} /></div>
      <div className="brand-option-context"><BrandMark variant={option.id} /><span>Experience</span><span>Work</span><span className="brand-context-contact">Connect</span></div>
      <div className="brand-option-description"><p>{option.description}</p><a href={sitePath(`/?mark=${option.id}`)}>Preview in the header <span aria-hidden="true">+</span></a></div>
    </article>)}</div>
    <footer className="brand-study-footer"><p>Each option is a scalable vector mark. The preview changes only the logo; choose a direction before it becomes the permanent identity.</p><a href={sitePath("/")}>Return to portfolio</a></footer>
  </main>;
}
