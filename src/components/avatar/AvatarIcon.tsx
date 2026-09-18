import React from "react";
import { MdOutlinePersonOutline } from "react-icons/md";
export type AvatarIconProps = {
  name?: string;
};

const AvatarIcon = () => {
  return <MdOutlinePersonOutline className="absolute w-1/2 h-1/2" />;
};

export default AvatarIcon;

