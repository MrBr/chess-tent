import React from 'react';
import { Difficulty } from '@chess-tent/models';

import { ui } from '@application';

const { Dropdown } = ui;
interface DifficultyDropdownProps {
  difficulty: Difficulty;
  onChange?: (difficulty: Difficulty) => void;
}

class DifficultyDropdown extends React.Component<
  DifficultyDropdownProps,
  { editing: boolean }
> {
  onChange = (difficultyKey: string) => {
    const { onChange } = this.props;
    onChange && onChange(Difficulty[difficultyKey as Difficulty]);
  };
  render() {
    const { difficulty } = this.props;
    return (
      <Dropdown onSelect={this.onChange}>
        <Dropdown.Toggle id="difficulty-dropdown" size="small">
          {difficulty}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.keys(Difficulty).map(difficulty => (
            <Dropdown.Item eventKey={difficulty} key={difficulty}>
              {difficulty}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
export default DifficultyDropdown;
