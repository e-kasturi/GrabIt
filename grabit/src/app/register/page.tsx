const Register = () => {
  return (
    <div className="font-[sans-serif] bg-[#E4FBFF]  md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        {/* Left Image Section */}
        <div className="p-4 bg-gray-50 h-full hidden lg:block">
          <img
            src="https://readymadeui.com/signin-image.webp"
            className="max-w-[80%] w-full h-full aspect-square object-contain block mx-auto"
            alt="login-image"
          />
        </div>

        {/* Right Form Section */}
        <div className="flex items-center p-6 h-full w-full">
          <form className="max-w-lg w-full mx-auto">
            <div className="mb-8">
              <h3 className="text-[#223537] text-2xl font-bold text-center">
                Register You're Accoount
              </h3>
            </div>
            <div className="space-y-4">
              {/* Outlet Name and Full Name Fields */}
              <div className="flex w-full gap-4">
                <div className="flex-1">
                  <label className="text-gray-800 text-sm mb-2 block">
                    Outlet Name
                  </label>
                  <input
                    name="outletName"
                    type="text"
                    required
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter outlet name"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-800 text-sm mb-2 block">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              {/* Email and Password Fields */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  required
                  className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter address"
                />
              </div>
            </div>

            {/* Center the Button */}
            <div className="flex justify-center mt-8">
              <button
                type="button"
                className="w-80 py-2.5 px-4 text-sm tracking-wider rounded-md bg-[#04A8C1] hover:bg-[#00869A] text-white focus:outline-none"
              >
                Create Account
              </button>
            </div>

            {/* Center the Text */}
            <p className="text-gray-800 text-sm mt-4 text-center">
              Already have an account?{" "}
              <a
                href="javascript:void(0);"
                className="text-[#04A8C1] font-semibold hover:underline ml-1"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
