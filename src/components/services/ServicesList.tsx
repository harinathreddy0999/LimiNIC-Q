import { useState } from "react";
import ServiceCard from "./ServiceCard";
import { motion } from "framer-motion";

interface ServicesListProps {
  category: string;
}

const haircareServices = [
  {
    title: "Precision Haircut",
    description:
      "Expert haircut tailored to your face shape, hair texture, and personal style.",
    price: "$75+",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    aiTag: "Recommended for fine hair",
  },
  {
    title: "Hair Styling & Blowout",
    description:
      "Professional styling and blowout that gives your hair volume, shine and movement.",
    price: "$65+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
    aiTag: "Perfect for special events",
  },
  {
    title: "Hair Color & Highlights",
    description:
      "Premium hair coloring with dimensional highlights for a natural, radiant look.",
    price: "$120+",
    duration: "120 min",
    image:
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80",
    aiTag: "Trending style this season",
  },
  {
    title: "Root Touch-up",
    description:
      "Quick and effective color application to cover grown-out roots and refresh your look.",
    price: "$85+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80",
    aiTag: "Maintenance essential",
  },
  {
    title: "Keratin Treatment",
    description:
      "Smoothing treatment that eliminates frizz and adds incredible shine and softness.",
    price: "$250+",
    duration: "150 min",
    image:
      "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=800&q=80",
    aiTag: "Best for frizzy hair",
  },
  {
    title: "Deep Conditioning Hair Spa",
    description:
      "Intensive repair treatment for damaged hair, restoring moisture and vitality.",
    price: "$65+",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    aiTag: "Hydration boost",
  },
  {
    title: "Scalp Detox Treatment",
    description:
      "Deep cleansing treatment that removes buildup and promotes a healthy scalp environment.",
    price: "$70+",
    duration: "50 min",
    image:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80",
    aiTag: "Recommended for oily scalp",
  },
  {
    title: "Dandruff Control Therapy",
    description:
      "Specialized treatment targeting dandruff and flaky scalp with medicated products.",
    price: "$80+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1550172268-9a48af98ac5f?w=800&q=80",
    aiTag: "Solution for flaky scalp",
  },
  {
    title: "Hair Fall Control Package",
    description:
      "Comprehensive treatment to strengthen hair follicles and reduce hair fall.",
    price: "$120+",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80",
    aiTag: "Top choice for thinning hair",
  },
  {
    title: "Olaplex Hair Repair",
    description:
      "Revolutionary treatment that rebuilds broken hair bonds for stronger, healthier hair.",
    price: "$95+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
    aiTag: "Essential for colored hair",
  },
];

const skincareServices = [
  {
    title: "Hydrating Facial",
    description:
      "Intensive moisture treatment for dry, dehydrated skin using hyaluronic acid and botanicals.",
    price: "$135+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1596178060810-72660ee8a9d1?w=800&q=80",
    aiTag: "Perfect for dry skin",
  },
  {
    title: "Anti-Aging Facial",
    description:
      "Targeted treatment to reduce signs of aging with peptides, antioxidants, and gentle exfoliation.",
    price: "$165+",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80",
    aiTag: "Recommended for 35+ skin",
  },
  {
    title: "Acne Treatment Facial",
    description:
      "Deep cleansing treatment targeting acne-prone skin with antibacterial and anti-inflammatory ingredients.",
    price: "$145+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80",
    aiTag: "Solution for breakouts",
  },
  {
    title: "Brightening Vitamin-C Facial",
    description:
      "Illuminating treatment packed with vitamin C to brighten dull skin and reduce hyperpigmentation.",
    price: "$155+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    aiTag: "Glow enhancer",
  },
  {
    title: "Organic Glow Facial",
    description:
      "All-natural facial using organic ingredients to nourish and revitalize your skin.",
    price: "$140+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    aiTag: "Eco-friendly choice",
  },
  {
    title: "Microdermabrasion",
    description:
      "Advanced exfoliation treatment that removes dead skin cells and stimulates collagen production.",
    price: "$150+",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
    aiTag: "Texture improvement",
  },
  {
    title: "Skin Detox with Activated Charcoal",
    description:
      "Deep cleansing facial using activated charcoal to draw out impurities and toxins.",
    price: "$130+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&q=80",
    aiTag: "Best for congested skin",
  },
  {
    title: "Under Eye Rejuvenation",
    description:
      "Specialized treatment targeting dark circles, puffiness, and fine lines around the eyes.",
    price: "$85+",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1583001809873-a128495da465?w=800&q=80",
    aiTag: "Targets tired eyes",
  },
  {
    title: "Skin Analysis + AI Product Suggestion",
    description:
      "Comprehensive skin analysis with personalized product recommendations based on AI technology.",
    price: "$75+",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    aiTag: "Tech-powered skincare",
  },
  {
    title: "Custom Skincare Plan",
    description:
      "Personalized skincare consultation with our AI assistant to create a tailored routine for your skin needs.",
    price: "$95+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
    aiTag: "AI personalized",
  },
];

const massageServices = [
  {
    title: "Swedish Relaxation Massage",
    description:
      "Classic massage technique using long strokes and kneading to relieve tension and improve circulation.",
    price: "$130+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
    aiTag: "Stress reliever",
  },
  {
    title: "Deep Tissue Massage",
    description:
      "Therapeutic massage targeting deeper muscle layers to release chronic tension and pain.",
    price: "$150+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    aiTag: "Pain relief specialist",
  },
  {
    title: "Hot Stone Therapy",
    description:
      "Relaxing massage using smooth, heated stones to ease muscle tension and improve circulation.",
    price: "$165+",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80",
    aiTag: "Heat therapy benefits",
  },
  {
    title: "Aromatherapy Massage",
    description:
      "Gentle massage using essential oils to promote relaxation and emotional well-being.",
    price: "$140+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    aiTag: "Mood enhancer",
  },
  {
    title: "Head, Neck & Shoulder Massage",
    description:
      "Focused massage targeting tension in the upper body, perfect for desk workers and those with stress headaches.",
    price: "$90+",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
    aiTag: "Quick stress buster",
  },
  {
    title: "Reflexology (Foot Massage)",
    description:
      "Specialized pressure point massage on the feet that corresponds to organs and systems of the body.",
    price: "$85+",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1582640731057-9a3683406ca9?w=800&q=80",
    aiTag: "Energy balancer",
  },
  {
    title: "Ayurvedic Abhyanga Massage",
    description:
      "Traditional Indian full-body massage using warm oils to balance the doshas and promote wellness.",
    price: "$160+",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    aiTag: "Holistic healing",
  },
  {
    title: "Prenatal Massage",
    description:
      "Gentle massage specifically designed for expectant mothers to relieve discomfort and reduce stress.",
    price: "$145+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
    aiTag: "Safe for pregnancy",
  },
  {
    title: "CBD Infused Stress Relief Massage",
    description:
      "Therapeutic massage enhanced with CBD oil to reduce inflammation and promote deep relaxation.",
    price: "$170+",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1570654621852-9dd25b76b38d?w=800&q=80",
    aiTag: "Inflammation reducer",
  },
  {
    title: "Mood-Based Massage Package",
    description:
      "Customized massage experience selected by our AI based on your current mood and wellness needs.",
    price: "$180+",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    aiTag: "AI selected therapy",
  },
];

const wellnessServices = [
  {
    title: "Full Body Detox Wrap",
    description:
      "Purifying body wrap that eliminates toxins, reduces water retention, and leaves skin glowing.",
    price: "$145+",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=800&q=80",
    aiTag: "Total body refresh",
  },
  {
    title: "Yoga & Guided Breathing Sessions",
    description:
      "One-on-one yoga instruction with focused breathing techniques tailored to your wellness goals.",
    price: "$110+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80",
    aiTag: "Mind-body balance",
  },
  {
    title: "Meditation + Aromatherapy Room",
    description:
      "Guided meditation in a sensory room with carefully selected essential oils to enhance relaxation.",
    price: "$95+",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    aiTag: "Mental clarity booster",
  },
  {
    title: "Stress Management Package",
    description:
      "Comprehensive program combining massage, meditation, and counseling to reduce stress levels.",
    price: "$220+",
    duration: "120 min",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80",
    aiTag: "Burnout recovery",
  },
  {
    title: "Skin & Mood Assessment via AI",
    description:
      "Advanced analysis of your skin condition and emotional state with AI-powered recommendations.",
    price: "$85+",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    aiTag: "Tech-driven wellness",
  },
  {
    title: "Wellness Journaling + Mood Tracking",
    description:
      "Guided session to establish a wellness journal practice with digital mood tracking integration.",
    price: "$75+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    aiTag: "Self-awareness tool",
  },
  {
    title: "Vitamin & Hydration IV Therapy",
    description:
      "Intravenous delivery of vitamins, minerals, and fluids for immediate hydration and energy boost.",
    price: "$180+",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    aiTag: "Instant revitalization",
  },
  {
    title: "Nutrition Consultation",
    description:
      "Expert guidance on nutrition and dietary choices to support your health and beauty goals.",
    price: "$125+",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    aiTag: "Dietary optimization",
  },
  {
    title: "AI-Powered Lifestyle Plan",
    description:
      "Comprehensive wellness plan created by our AI system based on your health data and preferences.",
    price: "$150+",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=800&q=80",
    aiTag: "Personalized AI plan",
  },
  {
    title: "Custom Wellness Retreat",
    description:
      "Personalized half-day retreat combining multiple services for a complete mind-body reset.",
    price: "$350+",
    duration: "240 min",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80",
    aiTag: "Ultimate wellness experience",
  },
];

export default function ServicesList({ category }: ServicesListProps) {
  const [services, setServices] = useState(() => {
    switch (category.toLowerCase()) {
      case "haircare":
        return haircareServices;
      case "skincare":
        return skincareServices;
      case "massage":
        return massageServices;
      case "wellness":
        return wellnessServices;
      default:
        return haircareServices;
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            {category} Services
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Explore our premium {category.toLowerCase()} services designed for
            your ultimate relaxation and rejuvenation
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item}>
              <ServiceCard
                title={service.title}
                description={service.description}
                price={service.price}
                duration={service.duration}
                image={service.image}
                aiTag={service.aiTag}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
