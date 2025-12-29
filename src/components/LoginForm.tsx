import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleSignIn } from '@/components/GoogleSignIn';
import { EmailPasswordSignin } from './EmailPasswordSignin';

export function LoginForm() {
  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>
            Login or Register with Google Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <GoogleSignIn />
            {/* </div> */}
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <EmailPasswordSignin />
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <a
                href="/registerwithpassword"
                className="underline underline-offset-4"
              >
                Sign up
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="pt-3 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our{' '}
        <a href="/termsofservice">Terms of Service</a> and{' '}
        <a href="/privacypolicy">Privacy Policy</a>.
      </div>
    </div>
  );
}
