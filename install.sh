#!/usr/bin/env bash
# dev by LEO - Leo Theme Pack v2 - Install/Uninstall
set -euo pipefail
SD="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TN="Orchis-Dark"
TS=$(date +%Y%m%d%H%M%S)
BU="$HOME/.leo-theme-backup-$TS"
ok(){ echo "✅ $1"; }; wr(){ echo "⚠️  $1"; }

if [[ "${1:-}" == "--uninstall" ]]; then
    echo "=== Uninstall ==="
    pkill -f orchis-sync.sh 2>/dev/null || true
    rm -f ~/.config/autostart/orchis-sync.desktop ~/.local/bin/orchis-sync.sh
    gsettings reset org.gnome.desktop.interface gtk-theme 2>/dev/null || true
    gsettings reset org.gnome.desktop.interface icon-theme 2>/dev/null || true
    gsettings reset org.gnome.desktop.interface color-scheme 2>/dev/null || true
    rm -f ~/.config/gtk-3.0/settings.ini
    rm -f ~/.config/gtk-4.0/gtk.css ~/.config/gtk-4.0/gtk-dark.css ~/.config/gtk-4.0/assets
    rm -rf ~/.themes/Orchis-Dark
    gnome-extensions disable orchis-theme-switcher@leo 2>/dev/null || true
    rm -rf ~/.local/share/gnome-shell/extensions/orchis-theme-switcher@leo
    dconf write /org/gnome/shell/enabled-extensions "$(dconf read /org/gnome/shell/enabled-extensions | sed 's/"orchis-theme-switcher@leo",\?//g')"
    [ -f "$SD/shell/gnome-shell-theme.gresource.original" ] && sudo cp "$SD/shell/gnome-shell-theme.gresource.original" /usr/share/gnome-shell/theme/Yaru/gnome-shell-theme.gresource
    [ -d /usr/share/gnome-shell/theme/Yaru.bak.20260401 ] && sudo cp /usr/share/gnome-shell/theme/Yaru.bak.20260401/gnome-shell.css /usr/share/gnome-shell/theme/Yaru/gnome-shell.css
    [ -d /boot/grub/themes/Office-window ] && { sudo rm -rf /boot/grub/themes/Office-window; ls /etc/default/grub.bak.* >/dev/null 2>&1 && sudo cp "$(ls -t /etc/default/grub.bak.*|head -1)" /etc/default/grub && sudo update-grub; }
    ok "Uninstall complete. Logout to apply."
    exit 0
fi

echo "Leo Theme Pack v2 - Installer"
SV=$(gnome-shell --version 2>/dev/null|grep -oP "[0-9]+"|head -1||echo 0)
[ "$SV" -lt 42 ] && { echo "Too old"; exit 1; }
ok "GNOME Shell $SV detected"

echo "1/8 Backup"; mkdir -p "$BU"
gsettings get org.gnome.desktop.interface gtk-theme > "$BU/gtk-theme" 2>/dev/null || true
gsettings get org.gnome.desktop.interface icon-theme > "$BU/icon-theme" 2>/dev/null || true
cp ~/.config/gtk-3.0/settings.ini "$BU/" 2>/dev/null || true
sudo cp /usr/share/gnome-shell/theme/Yaru/gnome-shell-theme.gresource "$BU/" 2>/dev/null || true
ok "Backup done"

echo "2/8 Papirus"
dpkg -l|grep -q papirus-icon-theme || { sudo add-apt-repository ppa:papirus/papirus -y; sudo apt update -qq; sudo apt install -y papirus-icon-theme papirus-folders gir1.2-ayatanaappindicator3-0.1; }
ok "Papirus"

echo "3/8 Orchis"
mkdir -p ~/.themes && cp -r "$SD/themes/Orchis-Dark" ~/.themes/
ok "Orchis-Dark"

echo "4/8 GTK config"
gsettings set org.gnome.desktop.interface gtk-theme "$TN"
gsettings set org.gnome.desktop.interface icon-theme Papirus
gsettings set org.gnome.desktop.interface color-scheme prefer-dark
mkdir -p ~/.config/gtk-3.0 ~/.config/gtk-4.0
cat > ~/.config/gtk-3.0/settings.ini << INNEREOF
[Settings]
gtk-application-prefer-dark-theme=1
gtk-theme-name=$TN
gtk-icon-theme-name=Papirus
gtk-cursor-theme-name=Yaru
gtk-font-name=Ubuntu 11
INNEREOF
rm -f ~/.config/gtk-4.0/gtk.css ~/.config/gtk-4.0/gtk-dark.css ~/.config/gtk-4.0/assets
ln -sf "$HOME/.themes/$TN/gtk-4.0/gtk.css" ~/.config/gtk-4.0/gtk.css
ln -sf "$HOME/.themes/$TN/gtk-4.0/gtk-dark.css" ~/.config/gtk-4.0/gtk-dark.css
ln -sf "$HOME/.themes/$TN/gtk-4.0/assets" ~/.config/gtk-4.0/assets
ok "GTK configured"

echo "5/8 Shell"
sudo cp "$SD/shell/gnome-shell-theme.gresource" /usr/share/gnome-shell/theme/Yaru/
sudo cp "$SD/shell/gnome-shell.css" /usr/share/gnome-shell/theme/Yaru/
ok "Shell theme"

echo "6/8 Extension"
EXT="$HOME/.local/share/gnome-shell/extensions/orchis-theme-switcher@leo"
mkdir -p "$EXT"
cp "$SD/extension/extension.js" "$EXT/"
cp "$SD/extension/metadata.json" "$EXT/"
touch "$EXT/stylesheet.css"
dconf write /org/gnome/shell/enabled-extensions "$(dconf read /org/gnome/shell/enabled-extensions|tr -d '
'|sed "s/\]/, 'orchis-theme-switcher@leo']/")"
ok "Extension registered"

echo "7/8 Sync daemon"
mkdir -p ~/.local/bin ~/.config/autostart
cp "$SD/scripts/orchis-sync.sh" ~/.local/bin/
chmod +x ~/.local/bin/orchis-sync.sh
cat > ~/.config/autostart/orchis-sync.desktop << INNEREOF2
[Desktop Entry]
Type=Application
Name=Orchis Theme Sync
Exec=$HOME/.local/bin/orchis-sync.sh
Hidden=false
NoDisplay=true
X-GNOME-Autostart-enabled=true
X-GNOME-Autostart-Delay=2
INNEREOF2
pkill -f orchis-sync.sh 2>/dev/null || true
nohup ~/.local/bin/orchis-sync.sh >/dev/null 2>&1 &
ok "Sync daemon running"

echo "8/8 GRUB"
if [ -d /boot/grub ]; then
    sudo cp -r "$SD/grub/Office-window" /boot/grub/themes/ 2>/dev/null || true
    sudo cp /etc/default/grub "/etc/default/grub.bak.$TS"
    sudo sed -i 's/GRUB_TIMEOUT_STYLE=hidden/GRUB_TIMEOUT_STYLE=menu/' /etc/default/grub
    sudo sed -i 's/GRUB_TIMEOUT=0/GRUB_TIMEOUT=5/' /etc/default/grub
    grep -q GRUB_THEME /etc/default/grub || echo 'GRUB_THEME="/boot/grub/themes/Office-window/theme.txt"'|sudo tee -a /etc/default/grub >/dev/null
    grep -q GRUB_GFXMODE /etc/default/grub || echo 'GRUB_GFXMODE=1920x1080,auto'|sudo tee -a /etc/default/grub >/dev/null
    sudo update-grub 2>/dev/null || true
    ok "GRUB theme"
fi
command -v snap >/dev/null 2>&1 && { sudo snap install gtk-theme-orchis 2>/dev/null||true; sudo snap install icon-theme-papirus 2>/dev/null||true; ok "Snap themes"; }

echo ""
echo "✅ Installation Complete!"
echo "Backup: $BU"
echo "Uninstall: bash $SD/install.sh --uninstall"
echo ""
wr "LOGOUT -> LOGIN to apply all changes."
