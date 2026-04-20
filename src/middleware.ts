import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ url }, next) => {
  const res = await next();
  const base = new Response(res.body, res);

  if (!url.pathname.startsWith("/keystatic") && !url.pathname.startsWith("/api/keystatic")) {
    return base;
  }

  base.headers.delete("Content-Security-Policy");
  base.headers.set(
    "Content-Security-Policy",
    "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https:; img-src 'self' https: data: blob:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; frame-ancestors 'self'; base-uri 'self';"
  );
  base.headers.set("X-Frame-Options", "SAMEORIGIN");
  return base;
};
