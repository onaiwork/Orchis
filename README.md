# Leo Theme Pack v2

Orchis-Dark GTK theme + Papirus Icons + GNOME Shell theme + GRUB + Extension + Sync Daemon.

## Cài đặt

cd leo-theme-pack
bash install.sh

Sau đó **logout → login**.

## Gỡ bỏ

bash install.sh --uninstall

## Thành phần

| File | Mô tả | Dung lượng |
|---|---|---|
| themes/Orchis-Dark/ | GTK theme (round 10px, dock tweak, libadwaita) | 3.1 MB |
| shell/gnome-shell-theme.gresource | GNOME Shell theme (gdm.css included) | 9.1 MB |
| shell/gnome-shell.css | Shell CSS patched (notification, popup, modal) | - |
| shell/gnome-shell-theme.gresource.original | Backup gresource gốc Yaru | - |
| extension/extension.js | Theme Switcher v11 (GNOME 46+ ESM) | 20 KB |
| extension/metadata.json | Extension metadata | - |
| scripts/orchis-sync.sh | Sync daemon (Quick Settings dark/light ↔ Orchis) | 8 KB |
| grub/Office-window/ | GRUB boot theme (1080p) | 14 MB |
| install.sh | Install/Uninstall script (120 lines) | - |

**Tổng: 26 MB, 534 files**

## Chức năng

### Install script (8 bước)
1. Backup config hiện tại
2. Cài Papirus icons qua PPA
3. Copy Orchis-Dark vào ~/.themes/
4. Config gsettings + GTK3 settings.ini + GTK4 libadwaita symlinks
5. Install Shell gresource + CSS
6. Install Extension + register dconf
7. Install Sync daemon + autostart
8. Install GRUB theme + update grub config

### Theme Switcher Extension (v11)
- Icon toolbar: 🌙 (dark) / ☀️ (light) — tự đổi theo theme
- 3 cột grid: DARK | LIGHT | COMPACT
- Accent color highlight cho variant đang chọn
- Chọn thủ công → đổi gtk-theme + icon + GTK3 + GTK4 + color-scheme

### Sync Daemon
- Lắng nghe  gsettings changes
- Quick Settings dark/light toggle → tự sync Orchis-Dark ↔ Orchis-Light
- Papirus ↔ Papirus-Light
- GTK3 settings.ini + GTK4 symlinks
- Autostart mỗi khi login

### Dark/Light Toggle
- Quick Settings toggle: đồng bộ 2 chiều
- Extension menu: chọn thủ công → sync ngược Quick Settings
- Icons: Papirus (dark) / Papirus-Light (light)
- gtk-application-prefer-dark-theme: auto set 1/0

## Tương thích

- GNOME Shell 42-48
- Ubuntu 22.04+
- Wayland & X11
- GRUB 2.x

## Sau cài đặt

- 🌙/☀️  Toolbar icon (switch dark/light)
- 🎨 Orchis-Dark trên tất cả GTK apps
- 🖥️  Orchis shell theme (panel, dock, overview, notifications)
- 📁 Office GRUB theme khi boot
- ⚡ Quick Settings dark/light toggle synced
