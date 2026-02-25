/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запрос ингредиентов и возвращаем мок
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    // Перехватываем запрос пользователя (авторизация)
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    // Перехватываем запрос создания заказа
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    // Устанавливаем токены (имитация авторизации)
    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен открывать и закрывать модальное окно ингредиента', () => {
    // Клик по первому ингредиенту
    cy.get('[data-cy=ingredient-item]').first().click();
    // Проверяем, что модалка с деталями открылась
    cy.contains('Детали ингредиента').should('be.visible');
    // Закрываем по крестику (ищем кнопку с иконкой закрытия внутри модалки)
    cy.get('[data-cy=modal] button').click();
    // Проверяем, что модалка закрылась
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('должен добавлять ингредиент в конструктор', () => {
    // Наводим мышь на ингредиент и кликаем кнопку "Добавить"
    cy.get('[data-cy=ingredient-item]').first().trigger('mouseover');
    cy.contains('button', 'Добавить').click();
    // Проверяем, что булка появилась в конструкторе (ищем по тексту)
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
  });

  it('должен создавать заказ и очищать конструктор', () => {
    // Добавляем булку через кнопку "Добавить"
    cy.get('[data-cy=ingredient-item]').first().trigger('mouseover');
    cy.contains('button', 'Добавить').click();

    // Добавляем начинку (второй ингредиент)
    cy.get('[data-cy=ingredient-item]').eq(1).trigger('mouseover');
    cy.contains('button', 'Добавить').click();

    // Нажимаем кнопку "Оформить заказ"
    cy.contains('button', 'Оформить заказ').click();

    // Ждём ответа от сервера
    cy.wait('@postOrder', { timeout: 10000 });

    // Проверяем, что модальное окно с номером заказа открылось
    cy.contains('идентификатор заказа').should('be.visible');
    cy.get('[data-cy=order-number]').should('contain', '12345');

    // Закрываем модалку
    cy.get('[data-cy=modal] button').click();

    // Ждём немного, чтобы модалка закрылась и конструктор обновился
    cy.wait(500);

    // Проверяем, что конструктор пуст (нет ингредиентов)
    // Используем более точные селекторы
    cy.get('[data-cy=constructor-drop-area]').within(() => {
      cy.contains('Краторная булка N-200i').should('not.exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
      // Проверяем, что отображается сообщение о выборе булки
      cy.contains('Выберите булки').should('be.visible');
    });
  });
});
