# React Native Guidelines

Source for our React Native + Expo team guideline (Jekyll + Just-the-Docs).

## Run locally

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000/react-native-guidelines/
                            # Spanish: http://localhost:4000/react-native-guidelines/es/
```

## Check links

```bash
bundle exec jekyll build
bundle exec htmlproofer ./_site --disable-external --allow-hash-href --ignore-empty-alt
```

## Publish

Deploys to GitHub Pages. With the pinned `just-the-docs` gem, publish via a
GitHub Actions Pages workflow. To publish without Actions, switch `_config.yml`
to `remote_theme: just-the-docs/just-the-docs`.
