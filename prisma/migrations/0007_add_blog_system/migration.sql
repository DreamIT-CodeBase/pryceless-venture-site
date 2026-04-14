CREATE TABLE [dbo].[BlogPost] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [lifecycleStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [BlogPost_lifecycleStatus_df] DEFAULT 'DRAFT',
    [category] NVARCHAR(1000) NOT NULL,
    [excerpt] NVARCHAR(MAX) NOT NULL,
    [content] NVARCHAR(MAX) NOT NULL,
    [authorName] NVARCHAR(1000),
    [readTime] NVARCHAR(1000),
    [featuredImageUrl] NVARCHAR(2000),
    [featuredImageAlt] NVARCHAR(1000),
    [publishedAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [BlogPost_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [BlogPost_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [BlogPost_slug_key] UNIQUE NONCLUSTERED ([slug])
);

CREATE NONCLUSTERED INDEX [BlogPost_lifecycleStatus_publishedAt_updatedAt_idx]
ON [dbo].[BlogPost]([lifecycleStatus], [publishedAt], [updatedAt]);
