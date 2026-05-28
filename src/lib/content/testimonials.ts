/**
 * Attributed client testimonials (from photospace.studio).
 * TODO(confirm): permission to reuse names/quotes on the new site.
 * Note: Paul Trantow (Altitude Arts) had quote text identical to Lincoln
 * Phillips — omitted as a likely duplicate pending confirmation.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  featured?: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Photospace is an amazing facility for professional photography. Not only is the equipment state-of-the-art but the space is beautifully designed and inspiring.",
    name: "Ellen Stark",
    role: "Marketing Director, Denver Botanic Gardens",
    featured: true,
  },
  {
    quote:
      "It's truly the only professional photo studio available to creatives in Denver. An insane amount of equipment, a real cyc wall (not made of ¼″ plywood), and fully controllable curtains for adding or removing ambient light. It's also cheaper than most places. Using this space has made me a better photographer.",
    name: "Drew C.",
    role: "Photographer",
  },
  {
    quote:
      "Beautiful agency-quality studio. Dan is regularly updating not just his cameras, but his computing and grip equipment as well. Excellent shooting area, comfortable client area, great kitchen.",
    name: "Lincoln Phillips",
    role: "Photographer · Educator",
  },
  {
    quote:
      "I worked with photospace for a two-day photo shoot and everything was great. The gear, atmosphere, and studio space are top notch and will be my go-to location for studio shoots in the future.",
    name: "Matt Nager",
    role: "Advertising & Editorial Photographer",
  },
  {
    quote:
      "Excellent studio atmosphere with all the latest and greatest in top-end professional camera gear, lighting, and grip equipment. Private closed-studio sessions are a fantastic way to wow your clients. Great to have the full kitchen, upstairs loft, and plenty of space for clients and models to move around.",
    name: "Michael Bielecki",
    role: "Photographer + Videographer",
  },
  {
    quote:
      "photospace has been our go-to studio for several years now. Dan and company are great and I highly recommend the studio. It offers both a great place to shoot and is extremely comfortable — which is a plus for our clients, and us.",
    name: "Peter Horton",
    role: "Telideo Productions",
  },
  {
    quote:
      "It is Denver's only REAL photography studio available to the public, where the wall, equipment, and set-up match a true professional environment. Being exposed to the equipment, jargon, and environment has allowed me to level up immensely.",
    name: "Andrew Cope",
    role: "Andrew Luther Cope Photography",
  },
  {
    quote:
      "Excellent resource for photo gear for not only Denver but all of Colorado. Dan is always unbelievably helpful and wonderful to work with. Can't recommend him more.",
    name: "Liz Long",
    role: "Aspen Productions",
  },
  {
    quote: "Great atmosphere, excellent natural light. Areas to work and relax.",
    name: "Gretchen Sherlock",
    role: "Commercial Photographer",
  },
  {
    quote: "I LOVE this studio!",
    name: "Peter Yang",
    role: "Photographer",
  },
];
