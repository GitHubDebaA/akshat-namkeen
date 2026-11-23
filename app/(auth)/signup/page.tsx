import Logo from "@/components/Logo";
import SignUp from "@/components/account/signup/signup";

export default function SignupPage() {
    return (
        <main className="flex min-h-screen w-full">
            <section className="hidden w-1/2 flex-col justify-center bg-gradient-to-br from-red-900 to-red-400 px-16 text-white md:flex">
                <h1 className="text-4xl font-semibold leading-tight">Join Akshat Namkeen</h1>
                <p className="mt-6 text-lg text-gray-200">
                    Create your account to explore authentic namkeen, snacks, and exclusive offers tailored just for you.
                </p>
            </section>
            <section className="flex w-full items-center justify-center bg-gray-50 px-4 py-8 md:w-1/2 md:px-10">
                <div className="w-full max-w-md">
                    <Logo />
                    <div className="mt-4 rounded-2xl bg-white shadow-sm">
                        <SignUp />
                    </div>
                </div>
            </section>
        </main>
    );
}
