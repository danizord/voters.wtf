import Link from "next/link";

export function Header() {
  return (
    <>
      <div className="container mx-auto flex items-center justify-between gap-2 p-2 pl-1 md:gap-3 md:p-3">
        <Link href={'/'} className="min-w-fit">
          <Logo />
        </Link>
        {/* <SearchBar /> */}
        {/* <UserButton /> */}
      </div>

      <div className="border-b"></div>
    </>
  )
}

function Logo() {
  return (
    <div className="flex min-w-fit items-center">
      <img
        className="h-14 md:h-16"
        src={"https://prop.house/bulb.png"}
        alt="Prop House"
      />
      <p className="hidden px-2 text-xl md:block">
        <span className="">Prop House</span>
        <span className="mx-1">|</span>
        <span className=" font-bold">voters.wtf</span>
      </p>
    </div>
  );
}

const SearchBar = () => {
  return (
    <div className="relative w-full transition-all duration-500 focus-within:max-w-full md:max-w-2xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-violet-700">
        <svg
          className="absolute h-5 w-5 "
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>

      <input
        type="text"
        placeholder="Search"
        className="input-ghost input input-md block w-full bg-violet-50 pl-10 ring-purple-700 md:input-lg placeholder:text-violet-700 md:pl-10"
      />
    </div>
  );
};

const UserButton = () => {
  return (
    <div className="btn-primary btn gap-2 py-1 px-2 md:px-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>

      <span className="hidden md:block">Connect</span>
    </div>
  );
};
