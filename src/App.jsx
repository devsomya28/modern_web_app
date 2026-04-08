import { useState, useEffect, useRef, useReducer, useCallback } from "react";

// ─── THEME & FONTS ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0a0a0f;
      --surface:  #111118;
      --card:     #16161f;
      --border:   #1e1e2e;
      --accent:   #7c6af5;
      --accent2:  #f5a623;
      --accent3:  #3dd6ac;
      --text:     #e8e8f0;
      --muted:    #6b6b80;
      --danger:   #f56060;
      --sidebar-w: 220px;
      --radius:   14px;
    }
    
    html, body, #root { height: 100%; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      line-height: 1.6;
      overflow: hidden;
    }

    h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }
    code, pre, .mono { font-family: 'JetBrains Mono', monospace; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-w);
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    /* Main */
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    .page { flex: 1; overflow-y: auto; padding: 28px; }

    /* Chat Layout */
    .chat-layout { display: flex; height: 100%; overflow: hidden; }
    .chat-history-panel {
      width: 220px;
      flex-shrink: 0;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 16px 10px;
      overflow-y: auto;
    }
    .chat-main { flex: 1; display: flex; flex-direction: column; }

    /* Dashboard */
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
    .dash-grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }

    /* Tools */
    .tools-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }

    /* Notes */
    .notes-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 14px; }

    /* ========================= */
    /* ✅ RESPONSIVE ADDITIONS   */
    /* ========================= */

    /* Tablets */
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .dash-grid {
        grid-template-columns: 1fr;
      }

      .tools-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .chat-history-panel {
        display: none;
      }
    }

    /* Mobile */
    @media (max-width: 768px) {
      body {
        overflow: auto;
      }

      .app-shell {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        height: auto;
        flex-direction: row;
        overflow-x: auto;
      }

      .sidebar-nav {
        flex-direction: row;
        overflow-x: auto;
      }

      .main {
        width: 100%;
      }

      .page {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .tools-grid {
        grid-template-columns: 1fr;
      }

      .chat-layout {
        flex-direction: column;
      }

      .chat-messages {
        padding: 16px;
      }

      .chat-input-area {
        padding: 12px;
      }

      .msg-bubble {
        max-width: 100%;
      }
    }

    /* Small phones */
    @media (max-width: 480px) {
      .topbar {
        padding: 10px 16px;
      }

      .topbar-title {
        font-size: 16px;
      }

      .avatar {
        width: 28px;
        height: 28px;
        font-size: 11px;
      }

      .icon-btn {
        width: 30px;
        height: 30px;
      }

      .page {
        padding: 12px;
      }
    }


    html, body, #root { height: 100%; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      line-height: 1.6;
      overflow: hidden;
    }

    h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }
    code, pre, .mono { font-family: 'JetBrains Mono', monospace; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: var(--sidebar-w);
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      padding: 0;
    }
    .sidebar-logo {
      padding: 24px 20px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid var(--border);
    }
    .logo-mark {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, var(--accent), var(--accent3));
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0;
    }
    .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; letter-spacing: -0.5px; }
    .logo-text span { color: var(--accent); }

    .sidebar-nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; }
    .nav-section-label {
      font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
      color: var(--muted); padding: 12px 10px 4px; font-weight: 600;
    }
    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: 10px;
      cursor: pointer; color: var(--muted);
      font-size: 14px; font-weight: 500;
      transition: all .15s ease;
      border: none; background: none; width: 100%; text-align: left;
    }
    .nav-item:hover { background: var(--card); color: var(--text); }
    .nav-item.active { background: rgba(124,106,245,.15); color: var(--accent); }
    .nav-item .nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
    .nav-badge {
      margin-left: auto; font-size: 10px; font-weight: 700;
      background: var(--accent); color: #fff;
      border-radius: 99px; padding: 1px 6px; font-family: 'Syne', sans-serif;
    }

    .sidebar-footer { padding: 12px 10px; border-top: 1px solid var(--border); }

    /* ── Main ── */
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 28px; border-bottom: 1px solid var(--border);
      background: var(--surface); flex-shrink: 0;
    }
    .topbar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; }
    .topbar-right { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 34px; height: 34px; border-radius: 99px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; cursor: pointer;
    }
    .icon-btn {
      width: 34px; height: 34px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      background: var(--card); border: 1px solid var(--border);
      cursor: pointer; font-size: 16px; color: var(--muted);
      transition: all .15s;
    }
    .icon-btn:hover { color: var(--text); border-color: var(--accent); }

    .page { flex: 1; overflow-y: auto; padding: 28px; }

    /* ── Chat ── */
    .chat-layout { display: flex; height: 100%; gap: 0; overflow: hidden; }
    .chat-history-panel {
      width: 220px; flex-shrink: 0;
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      padding: 16px 10px;
      overflow-y: auto;
    }
    .chat-history-title {
      font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
      color: var(--muted); padding: 0 6px 10px; font-weight: 600;
    }
    .history-item {
      padding: 8px 10px; border-radius: 8px; cursor: pointer;
      font-size: 13px; color: var(--muted);
      transition: all .15s; margin-bottom: 2px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .history-item:hover { background: var(--card); color: var(--text); }
    .history-item.active { background: rgba(124,106,245,.12); color: var(--accent); }
    .history-date { font-size: 10px; color: var(--muted); padding: 8px 10px 2px; }
    .new-chat-btn {
      width: 100%; padding: 8px 10px; border-radius: 8px;
      background: rgba(124,106,245,.1); border: 1px dashed rgba(124,106,245,.3);
      color: var(--accent); font-size: 13px; cursor: pointer;
      display: flex; align-items: center; gap: 6px;
      margin-bottom: 12px; font-family: 'DM Sans', sans-serif;
      transition: all .15s;
    }
    .new-chat-btn:hover { background: rgba(124,106,245,.2); }

    .chat-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .chat-messages { flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }
    .chat-empty {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 12px; color: var(--muted); text-align: center;
      padding: 40px;
    }
    .chat-empty-icon { font-size: 48px; margin-bottom: 4px; }
    .chat-empty h3 { font-size: 20px; color: var(--text); font-family: 'Syne', sans-serif; }
    .chat-empty p { font-size: 14px; max-width: 320px; }
    .chat-suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 8px; }
    .suggestion-chip {
      padding: 7px 14px; border-radius: 99px;
      background: var(--card); border: 1px solid var(--border);
      font-size: 13px; cursor: pointer; color: var(--muted);
      transition: all .15s;
    }
    .suggestion-chip:hover { border-color: var(--accent); color: var(--accent); }

    .message { display: flex; gap: 12px; align-items: flex-start; animation: fadeUp .2s ease; }
    .message.user { flex-direction: row-reverse; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

    .msg-avatar {
      width: 32px; height: 32px; border-radius: 99px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700;
    }
    .msg-avatar.ai { background: linear-gradient(135deg, var(--accent), var(--accent3)); }
    .msg-avatar.user { background: linear-gradient(135deg, var(--accent2), #f08030); }

    .msg-bubble {
      max-width: 72%; padding: 12px 16px; border-radius: 16px;
      font-size: 14px; line-height: 1.65;
    }
    .message.ai .msg-bubble {
      background: var(--card); border: 1px solid var(--border);
      border-top-left-radius: 4px;
    }
    .message.user .msg-bubble {
      background: rgba(124,106,245,.2); border: 1px solid rgba(124,106,245,.3);
      border-top-right-radius: 4px;
    }
    .msg-time { font-size: 10px; color: var(--muted); margin-top: 4px; }

    .typing-dots span {
      display: inline-block; width: 6px; height: 6px; border-radius: 99px;
      background: var(--accent); margin: 0 2px;
      animation: dot-bounce .8s ease infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: .15s; }
    .typing-dots span:nth-child(3) { animation-delay: .3s; }
    @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }

    .chat-input-area {
      padding: 16px 28px 20px;
      border-top: 1px solid var(--border);
      background: var(--surface);
    }
    .chat-input-box {
      display: flex; align-items: flex-end; gap: 10px;
      background: var(--card); border: 1px solid var(--border);
      border-radius: 14px; padding: 10px 12px;
      transition: border-color .15s;
    }
    .chat-input-box:focus-within { border-color: var(--accent); }
    .chat-input-box textarea {
      flex: 1; background: none; border: none; outline: none;
      color: var(--text); font-family: 'DM Sans', sans-serif;
      font-size: 14px; resize: none; line-height: 1.5;
      max-height: 140px;
    }
    .chat-input-box textarea::placeholder { color: var(--muted); }
    .send-btn {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--accent); border: none;
      color: #fff; cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all .15s;
    }
    .send-btn:hover { background: #6a5ae0; transform: scale(1.05); }
    .send-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

    /* ── Dashboard ── */
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
    .stat-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 20px;
      position: relative; overflow: hidden;
    }
    .stat-card::before {
      content: ''; position: absolute; top: 0; right: 0;
      width: 80px; height: 80px; border-radius: 99px;
      opacity: .06; transform: translate(20px,-20px);
    }
    .stat-card.c1::before { background: var(--accent); }
    .stat-card.c2::before { background: var(--accent2); }
    .stat-card.c3::before { background: var(--accent3); }
    .stat-card.c4::before { background: var(--danger); }

    .stat-icon { font-size: 22px; margin-bottom: 10px; }
    .stat-value { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
    .stat-label { font-size: 12px; color: var(--muted); }
    .stat-delta { font-size: 11px; margin-top: 6px; color: var(--accent3); }

    .dash-grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
    .dash-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 20px;
    }
    .dash-card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

    .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
    .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
    .bar {
      width: 100%; border-radius: 6px 6px 0 0;
      background: linear-gradient(180deg, var(--accent), rgba(124,106,245,.3));
      transition: height .4s ease;
    }
    .bar-label { font-size: 10px; color: var(--muted); }

    .activity-list { display: flex; flex-direction: column; gap: 12px; }
    .activity-item { display: flex; align-items: center; gap: 12px; }
    .activity-dot { width: 8px; height: 8px; border-radius: 99px; flex-shrink: 0; }
    .activity-text { font-size: 13px; flex: 1; }
    .activity-time { font-size: 11px; color: var(--muted); }

    .tool-usage-list { display: flex; flex-direction: column; gap: 14px; }
    .tool-usage-item { }
    .tool-usage-header { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
    .tool-usage-bar { height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; }
    .tool-usage-fill { height: 100%; border-radius: 99px; transition: width .6s ease; }

    /* ── Tools ── */
    .tools-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 28px; }
    .tool-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 20px;
      cursor: pointer; transition: all .2s;
      position: relative; overflow: hidden;
    }
    .tool-card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .tool-card.active { border-color: var(--accent); background: rgba(124,106,245,.07); }
    .tool-card-icon { font-size: 28px; margin-bottom: 12px; }
    .tool-card-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 4px; }
    .tool-card-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
    .tool-card-badge {
      position: absolute; top: 14px; right: 14px;
      font-size: 9px; letter-spacing: 1px; text-transform: uppercase; font-weight: 700;
      padding: 2px 6px; border-radius: 4px; background: rgba(124,106,245,.2); color: var(--accent);
    }

    .tool-workspace {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 24px;
    }
    .tool-workspace-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .tool-workspace-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; }

    .textarea-field {
      width: 100%; min-height: 140px; padding: 14px 16px;
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 10px; color: var(--text);
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      resize: vertical; outline: none; line-height: 1.6;
      transition: border-color .15s;
    }
    .textarea-field:focus { border-color: var(--accent); }
    .textarea-field::placeholder { color: var(--muted); }

    .input-field {
      width: 100%; padding: 11px 14px;
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 10px; color: var(--text);
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      outline: none; transition: border-color .15s;
    }
    .input-field:focus { border-color: var(--accent); }
    .input-field::placeholder { color: var(--muted); }

    .select-field {
      padding: 9px 14px;
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 10px; color: var(--text);
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      outline: none; cursor: pointer;
    }

    .btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 10px 20px; border-radius: 10px; border: none;
      font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
      cursor: pointer; transition: all .15s;
    }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { background: #6a5ae0; }
    .btn-primary:disabled { opacity: .4; cursor: not-allowed; }
    .btn-secondary { background: var(--card); border: 1px solid var(--border); color: var(--text); }
    .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

    .result-box {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 10px; padding: 16px;
      font-size: 14px; line-height: 1.7; color: var(--text);
      position: relative;
    }
    .result-box.code { font-family: 'JetBrains Mono', monospace; font-size: 13px; white-space: pre-wrap; }
    .result-label {
      font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
      color: var(--accent); font-weight: 700; margin-bottom: 10px;
    }
    .copy-btn {
      position: absolute; top: 12px; right: 12px;
      padding: 4px 10px; border-radius: 6px; background: var(--card);
      border: 1px solid var(--border); color: var(--muted);
      font-size: 11px; cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: all .15s;
    }
    .copy-btn:hover { border-color: var(--accent3); color: var(--accent3); }

    /* ── Settings ── */
    .settings-section { margin-bottom: 28px; }
    .settings-section-title {
      font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
      color: var(--muted); text-transform: uppercase; letter-spacing: 1px;
      margin-bottom: 14px;
    }
    .settings-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden;
    }
    .settings-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px; border-bottom: 1px solid var(--border);
    }
    .settings-row:last-child { border-bottom: none; }
    .settings-row-label { font-size: 14px; }
    .settings-row-desc { font-size: 12px; color: var(--muted); }

    .toggle {
      width: 40px; height: 22px; border-radius: 99px;
      background: var(--border); position: relative; cursor: pointer;
      transition: background .2s; flex-shrink: 0;
    }
    .toggle.on { background: var(--accent); }
    .toggle::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 18px; height: 18px; border-radius: 99px;
      background: #fff; transition: left .2s;
    }
    .toggle.on::after { left: 20px; }

    .tag {
      display: inline-block; padding: 2px 8px; border-radius: 6px;
      font-size: 11px; font-weight: 600;
    }
    .tag-purple { background: rgba(124,106,245,.15); color: var(--accent); }
    .tag-green  { background: rgba(61,214,172,.15);  color: var(--accent3); }
    .tag-orange { background: rgba(245,166,35,.15);  color: var(--accent2); }

    /* ── Notes ── */
    .notes-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 14px; }
    .note-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 16px;
      cursor: pointer; transition: all .2s;
    }
    .note-card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .note-card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 6px; }
    .note-card-preview { font-size: 12px; color: var(--muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .note-card-meta { display: flex; justify-content: space-between; margin-top: 12px; font-size: 11px; color: var(--muted); }

    /* misc */
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; }
    .mb-3 { margin-bottom: 12px; }
    .mb-4 { margin-bottom: 16px; }
    .label { font-size: 12px; color: var(--muted); margin-bottom: 6px; font-weight: 500; }
    .divider { height: 1px; background: var(--border); margin: 16px 0; }
    .empty-state { text-align: center; color: var(--muted); padding: 40px; font-size: 14px; }
    .spinner { width:18px;height:18px;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:99px;animation:spin .6s linear infinite;display:inline-block; }
    @keyframes spin{to{transform:rotate(360deg)}}
  `}</style>
);

// ─── STATE ────────────────────────────────────────────────────────────────────
const TOOLS = [
  { id: "summarizer", icon: "📝", name: "Text Summarizer", desc: "Condense long text into clear, concise summaries instantly.", badge: "AI" },
  { id: "notes", icon: "🗒️", name: "Notes Generator", desc: "Transform raw content into structured, organized notes.", badge: "AI" },
  { id: "code", icon: "⚡", name: "Code Explainer", desc: "Understand any code snippet with plain-language explanations.", badge: "AI" },
];

const initialState = {
  page: "chat",
  activeTool: "summarizer",
  chats: [
    { id: 1, title: "Getting started", messages: [{ role: "ai", text: "Hi! I'm your AI assistant. How can I help you today?", time: "9:00 AM" }], date: "Today" },
    { id: 2, title: "React best practices", messages: [{ role: "user", text: "What are React best practices?", time: "Yesterday" }, { role: "ai", text: "Here are some key React best practices:\n\n1. **Component design**: Keep components small and focused.\n2. **State management**: Use local state when possible; lift state up when needed.\n3. **Performance**: Memoize expensive computations with useMemo.\n4. **Keys**: Always use stable, unique keys in lists.\n5. **Error boundaries**: Wrap critical sections for graceful error handling.", time: "Yesterday" }], date: "Yesterday" },
    { id: 3, title: "Python debugging tips", messages: [{ role: "user", text: "Help me debug Python", time: "Mon" }, { role: "ai", text: "Sure! For Python debugging, use `pdb` for interactive debugging, `print()` for quick checks, and `logging` for production code. Tools like VS Code's debugger or PyCharm make it even easier.", time: "Mon" }], date: "This Week" },
  ],
  activeChatId: 1,
  settings: {
    darkMode: true, notifications: true, streaming: true, saveHistory: true,
    model: "claude-sonnet-4-20250514", language: "English",
  },
  notes: [
    { id: 1, title: "Project Ideas", content: "1. AI workspace app\n2. Real-time collaboration tool\n3. Smart calendar assistant", tag: "purple", created: "Apr 5" },
    { id: 2, title: "Meeting Notes", content: "Discussed Q2 roadmap. Key items: improve onboarding flow, add dark mode, launch mobile app.", tag: "green", created: "Apr 4" },
    { id: 3, title: "Book Summary", content: "Atomic Habits: Small 1% improvements compound over time. Focus on systems, not goals.", tag: "orange", created: "Apr 2" },
  ],
  stats: { chats: 24, tasks: 58, toolsUsed: 137, tokensUsed: 42800 },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PAGE": return { ...state, page: action.payload };
    case "SET_TOOL": return { ...state, activeTool: action.payload };
    case "SET_CHAT": return { ...state, activeChatId: action.payload };
    case "NEW_CHAT": {
      const id = Date.now();
      return {
        ...state,
        chats: [{ id, title: "New conversation", messages: [{ role: "ai", text: "Hello! I'm ready to help. What's on your mind?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }], date: "Today" }, ...state.chats],
        activeChatId: id,
      };
    }
    case "ADD_MESSAGE": {
      const chats = state.chats.map(c => c.id === state.activeChatId
        ? { ...c, messages: [...c.messages, action.payload], title: c.title === "New conversation" && action.payload.role === "user" ? action.payload.text.slice(0, 36) + "…" : c.title }
        : c);
      return { ...state, chats };
    }
    case "TOGGLE_SETTING": return { ...state, settings: { ...state.settings, [action.key]: !state.settings[action.key] } };
    case "ADD_NOTE": return { ...state, notes: [action.payload, ...state.notes] };
    case "INC_STAT": return { ...state, stats: { ...state.stats, [action.key]: state.stats[action.key] + action.by } };
    default: return state;
  }
}

// ─── AI CALL ──────────────────────────────────────────────────────────────────
async function callAI(messages) {
  try {
    const res = await fetch("https://modern-web-app-bca8.onrender.com/api/chat", {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    console.log("AI RESPONSE:", data);

    return data.reply || "No response from AI";
  } catch (err) {
    console.error("Frontend error:", err);
    return "⚠️ Failed to connect to server";
  }
}


// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Sidebar({ state, dispatch }) {
  const navItems = [
    { id: "chat", icon: "💬", label: "Chat", badge: state.chats.length },
    { id: "tools", icon: "🧠", label: "Smart Tools" },
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "history", icon: "🕐", label: "History" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">✦</div>
        <div className="logo-text">Aura<span>AI</span></div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-label">Workspace</div>
        {navItems.slice(0, 3).map(n => (
          <button key={n.id} className={`nav-item ${state.page === n.id ? "active" : ""}`} onClick={() => dispatch({ type: "SET_PAGE", payload: n.id })}>
            <span className="nav-icon">{n.icon}</span>
            {n.label}
            {n.badge && <span className="nav-badge">{n.badge}</span>}
          </button>
        ))}
        <div className="nav-section-label">Manage</div>
        {navItems.slice(3).map(n => (
          <button key={n.id} className={`nav-item ${state.page === n.id ? "active" : ""}`} onClick={() => dispatch({ type: "SET_PAGE", payload: n.id })}>
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="nav-item">
          <span className="nav-icon">🌐</span>
          <div>
            <div style={{ fontSize: 13 }}>Free Plan</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Upgrade to Pro</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const PAGE_TITLES = { chat: "AI Chat", tools: "Smart Tools", dashboard: "Dashboard", history: "Chat History", settings: "Settings" };

function Topbar({ state }) {
  const now = new Date().toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{PAGE_TITLES[state.page]}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{now}</div>
      </div>
      <div className="topbar-right">
        <div className="icon-btn" title="Search">🔍</div>
        <div className="icon-btn" title="Notifications">🔔</div>
        <div className="avatar" title="Profile">U</div>
      </div>
    </div>
  );
}

// ── Chat Page ──────────────────────────────────────────────────────────────────
function ChatPage({ state, dispatch }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const activeChat = state.chats.find(c => c.id === state.activeChatId);
  const msgs = activeChat?.messages || [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  const send = useCallback(async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; }

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    dispatch({ type: "ADD_MESSAGE", payload: { role: "user", text: userText, time } });
    setLoading(true);
    dispatch({ type: "INC_STAT", key: "chats", by: 0 });

    const history = msgs.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
    history.push({ role: "user", content: userText });

    try {
      const reply = await callAI(history);
      dispatch({ type: "ADD_MESSAGE", payload: { role: "ai", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } });
    } catch {
      dispatch({ type: "ADD_MESSAGE", payload: { role: "ai", text: "⚠️ Could not reach the AI. Please try again.", time } });
    } finally {
      setLoading(false);
    }
  }, [input, loading, msgs, dispatch]);

  const suggestions = ["Explain quantum computing", "Write a Python function", "Summarize the news", "Give me a recipe idea"];

  return (
    <div className="chat-layout" style={{ height: "100%" }}>
      <div className="chat-history-panel">
        <button className="new-chat-btn" onClick={() => dispatch({ type: "NEW_CHAT" })}>＋ New Chat</button>
        {["Today", "Yesterday", "This Week"].map(group => {
          const group_chats = state.chats.filter(c => c.date === group);
          if (!group_chats.length) return null;
          return (
            <div key={group}>
              <div className="history-date">{group}</div>
              {group_chats.map(c => (
                <div key={c.id} className={`history-item ${state.activeChatId === c.id ? "active" : ""}`} onClick={() => dispatch({ type: "SET_CHAT", payload: c.id })} title={c.title}>
                  {c.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="chat-main">
        <div className="chat-messages">
          {msgs.length === 1 && msgs[0].role === "ai" ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">✦</div>
              <h3>How can I help you?</h3>
              <p>Ask me anything — from code and writing to research and brainstorming.</p>
              <div className="chat-suggestions">
                {suggestions.map(s => <div key={s} className="suggestion-chip" onClick={() => send(s)}>{s}</div>)}
              </div>
            </div>
          ) : (
            msgs.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <div className={`msg-avatar ${m.role}`}>{m.role === "ai" ? "✦" : "U"}</div>
                <div>
                  <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                  <div className="msg-time">{m.time}</div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message ai">
              <div className="msg-avatar ai">✦</div>
              <div className="msg-bubble"><div className="typing-dots"><span /><span /><span /></div></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <div className="chat-input-box">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Message AuraAI..."
              value={input}
              onChange={e => { setInput(e.target.value); autoResize(e); }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <button className="send-btn" onClick={() => send()} disabled={!input.trim() || loading}>
              {loading ? <span className="spinner" /> : "↑"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, textAlign: "center" }}>Press Enter to send · Shift+Enter for new line</div>
        </div>
      </div>
    </div>
  );
}

// ── Tools Page ─────────────────────────────────────────────────────────────────
function ToolsPage({ state, dispatch }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState("JavaScript");
  const activeTool = state.activeTool;

  useEffect(() => { setInput(""); setOutput(""); }, [activeTool]);

  const SYSTEM_PROMPTS = {
    summarizer: "You are an expert text summarizer. Provide a clear, concise summary with key points. Use bullet points when helpful.",
    notes: "You are a smart notes generator. Convert the given content into well-structured, organized notes with clear headings and bullet points.",
    code: "You are an expert code explainer. Explain the given code clearly in plain English. Cover: what it does, how it works, key concepts used, and any potential improvements.",
  };

  const run = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setOutput("");
    const prompt = activeTool === "code" ? `Explain this ${lang} code:\n\n\`\`\`${lang.toLowerCase()}\n${input}\n\`\`\`` : input;
    try {
     const res = await callAI([{ role: "user", content: prompt }]);
      setOutput(res);
      dispatch({ type: "INC_STAT", key: "tasks", by: 1 });
      dispatch({ type: "INC_STAT", key: "toolsUsed", by: 1 });
    } catch { setOutput("⚠️ Error calling AI. Please try again."); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const saveNote = () => {
    if (!output) return;
    dispatch({
      type: "ADD_NOTE",
      payload: { id: Date.now(), title: input.slice(0, 32) + "…", content: output.slice(0, 200), tag: "purple", created: "Just now" },
    });
    alert("Saved to notes!");
  };

  const PLACEHOLDERS = {
    summarizer: "Paste any long article, document, or text here and I'll summarize it for you…",
    notes: "Paste lecture notes, meeting transcripts, or any content to convert into organized notes…",
    code: "Paste your code snippet here and I'll explain what it does…",
  };

  return (
    <div>
      <div className="tools-grid">
        {TOOLS.map(t => (
          <div key={t.id} className={`tool-card ${state.activeTool === t.id ? "active" : ""}`} onClick={() => dispatch({ type: "SET_TOOL", payload: t.id })}>
            <div className="tool-card-badge">{t.badge}</div>
            <div className="tool-card-icon">{t.icon}</div>
            <div className="tool-card-name">{t.name}</div>
            <div className="tool-card-desc">{t.desc}</div>
          </div>
        ))}
      </div>

      <div className="tool-workspace">
        <div className="tool-workspace-header">
          <div className="tool-workspace-title">{TOOLS.find(t => t.id === activeTool)?.name}</div>
          <div className="flex gap-2">
            {activeTool === "code" && (
              <select className="select-field" value={lang} onChange={e => setLang(e.target.value)}>
                {["JavaScript", "Python", "TypeScript", "Java", "C++", "Rust", "Go", "HTML/CSS"].map(l => <option key={l}>{l}</option>)}
              </select>
            )}
            <button className="btn btn-secondary" onClick={() => { setInput(""); setOutput(""); }}>Clear</button>
          </div>
        </div>

        <div className="label">Input</div>
        <textarea className="textarea-field mb-4" value={input} onChange={e => setInput(e.target.value)} placeholder={PLACEHOLDERS[activeTool]} style={{ minHeight: 160 }} />

        <div className="flex gap-2 mb-4">
          <button className="btn btn-primary" onClick={run} disabled={!input.trim() || loading}>
            {loading ? <><span className="spinner" /> Processing…</> : <> ✨ Run {TOOLS.find(t => t.id === activeTool)?.name}</>}
          </button>
        </div>

        {output && (
          <div>
            <div className="label">Output</div>
            <div className={`result-box ${activeTool === "code" ? "code" : ""}`} style={{ position: "relative" }}>
              <button className="copy-btn" onClick={copy}>{copied ? "✓ Copied" : "Copy"}</button>
              <div style={{ whiteSpace: "pre-wrap", paddingRight: 60 }}>{output}</div>
            </div>
            <div className="flex gap-2" style={{ marginTop: 12 }}>
              <button className="btn btn-secondary" onClick={saveNote}>📌 Save to Notes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardPage({ state }) {
  const { stats } = state;
  const barData = [
    { label: "Mon", v: 65 }, { label: "Tue", v: 82 }, { label: "Wed", v: 45 },
    { label: "Thu", v: 90 }, { label: "Fri", v: 78 }, { label: "Sat", v: 55 }, { label: "Sun", v: 38 },
  ];
  const maxBar = Math.max(...barData.map(b => b.v));
  const activities = [
    { color: "var(--accent)", text: "Chat conversation completed", time: "2m ago" },
    { color: "var(--accent3)", text: "Text summarized successfully", time: "18m ago" },
    { color: "var(--accent2)", text: "Code snippet explained", time: "1h ago" },
    { color: "var(--accent)", text: "Notes generated from content", time: "2h ago" },
    { color: "var(--accent3)", text: "New chat session started", time: "3h ago" },
  ];
  const toolUsage = [
    { name: "AI Chat", pct: 58, color: "var(--accent)" },
    { name: "Summarizer", pct: 23, color: "var(--accent2)" },
    { name: "Code Explainer", pct: 12, color: "var(--accent3)" },
    { name: "Notes Generator", pct: 7, color: "var(--danger)" },
  ];

  return (
    <div>
      <div className="stats-grid">
        {[
          { cls: "c1", icon: "💬", val: stats.chats, label: "Total Chats", delta: "+3 today" },
          { cls: "c2", icon: "✅", val: stats.tasks, label: "Tasks Completed", delta: "+8 this week" },
          { cls: "c3", icon: "🧠", val: stats.toolsUsed, label: "Tools Used", delta: "+12 this week" },
          { cls: "c4", icon: "⚡", val: (stats.tokensUsed / 1000).toFixed(1) + "k", label: "Tokens Used", delta: "~4.2k avg/day" },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-delta">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div>
          <div className="dash-card" style={{ marginBottom: 16 }}>
            <div className="dash-card-title">Weekly Activity</div>
            <div className="bar-chart">
              {barData.map(b => (
                <div key={b.label} className="bar-wrap">
                  <div className="bar" style={{ height: `${(b.v / maxBar) * 100}%` }} />
                  <div className="bar-label">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="dash-card">
            <div className="dash-card-title">Tool Usage Breakdown</div>
            <div className="tool-usage-list">
              {toolUsage.map(t => (
                <div key={t.name} className="tool-usage-item">
                  <div className="tool-usage-header"><span>{t.name}</span><span style={{ color: "var(--muted)" }}>{t.pct}%</span></div>
                  <div className="tool-usage-bar">
                    <div className="tool-usage-fill" style={{ width: `${t.pct}%`, background: t.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-title">Recent Activity</div>
          <div className="activity-list">
            {activities.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: a.color }} />
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── History Page ───────────────────────────────────────────────────────────────
function HistoryPage({ state, dispatch }) {
  const [search, setSearch] = useState("");
  const filtered = state.chats.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="mb-4">
        <input className="input-field" placeholder="🔍  Search conversations…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
      </div>
      <div className="notes-grid">
        {filtered.map(c => (
          <div key={c.id} className="note-card" onClick={() => { dispatch({ type: "SET_CHAT", payload: c.id }); dispatch({ type: "SET_PAGE", payload: "chat" }); }}>
            <div className="note-card-title">💬 {c.title}</div>
            <div className="note-card-preview">{c.messages[c.messages.length - 1]?.text}</div>
            <div className="note-card-meta">
              <span>{c.date}</span>
              <span>{c.messages.length} msgs</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state">No conversations found.</div>}
      </div>
    </div>
  );
}

// ── Settings Page ──────────────────────────────────────────────────────────────
function SettingsPage({ state, dispatch }) {
  const { settings } = state;
  const Toggle = ({ k }) => (
    <div className={`toggle ${settings[k] ? "on" : ""}`} onClick={() => dispatch({ type: "TOGGLE_SETTING", key: k })} />
  );
  return (
    <div style={{ maxWidth: 640 }}>
      <div className="settings-section">
        <div className="settings-section-title">Appearance</div>
        <div className="settings-card">
          <div className="settings-row">
            <div><div className="settings-row-label">Dark Mode</div><div className="settings-row-desc">Use dark theme across the workspace</div></div>
            <Toggle k="darkMode" />
          </div>
          <div className="settings-row">
            <div><div className="settings-row-label">Language</div><div className="settings-row-desc">Interface language</div></div>
            <select className="select-field" value={settings.language} onChange={() => {}}>
              {["English", "Hindi", "Spanish", "French"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-section-title">AI Model</div>
        <div className="settings-card">
          <div className="settings-row">
            <div><div className="settings-row-label">Model</div><div className="settings-row-desc">Currently using Claude Sonnet 4</div></div>
            <span className="tag tag-purple">claude-sonnet-4</span>
          </div>
          <div className="settings-row">
            <div><div className="settings-row-label">Streaming Responses</div><div className="settings-row-desc">Show AI response as it's generated</div></div>
            <Toggle k="streaming" />
          </div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-section-title">Privacy & Data</div>
        <div className="settings-card">
          <div className="settings-row">
            <div><div className="settings-row-label">Save Chat History</div><div className="settings-row-desc">Store conversations locally</div></div>
            <Toggle k="saveHistory" />
          </div>
          <div className="settings-row">
            <div><div className="settings-row-label">Notifications</div><div className="settings-row-desc">Alert when AI finishes long tasks</div></div>
            <Toggle k="notifications" />
          </div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-section-title">About</div>
        <div className="settings-card">
          <div className="settings-row"><div className="settings-row-label">Version</div><span className="tag tag-green">v1.0.0</span></div>
          <div className="settings-row"><div className="settings-row-label">Plan</div><span className="tag tag-orange">Free</span></div>
          <div className="settings-row"><div className="settings-row-label">Built with</div><span style={{ color: "var(--muted)", fontSize: 13 }}>React + Anthropic Claude API</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const pages = { chat: ChatPage, tools: ToolsPage, dashboard: DashboardPage, history: HistoryPage, settings: SettingsPage };
  const PageComponent = pages[state.page];

  return (
    <>
      <GlobalStyles />
      <div className="app-shell">
        <Sidebar state={state} dispatch={dispatch} />
        <div className="main">
          <Topbar state={state} />
          {state.page === "chat"
            ? <ChatPage state={state} dispatch={dispatch} />
            : <div className="page"><PageComponent state={state} dispatch={dispatch} /></div>
          }
        </div>
      </div>
    </>
  );
}
