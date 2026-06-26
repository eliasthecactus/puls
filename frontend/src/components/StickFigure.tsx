import type { AnimationType } from '@/types';

interface Props {
  type: AnimationType;
  size?: number;
  className?: string;
}

export function StickFigure({ type, size = 200, className = '' }: Props) {
  const style = `
    .sf-head { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; }
    .sf-body { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
  `;

  const figures: Record<AnimationType, JSX.Element> = {
    pushup: (
      <svg viewBox="0 0 120 100" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes pushup-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }
          .pu-group { animation: pushup-anim 1.4s ease-in-out infinite; transform-origin: 60px 75px; }
        `}</style>
        <g className="pu-group">
          <circle cx="60" cy="18" r="8" className="sf-head" />
          <line x1="60" y1="26" x2="60" y2="52" className="sf-body" />
          <line x1="60" y1="34" x2="30" y2="52" className="sf-body" />
          <line x1="30" y1="52" x2="25" y2="68" className="sf-body" />
          <line x1="60" y1="34" x2="90" y2="52" className="sf-body" />
          <line x1="90" y1="52" x2="95" y2="68" className="sf-body" />
          <line x1="60" y1="52" x2="45" y2="72" className="sf-body" />
          <line x1="60" y1="52" x2="75" y2="72" className="sf-body" />
        </g>
      </svg>
    ),

    squat: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes squat-down {
            0%, 100% { transform: translateY(0) scaleY(1); }
            50% { transform: translateY(12px) scaleY(0.85); }
          }
          .sq-group { animation: squat-down 1.6s ease-in-out infinite; transform-origin: 60px 60px; }
        `}</style>
        <g className="sq-group">
          <circle cx="60" cy="14" r="8" className="sf-head" />
          <line x1="60" y1="22" x2="60" y2="52" className="sf-body" />
          <line x1="60" y1="30" x2="40" y2="46" className="sf-body" />
          <line x1="40" y1="46" x2="36" y2="60" className="sf-body" />
          <line x1="60" y1="30" x2="80" y2="46" className="sf-body" />
          <line x1="80" y1="46" x2="84" y2="60" className="sf-body" />
          <line x1="60" y1="52" x2="44" y2="72" className="sf-body" />
          <line x1="44" y1="72" x2="40" y2="90" className="sf-body" />
          <line x1="60" y1="52" x2="76" y2="72" className="sf-body" />
          <line x1="76" y1="72" x2="80" y2="90" className="sf-body" />
        </g>
      </svg>
    ),

    plank: (
      <svg viewBox="0 0 160 80" width={size} height={(size * 80) / 160} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes plank-breathe {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .pl-group { animation: plank-breathe 3s ease-in-out infinite; }
        `}</style>
        <g className="pl-group">
          <circle cx="130" cy="25" r="8" className="sf-head" />
          <line x1="122" y1="25" x2="80" y2="38" className="sf-body" />
          <line x1="100" y1="31" x2="95" y2="50" className="sf-body" />
          <line x1="95" y1="50" x2="87" y2="50" className="sf-body" />
          <line x1="100" y1="31" x2="108" y2="50" className="sf-body" />
          <line x1="108" y1="50" x2="115" y2="50" className="sf-body" />
          <line x1="80" y1="38" x2="55" y2="44" className="sf-body" />
          <line x1="55" y1="44" x2="30" y2="50" className="sf-body" />
          <line x1="30" y1="50" x2="20" y2="50" className="sf-body" />
          <line x1="38" y1="47" x2="35" y2="62" className="sf-body" />
          <line x1="35" y1="62" x2="28" y2="62" className="sf-body" />
          <line x1="52" y1="43" x2="52" y2="58" className="sf-body" />
          <line x1="52" y1="58" x2="44" y2="58" className="sf-body" />
        </g>
      </svg>
    ),

    'jumping-jacks': (
      <svg viewBox="0 0 120 130" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes jj-anim {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(1.35); }
          }
          @keyframes jj-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .jj-limbs { animation: jj-anim 0.7s ease-in-out infinite; transform-origin: 60px 60px; }
          .jj-body { animation: jj-bob 0.7s ease-in-out infinite; }
        `}</style>
        <g className="jj-body">
          <circle cx="60" cy="16" r="8" className="sf-head" />
          <line x1="60" y1="24" x2="60" y2="56" className="sf-body" />
        </g>
        <g className="jj-limbs">
          <line x1="60" y1="34" x2="30" y2="55" className="sf-body" />
          <line x1="30" y1="55" x2="22" y2="70" className="sf-body" />
          <line x1="60" y1="34" x2="90" y2="55" className="sf-body" />
          <line x1="90" y1="55" x2="98" y2="70" className="sf-body" />
          <line x1="60" y1="56" x2="38" y2="80" className="sf-body" />
          <line x1="38" y1="80" x2="28" y2="98" className="sf-body" />
          <line x1="60" y1="56" x2="82" y2="80" className="sf-body" />
          <line x1="82" y1="80" x2="92" y2="98" className="sf-body" />
        </g>
      </svg>
    ),

    'mountain-climber': (
      <svg viewBox="0 0 160 90" width={size} height={(size * 90) / 160} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes mc-knee-l {
            0%, 100% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(20px) translateY(-12px); }
          }
          @keyframes mc-knee-r {
            0%, 100% { transform: translateX(20px) translateY(-12px); }
            50% { transform: translateX(0) translateY(0); }
          }
          .mc-leg-l { animation: mc-knee-l 0.8s ease-in-out infinite; transform-origin: 90px 38px; }
          .mc-leg-r { animation: mc-knee-r 0.8s ease-in-out infinite; transform-origin: 80px 38px; }
        `}</style>
        <circle cx="130" cy="22" r="8" className="sf-head" />
        <line x1="122" y1="25" x2="80" y2="38" className="sf-body" />
        <line x1="80" y1="38" x2="35" y2="50" className="sf-body" />
        <line x1="35" y1="50" x2="22" y2="50" className="sf-body" />
        <line x1="100" y1="32" x2="100" y2="50" className="sf-body" />
        <line x1="100" y1="50" x2="112" y2="50" className="sf-body" />
        <g className="mc-leg-l">
          <line x1="90" y1="38" x2="75" y2="55" className="sf-body" />
          <line x1="75" y1="55" x2="70" y2="70" className="sf-body" />
        </g>
        <g className="mc-leg-r">
          <line x1="80" y1="38" x2="60" y2="50" className="sf-body" />
          <line x1="60" y1="50" x2="55" y2="66" className="sf-body" />
        </g>
      </svg>
    ),

    lunge: (
      <svg viewBox="0 0 140 130" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes lunge-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(8px); }
          }
          .ln-group { animation: lunge-anim 1.5s ease-in-out infinite; transform-origin: 70px 65px; }
        `}</style>
        <g className="ln-group">
          <circle cx="70" cy="14" r="8" className="sf-head" />
          <line x1="70" y1="22" x2="70" y2="52" className="sf-body" />
          <line x1="70" y1="30" x2="50" y2="46" className="sf-body" />
          <line x1="50" y1="46" x2="46" y2="58" className="sf-body" />
          <line x1="70" y1="30" x2="90" y2="46" className="sf-body" />
          <line x1="90" y1="46" x2="94" y2="58" className="sf-body" />
          <line x1="70" y1="52" x2="48" y2="78" className="sf-body" />
          <line x1="48" y1="78" x2="28" y2="95" className="sf-body" />
          <line x1="28" y1="95" x2="18" y2="95" className="sf-body" />
          <line x1="70" y1="52" x2="88" y2="74" className="sf-body" />
          <line x1="88" y1="74" x2="100" y2="95" className="sf-body" />
          <line x1="100" y1="95" x2="110" y2="95" className="sf-body" />
        </g>
      </svg>
    ),

    burpee: (
      <svg viewBox="0 0 120 130" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes burpee-anim {
            0%    { transform: translateY(0) scaleY(1); }
            20%   { transform: translateY(25px) scaleY(0.7); }
            40%   { transform: translateY(35px) scaleY(0.55); }
            60%   { transform: translateY(25px) scaleY(0.7); }
            80%   { transform: translateY(-15px) scaleY(1.1); }
            100%  { transform: translateY(0) scaleY(1); }
          }
          .br-group { animation: burpee-anim 2s ease-in-out infinite; transform-origin: 60px 65px; }
        `}</style>
        <g className="br-group">
          <circle cx="60" cy="14" r="8" className="sf-head" />
          <line x1="60" y1="22" x2="60" y2="52" className="sf-body" />
          <line x1="60" y1="30" x2="40" y2="46" className="sf-body" />
          <line x1="40" y1="46" x2="36" y2="60" className="sf-body" />
          <line x1="60" y1="30" x2="80" y2="46" className="sf-body" />
          <line x1="80" y1="46" x2="84" y2="60" className="sf-body" />
          <line x1="60" y1="52" x2="44" y2="75" className="sf-body" />
          <line x1="44" y1="75" x2="38" y2="95" className="sf-body" />
          <line x1="60" y1="52" x2="76" y2="75" className="sf-body" />
          <line x1="76" y1="75" x2="82" y2="95" className="sf-body" />
        </g>
      </svg>
    ),

    situp: (
      <svg viewBox="0 0 140 110" width={size} height={(size * 110) / 140} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes situp-anim {
            0%, 100% { transform: rotate(0deg); }
            45%, 55% { transform: rotate(-45deg); }
          }
          .su-torso { animation: situp-anim 2s ease-in-out infinite; transform-origin: 85px 72px; }
        `}</style>
        <line x1="30" y1="72" x2="100" y2="72" className="sf-body" />
        <line x1="85" y1="72" x2="105" y2="90" className="sf-body" />
        <line x1="105" y1="90" x2="118" y2="90" className="sf-body" />
        <line x1="85" y1="72" x2="68" y2="90" className="sf-body" />
        <line x1="68" y1="90" x2="55" y2="90" className="sf-body" />
        <g className="su-torso">
          <line x1="85" y1="72" x2="85" y2="42" className="sf-body" />
          <line x1="85" y1="52" x2="70" y2="64" className="sf-body" />
          <line x1="85" y1="52" x2="100" y2="64" className="sf-body" />
          <circle cx="85" cy="34" r="8" className="sf-head" />
        </g>
      </svg>
    ),

    'hip-hinge': (
      <svg viewBox="0 0 120 100" width={size} height={(size * 100) / 120} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes hh-anim {
            0%, 100% { transform: rotate(-30deg); }
            50% { transform: rotate(5deg); }
          }
          .hh-upper { animation: hh-anim 2s ease-in-out infinite; transform-origin: 75px 60px; }
        `}</style>
        <line x1="40" y1="80" x2="75" y2="60" className="sf-body" />
        <line x1="40" y1="80" x2="35" y2="98" className="sf-body" />
        <line x1="75" y1="60" x2="80" y2="98" className="sf-body" />
        <g className="hh-upper">
          <line x1="75" y1="60" x2="95" y2="38" className="sf-body" />
          <line x1="85" y1="50" x2="70" y2="44" className="sf-body" />
          <line x1="85" y1="50" x2="100" y2="44" className="sf-body" />
          <circle cx="100" cy="30" r="8" className="sf-head" />
        </g>
      </svg>
    ),

    'high-knees': (
      <svg viewBox="0 0 120 130" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes hk-leg-l {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-18px) translateX(5px); }
          }
          @keyframes hk-leg-r {
            0%, 100% { transform: translateY(-18px) translateX(5px); }
            50% { transform: translateY(0) translateX(0); }
          }
          @keyframes hk-arm-l {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes hk-arm-r {
            0%, 100% { transform: translateY(-10px); }
            50% { transform: translateY(0); }
          }
          .hk-leg-l { animation: hk-leg-l 0.6s ease-in-out infinite; transform-origin: 55px 60px; }
          .hk-leg-r { animation: hk-leg-r 0.6s ease-in-out infinite; transform-origin: 65px 60px; }
          .hk-arm-l { animation: hk-arm-l 0.6s ease-in-out infinite; transform-origin: 60px 38px; }
          .hk-arm-r { animation: hk-arm-r 0.6s ease-in-out infinite; transform-origin: 60px 38px; }
          @keyframes hk-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          .hk-torso { animation: hk-bob 0.6s ease-in-out infinite; }
        `}</style>
        <g className="hk-torso">
          <circle cx="60" cy="16" r="8" className="sf-head" />
          <line x1="60" y1="24" x2="60" y2="58" className="sf-body" />
        </g>
        <g className="hk-arm-l">
          <line x1="60" y1="34" x2="38" y2="52" className="sf-body" />
          <line x1="38" y1="52" x2="32" y2="66" className="sf-body" />
        </g>
        <g className="hk-arm-r">
          <line x1="60" y1="34" x2="82" y2="52" className="sf-body" />
          <line x1="82" y1="52" x2="88" y2="66" className="sf-body" />
        </g>
        <g className="hk-leg-l">
          <line x1="55" y1="58" x2="44" y2="80" className="sf-body" />
          <line x1="44" y1="80" x2="40" y2="100" className="sf-body" />
        </g>
        <g className="hk-leg-r">
          <line x1="65" y1="58" x2="76" y2="80" className="sf-body" />
          <line x1="76" y1="80" x2="80" y2="100" className="sf-body" />
        </g>
      </svg>
    ),

    dips: (
      <svg viewBox="0 0 160 130" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes dip-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(16px); }
          }
          .dip-body { animation: dip-anim 1.4s ease-in-out infinite; }
        `}</style>
        <line x1="20" y1="60" x2="140" y2="60" className="sf-body" />
        <line x1="20" y1="60" x2="20" y2="100" className="sf-body" />
        <line x1="140" y1="60" x2="140" y2="100" className="sf-body" />
        <g className="dip-body">
          <circle cx="80" cy="18" r="8" className="sf-head" />
          <line x1="80" y1="26" x2="80" y2="56" className="sf-body" />
          <line x1="80" y1="34" x2="35" y2="58" className="sf-body" />
          <line x1="35" y1="58" x2="22" y2="58" className="sf-body" />
          <line x1="80" y1="34" x2="125" y2="58" className="sf-body" />
          <line x1="125" y1="58" x2="138" y2="58" className="sf-body" />
          <line x1="80" y1="56" x2="68" y2="80" className="sf-body" />
          <line x1="68" y1="80" x2="64" y2="100" className="sf-body" />
          <line x1="80" y1="56" x2="92" y2="80" className="sf-body" />
          <line x1="92" y1="80" x2="96" y2="100" className="sf-body" />
        </g>
      </svg>
    ),

    'pike-pushup': (
      <svg viewBox="0 0 160 120" width={size} height={(size * 120) / 160} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes pp-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(14px); }
          }
          .pp-upper { animation: pp-anim 1.4s ease-in-out infinite; transform-origin: 80px 70px; }
        `}</style>
        <line x1="30" y1="100" x2="80" y2="70" className="sf-body" />
        <line x1="55" y1="85" x2="60" y2="102" className="sf-body" />
        <line x1="55" y1="85" x2="30" y2="100" className="sf-body" />
        <g className="pp-upper">
          <line x1="80" y1="70" x2="130" y2="100" className="sf-body" />
          <line x1="105" y1="85" x2="108" y2="102" className="sf-body" />
          <line x1="105" y1="85" x2="130" y2="100" className="sf-body" />
          <line x1="80" y1="70" x2="80" y2="46" className="sf-body" />
          <line x1="80" y1="58" x2="65" y2="52" className="sf-body" />
          <line x1="80" y1="58" x2="95" y2="52" className="sf-body" />
          <circle cx="80" cy="38" r="8" className="sf-head" />
        </g>
      </svg>
    ),

    'side-plank': (
      <svg viewBox="0 0 160 90" width={size} height={(size * 90) / 160} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes sp-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          .sp-group { animation: sp-anim 2.5s ease-in-out infinite; }
        `}</style>
        <g className="sp-group">
          <circle cx="130" cy="28" r="8" className="sf-head" />
          <line x1="122" y1="30" x2="65" y2="55" className="sf-body" />
          <line x1="92" y1="42" x2="88" y2="58" className="sf-body" />
          <line x1="88" y1="58" x2="78" y2="58" className="sf-body" />
          <line x1="65" y1="55" x2="45" y2="62" className="sf-body" />
          <line x1="45" y1="62" x2="30" y2="62" className="sf-body" />
          <line x1="92" y1="42" x2="105" y2="22" className="sf-body" />
          <line x1="105" y1="22" x2="118" y2="18" className="sf-body" />
        </g>
      </svg>
    ),

    'glute-bridge': (
      <svg viewBox="0 0 160 100" width={size} height={(size * 100) / 160} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes gb-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }
          .gb-hips { animation: gb-anim 1.5s ease-in-out infinite; transform-origin: 90px 70px; }
        `}</style>
        <line x1="20" y1="85" x2="145" y2="85" className="sf-body" stroke="#ffffff22" />
        <circle cx="30" cy="40" r="8" className="sf-head" />
        <line x1="30" y1="48" x2="55" y2="75" className="sf-body" />
        <line x1="55" y1="75" x2="42" y2="84" className="sf-body" />
        <line x1="55" y1="75" x2="52" y2="86" className="sf-body" />
        <g className="gb-hips">
          <line x1="55" y1="75" x2="100" y2="65" className="sf-body" />
          <line x1="100" y1="65" x2="125" y2="82" className="sf-body" />
          <line x1="125" y1="82" x2="130" y2="86" className="sf-body" />
          <line x1="80" y1="70" x2="75" y2="54" className="sf-body" />
          <line x1="75" y1="54" x2="62" y2="50" className="sf-body" />
        </g>
      </svg>
    ),

    'calf-raise': (
      <svg viewBox="0 0 120 130" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes cr-anim {
            0%, 100% { transform: translateY(0); }
            40%, 60% { transform: translateY(-14px); }
          }
          .cr-group { animation: cr-anim 1.2s ease-in-out infinite; transform-origin: 60px 70px; }
        `}</style>
        <g className="cr-group">
          <circle cx="60" cy="14" r="8" className="sf-head" />
          <line x1="60" y1="22" x2="60" y2="55" className="sf-body" />
          <line x1="60" y1="32" x2="42" y2="48" className="sf-body" />
          <line x1="42" y1="48" x2="38" y2="60" className="sf-body" />
          <line x1="60" y1="32" x2="78" y2="48" className="sf-body" />
          <line x1="78" y1="48" x2="82" y2="60" className="sf-body" />
          <line x1="60" y1="55" x2="48" y2="78" className="sf-body" />
          <line x1="48" y1="78" x2="44" y2="100" className="sf-body" />
          <line x1="44" y1="100" x2="36" y2="105" className="sf-body" />
          <line x1="60" y1="55" x2="72" y2="78" className="sf-body" />
          <line x1="72" y1="78" x2="76" y2="100" className="sf-body" />
          <line x1="76" y1="100" x2="84" y2="105" className="sf-body" />
        </g>
      </svg>
    ),

    'dead-bug': (
      <svg viewBox="0 0 160 110" width={size} height={(size * 110) / 160} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes db-arm {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-30deg); }
          }
          @keyframes db-leg {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(25deg); }
          }
          .db-arm-l { animation: db-arm 2s ease-in-out infinite; transform-origin: 80px 48px; }
          .db-leg-r { animation: db-leg 2s ease-in-out infinite; transform-origin: 90px 68px; }
        `}</style>
        <circle cx="30" cy="52" r="8" className="sf-head" />
        <line x1="38" y1="52" x2="100" y2="52" className="sf-body" />
        <line x1="80" y1="52" x2="80" y2="72" className="sf-body" />
        <line x1="100" y1="52" x2="112" y2="68" className="sf-body" />
        <line x1="80" y1="72" x2="68" y2="90" className="sf-body" />
        <g className="db-arm-l">
          <line x1="80" y1="48" x2="62" y2="28" className="sf-body" />
          <line x1="62" y1="28" x2="48" y2="20" className="sf-body" />
        </g>
        <g className="db-leg-r">
          <line x1="90" y1="68" x2="108" y2="88" className="sf-body" />
          <line x1="108" y1="88" x2="118" y2="98" className="sf-body" />
        </g>
      </svg>
    ),

    'arm-circle': (
      <svg viewBox="0 0 120 130" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes ac-arm-l {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes ac-arm-r {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          .ac-arm-l { animation: ac-arm-l 1.5s linear infinite; transform-origin: 60px 36px; }
          .ac-arm-r { animation: ac-arm-r 1.5s linear infinite; transform-origin: 60px 36px; }
        `}</style>
        <circle cx="60" cy="16" r="8" className="sf-head" />
        <line x1="60" y1="24" x2="60" y2="60" className="sf-body" />
        <line x1="60" y1="60" x2="44" y2="85" className="sf-body" />
        <line x1="44" y1="85" x2="40" y2="106" className="sf-body" />
        <line x1="60" y1="60" x2="76" y2="85" className="sf-body" />
        <line x1="76" y1="85" x2="80" y2="106" className="sf-body" />
        <g className="ac-arm-l">
          <line x1="60" y1="36" x2="32" y2="50" className="sf-body" />
          <line x1="32" y1="50" x2="18" y2="60" className="sf-body" />
        </g>
        <g className="ac-arm-r">
          <line x1="60" y1="36" x2="88" y2="50" className="sf-body" />
          <line x1="88" y1="50" x2="102" y2="60" className="sf-body" />
        </g>
      </svg>
    ),

    inchworm: (
      <svg viewBox="0 0 180 100" width={size} height={(size * 100) / 180} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes iw-anim {
            0%, 100% { transform: translateX(0); }
            33% { transform: translateX(15px); }
            66% { transform: translateX(8px); }
          }
          .iw-group { animation: iw-anim 2s ease-in-out infinite; }
        `}</style>
        <g className="iw-group">
          <circle cx="150" cy="30" r="8" className="sf-head" />
          <line x1="142" y1="32" x2="100" y2="55" className="sf-body" />
          <line x1="120" y1="44" x2="118" y2="60" className="sf-body" />
          <line x1="100" y1="55" x2="55" y2="65" className="sf-body" />
          <line x1="78" y1="60" x2="75" y2="76" className="sf-body" />
          <line x1="55" y1="65" x2="30" y2="72" className="sf-body" />
          <line x1="30" y1="72" x2="22" y2="72" className="sf-body" />
        </g>
      </svg>
    ),

    'stretch-quad': (
      <svg viewBox="0 0 120 130" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes sq-breathe {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .sq-group { animation: sq-breathe 3s ease-in-out infinite; }
        `}</style>
        <g className="sq-group">
          <circle cx="60" cy="14" r="8" className="sf-head" />
          <line x1="60" y1="22" x2="60" y2="55" className="sf-body" />
          <line x1="60" y1="32" x2="42" y2="48" className="sf-body" />
          <line x1="42" y1="48" x2="38" y2="62" className="sf-body" />
          <line x1="60" y1="32" x2="78" y2="48" className="sf-body" />
          <line x1="78" y1="48" x2="82" y2="62" className="sf-body" />
          <line x1="60" y1="55" x2="52" y2="80" className="sf-body" />
          <line x1="52" y1="80" x2="50" y2="104" className="sf-body" />
          <line x1="60" y1="55" x2="72" y2="75" className="sf-body" />
          <line x1="72" y1="75" x2="84" y2="66" className="sf-body" />
          <line x1="84" y1="66" x2="88" y2="55" className="sf-body" />
        </g>
      </svg>
    ),

    'stretch-hamstring': (
      <svg viewBox="0 0 160 120" width={size} height={(size * 120) / 160} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes sh-breathe {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-5deg); }
          }
          .sh-upper { animation: sh-breathe 3s ease-in-out infinite; transform-origin: 80px 68px; }
        `}</style>
        <line x1="30" y1="98" x2="130" y2="98" className="sf-body" />
        <line x1="65" y1="68" x2="65" y2="98" className="sf-body" />
        <line x1="90" y1="68" x2="90" y2="98" className="sf-body" />
        <g className="sh-upper">
          <line x1="65" y1="68" x2="90" y2="68" className="sf-body" />
          <line x1="78" y1="68" x2="78" y2="40" className="sf-body" />
          <line x1="78" y1="50" x2="60" y2="44" className="sf-body" />
          <line x1="78" y1="50" x2="96" y2="44" className="sf-body" />
          <circle cx="78" cy="32" r="8" className="sf-head" />
        </g>
      </svg>
    ),

    'stretch-shoulder': (
      <svg viewBox="0 0 120 130" width={size} height={size} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes ss-breathe {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .ss-group { animation: ss-breathe 3s ease-in-out infinite; }
        `}</style>
        <g className="ss-group">
          <circle cx="60" cy="14" r="8" className="sf-head" />
          <line x1="60" y1="22" x2="60" y2="58" className="sf-body" />
          <line x1="60" y1="58" x2="44" y2="85" className="sf-body" />
          <line x1="44" y1="85" x2="42" y2="108" className="sf-body" />
          <line x1="60" y1="58" x2="76" y2="85" className="sf-body" />
          <line x1="76" y1="85" x2="78" y2="108" className="sf-body" />
          <line x1="60" y1="32" x2="88" y2="38" className="sf-body" />
          <line x1="88" y1="38" x2="100" y2="48" className="sf-body" />
          <line x1="100" y1="48" x2="72" y2="52" className="sf-body" />
        </g>
      </svg>
    ),

    'stretch-hip': (
      <svg viewBox="0 0 160 120" width={size} height={(size * 120) / 160} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes shp-breathe {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .shp-group { animation: shp-breathe 3.5s ease-in-out infinite; }
        `}</style>
        <g className="shp-group">
          <circle cx="95" cy="22" r="8" className="sf-head" />
          <line x1="95" y1="30" x2="95" y2="62" className="sf-body" />
          <line x1="95" y1="40" x2="78" y2="55" className="sf-body" />
          <line x1="78" y1="55" x2="74" y2="68" className="sf-body" />
          <line x1="95" y1="40" x2="112" y2="55" className="sf-body" />
          <line x1="112" y1="55" x2="116" y2="68" className="sf-body" />
          <line x1="95" y1="62" x2="110" y2="85" className="sf-body" />
          <line x1="110" y1="85" x2="118" y2="105" className="sf-body" />
          <line x1="95" y1="62" x2="65" y2="80" className="sf-body" />
          <line x1="65" y1="80" x2="38" y2="90" className="sf-body" />
          <line x1="38" y1="90" x2="25" y2="90" className="sf-body" />
        </g>
      </svg>
    ),

    'world-greatest-stretch': (
      <svg viewBox="0 0 180 120" width={size} height={(size * 120) / 180} className={`text-white ${className}`}>
        <style>{style}{`
          @keyframes wgs-anim {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(25deg); }
          }
          .wgs-arm { animation: wgs-anim 2.5s ease-in-out infinite; transform-origin: 100px 55px; }
        `}</style>
        <circle cx="150" cy="28" r="8" className="sf-head" />
        <line x1="142" y1="30" x2="100" y2="55" className="sf-body" />
        <line x1="100" y1="55" x2="55" y2="75" className="sf-body" />
        <line x1="55" y1="75" x2="30" y2="82" className="sf-body" />
        <line x1="30" y1="82" x2="20" y2="82" className="sf-body" />
        <line x1="80" y1="65" x2="72" y2="80" className="sf-body" />
        <line x1="72" y1="80" x2="65" y2="95" className="sf-body" />
        <line x1="55" y1="75" x2="52" y2="95" className="sf-body" />
        <g className="wgs-arm">
          <line x1="100" y1="55" x2="88" y2="32" className="sf-body" />
          <line x1="88" y1="32" x2="75" y2="22" className="sf-body" />
        </g>
      </svg>
    ),
  };

  return figures[type] ?? figures['plank'];
}
