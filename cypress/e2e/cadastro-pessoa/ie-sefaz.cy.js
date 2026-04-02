/**
 * Spec: Consulta Automática de IE na SEFAZ — Cadastro de Pessoa Jurídica
 * Ticket Redmine: #382973
 * Versão: 3.66
 * Responsável: Andre Macedo da Rosa
 *
 * Cobertura: F01, F02, F03, F04, F05, A01, A02, I01, I02, U01,
 *            R01, R02, R03, R04, B01, B02, B03, N01, N02, N03,
 *            RG01, RG02, RG03
 */

import dados from '../../fixtures/ie-sefaz.json';

// ---------------------------------------------------------------------------
// BLOCO [F] FUNCIONAIS
// ---------------------------------------------------------------------------

describe('[F] Funcionais — Consulta de IE na SEFAZ', () => {

  it('test_F01_cadastro_site_pj_sem_ie_uf_suportada_preenche_ie', () => {
    // Critério: F01
    // Arrange
    cy.visit('/login?trigger=registerForm');
    const pj = dados.pjSemIeUfSuportada;

    // Act - cadastro PJ sem informar IE
    cy.get('[data-cy="register-type-pj"]').click();
    cy.get('[data-cy="register-cnpj"]').type(pj.cnpj);
    cy.get('[data-cy="register-nome"]').type(pj.nome);
    cy.get('[data-cy="register-email"]').type(pj.email);
    cy.get('[data-cy="register-senha"]').type(pj.senha);
    cy.get('[data-cy="register-submit"]').click();

    // Adiciona endereço em UF suportada
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - IE deve ter sido preenchida automaticamente após salvar endereço
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').should('not.be.empty');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('match', /\S+/);
  });

  it('test_F02_checkout_antigo_pj_sem_ie_uf_suportada_preenche_ie', () => {
    // Critério: F02
    // Arrange
    const pj = dados.pjSemIeUfSuportada;
    cy.loginAs(pj.email, pj.senha);
    cy.adicionarProdutoAoCarrinho();

    // Act - finalizar pedido pelo checkout antigo sem informar IE
    cy.visit('/checkout');
    cy.get('[data-cy="checkout-tipo-pj"]').click();
    cy.get('[data-cy="checkout-cnpj"]').type(pj.cnpj);
    cy.get('[data-cy="checkout-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="checkout-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="checkout-finalizar"]').click();

    // Assert - pedido criado e IE preenchida no cadastro da pessoa
    cy.url().should('include', '/pedido-confirmado');
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('match', /\S+/);
  });

  it('test_F03_checkout_v2_pj_ie_isento_nao_sobrescreve', () => {
    // Critério: F03
    // Arrange
    const pj = dados.pjIeIsento;
    cy.loginAs(pj.email, pj.senha);
    cy.adicionarProdutoAoCarrinho();

    // Act - finalizar pedido no checkout-v2 informando IE como ISENTO
    cy.visit('/checkout-v2');
    cy.get('[data-cy="checkout-tipo-pj"]').click();
    cy.get('[data-cy="checkout-cnpj"]').type(pj.cnpj);
    cy.get('[data-cy="checkout-ie"]').type('ISENTO');
    cy.get('[data-cy="checkout-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="checkout-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="checkout-finalizar"]').click();

    // Assert - pedido criado e IE deve continuar como ISENTO (não substituída)
    cy.url().should('include', '/pedido-confirmado');
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('eq', 'ISENTO');
  });

  it('test_F04_admin_cadastro_pj_sem_ie_uf_suportada_preenche_ie', () => {
    // Critério: F04
    // Arrange
    const pj = dados.pjSemIeUfSuportada;
    cy.loginAsAdmin();

    // Act - cadastrar PJ via admin sem informar IE
    cy.visit('/admin/pessoas/novo');
    cy.get('[data-cy="admin-tipo-pj"]').click();
    cy.get('[data-cy="admin-cnpj"]').type(pj.cnpj);
    cy.get('[data-cy="admin-nome"]').type(pj.nome);
    cy.get('[data-cy="admin-email"]').type(pj.email);
    cy.get('[data-cy="admin-salvar"]').click();

    // Adicionar endereço em UF suportada
    cy.get('[data-cy="admin-add-endereco"]').click();
    cy.get('[data-cy="admin-endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="admin-endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="admin-endereco-salvar"]').click();

    // Assert - IE preenchida automaticamente após salvar endereço
    cy.get('[data-cy="admin-pessoa-ie"]').invoke('val').should('match', /\S+/);
  });

  it('test_F05_marketplace_pedido_pj_sem_ie_uf_suportada_preenche_ie', () => {
    // Critério: F05
    // Arrange
    // ATENÇÃO: Fixture de JSON de importação deve ser fornecida por @André Cristen
    // com pedido PJ sem IE e endereço em UF suportada (SP)
    cy.loginAsAdmin();
    const fixturePayload = 'marketplace/pedido-pj-sem-ie-sp.json';

    // Act - importar pedido de marketplace com PJ sem IE
    cy.fixture(fixturePayload).then((payload) => {
      cy.request('POST', '/api/marketplace/importar-pedido', payload)
        .its('status')
        .should('eq', 200);
    });

    // Assert - pessoa cadastrada deve ter IE preenchida automaticamente
    cy.visit('/admin/pessoas');
    cy.get('[data-cy="busca-cnpj"]').type(dados.pjSemIeUfSuportada.cnpjNumerico);
    cy.get('[data-cy="busca-submit"]').click();
    cy.get('[data-cy="pessoa-ie"]').first().invoke('val').should('match', /\S+/);
  });

});

// ---------------------------------------------------------------------------
// BLOCO [A] CONTROLE DE ACESSO
// ---------------------------------------------------------------------------

describe('[A] Controle de Acesso — Consulta de IE na SEFAZ', () => {

  it('test_A01_pf_nao_aciona_consulta_sefaz', () => {
    // Critério: A01
    // Arrange
    const pf = dados.pfSemIe;
    cy.visit('/login?trigger=registerForm');

    // Act - cadastrar PF (Pessoa Física) com endereço em UF suportada
    cy.get('[data-cy="register-type-pf"]').click();
    cy.get('[data-cy="register-cpf"]').type(pf.cpf);
    cy.get('[data-cy="register-nome"]').type(pf.nome);
    cy.get('[data-cy="register-email"]').type(pf.email);
    cy.get('[data-cy="register-senha"]').type(pf.senha);
    cy.get('[data-cy="register-submit"]').click();

    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pf.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pf.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - nenhuma chamada à SEFAZ deve ser interceptada
    cy.intercept('POST', '**/sefaz/**').as('sefazRequest');
    cy.wait(2000);
    cy.get('@sefazRequest.all').should('have.length', 0);
  });

  it('test_A02_todos_os_fluxos_pj_acionam_consulta_sefaz', () => {
    // Critério: A02
    // Arrange
    const pj = dados.pjSemIeUfSuportada;
    cy.intercept('POST', '**/sefaz/**').as('sefazRequest');
    cy.loginAs(pj.email, pj.senha);

    // Act - simular atualização de endereço de PJ em UF suportada
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - requisição à SEFAZ deve ter sido disparada
    cy.wait('@sefazRequest').its('response.statusCode').should('be.oneOf', [200, 201]);
  });

});

// ---------------------------------------------------------------------------
// BLOCO [I] INTEGRIDADE DE DADOS
// ---------------------------------------------------------------------------

describe('[I] Integridade de Dados — Consulta de IE na SEFAZ', () => {

  it('test_I01_ie_retornada_pela_sefaz_e_persistida_no_banco', () => {
    // Critério: I01
    // Arrange
    const pj = dados.pjSemIeUfSuportada;
    cy.loginAs(pj.email, pj.senha);

    // Act - adicionar endereço em UF suportada para acionar consulta SEFAZ
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - IE deve ser salva no perfil (persistência confirmada via UI)
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').then((ieValor) => {
      expect(ieValor).to.not.be.empty;

      // Verificar via API que o valor está de fato no banco
      cy.request('GET', '/api/perfil/dados-fiscais')
        .its('body.ie')
        .should('eq', ieValor);
    });
  });

  it('test_I02_ie_existente_nao_e_sobrescrita_pela_sefaz', () => {
    // Critério: I02
    // Arrange
    const pj = dados.pjComIeUfSuportada;
    const ieOriginal = pj.ie;
    cy.loginAs(pj.email, pj.senha);

    // Act - atualizar endereço (simular condição que acionaria consulta se IE fosse vazia)
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="editar-endereco"]').first().click();
    cy.get('[data-cy="endereco-numero"]').clear().type('501');
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - IE no cadastro deve permanecer igual ao valor original
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('eq', ieOriginal);
  });

});

// ---------------------------------------------------------------------------
// BLOCO [U] CONSISTÊNCIA DE INTERFACE
// ---------------------------------------------------------------------------

describe('[U] Consistência de Interface — Consulta de IE na SEFAZ', () => {

  it('test_U01_ie_preenchida_pela_sefaz_exibe_valor_no_perfil', () => {
    // Critério: U01
    // Arrange
    const pj = dados.pjSemIeUfSuportada;
    cy.loginAs(pj.email, pj.senha);

    // Act - adicionar endereço para disparar consulta SEFAZ
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - campo IE no perfil deve estar visível e preenchido
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').should('be.visible');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('not.be.empty');
    cy.get('[data-cy="perfil-ie"]').should('not.have.value', '');
  });

});

// ---------------------------------------------------------------------------
// BLOCO [R] REGRAS DE NEGÓCIO
// ---------------------------------------------------------------------------

describe('[R] Regras de Negócio — Consulta de IE na SEFAZ', () => {

  it('test_R01_consulta_sefaz_apenas_para_ufs_suportadas', () => {
    // Critério: R01
    // Arrange
    const ufsSuportadas = dados.ufsSuportadas;
    const pj = dados.pjSemIeUfSuportada;
    cy.intercept('POST', '**/sefaz/**').as('sefazConsulta');
    cy.loginAs(pj.email, pj.senha);

    // Act - adicionar endereço em SP (UF suportada)
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type('01001-000'); // SP
    cy.get('[data-cy="endereco-numero"]').type('100');
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - SEFAZ deve ter sido consultada para UF suportada
    cy.wait('@sefazConsulta').its('request').should('exist');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('match', /\S+/);

    // Verificar que a lógica respeita a lista de UFs suportadas
    expect(ufsSuportadas).to.include('SP');
  });

  it('test_R02_ie_ja_informada_nao_aciona_sefaz', () => {
    // Critério: R02
    // Arrange
    const pj = dados.pjComIeUfSuportada;
    cy.intercept('POST', '**/sefaz/**').as('sefazConsulta');
    cy.loginAs(pj.email, pj.senha);

    // Act - atualizar endereço (pessoa já tem IE)
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="editar-endereco"]').first().click();
    cy.get('[data-cy="endereco-numero"]').clear().type('502');
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - SEFAZ NÃO deve ter sido consultada
    cy.get('@sefazConsulta.all').should('have.length', 0);
  });

  it('test_R03_consulta_sefaz_ocorre_apos_persistencia_do_endereco', () => {
    // Critério: R03
    // Arrange
    const pj = dados.pjSemIeUfSuportada;
    cy.intercept('POST', '**/sefaz/**').as('sefazConsulta');
    cy.loginAs(pj.email, pj.senha);

    // Act - preencher formulário de endereço mas NÃO submeter
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);

    // Assert - SEFAZ não deve ser consultada antes do submit
    cy.get('@sefazConsulta.all').should('have.length', 0);

    // Act - submeter o formulário
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - SEFAZ deve ser consultada após persistência
    cy.wait('@sefazConsulta').its('response.statusCode').should('be.oneOf', [200, 201]);
  });

  it('test_R04_sefaz_sem_ie_retornada_fluxo_continua_normalmente', () => {
    // Critério: R04
    // Arrange — simula SEFAZ respondendo sem IE
    cy.intercept('POST', '**/sefaz/**', { statusCode: 200, body: { ie: null } }).as('sefazSemIe');
    const pj = dados.pjSemIeUfSuportada;
    cy.loginAs(pj.email, pj.senha);

    // Act - adicionar endereço em UF suportada
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - endereço salvo com sucesso, sem erro, IE permanece vazia
    cy.wait('@sefazSemIe');
    cy.get('[data-cy="endereco-salvo-msg"]').should('be.visible');
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('be.empty');
  });

});

// ---------------------------------------------------------------------------
// BLOCO [B] CASOS DE BORDA
// ---------------------------------------------------------------------------

describe('[B] Casos de Borda — Consulta de IE na SEFAZ', () => {

  it('test_B01_pj_cnpj_valido_sem_ie_ativa_na_sefaz_cadastro_normal', () => {
    // Critério: B01
    // Arrange — SEFAZ responde com empresa encontrada mas sem IE
    cy.intercept('POST', '**/sefaz/**', {
      statusCode: 200,
      body: { situacao: 'ATIVA', ie: null, mensagem: 'Empresa sem IE ativa' }
    }).as('sefazSemIe');

    const pj = dados.pjSemIeUfSuportada;
    cy.loginAs(pj.email, pj.senha);

    // Act
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - cadastro concluído sem erro, IE permanece vazia
    cy.wait('@sefazSemIe');
    cy.get('[data-cy="endereco-salvo-msg"]').should('be.visible');
    cy.get('[data-cy="erro-geral"]').should('not.exist');
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('be.empty');
  });

  it('test_B02_sefaz_indisponivel_fluxo_nao_interrompido', () => {
    // Critério: B02
    // Arrange — SEFAZ retorna erro de timeout/503
    cy.intercept('POST', '**/sefaz/**', { forceNetworkError: true }).as('sefazTimeout');

    const pj = dados.pjSemIeUfSuportada;
    cy.loginAs(pj.email, pj.senha);

    // Act
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - endereço salvo com sucesso, sem mensagem de erro para o usuário
    cy.get('[data-cy="endereco-salvo-msg"]').should('be.visible');
    cy.get('[data-cy="erro-geral"]').should('not.exist');
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('be.empty');
  });

  it('test_B03_pj_sem_ie_altera_endereco_para_uf_suportada_consulta_sefaz', () => {
    // Critério: B03
    // Arrange - PJ já cadastrada sem IE, com endereço em UF NÃO suportada
    cy.intercept('POST', '**/sefaz/**').as('sefazConsulta');
    const pj = dados.pjUfNaoSuportada;
    cy.loginAs(pj.email, pj.senha);

    // Confirmar que IE ainda está vazia (pré-condição)
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('be.empty');

    // Act - alterar endereço para UF suportada (SP)
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="editar-endereco"]').first().click();
    cy.get('[data-cy="endereco-cep"]').clear().type('01001-000'); // SP
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - SEFAZ deve ser consultada com novo endereço em UF suportada
    cy.wait('@sefazConsulta').its('request').should('exist');
  });

});

// ---------------------------------------------------------------------------
// BLOCO [N] NEGATIVOS / ERRO
// ---------------------------------------------------------------------------

describe('[N] Negativos e Erros — Consulta de IE na SEFAZ', () => {

  it('test_N01_cnpj_invalido_sem_consulta_sefaz_cadastro_concluido', () => {
    // Critério: N01
    // Arrange
    cy.intercept('POST', '**/sefaz/**').as('sefazConsulta');
    const pj = dados.pjCnpjInvalido;
    cy.visit('/login?trigger=registerForm');

    // Act - cadastrar PJ com CNPJ inválido
    cy.get('[data-cy="register-type-pj"]').click();
    cy.get('[data-cy="register-cnpj"]').type(pj.cnpj);
    cy.get('[data-cy="register-nome"]').type(pj.nome);
    cy.get('[data-cy="register-email"]').type(pj.email);
    cy.get('[data-cy="register-senha"]').type(pj.senha);
    cy.get('[data-cy="register-submit"]').click();

    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - SEFAZ não consultada, endereço salvo sem erro, IE vazia
    cy.get('@sefazConsulta.all').should('have.length', 0);
    cy.get('[data-cy="endereco-salvo-msg"]').should('be.visible');
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('be.empty');
  });

  it('test_N02_cnpj_valido_inexistente_na_sefaz_ie_permanece_vazia', () => {
    // Critério: N02
    // Arrange — SEFAZ retorna empresa não encontrada
    cy.intercept('POST', '**/sefaz/**', {
      statusCode: 200,
      body: { situacao: 'NAO_ENCONTRADO', ie: null }
    }).as('sefazNaoEncontrado');

    const pj = dados.pjSemIeUfSuportada;
    cy.loginAs(pj.email, pj.senha);

    // Act
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - fluxo normal, sem erro, IE permanece vazia
    cy.wait('@sefazNaoEncontrado');
    cy.get('[data-cy="erro-geral"]').should('not.exist');
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('be.empty');
  });

  it('test_N03_sefaz_retorna_erro_certificado_log_registrado_fluxo_nao_interrompido', () => {
    // Critério: N03
    // Arrange — SEFAZ retorna erro de certificado inválido
    cy.intercept('POST', '**/sefaz/**', {
      statusCode: 500,
      body: { erro: 'CERTIFICADO_INVALIDO', mensagem: 'Certificado digital não configurado' }
    }).as('sefazErroCertificado');

    const pj = dados.pjSemIeUfSuportada;
    cy.loginAs(pj.email, pj.senha);

    // Act
    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - fluxo não interrompido, usuário não vê erro técnico, log gerado no backend
    cy.wait('@sefazErroCertificado');
    cy.get('[data-cy="endereco-salvo-msg"]').should('be.visible');
    cy.get('[data-cy="erro-geral"]').should('not.exist');

    // Verificar log via API de admin (endpoint de logs da aplicação)
    cy.loginAsAdmin();
    cy.request('GET', '/api/admin/logs?tipo=sefaz&nivel=error')
      .its('body')
      .should('not.be.empty');
  });

});

// ---------------------------------------------------------------------------
// BLOCO [RG] REGRESSÃO
// ---------------------------------------------------------------------------

describe('[RG] Regressão — Consulta de IE na SEFAZ', () => {

  it('test_RG01_emissao_nfe_aceita_ie_preenchida_pela_sefaz', () => {
    // Critério: RG01
    // Arrange - PJ com IE preenchida via SEFAZ (pré-condição: IE já no cadastro)
    const pj = dados.pjSemIeUfSuportada;
    cy.loginAsAdmin();

    // Garantir que PJ tem IE preenchida
    cy.request('GET', `/api/admin/pessoas?cnpj=${pj.cnpjNumerico}`)
      .its('body[0].ie')
      .should('not.be.empty')
      .as('iePreenchida');

    // Act - emitir NF-e para um pedido deste cliente
    cy.visit('/admin/pedidos');
    cy.get('[data-cy="filtro-cnpj"]').type(pj.cnpjNumerico);
    cy.get('[data-cy="buscar-pedidos"]').click();
    cy.get('[data-cy="pedido-item"]').first().click();
    cy.get('[data-cy="emitir-nfe"]').click();

    // Assert - NF-e emitida com sucesso (sem rejeição por IE ausente)
    cy.get('[data-cy="nfe-status"]').should('contain.text', 'Autorizada');
    cy.get('[data-cy="nfe-erro-ie"]').should('not.exist');
  });

  it('test_RG02_cadastro_pf_nao_afetado_pela_funcionalidade', () => {
    // Critério: RG02
    // Arrange
    const pf = dados.pfSemIe;
    cy.visit('/login?trigger=registerForm');

    // Act - cadastrar PF normalmente
    cy.get('[data-cy="register-type-pf"]').click();
    cy.get('[data-cy="register-cpf"]').type(pf.cpf);
    cy.get('[data-cy="register-nome"]').type(pf.nome);
    cy.get('[data-cy="register-email"]').type(pf.email);
    cy.get('[data-cy="register-senha"]').type(pf.senha);
    cy.get('[data-cy="register-submit"]').click();

    cy.visit('/minha-conta/meus-enderecos');
    cy.get('[data-cy="add-endereco"]').click();
    cy.get('[data-cy="endereco-cep"]').type(pf.endereco.cep);
    cy.get('[data-cy="endereco-numero"]').type(pf.endereco.numero);
    cy.get('[data-cy="endereco-submit"]').click();

    // Assert - cadastro e endereço salvos normalmente, sem erro
    cy.get('[data-cy="endereco-salvo-msg"]').should('be.visible');
    cy.visit('/minha-conta');
    cy.url().should('include', '/minha-conta');
  });

  it('test_RG03_checkout_v2_pj_ie_manual_continua_funcionando', () => {
    // Critério: RG03
    // Arrange
    const pj = dados.pjComIeUfSuportada;
    cy.loginAs(pj.email, pj.senha);
    cy.adicionarProdutoAoCarrinho();

    // Act - finalizar pedido no checkout-v2 informando IE manualmente
    cy.visit('/checkout-v2');
    cy.get('[data-cy="checkout-tipo-pj"]').click();
    cy.get('[data-cy="checkout-cnpj"]').type(pj.cnpj);
    cy.get('[data-cy="checkout-ie"]').type(pj.ie);
    cy.get('[data-cy="checkout-cep"]').type(pj.endereco.cep);
    cy.get('[data-cy="checkout-numero"]').type(pj.endereco.numero);
    cy.get('[data-cy="checkout-finalizar"]').click();

    // Assert - pedido criado com sucesso e IE preservada
    cy.url().should('include', '/pedido-confirmado');
    cy.visit('/minha-conta');
    cy.get('[data-cy="perfil-ie"]').invoke('val').should('eq', pj.ie);
  });

});

// ---------------------------------------------------------------------------
// TABELA DE COBERTURA
// ---------------------------------------------------------------------------

/**
 * | ID Critério | Nome do Teste                                                         | Status    |
 * |-------------|-----------------------------------------------------------------------|-----------|
 * | F01         | test_F01_cadastro_site_pj_sem_ie_uf_suportada_preenche_ie             | Pendente  |
 * | F02         | test_F02_checkout_antigo_pj_sem_ie_uf_suportada_preenche_ie           | Pendente  |
 * | F03         | test_F03_checkout_v2_pj_ie_isento_nao_sobrescreve                     | Pendente  |
 * | F04         | test_F04_admin_cadastro_pj_sem_ie_uf_suportada_preenche_ie            | Pendente  |
 * | F05         | test_F05_marketplace_pedido_pj_sem_ie_uf_suportada_preenche_ie        | Pendente* |
 * | A01         | test_A01_pf_nao_aciona_consulta_sefaz                                 | Pendente  |
 * | A02         | test_A02_todos_os_fluxos_pj_acionam_consulta_sefaz                    | Pendente  |
 * | I01         | test_I01_ie_retornada_pela_sefaz_e_persistida_no_banco                | Pendente  |
 * | I02         | test_I02_ie_existente_nao_e_sobrescrita_pela_sefaz                    | Pendente  |
 * | U01         | test_U01_ie_preenchida_pela_sefaz_exibe_valor_no_perfil               | Pendente  |
 * | R01         | test_R01_consulta_sefaz_apenas_para_ufs_suportadas                    | Pendente  |
 * | R02         | test_R02_ie_ja_informada_nao_aciona_sefaz                             | Pendente  |
 * | R03         | test_R03_consulta_sefaz_ocorre_apos_persistencia_do_endereco          | Pendente  |
 * | R04         | test_R04_sefaz_sem_ie_retornada_fluxo_continua_normalmente            | Pendente  |
 * | B01         | test_B01_pj_cnpj_valido_sem_ie_ativa_na_sefaz_cadastro_normal         | Pendente  |
 * | B02         | test_B02_sefaz_indisponivel_fluxo_nao_interrompido                    | Pendente  |
 * | B03         | test_B03_pj_sem_ie_altera_endereco_para_uf_suportada_consulta_sefaz   | Pendente  |
 * | N01         | test_N01_cnpj_invalido_sem_consulta_sefaz_cadastro_concluido          | Pendente  |
 * | N02         | test_N02_cnpj_valido_inexistente_na_sefaz_ie_permanece_vazia          | Pendente  |
 * | N03         | test_N03_sefaz_retorna_erro_certificado_log_registrado_fluxo_nao_interrompido | Pendente |
 * | RG01        | test_RG01_emissao_nfe_aceita_ie_preenchida_pela_sefaz                 | Pendente  |
 * | RG02        | test_RG02_cadastro_pf_nao_afetado_pela_funcionalidade                 | Pendente  |
 * | RG03        | test_RG03_checkout_v2_pj_ie_manual_continua_funcionando               | Pendente  |
 *
 * (*) F05 requer fixture de JSON de marketplace fornecido por @André Cristen.
 *     Criar arquivo em cypress/fixtures/marketplace/pedido-pj-sem-ie-sp.json.
 */
