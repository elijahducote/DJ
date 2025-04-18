// Utility
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  wrapper,
  print,
  runCmd,
  sendHTMLResponse
} from "./xter/lib/ntry.js";

// Functions
import {flyerUpdate} from "./xter/flyer-update/func.js";
import {createIntent} from "./xter/create-intent/func.js";
import {message} from "./xter/message/func.js";

// Network
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

// Init
const app = new Hono(),
workingDir = dirname(fileURLToPath(import.meta.url)),
publicDir = join(workingDir, "ntra"),
routes = [
  "cdn",
  "go"
];
app.all(cors());
app.all(logger());

app.get(
  "/cdn/*",
  serveStatic({
    root: "ntra/src",
    rewriteRequestPath: (path) => path.replace(/^\/cdn/, "/"),
  })
);

app.get(
  "/go/flyer-update",
  wrapper(flyerUpdate, "HONO")
);

app.post(
 "/go/create-intent",
 wrapper(createIntent, "HONO")
);

app.post(
 "/go/message",
 wrapper(message, "HONO")
).get(wrapper(message,"HONO"));

// Serve static files for non-/cdn/* paths
app.use("*", async (c, next) => {
  if (isReserved(c.req.path)) {
    await runCmd(
      `esbuild "${publicDir}/script/*.js" --keep-names --drop:debugger --pure:console --tree-shaking=true --legal-comments=none --charset=utf8 --format=iife --bundle --platform=browser --minify --target=chrome131,safari18.2,edge131,firefox133,opera115 --outdir="${publicDir}/src/js" && esbuild "${publicDir}/ravel.css" --loader:.css=css --loader:.ttf=file --tree-shaking=true --legal-comments=none --charset=utf8 --bundle --platform=browser --minify --target=chrome131,safari18.2,edge131,firefox133,opera115 --outfile="${publicDir}/src/css/ravel.css"`
    );
    return await serveStatic({ root: "ntra", path:"index.html" })(c, next);
  }
  await next();
});

function isReserved (path) {
  let i = routes.length;
  for (;i;--i) {
    if (path.startsWith(`/${routes[i - 1]}`)) return false;
  }
  return true;
}

serve(app, (info) =>
{
  print(`Running on http://127.0.0.1:${info.port}`);
});