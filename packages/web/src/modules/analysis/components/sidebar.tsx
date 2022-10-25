import React, { ComponentProps } from 'react';
import { components, utils } from '@application';
import { Components, EditorSidebarProps } from '@types';
import { getAnalysisActiveStep } from '@chess-tent/models';
import Analysis from './analysis';

const { Stepper, StepTag, StepToolbox } = components;
const { noop } = utils;

class AnalysisSidebar extends Analysis<
  ComponentProps<Components['AnalysisSidebar']>
> {
  renderToolbox: EditorSidebarProps['renderToolbox'] = props => {
    const { analysis, active } = this.props;

    if (!active) {
      return null;
    }

    return (
      <StepToolbox
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
    return <StepTag {...props} active={this.props.active && props.active} />;
  };

  render() {
    const { analysis } = this.props;
    const step = getAnalysisActiveStep(analysis);

    if (!step) {
      return null;
    }

    return (
      <section className="editor">
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
