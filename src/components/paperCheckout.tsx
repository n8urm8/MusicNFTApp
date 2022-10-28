import { PaperSDKProvider } from "@paperxyz/react-client-sdk";

export function LoginComponent() {
  const onSuccessLogin = async (code: string) => {
    // code is the temporary access code that you can swap for a permenant user access token on your backend
    const resp = await fetch("/api/get-user-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
      }),
    });
    if (resp.status !== 200) {
      console.log("resp", resp);
      throw new Error("Failed to get user token");
    }
    const { userToken } = await resp.json();
    console.log('user token', userToken)
    return userToken
  };
  // Ensure that you have a PaperSDKProvider set-up with the proper chain name and client Id.
  return (
    <PaperSDKProvider clientId="5b224302-b031-4f54-847a-cc4a97f6e9e6" chainName="Mumbai">
      {/* <LoginWithPaper onSuccess={onSuccessLogin} /> */}
    </PaperSDKProvider>
  )
}