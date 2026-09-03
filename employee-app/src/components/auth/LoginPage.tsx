import BrandHeader from "./BrandHeader";
import LoginForm from "./LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(#b3dd87,transparent)] text-[#191c1d]">
      <BrandHeader />
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-8 py-16 sm:px-6 sm:py-24">
        <div className="w-full max-w-[448px]">
          <div className="mb-10">
            <h1 className="font-[Manrope,Inter,sans-serif] text-[28px] font-semibold leading-[34px]">
              Welcome Back
            </h1>
            <p className="mt-2 text-base leading-6 text-[#625e58]">
              Sign in to manage your attendance
            </p>
          </div>
          <LoginForm />
          <footer className="mt-10 border-t border-[rgba(194,201,181,0.3)] pt-10 text-center text-sm text-[#625e58]">
            © 2026 iOneSoft Solutions
          </footer>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
