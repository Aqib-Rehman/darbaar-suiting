import { useState, useEffect, useRef } from "react";

// ─── Brand Palette (extracted from logo) ────────────────────
const T = {
  navy:       "#1B2A6B",
  navyDeep:   "#111D4E",
  navyLight:  "#243580",
  gold:       "#C9A84C",
  goldLight:  "#E2C97E",
  goldDark:   "#A07C2D",
  bronze:     "#6B5A3E",
  greige:     "#C4A882",
  cream:      "#F5F0E8",
  creamDark:  "#EDE4D3",
  white:      "#FFFFFF",
  dark:       "#0A1020",
  darkCard:   "#0F1830",
  muted:      "#8A9BB5",
  success:    "#2E7D52",
  danger:     "#8B2020",
};

// ─── Google Fonts inject ─────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ─── Global Styles ───────────────────────────────────────────
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${T.dark}; color: ${T.cream}; font-family: 'Raleway', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.navyDeep}; }
  ::-webkit-scrollbar-thumb { background: ${T.gold}; border-radius: 3px; }
  ::selection { background: ${T.gold}40; color: ${T.cream}; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0%,100% { opacity:.6; } 50% { opacity:1; } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes slideIn  { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes pulse    { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); } }
  @keyframes goldGlow { 0%,100% { box-shadow:0 0 12px ${T.gold}40; } 50% { box-shadow:0 0 28px ${T.gold}80; } }

  .fade-up   { animation: fadeUp .7s ease forwards; }
  .fade-in   { animation: fadeIn .5s ease forwards; }
  .shimmer   { animation: shimmer 2.4s ease infinite; }
  .gold-glow { animation: goldGlow 3s ease infinite; }

  .btn-gold {
    background: linear-gradient(135deg, ${T.goldDark}, ${T.gold}, ${T.goldLight});
    color: ${T.dark};
    border: none;
    padding: 12px 32px;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all .3s;
    font-weight: 600;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 24px ${T.gold}50; }

  .btn-outline {
    background: transparent;
    color: ${T.gold};
    border: 1px solid ${T.gold}60;
    padding: 10px 28px;
    font-family: 'Cinzel', serif;
    font-size: 12px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all .3s;
  }
  .btn-outline:hover { background: ${T.gold}15; border-color: ${T.gold}; }

  .card-luxury {
    background: linear-gradient(145deg, ${T.darkCard}, ${T.navyDeep});
    border: 1px solid ${T.gold}25;
    transition: all .35s;
    position: relative;
    overflow: hidden;
  }
  .card-luxury::before {
    content:'';
    position:absolute;
    top:0; left:0; right:0;
    height:2px;
    background: linear-gradient(90deg, transparent, ${T.gold}80, transparent);
    opacity:0;
    transition: opacity .35s;
  }
  .card-luxury:hover { border-color:${T.gold}60; transform:translateY(-4px); box-shadow:0 16px 48px ${T.dark}90; }
  .card-luxury:hover::before { opacity:1; }

  .divider-gold {
    display:flex; align-items:center; gap:16px;
    color:${T.gold}; font-size:11px; letter-spacing:3px;
  }
  .divider-gold::before, .divider-gold::after {
    content:''; flex:1;
    height:1px;
    background: linear-gradient(90deg, transparent, ${T.gold}60, transparent);
  }

  input, select, textarea {
    background: ${T.navyDeep};
    border: 1px solid ${T.gold}30;
    color: ${T.cream};
    padding: 12px 16px;
    font-family: 'Raleway', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color .3s;
    width: 100%;
    border-radius: 2px;
  }
  input:focus, select:focus, textarea:focus { border-color: ${T.gold}80; }
  input::placeholder, textarea::placeholder { color: ${T.muted}; }
  select option { background: ${T.navyDeep}; }

  .tag-gold {
    display:inline-block;
    padding:3px 12px;
    background:${T.gold}20;
    border:1px solid ${T.gold}50;
    color:${T.goldLight};
    font-size:10px;
    letter-spacing:2px;
    font-family:'Cinzel',serif;
  }

  .noise-bg {
    position:relative;
  }
  .noise-bg::after {
    content:'';
    position:absolute;
    inset:0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events:none;
    z-index:0;
  }
`;
document.head.appendChild(globalStyle);

// ─── Initial Data ────────────────────────────────────────────
const INIT_PRODUCTS = [
  { id:1, name:"Imperial Navy Suiting", fabric:"Wool Blend", length:"5m", color:"Navy Blue", price:8500, originalPrice:9500, discount:10, stock:15, rating:4.9, reviews:124, badge:"BESTSELLER", description:"Finest wool blend suiting ideal for executive corporate wear. Subtle texture with remarkable drape.", tags:["corporate","formal","summer"] },
  { id:2, name:"Desert Sand Premium", fabric:"Egyptian Cotton", length:"4m", color:"Beige", price:6200, originalPrice:6200, discount:0, stock:8, rating:4.7, reviews:89, badge:"NEW", description:"Ultra-breathable Egyptian cotton in a warm desert tone. Perfect for summer formal occasions.", tags:["summer","casual","formal"] },
  { id:3, name:"Midnight Charcoal Elite", fabric:"Cashmere Mix", length:"5m", color:"Charcoal", price:12000, originalPrice:14000, discount:14, stock:5, rating:5.0, reviews:56, badge:"VIP PICK", description:"Cashmere-infused suiting that commands any boardroom. The ultimate statement of authority.", tags:["premium","winter","formal"] },
  { id:4, name:"Royal Ivory Classic", fabric:"Linen Cotton", length:"4m", color:"Ivory", price:5500, originalPrice:5500, discount:0, stock:20, rating:4.6, reviews:203, badge:"", description:"Crisp linen-cotton blend in classic ivory. Timeless elegance for Eid and formal celebrations.", tags:["eid","formal","summer"] },
  { id:5, name:"Forest Executive", fabric:"Wool Blend", length:"5m", color:"Forest Green", price:9200, originalPrice:10500, discount:12, stock:7, rating:4.8, reviews:67, badge:"TRENDING", description:"Deep forest green in premium wool blend. For the executive who stands apart from the crowd.", tags:["corporate","formal","winter"] },
  { id:6, name:"Classic Oxford Grey", fabric:"Pure Wool", length:"5m", color:"Oxford Grey", price:11000, originalPrice:11000, discount:0, stock:12, rating:4.9, reviews:178, badge:"CLASSIC", description:"Pure wool in timeless oxford grey. The foundation of every gentleman's wardrobe.", tags:["corporate","formal","winter","classic"] },
];

const COLORS_PALETTE = ["Navy Blue","Charcoal","Beige","Ivory","Forest Green","Oxford Grey","Burgundy","Slate Blue","Camel","Black"];
const FABRICS = ["All","Wool Blend","Egyptian Cotton","Cashmere Mix","Linen Cotton","Pure Wool"];
const LENGTHS = ["All","4m","5m"];

// ─── Utility ─────────────────────────────────────────────────
const fmt = (n) => `PKR ${Number(n).toLocaleString()}`;
const uid = () => Math.random().toString(36).slice(2,9);

// ─── Logo SVG (Arch + Needle) ────────────────────────────────
// viewBox kept square so it never overflows its container
function LogoMark({ size = 36 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 60 60"
      fill="none"
      style={{ display:"block", flexShrink:0, overflow:"visible" }}
    >
      {/* Arch */}
      <path d="M30 3 C16 3 9 16 9 27 L9 54 L51 54 L51 27 C51 16 44 3 30 3Z"
        fill="none" stroke={T.gold} strokeWidth="2.2" strokeLinejoin="round"/>
      {/* Inner arch hint */}
      <path d="M21 54 L21 28 C21 21 25 15 30 13 C35 15 39 21 39 28 L39 54"
        fill="none" stroke={T.gold} strokeWidth="1" opacity="0.45"/>
      {/* Needle shaft */}
      <line x1="30" y1="9" x2="30" y2="56" stroke={T.goldLight} strokeWidth="1.4"/>
      {/* Needle eye */}
      <ellipse cx="30" cy="12" rx="2.5" ry="1.8" fill={T.gold}/>
      {/* Needle tip */}
      <path d="M28 56 L30 60 L32 56" fill={T.gold}/>
    </svg>
  );
}

// ─── Star Rating ──────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={{ color: T.gold, fontSize: 13 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: T.muted, fontSize: 11, marginLeft: 6 }}>{rating}</span>
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", bottom:32, right:32, zIndex:9999,
      background:`linear-gradient(135deg, ${T.navyDeep}, ${T.darkCard})`,
      border:`1px solid ${T.gold}60`, padding:"16px 24px",
      fontFamily:"'Raleway',sans-serif", fontSize:14, color:T.cream,
      boxShadow:`0 8px 32px ${T.dark}`,
      animation:"slideIn .4s ease",
      display:"flex", alignItems:"center", gap:12, minWidth:280,
    }}>
      <span style={{ color:T.gold, fontSize:18 }}>✦</span>
      {msg}
      <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:18 }}>×</button>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────
function Navbar({ page, setPage, cartCount, isAdmin, setIsAdmin, user, setUser }) {
  const navLinks = isAdmin
    ? [["home","HOME"],["shop","SHOP"],["women","WOMEN"],["admin","ADMIN"]]
    : [["home","HOME"],["shop","SHOP"],["women","WOMEN"]];

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background:`${T.navyDeep}F8`,
      backdropFilter:"blur(20px)",
      WebkitBackdropFilter:"blur(20px)",
      borderBottom:`1px solid ${T.gold}30`,
      padding:"0 48px",
      height:68,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      boxShadow:`0 4px 32px ${T.dark}80`,
    }}>

      {/* ── Brand Logo ── */}
      <div
        onClick={() => setPage("home")}
        style={{
          display:"flex", alignItems:"center", gap:10,
          cursor:"pointer", flexShrink:0,
          overflow:"hidden",          // keeps SVG clipped to this container
        }}
      >
        {/* SVG is strictly 40×40 — no bleed into navbar */}
        <div style={{ width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <LogoMark size={38} />
        </div>
        <div style={{ lineHeight:1 }}>
          <div style={{
            fontFamily:"'Cinzel',serif",
            fontSize:16,
            fontWeight:700,
            letterSpacing:"0.22em",
            color:T.cream,
          }}>DARBAAR</div>
          <div style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:10,
            fontStyle:"italic",
            letterSpacing:"0.25em",
            color:T.gold,
            marginTop:2,
          }}>— Suiting —</div>
        </div>
      </div>

      {/* ── Nav Links ── */}
      <div style={{ display:"flex", gap:36, alignItems:"center" }}>
        {navLinks.map(([k,l]) => (
          <button key={k} onClick={() => setPage(k)} style={{
            background:"none", border:"none", cursor:"pointer", padding:"4px 0",
            fontFamily:"'Cinzel',serif",
            fontSize:10,
            fontWeight:600,
            letterSpacing:"0.25em",
            color: page===k ? T.gold : T.greige,
            borderBottom: page===k ? `1px solid ${T.gold}` : "1px solid transparent",
            transition:"color .25s, border-color .25s",
          }}>{l}</button>
        ))}
      </div>

      {/* ── Right Actions ── */}
      <div style={{ display:"flex", alignItems:"center", gap:24, flexShrink:0 }}>

        {/* Cart icon */}
        <button onClick={() => setPage("cart")} style={{
          background:"none", border:"none", cursor:"pointer",
          position:"relative", display:"flex", alignItems:"center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke={page==="cart" ? T.gold : T.greige} strokeWidth="1.6">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position:"absolute", top:-5, right:-7,
              background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,
              color:T.dark, borderRadius:"50%",
              width:16, height:16, fontSize:9, fontWeight:800,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Cinzel',serif",
            }}>{cartCount}</span>
          )}
        </button>

        {/* Auth */}
        {user ? (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontStyle:"italic", fontSize:14,
              color:T.gold,
            }}>
              {isAdmin ? "Admin" : user.name.split(" ")[0]}
            </span>
            <button
              onClick={() => { setUser(null); setIsAdmin(false); setPage("home"); }}
              style={{
                background:"none",
                border:`1px solid ${T.gold}50`,
                color:T.gold,
                padding:"5px 14px",
                fontFamily:"'Cinzel',serif",
                fontSize:9, letterSpacing:"0.2em",
                cursor:"pointer", transition:"all .25s",
              }}
            >LOGOUT</button>
          </div>
        ) : (
          <button
            onClick={() => setPage("login")}
            className="btn-gold"
            style={{ padding:"8px 22px", fontSize:10, letterSpacing:"0.2em" }}
          >SIGN IN</button>
        )}
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ setPage, products }) {
  const featured = products.filter(p => p.badge).slice(0,3);
  return (
    <div>
      {/* Hero */}
      <div className="noise-bg" style={{
        minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        background:`linear-gradient(135deg, ${T.dark} 0%, ${T.navyDeep} 50%, ${T.dark} 100%)`,
        position:"relative", overflow:"hidden",
      }}>
        {/* Decorative arch shapes */}
        <div style={{
          position:"absolute", top:"10%", right:"8%", opacity:.06,
          fontSize:320, fontFamily:"'Cinzel',serif", color:T.gold,
          userSelect:"none", lineHeight:1,
        }}>⌂</div>
        <div style={{
          position:"absolute", bottom:"-5%", left:"-3%",
          width:500, height:500, borderRadius:"50%",
          background:`radial-gradient(circle, ${T.navy}40 0%, transparent 70%)`,
        }}/>
        <div style={{
          position:"absolute", top:"20%", left:"5%",
          width:1, height:200,
          background:`linear-gradient(180deg, transparent, ${T.gold}60, transparent)`,
        }}/>
        <div style={{
          position:"absolute", top:"20%", right:"5%",
          width:1, height:200,
          background:`linear-gradient(180deg, transparent, ${T.gold}60, transparent)`,
        }}/>

        <div style={{ textAlign:"center", zIndex:1, padding:"0 20px" }}>
          <div className="fade-up" style={{ animationDelay:".1s" }}>
            <div className="tag-gold" style={{ marginBottom:28 }}>EST. — PREMIUM UNSTITCHED SUITING</div>
          </div>
          <div className="fade-up" style={{ animationDelay:".25s" }}>
            <LogoMark size={64} />
          </div>
          <div className="fade-up" style={{ animationDelay:".4s" }}>
            <h1 style={{
              fontFamily:"'Cinzel',serif", fontSize:"clamp(52px,8vw,96px)",
              letterSpacing:"0.18em", color:T.cream,
              margin:"20px 0 0", lineHeight:1,
            }}>DARBAAR</h1>
            <div style={{
              fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,3vw,36px)",
              color:T.gold, fontStyle:"italic", letterSpacing:"0.2em", margin:"4px 0 32px",
            }}>— Suiting —</div>
          </div>
          <div className="fade-up" style={{ animationDelay:".55s" }}>
            <p style={{
              fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(18px,2.5vw,26px)",
              color:T.greige, maxWidth:620, margin:"0 auto 48px",
              lineHeight:1.6, letterSpacing:".04em",
            }}>
              "Premium unstitched suiting for men who dress<br/>
              with <em style={{ color:T.goldLight }}>authority, class, and professionalism.</em>"
            </p>
          </div>
          <div className="fade-up" style={{ animationDelay:".7s", display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-gold" onClick={() => setPage("shop")} style={{ fontSize:13, padding:"14px 40px" }}>
              EXPLORE COLLECTION
            </button>
            <button className="btn-outline" onClick={() => setPage("shop")} style={{ padding:"14px 32px" }}>
              VIEW CATALOG
            </button>
          </div>

          {/* Stats */}
          <div className="fade-up" style={{
            animationDelay:".9s", marginTop:72,
            display:"flex", gap:48, justifyContent:"center", flexWrap:"wrap",
          }}>
            {[["500+","Happy Clients"],["4m & 5m","Premium Lengths"],["100%","Quality Assured"],["3 Days","Delivery"]].map(([n,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:28, color:T.gold }}>{n}</div>
                <div style={{ fontSize:11, color:T.muted, letterSpacing:2, marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ padding:"40px 60px 0" }}>
        <div className="divider-gold">FEATURED COLLECTION</div>
      </div>

      {/* Featured Products */}
      <div style={{ padding:"48px 60px", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:24 }}>
        {featured.map((p,i) => (
          <ProductCard key={p.id} product={p} index={i} onView={() => setPage("shop")} />
        ))}
      </div>

      {/* Brand Promise */}
      <div style={{
        padding:"80px 60px",
        background:`linear-gradient(135deg, ${T.navyDeep}80, ${T.darkCard}80)`,
        borderTop:`1px solid ${T.gold}20`,
        borderBottom:`1px solid ${T.gold}20`,
        margin:"20px 0",
      }}>
        <div style={{ textAlign:"center", maxWidth:800, margin:"0 auto" }}>
          <div className="divider-gold" style={{ marginBottom:32 }}>WHY DARBAAR</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,48px)", color:T.cream, marginBottom:24, lineHeight:1.3 }}>
            Fabric that commands respect.<br/>
            <em style={{ color:T.gold }}>Tailored to your authority.</em>
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:32, marginTop:48 }}>
            {[
              ["⟡","Premium Lengths","4-meter & 5-meter cuts for superior drape and fit"],
              ["◈","Finest Fabrics","Wool blends, pure cashmere, Egyptian cotton"],
              ["◉","Expert Curation","Each fabric hand-selected by our master tailors"],
              ["◆","Nationwide Delivery","Premium packaging, swift delivery across Pakistan"],
            ].map(([icon,title,desc]) => (
              <div key={title} style={{ textAlign:"center" }}>
                <div style={{ fontSize:28, color:T.gold, marginBottom:12 }}>{icon}</div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:2, color:T.cream, marginBottom:8 }}>{title}</div>
                <div style={{ fontSize:13, color:T.muted, lineHeight:1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ padding:"80px 60px", textAlign:"center" }}>
        <div className="tag-gold" style={{ marginBottom:20 }}>LIMITED STOCK</div>
        <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(24px,4vw,40px)", letterSpacing:".1em", color:T.cream, marginBottom:16 }}>
          Dress Like You Mean Business
        </h2>
        <p style={{ color:T.muted, marginBottom:36, maxWidth:500, margin:"0 auto 36px", fontFamily:"'Cormorant Garamond',serif", fontSize:20 }}>
          Order your premium unstitched suiting today and have it delivered within 3 business days.
        </p>
        <button className="btn-gold" onClick={() => setPage("shop")}>SHOP NOW</button>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────
function ProductCard({ product: p, index, onView, onAddCart }) {
  return (
    <div className="card-luxury fade-up" style={{
      animationDelay:`${index * .12}s`,
      borderRadius:4, overflow:"hidden",
    }}>
      {/* Image placeholder with fabric texture feel */}
      <div style={{
        height:220, position:"relative",
        background:`linear-gradient(145deg, ${T.navyDeep}, ${T.bronze}40, ${T.navyDeep})`,
        display:"flex", alignItems:"center", justifyContent:"center",
        overflow:"hidden",
      }}>
        <div style={{ textAlign:"center", opacity:.5 }}>
          <LogoMark size={48} />
        </div>
        {/* Color swatch */}
        <div style={{
          position:"absolute", bottom:12, left:12, display:"flex", gap:6,
        }}>
          <div style={{ width:16, height:16, borderRadius:"50%", background:T.gold, border:`2px solid ${T.dark}` }}/>
          <div style={{ fontSize:10, color:T.goldLight, alignSelf:"center", letterSpacing:1 }}>{p.color}</div>
        </div>
        {p.badge && (
          <div style={{
            position:"absolute", top:12, right:12,
            background:`linear-gradient(135deg, ${T.goldDark}, ${T.gold})`,
            color:T.dark, padding:"3px 10px",
            fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:2, fontWeight:700,
          }}>{p.badge}</div>
        )}
        {p.discount > 0 && (
          <div style={{
            position:"absolute", top:12, left:12,
            background:T.danger, color:T.cream,
            padding:"3px 10px", fontSize:10, fontFamily:"'Cinzel',serif", letterSpacing:1,
          }}>-{p.discount}%</div>
        )}
      </div>

      <div style={{ padding:24 }}>
        <div style={{ fontSize:10, color:T.gold, letterSpacing:3, fontFamily:"'Cinzel',serif", marginBottom:6 }}>
          {p.fabric} · {p.length}
        </div>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:T.cream, marginBottom:8, lineHeight:1.2 }}>
          {p.name}
        </h3>
        <Stars rating={p.rating} />
        <div style={{ fontSize:11, color:T.muted, marginTop:2, marginBottom:16 }}>{p.reviews} reviews</div>
        <p style={{ fontSize:13, color:T.muted, lineHeight:1.6, marginBottom:20 }}>{p.description}</p>

        <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:20 }}>
          <span style={{ fontFamily:"'Cinzel',serif", fontSize:20, color:T.gold }}>{fmt(p.price)}</span>
          {p.discount > 0 && (
            <span style={{ fontSize:13, color:T.muted, textDecoration:"line-through" }}>{fmt(p.originalPrice)}</span>
          )}
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-gold" style={{ flex:1, padding:"10px 0", fontSize:11 }} onClick={() => onAddCart && onAddCart(p)}>
            ADD TO CART
          </button>
          <button className="btn-outline" style={{ padding:"10px 16px", fontSize:11 }} onClick={onView}>
            VIEW
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SHOP PAGE ────────────────────────────────────────────────
function ShopPage({ products, addToCart, toast }) {
  const [search, setSearch] = useState("");
  const [fabric, setFabric] = useState("All");
  const [length, setLength] = useState("All");
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = products
    .filter(p =>
      (search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase()))) &&
      (fabric === "All" || p.fabric === fabric) &&
      (length === "All" || p.length === length) &&
      p.price <= maxPrice
    )
    .sort((a,b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} addToCart={addToCart} toast={toast} />;
  }

  return (
    <div style={{ paddingTop:72 }}>
      {/* Shop Header */}
      <div style={{
        padding:"60px 60px 40px",
        background:`linear-gradient(135deg, ${T.navyDeep}, ${T.darkCard})`,
        borderBottom:`1px solid ${T.gold}20`,
        textAlign:"center",
      }}>
        <div className="tag-gold" style={{ marginBottom:16 }}>MEN'S COLLECTION</div>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(28px,5vw,52px)", letterSpacing:".1em", color:T.cream }}>
          PREMIUM SUITING
        </h1>
        <p style={{ color:T.muted, marginTop:12, fontFamily:"'Cormorant Garamond',serif", fontSize:18 }}>
          {filtered.length} pieces of exceptional fabric
        </p>
      </div>

      <div style={{ display:"flex", gap:0, minHeight:"80vh" }}>
        {/* Sidebar Filters */}
        <div style={{
          width:280, flexShrink:0,
          background:`linear-gradient(180deg, ${T.darkCard}, ${T.navyDeep}80)`,
          borderRight:`1px solid ${T.gold}20`,
          padding:32,
        }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:3, color:T.gold, marginBottom:24 }}>FILTER & REFINE</div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, color:T.muted, letterSpacing:2, display:"block", marginBottom:8 }}>SEARCH</label>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fabrics, styles..." />
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, color:T.muted, letterSpacing:2, display:"block", marginBottom:8 }}>FABRIC TYPE</label>
            <select value={fabric} onChange={e => setFabric(e.target.value)}>
              {FABRICS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, color:T.muted, letterSpacing:2, display:"block", marginBottom:8 }}>LENGTH</label>
            <select value={length} onChange={e => setLength(e.target.value)}>
              {LENGTHS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, color:T.muted, letterSpacing:2, display:"block", marginBottom:8 }}>
              MAX PRICE — <span style={{ color:T.gold }}>{fmt(maxPrice)}</span>
            </label>
            <input type="range" min={3000} max={20000} step={500} value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)}
              style={{ padding:0, border:"none", background:"transparent", accentColor:T.gold, cursor:"pointer" }}/>
          </div>

          <div style={{ marginBottom:32 }}>
            <label style={{ fontSize:11, color:T.muted, letterSpacing:2, display:"block", marginBottom:8 }}>SORT BY</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <button className="btn-outline" style={{ width:"100%", marginTop:8 }}
            onClick={() => { setSearch(""); setFabric("All"); setLength("All"); setMaxPrice(20000); setSortBy("featured"); }}>
            CLEAR FILTERS
          </button>
        </div>

        {/* Product Grid */}
        <div style={{ flex:1, padding:"40px 40px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:24, alignContent:"start" }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"80px 0", color:T.muted, fontFamily:"'Cormorant Garamond',serif", fontSize:22 }}>
              No pieces match your selection.
            </div>
          ) : filtered.map((p,i) => (
            <ProductCard key={p.id} product={p} index={i}
              onView={() => setSelectedProduct(p)}
              onAddCart={(prod) => { addToCart(prod); toast(`${prod.name} added to cart`); }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail ───────────────────────────────────────────
function ProductDetail({ product: p, onBack, addToCart, toast }) {
  const [qty, setQty] = useState(1);
  return (
    <div style={{ paddingTop:72 }}>
      <div style={{ padding:"32px 60px" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.gold, cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:2, marginBottom:32 }}>
          ← BACK TO COLLECTION
        </button>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"start" }}>
          {/* Image */}
          <div style={{
            height:500, borderRadius:4,
            background:`linear-gradient(145deg, ${T.navyDeep}, ${T.bronze}60, ${T.navyDeep})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:`1px solid ${T.gold}25`,
          }}>
            <LogoMark size={80} />
          </div>

          {/* Info */}
          <div>
            {p.badge && <div className="tag-gold" style={{ marginBottom:16 }}>{p.badge}</div>}
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,3vw,42px)", color:T.cream, lineHeight:1.2, marginBottom:8 }}>{p.name}</h1>
            <Stars rating={p.rating} />
            <div style={{ fontSize:12, color:T.muted, marginTop:4, marginBottom:24 }}>{p.reviews} verified reviews</div>

            <div style={{ display:"flex", alignItems:"baseline", gap:16, marginBottom:32 }}>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:32, color:T.gold }}>{fmt(p.price)}</span>
              {p.discount > 0 && <>
                <span style={{ fontSize:16, color:T.muted, textDecoration:"line-through" }}>{fmt(p.originalPrice)}</span>
                <span style={{ background:T.danger, color:T.cream, padding:"2px 8px", fontSize:11 }}>-{p.discount}%</span>
              </>}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:32 }}>
              {[["FABRIC",p.fabric],["LENGTH",p.length],["COLOR",p.color],["STOCK",`${p.stock} pcs`]].map(([k,v]) => (
                <div key={k} style={{ background:`${T.navyDeep}`, border:`1px solid ${T.gold}20`, padding:"12px 16px" }}>
                  <div style={{ fontSize:9, color:T.muted, letterSpacing:2 }}>{k}</div>
                  <div style={{ fontSize:15, color:T.cream, fontFamily:"'Cormorant Garamond',serif", marginTop:4 }}>{v}</div>
                </div>
              ))}
            </div>

            <p style={{ color:T.muted, lineHeight:1.8, marginBottom:32, fontFamily:"'Cormorant Garamond',serif", fontSize:18 }}>{p.description}</p>

            <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", border:`1px solid ${T.gold}30`, borderRadius:2 }}>
                <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ background:"none", border:"none", color:T.gold, padding:"10px 16px", cursor:"pointer", fontSize:18 }}>−</button>
                <span style={{ padding:"0 20px", color:T.cream, fontFamily:"'Cinzel',serif" }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(p.stock,q+1))} style={{ background:"none", border:"none", color:T.gold, padding:"10px 16px", cursor:"pointer", fontSize:18 }}>+</button>
              </div>
              <button className="btn-gold" style={{ flex:1, padding:"13px 0" }}
                onClick={() => { for(let i=0;i<qty;i++) addToCart(p); toast(`${qty}x ${p.name} added to cart`); }}>
                ADD TO CART
              </button>
            </div>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              {p.tags.map(t => <span key={t} className="tag-gold">{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────
function CartPage({ cart, setCart, setPage, toast }) {
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const updateQty = (id, delta) => setCart(c => c.map(i => i.id===id ? {...i, qty:Math.max(1,i.qty+delta)} : i));
  const remove = (id) => { setCart(c => c.filter(i => i.id!==id)); toast("Item removed"); };

  return (
    <div style={{ paddingTop:72, padding:"100px 60px 60px", maxWidth:1000, margin:"0 auto" }}>
      <div className="divider-gold" style={{ marginBottom:40 }}>YOUR CART</div>
      {cart.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 0" }}>
          <div style={{ fontSize:48, marginBottom:16, opacity:.3 }}>🛍</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:T.muted, marginBottom:24 }}>Your cart is empty</div>
          <button className="btn-gold" onClick={() => setPage("shop")}>BROWSE COLLECTION</button>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:32 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {cart.map(item => (
              <div key={item.id} className="card-luxury" style={{ padding:20, display:"flex", gap:20, alignItems:"center", borderRadius:4 }}>
                <div style={{
                  width:80, height:80, flexShrink:0,
                  background:`linear-gradient(135deg, ${T.navyDeep}, ${T.bronze}40)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  border:`1px solid ${T.gold}20`,
                }}>
                  <LogoMark size={28} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:T.cream }}>{item.name}</div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{item.fabric} · {item.length} · {item.color}</div>
                  <div style={{ color:T.gold, fontFamily:"'Cinzel',serif", marginTop:6 }}>{fmt(item.price)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <button onClick={() => updateQty(item.id,-1)} style={{ background:`${T.navy}`, border:`1px solid ${T.gold}30`, color:T.gold, width:30, height:30, cursor:"pointer", fontSize:16 }}>−</button>
                  <span style={{ width:24, textAlign:"center", fontFamily:"'Cinzel',serif" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id,+1)} style={{ background:`${T.navy}`, border:`1px solid ${T.gold}30`, color:T.gold, width:30, height:30, cursor:"pointer", fontSize:16 }}>+</button>
                </div>
                <div style={{ textAlign:"right", minWidth:100 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:T.gold }}>{fmt(item.price * item.qty)}</div>
                  <button onClick={() => remove(item.id)} style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:11, marginTop:6 }}>REMOVE</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card-luxury" style={{ padding:32, borderRadius:4, height:"fit-content" }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:3, color:T.gold, marginBottom:24 }}>ORDER SUMMARY</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
              {cart.map(i => (
                <div key={i.id} style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.muted }}>
                  <span>{i.name} × {i.qty}</span>
                  <span style={{ color:T.cream }}>{fmt(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop:`1px solid ${T.gold}20`, paddingTop:16, marginBottom:8, display:"flex", justifyContent:"space-between", color:T.muted, fontSize:13 }}>
              <span>Shipping</span><span style={{ color:T.goldLight }}>FREE</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:32 }}>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:14, color:T.cream }}>TOTAL</span>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:20, color:T.gold }}>{fmt(total)}</span>
            </div>
            <button className="btn-gold" style={{ width:"100%", padding:"14px 0", fontSize:13 }} onClick={() => setPage("checkout")}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHECKOUT / PAYMENT ───────────────────────────────────────
function CheckoutPage({ cart, setCart, setPage, toast, user }) {
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=confirmed
  const [form, setForm] = useState({ name: user?.name||"", email: user?.email||"", phone:"", address:"", city:"", method:"card", card:"", expiry:"", cvv:""});
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const up = (k,v) => setForm(f => ({...f,[k]:v}));

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address) { toast("Please fill all required fields"); return; }
    setStep(3);
    setCart([]);
    toast("Order placed successfully! ✦");
  };

  if (step === 3) return (
    <div style={{ paddingTop:72, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", animation:"fadeUp .6s ease" }}>
        <div style={{ fontSize:64, marginBottom:24, color:T.gold }}>✦</div>
        <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:32, letterSpacing:".1em", color:T.cream, marginBottom:16 }}>ORDER CONFIRMED</h2>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.muted, marginBottom:8 }}>
          Thank you, {form.name}. Your premium suiting is being prepared.
        </p>
        <p style={{ color:T.muted, marginBottom:40, fontSize:14 }}>Order confirmation sent to {form.email || "your account"}</p>
        <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
          <button className="btn-gold" onClick={() => setPage("shop")}>CONTINUE SHOPPING</button>
          <button className="btn-outline" onClick={() => setPage("home")}>HOME</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop:72, padding:"100px 60px 60px", maxWidth:1100, margin:"0 auto" }}>
      <div className="divider-gold" style={{ marginBottom:40 }}>CHECKOUT</div>

      {/* Steps */}
      <div style={{ display:"flex", gap:0, marginBottom:48 }}>
        {["DELIVERY","PAYMENT","CONFIRM"].map((s,i) => (
          <div key={s} style={{ display:"flex", alignItems:"center", gap:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{
                width:32, height:32, borderRadius:"50%",
                background: step > i+1 ? T.gold : step === i+1 ? T.gold : T.navyDeep,
                border:`2px solid ${step >= i+1 ? T.gold : T.muted+"40"}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Cinzel',serif", fontSize:12, color: step >= i+1 ? T.dark : T.muted,
                fontWeight:700,
              }}>{i+1}</div>
              <span style={{ fontSize:11, letterSpacing:2, color: step >= i+1 ? T.gold : T.muted, fontFamily:"'Cinzel',serif" }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex:1, height:1, background:step > i+1 ? T.gold : `${T.gold}20`, margin:"0 16px", minWidth:40 }}/>}
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:32 }}>
        {/* Form */}
        <div className="card-luxury" style={{ padding:40, borderRadius:4 }}>
          {step === 1 && (
            <>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:3, color:T.gold, marginBottom:28 }}>DELIVERY DETAILS</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>FULL NAME *</label>
                  <input value={form.name} onChange={e => up("name",e.target.value)} placeholder="Muhammad Ali" />
                </div>
                <div>
                  <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>PHONE *</label>
                  <input value={form.phone} onChange={e => up("phone",e.target.value)} placeholder="+92 300 1234567" />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>EMAIL</label>
                  <input value={form.email} onChange={e => up("email",e.target.value)} placeholder="ali@example.com" />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>ADDRESS *</label>
                  <input value={form.address} onChange={e => up("address",e.target.value)} placeholder="Street address" />
                </div>
                <div>
                  <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>CITY</label>
                  <input value={form.city} onChange={e => up("city",e.target.value)} placeholder="Lahore" />
                </div>
              </div>
              <button className="btn-gold" style={{ marginTop:32, padding:"14px 40px" }} onClick={() => setStep(2)}>CONTINUE TO PAYMENT</button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:3, color:T.gold, marginBottom:28 }}>PAYMENT METHOD</div>

              {/* Method Selector */}
              <div style={{ display:"flex", gap:12, marginBottom:28 }}>
                {[["card","💳 Card"],["cod","📦 Cash on Delivery"],["easypaisa","📱 EasyPaisa"]].map(([m,l]) => (
                  <button key={m} onClick={() => up("method",m)} style={{
                    flex:1, padding:"12px 8px",
                    background: form.method===m ? `${T.gold}20` : T.navyDeep,
                    border:`1px solid ${form.method===m ? T.gold : T.gold+"30"}`,
                    color: form.method===m ? T.gold : T.muted,
                    cursor:"pointer", fontSize:12, fontFamily:"'Raleway',sans-serif",
                    transition:"all .2s",
                  }}>{l}</button>
                ))}
              </div>

              {form.method === "card" && (
                <div style={{ display:"grid", gap:16 }}>
                  <div>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>CARD NUMBER</label>
                    <input value={form.card} onChange={e => up("card",e.target.value)} placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    <div>
                      <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>EXPIRY</label>
                      <input value={form.expiry} onChange={e => up("expiry",e.target.value)} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>CVV</label>
                      <input value={form.cvv} onChange={e => up("cvv",e.target.value)} placeholder="123" maxLength={3} type="password" />
                    </div>
                  </div>
                </div>
              )}
              {form.method === "cod" && (
                <div className="card-luxury" style={{ padding:24, borderRadius:4, background:`${T.navy}30` }}>
                  <p style={{ color:T.muted, fontFamily:"'Cormorant Garamond',serif", fontSize:18, lineHeight:1.6 }}>
                    Pay in cash when your premium suiting is delivered to your doorstep. Our courier will collect the payment.
                  </p>
                </div>
              )}
              {form.method === "easypaisa" && (
                <div className="card-luxury" style={{ padding:24, borderRadius:4, background:`${T.navy}30` }}>
                  <p style={{ color:T.muted, fontFamily:"'Cormorant Garamond',serif", fontSize:18, lineHeight:1.6 }}>
                    Transfer to: <strong style={{ color:T.gold }}>0300-DARBAAR</strong><br/>
                    Send screenshot to WhatsApp for order confirmation.
                  </p>
                </div>
              )}

              <div style={{ display:"flex", gap:16, marginTop:32 }}>
                <button className="btn-outline" style={{ padding:"13px 28px" }} onClick={() => setStep(1)}>BACK</button>
                <button className="btn-gold" style={{ flex:1, padding:"13px 0" }} onClick={placeOrder}>PLACE ORDER — {fmt(total)}</button>
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        <div className="card-luxury" style={{ padding:28, borderRadius:4, height:"fit-content" }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:3, color:T.gold, marginBottom:20 }}>ORDER ITEMS</div>
          {cart.map(i => (
            <div key={i.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:12, fontSize:13 }}>
              <span style={{ color:T.muted }}>{i.name} × {i.qty}</span>
              <span style={{ color:T.cream }}>{fmt(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${T.gold}20`, paddingTop:16, marginTop:8, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'Cinzel',serif", color:T.cream }}>TOTAL</span>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:18, color:T.gold }}>{fmt(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────
function LoginPage({ setPage, setUser, setIsAdmin, toast }) {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const up = (k,v) => setForm(f => ({...f,[k]:v}));

  const submit = () => {
    if (!form.email || !form.password) { toast("Please fill all fields"); return; }
    if (form.email === "admin@darbaar.com" && form.password === "admin123") {
      setUser({ name:"Admin", email:form.email, role:"admin" });
      setIsAdmin(true);
      toast("Welcome back, Admin ✦");
      setPage("admin");
    } else {
      setUser({ name: form.name || form.email.split("@")[0], email:form.email, role:"customer" });
      setIsAdmin(false);
      toast(`Welcome to DARBAAR, ${form.name || form.email.split("@")[0]} ✦`);
      setPage("home");
    }
  };

  return (
    <div style={{
      paddingTop:72, minHeight:"100vh",
      display:"flex", alignItems:"center", justifyContent:"center",
      background:`linear-gradient(135deg, ${T.dark}, ${T.navyDeep}, ${T.dark})`,
      position:"relative", overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", inset:0,
        background:`radial-gradient(ellipse at 30% 50%, ${T.navy}30, transparent 60%), radial-gradient(ellipse at 70% 50%, ${T.bronze}15, transparent 60%)`,
      }}/>
      <div className="card-luxury fade-up" style={{ width:440, padding:48, borderRadius:4, zIndex:1, position:"relative" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <LogoMark size={40} />
          <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:22, letterSpacing:4, color:T.cream, marginTop:12 }}>
            {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </h2>
          <div style={{ width:60, height:1, background:`linear-gradient(90deg, transparent, ${T.gold}, transparent)`, margin:"12px auto 0" }}/>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:28 }}>
          {mode === "register" && (
            <div>
              <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>FULL NAME</label>
              <input value={form.name} onChange={e => up("name",e.target.value)} placeholder="Muhammad Ali" />
            </div>
          )}
          <div>
            <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>EMAIL ADDRESS</label>
            <input value={form.email} onChange={e => up("email",e.target.value)} placeholder="ali@example.com" type="email"/>
          </div>
          <div>
            <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>PASSWORD</label>
            <input value={form.password} onChange={e => up("password",e.target.value)} placeholder="••••••••" type="password"/>
          </div>
        </div>

        <button className="btn-gold" style={{ width:"100%", padding:"14px 0", fontSize:13 }} onClick={submit}>
          {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>

        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:T.muted }}>
          {mode === "login" ? "New to DARBAAR? " : "Already have an account? "}
          <button onClick={() => setMode(mode==="login"?"register":"login")} style={{ background:"none", border:"none", color:T.gold, cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic" }}>
            {mode === "login" ? "Create Account" : "Sign In"}
          </button>
        </div>

        <div style={{ marginTop:24, padding:"16px", background:`${T.navy}40`, border:`1px solid ${T.gold}20`, borderRadius:2 }}>
          <div style={{ fontSize:10, color:T.muted, letterSpacing:2, marginBottom:6 }}>ADMIN ACCESS</div>
          <div style={{ fontSize:12, color:T.bronze }}>admin@darbaar.com / admin123</div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────
function AdminPanel({ products, setProducts, toast }) {
  const [tab, setTab] = useState("products");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [discountForm, setDiscountForm] = useState({ productId:"", discount:"" });

  const openEdit = (p) => {
    setEditing(p ? p.id : "new");
    setForm(p ? {...p} : { id:uid(), name:"", fabric:"Wool Blend", length:"5m", color:"Navy Blue", price:"", originalPrice:"", discount:0, stock:"", rating:4.5, reviews:0, badge:"", description:"", tags:[] });
  };

  const saveProduct = () => {
    if (!form.name || !form.price || !form.stock) { toast("Fill required fields"); return; }
    if (editing === "new") {
      setProducts(ps => [...ps, { ...form, price:+form.price, originalPrice:+form.originalPrice||+form.price, stock:+form.stock, discount:+form.discount||0 }]);
      toast("Product added ✦");
    } else {
      setProducts(ps => ps.map(p => p.id===editing ? { ...form, price:+form.price, originalPrice:+form.originalPrice||+form.price, stock:+form.stock, discount:+form.discount||0 } : p));
      toast("Product updated ✦");
    }
    setEditing(null);
  };

  const deleteProduct = (id) => {
    setProducts(ps => ps.filter(p => p.id !== id));
    toast("Product removed");
  };

  const applyDiscount = () => {
    const id = parseInt(discountForm.productId);
    const disc = parseInt(discountForm.discount);
    if (!id || isNaN(disc) || disc < 0 || disc > 90) { toast("Invalid discount"); return; }
    setProducts(ps => ps.map(p => p.id===id ? { ...p, discount:disc, price: Math.round(p.originalPrice * (1 - disc/100)) } : p));
    toast("Discount applied ✦");
    setDiscountForm({ productId:"", discount:"" });
  };

  const up = (k,v) => setForm(f => ({...f,[k]:v}));

  return (
    <div style={{ paddingTop:72, minHeight:"100vh" }}>
      {/* Admin Header */}
      <div style={{
        padding:"40px 60px 0",
        background:`linear-gradient(135deg, ${T.navyDeep}, ${T.darkCard})`,
        borderBottom:`1px solid ${T.gold}20`,
      }}>
        <div className="tag-gold" style={{ marginBottom:12 }}>ADMIN PANEL</div>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:28, letterSpacing:".1em", color:T.cream, marginBottom:24 }}>
          DARBAAR MANAGEMENT
        </h1>
        {/* Stats Row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32 }}>
          {[["PRODUCTS",products.length,"items"],["IN STOCK",products.reduce((s,p)=>s+p.stock,0),"units"],["DISCOUNTED",products.filter(p=>p.discount>0).length,"items"],["AVG RATING",(products.reduce((s,p)=>s+p.rating,0)/products.length).toFixed(1),"stars"]].map(([k,v,u]) => (
            <div key={k} className="card-luxury" style={{ padding:"16px 20px", borderRadius:4 }}>
              <div style={{ fontSize:9, color:T.muted, letterSpacing:3 }}>{k}</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:24, color:T.gold, marginTop:6 }}>{v}</div>
              <div style={{ fontSize:10, color:T.muted }}>{u}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${T.gold}20` }}>
          {[["products","PRODUCTS"],["discount","DISCOUNTS"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background:"none", border:"none", cursor:"pointer",
              padding:"12px 28px",
              fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:3,
              color: tab===k ? T.gold : T.muted,
              borderBottom: tab===k ? `2px solid ${T.gold}` : "2px solid transparent",
              transition:"all .2s",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"40px 60px" }}>

        {/* Discount Tab */}
        {tab === "discount" && (
          <div style={{ maxWidth:600 }}>
            <div className="card-luxury" style={{ padding:32, borderRadius:4, marginBottom:24 }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:3, color:T.gold, marginBottom:24 }}>APPLY DISCOUNT</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
                <div>
                  <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>SELECT PRODUCT</label>
                  <select value={discountForm.productId} onChange={e => setDiscountForm(f => ({...f, productId:e.target.value}))}>
                    <option value="">-- Select --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>DISCOUNT %</label>
                  <input type="number" min={0} max={90} value={discountForm.discount}
                    onChange={e => setDiscountForm(f => ({...f, discount:e.target.value}))} placeholder="e.g. 15" />
                </div>
              </div>
              <button className="btn-gold" onClick={applyDiscount}>APPLY DISCOUNT</button>
            </div>

            {/* Current discounts */}
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:3, color:T.gold, marginBottom:16 }}>ACTIVE DISCOUNTS</div>
            {products.filter(p => p.discount > 0).map(p => (
              <div key={p.id} className="card-luxury" style={{ padding:16, borderRadius:4, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ color:T.cream, fontSize:14 }}>{p.name}</div>
                  <div style={{ color:T.muted, fontSize:12 }}>{fmt(p.originalPrice)} → {fmt(p.price)}</div>
                </div>
                <div className="tag-gold" style={{ fontSize:14, padding:"4px 16px" }}>-{p.discount}%</div>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {tab === "products" && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:3, color:T.muted }}>
                {products.length} TOTAL PRODUCTS
              </div>
              <button className="btn-gold" onClick={() => openEdit(null)}>+ ADD PRODUCT</button>
            </div>

            {/* Edit/Add Form */}
            {editing !== null && (
              <div className="card-luxury fade-up" style={{ padding:36, borderRadius:4, marginBottom:32 }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:3, color:T.gold, marginBottom:24 }}>
                  {editing === "new" ? "ADD NEW PRODUCT" : "EDIT PRODUCT"}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>PRODUCT NAME *</label>
                    <input value={form.name} onChange={e => up("name",e.target.value)} placeholder="e.g. Imperial Navy Suiting" />
                  </div>
                  <div>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>FABRIC</label>
                    <select value={form.fabric} onChange={e => up("fabric",e.target.value)}>
                      {FABRICS.slice(1).map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>LENGTH</label>
                    <select value={form.length} onChange={e => up("length",e.target.value)}>
                      <option>4m</option><option>5m</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>COLOR</label>
                    <select value={form.color} onChange={e => up("color",e.target.value)}>
                      {COLORS_PALETTE.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>PRICE (PKR) *</label>
                    <input type="number" value={form.price} onChange={e => up("price",e.target.value)} placeholder="8500" />
                  </div>
                  <div>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>ORIGINAL PRICE</label>
                    <input type="number" value={form.originalPrice} onChange={e => up("originalPrice",e.target.value)} placeholder="Leave blank if no discount" />
                  </div>
                  <div>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>STOCK *</label>
                    <input type="number" value={form.stock} onChange={e => up("stock",e.target.value)} placeholder="25" />
                  </div>
                  <div>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>BADGE</label>
                    <input value={form.badge} onChange={e => up("badge",e.target.value)} placeholder="BESTSELLER / NEW / VIP PICK" />
                  </div>
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ fontSize:10, color:T.muted, letterSpacing:2, display:"block", marginBottom:6 }}>DESCRIPTION</label>
                    <textarea value={form.description} onChange={e => up("description",e.target.value)} placeholder="Describe this fabric..." rows={3} style={{ resize:"vertical" }} />
                  </div>
                </div>
                <div style={{ display:"flex", gap:12, marginTop:24 }}>
                  <button className="btn-gold" onClick={saveProduct} style={{ padding:"12px 32px" }}>
                    {editing === "new" ? "ADD PRODUCT" : "SAVE CHANGES"}
                  </button>
                  <button className="btn-outline" onClick={() => setEditing(null)}>CANCEL</button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="card-luxury" style={{ borderRadius:4, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"'Raleway',sans-serif" }}>
                <thead>
                  <tr style={{ background:`${T.navyDeep}`, borderBottom:`1px solid ${T.gold}30` }}>
                    {["PRODUCT","FABRIC","LENGTH","PRICE","STOCK","DISCOUNT",""].map(h => (
                      <th key={h} style={{ padding:"14px 16px", textAlign:"left", fontSize:9, letterSpacing:3, color:T.gold, fontWeight:600, fontFamily:"'Cinzel',serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p,i) => (
                    <tr key={p.id} style={{ borderBottom:`1px solid ${T.gold}15`, background: i%2===0 ? "transparent" : `${T.navyDeep}30` }}>
                      <td style={{ padding:"14px 16px" }}>
                        <div style={{ color:T.cream, fontSize:14 }}>{p.name}</div>
                        {p.badge && <span className="tag-gold" style={{ fontSize:8, marginTop:4, display:"inline-block" }}>{p.badge}</span>}
                      </td>
                      <td style={{ padding:"14px 16px", color:T.muted, fontSize:13 }}>{p.fabric}</td>
                      <td style={{ padding:"14px 16px", color:T.muted, fontSize:13 }}>{p.length}</td>
                      <td style={{ padding:"14px 16px", color:T.gold, fontFamily:"'Cinzel',serif", fontSize:13 }}>{fmt(p.price)}</td>
                      <td style={{ padding:"14px 16px", color: p.stock < 10 ? "#E07070" : T.muted, fontSize:13 }}>{p.stock}</td>
                      <td style={{ padding:"14px 16px" }}>
                        {p.discount > 0
                          ? <span style={{ color:T.goldLight, fontSize:13 }}>-{p.discount}%</span>
                          : <span style={{ color:`${T.muted}60`, fontSize:12 }}>—</span>}
                      </td>
                      <td style={{ padding:"14px 16px" }}>
                        <div style={{ display:"flex", gap:8 }}>
                          <button onClick={() => openEdit(p)} style={{ background:"none", border:`1px solid ${T.gold}40`, color:T.gold, padding:"5px 12px", cursor:"pointer", fontSize:10, fontFamily:"'Cinzel',serif", letterSpacing:1 }}>EDIT</button>
                          <button onClick={() => deleteProduct(p.id)} style={{ background:"none", border:`1px solid ${T.danger}40`, color:"#E07070", padding:"5px 12px", cursor:"pointer", fontSize:10, fontFamily:"'Cinzel',serif", letterSpacing:1 }}>DEL</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── WOMEN'S COMING SOON ──────────────────────────────────────
function WomenPage() {
  return (
    <div style={{
      paddingTop:72, minHeight:"100vh",
      display:"flex", alignItems:"center", justifyContent:"center",
      background:`linear-gradient(135deg, ${T.dark} 0%, ${T.navyDeep} 60%, ${T.dark} 100%)`,
      position:"relative", overflow:"hidden",
      textAlign:"center",
    }}>
      {/* Decorative */}
      <div style={{ position:"absolute", top:"15%", left:"10%", opacity:.04, fontSize:200, color:T.gold, fontFamily:"'Cinzel',serif" }}>✦</div>
      <div style={{ position:"absolute", bottom:"15%", right:"10%", opacity:.04, fontSize:200, color:T.gold, fontFamily:"'Cinzel',serif" }}>✦</div>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at center, ${T.navyLight}20 0%, transparent 70%)` }}/>

      <div className="fade-up" style={{ zIndex:1, padding:"0 40px" }}>
        <div className="shimmer" style={{ fontSize:56, color:T.gold, marginBottom:24 }}>✦</div>
        <div className="tag-gold" style={{ marginBottom:24 }}>WOMEN'S COLLECTION</div>
        <h1 style={{
          fontFamily:"'Cinzel',serif",
          fontSize:"clamp(36px,6vw,72px)",
          letterSpacing:".15em", color:T.cream, marginBottom:20, lineHeight:1.1,
        }}>
          COMING<br/>SOON
        </h1>
        <div style={{ width:100, height:1, background:`linear-gradient(90deg, transparent, ${T.gold}, transparent)`, margin:"24px auto" }}/>
        <p style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(18px,2.5vw,26px)",
          color:T.greige, maxWidth:540, margin:"0 auto 48px", lineHeight:1.7,
        }}>
          We are curating an exclusive women's unstitched collection with the same commitment to quality and elegance.
        </p>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.gold, fontStyle:"italic" }}>
          — Watch this space. Elegance is coming. —
        </p>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState("home");
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [cart, setCart]         = useState([]);
  const [user, setUser]         = useState(null);
  const [isAdmin, setIsAdmin]   = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const toast = (msg) => setToastMsg(msg);

  const addToCart = (product) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      if (ex) return c.map(i => i.id===product.id ? {...i, qty:i.qty+1} : i);
      return [...c, { ...product, qty:1 }];
    });
  };

  const cartCount = cart.reduce((s,i) => s + i.qty, 0);

  const requireAuth = (target) => {
    if (!user && (target === "cart" || target === "checkout")) {
      setPage("login");
      toast("Please sign in to continue");
      return false;
    }
    return true;
  };

  const safePage = (p) => {
    if ((p === "cart" || p === "checkout") && !user) {
      setPage("login");
      toast("Please sign in to continue");
    } else {
      setPage(p);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.dark }}>
      <Navbar
        page={page} setPage={safePage}
        cartCount={cartCount}
        isAdmin={isAdmin} setIsAdmin={setIsAdmin}
        user={user} setUser={setUser}
      />

      {page === "home"     && <HomePage setPage={safePage} products={products} />}
      {page === "shop"     && <ShopPage products={products} addToCart={addToCart} toast={toast} />}
      {page === "women"    && <WomenPage />}
      {page === "cart"     && <CartPage cart={cart} setCart={setCart} setPage={safePage} toast={toast} />}
      {page === "checkout" && <CheckoutPage cart={cart} setCart={setCart} setPage={safePage} toast={toast} user={user} />}
      {page === "login"    && <LoginPage setPage={setPage} setUser={setUser} setIsAdmin={setIsAdmin} toast={toast} />}
      {page === "admin"    && isAdmin && <AdminPanel products={products} setProducts={setProducts} toast={toast} />}

      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
