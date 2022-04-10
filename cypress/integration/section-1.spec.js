const { ListFormat } = require('typescript')
const { Section1 }   = require('../objects/section-1')

describe('Problem 1', () => {
  /**
   * Example                                          : 
   * To access assertSampleApiResponse() from Section1, you can do: Section1.actions.assertSampleApiResponse();
   *
   * Test away!
   */
  /* Assumtion - I have considered 'Section 1 - Problem steps' as one test case (to potentially achieve something further) as it was mentioned steps for it in GitHub. 
  However, each of the below validations can easily be converted into single test cases as required by using "it" */

  let ages = []

  it('Visit AlayaCare Section 1', () => {
    cy.visit('http://localhost:50689/section-1')
    /*  Test Step 1 -  Check if table is not visible */
    cy.get('table#alaya-table').should('not.be.visible')

    /*  Test Step 2 - Check if 'Show table' button is visible and if yes, click on it */
    cy.get('button#table-toggle-button').then((val) => {
      if (val) {
        cy.get('button#table-toggle-button').should('be.visible').contains('Show table').click()

        /*  Test Step 2 Validation - Check if table is  visible once the show table button is clicked */
        cy.get('table#alaya-table').should('be.visible')

        /*  Test Step 3 - Check if table has 5 columns */
        cy.get('.table-header').find('th').should('have.length', 5)

        /*  Test Step 4 - Check if table has 10 rows excluding the header row */
        cy.get('table#alaya-table').find('tr').should('have.length', 11)

        /*  Test Step 5 Assert that at least 5 entries have the role "user" */
        cy.get('table#alaya-table > tbody > tr').then($el => {
          cy.wrap($el).find(Cypress.$('th:contains("user")'))
            .its('length').should('be.greaterThan', 5)
        })

       /*  Test Step 6 - Assert there are exactly 3 people older than 60 years old 
       Please note that this test step will fail as there are no three people with exactly 60 years old. 
       For positive test case - try age 27 as there are exactly 2 occurences
       For instance positive test case - expect(ages.filter(x => x === 27).length).eq(2)) - Test Step will pass
       Ideally for the test step as mentioned in the problem statement will fail - expect(ages.filter(x => x === 60).length).eq(3))
       */
        function getAge(dateString) {
          var today     = new Date();
          var birthDate = new Date(dateString);
          var age       = today.getFullYear() - birthDate.getFullYear();
          var m         = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        }

        cy.get('table#alaya-table > tbody > tr').find(Cypress.$('th:nth-child(4)'))
          .each(($el, $index) => {
            cy.wrap($el)
              .invoke('text')
              .then(text => {
                if ($index !== 0) {
                  const dayjs      = require('dayjs');
                  const actualDate = dayjs(text, 'MM/DD/YYYY').toDate().toDateString();
                  ages.push(getAge(actualDate))
                }
              })
          })
          .then(() => expect(ages.filter(x => x === 27).length).eq(2))
      }
    })
  })
})
