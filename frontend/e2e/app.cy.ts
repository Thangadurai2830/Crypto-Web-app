/**
 * E2E: App shell, navigation, and main routes.
 * Run with: npm run e2e (ensure dev server is running on port 3000, or use cypress open).
 */
describe("App E2E", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads the app and shows layout", () => {
    cy.get("header").should("exist");
    cy.get("main").should("exist");
    cy.get("nav").should("exist");
  });

  it("navigates to Dashboard by default", () => {
    cy.url().should("include", "/");
    cy.contains(/dashboard|market|analytics/i).should("be.visible");
  });

  it("navigates to Analysis when sidebar link clicked", () => {
    cy.get("nav").contains(/analysis|market/i).click();
    cy.url().should("include", "analysis");
  });

  it("navigates to Strategy when sidebar link clicked", () => {
    cy.get("nav").contains(/strategy|backtest/i).click();
    cy.url().should("include", "strategy");
  });

  it("navigates to Settings when sidebar link clicked", () => {
    cy.get("nav").contains(/settings/i).click();
    cy.url().should("include", "settings");
  });
});
