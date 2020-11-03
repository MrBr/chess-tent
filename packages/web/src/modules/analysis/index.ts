import application from '@application';
import { analysisSchema } from './model';
import AnalysisBoard from './components/board';
import AnalysisSidebar from './components/sidebar';

application.model.analysisSchema = analysisSchema;
application.components.AnalysisBoard = AnalysisBoard;
application.components.AnalysisSidebar = AnalysisSidebar;
application.register(
  () => import('./service'),
  module => {
    application.services.createAnalysis = module.createAnalysisService;
    application.services.removeAnalysisStep = module.removeAnalysisStep;
  },
);
