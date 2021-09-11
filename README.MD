# zmnv-art-starter

### Template to start making generative art based on pseudorandom number generator. Use seed and other properties from URL path.

## Why?

Yes, this is one more starter, but it has:

* handled state of seed for PRNG, so you always know how to graw the same picture again and share it with community.
* metadata injects inside result HTML file automatically
* SEO and console.log author's metadata
* live reloading
* `esbuild` to do a nice architectrure of your app
* `terser` to minify `js` bundle


## How it works?

1. Use `seed` param in url pash when you start project. If this parameter is empty `seed` will be generated automatically:

```
http://localhost:3000/?seed=0xe9c0104a3058a4dd7042b84794e270dff6935de1cfca30c01ddf8de676a99444
```

2. Build
3. ???
4. Profit

