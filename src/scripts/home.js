const navMenu = document.getElementById('navMenu');

document.getElementById('navBotao').addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
});

// document.getElementById('fecharModal').addEventListener('click', () => {
//     const modal = document.getElementById('modal');
//     modal.classList.add('hidden');
//     document.getElementById('modalTrailer').src = '';
// });

document.querySelectorAll('.navCategorias').forEach(item => {
    item.addEventListener('click', async (event) => {
        const categoria = event.target.getAttribute('value');
        await carregarFilmes(categoria);
        navMenu.classList.add('hidden');
    });
});

document.querySelector('#navLogo').addEventListener('click', async () => {
    await carregarFilmes();
});

async function carregarFilmeDestaque(categoria = null) {
    try {
        const filmeDestaque = document.querySelector('#filmeDestaqueSecao');
        filmeDestaque.innerHTML = '';

        const resultado = await db.allDocs({ include_docs: true });
        const filmes = resultado.rows.filter(row => row.doc.tipoDocumento === 'filme').map(row => row.doc);

        const filmesFiltrados = categoria ? filmes.filter(filme => filme.categoria === categoria) : filmes;

        if (filmesFiltrados.length === 0)
            filmeDestaque.innerHTML = '<p class="text-white font-bold text-2xl text-center">Nenhum filme encontrado.</p>';

        const filme = filmesFiltrados[Math.floor(Math.random() * filmesFiltrados.length)];

        const filmeDestaqueElemento = document.createElement('div');
        filmeDestaqueElemento.classList.add('flex', 'w-full', 'h-full', 'flex-col', 'md:flex-row');

       filmeDestaqueElemento.innerHTML = `
            <div class="hidden md:block md:w-1/2 w-full text-white p-4 flex flex-col justify-center overflow-hidden rounded-xs">
                <h2 class="text-3xl text-center font-bold mb-4">${filme.titulo}</h2>
                <p class="text-sm break-words word-wrap">${filme.sinopse}</p>
            </div>

            <div class="h-full w-full md:w-1/2 flex flex-col justify-center rounded-xs overflow-hidden" style="box-shadow: 0 0 80px rgba(255, 255, 255, 0.3);">
                <img id="imagemDestaque"
                    src="${filme.imagem}"
                    alt="Imagem do filme"
                    class="w-full max-h-[80vh] aspect-3/2"/>
            </div>
        `;

        filmeDestaque.appendChild(filmeDestaqueElemento);

        return filme;
    } catch (err) {
        console.error('Erro ao carregar filme destaque:', err);
    }
}

async function carregarFilmes(categoria = null) {
    try {

        const filmeDestaque = await carregarFilmeDestaque(categoria);

        const filmesContainer = document.querySelector('#filmesLista');
        filmesContainer.innerHTML = '';

        const resultado = await db.allDocs({ include_docs: true });
        const filmes = resultado.rows.filter(row => row.doc.tipoDocumento === 'filme' && row.doc.titulo != filmeDestaque.titulo).map(row => row.doc);

        const filmesFiltrados = categoria ? filmes.filter(filme => filme.categoria === categoria) : filmes;

        if (filmesFiltrados.length === 0) 
            document.querySelector('#listaFilmeTitulo').innerHTML = '';
            
        filmesFiltrados.forEach(filme => {
            document.querySelector('#listaFilmeTitulo').innerHTML = 'Outros filmes para você';

            const filmeElemento = document.createElement('div');

            filmeElemento.classList.add('bg-stone-700', 'overflow-hidden', 'shadow-md', 'aspect-square', 'w-full', 'rounded-sm');

            filmeElemento.innerHTML = `
                 <img src="${filme.imagem}" alt="Imagem do filme" class="w-full max-h-[80vh] aspect-3/3">
            `;

            filmeElemento.addEventListener('click', () => abrirModal(filme));

            filmesContainer.appendChild(filmeElemento);
        });
    } catch (err) {
        console.error('Erro ao carregar filmes:', err);
    }
}

function abrirModal(filme) {
    const modal = document.getElementById('modal');
    const modalTitulo = document.getElementById('modalTitulo');
    const modalDescricao = document.getElementById('modalDescricao');
    const modalGenero = document.getElementById('modalGenero');
    const modalTrailer = document.getElementById('modalTrailer');

    modalTitulo.textContent = filme.titulo;
    modalDescricao.textContent = filme.sinopse;
    modalGenero.textContent = filme.categoria;
    modalTrailer.src = filme.linkTrailer;

    modal.classList.remove('hidden');
}

carregarFilmes();


