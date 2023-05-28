import 'cypress-iframe';


describe('TestSuite', function(){
  //Create random customer data
  const name = `user${Cypress._.random(1e5)}` 
  const email = `${name}@hh.com`
  const password = "123456"

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
      cy.login(email, password)

  })

  it('Log in', function(){
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
      cy.get("img[alt='Continental 80 shoes']").click()
      cy.get('.product-single-name')
      .should('have.text', 'Continental 80 shoes')

      //Select size and color
      cy.get('li.mr-05')
      .contains('XL').click()
      cy.get('li.selected.mr-05')
      .contains('XL')
      .should('exist')

      cy.get('li.mr-05')
      .contains('White').click()
      cy.get('li.selected.mr-05')
      .contains('White')
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
      cy.get("img[alt='Lite racer adapt 3.0 shoes']").click()
      cy.get('.product-single-name')
      .should('have.text', 'Lite racer adapt 3.0 shoes')

      //Select 3 units
      cy.get("input[placeholder='Qty']").clear().type(3)
      .should('have.value', 3)

      //Select size and color
      cy.get('li.mr-05')
      .contains('L').click()
      cy.get('li.selected.mr-05')
      .contains('L')
      .should('exist')

      cy.get('li.mr-05')
      .contains('Black').click()
      cy.get('li.selected.mr-05')
      .contains('Black')
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
      cy.get("img[alt='Swift run x shoes']").click()
      cy.get('.product-single-name')
      .should('have.text', 'Swift run x shoes')

      //Select 4 units
      cy.get("input[placeholder='Qty']").clear().type(4)

      //Select size and color
      cy.get('.mr-05')
      .contains('S').click()
      cy.get('.selected.mr-05')
      .contains('S')
      .should('exist')

      cy.get('.mr-05')
      .contains('Red').click()
      cy.get('.selected.mr-05')
      .contains('Red')
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

  it('Checkout', function(){
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
      cy.get("input[placeholder='Full name']").type('abcde')
      cy.get("input[placeholder='Telephone']").type("123456")
      cy.get("input[placeholder='Address']").type("adbc 123 def")
      cy.get("input[placeholder='City']").type("qwer")
      cy.get('.form-field[placeholder="Country"]').select("China")
      cy.get('.form-field[placeholder="Province"]').select("Anhui")
      cy.get("input[placeholder='Postcode']").type(14563)
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


  })
})