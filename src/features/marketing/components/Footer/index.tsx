import Products from './Products';
import Company from './Company';
import Links from './Links';
import Social from './Social';
import AskAI from './AskAI';

export default function Footer() {
  return (
    <footer className="mt-10 pt-10 pb-20 border-t border-white/[0.06] bg-black">
      <div className="max-w-[1216px] mx-auto px-10">
        <div className="flex flex-col gap-9">

          <Products />

          <div className="w-full h-px bg-white/16" />

          <Company />

          <div className="w-full h-px bg-white/16" />

          <Links />

          <div className="flex items-center justify-between w-full">
            <AskAI />
          </div>

          <div className="w-full h-px bg-white/16" />
        </div>

        <div className="flex items-center gap-4 mt-9 border-t border-white/[0.06] h-11">
          <div className="flex gap-4 flex-1 items-center">
            <span className="!text-[#cacace] font-['Inter'] text-sm font-normal leading-5 mr-2">
              © 2026 ISSO, Inc. All rights reserved.
            </span>
            <a
              href="/page/privacy-policy"
              className="!text-[#cacace] !no-underline py-1 font-['Inter'] text-sm font-normal transition-colors duration-200 hover:!text-white/92"
            >
              Privacy Policy
            </a>
            <a
              href="/page/terms-of-service"
              className="!text-[#cacace] !no-underline py-1 font-['Inter'] text-sm font-normal transition-colors duration-200 hover:!text-white/92"
            >
              Terms &amp; Conditions
            </a>
          </div>

          <Social />
        </div>
      </div>
    </footer>
  );
}
