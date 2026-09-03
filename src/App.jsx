import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:       #F5EDE2;
    --parchment:   #EDE3D6;
    --sand:        #E0D5C5;
    --warm-white:  #FAF4EE;
    --wine:        #4A151F;
    --wine-deep:   #4A151F;
    --slate:       #7A5060;
    --slate-mid:   #7A5060;
    --slate-pale:  #EDE3D6;
    --black-coffee:#0F0408;
    --wine-light:  #8E3347;
    --ink:         #0F0408;
    --ink-mid:     #1C0810;
    --ink-light:   #7A5060;
    --border:      rgba(74,21,31,0.18);
  }

  html { scroll-behavior: smooth; font-size: 16px; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    overflow-x: hidden;
    cursor: none;
  }

  .cursor {
    width: 12px; height: 12px;
    background: #4A151F;
    border-radius: 50%;
    position: fixed;
    top: -100px; left: -100px;
    pointer-events: none;
    z-index: 99999;
    transition: width 0.15s ease, height 0.15s ease, background 0.15s ease, opacity 0.2s ease;
    transform: translate(-50%, -50%);
    will-change: left, top;
  }

  .cursor-ring {
    width: 38px; height: 38px;
    border: 1.5px solid #4A151F;
    border-radius: 50%;
    position: fixed;
    top: -100px; left: -100px;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%, -50%);
    transition: width 0.35s cubic-bezier(0.23,1,0.32,1), height 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.35s ease, border-color 0.2s ease;
    opacity: 0;
    will-change: left, top;
  }

  .cursor-ring.ring-visible { opacity: 0.5; }

  .cursor.hero-hover { width: 7px; height: 7px; background: #4A151F; }
  .cursor-ring.hero-hover { width: 54px; height: 54px; border-color: #4A151F; opacity: 0.9; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--parchment); }
  ::-webkit-scrollbar-thumb { background: var(--wine); border-radius: 2px; }

  /* Reveal animations */
  .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity: 1; transform: none; }
  .reveal-d1 { transition-delay: 0.1s; }
  .reveal-d2 { transition-delay: 0.2s; }
  .reveal-d3 { transition-delay: 0.3s; }
  .reveal-d4 { transition-delay: 0.4s; }

  /* Page transitions */
  .page-enter { animation: pageEnter 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
  @keyframes pageEnter { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform:none; } }

  /* Float animation */
  @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  .float-anim { animation: floatY 5s ease-in-out infinite; }

  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin-slow { animation: spinSlow 20s linear infinite; }

  /* Grain overlay */
  .grain::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 999; opacity: 0.3;
  }

  input, textarea, select {
    font-family: 'DM Sans', sans-serif;
  }

  button { cursor: none; }
  a { cursor: none; }
`;

/* ─── SVG ILLUSTRATIONS ─────────────────────────────────────────── */
const ToteBagSVG = ({ size = 200, color = "#4A151F", accent = "#4A151F" }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 200 230" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <rect x="20" y="70" width="160" height="140" rx="8" fill={color} opacity="0.15" />
    <rect x="20" y="70" width="160" height="140" rx="8" stroke={color} strokeWidth="2.5" fill="none"/>
    {/* Flap detail */}
    <path d="M20 70 Q100 55 180 70" stroke={color} strokeWidth="2" fill="none"/>
    {/* Handles */}
    <path d="M65 70 Q65 30 90 28 Q110 26 110 50 L110 70" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M110 70 Q110 50 130 28 Q152 26 140 70" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Pocket line */}
    <rect x="55" y="110" width="90" height="60" rx="4" stroke={accent} strokeWidth="1.5" strokeDasharray="4 2" fill="none" opacity="0.6"/>
    {/* Logo mark */}
    <circle cx="100" cy="140" r="14" fill={accent} opacity="0.2"/>
    <text x="100" y="145" textAnchor="middle" fontSize="10" fill={accent} fontFamily="serif" opacity="0.8">T</text>
    {/* Zipper */}
    <line x1="40" y1="85" x2="160" y2="85" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    <circle cx="100" cy="85" r="3.5" fill={accent} opacity="0.7"/>
    {/* Stitching */}
    <rect x="28" y="78" width="144" height="124" rx="5" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" fill="none"/>
  </svg>
);

const BackpackSVG = ({ size = 200, color = "#4A151F", accent = "#4A151F" }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 200 230" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <rect x="30" y="50" width="140" height="165" rx="20" fill={color} opacity="0.15"/>
    <rect x="30" y="50" width="140" height="165" rx="20" stroke={color} strokeWidth="2.5" fill="none"/>
    {/* Top handle */}
    <path d="M80 50 Q80 32 100 32 Q120 32 120 50" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Straps */}
    <path d="M55 75 Q35 100 40 175" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M145 75 Q165 100 160 175" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5"/>
    {/* Strap buckles */}
    <rect x="33" y="135" width="14" height="8" rx="2" fill={accent} opacity="0.7"/>
    <rect x="153" y="135" width="14" height="8" rx="2" fill={accent} opacity="0.7"/>
    {/* Front pocket */}
    <rect x="50" y="120" width="100" height="70" rx="10" fill={accent} opacity="0.1"/>
    <rect x="50" y="120" width="100" height="70" rx="10" stroke={accent} strokeWidth="1.5" fill="none"/>
    {/* Front zipper */}
    <path d="M60 120 Q100 115 140 120" stroke={accent} strokeWidth="1.5" opacity="0.7"/>
    <circle cx="100" cy="118" r="4" fill={accent} opacity="0.8"/>
    {/* Top flap */}
    <path d="M30 75 Q100 58 170 75" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    {/* Logo */}
    <circle cx="100" cy="158" r="16" fill={accent} opacity="0.15"/>
    <text x="100" y="163" textAnchor="middle" fontSize="10" fill={accent} fontFamily="serif" opacity="0.9">T</text>
    {/* Stitching detail */}
    <rect x="38" y="58" width="124" height="149" rx="17" stroke={color} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.25" fill="none"/>
  </svg>
);

const LeafIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 4C14 4 6 8 6 16C6 20.4 9.6 24 14 24C18.4 24 22 20.4 22 16C22 8 14 4 14 4Z" stroke="#4A151F" strokeWidth="1.8" fill="none"/>
    <path d="M14 24V14M14 14C14 14 10 11 9 8" stroke="#4A151F" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const HandIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M10 14V8C10 7.1 10.9 6 12 6C13.1 6 14 7.1 14 8V14" stroke="#4A151F" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M14 10.5V8C14 7.1 14.9 6 16 6C17.1 6 18 7.1 18 8V14" stroke="#4A151F" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M18 11V9C18 8.1 18.9 7 20 7C21.1 7 22 8.1 22 9V16C22 20.4 18.4 24 14 24C9.6 24 6 20.4 6 16V14C6 13.1 6.9 12 8 12C9.1 12 10 13.1 10 14" stroke="#4A151F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 22C14 22 4 16 4 10C4 7.2 6.2 5 9 5C11 5 12.8 6.2 14 8C15.2 6.2 17 5 19 5C21.8 5 24 7.2 24 10C24 16 14 22 14 22Z" stroke="#4A151F" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
  </svg>
);

const ConvertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M6 14H22M22 14L18 10M22 14L18 18" stroke="#4A151F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 6H6C5.4 6 5 6.4 5 7V11" stroke="#4A151F" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M18 22H22C22.6 22 23 21.6 23 21V17" stroke="#4A151F" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill={filled ? "#4A151F" : "none"} stroke="#4A151F" strokeWidth="1.2">
    <path d="M7 1L8.8 5.2L13.5 5.7L10.1 8.7L11 13.5L7 11L3 13.5L3.9 8.7L0.5 5.7L5.2 5.2L7 1Z"/>
  </svg>
);

/* ─── CUSTOM CURSOR ─────────────────────────────────────────────── */
function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const raf = useRef(null);

  useEffect(() => {
    const dot = cursorRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Track mouse position
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    // Animate cursor position via RAF for smoothness
    const tick = () => {
      dot.style.left = pos.current.x + "px";
      dot.style.top  = pos.current.y + "px";
      ring.style.left = pos.current.x + "px";
      ring.style.top  = pos.current.y + "px";
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    // Hero section enter/leave — show ring
    const heroSection = document.querySelector("[data-hero-section]");

    const onHeroEnter = () => ring.classList.add("ring-visible");
    const onHeroLeave = () => ring.classList.remove("ring-visible");

    if (heroSection) {
      heroSection.addEventListener("mouseenter", onHeroEnter);
      heroSection.addEventListener("mouseleave", onHeroLeave);
    }

    // Hero CTA buttons — shrink dot + expand ring (wine colour)
    const bindCtaBtns = () => {
      document.querySelectorAll("[data-hero-cta]").forEach(btn => {
        btn.addEventListener("mouseenter", () => {
          dot.classList.add("hero-hover");
          ring.classList.add("hero-hover");
          ring.classList.add("ring-visible");
        });
        btn.addEventListener("mouseleave", () => {
          dot.classList.remove("hero-hover");
          ring.classList.remove("hero-hover");
        });
      });
    };
    bindCtaBtns();

    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      if (heroSection) {
        heroSection.removeEventListener("mouseenter", onHeroEnter);
        heroSection.removeEventListener("mouseleave", onHeroLeave);
      }
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ─── REVEAL HOOK ────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─── NAV ────────────────────────────────────────────────────────── */
function Nav({ page, setPage, cartCount, onCartOpen, onAccountOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On home page: start transparent (over photo), go solid on scroll
  // On other pages: always solid
  const atHome = page === "home";
  const transparent = atHome && !scrolled;

  const links = [
    { key: "home", label: "Home" },
    { key: "product", label: "Shop" },
    { key: "story", label: "Our Story" },
    { key: "ngo", label: "Impact" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      padding: scrolled ? "14px 48px" : "22px 48px",
      background: transparent ? "linear-gradient(180deg, rgba(10,2,5,0.7) 0%, transparent 100%)" : "rgba(245,237,226,0.97)",
      backdropFilter: transparent ? "none" : "blur(20px)",
      borderBottom: transparent ? "none" : "1px solid rgba(74,21,31,0.12)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Logo */}
      <button onClick={() => setPage("home")} style={{
        background: "none", border: "none", padding: 0,
        fontFamily: "'Playfair Display', serif", fontSize: "1.6rem",
        color: transparent ? "#F5EDE2" : "#0F0408", letterSpacing: "0.12em", fontWeight: 500,
        transition: "color 0.4s",
      }}>
        IM<span style={{ color: transparent ? "#F5EDE2" : "#4A151F", opacity: transparent ? 0.9 : 1 }}>PACKT</span>
      </button>

      {/* Desktop Links */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {links.map(l => (
          <button key={l.key} onClick={() => setPage(l.key)} style={{
            background: "none", border: "none", padding: "4px 0",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
            letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500,
            color: transparent
              ? (page === l.key ? "#F5EDE2" : "rgba(245,237,226,0.7)")
              : (page === l.key ? "#4A151F" : "#7A5060"),
            borderBottom: page === l.key
              ? `1.5px solid ${transparent ? "#F5EDE2" : "#4A151F"}`
              : "1.5px solid transparent",
            transition: "all 0.25s",
          }}>
            {l.label}
          </button>
        ))}
      </div>

      {/* Right side: Account + Cart */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Account */}
        <button onClick={onAccountOpen} title="My Account" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "40px", height: "40px",
          background: "none",
          border: `1px solid ${transparent ? "rgba(245,237,226,0.45)" : "rgba(74,21,31,0.25)"}`,
          color: transparent ? "rgba(245,237,226,0.85)" : "#1C0810",
          transition: "all 0.25s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = transparent ? "#F5EDE2" : "#4A151F"; e.currentTarget.style.color = transparent ? "#F5EDE2" : "#4A151F"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = transparent ? "rgba(245,237,226,0.45)" : "rgba(74,21,31,0.25)"; e.currentTarget.style.color = transparent ? "rgba(245,237,226,0.85)" : "#1C0810"; }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </button>

        {/* Cart */}
        <button onClick={onCartOpen} style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#0F0408", color: "#F5EDE2",
          border: "none", padding: "10px 22px",
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem",
          letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
          transition: "all 0.3s", position: "relative",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#4A151F"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#0F0408"; }}
        >
          🛍
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: "-6px", right: "-6px",
              background: "#4A151F", color: "white",
              width: "20px", height: "20px", borderRadius: "50%",
              fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700,
            }}>{cartCount}</span>
          )}
          Cart
        </button>
      </div>
    </nav>
  );
}

/* ─── CART DRAWER ────────────────────────────────────────────────── */
function CartDrawer({ open, onClose, items, onRemove, onCheckout }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 1250 ? 0 : 149;
  const total = subtotal + shipping;

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(15,4,8,0.55)",
        zIndex: 900, opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none",
        transition: "opacity 0.4s",
      }} />
      <aside style={{
        position: "fixed", top: 0, right: open ? 0 : "-480px", width: "440px",
        height: "100%", background: "#FAF4EE", zIndex: 901,
        transition: "right 0.45s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", flexDirection: "column",
        boxShadow: "-12px 0 60px rgba(15,4,8,0.18)",
      }}>
        {/* Header */}
        <div style={{ padding: "28px 32px", borderBottom: "1px solid rgba(74,21,31,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400 }}>Your Bag</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.4rem", color: "#7A5060" }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#7A5060" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🛍</div>
              <p style={{ fontSize: "0.9rem" }}>Your cart is empty</p>
            </div>
          ) : items.map(item => (
            <div key={item.cartKey} style={{ display: "flex", gap: "16px", padding: "20px 0", borderBottom: "1px solid rgba(74,21,31,0.1)" }}>
              <div style={{ width: "70px", height: "70px", background: "#EDE3D6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ToteBagSVG size={50} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "4px" }}>{item.name}</p>
                {item.color && (
                  <p style={{ fontSize: "0.76rem", color: "#4A151F", fontWeight: 500, marginBottom: "2px", letterSpacing: "0.03em" }}>{item.color}</p>
                )}
                <p style={{ fontSize: "0.8rem", color: "#7A5060" }}>Qty: {item.qty}</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#4A151F", marginTop: "4px" }}>₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
              <button onClick={() => onRemove(item.cartKey)} style={{ background: "none", border: "none", color: "#4A151F", fontSize: "1.1rem", alignSelf: "start" }}>✕</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(74,21,31,0.15)" }}>
            {/* Subtotal + Shipping rows */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.82rem", color: "#7A5060" }}>Subtotal</span>
                <span style={{ fontSize: "0.88rem", color: "#1C0810" }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.82rem", color: "#7A5060" }}>
                  Shipping
                  {shipping === 0 && <span style={{ marginLeft: "6px", fontSize: "0.7rem", color: "#0F0408", fontWeight: 600, letterSpacing: "0.06em" }}>FREE</span>}
                </span>
                <span style={{ fontSize: "0.88rem", color: shipping === 0 ? "#0F0408" : "#1C0810", fontWeight: shipping === 0 ? 600 : 400 }}>
                  {shipping === 0 ? "—" : `₹${shipping}`}
                </span>
              </div>
              <div style={{ height: "1px", background: "rgba(74,21,31,0.12)", marginBottom: "12px" }} />
            </div>

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.88rem", color: "#1C0810", fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#0F0408" }}>₹{total.toLocaleString()}</span>
            </div>

            <button onClick={onCheckout} style={{
              width: "100%", padding: "16px",
              background: "#4A151F", color: "#F5EDE2",
              border: "none", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase",
              fontWeight: 600, marginBottom: "10px",
              transition: "background 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#0F0408"}
              onMouseLeave={e => e.currentTarget.style.background = "#4A151F"}
            >
              Checkout — ₹{total.toLocaleString()}
            </button>
            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#7A5060", letterSpacing: "0.05em" }}>
              {shipping > 0 ? `Add ₹${(1250 - subtotal).toLocaleString()} more for free shipping` : "◇ Free shipping applied"}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

/* ─── HOME PAGE ─────────────────────────────────────────────────── */
function HomePage({ setPage, onAddCart }) {
  useReveal();

  const testimonials = [
    { name: "Priya M.", city: "Delhi", rating: 5, text: "Absolutely obsessed with this bag. It converts so smoothly and gets compliments everywhere I go. The quality is stunning — you can feel the care in every stitch.", avatar: "PM" },
    { name: "Anika S.", city: "Delhi", rating: 5, text: "I've tried so many bags but nothing compares. It fits my laptop perfectly as a backpack, and transforms into the most chic tote for evenings. Sustainable AND stylish.", avatar: "AS" },
    { name: "Riya K.", city: "Pune", rating: 5, text: "Knowing my purchase supports artisan women made this feel special. The bag is premium, the mission is genuine. IMPACKT is the future of conscious fashion.", avatar: "RK" },
  ];

  const avatarColors = ["#4A151F", "#0F0408", "#7A5060"];

  return (
    <div className="page-enter">
      {/* ── HERO: PHOTO BACKGROUND ──────────────────────────────── */}
      <section data-hero-section style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
        filter: "brightness(1.15) contrast(1.1) saturate(1.35) sepia(0.12)",
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        paddingTop: "80px",
      }}>
        {/* ── Warm oxblood tint — light, preserves photo vividness ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(135deg, rgba(74,21,31,0.28) 0%, rgba(74,21,31,0.08) 50%, rgba(30,8,14,0.38) 100%)" }} />

        {/* ── Radial warmth bloom — gold-tinted centre ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 48% 42%, rgba(200,168,130,0.18) 0%, rgba(142,51,71,0.12) 40%, transparent 70%)" }} />

        {/* ── Edge vignette only — very subtle ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(10,2,5,0.42) 100%)" }} />

        {/* ── Top bar only for nav ── */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "160px", pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(10,2,5,0.52) 0%, transparent 100%)" }} />

        {/* ── Bottom bar only for text ── */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "220px", pointerEvents: "none",
          background: "linear-gradient(0deg, rgba(10,2,5,0.62) 0%, transparent 100%)" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#8E3347" }} />
            <span style={{ fontSize: "0.78rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#F5EDE2", fontWeight: 600 }}>Bestseller</span>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#8E3347" }} />
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 9vw, 7.5rem)", color: "#F5EDE2", fontWeight: 500, lineHeight: 0.95, letterSpacing: "0.06em", margin: 0, textShadow: "0 4px 24px rgba(10,2,5,0.4)" }}>
            IMPACKT
          </h1>

          <p style={{ fontSize: "0.88rem", color: "rgba(245,237,226,0.65)", marginTop: "22px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 300 }}>
            The Signature Tote-Backpack · Handcrafted in Delhi
          </p>

          <div data-hero-cta style={{ marginTop: "44px", display: "flex", gap: "14px", justifyContent: "center" }}>
            <button onClick={() => setPage("product")} style={{
              background: "#F5EDE2", color: "#0F0408", border: "none",
              padding: "16px 40px", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700,
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#4A151F"; e.currentTarget.style.color = "#F5EDE2"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F5EDE2"; e.currentTarget.style.color = "#0F0408"; }}
            >Shop Now</button>
            <button onClick={() => setPage("story")} style={{
              background: "transparent", color: "#F5EDE2",
              border: "1.5px solid rgba(245,237,226,0.5)",
              padding: "16px 40px", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600,
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F5EDE2"; e.currentTarget.style.background = "rgba(245,237,226,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,237,226,0.5)"; e.currentTarget.style.background = "transparent"; }}
            >Our Story</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,237,226,0.35)" }}>Scroll</span>
          <div style={{ width: "1px", height: "32px", background: "rgba(245,237,226,0.22)" }} />
        </div>
      </section>

      {/* ── TAGLINE / CTA ────────────────────────────────────────── */}
      <section style={{
        padding: "100px 48px",
        background: "#F5EDE2",
        display: "flex", alignItems: "center", gap: "80px",
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 4.5vw, 5rem)", lineHeight: 1.06, color: "#0F0408", fontWeight: 500, marginBottom: "24px" }}>
            One Bag.
            <br /><em style={{ color: "#4A151F" }}>Two Styles.</em>
            <br />Endless
            <br />Possibilities.
          </h1>
          <p style={{ fontSize: "1rem", color: "#1C0810", lineHeight: 1.9, maxWidth: "420px", marginBottom: "40px", fontWeight: 300 }}>
            A convertible masterpiece handcrafted by skilled artisans — transitions effortlessly from a chic tote to a structured backpack, made from earth-conscious materials with every purchase empowering underprivileged communities.
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "52px" }}>
            <button data-hero-cta onClick={() => setPage("product")} style={{
              background: "#0F0408", color: "#F5EDE2", border: "none", padding: "16px 36px",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
              letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#4A151F"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0F0408"; e.currentTarget.style.transform = ""; }}
            >Shop Now</button>
            <button data-hero-cta onClick={() => setPage("story")} style={{
              background: "transparent", color: "#0F0408", border: "1.5px solid #0F0408", padding: "16px 36px",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
              letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0F0408"; e.currentTarget.style.color = "#F5EDE2"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0F0408"; }}
            >Learn Our Story</button>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: "36px" }}>
            {[["20+", "Artisans Supported"], ["40+", "Bags Crafted"], ["100%", "Eco Materials"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#4A151F", fontWeight: 500 }}>{num}</div>
                <div style={{ fontSize: "0.7rem", color: "#7A5060", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bag illustration */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "#FAF4EE", padding: "48px 40px", position: "relative",
            maxWidth: "480px", width: "100%",
            boxShadow: "0 40px 100px rgba(15,4,8,0.1)",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #4A151F, #8E3347, #4A151F)" }} />
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "24px" }}>
              <div className="float-anim" style={{ textAlign: "center" }}>
                <ToteBagSVG size={150} />
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7A5060", marginTop: "12px" }}>Tote Mode</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "36px" }}>
                <div style={{ width: "1px", height: "28px", background: "linear-gradient(to bottom, transparent, #4A151F, transparent)" }} />
                <span style={{ color: "#4A151F", fontSize: "1.2rem" }}>⟷</span>
                <div style={{ width: "1px", height: "28px", background: "linear-gradient(to bottom, transparent, #4A151F, transparent)" }} />
              </div>
              <div className="float-anim" style={{ textAlign: "center", animationDelay: "-2.5s" }}>
                <BackpackSVG size={150} />
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7A5060", marginTop: "12px" }}>Backpack Mode</div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "18px", borderTop: "1px solid rgba(74,21,31,0.15)" }}>
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "#4A151F", fontWeight: 600 }}>✦ THE IMPACKT CONVERTIBLE ✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px", background: "#0F0408" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>Why IMPACKT</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#F5EDE2", marginTop: "12px", fontWeight: 400 }}>
            Designed with <em>Purpose</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {[
            { icon: <ConvertIcon />, title: "Convertible Design", desc: "Transforms from chic tote to functional backpack in under 10 seconds. Two bags, one purchase." },
            { icon: <LeafIcon />, title: "Sustainable Materials", desc: "Crafted from sustainably sourced organic cotton. Gentle on earth, built to last." },
            { icon: <HandIcon />, title: "Handmade with Care", desc: "Every stitch placed with intention by skilled artisans who take pride in their craft." },
            { icon: <HeartIcon />, title: "NGO-Supported", desc: "15% of every sale funds skill training programs for underprivileged women and youth." },
          ].map((item, i) => (
            <div key={item.title} className={`reveal reveal-d${i + 1}`} style={{
              padding: "36px 28px", border: "1px solid rgba(245,237,226,0.1)",
              textAlign: "center", transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#4A151F"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.background = "rgba(245,237,226,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,237,226,0.1)"; e.currentTarget.style.transform = ""; e.currentTarget.style.background = ""; }}
            >
              <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", filter: "brightness(2)" }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#F5EDE2", marginBottom: "12px", fontWeight: 400 }}>{item.title}</h3>
              <p style={{ fontSize: "0.84rem", color: "rgba(245,237,226,0.6)", lineHeight: 1.8, fontWeight: 300 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUSTAINABILITY STORY ──────────────────────────────────── */}
      <section style={{ padding: "100px 48px", background: "#EDE3D6" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A882", fontWeight: 500, letterSpacing: "0.18em" }}>Our Commitment</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3.2rem)", color: "#0F0408", marginTop: "12px", fontWeight: 400 }}>
            Built to Last. <em>Made to Matter.</em>
          </h2>
          <p style={{ maxWidth: "560px", margin: "20px auto 0", color: "#1C0810", lineHeight: 1.9, fontSize: "0.95rem", fontWeight: 300 }}>
            Sustainability isn't a marketing label for us — it's the foundation every bag is built on. Here's exactly what makes IMPACKT different.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", maxWidth: "1100px", margin: "0 auto" }}>

          {/* What the bag is made of */}
          <div className="reveal" style={{ background: "#FAF4EE", padding: "40px 36px", borderTop: "3px solid #4A151F" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "16px", color: "#4A151F" }}>✦</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#0F0408", marginBottom: "16px", fontWeight: 400 }}>
              What Makes It Sustainable
            </h3>
            <p style={{ color: "#1C0810", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300, marginBottom: "20px" }}>
              Every IMPACKT bag begins with organic cotton canvas — grown without pesticides or synthetic fertilisers, using significantly less water than conventional cotton.
            </p>
            <p style={{ color: "#1C0810", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300 }}>
              Hardware is solid brass — built to outlast fast-fashion alternatives by decades. The lining is woven from recycled polyester, giving plastic waste a second life inside a product designed to be treasured, not discarded.
            </p>
          </div>

          {/* Why it's more sustainable */}
          <div className="reveal reveal-d2" style={{ background: "#FAF4EE", padding: "40px 36px", borderTop: "3px solid #4A151F" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "16px", color: "#4A151F" }}>↻</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#0F0408", marginBottom: "16px", fontWeight: 400 }}>
              The Lifecycle Advantage
            </h3>
            <p style={{ color: "#1C0810", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300, marginBottom: "20px" }}>
              A IMPACKT bag is designed to convert — not replace. One product covers two use-cases, meaning you buy less and carry more consciously. The organic canvas develops a beautiful patina over years, making each bag more personal with time rather than disposable at season's end.
            </p>
            <p style={{ color: "#1C0810", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300 }}>
              When a bag finally reaches the end of its long life, the organic cotton components are fully biodegradable. We also offer a repair programme — send it back and we'll have our artisans restore it, keeping it out of landfill indefinitely.
            </p>
          </div>

          {/* How operations are sustained */}
          <div className="reveal reveal-d3" style={{ background: "#FAF4EE", padding: "40px 36px", borderTop: "3px solid #4A151F" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "16px", color: "#4A151F" }}>◈</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#0F0408", marginBottom: "16px", fontWeight: 400 }}>
              How Our Operations Are Sustained
            </h3>
            <p style={{ color: "#1C0810", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300, marginBottom: "20px" }}>
              IMPACKT works exclusively with NGO-partnered workshops in Delhi that provide fair-wage employment, skill training, and safe working conditions for women and youth from underserved communities. Every artisan receives a living wage above the regional average — not piece-rate.
            </p>
            <p style={{ color: "#1C0810", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300 }}>
              Fifteen percent of every sale is reinvested directly into the skill-training programmes that created the workforce. This closed loop means growth in sales translates directly into more artisans trained, more livelihoods sustained, and more families lifted — not just more bags produced.
            </p>
          </div>

          {/* The numbers that matter */}
          <div className="reveal reveal-d4" style={{ background: "#0F0408", padding: "40px 36px", borderTop: "3px solid #4A151F" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "16px", color: "#4A151F" }}>◆</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#F5EDE2", marginBottom: "24px", fontWeight: 400 }}>
              The Numbers That Matter
            </h3>
            {[
              ["70%", "less water used vs conventional cotton bags"],
              
              ["15%", "of every sale funds artisan skill training"],
              ["20+", "artisans employed across partner workshops"],
            ].map(([stat, label]) => (
              <div key={stat} style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(245,237,226,0.1)" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#4A151F", fontWeight: 500, minWidth: "64px" }}>{stat}</div>
                <div style={{ fontSize: "0.84rem", color: "rgba(245,237,226,0.75)", lineHeight: 1.6, fontWeight: 300 }}>{label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px", background: "#F5EDE2" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A882", fontWeight: 500, letterSpacing: "0.18em" }}>Customer Love</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#0F0408", marginTop: "12px", fontWeight: 400 }}>
            Real Stories, <em>Real Impact</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "28px" }}>
          {testimonials.map((t, i) => (
            <div key={t.name} className={`reveal reveal-d${i + 1}`} style={{
              background: "#FAF4EE", padding: "36px 32px",
              borderLeft: "3px solid #7A5060", position: "relative",
              transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(15,4,8,0.1)"; e.currentTarget.style.borderLeftColor = "#4A151F"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderLeftColor = "#7A5060"; }}
            >
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "5rem", color: "#7A5060", position: "absolute", top: "-10px", left: "24px", lineHeight: 1, opacity: 0.7 }}>"</div>
              <div style={{ display: "flex", gap: "3px", marginBottom: "16px", marginTop: "24px" }}>
                {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= t.rating} />)}
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.02rem", color: "#1C0810", lineHeight: 1.85, marginBottom: "24px", fontWeight: 400 }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: avatarColors[i], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#7A5060" }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── REVIEW SECTION ─────────────────────────────────────────────── */
function ReviewSection() {
  const [reviews, setReviews] = useState([
    { name: "Priya M.", city: "Delhi", rating: 5, text: "Absolutely obsessed with this bag. It converts so smoothly and gets compliments everywhere I go.", date: "Mar 2026" },
    { name: "Riya K.", city: "Pune", rating: 5, text: "Knowing my purchase supports artisan women made this feel special. The quality is stunning.", date: "Feb 2026" },
  ]);
  const [form, setForm] = useState({ name: "", city: "", rating: 0, hovered: 0, text: "" });
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!form.name || !form.rating || !form.text) return;
    const now = new Date();
    const month = now.toLocaleString("default", { month: "short" });
    setReviews(prev => [{ name: form.name, city: form.city, rating: form.rating, text: form.text, date: `${month} ${now.getFullYear()}` }, ...prev]);
    setForm({ name: "", city: "", rating: 0, hovered: 0, text: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid rgba(74,21,31,0.12)" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: "#0F0408" }}>{avg}</span>
        <div>
          <div style={{ display: "flex", gap: "3px", marginBottom: "4px" }}>
            {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= Math.round(avg)} />)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#7A5060" }}>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</div>
        </div>
      </div>

      <div style={{ background: "#FAF4EE", padding: "24px", marginBottom: "28px" }}>
        <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#4A151F", marginBottom: "16px" }}>Write a Review</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your name" style={{ padding: "10px 14px", border: "1px solid rgba(74,21,31,0.2)", background: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#0F0408", outline: "none" }} />
          <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            placeholder="City (optional)" style={{ padding: "10px 14px", border: "1px solid rgba(74,21,31,0.2)", background: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#0F0408", outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "#7A5060", marginRight: "6px" }}>Your rating:</span>
          {[1,2,3,4,5].map(s => (
            <span key={s}
              onMouseEnter={() => setForm(f => ({ ...f, hovered: s }))}
              onMouseLeave={() => setForm(f => ({ ...f, hovered: 0 }))}
              onClick={() => setForm(f => ({ ...f, rating: s }))}
              style={{ cursor: "pointer", transition: "transform 0.1s", display: "inline-block", transform: (form.hovered || form.rating) >= s ? "scale(1.25)" : "scale(1)" }}>
              <StarIcon filled={(form.hovered || form.rating) >= s} />
            </span>
          ))}
        </div>
        <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
          placeholder="Share your experience with the bag..." rows={3}
          style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(74,21,31,0.2)", background: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#0F0408", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
          <button onClick={submit} style={{ background: "#0F0408", color: "#F5EDE2", border: "none", padding: "10px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
            Submit Review
          </button>
          {submitted && <span style={{ color: "#4A151F", fontSize: "0.82rem", fontWeight: 600 }}>✓ Review posted!</span>}
          {(!form.name || !form.rating || !form.text) && !submitted && <span style={{ color: "#7A5060", fontSize: "0.75rem" }}>Name, rating & text required</span>}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ borderLeft: "2px solid rgba(74,21,31,0.2)", paddingLeft: "16px" }}>
            <div style={{ display: "flex", gap: "3px", marginBottom: "6px" }}>
              {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= r.rating} />)}
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "0.9rem", color: "#1C0810", lineHeight: 1.75, margin: "0 0 8px" }}>{r.text}</p>
            <div style={{ fontSize: "0.75rem", color: "#7A5060" }}>
              <strong style={{ color: "#0F0408" }}>{r.name}</strong>{r.city ? ` · ${r.city}` : ""} · {r.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PRODUCT PAGE ──────────────────────────────────────────────── */

// Badge component
function Badge({ type }) {
  const styles = {
    "Best Seller":      { bg: "#4A151F", color: "#F5EDE2" },
    "New Arrival":      { bg: "#0F0408", color: "#F5EDE2" },
    "Limited Edition":  { bg: "#7A5060", color: "#F5EDE2" },
    "Artisan Made":     { bg: "#EDE3D6", color: "#0F0408" },
  };
  const s = styles[type] || styles["Artisan Made"];
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
      {type}
    </span>
  );
}

// Product card for the grid
function ProductCard({ product, onAddCart, onQuickView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", display: "flex", flexDirection: "column", background: "#FAF4EE", transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 24px 60px rgba(15,4,8,0.13)" : "0 4px 20px rgba(15,4,8,0.05)",
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div style={{ position: "absolute", top: "14px", left: "14px", zIndex: 2 }}>
          <Badge type={product.badge} />
        </div>
      )}

      {/* Image area */}
      <div style={{ background: product.imgBg || "#EDE3D6", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)", transform: hovered ? "scale(1.07)" : "scale(1)" }}>
          {product.Comp ? <product.Comp size={130} /> : <ToteBagSVG size={130} />}
        </div>

        {/* Quick view overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,4,8,0.55)", display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }}>
          <button onClick={() => onQuickView(product)} style={{ background: "#F5EDE2", color: "#0F0408", border: "none", padding: "10px 24px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, cursor: "none" }}>
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "0.64rem", color: "#7A5060", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>{product.category}</div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 400, color: "#0F0408", lineHeight: 1.3, marginBottom: "8px" }}>{product.name}</h3>
        <p style={{ fontSize: "0.8rem", color: "#7A5060", lineHeight: 1.65, fontWeight: 300, flex: 1, marginBottom: "16px" }}>{product.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#0F0408", fontWeight: 500 }}>₹{product.price.toLocaleString()}</span>
            {product.was && <span style={{ fontSize: "0.78rem", color: "#7A5060", textDecoration: "line-through", marginLeft: "8px" }}>₹{product.was.toLocaleString()}</span>}
          </div>
          <button onClick={() => onAddCart({ id: product.id, name: product.name, price: product.price, qty: 1, color: "Default" })}
            style={{ background: "#4A151F", color: "#F5EDE2", border: "none", padding: "9px 18px",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
              cursor: "none", transition: "background 0.25s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#0F0408"}
            onMouseLeave={e => e.currentTarget.style.background = "#4A151F"}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// Quick View modal
function QuickViewModal({ product, onClose, onAddCart }) {
  if (!product) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,4,8,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#F5EDE2", maxWidth: "680px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", fontSize: "1.3rem", color: "#7A5060", zIndex: 1, cursor: "none" }}>✕</button>
        <div style={{ background: product.imgBg || "#EDE3D6", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "320px" }}>
          {product.Comp ? <product.Comp size={180} /> : <ToteBagSVG size={180} />}
        </div>
        <div style={{ padding: "36px 32px" }}>
          {product.badge && <div style={{ marginBottom: "12px" }}><Badge type={product.badge} /></div>}
          <div style={{ fontSize: "0.64rem", color: "#7A5060", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>{product.category}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400, color: "#0F0408", lineHeight: 1.2, marginBottom: "12px" }}>{product.name}</h2>
          <p style={{ fontSize: "0.84rem", color: "#1C0810", lineHeight: 1.8, fontWeight: 300, marginBottom: "20px" }}>{product.desc}</p>
          {product.features && product.features.map(f => (
            <div key={f} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
              <span style={{ color: "#4A151F", flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: "0.8rem", color: "#1C0810", fontWeight: 300 }}>{f}</span>
            </div>
          ))}
          <div style={{ margin: "20px 0 20px", display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#0F0408" }}>₹{product.price.toLocaleString()}</span>
            {product.was && <span style={{ fontSize: "0.9rem", color: "#7A5060", textDecoration: "line-through" }}>₹{product.was.toLocaleString()}</span>}
          </div>
          <button onClick={() => { onAddCart({ id: product.id, name: product.name, price: product.price, qty: 1, color: "Default" }); onClose(); }}
            style={{ width: "100%", background: "#4A151F", color: "#F5EDE2", border: "none", padding: "14px",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.76rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, cursor: "none", transition: "background 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#0F0408"}
            onMouseLeave={e => e.currentTarget.style.background = "#4A151F"}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductPage({ onAddCart }) {
  useReveal();

  // Hero product state
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Deep Wine");
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState("desc");
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Grid state
  const [activeFilter, setActiveFilter] = useState("All");
  const [quickView, setQuickView] = useState(null);

  const views = [
    { label: "Front", bg: "linear-gradient(135deg,#EDE3D6,#E0D5C5)", Comp: BackpackSVG },
    { label: "Side",  bg: "linear-gradient(135deg,#E0D5C5,#9A8890)", Comp: ToteBagSVG },
    { label: "Open",  bg: "linear-gradient(135deg,#EDE3D6,#EDE3D6)", Comp: BackpackSVG },
    { label: "Detail",bg: "linear-gradient(135deg,#F5EDE2,#EDE3D6)", Comp: ToteBagSVG },
  ];

  const handleAdd = () => {
    onAddCart({ id: 1, name: "The Convertible Tote-Backpack", price: 1249, qty, color: selectedColor });
    setToastMsg(`${selectedColor} · ₹${(1249 * qty).toLocaleString()}`);
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  const handleGridAdd = (item) => {
    onAddCart(item);
    setToastMsg(`${item.name} added`);
    setToast(true);
    setTimeout(() => setToast(false), 2400);
  };

  const categories = ["All", "Convertible", "Tote", "Sling", "Utility", "Everyday Carry"];

  const gridProducts = [
    { id: 2, name: "The Daily Canvas Tote", category: "Tote", badge: "Artisan Made",
      desc: "Generous, unstructured, and effortlessly chic. Perfect for market runs, studio days, and everything between.", price: 899, was: 1199,
      imgBg: "linear-gradient(135deg,#EDE3D6,#E0D5C5)", Comp: ToteBagSVG,
      features: ["100% organic cotton canvas", "Magnetic snap closure", "Interior slip pocket", "Carries up to 10kg"] },
    { id: 3, name: "The Slim Sling", category: "Sling", badge: "New Arrival",
      desc: "Hands-free and effortlessly cool. Crossbody design with clean lines and surprising capacity.", price: 749,
      imgBg: "linear-gradient(135deg,#F5EDE2,#EDE3D6)", Comp: ToteBagSVG,
      features: ["Adjustable strap — wears 3 ways", "Quick-access front zip", "Compact: fits phone, wallet, keys + more"] },
    { id: 4, name: "The Utility Tote", category: "Utility", badge: "Best Seller",
      desc: "Built for those who carry their whole world. Multiple compartments keep everything exactly where you need it.", price: 1099, was: 1399,
      imgBg: "linear-gradient(135deg,#E0D5C5,#EDE3D6)", Comp: BackpackSVG,
      features: ["6 compartments + key clip", "Laptop sleeve fits 14\"", "Detachable inner pouch", "Wipe-clean base"] },
    { id: 5, name: "The Mini Convertible", category: "Convertible", badge: "Limited Edition",
      desc: "All the convertible magic of our flagship — in a compact, evening-ready size.", price: 999,
      imgBg: "linear-gradient(135deg,#EDE3D6,#F5EDE2)", Comp: BackpackSVG,
      features: ["Converts: clutch → crossbody → tote", "Brass-finish hardware", "Silk-feel recycled lining"] },
    { id: 6, name: "The Market Bag", category: "Tote", badge: "Artisan Made",
      desc: "Open-top, light as air. Folds flat in seconds. The bag you grab when you need to carry more than expected.", price: 599,
      imgBg: "linear-gradient(135deg,#F5EDE2,#E0D5C5)", Comp: ToteBagSVG,
      features: ["Folds to pocket size", "Holds 15kg", "Water-resistant exterior"] },
    { id: 7, name: "The Everyday Pack", category: "Everyday Carry", badge: "New Arrival",
      desc: "From 9am lectures to 9pm plans. A structured backpack that looks considered, never corporate.", price: 1399,
      imgBg: "linear-gradient(135deg,#E0D5C5,#F5EDE2)", Comp: BackpackSVG,
      features: ["Padded 15\" laptop sleeve", "Hidden back pocket", "Adjustable sternum strap", "Weighs only 400g"] },
    { id: 8, name: "The Belt Bag", category: "Utility", badge: "Limited Edition",
      desc: "Worn at the waist or slung across the chest. The hands-free essential for city living.", price: 699,
      imgBg: "linear-gradient(135deg,#EDE3D6,#E0D5C5)", Comp: ToteBagSVG,
      features: ["Adjustable waist/chest strap", "2 zippered compartments", "Artisan-stitched detail"] },
  ];

  const filtered = activeFilter === "All" ? gridProducts : gridProducts.filter(p => p.category === activeFilter);

  return (
    <div className="page-enter" style={{ paddingTop: "80px", background: "#F5EDE2" }}>

      {/* ── PAGE HEADER ─────────────────────────────────────────── */}
      <div style={{ padding: "48px 64px 32px", background: "#0F0408" }}>
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,237,226,0.5)", marginBottom: "8px" }}>IMPACKT</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#F5EDE2", fontWeight: 400, marginBottom: "10px" }}>The Collection</h1>
        <p style={{ fontSize: "0.85rem", color: "rgba(245,237,226,0.55)", fontWeight: 300, maxWidth: "420px" }}>Every bag handcrafted by artisan women. Designed to convert. Built to last.</p>
      </div>

      {/* ── PRODUCT DETAIL ───────────────────────────────────────── */}
      <section style={{ background: "#FAF4EE", borderBottom: "1px solid rgba(74,21,31,0.1)" }}>
        <div style={{ padding: "40px 64px 64px", display: "grid", gridTemplateColumns: "55% 1fr", gap: "72px", alignItems: "start" }}>

          {/* Gallery */}
          <div style={{ position: "sticky", top: "96px" }}>
            <div onClick={() => setZoomed(!zoomed)} className="reveal" style={{
              background: views[activeImg].bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              aspectRatio: "1", marginBottom: "14px",
              cursor: zoomed ? "zoom-out" : "zoom-in",
              overflow: "hidden", position: "relative",
              boxShadow: "0 32px 80px rgba(15,4,8,0.12)",
            }}>
              <div style={{ transform: zoomed ? "scale(1.5)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                {activeImg % 2 === 0 ? <BackpackSVG size={280} /> : <ToteBagSVG size={280} />}
              </div>
              {!zoomed && (
                <div style={{ position: "absolute", bottom: "18px", right: "18px", background: "rgba(15,4,8,0.55)", color: "white", padding: "6px 12px", fontSize: "0.66rem", letterSpacing: "0.1em" }}>
                  🔍 Zoom
                </div>
              )}
              {/* Accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #4A151F, #8E3347, #4A151F)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
              {views.map((v, i) => (
                <div key={v.label} onClick={() => { setActiveImg(i); setZoomed(false); }} style={{
                  background: v.bg, aspectRatio: "1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  border: `2px solid ${activeImg === i ? "#4A151F" : "transparent"}`,
                  transition: "border-color 0.2s, transform 0.2s",
                  transform: activeImg === i ? "scale(0.96)" : "scale(1)",
                }}>
                  {i % 2 === 0 ? <BackpackSVG size={62} /> : <ToteBagSVG size={62} />}
                </div>
              ))}
            </div>

            {/* Feature callouts */}
            <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                { icon: "↺", label: "Converts in 10s", sub: "Tote ↔ Backpack" },
                { icon: "◈", label: "Artisan Made", sub: "Nysa Foundation, Delhi" },
                { icon: "◇", label: "Eco Canvas", sub: "Organic cotton" },
                { icon: "✦", label: "325g", sub: "Ultralight design" },
              ].map(c => (
                <div key={c.label} style={{ background: "#EDE3D6", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "1.2rem", color: "#4A151F" }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0F0408" }}>{c.label}</div>
                    <div style={{ fontSize: "0.68rem", color: "#7A5060", marginTop: "2px" }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="reveal reveal-d2">
            <div style={{ fontSize: "0.7rem", color: "#4A151F", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>IMPACKT</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 400, lineHeight: 1.1, marginBottom: "16px", color: "#0F0408" }}>
              The Convertible<br />Tote-Backpack
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "3px" }}>{[1,2,3,4,5].map(s => <StarIcon key={s} filled />)}</div>
              <span style={{ fontSize: "0.78rem", color: "#7A5060" }}>5.0 · 71 reviews</span>
              <span style={{ fontSize: "0.78rem", color: "#4A151F", fontWeight: 600 }}>✓ In Stock</span>
            </div>

            <div style={{ borderTop: "1px solid rgba(74,21,31,0.15)", borderBottom: "1px solid rgba(74,21,31,0.15)", padding: "20px 0", marginBottom: "28px", display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem", color: "#0F0408" }}>₹1,249</span>
              <span style={{ fontSize: "1rem", color: "#7A5060", textDecoration: "line-through" }}>₹1,749</span>
              <span style={{ background: "#4A151F", color: "white", padding: "4px 12px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.05em" }}>SAVE 28%</span>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", marginBottom: "20px", borderBottom: "1px solid rgba(74,21,31,0.12)" }}>
              {[["desc","Description"],["features","Features"],["specs","Specs"],["care","Care"],["reviews","Reviews"]].map(([key,label]) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{
                  padding: "9px 16px", background: "none", border: "none",
                  borderBottom: `2px solid ${activeTab === key ? "#4A151F" : "transparent"}`,
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.74rem",
                  letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
                  color: activeTab === key ? "#4A151F" : "#7A5060", transition: "all 0.2s", marginBottom: "-1px",
                }}>{label}</button>
              ))}
            </div>

            <div style={{ minHeight: "160px", marginBottom: "28px" }}>
              {activeTab === "desc" && <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300 }}>IMPACKT's signature piece — a bag that redefines versatility. Hand-stitched by skilled artisans in our NGO-partnered workshop, this convertible transforms your lifestyle. Whether you're heading to a boardroom or a bazaar, it adapts with you. The organic cotton canvas ages beautifully, developing a unique patina over time.</p>}
              {activeTab === "reviews" && <ReviewSection />}
              {activeTab === "features" && (
                <div>{["Converts from tote to backpack in under 10 seconds","Organic cotton canvas","Padded laptop compartment fits up to 15\" MacBook","Adjustable, padded backpack straps","Interior zip pocket + 3 open pockets","Magnetic clasp closure","Reinforced base with copper rivets","Weighs only 325g — ultralight design","Available in 4 colourways"].map(f => (
                  <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(74,21,31,0.07)" }}>
                    <span style={{ color: "#4A151F", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "0.87rem", color: "#1C0810", fontWeight: 300 }}>{f}</span>
                  </div>
                ))}</div>
              )}
              {activeTab === "specs" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[["Dimensions","38×32×14cm"],["Weight","325g"],["Capacity","11L"],["Material","Organic Cotton"],["Lining","Recycled Polyester"],["Closure","Magnetic + YKK"],["Laptop","Up to 15\""],["Water","DWR Coated"]].map(([k,v]) => (
                    <div key={k} style={{ background: "#EDE3D6", padding: "12px 14px" }}>
                      <div style={{ fontSize: "0.65rem", color: "#7A5060", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>{k}</div>
                      <div style={{ fontWeight: 600, fontSize: "0.86rem", color: "#0F0408" }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "care" && (
                <div>{["Hand wash in cold water with mild soap","Do not machine wash or tumble dry","Air dry in shade — avoid direct sunlight","Spot clean for minor stains"].map(c => (
                  <div key={c} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(74,21,31,0.07)" }}>
                    <span style={{ color: "#4A151F" }}>◈</span>
                    <span style={{ fontSize: "0.87rem", color: "#1C0810", fontWeight: 300 }}>{c}</span>
                  </div>
                ))}</div>
              )}
            </div>

            {/* Color */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "0.73rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F0408", fontWeight: 600, marginBottom: "10px" }}>
                Colour: <span style={{ color: "#4A151F" }}>{selectedColor}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {[{ c: "#F5EDE2", n: "Pearl White" },{ c: "#0F0408", n: "Midnight Black" },{ c: "#4A151F", n: "Deep Wine" },{ c: "#9A8890", n: "Steel Grey" }].map(col => (
                  <div key={col.n} title={col.n} onClick={() => setSelectedColor(col.n)} style={{
                    width: "28px", height: "28px", borderRadius: "50%", background: col.c,
                    border: "2px solid white",
                    boxShadow: selectedColor === col.n ? "0 0 0 2.5px #4A151F" : "0 0 0 1px #E0D5C5",
                    cursor: "pointer",
                    transform: selectedColor === col.n ? "scale(1.18)" : "scale(1)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }} />
                ))}
              </div>
            </div>

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <span style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "#0F0408" }}>Qty</span>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid rgba(74,21,31,0.25)" }}>
                <button onClick={() => setQty(Math.max(1,qty-1))} style={{ width: "38px", height: "38px", background: "none", border: "none", fontSize: "1.2rem", color: "#0F0408", cursor: "none" }}>−</button>
                <span style={{ width: "44px", textAlign: "center", fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(qty+1)} style={{ width: "38px", height: "38px", background: "none", border: "none", fontSize: "1.2rem", color: "#0F0408", cursor: "none" }}>+</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <button onClick={handleAdd} style={{
                flex: 1, padding: "15px", background: "#4A151F", color: "#F5EDE2",
                border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
                letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, cursor: "none", transition: "all 0.3s",
              }} onMouseEnter={e => { e.currentTarget.style.background = "#0F0408"; }} onMouseLeave={e => { e.currentTarget.style.background = "#4A151F"; }}>
                Add to Cart
              </button>
              <button style={{
                flex: 1, padding: "15px", background: "none", color: "#4A151F",
                border: "1.5px solid #4A151F", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
                letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, cursor: "none", transition: "all 0.3s",
              }} onMouseEnter={e => { e.currentTarget.style.background = "#4A151F"; e.currentTarget.style.color = "#F5EDE2"; }}
                 onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#4A151F"; }}>
                Buy Now
              </button>
            </div>

            <div style={{ display: "flex", gap: "20px", padding: "14px 16px", background: "#EDE3D6", flexWrap: "wrap" }}>
              {["↑ Free Shipping ₹1250+", "↩ 3-Day Returns", "◇ Carbon Neutral"].map(t => (
                <span key={t} style={{ fontSize: "0.7rem", color: "#0F0408", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ── PRODUCT GRID ─────────────────────────────────────────── */}
      <section style={{ padding: "72px 64px 96px", background: "#F5EDE2" }}>
        {/* Section header */}
        <div className="reveal" style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "6px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,2.8vw,2.2rem)", fontWeight: 400, color: "#0F0408" }}>
              The Full Collection
            </h2>
            <span style={{ fontSize: "0.72rem", color: "#7A5060", letterSpacing: "0.1em", textTransform: "uppercase" }}>{filtered.length} pieces</span>
          </div>
          <div style={{ width: "48px", height: "2px", background: "#4A151F" }} />
        </div>

        {/* Category filters */}
        <div className="reveal" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "48px" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)} style={{
              padding: "8px 20px",
              background: activeFilter === cat ? "#4A151F" : "none",
              color: activeFilter === cat ? "#F5EDE2" : "#7A5060",
              border: `1px solid ${activeFilter === cat ? "#4A151F" : "rgba(74,21,31,0.2)"}`,
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
              letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
              cursor: "none", transition: "all 0.2s",
            }}
              onMouseEnter={e => { if (activeFilter !== cat) { e.currentTarget.style.borderColor = "#4A151F"; e.currentTarget.style.color = "#4A151F"; } }}
              onMouseLeave={e => { if (activeFilter !== cat) { e.currentTarget.style.borderColor = "rgba(74,21,31,0.2)"; e.currentTarget.style.color = "#7A5060"; } }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
          {filtered.map((p, i) => (
            <div key={p.id} className={`reveal reveal-d${(i % 3) + 1}`}>
              <ProductCard product={p} onAddCart={handleGridAdd} onQuickView={setQuickView} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#7A5060" }}>
            <div style={{ fontSize: "2rem", color: "#4A151F", marginBottom: "12px" }}>◇</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>No products in this category yet — more coming soon.</p>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onAddCart={handleGridAdd} />

      {/* Toast */}
      <div style={{
        position: "fixed", bottom: "32px", left: "50%", transform: `translate(-50%, ${toast ? 0 : "80px"})`,
        background: "#4A151F", color: "#F5EDE2", padding: "14px 28px",
        fontSize: "0.82rem", letterSpacing: "0.08em", zIndex: 1100,
        opacity: toast ? 1 : 0, transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: "0 12px 40px rgba(74,21,31,0.35)",
      }}>
        ✓ {toastMsg}
      </div>
    </div>
  );
}

/* ─── STORY PAGE ────────────────────────────────────────────────── */
function StoryPage({ setPage }) {
  useReveal();
  return (
    <div className="page-enter" style={{ paddingTop: "80px" }}>
      {/* Hero */}
      <div style={{
        minHeight: "70vh",
        background: "#0F0408",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        alignItems: "center", padding: "80px 48px",
      }}>
        <div>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8E3347", fontWeight: 600 }}>Our Story</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,4vw,4.5rem)", color: "#F5EDE2", marginTop: "16px", lineHeight: 1.08, fontWeight: 400 }}>
            Where Fashion<br />Meets<br /><em style={{ color: "#8E3347" }}>Conscience.</em>
          </h1>
          <p style={{ color: "rgba(245,237,226,0.75)", marginTop: "24px", lineHeight: 1.9, fontSize: "0.95rem", fontWeight: 300, maxWidth: "380px" }}>
            We believe the most beautiful things are made with intention — for the planet, and for the people who inhabit it.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "#FAF4EE", padding: "48px 40px",
            boxShadow: "40px 40px 0 rgba(142,51,71,0.2)",
            maxWidth: "380px", width: "100%",
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.4rem", color: "#4A151F", lineHeight: 1.6, marginBottom: "20px" }}>
              "What if one bag could carry your whole world — without costing the world anything?"
            </div>
            <div style={{ fontSize: "0.78rem", color: "#7A5060", textTransform: "uppercase", letterSpacing: "0.1em" }}>— Adya Gupta, Founder</div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div style={{ padding: "100px 48px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>What Drives Us</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            Mission & <em>Vision</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          {[
            { icon: "◆", title: "Our Mission", color: "#EDE3D6", accent: "#4A151F", text: "To create versatile, sustainable fashion that empowers both the wearer and the maker. Every IMPACKT bag is a bridge between conscious consumption and genuine social impact — where style and purpose are never in conflict." },
            { icon: "✦", title: "Our Vision", color: "#F5EDE2", accent: "#4A151F", text: "A world where fashion heals rather than harms — where artisan communities thrive, natural materials are celebrated, and every purchase plants seeds of positive change. We envision IMPACKT as a movement, not just a brand." },
          ].map(card => (
            <div key={card.title} className="reveal" style={{
              background: card.color, padding: "48px 40px",
              borderTop: `4px solid ${card.accent}`, transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(15,4,8,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "20px" }}>{card.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "16px", color: "#0F0408" }}>{card.title}</h3>
              <p style={{ color: "#1C0810", lineHeight: 1.9, fontSize: "0.92rem", fontWeight: 300 }}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inspiration */}
      <div style={{ background: "#FAF4EE", padding: "80px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div className="reveal">
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>The Spark</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", marginTop: "12px", marginBottom: "24px", fontWeight: 400, lineHeight: 1.2 }}>
              Born from a<br /><em>Daily Dilemma</em>
            </h2>
            <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "16px" }}>
              Adya was a student in Pune who was tired of choosing between practicality and style. Every outing meant a different bag, a different compromise. She looked around and saw the same story everywhere — cluttered cupboards, underused bags, and no single solution that worked for real life.
            </p>
            <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "16px" }}>
              While studying in Pune, she stumbled upon the Nysa Foundation — a workshop where women from marginalised communities were learning to stitch. Skilled hands with nowhere to channel their art. The idea crystallised: create one beautifully designed bag that could do it all, handmade by artisans who deserved the opportunity.
            </p>
            <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300 }}>
              A year, 47 prototypes, and countless cups of chai later — IMPACKT was born.
            </p>
          </div>
          <div className="reveal reveal-d2" style={{ position: "relative", paddingLeft: "32px" }}>
            {/* Continuous vertical line — spans full height */}
            <div style={{ position: "absolute", left: "5px", top: "5px", bottom: "5px", width: "1px", background: "rgba(74,21,31,0.2)" }} />
            {[
              { year: "2024", event: "Created a solution to the daily problem of choosing between comfort and lack of space" },
              { year: "2025 Jan", event: "First prototype created and tested" },
              { year: "2025 Dec", event: "IMPACKT launches with its first handmade bags" },
              { year: "2026", event: "Collaboration with Nysa Foundation, Delhi — led by founder Kavita Gupta — 20+ artisans supported, 40+ bags created" },
            ].map((item, i) => (
              <div key={item.year} style={{ position: "relative", marginBottom: i < 3 ? "40px" : "0", paddingLeft: "4px" }}>
                {/* Dot — positioned relative to each row */}
                <div style={{
                  position: "absolute", left: "-28px", top: "4px",
                  width: "11px", height: "11px", borderRadius: "50%",
                  background: "#4A151F", border: "2px solid #F5EDE2",
                  boxShadow: "0 0 0 1.5px #4A151F",
                  flexShrink: 0,
                }} />
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: "#4A151F", fontWeight: 600, marginBottom: "5px", letterSpacing: "0.02em" }}>{item.year}</div>
                <div style={{ fontSize: "0.87rem", color: "#1C0810", lineHeight: 1.8, fontWeight: 300 }}>{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder */}
      <div style={{ padding: "100px 48px", background: "#F5EDE2" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>From the Founder</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            A Personal <em>Message</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "64px", alignItems: "start" }}>
          <div className="reveal" style={{ position: "relative" }}>
            <div style={{
              aspectRatio: "3/4", background: "linear-gradient(145deg, #E0D5C5, #7A5060)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "6rem",
            }}>
              ◆
            </div>
            <div style={{ position: "absolute", bottom: "-16px", right: "-16px", width: "100%", height: "100%", border: "2px solid #4A151F", zIndex: -1 }} />
          </div>
          <div className="reveal reveal-d2">
            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", fontStyle: "italic", color: "#0F0408", lineHeight: 1.65, marginBottom: "28px", fontWeight: 400 }}>
              "I was a college student in Pune with too many bags and not enough answers. IMPACKT started as a question — can something beautiful also be good? Turns out, it can. It just needs intention."
            </blockquote>
            <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "18px" }}>
              When I first walked into the Nysa Foundation workshop in Delhi, I wasn't expecting to find my calling. But watching women stitch with quiet precision — women who had never been given a formal stage for their skill — I understood what IMPACKT needed to be. Not a charity. Not a corporation. Something in between, where craft and commerce could lift each other.
            </p>
            <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "18px" }}>
              Every bag we make carries the fingerprints of someone who poured real care into it. When you carry an IMPACKT bag, you're carrying their story — and honestly, I think that's what makes it the most beautiful thing in the room.
            </p>
            <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "32px" }}>
              We're early. We're small. But we're building something honest, and I'm grateful you're here for it.
            </p>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#4A151F", fontStyle: "italic" }}>Adya Gupta</div>
            <div style={{ fontSize: "0.72rem", color: "#7A5060", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Founder & Creative Director, IMPACKT</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "60px 48px", background: "#0F0408" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#F5EDE2", fontWeight: 400, marginBottom: "24px" }}>
          Ready to be part of the story?
        </h3>
        <button onClick={() => setPage("product")} style={{
          background: "#4A151F", color: "#0F0408", border: "none",
          padding: "16px 40px", fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700,
          transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F5EDE2"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#4A151F"; e.currentTarget.style.transform = ""; }}
        >
          Shop the Collection
        </button>
      </div>
    </div>
  );
}

/* ─── NGO PAGE ──────────────────────────────────────────────────── */
function NgoPage() {
  useReveal();

  const artisans = [
    { name: "Savita Devi", role: "Master Stitcher · 8 Months", quote: "This work gave me dignity. Now I teach 12 other women what I learned.", emoji: "👩‍🎨", bg: "#EDE3D6" },
    { name: "Geeta Sharma", role: "Bag Constructor · 5 Months", quote: "I used to wonder how I'd pay school fees. Now I'm saving for my daughter's college.", emoji: "👩‍💼", bg: "#EDE3D6" },
    { name: "Rani Kumari", role: "Quality Lead · 6 Months", quote: "Every bag I approve, I know will last years. That pride — nothing can replace it.", emoji: "👩‍🔬", bg: "#F5EDE2" },
  ];

  const programs = [
    { icon: "✂️", title: "Stitching Fundamentals", desc: "12-week intensive covering pattern reading, seam techniques, and precision stitching — the foundation of every IMPACKT bag.", participants: "30+ trained" },
    { icon: "🔨", title: "Bag Construction", desc: "Advanced module teaching structure, hardware installation, and professional finishing — turning skilled stitchers into bag artisans.", participants: "20+ certified" },
    { icon: "🔍", title: "Quality Control", desc: "Rigorous training in standards, inspection protocols, and the IMPACKT quality mark — ensuring every bag meets our promise.", participants: "10+ QC specialists" },
    { icon: "💼", title: "Business Literacy", desc: "Financial planning, cooperative management, and entrepreneurship workshops — empowering artisans beyond the workbench.", participants: "15+ empowered" },
  ];

  return (
    <div className="page-enter" style={{ paddingTop: "80px" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #F5EDE2 0%, #EDE3D6 45%, #EDE3D6 100%)",
        padding: "100px 48px 0", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 25% 50%, rgba(74,21,31,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(74,21,31,0.08) 0%, transparent 50%)" }} />
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>Social Impact</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,5vw,5rem)", color: "#0F0408", marginTop: "16px", lineHeight: 1.08, fontWeight: 400, position: "relative", zIndex: 1 }}>
          Crafting Change<br /><em style={{ color: "#4A151F" }}>Together</em>
        </h1>
        <p style={{ color: "#1C0810", maxWidth: "580px", margin: "24px auto 0", lineHeight: 1.9, fontSize: "1rem", fontWeight: 300 }}>
          In partnership with the Nysa Foundation in Delhi, we're not just making bags — we're building livelihoods, restoring dignity, and proving that beautiful things can come from purposeful places.
        </p>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2px", marginTop: "60px" }}>
          {[["75+", "People Trained"], ["18+", "Women Employed"], ["40+", "Bags Produced"], ["₹11L+", "Wages Paid"]].map(([num, label]) => (
            <div key={label} style={{ background: "rgba(74,21,31,0.06)", padding: "36px 24px", borderTop: "1px solid rgba(74,21,31,0.12)" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", color: "#4A151F", fontWeight: 500 }}>{num}</div>
              <div style={{ fontSize: "0.78rem", color: "#1C0810", letterSpacing: "0.08em", marginTop: "6px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: "100px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", background: "#FAF4EE" }}>
        <div className="reveal">
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>The Partnership</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", marginTop: "12px", marginBottom: "24px", fontWeight: 400, lineHeight: 1.2 }}>
            More Than a<br />Supply Chain
          </h2>
          <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "18px" }}>
            Nysa Foundation has spent over a decade working in marginalised communities across Delhi, identifying women and youth with potential and providing them real pathways to economic independence.
          </p>
          <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "18px" }}>
            IMPACKT didn't walk in with a charity model. We walked in as partners, asking: "What do your artisans need to build lasting careers?" The answer shaped everything — our production model, our quality standards, our pricing, our timelines.
          </p>
          <p style={{ color: "#1C0810", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300 }}>
            Today, every IMPACKT workshop session is co-designed with Nysa's team. Artisans receive fair wages, social security, childcare support, and a stake in the quality they deliver. This is what ethical production actually looks like.
          </p>
        </div>
        <div className="reveal reveal-d2" style={{
          background: "linear-gradient(135deg, #EDE3D6, #EDE3D6)",
          padding: "60px 48px", position: "relative",
        }}>
          <div style={{ fontSize: "4rem", textAlign: "center", marginBottom: "24px", color: "#4A151F" }}>◈</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontStyle: "italic", textAlign: "center", color: "#0F0408", lineHeight: 1.65, marginBottom: "20px" }}>
            "IMPACKT doesn't buy our labour — they invest in our people. That difference changes everything."
          </div>
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#7A5060", textTransform: "uppercase", letterSpacing: "0.1em" }}>— Prabhavati Singh, Director, Nysa Foundation</div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #4A151F, #8E3347, #4A151F)" }} />
        </div>
      </div>


      {/* ── CRAFTED WITH PURPOSE ─────────────────────────────────── */}
      <section style={{ background: "#0F0408", padding: "80px 64px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
          <div className="reveal">
            <span style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A882", fontWeight: 500, marginBottom: "12px", display: "block" }}>Our Commitment</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#F5EDE2", fontWeight: 400, lineHeight: 1.2, marginBottom: "20px" }}>
              Crafted with<br /><em>Purpose</em>
            </h2>
            <p style={{ color: "rgba(245,237,226,0.65)", fontSize: "0.9rem", lineHeight: 1.9, fontWeight: 300, marginBottom: "28px" }}>
              Every IMPACKT bag begins its life in the hands of women from underserved communities in Delhi, trained and employed through our partnership with the Nysa Foundation. What you carry is more than a bag — it's a livelihood, a skill, a story.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[{ n: "20+", l: "Artisans Employed" }, { n: "40+", l: "Bags Handcrafted" }, { n: "18+", l: "Women Trained" }, { n: "100%", l: "Organic Materials" }].map(s => (
                <div key={s.l} style={{ borderLeft: "2px solid rgba(74,21,31,0.5)", paddingLeft: "14px" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#8E3347" }}>{s.n}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(245,237,226,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal reveal-d2" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: "◈", title: "Nysa Foundation, Delhi", body: "Our production partner since 2025 — providing training, fair wages, and dignified work to women across Delhi." },
              { icon: "✦", title: "Handcrafted, Not Mass-Produced", body: "Every stitch is hand-sewn by a trained artisan. No factories. No shortcuts. Each bag takes 4–6 hours to make." },
              { icon: "◇", title: "Sustainably Sourced", body: "Organic cotton canvas, recycled linings, and brass hardware. Materials chosen for longevity, not trend cycles." },
              { icon: "↺", title: "Repair, Not Replace", body: "We stand behind every bag. Send it back, we'll restore it — keeping it out of landfill for as long as possible." },
            ].map(p => (
              <div key={p.title} style={{ padding: "18px 20px", background: "rgba(245,237,226,0.05)", borderLeft: "2px solid #4A151F", display: "flex", gap: "14px" }}>
                <span style={{ color: "#4A151F", fontSize: "1.1rem", flexShrink: 0, marginTop: "2px" }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F5EDE2", marginBottom: "4px" }}>{p.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(245,237,226,0.55)", lineHeight: 1.7, fontWeight: 300 }}>{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nysa Foundation Collaboration Gallery */}
      <div style={{ padding: "80px 48px 0", background: "#F5EDE2" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>Partnership in Action</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400, color: "#0F0408" }}>
            Adya &amp; Nysa Foundation<br /><em>— Building Together</em>
          </h2>
          <p style={{ maxWidth: "580px", margin: "18px auto 0", color: "#1C0810", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300 }}>
            From the first visit to the Delhi workshop, IMPACKT founder Adya Gupta worked side-by-side with Kavita Gupta and the women of Nysa Foundation — not as a client, but as a collaborator. These are moments from that partnership.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "16px", marginBottom: "0" }}>
          <div className="reveal" style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3", boxShadow: "0 32px 80px rgba(15,4,8,0.18)" }}>
            <img src="/images/story.jpg" alt="Adya Gupta and artisan at Nysa Foundation workshop"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", filter: "brightness(1.05) contrast(1.06) saturate(1.1)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(0deg, rgba(15,4,8,0.82) 0%, transparent 100%)", padding: "32px 28px 22px" }}>
              <div style={{ fontSize: "0.66rem", color: "#C8A882", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>Nysa Foundation, Delhi · 2025</div>
              <div style={{ fontSize: "0.88rem", color: "#F5EDE2", fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Adya guiding an artisan through bag construction</div>
            </div>
            <div style={{ position: "absolute", top: "16px", left: "16px", background: "#4A151F", color: "#F5EDE2", padding: "4px 12px", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Workshop Visit</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Artisan smiling at the workshop", tag: "Nysa Foundation Team" },
              { label: "Bags being assembled by hand", tag: "Production · Delhi" },
            ].map((ph, i) => (
              <div key={i} className="reveal" style={{ flex: 1, background: "linear-gradient(135deg, #EDE3D6, #E0D5C5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", position: "relative", overflow: "hidden", boxShadow: "0 16px 40px rgba(15,4,8,0.1)" }}>
                <div style={{ fontSize: "2rem", opacity: 0.25, color: "#4A151F" }}>◆</div>
                <div style={{ fontSize: "0.68rem", color: "#7A5060", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", padding: "0 24px" }}>{ph.label}</div>
                <div style={{ position: "absolute", top: "12px", right: "12px", fontSize: "0.58rem", color: "rgba(74,21,31,0.38)", letterSpacing: "0.08em" }}>Photo Coming Soon</div>
                <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(74,21,31,0.1)", color: "#4A151F", padding: "3px 10px", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em" }}>{ph.tag}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal" style={{ background: "#0F0408", padding: "48px 64px", display: "flex", gap: "40px", alignItems: "center" }}>
          <div style={{ width: "3px", background: "#4A151F", alignSelf: "stretch", flexShrink: 0 }} />
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(1.05rem,1.8vw,1.4rem)", color: "#F5EDE2", lineHeight: 1.75, marginBottom: "16px" }}>
              "Walking into that workshop for the first time and watching these women stitch with such precision — I knew IMPACKT had to be built around them, not just with them."
            </p>
            <div style={{ fontSize: "0.7rem", color: "#C8A882", letterSpacing: "0.14em", textTransform: "uppercase" }}>— Adya Gupta, Founder · IMPACKT</div>
          </div>
        </div>
      </div>

            {/* Training Programs */}
      <div style={{ padding: "100px 48px", background: "#F5EDE2" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>Skill Development</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            Training <em>Programs</em>
          </h2>
          <p style={{ maxWidth: "520px", margin: "16px auto 0", color: "#1C0810", lineHeight: 1.8, fontSize: "0.9rem", fontWeight: 300 }}>Four distinct pathways, each designed to build real, marketable expertise — not just short-term employment.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
          {programs.map((p, i) => (
            <div key={p.title} className={`reveal reveal-d${i + 1}`} style={{
              padding: "36px 24px", border: "1px solid rgba(74,21,31,0.18)",
              textAlign: "center", background: "#FAF4EE", transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#4A151F"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(74,21,31,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(74,21,31,0.18)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ fontSize: "2.8rem", marginBottom: "16px" }}>{p.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 400, marginBottom: "12px" }}>{p.title}</h3>
              <p style={{ color: "#1C0810", fontSize: "0.82rem", lineHeight: 1.8, fontWeight: 300, marginBottom: "16px" }}>{p.desc}</p>
              <div style={{ display: "inline-block", background: "#EDE3D6", color: "#4A151F", padding: "4px 14px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em" }}>{p.participants}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Behind the Scenes — Flip Cards */}
      <div style={{ padding: "80px 48px", background: "#0F0408" }}>
        <style>{`
          .flip-card { perspective: 1000px; }
          .flip-inner {
            position: relative; width: 100%; height: 100%;
            transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
            transform-style: preserve-3d;
          }
          .flip-card:hover .flip-inner { transform: rotateY(180deg); }
          .flip-front, .flip-back {
            position: absolute; inset: 0;
            backface-visibility: hidden; -webkit-backface-visibility: hidden;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            overflow: hidden;
          }
          .flip-back { transform: rotateY(180deg); }
          .flip-back-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(0deg, rgba(15,4,8,0.75) 0%, rgba(15,4,8,0.1) 55%, transparent 100%);
            display: flex; align-items: flex-end; padding: 14px;
          }
        `}</style>

        <div className="reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A882", fontWeight: 500 }}>Behind the Scenes</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", color: "#F5EDE2", marginTop: "12px", fontWeight: 400 }}>
            Where Every Bag <em>Begins</em>
          </h2>
          <p style={{ fontSize: "0.78rem", color: "rgba(245,237,226,0.38)", marginTop: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Hover each card to see inside</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px", height: "340px" }}>
          {[
            {
              label: "Pattern Cutting", emoji: "🧵",
              front: "linear-gradient(135deg,#4A151F,#6B2030)",
              backImg: "/images/craft-pattern.jpg",
              backLabel: "Precision layouts, every cut planned"
            },
            {
              label: "Precision Stitching", emoji: "🪡",
              front: "linear-gradient(135deg,#6B2030,#8E3347)",
              backImg: "/images/story.jpg",
              backLabel: "Adya working with artisans at the Delhi workshop"
            },
            {
              label: "Fabric Selection", emoji: "✂️",
              front: "linear-gradient(135deg,#4A151F,#1C0810)",
              backImg: null,
              backLabel: "Only organic, ethically sourced canvas"
            },
            {
              label: "Hardware Assembly", emoji: "🔨",
              front: "linear-gradient(135deg,#1C0810,#4A151F)",
              backImg: null,
              backLabel: "Brass fittings, copper rivets — built to last"
            },
            {
              label: "Quality Inspection", emoji: "🔍",
              front: "linear-gradient(135deg,#7A5060,#0F0408)",
              backImg: null,
              backLabel: "Every bag checked before it leaves"
            },
          ].map((item, i) => (
            <div key={item.label} className="flip-card reveal" style={{ height: "100%" }}>
              <div className="flip-inner" style={{ height: "100%" }}>
                {/* Front face */}
                <div className="flip-front" style={{ background: item.front }}>
                  <div style={{ fontSize: "2.6rem", marginBottom: "14px" }}>{item.emoji}</div>
                  <div style={{ fontSize: "0.67rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,237,226,0.9)", fontWeight: 700, textAlign: "center", padding: "0 10px" }}>{item.label}</div>
                  <div style={{ marginTop: "12px", fontSize: "0.58rem", color: "rgba(245,237,226,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Hover →</div>
                </div>
                {/* Back face */}
                <div className="flip-back" style={{ background: "#1C0810" }}>
                  {item.backImg
                    ? <img src={item.backImg} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#1C0810,#4A151F)", gap: "12px" }}>
                        <div style={{ fontSize: "2.6rem" }}>{item.emoji}</div>
                        <div style={{ fontSize: "0.67rem", color: "rgba(245,237,226,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", padding: "0 12px" }}>Photo Coming Soon</div>
                      </div>
                  }
                  <div className="flip-back-overlay">
                    <span style={{ fontSize: "0.67rem", color: "rgba(245,237,226,0.88)", fontWeight: 500, letterSpacing: "0.05em" }}>{item.backLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

            {/* Meet the Artisans */}
      <div style={{ padding: "100px 48px", background: "#F5EDE2" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>Human Stories</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            Meet the <em>Artisans</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "28px" }}>
          {artisans.map((a, i) => (
            <div key={a.name} className={`reveal reveal-d${i + 1}`} style={{
              background: "#FAF4EE", overflow: "hidden", transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(15,4,8,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ background: a.bg, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4.5rem" }}>{a.emoji}</div>
              <div style={{ padding: "24px 28px" }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 400, marginBottom: "4px" }}>{a.name}</h4>
                <div style={{ fontSize: "0.7rem", color: "#4A151F", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "14px" }}>{a.role}</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1rem", color: "#1C0810", lineHeight: 1.75 }}>"{a.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Created */}
      <div style={{ padding: "80px 48px", background: "linear-gradient(135deg, #EDE3D6, #F5EDE2)" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>By the Numbers</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            Social Impact <em>Created</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "28px" }}>
          {[
            { icon: "👩‍🏫", num: "75+", label: "People Trained", sub: "Across 3 districts in Delhi NCR" },
            { icon: "👩", num: "18+", label: "Women Employed", sub: "78% first-time earners in their families" },
            { icon: "👜", num: "40+", label: "Bags Crafted", sub: "Each traceable to its artisan" },
            { icon: "💰", num: "₹11L+", label: "Wages Distributed", sub: "30% above regional market rate" },
            { icon: "🎓", num: "96%", label: "Skill Graduation Rate", sub: "Among enrolled trainees" },
            { icon: "◇", num: "100%", label: "Sustainable Materials", sub: "Ethically sourced & certified" },
          ].map((stat, i) => (
            <div key={stat.label} className={`reveal`} style={{
              background: "#FAF4EE", padding: "36px 28px", textAlign: "center",
              borderBottom: "3px solid #7A5060", transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderBottomColor = "#4A151F"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,4,8,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderBottomColor = "#7A5060"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{stat.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: "#4A151F", fontWeight: 500 }}>{stat.num}</div>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0F0408", marginTop: "8px" }}>{stat.label}</div>
              <div style={{ fontSize: "0.75rem", color: "#7A5060", marginTop: "6px", lineHeight: 1.5 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CONTACT PAGE ──────────────────────────────────────────────── */
function ContactPage() {
  useReveal();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(null);

  const faqs = [
    { q: "What materials are used in IMPACKT bags?", a: "All our bags use organic cotton canvas, recycled polyester lining, and brass hardware. Every material is carefully sourced for quality and environmental responsibility." },
    { q: "How does the tote-to-backpack conversion work?", a: "It's a simple, elegant mechanism — hidden straps unfold from a concealed zipper compartment on the back panel. The transformation takes under 10 seconds and requires no clips or complicated adjustments." },
    { q: "Do you ship internationally?", a: "Yes! We ship to 28 countries. International orders typically arrive in 10–14 business days. Shipping is free on all orders above ₹5,000 (or equivalent)." },
    { q: "What is your return/exchange policy?", a: "We offer 3-day free returns on all unused bags in original condition. For exchanges, we cover return shipping. We want you to love your IMPACKT bag completely." },
    { q: "Can I visit the artisan workshop?", a: "We host quarterly 'Open Workshop' days in partnership with Nysa Foundation. Sign up for our newsletter to get early access to upcoming workshop visit dates." },
    { q: "Is my purchase making a real difference?", a: "Absolutely. 15% of every sale funds training wages, 5% goes to raw material support for artisans, and we publish an annual impact report with full transparency on where every rupee goes." },
  ];

  return (
    <div className="page-enter" style={{ paddingTop: "80px" }}>
      <div style={{ padding: "80px 48px 40px", textAlign: "center", background: "#FAF4EE", borderBottom: "1px solid rgba(74,21,31,0.15)" }}>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>Get in Touch</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,4vw,3.8rem)", color: "#0F0408", marginTop: "12px", fontWeight: 400 }}>
          We'd Love to <em>Hear</em> From You
        </h1>
        <p style={{ color: "#1C0810", maxWidth: "480px", margin: "16px auto 0", lineHeight: 1.85, fontSize: "0.92rem", fontWeight: 300 }}>
          Questions, collaborations, press inquiries, or just want to say hello — our team typically responds within 24 hours.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Form */}
        <div style={{ padding: "60px 48px", background: "#FAF4EE" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 400, marginBottom: "32px" }}>Send a Message</h2>

          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>◆</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400, marginBottom: "12px" }}>Message Received!</h3>
              <p style={{ color: "#1C0810", fontSize: "0.9rem", fontWeight: 300 }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div>
              {[["name", "Your Name", "text"], ["email", "Email Address", "email"], ["subject", "Subject", "text"]].map(([key, label, type]) => (
                <div key={key} style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1C0810", fontWeight: 600, marginBottom: "8px" }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{
                    width: "100%", padding: "13px 16px",
                    border: "1.5px solid rgba(74,21,31,0.22)", background: "#F5EDE2",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#0F0408",
                    outline: "none", transition: "border-color 0.25s",
                  }}
                    onFocus={e => e.target.style.borderColor = "#4A151F"}
                    onBlur={e => e.target.style.borderColor = "rgba(74,21,31,0.22)"}
                  />
                </div>
              ))}
              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1C0810", fontWeight: 600, marginBottom: "8px" }}>Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} style={{
                  width: "100%", padding: "13px 16px",
                  border: "1.5px solid rgba(74,21,31,0.22)", background: "#F5EDE2",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#0F0408",
                  resize: "vertical", outline: "none", transition: "border-color 0.25s",
                }}
                  onFocus={e => e.target.style.borderColor = "#4A151F"}
                  onBlur={e => e.target.style.borderColor = "rgba(74,21,31,0.22)"}
                />
              </div>
              <button onClick={() => setSent(true)} style={{
                width: "100%", padding: "16px",
                background: "#4A151F", color: "#F5EDE2",
                border: "none", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600,
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0F0408"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#4A151F"; }}
              >
                Send Message
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "60px 48px", background: "#0F0408", color: "#F5EDE2" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 400, color: "#F5EDE2", marginBottom: "40px" }}>Contact Info</h2>

          {[
            { icon: "📧", title: "Email Us", info: "helloimpackt.in@gmail.com", sub: "We respond within 24 hours" },
            { icon: "📍", title: "Studio", info: "New Delhi", sub: "Visits by appointment" },
            { icon: "📞", title: "WhatsApp", info: "+91 83838 18695", sub: "Mon–Sat, 10am–6pm IST" },
          ].map(item => (
            <div key={item.title} style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
              <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "#4A151F", marginBottom: "6px" }}>{item.title}</h4>
                <p style={{ color: "#F5EDE2", fontSize: "0.92rem", marginBottom: "3px" }}>{item.info}</p>
                <p style={{ color: "rgba(245,237,226,0.55)", fontSize: "0.78rem" }}>{item.sub}</p>
              </div>
            </div>
          ))}

          <div style={{ borderTop: "1px solid rgba(245,237,226,0.12)", paddingTop: "32px", marginTop: "8px" }}>
            <div style={{ fontSize: "0.72rem", color: "#4A151F", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>Follow Our Journey</div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={{ background: "rgba(245,237,226,0.08)", border: "1px solid rgba(245,237,226,0.15)", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,237,226,0.15)"; e.currentTarget.style.borderColor = "#4A151F"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,237,226,0.08)"; e.currentTarget.style.borderColor = "rgba(245,237,226,0.15)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#F5EDE2" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="4.5" stroke="#F5EDE2" strokeWidth="1.8"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="#F5EDE2"/>
                </svg>
                <span style={{ color: "rgba(245,237,226,0.85)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 500 }}>Instagram</span>
              </button>
              <button style={{ background: "rgba(245,237,226,0.08)", border: "1px solid rgba(245,237,226,0.15)", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,237,226,0.15)"; e.currentTarget.style.borderColor = "#4A151F"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,237,226,0.08)"; e.currentTarget.style.borderColor = "rgba(245,237,226,0.15)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5 6.2a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.2a2.8 2.8 0 0 0-2 2C1.3 7.8 1.3 12 1.3 12s0 4.2.2 5.8a2.8 2.8 0 0 0 2 2C5.1 20 12 20 12 20s6.9 0 8.5-.2a2.8 2.8 0 0 0 2-2c.2-1.6.2-5.8.2-5.8s0-4.2-.2-5.8z" stroke="#F5EDE2" strokeWidth="1.8"/>
                  <polygon points="9.8,15.5 15.8,12 9.8,8.5" fill="#F5EDE2"/>
                </svg>
                <span style={{ color: "rgba(245,237,226,0.85)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 500 }}>YouTube</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: "80px 48px", background: "#EDE3D6" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>FAQ</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", marginTop: "12px", fontWeight: 400 }}>
            Common <em>Questions</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "900px", margin: "0 auto" }}>
          {faqs.map((faq, i) => (
            <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{
              background: "#FAF4EE", padding: "24px 28px",
              borderLeft: `3px solid ${open === i ? "#4A151F" : "#7A5060"}`,
              cursor: "pointer", transition: "all 0.3s",
              boxShadow: open === i ? "0 8px 32px rgba(15,4,8,0.08)" : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#0F0408", lineHeight: 1.5 }}>{faq.q}</div>
                <span style={{ color: "#4A151F", flexShrink: 0, fontSize: "1.1rem", transition: "transform 0.3s", transform: open === i ? "rotate(45deg)" : "" }}>+</span>
              </div>
              {open === i && <p style={{ color: "#1C0810", fontSize: "0.84rem", lineHeight: 1.85, marginTop: "14px", fontWeight: 300, borderTop: "1px solid rgba(74,21,31,0.1)", paddingTop: "14px" }}>{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SHIPPING & RETURNS PAGE ────────────────────────────────────── */
function ShippingPage() {
  useReveal();
  const [activeTab, setActiveTab] = useState("shipping");

  return (
    <div style={{ minHeight: "100vh", background: "#F5EDE2", paddingTop: "100px" }}>
      <div style={{ background: "#0F0408", padding: "60px 48px 48px", textAlign: "left", paddingLeft: "72px" }}>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>Policies</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "#F5EDE2", fontWeight: 400, margin: "12px 0 0" }}>Shipping & Returns</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center", background: "#FAF4EE", borderBottom: "1px solid rgba(74,21,31,0.12)" }}>
        {[["shipping", "Shipping Policy"], ["returns", "Return Policy"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            background: "none", border: "none", borderBottom: activeTab === key ? "2.5px solid #4A151F" : "2.5px solid transparent",
            padding: "18px 36px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
            letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
            color: activeTab === key ? "#4A151F" : "#7A5060", transition: "all 0.25s", cursor: "none",
          }}>{label}</button>
        ))}
      </div>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 48px" }}>
        {activeTab === "shipping" && (
          <div className="reveal">
            <div style={{ background: "#0F0408", color: "#F5EDE2", padding: "20px 28px", marginBottom: "40px", display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "1.4rem" }}>↑</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.06em" }}>FREE SHIPPING on orders above ₹1,250</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(245,237,226,0.65)", marginTop: "4px" }}>Delivered in 7–10 business days across India</div>
              </div>
            </div>
            {[
              { title: "Delivery Timeline", body: "All orders are dispatched within 2–3 business days of confirmation. Standard delivery takes 7–10 business days. We currently ship across India only." },
              { title: "Shipping Charges", body: "Free shipping on all orders above ₹1,250. A flat shipping fee of ₹149 applies to orders below this threshold." },
              { title: "Order Tracking", body: "Once your order ships, you'll receive a tracking link on your registered email or WhatsApp number. You can also check your order status in your Account." },
              { title: "Packaging", body: "All IMPACKT bags are shipped in recycled kraft packaging — minimal, protective, and kind to the planet." },
              { title: "Delays", body: "During peak periods or adverse weather, delivery may take an additional 2–3 days. We'll notify you proactively via WhatsApp or email." },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid rgba(74,21,31,0.1)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#0F0408", fontWeight: 400, marginBottom: "10px" }}>{title}</h3>
                <p style={{ color: "#1C0810", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300 }}>{body}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === "returns" && (
          <div className="reveal">
            <div style={{ background: "#4A151F", color: "#F5EDE2", padding: "20px 28px", marginBottom: "40px", display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "1.4rem" }}>↩</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.06em" }}>3-DAY RETURN POLICY</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(245,237,226,0.75)", marginTop: "4px" }}>Unused bags in original condition. Simple, honest, no questions asked.</div>
              </div>
            </div>
            {[
              { title: "Return Window", body: "You have 3 days from the date of delivery to raise a return request. Returns raised after this window cannot be processed." },
              { title: "Eligibility", body: "Items must be unused, unwashed, and in their original packaging with tags intact. Bags showing signs of use, damage, or missing packaging are not eligible." },
              { title: "How to Return", body: "To initiate a return, WhatsApp us at +91 83838 18695 or email helloimpackt.in@gmail.com with your order number and reason. We'll arrange a pickup within 2 business days." },
              { title: "Refunds", body: "Once your return is received and inspected, refunds are processed within 5–7 business days to your original payment method." },
              { title: "Exchanges", body: "If you'd like a different colour, contact us within 3 days of delivery. Exchanges are subject to stock availability. We cover return shipping for exchanges." },
              { title: "Non-Returnable Items", body: "Gift cards and items marked as final sale are not eligible for return or exchange." },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid rgba(74,21,31,0.1)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#0F0408", fontWeight: 400, marginBottom: "10px" }}>{title}</h3>
                <p style={{ color: "#1C0810", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300 }}>{body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ACCOUNT PAGE ───────────────────────────────────────────────── */
// Module-level store — persists across re-mounts for the lifetime of the page session
const _users = {};

// ── Stable sub-components for Account (defined outside to prevent remount on every render) ──
function AccInp({ label, value, onChange, placeholder, type }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#1C0810", marginBottom: "7px" }}>{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder} type={type || "text"}
        style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(74,21,31,0.2)", background: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "0.87rem", color: "#0F0408", outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}

function AccPwInp({ label, value, onChange, placeholder, showPw, toggleShow }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#1C0810", marginBottom: "7px" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input value={value} onChange={onChange} type={showPw ? "text" : "password"} placeholder={placeholder}
          style={{ width: "100%", padding: "12px 52px 12px 16px", border: "1px solid rgba(74,21,31,0.2)", background: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "0.87rem", color: "#0F0408", outline: "none", boxSizing: "border-box" }} />
        <button onClick={toggleShow} style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#7A5060", fontSize: "0.7rem", cursor: "none", letterSpacing: "0.06em" }}>{showPw ? "HIDE" : "SHOW"}</button>
      </div>
    </div>
  );
}

function AccBtn({ onClick, children, secondary }) {
  return (
    <button onClick={onClick} style={{ width: "100%", background: secondary ? "none" : "#0F0408", color: secondary ? "#4A151F" : "#F5EDE2", border: secondary ? "1px solid rgba(74,21,31,0.3)" : "none", padding: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, cursor: "none", transition: "background 0.25s", marginBottom: secondary ? 0 : "12px" }}
      onMouseEnter={e => { if (!secondary) e.currentTarget.style.background = "#4A151F"; }}
      onMouseLeave={e => { if (!secondary) e.currentTarget.style.background = "#0F0408"; }}>
      {children}
    </button>
  );
}

function AccErrBox({ msg }) { return msg ? <div style={{ background: "rgba(74,21,31,0.1)", color: "#4A151F", padding: "10px 14px", fontSize: "0.8rem", marginBottom: "14px", borderLeft: "3px solid #4A151F", lineHeight: 1.5 }}>{msg}</div> : null; }
function AccOkBox({ msg })  { return msg ? <div style={{ background: "rgba(15,4,8,0.07)", color: "#0F0408", padding: "10px 14px", fontSize: "0.8rem", marginBottom: "14px", borderLeft: "3px solid #0F0408", lineHeight: 1.5 }}>{msg}</div> : null; }

function AccShell({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F5EDE2", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 60px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600, marginBottom: "10px" }}>My Account</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#0F0408", fontWeight: 400, margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ color: "#7A5060", fontSize: "0.83rem", marginTop: "8px", fontWeight: 300 }}>{subtitle}</p>}
        </div>
        <div style={{ background: "#FAF4EE", padding: "36px 32px" }}>{children}</div>
      </div>
    </div>
  );
}

function AccountPage({ setPage }) {
  // ── Auth state ──

  const [view, setView] = useState("login"); // login | register | forgot | dashboard
  const [user, setUser] = useState(null);
  const sessionTimer = useRef(null);

  // ── Login form ──
  const [login, setLogin] = useState({ id: "", password: "", showPw: false });
  // ── Register form ──
  const [reg, setReg] = useState({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPw: "", showPw: false });
  // ── Forgot form ──
  const [forgot, setForgot] = useState({ id: "", step: "input", newPw: "", confirmPw: "", showPw: false });
  // ── Shared error / success ──
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  // ── Auto sign-out after 10 minutes ──
  const startSession = (u) => {
    clearTimeout(sessionTimer.current);
    sessionTimer.current = setTimeout(() => {
      setUser(null);
      setView("login");
      setLogin({ id: "", password: "", showPw: false });
      setErr("You were signed out after 10 minutes of inactivity.");
    }, 10 * 60 * 1000);
    setUser(u);
    setView("dashboard");
    setErr(""); setSuccess("");
  };

  useEffect(() => () => clearTimeout(sessionTimer.current), []);

  // ── LOGIN ────────────────────────────────────────────────────────
  if (view === "login") {
    const handle = () => {
      setErr(""); setSuccess("");
      if (!login.id || !login.password) { setErr("Please fill in both fields."); return; }
      const key = login.id.trim().toLowerCase();
      const phoneKey = login.id.trim().replace(/\s/g, "");
      const found = _users[key] || _users[phoneKey];
      if (!found) { setErr("No account found with that email or phone. Please create one."); return; }
      if (found.password !== login.password) { setErr("Incorrect password. Try again or use Forgot Password."); return; }
      startSession(found);
    };
    return (
      <AccShell title="Sign In" subtitle="Track orders and manage your profile">
        <AccErrBox msg={err} /><AccOkBox msg={success} />
        <AccInp label="Email or Phone Number" value={login.id} onChange={e => setLogin(f => ({ ...f, id: e.target.value }))} placeholder="you@email.com or 98XXXXXXXX" />
        <AccPwInp label="Password" value={login.password} onChange={e => setLogin(f => ({ ...f, password: e.target.value }))} placeholder="Enter password" showPw={login.showPw} toggleShow={() => setLogin(f => ({ ...f, showPw: !f.showPw }))} />
        <div style={{ textAlign: "right", marginTop: "-10px", marginBottom: "20px" }}>
          <button onClick={() => { setErr(""); setSuccess(""); setForgot({ id: "", step: "input", newPw: "", confirmPw: "", showPw: false }); setView("forgot"); }} style={{ background: "none", border: "none", color: "#4A151F", fontSize: "0.76rem", cursor: "none", fontFamily: "'DM Sans', sans-serif", textDecoration: "underline" }}>Forgot password?</button>
        </div>
        <AccBtn onClick={handle}>Sign In</AccBtn>
        <AccBtn secondary onClick={() => { setErr(""); setSuccess(""); setReg({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPw: "", showPw: false }); setView("register"); }}>Create an Account</AccBtn>
      </AccShell>
    );
  }

  // ── REGISTER ─────────────────────────────────────────────────────
  if (view === "register") {
    const handle = () => {
      setErr(""); setSuccess("");
      const { firstName, lastName, phone, email, password, confirmPw } = reg;
      if (!firstName || !lastName || !phone || !email || !password || !confirmPw) { setErr("All fields are required."); return; }
      if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) { setErr("Enter a valid 10-digit phone number."); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("Enter a valid email address."); return; }
      if (password.length < 6) { setErr("Password must be at least 6 characters."); return; }
      if (password !== confirmPw) { setErr("Passwords do not match."); return; }
      const emailKey = email.trim().toLowerCase();
      const phoneKey = phone.replace(/\s/g, "");
      if (_users[emailKey] || _users[phoneKey]) { setErr("An account with this email or phone already exists."); return; }
      const newUser = { firstName, lastName, phone: phoneKey, email: emailKey, password };
      _users[emailKey] = newUser;
      _users[phoneKey] = newUser;
      setSuccess("Account created! Signing you in…");
      setTimeout(() => startSession(newUser), 800);
    };
    return (
      <AccShell title="Create Account" subtitle="Join IMPACKT — it only takes a moment">
        <AccErrBox msg={err} /><AccOkBox msg={success} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <AccInp label="First Name" value={reg.firstName} onChange={e => setReg(f => ({ ...f, firstName: e.target.value }))} placeholder="Adya" />
          <AccInp label="Last Name" value={reg.lastName} onChange={e => setReg(f => ({ ...f, lastName: e.target.value }))} placeholder="Gupta" />
        </div>
        <AccInp label="Phone Number" value={reg.phone} onChange={e => setReg(f => ({ ...f, phone: e.target.value }))} placeholder="98XXXXXXXX" />
        <AccInp label="Email Address" value={reg.email} onChange={e => setReg(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
        <AccPwInp label="Create Password" value={reg.password} onChange={e => setReg(f => ({ ...f, password: e.target.value }))} placeholder="Min. 6 characters" showPw={reg.showPw} toggleShow={() => setReg(f => ({ ...f, showPw: !f.showPw }))} />
        <AccPwInp label="Confirm Password" value={reg.confirmPw} onChange={e => setReg(f => ({ ...f, confirmPw: e.target.value }))} placeholder="Re-enter password" showPw={reg.showPw} toggleShow={() => setReg(f => ({ ...f, showPw: !f.showPw }))} />
        <AccBtn onClick={handle}>Create Account</AccBtn>
        <div style={{ textAlign: "center", marginTop: "6px" }}>
          <button onClick={() => { setErr(""); setSuccess(""); setView("login"); }} style={{ background: "none", border: "none", color: "#7A5060", fontSize: "0.76rem", cursor: "none", fontFamily: "'DM Sans', sans-serif" }}>Already have an account? <span style={{ color: "#4A151F", fontWeight: 600 }}>Sign In</span></button>
        </div>
      </AccShell>
    );
  }

  // ── FORGOT PASSWORD ───────────────────────────────────────────────
  if (view === "forgot") {
    const handleFind = () => {
      setErr(""); setSuccess("");
      if (!forgot.id) { setErr("Please enter your email or phone number."); return; }
      const key = forgot.id.trim().toLowerCase();
      const found = _users[key] || _users[forgot.id.replace(/\s/g, "")];
      if (!found) { setErr("No account found with that email or phone."); return; }
      setForgot(f => ({ ...f, step: "reset" }));
      setSuccess("Account found. Please set your new password.");
    };
    const handleReset = () => {
      setErr(""); setSuccess("");
      if (!forgot.newPw || !forgot.confirmPw) { setErr("Please fill in both password fields."); return; }
      if (forgot.newPw.length < 6) { setErr("Password must be at least 6 characters."); return; }
      if (forgot.newPw !== forgot.confirmPw) { setErr("Passwords do not match."); return; }
      const key = forgot.id.trim().toLowerCase();
      const phoneKey = forgot.id.replace(/\s/g, "");
      const found = _users[key] || _users[phoneKey];
      if (found) {
        found.password = forgot.newPw;
        // update all keys pointing to this user
        Object.keys(_users).forEach(k => { if (_users[k] === found) _users[k].password = forgot.newPw; });
      }
      setSuccess("Password updated! You can now sign in.");
      setTimeout(() => { setView("login"); setSuccess("Password updated — please sign in."); }, 1200);
    };
    return (
      <AccShell title="Reset Password" subtitle={forgot.step === "input" ? "Enter your registered email or phone" : "Set a new password for your account"}>
        <AccErrBox msg={err} /><AccOkBox msg={success} />
        {forgot.step === "input" ? (
          <>
            <AccInp label="Email or Phone Number" value={forgot.id} onChange={e => setForgot(f => ({ ...f, id: e.target.value }))} placeholder="you@email.com or 98XXXXXXXX" />
            <AccBtn onClick={handleFind}>Find My Account</AccBtn>
          </>
        ) : (
          <>
            <AccPwInp label="New Password" value={forgot.newPw} onChange={e => setForgot(f => ({ ...f, newPw: e.target.value }))} placeholder="Min. 6 characters" showPw={forgot.showPw} toggleShow={() => setForgot(f => ({ ...f, showPw: !f.showPw }))} />
            <AccPwInp label="Confirm New Password" value={forgot.confirmPw} onChange={e => setForgot(f => ({ ...f, confirmPw: e.target.value }))} placeholder="Re-enter new password" showPw={forgot.showPw} toggleShow={() => setForgot(f => ({ ...f, showPw: !f.showPw }))} />
            <AccBtn onClick={handleReset}>Reset Password</AccBtn>
          </>
        )}
        <div style={{ textAlign: "center", marginTop: "6px" }}>
          <button onClick={() => { setErr(""); setSuccess(""); setView("login"); }} style={{ background: "none", border: "none", color: "#7A5060", fontSize: "0.76rem", cursor: "none", fontFamily: "'DM Sans', sans-serif" }}>← Back to Sign In</button>
        </div>
      </AccShell>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────
  const signOut = () => {
    clearTimeout(sessionTimer.current);
    setUser(null); setView("login");
    setLogin({ id: "", password: "", showPw: false });
    setErr(""); setSuccess("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5EDE2", paddingTop: "100px" }}>
      <div style={{ background: "#0F0408", padding: "60px 48px 48px", textAlign: "left", paddingLeft: "72px" }}>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600 }}>My Account</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#F5EDE2", fontWeight: 400, margin: "12px 0 4px" }}>
          Welcome, {user.firstName}
        </h1>
        <p style={{ color: "rgba(245,237,226,0.5)", fontSize: "0.82rem" }}>{user.email}</p>
      </div>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "56px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400, color: "#0F0408" }}>Order History</h2>
          <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(74,21,31,0.3)", padding: "8px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4A151F", cursor: "none" }}>Sign Out</button>
        </div>
        <div style={{ textAlign: "center", padding: "64px 0", color: "#7A5060" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "16px", color: "#4A151F" }}>◇</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", marginBottom: "8px" }}>No orders yet. Time to make your first IMPACKT.</p>
          <p style={{ fontSize: "0.8rem", fontWeight: 300, color: "#7A5060" }}>Orders you place will appear here.</p>
          <button onClick={() => setPage("product")} style={{ marginTop: "24px", background: "#0F0408", color: "#F5EDE2", border: "none", padding: "12px 36px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "#4A151F"}
            onMouseLeave={e => e.currentTarget.style.background = "#0F0408"}>Shop Now</button>
        </div>
        <div style={{ marginTop: "32px", padding: "24px 28px", background: "#0F0408", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4A151F", marginBottom: "6px" }}>Need Help?</div>
            <div style={{ color: "rgba(245,237,226,0.65)", fontSize: "0.82rem" }}>WhatsApp +91 83838 18695 · helloimpackt.in@gmail.com</div>
          </div>
          <button onClick={() => setPage("shipping")} style={{ background: "none", border: "1px solid rgba(245,237,226,0.2)", padding: "10px 20px", color: "rgba(245,237,226,0.75)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "none" }}>Shipping & Returns</button>
        </div>
      </div>
    </div>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────── */
function Footer({ setPage }) {
  return (
    <footer style={{ background: "#0F0408", color: "#F5EDE2", padding: "64px 48px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", letterSpacing: "0.1em", fontWeight: 500, marginBottom: "16px" }}>
            IM<span style={{ color: "#4A151F" }}>PACKT</span>
          </div>
          <p style={{ color: "rgba(245,237,226,0.55)", fontSize: "0.86rem", lineHeight: 1.85, fontWeight: 300, maxWidth: "260px" }}>
            Handcrafted convertible bags made by artisan communities. Fashion that transforms, purpose that endures.
          </p>
          <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
              <button style={{ width: "38px", height: "38px", background: "rgba(245,237,226,0.08)", border: "1px solid rgba(245,237,226,0.12)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", cursor: "none" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,237,226,0.16)"; e.currentTarget.style.borderColor = "#4A151F"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,237,226,0.08)"; e.currentTarget.style.borderColor = "rgba(245,237,226,0.12)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#F5EDE2" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="4.5" stroke="#F5EDE2" strokeWidth="1.8"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="#F5EDE2"/>
                </svg>
              </button>
              <button style={{ width: "38px", height: "38px", background: "rgba(245,237,226,0.08)", border: "1px solid rgba(245,237,226,0.12)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", cursor: "none" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,237,226,0.16)"; e.currentTarget.style.borderColor = "#4A151F"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,237,226,0.08)"; e.currentTarget.style.borderColor = "rgba(245,237,226,0.12)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.5 6.2a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.2a2.8 2.8 0 0 0-2 2C1.3 7.8 1.3 12 1.3 12s0 4.2.2 5.8a2.8 2.8 0 0 0 2 2C5.1 20 12 20 12 20s6.9 0 8.5-.2a2.8 2.8 0 0 0 2-2c.2-1.6.2-5.8.2-5.8s0-4.2-.2-5.8z" stroke="#F5EDE2" strokeWidth="1.8"/>
                  <polygon points="9.8,15.5 15.8,12 9.8,8.5" fill="#F5EDE2"/>
                </svg>
              </button>
          </div>
        </div>

        {[
          { heading: "Shop", links: [["product", "The Convertible Bag"]] },
          { heading: "Company", links: [["story", "Our Story"], ["ngo", "NGO Impact"]] },
          { heading: "Help", links: [["contact", "Contact Us"], ["contact", "FAQs"], ["shipping", "Shipping & Returns"]] },
        ].map(col => (
          <div key={col.heading}>
            <h4 style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#4A151F", fontWeight: 600, marginBottom: "20px" }}>{col.heading}</h4>
            <ul style={{ listStyle: "none" }}>
              {col.links.map(([page, label]) => (
                <li key={label} style={{ marginBottom: "12px" }}>
                  <button onClick={() => setPage(page)} style={{
                    background: "none", border: "none", color: "rgba(245,237,226,0.55)",
                    fontSize: "0.86rem", fontWeight: 300, fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.25s", padding: 0,
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = "#F5EDE2"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(245,237,226,0.55)"}
                  >{label}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(245,237,226,0.1)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy Policy", "Terms of Service"].map(link => (
            <button key={link} style={{ background: "none", border: "none", color: "rgba(245,237,226,0.3)", fontSize: "0.76rem", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(245,237,226,0.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(245,237,226,0.3)"}
            >{link}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT APP ──────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);  const [pageKey, setPageKey] = useState(0);

  const changePage = (newPage) => {
    setPage(newPage);
    setPageKey(k => k + 1);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch(e) {}
  };

  const addToCart = (item) => {
    const cartKey = `${item.id}-${item.color || "default"}`;
    setCartItems(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) return prev.map(i => i.cartKey === cartKey ? { ...i, qty: i.qty + item.qty } : i);
      return [...prev, { ...item, cartKey }];
    });
  };
  const removeFromCart = (cartKey) => setCartItems(prev => prev.filter(i => i.cartKey !== cartKey));
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <CustomCursor />
      <div className="grain" />
      <Nav page={page} setPage={changePage} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onAccountOpen={() => changePage("account")} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onRemove={removeFromCart} onCheckout={() => setCartOpen(false)} />
      <main>
        {page !== "account" && (
          <div key={pageKey}>
            {page === "home" && <HomePage setPage={changePage} onAddCart={addToCart} />}
            {page === "product" && <ProductPage onAddCart={addToCart} />}
            {page === "story" && <StoryPage setPage={changePage} />}
            {page === "ngo" && <NgoPage />}
            {page === "contact" && <ContactPage />}
            {page === "shipping" && <ShippingPage />}
          </div>
        )}
        {page === "account" && <AccountPage setPage={changePage} />}
      </main>
      <Footer setPage={changePage} />
    </>
  );
}
