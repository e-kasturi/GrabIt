import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><Link href="/order?status=waiting">Need to be sent</Link></li>
            <li><Link href="/order?status=sent">Sent</Link></li>
            <li><Link href="/order?status=done">Done</Link></li>
            <li><Link href="/order?status=canceled">Canceled</Link></li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl hidden lg:block">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/order?status=waiting">Waiting List</Link></li>
          <li><Link href="/order?status=sent">Sent</Link></li>
          <li><Link href="/order?status=done">Done</Link></li>
          <li><Link href="/order?status=canceled">Canceled</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn">Button</a>
      </div>
    </div>
  );
}
