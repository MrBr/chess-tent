import { useRef, useCallback } from 'react';

// Bit adapted - https://www.w3schools.com/howto/howto_js_draggable.asp
const useDraggable = () => {
  const draggableElemRef = useRef<HTMLDivElement>();
  return useCallback((ref: HTMLDivElement | null) => {
    if (!ref) {
      return;
    }
    draggableElemRef.current = ref;
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    ref.onmousedown = dragMouseDown;

    function dragMouseDown(e: MouseEvent) {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
      e.preventDefault();
      if (!ref) {
        return;
      }
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      ref.style.top = ref.offsetTop - pos2 + 'px';
      ref.style.left = ref.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }, []);
};

export default useDraggable;
