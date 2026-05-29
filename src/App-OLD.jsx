import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:       #EDE6DB;
    --parchment:   #E4DDD4;
    --sand:        #D8D0C5;
    --warm-white:  #F2EDE6;
    --wine:        #7F2A3C;
    --wine-deep:   #7F2A3C;
    --slate:       #5E6472;
    --slate-mid:   #5E6472;
    --slate-pale:  #E4DDD4;
    --black-coffee:#1C1C1C;
    --wine-light:  #A0445A;
    --ink:         #1C1C1C;
    --ink-mid:     #2A2A2A;
    --ink-light:   #5E6472;
    --border:      rgba(127,42,60,0.18);
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
    background: #7F2A3C;
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
    border: 1.5px solid #7F2A3C;
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

  .cursor.hero-hover { width: 7px; height: 7px; background: #7F2A3C; }
  .cursor-ring.hero-hover { width: 54px; height: 54px; border-color: #7F2A3C; opacity: 0.9; }

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
const ToteBagSVG = ({ size = 200, color = "#7F2A3C", accent = "#7F2A3C" }) => (
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

const BackpackSVG = ({ size = 200, color = "#7F2A3C", accent = "#7F2A3C" }) => (
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
    <path d="M14 4C14 4 6 8 6 16C6 20.4 9.6 24 14 24C18.4 24 22 20.4 22 16C22 8 14 4 14 4Z" stroke="#7F2A3C" strokeWidth="1.8" fill="none"/>
    <path d="M14 24V14M14 14C14 14 10 11 9 8" stroke="#7F2A3C" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const HandIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M10 14V8C10 7.1 10.9 6 12 6C13.1 6 14 7.1 14 8V14" stroke="#7F2A3C" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M14 10.5V8C14 7.1 14.9 6 16 6C17.1 6 18 7.1 18 8V14" stroke="#7F2A3C" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M18 11V9C18 8.1 18.9 7 20 7C21.1 7 22 8.1 22 9V16C22 20.4 18.4 24 14 24C9.6 24 6 20.4 6 16V14C6 13.1 6.9 12 8 12C9.1 12 10 13.1 10 14" stroke="#7F2A3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 22C14 22 4 16 4 10C4 7.2 6.2 5 9 5C11 5 12.8 6.2 14 8C15.2 6.2 17 5 19 5C21.8 5 24 7.2 24 10C24 16 14 22 14 22Z" stroke="#7F2A3C" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
  </svg>
);

const ConvertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M6 14H22M22 14L18 10M22 14L18 18" stroke="#7F2A3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 6H6C5.4 6 5 6.4 5 7V11" stroke="#7F2A3C" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M18 22H22C22.6 22 23 21.6 23 21V17" stroke="#7F2A3C" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill={filled ? "#7F2A3C" : "none"} stroke="#7F2A3C" strokeWidth="1.2">
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
function Nav({ page, setPage, cartCount, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      background: scrolled ? "rgba(237,230,219,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(127,42,60,0.12)" : "none",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Logo */}
      <button onClick={() => setPage("home")} style={{
        background: "none", border: "none", padding: 0,
        fontFamily: "'Playfair Display', serif", fontSize: "1.6rem",
        color: "#1C1C1C", letterSpacing: "0.12em", fontWeight: 500,
      }}>
        IM<span style={{ color: "#7F2A3C" }}>PACKT</span>
      </button>

      {/* Desktop Links */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {links.map(l => (
          <button key={l.key} onClick={() => setPage(l.key)} style={{
            background: "none", border: "none", padding: "4px 0",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
            letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500,
            color: page === l.key ? "#7F2A3C" : "#5E6472",
            borderBottom: page === l.key ? "1.5px solid #7F2A3C" : "1.5px solid transparent",
            transition: "all 0.25s",
          }}>
            {l.label}
          </button>
        ))}
      </div>

      {/* Cart */}
      <button onClick={onCartOpen} style={{
        display: "flex", alignItems: "center", gap: "8px",
        background: "#1C1C1C", color: "#EDE6DB",
        border: "none", padding: "10px 22px",
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem",
        letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
        transition: "all 0.3s", position: "relative",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "#7F2A3C"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#1C1C1C"; }}
      >
        🛍
        {cartCount > 0 && (
          <span style={{
            position: "absolute", top: "-6px", right: "-6px",
            background: "#7F2A3C", color: "white",
            width: "20px", height: "20px", borderRadius: "50%",
            fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700,
          }}>{cartCount}</span>
        )}
        Cart
      </button>
    </nav>
  );
}

/* ─── CART DRAWER ────────────────────────────────────────────────── */
function CartDrawer({ open, onClose, items, onRemove, onCheckout }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(28,28,28,0.55)",
        zIndex: 900, opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none",
        transition: "opacity 0.4s",
      }} />
      <aside style={{
        position: "fixed", top: 0, right: open ? 0 : "-480px", width: "440px",
        height: "100%", background: "#F2EDE6", zIndex: 901,
        transition: "right 0.45s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", flexDirection: "column",
        boxShadow: "-12px 0 60px rgba(28,28,28,0.18)",
      }}>
        {/* Header */}
        <div style={{ padding: "28px 32px", borderBottom: "1px solid rgba(127,42,60,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400 }}>Your Bag</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.4rem", color: "#5E6472" }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#5E6472" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🛍</div>
              <p style={{ fontSize: "0.9rem" }}>Your cart is empty</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ display: "flex", gap: "16px", padding: "20px 0", borderBottom: "1px solid rgba(127,42,60,0.1)" }}>
              <div style={{ width: "70px", height: "70px", background: "#E4DDD4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ToteBagSVG size={50} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "4px" }}>{item.name}</p>
                <p style={{ fontSize: "0.8rem", color: "#5E6472" }}>Qty: {item.qty}</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#7F2A3C", marginTop: "4px" }}>₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
              <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#7F2A3C", fontSize: "1.1rem", alignSelf: "start" }}>✕</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(127,42,60,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "0.85rem", color: "#2A2A2A" }}>Total</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#1C1C1C" }}>₹{total.toLocaleString()}</span>
            </div>
            <button onClick={onCheckout} style={{
              width: "100%", padding: "16px",
              background: "#7F2A3C", color: "#EDE6DB",
              border: "none", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase",
              fontWeight: 600, marginBottom: "10px",
              transition: "background 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#1C1C1C"}
              onMouseLeave={e => e.currentTarget.style.background = "#7F2A3C"}
            >
              Checkout — ₹{total.toLocaleString()}
            </button>
            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#5E6472", letterSpacing: "0.05em" }}>
              ◇ Free shipping on orders above ₹1,250
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
    { name: "Priya M.", city: "Mumbai", rating: 5, text: "Absolutely obsessed with this bag. It converts so smoothly and gets compliments everywhere I go. The quality is stunning — you can feel the care in every stitch.", avatar: "PM" },
    { name: "Anika S.", city: "Delhi", rating: 5, text: "I've tried so many bags but nothing compares. It fits my laptop perfectly as a backpack, and transforms into the most chic tote for evenings. Sustainable AND stylish.", avatar: "AS" },
    { name: "Riya K.", city: "Bangalore", rating: 5, text: "Knowing my purchase supports artisan women made this feel special. The bag is premium, the mission is genuine. IMPACKT is the future of conscious fashion.", avatar: "RK" },
  ];

  const avatarColors = ["#7F2A3C", "#7F2A3C", "#7F2A3C"];

  return (
    <div className="page-enter">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section data-hero-section style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EDE6DB 0%, #E4DDD4 45%, #E4DDD4 100%)",
        display: "flex", alignItems: "center",
        padding: "120px 48px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(127,42,60,0.08), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(127,42,60,0.07), transparent 70%)", pointerEvents: "none" }} />
        {/* Content */}
        <div style={{ flex: 1, maxWidth: "580px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 5vw, 5.2rem)", lineHeight: 1.05, color: "#1C1C1C", fontWeight: 500, marginBottom: "20px" }}>
            One Bag.
            <br /><em style={{ color: "#7F2A3C" }}>Two Styles.</em>
            <br />Endless
            <br />Possibilities.
          </h1>

          <p style={{ fontSize: "1rem", color: "#2A2A2A", lineHeight: 1.85, maxWidth: "440px", marginBottom: "36px", fontWeight: 300 }}>
            A convertible masterpiece handcrafted by skilled artisans — transitions effortlessly from a chic tote to a structured backpack, made from earth-conscious materials with every purchase empowering underprivileged communities.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "48px" }}>
            <button data-hero-cta onClick={() => setPage("product")} style={{
              background: "#1C1C1C", color: "#EDE6DB",
              border: "none", padding: "16px 36px",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
              letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600,
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#7F2A3C"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(127,42,60,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1C1C1C"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              Shop Now
            </button>
            <button data-hero-cta onClick={() => setPage("story")} style={{
              background: "transparent", color: "#1C1C1C",
              border: "1.5px solid #1C1C1C", padding: "16px 36px",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
              letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600,
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1C1C1C"; e.currentTarget.style.color = "#EDE6DB"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1C1C1C"; e.currentTarget.style.transform = ""; }}
            >
              Learn Our Story
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "32px" }}>
            {[["40+", "Artisans Supported"], ["200+", "Bags Crafted"], ["100%", "Eco Materials"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#7F2A3C", fontWeight: 500 }}>{num}</div>
                <div style={{ fontSize: "0.7rem", color: "#5E6472", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bag Illustration */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <div style={{
            background: "#F2EDE6",
            boxShadow: "0 40px 100px rgba(28,28,28,0.14), 0 8px 30px rgba(28,28,28,0.08)",
            padding: "48px 40px",
            position: "relative", maxWidth: "520px", width: "100%",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #7F2A3C, #A0445A, #7F2A3C)" }} />
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "24px" }}>
              <div className="float-anim" style={{ textAlign: "center" }}>
                <ToteBagSVG size={160} />
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5E6472", marginTop: "12px", fontWeight: 500 }}>Tote Mode</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
                <div style={{ width: "1px", height: "30px", background: "linear-gradient(to bottom, transparent, #7F2A3C, transparent)" }} />
                <span style={{ color: "#7F2A3C", fontSize: "1.3rem" }}>⟷</span>
                <div style={{ width: "1px", height: "30px", background: "linear-gradient(to bottom, transparent, #7F2A3C, transparent)" }} />
              </div>
              <div className="float-anim" style={{ textAlign: "center", animationDelay: "-2.5s" }}>
                <BackpackSVG size={160} />
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5E6472", marginTop: "12px", fontWeight: 500 }}>Backpack Mode</div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(127,42,60,0.15)" }}>
              <span style={{ fontSize: "0.72rem", letterSpacing: "0.1em", color: "#7F2A3C", fontWeight: 600 }}>✦ THE IMPACKT CONVERTIBLE ✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCT ─────────────────────────────────────── */}
      <section style={{ padding: "100px 48px", background: "#F2EDE6" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Featured Collection</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3.2rem)", color: "#1C1C1C", marginTop: "12px", fontWeight: 400 }}>
            The Signature <em>Convertible</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div className="reveal" style={{
            background: "linear-gradient(135deg, #E4DDD4, #D8D0C5)",
            padding: "60px 40px", display: "flex", flexDirection: "column",
            alignItems: "center", position: "relative",
          }}>
            <div style={{ position: "absolute", top: "24px", right: "24px", background: "#7F2A3C", color: "white", padding: "5px 14px", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Bestseller</div>
            <BackpackSVG size={220} />
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              {["Pearl White", "Midnight Black", "Olive Green", "Steel Grey"].map((color, i) => (
                <div key={color} style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  border: "2px solid white",
                  boxShadow: "0 0 0 1.5px #7F2A3C",
                  background: ["#EDE6DB", "#1C1C1C", "#7F2A3C", "#8A9099"][i],
                  cursor: "pointer",
                }} title={color} />
              ))}
            </div>
          </div>

          <div className="reveal reveal-d2">
            <div style={{ marginBottom: "8px", fontSize: "0.72rem", color: "#7F2A3C", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>IMPACKT</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 400, lineHeight: 1.15, marginBottom: "12px" }}>
              The Convertible Tote-Backpack
            </h3>
            <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
              {[1,2,3,4,5].map(s => <StarIcon key={s} filled />)}
              <span style={{ fontSize: "0.78rem", color: "#5E6472", marginLeft: "8px" }}>4.9 (71 reviews)</span>
            </div>
            <p style={{ color: "#2A2A2A", lineHeight: 1.9, fontSize: "0.92rem", fontWeight: 300, marginBottom: "28px" }}>
              Born from a vision of effortless versatility, this convertible bag moves with your life — from morning commutes to weekend escapes. Ethically handcrafted from sustainably sourced canvas and natural dyes, every purchase directly funds livelihood programs for artisan communities.
            </p>
            {["Converts from tote to backpack in seconds", "Premium waterproof canvas", "Padded laptop compartment (up to 15\")", "Ethically made by trained artisans"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ color: "#7F2A3C", fontSize: "1rem" }}>✓</span>
                <span style={{ fontSize: "0.86rem", color: "#2A2A2A" }}>{f}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", margin: "28px 0" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", color: "#1C1C1C" }}>₹1,249</span>
              <span style={{ fontSize: "1rem", color: "#5E6472", textDecoration: "line-through" }}>₹1,749</span>
              <span style={{ background: "#7F2A3C", color: "white", padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700 }}>28% OFF</span>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => onAddCart({ id: 1, name: "The Convertible Tote-Backpack", price: 1249, qty: 1 })} style={{
                flex: 1, padding: "15px", background: "#7F2A3C", color: "#EDE6DB",
                border: "none", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1C1C1C"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#7F2A3C"; e.currentTarget.style.transform = ""; }}
              >
                Add to Cart
              </button>
              <button onClick={() => setPage("product")} style={{
                padding: "15px 24px",
                background: "transparent", color: "#7F2A3C",
                border: "1.5px solid #7F2A3C", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#7F2A3C"; e.currentTarget.style.color = "#EDE6DB"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7F2A3C"; }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px", background: "#1C1C1C" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Why IMPACKT</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#EDE6DB", marginTop: "12px", fontWeight: 400 }}>
            Designed with <em>Purpose</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {[
            { icon: <ConvertIcon />, title: "Convertible Design", desc: "Transforms from chic tote to functional backpack in under 10 seconds. Two bags, one purchase." },
            { icon: <LeafIcon />, title: "Sustainable Materials", desc: "Crafted from GOTS-certified organic cotton and natural plant-based dyes. Gentle on earth." },
            { icon: <HandIcon />, title: "Handmade with Care", desc: "Every stitch placed with intention by skilled artisans who take pride in their craft." },
            { icon: <HeartIcon />, title: "NGO-Supported", desc: "15% of every sale funds skill training programs for underprivileged women and youth." },
          ].map((item, i) => (
            <div key={item.title} className={`reveal reveal-d${i + 1}`} style={{
              padding: "36px 28px", border: "1px solid rgba(237,230,219,0.1)",
              textAlign: "center", transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#7F2A3C"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.background = "rgba(237,230,219,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(237,230,219,0.1)"; e.currentTarget.style.transform = ""; e.currentTarget.style.background = ""; }}
            >
              <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", filter: "brightness(2)" }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#EDE6DB", marginBottom: "12px", fontWeight: 400 }}>{item.title}</h3>
              <p style={{ fontSize: "0.84rem", color: "rgba(237,230,219,0.6)", lineHeight: 1.8, fontWeight: 300 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px", background: "#EDE6DB" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Customer Love</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#1C1C1C", marginTop: "12px", fontWeight: 400 }}>
            Real Stories, <em>Real Impact</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "28px" }}>
          {testimonials.map((t, i) => (
            <div key={t.name} className={`reveal reveal-d${i + 1}`} style={{
              background: "#F2EDE6", padding: "36px 32px",
              borderLeft: "3px solid #5E6472", position: "relative",
              transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(28,28,28,0.1)"; e.currentTarget.style.borderLeftColor = "#7F2A3C"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderLeftColor = "#5E6472"; }}
            >
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "5rem", color: "#5E6472", position: "absolute", top: "-10px", left: "24px", lineHeight: 1, opacity: 0.7 }}>"</div>
              <div style={{ display: "flex", gap: "3px", marginBottom: "16px", marginTop: "24px" }}>
                {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= t.rating} />)}
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.02rem", color: "#2A2A2A", lineHeight: 1.85, marginBottom: "24px", fontWeight: 400 }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: avatarColors[i], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#5E6472" }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUSTAINABILITY STORY ──────────────────────────────────── */}
      <section style={{ padding: "100px 48px", background: "#E4DDD4" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Our Commitment</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3.2rem)", color: "#1C1C1C", marginTop: "12px", fontWeight: 400 }}>
            Built to Last. <em>Made to Matter.</em>
          </h2>
          <p style={{ maxWidth: "560px", margin: "20px auto 0", color: "#2A2A2A", lineHeight: 1.9, fontSize: "0.95rem", fontWeight: 300 }}>
            Sustainability isn't a marketing label for us — it's the foundation every bag is built on. Here's exactly what makes IMPACKT different.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", maxWidth: "1100px", margin: "0 auto" }}>

          {/* What the bag is made of */}
          <div className="reveal" style={{ background: "#F2EDE6", padding: "40px 36px", borderTop: "3px solid #7F2A3C" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "16px", color: "#7F2A3C" }}>✦</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1C1C1C", marginBottom: "16px", fontWeight: 400 }}>
              What Makes It Sustainable
            </h3>
            <p style={{ color: "#2A2A2A", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300, marginBottom: "20px" }}>
              Every IMPACKT bag begins with GOTS-certified organic cotton canvas — grown without pesticides or synthetic fertilisers, using significantly less water than conventional cotton. The natural dyes are plant-derived, free from toxic heavy metals, and safe for both artisan hands and river ecosystems downstream.
            </p>
            <p style={{ color: "#2A2A2A", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300 }}>
              Hardware is solid brass — built to outlast fast-fashion alternatives by decades. The lining is woven from recycled polyester, giving plastic waste a second life inside a product designed to be treasured, not discarded.
            </p>
          </div>

          {/* Why it's more sustainable */}
          <div className="reveal reveal-d2" style={{ background: "#F2EDE6", padding: "40px 36px", borderTop: "3px solid #7F2A3C" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "16px", color: "#7F2A3C" }}>↻</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1C1C1C", marginBottom: "16px", fontWeight: 400 }}>
              The Lifecycle Advantage
            </h3>
            <p style={{ color: "#2A2A2A", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300, marginBottom: "20px" }}>
              A IMPACKT bag is designed to convert — not replace. One product covers two use-cases, meaning you buy less and carry more consciously. The organic canvas develops a beautiful patina over years, making each bag more personal with time rather than disposable at season's end.
            </p>
            <p style={{ color: "#2A2A2A", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300 }}>
              When a bag finally reaches the end of its long life, the organic cotton components are fully biodegradable. We also offer a repair programme — send it back and we'll have our artisans restore it, keeping it out of landfill indefinitely.
            </p>
          </div>

          {/* How operations are sustained */}
          <div className="reveal reveal-d3" style={{ background: "#F2EDE6", padding: "40px 36px", borderTop: "3px solid #7F2A3C" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "16px", color: "#7F2A3C" }}>◈</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1C1C1C", marginBottom: "16px", fontWeight: 400 }}>
              How Our Operations Are Sustained
            </h3>
            <p style={{ color: "#2A2A2A", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300, marginBottom: "20px" }}>
              IMPACKT works exclusively with NGO-partnered workshops in Delhi that provide fair-wage employment, skill training, and safe working conditions for women and youth from underserved communities. Every artisan receives a living wage above the regional average — not piece-rate.
            </p>
            <p style={{ color: "#2A2A2A", lineHeight: 1.9, fontSize: "0.88rem", fontWeight: 300 }}>
              Fifteen percent of every sale is reinvested directly into the skill-training programmes that created the workforce. This closed loop means growth in sales translates directly into more artisans trained, more livelihoods sustained, and more families lifted — not just more bags produced.
            </p>
          </div>

          {/* The numbers that matter */}
          <div className="reveal reveal-d4" style={{ background: "#1C1C1C", padding: "40px 36px", borderTop: "3px solid #7F2A3C" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "16px", color: "#7F2A3C" }}>◆</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#EDE6DB", marginBottom: "24px", fontWeight: 400 }}>
              The Numbers That Matter
            </h3>
            {[
              ["70%", "less water used vs conventional cotton bags"],
              ["0", "toxic dyes — 100% plant-based pigments"],
              ["15%", "of every sale funds artisan skill training"],
              ["40+", "artisans employed across partner workshops"],
            ].map(([stat, label]) => (
              <div key={stat} style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(237,230,219,0.1)" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#7F2A3C", fontWeight: 500, minWidth: "64px" }}>{stat}</div>
                <div style={{ fontSize: "0.84rem", color: "rgba(237,230,219,0.75)", lineHeight: 1.6, fontWeight: 300 }}>{label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}

/* ─── PRODUCT PAGE ──────────────────────────────────────────────── */
function ProductPage({ onAddCart }) {
  useReveal();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState("desc");
  const [toast, setToast] = useState(false);

  const views = [
    { label: "Front", bg: "linear-gradient(135deg,#E4DDD4,#D8D0C5)", Comp: BackpackSVG },
    { label: "Side", bg: "linear-gradient(135deg,#D8D0C5,#5E6472)", Comp: ToteBagSVG },
    { label: "Open", bg: "linear-gradient(135deg,#E4DDD4,#E4DDD4)", Comp: BackpackSVG },
    { label: "Detail", bg: "linear-gradient(135deg,#EDE6DB,#E4DDD4)", Comp: ToteBagSVG },
  ];

  const handleAdd = () => {
    onAddCart({ id: 1, name: "The Convertible Tote-Backpack", price: 1249, qty });
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  return (
    <div className="page-enter" style={{ paddingTop: "80px" }}>
      <div style={{ padding: "60px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>

        {/* Gallery */}
        <div style={{ position: "sticky", top: "96px" }}>
          <div onClick={() => setZoomed(!zoomed)} className="reveal" style={{
            background: views[activeImg].bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            aspectRatio: "1", marginBottom: "14px",
            cursor: zoomed ? "zoom-out" : "zoom-in",
            overflow: "hidden", position: "relative",
            transition: "all 0.4s",
          }}>
            <div style={{ transform: zoomed ? "scale(1.5)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
              {activeImg % 2 === 0 ? <BackpackSVG size={260} /> : <ToteBagSVG size={260} />}
            </div>
            {!zoomed && <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(28,28,28,0.5)", color: "white", padding: "5px 10px", fontSize: "0.68rem", letterSpacing: "0.1em" }}>🔍 Click to zoom</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
            {views.map((v, i) => (
              <div key={v.label} onClick={() => { setActiveImg(i); setZoomed(false); }} style={{
                background: v.bg, aspectRatio: "1",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: `2px solid ${activeImg === i ? "#7F2A3C" : "transparent"}`,
                transition: "border-color 0.2s",
              }}>
                {i % 2 === 0 ? <BackpackSVG size={60} /> : <ToteBagSVG size={60} />}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="reveal reveal-d2">
          <div style={{ fontSize: "0.7rem", color: "#7F2A3C", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>IMPACKT</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem", fontWeight: 400, lineHeight: 1.1, marginBottom: "14px" }}>
            The Convertible<br />Tote-Backpack
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "3px" }}>{[1,2,3,4,5].map(s => <StarIcon key={s} filled />)}</div>
            <span style={{ fontSize: "0.78rem", color: "#5E6472" }}>4.9 · 71 Reviews</span>
            <span style={{ fontSize: "0.78rem", color: "#7F2A3C", fontWeight: 600 }}>✓ In Stock</span>
          </div>

          <div style={{ borderTop: "1px solid rgba(127,42,60,0.15)", borderBottom: "1px solid rgba(127,42,60,0.15)", padding: "20px 0", marginBottom: "28px", display: "flex", alignItems: "center", gap: "18px" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: "#1C1C1C" }}>₹1,249</span>
            <span style={{ fontSize: "1.1rem", color: "#5E6472", textDecoration: "line-through" }}>₹1,749</span>
            <span style={{ background: "#7F2A3C", color: "white", padding: "4px 12px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em" }}>SAVE 28%</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "0", marginBottom: "24px", borderBottom: "1px solid rgba(127,42,60,0.15)" }}>
            {[["desc", "Description"], ["features", "Features"], ["specs", "Specs"], ["care", "Care"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                padding: "10px 20px", background: "none",
                border: "none", borderBottom: `2px solid ${activeTab === key ? "#7F2A3C" : "transparent"}`,
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
                letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
                color: activeTab === key ? "#7F2A3C" : "#5E6472",
                transition: "all 0.25s", marginBottom: "-1px",
              }}>{label}</button>
            ))}
          </div>

          <div style={{ minHeight: "160px", marginBottom: "28px" }}>
            {activeTab === "desc" && <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300 }}>Introducing IMPACKT's signature piece — a bag that redefines versatility. Hand-stitched by skilled artisans in our NGO-partnered workshop, this convertible transforms your lifestyle. Whether you're heading to a boardroom or a bazaar, it adapts with you. The organic cotton canvas ages beautifully, developing a unique patina over time — becoming more yours with each journey.</p>}
            {activeTab === "features" && (
              <div>
                {["Converts from tote to backpack in under 10 seconds", "GOTS-certified organic cotton canvas", "Padded laptop compartment fits up to 15\" MacBook", "Adjustable, padded backpack straps", "Interior zip pocket + 3 open pockets", "Magnetic clasp closure", "Reinforced base with copper rivets", "Weighs only 325g — ultralight design", "Available in 4 earth-tone colorways"].map(f => (
                  <div key={f} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(127,42,60,0.08)" }}>
                    <span style={{ color: "#7F2A3C", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "0.87rem", color: "#2A2A2A", fontWeight: 300 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "specs" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[["Dimensions", "38cm × 32cm × 14cm"], ["Weight", "325 grams"], ["Capacity", "11 Litres"], ["Material", "Organic Cotton Canvas"], ["Lining", "Recycled Polyester"], ["Closure", "Magnetic + YKK Zip"], ["Laptop Fit", "Up to 15 inches"], ["Water Resist", "DWR Coated"]].map(([key, val]) => (
                  <div key={key} style={{ background: "#E4DDD4", padding: "14px 16px" }}>
                    <div style={{ fontSize: "0.68rem", color: "#5E6472", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>{key}</div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1C1C1C" }}>{val}</div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "care" && (
              <div>
                {["Hand wash in cold water with mild soap", "Do not machine wash or tumble dry", "Air dry in shade — avoid direct sunlight", "Spot clean for minor stains", "Store stuffed with paper to maintain shape", "Condition leather trim quarterly with natural oil"].map(c => (
                  <div key={c} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(127,42,60,0.08)" }}>
                    <span style={{ color: "#7F2A3C" }}>◈</span>
                    <span style={{ fontSize: "0.87rem", color: "#2A2A2A", fontWeight: 300 }}>{c}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Color */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2A2A2A", fontWeight: 600, marginBottom: "10px" }}>Color: Olive Green</div>
            <div style={{ display: "flex", gap: "10px" }}>
              {[{ c: "#EDE6DB", n: "Pearl White" }, { c: "#1C1C1C", n: "Midnight Black" }, { c: "#7F2A3C", n: "Olive Green" }, { c: "#8A9099", n: "Steel Grey" }].map((col, i) => (
                <div key={col.n} title={col.n} style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: col.c, border: "2px solid white",
                  boxShadow: `0 0 0 ${i === 2 ? 2 : 1}px ${i === 2 ? "#7F2A3C" : "#D8D0C5"}`,
                  cursor: "pointer", transition: "transform 0.2s",
                }} />
              ))}
            </div>
          </div>

          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "#2A2A2A" }}>Quantity</span>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid rgba(127,42,60,0.25)" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: "38px", height: "38px", background: "none", border: "none", fontSize: "1.2rem", color: "#2A2A2A" }}>−</button>
              <span style={{ width: "44px", textAlign: "center", fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: "38px", height: "38px", background: "none", border: "none", fontSize: "1.2rem", color: "#2A2A2A" }}>+</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <button onClick={handleAdd} style={{
              flex: 1, padding: "16px",
              background: "#7F2A3C", color: "#EDE6DB",
              border: "none", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1C1C1C"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#7F2A3C"; e.currentTarget.style.transform = ""; }}
            >Add to Cart</button>
            <button style={{
              flex: 1, padding: "16px",
              background: "#7F2A3C", color: "white",
              border: "none", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1C1C1C"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#7F2A3C"; e.currentTarget.style.transform = ""; }}
            >Buy Now</button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "14px", background: "#E4DDD4" }}>
            {["🚚 Free Shipping ₹1250+", "↩ 7-Day Returns", "◇ Carbon Neutral"].map(t => (
              <span key={t} style={{ fontSize: "0.72rem", color: "#2A2A2A", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: "fixed", bottom: "32px", left: "50%", transform: `translate(-50%, ${toast ? 0 : "80px"})`,
        background: "#7F2A3C", color: "#EDE6DB", padding: "14px 28px",
        fontSize: "0.82rem", letterSpacing: "0.08em", zIndex: 800,
        opacity: toast ? 1 : 0, transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: "0 12px 40px rgba(127,42,60,0.3)",
      }}>
        ✓ Added to cart — ₹{(1249 * qty).toLocaleString()}
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
        background: "linear-gradient(135deg, #1C1C1C 55%, #E4DDD4 55%)",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        alignItems: "center", padding: "80px 48px",
      }}>
        <div>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Our Story</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,4vw,4.5rem)", color: "#EDE6DB", marginTop: "16px", lineHeight: 1.08, fontWeight: 400 }}>
            Where Fashion<br />Meets<br /><em style={{ color: "#7F2A3C" }}>Conscience.</em>
          </h1>
          <p style={{ color: "rgba(237,230,219,0.75)", marginTop: "24px", lineHeight: 1.9, fontSize: "0.95rem", fontWeight: 300, maxWidth: "380px" }}>
            We believe the most beautiful things are made with intention — for the planet, and for the people who inhabit it.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "#F2EDE6", padding: "48px 40px",
            boxShadow: "40px 40px 0 rgba(127,42,60,0.15)",
            maxWidth: "380px", width: "100%",
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.4rem", color: "#7F2A3C", lineHeight: 1.6, marginBottom: "20px" }}>
              "What if one bag could carry your whole world — without costing the world anything?"
            </div>
            <div style={{ fontSize: "0.78rem", color: "#5E6472", textTransform: "uppercase", letterSpacing: "0.1em" }}>— Adya Gupta, Founder</div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div style={{ padding: "100px 48px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>What Drives Us</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            Mission & <em>Vision</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          {[
            { icon: "◆", title: "Our Mission", color: "#E4DDD4", accent: "#7F2A3C", text: "To create versatile, sustainable fashion that empowers both the wearer and the maker. Every IMPACKT bag is a bridge between conscious consumption and genuine social impact — where style and purpose are never in conflict." },
            { icon: "✦", title: "Our Vision", color: "#EDE6DB", accent: "#7F2A3C", text: "A world where fashion heals rather than harms — where artisan communities thrive, natural materials are celebrated, and every purchase plants seeds of positive change. We envision IMPACKT as a movement, not just a brand." },
          ].map(card => (
            <div key={card.title} className="reveal" style={{
              background: card.color, padding: "48px 40px",
              borderTop: `4px solid ${card.accent}`, transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(28,28,28,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "20px" }}>{card.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "16px", color: "#1C1C1C" }}>{card.title}</h3>
              <p style={{ color: "#2A2A2A", lineHeight: 1.9, fontSize: "0.92rem", fontWeight: 300 }}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inspiration */}
      <div style={{ background: "#F2EDE6", padding: "80px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div className="reveal">
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>The Spark</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", marginTop: "12px", marginBottom: "24px", fontWeight: 400, lineHeight: 1.2 }}>
              Born from a<br /><em>Daily Dilemma</em>
            </h2>
            <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "16px" }}>
              Adya was juggling three bags — one for her laptop, one for her gym kit, one for evenings out. She looked around and saw the same story everywhere: over-purchased, under-used bags piling up in cupboards while landfills grew.
            </p>
            <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "16px" }}>
              While studying in Pune, she stumbled upon the Nysa Foundation — a workshop where women from marginalised communities were learning to stitch. Skilled hands with nowhere to channel their art. The idea crystallised: create one beautifully designed bag that could do it all, handmade by artisans who deserved the opportunity.
            </p>
            <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300 }}>
              A year, 47 prototypes, and countless cups of chai later — IMPACKT was born.
            </p>
          </div>
          <div className="reveal reveal-d2" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[
              { year: "2024", event: "Adya discovers the Nysa Foundation workshop in Pune, while in college" },
              { year: "2025 Jan", event: "First prototype created, partnership with NGO Nysa Foundation formalized" },
              { year: "2025 Dec", event: "IMPACKT launches with its first handmade bags" },
              { year: "2026", event: "40+ artisans supported, 200+ bags created" },
            ].map(item => (
              <div key={item.year} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#7F2A3C", fontWeight: 500, minWidth: "44px" }}>{item.year}</div>
                <div style={{ width: "1px", background: "rgba(127,42,60,0.25)", alignSelf: "stretch", flexShrink: 0 }} />
                <div style={{ fontSize: "0.88rem", color: "#2A2A2A", lineHeight: 1.7, fontWeight: 300, paddingTop: "2px" }}>{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder */}
      <div style={{ padding: "100px 48px", background: "#EDE6DB" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>From the Founder</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            A Personal <em>Message</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "64px", alignItems: "start" }}>
          <div className="reveal" style={{ position: "relative" }}>
            <div style={{
              aspectRatio: "3/4", background: "linear-gradient(145deg, #D8D0C5, #5E6472)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "6rem",
            }}>
              ◆
            </div>
            <div style={{ position: "absolute", bottom: "-16px", right: "-16px", width: "100%", height: "100%", border: "2px solid #7F2A3C", zIndex: -1 }} />
          </div>
          <div className="reveal reveal-d2">
            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", fontStyle: "italic", color: "#1C1C1C", lineHeight: 1.65, marginBottom: "28px", fontWeight: 400 }}>
              "I was a college student in Pune with too many bags and not enough answers. IMPACKT started as a question — can something beautiful also be good? Turns out, it can. It just needs intention."
            </blockquote>
            <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "18px" }}>
              When I first walked into the Nysa Foundation workshop in Pune, I wasn't expecting to find my calling. But watching women stitch with quiet precision — women who had never been given a formal stage for their skill — I understood what IMPACKT needed to be. Not a charity. Not a corporation. Something in between, where craft and commerce could lift each other.
            </p>
            <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "18px" }}>
              Every bag we make carries the fingerprints of someone who poured real care into it. When you carry an IMPACKT bag, you're carrying their story — and honestly, I think that's what makes it the most beautiful thing in the room.
            </p>
            <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "32px" }}>
              We're early. We're small. But we're building something honest, and I'm grateful you're here for it.
            </p>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#7F2A3C", fontStyle: "italic" }}>Adya Gupta</div>
            <div style={{ fontSize: "0.72rem", color: "#5E6472", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Founder & Creative Director, IMPACKT</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "60px 48px", background: "#1C1C1C" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#EDE6DB", fontWeight: 400, marginBottom: "24px" }}>
          Ready to be part of the story?
        </h3>
        <button onClick={() => setPage("product")} style={{
          background: "#7F2A3C", color: "#1C1C1C", border: "none",
          padding: "16px 40px", fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700,
          transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#EDE6DB"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#7F2A3C"; e.currentTarget.style.transform = ""; }}
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
    { name: "Savita Devi", role: "Master Stitcher · 8 Months", quote: "This work gave me dignity. Now I teach 12 other women what I learned.", emoji: "👩‍🎨", bg: "#E4DDD4" },
    { name: "Geeta Sharma", role: "Bag Constructor · 5 Months", quote: "I used to wonder how I'd pay school fees. Now I'm saving for my daughter's college.", emoji: "👩‍💼", bg: "#E4DDD4" },
    { name: "Rani Kumari", role: "Quality Lead · 6 Months", quote: "Every bag I approve, I know will last years. That pride — nothing can replace it.", emoji: "👩‍🔬", bg: "#EDE6DB" },
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
        background: "linear-gradient(135deg, #EDE6DB 0%, #E4DDD4 45%, #E4DDD4 100%)",
        padding: "100px 48px 0", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 25% 50%, rgba(127,42,60,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(127,42,60,0.08) 0%, transparent 50%)" }} />
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Social Impact</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,5vw,5rem)", color: "#1C1C1C", marginTop: "16px", lineHeight: 1.08, fontWeight: 400, position: "relative", zIndex: 1 }}>
          Crafting Change<br /><em style={{ color: "#7F2A3C" }}>Together</em>
        </h1>
        <p style={{ color: "#2A2A2A", maxWidth: "580px", margin: "24px auto 0", lineHeight: 1.9, fontSize: "1rem", fontWeight: 300 }}>
          In partnership with the Nysa Foundation in Pune, we're not just making bags — we're building livelihoods, restoring dignity, and proving that beautiful things can come from purposeful places.
        </p>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2px", marginTop: "60px" }}>
          {[["75+", "People Trained"], ["80+", "Women Employed"], ["200+", "Bags Produced"], ["₹11L+", "Wages Paid"]].map(([num, label]) => (
            <div key={label} style={{ background: "rgba(127,42,60,0.06)", padding: "36px 24px", borderTop: "1px solid rgba(127,42,60,0.12)" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", color: "#7F2A3C", fontWeight: 500 }}>{num}</div>
              <div style={{ fontSize: "0.78rem", color: "#2A2A2A", letterSpacing: "0.08em", marginTop: "6px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: "100px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", background: "#F2EDE6" }}>
        <div className="reveal">
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>The Partnership</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", marginTop: "12px", marginBottom: "24px", fontWeight: 400, lineHeight: 1.2 }}>
            More Than a<br />Supply Chain
          </h2>
          <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "18px" }}>
            Nysa Foundation has spent over a decade working in marginalised communities across Pune, identifying women and youth with potential and providing them real pathways to economic independence.
          </p>
          <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300, marginBottom: "18px" }}>
            IMPACKT didn't walk in with a charity model. We walked in as partners, asking: "What do your artisans need to build lasting careers?" The answer shaped everything — our production model, our quality standards, our pricing, our timelines.
          </p>
          <p style={{ color: "#2A2A2A", lineHeight: 1.95, fontSize: "0.9rem", fontWeight: 300 }}>
            Today, every IMPACKT workshop session is co-designed with Nysa's team. Artisans receive fair wages, social security, childcare support, and a stake in the quality they deliver. This is what ethical production actually looks like.
          </p>
        </div>
        <div className="reveal reveal-d2" style={{
          background: "linear-gradient(135deg, #E4DDD4, #E4DDD4)",
          padding: "60px 48px", position: "relative",
        }}>
          <div style={{ fontSize: "4rem", textAlign: "center", marginBottom: "24px", color: "#7F2A3C" }}>◈</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontStyle: "italic", textAlign: "center", color: "#1C1C1C", lineHeight: 1.65, marginBottom: "20px" }}>
            "IMPACKT doesn't buy our labour — they invest in our people. That difference changes everything."
          </div>
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#5E6472", textTransform: "uppercase", letterSpacing: "0.1em" }}>— Prabhavati Singh, Director, Nysa Foundation</div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #7F2A3C, #A0445A, #7F2A3C)" }} />
        </div>
      </div>

      {/* Training Programs */}
      <div style={{ padding: "100px 48px", background: "#EDE6DB" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Skill Development</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            Training <em>Programs</em>
          </h2>
          <p style={{ maxWidth: "520px", margin: "16px auto 0", color: "#2A2A2A", lineHeight: 1.8, fontSize: "0.9rem", fontWeight: 300 }}>Four distinct pathways, each designed to build real, marketable expertise — not just short-term employment.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
          {programs.map((p, i) => (
            <div key={p.title} className={`reveal reveal-d${i + 1}`} style={{
              padding: "36px 24px", border: "1px solid rgba(127,42,60,0.18)",
              textAlign: "center", background: "#F2EDE6", transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#7F2A3C"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(127,42,60,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(127,42,60,0.18)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ fontSize: "2.8rem", marginBottom: "16px" }}>{p.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 400, marginBottom: "12px" }}>{p.title}</h3>
              <p style={{ color: "#2A2A2A", fontSize: "0.82rem", lineHeight: 1.8, fontWeight: 300, marginBottom: "16px" }}>{p.desc}</p>
              <div style={{ display: "inline-block", background: "#E4DDD4", color: "#7F2A3C", padding: "4px 14px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em" }}>{p.participants}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Behind the Scenes */}
      <div style={{ padding: "80px 48px", background: "#1C1C1C" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Behind the Scenes</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", color: "#EDE6DB", marginTop: "12px", fontWeight: 400 }}>
            Where Every Bag <em>Begins</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "240px 240px", gap: "12px" }}>
          {[
            { emoji: "🧵", label: "Pattern Cutting", size: "2fr", row: "1/3", bg: "linear-gradient(135deg,#7F2A3C,#A0445A)" },
            { emoji: "🪡", label: "Precision Stitching", bg: "linear-gradient(135deg,#7F2A3C,#A0445A)" },
            { emoji: "✂️", label: "Fabric Selection", bg: "linear-gradient(135deg,#7F2A3C,#A0445A)" },
            { emoji: "🔨", label: "Hardware Assembly", bg: "linear-gradient(135deg,#1C1C1C,#2A2A2A)" },
            { emoji: "🔍", label: "Quality Inspection", bg: "linear-gradient(135deg,#5E6472,#2A2A2A)" },
          ].map((item, i) => (
            <div key={item.label} className="reveal" style={{
              background: item.bg,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gridRow: i === 0 ? "1/3" : undefined,
              transition: "transform 0.4s", overflow: "hidden",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}
            >
              <div style={{ fontSize: i === 0 ? "4rem" : "2.8rem", marginBottom: "12px" }}>{item.emoji}</div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(237,230,219,0.9)", fontWeight: 600 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meet the Artisans */}
      <div style={{ padding: "100px 48px", background: "#EDE6DB" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Human Stories</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            Meet the <em>Artisans</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "28px" }}>
          {artisans.map((a, i) => (
            <div key={a.name} className={`reveal reveal-d${i + 1}`} style={{
              background: "#F2EDE6", overflow: "hidden", transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(28,28,28,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ background: a.bg, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4.5rem" }}>{a.emoji}</div>
              <div style={{ padding: "24px 28px" }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 400, marginBottom: "4px" }}>{a.name}</h4>
                <div style={{ fontSize: "0.7rem", color: "#7F2A3C", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "14px" }}>{a.role}</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1rem", color: "#2A2A2A", lineHeight: 1.75 }}>"{a.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Created */}
      <div style={{ padding: "80px 48px", background: "linear-gradient(135deg, #E4DDD4, #EDE6DB)" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>By the Numbers</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,3vw,2.8rem)", marginTop: "12px", fontWeight: 400 }}>
            Social Impact <em>Created</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "28px" }}>
          {[
            { icon: "👩‍🏫", num: "75+", label: "People Trained", sub: "Across 3 districts in Delhi NCR" },
            { icon: "👩", num: "80+", label: "Women Employed", sub: "78% first-time earners in their families" },
            { icon: "👜", num: "200+", label: "Bags Crafted", sub: "Each traceable to its artisan" },
            { icon: "💰", num: "₹11L+", label: "Wages Distributed", sub: "30% above regional market rate" },
            { icon: "🎓", num: "96%", label: "Skill Graduation Rate", sub: "Among enrolled trainees" },
            { icon: "◇", num: "100%", label: "Eco-Certified Materials", sub: "GOTS & Oeko-Tex certified" },
          ].map((stat, i) => (
            <div key={stat.label} className={`reveal`} style={{
              background: "#F2EDE6", padding: "36px 28px", textAlign: "center",
              borderBottom: "3px solid #5E6472", transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderBottomColor = "#7F2A3C"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(28,28,28,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderBottomColor = "#5E6472"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{stat.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: "#7F2A3C", fontWeight: 500 }}>{stat.num}</div>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1C1C1C", marginTop: "8px" }}>{stat.label}</div>
              <div style={{ fontSize: "0.75rem", color: "#5E6472", marginTop: "6px", lineHeight: 1.5 }}>{stat.sub}</div>
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
    { q: "What materials are used in IMPACKT bags?", a: "All our bags use GOTS-certified organic cotton canvas, recycled polyester lining, brass hardware, and natural plant-based dyes. Every material is carefully sourced for both quality and environmental impact." },
    { q: "How does the tote-to-backpack conversion work?", a: "It's a simple, elegant mechanism — hidden straps unfold from a concealed zipper compartment on the back panel. The transformation takes under 10 seconds and requires no clips or complicated adjustments." },
    { q: "Do you ship internationally?", a: "Yes! We ship to 28 countries. International orders typically arrive in 10–14 business days. Shipping is free on all orders above ₹5,000 (or equivalent)." },
    { q: "What is your return/exchange policy?", a: "We offer 7-day free returns on all unused bags in original condition. For exchanges, we cover return shipping. We want you to love your IMPACKT bag completely." },
    { q: "Can I visit the artisan workshop?", a: "We host quarterly 'Open Workshop' days in partnership with Nysa Foundation. Sign up for our newsletter to get early access to upcoming workshop visit dates." },
    { q: "Is my purchase making a real difference?", a: "Absolutely. 15% of every sale funds training wages, 5% goes to raw material support for artisans, and we publish an annual impact report with full transparency on where every rupee goes." },
  ];

  return (
    <div className="page-enter" style={{ paddingTop: "80px" }}>
      <div style={{ padding: "80px 48px 40px", textAlign: "center", background: "#F2EDE6", borderBottom: "1px solid rgba(127,42,60,0.15)" }}>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>Get in Touch</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,4vw,3.8rem)", color: "#1C1C1C", marginTop: "12px", fontWeight: 400 }}>
          We'd Love to <em>Hear</em> From You
        </h1>
        <p style={{ color: "#2A2A2A", maxWidth: "480px", margin: "16px auto 0", lineHeight: 1.85, fontSize: "0.92rem", fontWeight: 300 }}>
          Questions, collaborations, press inquiries, or just want to say hello — our team typically responds within 24 hours.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Form */}
        <div style={{ padding: "60px 48px", background: "#F2EDE6" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 400, marginBottom: "32px" }}>Send a Message</h2>

          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>◆</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400, marginBottom: "12px" }}>Message Received!</h3>
              <p style={{ color: "#2A2A2A", fontSize: "0.9rem", fontWeight: 300 }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div>
              {[["name", "Your Name", "text"], ["email", "Email Address", "email"], ["subject", "Subject", "text"]].map(([key, label, type]) => (
                <div key={key} style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2A2A2A", fontWeight: 600, marginBottom: "8px" }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{
                    width: "100%", padding: "13px 16px",
                    border: "1.5px solid rgba(127,42,60,0.22)", background: "#EDE6DB",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#1C1C1C",
                    outline: "none", transition: "border-color 0.25s",
                  }}
                    onFocus={e => e.target.style.borderColor = "#7F2A3C"}
                    onBlur={e => e.target.style.borderColor = "rgba(127,42,60,0.22)"}
                  />
                </div>
              ))}
              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2A2A2A", fontWeight: 600, marginBottom: "8px" }}>Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} style={{
                  width: "100%", padding: "13px 16px",
                  border: "1.5px solid rgba(127,42,60,0.22)", background: "#EDE6DB",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#1C1C1C",
                  resize: "vertical", outline: "none", transition: "border-color 0.25s",
                }}
                  onFocus={e => e.target.style.borderColor = "#7F2A3C"}
                  onBlur={e => e.target.style.borderColor = "rgba(127,42,60,0.22)"}
                />
              </div>
              <button onClick={() => setSent(true)} style={{
                width: "100%", padding: "16px",
                background: "#7F2A3C", color: "#EDE6DB",
                border: "none", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600,
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1C1C1C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#7F2A3C"; }}
              >
                Send Message
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "60px 48px", background: "#1C1C1C", color: "#EDE6DB" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 400, color: "#EDE6DB", marginBottom: "40px" }}>Contact Info</h2>

          {[
            { icon: "📧", title: "Email Us", info: "hello@impackt.in", sub: "We respond within 24 hours" },
            { icon: "📍", title: "Studio", info: "Hauz Khas Village, New Delhi 110016", sub: "Visits by appointment" },
            { icon: "📞", title: "WhatsApp", info: "+91 98765 43210", sub: "Mon–Sat, 10am–6pm IST" },
          ].map(item => (
            <div key={item.title} style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
              <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "#7F2A3C", marginBottom: "6px" }}>{item.title}</h4>
                <p style={{ color: "#EDE6DB", fontSize: "0.92rem", marginBottom: "3px" }}>{item.info}</p>
                <p style={{ color: "rgba(237,230,219,0.55)", fontSize: "0.78rem" }}>{item.sub}</p>
              </div>
            </div>
          ))}

          <div style={{ borderTop: "1px solid rgba(237,230,219,0.12)", paddingTop: "32px", marginTop: "8px" }}>
            <div style={{ fontSize: "0.72rem", color: "#7F2A3C", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>Follow Our Journey</div>
            <div style={{ display: "flex", gap: "12px" }}>
              {["📸 Instagram", "▶️ YouTube"].map(s => (
                <button key={s} style={{
                  background: "rgba(237,230,219,0.08)", color: "rgba(237,230,219,0.85)",
                  border: "1px solid rgba(237,230,219,0.15)", padding: "8px 14px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 500,
                  transition: "all 0.3s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(237,230,219,0.15)"; e.currentTarget.style.borderColor = "#7F2A3C"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(237,230,219,0.08)"; e.currentTarget.style.borderColor = "rgba(237,230,219,0.15)"; }}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: "80px 48px", background: "#E4DDD4" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600 }}>FAQ</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", marginTop: "12px", fontWeight: 400 }}>
            Common <em>Questions</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "900px", margin: "0 auto" }}>
          {faqs.map((faq, i) => (
            <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{
              background: "#F2EDE6", padding: "24px 28px",
              borderLeft: `3px solid ${open === i ? "#7F2A3C" : "#5E6472"}`,
              cursor: "pointer", transition: "all 0.3s",
              boxShadow: open === i ? "0 8px 32px rgba(28,28,28,0.08)" : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1C1C1C", lineHeight: 1.5 }}>{faq.q}</div>
                <span style={{ color: "#7F2A3C", flexShrink: 0, fontSize: "1.1rem", transition: "transform 0.3s", transform: open === i ? "rotate(45deg)" : "" }}>+</span>
              </div>
              {open === i && <p style={{ color: "#2A2A2A", fontSize: "0.84rem", lineHeight: 1.85, marginTop: "14px", fontWeight: 300, borderTop: "1px solid rgba(127,42,60,0.1)", paddingTop: "14px" }}>{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────── */
function Footer({ setPage }) {
  return (
    <footer style={{ background: "#1C1C1C", color: "#EDE6DB", padding: "64px 48px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", letterSpacing: "0.1em", fontWeight: 500, marginBottom: "16px" }}>
            IM<span style={{ color: "#7F2A3C" }}>PACKT</span>
          </div>
          <p style={{ color: "rgba(237,230,219,0.55)", fontSize: "0.86rem", lineHeight: 1.85, fontWeight: 300, maxWidth: "260px" }}>
            Handcrafted convertible bags made by artisan communities. Fashion that transforms, purpose that endures.
          </p>
          <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
            {["📸", "▶️"].map(icon => (
              <button key={icon} style={{
                width: "38px", height: "38px",
                background: "rgba(237,230,219,0.08)",
                border: "1px solid rgba(237,230,219,0.12)",
                color: "#EDE6DB", fontSize: "1rem",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(237,230,219,0.16)"; e.currentTarget.style.borderColor = "#7F2A3C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(237,230,219,0.08)"; e.currentTarget.style.borderColor = "rgba(237,230,219,0.12)"; }}
              >{icon}</button>
            ))}
          </div>
        </div>

        {[
          { heading: "Shop", links: [["product", "The Convertible Bag"]] },
          { heading: "Company", links: [["story", "Our Story"], ["ngo", "NGO Impact"]] },
          { heading: "Help", links: [["contact", "Contact Us"], ["contact", "FAQs"], ["contact", "Shipping & Returns"]] },
        ].map(col => (
          <div key={col.heading}>
            <h4 style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#7F2A3C", fontWeight: 600, marginBottom: "20px" }}>{col.heading}</h4>
            <ul style={{ listStyle: "none" }}>
              {col.links.map(([page, label]) => (
                <li key={label} style={{ marginBottom: "12px" }}>
                  <button onClick={() => setPage(page)} style={{
                    background: "none", border: "none", color: "rgba(237,230,219,0.55)",
                    fontSize: "0.86rem", fontWeight: 300, fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.25s", padding: 0,
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = "#EDE6DB"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(237,230,219,0.55)"}
                  >{label}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(237,230,219,0.1)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "0.76rem", color: "rgba(237,230,219,0.3)" }}>© 2025 IMPACKT. All rights reserved. Crafted with ✦ in Delhi, India.</p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy Policy", "Terms of Service"].map(link => (
            <button key={link} style={{ background: "none", border: "none", color: "rgba(237,230,219,0.3)", fontSize: "0.76rem", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(237,230,219,0.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(237,230,219,0.3)"}
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
  const [cartItems, setCartItems] = useState([]);
  const [pageKey, setPageKey] = useState(0);

  const changePage = (newPage) => {
    setPage(newPage);
    setPageKey(k => k + 1);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch(e) {}
  };

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i);
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <style>{css}</style>
      <CustomCursor />
      <div className="grain" />

      <Nav page={page} setPage={changePage} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onRemove={removeFromCart} onCheckout={() => setCartOpen(false)} />

      <main key={pageKey}>
        {page === "home" && <HomePage setPage={changePage} onAddCart={addToCart} />}
        {page === "product" && <ProductPage onAddCart={addToCart} />}
        {page === "story" && <StoryPage setPage={changePage} />}
        {page === "ngo" && <NgoPage />}
        {page === "contact" && <ContactPage />}
      </main>

      <Footer setPage={changePage} />
    </>
  );
}