"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";
import { FrameConfig, COUNTRY_LABEL, flagEmoji } from "@/data/product";

export default function FramePreview({ config }: { config: FrameConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-9, 9]), {
    stiffness: 150,
    damping: 20,
  });
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["25%", "75%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["25%", "75%"]);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const isDuo = config.type === "duo";
  const name = isDuo
    ? `${config.partner1 || "Participant 1"} & ${config.partner2 || "Participant 2"}`
    : `${config.firstName || "Prénom"} ${config.lastName || "Nom"}`;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="w-full flex items-center justify-center py-8"
      style={{ perspective: "1500px" }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.04 }}
        transition={{ scale: { type: "spring", stiffness: 200, damping: 25 } }}
        className="relative"
      >
        {/* BLACK WOOD outer frame (landscape) */}
        <div
          className="relative rounded-[6px] shadow-2xl"
          style={{
            width: "min(88vw, 480px)",
            aspectRatio: "4/3",
            padding: "22px",
            background:
              "repeating-linear-gradient(92deg,#0c0c0d 0px,#141414 2px,#0a0a0a 4px,#111 6px)",
            boxShadow:
              "0 45px 90px -25px rgba(0,0,0,0.85), inset 0 2px 3px rgba(255,255,255,0.08), inset 0 -3px 6px rgba(0,0,0,0.6)",
          }}
        >
          {/* wood bevel highlight */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[6px]"
            style={{
              background:
                "linear-gradient(135deg,rgba(255,255,255,0.06),transparent 30%,transparent 70%,rgba(255,255,255,0.03))",
            }}
          />

          {/* inner black matte board */}
          <div
            className="relative w-full h-full rounded-[3px] overflow-hidden"
            style={{
              background:
                "radial-gradient(130% 130% at 50% 40%,#1a1a1c 0%,#0b0b0c 75%)",
              boxShadow:
                "inset 0 0 40px rgba(0,0,0,0.85), inset 0 2px 4px rgba(0,0,0,0.9)",
            }}
          >
            {/* CONTENT */}
            <div className="relative z-10 w-full h-full px-[6%] py-[6%]">
              {/* corner badges */}
              <div className="absolute top-[8%] left-[7%] text-left leading-none">
                <div className="gold3d text-[clamp(11px,3vw,15px)] font-extrabold">
                  #OV
                </div>
                <div className="gold3d text-[clamp(11px,3vw,15px)] font-extrabold">
                  {config.rankingOverall || "—"}
                </div>
              </div>
              <div className="absolute bottom-[26%] right-[7%] text-right leading-none">
                <div className="gold3d text-[clamp(11px,3vw,15px)] font-extrabold">
                  #AG
                </div>
                <div className="gold3d text-[clamp(11px,3vw,15px)] font-extrabold">
                  {config.rankingAge || "—"}
                </div>
              </div>

              {/* TIME top-center */}
              <div className="text-center pt-[2%]">
                <span
                  className="gold3d font-extrabold tracking-tight"
                  style={{ fontSize: "clamp(26px,8.5vw,46px)" }}
                >
                  {config.time || "--:--:--"}
                </span>
              </div>

              {/* central VELCRO patch */}
              <div className="flex justify-center mt-[2%]">
                <VelcroPatch />
              </div>

              {/* NAME */}
              <div className="text-center mt-[3%]">
                <div
                  className="gold3d font-extrabold uppercase leading-tight px-2"
                  style={{ fontSize: "clamp(15px,4.6vw,26px)" }}
                >
                  {name}
                </div>
              </div>

              {/* country FRA + flag (fixed) */}
              <div className="flex items-center justify-center gap-2 mt-[1%]">
                <span className="gold3d font-bold text-[clamp(10px,2.8vw,15px)]">
                  {COUNTRY_LABEL}
                </span>
                <span className="text-[clamp(13px,3.4vw,18px)] leading-none">
                  {flagEmoji("FR")}
                </span>
              </div>

              {/* CITY + YEAR */}
              <div className="text-center mt-[1%]">
                <span
                  className="gold3d font-extrabold uppercase"
                  style={{ fontSize: "clamp(16px,5vw,28px)" }}
                >
                  {(config.city || "Ville").toUpperCase()} {config.year || "----"}
                </span>
              </div>
            </div>

            {/* GLASS: reflections + moving glare (verre brillant, NON anti-reflet) */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([x, y]) =>
                    `radial-gradient(500px circle at ${x} ${y}, rgba(255,255,255,0.22), transparent 42%)`
                ),
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  "linear-gradient(118deg, rgba(255,255,255,0.14) 0%, transparent 22%, transparent 58%, rgba(255,255,255,0.08) 100%)",
              }}
            />
            {/* diagonal glass streak */}
            <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
              <div
                className="absolute -inset-y-16 left-[-30%] w-1/4 rotate-[18deg] opacity-40"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)",
                }}
              />
            </div>
          </div>
        </div>

        {/* floor reflection */}
        <div
          className="mx-auto mt-2 opacity-25 blur-md"
          style={{
            width: "min(78vw, 430px)",
            height: "38px",
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.7), transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}

/* Velcro/scratch zone where the athlete sticks their competition patch.
   Shows the loop texture + a symbolic patch placeholder. */
function VelcroPatch() {
  return (
    <div
      className="relative rounded-[6px] flex items-center justify-center"
      style={{
        width: "38%",
        aspectRatio: "1.55/1",
        background:
          "repeating-conic-gradient(from 0deg at 50% 50%,#2a2a2d 0deg 6deg,#242427 6deg 12deg)",
        boxShadow:
          "inset 0 0 8px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* fuzzy velcro texture overlay */}
      <div
        className="absolute inset-0 rounded-[6px] opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 0.5px, transparent 0.5px)",
          backgroundSize: "3px 3px",
        }}
      />
      <div className="relative text-center px-1">
        <div className="text-pearl/70 font-semibold tracking-[0.15em] text-[clamp(7px,1.7vw,10px)] leading-tight">
          VOTRE PATCH
        </div>
        <div className="text-mist/50 text-[clamp(5px,1.2vw,7px)] tracking-wider mt-0.5">
          zone velcro
        </div>
      </div>
    </div>
  );
}
