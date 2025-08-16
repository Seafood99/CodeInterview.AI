import React from "react";


// Animasi floating dan glow via Tailwind + custom style
const GraniteLogoAnimated: React.FC = () => (
  <div className="flex flex-col items-center justify-center mt-8">
    <img
      src="/ibm-granite-logo.png"
      alt="IBM Granite Logo"
      className="h-14 w-auto mb-2 shadow-none"
      style={{ background: 'none' }}
    />
    <span className="text-xs font-semibold text-gray-600 tracking-wide mt-1">Powered by IBM Granite</span>
  </div>
);

export default GraniteLogoAnimated;
