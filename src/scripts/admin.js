const navMenu = document.getElementById('navMenu');
const adminSecao = document.getElementById('adminSecao');
const usuarioSecao = document.getElementById('usuarioSecao');
const filmeSecao = document.getElementById('filmeSecao');
const listaUsuario = document.getElementById('listaUsuario');
const usuarioModal = document.getElementById('usuarioModal');

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

document.getElementById('botaoAbrirUsuarioModal').addEventListener('click', () => {
    carregarModalCriar();
});

document.getElementById('botaoFecharUsuarioModal').addEventListener('click', () => {
    abrirFecharModal();
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
            await editarUsuario(email, senha, tipo);
        } else {
            await criarUsuario(email, senha, tipo);
        }

        abrirFecharModal();

        await carregarUsuarios();

    } catch (err) {
        alert('Erro ao salvar usuário');
    }
}

async function carregarUsuarios() {

    listaUsuario.innerHTML = '';

    try {
        const resultado = await db.allDocs({ include_docs: true });

        resultado.rows.forEach((row) => {
            const usuario = row.doc;

            const usuarioElemento = document.createElement('div');

            usuarioElemento.classList.add('flex', 'justify-between', 'items-center', 'p-4', 'bg-amber-500', 'mb-2', 'rounded-md');

            usuarioElemento.innerHTML = `
                <span class="text-black">${usuario.email} - ${usuario.tipo}</span>
                <div class="space-x-8 flex items-center">
                    <button id="botaoEditar"><img src="../assets/lapis.png" alt="imagem de lapis" class="h-7 w-7"></button>
                    <button id="botaoDeletar"><img src="../assets/lixeira.png" alt="imagem de lapis" class="h-7 w-7"></button>
                </div>
            `;

            listaUsuario.appendChild(usuarioElemento);

            usuarioElemento.querySelector('#botaoEditar').addEventListener('click', () => carregarModalEditar(usuario));
            usuarioElemento.querySelector('#botaoDeletar').addEventListener('click', async () => excluirUsuario(usuario.email));
        });
    } catch (err) {
        alert('Erro ao listar usuários:', err);
    }
}

function carregarModalCriar(){
    document.getElementById('modalTitle').textContent = "Cadastrar Usuário";
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('tipoUsuario').value = '';
    abrirFecharModal();
}

function carregarModalEditar(usuario) {
    usuarioEdicaoId = usuario._id;
    document.getElementById('modalTitle').textContent = "Editar Usuário";
    document.getElementById('email').value = usuario.email;
    document.getElementById('senha').value = usuario.senha;
    document.getElementById('tipoUsuario').value = usuario.tipo;
    abrirFecharModal();
}

function abrirFecharModal() {
    usuarioModal.classList.toggle('hidden');
}

async function criarUsuario(email, senha, tipo) {

    const retorno = await buscarUsuarioPorEmailDb(email);

    if (retorno == null)
        salvarUsuario(email, senha, tipo);
    else   
        alert("Usuário já cadastrado");
}

async function editarUsuario(email, senha, tipo) {

    var email = document.getElementById('email').value;

    if(email == usuarioEdicaoId)
       await editarUsuarioDb(email, senha, tipo); 
    else
        alert('Não é possivel atualizar o email');
}

async function excluirUsuario(email){
    await excluirUsuarioDb(email);
    await carregarUsuarios();
}

carregarUsuarios();
