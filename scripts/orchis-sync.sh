#!/bin/bash
# dev by LEO — Orchis Theme Sync Daemon
# Watches color-scheme and syncs GTK + Icons + GTK3 + GTK4
SCHEMA="org.gnome.desktop.interface"
H="$HOME"
get_theme(){ gsettings get $SCHEMA gtk-theme | tr -d "'"; }
get_cs(){ gsettings get $SCHEMA color-scheme | tr -d "'"; }
get_color(){ for c in Purple Pink Red Orange Yellow Green Teal Grey; do [[ "$1" == *"$c"* ]] && echo "$c" && return; done; echo "Default"; }
to_dark(){ local c=$(get_color "$1"); local x=$([[ "$1" == *"[Cc]ompact"* ]] && echo 1); [[ "$c"=="Default" ]] && { [[ "$x"==1 ]]&&echo Orchis-Dark-Compact||echo Orchis-Dark; } || { [[ "$x"==1 ]]&&echo Orchis-${c}-Dark-Compact||echo Orchis-${c}-Dark; }; }
to_light(){ local c=$(get_color "$1"); local x=$([[ "$1" == *"[Cc]ompact"* ]] && echo 1); [[ "$c"=="Default" ]] && { [[ "$x"==1 ]]&&echo Orchis-Light-Compact||echo Orchis-Light; } || { [[ "$x"==1 ]]&&echo Orchis-${c}-Light-Compact||echo Orchis-${c}-Light; }; }
apply(){ local t="$1"; local d=$([[ "$t"==*"Dark"* ]]&&echo 1); local i=$([[ "$d"==1 ]]&&echo Papirus||echo Papirus-Light);
gsettings set $SCHEMA gtk-theme "$t"; gsettings set $SCHEMA icon-theme "$i";
mkdir -p "$H/.config/gtk-3.0"; printf '[Settings]\ngtk-application-prefer-dark-theme=%s\ngtk-theme-name=%s\ngtk-icon-theme-name=%s\ngtk-cursor-theme-name=Yaru\ngtk-font-name=Ubuntu 11\n' "$d" "$t" "$i" > "$H/.config/gtk-3.0/settings.ini";
mkdir -p "$H/.config/gtk-4.0"; for f in gtk.css gtk-dark.css assets; do rm -f "$H/.config/gtk-4.0/$f"; [ -f "$H/.themes/$t/gtk-4.0/$f" ] && ln -sf "$H/.themes/$t/gtk-4.0/$f" "$H/.config/gtk-4.0/$f"; done; }
gsettings monitor $SCHEMA color-scheme | while read -r; do sleep 0.3; cs=$(get_cs); cur=$(get_theme); wd=$([[ "$cs"=="prefer-dark" ]]&&echo 1); id=$([[ "$cur"==*"Dark"* ]]&&echo 1); [ "$wd" != "$id" ] && { [ "$wd"==1 ] && apply "$(to_dark "$cur")" || apply "$(to_light "$cur")"; }; done
