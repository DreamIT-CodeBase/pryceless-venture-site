import Link from "next/link";

import { autosaveInvestmentDraft, deleteInvestment, saveInvestment } from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";
import { ImageManager } from "@/components/admin/image-manager";
import {
  investmentAssetTypeOptions,
  investmentStatusOptions,
  investmentStrategyOptions,
} from "@/lib/content-blueprint";

type InvestmentFormProps = {
  investment?: any;
  forms: Array<{ id: string; formName: string; slug: string }>;
  errorMessage?: string;
};

export function InvestmentForm({ investment, forms, errorMessage }: InvestmentFormProps) {
  const images =
    investment?.images?.map((image: any) => ({
      mediaFileId: image.mediaFileId,
      blobUrl: image.mediaFile.blobUrl,
      fileName: image.mediaFile.fileName,
      altText: image.altText ?? image.mediaFile.altText ?? "",
      caption: image.caption ?? "",
    })) ?? [];

  return (
    <div className="space-y-6">
      <AdminAutosaveForm
        autosaveAction={autosaveInvestmentDraft}
        className="space-y-6"
        initialRecordId={investment?.id ?? ""}
        submitAction={saveInvestment}
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
              <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={investment?.title ?? ""} minLength={2} name="title" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Investment Status</span>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={investment?.status ?? "COMING_SOON"} name="status">
                {investmentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Asset Type</span>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={investment?.assetType ?? "MULTIFAMILY"} name="assetType">
                {investmentAssetTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Strategy</span>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={investment?.strategy ?? "VALUE_ADD"} name="strategy">
                {investmentStrategyOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Deal Packet Form</span>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={investment?.dealPacketFormId ?? ""} name="dealPacketFormId">
                <option value="">No form selected</option>
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>{form.formName}</option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Summary</span>
              <textarea className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={investment?.summary ?? ""} minLength={10} name="summary" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Minimum Investment Display</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={investment?.minimumInvestmentDisplay ?? ""} name="minimumInvestmentDisplay" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Returns Disclaimer</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={investment?.returnsDisclaimer ?? ""} name="returnsDisclaimer" />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Highlights</span>
              <textarea className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={investment?.highlights?.map((item: any) => item.highlight).join("\n") ?? ""} name="highlightsText" placeholder="One highlight per line" />
            </label>
          </div>
        </div>

        <ImageManager
          folder="investments"
          initialImages={images}
          initialPrimaryMediaFileId={investment?.primaryImage?.mediaFileId}
          name="imagesPayload"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" name="intent" type="submit" value="draft">Save Draft</button>
          <button className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white" name="intent" type="submit" value="publish">Publish</button>
          <button className="rounded-full border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800" name="intent" type="submit" value="archive">Archive</button>
          <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" href="/admin/investments">Back to List</Link>
        </div>
      </AdminAutosaveForm>

      {investment?.id ? (
        <form action={deleteInvestment}>
          <input name="recordId" type="hidden" value={investment.id} />
          <button className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700" type="submit">
            Delete Investment
          </button>
        </form>
      ) : null}
    </div>
  );
}
