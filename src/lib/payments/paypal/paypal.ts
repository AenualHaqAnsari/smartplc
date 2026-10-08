const PAYPAL_API_BASE =
  process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function getPayPalAccessToken(): Promise<string> {
  const clientId =
    process.env.PAYPAL_CLIENT_ID;

  const clientSecret =
    process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal credentials are not configured."
    );
  }

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    logPayPalApiError("AUTH", response, data);

    throw new Error(
      "Unable to authenticate with PayPal."
    );
  }

  return data.access_token;
}

export function getPayPalApiBase(): string {
  return PAYPAL_API_BASE;
}

export function logPayPalApiError(
  operation: string,
  response: Response,
  data: unknown
): void {
  const payload =
    typeof data === "object" && data !== null
      ? (data as Record<string, unknown>)
      : {};
  const name =
    typeof payload.name === "string"
      ? payload.name
      : typeof payload.error === "string"
        ? payload.error
        : undefined;
  const message =
    typeof payload.message === "string"
      ? payload.message
      : typeof payload.error_description === "string"
        ? payload.error_description
        : undefined;
  const debugId =
    response.headers.get("paypal-debug-id") ??
    response.headers.get("correlation-id") ??
    undefined;

  console.error(`PAYPAL ${operation} ERROR:`, {
    httpStatus: response.status,
    ...(name ? { name } : {}),
    ...(message ? { message } : {}),
    ...(debugId ? { debugId } : {}),
  });
}
