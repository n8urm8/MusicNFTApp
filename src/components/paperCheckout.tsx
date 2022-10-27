import { LoginWithPaper, PaperSDKProvider } from "@paperxyz/react-client-sdk";

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
  };
  // Ensure that you have a PaperSDKProvider set-up with the proper chain name and client Id.
  return (
    <PaperSDKProvider clientId="Your_client_id_here" chainName="Polygon">
      <LoginWithPaper onSuccess={onSuccessLogin} />
    </PaperSDKProvider>
  )
}