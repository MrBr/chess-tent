import React, { ComponentProps } from 'react';
import { RouteComponentProps } from 'react-router';
import { components, hoc } from '@application';
import * as H from 'history';
import { ApiStatus, Components } from '@types';

const { RedirectPrompt } = components;
const { withRouter } = hoc;

class ApiRedirectPrompt extends React.Component<
  ComponentProps<Components['ApiRedirectPrompt']> & RouteComponentProps
> {
  componentDidMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  handleSilentBeforeUnload = (location: H.Location) => {
    const { history, status } = this.props;
    if (history.location.pathname === location.pathname) {
      return true;
    } else if (status !== ApiStatus.DIRTY) {
      return true;
    }
    return 'Please wait until all changes are saved.';
  };

  handleBeforeUnload = (e: Event) => {
    const { status } = this.props;
    if (status === ApiStatus.DIRTY) {
      e.returnValue = false;
    }
  };

  render() {
    return <RedirectPrompt message={this.handleSilentBeforeUnload} />;
  }
}

export default withRouter(ApiRedirectPrompt);
