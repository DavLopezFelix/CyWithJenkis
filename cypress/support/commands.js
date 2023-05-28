// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) =>
{
    cy.session([email, password], () => {
    //Go to main web page
    cy.visit('/')
    
    //Go to Login page
    cy.get("a[href='/account/login']").click()
    cy.get("h1[class='text-center']")
    .should('have.text', 'Login')

    //Log in
    cy.get("input[placeholder='Email']").type(email)
    cy.get("input[placeholder='Password']").type(password)
    cy.get("button[type='submit']").click()

    //Verify the email of the user logged in
    cy.get("a[href='/account']").click()
    cy.get(".account-details-email.flex.gap-1")
    .should('have.text', email)
        
    })

})