
import { NavLink, Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  ExternalLink,
  Film,
  PlaySquare,
  Plus,
  Server,
  Settings,
  Star,
  Trash2,
  Users,
  Save,
  X,
  Search,
  Download,
  RotateCcw,
} from "lucide-react";
import useAdminStore from "../../store/useAdminStore";

const nav = [
  ["/admin", "Dashboard", BarChart3],
  ["/admin/anime", "Anime", Film],
  ["/admin/episodes", "Episodes", PlaySquare],
  ["/admin/featured", "Featured", Star],
  ["/admin/providers", "API Providers", Server],
  ["/admin/users", "Users", Users],
  ["/admin/analytics", "Analytics", Activity],
  ["/admin/settings", "Settings", Settings],
];

function AdminShell({ title, eyebrow = "ADMINISTRATION", description, action, children }) {
  return (
    <div className="admin-layout admin-sub-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">A</div>
          <div><strong>AnimeVerse</strong><span>Admin Console</span></div>
        </div>
        <div className="admin-sidebar-section">
          <span>MANAGEMENT</span>
          <nav className="admin-nav">
            {nav.slice(0, 6).map(([to, label, Icon]) => (
              <NavLink key={to} to={to} end={to === "/admin"} className="admin-nav-link">
                <Icon size={18} />{label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="admin-sidebar-section">
          <span>SYSTEM</span>
          <nav className="admin-nav">
            {nav.slice(6).map(([to, label, Icon]) => (
              <NavLink key={to} to={to} className="admin-nav-link">
                <Icon size={18} />{label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Link to="/" className="admin-view-site"><ExternalLink size={17}/>View Website</Link>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <div className="admin-eyebrow">{eyebrow}</div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {action && <div className="admin-header-actions">{action}</div>}
        </header>
        {children}
      </main>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return <div className="admin-modal-backdrop" onMouseDown={onClose}>
    <div className="admin-modal" onMouseDown={(e) => e.stopPropagation()}>
      <div className="admin-modal-head"><div><h2>{title}</h2><p>Fill in the information and save your changes.</p></div><button className="icon-button" onClick={onClose}><X size={18}/></button></div>
      {children}
    </div>
  </div>;
}

const emptyAnime = { title: "", image: "", description: "", genres: "", year: "", status: "Currently Airing" };

export function AdminAnime() {
  const anime = useAdminStore(s => s.anime);
  const addAnime = useAdminStore(s => s.addAnime);
  const updateAnime = useAdminStore(s => s.updateAnime);
  const deleteAnime = useAdminStore(s => s.deleteAnime);
  const toggleAnime = useAdminStore(s => s.toggleAnime);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyAnime);

  const filtered = useMemo(() => anime.filter(a => `${a.title} ${a.description}`.toLowerCase().includes(query.toLowerCase())), [anime, query]);
  const open = (item = null) => { setEditing(item); setForm(item ? { ...emptyAnime, ...item, genres: Array.isArray(item.genres) ? item.genres.join(", ") : item.genres || "" } : emptyAnime); };
  const save = (e) => { e.preventDefault(); const data = { ...form, genres: form.genres.split(",").map(x => x.trim()).filter(Boolean), year: Number(form.year) || "" }; editing ? updateAnime(editing.id, data) : addAnime(data); setEditing(false); };

  return <AdminShell title="Anime Library" description="Add, edit, enable or remove anime titles used by your platform."
    action={<button className="primary-button" onClick={() => open()}><Plus size={17}/>Add Anime</button>}>
    <div className="admin-toolbar"><div className="admin-search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anime..."/></div><span>{anime.length} total titles</span></div>
    <section className="admin-table-panel">
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Anime</th><th>Year</th><th>Status</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>
        {filtered.map(item => <tr key={item.id}><td><div className="admin-title-cell">{item.image ? <img src={item.image} alt=""/> : <div className="admin-thumb"><Film size={18}/></div>}<div><strong>{item.title || "Untitled"}</strong><span>{Array.isArray(item.genres) ? item.genres.join(" • ") : "No genres"}</span></div></div></td><td>{item.year || "—"}</td><td><span className="admin-pill">{item.status || "Unknown"}</span></td><td><button className={`admin-toggle ${item.enabled ? "on" : ""}`} onClick={() => toggleAnime(item.id)}><span/></button></td><td><div className="admin-actions"><button className="secondary-button small" onClick={() => open(item)}>Edit</button><button className="danger-button" onClick={() => window.confirm(`Delete ${item.title || "this anime"}?`) && deleteAnime(item.id)}><Trash2 size={15}/></button></div></td></tr>)}
        {!filtered.length && <tr><td colSpan="5"><div className="admin-empty">No anime found. Add your first title.</div></td></tr>}
      </tbody></table></div>
    </section>
    {editing !== false && <Modal title={editing ? "Edit Anime" : "Add Anime"} onClose={() => setEditing(false)}><form className="admin-form-grid" onSubmit={save}><label>Title<input required value={form.title} onChange={e => setForm({...form,title:e.target.value})}/></label><label>Image URL<input value={form.image} onChange={e => setForm({...form,image:e.target.value})}/></label><label>Year<input type="number" value={form.year} onChange={e => setForm({...form,year:e.target.value})}/></label><label>Status<select value={form.status} onChange={e => setForm({...form,status:e.target.value})}><option>Currently Airing</option><option>Finished Airing</option><option>Not Yet Aired</option></select></label><label className="full">Genres <span className="hint">comma separated</span><input value={form.genres} onChange={e => setForm({...form,genres:e.target.value})}/></label><label className="full">Description<textarea rows="5" value={form.description} onChange={e => setForm({...form,description:e.target.value})}/></label><div className="admin-form-actions full"><button type="button" className="secondary-button" onClick={() => setEditing(false)}>Cancel</button><button className="primary-button"><Save size={17}/>Save Anime</button></div></form></Modal>}
  </AdminShell>;
}

const emptyEpisode = { animeId: "", number: 1, title: "", videoUrl: "", subtitleUrl: "", duration: "" };
export function AdminEpisodes() {
  const anime = useAdminStore(s => s.anime); const episodes = useAdminStore(s => s.episodes); const addEpisode = useAdminStore(s => s.addEpisode); const updateEpisode = useAdminStore(s => s.updateEpisode); const deleteEpisode = useAdminStore(s => s.deleteEpisode);
  const [editing, setEditing] = useState(false); const [form, setForm] = useState(emptyEpisode); const [query, setQuery] = useState("");
  const open = (item=null) => { setEditing(item); setForm(item ? {...emptyEpisode,...item} : {...emptyEpisode, animeId: anime[0]?.id || ""}); };
  const save = e => { e.preventDefault(); const data={...form,number:Number(form.number)||1}; editing ? updateEpisode(editing.id,data) : addEpisode(data); setEditing(false); };
  const name = id => anime.find(a=>String(a.id)===String(id))?.title || "Unknown anime";
  const filtered = episodes.filter(e => `${name(e.animeId)} ${e.title} ${e.number}`.toLowerCase().includes(query.toLowerCase()));
  return <AdminShell title="Episode Manager" description="Create watchable episodes and connect direct embed or video URLs."
    action={<button className="primary-button" onClick={() => open()}><Plus size={17}/>Add Episode</button>}>
    <div className="admin-toolbar"><div className="admin-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search episodes..."/></div><span>{episodes.length} episodes</span></div>
    <section className="admin-table-panel"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Anime</th><th>Episode</th><th>Video / Embed</th><th>Subtitle</th><th>Actions</th></tr></thead><tbody>{filtered.map(e=><tr key={e.id}><td><strong>{name(e.animeId)}</strong></td><td>EP {e.number}<small>{e.title}</small></td><td><span className="truncate-cell">{e.videoUrl || "Not configured"}</span></td><td>{e.subtitleUrl ? "Configured" : "—"}</td><td><div className="admin-actions"><button className="secondary-button small" onClick={()=>open(e)}>Edit</button><button className="danger-button" onClick={()=>window.confirm("Delete this episode?")&&deleteEpisode(e.id)}><Trash2 size={15}/></button></div></td></tr>)}{!filtered.length&&<tr><td colSpan="5"><div className="admin-empty">No episodes yet.</div></td></tr>}</tbody></table></div></section>
    {editing !== false && <Modal title={editing ? "Edit Episode" : "Add Episode"} onClose={()=>setEditing(false)}><form className="admin-form-grid" onSubmit={save}><label>Anime<select required value={form.animeId} onChange={e=>setForm({...form,animeId:e.target.value})}><option value="">Select anime</option>{anime.map(a=><option key={a.id} value={a.id}>{a.title}</option>)}</select></label><label>Episode Number<input type="number" min="1" value={form.number} onChange={e=>setForm({...form,number:e.target.value})}/></label><label>Episode Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Duration<input placeholder="24:00" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}/></label><label className="full">Video / Direct Embed URL<input required value={form.videoUrl} onChange={e=>setForm({...form,videoUrl:e.target.value})} placeholder="https://..."/></label><label className="full">Subtitle URL<input value={form.subtitleUrl} onChange={e=>setForm({...form,subtitleUrl:e.target.value})} placeholder="https://... .vtt"/></label><div className="admin-form-actions full"><button type="button" className="secondary-button" onClick={()=>setEditing(false)}>Cancel</button><button className="primary-button"><Save size={17}/>Save Episode</button></div></form></Modal>}
  </AdminShell>;
}

export function AdminFeatured() {
  const anime=useAdminStore(s=>s.anime); const featured=useAdminStore(s=>s.featured); const addFeatured=useAdminStore(s=>s.addFeatured); const removeFeatured=useAdminStore(s=>s.removeFeatured); const [selected,setSelected]=useState("");
  const featuredAnime=featured.map(f=>({...f, anime:anime.find(a=>String(a.id)===String(f.animeId))})).filter(x=>x.anime);
  return <AdminShell title="Featured Content" description="Choose which titles appear in your homepage featured section." action={<Link to="/admin/anime" className="secondary-button"><Film size={17}/>Manage Anime</Link>}>
    <section className="admin-panel"><div className="admin-panel-header"><div><div className="admin-panel-label">HOMEPAGE</div><h2>Featured titles</h2><p>Add or remove anime from the featured rotation.</p></div></div><div className="admin-add-row"><select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Select an anime...</option>{anime.filter(a=>!featured.some(f=>String(f.animeId)===String(a.id))).map(a=><option key={a.id} value={a.id}>{a.title}</option>)}</select><button className="primary-button" disabled={!selected} onClick={()=>{addFeatured(selected);setSelected("")}}><Plus size={17}/>Add to Featured</button></div><div className="featured-admin-grid">{featuredAnime.map((x,i)=><article className="featured-admin-card" key={x.animeId}>{x.anime.image?<img src={x.anime.image} alt=""/>:<div className="featured-placeholder"><Film/></div>}<div><span>Position {i+1}</span><h3>{x.anime.title}</h3><p>{x.anime.description || "No description"}</p><button className="danger-text" onClick={()=>removeFeatured(x.animeId)}>Remove</button></div></article>)}{!featuredAnime.length&&<div className="admin-empty">No featured titles yet.</div>}</div></section>
  </AdminShell>;
}

export function AdminUsers() { const users=useAdminStore(s=>s.users); const [q,setQ]=useState(""); const filtered=users.filter(u=>`${u.name||""} ${u.email||""}`.toLowerCase().includes(q.toLowerCase())); return <AdminShell title="User Management" description="Review registered users and account activity stored by the application."><div className="admin-toolbar"><div className="admin-search"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search users..."/></div><span>{users.length} registered</span></div><section className="admin-table-panel"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>{filtered.map((u,i)=><tr key={u.id||i}><td><strong>{u.name||"Unnamed user"}</strong></td><td>{u.email||"—"}</td><td><span className="admin-pill">{u.role||"user"}</span></td><td>{u.createdAt?new Date(u.createdAt).toLocaleDateString():"—"}</td></tr>)}{!filtered.length&&<tr><td colSpan="4"><div className="admin-empty">No registered users are stored yet.</div></td></tr>}</tbody></table></div></section></AdminShell>; }

export function AdminAnalytics() { const anime=useAdminStore(s=>s.anime); const episodes=useAdminStore(s=>s.episodes); const providers=useAdminStore(s=>s.providers); const users=useAdminStore(s=>s.users); const featured=useAdminStore(s=>s.featured); return <AdminShell title="Analytics" description="A lightweight overview of your local AnimeVerse administration data."><div className="analytics-cards">{[["Anime",anime.length,Film],["Episodes",episodes.length,PlaySquare],["Users",users.length,Users],["Providers",providers.filter(p=>p.enabled).length,Server],["Featured",featured.length,Star]].map(([t,v,I])=><div className="analytics-card" key={t}><I size={22}/><span>{t}</span><strong>{v}</strong></div>)}</div><section className="admin-panel"><div className="admin-panel-header"><div><div className="admin-panel-label">STATUS</div><h2>Platform overview</h2></div></div><div className="health-list"><div><span>Enabled API providers</span><b>{providers.filter(p=>p.enabled).length}</b></div><div><span>Primary API</span><b>{providers.find(p=>p.primary)?.name||"Not configured"}</b></div><div><span>Anime catalog</span><b>{anime.length}</b></div><div><span>Episodes</span><b>{episodes.length}</b></div><div><span>Registered users</span><b>{users.length}</b></div></div></section></AdminShell>; }

export function AdminSettings() { const settings=useAdminStore(s=>s.settings); const updateSettings=useAdminStore(s=>s.updateSettings); const exportData=useAdminStore(s=>s.exportData); const reset=useAdminStore(s=>s.resetAdminData); const download=()=>{const blob=new Blob([JSON.stringify(exportData(),null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="animeverse-admin-backup.json";a.click();URL.revokeObjectURL(url)}; return <AdminShell title="System Settings" description="Control site behaviour and export your administration data."><section className="admin-panel settings-panel"><div className="setting-row"><div><strong>Maintenance mode</strong><span>Show the site as temporarily unavailable.</span></div><button className={`admin-toggle ${settings.maintenanceMode?"on":""}`} onClick={()=>updateSettings({maintenanceMode:!settings.maintenanceMode})}><span/></button></div><div className="setting-row"><div><strong>Allow registration</strong><span>Let visitors create new accounts.</span></div><button className={`admin-toggle ${settings.allowRegistration?"on":""}`} onClick={()=>updateSettings({allowRegistration:!settings.allowRegistration})}><span/></button></div><div className="setting-row"><div><strong>Guest watching</strong><span>Allow visitors to watch without an account.</span></div><button className={`admin-toggle ${settings.allowGuestWatching?"on":""}`} onClick={()=>updateSettings({allowGuestWatching:!settings.allowGuestWatching})}><span/></button></div><div className="setting-row"><div><strong>Site name</strong><span>Brand name shown by the application.</span></div><input className="setting-input" value={settings.siteName} onChange={e=>updateSettings({siteName:e.target.value})}/></div><div className="settings-danger"><div><strong>Data tools</strong><span>Export a backup before making major changes.</span></div><div className="admin-header-actions"><button className="secondary-button" onClick={download}><Download size={17}/>Export JSON</button><button className="danger-button wide" onClick={()=>window.confirm("Reset all local admin data?")&&reset()}><RotateCcw size={17}/>Reset Admin Data</button></div></div></section></AdminShell>; }
