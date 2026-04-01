# 📖 Guia de Uso: QA Automation Platform

Este guia orienta como utilizar a inteligência do **GitHub Copilot** configurada para o nosso time de QA.

## 🛠️ Pré-requisitos
1. Ter o **VS Code** instalado.
2. Estar logado com a conta da empresa que possui licença do **GitHub Copilot**.
3. Ter este repositório (ou o repositório do projeto com a pasta `.github`) aberto no VS Code.

## 🚀 Como gerar Critérios de Aceitação (BDD)
Não é necessário comandos complexos. A plataforma detecta automaticamente tickets do Redmine.

1. Abra o chat do Copilot no VS Code (`Ctrl + Shift + I` ou `Cmd + Shift + I`).
2. Vá ao **Redmine** e copie o conteúdo bruto da tarefa (incluindo Descrição e Orientações).
3. Cole no chat e dê **Enter**.
4. **O que você recebe:** - Análise de Riscos.
   - Cenários BDD (Gherkin) prontos para o Cypress.
   - Prompt para o Desenvolvedor validar o próprio código.

## 🤖 Comandos Específicos (Opcional)
Se precisar de algo focado, você pode usar:
- `@workspace /agent:qa-analyst` -> Focar apenas em análise de negócio.
- `@workspace /agent:qa-automation` -> Pedir para converter um BDD específico em código Cypress.

## 💡 Dicas de Ouro
- **Contexto é Rei**: Se a tarefa mencionar outra atividade (ex: #12345), o Copilot tentará manter a consistência com aquele padrão.
- **Dúvidas**: Se o resultado for vago, pergunte: *"Quais dúvidas você tem sobre este requisito para torná-lo INVEST?"*