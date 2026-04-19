import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ url }, next) => {
  const res = await next();

  if (!url.pathname.startsWith("/keystatic") && !url.pathname.startsWith("/api/keystatic")) {
    return res;
  }

  const passthrough = new Response(res.body, res);
  passthrough.headers.set(
    "Content-Security-Policy",
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;"
  );
  passthrough.headers.set("X-Frame-Options", "SAMEORIGIN");
  return passthrough;
};
