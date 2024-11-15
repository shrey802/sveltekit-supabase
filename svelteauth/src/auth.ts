import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET } from "$env/static/private"
export const { handle } = SvelteKitAuth({
  providers: [
    GitHub({clientId: AUTH_GITHUB_ID, clientSecret: AUTH_GITHUB_SECRET})
  ],
  callbacks: {
     // JWT get sent to server?
     async jwt({ token, account }: { token: any, account: any }) {
        if(account) {
            token.accessToken = account.access_token
        }
        return token
    },
    async session({ session, token, user }: { session: any, token: any, user: any }) {
        //@ts-ignore
        session.access_token = token.accessToken
        return session
    }
    // JWT change -> session
  }
}) 