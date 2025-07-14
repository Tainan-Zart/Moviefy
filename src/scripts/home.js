const navMenu = document.getElementById('navMenu');

document.getElementById('navBotao').addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
});

document.querySelectorAll('.navCategorias').forEach(item => {
    item.addEventListener('click', async (event) => {
        const categoria = event.target.getAttribute('value');
        await carregarFilmes(categoria);
        navMenu.classList.add('hidden');
    });
});

document.querySelector('#navLogo').addEventListener('click', async () => {
    await carregarFilmes();
    navMenu.classList.add('hidden');
});

document.querySelectorAll('.botaoSair').forEach(item => {
    item.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
});

function obterLink(linkOriginal) {
    if (linkOriginal.includes("watch?v=")) {
        const videoId = linkOriginal.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
    return linkOriginal;
}

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

        const link = obterLink(filme.linkTrailer);

        filmeDestaqueElemento.innerHTML = `
            <div class="hidden md:block md:w-1/2 w-full h-full text-white p-2 lg:p-4 flex flex-col justify-center">
                <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">${filme.titulo}</h2>
                <div class="flex items-center space-x-4 mb-6 text-base text-neutral-300">
                    <span class="font-semibold">${filme.anoLancamento}</span>
                    <span class="border-l border-neutral-500 h-4"></span>
                    <span class="font-medium bg-white/10 px-2 py-0.5 rounded-md text-sm">${filme.categoria}</span>
                </div>
                <p class="text-neutral-200 leading-relaxed text-base line-clamp-4 lg:line-clamp-5">${filme.sinopse}</p>
            </div>

            <div class="h-full w-full md:w-1/2 flex flex-col justify-center rounded-xs overflow-hidden"">
                <iframe 
                    class="w-full h-full aspect-video" 
                    src="${link}" 
                    frameborder="0" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen>
                </iframe>
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

            filmeElemento.classList.add('bg-stone-700', 'aspect-[2/3]', 'w-full', 'rounded-sm', 'overflow-hidden');

            filmeElemento.innerHTML = `
                 <img src="${filme.linkImagem}" alt="Imagem do filme" class="w-full h-full object-cover">
            `;

            filmeElemento.addEventListener('click', () => abrirModal(filme));

            filmesContainer.appendChild(filmeElemento);
        });
    } catch (err) {
        console.error('Erro ao carregar filmes:', err);
    }
}

function abrirModal(filme) {
    const modal = document.querySelector('#movieModal');
    const modalContent = document.querySelector('#modalContent');

    modalContent.innerHTML = '';

    const link = obterLink(filme.linkTrailer);
    
    const modalHTML = `
        <button onclick="fecharModal()" class="absolute top-2 right-4 text-white text-4xl font-bold hover:text-gray-300 z-20">×</button>

        <div class="w-full md:w-1/2 flex flex-col justify-center p-6 text-white overflow-y-auto max-h-[50vh] md:max-h-full">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-3">${filme.titulo}</h2>
            <div class="flex items-center space-x-4 mb-5 text-sm text-neutral-300">
                <span class="font-semibold">${filme.anoLancamento}</span>
                <span class="border-l border-neutral-500 h-4"></span>
                <span class="font-medium bg-white/10 px-2 py-0.5 rounded-md">${filme.categoria}</span>
            </div>
            <p class="text-neutral-200 leading-relaxed text-base">${filme.sinopse}</p>
        </div>

        <div class="w-full md:w-1/2 bg-black flex items-center">
             <iframe 
                id="modalTrailer"
                class="w-full aspect-video" 
                src="${link}" 
                frameborder="0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
            </iframe>
        </div>
    `;

    modalContent.innerHTML = modalHTML;
    modal.classList.remove('hidden');
}

function fecharModal() {
    
    const modal = document.querySelector('#movieModal');

    const modalTrailer = document.querySelector('#modalTrailer');

    modal.classList.add('hidden');

    if (modalTrailer) 
        modalTrailer.src = ''; 
};

carregarFilmes();


