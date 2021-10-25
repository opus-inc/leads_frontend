import dynamic from "next/dynamic";

export default dynamic(() => import("material-ui-phone-number"), {
  ssr: false,
});
