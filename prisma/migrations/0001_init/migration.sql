BEGIN TRY

BEGIN TRAN;

-- CreateSchema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'dbo') EXEC sp_executesql N'CREATE SCHEMA [dbo];';

-- CreateTable
CREATE TABLE [dbo].[AdminProfile] (
    [id] NVARCHAR(1000) NOT NULL,
    [azureAdId] NVARCHAR(1000),
    [email] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [avatarUrl] NVARCHAR(1000),
    [isActive] BIT NOT NULL CONSTRAINT [AdminProfile_isActive_df] DEFAULT 1,
    [lastLoginAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AdminProfile_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [AdminProfile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AdminProfile_azureAdId_key] UNIQUE NONCLUSTERED ([azureAdId]),
    CONSTRAINT [AdminProfile_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[HomePage] (
    [id] NVARCHAR(1000) NOT NULL,
    [heroHeadline] NVARCHAR(1000) NOT NULL,
    [heroSubheadline] NVARCHAR(max) NOT NULL,
    [heroPrimaryCtaLabel] NVARCHAR(1000) NOT NULL,
    [heroPrimaryCtaHref] NVARCHAR(1000) NOT NULL,
    [heroSecondaryCtaLabel] NVARCHAR(1000),
    [heroSecondaryCtaHref] NVARCHAR(1000),
    [metricsDisclaimer] NVARCHAR(max),
    [portfolioValueDisplay] NVARCHAR(1000),
    [portfolioCaption] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [HomePage_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [HomePage_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[HomeMetric] (
    [id] NVARCHAR(1000) NOT NULL,
    [homePageId] NVARCHAR(1000) NOT NULL,
    [metricValue] NVARCHAR(1000) NOT NULL,
    [metricLabel] NVARCHAR(1000) NOT NULL,
    [sortOrder] INT NOT NULL CONSTRAINT [HomeMetric_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [HomeMetric_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [HomeMetric_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[HomeSegment] (
    [id] NVARCHAR(1000) NOT NULL,
    [homePageId] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [body] NVARCHAR(max) NOT NULL,
    [ctaLabel] NVARCHAR(1000) NOT NULL,
    [ctaHref] NVARCHAR(1000) NOT NULL,
    [sortOrder] INT NOT NULL CONSTRAINT [HomeSegment_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [HomeSegment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [HomeSegment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[HomePlatformCard] (
    [id] NVARCHAR(1000) NOT NULL,
    [homePageId] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [body] NVARCHAR(max) NOT NULL,
    [ctaLabel] NVARCHAR(1000) NOT NULL,
    [ctaHref] NVARCHAR(1000) NOT NULL,
    [sortOrder] INT NOT NULL CONSTRAINT [HomePlatformCard_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [HomePlatformCard_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [HomePlatformCard_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[HomeCaseHighlight] (
    [id] NVARCHAR(1000) NOT NULL,
    [homePageId] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [body] NVARCHAR(max) NOT NULL,
    [ctaLabel] NVARCHAR(1000) NOT NULL,
    [ctaHref] NVARCHAR(1000) NOT NULL,
    [sortOrder] INT NOT NULL CONSTRAINT [HomeCaseHighlight_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [HomeCaseHighlight_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [HomeCaseHighlight_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SingletonPage] (
    [id] NVARCHAR(1000) NOT NULL,
    [key] NVARCHAR(1000) NOT NULL,
    [routePath] NVARCHAR(1000) NOT NULL,
    [pageTitle] NVARCHAR(1000) NOT NULL,
    [intro] NVARCHAR(max),
    [disclaimer] NVARCHAR(max),
    [ctaLabel] NVARCHAR(1000),
    [ctaHref] NVARCHAR(1000),
    [lifecycleStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [SingletonPage_lifecycleStatus_df] DEFAULT 'PUBLISHED',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SingletonPage_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [SingletonPage_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SingletonPage_key_key] UNIQUE NONCLUSTERED ([key]),
    CONSTRAINT [SingletonPage_routePath_key] UNIQUE NONCLUSTERED ([routePath])
);

-- CreateTable
CREATE TABLE [dbo].[SingletonPageItem] (
    [id] NVARCHAR(1000) NOT NULL,
    [pageId] NVARCHAR(1000) NOT NULL,
    [groupKey] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [body] NVARCHAR(max),
    [ctaLabel] NVARCHAR(1000),
    [ctaHref] NVARCHAR(1000),
    [sortOrder] INT NOT NULL CONSTRAINT [SingletonPageItem_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SingletonPageItem_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [SingletonPageItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[MediaFile] (
    [id] NVARCHAR(1000) NOT NULL,
    [blobUrl] NVARCHAR(1000) NOT NULL,
    [blobPath] NVARCHAR(1000) NOT NULL,
    [fileName] NVARCHAR(1000) NOT NULL,
    [mimeType] NVARCHAR(1000) NOT NULL,
    [fileSize] INT,
    [altText] NVARCHAR(1000),
    [metadata] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [MediaFile_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [MediaFile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [MediaFile_blobPath_key] UNIQUE NONCLUSTERED ([blobPath])
);

-- CreateTable
CREATE TABLE [dbo].[Property] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [lifecycleStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [Property_lifecycleStatus_df] DEFAULT 'DRAFT',
    [status] NVARCHAR(1000) NOT NULL,
    [locationCity] NVARCHAR(1000),
    [locationState] NVARCHAR(1000),
    [propertyType] NVARCHAR(1000) NOT NULL,
    [strategy] NVARCHAR(1000) NOT NULL,
    [summary] NVARCHAR(max) NOT NULL,
    [buyerFit] NVARCHAR(max),
    [inquiryFormId] NVARCHAR(1000),
    [primaryImageId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Property_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Property_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Property_slug_key] UNIQUE NONCLUSTERED ([slug]),
    CONSTRAINT [Property_primaryImageId_key] UNIQUE NONCLUSTERED ([primaryImageId])
);

-- CreateTable
CREATE TABLE [dbo].[PropertyHighlight] (
    [id] NVARCHAR(1000) NOT NULL,
    [propertyId] NVARCHAR(1000) NOT NULL,
    [highlight] NVARCHAR(1000) NOT NULL,
    [sortOrder] INT NOT NULL CONSTRAINT [PropertyHighlight_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [PropertyHighlight_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PropertyHighlight_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PropertyImage] (
    [id] NVARCHAR(1000) NOT NULL,
    [propertyId] NVARCHAR(1000) NOT NULL,
    [mediaFileId] NVARCHAR(1000) NOT NULL,
    [caption] NVARCHAR(max),
    [altText] NVARCHAR(1000),
    [sortOrder] INT NOT NULL CONSTRAINT [PropertyImage_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [PropertyImage_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PropertyImage_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PropertyImage_propertyId_mediaFileId_key] UNIQUE NONCLUSTERED ([propertyId],[mediaFileId])
);

-- CreateTable
CREATE TABLE [dbo].[Investment] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [lifecycleStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [Investment_lifecycleStatus_df] DEFAULT 'DRAFT',
    [status] NVARCHAR(1000) NOT NULL,
    [assetType] NVARCHAR(1000) NOT NULL,
    [strategy] NVARCHAR(1000) NOT NULL,
    [summary] NVARCHAR(max) NOT NULL,
    [minimumInvestmentDisplay] NVARCHAR(1000),
    [returnsDisclaimer] NVARCHAR(max),
    [dealPacketFormId] NVARCHAR(1000),
    [primaryImageId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Investment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Investment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Investment_slug_key] UNIQUE NONCLUSTERED ([slug]),
    CONSTRAINT [Investment_primaryImageId_key] UNIQUE NONCLUSTERED ([primaryImageId])
);

-- CreateTable
CREATE TABLE [dbo].[InvestmentHighlight] (
    [id] NVARCHAR(1000) NOT NULL,
    [investmentId] NVARCHAR(1000) NOT NULL,
    [highlight] NVARCHAR(1000) NOT NULL,
    [sortOrder] INT NOT NULL CONSTRAINT [InvestmentHighlight_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [InvestmentHighlight_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [InvestmentHighlight_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[InvestmentImage] (
    [id] NVARCHAR(1000) NOT NULL,
    [investmentId] NVARCHAR(1000) NOT NULL,
    [mediaFileId] NVARCHAR(1000) NOT NULL,
    [caption] NVARCHAR(max),
    [altText] NVARCHAR(1000),
    [sortOrder] INT NOT NULL CONSTRAINT [InvestmentImage_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [InvestmentImage_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [InvestmentImage_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InvestmentImage_investmentId_mediaFileId_key] UNIQUE NONCLUSTERED ([investmentId],[mediaFileId])
);

-- CreateTable
CREATE TABLE [dbo].[CaseStudy] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [lifecycleStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [CaseStudy_lifecycleStatus_df] DEFAULT 'DRAFT',
    [category] NVARCHAR(1000) NOT NULL,
    [overview] NVARCHAR(max) NOT NULL,
    [businessPlan] NVARCHAR(max) NOT NULL,
    [execution] NVARCHAR(max) NOT NULL,
    [outcomeSummary] NVARCHAR(max) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CaseStudy_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [CaseStudy_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [CaseStudy_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[CaseStudyAssetProfile] (
    [id] NVARCHAR(1000) NOT NULL,
    [caseStudyId] NVARCHAR(1000) NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    [value] NVARCHAR(1000) NOT NULL,
    [sortOrder] INT NOT NULL CONSTRAINT [CaseStudyAssetProfile_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CaseStudyAssetProfile_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CaseStudyAssetProfile_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CaseStudyTakeaway] (
    [id] NVARCHAR(1000) NOT NULL,
    [caseStudyId] NVARCHAR(1000) NOT NULL,
    [takeaway] NVARCHAR(1000) NOT NULL,
    [sortOrder] INT NOT NULL CONSTRAINT [CaseStudyTakeaway_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CaseStudyTakeaway_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CaseStudyTakeaway_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Calculator] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [lifecycleStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [Calculator_lifecycleStatus_df] DEFAULT 'DRAFT',
    [calculatorType] NVARCHAR(1000) NOT NULL,
    [shortDescription] NVARCHAR(max),
    [disclaimer] NVARCHAR(max) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Calculator_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Calculator_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Calculator_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[FormDefinition] (
    [id] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [formName] NVARCHAR(1000) NOT NULL,
    [destination] NVARCHAR(1000) NOT NULL,
    [successMessage] NVARCHAR(max) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [FormDefinition_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [FormDefinition_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [FormDefinition_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FormDefinition_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[FormField] (
    [id] NVARCHAR(1000) NOT NULL,
    [formDefinitionId] NVARCHAR(1000) NOT NULL,
    [fieldKey] NVARCHAR(1000) NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [required] BIT NOT NULL CONSTRAINT [FormField_required_df] DEFAULT 0,
    [placeholder] NVARCHAR(1000),
    [sortOrder] INT NOT NULL CONSTRAINT [FormField_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [FormField_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [FormField_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FormField_formDefinitionId_fieldKey_key] UNIQUE NONCLUSTERED ([formDefinitionId],[fieldKey])
);

-- CreateTable
CREATE TABLE [dbo].[FormSubmission] (
    [id] NVARCHAR(1000) NOT NULL,
    [formDefinitionId] NVARCHAR(1000) NOT NULL,
    [submitterName] NVARCHAR(1000),
    [submitterEmail] NVARCHAR(1000),
    [submitterPhone] NVARCHAR(1000),
    [sourcePath] NVARCHAR(1000),
    [submissionEmailStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [FormSubmission_submissionEmailStatus_df] DEFAULT 'PENDING',
    [emailError] NVARCHAR(max),
    [submittedAt] DATETIME2 NOT NULL CONSTRAINT [FormSubmission_submittedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [FormSubmission_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FormSubmissionValue] (
    [id] NVARCHAR(1000) NOT NULL,
    [submissionId] NVARCHAR(1000) NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    [value] NVARCHAR(max) NOT NULL,
    [sortOrder] INT NOT NULL CONSTRAINT [FormSubmissionValue_sortOrder_df] DEFAULT 0,
    CONSTRAINT [FormSubmissionValue_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [HomeMetric_homePageId_sortOrder_idx] ON [dbo].[HomeMetric]([homePageId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [HomeSegment_homePageId_sortOrder_idx] ON [dbo].[HomeSegment]([homePageId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [HomePlatformCard_homePageId_sortOrder_idx] ON [dbo].[HomePlatformCard]([homePageId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [HomeCaseHighlight_homePageId_sortOrder_idx] ON [dbo].[HomeCaseHighlight]([homePageId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SingletonPageItem_pageId_groupKey_sortOrder_idx] ON [dbo].[SingletonPageItem]([pageId], [groupKey], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Property_lifecycleStatus_createdAt_idx] ON [dbo].[Property]([lifecycleStatus], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [PropertyHighlight_propertyId_sortOrder_idx] ON [dbo].[PropertyHighlight]([propertyId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [PropertyImage_propertyId_sortOrder_idx] ON [dbo].[PropertyImage]([propertyId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Investment_lifecycleStatus_createdAt_idx] ON [dbo].[Investment]([lifecycleStatus], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [InvestmentHighlight_investmentId_sortOrder_idx] ON [dbo].[InvestmentHighlight]([investmentId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [InvestmentImage_investmentId_sortOrder_idx] ON [dbo].[InvestmentImage]([investmentId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CaseStudy_lifecycleStatus_createdAt_idx] ON [dbo].[CaseStudy]([lifecycleStatus], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CaseStudyAssetProfile_caseStudyId_sortOrder_idx] ON [dbo].[CaseStudyAssetProfile]([caseStudyId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CaseStudyTakeaway_caseStudyId_sortOrder_idx] ON [dbo].[CaseStudyTakeaway]([caseStudyId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Calculator_lifecycleStatus_createdAt_idx] ON [dbo].[Calculator]([lifecycleStatus], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FormField_formDefinitionId_sortOrder_idx] ON [dbo].[FormField]([formDefinitionId], [sortOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FormSubmission_formDefinitionId_submittedAt_idx] ON [dbo].[FormSubmission]([formDefinitionId], [submittedAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [FormSubmissionValue_submissionId_sortOrder_idx] ON [dbo].[FormSubmissionValue]([submissionId], [sortOrder]);

-- AddForeignKey
ALTER TABLE [dbo].[HomeMetric] ADD CONSTRAINT [HomeMetric_homePageId_fkey] FOREIGN KEY ([homePageId]) REFERENCES [dbo].[HomePage]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HomeSegment] ADD CONSTRAINT [HomeSegment_homePageId_fkey] FOREIGN KEY ([homePageId]) REFERENCES [dbo].[HomePage]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HomePlatformCard] ADD CONSTRAINT [HomePlatformCard_homePageId_fkey] FOREIGN KEY ([homePageId]) REFERENCES [dbo].[HomePage]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[HomeCaseHighlight] ADD CONSTRAINT [HomeCaseHighlight_homePageId_fkey] FOREIGN KEY ([homePageId]) REFERENCES [dbo].[HomePage]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SingletonPageItem] ADD CONSTRAINT [SingletonPageItem_pageId_fkey] FOREIGN KEY ([pageId]) REFERENCES [dbo].[SingletonPage]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Property] ADD CONSTRAINT [Property_inquiryFormId_fkey] FOREIGN KEY ([inquiryFormId]) REFERENCES [dbo].[FormDefinition]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Property] ADD CONSTRAINT [Property_primaryImageId_fkey] FOREIGN KEY ([primaryImageId]) REFERENCES [dbo].[PropertyImage]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PropertyHighlight] ADD CONSTRAINT [PropertyHighlight_propertyId_fkey] FOREIGN KEY ([propertyId]) REFERENCES [dbo].[Property]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PropertyImage] ADD CONSTRAINT [PropertyImage_mediaFileId_fkey] FOREIGN KEY ([mediaFileId]) REFERENCES [dbo].[MediaFile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PropertyImage] ADD CONSTRAINT [PropertyImage_propertyId_fkey] FOREIGN KEY ([propertyId]) REFERENCES [dbo].[Property]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Investment] ADD CONSTRAINT [Investment_dealPacketFormId_fkey] FOREIGN KEY ([dealPacketFormId]) REFERENCES [dbo].[FormDefinition]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Investment] ADD CONSTRAINT [Investment_primaryImageId_fkey] FOREIGN KEY ([primaryImageId]) REFERENCES [dbo].[InvestmentImage]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InvestmentHighlight] ADD CONSTRAINT [InvestmentHighlight_investmentId_fkey] FOREIGN KEY ([investmentId]) REFERENCES [dbo].[Investment]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvestmentImage] ADD CONSTRAINT [InvestmentImage_mediaFileId_fkey] FOREIGN KEY ([mediaFileId]) REFERENCES [dbo].[MediaFile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvestmentImage] ADD CONSTRAINT [InvestmentImage_investmentId_fkey] FOREIGN KEY ([investmentId]) REFERENCES [dbo].[Investment]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CaseStudyAssetProfile] ADD CONSTRAINT [CaseStudyAssetProfile_caseStudyId_fkey] FOREIGN KEY ([caseStudyId]) REFERENCES [dbo].[CaseStudy]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CaseStudyTakeaway] ADD CONSTRAINT [CaseStudyTakeaway_caseStudyId_fkey] FOREIGN KEY ([caseStudyId]) REFERENCES [dbo].[CaseStudy]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FormField] ADD CONSTRAINT [FormField_formDefinitionId_fkey] FOREIGN KEY ([formDefinitionId]) REFERENCES [dbo].[FormDefinition]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FormSubmission] ADD CONSTRAINT [FormSubmission_formDefinitionId_fkey] FOREIGN KEY ([formDefinitionId]) REFERENCES [dbo].[FormDefinition]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FormSubmissionValue] ADD CONSTRAINT [FormSubmissionValue_submissionId_fkey] FOREIGN KEY ([submissionId]) REFERENCES [dbo].[FormSubmission]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
