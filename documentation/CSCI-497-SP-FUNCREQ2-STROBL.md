# Cybersecurity Final Year Project Functional Requirements

**Student Name:** Charlotte Strobl  
**Degree and Major:** Bachelors in Cybersecurity  
**Project Advisor:** Professor Henderson  
**Expected Graduation Date:** August 2025  

---

## Functionality

### 1.1 - Display Host Disk Information  
- **Priority:** High  
- **Description:** Display total size, space remaining, and disk health.  
- **Rationale:** Essential system health monitoring.  
- **Fit Criterion:** Show total disk size, remaining space, and health status.

### 1.2 - Display Operating System and Version  
- **Priority:** High  
- **Description:** Display OS and version.  
- **Rationale:** Inform users about system environment.  
- **Fit Criterion:** OS name and version shown on dashboard.

### 1.3 - Display System Name and IP Address  
- **Priority:** High  
- **Description:** Display system name and IP address.  
- **Rationale:** Aid device identification in network.  
- **Fit Criterion:** Show name and IP in system info section.

### 1.4 - Display Last Boot Time  
- **Priority:** Medium  
- **Description:** Show last boot time.  
- **Rationale:** Indicates uptime and system performance.  
- **Fit Criterion:** Accurate time on dashboard.

### 2.1 - Port Scanning Identification  
- **Priority:** High  
- **Description:** Identify open/closed ports.  
- **Rationale:** Diagnose vulnerabilities.  
- **Fit Criterion:** List and display port status.

### 2.2 - Port Scanning Visual Representation  
- **Priority:** High  
- **Dependency:** 2.1  
- **Description:** Grid format visual of port status.  
- **Rationale:** Easier result comprehension.  
- **Fit Criterion:** Visual grid with indicators.

### 2.3 - Port Information on Click  
- **Priority:** Medium  
- **Dependency:** 2.2  
- **Description:** Click port for routing info.  
- **Rationale:** Clarify network paths.  
- **Fit Criterion:** Show details in side panel.

### 3.1 - Network Discovery Identification  
- **Priority:** High  
- **Description:** Identify active IPs.  
- **Rationale:** Network awareness and troubleshooting.  
- **Fit Criterion:** Display active IPs.

### 3.2 - Host Name Display  
- **Priority:** Medium  
- **Dependency:** 3.1  
- **Description:** Display hostnames if available.  
- **Rationale:** Easier device recognition.  
- **Fit Criterion:** Hostname next to IP.

### 4.1 - Side Navigation Panel  
- **Priority:** High  
- **Description:** Persistent side navigation.  
- **Rationale:** Improves usability.  
- **Fit Criterion:** Always visible, links to features.

### 4.2 - Display Sections for Each Feature  
- **Priority:** High  
- **Description:** Organized dashboard sections.  
- **Rationale:** Quicker access to info.  
- **Fit Criterion:** Distinct dashboard areas.

---

## Look and Feel

### 5.1 - Minimalistic Dark Theme  
- **Priority:** High  
- **Description:** Dark, clutter-free design.  
- **Rationale:** Focus and eye comfort.  
- **Fit Criterion:** Clean layout with dark theme.

---

## Usability

### 6.1 - Seamless Navigation  
- **Priority:** High  
- **Dependency:** 4.1  
- **Description:** Quick switching between features.  
- **Rationale:** Better user experience.  
- **Fit Criterion:** One-click transitions.

### 6.2 - Descriptive Explanations  
- **Priority:** Medium  
- **Description:** Clear feature purposes.  
- **Rationale:** Help for non-experts.  
- **Fit Criterion:** Explanation section per feature.

### 6.3 - User-Friendly for All  
- **Priority:** High  
- **Description:** Novice and expert friendly.  
- **Rationale:** Wider usability.  
- **Fit Criterion:** Basic and advanced users benefit.

---

## Performance

### 7.1 - Speed and Latency  
- **Priority:** High  
- **Description:** Fast task execution.  
- **Rationale:** Avoid user frustration.  
- **Fit Criterion:** Tasks complete in <6 mins for 255 IPs.

---

## Safety-Critical

### 8.1 - Non-Invasive Commands  
- **Priority:** High  
- **Description:** Safe PowerShell commands only.  
- **Rationale:** Prevent system harm.  
- **Fit Criterion:** Use only harmless commands.

---

## Reliability and Availability

### 9.1 - Always Available  
- **Priority:** High  
- **Description:** Work offline, anytime.  
- **Rationale:** Continuous access.  
- **Fit Criterion:** No internet dependency.

### 9.2 - No Downtime  
- **Priority:** High  
- **Description:** No required maintenance.  
- **Rationale:** Ensure availability.  
- **Fit Criterion:** Zero interruptions.

### 9.3 - Low Maintenance  
- **Priority:** Medium  
- **Description:** Minimal updates needed.  
- **Rationale:** Long-term usability.  
- **Fit Criterion:** No frequent intervention.

---

## Robustness or Fault-Tolerance

### 10.1 - Back-End Error Handling  
- **Priority:** High  
- **Description:** Graceful failure handling.  
- **Rationale:** Ensure continuity.  
- **Fit Criterion:** Show error, avoid crash.

### 10.2 - Front-End Error Prompts  
- **Priority:** High  
- **Description:** Specific user-facing errors.  
- **Rationale:** Clear guidance for users.  
- **Fit Criterion:** Relevant messages displayed.

---

## Scalability or Extensibility

### 12.1 - Single User Support  
- **Priority:** High  
- **Description:** Only one user at a time.  
- **Rationale:** Avoid complexity.  
- **Fit Criterion:** One active session only.

### 12.2 - Expandable for Future Scripts  
- **Priority:** High  
- **Description:** Add new scripts easily.  
- **Rationale:** Allow future growth.  
- **Fit Criterion:** Seamless script integration.

---

## Longevity

### 13.1 - Visual Representation Improvements  
- **Priority:** Medium  
- **Description:** Enhance visuals.  
- **Rationale:** Better insights.  
- **Fit Criterion:** Option to update visuals.

---

## Maintainability and Support

### 14.1 - Low Maintenance  
- **Priority:** High  
- **Description:** Rare updates required.  
- **Rationale:** Reduce support overhead.  
- **Fit Criterion:** Functional for at least 1 year.

### 14.2 - User Support Docs  
- **Priority:** Medium  
- **Description:** Provide help content.  
- **Rationale:** Improve self-service.  
- **Fit Criterion:** Include guides and FAQs.

---

## Security

### 15.1 - Harmless PowerShell Scripts  
- **Priority:** High  
- **Description:** Safe scripting only.  
- **Rationale:** Prevent risk.  
- **Fit Criterion:** Use only verified scripts.

---

## Audit

### 16.1 - Command History Tracking  
- **Priority:** Medium  
- **Description:** Log all commands.  
- **Rationale:** Audit and track actions.  
- **Fit Criterion:** Command list visible.

---

## Privacy

### 17.1 - No Sensitive Data Collected  
- **Priority:** High  
- **Description:** No PII collected.  
- **Rationale:** Ensure privacy.  
- **Fit Criterion:** No data retention.
