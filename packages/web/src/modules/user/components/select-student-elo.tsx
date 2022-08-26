import React from 'react';
import { ui } from '@application';

const { Slider } = ui;

interface SelectStudentEloProps {
  range: [number, number];
  onChange: (range: [number, number]) => void;
}

const studentEloRangeMarks = { 500: 500, 1200: 1200, 1600: 1600, 2200: 2200 };

const SelectStudentElo = ({ range, onChange }: SelectStudentEloProps) => {
  return (
    <Slider
      min={0}
      max={3000}
      step={100}
      range
      defaultValue={range || [500, 1200]}
      marks={studentEloRangeMarks}
      onChange={val => {
        if (Array.isArray(val)) {
          onChange(val as [number, number]);
        }
      }}
    />
  );
};

export default SelectStudentElo;
