import Link from "next/link";

const Home = () => {
  return (
    <div className="h-screen w-screen p-4 justify-center">
      <div className="flex mt-4">
        <img
          src="https://example.com/your-image.jpg"
          alt="Image"
          className="rounded-full object-cover bg-black"
          style={{ width: "80px", height: "80px" }}
        />
        <div className="flex flex-col ml-4">
          <span className="font-bold text-lg">Nama Outlet</span>
          <span className="text-blue-500 cursor-pointer">Edit Profile</span>
        </div>
      </div>

      {/* Carousel */}
      <div className="p-4 mx-auto">
        <div className="carousel w-full">
          <div id="item1" className="carousel-item w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
              className="w-full"
            />
          </div>
          <div id="item2" className="carousel-item w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
              className="w-full"
            />
          </div>
          <div id="item3" className="carousel-item w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
              className="w-full"
            />
          </div>
          <div id="item4" className="carousel-item w-full">
            <img src="/1.jpeg" className="w-full" />
          </div>
        </div>

        <div className="flex w-full justify-center gap-2 py-2">
          <a href="#item1" className="btn btn-xs">
            1
          </a>
          <a href="#item2" className="btn btn-xs">
            2
          </a>
          <a href="#item3" className="btn btn-xs">
            3
          </a>
          <a href="#item4" className="btn btn-xs">
            4
          </a>
        </div>
      </div>

      {/** */}
      <div className="p-4">
        <span> Status Pesanan</span>
        <div className="w-full p-2 bg-[#E4FBFF]">
          <Link href="/order" className="flex justify-end px-2">
            see detail
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox=" 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </Link>
          <div className="flex gap-6 justify-center">
            <div className="flex flex-col justify-center items-center bg-[#04A8C1] text-white text-xl md:w-40 md: h-40  sm:w-32 sm:h-32">
              <span>0</span>
              <span> Perlu Dikirim</span>
            </div>
            <div className="flex flex-col justify-center items-center bg-[#04A8C1] text-white text-xl md:w-40 md: h-40 sm:w-32 sm:h-32">
              <span>0</span>
              <span>Pembatalan </span>
            </div>
            <div className="flex flex-col justify-center items-center bg-[#04A8C1] text-white text-xl md:w-40 md: h-40 sm:w-32 sm:h-32">
              <span>0</span>
              <span>Pengembalian </span>
            </div>
          </div>
        </div>

        <br />
        <div className="w-full p-4 bg-[#E4FBFF]">
          <div className="flex gap-6 justify-center">
            <Link href="/product">
              <div className="flex flex-col justify-center items-center bg-[#04A8C1] text-white text-xl md:w-40 md: h-40  sm:w-32 sm:h-32">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-9"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>

                <span> Produk</span>
              </div>
            </Link>
            <Link href="/finance">
              <div className="flex flex-col justify-center items-center bg-[#04A8C1] text-white text-xl md:w-40 md: h-40  sm:w-32 sm:h-32">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-9"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                  />
                </svg>

                <span>Keuangan</span>
              </div>
            </Link>
            <Link href="/perform">
              <div className="flex flex-col justify-center items-center bg-[#04A8C1] text-white text-xl md:w-40 md: h-40 sm:w-32 sm:h-32">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-9"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                  />
                </svg>

                <span>Performa toko </span>
              </div>
            </Link>
            <Link href="/helpDesk">
              <div className="flex flex-col justify-center items-center bg-[#04A8C1] text-white text-xl md:w-40 md: h-40 sm:w-32 sm:h-32">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-9"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>

                <span>Bantuan</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
