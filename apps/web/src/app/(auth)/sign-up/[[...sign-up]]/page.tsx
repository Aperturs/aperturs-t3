import { SignUp } from "@clerk/nextjs";

const Signup = () => {
  return (
    <div className="h-screen md:flex">
      <div className="i relative hidden w-1/2 items-center justify-around overflow-hidden bg-gradient-to-tr from-blue-800 to-purple-700 md:flex">
        <div>
          <h1 className="font-sans text-4xl font-bold text-white">Aperturs</h1>
          <p className="mt-1 text-white">
            One Stop Social Media Management Software
          </p>
          {/* <button
            type="submit"
            onClick={() => {
              window.location.href = "/";
            }}
            className="mb-2 mt-4 block w-28 rounded-2xl bg-white py-2 font-bold text-indigo-800"
          >
            Read More
          </button> */}
        </div>
        <div className="absolute -bottom-32 -left-40 h-80 w-80 rounded-full border-4 border-t-8 border-opacity-30"></div>
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full border-4 border-t-8 border-opacity-30"></div>
        <div className="absolute -right-0 -top-40 h-80 w-80 rounded-full border-4 border-t-8 border-opacity-30"></div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-4 border-t-8 border-opacity-30"></div>
      </div>
      <div className="flex items-center justify-center  px-8 py-10 md:w-1/2">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sing-in"
          afterSignUpUrl="/onboarding"
          redirectUrl="/onboarding"
        />
      </div>
    </div>
  );
};

export default Signup;
