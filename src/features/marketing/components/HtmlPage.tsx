'use client';

import React, { useState, useEffect } from 'react';

// Strip shell: remove DOCTYPE, html, head, body, scripts, global wrapper, nav, footer
function stripShell(html: string): string {
  let c = html
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  // Remove outer <div class="global"> wrapper
  if (c.startsWith('<div class="global">')) {
    c = c.slice('<div class="global">'.length);
    c = c.replace(/\s*<\/div>\s*$/, '');
  }

  // Remove the Webflow nav — it's a <div class="navigation w-nav"> containing the
  // code-sprite SVG and navbar-container. Find navStart, then count depth from 0:
  // the first </div> that makes depth=-1 is the closing of the nav div wrapper.
  const navStart = c.indexOf('class="navigation w-nav"');
  if (navStart !== -1) {
    let depth = 0;
    let navEnd = -1;
    for (let i = navStart; i < c.length; i++) {
      if (c.slice(i, i + 5) === '<div ') depth++;
      else if (c.slice(i, i + 6) === '</div>') {
        depth--;
        if (depth < 0) { navEnd = i; break; }
      }
    }
    if (navEnd !== -1) {
      c = c.slice(0, navStart) + c.slice(navEnd + 6);
    }
  }

  // Remove Webflow footer copyright strip <div class="footer-foot">
  const footerFootIdx = c.indexOf('<div class="footer-foot"');
  if (footerFootIdx !== -1) {
    c = c.slice(0, footerFootIdx);
  }

  // Remove the Webflow main footer <footer class="u-footer">
  const uFooterStart = c.indexOf('<footer class="u-footer"');
  if (uFooterStart !== -1) {
    c = c.slice(0, uFooterStart);
  }

  // Remove all section.overflow-hidden divs (ProductSection + HomeCTA + Footer)
  // These are the sections we want to rebuild in React
  const allSections: number[] = [];
  let searchFrom = 0;
  let idx;
  while ((idx = c.indexOf('<div class="section overflow-hidden">', searchFrom)) !== -1) {
    allSections.push(idx);
    searchFrom = idx + 1;
  }
  // Remove all sections (they are all React now)
  if (allSections.length > 0) {
    // Find where the LAST section ends
    const lastSectionStart = allSections[allSections.length - 1];
    let depth = 0;
    let sectionEnd = -1;
    for (let i = lastSectionStart; i < c.length; i++) {
      if (c.slice(i, i + 5) === '<div ') depth++;
      else if (c.slice(i, i + 6) === '</div>') {
        depth--;
        if (depth < 0) { sectionEnd = i; break; }
      }
    }
    if (sectionEnd !== -1) {
      c = c.slice(0, allSections[0]) + c.slice(sectionEnd + 6);
    }
  }

  return c;
}

interface HtmlPageProps {
  file: string;
}

export default function HtmlPage({ file }: HtmlPageProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch(file)
      .then(r => r.text())
      .then(text => setHtml(stripShell(text)))
      .catch(() => setHtml('<div style="padding:40px;color:#fff;text-align:center;"><h1>Page not found</h1></div>'));
  }, [file]);

  if (!html) return <div style={{ minHeight: '100vh' }} />;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
