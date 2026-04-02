IF COL_LENGTH('dbo.HomePage', 'aboutSectionTitle') IS NULL
BEGIN
    ALTER TABLE [dbo].[HomePage] ADD
        [aboutSectionTitle] NVARCHAR(1000),
        [aboutSectionParagraphOne] NVARCHAR(max),
        [aboutSectionParagraphTwo] NVARCHAR(max),
        [aboutSectionPrimaryCtaLabel] NVARCHAR(1000),
        [aboutSectionPrimaryCtaHref] NVARCHAR(1000),
        [aboutSectionSecondaryCtaLabel] NVARCHAR(1000),
        [aboutSectionSecondaryCtaHref] NVARCHAR(1000),
        [aboutSectionImageUrl] NVARCHAR(2000),
        [aboutSectionImageAlt] NVARCHAR(1000);
END;
