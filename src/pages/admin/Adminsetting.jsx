import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Save,
  RotateCcw,
  Download,
  Upload,
  Settings,
  Globe,
  Palette,
  Home,
  Database,
  Play,
  Users,
  Search,
  Shield,
  Wrench,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  ChevronRight
} from "lucide-react";

import useAdminStore from "../../store/useAdminStore";

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS = {
  /* General */
  siteName: "AnimeVerse",
  siteTagline:
    "Your ultimate anime streaming experience",
  siteDescription:
    "Watch and discover your favorite anime.",
  siteUrl: "",
  language: "en",
  timezone: "Asia/Dhaka",

  /* Appearance */
  theme: "dark",
  accentColor: "#8b5cf6",
  animations: true,
  compactMode: false,
  roundedCards: true,

  /* Homepage */
  showHero: true,
  showTrending: true,
  showPopular: true,
  showSeasonal: true,
  showRecentlyUpdated: true,
  itemsPerPage: 24,

  /* API */
  primaryAnimeApi: "anilist",
  fallbackAnimeApi: "jikan",
  apiTimeout: 15000,
  cacheEnabled: true,
  cacheDuration: 5,
  retryAttempts: 2,

  /* Player */
  autoplay: false,
  autoNextEpisode: true,
  resumePlayback: true,
  defaultQuality: "auto",
  defaultVolume: 80,
  captions: true,
  theaterMode: true,

  /* Users */
  registration: true,
  guestWatching: true,
  emailVerification: false,
  profilePublic: false,

  /* SEO */
  seoTitle:
    "AnimeVerse - Watch Anime Online",
  seoDescription:
    "Discover and watch anime on AnimeVerse.",
  seoKeywords:
    "anime, anime online, watch anime",

  /* Security */
  sessionDuration: 7,
  loginAttempts: 5,
  adminTwoFactor: false,

  /* Maintenance */
  maintenance: false,
  maintenanceMessage:
    "AnimeVerse is currently under maintenance. Please check back soon.",

  /* System */
  debugMode: false,
  analyticsEnabled: true
};

/* =========================================================
   SIDEBAR
========================================================= */

const SECTIONS = [
  {
    id: "general",
    label: "General",
    icon: Globe,
    description: "Basic website configuration"
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Theme and visual settings"
  },
  {
    id: "homepage",
    label: "Homepage",
    icon: Home,
    description: "Homepage content controls"
  },
  {
    id: "api",
    label: "API & Data",
    icon: Database,
    description: "Anime API and caching"
  },
  {
    id: "player",
    label: "Video Player",
    icon: Play,
    description: "Playback preferences"
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    description: "Authentication settings"
  },
  {
    id: "seo",
    label: "SEO",
    icon: Search,
    description: "Search engine settings"
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Security controls"
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    description: "Maintenance mode"
  },
  {
    id: "system",
    label: "System Health",
    icon: Activity,
    description: "System diagnostics"
  }
];

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Toggle({
  checked,
  onChange,
  label,
  description
}) {
  return (
    <div className="setting-row">
      <div className="setting-copy">
        <div className="setting-label">
          {label}
        </div>

        {description && (
          <div className="setting-description">
            {description}
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label={label}
        onClick={() =>
          onChange(!checked)
        }
        className={`setting-toggle ${
          checked ? "active" : ""
        }`}
      >
        <span />
      </button>
    </div>
  );
}

function Field({
  label,
  description,
  children
}) {
  return (
    <div className="setting-field">
      <div className="setting-copy">
        <div className="setting-label">
          {label}
        </div>

        {description && (
          <div className="setting-description">
            {description}
          </div>
        )}
      </div>

      <div className="setting-control">
        {children}
      </div>
    </div>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  placeholder
}) {
  return (
    <input
      className="admin-input"
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) =>
        onChange(e.target.value)
      }
    />
  );
}

function Select({
  value,
  onChange,
  children
}) {
  return (
    <select
      className="admin-input"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    >
      {children}
    </select>
  );
}

function SectionHeader({
  title,
  description,
  icon: Icon
}) {
  return (
    <div className="settings-section-header">
      <div className="settings-section-icon">
        <Icon size={20} />
      </div>

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function AdminSettings() {
  const adminStore = useAdminStore();

  const existingSettings =
    adminStore?.settings || {};

  const updateSettings =
    adminStore?.updateSettings;

  const [activeSection, setActiveSection] =
    useState("general");

  const [settings, setSettings] =
    useState({
      ...DEFAULT_SETTINGS,
      ...existingSettings
    });

  const [savedSettings, setSavedSettings] =
    useState({
      ...DEFAULT_SETTINGS,
      ...existingSettings
    });

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [showReset, setShowReset] =
    useState(false);

  const [showExport, setShowExport] =
    useState(false);

  const dirty = useMemo(
    () =>
      JSON.stringify(settings) !==
      JSON.stringify(savedSettings),
    [settings, savedSettings]
  );

  useEffect(() => {
    const merged = {
      ...DEFAULT_SETTINGS,
      ...existingSettings
    };

    setSettings(merged);
    setSavedSettings(merged);
  }, [existingSettings]);

  function setValue(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value
    }));

    setSaved(false);
  }

  async function handleSave() {
    if (!updateSettings) {
      console.error(
        "useAdminStore.updateSettings is missing"
      );
      return;
    }

    try {
      setSaving(true);

      await updateSettings(
        settings
      );

      setSavedSettings(
        settings
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      alert(
        "Failed to save settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const reset = {
      ...DEFAULT_SETTINGS
    };

    setSettings(reset);
    setSavedSettings(reset);
    setShowReset(false);
    setSaved(false);
  }

  function handleExport() {
    const data = JSON.stringify(
      settings,
      null,
      2
    );

    const blob = new Blob(
      [data],
      {
        type: "application/json"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download =
      "animeverse-settings.json";

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);

    setShowExport(false);
  }

  function handleImport(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () => {
      try {
        const imported =
          JSON.parse(
            reader.result
          );

        setSettings({
          ...DEFAULT_SETTINGS,
          ...imported
        });

        setSaved(false);
      } catch {
        alert(
          "Invalid settings file."
        );
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  }

  const currentSection =
    SECTIONS.find(
      (section) =>
        section.id ===
        activeSection
    );

  return (
    <div className="admin-settings">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="settings-topbar">

        <div>
          <div className="admin-page-eyebrow">
            ADMINISTRATION
          </div>

          <h1>
            Settings
          </h1>

          <p>
            Configure and manage your
            AnimeVerse platform.
          </p>
        </div>

        <div className="settings-actions">

          {dirty && (
            <span className="unsaved-badge">
              <span />
              Unsaved changes
            </span>
          )}

          {saved && (
            <span className="saved-badge">
              <CheckCircle2
                size={16}
              />
              Saved
            </span>
          )}

          <button
            type="button"
            className="admin-btn secondary"
            onClick={() =>
              setShowReset(true)
            }
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            type="button"
            className="admin-btn primary"
            disabled={
              saving || !dirty
            }
            onClick={handleSave}
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </div>

      {/* =================================================
          LAYOUT
      ================================================= */}

      <div className="settings-layout">

        {/* SIDEBAR */}

        <aside className="settings-sidebar">

          <div className="settings-sidebar-title">
            Configuration
          </div>

          {SECTIONS.map(
            (section) => {
              const Icon =
                section.icon;

              const active =
                activeSection ===
                section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() =>
                    setActiveSection(
                      section.id
                    )
                  }
                  className={`settings-nav-item ${
                    active
                      ? "active"
                      : ""
                  }`}
                >
                  <span className="settings-nav-icon">
                    <Icon size={18} />
                  </span>

                  <span className="settings-nav-text">
                    <strong>
                      {section.label}
                    </strong>

                    <small>
                      {section.description}
                    </small>
                  </span>

                  <ChevronRight
                    size={16}
                  />
                </button>
              );
            }
          )}

        </aside>

        {/* CONTENT */}

        <main className="settings-content">

          <div className="settings-content-title">
            <span>
              {currentSection?.label}
            </span>

            <small>
              Dashboard / Settings /{" "}
              {currentSection?.label}
            </small>
          </div>

          {/* =================================================
              GENERAL
          ================================================= */}

          {activeSection ===
            "general" && (
            <div className="settings-card">

              <SectionHeader
                title="General Settings"
                description="Configure the basic identity and regional settings of your website."
                icon={Globe}
              />

              <Field
                label="Site Name"
                description="The name displayed throughout AnimeVerse."
              >
                <Input
                  value={
                    settings.siteName
                  }
                  onChange={(value) =>
                    setValue(
                      "siteName",
                      value
                    )
                  }
                />
              </Field>

              <Field
                label="Tagline"
                description="Short description shown below your brand."
              >
                <Input
                  value={
                    settings.siteTagline
                  }
                  onChange={(value) =>
                    setValue(
                      "siteTagline",
                      value
                    )
                  }
                />
              </Field>

              <Field
                label="Site URL"
                description="Canonical URL of your AnimeVerse installation."
              >
                <Input
                  value={
                    settings.siteUrl
                  }
                  placeholder="https://example.com"
                  onChange={(value) =>
                    setValue(
                      "siteUrl",
                      value
                    )
                  }
                />
              </Field>

              <Field
                label="Language"
                description="Default interface language."
              >
                <Select
                  value={
                    settings.language
                  }
                  onChange={(value) =>
                    setValue(
                      "language",
                      value
                    )
                  }
                >
                  <option value="en">
                    English
                  </option>

                  <option value="bn">
                    বাংলা
                  </option>
                </Select>
              </Field>

              <Field
                label="Timezone"
                description="Timezone used by the admin dashboard."
              >
                <Select
                  value={
                    settings.timezone
                  }
                  onChange={(value) =>
                    setValue(
                      "timezone",
                      value
                    )
                  }
                >
                  <option value="Asia/Dhaka">
                    Asia/Dhaka
                  </option>

                  <option value="UTC">
                    UTC
                  </option>

                  <option value="Asia/Tokyo">
                    Asia/Tokyo
                  </option>

                  <option value="America/New_York">
                    America/New_York
                  </option>

                  <option value="Europe/London">
                    Europe/London
                  </option>
                </Select>
              </Field>

              <Field
                label="Site Description"
                description="Default description used across the site."
              >
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={
                    settings.siteDescription
                  }
                  onChange={(e) =>
                    setValue(
                      "siteDescription",
                      e.target.value
                    )
                  }
                />
              </Field>

            </div>
          )}

          {/* =================================================
              APPEARANCE
          ================================================= */}

          {activeSection ===
            "appearance" && (
            <div className="settings-card">

              <SectionHeader
                title="Appearance"
                description="Control the visual appearance and interaction style."
                icon={Palette}
              />

              <Field
                label="Theme"
                description="Default color scheme."
              >
                <Select
                  value={
                    settings.theme
                  }
                  onChange={(value) =>
                    setValue(
                      "theme",
                      value
                    )
                  }
                >
                  <option value="dark">
                    Dark
                  </option>

                  <option value="light">
                    Light
                  </option>

                  <option value="system">
                    System
                  </option>
                </Select>
              </Field>

              <Field
                label="Accent Color"
                description="Primary accent used by the dashboard."
              >
                <div className="color-control">
                  <input
                    type="color"
                    value={
                      settings.accentColor
                    }
                    onChange={(e) =>
                      setValue(
                        "accentColor",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    value={
                      settings.accentColor
                    }
                    onChange={(value) =>
                      setValue(
                        "accentColor",
                        value
                      )
                    }
                  />
                </div>
              </Field>

              <Toggle
                label="Animations"
                description="Enable smooth UI transitions and animations."
                checked={
                  settings.animations
                }
                onChange={(value) =>
                  setValue(
                    "animations",
                    value
                  )
                }
              />

              <Toggle
                label="Compact Mode"
                description="Reduce spacing for dense admin layouts."
                checked={
                  settings.compactMode
                }
                onChange={(value) =>
                  setValue(
                    "compactMode",
                    value
                  )
                }
              />

              <Toggle
                label="Rounded Cards"
                description="Use rounded corners throughout the interface."
                checked={
                  settings.roundedCards
                }
                onChange={(value) =>
                  setValue(
                    "roundedCards",
                    value
                  )
                }
              />

            </div>
          )}

          {/* =================================================
              HOMEPAGE
          ================================================= */}

          {activeSection ===
            "homepage" && (
            <div className="settings-card">

              <SectionHeader
                title="Homepage"
                description="Choose which content sections appear on the homepage."
                icon={Home}
              />

              <Toggle
                label="Hero Section"
                description="Show the main featured anime banner."
                checked={
                  settings.showHero
                }
                onChange={(value) =>
                  setValue(
                    "showHero",
                    value
                  )
                }
              />

              <Toggle
                label="Trending Anime"
                description="Display currently trending anime."
                checked={
                  settings.showTrending
                }
                onChange={(value) =>
                  setValue(
                    "showTrending",
                    value
                  )
                }
              />

              <Toggle
                label="Popular Anime"
                description="Display popular anime."
                checked={
                  settings.showPopular
                }
                onChange={(value) =>
                  setValue(
                    "showPopular",
                    value
                  )
                }
              />

              <Toggle
                label="Seasonal Anime"
                description="Display the current season."
                checked={
                  settings.showSeasonal
                }
                onChange={(value) =>
                  setValue(
                    "showSeasonal",
                    value
                  )
                }
              />

              <Toggle
                label="Recently Updated"
                description="Show recently updated titles."
                checked={
                  settings.showRecentlyUpdated
                }
                onChange={(value) =>
                  setValue(
                    "showRecentlyUpdated",
                    value
                  )
                }
              />

              <Field
                label="Items Per Page"
                description="Number of anime cards displayed per page."
              >
                <Select
                  value={
                    settings.itemsPerPage
                  }
                  onChange={(value) =>
                    setValue(
                      "itemsPerPage",
                      Number(value)
                    )
                  }
                >
                  <option value={12}>
                    12
                  </option>

                  <option value={24}>
                    24
                  </option>

                  <option value={36}>
                    36
                  </option>

                  <option value={48}>
                    48
                  </option>
                </Select>
              </Field>

            </div>
          )}

          {/* =================================================
              API
          ================================================= */}

          {activeSection ===
            "api" && (
            <div className="settings-card">

              <SectionHeader
                title="API & Data"
                description="Manage anime data providers, caching and API resilience."
                icon={Database}
              />

              <div className="api-priority-box">

                <div>
                  <span className="status-dot online" />

                  <strong>
                    Primary API
                  </strong>

                  <small>
                    AniList GraphQL
                  </small>
                </div>

                <span className="priority-badge">
                  PRIMARY
                </span>

              </div>

              <Field
                label="Primary Anime API"
                description="Main source for anime metadata."
              >
                <Select
                  value={
                    settings.primaryAnimeApi
                  }
                  onChange={(value) =>
                    setValue(
                      "primaryAnimeApi",
                      value
                    )
                  }
                >
                  <option value="anilist">
                    AniList
                  </option>
                </Select>
              </Field>

              <Field
                label="Fallback Anime API"
                description="Used automatically when the primary API fails."
              >
                <Select
                  value={
                    settings.fallbackAnimeApi
                  }
                  onChange={(value) =>
                    setValue(
                      "fallbackAnimeApi",
                      value
                    )
                  }
                >
                  <option value="jikan">
                    Jikan
                  </option>
                </Select>
              </Field>

              <Field
                label="Request Timeout"
                description="Maximum API request time in milliseconds."
              >
                <Input
                  type="number"
                  value={
                    settings.apiTimeout
                  }
                  onChange={(value) =>
                    setValue(
                      "apiTimeout",
                      Number(value)
                    )
                  }
                />
              </Field>

              <Field
                label="Retry Attempts"
                description="Number of automatic retries after a failed API request."
              >
                <Select
                  value={
                    settings.retryAttempts
                  }
                  onChange={(value) =>
                    setValue(
                      "retryAttempts",
                      Number(value)
                    )
                  }
                >
                  <option value={0}>
                    0
                  </option>

                  <option value={1}>
                    1
                  </option>

                  <option value={2}>
                    2
                  </option>

                  <option value={3}>
                    3
                  </option>
                </Select>
              </Field>

              <Toggle
                label="API Cache"
                description="Cache API responses to improve speed and reduce requests."
                checked={
                  settings.cacheEnabled
                }
                onChange={(value) =>
                  setValue(
                    "cacheEnabled",
                    value
                  )
                }
              />

              <Field
                label="Cache Duration"
                description="Cache lifetime in minutes."
              >
                <Input
                  type="number"
                  value={
                    settings.cacheDuration
                  }
                  onChange={(value) =>
                    setValue(
                      "cacheDuration",
                      Number(value)
                    )
                  }
                />
              </Field>

            </div>
          )}

          {/* =================================================
              PLAYER
          ================================================= */}

          {activeSection ===
            "player" && (
            <div className="settings-card">

              <SectionHeader
                title="Video Player"
                description="Configure playback behavior and user experience."
                icon={Play}
              />

              <Toggle
                label="Autoplay"
                description="Automatically start playback when possible."
                checked={
                  settings.autoplay
                }
                onChange={(value) =>
                  setValue(
                    "autoplay",
                    value
                  )
                }
              />

              <Toggle
                label="Auto Next Episode"
                description="Automatically continue to the next episode."
                checked={
                  settings.autoNextEpisode
                }
                onChange={(value) =>
                  setValue(
                    "autoNextEpisode",
                    value
                  )
                }
              />

              <Toggle
                label="Resume Playback"
                description="Remember the user's last playback position."
                checked={
                  settings.resumePlayback
                }
                onChange={(value) =>
                  setValue(
                    "resumePlayback",
                    value
                  )
                }
              />

              <Toggle
                label="Captions"
                description="Enable subtitle/caption controls."
                checked={
                  settings.captions
                }
                onChange={(value) =>
                  setValue(
                    "captions",
                    value
                  )
                }
              />

              <Toggle
                label="Theater Mode"
                description="Allow users to expand the player into theater mode."
                checked={
                  settings.theaterMode
                }
                onChange={(value) =>
                  setValue(
                    "theaterMode",
                    value
                  )
                }
              />

              <Field
                label="Default Quality"
                description="Initial video quality selection."
              >
                <Select
                  value={
                    settings.defaultQuality
                  }
                  onChange={(value) =>
                    setValue(
                      "defaultQuality",
                      value
                    )
                  }
                >
                  <option value="auto">
                    Auto
                  </option>

                  <option value="1080p">
                    1080p
                  </option>

                  <option value="720p">
                    720p
                  </option>

                  <option value="480p">
                    480p
                  </option>
                </Select>
              </Field>

              <Field
                label="Default Volume"
                description="Initial player volume percentage."
              >
                <Input
                  type="number"
                  value={
                    settings.defaultVolume
                  }
                  onChange={(value) =>
                    setValue(
                      "defaultVolume",
                      Math.min(
                        100,
                        Math.max(
                          0,
                          Number(value)
                        )
                      )
                    )
                  }
                />
              </Field>

            </div>
          )}

          {/* =================================================
              USERS
          ================================================= */}

          {activeSection ===
            "users" && (
            <div className="settings-card">

              <SectionHeader
                title="Users & Authentication"
                description="Control account registration and guest access."
                icon={Users}
              />

              <Toggle
                label="User Registration"
                description="Allow new users to create accounts."
                checked={
                  settings.registration
                }
                onChange={(value) =>
                  setValue(
                    "registration",
                    value
                  )
                }
              />

              <Toggle
                label="Guest Watching"
                description="Allow visitors to watch without an account."
                checked={
                  settings.guestWatching
                }
                onChange={(value) =>
                  setValue(
                    "guestWatching",
                    value
                  )
                }
              />

              <Toggle
                label="Email Verification"
                description="Require email verification during registration."
                checked={
                  settings.emailVerification
                }
                onChange={(value) =>
                  setValue(
                    "emailVerification",
                    value
                  )
                }
              />

              <Toggle
                label="Public Profiles"
                description="Allow users to make their profiles publicly visible."
                checked={
                  settings.profilePublic
                }
                onChange={(value) =>
                  setValue(
                    "profilePublic",
                    value
                  )
                }
              />

            </div>
          )}

          {/* =================================================
              SEO
          ================================================= */}

          {activeSection ===
            "seo" && (
            <div className="settings-card">

              <SectionHeader
                title="SEO"
                description="Optimize AnimeVerse for search engines."
                icon={Search}
              />

              <Field
                label="SEO Title"
                description="Default page title used by search engines."
              >
                <Input
                  value={
                    settings.seoTitle
                  }
                  onChange={(value) =>
                    setValue(
                      "seoTitle",
                      value
                    )
                  }
                />
              </Field>

              <Field
                label="SEO Description"
                description="Default meta description."
              >
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={
                    settings.seoDescription
                  }
                  onChange={(e) =>
                    setValue(
                      "seoDescription",
                      e.target.value
                    )
                  }
                />
              </Field>

              <Field
                label="SEO Keywords"
                description="Comma-separated keywords."
              >
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={
                    settings.seoKeywords
                  }
                  onChange={(e) =>
                    setValue(
                      "seoKeywords",
                      e.target.value
                    )
                  }
                />
              </Field>

            </div>
          )}

          {/* =================================================
              SECURITY
          ================================================= */}

          {activeSection ===
            "security" && (
            <div className="settings-card">

              <SectionHeader
                title="Security"
                description="Protect administrator and user sessions."
                icon={Shield}
              />

              <Field
                label="Session Duration"
                description="Number of days before a session expires."
              >
                <Input
                  type="number"
                  value={
                    settings.sessionDuration
                  }
                  onChange={(value) =>
                    setValue(
                      "sessionDuration",
                      Number(value)
                    )
                  }
                />
              </Field>

              <Field
                label="Login Attempts"
                description="Maximum failed login attempts before temporary protection."
              >
                <Input
                  type="number"
                  value={
                    settings.loginAttempts
                  }
                  onChange={(value) =>
                    setValue(
                      "loginAttempts",
                      Number(value)
                    )
                  }
                />
              </Field>

              <Toggle
                label="Admin Two-Factor Authentication"
                description="Require an additional authentication step for administrators."
                checked={
                  settings.adminTwoFactor
                }
                onChange={(value) =>
                  setValue(
                    "adminTwoFactor",
                    value
                  )
                }
              />

              <div className="security-warning">

                <AlertTriangle
                  size={20}
                />

                <div>
                  <strong>
                    Security reminder
                  </strong>

                  <p>
                    Never expose admin
                    credentials or private API
                    keys in frontend code.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* =================================================
              MAINTENANCE
          ================================================= */}

          {activeSection ===
            "maintenance" && (
            <div className="settings-card">

              <SectionHeader
                title="Maintenance Mode"
                description="Temporarily restrict the public website while performing maintenance."
                icon={Wrench}
              />

              <div
                className={`maintenance-banner ${
                  settings.maintenance
                    ? "danger"
                    : "safe"
                `}
              >
                <div className="maintenance-icon">
                  {settings.maintenance ? (
                    <AlertTriangle
                      size={22}
                    />
                  ) : (
                    <CheckCircle2
                      size={22}
                    />
                  )}
                </div>

                <div>
                  <strong>
                    {settings.maintenance
                      ? "Maintenance mode is ON"
                      : "Website is operational"}
                  </strong>

                  <p>
                    {settings.maintenance
                      ? "Visitors may see the maintenance page."
                      : "The public website is currently available."}
                  </p>
                </div>
              </div>

              <Toggle
                label="Enable Maintenance Mode"
                description="Take the public site offline temporarily."
                checked={
                  settings.maintenance
                }
                onChange={(value) =>
                  setValue(
                    "maintenance",
                    value
                  )
                }
              />

              <Field
                label="Maintenance Message"
                description="Message shown to visitors during maintenance."
              >
                <textarea
                  className="admin-textarea"
                  rows={5}
                  value={
                    settings.maintenanceMessage
                  }
                  onChange={(e) =>
                    setValue(
                      "maintenanceMessage",
                      e.target.value
                    )
                  }
                />
              </Field>

            </div>
          )}

          {/* =================================================
              SYSTEM
          ================================================= */}

          {activeSection ===
            "system" && (
            <div className="settings-card">

              <SectionHeader
                title="System Health"
                description="Monitor the configuration and API availability."
                icon={Activity}
              />

              <div className="health-grid">

                <div className="health-card">
                  <div>
                    <Server
                      size={20}
                    />

                    <span>
                      AniList
                    </span>
                  </div>

                  <strong className="health-online">
                    Primary
                  </strong>
                </div>

                <div className="health-card">
                  <div>
                    <Zap
                      size={20}
                    />

                    <span>
                      Jikan
                    </span>
                  </div>

                  <strong className="health-online">
                    Fallback
                  </strong>
                </div>

                <div className="health-card">
                  <div>
                    <Database
                      size={20}
                    />

                    <span>
                      Cache
                    </span>
                  </div>

                  <strong>
                    {settings.cacheEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </strong>
                </div>

              </div>

              <Toggle
                label="Analytics"
                description="Enable application analytics."
                checked={
                  settings.analyticsEnabled
                }
                onChange={(value) =>
                  setValue(
                    "analyticsEnabled",
                    value
                  )
                }
              />

              <Toggle
                label="Debug Mode"
                description="Enable detailed development diagnostics. Keep disabled in production."
                checked={
                  settings.debugMode
                }
                onChange={(value) =>
                  setValue(
                    "debugMode",
                    value
                  )
                }
              />

              <div className="system-actions">

                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() =>
                    setShowExport(true)
                  }
                >
                  <Download size={17} />
                  Export Settings
                </button>

                <label className="admin-btn secondary">
                  <Upload size={17} />
                  Import Settings

                  <input
                    type="file"
                    accept="application/json,.json"
                    hidden
                    onChange={
                      handleImport
                    }
                  />
                </label>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* =================================================
          RESET MODAL
      ================================================= */}

      {showReset && (
        <div className="admin-modal-backdrop">

          <div className="admin-modal">

            <div className="modal-icon danger">
              <AlertTriangle
                size={24}
              />
            </div>

            <h3>
              Reset all settings?
            </h3>

            <p>
              This will restore all settings
              to their default AnimeVerse
              configuration.
            </p>

            <div className="modal-actions">

              <button
                type="button"
                className="admin-btn secondary"
                onClick={() =>
                  setShowReset(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-btn danger"
                onClick={
                  handleReset
                }
              >
                Reset Settings
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =================================================
          EXPORT MODAL
      ================================================= */}

      {showExport && (
        <div className="admin-modal-backdrop">

          <div className="admin-modal">

            <div className="modal-icon">
              <Download
                size={24}
              />
            </div>

            <h3>
              Export settings
            </h3>

            <p>
              A JSON backup of your current
              AnimeVerse configuration will
              be downloaded.
            </p>

            <div className="modal-actions">

              <button
                type="button"
                className="admin-btn secondary"
                onClick={() =>
                  setShowExport(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-btn primary"
                onClick={
                  handleExport
                }
              >
                <Download
                  size={17}
                />
                Export
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
