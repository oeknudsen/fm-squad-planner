# FM Squad Planner

A clean, modern web application for planning your Football Manager squad depth and formations.

## Features

- **Formation Selector**: Choose from 7 popular formations (4-2-3-1, 4-3-3, 4-4-2, 3-4-3, 3-5-2, 5-2-3, 4-1-4-1)
- **Depth Chart**: Manage 3 slots per position (1st choice, 2nd choice, Youth prospect)
- **Player Management**: Add, edit, and remove players with detailed attributes
- **Star Ratings**: Visual representation of Current Ability (CA) and Potential Ability (PA) with half-star support
- **Roles System**: FM26 player roles integrated per position
- **Persistence**: Auto-save to localStorage with import/export functionality
- **Responsive Design**: Mobile-friendly interface (375px+)

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **TailwindCSS** - Styling
- **lucide-react** - Icons

## Installation

1. Clone or navigate to the project directory:
```bash
cd fm-squad-planner
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
  types/              # TypeScript type definitions
  store/              # Zustand store with persistence
  components/
    layout/           # AppLayout, Sidebar
    depth/            # Depth chart components
    player/           # Player editor modal
    ui/               # Reusable UI components
  data/
    formations.ts     # Formation definitions
    roles.fm26.json   # FM26 player roles (to be populated)
  utils/
    localStorage.ts   # Persistence helpers
    roles.ts          # Role loading utilities
```

## Usage

1. **Select Formation**: Choose a formation from the sidebar dropdown
2. **Add Players**: Use the depth chart to add players to positions
3. **Edit Players**: Click on any player slot to edit their details
4. **Manage Depth**: Use the depth chart accordion to manage all three slots per position
5. **Export/Import**: Use the sidebar buttons to export your squad plan as JSON or import a previously saved plan
6. **Reset**: Clear all data and start fresh

## Data Model

- **Player**: name, nationality, age, position, role, currentAbility (0-5), potentialAbility (0-5)
- **DepthSlot**: Three optional player slots (first, second, youth)
- **SquadPlan**: Formation + depth chart + metadata

## Storage

All data is automatically saved to `localStorage` with the key `fm-squad-planner-v1`. You can export your data as JSON for backup or sharing.

## Future Enhancements

- Backend integration
- Player filtering and sorting
- Role recommendations
- CSV import
- Scouting integrations
- Player valuations
- Contract details

## License

MIT

