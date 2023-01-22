import * as React from "react";
import { SVGProps } from "react";

const SvgPlusSign = (props: SVGProps<SVGSVGElement>) => (
  <svg
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    {...props}
  >
    <g data-name="Layer 1">
      <path
        data-name="+"
        d="M100 61.11H61.61V100H38.4V61.11H0V38.89h38.39V0H61.6v38.89h38.39v22.22Z"
      />
    </g>
  </svg>
);
export default SvgPlusSign;
