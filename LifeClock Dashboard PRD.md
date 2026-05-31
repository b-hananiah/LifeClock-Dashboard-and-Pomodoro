# Product Requirements Document (PRD)
## Life Clock & Pomodoro Dashboard with Heatmap Analytics

**Version:** 2.0 | **Last Updated:** May 2026 | **Status:** Production Ready

---

## 1. Executive Summary

Life Clock is a comprehensive time visualization and productivity dashboard that combines a circadian clock interface, Pomodoro timer, schedule management, habit tracking, and activity heatmaps. The application helps users visualize their life in hours, track daily segments, maintain focus sessions, and analyze long-term productivity patterns through GitHub-style monthly heatmaps.

**Core Value Proposition:** Transform abstract time into tangible visualizations while providing actionable productivity tools and analytics.

---

## 2. Product Overview

### 2.1 Mission
Empower users to consciously allocate their time by visualizing how daily hours are spent, tracking focused work sessions, and identifying behavioral patterns through data-driven insights.

### 2.2 Target Audience
- Students (particularly medical/graduate students with structured schedules)
- Remote workers and freelancers
- Productivity enthusiasts
- Individuals practicing time blocking
- Anyone seeking to understand their time allocation patterns

### 2.3 Key Differentiators
- **Circadian clock visualization** with 24-hour pie chart showing daily segments
- **Integrated Pomodoro timer** with session tracking and streak analytics
- **Segment-based task management** (3 tasks per active block)
- **Dual heatmap analytics** (Pomodoro sessions + honored segments)
- **Complete data portability** (save/load entire app state to HTML)

---

## 3. Functional Requirements

### 3.1 Core Dashboard Components

| Component | Description | Priority |
|-----------|-------------|----------|
| **Circadian Clock** | 24-hour pie chart with colored segments for daily activities; live hand showing current time | P0 |
| **Time Display** | Real-time clock with date, day, and customizable 12/24h format | P0 |
| **Segment Timeline** | Expandable list of daily schedule blocks with active segment highlighting and countdown timer | P0 |
| **Pomodoro Timer** | Configurable focus/break timer with visual ring, session counter, and sound notifications | P0 |
| **Time Trackers** | Progress bars/squares for year/day/life/custom events | P1 |
| **Active Tasks Panel** | Up to 3 todo items tied to the current active segment | P1 |

### 3.2 Schedule Management

**Requirement:** Users can create, edit, and delete daily schedules (profiles).

**Specifications:**
- Multiple profiles (e.g., Weekday, Weekend, Vacation)
- Each segment requires: name, start time, end time, color, optional alert (5/10/15 min before end)
- Segments wrap across midnight (e.g., 22:00 to 06:00)
- Drag-to-edit not required; modal-based editing

**Acceptance Criteria:**
- [ ] Profile creation/deletion/renaming works
- [ ] Segment times validate (duration auto-calculated)
- [ ] Color picker with preset swatches and custom hex
- [ ] Renaming a segment migrates existing task data

### 3.3 Pomodoro Timer

**Requirement:** Fully functional timer with focus/break cycles and persistent session logging.

**Specifications:**

| Setting | Default | Range |
|---------|---------|-------|
| Work duration | 25 min | 1-120 min |
| Short break | 5 min | 1-60 min |
| Long break | 15 min | 1-120 min |
| Long break interval | 4 sessions | 1-10 sessions |

**Session Colors:** Customizable per mode (Focus, Short Break, Long Break)

**Sound Options:** Chime bells, Kitchen timer, Digital synth

**Data Tracking:**
- Each completed focus session logs: date, session count, minutes focused
- Session counts appear in daily log and heatmaps

**Acceptance Criteria:**
- [ ] Timer runs accurately with visual ring countdown
- [ ] Skip and reset functions work
- [ ] Session counter dots update correctly
- [ ] Break intervals follow configured pattern
- [ ] Sound plays on session completion
- [ ] Data persists across browser refreshes

### 3.4 Segment Honor System

**Requirement:** Users can mark segments as "honored" (completed) and add tasks.

**Specifications:**
- Each segment per day has: `done` (boolean), `tasks` (array of {text, done})
- Maximum 3 tasks per segment
- Tasks are specific to the segment and date
- Honored segments appear in daily log and contribute to heatmap

**Acceptance Criteria:**
- [ ] Checkbox appears in daily log for each segment
- [ ] Tasks can be added/removed/toggled
- [ ] Honored status persists
- [ ] Renaming a segment preserves task data under new name

### 3.5 Heatmap Analytics (NEW FEATURE)

**Requirement:** GitHub-style monthly calendar heatmaps showing activity intensity.

**Two Heatmap Types:**

| Heatmap | Data Source | Color Intensity Based On |
|---------|-------------|--------------------------|
| Pomodoro Sessions | `pomoLog` | Number of focus sessions per day |
| Honored Segments | `dailyLog[seg].done` | Count of completed segments per day |

**Visual Specifications:**
- **Layout:** Monthly calendars, Monday as first day of week
- **Spacing:** 28px gap between months, each month in own card
- **Colors:** 5-level intensity scale (adapts to theme accent color)
  - Level 0: `rgba(accent, 0.12)` - 0-10% of max
  - Level 1: `rgba(accent, 0.32)` - 11-30%
  - Level 2: `rgba(accent, 0.58)` - 31-60%
  - Level 3: `rgba(accent, 0.86)` - 61-85%
  - Level 4: `accent` - 86-100%
- **Tooltip:** Shows date and exact value on hover
- **Time Range:** Last 365 days from current date

**Summary Statistics Displayed:**

| Pomodoro Stats | Honored Segments Stats |
|----------------|------------------------|
| Total sessions | Total honored blocks |
| Total focus minutes | Best day (max blocks) |
| Current streak (days with ≥1 session) | Streak (consecutive days with ≥1 honored) |

**Acceptance Criteria:**
- [ ] Heatmaps render correctly for past 365 days
- [ ] Color intensity scales appropriately based on actual max value
- [ ] Tabs switch between Pomodoro and Honored views
- [ ] Summary stats update in real-time when data changes
- [ ] Theme changes affect heatmap colors immediately
- [ ] Empty/zero-value days show lowest intensity

### 3.6 Daily Log Drawer

**Requirement:** Left-side drawer showing date-specific data with navigation.

**Components:**
- Date navigation (previous/next day buttons)
- Segments list with honor checkboxes and task lists
- Daily note textarea (journaling)
- Pomodoro stats for selected date + all-time totals

**Acceptance Criteria:**
- [ ] Date picker navigates day-by-day
- [ ] Segments reflect the selected profile for that date
- [ ] Task checkboxes toggle completion
- [ ] Honor checkboxes update heatmap data
- [ ] Notes auto-save on input

### 3.7 Settings Drawer

**Requirement:** Right-side drawer with configuration tabs.

**Tabs:**
| Tab | Settings |
|-----|----------|
| Schedules | Profile management, segment list editing |
| Pomodoro | Durations, colors, sound selection, test button |
| Trackers | Add/edit/delete time trackers, visibility toggle |
| Display | Dark mode, time format, theme color, clock orientation, pie labels, legend toggle, tracker position |

**Data Management:**
- Save data to HTML file (exports entire state)
- Factory reset (clears localStorage and reloads)

**Acceptance Criteria:**
- [ ] All settings persist to localStorage
- [ ] Theme changes apply immediately to all UI elements
- [ ] Saved HTML file contains embedded state and can be shared
- [ ] Factory reset prompts for confirmation

### 3.8 Focus Mode

**Requirement:** Full-screen minimalist view showing only time and current segment.

**Features:**
- Large time display
- Current segment name
- Time remaining in segment
- Click or `Esc` to exit
- Hotkey `F` to toggle

**Acceptance Criteria:**
- [ ] Focus mode hides all other UI elements
- [ ] Time updates in real-time
- [ ] Segment countdown shows correctly
- [ ] Exits gracefully without data loss

---

## 4. Non-Functional Requirements

### 4.1 Performance

| Metric | Target |
|--------|--------|
| Initial load time | < 1.5s on broadband |
| Clock animation | 60fps |
| Heatmap render | < 300ms for 365 days |
| localStorage read/write | < 50ms |

### 4.2 Compatibility

- **Browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Responsive:** Desktop-first with mobile adaptation (480px breakpoint)
- **Dark/Light mode:** Full theme support with smooth transitions

### 4.3 Data Persistence

- **Storage:** localStorage (`lifeclock_v7`)
- **Backup:** Export to HTML file (embedded JSON)
- **Data structure:**
```javascript
{
  dark: boolean,
  timeFormat: "12h"|"24h",
  orientation: "noon-top"|"mid-top",
  pieStyle: "solid"|"donut",
  schedules: [{ id, name, segments: [{ name, start, dur, color, alertMins }] }],
  activeSchedId: string,
  pomoWork, pomoShort, pomoLongBreak, pomoLongInterval: number,
  pomoColorFocus, pomoColorBreak, pomoColorLongBreak: hex string,
  pomoSound: "bells"|"kitchen"|"digital",
  showPieLabels, showLegend, showTimeRemaining: boolean,
  trackerPosition: "above"|"below",
  trackers: [{ id, name, type, color, style, showRemaining, visible, ...typeSpecific }],
  theme: "purple"|"blue"|"green"|"orange"|"rose"|"teal"|"amber"|"custom",
  themeCustomColor: hex string,
  dailyLog: { "YYYY-MM-DD": { _note: string, "SegmentName": { done: boolean, tasks: [{ text, done }] } } },
  pomoLog: { "YYYY-MM-DD": { sessions: number, minutes: number } }
}
```

### 4.4 Accessibility

- Keyboard navigation support (hotkeys)
- Sufficient color contrast for all UI elements
- Focus indicators on interactive elements
- Tooltips on heatmap cells

### 4.5 UX Requirements

- Toast notifications with undo functionality (5s timeout)
- Confirmation dialogs for destructive actions
- Smooth transitions (0.26s cubic-bezier)
- Starfield background animation (subtle, non-distracting)
- No external dependencies beyond Google Fonts

---

## 5. User Interface Requirements

### 5.1 Layout Structure (Desktop ≥960px)

```
┌─────────────────────────────────────────────────────────────────┐
│                          TOPBAR (Theme, Title, Buttons)          │
├─────────────────────────────┬───────────────────────────────────┤
│                             │                                   │
│   LEFT COLUMN (60%)         │   RIGHT COLUMN (40%)              │
│   - Time Bar                │   - Segment Timeline              │
│   - Circadian Clock         │   - Pomodoro Timer                │
│   - Time Trackers           │   - Active Tasks Panel            │
│   (Tracker position         │                                   │
│    configurable above/below)│                                   │
│                             │                                   │
└─────────────────────────────┴───────────────────────────────────┘
```

### 5.2 Drawer System

| Drawer | Position | Trigger | Width |
|--------|----------|---------|-------|
| Daily Log | Left (slide from left) | Journal button / `J` | 500px |
| Statistics | Left (slide from left) | Stats button / `K` | 600px |
| Control Panel | Right (slide from right) | Menu button / `X` | 430px |

### 5.3 Color Palette

**Dark Mode (default):**
- Background: `#06051a` with radial gradients
- Surface: `rgba(255,255,255,0.035)`
- Text primary: `#f3f3fa`
- Text secondary: `#9fa1b5`
- Accent: user-configurable (default `#5c54db`)

**Light Mode:**
- Background: `#ebebf5`
- Surface: `rgba(0,0,0,0.04)`
- Text primary: `#0f0f1c`
- Accent: follows same color configuration

---

## 6. Hotkey Reference

| Hotkey | Action | Context |
|--------|--------|---------|
| `Space` | Start/Pause Pomodoro | Global |
| `R` | Reset Pomodoro | Global |
| `S` | Skip current Pomodoro session | Global |
| `F` | Toggle Focus Mode | Global |
| `J` | Open/close Daily Log drawer | Global |
| `K` | Open/close Statistics heatmap | Global |
| `X` | Open/close Control Panel | Global |
| `D` | Toggle Dark/Light theme | Global |
| `W` | Expand/collapse Segment Timeline | Global |
| `Esc` | Close all drawers/modals; exit Focus Mode | Global |
| `Ctrl+Z` / `Cmd+Z` | Undo last destructive action | Global (toast undo) |

---

## 7. Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Deleting last segment in a profile | Prevent deletion, show toast |
| Renaming segment | Migrate existing daily log entries |
| Segment duration crossing midnight | Duration calculation handles wrap (adds 24h) |
| No Pomodoro data for a date | Heatmap shows lowest intensity, summary shows 0 |
| No honored segments for a date | Heatmap shows lowest intensity |
| localStorage quota exceeded | Graceful fallback, prompt user to export/clear |
| AudioContext suspended on mobile | Initialized on first user interaction |
| Invalid time input (end before start) | Automatically adds 24h to duration |

---

## 8. Future Enhancements (Backlog)

| Feature | Priority | Description |
|---------|----------|-------------|
| Export data as CSV/JSON | P2 | Download raw data for external analysis |
| Cloud sync | P3 | Optional Firebase integration |
| Weekly/Monthly PDF reports | P3 | Generate productivity summaries |
| Segment templates | P3 | Pre-built schedules (student, 9-5, shift work) |
| Mobile native wrapper | P4 | Capacitor/Cordova build |
| Data visualization (charts) | P4 | Line/bar charts for weekly trends |

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| User retention (30-day) | >60% | localStorage last active date |
| Average Pomodoro sessions/week | >5 | Aggregate `pomoLog` data |
| Segment honor rate | >70% | `dailyLog[].done` / total segments |
| Heatmap usage | >50% of sessions | Statistics drawer open events |
| Export usage | >10% of users | `saveToHTML` calls |

---

## 10. Technical Specifications

### 10.1 Architecture
- **Single HTML file** – No build step, no dependencies (except Google Fonts)
- **Vanilla JavaScript** – ES6+, no frameworks
- **Canvas + SVG** – Starfield animation (Canvas), clock segments (SVG)
- **localStorage** – Persistence layer
- **Web Audio API** – Sound notifications

### 10.2 File Structure (within single HTML)
```
<!DOCTYPE html>
<html>
  <head> (styles, fonts, meta)
  <body>
    <canvas> (starfield)
    <div class="dashboard"> (main UI)
    <div class="drawer"> (settings)
    <div class="data-drawer"> (daily log)
    <div class="stats-drawer"> (heatmaps)
    <div class="modal"> (segment/tracker editors)
    <div id="toast"> (notifications)
    <div id="focus-overlay"> (focus mode)
    <script> (all application logic)
  </body>
</html>
```

### 10.3 State Management
- **Global state object** `S` – single source of truth
- **Save function** – writes to localStorage after every mutation
- **Embedded state** – supports saving entire state to HTML file for portability

### 10.4 Rendering Cycle
1. User action → mutate `S`
2. `saveState()` → localStorage
3. `renderAll()` → updates clock, timeline, trackers
4. `refreshHeatmaps()` → updates statistical views
5. `syncClock()` → continuous time updates (1s interval)

---

## 11. Glossary

| Term | Definition |
|------|------------|
| **Segment** | A time-blocked activity with start time, duration, and color |
| **Honored** | A segment marked as completed for a specific day |
| **Profile** | A named collection of segments (e.g., "Weekday Routine") |
| **Pomodoro** | Time management technique using 25min work + 5min break cycles |
| **Heatmap** | Monthly calendar visualization showing activity intensity via color |
| **Circadian Clock** | 24-hour pie chart visualization of daily schedule |
| **Drawer** | Side panel that slides in from left/right edge |

---

## 12. Appendix

### 12.1 Keyboard Shortcut Customization Guide

To modify hotkeys, locate the `document.addEventListener('keydown'...)` block in the script:

```javascript
// Add new hotkey:
case 'm':
case 'M':
  e.preventDefault();
  myCustomFunction();
  break;

// Change existing (replace 'k' with 't'):
case 't':  // was 'k'
case 'T':
  e.preventDefault();
  openStatsDrawer();
  break;

// Remove a hotkey: delete its case block entirely
```

### 12.2 Theme Color Integration

Heatmap colors automatically adapt to the selected theme accent via CSS custom properties:

```css
--heat-l1: rgba(var(--accent-rgb), 0.12);
--heat-l2: rgba(var(--accent-rgb), 0.32);
--heat-l3: rgba(var(--accent-rgb), 0.58);
--heat-l4: rgba(var(--accent-rgb), 0.86);
--heat-l5: var(--accent);
```

### 12.3 Data Migration Path

| Version | Changes |
|---------|---------|
| v7 (current) | Added `pomoLog`, `dailyLog` structure, heatmaps |
| v6 | Added theme system, custom colors |
| v5 | Added segment alerts, task system |
| v4 | Added Pomodoro timer |
| v3 | Added time trackers |
| v2 | Added multiple profiles |
| v1 | Initial circadian clock |

---

**Document Approval:** ✅ Ready for development

**Next Steps:** Implementation complete; ready for user acceptance testing.
