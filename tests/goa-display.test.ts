import { getGoaBadge } from "../src/components/goa-badge";
import { getGoaCallout } from "../src/components/goa-callout";
import { getGoaCircularProgress, getGoaLinearProgress } from "../src/components/goa-progress";
import { getGoaTooltip, hideGoaTooltip, showGoaTooltip } from "../src/components/goa-tooltip";
import { visitFixturePage } from "./fixture-page";

describe("display components", () => {
  beforeEach(() => visitFixturePage("display"));

  it("getGoaCallout matches the heading and exposes type and body", () => {
    getGoaCallout("Important callout").should("have.attr", "type", "important").and("contain.text", "Callout body text");
    getGoaCallout({ text: /callout/i }).should("have.length", 1);
  });

  it("getGoaBadge matches the content", () => {
    getGoaBadge("Approved").should("have.attr", "type", "success");
    getGoaBadge("12").should("have.attr", "arialabel", "12 unread");
    getGoaBadge().should("have.length", 2);
  });

  it("progress locators expose the value and the message", () => {
    getGoaLinearProgress().should("have.attr", "aria-valuenow", "40");
    getGoaCircularProgress("Loading files").should("have.attr", "visible", "true").and("have.attr", "progress", "60");
  });

  it("showGoaTooltip and hideGoaTooltip toggle the tooltip", () => {
    getGoaTooltip("Helpful tip").should("have.attr", "aria-hidden", "true");
    showGoaTooltip("Helpful tip");
    getGoaTooltip("Helpful tip").should("have.attr", "aria-hidden", "false").and("have.text", "Helpful tip");
    hideGoaTooltip("Helpful tip");
    getGoaTooltip("Helpful tip").should("have.attr", "aria-hidden", "true");
  });
});
