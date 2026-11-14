const UPSTREAMS = {
  auth: "authserver.mojang.com",
  account: "api.mojang.com",
  session: "sessionserver.mojang.com",
  services: "api.minecraftservices.com",
  profiles: "api.mojang.com",
};

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    const service = incomingUrl.pathname.split("/")[1];
    const upstreamHost = UPSTREAMS[service];

    if (!upstreamHost) {
      return new Response("Not Found", { status: 404 });
    }

    const prefix = `/${service}`;
    if (
      incomingUrl.pathname !== prefix &&
      !incomingUrl.pathname.startsWith(`${prefix}/`)
    ) {
      return new Response("Not Found", { status: 404 });
    }

    const upstreamUrl = new URL(incomingUrl);
    upstreamUrl.protocol = "https:";
    upstreamUrl.hostname = upstreamHost;
    upstreamUrl.port = "";
    upstreamUrl.pathname = incomingUrl.pathname.slice(prefix.length) || "/";

    const upstreamRequest = new Request(upstreamUrl, request);
    const headers = new Headers(upstreamRequest.headers);
    headers.set("Host", upstreamHost);

    return fetch(new Request(upstreamRequest, { headers }));
  },
};
