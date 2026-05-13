export function LaunchScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#F0EDFF] via-[#E8E4FF] to-[#DDD9FF] flex flex-col items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-4">
          <svg viewBox="0 0 80 80" className="w-20 h-20 mx-auto" fill="none">
            {/* V shape */}
            <path d="M20 15 L40 55 L60 15" stroke="#7C6FDC" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            {/* Location pin at top center */}
            <circle cx="40" cy="20" r="8" fill="#7C6FDC"/>
            <circle cx="40" cy="20" r="3" fill="white"/>
          </svg>
        </div>

        {/* Text */}
        <div className="text-2xl font-normal tracking-[0.2em] text-foreground">
          VOYA LINK
        </div>
      </div>
    </div>
  );
}
