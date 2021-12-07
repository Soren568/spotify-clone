import {getProviders, signIn} from 'next-auth/react'
// get providers through props from async function below
function Login({providers}) {
    return (
        <div className="flex flex-col bg-black min-h-screen w-full justify-center items-center">
            {/* Iterates through values of providers prop */}
            {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button onClick={() => signIn(provider.id, {callbackUrl: '/'})} className="bg-[#18D860] text-white rounded-full px-8 py-4">Login with {provider.name}</button>
                </div>
            ))}
        </div>
    )
}

export default Login

// SERVER SIDE RENDER - NEXT12
export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers
        }
    }
}

