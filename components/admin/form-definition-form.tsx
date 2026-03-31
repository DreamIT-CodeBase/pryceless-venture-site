import Link from "next/link";

import { autosaveFormDefinitionDraft, saveFormDefinition } from "@/app/admin/actions";
import { AdminAutosaveForm } from "@/components/admin/admin-autosave-form";

export function FormDefinitionForm({ form, errorMessage }: { form: any; errorMessage?: string }) {
  return (
    <AdminAutosaveForm
      autosaveAction={autosaveFormDefinitionDraft}
      className="space-y-6"
      initialRecordId={form.id}
      submitAction={saveFormDefinition}
    >
      {errorMessage ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Form Name</span><input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={form.formName ?? ""} minLength={2} name="formName" required /></label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Destination</span>
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" defaultValue={form.destination} name="destination">
              <option value="EMAIL">Email</option>
              <option value="CRM">CRM</option>
              <option value="BOTH">Both</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
            <input defaultChecked={form.isActive} name="isActive" type="checkbox" />
            Form is active
          </label>
          <label className="block md:col-span-2"><span className="mb-2 block text-sm font-medium text-slate-700">Success Message</span><textarea className="min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" defaultValue={form.successMessage ?? ""} minLength={5} name="successMessage" required /></label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Fields</span>
            <textarea
              className="min-h-40 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
              defaultValue={form.fields?.map((field: any) => `${field.fieldKey} | ${field.label} | ${field.type} | ${field.required}`).join("\n") ?? ""}
              name="fieldsText"
              placeholder="field_key | Label | TYPE | true"
            />
          </label>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">Save Form</button>
        <Link className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700" href="/admin/forms">Back to Forms</Link>
      </div>
    </AdminAutosaveForm>
  );
}
