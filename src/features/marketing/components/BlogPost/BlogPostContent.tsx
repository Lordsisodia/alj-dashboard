/**
 * BlogPostContent - renders the article body using Foreplay's .blog-rtb rich-text styles.
 * Content is injected via dangerouslySetInnerHTML (same pattern as Webflow's w-richtext).
 */

interface Props {
  bodyHtml: string;
}

export default function BlogPostContent({ bodyHtml }: Props) {
  return (
    <div className="blog-body">
      <div id="blog-rtb" className="blog-rtb">
        <div
          className="w-richtext"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>
    </div>
  );
}
