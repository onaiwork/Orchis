/* dev by LEO — Orchis Theme Switcher v11 — Icon updates immediately */
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const H = GLib.get_home_dir();
const SCHEMA = 'org.gnome.desktop.interface';

const DARK = [
    ['Default','Orchis-Dark'],['Purple','Orchis-Purple-Dark'],['Pink','Orchis-Pink-Dark'],
    ['Red','Orchis-Red-Dark'],['Orange','Orchis-Orange-Dark'],['Yellow','Orchis-Yellow-Dark'],
    ['Green','Orchis-Green-Dark'],['Teal','Orchis-Teal-Dark'],['Grey','Orchis-Grey-Dark'],
];
const LIGHT = [
    ['Default','Orchis-Light'],['Purple','Orchis-Purple-Light'],['Pink','Orchis-Pink-Light'],
    ['Red','Orchis-Red-Light'],['Orange','Orchis-Orange-Light'],['Yellow','Orchis-Yellow-Light'],
    ['Green','Orchis-Green-Light'],['Teal','Orchis-Teal-Light'],['Grey','Orchis-Grey-Light'],
];
const COMPACT_D = [
    ['Default','Orchis-Dark-Compact'],['Purple','Orchis-Purple-Dark-Compact'],
    ['Pink','Orchis-Pink-Dark-Compact'],['Red','Orchis-Red-Dark-Compact'],
    ['Orange','Orchis-Orange-Dark-Compact'],['Yellow','Orchis-Yellow-Dark-Compact'],
    ['Green','Orchis-Green-Dark-Compact'],['Teal','Orchis-Teal-Dark-Compact'],
    ['Grey','Orchis-Grey-Dark-Compact'],
];
const COMPACT_L = [
    ['Default','Orchis-Light-Compact'],['Purple','Orchis-Purple-Light-Compact'],
    ['Pink','Orchis-Pink-Light-Compact'],['Red','Orchis-Red-Light-Compact'],
    ['Orange','Orchis-Orange-Light-Compact'],['Yellow','Orchis-Yellow-Light-Compact'],
    ['Green','Orchis-Green-Light-Compact'],['Teal','Orchis-Teal-Light-Compact'],
    ['Grey','Orchis-Grey-Light-Compact'],
];

const CI = {'Default':'#3584e4','Purple':'#9141ac','Pink':'#f66151','Red':'#e01b24',
            'Orange':'#ff7800','Yellow':'#f6d32d','Green':'#33d17a','Teal':'#38b2ac','Grey':'#9a9996'};
const EI = {'Default':'🔵','Purple':'🟣','Pink':'🩷','Red':'🔴','Orange':'🟠','Yellow':'🟡','Green':'🟢','Teal':'🩵','Grey':'⚪'};
function eIcon(t){for(const[k,v]of Object.entries(EI))if(t.includes(k))return v;return '🔵';}
function cColor(t){for(const[k,v]of Object.entries(CI))if(t.includes(k))return v;return '#3584e4';}
function getColorName(t){for(const c of['Purple','Pink','Red','Orange','Yellow','Green','Teal','Grey'])if(t.includes(c))return c;return 'Default';}
function toDark(t){const c=getColorName(t);const x=t.toLowerCase().includes('compact');return c==='Default'?(x?'Orchis-Dark-Compact':'Orchis-Dark'):(x?`Orchis-${c}-Dark-Compact`:`Orchis-${c}-Dark`);}
function toLight(t){const c=getColorName(t);const x=t.toLowerCase().includes('compact');return c==='Default'?(x?'Orchis-Light-Compact':'Orchis-Light'):(x?`Orchis-${c}-Light-Compact`:`Orchis-${c}-Light`);}

// Global reference to update icon from anywhere
let _globalBtn = null;
function updateIcon(dark){
    if(_globalBtn && _globalBtn._icon)
        _globalBtn._icon.icon_name = dark ? 'weather-clear-night-symbolic' : 'weather-clear-symbolic';
}

function applyAll(t){
    const s = new Gio.Settings({schema:SCHEMA});
    const dark = t.includes('Dark');
    s.set_string('gtk-theme', t);
    s.set_string('icon-theme', dark?'Papirus':'Papirus-Light');
    s.set_string('color-scheme', dark?'prefer-dark':'default');
    // Update icon immediately
    updateIcon(dark);
    // GTK3
    const d=H+'/.config/gtk-3.0';GLib.mkdir_with_parents(d,0o755);
    GLib.file_set_contents(d+'/settings.ini',
        '[Settings]\ngtk-application-prefer-dark-theme='+(dark?'1':'0')+
        '\ngtk-theme-name='+t+'\ngtk-icon-theme-name='+(dark?'Papirus':'Papirus-Light')+
        '\ngtk-cursor-theme-name=Yaru\ngtk-font-name=Ubuntu 11\n');
    // GTK4
    const src=H+'/.themes/'+t+'/gtk-4.0',dd=H+'/.config/gtk-4.0';
    GLib.mkdir_with_parents(dd,0o755);
    for(const f of['gtk.css','gtk-dark.css','assets']){
        const l=dd+'/'+f;try{Gio.File.new_for_path(l).delete(null);}catch(e){}
        if(Gio.File.new_for_path(src+'/'+f).query_exists(null))
            GLib.spawn_command_line_sync('/bin/ln -sf "'+src+'/'+f+'" "'+l+'"');
    }
}

const STYLES = {
    header:'font-weight:bold; font-size:1.1em; min-width:560px; padding:6px 12px;',
    colTitle:'font-weight:bold; font-size:0.9em; color:rgba(255,255,255,0.55); padding:6px 10px 8px; letter-spacing:1.5px; text-transform:uppercase;',
    item:'padding:6px 10px; border-radius:8px; font-size:0.95em; color:rgba(255,255,255,0.9);',
    itemActive(ac){return this.item+' background:'+ac+'44; font-weight:bold; color:white;';},
    itemHover:'padding:6px 10px; border-radius:8px; font-size:0.95em; background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.95);',
    colBox:'spacing:2px; min-width:185px;',
    sep:'width:1px; background:rgba(255,255,255,0.12); margin:4px 6px;',
};

function mkItem(n,t,current,btn){
    const on=current===t;const ac=cColor(t);
    const lbl=new St.Label({
        text:(on?' ● ':'    ')+eIcon(t)+'  '+n, reactive:true, track_hover:true,
        style:on?STYLES.itemActive(ac):STYLES.item,
    });
    lbl.connect('enter-event',()=>{if(!on)lbl.style=STYLES.itemHover;});
    lbl.connect('leave-event',()=>{if(!on)lbl.style=STYLES.item;});
    lbl.connect('button-press-event',()=>{
        applyAll(t);
        GLib.timeout_add(GLib.PRIORITY_DEFAULT,200,()=>{fill(btn);return GLib.SOURCE_REMOVE;});
    });
    return lbl;
}

function mkCol(title,themes,current,btn){
    const box=new St.BoxLayout({vertical:true,style:STYLES.colBox});
    box.add_child(new St.Label({text:title,style:STYLES.colTitle}));
    for(const[n,t]of themes)box.add_child(mkItem(n,t,current,btn));
    return box;
}

function mkCompactCol(current,btn){
    const box=new St.BoxLayout({vertical:true,style:STYLES.colBox});
    box.add_child(new St.Label({text:'COMPACT',style:STYLES.colTitle}));
    for(const[n,t]of COMPACT_D)box.add_child(mkItem('D. '+n,t,current,btn));
    box.add_child(new St.Widget({style:'height:8px;'}));
    for(const[n,t]of COMPACT_L)box.add_child(mkItem('L. '+n,t,current,btn));
    return box;
}

function fill(btn){
    btn.menu.removeAll();
    const c=new Gio.Settings({schema:SCHEMA}).get_string('gtk-theme');
    const dark=c.includes('Dark');
    const hdr=new PopupMenu.PopupMenuItem(
        (dark?'🌙 Dark':'☀️ Light')+'   '+eIcon(c)+'  '+c,{reactive:false});
    hdr.label.style=STYLES.header;
    btn.menu.addMenuItem(hdr);
    btn.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    const row=new St.BoxLayout({style:'spacing:0; padding:4px 6px;'});
    row.add_child(mkCol('DARK 🌙',DARK,c,btn));
    row.add_child(new St.Widget({style:STYLES.sep}));
    row.add_child(mkCol('LIGHT ☀️',LIGHT,c,btn));
    row.add_child(new St.Widget({style:STYLES.sep}));
    row.add_child(mkCompactCol(c,btn));
    const wrap=new PopupMenu.PopupBaseMenuItem({reactive:false});
    wrap.add_child(row);
    btn.menu.addMenuItem(wrap);
}

const Btn=GObject.registerClass({GTypeName:'OrchisBtn_v11'},class Btn extends PanelMenu.Button{
    _init(){
        super._init(0.0,'Orchis Theme Switcher',false);
        const cur=new Gio.Settings({schema:SCHEMA}).get_string('gtk-theme');
        this._icon=new St.Icon({
            icon_name:cur.includes('Dark')?'weather-clear-night-symbolic':'weather-clear-symbolic',
            style_class:'system-status-icon',icon_size:18,
        });
        this.add_child(this._icon);
        fill(this);
    }
});

export default class Ext{
    enable(){
        this._btn=new Btn();
        _globalBtn=this._btn;
        Main.panel.addToStatusArea('orchis-theme-switcher',this._btn,1,'right');
        // Listen for external color-scheme changes (Quick Settings)
        this._iface=new Gio.Settings({schema:SCHEMA});
        this._csId=this._iface.connect('changed::color-scheme',()=>{
            const cs=this._iface.get_string('color-scheme');
            const cur=this._iface.get_string('gtk-theme');
            const wantDark=cs==='prefer-dark';
            const isDark=cur.includes('Dark');
            if(wantDark!==isDark){
                const nt=wantDark?toDark(cur):toLight(cur);
                applyAll(nt);
            } else {
                // Icon might be wrong, sync it
                updateIcon(isDark);
            }
        });
        // Also listen for gtk-theme changes
        this._gtId=this._iface.connect('changed::gtk-theme',()=>{
            const cur=this._iface.get_string('gtk-theme');
            updateIcon(cur.includes('Dark'));
        });
    }
    disable(){
        _globalBtn=null;
        if(this._csId&&this._iface){this._iface.disconnect(this._csId);this._csId=null;}
        if(this._gtId&&this._iface){this._iface.disconnect(this._gtId);this._gtId=null;}
        if(this._btn){this._btn.destroy();this._btn=null;}
    }
}
