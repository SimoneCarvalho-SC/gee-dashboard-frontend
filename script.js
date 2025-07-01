// Função para carregar e exibir as instalações
function carregarInstalacoes() {
    fetch('http://127.0.0.1:5000/listar_instalacoes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos da API:', data);
            let conteudo = document.getElementById('conteudo');
            if (data.length === 0) {
            conteudo.innerHTML = "<p>Nenhuma instalação encontrada.</p>";
            return;
    }

    conteudo.innerHTML = `
        <h2>Instalações</h2>
        <table>
            <tr>
                ${Object.keys(data[0]).map(coluna => `<th>${coluna}</th>`).join('')}
            </tr>
            ${data.map(linha => `
                <tr>
                    ${Object.values(linha).map(valor => `<td>${valor}</td>`).join('')}
                </tr>
            `).join('')}
        </table>
    `;
})
        .catch(error => {
            console.error('Erro ao carregar instalações:', error);
            let conteudo = document.getElementById('conteudo');
            conteudo.innerHTML = "<p style='color:red;'>Erro ao carregar instalações.</p>";
        });
}


// Função para exibir formulário de cadastro
function mostrarFormularioCadastro() {
    let conteudo = document.getElementById('conteudo');
    conteudo.innerHTML = `
        <h2>Nova Instalação</h2>
        <form id="formInstalacao">
            <input type="text" name="Ano" placeholder="Ano" required>
            <input type="text" name="Bacia" placeholder="Bacia" required>
            <input type="text" name="Instalacao" placeholder="Instalação" required>
            <input type="text" name="Operador" placeholder="Operador" required>
            <input type="text" name="Campo" placeholder="Campo" required>
            <input type="number" step="0.01" name="Emissoes_Escopo1" placeholder="Escopo 1">
            <input type="number" step="0.01" name="Emissoes_Escopo2" placeholder="Escopo 2">
            <input type="number" step="0.01" name="Emissoes_Total" placeholder="Total">
            <input type="number" step="0.01" name="Emissoes_CH4" placeholder="CH4">
            <input type="number" step="0.01" name="Emissoes_CO2" placeholder="CO2">
            <input type="number" step="0.01" name="Producao_Anual_Liquida" placeholder="Produção Líquida">
            <input type="number" step="0.01" name="Intensidade_Emissoes" placeholder="Intensidade">
            <button type="submit">Cadastrar</button>
        </form>
        <p id="mensagemCadastro"></p>
    `;

    document.getElementById('formInstalacao').addEventListener('submit', function (e) {
        e.preventDefault();
        const dados = Object.fromEntries(new FormData(this).entries());

        console.log('Enviando dados', dados);   // para debug
        console.log('JSON:', JSON.stringify(dados));

        fetch('http://127.0.0.1:5000/cadastrar_instalacao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(res => {
            document.getElementById('mensagemCadastro').textContent = res.message;
            this.reset();
        })
        .catch(err => {
            console.error('Erro:', err);
            document.getElementById('mensagemCadastro').textContent = 'Erro ao cadastrar.';
        });
    });
}

// Função para exibir formulário de busca
function mostrarFormularioBusca() {
    let conteudo = document.getElementById('conteudo');
    conteudo.innerHTML = `
        <h2>Buscar Instalação</h2>
        <form id="formBusca">
            <input type="number" name="id" placeholder="ID da Instalação" required>
            <button type="submit">Buscar</button>
        </form>
        <div id="resultadoBusca"></div>
    `;

    document.getElementById('formBusca').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = new FormData(e.target).get('id');

        fetch(`http://127.0.0.1:5000/buscar_instalacao/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('resultadoBusca').innerText = data.error;
                } else {
                    let html = '<table><tr>' +
                        Object.keys(data).map(col => `<th>${col}</th>`).join('') +
                        '</tr><tr>' +
                        Object.values(data).map(val => `<td>${val}</td>`).join('') +
                        '</tr></table>';
                    document.getElementById('resultadoBusca').innerHTML = html;
                }
            })
            .catch(err => {
                console.error('Erro ao buscar:', err);
                document.getElementById('resultadoBusca').innerText = 'Erro ao buscar instalação.';
            });
    });
}

// Função para exibir o formulário de deleção
function mostrarFormularioDelecao() {
    let conteudo = document.getElementById('conteudo');
    conteudo.innerHTML = `
        <h2>Deletar Instalação</h2>
        <form id="formDelecao">
            <input type="number" name="id" placeholder="ID da Instalação" required>
            <button type="submit">Deletar</button>
        </form>
        <p id="mensagemDelecao"></p>
    `;

    document.getElementById('formDelecao').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = new FormData(e.target).get('id');

        fetch(`http://127.0.0.1:5000/deletar_instalacao/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById('mensagemDelecao').innerText = data.message;
        })
        .catch(err => {
            console.error('Erro ao deletar:', err);
            document.getElementById('mensagemDelecao').innerText = 'Erro ao deletar instalação.';
        });
    });
}

