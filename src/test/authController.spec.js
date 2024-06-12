// cypress/integration/api.spec.js

describe("API Tests", () => {
  beforeEach(() => {
    // Set up test environment variables
    Cypress.env("phoneNumber", "+1234567890");
    Cypress.env("token", "your-test-token");
    Cypress.env("baseURL", "https://api.afromessage.com");
    Cypress.env("callback", "http://localhost:4000/api/v1/otp/sendOtp");
    Cypress.env("sender", "Dozer");
  });

  it("should send security code successfully", () => {
    cy.fixture("otpResponse.json").as("otpResponse");

    cy.visit("/"); // Adjust this URL to match your application's base URL

    cy.get("@otpResponse").then((otpResponse) => {
      cy.axios.get.resolves({ data: otpResponse });

      cy.request("POST", "/api/v1/otp/sendSecurityCode")
        .its("status")
        .should("eq", 200);

      cy.get("@axiosGet").should("be.calledWith", {
        url: `${Cypress.env("baseURL")}/api/challenge`,
        headers: { Authorization: `Bearer ${Cypress.env("token")}` },
      });
    });
  });

  it("should verify security code successfully", () => {
    cy.fixture("verifyResponse.json").as("verifyResponse");

    cy.visit("/"); // Adjust this URL to match your application's base URL

    cy.get("@verifyResponse").then((verifyResponse) => {
      cy.axios.get.resolves({ data: verifyResponse });

      cy.request("POST", "/api/v1/otp/verifySecurityCode", {
        code: "123456", // Adjust this code to match the verification code
        phoneNumber: Cypress.env("phoneNumber"),
      })
        .its("status")
        .should("eq", 200);

      cy.get("@axiosGet").should("be.calledWith", {
        url: `${Cypress.env("baseURL")}/api/verify`,
        headers: { Authorization: `Bearer ${Cypress.env("token")}` },
      });
    });
  });
});
