document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await login();
});

document.getElementById('alertaFechar').addEventListener('click', () => {
    const alertaModal = document.getElementById('alertaModal');
    alertaModal.classList.add('hidden');
});


async function login() {

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    var usuario = await buscarUsuarioPorEmailAsync(email);

    if (usuario == null)
        alertaModal('Usuário não encontrado!');

    if (usuario.senha === senha) {
        if (usuario.tipo === 'admin')
            window.location.href = 'homeAdmin.html';
        else
            window.location.href = 'home.html';
    } else {
        alertaModal('Credenciais inválidas');
    }
}

function alertaModal(mensagem) {

    document.getElementById('alertaMensagem').textContent = mensagem;

    const alertaModal = document.getElementById('alertaModal');

    alertaModal.classList.remove('hidden');
}