# road-per-inhabitant-vue
Hosted on https://sti2nd.github.io/road-per-inhabitant-vue/

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run start
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### How to deploy to Github pages
1. Make sure you have set the basename/basepath in Vue this is called publicPath https://cli.vuejs.org/config/#publicpath
1. (Alternatively branch to gh-pages)
1. Remove dist folder from gitignore and commit it
2. Push with `git subtree push --prefix dist origin master:gh-pages`
1. (If didn't branch reset hard to before all this)