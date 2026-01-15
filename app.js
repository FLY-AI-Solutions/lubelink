const { createPortal } = ReactDOM;

// Configuration for dynamic connection
const API_CONFIG = {
    host: window.location.hostname === 'localhost' ? 'localhost' : '192.168.1.10', 
    port: '8081'
};

const BASE_URL = `http://${API_CONFIG.host}:${API_CONFIG.port}`;
// --- Setup Dependencies ---
const { useState, useEffect, useMemo } = React;

// --- Embedded Icons ---
const Icon = ({ children, size = 24, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {children}
    </svg>
);

const Icons = {
    MapPin: (props) => <Icon {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></Icon>,
    Car: (props) => <Icon {...props}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></Icon>,
    Wrench: (props) => <Icon {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></Icon>,
    User: (props) => <Icon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>,
    Clock: (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>,
    CheckCircle: (props) => <Icon {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Icon>,
    DollarSign: (props) => <Icon {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Icon>,
    Navigation: (props) => <Icon {...props}><polygon points="3 11 22 2 13 21 11 13 3 11"/></Icon>,
    Menu: (props) => <Icon {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></Icon>,
    Droplets: (props) => <Icon {...props}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.8-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></Icon>,
    Star: (props) => <Icon {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>,
    Shield: (props) => <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></Icon>,
    Zap: (props) => <Icon {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>,
    ArrowRight: (props) => <Icon {...props}><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>,
    Calendar: (props) => <Icon {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>,
    ChevronLeft: (props) => <Icon {...props}><polyline points="15 18 9 12 15 6"/></Icon>,
    Award: (props) => <Icon {...props}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></Icon>,
    TrendingDown: (props) => <Icon {...props}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></Icon>,
    MessageSquare: (props) => <Icon {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>,
    Lock: (props) => <Icon {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>,
    Sparkles: (props) => <Icon {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></Icon>,
    X: (props) => <Icon {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>
};

const { 
    MapPin, Car, Wrench, User, Clock, CheckCircle, 
    DollarSign, Navigation, Menu, Droplets, Star, 
    Shield, Zap, ArrowRight, Calendar, ChevronLeft, Award, TrendingDown, MessageSquare, Lock, Sparkles, X
} = Icons;

// --- GEMINI API HELPERS ---
const callGeminiAPI = async (prompt) => {
    const apiKey = ""; // API Key provided by runtime environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const systemPrompt = "You are LubeLink AI, an expert mechanic assistant. Your goal is to help users diagnose car issues, suggest maintenance, and identify oil types. Keep answers concise (under 80 words), friendly, and use bullet points if listing items. Format important terms in bold (using markdown **).";
    
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't quite check under the hood. Try again?";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "I'm having trouble connecting to the garage server. Please try again later.";
    }
};


// --- AI Mechanic Modal ---
const AIMechanicModal = ({ onClose }) => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setResponse("");
        
        // Exponential backoff logic not strictly needed for single user mock but good practice
        // Simple direct call here for prototype speed
        const result = await callGeminiAPI(query);
        setResponse(result);
        setLoading(false);
    };

    // Simple markdown parser for bolding
    const formatResponse = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in-up">
            <div className="w-full h-[80%] sm:h-auto sm:w-[90%] md:w-[600px] lg:w-[700px] bg-slate-900 border border-amber-500/50 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-amber-950/30 p-3 sm:p-4 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-amber-500 rounded-lg text-slate-900"><Sparkles size={18} className="sm:w-5 sm:h-5 fill-current"/></div>
                        <div>
                            <h3 className="font-bold text-base sm:text-lg md:text-xl text-white">AI Mechanic</h3>
                            <p className="text-[10px] sm:text-xs text-amber-500 font-mono">Powered by Gemini</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-full text-slate-400"><X size={18} className="sm:w-5 sm:h-5"/></button>
                </div>

                {/* Content */}
                <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto space-y-3 sm:space-y-4">
                    {!response && !loading && (
                        <div className="text-center text-slate-500 mt-8 space-y-2">
                            <Wrench size={40} className="mx-auto opacity-20"/>
                            <p className="text-sm">Describe a sound, ask for maintenance advice, or check oil types.</p>
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                <button onClick={() => setQuery("What oil does a 2021 Tacoma use?")} className="text-xs border border-slate-700 rounded-full px-3 py-1 hover:bg-slate-800">Toyota Oil Type?</button>
                                <button onClick={() => setQuery("Car makes clicking sound when turning")} className="text-xs border border-slate-700 rounded-full px-3 py-1 hover:bg-slate-800">Clicking sound?</button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                <Sparkles className="absolute inset-0 m-auto text-amber-500 animate-pulse" size={24}/>
                            </div>
                            <p className="text-amber-500 text-sm font-bold animate-pulse">Analyzing symptoms...</p>
                        </div>
                    )}

                    {response && (
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 animate-slide-up ai-response text-sm leading-relaxed text-slate-200">
                            {formatResponse(response)}
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
                    <div className="flex gap-2">
                        <input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask about your car..."
                            className="flex-1 bg-slate-800 border-none outline-none rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:ring-1 focus:ring-amber-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        />
                        <button 
                            onClick={handleAnalyze}
                            disabled={loading || !query.trim()}
                            className="bg-amber-500 text-slate-900 rounded-xl px-3 sm:px-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
                        >
                            <ArrowRight size={18} className="sm:w-5 sm:h-5"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
const LubeLink = () => {
    const [view, setView] = useState('landing'); 
    const [isOnline, setIsOnline] = useState(false);
    const [earnings, setEarnings] = useState(1450);
    const [notification, setNotification] = useState(null);
    
    // AI Modal State
    const [showAI, setShowAI] = useState(false);

    // Mock Data
    const savedCar = { make: "Toyota", model: "Tacoma", year: "2021", oil: "0W-20 Synthetic" };
    const serviceOptions = [
        { id: 1, name: "Quick Synthetic", price: 45, time: "20 min" },
        { id: 2, name: "Premium Blend", price: 35, time: "25 min" },
        { id: 3, name: "Full Inspection", price: 80, time: "45 min" },
    ];

    const showNotification = (msg, type = 'info', onClick = null) => {
        setNotification({ msg, type, onClick });
        if(!onClick) setTimeout(() => setNotification(null), 3000);
    };

    // 1. Landing Screen
    const Landing = () => (
        <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900 to-slate-900 z-0"></div>
        
        <div className="z-10 text-center space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in-up px-4 sm:px-6 md:px-8">
            <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                <Droplets size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-900" />
            </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter italic">
            LUBE<span className="text-amber-500">LINK</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            The instant oil change network. <br/> No shops. No waiting. We come to you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-8 sm:mt-12">
            <button 
                onClick={() => setView('customer')}
                className="group relative flex items-center justify-between p-4 sm:p-5 md:p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all border border-slate-700 hover:border-amber-500/50 flex-1"
            >
                <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-amber-500/10 rounded-lg text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                    <Car size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                    <div className="font-bold text-base sm:text-lg md:text-xl">I Need Service</div>
                    <div className="text-xs sm:text-sm text-slate-500">Get oil changed at home/work</div>
                </div>
                </div>
                <ArrowRight className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button 
                onClick={() => setView('provider')}
                className="group relative flex items-center justify-between p-4 sm:p-5 md:p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all border border-slate-700 hover:border-blue-500/50 flex-1"
            >
                <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-slate-900 transition-colors">
                    <Wrench size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                    <div className="font-bold text-base sm:text-lg md:text-xl">I Am A Mechanic</div>
                    <div className="text-xs sm:text-sm text-slate-500">Find jobs, track earnings</div>
                </div>
                </div>
                <ArrowRight className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            </div>
        </div>
        </div>
    );

    // 2. Customer Dashboard
    const CustomerView = () => {
        const [bookingStage, setBookingStage] = useState('selection'); 
        const [selectedService, setSelectedService] = useState(serviceOptions[0]);
        const [status, setStatus] = useState('idle'); 
        // status: idle, request_sent, verify_auth, bidding_review, found
        
        const [hasOwnOil, setHasOwnOil] = useState(false);
        const [address, setAddress] = useState("Detecting location...");
        const [authCode, setAuthCode] = useState(["","","",""]);
        
        // Calendar State
        const [selectedDateId, setSelectedDateId] = useState(0);
        const [selectedTimeId, setSelectedTimeId] = useState(null);
        
        // Bidding State
        const [receivedBids, setReceivedBids] = useState([]);
        const [selectedBid, setSelectedBid] = useState(null);

        // Mock Bids
        const mockBids = [
            { id: 1, name: "QuickLube Mobile", price: 35, rating: 4.2, ase: false, desc: "Economy Option", eta: "On time" },
            { id: 2, name: "Mike R.", price: 45, rating: 4.9, ase: true, desc: "ASE Certified", eta: "Early" },
            { id: 3, name: "Prestige Auto", price: 65, rating: 5.0, ase: true, desc: "Premium + Insured", eta: "On time" }
        ];

        const dates = useMemo(() => {
            const days = [];
            const today = new Date();
            const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            for(let i=0; i<7; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                days.push({ id: i, dayName: i === 0 ? 'Today' : weekDays[d.getDay()], dateNum: d.getDate() });
            }
            return days;
        }, []);

        const timeSlots = ["08:00", "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"];
        // Add these to your state declarations
        // --- 1. State for Verification ---
        // Inside CustomerView component
        const [verifying, setVerifying] = useState(null); // Controls 'email', 'otp', or null
        const [email, setEmail] = useState("");
        const [otp, setOtp] = useState(["", "", "", ""]);
        const [tempData, setTempData] = useState(null);

        // --- 2. Handlers for the Popup Flow ---
        const handleRequestBids = (formData) => {
            setTempData(formData);
            setVerifying('email'); // Triggers the first popup
        };

        const sendOtp = () => {
            if (!email.includes('@')) return alert("Please enter a valid email");
            setVerifying('otp'); // Triggers the OTP popup
        };

        const verifyOtpAndSubmit = async () => {
            if (otp.join('') === "1234") { // Mock code for testing
                try {
                    const response = await fetch(`${BASE_URL}/api/requests`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...tempData, email })
                    });
                    if (response.ok) {
                        setVerifying(null);
                        setStatus('request_sent'); // Shows success screen
                    }
                } catch (err) {
                    console.error("Submission failed:", err);
                }
            } else {
                alert("Invalid code. Try 1234");
            }
        };
        // VerificationModal
        const VerificationModal = ({ stage, email, setEmail, otp, setOtp, onSend, onVerify, onClose }) => {
            return createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 
                                    w-full max-w-md mx-4 rounded-2xl p-6 
                                    shadow-2xl animate-bounce-inbg-slate-900 border border-slate-700 
                                    w-full max-w-md rounded-2xl p-6 
                                    shadow-2xl animate-bounce-in
                                    fixed top-1/2 left-1/2 
                                    -translate-x-1/2 -translate-y-1/2">
                        
                        {stage === 'email' ? (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white">Verify your Email</h3>
                                <p className="text-slate-400 text-sm">
                                    We'll send a 4-digit code to verify your request.
                                </p>
        
                                <input
                                    className="w-full bg-slate-800 border border-slate-600 
                                               rounded-lg p-3 text-white outline-none 
                                               focus:border-amber-500"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
        
                                <button
                                    onClick={onSend}
                                    className="w-full bg-amber-500 hover:bg-amber-400 
                                               py-3 rounded-lg font-black text-slate-900"
                                >
                                    Send Code
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 text-center">
                                <h3 className="text-xl font-bold text-white">Enter OTP</h3>
                                <p className="text-slate-400 text-sm">Sent to {email}</p>
        
                                <div className="flex justify-center gap-3">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            maxLength={1}
                                            className="w-12 h-14 bg-slate-800 border 
                                                       border-slate-600 rounded-lg 
                                                       text-center text-2xl font-black"
                                            value={digit}
                                            onChange={(e) => {
                                                const next = [...otp];
                                                next[idx] = e.target.value;
                                                setOtp(next);
                                                if (e.target.value && e.target.nextSibling) {
                                                    e.target.nextSibling.focus();
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
        
                                <button
                                    onClick={onVerify}
                                    className="w-full bg-green-600 hover:bg-green-500 
                                               py-3 rounded-lg font-black text-white"
                                >
                                    Confirm & Request Bids
                                </button>
                            </div>
                        )}
        
                        <button
                            onClick={onClose}
                            className="mt-4 w-full text-sm text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>,
                document.body
            );
        };
        

        // 2. Use this effect to find the real address
        // --- Corrected Geolocation Effect ---
        useEffect(() => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            // This service turns Lat/Lng into a real address
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                            );
                            const data = await response.json();
                            
                            // FIX: Use setAddress instead of setFormData
                            if (data.display_name) {
                                setAddress(data.display_name);
                            } else {
                                setAddress("Location Found");
                            }
                        } catch (err) {
                            console.error("Geocoding error:", err);
                            setAddress("Address fetch failed");
                        }
                    },
                    (error) => {
                        console.error("Location permission error:", error);
                        setAddress("Permission denied");
                    }
                );
            }
        }, []);

        // Simulation: Trigger notification after broadcasting
        // useEffect(() => {
        //     if ("geolocation" in navigator) {
        //         navigator.geolocation.getCurrentPosition(
        //             async (position) => {
        //                 const { latitude, longitude } = position.coords;
                        
        //                 try {
        //                     // This service translates Lat/Lng into a readable street address
        //                     const response = await fetch(
        //                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        //                     );
        //                     const data = await response.json();
                            
        //                     // Update the address state with the real street name
        //                     if (data.display_name) {
        //                         setAddress(data.display_name);
        //                     } else {
        //                         setAddress("Location found, but address unknown");
        //                     }
        //                 } catch (err) {
        //                     console.error("Geocoding error:", err);
        //                     setAddress("Address service unavailable");
        //                 }
        //             },
        //             (error) => {
        //                 console.error("Location permission error:", error);
        //                 setAddress("Location permission denied");
        //             },
        //             { enableHighAccuracy: true } // Request better GPS precision
        //         );
        //     } else {
        //         setAddress("Geolocation not supported by browser");
        //     }
        // }, []);

        const handleScheduleClick = () => {
            if (!address.trim()) { showNotification("Please enter an address first", "error"); return; }
            setBookingStage('scheduling');
        };

        // const handleBroadcastRequest = () => {
        //     if (selectedTimeId === null) { showNotification("Please select a time slot", "error"); return; }
        //     setBookingStage('selection'); 
        //     setStatus('request_sent'); 
        // };
        const handleBroadcastRequest = async () => {
            if (selectedTimeId === null) { 
                showNotification("Please select a time slot", "error"); 
                return; 
            }
        
            // 1. Prepare the data from app's state
            const requestPayload = {
                name: "Anika", // Replace with a dynamic name ????
                car: `${savedCar.year} ${savedCar.make} ${savedCar.model}`, 
                address: address, // This uses the address found by  GPS effect
                lat: 0.0, 
                lng: 0.0,
                oil_type: selectedService.name,
                date: dates[selectedDateId].dateNum.toString(),
                time: timeSlots[selectedTimeId]
            };
        
            try {
                // 2. Send the data to FastAPI backend
                const response = await fetch(`${BASE_URL}/api/requests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestPayload)
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log("Saved to database with ID:", data.id);
                    
                    // 3. Move the UI forward to the "Sent" screen
                    setBookingStage('selection'); 
                    setStatus('request_sent'); 
                    showNotification("Request sent to local mechanics!", "success");
                } else {
                    throw new Error("Server error");
                }
            } catch (error) {
                console.error("Connection failed:", error);
                showNotification("Failed to save. Is the backend running?", "error");
            }
        };
        const handleVerifyCode = async () => {
            if(authCode.join('').length < 4) { 
                showNotification("Please enter full code", "error"); 
                return; 
            }

            // 1. Prepare the payload with dynamic inputs
            const requestPayload = {
                name: "Anika", // take this from an input field
                car: "Toyota Tacoma", 
                address: address,      
                lat: location.lat,
                lng: location.lng,
                oil_type: selectedOil, // The oil chosen in Step 1
                date: "2024-01-14",    // Dynamic date
                time: timeSlots[selectedTimeId] // The string value of the time slot
            };

            try {
                // 2. Send to  FastAPI backend on port 8081
                const response = await fetch(`${BASE_URL}/api/requests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestPayload)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Database ID:", data.id);
                    
                    // 3. UI Transition
                    setStatus('bidding_review');
                    showNotification("Searching for local mechanics...", "success");
                    
                    // OPTIONAL: Start polling for real bids from the database
                    // fetchRealBids(data.id);
                }
            } catch (error) {
                showNotification("Backend connection failed", "error");
            }
        };
        // const handleVerifyCode = () => {
        //     if(authCode.join('').length < 4) { showNotification("Please enter full code", "error"); return; }
        //     setStatus('bidding_review');
        //     setReceivedBids(mockBids);
        // };
        const handleConfirmBid = async (bid) => {
            try {
                // Update the status in the database via API
                const response = await fetch(`http://localhost:8081/api/requests/${requestId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'confirmed', provider_id: bid.id })
                });
        
                if (response.ok) {
                    setSelectedBid(bid);
                    setStatus('found');
                    showNotification(`Mechanic ${bid.name} is on the way!`, "success");
                }
            } catch (error) {
                showNotification("Could not confirm bid", "error");
            }
        };
        // const handleConfirmBid = (bid) => {
        //     setSelectedBid(bid);
        //     setStatus('found');
        //     showNotification(`${bid.name} confirmed for ${timeSlots[selectedTimeId]}`, "success");
        // };

        const handleCancel = () => {
            setStatus('idle');
            setBookingStage('selection');
            setReceivedBids([]);
            setSelectedBid(null);
            setAuthCode(["","","",""]);
        };

        const handleCodeChange = (index, val) => {
            if (val.length > 1) return;
            const newCode = [...authCode];
            newCode[index] = val;
            setAuthCode(newCode);
            if (val && index < 3) document.getElementById(`code-${index+1}`).focus();
        };
        /* Map Use effect */
        useEffect(() => {
            const MAX_ZOOM = 19;
        
            const map = L.map("map", {
                zoomControl: false,
                attributionControl: false,
                minZoom: 3,
                maxZoom: MAX_ZOOM,
            });
        
            // Dark map tiles
            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                {
                    maxZoom: MAX_ZOOM,
                }
            ).addTo(map);
        
            // const carIcon = L.icon({
            //     iconUrl: "https://cdn-icons-png.flaticon.com/512/1048/1048316.png",
            //     iconSize: [44, 44],
            //     iconAnchor: [22, 22],
            // });
            // 1. Define the 3D Car + Pulse Icon
            const customMarkerIcon = L.divIcon({
                className: 'pulse-container',
                html: `
                    <div class="blue-pulse"></div>
                    <img src="https://cdn-icons-png.flaticon.com/512/1048/1048316.png" class="car-marker-3d" 
                        style="width: 44px; height: 44px; position: relative; z-index: 10; transform: rotate(-10deg);" 
                    />
                `,
                iconSize: [44, 44],
                iconAnchor: [22, 22],
            });
        
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
        
                    // 🔥 INSTANT MAX ZOOM ON LOAD
                    map.setView([latitude, longitude], MAX_ZOOM, {
                        animate: false,
                    });
        
                    L.marker([latitude, longitude], {
                        icon: customMarkerIcon,
                    })
                        .addTo(map)
                        .bindPopup("🚗 Your Car Is Here", {
                            autoPan: false,
                        });
                },
                () => {
                    // fallback (still zoomed in)
                    map.setView([40.7128, -74.006], MAX_ZOOM - 2, {
                        animate: false,
                    });
                }
            );
        
            // 🔥 CRITICAL: Fix flex + animation sizing
            requestAnimationFrame(() => {
                map.invalidateSize();
            });
        
            return () => map.remove();
        }, []);
        
        
        
        return (
            <div className="flex flex-col lg:flex-row h-full bg-slate-900 text-slate-100">
                {/* Interactive Map Background */}
                {/* Interactive Leaflet Map */}
                <div className="flex-1 relative min-h-[300px] sm:min-h-[400px] lg:min-h-full">
                    <div id="map" className="absolute inset-0 z-0"></div>
                </div>

                {/* Bottom Action Sheet */}
                <div className="bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 md:p-6 rounded-t-3xl lg:rounded-t-none lg:rounded-r-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-[-10px_0_40px_rgba(0,0,0,0.5)] -mt-6 lg:-mt-0 lg:-ml-6 relative z-10 min-h-[400px] sm:min-h-[450px] lg:min-h-full lg:w-96 xl:w-[28rem] overflow-y-auto">
                
                        {/* 1. STATUS: IDLE / SELECTION */}
                        {status === 'idle' && bookingStage === 'selection' && (
                            <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-slide-up relative">
                                
                                {/* AI Mechanic Banner */}
                                <button 
                                    onClick={() => setShowAI(true)}
                                    className="w-full bg-gradient-to-r from-amber-600/20 to-amber-900/20 border border-amber-500/50 p-3 sm:p-4 rounded-xl flex items-center justify-between group animate-pulse-glow"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="p-1.5 sm:p-2 bg-amber-500 rounded-lg text-slate-900"><Sparkles size={18} className="sm:w-5 sm:h-5 fill-current"/></div>
                                        <div className="text-left">
                                            <div className="font-bold text-xs sm:text-sm md:text-base text-amber-500">Ask AI Mechanic ✨</div>
                                            <div className="text-[10px] sm:text-xs text-slate-400">Diagnose sounds or check maintenance</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={14} className="sm:w-4 sm:h-4 text-amber-500 group-hover:translate-x-1 transition-transform"/>
                                </button>

                                <div className="flex justify-between items-center flex-wrap gap-2">
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Service Details</h2>
                                    <span className="text-[10px] sm:text-xs text-amber-500 font-mono bg-amber-500/10 px-2 py-1 rounded">{savedCar.oil}</span>
                                </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Location</label>
                            <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700 focus-within:border-amber-500 transition-colors">
                                <MapPin className="text-amber-500" size={20} />
                                <input 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="bg-transparent border-none outline-none w-full text-sm font-medium text-white placeholder-slate-500"
                                    placeholder="Enter service address"
                                />
                            </div>
                        </div>

                        <div onClick={() => setHasOwnOil(!hasOwnOil)} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 cursor-pointer hover:border-amber-500/30 transition-all">
                            <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${hasOwnOil ? 'bg-green-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}> <Droplets size={18} /> </div>
                            <div className="text-sm font-bold text-slate-200">I have my own oil</div>
                            </div>
                            <div className={`w-10 h-5 rounded-full transition-colors relative ${hasOwnOil ? 'bg-green-500' : 'bg-slate-600'}`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform shadow-md ${hasOwnOil ? 'translate-x-6' : 'translate-x-1'}`} />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                            {serviceOptions.map(opt => {
                            const finalPrice = hasOwnOil ? Math.max(20, opt.price - 25) : opt.price;
                            return (
                                <button key={opt.id} onClick={() => setSelectedService(opt)} className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left ${selectedService.id === opt.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800'}`}>
                                <div className="text-xs sm:text-sm font-bold mb-1 truncate">{opt.name}</div>
                                <div className="text-base sm:text-lg md:text-xl font-black text-white">${finalPrice}</div>
                                <div className="text-[10px] sm:text-xs text-slate-500 mt-1 flex items-center gap-1"> <Clock size={10} className="sm:w-3 sm:h-3" /> {opt.time} </div>
                                </button>
                            );
                            })}
                        </div>

                        <button onClick={handleScheduleClick} className="w-full py-3 sm:py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-base sm:text-lg md:text-xl rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2">
                            <Calendar className="fill-current w-4 h-4 sm:w-5 sm:h-5" /> SCHEDULE SERVICE
                        </button>
                    </div>
                )}

                {/* 2. STATUS: SCHEDULING */}
                {status === 'idle' && bookingStage === 'scheduling' && (
                    <div className="space-y-6 h-full flex flex-col animate-slide-in-right">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setBookingStage('selection')} className="p-2 -ml-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"> <ChevronLeft size={24} /> </button>
                            <div>
                                <h2 className="text-xl font-bold">Pick a Time</h2>
                                <p className="text-xs text-slate-500">Technicians available in your area</p>
                            </div>
                        </div>

                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 no-scrollbar">
                            {dates.map((d) => (
                                <button key={d.id} onClick={() => setSelectedDateId(d.id)} className={`flex-shrink-0 w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 border transition-all ${selectedDateId === d.id ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-lg scale-105' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                    <span className="text-[10px] sm:text-xs font-bold uppercase">{d.dayName}</span>
                                    <span className="text-lg sm:text-xl md:text-2xl font-black">{d.dateNum}</span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                            {timeSlots.map((time, idx) => (
                                <button key={time} onClick={() => setSelectedTimeId(idx)} className={`py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-bold border transition-all ${selectedTimeId === idx ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                                    {time}
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto pt-4">
                            {/* <button onClick={handleBroadcastRequest} className={`w-full py-4 font-black text-lg rounded-xl transition-all flex items-center justify-center gap-2 ${selectedTimeId !== null ? 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                                <Zap className="fill-current" size={20} /> REQUEST BIDS
                            </button> */}
                            {/* // Find this button in your CustomerView JSX */}
                            {/* <button 
                                onClick={() => handleRequestBids({
                                    name: "Customer",
                                    car: `${savedCar.year} ${savedCar.make} ${savedCar.model}`,
                                    address: address,
                                    oil_type: selectedService.name,
                                    date: dates[selectedDateId].dateNum.toString(),
                                    time: timeSlots[selectedTimeId]
                                })}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-xl shadow-lg transition-all"
                                >
                                REQUEST BIDS
                                </button> */}
                            <button 
                                disabled={selectedTimeId === null}
                                onClick={() => {
                                    if (selectedTimeId === null) return;
                                    handleRequestBids({
                                    name: "Customer",
                                    car: `${savedCar.year} ${savedCar.make} ${savedCar.model}`,
                                    address: address,
                                    oil_type: selectedService.name,
                                    date: dates[selectedDateId].dateNum.toString(),
                                    time: timeSlots[selectedTimeId]
                                    });
                                }}
                                className={`
                                    w-full py-4 font-black rounded-xl transition-all
                                    ${selectedTimeId === null
                                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                    : "bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg"
                                    }
                                `}
                                >
                                REQUEST BIDS
                            </button>    
                        </div>
                    </div>
                )}

                {/* 3. STATUS: REQUEST SENT (ASYNC) */}
                {status === 'request_sent' && (
                    <div className="text-center py-12 space-y-6 animate-slide-up h-full flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle size={48} className="text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">Request Broadcasted!</h3>
                            <p className="text-slate-400 mt-2 max-w-xs mx-auto">We have alerted mechanics in your area.</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 max-w-xs">
                            <div className="flex items-start gap-3 text-left">
                                <MessageSquare className="text-blue-400 shrink-0" />
                                <div className="text-sm text-slate-300">
                                    You will receive a <span className="text-white font-bold">Text Message</span> or Email with a verification code once bids arrive.
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <p className="text-xs text-slate-500 italic">Simulating wait time... (approx 5s)</p>
                        </div>
                    </div>
                )}

                {/* 4. STATUS: VERIFY AUTH (FROM SMS LINK) */}
                {status === 'verify_auth' && (
                    <div className="space-y-6 animate-slide-up h-full flex flex-col">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock size={32} className="text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold">Secure Access</h3>
                            <p className="text-slate-400 text-sm">Enter the 4-digit code sent to you</p>
                        </div>

                        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 py-4">
                            {[0,1,2,3].map((i) => (
                                <input
                                    key={i}
                                    id={`code-${i}`}
                                    type="text"
                                    maxLength="1"
                                    value={authCode[i]}
                                    onChange={(e) => handleCodeChange(i, e.target.value)}
                                    className="w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-20 bg-slate-800 border-2 border-slate-700 rounded-xl text-center text-xl sm:text-2xl md:text-3xl font-black focus:border-amber-500 focus:outline-none transition-colors"
                                />
                            ))}
                        </div>

                        <button onClick={handleVerifyCode} className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 font-black text-base sm:text-lg md:text-xl rounded-xl shadow-lg transition-all">
                            VERIFY & VIEW BIDS
                        </button>
                    </div>
                )}

                {/* 5. STATUS: BIDDING REVIEW */}
                {status === 'bidding_review' && (
                    <div className="space-y-3 sm:space-y-4 animate-slide-up h-full flex flex-col">
                        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">3 Bids Received</h2>
                            <button onClick={handleCancel} className="text-xs sm:text-sm text-red-400 font-bold">CANCEL</button>
                        </div>
                        
                        <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto pb-4 no-scrollbar">
                            {receivedBids.map((bid) => (
                                <div key={bid.id} onClick={() => handleConfirmBid(bid)} className="group bg-slate-800 p-3 sm:p-4 rounded-xl border border-slate-700 hover:border-amber-500 cursor-pointer transition-all relative overflow-hidden">
                                    {bid.ase && <div className="absolute top-0 right-0 bg-blue-600/20 text-blue-400 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-bl-lg flex items-center gap-1 border-l border-b border-blue-600/30"> <Award size={8} className="sm:w-[10px] sm:h-[10px]" /> ASE CERTIFIED </div>}
                                    {!bid.ase && bid.price < 40 && <div className="absolute top-0 right-0 bg-green-600/20 text-green-400 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-bl-lg flex items-center gap-1 border-l border-b border-green-600/30"> <TrendingDown size={8} className="sm:w-[10px] sm:h-[10px]" /> BEST PRICE </div>}

                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-base sm:text-lg md:text-xl text-white group-hover:text-amber-500 transition-colors truncate">{bid.name}</div>
                                            <div className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1"> <Star size={8} className="sm:w-[10px] sm:h-[10px] text-amber-500 fill-amber-500"/> {bid.rating} • {bid.desc} </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-xl sm:text-2xl md:text-3xl font-black text-white group-hover:scale-110 transition-transform">${bid.price}</div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-700/50 py-1.5 sm:py-2 rounded text-center text-[10px] sm:text-xs font-bold text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors"> ACCEPT BID </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. STATUS: FOUND */}
                {status === 'found' && selectedBid && (
                    <div className="animate-fade-in">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 rounded-full overflow-hidden border-2 border-green-500 relative flex-shrink-0">
                            <User className="w-full h-full p-1.5 sm:p-2 text-slate-400" />
                            {selectedBid.ase && <div className="absolute bottom-0 right-0 bg-blue-500 p-0.5 sm:p-1 rounded-full border border-slate-900"><Award size={8} className="sm:w-[10px] sm:h-[10px] text-white"/></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg md:text-xl truncate">{selectedBid.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500 text-xs sm:text-sm"> <Star size={12} className="sm:w-3.5 sm:h-3.5 fill-currentColor" /> {selectedBid.rating} </div>
                        <div className="text-slate-400 text-[10px] sm:text-xs mt-1">Confirmed for {timeSlots[selectedTimeId] || 'Today'}</div>
                        </div>
                        <div className="ml-auto flex flex-col items-end flex-shrink-0">
                        <div className="text-lg sm:text-xl md:text-2xl font-bold font-mono text-green-400">BOOKED</div>
                        <div className="text-xs sm:text-sm md:text-base font-bold text-slate-200">${selectedBid.price}</div>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <button className="flex-1 py-2.5 sm:py-3 bg-slate-800 rounded-lg font-bold text-xs sm:text-sm border border-slate-700 hover:bg-slate-700">Message</button>
                        <button className="flex-1 py-2.5 sm:py-3 bg-slate-800 rounded-lg font-bold text-xs sm:text-sm border border-slate-700 hover:bg-slate-700">Call</button>
                    </div>
                    </div>
                )}

                </div>
                {verifying && (
                    <VerificationModal 
                        stage={verifying}
                        email={email}
                        setEmail={setEmail}
                        otp={otp}
                        setOtp={setOtp}
                        onSend={sendOtp}
                        onVerify={verifyOtpAndSubmit}
                        onClose={() => setVerifying(null)}
                    />
                )}    
            </div>
        );
    };

    // 3. Provider Dashboard
    const ProviderView = () => {
        const incomingJob = { customer: "Sarah J.", car: "2019 Honda Civic", distance: "2.4 mi", price: "$45", rating: "5.0" };
        return (
        <div className="flex flex-col lg:flex-row h-full bg-slate-950 text-slate-100">
            <div className="p-4 sm:p-5 md:p-6 flex justify-between items-center bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 lg:flex-col lg:justify-start lg:gap-4 lg:w-64 xl:w-80">
            <div className="lg:w-full"> <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Earnings Today</div> <div className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-green-400">${earnings}</div> </div>
            <div onClick={() => { setIsOnline(!isOnline); showNotification(isOnline ? "You are now offline" : "You are online and visible", "info"); }} className={`cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${isOnline ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div> {isOnline ? 'ONLINE' : 'OFFLINE'}
            </div>
            </div>

            <div className="flex-1 p-4 sm:p-5 md:p-6 overflow-y-auto relative">
            <button onClick={() => setView('landing')} className="absolute top-2 right-2 p-1.5 sm:p-2 text-slate-600 hover:text-white"><Menu size={14} className="sm:w-4 sm:h-4"/></button>

            {!isOnline ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center"> <Zap size={32} /> </div> <p>Go online to start receiving jobs</p>
                </div>
            ) : (
                <div className="space-y-4">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Nearby Requests</div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 overflow-hidden shadow-lg animate-slide-up hover:border-blue-500/50 transition-colors">
                    <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div> <h3 className="font-bold text-lg text-white">{incomingJob.car}</h3> <div className="text-slate-400 text-sm flex items-center gap-1"> <MapPin size={12} /> {incomingJob.distance} away </div> </div>
                        <div className="bg-green-900/30 text-green-400 px-3 py-1 rounded font-mono font-bold"> {incomingJob.price} </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">{incomingJob.customer[0]}</div>
                        <span className="text-sm font-medium">{incomingJob.customer}</span>
                        <span className="flex items-center text-xs text-amber-500 gap-1 ml-auto"><Star size={10} fill="currentColor"/> {incomingJob.rating}</span>
                    </div>
                    </div>
                    <div className="bg-slate-800 p-2 flex gap-2">
                    <button className="flex-1 py-3 rounded bg-slate-700 hover:bg-slate-600 font-bold text-xs text-slate-300">IGNORE</button>
                    <button onClick={() => { showNotification("Bid Submitted! Waiting for customer...", "success"); }} className="flex-[2] py-3 rounded bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"> SUBMIT BID ($45) </button>
                    </div>
                </div>
                <div className="h-48 bg-slate-800 rounded-xl mt-6 relative overflow-hidden opacity-50 grayscale hover:grayscale-0 transition-all">
                    <div className="absolute inset-0 flex items-center justify-center"> <Navigation size={32} className="text-blue-500" /> </div>
                    <div className="absolute bottom-2 left-2 text-xs font-mono text-white bg-black/50 px-2 rounded">Heatmap: High Demand Area</div>
                </div>
                </div>
            )}
            </div>
        </div>
        );
    };

    return (
        <div className="w-full min-h-screen font-sans bg-black flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl h-full min-h-[600px] sm:min-h-[700px] md:min-h-[800px] md:rounded-2xl lg:rounded-3xl overflow-hidden relative bg-slate-900 shadow-2xl border-2 sm:border-4 md:border-8 border-slate-950">
                <div className="absolute top-0 w-full h-4 sm:h-6 md:h-8 bg-black/20 z-50 pointer-events-none backdrop-blur-[1px]"></div>
                {view === 'landing' && <Landing />}
                {view === 'customer' && <CustomerView />}
                {view === 'provider' && <ProviderView />}
                
                {/* AI Modal */}
                {showAI && <AIMechanicModal onClose={() => setShowAI(false)} />}

                {notification && (
                    <div 
                        onClick={notification.onClick}
                        className={`absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] md:w-[80%] max-w-md z-50 animate-bounce-in cursor-pointer`}
                    >
                    <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-2xl text-xs sm:text-sm md:text-base font-bold flex items-center gap-2 sm:gap-3 backdrop-blur-xl ${notification.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-slate-800/90 text-white border border-slate-600'}`}>
                        {notification.type === 'success' ? <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Shield size={16} className="sm:w-[18px] sm:h-[18px]" />}
                        {notification.msg}
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LubeLink />);

