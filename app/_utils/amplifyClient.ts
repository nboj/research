"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

// guard so Next fast refresh doesn’t re-configure
let configured = false;
export function configureAmplifyClient() {
  if (!configured) {
    Amplify.configure(outputs);
    configured = true;
  }
}
