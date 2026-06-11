const chatBody = document.getElementById('chat-body');
const optionsContainer = document.getElementById('options-container');
const chatContainer = document.getElementById('chat-container');
const crackOverlay = document.getElementById('crack-overlay');

let naoClickCount = 0;
let mudouEstetica = false;

// Banco de dados de perguntas principais salvas para restaurar depois
function carregarPerguntasIniciais() {
    clearOptions();
    addOption("Por que está com a estética da Kuromi?", () => rotaKuromi());
    addOption("Me conte mais sobre você...", () => rotaSobreMim());
    addOption("Me conte uma história sua", () => rotaHistoriaSua());
}

// Funções Auxiliares de Interface
function addMessage(text, sender = 'kuromi') {
    const msg = document.createElement('div');
    msg.classList.add('msg', sender);
    msg.innerText = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function clearOptions() {
    optionsContainer.innerHTML = '';
}

function addOption(text, callback, customStyle = null) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.addEventListener('click', callback);
    if(customStyle) Object.assign(btn.style, customStyle);
    optionsContainer.appendChild(btn);
    return btn;
}

// --- FASE 1: Tela Inicial ---
function telaInicial() {
    addMessage("Oi amor, seja bem vinda ao meu site dedicado especialmente para você! 🖤");
    addOption("OK", () => segundaTela());
}

// --- FASE 2: Introdução e Teste do Sim/Não ---
function segundaTela() {
    addMessage("Aqui é onde você pode saber um pouco mais de mim, então vamos começar?");
    naoClickCount = 0;
    mostrarBotoesSimNao();
}

function mostrarBotoesSimNao() {
    clearOptions();
    addOption("Sim", () => cliqueiSim());
    
    // Gerar o botão Não que muda de posição ou quebra a tela
    const btnNao = addOption("Não", () => cliqueiNao());
    
    if (naoClickCount > 0) {
        // Deixa o botão em um lugar aleatório flutuante caso ela já tenha falhado
        btnNao.style.position = 'absolute';
        btnNao.style.left = Math.random() * 70 + 10 + '%';
        btnNao.style.top = Math.random() * 70 + 10 + '%';
    }
}

function cliqueiNao() {
    naoClickCount++;
    
    if (naoClickCount === 1) {
        chatContainer.classList.add('shake');
        addMessage("⚠️ Ei! Não vale recusar! Tente de novo...");
        setTimeout(() => chatContainer.classList.remove('shake'), 1000);
        mostrarBotoesSimNao();
    } 
    else if (naoClickCount === 2) {
        chatContainer.classList.add('shake');
        crackOverlay.classList.remove('hidden'); // Ativa a rachadura visual
        addMessage("💥 VOCÊ QUASE QUEBROU O SISTEMA! Última chance...");
        setTimeout(() => chatContainer.classList.remove('shake'), 1000);
        mostrarBotoesSimNao();
    } 
    else if (naoClickCount >= 3) {
        clearOptions();
        chatBody.innerHTML = '';
        document.body.style.backgroundColor = '#000';
        chatContainer.innerHTML = `<div style="padding:50px; text-align:center; color:red; font-size:24px; font-weight:bold;">SISTEMA BLOQUEADO: VOCÊ FOI BANIDA DO MEU CORAÇÃO 🔒</div>`;
    }
}

function cliqueiSim() {
    if (naoClickCount >= 2) {
        // Animação de consertar a tela com flash de luz
        chatContainer.classList.add('flash-light');
        crackOverlay.classList.add('hidden');
        setTimeout(() => chatContainer.classList.remove('flash-light'), 500);
    }
    addMessage("Perfeito! Vamos entrar nas perguntas. O que quer saber?");
    carregarPerguntasIniciais();
}

// --- FASE 3: Rotas das Perguntas Principais ---

// PERGUNTA 1: Estética da Kuromi
function rotaKuromi() {
    addMessage("É porque me veio à cabeça de repente... gostaria de mudar?");
    clearOptions();
    addOption("Sim", () => {
        mudouEstetica = true;
        chatContainer.classList.add('monochrome-theme');
        addMessage("Estética alterada para Preto e Branco. Prosseguindo...");
        carregarPerguntasIniciais();
    });
    addOption("Não", () => {
        addMessage("Beleza, mantendo o estilo Kuromi ativo!");
        carregarPerguntasIniciais();
    });
}

// PERGUNTA 2: Me conte uma história sua (Braço Fraturado)
function rotaHistoriaSua() {
    // Se a estética mudou, ela não exibe animações da Kuromi
    if (!mudouEstetica) {
        addMessage("💬 [Kuromi senta para te explicar uma coisa muito importante...]");
    }
    
    addMessage("Eu antes não era alguém tão seco assim. Quando criança eu era cheio de energia e teve um dia que eu já fraturei o meu braço. Quando cheguei em casa, minha mãe arregalou os olhos e esteve em choque. Nesse dia ela teve que procurar por hospitais a pé para me tratarem e eu sinceramente me senti mal, pois eu nunca quis dar trabalho aos outros por coisas descuidadas que eu fiz. Nesse dia senti que deveria ter cuidado para que as pessoas não possam ter trabalho.");
    
    carregarPerguntasIniciais();
}

// PERGUNTA 3: Me conte mais sobre você (Desabafo sobre Abuso Emocional)
function rotaSobreMim() {
    addMessage("Eu já sofri de abuso emocional e sinceramente eu me distancio de pessoas que chegam a falar coisas de mau gosto e optam por atacar a minha vontade de sentir o que posso, como raiva, ou até mesmo mostrar que me senti ofendido, e levam como se eu estivesse errado e que levo tudo a sério. Para mim isso é covardia.");
    
    carregarPerguntasIniciais();
}

// Inicializar o chat
telaInicial();
