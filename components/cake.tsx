"use client";
import { useState, useEffect, useRef } from "react";

const NUM_CONFETTI = 80;

function randomBetween(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

interface ConfettiProps {
  active: boolean;
}

interface SparkleProps {
  x: string;
  y: string;
  delay: number;
}

interface FlameProps {
  i: number;
}

interface SparkleItem {
  id: number;
  x: string;
  y: string;
  delay: number;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  dur: number;
  color: string;
  size: number;
  rotate: number;
  shape: string;
}

type Phase = "idle" | "cutting" | "cut" | "celebrate";

function Confetti({ active }: ConfettiProps) {
  const pieces = useRef<ConfettiPiece[]>(
    Array.from({ length: NUM_CONFETTI }, (_, i) => ({
      id: i,
      x: randomBetween(10, 90),
      delay: randomBetween(0, 0.6),
      dur: randomBetween(1.2, 2.2),
      color: [
        "#FF6B6B",
        "#FFD93D",
        "#6BCB77",
        "#4D96FF",
        "#FF922B",
        "#cc5de8",
        "#f06595",
        "#74c0fc",
      ][i % 8],
      size: randomBetween(7, 14),
      rotate: randomBetween(0, 360),
      shape: i % 3 === 0 ? "circle" : i % 3 === 1 ? "rect" : "star",
    })),
  );

  if (!active) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 50 }}
    >
      {pieces.current.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-20px",
            width: p.shape === "circle" ? p.size : p.size,
            height: p.shape === "circle" ? p.size : p.size * 0.6,
            background: p.color,
            borderRadius:
              p.shape === "circle" ? "50%" : p.shape === "rect" ? "2px" : "0",
            clipPath:
              p.shape === "star"
                ? "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"
                : "none",
            animation: `confettiFall ${p.dur}s ease-in ${p.delay}s both`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Flame({ i }: FlameProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "100%",
        left: `${16 + i * 28}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        animation: `flicker${i % 3} 0.7s ease-in-out infinite alternate`,
      }}
    >
      {/* flame */}
      <div
        style={{
          width: 10,
          height: 18,
          background: "linear-gradient(to top, #ff9500, #ffcc00, #fff)",
          borderRadius: "50% 50% 40% 40%",
          boxShadow: "0 0 8px 2px #ff950088",
          marginBottom: -2,
        }}
      />
      {/* wick */}
      <div
        style={{ width: 3, height: 22, background: "#2d1a00", borderRadius: 2 }}
      />
    </div>
  );
}

function Sparkle({ x, y, delay }: SparkleProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 8,
        height: 8,
        animation: `sparkle 0.6s ease-out ${delay}s both`,
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      ✨
    </div>
  );
}

export default function CakeCutting() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [knifeY, setKnifeY] = useState<number>(0);
  const [sliceProgress, setSliceProgress] = useState<number>(0);
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const handleCut = () => {
    if (phase !== "idle") return;
    setPhase("cutting");
    // Generate sparkles
    setSparkles(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: `${30 + Math.random() * 40}%`,
        y: `${30 + Math.random() * 30}%`,
        delay: i * 0.05,
      })),
    );

    // Animate knife down
    const duration = 900;
    startRef.current = performance.now() as number;
    const animate = (now: number) => {
      const elapsed = now - (startRef.current ?? 0);
      const progress = Math.min(elapsed / duration, 1);
      // easeInCubic
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setKnifeY(eased * 110);
      setSliceProgress(eased);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("cut");
        setTimeout(() => {
          setPhase("celebrate");
          setShowMessage(true);
        }, 400);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(
    () => () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    },
    [],
  );

  const isCut = phase === "cut" || phase === "celebrate";
  const isCelebrate = phase === "celebrate";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1a0533 0%, #2d0a4e 40%, #0a1a3d 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        overflow: "hidden",
        position: "relative",
        padding: "40px 20px",
      }}
    >
      {/* Stars bg */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            borderRadius: "50%",
            background: "#fff",
            opacity: Math.random() * 0.7 + 0.2,
            animation: `twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite alternate`,
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle { from { opacity: 0.2; } to { opacity: 0.9; } }
        @keyframes flicker0 { from { transform: scale(1) rotate(-3deg); } to { transform: scale(1.1) rotate(3deg); } }
        @keyframes flicker1 { from { transform: scale(0.95) rotate(2deg); } to { transform: scale(1.1) rotate(-4deg); } }
        @keyframes flicker2 { from { transform: scale(1.05) rotate(-2deg); } to { transform: scale(0.9) rotate(5deg); } }
        @keyframes sparkle { 0% { opacity: 0; transform: scale(0) rotate(0deg); } 50% { opacity: 1; transform: scale(1.5) rotate(180deg); } 100% { opacity: 0; transform: scale(0) rotate(360deg); } }
        @keyframes sliceLeft { 0% { transform: translateX(0) rotate(0deg); } 100% { transform: translateX(-30px) rotate(-8deg); } }
        @keyframes sliceRight { 0% { transform: translateX(0) rotate(0deg); } 100% { transform: translateX(30px) rotate(8deg); } }
        @keyframes floatUp { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-30px); opacity: 0; } }
        @keyframes popIn { 0% { transform: scale(0) rotate(-10deg); opacity: 0; } 70% { transform: scale(1.15) rotate(3deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes knifeShake { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(-6deg); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px #ff6baa88; } 50% { box-shadow: 0 0 40px #ff6baacc, 0 0 80px #ff6baa44; } }
        @keyframes titleGlow { 0%,100% { text-shadow: 0 0 20px #ffcc00aa; } 50% { text-shadow: 0 0 40px #ffcc00, 0 0 80px #ff6b6b88; } }
        @keyframes bounceIn { 0% { opacity:0; transform: scale(0.3) translateY(40px); } 60% { transform: scale(1.1) translateY(-10px); } 100% { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
      `}</style>

      {/* Title */}
      <h1
        style={{
          fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
          color: "#FFD700",
          marginBottom: 40,
          letterSpacing: "0.05em",
          textAlign: "center",
          animation: "titleGlow 2s ease-in-out infinite",
          fontStyle: "italic",
          fontWeight: 700,
        }}
      >
        🎉 Birthday Cake Cutting 🎉
      </h1>

      {/* Scene container */}
      <div style={{ position: "relative", width: 300, height: 340 }}>
        <Confetti active={isCelebrate} />

        {/* Knife */}
        {phase !== "idle" && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: -60,
              transform: `translateX(-50%) translateY(${knifeY}px) rotate(-8deg)`,
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              filter: "drop-shadow(0 4px 12px #00000088)",
            }}
          >
            {/* Handle */}
            <div
              style={{
                width: 22,
                height: 60,
                background: "linear-gradient(135deg, #8B4513, #5C2D0E)",
                borderRadius: "4px 4px 2px 2px",
                border: "2px solid #3d1a00",
                boxShadow: "inset 2px 2px 4px #ffffff22",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 3,
                  background: "#ffffff33",
                  marginTop: 12,
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  width: "100%",
                  height: 3,
                  background: "#ffffff22",
                  marginTop: 6,
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  width: "100%",
                  height: 3,
                  background: "#ffffff22",
                  marginTop: 6,
                  borderRadius: 2,
                }}
              />
            </div>
            {/* Guard */}
            <div
              style={{
                width: 36,
                height: 8,
                background: "#aaa",
                borderRadius: 2,
                boxShadow: "0 2px 4px #00000066",
              }}
            />
            {/* Blade */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "80px solid #e8e8e8",
                filter: "drop-shadow(2px 2px 3px #00000066)",
                position: "relative",
              }}
            >
              {/* shine */}
              <div
                style={{
                  position: "absolute",
                  top: -78,
                  left: -2,
                  width: 3,
                  height: 60,
                  background: "linear-gradient(to bottom, #fff, transparent)",
                  borderRadius: 2,
                  opacity: 0.6,
                }}
              />
            </div>
          </div>
        )}

        {/* Sparkles on cut */}
        {phase === "cutting" &&
          sparkles.map((s) => (
            <Sparkle key={s.id} x={s.x} y={s.y} delay={s.delay} />
          ))}

        {/* Cake */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 240,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Candles (hidden when cut) */}
          {!isCut && (
            <div
              style={{
                position: "relative",
                width: 96,
                height: 40,
                marginBottom: 0,
              }}
            >
              {[0, 1, 2].map((i) => (
                <Flame key={i} i={i} />
              ))}
            </div>
          )}

          {/* Top tier */}
          <div
            style={{
              width: isCut ? undefined : 110,
              display: isCut ? "flex" : "block",
              animation: isCut ? undefined : undefined,
            }}
          >
            {isCut ? (
              <div style={{ display: "flex", gap: 6 }}>
                <div
                  style={{
                    width: 52,
                    height: 50,
                    background:
                      "linear-gradient(180deg, #ff9ec4 0%, #ff6baa 60%, #e8457e 100%)",
                    borderRadius: "12px 4px 4px 4px",
                    boxShadow: "-3px 4px 12px #00000044",
                    animation: "sliceLeft 0.4s ease-out both",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* layers inside */}
                  <div
                    style={{
                      position: "absolute",
                      top: 15,
                      left: 0,
                      right: 0,
                      height: 5,
                      background: "#fff9",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 28,
                      left: 0,
                      right: 0,
                      height: 5,
                      background: "#ff6baa99",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 52,
                    height: 50,
                    background:
                      "linear-gradient(180deg, #ff9ec4 0%, #ff6baa 60%, #e8457e 100%)",
                    borderRadius: "4px 12px 4px 4px",
                    boxShadow: "3px 4px 12px #00000044",
                    animation: "sliceRight 0.4s ease-out both",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 15,
                      left: 0,
                      right: 0,
                      height: 5,
                      background: "#fff9",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 28,
                      left: 0,
                      right: 0,
                      height: 5,
                      background: "#ff6baa99",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: 110,
                  height: 50,
                  background:
                    "linear-gradient(180deg, #ffb8d9 0%, #ff6baa 60%, #e8457e 100%)",
                  borderRadius: "14px 14px 4px 4px",
                  boxShadow: "0 4px 16px #ff6baa44",
                  animation: "glow 2s ease-in-out infinite",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* frosting drips */}
                {[10, 28, 46, 64, 82].map((l, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: l,
                      width: 10,
                      height: 12 + (i % 2) * 6,
                      background: "#fff",
                      borderRadius: "0 0 6px 6px",
                      opacity: 0.85,
                    }}
                  />
                ))}
                {/* sprinkles */}
                {[
                  { l: 15, t: 20, r: 15 },
                  { l: 40, t: 30, r: 0 },
                  { l: 65, t: 18, r: 30 },
                  { l: 80, t: 32, r: 45 },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: s.l,
                      top: s.t,
                      width: 12,
                      height: 4,
                      borderRadius: 4,
                      background: ["#FFD700", "#6BCB77", "#4D96FF", "#FF922B"][
                        i
                      ],
                      transform: `rotate(${s.r}deg)`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Slice indicator line */}
          {phase === "cutting" && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 40,
                width: 3,
                height: `${sliceProgress * 130}px`,
                background: "linear-gradient(to bottom, #fff8, transparent)",
                borderRadius: 2,
                transform: "translateX(-50%)",
                zIndex: 20,
                transition: "height 0.05s",
              }}
            />
          )}

          {/* Middle tier */}
          <div
            style={{
              display: "flex",
              gap: isCut ? 8 : 0,
            }}
          >
            {isCut ? (
              <>
                <div
                  style={{
                    width: 100,
                    height: 60,
                    background:
                      "linear-gradient(180deg, #c084fc 0%, #9333ea 60%, #7e22ce 100%)",
                    borderRadius: "8px 2px 2px 8px",
                    animation: "sliceLeft 0.4s ease-out 0.05s both",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "-4px 6px 16px #00000055",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#fff8",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 38,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#c084fc88",
                    }}
                  />
                  {/* chocolate chips */}
                  {[
                    { l: 10, t: 10 },
                    { l: 60, t: 28 },
                    { l: 30, t: 42 },
                    { l: 75, t: 14 },
                  ].map((d, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: d.l,
                        top: d.t,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#5b21b6",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    width: 100,
                    height: 60,
                    background:
                      "linear-gradient(180deg, #c084fc 0%, #9333ea 60%, #7e22ce 100%)",
                    borderRadius: "2px 8px 8px 2px",
                    animation: "sliceRight 0.4s ease-out 0.05s both",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "4px 6px 16px #00000055",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#fff8",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 38,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#c084fc88",
                    }}
                  />
                </div>
              </>
            ) : (
              <div
                style={{
                  width: 200,
                  height: 60,
                  background:
                    "linear-gradient(180deg, #c084fc 0%, #9333ea 60%, #7e22ce 100%)",
                  borderRadius: "4px",
                  boxShadow: "0 4px 20px #9333ea55",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* frosting drips */}
                {[5, 30, 55, 80, 110, 140, 165].map((l, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: l,
                      width: 14,
                      height: 14 + (i % 3) * 5,
                      background: "#e9d5ff",
                      borderRadius: "0 0 8px 8px",
                      opacity: 0.9,
                    }}
                  />
                ))}
                {/* roses decoration */}
                {[20, 90, 160].map((l, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: l,
                      top: 22,
                      fontSize: 18,
                      lineHeight: 1,
                    }}
                  >
                    🌸
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom tier */}
          <div style={{ display: "flex", gap: isCut ? 10 : 0 }}>
            {isCut ? (
              <>
                <div
                  style={{
                    width: 108,
                    height: 70,
                    background:
                      "linear-gradient(180deg, #fb923c 0%, #ea580c 60%, #c2410c 100%)",
                    borderRadius: "2px 2px 10px 10px",
                    animation: "sliceLeft 0.4s ease-out 0.1s both",
                    boxShadow: "-5px 8px 20px #00000066",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 18,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#fff8",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 38,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#fb923c88",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 56,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#fff6",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 108,
                    height: 70,
                    background:
                      "linear-gradient(180deg, #fb923c 0%, #ea580c 60%, #c2410c 100%)",
                    borderRadius: "2px 2px 10px 10px",
                    animation: "sliceRight 0.4s ease-out 0.1s both",
                    boxShadow: "5px 8px 20px #00000066",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 18,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#fff8",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 38,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#fb923c88",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 56,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: "#fff6",
                    }}
                  />
                </div>
              </>
            ) : (
              <div
                style={{
                  width: 226,
                  height: 70,
                  background:
                    "linear-gradient(180deg, #fdba74 0%, #ea580c 60%, #c2410c 100%)",
                  borderRadius: "2px 2px 14px 14px",
                  boxShadow: "0 8px 30px #ea580c55",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* frosting */}
                {[5, 30, 55, 80, 110, 140, 165, 190].map((l, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: l,
                      width: 16,
                      height: 16 + (i % 3) * 6,
                      background: "#fed7aa",
                      borderRadius: "0 0 10px 10px",
                      opacity: 0.85,
                    }}
                  />
                ))}
                {/* dots */}
                {[15, 55, 95, 135, 175].map((l, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: l,
                      top: 36,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#7c3aed",
                      boxShadow: "0 0 6px #7c3aed99",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Plate */}
          <div
            style={{
              width: 260,
              height: 18,
              background: "linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)",
              borderRadius: "50%",
              boxShadow: "0 8px 24px #00000066",
              marginTop: 2,
            }}
          />
        </div>
      </div>

      {/* CTA Button */}
      {phase === "idle" && (
        <button
          onClick={handleCut}
          style={{
            marginTop: 48,
            padding: "16px 48px",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(135deg, #ff6baa, #c026d3, #7c3aed)",
            border: "none",
            borderRadius: 50,
            cursor: "pointer",
            letterSpacing: "0.06em",
            boxShadow: "0 0 30px #c026d388, 0 4px 20px #00000044",
            transition: "transform 0.15s, box-shadow 0.15s",
            fontFamily: "Georgia, serif",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1.06)";
            (e.target as HTMLElement).style.boxShadow =
              "0 0 50px #c026d3aa, 0 8px 30px #00000066";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1)";
            (e.target as HTMLElement).style.boxShadow =
              "0 0 30px #c026d388, 0 4px 20px #00000044";
          }}
        >
          🍰 Cut the Cake
        </button>
      )}

      {/* Birthday message */}
      {showMessage && (
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            animation: "bounceIn 0.7s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <div
            style={{
              fontSize: "clamp(1.6rem, 6vw, 2.6rem)",
              fontWeight: 900,
              background:
                "linear-gradient(90deg, #FFD700, #ff6b6b, #c084fc, #4D96FF, #FFD700)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 2s linear infinite",
              letterSpacing: "0.03em",
              fontStyle: "italic",
            }}
          >
            🎊 Happy Birthday Tuaheed! 🎊
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: "1.1rem",
              color: "#fda4af",
              letterSpacing: "0.1em",
              opacity: 0.9,
            }}
          >
            May all your wishes come true ✨
          </div>
        </div>
      )}
    </div>
  );
}
