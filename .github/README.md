# 🚀 QA Automation Platform | Copilot Intelligence

Uma estrutura de referência para Engenharia de Qualidade, projetada para escalar a análise de requisitos, automação de testes e revisão de código utilizando **GitHub Copilot Agents**.

## 🧠 Sobre o Projeto
Este repositório centraliza a inteligência de QA da equipe, transformando o Copilot em um especialista contextualizado nas regras de negócio e tecnologias da empresa. Através de agentes customizados, reduzimos o tempo de escrita de BDDs e garantimos que nenhum critério de aceitação crítico seja esquecido.

## 🛠️ Agentes de IA (Copilot Custom Agents)
A plataforma é dividida em três pilares fundamentais localizados em `.github/agents/`:

* **🕵️ PanoQA Analyst:** Especialista em análise de tickets (Redmine), detecção de riscos e geração de BDDs (Gherkin).
* **🤖 PanoQA Automation:** Arquiteto focado em transformar critérios de aceitação em scripts robustos utilizando **Cypress**.
* **🔍 PanoQA Reviewer:** Auditor de qualidade focado em segurança (OWASP), performance e cobertura de testes.

## 🚀 Como Utilizar
Para ativar a inteligência de QA no seu VS Code:

1. Certifique-se de que o repositório está aberto no seu workspace.
2. No chat do Copilot, basta colar o ticket do Redmine.
3. A plataforma detectará automaticamente o contexto e gerará:
    - Análise de Riscos.
    - Critérios de Aceitação (BDD).
    - Prompt de Validação para o Desenvolvedor.

## 🧰 Tech Stack
- **Gestão:** Redmine
- **Automação:** Cypress
- **IA:** GitHub Copilot Business/Enterprise
- **Padrão:** BDD / Gherkin

---
Maintainer: **Andre Macedo da Rosa** 🚀