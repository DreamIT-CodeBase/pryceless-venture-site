import { prisma } from "@/lib/prisma";

export const getDashboardCounts = async () => {
  const [properties, investments, caseStudies, calculators, forms, submissions] =
    await Promise.all([
      prisma.property.count(),
      prisma.investment.count(),
      prisma.caseStudy.count(),
      prisma.calculator.count(),
      prisma.formDefinition.count(),
      prisma.formSubmission.count(),
    ]);

  return { properties, investments, caseStudies, calculators, forms, submissions };
};

export const getPropertiesAdmin = async () =>
  prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      images: { select: { id: true }, take: 1 },
    },
  });

export const getPropertyAdmin = async (id: string) =>
  prisma.property.findUnique({
    where: { id },
    include: {
      inquiryForm: true,
      highlights: { orderBy: { sortOrder: "asc" } },
      primaryImage: { include: { mediaFile: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        include: { mediaFile: true },
      },
    },
  });

export const getInvestmentsAdmin = async () =>
  prisma.investment.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      images: { select: { id: true }, take: 1 },
    },
  });

export const getInvestmentAdmin = async (id: string) =>
  prisma.investment.findUnique({
    where: { id },
    include: {
      dealPacketForm: true,
      highlights: { orderBy: { sortOrder: "asc" } },
      primaryImage: { include: { mediaFile: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        include: { mediaFile: true },
      },
    },
  });

export const getCaseStudiesAdmin = async () =>
  prisma.caseStudy.findMany({
    orderBy: { updatedAt: "desc" },
  });

export const getCaseStudyAdmin = async (id: string) =>
  prisma.caseStudy.findUnique({
    where: { id },
    include: {
      assetProfile: { orderBy: { sortOrder: "asc" } },
      takeaways: { orderBy: { sortOrder: "asc" } },
    },
  });

export const getCalculatorsAdmin = async () =>
  prisma.calculator.findMany({
    orderBy: { updatedAt: "desc" },
  });

export const getCalculatorAdmin = async (id: string) =>
  prisma.calculator.findUnique({
    where: { id },
  });

export const getHomePageAdmin = async () =>
  prisma.homePage.findUnique({
    where: { id: "home" },
    include: {
      metrics: { orderBy: { sortOrder: "asc" } },
      segments: { orderBy: { sortOrder: "asc" } },
      platformCards: { orderBy: { sortOrder: "asc" } },
      caseHighlights: { orderBy: { sortOrder: "asc" } },
      testimonials: { orderBy: { sortOrder: "asc" } },
    },
  });

export const getSingletonPagesAdmin = async () =>
  prisma.singletonPage.findMany({
    orderBy: { routePath: "asc" },
    include: {
      items: { orderBy: [{ groupKey: "asc" }, { sortOrder: "asc" }] },
    },
  });

export const getSingletonPageAdmin = async (key: string) =>
  prisma.singletonPage.findUnique({
    where: { key: key as never },
    include: {
      items: { orderBy: [{ groupKey: "asc" }, { sortOrder: "asc" }] },
    },
  });

export const getFormsAdmin = async () =>
  prisma.formDefinition.findMany({
    orderBy: { formName: "asc" },
    include: {
      fields: { orderBy: { sortOrder: "asc" } },
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });

export const getFormAdmin = async (id: string) =>
  prisma.formDefinition.findUnique({
    where: { id },
    include: {
      fields: { orderBy: { sortOrder: "asc" } },
    },
  });

export const getFormSubmissionsAdmin = async () =>
  prisma.formSubmission.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      formDefinition: true,
      values: { orderBy: { sortOrder: "asc" } },
    },
  });

export const getFormsForSelect = async () =>
  prisma.formDefinition.findMany({
    orderBy: { formName: "asc" },
    select: {
      id: true,
      formName: true,
      slug: true,
    },
  });
