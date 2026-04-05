import ChevronIcon from './ChevronIcon';

export default function ChromeExtension() {
  return (
    <div className="section">
      <div style={{ maxWidth: '1216px', margin: '0 auto', padding: '0 24px' }}>
      <div className="home-extension">
        <figure className="home-extension-logo">
          <div className="svg w-embed">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 128 128">
              <path fill="#020308" d="M64 99.6a35.61 35.61 0 1 0 0-71.21 35.61 35.61 0 0 0 0 71.22Z" />
              <path fill="url(#paint0_linear_861_33105)" d="M17.95 46.5c-2.66-4.6-5.78-9.43-9.37-14.49a63.98 63.98 0 0 0 55.43 96c5.89-8.27 9.89-14.23 12-17.88 4.04-7.01 9.28-17.06 15.7-30.12V80a32 32 0 0 1-55.42 0 1448.85 1448.85 0 0 0-18.34-33.5Z" />
              <path fill="url(#paint1_linear_861_33105)" d="M64 128a63.98 63.98 0 0 0 55.42-96c-12.13-1.2-21.07-1.8-26.84-1.8-6.55 0-16.07.6-28.58 1.8A32 32 0 0 1 91.7 80l-27.7 48Z" />
              <path fill="#fff" d="M64 89.34a25.33 25.33 0 1 0 0-50.67 25.33 25.33 0 0 0 0 50.67Z" />
              <path fill="url(#paint2_linear_861_33105)" d="M64 32h55.42A64 64 0 0 0 8.58 32l27.7 48h.02A32 32 0 0 1 64 32Z" />
              <defs>
                <linearGradient id="paint0_linear_861_33105" x1="79.5" x2="13" y1="105" y2="85.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fff" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint1_linear_861_33105" x1="96" x2="96" y1="30.21" y2="128" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fff" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint2_linear_861_33105" x1="23.5" x2="119" y1="31.5" y2="27" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fff" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </figure>
        <div className="home-extension-content">
          <div className="home-extension-title">
            <div className="text-alpha-50">
              <div className="text-overline">Free Chrome Extension</div>
            </div>
            <div className="text-white">
              <div className="text-balance">
                <h3 className="text-display-h4">Save ads from Meta, TikTok &amp; LinkedIn Ad Libraries.</h3>
              </div>
            </div>
          </div>
          <div className="home-extension-details">
            <div className="flex-gap-2">
              <div className="text-alpha-100">
                <div className="icon-24">
                  <div className="svg w-embed">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.3847 12.9558C16.8559 12.355 19.6711 13.9623 20.3024 17.7777C20.3813 18.2545 19.9953 18.6666 19.5119 18.6666H16.2395M10.4062 7.83325C10.4062 9.21396 9.28692 10.3333 7.90621 10.3333C6.5255 10.3333 5.40621 9.21396 5.40621 7.83325C5.40621 6.45254 6.5255 5.33325 7.90621 5.33325C9.28692 5.33325 10.4062 6.45254 10.4062 7.83325ZM17.9062 7.83325C17.9062 9.21396 16.7869 10.3333 15.4062 10.3333C14.0255 10.3333 12.9062 9.21396 12.9062 7.83325C12.9062 6.45254 14.0255 5.33325 15.4062 5.33325C16.7869 5.33325 17.9062 6.45254 17.9062 7.83325ZM12.0121 18.6666H3.80035C3.31705 18.6666 2.93127 18.2518 3.01032 17.7749C4.10268 11.186 11.7098 11.186 12.8021 17.7749C12.8812 18.2518 12.4953 18.6666 12.0121 18.6666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-alpha-50">
                <div className="text-label-m">30,000 Users</div>
              </div>
            </div>
            <div className="flex-gap-2">
              <div className="text-alpha-100">
                <div className="icon-24">
                  <div className="svg w-embed">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.7267 3.78599C11.8029 3.627 12.0304 3.627 12.1067 3.78599L14.3419 8.44566C14.3726 8.50965 14.4338 8.55384 14.5044 8.56311L19.6501 9.23785C19.8257 9.26087 19.8959 9.47611 19.7675 9.59739L16.0033 13.152C15.9516 13.2008 15.9282 13.2723 15.9412 13.342L16.8862 18.4187C16.9184 18.5919 16.7344 18.7249 16.5788 18.6409L12.0171 16.1781C11.9545 16.1442 11.8788 16.1442 11.8163 16.1781L7.2546 18.6409C7.09896 18.7249 6.9149 18.5919 6.94715 18.4187L7.89215 13.342C7.90513 13.2723 7.88177 13.2008 7.83008 13.152L4.06583 9.59739C3.93739 9.47611 4.0077 9.26087 4.18327 9.23785L9.32895 8.56311C9.39961 8.55384 9.46076 8.50965 9.49145 8.44566L11.7267 3.78599Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-alpha-50">
                <div className="text-label-m">4.8/5 Stars</div>
              </div>
            </div>
          </div>
        </div>
        <div className="home-extension-cta">
          <a
            href="https://chromewebstore.google.com/detail/ad-library-save-facebook/eaancnanphggbfliooildilcnjocggjm"
            target="_blank"
            rel="noopener noreferrer"
            className="button-dark button-primary w-inline-block"
          >
            <div className="button-text-block">
              <div className="text-heading-m">Install Free</div>
            </div>
            <div className="button-icon-block icon-right opacity-100">
              <div className="icon-24">
                <div className="svg w-embed"><ChevronIcon /></div>
              </div>
            </div>
          </a>
        </div>
      </div>
      </div>
    </div>
  );
}
