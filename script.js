class Solo {
    constructor(tipo, coesao, anguloAtritoInterno, resistenciaPenetracao, diametro) {
        this.tipo = tipo;
        this.coesao = coesao;
        this.anguloAtritoInterno = anguloAtritoInterno;
        this.resistenciaPenetracao = resistenciaPenetracao;
        this.diametro = diametro;
    }
}

class Calculo {
    constructor(solo) {
        this.solo = solo;
        this.tamanhoEstaca = 0;
        this.quantidadeEstaca = 0;
    }

    estimarTamanhoEstaca() {
        // Lógica de exemplo para estimar o tamanho da estaca
        this.tamanhoEstaca = this.solo.coesao * 2; // Fórmula simplificada
        return this.tamanhoEstaca;
    }

    calcularQuantidadeEstaca() {
        // Lógica de exemplo para calcular a quantidade de estacas
        this.quantidadeEstaca = Math.ceil(100 / this.tamanhoEstaca); // Fórmula simplificada
        return this.quantidadeEstaca;
    }

    exibirResultados() {
        return `
            <p><strong>Tamanho estimado da estaca:</strong> ${this.tamanhoEstaca} m</p>
            <p><strong>Quantidade preliminar de estacas:</strong> ${this.quantidadeEstaca}</p>
        `;
    }

    obterResultadosTexto() {
        return `
            Tamanho estimado da estaca: ${this.tamanhoEstaca} m
            Quantidade preliminar de estacas: ${this.quantidadeEstaca}
        `;
    }
}

document.getElementById('calcular').addEventListener('click', () => {
    const tipoSolo = document.getElementById('tipoSolo').value;
    const coesao = parseFloat(document.getElementById('coesao').value);
    const anguloAtritoInterno = parseFloat(document.getElementById('anguloAtritoInterno').value);
    const resistenciaPenetracao = parseFloat(document.getElementById('resistenciaPenetracao').value);
    const diametroSolo = parseFloat(document.getElementById('diametroSolo').value);

    const solo = new Solo(tipoSolo, coesao, anguloAtritoInterno, resistenciaPenetracao, diametroSolo);
    const calculo = new Calculo(solo);

    calculo.estimarTamanhoEstaca();
    calculo.calcularQuantidadeEstaca();

    document.getElementById('resultados-container').innerHTML = calculo.exibirResultados();

    // Salvar resultados no objeto calculo para exportação
    window.calculoAtual = calculo;
});

document.getElementById('exportar-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Resultados do Dimensionamento de Estacas', 10, 10);
    doc.setFontSize(12);
    doc.text(window.calculoAtual.obterResultadosTexto(), 10, 30);

    doc.save('resultados-dimensionamento-estacas.pdf');
});

let usuarioCadastrado = null;

document.getElementById('cadastrar').addEventListener('click', () => {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (nome && email && senha) {
        usuarioCadastrado = { nome, email }; // Salvar informações do usuário
        alert('Cadastro realizado com sucesso!');
        document.getElementById('cadastro').classList.remove('ativo');
        document.getElementById('entrada-dados').classList.add('ativo');
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

// Adiciona um evento de clique ao botão de exibir informações de cadastro
document.getElementById('exibir-info-cadastro').addEventListener('click', () => {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');

    // Exibe as informações no container
    document.getElementById('info-cadastro').innerText = 
    `Nome: ${nome} 
    Email: ${email}`;
    document.getElementById('info-cadastro').style.display = 'block';
});

// Evento para esconder o container quando clicar fora dele
document.addEventListener('click', (event) => {
    const infoCadastro = document.getElementById('info-cadastro');
    const botaoInfo = document.getElementById('exibir-info-cadastro');

    if (event.target !== infoCadastro && event.target !== botaoInfo) {
        infoCadastro.style.display = 'none';
    }
});
