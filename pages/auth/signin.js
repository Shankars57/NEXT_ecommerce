import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';

export default function SignIn({ providers }) {
  const router = useRouter();
  const { callbackUrl = '/' } = router.query;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to ShopStack</CardTitle>
          <CardDescription>Sign in to start shopping</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <Button
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  className="w-full"
                  size="lg"
                  data-testid="signin-button"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Sign in with {provider.name}
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}