import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Wallet, 
  ChevronRight, 
  Award, 
  CheckCircle,
  PiggyBank,
  ArrowRight,
  ShoppingBag,
  Clock,
  Sparkles,
  LogOut,
  Mail,
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  FileText,
  Settings,
  CreditCard,
  Banknote,
  History,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateSavingPlanAdvice, getCelebrationMessage } from './services/geminiService';
import { Goal, Transaction, UserState, ViewState, Frequency } from './types';
import { Button, Card, ProgressBar, Input, Select } from './components/UI';

// --- Constants & Mock Data ---

const FEATURED_PRODUCTS = [
  { id: 'p1', name: 'Yamaha R15 V4', price: 182000, category: 'Vehicle', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80' },
  { id: 'p2', name: 'MacBook Pro M3', price: 169900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=400&q=80' },
  { id: 'p3', name: 'Sony Bravia 65"', price: 85000, category: 'Home', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80' },
  { id: 'p4', name: 'Dream Vacation', price: 250000, category: 'Travel', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80' },
  { id: 'p5', name: 'Honda CBR', price: 210000, category: 'Vehicle', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80' },
  { id: 'p6', name: 'iPhone 15 Pro', price: 134900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80' },
];

const PARTNER_STORES = [
  { id: 'amazon', name: 'Amazon', domain: 'amazon.in' },
  { id: 'flipkart', name: 'Flipkart', domain: 'flipkart.com' },
  { id: 'ajio', name: 'Ajio', domain: 'ajio.com' },
  { id: 'tataluxury', name: 'Tata Luxury', domain: 'tataluxury.com' },
  { id: 'kapoorwatch', name: 'Kapoor Watch', domain: 'kapoorwatch.com' },
  { id: 'reliancedigital', name: 'Reliance Digital', domain: 'reliancedigital.in' },
  { id: 'shoppersstop', name: 'Shoppers Stop', domain: 'shoppersstop.com' },
  { id: 'goodearth', name: 'Good Earth', domain: 'goodearth.in' },
];

// --- Confetti Component ---

const Confetti: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const particles: any[] = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        swing: Math.random() * 0.2,
        swingCounter: Math.random() * Math.PI * 2
      });
    }

    let animationId: number;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.swingCounter += p.swing;
        p.x += Math.sin(p.swingCounter) + p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[100]" 
    />
  );
};

// --- Auth Component ---

const AuthScreen: React.FC<{ onLogin: (name: string, email: string) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      onLogin(name || "Admin", email || "admin@example.com");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Decoration - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 relative overflow-hidden flex-col justify-between p-16 text-white">
        <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad)" />
            </svg>
        </div>
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <TrendingUp className="text-white w-7 h-7" />
              </div>
              <span className="text-3xl font-bold tracking-tight">Setby</span>
           </div>
           <h1 className="text-6xl font-bold leading-tight mb-8">Turn your dreams into reality.</h1>
           <p className="text-brand-200 text-xl max-w-md leading-relaxed">
             Join thousands of smart savers who are buying their dream bikes, gadgets, and vacations debt-free with our installment plans.
           </p>
        </div>
        <div className="text-brand-300/60 text-sm relative z-10">
          © {new Date().getFullYear()} Setby Inc. Secure & Encrypted.
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right-8 duration-500">
          
          {/* Mobile Logo Display */}
          <div className="lg:hidden flex justify-center mb-6">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
                  <TrendingUp className="text-white w-7 h-7" />
                </div>
                <span className="text-3xl font-bold text-slate-800 tracking-tight">Setby</span>
             </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p className="text-slate-500">
              {isLogin ? 'Enter your details to access your savings dashboard.' : 'Start your savings journey today in less than 2 minutes.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
             {!isLogin && (
               <div className="relative">
                 <User className="absolute left-3 top-9 w-5 h-5 text-slate-400 pointer-events-none" />
                 <Input 
                    label="Full Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Admin" 
                    className="pl-10"
                    required 
                 />
               </div>
             )}
             
             <div className="relative">
                <Mail className="absolute left-3 top-9 w-5 h-5 text-slate-400 pointer-events-none" />
                <Input 
                  label="Email Address" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  className="pl-10"
                  required 
                />
             </div>

             <div className="relative">
                <Lock className="absolute left-3 top-9 w-5 h-5 text-slate-400 pointer-events-none" />
                <Input 
                  label="Password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="pl-10"
                  required 
                />
             </div>

             <Button type="submit" className="w-full py-3 text-lg shadow-brand-500/25" disabled={loading}>
               {loading ? (
                 <span className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Processing...
                 </span>
               ) : (
                 isLogin ? 'Sign In' : 'Create Account'
               )}
             </Button>
          </form>

          <div className="text-center">
            <p className="text-slate-500 mb-4 text-sm">Or continue with</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
               <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Google
               </button>
               <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                 <img src="https://www.svgrepo.com/show/475647/apple-color.svg" alt="Apple" className="w-5 h-5" /> Apple
               </button>
            </div>

            <div className="text-sm text-slate-500 pt-4 border-t border-slate-100">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)} 
                className="font-bold text-brand-600 hover:text-brand-500 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Profile Component ---

const CustomerProfile: React.FC<{ 
  user: UserState; 
  onUpdateUser: (updates: Partial<UserState>) => void;
  onBack: () => void;
}> = ({ user, onUpdateUser, onBack }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'kyc' | 'rewards' | 'notifications'>('details');
  const [kycLoading, setKycLoading] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || "+91 98765 43210",
    address: user.address || "123 Savings Lane, Finance City, Mumbai"
  });

  const handleStartEdit = () => {
    setFormData({
        name: user.name,
        phone: user.phone || "+91 98765 43210",
        address: user.address || "123 Savings Lane, Finance City, Mumbai"
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateUser({
        name: formData.name,
        phone: formData.phone,
        address: formData.address
    });
    setIsEditing(false);
  };

  // Mock data for the chart based on current points
  const pointsChartData = [
    { name: 'May', points: Math.floor(user.points * 0.2) },
    { name: 'Jun', points: Math.floor(user.points * 0.4) },
    { name: 'Jul', points: Math.floor(user.points * 0.6) },
    { name: 'Aug', points: Math.floor(user.points * 0.8) },
    { name: 'Sep', points: user.points },
  ];

  const handleKycSubmit = () => {
    setKycLoading(true);
    setTimeout(() => {
      onUpdateUser({ kycStatus: 'pending' });
      setKycLoading(false);
      // Simulate backend approval
      setTimeout(() => {
        onUpdateUser({ kycStatus: 'verified' });
      }, 5000);
    }, 1500);
  };

  const toggleNotification = (key: 'paymentReminders' | 'goalMilestones') => {
    const currentSettings = user.notifications || { paymentReminders: true, goalMilestones: true };
    onUpdateUser({
        notifications: {
            ...currentSettings,
            [key]: !currentSettings[key]
        }
    });
  };

  const KycStatusBadge = ({ status }: { status: UserState['kycStatus'] }) => {
    switch (status) {
      case 'verified':
        return <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"><ShieldCheck className="w-4 h-4" /> Verified</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium"><Clock className="w-4 h-4" /> Pending Review</span>;
      default:
        return <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium"><AlertCircle className="w-4 h-4" /> Unverified</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div>
          <Button variant="outline" onClick={onBack} className="mb-4 text-sm">
            ← Back to Dashboard
          </Button>
       </div>
       <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-3xl font-bold text-brand-600 border-4 border-white shadow-lg overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff&size=200`} alt={user.name} />
            </div>
            <div className="absolute bottom-0 right-0">
               {user.kycStatus === 'verified' && <div className="bg-emerald-500 text-white p-1 rounded-full border-2 border-white"><CheckCircle className="w-4 h-4" /></div>}
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
             <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
             <p className="text-slate-500 mb-2">{user.email}</p>
             <div className="flex flex-wrap justify-center md:justify-start gap-2">
               <KycStatusBadge status={user.kycStatus} />
               <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"><Award className="w-4 h-4" /> {user.points} Points</span>
             </div>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-sm text-slate-400">Member Since</p>
             <p className="font-semibold text-slate-700">{new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('details')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'details' ? 'bg-white shadow-sm text-brand-600 border border-brand-100' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <User className="w-5 h-5" /> Personal Details
            </button>
            <button 
              onClick={() => setActiveTab('kyc')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'kyc' ? 'bg-white shadow-sm text-brand-600 border border-brand-100' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FileText className="w-5 h-5" /> KYC Documents
            </button>
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'rewards' ? 'bg-white shadow-sm text-brand-600 border border-brand-100' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Award className="w-5 h-5" /> Rewards & Points
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'notifications' ? 'bg-white shadow-sm text-brand-600 border border-brand-100' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Bell className="w-5 h-5" /> Notifications
            </button>
          </div>

          <div className="md:col-span-3">
             {activeTab === 'details' && (
               <Card>
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
                   {isEditing ? (
                     <div className="flex gap-2">
                       <Button variant="outline" className="text-xs h-8" onClick={() => setIsEditing(false)}>Cancel</Button>
                       <Button variant="primary" className="text-xs h-8" onClick={handleSave}>Save</Button>
                     </div>
                   ) : (
                     <Button variant="outline" className="text-xs h-8" onClick={handleStartEdit}>Edit</Button>
                   )}
                 </div>
                 
                 {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="Full Name" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                        <Input 
                            label="Email Address" 
                            value={user.email} 
                            disabled
                            className="bg-slate-50 text-slate-400"
                        />
                        <Input 
                            label="Phone Number" 
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                        <Input 
                            label="Address" 
                            value={formData.address} 
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                        <label className="text-sm font-medium text-slate-500 block mb-1">Full Name</label>
                        <p className="text-slate-800 font-medium">{user.name}</p>
                        </div>
                        <div>
                        <label className="text-sm font-medium text-slate-500 block mb-1">Email Address</label>
                        <p className="text-slate-800 font-medium">{user.email}</p>
                        </div>
                        <div>
                        <label className="text-sm font-medium text-slate-500 block mb-1">Phone Number</label>
                        <p className="text-slate-800 font-medium">{user.phone || "+91 98765 43210"}</p>
                        </div>
                        <div>
                        <label className="text-sm font-medium text-slate-500 block mb-1">Address</label>
                        <p className="text-slate-800 font-medium">{user.address || "123 Savings Lane, Finance City, Mumbai"}</p>
                        </div>
                    </div>
                 )}
               </Card>
             )}

             {activeTab === 'kyc' && (
                <Card>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Know Your Customer (KYC)</h3>
                  <p className="text-slate-500 mb-6">Verification is required to withdraw savings and redeem high-value rewards.</p>

                  {user.kycStatus === 'verified' ? (
                     <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <ShieldCheck className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h4 className="text-xl font-bold text-emerald-800 mb-2">You are fully verified!</h4>
                        <p className="text-emerald-700">Your identity has been confirmed. You have full access to all features.</p>
                     </div>
                  ) : user.kycStatus === 'pending' ? (
                     <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                           <Clock className="w-8 h-8 text-amber-600" />
                        </div>
                        <h4 className="text-xl font-bold text-amber-800 mb-2">Verification in Progress</h4>
                        <p className="text-amber-700">Our team is reviewing your documents. This usually takes 24-48 hours.</p>
                     </div>
                  ) : (
                     <div className="space-y-6">
                        <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex flex-col items-center justify-center py-10">
                           <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                              <CreditCard className="w-6 h-6 text-slate-400" />
                           </div>
                           <p className="font-medium text-slate-700">Upload Aadhaar / PAN Card</p>
                           <p className="text-xs text-slate-400 mt-1">PNG, JPG or PDF up to 5MB</p>
                        </div>
                        <Button onClick={handleKycSubmit} className="w-full" disabled={kycLoading}>
                           {kycLoading ? 'Submitting...' : 'Submit Documents for Verification'}
                        </Button>
                     </div>
                  )}
                </Card>
             )}

             {activeTab === 'rewards' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
                         <div className="flex items-start justify-between">
                            <div>
                               <p className="text-amber-100 font-medium mb-1">Total Points</p>
                               <h3 className="text-4xl font-bold">{user.points}</h3>
                            </div>
                            <Award className="w-8 h-8 text-white/50" />
                         </div>
                         <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-sm font-medium">Value: ~₹{(user.points * 0.5).toFixed(2)}</p>
                         </div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                         <div>
                            <p className="text-slate-500 font-medium mb-1">Status Level</p>
                            <h3 className="text-2xl font-bold text-slate-800">Silver Member</h3>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                             <div className="bg-brand-500 h-2 rounded-full" style={{width: '60%'}}></div>
                         </div>
                         <p className="text-xs text-slate-400 mt-2">400 more points to Gold</p>
                      </div>
                   </div>

                   <Card>
                     <h3 className="font-bold text-slate-800 mb-4">Points Growth</h3>
                     <div className="h-64 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={pointsChartData}>
                           <defs>
                             <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                           <Tooltip 
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                           />
                           <Area type="monotone" dataKey="points" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPoints)" />
                         </AreaChart>
                       </ResponsiveContainer>
                     </div>
                   </Card>

                   <Card>
                      <h3 className="font-bold text-slate-800 mb-4">Points History</h3>
                      <div className="space-y-4">
                         {[1,2,3].map(i => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                     <ArrowRight className="w-4 h-4 rotate-45" />
                                  </div>
                                  <div>
                                     <p className="font-medium text-slate-800">Monthly Installment Bonus</p>
                                     <p className="text-xs text-slate-400">Oct {10 + i}, 2023</p>
                                  </div>
                                </div>
                               <span className="font-bold text-emerald-600">+50 pts</span>
                            </div>
                         ))}
                      </div>
                   </Card>
                </div>
             )}

             {activeTab === 'notifications' && (
               <Card>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-4">
                              <div className="p-2 bg-white rounded-full border border-slate-200 text-brand-600">
                                  <Clock className="w-5 h-5" />
                              </div>
                              <div>
                                  <p className="font-medium text-slate-800">Payment Reminders</p>
                                  <p className="text-sm text-slate-500">Get notified before your installment is due.</p>
                              </div>
                          </div>
                          <button 
                            onClick={() => toggleNotification('paymentReminders')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${user.notifications?.paymentReminders ? 'bg-brand-600' : 'bg-slate-300'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.notifications?.paymentReminders ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-4">
                              <div className="p-2 bg-white rounded-full border border-slate-200 text-emerald-600">
                                  <Target className="w-5 h-5" />
                              </div>
                              <div>
                                  <p className="font-medium text-slate-800">Goal Milestones</p>
                                  <p className="text-sm text-slate-500">Celebrate when you reach savings targets.</p>
                              </div>
                          </div>
                          <button 
                            onClick={() => toggleNotification('goalMilestones')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${user.notifications?.goalMilestones ? 'bg-brand-600' : 'bg-slate-300'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.notifications?.goalMilestones ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                      </div>
                  </div>
               </Card>
             )}
          </div>
       </div>
    </div>
  );
};

// --- Components ---

const Dashboard: React.FC<{ 
  goals: Goal[]; 
  user: UserState; 
  onNavigate: (view: ViewState, goalId?: string) => void; 
}> = ({ goals, user, onNavigate }) => {
  
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const activeGoals = goals.filter(g => g.status === 'active');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-brand-600 to-brand-700 text-white border-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-brand-100 text-sm font-medium">Total Saved</p>
              <h3 className="text-2xl font-bold">₹{totalSaved.toLocaleString()}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Reward Points</p>
              <h3 className="text-2xl font-bold text-slate-800">{user.points} pts</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Goals</p>
              <h3 className="text-2xl font-bold text-slate-800">{activeGoals.length}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Your Goals</h2>
          <Button onClick={() => onNavigate('CREATE_GOAL')}>
            <Plus className="w-4 h-4" /> New Goal
          </Button>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <PiggyBank className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600">No active goals</h3>
            <p className="text-slate-400 mb-6">Start saving for your dream purchase today.</p>
            <Button variant="outline" onClick={() => onNavigate('CREATE_GOAL')}>Create your first goal</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div 
                key={goal.id} 
                onClick={() => onNavigate('GOAL_DETAILS', goal.id)}
                className="group bg-white rounded-xl p-4 border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer flex gap-4"
              >
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
                    <img src={goal.imageUrl} alt={goal.title} className="w-full h-full object-cover" />
                    {goal.status === 'completed' && (
                        <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
                            <CheckCircle className="text-white w-8 h-8" />
                        </div>
                    )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">{goal.title}</h3>
                        {goal.status === 'completed' && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Completed</span>}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <ProgressBar current={goal.currentAmount} total={goal.targetAmount} />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Next: ₹{goal.installmentAmount}</span>
                      <span>{goal.frequency}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 self-center group-hover:text-brand-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for slider with input
const SliderInput = ({ label, value, min, max, step, onChange, unit = '' }: { label: string, value: number, min: number, max: number, step: number, onChange: (val: string) => void, unit?: string }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
        <span className="text-slate-500 font-semibold mr-1">{unit === '₹' ? '₹' : ''}</span>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-right font-bold text-slate-800 focus:outline-none w-24"
        />
        <span className="text-slate-500 text-sm ml-1">{unit !== '₹' ? unit : ''}</span>
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value || min}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 hover:accent-brand-500 transition-all"
    />
    <div className="flex justify-between text-xs text-slate-400 mt-1">
      <span>{unit === '₹' ? '₹' : ''}{min.toLocaleString()}</span>
      <span>{unit === '₹' ? '₹' : ''}{max.toLocaleString()}</span>
    </div>
  </div>
);

const CreateGoal: React.FC<{ onCancel: () => void; onSave: (goal: Goal) => void }> = ({ onCancel, onSave }) => {
  const [step, setStep] = useState<'SELECT' | 'CONFIGURE'>('SELECT');
  const [loading, setLoading] = useState(false);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '50000',
    category: 'Vehicle',
    frequency: Frequency.MONTHLY,
    months: '12',
    imageUrl: '',
  });

  const selectProduct = (product: typeof FEATURED_PRODUCTS[0]) => {
    setFormData({
      ...formData,
      title: product.name,
      targetAmount: product.price.toString(),
      category: product.category,
      imageUrl: product.image
    });
    setStep('CONFIGURE');
  };

  const selectPartner = (partner: typeof PARTNER_STORES[0]) => {
    setFormData({
      ...formData,
      title: `My ${partner.name} Wishlist`,
      targetAmount: '20000',
      category: 'Other',
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80' // generic shopping
    });
    setStep('CONFIGURE');
  };

  const calculateInstallment = () => {
    const amount = parseFloat(formData.targetAmount) || 0;
    const months = parseInt(formData.months) || 1;
    let paymentsPerMonth = 1;
    if (formData.frequency === Frequency.WEEKLY) paymentsPerMonth = 4;
    if (formData.frequency === Frequency.BIWEEKLY) paymentsPerMonth = 2;
    if (formData.frequency === Frequency.DAILY) paymentsPerMonth = 30;

    const totalPayments = months * paymentsPerMonth;
    return Math.ceil(amount / Math.max(1, totalPayments));
  };

  const calculateRewards = () => {
    const amount = parseFloat(formData.targetAmount) || 0;
    const months = parseInt(formData.months) || 1;
    
    // Reward rate: 1% to 2% based on duration (1 to 60 months)
    const minRate = 0.01;
    const maxRate = 0.02;
    const rate = minRate + ((Math.min(months, 60) - 1) / 59) * (maxRate - minRate);
    
    const totalValue = Math.floor(amount * rate);
    // Based on Profile: Value = Points * 0.5 => Points = Value * 2
    const totalPoints = totalValue * 2;
    
    return {
        ratePercent: (rate * 100).toFixed(1),
        totalValue,
        totalPoints
    };
  };

  const rewards = calculateRewards();

  const handleSubmit = async () => {
    setLoading(true);
    const installment = calculateInstallment();
    const months = parseInt(formData.months);
    
    // AI Integration
    const advice = await generateSavingPlanAdvice(formData.title, parseFloat(formData.targetAmount), months);
    
    // Calculate dates
    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + months);

    const image = formData.imageUrl || `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`;

    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      category: formData.category,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      startDate: start.toISOString(),
      deadline: end.toISOString(),
      frequency: formData.frequency,
      installmentAmount: installment,
      imageUrl: image,
      status: 'active',
      aiMotivation: advice
    };

    onSave(newGoal);
    setLoading(false);
  };

  if (step === 'SELECT') {
    return (
       <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
         <Button variant="outline" onClick={onCancel} className="mb-4 text-sm">
            ← Back to Dashboard
         </Button>
         <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">What are you saving for?</h2>
                <p className="text-slate-500">Select a product or create a custom goal.</p>
            </div>
            <Button variant="outline" onClick={() => setStep('CONFIGURE')}>Custom Goal <ArrowRight className="w-4 h-4" /></Button>
         </div>

         {/* Partner Stores */}
         <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Shop from Partners</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PARTNER_STORES.map(partner => (
                    <button
                        key={partner.id}
                        onClick={() => selectPartner(partner)}
                        className="h-20 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-brand-400 hover:scale-105 transition-all flex items-center justify-center p-4 group"
                    >
                        {failedLogos[partner.id] ? (
                            <span className="text-slate-800 font-bold">{partner.name}</span>
                        ) : (
                            <img 
                                src={`https://logo.clearbit.com/${partner.domain}`} 
                                alt={partner.name} 
                                className="max-h-8 md:max-h-10 w-auto object-contain filter transition-all duration-300 opacity-90 group-hover:opacity-100"
                                onError={() => setFailedLogos(prev => ({ ...prev, [partner.id]: true }))}
                            />
                        )}
                    </button>
                ))}
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FEATURED_PRODUCTS.map(product => (
                <div 
                    key={product.id} 
                    onClick={() => selectProduct(product)}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-brand-400 transition-all cursor-pointer"
                >
                    <div className="h-48 overflow-hidden relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-white font-medium">Select this item</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-800 group-hover:text-brand-600">{product.name}</h3>
                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{product.category}</span>
                        </div>
                        <p className="text-brand-600 font-bold">₹{product.price.toLocaleString()}</p>
                    </div>
                </div>
            ))}
         </div>
       </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-500">
      <div className="mb-6">
        <Button variant="outline" className="mb-4 text-xs h-8" onClick={() => setStep('SELECT')}>← Back to selection</Button>
        <h2 className="text-2xl font-bold text-slate-800">Configure Your Plan</h2>
        <p className="text-slate-500">Customize how you want to save for <span className="font-semibold text-brand-600">{formData.title || 'your goal'}</span>.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Goal Title" 
            placeholder="e.g. Yamaha R15"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          <Select 
            label="Category"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option>Vehicle</option>
            <option>Electronics</option>
            <option>Travel</option>
            <option>Home</option>
            <option>Other</option>
          </Select>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
           <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-brand-600">
                 <Banknote className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Setby Saving calculator</h3>
           </div>
           
           <SliderInput 
             label="Setby Amount" 
             value={parseInt(formData.targetAmount)} 
             min={1000} 
             max={500000} 
             step={500} 
             unit="₹"
             onChange={(val) => setFormData({...formData, targetAmount: val})} 
           />

           <SliderInput 
             label="Duration" 
             value={parseInt(formData.months)} 
             min={1} 
             max={60} 
             step={1} 
             unit="Months"
             onChange={(val) => setFormData({...formData, months: val})} 
           />

           <div className="mb-6">
              <label className="text-sm font-medium text-slate-600 mb-2 block">Installment Frequency</label>
              <div className="flex gap-2">
                 {[Frequency.MONTHLY, Frequency.BIWEEKLY, Frequency.WEEKLY, Frequency.DAILY].map((freq) => (
                    <button
                       key={freq}
                       onClick={() => setFormData({...formData, frequency: freq})}
                       className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                          formData.frequency === freq 
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                       }`}
                    >
                       {freq}
                    </button>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-5 border border-brand-200">
             <div className="flex justify-between items-start">
               <div>
                  <h4 className="text-brand-900 font-semibold mb-1">Your Installment</h4>
                  <p className="text-xs text-brand-700">Pay this amount {formData.frequency.toLowerCase()}</p>
               </div>
               <div className="text-right">
                  <span className="text-3xl font-bold text-brand-700">₹{calculateInstallment().toLocaleString()}</span>
               </div>
             </div>
             
             <div className="mt-4 pt-4 border-t border-brand-200 flex items-center justify-between text-xs text-brand-800">
                <div className="flex items-center gap-1">
                   <Award className="w-4 h-4 text-amber-500" />
                   <span>Earn <strong>{rewards.totalPoints.toLocaleString()} pts</strong> (₹{rewards.totalValue})</span>
                </div>
                <div>{formData.months} months plan</div>
             </div>
           </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!formData.title || !formData.targetAmount || loading}>
            {loading ? 'Finalizing Plan...' : 'Start Saving'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const GoalDetails: React.FC<{ 
  goal: Goal; 
  onBack: () => void;
  onDeposit: (amount: number) => void;
  onEarlyWithdraw: (goalId: string, amount: number) => void;
  transactions: Transaction[];
  userPoints: number;
  userKycStatus: UserState['kycStatus'];
}> = ({ goal, onBack, onDeposit, onEarlyWithdraw, transactions, userPoints, userKycStatus }) => {
  const [depositAmount, setDepositAmount] = useState(goal.installmentAmount.toString());
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [withdrawStatus, setWithdrawStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Withdrawal Mode State
  const [isWithdrawMode, setIsWithdrawMode] = useState(false);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [withdrawInput, setWithdrawInput] = useState('');

  const percentage = Math.floor((goal.currentAmount / goal.targetAmount) * 100);
  const isCompleted = goal.status === 'completed' || percentage >= 100;

  // Simulate AI congratulating on completion
  useEffect(() => {
    if (isCompleted && !aiMessage) {
       getCelebrationMessage(goal.title).then(setAiMessage);
    }
  }, [isCompleted, goal.title, aiMessage]);

  useEffect(() => {
    if (isCompleted) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  const handleDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (amt > 0) {
      onDeposit(amt);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleWithdraw = () => {
    if (userKycStatus !== 'verified') {
        setWithdrawStatus('error');
        return;
    }
    setWithdrawStatus('loading');
    setTimeout(() => {
        setWithdrawStatus('success');
    }, 1500);
  };

  const handleEarlyWithdrawClick = () => {
      if (userKycStatus !== 'verified') {
        alert("You must complete KYC verification before withdrawing funds.");
        return;
      }
      const amt = parseFloat(withdrawInput);
      if (!amt || amt <= 0 || amt > goal.currentAmount) {
        alert("Please enter a valid withdrawal amount.");
        return;
      }
      setShowWithdrawConfirmation(true);
  }

  const handleFinalWithdraw = () => {
      onEarlyWithdraw(goal.id, parseFloat(withdrawInput));
      setShowWithdrawConfirmation(false);
      setIsWithdrawMode(false);
      setWithdrawInput('');
  }

  // Calculate earned points for this goal to show in warning
  const earnedPoints = transactions
      .filter(t => t.goalId === goal.id && t.type === 'deposit')
      .reduce((acc, t) => acc + Math.floor(t.amount / 100), 0);

  // Early Withdrawal Calculations
  const withdrawAmount = parseFloat(withdrawInput) || 0;
  const withdrawalFee = withdrawAmount * 0.005; // 0.5%
  const netRefund = withdrawAmount - withdrawalFee;
  const pointsToLose = Math.ceil((withdrawAmount / goal.currentAmount) * earnedPoints) || 0;

  // Chart data
  const chartData = transactions
    .filter(t => t.goalId === goal.id)
    .map((t, i) => ({
      name: `Tx ${i + 1}`,
      amount: t.amount,
      total: transactions.slice(0, i + 1).filter(tr => tr.goalId === goal.id).reduce((sum, curr) => sum + (curr.type === 'withdrawal' ? -curr.amount : curr.amount), 0)
    }));

  // Add initial 0 point
  if (chartData.length === 0) {
      chartData.push({ name: 'Start', amount: 0, total: 0 });
  }

  // Final Values
  const appContribution = goal.targetAmount * 0.08; // 8% Pitch in
  const pointsValue = Math.min(goal.targetAmount * 0.1, userPoints * 0.5); // Example: Points worth up to 10% or available points
  const totalValue = goal.targetAmount + appContribution + pointsValue;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      {showConfetti && <Confetti />}
      <Button variant="outline" onClick={onBack} className="mb-4 text-sm">
        ← Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Deposit */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="relative overflow-hidden">
             {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10 flex gap-6">
               <img src={goal.imageUrl} alt={goal.title} className="w-32 h-32 rounded-xl object-cover shadow-sm bg-white" />
               <div className="flex-1">
                 <h1 className="text-2xl font-bold text-slate-800">{goal.title}</h1>
                 <p className="text-slate-500 mb-4">{goal.category} • Setby Amount: ₹{goal.targetAmount.toLocaleString()}</p>
                 
                 {goal.aiMotivation && !isCompleted && (
                   <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-sm text-indigo-800 mb-4 italic flex gap-2">
                     <span className="not-italic">🤖</span> "{goal.aiMotivation}"
                   </div>
                 )}
                 
                 {isCompleted && aiMessage && (
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-sm text-emerald-800 mb-4 font-medium flex gap-2">
                     <span className="not-italic">🎉</span> {aiMessage}
                   </div>
                 )}

                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-bold text-brand-600">₹{goal.currentAmount.toLocaleString()}</span>
                        <span className="text-slate-400 text-sm">{percentage}% Funded</span>
                    </div>
                    <ProgressBar current={goal.currentAmount} total={goal.targetAmount} className="h-4" />
                 </div>
               </div>
            </div>
          </Card>

          {/* Chart */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Growth Trajectory</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`₹${value}`, 'Total Saved']}
                    />
                    <Area type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        <History className="w-4 h-4 text-slate-400" />
                        Transaction History
                    </h3>
                </div>
                {transactions.filter(t => t.goalId === goal.id).length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                        <p>No transactions yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {transactions.filter(t => t.goalId === goal.id).reverse().map(t => (
                            <div key={t.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">{t.description}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <span className={`font-bold text-sm ${t.type === 'bonus' ? 'text-amber-500' : t.type === 'withdrawal' ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {t.type === 'bonus' ? '+' : t.type === 'withdrawal' ? '-' : '+₹'}{t.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
           </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          {!isCompleted ? (
              isWithdrawMode ? (
                  <Card className="bg-white border border-red-200 shadow-md">
                      <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5" /> Early Withdrawal
                          </h3>
                          <button onClick={() => setIsWithdrawMode(false)} className="text-slate-400 hover:text-slate-600">×</button>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-500 font-medium">Available Balance</span>
                                <span className="text-slate-900 font-bold text-lg">₹{goal.currentAmount.toLocaleString()}</span>
                            </div>
                            
                            <Input 
                                label="Amount to Withdraw"
                                type="number"
                                value={withdrawInput}
                                onChange={(e) => setWithdrawInput(e.target.value)}
                                max={goal.currentAmount}
                                placeholder="Enter amount"
                                className="mb-0"
                            />
                            <div className="flex justify-end mt-1">
                                <button onClick={() => setWithdrawInput(goal.currentAmount.toString())} className="text-xs text-brand-600 font-medium hover:underline">Withdraw Max</button>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600 font-medium">
                                <span>Withdrawal Amount</span>
                                <span>₹{withdrawAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-red-600 bg-red-50 px-3 py-2 rounded border border-red-100">
                                <span>Processing Fee (0.5%)</span>
                                <span>- ₹{withdrawalFee.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-slate-200 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-800">Net Refund</span>
                                    <span className="font-bold text-2xl text-slate-900">₹{netRefund.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                </div>
                            </div>
                        </div>
                          
                        <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs flex gap-2 items-start border border-amber-200">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>Warning: You will lose <strong>{pointsToLose} reward points</strong> based on this withdrawal amount.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                          <Button variant="outline" className="flex-1" onClick={() => setIsWithdrawMode(false)}>Back</Button>
                          <Button 
                              variant="primary" 
                              className="flex-1 bg-red-600 hover:bg-red-700 border-none"
                              onClick={handleEarlyWithdrawClick}
                          >
                              Confirm Withdraw
                          </Button>
                      </div>
                  </Card>
              ) : (
                  <>
                    <Card className="bg-slate-900 text-white border-none">
                        <h3 className="text-lg font-semibold mb-4">Make a Deposit</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Your scheduled {goal.frequency.toLowerCase()} installment is 
                            <span className="text-white font-bold ml-1">₹{goal.installmentAmount}</span>.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-400 mb-1 block">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                    <input 
                                        type="number" 
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            
                            <Button onClick={handleDeposit} variant="success" className="w-full justify-center py-3 text-lg">
                                Pay Now
                            </Button>
                            
                            {showSuccess && (
                                <div className="bg-emerald-500/20 text-emerald-400 text-center py-2 rounded-lg text-sm animate-bounce">
                                    Deposit Successful! +Points Earned
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="text-brand-400 w-5 h-5" />
                                <p className="text-sm text-slate-300">
                                    Pay on time to earn <span className="text-amber-400 font-bold">1.5x points</span> this month!
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="text-center">
                        <button 
                            onClick={() => setIsWithdrawMode(true)}
                            className="text-xs text-slate-400 hover:text-red-500 hover:underline transition-colors"
                        >
                            Withdraw funds & close goal
                        </button>
                    </div>
                  </>
              )
          ) : (
             <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none text-center py-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Goal Achieved!</h2>
                <p className="text-emerald-100 mb-6">You've reached your target for {goal.title}.</p>
                
                <div className="bg-white/10 rounded-lg p-4 mb-6 text-left space-y-3">
                    <div className="flex justify-between">
                        <span className="text-emerald-50">Your Savings</span>
                        <span className="font-bold">₹{goal.targetAmount.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-emerald-50">App Pitch-in (Bonus)</span>
                        <span className="font-bold text-amber-300">+₹{appContribution.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-emerald-50">Rewards Redemption</span>
                        <span className="font-bold text-amber-300">+₹{pointsValue.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-white/20">
                        <span className="font-medium">Total Value</span>
                        <span className="font-bold text-xl">₹{totalValue.toFixed(0)}</span>
                    </div>
                </div>

                <Button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 border-none justify-center font-bold">
                    Claim Product Now <ShoppingBag className="w-4 h-4" />
                </Button>
                
                <div className="mt-4 pt-4 border-t border-white/20">
                    <Button 
                        variant="outline" 
                        className="w-full border-white/30 text-emerald-50 hover:bg-white/10 hover:border-white/50 justify-center"
                        onClick={handleWithdraw}
                        disabled={withdrawStatus === 'loading'}
                    >
                         {withdrawStatus === 'loading' ? (
                            <span className="flex items-center gap-2">Processing...</span>
                         ) : (
                            <span className="flex items-center gap-2"><Banknote className="w-4 h-4" /> Withdraw Cash to Bank</span>
                         )}
                    </Button>
                    {withdrawStatus === 'error' && (
                        <p className="text-red-200 text-xs mt-2 bg-red-900/20 p-2 rounded text-left border border-red-500/30">
                            ⚠️ KYC Verification Required. Please complete verification in your profile to withdraw funds.
                        </p>
                    )}
                    {withdrawStatus === 'success' && (
                         <p className="text-emerald-100 text-xs mt-2 bg-emerald-800/20 p-2 rounded text-left border border-emerald-400/30">
                            ✅ Withdrawal initiated! Funds will arrive in 2-3 business days.
                        </p>
                    )}
                </div>
             </Card>
          )}

          <Card className="bg-amber-50 border-amber-100">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" /> Smart Rewards
            </h3>
            <p className="text-sm text-amber-800 mb-4">
                Earn points for every on-time installment.
            </p>
            <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                <div>
                   <div className="text-xs text-amber-600 uppercase font-bold tracking-wider">Available Points</div>
                   <div className="text-2xl font-bold text-amber-600">{userPoints}</div>
                </div>
                <div className="text-right">
                   <div className="text-xs text-amber-600 uppercase font-bold tracking-wider">Value</div>
                   <div className="text-lg font-bold text-emerald-600">~₹{(userPoints * 0.5).toFixed(0)}</div>
                </div>
            </div>
          </Card>
        </div>
      </div>
      
      {showWithdrawConfirmation && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 text-red-600 mb-4">
                    <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Final Confirmation</h3>
                </div>
                
                <p className="text-slate-600 mb-6">
                   {withdrawAmount >= goal.currentAmount ? (
                       <span>This action cannot be undone. You are about to cancel your goal <strong>{goal.title}</strong>.</span>
                   ) : (
                       <span>You are withdrawing <strong>₹{withdrawAmount}</strong> from your goal <strong>{goal.title}</strong>.</span>
                   )}
                </p>

                <div className="bg-slate-50 p-4 rounded-lg space-y-3 mb-6 border border-slate-100">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Net Refund Amount</span>
                        <span className="font-bold text-slate-900 text-lg">₹{netRefund.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Points Lost</span>
                        <span className="font-bold text-red-600">-{pointsToLose} pts</span>
                     </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowWithdrawConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 border-none" onClick={handleFinalWithdraw}>
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Main App Logic ---

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>();
  const [user, setUser] = useState<UserState>({ 
    name: 'Guest',
    email: 'guest@example.com',
    balance: 0, 
    points: 150,
    kycStatus: 'unverified',
    joinDate: new Date().toISOString(),
    notifications: {
        paymentReminders: true,
        goalMilestones: true
    }
  });
  
  // Initial Mock Data
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Yamaha R15 V4',
      category: 'Vehicle',
      targetAmount: 182000,
      currentAmount: 60000,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString(),
      frequency: Frequency.MONTHLY,
      installmentAmount: 15200,
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      aiMotivation: "You're doing great! Keep the momentum for that dream ride."
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', goalId: '1', amount: 30000, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), type: 'deposit', description: 'Initial Deposit' },
    { id: 't2', goalId: '1', amount: 30000, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), type: 'deposit', description: 'Monthly Installment' },
  ]);

  const handleLogin = (name: string, email: string) => {
    setUser({ ...user, name, email });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('DASHBOARD');
  };

  const handleCreateGoal = (newGoal: Goal) => {
    setGoals([...goals, newGoal]);
    setView('DASHBOARD');
  };

  const handleDeposit = (amount: number) => {
    if (!selectedGoalId) return;

    // Add transaction
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      goalId: selectedGoalId,
      amount: amount,
      date: new Date().toISOString(),
      type: 'deposit',
      description: 'Manual Deposit'
    };
    setTransactions([...transactions, newTx]);

    // Update Goal
    setGoals(goals.map(g => {
        if (g.id !== selectedGoalId) return g;
        const newAmount = g.currentAmount + amount;
        return {
            ...g,
            currentAmount: newAmount,
            status: newAmount >= g.targetAmount ? 'completed' : 'active'
        };
    }));

    // Reward Logic (1 point per $10 deposited)
    const pointsEarned = Math.floor(amount / 100); // 1 point per 100 INR
    setUser(u => ({ ...u, points: u.points + pointsEarned }));
  };
  
  const handleEarlyWithdrawal = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    // Logic for partial/full
    const isFullWithdrawal = amount >= goal.currentAmount;

    // Calculate points to deduct based on proportional withdrawal
    const totalGoalPoints = transactions
        .filter(t => t.goalId === goalId && t.type === 'deposit')
        .reduce((acc, t) => acc + Math.floor(t.amount / 100), 0);
        
    const pointsToDeduct = isFullWithdrawal 
        ? totalGoalPoints 
        : Math.ceil((amount / goal.currentAmount) * totalGoalPoints);

    // Fee
    const fee = amount * 0.005;
    const net = amount - fee;

    // Update User Points
    setUser(prev => ({ 
        ...prev, 
        points: Math.max(0, prev.points - pointsToDeduct) 
    }));

    if (isFullWithdrawal) {
        // Remove Goal
        setGoals(prev => prev.filter(g => g.id !== goalId));
        setView('DASHBOARD');
        alert(`Full withdrawal successful. ₹${net.toFixed(2)} sent to bank. ${pointsToDeduct} points deducted.`);
    } else {
        // Update Goal
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return { ...g, currentAmount: g.currentAmount - amount };
            }
            return g;
        }));
        
        // Add Transaction
        const newTx: Transaction = {
             id: Math.random().toString(36).substr(2, 9),
             goalId: goalId,
             amount: amount,
             date: new Date().toISOString(),
             type: 'withdrawal',
             description: 'Early Withdrawal'
        };
        setTransactions(prev => [...prev, newTx]);
        
        alert(`Withdrawal of ₹${amount} successful. ₹${net.toFixed(2)} sent to bank. ${pointsToDeduct} points deducted.`);
    }
  };

  const handleNavigate = (v: ViewState, id?: string) => {
    setView(v);
    if (id) setSelectedGoalId(id);
  };

  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  // --- Render ---

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed md:relative z-20 h-full hidden md:flex">
        <div 
          className="flex items-center gap-3 mb-10 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setView('DASHBOARD')}
        >
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Setby</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'DASHBOARD' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <TrendingUp className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setView('CREATE_GOAL')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'CREATE_GOAL' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Plus className="w-5 h-5" /> New Goal
          </button>
          <button 
            onClick={() => setView('PROFILE')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'PROFILE' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <User className="w-5 h-5" /> My Profile
          </button>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Plans</p>
            {goals.filter(g => g.status === 'active').map(g => (
                <button 
                    key={g.id}
                    onClick={() => handleNavigate('GOAL_DETAILS', g.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${selectedGoalId === g.id && view === 'GOAL_DETAILS' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                    <span className="truncate">{g.title}</span>
                </button>
            ))}
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-200 space-y-4">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
              onClick={() => setView('PROFILE')}
            >
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`} alt="User" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                    <p className="text-xs text-slate-500">Premium Member</p>
                </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Mobile Header: Logo & Profile */}
        <div className="md:hidden flex justify-between items-center mb-6">
           <div className="flex items-center gap-3" onClick={() => setView('DASHBOARD')}>
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
                <TrendingUp className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">Setby</span>
           </div>
           
           <button 
              onClick={() => handleNavigate('PROFILE')}
              className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 p-0.5 overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            >
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
            </button>
        </div>

        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    {view === 'DASHBOARD' && 'Financial Overview'}
                    {view === 'CREATE_GOAL' && 'Start a New Journey'}
                    {view === 'GOAL_DETAILS' && 'Goal Details'}
                    {view === 'PROFILE' && 'Account Settings'}
                </h1>
                <p className="text-slate-500 text-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-xs text-slate-400 font-medium uppercase">Rewards Available</span>
                    <span className="text-brand-600 font-bold">{user.points} Points</span>
                </div>
                <Button variant="primary" className="shadow-brand-500/20" onClick={() => handleNavigate('CREATE_GOAL')}>
                   <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Quick Add</span>
                </Button>
            </div>
        </header>

        {view === 'DASHBOARD' && (
          <Dashboard goals={goals} user={user} onNavigate={handleNavigate} />
        )}

        {view === 'CREATE_GOAL' && (
          <CreateGoal 
            onCancel={() => setView('DASHBOARD')} 
            onSave={handleCreateGoal} 
          />
        )}

        {view === 'GOAL_DETAILS' && selectedGoal && (
          <GoalDetails 
            goal={selectedGoal} 
            transactions={transactions}
            userPoints={user.points}
            userKycStatus={user.kycStatus}
            onBack={() => setView('DASHBOARD')}
            onDeposit={handleDeposit}
            onEarlyWithdraw={handleEarlyWithdrawal}
          />
        )}

        {view === 'PROFILE' && (
           <CustomerProfile 
             user={user} 
             onUpdateUser={(updates) => setUser({ ...user, ...updates })} 
             onBack={() => setView('DASHBOARD')}
           />
        )}
      </main>
    </div>
  );
};

export default App;