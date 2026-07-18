// ---- Lista de meses en español ----
const MESES = ["enero","febrero","marzo","abril","mayo","junio",
               "julio","agosto","septiembre","octubre","noviembre","diciembre"];

// ---- Diccionarios para convertir números a letras ----
const UNIDADES = ["","UNO","DOS","TRES","CUATRO","CINCO","SEIS","SIETE","OCHO","NUEVE","DIEZ",
  "ONCE","DOCE","TRECE","CATORCE","QUINCE","DIECISÉIS","DIECISIETE","DIECIOCHO","DIECINUEVE","VEINTE"];
const DECENAS = ["","","VEINTE","TREINTA","CUARENTA","CINCUENTA","SESENTA","SETENTA","OCHENTA","NOVENTA"];
const CENTENAS = ["","CIENTO","DOSCIENTOS","TRESCIENTOS","CUATROCIENTOS","QUINIENTOS","SEISCIENTOS","SETECIENTOS","OCHOCIENTOS","NOVECIENTOS"];

function enterosALetras(n) {
  if (n === 0) return "CERO";
  if (n === 100) return "CIEN";

  let out = "";

  if (n >= 100) {
    out += CENTENAS[Math.floor(n / 100)];
    n = n % 100;
    if (n > 0) out += " ";
  }

  if (n <= 20) {
    out += UNIDADES[n];
  } else {
    out += DECENAS[Math.floor(n / 10)];
    if (n % 10 > 0) out += " Y " + UNIDADES[n % 10];
  }

  return out.trim();
}

function montoEnLetras(valor) {
  const entero = Math.floor(valor);
  const centavos = Math.round((valor - entero) * 100);
  return `${enterosALetras(entero)} DÓLARES CON ${String(centavos).padStart(2, "0")}/100`;
}

// ---- Función principal: actualiza la vista previa en tiempo real ----
function actualizar() {
  const fechaInput = document.getElementById("fecha").value;
  const mesPago = document.getElementById("mesPago").value;
  const monto1 = parseFloat(document.getElementById("monto1").value) || 0;
  const monto2 = parseFloat(document.getElementById("monto2").value) || 0;
  const total = monto1 + monto2;

  let fechaTexto = "05 de junio de 2026";
  if (fechaInput) {
    const [anio, mes, dia] = fechaInput.split("-");
    fechaTexto = `${dia} de ${MESES[parseInt(mes, 10) - 1]} de ${anio}`;
  }

  document.getElementById("pFecha").textContent =
    `En la ciudad de San Salvador, a ${fechaTexto}.`;

  document.getElementById("pPrincipal").innerHTML =
    `Yo, <b>José Pedro Morales Alas</b>, hago constar que he recibido de <b>Rafael Anicasio Vivas</b> ` +
    `la cantidad de <b>${montoEnLetras(total)} (US$${total.toFixed(2)})</b>, en concepto de pago de ` +
    `cuota(s) de vivienda Alta vista #254, correspondiente al mes de ${mesPago}.`;

  document.getElementById("l1").textContent = `${montoEnLetras(monto1)} (US$${monto1.toFixed(2)})`;
  document.getElementById("l2").textContent = `${montoEnLetras(monto2)} (US$${monto2.toFixed(2)})`;
}

document.getElementById("fecha").addEventListener("input", actualizar);
document.getElementById("mesPago").addEventListener("input", actualizar);
document.getElementById("monto1").addEventListener("input", actualizar);
document.getElementById("monto2").addEventListener("input", actualizar);

actualizar();

// ---- Manejo de imágenes ----
let img1Data = null;
let img2Data = null;

function configurarSubidaImagen(inputId, dropId, cual) {
  const input = document.getElementById(inputId);
  const drop = document.getElementById(dropId);

  drop.addEventListener("click", () => input.click());

  input.addEventListener("change", (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (e) => {
      if (cual === 1) {
        img1Data = e.target.result;
      } else {
        img2Data = e.target.result;
      }
      drop.textContent = archivo.name;
      drop.classList.add("has-img");
      renderizarImagenes();
    };
    lector.readAsDataURL(archivo);
  });
}

function renderizarImagenes() {
  const contenedor = document.getElementById("imgsContainer");
  contenedor.innerHTML = "";

  if (!img1Data && !img2Data) {
    contenedor.innerHTML =
      `<div class="placeholder-imgs"><div>Captura 1</div><div>Captura 2</div></div>`;
    return;
  }

  if (img1Data) {
    const imagen = document.createElement("img");
    imagen.src = img1Data;
    contenedor.appendChild(imagen);
  }

  if (img2Data) {
    const imagen = document.createElement("img");
    imagen.src = img2Data;
    contenedor.appendChild(imagen);
  }
}

configurarSubidaImagen("img1", "drop1", 1);
configurarSubidaImagen("img2", "drop2", 2);

// ---- Descargar PDF ----
document.getElementById("downloadBtn").addEventListener("click", () => {
  const cuota = document.getElementById("cuota").value || "1";
  const elementoRecibo = document.getElementById("receipt");

  const opciones = {
    margin: 0,
    filename: `RECIBO_ALTA_VISTA_254_CUOTA_${cuota}_DE_240.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  html2pdf().set(opciones).from(elementoRecibo).save();
});