// Atividade: #386272 - Erro ao subir anuncios para o MELI - Direto Sim
// Modulo: Hub (Marketplaces) > Mercado Livre > Publicacao de Anuncio (hub_meli_anuncio)
// Tipo: Correcao de Bug + Regressao
// Bug: API do MELI passou a exigir dimensoes do produto E do pacote; sistema enviava apenas um conjunto

import meliFixture from '../../fixtures/386272_meli_anuncio.json';

const URL_LOGIN = Cypress.env('loginUrl') || '/login';
const URL_MELI_ANUNCIOS = Cypress.env('meliAnunciosUrl') || '/hub/marketplaces/mercado-livre/anuncios';
const URL_OUTRO_CANAL = Cypress.env('outroCanalUrl') || '/hub/marketplaces/outro-canal/anuncios';

// ---------------------------------------------------------------------------
// Critério: F01
// ---------------------------------------------------------------------------
it('test_F01_publicar_anuncio_com_dimensoes_produto_e_pacote_preenchidas', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(meliFixture.operador.usuario);
  cy.get('[data-cy="input-senha"]').type(meliFixture.operador.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_MELI_ANUNCIOS);
  cy.get('[data-cy="input-busca-sku"]').type(meliFixture.anuncioDimensoesCompletas.sku);
  cy.get('[data-cy="btn-buscar"]').click();
  cy.contains(meliFixture.anuncioDimensoesCompletas.sku).should('be.visible');
  cy.get('[data-cy="btn-publicar-anuncio"]').first().click();
  cy.get('[data-cy="btn-confirmar-publicacao"]').click();

  // Assert
  cy.contains(meliFixture.msgErroDimensoesProduto).should('not.exist');
  cy.contains(meliFixture.msgErroDimensoesPacote).should('not.exist');
  cy.get('[data-cy="msg-sucesso"]').should('be.visible');
  cy.contains(meliFixture.statusPublicado).should('be.visible');
});

// ---------------------------------------------------------------------------
// Critério: N01
// ---------------------------------------------------------------------------
it('test_N01_bloquear_publicacao_sem_dimensoes_do_produto', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(meliFixture.operador.usuario);
  cy.get('[data-cy="input-senha"]').type(meliFixture.operador.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_MELI_ANUNCIOS);
  cy.get('[data-cy="input-busca-sku"]').type(meliFixture.anuncioSemDimensoesProduto.sku);
  cy.get('[data-cy="btn-buscar"]').click();
  cy.contains(meliFixture.anuncioSemDimensoesProduto.sku).should('be.visible');
  cy.get('[data-cy="btn-publicar-anuncio"]').first().click();
  cy.get('[data-cy="btn-confirmar-publicacao"]').click();

  // Assert
  cy.contains(meliFixture.msgErroDimensoesProduto).should('be.visible');
  cy.get('[data-cy="msg-sucesso"]').should('not.exist');
  cy.contains(meliFixture.statusPublicado).should('not.exist');
});

// ---------------------------------------------------------------------------
// Critério: N02
// ---------------------------------------------------------------------------
it('test_N02_bloquear_publicacao_sem_dimensoes_do_pacote', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(meliFixture.operador.usuario);
  cy.get('[data-cy="input-senha"]').type(meliFixture.operador.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_MELI_ANUNCIOS);
  cy.get('[data-cy="input-busca-sku"]').type(meliFixture.anuncioSemDimensoesPacote.sku);
  cy.get('[data-cy="btn-buscar"]').click();
  cy.contains(meliFixture.anuncioSemDimensoesPacote.sku).should('be.visible');
  cy.get('[data-cy="btn-publicar-anuncio"]').first().click();
  cy.get('[data-cy="btn-confirmar-publicacao"]').click();

  // Assert
  cy.contains(meliFixture.msgErroDimensoesPacote).should('be.visible');
  cy.get('[data-cy="msg-sucesso"]').should('not.exist');
  cy.contains(meliFixture.statusPublicado).should('not.exist');
});

// ---------------------------------------------------------------------------
// Critério: RG01
// ---------------------------------------------------------------------------
it('test_RG01_reprocessar_anuncio_apos_preenchimento_dimensoes_faltantes', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(meliFixture.operador.usuario);
  cy.get('[data-cy="input-senha"]').type(meliFixture.operador.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_MELI_ANUNCIOS);
  cy.get('[data-cy="input-busca-sku"]').type(meliFixture.anuncioFalhaAnterior.sku);
  cy.get('[data-cy="btn-buscar"]').click();
  cy.contains(meliFixture.anuncioFalhaAnterior.sku).should('be.visible');
  cy.get('[data-cy="btn-publicar-anuncio"]').first().click();
  cy.get('[data-cy="btn-confirmar-publicacao"]').click();

  // Assert
  cy.contains(meliFixture.msgErroDimensoesProduto).should('not.exist');
  cy.contains(meliFixture.msgErroDimensoesPacote).should('not.exist');
  cy.get('[data-cy="msg-sucesso"]').should('be.visible');
  cy.contains(meliFixture.statusPublicado).should('be.visible');
});

// ---------------------------------------------------------------------------
// Critério: A01
// ---------------------------------------------------------------------------
it('test_A01_acesso_a_tela_meli_bloqueado_para_usuario_nao_autenticado', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();

  // Act
  cy.visit(URL_MELI_ANUNCIOS, { failOnStatusCode: false });

  // Assert
  cy.url().should('include', 'login');
  cy.get('[data-cy="btn-publicar-anuncio"]').should('not.exist');
});

// ---------------------------------------------------------------------------
// Critério: RG02
// ---------------------------------------------------------------------------
it('test_RG02_publicacao_outro_canal_nao_afetada_pela_validacao_de_dimensoes_meli', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(meliFixture.operador.usuario);
  cy.get('[data-cy="input-senha"]').type(meliFixture.operador.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_OUTRO_CANAL);
  cy.get('[data-cy="input-busca-sku"]').type(meliFixture.anuncioSemDimensoesPacote.sku);
  cy.get('[data-cy="btn-buscar"]').click();
  cy.contains(meliFixture.anuncioSemDimensoesPacote.sku).should('be.visible');
  cy.get('[data-cy="btn-publicar-anuncio"]').first().click();
  cy.get('[data-cy="btn-confirmar-publicacao"]').click();

  // Assert
  cy.contains(meliFixture.msgErroDimensoesPacote).should('not.exist');
});

// ---------------------------------------------------------------------------
// Tabela de Cobertura
// ---------------------------------------------------------------------------
//
// | ID    | Nome do Teste                                                                               | Status  |
// |-------|---------------------------------------------------------------------------------------------|---------|
// | F01   | test_F01_publicar_anuncio_com_dimensoes_produto_e_pacote_preenchidas                        | Gerado  |
// | N01   | test_N01_bloquear_publicacao_sem_dimensoes_do_produto                                       | Gerado  |
// | N02   | test_N02_bloquear_publicacao_sem_dimensoes_do_pacote                                        | Gerado  |
// | RG01  | test_RG01_reprocessar_anuncio_apos_preenchimento_dimensoes_faltantes                        | Gerado  |
// | A01   | test_A01_acesso_a_tela_meli_bloqueado_para_usuario_nao_autenticado                          | Gerado  |
// | RG02  | test_RG02_publicacao_outro_canal_nao_afetada_pela_validacao_de_dimensoes_meli               | Gerado  |
