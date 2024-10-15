import { FC } from "react";
import LogoImage from '../../public/logo.png';
import Image from "next/image";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 items-center justify-between">
      <div className="font-bold text-3xl flex items-center">
        <a href="#">
          <Image src={LogoImage} alt="logo image" className="hover:opacity-50 w-auto h-[60px]" />
        </a>
      </div>
    </div>
  );
};
