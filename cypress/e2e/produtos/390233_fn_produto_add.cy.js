// Atividade: #390233 - Erro ao confirmar novo cadastro
// Modulo: Portal do Fornecedor > Produtos > Meus Produtos > Novo Produto (fn_produto_add)
// Tipo: Correcao de Bug + Regressao
// Bug: Colisao de name="referencia" entre aba Geral e aba Volumes causava erro enganoso

import produtoFixture from '../../fixtures/390233_produto.json';

const URL_LOGIN = Cypress.env('loginUrl') || '/portal/login';
const URL_NOVO_PRODUTO = Cypress.env('novoProdutoUrl') || '/portal/fornecedor/produtos/novo';
const URL_MEUS_PRODUTOS = Cypress.env('meusProdutosUrl') || '/portal/fornecedor/produtos';
const MSG_REFERENCIA_BASE_OBRIGATORIA = 'O campo Referência Base é de preenchimento obrigatório';

// ---------------------------------------------------------------------------
// Critério: F01
// ---------------------------------------------------------------------------
it('test_F01_salvar_produto_com_todos_campos_obrigatorios_preenchidos', () => {
  // Critério: F01
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(produtoFixture.fornecedor.usuario);
  cy.get('[data-cy="input-senha"]').type(produtoFixture.fornecedor.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_NOVO_PRODUTO);
  cy.get('[data-cy="aba-geral"]').click();
  cy.get('[name="referencia"]').type(produtoFixture.produto.referenciaBase);
  cy.get('[data-cy="input-descricao"]').type(produtoFixture.produto.descricao);
  cy.get('[data-cy="input-unidade"]').select(produtoFixture.produto.unidade);

  cy.get('[data-cy="aba-volumes"]').click();
  cy.get('[name="referenciaVolume"]').type(produtoFixture.produto.referenciaVolume);
  cy.get('[data-cy="input-volume-descricao"]').type(produtoFixture.produto.volumeDescricao);

  cy.get('[data-cy="btn-confirmar"]').click();

  // Assert
  cy.contains(MSG_REFERENCIA_BASE_OBRIGATORIA).should('not.exist');
  cy.get('[data-cy="msg-sucesso"]').should('be.visible');
});

// ---------------------------------------------------------------------------
// Critério: N01
// ---------------------------------------------------------------------------
it('test_N01_exibir_erro_correto_ao_deixar_referencia_base_em_branco', () => {
  // Critério: N01
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(produtoFixture.fornecedor.usuario);
  cy.get('[data-cy="input-senha"]').type(produtoFixture.fornecedor.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_NOVO_PRODUTO);
  cy.get('[data-cy="aba-geral"]').click();
  cy.get('[name="referencia"]').clear();
  cy.get('[data-cy="input-descricao"]').type(produtoFixture.produto.descricao);
  cy.get('[data-cy="input-unidade"]').select(produtoFixture.produto.unidade);

  cy.get('[data-cy="aba-volumes"]').click();
  cy.get('[name="referenciaVolume"]').type(produtoFixture.produto.referenciaVolume);
  cy.get('[data-cy="input-volume-descricao"]').type(produtoFixture.produto.volumeDescricao);

  cy.get('[data-cy="btn-confirmar"]').click();

  // Assert
  cy.contains(MSG_REFERENCIA_BASE_OBRIGATORIA).should('be.visible');
  cy.url().should('include', 'novo');
});

// ---------------------------------------------------------------------------
// Critério: RG01
// ---------------------------------------------------------------------------
it('test_RG01_validacao_do_campo_volume_referencia_nao_contamina_referencia_base', () => {
  // Critério: RG01
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(produtoFixture.fornecedor.usuario);
  cy.get('[data-cy="input-senha"]').type(produtoFixture.fornecedor.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_NOVO_PRODUTO);
  cy.get('[data-cy="aba-geral"]').click();
  cy.get('[name="referencia"]').type(produtoFixture.produto.referenciaBaseReg);
  cy.get('[data-cy="input-descricao"]').type(produtoFixture.produto.descricao);
  cy.get('[data-cy="input-unidade"]').select(produtoFixture.produto.unidade);

  cy.get('[data-cy="aba-volumes"]').click();
  cy.get('[name="referenciaVolume"]').clear();
  cy.get('[data-cy="input-volume-descricao"]').type(produtoFixture.produto.volumeDescricao);

  cy.get('[data-cy="btn-confirmar"]').click();

  // Assert
  cy.contains(MSG_REFERENCIA_BASE_OBRIGATORIA).should('not.exist');
  cy.get('[name="referenciaVolume"]').should('exist');
});

// ---------------------------------------------------------------------------
// Critério: A01
// ---------------------------------------------------------------------------
it('test_A01_acesso_a_tela_de_cadastro_bloqueado_para_usuario_nao_autenticado', () => {
  // Critério: A01
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();

  // Act
  cy.visit(URL_NOVO_PRODUTO, { failOnStatusCode: false });

  // Assert
  cy.url().should('include', 'login');
  cy.get('[data-cy="btn-confirmar"]').should('not.exist');
});

// ---------------------------------------------------------------------------
// Critério: I01
// ---------------------------------------------------------------------------
it('test_I01_campos_referencia_base_e_referencia_volume_persistidos_de_forma_independente', () => {
  // Critério: I01
  // Arrange
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(URL_LOGIN);
  cy.get('[data-cy="input-usuario"]').type(produtoFixture.fornecedor.usuario);
  cy.get('[data-cy="input-senha"]').type(produtoFixture.fornecedor.senha);
  cy.get('[data-cy="btn-entrar"]').click();
  cy.url().should('not.include', '/login');

  // Act
  cy.visit(URL_NOVO_PRODUTO);
  cy.get('[data-cy="aba-geral"]').click();
  cy.get('[name="referencia"]').type(produtoFixture.produto.referenciaBaseInteg);
  cy.get('[data-cy="input-descricao"]').type(produtoFixture.produto.descricao);
  cy.get('[data-cy="input-unidade"]').select(produtoFixture.produto.unidade);

  cy.get('[data-cy="aba-volumes"]').click();
  cy.get('[name="referenciaVolume"]').type(produtoFixture.produto.referenciaVolumeInteg);
  cy.get('[data-cy="input-volume-descricao"]').type(produtoFixture.produto.volumeDescricao);

  cy.get('[data-cy="btn-confirmar"]').click();
  cy.get('[data-cy="msg-sucesso"]').should('be.visible');

  cy.visit(URL_MEUS_PRODUTOS);
  cy.contains(produtoFixture.produto.referenciaBaseInteg).click();

  // Assert
  cy.get('[data-cy="aba-geral"]').click();
  cy.get('[name="referencia"]').should('have.value', produtoFixture.produto.referenciaBaseInteg);

  cy.get('[data-cy="aba-volumes"]').click();
  cy.get('[name="referenciaVolume"]').should('have.value', produtoFixture.produto.referenciaVolumeInteg);
});

// ---------------------------------------------------------------------------
// Tabela de Cobertura
// ---------------------------------------------------------------------------
//
// | ID    | Nome do Teste                                                                          | Status  |
// |-------|----------------------------------------------------------------------------------------|---------|
// | F01   | test_F01_salvar_produto_com_todos_campos_obrigatorios_preenchidos                       | Gerado  |
// | N01   | test_N01_exibir_erro_correto_ao_deixar_referencia_base_em_branco                       | Gerado  |
// | RG01  | test_RG01_validacao_do_campo_volume_referencia_nao_contamina_referencia_base            | Gerado  |
// | A01   | test_A01_acesso_a_tela_de_cadastro_bloqueado_para_usuario_nao_autenticado               | Gerado  |
// | I01   | test_I01_campos_referencia_base_e_referencia_volume_persistidos_de_forma_independente   | Gerado  |
