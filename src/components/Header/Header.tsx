import React from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <div className="header p-8 px-4 flex items-center justify-between gap-2 bg-white rounded-b-[13px] max-w-full mx-auto">
      <img alt="Логотип" src={logo} className="h-[60px]" />
      <h1 className="text-2xl font-bold text-center text-black flex-1">
        Финансовый учёт
      </h1>
      <Link
        to={"/tg_bot_add/invoice"}
        className="bg-yellow-400 text-black font-bold p-3 rounded-[8px]  hover:bg-yellow-300 captialize-first-letter"
      >
        счет
      </Link>
    </div>
  );
};

export default Header;
