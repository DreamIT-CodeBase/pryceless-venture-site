-- CreateTable
CREATE TABLE [dbo].[HomeTestimonial] (
    [id] NVARCHAR(1000) NOT NULL,
    [homePageId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [quote] NVARCHAR(max) NOT NULL,
    [avatarUrl] NVARCHAR(2000),
    [sortOrder] INT NOT NULL CONSTRAINT [HomeTestimonial_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [HomeTestimonial_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [HomeTestimonial_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [HomeTestimonial_homePageId_sortOrder_idx] ON [dbo].[HomeTestimonial]([homePageId], [sortOrder]);

-- AddForeignKey
ALTER TABLE [dbo].[HomeTestimonial] ADD CONSTRAINT [HomeTestimonial_homePageId_fkey] FOREIGN KEY ([homePageId]) REFERENCES [dbo].[HomePage]([id]) ON DELETE CASCADE ON UPDATE CASCADE;
