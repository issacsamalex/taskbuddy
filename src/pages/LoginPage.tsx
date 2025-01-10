import previewImage from "../assets/images/Task list view 3.png";
import { ListTodo, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import googleicon from "../assets/icons/google.png";
import { signInWithGoogle } from "@/firebase/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await signInWithGoogle();
      toast({
        description: `Welcome, ${res?.user.displayName}`,
      });
      navigate("/taskdashboard");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Login failed" + error);
    }
  };

  return loading ? (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <Loader className="h-8 w-8 animate-spin z-50 text-purple-500" />
      </div>
    </>
  ) : (
    <div className="flex min-h-screen bg-pink-50 relative overflow-x-clip">
      <div className="lg:flex-1 flex flex-col justify-center items-center lg:items-start lg:p-8 mx-auto lg:ml-20">
        <div className="flex items-center space-x-2 mb-4">
          <ListTodo className="w-10 h-10 text-purple-900" />
          <h6 className="text-3xl font-bold text-purple-900">TaskBuddy</h6>
        </div>
        <p className="text-xs mb-8 text-start">
          Streamline your workflow and track progress effortlessly
          <br />
          with our all-in-one task management app.
        </p>
        <Button onClick={handleSignIn} className="w-96 h-16 rounded-2xl">
          <img src={googleicon} className="h-6 w-6" />
          <span className="text-xl font-medium">Continue with Google</span>
        </Button>
      </div>
      <div className="relative lg:flex-1 flex items-center z-10">
        <img src={previewImage} alt="Preview" className="absolute right-0" />
      </div>

      <div className="circlering flex justify-center items-center absolute top-1/2 -right-14 w-[800px] h-[800px] border-[0.73px] border-purple-600 rounded-full -translate-y-1/2 opacity-50">
        <div className="flex justify-center items-center w-[700px] h-[700px] border-[0.73px] border-purple-600 rounded-full opacity-50">
          <div className="w-[560px] h-[560px] border-[0.73px] border-purple-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
