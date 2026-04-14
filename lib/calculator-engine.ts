export type SupportedCalculatorType = "ROI" | "BRRRR" | "MORTGAGE" | "VALUE_ADD";

export type RoiInputs = {
  annualAppreciationRate: number;
  closingCosts: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  monthlyOperatingExpenses: number;
  monthlyRent: number;
  otherMonthlyIncome: number;
  purchasePrice: number;
  rehabBudget: number;
  vacancyRate: number;
};

export type BrrrrInputs = {
  afterRepairValue: number;
  closingCosts: number;
  downPaymentPercent: number;
  monthlyOperatingExpenses: number;
  monthlyRent: number;
  otherMonthlyIncome: number;
  purchasePrice: number;
  refinanceInterestRate: number;
  refinanceLoanTermYears: number;
  refinanceLtvPercent: number;
  rehabBudget: number;
  vacancyRate: number;
};

export type MortgageInputs = {
  annualInsurance: number;
  annualPropertyTax: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  monthlyHoa: number;
  monthlyPmi: number;
  purchasePrice: number;
};

export type ValueAddInputs = {
  annualOperatingExpensesCurrent: number;
  annualOperatingExpensesStabilized: number;
  annualOtherIncomeCurrent: number;
  annualOtherIncomeStabilized: number;
  avgCurrentRent: number;
  avgStabilizedRent: number;
  currentOccupancyPercent: number;
  exitCapRatePercent: number;
  renovationBudget: number;
  stabilizedOccupancyPercent: number;
  unitCount: number;
};

export type MortgageAmortizationRow = {
  cumulativeInterest: number;
  cumulativePrincipal: number;
  endingBalance: number;
  interestPaid: number;
  payment: number;
  principalPaid: number;
  year: number;
};

export const defaultRoiInputs: RoiInputs = {
  annualAppreciationRate: 3,
  closingCosts: 6000,
  downPaymentPercent: 25,
  interestRate: 7.25,
  loanTermYears: 30,
  monthlyOperatingExpenses: 650,
  monthlyRent: 2400,
  otherMonthlyIncome: 0,
  purchasePrice: 250000,
  rehabBudget: 35000,
  vacancyRate: 5,
};

export const defaultBrrrrInputs: BrrrrInputs = {
  afterRepairValue: 300000,
  closingCosts: 5000,
  downPaymentPercent: 20,
  monthlyOperatingExpenses: 700,
  monthlyRent: 2600,
  otherMonthlyIncome: 0,
  purchasePrice: 180000,
  refinanceInterestRate: 6.75,
  refinanceLoanTermYears: 30,
  refinanceLtvPercent: 75,
  rehabBudget: 40000,
  vacancyRate: 6,
};

export const defaultMortgageInputs: MortgageInputs = {
  annualInsurance: 1800,
  annualPropertyTax: 4200,
  downPaymentPercent: 20,
  interestRate: 6.75,
  loanTermYears: 30,
  monthlyHoa: 0,
  monthlyPmi: 0,
  purchasePrice: 350000,
};

export const defaultValueAddInputs: ValueAddInputs = {
  annualOperatingExpensesCurrent: 95000,
  annualOperatingExpensesStabilized: 102000,
  annualOtherIncomeCurrent: 6000,
  annualOtherIncomeStabilized: 9000,
  avgCurrentRent: 975,
  avgStabilizedRent: 1250,
  currentOccupancyPercent: 88,
  exitCapRatePercent: 6,
  renovationBudget: 325000,
  stabilizedOccupancyPercent: 95,
  unitCount: 16,
};

const toPositive = (value: number) => Math.max(Number.isFinite(value) ? value : 0, 0);
const toPercent = (value: number) => Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), 100);
const safeDivide = (numerator: number, denominator: number) =>
  denominator > 0 ? numerator / denominator : null;

export const calculateMonthlyMortgagePayment = (
  principal: number,
  annualInterestRate: number,
  loanTermYears: number,
) => {
  const sanitizedPrincipal = toPositive(principal);
  const months = Math.max(Math.round(toPositive(loanTermYears) * 12), 1);
  const monthlyRate = toPositive(annualInterestRate) / 100 / 12;

  if (!sanitizedPrincipal) {
    return 0;
  }

  if (!monthlyRate) {
    return sanitizedPrincipal / months;
  }

  const growth = (1 + monthlyRate) ** months;
  return sanitizedPrincipal * ((monthlyRate * growth) / (growth - 1));
};

export const calculateEMI = (
  principal: number,
  annualRate: number,
  years: number,
) => {
  const sanitizedPrincipal = toPositive(principal);
  const months = Math.max(Math.round(toPositive(years) * 12), 1);
  const emi = calculateMonthlyMortgagePayment(sanitizedPrincipal, annualRate, years);
  const totalAmount = emi * months;
  const totalInterest = totalAmount - sanitizedPrincipal;

  return {
    emi: Math.round(emi),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
  };
};

const calculateRemainingBalance = (
  principal: number,
  annualInterestRate: number,
  loanTermYears: number,
  paymentsMade: number,
) => {
  const sanitizedPrincipal = toPositive(principal);
  const months = Math.max(Math.round(toPositive(loanTermYears) * 12), 1);
  const completedPayments = Math.min(Math.max(Math.round(paymentsMade), 0), months);
  const monthlyRate = toPositive(annualInterestRate) / 100 / 12;

  if (!sanitizedPrincipal) {
    return 0;
  }

  if (!monthlyRate) {
    return sanitizedPrincipal * ((months - completedPayments) / months);
  }

  const growth = (1 + monthlyRate) ** months;
  const paidGrowth = (1 + monthlyRate) ** completedPayments;
  return sanitizedPrincipal * ((growth - paidGrowth) / (growth - 1));
};

export const buildYearlyAmortizationSchedule = (
  principal: number,
  annualInterestRate: number,
  loanTermYears: number,
) => {
  const sanitizedPrincipal = toPositive(principal);
  const months = Math.max(Math.round(toPositive(loanTermYears) * 12), 1);
  const monthlyRate = toPositive(annualInterestRate) / 100 / 12;
  const payment = calculateMonthlyMortgagePayment(
    sanitizedPrincipal,
    annualInterestRate,
    loanTermYears,
  );

  if (!sanitizedPrincipal) {
    return [] as MortgageAmortizationRow[];
  }

  let balance = sanitizedPrincipal;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  const schedule: MortgageAmortizationRow[] = [];

  for (let month = 1; month <= months; month += 1) {
    const monthlyInterest = monthlyRate > 0 ? balance * monthlyRate : 0;
    const monthlyPrincipal = monthlyRate > 0 ? payment - monthlyInterest : sanitizedPrincipal / months;
    const appliedPrincipal = Math.min(monthlyPrincipal, balance);

    balance = Math.max(balance - appliedPrincipal, 0);
    cumulativeInterest += monthlyInterest;
    cumulativePrincipal += appliedPrincipal;

    if (month % 12 === 0 || month === months) {
      const yearStartMonth = month - ((month - 1) % 12);
      const yearPaymentCount = month - yearStartMonth + 1;
      const yearInterest = cumulativeInterest - (schedule.at(-1)?.cumulativeInterest ?? 0);
      const yearPrincipal = cumulativePrincipal - (schedule.at(-1)?.cumulativePrincipal ?? 0);

      schedule.push({
        cumulativeInterest,
        cumulativePrincipal,
        endingBalance: balance,
        interestPaid: yearInterest,
        payment: payment * yearPaymentCount,
        principalPaid: yearPrincipal,
        year: Math.ceil(month / 12),
      });
    }
  }

  return schedule;
};

export const calculateRoi = (inputs: RoiInputs) => {
  const purchasePrice = toPositive(inputs.purchasePrice);
  const rehabBudget = toPositive(inputs.rehabBudget);
  const closingCosts = toPositive(inputs.closingCosts);
  const downPaymentPercent = toPercent(inputs.downPaymentPercent);
  const vacancyRate = toPercent(inputs.vacancyRate);
  const monthlyRent = toPositive(inputs.monthlyRent);
  const otherMonthlyIncome = toPositive(inputs.otherMonthlyIncome);
  const monthlyOperatingExpenses = toPositive(inputs.monthlyOperatingExpenses);

  const downPaymentAmount = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = Math.max(purchasePrice - downPaymentAmount, 0);
  const monthlyDebtService = calculateMonthlyMortgagePayment(
    loanAmount,
    inputs.interestRate,
    inputs.loanTermYears,
  );
  const grossMonthlyIncome = monthlyRent + otherMonthlyIncome;
  const effectiveMonthlyIncome = grossMonthlyIncome * (1 - vacancyRate / 100);
  const annualOperatingExpenses = monthlyOperatingExpenses * 12;
  const annualNoi = effectiveMonthlyIncome * 12 - annualOperatingExpenses;
  const annualDebtService = monthlyDebtService * 12;
  const annualCashFlow = annualNoi - annualDebtService;
  const totalProjectCost = purchasePrice + rehabBudget + closingCosts;
  const cashInvested = downPaymentAmount + rehabBudget + closingCosts;
  const annualAppreciationGain = purchasePrice * (toPositive(inputs.annualAppreciationRate) / 100);

  return {
    annualAppreciationGain,
    annualCashFlow,
    annualDebtService,
    annualNoi,
    capRatePercent: (safeDivide(annualNoi, totalProjectCost) ?? 0) * 100,
    cashInvested,
    cashOnCashReturnPercent: (safeDivide(annualCashFlow, cashInvested) ?? 0) * 100,
    downPaymentAmount,
    dscr: safeDivide(annualNoi, annualDebtService),
    effectiveMonthlyIncome,
    firstYearRoiPercent:
      (safeDivide(annualCashFlow + annualAppreciationGain, cashInvested) ?? 0) * 100,
    grossMonthlyIncome,
    loanAmount,
    monthlyDebtService,
    totalProjectCost,
  };
};

export const calculateBrrrr = (inputs: BrrrrInputs) => {
  const purchasePrice = toPositive(inputs.purchasePrice);
  const rehabBudget = toPositive(inputs.rehabBudget);
  const closingCosts = toPositive(inputs.closingCosts);
  const downPaymentPercent = toPercent(inputs.downPaymentPercent);
  const afterRepairValue = toPositive(inputs.afterRepairValue);
  const refinanceLtvPercent = toPercent(inputs.refinanceLtvPercent);
  const vacancyRate = toPercent(inputs.vacancyRate);
  const monthlyRent = toPositive(inputs.monthlyRent);
  const otherMonthlyIncome = toPositive(inputs.otherMonthlyIncome);
  const monthlyOperatingExpenses = toPositive(inputs.monthlyOperatingExpenses);

  const downPaymentAmount = purchasePrice * (downPaymentPercent / 100);
  const initialLoanAmount = Math.max(purchasePrice - downPaymentAmount, 0);
  const totalProjectCost = purchasePrice + rehabBudget + closingCosts;
  const initialCashRequired = downPaymentAmount + rehabBudget + closingCosts;
  const refinanceLoanAmount = afterRepairValue * (refinanceLtvPercent / 100);
  const cashOutAtRefinance = Math.max(refinanceLoanAmount - initialLoanAmount, 0);
  const cashLeftInDeal = Math.max(initialCashRequired - cashOutAtRefinance, 0);
  const grossMonthlyIncome = monthlyRent + otherMonthlyIncome;
  const effectiveMonthlyIncome = grossMonthlyIncome * (1 - vacancyRate / 100);
  const annualNoi = effectiveMonthlyIncome * 12 - monthlyOperatingExpenses * 12;
  const monthlyDebtService = calculateMonthlyMortgagePayment(
    refinanceLoanAmount,
    inputs.refinanceInterestRate,
    inputs.refinanceLoanTermYears,
  );
  const annualDebtService = monthlyDebtService * 12;
  const annualCashFlow = annualNoi - annualDebtService;

  return {
    annualCashFlow,
    annualDebtService,
    annualNoi,
    cashLeftInDeal,
    cashOnCashAfterRefiPercent:
      cashLeftInDeal > 0 ? ((safeDivide(annualCashFlow, cashLeftInDeal) ?? 0) * 100) : null,
    cashOutAtRefinance,
    cashRecoveredPercent: (safeDivide(cashOutAtRefinance, initialCashRequired) ?? 0) * 100,
    downPaymentAmount,
    dscr: safeDivide(annualNoi, annualDebtService),
    effectiveMonthlyIncome,
    equityCreated: afterRepairValue - totalProjectCost,
    grossMonthlyIncome,
    initialCashRequired,
    initialLoanAmount,
    monthlyDebtService,
    refinanceLoanAmount,
    totalProjectCost,
  };
};

export const calculateMortgage = (inputs: MortgageInputs) => {
  const purchasePrice = toPositive(inputs.purchasePrice);
  const downPaymentPercent = toPercent(inputs.downPaymentPercent);
  const downPaymentAmount = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = Math.max(purchasePrice - downPaymentAmount, 0);
  const monthlyPrincipalAndInterest = calculateMonthlyMortgagePayment(
    loanAmount,
    inputs.interestRate,
    inputs.loanTermYears,
  );
  const monthlyEscrows =
    toPositive(inputs.annualPropertyTax) / 12 +
    toPositive(inputs.annualInsurance) / 12 +
    toPositive(inputs.monthlyHoa) +
    toPositive(inputs.monthlyPmi);
  const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyEscrows;
  const termMonths = Math.max(Math.round(toPositive(inputs.loanTermYears) * 12), 1);
  const totalPrincipalAndInterestPaid = monthlyPrincipalAndInterest * termMonths;
  const totalInterestPaid = totalPrincipalAndInterestPaid - loanAmount;
  const remainingBalanceAfterFiveYears = calculateRemainingBalance(
    loanAmount,
    inputs.interestRate,
    inputs.loanTermYears,
    60,
  );

  return {
    downPaymentAmount,
    loanAmount,
    monthlyEscrows,
    monthlyPrincipalAndInterest,
    principalPaidAfterFiveYears: loanAmount - remainingBalanceAfterFiveYears,
    remainingBalanceAfterFiveYears,
    totalInterestPaid,
    totalMonthlyPayment,
    totalPrincipalAndInterestPaid,
  };
};

export const calculateValueAdd = (inputs: ValueAddInputs) => {
  const unitCount = Math.max(Math.round(toPositive(inputs.unitCount)), 0);
  const currentGrossPotentialRent = unitCount * toPositive(inputs.avgCurrentRent) * 12;
  const stabilizedGrossPotentialRent = unitCount * toPositive(inputs.avgStabilizedRent) * 12;
  const currentEffectiveGrossIncome =
    currentGrossPotentialRent * (toPercent(inputs.currentOccupancyPercent) / 100) +
    toPositive(inputs.annualOtherIncomeCurrent);
  const stabilizedEffectiveGrossIncome =
    stabilizedGrossPotentialRent * (toPercent(inputs.stabilizedOccupancyPercent) / 100) +
    toPositive(inputs.annualOtherIncomeStabilized);
  const currentNoi =
    currentEffectiveGrossIncome - toPositive(inputs.annualOperatingExpensesCurrent);
  const stabilizedNoi =
    stabilizedEffectiveGrossIncome - toPositive(inputs.annualOperatingExpensesStabilized);
  const annualNoiGain = stabilizedNoi - currentNoi;
  const exitCapRate = toPositive(inputs.exitCapRatePercent) / 100;
  const currentValue = exitCapRate > 0 ? currentNoi / exitCapRate : 0;
  const stabilizedValue = exitCapRate > 0 ? stabilizedNoi / exitCapRate : 0;
  const estimatedValueCreated = exitCapRate > 0 ? annualNoiGain / exitCapRate : 0;
  const renovationBudget = toPositive(inputs.renovationBudget);
  const netValueCreated = estimatedValueCreated - renovationBudget;

  return {
    annualNoiGain,
    currentEffectiveGrossIncome,
    currentGrossPotentialRent,
    currentNoi,
    currentValue,
    estimatedValueCreated,
    netValueCreated,
    paybackPeriodYears:
      annualNoiGain > 0 ? safeDivide(renovationBudget, annualNoiGain) : null,
    renovationBudget,
    returnOnRenovationCostPercent:
      renovationBudget > 0 ? ((safeDivide(netValueCreated, renovationBudget) ?? 0) * 100) : null,
    stabilizedEffectiveGrossIncome,
    stabilizedGrossPotentialRent,
    stabilizedNoi,
    stabilizedValue,
  };
};

export const isSupportedCalculatorType = (
  value: string | null | undefined,
): value is SupportedCalculatorType =>
  value === "ROI" || value === "BRRRR" || value === "MORTGAGE" || value === "VALUE_ADD";
