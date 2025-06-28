const db = new PouchDB('Moviefy');


//#region Usuario
async function salvarUsuarioAsync(email, senha, tipo) {

    const usuario = {
        _id: email,
        email: email,
        senha: senha,
        tipo: tipo,
        tipoDocumento : 'usuario'
    };
    await db.put(usuario);
}

async function buscarUsuarioPorEmailAsync(email) {
    try {
        const usuario = await db.get(email);
        return usuario; 
    } catch (err) {
        if (err.name === 'not_found') {
            return null; 
        } else {
            alert(err);
        }
    }
}

async function editarUsuarioAsync(email, senha, tipo){
   
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

async function excluirUsuarioAsync(email){

    try{
        await db.get(email).then(function (doc) {
            return db.remove(doc);
        });
    }catch(err){
        alert(err);
    }

    
}


//#endregion

//#region Filme 
async function salvarFilmeAsync(filme) {

    console.log(filme);

    try {
        await db.put(filme);
    } catch (err) {
        alert(err);
    }
}

async function buscarFilmePorTitulo(titulo) {
    try {
        const filme = await db.get(titulo);
        return filme;
    } catch (err) {
        if (err.name === 'not_found') {
            return null; 
        } else {
            alert(err);
        }
    }
}

async function editarFilmeAsync(filmeAtualizado) {
    try{
        await db.get(filmeAtualizado.titulo).then(function (filme) {
            filme.titulo = filmeAtualizado.titulo;
            filme.sinopse = filmeAtualizado.sinopse;
            filme.linkTrailer = filmeAtualizado.linkTrailer;
            filme.imagem = filmeAtualizado.imagem;
            filme.categoria = filmeAtualizado.categoria;
            filme.tipoDocumento = filmeAtualizado.tipoDocumento
            db.put(filme);
        });
    }catch (err) {
        alert(err);
    }
}

async function excluirFilmeAsync(titulo){

    try{
        await db.get(titulo).then(function (filme) {
            return db.remove(filme);
        });
    }catch(err){
        alert(err);
    }
}
//#endregion
