export const resolvePrimaryImage = <
  T extends {
    primaryImage?: { mediaFile?: { blobUrl: string | null } | null } | null;
    images?: Array<{ mediaFile?: { blobUrl: string | null } | null }>;
  },
>(
  entity: T,
) => entity.primaryImage?.mediaFile?.blobUrl || entity.images?.[0]?.mediaFile?.blobUrl || null;
