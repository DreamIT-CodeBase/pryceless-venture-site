import { ExternalFormEmbed } from "@/components/forms/external-form-embed";

const DEAL_INTAKE_FORM_ID = "wCO4WhRLizJ24c5jri3x";
const DEAL_INTAKE_FORM_TITLE = "Deal Intake – Step 1";

type LoanDealIntakeEmbedProps = {
  className?: string;
};

export function LoanDealIntakeEmbed({
  className = "",
}: LoanDealIntakeEmbedProps) {
  return (
    <ExternalFormEmbed
      borderRadius={18}
      className={className}
      formId={DEAL_INTAKE_FORM_ID}
      formName={DEAL_INTAKE_FORM_TITLE}
      height={940}
      src={`https://media.prycelessventures.com/widget/form/${DEAL_INTAKE_FORM_ID}`}
      title={DEAL_INTAKE_FORM_TITLE}
    />
  );
}
