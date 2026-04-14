import Link from "next/link";

import {
  autosaveLoanProgramDraft,
  deleteLoanProgram,
  saveLoanProgram,
} from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";
import { ImageUrlField } from "@/components/admin/image-url-field";

type LoanProgramFormProps = {
  errorMessage?: string;
  loanProgram?: any;
};

export function LoanProgramForm({ errorMessage, loanProgram }: LoanProgramFormProps) {
  const usingFallbackStorage = Boolean(loanProgram?.isSeedFallback);

  return (
    <div className="space-y-6">
      <AdminAutosaveForm
        autosaveAction={autosaveLoanProgramDraft}
        className="space-y-6"
        initialRecordId={loanProgram?.id ?? ""}
        submitAction={saveLoanProgram}
      >
        {errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {usingFallbackStorage ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This loan program is using local fallback storage because the financing schema is not
            active in the current database yet. Your edits here will still save and update the site.
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.title ?? ""}
                minLength={2}
                name="title"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Display Order</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.sortOrder ?? 0}
                min={0}
                name="sortOrder"
                step={1}
                type="number"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              <input
                defaultChecked={loanProgram?.isActive ?? true}
                name="isActive"
                type="checkbox"
              />
              Visible on public financing pages
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">CRM Tag</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.crmTag ?? ""}
                name="crmTag"
                placeholder="fix-flip"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Starting Interest Rate
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.interestRate ?? ""}
                name="interestRate"
                placeholder="Starting at 9.75%"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Max LTV / LTC</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.ltv ?? ""}
                name="ltv"
                placeholder="Up to 85% LTC / 70% ARV"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Loan Term</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.loanTerm ?? ""}
                name="loanTerm"
                placeholder="12-18 months"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Fees</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.fees ?? ""}
                name="fees"
                placeholder="Origination from 1.5 points"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Minimum Amount</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.minAmount ?? ""}
                name="minAmount"
                placeholder="$75,000"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Maximum Amount</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.maxAmount ?? ""}
                name="maxAmount"
                placeholder="$3,000,000"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Short Description
              </span>
              <textarea
                className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.shortDescription ?? ""}
                minLength={10}
                name="shortDescription"
                required
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Full Description
              </span>
              <textarea
                className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.fullDescription ?? ""}
                minLength={10}
                name="fullDescription"
                required
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Key Highlights</span>
              <textarea
                className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.keyHighlights ?? ""}
                name="keyHighlights"
                placeholder="One highlight per line"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Image Alt Text</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.imageAlt ?? ""}
                name="imageAlt"
                placeholder="Fix and flip loan program"
              />
            </label>

            <ImageUrlField
              allowManualUrl
              description="Upload the hero or card image used on the Get Financing page and loan detail page."
              folder="loan-programs"
              initialValue={loanProgram?.imageUrl ?? ""}
              label="Program Image"
              name="imageUrl"
              previewAlt={loanProgram?.imageAlt ?? loanProgram?.title ?? "Loan program image"}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <h3 className="text-lg font-semibold text-slate-950">Linked Application Forms</h3>
          <p className="mt-2 text-sm text-slate-500">
            Assign forms from the Forms section. Any active form linked to this loan program will
            power the public Apply Now experience.
          </p>
          <div className="mt-5 space-y-3">
            {loanProgram?.forms?.length ? (
              loanProgram.forms.map((form: any) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  key={form.id}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{form.formName}</p>
                    <p className="text-sm text-slate-500">{form.isActive ? "Active" : "Inactive"}</p>
                  </div>
                  <Link
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                    href={`/admin/forms/${form.id}`}
                  >
                    Edit Form
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                No forms are linked yet. Create or update a form from the Forms section to connect
                it to this program.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            name="intent"
            type="submit"
            value="draft"
          >
            Save Draft
          </button>
          <button
            className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
            name="intent"
            type="submit"
            value="publish"
          >
            Publish
          </button>
          <button
            className="rounded-full border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800"
            name="intent"
            type="submit"
            value="archive"
          >
            Archive
          </button>
          <Link
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
            href="/admin/loan-programs"
          >
            Back to List
          </Link>
        </div>
      </AdminAutosaveForm>

      {loanProgram?.id ? (
        <form action={deleteLoanProgram}>
          <input name="recordId" type="hidden" value={loanProgram.id} />
          <button
            className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700"
            type="submit"
          >
            Delete Loan Program
          </button>
        </form>
      ) : null}
    </div>
  );
}
