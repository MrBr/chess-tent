import React, { ReactNode, ComponentProps, ReactEventHandler } from 'react';
import { components, utils } from '@application';
import { Components, EditorSidebarProps, Steps } from '@types';
import {
  getAnalysisActiveStep,
  updateAnalysisActiveStepId,
} from '@chess-tent/models';
import Analysis from './analysis';
import EditorSidebarStepContextMenu from '../../lesson/components/editor-sidebar-step-context-menu';
import { promoteVariation } from '../../step/service';

const { Stepper, StepTag, EditorStepToolbox } = components;
const { noop } = utils;

interface AnalysisSidebarState {
  contextMenu?: ReactNode;
}

class AnalysisSidebar extends Analysis<
  ComponentProps<Components['AnalysisSidebar']>,
  AnalysisSidebarState
> {
  state = {} as AnalysisSidebarState;

  renderToolbox: EditorSidebarProps['renderToolbox'] = props => {
    const { analysis, active } = this.props;

    if (!active) {
      return null;
    }

    return (
      <EditorStepToolbox
        setActiveStep={this.setActiveStep}
        updateStep={this.updateStep}
        removeStep={this.removeStep}
        stepRoot={analysis}
        updateChapter={() => {}}
        {...props}
        exercise={false}
        paste={false}
      />
    );
  };

  renderStepTag: Components['StepTag'] = props => {
    const { updateAnalysis } = this.props;
    const handleStepContextMenu: ReactEventHandler = e => {
      if (!props.step) {
        return;
      }

      e.preventDefault();
      const contextMenu = (
        <EditorSidebarStepContextMenu
          container={e.currentTarget as HTMLElement}
          onClose={() => this.setState({ contextMenu: undefined })}
          onPromoteVariation={() => {
            updateAnalysis(draft => {
              promoteVariation(draft, props.step as Steps);
              props.step && updateAnalysisActiveStepId(draft, props.step.id);
            });
            this.setState({ contextMenu: undefined });
          }}
        />
      );

      this.setState({
        contextMenu,
      });
    };

    return (
      <StepTag
        {...props}
        active={this.props.active && props.active}
        onContextMenu={handleStepContextMenu}
      />
    );
  };

  render() {
    const { analysis } = this.props;
    const { contextMenu } = this.state;
    const step = getAnalysisActiveStep(analysis);

    if (!step) {
      return null;
    }

    return (
      <section className="editor">
        {contextMenu}
        <Stepper
          stepRoot={analysis}
          setActiveStep={this.setActiveStep}
          activeStep={step}
          updateStep={this.updateStep}
          removeStep={this.removeStep}
          renderToolbox={this.renderToolbox}
          renderStepTag={this.renderStepTag}
          updateChapter={noop}
        />
      </section>
    );
  }
}

export default AnalysisSidebar;
