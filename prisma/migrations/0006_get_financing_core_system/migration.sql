-- CreateTable
CREATE TABLE [dbo].[LoanProgram] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [lifecycleStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [LoanProgram_lifecycleStatus_df] DEFAULT 'DRAFT',
    [shortDescription] NVARCHAR(max) NOT NULL,
    [fullDescription] NVARCHAR(max) NOT NULL,
    [interestRate] NVARCHAR(1000),
    [ltv] NVARCHAR(1000),
    [loanTerm] NVARCHAR(1000),
    [fees] NVARCHAR(max),
    [minAmount] NVARCHAR(1000),
    [maxAmount] NVARCHAR(1000),
    [keyHighlights] NVARCHAR(max),
    [crmTag] NVARCHAR(1000),
    [imageUrl] NVARCHAR(2000),
    [imageAlt] NVARCHAR(1000),
    [isActive] BIT NOT NULL CONSTRAINT [LoanProgram_isActive_df] DEFAULT 1,
    [sortOrder] INT NOT NULL CONSTRAINT [LoanProgram_sortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [LoanProgram_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [LoanProgram_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LoanProgram_slug_key] UNIQUE NONCLUSTERED ([slug])
);

ALTER TABLE [dbo].[FormDefinition]
ADD [webhookUrl] NVARCHAR(2000),
    [linkedLoanProgramId] NVARCHAR(1000);

ALTER TABLE [dbo].[FormField]
ADD [options] NVARCHAR(max);

ALTER TABLE [dbo].[FormSubmission]
ADD [submissionWebhookStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [FormSubmission_submissionWebhookStatus_df] DEFAULT 'SKIPPED',
    [webhookError] NVARCHAR(max);

CREATE NONCLUSTERED INDEX [LoanProgram_lifecycleStatus_isActive_sortOrder_updatedAt_idx]
ON [dbo].[LoanProgram]([lifecycleStatus], [isActive], [sortOrder], [updatedAt]);

ALTER TABLE [dbo].[FormDefinition]
ADD CONSTRAINT [FormDefinition_linkedLoanProgramId_fkey]
FOREIGN KEY ([linkedLoanProgramId]) REFERENCES [dbo].[LoanProgram]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE [dbo].[HomeSegment]
SET
    [ctaHref] = '/get-financing',
    [ctaLabel] = CASE
        WHEN [title] = 'Active Investors' THEN 'View Financing'
        ELSE 'Get Financing'
    END
WHERE [ctaHref] = '/investments';

UPDATE [dbo].[HomePlatformCard]
SET
    [title] = CASE
        WHEN [title] = 'Investments' THEN 'Get Financing'
        ELSE [title]
    END,
    [body] = CASE
        WHEN [ctaHref] = '/investments' THEN 'Loan programs for fix-and-flip, refinance, bridge, and rental strategies.'
        ELSE [body]
    END,
    [ctaHref] = CASE
        WHEN [ctaHref] = '/investments' THEN '/get-financing'
        ELSE [ctaHref]
    END,
    [ctaLabel] = CASE
        WHEN [ctaHref] = '/investments' THEN 'Apply Now'
        ELSE [ctaLabel]
    END
WHERE [ctaHref] = '/investments' OR [title] = 'Investments';

UPDATE [dbo].[HomePage]
SET
    [heroPrimaryCtaHref] = '/get-financing',
    [heroPrimaryCtaLabel] = 'Get Financing'
WHERE [heroPrimaryCtaHref] = '/investments';

UPDATE [dbo].[HomePage]
SET
    [aboutSectionPrimaryCtaHref] = '/get-financing',
    [aboutSectionPrimaryCtaLabel] = 'Get Financing'
WHERE [aboutSectionPrimaryCtaHref] = '/investments';

IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[SingletonPage]
    WHERE [key] = 'GET_FINANCING_INDEX'
)
BEGIN
    INSERT INTO [dbo].[SingletonPage] (
        [id],
        [key],
        [routePath],
        [pageTitle],
        [intro],
        [disclaimer],
        [ctaLabel],
        [ctaHref],
        [lifecycleStatus],
        [createdAt],
        [updatedAt]
    )
    VALUES (
        CONVERT(NVARCHAR(1000), NEWID()),
        'GET_FINANCING_INDEX',
        '/get-financing',
        'Get Financing for Your Real Estate Deals',
        'Explore active lending programs, compare rates and leverage, and move directly into the application flow that fits your deal.',
        'Rates, leverage, and terms are subject to underwriting, asset profile, borrower strength, and current market conditions.',
        'Apply Now',
        '#loan-programs',
        'PUBLISHED',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
END;

IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[SingletonPage]
    WHERE [key] = 'GET_FINANCING_DETAIL'
)
BEGIN
    INSERT INTO [dbo].[SingletonPage] (
        [id],
        [key],
        [routePath],
        [pageTitle],
        [intro],
        [disclaimer],
        [ctaLabel],
        [ctaHref],
        [lifecycleStatus],
        [createdAt],
        [updatedAt]
    )
    VALUES (
        CONVERT(NVARCHAR(1000), NEWID()),
        'GET_FINANCING_DETAIL',
        '/get-financing/[slug]',
        'Loan Program Overview',
        'Review the program overview, underwriting parameters, and financing terms, then apply directly through the matching intake flow.',
        'Illustrative terms shown online do not represent a commitment to lend. Final structure is determined after review and underwriting.',
        'Apply Now',
        '#apply-now',
        'PUBLISHED',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
END;
