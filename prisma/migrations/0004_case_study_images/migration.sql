ALTER TABLE [dbo].[CaseStudy] ADD [primaryImageId] NVARCHAR(1000);

CREATE TABLE [dbo].[CaseStudyImage] (
    [id] NVARCHAR(1000) NOT NULL,
    [caseStudyId] NVARCHAR(1000) NOT NULL,
    [mediaFileId] NVARCHAR(1000) NOT NULL,
    [caption] NVARCHAR(MAX),
    [altText] NVARCHAR(1000),
    [sortOrder] INT NOT NULL CONSTRAINT [CaseStudyImage_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CaseStudyImage_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CaseStudyImage_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [CaseStudyImage_caseStudyId_mediaFileId_key] UNIQUE NONCLUSTERED ([caseStudyId], [mediaFileId])
);

CREATE NONCLUSTERED INDEX [CaseStudyImage_caseStudyId_sortOrder_idx] ON [dbo].[CaseStudyImage]([caseStudyId], [sortOrder]);

ALTER TABLE [dbo].[CaseStudy] ADD CONSTRAINT [CaseStudy_primaryImageId_fkey]
FOREIGN KEY ([primaryImageId]) REFERENCES [dbo].[CaseStudyImage]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE [dbo].[CaseStudyImage] ADD CONSTRAINT [CaseStudyImage_caseStudyId_fkey]
FOREIGN KEY ([caseStudyId]) REFERENCES [dbo].[CaseStudy]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE [dbo].[CaseStudyImage] ADD CONSTRAINT [CaseStudyImage_mediaFileId_fkey]
FOREIGN KEY ([mediaFileId]) REFERENCES [dbo].[MediaFile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;
