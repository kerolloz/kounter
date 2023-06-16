<h1 align="left">Kounter 🧮
<a target="_blank" href="https://fastify.io">
  <img alt="fastify" align="right" src="https://t.ly/0o1a"/>
</a>
<a target="_blank" href="https://railway.app/">
  <img alt="Railway" align="right" src="https://t.ly/f5Sa" />
</a>
</h1>

Kounter is a simple counter service that can be used in a variety of ways.  
Use cases include a profile views counter, repository visits counter, or just anything you want to count.

## Docs

You need to set `DETA_PROJECT_KEY` environment variable to your Deta project key.

Kounter is built using _Fastify_.  
It has a starightforward API with the following few endpoints.

### Endpoints

> Base URL: <https://kounter.tk>

#### GET `/`

Redirects to this repository.

---

#### GET `/badge/:key`

- Increments the counter by 1 if `:key` exits; creates a new counter with count initialized to 1 otherwise.
- Returns a [shields.io](https://shields.io) badge (SVG image) for your counter.

##### Parameters

- `key` - The key of the counter to increment.

##### Query Parameters

- `silent` - Set to `true` to **disable incrementing** the counter. Defaults to `false`.
- `style` - Set the style of the badge. Can be one of `flat`, `flat-square`, `for-the-badge`, or `plastic`. Defaults to `flat`.
- `label` - Set the left-hand-side text. Defaults to `:key`.
- `color` - Set background of the right part (hex, rgb, rgba, hsl, hsla and css named colors supported). Defaults to `brightgreen`.
- `labelColor` -  Set background of the left part (hex, rgb, rgba, hsl, hsla and css named colors supported). Defaults to `grey`.
- `cntPrefix` - Set prefix to display before the counter value. Defaults to `""` empty string.
- `cntSuffix` - Set suffix to display after the counter value. Defaults to `""` empty string.

##### Examples

> `![badge](https://kounter.tk/badge/kerolloz.kounter)`  
> ![badge](https://kounter.tk/badge/kerolloz.kounter)

> `![badge](https://kounter.tk/badge/kerolloz.kounter?style=flat-square&color=blue&silent=true)`  
> ![badge](https://kounter.tk/badge/kerolloz.kounter?style=flat-square&color=blue&silent=true)  

> `![badge](https://kounter.tk/badge/kerolloz.kounter?label=kerolloz/kounter&labelColor=white&cntPrefix=visits%20&silent=true)`  
> ![badge](https://kounter.tk/badge/kerolloz.kounter?label=kerolloz/kounter&labelColor=white&cntPrefix=visits%20&silent=true)

> `![badge](https://kounter.tk/badge/kerolloz.kounter?label=&color=333&style=for-the-badge&cntSuffix=%20Views&silent=true)`  
> ![badge](https://kounter.tk/badge/kerolloz.kounter?label=&color=333&style=for-the-badge&cntSuffix=%20Views&silent=true)

---

#### GET `/count/:key`

<a target="_blank" href="https://reqbin.com/c-hzpbeh8a">
  <img align="right" alt="Try it" src="https://img.shields.io/badge/-Try%20it-white?style=for-the-badge" />
</a>

- Returns the current count for `:key` **without incrementing** it.
- Returns `{ key: ":key", count: 0 }` if the counter `:key` does not exist.

##### Parameters

- `key` - The key of the counter to get count value for.

##### Example

```bash
$ curl -X GET https://kounter.tk/count/xyz

{
  "count": 1,
  "key": "xyz"
}
```