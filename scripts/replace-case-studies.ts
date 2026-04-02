import "dotenv/config";

import { BlobServiceClient } from "@azure/storage-blob";

import { env } from "../lib/env";
import { createPrismaClient } from "../lib/prisma-factory";
import { slugify } from "../lib/utils";

type Category = "VALUE_ADD_MULTIFAMILY" | "TURNAROUND" | "FIX_FLIP" | "OTHER";

type Seed = {
  title: string;
  category: Category;
  imageId: string;
  imageAlt: string;
  photographer: string;
  overview: string;
  businessPlan: string;
  execution: string;
  outcomeSummary: string;
  assetProfile: Array<[string, string]>;
  takeaways: string[];
};

const seeds: Seed[] = [
  {
    title: "Stabilizing a Sunbelt Workforce Housing Community",
    category: "VALUE_ADD_MULTIFAMILY",
    imageId: "1iGG6k4Ci4E",
    imageAlt: "Apartment building exterior with balconies during the day",
    photographer: "toan chu",
    overview:
      "This acquisition offered upside through cleaner operations, stronger resident communication, and light capital work rather than a flashy repositioning story.",
    businessPlan:
      "Improve curb appeal, standardize turns, and tighten collections and renewals so the asset could stabilize without disrupting the resident base.",
    execution:
      "The team refreshed exteriors first, rolled out repeatable finish packages, and introduced a tighter operating rhythm around maintenance and leasing.",
    outcomeSummary:
      "Occupancy and delinquency improved, and the property became a steadier long-term hold with a healthier rent roll.",
    assetProfile: [
      ["Asset Type", "32-unit workforce housing"],
      ["Market", "Sunbelt suburban corridor"],
      ["Hold Strategy", "Stabilize and refinance"],
      ["Primary Lever", "Operations plus light capex"],
    ],
    takeaways: [
      "Consistency often matters more than dramatic renovation.",
      "Visible care improvements reshape resident sentiment quickly.",
      "Operational discipline is a value-creation strategy.",
    ],
  },
  {
    title: "Transit-Corridor Multifamily Repositioning With Under-Market Rents",
    category: "VALUE_ADD_MULTIFAMILY",
    imageId: "lB954xOGKzI",
    imageAlt: "Modern apartment building exterior with balconies and blue sky",
    photographer: "Markus Winkler",
    overview:
      "A well-located apartment asset was under-rented and under-presented despite having strong demand around it.",
    businessPlan:
      "Close the gap with measured upgrades, sharper leasing presentation, and rent moves tied to real product delivery instead of aggressive assumptions.",
    execution:
      "Updated flooring, lighting, paint, signage, and leasing follow-up helped the property compete with better-run inventory nearby.",
    outcomeSummary:
      "Leasing velocity improved and the asset repositioned into a more resilient corridor performer.",
    assetProfile: [
      ["Asset Type", "Garden-style apartments"],
      ["Demand Driver", "Transit access"],
      ["Revenue Strategy", "Measured rent lift"],
      ["Execution Window", "14 months"],
    ],
    takeaways: [
      "Under-market rents only matter when execution closes the gap.",
      "Small upgrades compound when standards are consistent.",
      "Location performs best when operations stop fighting the asset.",
    ],
  },
  {
    title: "Resident-Focused Turns That Lifted Renewal Rates",
    category: "VALUE_ADD_MULTIFAMILY",
    imageId: "BxbFVcFbO1g",
    imageAlt: "Apartment building exterior lit in the evening",
    photographer: "Clifford",
    overview:
      "The property had good fundamentals but weak resident experience because turns and service quality were inconsistent.",
    businessPlan:
      "Improve the basics, reduce avoidable turnover, and use common-area refreshes to reinforce a more reliable operating standard.",
    execution:
      "The team simplified turn scopes, refreshed shared spaces, and brought renewal outreach forward to reduce unnecessary move-outs.",
    outcomeSummary:
      "Renewal retention improved and the asset shifted from reactive management to a calmer operating pattern.",
    assetProfile: [
      ["Asset Type", "28-unit multifamily"],
      ["Core Objective", "Renewal retention"],
      ["Capital Focus", "Turns and common areas"],
      ["Performance Lens", "Stability over spikes"],
    ],
    takeaways: [
      "Retention is one of the strongest forms of value creation.",
      "Residents notice consistency before marketing claims.",
      "Operational calm improves both margin and reputation.",
    ],
  },
  {
    title: "Scaling a 24-Unit Portfolio With Centralized Operations",
    category: "VALUE_ADD_MULTIFAMILY",
    imageId: "TM8EBHfK0AE",
    imageAlt: "Modern apartment building exterior in an urban setting",
    photographer: "Brother Yoon",
    overview:
      "A small clustered portfolio was underperforming because each property operated like an island with different standards and vendors.",
    businessPlan:
      "Centralize reporting, align turns and service standards, and manage the group like one platform instead of separate addresses.",
    execution:
      "Vendor coordination, review cadence, and turn standards were unified so recurring issues could be solved once across the portfolio.",
    outcomeSummary:
      "Margin leakage narrowed and ownership gained better visibility into how the entire portfolio was performing.",
    assetProfile: [
      ["Asset Type", "24-unit small portfolio"],
      ["Market Pattern", "Clustered neighborhood assets"],
      ["Primary Lever", "Centralized operations"],
      ["Strategic Goal", "Scalable management"],
    ],
    takeaways: [
      "Small portfolios gain value when they operate as one system.",
      "Visibility is a profit lever.",
      "Standardization frees teams to focus on real exceptions.",
    ],
  },
  {
    title: "Recovering Occupancy in a Mismanaged Rental Community",
    category: "TURNAROUND",
    imageId: "1AKgDqrNfxA",
    imageAlt: "Residential building exterior with balconies illuminated at night",
    photographer: "Taha Malik",
    overview:
      "Good neighborhood fundamentals were being wasted by weak leasing discipline, slow follow-up, and sloppy presentation.",
    businessPlan:
      "Restore confidence first with better responsiveness, visible cleanup, and tighter control over available units and leasing flow.",
    execution:
      "Lighting, signage, exterior presentation, and weekly operating reviews reset how the property showed up in the market.",
    outcomeSummary:
      "Occupancy recovered and the asset regained enough credibility to compete with stronger nearby alternatives.",
    assetProfile: [
      ["Asset Type", "Suburban rental community"],
      ["Challenge", "Occupancy decline"],
      ["Turnaround Focus", "Leasing plus presentation"],
      ["Measured Win", "Recovered conversion rate"],
    ],
    takeaways: [
      "Leasing discipline is often the first fix in a turnaround.",
      "Presentation and speed shape occupancy more than expected.",
      "Recovery plans need visible wins early.",
    ],
  },
  {
    title: "Resetting Vendor Discipline in a Mid-Sized Residential Asset",
    category: "TURNAROUND",
    imageId: "rYsyHhnwuvE",
    imageAlt: "Residential building exterior in daylight",
    photographer: "Andreea Avramescu",
    overview:
      "The real drag on this property was not demand but vendor inconsistency, poor service timing, and weak accountability.",
    businessPlan:
      "Rebuild service standards, make quality visible, and tighten reporting so recurring failures stop compounding into resident frustration.",
    execution:
      "Vendor scopes, maintenance reviews, and response expectations were rewritten around measurable standards and faster escalation.",
    outcomeSummary:
      "Resident complaints fell and operating conversations shifted from anecdotal frustration to visible execution.",
    assetProfile: [
      ["Asset Type", "Mid-sized residential building"],
      ["Primary Issue", "Vendor inconsistency"],
      ["Turnaround Lever", "Service accountability"],
      ["Objective", "Operational predictability"],
    ],
    takeaways: [
      "Vendor quality is part of the asset.",
      "Operational fog suppresses performance.",
      "Clear standards reduce both cost leakage and friction.",
    ],
  },
  {
    title: "Townhome Block Turnaround With Faster Leasing",
    category: "TURNAROUND",
    imageId: "1lVHc5aJEgk",
    imageAlt: "Townhouse style residential exterior",
    photographer: "Tina Dawson",
    overview:
      "A row of townhomes was losing time and income because turns were slow, finish choices were inconsistent, and leasing lacked process.",
    businessPlan:
      "Compress vacancy downtime with simpler scopes, better sequencing, and sharper showing readiness across the block.",
    execution:
      "Turn packages were narrowed to the highest-impact items while vendor sequencing and showing readiness were tightened.",
    outcomeSummary:
      "Downtime narrowed and the townhome block regained a more professional market presence.",
    assetProfile: [
      ["Asset Type", "Townhome rental block"],
      ["Pain Point", "Slow unit turns"],
      ["Strategy", "Turnaround execution"],
      ["Key Metric", "Days vacant reduced"],
    ],
    takeaways: [
      "Turn speed is usually a systems problem first.",
      "Simple finish standards beat scattered customization.",
      "Availability loses value when showing readiness is poor.",
    ],
  },
  {
    title: "Restoring Curb Appeal to Rebuild Market Confidence",
    category: "TURNAROUND",
    imageId: "coqmBSuXOE4",
    imageAlt: "Modern house exterior with warm lighting",
    photographer: "Eli Chamoun",
    overview:
      "The asset was functionally fine but visually undercutting itself, which made it feel riskier than it actually was to buyers and renters.",
    businessPlan:
      "Use a practical exterior refresh to align first impressions with the actual quality of the property inside.",
    execution:
      "Exterior cleanup, lighting, pathways, and landscaping were tightened so the product felt more intentional from the first photo onward.",
    outcomeSummary:
      "Showing confidence improved and presentation-related objections fell sharply.",
    assetProfile: [
      ["Asset Type", "Single-family turnaround"],
      ["Focus Area", "Exterior presentation"],
      ["Goal", "Confidence restoration"],
      ["Exit Lens", "Lease-up or resale"],
    ],
    takeaways: [
      "Presentation can drag value even when the asset is sound.",
      "Curb appeal is a pricing signal.",
      "Trust starts before prospects walk inside.",
    ],
  },
  {
    title: "Modernizing a Dated Family Home for Faster Resale",
    category: "FIX_FLIP",
    imageId: "eWOgoFHlE8g",
    imageAlt: "Modern house exterior with large windows and garden",
    photographer: "Jean-Philippe Delberghe",
    overview:
      "The home had good bones and a strong neighborhood, but dated finishes and weak light were suppressing buyer excitement.",
    businessPlan:
      "Target the highest-visibility updates and create a cleaner, brighter version of the product buyers already wanted.",
    execution:
      "Paint, flooring continuity, lighting, and selective kitchen and bath updates were delivered with a restrained palette.",
    outcomeSummary:
      "The home returned to market with stronger visual clarity and a much better competitive position.",
    assetProfile: [
      ["Asset Type", "Single-family fix and flip"],
      ["Core Objective", "Broader buyer appeal"],
      ["Design Lens", "Light and cohesion"],
      ["Timeline", "5 months"],
    ],
    takeaways: [
      "Most flip value comes from solving friction.",
      "Finish consistency makes ordinary homes feel newer.",
      "A clear buyer avatar prevents overspending.",
    ],
  },
  {
    title: "Kitchen-First Renovation That Protected Margin",
    category: "FIX_FLIP",
    imageId: "QbdgGRQOHdM",
    imageAlt: "Modern kitchen and living room interior",
    photographer: "Pryce Wilson",
    overview:
      "This flip focused spend where buyers look hardest instead of stretching budget evenly across every room.",
    businessPlan:
      "Let the kitchen and living zone carry the design story while keeping secondary rooms clean, simple, and margin-friendly.",
    execution:
      "Cabinetry, counters, lighting, and adjacent living finishes were coordinated into one clear visual system.",
    outcomeSummary:
      "Buyer response improved quickly and the home read like a more expensive product without losing cost control.",
    assetProfile: [
      ["Asset Type", "Design-led flip"],
      ["Primary Room", "Kitchen and living area"],
      ["Budget Strategy", "Concentrated spend"],
      ["Resale Goal", "Higher perceived quality"],
    ],
    takeaways: [
      "Concentrated scope often beats evenly distributed spending.",
      "The kitchen can carry the value story of the whole listing.",
      "Margin improves when every dollar has a job.",
    ],
  },
  {
    title: "Dining and Flow Upgrades That Reframed Buyer Perception",
    category: "FIX_FLIP",
    imageId: "mPPL5rAOZsQ",
    imageAlt: "Modern dining room and kitchen area",
    photographer: "R ARCHITECTURE",
    overview:
      "The home was not short on square footage, but buyers struggled to understand how the core living spaces fit together.",
    businessPlan:
      "Improve flow and finish continuity so the property would photograph better, tour better, and feel easier to live in.",
    execution:
      "Lighting, palette simplification, and furniture planning were used to make the kitchen, dining, and living areas read as one story.",
    outcomeSummary:
      "Buyer conversations shifted from layout concern to livability and the home competed more effectively.",
    assetProfile: [
      ["Asset Type", "Owner-occupant flip"],
      ["Design Goal", "Better everyday flow"],
      ["Intervention Type", "Selective interior update"],
      ["Sales Lens", "Improved touring experience"],
    ],
    takeaways: [
      "Flow is a value driver even when walls stay put.",
      "Buyers respond to clarity before they respond to luxury.",
      "A better floor-plan story can unlock demand without major cost.",
    ],
  },
  {
    title: "Bedroom, Light, and Finish Refresh for a Stronger Launch",
    category: "FIX_FLIP",
    imageId: "rHTodQO-2Jk",
    imageAlt: "Bright white bedroom interior with wood floors",
    photographer: "R ARCHITECTURE",
    overview:
      "The house did not need a full redesign. It needed brighter light, calmer finishes, and better presentation in the rooms buyers judge most emotionally.",
    businessPlan:
      "Refresh the most comfort-driven spaces so the home would feel cleaner, more current, and easier to say yes to.",
    execution:
      "Bedroom and adjacent interior finishes were simplified around brighter tones, cleaner textures, and better staging decisions.",
    outcomeSummary:
      "The listing launched with stronger photography and fewer objections around condition and readiness.",
    assetProfile: [
      ["Asset Type", "Suburban resale renovation"],
      ["Primary Focus", "Comfort and presentation"],
      ["Scope", "Cosmetic refresh"],
      ["Market Goal", "Stronger launch positioning"],
    ],
    takeaways: [
      "Not every good flip needs a dramatic transformation.",
      "Bedroom presentation influences overall quality perception.",
      "A composed interior helps listings feel more trustworthy.",
    ],
  },
];

const prisma = createPrismaClient();
const blobs = BlobServiceClient.fromConnectionString(env.azureStorageConnectionString);
const container = blobs.getContainerClient(env.azureContainerName);

const contentTypeToExt = (contentType: string) => {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/avif") return "avif";
  return "jpg";
};

const downloadImage = async (seed: Seed) => {
  const response = await fetch(
    `https://unsplash.com/photos/${seed.imageId}/download?force=true&w=1600`,
    {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed downloading image for "${seed.title}" (${response.status})`);
  }

  const contentType = (response.headers.get("content-type") ?? "image/jpeg")
    .split(";")[0]
    .trim()
    .toLowerCase();
  const ext = contentTypeToExt(contentType);
  const fileName = `${slugify(seed.title)}.${ext}`;
  const buffer = Buffer.from(await response.arrayBuffer());

  return new File([buffer], fileName, { type: contentType });
};

const uploadImage = async (file: File, seed: Seed) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const blobPath = `case-studies/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const client = container.getBlockBlobClient(blobPath);

  await client.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: file.type || "application/octet-stream",
    },
  });

  const media = await prisma.mediaFile.create({
    data: {
      blobUrl: client.url,
      blobPath,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSize: buffer.byteLength,
      altText: seed.imageAlt,
      metadata: JSON.stringify({
        provider: "Unsplash",
        photographer: seed.photographer,
        sourcePageUrl: `https://unsplash.com/photos/${seed.imageId}`,
        seededBy: "scripts/replace-case-studies.ts",
      }),
    },
  });

  return { blobPath, mediaFileId: media.id };
};

const deleteBlobIfExists = async (blobPath: string) => {
  try {
    await container.deleteBlob(blobPath);
  } catch {
    // ignore cleanup failures
  }
};

async function main() {
  await container.createIfNotExists({ access: "blob" });

  const uploaded: Array<{ blobPath: string; mediaFileId: string }> = [];

  try {
    for (const seed of seeds) {
      console.log(`Preparing case study: ${seed.title}`);
      const file = await downloadImage(seed);
      uploaded.push(await uploadImage(file, seed));
    }

    const existingImages = await prisma.caseStudyImage.findMany({
      select: {
        mediaFileId: true,
      },
    });

    const oldMedia = await prisma.mediaFile.findMany({
      where: {
        id: {
          in: existingImages.map((item) => item.mediaFileId),
        },
        propertyImages: { none: {} },
        investmentImages: { none: {} },
      },
      select: {
        id: true,
        blobPath: true,
      },
    });

    await prisma.caseStudy.updateMany({ data: { primaryImageId: null } });
    await prisma.caseStudyImage.deleteMany();
    await prisma.caseStudyAssetProfile.deleteMany();
    await prisma.caseStudyTakeaway.deleteMany();
    await prisma.caseStudy.deleteMany();

    if (oldMedia.length) {
      await prisma.mediaFile.deleteMany({
        where: {
          id: { in: oldMedia.map((item) => item.id) },
          propertyImages: { none: {} },
          investmentImages: { none: {} },
          caseStudyImages: { none: {} },
        },
      });
    }

    for (const [index, seed] of seeds.entries()) {
      const caseStudy = await prisma.caseStudy.create({
        data: {
          title: seed.title,
          slug: slugify(seed.title),
          lifecycleStatus: "PUBLISHED",
          category: seed.category,
          overview: seed.overview,
          businessPlan: seed.businessPlan,
          execution: seed.execution,
          outcomeSummary: seed.outcomeSummary,
        },
      });

      await prisma.caseStudyAssetProfile.createMany({
        data: seed.assetProfile.map(([label, value], sortOrder) => ({
          caseStudyId: caseStudy.id,
          label,
          value,
          sortOrder,
        })),
      });

      await prisma.caseStudyTakeaway.createMany({
        data: seed.takeaways.map((takeaway, sortOrder) => ({
          caseStudyId: caseStudy.id,
          takeaway,
          sortOrder,
        })),
      });

      const image = await prisma.caseStudyImage.create({
        data: {
          caseStudyId: caseStudy.id,
          mediaFileId: uploaded[index].mediaFileId,
          altText: seed.imageAlt,
          sortOrder: 0,
        },
      });

      await prisma.caseStudy.update({
        where: { id: caseStudy.id },
        data: {
          primaryImageId: image.id,
        },
      });
    }

    for (const media of oldMedia) {
      await deleteBlobIfExists(media.blobPath);
    }

    console.log(`Replaced case studies successfully. New total: ${seeds.length}`);
  } catch (error) {
    for (const media of uploaded) {
      await deleteBlobIfExists(media.blobPath);
    }

    if (uploaded.length) {
      await prisma.mediaFile.deleteMany({
        where: {
          id: { in: uploaded.map((item) => item.mediaFileId) },
          propertyImages: { none: {} },
          investmentImages: { none: {} },
          caseStudyImages: { none: {} },
        },
      });
    }

    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
