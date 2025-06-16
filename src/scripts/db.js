const db = new PouchDB('moviefy');

function criarOuAtualizarUsuario(email, senha, tipo) {
    const usuario = {
        _id: email,  
        email: email,
        senha: senha,
        tipo: tipo 
    };

    return db.put(usuario).then(function(response) {
        console.log('Usuário criado ou atualizado com sucesso:', response);
    }).catch(function(err) {
        console.error('Erro ao criar ou atualizar usuário:', err);
    });
}

function getUsuarioByEmail(email) {
    return db.get(email).then(function(usuario) {
        return usuario;
    }).catch(function(err) {
        console.error('Usuário não encontrado:', err);
        throw new Error('Usuário não encontrado');
    });
}

function criarFilme(id, titulo, genero, ano) {
    const filme = {
        _id: id, 
        titulo: titulo,
        genero: genero,
        ano: ano
    };

    return db.put(filme).then(function(response) {
        console.log('Filme criado com sucesso:', response);
    }).catch(function(err) {
        console.error('Erro ao criar filme:', err);
    });
}

function getFilmeById(id) {
    return db.get(id).then(function(filme) {
        return filme; 
    }).catch(function(err) {
        console.error('Filme não encontrado:', err);
        throw new Error('Filme não encontrado');
    });
}

function listarFilmes() {
    return db.allDocs({ include_docs: true }).then(function(result) {
        return result.rows.map(row => row.doc); 
    }).catch(function(err) {
        console.error('Erro ao listar filmes:', err);
        throw new Error('Erro ao listar filmes');
    });
}