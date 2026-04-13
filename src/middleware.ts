import type { MiddlewareHandler } from "astro";

const INJECT_TAG = '<script src="/keystatic-fold.js" defer></script>';

export const onRequest: MiddlewareHandler = async ({ url }, next) => {
  const res = await next();
  if (!url.pathname.startsWith("/keystatic")) return res;

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return res;

  const html = await res.text();
  if (html.includes("/keystatic-fold.js")) return res;

  const injected = html.includes("</body>") ? html.replace("</body>", `${INJECT_TAG}</body>`) : `${html}${INJECT_TAG}`;
  const headers = new Headers(res.headers);
  headers.delete("content-length");
  return new Response(injected, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
};
