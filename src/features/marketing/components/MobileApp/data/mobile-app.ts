// Mobile app page data - extracted from www_foreplay_co (7).html

export interface MobileAppPageData {
  hero: {
    subtitle: string;
    headline: string;
    paragraph: string;
    appStoreHref: string;
    appStoreIconSrc: string;
    googlePlayHref: string;
    googlePlayIconSrc: string;
    heroImageSrc: string;
    heroVideoMp4: string;
    heroVideoWebm: string;
    heroVideoPoster: string;
  };
  features: {
    saveHeadline: string;
    saveParagraph: string;
    savePhoneImageSrc: string;
    saveVideoMp4: string;
    saveVideoWebm: string;
    saveVideoPoster: string;
    snapHeadline: string;
    snapParagraph: string;
    snapIconIos: string;
    snapIconArrow: string;
    snapIconSwipeFile: string;
    browseHeadline: string;
    browseParagraph: string;
    browseVideoMp4: string;
    browseVideoWebm: string;
    browseVideoPoster: string;
    discoveryIcon: string;
  };
  bottomCta: {
    headline: string;
    paragraph: string;
  };
}

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';

export const mobileAppData: MobileAppPageData = {
  hero: {
    subtitle: 'Mobile App',
    headline: 'Creative inspiration wherever you go',
    paragraph:
      "Use ISSO wherever creative inspiration strikes - whether you're scrolling instagram or admiring a billboard.",
    appStoreHref: 'https://apps.apple.com/ca/app/foreplay-ad-swipe-file/id6466097243',
    appStoreIconSrc: `${CDN}/652560c5b07e1f8795380f3a_app-store.svg`,
    googlePlayHref: 'https://play.google.com/store/apps/details?id=co.foreplay.ISSOMobile',
    googlePlayIconSrc: `${CDN}/652560c565e7688277a870bd_google-play.svg`,
    heroImageSrc: `${CDN}/652562834976b49df57e27d2_Group%20137.png`,
    heroVideoMp4: `${CDN}/653fd29e710bbb2e92e66d1b_header-video-transcode.mp4`,
    heroVideoWebm: `${CDN}/653fd29e710bbb2e92e66d1b_header-video-transcode.webm`,
    heroVideoPoster: `${CDN}/653fd29e710bbb2e92e66d1b_header-video-poster-00001.jpg`,
  },

  features: {
    saveHeadline: 'Save content to ISSO from your Phone',
    saveParagraph:
      "Use ISSO wherever creative inspiration strikes - whether you're scrolling instagram or admiring a billboard.",
    savePhoneImageSrc: `${CDN}/652990b64da0f365aef91633_iphone-sync.png`,
    saveVideoMp4: `${CDN}/653030fda3d7bc4941a03672_Swipe-File-Pic-transcode.mp4`,
    saveVideoWebm: `${CDN}/653030fda3d7bc4941a03672_Swipe-File-Pic-transcode.webm`,
    saveVideoPoster: `${CDN}/653030fda3d7bc4941a03672_Swipe-File-Pic-poster-00001.jpg`,
    snapHeadline: 'Snap a Photo and save it to Swipe File',
    snapParagraph: 'Capture & organize OOH advertising inspiration, as easy as two taps.',
    snapIconIos: `${CDN}/652ff16b9b6781c56e020aa0_ios-camera-icon.png`,
    snapIconArrow: `${CDN}/652ff16b558d6fef7811591a_ap-to-app-arrow.svg`,
    snapIconSwipeFile: `${CDN}/67b10c2cd2812e66e1c2af76_product-swipe-file.webp`,
    browseHeadline: 'Browse millions of ads',
    browseParagraph: 'Search, filter and find advertising inspiration anywhere with the ISSO mobile app.',
    browseVideoMp4: `${CDN}/653009a60733cf5f9aa796e7_discovery-test-render-transcode.mp4`,
    browseVideoWebm: `${CDN}/653009a60733cf5f9aa796e7_discovery-test-render-transcode.webm`,
    browseVideoPoster: `${CDN}/653009a60733cf5f9aa796e7_discovery-test-render-poster-00001.jpg`,
    discoveryIcon: `${CDN}/67b10c250778c8023e8536e9_product-discovery.webp`,
  },

  bottomCta: {
    headline: 'Creative experience your clients expect, results they can\'t ignore.',
    paragraph:
      'Unlock the power of ISSO for your creative teams. Discover, launch and analyze winning ads with an unrestricted 7-Day free trial.',
  },
};
