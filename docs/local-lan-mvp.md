# Local LAN MVP

This branch turns the app into a company LAN host prototype.

## Goal

- Run the app on one always-on company Windows computer.
- Let team members open the app from browsers on the same LAN.
- Keep API keys only on the host computer.
- Save canvases in SQLite.
- Save uploaded and generated files on the host disk.

## Host Data Directory

Set `MAIJI_DATA_DIR` on the host computer.

Recommended Windows path:

```env
MAIJI_DATA_DIR=D:\maiji-data
```

If it is not set, the app uses:

```text
.maiji-local-data\
```

Data layout:

```text
D:\maiji-data\
  app.sqlite
  assets\
    users\
      user-id\
        uploads\
        generated\
```

## Environment

Create `.env.local` from `.env.local.example`.

Required:

```env
CHAT_API_URL=https://yunwu.ai/v1/chat/completions
CHAT_API_KEY=your_real_key
MAIJI_DATA_DIR=D:\maiji-data
```

Do not commit `.env.local`.

## Run In LAN

Install dependencies:

```bash
corepack pnpm install
```

Start development host:

```bash
corepack pnpm dev
```

The custom server listens on `0.0.0.0:5000` by default.

On the host computer:

```text
http://localhost:5000
```

On other company LAN computers:

```text
http://HOST_LAN_IP:5000
```

Example:

```text
http://192.168.1.88:5000
```

## Current MVP Scope

Implemented:

- Canvas CRUD uses SQLite through `src/lib/canvas/persistence.ts`.
- Canvas lists are isolated by browser-local user identity.
- Browser uploads use `POST /api/assets/upload`.
- Local files are served through `GET /api/assets/file/...`.
- Text-to-image and image-edit results are saved to local disk before returning to the canvas.
- The app can be reached from LAN because `src/server.ts` defaults to `0.0.0.0`.
- Uploaded and generated files are grouped by user under `assets/users/<user-id>/`.

Not implemented yet:

- Strong login and employee permission control.
- Admin UI for disabling users.
- Automatic backups.
- Windows installer / `.exe` packaging.
- Windows service or startup task.

## Maintenance Notes

- Back up `MAIJI_DATA_DIR`, not just the Git repository.
- `app.sqlite` stores canvas metadata and asset records.
- `assets/` stores the actual uploaded and generated files.
- The host maintainer can see all users' files on disk.
- Browser users only see their own canvas list in the UI.
- Current user identity is stored in each browser's localStorage, so this is workspace isolation, not a security boundary.
- If a file URL starts with `/api/assets/file/`, it is a host-local permanent file URL.
- Avoid storing `blob:` URLs or large base64 strings in saved canvases.
