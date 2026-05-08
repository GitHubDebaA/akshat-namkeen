"use client"
import { ReactNode } from "react";

type Step = {
    id: string;
    label: string;
    content: ReactNode;
};

type StepperProps = {
    steps: Step[];
    currentStep: number;
    onStepChange?: (step: number) => void;
};

export default function Stepper({ steps, currentStep, onStepChange }: StepperProps) {
    const progress = (currentStep / (steps.length - 1)) * 100;

    return (

        <div className="w-full max-w-5xl mx-auto">



            {/* Top Progress */}

            <div className="relative">

                <div className="h-[2px] bg-gray-200 w-full rounded-full" />

                <div

                    className="absolute top-0 left-0 h-[2px] bg-black transition-all duration-500"

                    style={{ width: `${progress}%` }}

                />

            </div>

            {/* Steps */}

            <div className="flex justify-between mt-4">

                {steps.map((step, index) => {

                    const isCompleted = index < currentStep;

                    const isActive = index === currentStep;

                    return (

                        <button

                            key={step.id}

                            onClick={() => onStepChange?.(index)}

                            className="flex flex-col items-center group"

                        >

                            {/* Dot */}

                            <div

                                className={`

                  w-4 h-4 rounded-full transition-all duration-300

                  ${isCompleted ? "bg-black scale-110" : ""}

                  ${isActive ? "bg-black scale-125 shadow-md" : ""}

                  ${!isCompleted && !isActive ? "bg-gray-300" : ""}

                `}

                            />

                            {/* Label */}

                            <span

                                className={`

                  mt-2 text-xs sm:text-sm transition-colors

                  ${isActive ? "text-black font-medium" : "text-gray-400"}

                  group-hover:text-black

                `}

                            >

                                {step.label}

                            </span>

                        </button>

                    );

                })}

            </div>

            {/* Content */}

            <div className="mt-8">

                <div

                    key={currentStep}

                    className="animate-[fadeIn_0.3s_ease]"

                >

                    {steps[currentStep]?.content}

                </div>

            </div>

        </div>

    );
}