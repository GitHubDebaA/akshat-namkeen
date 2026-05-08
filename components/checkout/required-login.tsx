"use client";

export default function RequiredLogin() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">

            <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8">



                {/* Icon */}

                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">

                    <span className="text-xl">🔒</span>

                </div>

                {/* Title */}

                <h1 className="text-2xl font-semibold text-gray-900">

                    Sign in to continue

                </h1>

                {/* Subtitle */}

                <p className="mt-2 text-sm text-gray-500">

                    Please log in to proceed with your checkout and complete your order.

                </p>

                {/* CTA */}

                <button
                    className="mt-6 w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"

                >

                    Sign In

                </button>

                {/* Optional secondary action */}

                <button

                    onClick={() => window.location.href = "/"}

                    className="mt-3 w-full text-sm text-gray-500 hover:text-black transition"

                >

                    Continue Shopping

                </button>

            </div>

        </div>
    );
}