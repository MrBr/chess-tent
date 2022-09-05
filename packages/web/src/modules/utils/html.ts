import { ReactEventHandler } from 'react';

export const rightMouse = (f: Function) => (e: MouseEvent) =>
  e.button === 2 && f(e);
export const stopPropagation: ReactEventHandler = e => e.stopPropagation();
export const isInputTypeElement = (elem: Element) =>
  !!elem.getAttribute('contenteditable') || elem.tagName === 'input';

export const createKeyboardNavigationHandler =
  (prev: Function, next: Function) => (e: KeyboardEvent) => {
    if (document.activeElement && isInputTypeElement(document.activeElement)) {
      return;
    }

    switch (e.code) {
      case 'ArrowLeft':
        prev();
        return;
      case 'ArrowRight':
        next();
        return;
    }
  };

// https://stackoverflow.com/a/7557433/2188869
export const isElementInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /* or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /* or $(window).width() */
  );
};
