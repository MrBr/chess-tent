import React from 'react';

const Comment = (props: { active: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.25 0H1.75C0.784766 0 0 0.784766 0 1.75V9.625C0 10.5902 0.784766 11.375 1.75 11.375H4.375V13.6719C4.375 13.866 4.53359 14 4.70312 14C4.76875 14 4.83711 13.9809 4.89727 13.9344L8.3125 11.375H12.25C13.2152 11.375 14 10.5902 14 9.625V1.75C14 0.784766 13.2152 0 12.25 0ZM12.6875 9.625C12.6875 9.86563 12.4906 10.0625 12.25 10.0625H7.875L7.525 10.325L5.6875 11.7031V10.0625H1.75C1.50937 10.0625 1.3125 9.86563 1.3125 9.625V1.75C1.3125 1.50937 1.50937 1.3125 1.75 1.3125H12.25C12.4906 1.3125 12.6875 1.50937 12.6875 1.75V9.625Z"
      fill={props.active ? '#FFFFFF' : '#747A86'}
    />
  </svg>
);

export default Comment;
