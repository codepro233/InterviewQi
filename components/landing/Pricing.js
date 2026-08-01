import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    desc: "Perfect for trying it out",
    features: [
      "3 sessions per month",
      "All 3 interview formats",
      "Per-answer feedback",
      "Session report",
    ],
    missing: [
      "Session history",
      "PDF export",
      "Unlimited sessions",
    ],
    cta: "Start Free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₦3,000",
    period: "per month",
    desc: "For serious job seekers",
    features: [
      "Unlimited sessions",
      "All 3 interview formats",
      "Per-answer feedback",
      "Session report",
      "Full session history",
      "PDF export",
      "Priority AI responses",
    ],
    missing: [],
    cta: "Get Pro",
    href: "/register?plan=pro",
    highlight: true,
  },
  {
    name: "Agency",
    price: "₦8,000",
    period: "per month",
    desc: "For coaches & recruiters",
    features: [
      "Everything in Pro",
      "Up to 5 team seats",
      "Candidate management",
      "Bulk session export",
      "Priority support",
    ],
    missing: [],
    cta: "Get Agency",
    href: "/register?plan=agency",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Pricing
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            Start free. Upgrade when you're ready to go all in.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? "bg-blue-accent/10 border-2 border-blue-accent shadow-lg shadow-blue-accent/10"
                  : "bg-navy-800 border border-navy-600"
              }`}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-accent text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan name & price */}
              <div className="mb-6">
                <h3 className="font-display font-bold text-text-primary text-xl mb-1">
                  {plan.name}
                </h3>
                <p className="text-text-secondary text-sm mb-4">{plan.desc}</p>
                <div className="flex items-end gap-2">
                  <span className="font-display font-bold text-4xl text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-text-secondary text-sm pb-1">
                    /{plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-text-primary">
                    <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {plan.missing.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-text-muted line-through">
                    <span className="mt-0.5 flex-shrink-0">✗</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`w-full text-center font-semibold py-3 rounded-xl text-sm transition-opacity ${
                  plan.highlight
                    ? "bg-blue-accent hover:opacity-90 text-white shadow-md shadow-blue-accent/20"
                    : "bg-navy-700 hover:bg-navy-600 border border-navy-500 text-text-primary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-text-muted text-sm mt-8">
          All plans include a 7-day money-back guarantee. Payments via Paystack — cards, bank transfer, USSD.
        </p>

      </div>
    </section>
  );
}