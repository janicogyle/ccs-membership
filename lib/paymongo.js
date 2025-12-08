const PAYMONGO_API_BASE = 'https://api.paymongo.com/v1';

export const paymongoSimulationEnabled =
  process.env.PAYMONGO_SIMULATOR === 'true' || !process.env.PAYMONGO_SECRET_KEY;

function getSecretKey() {
  if (paymongoSimulationEnabled) {
    throw new Error('PayMongo secret key is not configured. Set PAYMONGO_SECRET_KEY or enable simulator mode.');
  }
  return process.env.PAYMONGO_SECRET_KEY;
}

export async function paymongoRequest(path, { method = 'GET', body } = {}) {
  if (paymongoSimulationEnabled) {
    throw new Error('PayMongo request attempted while simulator mode is active.');
  }
  const secretKey = getSecretKey();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const response = await fetch(`${PAYMONGO_API_BASE}${normalizedPath}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = Array.isArray(data?.errors) ? data.errors[0]?.detail : undefined;
    const message = detail || data?.message || 'PayMongo request failed';
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export default paymongoRequest;
