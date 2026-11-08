import { Code, Paintbrush, CreditCard } from "lucide-react";
import { FaWordpress } from "react-icons/fa";

// What Ali offers, shown in the About band (DESIGN.md: "Section Services").
// Approved by Ali on 2026-11-08; each item comes from his real work (skills,
// projects, and the PT Afarco internship). Only add services he confirms.
//
// Shape: { icon, title, description }. Icons must relate to the service (R-04):
// Lucide for generic glyphs, react-icons only for brand logos Lucide lacks.
const SERVICES = [
  {
    icon: Code,
    title: "Web App Development",
    description:
      "Full-stack web apps with React or Next.js on the front end and Node.js/Express or Laravel with PostgreSQL or MySQL behind them.",
  },
  {
    icon: Paintbrush,
    title: "UI/UX Design",
    description: "Wireframes and interface designs in Figma.",
  },
  {
    icon: FaWordpress,
    title: "WordPress Websites",
    description:
      "Building and maintaining client sites, as I did for two clients during my internship at PT Afarco.",
  },
  {
    icon: CreditCard,
    title: "Payment Gateway Integration",
    description: "Integrating Midtrans payments, as in the SkillConnect project.",
  },
];

export default SERVICES;
