import {
  clickGoaWorkSideNotificationItem,
  closeGoaWorkSideNotificationPanel,
  getGoaWorkSideNotificationItem,
  getGoaWorkSideNotificationPanel,
  markAllReadGoaWorkSideNotificationPanel,
  selectGoaWorkSideNotificationPanel,
  viewAllGoaWorkSideNotificationPanel,
} from "../src/components/goa-work-side-notification-panel";
import { visitFixturePage } from "./fixture-page";

describe("goa-work-side-notification-panel", () => {
  beforeEach(() => visitFixturePage("display"));

  it("locates the panel and its items", () => {
    getGoaWorkSideNotificationPanel("Notifications").find("goa-work-side-notification-item").should("have.length", 3);
    getGoaWorkSideNotificationItem("Case 1001 reassigned")
      .should("have.attr", "readstatus", "unread")
      .and("have.attr", "priority", "urgent");
  });

  it("selectGoaWorkSideNotificationPanel switches the tab", () => {
    const selectedTab = () =>
      getGoaWorkSideNotificationPanel("Notifications").shadow().find("goa-tabs").shadow().find('[role="tab"][aria-selected="true"]');
    selectedTab().should("have.attr", "data-text", "Unread");
    selectGoaWorkSideNotificationPanel("Notifications", "All");
    selectedTab().should("have.attr", "data-text", "All");
    selectGoaWorkSideNotificationPanel("Notifications", "Urgent");
    selectedTab().should("have.attr", "data-text", "Urgent");
  });

  it("clickGoaWorkSideNotificationItem fires _click on the item", () => {
    clickGoaWorkSideNotificationItem("Document received");
    cy.get('[data-testid="events"]').should("contain.text", "n2:_click");
  });

  it("the footer links fire _viewAll and _markAllRead, the close icon asks the popover to close", () => {
    viewAllGoaWorkSideNotificationPanel("Notifications");
    cy.get('[data-testid="events"]').should("contain.text", "panel:_viewAll");
    markAllReadGoaWorkSideNotificationPanel("Notifications");
    cy.get('[data-testid="events"]').should("contain.text", "panel:_markAllRead");
    closeGoaWorkSideNotificationPanel("Notifications");
    cy.get('[data-testid="events"]').should("contain.text", "panel:goa:work-side-notification-panel:closePopover");
  });
});
