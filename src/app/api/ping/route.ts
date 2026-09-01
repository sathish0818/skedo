/**
 * Latency probe for the connection check. Deliberately does nothing and returns
 * no body — the timing of the round trip is the whole payload.
 */
export const dynamic = 'force-dynamic'

export function GET() {
  return new Response(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  })
}
