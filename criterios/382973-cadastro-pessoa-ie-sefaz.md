# 📋 Ficha de Critérios PanoQA — Atividade #382973

**Tarefa:** [Qualidade] Cadastro de pessoa, busca IE pela Consulta de cadastro  
**Módulo:** Único  
**Versão:** 3.66  
**Responsável:** Andre Macedo da Rosa  
**Prioridade:** Alta  

**Resumo:** A funcionalidade implementa consulta automática de Inscrição Estadual (IE) na SEFAZ para pessoas jurídicas (PJ) sem IE no momento do cadastro. A consulta é disparada após o endereço da pessoa ser persistido, aplica-se apenas a UFs suportadas (BA, GO, MS, MT, PE, PR, RS, SP) e deve preencher a IE automaticamente sem sobrescrever valores já existentes. O risco central é evitar rejeições de NF-e por ausência de IE em clientes PJ.

---

## Critérios de Aceite

| ID  | Tipo       | Critério de Aceite (Verificável) |
|-----|------------|----------------------------------|
| F01 | Funcional  | Quando PJ é cadastrada via site (`/login?trigger=registerForm`) sem informar IE e, em seguida, salva endereço em UF suportada em `/minha-conta/meus-enderecos`, o sistema deve realizar a consulta à SEFAZ e preencher a IE automaticamente no cadastro da pessoa. |
| F02 | Funcional  | Quando PJ finaliza pedido pelo **checkout antigo** sem informar IE e o endereço salvo possui UF suportada, o sistema deve consultar a SEFAZ e preencher a IE após a persistência do endereço. |
| F03 | Funcional  | Quando PJ finaliza pedido pelo **checkout-v2** informando IE como `ISENTO`, o sistema NÃO deve realizar a consulta à SEFAZ e o valor `ISENTO` deve ser mantido sem alteração. |
| F04 | Funcional  | Quando PJ é cadastrada manualmente via **painel administrativo** sem informar IE e o endereço possui UF suportada, o sistema deve consultar a SEFAZ e preencher a IE automaticamente. |
| F05 | Funcional  | Quando um pedido de marketplace é importado para um PJ sem IE e com endereço em UF suportada, o sistema deve consultar a SEFAZ e preencher a IE automaticamente. |
| A01 | Acesso     | Somente pessoas do tipo **Jurídica (PJ)** acionam a consulta à SEFAZ. Pessoa Física (PF) não deve acionar a consulta em nenhum fluxo. |
| A02 | Acesso     | A consulta à SEFAZ deve ocorrer independentemente do fluxo de origem (site, checkout, admin, marketplace), desde que as condições da regra de negócio sejam satisfeitas. |
| I01 | Integridade | Quando a SEFAZ retorna uma IE válida, o valor deve ser persistido no banco de dados no campo IE da pessoa, vinculado ao cadastro correto. |
| I02 | Integridade | Quando uma pessoa já possui IE preenchida (qualquer valor, inclusive `ISENTO`), a consulta à SEFAZ NÃO deve ser realizada e o valor existente não deve ser sobrescrito. |
| U01 | Interface  | Após a consulta automática e preenchimento da IE, o campo IE na área de perfil do cliente (`/minha-conta`) deve exibir o valor persistido pela SEFAZ. |
| R01 | Regra de Negócio | A consulta à SEFAZ somente deve ocorrer quando: (1) pessoa for PJ, (2) IE estiver vazia, (3) endereço tiver UF, e (4) UF estiver na lista suportada: `BA, GO, MS, MT, PE, PR, RS, SP`. Todas as condições são obrigatórias simultaneamente. |
| R02 | Regra de Negócio | Quando a UF do endereço da pessoa NÃO estiver na lista de estados suportados (ex.: RJ, MG, SC, CE, ES), o sistema não deve realizar a consulta à SEFAZ e o fluxo deve seguir normalmente com IE vazia. |
| R03 | Regra de Negócio | A consulta à SEFAZ somente deve ocorrer **após** o endereço ser persistido no banco de dados, nunca durante o preenchimento do formulário de cadastro em memória. |
| R04 | Regra de Negócio | Quando a SEFAZ não retorna IE (empresa não possui IE ativa), o fluxo não deve ser interrompido, o cadastro deve ser concluído normalmente e o campo IE permanece vazio. |
| B01 | Borda      | Quando PJ possui CNPJ válido e existente, mas a empresa não possui IE ativa na SEFAZ, o sistema deve finalizar o cadastro normalmente com IE vazia, sem gerar erro ou exceção. |
| B02 | Borda      | Quando PJ possui endereço em UF suportada mas o serviço da SEFAZ está indisponível (timeout ou erro de conexão), o fluxo de cadastro não deve ser interrompido e o cadastro deve ser concluído normalmente. |
| B03 | Borda      | Quando um PJ já cadastrado sem IE altera o endereço para UF suportada, o sistema deve re-avaliar e executar a consulta à SEFAZ se IE ainda estiver vazia. |
| N01 | Negativo   | Quando o CNPJ informado possui formato inválido (ex.: `00.000.000/0000-00`, todos zeros), a consulta à SEFAZ não deve ser realizada, IE permanece vazia e o cadastro é concluído sem erros. |
| N02 | Negativo   | Quando o CNPJ possui formato válido mas não existe na base da Receita Federal / SEFAZ, a consulta não deve quebrar o fluxo e o campo IE permanece vazio. |
| N03 | Negativo   | Quando a SEFAZ retorna um erro de certificado digital inválido ou configuração ausente, o sistema deve registrar o log do erro sem interromper o cadastro do usuário. |
| RG01 | Regressão | O fluxo de **emissão de NF-e** não deve ser impactado pela funcionalidade: IE preenchida via SEFAZ deve ser aceita normalmente pelo módulo fiscal. |
| RG02 | Regressão | O fluxo de **cadastro de PF** (Pessoa Física) via site, checkout e admin não deve ser alterado por esta funcionalidade. |
| RG03 | Regressão | O fluxo de **checkout-v2** para PJ que informa IE manualmente deve continuar funcionando normalmente, com IE obrigatória no front-end e valor preservado. |

---

## 💻 Prompt de Teste para Automação

### 1. Contexto
Funcionalidade de consulta automática de IE na SEFAZ para PJ sem Inscrição Estadual cadastrada.  
**Impacto de falha:** rejeição de NF-e por ausência de IE → impacto direto no faturamento.

### 2. Implementação
Após persistência de endereço de PJ, o sistema verifica as condições e, se válidas, consulta a SEFAZ via certificado digital, recupera a IE e persiste no cadastro da pessoa.

### 3. Stack
- **Framework:** Cypress (JavaScript)
- **Backend:** PHP/Laravel
- **Gestão:** Redmine #382973
- **Cobertura mínima:** 80%

### 4. Critérios
`F01, F02, F03, F04, F05, A01, A02, I01, I02, U01, R01, R02, R03, R04, B01, B02, B03, N01, N02, N03, RG01, RG02, RG03`

### 5. Regressão

| Módulo           | Risco                                                             |
|------------------|-------------------------------------------------------------------|
| Cadastro PF/PJ   | Consulta acidentalmente acionada para PF ou PJ com IE já existente |
| Checkout v1/v2   | Quebra do fluxo de finalização de pedido                         |
| Faturamento NF-e | IE preenchida incorretamente causando rejeição fiscal            |
| Admin - Pessoas  | Sobrescrita indevida de IE em cadastros existentes               |
| Marketplace      | Falha silenciosa na importação de pedidos PJ                     |

### 6. Dados / Fixtures

| Perfil                        | CNPJ              | UF  | IE Esperada     | Observação                       |
|-------------------------------|-------------------|-----|-----------------|----------------------------------|
| PJ - UF suportada, sem IE     | 83.492.071/0001-60 | SP  | A ser consultada | Panorama Móveis ou equivalente  |
| PJ - UF suportada, com IE     | 54.321.098/0001-11 | PR  | 123.456.789-0   | IE já preenchida, não sobrescrever |
| PJ - UF NÃO suportada         | 99.887.766/0001-22 | RJ  | (vazio)         | Sem consulta à SEFAZ             |
| PJ - IE = ISENTO              | 11.222.333/0001-44 | SP  | ISENTO          | Não sobrescrever                 |
| PJ - CNPJ inválido            | 00.000.000/0000-00 | SP  | (vazio)         | Sem consulta, sem erro           |
| PF - sem IE                   | CPF: 123.456.789-00 | SP | N/A             | Não deve acionar SEFAZ           |

### 7. Saída
Arquivo: `cypress/e2e/cadastro-pessoa/ie-sefaz.cy.js`  
Um teste por critério, estrutura Arrange / Act / Assert, tabela de cobertura ao final.

---

## 📎 Dependências para Execução

- Certificado digital válido configurado no ambiente de homologação
- Configuração de faturamento ativa
- Acesso às UFs suportadas configuradas no ambiente
- Mock de SEFAZ (para testes de falha/indisponibilidade) — contatar @André Cristen para setup de fixtures de marketplace
- Para testes de marketplace: importação de pedidos via Meli conforme combinado com @André Cristen

## 📌 Observações

- Testes de marketplace dependem de JSON customizado fornecido por @André Cristen; compartilhar os CTs com ele antes da execução.
- A consulta ocorre **após** o endereço ser persistido, portanto testes de cadastro sem endereço não devem acionar o fluxo.
- Checkout-v2 possui IE obrigatória no frontend: testar com ISENTO e com IE real para garantir ambos os caminhos.
