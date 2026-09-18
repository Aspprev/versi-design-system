import React from "react";

export type AvatarImageProps = {
  src: string;
  altDescription: string | "";
};

const AvatarImage = ({ src, altDescription }: AvatarImageProps) => {
  return (
    <img
      src={src}
      alt={altDescription}
      className="rounded-full object-cover"
    />
  );
};

export default AvatarImage;

