// Função assíncrona chamada quando o botão "Enviar" é clicado
async function sendMessage() {
    // Seleciona a área de mensagens (chat)
    const chatBox = document.getElementById("chatBox");
  
    // Seleciona o campo de entrada de texto
    const userInput = document.getElementById("userInput");
  
    // Captura o valor digitado pelo usuário
    const userMessage = userInput.value;
  
    // Se o campo estiver vazio, não faz nada (retorna)
    if (!userMessage) return;
  
    // Cria um novo elemento <div> para exibir a mensagem do usuário
    const userDiv = document.createElement("div");
    userDiv.className = "user-message message"; // Aplica as classes CSS
    userDiv.textContent = userMessage; // Define o conteúdo da mensagem
    chatBox.appendChild(userDiv); // Adiciona a mensagem ao chat
  
    // Limpa o campo de entrada após o envio
    userInput.value = "";
  
    // Faz a rolagem automática para o final do chat
    chatBox.scrollTop = chatBox.scrollHeight;
  
    // === CONFIGURAÇÕES DA API DO AZURE OPENAI ===
    const endpoint = ""; // URL do endpoint da Azure
    const apiKey ="";
    const deploymentId = "gpt-4o"; // Nome do deployment configurado no Azure OpenAI
    const apiVersion = "2025-01-01-preview"; // Versão da API
  
    // Monta a URL completa para chamada da API
    const url = `${endpoint}/openai/deployments/${deploymentId}/chat/completions?api-version=${apiVersion}`;
  
    // Dados enviados para a API
    const data = {
      messages: [{ role: "user", content: userMessage }], // Mensagem do usuário
      max_tokens: 100, // Máximo de tokens que o bot pode responder
      temperature: 0.2, // Grau de criatividade da resposta (0 = mais precisa, 1 = mais criativa)
    };
  
    // Cabeçalhos da requisição (tipo e chave da API)
    const headers = {
      "Content-Type": "application/json",
      "api-key": apiKey, // Autorização para acessar a API
    };
  
    // Bloco try/catch para lidar com erros na comunicação
    try {
      // Faz a requisição POST para a API
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
  
      // Se a resposta for bem-sucedida
      if (response.ok) {
        const result = await response.json(); // Converte a resposta em JSON
        const botMessage = result.choices[0].message.content; // Pega o conteúdo da resposta do bot
  
        // Cria um novo elemento <div> com a resposta do bot
        const botDiv = document.createElement("div");
        botDiv.className = "bot-message message";
        botDiv.textContent = botMessage;
        chatBox.appendChild(botDiv); // Adiciona ao chat
  
        // Faz rolagem automática para o final
        chatBox.scrollTop = chatBox.scrollHeight;
      } else {
        // Caso a API retorne erro
        console.error("Erro na requisição", response.status, response.statusText);
  
        const botDiv = document.createElement("div");
        botDiv.className = "bot-message message";
        botDiv.textContent = "Erro ao se comunicar com o serviço.";
        chatBox.appendChild(botDiv);
      }
    } catch (error) {
      // Captura erros de rede ou exceções inesperadas
      console.error("Erro:", error);
  
      const botDiv = document.createElement("div");
      botDiv.className = "bot-message message";
      botDiv.textContent = "Erro ao se comunicar com o serviço.";
      chatBox.appendChild(botDiv);
    }
  }
  