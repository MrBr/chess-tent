import application from '@application';
import { EditorBoard, EditorSidebar } from './components/editor';
import { ActivityBoard, ActivitySidebar } from './components/activity';
import { createStep } from './service';
import { stepType } from './model';

application.stepModules.description = {
  EditorBoard,
  EditorSidebar,
  ActivityBoard,
  ActivitySidebar,
  createStep,
  stepType,
};
