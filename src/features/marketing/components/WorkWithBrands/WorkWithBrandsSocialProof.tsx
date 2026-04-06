// WorkWithBrandsSocialProof - "Loved by brands and agencies globally" section.
// Shows 3 platform rating badges (G2, Chrome, Capterra) and a Senja reviews embed.

import type { WorkWithBrandsData } from './data/work-with-brands';

interface Props {
  socialProof: WorkWithBrandsData['socialProof'];
}

function G2Icon() {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width={40} height={40} rx={20} fill="#F9F9FA" />
      <rect x={10} y={10} width={20} height={20} rx={10} fill="#FF492C" />
      <g clipPath="url(#clip0_3296_611)">
        <path
          d="M22.0465 22.1843C22.4247 22.8406 22.7987 23.4894 23.1724 24.1376C21.5176 25.4044 18.9432 25.5575 17.0373 24.0986C14.8441 22.4184 14.4837 19.5515 15.6579 17.4878C17.0084 15.1141 19.5356 14.5891 21.1628 14.9741C21.1188 15.0697 20.1442 17.0915 20.1442 17.0915C20.1442 17.0915 20.0672 17.0966 20.0236 17.0974C19.5426 17.1178 19.1844 17.2297 18.8005 17.4282C18.3792 17.648 18.0182 17.9677 17.749 18.3592C17.4798 18.7507 17.3106 19.2022 17.2562 19.6743C17.1995 20.153 17.2656 20.6382 17.4485 21.0842C17.6032 21.4613 17.822 21.7962 18.1152 22.0789C18.5651 22.513 19.1005 22.7819 19.721 22.8708C20.3087 22.9552 20.8739 22.8717 21.4035 22.6056C21.6021 22.5059 21.7711 22.3958 21.9686 22.2448C21.9938 22.2285 22.0162 22.2078 22.0465 22.1843Z"
          fill="white"
        />
        <path
          d="M22.0506 16.4287C21.9545 16.3342 21.8655 16.247 21.777 16.1593C21.7241 16.107 21.6732 16.0526 21.6191 16.0015C21.5997 15.9831 21.5769 15.958 21.5769 15.958C21.5769 15.958 21.5953 15.9189 21.6032 15.9029C21.7068 15.6949 21.8692 15.5429 22.0618 15.422C22.2748 15.2873 22.5229 15.2188 22.7749 15.2251C23.0972 15.2314 23.397 15.3117 23.6499 15.5279C23.8366 15.6875 23.9323 15.8899 23.9492 16.1316C23.9773 16.5393 23.8086 16.8515 23.4736 17.0695C23.2768 17.1977 23.0645 17.2968 22.8516 17.4142C22.7342 17.479 22.6339 17.5359 22.5191 17.6532C22.4182 17.7709 22.4133 17.8818 22.4133 17.8818L23.9382 17.8798V18.559H21.5844C21.5844 18.559 21.5844 18.5126 21.5844 18.4934C21.5754 18.1596 21.6143 17.8455 21.7671 17.5424C21.9077 17.2643 22.1262 17.0607 22.3887 16.904C22.5908 16.7832 22.8037 16.6805 23.0063 16.5602C23.1313 16.4862 23.2196 16.3775 23.2189 16.2199C23.2189 16.0846 23.1204 15.9644 22.9798 15.9269C22.6483 15.8375 22.3109 15.9802 22.1355 16.2836C22.1099 16.3279 22.0837 16.3719 22.0506 16.4287Z"
          fill="white"
        />
        <path d="M25.0003 21.4623L23.7152 19.243H21.1721L19.8787 21.4852H22.4405L23.7047 23.694L25.0003 21.4623Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_3296_611">
          <rect width={10} height={11} fill="white" transform="translate(14.9998 14.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ChromeIcon() {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width={40} height={40} rx={20} fill="#F9F9FA" />
      <g clipPath="url(#clip0_3113_2816)">
        <path d="M20.0002 25.5641C23.0733 25.5641 25.5644 23.0728 25.5644 19.9998C25.5644 16.9267 23.0733 14.4355 20.0002 14.4355C16.9272 14.4355 14.436 16.9267 14.436 19.9998C14.436 23.0728 16.9272 25.5641 20.0002 25.5641Z" fill="white" />
        <path d="M12.8039 17.2657C12.3888 16.5467 11.9009 15.7921 11.3402 15.0019C10.4623 16.522 10 18.2464 10 20.0019C10 21.7574 10.462 23.4818 11.3398 25.0019C12.2176 26.522 13.4802 27.7844 15.0005 28.6617C16.5208 29.5391 18.2455 30.0008 20.0008 30.0004C20.9212 28.7095 21.5461 27.7788 21.8755 27.2082C22.5083 26.1123 23.3266 24.5432 24.3305 22.5011V22.4999C23.892 23.2605 23.2609 23.8921 22.5008 24.3312C20.9538 25.225 19.0473 25.2253 17.5001 24.332C16.7398 23.893 16.1086 23.2616 15.6698 22.5013C14.3063 19.9584 13.351 18.2132 12.8039 17.2657Z" fill="#229342" />
        <path d="M20.0007 29.9995C21.7561 29.9998 23.4806 29.5378 25.0008 28.6602C26.521 27.7826 27.7834 26.5201 28.6609 24.9998C29.5385 23.4795 30.0003 21.755 30.0001 19.9996C29.9997 18.2442 29.5373 16.5198 28.6592 14.9998C26.7648 14.8131 25.3667 14.7198 24.465 14.7198C23.4425 14.7198 21.9541 14.8131 20 14.9998L19.9989 15.0006C20.8767 15.0002 21.7392 15.2309 22.4996 15.6695C23.26 16.1083 23.8914 16.7394 24.3304 17.4996C25.224 19.0468 25.224 20.9532 24.3303 22.5004L20.0007 29.9995Z" fill="#FBC116" />
        <path d="M20.0003 23.9591C22.1865 23.9591 23.9588 22.1868 23.9588 20.0005C23.9588 17.8141 22.1865 16.0419 20.0003 16.0419C17.814 16.0419 16.0417 17.8142 16.0417 20.0005C16.0417 22.1867 17.814 23.9591 20.0003 23.9591Z" fill="#1A73E8" />
        <path d="M20.0003 15.0003H28.6595C27.782 13.48 26.5198 12.2174 24.9995 11.3396C23.4794 10.4619 21.7549 9.99987 19.9995 10C18.2442 10 16.5198 10.4624 14.9998 11.3404C13.4797 12.2183 12.2176 13.481 11.3403 15.0015L15.67 22.5007L15.6711 22.5013C14.7771 20.9544 14.7765 19.0479 15.6696 17.5005C16.1083 16.7402 16.7397 16.1088 17.4999 15.6699C18.2601 15.2311 19.1226 15 20.0005 15.0002L20.0003 15.0003Z" fill="#E33B2E" />
      </g>
      <defs>
        <clipPath id="clip0_3113_2816">
          <rect width={20} height={20} fill="white" transform="translate(10 10)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CapterraIcon() {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width={40} height={40} rx={20} fill="#F9F9FA" />
      <path d="M7.77856 18.9204L16.2262 18.9221L21.3629 18.9229V13.834L7.77856 18.9204Z" fill="#FF9D28" />
      <path d="M21.3628 13.8341V31.8004L27.7784 11.4311L21.3628 13.8341Z" fill="#68C5ED" />
      <path d="M21.3625 18.9229L16.2258 18.922L21.3625 31.8004V18.9229Z" fill="#044D80" />
      <path d="M7.77856 18.9203L17.5434 22.2264L16.2262 18.922L7.77856 18.9203Z" fill="#E54747" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.829 2.60732C9.89763 2.46423 10.1024 2.46423 10.171 2.60732L12.1827 6.80102C12.2103 6.85861 12.2654 6.89838 12.329 6.90672L16.9601 7.51399C17.1181 7.53471 17.1813 7.72842 17.0658 7.83758L13.6779 11.0367C13.6314 11.0806 13.6103 11.145 13.6221 11.2077L14.4726 15.7767C14.5016 15.9327 14.336 16.0524 14.1959 15.9768L10.0904 13.7602C10.0341 13.7298 9.96595 13.7298 9.90963 13.7602L5.80414 15.9768C5.66406 16.0524 5.49841 15.9327 5.52744 15.7767L6.37794 11.2077C6.38961 11.145 6.36859 11.0806 6.32208 11.0367L2.93425 7.83758C2.81865 7.72842 2.88193 7.53471 3.03994 7.51399L7.67106 6.90672C7.73465 6.89838 7.78968 6.85861 7.81731 6.80102L9.829 2.60732Z"
        fill="#4C505F"
        stroke="#4C505F"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PLATFORM_ICONS = {
  g2: G2Icon,
  chrome: ChromeIcon,
  capterra: CapterraIcon,
};

export default function WorkWithBrandsSocialProof({ socialProof }: Props) {
  return (
    <div className="section-white-block">
      <div className="section">
        <div className="container section-container">
          <div className="work-loved">
            <div className="work-loved-head">
              <div className="max-w-sm">
                <div className="flex-col-gap-2 align-start">
                  <div className="text-solid-900">
                    <h2 className="text-display-h3">{socialProof.headline}</h2>
                  </div>
                  <div className="text-solid-500">
                    <div className="text-body-m">{socialProof.paragraph}</div>
                  </div>
                </div>
              </div>

              {/* Platform rating badges */}
              <div className="w-layout-grid demo-socialproof-icons">
                {socialProof.platforms.map((platform) => {
                  const Icon = PLATFORM_ICONS[platform.icon];
                  return (
                    <a key={platform.icon} href={platform.href} className="demo-socialproof-item w-inline-block">
                      <div className="demo-socialproof-content">
                        <div className="demo-socialproof-icon-2 w-embed">
                          <Icon />
                        </div>
                        <div className="dev-socialproof-rating">
                          <div className="svg w-embed">
                            <StarIcon />
                          </div>
                          <div className="font-semibold">{platform.rating}</div>
                        </div>
                      </div>
                      <div className="demo-socialproof-item-name">
                        <div className="text-overline">{platform.name}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Senja reviews embed */}
            <div className="work-loved-testimonial">
              <div className="senja-embed code-iframe w-embed" data-id="26b5df20-f5c6-41fa-a198-c3bcb97d0f42" data-mode="shadow" data-lazyload="false" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
