import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ListTodo, Smile } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, userLoggedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        description: "Logged out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:" + error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 mb-4">
      <div className="flex items-center space-x-2">
        <ListTodo className="w-8 h-8 text-purple-900" />
        <h1 className="text-xl font-semibold  text-purple-900">TaskBuddy</h1>
      </div>
      {userLoggedIn && currentUser && (
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  style={{ objectFit: "cover" }}
                  src={currentUser?.photoURL || ""}
                />
                <AvatarFallback>
                  <Smile />
                </AvatarFallback>
              </Avatar>
              <h4>{currentUser?.displayName}</h4>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
