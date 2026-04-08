// Atividade: #387229 - Anuncios referente a categoria Sala de Estar nao sobem - Mercado Livre
// Modulo: Hub (Marketplaces) > Mercado Livre > Traducoes de Categorias
// Tipo: Correcao de Bug + Regressao
// Bug: Traducao da categoria "Sala de Estar" com status "Categoria inexistente no marketplace" impedia publicacao de anuncios

import categoriaFixture from '../../fixtures/387229_mercadolivre_categoria.json';

const URL_LOGIN = Cypress.env('loginUrl') || '/hub/login';
const URL_TRADUCOES_CATEGORIAS = Cypress.env('traducaoCategoriasUrl') || '/hub/mercadolivre/traducoes-categorias';
const URL_PUBLICACAO = Cypress.env('publicacaoUrl') || '/hub/mercadolivre/anuncios';
const MSG_EXCLUSAO_SUCESSO = 'Traducao excluida com sucesso';
const MSG_PUBLICACAO_SUCESSO = 'Anuncio publicado com sucesso';

// ---------------------------------------------------------------------------
// Critério: F01
// ---------------------------------------------------------------------------
it('test_F01_publicar_anuncio_sala_de_estar_apos_correcao_da_traducao', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(categoriaFixture.operador.usuario);
  cy.get('[data-cy="input-senha"]').type(categoriaFixture.operador.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act - corrigir traducao invalida
  cy.visit(URL_TRADUCOES_CATEGORIAS);
  cy.contains(categoriaFixture.mercadoLivre.categoriaAfetada)
    .closest('[data-cy="linha-traducao"]')
    .find('[data-cy="btn-excluir-traducao"]')
    .click();
  cy.get('[data-cy="btn-confirmar-exclusao"]').click();

  // Act - publicar anuncio do SKU afetado
  cy.visit(URL_PUBLICACAO);
  cy.get('[data-cy="input-busca-sku"]').type(categoriaFixture.mercadoLivre.skuAfetado);
  cy.get('[data-cy="btn-publicar-anuncio"]').click();

  // Assert
  cy.contains(categoriaFixture.mercadoLivre.statusErro).should('not.exist');
  cy.get('[data-cy="msg-sucesso"]').should('be.visible');
  cy.contains(MSG_PUBLICACAO_SUCESSO).should('be.visible');
});

// ---------------------------------------------------------------------------
// Critério: N01
// ---------------------------------------------------------------------------
it('test_N01_verificar_status_erro_traducao_categoria_sala_de_estar', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(categoriaFixture.operador.usuario);
  cy.get('[data-cy="input-senha"]').type(categoriaFixture.operador.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_TRADUCOES_CATEGORIAS);

  // Assert
  cy.contains(categoriaFixture.mercadoLivre.categoriaAfetada)
    .closest('[data-cy="linha-traducao"]')
    .should('contain', categoriaFixture.mercadoLivre.statusErro);
  cy.contains(categoriaFixture.mercadoLivre.categoriaAfetada)
    .closest('[data-cy="linha-traducao"]')
    .find('[data-cy="btn-excluir-traducao"]')
    .should('be.visible');
});

// ---------------------------------------------------------------------------
// Critério: F02
// ---------------------------------------------------------------------------
it('test_F02_excluir_traducao_invalida_categoria_sala_de_estar', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(categoriaFixture.operador.usuario);
  cy.get('[data-cy="input-senha"]').type(categoriaFixture.operador.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_TRADUCOES_CATEGORIAS);
  cy.contains(categoriaFixture.mercadoLivre.categoriaAfetada)
    .closest('[data-cy="linha-traducao"]')
    .find('[data-cy="btn-excluir-traducao"]')
    .click();
  cy.get('[data-cy="btn-confirmar-exclusao"]').click();

  // Assert
  cy.contains(MSG_EXCLUSAO_SUCESSO).should('be.visible');
  cy.contains(categoriaFixture.mercadoLivre.categoriaAfetada)
    .closest('[data-cy="linha-traducao"]')
    .should('not.contain', categoriaFixture.mercadoLivre.statusErro);
});

// ---------------------------------------------------------------------------
// Critério: RG01
// ---------------------------------------------------------------------------
it('test_RG01_publicar_anuncio_de_outra_categoria_nao_impactada', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(categoriaFixture.operador.usuario);
  cy.get('[data-cy="input-senha"]').type(categoriaFixture.operador.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_PUBLICACAO);
  cy.get('[data-cy="filtro-categoria"]').select(categoriaFixture.mercadoLivre.categoriaRegressao);
  cy.get('[data-cy="btn-publicar-anuncio"]').first().click();

  // Assert
  cy.contains(categoriaFixture.mercadoLivre.statusErro).should('not.exist');
  cy.get('[data-cy="msg-sucesso"]').should('be.visible');
});

// ---------------------------------------------------------------------------
// Critério: A01
// ---------------------------------------------------------------------------
it('test_A01_acesso_a_traducoes_de_categorias_bloqueado_para_usuario_nao_autenticado', () => {
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();

  // Act
  cy.visit(URL_TRADUCOES_CATEGORIAS, { failOnStatusCode: false });

  // Assert
  cy.url().should('include', 'login');
  cy.get('[data-cy="btn-excluir-traducao"]').should('not.exist');
});

// ---------------------------------------------------------------------------
// Tabela de Cobertura
// ---------------------------------------------------------------------------
//
// | ID    | Nome do Teste                                                                          | Status  |
// |-------|----------------------------------------------------------------------------------------|---------|
// | F01   | test_F01_publicar_anuncio_sala_de_estar_apos_correcao_da_traducao                      | Gerado  |
// | N01   | test_N01_verificar_status_erro_traducao_categoria_sala_de_estar                        | Gerado  |
// | F02   | test_F02_excluir_traducao_invalida_categoria_sala_de_estar                             | Gerado  |
// | RG01  | test_RG01_publicar_anuncio_de_outra_categoria_nao_impactada                            | Gerado  |
// | A01   | test_A01_acesso_a_traducoes_de_categorias_bloqueado_para_usuario_nao_autenticado       | Gerado  |
