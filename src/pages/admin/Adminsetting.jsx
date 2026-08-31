export function AdminSettings() {
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);
  const exportData = useAdminStore((s) => s.exportData);
  const reset = useAdminStore((s) => s.resetAdminData);

  const toggle = (key) => {
    updateSettings({
      [key]: !settings?.[key],
    });
  };

  const download = () => {
    const data = exportData();

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "animeverse-admin-backup.json";

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const SettingToggle = ({
    title,
    description,
    settingKey,
    danger = false,
  }) => {
    const enabled = Boolean(settings?.[settingKey]);

    return (
      <div className="av-setting-item">
        <div className="av-setting-content">
          <div className="av-setting-title-row">
            <strong>{title}</strong>

            <span
              className={`av-setting-status ${
                enabled
                  ? "av-setting-status-on"
                  : "av-setting-status-off"
              }`}
            >
              {enabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <span className="av-setting-description">
            {description}
          </span>
        </div>

        <button
          type="button"
          aria-label={`${title} ${enabled ? "disable" : "enable"}`}
          aria-pressed={enabled}
          className={`av-switch ${
            enabled ? "av-switch-on" : ""
          } ${danger ? "av-switch-danger" : ""}`}
          onClick={() => toggle(settingKey)}
        >
          <span className="av-switch-track">
            <span className="av-switch-thumb" />
          </span>
        </button>
      </div>
    );
  };

  return (
    <AdminShell
      title="System Settings"
      eyebrow="ADMINISTRATION"
      description="Control site behaviour, access policies and administration data."
    >
      <div className="av-settings-page">

        {/* GENERAL */}
        <section className="av-settings-card">
          <div className="av-settings-card-header">
            <div>
              <span className="av-settings-label">
                GENERAL
              </span>

              <h2>Platform Behaviour</h2>

              <p>
                Manage how AnimeVerse behaves for visitors and
                registered users.
              </p>
            </div>

            <div className="av-settings-icon">
              <Settings size={20} />
            </div>
          </div>

          <div className="av-settings-list">

            <SettingToggle
              title="Maintenance Mode"
              description="Temporarily disable normal site access while you perform maintenance."
              settingKey="maintenanceMode"
              danger
            />

            <SettingToggle
              title="Allow Registration"
              description="Allow visitors to create new AnimeVerse accounts."
              settingKey="allowRegistration"
            />

            <SettingToggle
              title="Guest Watching"
              description="Allow visitors to watch available episodes without signing in."
              settingKey="allowGuestWatching"
            />

          </div>
        </section>

        {/* BRANDING */}
        <section className="av-settings-card">
          <div className="av-settings-card-header">
            <div>
              <span className="av-settings-label">
                BRANDING
              </span>

              <h2>Site Identity</h2>

              <p>
                Configure the name displayed throughout your
                AnimeVerse application.
              </p>
            </div>

            <div className="av-settings-icon">
              <Star size={20} />
            </div>
          </div>

          <div className="av-brand-field">
            <label htmlFor="animeverse-site-name">
              Site Name
            </label>

            <span>
              Brand name shown by the application.
            </span>

            <input
              id="animeverse-site-name"
              type="text"
              value={settings?.siteName || ""}
              placeholder="AnimeVerse"
              maxLength={60}
              onChange={(e) =>
                updateSettings({
                  siteName: e.target.value,
                })
              }
            />

            <small>
              {(settings?.siteName || "").length}/60 characters
            </small>
          </div>
        </section>

        {/* DATA MANAGEMENT */}
        <section className="av-settings-card">
          <div className="av-settings-card-header">
            <div>
              <span className="av-settings-label">
                DATA MANAGEMENT
              </span>

              <h2>Administration Tools</h2>

              <p>
                Export your local administration data or reset
                the stored admin state.
              </p>
            </div>

            <div className="av-settings-icon">
              <Download size={20} />
            </div>
          </div>

          <div className="av-tools-grid">

            <div className="av-tool-card">
              <div className="av-tool-icon">
                <Download size={19} />
              </div>

              <div className="av-tool-info">
                <strong>Export Administration Data</strong>

                <span>
                  Download a JSON backup containing your current
                  AnimeVerse administration data.
                </span>
              </div>

              <button
                type="button"
                className="av-secondary-button"
                onClick={download}
              >
                <Download size={16} />
                Export JSON
              </button>
            </div>

            <div className="av-tool-card av-danger-tool">
              <div className="av-tool-icon av-danger-icon">
                <RotateCcw size={19} />
              </div>

              <div className="av-tool-info">
                <strong>Reset Admin Data</strong>

                <span>
                  Remove locally stored administration data and
                  restore the initial admin state.
                </span>
              </div>

              <button
                type="button"
                className="av-danger-button"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Reset all local admin data? This action cannot be undone."
                  );

                  if (confirmed) {
                    reset();
                  }
                }}
              >
                <RotateCcw size={16} />
                Reset Data
              </button>
            </div>

          </div>
        </section>

        {/* STATUS */}
        <section className="av-settings-status">
          <div className="av-status-dot" />

          <div>
            <strong>Settings are stored locally</strong>
            <span>
              Changes are applied immediately to the current
              AnimeVerse administration state.
            </span>
          </div>
        </section>

      </div>

      <style>{`
        .av-settings-page {
          width: 100%;
          max-width: 1100px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          padding-bottom: 60px;
        }

        .av-settings-card {
          width: 100%;
          background: #101014;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 18px 50px rgba(0,0,0,.16);
        }

        .av-settings-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          padding: 28px 30px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .av-settings-label {
          display: block;
          margin-bottom: 9px;
          color: #8b5cf6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .2em;
        }

        .av-settings-card-header h2 {
          margin: 0;
          color: #fff;
          font-size: 22px;
          line-height: 1.25;
        }

        .av-settings-card-header p {
          margin: 8px 0 0;
          color: #92929d;
          font-size: 14px;
          line-height: 1.55;
          max-width: 650px;
        }

        .av-settings-icon {
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          display: grid;
          place-items: center;
          color: #a78bfa;
          background: rgba(139,92,246,.10);
          border: 1px solid rgba(139,92,246,.20);
          border-radius: 13px;
        }

        .av-settings-list {
          padding: 0 30px;
        }

        .av-setting-item {
          min-height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          padding: 22px 0;
          border-bottom: 1px solid rgba(255,255,255,.065);
        }

        .av-setting-item:last-child {
          border-bottom: 0;
        }

        .av-setting-content {
          min-width: 0;
          flex: 1;
        }

        .av-setting-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .av-setting-title-row strong {
          color: #f5f5f7;
          font-size: 16px;
          font-weight: 700;
        }

        .av-setting-description {
          display: block;
          margin-top: 6px;
          color: #858590;
          font-size: 13px;
          line-height: 1.55;
        }

        .av-setting-status {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .03em;
        }

        .av-setting-status-on {
          color: #c4b5fd;
          background: rgba(139,92,246,.13);
          border: 1px solid rgba(139,92,246,.20);
        }

        .av-setting-status-off {
          color: #777781;
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.07);
        }

        .av-switch {
          appearance: none;
          border: 0;
          padding: 0;
          background: transparent;
          cursor: pointer;
          flex: 0 0 auto;
        }

        .av-switch-track {
          width: 52px;
          height: 30px;
          padding: 3px;
          display: flex;
          align-items: center;
          border-radius: 999px;
          background: #292930;
          border: 1px solid rgba(255,255,255,.10);
          transition: .2s ease;
        }

        .av-switch-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #8b8b96;
          box-shadow: 0 2px 8px rgba(0,0,0,.35);
          transform: translateX(0);
          transition: .2s ease;
        }

        .av-switch-on .av-switch-track {
          background: #7c3aed;
          border-color: #8b5cf6;
        }

        .av-switch-on .av-switch-thumb {
          background: #fff;
          transform: translateX(22px);
        }

        .av-switch-danger.av-switch-on .av-switch-track {
          background: #dc2626;
          border-color: #ef4444;
        }

        .av-brand-field {
          padding: 26px 30px 30px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .av-brand-field label {
          color: #f5f5f7;
          font-size: 15px;
          font-weight: 700;
        }

        .av-brand-field > span {
          margin-top: 5px;
          color: #858590;
          font-size: 13px;
        }

        .av-brand-field input {
          width: 100%;
          height: 48px;
          margin-top: 16px;
          padding: 0 15px;
          box-sizing: border-box;
          outline: none;
          color: #fff;
          background: #0b0b0f;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 12px;
          font: inherit;
          transition: .2s ease;
        }

        .av-brand-field input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139,92,246,.12);
        }

        .av-brand-field small {
          margin-top: 7px;
          color: #686872;
          font-size: 11px;
        }

        .av-tools-grid {
          padding: 22px 30px 30px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .av-tool-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 17px;
          background: #0b0b0f;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 15px;
        }

        .av-tool-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          color: #a78bfa;
          background: rgba(139,92,246,.10);
          border-radius: 11px;
        }

        .av-tool-info {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .av-tool-info strong {
          color: #f4f4f5;
          font-size: 14px;
        }

        .av-tool-info span {
          color: #777781;
          font-size: 12px;
          line-height: 1.45;
        }

        .av-secondary-button,
        .av-danger-button {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 14px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          transition: .2s ease;
        }

        .av-secondary-button {
          color: #ddd6fe;
          background: rgba(139,92,246,.10);
          border: 1px solid rgba(139,92,246,.22);
        }

        .av-secondary-button:hover {
          background: rgba(139,92,246,.17);
        }

        .av-danger-tool {
          border-color: rgba(239,68,68,.12);
        }

        .av-danger-icon {
          color: #f87171;
          background: rgba(239,68,68,.08);
        }

        .av-danger-button {
          color: #fca5a5;
          background: rgba(239,68,68,.08);
          border: 1px solid rgba(239,68,68,.20);
        }

        .av-danger-button:hover {
          background: rgba(239,68,68,.14);
        }

        .av-settings-status {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          background: rgba(34,197,94,.045);
          border: 1px solid rgba(34,197,94,.10);
          border-radius: 14px;
        }

        .av-status-dot {
          width: 8px;
          height: 8px;
          flex: 0 0 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 12px rgba(34,197,94,.5);
        }

        .av-settings-status div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .av-settings-status strong {
          color: #d1fae5;
          font-size: 12px;
        }

        .av-settings-status span {
          color: #6f7f75;
          font-size: 11px;
        }

        @media (max-width: 700px) {
          .av-settings-page {
            gap: 14px;
            padding-bottom: 35px;
          }

          .av-settings-card {
            border-radius: 17px;
          }

          .av-settings-card-header {
            padding: 21px 18px;
          }

          .av-settings-card-header h2 {
            font-size: 19px;
          }

          .av-settings-card-header p {
            font-size: 12px;
          }

          .av-settings-icon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }

          .av-settings-list {
            padding: 0 18px;
          }

          .av-setting-item {
            min-height: 0;
            padding: 18px 0;
            gap: 15px;
          }

          .av-setting-title-row strong {
            font-size: 14px;
          }

          .av-setting-description {
            font-size: 12px;
          }

          .av-switch-track {
            width: 48px;
            height: 28px;
          }

          .av-switch-thumb {
            width: 20px;
            height: 20px;
          }

          .av-switch-on .av-switch-thumb {
            transform: translateX(20px);
          }

          .av-brand-field {
            padding: 20px 18px 22px;
          }

          .av-tools-grid {
            padding: 18px;
          }

          .av-tool-card {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .av-tool-info {
            width: calc(100% - 57px);
          }

          .av-secondary-button,
          .av-danger-button {
            width: 100%;
          }

          .av-settings-status {
            padding: 14px;
          }
        }
      `}</style>
    </AdminShell>
  );
}
