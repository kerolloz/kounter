<h1 align="left">Kounter 🧮
<a target="_blank" href="https://fastify.io">
  <img alt="fastify" align="right" src="https://t.ly/0o1a"/>
</a>
<a target="_blank" href="https://deta.sh">
  <img alt="Deta" align="right" src="https://t.ly/-g08" />
</a>
</h1>

Kounter is a simple counter service that can be used in a variety of ways.  
Use cases include a profile views counter, repository visits counter, or just anything you want to count.

## Docs

Kounter is built using _Fastify_ and is designed to run on _Deta_.  
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

- `style` - Set the style of the badge. Can be one of `flat`, `flat-square`, `for-the-badge`, or `plastic`. Defaults to `flat`.
- `label` - Set the left-hand-side text. Defaults to `:key`.
- `color` - Set background of the right part (hex, rgb, rgba, hsl, hsla and css named colors supported). Defaults to `brightgreen`.
- `labelColor` -  Set background of the left part (hex, rgb, rgba, hsl, hsla and css named colors supported). Defaults to `grey`.
- `cntPrefix` - Set prefix to display before the counter value. Defaults to `""` empty string.
- `cntSuffix` - Set suffix to display after the counter value. Defaults to `""` empty string.

##### Examples

> `![badge](https://kounter.tk/badge/kerolloz.kounter)`  
> ![badge](https://kounter.tk/badge/kerolloz.kounter)

> `![badge](https://kounter.tk/badge/kerolloz.kounter?style=flat-square&color=blue)`  
> ![badge](https://kounter.tk/badge/kerolloz.kounter?style=flat-square&color=blue)  

> `![badge](https://kounter.tk/badge/kerolloz.kounter?label=kerolloz/kounter&labelColor=white&cntPrefix=visits%20)`  
> ![badge](https://kounter.tk/badge/kerolloz.kounter?label=kerolloz/kounter&labelColor=white&cntPrefix=visits%20)

> `![badge](https://kounter.tk/badge/kerolloz.kounter?label=&color=cyan&style=for-the-badge&cntSuffix=%20Views)`  
> ![badge](https://kounter.tk/badge/kerolloz.kounter?label=&color=cyan&style=for-the-badge&cntSuffix=%20Views)

---

#### GET `/count/:key`

<a target="_blank" href="https://reqbin.com/c-hzpbeh8a">
  <img align="right" alt="Try it" src="https://img.shields.io/badge/-Try%20it-white?style=for-the-badge" />
</a>

- Returns the current count for `:key` **without incrementing** it.
- Returns `null` if the counter `:key` does not exist.

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

---

### Deployment

Kounter is powered by [Deta](https://deta.sh).
You are more than welcome to use my version at <https://kounter.tk>.

Also feel free to deploy it to your own Deta account by clicking the button below.  
<a href="https://go.deta.dev/deploy?repo=https://github.com/kerolloz/kounter">
  <img width="15%" alt="Deta Deploy Button" src="https://button.deta.dev/1/svg" />
</a>

<sub>This service is provided for free thanks to [Deta Micros](https://docs.deta.sh/docs/micros/about) and [Deta Base](https://docs.deta.sh/docs/base/about).</sub>
