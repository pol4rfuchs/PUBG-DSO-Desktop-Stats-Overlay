# Contributing

Thanks for your interest in improving PUBG/DSO Desktop Stats Overlay!

## Setup

```bash
cd pubg-electron
npm install
npm start
```

## Making changes

1. Fork the repo and create a branch from `main`.
2. Make your changes in `pubg-electron/`.
3. Test locally with `npm start` before opening a PR.
4. Keep commits small and descriptive.

## Building a Windows executable locally

```bash
cd pubg-electron
npm install
npm run build
```

The packaged app will be in `pubg-electron/dist/`.

## Pull requests

- Describe what changed and why.
- Reference any related issue.
- Update `CHANGELOG.md` under `[Unreleased]` if your change is user-facing.

## Reporting bugs

Please open an issue with:
- Windows version
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if relevant (overlay/UI issues)
