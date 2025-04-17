import AuthGuard from './AuthGuard';

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
