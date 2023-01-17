import * as React from "react";
import { SVGProps } from "react";

const SvgDropdownArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 12" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 11.609.742.359h22.516L12 11.609Z" />
  </svg>
);

export default SvgDropdownArrow;
