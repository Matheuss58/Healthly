function inicializarRotina() {
    // Mensagem inicial aleatória
    const mensagensIA = [
        "Bom dia! Pronto para organizar seu dia?",
        "Lembre-se de beber água regularmente!",
        "Não se esqueça da sua atividade física hoje.",
        "Que tal reservar 15 minutos para meditação?"
    ];
    
    const iaChat = document.querySelector('.ia-chat p');
    if (iaChat) {
        iaChat.textContent = mensagensIA[Math.floor(Math.random() * mensagensIA.length)];
    }
    
    // Inicializa o chat da IA
    const inputPergunta = document.getElementById('ia-pergunta');
    const btnEnviar = document.getElementById('ia-enviar');
    
    if (inputPergunta && btnEnviar) {
        btnEnviar.addEventListener('click', function() {
            const pergunta = inputPergunta.value.trim();
            if (pergunta) {
                adicionarMensagem(pergunta, 'usuario');
                inputPergunta.value = '';
                
                // Resposta simulada da IA (1 segundo de delay)
                setTimeout(() => {
                    const respostasIA = [
                        `Você perguntou sobre "${pergunta}". Não me importo com isso!`,
                        "Pare de mandar mensagem.",
                        "Não to nem aí.",
                        "Sugiro enviar de novo nesse horário: " + 
                            ["9h", "14h", "amanhã cedo", "após o almoço"][Math.floor(Math.random() * 4)]
                    ];
                    const resposta = respostasIA[Math.floor(Math.random() * respostasIA.length)];
                    adicionarMensagem(resposta, 'ia');
                }, 1000);
            }
        });
        
        // Enviar ao pressionar "Enter"
        inputPergunta.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                btnEnviar.click();
            }
        });
    }
    
    // Carrega histórico salvo
    const historico = JSON.parse(localStorage.getItem('chatHLT')) || [];
    historico.forEach(msg => {
        adicionarMensagem(msg.texto, msg.autor);
    });
}

// Função para adicionar mensagens ao chat
function adicionarMensagem(texto, autor) {
    const mensagensContainer = document.getElementById('ia-mensagens');
    if (!mensagensContainer) return;
    
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `mensagem ${autor}`;
    mensagemDiv.textContent = texto;
    mensagensContainer.appendChild(mensagemDiv);
    mensagensContainer.scrollTop = mensagensContainer.scrollHeight; // Rolagem automática
    
    // Salva no histórico (últimas 10 mensagens)
    const historico = JSON.parse(localStorage.getItem('chatHLT')) || [];
    historico.push({ texto, autor });
    if (historico.length > 10) historico.shift();
    localStorage.setItem('chatHLT', JSON.stringify(historico));
}