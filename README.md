# Ubuntu 22.04+ Theme Pack v2

Orchis-Dark GTK theme + Papirus Icons + GNOME Shell theme + GRUB + Extension + Sync Daemon.

## Installation

cd leo-theme-pack
bash install.sh

Then **logout → login**.

## Uninstall

bash install.sh --uninstall

## Components

| File | Description | Size |
|---|---|---|
| themes/Orchis-Dark/ | GTK theme (10px rounded corners, dock tweak, libadwaita) | 3.1 MB |
| shell/gnome-shell-theme.gresource | GNOME Shell theme (gdm.css included) | 9.1 MB |
| shell/gnome-shell.css | Patched Shell CSS (notification, popup, modal) | - |
| shell/gnome-shell-theme.gresource.original | Original Yaru gresource backup | - |
| extension/extension.js | Theme Switcher v11 (GNOME 46+ ESM) | 20 KB |
| extension/metadata.json | Extension metadata | - |
| scripts/orchis-sync.sh | Sync daemon (Quick Settings dark/light ↔ Orchis) | 8 KB |
| grub/Office-window/ | GRUB boot theme (1080p) | 14 MB |
| install.sh | Install/Uninstall script (120 lines) | - |

**Total: 26 MB, 534 files**

## Features

### Install script (8 steps)
1. Backup current config
2. Install Papirus icons via PPA
3. Copy Orchis-Dark to ~/.themes/
4. Configure gsettings + GTK3 settings.ini + GTK4 libadwaita symlinks
5. Install Shell gresource + CSS
6. Install Extension + register dconf
7. Install Sync daemon + autostart
8. Install GRUB theme + update grub config

### Theme Switcher Extension (v11)
- Toolbar icon: 🌙 (dark) / ☀️ (light) — auto switches with theme
- 3-column grid: DARK | LIGHT | COMPACT
- Accent color highlights selected variant
- Manual selection → updates gtk-theme + icons + GTK3 + GTK4 + color-scheme

### Sync Daemon
- Listens to gsettings changes
- Quick Settings dark/light toggle → auto sync Orchis-Dark ↔ Orchis-Light
- Papirus ↔ Papirus-Light
- GTK3 settings.ini + GTK4 symlinks
- Autostarts on login

### Dark/Light Toggle
- Quick Settings toggle: two-way sync
- Extension menu: manual selection → syncs back to Quick Settings
- Icons: Papirus (dark) / Papirus-Light (light)
- gtk-application-prefer-dark-theme: auto set 1/0

## Compatibility

- GNOME Shell 42-48
- Ubuntu 22.04+
- Wayland & X11
- GRUB 2.x

## After Installation

- 🌙/☀️ Toolbar icon (switch dark/light)
- 🎨 Orchis-Dark applied to all GTK apps
- 🖥️ Orchis shell theme (panel, dock, overview, notifications)
- 📁 Office GRUB theme on boot
- ⚡ Quick Settings dark/light toggle synced

- <img width="1920" height="1080" alt="1" src="https://github.com/user-attachments/assets/3667d807-508f-4f72-93b2-fdaa201ad491" />
