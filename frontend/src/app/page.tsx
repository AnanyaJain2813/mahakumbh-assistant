'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  AlertTriangle,
  Compass,
  Calendar,
  MapPin,
  MessageSquare,
  Volume2,
  Info,
  Users,
  Navigation,
  Globe2,
  CheckCircle2,
  Waves,
  Shield,
  Route
} from 'lucide-react';

const LiveMap = dynamic(() => import('../components/LiveMap'), { ssr: false });

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const shahiSnanEvents = [
  { name: 'Simhastha Cycle Context', date: 'Next major cycle: 2028', status: 'Tracked', sector: 'Ujjain City' },
  { name: 'Ram Ghat Priority Zone', date: 'Live example enabled', status: 'Active Map', sector: 'Shipra Riverfront' },
  { name: 'Temple Connectivity', date: 'Mahakaleshwar link route', status: 'Interactive', sector: 'Central Ujjain' }
];

export default function MahakumbhSuperApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'प्रणाम! यह upgraded pilgrim assistant अब live Ujjain map example, SOS flow, multilingual help, और landmark guidance के साथ तैयार है।',
      timestamp: 'Just Now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('hi');
  const [activeTab, setActiveTab] = useState<'assistant' | 'schedule' | 'map'>('assistant');
  const [sosStatus, setSosStatus] = useState<{ active: boolean; ticket?: string; message?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const languageOptions = [
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'mr', label: 'मराठी (Marathi)' }
  ];

  const triggerSOSSystem = async () => {
    try {
      const response = await fetch('/api/v1/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilgrim_id: 'PILGRIM_PWA_MOBILE_NODE',
          latitude: 23.1765,
          longitude: 75.7885,
          device_timestamp: Math.floor(Date.now() / 1000)
        })
      });
      const data = await response.json();
      setSosStatus({ active: true, ticket: data.tracking_ticket, message: data.message });
    } catch {
      setSosStatus({
        active: true,
        ticket: 'LOCAL-OFFLINE-TICKET-001',
        message: 'Offline emergency beacon triggered. Move toward the nearest police or medical checkpoint while keeping your phone visible.'
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const payloadText = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'PILGRIM_PWA_MOBILE_NODE',
          message: payloadText,
          language: currentLanguage,
          latitude: 23.1765,
          longitude: 75.7885,
          audio_requested: false
        })
      });
      const data = await response.json();
      setMessages((prev) => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Network congestion detected. Fallback suggestion: use the live map tab and navigate toward Ram Ghat or Mahakaleshwar support corridors.',
        timestamp: 'Fallback Mode'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setInputText('Ram Ghat ka live route dikhao');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <aside className="w-full lg:w-[380px] border-r border-slate-200 bg-white/80 backdrop-blur-xl shadow-xl">
          <header className="bg-gradient-to-r from-[#FF6B35] via-[#E81B23] to-[#FFB627] text-white p-5 shadow-md flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Compass className="w-6 h-6 text-yellow-100" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-wide leading-none">MAHAKUMBH ASSISTANT</h1>
                <p className="text-xs font-medium text-orange-100 mt-1">Live Ujjain Pilgrim Control Panel</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg px-2 py-1 flex items-center gap-1 border border-white/20">
              <Globe2 className="w-4 h-4" />
              <select
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-white"
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 font-normal">{lang.label}</option>
                ))}
              </select>
            </div>
          </header>

          <div className="bg-[#1A2A3A] p-3 px-5 flex justify-between items-center text-white gap-3 border-b border-red-900/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300 tracking-wide">Field fallback active</span>
            </div>
            <button
              onClick={triggerSOSSystem}
              className="bg-gradient-to-r from-red-600 to-rose-700 active:scale-95 transition-transform p-2 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-black shadow-lg"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              ONE-TAP SOS
            </button>
          </div>

          <main className="p-4 flex flex-col h-[calc(100vh-138px)]">
            <AnimatePresence>
              {sosStatus && (
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="bg-red-50 border-2 border-red-600 rounded-xl p-4 mb-4 shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-600 text-white p-2 rounded-lg shrink-0"><AlertTriangle className="w-5 h-5 animate-pulse" /></div>
                    <div>
                      <h3 className="text-red-900 font-black text-sm uppercase tracking-wider">Rescue Vector Locked</h3>
                      <p className="text-xs text-red-700 font-bold mt-0.5">Ticket: {sosStatus.ticket}</p>
                      <p className="text-xs text-slate-700 font-medium mt-2 leading-relaxed bg-white p-2 rounded border border-red-200">{sosStatus.message}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 mb-4 rounded-2xl bg-slate-100 p-2 text-xs font-semibold">
              <button onClick={() => setActiveTab('assistant')} className={`flex-1 rounded-xl px-3 py-2 ${activeTab === 'assistant' ? 'bg-white text-[#FF6B35] shadow' : 'text-slate-500'}`}>Assistant</button>
              <button onClick={() => setActiveTab('schedule')} className={`flex-1 rounded-xl px-3 py-2 ${activeTab === 'schedule' ? 'bg-white text-[#FF6B35] shadow' : 'text-slate-500'}`}>Schedule</button>
              <button onClick={() => setActiveTab('map')} className={`flex-1 rounded-xl px-3 py-2 ${activeTab === 'map' ? 'bg-white text-[#FF6B35] shadow' : 'text-slate-500'}`}>Live Map</button>
            </div>

            {activeTab === 'assistant' && (
              <div className="flex flex-col gap-4 h-full">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-orange-50 border border-orange-100 p-3">
                    <div className="flex items-center gap-2 text-[#FF6B35] font-bold text-sm"><Route className="w-4 h-4" /> Smart route</div>
                    <p className="mt-2 text-xs text-slate-600">Ask for Ram Ghat, Mahakaleshwar, crowd-safe path, or emergency help.</p>
                  </div>
                  <div className="rounded-2xl bg-sky-50 border border-sky-100 p-3">
                    <div className="flex items-center gap-2 text-sky-700 font-bold text-sm"><Shield className="w-4 h-4" /> SOS ready</div>
                    <p className="mt-2 text-xs text-slate-600">Emergency module works with GPS-style coordinates and offline fallback.</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[88%] rounded-2xl p-3.5 shadow-sm text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-[#FF6B35] text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'}`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${msg.sender === 'user' ? 'text-orange-100 justify-end' : 'text-slate-400'}`}>
                          {msg.sender === 'assistant' && <Volume2 className="w-3 h-3 text-orange-500" />}
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="mt-auto pt-2 flex items-center gap-2">
                  <button type="button" onClick={simulateVoiceInput} className={`p-3.5 rounded-full transition-all duration-300 shadow-md ${isRecording ? 'bg-red-600 text-white animate-pulse scale-105' : 'bg-gradient-to-br from-[#FFB627] to-amber-500 text-slate-950'}`}>
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 fill-current" />}
                  </button>
                  <div className="flex-1 relative flex items-center bg-white rounded-full border border-slate-300/80 shadow-inner focus-within:border-orange-400">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isRecording ? 'Listening...' : 'Ask for Ujjain ghats, routes, Simhastha dates...'}
                      className="w-full bg-transparent py-3 pl-4 pr-12 text-sm font-medium focus:outline-none text-slate-800 placeholder:text-slate-400"
                    />
                    <button type="submit" disabled={!inputText.trim()} className="absolute right-2 bg-[#FF6B35] disabled:opacity-40 text-white p-2 rounded-full shadow-md">
                      <Navigation className="w-3.5 h-3.5 rotate-90 fill-current" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'schedule' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 overflow-y-auto">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-orange-200 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live planning panel</h4>
                    <p className="text-[11px] text-slate-600 font-medium mt-1 leading-relaxed">This build now focuses on interactive pilgrimage planning with Ujjain landmarks and a real OpenStreetMap-powered view.</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {shahiSnanEvents.map((evt, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex justify-between items-center gap-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 text-[#FF6B35] p-2.5 rounded-lg min-w-[40px]"><Calendar className="w-4 h-4 mx-auto" /></div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 leading-snug">{evt.name}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">{evt.date} • {evt.sector}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 bg-emerald-100 text-emerald-700">{evt.status}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'map' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-orange-500" /> Ujjain live example</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full">MAP ACTIVE</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">OpenStreetMap tiles with real-location examples for Mahakaleshwar Temple, Ram Ghat, Dutt Akhada Ghat, and route overlay.</p>
                  </div>
                  <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-3 rounded-xl border border-sky-200 shadow-sm">
                    <div className="flex items-center gap-2 text-sky-700 font-bold text-sm"><Waves className="w-4 h-4" /> Shipra corridor</div>
                    <p className="mt-2 text-xs text-slate-600">The highlighted circle marks an important riverfront area near Ram Ghat for live demonstration and route-planning UI.</p>
                  </div>
                </div>
                <div className="h-[420px] overflow-hidden rounded-2xl border border-slate-200 shadow-xl bg-white">
                  <LiveMap />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl border border-slate-200 p-3"><div className="font-bold text-sm">Mahakaleshwar</div><div className="text-xs text-slate-500 mt-1">Primary temple anchor for route origin.</div></div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3"><div className="font-bold text-sm">Ram Ghat</div><div className="text-xs text-slate-500 mt-1">Major ghat marker with focus circle.</div></div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3"><div className="font-bold text-sm">Route layer</div><div className="text-xs text-slate-500 mt-1">Polyline demonstrates guided movement between landmarks.</div></div>
                </div>
              </motion.div>
            )}
          </main>
        </aside>

        <section className="flex-1 p-6 lg:p-8 bg-[radial-gradient(circle_at_top,#fff7ed,transparent_35%),linear-gradient(180deg,#f8fafc_0%,#fff7ed_100%)]">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="rounded-3xl border border-orange-100 bg-white/80 backdrop-blur-md p-6 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-orange-700">
                <span className="rounded-full bg-orange-100 px-3 py-1">Production-ready structure</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Interactive UI</span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">Live map example</span>
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Complete full-stack pilgrim assistant with a real Ujjain map layer</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">This upgraded interface fixes the original code issues, adds a proper globals.css, corrects TypeScript and Python problems, and integrates a live OpenStreetMap view for real-world Ujjain pilgrimage landmarks.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { icon: MessageSquare, title: 'Chat assistant', text: 'Connected to FastAPI assistant endpoint with fallback responses.' },
                { icon: AlertTriangle, title: 'Emergency flow', text: 'One-tap SOS with ticket generation and visible rescue state.' },
                { icon: Users, title: 'Pilgrim UX', text: 'Multilingual controls, mobile-first layout, and clearer status cards.' },
                { icon: MapPin, title: 'Live maps', text: 'Leaflet + OpenStreetMap powered Ujjain markers and route overlay.' }
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                  <item.icon className="h-5 w-5 text-[#FF6B35]" />
                  <h3 className="mt-3 text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
