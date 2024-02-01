import 'cypress-iframe';
import userData from '../fixtures/userData.json'
import creditCard from '../fixtures/creditCard.json'


describe('TestSuite', function(){
    //Create customer data
    const name = `user${Cypress._.random(1e5)}` 
    const email = `${name}@hh.com`


    //Before all, create the new user
    before('Sign up', function(){
        //Go to main web page
        cy.visit('/')
        cy.get('.logo-icon')
        .should('be.visible')

        //Go to Log in page
        cy.get("a[href='/account/login']").click()
        cy.get("h1[class='text-center']")
        .should('have.text', 'Login')

        //Go to Create a new account
        cy.get('.text-interactive')
        .contains('Create an account').click()
        cy.get("h1[class='text-center']")
        .should('have.text', 'Create A New Account')

        //Create a new account
        cy.get("input[placeholder='Full Name']").type(name)
        cy.get("input[placeholder='Email']").type(email)
        cy.get("input[placeholder='Password']").type(userData.password)
        cy.get("button[type='button']").click()

    })

    beforeEach('Session', function(){
        //Custom command created to log in
        cy.login(email, userData.password)

    })

    it('Sign up & Log in', function(){
        cy.visit('/')

        //Verify the email of the user logged in
        cy.get("a[href='/account']").click()
        cy.get(".account-details-email.flex.gap-1")
        .should('have.text', email)
    })



})