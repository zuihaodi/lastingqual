import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ url }, next) => {
  const res = await next();

  if (!url.pathname.startsWith("/keystatic") && !url.pathname.startsWith("/api/keystatic")) {
    return res;
  }

  res.headers.delete("Content-Security-Policy");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https:; img-src 'self' https: data: blob:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; frame-ancestors 'self'; base-uri 'self';"
  );
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  return res;
};
