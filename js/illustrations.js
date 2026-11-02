const PALETTE = [
  { bg: "#e8ede2", ink: "#284335", accent: "#d3ed75", shade: "#a7b49e" },
  { bg: "#e9e9df", ink: "#35473b", accent: "#e5ba72", shade: "#b1b8aa" },
  { bg: "#e4ecea", ink: "#31545a", accent: "#c5d98b", shade: "#a5b8b2" },
  { bg: "#eee7db", ink: "#574b37", accent: "#d79a66", shade: "#c1b19a" },
];

const SHAPES = {
  tool: `<path d="M119 145 77 103l15-15 42 42 36-36a39 39 0 0 1 50-49l-25 25 21 21 25-25a39 39 0 0 1-49 50l-57 57a14 14 0 0 1-20-20z"/><path class="detail" d="m88 99 15-15m35 54 11-11"/>`,
  hammer: `<path d="M104 85 136 53l72 72-32 32zm89-44 34 34-24 24-34-34z"/><rect x="142" y="115" width="25" height="100" rx="12" transform="rotate(-45 154 165)"/><path class="detail" d="m145 88 12-12m4 30 12-12"/>`,
  screwdriver: `<path d="M132 90 181 41l18 18-49 49z"/><path d="m112 108 30-30 20 20-30 30-12 40-20-20z"/><rect x="93" y="154" width="27" height="76" rx="12" transform="rotate(42 106 192)"/><path class="detail" d="m183 46 12 12"/>`,
  drill: `<path d="M91 96h97a23 23 0 0 1 23 23v31h-41v-15h-79a20 20 0 0 1-20-20v-1a18 18 0 0 1 20-18z"/><path d="M156 150h38l-14 40h-39z"/><path d="M211 111h30v22h-30z"/><path class="detail" d="M88 111h50m15-15v18m18-18v18"/>`,
  saw: `<path d="M73 105 232 76l-20 99-139-31z"/><path d="m89 147 17 35 13-27 21 21 9-27 23 19 8-29 23 15 9-34z"/><path class="detail" d="m104 112 4 24m25-29 4 24m25-29 4 24m25-29 4 24"/>`,
  pipe: `<path d="M91 68h34v84a22 22 0 0 0 22 22h48v34h-50a54 54 0 0 1-54-54z"/><path d="M81 57h54v32H81zm103 107h32v54h-32z"/><path class="detail" d="M90 73h36m-36 13h36m69 83v32m13-32v32"/>`,
  faucet: `<path d="M92 124h83V96a34 34 0 0 1 68 0v15h-27V97a7 7 0 0 0-14 0v54H92z"/><path d="M82 112h32v22H82zm62-26V68h30v18"/><path class="detail" d="M192 75h25m-91 70v29m31-29v29m31-29v29"/>`,
  bulb: `<path d="M160 43a62 62 0 0 0-38 111c12 9 17 21 18 34h40c1-13 6-25 18-34A62 62 0 0 0 160 43z"/><path d="M140 193h40v15h-40zm5 20h30v12h-30z"/><path class="detail" d="M142 168h36m-28 15h20m-10-126v20m-54-2 14 15m111-15-14 15"/>`,
  cable: `<path d="M101 68h29v47h-29zm59 0h29v47h-29z"/><path d="M115 113v37a44 44 0 0 0 88 0v-8"/><path d="M188 140h30v-25h-30zm-89-3h30v-22H99z"/><circle cx="203" cy="146" r="13"/><path class="detail" d="M107 77v28m58-28v28m39 60v22"/>`,
  brick: `<path d="M70 101h67v41H70zm73 0h68v41h-68zM70 148h67v41H70zm73 0h68v41h-68z"/><path class="detail" d="M138 106v31m-34 16v31m68-31v31"/>`,
  bag: `<path d="m111 73 18-25h61l18 25-13 146h-72z"/><path d="M108 90h91v33h-91z"/><path class="detail" d="M133 68h52m-35 42h40m-41 22h31m-25 14h25"/>`,
  paint: `<path d="M104 71h113v49H104z"/><path d="M127 120h67l-9 95h-49z"/><path class="detail" d="M115 82h91m-71 15h51"/>`,
  brush: `<path d="M151 64h25v96h-25z"/><path d="M127 42h73v40h-73z"/><path d="M132 82h63l-8 39h-47z"/><path class="detail" d="M136 89v24m12-24v24m13-24v24m13-24v24m12-24v24"/>`,
  roller: `<path d="M82 75h112v36H82z"/><path d="M179 111h22v48h-35"/><path d="M157 151h19v66h-19z"/><path class="detail" d="M94 84h88m-88 17h88"/>`,
  bolt: `<path d="m160 45 39 22v47l-39 22-39-22V67z"/><path d="M151 132h18v85h-18zm-16 32h50v12h-50zm0 22h50v12h-50z"/><path class="detail" d="m139 73 21-12 21 12v25l-21 12-21-12z"/>`,
  tree: `<path d="M153 141h18v77h-18z"/><path d="M160 48c-20 0-34 16-31 34-19 8-20 35-2 46-5 24 24 39 42 24 23 12 48-7 41-31 18-15 8-42-13-45 0-16-16-28-37-28z"/><path class="detail" d="M160 153v45m0-47-21-20m22 13 22-22"/>`,
  shovel: `<path d="M152 95h17v95h-17z"/><path d="M147 190h27l16 31h-59z"/><path d="M145 58a16 16 0 1 1 32 0v23h-32z"/><path class="detail" d="M152 101h17m-17 12h17m-17 12h17"/>`,
  hardhat: `<path d="M90 151a70 70 0 0 1 140 0v18H90z"/><path d="M76 164h168v24H76z"/><path class="detail" d="M160 87v64m-50-41 23 30m77-30-23 30"/>`,
  glove: `<path d="M111 199 92 137q-5-17 8-21 12-4 18 12l12 28-17-70q-4-16 9-20 13-3 18 14l14 56-8-72q-2-16 11-18 14-1 16 16l8 73 3-53q1-16 14-15 13 2 12 18l-3 81q-1 43-34 57l-28 12q-28 11-42-16z"/><path class="detail" d="m123 151 20 42m15-47 10 43m14-46 6 39"/>`,
  lock: `<path d="M112 121V95a48 48 0 0 1 96 0v26h-25V95a23 23 0 0 0-46 0v26z"/><rect x="91" y="116" width="138" height="103" rx="8"/><circle cx="160" cy="157" r="10"/><path d="M155 164h10v25h-10z"/><path class="detail" d="M106 132h108"/>`,
  water: `<path d="M160 45c-18 28-56 68-56 105a56 56 0 0 0 112 0c0-37-38-77-56-105z"/><path class="detail" d="M128 162a32 32 0 0 0 32 28"/>`,
  generic: `<path d="M97 118h126v88H97z"/><path d="M116 95h88v23h-88z"/><path class="detail" d="M117 139h86m-86 18h55m-55 18h72"/>`,
};

function chooseShape(product) {
  const name = product.name.toLocaleLowerCase("es");
  const category = product.category.toLocaleLowerCase("es");
  if (name.includes("taladro") || name.includes("atornillador") || name.includes("esmeril") || name.includes("pulidora") || name.includes("sierra circular") || name.includes("lijadora")) return "drill";
  if (name.includes("martillo")) return "hammer";
  if (name.includes("destornillador")) return "screwdriver";
  if (name.includes("serrucho") || name.includes("segueta") || name.includes("disco de corte")) return "saw";
  if (name.includes("alicate") || name.includes("llave") || name.includes("pinza")) return "tool";
  if (name.includes("brocha")) return "brush";
  if (name.includes("rodillo")) return "roller";
  if (name.includes("pintura") || name.includes("barniz") || name.includes("esmalte") || name.includes("anticorrosivo") || name.includes("thinner") || name.includes("masilla")) return "paint";
  if (name.includes("bombillo") || name.includes("portalámparas")) return "bulb";
  if (name.includes("cable") || name.includes("breaker") || name.includes("interruptor") || name.includes("tomacorriente") || name.includes("extensión") || name.includes("regleta")) return "cable";
  if (name.includes("tubo") || name.includes("codo") || name.includes("tee pvc") || name.includes("unión") || name.includes("sifón") || name.includes("flexible") || name.includes("pegante para pvc") || category === "plomería") return "pipe";
  if (name.includes("grifo") || name.includes("llave de paso")) return "faucet";
  if (name.includes("tornillo") || name.includes("tuerca") || name.includes("arandela") || name.includes("clavo")) return "bolt";
  if (name.includes("candado") || name.includes("cerradura") || name.includes("cerrojo") || name.includes("chapa") || name.includes("bisagra")) return "lock";
  if (name.includes("guante")) return "glove";
  if (name.includes("casco") || name.includes("chaleco") || name.includes("gafa")) return "hardhat";
  if (name.includes("manguera") || name.includes("aspersor")) return "water";
  if (name.includes("pala") || name.includes("rastrillo") || name.includes("tijera de podar") || name.includes("podadora")) return "shovel";
  if (name.includes("árbol") || name.includes("tierra") || name.includes("fertilizante")) return "tree";
  if (name.includes("ladrillo") || name.includes("malla") || name.includes("varilla") || name.includes("alambre") || name.includes("cemento") || name.includes("arena") || name.includes("cal")) return "brick";
  if (name.includes("espuma") || name.includes("silicona") || name.includes("impermeabilizante")) return "bag";
  if (category === "herramientas manuales") return "tool";
  if (category === "herramientas eléctricas") return "drill";
  if (category === "pinturas") return "paint";
  if (category === "electricidad") return "bulb";
  if (category === "tornillería") return "bolt";
  if (category === "jardinería") return "tree";
  if (category === "seguridad") return "hardhat";
  if (category === "cerraduras") return "lock";
  if (category === "construcción") return "brick";
  return "generic";
}

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[char]);
}

function productLabel(name) {
  const words = String(name).trim().split(/\s+/);
  let label = "";
  for (const word of words) {
    if (`${label} ${word}`.trim().length > 27) break;
    label = `${label} ${word}`.trim();
  }
  return label || String(name).slice(0, 27);
}

export function productIllustration(product) {
  let seed = 0;
  for (const char of `${product.id}${product.name}`) seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  const colors = PALETTE[seed % PALETTE.length];
  const rotation = (seed % 7) - 3;
  const label = escapeXml(productLabel(product.name));
  const category = escapeXml(product.category.toLocaleUpperCase("es"));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 260" role="img" aria-label="Ilustración referencial de ${escapeXml(product.name)}">
    <rect width="320" height="260" fill="${colors.bg}"/>
    <path d="M0 214 320 168v92H0z" fill="${colors.shade}" opacity=".18"/>
    <circle cx="246" cy="59" r="49" fill="${colors.accent}" opacity=".36"/>
    <circle cx="246" cy="59" r="62" fill="none" stroke="${colors.ink}" stroke-opacity=".08"/>
    <g fill="${colors.ink}" stroke="${colors.ink}" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${rotation} 160 135)">${SHAPES[chooseShape(product)]}</g>
    <g class="detail" fill="none" stroke="${colors.accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${rotation} 160 135)">${SHAPES[chooseShape(product)]}</g>
    <path d="M20 220h280" stroke="${colors.ink}" stroke-opacity=".16"/>
    <text x="20" y="239" fill="${colors.ink}" font-family="Arial,sans-serif" font-size="12" font-weight="700">${label}</text>
    <text x="300" y="239" text-anchor="end" fill="${colors.ink}" fill-opacity=".62" font-family="Arial,sans-serif" font-size="8" font-weight="700" letter-spacing="1.2">${category}</text>
    <text x="20" y="25" fill="${colors.ink}" fill-opacity=".56" font-family="Arial,sans-serif" font-size="8" font-weight="700" letter-spacing="1.4">ILUSTRACIÓN REFERENCIAL</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
