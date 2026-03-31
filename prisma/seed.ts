import "dotenv/config";

import { env } from "../lib/env";
import { formDefinitionsSeed, homePageSeed, singletonPageSeed } from "../lib/content-blueprint";
import { createPrismaClient } from "../lib/prisma-factory";

const prisma = createPrismaClient();

const caseStudySeed = [
  {
    title: "Hidden Gems: Underrated Neighborhoods with Big Potential",
    slug: "hidden-gems-underrated-neighborhoods-with-big-potential",
    category: "VALUE_ADD_MULTIFAMILY",
    overview:
      "Introduction Modern villas are more than just architectural masterpieces - they're a blend of luxury, comfort, and personal expression. The right interior design can transform a property into a timeless sanctuary that reflects both elegance and livability, and the same principle applies to overlooked neighborhoods positioned for long-term upside.",
    businessPlan:
      "Acquire a tired multifamily cluster in a path-of-growth pocket, improve curb appeal and interiors, stabilize occupancy, and reposition the asset for residents seeking affordability with modern finishes.",
    execution:
      "The team phased exterior upgrades first, refreshed common areas, standardized unit turns, and introduced clearer leasing operations so revenue growth could keep pace with resident satisfaction improvements.",
    outcomeSummary:
      "Rents moved upward without disrupting occupancy, operating costs normalized, and the asset became a stronger long-term hold with a clearer story for refinancing and resale.",
    assetProfile: [
      { label: "Asset Type", value: "12-unit multifamily" },
      { label: "Market", value: "Infill neighborhood growth corridor" },
      { label: "Hold Period", value: "36 months" },
      { label: "Strategy", value: "Value-add repositioning" },
    ],
    takeaways: [
      "Neighborhood mispricing can create outsized value when fundamentals are improving.",
      "Operational cleanup is often as important as renovation spend.",
      "Small multifamily deals can scale when repeatable standards are applied.",
    ],
  },
  {
    title: "How to Choose the Right Property for Your Growing Family",
    slug: "how-to-choose-the-right-property-for-your-growing-family",
    category: "OTHER",
    overview:
      "Introduction Modern villas are more than just architectural masterpieces - they're a blend of luxury, comfort, and personal expression. The right interior design can transform a property into a timeless sanctuary that reflects both elegance and daily practicality, especially when buyer priorities are evolving around family needs.",
    businessPlan:
      "Document the search process, map needs against budget and location tradeoffs, and build a decision framework that balances school access, flexible living space, and long-term resale resilience.",
    execution:
      "The study compared layout efficiency, commute patterns, neighborhood amenities, and renovation readiness across multiple listings before narrowing to properties that supported both present comfort and future adaptability.",
    outcomeSummary:
      "The final shortlist reduced decision fatigue, improved budget discipline, and highlighted why thoughtful selection criteria can outperform purely emotional buying decisions.",
    assetProfile: [
      { label: "Asset Type", value: "Single-family residence" },
      { label: "Buyer Focus", value: "Growing household" },
      { label: "Primary Lens", value: "Livability and resale" },
      { label: "Decision Window", value: "90 days" },
    ],
    takeaways: [
      "Functional layout often matters more than square footage alone.",
      "Neighborhood stability can be a stronger value signal than trendiness.",
      "A good family purchase should solve today's needs without boxing out future options.",
    ],
  },
  {
    title: "Luxury Real Estate Boom: The Most Sought-After Properties",
    slug: "luxury-real-estate-boom-the-most-sought-after-properties",
    category: "OTHER",
    overview:
      "Introduction Modern villas are more than just architectural masterpieces - they're a blend of luxury, comfort, and personal expression. The premium segment continues to reward homes with privacy, efficient layouts, and hospitality-grade finishes that elevate both lifestyle and long-term desirability.",
    businessPlan:
      "Track what high-intent luxury buyers are prioritizing, isolate the finishes and amenities commanding pricing power, and package those lessons into acquisition and design standards for future premium inventory.",
    execution:
      "The team reviewed listing performance, touring feedback, and buyer objections across upper-tier homes, then used that analysis to refine renovation scope, staging strategy, and positioning language.",
    outcomeSummary:
      "Homes with better light, sharper material palettes, and stronger indoor-outdoor flow consistently outperformed comparable listings that lacked a cohesive design point of view.",
    assetProfile: [
      { label: "Asset Type", value: "Luxury single-family" },
      { label: "Demand Driver", value: "Design-led lifestyle appeal" },
      { label: "Buyer Segment", value: "Move-up and cash buyers" },
      { label: "Market Position", value: "Upper-tier suburban" },
    ],
    takeaways: [
      "Luxury demand concentrates around design clarity, not just size.",
      "Premium buyers notice flow and finish consistency immediately.",
      "Thoughtful presentation can materially improve price confidence.",
    ],
  },
  {
    title: "Smart Renovations That Unlock Long-Term Neighborhood Value",
    slug: "smart-renovations-that-unlock-long-term-neighborhood-value",
    category: "TURNAROUND",
    overview:
      "Strategic capital plans can influence how an entire block is perceived. This case study follows a targeted renovation approach that improved resident experience while signaling durable neighborhood momentum to buyers and lenders.",
    businessPlan:
      "Focus renovations on visible trust-building improvements, upgrade the highest-friction interior systems, and coordinate timing so the property contributes to broader neighborhood renewal rather than isolated cosmetic change.",
    execution:
      "Exterior cleanup, lighting, landscaping, entry improvements, and kitchen-bath updates were sequenced to maximize impact while preserving construction efficiency and minimizing turnover disruption.",
    outcomeSummary:
      "The property experienced stronger leasing demand, more favorable broker feedback, and improved appraisal support as the surrounding area gained traction.",
    assetProfile: [
      { label: "Asset Type", value: "Neighborhood turnaround asset" },
      { label: "Capex Focus", value: "Visibility plus function" },
      { label: "Timeline", value: "18 months" },
      { label: "Exit Path", value: "Refinance or sale" },
    ],
    takeaways: [
      "Not every renovation dollar creates the same signaling value.",
      "Visible safety and care improvements can reframe market perception quickly.",
      "Execution timing matters when neighborhood momentum is still forming.",
    ],
  },
  {
    title: "Communities Designed for Growth, Stability, and Everyday Living",
    slug: "communities-designed-for-growth-stability-and-everyday-living",
    category: "VALUE_ADD_MULTIFAMILY",
    overview:
      "Long-term outperformance often comes from assets that serve everyday life well. This case study highlights a community-first approach that aligned resident retention, practical improvements, and neighborhood-level stability.",
    businessPlan:
      "Identify a family-oriented asset with operational inconsistency, invest in common-area quality and resident communication, and build a more durable occupancy profile through steady execution rather than flashy repositioning.",
    execution:
      "Management standards were tightened, landscaping and shared spaces were refreshed, maintenance workflows improved, and renewal conversations started earlier to reduce avoidable churn.",
    outcomeSummary:
      "The result was a calmer rent roll, stronger resident satisfaction, and a property that supported reliable long-term performance with less volatility.",
    assetProfile: [
      { label: "Asset Type", value: "Garden-style multifamily" },
      { label: "Resident Base", value: "Family-oriented tenants" },
      { label: "Priority", value: "Retention and stability" },
      { label: "Hold Strategy", value: "Long-term cash flow" },
    ],
    takeaways: [
      "Retention strategy compounds value over time.",
      "Operational consistency can outperform constant turnover.",
      "Community perception is an investable part of property performance.",
    ],
  },
  {
    title: "Refined Interiors That Elevate Comfort, Light, and Modern Appeal",
    slug: "refined-interiors-that-elevate-comfort-light-and-modern-appeal",
    category: "FIX_FLIP",
    overview:
      "Interior upgrades can shift a listing from acceptable to memorable. This story covers a selective design program focused on layout flow, brighter finishes, and everyday usability rather than overbuilding the renovation scope.",
    businessPlan:
      "Modernize a dated home with a design package that improves perceived spaciousness, simplifies material choices, and raises buyer confidence without pushing the project beyond neighborhood comps.",
    execution:
      "Walls were opened where possible, warm-neutral finishes replaced fragmented palettes, lighting was layered intentionally, and staging emphasized how the refreshed plan supported contemporary living.",
    outcomeSummary:
      "Buyer engagement improved quickly, showing activity accelerated, and the finished product commanded stronger attention relative to nearby inventory.",
    assetProfile: [
      { label: "Asset Type", value: "Design-led flip" },
      { label: "Scope", value: "Interior modernization" },
      { label: "Buyer Goal", value: "Move-in-ready appeal" },
      { label: "Project Length", value: "6 months" },
    ],
    takeaways: [
      "Good design creates emotional clarity for buyers.",
      "Material consistency can make modest homes feel significantly more premium.",
      "The best flips solve layout friction instead of decorating around it.",
    ],
  },
  {
    title: "Turning Operational Drag Into a Repeatable Performance Playbook",
    slug: "turning-operational-drag-into-a-repeatable-performance-playbook",
    category: "TURNAROUND",
    overview:
      "Some properties underperform less because of market conditions and more because the operating system is fragmented. This case study shows how standardization can unlock value before major redevelopment is even required.",
    businessPlan:
      "Audit resident communication, maintenance response times, collections, vendor coordination, and leasing cadence, then build a repeatable process stack that improves performance without forcing a full repositioning.",
    execution:
      "The team implemented weekly operating reviews, cleaned up unit-turn sequencing, clarified vendor ownership, and introduced clearer reporting so issues were surfaced and resolved faster.",
    outcomeSummary:
      "Net operating performance improved, resident complaints declined, and management bandwidth shifted from reactive firefighting to proactive planning.",
    assetProfile: [
      { label: "Asset Type", value: "Operational turnaround" },
      { label: "Primary Lever", value: "Systems and accountability" },
      { label: "Property Scale", value: "Mid-size residential" },
      { label: "Measured Outcome", value: "Margin improvement" },
    ],
    takeaways: [
      "Systems discipline can unlock value before major capex is deployed.",
      "Operations become scalable when accountability is visible.",
      "Clear reporting shortens the distance between issue and action.",
    ],
  },
  {
    title: "Repositioning Dated Inventory for Today's Design-Conscious Buyers",
    slug: "repositioning-dated-inventory-for-todays-design-conscious-buyers",
    category: "FIX_FLIP",
    overview:
      "Buyer expectations shift faster than many legacy homes do. This project focused on updating dated finishes and awkward presentation choices so the home would feel relevant, practical, and market-ready to modern buyers.",
    businessPlan:
      "Selectively update the highest-visibility spaces, remove distracting design choices, and create a cleaner, more contemporary presentation that supports a confident listing launch.",
    execution:
      "The renovation concentrated on kitchen detailing, bath refreshes, paint, lighting, flooring continuity, and staging decisions that made the home feel brighter and more cohesive.",
    outcomeSummary:
      "The refreshed product narrowed buyer objections, improved perceived move-in readiness, and strengthened the home's position within its competitive set.",
    assetProfile: [
      { label: "Asset Type", value: "Suburban resale home" },
      { label: "Buyer Segment", value: "Design-conscious families" },
      { label: "Scope", value: "Selective cosmetic update" },
      { label: "Sales Objective", value: "Faster absorption" },
    ],
    takeaways: [
      "Dated finishes can suppress demand even in strong neighborhoods.",
      "Buyers reward homes that feel ready, bright, and coherent.",
      "Focused scope beats scattered spending in cosmetic updates.",
    ],
  },
  {
    title: "From Acquisition to Acceleration: Building Durable Long-Term Returns",
    slug: "from-acquisition-to-acceleration-building-durable-long-term-returns",
    category: "VALUE_ADD_MULTIFAMILY",
    overview:
      "This case study ties the entire playbook together: disciplined acquisition, practical renovation scope, resident-centered operations, and a clear plan to convert early wins into durable long-term returns.",
    businessPlan:
      "Buy with a margin of safety, underwrite realistic operational improvements, prioritize resident experience, and create multiple future options through disciplined execution rather than speculative assumptions.",
    execution:
      "Underwriting, renovation planning, leasing strategy, vendor coordination, and reporting rhythms were aligned from day one so the property could transition smoothly from acquisition to stabilization.",
    outcomeSummary:
      "The asset delivered stronger occupancy, healthier revenue quality, and a more resilient long-term hold profile supported by both operational and physical improvements.",
    assetProfile: [
      { label: "Asset Type", value: "Value-add portfolio asset" },
      { label: "Investment Lens", value: "Durable long-term returns" },
      { label: "Execution Model", value: "Acquisition to stabilization" },
      { label: "Primary Outcome", value: "Improved resilience" },
    ],
    takeaways: [
      "The best returns are often built through discipline, not drama.",
      "Execution quality compounds across every phase of ownership.",
      "A durable asset plan protects upside while reducing avoidable risk.",
    ],
  },
] as const;

async function seedHomePage() {
  await prisma.homePage.upsert({
    where: { id: homePageSeed.id },
    update: {
      heroHeadline: homePageSeed.heroHeadline,
      heroSubheadline: homePageSeed.heroSubheadline,
      heroPrimaryCtaLabel: homePageSeed.heroPrimaryCtaLabel,
      heroPrimaryCtaHref: homePageSeed.heroPrimaryCtaHref,
      heroSecondaryCtaLabel: homePageSeed.heroSecondaryCtaLabel,
      heroSecondaryCtaHref: homePageSeed.heroSecondaryCtaHref,
      metricsDisclaimer: homePageSeed.metricsDisclaimer,
      portfolioValueDisplay: homePageSeed.portfolioValueDisplay,
      portfolioCaption: homePageSeed.portfolioCaption,
    },
    create: {
      id: homePageSeed.id,
      heroHeadline: homePageSeed.heroHeadline,
      heroSubheadline: homePageSeed.heroSubheadline,
      heroPrimaryCtaLabel: homePageSeed.heroPrimaryCtaLabel,
      heroPrimaryCtaHref: homePageSeed.heroPrimaryCtaHref,
      heroSecondaryCtaLabel: homePageSeed.heroSecondaryCtaLabel,
      heroSecondaryCtaHref: homePageSeed.heroSecondaryCtaHref,
      metricsDisclaimer: homePageSeed.metricsDisclaimer,
      portfolioValueDisplay: homePageSeed.portfolioValueDisplay,
      portfolioCaption: homePageSeed.portfolioCaption,
    },
  });

  await prisma.homeMetric.deleteMany({ where: { homePageId: homePageSeed.id } });
  await prisma.homeSegment.deleteMany({ where: { homePageId: homePageSeed.id } });
  await prisma.homePlatformCard.deleteMany({ where: { homePageId: homePageSeed.id } });
  await prisma.homeCaseHighlight.deleteMany({ where: { homePageId: homePageSeed.id } });
  await prisma.homeTestimonial.deleteMany({ where: { homePageId: homePageSeed.id } });

  await prisma.homeMetric.createMany({
    data: homePageSeed.metrics.map((metric, index) => ({
      homePageId: homePageSeed.id,
      metricValue: metric.metricValue,
      metricLabel: metric.metricLabel,
      sortOrder: index,
    })),
  });

  await prisma.homeSegment.createMany({
    data: homePageSeed.segments.map((segment, index) => ({
      homePageId: homePageSeed.id,
      title: segment.title,
      body: segment.body,
      ctaLabel: segment.ctaLabel,
      ctaHref: segment.ctaHref,
      sortOrder: index,
    })),
  });

  await prisma.homePlatformCard.createMany({
    data: homePageSeed.platformCards.map((card, index) => ({
      homePageId: homePageSeed.id,
      title: card.title,
      body: card.body,
      ctaLabel: card.ctaLabel,
      ctaHref: card.ctaHref,
      sortOrder: index,
    })),
  });

  await prisma.homeCaseHighlight.createMany({
    data: homePageSeed.caseHighlights.map((highlight, index) => ({
      homePageId: homePageSeed.id,
      title: highlight.title,
      body: highlight.body,
      ctaLabel: highlight.ctaLabel,
      ctaHref: highlight.ctaHref,
      sortOrder: index,
    })),
  });

  await prisma.homeTestimonial.createMany({
    data: homePageSeed.testimonials.map((testimonial, index) => ({
      homePageId: homePageSeed.id,
      name: testimonial.name,
      city: testimonial.city,
      quote: testimonial.quote,
      avatarUrl: testimonial.avatarUrl ?? undefined,
      sortOrder: index,
    })),
  });
}

async function seedSingletonPages() {
  for (const page of singletonPageSeed) {
    const current = await prisma.singletonPage.upsert({
      where: { key: page.key as never },
      update: {
        routePath: page.routePath,
        pageTitle: page.pageTitle,
        intro: page.intro ?? undefined,
        disclaimer: page.disclaimer ?? undefined,
        ctaLabel: page.ctaLabel ?? undefined,
        ctaHref: page.ctaHref ?? undefined,
        lifecycleStatus: "PUBLISHED",
      },
      create: {
        key: page.key as never,
        routePath: page.routePath,
        pageTitle: page.pageTitle,
        intro: page.intro ?? undefined,
        disclaimer: page.disclaimer ?? undefined,
        ctaLabel: page.ctaLabel ?? undefined,
        ctaHref: page.ctaHref ?? undefined,
        lifecycleStatus: "PUBLISHED",
      },
    });

    await prisma.singletonPageItem.deleteMany({ where: { pageId: current.id } });
    if (page.items.length) {
      await prisma.singletonPageItem.createMany({
        data: page.items.map((item, index) => ({
          pageId: current.id,
          groupKey: item.groupKey,
          title: item.title,
          body: item.body ?? undefined,
          ctaLabel: item.ctaLabel ?? undefined,
          ctaHref: item.ctaHref ?? undefined,
          sortOrder: index,
        })),
      });
    }
  }
}

async function seedForms() {
  for (const form of formDefinitionsSeed) {
    const current = await prisma.formDefinition.upsert({
      where: { slug: form.slug },
      update: {
        formName: form.formName,
        destination: form.destination as never,
        successMessage: form.successMessage,
        isActive: true,
      },
      create: {
        slug: form.slug,
        formName: form.formName,
        destination: form.destination as never,
        successMessage: form.successMessage,
        isActive: true,
      },
    });

    await prisma.formField.deleteMany({ where: { formDefinitionId: current.id } });
    await prisma.formField.createMany({
      data: form.fields.map((field, index) => ({
        formDefinitionId: current.id,
        fieldKey: field.fieldKey,
        label: field.label,
        type: field.type as never,
        required: field.required,
        sortOrder: index,
      })),
    });
  }
}

async function seedAdminProfiles() {
  for (const email of env.adminAllowedEmails) {
    await prisma.adminProfile.upsert({
      where: { email },
      update: { isActive: true },
      create: {
        email,
        isActive: true,
      },
    });
  }
}

async function seedCaseStudies() {
  for (const caseStudy of [...caseStudySeed].reverse()) {
    const current = await prisma.caseStudy.upsert({
      where: { slug: caseStudy.slug },
      update: {
        title: caseStudy.title,
        lifecycleStatus: "PUBLISHED",
        category: caseStudy.category,
        overview: caseStudy.overview,
        businessPlan: caseStudy.businessPlan,
        execution: caseStudy.execution,
        outcomeSummary: caseStudy.outcomeSummary,
      },
      create: {
        title: caseStudy.title,
        slug: caseStudy.slug,
        lifecycleStatus: "PUBLISHED",
        category: caseStudy.category,
        overview: caseStudy.overview,
        businessPlan: caseStudy.businessPlan,
        execution: caseStudy.execution,
        outcomeSummary: caseStudy.outcomeSummary,
      },
    });

    await prisma.caseStudyAssetProfile.deleteMany({ where: { caseStudyId: current.id } });
    await prisma.caseStudyTakeaway.deleteMany({ where: { caseStudyId: current.id } });

    await prisma.caseStudyAssetProfile.createMany({
      data: caseStudy.assetProfile.map((item, index) => ({
        caseStudyId: current.id,
        label: item.label,
        value: item.value,
        sortOrder: index,
      })),
    });

    await prisma.caseStudyTakeaway.createMany({
      data: caseStudy.takeaways.map((takeaway, index) => ({
        caseStudyId: current.id,
        takeaway,
        sortOrder: index,
      })),
    });
  }
}

async function main() {
  await seedHomePage();
  await seedSingletonPages();
  await seedForms();
  await seedAdminProfiles();
  await seedCaseStudies();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
