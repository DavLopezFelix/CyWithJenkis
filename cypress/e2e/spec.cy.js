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
        cy.get('.text-interactive').click()
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



    it('Buy 3 products', function(){

        cy.fixture('buyProducts.json').then((fixtureData) => {

            fixtureData.forEach((product) => {
                cy.visit('/')
                //Go to the area
                cy.get(`a.button.primary[href="${product.link}"]`).click()
                cy.get('.category-name.mt-25')
                .should('have.text', product.area)

                //Select shoes
                cy.get(`img[alt='${product.name}']`).click()
                cy.get('.product-single-name')
                .should('have.text', product.name)

                //Select units
                cy.get("input[placeholder='Qty']").clear().type(product.qty)
                .should('have.value', product.qty)

                //Select size and color
                cy.get('li.mr-05')
                .contains(`${product.size}`).click()
                cy.get('li.selected.mr-05')
                .contains(product.size)
                .should('exist')

                cy.get('li.mr-05')
                .contains(product.color).click()
                cy.get('li.selected.mr-05')
                .contains(product.color)
                .should('exist')

                //Add to cart
                cy.get("button[type='button']").click()

                //Dismiss pop-up
                cy.get('.toast-mini-cart')
                .should('be.visible')
                cy.get(".add-cart-popup-continue.text-center.underline.block").click()
                cy.get('.toast-mini-cart')
                .should('not.be.visible')

            })

        })
            
    })
    

    it('Checkout process', function(){
        cy.visit('/')

        //Go to cart
        cy.get('.mini-cart-icon').click()
        cy.get("div[class='grid grid-cols-1 gap-2'] h4")
        .should('have.text', 'Order summary')

        //Go to checkout
        cy.get("a[class='button primary']").click()
        cy.get("h4[class='mb-1 mt-3']")
        .should('have.text', 'Shipping Address')

        //Fill the shipping address
        cy.get("input[placeholder='Full name']").type(userData.name_user)
        cy.get("input[placeholder='Telephone']").type(userData.phone)
        cy.get("input[placeholder='Address']").type(userData.address)
        cy.get("input[placeholder='City']").type(userData.zone)
        cy.get('.form-field[placeholder="Country"]').select(userData.country)
        cy.get('.form-field[placeholder="Province"]').select(userData.City)
        cy.get("input[placeholder='Postcode']").type(userData.cPostal)
        cy.wait(2000)

        cy.get("#method1")
        .check({force:true})

        //Submit and verifiying the new page
        cy.get("button[type='button']").click()
        cy.get('h4.mb-1.mt-3')
        .should('contain.text', 'Payment Method')
        cy.wait(2000)
        
        //Select the card payment option
        cy.get('.feather.feather-circle').click()

        //Verify the new input for card information
        cy.get('.stripe-form')
        .should('be.visible')

        cy.get('iframe').then(iframes => {
            iframes.each((index, iframe) => {

                if(index == 0){
                    cy.get(iframe).as('myFrame')

                    //Fill the payment information
                    cy.iframe('@myFrame')
                    .find('input[name="cardnumber"]')
                    .type(creditCard.number)

                    cy.iframe('@myFrame')
                    .find('input[name="exp-date"]')
                    .type(creditCard.expDate)

                    cy.iframe('@myFrame')
                    .find('input[name="cvc"]')
                    .type(creditCard.cvc)
                }

            });
        });
        
        //Place and verify the order
        cy.get("button[class='button primary']").click()
        cy.get('.checkout-success-customer-info')
        .should('include.text', `Thank you ${name}!`)

        cy.url().as('checkout')

    })

    it('Check the customer information', function(){
        cy.visit(this.checkout)

        cy.get('.customer-info.mt-3.mb-2')
        .should('be.visible')

        //Verify Contact information
        cy.get('.grid.grid-cols-2.gap-3')
        .find('div.mb-2')
        .eq(0)
        .should('include.text', email)

        //Verifiy Payment method
        cy.get('.grid.grid-cols-2.gap-3')
        .find('div.mb-2')
        .eq(1)
        .should('include.text', 'Credit Card')

        //Verify Shipping Address
        cy.get('.grid.grid-cols-2.gap-3')
        .find('div.address-summary')
        .eq(0).as('ship_details1')
        .find('.full-name')
        .should('have.text', userData.name_user)

        cy.get('@ship_details1')
        .find('.address-one')
        .should('have.text', userData.address)

        cy.get('@ship_details1')
        .find('.city-province-postcode')
        .should('include.text', `${userData.cPostal}, ${userData.zone}`)
        .and('include.text', `${userData.City}, ${userData.country}`)

        cy.get('@ship_details1')
        .find('.telephone')
        .should('have.text', userData.phone)

        //Verify Billing Address
        cy.get('.grid.grid-cols-2.gap-3')
        .find('div.address-summary')
        .eq(1).as('ship_details2')
        .find('.full-name')
        .should('have.text', userData.name_user)

        cy.get('@ship_details2')
        .find('.address-one')
        .should('have.text', userData.address)

        cy.get('@ship_details2')
        .find('.city-province-postcode')
        .should('include.text', `${userData.cPostal}, ${userData.zone}`)
        .and('include.text', `${userData.City}, ${userData.country}`)

        cy.get('@ship_details2')
        .find('.telephone')
        .should('have.text', userData.phone)
    
    })

    it('Check the items', function(){
        cy.visit(this.checkout)

        cy.get('.listing.items-table tbody tr')
        .each(($elem, index, lis) => {
            const find_product = $elem.text()

            cy.fixture('buyProducts.json').then((fixtureData) => {

                fixtureData.forEach((product) => {

                    if(find_product.includes(product.name)){
                        //Check product's name
                        cy.get('.product-column').eq(index)
                        .find('.font-semibold')
                        .should('include.text', product.name)
        
                        //Check size and color
                        cy.get('.product-column .mt-05 ul').eq(index)
                        .find('li')
                        .should('contain.text', `Size: ${product.size}`)
                        .and('contain.text', `Color: ${product.color}`)
        
                        //Check quantity
                        cy.get('.product-thumbnail').eq(index)
                        .should('contain.text', product.qty)

                        return false
                    }
                })
            })



        })
    })


})