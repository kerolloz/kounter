const app = require("fastify")();
const { incrementCounter, getCounter } = require("./counter");
const { getCountBadge } = require("./badge");

const GITHUB_REPO = "https://github.com/kerolloz/kounter";

app.get("/", async (_, reply) => reply.redirect(GITHUB_REPO));

// Returns (without incrementing) the current count of the key
app.get("/count/:key", (request, reply) => {
  const { key } = request.params;
  if (!key) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "Key is required",
    });
  }
  return getCounter(key);
});

// Returns a shields.io SVG image with the incremented count of the key
app.get("/badge/:key", async (request, reply) => {
  const { key } = request.params;
  if (!key) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "Key is required",
    });
  }
  const {
    style = "flat",
    label = key,
    labelColor = "",
    color = "",
    cntPrefix = "",
    cntSuffix = "",
    silent = false,
  } = request.query;

  const { count } = await (silent == "true"
    ? getCounter(key) // Don't increment the counter
    : incrementCounter(key));

  try {
    const badge = getCountBadge({
      style,
      label,
      labelColor,
      color,
      message: cntPrefix + count + cntSuffix,
    });

    reply
      .code(200)
      .headers({
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=0, no-cache, no-store, must-revalidate",
      })
      .send(badge);
  } catch (err) {
    reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: err.message,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen({ port, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
