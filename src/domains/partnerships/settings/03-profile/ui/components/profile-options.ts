export const businessTypeOptions = [
  { value: "", label: "Select business type", description: "Choose “Custom” if not listed" },
  { value: "freelance", label: "Freelance", description: "Independent professional" },
  { value: "agency", label: "Agency", description: "Service-based business" },
  { value: "consulting", label: "Consulting", description: "Professional consulting" },
  { value: "startup", label: "Startup", description: "Early-stage company" },
  { value: "enterprise", label: "Enterprise", description: "Large corporation" },
  { value: "custom", label: "Custom", description: "Type your own value" },
];

export const industryOptions = [
  { value: "", label: "Select industry", description: "Choose “Custom” if not listed" },
  { value: "technology", label: "Technology", description: "Software, IT, tech services" },
  { value: "marketing", label: "Marketing", description: "Digital marketing, advertising" },
  { value: "finance", label: "Finance", description: "Banking, investments, financial services" },
  { value: "design", label: "Design", description: "Graphic, UX/UI, product design" },
  { value: "consulting", label: "Consulting", description: "Business, management consulting" },
  { value: "sales", label: "Sales", description: "B2B, B2C sales, business development" },
  { value: "healthcare", label: "Healthcare", description: "Medical, health services" },
  { value: "education", label: "Education", description: "Training, teaching, e-learning" },
  { value: "real-estate", label: "Real Estate", description: "Property, real estate services" },
  { value: "ecommerce", label: "E-commerce", description: "Online retail, digital commerce" },
  { value: "custom", label: "Custom", description: "Type your own value" },
];

export const companySizeOptions = [
  { value: "", label: "Select company size", description: "Choose “Custom” if not listed" },
  { value: "1", label: "Just me", description: "Individual freelancer/solo" },
  { value: "2-5", label: "2-5 people", description: "Small team" },
  { value: "6-10", label: "6-10 people", description: "Medium team" },
  { value: "11-25", label: "11-25 people", description: "Growing team" },
  { value: "26+", label: "26+ people", description: "Large team" },
  { value: "custom", label: "Custom", description: "Type your own value" },
];

export const geographicOptions = [
  { value: "", label: "Select region", description: "Choose “Custom” if not listed" },
  { value: "north-america", label: "North America", description: "USA, Canada, Mexico" },
  { value: "europe", label: "Europe", description: "UK, EU, European countries" },
  { value: "asia-pacific", label: "Asia Pacific", description: "Asia, Australia, Pacific" },
  { value: "latin-america", label: "Latin America", description: "Central and South America" },
  { value: "africa", label: "Africa", description: "African countries" },
  { value: "middle-east", label: "Middle East", description: "Middle Eastern countries" },
  { value: "global", label: "Global", description: "Worldwide availability" },
  { value: "custom", label: "Custom", description: "Type your own value" },
];

export const certificationOptions = [
  { value: "", label: "Select certification level", description: "Choose “Custom” if not listed" },
  { value: "basic", label: "Basic", description: "Entry-level SISO certification" },
  { value: "advanced", label: "Advanced", description: "Experienced partner certification" },
  { value: "expert", label: "Expert", description: "Top-tier partner certification" },
  { value: "custom", label: "Custom", description: "Type your own value" },
];

export const languageOptions = [
  { value: "", label: "Select languages", description: "Choose “Custom” if not listed" },
  { value: "english", label: "English", description: "Native or fluent" },
  { value: "spanish", label: "Spanish", description: "Español" },
  { value: "french", label: "French", description: "Français" },
  { value: "german", label: "German", description: "Deutsch" },
  { value: "mandarin", label: "Mandarin Chinese", description: "中文" },
  { value: "portuguese", label: "Portuguese", description: "Português" },
  { value: "japanese", label: "Japanese", description: "日本語" },
  { value: "korean", label: "Korean", description: "한국어" },
  { value: "arabic", label: "Arabic", description: "العربية" },
];

export const timelineOptions = [
  { value: "3-months", label: "3 months", description: "Short-term goal" },
  { value: "6-months", label: "6 months", description: "Medium-term goal" },
  { value: "1-year", label: "1 year", description: "Annual goal" },
  { value: "custom", label: "Custom date", description: "Set your own timeline" },
];

export const monthOptions = [
  { value: "01", label: "January", description: "Start of the year" },
  { value: "02", label: "February", description: "Winter month" },
  { value: "03", label: "March", description: "Spring begins" },
  { value: "04", label: "April", description: "Spring month" },
  { value: "05", label: "May", description: "Late spring" },
  { value: "06", label: "June", description: "Summer begins" },
  { value: "07", label: "July", description: "Summer month" },
  { value: "08", label: "August", description: "Late summer" },
  { value: "09", label: "September", description: "Fall begins" },
  { value: "10", label: "October", description: "Fall month" },
  { value: "11", label: "November", description: "Late fall" },
  { value: "12", label: "December", description: "Winter begins" },
];

export const yearOptions = Array.from({ length: 50 }, (_, index) => {
  const year = new Date().getFullYear() - index;
  return {
    value: year.toString(),
    label: year.toString(),
    description: `${year} year`,
  };
});
