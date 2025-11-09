const apiUrl = "http://localhost:3000/personagens"; // URL do JSON Server

// ========================
// 1. CRUD PRINCIPAL
// ========================
const form = document.getElementById("form-personagem");
const cardContainer = document.getElementById("card");
const carrosel = document.getElementById("carrosel");
const cancelarEdicaoBtn = document.getElementById("cancelar-edicao");

let editando = false;
let idEdicao = null;

// Carrega personagens ao abrir
if (cardContainer) carregarPersonagens();
if (carrosel) carregarCarrosel();

// ========================
// 2. FUNÇÃO: CARREGAR PERSONAGENS
// ========================
async function carregarPersonagens() {
  const res = await fetch(apiUrl);
  const personagens = await res.json();

  cardContainer.innerHTML = personagens.map(personagem => `
    <div class="col-md-4 col-lg-3">
      <div class="card h-100 shadow-sm">
        <img src="${personagem.imagem}" class="card-img-top" alt="${personagem.nome}">
        <div class="card-body">
          <h5 class="card-title">${personagem.nome}</h5>
          <p class="card-text">${personagem.descricao_curta}</p>
          <p><strong>Função:</strong> ${personagem.funcao}</p>
          <p><strong>Recompensa:</strong> ${personagem.recompensa}</p>
          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-warning btn-sm" onclick="editarPersonagem('${personagem.id}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deletarPersonagem('${personagem.id}')">Excluir</button>
            <a href="detalhes.html?id=${personagem.id}" class="btn btn-primary btn-sm">Ver mais</a>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// ========================
// 3. FUNÇÃO: CARROSSEL
// ========================
async function carregarCarrosel() {
  const res = await fetch(apiUrl);
  const personagens = await res.json();

  carrosel.innerHTML = personagens.slice(0, 3).map((p, i) => `
    <div class="carousel-item ${i === 0 ? "active" : ""}">
      <img src="${p.imagem}" class="d-block w-100" style="max-height:400px; object-fit:cover;" alt="${p.nome}">
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
        <h5 class="text-light">${p.nome}</h5>
        <p class="text-light">${p.descricao_curta}</p>
      </div>
    </div>
  `).join("");
}

// ========================
// 4. FUNÇÃO: SALVAR / EDITAR
// ========================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoPersonagem = {
      nome: document.getElementById("nome").value,
      funcao: document.getElementById("funcao").value,
      recompensa: document.getElementById("recompensa").value,
      imagem: document.getElementById("imagem").value,
      descricao_curta: "Descrição curta aqui",
      descricao_completa: "Descrição completa aqui",
      habilidade: "Habilidade principal",
      sonho: "Sonho do personagem",
      secundarios: []
    };

    if (editando) {
      await fetch(`${apiUrl}/${idEdicao}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPersonagem)
      });
      editando = false;
      idEdicao = null;
      cancelarEdicaoBtn.style.display = "none";
    } else {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPersonagem)
      });
    }

    form.reset();
    carregarPersonagens();
  });
}

async function editarPersonagem(id) {
  const res = await fetch(`${apiUrl}/${id}`);
  const personagem = await res.json();

  document.getElementById("nome").value = personagem.nome;
  document.getElementById("funcao").value = personagem.funcao;
  document.getElementById("recompensa").value = personagem.recompensa;
  document.getElementById("imagem").value = personagem.imagem;

  editando = true;
  idEdicao = id;
  cancelarEdicaoBtn.style.display = "inline-block";
}

if (cancelarEdicaoBtn) {
  cancelarEdicaoBtn.addEventListener("click", () => {
    form.reset();
    editando = false;
    idEdicao = null;
    cancelarEdicaoBtn.style.display = "none";
  });
}

async function deletarPersonagem(id) {
  if (!confirm("Tem certeza que deseja excluir este personagem?")) return;

  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  carregarPersonagens();
}

// ========================
// 5. PÁGINA DE DETALHES
// ========================
const detalhesContainer = document.getElementById("detalhes");
const segContainer = document.getElementById("seg");

if (detalhesContainer && segContainer) carregarDetalhes();

async function carregarDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const res = await fetch(`${apiUrl}/${id}`);
  const personagem = await res.json();

  detalhesContainer.innerHTML = `
    <div class="col-md-4">
      <img src="${personagem.imagem}" class="img-fluid rounded shadow-sm" alt="${personagem.nome}">
    </div>
    <div class="col-md-8">
      <h2>${personagem.nome}</h2>
      <p><strong>Função:</strong> ${personagem.funcao}</p>
      <p><strong>Habilidade:</strong> ${personagem.habilidade}</p>
      <p><strong>Sonho:</strong> ${personagem.sonho}</p>
      <p><strong>Recompensa:</strong> ${personagem.recompensa}</p>
      <p>${personagem.descricao_completa}</p>
    </div>
  `;

  if (personagem.secundarios && personagem.secundarios.length > 0) {
    segContainer.innerHTML = personagem.secundarios.map(sec => `
      <div class="col-md-3">
        <div class="card h-100 shadow-sm">
          <img src="${sec.imagem}" class="card-img-top" alt="${sec.nome}">
          <div class="card-body">
            <h5 class="card-title">${sec.nome}</h5>
            <p class="card-text">${sec.descricao}</p>
          </div>
        </div>
      </div>
    `).join("");
  } else {
    segContainer.innerHTML = `<p class="text-center">Nenhuma habilidade registrada.</p>`;
  }
}
