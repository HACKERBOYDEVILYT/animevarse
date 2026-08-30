import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleOff,
  Copy,
  Edit3,
  ExternalLink,
  Globe,
  KeyRound,
  Plus,
  RefreshCw,
  Save,
  Search,
  Server,
  ShieldCheck,
  Star,
  Trash2,
  X,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";
import useAdminStore from "../../store/useAdminStore";

const EMPTY_FORM = {
  name: "",
  description: "",
  type: "rest",
  baseUrl: "",
  apiKey: "",
  authType: "none",
  authHeader: "Authorization",
  authPrefix: "Bearer",
  customHeadersText: "",
  enabled: true,
  primary: false,
  priority: 10,
  corsMode: "auto",
  animeEndpoint: "",
  searchEndpoint: "",
  detailsEndpoint: "",
  episodesEndpoint: "",
};

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function parseHeaders(text) {
  const result = {};

  String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const separator = line.indexOf(":");

      if (separator === -1) return;

      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();

      if (key) {
        result[key] = value;
      }
    });

  return result;
}

function headersToText(headers = {}) {
  return Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function buildEndpoint(provider) {
  const endpoint =
    provider.searchEndpoint ||
    provider.detailsEndpoint ||
    provider.animeEndpoint ||
    "";

  return `${normalizeUrl(provider.baseUrl)}${endpoint}`;
}

function getRequestHeaders(provider) {
  const headers = {
    Accept: "application/json",
    ...(provider.customHeaders || {}),
  };

  if (provider.apiKey) {
    if (provider.authType === "x-api-key") {
      headers["X-API-Key"] = provider.apiKey;
    }

    if (provider.authType === "authorization") {
      headers[
        provider.authHeader || "Authorization"
      ] = `${provider.authPrefix || "Bearer"} ${
        provider.apiKey
      }`;
    }
  }

  return headers;
}

export default function ApiProviders() {
  const providers = useAdminStore(
    (state) => state.providers
  );

  const addProvider = useAdminStore(
    (state) => state.addProvider
  );

  const updateProvider = useAdminStore(
    (state) => state.updateProvider
  );

  const deleteProvider = useAdminStore(
    (state) => state.deleteProvider
  );

  const toggleProvider = useAdminStore(
    (state) => state.toggleProvider
  );

  const setPrimaryProvider = useAdminStore(
    (state) => state.setPrimaryProvider
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [testingId, setTestingId] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const sortedProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...providers]
      .filter((provider) => {
        if (!query) return true;

        return [
          provider.name,
          provider.type,
          provider.baseUrl,
          provider.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort(
        (a, b) =>
          Number(a.priority || 999) -
          Number(b.priority || 999)
      );
  }, [providers, search]);

  const enabledCount = providers.filter(
    (item) => item.enabled
  ).length;

  const primaryProvider =
    providers.find((item) => item.primary) ||
    providers
      .filter((item) => item.enabled)
      .sort(
        (a, b) =>
          Number(a.priority || 999) -
          Number(b.priority || 999)
      )[0];

  function updateForm(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openCreate() {
    setEditingId(null);
    setTestResult(null);

    setForm({
      ...EMPTY_FORM,
      priority: providers.length + 1,
    });

    setShowForm(true);
  }

  function openEdit(provider) {
    setEditingId(provider.id);
    setTestResult(null);

    setForm({
      name: provider.name || "",
      description: provider.description || "",
      type: provider.type || "rest",
      baseUrl: provider.baseUrl || "",
      apiKey: provider.apiKey || "",
      authType: provider.authType || "none",
      authHeader:
        provider.authHeader || "Authorization",
      authPrefix:
        provider.authPrefix || "Bearer",
      customHeadersText: headersToText(
        provider.customHeaders
      ),
      enabled: provider.enabled ?? true,
      primary: provider.primary ?? false,
      priority: provider.priority || 10,
      corsMode: provider.corsMode || "auto",
      animeEndpoint:
        provider.animeEndpoint || "",
      searchEndpoint:
        provider.searchEndpoint || "",
      detailsEndpoint:
        provider.detailsEndpoint || "",
      episodesEndpoint:
        provider.episodesEndpoint || "",
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setTestResult(null);
    setForm(EMPTY_FORM);
  }

  function saveProvider(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("API name is required.");
      return;
    }

    if (!normalizeUrl(form.baseUrl)) {
      alert("Base URL is required.");
      return;
    }

    let url;

    try {
      url = new URL(
        normalizeUrl(form.baseUrl)
      );
    } catch {
      alert("Please enter a valid HTTPS/HTTP URL.");
      return;
    }

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      alert("Only HTTP/HTTPS URLs are supported.");
      return;
    }

    const providerData = {
      ...form,
      name: form.name.trim(),
      baseUrl: normalizeUrl(form.baseUrl),
      priority: Number(form.priority) || 999,
      customHeaders: parseHeaders(
        form.customHeadersText
      ),
      updatedAt: Date.now(),
    };

    if (editingId) {
      updateProvider(
        editingId,
        providerData
      );
    } else {
      addProvider(providerData);
    }

    closeForm();
  }

  async function testProvider(provider) {
    setTestingId(provider.id);
    setTestResult(null);

    const url = buildEndpoint(provider);

    if (!url) {
      setTestResult({
        id: provider.id,
        ok: false,
        message: "No endpoint configured.",
      });

      setTestingId(null);
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: getRequestHeaders(provider),
        mode: "cors",
      });

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let body = "";

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        const json = await response.json();
        body = JSON.stringify(
          json,
          null,
          2
        ).slice(0, 4000);
      } else {
        body = (
          await response.text()
        ).slice(0, 4000);
      }

      setTestResult({
        id: provider.id,
        ok: response.ok,
        status: response.status,
        message: response.ok
          ? "Connection successful."
          : `HTTP ${response.status}`,
        body,
      });
    } catch (error) {
      setTestResult({
        id: provider.id,
        ok: false,
        message:
          "Browser blocked the request. This is usually a CORS or network issue.",
        body: error?.message || String(error),
      });
    } finally {
      setTestingId(null);
    }
  }

  function copyUrl(provider) {
    navigator.clipboard
      ?.writeText(
        buildEndpoint(provider)
      )
      .then(() => {
        alert("Endpoint copied.");
      })
      .catch(() => {
        alert("Could not copy endpoint.");
      });
  }

  function removeProvider(provider) {
    const confirmed = window.confirm(
      `Delete "${provider.name}"?`
    );

    if (confirmed) {
      deleteProvider(provider.id);
    }
  }

  return (
    <div className="admin-api-page">
      {/* HEADER */}

      <header className="api-page-header">
        <div className="api-header-left">
          <Link
            to="/admin"
            className="admin-back-button"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <div className="api-eyebrow">
              <Server size={14} />
              API CONTROL CENTER
            </div>

            <h1>
              API Providers
            </h1>

            <p>
              Add unlimited anime APIs and
              control primary/fallback
              providers from one place.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openCreate}
        >
          <Plus size={18} />
          Add API
        </button>
      </header>

      {/* OVERVIEW */}

      <section className="api-overview">
        <div className="api-overview-card">
          <div className="api-overview-icon">
            <Globe size={20} />
          </div>

          <div>
            <span>
              Total APIs
            </span>

            <strong>
              {providers.length}
            </strong>
          </div>
        </div>

        <div className="api-overview-card">
          <div className="api-overview-icon success">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>
              Enabled
            </span>

            <strong>
              {enabledCount}
            </strong>
          </div>
        </div>

        <div className="api-overview-card">
          <div className="api-overview-icon primary">
            <Star size={20} />
          </div>

          <div>
            <span>
              Primary
            </span>

            <strong>
              {primaryProvider?.name ||
                "None"}
            </strong>
          </div>
        </div>
      </section>

      {/* TOOLBAR */}

      <section className="api-toolbar">
        <div className="api-search">
          <Search size={18} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search providers..."
          />
        </div>

        <div className="api-toolbar-note">
          <ShieldCheck size={16} />
          HTTPS recommended
        </div>
      </section>

      {/* PROVIDERS */}

      <section className="api-provider-grid">
        {sortedProviders.map(
          (provider) => (
            <article
              key={provider.id}
              className={`api-provider-card ${
                provider.enabled
                  ? ""
                  : "disabled"
              }`}
            >
              <div className="api-card-top">
                <div className="api-provider-logo">
                  {provider.name
                    ?.slice(0, 1)
                    .toUpperCase() ||
                    "A"}
                </div>

                <div className="api-provider-heading">
                  <div className="api-provider-name">
                    <h2>
                      {provider.name}
                    </h2>

                    {provider.primary && (
                      <span className="api-badge primary">
                        PRIMARY
                      </span>
                    )}
                  </div>

                  <span className="api-type">
                    {provider.type?.toUpperCase() ||
                      "REST"}
                  </span>
                </div>

                <button
                  type="button"
                  className={`api-switch ${
                    provider.enabled
                      ? "on"
                      : ""
                  }`}
                  onClick={() =>
                    toggleProvider(
                      provider.id
                    )
                  }
                  aria-label="Toggle API"
                >
                  <span />
                </button>
              </div>

              <p className="api-description">
                {provider.description ||
                  "No description provided."}
              </p>

              <div className="api-url-box">
                <Globe size={15} />

                <span>
                  {provider.baseUrl}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    copyUrl(provider)
                  }
                  title="Copy URL"
                >
                  <Copy size={15} />
                </button>

                <a
                  href={provider.baseUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open URL"
                >
                  <ExternalLink
                    size={15}
                  />
                </a>
              </div>

              <div className="api-meta-grid">
                <div>
                  <span>
                    Priority
                  </span>

                  <strong>
                    #{provider.priority ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>
                    CORS
                  </span>

                  <strong>
                    {provider.corsMode ||
                      "auto"}
                  </strong>
                </div>

                <div>
                  <span>
                    Auth
                  </span>

                  <strong>
                    {provider.authType ===
                    "none"
                      ? "None"
                      : "Configured"}
                  </strong>
                </div>
              </div>

              <div className="api-endpoints">
                <span>
                  {provider.searchEndpoint
                    ? "Search"
                    : "No Search"}
                </span>

                <span>
                  {provider.detailsEndpoint
                    ? "Details"
                    : "No Details"}
                </span>

                <span>
                  {provider.episodesEndpoint
                    ? "Episodes"
                    : "No Episodes"}
                </span>
              </div>

              {testResult?.id ===
                provider.id && (
                <div
                  className={`api-test-result ${
                    testResult.ok
                      ? "success"
                      : "error"
                  }`}
                >
                  <div>
                    {testResult.ok ? (
                      <CheckCircle2
                        size={17}
                      />
                    ) : (
                      <CircleOff
                        size={17}
                      />
                    )}

                    <strong>
                      {testResult.message}
                    </strong>

                    {testResult.status && (
                      <span>
                        HTTP{" "}
                        {testResult.status}
                      </span>
                    )}
                  </div>

                  {testResult.body && (
                    <pre>
                      {testResult.body}
                    </pre>
                  )}
                </div>
              )}

              <div className="api-card-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    testProvider(
                      provider
                    )
                  }
                  disabled={
                    testingId ===
                    provider.id
                  }
                >
                  {testingId ===
                  provider.id ? (
                    <RefreshCw
                      size={16}
                      className="spin"
                    />
                  ) : (
                    <Zap size={16} />
                  )}

                  Test
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    openEdit(provider)
                  }
                >
                  <Edit3 size={16} />
                  Edit
                </button>

                {!provider.primary && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setPrimaryProvider(
                        provider.id
                      )
                    }
                  >
                    <Star size={16} />
                    Primary
                  </button>
                )}

                <button
                  type="button"
                  className="danger-button"
                  onClick={() =>
                    removeProvider(
                      provider
                    )
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          )
        )}

        {sortedProviders.length ===
          0 && (
          <div className="api-empty">
            <Server size={42} />

            <h2>
              No API providers found
            </h2>

            <p>
              Add your first provider
              to start building your
              API fallback chain.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={openCreate}
            >
              <Plus size={18} />
              Add API
            </button>
          </div>
        )}
      </section>

      {/* MODAL */}

      {showForm && (
        <div
          className="api-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >
          <div className="api-modal">
            <div className="api-modal-header">
              <div>
                <span>
                  API CONFIGURATION
                </span>

                <h2>
                  {editingId
                    ? "Edit Provider"
                    : "Add API Provider"}
                </h2>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={closeForm}
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="api-form"
              onSubmit={saveProvider}
            >
              <div className="api-form-section">
                <h3>
                  Basic Information
                </h3>

                <div className="api-form-grid">
                  <label>
                    <span>
                      API Name *
                    </span>

                    <input
                      value={form.name}
                      onChange={(event) =>
                        updateForm(
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="My Anime API"
                    />
                  </label>

                  <label>
                    <span>
                      API Type
                    </span>

                    <select
                      value={form.type}
                      onChange={(event) =>
                        updateForm(
                          "type",
                          event.target.value
                        )
                      }
                    >
                      <option value="rest">
                        REST
                      </option>

                      <option value="graphql">
                        GraphQL
                      </option>

                      <option value="json">
                        JSON
                      </option>
                    </select>
                  </label>

                  <label className="full">
                    <span>
                      Base URL *
                    </span>

                    <input
                      value={form.baseUrl}
                      onChange={(event) =>
                        updateForm(
                          "baseUrl",
                          event.target.value
                        )
                      }
                      placeholder="https://api.example.com/v1"
                    />
                  </label>

                  <label className="full">
                    <span>
                      Description
                    </span>

                    <input
                      value={
                        form.description
                      }
                      onChange={(event) =>
                        updateForm(
                          "description",
                          event.target.value
                        )
                      }
                      placeholder="Anime metadata provider"
                    />
                  </label>
                </div>
              </div>

              <div className="api-form-section">
                <h3>
                  Endpoints
                </h3>

                <div className="api-form-grid">
                  <label>
                    <span>
                      Anime Endpoint
                    </span>

                    <input
                      value={
                        form.animeEndpoint
                      }
                      onChange={(event) =>
                        updateForm(
                          "animeEndpoint",
                          event.target.value
                        )
                      }
                      placeholder="/anime"
                    />
                  </label>

                  <label>
                    <span>
                      Search Endpoint
                    </span>

                    <input
                      value={
                        form.searchEndpoint
                      }
                      onChange={(event) =>
                        updateForm(
                          "searchEndpoint",
                          event.target.value
                        )
                      }
                      placeholder="/anime?q={query}"
                    />
                  </label>

                  <label>
                    <span>
                      Details Endpoint
                    </span>

                    <input
                      value={
                        form.detailsEndpoint
                      }
                      onChange={(event) =>
                        updateForm(
                          "detailsEndpoint",
                          event.target.value
                        )
                      }
                      placeholder="/anime/{id}"
                    />
                  </label>

                  <label>
                    <span>
                      Episodes Endpoint
                    </span>

                    <input
                      value={
                        form.episodesEndpoint
                      }
                      onChange={(event) =>
                        updateForm(
                          "episodesEndpoint",
                          event.target.value
                        )
                      }
                      placeholder="/anime/{id}/episodes"
                    />
                  </label>
                </div>
              </div>

              <div className="api-form-section">
                <h3>
                  Authentication
                </h3>

                <div className="api-form-grid">
                  <label>
                    <span>
                      Authentication
                    </span>

                    <select
                      value={
                        form.authType
                      }
                      onChange={(event) =>
                        updateForm(
                          "authType",
                          event.target.value
                        )
                      }
                    >
                      <option value="none">
                        None
                      </option>

                      <option value="x-api-key">
                        X-API-Key
                      </option>

                      <option value="authorization">
                        Authorization
                      </option>
                    </select>
                  </label>

                  <label>
                    <span>
                      API Key
                    </span>

                    <div className="input-with-icon">
                      <KeyRound
                        size={16}
                      />

                      <input
                        type="password"
                        value={
                          form.apiKey
                        }
                        onChange={(event) =>
                          updateForm(
                            "apiKey",
                            event.target
                              .value
                          )
                        }
                        placeholder="API key"
                      />
                    </div>
                  </label>

                  {form.authType ===
                    "authorization" && (
                    <>
                      <label>
                        <span>
                          Auth Header
                        </span>

                        <input
                          value={
                            form.authHeader
                          }
                          onChange={(event) =>
                            updateForm(
                              "authHeader",
                              event.target
                                .value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>
                          Prefix
                        </span>

                        <input
                          value={
                            form.authPrefix
                          }
                          onChange={(event) =>
                            updateForm(
                              "authPrefix",
                              event.target
                                .value
                            )
                          }
                          placeholder="Bearer"
                        />
                      </label>
                    </>
                  )}

                  <label className="full">
                    <span>
                      Custom Headers
                    </span>

                    <textarea
                      value={
                        form.customHeadersText
                      }
                      onChange={(event) =>
                        updateForm(
                          "customHeadersText",
                          event.target
                            .value
                        )
                      }
                      placeholder={
                        "Accept: application/json\nX-Custom-Header: value"
                      }
                      rows={4}
                    />
                  </label>
                </div>
              </div>

              <div className="api-form-section">
                <h3>
                  Routing & Fallback
                </h3>

                <div className="api-form-grid">
                  <label>
                    <span>
                      Priority
                    </span>

                    <input
                      type="number"
                      min="1"
                      value={
                        form.priority
                      }
                      onChange={(event) =>
                        updateForm(
                          "priority",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>
                      CORS Mode
                    </span>

                    <select
                      value={
                        form.corsMode
                      }
                      onChange={(event) =>
                        updateForm(
                          "corsMode",
                          event.target.value
                        )
                      }
                    >
                      <option value="auto">
                        Auto
                      </option>

                      <option value="direct">
                        Direct
                      </option>

                      <option value="proxy">
                        Proxy
                      </option>
                    </select>
                  </label>
                </div>

                <div className="api-checkboxes">
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={
                        form.enabled
                      }
                      onChange={(event) =>
                        updateForm(
                          "enabled",
                          event.target
                            .checked
                        )
                      }
                    />

                    <span>
                      Enable this API
                    </span>
                  </label>

                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={
                        form.primary
                      }
                      onChange={(event) =>
                        updateForm(
                          "primary",
                          event.target
                            .checked
                        )
                      }
                    />

                    <span>
                      Set as primary API
                    </span>
                  </label>
                </div>
              </div>

              <div className="api-security-note">
                <ShieldCheck size={19} />

                <div>
                  <strong>
                    CORS note
                  </strong>

                  <p>
                    Direct browser requests
                    only work when the API
                    server permits your
                    website origin. A CORS
                    setting here cannot
                    bypass the external
                    server's policy.
                  </p>
                </div>
              </div>

              <div className="api-modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <Save size={17} />

                  {editingId
                    ? "Save Changes"
                    : "Add API"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
