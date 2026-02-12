export function validateRequiredText(value: string, fieldName: string): string | null {
  if (!value.trim()) {
    return `${fieldName} is required.`;
  }

  return null;
}

export function parsePositiveNumberInput(
  value: string,
  fieldName: string,
): { value: number | null; error: string | null } {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return {
      value: null,
      error: `${fieldName} must be greater than 0.`,
    };
  }

  return {
    value: parsed,
    error: null,
  };
}

export function parseNonNegativeNumberInput(
  value: string,
  fieldName: string,
): { value: number | null; error: string | null } {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return {
      value: null,
      error: `${fieldName} cannot be negative.`,
    };
  }

  return {
    value: parsed,
    error: null,
  };
}

export function validateDateInput(value: string, fieldName: string): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return `${fieldName} is invalid.`;
  }

  return null;
}

export async function readApiErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  try {
    const payload = (await response.json()) as {
      error?: string;
      details?: string;
    };

    if (payload.error && payload.details) {
      return `${payload.error} ${payload.details}`;
    }

    if (payload.error) {
      return payload.error;
    }

    if (payload.details) {
      return payload.details;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}