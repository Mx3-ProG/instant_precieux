import type { PageView } from "@/lib/analytics";
import AdminTrafficGlobe from "@/components/AdminTrafficGlobe";

const pageLabels: Record<string, string> = {
  "/": "Accueil",
  "/portfolio": "Portfolio",
  "/catalogue": "Prestations",
  "/a-propos": "Qui sommes-nous",
  "/ou-nous-trouver": "Où nous trouver",
  "/contact": "Contact",
  "/devis": "Demande de devis",
};

export default function AdminAnalytics({ views }: { views: PageView[] }) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return {
      label: date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
      visites: views.filter((view) => {
        const viewedAt = new Date(view.created_at);
        return viewedAt >= date && viewedAt < next;
      }).length,
    };
  });
  const pageTotals = Object.entries(views.reduce<Record<string, number>>((totals, view) => {
    totals[view.path] = (totals[view.path] || 0) + 1;
    return totals;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(1, ...days.map((day) => day.visites));
  const pageMax = Math.max(1, ...pageTotals.map(([, total]) => total));
  const points = days.map((day, index) => `${36 + index * 72},${216 - day.visites / max * 166}`).join(" ");
  const areaPoints = `36,216 ${points} 468,216`;

  return <>
    <AdminTrafficGlobe views={views} />
    <section className="analytics-grid">
    <article className="dashboard-panel chart-panel">
      <div className="panel-head"><div><h2>Visibilité des pages</h2><p>Visites enregistrées au cours des 7 derniers jours.</p></div><span className="live-chip">Données réelles</span></div>
      <div className="chart-wrap" aria-label="Graphique des visites des sept derniers jours">
        <svg className="native-chart" viewBox="0 0 504 250" role="img" aria-label={`${views.length} pages vues`} preserveAspectRatio="none">
          {[50, 105, 160, 216].map((y) => <line key={y} x1="36" x2="468" y1={y} y2={y} className="chart-grid-line"/>)}
          <polygon points={areaPoints} className="chart-area"/><polyline points={points} className="chart-line"/>
          {days.map((day, index) => <g key={day.label}><circle cx={36 + index * 72} cy={216 - day.visites / max * 166} r="4" className="chart-dot"/><text x={36 + index * 72} y="242" textAnchor="middle">{day.label}</text></g>)}
        </svg>
      </div>
    </article>
    <article className="dashboard-panel pages-panel">
      <div className="panel-head"><div><h2>Pages consultées</h2><p>Classement par nombre de vues.</p></div></div>
      {pageTotals.length ? <div className="page-ranking">{pageTotals.map(([path, total]) => <div className="page-rank" key={path}><div><strong>{pageLabels[path] || path}</strong><span>{total} visite{total > 1 ? "s" : ""}</span></div><div className="rank-track"><span style={{ width: `${Math.max(8, total / pageMax * 100)}%` }}/></div></div>)}</div> : <div className="empty-analytics">Les premières visites apparaîtront ici.</div>}
    </article>
    </section>
  </>;
}
