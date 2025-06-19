const db = new PouchDB('Moviefy');


//#region Usuario
function salvarUsuario(email, senha, tipo) {

    const usuario = {
        _id: email,
        email: email,
        senha: senha,
        tipo: tipo
    };
    db.put(usuario);
}


async function buscarUsuarioPorEmailDb(email) {
    try {
        const doc = await db.get(email);
        return doc; 
    } catch (err) {
        console.log(err);
        if (err.name === 'not_found') {
            return null; 
        } else {
            alert(err);
        }
    }
}

async function editarUsuarioDb(email, senha, tipo){
   
    try{
        await db.get(email).then(function (usuario) {
            usuario.senha = senha;
            usuario.tipo = tipo;
            db.put(usuario);
        });
    }catch (err) {
        alert(err);
    }
   
}

async function excluirUsuarioDb(email){

    try{
        await db.get(email).then(function (doc) {
            return db.remove(doc);
        });
    }catch(err){
        alert(err);
    }

    
}


//#endregion


function criarFilme(id, titulo, genero, ano) {
    const filme = {
        _id: id,
        titulo: titulo,
        genero: genero,
        ano: ano
    };

    try {
        const response = db.put(filme);
        console.log('Filme criado com sucesso:', response);
    } catch (err) {
        console.error('Erro ao criar filme:', err);
    }
}

function getFilmeById(id) {
    try {
        const filme = db.get(id);
        return filme;
    } catch (err) {
        console.error('Filme não encontrado:', err);
        throw new Error('Filme não encontrado');
    }
}

function listarFilmes() {
    try {
        const result = db.allDocs({ include_docs: true });
        return result.rows.map(row => row.doc);
    } catch (err) {
        console.error('Erro ao listar filmes:', err);
        throw new Error('Erro ao listar filmes');
    }
}
