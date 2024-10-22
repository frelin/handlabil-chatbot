import { FC } from "react";
import LogoImage from '../../public/logo.png';
import Image from "next/image";

export const Navbar: FC = () => {
  return (
    <div className="fixed w-full z-10 bg-white flex h-[3.75rem] border-b border-neutral-300 py-2 items-center justify-between">
      <div className="font-bold text-3xl flex items-center">
        <a href="#">
          <Image src={LogoImage} alt="logo image" className="hover:opacity-50 w-auto h-[3.75rem]" />
        </a>
      </div>
    </div>
  );
};
