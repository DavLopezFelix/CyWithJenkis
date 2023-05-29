import 'cypress-iframe';


describe('TestSuite', function(){
    //Create customer data
    const name = `user${Cypress._.random(1e5)}` 
    const email = `${name}@hh.com`
    const password = "123456"

    const shipping = ['abcde efgh', '123-456 -678',
    "Av. adbc 123 def", "qwer",
    'China', 'Anhui', 14563]

    const products = [
                    ["Continental 80 shoes", "XL", "White", 1],
                    ["Renew cotton chuck taylor all star", "L", "Green", 3],
                    ["Swift run x shoes", "S", "Red", 4]
                    ]

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
        cy.get("input[placeholder='Password']").type(password)
        cy.get("button[type='button']").click()

    })

    beforeEach('Session', function(){
        //Custom command created to log in
        cy.login(email, password)

    })

    it('Sign up & Log in', function(){
        cy.visit('/')

        //Verify the email of the user logged in
        cy.get("a[href='/account']").click()
        cy.get(".account-details-email.flex.gap-1")
        .should('have.text', email)
    })


    it('Buy product1', function(){   
        cy.visit('/')
        
        //Go to Kids area
        cy.get('a.button.primary[href="/category/kids"]').click()
        cy.get('.category-name.mt-25')
        .should('have.text', 'Kids')

        //Select shoes
        cy.get(`img[alt='${products[0][0]}']`).click()
        cy.get('.product-single-name')
        .should('have.text', `${products[0][0]}`)

        //Select size and color
        cy.get('li.mr-05')
        .contains(`${products[0][1]}`).click()
        cy.get('li.selected.mr-05')
        .contains(`${products[0][1]}`)
        .should('exist')

        cy.get('li.mr-05')
        .contains(`${products[0][2]}`).click()
        cy.get('li.selected.mr-05')
        .contains(`${products[0][2]}`)
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

    it('Buy product2', function(){
        cy.visit('/')

        //Go to Women area
        cy.get('a.button.primary[href="/category/women"]').click()
        cy.get('.category-name.mt-25')
        .should('have.text', 'Women')

        //Select shoes
        cy.get(`img[alt='${products[1][0]}']`).click()
        cy.get('.product-single-name')
        .should('have.text', `${products[1][0]}`)

        //Select 3 units
        cy.get("input[placeholder='Qty']").clear().type(`${products[1][3]}`)
        .should('have.value', `${products[1][3]}`)

        //Select size and color
        cy.get('li.mr-05')
        .contains(`${products[1][1]}`).click()
        cy.get('li.selected.mr-05')
        .contains(`${products[1][1]}`)
        .should('exist')

        cy.get('li.mr-05')
        .contains(`${products[1][2]}`).click()
        cy.get('li.selected.mr-05')
        .contains(`${products[1][2]}`)
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

    it('Buy product3', function(){
        cy.visit('/')

        //Go to Men area
        cy.get('a.button.primary[href="/category/men"]').click()
        cy.get('.category-name.mt-25')
        .should('have.text', 'Men')

        //Select shoes
        cy.get(`img[alt='${products[2][0]}']`).click()
        cy.get('.product-single-name')
        .should('have.text', `${products[2][0]}`)

        //Select 4 units
        cy.get("input[placeholder='Qty']").clear().type(`${products[2][3]}`)

        //Select size and color
        cy.get('.mr-05')
        .contains(`${products[2][1]}`).click()
        cy.get('.selected.mr-05')
        .contains(`${products[2][1]}`)
        .should('exist')

        cy.get('.mr-05')
        .contains(`${products[2][2]}`).click()
        cy.get('.selected.mr-05')
        .contains(`${products[2][2]}`)
        .should('exist')
        
        //Verify the picture is for the selected color
        cy.get('#product-current-image')
        .find('img')
        .invoke('attr', 'src')
        .should('contain', 'Red')

        //Add to the cart
        cy.get("button[type='button']").click()

        //Dismiss the pop-up
        cy.get('.toast-mini-cart')
        .should('be.visible')
        cy.get(".add-cart-popup-continue.text-center.underline.block").click()
        cy.get('.toast-mini-cart')
        .should('not.be.visible')

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
        cy.get("input[placeholder='Full name']").type(shipping[0])
        cy.get("input[placeholder='Telephone']").type(shipping[1])
        cy.get("input[placeholder='Address']").type(shipping[2])
        cy.get("input[placeholder='City']").type(shipping[3])
        cy.get('.form-field[placeholder="Country"]').select(shipping[4])
        cy.get('.form-field[placeholder="Province"]').select(shipping[5])
        cy.get("input[placeholder='Postcode']").type(shipping[6])
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
                    .type('4242 4242 4242 4242')

                    cy.iframe('@myFrame')
                    .find('input[name="exp-date"]')
                    .type('0424')

                    cy.iframe('@myFrame')
                    .find('input[name="cvc"]')
                    .type('242')
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
        .should('have.text', shipping[0])

        cy.get('@ship_details1')
        .find('.address-one')
        .should('have.text', shipping[2])

        cy.get('@ship_details1')
        .find('.city-province-postcode')
        .should('include.text', `${shipping[6]}, ${shipping[3]}`)
        .and('include.text', `${shipping[5]}, ${shipping[4]}`)

        cy.get('@ship_details1')
        .find('.telephone')
        .should('have.text', shipping[1])

        //Verify Billing Address
        cy.get('.grid.grid-cols-2.gap-3')
        .find('div.address-summary')
        .eq(1).as('ship_details2')
        .find('.full-name')
        .should('have.text', shipping[0])

        cy.get('@ship_details2')
        .find('.address-one')
        .should('have.text', shipping[2])

        cy.get('@ship_details2')
        .find('.city-province-postcode')
        .should('include.text', `${shipping[6]}, ${shipping[3]}`)
        .and('include.text', `${shipping[5]}, ${shipping[4]}`)

        cy.get('@ship_details2')
        .find('.telephone')
        .should('have.text', shipping[1])
    
    })

    it('Check the items', function(){
        cy.visit(this.checkout)

        cy.get('.listing.items-table tbody tr')
        .each(($elem, index, lis) => {
            const find_product = $elem.text()

            if(find_product.includes(`${products[0][0]}`)){
                //Check product's name
                cy.get('.product-column').eq(index)
                .find('.font-semibold')
                .should('include.text', `${products[0][0]}`)

                //Check size and color
                cy.get('.product-column .mt-05 ul').eq(index)
                .find('li')
                .should('contain.text', `Size: ${products[0][1]}`)
                .and('contain.text', `Color: ${products[0][2]}`)

                //Check quantity
                cy.get('.product-thumbnail').eq(index)
                .should('contain.text', `${products[0][3]}`)
            }

            if(find_product.includes(`${products[1][0]}`)){
                //Check product's name
                cy.get('.product-column').eq(index)
                .find('.font-semibold')
                .should('include.text', `${products[1][0]}`)

                //Check size and color
                cy.get('.product-column .mt-05 ul').eq(index)
                .find('li')
                .should('contain.text', `Size: ${products[1][1]}`)
                .and('contain.text', `Color: ${products[1][2]}`)

                //Check quantity
                cy.get('.product-thumbnail').eq(index)
                .should('contain.text',`${products[1][3]}` )
            }

            if(find_product.includes(`${products[2][0]}`)){
                //Check product's name
                cy.get('.product-column').eq(index)
                .find('.font-semibold')
                .should('include.text', `${products[2][0]}`)

                //Check size and color
                cy.get('.product-column .mt-05 ul').eq(index)
                .find('li')
                .should('contain.text', `Size: ${products[2][1]}`)
                .and('contain.text', `Color: ${products[2][2]}`)

                //Check quantity
                cy.get('.product-thumbnail').eq(index)
                .should('contain.text', `${products[2][3]}`)
            }

        })


    })

})