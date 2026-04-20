const fs = require('fs');
let content = fs.readFileSync('app/admin/forms/page.tsx', 'utf8');

// Add imports
if (!content.includes('deleteFormDefinition')) {
  content = content.replace(
    'import { AdminShell }',
    'import { deleteFormDefinition } from "@/app/admin/actions";\nimport { AdminShell }'
  );
}
if (!content.includes('SubmitButton')) {
  content = content.replace(
    'import { AdminStatusPill } from "@/components/admin/status-pill";',
    'import { AdminStatusPill } from "@/components/admin/status-pill";\nimport { SubmitButton } from "@/components/admin/submit-button";'
  );
}

// Add th for Actions
if (!content.includes('<th className="px-6 py-4 text-right font-medium">Actions</th>')) {
  content = content.replace(
    '<th className="px-6 py-4 font-medium">Submissions</th>',
    '<th className="px-6 py-4 font-medium">Submissions</th>\n              <th className="px-6 py-4 text-right font-medium">Actions</th>'
  );
}

// Add td for Actions
if (!content.includes('<td className="px-6 py-4">\n                  <div className="flex items-center justify-end gap-2">')) {
  content = content.replace(
    '<td className="px-6 py-4 text-slate-600">{form._count.submissions}</td>',
    '<td className="px-6 py-4 text-slate-600">{form._count.submissions}</td>\n                <td className="px-6 py-4">\n                  <div className="flex items-center justify-end gap-2">\n                    <Link\n                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"\n                      href={`/admin/forms/${form.id}`}\n                    >\n                      Edit\n                    </Link>\n                    <form action={deleteFormDefinition}>\n                      <input name="recordId" type="hidden" value={form.id} />\n                      <SubmitButton className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100">\n                        Delete\n                      </SubmitButton>\n                    </form>\n                  </div>\n                </td>'
  );
}

fs.writeFileSync('app/admin/forms/page.tsx', content);
