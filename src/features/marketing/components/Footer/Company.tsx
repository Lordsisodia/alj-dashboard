const MUTED = 'rgba(255,255,255,0.68)';

export default function FooterCompany() {
  return (
    <div className="flex gap-[60px] items-center">
      {/* ISSO Logo */}
      <a href="/" aria-label="logo link" className="shrink-0">
        <svg width="84" height="32" viewBox="0 0 84 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <title>ISSO Logo</title>
          <path fill="#fff" d="M4.38 3.43h2.2v6.86H0V8a4.48 4.48 0 0 1 4.38-4.57Z" />
          <path fill="#fff" d="M17.52 3.43H8.76v6.86h8.76V3.43Z" opacity=".85" />
          <path fill="#fff" d="M16.43 12.57H8.76v6.86h5.48c1.2 0 2.19-.98 2.19-2.2v-4.66Z" opacity=".7" />
          <path fill="#fff" d="M24.1 12.57h-5.48v4.67a2.2 2.2 0 0 0 2.19 2.19h3.29v-6.86Z" opacity=".2" />
          <path fill="#fff" d="M17.52 21.71h6.58v2.3a4.48 4.48 0 0 1-4.39 4.56h-2.19v-6.86Z" opacity=".1" />
          <path fill="#fff" d="M13.14 21.71H8.76v6.86h6.57v-4.66a2.2 2.2 0 0 0-2.19-2.2Z" opacity=".2" />
          <path fill="#fff" d="M19.71 3.43A4.48 4.48 0 0 1 24.1 8v2.29H19.7V3.43Z" opacity=".6" />
          <path fill="#fff" d="M6.57 12.57H0v6.86h6.57v-6.86Z" opacity=".85" />
          <path fill="#fff" d="M0 21.71h6.57v6.86H4.38A4.48 4.48 0 0 1 0 24v-2.29Z" opacity=".6" />
          <text x="34" y="22" fill="white" fillOpacity="0.9" fontFamily="Inter, sans-serif" fontSize="17" fontWeight="600" letterSpacing="-0.5">ISSO</text>
        </svg>
      </a>

      {/* Reviews */}
      <div className="flex gap-7 items-center">
        {/* Chrome Web Store rating */}
        <a
          href="https://chromewebstore.google.com/detail/ad-library-save-facebook/eaancnanphggbfliooildilcnjocggjm"
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 items-center transition-opacity hover:opacity-80 no-underline"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_944_4055)">
              <path d="M10 15.56a5.56 5.56 0 1 0 0-11.12 5.56 5.56 0 0 0 0 11.12Z" fill="#fff" />
              <path d="M2.8 7.27C2.4 6.55 1.9 5.79 1.34 5A10 10 0 0 0 10 20a40.5 40.5 0 0 0 1.88-2.8c.63-1.09 1.45-2.66 2.45-4.7a5 5 0 0 1-8.66 0A226.37 226.37 0 0 0 2.8 7.27Z" fill="#229342" />
              <path d="M10 20a10 10 0 0 0 8.66-15c-1.9-.19-3.3-.28-4.2-.28-1.02 0-2.5.1-4.46.28a5 5 0 0 1 4.33 7.5L10 20Z" fill="#FBC116" />
              <path d="M10 13.96a3.96 3.96 0 1 0 0-7.92 3.96 3.96 0 0 0 0 7.92Z" fill="#1A73E8" />
              <path d="M10 5h8.66A10 10 0 0 0 1.34 5l4.33 7.5A5 5 0 0 1 10 5Z" fill="#E33B2E" />
            </g>
            <defs>
              <clipPath id="clip0_944_4055">
                <rect width="20" height="20" fill="#fff" />
              </clipPath>
            </defs>
          </svg>
          <div className="flex gap-2 items-center" style={{ color: MUTED }}>
            <span className="text-white font-['Inter'] text-base font-medium leading-6">4.9/5</span>
            <span className="font-['Inter'] text-base font-medium leading-6">228 Reviews</span>
          </div>
        </a>

        {/* G2 rating */}
        <a
          href="https://www.g2.com/products/isso/reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 items-center transition-opacity hover:opacity-80 no-underline"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_944_4066)">
              <path d="M20.16 0H0v20.16h20.16V0Z" fill="#FF492C" />
              <path d="M14.33 7.66h-1.71c.05-.27.21-.42.55-.59l.31-.16c.56-.29.86-.61.86-1.14 0-.34-.13-.6-.38-.8a1.5 1.5 0 0 0-.92-.28c-.28 0-.55.08-.78.23-.23.14-.4.33-.52.56l.5.5c.19-.4.47-.58.83-.58.31 0 .5.16.5.38 0 .18-.09.34-.44.52l-.2.1a2.2 2.2 0 0 0-.92.76c-.18.29-.27.65-.27 1.09v.12h2.59v-.71Z" fill="#fff" />
              <path d="M10.1 13.27a3.27 3.27 0 0 1 0-6.54l1.12-2.33a5.71 5.71 0 1 0 2.25 10.22l-1.24-2.15c-.6.51-1.35.8-2.13.8Z" fill="#fff" />
              <path d="M14.1 9.18h-2.83l-1.41 2.45h2.83l1.41 2.45 1.41-2.45-1.41-2.45Z" fill="#fff" />
            </g>
            <defs>
              <clipPath id="clip0_944_4066">
                <rect width="20" height="20" rx="10" fill="#fff" />
              </clipPath>
            </defs>
          </svg>
          <div className="flex gap-2 items-center" style={{ color: MUTED }}>
            <span className="text-white font-['Inter'] text-base font-medium leading-6">4.8/5</span>
            <span className="font-['Inter'] text-base font-medium leading-6">118 Reviews</span>
          </div>
        </a>
      </div>
    </div>
  );
}
