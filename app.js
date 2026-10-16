const $ = (id) => document.getElementById(id);

const defaults = {
  economic: 80, civil: 90, culture: 85, health: 75, security: 70,
  education: 75, tax: 50, efficiency: 55
};

// Modelo de demostración. Las unidades no son balboas, % del PIB ni datos oficiales.
const baseBudget = [
  { key: "health", name: "Salud", base: 20, service: true, note: "Cobertura, personal, medicamentos e infraestructura" },
  { key: "security", name: "Seguridad pública", base: 15, service: true, note: "Prevención, justicia y respuesta pública" },
  { key: "education", name: "Educación", base: 18, service: true, note: "Centros, docentes, materiales y calidad" },
  { key: "infrastructure", name: "Infraestructura", base: 14, service: false, note: "Mantenimiento e inversión pública" },
  { key: "social", name: "Protección social", base: 12, service: false, note: "Apoyos focalizados y protección ante contingencias" },
  { key: "administration", name: "Administración", base: 12, service: false, note: "Operación pública y gestión" },
  { key: "environment", name: "Ambiente y cultura", base: 5, service: false, note: "Protección ambiental, cultura e investigación" },
  { key: "debt", name: "Servicio de deuda", base: 4, service: false, note: "Compromisos financieros; no se recortan automáticamente" }
];

const checklistItems = [
  ["rights", "Piso de derechos no negociable", "Expresión, igualdad, debido proceso, conciencia y acceso a justicia no se apagan por falta de presupuesto."],
  ["costing", "Costeo público de cada garantía", "Cada nuevo derecho prestacional debe indicar población cubierta, estándar mínimo, coste recurrente y fuente de financiación."],
  ["revenue", "Memoria de ingresos", "Toda propuesta de reducción de impuestos o aumento de gasto debe mostrar un escenario de ingresos conservador, central y alto."],
  ["budget", "Presupuesto por resultados", "Publicar asignación, ejecución, compras, metas y resultados por institución y programa."],
  ["audit", "Auditoría independiente", "Auditar contratos, subsidios, deuda, empresas públicas y ahorros declarados."],
  ["competition", "Competencia y acceso", "Revisar barreras de entrada, monopolios, conflictos de interés y compras públicas."],
  ["sunset", "Revisión periódica", "Las políticas nuevas deben evaluarse en plazos definidos y corregirse si no cumplen sus objetivos."],
  ["emergency", "Excepciones de emergencia", "Definir causas, duración, supervisión judicial y legislativa, y límites a la contratación excepcional."],
  ["equity", "Evaluación distributiva", "Medir efectos por ingreso, región, edad, discapacidad y acceso a servicios sin discriminar."],
  ["data", "Datos abiertos y privacidad", "Publicar datos agregados verificables, protegiendo información personal y sensible."]
];

function val(id) { return Number($(id).value); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function fmt(n) { return n.toLocaleString("es-PA", {maximumFractionDigits: 1, minimumFractionDigits: 1}); }

function model() {
  const p = Object.fromEntries(Object.keys(defaults).map(k => [k, val(k)]));
  // Índice abstracto de ingresos: 75 a 125 unidades según esfuerzo tributario.
  const revenue = 75 + p.tax * 0.5;
  // Mayor eficiencia libera recursos, pero no más del 12% del gasto de base.
  const savingsRate = p.efficiency * 0.0012;
  const rows = baseBudget.map(item => {
    let plannedAmount = item.base;
    if (item.key === "health") plannedAmount *= 0.55 + p.health / 100 * 0.9;
    if (item.key === "security") plannedAmount *= 0.55 + p.security / 100 * 0.9;
    if (item.key === "education") plannedAmount *= 0.55 + p.education / 100 * 0.9;
    if (item.key === "environment") plannedAmount *= 0.55 + p.culture / 100 * 0.9;
    let amount = plannedAmount;
    if (item.key === "administration") amount *= 1 - savingsRate;
    if (item.key === "infrastructure" || item.key === "social") amount *= 1 - savingsRate * 0.35;
    return {...item, plannedAmount, amount};
  });
  const plannedSpending = rows.reduce((s, r) => s + r.plannedAmount, 0);
  const spending = rows.reduce((s, r) => s + r.amount, 0);
  const savings = plannedSpending - spending;
  const balance = revenue - spending;
  // Compuesto para discusión; no mide derechos reales ni permite compensar abusos.
  const freedom = Math.round(p.economic * 0.4 + p.civil * 0.35 + p.culture * 0.25);
  return {p, revenue, rows, plannedSpending, savings, spending, balance, freedom, savingsRate};
}

function render() {
  const m = model();
  Object.keys(defaults).forEach(k => $(k + "Out").textContent = `${m.p[k]}/100`);
  $("revenue").textContent = fmt(m.revenue);
  $("spending").textContent = fmt(m.spending);
  $("balance").textContent = `${m.balance >= 0 ? "+" : ""}${fmt(m.balance)}`;
  $("balance").parentElement.classList.toggle("negative", m.balance < 0);
  $("balance").parentElement.classList.toggle("positive", m.balance >= 0);
  $("balanceLabel").textContent = m.balance < -0.05 ? "déficit simulado" : m.balance > 0.05 ? "superávit simulado" : "balance aproximado";
  $("freedom").textContent = `${m.freedom}/100`;
  $("budgetRows").innerHTML = "";
  const max = Math.max(...m.rows.map(r => r.amount));
  m.rows.forEach(r => {
    const row = document.createElement("div");
    row.className = "budget-row";
    row.title = r.note;
    row.innerHTML = `<div class="budget-name">${r.name}</div><div class="bar" aria-label="${r.name}"><span style="width:${(r.amount / max * 100).toFixed(1)}%"></span></div><div class="budget-value">${fmt(r.amount)} u.</div>`;
    $("budgetRows").appendChild(row);
  });
  const gap = m.balance < 0
    ? `Faltan ${fmt(Math.abs(m.balance))} unidades. Opciones para estudiar: reasignar gasto no esencial, revisar eficiencia con evidencia, ajustar ingresos legalmente o reducir gradualmente el nivel de prestación. No se debe financiar un déficit ocultándolo ni recortar automáticamente derechos fundamentales.`
    : `Hay ${fmt(m.balance)} unidades de margen simulado. Antes de ampliar programas, conviene reservar fondos para contingencias, deuda y mantenimiento y validar si los ingresos son recurrentes.`;
  $("balanceExplanation").textContent = `${gap} Ahorro potencial modelado: ${fmt(m.savings)} unidades (supuesto, no ahorro comprobado).`;
}

function getChecklist() {
  return checklistItems.map(([id, title, description]) => ({
    id, title, description, checked: $(`check-${id}`).checked
  }));
}
function snapshot() {
  const m = model();
  return {
    project: "Constitución y Libertad — Panamá",
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    disclaimer: "Escenario educativo con supuestos ilustrativos. No son datos fiscales oficiales ni asesoría legal.",
    constitutionReference: {
      source: "Tribunal Electoral de Panamá",
      url: "https://constitucion.te.gob.pa/constitucion-vigente/",
      articlesForReview: ["19-20", "37-40", "47-52", "64-75", "109-121", "257-281", "282-292"]
    },
    settings: m.p,
    results: {
      revenueUnits: Number(m.revenue.toFixed(2)),
      spendingUnits: Number(m.spending.toFixed(2)),
      balanceUnits: Number(m.balance.toFixed(2)),
      potentialSavingsUnits: Number(m.savings.toFixed(2)),
      freedomIndex: m.freedom,
      budgetAllocation: m.rows.map(r => ({category: r.name, units: Number(r.amount.toFixed(2)), baseUnits: r.base}))
    },
    constitutionalValidation: getChecklist()
  };
}
function downloadJson() {
  const blob = new Blob([JSON.stringify(snapshot(), null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "escenario-constitucional-panama.json";
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  $("exportStatus").textContent = "Escenario JSON generado. Verifica los supuestos antes de compartirlo.";
}
async function copySummary() {
  const s = snapshot();
  const summary = [
    "ESCENARIO CONSTITUCIONAL — PANAMÁ",
    `Libertad económica: ${s.settings.economic}/100`,
    `Garantías civiles: ${s.settings.civil}/100`,
    `Libertad cultural/educativa: ${s.settings.culture}/100`,
    `Salud: ${s.settings.health}/100 · Seguridad: ${s.settings.security}/100 · Educación: ${s.settings.education}/100`,
    `Esfuerzo tributario simulado: ${s.settings.tax}/100 · Eficiencia: ${s.settings.efficiency}/100`,
    `Ingresos: ${s.results.revenueUnits} u. · Gasto: ${s.results.spendingUnits} u. · Balance: ${s.results.balanceUnits} u.`,
    `Validaciones marcadas: ${s.constitutionalValidation.filter(x=>x.checked).length}/${s.constitutionalValidation.length}`,
    "NOTA: modelo ilustrativo; unidades no oficiales, no son balboas ni porcentajes del PIB."
  ].join("\n");
  try {
    await navigator.clipboard.writeText(summary);
    $("exportStatus").textContent = "Resumen copiado al portapapeles.";
  } catch {
    const ta = document.createElement("textarea"); ta.value = summary; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy"); ta.remove();
    $("exportStatus").textContent = ok ? "Resumen copiado al portapapeles." : "No se pudo copiar automáticamente; usa Exportar JSON.";
  }
}

function setupChecklist() {
  const root = $("checklist");
  checklistItems.forEach(([id, title, description]) => {
    const label = document.createElement("label");
    label.className = "check-item";
    label.innerHTML = `<input type="checkbox" id="check-${id}" checked><span>${title}<small>${description}</small></span>`;
    root.appendChild(label);
  });
}
function reset() {
  Object.entries(defaults).forEach(([k, v]) => $(k).value = v);
  render();
}
Object.keys(defaults).forEach(k => $(k).addEventListener("input", render));
$("reset").addEventListener("click", reset);
$("export").addEventListener("click", downloadJson);
$("copySummary").addEventListener("click", copySummary);
setupChecklist();
render();
