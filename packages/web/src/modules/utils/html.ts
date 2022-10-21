import { ReactEventHandler, RefCallback } from 'react';

export const rightMouse = (f: Function) => (e: MouseEvent) =>
  e.button === 2 && f(e);
export const stopPropagation: ReactEventHandler = e => e.stopPropagation();
export const isInputTypeElement = (elem: Element) =>
  !!elem.getAttribute('contenteditable') || elem.tagName === 'input';

export const createKeyboardNavigationHandler =
  (prev: Function, next: Function, down?: Function, up?: Function) =>
  (e: KeyboardEvent) => {
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
      case 'ArrowUp':
        up && up();
        return;
      case 'ArrowDown':
        down && down();
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

export const getFileImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (file.type.search('image') < -1) {
      reject();
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = e => {
      if (!e.target?.result) {
        reject();
        return;
      }

      const image = new Image();
      image.src = e.target.result as string;

      image.onload = () => {
        if (!image?.height || !image?.width) {
          reject();
          return;
        }
        const { width, height } = image;
        resolve({
          width,
          height,
        });
      };
    };
  });
};

export const autosizeTextarea: RefCallback<HTMLInputElement> = inputRef => {
  if (!inputRef) {
    return;
  }
  inputRef.addEventListener('keydown', function () {
    inputRef.style.height = 'auto';
    inputRef.style.height = inputRef.scrollHeight + 'px';
  });
  inputRef.setAttribute(
    'style',
    'height:' + inputRef.scrollHeight + 'px;overflow-y:hidden;',
  );
};
