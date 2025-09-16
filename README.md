# Password Game Challenge 🎮

An interactive password game inspired by Neal.fun's Password Game, created by **BAIUST Computer Club** in collaboration with **TECHious**.

## 🎁 Prize

Complete all 27 rules to win **3 VIP tickets to the YouthGEN Event**!

## 🚀 Features

- **Interactive Password Challenge**: 27 unique rules to complete sequentially
- **Real-time Validation**: Instant feedback on rule compliance
- **User Registration**: Capture participant information (ID, Name, Level, Term, Department, Email)
- **Admin Portal**: Monitor all submissions and track winners
- **MongoDB Integration**: Persistent data storage with development memory server
- **Responsive Design**: Works on desktop and mobile devices
- **Comic Theme**: Fun and engaging game design with animations

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom game theme
- **Database**: MongoDB with Mongoose (Memory server for development)
- **Validation**: React Hook Form + Yup
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Game Rules

The game features 25 progressive rules based on the custom rules defined in `rules.md`:

1. Password must be at least 5 characters
2. Must include a number
3. Must include an uppercase letter
4. Must include a special character
5. Digits must add up to 25
6. Must include a month of the year
7. Must include a Roman numeral
8. Must include "TECHious"
9. Roman numerals must multiply to 35
10. Must include a periodic table element
11. Must include current moon phase emoji
12. Must include a leap year
13. Must protect TanbirSayem (🥚)
14. Element atomic numbers must sum to 200
15. All vowels must be bolded
16. Password catches fire (put it out!)
17. Must include strength emoji (🏋️‍♂️)
18. Must include an affirmation
19. TanbirSayem hatches and needs feeding
20. Must include a YouTube URL
21. Sacrifice two letters
22. Must include hex color
23. Skip this rule
24. Must include password length
25. Length must be prime

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd password-game
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:10105](http://localhost:10105)

### Environment Variables

- `NODE_ENV`: Set to "development" for local development
- `MONGODB_URI`: MongoDB connection string (optional for development)
- `NEXT_PUBLIC_APP_URL`: Application URL

## 📖 Usage

### For Players

1. **Register**: Fill in your details (Name, Email, Level, Term, Department)
2. **Play**: Complete each rule sequentially
3. **Win**: Complete all 25 rules to win VIP tickets!

### For Administrators

- Visit `/admin` to view all submissions and winners
- Monitor real-time participation and completion rates
- Export winner data for prize distribution

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin portal
│   ├── api/               # API routes
│   └── page.tsx           # Main game page
├── components/            # React components
│   ├── GameCard.tsx       # Reusable card component
│   ├── Header.tsx         # App header
│   ├── PasswordGame.tsx   # Main game logic
│   ├── PasswordInput.tsx  # Password input with styling
│   ├── RuleDisplay.tsx    # Individual rule display
│   └── UserForm.tsx       # User registration form
├── lib/                   # Utilities and configurations
│   ├── gameLogic.ts       # Game rules and validation
│   ├── mongodb.ts         # Database connection
│   └── models/            # Mongoose models
├── types/                 # TypeScript type definitions
└── styles/               # Global styles
```

## 🎨 Design Features

- **Green Gaming Theme**: Consistent color scheme throughout
- **Comic Fonts**: Fun, game-appropriate typography
- **Smooth Animations**: Framer Motion powered interactions
- **Responsive Layout**: Works on all device sizes
- **Visual Feedback**: Clear rule status indicators

## 🔧 Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Database Setup

- **Development**: Uses MongoDB Memory Server automatically
- **Production**: Configure `MONGODB_URI` in environment variables

## 🤝 Contributing

This project is developed by **BAIUST Computer Club** in collaboration with **TECHious**.

## 📝 License

Copyright © 2025 BAIUST Computer Club. All rights reserved.

## 🎉 Credits

- **Inspiration**: Neal.fun's Password Game
- **Developed by**: BAIUST Computer Club
- **Partner**: TECHious
- **Event**: YouthGEN

---

**Good luck with the challenge! 🎮🏆**
