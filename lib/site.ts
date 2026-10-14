/*
  Single source of truth for company details. Every one of these is a
  placeholder for Jubilee Sales to replace — they are collected here so the
  client can change them in one file rather than hunting through pages.
*/

export const SITE = {
  name: "Jubilee Sales",
  legalName: "Jubilee Sales Developers Pvt. Ltd.",
  description:
    "Residential and commercial developments across Hyderabad, Bengaluru, Vijayawada and Visakhapatnam.",
  url: "https://jubileesales.in",

  phone: "+91 40 4000 1200",
  phoneHref: "tel:+914040001200",
  whatsapp: "+91 90000 12000",
  whatsappHref: "https://wa.me/919000012000",
  email: "sales@jubileesales.in",

  office: {
    line1: "Jubilee Sales House, Road No. 36",
    line2: "Jubilee Hills, Hyderabad 500033",
    state: "Telangana, India",
    mapQuery: "Road No 36, Jubilee Hills, Hyderabad",
  },

  hours: "Monday to Saturday, 9.30am – 6.30pm",

  // Company-history figures. Anything describing the live list is counted
  // from the projects themselves rather than repeated here.
  stats: {
    projectsDelivered: 12,
    cities: 4,
    yearFounded: 2009,
    sqftDelivered: "3.1 million",
  },

  cities: ["Hyderabad", "Bengaluru", "Vijayawada", "Visakhapatnam"],

  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "YouTube", href: "https://youtube.com/" },
  ],
} as const;

export const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
