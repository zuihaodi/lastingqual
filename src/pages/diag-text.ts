export const prerender = false;

export const GET = async () => {
  return new Response('diag-text-ok', {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
};
