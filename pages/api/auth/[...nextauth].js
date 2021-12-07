import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token){
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body : refreshedToken } = await spotifyApi.refreshAccessToken();

        return{
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken, //if refresh token exists then use it otherwise default to token.refreshtoken
        }
    } catch (error) {
        console.error(error)
        return{
            ...token,
            error: 'RefreshAccessTokenError'}
    }
}


export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // 3 possible scenarios
            // 1. initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000 //handled in milliseconds
                }
            }
            // 2. Return previous token if access token not expired
            if(Date.now() < token.accessTokenExpires){
                console.log("existing token valid");
                return token;
            }

            // 3. Access token expired, need to refresh it
            return await refreshAccessToken(token)
        },
        async session({ session, token }) {
            // Session is what user can see
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session
        }
    }
})

