import * as React from 'react';

export function Logo({
  width = 24,
  height = 13,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 13"
      width={width}
      height={height}
    >
      <path
        d="M 12 10.706 L 12 0"
        fill="transparent"
        strokeWidth="0.77"
        stroke="#fafafa"
      />
      <path
        d="M 12 10.706 L 19.742 3.059"
        fill="transparent"
        strokeWidth="0.77"
        stroke="#fafafa"
      />
      <path
        d="M 12 10.706 L 23.226 9.559"
        fill="transparent"
        strokeWidth="0.77"
        stroke="#fafafa"
      />
      <path
        d="M 12 10.706 L 22.065 6.118"
        fill="transparent"
        strokeWidth="0.77"
        stroke="#fafafa"
      />
      <path
        d="M 12 10.706 L 16.258 0.765"
        fill="transparent"
        strokeWidth="0.77"
        stroke="#fafafa"
      />
      <path
        d="M 12 10.706 L 7.742 0.765"
        fill="transparent"
        strokeWidth="0.77"
        stroke="#fafafa"
      />
      <path
        d="M 12 10.706 L 4.258 3.059"
        fill="transparent"
        strokeWidth="0.77"
        stroke="#fafafa"
      />
      <path
        d="M 12 10.706 L 1.935 6.118"
        fill="transparent"
        strokeWidth="0.77"
        stroke="#fafafa"
      />
      <path
        d="M 12 10.706 L 0.774 9.559"
        fill="transparent"
        strokeWidth="0.77"
        stroke="#fafafa"
      />
      <path
        d="M 3.928 9.891 C 4.405 6.043 7.837 3.059 12 3.059 C 16.177 3.059 19.618 6.063 20.077 9.929"
        fill="transparent"
        strokeWidth="6.19"
        stroke="rgba(250, 250, 250, 0.5)"
      />
      <path
        d="M 12 9.941 C 12.641 9.941 13.161 10.455 13.161 11.088 C 13.161 11.722 12.641 12.235 12 12.235 C 11.359 12.235 10.839 11.722 10.839 11.088 C 10.839 10.455 11.359 9.941 12 9.941 Z"
        fill="rgb(255, 99, 71)"
      />
    </svg>
  );
}
