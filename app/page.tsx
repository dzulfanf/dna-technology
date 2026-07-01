"use client";

import { useEffect, useMemo, type CSSProperties, type FormEvent } from "react";

/* -------------------------------------------------------------- */
/*  CSS-string → React style helper (memoized)                    */
/* -------------------------------------------------------------- */
const _styleCache = new Map<string, CSSProperties>();
function s(css: string): CSSProperties {
  const cached = _styleCache.get(css);
  if (cached) return cached;
  const out: Record<string, string> = {};
  for (const rule of css.split(";")) {
    const idx = rule.indexOf(":");
    if (idx < 0) continue;
    const k = rule.slice(0, idx).trim();
    const v = rule.slice(idx + 1).trim();
    if (!k) continue;
    const key = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = v;
  }
  _styleCache.set(css, out as CSSProperties);
  return out as CSSProperties;
}

/* -------------------------------------------------------------- */
/*  Icon helper                                                   */
/* -------------------------------------------------------------- */
const ic = (path: string, color = "#22D3EE") =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const DC_PATH =
  '<rect x="2" y="3" width="20" height="5" rx="1"/><rect x="2" y="10" width="20" height="5" rx="1"/><rect x="2" y="17" width="20" height="5" rx="1"/><circle cx="18" cy="5.5" r=".6" fill="currentColor"/><circle cx="18" cy="12.5" r=".6" fill="currentColor"/><circle cx="18" cy="19.5" r=".6" fill="currentColor"/>';
const NET_PATH =
  '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2c-4 4-4 16 0 20M12 2c4 4 4 16 0 20"/>';
const APP_PATH =
  '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12l3 3 5-5"/>';
const PHONE_PATH =
  '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.81a19.79 19.79 0 0 1-3.07-8.64A2 2 0 0 1 2 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L6.91 8.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>';
const MAIL_PATH =
  '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/>';
const SOL_A_PATH =
  '<rect x="2" y="2" width="20" height="8" rx="1"/><rect x="2" y="14" width="20" height="8" rx="1"/><circle cx="6" cy="6" r=".7" fill="#34D399"/><circle cx="6" cy="18" r=".7" fill="#22D3EE"/><line x1="10" y1="6" x2="18" y2="6"/><line x1="10" y1="18" x2="18" y2="18"/>';
const SOL_B_PATH =
  '<path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>';

/* -------------------------------------------------------------- */
/*  Data                                                          */
/* -------------------------------------------------------------- */
const MARQUEE1 = [
  "Digital Genesis",
  "Neural Nexus",
  "Bespoke Masterpieces",
  "Obsidian Symphony",
  "Strategic Sovereign",
  "Living Infrastructure",
  "Data Sovereignty",
  "One Organism",
];

const STATS = [
  { number: "13+", label: "Years in operation" },
  { number: "3", label: "Core service pillars" },
  { number: "8", label: "Industry sectors" },
  { number: "30+", label: "Clients served" },
];

const APPROACH = [
  {
    num: "01",
    title: "Integrated Product & Services",
    desc: "Curating direct and partner-supplied products into a single, coherent offering tailored to the outcome each client needs.",
  },
  {
    num: "02",
    title: "System Integration & Management",
    desc: "Seamlessly integrating interdependent services from various providers into end-to-end services that meet business requirements.",
  },
  {
    num: "03",
    title: "In-house Software Development",
    desc: "Custom software development that helps companies at any stage: from R&D and MVP to scaling, UX analysis, and improvement.",
  },
];

const MODELS = [
  {
    num: "01",
    title: "Strategic Consultation Service",
    desc: "Stepping into complex situations and developing cogent, coherent plans of action that help companies meet their defined goals.",
  },
  {
    num: "02",
    title: "Software Development & Maintenance",
    desc: "Planning, creating, testing, deploying, and modifying software products — to correct faults, improve performance, or extend attributes.",
  },
  {
    num: "03",
    title: "Strategic Partnership for Business & Product Development",
    desc: "Long-term cooperation contracts between DNA Technology and clients to build a product and run the business together.",
  },
];

const MODEL_TITLES = [
  "Strategic Consultation",
  "Software Development",
  "Strategic Partnership",
  "Managed Services",
  "System Integration",
];

const SECTORS = [
  "Education & Sport",
  "Energy & Mining",
  "Infrastructure & Telco",
  "Security",
  "Government",
  "Financial",
  "Hospitality & Lifestyle",
  "Property & Construction",
];

const CLIENTS = [
  "Revital Clinic",
  "Adaro",
  "iSeller",
  "Nurtura",
  "RS Menteng Mitra Afia",
  "DBS",
  "TokTok.id",
  "Alamary Shop",
  "Indokarmed",
  "UNDP",
  "Universitas Binawan",
  "UNOPS",
  "KOMINFO",
  "GoIndonesia",
  "BPBD DKI Jakarta",
  "Kemenparekraf",
];

/* -------------------------------------------------------------- */
/*  Page                                                          */
/* -------------------------------------------------------------- */
export default function Home() {
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    /* icons already rendered via dangerouslySetInnerHTML in JSX */

    /* ---------- custom cursor ---------- */
    const ring = document.getElementById("dnaCursor");
    const dot = document.getElementById("dnaCursorDot");
    if (ring && dot) {
      let mx = window.innerWidth / 2,
        my = window.innerHeight / 2,
        rx = mx,
        ry = my;
      const onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
      };
      document.addEventListener("mousemove", onMove);
      let rafC = 0;
      const loop = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        rafC = requestAnimationFrame(loop);
      };
      loop();
      const hexToRgb = (h: string) => {
        h = (h || "").replace("#", "");
        if (h.length === 3)
          h = h
            .split("")
            .map((c) => c + c)
            .join("");
        const n = parseInt(h, 16);
        return ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
      };
      const onOver = (e: MouseEvent) => {
        const t = e.target as HTMLElement | null;
        if (!t) return;
        const acEl = t.closest("[data-accent]") as HTMLElement | null;
        const ac = acEl ? acEl.getAttribute("data-accent") : null;
        const tgt = t.closest("[data-cursor]");
        dot.style.background = ac || "#22D3EE";
        if (tgt) {
          ring.style.width = "76px";
          ring.style.height = "76px";
          ring.style.background = ac
            ? "rgba(" + hexToRgb(ac) + ",0.16)"
            : "rgba(255,255,255,.10)";
          ring.style.borderColor = "transparent";
        } else {
          ring.style.width = "46px";
          ring.style.height = "46px";
          ring.style.background = "transparent";
          ring.style.borderColor = ac || "rgba(255,255,255,.55)";
        }
      };
      document.addEventListener("mouseover", onOver);
      cleanups.push(() => {
        cancelAnimationFrame(rafC);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseover", onOver);
      });
    }

    /* ---------- split text (hero intro) ---------- */
    document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      if ((el as HTMLElement & { __split?: boolean }).__split) return;
      (el as HTMLElement & { __split?: boolean }).__split = true;
      const text = el.textContent || "";
      el.textContent = "";
      [...text].forEach((c) => {
        const sp = document.createElement("span");
        sp.className = "ch";
        sp.textContent = c === " " ? " " : c;
        el.appendChild(sp);
      });
      const chs = el.querySelectorAll<HTMLElement>(".ch");
      chs.forEach((ch, i) => {
        ch.style.transitionDelay = i * 0.04 + 0.1 + "s";
      });
    });
    const splitTimer = setTimeout(() => {
      document
        .querySelectorAll("#hero [data-split]")
        .forEach((el) => el.classList.add("in"));
    }, 200);
    cleanups.push(() => clearTimeout(splitTimer));

    /* ---------- hero neural network canvas ---------- */
    const canvas = document.getElementById("dnaNet") as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const PAL: number[][] = [
          [52, 211, 153],
          [34, 211, 238],
          [168, 85, 247],
        ];
        const MAX_DIST = 150;
        let W = 0,
          H = 0,
          dpr = Math.min(window.devicePixelRatio || 1, 2);
        interface Node {
          x: number;
          y: number;
          vx: number;
          vy: number;
          lit: boolean;
          col: number[];
          r: number;
          alpha: number;
        }
        let nodes: Node[] = [];
        const mouse = { x: -9999, y: -9999 };
        const build = () => {
          W = canvas.offsetWidth;
          H = canvas.offsetHeight;
          canvas.width = W * dpr;
          canvas.height = H * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const count = Math.max(
            34,
            Math.min(90, Math.round((W * H) / 19000))
          );
          nodes = Array.from({ length: count }, () => {
            const lit = Math.random() < 0.42;
            const col = lit
              ? PAL[Math.floor(Math.random() * PAL.length)]
              : [255, 255, 255];
            return {
              x: Math.random() * W,
              y: Math.random() * H,
              vx: (Math.random() - 0.5) * 0.4,
              vy: (Math.random() - 0.5) * 0.4,
              lit,
              col,
              r: lit ? Math.random() * 1.8 + 1.8 : Math.random() * 1.4 + 0.7,
              alpha: lit ? 0.9 : Math.random() * 0.32 + 0.15,
            };
          });
        };
        build();
        const onResize = () => {
          dpr = Math.min(window.devicePixelRatio || 1, 2);
          build();
        };
        window.addEventListener("resize", onResize);
        const onMove = (e: MouseEvent) => {
          const r = canvas.getBoundingClientRect();
          mouse.x = e.clientX - r.left;
          mouse.y = e.clientY - r.top;
        };
        window.addEventListener("mousemove", onMove);
        const onLeave = () => {
          mouse.x = -9999;
          mouse.y = -9999;
        };
        window.addEventListener("mouseout", onLeave);
        let raf = 0;
        const step = () => {
          ctx.clearRect(0, 0, W, H);
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const a = nodes[i],
                b = nodes[j],
                dx = a.x - b.x,
                dy = a.y - b.y,
                d = Math.sqrt(dx * dx + dy * dy);
              if (d > MAX_DIST) continue;
              const t = 1 - d / MAX_DIST,
                bothLit = a.lit && b.lit,
                eitherLit = a.lit || b.lit;
              const al = bothLit ? t * 0.45 : eitherLit ? t * 0.18 : t * 0.06;
              const cr = Math.round((a.col[0] + b.col[0]) / 2),
                cg = Math.round((a.col[1] + b.col[1]) / 2),
                cb = Math.round((a.col[2] + b.col[2]) / 2);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(${cr},${cg},${cb},${al})`;
              ctx.lineWidth = bothLit ? 1 : 0.5;
              ctx.stroke();
            }
          }
          for (const n of nodes) {
            const dx = n.x - mouse.x,
              dy = n.y - mouse.y,
              d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) {
              n.vx += (dx / (d || 1)) * 0.12;
              n.vy += (dy / (d || 1)) * 0.12;
            }
            n.vx *= 0.985;
            n.vy *= 0.985;
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < -20) n.x = W + 20;
            if (n.x > W + 20) n.x = -20;
            if (n.y < -20) n.y = H + 20;
            if (n.y > H + 20) n.y = -20;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},${n.alpha})`;
            ctx.fill();
          }
          raf = requestAnimationFrame(step);
        };
        step();
        cleanups.push(() => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseout", onLeave);
        });
      }
    }

    /* ---------- rotator (hero) ---------- */
    const rotEl = document.getElementById("dnaRotator");
    if (rotEl) {
      const words = ["Datacenter", "Network", "Application"];
      const colors = ["#34D399", "#22D3EE", "#A855F7"];
      const mask = rotEl.parentElement;
      const baseFont = parseFloat(getComputedStyle(rotEl).fontSize);
      let i = 0;
      rotEl.style.color = colors[0];
      const splitInto = (txt: string) => {
        rotEl.textContent = "";
        [...txt].forEach((c, k) => {
          const sp = document.createElement("span");
          sp.className = "ch";
          sp.textContent = c === " " ? " " : c;
          sp.style.transitionDelay = k * 0.04 + 0.1 + "s";
          rotEl.appendChild(sp);
        });
      };
      rotEl.classList.add("dna-split");
      splitInto(words[0]);
      const inTimer = setTimeout(() => rotEl.classList.add("in"), 200);
      cleanups.push(() => clearTimeout(inTimer));

      const fitAll = () => {
        rotEl.style.fontSize = baseFont + "px";
        const cur = rotEl.textContent;
        let maxW = 0;
        words.forEach((w) => {
          rotEl.textContent = w;
          maxW = Math.max(maxW, rotEl.scrollWidth);
        });
        rotEl.textContent = cur;
        const avail = (mask ? mask.clientWidth : rotEl.clientWidth) || maxW;
        if (maxW > avail && avail > 0)
          rotEl.style.fontSize =
            Math.floor(baseFont * (avail / maxW)) + "px";
      };

      let txtEl: HTMLSpanElement | null = null;
      const buildCaret = () => {
        rotEl.textContent = "";
        rotEl.style.transform = "none";
        rotEl.style.opacity = "1";
        rotEl.style.transition = "none";
        rotEl.style.color = colors[i];
        txtEl = document.createElement("span");
        const caretEl = document.createElement("span");
        caretEl.textContent = "|";
        caretEl.style.cssText =
          "display:inline-block;margin-left:.06em;font-weight:300;animation:dnaBlink 1.05s steps(2,start) infinite;";
        rotEl.appendChild(txtEl);
        rotEl.appendChild(caretEl);
      };

      const TYPE = 80,
        ERASE = 42,
        HOLD = 1600,
        PAUSE = 420;
      let cancelled = false;
      const timers: number[] = [];
      const sleep = (ms: number) =>
        new Promise<void>((r) => {
          const t = window.setTimeout(r, ms);
          timers.push(t);
        });
      const run = async () => {
        while (!cancelled) {
          const w = words[i];
          for (let k = w.length - 1; k >= 0 && !cancelled; k--) {
            if (txtEl) txtEl.textContent = w.slice(0, k);
            await sleep(ERASE);
          }
          await sleep(PAUSE);
          i = (i + 1) % words.length;
          rotEl.style.color = colors[i];
          const n = words[i];
          for (let k = 1; k <= n.length && !cancelled; k++) {
            if (txtEl) txtEl.textContent = n.slice(0, k);
            await sleep(TYPE);
          }
          await sleep(HOLD);
        }
      };
      const introDone = 200 + (words[0].length * 0.04 + 0.1 + 0.9) * 1000;
      const rotStart = window.setTimeout(() => {
        rotEl.classList.remove("dna-split", "in");
        fitAll();
        buildCaret();
        if (txtEl) (txtEl as HTMLSpanElement).textContent = words[0];
        timers.push(window.setTimeout(run, HOLD));
      }, introDone + 600);
      const onResizeRot = () => {
        if (!txtEl) return;
        const cur = txtEl.textContent || "";
        fitAll();
        buildCaret();
        if (txtEl) (txtEl as HTMLSpanElement).textContent = cur;
      };
      window.addEventListener("resize", onResizeRot);
      cleanups.push(() => {
        cancelled = true;
        clearTimeout(rotStart);
        timers.forEach((t) => clearTimeout(t));
        window.removeEventListener("resize", onResizeRot);
      });
    }

    /* ---------- neural tile canvases ---------- */
    const hexToRgb2 = (h: string) => {
      h = (h || "").replace("#", "");
      if (h.length === 3)
        h = h
          .split("")
          .map((c) => c + c)
          .join("");
      const n = parseInt(h, 16);
      return ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
    };
    document
      .querySelectorAll<HTMLElement>("[data-neural-tile]")
      .forEach((tile) => {
        const cv = tile.querySelector<HTMLCanvasElement>("[data-neural]");
        const glow = tile.querySelector<HTMLElement>("[data-glow]");
        if (!cv) return;
        const cx = cv.getContext("2d");
        if (!cx) return;
        const rgb = hexToRgb2(tile.getAttribute("data-accent") || "#22D3EE");
        let W = 0,
          H = 0,
          dpr = Math.min(window.devicePixelRatio || 1, 2);
        interface P {
          x: number;
          y: number;
          r: number;
          vy: number;
          vx: number;
          life: number;
          max: number;
        }
        const parts: P[] = [];
        let raf = 0;
        let active = false;
        const size = () => {
          W = tile.clientWidth;
          H = tile.clientHeight;
          cv.width = W * dpr;
          cv.height = H * dpr;
          cx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const spawn = (): P => ({
          x: Math.random() * W,
          y: H + Math.random() * 16,
          r: Math.random() * 2 + 0.6,
          vy: -(Math.random() * 0.85 + 0.35),
          vx: (Math.random() - 0.5) * 0.3,
          life: 0,
          max: Math.random() * 120 + 90,
        });
        const step = () => {
          cx.clearRect(0, 0, W, H);
          if (active && parts.length < 40) {
            parts.push(spawn());
            if (Math.random() < 0.5) parts.push(spawn());
          }
          for (let k = parts.length - 1; k >= 0; k--) {
            const p = parts[k];
            p.life++;
            p.x += p.vx;
            p.y += p.vy;
            const lifeT = 1 - p.life / p.max;
            if (p.life >= p.max || p.y < -12) {
              parts.splice(k, 1);
              continue;
            }
            const a = Math.max(0, lifeT) * 0.9;
            cx.beginPath();
            cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            cx.fillStyle = `rgba(${rgb},${a})`;
            cx.shadowColor = `rgba(${rgb},0.9)`;
            cx.shadowBlur = 6;
            cx.fill();
          }
          cx.shadowBlur = 0;
          if (active || parts.length) {
            raf = requestAnimationFrame(step);
          } else {
            raf = 0;
          }
        };
        const enter = () => {
          active = true;
          size();
          cv.style.opacity = "1";
          if (glow) glow.style.opacity = "1";
          if (!raf) raf = requestAnimationFrame(step);
        };
        const leave = () => {
          active = false;
          cv.style.opacity = "0";
          if (glow) glow.style.opacity = "0";
        };
        tile.addEventListener("mouseenter", enter);
        tile.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          if (raf) cancelAnimationFrame(raf);
          tile.removeEventListener("mouseenter", enter);
          tile.removeEventListener("mouseleave", leave);
        });
      });

    /* ---------- reveal + stagger lines + counters ---------- */
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const FROM: Record<string, string> = {
      up: "translateY(46px)",
      left: "translateX(-40px)",
      right: "translateX(40px)",
      fade: "translateY(0)",
      scale: "scale(.9)",
    };
    const EASE = "cubic-bezier(.16,1,.3,1)";
    els.forEach((el) => {
      const v = el.getAttribute("data-anim") || "up";
      el.style.opacity = "0";
      el.style.transform = FROM[v] || FROM.up;
      el.style.willChange = "opacity, transform";
    });
    const shown = new WeakSet<HTMLElement>();
    const countUp = (el: HTMLElement) => {
      if ((el as HTMLElement & { __counted?: boolean }).__counted) return;
      (el as HTMLElement & { __counted?: boolean }).__counted = true;
      const raw =
        el.getAttribute("data-count") || (el.textContent || "").trim();
      const m = raw.match(/^(\d+)(.*)$/);
      if (!m) {
        el.textContent = raw;
        return;
      }
      const target = parseInt(m[1], 10);
      const suffix = m[2] || "";
      if (target === 0) {
        el.textContent = raw;
        return;
      }
      const dur = 1300,
        t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const show = (el: HTMLElement) => {
      if (shown.has(el)) return;
      shown.add(el);
      const parent = el.parentElement;
      const sibs = parent
        ? (Array.from(parent.children).filter((c) =>
            c.hasAttribute("data-reveal")
          ) as HTMLElement[])
        : [el];
      const delay = Math.min(Math.max(0, sibs.indexOf(el)), 7) * 90;
      void el.offsetHeight;
      el.style.transition = `opacity .8s ${EASE} ${delay}ms, transform .9s ${EASE} ${delay}ms`;
      el.style.opacity = "1";
      el.style.transform = "none";
      const counters = el.matches("[data-count]")
        ? [el]
        : Array.from(el.querySelectorAll<HTMLElement>("[data-count]"));
      counters.forEach((c, i) => setTimeout(() => countUp(c), delay + i * 120));
    };
    document
      .querySelectorAll<HTMLElement>("[data-stagger-lines]")
      .forEach((wrap) => {
        wrap.querySelectorAll<HTMLElement>(".ln").forEach((ln) => {
          ln.style.display = "inline-block";
          ln.style.transform = "translateY(110%)";
          ln.style.transition = `transform .9s ${EASE}`;
        });
      });
    const fireLines = (wrap: HTMLElement) => {
      wrap.querySelectorAll<HTMLElement>(".ln").forEach((ln, i) => {
        ln.style.transitionDelay = i * 0.09 + "s";
        void ln.offsetHeight;
        ln.style.transform = "translateY(0)";
      });
    };
    let io: IntersectionObserver | null = null;
    try {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const t = e.target as HTMLElement;
              if (t.hasAttribute("data-stagger-lines")) fireLines(t);
              else show(t);
              io!.unobserve(t);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      els.forEach((el) => io!.observe(el));
      document
        .querySelectorAll<HTMLElement>("[data-stagger-lines]")
        .forEach((w) => io!.observe(w));
    } catch {
      els.forEach(show);
      document
        .querySelectorAll<HTMLElement>("[data-stagger-lines]")
        .forEach(fireLines);
    }
    cleanups.push(() => io?.disconnect());

    /* ---------- parallax ---------- */
    const pxEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]")
    );
    if (pxEls.length) {
      let ticking = false;
      const apply = () => {
        const sy = window.scrollY || window.pageYOffset;
        pxEls.forEach((el) => {
          const f = parseFloat(el.getAttribute("data-parallax") || "0") || 0;
          const base = el.getBoundingClientRect().top + sy;
          el.style.transform = `translateY(${(sy - base + window.innerHeight) * f}px)`;
        });
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(apply);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      apply();
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(
      "Thank you! This is a demo form — connect it to your backend or email service to receive messages."
    );
  };

  /* -------------------------------------------------------------- */
  /*  Render                                                        */
  /* -------------------------------------------------------------- */
  return (
    <div style={s("position:relative;")}>
      {/* CUSTOM CURSOR */}
      <div
        className="dna-cursor"
        id="dnaCursor"
        style={s(
          "position:fixed;top:0;left:0;width:46px;height:46px;border:1px solid rgba(255,255,255,.55);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .25s ease,height .25s ease,background .25s ease,border-color .25s ease;mix-blend-mode:difference"
        )}
      />
      <div
        className="dna-cursor-dot"
        id="dnaCursorDot"
        style={s(
          "position:fixed;top:0;left:0;width:6px;height:6px;background:#22D3EE;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)"
        )}
      />

      {/* NAV */}
      <nav
        style={s(
          "position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:26px 48px;mix-blend-mode:difference"
        )}
      >
        <a
          href="#hero"
          data-cursor=""
          style={s(
            "display:flex;align-items:center;gap:11px;text-decoration:none"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/brand-logo-dna-white.png"
            alt="DNA Technology"
            style={s("height:34px;width:auto;display:block")}
          />
        </a>
        <div
          className="dna-nav-links"
          style={s("display:flex;align-items:center;gap:30px")}
        >
          {[
            ["#work", "The Trinity"],
            ["#approach", "Approach"],
            ["#contact", "Contact"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              data-cursor=""
              style={s(
                "font-family:var(--font-head);font-size:13px;font-weight:500;color:#fff;text-decoration:none;letter-spacing:.02em"
              )}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section
        id="hero"
        style={s(
          "position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:0 48px;overflow:hidden"
        )}
      >
        <div
          id="dnaGrid"
          style={s(
            "position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;z-index:0"
          )}
        />
        <canvas
          id="dnaNet"
          style={s(
            "position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none"
          )}
        />
        <div
          data-parallax="-0.14"
          style={s(
            "position:absolute;top:8%;right:4%;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(52,211,153,.32),transparent 70%);filter:blur(34px);z-index:0"
          )}
        />
        <div
          data-parallax="-0.08"
          style={s(
            "position:absolute;top:34%;right:22%;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,.28),transparent 70%);filter:blur(38px);z-index:0"
          )}
        />
        <div
          data-parallax="-0.2"
          style={s(
            "position:absolute;bottom:6%;right:12%;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,.3),transparent 70%);filter:blur(40px);z-index:0"
          )}
        />
        <div
          style={s(
            "position:relative;z-index:2;max-width:1400px;width:100%;margin:0 auto"
          )}
        >
          <div
            style={s(
              "display:flex;align-items:center;gap:14px;margin-bottom:34px;overflow:hidden"
            )}
          >
            <span
              data-reveal=""
              data-anim="left"
              style={s(
                "width:46px;height:2px;background:linear-gradient(90deg,#34D399,#22D3EE,#A855F7);display:inline-block"
              )}
            />
            <span
              data-reveal=""
              data-anim="fade"
              style={s(
                "font-family:var(--font-head);font-size:12px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;background:linear-gradient(100deg,#34D399,#22D3EE,#A855F7);-webkit-background-clip:text;background-clip:text;color:transparent"
              )}
            >
              Est. 2013 — Jakarta · The Obsidian Symphony
            </span>
          </div>
          <h1
            style={s(
              "font-family:var(--font-head);font-weight:700;letter-spacing:-.04em;line-height:.86;margin:0;color:#fff;font-size:clamp(54px,12vw,190px);text-transform:uppercase"
            )}
          >
            <span className="dna-line-mask">
              <span className="dna-split" data-split="">
                Architecting
              </span>
            </span>
            <span className="dna-line-mask" style={s("position:relative")}>
              <span
                id="dnaRotator"
                data-rotator=""
                style={s(
                  "display:inline-block;color:#34D399;white-space:nowrap;transform-origin:left center;will-change:transform,opacity"
                )}
              >
                Datacenter
              </span>
            </span>
            <span className="dna-line-mask">
              <span className="dna-split" data-split="">
                Genesis
              </span>
            </span>
          </h1>
          <div
            style={s(
              "display:flex;justify-content:space-between;align-items:flex-end;margin-top:46px;flex-wrap:wrap;gap:30px"
            )}
          >
            <p
              data-reveal=""
              data-anim="up"
              style={s(
                "font-size:17px;line-height:1.65;color:rgba(255,255,255,.58);max-width:500px;margin:0"
              )}
            >
              Elevating Infrastructure, Connectivity, and Software into a
              monumental symphony of technology — Datacentre, Network &amp;
              Application, architected as one living organism.
            </p>
            <a
              href="#work"
              data-cursor=""
              className="dna-hover-cta"
              style={s(
                "display:inline-flex;align-items:center;gap:14px;text-decoration:none;color:#fff;font-family:var(--font-head);font-size:14px;font-weight:600;letter-spacing:.04em;text-transform:uppercase"
              )}
            >
              <span
                style={s(
                  "width:64px;height:64px;border:1px solid rgba(255,255,255,.25);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .3s,border-color .3s"
                )}
              >
                ↓
              </span>
              Enter the Symphony
            </a>
          </div>
        </div>
      </section>

      {/* MARQUEE 1 */}
      <div
        style={s(
          "background:linear-gradient(100deg,#34D399,#22D3EE 50%,#A855F7);padding:22px 0;overflow:hidden;border-top:1px solid #08090b;border-bottom:1px solid #08090b"
        )}
      >
        <div
          style={s("display:flex;width:max-content;animation:dnaMarquee 24s linear infinite")}
        >
          {[...MARQUEE1, ...MARQUEE1].map((m, i) => (
            <span
              key={i}
              style={s(
                "font-family:var(--font-head);font-size:clamp(26px,3vw,42px);font-weight:700;color:#08090b;text-transform:uppercase;letter-spacing:-.01em;padding:0 30px;display:inline-flex;align-items:center;gap:30px;white-space:nowrap"
              )}
            >
              {m}
              <span style={s("color:rgba(8,9,11,.4)")}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section
        id="about"
        style={s("background:#08090b;padding:140px 48px;position:relative")}
      >
        <div style={s("max-width:1400px;margin:0 auto")}>
          <p
            data-reveal=""
            data-anim="fade"
            style={s(
              "font-family:var(--font-head);font-size:12px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;background:linear-gradient(100deg,#34D399,#22D3EE,#A855F7);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0 0 50px"
            )}
          >
            ( Who We Are )
          </p>
          <div
            data-stagger-lines=""
            style={s(
              "font-family:var(--font-head);font-size:clamp(28px,4.4vw,68px);font-weight:500;line-height:1.12;letter-spacing:-.02em;color:#fff;max-width:1200px"
            )}
          >
            <span className="dna-line-mask">
              <span className="ln">
                Just as DNA carries the{" "}
                <span
                  style={s(
                    "background:linear-gradient(100deg,#34D399,#22D3EE,#A855F7);-webkit-background-clip:text;background-clip:text;color:transparent"
                  )}
                >
                  genetic code of life
                </span>
                ,
              </span>
            </span>
            <span className="dna-line-mask">
              <span className="ln">DNA Technology engineers the fundamental</span>
            </span>
            <span className="dna-line-mask">
              <span className="ln">blueprint for business resilience</span>
            </span>
            <span className="dna-line-mask">
              <span className="ln">and technical dominance.</span>
            </span>
          </div>
          <div
            className="dna-stats-grid"
            style={s(
              "display:grid;grid-template-columns:repeat(4,1fr);gap:2px;background:rgba(255,255,255,.08);margin-top:90px"
            )}
          >
            {STATS.map((st, i) => (
              <div
                key={i}
                data-reveal=""
                data-anim="up"
                style={s("background:#08090b;padding:44px 30px")}
              >
                <div
                  data-count={st.number}
                  style={s(
                    "font-family:var(--font-head);font-size:clamp(44px,5vw,76px);font-weight:700;color:#fff;line-height:1;letter-spacing:-.03em"
                  )}
                >
                  {st.number}
                </div>
                <div
                  style={s(
                    "font-size:13px;color:rgba(255,255,255,.45);margin-top:14px;line-height:1.4"
                  )}
                >
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE TRINITY */}
      <section
        id="work"
        style={s(
          "background:#0b0c0f;padding:140px 48px;position:relative;overflow:hidden"
        )}
      >
        <div
          data-parallax="-0.06"
          style={s(
            "position:absolute;top:12%;left:-4%;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(52,211,153,.14),transparent 70%);filter:blur(50px);z-index:0"
          )}
        />
        <div
          data-parallax="-0.12"
          style={s(
            "position:absolute;bottom:8%;right:-3%;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,.16),transparent 70%);filter:blur(50px);z-index:0"
          )}
        />
        <div
          style={s(
            "max-width:1400px;margin:0 auto;position:relative;z-index:1"
          )}
        >
          <div
            style={s(
              "display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:24px;margin-bottom:60px"
            )}
          >
            <h2
              data-reveal=""
              data-anim="up"
              style={s(
                "font-family:var(--font-head);font-size:clamp(40px,7vw,110px);font-weight:700;letter-spacing:-.03em;line-height:.9;margin:0;text-transform:uppercase;color:#fff"
              )}
            >
              The
              <br />
              Trinity
            </h2>
            <p
              data-reveal=""
              data-anim="up"
              style={s(
                "font-size:16px;line-height:1.7;color:rgba(255,255,255,.55);max-width:380px;margin:0"
              )}
            >
              Three pillars. One living organism. Architected in perfect symphony
              — hover a pillar to feel it breathe.
            </p>
          </div>

          <div
            className="dna-bento"
            style={s("display:grid;grid-template-columns:5fr 7fr;gap:14px")}
          >
            {/* D */}
            <div
              className="dna-bento-d dna-tile-d"
              data-reveal=""
              data-anim="up"
              data-cursor=""
              data-neural-tile=""
              data-pillar="d"
              data-accent="#34D399"
              data-parallax="-0.03"
              style={s(
                "grid-row:span 2;position:relative;overflow:hidden;background:#101114;border:1px solid rgba(52,211,153,.24);border-radius:8px;padding:46px 42px;transition:border-color .35s ease"
              )}
            >
              <canvas
                data-neural=""
                style={s(
                  "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .5s ease;z-index:1"
                )}
              />
              <div
                data-glow=""
                style={s(
                  "position:absolute;inset:0;background:radial-gradient(circle at 50% 108%,rgba(52,211,153,.28),transparent 66%);opacity:0;transition:opacity .5s ease;pointer-events:none;z-index:0"
                )}
              />
              <div style={s("position:relative;z-index:2")}>
                <div
                  style={s(
                    "display:flex;justify-content:space-between;align-items:center"
                  )}
                >
                  <div style={s("display:flex;align-items:center;gap:18px")}>
                    <div
                      style={s("width:46px;height:46px;flex-shrink:0")}
                      dangerouslySetInnerHTML={{ __html: ic(DC_PATH, "#34D399") }}
                    />
                    <div>
                      <div
                        style={s(
                          "font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(52,211,153,.75);margin-bottom:6px"
                        )}
                      >
                        Data Centre
                      </div>
                      <div
                        style={s(
                          "font-family:var(--font-head);font-size:clamp(26px,2.8vw,42px);font-weight:700;letter-spacing:-.02em;line-height:1;color:#fff"
                        )}
                      >
                        Digital Genesis
                      </div>
                    </div>
                  </div>
                  <span
                    style={s(
                      "font-family:var(--font-head);font-size:13px;font-weight:700;color:#34D399;letter-spacing:.14em"
                    )}
                  >
                    01 / D
                  </span>
                </div>
                <p
                  style={s(
                    "font-size:15px;line-height:1.7;color:rgba(255,255,255,.55);margin:22px 0 20px;max-width:560px"
                  )}
                >
                  Establishing the physical bastion of stability through
                  marvelous co-location and fit-out engineering — the bedrock of
                  modern industry.
                </p>
                <div style={s("display:flex;flex-wrap:wrap;gap:7px")}>
                  {["Feasibility", "Power & Cooling", "Certification", "Commissioning"].map(
                    (t) => (
                      <span
                        key={t}
                        style={s(
                          "font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#34D399;border:1px solid rgba(52,211,153,.35);padding:6px 12px;border-radius:100px"
                        )}
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* N */}
            <div
              className="dna-tile-n"
              data-reveal=""
              data-anim="up"
              data-cursor=""
              data-neural-tile=""
              data-pillar="n"
              data-accent="#22D3EE"
              data-parallax="-0.05"
              style={s(
                "position:relative;overflow:hidden;background:#101114;border:1px solid rgba(34,211,238,.24);border-radius:8px;padding:40px 40px;min-height:230px;transition:border-color .35s ease"
              )}
            >
              <canvas
                data-neural=""
                style={s(
                  "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .5s ease;z-index:1"
                )}
              />
              <div
                data-glow=""
                style={s(
                  "position:absolute;inset:0;background:radial-gradient(circle at 50% 108%,rgba(34,211,238,.26),transparent 66%);opacity:0;transition:opacity .5s ease;pointer-events:none;z-index:0"
                )}
              />
              <div style={s("position:relative;z-index:2")}>
                <div
                  style={s(
                    "display:flex;justify-content:space-between;align-items:center"
                  )}
                >
                  <div style={s("display:flex;align-items:center;gap:18px")}>
                    <div
                      style={s("width:46px;height:46px;flex-shrink:0")}
                      dangerouslySetInnerHTML={{ __html: ic(NET_PATH, "#22D3EE") }}
                    />
                    <div>
                      <div
                        style={s(
                          "font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(34,211,238,.75);margin-bottom:6px"
                        )}
                      >
                        Network
                      </div>
                      <div
                        style={s(
                          "font-family:var(--font-head);font-size:clamp(26px,2.8vw,42px);font-weight:700;letter-spacing:-.02em;line-height:1;color:#fff"
                        )}
                      >
                        The Neural Nexus
                      </div>
                    </div>
                  </div>
                  <span
                    style={s(
                      "font-family:var(--font-head);font-size:13px;font-weight:700;color:#22D3EE;letter-spacing:.14em"
                    )}
                  >
                    02 / N
                  </span>
                </div>
                <p
                  style={s(
                    "font-size:15px;line-height:1.7;color:rgba(255,255,255,.55);margin:22px 0 20px;max-width:560px"
                  )}
                >
                  Weaving a neural synapse of connectivity, from inter-DC
                  interconnects to dedicated access — a single resilient nexus
                  for your enterprise.
                </p>
                <div style={s("display:flex;flex-wrap:wrap;gap:7px")}>
                  {["Colocation", "Connectivity", "Network Security", "Managed Service"].map(
                    (t) => (
                      <span
                        key={t}
                        style={s(
                          "font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#22D3EE;border:1px solid rgba(34,211,238,.35);padding:6px 12px;border-radius:100px"
                        )}
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* A */}
            <div
              className="dna-tile-a"
              data-reveal=""
              data-anim="up"
              data-cursor=""
              data-neural-tile=""
              data-pillar="a"
              data-accent="#A855F7"
              data-parallax="-0.07"
              style={s(
                "position:relative;overflow:hidden;background:#101114;border:1px solid rgba(168,85,247,.24);border-radius:8px;padding:40px 40px;min-height:230px;transition:border-color .35s ease"
              )}
            >
              <canvas
                data-neural=""
                style={s(
                  "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .5s ease;z-index:1"
                )}
              />
              <div
                data-glow=""
                style={s(
                  "position:absolute;inset:0;background:radial-gradient(circle at 50% 108%,rgba(168,85,247,.28),transparent 66%);opacity:0;transition:opacity .5s ease;pointer-events:none;z-index:0"
                )}
              />
              <div style={s("position:relative;z-index:2")}>
                <div
                  style={s(
                    "display:flex;justify-content:space-between;align-items:center"
                  )}
                >
                  <div style={s("display:flex;align-items:center;gap:18px")}>
                    <div
                      style={s("width:46px;height:46px;flex-shrink:0")}
                      dangerouslySetInnerHTML={{ __html: ic(APP_PATH, "#A855F7") }}
                    />
                    <div>
                      <div
                        style={s(
                          "font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(168,85,247,.8);margin-bottom:6px"
                        )}
                      >
                        Application
                      </div>
                      <div
                        style={s(
                          "font-family:var(--font-head);font-size:clamp(26px,2.8vw,42px);font-weight:700;letter-spacing:-.02em;line-height:1;color:#fff"
                        )}
                      >
                        Bespoke Masterpieces
                      </div>
                    </div>
                  </div>
                  <span
                    style={s(
                      "font-family:var(--font-head);font-size:13px;font-weight:700;color:#A855F7;letter-spacing:.14em"
                    )}
                  >
                    03 / A
                  </span>
                </div>
                <p
                  style={s(
                    "font-size:15px;line-height:1.7;color:rgba(255,255,255,.55);margin:22px 0 20px;max-width:560px"
                  )}
                >
                  Forging bespoke digital masterpieces tailored to the unique
                  visionary goals of your enterprise — complexity transformed
                  into elegant functionality.
                </p>
                <div style={s("display:flex;flex-wrap:wrap;gap:7px")}>
                  {["ERP · LMS", "AI Analytics", "Mobile Apps", "Customized"].map((t) => (
                    <span
                      key={t}
                      style={s(
                        "font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#C084FC;border:1px solid rgba(168,85,247,.38);padding:6px 12px;border-radius:100px"
                      )}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section
        id="solutions"
        style={s(
          "background:#08090b;padding:140px 48px;position:relative;overflow:hidden"
        )}
      >
        <div
          data-parallax="-0.08"
          style={s(
            "position:absolute;top:20%;left:-5%;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,.18),transparent 70%);filter:blur(44px);z-index:0"
          )}
        />
        <div
          style={s(
            "max-width:1400px;margin:0 auto;position:relative;z-index:1"
          )}
        >
          <p
            data-reveal=""
            data-anim="fade"
            style={s(
              "font-family:var(--font-head);font-size:12px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;background:linear-gradient(100deg,#34D399,#22D3EE,#A855F7);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0 0 28px"
            )}
          >
            ( Solutions Spotlight )
          </p>
          <h2
            data-reveal=""
            data-anim="up"
            style={s(
              "font-family:var(--font-head);font-size:clamp(34px,5vw,82px);font-weight:700;letter-spacing:-.03em;line-height:.96;margin:0 0 60px;color:#fff;max-width:1000px;text-transform:uppercase"
            )}
          >
            Engineered to keep your
            <br />
            genesis alive &amp; sovereign
          </h2>
          <div
            className="dna-sol-grid"
            style={s("display:grid;grid-template-columns:7fr 5fr;gap:14px")}
          >
            <div
              className="dna-tile-sol-a"
              data-reveal=""
              data-anim="up"
              data-cursor=""
              data-neural-tile=""
              data-accent="#22D3EE"
              style={s(
                "position:relative;overflow:hidden;background:#101114;border:1px solid rgba(34,211,238,.22);border-radius:8px;padding:54px 46px;min-height:280px;transition:border-color .35s ease"
              )}
            >
              <canvas
                data-neural=""
                style={s(
                  "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .5s ease;z-index:1"
                )}
              />
              <div
                data-glow=""
                style={s(
                  "position:absolute;inset:0;background:radial-gradient(circle at 30% 108%,rgba(52,211,153,.2),transparent 60%),radial-gradient(circle at 80% 108%,rgba(34,211,238,.22),transparent 60%);opacity:0;transition:opacity .5s ease;pointer-events:none;z-index:0"
                )}
              />
              <div style={s("position:relative;z-index:2")}>
                <div
                  style={s("width:56px;height:56px;margin-bottom:30px")}
                  dangerouslySetInnerHTML={{ __html: ic(SOL_A_PATH, "#22D3EE") }}
                />
                <div
                  style={s(
                    "font-family:var(--font-head);font-size:clamp(26px,2.8vw,40px);font-weight:700;letter-spacing:-.02em;color:#fff;margin-bottom:18px;line-height:1.05"
                  )}
                >
                  Data Centre &amp; Connectivity
                </div>
                <p
                  style={s(
                    "font-size:15px;color:rgba(255,255,255,.5);line-height:1.75;margin:0 0 28px;max-width:600px"
                  )}
                >
                  Secure, reliable and infinitely scalable Data Centre and
                  connectivity solutions — global-grade infrastructure with
                  seamless multi-cloud integration that keeps your genesis
                  running without interruption.
                </p>
                <div style={s("display:flex;flex-wrap:wrap;gap:8px")}>
                  <span
                    style={s(
                      "font-family:var(--font-head);font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#34D399;border:1px solid rgba(52,211,153,.35);padding:6px 13px;border-radius:100px"
                    )}
                  >
                    Multi-cloud
                  </span>
                  <span
                    style={s(
                      "font-family:var(--font-head);font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#22D3EE;border:1px solid rgba(34,211,238,.35);padding:6px 13px;border-radius:100px"
                    )}
                  >
                    Scalable
                  </span>
                  <span
                    style={s(
                      "font-family:var(--font-head);font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#22D3EE;border:1px solid rgba(34,211,238,.35);padding:6px 13px;border-radius:100px"
                    )}
                  >
                    High Availability
                  </span>
                </div>
              </div>
            </div>
            <div
              className="dna-tile-sol-b"
              data-reveal=""
              data-anim="up"
              data-cursor=""
              data-neural-tile=""
              data-accent="#A855F7"
              style={s(
                "position:relative;overflow:hidden;background:#101114;border:1px solid rgba(168,85,247,.22);border-radius:8px;padding:54px 46px;min-height:280px;transition:border-color .35s ease"
              )}
            >
              <canvas
                data-neural=""
                style={s(
                  "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .5s ease;z-index:1"
                )}
              />
              <div
                data-glow=""
                style={s(
                  "position:absolute;inset:0;background:radial-gradient(circle at 50% 108%,rgba(168,85,247,.26),transparent 64%);opacity:0;transition:opacity .5s ease;pointer-events:none;z-index:0"
                )}
              />
              <div style={s("position:relative;z-index:2")}>
                <div
                  style={s("width:56px;height:56px;margin-bottom:30px")}
                  dangerouslySetInnerHTML={{ __html: ic(SOL_B_PATH, "#A855F7") }}
                />
                <div
                  style={s(
                    "font-family:var(--font-head);font-size:clamp(26px,2.8vw,40px);font-weight:700;letter-spacing:-.02em;color:#fff;margin-bottom:18px;line-height:1.05"
                  )}
                >
                  Security &amp; Surveillance
                </div>
                <p
                  style={s(
                    "font-size:15px;color:rgba(255,255,255,.5);line-height:1.75;margin:0 0 28px"
                  )}
                >
                  Smart Security &amp; Surveillance delivering real-time
                  monitoring, AI-powered threat detection and seamless access
                  control — guarding people, assets and operations.
                </p>
                <div style={s("display:flex;flex-wrap:wrap;gap:8px")}>
                  <span
                    style={s(
                      "font-family:var(--font-head);font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#C084FC;border:1px solid rgba(168,85,247,.38);padding:6px 13px;border-radius:100px"
                    )}
                  >
                    AI Detection
                  </span>
                  <span
                    style={s(
                      "font-family:var(--font-head);font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#C084FC;border:1px solid rgba(168,85,247,.38);padding:6px 13px;border-radius:100px"
                    )}
                  >
                    Access Control
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section
        id="approach"
        style={s("background:#08090b;padding:60px 48px 140px")}
      >
        <div style={s("max-width:1400px;margin:0 auto")}>
          <div
            style={s(
              "display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:24px;margin-bottom:64px;border-top:1px solid rgba(255,255,255,.1);padding-top:50px"
            )}
          >
            <h2
              data-reveal=""
              data-anim="up"
              style={s(
                "font-family:var(--font-head);font-size:clamp(32px,4.4vw,70px);font-weight:700;letter-spacing:-.03em;line-height:.92;margin:0;color:#fff;text-transform:uppercase"
              )}
            >
              Our
              <br />
              Approach
            </h2>
            <p
              data-reveal=""
              data-anim="up"
              style={s(
                "font-size:15px;color:rgba(255,255,255,.5);max-width:340px;margin:0;line-height:1.7"
              )}
            >
              Three connected capabilities that turn requirements into working,
              end-to-end solutions.
            </p>
          </div>
          <div
            className="dna-approach-grid"
            style={s("display:grid;grid-template-columns:repeat(3,1fr);gap:34px")}
          >
            {APPROACH.map((a) => (
              <div
                key={a.num}
                data-reveal=""
                data-anim="up"
                data-cursor=""
                style={{
                  ...s("padding-top:26px;border-top:2px solid transparent"),
                  borderImage:
                    "linear-gradient(90deg,#34D399,#22D3EE,#A855F7) 1",
                }}
              >
                <div
                  style={s(
                    "font-family:var(--font-head);font-size:14px;font-weight:700;color:rgba(255,255,255,.3);margin-bottom:22px"
                  )}
                >
                  {a.num} / 03
                </div>
                <div
                  style={s(
                    "font-family:var(--font-head);font-size:23px;font-weight:700;color:#fff;letter-spacing:-.01em;line-height:1.18;margin-bottom:16px"
                  )}
                >
                  {a.title}
                </div>
                <p
                  style={s(
                    "font-size:14.5px;color:rgba(255,255,255,.5);line-height:1.7;margin:0"
                  )}
                >
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE 2 */}
      <div
        style={s(
          "background:#08090b;border-top:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.1);padding:30px 0;overflow:hidden"
        )}
      >
        <div
          style={s("display:flex;width:max-content;animation:dnaMarqueeR 30s linear infinite")}
        >
          {[...MODEL_TITLES, ...MODEL_TITLES].map((m, i) => (
            <span
              key={i}
              data-cursor=""
              className="dna-model-word"
              style={s(
                "font-family:var(--font-head);font-size:clamp(22px,2.6vw,38px);font-weight:600;color:rgba(255,255,255,.42);text-transform:uppercase;letter-spacing:-.01em;padding:0 28px;display:inline-flex;align-items:center;gap:28px;white-space:nowrap;transition:color .35s ease,text-shadow .35s ease"
              )}
            >
              {m}
              <span style={s("color:#22D3EE")}>/</span>
            </span>
          ))}
        </div>
      </div>

      {/* BUSINESS MODEL */}
      <section id="model" style={s("background:#08090b;padding:140px 48px")}>
        <div style={s("max-width:1400px;margin:0 auto")}>
          <p
            data-reveal=""
            data-anim="fade"
            style={s(
              "font-family:var(--font-head);font-size:12px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;background:linear-gradient(100deg,#34D399,#22D3EE,#A855F7);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0 0 28px"
            )}
          >
            ( Our Business Model )
          </p>
          <h2
            data-reveal=""
            data-anim="up"
            style={s(
              "font-family:var(--font-head);font-size:clamp(40px,7vw,120px);font-weight:700;letter-spacing:-.03em;line-height:.88;margin:0 0 70px;color:#fff;text-transform:uppercase"
            )}
          >
            Flexible
            <br />
            by Design
          </h2>
          <div>
            {MODELS.map((m) => (
              <div
                key={m.num}
                data-reveal=""
                data-anim="up"
                data-cursor=""
                className="dna-model-row"
                style={s(
                  "border-top:1px solid rgba(255,255,255,.12);padding:38px 0;display:grid;grid-template-columns:90px 1fr 1.6fr;gap:36px;align-items:start"
                )}
              >
                <div
                  style={s(
                    "font-family:var(--font-head);font-size:clamp(34px,4vw,58px);font-weight:700;background:linear-gradient(120deg,#34D399,#22D3EE,#A855F7);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1"
                  )}
                >
                  {m.num}
                </div>
                <div
                  style={s(
                    "font-family:var(--font-head);font-size:clamp(20px,2vw,26px);font-weight:700;color:#fff;letter-spacing:-.01em;line-height:1.2"
                  )}
                >
                  {m.title}
                </div>
                <p
                  style={s(
                    "font-size:15px;color:rgba(255,255,255,.5);line-height:1.7;margin:0"
                  )}
                >
                  {m.desc}
                </p>
              </div>
            ))}
            <div style={s("border-top:1px solid rgba(255,255,255,.12)")} />
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section
        id="sectors"
        style={s(
          "background:#eceef3;color:#0a0a0a;padding:120px 48px;overflow:hidden"
        )}
      >
        <div style={s("max-width:1400px;margin:0 auto 60px")}>
          <p
            data-reveal=""
            data-anim="fade"
            style={s(
              "font-family:var(--font-head);font-size:12px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;background:linear-gradient(100deg,#059669,#0891B2,#7C3AED);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0 0 18px"
            )}
          >
            ( Industry &amp; Sector )
          </p>
          <h2
            data-reveal=""
            data-anim="up"
            style={s(
              "font-family:var(--font-head);font-size:clamp(32px,4.4vw,64px);font-weight:700;letter-spacing:-.03em;line-height:.96;margin:0;text-transform:uppercase"
            )}
          >
            Mastery across
            <br />
            industries
          </h2>
        </div>
        <div
          style={{
            overflow: "hidden",
            WebkitMaskImage:
              "linear-gradient(to right,transparent,#000 6%,#000 94%,transparent)",
            maskImage:
              "linear-gradient(to right,transparent,#000 6%,#000 94%,transparent)",
          }}
        >
          <div
            style={s(
              "display:flex;width:max-content;animation:dnaMarquee 32s linear infinite"
            )}
          >
            {[...SECTORS, ...SECTORS].map((sec, i) => (
              <span
                key={i}
                style={s(
                  "font-family:var(--font-head);font-size:clamp(26px,3vw,48px);font-weight:700;color:#0a0a0a;text-transform:uppercase;letter-spacing:-.02em;padding:0 28px;display:inline-flex;align-items:center;gap:28px;white-space:nowrap"
                )}
              >
                {sec}
                <span
                  style={s(
                    "width:12px;height:12px;border-radius:50%;background:linear-gradient(120deg,#059669,#0891B2,#7C3AED);display:inline-block"
                  )}
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section
        id="clients"
        style={s("background:#08090b;padding:120px 48px 90px")}
      >
        <div style={s("max-width:1400px;margin:0 auto 50px")}>
          <p
            data-reveal=""
            data-anim="fade"
            style={s(
              "font-family:var(--font-head);font-size:12px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;background:linear-gradient(100deg,#34D399,#22D3EE,#A855F7);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0 0 18px"
            )}
          >
            ( Trusted By )
          </p>
          <h2
            data-reveal=""
            data-anim="up"
            style={s(
              "font-family:var(--font-head);font-size:clamp(30px,4vw,58px);font-weight:700;letter-spacing:-.03em;line-height:.98;margin:0;color:#fff;text-transform:uppercase"
            )}
          >
            Clients across Indonesia
          </h2>
        </div>
        <div
          style={{
            overflow: "hidden",
            WebkitMaskImage:
              "linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)",
            maskImage:
              "linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)",
          }}
        >
          <div
            style={s(
              "display:flex;width:max-content;animation:dnaMarqueeR 40s linear infinite"
            )}
          >
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <div
                key={i}
                data-cursor=""
                style={s(
                  "display:flex;align-items:center;justify-content:center;padding:0 40px;height:80px;border-right:1px solid rgba(255,255,255,.07);white-space:nowrap"
                )}
              >
                <span
                  className="dna-client-name"
                  style={s(
                    "font-family:var(--font-head);font-size:15px;font-weight:600;color:rgba(255,255,255,.6);letter-spacing:.03em;text-transform:uppercase;transition:color .35s ease,text-shadow .35s ease"
                  )}
                >
                  {c}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        style={s(
          "background:linear-gradient(110deg,#34D399,#22D3EE 45%,#A855F7);background-size:200% 200%;animation:dnaGrad 14s linear infinite alternate;color:#08090b;padding:140px 48px;position:relative;overflow:hidden"
        )}
      >
        <div
          style={s(
            "max-width:1400px;margin:0 auto;position:relative;z-index:1"
          )}
        >
          <div
            className="dna-contact-grid"
            style={s(
              "display:grid;grid-template-columns:1.1fr .9fr;gap:80px;align-items:start"
            )}
          >
            <div>
              <p
                data-reveal=""
                data-anim="fade"
                style={s(
                  "font-family:var(--font-head);font-size:12px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:rgba(8,9,11,.65);margin:0 0 24px"
                )}
              >
                ( Get In Touch )
              </p>
              <h2
                data-reveal=""
                data-anim="up"
                style={s(
                  "font-family:var(--font-head);font-size:clamp(44px,7vw,128px);font-weight:700;letter-spacing:-.04em;line-height:.86;margin:0 0 40px;text-transform:uppercase"
                )}
              >
                Let&apos;s
                <br />
                Architect It
              </h2>
              <div>
                {[
                  {
                    label: "Phone",
                    icon: ic(PHONE_PATH, "#08090b"),
                    html: '<a href="tel:+6281519978967" style="color:inherit;text-decoration:none;">+62 815 1997 8967</a>  ·  <a href="tel:+62811844420" style="color:inherit;text-decoration:none;">+62 811 8444 20</a>',
                  },
                  {
                    label: "Email",
                    icon: ic(MAIL_PATH, "#08090b"),
                    html: '<a href="mailto:hello@dnatechnology.co.id" style="color:inherit;text-decoration:none;">hello@dnatechnology.co.id</a>',
                  },
                  {
                    label: "Website",
                    icon: ic(NET_PATH, "#08090b"),
                    html: '<a href="https://www.dnatechnology.co.id" target="_blank" rel="noreferrer" style="color:inherit;text-decoration:none;">www.dnatechnology.co.id</a>',
                  },
                ].map((ct) => (
                  <div
                    key={ct.label}
                    data-reveal=""
                    data-anim="up"
                    style={s(
                      "display:flex;gap:18px;padding:22px 0;border-bottom:1px solid rgba(8,9,11,.2);align-items:center"
                    )}
                  >
                    <div
                      style={s("width:38px;height:38px;flex-shrink:0")}
                      dangerouslySetInnerHTML={{ __html: ct.icon }}
                    />
                    <div>
                      <div
                        style={s(
                          "font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(8,9,11,.6);margin-bottom:4px"
                        )}
                      >
                        {ct.label}
                      </div>
                      <div
                        style={s(
                          "font-family:var(--font-head);font-size:17px;color:#08090b;font-weight:600;line-height:1.5"
                        )}
                        dangerouslySetInnerHTML={{ __html: ct.html }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              data-reveal=""
              data-anim="up"
              style={s("background:#08090b;padding:42px 38px;border-radius:6px")}
            >
              <p
                style={s(
                  "font-family:var(--font-head);font-size:20px;font-weight:700;color:#fff;margin:0 0 26px;letter-spacing:-.02em"
                )}
              >
                Send a Message
              </p>
              <div
                className="dna-form-grid"
                style={s(
                  "display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px"
                )}
              >
                <input
                  data-cursor=""
                  type="text"
                  placeholder="Name"
                  className="dna-input"
                  style={s(
                    "width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:14px 16px;font-family:var(--font-body);font-size:14px;color:#fff;outline:none"
                  )}
                />
                <input
                  data-cursor=""
                  type="text"
                  placeholder="Company"
                  className="dna-input"
                  style={s(
                    "width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:14px 16px;font-family:var(--font-body);font-size:14px;color:#fff;outline:none"
                  )}
                />
              </div>
              <input
                data-cursor=""
                type="email"
                placeholder="Email"
                className="dna-input"
                style={s(
                  "width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:14px 16px;font-family:var(--font-body);font-size:14px;color:#fff;outline:none;margin-bottom:14px"
                )}
              />
              <select
                data-cursor=""
                className="dna-input"
                defaultValue="Data Centre"
                style={s(
                  "width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:14px 16px;font-family:var(--font-body);font-size:14px;color:#fff;outline:none;appearance:none;margin-bottom:14px"
                )}
              >
                <option style={s("background:#222")}>Data Centre</option>
                <option style={s("background:#222")}>Network</option>
                <option style={s("background:#222")}>Application</option>
                <option style={s("background:#222")}>
                  Security &amp; Surveillance
                </option>
                <option style={s("background:#222")}>Other</option>
              </select>
              <textarea
                data-cursor=""
                placeholder="Tell us about your genesis..."
                className="dna-input"
                style={s(
                  "width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:14px 16px;font-family:var(--font-body);font-size:14px;color:#fff;outline:none;min-height:100px;resize:vertical;margin-bottom:16px"
                )}
              />
              <button
                data-cursor=""
                type="submit"
                className="dna-submit"
                style={s(
                  "width:100%;background:linear-gradient(110deg,#34D399,#22D3EE,#A855F7);color:#08090b;font-family:var(--font-head);font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:16px;border:none;border-radius:4px;cursor:none;transition:filter .2s"
                )}
              >
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s("background:#08090b;padding:60px 48px 40px")}>
        <div
          style={s(
            "max-width:1400px;margin:0 auto;display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:30px"
          )}
        >
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/brand-logo-dna-white.png"
              alt="DNA Technology"
              style={s("height:60px;width:auto;display:block")}
            />
          </div>
          <div style={s("text-align:right")}>
            <div
              style={s(
                "display:flex;gap:12px;align-items:center;justify-content:flex-end;margin-bottom:14px"
              )}
            >
              <span
                style={s(
                  "font-family:var(--font-head);font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#34D399"
                )}
              >
                Data Centre
              </span>
              <span style={s("color:rgba(255,255,255,.2)")}>·</span>
              <span
                style={s(
                  "font-family:var(--font-head);font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#22D3EE"
                )}
              >
                Network
              </span>
              <span style={s("color:rgba(255,255,255,.2)")}>·</span>
              <span
                style={s(
                  "font-family:var(--font-head);font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#A855F7"
                )}
              >
                Application
              </span>
            </div>
            <div style={s("font-size:12px;color:rgba(255,255,255,.3)")}>
              © {year} DNA Technology. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
