UPDATE [dbo].[HomeSegment]
SET
    [ctaHref] = '/investments',
    [ctaLabel] = 'View Opportunities'
WHERE [ctaHref] = '/capital-rates';

UPDATE [dbo].[HomePlatformCard]
SET
    [ctaHref] = '/investments',
    [ctaLabel] = 'View Opportunities'
WHERE [ctaHref] = '/capital-rates';

UPDATE [dbo].[HomeCaseHighlight]
SET
    [ctaHref] = '/case-studies',
    [ctaLabel] = 'See Case Studies'
WHERE [ctaHref] = '/capital-rates';

UPDATE [dbo].[HomePage]
SET
    [heroPrimaryCtaHref] = '/investments',
    [heroPrimaryCtaLabel] = 'View Opportunities'
WHERE [heroPrimaryCtaHref] = '/capital-rates';

UPDATE [dbo].[HomePage]
SET
    [heroSecondaryCtaHref] = '/cash-offer',
    [heroSecondaryCtaLabel] = 'Get a Cash Offer'
WHERE [heroSecondaryCtaHref] = '/capital-rates';

UPDATE [dbo].[HomePage]
SET
    [aboutSectionPrimaryCtaHref] = '/investments',
    [aboutSectionPrimaryCtaLabel] = 'View Opportunities'
WHERE [aboutSectionPrimaryCtaHref] = '/capital-rates';

UPDATE [dbo].[HomePage]
SET
    [aboutSectionSecondaryCtaHref] = '/cash-offer',
    [aboutSectionSecondaryCtaLabel] = 'Get a Cash Offer'
WHERE [aboutSectionSecondaryCtaHref] = '/capital-rates';

DECLARE @FundingFormId NVARCHAR(1000);

SELECT @FundingFormId = [id]
FROM [dbo].[FormDefinition]
WHERE [slug] = 'funding-info-request';

IF @FundingFormId IS NOT NULL
BEGIN
    DELETE [fsv]
    FROM [dbo].[FormSubmissionValue] AS [fsv]
    INNER JOIN [dbo].[FormSubmission] AS [fs]
        ON [fs].[id] = [fsv].[submissionId]
    WHERE [fs].[formDefinitionId] = @FundingFormId;

    DELETE FROM [dbo].[FormSubmission]
    WHERE [formDefinitionId] = @FundingFormId;

    DELETE FROM [dbo].[FormField]
    WHERE [formDefinitionId] = @FundingFormId;

    DELETE FROM [dbo].[FormDefinition]
    WHERE [id] = @FundingFormId;
END;

DELETE FROM [dbo].[SingletonPage]
WHERE [key] = 'CAPITAL_RATES';
