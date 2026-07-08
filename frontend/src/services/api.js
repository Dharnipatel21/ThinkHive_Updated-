import axios from "axios";
import toast from "react-hot-toast";
import { clearToken, getToken } from "./auth";

const api = axios.create({ baseURL: (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000") + "/api/v1" });
api.interceptors.request.use(c => { const t = getToken(); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });
api.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401) { clearToken(); window.location.href = "/login"; }
  else if (e.response?.status === 403) toast.error("Access Denied");
  else if (e.response?.status >= 500) toast.error("Server error");
  return Promise.reject(e);
});
export const sendOTP = email => api.post("/otp/send", { email }).then(r => r.data);
export const verifyOTP = (email, otp) => api.post("/otp/verify", { email, otp }).then(r => r.data);
export const register = d => api.post("/auth/register", d).then(r => r.data);
export const login = (email, password, organization_slug) => api.post("/auth/login", { email, password, organization_slug }).then(r => r.data);
export const getCurrentUser = () => api.get("/auth/me").then(r => r.data);
export const uploadDocument = (file, classification = "internal") => { const f = new FormData(); f.append("file", file); f.append("classification", classification); return api.post("/upload", f).then(r => r.data); };
export const getDocuments = () => api.get("/documents").then(r => r.data);
export const getDocumentStatus = id => api.get(`/documents/${id}/status`).then(r => r.data);
export const deleteDocument = id => api.delete(`/documents/${id}`).then(r => r.data);
export const getSanitisationReport = id => api.get(`/document-tags/${id}/sanitisation-report`).then(r => r.data);
export const updateDocumentTags = (id, d) => api.put(`/document-tags/${id}`, d).then(r => r.data);
export const sendQuery = (query, limit = 8) => api.post("/query", { query, limit }).then(r => r.data);
export const sendVoiceQuery = blob => { const f = new FormData(); f.append("audio", blob, "recording.webm"); return api.post("/voice/query", f).then(r => r.data); };
export const semanticSearch = (query, limit = 10) => api.post("/search", { query, limit }).then(r => r.data);
export const generateSummary = topic => api.post("/summary", { topic }).then(r => r.data);
export const getDashboardMetrics = () => api.get("/dashboard/metrics").then(r => r.data);
export const getKnowledgeMap = () => api.get("/dashboard/knowledge-map").then(r => r.data);
export const getKnowledgeGaps = () => api.get("/dashboard/gaps").then(r => r.data);
export const getPredictiveInsights = () => api.get("/dashboard/insights").then(r => r.data);
export const getDomainTypes = () => api.get("/domains/types").then(r => r.data);
export const getDomains = () => api.get("/domains").then(r => r.data);
export const createDomain = d => api.post("/domains", d).then(r => r.data);
export const deleteDomain = id => api.delete(`/domains/${id}`).then(r => r.data);
export const getMembers = () => api.get("/hr/members").then(r => r.data);
export const addMember = d => api.post("/hr/members", d).then(r => r.data);
export const bulkUploadCSV = file => { const f = new FormData(); f.append("file", file); return api.post("/hr/bulk-upload", f).then(r => r.data); };
export const getUsers = () => api.get("/admin/users").then(r => r.data);
export const createUser = d => api.post("/admin/users", d).then(r => r.data);
export const updateUser = (id, d) => api.put(`/admin/users/${id}`, d).then(r => r.data);
export const deleteUser = id => api.delete(`/admin/users/${id}`).then(r => r.data);
export const getAuditTrail = () => api.get("/admin/audit-trail").then(r => r.data);
export const getKnowledgeMapDocuments = async () => {
  const response = await api.get('/knowledge-map/documents');
  return response.data;
};

export const activateAccount = d => api.post("/auth/activate", d).then(r => r.data);
export const resendActivation = d => api.post("/auth/resend-activation", d).then(r => r.data);
export default api;

