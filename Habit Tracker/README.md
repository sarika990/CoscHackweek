# HabitCraft - Premium Habit Tracker Web Application

HabitCraft is a modern, responsive, and visually stunning Habit Tracker web application designed with a **Maximalist UI** style. It operates entirely on the client side using pure HTML5, CSS3, and Vanilla JavaScript (ES6+). No external frameworks, build tools, or databases are required.

## Features

- **Maximalism UI Design**: Rich glowing effects, floating animated blobs, layered glassmorphism cards, premium custom SVG rings, and responsive components.
- **Hero Dashboard Statistics**: Live global metrics tracking Total Habits, Today's Completed, Overall Completion Percentage, and Current Streak.
- **30-Day Interactive Calendar**: Custom monthly grid calendar embedded in each card. Click cells to log completions, miss days, or view tooltips. Future days are disabled.
- **Habit Customization & Forms**: Choose emoji icons, custom color highlights, categories, priority badges (High, Medium, Low), daily reminder times, and personalized notes.
- **Streak & Completion Systems**: Algorithmic streak tracker calculating current/best streaks, missed days, and logs count automatically after every calendar click.
- **Data Persistence**: Automatic syncing of habits, historical checkmarks, custom color schemes, theme preferences, and form states to browser `LocalStorage`.
- **Search, Sorting, and Filtering**:
  - Filter by Completed, Pending, Priority level, or specific Categories.
  - Sort by Newest, Oldest, Alphabetical, Highest Streak, or Most Completed.
- **Export & Import Data**: Save backup files as JSON and restore them with schema validation to prevent corrupted states.
- **Achievement System**: Automatically unlock visual trophies based on completion rate thresholds and streak milestones.
- **Toast Notifications**: Interactive toast alerts for creation, deletions, edits, updates, duplicates, resets, exports, imports, and theme toggling.
- **Fully Responsive & Accessible**: Custom CSS media queries tailored for desktops, laptops, tablets, and mobile devices, combined with ARIA accessibility roles and keyboard support.

## Folder Structure

```text
Habit-Tracker/
│
├── index.html
├── css/
│   ├── style.css
│   ├── dashboard.css
│   ├── calendar.css
│   ├── animations.css
│   ├── responsive.css
│   └── themes.css
│
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── calendar.js
│   ├── habits.js
│   ├── streak.js
│   ├── statistics.js
│   ├── theme.js
│   ├── notification.js
│   ├── export.js
│   └── utils.js
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── favicon/
│
└── README.md
```

## Installation

1. Clone or download the project to your local directory.
2. Open `index.html` directly in any web browser (no local server or terminal commands are strictly necessary, though serving files locally is recommended for security settings on some browsers).
3. Alternatively, serve using any simple HTTP server (e.g. `npx serve`, VS Code Live Server, or `python -m http.server`).

## Usage

1. **Add Habit**: Fill in the title, select category, pick an emoji and theme color, and click "Add Habit".
2. **Track Completion**: Click cells on the 30-Day Calendar to checkmark dates. Watch your statistics, charts, and streaks update instantly.
3. **Toggle Dark Mode**: Click the Sun/Moon toggle icon in the top right to switch mode preferences.
4. **Export/Import**: Backup your data with the Export button. You can reload this data using the Import file selector.

## Future Improvements

- **Notification API Integration**: Integrate local browser web notifications.
- **Detailed Custom Analytics**: Graphs showing trend lines over several months.
- **Multiple Habits Categorization**: Add support for grouping habits by multiple tags.

## License

This project is open-source and licensed under the MIT License.
