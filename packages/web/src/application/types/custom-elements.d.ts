declare namespace JSX {
  interface IntrinsicElements {
    'cg-board': Partial<T & DOMAttributes<T> & { children: any }>;
    piece: Partial<T & DOMAttributes<T> & { children: any }>;
  }
}
