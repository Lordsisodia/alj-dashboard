import FooterLink from './FooterLink';

export default function CategorySection({
  label,
  links,
}: {
  label: string;
  links: Array<{ href: string; children: string; external?: boolean }>;
}) {
  return (
    <div className="flex flex-col gap-2 text-white">
      <div className="footer-label">{label}</div>
      <ul
        className="list-none m-0 p-0 flex flex-col gap-1 items-start"
        style={{ paddingLeft: 0 }}
      >
        {links.map((link, i) => (
          <FooterLink key={`${link.href}-${i}`} href={link.href} external={link.external}>
            {link.children}
          </FooterLink>
        ))}
      </ul>
    </div>
  );
}
