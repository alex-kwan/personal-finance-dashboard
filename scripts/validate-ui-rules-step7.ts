import {
  parseNonNegativeNumberInput,
  parsePositiveNumberInput,
  validateDateInput,
  validateRequiredText,
} from "../src/lib/form-validation";

type Check = {
  name: string;
  passed: boolean;
  details?: string;
};

function expectEqual(name: string, actual: unknown, expected: unknown): Check {
  const passed = actual === expected;
  return {
    name,
    passed,
    details: passed ? undefined : `expected=${String(expected)} actual=${String(actual)}`,
  };
}

function expectTrue(name: string, condition: boolean, details?: string): Check {
  return {
    name,
    passed: condition,
    details,
  };
}

async function main() {
  const checks: Check[] = [];

  checks.push(expectEqual("required text rejects blank", validateRequiredText("   ", "Name"), "Name is required."));
  checks.push(expectEqual("required text accepts value", validateRequiredText("Salary", "Name"), null));

  const positiveInvalid = parsePositiveNumberInput("0", "Amount");
  checks.push(expectEqual("positive number rejects zero", positiveInvalid.error, "Amount must be greater than 0."));

  const positiveValid = parsePositiveNumberInput("42.5", "Amount");
  checks.push(expectEqual("positive number parses value", positiveValid.value, 42.5));
  checks.push(expectEqual("positive number no error", positiveValid.error, null));

  const nonNegativeInvalid = parseNonNegativeNumberInput("-1", "Current amount");
  checks.push(
    expectEqual(
      "non-negative rejects negatives",
      nonNegativeInvalid.error,
      "Current amount cannot be negative.",
    ),
  );

  const nonNegativeValid = parseNonNegativeNumberInput("0", "Current amount");
  checks.push(expectEqual("non-negative accepts zero", nonNegativeValid.value, 0));

  checks.push(expectEqual("date validator accepts empty", validateDateInput("", "Date"), null));
  checks.push(expectEqual("date validator rejects invalid", validateDateInput("not-a-date", "Date"), "Date is invalid."));
  checks.push(expectEqual("date validator accepts valid", validateDateInput("2026-02-12", "Date"), null));

  const failures = checks.filter((check) => !check.passed);
  checks.push(expectTrue("all checks pass", failures.length === 0, failures.map((f) => `${f.name}: ${f.details}`).join("; ")));

  if (failures.length > 0) {
    console.error("❌ Step 7 UI validation checks failed");
    for (const failure of failures) {
      console.error(`- ${failure.name}: ${failure.details}`);
    }
    process.exit(1);
  }

  console.log("✅ Step 7 UI validation checks complete");
  console.log("Verified: required text, numeric constraints, and date validation helpers");
}

main().catch((error) => {
  console.error("❌ Step 7 UI validation checks failed");
  console.error(error);
  process.exit(1);
});
