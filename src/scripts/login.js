function showAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    const alertBox = document.getElementById('customAlert');
    alertBox.classList.remove('hidden');
    alertBox.classList.add('flex'); 
    document.getElementById('closeAlert').addEventListener('click', function () {
        alertBox.classList.remove('flex');
        alertBox.classList.add('hidden');
    });
}

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    getUsuarioByEmail(email).then(function (usuario) {
        if (usuario.senha === senha) {
            if (usuario.tipo === 'admin') {
                window.location.href = 'admin_dashboard.html';
            } else {
                window.location.href = 'user_dashboard.html';
            }
        } else {
            showAlert('Credenciais inválidas');
        }
    }).catch(function (error) {
        showAlert('Usuário não encontrado');
    });
});