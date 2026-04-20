const fs = require('fs');
let content = fs.readFileSync('components/admin/loan-program-form.tsx', 'utf8');

const targetStr = `        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
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
        </div>`;

const replacementStr = `        {/* Basic Details & Hero */}
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <div className="mb-6 border-b border-slate-200/60 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">Basic Details &amp; Hero</h3>
            <p className="mt-1 text-sm text-slate-500">Controls the main hero banner and program visibility.</p>
          </div>
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
              <span className="mb-2 block text-sm font-medium text-slate-700">CRM Tag</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.crmTag ?? ""}
                name="crmTag"
                placeholder="fix-flip"
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

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Image Alt Text</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.imageAlt ?? ""}
                name="imageAlt"
                placeholder="Fix and flip loan program"
              />
            </label>

            <div className="md:col-span-2">
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
        </div>

        {/* Core Underwriting Snapshot */}
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <div className="mb-6 border-b border-slate-200/60 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">Core Underwriting Snapshot</h3>
            <p className="mt-1 text-sm text-slate-500">Key pricing and terms that appear in the right-side summary card.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Starting Interest Rate</span>
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
          </div>
        </div>

        {/* Overview & Descriptions */}
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <div className="mb-6 border-b border-slate-200/60 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">Overview &amp; Descriptions</h3>
            <p className="mt-1 text-sm text-slate-500">Populates the left-side Loan Overview paragraphs.</p>
          </div>
          <div className="grid gap-5">
            <label className="block">
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

            <label className="block">
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
          </div>
        </div>

        {/* Program Highlights */}
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/50">
          <div className="mb-6 border-b border-slate-200/60 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">Program Highlights</h3>
            <p className="mt-1 text-sm text-slate-500">Populates the bulleted list under "Why Investors Choose..."</p>
          </div>
          <div className="grid gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Key Highlights</span>
              <textarea
                className="min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3"
                defaultValue={loanProgram?.keyHighlights ?? ""}
                name="keyHighlights"
                placeholder="One highlight per line"
              />
            </label>
          </div>
        </div>`;

if (content.includes('Starting Interest Rate') && !content.includes('Core Underwriting Snapshot')) {
  // Fix Windows line endings just in case
  const safeTargetStr = targetStr.replace(/\r\n/g, '\n');
  const safeContent = content.replace(/\r\n/g, '\n');
  const result = safeContent.replace(safeTargetStr, replacementStr);
  fs.writeFileSync('components/admin/loan-program-form.tsx', result);
  console.log('Replaced successfully');
} else {
  console.log('Target string not found or already replaced.');
}
