const db = new PouchDB('Moviefy');


async function inicializarBancoDeDados() {
    const idControle = 'dados_iniciais_carregados';

    try {
        await db.get(idControle);
        console.log('Banco de dados já inicializado. Nenhuma ação necessária.');
    } catch (err) {
        if (err.status === 404) {
            console.log('Documento de controle não encontrado. Populando o banco de dados com filmes iniciais...');

            const dadosIniciais = await fetch('../json/dadosIniciais.json');
            const dadosIniciaisJson = await dadosIniciais.json();
            
            await db.bulkDocs(dadosIniciaisJson);
            console.log('Filmes iniciais adicionados com sucesso!');

            const docControle = { _id: idControle, status: 'concluido', data: new Date().toISOString() };
            await db.put(docControle);
            console.log('Documento de controle criado com sucesso.');

        } else {
            console.error('Ocorreu um erro ao verificar o banco de dados:', err);
        }
    }
}






//#region Usuario
async function salvarUsuarioAsync(usuario) {
    try {
        await db.put(usuario);
    } catch (err) {
        alert(err);
    }
}

async function buscarUsuarioPorEmailAsync(email) {
    try {
        const resultado = await db.allDocs({ include_docs: true });

        const usuario = resultado.rows.filter(row => row.doc.email === email &&
            row.doc.tipoDocumento === 'usuario')
            .map(row => row.doc);

        if (usuario.length > 0) return usuario[0];

        return null;
    } catch (err) {
        alert(err);
    }
}

async function editarUsuarioAsync(id, usuarioAtualizado) {

    try {
        await db.get(id).then(function (usuario) {
            usuario.nome = usuarioAtualizado.nome;
            usuario.email = usuarioAtualizado.email;
            usuario.tipo = usuarioAtualizado.tipo;
            usuario.senha = usuarioAtualizado.senha;
            db.put(usuario);
        });
    } catch (err) {
        alert(err);
    }
}

async function excluirUsuarioAsync(id) {

    try {
        await db.get(id).then(function (usuario) {
            return db.remove(usuario);
        });
    } catch (err) {
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
        const resultado = await db.allDocs({ include_docs: true });

        const filme = resultado.rows.filter(row => row.doc.titulo === titulo
            && row.doc.tipoDocumento === 'filme')
            .map(row => row.doc);

        if (filme.length > 0) return filme[0];

        return null;
    } catch (err) {
        alert(err);
    }
}

async function editarFilmeAsync(id, filmeAtualizado) {
    try {
        await db.get(id).then(function (filme) {
            filme.titulo = filmeAtualizado.titulo;
            filme.anoLancamento = filmeAtualizado.anoLancamento;
            filme.sinopse = filmeAtualizado.sinopse;
            filme.linkTrailer = filmeAtualizado.linkTrailer;
            filme.imagem = filmeAtualizado.imagem;
            filme.categoria = filmeAtualizado.categoria;
            filme.tipoDocumento = filmeAtualizado.tipoDocumento
            db.put(filme);
        });
    } catch (err) {
        alert(err);
    }
}

async function excluirFilmeAsync(titulo) {

    try {
        await db.get(titulo).then(function (filme) {
            return db.remove(filme);
        });
    } catch (err) {
        alert(err);
    }
}
//#endregion

inicializarBancoDeDados();
