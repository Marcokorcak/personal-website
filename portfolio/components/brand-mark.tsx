import type { SVGProps } from "react";

export const brandOptions = [
  { id: "signature", number: "01", name: "Signature", description: "The original direction: expressive italic initials with a warm accent." },
  { id: "architectural", number: "02", name: "Architectural", description: "Custom linework with a shared stem. Precise, open, and distinctly geometric." },
  { id: "framed", number: "03", name: "Framed", description: "A compact glass-like frame. A quieter, self-contained mark." },
  { id: "editorial", number: "04", name: "Editorial", description: "Elegant serif initials. Personal, assured, and slightly more classic." },
  { id: "code", number: "05", name: "Code", description: "Monospaced initials between subtle brackets, with a direct engineering connection." },
  { id: "interlock", number: "06", name: "Interlock", description: "A solid custom monogram. Strong geometry that works at very small sizes." },
  { id: "seal", number: "07", name: "Seal", description: "A circular composition with offset initials and an amber point of light." },
  { id: "wordmark", number: "08", name: "Wordmark", description: "Your full name, arranged in two lines. Clear, personal, and easy to recognize." },
] as const;

export type BrandVariant = typeof brandOptions[number]["id"];
export const defaultBrandVariant: BrandVariant = "editorial";
export function isBrandVariant(value: string | null): value is BrandVariant {
  return brandOptions.some(option => option.id === value);
}

export function BrandMark({ variant = defaultBrandVariant, className = "", ...props }: SVGProps<SVGSVGElement> & { variant?: BrandVariant }) {
  const color = "currentColor";
  const amber = "#f3ad76";
  return <svg viewBox={variant === "wordmark" ? "0 0 104 56" : "0 0 80 56"} className={`brand-mark brand-mark-${variant} ${className}`} fill="none" aria-hidden="true" {...props}>
    {variant === "signature" && <><text x="3" y="40" fill={color} fontFamily="Helvetica Neue, Arial, sans-serif" fontStyle="italic" fontSize="40" fontWeight="400" letterSpacing="-6">MK</text><circle cx="67" cy="40" r="2.3" fill={amber} /></>}
    {variant === "architectural" && <><path d="M8 42V12L24 32L40 12V42M40 29L63 12M40 29L63 42" stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" /><path d="M70 41V35" stroke={amber} strokeWidth="2.8" /></>}
    {variant === "framed" && <><path d="M61 12V47H14V9H52" stroke={color} strokeWidth="1.1" opacity=".65" /><path d="M53 9H61V17" stroke={amber} strokeWidth="1.8" /><text x="20" y="35" fill={color} fontFamily="Manrope, Arial, sans-serif" fontSize="22" fontWeight="500" letterSpacing="-2">MK</text></>}
    {variant === "editorial" && <><text x="4" y="41" fill={color} fontFamily="Georgia, Times New Roman, serif" fontSize="42" letterSpacing="-5">MK</text><path d="M8 48H27" stroke={amber} strokeWidth="1.3" /></>}
    {variant === "code" && <><path d="M9 16L2 28L9 40M71 16L78 28L71 40" stroke={amber} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><text x="16" y="38" fill={color} fontFamily="SFMono-Regular, Consolas, monospace" fontSize="28" fontWeight="400" letterSpacing="-3">MK</text></>}
    {variant === "interlock" && <><path d="M9 43V12H15L28 30L41 12H47V43H41V22L28 40L15 22V43H9Z" fill={color} /><path d="M45 28L61 12H69L52 28L70 43H62L45 29Z" fill={color} /><path d="M57 48H70" stroke={amber} strokeWidth="2" /></>}
    {variant === "seal" && <><circle cx="38" cy="28" r="22" stroke={color} strokeWidth="1" opacity=".55" /><text x="22" y="36" fill={color} fontFamily="Manrope, Arial, sans-serif" fontSize="24" fontWeight="400" letterSpacing="-3">MK</text><circle cx="54.5" cy="13.5" r="2.8" fill={amber} /></>}
    {variant === "wordmark" && <><text x="3" y="23" fill={color} fontFamily="Manrope, Arial, sans-serif" fontSize="16" fontWeight="500" letterSpacing="2">MARCO</text><text x="3" y="43" fill={color} fontFamily="Manrope, Arial, sans-serif" fontSize="16" fontWeight="500" letterSpacing="1.8">KORCAK</text><path d="M96 32V43" stroke={amber} strokeWidth="1.5" /></>}
  </svg>;
}
