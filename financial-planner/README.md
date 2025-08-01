# Financial Planner MVP

A monthly-first financial planning app that combines detailed short-term tracking with effortless long-term projections.

## 🚀 Features

### MVP Features (Implemented)
- **12-Month Manual Planner**: Track income, expenses, savings, and investments month by month
- **Automatic Rollover**: Leftover funds automatically carry forward to the next month
- **ROI Calculator**: Project your savings growth with customizable annual returns
- **Local Storage**: Your data persists between sessions
- **Beautiful UI**: Modern, responsive design that works on all devices

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Custom CSS with modern design principles
- **State Management**: React Context API
- **Data Persistence**: Local Storage
- **Icons**: Lucide React

## 📋 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd financial-planner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 💡 How to Use

### Monthly Planning
1. Enter your income, expenses, savings, and investments for each month
2. The app automatically calculates:
   - Total available funds (income + rollover from previous month)
   - Remaining funds (to be rolled over to next month)
3. Add notes to any month for reminders or context

### Long-term Projections
1. Set your current age and target age
2. Define your monthly contribution amount
3. Set expected annual ROI (default: 7%)
4. View your projected savings at your target age

### Data Management
- Your data is automatically saved to browser local storage
- Use the "Reset Data" button to start fresh

## 📊 Data Model

### MonthData
- Income, expenses, savings, investments
- Automatic rollover calculations
- Optional notes field

### ProjectionData
- Monthly contribution amount
- Annual ROI percentage
- Target age for projections

## 🎯 Roadmap

### V1 Features (Planned)
- "Apply to multiple months" UI
- Basic projection simulator
- Plaid integration for bank balance sync

### V2 Features (Future)
- Forecast editor with variable savings/income
- Scenario comparison tools
- Dark mode support
- Enhanced mobile experience

## 🔒 Security & Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Bank integrations (when added) will be read-only

## 🤝 Contributing

This is currently an MVP. Future contributions will be welcome once the project structure is finalized.

## 📝 License

[To be determined]

---

Built with ❤️ for better financial planning
