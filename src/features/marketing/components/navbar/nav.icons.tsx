// ═══════════════════════════════════════════════════════════════════════════════
// SVG Icons — all nav-related icons in one place
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Chevron ─────────────────────────────────────────────────────────────────

export function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ transition: 'transform 300ms', transform: open ? 'rotate(180deg)' : 'none' }}>
      <path d="M13 8.5L10.53 10.97C10.24 11.26 9.76 11.26 9.47 10.97L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Product sprite animation ─────────────────────────────────────────────────

export const SPRITE_FRAMES: Record<string, number> = {
  'swipe-file': 54,
  discovery: 62,
  spyder: 31,
  lens: 21,
  briefs: 55,
};

export function getSpriteUrl(sprite: string): string {
  const actualSprite = sprite === 'swipe-file' ? 'library' : sprite;
  return `/sprites/nav-spritesheet-160x160-${actualSprite}.png`;
}

export function getGradient(gradient: string): string {
  switch (gradient) {
    case 'discovery': return 'linear-gradient(#7540b700, #7540b7 70%)';
    case 'spyder': return 'linear-gradient(#ed615a00, #ed615a 70%)';
    case 'briefs': return 'linear-gradient(#00a87900, #00a879 70%)';
    case 'lens': return 'linear-gradient(#e77e6e00, #e77e6e4d 12%, #e9d46899 31%, #73d3c3bf 52%, #5d78e4 70%)';
    default: return 'linear-gradient(#1f69ff00, #1f69ff 70%)'; // swipe-file / library: blue
  }
}

// ─── Solutions icons (24×24) ────────────────────────────────────────────────

// Exact paths from scraped foreplay.co HTML
export function ShoppingBagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15.0001 8C15.0001 9.65685 13.6569 11 12.0001 11C10.3432 11 9.00008 9.65685 9.00008 8M4.88288 5.87524L4.13288 17.8752C4.06092 19.0266 4.97534 20 6.12899 20H17.8712C19.0248 20 19.9392 19.0266 19.8673 17.8752L19.1173 5.87524C19.0514 4.82117 18.1773 4 17.1212 4H6.87899C5.82286 4 4.94876 4.82117 4.88288 5.87524Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function BuildingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 11H21V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 11V4C13 3.44772 13.4477 3 14 3H18C18.5523 3 19 3.44772 19 4V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.0039 7H15.0039" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.00391 11V6.20156C5.00391 5.74742 5.15847 5.3068 5.44217 4.95217L6.69156 3.39043C6.88898 3.14366 7.18788 3 7.50391 3C7.81994 3 8.11883 3.14366 8.31625 3.39043L9.56564 4.95217C9.84934 5.3068 10.0039 5.74742 10.0039 6.20156V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function AppGamingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 10V12M8 12V14M8 12H10M8 12H6M6 6H18C20.2091 6 22 7.79086 22 10V14C22 16.2091 20.2091 18 18 18H6C3.79086 18 2 16.2091 2 14V10C2 7.79086 3.79086 6 6 6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.875 13.5C13.875 13.9832 14.2668 14.375 14.75 14.375C15.2332 14.375 15.625 13.9832 15.625 13.5C15.625 13.0168 15.2332 12.625 14.75 12.625C14.2668 12.625 13.875 13.0168 13.875 13.5ZM16.875 10.5C16.875 10.9832 17.2668 11.375 17.75 11.375C18.2332 11.375 18.625 10.9832 18.625 10.5C18.625 10.0168 18.2332 9.625 17.75 9.625C17.2668 9.625 16.875 10.0168 16.875 10.5Z" fill="white" stroke="white" strokeWidth="0.75" strokeLinecap="square"/>
    </svg>
  );
}

export function B2BIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.25V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V18C3 19.1046 3.89543 20 5 20H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.875 8.75C5.875 9.23325 6.26675 9.625 6.75 9.625C7.23325 9.625 7.625 9.23325 7.625 8.75C7.625 8.26675 7.23325 7.875 6.75 7.875C6.26675 7.875 5.875 8.26675 5.875 8.75ZM9.375 8.75C9.375 9.23325 9.76675 9.625 10.25 9.625C10.7332 9.625 11.125 9.23325 11.125 8.75C11.125 8.26675 10.7332 7.875 10.25 7.875C9.76675 7.875 9.375 8.26675 9.375 8.75ZM12.875 8.75C12.875 9.23325 13.2668 9.625 13.75 9.625C14.2332 9.625 14.625 9.23325 14.625 8.75C14.625 8.26675 14.2332 7.875 13.75 7.875C13.2668 7.875 12.875 8.26675 12.875 8.75Z" fill="white" stroke="white" strokeWidth="0.75" strokeLinecap="square"/>
      <path d="M15.5 15.5L22 17.5L19 19L17.5 22L15.5 15.5Z" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"/>
    </svg>
  );
}

export function EducationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8.74775 15.4838V17.25C8.74775 17.8023 9.19547 18.25 9.74775 18.25H14.2501C14.8024 18.25 15.2501 17.8023 15.2501 17.25V15.4838M8.74775 15.4838C8.33524 15.2765 7.94523 15.031 7.58239 14.7519C5.85882 13.4264 4.74805 11.3433 4.74805 9.00089C4.74805 4.99633 7.99438 1.75 11.9989 1.75C16.0035 1.75 19.2498 4.99633 19.2498 9.00089C19.2498 11.3433 18.139 13.4264 16.4155 14.7519C16.0526 15.031 15.6626 15.2765 15.2501 15.4838M8.74775 15.4838H15.2501M9.74982 21.25H14.2498" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function FreelancerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8.75 11C10.683 11 12.25 9.433 12.25 7.5C12.25 5.567 10.683 4 8.75 4C6.817 4 5.25 5.567 5.25 7.5C5.25 9.433 6.817 11 8.75 11Z" stroke="white" strokeWidth="2"/>
      <path d="M2 20C2 16.6863 4.68629 14 8 14H8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 20L12.6892 14.0879C12.8732 13.444 13.4617 13 14.1315 13H20.5417C21.2725 13 21.8001 13.6995 21.5994 14.4022L20.2072 19.2747C20.0846 19.704 19.6922 20 19.2457 20H11ZM11 20H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function OFMIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3.5C17.5 4.1 18.5 5.6 18.5 7.3C18.5 8.9 17.6 10.4 16.2 11.1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18.5 15.5C20.2 16.1 21.5 17.5 21.5 19.3V21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export const SOLUTIONS_ICONS: Record<string, React.ReactNode> = {
  'OFM & Model Management': <OFMIcon />,
  'E-Commerce & Retail': <ShoppingBagIcon />,
  'Agencies': <BuildingIcon />,
  'Mobile Apps & Gaming': <AppGamingIcon />,
  'B2B & SaaS': <B2BIcon />,
  'Info, Education & Community': <EducationIcon />,
  'Freelancers & Creators': <FreelancerIcon />,
};

// ─── Resources icons (18×18) ────────────────────────────────────────────────

// Exact paths from scraped foreplay.co HTML — 20×20 viewBox
export function UniversityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18.25 7.75L10 11.5L1.75 7.75L10 4L18.25 7.75ZM18.25 7.75V13M4.75 9.25V12.4769C4.75 13.0298 5.05424 13.538 5.54167 13.7991L9.2917 15.808C9.73413 16.0451 10.2659 16.0451 10.7083 15.808L14.4583 13.7991C14.9458 13.538 15.25 13.0298 15.25 12.4769V9.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function EventsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M14.5 4H5.5C4.67157 4 4 4.67157 4 5.5V14.5C4 15.3284 4.67157 16 5.5 16H14.5C15.3284 16 16 15.3284 16 14.5V5.5C16 4.67157 15.3284 4 14.5 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 13H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 8.5V7H8.5V8.5H7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function KnowledgeBaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.75 5.5C7.33579 5.5 7 5.83579 7 6.25C7 6.66421 7.33579 7 7.75 7V5.5ZM12.25 7C12.6642 7 13 6.66421 13 6.25C13 5.83579 12.6642 5.5 12.25 5.5V7ZM7.75 8.5C7.33579 8.5 7 8.83577 7 9.25C7 9.66423 7.33579 10 7.75 10V8.5ZM10 10C10.4142 10 10.75 9.66423 10.75 9.25C10.75 8.83577 10.4142 8.5 10 8.5V10ZM6.25 4H13.75V2.5H6.25V4ZM14.5 4.75V15.25H16V4.75H14.5ZM13.75 16H6.25V17.5H13.75V16ZM5.5 15.25V4.75H4V15.25H5.5ZM6.25 16C5.83578 16 5.5 15.6642 5.5 15.25H4C4 16.4927 5.00736 17.5 6.25 17.5V16ZM14.5 15.25C14.5 15.6642 14.1642 16 13.75 16V17.5C14.9927 17.5 16 16.4927 16 15.25H14.5ZM13.75 4C14.1642 4 14.5 4.33579 14.5 4.75H16C16 3.50736 14.9927 2.5 13.75 2.5V4ZM6.25 2.5C5.00736 2.5 4 3.50736 4 4.75H5.5C5.5 4.33579 5.83579 4 6.25 4V2.5ZM14.5 10V12.25H16V10H14.5ZM13.75 13H6.25V14.5H13.75V13ZM6.25 17.5H8.5V16H6.25V17.5ZM6.25 13C5.00736 13 4 14.0073 4 15.25H5.5C5.5 14.8358 5.83579 14.5 6.25 14.5V13ZM14.5 12.25C14.5 12.6642 14.1642 13 13.75 13V14.5C14.9927 14.5 16 13.4927 16 12.25H14.5ZM7.75 7H12.25V5.5H7.75V7ZM7.75 10H10V8.5H7.75V10Z" fill="white"/>
    </svg>
  );
}

export function ExpertsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.2508 14.875L13.7508 16L16.0008 12.25M12.2508 11.191C11.5763 10.9069 10.8204 10.75 10.0008 10.75C7.45747 10.75 5.52783 12.2607 4.7377 14.3972C4.4311 15.2261 5.13958 16 6.02347 16H9.25082M12.6258 5.875C12.6258 7.32475 11.4506 8.5 10.0008 8.5C8.55107 8.5 7.37584 7.32475 7.37584 5.875C7.37584 4.42525 8.55107 3.25 10.0008 3.25C11.4506 3.25 12.6258 4.42525 12.6258 5.875Z" stroke="white" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BlogIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.5 16.75H6.25C5.42157 16.75 4.75 16.0784 4.75 15.25V4.75C4.75 3.92157 5.42157 3.25 6.25 3.25H13.75C14.5784 3.25 15.25 3.92157 15.25 4.75V9.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.5 16.7502V15.0001L14.125 12.3751C14.6082 11.8919 15.3917 11.8919 15.875 12.3751C16.3583 12.8584 16.3583 13.6419 15.875 14.1252L13.25 16.7502H11.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"/>
      <path d="M7.75 6.25H12.25" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7.75 9.25H9.25" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function AffiliateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 16.75a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 6.63v-.75m0 7.5v.74m1.5-6.37c-.75-1.5-3.38-1.09-3.38.58 0 2.18 3.76 1.15 3.76 3.28 0 1.68-3 2.14-3.76.64" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function WorkWithBrandsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.42 3.52a.77.77 0 0 1 1.16 0l1.02 1.17c.18.2.44.3.7.25l1.54-.24c.47-.07.89.28.9.75L14.76 7c0 .27.15.52.38.65l1.33.8c.4.24.5.79.2 1.15l-.98 1.2a.77.77 0 0 0-.13.75l.5 1.47a.77.77 0 0 1-.57 1l-1.53.3a.77.77 0 0 0-.57.48l-.56 1.45a.77.77 0 0 1-1.1.4l-1.35-.75a.77.77 0 0 0-.75 0l-1.36.75a.77.77 0 0 1-1.1-.4l-.55-1.45a.77.77 0 0 0-.58-.48l-1.52-.3a.77.77 0 0 1-.59-1l.5-1.47a.77.77 0 0 0-.12-.74l-.98-1.2c-.3-.37-.2-.92.2-1.16l1.34-.8A.77.77 0 0 0 5.24 7l.03-1.55c0-.47.43-.82.9-.75l1.52.24c.27.05.53-.05.7-.25l1.03-1.17Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="m8.13 10.38.85.85c.15.15.39.15.54 0l2.36-2.36" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function AgencyDirectoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16 10v4.5c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5V10m4.13-6h3.75M8.13 4 7.7 7.4a2.32 2.32 0 1 0 4.6 0L11.88 4M8.13 4H5.48a1.5 1.5 0 0 0-1.43 1.05l-.67 2.13a2.17 2.17 0 1 0 4.23.92L8.13 4Zm3.75 0h2.64c.66 0 1.24.43 1.43 1.05l.67 2.13a2.17 2.17 0 1 1-4.23.92L11.88 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export const RESOURCES_LEARN_ICONS: Record<string, React.ReactNode> = {
  university: <UniversityIcon />,
  events: <EventsIcon />,
  knowledge: <KnowledgeBaseIcon />,
  experts: <ExpertsIcon />,
  blog: <BlogIcon />,
};

export const RESOURCES_EARN_ICONS: Record<string, React.ReactNode> = {
  affiliate: <AffiliateIcon />,
  brands: <WorkWithBrandsIcon />,
  directory: <AgencyDirectoryIcon />,
};

export const RESOURCES_ALL_ICONS: Record<string, React.ReactNode> = {
  university: <UniversityIcon />,
  events: <EventsIcon />,
  knowledge: <KnowledgeBaseIcon />,
  experts: <ExpertsIcon />,
  blog: <BlogIcon />,
  affiliate: <AffiliateIcon />,
};

// ─── Extend icons (20×20) ──────────────────────────────────────────────────

export function ChromeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M10.528 19.05L12.265 16.04C12.177 16.047 12.089 16.05 12 16.05C10.473 16.05 9.144 15.205 8.454 13.958L5.515 8.868C5.057 9.815 4.8 10.877 4.8 12C4.8 15.472 7.258 18.37 10.528 19.05ZM12.531 19.181C16.26 18.909 19.2 15.798 19.2 12C19.2 11.214 19.074 10.458 18.841 9.75H15.368C15.799 10.394 16.05 11.167 16.05 12C16.05 12.763 15.839 13.477 15.472 14.086L12.531 19.181ZM13.929 13.159L13.949 13.125C14.14 12.794 14.25 12.41 14.25 12C14.25 10.757 13.243 9.75 12 9.75C10.757 9.75 9.75 10.757 9.75 12C9.75 12.395 9.852 12.765 10.03 13.088L10.051 13.125C10.44 13.798 11.167 14.25 12 14.25C12.819 14.25 13.535 13.813 13.929 13.159ZM6.632 7.202L8.367 10.208C9.028 8.87 10.407 7.95 12 7.95H17.954C16.658 6.049 14.475 4.8 12 4.8C9.867 4.8 7.95 5.728 6.632 7.202ZM12 21C7.029 21 3 16.971 3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12C21 16.971 16.971 21 12 21Z" fill="white" fillOpacity="0.6"/>
    </svg>
  );
}

export function MobileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.7 4.8C5.7 3.309 6.909 2.1 8.4 2.1H15.6C17.091 2.1 18.3 3.309 18.3 4.8V19.2C18.3 20.691 17.091 21.9 15.6 21.9H8.4C6.909 21.9 5.7 20.691 5.7 19.2V4.8ZM8.4 3.9C7.903 3.9 7.5 4.303 7.5 4.8V19.2C7.5 19.697 7.903 20.1 8.4 20.1H15.6C16.097 20.1 16.5 19.697 16.5 19.2V4.8C16.5 4.303 16.097 3.9 15.6 3.9H8.4ZM10.2 5.7C10.2 5.203 10.603 4.8 11.1 4.8H12.9C13.397 4.8 13.8 5.203 13.8 5.7C13.8 6.197 13.397 6.6 12.9 6.6H11.1C10.603 6.6 10.2 6.197 10.2 5.7Z" fill="white" fillOpacity="0.6"/>
    </svg>
  );
}

export function ApiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 3.764C22 4.739 21.21 5.529 20.235 5.529C19.735 5.529 19.283 5.32 18.962 4.986C18.826 4.844 18.647 4.74 18.45 4.74H5.55C5.353 4.74 5.174 4.844 5.038 4.986C4.717 5.32 4.265 5.529 3.765 5.529C2.79 5.529 2 4.739 2 3.764C2 2.789 2.79 1.999 3.765 1.999C4.265 1.999 4.717 2.207 5.038 2.542C5.174 2.684 5.353 2.787 5.55 2.787H18.45C18.647 2.787 18.826 2.684 18.962 2.542C19.283 2.207 19.735 1.999 20.235 1.999C21.21 1.999 22 2.789 22 3.764Z" fill="white" fillOpacity="0.6"/>
      <path d="M12 13.764C12.975 13.764 13.765 12.974 13.765 11.999C13.765 11.025 12.975 10.235 12 10.235C11.025 10.235 10.235 11.025 10.235 11.999C10.235 12.974 11.025 13.764 12 13.764Z" fill="white" fillOpacity="0.6"/>
      <circle cx="20.235" cy="12" r="1.765" fill="white" fillOpacity="0.6"/>
      <circle cx="3.765" cy="20.235" r="1.765" fill="white" fillOpacity="0.6"/>
      <circle cx="12" cy="20.235" r="1.765" fill="white" fillOpacity="0.6"/>
      <circle cx="20.235" cy="20.235" r="1.765" fill="white" fillOpacity="0.6"/>
    </svg>
  );
}

export const EXTEND_ICONS: Record<string, React.ReactNode> = {
  chrome: <ChromeIcon />,
  mobile: <MobileIcon />,
  api: <ApiIcon />,
};
