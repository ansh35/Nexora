export interface BillingProvider {
  /**
   * Initializes a checkout session or returns the URL to redirect the user to.
   */
  checkout(organizationId: string, planId: string): Promise<string>;

  /**
   * Initializes a customer portal session to manage billing, returning the URL.
   */
  portal(organizationId: string): Promise<string>;

  /**
   * Upgrades a plan immediately.
   */
  upgrade(organizationId: string, planId: string): Promise<void>;

  /**
   * Downgrades a plan immediately.
   */
  downgrade(organizationId: string, planId: string): Promise<void>;
}
