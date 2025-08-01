"use client";

import { WhatIfSimulator } from "./what-if-simulator";

export default function WhatIfSimulatorPage() {
  return (
      <div className="animate-in fade-in-0 duration-500">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            What-If Simulator
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore life's biggest financial questions. Use the sliders to adjust your financial parameters and see real-time projections for your goals. Turn "what if" into "what's
            next."
          </p>
        </div>
        <WhatIfSimulator />
      </div>
  );
}
