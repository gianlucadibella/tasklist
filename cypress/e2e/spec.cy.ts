describe('First test', () => {
  //To run this test you need to be logged in or at least have a your session stored on application storage
  it('Should create a task', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Login').click()
    cy.contains('+ Create').click()
    cy.contains('Title').type('E2E Test')
    cy.contains('Description').type('This description was typed using Cypress E2E testing')
    cy.contains('Create Task').click()
    cy.contains('Task successfully created!🎉')
  })
  })