import Link from "next/link";

import { autosavePropertyDraft, deleteProperty, saveProperty } from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";
import { ImageManager } from "@/components/admin/image-manager";
import { propertyStrategyOptions, propertyTypeOptions } from "@/lib/content-blueprint";
import {
  formatPropertyStandoutItemsForEditor,
  formatPropertyStringListForEditor,
  parsePropertyDetailContent,
} from "@/lib/property-detail-content";
import { getPropertyEditorStatus, propertyStatusOptions } from "@/lib/property-portfolio";

type PropertyFormProps = {
  property?: any;
  forms: Array<{ id: string; formName: string; slug: string }>;
  errorMessage?: string;
};

export function PropertyForm({ property, forms, errorMessage }: PropertyFormProps) {
  const detailContent = parsePropertyDetailContent(property?.detailContent);
  const images =
    property?.images?.map((image: any) => ({
      mediaFileId: image.mediaFileId,
      blobUrl: image.mediaFile.blobUrl,
      fileName: image.mediaFile.fileName,
      altText: image.altText ?? image.mediaFile.altText ?? "",
      caption: image.caption ?? "",
    })) ?? [];

  return (
    <div className="space-y-6">
      <AdminAutosaveForm
        autosaveAction={autosavePropertyDraft}
        className="space-y-6"
        initialRecordId={property?.id ?? ""}
        submitAction={saveProperty}
      >
        {errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={property?.title ?? ""}
                minLength={2}
                name="title"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Portfolio Stage</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={getPropertyEditorStatus(property?.status)}
                name="status"
              >
                {propertyStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="mt-2 block text-xs leading-5 text-slate-500">
                Use <span className="font-semibold text-slate-700">For Sale</span> for active inventory,
                <span className="font-semibold text-slate-700"> Sold</span> for completed deals that show
                execution results, and <span className="font-semibold text-slate-700">In Progress</span> for
                rehab projects receiving ongoing updates.
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Property Type</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={property?.propertyType ?? "SFR"}
                name="propertyType"
              >
                {propertyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Strategy</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={property?.strategy ?? "FIX_FLIP"}
                name="strategy"
              >
                {propertyStrategyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Location City</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={property?.locationCity ?? ""}
                name="locationCity"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Location State</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={property?.locationState ?? ""}
                name="locationState"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Hero Summary</span>
              <textarea
                className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={property?.summary ?? ""}
                minLength={10}
                name="summary"
                required
              />
              <span className="mt-2 block text-xs leading-5 text-slate-500">
                This short summary appears in the hero section and the featured property image callout.
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Investment Overview / Long-form note</span>
              <textarea
                className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={property?.buyerFit ?? ""}
                name="buyerFit"
              />
              <span className="mt-2 block text-xs leading-5 text-slate-500">
                This powers the long narrative section on the slug page and can still hold buyer-fit or execution commentary.
              </span>
            </label>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/70 p-5 md:col-span-2">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="text-base font-semibold text-slate-900">Performance Metrics</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    These populate the top four metric cards on the property slug page.
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">ROI</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    defaultValue={detailContent.performance.roi ?? ""}
                    name="performanceRoi"
                    placeholder="18%"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Cap Rate</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    defaultValue={detailContent.performance.capRate ?? ""}
                    name="performanceCapRate"
                    placeholder="7.2%"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Monthly Cash Flow</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    defaultValue={detailContent.performance.monthlyCashFlow ?? ""}
                    name="performanceMonthlyCashFlow"
                    placeholder="$1,200"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Investment Horizon</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    defaultValue={detailContent.performance.investmentHorizon ?? ""}
                    name="performanceInvestmentHorizon"
                    placeholder="5 Years"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/70 p-5 md:col-span-2">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="text-base font-semibold text-slate-900">Investment Snapshot</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    These values populate the four large snapshot cards below the hero area.
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Purchase Price</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    defaultValue={detailContent.snapshot.purchasePrice ?? ""}
                    name="snapshotPurchasePrice"
                    placeholder="$285,000"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Estimated Rent</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    defaultValue={detailContent.snapshot.estimatedRent ?? ""}
                    name="snapshotEstimatedRent"
                    placeholder="$2,400/mo"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Renovation Cost</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    defaultValue={detailContent.snapshot.renovationCost ?? ""}
                    name="snapshotRenovationCost"
                    placeholder="$45,000"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">ARV</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    defaultValue={detailContent.snapshot.arv ?? ""}
                    name="snapshotArv"
                    placeholder="$365,000"
                  />
                </label>
              </div>
            </div>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Why This Deal Stands Out</span>
              <textarea
                className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={formatPropertyStandoutItemsForEditor(detailContent.standoutItems)}
                name="standoutItemsText"
                placeholder={"One standout card per line.\nStrong Rental Demand | Charlotte MSA shows 14% population growth over 3 years"}
              />
              <span className="mt-2 block text-xs leading-5 text-slate-500">
                Use the format <span className="font-semibold text-slate-700">Title | Description</span>. Up to four cards render on the public page.
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Ideal Investor Profile</span>
              <textarea
                className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={formatPropertyStringListForEditor(detailContent.investorProfile)}
                name="investorProfileText"
                placeholder={"One profile tag per line.\nPassive Income"}
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Prime Location Benefits</span>
              <textarea
                className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={formatPropertyStringListForEditor(detailContent.locationBenefits)}
                name="locationBenefitsText"
                placeholder={"One location benefit per line.\n15 minutes to Uptown Charlotte"}
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Google Maps Link</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={detailContent.googleMapsUrl ?? ""}
                name="googleMapsUrl"
                placeholder="Paste a Google Maps share or embed link"
              />
              <span className="mt-2 block text-xs leading-5 text-slate-500">
                Paste a Google Maps share link, embed link, or even a searchable address. The public page will render it inside the map panel.
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Highlights / Metrics</span>
              <textarea
                className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={property?.highlights?.map((item: any) => item.highlight).join("\n") ?? ""}
                name="highlightsText"
                placeholder={"One item per line. Use Label | Value for snapshot rows.\nPurchase Price | $245,000"}
              />
              <span className="mt-2 block text-xs leading-5 text-slate-500">
                Plain lines become bullets on the public page. Lines written as <span className="font-semibold text-slate-700">Label | Value</span> render as sold underwriting stats or rehab progress snapshot rows.
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Inquiry Form</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={property?.inquiryFormId ?? ""}
                name="inquiryFormId"
              >
                <option value="">No form selected</option>
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.formName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <ImageManager
          folder="properties"
          initialImages={images}
          initialPrimaryMediaFileId={property?.primaryImage?.mediaFileId}
          name="imagesPayload"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" name="intent" type="submit" value="draft">
            Save Draft
          </button>
          <button className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white" name="intent" type="submit" value="publish">
            Publish
          </button>
          <button className="rounded-full border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800" name="intent" type="submit" value="archive">
            Archive
          </button>
          <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" href="/admin/properties">
            Back to List
          </Link>
        </div>
      </AdminAutosaveForm>

      {property?.id ? (
        <form action={deleteProperty}>
          <input name="recordId" type="hidden" value={property.id} />
          <button className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700" type="submit">
            Delete Property
          </button>
        </form>
      ) : null}
    </div>
  );
}
