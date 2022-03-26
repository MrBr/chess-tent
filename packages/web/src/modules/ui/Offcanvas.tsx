import React, {
  createContext,
  useCallback,
  useState,
  ReactElement,
  FunctionComponent,
  useContext,
} from 'react';
import BOffcanvas from 'react-bootstrap/Offcanvas';
import { UI } from '@types';
import application from '@application';

const OffcanvasContext = createContext<
  (render: (close: () => void) => ReactElement) => void
>(() => {});

const Offcanvas = BOffcanvas as UI['Offcanvas'];

Offcanvas.defaultProps = {
  ...BOffcanvas.defaultProps,
  placement: 'end',
};

const usePromptOffcanvas = () => {
  return useContext(OffcanvasContext);
};

const OffcanvasProvider: FunctionComponent = ({ children }) => {
  const [offcanvases, setOffcanvas] = useState<ReactElement[]>([]);
  const renderOffcanvas = useCallback(
    render => {
      setOffcanvas(prevValues => {
        const newOffcanvas = render(() =>
          setOffcanvas(prevValues =>
            prevValues.filter(offCanvas => offCanvas !== newOffcanvas),
          ),
        );
        return [...prevValues, newOffcanvas];
      });
    },
    [setOffcanvas],
  );

  return (
    <OffcanvasContext.Provider value={renderOffcanvas}>
      {offcanvases}
      {children}
    </OffcanvasContext.Provider>
  );
};

application.ui.Offcanvas = Offcanvas;
application.hooks.usePromptOffcanvas = usePromptOffcanvas;
application.services.addProvider(OffcanvasProvider);
