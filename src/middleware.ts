import type { MiddlewareHandler } from "astro";

const INJECT_TAG = '<script src="/keystatic-fold.js" defer></script>';

export const onRequest: MiddlewareHandler = async ({ url }, next) => {
  const res = await next();
  
  // 1. 如果不是 keystatic 相关的路径，直接放行
  if (!url.pathname.startsWith("/keystatic") && !url.pathname.startsWith("/api/keystatic")) {
    return res;
  }

  // 2. 只要是后台路径，我们就先克隆 Header，并强行注入 CSP (解决 eval 白屏报错)
  const headers = new Headers(res.headers);
  headers.set(
    "Content-Security-Policy", 
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;"
  );

  const contentType = headers.get("content-type") || "";
  
  // 3. 如果请求的不是 HTML 网页（比如是图片、API 接口），我们只加 Header，不改内容
  if (!contentType.includes("text/html")) {
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers, // 带上刚才注入的 CSP 头
    });
  }

  // 4. 下面是你原本的逻辑：如果是 HTML 网页，继续注入 fold 脚本
  const html = await res.text();
  
  // 如果已经包含该脚本，直接带着新 Header 返回
  if (html.includes("/keystatic-fold.js")) {
    return new Response(html, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  }

  // 注入脚本标签
  const injected = html.includes("</body>") 
    ? html.replace("</body>", `${INJECT_TAG}</body>`) 
    : `${html}${INJECT_TAG}`;
    
  // 因为改了 HTML 长度，必须删掉原来的 content-length
  headers.delete("content-length"); 
  
  return new Response(injected, {
    status: res.status,
    statusText: res.statusText,
    headers, // 最终返回：包含 fold 脚本 + 包含 CSP 通行证
  });
};