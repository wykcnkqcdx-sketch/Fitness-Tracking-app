import { 
  HomeScreen, 
  StrengthScreen, 
  CardioScreen, 
  PlanScreen, 
  ProgressScreen, 
  BodyScreen, 
  SyncScreen, 
  Nav, 
  RestTimer 
} from './components/HomeScreen.js';   // Wait — no, since we are using individual files, change to:

// Correct imports for separate files:
import { HomeScreen } from './components/HomeScreen.js';
import { StrengthScreen } from './components/StrengthScreen.js';
import { CardioScreen } from './components/CardioScreen.js';
import { PlanScreen } from './components/PlanScreen.js';
import { ProgressScreen } from './components/ProgressScreen.js';
import { BodyScreen } from './components/BodyScreen.js';
import { SyncScreen } from './components/SyncScreen.js';
import { Nav } from './components/Nav.js';
import { RestTimer } from './components/RestTimer.js';
