import classNames from "classnames";
import React from "react";
import AvatarIcon from "./AvatarIcon";
import AvatarImage from "./AvatarImage";

export type AvatarProps = {
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  image?: string;
  description?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const avatarSizeMap = {
  xs: "w-5 h-5 text-2xs",
  sm: "w-6 h-6 text-sm",
  md: "w-8 h-8 text-xl",
  lg: "w-9 h-9 text-2xl",
};

function Inicials(name: string) {
  const nome = name;
  if (!!nome) {
    const array = nome.split(" ");
    const primeiraLetra = nome.charAt(0);
    const posicaoUltimoEspaco = nome.lastIndexOf(" ");
    const primeiraLetraUltimoNome = nome.substring(
      posicaoUltimoEspaco + 1,
      posicaoUltimoEspaco + 2,
    );

    if (array.length > 1) {
      return `${(primeiraLetra + primeiraLetraUltimoNome).toUpperCase()}`;
    } else {
      return `${primeiraLetra.toUpperCase()}`;
    }
  }
}

const Avatar: React.FC<AvatarProps> = ({
  name = "",
  size = "xs",
  className,
  image,
  description = "",
  ...rest
}) => {
  // const Avatar = ({
  //   name = "",
  //   size = "xs",
  //   className,
  //   image,
  //   description = "",
  //   ...rest
  // }: AvatarProps) => {
  const avatarSizeClass = avatarSizeMap[size];

  const avatarComponent = image ? (
    <AvatarImage src={image} altDescription={description} />
  ) : !!name ? (
    <span
      className={classNames(
        `flex items-center justify-center`,
        avatarSizeClass,
      )}
    >
      {Inicials(name)}
    </span>
  ) : (
    <AvatarIcon />
  );

  return (
    <div
      className={classNames(
        `relative rounded-full bg-surface-muted flex items-center justify-center text-content-muted`,
        avatarSizeClass,
        className,
      )}
      {...rest}
    >
      {avatarComponent}
    </div>
  );
};

export default Avatar;

