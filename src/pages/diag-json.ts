export const prerender = false;

export const GET = async () => {
  return Response.json(
    { ok: true, probe: 'diag-json-ok' },
    {
      status: 200,
      headers: {
        'cache-control': 'no-store',
      },
    },
  );
};
