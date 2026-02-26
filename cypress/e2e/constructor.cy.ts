/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запросы
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    // Устанавливаем токены
    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем конструктор после каждого теста
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.clearCookies();
  });

  it('должен открывать и закрывать модальное окно ингредиента', () => {
    cy.fixture('ingredients.json').then((ingredients) => {
      const firstIngredientName = ingredients.data[0].name;

      // Клик по первому ингредиенту
      cy.get('[data-cy=ingredient-item]').first().click();

      // Проверяем, что модалка открылась
      cy.contains('Детали ингредиента').should('be.visible');

      // Проверяем, что внутри модалки отображается название выбранного ингредиента
      cy.get('[data-cy=modal]').within(() => {
        cy.contains(firstIngredientName).should('be.visible');
      });

      // Закрываем модалку
      cy.get('[data-cy=modal] button').click();

      // Ждём исчезновения модалки
      cy.get('[data-cy=modal]').should('not.exist');

      // Проверяем, что заголовок модалки исчез (опционально)
      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  it('должен добавлять ингредиент в конструктор', () => {
    // Наводим мышь на ингредиент и кликаем кнопку "Добавить"
    cy.get('[data-cy=ingredient-item]').first().trigger('mouseover');
    cy.contains('button', 'Добавить').click();

    // Проверяем, что булка появилась в конструкторе
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
  });

  it('должен создавать заказ и очищать конструктор', () => {
    // Добавляем булку
    cy.get('[data-cy=ingredient-item]').first().trigger('mouseover');
    cy.contains('button', 'Добавить').click();

    // Добавляем начинку
    cy.get('[data-cy=ingredient-item]').eq(1).trigger('mouseover');
    cy.contains('button', 'Добавить').click();

    // Нажимаем кнопку "Оформить заказ"
    cy.contains('button', 'Оформить заказ').click();

    // Ждём ответа от сервера
    cy.wait('@postOrder', { timeout: 10000 });

    // Проверяем модалку заказа
    cy.contains('идентификатор заказа').should('be.visible');
    cy.get('[data-cy=order-number]').should('contain', '12345');

    // Закрываем модалку
    cy.get('[data-cy=modal] button').click();

    // Проверяем, что конструктор пуст
    cy.get('[data-cy=constructor-drop-area]').within(() => {
      cy.contains('Краторная булка N-200i').should('not.exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
      cy.contains('Выберите булки').should('be.visible');
    });
  });
});
