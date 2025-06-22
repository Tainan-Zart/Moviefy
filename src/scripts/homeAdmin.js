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


//#region Usuario

document.getElementById('botaoAbrirUsuarioModal').addEventListener('click', () => {
    carregarModalCriar();
});

document.getElementById('botaoFecharUsuarioModal').addEventListener('click', () => {
    abrirFecharUsuarioModal();
});

document.getElementById('usuarioForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await salvarEditarUsuario();  
});

let usuarioEdicaoId = null;

async function salvarEditarUsuario() {
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const tipo = document.getElementById('tipoUsuario').value;
    
    try {
        if (usuarioEdicaoId) {
            await atualizarUsuario(email, senha, tipo);
        } else {
            await cadastrarUsuario(email, senha, tipo);
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
                <span class="text-black">${usuario.email} - ${usuario.tipo}</span>
                <div class="space-x-12 flex items-center">
                    <button id="botaoEditar"><img src="../assets/lapis.png" alt="imagem de lapis" class="h-6 w-6"></button>
                    <button id="botaoDeletar"><img src="../assets/lixeira.png" alt="imagem de lapis" class="h-6 w-6"></button>
                </div>
            `;

            listaUsuario.appendChild(usuarioElemento);

            usuarioElemento.querySelector('#botaoEditar').addEventListener('click', () => carregarModalEditar(usuario));
            usuarioElemento.querySelector('#botaoDeletar').addEventListener('click', async () => excluirUsuario(usuario.email));
        });
    } catch (err) {
        alert(err);
    }
}

function carregarModalCriar(){
    document.getElementById('modalTitle').textContent = "Cadastrar Usuário";
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('tipoUsuario').value = '';
    abrirFecharUsuarioModal();
}

function carregarModalEditar(usuario) {
    usuarioEdicaoId = usuario._id;
    document.getElementById('modalTitle').textContent = "Editar Usuário";
    document.getElementById('email').value = usuario.email;
    document.getElementById('senha').value = usuario.senha;
    document.getElementById('tipoUsuario').value = usuario.tipo;
    abrirFecharUsuarioModal();
}

function abrirFecharUsuarioModal() {
    usuarioModal.classList.toggle('hidden');
}

async function cadastrarUsuario(email, senha, tipo) {

    const retorno = await buscarUsuarioPorEmailAsync(email);

    if (retorno == null)
        await salvarUsuarioAsync(email, senha, tipo);
    else   
        alert("Usuário já cadastrado");
}

async function atualizarUsuario(email, senha, tipo) {

    var email = document.getElementById('email').value;

    if(email == usuarioEdicaoId)
       await editarUsuarioAsync(email, senha, tipo); 
    else
        alert('Não é possivel atualizar o email');

    usuarioEdicaoId == null;
}

async function excluirUsuario(email){
    await excluirUsuarioAsync(email);
    await carregarUsuarios();
}

//#endregion

//#region Filmes

let filmeEdicaoId = null;

document.getElementById('botaoAbrirFilmeModal').addEventListener('click', () => {
    carregarModalCadastrarFilme();
});

document.getElementById('botaoFecharFilmeModal').addEventListener('click', () => {
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
                <span class="text-black">${filme.titulo} - ${filme.categoria}</span>
                <div class="space-x-12 flex items-center">
                    <button id="botaoEditarFilme"><img src="../assets/lapis.png" alt="imagem de lapis" class="h-6 w-6"></button>
                    <button id="botaoDeletarFilme"><img src="../assets/lixeira.png" alt="imagem de lapis" class="6 w-6"></button>
                </div>
            `;

            listaFilme.appendChild(filmeElemento);

            filmeElemento.querySelector('#botaoEditarFilme').addEventListener('click', () => carregarModalEditarFilme(filme));
            filmeElemento.querySelector('#botaoDeletarFilme').addEventListener('click', async () => excluirFilme(filme.titulo));
        });
    } catch (err) {
        alert(err);
    }
}

async function salvarEditarFilme() {

    const titulo = document.getElementById('tituloFilme').value.trim();
    const sinopse = document.getElementById('sinopseFilme').value;
    const linkTrailer = document.getElementById('linkTrailerFilme').value;
    const imagem = document.getElementById('imagemFilme').files[0];
    const categoria = document.getElementById('categoriaFilme').value;

    let imagemBase64 = null;
    if (imagem) {
        imagemBase64 = await converterImagemParaBase64(imagem);
    }

    const filme = {
        _id: titulo,
        titulo: titulo,
        sinopse: sinopse,
        linkTrailer: linkTrailer,
        imagem: imagemBase64,
        categoria: categoria,
        tipoDocumento: 'filme'
    }

    if(filmeEdicaoId == null)
        await cadastrarFilme(filme);
    else
        await atualizarFilme(filme);

    
    carregarFilmes();
    abrirFecharFilmeModal();
}

function converterImagemParaBase64(imagem) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imagem);
    });
}

async function cadastrarFilme(filme) {
    
  var filmeExiste = await buscarFilmePorTitulo(filme.titulo);

  if(filmeExiste == null)
    await salvarFilmeAsync(filme);
  else 
    alert('Filme já cadastrado');

}

async function atualizarFilme(filme){

    var titulo = document.getElementById('tituloFilme').value;

    if(titulo.trim() == filmeEdicaoId)
        await editarFilmeAsync(filme);
    else
        alert('Não é possivel atualizar o titulo do filme');

    filmeEdicaoId = null;
}

async function excluirFilme(titulo){
    await excluirFilmeAsync(titulo);
    await carregarFilmes();
}

function carregarModalCadastrarFilme(){
    document.getElementById('modalFilmeTitulo').textContent = "Cadastrar Filme";
    document.getElementById('tituloFilme').value = '';
    document.getElementById('sinopseFilme').value = '';
    document.getElementById('linkTrailerFilme').value = '';
    document.getElementById('imagemFilme').value = '';
    document.getElementById('categoriaFilme').value = '';
    abrirFecharFilmeModal();
}

function carregarModalEditarFilme(filme)
{
    filmeEdicaoId = filme._id;
    document.getElementById('modalFilmeTitulo').textContent = "Editar Filme";
    document.getElementById('tituloFilme').value = filme.titulo;
    document.getElementById('sinopseFilme').value = filme.sinopse;
    document.getElementById('linkTrailerFilme').value = filme.linkTrailer;
    document.getElementById('imagemFilme').value = filme.imagem;
    document.getElementById('categoriaFilme').value = filme.categoria;
    abrirFecharFilmeModal();
} 

function abrirFecharFilmeModal(){
    filmeModal.classList.toggle('hidden');
}

//#endregion

carregarUsuarios();
carregarFilmes();
