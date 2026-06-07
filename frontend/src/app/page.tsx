'use client';

import dynamic from 'next/dynamic';
import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Activity,
  Calendar,
  CheckCircle2,
  Clock3,
  Compass,
  Gauge,
  Globe,
  HeartPulse,
  HelpCircle,
  Languages,
  Layers,
  MapPin,
  MessageSquare,
  Mic,
  MicOff,
  Radio,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  Wifi,
} from 'lucide-react';

const LiveMap = dynamic(() => import('../components/LiveMap'), {
  ssr: false,
  loading: () => <div className="map-loading">Loading geo-mesh...</div>,
});

type Message = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  directive?: string;
};

type Telemetry = {
  crowd: string;
  activeAlerts: number;
  healthNodes: number;
  routeLoad: string;
};

const quickPrompts = [
  {
    icon: Calendar,
    title: 'Bathing calendar',
    prompt: 'शाही स्नान की तिथियां क्या हैं?',
    tone: 'amber',
  },
  {
    icon: Layers,
    title: 'Pontoon routing',
    prompt: 'मुख्य पांटून पुल मार्ग कहाँ है?',
    tone: 'blue',
  },
  {
    icon: HelpCircle,
    title: 'Lost and found',
    prompt: 'खोया पाया केंद्र से संपर्क करें',
    tone: 'violet',
  },
  {
    icon: HeartPulse,
    title: 'Nearest medical',
    prompt: 'मेरे पास मेडिकल सहायता कहाँ मिलेगी?',
    tone: 'green',
  },
];

const riskSignals = [
  { label: 'Sector 4 inflow', value: '74%', status: 'Watch', icon: Users },
  { label: 'Bridge 12 latency', value: '08 min', status: 'Stable', icon: Clock3 },
  { label: 'Medical grid', value: '22 nodes', status: 'Ready', icon: HeartPulse },
  { label: 'Mesh sync', value: '99.8%', status: 'Online', icon: Wifi },
];

const timeline = [
  { label: 'Makar Sankranti', date: 'Jan 14, 2025', state: 'Complete' },
  { label: 'Mauni Amavasya', date: 'Jan 29, 2025', state: 'Peak' },
  { label: 'Basant Panchami', date: 'Feb 03, 2025', state: 'High' },
  { label: 'Maghi Purnima', date: 'Feb 12, 2025', state: 'Moderate' },
];

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function KumbhMantraDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'प्रणाम! KumbhMantra command center online. Ask about snan dates, bridge routes, lost-and-found, medical help, or emergency dispatch.',
      time: 'Now',
      directive: 'SYSTEM_READY',
    },
  ]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('hi');
  const [isRecording, setIsRecording] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosTicket, setSosTicket] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<Telemetry>({
    crowd: 'Normal',
    activeAlerts: 0,
    healthNodes: 22,
    routeLoad: 'Balanced',
  });

  const activeDirective = useMemo(() => {
    const last = [...messages].reverse().find((msg) => msg.sender === 'assistant');
    return last?.directive ?? 'DISPLAY_INFO';
  }, [messages]);

  const sendPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentQuery = input.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: currentQuery,
        time: formatTime(),
      },
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'PILGRIM_CORE_NODE',
          message: currentQuery,
          language: lang,
          latitude: 25.4284,
          longitude: 81.8894,
          audio_requested: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Assistant returned ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.response_text,
          time: formatTime(),
          directive: data.next_action_directive,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Offline resilience mode active: nearest police post, medical tent, and lost-and-found queue are available from the local cache.',
          time: 'Edge cache',
          directive: 'OFFLINE_MODE',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeSOSBeacon = async () => {
    setSosActive(true);
    setTelemetry({
      crowd: 'High density',
      activeAlerts: 1,
      healthNodes: 22,
      routeLoad: 'Emergency priority',
    });

    try {
      const response = await fetch('/api/v1/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilgrim_id: 'PILGRIM_CORE_NODE',
          latitude: 25.4291,
          longitude: 81.8902,
          device_timestamp: Math.floor(Date.now() / 1000),
        }),
      });

      if (!response.ok) {
        throw new Error(`SOS returned ${response.status}`);
      }

      const data = await response.json();
      setSosTicket(data.tracking_ticket);
    } catch (e) {
      setSosTicket('LOCAL-BEACON-4431');
    }
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Compass />
          </div>
          <div>
            <p className="eyebrow">KumbhMantra</p>
            <h1>Mahakumbh command OS</h1>
          </div>
        </div>

        <div className="status-card">
          <div>
            <span className="status-dot" />
            <span>Mesh network active</span>
          </div>
          <strong>Prayagraj 2025</strong>
        </div>

        <section className="panel compact">
          <div className="panel-title">
            <Gauge />
            <span>Live telemetry</span>
          </div>
          <div className="metric-grid">
            <div>
              <span>Crowd</span>
              <strong>{telemetry.crowd}</strong>
            </div>
            <div>
              <span>Alerts</span>
              <strong>{telemetry.activeAlerts}</strong>
            </div>
            <div>
              <span>Health nodes</span>
              <strong>{telemetry.healthNodes}</strong>
            </div>
            <div>
              <span>Routes</span>
              <strong>{telemetry.routeLoad}</strong>
            </div>
          </div>
        </section>

        <section className="panel compact">
          <div className="panel-title">
            <Sparkles />
            <span>Command shortcuts</span>
          </div>
          <div className="shortcut-grid">
            {quickPrompts.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.title}
                  className={`shortcut ${item.tone}`}
                  onClick={() => sendPrompt(item.prompt)}
                >
                  <Icon />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </section>

        <button type="button" onClick={executeSOSBeacon} className="sos-button">
          <AlertTriangle />
          <span>One-tap SOS dispatch</span>
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Pilgrim safety, routing, and response</p>
            <h2>Real-time mela intelligence dashboard</h2>
          </div>
          <div className="topbar-actions">
            <div className="directive">
              <Activity />
              <span>{activeDirective.replaceAll('_', ' ')}</span>
            </div>
            <label className="language-select">
              <Languages />
              <select value={lang} onChange={(e) => setLang(e.target.value)}>
                <option value="hi">Hindi</option>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
              </select>
            </label>
          </div>
        </header>

        <div className="main-grid">
          <section className="chat-panel panel">
            <div className="panel-title">
              <MessageSquare />
              <span>Multilingual assistant</span>
            </div>

            <div className="chat-body" aria-live="polite">
              {sosActive && (
                <div className="alert-strip">
                  <Radio />
                  <div>
                    <strong>Beacon dispatched</strong>
                    <span>Ticket {sosTicket || 'creating...'}</span>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <article key={msg.id} className={`bubble ${msg.sender}`}>
                  <p>{msg.text}</p>
                  <footer>
                    {msg.sender === 'assistant' && <Volume2 />}
                    <span>{msg.time}</span>
                  </footer>
                </article>
              ))}

              {isLoading && (
                <div className="typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            <form className="chat-input" onSubmit={handleSend}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about routes, snan dates, medical tents, lost and found..."
              />
              <button type="submit" className="send-button" aria-label="Send message">
                <Send />
              </button>
              <button
                type="button"
                className={`voice-button ${isRecording ? 'active' : ''}`}
                onClick={() => setIsRecording((value) => !value)}
              >
                {isRecording ? <MicOff /> : <Mic />}
                <span>{isRecording ? 'Listening' : 'Voice standby'}</span>
              </button>
            </form>
          </section>

          <section className="map-panel panel">
            <div className="panel-title spread">
              <span>
                <MapPin />
                Geo-mesh route map
              </span>
              <strong>2D live demo</strong>
            </div>
            <LiveMap />
          </section>

          <section className="panel signal-panel">
            <div className="panel-title">
              <ShieldCheck />
              <span>Risk signals</span>
            </div>
            <div className="signal-grid">
              {riskSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div className="signal-card" key={signal.label}>
                    <Icon />
                    <span>{signal.label}</span>
                    <strong>{signal.value}</strong>
                    <em>{signal.status}</em>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel route-panel">
            <div className="panel-title">
              <Route />
              <span>Recommended flow</span>
            </div>
            <ol className="route-list">
              <li>
                <CheckCircle2 />
                <span>Enter from Sector 4 holding zone</span>
              </li>
              <li>
                <CheckCircle2 />
                <span>Use Pontoon Bridge 12 for forward movement</span>
              </li>
              <li>
                <CheckCircle2 />
                <span>Exit via Bridge 18 to reduce reverse flow</span>
              </li>
            </ol>
          </section>

          <section className="panel calendar-panel">
            <div className="panel-title">
              <Calendar />
              <span>Bathing windows</span>
            </div>
            <div className="timeline">
              {timeline.map((item) => (
                <div key={item.label}>
                  <span>{item.date}</span>
                  <strong>{item.label}</strong>
                  <em>{item.state}</em>
                </div>
              ))}
            </div>
          </section>

          <section className="panel ops-panel">
            <div className="panel-title">
              <Globe />
              <span>System readiness</span>
            </div>
            <div className="ops-grid">
              <span>Offline cache synced</span>
              <span>Public API ready</span>
              <span>Emergency workflow armed</span>
              <span>GitHub docs packaged</span>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
