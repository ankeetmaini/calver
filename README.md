# calver

- it works for web - package.json files
- android build.gradle files

## usage

- create a new workflow file inside .github/workflows
- name it release.yml or anything you like
- the file should look something like this

```yml
#workflow Name
name: release
on:
  push:
    branches:
      - "develop"

#jobs
jobs:
  bump-version:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Bump version
        uses: ankeetmaini/calver@v1
        with:
          path: ./package.json
          platform: web

      - name: Bump version android
        uses: ankeetmaini/calver@v1
        with:
          path: ./android.gradle.kts
          platform: android

      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "[Bot] Update all the things!"
          commit_user_name: Calver Bot
          commit_user_email: calver@noreply.com
          commit_author: Calver Bot <calver@noreply.com>
```

> Use either web or android unless you've both the codebases in one repository.
