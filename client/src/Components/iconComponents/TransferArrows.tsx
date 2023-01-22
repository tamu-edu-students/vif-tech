import * as React from "react";
import { SVGProps } from "react";

const SvgTransferArrows = (props: SVGProps<SVGSVGElement>) => (
  <svg
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    {...props}
  >
    <path
      d="M64.68 51.52V32.83H0V18.69h64.68V0L100 25.76 64.68 51.52Zm34.83 15.83H35.2v-18.6L0 74.37 35.2 100V81.4h64.31V67.35Z"
      data-name="Layer 1"
    />
  </svg>
);
export default SvgTransferArrows;
