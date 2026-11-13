# Changelog

## [1.0.0] - 2026-11-13

### Breaking changes

- 💥 require Node.js 24

### Bug fixes

- 🐛 make @screegen/components types resolve under node16/nodenext
- 🐛 allow the @parcel/watcher build in scaffolded projects
- 🐛 scaffold projects with the current screegen version

### Dependencies

- build(deps-dev): bump tsx from 4.23.12 to 4.23.13
- build(deps): bump react-router-dom from 7.18.2 to 7.18.3
- build(deps-dev): bump tsx from 4.23.6 to 4.23.12
- build(deps): bump lucide-react from 1.32.0 to 1.34.0
- build(deps-dev): bump vitest from 4.1.10 to 4.1.11
- build(deps-dev): bump vitest from 4.1.10 to 4.1.11
- build(deps): bump lucide-react from 1.31.0 to 1.32.0
- build(deps-dev): bump @testing-library/jest-dom from 7.0.0 to 7.0.1
- build(deps-dev): bump @types/react from 19.2.17 to 19.2.18
- build(deps-dev): bump @types/node from 26.1.2 to 26.2.0
- build(deps): bump lucide-react from 1.28.0 to 1.31.0
- build(deps-dev): bump @vitejs/plugin-react from 6.0.4 to 6.0.5
- build(deps): bump lucide-react from 1.27.0 to 1.28.0
- build(deps): bump playwright from 1.62.0 to 1.62.1
- build(deps-dev): bump @types/react-dom from 19.2.3 to 19.2.4
- build(deps-dev): bump tsx from 4.23.1 to 4.23.6
- build(deps): bump react-router-dom from 7.18.1 to 7.18.2
- ⬆️ update dependencies of the project template
- ➖ remove unused vite dependency from the cli
- ⬆️ update pnpm to 12
- ⬆️ update TypeScript to 7
- ⬆️ update jsdom to 31
- ⬆️ update ora to 10
- ⬆️ update chalk to 6
- ⬆️ update Vite+ to 1.6 and Vitest to 5
- ⬆️ update dependencies

### Documentation

- 📝 update package metadata, README and editor recommendations

### CI

- 👷 add release workflow and git-cliff config
- 👷 run CI on Node.js 24 and 26 with pnpm/action-setup

### Chores

- 🔧 drop workspace TypeScript SDK setting, TypeScript 7 has no tsserver
- 🔧 add lint:check, lint:fix, format:check and format:write scripts

### Other

- 🛠️ add push trigger to CI workflow

## [0.0.11] - 2026-07-29

### Features

- ✨ add support for graphics (feature graphics) and device path templates
- feat: add fastlaneKey placeholder support and bump to v0.0.9
- feat: add [language] placeholder support in output path
- ✨ add rich text formatting feature to translations
- ✨ add DeviceFrame component to replace PNG mockups
- ✨ Add test-init script to package.json
- ✨ add template generation script and update templates
- feat: add dark mode support
- feat: update overview

### Bug fixes

- 🐛 ensure dev server and all child processes are properly terminated

### Refactoring

- 🔨 consolidate device screen layouts and update feature icons
- refactor(viteplus): improve laptop frame rendering and dev workflow
- ♻️ simplify type system and remove generic language constraints
- ♻️ Extract Screegen routing component and improve test coverage
- ♻️ Convert to monorepo with CLI and component packages

### Documentation

- 📝 Update copyright year and reset package versions for initial release

### Tests

- 🧪 add jest coverage configuration and tossitin config
- 🧪 add jest coverage configuration and tossitin config
- ✅ Add comprehensive test coverage to CLI package
- ✅ Add test coverage configuration and comprehensive unit tests
- 🧪 Add comprehensive test suite for components package

### Style

- 🎨 center device positioning across iPhone screens

### Chores

- 🔧 bump version to 0.0.11 and update dependencies
- 🔧 bump version to 0.0.7
- 🔧 bump version to 0.0.6 and add repository metadata
- build: migrate from Yarn to pnpm and tsup to Vite Plus
- 🔧 bump version to 0.0.6
- 🔧 Add Corepack enablement to CI workflow
- 🔧 migrate to ESLint v9 and Prettier with flat config
- chore: replace react-scripts with vite
- chore(deps): upgrade dependencies
- chore: remove .pnp.cjs
- chore: add support for yarn pnp
- chore: convert project to use ts
- chore: remove install-state.gz
- chore: remove existing screenshots
- chore: use yarn v4

### Other

- :construction_worker: "I think the sky is blue because it's a shift from black through purple
- :sparkles: "Maintain an awareness for contribution -- to your schedule, your project,
- :construction_worker: It's raisins that make Post Raisin Bran so raisiny ...
- :green_apple: perfect guest:
- :clown_face: We are what we pretend to be.
- :tada: Experience is what you get when you didn't get what you wanted.
- :construction_worker: Virtue is a relative term.
- :fire: You are not permitted to kill a woman who has wronged you, but nothing
- added pt
- 🚧 implemented screens
- generation ready
- cleanup
- 🚀 poc
- 🚀 poc
- Initialize project using Create React App
