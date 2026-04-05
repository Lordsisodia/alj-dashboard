interface ClientHtmlProps {
  html: string;
}

export default function ClientHtml({ html }: ClientHtmlProps) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
