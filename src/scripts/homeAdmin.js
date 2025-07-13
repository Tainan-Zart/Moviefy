const navMenu = document.getElementById('navMenu');
const adminSecao = document.getElementById('adminSecao');
const usuarioSecao = document.getElementById('usuarioSecao');
const filmeSecao = document.getElementById('filmeSecao');
const listaUsuario = document.getElementById('listaUsuario');
const listaFilme = document.getElementById('listaFilme');
const usuarioModal = document.getElementById('usuarioModal');
const filmeModal = document.getElementById('filmeModal');

document.getElementById('navBotao').addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
});

document.getElementById('sairBotao').addEventListener('click', () => {
    window.location.href = 'login.html';
});

document.getElementById('navAdmin').addEventListener('click', () => {
    adminSecao.classList.remove('hidden');
    usuarioSecao.classList.add('hidden');
    filmeSecao.classList.add('hidden');
    navMenu.classList.add('hidden');
});

document.getElementById('navUsuario').addEventListener('click', () => {
    adminSecao.classList.add('hidden');
    usuarioSecao.classList.remove('hidden');
    filmeSecao.classList.add('hidden');
});

document.getElementById('navFilme').addEventListener('click', () => {
    adminSecao.classList.add('hidden');
    filmeSecao.classList.remove('hidden');
    usuarioSecao.classList.add('hidden');
});

document.getElementById('navMenuUsuario').addEventListener('click', () => {
    adminSecao.classList.add('hidden');
    usuarioSecao.classList.remove('hidden');
    filmeSecao.classList.add('hidden');
    navMenu.classList.add('hidden');
});

document.getElementById('navMenuFilme').addEventListener('click', () => {
    adminSecao.classList.add('hidden');
    filmeSecao.classList.remove('hidden');
    usuarioSecao.classList.add('hidden');
    navMenu.classList.add('hidden');
});


function gerarGuid(){
    return crypto.randomUUID();
} 

//#region Usuario

let usuarioEdicaoId = null;

document.getElementById('botaoAbrirUsuarioModal').addEventListener('click', () => {
    carregarModalCriar();
});

document.getElementById('botaoFecharUsuarioModal').addEventListener('click', () => {
    usuarioEdicaoId = null;
    abrirFecharUsuarioModal();
});

document.getElementById('usuarioForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await salvarEditarUsuario();  
});


async function salvarEditarUsuario() {
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const tipo = document.getElementById('tipoUsuario').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não conferem');
        return;
    }

    const usuario = {
        nome: nome,
        email: email,
        senha: senha,
        tipo: tipo,
        tipoDocumento: 'usuario'
    }

    try {
        if (usuarioEdicaoId) {
            await atualizarUsuario(usuario);
        } else {
            await cadastrarUsuario(usuario);
        }

        abrirFecharUsuarioModal();

        await carregarUsuarios();

    } catch (err) {
        alert('Erro ao salvar usuário');
    }
}

async function carregarUsuarios() {
    listaUsuario.innerHTML = '';

    try {
        const resultado = await db.allDocs({ include_docs: true });

        const usuarios = resultado.rows.filter(row => row.doc.tipoDocumento === 'usuario').map(row => row.doc);

        usuarios.forEach((usuario) => {
            const usuarioElemento = document.createElement('div');
            usuarioElemento.classList.add('flex', 'justify-between', 'items-center', 'p-3', 'bg-stone-500', 'hover:bg-amber-500', 'mb-2', 'rounded-md');

            usuarioElemento.innerHTML = `
                <span class="flex-1 min-w-0 break-words mr-4 text-black">${usuario.nome} - ${usuario.tipo}</span>
                <div class="flex-none space-x-8 md:space-x-10 lg:space-x-12 flex items-center">
                    <button id="botaoEditar"><img src="../assets/lapis.png" alt="imagem de lapis" class="h-6 w-6"></button>
                    <button id="botaoDeletar"><img src="../assets/lixeira.png" alt="imagem de lapis" class="h-6 w-6"></button>
                </div>
            `;

            listaUsuario.appendChild(usuarioElemento);

            usuarioElemento.querySelector('#botaoEditar').addEventListener('click', () => carregarModalEditar(usuario));
            usuarioElemento.querySelector('#botaoDeletar').addEventListener('click', async () => excluirUsuario(usuario._id));
        });
    } catch (err) {
        alert(err);
    }
}

function carregarModalCriar(){
    document.getElementById('modalTitle').textContent = "Cadastrar Usuário";
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('confirmarSenha').value = '';
    document.getElementById('tipoUsuario').value = '';
    abrirFecharUsuarioModal();
}

function carregarModalEditar(usuario) {
    usuarioEdicaoId = usuario._id;
    document.getElementById('modalTitle').textContent = "Editar Usuário";
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('email').value = usuario.email;
    document.getElementById('senha').value = usuario.senha;
    document.getElementById('confirmarSenha').value = usuario.senha;
    document.getElementById('tipoUsuario').value = usuario.tipo;
    abrirFecharUsuarioModal();
}

function abrirFecharUsuarioModal() {
    usuarioModal.classList.toggle('hidden');
}

async function cadastrarUsuario(usuario) {

    const retorno = await buscarUsuarioPorEmailAsync(usuario.email);

    if (!retorno){
        const usuarioId = gerarGuid();
        usuario._id = usuarioId;
        await salvarUsuarioAsync(usuario);
    }
    else   
        alert(`Usuário com email: ${usuario.email} já cadastrado`);
}

async function atualizarUsuario(usuario) {

    await editarUsuarioAsync(usuarioEdicaoId, usuario); 

    usuarioEdicaoId == null;
}

async function excluirUsuario(id){
    await excluirUsuarioAsync(id);
    await carregarUsuarios();
}

//#endregion

//#region Filmes

let filmeEdicaoId = null;

document.getElementById('botaoAbrirFilmeModal').addEventListener('click', () => {
    carregarModalCadastrarFilme();
});

document.getElementById('botaoFecharFilmeModal').addEventListener('click', () => {
    filmeEdicaoId = null;
    abrirFecharFilmeModal();
});

document.getElementById('filmeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await salvarEditarFilme();  
});

async function carregarFilmes() {
    listaFilme.innerHTML = '';

    try {
        const resultado = await db.allDocs({ include_docs: true });
        const filmes = resultado.rows.filter(row => row.doc.tipoDocumento === 'filme').map(row => row.doc);

        filmes.forEach((filme) => {
            const filmeElemento = document.createElement('div');
            filmeElemento.classList.add('flex', 'justify-between', 'items-center', 'p-3', 'bg-stone-500', 'hover:bg-amber-500', 'mb-2', 'rounded-md');

            filmeElemento.innerHTML = `
                <span class="flex-1 min-w-0 break-words mr-4 text-black">${filme.titulo} - ${filme.categoria}</span>
                <div class="flex-none space-x-6 md:space-x-10 lg:space-x-12 flex items-center">
                    <button id="botaoEditarFilme"><img src="../assets/lapis.png" alt="imagem de lapis" class="h-6 w-6"></button>
                    <button id="botaoDeletarFilme"><img src="../assets/lixeira.png" alt="imagem de lixeira" class="h-6 w-6"></button>
                </div>
            `;

            listaFilme.appendChild(filmeElemento);

            filmeElemento.querySelector('#botaoEditarFilme').addEventListener('click', () => carregarModalEditarFilme(filme));
            filmeElemento.querySelector('#botaoDeletarFilme').addEventListener('click', async () => excluirFilme(filme._id)); // Dica: É mais seguro excluir pelo _id
        });
    } catch (err) {
        alert(err);
    }
}

async function salvarEditarFilme() {

    const titulo = document.getElementById('tituloFilme').value;
    const sinopse = document.getElementById('sinopseFilme').value;
    const anoLancamento = document.getElementById('anoLancamentoFilme').value;
    const linkTrailer = document.getElementById('linkTrailerFilme').value;
    const linkImagem = document.getElementById('linkImagemFilme').value;
    const categoria = document.getElementById('categoriaFilme').value;


    const filme = {
        titulo: titulo,
        sinopse: sinopse,
        anoLancamento : anoLancamento,
        linkTrailer: linkTrailer,
        linkImagem: linkImagem,
        categoria: categoria,
        tipoDocumento: 'filme'
    }

    if(filmeEdicaoId)
        await atualizarFilme(filme);
    else
        await cadastrarFilme(filme);

    
    carregarFilmes();
    abrirFecharFilmeModal();
}

async function cadastrarFilme(filme) {
    
  var filmeExiste = await buscarFilmePorTitulo(filme.titulo);

  if(!filmeExiste){
    const filmeId = gerarGuid();
    filme._id = filmeId;
    await salvarFilmeAsync(filme);
  }
  else 
    alert(`Filme com titulo: ${filme.titulo} já cadastrado`);

}

async function atualizarFilme(filme){

    await editarFilmeAsync(filmeEdicaoId, filme);

    filmeEdicaoId = null;
}

async function excluirFilme(titulo){
    await excluirFilmeAsync(titulo);
    await carregarFilmes();
}

function carregarModalCadastrarFilme(){
    document.getElementById('modalFilmeTitulo').textContent = "Cadastrar Filme";
    document.getElementById('tituloFilme').value = '';
    document.getElementById('anoLancamentoFilme').value = '';
    document.getElementById('sinopseFilme').value = '';
    document.getElementById('linkTrailerFilme').value = '';
    document.getElementById('linkImagemFilme').value = '';
    document.getElementById('categoriaFilme').value = '';
    abrirFecharFilmeModal();
}

function carregarModalEditarFilme(filme)
{
    filmeEdicaoId = filme._id;
    document.getElementById('modalFilmeTitulo').textContent = "Editar Filme";
    document.getElementById('tituloFilme').value = filme.titulo;
    document.getElementById('anoLancamentoFilme').value = filme.anoLancamento;
    document.getElementById('sinopseFilme').value = filme.sinopse;
    document.getElementById('linkTrailerFilme').value = filme.linkTrailer;
    document.getElementById('linkImagemFilme').value = filme.linkImagem
    document.getElementById('categoriaFilme').value = filme.categoria;
    abrirFecharFilmeModal();
} 

function abrirFecharFilmeModal(){
    filmeModal.classList.toggle('hidden');
}

//#endregion

carregarUsuarios();
carregarFilmes();
