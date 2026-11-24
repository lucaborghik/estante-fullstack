
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${window.location.origin}/api/auth`,
  plugins: [
    inferAdditionalFields<{
      user: {
        additionalFields: {
          role: {
            type: "string";
            required: false;
            defaultValue: "user";
            input: false;
          };
        };
      };
    }>()
  ]
});
