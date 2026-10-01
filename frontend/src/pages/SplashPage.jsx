import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

function SplashPage() {
  return (
    <div>
      <h1>Frame</h1>
      <p>Where your art finds its frame.</p>
      <LoginForm />
      <SignupForm />
    </div>
  );
}

export default SplashPage;