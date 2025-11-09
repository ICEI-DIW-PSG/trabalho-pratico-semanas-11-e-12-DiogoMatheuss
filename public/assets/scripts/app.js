//get
let personagens = [];
async function carregarDados() {
 try { // 1. O JavaScript pede os dados para o servidor JSON Server
 const resposta = await fetch("http://localhost:3000/personagens");
 
 // 2. O JS converte a resposta para um objeto JavaScript (JSON)
 personagens = await resposta.json(); 

 // 3. Usa os dados para criar os elementos visuais
 carregarCard(); 
    carregarCarrosel(); 
  } catch (erro) {
    console.error("Erro ao buscar dados:", erro);
  }
}

function carregarCard() {
  var card = document.getElementById("card");
  let strTexto = "";

  for (let i = 0; i < personagens.length; i++) {
    strTexto += `
      <div class="col-lg-3 col-md-6 col-sm-12 d-flex align-items-stretch">
        <a href="detalhes.html?id=${personagens[i].id}" class="text-decoration-none text-dark w-100">
          <div class="card h-100">
            <img src="${personagens[i].imagem}" class="card-img-top" alt="${personagens[i].nome}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${personagens[i].nome}</h5>
              <p class="card-text">${personagens[i].descricao_curta}</p>
            </div>
          </div>
        </a>
      </div>
    `;
  }

  card.innerHTML = strTexto;
}

function pegarIdDaURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id")); 
}

function carregarPagina() {
  const idPersonagem = pegarIdDaURL(); 
  carregarDetalhes(idPersonagem);
  carregarSeg(idPersonagem);
}

function carregarDetalhes(idPersonagem) {
  var detalhes = document.getElementById("detalhes");
  let strTexto = "";
  let personagem = personagens.find(p => p.id == idPersonagem);

  if (personagem) {
    strTexto += `
      <div class="col-md-4 text-center">
        <img src="${personagem.imagem}" class="img-fluid rounded shadow" alt="${personagem.nome}">
      </div>
      <div class="col-md-8">
        <h1 class="display-4 border-bottom pb-2 mb-3">
          ${personagem.nome} <span class="badge bg-secondary h5">${personagem.funcao}</span>
        </h1>
        <p class="lead">${personagem.descricao_completa}</p>                   
        <h4 class="mt-4">Informações:</h4>
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Sonho:</strong> ${personagem.sonho}</li>
            <li class="list-group-item"><strong>Habilidade Principal:</strong> ${personagem.habilidade}</li>
            <li class="list-group-item"><strong>Recompensa:</strong> ${personagem.recompensa}</li>
        </ul>                   
      </div>
    `;
  }

  detalhes.innerHTML = strTexto;
}

function carregarSeg(idPersonagem) {
  const seg = document.getElementById("seg");
  let personagem = personagens.find(p => p.id === idPersonagem);

  if (!personagem || !personagem.secundarios) return;

  seg.innerHTML = personagem.secundarios.map(s => `
    <div class="col-lg-3 col-md-4 col-sm-6 col-12 d-flex align-items-stretch">
      <div class="card h-100 w-100">
        <img src="${s.imagem}" class="card-img-top" alt="${s.nome}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${s.nome}</h5>
          <p class="card-text">${s.descricao}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function carregarCarrosel() {
    var carrosel = document.getElementById("carrosel");
    let strTexto = "";

    // Adiciona a verificação de segurança (ESSENCIAL!)
    if (!personagens || personagens.length === 0) {
        console.warn("Array de personagens vazia para o Carrossel.");
        return; 
    }

    // Garante que o loop só executa 3 vezes ou o máximo de personagens
    const limite = Math.min(personagens.length, 3); 

    for (let i = 0; i < limite; i++) {
        const item = personagens[i];
        
        // Define 'active' apenas para o primeiro item
        const isActive = (i === 0) ? ' active' : '';

        strTexto += `
            <div class="carousel-item${isActive}">
                <a href="detalhes.html?id=${item.id}" class="text-decoration-none text-dark">
                    <img src="${item.imagem}" class="d-block img-fluid mx-auto" alt="${item.nome}">
                    <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                        <h5 class="text-light">${item.nome}</h5>
                        <p class="text-light">${item.descricao_curta}</p>
                    </div>
                </a>
            </div>
        `;
    }

    carrosel.innerHTML = strTexto;
}

function montarInformacoesAluno() {
    const nomeAluno = "Diogo Matheus Santos da Costa";
    const cursoAluno = "Análise de Deselvolvimento de Sistemas";
    const turmaAluno = "Noite";
    const redesSociais = {
        facebook: "#",
        twitter: "#",
      
    };
    const sobreProjeto = [
        "Este trabalho representa a primeira versão completa do projeto, focando na exibição e navegação dinâmicas de informações. A aplicação possui duas telas principais: a Home-Page (com slider de destaques e lista de todos os itens) e a Tela de Detalhes do Item (com layout personalizado). Todas as informações sobre a Tripulação do Chapéu de Palha são gerenciadas a partir de uma estrutura JSON e injetadas na interface usando JavaScript, garantindo um design responsivo em todos os dispositivos."
    ];

    const container = document.getElementById('informacoes_aluno_section'); 
    
    if (!container) {
        console.error("Elemento '#informacoes_aluno_section' não encontrado. Verifique seu HTML.");
        return;
    }

    let htmlContent = `
        <h3 class="my-4">Informações do(a) Aluno(a)</h3>
        <hr class="mb-4">
        
        <div class="row">
            
            <div class="col-md-6 mb-4 mb-md-0">
                <h5>Sobre</h5>
                ${sobreProjeto.map(p => `<p>${p}</p>`).join('')}
            </div>

            <div class="col-md-6">
                <h5>Autoria</h5>
                
                <div class="d-flex align-items-center mb-3">
                    <i class="fas fa-user-circle fa-2x mr-2"></i> <div>
                        <p class="mb-0"><strong>Aluno:</strong> ${nomeAluno}</p>
                        <p class="mb-0"><strong>Curso:</strong> ${cursoAluno}</p>
                        <p class="mb-0"><strong>Turma:</strong> ${turmaAluno}</p>
                    </div>
                </div>

                <div class="mt-3">
                    <h5></h5>
                    ${redesSociais.facebook ? `<a href="${redesSociais.facebook}" class="mr-2"><i class="fab fa-facebook-square fa-2x"></i></a>` : ''}
                    ${redesSociais.twitter ? `<a href="${redesSociais.twitter}"><i class="fab fa-twitter-square fa-2x"></i></a>` : ''}
                    </div>
            </div>
        </div>
    `;

    container.innerHTML = htmlContent;
}

window.onload = async function() {
  await carregarDados(); // garante que os dados foram baixados
  const id = pegarIdDaURL();

  if (id) { // estamos na página de detalhes
    carregarDetalhes(id);
    carregarSeg(id);
  } else { // estamos na página inicial
    montarInformacoesAluno();
  }
};