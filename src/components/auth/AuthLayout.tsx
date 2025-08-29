import React, { useState } from 'react';
import { Eye, EyeOff, Store, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const AuthLayout: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: ''
  });

  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        if (isEmployeeLogin) {
          success = await login(formData.email, formData.password, formData.username);
        } else {
          success = await login(formData.email, formData.password);
        }
      } else {
        success = await register(formData.email, formData.password, formData.name);
      }

      if (success) {
        toast({
          title: "Success!",
          description: isLogin ? "Welcome back!" : "Account created successfully!"
        });
      } else {
        toast({
          title: "Error",
          description: isLogin ? "Invalid credentials" : "Account already exists",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-glow mb-4">
            <img 
              src="/lovable-uploads/047f64ca-2cda-4a19-964a-13f5ac9d17ed.png" 
              alt="Beom Optic Logo" 
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Beom Optic</h1>
          <p className="text-muted-foreground">Professional optician management</p>
        </div>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="space-y-1">
            <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                  <CardDescription className="text-center">
                    Choose your account type to continue
                  </CardDescription>
                </div>
                
                <Tabs value={isEmployeeLogin ? "employee" : "owner"} onValueChange={(value) => setIsEmployeeLogin(value === "employee")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="owner">Owner</TabsTrigger>
                    <TabsTrigger value="employee">Employee</TabsTrigger>
                  </TabsList>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-center">Create account</CardTitle>
                  <CardDescription className="text-center">
                    Start managing your optical business
                  </CardDescription>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              {isLogin && isEmployeeLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  {isLogin && isEmployeeLogin ? "Owner Email" : "Email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isLogin && isEmployeeLogin ? "owner@example.com" : "your@example.com"}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};