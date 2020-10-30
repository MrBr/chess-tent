import React from 'react';
import { components } from '@application';
import { Components } from '@types';

const { Stepper } = components;

const AnalysisSidebar: Components['AnalysisSidebar'] = ({
  analysis,
  ...props
}) => {
  return <Stepper stepRoot={analysis} {...props} />;
};

export default AnalysisSidebar;
