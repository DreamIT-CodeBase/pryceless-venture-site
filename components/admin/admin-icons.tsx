type IconProps = {
  className?: string;
};

const sharedProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.9,
  viewBox: "0 0 24 24",
};

export function AdminHomeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

export function AdminBuildingIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M4.5 20V8.5L12 4l7.5 4.5V20" />
      <path d="M9 20v-4h6v4" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
    </svg>
  );
}

export function AdminInvestmentIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M4 18h16" />
      <path d="M7 18V9" />
      <path d="M12 18V6" />
      <path d="M17 18v-4" />
      <path d="m6 8 5-4 5 3 3-2" />
    </svg>
  );
}

export function AdminCaseStudyIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M7 5.5h7l4 4V18.5A1.5 1.5 0 0 1 16.5 20h-9A1.5 1.5 0 0 1 6 18.5v-11A2 2 0 0 1 8 5.5Z" />
      <path d="M14 5.5v4h4" />
      <path d="M9 12h6" />
      <path d="M9 15h6" />
    </svg>
  );
}

export function AdminBlogIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <rect height="14" rx="2.5" width="14" x="5" y="5" />
      <path d="M8.5 9h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 15h4.5" />
    </svg>
  );
}

export function AdminCalculatorIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <rect height="16" rx="2.5" width="12" x="6" y="4" />
      <path d="M9 8h6" />
      <path d="M9 12h.01" />
      <path d="M12 12h.01" />
      <path d="M15 12h.01" />
      <path d="M9 15h.01" />
      <path d="M12 15h.01" />
      <path d="M15 15h.01" />
    </svg>
  );
}

export function AdminPagesIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <rect height="14" rx="2.5" width="12" x="6" y="5" />
      <path d="M10 9h4" />
      <path d="M10 12h4" />
      <path d="M10 15h4" />
    </svg>
  );
}

export function AdminFormsIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M8 6h8" />
      <path d="M8 12h8" />
      <path d="M8 18h8" />
      <path d="M5 6h.01" />
      <path d="M5 12h.01" />
      <path d="M5 18h.01" />
    </svg>
  );
}

export function AdminSubmissionsIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M4 6h16v12H4z" />
      <path d="m4 8 8 5 8-5" />
    </svg>
  );
}

export function AdminBookIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M6.5 5.5h9A2.5 2.5 0 0 1 18 8v10.5h-9A2.5 2.5 0 0 0 6.5 21" />
      <path d="M6.5 5.5A2.5 2.5 0 0 0 4 8v10.5" />
      <path d="M8.5 9h6" />
      <path d="M8.5 12h6" />
    </svg>
  );
}

export function AdminCreateIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <path d="M6 6h4" />
    </svg>
  );
}

export function AdminDocumentIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M7.5 4.5h6l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6.5 19V6A1.5 1.5 0 0 1 8 4.5Z" />
      <path d="M13.5 4.5v4h4" />
      <path d="M9 12h6" />
      <path d="M9 15h6" />
    </svg>
  );
}

export function AdminGlobeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.5 2.3 4 5.3 4 8.5s-1.5 6.2-4 8.5c-2.5-2.3-4-5.3-4-8.5s1.5-6.2 4-8.5Z" />
    </svg>
  );
}

export function AdminMoonIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M16.8 15.5A6.8 6.8 0 0 1 8.5 7.2a7.4 7.4 0 1 0 8.3 8.3Z" />
    </svg>
  );
}

export function AdminHelpIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9a2.6 2.6 0 1 1 4.2 2.1c-.9.7-1.7 1.2-1.7 2.4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function AdminChevronDownIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

export function AdminArrowRightIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function AdminSparkIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...sharedProps}>
      <path d="M12 4.5 13.8 9l4.7 1.8-4.7 1.8L12 17l-1.8-4.4L5.5 10.8 10.2 9 12 4.5Z" />
    </svg>
  );
}
