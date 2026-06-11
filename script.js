const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const dialogueBox = document.getElementById('dialogue-box');
const dialogueSpeaker = document.getElementById('dialogue-speaker');
const dialogueText = document.getElementById('dialogue-text');
const dialogueNext = document.getElementById('dialogue-next');

// Configurações do Jogo
const grid = 16; // Tamanho base da pixel art
const scale = 3; // Escala para os sprites
const sprSize = grid * scale; // Tamanho desenhado

// Carregar Imagens
const spriteSheet = new Image();
spriteSheet.src = 'assets/minhas_poses.png'; // <- Verifique se o caminho e nome estão certos

let assetsLoaded = false;
spriteSheet.onload = () => { assetsLoaded = true; };

// Mapa Simples (0 = chão, 1 = parede)
const map = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,1], // Uma parede no meio (objeto)
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
];

// Posições (multiplicadas por grid e scale)
// O Personagem "Ela" (que ela controla)
const player = {
    x: 2 * grid * scale,
    y: 7 * grid * scale,
    spr: { x: 0, y: 0 }, // Pose Parada
    speed: 3
};

// O Personagem "Você" (estático)
const target = {
    x: 5 * grid * scale,
    y: 2 * grid * scale,
    spr: { x: 0, y: 0 }, // Pose Parada inicial
    talking Spr: { x: grid * 2, y: 0 } // Pose Falando (terceiro sprite na folha)
};

// Sistema de Diálogo
let dialogueIndex = 0;
const dialogues = [
    "Olá! Que bom que você me encontrou no escuro...",
    "Eu criei esse pequeno mundo pixelado só pra você.",
    "Esse personagem sou eu, te esperando.",
    "Aperte o botão 'A' perto das coisas para descobrir mais sobre mim.",
    "Eu te amo! ❤️"
];

let inDialogue = false;
let nearTarget = false;

// Função principal de desenho
function draw() {
    if (!assetsLoaded) {
        requestAnimationFrame(draw);
        return;
    }
    
    // Limpar Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar o Mapa/Chão (simples)
    ctx.fillStyle = "#111"; // Chão bem escuro
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar "Você" (Personagem Fixo)
    ctx.drawImage(
        spriteSheet, 
        (inDialogue ? target.talkingSpr.x : target.spr.x), target.spr.y, // Origem
        grid, grid, // Tamanho na origem
        target.x, target.y, // Destino
        sprSize, sprSize // Tamanho no destino
    );

    // Desenhar "Ela" (Personagem dela, usando a pose 'andando' da folha como exemplo de variação)
    ctx.drawImage(
        spriteSheet, 
        grid, 0, // Pose 'Andando' (segundo sprite na folha)
        grid, grid,
        player.x, player.y,
        sprSize, sprSize
    );

    // --- Efeito de Lanterna/Escuridão ---
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,1)"; // Escuridão Total
    
    // Cria o círculo de luz ao redor DELA
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height); // Preenche a tela
    ctx.arc(
        player.x + sprSize / 2, // Centro da luz X
        player.y + sprSize / 2, // Centro da luz Y
        80, // Raio da lanterna
        0, Math.PI * 2, true // Inverte o caminho para cortar o círculo
    );
    ctx.fill();
    ctx.restore();

    // Checar Proximidade
    const dist = Math.sqrt(Math.pow((player.x - target.x), 2) + Math.pow((player.y - target.y), 2));
    nearTarget = (dist < sprSize * 1.5); // Ativa se estiver perto

    requestAnimationFrame(draw);
}

// Movimentação
function movePlayer(dx, dy) {
    if (inDialogue) return; // Impede andar se estiver falando

    // Pose 'andando' padrão
    player.x += dx * player.speed;
    player.y += dy * player.speed;

    // Limites Simples do Canvas
    player.x = Math.max(0, Math.min(canvas.width - sprSize, player.x));
    player.y = Math.max(0, Math.min(canvas.height - sprSize, player.y));
}

// Interação
function interact() {
    if (nearTarget && !inDialogue) {
        startDialogue();
    } else if (inDialogue) {
        nextDialogue();
    }
}

function startDialogue() {
    inDialogue = true;
    dialogueIndex = 0;
    dialogueSpeaker.innerText = "Kleiton:";
    dialogueText.innerText = dialogues[dialogueIndex];
    dialogueBox.classList.remove('hidden');
}

function nextDialogue() {
    dialogueIndex++;
    if (dialogueIndex < dialogues.length) {
        dialogueText.innerText = dialogues[dialogueIndex];
    } else {
        closeDialogue();
    }
}

function closeDialogue() {
    inDialogue = false;
    dialogueBox.classList.add('hidden');
}

// --- Controles ---

// Controles Mobile
document.getElementById('btn-up').addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(0, -5); });
document.getElementById('btn-down').addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(0, 5); });
document.getElementById('btn-left').addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(-5, 0); });
document.getElementById('btn-right').addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(5, 0); });
document.getElementById('btn-action').addEventListener('touchstart', (e) => { e.preventDefault(); interact(); });
dialogueNext.addEventListener('click', nextDialogue);

// Controles de Teclado (para teste no PC)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') movePlayer(0, -5);
    if (e.key === 'ArrowDown' || e.key === 's') movePlayer(0, 5);
    if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer(-5, 0);
    if (e.key === 'ArrowRight' || e.key === 'd') movePlayer(5, 0);
    if (e.key === 'e' || e.key === 'Enter') interact();
});

// Iniciar
draw();
